// Offline support.
// - App files (same origin): network first, so updates arrive; falls back to the cache when offline.
// - JS libraries from CDNs: cache first, so they load instantly and work offline.
// Model weights are cached separately by WebLLM / transformers.js in the Cache API.
const CACHE = 'localmind-v3';
const SHELL = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'esm.run'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE && k.startsWith('localmind-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const store = (r, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(r, copy));
  }
  return res;
};

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ours = u.origin === self.location.origin;
  if (!ours && !LIB_HOSTS.includes(u.hostname)) return; // everything else passes through untouched

  if (ours) {
    e.respondWith(
      fetch(r).then(res => store(r, res)).catch(() =>
        caches.match(r).then(hit => hit || (r.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
      )
    );
  } else {
    e.respondWith(
      caches.match(r).then(hit => hit || fetch(r).then(res => store(r, res)))
    );
  }
});
