const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadStorage(localStorage) {
  const context = vm.createContext({ localStorage });
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'storage.js'), 'utf8');

  vm.runInContext(source, context);
  return context;
}

test('uses localStorage when it is available', () => {
  const values = new Map();
  const context = loadStorage({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  });

  assert.equal(context.setStoredValue('info', 'text'), true);
  assert.equal(context.getStoredValue('info'), 'text');
  assert.equal(context.removeStoredValue('info'), true);
  assert.equal(context.getStoredValue('info'), null);
});

test('continues in memory when localStorage throws', () => {
  const unavailableStorage = {
    getItem() { throw new Error('Storage unavailable'); },
    setItem() { throw new Error('Storage unavailable'); },
    removeItem() { throw new Error('Storage unavailable'); }
  };
  const context = loadStorage(unavailableStorage);

  assert.equal(context.setStoredValue('info', 'text'), false);
  assert.equal(context.getStoredValue('info'), 'text');
  assert.equal(context.removeStoredValue('info'), false);
  assert.equal(context.getStoredValue('info'), null);
});