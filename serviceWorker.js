const monitor = "chromebook-monitor"
const assets = [
  "/",
  "/index.html",
  "/css/bootstrap.min.css",
  "/css/customized.css",
  "/js/app.js",
  "/img/chrome.png"
]
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetch something ...', event);
    event.respondWith(fetch(event.request));
});

