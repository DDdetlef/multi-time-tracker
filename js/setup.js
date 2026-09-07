// js/setup.js
let speakers = [];
let defaultTime = 15 * 60;

// Setup Screen Elements
const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const speakerCountSelect = document.getElementById('speaker-count');
const speakerNamesContainer = document.getElementById('speaker-names-container');
const defaultTimeInput = document.getElementById('default-time');
const setupInfoText = document.getElementById('setup-info-text');
const setupLogoRemoveBtn = document.getElementById('setup-logo-remove-btn');
const logoUploadInput = document.getElementById('logo-upload');

// Event Listeners
speakerCountSelect.addEventListener('change', updateSpeakerInputs);
document.getElementById('event-title').addEventListener('input', (e) => {
  document.getElementById('header-title').textContent = e.target.value || 'Veranstaltungstitel';
});

// ✅ Automatisches Speichern beim Tippen
setupInfoText.addEventListener('input', () => {
  saveInfoText();
});

// Initialize
updateSpeakerInputs();
loadAllData();

// Functions
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
      <button class="btn-timer" onclick="toggleTimer(${speaker.id})">Start</button>
      <div class="test-controls">
        <button class="btn-test" onclick="adjustTime(${speaker.id}, 60)">+1 Min</button>
        <button class="btn-test" onclick="adjustTime(${speaker.id}, -60)">-1 Min</button>
        <button class="btn-test" onclick="resetTimer(${speaker.id})">Reset</button>
      </div>
    `;
    timerGrid.appendChild(block);
  });

  // Info-Block in Timer-Screen füllen (mit textContent für Sicherheit)
  const infoTextDisplay = document.getElementById('info-text-display');
  infoTextDisplay.textContent = setupInfoText.value.trim() || 'Zusätzliche Veranstaltungsinformationen';

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

// Info-Text laden (aus localStorage)
function loadInfoText() {
  const savedInfo = localStorage.getItem('infoBlockContent');
  if (savedInfo) {
    setupInfoText.value = savedInfo;
  }
}

// Info-Text speichern
function saveInfoText() {
  localStorage.setItem('infoBlockContent', setupInfoText.value);
}

// ✅ KORRIGIERTE Logo-Entfernung: Logo komplett entfernen
function removeLogo() {
  const setupLogo = document.getElementById('setup-info-logo');
  setupLogo.removeAttribute('src'); // src entfernen
  setupLogo.classList.add('hidden'); // Bild verstecken
  
  // Timer-Logo aktualisieren (wenn generiert)
  const infoLogo = document.getElementById('info-logo');
  if (infoLogo) {
    infoLogo.removeAttribute('src');
    infoLogo.classList.add('hidden');
  }
  
  // Logo-URL aus localStorage entfernen
  localStorage.removeItem('infoBlockLogoUrl');
  
  // Dateifeld leeren
  logoUploadInput.value = '';
  