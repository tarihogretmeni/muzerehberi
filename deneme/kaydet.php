<?php
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["image"])) {
    http_response_code(400);
    exit("Gorsel yok");
}

$base64 = str_replace('data:image/png;base64,', '', $data["image"]);
$base64 = str_replace(' ', '+', $base64);
$imageData = base64_decode($base64);
$prefix = isset($data["text"]) ? "(" . preg_replace('/[^A-Za-z0-9_\-]/', '_', $data["text"]) . ")" : "";
$dosyaAdi = $prefix . "webcam-" . time();

$resimYolu = "uploads/" . $dosyaAdi . ".png";
file_put_contents($resimYolu, $imageData);

echo "Gorsel kaydedildi.";
?>