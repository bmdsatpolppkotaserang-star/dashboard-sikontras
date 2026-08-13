const CACHE_NAME = 'sikontras-v2.1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './polpp.png',
  './kotaserang.png',
  './icon-192.png',
  './icon-512.png'
];

// Event Install: Menyimpan aset ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Event Activate: Membersihkan cache lama jika ada pembaruan versi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event Fetch: Mengambil data dari cache jika offline atau memuat dari jaringan
self.addEventListener('fetch', event => {
  // Untuk permintaan ke Google Apps Script (API), selalu utamakan jaringan (network first)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Untuk aset lokal, gunakan strategi cache dengan fallback ke network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
