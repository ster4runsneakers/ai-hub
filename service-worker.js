const CACHE = 'ai-hub-v3';
const ASSETS = [
  './',
  './index.html',
  './sneakers.html',
  './styles.css',
  './apps.json',
  './static/icons/icon-192.png',
  './static/icons/icon-512.png',
  './static/screenshots/wide-1280x720.png',
  './static/screenshots/mobile-540x720.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=> k!==CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE).then(c=> c.put(e.request, copy)).catch(()=>{});
        return r;
      }).catch(()=> res || new Response('Offline', {status:503}))
    )
  );
});
