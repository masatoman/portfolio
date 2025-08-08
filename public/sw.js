// 軽量なService Worker - 重要なリソースのキャッシュ
const CACHE_NAME = 'ihara-portfolio-v1';
const CRITICAL_RESOURCES = [
  '/',
  '/images/about-photo.jpeg',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/main.js'
];

// インストール時に重要なリソースをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_RESOURCES);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// リクエスト時の処理 - ネットワークファーストで軽量
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功時は新しいレスポンスを返す
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 失敗時はキャッシュから返す
        return caches.match(event.request);
      })
  );
});
