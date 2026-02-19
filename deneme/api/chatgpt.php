<?php
// CORS sadece gerektiği kadar izin verelim, örn: kendi domain ya da '*'
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// OPTIONS preflight isteğine cevap ver
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Girdi kontrolü
if (!isset($data['systemPrompt']) || !isset($data['userPrompt'])) {
    http_response_code(400);
    echo json_encode(["error" => "Eksik veri."]);
    exit;
}

// API anahtarı (gerçek kullanımda bu dosya root dışında, erişimi kısıtlı yerde saklanmalı)
$api_key = "BURAYA_API_KEY_KOYMA";

// OpenAI API isteği payload'u
$payload = [
    "model" => "gpt-4o-mini",
    "messages" => [
        ["role" => "system", "content" => $data["systemPrompt"]],
        ["role" => "user", "content" => $data["userPrompt"]],
    ],
    "max_tokens" => 250,
    "temperature" => 0.85
];

// cURL ile OpenAI'ye POST isteği
$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $api_key
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);

// cURL hatası varsa yakala
if (curl_errno($ch)) {
    $err = curl_error($ch);
    curl_close($ch);
    http_response_code(500);
    echo json_encode(["error" => "cURL Hatası: " . $err]);
    exit;
}

curl_close($ch);

// OpenAI yanıtını decode et
$result = json_decode($response, true);

if (isset($result["choices"][0]["message"]["content"])) {
    echo json_encode(["message" => $result["choices"][0]["message"]["content"]]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Yanıt alınamadı."]);
}
