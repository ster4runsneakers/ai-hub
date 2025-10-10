// Simple cache-first SW
const CACHE = 'ai-hub-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './apps.json',
  './static/icons/icon-192.png',
  './static/icons/icon-512.png'
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
  const { request } = e;
  e.respondWith(
    caches.match(request).then(res => 
      res || fetch(request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE).then(c=> c.put(request, copy)).catch(()=>{});
        return r;
      }).catch(()=> res || new Response('Offline', {status:503}))
    )
  );
});
