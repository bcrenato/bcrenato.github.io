// Registro do Service Worker (para PWA + Firebase Notifications)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
    .catch(err => console.error('❌ Erro ao registrar Service Worker:', err));
}

// Banner PWA opcional
const banner = document.getElementById('pwaBanner');
const btnInstall = document.getElementById('btnInstall');
const btnClose = document.getElementById('btnClose');
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (banner) banner.style.display = 'block';
});

if (btnInstall) btnInstall.addEventListener('click', async () => {
  banner.style.display = 'none';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log(choice.outcome === 'accepted' ? '📲 Instalado' : '❌ Recusado');
  }
});

if (btnClose) btnClose.addEventListener('click', () => {
  if (banner) banner.style.display = 'none';
});
