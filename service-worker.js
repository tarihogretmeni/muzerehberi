const CACHE_NAME = "muzerehberi-cache-v3";

// İlk yüklemede mutlaka cache’lenecek dosyalar
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/foto.png",
  "/android.jpg",

  // Kamera sayfası
  "/deneme/index.html",
  "/deneme/sketch.js",
  "/deneme/style.css",

  // Lokal kütüphaneler
  "/deneme/p5.js",
  "/deneme/p5.dom.min.js",
  "/deneme/p5.sound.min.js",
  "/deneme/ml5.min.js",
  "/deneme/p5.speech.js",

  // Model dosyaları
  "/deneme/model/model.json",
  "/deneme/model/metadata.json",
  "/deneme/model/weights.bin",

  // Görseller
  "/deneme/anasayfa.png",
  "/deneme/camera.png",
  "/deneme/ses.png",
  "/deneme/sessiz.png",
  "/deneme/sembolekle.png",
  "/deneme/sembolekle1.png",
  "/deneme/sembolekle2.png"
];

// Install: temel dosyaları cache’le
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: eski cache’leri temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: önce cache, yoksa ağ; ağdan geleni cache’e ekle
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((netRes) => {
          if (netRes && netRes.status === 200 && netRes.type === "basic") {
            const clone = netRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return netRes;
        })
        .catch(() => {
          // HTML isteklerinde offline ise ana sayfayı göster
          if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
        });
    })
  );
});
