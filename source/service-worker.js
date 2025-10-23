import { VERSION } from './version'

// is there a way to save and cache this locally?
// When offline it freaks out and tries to connec to the internet?
// importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${WORKBOX_VERSION}/workbox-sw.js`);
import { registerRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies'

import {
	setConfig,
	setCacheNameDetails
} from 'workbox-core'

import{
  pageCache,
  imageCache,
  staticResourceCache,
//   googleFontsCache,
  offlineFallback
} from 'workbox-recipes'

// Used for filtering matches based on status code, header, or both
import { CacheableResponse, CacheableResponsePlugin } from 'workbox-cacheable-response'
// Used to limit entries in cache, remove entries after a certain period of time
import { ExpirationPlugin } from 'workbox-expiration'
import { RangeRequestsPlugin } from 'workbox-range-requests'
import { precacheAndRoute } from 'workbox-precaching'

// Not compiled so best add the ; to the es5
const ONE_DAY = 60 * 60 * 24
const REVISION = VERSION
const BUILD_MMR = VERSION
const WORKBOX_DEBUG_LOGGING = process.env.NODE_ENV === "development"
// Workbox version - update manually when there are new releases.
const WORKBOX_VERSION = '6.1.5'
// Cache naming and versioning.
const APP_CACHE_PREFIX = 'mct'
const APP_CACHE_SUFFIX = `v${BUILD_MMR}`

// checks for localhost anyways
// setConfig({debug: WORKBOX_DEBUG_LOGGING})
self.__WB_DISABLE_DEV_LOGS = !WORKBOX_DEBUG_LOGGING

// https://love2dev.com/blog/how-to-uninstall-a-service-worker/
const uninstall = () => {
	navigator.serviceWorker.getRegistrations()
		.then( registrations => { 
			for(let registration of registrations) 
			{ 
				registration.unregister()
				.then(()=>self.clients.matchAll())
				.then(clients => { 
					clients.forEach(client => { 
						if (client.url && "navigate" in client){ 
							client.navigate(client.url)
						} 
					})
				})
			}
		})
}

setCacheNameDetails({
    prefix: APP_CACHE_PREFIX,
    suffix: APP_CACHE_SUFFIX,
    precache: 'installtime',
    runtime: 'runtime',
})

// console.log(`>>> Workbox`,REVISION, {WORKBOX_DEBUG_LOGGING});

self.addEventListener('message', (event) => {
  if (event.data && event.data.message) {
     console.log(`>>> Message received from client: `, event.data)
      if (event.data.message === 'SKIP_WAITING') {
          self.skipWaiting()
      } else if (event.data.message === 'CLIENTS_CLAIM') {
          self.clients.claim()
      } else {
          debug.warning('>>>> No idea what to do with that message!')
      }
  } else {
      throw new Error(`Message event handler: event.data=[${event.data}], event.data.message=[${event.data.message}]`)
  }
})

// Uninstall if b0rked
// self.addEventListener("activate", event => {
// 	uninstall()
// })


// Load caching routines

// CacheFirst - an implementation of a cache-first request strategy.
// A cache first strategy is useful for assets that have been revisioned, such as URLs like /styles/example.a8f5f1.css, since they can be cached for long periods of time.
// If the network request fails, and there is no cache match, this will throw a WorkboxError exception.

// Include offline.html in the manifest__WB_MANIFEST
// precacheAndRoute(self.origin);
precacheAndRoute([ {url: 'index.html', revision:REVISION }])

pageCache()

staticResourceCache()

// so this aint working...
imageCache()

// allow for this to work offline too
offlineFallback()

// intercept offline analytics and cache for later salvaging
// googleAnalytics.initialize()

// Add Music files!
const CACHE_MEDIA = 'static-media'
const catchMedia = (match) =>{
  const { request } = match
  const isMedia = 
  request.destination === 'mp3' || 
  request.destination === 'wav' || 
  request.destination === 'media' ||
  request.destination === 'audio' || 
  request.url.indexOf(".mp3") === request.url.length - 4
  request.url.indexOf(".wav") === request.url.length - 4
  
  // console.error(isMedia, "matchCallback", {match, request, pos:request.url.indexOf(".mp3") })
  
  return isMedia
}

registerRoute(
  catchMedia,
  new CacheFirst({
    cacheName: CACHE_MEDIA,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new RangeRequestsPlugin()
    ],
  }),
)

registerRoute(
  /\*.task/,
  new NetworkFirst({
    cacheName: 'tf-models-tfhub-tensorflow',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // one month should be good
        maxAgeSeconds: ONE_DAY * 30,
      }),
    ],
  }),
)

// workbox.loadModule('workbox-range-requests');
// RangeRequestsPlugin
// registerRoute(
//   catchMedia,
//   new StaleWhileRevalidate({
//     cacheName: CACHE_MEDIA,
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   }),
// );


// TF json
// https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/facemesh/1/default/1/model.json

// Now the TF models...
// https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file
// https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file

/*

// Cache the cloud hosted TF models as they are heavy and not local!
registerRoute(
  /^https:\/\/storage\.googleapis\.com\/tfhub-tfjs-modules/,
  new NetworkFirst({
    cacheName: 'tf-models-googleapi',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // one month should be good
        maxAgeSeconds: ONE_DAY * 30,
      }),
    ],
  }),
)

// https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file
registerRoute(
  /^https:\/\/tfhub\.dev\/mediapipe\/tfjs-model/,
  new NetworkFirst({
    cacheName: 'tf-models-tfhub-mediapipe',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // one month should be good
        maxAgeSeconds: ONE_DAY * 30,
      }),
    ],
  }),
)

// // https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file
// registerRoute(
//   /^https:\/\/tfhub\.dev\/tensorflow\/tfjs-model/,
//   new NetworkFirst({
//     cacheName: 'tf-models-tfhub-tensorflow',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         // one month should be good
//         maxAgeSeconds: ONE_DAY * 30,
//       }),
//     ],
//   }),
// )
*/