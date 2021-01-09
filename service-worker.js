import { VERSION } from './version'

// Not compiled so best add the ; to the es5
const ONE_DAY = 60 * 60 * 24;
const REVISION = VERSION;
const BUILD_MMR = "0.0.5";
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
const {ExpirationPlugin} = workbox.expiration;
const {RangeRequestsPlugin} = workbox.rangeRequests;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;
const {precacheAndRoute} = workbox.precaching;

const {StaleWhileRevalidate,CacheFirst} = workbox.strategies;
// CacheFirst - an implementation of a cache-first request strategy.
// A cache first strategy is useful for assets that have been revisioned, such as URLs like /styles/example.a8f5f1.css, since they can be cached for long periods of time.
// If the network request fails, and there is no cache match, this will throw a WorkboxError exception.

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
precacheAndRoute([ {url: 'index.html', revision:REVISION }])

pageCache();

googleFontsCache();

staticResourceCache();

imageCache();

offlineFallback();

// Music files!
const CACHE_MEDIA = 'static-media';
const catchMedia = (match) =>{
  const { request } = match
  const isMedia = 
  request.destination === 'mp3' ||
  request.destination === 'media' ||
  request.destination === 'audio' || 
  request.url.indexOf(".mp3") === request.url.length - 4;
  
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
);
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

// Cache the cloud hosted TF models as they are heavy and not local!
registerRoute(
  /^https:\/\/storage\.googleapis\.com\/tfhub-tfjs-modules/,
  new CacheFirst({
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
);
// https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file
registerRoute(
  /^https:\/\/tfhub\.dev\/mediapipe\/tfjs-model/,
  new CacheFirst({
    cacheName: 'tf-models-tfhub',
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
);



// workbox.routing.registerRoute(
//   /^https:\/\/fonts\.googleapis\.com/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'google-fonts-stylesheets',
//   }),
// );