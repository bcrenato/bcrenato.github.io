<?php
// Sua SERVER_KEY do FCM
$fcm_server_key = 'BK1Vsw-Pp7cMx2ejEA8iA5_g2JIVp157aiA60UNT7d40Zj9OgSBsNuEios8SwmKDpCR8GgmLjUBxAuF8brKZRWI';

// Lê os tokens do Firebase
$tokens_json = file_get_contents('https://cadastro-membros-c5cd4-default-rtdb.firebaseio.com/tokens.json');
$tokens_array = json_decode($tokens_json, true);

if (!$tokens_array) {
  exit("Nenhum token encontrado no Firebase.\n");
}

$body = json_decode(file_get_contents("php://input"), true);
$titulo = $body['titulo'] ?? 'Notificação';
$mensagem = $body['mensagem'] ?? '';

$url = 'https://fcm.googleapis.com/fcm/send';

$headers = [
  'Authorization: key=' . $fcm_server_key,
  'Content-Type: application/json'
];

foreach ($tokens_array as $item) {
  $token = $item['token'];

  $msg = [
    'to' => $token,
    'notification' => [
      'title' => $titulo,
      'body' => $mensagem,
      'icon' => 'icone.png' // opcional
    ]
  ];

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($msg));
  $result = curl_exec($ch);
  curl_close($ch);

  echo "Enviado para token: $token\n";
}

echo "\n✅ Notificações enviadas.";
