const staticCacheName = 'version-4';
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

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchresponse) => {
          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request, fetchresponse.clone());
            return fetchresponse;
          });
        })
      );
    })
  );
});

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
/****************************************************/
