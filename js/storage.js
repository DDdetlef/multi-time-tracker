const storageFallback = new Map();

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return storageFallback.get(key) ?? null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    storageFallback.set(key, value);
    return false;
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    storageFallback.delete(key);
    return false;
  }
}