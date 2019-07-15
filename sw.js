let cacheID = "dummy-project-v1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheID).then(cache => {
            console.log('Opened cache');
            return cache
                .addAll([
                    "/dummy-project/",
                    "/dummy-project/index.html",
                    "/dummy-project/dist/css/style.css",
                    "/dummy-project/dist/js/",
                    "/dummy-project/dist/js/main.js",
                    "/dummy-project/dist/js/sw-register.js"
                ])
                .catch(err => {
                    console.log("Caches open failed: " + err);
                });
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => {
                        return (
                            cacheName.startsWith("dummy-project-v") &&
                            cacheName != cacheID
                        );
                    })
                    .map(cacheName => {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    let requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === "/") {
            event.respondWith(caches.match("/"));
            return;
        }
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});