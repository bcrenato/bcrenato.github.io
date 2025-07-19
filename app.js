// ================= Configuração Firebase v9 (Modular) =================
// Importação via CDN (compat) - já que você está usando firebase 9.23 via script
const { initializeApp } = firebase.console.firebaseApp;
const { getMessaging, onMessage } = firebase.messaging;

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

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
      
      // Configura mensagens em foreground (quando o app está aberto)
      onMessage(messaging, (payload) => {
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
// Mostra notificação local
function showLocalNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png' // Caminho corrigido para sua pasta
    });
  }
}

// Solicita permissão para notificações
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

// Registra o dispositivo para push notifications
async function registerPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'SUA_CHAVE_PUBLICA_VAPID'
    });

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
  // Botão para ativar notificações
  const btnEnable = document.getElementById('enableNotifications');
  if (btnEnable) {
    btnEnable.addEventListener('click', requestNotificationPermission);
  }
  
  // Verifica se já tem permissão
  if ('Notification' in window && Notification.permission === 'granted') {
    registerPushNotifications();
  }
});