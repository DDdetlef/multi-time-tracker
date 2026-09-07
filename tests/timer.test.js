const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadTimer() {
  const elements = new Map();
  let now = 0;
  let nextIntervalId = 1;
  const document = {
    addEventListener() {},
    createElement() {
      return {
        appendChild() {},
        addEventListener() {},
        className: '',
        disabled: false,
        style: {},
        textContent: ''
      };
    },
    getElementById(id) {
      return elements.get(id) || null;
    },
    head: { appendChild() {} }
  };
  const context = vm.createContext({
    clearInterval() {},
    console,
    document,
    performance: { now: () => now },
    setInterval: () => nextIntervalId++,
    speakers: [],
    window: { addEventListener() {} }
  });
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'timer.js'), 'utf8');

  vm.runInContext(source, context);
  return {
    context,
    elements,
    setNow(value) {
      now = value;
    }
  };
}

function call(context, expression) {
  return vm.runInContext(expression, context);
}

test('classifies warning and overtime exactly at their limits', () => {
  const { context } = loadTimer();

  assert.equal(call(context, 'getDisplayState(60000)'), 'normal');
  assert.equal(call(context, 'getDisplayState(59999)'), 'warning');
  assert.equal(call(context, 'getDisplayState(-999)'), 'warning');
  assert.equal(call(context, 'getDisplayState(-1000)'), 'overtime');
});

test('rounds display seconds consistently around zero', () => {
  const { context } = loadTimer();

  assert.equal(call(context, 'getDisplaySeconds(1)'), 1);
  assert.equal(call(context, 'getDisplaySeconds(0)'), 0);
  assert.equal(call(context, 'getDisplaySeconds(-1)'), 0);
  assert.equal(call(context, 'getDisplaySeconds(-999)'), 0);
  assert.equal(call(context, 'getDisplaySeconds(-1000)'), -1);
  assert.equal(call(context, 'getDisplaySeconds(-1999)'), -1);
  assert.equal(call(context, 'getDisplaySeconds(-2000)'), -2);
});

test('renders boundary values with matching state classes', () => {
  const { context, elements } = loadTimer();
  const timerElement = { className: '', textContent: '' };
  elements.set('timer1', timerElement);

  call(context, "timers['1'] = { endTime: null, lastDisplayState: null, lastDisplayText: null, remainingMs: 60000, running: false }");
  call(context, "updateTimerDisplay('1', true)");
  assert.equal(timerElement.textContent, '01 : 00');
  assert.equal(timerElement.className, 'timer');

  call(context, "timers['1'].remainingMs = 59999; updateTimerDisplay('1', true)");
  assert.equal(timerElement.textContent, '01 : 00');
  assert.equal(timerElement.className, 'timer warning');

  call(context, "timers['1'].remainingMs = -999; updateTimerDisplay('1', true)");
  assert.equal(timerElement.textContent, '00 : 00');
  assert.equal(timerElement.className, 'timer warning');

  call(context, "timers['1'].remainingMs = -1000; updateTimerDisplay('1', true)");
  assert.equal(timerElement.textContent, '\u2212 00 : 01');
  assert.equal(timerElement.className, 'timer overtime');
});

test('recovers an invalid timer value into a stopped initial state', () => {
  const { context, elements } = loadTimer();
  const button = {
    classList: { toggle() {} },
    setAttribute() {},
    textContent: 'Stop'
  };
  const timerElement = {
    className: '',
    textContent: ''
  };
  const stopAllButton = { disabled: false };
  elements.set('timer1', timerElement);
  elements.set('timer-control-1', button);
  elements.set('stop-all-timers', stopAllButton);

  call(context, "timers['1'] = { endTime: null, initialMs: 900000, interval: 1, lastDisplayState: null, lastDisplayText: null, name: 'Anna', remainingMs: NaN, running: true }");
  call(context, "updateTimerDisplay('1', true)");

  assert.equal(call(context, "timers['1'].remainingMs"), 900000);
  assert.equal(call(context, "timers['1'].running"), false);
  assert.equal(call(context, "timers['1'].hasStarted"), false);
  assert.equal(call(context, "timers['1'].endTime"), null);
  assert.equal(call(context, "timers['1'].interval"), null);
  assert.equal(button.textContent, 'Anna starten');
  assert.equal(stopAllButton.disabled, true);
  assert.equal(timerElement.textContent, '15 : 00');
});

