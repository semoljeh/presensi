const CACHE_NAME = 'presensi-pwa-v1';
const PRECACHE = [
  './',
  './index.html',
  './asset/logo-512.png',
  './asset/notif.mp3'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => Promise.allSettled(PRECACHE.map(url => cache.add(url))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET' || url.hostname.includes('script.google.com')) return;
  if (url.origin !== self.location.origin) return;

  const isCodeOrDocument = req.destination === 'document' || req.destination === 'script' || req.destination === 'style' || /\.(html|js|css)$/i.test(url.pathname);

  if (isCodeOrDocument) {
    event.respondWith((async () => {
      try {
        return await fetch(req, { cache: 'no-store' });
      } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? cache.match('./index.html', { ignoreSearch: true }) : Response.error());
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const fresh = await fetch(req);
    if (fresh && fresh.ok) await cache.put(req, fresh.clone());
    return fresh;
  })());
});