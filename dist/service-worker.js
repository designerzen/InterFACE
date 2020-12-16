// Not compiled so best add the ; to the es5

const REVISION = 0;
const BUILD_MMR = "0.0.1";
const WORKBOX_DEBUG_LOGGING = true;
// Workbox version - update manually when there are new releases.
const WORKBOX_VERSION = '6.0.2';
// Cache naming and versioning.
const APP_CACHE_PREFIX = 'mct';
const APP_CACHE_SUFFIX = `v${BUILD_MMR}`;

importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${WORKBOX_VERSION}/workbox-sw.js`);

workbox.setConfig({debug: WORKBOX_DEBUG_LOGGING});
workbox.core.setCacheNameDetails({
    prefix: APP_CACHE_PREFIX,
    suffix: APP_CACHE_SUFFIX,
    precache: 'installtime',
    runtime: 'runtime',
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.message) {
      console.log(`>>> Message received from client: `, event.data);
      if (event.data.message === 'SKIP_WAITING') {
          self.skipWaiting();
      } else if (event.data.message === 'CLIENTS_CLAIM') {
          self.clients.claim();
      } else {
          debug.warning('>>>> No idea what to do with that message!');
      }
  } else {
      throw new Error(`Message event handler: event.data=[${event.data}], event.data.message=[${event.data.message}]`);
  }
});


// Load caching routines
const {
  pageCache,
  imageCache,
  staticResourceCache,
  googleFontsCache,
  offlineFallback,
} = workbox.recipes;

const {registerRoute} = workbox.routing;
const {StaleWhileRevalidate,CacheFirst} = workbox.strategies;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;
const {precacheAndRoute} = workbox.precaching;

// import { registerRoute } from 'workbox-routing';
// import { StaleWhileRevalidate } from 'workbox-strategies';
// import { CacheableResponsePlugin } from 'workbox-cacheable-response';


// import {
//   pageCache,
//   imageCache,
//   staticResourceCache,
//   googleFontsCache,
//   offlineFallback,
// } from 'workbox-recipes';
// import { precacheAndRoute } from 'workbox-precaching';

// Include offline.html in the manifest__WB_MANIFEST
// precacheAndRoute(self.origin);
precacheAndRoute([ {url: '/index.html', revision:REVISION }])
console.error("precacheAndRoute", self, self.origin)

pageCache();

googleFontsCache();

staticResourceCache();

imageCache();

offlineFallback();


// Music files!
const cacheName = 'static-resources';
const matchCallback = ({ request }) =>
  request.destination === 'mp3' ||
  request.destination === 'media' ||
  request.destination === 'audio';

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);
