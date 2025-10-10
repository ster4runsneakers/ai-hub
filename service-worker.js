// Minimal PWA cache
const CACHE = "ai-hub-v1";
const PRECACHE = [
  "./",
  "index.html",
  "apps.json",
  "manifest.webmanifest",
  "static/icons/icon-192.png",
  "static/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isStatic = url.origin === location.origin && (
    url.pathname.startsWith("/static/") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".html")
  );
  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then(r=> r || fetch(e.request).then(x=>{
        const copy=x.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy)); return x;
      }))
    );
  }
});
