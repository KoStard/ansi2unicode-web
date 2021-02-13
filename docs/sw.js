const VERSION = 'v0.0.3';
const LOCAL = true; // This has to be true to run on localhost
const BASEPATH = self.registration.scope;

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll([
        BASEPATH,
        BASEPATH + 'index.html',
        BASEPATH + 'styles.css',
        // BASEPATH + 'main.js',
        // BASEPATH + 'ansi2unicode-web.js',
        // BASEPATH + 'ansi2unicode_web.wasm',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.207/distr/fira_code.css',
        'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.207/distr/woff2/FiraCode-Bold.woff2',
        'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.207/distr/woff2/FiraCode-Medium.woff2',
        'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.207/distr/woff2/FiraCode-Regular.woff2',
      ]);
    })
  );
});

// Removing old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key < VERSION) {
        return caches.delete(key);
      }
    }));
  }))
})

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request); // Can add these to the cache too
    }
  }));
});

self.addEventListener('message', function (event) {
  if (event.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});



/**
 * Some websites for service workers:
 * - https://deanhume.com/displaying-a-new-version-available-progressive-web-app/
 *
 */