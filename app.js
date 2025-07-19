import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

// Supabase
const supabaseUrl = 'https://vodnjhnmimpoanevsvaw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZG5qaG5taW1wb2FuZXZzdmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTc5MzEsImV4cCI6MjA2ODUzMzkzMX0.OukdQS12RI2-UTKGxtqC-voiU7PybFfIutyeia3-8qE'
const supabase = createClient(supabaseUrl, supabaseKey)

// Firebase
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registrado', registration);

      document.getElementById('btnNotify').addEventListener('click', async () => {
        try {
          const token = await getToken(messaging, {
            vapidKey: 'BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI',
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
