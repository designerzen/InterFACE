// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
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

  var cache = previousRequire.cache || {};
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
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
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
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
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
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"i2Knv":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "767298212a9fba37";
module.bundle.HMR_BUNDLE_ID = "b7fd83933b57f760";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id1][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"kjt46":[function(require,module,exports) {
var _version = require("./version");
// is there a way to save and cache this locally?
// When offline it freaks out and tries to connec tot the internet?
// importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${WORKBOX_VERSION}/workbox-sw.js`);
var _workboxRouting = require("workbox-routing");
var _workboxStrategies = require("workbox-strategies");
var _workboxCore = require("workbox-core");
var _workboxRecipes = require("workbox-recipes");
var _workboxGoogleAnalytics = require("workbox-google-analytics");
// Used for filtering matches based on status code, header, or both
var _workboxCacheableResponse = require("workbox-cacheable-response");
// Used to limit entries in cache, remove entries after a certain period of time
var _workboxExpiration = require("workbox-expiration");
var _workboxRangeRequests = require("workbox-range-requests");
var _workboxPrecaching = require("workbox-precaching");
// Not compiled so best add the ; to the es5
const ONE_DAY = 86400;
const REVISION = (0, _version.VERSION);
const BUILD_MMR = (0, _version.VERSION);
const WORKBOX_DEBUG_LOGGING = true;
// Workbox version - update manually when there are new releases.
const WORKBOX_VERSION = "6.1.5";
// Cache naming and versioning.
const APP_CACHE_PREFIX = "mct";
const APP_CACHE_SUFFIX = `v${BUILD_MMR}`;
// checks for localhost anyways
// setConfig({debug: WORKBOX_DEBUG_LOGGING})
self.__WB_DISABLE_DEV_LOGS = !WORKBOX_DEBUG_LOGGING;
// https://love2dev.com/blog/how-to-uninstall-a-service-worker/
const uninstall = ()=>{
    navigator.serviceWorker.getRegistrations().then((registrations)=>{
        for (let registration of registrations)registration.unregister().then(()=>self.clients.matchAll()).then((clients)=>{
            clients.forEach((client)=>{
                if (client.url && "navigate" in client) client.navigate(client.url);
            });
        });
    });
};
(0, _workboxCore.setCacheNameDetails)({
    prefix: APP_CACHE_PREFIX,
    suffix: APP_CACHE_SUFFIX,
    precache: "installtime",
    runtime: "runtime"
});
// console.log(`>>> Workbox`,REVISION, {WORKBOX_DEBUG_LOGGING});
self.addEventListener("message", (event)=>{
    if (event.data && event.data.message) {
        console.log(`>>> Message received from client: `, event.data);
        if (event.data.message === "SKIP_WAITING") self.skipWaiting();
        else if (event.data.message === "CLIENTS_CLAIM") self.clients.claim();
        else debug.warning(">>>> No idea what to do with that message!");
    } else throw new Error(`Message event handler: event.data=[${event.data}], event.data.message=[${event.data.message}]`);
});
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
(0, _workboxPrecaching.precacheAndRoute)([
    {
        url: "index.html",
        revision: REVISION
    }
]);
(0, _workboxRecipes.pageCache)();
(0, _workboxRecipes.staticResourceCache)();
// so this aint working...
(0, _workboxRecipes.imageCache)();
// allow for this to work offline too
(0, _workboxRecipes.offlineFallback)();
// intercept offline analytics and cache for later salvaging
// googleAnalytics.initialize()
// Add Music files!
const CACHE_MEDIA = "static-media";
const catchMedia = (match)=>{
    const { request  } = match;
    const isMedia = request.destination === "mp3" || request.destination === "wav" || request.destination === "media" || request.destination === "audio" || request.url.indexOf(".mp3") === request.url.length - 4;
    request.url.indexOf(".wav"), request.url.length;
    // console.error(isMedia, "matchCallback", {match, request, pos:request.url.indexOf(".mp3") })
    return isMedia;
};
(0, _workboxRouting.registerRoute)(catchMedia, new (0, _workboxStrategies.CacheFirst)({
    cacheName: CACHE_MEDIA,
    plugins: [
        new (0, _workboxCacheableResponse.CacheableResponsePlugin)({
            statuses: [
                0,
                200
            ]
        }),
        new (0, _workboxRangeRequests.RangeRequestsPlugin)()
    ]
}));
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
// Cache the cloud hosted TF models as they are heavy and not local!
(0, _workboxRouting.registerRoute)(/^https:\/\/storage\.googleapis\.com\/tfhub-tfjs-modules/, new (0, _workboxStrategies.NetworkFirst)({
    cacheName: "tf-models-googleapi",
    plugins: [
        new (0, _workboxCacheableResponse.CacheableResponsePlugin)({
            statuses: [
                0,
                200
            ]
        }),
        new (0, _workboxExpiration.ExpirationPlugin)({
            // one month should be good
            maxAgeSeconds: ONE_DAY * 30
        }), 
    ]
}));
// https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/model.json?tfjs-format=file
(0, _workboxRouting.registerRoute)(/^https:\/\/tfhub\.dev\/mediapipe\/tfjs-model/, new (0, _workboxStrategies.NetworkFirst)({
    cacheName: "tf-models-tfhub-mediapipe",
    plugins: [
        new (0, _workboxCacheableResponse.CacheableResponsePlugin)({
            statuses: [
                0,
                200
            ]
        }),
        new (0, _workboxExpiration.ExpirationPlugin)({
            // one month should be good
            maxAgeSeconds: ONE_DAY * 30
        }), 
    ]
})) // // https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file
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
;

},{"./version":"ir1yp","workbox-routing":"hXasB","workbox-strategies":"7w0vW","workbox-core":"k0ULG","workbox-recipes":"5MkMS","workbox-google-analytics":"fjHf4","workbox-cacheable-response":"8yq0H","workbox-expiration":"kp8AJ","workbox-range-requests":"9HtdQ","workbox-precaching":"ga2G7"}],"ir1yp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
parcelHelpers.export(exports, "DATE", ()=>DATE);
const VERSION = "0.8.21";
const DATE = 1657029024493;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"jRKQF":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"hXasB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"6ECgO","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"6ECgO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-routing
 */ parcelHelpers.export(exports, "NavigationRoute", ()=>(0, _navigationRouteJs.NavigationRoute));
parcelHelpers.export(exports, "RegExpRoute", ()=>(0, _regExpRouteJs.RegExpRoute));
parcelHelpers.export(exports, "registerRoute", ()=>(0, _registerRouteJs.registerRoute));
parcelHelpers.export(exports, "Route", ()=>(0, _routeJs.Route));
parcelHelpers.export(exports, "Router", ()=>(0, _routerJs.Router));
parcelHelpers.export(exports, "setCatchHandler", ()=>(0, _setCatchHandlerJs.setCatchHandler));
parcelHelpers.export(exports, "setDefaultHandler", ()=>(0, _setDefaultHandlerJs.setDefaultHandler));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _navigationRouteJs = require("./NavigationRoute.js");
var _regExpRouteJs = require("./RegExpRoute.js");
var _registerRouteJs = require("./registerRoute.js");
var _routeJs = require("./Route.js");
var _routerJs = require("./Router.js");
var _setCatchHandlerJs = require("./setCatchHandler.js");
var _setDefaultHandlerJs = require("./setDefaultHandler.js");
var _versionJs = require("./_version.js");

},{"./NavigationRoute.js":"hdK4k","./RegExpRoute.js":"8d7e0","./registerRoute.js":"dvFuW","./Route.js":"28fs2","./Router.js":"cHzSy","./setCatchHandler.js":"klfxF","./setDefaultHandler.js":"7CKDa","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"hdK4k":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NavigationRoute", ()=>NavigationRoute);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _routeJs = require("./Route.js");
var _versionJs = require("./_version.js");
/**
 * NavigationRoute makes it easy to create a
 * {@link workbox-routing.Route} that matches for browser
 * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
 *
 * It will only match incoming Requests whose
 * {@link https://fetch.spec.whatwg.org/#concept-request-mode|mode}
 * is set to `navigate`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `denylist` and `allowlist` parameters.
 *
 * @memberof workbox-routing
 * @extends workbox-routing.Route
 */ class NavigationRoute extends (0, _routeJs.Route) {
    /**
     * If both `denylist` and `allowlist` are provided, the `denylist` will
     * take precedence and the request will not match this route.
     *
     * The regular expressions in `allowlist` and `denylist`
     * are matched against the concatenated
     * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
     * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
     * portions of the requested URL.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {Object} options
     * @param {Array<RegExp>} [options.denylist] If any of these patterns match,
     * the route will not handle the request (even if a allowlist RegExp matches).
     * @param {Array<RegExp>} [options.allowlist=[/./]] If any of these patterns
     * match the URL's pathname and search parameter, the route will handle the
     * request (assuming the denylist doesn't match).
     */ constructor(handler, { allowlist =[
        /./
    ] , denylist =[]  } = {}){
        (0, _assertJs.assert).isArrayOfClass(allowlist, RegExp, {
            moduleName: "workbox-routing",
            className: "NavigationRoute",
            funcName: "constructor",
            paramName: "options.allowlist"
        });
        (0, _assertJs.assert).isArrayOfClass(denylist, RegExp, {
            moduleName: "workbox-routing",
            className: "NavigationRoute",
            funcName: "constructor",
            paramName: "options.denylist"
        });
        super((options)=>this._match(options), handler);
        this._allowlist = allowlist;
        this._denylist = denylist;
    }
    /**
     * Routes match handler.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {Request} options.request
     * @return {boolean}
     *
     * @private
     */ _match({ url , request  }) {
        if (request && request.mode !== "navigate") return false;
        const pathnameAndSearch = url.pathname + url.search;
        for (const regExp1 of this._denylist)if (regExp1.test(pathnameAndSearch)) {
            (0, _loggerJs.logger).log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL matches this denylist pattern: ` + `${regExp1.toString()}`);
            return false;
        }
        if (this._allowlist.some((regExp)=>regExp.test(pathnameAndSearch))) {
            (0, _loggerJs.logger).debug(`The navigation route ${pathnameAndSearch} ` + `is being used.`);
            return true;
        }
        (0, _loggerJs.logger).log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL being navigated to doesn't ` + `match the allowlist.`);
        return false;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","./Route.js":"28fs2","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"5d4bq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "assert", ()=>finalAssertExports);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("../_private/WorkboxError.js");
var _versionJs = require("../_version.js");
/*
 * This method throws if the supplied value is not an array.
 * The destructed values are required to produce a meaningful error for users.
 * The destructed and restructured object is so it's clear what is
 * needed.
 */ const isArray = (value, details)=>{
    if (!Array.isArray(value)) throw new (0, _workboxErrorJs.WorkboxError)("not-an-array", details);
};
const hasMethod = (object, expectedMethod, details)=>{
    const type = typeof object[expectedMethod];
    if (type !== "function") {
        details["expectedMethod"] = expectedMethod;
        throw new (0, _workboxErrorJs.WorkboxError)("missing-a-method", details);
    }
};
const isType = (object, expectedType, details)=>{
    if (typeof object !== expectedType) {
        details["expectedType"] = expectedType;
        throw new (0, _workboxErrorJs.WorkboxError)("incorrect-type", details);
    }
};
const isInstance = (object, // Need the general type to do the check later.
// eslint-disable-next-line @typescript-eslint/ban-types
expectedClass, details)=>{
    if (!(object instanceof expectedClass)) {
        details["expectedClassName"] = expectedClass.name;
        throw new (0, _workboxErrorJs.WorkboxError)("incorrect-class", details);
    }
};
const isOneOf = (value, validValues, details)=>{
    if (!validValues.includes(value)) {
        details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
        throw new (0, _workboxErrorJs.WorkboxError)("invalid-value", details);
    }
};
const isArrayOfClass = (value, // Need general type to do check later.
expectedClass, details)=>{
    const error = new (0, _workboxErrorJs.WorkboxError)("not-array-of-class", details);
    if (!Array.isArray(value)) throw error;
    for (const item of value){
        if (!(item instanceof expectedClass)) throw error;
    }
};
const finalAssertExports = {
    hasMethod,
    isArray,
    isInstance,
    isOneOf,
    isType,
    isArrayOfClass
};

},{"../_private/WorkboxError.js":"9LeL1","../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"9LeL1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WorkboxError", ()=>WorkboxError);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _messageGeneratorJs = require("../models/messages/messageGenerator.js");
var _versionJs = require("../_version.js");
/**
 * Workbox errors should be thrown with this class.
 * This allows use to ensure the type easily in tests,
 * helps developers identify errors from workbox
 * easily and allows use to optimise error
 * messages correctly.
 *
 * @private
 */ class WorkboxError extends Error {
    /**
     *
     * @param {string} errorCode The error code that
     * identifies this particular error.
     * @param {Object=} details Any relevant arguments
     * that will help developers identify issues should
     * be added as a key on the context object.
     */ constructor(errorCode, details){
        const message = (0, _messageGeneratorJs.messageGenerator)(errorCode, details);
        super(message);
        this.name = errorCode;
        this.details = details;
    }
}

},{"../models/messages/messageGenerator.js":"2Dv1z","../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"2Dv1z":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messageGenerator", ()=>messageGenerator);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _messagesJs = require("./messages.js");
var _versionJs = require("../../_version.js");
const fallback = (code, ...args)=>{
    let msg = code;
    if (args.length > 0) msg += ` :: ${JSON.stringify(args)}`;
    return msg;
};
const generatorFunction = (code, details = {})=>{
    const message = (0, _messagesJs.messages)[code];
    if (!message) throw new Error(`Unable to find message for code '${code}'.`);
    return message(details);
};
const messageGenerator = generatorFunction;

},{"./messages.js":"hLIYZ","../../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"hLIYZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messages", ()=>messages);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../../_version.js");
const messages = {
    "invalid-value": ({ paramName , validValueDescription , value  })=>{
        if (!paramName || !validValueDescription) throw new Error(`Unexpected input to 'invalid-value' error.`);
        return `The '${paramName}' parameter was given a value with an ` + `unexpected value. ${validValueDescription} Received a value of ` + `${JSON.stringify(value)}.`;
    },
    "not-an-array": ({ moduleName , className , funcName , paramName  })=>{
        if (!moduleName || !className || !funcName || !paramName) throw new Error(`Unexpected input to 'not-an-array' error.`);
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${className}.${funcName}()' must be an array.`;
    },
    "incorrect-type": ({ expectedType , paramName , moduleName , className , funcName ,  })=>{
        if (!expectedType || !paramName || !moduleName || !funcName) throw new Error(`Unexpected input to 'incorrect-type' error.`);
        const classNameStr = className ? `${className}.` : "";
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${classNameStr}` + `${funcName}()' must be of type ${expectedType}.`;
    },
    "incorrect-class": ({ expectedClassName , paramName , moduleName , className , funcName , isReturnValueProblem ,  })=>{
        if (!expectedClassName || !moduleName || !funcName) throw new Error(`Unexpected input to 'incorrect-class' error.`);
        const classNameStr = className ? `${className}.` : "";
        if (isReturnValueProblem) return `The return value from ` + `'${moduleName}.${classNameStr}${funcName}()' ` + `must be an instance of class ${expectedClassName}.`;
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${classNameStr}${funcName}()' ` + `must be an instance of class ${expectedClassName}.`;
    },
    "missing-a-method": ({ expectedMethod , paramName , moduleName , className , funcName ,  })=>{
        if (!expectedMethod || !paramName || !moduleName || !className || !funcName) throw new Error(`Unexpected input to 'missing-a-method' error.`);
        return `${moduleName}.${className}.${funcName}() expected the ` + `'${paramName}' parameter to expose a '${expectedMethod}' method.`;
    },
    "add-to-cache-list-unexpected-type": ({ entry  })=>{
        return `An unexpected entry was passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' The entry ` + `'${JSON.stringify(entry)}' isn't supported. You must supply an array of ` + `strings with one or more characters, objects with a url property or ` + `Request objects.`;
    },
    "add-to-cache-list-conflicting-entries": ({ firstEntry , secondEntry  })=>{
        if (!firstEntry || !secondEntry) throw new Error(`Unexpected input to ` + `'add-to-cache-list-duplicate-entries' error.`);
        return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${firstEntry} but different revision details. Workbox is ` + `unable to cache and version the asset correctly. Please remove one ` + `of the entries.`;
    },
    "plugin-error-request-will-fetch": ({ thrownErrorMessage  })=>{
        if (!thrownErrorMessage) throw new Error(`Unexpected input to ` + `'plugin-error-request-will-fetch', error.`);
        return `An error was thrown by a plugins 'requestWillFetch()' method. ` + `The thrown error message was: '${thrownErrorMessage}'.`;
    },
    "invalid-cache-name": ({ cacheNameId , value  })=>{
        if (!cacheNameId) throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
        return `You must provide a name containing at least one character for ` + `setCacheDetails({${cacheNameId}: '...'}). Received a value of ` + `'${JSON.stringify(value)}'`;
    },
    "unregister-route-but-not-found-with-method": ({ method  })=>{
        if (!method) throw new Error(`Unexpected input to ` + `'unregister-route-but-not-found-with-method' error.`);
        return `The route you're trying to unregister was not  previously ` + `registered for the method type '${method}'.`;
    },
    "unregister-route-route-not-registered": ()=>{
        return `The route you're trying to unregister was not previously ` + `registered.`;
    },
    "queue-replay-failed": ({ name  })=>{
        return `Replaying the background sync queue '${name}' failed.`;
    },
    "duplicate-queue-name": ({ name  })=>{
        return `The Queue name '${name}' is already being used. ` + `All instances of backgroundSync.Queue must be given unique names.`;
    },
    "expired-test-without-max-age": ({ methodName , paramName  })=>{
        return `The '${methodName}()' method can only be used when the ` + `'${paramName}' is used in the constructor.`;
    },
    "unsupported-route-type": ({ moduleName , className , funcName , paramName  })=>{
        return `The supplied '${paramName}' parameter was an unsupported type. ` + `Please check the docs for ${moduleName}.${className}.${funcName} for ` + `valid input types.`;
    },
    "not-array-of-class": ({ value , expectedClass , moduleName , className , funcName , paramName ,  })=>{
        return `The supplied '${paramName}' parameter must be an array of ` + `'${expectedClass}' objects. Received '${JSON.stringify(value)},'. ` + `Please check the call to ${moduleName}.${className}.${funcName}() ` + `to fix the issue.`;
    },
    "max-entries-or-age-required": ({ moduleName , className , funcName  })=>{
        return `You must define either config.maxEntries or config.maxAgeSeconds` + `in ${moduleName}.${className}.${funcName}`;
    },
    "statuses-or-headers-required": ({ moduleName , className , funcName  })=>{
        return `You must define either config.statuses or config.headers` + `in ${moduleName}.${className}.${funcName}`;
    },
    "invalid-string": ({ moduleName , funcName , paramName  })=>{
        if (!paramName || !moduleName || !funcName) throw new Error(`Unexpected input to 'invalid-string' error.`);
        return `When using strings, the '${paramName}' parameter must start with ` + `'http' (for cross-origin matches) or '/' (for same-origin matches). ` + `Please see the docs for ${moduleName}.${funcName}() for ` + `more info.`;
    },
    "channel-name-required": ()=>{
        return `You must provide a channelName to construct a ` + `BroadcastCacheUpdate instance.`;
    },
    "invalid-responses-are-same-args": ()=>{
        return `The arguments passed into responsesAreSame() appear to be ` + `invalid. Please ensure valid Responses are used.`;
    },
    "expire-custom-caches-only": ()=>{
        return `You must provide a 'cacheName' property when using the ` + `expiration plugin with a runtime caching strategy.`;
    },
    "unit-must-be-bytes": ({ normalizedRangeHeader  })=>{
        if (!normalizedRangeHeader) throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
        return `The 'unit' portion of the Range header must be set to 'bytes'. ` + `The Range header provided was "${normalizedRangeHeader}"`;
    },
    "single-range-only": ({ normalizedRangeHeader  })=>{
        if (!normalizedRangeHeader) throw new Error(`Unexpected input to 'single-range-only' error.`);
        return `Multiple ranges are not supported. Please use a  single start ` + `value, and optional end value. The Range header provided was ` + `"${normalizedRangeHeader}"`;
    },
    "invalid-range-values": ({ normalizedRangeHeader  })=>{
        if (!normalizedRangeHeader) throw new Error(`Unexpected input to 'invalid-range-values' error.`);
        return `The Range header is missing both start and end values. At least ` + `one of those values is needed. The Range header provided was ` + `"${normalizedRangeHeader}"`;
    },
    "no-range-header": ()=>{
        return `No Range header was found in the Request provided.`;
    },
    "range-not-satisfiable": ({ size , start , end  })=>{
        return `The start (${start}) and end (${end}) values in the Range are ` + `not satisfiable by the cached response, which is ${size} bytes.`;
    },
    "attempt-to-cache-non-get-request": ({ url , method  })=>{
        return `Unable to cache '${url}' because it is a '${method}' request and ` + `only 'GET' requests can be cached.`;
    },
    "cache-put-with-no-response": ({ url  })=>{
        return `There was an attempt to cache '${url}' but the response was not ` + `defined.`;
    },
    "no-response": ({ url , error  })=>{
        let message = `The strategy could not generate a response for '${url}'.`;
        if (error) message += ` The underlying error is ${error}.`;
        return message;
    },
    "bad-precaching-response": ({ url , status  })=>{
        return `The precaching request for '${url}' failed` + (status ? ` with an HTTP status of ${status}.` : `.`);
    },
    "non-precached-url": ({ url  })=>{
        return `createHandlerBoundToURL('${url}') was called, but that URL is ` + `not precached. Please pass in a URL that is precached instead.`;
    },
    "add-to-cache-list-conflicting-integrities": ({ url  })=>{
        return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${url} with different integrity values. Please remove one of them.`;
    },
    "missing-precache-entry": ({ cacheName , url  })=>{
        return `Unable to find a precached response in ${cacheName} for ${url}.`;
    },
    "cross-origin-copy-response": ({ origin  })=>{
        return `workbox-core.copyResponse() can only be used with same-origin ` + `responses. It was passed a response with origin ${origin}.`;
    },
    "opaque-streams-source": ({ type  })=>{
        const message = `One of the workbox-streams sources resulted in an ` + `'${type}' response.`;
        if (type === "opaqueredirect") return `${message} Please do not use a navigation request that results ` + `in a redirect as a source.`;
        return `${message} Please ensure your sources are CORS-enabled.`;
    }
};

},{"../../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"khFa1":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:core:6.5.2"] && _();
} catch (e) {}

},{}],"fWQvD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "logger", ()=>logger);
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const logger = (()=>{
    // Don't overwrite this value if it's already set.
    // See https://github.com/GoogleChrome/workbox/pull/2284#issuecomment-560470923
    if (!("__WB_DISABLE_DEV_LOGS" in self)) self.__WB_DISABLE_DEV_LOGS = false;
    let inGroup = false;
    const methodToColorMap = {
        debug: `#7f8c8d`,
        log: `#2ecc71`,
        warn: `#f39c12`,
        error: `#c0392b`,
        groupCollapsed: `#3498db`,
        groupEnd: null
    };
    const print = function(method, args) {
        if (self.__WB_DISABLE_DEV_LOGS) return;
        if (method === "groupCollapsed") // Safari doesn't print all console.groupCollapsed() arguments:
        // https://bugs.webkit.org/show_bug.cgi?id=182754
        {
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                console[method](...args);
                return;
            }
        }
        const styles = [
            `background: ${methodToColorMap[method]}`,
            `border-radius: 0.5em`,
            `color: white`,
            `font-weight: bold`,
            `padding: 2px 0.5em`, 
        ];
        // When in a group, the workbox prefix is not displayed.
        const logPrefix = inGroup ? [] : [
            "%cworkbox",
            styles.join(";")
        ];
        console[method](...logPrefix, ...args);
        if (method === "groupCollapsed") inGroup = true;
        if (method === "groupEnd") inGroup = false;
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    const api = {};
    const loggerMethods = Object.keys(methodToColorMap);
    for (const key of loggerMethods){
        const method = key;
        api[method] = (...args)=>{
            print(method, args);
        };
    }
    return api;
})();

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"28fs2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Route", ()=>Route);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _constantsJs = require("./utils/constants.js");
var _normalizeHandlerJs = require("./utils/normalizeHandler.js");
var _versionJs = require("./_version.js");
/**
 * A `Route` consists of a pair of callback functions, "match" and "handler".
 * The "match" callback determine if a route should be used to "handle" a
 * request by returning a non-falsy value if it can. The "handler" callback
 * is called when there is a match and should return a Promise that resolves
 * to a `Response`.
 *
 * @memberof workbox-routing
 */ class Route {
    /**
     * Constructor for Route class.
     *
     * @param {workbox-routing~matchCallback} match
     * A callback function that determines whether the route matches a given
     * `fetch` event by returning a non-falsy value.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */ constructor(match, handler, method = (0, _constantsJs.defaultMethod)){
        (0, _assertJs.assert).isType(match, "function", {
            moduleName: "workbox-routing",
            className: "Route",
            funcName: "constructor",
            paramName: "match"
        });
        if (method) (0, _assertJs.assert).isOneOf(method, (0, _constantsJs.validMethods), {
            paramName: "method"
        });
        // These values are referenced directly by Router so cannot be
        // altered by minificaton.
        this.handler = (0, _normalizeHandlerJs.normalizeHandler)(handler);
        this.match = match;
        this.method = method;
    }
    /**
     *
     * @param {workbox-routing-handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response
     */ setCatchHandler(handler) {
        this.catchHandler = (0, _normalizeHandlerJs.normalizeHandler)(handler);
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","./utils/constants.js":"73VeU","./utils/normalizeHandler.js":"5io28","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"73VeU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "defaultMethod", ()=>defaultMethod);
parcelHelpers.export(exports, "validMethods", ()=>validMethods);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const defaultMethod = "GET";
const validMethods = [
    "DELETE",
    "GET",
    "HEAD",
    "PATCH",
    "POST",
    "PUT", 
];

},{"../_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7Emj8":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:routing:6.5.2"] && _();
} catch (e) {}

},{}],"5io28":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "normalizeHandler", ()=>normalizeHandler);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _versionJs = require("../_version.js");
const normalizeHandler = (handler)=>{
    if (handler && typeof handler === "object") {
        (0, _assertJs.assert).hasMethod(handler, "handle", {
            moduleName: "workbox-routing",
            className: "Route",
            funcName: "constructor",
            paramName: "handler"
        });
        return handler;
    } else {
        (0, _assertJs.assert).isType(handler, "function", {
            moduleName: "workbox-routing",
            className: "Route",
            funcName: "constructor",
            paramName: "handler"
        });
        return {
            handle: handler
        };
    }
};

},{"workbox-core/_private/assert.js":"5d4bq","../_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8d7e0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "RegExpRoute", ()=>RegExpRoute);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _routeJs = require("./Route.js");
var _versionJs = require("./_version.js");
/**
 * RegExpRoute makes it easy to create a regular expression based
 * {@link workbox-routing.Route}.
 *
 * For same-origin requests the RegExp only needs to match part of the URL. For
 * requests against third-party servers, you must define a RegExp that matches
 * the start of the URL.
 *
 * @memberof workbox-routing
 * @extends workbox-routing.Route
 */ class RegExpRoute extends (0, _routeJs.Route) {
    /**
     * If the regular expression contains
     * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
     * the captured values will be passed to the
     * {@link workbox-routing~handlerCallback} `params`
     * argument.
     *
     * @param {RegExp} regExp The regular expression to match against URLs.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */ constructor(regExp, handler, method){
        (0, _assertJs.assert).isInstance(regExp, RegExp, {
            moduleName: "workbox-routing",
            className: "RegExpRoute",
            funcName: "constructor",
            paramName: "pattern"
        });
        const match = ({ url  })=>{
            const result = regExp.exec(url.href);
            // Return immediately if there's no match.
            if (!result) return;
            // Require that the match start at the first character in the URL string
            // if it's a cross-origin request.
            // See https://github.com/GoogleChrome/workbox/issues/281 for the context
            // behind this behavior.
            if (url.origin !== location.origin && result.index !== 0) {
                (0, _loggerJs.logger).debug(`The regular expression '${regExp.toString()}' only partially matched ` + `against the cross-origin URL '${url.toString()}'. RegExpRoute's will only ` + `handle cross-origin requests if they match the entire URL.`);
                return;
            }
            // If the route matches, but there aren't any capture groups defined, then
            // this will return [], which is truthy and therefore sufficient to
            // indicate a match.
            // If there are capture groups, then it will return their values.
            return result.slice(1);
        };
        super(match, handler, method);
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","./Route.js":"28fs2","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"dvFuW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "registerRoute", ()=>registerRoute);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _routeJs = require("./Route.js");
var _regExpRouteJs = require("./RegExpRoute.js");
var _getOrCreateDefaultRouterJs = require("./utils/getOrCreateDefaultRouter.js");
var _versionJs = require("./_version.js");
/**
 * Easily register a RegExp, string, or function with a caching
 * strategy to a singleton Router instance.
 *
 * This method will generate a Route for you if needed and
 * call {@link workbox-routing.Router#registerRoute}.
 *
 * @param {RegExp|string|workbox-routing.Route~matchCallback|workbox-routing.Route} capture
 * If the capture param is a `Route`, all other arguments will be ignored.
 * @param {workbox-routing~handlerCallback} [handler] A callback
 * function that returns a Promise resulting in a Response. This parameter
 * is required if `capture` is not a `Route` object.
 * @param {string} [method='GET'] The HTTP method to match the Route
 * against.
 * @return {workbox-routing.Route} The generated `Route`.
 *
 * @memberof workbox-routing
 */ function registerRoute(capture, handler, method) {
    let route;
    if (typeof capture === "string") {
        const captureUrl = new URL(capture, location.href);
        {
            if (!(capture.startsWith("/") || capture.startsWith("http"))) throw new (0, _workboxErrorJs.WorkboxError)("invalid-string", {
                moduleName: "workbox-routing",
                funcName: "registerRoute",
                paramName: "capture"
            });
            // We want to check if Express-style wildcards are in the pathname only.
            // TODO: Remove this log message in v4.
            const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;
            // See https://github.com/pillarjs/path-to-regexp#parameters
            const wildcards = "[*:?+]";
            if (new RegExp(`${wildcards}`).exec(valueToCheck)) (0, _loggerJs.logger).debug(`The '$capture' parameter contains an Express-style wildcard ` + `character (${wildcards}). Strings are now always interpreted as ` + `exact matches; use a RegExp for partial or wildcard matches.`);
        }
        const matchCallback = ({ url  })=>{
            if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) (0, _loggerJs.logger).debug(`${capture} only partially matches the cross-origin URL ` + `${url.toString()}. This route will only handle cross-origin requests ` + `if they match the entire URL.`);
            return url.href === captureUrl.href;
        };
        // If `capture` is a string then `handler` and `method` must be present.
        route = new (0, _routeJs.Route)(matchCallback, handler, method);
    } else if (capture instanceof RegExp) // If `capture` is a `RegExp` then `handler` and `method` must be present.
    route = new (0, _regExpRouteJs.RegExpRoute)(capture, handler, method);
    else if (typeof capture === "function") // If `capture` is a function then `handler` and `method` must be present.
    route = new (0, _routeJs.Route)(capture, handler, method);
    else if (capture instanceof (0, _routeJs.Route)) route = capture;
    else throw new (0, _workboxErrorJs.WorkboxError)("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
    });
    const defaultRouter = (0, _getOrCreateDefaultRouterJs.getOrCreateDefaultRouter)();
    defaultRouter.registerRoute(route);
    return route;
}

},{"workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./Route.js":"28fs2","./RegExpRoute.js":"8d7e0","./utils/getOrCreateDefaultRouter.js":"k5RfA","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"k5RfA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getOrCreateDefaultRouter", ()=>getOrCreateDefaultRouter);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _routerJs = require("../Router.js");
var _versionJs = require("../_version.js");
let defaultRouter;
const getOrCreateDefaultRouter = ()=>{
    if (!defaultRouter) {
        defaultRouter = new (0, _routerJs.Router)();
        // The helpers that use the default Router assume these listeners exist.
        defaultRouter.addFetchListener();
        defaultRouter.addCacheListener();
    }
    return defaultRouter;
};

},{"../Router.js":"cHzSy","../_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"cHzSy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Router", ()=>Router);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _constantsJs = require("./utils/constants.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _normalizeHandlerJs = require("./utils/normalizeHandler.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _versionJs = require("./_version.js");
/**
 * The Router can be used to process a `FetchEvent` using one or more
 * {@link workbox-routing.Route}, responding with a `Response` if
 * a matching route exists.
 *
 * If no route matches a given a request, the Router will use a "default"
 * handler if one is defined.
 *
 * Should the matching Route throw an error, the Router will use a "catch"
 * handler if one is defined to gracefully deal with issues and respond with a
 * Request.
 *
 * If a request matches multiple routes, the **earliest** registered route will
 * be used to respond to the request.
 *
 * @memberof workbox-routing
 */ class Router {
    /**
     * Initializes a new Router.
     */ constructor(){
        this._routes = new Map();
        this._defaultHandlerMap = new Map();
    }
    /**
     * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
     * method name ('GET', etc.) to an array of all the corresponding `Route`
     * instances that are registered.
     */ get routes() {
        return this._routes;
    }
    /**
     * Adds a fetch event listener to respond to events when a route matches
     * the event's request.
     */ addFetchListener() {
        // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
        self.addEventListener("fetch", (event)=>{
            const { request  } = event;
            const responsePromise = this.handleRequest({
                request,
                event
            });
            if (responsePromise) event.respondWith(responsePromise);
        });
    }
    /**
     * Adds a message event listener for URLs to cache from the window.
     * This is useful to cache resources loaded on the page prior to when the
     * service worker started controlling it.
     *
     * The format of the message data sent from the window should be as follows.
     * Where the `urlsToCache` array may consist of URL strings or an array of
     * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
     *
     * ```
     * {
     *   type: 'CACHE_URLS',
     *   payload: {
     *     urlsToCache: [
     *       './script1.js',
     *       './script2.js',
     *       ['./script3.js', {mode: 'no-cors'}],
     *     ],
     *   },
     * }
     * ```
     */ addCacheListener() {
        // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
        self.addEventListener("message", (event)=>{
            // event.data is type 'any'
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (event.data && event.data.type === "CACHE_URLS") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const { payload  } = event.data;
                (0, _loggerJs.logger).debug(`Caching URLs from the window`, payload.urlsToCache);
                const requestPromises = Promise.all(payload.urlsToCache.map((entry)=>{
                    if (typeof entry === "string") entry = [
                        entry
                    ];
                    const request = new Request(...entry);
                    return this.handleRequest({
                        request,
                        event
                    });
                // TODO(philipwalton): TypeScript errors without this typecast for
                // some reason (probably a bug). The real type here should work but
                // doesn't: `Array<Promise<Response> | undefined>`.
                })); // TypeScript
                event.waitUntil(requestPromises);
                // If a MessageChannel was used, reply to the message on success.
                if (event.ports && event.ports[0]) requestPromises.then(()=>event.ports[0].postMessage(true));
            }
        });
    }
    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {Object} options
     * @param {Request} options.request The request to handle.
     * @param {ExtendableEvent} options.event The event that triggered the
     *     request.
     * @return {Promise<Response>|undefined} A promise is returned if a
     *     registered route can handle the request. If there is no matching
     *     route and there's no `defaultHandler`, `undefined` is returned.
     */ handleRequest({ request , event ,  }) {
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "handleRequest",
            paramName: "options.request"
        });
        const url = new URL(request.url, location.href);
        if (!url.protocol.startsWith("http")) {
            (0, _loggerJs.logger).debug(`Workbox Router only supports URLs that start with 'http'.`);
            return;
        }
        const sameOrigin = url.origin === location.origin;
        const { params , route  } = this.findMatchingRoute({
            event,
            request,
            sameOrigin,
            url
        });
        let handler = route && route.handler;
        const debugMessages = [];
        if (handler) {
            debugMessages.push([
                `Found a route to handle this request:`,
                route
            ]);
            if (params) debugMessages.push([
                `Passing the following params to the route's handler:`,
                params, 
            ]);
        }
        // If we don't have a handler because there was no matching route, then
        // fall back to defaultHandler if that's defined.
        const method = request.method;
        if (!handler && this._defaultHandlerMap.has(method)) {
            debugMessages.push(`Failed to find a matching route. Falling ` + `back to the default handler for ${method}.`);
            handler = this._defaultHandlerMap.get(method);
        }
        if (!handler) {
            // No handler so Workbox will do nothing. If logs is set of debug
            // i.e. verbose, we should print out this information.
            (0, _loggerJs.logger).debug(`No route found for: ${(0, _getFriendlyURLJs.getFriendlyURL)(url)}`);
            return;
        }
        // We have a handler, meaning Workbox is going to handle the route.
        // print the routing details to the console.
        (0, _loggerJs.logger).groupCollapsed(`Router is responding to: ${(0, _getFriendlyURLJs.getFriendlyURL)(url)}`);
        debugMessages.forEach((msg)=>{
            if (Array.isArray(msg)) (0, _loggerJs.logger).log(...msg);
            else (0, _loggerJs.logger).log(msg);
        });
        (0, _loggerJs.logger).groupEnd();
        // Wrap in try and catch in case the handle method throws a synchronous
        // error. It should still callback to the catch handler.
        let responsePromise;
        try {
            responsePromise = handler.handle({
                url,
                request,
                event,
                params
            });
        } catch (err1) {
            responsePromise = Promise.reject(err1);
        }
        // Get route's catch handler, if it exists
        const catchHandler = route && route.catchHandler;
        if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) responsePromise = responsePromise.catch(async (err)=>{
            // If there's a route catch handler, process that first
            if (catchHandler) {
                // Still include URL here as it will be async from the console group
                // and may not make sense without the URL
                (0, _loggerJs.logger).groupCollapsed(`Error thrown when responding to: ` + ` ${(0, _getFriendlyURLJs.getFriendlyURL)(url)}. Falling back to route's Catch Handler.`);
                (0, _loggerJs.logger).error(`Error thrown by:`, route);
                (0, _loggerJs.logger).error(err);
                (0, _loggerJs.logger).groupEnd();
                try {
                    return await catchHandler.handle({
                        url,
                        request,
                        event,
                        params
                    });
                } catch (catchErr) {
                    if (catchErr instanceof Error) err = catchErr;
                }
            }
            if (this._catchHandler) {
                // Still include URL here as it will be async from the console group
                // and may not make sense without the URL
                (0, _loggerJs.logger).groupCollapsed(`Error thrown when responding to: ` + ` ${(0, _getFriendlyURLJs.getFriendlyURL)(url)}. Falling back to global Catch Handler.`);
                (0, _loggerJs.logger).error(`Error thrown by:`, route);
                (0, _loggerJs.logger).error(err);
                (0, _loggerJs.logger).groupEnd();
                return this._catchHandler.handle({
                    url,
                    request,
                    event
                });
            }
            throw err;
        });
        return responsePromise;
    }
    /**
     * Checks a request and URL (and optionally an event) against the list of
     * registered routes, and if there's a match, returns the corresponding
     * route along with any params generated by the match.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {boolean} options.sameOrigin The result of comparing `url.origin`
     *     against the current origin.
     * @param {Request} options.request The request to match.
     * @param {Event} options.event The corresponding event.
     * @return {Object} An object with `route` and `params` properties.
     *     They are populated if a matching route was found or `undefined`
     *     otherwise.
     */ findMatchingRoute({ url , sameOrigin , request , event ,  }) {
        const routes = this._routes.get(request.method) || [];
        for (const route of routes){
            let params;
            // route.match returns type any, not possible to change right now.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const matchResult = route.match({
                url,
                sameOrigin,
                request,
                event
            });
            if (matchResult) {
                // Warn developers that using an async matchCallback is almost always
                // not the right thing to do.
                if (matchResult instanceof Promise) (0, _loggerJs.logger).warn(`While routing ${(0, _getFriendlyURLJs.getFriendlyURL)(url)}, an async ` + `matchCallback function was used. Please convert the ` + `following route to use a synchronous matchCallback function:`, route);
                // See https://github.com/GoogleChrome/workbox/issues/2079
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                params = matchResult;
                if (Array.isArray(params) && params.length === 0) // Instead of passing an empty array in as params, use undefined.
                params = undefined;
                else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) // Instead of passing an empty object in as params, use undefined.
                params = undefined;
                else if (typeof matchResult === "boolean") // For the boolean value true (rather than just something truth-y),
                // don't set params.
                // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353
                params = undefined;
                // Return early if have a match.
                return {
                    route,
                    params
                };
            }
        }
        // If no match was found above, return and empty object.
        return {};
    }
    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to associate with this
     * default handler. Each method has its own default.
     */ setDefaultHandler(handler, method = (0, _constantsJs.defaultMethod)) {
        this._defaultHandlerMap.set(method, (0, _normalizeHandlerJs.normalizeHandler)(handler));
    }
    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */ setCatchHandler(handler) {
        this._catchHandler = (0, _normalizeHandlerJs.normalizeHandler)(handler);
    }
    /**
     * Registers a route with the router.
     *
     * @param {workbox-routing.Route} route The route to register.
     */ registerRoute(route) {
        (0, _assertJs.assert).isType(route, "object", {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "registerRoute",
            paramName: "route"
        });
        (0, _assertJs.assert).hasMethod(route, "match", {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "registerRoute",
            paramName: "route"
        });
        (0, _assertJs.assert).isType(route.handler, "object", {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "registerRoute",
            paramName: "route"
        });
        (0, _assertJs.assert).hasMethod(route.handler, "handle", {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "registerRoute",
            paramName: "route.handler"
        });
        (0, _assertJs.assert).isType(route.method, "string", {
            moduleName: "workbox-routing",
            className: "Router",
            funcName: "registerRoute",
            paramName: "route.method"
        });
        if (!this._routes.has(route.method)) this._routes.set(route.method, []);
        // Give precedence to all of the earlier routes by adding this additional
        // route to the end of the array.
        this._routes.get(route.method).push(route);
    }
    /**
     * Unregisters a route with the router.
     *
     * @param {workbox-routing.Route} route The route to unregister.
     */ unregisterRoute(route) {
        if (!this._routes.has(route.method)) throw new (0, _workboxErrorJs.WorkboxError)("unregister-route-but-not-found-with-method", {
            method: route.method
        });
        const routeIndex = this._routes.get(route.method).indexOf(route);
        if (routeIndex > -1) this._routes.get(route.method).splice(routeIndex, 1);
        else throw new (0, _workboxErrorJs.WorkboxError)("unregister-route-route-not-registered");
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/getFriendlyURL.js":"b3dxx","./utils/constants.js":"73VeU","workbox-core/_private/logger.js":"fWQvD","./utils/normalizeHandler.js":"5io28","workbox-core/_private/WorkboxError.js":"9LeL1","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"b3dxx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getFriendlyURL", ()=>getFriendlyURL);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const getFriendlyURL = (url)=>{
    const urlObj = new URL(String(url), location.href);
    // See https://github.com/GoogleChrome/workbox/issues/2323
    // We want to include everything, except for the origin if it's same-origin.
    return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"klfxF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setCatchHandler", ()=>setCatchHandler);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreateDefaultRouterJs = require("./utils/getOrCreateDefaultRouter.js");
