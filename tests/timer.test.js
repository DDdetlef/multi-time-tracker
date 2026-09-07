const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadTimer() {
  const elements = new Map();
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
    performance: { now: () => 0 },
    setInterval: () => 1,
    speakers: [],
    window: { addEventListener() {} }
  });
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'timer.js'), 'utf8');

  vm.runInContext(source, context);
  return { context, elements };
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

test('shows resume after a timer has been paused', () => {
  const { context, elements } = loadTimer();
  const runningClasses = new Set();
  const timerBlock = {
    classList: {
      toggle(className, enabled) {
        runningClasses[enabled ? 'add' : 'delete'](className);
      }
    }
  };
  const button = {
    classList: { toggle() {} },
    closest: () => timerBlock,
    disabled: false,
    setAttribute() {},
    textContent: 'Start'
  };
  const timerElement = {
    className: '',
    closest: () => ({ querySelector: () => button }),
    textContent: ''
  };
  elements.set('timer1', timerElement);

  call(context, "timers['1'] = { endTime: null, hasStarted: false, initialMs: 900000, interval: null, lastDisplayState: null, lastDisplayText: null, remainingMs: 900000, running: false }");
  call(context, "toggleTimer('1')");
  assert.equal(button.textContent, 'Stop');
  assert.equal(runningClasses.has('running'), true);

  call(context, "toggleTimer('1')");
  assert.equal(button.textContent, 'Fortsetzen');
  assert.equal(runningClasses.has('running'), false);
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
    closest: () => ({ querySelector: () => button }),
    textContent: ''
  };
  const stopAllButton = { disabled: false };
  elements.set('timer1', timerElement);
  elements.set('stop-all-timers', stopAllButton);

  call(context, "timers['1'] = { endTime: null, initialMs: 900000, interval: 1, lastDisplayState: null, lastDisplayText: null, remainingMs: NaN, running: true }");
  call(context, "updateTimerDisplay('1', true)");

  assert.equal(call(context, "timers['1'].remainingMs"), 900000);
  assert.equal(call(context, "timers['1'].running"), false);
  assert.equal(call(context, "timers['1'].endTime"), null);
  assert.equal(call(context, "timers['1'].interval"), null);
  assert.equal(button.textContent, 'Start');
  assert.equal(stopAllButton.disabled, true);
  assert.equal(timerElement.textContent, '15 : 00');
});