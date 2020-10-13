const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// list of files to cache
const FILES_TO_CACHE = [
    './index.html',
    './js/index.js',
    './js/idb.js',
    './css/styles.css'
  ];

// install service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('installing cache: ' + CACHE_NAME);
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  });
  
// activate event
  self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeepList = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        cacheKeepList.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeepList.indexOf(key) === -1) {
              console.log('deleting cache:' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });
  
  // fetch from cache
  self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(request) {
        return request || fetch(e.request)
      })
    );
  });