test('keeps central controls, display status, and card state synchronized', () => {
  const { context, elements, setNow } = loadTimer();
  const button = {
    classList: { toggle() {} },
    setAttribute() {},
    textContent: ''
  };
  const cardClasses = new Map();
  const block = {
    classList: { toggle: (name, enabled) => cardClasses.set(name, enabled) }
  };
  const timerElement = { className: '', textContent: '' };
  const timerState = { textContent: '' };
  const stopAllButton = { disabled: true };
  elements.set('timer1', timerElement);
  elements.set('timer-block-1', block);
  elements.set('timer-control-1', button);
  elements.set('timer-state-1', timerState);
  elements.set('stop-all-timers', stopAllButton);

  call(context, "timers['1'] = { endTime: null, hasStarted: false, initialMs: 60001, interval: null, lastDisplayState: null, lastDisplayText: null, lastStatus: null, name: 'Anna', remainingMs: 60001, running: false }");
  call(context, "updateTimerDisplay('1', true)");
  assert.equal(timerState.textContent, 'Bereit');
  assert.equal(button.textContent, 'Anna starten');

  call(context, "startTimer('1', timers['1'])");
  assert.equal(timerState.textContent, 'Läuft');
  assert.equal(button.textContent, 'Anna stoppen');
  assert.equal(stopAllButton.disabled, false);
  assert.equal(cardClasses.get('running'), true);

  setNow(1);
  call(context, "pauseTimer('1', timers['1'])");
  assert.equal(call(context, "timers['1'].remainingMs"), 60000);
  assert.equal(timerState.textContent, 'Pausiert');
  assert.equal(button.textContent, 'Anna starten');
  assert.equal(stopAllButton.disabled, true);
  assert.equal(cardClasses.get('running'), false);
});

test('stops all running timers without changing paused timers', () => {
  const { context, elements, setNow } = loadTimer();
  const makeButton = () => ({ classList: { toggle() {} }, setAttribute() {}, textContent: '' });
  const makeBlock = () => ({ classList: { toggle() {} } });
  const stopAllButton = { disabled: false };
  elements.set('stop-all-timers', stopAllButton);

  ['1', '2', '3'].forEach((id) => {
    elements.set(`timer${id}`, { className: '', textContent: '' });
    elements.set(`timer-block-${id}`, makeBlock());
    elements.set(`timer-control-${id}`, makeButton());
    elements.set(`timer-state-${id}`, { textContent: '' });
  });
  call(context, "timers = { '1': { endTime: 10000, hasStarted: true, initialMs: 10000, interval: 1, lastDisplayState: null, lastDisplayText: null, lastStatus: null, name: 'Anna', remainingMs: 10000, running: true }, '2': { endTime: 9000, hasStarted: true, initialMs: 9000, interval: 2, lastDisplayState: null, lastDisplayText: null, lastStatus: null, name: 'Bernd', remainingMs: 9000, running: true }, '3': { endTime: null, hasStarted: true, initialMs: 5000, interval: null, lastDisplayState: null, lastDisplayText: null, lastStatus: null, name: 'Clara', remainingMs: 4000, running: false } }");

  setNow(1250);
  call(context, 'stopAllTimers()');

  assert.equal(call(context, "timers['1'].remainingMs"), 8750);
  assert.equal(call(context, "timers['2'].remainingMs"), 7750);
  assert.equal(call(context, "timers['3'].remainingMs"), 4000);
  assert.equal(call(context, "hasRunningTimers()"), false);
  assert.equal(stopAllButton.disabled, true);
  assert.equal(elements.get('timer-control-1').textContent, 'Anna starten');
  assert.equal(elements.get('timer-control-2').textContent, 'Bernd starten');
});