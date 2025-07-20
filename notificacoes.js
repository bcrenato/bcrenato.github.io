import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const db = getDatabase(app);

const btn = document.getElementById("ativarNotificacoes");
const statusDiv = document.getElementById("statusNotificacao");

btn.addEventListener("click", () => {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      statusDiv.innerText = "❌ Permissão negada para notificações.";
      return;
    }

    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);

        return getToken(messaging, {
          vapidKey: "BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI",
          serviceWorkerRegistration: registration
        });
      })
      .then((token) => {
        if (token) {
          console.log('Token FCM:', token);
          statusDiv.innerText = "✅ Notificações ativadas!";

          // Salvar no Realtime Database
          set(ref(db, 'tokens/' + token), {
            token: token
          }).then(() => {
            console.log("Token salvo no Firebase!");
          }).catch(err => {
            console.error("Erro ao salvar token:", err);
          });
        } else {
          console.log('Não foi possível obter token.');
          statusDiv.innerText = "⚠️ Não foi possível obter token.";
        }
      })
      .catch((err) => {
        console.error('Erro ao pegar token:', err);
        statusDiv.innerText = "❌ Erro ao ativar notificações.";
      });
  });
});

// Para mensagens enquanto a página está aberta
onMessage(messaging, (payload) => {
  console.log('Mensagem recebida com a página aberta:', payload);
});
