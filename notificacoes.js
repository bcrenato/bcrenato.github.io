import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// 🔷 Substitua pelos SEUS dados do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBC73aRe7HLp-zQNpJcbWLlUj24kiQGAcE",
  authDomain: "cadastro-membros-c5cd4.firebaseapp.com",
  databaseURL: "https://cadastro-membros-c5cd4-default-rtdb.firebaseio.com",
  projectId: "cadastro-membros-c5cd4",
  storageBucket: "cadastro-membros-c5cd4.firebasestorage.app",
  messagingSenderId: "250346042791",
  appId: "1:250346042791:web:6bc469b844de69e526b282"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

navigator.serviceWorker.ready.then(registration => {
  getToken(messaging, {
    vapidKey: "BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI",
    serviceWorkerRegistration: registration
  })
  .then((token) => {
    if (token) {
      console.log("✅ Token FCM:", token);
      // Aqui você pode salvar o token no Firebase Realtime Database
      fetch("https://cadastro-membros-c5cd4-default-rtdb.firebaseio.com/tokens.json", {
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
