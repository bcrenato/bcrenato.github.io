importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCv6pzl34tyPTARtGxV6g2AJfkrtQeA-xU",
  authDomain: "cadastro-igreja-23042.firebaseapp.com",
  databaseURL: "https://cadastro-igreja-23042-default-rtdb.firebaseio.com",
  projectId: "cadastro-igreja-23042",
  storageBucket: "cadastro-igreja-23042.firebasestorage.app",
  messagingSenderId: "977906864836",
  appId: "1:977906864836
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Background message', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
