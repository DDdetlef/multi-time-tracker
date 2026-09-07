// js/timer.js
const TIMER_REFRESH_MS = 100;
const WARNING_THRESHOLD_MS = 60_000;

let timers = {};

function initTimers() {
  stopAllTimers();
  timers = {};

  if (!Array.isArray(speakers)) {
    console.error('Timer initialization failed: speakers is not an array.');
    return;
  }

  speakers.forEach((speaker) => {
    const initialMs = Number(speaker.time) * 1000;

    if (!Number.isFinite(initialMs) || initialMs < 0) {
      console.warn(`Timer ${speaker.id} was skipped because its duration is invalid.`);
      return;
    }

    timers[speaker.id] = {
      interval: null,
      initialMs,
      remainingMs: initialMs,
      endTime: null,
      running: false,
      lastDisplayText: null,
      lastDisplayState: null
    };

    updateTimerDisplay(speaker.id, true);
  });

  updateStopAllButton();
}

function stopAllTimers() {
  const now = performance.now();

  Object.entries(timers).forEach(([id, timer]) => {
    if (!timer) {
      return;
    }

    if (timer.running && Number.isFinite(timer.endTime)) {
      timer.remainingMs = timer.endTime - now;
    }

    if (timer.interval !== null) {
      clearInterval(timer.interval);
    }

    timer.interval = null;
    timer.endTime = null;
    timer.running = false;

    updateTimerButton(id, false);
    updateTimerDisplay(id, true);
  });

  updateStopAllButton();
}

function updateTimerDisplay(id, force = false) {
  const timer = timers[id];
  const timerElement = document.getElementById(`timer${id}`);

  if (!timer || !timerElement) {
    return;
  }

  if (timer.running && Number.isFinite(timer.endTime)) {
    timer.remainingMs = timer.endTime - performance.now();
  }

  if (!Number.isFinite(timer.remainingMs)) {
    console.error(`Timer ${id} has an invalid remaining time and was stopped.`);
    stopTimerSafely(timer);
    timer.remainingMs = Number.isFinite(timer.initialMs) ? timer.initialMs : 0;
    updateTimerButton(id, false);
    updateStopAllButton();
    updateTimerDisplay(id, true);
    return;
  }

  const displaySeconds = getDisplaySeconds(timer.remainingMs);
  const absoluteSeconds = Math.abs(displaySeconds);
  const minutes = Math.floor(absoluteSeconds / 60);
  const seconds = absoluteSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  const displayText = displaySeconds < 0 ? `− ${formattedTime}` : formattedTime;
  const displayState = getDisplayState(timer.remainingMs);
  const previousDisplayState = timer.lastDisplayState;

  if (force || displayText !== timer.lastDisplayText) {
    timerElement.textContent = displayText;
    timer.lastDisplayText = displayText;
  }

  if (force || displayState !== timer.lastDisplayState) {
    timerElement.className = `timer${displayState === 'normal' ? '' : ` ${displayState}`}`;
    timer.lastDisplayState = displayState;
  }

  if (previousDisplayState !== null && displayState !== previousDisplayState) {
    announceTimerState(id, displayState);
  }
}

function announceTimerState(id, displayState) {
  const statusElement = document.getElementById('timer-status');
  if (!statusElement) {
    return;
  }

  const stateLabels = {
    normal: 'läuft wieder im normalen Zeitbereich',
    warning: 'ist in der letzten Minute',
    overtime: 'ist in der Überzeit'
  };

  statusElement.textContent = `Timer ${id} ${stateLabels[displayState]}.`;
}

function getDisplayState(remainingMs) {
  if (remainingMs <= -1000) {
    return 'overtime';
  }

  if (remainingMs < WARNING_THRESHOLD_MS) {
    return 'warning';
  }

  return 'normal';
}

function getDisplaySeconds(remainingMs) {
  if (remainingMs >= 0) {
    return Math.ceil(remainingMs / 1000);
  }

  if (remainingMs > -1000) {
    return 0;
  }

  return -Math.floor(Math.abs(remainingMs) / 1000);
}

function toggleTimer(id) {
  const timer = timers[id];
  const button = getTimerButton(id);

  if (!timer || !button || button.disabled) {
    return;
  }

  button.disabled = true;

  try {
    if (timer.running) {
      pauseTimer(id, timer);
    } else {
      startTimer(id, timer);
    }
  } finally {
    button.disabled = false;
  }
}

function startTimer(id, timer) {
  if (!timer || timer.running || !Number.isFinite(timer.remainingMs)) {
    return;
  }

  if (timer.interval !== null) {
    clearInterval(timer.interval);
    timer.interval = null;
  }

  timer.endTime = performance.now() + timer.remainingMs;
  timer.running = true;
  updateTimerButton(id, true);

  timer.interval = setInterval(() => {
    if (!timer.running || !Number.isFinite(timer.endTime)) {
      clearInterval(timer.interval);
      timer.interval = null;
      return;
    }

    updateTimerDisplay(id);
  }, TIMER_REFRESH_MS);

  updateTimerDisplay(id, true);
  updateStopAllButton();
}

function pauseTimer(id, timer) {
  if (!timer || !timer.running) {
    return;
  }

  if (Number.isFinite(timer.endTime)) {
    timer.remainingMs = timer.endTime - performance.now();
  }

  stopTimerSafely(timer);
  updateTimerButton(id, false);
  updateTimerDisplay(id, true);
  updateStopAllButton();
}

function stopTimerSafely(timer) {
  if (timer.interval !== null) {
    clearInterval(timer.interval);
  }

  timer.interval = null;
  timer.endTime = null;
  timer.running = false;
}

function adjustTime(id, seconds) {
  const timer = timers[id];
  const adjustmentMs = Number(seconds) * 1000;

  if (!timer || !Number.isFinite(adjustmentMs)) {
    return;
  }

  if (timer.running && Number.isFinite(timer.endTime)) {
    timer.endTime += adjustmentMs;
    timer.remainingMs = timer.endTime - performance.now();
  } else {
    timer.remainingMs += adjustmentMs;
  }

  updateTimerDisplay(id, true);
}

function resetTimer(id) {
  const timer = timers[id];

  if (!timer || !Number.isFinite(timer.initialMs)) {
    return;
  }

  stopTimerSafely(timer);
  timer.remainingMs = timer.initialMs;
  updateTimerButton(id, false);
  updateTimerDisplay(id, true);
  updateStopAllButton();
}

function updateTimerButton(id, running) {
  const button = getTimerButton(id);

  if (!button) {
    return;
  }

  const label = running ? 'Stop' : 'Start';
  if (button.textContent !== label) {
    button.textContent = label;
  }

  button.classList.toggle('running', running);
  button.setAttribute('aria-pressed', String(running));
}

function getTimerButton(id) {
  const timerElement = document.getElementById(`timer${id}`);
  return timerElement?.closest('.timer-block')?.querySelector('.btn-timer') || null;
}

function hasRunningTimers() {
  return Object.values(timers).some((timer) => timer?.running === true);
}

function updateStopAllButton() {
  const button = document.getElementById('stop-all-timers');
  if (!button) {
    return;
  }

  button.disabled = !hasRunningTimers();
}

function refreshRunningTimers() {
  Object.entries(timers).forEach(([id, timer]) => {
    if (timer?.running) {
      updateTimerDisplay(id, true);
    }
  });

  updateStopAllButton();
}

document.getElementById('stop-all-timers')?.addEventListener('click', stopAllTimers);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    refreshRunningTimers();
  }
});

window.addEventListener('pageshow', refreshRunningTimers);
