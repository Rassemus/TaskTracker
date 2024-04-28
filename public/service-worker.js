

const CACHE_NAME = 'version-1';

const self = this;

self.addEventListener('install', e => {
    console.log('installing service worker!');
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.js',
                '/static/js/bundle.js'
            ]).then(() => self.skipWaiting())
        })
    )
});

self.addEventListener('activate', e =>{
    console.log('Activating service worker');
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
    console.log(`Fetching ${e.request.url}`);
    if (e.request.method === 'POST') {
        // skip POST-requests
        return;
    }
    if(navigator.onLine){
        const fetchRequest = e.request.clone();
        return fetch(fetchRequest).then(
            function (response) {
                if(!response || response.status !== 200 || response.type !== 'basic'){
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(function (cache) {
                        cache.put(e.request, responseToCache);
                    });

                return response;
            }
        );
    }else{
        e.respondWith(
            caches.match(e.request)
                .then(function (response){
                    return response || new Response('', { status: 404, statusText: 'Not Found' });
                })
        )
    }
})


