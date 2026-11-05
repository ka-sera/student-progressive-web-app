// Service worker: caches the app so it works offline.
const CACHE_NAME = 'student-pwa-v1';
const APP_SHELL = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'students.json',
  'offline.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. INSTALL: save the app files in the cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(APP_SHELL); })
  );
  self.skipWaiting();
});

// 2. ACTIVATE: delete old caches from previous versions
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// 3. FETCH: decide whether to answer from the network or the cache
self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) { return; }

  // Pages and data: try the network first (fresh), fall back to the cache when offline
  if (request.mode === 'navigate' || request.url.indexOf('students.json') !== -1) {
    event.respondWith(
      fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
        return response;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('index.html') || caches.match('offline.html');
        });
      })
    );
    return;
  }

  // Everything else (CSS, JS, icons): cache first, then network
  event.respondWith(
    caches.match(request).then(function (cached) {
      return cached || fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
        return response;
      }).catch(function () { return caches.match('offline.html'); });
    })
  );
});
