import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

// Supabase
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Firebase
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registrado', registration);

      document.getElementById('btnNotify').addEventListener('click', async () => {
        try {
          const token = await getToken(messaging, {
            vapidKey: 'YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR',
            serviceWorkerRegistration: registration
          });

          if (token) {
            console.log('Token:', token);

            const { data, error } = await supabase
              .from('tokens')
              .insert([{ token }]);

            if (error) {
              console.error('Erro ao salvar no Supabase', error);
            } else {
              alert('Token salvo no Supabase!');
            }
          } else {
            console.log('Sem token recebido');
          }
        } catch (err) {
          console.error('Erro ao pegar token', err);
        }
      });
    });
}

onMessage(messaging, (payload) => {
  console.log('Mensagem recebida em foreground: ', payload);
});
