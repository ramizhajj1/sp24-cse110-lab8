// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];
const ASSETS = [
  '/',
  '/index.html',
  '/assets/styles/main.css',
  '/assets/scripts/main.js',
  '/assets/scripts/RecipeCard.js',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-256x256.png',
  '/assets/images/icons/icon-384x384.png',
  '/assets/images/icons/icon-512x512.png',
];

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. Add all of the URLs from RECIPE_URLs and ASSETS here so that they are added to the cache when the ServiceWorker is installed
      return cache.addAll([...RECIPE_URLS, ...ASSETS]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  if (event.request.url.startsWith('chrome-extension://')) {
    // Ignore requests from Chrome extensions
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        // B8. If the request is in the cache, return with the cached version.
        if (response) {
          return response;
        }
        // Otherwise fetch the resource, add it to the cache, and return network response.
        return fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone()).catch(function (error) {
            console.error('Failed to cache:', event.request.url, error);
          });
          return networkResponse;
        }).catch(function (error) {
          console.error('Fetch failed:', event.request.url, error);
          throw error;
        });
      });
    })
  );
});
