// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
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
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];
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
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

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
})({"5GS4o":[function(require,module,exports) {
var _version = require('./version');
// Not compiled so best add the ; to the es5
const ONE_DAY = 60 * 60 * 24;
const REVISION = _version.VERSION;
const BUILD_MMR = "0.0.5";
const WORKBOX_DEBUG_LOGGING = true;
// Workbox version - update manually when there are new releases.
const WORKBOX_VERSION = '6.0.2';
// Cache naming and versioning.
const APP_CACHE_PREFIX = 'mct';
const APP_CACHE_SUFFIX = `v${BUILD_MMR}`;
importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${WORKBOX_VERSION}/workbox-sw.js`);
workbox.setConfig({
  debug: WORKBOX_DEBUG_LOGGING
});
workbox.core.setCacheNameDetails({
  prefix: APP_CACHE_PREFIX,
  suffix: APP_CACHE_SUFFIX,
  precache: 'installtime',
  runtime: 'runtime'
});
self.addEventListener('message', event => {
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
const {pageCache, imageCache, staticResourceCache, googleFontsCache, offlineFallback} = workbox.recipes;
const {registerRoute} = workbox.routing;
const {ExpirationPlugin} = workbox.expiration;
const {RangeRequestsPlugin} = workbox.rangeRequests;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;
const {precacheAndRoute} = workbox.precaching;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
// CacheFirst - an implementation of a cache-first request strategy.
// A cache first strategy is useful for assets that have been revisioned, such as URLs like /styles/example.a8f5f1.css, since they can be cached for long periods of time.
// If the network request fails, and there is no cache match, this will throw a WorkboxError exception.
// import { registerRoute } from 'workbox-routing';
// import { StaleWhileRevalidate } from 'workbox-strategies';
// import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// import {
// pageCache,
// imageCache,
// staticResourceCache,
// googleFontsCache,
// offlineFallback,
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
offlineFallback();
// Music files!
const CACHE_MEDIA = 'static-media';
const catchMedia = match => {
  const {request} = match;
  const isMedia = request.destination === 'mp3' || request.destination === 'media' || request.destination === 'audio' || request.url.indexOf(".mp3") === request.url.length - 4;
  // console.error(isMedia, "matchCallback", {match, request, pos:request.url.indexOf(".mp3") })
  return isMedia;
};
registerRoute(catchMedia, new CacheFirst({
  cacheName: CACHE_MEDIA,
  plugins: [new CacheableResponsePlugin({
    statuses: [0, 200]
  }), new RangeRequestsPlugin()]
}));
// workbox.loadModule('workbox-range-requests');
// RangeRequestsPlugin
// registerRoute(
// catchMedia,
// new StaleWhileRevalidate({
// cacheName: CACHE_MEDIA,
// plugins: [
// new CacheableResponsePlugin({
// statuses: [0, 200],
// }),
// ],
// }),
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
    // one month should be good
    maxAgeSeconds: ONE_DAY * 30
  })]
}));
// https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file
registerRoute(/^https:\/\/tfhub\.dev\/mediapipe\/tfjs-model/, new CacheFirst({
  cacheName: 'tf-models-tfhub',
  plugins: [new CacheableResponsePlugin({
    statuses: [0, 200]
  }), new ExpirationPlugin({
    // one month should be good
    // one month should be good
    maxAgeSeconds: ONE_DAY * 30
  })]
}));

},{"./version":"7Fk6F"}],"7Fk6F":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "VERSION", function () {
  return VERSION;
});
const VERSION = "0.0.21";

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"HNevC"}],"HNevC":[function(require,module,exports) {
"use strict";

exports.interopDefault = function (a) {
  return a && a.__esModule ? a : {
    default: a
  };
};

exports.defineInteropFlag = function (a) {
  Object.defineProperty(a, '__esModule', {
    value: true
  });
};

exports.exportAll = function (source, dest) {
  Object.keys(source).forEach(function (key) {
    if (key === 'default' || key === '__esModule') {
      return;
    } // Skip duplicate re-exports when they have the same value.


    if (key in dest && dest[key] === source[key]) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function () {
        return source[key];
      }
    });
  });
  return dest;
};

exports.export = function (dest, destName, get) {
  Object.defineProperty(dest, destName, {
    enumerable: true,
    get: get
  });
};
},{}]},{},["5GS4o"], "5GS4o", "parcelRequiree3fa")

//# sourceMappingURL=service-worker.js.map
