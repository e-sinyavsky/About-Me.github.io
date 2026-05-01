// Cache-first service worker for the portfolio site.
// Versioned cache name — bump on releases to invalidate.
const CACHE_VERSION = "v2";
const CACHE_NAME = `about-me-${CACHE_VERSION}`;

const PRECACHE = [
  "./",
  "./index.html",
  "./404.html",
  "./styles/main.css?v=7",
  "./scripts/i18n.js?v=7",
  "./scripts/projects.js?v=7",
  "./scripts/scroll-animations.js?v=7",
  "./scripts/theme-toggle.js?v=7",
  "./scripts/burger-menu.js?v=7",
  "./scripts/anchor-links.js?v=7",
  "./scripts/header-scroll-effect.js?v=7",
  "./scripts/type-text.js?v=7",
  "./scripts/scroll-to-top.js?v=7",
  "./scripts/download-pdf.js?v=7",
  "./scripts/contact-form.js?v=7",
  "./scripts/lib/typed.umd.js?v=7",
  "./locales/translation.js?v=7",
  "./icons/tech-sprite.svg?v=7",
  "./images/me-400.webp?v=7",
  "./images/me-800.webp?v=7",
  "./images/me-400.jpg?v=7",
  "./images/me-800.jpg?v=7",
  "./icons/logo.svg?v=7",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("about-me-") && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Don't cache external API calls (GitHub, CDN, third-party scripts)
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML so updates are picked up promptly
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type !== "basic") return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
