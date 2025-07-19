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

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Solicita permissão para notificações
document.getElementById('enableNotifications').addEventListener('click', async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken({ vapidKey: 'BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI' });
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
