const CACHE_NAME = 'chrono-arbitre-v4';
const urlsToCache = [
  '/ludi-arbitre/',
  '/ludi-arbitre/index.html',
  '/ludi-arbitre/styles.css',
  '/ludi-arbitre/app.js',
  '/ludi-arbitre/manifest.json',
  '/ludi-arbitre/icon.svg'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Erreur lors de la mise en cache:', err);
          // Continuer même si certains fichiers échouent
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-http/https (comme chrome-extension://)
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne depuis le cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, fait la requête réseau
        return fetch(event.request).then(response => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone la réponse
          const responseToCache = response.clone();
          
          // Ajoute au cache (seulement pour les requêtes de notre app)
          if (event.request.url.includes('/ludi-arbitre/')) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.warn('Erreur mise en cache:', err);
              });
          }
          
          return response;
        });
      })
      .catch(() => {
        // En cas d'erreur, retourne la page index si c'est une navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/ludi-arbitre/index.html');
        }
      })
  );
});
