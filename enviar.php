<?php
$fcm_server_key = 'SUA_SERVER_KEY_DO_FCM';
$url_fcm = 'https://fcm.googleapis.com/fcm/send';
$firebase_url = 'https://SEU_PROJECT_ID.firebaseio.com/tokens.json';

$tokens_json = file_get_contents($firebase_url);
$tokens = json_decode($tokens_json, true);

$body = json_decode(file_get_contents("php://input"), true);
$titulo = $body['titulo'] ?? 'Notificação';
$mensagem = $body['mensagem'] ?? '';

foreach (array_keys($tokens) as $token) {
    $msg = [
        'to' => $token,
        'notification' => [
            'title' => $titulo,
            'body' => $mensagem,
        ]
    ];

    $headers = [
        'Authorization: key=' . $fcm_server_key,
        'Content-Type: application/json'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url_fcm);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($msg));
    curl_exec($ch);
    curl_close($ch);
}

echo "✅ Notificações enviadas.";