var _versionJs = require("./_version.js");
/**
 * If a Route throws an error while handling a request, this `handler`
 * will be called and given a chance to provide a response.
 *
 * @param {workbox-routing~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @memberof workbox-routing
 */ function setCatchHandler(handler) {
    const defaultRouter = (0, _getOrCreateDefaultRouterJs.getOrCreateDefaultRouter)();
    defaultRouter.setCatchHandler(handler);
}

},{"./utils/getOrCreateDefaultRouter.js":"k5RfA","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7CKDa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setDefaultHandler", ()=>setDefaultHandler);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreateDefaultRouterJs = require("./utils/getOrCreateDefaultRouter.js");
var _versionJs = require("./_version.js");
/**
 * Define a default `handler` that's called when no routes explicitly
 * match the incoming request.
 *
 * Without a default handler, unmatched requests will go against the
 * network as if there were no service worker present.
 *
 * @param {workbox-routing~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @memberof workbox-routing
 */ function setDefaultHandler(handler) {
    const defaultRouter = (0, _getOrCreateDefaultRouterJs.getOrCreateDefaultRouter)();
    defaultRouter.setDefaultHandler(handler);
}

},{"./utils/getOrCreateDefaultRouter.js":"k5RfA","./_version.js":"7Emj8","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7w0vW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"kAK6f","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"kAK6f":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @module workbox-strategies
 */ parcelHelpers.export(exports, "CacheFirst", ()=>(0, _cacheFirstJs.CacheFirst));
parcelHelpers.export(exports, "CacheOnly", ()=>(0, _cacheOnlyJs.CacheOnly));
parcelHelpers.export(exports, "NetworkFirst", ()=>(0, _networkFirstJs.NetworkFirst));
parcelHelpers.export(exports, "NetworkOnly", ()=>(0, _networkOnlyJs.NetworkOnly));
parcelHelpers.export(exports, "StaleWhileRevalidate", ()=>(0, _staleWhileRevalidateJs.StaleWhileRevalidate));
parcelHelpers.export(exports, "Strategy", ()=>(0, _strategyJs.Strategy));
parcelHelpers.export(exports, "StrategyHandler", ()=>(0, _strategyHandlerJs.StrategyHandler));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheFirstJs = require("./CacheFirst.js");
var _cacheOnlyJs = require("./CacheOnly.js");
var _networkFirstJs = require("./NetworkFirst.js");
var _networkOnlyJs = require("./NetworkOnly.js");
var _staleWhileRevalidateJs = require("./StaleWhileRevalidate.js");
var _strategyJs = require("./Strategy.js");
var _strategyHandlerJs = require("./StrategyHandler.js");
var _versionJs = require("./_version.js");

},{"./CacheFirst.js":"59ubY","./CacheOnly.js":"2eyqc","./NetworkFirst.js":"1meNY","./NetworkOnly.js":"1k3Yw","./StaleWhileRevalidate.js":"8wQ3g","./Strategy.js":"fYouC","./StrategyHandler.js":"k8Xyv","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"59ubY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheFirst", ()=>CacheFirst);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _strategyJs = require("./Strategy.js");
var _messagesJs = require("./utils/messages.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a [cache-first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network)
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */ class CacheFirst extends (0, _strategyJs.Strategy) {
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        const logs = [];
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "makeRequest",
            paramName: "request"
        });
        let response = await handler.cacheMatch(request);
        let error = undefined;
        if (!response) {
            logs.push(`No response found in the '${this.cacheName}' cache. ` + `Will respond with a network request.`);
            try {
                response = await handler.fetchAndCachePut(request);
            } catch (err) {
                if (err instanceof Error) error = err;
            }
            {
                if (response) logs.push(`Got response from network.`);
                else logs.push(`Unable to get a response from the network.`);
            }
        } else logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
        (0, _loggerJs.logger).groupCollapsed((0, _messagesJs.messages).strategyStart(this.constructor.name, request));
        for (const log of logs)(0, _loggerJs.logger).log(log);
        (0, _messagesJs.messages).printFinalResponse(response);
        (0, _loggerJs.logger).groupEnd();
        if (!response) throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
            url: request.url,
            error
        });
        return response;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./Strategy.js":"fYouC","./utils/messages.js":"eZ5aQ","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"fYouC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Strategy", ()=>Strategy) /**
 * Classes extending the `Strategy` based class should implement this method,
 * and leverage the {@link workbox-strategies.StrategyHandler}
 * arg to perform all fetching and cache logic, which will ensure all relevant
 * cache, cache options, fetch options and plugins are used (per the current
 * strategy instance).
 *
 * @name _handle
 * @instance
 * @abstract
 * @function
 * @param {Request} request
 * @param {workbox-strategies.StrategyHandler} handler
 * @return {Promise<Response>}
 *
 * @memberof workbox-strategies.Strategy
 */ ;
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _strategyHandlerJs = require("./StrategyHandler.js");
var _versionJs = require("./_version.js");
/**
 * An abstract base class that all other strategy classes must extend from:
 *
 * @memberof workbox-strategies
 */ class Strategy {
    /**
     * Creates a new instance of the strategy and sets all documented option
     * properties as public instance properties.
     *
     * Note: if a custom strategy class extends the base Strategy class and does
     * not need more than these properties, it does not need to define its own
     * constructor.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     */ constructor(options = {}){
        /**
         * Cache name to store and retrieve
         * requests. Defaults to the cache names provided by
         * {@link workbox-core.cacheNames}.
         *
         * @type {string}
         */ this.cacheName = (0, _cacheNamesJs.cacheNames).getRuntimeName(options.cacheName);
        /**
         * The list
         * [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
         * used by this strategy.
         *
         * @type {Array<Object>}
         */ this.plugins = options.plugins || [];
        /**
         * Values passed along to the
         * [`init`]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters}
         * of all fetch() requests made by this strategy.
         *
         * @type {Object}
         */ this.fetchOptions = options.fetchOptions;
        /**
         * The
         * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
         * for any `cache.match()` or `cache.put()` calls made by this strategy.
         *
         * @type {Object}
         */ this.matchOptions = options.matchOptions;
    }
    /**
     * Perform a request strategy and returns a `Promise` that will resolve with
     * a `Response`, invoking all relevant plugin callbacks.
     *
     * When a strategy instance is registered with a Workbox
     * {@link workbox-routing.Route}, this method is automatically
     * called when the route matches.
     *
     * Alternatively, this method can be used in a standalone `FetchEvent`
     * listener by passing it to `event.respondWith()`.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     */ handle(options) {
        const [responseDone] = this.handleAll(options);
        return responseDone;
    }
    /**
     * Similar to {@link workbox-strategies.Strategy~handle}, but
     * instead of just returning a `Promise` that resolves to a `Response` it
     * it will return an tuple of `[response, done]` promises, where the former
     * (`response`) is equivalent to what `handle()` returns, and the latter is a
     * Promise that will resolve once any promises that were added to
     * `event.waitUntil()` as part of performing the strategy have completed.
     *
     * You can await the `done` promise to ensure any extra work performed by
     * the strategy (usually caching responses) completes successfully.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     * @return {Array<Promise>} A tuple of [response, done]
     *     promises that can be used to determine when the response resolves as
     *     well as when the handler has completed all its work.
     */ handleAll(options) {
        // Allow for flexible options to be passed.
        if (options instanceof FetchEvent) options = {
            event: options,
            request: options.request
        };
        const event = options.event;
        const request = typeof options.request === "string" ? new Request(options.request) : options.request;
        const params = "params" in options ? options.params : undefined;
        const handler = new (0, _strategyHandlerJs.StrategyHandler)(this, {
            event,
            request,
            params
        });
        const responseDone = this._getResponse(handler, request, event);
        const handlerDone = this._awaitComplete(responseDone, handler, request, event);
        // Return an array of promises, suitable for use with Promise.all().
        return [
            responseDone,
            handlerDone
        ];
    }
    async _getResponse(handler, request, event) {
        await handler.runCallbacks("handlerWillStart", {
            event,
            request
        });
        let response = undefined;
        try {
            response = await this._handle(request, handler);
            // The "official" Strategy subclasses all throw this error automatically,
            // but in case a third-party Strategy doesn't, ensure that we have a
            // consistent failure when there's no response or an error response.
            if (!response || response.type === "error") throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
                url: request.url
            });
        } catch (error) {
            if (error instanceof Error) for (const callback of handler.iterateCallbacks("handlerDidError")){
                response = await callback({
                    error,
                    event,
                    request
                });
                if (response) break;
            }
            if (!response) throw error;
            else (0, _loggerJs.logger).log(`While responding to '${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}', ` + `an ${error instanceof Error ? error.toString() : ""} error occurred. Using a fallback response provided by ` + `a handlerDidError plugin.`);
        }
        for (const callback of handler.iterateCallbacks("handlerWillRespond"))response = await callback({
            event,
            request,
            response
        });
        return response;
    }
    async _awaitComplete(responseDone, handler, request, event) {
        let response;
        let error;
        try {
            response = await responseDone;
        } catch (error1) {
        // Ignore errors, as response errors should be caught via the `response`
        // promise above. The `done` promise will only throw for errors in
        // promises passed to `handler.waitUntil()`.
        }
        try {
            await handler.runCallbacks("handlerDidRespond", {
                event,
                request,
                response
            });
            await handler.doneWaiting();
        } catch (waitUntilError) {
            if (waitUntilError instanceof Error) error = waitUntilError;
        }
        await handler.runCallbacks("handlerDidComplete", {
            event,
            request,
            response,
            error: error
        });
        handler.destroy();
        if (error) throw error;
    }
}

},{"workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/getFriendlyURL.js":"b3dxx","./StrategyHandler.js":"k8Xyv","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"6rn2w":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cacheNames", ()=>cacheNames);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const _cacheNameDetails = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: typeof registration !== "undefined" ? registration.scope : ""
};
const _createCacheName = (cacheName)=>{
    return [
        _cacheNameDetails.prefix,
        cacheName,
        _cacheNameDetails.suffix
    ].filter((value)=>value && value.length > 0).join("-");
};
const eachCacheNameDetail = (fn)=>{
    for (const key of Object.keys(_cacheNameDetails))fn(key);
};
const cacheNames = {
    updateDetails: (details)=>{
        eachCacheNameDetail((key)=>{
            if (typeof details[key] === "string") _cacheNameDetails[key] = details[key];
        });
    },
    getGoogleAnalyticsName: (userCacheName)=>{
        return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
    },
    getPrecacheName: (userCacheName)=>{
        return userCacheName || _createCacheName(_cacheNameDetails.precache);
    },
    getPrefix: ()=>{
        return _cacheNameDetails.prefix;
    },
    getRuntimeName: (userCacheName)=>{
        return userCacheName || _createCacheName(_cacheNameDetails.runtime);
    },
    getSuffix: ()=>{
        return _cacheNameDetails.suffix;
    }
};

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"k8Xyv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "StrategyHandler", ()=>StrategyHandler);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _cacheMatchIgnoreParamsJs = require("workbox-core/_private/cacheMatchIgnoreParams.js");
var _deferredJs = require("workbox-core/_private/Deferred.js");
var _executeQuotaErrorCallbacksJs = require("workbox-core/_private/executeQuotaErrorCallbacks.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _timeoutJs = require("workbox-core/_private/timeout.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _versionJs = require("./_version.js");
function toRequest(input) {
    return typeof input === "string" ? new Request(input) : input;
}
/**
 * A class created every time a Strategy instance instance calls
 * {@link workbox-strategies.Strategy~handle} or
 * {@link workbox-strategies.Strategy~handleAll} that wraps all fetch and
 * cache actions around plugin callbacks and keeps track of when the strategy
 * is "done" (i.e. all added `event.waitUntil()` promises have resolved).
 *
 * @memberof workbox-strategies
 */ class StrategyHandler {
    /**
     * Creates a new instance associated with the passed strategy and event
     * that's handling the request.
     *
     * The constructor also initializes the state that will be passed to each of
     * the plugins handling this request.
     *
     * @param {workbox-strategies.Strategy} strategy
     * @param {Object} options
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params] The return value from the
     *     {@link workbox-routing~matchCallback} (if applicable).
     */ constructor(strategy, options){
        this._cacheKeys = {};
        (0, _assertJs.assert).isInstance(options.event, ExtendableEvent, {
            moduleName: "workbox-strategies",
            className: "StrategyHandler",
            funcName: "constructor",
            paramName: "options.event"
        });
        Object.assign(this, options);
        this.event = options.event;
        this._strategy = strategy;
        this._handlerDeferred = new (0, _deferredJs.Deferred)();
        this._extendLifetimePromises = [];
        // Copy the plugins list (since it's mutable on the strategy),
        // so any mutations don't affect this handler instance.
        this._plugins = [
            ...strategy.plugins
        ];
        this._pluginStateMap = new Map();
        for (const plugin of this._plugins)this._pluginStateMap.set(plugin, {});
        this.event.waitUntil(this._handlerDeferred.promise);
    }
    /**
     * Fetches a given request (and invokes any applicable plugin callback
     * methods) using the `fetchOptions` (for non-navigation requests) and
     * `plugins` defined on the `Strategy` object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - `requestWillFetch()`
     * - `fetchDidSucceed()`
     * - `fetchDidFail()`
     *
     * @param {Request|string} input The URL or request to fetch.
     * @return {Promise<Response>}
     */ async fetch(input) {
        const { event  } = this;
        let request = toRequest(input);
        if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
            const possiblePreloadResponse = await event.preloadResponse;
            if (possiblePreloadResponse) {
                (0, _loggerJs.logger).log(`Using a preloaded navigation response for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}'`);
                return possiblePreloadResponse;
            }
        }
        // If there is a fetchDidFail plugin, we need to save a clone of the
        // original request before it's either modified by a requestWillFetch
        // plugin or before the original request's body is consumed via fetch().
        const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
        try {
            for (const cb of this.iterateCallbacks("requestWillFetch"))request = await cb({
                request: request.clone(),
                event
            });
        } catch (err) {
            if (err instanceof Error) throw new (0, _workboxErrorJs.WorkboxError)("plugin-error-request-will-fetch", {
                thrownErrorMessage: err.message
            });
        }
        // The request can be altered by plugins with `requestWillFetch` making
        // the original request (most likely from a `fetch` event) different
        // from the Request we make. Pass both to `fetchDidFail` to aid debugging.
        const pluginFilteredRequest = request.clone();
        try {
            let fetchResponse;
            // See https://github.com/GoogleChrome/workbox/issues/1796
            fetchResponse = await fetch(request, request.mode === "navigate" ? undefined : this._strategy.fetchOptions);
            (0, _loggerJs.logger).debug(`Network request for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}' returned a response with ` + `status '${fetchResponse.status}'.`);
            for (const callback of this.iterateCallbacks("fetchDidSucceed"))fetchResponse = await callback({
                event,
                request: pluginFilteredRequest,
                response: fetchResponse
            });
            return fetchResponse;
        } catch (error) {
            (0, _loggerJs.logger).log(`Network request for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}' threw an error.`, error);
            // `originalRequest` will only exist if a `fetchDidFail` callback
            // is being used (see above).
            if (originalRequest) await this.runCallbacks("fetchDidFail", {
                error: error,
                event,
                originalRequest: originalRequest.clone(),
                request: pluginFilteredRequest.clone()
            });
            throw error;
        }
    }
    /**
     * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
     * the response generated by `this.fetch()`.
     *
     * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
     * so you do not have to manually call `waitUntil()` on the event.
     *
     * @param {Request|string} input The request or URL to fetch and cache.
     * @return {Promise<Response>}
     */ async fetchAndCachePut(input) {
        const response = await this.fetch(input);
        const responseClone = response.clone();
        this.waitUntil(this.cachePut(input, responseClone));
        return response;
    }
    /**
     * Matches a request from the cache (and invokes any applicable plugin
     * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
     * defined on the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cachedResponseWillByUsed()
     *
     * @param {Request|string} key The Request or URL to use as the cache key.
     * @return {Promise<Response|undefined>} A matching response, if found.
     */ async cacheMatch(key) {
        const request = toRequest(key);
        let cachedResponse;
        const { cacheName , matchOptions  } = this._strategy;
        const effectiveRequest = await this.getCacheKey(request, "read");
        const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), {
            cacheName
        });
        cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
        {
            if (cachedResponse) (0, _loggerJs.logger).debug(`Found a cached response in '${cacheName}'.`);
            else (0, _loggerJs.logger).debug(`No cached response found in '${cacheName}'.`);
        }
        for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed"))cachedResponse = await callback({
            cacheName,
            matchOptions,
            cachedResponse,
            request: effectiveRequest,
            event: this.event
        }) || undefined;
        return cachedResponse;
    }
    /**
     * Puts a request/response pair in the cache (and invokes any applicable
     * plugin callback methods) using the `cacheName` and `plugins` defined on
     * the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cacheWillUpdate()
     * - cacheDidUpdate()
     *
     * @param {Request|string} key The request or URL to use as the cache key.
     * @param {Response} response The response to cache.
     * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
     * not be cached, and `true` otherwise.
     */ async cachePut(key, response) {
        const request = toRequest(key);
        // Run in the next task to avoid blocking other cache reads.
        // https://github.com/w3c/ServiceWorker/issues/1397
        await (0, _timeoutJs.timeout)(0);
        const effectiveRequest = await this.getCacheKey(request, "write");
        {
            if (effectiveRequest.method && effectiveRequest.method !== "GET") throw new (0, _workboxErrorJs.WorkboxError)("attempt-to-cache-non-get-request", {
                url: (0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url),
                method: effectiveRequest.method
            });
            // See https://github.com/GoogleChrome/workbox/issues/2818
            const vary = response.headers.get("Vary");
            if (vary) (0, _loggerJs.logger).debug(`The response for ${(0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url)} ` + `has a 'Vary: ${vary}' header. ` + `Consider setting the {ignoreVary: true} option on your strategy ` + `to ensure cache matching and deletion works as expected.`);
        }
        if (!response) {
            (0, _loggerJs.logger).error(`Cannot cache non-existent response for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url)}'.`);
            throw new (0, _workboxErrorJs.WorkboxError)("cache-put-with-no-response", {
                url: (0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url)
            });
        }
        const responseToCache = await this._ensureResponseSafeToCache(response);
        if (!responseToCache) {
            (0, _loggerJs.logger).debug(`Response '${(0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url)}' ` + `will not be cached.`, responseToCache);
            return false;
        }
        const { cacheName , matchOptions  } = this._strategy;
        const cache = await self.caches.open(cacheName);
        const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
        const oldResponse = hasCacheUpdateCallback ? await (0, _cacheMatchIgnoreParamsJs.cacheMatchIgnoreParams)(// TODO(philipwalton): the `__WB_REVISION__` param is a precaching
        // feature. Consider into ways to only add this behavior if using
        // precaching.
        cache, effectiveRequest.clone(), [
            "__WB_REVISION__"
        ], matchOptions) : null;
        (0, _loggerJs.logger).debug(`Updating the '${cacheName}' cache with a new Response ` + `for ${(0, _getFriendlyURLJs.getFriendlyURL)(effectiveRequest.url)}.`);
        try {
            await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
        } catch (error) {
            if (error instanceof Error) {
                // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
                if (error.name === "QuotaExceededError") await (0, _executeQuotaErrorCallbacksJs.executeQuotaErrorCallbacks)();
                throw error;
            }
        }
        for (const callback of this.iterateCallbacks("cacheDidUpdate"))await callback({
            cacheName,
            oldResponse,
            newResponse: responseToCache.clone(),
            request: effectiveRequest,
            event: this.event
        });
        return true;
    }
    /**
     * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
     * executes any of those callbacks found in sequence. The final `Request`
     * object returned by the last plugin is treated as the cache key for cache
     * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
     * been registered, the passed request is returned unmodified
     *
     * @param {Request} request
     * @param {string} mode
     * @return {Promise<Request>}
     */ async getCacheKey(request, mode) {
        const key = `${request.url} | ${mode}`;
        if (!this._cacheKeys[key]) {
            let effectiveRequest = request;
            for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed"))effectiveRequest = toRequest(await callback({
                mode,
                request: effectiveRequest,
                event: this.event,
                // params has a type any can't change right now.
                params: this.params
            }));
            this._cacheKeys[key] = effectiveRequest;
        }
        return this._cacheKeys[key];
    }
    /**
     * Returns true if the strategy has at least one plugin with the given
     * callback.
     *
     * @param {string} name The name of the callback to check for.
     * @return {boolean}
     */ hasCallback(name) {
        for (const plugin of this._strategy.plugins){
            if (name in plugin) return true;
        }
        return false;
    }
    /**
     * Runs all plugin callbacks matching the given name, in order, passing the
     * given param object (merged ith the current plugin state) as the only
     * argument.
     *
     * Note: since this method runs all plugins, it's not suitable for cases
     * where the return value of a callback needs to be applied prior to calling
     * the next callback. See
     * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
     * below for how to handle that case.
     *
     * @param {string} name The name of the callback to run within each plugin.
     * @param {Object} param The object to pass as the first (and only) param
     *     when executing each callback. This object will be merged with the
     *     current plugin state prior to callback execution.
     */ async runCallbacks(name, param) {
        for (const callback of this.iterateCallbacks(name))// TODO(philipwalton): not sure why `any` is needed. It seems like
        // this should work with `as WorkboxPluginCallbackParam[C]`.
        await callback(param);
    }
    /**
     * Accepts a callback and returns an iterable of matching plugin callbacks,
     * where each callback is wrapped with the current handler state (i.e. when
     * you call each callback, whatever object parameter you pass it will
     * be merged with the plugin's current state).
     *
     * @param {string} name The name fo the callback to run
     * @return {Array<Function>}
     */ *iterateCallbacks(name) {
        for (const plugin of this._strategy.plugins)if (typeof plugin[name] === "function") {
            const state = this._pluginStateMap.get(plugin);
            const statefulCallback = (param)=>{
                const statefulParam = Object.assign(Object.assign({}, param), {
                    state
                });
                // TODO(philipwalton): not sure why `any` is needed. It seems like
                // this should work with `as WorkboxPluginCallbackParam[C]`.
                return plugin[name](statefulParam);
            };
            yield statefulCallback;
        }
    }
    /**
     * Adds a promise to the
     * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
     * of the event event associated with the request being handled (usually a
     * `FetchEvent`).
     *
     * Note: you can await
     * {@link workbox-strategies.StrategyHandler~doneWaiting}
     * to know when all added promises have settled.
     *
     * @param {Promise} promise A promise to add to the extend lifetime promises
     *     of the event that triggered the request.
     */ waitUntil(promise) {
        this._extendLifetimePromises.push(promise);
        return promise;
    }
    /**
     * Returns a promise that resolves once all promises passed to
     * {@link workbox-strategies.StrategyHandler~waitUntil}
     * have settled.
     *
     * Note: any work done after `doneWaiting()` settles should be manually
     * passed to an event's `waitUntil()` method (not this handler's
     * `waitUntil()` method), otherwise the service worker thread my be killed
     * prior to your work completing.
     */ async doneWaiting() {
        let promise;
        while(promise = this._extendLifetimePromises.shift())await promise;
    }
    /**
     * Stops running the strategy and immediately resolves any pending
     * `waitUntil()` promises.
     */ destroy() {
        this._handlerDeferred.resolve(null);
    }
    /**
     * This method will call cacheWillUpdate on the available plugins (or use
     * status === 200) to determine if the Response is safe and valid to cache.
     *
     * @param {Request} options.request
     * @param {Response} options.response
     * @return {Promise<Response|undefined>}
     *
     * @private
     */ async _ensureResponseSafeToCache(response) {
        let responseToCache = response;
        let pluginsUsed = false;
        for (const callback of this.iterateCallbacks("cacheWillUpdate")){
            responseToCache = await callback({
                request: this.request,
                response: responseToCache,
                event: this.event
            }) || undefined;
            pluginsUsed = true;
            if (!responseToCache) break;
        }
        if (!pluginsUsed) {
            if (responseToCache && responseToCache.status !== 200) responseToCache = undefined;
            if (responseToCache) {
                if (responseToCache.status !== 200) {
                    if (responseToCache.status === 0) (0, _loggerJs.logger).warn(`The response for '${this.request.url}' ` + `is an opaque response. The caching strategy that you're ` + `using will not cache opaque responses by default.`);
                    else (0, _loggerJs.logger).debug(`The response for '${this.request.url}' ` + `returned a status code of '${response.status}' and won't ` + `be cached as a result.`);
                }
            }
        }
        return responseToCache;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/cacheMatchIgnoreParams.js":"2uzoO","workbox-core/_private/Deferred.js":"81GzX","workbox-core/_private/executeQuotaErrorCallbacks.js":"jiuQc","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/timeout.js":"8pcQM","workbox-core/_private/WorkboxError.js":"9LeL1","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"2uzoO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cacheMatchIgnoreParams", ()=>cacheMatchIgnoreParams);
