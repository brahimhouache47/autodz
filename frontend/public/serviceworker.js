const staticCacheName = 'version-5';
const filesToCache = [
  'index.html',
  '/api/products',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css',
  '/static/js/bundle.js',
  '/api/products/search?page=1&query=all&category=all&price=all&order=newest',
  '/api/products/search?page=1&query=all&category=Freinage&price=all&order=newest',
  '/api/products/search?page=1&query=all&category=Moteur&price=all&order=newest',
  '/api/products/search?page=1&query=all&category=Transmission&price=all&order=newest',
  '/api/products/search?page=1&query=all&category=Filtre&price=all&order=newest',
  '/api/products/categories',
  '/assets/icons/icon-512x512.png',
  '/static/media/logo.00488e36c532970a2648.PNG',
  '/manifest.json',
];

const self = this;
/* install sw */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
      .catch((err) => {})
  );
});
/** */
self.addEventListener('fetch', (event) => {
  if (!(event.request.url.indexOf('http') === 0)) return;
  event.respondWith(
    caches.open(staticCacheName).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});

/** */

// Fetch event

// Activate the SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
/** */

/****************************************************/
