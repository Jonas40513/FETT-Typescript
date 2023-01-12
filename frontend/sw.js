const CACHE_NAME = "offline"
const OFFLINE_URL = "index.html"

//Must be in the root
self.addEventListener("push", (event) => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/favicon.ico",
        data: {
            url: self.location.origin + "/emergency/" + data.id,
            navigation: data.navigation
        },
        actions: [
            {
                action: "navigation",
                title: "Navigate"
            }
        ]
    })
})

self.addEventListener("notificationclick", (event) => {
    event.notification.close()
    if (event.notification.data === null) {
        return
    }
    event.waitUntil(
        clients.openWindow(event.action === "navigation" ? event.notification.data.navigation : event.notification.data.url)
    )
})

self.addEventListener("install", function (event) {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME)
        // Setting {cache: "reload"} in the new request will ensure that the response
        // isn't fulfilled from the HTTP cache i.e., it will be from the network.
        await cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
    })())

    self.skipWaiting()
})

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ("navigationPreload" in self.registration) {
            await self.registration.navigationPreload.enable()
        }
    })())

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim()
})

self.addEventListener("fetch", function (event) {
    if (event.request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const preloadResponse = await event.preloadResponse
                if (preloadResponse) {
                    return preloadResponse
                }

                const networkResponse = await fetch(event.request)
                return networkResponse
            } catch (error) {

                const cache = await caches.open(CACHE_NAME)
                const cachedResponse = await cache.match(OFFLINE_URL)
                return cachedResponse
            }
        })())
    }
})
