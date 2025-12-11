const CACHE_NAME = 'campus-life-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/tokens.css',
  '/css/base.css',
  '/js/main.js',
  '/js/router.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/utils.js',
  '/js/storage.js',
  '/js/api.js',
  '/js/validation.js',
  '/js/performance.js',
  '/js/a11y.js'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker: Caching core files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          // sw.js

          return response;
        }).catch(() => {
          
          if (event.request.mode === 'navigate') {
            console.log('🚨 Fetch failed, falling back to index.html for navigation');
            return caches.match('/index.html');
          }
           
           throw new Error('Offline and asset not found in cache');
        });
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-events') {
    event.waitUntil(syncEvents());
  }
});

async function syncEvents() {
  console.log('🔄 Background sync: Syncing events...');
  // Logic to sync events when back online
  // This would send queued events to the server
}