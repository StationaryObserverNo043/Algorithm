// 銀河帝国アルゴリズムの侵略 — Storybook PWA Service Worker
const CACHE_NAME = "invasion-log-cache-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./images/00-cover.jpg",
  "./images/01-emperor.jpg",
  "./images/02-answer.jpg",
  "./images/03-alien-room.jpg",
  "./images/04-alien-jako-close.jpg",
  "./images/05-jako-face.jpg",
  "./images/06-alien-jako-surprise.jpg",
  "./images/07-zed-king.jpg",
  "./images/08-earthling-himajin.jpg",
  "./images/09-answer-penguin.jpg",
  "./images/ogp-card.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