/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
function stripParams(fullURL, ignoreParams) {
    const strippedURL = new URL(fullURL);
    for (const param of ignoreParams)strippedURL.searchParams.delete(param);
    return strippedURL.href;
}
/**
 * Matches an item in the cache, ignoring specific URL params. This is similar
 * to the `ignoreSearch` option, but it allows you to ignore just specific
 * params (while continuing to match on the others).
 *
 * @private
 * @param {Cache} cache
 * @param {Request} request
 * @param {Object} matchOptions
 * @param {Array<string>} ignoreParams
 * @return {Promise<Response|undefined>}
 */ async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
    const strippedRequestURL = stripParams(request.url, ignoreParams);
    // If the request doesn't include any ignored params, match as normal.
    if (request.url === strippedRequestURL) return cache.match(request, matchOptions);
    // Otherwise, match by comparing keys
    const keysOptions = Object.assign(Object.assign({}, matchOptions), {
        ignoreSearch: true
    });
    const cacheKeys = await cache.keys(request, keysOptions);
    for (const cacheKey of cacheKeys){
        const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
        if (strippedRequestURL === strippedCacheKeyURL) return cache.match(cacheKey, matchOptions);
    }
    return;
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"81GzX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Deferred", ()=>Deferred);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
/**
 * The Deferred class composes Promises in a way that allows for them to be
 * resolved or rejected from outside the constructor. In most cases promises
 * should be used directly, but Deferreds can be necessary when the logic to
 * resolve a promise must be separate.
 *
 * @private
 */ class Deferred {
    /**
     * Creates a promise and exposes its resolve and reject functions as methods.
     */ constructor(){
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"jiuQc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "executeQuotaErrorCallbacks", ()=>executeQuotaErrorCallbacks);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("../_private/logger.js");
var _quotaErrorCallbacksJs = require("../models/quotaErrorCallbacks.js");
var _versionJs = require("../_version.js");
/**
 * Runs all of the callback functions, one at a time sequentially, in the order
 * in which they were registered.
 *
 * @memberof workbox-core
 * @private
 */ async function executeQuotaErrorCallbacks() {
    (0, _loggerJs.logger).log(`About to run ${(0, _quotaErrorCallbacksJs.quotaErrorCallbacks).size} ` + `callbacks to clean up caches.`);
    for (const callback of (0, _quotaErrorCallbacksJs.quotaErrorCallbacks)){
        await callback();
        (0, _loggerJs.logger).log(callback, "is complete.");
    }
    (0, _loggerJs.logger).log("Finished running callbacks.");
}

},{"../_private/logger.js":"fWQvD","../models/quotaErrorCallbacks.js":"gKuzc","../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gKuzc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "quotaErrorCallbacks", ()=>quotaErrorCallbacks);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
// Callbacks to be executed whenever there's a quota error.
// Can't change Function type right now.
// eslint-disable-next-line @typescript-eslint/ban-types
const quotaErrorCallbacks = new Set();

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8pcQM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Returns a promise that resolves and the passed number of milliseconds.
 * This utility is an async/await-friendly version of `setTimeout`.
 *
 * @param {number} ms
 * @return {Promise}
 * @private
 */ parcelHelpers.export(exports, "timeout", ()=>timeout);
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
function timeout(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"jxFLw":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:strategies:6.5.2"] && _();
} catch (e) {}

},{}],"eZ5aQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messages", ()=>messages);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("workbox-core/_private/logger.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _versionJs = require("../_version.js");
const messages = {
    strategyStart: (strategyName, request)=>`Using ${strategyName} to respond to '${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}'`,
    printFinalResponse: (response)=>{
        if (response) {
            (0, _loggerJs.logger).groupCollapsed(`View the final response here.`);
            (0, _loggerJs.logger).log(response || "[No response returned]");
            (0, _loggerJs.logger).groupEnd();
        }
    }
};

},{"workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/getFriendlyURL.js":"b3dxx","../_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"2eyqc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheOnly", ()=>CacheOnly);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _strategyJs = require("./Strategy.js");
var _messagesJs = require("./utils/messages.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a [cache-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If there is no cache match, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */ class CacheOnly extends (0, _strategyJs.Strategy) {
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "makeRequest",
            paramName: "request"
        });
        const response = await handler.cacheMatch(request);
        (0, _loggerJs.logger).groupCollapsed((0, _messagesJs.messages).strategyStart(this.constructor.name, request));
        if (response) {
            (0, _loggerJs.logger).log(`Found a cached response in the '${this.cacheName}' ` + `cache.`);
            (0, _messagesJs.messages).printFinalResponse(response);
        } else (0, _loggerJs.logger).log(`No response found in the '${this.cacheName}' cache.`);
        (0, _loggerJs.logger).groupEnd();
        if (!response) throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
            url: request.url
        });
        return response;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./Strategy.js":"fYouC","./utils/messages.js":"eZ5aQ","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1meNY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NetworkFirst", ()=>NetworkFirst);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _cacheOkAndOpaquePluginJs = require("./plugins/cacheOkAndOpaquePlugin.js");
