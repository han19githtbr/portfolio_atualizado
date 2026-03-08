const CACHE_NAME = 'handy-portfolio-v1';

// Todos os arquivos que serão cacheados para uso offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/index.js',
  '/data.json',
  '/img/perfil_portfolio.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap'
];

// ===== INSTALL: cacheia os arquivos essenciais =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Cacheando arquivos...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE: limpa caches antigos =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ===== FETCH: estratégia Cache First, fallback para rede =====
self.addEventListener('fetch', event => {
  // Ignora requisições não-GET e extensões de browser
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Retorna do cache
      }

      // Se não estiver no cache, busca na rede e cacheia dinamicamente
      return fetch(event.request)
        .then(networkResponse => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type !== 'opaque'
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline: retorna index.html para navegação
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
    })
  );
});