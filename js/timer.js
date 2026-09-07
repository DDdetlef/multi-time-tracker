// js/timer.js
let timers = {};

function initTimers() {
  timers = {};
  speakers.forEach(speaker => {
    timers[speaker.id] = {
      interval: null,
      time: speaker.time,
      running: false
    };
    updateTimerDisplay(speaker.id);
  });
}

function updateTimerDisplay(id) {
  const timer = timers[id];
  const timerEl = document.getElementById(`timer${id}`);
  let display;
  let className = 'timer';

  if (timer.time >= 0) {
    const minutes = Math.floor(timer.time / 60);
    const seconds = timer.time % 60;
    display = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    if (timer.time <= 59 && timer.time > 0) {
      className = 'timer warning';
    }
  } else {
    const absTime = Math.abs(timer.time);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    display = `− ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    className = 'timer overtime';
  }

  timerEl.textContent = display;
  timerEl.style.fontSize = "72px";
  timerEl.style.fontWeight = "300";
  timerEl.style.fontFamily = "'Courier New', 'Consolas', monospace";
  timerEl.style.letterSpacing = "3px";
  timerEl.style.lineHeight = "1";
  timerEl.style.minWidth = "220px";
  timerEl.style.textAlign = "center";
  timerEl.className = className;

  if (className.includes('warning')) {
    timerEl.style.color = "#faec04";
    timerEl.style.textShadow = "0 0 20px rgba(250, 236, 4, 0.5)";
  } else if (className.includes('overtime')) {
    timerEl.style.color = "#bb3f17";
    timerEl.style.textShadow = "0 0 20px rgba(187, 63, 23, 0.5)";
  } else {
    timerEl.style.color = "#fff";
    timerEl.style.textShadow = "0 0 20px rgba(255, 255, 255, 0.3)";
  }
}

function toggleTimer(id) {
  const timer = timers[id];
  const button = document.querySelector(`#timer${id}`).closest('.timer-block').querySelector('.btn-timer');

  if (timer.running) {
    clearInterval(timer.interval);
    timer.running = false;
    button.textContent = 'Start';
    button.classList.remove('running');
  } else {
    timer.interval = setInterval(() => {
      timer.time--;
      updateTimerDisplay(id);
    }, 1000);
    timer.running = true;
    button.textContent = 'Stop';
    button.classList.add('running');
  }
  updateTimerDisplay(id);
}

function adjustTime(id, seconds) {
  const timer = timers[id];
  timer.time += seconds;
  if (timer.time < 0) timer.time = 0;
  updateTimerDisplay(id);
}

function resetTimer(id) {
  const timer = timers[id];
  if (timer.running) {
    clearInterval(timer.interval);
    timer.running = false;
    const button = document.querySelector(`#timer${id}`).closest('.timer-block').querySelector('.btn-timer');
    button.textContent = 'Start';
    button.classList.remove('running');
  }
  timer.time = speakers.find(s => s.id === id).time;
  updateTimerDisplay(id);
}