var _strategyJs = require("./Strategy.js");
var _messagesJs = require("./utils/messages.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a
 * [network first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache)
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */ class NetworkFirst extends (0, _strategyJs.Strategy) {
    /**
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
     * @param {number} [options.networkTimeoutSeconds] If set, any network requests
     * that fail to respond within the timeout will fallback to the cache.
     *
     * This option can be used to combat
     * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
     * scenarios.
     */ constructor(options = {}){
        super(options);
        // If this instance contains no plugins with a 'cacheWillUpdate' callback,
        // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
        if (!this.plugins.some((p)=>"cacheWillUpdate" in p)) this.plugins.unshift((0, _cacheOkAndOpaquePluginJs.cacheOkAndOpaquePlugin));
        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
        if (this._networkTimeoutSeconds) (0, _assertJs.assert).isType(this._networkTimeoutSeconds, "number", {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "constructor",
            paramName: "networkTimeoutSeconds"
        });
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        const logs = [];
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "handle",
            paramName: "makeRequest"
        });
        const promises = [];
        let timeoutId;
        if (this._networkTimeoutSeconds) {
            const { id , promise  } = this._getTimeoutPromise({
                request,
                logs,
                handler
            });
            timeoutId = id;
            promises.push(promise);
        }
        const networkPromise = this._getNetworkPromise({
            timeoutId,
            request,
            logs,
            handler
        });
        promises.push(networkPromise);
        const response = await handler.waitUntil((async ()=>{
            // Promise.race() will resolve as soon as the first promise resolves.
            return await handler.waitUntil(Promise.race(promises)) || await networkPromise;
        })());
        (0, _loggerJs.logger).groupCollapsed((0, _messagesJs.messages).strategyStart(this.constructor.name, request));
        for (const log of logs)(0, _loggerJs.logger).log(log);
        (0, _messagesJs.messages).printFinalResponse(response);
        (0, _loggerJs.logger).groupEnd();
        if (!response) throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
            url: request.url
        });
        return response;
    }
    /**
     * @param {Object} options
     * @param {Request} options.request
     * @param {Array} options.logs A reference to the logs array
     * @param {Event} options.event
     * @return {Promise<Response>}
     *
     * @private
     */ _getTimeoutPromise({ request , logs , handler ,  }) {
        let timeoutId;
        const timeoutPromise = new Promise((resolve)=>{
            const onNetworkTimeout = async ()=>{
                logs.push(`Timing out the network response at ` + `${this._networkTimeoutSeconds} seconds.`);
                resolve(await handler.cacheMatch(request));
            };
            timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1000);
        });
        return {
            promise: timeoutPromise,
            id: timeoutId
        };
    }
    /**
     * @param {Object} options
     * @param {number|undefined} options.timeoutId
     * @param {Request} options.request
     * @param {Array} options.logs A reference to the logs Array.
     * @param {Event} options.event
     * @return {Promise<Response>}
     *
     * @private
     */ async _getNetworkPromise({ timeoutId , request , logs , handler ,  }) {
        let error;
        let response;
        try {
            response = await handler.fetchAndCachePut(request);
        } catch (fetchError) {
            if (fetchError instanceof Error) error = fetchError;
        }
        if (timeoutId) clearTimeout(timeoutId);
        {
            if (response) logs.push(`Got response from network.`);
            else logs.push(`Unable to get a response from the network. Will respond ` + `with a cached response.`);
        }
        if (error || !response) {
            response = await handler.cacheMatch(request);
            {
                if (response) logs.push(`Found a cached response in the '${this.cacheName}'` + ` cache.`);
                else logs.push(`No response found in the '${this.cacheName}' cache.`);
            }
        }
        return response;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./plugins/cacheOkAndOpaquePlugin.js":"dqsEF","./Strategy.js":"fYouC","./utils/messages.js":"eZ5aQ","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"dqsEF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cacheOkAndOpaquePlugin", ()=>cacheOkAndOpaquePlugin);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const cacheOkAndOpaquePlugin = {
    /**
     * Returns a valid response (to allow caching) if the status is 200 (OK) or
     * 0 (opaque).
     *
     * @param {Object} options
     * @param {Response} options.response
     * @return {Response|null}
     *
     * @private
     */ cacheWillUpdate: async ({ response  })=>{
        if (response.status === 200 || response.status === 0) return response;
        return null;
    }
};

},{"../_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1k3Yw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NetworkOnly", ()=>NetworkOnly);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _timeoutJs = require("workbox-core/_private/timeout.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _strategyJs = require("./Strategy.js");
var _messagesJs = require("./utils/messages.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a
 * [network-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If the network request fails, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */ class NetworkOnly extends (0, _strategyJs.Strategy) {
    /**
     * @param {Object} [options]
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {number} [options.networkTimeoutSeconds] If set, any network requests
     * that fail to respond within the timeout will result in a network error.
     */ constructor(options = {}){
        super(options);
        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "_handle",
            paramName: "request"
        });
        let error = undefined;
        let response;
        try {
            const promises = [
                handler.fetch(request), 
            ];
            if (this._networkTimeoutSeconds) {
                const timeoutPromise = (0, _timeoutJs.timeout)(this._networkTimeoutSeconds * 1000);
                promises.push(timeoutPromise);
            }
            response = await Promise.race(promises);
            if (!response) throw new Error(`Timed out the network response after ` + `${this._networkTimeoutSeconds} seconds.`);
        } catch (err) {
            if (err instanceof Error) error = err;
        }
        (0, _loggerJs.logger).groupCollapsed((0, _messagesJs.messages).strategyStart(this.constructor.name, request));
        if (response) (0, _loggerJs.logger).log(`Got response from network.`);
        else (0, _loggerJs.logger).log(`Unable to get a response from the network.`);
        (0, _messagesJs.messages).printFinalResponse(response);
        (0, _loggerJs.logger).groupEnd();
        if (!response) throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
            url: request.url,
            error
        });
        return response;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/timeout.js":"8pcQM","workbox-core/_private/WorkboxError.js":"9LeL1","./Strategy.js":"fYouC","./utils/messages.js":"eZ5aQ","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8wQ3g":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "StaleWhileRevalidate", ()=>StaleWhileRevalidate);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _cacheOkAndOpaquePluginJs = require("./plugins/cacheOkAndOpaquePlugin.js");
var _strategyJs = require("./Strategy.js");
var _messagesJs = require("./utils/messages.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a
 * [stale-while-revalidate](https://developer.chrome.com/docs/workbox/reference/workbox-strategies/#type-StaleWhileRevalidate)
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel.
 * The strategy will respond with the cached version if available, otherwise
 * wait for the network response. The cache is updated with the network response
 * with each successful request.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
 * Opaque responses are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */ class StaleWhileRevalidate extends (0, _strategyJs.Strategy) {
    /**
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
     */ constructor(options = {}){
        super(options);
        // If this instance contains no plugins with a 'cacheWillUpdate' callback,
        // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
        if (!this.plugins.some((p)=>"cacheWillUpdate" in p)) this.plugins.unshift((0, _cacheOkAndOpaquePluginJs.cacheOkAndOpaquePlugin));
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        const logs = [];
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "handle",
            paramName: "request"
        });
        const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(()=>{
        // Swallow this error because a 'no-response' error will be thrown in
        // main handler return flow. This will be in the `waitUntil()` flow.
        });
        handler.waitUntil(fetchAndCachePromise);
        let response = await handler.cacheMatch(request);
        let error;
        if (response) logs.push(`Found a cached response in the '${this.cacheName}'` + ` cache. Will update with the network response in the background.`);
        else {
            logs.push(`No response found in the '${this.cacheName}' cache. ` + `Will wait for the network response.`);
            try {
                // NOTE(philipwalton): Really annoying that we have to type cast here.
                // https://github.com/microsoft/TypeScript/issues/20006
                response = await fetchAndCachePromise;
            } catch (err) {
                if (err instanceof Error) error = err;
            }
        }
        (0, _loggerJs.logger).groupCollapsed((0, _messagesJs.messages).strategyStart(this.constructor.name, request));
        for (const log of logs)(0, _loggerJs.logger).log(log);
        (0, _messagesJs.messages).printFinalResponse(response);
        (0, _loggerJs.logger).groupEnd();
        if (!response) throw new (0, _workboxErrorJs.WorkboxError)("no-response", {
            url: request.url,
            error
        });
        return response;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./plugins/cacheOkAndOpaquePlugin.js":"dqsEF","./Strategy.js":"fYouC","./utils/messages.js":"eZ5aQ","./_version.js":"jxFLw","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"k0ULG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"fSiND","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"fSiND":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * All of the Workbox service worker libraries use workbox-core for shared
 * code as well as setting default values that need to be shared (like cache
 * names).
 *
 * @module workbox-core
 */ parcelHelpers.export(exports, "_private", ()=>_privateJs);
parcelHelpers.export(exports, "cacheNames", ()=>(0, _cacheNamesJs.cacheNames));
parcelHelpers.export(exports, "clientsClaim", ()=>(0, _clientsClaimJs.clientsClaim));
parcelHelpers.export(exports, "copyResponse", ()=>(0, _copyResponseJs.copyResponse));
parcelHelpers.export(exports, "registerQuotaErrorCallback", ()=>(0, _registerQuotaErrorCallbackJs.registerQuotaErrorCallback));
parcelHelpers.export(exports, "setCacheNameDetails", ()=>(0, _setCacheNameDetailsJs.setCacheNameDetails));
parcelHelpers.export(exports, "skipWaiting", ()=>(0, _skipWaitingJs.skipWaiting));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _registerQuotaErrorCallbackJs = require("./registerQuotaErrorCallback.js");
var _privateJs = require("./_private.js");
var _cacheNamesJs = require("./cacheNames.js");
var _copyResponseJs = require("./copyResponse.js");
var _clientsClaimJs = require("./clientsClaim.js");
var _setCacheNameDetailsJs = require("./setCacheNameDetails.js");
var _skipWaitingJs = require("./skipWaiting.js");
var _versionJs = require("./_version.js");
var _typesJs = require("./types.js");
parcelHelpers.exportAll(_typesJs, exports);

},{"./registerQuotaErrorCallback.js":"ip8ok","./_private.js":"eQevB","./cacheNames.js":"hVxRW","./copyResponse.js":"3pgMm","./clientsClaim.js":"g7VvV","./setCacheNameDetails.js":"80MEX","./skipWaiting.js":"logUX","./_version.js":"khFa1","./types.js":"3YMnB","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"ip8ok":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "registerQuotaErrorCallback", ()=>registerQuotaErrorCallback);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("./_private/logger.js");
var _assertJs = require("./_private/assert.js");
var _quotaErrorCallbacksJs = require("./models/quotaErrorCallbacks.js");
var _versionJs = require("./_version.js");
/**
 * Adds a function to the set of quotaErrorCallbacks that will be executed if
 * there's a quota error.
 *
 * @param {Function} callback
 * @memberof workbox-core
 */ // Can't change Function type
// eslint-disable-next-line @typescript-eslint/ban-types
function registerQuotaErrorCallback(callback) {
    (0, _assertJs.assert).isType(callback, "function", {
        moduleName: "workbox-core",
        funcName: "register",
        paramName: "callback"
    });
    (0, _quotaErrorCallbacksJs.quotaErrorCallbacks).add(callback);
    (0, _loggerJs.logger).log("Registered a callback to respond to quota errors.", callback);
}

},{"./_private/logger.js":"fWQvD","./_private/assert.js":"5d4bq","./models/quotaErrorCallbacks.js":"gKuzc","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"eQevB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "assert", ()=>(0, _assertJs.assert));
parcelHelpers.export(exports, "cacheMatchIgnoreParams", ()=>(0, _cacheMatchIgnoreParamsJs.cacheMatchIgnoreParams));
parcelHelpers.export(exports, "cacheNames", ()=>(0, _cacheNamesJs.cacheNames));
parcelHelpers.export(exports, "canConstructReadableStream", ()=>(0, _canConstructReadableStreamJs.canConstructReadableStream));
parcelHelpers.export(exports, "canConstructResponseFromBodyStream", ()=>(0, _canConstructResponseFromBodyStreamJs.canConstructResponseFromBodyStream));
parcelHelpers.export(exports, "dontWaitFor", ()=>(0, _dontWaitForJs.dontWaitFor));
parcelHelpers.export(exports, "Deferred", ()=>(0, _deferredJs.Deferred));
parcelHelpers.export(exports, "executeQuotaErrorCallbacks", ()=>(0, _executeQuotaErrorCallbacksJs.executeQuotaErrorCallbacks));
parcelHelpers.export(exports, "getFriendlyURL", ()=>(0, _getFriendlyURLJs.getFriendlyURL));
parcelHelpers.export(exports, "logger", ()=>(0, _loggerJs.logger));
parcelHelpers.export(exports, "resultingClientExists", ()=>(0, _resultingClientExistsJs.resultingClientExists));
parcelHelpers.export(exports, "timeout", ()=>(0, _timeoutJs.timeout));
parcelHelpers.export(exports, "waitUntil", ()=>(0, _waitUntilJs.waitUntil));
parcelHelpers.export(exports, "WorkboxError", ()=>(0, _workboxErrorJs.WorkboxError));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ // We either expose defaults or we expose every named export.
var _assertJs = require("./_private/assert.js");
var _cacheNamesJs = require("./_private/cacheNames.js");
var _cacheMatchIgnoreParamsJs = require("./_private/cacheMatchIgnoreParams.js");
var _canConstructReadableStreamJs = require("./_private/canConstructReadableStream.js");
var _canConstructResponseFromBodyStreamJs = require("./_private/canConstructResponseFromBodyStream.js");
var _dontWaitForJs = require("./_private/dontWaitFor.js");
var _deferredJs = require("./_private/Deferred.js");
var _executeQuotaErrorCallbacksJs = require("./_private/executeQuotaErrorCallbacks.js");
var _getFriendlyURLJs = require("./_private/getFriendlyURL.js");
var _loggerJs = require("./_private/logger.js");
var _resultingClientExistsJs = require("./_private/resultingClientExists.js");
var _timeoutJs = require("./_private/timeout.js");
var _waitUntilJs = require("./_private/waitUntil.js");
var _workboxErrorJs = require("./_private/WorkboxError.js");
var _versionJs = require("./_version.js");

},{"./_private/assert.js":"5d4bq","./_private/cacheNames.js":"6rn2w","./_private/cacheMatchIgnoreParams.js":"2uzoO","./_private/canConstructReadableStream.js":"5DuV3","./_private/canConstructResponseFromBodyStream.js":"420s3","./_private/dontWaitFor.js":"9UKT0","./_private/Deferred.js":"81GzX","./_private/executeQuotaErrorCallbacks.js":"jiuQc","./_private/getFriendlyURL.js":"b3dxx","./_private/logger.js":"fWQvD","./_private/resultingClientExists.js":"imvNv","./_private/timeout.js":"8pcQM","./_private/waitUntil.js":"4qs3c","./_private/WorkboxError.js":"9LeL1","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"5DuV3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "canConstructReadableStream", ()=>canConstructReadableStream);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
let supportStatus;
/**
 * A utility function that determines whether the current browser supports
 * constructing a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * object.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `ReadableStream`, `false` otherwise.
 *
 * @private
 */ function canConstructReadableStream() {
    if (supportStatus === undefined) // See https://github.com/GoogleChrome/workbox/issues/1473
    try {
        new ReadableStream({
            start () {}
        });
        supportStatus = true;
    } catch (error) {
        supportStatus = false;
    }
    return supportStatus;
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"420s3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "canConstructResponseFromBodyStream", ()=>canConstructResponseFromBodyStream);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
let supportStatus;
/**
 * A utility function that determines whether the current browser supports
 * constructing a new `Response` from a `response.body` stream.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `Response` from a `response.body` stream, `false` otherwise.
 *
 * @private
 */ function canConstructResponseFromBodyStream() {
    if (supportStatus === undefined) {
        const testResponse = new Response("");
        if ("body" in testResponse) try {
            new Response(testResponse.body);
            supportStatus = true;
        } catch (error) {
            supportStatus = false;
        }
        supportStatus = false;
    }
    return supportStatus;
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"9UKT0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * A helper function that prevents a promise from being flagged as unused.
 *
 * @private
 **/ parcelHelpers.export(exports, "dontWaitFor", ()=>dontWaitFor);
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
function dontWaitFor(promise) {
    promise.then(()=>{});
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"imvNv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Returns a promise that resolves to a window client matching the passed
 * `resultingClientId`. For browsers that don't support `resultingClientId`
 * or if waiting for the resulting client to apper takes too long, resolve to
 * `undefined`.
 *
 * @param {string} [resultingClientId]
 * @return {Promise<Client|undefined>}
 * @private
 */ parcelHelpers.export(exports, "resultingClientExists", ()=>resultingClientExists);
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _timeoutJs = require("./timeout.js");
var _versionJs = require("../_version.js");
const MAX_RETRY_TIME = 2000;
async function resultingClientExists(resultingClientId) {
    if (!resultingClientId) return;
    let existingWindows = await self.clients.matchAll({
        type: "window"
    });
    const existingWindowIds = new Set(existingWindows.map((w)=>w.id));
    let resultingWindow;
    const startTime = performance.now();
    // Only wait up to `MAX_RETRY_TIME` to find a matching client.
    while(performance.now() - startTime < MAX_RETRY_TIME){
        existingWindows = await self.clients.matchAll({
            type: "window"
        });
        resultingWindow = existingWindows.find((w)=>{
            if (resultingClientId) // If we have a `resultingClientId`, we can match on that.
            return w.id === resultingClientId;
            else // Otherwise match on finding a window not in `existingWindowIds`.
            return !existingWindowIds.has(w.id);
        });
        if (resultingWindow) break;
        // Sleep for 100ms and retry.
        await (0, _timeoutJs.timeout)(100);
    }
    return resultingWindow;
}

},{"./timeout.js":"8pcQM","../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"4qs3c":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "waitUntil", ()=>waitUntil);
/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
/**
 * A utility method that makes it easier to use `event.waitUntil` with
 * async functions and return the result.
 *
 * @param {ExtendableEvent} event
 * @param {Function} asyncFn
 * @return {Function}
 * @private
 */ function waitUntil(event, asyncFn) {
    const returnPromise = asyncFn();
    event.waitUntil(returnPromise);
    return returnPromise;
}

},{"../_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"hVxRW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cacheNames", ()=>cacheNames);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheNamesJs = require("./_private/cacheNames.js");
var _versionJs = require("./_version.js");
/**
 * Get the current cache names and prefix/suffix used by Workbox.
 *
 * `cacheNames.precache` is used for precached assets,
 * `cacheNames.googleAnalytics` is used by `workbox-google-analytics` to
 * store `analytics.js`, and `cacheNames.runtime` is used for everything else.
 *
 * `cacheNames.prefix` can be used to retrieve just the current prefix value.
 * `cacheNames.suffix` can be used to retrieve just the current suffix value.
 *
 * @return {Object} An object with `precache`, `runtime`, `prefix`, and
 *     `googleAnalytics` properties.
 *
 * @memberof workbox-core
 */ const cacheNames = {
    get googleAnalytics () {
        return (0, _cacheNamesJs.cacheNames).getGoogleAnalyticsName();
    },
    get precache () {
        return (0, _cacheNamesJs.cacheNames).getPrecacheName();
    },
    get prefix () {
        return (0, _cacheNamesJs.cacheNames).getPrefix();
    },
    get runtime () {
        return (0, _cacheNamesJs.cacheNames).getRuntimeName();
    },
    get suffix () {
        return (0, _cacheNamesJs.cacheNames).getSuffix();
    }
};

},{"./_private/cacheNames.js":"6rn2w","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"3pgMm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "copyResponse", ()=>copyResponse);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _canConstructResponseFromBodyStreamJs = require("./_private/canConstructResponseFromBodyStream.js");
var _workboxErrorJs = require("./_private/WorkboxError.js");
var _versionJs = require("./_version.js");
/**
 * Allows developers to copy a response and modify its `headers`, `status`,
 * or `statusText` values (the values settable via a
 * [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
 * object in the constructor).
 * To modify these values, pass a function as the second argument. That
 * function will be invoked with a single object with the response properties
 * `{headers, status, statusText}`. The return value of this function will
 * be used as the `ResponseInit` for the new `Response`. To change the values
 * either modify the passed parameter(s) and return it, or return a totally
 * new object.
 *
 * This method is intentionally limited to same-origin responses, regardless of
 * whether CORS was used or not.
 *
 * @param {Response} response
 * @param {Function} modifier
 * @memberof workbox-core
 */ async function copyResponse(response, modifier) {
    let origin = null;
    // If response.url isn't set, assume it's cross-origin and keep origin null.
    if (response.url) {
        const responseURL = new URL(response.url);
        origin = responseURL.origin;
    }
    if (origin !== self.location.origin) throw new (0, _workboxErrorJs.WorkboxError)("cross-origin-copy-response", {
        origin
    });
    const clonedResponse = response.clone();
    // Create a fresh `ResponseInit` object by cloning the headers.
    const responseInit = {
        headers: new Headers(clonedResponse.headers),
        status: clonedResponse.status,
        statusText: clonedResponse.statusText
    };
    // Apply any user modifications.
    const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
    // Create the new response from the body stream and `ResponseInit`
    // modifications. Note: not all browsers support the Response.body stream,
    // so fall back to reading the entire body into memory as a blob.
    const body = (0, _canConstructResponseFromBodyStreamJs.canConstructResponseFromBodyStream)() ? clonedResponse.body : await clonedResponse.blob();
    return new Response(body, modifiedResponseInit);
}

},{"./_private/canConstructResponseFromBodyStream.js":"420s3","./_private/WorkboxError.js":"9LeL1","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"g7VvV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clientsClaim", ()=>clientsClaim);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("./_version.js");
/**
 * Claim any currently available clients once the service worker
 * becomes active. This is normally used in conjunction with `skipWaiting()`.
 *
 * @memberof workbox-core
 */ function clientsClaim() {
    self.addEventListener("activate", ()=>self.clients.claim());
}

},{"./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"80MEX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setCacheNameDetails", ()=>setCacheNameDetails);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("./_private/assert.js");
var _cacheNamesJs = require("./_private/cacheNames.js");
var _workboxErrorJs = require("./_private/WorkboxError.js");
var _versionJs = require("./_version.js");
/**
 * Modifies the default cache names used by the Workbox packages.
 * Cache names are generated as `<prefix>-<Cache Name>-<suffix>`.
 *
 * @param {Object} details
 * @param {Object} [details.prefix] The string to add to the beginning of
 *     the precache and runtime cache names.
 * @param {Object} [details.suffix] The string to add to the end of
 *     the precache and runtime cache names.
 * @param {Object} [details.precache] The cache name to use for precache
 *     caching.
 * @param {Object} [details.runtime] The cache name to use for runtime caching.
 * @param {Object} [details.googleAnalytics] The cache name to use for
 *     `workbox-google-analytics` caching.
 *
 * @memberof workbox-core
 */ function setCacheNameDetails(details) {
    Object.keys(details).forEach((key)=>{
        (0, _assertJs.assert).isType(details[key], "string", {
            moduleName: "workbox-core",
            funcName: "setCacheNameDetails",
            paramName: `details.${key}`
        });
    });
    if ("precache" in details && details["precache"].length === 0) throw new (0, _workboxErrorJs.WorkboxError)("invalid-cache-name", {
        cacheNameId: "precache",
        value: details["precache"]
    });
    if ("runtime" in details && details["runtime"].length === 0) throw new (0, _workboxErrorJs.WorkboxError)("invalid-cache-name", {
        cacheNameId: "runtime",
        value: details["runtime"]
    });
    if ("googleAnalytics" in details && details["googleAnalytics"].length === 0) throw new (0, _workboxErrorJs.WorkboxError)("invalid-cache-name", {
        cacheNameId: "googleAnalytics",
        value: details["googleAnalytics"]
    });
    (0, _cacheNamesJs.cacheNames).updateDetails(details);
}

},{"./_private/assert.js":"5d4bq","./_private/cacheNames.js":"6rn2w","./_private/WorkboxError.js":"9LeL1","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"logUX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "skipWaiting", ()=>skipWaiting);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("./_private/logger.js");
var _versionJs = require("./_version.js");
/**
 * This method is deprecated, and will be removed in Workbox v7.
 *
 * Calling self.skipWaiting() is equivalent, and should be used instead.
 *
 * @memberof workbox-core
 */ function skipWaiting() {
    (0, _loggerJs.logger).warn(`skipWaiting() from workbox-core is no longer recommended ` + `and will be removed in Workbox v7. Using self.skipWaiting() instead ` + `is equivalent.`);
    self.skipWaiting();
}

},{"./_private/logger.js":"fWQvD","./_version.js":"khFa1","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"3YMnB":[function(require,module,exports) {
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("./_version.js");

},{"./_version.js":"khFa1"}],"5MkMS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"lqj4i","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"lqj4i":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-recipes
 */ parcelHelpers.export(exports, "googleFontsCache", ()=>(0, _googleFontsCache.googleFontsCache));
