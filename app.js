document.addEventListener('DOMContentLoaded', async () => {
  const enableBtn = document.getElementById('enableNotifications');
  
  enableBtn.addEventListener('click', async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await window.firebase.getToken(window.firebase.messaging, { 
          vapidKey: 'SUA_CHAVE_VAPID' 
        });
        console.log('Token FCM:', token);
        alert('Notificações ativadas com sucesso!');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  });

  // Ouvinte para mensagens em primeiro plano
  window.firebase.onMessage(window.firebase.messaging, (payload) => {
    console.log('Mensagem recebida:', payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: 'icons/icon-192x192.png'
    });
  });
});
