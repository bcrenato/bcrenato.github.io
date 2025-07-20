import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// 🔷 Substitua pelos SEUS dados do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

navigator.serviceWorker.ready.then(registration => {
  getToken(messaging, {
    vapidKey: "SUA_VAPID_KEY",
    serviceWorkerRegistration: registration
  })
  .then((token) => {
    if (token) {
      console.log("✅ Token FCM:", token);
      // Aqui você pode salvar o token no Firebase Realtime Database
      fetch("https://SEU_DATABASE.firebaseio.com/tokens.json", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
      });
    } else {
      console.warn("⚠️ Permissão para notificações não concedida");
    }
  })
  .catch((err) => {
    console.error("❌ Erro ao obter token:", err);
  });
});

// Recebe mensagens quando a página está em primeiro plano
onMessage(messaging, (payload) => {
  console.log("📨 Mensagem recebida:", payload);
  alert(`${payload.notification.title}\n${payload.notification.body}`);
});
