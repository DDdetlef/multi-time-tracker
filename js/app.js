// js/app.js
const DEFAULT_INFO_LOGO = 'assets/logo_infoblock.png';
const LOGO_URL_KEY = 'infoBlockLogoUrl';
const LOGO_REMOVED_KEY = 'infoBlockLogoRemoved';
const INFO_HIDDEN_KEY = 'infoBlockHidden';

const infoToggleButton = document.getElementById('info-toggle');
const setupInfoBody = document.getElementById('setup-info-body');
const timerInfoBlock = document.getElementById('info-block');
const logoInput = document.getElementById('logo-upload');
const setupLogo = document.getElementById('setup-info-logo');
const timerLogo = document.getElementById('info-logo');
const setupLogoPreview = document.getElementById('logo-preview-container');
const timerLogoPreview = document.getElementById('timer-logo-container');
const removeLogoButton = document.getElementById('setup-logo-remove-btn');
const headerClock = document.getElementById('header-clock');

infoToggleButton.addEventListener('click', toggleInfoBlock);
logoInput.addEventListener('change', handleLogoUpload);
removeLogoButton.addEventListener('click', removeLogo);
document.getElementById('back-to-setup').addEventListener('click', goBackToSetup);

restoreLogo();
applyInfoBlockState();
updateHeaderClock();
window.setInterval(updateHeaderClock, 60_000);

function updateHeaderClock() {
  if (!headerClock) {
    return;
  }

  const now = new Date();
  headerClock.dateTime = now.toTimeString().slice(0, 5);
  headerClock.textContent = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function toggleInfoBlock() {
  const currentlyHidden = getStoredValue(INFO_HIDDEN_KEY) === 'true';
  setStoredValue(INFO_HIDDEN_KEY, String(!currentlyHidden));
  applyInfoBlockState();
}

function applyInfoBlockState() {
  const isHidden = getStoredValue(INFO_HIDDEN_KEY) === 'true';

  setupInfoBody.classList.toggle('hidden', isHidden);
  timerInfoBlock.classList.toggle('hidden', isHidden);
  infoToggleButton.textContent = isHidden ? 'Anzeigen' : 'Ausblenden';
  infoToggleButton.setAttribute('aria-expanded', String(!isHidden));
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    window.alert('Bitte eine PNG- oder JPEG-Datei auswählen.');
    logoInput.value = '';
    return;
  }

  if (file.size > 1_000_000) {
    window.alert('Bitte ein Logo mit maximal 1 MB auswählen.');
    logoInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const logoUrl = String(reader.result);

    const logoSaved = setStoredValue(LOGO_URL_KEY, logoUrl);
    const removalFlagCleared = removeStoredValue(LOGO_REMOVED_KEY);
    showLogo(logoUrl);

    if (!logoSaved || !removalFlagCleared) {
      window.alert('Das Logo wird nur bis zum Neuladen angezeigt, weil der Browser-Speicher nicht verfügbar ist.');
    }
  });
  reader.readAsDataURL(file);
}

function removeLogo() {
  removeStoredValue(LOGO_URL_KEY);
  setStoredValue(LOGO_REMOVED_KEY, 'true');
  logoInput.value = '';
  hideLogo();
}

function restoreLogo() {
  const removed = getStoredValue(LOGO_REMOVED_KEY) === 'true';
  const savedLogoUrl = getStoredValue(LOGO_URL_KEY);

  if (removed) {
    hideLogo();
    return;
  }

  showLogo(savedLogoUrl || DEFAULT_INFO_LOGO);
}

function showLogo(url) {
  setupLogo.src = url;
  timerLogo.src = url;
  setupLogo.classList.remove('hidden');
  timerLogo.classList.remove('hidden');
  setupLogoPreview.classList.remove('hidden');
  timerLogoPreview.classList.remove('hidden');
  removeLogoButton.classList.remove('hidden');
}

function hideLogo() {
  setupLogo.removeAttribute('src');
  timerLogo.removeAttribute('src');
  setupLogo.classList.add('hidden');
  timerLogo.classList.add('hidden');
  setupLogoPreview.classList.add('hidden');
  timerLogoPreview.classList.add('hidden');
  removeLogoButton.classList.add('hidden');
}

function syncLogoToTimer() {
  const removed = getStoredValue(LOGO_REMOVED_KEY) === 'true';
  if (removed) {
    hideLogo();
    return;
  }

  showLogo(getStoredValue(LOGO_URL_KEY) || DEFAULT_INFO_LOGO);
}

function goBackToSetup() {
  if (!window.confirm('Möchten Sie wirklich zum Setup zurückkehren?')) {
    return;
  }

  if (typeof stopAllTimers === 'function') {
    stopAllTimers();
  }

  timerScreen.hidden = true;
  setupScreen.hidden = false;
  restoreLogo();
  applyInfoBlockState();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
