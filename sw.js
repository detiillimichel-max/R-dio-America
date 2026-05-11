/* ════════════════════════════════════════
   OIO CALENDAR — sw.js  (Service Worker)
════════════════════════════════════════ */
const CACHE_NAME = 'oio-calendar-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap'
];

/* ── Install: pré-cache dos assets estáticos ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: limpa caches antigos ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: Cache-first para assets, network-first para Firebase ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Deixa Firebase e APIs passarem direto pela rede */
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    e.request.method !== 'GET'
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

