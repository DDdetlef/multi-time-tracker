// js/setup.js
let speakers = [];
let defaultTime = 15 * 60;

const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const eventTitleInput = document.getElementById('event-title');
const speakerCountSelect = document.getElementById('speaker-count');
const speakerNamesContainer = document.getElementById('speaker-names-container');
const defaultTimeInput = document.getElementById('default-time');

speakerCountSelect.addEventListener('change', updateSpeakerInputs);
eventTitleInput.addEventListener('input', () => {
  document.getElementById('header-title').textContent =
    eventTitleInput.value.trim() || 'Veranstaltungstitel';
});
document.getElementById('generate-timers').addEventListener('click', generateTimers);

updateSpeakerInputs();

function updateSpeakerInputs() {
  const previousNames = Array.from(
    speakerNamesContainer.querySelectorAll('.speaker-name-input')
  ).map((input) => input.value);

  const count = Number.parseInt(speakerCountSelect.value, 10);
  speakerNamesContainer.replaceChildren();

  for (let index = 0; index < count; index += 1) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'speaker-name-input';
    input.placeholder = `Sprecher:in ${index + 1} (Name)`;
    input.id = `speaker-name-${index}`;
    input.value = previousNames[index] || '';
    input.setAttribute('aria-label', `Name Sprecher:in ${index + 1}`);
    speakerNamesContainer.appendChild(input);
  }
}

function generateTimers() {
  const count = Number.parseInt(speakerCountSelect.value, 10);
  const minutes = Number.parseInt(defaultTimeInput.value, 10);
  const timerMode = document.querySelector('input[name="timer-mode"]:checked')?.value || 'live';

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
    defaultTimeInput.focus();
    window.alert('Bitte eine ganze Redezeit zwischen 1 und 120 Minuten eingeben.');
    return;
  }

  defaultTime = minutes * 60;
  speakers = [];

  for (let index = 0; index < count; index += 1) {
    const nameInput = document.getElementById(`speaker-name-${index}`);
    speakers.push({
      id: index + 1,
      name: nameInput.value.trim() || `Sprecher:in ${index + 1}`,
      time: defaultTime
    });
  }

  document.getElementById('header-title').textContent =
    eventTitleInput.value.trim() || 'Veranstaltungstitel';

  const timerGrid = document.getElementById('timer-grid');
  const timerControls = document.getElementById('timer-controls');
  timerGrid.replaceChildren();
  timerControls.replaceChildren();

  speakers.forEach((speaker) => {
    const block = document.createElement('section');
    block.className = 'timer-block';
    block.id = `timer-block-${speaker.id}`;

    const name = document.createElement('div');
    name.className = 'speaker-name';
    name.textContent = speaker.name;

    const timer = document.createElement('div');
    timer.className = 'timer';
    timer.id = `timer${speaker.id}`;
    timer.textContent = formatTime(speaker.time);
    timer.setAttribute('aria-live', 'off');

    const status = document.createElement('p');
    status.className = 'timer-state';
    status.id = `timer-state-${speaker.id}`;
    status.textContent = 'Bereit';

    block.append(name, timer, status);

    timerGrid.appendChild(block);
    timerControls.appendChild(createTimerControls(speaker, timerMode));
  });

  setupScreen.hidden = true;
  timerScreen.hidden = false;
  initTimers();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function createTimerControls(speaker, timerMode) {
  const controls = document.createElement('section');
  controls.className = 'timer-control-row';
  controls.setAttribute('aria-label', `Steuerung für ${speaker.name}`);

  const name = document.createElement('h3');
  name.className = 'control-speaker-name';
  name.textContent = speaker.name;

  const actions = document.createElement('div');
  actions.className = 'control-actions';

  const toggleButton = createControlButton(`${speaker.name} starten`, () => toggleTimer(speaker.id));
  toggleButton.id = `timer-control-${speaker.id}`;
  toggleButton.classList.add('btn-timer');
  toggleButton.setAttribute('aria-pressed', 'false');
  actions.appendChild(toggleButton);

  if (timerMode === 'test') {
    const testActions = document.createElement('div');
    testActions.className = 'test-controls';
    testActions.append(
      createControlButton('-1 Min', () => adjustTime(speaker.id, -60)),
      createControlButton('+1 Min', () => adjustTime(speaker.id, 60)),
      createControlButton('Reset', () => resetTimer(speaker.id))
    );
    actions.appendChild(testActions);
  }

  controls.append(name, actions);
  return controls;
}

function createControlButton(label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-test';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')} : ${String(remainingSeconds).padStart(2, '0')}`;
}
