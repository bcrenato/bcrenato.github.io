// ================= Configuração Firebase v9 (Compat) =================
// Certifique-se que esses scripts estão no seu HTML:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"></script>

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBC73aRe7HLp-zQNpJcbWLlUj24kiQGAcE",
  authDomain: "cadastro-membros-c5cd4.firebaseapp.com",
  databaseURL: "https://cadastro-membros-c5cd4-default-rtdb.firebaseio.com",
  projectId: "cadastro-membros-c5cd4",
  storageBucket: "cadastro-membros-c5cd4.firebasestorage.app",
  messagingSenderId: "250346042791",
  appId: "1:250346042791:web:6bc469b844de69e526b282"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig); // Correção aqui
const messaging = firebase.messaging.getMessaging(app);

// ================= Configuração Supabase =================
const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseKey = 'SUA_KEY_SUPABASE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ================= Registro do Service Worker =================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado com sucesso:', registration);
      
      // Configura mensagens em foreground
      firebase.messaging.onMessage(messaging, (payload) => {
        console.log('Mensagem recebida:', payload);
        showLocalNotification(
          payload.notification.title,
          payload.notification.body
        );
      });
      
    } catch (error) {
      console.error('Falha no registro do Service Worker:', error);
    }
  });
}

// ================= Funções de Notificação =================
function showLocalNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png'
    });
  }
}

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permissão concedida');
      await registerPushNotifications();
    } else {
      console.log('Permissão negada');
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
  }
}

async function registerPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI')
    });

    // Função auxiliar para converter VAPID key
    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }

    // Envia a subscription para o Supabase
    const { error } = await supabase
      .from('user_devices')
      .insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        device_token: JSON.stringify(subscription)
      }]);

    if (error) throw error;
    console.log('Dispositivo registrado para notificações push');

  } catch (error) {
    console.error('Erro no registro de notificações:', error);
  }
}

// ================= Event Listeners =================
document.addEventListener('DOMContentLoaded', () => {
  const btnEnable = document.getElementById('enableNotifications');
  if (btnEnable) {
    btnEnable.addEventListener('click', requestNotificationPermission);
  }
  
  if ('Notification' in window && Notification.permission === 'granted') {
    registerPushNotifications();
  }
});
