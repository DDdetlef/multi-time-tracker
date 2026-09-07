// js/setup.js
let speakers = [];
let timeOption = 'all';
let defaultTime = 15 * 60;

// Setup Screen Elements
const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const speakerCountSelect = document.getElementById('speaker-count');
const speakerNamesContainer = document.getElementById('speaker-names-container');
const timeOptionElements = document.querySelectorAll('.time-option');
const timeLabel = document.getElementById('time-label');
const defaultTimeInput = document.getElementById('default-time');

// Event Listeners
speakerCountSelect.addEventListener('change', updateSpeakerInputs);
document.getElementById('event-title').addEventListener('input', (e) => {
  document.getElementById('header-title').textContent = e.target.value || 'Veranstaltungstitel';
});

// Initialize
updateSpeakerInputs();

// Functions
function selectTimeOption(option) {
  timeOption = option;
  timeOptionElements.forEach(el => el.classList.remove('selected'));
  event.target.classList.add('selected');

  if (option === 'all') {
    timeLabel.textContent = 'Standardzeit pro Sprecher (Minuten)';
    defaultTimeInput.disabled = false;
  } else {
    timeLabel.textContent = 'Zeit pro Sprecher (Minuten) - wird in der nächsten Phase gesetzt';
    defaultTimeInput.disabled = true;
  }
}

function updateSpeakerInputs() {
  const count = parseInt(speakerCountSelect.value);
  speakerNamesContainer.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'speaker-name-input';
    input.placeholder = `Sprecher:in ${i + 1} (Name)`;
    input.id = `speaker-name-${i}`;
    speakerNamesContainer.appendChild(input);
  }
}

function generateTimers() {
  const eventTitle = document.getElementById('event-title').value;
  const count = parseInt(speakerCountSelect.value);
  const defaultMinutes = parseInt(defaultTimeInput.value) || 15;
  defaultTime = defaultMinutes * 60;

  // Get speaker names
  speakers = [];
  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`speaker-name-${i}`).value.trim() || `Sprecher ${i + 1}`;
    speakers.push({
      id: i + 1,
      name: name,
      time: defaultTime
    });
  }

  // Update header
  document.getElementById('header-title').textContent = eventTitle || 'Veranstaltungstitel';

  // Generate timer blocks
  const timerGrid = document.getElementById('timer-grid');
  timerGrid.innerHTML = '';

  speakers.forEach((speaker, index) => {
    const block = document.createElement('div');
    block.className = 'timer-block';
    block.innerHTML = `
      <div class="speaker-name">${speaker.name}</div>
      <div class="timer" id="timer${speaker.id}">${formatTime(speaker.time)}</div>
      <button class="btn" onclick="toggleTimer(${speaker.id})">Start</button>
      <div class="test-controls">
        <button class="btn-test" onclick="adjustTime(${speaker.id}, 60)">+1 Min</button>
        <button class="btn-test" onclick="adjustTime(${speaker.id}, -60)">-1 Min</button>
        <button class="btn-test" onclick="resetTimer(${speaker.id})">Reset</button>
      </div>
    `;
    timerGrid.appendChild(block);
  });

  // Show timer screen
  setupScreen.style.display = 'none';
  timerScreen.style.display = 'block';

  // Initialize timers
  initTimers();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
}