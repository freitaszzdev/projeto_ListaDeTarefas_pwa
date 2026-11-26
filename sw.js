const CACHE_NAME = "ritmo-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./recursos/css/style.css",
  "./recursos/js/app.js",
  "./recursos/img/Logo_Ritmo.png",
  "./recursos/img/favicon_logo.png",
  "./recursos/img/icon-192.png",
  "./recursos/img/icon-512.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const cachesAntigos = keys.filter(
        (key) => key.startsWith("ritmo-") && key !== CACHE_NAME,
      );

      await Promise.all(cachesAntigos.map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const respostaSalva = await cache.match(e.request);

      if (respostaSalva) return respostaSalva;

      try {
        return await fetch(e.request);
      } catch {
        if (e.request.mode === "navigate") {
          return (await cache.match("./index.html")) ?? Response.error();
        }

        return Response.error();
      }
    })(),
  );
});
