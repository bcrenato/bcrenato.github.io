require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const serverKey = process.env.FCM_SERVER_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTokens() {
  const { data, error } = await supabase.from('tokens').select('token');
  if (error) throw error;
  return data.map(row => row.token);
}

async function sendNotification(token, notification) {
  const res = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${serverKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: token,
      notification
    })
  });

  const json = await res.json();
  console.log(`Resposta para ${token}:`, json);
}

(async () => {
  try {
    const tokens = await getTokens();
    console.log(`Encontrados ${tokens.length} tokens`);

    const notification = {
      title: 'Olá!',
      body: 'Essa é uma notificação enviada pelo servidor 😃'
    };

    for (const token of tokens) {
      await sendNotification(token, notification);
    }

    console.log('Notificações enviadas.');
  } catch (err) {
    console.error(err);
  }
})();
