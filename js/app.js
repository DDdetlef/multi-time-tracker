// js/app.js
document.getElementById('back-to-setup').addEventListener('click', goBackToSetup);

function goBackToSetup() {
  if (typeof stopAllTimers === 'function') {
    stopAllTimers();
  }

  timerScreen.hidden = true;
  setupScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: 'auto' });
}
