importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBC73aRe7HLp-zQNpJcbWLlUj24kiQGAcE",
  authDomain: "cadastro-membros-c5cd4.firebaseapp.com",
  projectId: "cadastro-membros-c5cd4",
  storageBucket: "cadastro-membros-c5cd4.firebasestorage.app",
  messagingSenderId: "250346042791",
  appId: "1:250346042791:web:6bc469b844de69e526b282"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    image: payload.notification.image,
    data: payload.data // para link personalizado
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const link = event.notification.data?.link || event.notification.click_action;
  if (link) {
    event.waitUntil(clients.openWindow(link));
  }
});
