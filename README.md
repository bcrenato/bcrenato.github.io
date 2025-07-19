# PWA com Supabase + Firebase para Notificações Push

## Configuração

1. Configure o Firebase:
   - Crie projeto
   - Ative Cloud Messaging
   - Pegue `firebaseConfig`, `VAPID Key` e `FCM Server Key`

2. Configure Supabase:
   - Crie projeto
   - Crie tabela `tokens (id, token, created_at)`
   - Pegue `URL`, `anon key` e `service key`

3. Configure GitHub Pages:
   - Crie repositório
   - Faça push dos arquivos
   - Ative Pages

4. Execute `sendNotification.js` para enviar notificações:
   - Preencha `.env`
   - `npm install`
   - `node sendNotification.js`
