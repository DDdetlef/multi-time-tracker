// js/app.js
// Haupt-App-Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  console.log('Multi Time Tracker initialized');
  
  // Logo-URL aus localStorage laden
  const savedLogoUrl = localStorage.getItem('infoBlockLogoUrl');
  if (savedLogoUrl) {
    document.getElementById('setup-info-logo').src = savedLogoUrl;
    document.getElementById('info-logo').src = savedLogoUrl;
  }
  
  // Sichtbarkeitsstatus beim Laden wiederherstellen
  const isHidden = localStorage.getItem('infoBlockHidden') === 'true';
  if (isHidden) {
    toggleInfoBlock(); // Toggle aufrufen, um Status wiederherzustellen
  }
});

// Kritische Funktion: Info-Block anzeigen/verstecken (nur im Setup!)
function toggleInfoBlock() {
  const setupInfoBlock = document.getElementById('setup-info-text').closest('.form-group');
  
  // NUR den Inhalt verstecken, nicht die gesamte .form-group
  const setupInfoContent = document.getElementById('setup-info-text');
  const setupLogoSection = setupInfoBlock.querySelector('.logo-upload-section');
  
  // ✅ Stabile Synchronisation mit classList.toggle(..., isHidden)
  const isHidden = setupInfoContent.classList.contains('hidden');
  const newHiddenState = !isHidden;
  
  // Beide Blöcke umschalten (Setup + Timer)
  setupInfoContent.classList.toggle('hidden', newHiddenState);
  setupLogoSection.classList.toggle('hidden', newHiddenState);
  
  // Timer-Info-Block auch umschalten
  const infoBlock = document.getElementById('info-block');
  const infoContent = document.getElementById('info-content');
  const infoLogoSection = infoBlock.querySelector('.logo-preview-container');
  
  infoContent.classList.toggle('hidden', newHiddenState);
  infoLogoSection.classList.toggle('hidden', newHiddenState);
  
  // Gesamten Info-Block im Timer-Screen ausblenden
  infoBlock.classList.toggle('hidden', newHiddenState);
  
  // Status speichern
  localStorage.setItem('infoBlockHidden', newHiddenState);
  
  // Icon aktualisieren (nur Setup-Button!)
  updateToggleIcon(newHiddenState);
}

// Icon für Anzeigen/Ausblenden aktualisieren (nur Setup-Button!)
function updateToggleIcon(isHidden) {
  const toggleBtn = document.querySelector('.btn-info-toggle');
  toggleBtn.textContent = isHidden ? '👁️‍🗨️' : '👁️';
}

// Dateiauswahl für Logo
function handleLogoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Setup-Logo aktualisieren
      const setupLogo = document.getElementById('setup-info-logo');
      setupLogo.src = e.target.result;
      setupLogo.classList.remove('hidden'); // Bild anzeigen
      
      // Timer-Logo aktualisieren (wenn generiert)
      const infoLogo = document.getElementById('info-logo');
      if (infoLogo) {
        infoLogo.src = e.target.result;
        infoLogo.classList.remove('hidden');
      }
      
      // Logo-URL speichern
      localStorage.setItem('infoBlockLogoUrl', e.target.result);
      
      // Logo-Entfernen-Button anzeigen
      setupLogoRemoveBtn.style.display = 'block';
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

// Setup zurücksetzen (ohne Einfrieren)
function goBackToSetup() {
  // Timer-Screen ausblenden
  const timerScreen = document.getElementById('timer-screen');
  timerScreen.style.display = 'none';
  
  // Setup-Screen einblenden
  const setupScreen = document.getElementById('setup-screen');
  setupScreen.style.display = 'block';
  
  // Alle Eingabefelder wiederherstellen (nicht nur Info-Block)
  const setupInfoContent = document.getElementById('setup-info-text');
  const setupLogoSection = document.getElementById('setup-info-text').closest('.form-group').querySelector('.logo-upload-section');
  
  // Info-Block Status wiederherstellen
  const isHidden = localStorage.getItem('infoBlockHidden') === 'true';
  
  if (isHidden) {
    setupInfoContent.classList.add('hidden');
    setupLogoSection.classList.add('hidden');
    updateToggleIcon(true);
    
    // Timer-Info-Block auch ausblenden
    const infoBlock = document.getElementById('info-block');
    const infoContent = document.getElementById('info-content');
    const infoLogoSection = infoBlock.querySelector('.logo-preview-container');
    
    infoContent.classList.add('hidden');
    infoLogoSection.classList.add('hidden');
    infoBlock.classList.add('hidden');
  } else {
    setupInfoContent.classList.remove('hidden');
    setupLogoSection.classList.remove('hidden');
    updateToggleIcon(false);
    
    // Timer-Info-Block auch einblenden
    const infoBlock = document.getElementById('info-block');
    const infoContent = document.getElementById('info-content');
    const infoLogoSection = infoBlock.querySelector('.logo-preview-container');
    
    infoContent.classList.remove('hidden');
    infoLogoSection.classList.remove('hidden');
    infoBlock.classList.remove('hidden');
  }
  
  // Logo-URL wiederherstellen
  const savedLogoUrl = localStorage.getItem('infoBlockLogoUrl');
  if (savedLogoUrl) {
    document.getElementById('setup-info-logo').src = savedLogoUrl;
    document.getElementById('info-logo').src = savedLogoUrl;
    setupLogoRemoveBtn.style.display = 'block';
  } else {
    setupLogoRemoveBtn.style.display = 'none';
  }
}