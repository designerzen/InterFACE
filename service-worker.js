// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"fc6d81ecdbfaf2f7661e4caf9725077d":[function(require,module,exports) {
"use strict";

var _version = require("./version");

// Not compiled so best add the ; to the es5
var ONE_DAY = 60 * 60 * 24;
var REVISION = _version.VERSION;
var BUILD_MMR = "0.0.5";
var WORKBOX_DEBUG_LOGGING = true; // Workbox version - update manually when there are new releases.

var WORKBOX_VERSION = '6.0.2'; // Cache naming and versioning.

var APP_CACHE_PREFIX = 'mct';
var APP_CACHE_SUFFIX = "v".concat(BUILD_MMR);
importScripts("https://storage.googleapis.com/workbox-cdn/releases/".concat(WORKBOX_VERSION, "/workbox-sw.js"));
workbox.setConfig({
  debug: WORKBOX_DEBUG_LOGGING
});
workbox.core.setCacheNameDetails({
  prefix: APP_CACHE_PREFIX,
  suffix: APP_CACHE_SUFFIX,
  precache: 'installtime',
  runtime: 'runtime'
});
self.addEventListener('message', function (event) {
  if (event.data && event.data.message) {
    console.log(">>> Message received from client: ", event.data);

    if (event.data.message === 'SKIP_WAITING') {
      self.skipWaiting();
    } else if (event.data.message === 'CLIENTS_CLAIM') {
      self.clients.claim();
    } else {
      debug.warning('>>>> No idea what to do with that message!');
    }
  } else {
    throw new Error("Message event handler: event.data=[".concat(event.data, "], event.data.message=[").concat(event.data.message, "]"));
  }
}); // Load caching routines

var _workbox$recipes = workbox.recipes,
    pageCache = _workbox$recipes.pageCache,
    imageCache = _workbox$recipes.imageCache,
    staticResourceCache = _workbox$recipes.staticResourceCache,
    googleFontsCache = _workbox$recipes.googleFontsCache,
    offlineFallback = _workbox$recipes.offlineFallback;
var registerRoute = workbox.routing.registerRoute;
var ExpirationPlugin = workbox.expiration.ExpirationPlugin;
var RangeRequestsPlugin = workbox.rangeRequests.RangeRequestsPlugin;
var _workbox$cacheableRes = workbox.cacheableResponse,
    CacheableResponse = _workbox$cacheableRes.CacheableResponse,
    CacheableResponsePlugin = _workbox$cacheableRes.CacheableResponsePlugin;
var precacheAndRoute = workbox.precaching.precacheAndRoute;
var _workbox$strategies = workbox.strategies,
    StaleWhileRevalidate = _workbox$strategies.StaleWhileRevalidate,
    CacheFirst = _workbox$strategies.CacheFirst; // CacheFirst - an implementation of a cache-first request strategy.
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

precacheAndRoute([{
  url: 'index.html',
  revision: REVISION
}]);
pageCache();
googleFontsCache();
staticResourceCache();
imageCache();
offlineFallback(); // Music files!

var CACHE_MEDIA = 'static-media';

var catchMedia = function catchMedia(match) {
  var request = match.request;
  var isMedia = request.destination === 'mp3' || request.destination === 'media' || request.destination === 'audio' || request.url.indexOf(".mp3") === request.url.length - 4; // console.error(isMedia, "matchCallback", {match, request, pos:request.url.indexOf(".mp3") })

  return isMedia;
};

registerRoute(catchMedia, new CacheFirst({
  cacheName: CACHE_MEDIA,
  plugins: [new CacheableResponsePlugin({
    statuses: [0, 200]
  }), new RangeRequestsPlugin()]
})); // workbox.loadModule('workbox-range-requests');
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

registerRoute(/^https:\/\/storage\.googleapis\.com\/tfhub-tfjs-modules/, new CacheFirst({
  cacheName: 'tf-models-googleapi',
  plugins: [new CacheableResponsePlugin({
    statuses: [0, 200]
  }), new ExpirationPlugin({
    // one month should be good
    maxAgeSeconds: ONE_DAY * 30
  })]
})); // https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file

registerRoute(/^https:\/\/tfhub\.dev\/mediapipe\/tfjs-model/, new CacheFirst({
  cacheName: 'tf-models-tfhub',
  plugins: [new CacheableResponsePlugin({
    statuses: [0, 200]
  }), new ExpirationPlugin({
    // one month should be good
    maxAgeSeconds: ONE_DAY * 30
  })]
})); // workbox.routing.registerRoute(
//   /^https:\/\/fonts\.googleapis\.com/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'google-fonts-stylesheets',
//   }),
// );
},{"./version":"96bbf71b97db043de13209fe2c1629cf"}],"96bbf71b97db043de13209fe2c1629cf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATE = exports.VERSION = void 0;
var VERSION = "0.24.0";
exports.VERSION = VERSION;
var DATE = "1611522094892";
exports.DATE = DATE;
},{}]},{},["fc6d81ecdbfaf2f7661e4caf9725077d"], null)

//# sourceMappingURL=service-worker.js.map
