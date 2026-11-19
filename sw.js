'use strict';
// Incrementar al publicar cambios en los archivos estáticos.
const CACHE = 'turno-shell-v3';
const SHELL = ['./', './index.html', './styles.css', './config.js', './api.js', './i18n.js', './app.js', './pwa.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const ASSETS = new Set(SHELL.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('turno-shell-') && key !== CACHE).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  // API calls, photos, exports and other personal data never enter this cache.
  if (event.request.method !== 'GET' || !ASSETS.has(event.request.url)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type !== 'opaque') await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const saved = await cache.match(event.request);
      if (saved) return saved;
      throw error;
    }
  }));
});
