const CHANGE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js',
    '/index.html'
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CHANGE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.repondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })

    );
});

self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: 'icon.png',
        badges: 'badge.png'
    };
    event.waitUntil(
        self.registration.showNotification('PWA Notification', options)
    );
});

self.addEventListener('sync', function (event) {
    if (event.tag === 'sync-todos') {
        event.waitUntil(syncWithServer());
    }
});