// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Solicita permissão para notificações
document.getElementById('enableNotifications').addEventListener('click', async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken({ vapidKey: 'SUA_VAPID_KEY' });
      console.log('Token FCM:', token);
      
      // Envia o token para o Supabase (armazenar no futuro)
      await saveTokenToSupabase(token);
      alert('Notificações ativadas!');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
});

// Função para enviar o token ao Supabase
async function saveTokenToSupabase(token) {
  const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
  const SUPABASE_KEY = 'SUA_ANON_KEY';

  const response = await fetch(`${SUPABASE_URL}/rest/v1/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ token })
  });

  return await response.json();
}