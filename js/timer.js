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
      hasStarted: false,
      name: speaker.name,
      lastDisplayText: null,
      lastDisplayState: null,
      lastStatus: null,
      lastBlockState: null,
      lastButtonRunning: null
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
    timer.hasStarted = false;
    updateTimerDisplay(id, true);
    updateStopAllButton();
    return;
  }

  const displaySeconds = getDisplaySeconds(timer.remainingMs);
  const absoluteSeconds = Math.abs(displaySeconds);
  const minutes = Math.floor(absoluteSeconds / 60);
  const seconds = absoluteSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  const displayText = displaySeconds < 0 ? `− ${formattedTime}` : formattedTime;
  const displayState = getDisplayState(timer.remainingMs);
  const status = getTimerStatus(timer, displayState);
  const previousStatus = timer.lastStatus;

  if (force || displayText !== timer.lastDisplayText) {
    timerElement.textContent = displayText;
    timer.lastDisplayText = displayText;
  }

  if (force || displayState !== timer.lastDisplayState) {
    timerElement.className = `timer${displayState === 'normal' ? '' : ` ${displayState}`}`;
    timer.lastDisplayState = displayState;
  }

  updateTimerBlock(id, timer, displayState);
  updateTimerButton(id, timer.running);
  updateTimerStatus(id, status, previousStatus);

  if (previousStatus !== null && status !== previousStatus) {
    announceTimerState(timer.name || `Timer ${id}`, status);
  }

  timer.lastStatus = status;
}

function getTimerStatus(timer, displayState) {
  if (displayState === 'overtime') {
    return 'overtime';
  }

  if (displayState === 'warning' && timer.hasStarted) {
    return 'warning';
  }

  if (timer.running) {
    return 'running';
  }

  return timer.hasStarted ? 'paused' : 'ready';
}

function updateTimerBlock(id, timer, displayState) {
  const block = document.getElementById(`timer-block-${id}`);
  const blockState = `${displayState}-${timer.running}`;
  if (!block || timer.lastBlockState === blockState) {
    return;
  }

  block.classList.toggle('running', timer.running && displayState === 'normal');
  block.classList.toggle('warning', displayState === 'warning');
  block.classList.toggle('overtime', displayState === 'overtime');
  timer.lastBlockState = blockState;
}

function updateTimerStatus(id, status, previousStatus) {
  const statusElement = document.getElementById(`timer-state-${id}`);
  if (!statusElement || previousStatus === status) {
    return;
  }

  const labels = {
    ready: 'Bereit',
    running: 'Läuft',
    paused: 'Pausiert',
    warning: 'Letzte Minute',
    overtime: 'Zeit überschritten'
  };
  statusElement.textContent = labels[status];
}

function announceTimerState(name, status) {
  const statusElement = document.getElementById('timer-status');
  if (!statusElement) {
    return;
  }

  const stateLabels = {
    ready: 'ist bereit',
    running: 'läuft',
    paused: 'ist pausiert',
    warning: 'ist in der letzten Minute',
    overtime: 'hat die Zeit überschritten'
  };

  statusElement.textContent = `${name} ${stateLabels[status]}.`;
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
  timer.hasStarted = true;

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
  timer.hasStarted = false;
  updateTimerDisplay(id, true);
  updateStopAllButton();
}

function updateTimerButton(id, running) {
  const button = getTimerButton(id);
  const timer = timers[id];

  if (!button) {
    return;
  }

  const name = timer?.name || `Timer ${id}`;
  const label = `${name} ${running ? 'stoppen' : 'starten'}`;
  if (button.textContent !== label) {
    button.textContent = label;
  }

  if (timer?.lastButtonRunning !== running) {
    button.classList.toggle('running', running);
    button.setAttribute('aria-pressed', String(running));
    timer.lastButtonRunning = running;
  }
}

function getTimerButton(id) {
  return document.getElementById(`timer-control-${id}`);
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
