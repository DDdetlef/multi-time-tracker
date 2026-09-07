const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function source(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

test('keeps displays and controls in separate structures', () => {
  const index = source('index.html');
  const setup = source('js/setup.js');

  assert.match(index, /id="control-panel"/);
  assert.match(index, /id="timer-controls"/);
  assert.match(index, /id="stop-all-timers"/);
  assert.doesNotMatch(index, /info-block|info-toggle|logo-upload|storage\.js/);
  assert.match(setup, /block\.append\(name, timer, status\)/);
  assert.match(setup, /timerControls\.appendChild\(createTimerControls/);
  assert.match(setup, /timer-control-\$\{speaker\.id\}/);
});

test('creates test actions only in test mode', () => {
  const setup = source('js/setup.js');

  assert.match(setup, /if \(timerMode === 'test'\)/);
  assert.match(setup, /createControlButton\('\-1 Min'/);
  assert.match(setup, /createControlButton\('\+1 Min'/);
  assert.match(setup, /createControlButton\('Reset'/);
  assert.doesNotMatch(setup, /block\.append\(name, timer, status, /);
});

test('does not retain info, logo, or browser storage logic', () => {
  const files = ['index.html', 'js/setup.js', 'js/timer.js', 'js/app.js', 'README.md'];
  const combined = files.map(source).join('\n');

  assert.doesNotMatch(combined, /localStorage|infoBlock|setup-info|logo-upload|info-logo/);
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'js', 'storage.js')), false);
});