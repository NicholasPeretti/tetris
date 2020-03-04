declare var self: ServiceWorkerGlobalScope
export {}

import resourceList from 'resource-list:'
import version from 'consts:version'

const CACHE_NAME = `static-cache-${version}`

self.addEventListener('install', event => {
  const resourcesToCache = resourceList.filter(
    //  Don't cache service worker and manifest
    file => !file.includes('sw.js') && !file.includes('manifest.json')
  )
  const toCache = ['/', ...resourcesToCache]

  event.waitUntil(
    (async function() {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(toCache)
    })()
  )
})

self.addEventListener('activate', event => {
  self.clients.claim()

  event.waitUntil(
    (async function() {
      // Remove old caches.
      const promises = (await caches.keys()).map(cacheName => {
        if (CACHE_NAME !== cacheName) {
          return caches.delete(cacheName)
        }
      })

      await Promise.all<any>(promises)
    })()
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }
  event.respondWith(
    (async function() {
      const cachedResponse = await caches.match(event.request, {
        ignoreSearch: true,
      })
      return cachedResponse || fetch(event.request)
    })()
  )
})