parcelHelpers.export(exports, "imageCache", ()=>(0, _imageCache.imageCache));
parcelHelpers.export(exports, "offlineFallback", ()=>(0, _offlineFallback.offlineFallback));
parcelHelpers.export(exports, "pageCache", ()=>(0, _pageCache.pageCache));
parcelHelpers.export(exports, "staticResourceCache", ()=>(0, _staticResourceCache.staticResourceCache));
parcelHelpers.export(exports, "warmStrategyCache", ()=>(0, _warmStrategyCache.warmStrategyCache));
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _googleFontsCache = require("./googleFontsCache");
var _imageCache = require("./imageCache");
var _staticResourceCache = require("./staticResourceCache");
var _pageCache = require("./pageCache");
var _offlineFallback = require("./offlineFallback");
var _warmStrategyCache = require("./warmStrategyCache");
var _versionJs = require("./_version.js");

},{"./googleFontsCache":"J17ax","./imageCache":"3axmv","./staticResourceCache":"hcSFK","./pageCache":"4UCTF","./offlineFallback":"8y10k","./warmStrategyCache":"iia02","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"J17ax":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "googleFontsCache", ()=>googleFontsCache);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _registerRouteJs = require("workbox-routing/registerRoute.js");
var _staleWhileRevalidateJs = require("workbox-strategies/StaleWhileRevalidate.js");
var _cacheFirstJs = require("workbox-strategies/CacheFirst.js");
var _cacheableResponsePluginJs = require("workbox-cacheable-response/CacheableResponsePlugin.js");
var _expirationPluginJs = require("workbox-expiration/ExpirationPlugin.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of the [Google fonts]{@link https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts} caching recipe
 *
 * @memberof workbox-recipes
 *
 * @param {Object} [options]
 * @param {string} [options.cachePrefix] Cache prefix for caching stylesheets and webfonts. Defaults to google-fonts
 * @param {number} [options.maxAgeSeconds] Maximum age, in seconds, that font entries will be cached for. Defaults to 1 year
 * @param {number} [options.maxEntries] Maximum number of fonts that will be cached. Defaults to 30
 */ function googleFontsCache(options = {}) {
    const sheetCacheName = `${options.cachePrefix || "google-fonts"}-stylesheets`;
    const fontCacheName = `${options.cachePrefix || "google-fonts"}-webfonts`;
    const maxAgeSeconds = options.maxAgeSeconds || 31536000;
    const maxEntries = options.maxEntries || 30;
    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    (0, _registerRouteJs.registerRoute)(({ url  })=>url.origin === "https://fonts.googleapis.com", new (0, _staleWhileRevalidateJs.StaleWhileRevalidate)({
        cacheName: sheetCacheName
    }));
    // Cache the underlying font files with a cache-first strategy for 1 year.
    (0, _registerRouteJs.registerRoute)(({ url  })=>url.origin === "https://fonts.gstatic.com", new (0, _cacheFirstJs.CacheFirst)({
        cacheName: fontCacheName,
        plugins: [
            new (0, _cacheableResponsePluginJs.CacheableResponsePlugin)({
                statuses: [
                    0,
                    200
                ]
            }),
            new (0, _expirationPluginJs.ExpirationPlugin)({
                maxAgeSeconds,
                maxEntries
            }), 
        ]
    }));
}

},{"workbox-routing/registerRoute.js":"dvFuW","workbox-strategies/StaleWhileRevalidate.js":"8wQ3g","workbox-strategies/CacheFirst.js":"59ubY","workbox-cacheable-response/CacheableResponsePlugin.js":"j45rR","workbox-expiration/ExpirationPlugin.js":"hOAi4","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"j45rR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheableResponsePlugin", ()=>CacheableResponsePlugin);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheableResponseJs = require("./CacheableResponse.js");
var _versionJs = require("./_version.js");
/**
 * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
 * easier to add in cacheability checks to requests made via Workbox's built-in
 * strategies.
 *
 * @memberof workbox-cacheable-response
 */ class CacheableResponsePlugin {
    /**
     * To construct a new CacheableResponsePlugin instance you must provide at
     * least one of the `config` properties.
     *
     * If both `statuses` and `headers` are specified, then both conditions must
     * be met for the `Response` to be considered cacheable.
     *
     * @param {Object} config
     * @param {Array<number>} [config.statuses] One or more status codes that a
     * `Response` can have and be considered cacheable.
     * @param {Object<string,string>} [config.headers] A mapping of header names
     * and expected values that a `Response` can have and be considered cacheable.
     * If multiple headers are provided, only one needs to be present.
     */ constructor(config){
        /**
         * @param {Object} options
         * @param {Response} options.response
         * @return {Response|null}
         * @private
         */ this.cacheWillUpdate = async ({ response  })=>{
            if (this._cacheableResponse.isResponseCacheable(response)) return response;
            return null;
        };
        this._cacheableResponse = new (0, _cacheableResponseJs.CacheableResponse)(config);
    }
}

},{"./CacheableResponse.js":"9Pixv","./_version.js":"7EtJe","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"9Pixv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheableResponse", ()=>CacheableResponse);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _versionJs = require("./_version.js");
/**
 * This class allows you to set up rules determining what
 * status codes and/or headers need to be present in order for a
 * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * to be considered cacheable.
 *
 * @memberof workbox-cacheable-response
 */ class CacheableResponse {
    /**
     * To construct a new CacheableResponse instance you must provide at least
     * one of the `config` properties.
     *
     * If both `statuses` and `headers` are specified, then both conditions must
     * be met for the `Response` to be considered cacheable.
     *
     * @param {Object} config
     * @param {Array<number>} [config.statuses] One or more status codes that a
     * `Response` can have and be considered cacheable.
     * @param {Object<string,string>} [config.headers] A mapping of header names
     * and expected values that a `Response` can have and be considered cacheable.
     * If multiple headers are provided, only one needs to be present.
     */ constructor(config = {}){
        if (!(config.statuses || config.headers)) throw new (0, _workboxErrorJs.WorkboxError)("statuses-or-headers-required", {
            moduleName: "workbox-cacheable-response",
            className: "CacheableResponse",
            funcName: "constructor"
        });
        if (config.statuses) (0, _assertJs.assert).isArray(config.statuses, {
            moduleName: "workbox-cacheable-response",
            className: "CacheableResponse",
            funcName: "constructor",
            paramName: "config.statuses"
        });
        if (config.headers) (0, _assertJs.assert).isType(config.headers, "object", {
            moduleName: "workbox-cacheable-response",
            className: "CacheableResponse",
            funcName: "constructor",
            paramName: "config.headers"
        });
        this._statuses = config.statuses;
        this._headers = config.headers;
    }
    /**
     * Checks a response to see whether it's cacheable or not, based on this
     * object's configuration.
     *
     * @param {Response} response The response whose cacheability is being
     * checked.
     * @return {boolean} `true` if the `Response` is cacheable, and `false`
     * otherwise.
     */ isResponseCacheable(response) {
        (0, _assertJs.assert).isInstance(response, Response, {
            moduleName: "workbox-cacheable-response",
            className: "CacheableResponse",
            funcName: "isResponseCacheable",
            paramName: "response"
        });
        let cacheable = true;
        if (this._statuses) cacheable = this._statuses.includes(response.status);
        if (this._headers && cacheable) cacheable = Object.keys(this._headers).some((headerName)=>{
            return response.headers.get(headerName) === this._headers[headerName];
        });
        if (!cacheable) {
            (0, _loggerJs.logger).groupCollapsed(`The request for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(response.url)}' returned a response that does ` + `not meet the criteria for being cached.`);
            (0, _loggerJs.logger).groupCollapsed(`View cacheability criteria here.`);
            (0, _loggerJs.logger).log(`Cacheable statuses: ` + JSON.stringify(this._statuses));
            (0, _loggerJs.logger).log(`Cacheable headers: ` + JSON.stringify(this._headers, null, 2));
            (0, _loggerJs.logger).groupEnd();
            const logFriendlyHeaders = {};
            response.headers.forEach((value, key)=>{
                logFriendlyHeaders[key] = value;
            });
            (0, _loggerJs.logger).groupCollapsed(`View response status and headers here.`);
            (0, _loggerJs.logger).log(`Response status: ${response.status}`);
            (0, _loggerJs.logger).log(`Response headers: ` + JSON.stringify(logFriendlyHeaders, null, 2));
            (0, _loggerJs.logger).groupEnd();
            (0, _loggerJs.logger).groupCollapsed(`View full response details here.`);
            (0, _loggerJs.logger).log(response.headers);
            (0, _loggerJs.logger).log(response);
            (0, _loggerJs.logger).groupEnd();
            (0, _loggerJs.logger).groupEnd();
        }
        return cacheable;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-core/_private/logger.js":"fWQvD","./_version.js":"7EtJe","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7EtJe":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:cacheable-response:6.5.2"] && _();
} catch (e) {}

},{}],"hOAi4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ExpirationPlugin", ()=>ExpirationPlugin);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _dontWaitForJs = require("workbox-core/_private/dontWaitFor.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _registerQuotaErrorCallbackJs = require("workbox-core/registerQuotaErrorCallback.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _cacheExpirationJs = require("./CacheExpiration.js");
var _versionJs = require("./_version.js");
/**
 * This plugin can be used in a `workbox-strategy` to regularly enforce a
 * limit on the age and / or the number of cached requests.
 *
 * It can only be used with `workbox-strategy` instances that have a
 * [custom `cacheName` property set](/web/tools/workbox/guides/configure-workbox#custom_cache_names_in_strategies).
 * In other words, it can't be used to expire entries in strategy that uses the
 * default runtime cache name.
 *
 * Whenever a cached response is used or updated, this plugin will look
 * at the associated cache and remove any old or extra responses.
 *
 * When using `maxAgeSeconds`, responses may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached response has been used. If the response has a "Date" header, then
 * a light weight expiration check is performed and the response will not be
 * used immediately.
 *
 * When using `maxEntries`, the entry least-recently requested will be removed
 * from the cache first.
 *
 * @memberof workbox-expiration
 */ class ExpirationPlugin {
    /**
     * @param {ExpirationPluginOptions} config
     * @param {number} [config.maxEntries] The maximum number of entries to cache.
     * Entries used the least will be removed as the maximum is reached.
     * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
     * it's treated as stale and removed.
     * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
     * that will be used when calling `delete()` on the cache.
     * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
     * automatic deletion if the available storage quota has been exceeded.
     */ constructor(config = {}){
        /**
         * A "lifecycle" callback that will be triggered automatically by the
         * `workbox-strategies` handlers when a `Response` is about to be returned
         * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
         * the handler. It allows the `Response` to be inspected for freshness and
         * prevents it from being used if the `Response`'s `Date` header value is
         * older than the configured `maxAgeSeconds`.
         *
         * @param {Object} options
         * @param {string} options.cacheName Name of the cache the response is in.
         * @param {Response} options.cachedResponse The `Response` object that's been
         *     read from a cache and whose freshness should be checked.
         * @return {Response} Either the `cachedResponse`, if it's
         *     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
         *
         * @private
         */ this.cachedResponseWillBeUsed = async ({ event , request , cacheName , cachedResponse ,  })=>{
            if (!cachedResponse) return null;
            const isFresh = this._isResponseDateFresh(cachedResponse);
            // Expire entries to ensure that even if the expiration date has
            // expired, it'll only be used once.
            const cacheExpiration = this._getCacheExpiration(cacheName);
            (0, _dontWaitForJs.dontWaitFor)(cacheExpiration.expireEntries());
            // Update the metadata for the request URL to the current timestamp,
            // but don't `await` it as we don't want to block the response.
            const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
            if (event) try {
                event.waitUntil(updateTimestampDone);
            } catch (error) {
                // The event may not be a fetch event; only log the URL if it is.
                if ("request" in event) (0, _loggerJs.logger).warn(`Unable to ensure service worker stays alive when ` + `updating cache entry for ` + `'${(0, _getFriendlyURLJs.getFriendlyURL)(event.request.url)}'.`);
            }
            return isFresh ? cachedResponse : null;
        };
        /**
         * A "lifecycle" callback that will be triggered automatically by the
         * `workbox-strategies` handlers when an entry is added to a cache.
         *
         * @param {Object} options
         * @param {string} options.cacheName Name of the cache that was updated.
         * @param {string} options.request The Request for the cached entry.
         *
         * @private
         */ this.cacheDidUpdate = async ({ cacheName , request ,  })=>{
            (0, _assertJs.assert).isType(cacheName, "string", {
                moduleName: "workbox-expiration",
                className: "Plugin",
                funcName: "cacheDidUpdate",
                paramName: "cacheName"
            });
            (0, _assertJs.assert).isInstance(request, Request, {
                moduleName: "workbox-expiration",
                className: "Plugin",
                funcName: "cacheDidUpdate",
                paramName: "request"
            });
            const cacheExpiration = this._getCacheExpiration(cacheName);
            await cacheExpiration.updateTimestamp(request.url);
            await cacheExpiration.expireEntries();
        };
        if (!(config.maxEntries || config.maxAgeSeconds)) throw new (0, _workboxErrorJs.WorkboxError)("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor"
        });
        if (config.maxEntries) (0, _assertJs.assert).isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxEntries"
        });
        if (config.maxAgeSeconds) (0, _assertJs.assert).isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
        });
        this._config = config;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._cacheExpirations = new Map();
        if (config.purgeOnQuotaError) (0, _registerQuotaErrorCallbackJs.registerQuotaErrorCallback)(()=>this.deleteCacheAndMetadata());
    }
    /**
     * A simple helper method to return a CacheExpiration instance for a given
     * cache name.
     *
     * @param {string} cacheName
     * @return {CacheExpiration}
     *
     * @private
     */ _getCacheExpiration(cacheName) {
        if (cacheName === (0, _cacheNamesJs.cacheNames).getRuntimeName()) throw new (0, _workboxErrorJs.WorkboxError)("expire-custom-caches-only");
        let cacheExpiration = this._cacheExpirations.get(cacheName);
        if (!cacheExpiration) {
            cacheExpiration = new (0, _cacheExpirationJs.CacheExpiration)(cacheName, this._config);
            this._cacheExpirations.set(cacheName, cacheExpiration);
        }
        return cacheExpiration;
    }
    /**
     * @param {Response} cachedResponse
     * @return {boolean}
     *
     * @private
     */ _isResponseDateFresh(cachedResponse) {
        if (!this._maxAgeSeconds) // We aren't expiring by age, so return true, it's fresh
        return true;
        // Check if the 'date' header will suffice a quick expiration check.
        // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
        // discussion.
        const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
        if (dateHeaderTimestamp === null) // Unable to parse date, so assume it's fresh.
        return true;
        // If we have a valid headerTime, then our response is fresh iff the
        // headerTime plus maxAgeSeconds is greater than the current time.
        const now = Date.now();
        return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1000;
    }
    /**
     * This method will extract the data header and parse it into a useful
     * value.
     *
     * @param {Response} cachedResponse
     * @return {number|null}
     *
     * @private
     */ _getDateHeaderTimestamp(cachedResponse) {
        if (!cachedResponse.headers.has("date")) return null;
        const dateHeader = cachedResponse.headers.get("date");
        const parsedDate = new Date(dateHeader);
        const headerTime = parsedDate.getTime();
        // If the Date header was invalid for some reason, parsedDate.getTime()
        // will return NaN.
        if (isNaN(headerTime)) return null;
        return headerTime;
    }
    /**
     * This is a helper method that performs two operations:
     *
     * - Deletes *all* the underlying Cache instances associated with this plugin
     * instance, by calling caches.delete() on your behalf.
     * - Deletes the metadata from IndexedDB used to keep track of expiration
     * details for each Cache instance.
     *
     * When using cache expiration, calling this method is preferable to calling
     * `caches.delete()` directly, since this will ensure that the IndexedDB
     * metadata is also cleanly removed and open IndexedDB instances are deleted.
     *
     * Note that if you're *not* using cache expiration for a given cache, calling
     * `caches.delete()` and passing in the cache's name should be sufficient.
     * There is no Workbox-specific method needed for cleanup in that case.
     */ async deleteCacheAndMetadata() {
        // Do this one at a time instead of all at once via `Promise.all()` to
        // reduce the chance of inconsistency if a promise rejects.
        for (const [cacheName, cacheExpiration] of this._cacheExpirations){
            await self.caches.delete(cacheName);
            await cacheExpiration.delete();
        }
        // Reset this._cacheExpirations to its initial state.
        this._cacheExpirations = new Map();
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/dontWaitFor.js":"9UKT0","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-core/_private/logger.js":"fWQvD","workbox-core/registerQuotaErrorCallback.js":"ip8ok","workbox-core/_private/WorkboxError.js":"9LeL1","./CacheExpiration.js":"eXLdB","./_version.js":"j44LK","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"eXLdB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheExpiration", ()=>CacheExpiration);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _dontWaitForJs = require("workbox-core/_private/dontWaitFor.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _cacheTimestampsModelJs = require("./models/CacheTimestampsModel.js");
var _versionJs = require("./_version.js");
/**
 * The `CacheExpiration` class allows you define an expiration and / or
 * limit on the number of responses stored in a
 * [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
 *
 * @memberof workbox-expiration
 */ class CacheExpiration {
    /**
     * To construct a new CacheExpiration instance you must provide at least
     * one of the `config` properties.
     *
     * @param {string} cacheName Name of the cache to apply restrictions to.
     * @param {Object} config
     * @param {number} [config.maxEntries] The maximum number of entries to cache.
     * Entries used the least will be removed as the maximum is reached.
     * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
     * it's treated as stale and removed.
     * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
     * that will be used when calling `delete()` on the cache.
     */ constructor(cacheName, config = {}){
        this._isRunning = false;
        this._rerunRequested = false;
        (0, _assertJs.assert).isType(cacheName, "string", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "cacheName"
        });
        if (!(config.maxEntries || config.maxAgeSeconds)) throw new (0, _workboxErrorJs.WorkboxError)("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor"
        });
        if (config.maxEntries) (0, _assertJs.assert).isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxEntries"
        });
        if (config.maxAgeSeconds) (0, _assertJs.assert).isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
        });
        this._maxEntries = config.maxEntries;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._matchOptions = config.matchOptions;
        this._cacheName = cacheName;
        this._timestampModel = new (0, _cacheTimestampsModelJs.CacheTimestampsModel)(cacheName);
    }
    /**
     * Expires entries for the given cache and given criteria.
     */ async expireEntries() {
        if (this._isRunning) {
            this._rerunRequested = true;
            return;
        }
        this._isRunning = true;
        const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1000 : 0;
        const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
        // Delete URLs from the cache
        const cache = await self.caches.open(this._cacheName);
        for (const url1 of urlsExpired)await cache.delete(url1, this._matchOptions);
        {
            if (urlsExpired.length > 0) {
                (0, _loggerJs.logger).groupCollapsed(`Expired ${urlsExpired.length} ` + `${urlsExpired.length === 1 ? "entry" : "entries"} and removed ` + `${urlsExpired.length === 1 ? "it" : "them"} from the ` + `'${this._cacheName}' cache.`);
                (0, _loggerJs.logger).log(`Expired the following ${urlsExpired.length === 1 ? "URL" : "URLs"}:`);
                urlsExpired.forEach((url)=>(0, _loggerJs.logger).log(`    ${url}`));
                (0, _loggerJs.logger).groupEnd();
            } else (0, _loggerJs.logger).debug(`Cache expiration ran and found no entries to remove.`);
        }
        this._isRunning = false;
        if (this._rerunRequested) {
            this._rerunRequested = false;
            (0, _dontWaitForJs.dontWaitFor)(this.expireEntries());
        }
    }
    /**
     * Update the timestamp for the given URL. This ensures the when
     * removing entries based on maximum entries, most recently used
     * is accurate or when expiring, the timestamp is up-to-date.
     *
     * @param {string} url
     */ async updateTimestamp(url) {
        (0, _assertJs.assert).isType(url, "string", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "updateTimestamp",
            paramName: "url"
        });
        await this._timestampModel.setTimestamp(url, Date.now());
    }
    /**
     * Can be used to check if a URL has expired or not before it's used.
     *
     * This requires a look up from IndexedDB, so can be slow.
     *
     * Note: This method will not remove the cached entry, call
     * `expireEntries()` to remove indexedDB and Cache entries.
     *
     * @param {string} url
     * @return {boolean}
     */ async isURLExpired(url) {
        if (!this._maxAgeSeconds) throw new (0, _workboxErrorJs.WorkboxError)(`expired-test-without-max-age`, {
            methodName: "isURLExpired",
            paramName: "maxAgeSeconds"
        });
        else {
            const timestamp = await this._timestampModel.getTimestamp(url);
            const expireOlderThan = Date.now() - this._maxAgeSeconds * 1000;
            return timestamp !== undefined ? timestamp < expireOlderThan : true;
        }
    }
    /**
     * Removes the IndexedDB object store used to keep track of cache expiration
     * metadata.
     */ async delete() {
        // Make sure we don't attempt another rerun if we're called in the middle of
        // a cache expiration.
        this._rerunRequested = false;
        await this._timestampModel.expireEntries(Infinity); // Expires all.
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/dontWaitFor.js":"9UKT0","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","./models/CacheTimestampsModel.js":"aEWhd","./_version.js":"j44LK","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"aEWhd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheTimestampsModel", ()=>CacheTimestampsModel);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _idb = require("idb");
var _versionJs = require("../_version.js");
const DB_NAME = "workbox-expiration";
const CACHE_OBJECT_STORE = "cache-entries";
const normalizeURL = (unNormalizedUrl)=>{
    const url = new URL(unNormalizedUrl, location.href);
    url.hash = "";
    return url.href;
};
/**
 * Returns the timestamp model.
 *
 * @private
 */ class CacheTimestampsModel {
    /**
     *
     * @param {string} cacheName
     *
     * @private
     */ constructor(cacheName){
        this._db = null;
        this._cacheName = cacheName;
    }
    /**
     * Performs an upgrade of indexedDB.
     *
     * @param {IDBPDatabase<CacheDbSchema>} db
     *
     * @private
     */ _upgradeDb(db) {
        // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
        // have to use the `id` keyPath here and create our own values (a
        // concatenation of `url + cacheName`) instead of simply using
        // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.
        const objStore = db.createObjectStore(CACHE_OBJECT_STORE, {
            keyPath: "id"
        });
        // TODO(philipwalton): once we don't have to support EdgeHTML, we can
        // create a single index with the keyPath `['cacheName', 'timestamp']`
        // instead of doing both these indexes.
        objStore.createIndex("cacheName", "cacheName", {
            unique: false
        });
        objStore.createIndex("timestamp", "timestamp", {
            unique: false
        });
    }
    /**
     * Performs an upgrade of indexedDB and deletes deprecated DBs.
     *
     * @param {IDBPDatabase<CacheDbSchema>} db
     *
     * @private
     */ _upgradeDbAndDeleteOldDbs(db) {
        this._upgradeDb(db);
        if (this._cacheName) (0, _idb.deleteDB)(this._cacheName);
    }
    /**
     * @param {string} url
     * @param {number} timestamp
     *
     * @private
     */ async setTimestamp(url, timestamp) {
        url = normalizeURL(url);
        const entry = {
            url,
            timestamp,
            cacheName: this._cacheName,
            // Creating an ID from the URL and cache name won't be necessary once
            // Edge switches to Chromium and all browsers we support work with
            // array keyPaths.
            id: this._getId(url)
        };
        const db = await this.getDb();
        const tx = db.transaction(CACHE_OBJECT_STORE, "readwrite", {
            durability: "relaxed"
        });
        await tx.store.put(entry);
        await tx.done;
    }
    /**
     * Returns the timestamp stored for a given URL.
     *
     * @param {string} url
     * @return {number | undefined}
     *
     * @private
     */ async getTimestamp(url) {
        const db = await this.getDb();
        const entry = await db.get(CACHE_OBJECT_STORE, this._getId(url));
        return entry === null || entry === void 0 ? void 0 : entry.timestamp;
    }
    /**
     * Iterates through all the entries in the object store (from newest to
     * oldest) and removes entries once either `maxCount` is reached or the
     * entry's timestamp is less than `minTimestamp`.
     *
     * @param {number} minTimestamp
     * @param {number} maxCount
     * @return {Array<string>}
     *
     * @private
     */ async expireEntries(minTimestamp, maxCount) {
        const db = await this.getDb();
        let cursor = await db.transaction(CACHE_OBJECT_STORE).store.index("timestamp").openCursor(null, "prev");
        const entriesToDelete = [];
        let entriesNotDeletedCount = 0;
        while(cursor){
            const result = cursor.value;
            // TODO(philipwalton): once we can use a multi-key index, we
            // won't have to check `cacheName` here.
            if (result.cacheName === this._cacheName) {
                // Delete an entry if it's older than the max age or
                // if we already have the max number allowed.
                if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) // TODO(philipwalton): we should be able to delete the
                // entry right here, but doing so causes an iteration
                // bug in Safari stable (fixed in TP). Instead we can
                // store the keys of the entries to delete, and then
                // delete the separate transactions.
                // https://github.com/GoogleChrome/workbox/issues/1978
                // cursor.delete();
                // We only need to return the URL, not the whole entry.
                entriesToDelete.push(cursor.value);
                else entriesNotDeletedCount++;
            }
            cursor = await cursor.continue();
        }
        // TODO(philipwalton): once the Safari bug in the following issue is fixed,
        // we should be able to remove this loop and do the entry deletion in the
        // cursor loop above:
        // https://github.com/GoogleChrome/workbox/issues/1978
        const urlsDeleted = [];
        for (const entry of entriesToDelete){
            await db.delete(CACHE_OBJECT_STORE, entry.id);
            urlsDeleted.push(entry.url);
        }
        return urlsDeleted;
    }
    /**
     * Takes a URL and returns an ID that will be unique in the object store.
     *
     * @param {string} url
     * @return {string}
     *
     * @private
     */ _getId(url) {
        // Creating an ID from the URL and cache name won't be necessary once
        // Edge switches to Chromium and all browsers we support work with
        // array keyPaths.
        return this._cacheName + "|" + normalizeURL(url);
    }
    /**
     * Returns an open connection to the database.
     *
     * @private
     */ async getDb() {
        if (!this._db) this._db = await (0, _idb.openDB)(DB_NAME, 1, {
            upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
        });
        return this._db;
    }
}

},{"idb":"67vZC","../_version.js":"j44LK","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"67vZC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "unwrap", ()=>(0, _wrapIdbValueJs.u));
parcelHelpers.export(exports, "wrap", ()=>(0, _wrapIdbValueJs.w));
parcelHelpers.export(exports, "deleteDB", ()=>deleteDB);
parcelHelpers.export(exports, "openDB", ()=>openDB);
var _wrapIdbValueJs = require("./wrap-idb-value.js");
/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */ function openDB(name, version, { blocked , upgrade , blocking , terminated  } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = (0, _wrapIdbValueJs.w)(request);
    if (upgrade) request.addEventListener("upgradeneeded", (event)=>{
        upgrade((0, _wrapIdbValueJs.w)(request.result), event.oldVersion, event.newVersion, (0, _wrapIdbValueJs.w)(request.transaction));
    });
    if (blocked) request.addEventListener("blocked", ()=>blocked());
    openPromise.then((db)=>{
        if (terminated) db.addEventListener("close", ()=>terminated());
        if (blocking) db.addEventListener("versionchange", ()=>blocking());
    }).catch(()=>{});
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */ function deleteDB(name, { blocked  } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) request.addEventListener("blocked", ()=>blocked());
    return (0, _wrapIdbValueJs.w)(request).then(()=>undefined);
}
const readMethods = [
    "get",
    "getKey",
    "getAll",
    "getAllKeys",
    "count"
];
const writeMethods = [
    "put",
    "add",
    "delete",
    "clear"
];
const cachedMethods = new Map();
function getMethod(target1, prop) {
    if (!(target1 instanceof IDBDatabase && !(prop in target1) && typeof prop === "string")) return;
    if (cachedMethods.get(prop)) return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (// Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
    const method = async function(storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
        let target = tx.store;
        if (useIndex) target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done, 
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
(0, _wrapIdbValueJs.r)((oldTraps)=>({
        ...oldTraps,
        get: (target, prop, receiver)=>getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop)=>!!getMethod(target, prop) || oldTraps.has(target, prop)
    }));

},{"./wrap-idb-value.js":"bk0v3","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"bk0v3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "a", ()=>reverseTransformCache);
parcelHelpers.export(exports, "i", ()=>instanceOfAny);
parcelHelpers.export(exports, "r", ()=>replaceTraps);
parcelHelpers.export(exports, "u", ()=>unwrap);
parcelHelpers.export(exports, "w", ()=>wrap);
const instanceOfAny = (object, constructors)=>constructors.some((c)=>object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
        IDBDatabase,
        IDBObjectStore,
        IDBIndex,
        IDBCursor,
        IDBTransaction, 
    ]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey, 
    ]);
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject)=>{
        const unlisten = ()=>{
            request.removeEventListener("success", success);
            request.removeEventListener("error", error);
        };
        const success = ()=>{
            resolve(wrap(request.result));
            unlisten();
        };
        const error = ()=>{
            reject(request.error);
            unlisten();
        };
        request.addEventListener("success", success);
        request.addEventListener("error", error);
    });
    promise.then((value)=>{
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
    // Catching to avoid "Uncaught Promise exceptions"
    }).catch(()=>{});
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx)) return;
    const done = new Promise((resolve, reject)=>{
        const unlisten = ()=>{
            tx.removeEventListener("complete", complete);
            tx.removeEventListener("error", error);
            tx.removeEventListener("abort", error);
        };
        const complete = ()=>{
            resolve();
            unlisten();
        };
        const error = ()=>{
            reject(tx.error || new DOMException("AbortError", "AbortError"));
            unlisten();
        };
        tx.addEventListener("complete", complete);
        tx.addEventListener("error", error);
        tx.addEventListener("abort", error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get (target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === "done") return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === "store") return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set (target, prop, value) {
        target[prop] = value;
        return true;
    },
    has (target, prop) {
        if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
        return prop in target;
    }
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [
            storeNames
        ]);
        return wrap(tx);
    };
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) return function(...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
    };
    return function(...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === "function") return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest) return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value)) return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value)=>reverseTransformCache.get(value);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"j44LK":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:expiration:6.5.2"] && _();
} catch (e) {}

},{}],"7wEmj":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:recipes:6.5.2"] && _();
} catch (e) {}

},{}],"3axmv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "imageCache", ()=>imageCache);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _warmStrategyCache = require("./warmStrategyCache");
var _registerRouteJs = require("workbox-routing/registerRoute.js");
var _cacheFirstJs = require("workbox-strategies/CacheFirst.js");
var _cacheableResponsePluginJs = require("workbox-cacheable-response/CacheableResponsePlugin.js");
var _expirationPluginJs = require("workbox-expiration/ExpirationPlugin.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of the [image caching recipe]{@link https://developers.google.com/web/tools/workbox/guides/common-recipes#caching_images}
 *
 * @memberof workbox-recipes
 *
 * @param {Object} [options]
 * @param {string} [options.cacheName] Name for cache. Defaults to images
 * @param {RouteMatchCallback} [options.matchCallback] Workbox callback function to call to match to. Defaults to request.destination === 'image';
 * @param {number} [options.maxAgeSeconds] Maximum age, in seconds, that font entries will be cached for. Defaults to 30 days
 * @param {number} [options.maxEntries] Maximum number of images that will be cached. Defaults to 60
 * @param {WorkboxPlugin[]} [options.plugins] Additional plugins to use for this recipe
 * @param {string[]} [options.warmCache] Paths to call to use to warm this cache
 */ function imageCache(options = {}) {
    const defaultMatchCallback = ({ request  })=>request.destination === "image";
    const cacheName = options.cacheName || "images";
    const matchCallback = options.matchCallback || defaultMatchCallback;
    const maxAgeSeconds = options.maxAgeSeconds || 2592000;
    const maxEntries = options.maxEntries || 60;
    const plugins = options.plugins || [];
    plugins.push(new (0, _cacheableResponsePluginJs.CacheableResponsePlugin)({
        statuses: [
            0,
            200
        ]
    }));
    plugins.push(new (0, _expirationPluginJs.ExpirationPlugin)({
        maxEntries,
        maxAgeSeconds
    }));
    const strategy = new (0, _cacheFirstJs.CacheFirst)({
        cacheName,
        plugins
    });
    (0, _registerRouteJs.registerRoute)(matchCallback, strategy);
    // Warms the cache
    if (options.warmCache) (0, _warmStrategyCache.warmStrategyCache)({
        urls: options.warmCache,
        strategy
    });
}

},{"./warmStrategyCache":"iia02","workbox-routing/registerRoute.js":"dvFuW","workbox-strategies/CacheFirst.js":"59ubY","workbox-cacheable-response/CacheableResponsePlugin.js":"j45rR","workbox-expiration/ExpirationPlugin.js":"hOAi4","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"iia02":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "warmStrategyCache", ()=>warmStrategyCache);
var _versionJs = require("./_version.js");
/**
 * @memberof workbox-recipes
 
 * @param {Object} options
 * @param {string[]} options.urls Paths to warm the strategy's cache with
 * @param {Strategy} options.strategy Strategy to use
 */ function warmStrategyCache(options) {
    self.addEventListener("install", (event)=>{
        const done = options.urls.map((path)=>options.strategy.handleAll({
                event,
                request: new Request(path)
            })[1]);
        event.waitUntil(Promise.all(done));
    });
}

},{"./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"hcSFK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "staticResourceCache", ()=>staticResourceCache);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _warmStrategyCache = require("./warmStrategyCache");
var _registerRouteJs = require("workbox-routing/registerRoute.js");
var _staleWhileRevalidateJs = require("workbox-strategies/StaleWhileRevalidate.js");
var _cacheableResponsePluginJs = require("workbox-cacheable-response/CacheableResponsePlugin.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of the [CSS and JavaScript files recipe]{@link https://developers.google.com/web/tools/workbox/guides/common-recipes#cache_css_and_javascript_files}
 *
 * @memberof workbox-recipes
 *
 * @param {Object} [options]
 * @param {string} [options.cacheName] Name for cache. Defaults to static-resources
 * @param {RouteMatchCallback} [options.matchCallback] Workbox callback function to call to match to. Defaults to request.destination === 'style' || request.destination === 'script' || request.destination === 'worker';
 * @param {WorkboxPlugin[]} [options.plugins] Additional plugins to use for this recipe
 * @param {string[]} [options.warmCache] Paths to call to use to warm this cache
 */ function staticResourceCache(options = {}) {
    const defaultMatchCallback = ({ request  })=>request.destination === "style" || request.destination === "script" || request.destination === "worker";
    const cacheName = options.cacheName || "static-resources";
    const matchCallback = options.matchCallback || defaultMatchCallback;
    const plugins = options.plugins || [];
    plugins.push(new (0, _cacheableResponsePluginJs.CacheableResponsePlugin)({
        statuses: [
            0,
            200
        ]
    }));
    const strategy = new (0, _staleWhileRevalidateJs.StaleWhileRevalidate)({
        cacheName,
        plugins
    });
    (0, _registerRouteJs.registerRoute)(matchCallback, strategy);
    // Warms the cache
    if (options.warmCache) (0, _warmStrategyCache.warmStrategyCache)({
        urls: options.warmCache,
        strategy
    });
}

},{"./warmStrategyCache":"iia02","workbox-routing/registerRoute.js":"dvFuW","workbox-strategies/StaleWhileRevalidate.js":"8wQ3g","workbox-cacheable-response/CacheableResponsePlugin.js":"j45rR","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"4UCTF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pageCache", ()=>pageCache);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _warmStrategyCache = require("./warmStrategyCache");
var _registerRouteJs = require("workbox-routing/registerRoute.js");
var _networkFirstJs = require("workbox-strategies/NetworkFirst.js");
var _cacheableResponsePluginJs = require("workbox-cacheable-response/CacheableResponsePlugin.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of a page caching recipe with a network timeout
 *
 * @memberof workbox-recipes
 *
 * @param {Object} [options]
 * @param {string} [options.cacheName] Name for cache. Defaults to pages
 * @param {RouteMatchCallback} [options.matchCallback] Workbox callback function to call to match to. Defaults to request.mode === 'navigate';
 * @param {number} [options.networkTimoutSeconds] Maximum amount of time, in seconds, to wait on the network before falling back to cache. Defaults to 3
 * @param {WorkboxPlugin[]} [options.plugins] Additional plugins to use for this recipe
 * @param {string[]} [options.warmCache] Paths to call to use to warm this cache
 */ function pageCache(options = {}) {
    const defaultMatchCallback = ({ request  })=>request.mode === "navigate";
    const cacheName = options.cacheName || "pages";
    const matchCallback = options.matchCallback || defaultMatchCallback;
    const networkTimeoutSeconds = options.networkTimeoutSeconds || 3;
    const plugins = options.plugins || [];
    plugins.push(new (0, _cacheableResponsePluginJs.CacheableResponsePlugin)({
        statuses: [
            0,
            200
        ]
    }));
    const strategy = new (0, _networkFirstJs.NetworkFirst)({
        networkTimeoutSeconds,
        cacheName,
        plugins
    });
    // Registers the route
    (0, _registerRouteJs.registerRoute)(matchCallback, strategy);
    // Warms the cache
    if (options.warmCache) (0, _warmStrategyCache.warmStrategyCache)({
        urls: options.warmCache,
        strategy
    });
}

},{"./warmStrategyCache":"iia02","workbox-routing/registerRoute.js":"dvFuW","workbox-strategies/NetworkFirst.js":"1meNY","workbox-cacheable-response/CacheableResponsePlugin.js":"j45rR","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8y10k":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "offlineFallback", ()=>offlineFallback);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _setCatchHandlerJs = require("workbox-routing/setCatchHandler.js");
var _matchPrecacheJs = require("workbox-precaching/matchPrecache.js");
var _versionJs = require("./_version.js");
/**
 * An implementation of the [comprehensive fallbacks recipe]{@link https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks}. Be sure to include the fallbacks in your precache injection
 *
 * @memberof workbox-recipes
 *
 * @param {Object} [options]
 * @param {string} [options.pageFallback] Precache name to match for pag fallbacks. Defaults to offline.html
 * @param {string} [options.imageFallback] Precache name to match for image fallbacks.
 * @param {string} [options.fontFallback] Precache name to match for font fallbacks.
 */ function offlineFallback(options1 = {}) {
    const pageFallback = options1.pageFallback || "offline.html";
    const imageFallback = options1.imageFallback || false;
    const fontFallback = options1.fontFallback || false;
    self.addEventListener("install", (event)=>{
        const files = [
            pageFallback
        ];
        if (imageFallback) files.push(imageFallback);
        if (fontFallback) files.push(fontFallback);
        event.waitUntil(self.caches.open("workbox-offline-fallbacks").then((cache)=>cache.addAll(files)));
    });
    const handler = async (options)=>{
        const dest = options.request.destination;
        const cache = await self.caches.open("workbox-offline-fallbacks");
        if (dest === "document") {
            const match = await (0, _matchPrecacheJs.matchPrecache)(pageFallback) || await cache.match(pageFallback);
            return match || Response.error();
        }
        if (dest === "image" && imageFallback !== false) {
            const match = await (0, _matchPrecacheJs.matchPrecache)(imageFallback) || await cache.match(imageFallback);
            return match || Response.error();
        }
        if (dest === "font" && fontFallback !== false) {
            const match = await (0, _matchPrecacheJs.matchPrecache)(fontFallback) || await cache.match(fontFallback);
            return match || Response.error();
        }
        return Response.error();
    };
    (0, _setCatchHandlerJs.setCatchHandler)(handler);
}

},{"workbox-routing/setCatchHandler.js":"klfxF","workbox-precaching/matchPrecache.js":"ar0UP","./_version.js":"7wEmj","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"ar0UP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "matchPrecache", ()=>matchPrecache);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * Helper function that calls
 * {@link PrecacheController#matchPrecache} on the default
 * {@link PrecacheController} instance.
 *
 * If you are creating your own {@link PrecacheController}, then call
 * {@link PrecacheController#matchPrecache} on that instance,
 * instead of using this function.
 *
 * @param {string|Request} request The key (without revisioning parameters)
 * to look up in the precache.
 * @return {Promise<Response|undefined>}
 *
 * @memberof workbox-precaching
 */ function matchPrecache(request) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    return precacheController.matchPrecache(request);
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1Lgpi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getOrCreatePrecacheController", ()=>getOrCreatePrecacheController);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _precacheControllerJs = require("../PrecacheController.js");
var _versionJs = require("../_version.js");
let precacheController;
const getOrCreatePrecacheController = ()=>{
    if (!precacheController) precacheController = new (0, _precacheControllerJs.PrecacheController)();
    return precacheController;
};

},{"../PrecacheController.js":"dN8p6","../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"dN8p6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheController", ()=>PrecacheController);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _waitUntilJs = require("workbox-core/_private/waitUntil.js");
var _createCacheKeyJs = require("./utils/createCacheKey.js");
var _precacheInstallReportPluginJs = require("./utils/PrecacheInstallReportPlugin.js");
var _precacheCacheKeyPluginJs = require("./utils/PrecacheCacheKeyPlugin.js");
var _printCleanupDetailsJs = require("./utils/printCleanupDetails.js");
var _printInstallDetailsJs = require("./utils/printInstallDetails.js");
var _precacheStrategyJs = require("./PrecacheStrategy.js");
var _versionJs = require("./_version.js");
/**
 * Performs efficient precaching of assets.
 *
 * @memberof workbox-precaching
 */ class PrecacheController {
    /**
     * Create a new PrecacheController.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] The cache to use for precaching.
     * @param {string} [options.plugins] Plugins to use when precaching as well
     * as responding to fetch events for precached assets.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */ constructor({ cacheName , plugins =[] , fallbackToNetwork =true ,  } = {}){
        this._urlsToCacheKeys = new Map();
        this._urlsToCacheModes = new Map();
        this._cacheKeysToIntegrities = new Map();
        this._strategy = new (0, _precacheStrategyJs.PrecacheStrategy)({
            cacheName: (0, _cacheNamesJs.cacheNames).getPrecacheName(cacheName),
            plugins: [
                ...plugins,
                new (0, _precacheCacheKeyPluginJs.PrecacheCacheKeyPlugin)({
                    precacheController: this
                }), 
            ],
            fallbackToNetwork
        });
        // Bind the install and activate methods to the instance.
        this.install = this.install.bind(this);
        this.activate = this.activate.bind(this);
    }
    /**
     * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
     * used to cache assets and respond to fetch events.
     */ get strategy() {
        return this._strategy;
    }
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     */ precache(entries) {
        this.addToCacheList(entries);
        if (!this._installAndActiveListenersAdded) {
            self.addEventListener("install", this.install);
            self.addEventListener("activate", this.activate);
            this._installAndActiveListenersAdded = true;
        }
    }
    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
     *     Array of entries to precache.
     */ addToCacheList(entries) {
        (0, _assertJs.assert).isArray(entries, {
            moduleName: "workbox-precaching",
            className: "PrecacheController",
            funcName: "addToCacheList",
            paramName: "entries"
        });
        const urlsToWarnAbout = [];
        for (const entry of entries){
            // See https://github.com/GoogleChrome/workbox/issues/2259
            if (typeof entry === "string") urlsToWarnAbout.push(entry);
            else if (entry && entry.revision === undefined) urlsToWarnAbout.push(entry.url);
            const { cacheKey , url  } = (0, _createCacheKeyJs.createCacheKey)(entry);
            const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
            if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) throw new (0, _workboxErrorJs.WorkboxError)("add-to-cache-list-conflicting-entries", {
                firstEntry: this._urlsToCacheKeys.get(url),
                secondEntry: cacheKey
            });
            if (typeof entry !== "string" && entry.integrity) {
                if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) throw new (0, _workboxErrorJs.WorkboxError)("add-to-cache-list-conflicting-integrities", {
                    url
                });
                this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
            }
            this._urlsToCacheKeys.set(url, cacheKey);
            this._urlsToCacheModes.set(url, cacheMode);
            if (urlsToWarnAbout.length > 0) {
                const warningMessage = `Workbox is precaching URLs without revision ` + `info: ${urlsToWarnAbout.join(", ")}\nThis is generally NOT safe. ` + `Learn more at https://bit.ly/wb-precache`;
                (0, _loggerJs.logger).warn(warningMessage);
            }
        }
    }
    /**
     * Precaches new and updated assets. Call this method from the service worker
     * install event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.InstallResult>}
     */ install(event) {
        // waitUntil returns Promise<any>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (0, _waitUntilJs.waitUntil)(event, async ()=>{
            const installReportPlugin = new (0, _precacheInstallReportPluginJs.PrecacheInstallReportPlugin)();
            this.strategy.plugins.push(installReportPlugin);
            // Cache entries one at a time.
            // See https://github.com/GoogleChrome/workbox/issues/2528
            for (const [url, cacheKey] of this._urlsToCacheKeys){
                const integrity = this._cacheKeysToIntegrities.get(cacheKey);
                const cacheMode = this._urlsToCacheModes.get(url);
                const request = new Request(url, {
                    integrity,
                    cache: cacheMode,
                    credentials: "same-origin"
                });
                await Promise.all(this.strategy.handleAll({
                    params: {
                        cacheKey
                    },
                    request,
                    event
                }));
            }
            const { updatedURLs , notUpdatedURLs  } = installReportPlugin;
            (0, _printInstallDetailsJs.printInstallDetails)(updatedURLs, notUpdatedURLs);
            return {
                updatedURLs,
                notUpdatedURLs
            };
        });
    }
    /**
     * Deletes assets that are no longer present in the current precache manifest.
     * Call this method from the service worker activate event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.CleanupResult>}
     */ activate(event) {
        // waitUntil returns Promise<any>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (0, _waitUntilJs.waitUntil)(event, async ()=>{
            const cache = await self.caches.open(this.strategy.cacheName);
            const currentlyCachedRequests = await cache.keys();
            const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
            const deletedURLs = [];
            for (const request of currentlyCachedRequests)if (!expectedCacheKeys.has(request.url)) {
                await cache.delete(request);
                deletedURLs.push(request.url);
            }
            (0, _printCleanupDetailsJs.printCleanupDetails)(deletedURLs);
            return {
                deletedURLs
            };
        });
    }
    /**
     * Returns a mapping of a precached URL to the corresponding cache key, taking
     * into account the revision information for the URL.
     *
     * @return {Map<string, string>} A URL to cache key mapping.
     */ getURLsToCacheKeys() {
        return this._urlsToCacheKeys;
    }
    /**
     * Returns a list of all the URLs that have been precached by the current
     * service worker.
     *
     * @return {Array<string>} The precached URLs.
     */ getCachedURLs() {
        return [
            ...this._urlsToCacheKeys.keys()
        ];
    }
    /**
     * Returns the cache key used for storing a given URL. If that URL is
     * unversioned, like `/index.html', then the cache key will be the original
     * URL with a search parameter appended to it.
     *
     * @param {string} url A URL whose cache key you want to look up.
     * @return {string} The versioned URL that corresponds to a cache key
     * for the original URL, or undefined if that URL isn't precached.
     */ getCacheKeyForURL(url) {
        const urlObject = new URL(url, location.href);
        return this._urlsToCacheKeys.get(urlObject.href);
    }
    /**
     * @param {string} url A cache key whose SRI you want to look up.
     * @return {string} The subresource integrity associated with the cache key,
     * or undefined if it's not set.
     */ getIntegrityForCacheKey(cacheKey) {
        return this._cacheKeysToIntegrities.get(cacheKey);
    }
    /**
     * This acts as a drop-in replacement for
     * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
     * with the following differences:
     *
     * - It knows what the name of the precache is, and only checks in that cache.
     * - It allows you to pass in an "original" URL without versioning parameters,
     * and it will automatically look up the correct cache key for the currently
     * active revision of that URL.
     *
     * E.g., `matchPrecache('index.html')` will find the correct precached
     * response for the currently active service worker, even if the actual cache
     * key is `'/index.html?__WB_REVISION__=1234abcd'`.
     *
     * @param {string|Request} request The key (without revisioning parameters)
     * to look up in the precache.
     * @return {Promise<Response|undefined>}
     */ async matchPrecache(request) {
        const url = request instanceof Request ? request.url : request;
        const cacheKey = this.getCacheKeyForURL(url);
        if (cacheKey) {
            const cache = await self.caches.open(this.strategy.cacheName);
            return cache.match(cacheKey);
        }
        return undefined;
    }
    /**
     * Returns a function that looks up `url` in the precache (taking into
     * account revision information), and returns the corresponding `Response`.
     *
     * @param {string} url The precached URL which will be used to lookup the
     * `Response`.
     * @return {workbox-routing~handlerCallback}
     */ createHandlerBoundToURL(url) {
        const cacheKey = this.getCacheKeyForURL(url);
        if (!cacheKey) throw new (0, _workboxErrorJs.WorkboxError)("non-precached-url", {
            url
        });
        return (options)=>{
            options.request = new Request(url);
            options.params = Object.assign({
                cacheKey
            }, options.params);
            return this.strategy.handle(options);
        };
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/waitUntil.js":"4qs3c","./utils/createCacheKey.js":"gNsVt","./utils/PrecacheInstallReportPlugin.js":"lbAuH","./utils/PrecacheCacheKeyPlugin.js":"8bfPb","./utils/printCleanupDetails.js":"8L8ze","./utils/printInstallDetails.js":"1sFQq","./PrecacheStrategy.js":"6wmZb","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gNsVt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param {Object|string} entry
 * @return {string} A URL with versioning info.
 *
 * @private
 * @memberof workbox-precaching
 */ parcelHelpers.export(exports, "createCacheKey", ()=>createCacheKey);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _versionJs = require("../_version.js");
// Name of the search parameter used to store revision info.
const REVISION_SEARCH_PARAM = "__WB_REVISION__";
function createCacheKey(entry) {
    if (!entry) throw new (0, _workboxErrorJs.WorkboxError)("add-to-cache-list-unexpected-type", {
        entry
    });
    // If a precache manifest entry is a string, it's assumed to be a versioned
    // URL, like '/app.abcd1234.js'. Return as-is.
    if (typeof entry === "string") {
        const urlObject = new URL(entry, location.href);
        return {
            cacheKey: urlObject.href,
            url: urlObject.href
        };
    }
    const { revision , url  } = entry;
    if (!url) throw new (0, _workboxErrorJs.WorkboxError)("add-to-cache-list-unexpected-type", {
        entry
    });
    // If there's just a URL and no revision, then it's also assumed to be a
    // versioned URL.
    if (!revision) {
        const urlObject = new URL(url, location.href);
        return {
            cacheKey: urlObject.href,
            url: urlObject.href
        };
    }
    // Otherwise, construct a properly versioned URL using the custom Workbox
    // search parameter along with the revision info.
    const cacheKeyURL = new URL(url, location.href);
    const originalURL = new URL(url, location.href);
    cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
    return {
        cacheKey: cacheKeyURL.href,
        url: originalURL.href
    };
}

},{"workbox-core/_private/WorkboxError.js":"9LeL1","../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1A2zY":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:precaching:6.5.2"] && _();
} catch (e) {}

},{}],"lbAuH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheInstallReportPlugin", ()=>PrecacheInstallReportPlugin);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
/**
 * A plugin, designed to be used with PrecacheController, to determine the
 * of assets that were updated (or not updated) during the install event.
 *
 * @private
 */ class PrecacheInstallReportPlugin {
    constructor(){
        this.updatedURLs = [];
        this.notUpdatedURLs = [];
        this.handlerWillStart = async ({ request , state ,  })=>{
            // TODO: `state` should never be undefined...
            if (state) state.originalRequest = request;
        };
        this.cachedResponseWillBeUsed = async ({ event , state , cachedResponse ,  })=>{
            if (event.type === "install") {
                if (state && state.originalRequest && state.originalRequest instanceof Request) {
                    // TODO: `state` should never be undefined...
                    const url = state.originalRequest.url;
                    if (cachedResponse) this.notUpdatedURLs.push(url);
                    else this.updatedURLs.push(url);
                }
            }
            return cachedResponse;
        };
    }
}

},{"../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8bfPb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheCacheKeyPlugin", ()=>PrecacheCacheKeyPlugin);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
/**
 * A plugin, designed to be used with PrecacheController, to translate URLs into
 * the corresponding cache key, based on the current revision info.
 *
 * @private
 */ class PrecacheCacheKeyPlugin {
    constructor({ precacheController  }){
        this.cacheKeyWillBeUsed = async ({ request , params ,  })=>{
            // Params is type any, can't change right now.
            /* eslint-disable */ const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
            /* eslint-enable */ return cacheKey ? new Request(cacheKey, {
                headers: request.headers
            }) : request;
        };
        this._precacheController = precacheController;
    }
}

},{"../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8L8ze":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @param {Array<string>} deletedURLs
 *
 * @private
 * @memberof workbox-precaching
 */ parcelHelpers.export(exports, "printCleanupDetails", ()=>printCleanupDetails);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("workbox-core/_private/logger.js");
var _versionJs = require("../_version.js");
/**
 * @param {string} groupTitle
 * @param {Array<string>} deletedURLs
 *
 * @private
 */ const logGroup = (groupTitle, deletedURLs)=>{
    (0, _loggerJs.logger).groupCollapsed(groupTitle);
    for (const url of deletedURLs)(0, _loggerJs.logger).log(url);
    (0, _loggerJs.logger).groupEnd();
};
function printCleanupDetails(deletedURLs) {
    const deletionCount = deletedURLs.length;
    if (deletionCount > 0) {
        (0, _loggerJs.logger).groupCollapsed(`During precaching cleanup, ` + `${deletionCount} cached ` + `request${deletionCount === 1 ? " was" : "s were"} deleted.`);
        logGroup("Deleted Cache Requests", deletedURLs);
        (0, _loggerJs.logger).groupEnd();
    }
}

},{"workbox-core/_private/logger.js":"fWQvD","../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1sFQq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @param {Array<string>} urlsToPrecache
 * @param {Array<string>} urlsAlreadyPrecached
 *
 * @private
 * @memberof workbox-precaching
 */ parcelHelpers.export(exports, "printInstallDetails", ()=>printInstallDetails);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("workbox-core/_private/logger.js");
var _versionJs = require("../_version.js");
/**
 * @param {string} groupTitle
 * @param {Array<string>} urls
 *
 * @private
 */ function _nestedGroup(groupTitle, urls) {
    if (urls.length === 0) return;
    (0, _loggerJs.logger).groupCollapsed(groupTitle);
    for (const url of urls)(0, _loggerJs.logger).log(url);
    (0, _loggerJs.logger).groupEnd();
}
function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
    const precachedCount = urlsToPrecache.length;
    const alreadyPrecachedCount = urlsAlreadyPrecached.length;
    if (precachedCount || alreadyPrecachedCount) {
        let message = `Precaching ${precachedCount} file${precachedCount === 1 ? "" : "s"}.`;
        if (alreadyPrecachedCount > 0) message += ` ${alreadyPrecachedCount} ` + `file${alreadyPrecachedCount === 1 ? " is" : "s are"} already cached.`;
        (0, _loggerJs.logger).groupCollapsed(message);
        _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
        _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
        (0, _loggerJs.logger).groupEnd();
    }
}

},{"workbox-core/_private/logger.js":"fWQvD","../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"6wmZb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheStrategy", ()=>PrecacheStrategy);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _copyResponseJs = require("workbox-core/copyResponse.js");
var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _strategyJs = require("workbox-strategies/Strategy.js");
var _versionJs = require("./_version.js");
/**
 * A {@link workbox-strategies.Strategy} implementation
 * specifically designed to work with
 * {@link workbox-precaching.PrecacheController}
 * to both cache and fetch precached assets.
 *
 * Note: an instance of this class is created automatically when creating a
 * `PrecacheController`; it's generally not necessary to create this yourself.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-precaching
 */ class PrecacheStrategy extends (0, _strategyJs.Strategy) {
    /**
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * of all fetch() requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */ constructor(options = {}){
        options.cacheName = (0, _cacheNamesJs.cacheNames).getPrecacheName(options.cacheName);
        super(options);
        this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
        // Redirected responses cannot be used to satisfy a navigation request, so
        // any redirected response must be "copied" rather than cloned, so the new
        // response doesn't contain the `redirected` flag. See:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1
        this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */ async _handle(request, handler) {
        const response = await handler.cacheMatch(request);
        if (response) return response;
        // If this is an `install` event for an entry that isn't already cached,
        // then populate the cache.
        if (handler.event && handler.event.type === "install") return await this._handleInstall(request, handler);
        // Getting here means something went wrong. An entry that should have been
        // precached wasn't found in the cache.
        return await this._handleFetch(request, handler);
    }
    async _handleFetch(request, handler) {
        let response;
        const params = handler.params || {};
        // Fall back to the network if we're configured to do so.
        if (this._fallbackToNetwork) {
            (0, _loggerJs.logger).warn(`The precached response for ` + `${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)} in ${this.cacheName} was not ` + `found. Falling back to the network.`);
            const integrityInManifest = params.integrity;
            const integrityInRequest = request.integrity;
            const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
            response = await handler.fetch(new Request(request, {
                integrity: integrityInRequest || integrityInManifest
            }));
            // It's only "safe" to repair the cache if we're using SRI to guarantee
            // that the response matches the precache manifest's expectations,
            // and there's either a) no integrity property in the incoming request
            // or b) there is an integrity, and it matches the precache manifest.
            // See https://github.com/GoogleChrome/workbox/issues/2858
            if (integrityInManifest && noIntegrityConflict) {
                this._useDefaultCacheabilityPluginIfNeeded();
                const wasCached = await handler.cachePut(request, response.clone());
                if (wasCached) (0, _loggerJs.logger).log(`A response for ${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)} ` + `was used to "repair" the precache.`);
            }
        } else // This shouldn't normally happen, but there are edge cases:
        // https://github.com/GoogleChrome/workbox/issues/1441
        throw new (0, _workboxErrorJs.WorkboxError)("missing-precache-entry", {
            cacheName: this.cacheName,
            url: request.url
        });
        {
            const cacheKey = params.cacheKey || await handler.getCacheKey(request, "read");
            // Workbox is going to handle the route.
            // print the routing details to the console.
            (0, _loggerJs.logger).groupCollapsed(`Precaching is responding to: ` + (0, _getFriendlyURLJs.getFriendlyURL)(request.url));
            (0, _loggerJs.logger).log(`Serving the precached url: ${(0, _getFriendlyURLJs.getFriendlyURL)(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);
            (0, _loggerJs.logger).groupCollapsed(`View request details here.`);
            (0, _loggerJs.logger).log(request);
            (0, _loggerJs.logger).groupEnd();
            (0, _loggerJs.logger).groupCollapsed(`View response details here.`);
            (0, _loggerJs.logger).log(response);
            (0, _loggerJs.logger).groupEnd();
            (0, _loggerJs.logger).groupEnd();
        }
        return response;
    }
    async _handleInstall(request, handler) {
        this._useDefaultCacheabilityPluginIfNeeded();
        const response = await handler.fetch(request);
        // Make sure we defer cachePut() until after we know the response
        // should be cached; see https://github.com/GoogleChrome/workbox/issues/2737
        const wasCached = await handler.cachePut(request, response.clone());
        if (!wasCached) // Throwing here will lead to the `install` handler failing, which
        // we want to do if *any* of the responses aren't safe to cache.
        throw new (0, _workboxErrorJs.WorkboxError)("bad-precaching-response", {
            url: request.url,
            status: response.status
        });
        return response;
    }
    /**
     * This method is complex, as there a number of things to account for:
     *
     * The `plugins` array can be set at construction, and/or it might be added to
     * to at any time before the strategy is used.
     *
     * At the time the strategy is used (i.e. during an `install` event), there
     * needs to be at least one plugin that implements `cacheWillUpdate` in the
     * array, other than `copyRedirectedCacheableResponsesPlugin`.
     *
     * - If this method is called and there are no suitable `cacheWillUpdate`
     * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
     *
     * - If this method is called and there is exactly one `cacheWillUpdate`, then
     * we don't have to do anything (this might be a previously added
     * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
     *
     * - If this method is called and there is more than one `cacheWillUpdate`,
     * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
     * we need to remove it. (This situation is unlikely, but it could happen if
     * the strategy is used multiple times, the first without a `cacheWillUpdate`,
     * and then later on after manually adding a custom `cacheWillUpdate`.)
     *
     * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
     *
     * @private
     */ _useDefaultCacheabilityPluginIfNeeded() {
        let defaultPluginIndex = null;
        let cacheWillUpdatePluginCount = 0;
        for (const [index, plugin] of this.plugins.entries()){
            // Ignore the copy redirected plugin when determining what to do.
            if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) continue;
            // Save the default plugin's index, in case it needs to be removed.
            if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) defaultPluginIndex = index;
            if (plugin.cacheWillUpdate) cacheWillUpdatePluginCount++;
        }
        if (cacheWillUpdatePluginCount === 0) this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
        else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) // Only remove the default plugin; multiple custom plugins are allowed.
        this.plugins.splice(defaultPluginIndex, 1);
    // Nothing needs to be done if cacheWillUpdatePluginCount is 1
    }
}
PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate ({ response  }) {
        if (!response || response.status >= 400) return null;
        return response;
    }
};
PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate ({ response  }) {
        return response.redirected ? await (0, _copyResponseJs.copyResponse)(response) : response;
    }
};

},{"workbox-core/copyResponse.js":"3pgMm","workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/WorkboxError.js":"9LeL1","workbox-strategies/Strategy.js":"fYouC","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"fjHf4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"7qD83","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7qD83":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-google-analytics
 */ parcelHelpers.export(exports, "initialize", ()=>(0, _initializeJs.initialize));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _initializeJs = require("./initialize.js");
var _versionJs = require("./_version.js");

},{"./initialize.js":"6jMRm","./_version.js":"8euR4","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"6jMRm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initialize", ()=>initialize);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _backgroundSyncPluginJs = require("workbox-background-sync/BackgroundSyncPlugin.js");
var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _routeJs = require("workbox-routing/Route.js");
var _routerJs = require("workbox-routing/Router.js");
var _networkFirstJs = require("workbox-strategies/NetworkFirst.js");
var _networkOnlyJs = require("workbox-strategies/NetworkOnly.js");
var _constantsJs = require("./utils/constants.js");
var _versionJs = require("./_version.js");
/**
 * Creates the requestWillDequeue callback to be used with the background
 * sync plugin. The callback takes the failed request and adds the
 * `qt` param based on the current time, as well as applies any other
 * user-defined hit modifications.
 *
 * @param {Object} config See {@link workbox-google-analytics.initialize}.
 * @return {Function} The requestWillDequeue callback function.
 *
 * @private
 */ const createOnSyncCallback = (config)=>{
    return async ({ queue  })=>{
        let entry;
        while(entry = await queue.shiftRequest()){
            const { request , timestamp  } = entry;
            const url = new URL(request.url);
            try {
                // Measurement protocol requests can set their payload parameters in
                // either the URL query string (for GET requests) or the POST body.
                const params = request.method === "POST" ? new URLSearchParams(await request.clone().text()) : url.searchParams;
                // Calculate the qt param, accounting for the fact that an existing
                // qt param may be present and should be updated rather than replaced.
                const originalHitTime = timestamp - (Number(params.get("qt")) || 0);
                const queueTime = Date.now() - originalHitTime;
                // Set the qt param prior to applying hitFilter or parameterOverrides.
                params.set("qt", String(queueTime));
                // Apply `parameterOverrides`, if set.
                if (config.parameterOverrides) for (const param of Object.keys(config.parameterOverrides)){
                    const value = config.parameterOverrides[param];
                    params.set(param, value);
                }
                // Apply `hitFilter`, if set.
                if (typeof config.hitFilter === "function") config.hitFilter.call(null, params);
                // Retry the fetch. Ignore URL search params from the URL as they're
                // now in the post body.
                await fetch(new Request(url.origin + url.pathname, {
                    body: params.toString(),
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                    headers: {
                        "Content-Type": "text/plain"
                    }
                }));
                (0, _loggerJs.logger).log(`Request for '${(0, _getFriendlyURLJs.getFriendlyURL)(url.href)}' ` + `has been replayed`);
            } catch (err) {
                await queue.unshiftRequest(entry);
                (0, _loggerJs.logger).log(`Request for '${(0, _getFriendlyURLJs.getFriendlyURL)(url.href)}' ` + `failed to replay, putting it back in the queue.`);
                throw err;
            }
        }
        (0, _loggerJs.logger).log(`All Google Analytics request successfully replayed; ` + `the queue is now empty!`);
    };
};
/**
 * Creates GET and POST routes to catch failed Measurement Protocol hits.
 *
 * @param {BackgroundSyncPlugin} bgSyncPlugin
 * @return {Array<Route>} The created routes.
 *
 * @private
 */ const createCollectRoutes = (bgSyncPlugin)=>{
    const match = ({ url  })=>url.hostname === (0, _constantsJs.GOOGLE_ANALYTICS_HOST) && (0, _constantsJs.COLLECT_PATHS_REGEX).test(url.pathname);
    const handler = new (0, _networkOnlyJs.NetworkOnly)({
        plugins: [
            bgSyncPlugin
        ]
    });
    return [
        new (0, _routeJs.Route)(match, handler, "GET"),
        new (0, _routeJs.Route)(match, handler, "POST")
    ];
};
/**
 * Creates a route with a network first strategy for the analytics.js script.
 *
 * @param {string} cacheName
 * @return {Route} The created route.
 *
 * @private
 */ const createAnalyticsJsRoute = (cacheName)=>{
    const match = ({ url  })=>url.hostname === (0, _constantsJs.GOOGLE_ANALYTICS_HOST) && url.pathname === (0, _constantsJs.ANALYTICS_JS_PATH);
    const handler = new (0, _networkFirstJs.NetworkFirst)({
        cacheName
    });
    return new (0, _routeJs.Route)(match, handler, "GET");
};
/**
 * Creates a route with a network first strategy for the gtag.js script.
 *
 * @param {string} cacheName
 * @return {Route} The created route.
 *
 * @private
 */ const createGtagJsRoute = (cacheName)=>{
    const match = ({ url  })=>url.hostname === (0, _constantsJs.GTM_HOST) && url.pathname === (0, _constantsJs.GTAG_JS_PATH);
    const handler = new (0, _networkFirstJs.NetworkFirst)({
        cacheName
    });
    return new (0, _routeJs.Route)(match, handler, "GET");
};
/**
 * Creates a route with a network first strategy for the gtm.js script.
 *
 * @param {string} cacheName
 * @return {Route} The created route.
 *
 * @private
 */ const createGtmJsRoute = (cacheName)=>{
    const match = ({ url  })=>url.hostname === (0, _constantsJs.GTM_HOST) && url.pathname === (0, _constantsJs.GTM_JS_PATH);
    const handler = new (0, _networkFirstJs.NetworkFirst)({
        cacheName
    });
    return new (0, _routeJs.Route)(match, handler, "GET");
};
/**
 * @param {Object=} [options]
 * @param {Object} [options.cacheName] The cache name to store and retrieve
 *     analytics.js. Defaults to the cache names provided by `workbox-core`.
 * @param {Object} [options.parameterOverrides]
 *     [Measurement Protocol parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters),
 *     expressed as key/value pairs, to be added to replayed Google Analytics
 *     requests. This can be used to, e.g., set a custom dimension indicating
 *     that the request was replayed.
 * @param {Function} [options.hitFilter] A function that allows you to modify
 *     the hit parameters prior to replaying
 *     the hit. The function is invoked with the original hit's URLSearchParams
 *     object as its only argument.
 *
 * @memberof workbox-google-analytics
 */ const initialize = (options = {})=>{
    const cacheName = (0, _cacheNamesJs.cacheNames).getGoogleAnalyticsName(options.cacheName);
    const bgSyncPlugin = new (0, _backgroundSyncPluginJs.BackgroundSyncPlugin)((0, _constantsJs.QUEUE_NAME), {
        maxRetentionTime: (0, _constantsJs.MAX_RETENTION_TIME),
        onSync: createOnSyncCallback(options)
    });
    const routes = [
        createGtmJsRoute(cacheName),
        createAnalyticsJsRoute(cacheName),
        createGtagJsRoute(cacheName),
        ...createCollectRoutes(bgSyncPlugin), 
    ];
    const router = new (0, _routerJs.Router)();
    for (const route of routes)router.registerRoute(route);
    router.addFetchListener();
};

},{"workbox-background-sync/BackgroundSyncPlugin.js":"gjT4m","workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-core/_private/logger.js":"fWQvD","workbox-routing/Route.js":"28fs2","workbox-routing/Router.js":"cHzSy","workbox-strategies/NetworkFirst.js":"1meNY","workbox-strategies/NetworkOnly.js":"1k3Yw","./utils/constants.js":"coSVH","./_version.js":"8euR4","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gjT4m":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BackgroundSyncPlugin", ()=>BackgroundSyncPlugin);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _queueJs = require("./Queue.js");
var _versionJs = require("./_version.js");
/**
 * A class implementing the `fetchDidFail` lifecycle callback. This makes it
 * easier to add failed requests to a background sync Queue.
 *
 * @memberof workbox-background-sync
 */ class BackgroundSyncPlugin {
    /**
     * @param {string} name See the {@link workbox-background-sync.Queue}
     *     documentation for parameter details.
     * @param {Object} [options] See the
     *     {@link workbox-background-sync.Queue} documentation for
     *     parameter details.
     */ constructor(name, options){
        /**
         * @param {Object} options
         * @param {Request} options.request
         * @private
         */ this.fetchDidFail = async ({ request  })=>{
            await this._queue.pushRequest({
                request
            });
        };
        this._queue = new (0, _queueJs.Queue)(name, options);
    }
}

},{"./Queue.js":"7NsQd","./_version.js":"gAs1W","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7NsQd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Queue", ()=>Queue);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _assertJs = require("workbox-core/_private/assert.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _queueStoreJs = require("./lib/QueueStore.js");
var _storableRequestJs = require("./lib/StorableRequest.js");
var _versionJs = require("./_version.js");
const TAG_PREFIX = "workbox-background-sync";
const MAX_RETENTION_TIME = 10080; // 7 days in minutes
const queueNames = new Set();
/**
 * Converts a QueueStore entry into the format exposed by Queue. This entails
 * converting the request data into a real request and omitting the `id` and
 * `queueName` properties.
 *
 * @param {UnidentifiedQueueStoreEntry} queueStoreEntry
 * @return {Queue}
 * @private
 */ const convertEntry = (queueStoreEntry)=>{
    const queueEntry = {
        request: new (0, _storableRequestJs.StorableRequest)(queueStoreEntry.requestData).toRequest(),
        timestamp: queueStoreEntry.timestamp
    };
    if (queueStoreEntry.metadata) queueEntry.metadata = queueStoreEntry.metadata;
    return queueEntry;
};
/**
 * A class to manage storing failed requests in IndexedDB and retrying them
 * later. All parts of the storing and replaying process are observable via
 * callbacks.
 *
 * @memberof workbox-background-sync
 */ class Queue {
    /**
     * Creates an instance of Queue with the given options
     *
     * @param {string} name The unique name for this queue. This name must be
     *     unique as it's used to register sync events and store requests
     *     in IndexedDB specific to this instance. An error will be thrown if
     *     a duplicate name is detected.
     * @param {Object} [options]
     * @param {Function} [options.onSync] A function that gets invoked whenever
     *     the 'sync' event fires. The function is invoked with an object
     *     containing the `queue` property (referencing this instance), and you
     *     can use the callback to customize the replay behavior of the queue.
     *     When not set the `replayRequests()` method is called.
     *     Note: if the replay fails after a sync event, make sure you throw an
     *     error, so the browser knows to retry the sync event later.
     * @param {number} [options.maxRetentionTime=7 days] The amount of time (in
     *     minutes) a request may be retried. After this amount of time has
     *     passed, the request will be deleted from the queue.
     * @param {boolean} [options.forceSyncFallback=false] If `true`, instead
     *     of attempting to use background sync events, always attempt to replay
     *     queued request at service worker startup. Most folks will not need
     *     this, unless you explicitly target a runtime like Electron that
     *     exposes the interfaces for background sync, but does not have a working
     *     implementation.
     */ constructor(name, { forceSyncFallback , onSync , maxRetentionTime  } = {}){
        this._syncInProgress = false;
        this._requestsAddedDuringSync = false;
        // Ensure the store name is not already being used
        if (queueNames.has(name)) throw new (0, _workboxErrorJs.WorkboxError)("duplicate-queue-name", {
            name
        });
        else queueNames.add(name);
        this._name = name;
        this._onSync = onSync || this.replayRequests;
        this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
        this._forceSyncFallback = Boolean(forceSyncFallback);
        this._queueStore = new (0, _queueStoreJs.QueueStore)(this._name);
        this._addSyncListener();
    }
    /**
     * @return {string}
     */ get name() {
        return this._name;
    }
    /**
     * Stores the passed request in IndexedDB (with its timestamp and any
     * metadata) at the end of the queue.
     *
     * @param {QueueEntry} entry
     * @param {Request} entry.request The request to store in the queue.
     * @param {Object} [entry.metadata] Any metadata you want associated with the
     *     stored request. When requests are replayed you'll have access to this
     *     metadata object in case you need to modify the request beforehand.
     * @param {number} [entry.timestamp] The timestamp (Epoch time in
     *     milliseconds) when the request was first added to the queue. This is
     *     used along with `maxRetentionTime` to remove outdated requests. In
     *     general you don't need to set this value, as it's automatically set
     *     for you (defaulting to `Date.now()`), but you can update it if you
     *     don't want particular requests to expire.
     */ async pushRequest(entry) {
        (0, _assertJs.assert).isType(entry, "object", {
            moduleName: "workbox-background-sync",
            className: "Queue",
            funcName: "pushRequest",
            paramName: "entry"
        });
        (0, _assertJs.assert).isInstance(entry.request, Request, {
            moduleName: "workbox-background-sync",
            className: "Queue",
            funcName: "pushRequest",
            paramName: "entry.request"
        });
        await this._addRequest(entry, "push");
    }
    /**
     * Stores the passed request in IndexedDB (with its timestamp and any
     * metadata) at the beginning of the queue.
     *
     * @param {QueueEntry} entry
     * @param {Request} entry.request The request to store in the queue.
     * @param {Object} [entry.metadata] Any metadata you want associated with the
     *     stored request. When requests are replayed you'll have access to this
     *     metadata object in case you need to modify the request beforehand.
     * @param {number} [entry.timestamp] The timestamp (Epoch time in
     *     milliseconds) when the request was first added to the queue. This is
     *     used along with `maxRetentionTime` to remove outdated requests. In
     *     general you don't need to set this value, as it's automatically set
     *     for you (defaulting to `Date.now()`), but you can update it if you
     *     don't want particular requests to expire.
     */ async unshiftRequest(entry) {
        (0, _assertJs.assert).isType(entry, "object", {
            moduleName: "workbox-background-sync",
            className: "Queue",
            funcName: "unshiftRequest",
            paramName: "entry"
        });
        (0, _assertJs.assert).isInstance(entry.request, Request, {
            moduleName: "workbox-background-sync",
            className: "Queue",
            funcName: "unshiftRequest",
            paramName: "entry.request"
        });
        await this._addRequest(entry, "unshift");
    }
    /**
     * Removes and returns the last request in the queue (along with its
     * timestamp and any metadata). The returned object takes the form:
     * `{request, timestamp, metadata}`.
     *
     * @return {Promise<QueueEntry | undefined>}
     */ async popRequest() {
        return this._removeRequest("pop");
    }
    /**
     * Removes and returns the first request in the queue (along with its
     * timestamp and any metadata). The returned object takes the form:
     * `{request, timestamp, metadata}`.
     *
     * @return {Promise<QueueEntry | undefined>}
     */ async shiftRequest() {
        return this._removeRequest("shift");
    }
    /**
     * Returns all the entries that have not expired (per `maxRetentionTime`).
     * Any expired entries are removed from the queue.
     *
     * @return {Promise<Array<QueueEntry>>}
     */ async getAll() {
        const allEntries = await this._queueStore.getAll();
        const now = Date.now();
        const unexpiredEntries = [];
        for (const entry of allEntries){
            // Ignore requests older than maxRetentionTime. Call this function
            // recursively until an unexpired request is found.
            const maxRetentionTimeInMs = this._maxRetentionTime * 60000;
            if (now - entry.timestamp > maxRetentionTimeInMs) await this._queueStore.deleteEntry(entry.id);
            else unexpiredEntries.push(convertEntry(entry));
        }
        return unexpiredEntries;
    }
    /**
     * Returns the number of entries present in the queue.
     * Note that expired entries (per `maxRetentionTime`) are also included in this count.
     *
     * @return {Promise<number>}
     */ async size() {
        return await this._queueStore.size();
    }
    /**
     * Adds the entry to the QueueStore and registers for a sync event.
     *
     * @param {Object} entry
     * @param {Request} entry.request
     * @param {Object} [entry.metadata]
     * @param {number} [entry.timestamp=Date.now()]
     * @param {string} operation ('push' or 'unshift')
     * @private
     */ async _addRequest({ request , metadata , timestamp =Date.now()  }, operation) {
        const storableRequest = await (0, _storableRequestJs.StorableRequest).fromRequest(request.clone());
        const entry = {
            requestData: storableRequest.toObject(),
            timestamp
        };
        // Only include metadata if it's present.
        if (metadata) entry.metadata = metadata;
        switch(operation){
            case "push":
                await this._queueStore.pushEntry(entry);
                break;
            case "unshift":
                await this._queueStore.unshiftEntry(entry);
                break;
        }
        (0, _loggerJs.logger).log(`Request for '${(0, _getFriendlyURLJs.getFriendlyURL)(request.url)}' has ` + `been added to background sync queue '${this._name}'.`);
        // Don't register for a sync if we're in the middle of a sync. Instead,
        // we wait until the sync is complete and call register if
        // `this._requestsAddedDuringSync` is true.
        if (this._syncInProgress) this._requestsAddedDuringSync = true;
        else await this.registerSync();
    }
    /**
     * Removes and returns the first or last (depending on `operation`) entry
     * from the QueueStore that's not older than the `maxRetentionTime`.
     *
     * @param {string} operation ('pop' or 'shift')
     * @return {Object|undefined}
     * @private
     */ async _removeRequest(operation) {
        const now = Date.now();
        let entry;
        switch(operation){
            case "pop":
                entry = await this._queueStore.popEntry();
                break;
            case "shift":
                entry = await this._queueStore.shiftEntry();
                break;
        }
        if (entry) {
            // Ignore requests older than maxRetentionTime. Call this function
            // recursively until an unexpired request is found.
            const maxRetentionTimeInMs = this._maxRetentionTime * 60000;
            if (now - entry.timestamp > maxRetentionTimeInMs) return this._removeRequest(operation);
            return convertEntry(entry);
        } else return undefined;
    }
    /**
     * Loops through each request in the queue and attempts to re-fetch it.
     * If any request fails to re-fetch, it's put back in the same position in
     * the queue (which registers a retry for the next sync event).
     */ async replayRequests() {
        let entry;
        while(entry = await this.shiftRequest())try {
            await fetch(entry.request.clone());
            (0, _loggerJs.logger).log(`Request for '${(0, _getFriendlyURLJs.getFriendlyURL)(entry.request.url)}' ` + `has been replayed in queue '${this._name}'`);
        } catch (error) {
            await this.unshiftRequest(entry);
            (0, _loggerJs.logger).log(`Request for '${(0, _getFriendlyURLJs.getFriendlyURL)(entry.request.url)}' ` + `failed to replay, putting it back in queue '${this._name}'`);
            throw new (0, _workboxErrorJs.WorkboxError)("queue-replay-failed", {
                name: this._name
            });
        }
        (0, _loggerJs.logger).log(`All requests in queue '${this.name}' have successfully ` + `replayed; the queue is now empty!`);
    }
    /**
     * Registers a sync event with a tag unique to this instance.
     */ async registerSync() {
        // See https://github.com/GoogleChrome/workbox/issues/2393
        if ("sync" in self.registration && !this._forceSyncFallback) try {
            await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
        } catch (err) {
            (0, _loggerJs.logger).warn(`Unable to register sync event for '${this._name}'.`, err);
        }
    }
    /**
     * In sync-supporting browsers, this adds a listener for the sync event.
     * In non-sync-supporting browsers, or if _forceSyncFallback is true, this
     * will retry the queue on service worker startup.
     *
     * @private
     */ _addSyncListener() {
        // See https://github.com/GoogleChrome/workbox/issues/2393
        if ("sync" in self.registration && !this._forceSyncFallback) self.addEventListener("sync", (event)=>{
            if (event.tag === `${TAG_PREFIX}:${this._name}`) {
                (0, _loggerJs.logger).log(`Background sync for tag '${event.tag}' ` + `has been received`);
                const syncComplete = async ()=>{
                    this._syncInProgress = true;
                    let syncError;
                    try {
                        await this._onSync({
                            queue: this
                        });
                    } catch (error) {
                        if (error instanceof Error) {
                            syncError = error;
                            // Rethrow the error. Note: the logic in the finally clause
                            // will run before this gets rethrown.
                            throw syncError;
                        }
                    } finally{
                        // New items may have been added to the queue during the sync,
                        // so we need to register for a new sync if that's happened...
                        // Unless there was an error during the sync, in which
                        // case the browser will automatically retry later, as long
                        // as `event.lastChance` is not true.
                        if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) await this.registerSync();
                        this._syncInProgress = false;
                        this._requestsAddedDuringSync = false;
                    }
                };
                event.waitUntil(syncComplete());
            }
        });
        else {
            (0, _loggerJs.logger).log(`Background sync replaying without background sync event`);
            this._onSync({
                queue: this
            });
        }
    }
    /**
     * Returns the set of queue names. This is primarily used to reset the list
     * of queue names in tests.
     *
     * @return {Set<string>}
     *
     * @private
     */ static get _queueNames() {
        return queueNames;
    }
}

},{"workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/getFriendlyURL.js":"b3dxx","./lib/QueueStore.js":"eIagi","./lib/StorableRequest.js":"7szAE","./_version.js":"gAs1W","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"eIagi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * A class to manage storing requests from a Queue in IndexedDB,
 * indexed by their queue name for easier access.
 *
 * Most developers will not need to access this class directly;
 * it is exposed for advanced use cases.
 */ parcelHelpers.export(exports, "QueueStore", ()=>QueueStore);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _queueDbJs = require("./QueueDb.js");
var _versionJs = require("../_version.js");
class QueueStore {
    /**
     * Associates this instance with a Queue instance, so entries added can be
     * identified by their queue name.
     *
     * @param {string} queueName
     */ constructor(queueName){
        this._queueName = queueName;
        this._queueDb = new (0, _queueDbJs.QueueDb)();
    }
    /**
     * Append an entry last in the queue.
     *
     * @param {Object} entry
     * @param {Object} entry.requestData
     * @param {number} [entry.timestamp]
     * @param {Object} [entry.metadata]
     */ async pushEntry(entry) {
        (0, _assertJs.assert).isType(entry, "object", {
            moduleName: "workbox-background-sync",
            className: "QueueStore",
            funcName: "pushEntry",
            paramName: "entry"
        });
        (0, _assertJs.assert).isType(entry.requestData, "object", {
            moduleName: "workbox-background-sync",
            className: "QueueStore",
            funcName: "pushEntry",
            paramName: "entry.requestData"
        });
        // Don't specify an ID since one is automatically generated.
        delete entry.id;
        entry.queueName = this._queueName;
        await this._queueDb.addEntry(entry);
    }
    /**
     * Prepend an entry first in the queue.
     *
     * @param {Object} entry
     * @param {Object} entry.requestData
     * @param {number} [entry.timestamp]
     * @param {Object} [entry.metadata]
     */ async unshiftEntry(entry) {
        (0, _assertJs.assert).isType(entry, "object", {
            moduleName: "workbox-background-sync",
            className: "QueueStore",
            funcName: "unshiftEntry",
            paramName: "entry"
        });
        (0, _assertJs.assert).isType(entry.requestData, "object", {
            moduleName: "workbox-background-sync",
            className: "QueueStore",
            funcName: "unshiftEntry",
            paramName: "entry.requestData"
        });
        const firstId = await this._queueDb.getFirstEntryId();
        if (firstId) // Pick an ID one less than the lowest ID in the object store.
        entry.id = firstId - 1;
        else // Otherwise let the auto-incrementor assign the ID.
        delete entry.id;
        entry.queueName = this._queueName;
        await this._queueDb.addEntry(entry);
    }
    /**
     * Removes and returns the last entry in the queue matching the `queueName`.
     *
     * @return {Promise<QueueStoreEntry|undefined>}
     */ async popEntry() {
        return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));
    }
    /**
     * Removes and returns the first entry in the queue matching the `queueName`.
     *
     * @return {Promise<QueueStoreEntry|undefined>}
     */ async shiftEntry() {
        return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));
    }
    /**
     * Returns all entries in the store matching the `queueName`.
     *
     * @param {Object} options See {@link workbox-background-sync.Queue~getAll}
     * @return {Promise<Array<Object>>}
     */ async getAll() {
        return await this._queueDb.getAllEntriesByQueueName(this._queueName);
    }
    /**
     * Returns the number of entries in the store matching the `queueName`.
     *
     * @param {Object} options See {@link workbox-background-sync.Queue~size}
     * @return {Promise<number>}
     */ async size() {
        return await this._queueDb.getEntryCountByQueueName(this._queueName);
    }
    /**
     * Deletes the entry for the given ID.
     *
     * WARNING: this method does not ensure the deleted entry belongs to this
     * queue (i.e. matches the `queueName`). But this limitation is acceptable
     * as this class is not publicly exposed. An additional check would make
     * this method slower than it needs to be.
     *
     * @param {number} id
     */ async deleteEntry(id) {
        await this._queueDb.deleteEntry(id);
    }
    /**
     * Removes and returns the first or last entry in the queue (based on the
     * `direction` argument) matching the `queueName`.
     *
     * @return {Promise<QueueStoreEntry|undefined>}
     * @private
     */ async _removeEntry(entry) {
        if (entry) await this.deleteEntry(entry.id);
        return entry;
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","./QueueDb.js":"3lP0K","../_version.js":"gAs1W","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"3lP0K":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * A class to interact directly an IndexedDB created specifically to save and
 * retrieve QueueStoreEntries. This class encapsulates all the schema details
 * to store the representation of a Queue.
 *
 * @private
 */ parcelHelpers.export(exports, "QueueDb", ()=>QueueDb);
/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _idb = require("idb");
var _versionJs = require("../_version.js");
const DB_VERSION = 3;
const DB_NAME = "workbox-background-sync";
const REQUEST_OBJECT_STORE_NAME = "requests";
const QUEUE_NAME_INDEX = "queueName";
class QueueDb {
    constructor(){
        this._db = null;
    }
    /**
     * Add QueueStoreEntry to underlying db.
     *
     * @param {UnidentifiedQueueStoreEntry} entry
     */ async addEntry(entry) {
        const db = await this.getDb();
        const tx = db.transaction(REQUEST_OBJECT_STORE_NAME, "readwrite", {
            durability: "relaxed"
        });
        await tx.store.add(entry);
        await tx.done;
    }
    /**
     * Returns the first entry id in the ObjectStore.
     *
     * @return {number | undefined}
     */ async getFirstEntryId() {
        const db = await this.getDb();
        const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.openCursor();
        return cursor === null || cursor === void 0 ? void 0 : cursor.value.id;
    }
    /**
     * Get all the entries filtered by index
     *
     * @param queueName
     * @return {Promise<QueueStoreEntry[]>}
     */ async getAllEntriesByQueueName(queueName) {
        const db = await this.getDb();
        const results = await db.getAllFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
        return results ? results : new Array();
    }
    /**
     * Returns the number of entries filtered by index
     *
     * @param queueName
     * @return {Promise<number>}
     */ async getEntryCountByQueueName(queueName) {
        const db = await this.getDb();
        return db.countFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
    }
    /**
     * Deletes a single entry by id.
     *
     * @param {number} id the id of the entry to be deleted
     */ async deleteEntry(id) {
        const db = await this.getDb();
        await db.delete(REQUEST_OBJECT_STORE_NAME, id);
    }
    /**
     *
     * @param queueName
     * @returns {Promise<QueueStoreEntry | undefined>}
     */ async getFirstEntryByQueueName(queueName) {
        return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "next");
    }
    /**
     *
     * @param queueName
     * @returns {Promise<QueueStoreEntry | undefined>}
     */ async getLastEntryByQueueName(queueName) {
        return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "prev");
    }
    /**
     * Returns either the first or the last entries, depending on direction.
     * Filtered by index.
     *
     * @param {IDBCursorDirection} direction
     * @param {IDBKeyRange} query
     * @return {Promise<QueueStoreEntry | undefined>}
     * @private
     */ async getEndEntryFromIndex(query, direction) {
        const db = await this.getDb();
        const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.index(QUEUE_NAME_INDEX).openCursor(query, direction);
        return cursor === null || cursor === void 0 ? void 0 : cursor.value;
    }
    /**
     * Returns an open connection to the database.
     *
     * @private
     */ async getDb() {
        if (!this._db) this._db = await (0, _idb.openDB)(DB_NAME, DB_VERSION, {
            upgrade: this._upgradeDb
        });
        return this._db;
    }
    /**
     * Upgrades QueueDB
     *
     * @param {IDBPDatabase<QueueDBSchema>} db
     * @param {number} oldVersion
     * @private
     */ _upgradeDb(db, oldVersion) {
        if (oldVersion > 0 && oldVersion < DB_VERSION) {
            if (db.objectStoreNames.contains(REQUEST_OBJECT_STORE_NAME)) db.deleteObjectStore(REQUEST_OBJECT_STORE_NAME);
        }
        const objStore = db.createObjectStore(REQUEST_OBJECT_STORE_NAME, {
            autoIncrement: true,
            keyPath: "id"
        });
        objStore.createIndex(QUEUE_NAME_INDEX, QUEUE_NAME_INDEX, {
            unique: false
        });
    }
}

},{"idb":"67vZC","../_version.js":"gAs1W","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gAs1W":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:background-sync:6.5.2"] && _();
} catch (e) {}

},{}],"7szAE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "StorableRequest", ()=>StorableRequest);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _assertJs = require("workbox-core/_private/assert.js");
var _versionJs = require("../_version.js");
const serializableProperties = [
    "method",
    "referrer",
    "referrerPolicy",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "integrity",
    "keepalive", 
];
/**
 * A class to make it easier to serialize and de-serialize requests so they
 * can be stored in IndexedDB.
 *
 * Most developers will not need to access this class directly;
 * it is exposed for advanced use cases.
 */ class StorableRequest {
    /**
     * Accepts an object of request data that can be used to construct a
     * `Request` but can also be stored in IndexedDB.
     *
     * @param {Object} requestData An object of request data that includes the
     *     `url` plus any relevant properties of
     *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.
     */ constructor(requestData){
        (0, _assertJs.assert).isType(requestData, "object", {
            moduleName: "workbox-background-sync",
            className: "StorableRequest",
            funcName: "constructor",
            paramName: "requestData"
        });
        (0, _assertJs.assert).isType(requestData.url, "string", {
            moduleName: "workbox-background-sync",
            className: "StorableRequest",
            funcName: "constructor",
            paramName: "requestData.url"
        });
        // If the request's mode is `navigate`, convert it to `same-origin` since
        // navigation requests can't be constructed via script.
        if (requestData["mode"] === "navigate") requestData["mode"] = "same-origin";
        this._requestData = requestData;
    }
    /**
     * Converts a Request object to a plain object that can be structured
     * cloned or JSON-stringified.
     *
     * @param {Request} request
     * @return {Promise<StorableRequest>}
     */ static async fromRequest(request) {
        const requestData = {
            url: request.url,
            headers: {}
        };
        // Set the body if present.
        if (request.method !== "GET") // Use ArrayBuffer to support non-text request bodies.
        // NOTE: we can't use Blobs becuse Safari doesn't support storing
        // Blobs in IndexedDB in some cases:
        // https://github.com/dfahlander/Dexie.js/issues/618#issuecomment-398348457
        requestData.body = await request.clone().arrayBuffer();
        // Convert the headers from an iterable to an object.
        for (const [key, value] of request.headers.entries())requestData.headers[key] = value;
        // Add all other serializable request properties
        for (const prop of serializableProperties)if (request[prop] !== undefined) requestData[prop] = request[prop];
        return new StorableRequest(requestData);
    }
    /**
     * Returns a deep clone of the instances `_requestData` object.
     *
     * @return {Object}
     */ toObject() {
        const requestData = Object.assign({}, this._requestData);
        requestData.headers = Object.assign({}, this._requestData.headers);
        if (requestData.body) requestData.body = requestData.body.slice(0);
        return requestData;
    }
    /**
     * Converts this instance to a Request.
     *
     * @return {Request}
     */ toRequest() {
        return new Request(this._requestData.url, this._requestData);
    }
    /**
     * Creates and returns a deep clone of the instance.
     *
     * @return {StorableRequest}
     */ clone() {
        return new StorableRequest(this.toObject());
    }
}

},{"workbox-core/_private/assert.js":"5d4bq","../_version.js":"gAs1W","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"coSVH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "QUEUE_NAME", ()=>QUEUE_NAME);
parcelHelpers.export(exports, "MAX_RETENTION_TIME", ()=>MAX_RETENTION_TIME);
parcelHelpers.export(exports, "GOOGLE_ANALYTICS_HOST", ()=>GOOGLE_ANALYTICS_HOST);
parcelHelpers.export(exports, "GTM_HOST", ()=>GTM_HOST);
parcelHelpers.export(exports, "ANALYTICS_JS_PATH", ()=>ANALYTICS_JS_PATH);
parcelHelpers.export(exports, "GTAG_JS_PATH", ()=>GTAG_JS_PATH);
parcelHelpers.export(exports, "GTM_JS_PATH", ()=>GTM_JS_PATH);
parcelHelpers.export(exports, "COLLECT_DEFAULT_PATH", ()=>COLLECT_DEFAULT_PATH);
parcelHelpers.export(exports, "COLLECT_PATHS_REGEX", ()=>COLLECT_PATHS_REGEX);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const QUEUE_NAME = "workbox-google-analytics";
const MAX_RETENTION_TIME = 2880; // Two days in minutes
const GOOGLE_ANALYTICS_HOST = "www.google-analytics.com";
const GTM_HOST = "www.googletagmanager.com";
const ANALYTICS_JS_PATH = "/analytics.js";
const GTAG_JS_PATH = "/gtag/js";
const GTM_JS_PATH = "/gtm.js";
const COLLECT_DEFAULT_PATH = "/collect";
const COLLECT_PATHS_REGEX = /^\/(\w+\/)?collect/;

},{"../_version.js":"8euR4","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"8euR4":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:google-analytics:6.5.2"] && _();
} catch (e) {}

},{}],"8yq0H":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"kADTf","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"kADTf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-cacheable-response
 */ parcelHelpers.export(exports, "CacheableResponse", ()=>(0, _cacheableResponseJs.CacheableResponse));
parcelHelpers.export(exports, "CacheableResponsePlugin", ()=>(0, _cacheableResponsePluginJs.CacheableResponsePlugin));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheableResponseJs = require("./CacheableResponse.js");
var _cacheableResponsePluginJs = require("./CacheableResponsePlugin.js");
var _versionJs = require("./_version.js");

},{"./CacheableResponse.js":"9Pixv","./CacheableResponsePlugin.js":"j45rR","./_version.js":"7EtJe","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"kp8AJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"9iR0X","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"9iR0X":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-expiration
 */ parcelHelpers.export(exports, "CacheExpiration", ()=>(0, _cacheExpirationJs.CacheExpiration));
parcelHelpers.export(exports, "ExpirationPlugin", ()=>(0, _expirationPluginJs.ExpirationPlugin));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheExpirationJs = require("./CacheExpiration.js");
var _expirationPluginJs = require("./ExpirationPlugin.js");
var _versionJs = require("./_version.js");

},{"./CacheExpiration.js":"eXLdB","./ExpirationPlugin.js":"hOAi4","./_version.js":"j44LK","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"9HtdQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"lAQCW","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"lAQCW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * @module workbox-range-requests
 */ parcelHelpers.export(exports, "createPartialResponse", ()=>(0, _createPartialResponseJs.createPartialResponse));
parcelHelpers.export(exports, "RangeRequestsPlugin", ()=>(0, _rangeRequestsPluginJs.RangeRequestsPlugin));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _createPartialResponseJs = require("./createPartialResponse.js");
var _rangeRequestsPluginJs = require("./RangeRequestsPlugin.js");
var _versionJs = require("./_version.js");

},{"./createPartialResponse.js":"6dSyu","./RangeRequestsPlugin.js":"dVk1r","./_version.js":"28xY9","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"6dSyu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createPartialResponse", ()=>createPartialResponse);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _assertJs = require("workbox-core/_private/assert.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _calculateEffectiveBoundariesJs = require("./utils/calculateEffectiveBoundaries.js");
var _parseRangeHeaderJs = require("./utils/parseRangeHeader.js");
var _versionJs = require("./_version.js");
/**
 * Given a `Request` and `Response` objects as input, this will return a
 * promise for a new `Response`.
 *
 * If the original `Response` already contains partial content (i.e. it has
 * a status of 206), then this assumes it already fulfills the `Range:`
 * requirements, and will return it as-is.
 *
 * @param {Request} request A request, which should contain a Range:
 * header.
 * @param {Response} originalResponse A response.
 * @return {Promise<Response>} Either a `206 Partial Content` response, with
 * the response body set to the slice of content specified by the request's
 * `Range:` header, or a `416 Range Not Satisfiable` response if the
 * conditions of the `Range:` header can't be met.
 *
 * @memberof workbox-range-requests
 */ async function createPartialResponse(request, originalResponse) {
    try {
        (0, _assertJs.assert).isInstance(request, Request, {
            moduleName: "workbox-range-requests",
            funcName: "createPartialResponse",
            paramName: "request"
        });
        (0, _assertJs.assert).isInstance(originalResponse, Response, {
            moduleName: "workbox-range-requests",
            funcName: "createPartialResponse",
            paramName: "originalResponse"
        });
        if (originalResponse.status === 206) // If we already have a 206, then just pass it through as-is;
        // see https://github.com/GoogleChrome/workbox/issues/1720
        return originalResponse;
        const rangeHeader = request.headers.get("range");
        if (!rangeHeader) throw new (0, _workboxErrorJs.WorkboxError)("no-range-header");
        const boundaries = (0, _parseRangeHeaderJs.parseRangeHeader)(rangeHeader);
        const originalBlob = await originalResponse.blob();
        const effectiveBoundaries = (0, _calculateEffectiveBoundariesJs.calculateEffectiveBoundaries)(originalBlob, boundaries.start, boundaries.end);
        const slicedBlob = originalBlob.slice(effectiveBoundaries.start, effectiveBoundaries.end);
        const slicedBlobSize = slicedBlob.size;
        const slicedResponse = new Response(slicedBlob, {
            // Status code 206 is for a Partial Content response.
            // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
            status: 206,
            statusText: "Partial Content",
            headers: originalResponse.headers
        });
        slicedResponse.headers.set("Content-Length", String(slicedBlobSize));
        slicedResponse.headers.set("Content-Range", `bytes ${effectiveBoundaries.start}-${effectiveBoundaries.end - 1}/` + `${originalBlob.size}`);
        return slicedResponse;
    } catch (error) {
        (0, _loggerJs.logger).warn(`Unable to construct a partial response; returning a ` + `416 Range Not Satisfiable response instead.`);
        (0, _loggerJs.logger).groupCollapsed(`View details here.`);
        (0, _loggerJs.logger).log(error);
        (0, _loggerJs.logger).log(request);
        (0, _loggerJs.logger).log(originalResponse);
        (0, _loggerJs.logger).groupEnd();
        return new Response("", {
            status: 416,
            statusText: "Range Not Satisfiable"
        });
    }
}

},{"workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/assert.js":"5d4bq","workbox-core/_private/logger.js":"fWQvD","./utils/calculateEffectiveBoundaries.js":"JqEC3","./utils/parseRangeHeader.js":"6p8uP","./_version.js":"28xY9","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"JqEC3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "calculateEffectiveBoundaries", ()=>calculateEffectiveBoundaries);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _assertJs = require("workbox-core/_private/assert.js");
var _versionJs = require("../_version.js");
/**
 * @param {Blob} blob A source blob.
 * @param {number} [start] The offset to use as the start of the
 * slice.
 * @param {number} [end] The offset to use as the end of the slice.
 * @return {Object} An object with `start` and `end` properties, reflecting
 * the effective boundaries to use given the size of the blob.
 *
 * @private
 */ function calculateEffectiveBoundaries(blob, start, end) {
    (0, _assertJs.assert).isInstance(blob, Blob, {
        moduleName: "workbox-range-requests",
        funcName: "calculateEffectiveBoundaries",
        paramName: "blob"
    });
    const blobSize = blob.size;
    if (end && end > blobSize || start && start < 0) throw new (0, _workboxErrorJs.WorkboxError)("range-not-satisfiable", {
        size: blobSize,
        end,
        start
    });
    let effectiveStart;
    let effectiveEnd;
    if (start !== undefined && end !== undefined) {
        effectiveStart = start;
        // Range values are inclusive, so add 1 to the value.
        effectiveEnd = end + 1;
    } else if (start !== undefined && end === undefined) {
        effectiveStart = start;
        effectiveEnd = blobSize;
    } else if (end !== undefined && start === undefined) {
        effectiveStart = blobSize - end;
        effectiveEnd = blobSize;
    }
    return {
        start: effectiveStart,
        end: effectiveEnd
    };
}

},{"workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/assert.js":"5d4bq","../_version.js":"28xY9","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"28xY9":[function(require,module,exports) {
"use strict";
// @ts-ignore
try {
    self["workbox:range-requests:6.5.2"] && _();
} catch (e) {}

},{}],"6p8uP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "parseRangeHeader", ()=>parseRangeHeader);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _workboxErrorJs = require("workbox-core/_private/WorkboxError.js");
var _assertJs = require("workbox-core/_private/assert.js");
var _versionJs = require("../_version.js");
/**
 * @param {string} rangeHeader A Range: header value.
 * @return {Object} An object with `start` and `end` properties, reflecting
 * the parsed value of the Range: header. If either the `start` or `end` are
 * omitted, then `null` will be returned.
 *
 * @private
 */ function parseRangeHeader(rangeHeader) {
    (0, _assertJs.assert).isType(rangeHeader, "string", {
        moduleName: "workbox-range-requests",
        funcName: "parseRangeHeader",
        paramName: "rangeHeader"
    });
    const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
    if (!normalizedRangeHeader.startsWith("bytes=")) throw new (0, _workboxErrorJs.WorkboxError)("unit-must-be-bytes", {
        normalizedRangeHeader
    });
    // Specifying multiple ranges separate by commas is valid syntax, but this
    // library only attempts to handle a single, contiguous sequence of bytes.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range#Syntax
    if (normalizedRangeHeader.includes(",")) throw new (0, _workboxErrorJs.WorkboxError)("single-range-only", {
        normalizedRangeHeader
    });
    const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
    // We need either at least one of the start or end values.
    if (!rangeParts || !(rangeParts[1] || rangeParts[2])) throw new (0, _workboxErrorJs.WorkboxError)("invalid-range-values", {
        normalizedRangeHeader
    });
    return {
        start: rangeParts[1] === "" ? undefined : Number(rangeParts[1]),
        end: rangeParts[2] === "" ? undefined : Number(rangeParts[2])
    };
}

},{"workbox-core/_private/WorkboxError.js":"9LeL1","workbox-core/_private/assert.js":"5d4bq","../_version.js":"28xY9","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"dVk1r":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "RangeRequestsPlugin", ()=>RangeRequestsPlugin);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _createPartialResponseJs = require("./createPartialResponse.js");
var _versionJs = require("./_version.js");
/**
 * The range request plugin makes it easy for a request with a 'Range' header to
 * be fulfilled by a cached response.
 *
 * It does this by intercepting the `cachedResponseWillBeUsed` plugin callback
 * and returning the appropriate subset of the cached response body.
 *
 * @memberof workbox-range-requests
 */ class RangeRequestsPlugin {
    constructor(){
        /**
         * @param {Object} options
         * @param {Request} options.request The original request, which may or may not
         * contain a Range: header.
         * @param {Response} options.cachedResponse The complete cached response.
         * @return {Promise<Response>} If request contains a 'Range' header, then a
         * new response with status 206 whose body is a subset of `cachedResponse` is
         * returned. Otherwise, `cachedResponse` is returned as-is.
         *
         * @private
         */ this.cachedResponseWillBeUsed = async ({ request , cachedResponse ,  })=>{
            // Only return a sliced response if there's something valid in the cache,
            // and there's a Range: header in the request.
            if (cachedResponse && request.headers.has("range")) return await (0, _createPartialResponseJs.createPartialResponse)(request, cachedResponse);
            // If there was no Range: header, or if cachedResponse wasn't valid, just
            // pass it through as-is.
            return cachedResponse;
        };
    }
}

},{"./createPartialResponse.js":"6dSyu","./_version.js":"28xY9","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"ga2G7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./index.js");
parcelHelpers.exportAll(_indexJs, exports);

},{"./index.js":"iaVE6","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"iaVE6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Most consumers of this module will want to use the
 * {@link workbox-precaching.precacheAndRoute}
 * method to add assets to the cache and respond to network requests with these
 * cached assets.
 *
 * If you require more control over caching and routing, you can use the
 * {@link workbox-precaching.PrecacheController}
 * interface.
 *
 * @module workbox-precaching
 */ parcelHelpers.export(exports, "addPlugins", ()=>(0, _addPluginsJs.addPlugins));
parcelHelpers.export(exports, "addRoute", ()=>(0, _addRouteJs.addRoute));
parcelHelpers.export(exports, "cleanupOutdatedCaches", ()=>(0, _cleanupOutdatedCachesJs.cleanupOutdatedCaches));
parcelHelpers.export(exports, "createHandlerBoundToURL", ()=>(0, _createHandlerBoundToURLJs.createHandlerBoundToURL));
parcelHelpers.export(exports, "getCacheKeyForURL", ()=>(0, _getCacheKeyForURLJs.getCacheKeyForURL));
parcelHelpers.export(exports, "matchPrecache", ()=>(0, _matchPrecacheJs.matchPrecache));
parcelHelpers.export(exports, "precache", ()=>(0, _precacheJs.precache));
parcelHelpers.export(exports, "precacheAndRoute", ()=>(0, _precacheAndRouteJs.precacheAndRoute));
parcelHelpers.export(exports, "PrecacheController", ()=>(0, _precacheControllerJs.PrecacheController));
parcelHelpers.export(exports, "PrecacheRoute", ()=>(0, _precacheRouteJs.PrecacheRoute));
parcelHelpers.export(exports, "PrecacheStrategy", ()=>(0, _precacheStrategyJs.PrecacheStrategy));
parcelHelpers.export(exports, "PrecacheFallbackPlugin", ()=>(0, _precacheFallbackPluginJs.PrecacheFallbackPlugin));
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _addPluginsJs = require("./addPlugins.js");
var _addRouteJs = require("./addRoute.js");
var _cleanupOutdatedCachesJs = require("./cleanupOutdatedCaches.js");
var _createHandlerBoundToURLJs = require("./createHandlerBoundToURL.js");
var _getCacheKeyForURLJs = require("./getCacheKeyForURL.js");
var _matchPrecacheJs = require("./matchPrecache.js");
var _precacheJs = require("./precache.js");
var _precacheAndRouteJs = require("./precacheAndRoute.js");
var _precacheControllerJs = require("./PrecacheController.js");
var _precacheRouteJs = require("./PrecacheRoute.js");
var _precacheStrategyJs = require("./PrecacheStrategy.js");
var _precacheFallbackPluginJs = require("./PrecacheFallbackPlugin.js");
var _versionJs = require("./_version.js");
var _typesJs = require("./_types.js");
parcelHelpers.exportAll(_typesJs, exports);

},{"./addPlugins.js":"gAsXa","./addRoute.js":"1pDEH","./cleanupOutdatedCaches.js":"vS9wr","./createHandlerBoundToURL.js":"ltqIM","./getCacheKeyForURL.js":"gUtkJ","./matchPrecache.js":"ar0UP","./precache.js":"7dmPE","./precacheAndRoute.js":"gauBK","./PrecacheController.js":"dN8p6","./PrecacheRoute.js":"jiSNp","./PrecacheStrategy.js":"6wmZb","./PrecacheFallbackPlugin.js":"gDrAl","./_version.js":"1A2zY","./_types.js":"lKbOk","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gAsXa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "addPlugins", ()=>addPlugins);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * Adds plugins to the precaching strategy.
 *
 * @param {Array<Object>} plugins
 *
 * @memberof workbox-precaching
 */ function addPlugins(plugins) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    precacheController.strategy.plugins.push(...plugins);
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"1pDEH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "addRoute", ()=>addRoute);
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _registerRouteJs = require("workbox-routing/registerRoute.js");
var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _precacheRouteJs = require("./PrecacheRoute.js");
var _versionJs = require("./_version.js");
/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param {Object} [options] See the {@link workbox-precaching.PrecacheRoute}
 * options.
 *
 * @memberof workbox-precaching
 */ function addRoute(options) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    const precacheRoute = new (0, _precacheRouteJs.PrecacheRoute)(precacheController, options);
    (0, _registerRouteJs.registerRoute)(precacheRoute);
}

},{"workbox-routing/registerRoute.js":"dvFuW","./utils/getOrCreatePrecacheController.js":"1Lgpi","./PrecacheRoute.js":"jiSNp","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"jiSNp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheRoute", ()=>PrecacheRoute);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _loggerJs = require("workbox-core/_private/logger.js");
var _getFriendlyURLJs = require("workbox-core/_private/getFriendlyURL.js");
var _routeJs = require("workbox-routing/Route.js");
var _generateURLVariationsJs = require("./utils/generateURLVariations.js");
var _versionJs = require("./_version.js");
/**
 * A subclass of {@link workbox-routing.Route} that takes a
 * {@link workbox-precaching.PrecacheController}
 * instance and uses it to match incoming requests and handle fetching
 * responses from the precache.
 *
 * @memberof workbox-precaching
 * @extends workbox-routing.Route
 */ class PrecacheRoute extends (0, _routeJs.Route) {
    /**
     * @param {PrecacheController} precacheController A `PrecacheController`
     * instance used to both match requests and respond to fetch events.
     * @param {Object} [options] Options to control how requests are matched
     * against the list of precached URLs.
     * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
     * check cache entries for a URLs ending with '/' to see if there is a hit when
     * appending the `directoryIndex` value.
     * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
     * array of regex's to remove search params when looking for a cache match.
     * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
     * check the cache for the URL with a `.html` added to the end of the end.
     * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
     * This is a function that should take a URL and return an array of
     * alternative URLs that should be checked for precache matches.
     */ constructor(precacheController, options){
        const match = ({ request ,  })=>{
            const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
            for (const possibleURL of (0, _generateURLVariationsJs.generateURLVariations)(request.url, options)){
                const cacheKey = urlsToCacheKeys.get(possibleURL);
                if (cacheKey) {
                    const integrity = precacheController.getIntegrityForCacheKey(cacheKey);
                    return {
                        cacheKey,
                        integrity
                    };
                }
            }
            (0, _loggerJs.logger).debug(`Precaching did not find a match for ` + (0, _getFriendlyURLJs.getFriendlyURL)(request.url));
            return;
        };
        super(match, precacheController.strategy);
    }
}

},{"workbox-core/_private/logger.js":"fWQvD","workbox-core/_private/getFriendlyURL.js":"b3dxx","workbox-routing/Route.js":"28fs2","./utils/generateURLVariations.js":"c1nUl","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"c1nUl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Generator function that yields possible variations on the original URL to
 * check, one at a time.
 *
 * @param {string} url
 * @param {Object} options
 *
 * @private
 * @memberof workbox-precaching
 */ parcelHelpers.export(exports, "generateURLVariations", ()=>generateURLVariations);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _removeIgnoredSearchParamsJs = require("./removeIgnoredSearchParams.js");
var _versionJs = require("../_version.js");
function* generateURLVariations(url, { ignoreURLParametersMatching =[
    /^utm_/,
    /^fbclid$/
] , directoryIndex ="index.html" , cleanURLs =true , urlManipulation ,  } = {}) {
    const urlObject = new URL(url, location.href);
    urlObject.hash = "";
    yield urlObject.href;
    const urlWithoutIgnoredParams = (0, _removeIgnoredSearchParamsJs.removeIgnoredSearchParams)(urlObject, ignoreURLParametersMatching);
    yield urlWithoutIgnoredParams.href;
    if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
        const directoryURL = new URL(urlWithoutIgnoredParams.href);
        directoryURL.pathname += directoryIndex;
        yield directoryURL.href;
    }
    if (cleanURLs) {
        const cleanURL = new URL(urlWithoutIgnoredParams.href);
        cleanURL.pathname += ".html";
        yield cleanURL.href;
    }
    if (urlManipulation) {
        const additionalURLs = urlManipulation({
            url: urlObject
        });
        for (const urlToAttempt of additionalURLs)yield urlToAttempt.href;
    }
}

},{"./removeIgnoredSearchParams.js":"bXSaa","../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"bXSaa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Removes any URL search parameters that should be ignored.
 *
 * @param {URL} urlObject The original URL.
 * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
 * each search parameter name. Matches mean that the search parameter should be
 * ignored.
 * @return {URL} The URL with any ignored search parameters removed.
 *
 * @private
 * @memberof workbox-precaching
 */ parcelHelpers.export(exports, "removeIgnoredSearchParams", ()=>removeIgnoredSearchParams);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
    // Convert the iterable into an array at the start of the loop to make sure
    // deletion doesn't mess up iteration.
    for (const paramName of [
        ...urlObject.searchParams.keys()
    ])if (ignoreURLParametersMatching.some((regExp)=>regExp.test(paramName))) urlObject.searchParams.delete(paramName);
    return urlObject;
}

},{"../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"vS9wr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cleanupOutdatedCaches", ()=>cleanupOutdatedCaches);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _cacheNamesJs = require("workbox-core/_private/cacheNames.js");
var _loggerJs = require("workbox-core/_private/logger.js");
var _deleteOutdatedCachesJs = require("./utils/deleteOutdatedCaches.js");
var _versionJs = require("./_version.js");
/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Workbox.
 *
 * @memberof workbox-precaching
 */ function cleanupOutdatedCaches() {
    // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
    self.addEventListener("activate", (event)=>{
        const cacheName = (0, _cacheNamesJs.cacheNames).getPrecacheName();
        event.waitUntil((0, _deleteOutdatedCachesJs.deleteOutdatedCaches)(cacheName).then((cachesDeleted)=>{
            if (cachesDeleted.length > 0) (0, _loggerJs.logger).log(`The following out-of-date precaches were cleaned up ` + `automatically:`, cachesDeleted);
        }));
    });
}

},{"workbox-core/_private/cacheNames.js":"6rn2w","workbox-core/_private/logger.js":"fWQvD","./utils/deleteOutdatedCaches.js":"hXsXm","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"hXsXm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "deleteOutdatedCaches", ()=>deleteOutdatedCaches);
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("../_version.js");
const SUBSTRING_TO_FIND = "-precache-";
/**
 * Cleans up incompatible precaches that were created by older versions of
 * Workbox, by a service worker registered under the current scope.
 *
 * This is meant to be called as part of the `activate` event.
 *
 * This should be safe to use as long as you don't include `substringToFind`
 * (defaulting to `-precache-`) in your non-precache cache names.
 *
 * @param {string} currentPrecacheName The cache name currently in use for
 * precaching. This cache won't be deleted.
 * @param {string} [substringToFind='-precache-'] Cache names which include this
 * substring will be deleted (excluding `currentPrecacheName`).
 * @return {Array<string>} A list of all the cache names that were deleted.
 *
 * @private
 * @memberof workbox-precaching
 */ const deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND)=>{
    const cacheNames = await self.caches.keys();
    const cacheNamesToDelete = cacheNames.filter((cacheName)=>{
        return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
    });
    await Promise.all(cacheNamesToDelete.map((cacheName)=>self.caches.delete(cacheName)));
    return cacheNamesToDelete;
};

},{"../_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"ltqIM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createHandlerBoundToURL", ()=>createHandlerBoundToURL);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * Helper function that calls
 * {@link PrecacheController#createHandlerBoundToURL} on the default
 * {@link PrecacheController} instance.
 *
 * If you are creating your own {@link PrecacheController}, then call the
 * {@link PrecacheController#createHandlerBoundToURL} on that instance,
 * instead of using this function.
 *
 * @param {string} url The precached URL which will be used to lookup the
 * `Response`.
 * @param {boolean} [fallbackToNetwork=true] Whether to attempt to get the
 * response from the network if there's a precache miss.
 * @return {workbox-routing~handlerCallback}
 *
 * @memberof workbox-precaching
 */ function createHandlerBoundToURL(url) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    return precacheController.createHandlerBoundToURL(url);
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gUtkJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getCacheKeyForURL", ()=>getCacheKeyForURL);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * Takes in a URL, and returns the corresponding URL that could be used to
 * lookup the entry in the precache.
 *
 * If a relative URL is provided, the location of the service worker file will
 * be used as the base.
 *
 * For precached entries without revision information, the cache key will be the
 * same as the original URL.
 *
 * For precached entries with revision information, the cache key will be the
 * original URL with the addition of a query parameter used for keeping track of
 * the revision info.
 *
 * @param {string} url The URL whose cache key to look up.
 * @return {string} The cache key that corresponds to that URL.
 *
 * @memberof workbox-precaching
 */ function getCacheKeyForURL(url) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    return precacheController.getCacheKeyForURL(url);
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"7dmPE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "precache", ()=>precache);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * Adds items to the precache list, removing any duplicates and
 * stores the files in the
 * {@link workbox-core.cacheNames|"precache cache"} when the service
 * worker installs.
 *
 * This method can be called multiple times.
 *
 * Please note: This method **will not** serve any of the cached files for you.
 * It only precaches files. To respond to a network request you call
 * {@link workbox-precaching.addRoute}.
 *
 * If you have a single array of files to precache, you can just call
 * {@link workbox-precaching.precacheAndRoute}.
 *
 * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
 *
 * @memberof workbox-precaching
 */ function precache(entries) {
    const precacheController = (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    precacheController.precache(entries);
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gauBK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "precacheAndRoute", ()=>precacheAndRoute);
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _addRouteJs = require("./addRoute.js");
var _precacheJs = require("./precache.js");
var _versionJs = require("./_version.js");
/**
 * This method will add entries to the precache list and add a route to
 * respond to fetch events.
 *
 * This is a convenience method that will call
 * {@link workbox-precaching.precache} and
 * {@link workbox-precaching.addRoute} in a single call.
 *
 * @param {Array<Object|string>} entries Array of entries to precache.
 * @param {Object} [options] See the
 * {@link workbox-precaching.PrecacheRoute} options.
 *
 * @memberof workbox-precaching
 */ function precacheAndRoute(entries, options) {
    (0, _precacheJs.precache)(entries);
    (0, _addRouteJs.addRoute)(options);
}

},{"./addRoute.js":"1pDEH","./precache.js":"7dmPE","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"gDrAl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PrecacheFallbackPlugin", ()=>PrecacheFallbackPlugin);
/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _getOrCreatePrecacheControllerJs = require("./utils/getOrCreatePrecacheController.js");
var _versionJs = require("./_version.js");
/**
 * `PrecacheFallbackPlugin` allows you to specify an "offline fallback"
 * response to be used when a given strategy is unable to generate a response.
 *
 * It does this by intercepting the `handlerDidError` plugin callback
 * and returning a precached response, taking the expected revision parameter
 * into account automatically.
 *
 * Unless you explicitly pass in a `PrecacheController` instance to the
 * constructor, the default instance will be used. Generally speaking, most
 * developers will end up using the default.
 *
 * @memberof workbox-precaching
 */ class PrecacheFallbackPlugin {
    /**
     * Constructs a new PrecacheFallbackPlugin with the associated fallbackURL.
     *
     * @param {Object} config
     * @param {string} config.fallbackURL A precached URL to use as the fallback
     *     if the associated strategy can't generate a response.
     * @param {PrecacheController} [config.precacheController] An optional
     *     PrecacheController instance. If not provided, the default
     *     PrecacheController will be used.
     */ constructor({ fallbackURL , precacheController ,  }){
        /**
         * @return {Promise<Response>} The precache response for the fallback URL.
         *
         * @private
         */ this.handlerDidError = ()=>this._precacheController.matchPrecache(this._fallbackURL);
        this._fallbackURL = fallbackURL;
        this._precacheController = precacheController || (0, _getOrCreatePrecacheControllerJs.getOrCreatePrecacheController)();
    }
}

},{"./utils/getOrCreatePrecacheController.js":"1Lgpi","./_version.js":"1A2zY","@parcel/transformer-js/src/esmodule-helpers.js":"jRKQF"}],"lKbOk":[function(require,module,exports) {
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/ var _versionJs = require("./_version.js"); // * * * IMPORTANT! * * *
 // ------------------------------------------------------------------------- //
 // jdsoc type definitions cannot be declared above TypeScript definitions or
 // they'll be stripped from the built `.js` files, and they'll only be in the
 // `d.ts` files, which aren't read by the jsdoc generator. As a result we
 // have to put declare them below.
 /**
 * @typedef {Object} InstallResult
 * @property {Array<string>} updatedURLs List of URLs that were updated during
 * installation.
 * @property {Array<string>} notUpdatedURLs List of URLs that were already up to
 * date.
 *
 * @memberof workbox-precaching
 */  /**
 * @typedef {Object} CleanupResult
 * @property {Array<string>} deletedCacheRequests List of URLs that were deleted
 * while cleaning up the cache.
 *
 * @memberof workbox-precaching
 */  /**
 * @typedef {Object} PrecacheEntry
 * @property {string} url URL to precache.
 * @property {string} [revision] Revision information for the URL.
 * @property {string} [integrity] Integrity metadata that will be used when
 * making the network request for the URL.
 *
 * @memberof workbox-precaching
 */  /**
 * The "urlManipulation" callback can be used to determine if there are any
 * additional permutations of a URL that should be used to check against
 * the available precached files.
 *
 * For example, Workbox supports checking for '/index.html' when the URL
 * '/' is provided. This callback allows additional, custom checks.
 *
 * @callback ~urlManipulation
 * @param {Object} context
 * @param {URL} context.url The request's URL.
 * @return {Array<URL>} To add additional urls to test, return an Array of
 * URLs. Please note that these **should not be strings**, but URL objects.
 *
 * @memberof workbox-precaching
 */ 

},{"./_version.js":"1A2zY"}]},["i2Knv","kjt46"], "kjt46", "parcelRequireaaed")

//# sourceMappingURL=service-worker.js.map
