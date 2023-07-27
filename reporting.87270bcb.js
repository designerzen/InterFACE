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
})({"iMq8e":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "7cd9f9bb87270bcb";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
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
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
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
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
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
        console.log("[parcel] ✨ Error resolved");
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
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
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
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
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
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
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
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
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
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"dFRyc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setupReporting", ()=>setupReporting);
parcelHelpers.export(exports, "track", ()=>track);
parcelHelpers.export(exports, "trackExit", ()=>trackExit);
parcelHelpers.export(exports, "trackError", ()=>trackError);
var _analytics = require("analytics");
var _analyticsDefault = parcelHelpers.interopDefault(_analytics);
var _googleAnalytics = require("@analytics/google-analytics");
var _googleAnalyticsDefault = parcelHelpers.interopDefault(_googleAnalytics);
let analytics;
const setupReporting = (name = "Interface", id = "G-1XT0GV0L6J")=>{
    analytics = (0, _analyticsDefault.default)({
        app: name,
        plugins: [
            (0, _googleAnalyticsDefault.default)({
                trackingId: id
            })
        ]
    });
    // Track a page view 
    analytics.page();
    return analytics;
// // Track a custom event 
// analytics.track('playedVideo', {
// 	category: 'Videos',
// 	label: 'Fall Campaign',
// 	value: 42
// })
// // Identify a visitor
// analytics.identify('user-id-xyz', {
// 	firstName: 'bill',
// 	lastName: 'murray'
// })	
};
const track = (name, data)=>{
    if (analytics) analytics.track(name, data);
};
const trackExit = ()=>{
// // Track a custom event 
// analytics.track('playedVideo', {
// 	category: 'Videos',
// 	label: 'Fall Campaign',
// 	value: 42
// })
};
const trackError = (error, code = 42, category = "Fails")=>{
    if (analytics) analytics.track("Error", {
        category: category,
        label: error,
        value: code
    });
};

},{"analytics":"bR9uJ","@analytics/google-analytics":"3iK6o","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bR9uJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CONSTANTS", ()=>(0, _core.CONSTANTS));
parcelHelpers.export(exports, "EVENTS", ()=>(0, _core.EVENTS));
parcelHelpers.export(exports, "Analytics", ()=>analyticsLib);
parcelHelpers.export(exports, "default", ()=>analyticsLib);
parcelHelpers.export(exports, "init", ()=>analyticsLib);
var _core = require("@analytics/core");
var _storageUtils = require("@analytics/storage-utils");
var _storageUtilsDefault = parcelHelpers.interopDefault(_storageUtils);
function _defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread2(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function analyticsLib() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultSettings = {
        storage: (0, _storageUtilsDefault.default)
    };
    return (0, _core.Analytics)(_objectSpread2(_objectSpread2({}, defaultSettings), opts));
}

},{"@analytics/core":"5X4eL","@analytics/storage-utils":"gu9ng","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5X4eL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Analytics", ()=>Ve);
parcelHelpers.export(exports, "CONSTANTS", ()=>j);
parcelHelpers.export(exports, "EVENTS", ()=>q);
parcelHelpers.export(exports, "default", ()=>Ve);
parcelHelpers.export(exports, "init", ()=>Ve);
var _analyticsUtils = require("analytics-utils");
var _globalStorageUtils = require("@analytics/global-storage-utils");
var _typeUtils = require("@analytics/type-utils");
function v() {
    return v = Object.assign || function(e) {
        for(var n = 1; n < arguments.length; n++){
            var t = arguments[n];
            for(var r in t)Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
        }
        return e;
    }, v.apply(this, arguments);
}
var y = "function", b = "undefined", I = "@@redux/" + Math.random().toString(36), w = /* #__PURE__ */ function() {
    return typeof Symbol === y && Symbol.observable || "@@observable";
}(), E = " != " + y;
function P(e, n, t) {
    var r;
    if (typeof n === y && typeof t === b && (t = n, n = void 0), typeof t !== b) {
        if (typeof t !== y) throw new Error("enhancer" + E);
        return t(P)(e, n);
    }
    if (typeof e !== y) throw new Error("reducer" + E);
    var i = e, a = n, o = [], u = o, c = !1;
    function s() {
        u === o && (u = o.slice());
    }
    function f() {
        return a;
    }
    function d(e) {
        if (typeof e !== y) throw new Error("Listener" + E);
        var n = !0;
        return s(), u.push(e), function() {
            if (n) {
                n = !1, s();
                var t = u.indexOf(e);
                u.splice(t, 1);
            }
        };
    }
    function p(e) {
        if (!(0, _typeUtils.isObject)(e)) throw new Error("Act != obj");
        if (typeof e.type === b) throw new Error("ActType " + b);
        if (c) throw new Error("Dispatch in reducer");
        try {
            c = !0, a = i(a, e);
        } finally{
            c = !1;
        }
        for(var n = o = u, t = 0; t < n.length; t++)(0, n[t])();
        return e;
    }
    return p({
        type: "@@redux/INIT"
    }), (r = {
        dispatch: p,
        subscribe: d,
        getState: f,
        replaceReducer: function(e) {
            if (typeof e !== y) throw new Error("next reducer" + E);
            i = e, p({
                type: "@@redux/INIT"
            });
        }
    })[w] = function() {
        var e, n = d;
        return (e = {
            subscribe: function(e) {
                if ("object" != typeof e) throw new TypeError("Observer != obj");
                function t() {
                    e.next && e.next(f());
                }
                return t(), {
                    unsubscribe: n(t)
                };
            }
        })[w] = function() {
            return this;
        }, e;
    }, r;
}
function S(e, n) {
    var t = n && n.type;
    return "action " + (t && t.toString() || "?") + "reducer " + e + " returns " + b;
}
function N() {
    var e = [].slice.call(arguments);
    return 0 === e.length ? function(e) {
        return e;
    } : 1 === e.length ? e[0] : e.reduce(function(e, n) {
        return function() {
            return e(n.apply(void 0, [].slice.call(arguments)));
        };
    });
}
function O() {
    var e = arguments;
    return function(n) {
        return function(t, r, i) {
            var a, o = n(t, r, i), u = o.dispatch, c = {
                getState: o.getState,
                dispatch: function(e) {
                    return u(e);
                }
            };
            return a = [].slice.call(e).map(function(e) {
                return e(c);
            }), v({}, o, {
                dispatch: u = N.apply(void 0, a)(o.dispatch)
            });
        };
    };
}
var A = (0, _typeUtils.PREFIX) + "anon_id", _ = (0, _typeUtils.PREFIX) + "user_id", x = (0, _typeUtils.PREFIX) + "user_traits", j = {
    __proto__: null,
    ANON_ID: A,
    USER_ID: _,
    USER_TRAITS: x
}, k = "userId", T = "anonymousId", z = [
    "bootstrap",
    "params",
    "campaign",
    "initializeStart",
    "initialize",
    "initializeEnd",
    "ready",
    "resetStart",
    "reset",
    "resetEnd",
    "pageStart",
    "page",
    "pageEnd",
    "pageAborted",
    "trackStart",
    "track",
    "trackEnd",
    "trackAborted",
    "identifyStart",
    "identify",
    "identifyEnd",
    "identifyAborted",
    "userIdChanged",
    "registerPlugins",
    "enablePlugin",
    "disablePlugin",
    "online",
    "offline",
    "setItemStart",
    "setItem",
    "setItemEnd",
    "setItemAborted",
    "removeItemStart",
    "removeItem",
    "removeItemEnd",
    "removeItemAborted"
], M = [
    "name",
    "EVENTS",
    "config",
    "loaded"
], q = z.reduce(function(e, n) {
    return e[n] = n, e;
}, {
    registerPluginType: function(e) {
        return "registerPlugin:" + e;
    },
    pluginReadyType: function(e) {
        return "ready:" + e;
    }
}), U = /^utm_/, V = /^an_prop_/, L = /^an_trait_/;
function C(e) {
    var n = e.storage.setItem;
    return function(t) {
        return function(r) {
            return function(i) {
                if (i.type === q.bootstrap) {
                    var a = i.params, o = i.user, u = i.persistedUser, c = i.initialUser, s = u.userId === o.userId;
                    u.anonymousId !== o.anonymousId && n(A, o.anonymousId), s || n(_, o.userId), c.traits && n(x, v({}, s && u.traits ? u.traits : {}, c.traits));
                    var l = Object.keys(i.params);
                    if (l.length) {
                        var f = a.an_uid, d = a.an_event, p = l.reduce(function(e, n) {
                            if (n.match(U) || n.match(/^(d|g)clid/)) {
                                var t = n.replace(U, "");
                                e.campaign["campaign" === t ? "name" : t] = a[n];
                            }
                            return n.match(V) && (e.props[n.replace(V, "")] = a[n]), n.match(L) && (e.traits[n.replace(L, "")] = a[n]), e;
                        }, {
                            campaign: {},
                            props: {},
                            traits: {}
                        });
                        t.dispatch(v({
                            type: q.params,
                            raw: a
                        }, p, f ? {
                            userId: f
                        } : {})), f && setTimeout(function() {
                            return e.identify(f, p.traits);
                        }, 0), d && setTimeout(function() {
                            return e.track(d, p.props);
                        }, 0), Object.keys(p.campaign).length && t.dispatch({
                            type: q.campaign,
                            campaign: p.campaign
                        });
                    }
                }
                return r(i);
            };
        };
    };
}
function R(e) {
    return function(n, t) {
        if (void 0 === n && (n = {}), void 0 === t && (t = {}), t.type === q.setItemEnd) {
            if (t.key === A) return v({}, n, {
                anonymousId: t.value
            });
            if (t.key === _) return v({}, n, {
                userId: t.value
            });
        }
        switch(t.type){
            case q.identify:
                return Object.assign({}, n, {
                    userId: t.userId,
                    traits: v({}, n.traits, t.traits)
                });
            case q.reset:
                return [
                    _,
                    A,
                    x
                ].forEach(function(n) {
                    e.removeItem(n);
                }), Object.assign({}, n, {
                    userId: null,
                    anonymousId: null,
                    traits: {}
                });
            default:
                return n;
        }
    };
}
function $(e) {
    return {
        userId: e.getItem(_),
        anonymousId: e.getItem(A),
        traits: e.getItem(x)
    };
}
var D = function(e) {
    return (0, _typeUtils.PREFIX) + "TEMP" + (0, _typeUtils.PREFIX) + e;
};
function B(n) {
    var t = n.storage, r = t.setItem, i = t.removeItem, a = t.getItem;
    return function(n) {
        return function(t) {
            return function(u) {
                var c = u.userId, s = u.traits, l = u.options;
                if (u.type === q.reset && ([
                    _,
                    x,
                    A
                ].forEach(function(e) {
                    i(e);
                }), [
                    k,
                    T,
                    "traits"
                ].forEach(function(e) {
                    (0, _globalStorageUtils.remove)(D(e));
                })), u.type === q.identify) {
                    a(A) || r(A, (0, _analyticsUtils.uuid)());
                    var f = a(_), d = a(x) || {};
                    f && f !== c && n.dispatch({
                        type: q.userIdChanged,
                        old: {
                            userId: f,
                            traits: d
                        },
                        new: {
                            userId: c,
                            traits: s
                        },
                        options: l
                    }), c && r(_, c), s && r(x, v({}, d, s));
                }
                return t(u);
            };
        };
    };
}
var X = {};
function J(e, n) {
    X[e] && (0, _typeUtils.isFunction)(X[e]) && (X[e](n), delete X[e]);
}
function W(e, n, t) {
    return new Promise(function(r, i) {
        return n() ? r(e) : t < 1 ? i(v({}, e, {
            queue: !0
        })) : new Promise(function(e) {
            return setTimeout(e, 10);
        }).then(function(a) {
            return W(e, n, t - 10).then(r, i);
        });
    });
}
function H(e, n, t) {
    var r = n(), i = e.getState(), a = i.plugins, o = i.queue, u = i.user;
    if (!i.context.offline && o && o.actions && o.actions.length) {
        var c = o.actions.reduce(function(e, n, t) {
            return a[n.plugin].loaded ? (e.process.push(n), e.processIndex.push(t)) : (e.requeue.push(n), e.requeueIndex.push(t)), e;
        }, {
            processIndex: [],
            process: [],
            requeue: [],
            requeueIndex: []
        });
        if (c.processIndex && c.processIndex.length) {
            c.processIndex.forEach(function(n) {
                var i = o.actions[n], c = i.plugin, s = i.payload.type, l = r[c][s];
                if (l && (0, _typeUtils.isFunction)(l)) {
                    var f = function(e, n) {
                        return void 0 === e && (e = {}), void 0 === n && (n = {}), [
                            k,
                            T
                        ].reduce(function(t, r) {
                            return e.hasOwnProperty(r) && n[r] && n[r] !== e[r] && (t[r] = n[r]), t;
                        }, e);
                    }(i.payload, u);
                    l({
                        payload: f,
                        config: a[c].config,
                        instance: t
                    });
                    var p = s + ":" + c;
                    e.dispatch(v({}, f, {
                        type: p,
                        _: {
                            called: p,
                            from: "queueDrain"
                        }
                    }));
                }
            });
            var s = o.actions.filter(function(e, n) {
                return !~c.processIndex.indexOf(n);
            });
            o.actions = s;
        }
    }
}
var F = function(e) {
    var n = e.data, t = e.action, r = e.instance, i = e.state, a = e.allPlugins, o = e.allMatches, u = e.store, c = e.EVENTS;
    try {
        var s = i.plugins, f = i.context, p = t.type, m = p.match(G), g = n.exact.map(function(e) {
            return e.pluginName;
        });
        m && (g = o.during.map(function(e) {
            return e.pluginName;
        }));
        var h = function(e, n) {
            return function(t, r, i) {
                var a = r.config, o = r.name, u = o + "." + t.type;
                i && (u = i.event);
                var c = t.type.match(G) ? function(e, n, t, r, i) {
                    return function(a, o) {
                        var u = r ? r.name : e, c = o && ie(o) ? o : t;
                        if (r && (!(c = o && ie(o) ? o : [
                            e
                        ]).includes(e) || 1 !== c.length)) throw new Error("Method " + n + " can only abort " + e + " plugin. " + JSON.stringify(c) + " input valid");
                        return v({}, i, {
                            abort: {
                                reason: a,
                                plugins: c,
                                caller: n,
                                _: u
                            }
                        });
                    };
                }(o, u, n, i, t) : function(e, n) {
                    return function() {
                        throw new Error(e.type + " action not cancellable. Remove abort in " + n);
                    };
                }(t, u);
                return {
                    payload: ue(t),
                    instance: e,
                    config: a || {},
                    abort: c
                };
            };
        }(r, g), y = n.exact.reduce(function(e, n) {
            var t = n.pluginName, r = n.methodName, i = !1;
            return r.match(/^initialize/) || r.match(/^reset/) || (i = !s[t].loaded), f.offline && r.match(/^(page|track|identify)/) && (i = !0), e["" + t] = i, e;
        }, {});
        return Promise.resolve(n.exact.reduce(function(e, i, o) {
            try {
                var u = i.pluginName;
                return Promise.resolve(e).then(function(e) {
                    function i() {
                        return Promise.resolve(e);
                    }
                    var o = function() {
                        if (n.namespaced && n.namespaced[u]) return Promise.resolve(n.namespaced[u].reduce(function(e, n, t) {
                            try {
                                return Promise.resolve(e).then(function(e) {
                                    var t, i, o;
                                    return n.method && (0, _typeUtils.isFunction)(n.method) ? (function(e, n) {
                                        var t = oe(e);
                                        if (t && t.name === n) {
                                            var r = oe(t.method);
                                            throw new Error([
                                                n + " plugin is calling method " + e,
                                                "Plugins cant call self",
                                                "Use " + t.method + " " + (r ? "or " + r.method : "") + " in " + n + " plugin insteadof " + e
                                            ].join("\n"));
                                        }
                                    }(n.methodName, n.pluginName), Promise.resolve(n.method({
                                        payload: e,
                                        instance: r,
                                        abort: (t = e, i = u, o = n.pluginName, function(e, n) {
                                            return v({}, t, {
                                                abort: {
                                                    reason: e,
                                                    plugins: n || [
                                                        i
                                                    ],
                                                    caller: p,
                                                    from: o || i
                                                }
                                            });
                                        }),
                                        config: Z(n.pluginName, s, a),
                                        plugins: s
                                    })).then(function(n) {
                                        var t = (0, _typeUtils.isObject)(n) ? n : {};
                                        return Promise.resolve(v({}, e, t));
                                    })) : e;
                                });
                            } catch (e) {
                                return Promise.reject(e);
                            }
                        }, Promise.resolve(t))).then(function(n) {
                            e[u] = n;
                        });
                        e[u] = t;
                    }();
                    return o && o.then ? o.then(i) : i();
                });
            } catch (e) {
                return Promise.reject(e);
            }
        }, Promise.resolve({}))).then(function(e) {
            return Promise.resolve(n.exact.reduce(function(t, i, o) {
                try {
                    var c = n.exact.length === o + 1, f = i.pluginName, d = a[f];
                    return Promise.resolve(t).then(function(n) {
                        var t = e[f] ? e[f] : {};
                        if (m && (t = n), te(t, f)) return Y({
                            data: t,
                            method: p,
                            instance: r,
                            pluginName: f,
                            store: u
                        }), Promise.resolve(n);
                        if (te(n, f)) return c && Y({
                            data: n,
                            method: p,
                            instance: r,
                            store: u
                        }), Promise.resolve(n);
                        if (y.hasOwnProperty(f) && !0 === y[f]) return u.dispatch({
                            type: "queue",
                            plugin: f,
                            payload: t,
                            _: {
                                called: "queue",
                                from: "queueMechanism"
                            }
                        }), Promise.resolve(n);
                        var i = h(e[f], a[f]);
                        return Promise.resolve(d[p]({
                            abort: i.abort,
                            payload: t,
                            instance: r,
                            config: Z(f, s, a),
                            plugins: s
                        })).then(function(i) {
                            var a = (0, _typeUtils.isObject)(i) ? i : {}, o = v({}, n, a), c = e[f];
                            if (te(c, f)) Y({
                                data: c,
                                method: p,
                                instance: r,
                                pluginName: f,
                                store: u
                            });
                            else {
                                var s = p + ":" + f;
                                (s.match(/:/g) || []).length < 2 && !p.match(K) && !p.match(Q) && r.dispatch(v({}, m ? o : t, {
                                    type: s,
                                    _: {
                                        called: s,
                                        from: "submethod"
                                    }
                                }));
                            }
                            return Promise.resolve(o);
                        });
                    });
                } catch (e) {
                    return Promise.reject(e);
                }
            }, Promise.resolve(t))).then(function(e) {
                if (!(p.match(G) || p.match(/^registerPlugin/) || p.match(Q) || p.match(K) || p.match(/^params/) || p.match(/^userIdChanged/))) {
                    if (c.plugins.includes(p), e._ && e._.originalAction === p) return e;
                    var t = v({}, e, {
                        _: {
                            originalAction: e.type,
                            called: e.type,
                            from: "engineEnd"
                        }
                    });
                    re(e, n.exact.length) && !p.match(/End$/) && (t = v({}, t, {
                        type: e.type + "Aborted"
                    })), u.dispatch(t);
                }
                return e;
            });
        });
    } catch (e) {
        return Promise.reject(e);
    }
}, G = /Start$/, K = /^bootstrap/, Q = /^ready/;
function Y(e) {
    var n = e.pluginName, t = e.method + "Aborted" + (n ? ":" + n : "");
    e.store.dispatch(v({}, e.data, {
        type: t,
        _: {
            called: t,
            from: "abort"
        }
    }));
}
function Z(e, n, t) {
    var r = n[e] || t[e];
    return r && r.config ? r.config : {};
}
function ee(e, n) {
    return n.reduce(function(n, t) {
        return t[e] ? n.concat({
            methodName: e,
            pluginName: t.name,
            method: t[e]
        }) : n;
    }, []);
}
function ne(e, n) {
    var t = e.replace(G, ""), r = n ? ":" + n : "";
    return [
        "" + e + r,
        "" + t + r,
        t + "End" + r
    ];
}
function te(e, n) {
    var t = e.abort;
    return !!t && (!0 === t || ae(t, n) || t && ae(t.plugins, n));
}
function re(e, n) {
    var t = e.abort;
    if (!t) return !1;
    if (!0 === t || (0, _typeUtils.isString)(t)) return !0;
    var r = t.plugins;
    return ie(t) && t.length === n || ie(r) && r.length === n;
}
function ie(e) {
    return Array.isArray(e);
}
function ae(e, n) {
    return !(!e || !ie(e)) && e.includes(n);
}
function oe(e) {
    var n = e.match(/(.*):(.*)/);
    return !!n && {
        method: n[1],
        name: n[2]
    };
}
function ue(e) {
    return Object.keys(e).reduce(function(n, t) {
        return "type" === t || (n[t] = (0, _typeUtils.isObject)(e[t]) ? Object.assign({}, e[t]) : e[t]), n;
    }, {});
}
function ce(e, n, t) {
    var r = {};
    return function(i) {
        return function(a) {
            return function(o) {
                try {
                    var u, c = function(e) {
                        return u ? e : a(f);
                    }, s = o.type, l = o.plugins, f = o;
                    if (o.abort) return Promise.resolve(a(o));
                    if (s === q.enablePlugin && i.dispatch({
                        type: q.initializeStart,
                        plugins: l,
                        disabled: [],
                        fromEnable: !0,
                        meta: o.meta
                    }), s === q.disablePlugin && setTimeout(function() {
                        return J(o.meta.rid, {
                            payload: o
                        });
                    }, 0), s === q.initializeEnd) {
                        var m = n(), g = Object.keys(m), h = g.filter(function(e) {
                            return l.includes(e);
                        }).map(function(e) {
                            return m[e];
                        }), y = [], b = [], I = o.disabled, w = h.map(function(e) {
                            var n = e.loaded, t = e.name, a = e.config;
                            return W(e, function() {
                                return n({
                                    config: a
                                });
                            }, 1e4).then(function(n) {
                                return r[t] || (i.dispatch({
                                    type: q.pluginReadyType(t),
                                    name: t,
                                    events: Object.keys(e).filter(function(e) {
                                        return !M.includes(e);
                                    })
                                }), r[t] = !0), y = y.concat(t), e;
                            }).catch(function(e) {
                                if (e instanceof Error) throw new Error(e);
                                return b = b.concat(e.name), e;
                            });
                        });
                        Promise.all(w).then(function(e) {
                            var n = {
                                plugins: y,
                                failed: b,
                                disabled: I
                            };
                            setTimeout(function() {
                                g.length === w.length + I.length && i.dispatch(v({}, {
                                    type: q.ready
                                }, n));
                            }, 0);
                        });
                    }
                    var E = function() {
                        if (s !== q.bootstrap) return /^ready:([^:]*)$/.test(s) && setTimeout(function() {
                            return H(i, n, e);
                        }, 0), Promise.resolve(function(e, n, t, r, i) {
                            try {
                                var a = (0, _typeUtils.isFunction)(n) ? n() : n, o = e.type, u = o.replace(G, "");
                                if (e._ && e._.called) return Promise.resolve(e);
                                var c = t.getState(), s = (m = a, void 0 === (g = c.plugins) && (g = {}), void 0 === (h = e.options) && (h = {}), Object.keys(m).filter(function(e) {
                                    var n = h.plugins || {};
                                    return (0, _typeUtils.isBoolean)(n[e]) ? n[e] : !1 !== n.all && (!g[e] || !1 !== g[e].enabled);
                                }).map(function(e) {
                                    return m[e];
                                }));
                                o === q.initializeStart && e.fromEnable && (s = Object.keys(c.plugins).filter(function(n) {
                                    var t = c.plugins[n];
                                    return e.plugins.includes(n) && !t.initialized;
                                }).map(function(e) {
                                    return a[e];
                                }));
                                var l = s.map(function(e) {
                                    return e.name;
                                }), f = function(e, n, t) {
                                    var r = ne(e).map(function(e) {
                                        return ee(e, n);
                                    });
                                    return n.reduce(function(t, r) {
                                        var i = r.name, a = ne(e, i).map(function(e) {
                                            return ee(e, n);
                                        }), o = a[0], u = a[1], c = a[2];
                                        return o.length && (t.beforeNS[i] = o), u.length && (t.duringNS[i] = u), c.length && (t.afterNS[i] = c), t;
                                    }, {
                                        before: r[0],
                                        beforeNS: {},
                                        during: r[1],
                                        duringNS: {},
                                        after: r[2],
                                        afterNS: {}
                                    });
                                }(o, s);
                                return Promise.resolve(F({
                                    action: e,
                                    data: {
                                        exact: f.before,
                                        namespaced: f.beforeNS
                                    },
                                    state: c,
                                    allPlugins: a,
                                    allMatches: f,
                                    instance: t,
                                    store: r,
                                    EVENTS: i
                                })).then(function(e) {
                                    function n() {
                                        var n = function() {
                                            if (o.match(G)) return Promise.resolve(F({
                                                action: v({}, s, {
                                                    type: u + "End"
                                                }),
                                                data: {
                                                    exact: f.after,
                                                    namespaced: f.afterNS
                                                },
                                                state: c,
                                                allPlugins: a,
                                                allMatches: f,
                                                instance: t,
                                                store: r,
                                                EVENTS: i
                                            })).then(function(e) {
                                                e.meta && e.meta.hasCallback && J(e.meta.rid, {
                                                    payload: e
                                                });
                                            });
                                        }();
                                        return n && n.then ? n.then(function() {
                                            return e;
                                        }) : e;
                                    }
                                    if (re(e, l.length)) return e;
                                    var s, d = function() {
                                        if (o !== u) return Promise.resolve(F({
                                            action: v({}, e, {
                                                type: u
                                            }),
                                            data: {
                                                exact: f.during,
                                                namespaced: f.duringNS
                                            },
                                            state: c,
                                            allPlugins: a,
                                            allMatches: f,
                                            instance: t,
                                            store: r,
                                            EVENTS: i
                                        })).then(function(e) {
                                            s = e;
                                        });
                                        s = e;
                                    }();
                                    return d && d.then ? d.then(n) : n();
                                });
                            } catch (e) {
                                return Promise.reject(e);
                            }
                            var m, g, h;
                        }(o, n, e, i, t)).then(function(e) {
                            return u = 1, a(e);
                        });
                    }();
                    return Promise.resolve(E && E.then ? E.then(c) : c(E));
                } catch (e) {
                    return Promise.reject(e);
                }
            };
        };
    };
}
function se(e) {
    return function(n) {
        return function(n) {
            return function(t) {
                var r = t.type, i = t.key, a = t.value, o = t.options;
                if (r === q.setItem || r === q.removeItem) {
                    if (t.abort) return n(t);
                    r === q.setItem ? e.setItem(i, a, o) : e.removeItem(i, o);
                }
                return n(t);
            };
        };
    };
}
var le = function() {
    var e = this;
    this.before = [], this.after = [], this.addMiddleware = function(n, t) {
        e[t] = e[t].concat(n);
    }, this.removeMiddleware = function(n, t) {
        var r = e[t].findIndex(function(e) {
            return e === n;
        });
        -1 !== r && (e[t] = [].concat(e[t].slice(0, r), e[t].slice(r + 1)));
    }, this.dynamicMiddlewares = function(n) {
        return function(t) {
            return function(r) {
                return function(i) {
                    var a = {
                        getState: t.getState,
                        dispatch: function(e) {
                            return t.dispatch(e);
                        }
                    }, o = e[n].map(function(e) {
                        return e(a);
                    });
                    return N.apply(void 0, o)(r)(i);
                };
            };
        };
    };
};
function fe(e) {
    return function(n, t) {
        void 0 === n && (n = {});
        var r = {};
        if ("initialize:aborted" === t.type) return n;
        if (/^registerPlugin:([^:]*)$/.test(t.type)) {
            var i = de(t.type, "registerPlugin"), a = e()[i];
            if (!a || !i) return n;
            var o = t.enabled, u = a.config;
            return r[i] = {
                enabled: o,
                initialized: !!o && Boolean(!a.initialize),
                loaded: !!o && Boolean(a.loaded({
                    config: u
                })),
                config: u
            }, v({}, n, r);
        }
        if (/^initialize:([^:]*)$/.test(t.type)) {
            var c = de(t.type, q.initialize), s = e()[c];
            return s && c ? (r[c] = v({}, n[c], {
                initialized: !0,
                loaded: Boolean(s.loaded({
                    config: s.config
                }))
            }), v({}, n, r)) : n;
        }
        if (/^ready:([^:]*)$/.test(t.type)) return r[t.name] = v({}, n[t.name], {
            loaded: !0
        }), v({}, n, r);
        switch(t.type){
            case q.disablePlugin:
                return v({}, n, pe(t.plugins, !1, n));
            case q.enablePlugin:
                return v({}, n, pe(t.plugins, !0, n));
            default:
                return n;
        }
    };
}
function de(e, n) {
    return e.substring(n.length + 1, e.length);
}
function pe(e, n, t) {
    return e.reduce(function(e, r) {
        return e[r] = v({}, t[r], {
            enabled: n
        }), e;
    }, t);
}
function me(e) {
    try {
        return JSON.parse(JSON.stringify(e));
    } catch (e) {}
    return e;
}
var ge = {
    last: {},
    history: []
};
function he(e, n) {
    void 0 === e && (e = ge);
    var t = n.options, r = n.meta;
    if (n.type === q.track) {
        var i = me(v({
            event: n.event,
            properties: n.properties
        }, Object.keys(t).length && {
            options: t
        }, {
            meta: r
        }));
        return v({}, e, {
            last: i,
            history: e.history.concat(i)
        });
    }
    return e;
}
var ve = {
    actions: []
};
function ye(e, n) {
    void 0 === e && (e = ve);
    var t = n.payload;
    switch(n.type){
        case "queue":
            var r;
            return r = t && t.type && t.type === q.identify ? [
                n
            ].concat(e.actions) : e.actions.concat(n), v({}, e, {
                actions: r
            });
        case "dequeue":
            return [];
        default:
            return e;
    }
}
var be = /#.*$/;
function Ie(e) {
    var n = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/g.exec(e);
    return "/" + (n && n[3] ? n[3].split("?")[0].replace(be, "") : "");
}
var we, Ee, Pe, Se, Ne = function(e) {
    if (void 0 === e && (e = {}), !(0, _typeUtils.isBrowser)) return e;
    var n = document, t = n.title, r = n.referrer, i = window, a = i.location, o = i.innerWidth, u = i.innerHeight, c = a.hash, s = a.search, l = function(e) {
        var n = function() {
            if (0, _typeUtils.isBrowser) {
                for(var e, n = document.getElementsByTagName("link"), t = 0; e = n[t]; t++)if ("canonical" === e.getAttribute("rel")) return e.getAttribute("href");
            }
        }();
        return n ? n.match(/\?/) ? n : n + e : window.location.href.replace(be, "");
    }(s), f = {
        title: t,
        url: l,
        path: Ie(l),
        hash: c,
        search: s,
        width: o,
        height: u
    };
    return r && "" !== r && (f.referrer = r), v({}, f, e);
}, Oe = {
    last: {},
    history: []
};
function Ae(e, n) {
    void 0 === e && (e = Oe);
    var t = n.options;
    if (n.type === q.page) {
        var r = me(v({
            properties: n.properties,
            meta: n.meta
        }, Object.keys(t).length && {
            options: t
        }));
        return v({}, e, {
            last: r,
            history: e.history.concat(r)
        });
    }
    return e;
}
we = function() {
    if (!(0, _typeUtils.isBrowser)) return !1;
    var e = navigator.appVersion;
    return ~e.indexOf("Win") ? "Windows" : ~e.indexOf("Mac") ? "MacOS" : ~e.indexOf("X11") ? "UNIX" : ~e.indexOf("Linux") ? "Linux" : "Unknown OS";
}(), Ee = (0, _typeUtils.isBrowser) ? document.referrer : null, Pe = (0, _analyticsUtils.getBrowserLocale)(), Se = (0, _analyticsUtils.getTimeZone)();
var _e = {
    initialized: !1,
    sessionId: (0, _analyticsUtils.uuid)(),
    app: null,
    version: null,
    debug: !1,
    offline: !!(0, _typeUtils.isBrowser) && !navigator.onLine,
    os: {
        name: we
    },
    userAgent: (0, _typeUtils.isBrowser) ? navigator.userAgent : "node",
    library: {
        name: "analytics",
        version: "0.12.5"
    },
    timezone: Se,
    locale: Pe,
    campaign: {},
    referrer: Ee
};
function xe(e, n) {
    void 0 === e && (e = _e);
    var t = e.initialized, r = n.campaign;
    switch(n.type){
        case q.campaign:
            return v({}, e, {
                campaign: r
            });
        case q.offline:
            return v({}, e, {
                offline: !0
            });
        case q.online:
            return v({}, e, {
                offline: !1
            });
        default:
            return t ? e : v({}, _e, e, {
                initialized: !0
            });
    }
}
var je = [
    "plugins",
    "reducers",
    "storage"
];
function ke(e, n, t) {
    if (0, _typeUtils.isBrowser) {
        var r = window[(t ? "add" : "remove") + "EventListener"];
        e.split(" ").forEach(function(e) {
            r(e, n);
        });
    }
}
function Te(e) {
    var n = ke.bind(null, "online offline", function(n) {
        return Promise.resolve(!navigator.onLine).then(e);
    });
    return n(!0), function(e) {
        return n(!1);
    };
}
function ze() {
    return (0, _globalStorageUtils.set)("analytics", []), function(e) {
        return function(n, t, r) {
            var i = e(n, t, r), a = i.dispatch;
            return Object.assign(i, {
                dispatch: function(e) {
                    return (0, _globalStorageUtils.globalContext)[0, _globalStorageUtils.KEY].analytics.push(e.action || e), a(e);
                }
            });
        };
    };
}
function Me(e) {
    return function() {
        return N(N.apply(null, arguments), ze());
    };
}
function qe(e) {
    return e ? (0, _typeUtils.isArray)(e) ? e : [
        e
    ] : [];
}
function Ue(n, t, r) {
    void 0 === n && (n = {});
    var i, a, o = (0, _analyticsUtils.uuid)();
    return t && (X[o] = (i = t, a = function(e) {
        for(var n, t = e || Array.prototype.slice.call(arguments), r = 0; r < t.length; r++)if ((0, _typeUtils.isFunction)(t[r])) {
            n = t[r];
            break;
        }
        return n;
    }(r), function(e) {
        a && a(e), i(e);
    })), v({}, n, {
        rid: o,
        ts: (new Date).getTime()
    }, t ? {
        hasCallback: !0
    } : {});
}
function Ve(n) {
    void 0 === n && (n = {});
    var t = n.reducers || {}, c = n.initialUser || {}, s = (n.plugins || []).reduce(function(e, n) {
        if ((0, _typeUtils.isFunction)(n)) return e.middlewares = e.middlewares.concat(n), e;
        if (n.NAMESPACE && (n.name = n.NAMESPACE), !n.name) throw new Error("https://lytics.dev/errors/1");
        n.config || (n.config = {});
        var t = n.EVENTS ? Object.keys(n.EVENTS).map(function(e) {
            return n.EVENTS[e];
        }) : [];
        e.pluginEnabled[n.name] = !(!1 === n.enabled || !1 === n.config.enabled), delete n.enabled, n.methods && (e.methods[n.name] = Object.keys(n.methods).reduce(function(e, t) {
            var r;
            return e[t] = (r = n.methods[t], function() {
                for(var e = Array.prototype.slice.call(arguments), n = new Array(r.length), t = 0; t < e.length; t++)n[t] = e[t];
                return n[n.length] = Q, r.apply({
                    instance: Q
                }, n);
            }), e;
        }, {}), delete n.methods);
        var r = Object.keys(n).concat(t), i = new Set(e.events.concat(r));
        if (e.events = Array.from(i), e.pluginsArray = e.pluginsArray.concat(n), e.plugins[n.name]) throw new Error(n.name + "AlreadyLoaded");
        return e.plugins[n.name] = n, e.plugins[n.name].loaded || (e.plugins[n.name].loaded = function() {
            return !0;
        }), e;
    }, {
        plugins: {},
        pluginEnabled: {},
        methods: {},
        pluginsArray: [],
        middlewares: [],
        events: []
    }), f = n.storage ? n.storage : {
        getItem: (0, _globalStorageUtils.get),
        setItem: (0, _globalStorageUtils.set),
        removeItem: (0, _globalStorageUtils.remove)
    }, p = function(e) {
        return function(n, t, r) {
            return t.getState("user")[n] || (r && (0, _typeUtils.isObject)(r) && r[n] ? r[n] : $(e)[n] || (0, _globalStorageUtils.get)(D(n)) || null);
        };
    }(f), h = s.plugins, w = s.events.filter(function(e) {
        return !M.includes(e);
    }).sort(), E = new Set(w.concat(z).filter(function(e) {
        return !M.includes(e);
    })), _ = Array.from(E).sort(), x = function() {
        return h;
    }, j = new le, U = j.addMiddleware, V = j.removeMiddleware, L = j.dynamicMiddlewares, X = function() {
        throw new Error("Abort disabled inListener");
    }, J = (0, _analyticsUtils.paramsParse)(), W = $(f), F = v({}, W, c, J.an_uid ? {
        userId: J.an_uid
    } : {}, J.an_aid ? {
        anonymousId: J.an_aid
    } : {});
    F.anonymousId || (F.anonymousId = (0, _analyticsUtils.uuid)());
    var G = v({
        enable: function(e, n) {
            return new Promise(function(t) {
                ue.dispatch({
                    type: q.enablePlugin,
                    plugins: qe(e),
                    _: {
                        originalAction: q.enablePlugin
                    }
                }, t, [
                    n
                ]);
            });
        },
        disable: function(e, n) {
            return new Promise(function(t) {
                ue.dispatch({
                    type: q.disablePlugin,
                    plugins: qe(e),
                    _: {
                        originalAction: q.disablePlugin
                    }
                }, t, [
                    n
                ]);
            });
        }
    }, s.methods), K = !1, Q = {
        identify: function(e, n, t, r) {
            try {
                var i = (0, _typeUtils.isString)(e) ? e : null, a = (0, _typeUtils.isObject)(e) ? e : n, o = t || {}, c = Q.user();
                (0, _globalStorageUtils.set)(D(k), i);
                var s = i || a.userId || p(k, Q, a);
                return Promise.resolve(new Promise(function(e) {
                    ue.dispatch(v({
                        type: q.identifyStart,
                        userId: s,
                        traits: a || {},
                        options: o,
                        anonymousId: c.anonymousId
                    }, c.id && c.id !== i && {
                        previousId: c.id
                    }), e, [
                        n,
                        t,
                        r
                    ]);
                }));
            } catch (e) {
                return Promise.reject(e);
            }
        },
        track: function(e, n, t, r) {
            try {
                var i = (0, _typeUtils.isObject)(e) ? e.event : e;
                if (!i || !(0, _typeUtils.isString)(i)) throw new Error("EventMissing");
                var a = (0, _typeUtils.isObject)(e) ? e : n || {}, o = (0, _typeUtils.isObject)(t) ? t : {};
                return Promise.resolve(new Promise(function(e) {
                    ue.dispatch({
                        type: q.trackStart,
                        event: i,
                        properties: a,
                        options: o,
                        userId: p(k, Q, n),
                        anonymousId: p(T, Q, n)
                    }, e, [
                        n,
                        t,
                        r
                    ]);
                }));
            } catch (e) {
                return Promise.reject(e);
            }
        },
        page: function(e, n, t) {
            try {
                var r = (0, _typeUtils.isObject)(e) ? e : {}, i = (0, _typeUtils.isObject)(n) ? n : {};
                return Promise.resolve(new Promise(function(a) {
                    ue.dispatch({
                        type: q.pageStart,
                        properties: Ne(r),
                        options: i,
                        userId: p(k, Q, r),
                        anonymousId: p(T, Q, r)
                    }, a, [
                        e,
                        n,
                        t
                    ]);
                }));
            } catch (e) {
                return Promise.reject(e);
            }
        },
        user: function(e) {
            if (e === k || "id" === e) return p(k, Q);
            if (e === T || "anonId" === e) return p(T, Q);
            var n = Q.getState("user");
            return e ? (0, _analyticsUtils.dotProp)(n, e) : n;
        },
        reset: function(e) {
            return new Promise(function(n) {
                ue.dispatch({
                    type: q.resetStart
                }, n, e);
            });
        },
        ready: function(e) {
            return K && e({
                plugins: G,
                instance: Q
            }), Q.on(q.ready, function(n) {
                e(n), K = !0;
            });
        },
        on: function(e, n) {
            if (!e || !(0, _typeUtils.isFunction)(n)) return !1;
            if (e === q.bootstrap) throw new Error(".on disabled for " + e);
            var t = /Start$|Start:/;
            if ("*" === e) {
                var r = function(e) {
                    return function(e) {
                        return function(r) {
                            return r.type.match(t) && n({
                                payload: r,
                                instance: Q,
                                plugins: h
                            }), e(r);
                        };
                    };
                }, i = function(e) {
                    return function(e) {
                        return function(r) {
                            return r.type.match(t) || n({
                                payload: r,
                                instance: Q,
                                plugins: h
                            }), e(r);
                        };
                    };
                };
                return U(r, Le), U(i, Ce), function() {
                    V(r, Le), V(i, Ce);
                };
            }
            var a = e.match(t) ? Le : Ce, o = function(t) {
                return function(t) {
                    return function(r) {
                        return r.type === e && n({
                            payload: r,
                            instance: Q,
                            plugins: h,
                            abort: X
                        }), t(r);
                    };
                };
            };
            return U(o, a), function() {
                return V(o, a);
            };
        },
        once: function(e, n) {
            if (!e || !(0, _typeUtils.isFunction)(n)) return !1;
            if (e === q.bootstrap) throw new Error(".once disabled for " + e);
            var t = Q.on(e, function(e) {
                n({
                    payload: e.payload,
                    instance: Q,
                    plugins: h,
                    abort: X
                }), t();
            });
            return t;
        },
        getState: function(e) {
            var n = ue.getState();
            return e ? (0, _analyticsUtils.dotProp)(n, e) : Object.assign({}, n);
        },
        dispatch: function(e) {
            var n = (0, _typeUtils.isString)(e) ? {
                type: e
            } : e;
            if (z.includes(n.type)) throw new Error("reserved action " + n.type);
            var t = v({}, n, {
                _: v({
                    originalAction: n.type
                }, e._ || {})
            });
            ue.dispatch(t);
        },
        enablePlugin: G.enable,
        disablePlugin: G.disable,
        plugins: G,
        storage: {
            getItem: f.getItem,
            setItem: function(e, n, t) {
                ue.dispatch({
                    type: q.setItemStart,
                    key: e,
                    value: n,
                    options: t
                });
            },
            removeItem: function(e, n) {
                ue.dispatch({
                    type: q.removeItemStart,
                    key: e,
                    options: n
                });
            }
        },
        setAnonymousId: function(e, n) {
            Q.storage.setItem(A, e, n);
        },
        events: {
            core: z,
            plugins: w
        }
    }, Y = s.middlewares.concat([
        function(e) {
            return function(e) {
                return function(n) {
                    return n.meta || (n.meta = Ue()), e(n);
                };
            };
        },
        L(Le),
        ce(Q, x, {
            all: _,
            plugins: w
        }),
        se(f),
        C(Q),
        B(Q),
        L(Ce)
    ]), Z = {
        context: xe,
        user: R(f),
        page: Ae,
        track: he,
        plugins: fe(x),
        queue: ye
    }, ee = N, ne = N;
    if ((0, _typeUtils.isBrowser) && n.debug) {
        var te = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        te && (ee = te({
            trace: !0,
            traceLimit: 25
        })), ne = function() {
            return 0 === arguments.length ? ze() : (0, _typeUtils.isObject)(typeof arguments[0]) ? Me() : Me().apply(null, arguments);
        };
    }
    var re, ie = function(e) {
        return Object.keys(e).reduce(function(n, t) {
            return je.includes(t) || (n[t] = e[t]), n;
        }, {});
    }(n), ae = s.pluginsArray.reduce(function(e, n) {
        var t = n.name, r = n.config, i = n.loaded, a = s.pluginEnabled[t];
        return e[t] = {
            enabled: a,
            initialized: !!a && Boolean(!n.initialize),
            loaded: Boolean(i({
                config: r
            })),
            config: r
        }, e;
    }, {}), oe = {
        context: ie,
        user: F,
        plugins: ae
    }, ue = P(function(e) {
        for(var n = Object.keys(e), t = {}, r = 0; r < n.length; r++){
            var i = n[r];
            typeof e[i] === y && (t[i] = e[i]);
        }
        var a, o = Object.keys(t);
        try {
            !function(e) {
                Object.keys(e).forEach(function(n) {
                    var t = e[n];
                    if (typeof t(void 0, {
                        type: "@@redux/INIT"
                    }) === b || typeof t(void 0, {
                        type: I
                    }) === b) throw new Error("reducer " + n + " " + b);
                });
            }(t);
        } catch (e) {
            a = e;
        }
        return function(e, n) {
            if (void 0 === e && (e = {}), a) throw a;
            for(var r = !1, i = {}, u = 0; u < o.length; u++){
                var c = o[u], s = e[c], l = (0, t[c])(s, n);
                if (typeof l === b) {
                    var f = S(c, n);
                    throw new Error(f);
                }
                i[c] = l, r = r || l !== s;
            }
            return r ? i : e;
        };
    }(v({}, Z, t)), oe, ne(ee(O.apply(void 0, Y))));
    ue.dispatch = (re = ue.dispatch, function(e, n, t) {
        var r = v({}, e, {
            meta: Ue(e.meta, n, qe(t))
        });
        return re.apply(null, [
            r
        ]);
    });
    var de = Object.keys(h);
    ue.dispatch({
        type: q.bootstrap,
        plugins: de,
        config: ie,
        params: J,
        user: F,
        initialUser: c,
        persistedUser: W
    });
    var pe = de.filter(function(e) {
        return s.pluginEnabled[e];
    }), me = de.filter(function(e) {
        return !s.pluginEnabled[e];
    });
    return ue.dispatch({
        type: q.registerPlugins,
        plugins: de,
        enabled: s.pluginEnabled
    }), s.pluginsArray.map(function(e, n) {
        var t = e.bootstrap, r = e.config, i = e.name;
        t && (0, _typeUtils.isFunction)(t) && t({
            instance: Q,
            config: r,
            payload: e
        }), ue.dispatch({
            type: q.registerPluginType(i),
            name: i,
            enabled: s.pluginEnabled[i],
            plugin: e
        }), s.pluginsArray.length === n + 1 && ue.dispatch({
            type: q.initializeStart,
            plugins: pe,
            disabled: me
        });
    }), Te(function(e) {
        ue.dispatch({
            type: e ? q.offline : q.online
        });
    }), function(e, n, t) {
        setInterval(function() {
            return H(e, n, t);
        }, 3e3);
    }(ue, x, Q), Q;
}
var Le = "before", Ce = "after";

},{"analytics-utils":"jUDPL","@analytics/global-storage-utils":"46TFL","@analytics/type-utils":"aEtAL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jUDPL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "dotProp", ()=>(0, _dlvDefault.default));
parcelHelpers.export(exports, "decodeUri", ()=>n);
parcelHelpers.export(exports, "getBrowserLocale", ()=>o);
parcelHelpers.export(exports, "getTimeZone", ()=>a);
parcelHelpers.export(exports, "isExternalReferrer", ()=>i);
parcelHelpers.export(exports, "isScriptLoaded", ()=>u);
parcelHelpers.export(exports, "paramsClean", ()=>c);
parcelHelpers.export(exports, "paramsGet", ()=>l);
parcelHelpers.export(exports, "paramsParse", ()=>s);
parcelHelpers.export(exports, "paramsRemove", ()=>f);
parcelHelpers.export(exports, "parseReferrer", ()=>v);
parcelHelpers.export(exports, "throttle", ()=>b);
parcelHelpers.export(exports, "url", ()=>d);
parcelHelpers.export(exports, "uuid", ()=>y);
var _dlv = require("dlv");
var _dlvDefault = parcelHelpers.interopDefault(_dlv);
var _typeUtils = require("@analytics/type-utils");
function n(e) {
    try {
        return decodeURIComponent(e.replace(/\+/g, " "));
    } catch (e) {
        return null;
    }
}
function o() {
    if (0, _typeUtils.isBrowser) {
        var r = navigator, t = r.languages;
        return r.userLanguage || (t && t.length ? t[0] : r.language);
    }
}
function a() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {}
}
function i(r) {
    if (!(0, _typeUtils.isBrowser)) return !1;
    var t = r || document.referrer;
    if (t) {
        var n = window.document.location.port, o = t.split("/")[2];
        return n && (o = o.replace(":" + n, "")), o !== window.location.hostname;
    }
    return !1;
}
function u(n) {
    if (!(0, _typeUtils.isBrowser)) return !0;
    var o = document.getElementsByTagName("script");
    return !!Object.keys(o).filter(function(e) {
        var a = o[e].src;
        return (0, _typeUtils.isString)(n) ? -1 !== a.indexOf(n) : !!(0, _typeUtils.isRegex)(n) && a.match(n);
    }).length;
}
function c(e, r) {
    var t = (e.split("?") || [
        , 
    ])[1];
    if (!t || -1 === t.indexOf(r)) return e;
    var n = new RegExp("(\\&|\\?)" + r + '([_A-Za-z0-9"+=.\\/\\-@%]+)', "g"), o = ("?" + t).replace(n, "").replace(/^&/, "?");
    return e.replace("?" + t, o);
}
function l(e, r) {
    return n((RegExp(e + "=(.+?)(&|$)").exec(r) || [
        ,
        ""
    ])[1]);
}
function s(r) {
    return function(e) {
        for(var r, t = Object.create(null), o = /([^&=]+)=?([^&]*)/g; r = o.exec(e);){
            var a = n(r[1]), i = n(r[2]);
            "[]" === a.substring(a.length - 2) ? (t[a = a.substring(0, a.length - 2)] || (t[a] = [])).push(i) : t[a] = "" === i || i;
        }
        for(var u in t){
            var c = u.split("[");
            c.length > 1 && (m(t, c.map(function(e) {
                return e.replace(/[?[\]\\ ]/g, "");
            }), t[u]), delete t[u]);
        }
        return t;
    }(function(r) {
        if (r) {
            var t = r.match(/\?(.*)/);
            return t && t[1] ? t[1].split("#")[0] : "";
        }
        return (0, _typeUtils.isBrowser) && window.location.search.substring(1);
    }(r));
}
function m(e, r, t) {
    for(var n = r.length - 1, o = 0; o < n; ++o){
        var a = r[o];
        if ("__proto__" === a || "constructor" === a) break;
        a in e || (e[a] = {}), e = e[a];
    }
    e[r[n]] = t;
}
function f(r, t) {
    return (0, _typeUtils.isBrowser) ? new Promise(function(e, n) {
        if (window.history && window.history.replaceState) {
            var o = window.location.href, a = c(o, r);
            o !== a && history.replaceState({}, "", a);
        }
        return t && t(), e();
    }) : Promise.resolve();
}
function g(r) {
    if (!(0, _typeUtils.isBrowser)) return null;
    var t = document.createElement("a");
    return t.setAttribute("href", r), t.hostname;
}
function p(e) {
    return (g(e) || "").split(".").slice(-2).join(".");
}
function x(e) {
    var r = e.split(".");
    return r.length > 1 ? r.slice(0, -1).join(".") : e;
}
var d = {
    trimTld: x,
    getDomainBase: p,
    getDomainHost: g
};
function v(r, t) {
    if (!(0, _typeUtils.isBrowser)) return !1;
    var n = {
        source: "(direct)",
        medium: "(none)",
        campaign: "(not set)"
    };
    r && i(r) && (n.referrer = r);
    var o = function(r) {
        if (!r || !(0, _typeUtils.isBrowser)) return !1;
        var t = p(r), n = document.createElement("a");
        if (n.href = r, n.hostname.indexOf("google") > -1 && (t = "google"), w[t]) {
            var o = w[t], a = new RegExp(("string" == typeof o ? o : o.p) + "=.*?([^&#]*|$)", "gi"), u = n.search.match(a);
            return {
                source: o.n || x(t),
                medium: "organic",
                term: (u ? u[0].split("=")[1] : "") || "(not provided)"
            };
        }
        var c = i(r) ? "referral" : "internal";
        return {
            source: n.hostname,
            medium: c
        };
    }(r);
    o && Object.keys(o).length && (n = Object.assign({}, n, o));
    var a = s(t), u = Object.keys(a);
    if (!u.length) return n;
    var c = u.reduce(function(e, r) {
        return r.match(/^utm_/) && (e["" + r.replace(/^utm_/, "")] = a[r]), r.match(/^(d|g)clid/) && (e.source = "google", e.medium = a.gclid ? "cpc" : "cpm", e[r] = a[r]), e;
    }, {});
    return Object.assign({}, n, c);
}
var h = "q", w = {
    "daum.net": h,
    "eniro.se": "search_word",
    "naver.com": "query",
    "yahoo.com": "p",
    "msn.com": h,
    "aol.com": h,
    "ask.com": h,
    "baidu.com": "wd",
    "yandex.com": "text",
    "rambler.ru": "words",
    google: h,
    "bing.com": {
        p: h,
        n: "live"
    }
};
function y() {
    for(var e = "", r = 0, t = 4294967295 * Math.random() | 0; r++ < 36;){
        var n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[r - 1], o = 15 & t;
        e += "-" == n || "4" == n ? n : ("x" == n ? o : 3 & o | 8).toString(16), t = r % 8 == 0 ? 4294967295 * Math.random() | 0 : t >> 4;
    }
    return e;
}
function b(e, r) {
    var t, n, o, a = null, i = 0, u = function() {
        i = new Date, a = null, o = e.apply(t, n);
    };
    return function() {
        var c = new Date;
        i || (i = c);
        var l = r - (c - i);
        return t = this, n = arguments, l <= 0 ? (clearTimeout(a), a = null, i = c, o = e.apply(t, n)) : a || (a = setTimeout(u, l)), o;
    };
}

},{"dlv":"hKTrw","@analytics/type-utils":"aEtAL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hKTrw":[function(require,module,exports) {
!function(t, n) {
    module.exports = function(t, n, e, i, o) {
        for(n = n.split ? n.split(".") : n, i = 0; i < n.length; i++)t = t ? t[n[i]] : o;
        return t === o ? e : t;
    };
}(this);

},{}],"aEtAL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ALL", ()=>m);
parcelHelpers.export(exports, "ANY", ()=>b);
parcelHelpers.export(exports, "ARRAY", ()=>u);
parcelHelpers.export(exports, "ASYNC_FUNCTION", ()=>d);
parcelHelpers.export(exports, "ASYNC_GENERATOR_FUNCTION", ()=>y);
parcelHelpers.export(exports, "BOOLEAN", ()=>r);
parcelHelpers.export(exports, "BUTTON", ()=>A);
parcelHelpers.export(exports, "CHANGE", ()=>N);
parcelHelpers.export(exports, "ENV", ()=>P);
parcelHelpers.export(exports, "ERROR", ()=>f);
parcelHelpers.export(exports, "FORM", ()=>O);
parcelHelpers.export(exports, "FUNCTION", ()=>n);
parcelHelpers.export(exports, "GENERATOR_FUNCTION", ()=>p);
parcelHelpers.export(exports, "HIDDEN", ()=>h);
parcelHelpers.export(exports, "INPUT", ()=>S);
parcelHelpers.export(exports, "NONE", ()=>v);
parcelHelpers.export(exports, "NULL", ()=>a);
parcelHelpers.export(exports, "NUMBER", ()=>i);
parcelHelpers.export(exports, "OBJECT", ()=>o);
parcelHelpers.export(exports, "PREFIX", ()=>j);
parcelHelpers.export(exports, "REGEX_EMAIL", ()=>z);
parcelHelpers.export(exports, "REGEX_ISO", ()=>D);
parcelHelpers.export(exports, "REGEX_JSON", ()=>Z);
parcelHelpers.export(exports, "SELECT", ()=>E);
parcelHelpers.export(exports, "STRING", ()=>t);
parcelHelpers.export(exports, "SUBMIT", ()=>w);
parcelHelpers.export(exports, "SYMBOL", ()=>c);
parcelHelpers.export(exports, "SYNTAX_ERROR", ()=>l);
parcelHelpers.export(exports, "TYPE_ERROR", ()=>s);
parcelHelpers.export(exports, "UNDEFINED", ()=>e);
parcelHelpers.export(exports, "ctorName", ()=>yn);
parcelHelpers.export(exports, "ensureArray", ()=>Hn);
parcelHelpers.export(exports, "getType", ()=>R);
parcelHelpers.export(exports, "getTypeName", ()=>J);
parcelHelpers.export(exports, "isArguments", ()=>Nn);
parcelHelpers.export(exports, "isArray", ()=>rn);
parcelHelpers.export(exports, "isAsyncFunction", ()=>pn);
parcelHelpers.export(exports, "isBoolean", ()=>Q);
parcelHelpers.export(exports, "isBrowser", ()=>$);
parcelHelpers.export(exports, "isBuffer", ()=>vn);
parcelHelpers.export(exports, "isButton", ()=>Bn);
parcelHelpers.export(exports, "isClass", ()=>en);
parcelHelpers.export(exports, "isDate", ()=>Pn);
parcelHelpers.export(exports, "isDefined", ()=>K);
parcelHelpers.export(exports, "isDeno", ()=>k);
parcelHelpers.export(exports, "isDev", ()=>L);
parcelHelpers.export(exports, "isElement", ()=>$n);
parcelHelpers.export(exports, "isEmail", ()=>Fn);
parcelHelpers.export(exports, "isEmpty", ()=>Cn);
parcelHelpers.export(exports, "isError", ()=>hn);
parcelHelpers.export(exports, "isErrorLike", ()=>jn);
parcelHelpers.export(exports, "isFalse", ()=>Zn);
parcelHelpers.export(exports, "isFalsy", ()=>Dn);
parcelHelpers.export(exports, "isForm", ()=>kn);
parcelHelpers.export(exports, "isFunction", ()=>W);
parcelHelpers.export(exports, "isGenerator", ()=>ln);
parcelHelpers.export(exports, "isGeneratorFunction", ()=>dn);
parcelHelpers.export(exports, "isHidden", ()=>Un);
parcelHelpers.export(exports, "isInput", ()=>Gn);
parcelHelpers.export(exports, "isIsoDate", ()=>xn);
parcelHelpers.export(exports, "isJsDom", ()=>G);
parcelHelpers.export(exports, "isJson", ()=>cn);
parcelHelpers.export(exports, "isLocalHost", ()=>T);
parcelHelpers.export(exports, "isMap", ()=>bn);
parcelHelpers.export(exports, "isMethod", ()=>fn);
parcelHelpers.export(exports, "isNoOp", ()=>En);
parcelHelpers.export(exports, "isNode", ()=>_);
parcelHelpers.export(exports, "isNodeList", ()=>Ln);
parcelHelpers.export(exports, "isNodeType", ()=>Tn);
parcelHelpers.export(exports, "isNull", ()=>Y);
parcelHelpers.export(exports, "isNumber", ()=>nn);
parcelHelpers.export(exports, "isNumberLike", ()=>tn);
parcelHelpers.export(exports, "isObject", ()=>on);
parcelHelpers.export(exports, "isObjectLike", ()=>un);
parcelHelpers.export(exports, "isPrimitive", ()=>an);
parcelHelpers.export(exports, "isProd", ()=>x);
parcelHelpers.export(exports, "isPromise", ()=>sn);
parcelHelpers.export(exports, "isRegex", ()=>mn);
parcelHelpers.export(exports, "isSelect", ()=>Mn);
parcelHelpers.export(exports, "isSet", ()=>gn);
parcelHelpers.export(exports, "isStaging", ()=>C);
parcelHelpers.export(exports, "isString", ()=>q);
parcelHelpers.export(exports, "isSymbol", ()=>X);
parcelHelpers.export(exports, "isSyntaxError", ()=>An);
parcelHelpers.export(exports, "isTrue", ()=>zn);
parcelHelpers.export(exports, "isTruthy", ()=>wn);
parcelHelpers.export(exports, "isTypeError", ()=>Sn);
parcelHelpers.export(exports, "isUndefined", ()=>I);
parcelHelpers.export(exports, "isWebWorker", ()=>B);
parcelHelpers.export(exports, "noOp", ()=>g);
var process = require("eed924cfda160eb2");
var n = "function", t = "string", e = "undefined", r = "boolean", o = "object", u = "array", i = "number", c = "symbol", a = "null", f = "error", s = "typeError", l = "syntaxError", d = "asyncFunction", p = "generatorFunction", y = "asyncGeneratorFunction", g = function() {}, b = "any", m = "*", v = "none", h = "hidden", j = "__", O = "form", S = "input", A = "button", E = "select", N = "change", w = "submit", D = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/, z = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Z = /^\{[\s\S]*\}$|^\[[\s\S]*\]$/, F = "undefined" != typeof process ? process : {}, P = F.env && F.env.NODE_ENV || "", x = "production" === P, C = "staging" === P, L = "development" === P, $ = "undefined" != typeof document, T = $ && "localhost" === window.location.hostname, _ = null != F.versions && null != F.versions.node, k = "undefined" != typeof Deno && void 0 !== Deno.core, B = "object" == typeof self && self.constructor && "DedicatedWorkerGlobalScope" === self.constructor.name, G = $ && "nodejs" === window.name || "undefined" != typeof navigator && void 0 !== navigator.userAgent && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
function M(n, t) {
    return t.charAt(0)[n]() + t.slice(1);
}
var U = M.bind(null, "toUpperCase"), H = M.bind(null, "toLowerCase");
function J(n) {
    return Y(n) ? U("null") : "object" == typeof n ? yn(n) : Object.prototype.toString.call(n).slice(8, -1);
}
function R(n, t) {
    void 0 === t && (t = !0);
    var e = J(n);
    return t ? H(e) : e;
}
function V(n, t) {
    return typeof t === n;
}
var W = V.bind(null, "function"), q = V.bind(null, "string"), I = V.bind(null, "undefined");
function K(n) {
    return !I(n);
}
var Q = V.bind(null, "boolean"), X = V.bind(null, "symbol");
function Y(n) {
    return null === n;
}
function nn(n) {
    return "number" === R(n) && !isNaN(n);
}
function tn(n) {
    return !isNaN(parseFloat(n));
}
function en(n) {
    return !!W(n) && /^class /.test(Function.prototype.toString.call(n));
}
function rn(n) {
    return "array" === R(n);
}
function on(n) {
    if (!un(n)) return !1;
    for(var t = n; null !== Object.getPrototypeOf(t);)t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(n) === t;
}
function un(n) {
    return n && ("object" == typeof n || null !== n);
}
function cn(n) {
    if (!q(n) || !Z.test(n)) return !1;
    try {
        JSON.parse(n);
    } catch (n) {
        return !1;
    }
    return !0;
}
function an(n) {
    if (Y(n)) return !0;
    switch(typeof n){
        case "string":
        case "number":
        case "symbol":
        case "undefined":
        case "boolean":
            return !0;
        default:
            return !1;
    }
}
function fn(n, t) {
    return on(n) && W(n[t]);
}
function sn(n) {
    return !!n && !!(!I(Promise) && n instanceof Promise || n.then && W(n.then));
}
function ln(n) {
    return un(n) && W(n.throw) && W(n.return) && W(n.next);
}
function dn(n) {
    return "generatorFunction" === R(n);
}
function pn(n) {
    return "asyncFunction" === R(n);
}
function yn(n) {
    return W(n.constructor) ? n.constructor.name : null;
}
function gn(n) {
    return n instanceof Set;
}
function bn(n) {
    return n instanceof Map;
}
function mn(n) {
    return n instanceof RegExp;
}
function vn(n) {
    return !(!n.constructor || !W(n.constructor.isBuffer)) && n.constructor.isBuffer(n);
}
function hn(n) {
    return n instanceof Error || q(n.message) && n.constructor && nn(n.constructor.stackTraceLimit);
}
function jn(n) {
    return un(n) && q(n.message) && q(n.name);
}
function On(n, t) {
    if ("object" != typeof t || Y(t)) return !1;
    if (t instanceof n) return !0;
    var e = R(new n(""));
    if (hn(t)) for(; t;){
        if (R(t) === e) return !0;
        t = Object.getPrototypeOf(t);
    }
    return !1;
}
var Sn = On.bind(null, TypeError), An = On.bind(null, SyntaxError);
function En(n) {
    if (!W(n)) return !1;
    var t = /{(\r|\n|\s)*}/gm, e = g + "";
    return e === (n.toString().match(t) || [
        ""
    ])[0].replace(t, e);
}
function Nn(n) {
    try {
        if (nn(n.length) && W(n.callee)) return !0;
    } catch (n) {
        if (-1 !== n.message.indexOf("callee")) return !0;
    }
    return !1;
}
function wn(n) {
    return !(q(n) && "false" === n.toLowerCase() || !n);
}
function Dn(n) {
    return !n;
}
function zn(n) {
    return !0 === n;
}
function Zn(n) {
    return !1 === n;
}
function Fn(n) {
    return !(n.length > 320) && z.test(n);
}
function Pn(n) {
    return n instanceof Date || W(n.toDateString) && W(n.getDate) && W(n.setDate);
}
function xn(n) {
    return D.test(n);
}
function Cn(n) {
    return !(!Y(n) && (rn(n) ? n.length : gn(n) || bn(n) ? n.size : on(n) && Object.keys(n).length));
}
function Ln(n) {
    return NodeList.prototype.isPrototypeOf(n);
}
function $n(n, t) {
    var e = n instanceof Element || n instanceof HTMLDocument;
    return e && t ? Tn(n, t) : e;
}
function Tn(n, t) {
    return void 0 === t && (t = ""), n && n.nodeName === t.toUpperCase();
}
function _n(n) {
    var t = [].slice.call(arguments, 1);
    return function() {
        return n.apply(void 0, [].slice.call(arguments).concat(t));
    };
}
var kn = _n($n, "form"), Bn = _n($n, "button"), Gn = _n($n, "input"), Mn = _n($n, "select");
function Un(n, t) {
    if (!n || "hidden" === getComputedStyle(n).visibility) return !0;
    for(; n;){
        if (null != t && n === t) return !1;
        if ("none" === getComputedStyle(n).display) return !0;
        n = n.parentElement;
    }
    return !1;
}
function Hn(n) {
    return n ? rn(n) ? n : [
        n
    ] : [];
}

},{"eed924cfda160eb2":"d5jf4","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"46TFL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLOBAL", ()=>l);
parcelHelpers.export(exports, "KEY", ()=>o);
parcelHelpers.export(exports, "get", ()=>a);
parcelHelpers.export(exports, "globalContext", ()=>n);
parcelHelpers.export(exports, "hasSupport", ()=>b);
parcelHelpers.export(exports, "remove", ()=>i);
parcelHelpers.export(exports, "set", ()=>f);
parcelHelpers.export(exports, "wrap", ()=>u);
var _typeUtils = require("@analytics/type-utils");
var global = arguments[3];
var l = "global", o = (0, _typeUtils.PREFIX) + "global" + (0, _typeUtils.PREFIX), n = typeof self === (0, _typeUtils.OBJECT) && self.self === self && self || typeof global === (0, _typeUtils.OBJECT) && global.global === global && global || void 0;
function a(t) {
    return n[o][t];
}
function f(t, e) {
    return n[o][t] = e;
}
function i(t) {
    delete n[o][t];
}
function u(t, e, r) {
    var l;
    try {
        if (b(t)) {
            var o = window[t];
            l = o[e].bind(o);
        }
    } catch (t) {}
    return l || r;
}
n[o] || (n[o] = {});
var c = {};
function b(t) {
    if (typeof c[t] !== (0, _typeUtils.UNDEFINED)) return c[t];
    try {
        var e = window[t];
        e.setItem((0, _typeUtils.UNDEFINED), (0, _typeUtils.UNDEFINED)), e.removeItem((0, _typeUtils.UNDEFINED));
    } catch (e) {
        return c[t] = !1;
    }
    return c[t] = !0;
}

},{"@analytics/type-utils":"aEtAL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gu9ng":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLOBAL", ()=>(0, _globalStorageUtils.GLOBAL));
parcelHelpers.export(exports, "globalContext", ()=>(0, _globalStorageUtils.globalContext));
parcelHelpers.export(exports, "COOKIE", ()=>(0, _cookieUtils.COOKIE));
parcelHelpers.export(exports, "getCookie", ()=>(0, _cookieUtils.getCookie));
parcelHelpers.export(exports, "hasCookies", ()=>(0, _cookieUtils.hasCookies));
parcelHelpers.export(exports, "removeCookie", ()=>(0, _cookieUtils.removeCookie));
parcelHelpers.export(exports, "setCookie", ()=>(0, _cookieUtils.setCookie));
parcelHelpers.export(exports, "LOCAL_STORAGE", ()=>(0, _localstorageUtils.LOCAL_STORAGE));
parcelHelpers.export(exports, "hasLocalStorage", ()=>(0, _localstorageUtils.hasLocalStorage));
parcelHelpers.export(exports, "SESSION_STORAGE", ()=>(0, _sessionStorageUtils.SESSION_STORAGE));
parcelHelpers.export(exports, "hasSessionStorage", ()=>(0, _sessionStorageUtils.hasSessionStorage));
parcelHelpers.export(exports, "ALL", ()=>(0, _typeUtils.ALL));
parcelHelpers.export(exports, "ANY", ()=>(0, _typeUtils.ANY));
parcelHelpers.export(exports, "default", ()=>J);
parcelHelpers.export(exports, "getItem", ()=>C);
parcelHelpers.export(exports, "removeItem", ()=>b);
parcelHelpers.export(exports, "setItem", ()=>L);
var _globalStorageUtils = require("@analytics/global-storage-utils");
var _cookieUtils = require("@analytics/cookie-utils");
var _localstorageUtils = require("@analytics/localstorage-utils");
var _sessionStorageUtils = require("@analytics/session-storage-utils");
var _typeUtils = require("@analytics/type-utils");
function I(t) {
    var o = t;
    try {
        if ("true" === (o = JSON.parse(t))) return !0;
        if ("false" === o) return !1;
        if ((0, _typeUtils.isObject)(o)) return o;
        parseFloat(o) === o && (o = parseFloat(o));
    } catch (t) {}
    if (null !== o && "" !== o) return o;
}
var k = (0, _localstorageUtils.hasLocalStorage)(), O = (0, _sessionStorageUtils.hasSessionStorage)(), x = (0, _cookieUtils.hasCookies)();
function C(o, e) {
    if (o) {
        var r = A(e), a = !N(r), i = d(r) ? I(localStorage.getItem(o)) : void 0;
        if (a && !(0, _typeUtils.isUndefined)(i)) return i;
        var n = h(r) ? I((0, _cookieUtils.getCookie)(o)) : void 0;
        if (a && n) return n;
        var l = E(r) ? I(sessionStorage.getItem(o)) : void 0;
        if (a && l) return l;
        var u = (0, _globalStorageUtils.get)(o);
        return a ? u : {
            localStorage: i,
            sessionStorage: l,
            cookie: n,
            global: u
        };
    }
}
function L(r, a, l) {
    if (r && !(0, _typeUtils.isUndefined)(a)) {
        var u = {}, g = A(l), m = JSON.stringify(a), S = !N(g);
        return d(g) && (u[0, _localstorageUtils.LOCAL_STORAGE] = F((0, _localstorageUtils.LOCAL_STORAGE), a, I(localStorage.getItem(r))), localStorage.setItem(r, m), S) ? u[0, _localstorageUtils.LOCAL_STORAGE] : h(g) && (u[0, _cookieUtils.COOKIE] = F((0, _cookieUtils.COOKIE), a, I((0, _cookieUtils.getCookie)(r))), (0, _cookieUtils.setCookie)(r, m), S) ? u[0, _cookieUtils.COOKIE] : E(g) && (u[0, _sessionStorageUtils.SESSION_STORAGE] = F((0, _sessionStorageUtils.SESSION_STORAGE), a, I(sessionStorage.getItem(r))), sessionStorage.setItem(r, m), S) ? u[0, _sessionStorageUtils.SESSION_STORAGE] : (u[0, _globalStorageUtils.GLOBAL] = F((0, _globalStorageUtils.GLOBAL), a, (0, _globalStorageUtils.get)(r)), (0, _globalStorageUtils.set)(r, a), S ? u[0, _globalStorageUtils.GLOBAL] : u);
    }
}
function b(t, e) {
    if (t) {
        var a = A(e), s = C(t, (0, _typeUtils.ALL)), n = {};
        return !(0, _typeUtils.isUndefined)(s.localStorage) && d(a) && (localStorage.removeItem(t), n[0, _localstorageUtils.LOCAL_STORAGE] = s.localStorage), !(0, _typeUtils.isUndefined)(s.cookie) && h(a) && ((0, _cookieUtils.removeCookie)(t), n[0, _cookieUtils.COOKIE] = s.cookie), !(0, _typeUtils.isUndefined)(s.sessionStorage) && E(a) && (sessionStorage.removeItem(t), n[0, _sessionStorageUtils.SESSION_STORAGE] = s.sessionStorage), !(0, _typeUtils.isUndefined)(s.global) && G(a, (0, _globalStorageUtils.GLOBAL)) && ((0, _globalStorageUtils.remove)(t), n[0, _globalStorageUtils.GLOBAL] = s.global), n;
    }
}
function A(t) {
    return t ? (0, _typeUtils.isString)(t) ? t : t.storage : (0, _typeUtils.ANY);
}
function d(t) {
    return k && G(t, (0, _localstorageUtils.LOCAL_STORAGE));
}
function h(t) {
    return x && G(t, (0, _cookieUtils.COOKIE));
}
function E(t) {
    return O && G(t, (0, _sessionStorageUtils.SESSION_STORAGE));
}
function N(t) {
    return t === (0, _typeUtils.ALL) || "all" === t;
}
function G(t, o) {
    return t === (0, _typeUtils.ANY) || t === o || N(t);
}
function F(t, o, e) {
    return {
        location: t,
        current: o,
        previous: e
    };
}
var J = {
    setItem: L,
    getItem: C,
    removeItem: b
};

},{"@analytics/global-storage-utils":"46TFL","@analytics/cookie-utils":"9eV9y","@analytics/localstorage-utils":"8Ezzz","@analytics/session-storage-utils":"aoczb","@analytics/type-utils":"aEtAL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9eV9y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "COOKIE", ()=>t);
parcelHelpers.export(exports, "getCookie", ()=>r);
parcelHelpers.export(exports, "hasCookies", ()=>a);
parcelHelpers.export(exports, "removeCookie", ()=>u);
parcelHelpers.export(exports, "setCookie", ()=>c);
var _globalStorageUtils = require("@analytics/global-storage-utils");
var t = "cookie", i = a(), r = d, c = d;
function u(o) {
    return i ? d(o, "", -1) : (0, _globalStorageUtils.remove)(o);
}
function a() {
    if (void 0 !== i) return i;
    var e = "cookiecookie";
    try {
        d(e, e), i = -1 !== document.cookie.indexOf(e), u(e);
    } catch (e) {
        i = !1;
    }
    return i;
}
function d(e, t, r, c, u, a) {
    if ("undefined" != typeof window) {
        var d = arguments.length > 1;
        return !1 === i && (d ? (0, _globalStorageUtils.set)(e, t) : (0, _globalStorageUtils.get)(e)), d ? document.cookie = e + "=" + encodeURIComponent(t) + (r ? "; expires=" + new Date(+new Date + 1e3 * r).toUTCString() + (c ? "; path=" + c : "") + (u ? "; domain=" + u : "") + (a ? "; secure" : "") : "") : decodeURIComponent((("; " + document.cookie).split("; " + e + "=")[1] || "").split(";")[0]);
    }
}

},{"@analytics/global-storage-utils":"46TFL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8Ezzz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LOCAL_STORAGE", ()=>r);
parcelHelpers.export(exports, "getItem", ()=>c);
parcelHelpers.export(exports, "hasLocalStorage", ()=>g);
parcelHelpers.export(exports, "removeItem", ()=>S);
parcelHelpers.export(exports, "setItem", ()=>m);
var _globalStorageUtils = require("@analytics/global-storage-utils");
var r = "localStorage", g = (0, _globalStorageUtils.hasSupport).bind(null, "localStorage"), c = (0, _globalStorageUtils.wrap)("localStorage", "getItem", (0, _globalStorageUtils.get)), m = (0, _globalStorageUtils.wrap)("localStorage", "setItem", (0, _globalStorageUtils.set)), S = (0, _globalStorageUtils.wrap)("localStorage", "removeItem", (0, _globalStorageUtils.remove));

},{"@analytics/global-storage-utils":"46TFL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aoczb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SESSION_STORAGE", ()=>a);
parcelHelpers.export(exports, "getSessionItem", ()=>g);
parcelHelpers.export(exports, "hasSessionStorage", ()=>i);
parcelHelpers.export(exports, "removeSessionItem", ()=>l);
parcelHelpers.export(exports, "setSessionItem", ()=>n);
var _globalStorageUtils = require("@analytics/global-storage-utils");
var a = "sessionStorage", i = (0, _globalStorageUtils.hasSupport).bind(null, "sessionStorage"), g = (0, _globalStorageUtils.wrap)("sessionStorage", "getItem", (0, _globalStorageUtils.get)), n = (0, _globalStorageUtils.wrap)("sessionStorage", "setItem", (0, _globalStorageUtils.set)), l = (0, _globalStorageUtils.wrap)("sessionStorage", "removeItem", (0, _globalStorageUtils.remove));

},{"@analytics/global-storage-utils":"46TFL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3iK6o":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>index);
parcelHelpers.export(exports, "init", ()=>init);
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
/* global, window */ var loadedInstances = {};
/* Location of gtag script */ var gtagScriptSource = "https://www.googletagmanager.com/gtag/js"; // See https://developers.google.com/analytics/devguides/collection/ga4/reference/config
var defaultGtagConf = {
    // https://support.google.com/analytics/answer/7201382?hl=en#zippy=%2Cglobal-site-tag-websites
    debug_mode: false,
    /**
   * Disable automatic sending of page views, instead let analytics.page() do this
   * https://developers.google.com/analytics/devguides/collection/gtagjs
   */ send_page_view: false,
    // https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
    anonymize_ip: false,
    /**
   * Disable All Advertising
   * https://developers.google.com/analytics/devguides/collection/ga4/display-features#disable_all_advertising_features
   */ allow_google_signals: true,
    /**
   * Disable Advertising Personalization
   * https://developers.google.com/analytics/devguides/collection/ga4/display-features#disable_advertising_personalization
   */ allow_ad_personalization_signals: true,
    /**
   * https://developers.google.com/analytics/devguides/collection/gtagjs/cookies-user-id#configure_cookie_field_settings
   */ // cookie_domain: 'auto',
    // cookie_expires
    // cookie_prefix
    // cookie_update
    // cookie_flags
    /**
   * Cookie Flags
   * https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id#cookie_flags
   */ cookie_flags: ""
};
var defaultConfig = {
    gtagName: "gtag",
    dataLayerName: "ga4DataLayer",
    measurementIds: [],
    gtagConfig: defaultGtagConf
};
/**
 * Google analytics plugin
 * @link https://getanalytics.io/plugins/google-analytics/
 * @link https://analytics.google.com/analytics/web/
 * @link https://developers.google.com/analytics/devguides/collection/analyticsjs
 * @param {object}  pluginConfig - Plugin settings
 * @param {string[]} pluginConfig.measurementIds - Google Analytics MEASUREMENT IDs
 * @param {boolean} [pluginConfig.debug] - Enable Google Analytics debug mode
 * @param {string}  [pluginConfig.dataLayerName=ga4DataLayer] - The optional name for dataLayer object. Defaults to ga4DataLayer.
 * @param {string}  [pluginConfig.gtagName=gtag] - The optional name for dataLayer object. Defaults to `gtag`.
 * @param {boolean} [pluginConfig.gtagConfig.anonymize_ip] - Enable [Anonymizing IP addresses](https://bit.ly/3c660Rd) sent to Google Analytics.
 * @param {object}  [pluginConfig.gtagConfig.cookie_domain] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {object}  [pluginConfig.gtagConfig.cookie_expires] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {object}  [pluginConfig.gtagConfig.cookie_prefix] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {object}  [pluginConfig.gtagConfig.cookie_update] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {object}  [pluginConfig.gtagConfig.cookie_flags] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {string}  [pluginConfig.customScriptSrc] - Custom URL for google analytics script, if proxying calls
 * @return {*}
 * @example
 *
 * googleAnalytics({
 *   measurementIds: ['G-abc123']
 * })
 */ function googleAnalytics() {
    var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var pageCallCount = 0;
    var measurementIds = getIds(pluginConfig.measurementIds);
    var initConfig = _objectSpread(_objectSpread({}, defaultConfig), pluginConfig);
    return {
        name: "google-analytics",
        config: initConfig,
        // Load gtag.js and define gtag
        initialize: function initialize(_ref) {
            var config = _ref.config, instance = _ref.instance;
            var dataLayerName = config.dataLayerName, customScriptSrc = config.customScriptSrc, gtagName = config.gtagName, gtagConfig = config.gtagConfig, debug = config.debug;
            /* Inject google gtag.js script if not found */ /* If other gtags are loaded already, add ours anyway */ var customLayerName = dataLayerName ? "&l=".concat(dataLayerName) : "";
            var src = customScriptSrc || "".concat(gtagScriptSource, "?id=").concat(measurementIds[0]).concat(customLayerName);
            if (!scriptLoaded(src)) {
                var script = document.createElement("script");
                script.async = true;
                script.src = src;
                document.body.appendChild(script);
            }
            /* Set up gtag and datalayer */ if (!window[dataLayerName]) window[dataLayerName] = window[dataLayerName] || [];
            if (!window[gtagName]) window[gtagName] = function() {
                window[dataLayerName].push(arguments);
            };
            window[gtagName]("js", new Date()); // Initialize tracker instances on page
            var gtagConf = _objectSpread(_objectSpread({}, defaultGtagConf), gtagConfig ? gtagConfig : {}); // You must explicitly delete the debug_mode parameter or all sessions will fire in debug more. Setting it false is not enough.
            // https://support.google.com/analytics/answer/7201382?hl=en&ref_topic=9303319#zippy=%2Cgoogle-tag-websites:~:text=To%20disable%20debug%20mode%2C%20exclude%20the%20%27debug_mode%27%20parameter%3B%20setting%20the%20parameter%20to%20false%20doesn%27t%20disable%20debug%20mode.
            if (debug === true) gtagConf.debug_mode = true;
            else delete gtagConf.debug_mode;
            /* set custom dimensions from user traits */ var user = instance.user() || {};
            var traits = user.traits || {};
            if (Object.keys(traits).length) window[gtagName]("set", "user_properties", traits);
            /* Initialize all measurementIds */ for(var i = 0; i < measurementIds.length; i++)if (!loadedInstances[measurementIds[i]]) {
                window[gtagName]("config", measurementIds[i], gtagConf);
                loadedInstances[measurementIds[i]] = true;
            }
        },
        // Set parameter scope at user level with 'set' method
        identify: function identify(_ref2) {
            var payload = _ref2.payload, config = _ref2.config;
            var gtagName = config.gtagName;
            if (!window[gtagName] || !measurementIds.length) return;
            if (payload.userId) // https://developers.google.com/analytics/devguides/collection/ga4/user-id?platform=websites#send_user_ids
            window[gtagName]("set", {
                user_id: payload.userId
            }); // console.log('Set userid', payload.userId)
             // TODO verify this
            // https://developers.google.com/analytics/devguides/collection/ga4/user-properties?technology=websites
            if (Object.keys(payload.traits).length) /* gtag('set', 'user_properties', {
          favorite_composer: 'Mahler',
          favorite_instrument: 'double bass',
          season_ticketholder: 'true'
        }) */ window[gtagName]("set", "user_properties", payload.traits); // console.log('Set userprops', payload.traits)
        },
        // Set parameter scope at page level with 'config' method
        page: function page(_ref3) {
            var payload = _ref3.payload, config = _ref3.config, instance = _ref3.instance;
            var gtagName = config.gtagName, gtagConfig = config.gtagConfig;
            if (!window[gtagName] || !measurementIds.length) return;
            var properties = payload.properties;
            var send_to = properties.send_to;
            var campaign = instance.getState("context.campaign"); // console.log('ga page properties', properties)
            /* Create pageview-related properties */ var pageView = {
                page_title: properties.title,
                page_location: properties.url,
                page_path: properties.path || document.location.pathname,
                page_hash: properties.hash,
                page_search: properties.page_search,
                page_referrer: properties.referrer
            };
            var campaignData = addCampaignData(campaign);
            var userId = instance.user("userId");
            var finalPayload = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, send_to ? {
                send_to: send_to
            } : {}), pageView), campaignData), userId ? {
                user_id: userId
            } : {});
            /* If send_page_view true, ignore first analytics.page call */ if (gtagConfig && gtagConfig.send_page_view && pageCallCount === 0) {
                pageCallCount++; // console.log('ignore first pageCallCount', pageCallCount)
                return;
            } // console.log('Send page_view payload', finalPayload)
            window[gtagName]("event", "page_view", finalPayload); // Set after initial page view
            pageCallCount++;
        },
        // Set parameter scope at event level with 'event' method
        track: function track(_ref4) {
            var payload = _ref4.payload, config = _ref4.config, instance = _ref4.instance;
            var properties = payload.properties, event = payload.event;
            var campaign = instance.getState("context.campaign");
            var gtagName = config.gtagName;
            if (!window[gtagName] || !measurementIds.length) return;
            var campaignData = addCampaignData(campaign);
            var userId = instance.user("userId"); // Limits https://support.google.com/analytics/answer/9267744
            var finalPayload = _objectSpread(_objectSpread(_objectSpread({}, properties), campaignData), userId ? {
                user_id: userId
            } : {});
            /*
        console.log('finalPayload', finalPayload)
        console.log('event', event)
      */ /* Send data to Google Analytics
        Signature gtag('event', '<event_name>', {
          <event_params>key: value,
        })
      */ window[gtagName]("event", event, finalPayload);
        },
        /* Verify gtag loaded and ready to use */ loaded: function loaded() {
            var dataLayerName = initConfig.dataLayerName, customScriptSrc = initConfig.customScriptSrc;
            var hasDataLayer = dataLayerName && window[dataLayerName] && Array.prototype.push === window[dataLayerName].push;
            return scriptLoaded(customScriptSrc || gtagScriptSource) && hasDataLayer;
        },
        /* Custom methods */ methods: {
            addTag: function addTag(tagId) {
                var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                // https://developers.google.com/tag-platform/devguides/install-gtagjs#add_products_to_your_tag
                if (window[initConfig.gtagName]) {
                    window[initConfig.gtagName]("config", tagId, settings); // Add tag id
                    if (measurementIds && !measurementIds.includes(tagId)) measurementIds = measurementIds.concat(tagId);
                }
            },
            /* Disable gtag for user */ disable: function disable(ids) {
                var gaIds = ids ? getIds(ids) : measurementIds;
                for(var i = 0; i < measurementIds.length; i++){
                    var gaId = measurementIds[i];
                    if (gaIds.includes(gaId)) // https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
                    window["ga-disable-".concat(gaId)] = true;
                }
            },
            /* Enable gtag for user */ enable: function enable(ids) {
                var gaIds = ids ? getIds(ids) : measurementIds;
                for(var i = 0; i < measurementIds.length; i++){
                    var gaId = measurementIds[i];
                    if (gaIds.includes(gaId)) // https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
                    window["ga-disable-".concat(gaId)] = false;
                }
            }
        }
    };
}
function getIds(measurementIds) {
    if (!measurementIds) throw new Error("No GA Measurement ID defined");
    if (Array.isArray(measurementIds)) return measurementIds;
    if (typeof measurementIds === "string") return [
        measurementIds
    ];
    throw new Error("GA Measurement ID must be string or array of strings");
}
/**
 * Add campaign data to GA payload https://bit.ly/34qFCPn
 * @param {Object} [campaignData={}] [description]
 * @param {String} [campaignData.campaignName] - Name of campaign
 * @param {String} [campaignData.campaignSource] - Source of campaign
 * @param {String} [campaignData.campaignMedium] - Medium of campaign
 * @param {String} [campaignData.campaignContent] - Content of campaign
 * @param {String} [campaignData.campaignKeyword] - Keyword of campaign
 */ function addCampaignData() {
    var campaignData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var campaign = {};
    var id = campaignData.id, name = campaignData.name, source = campaignData.source, medium = campaignData.medium, content = campaignData.content, keyword = campaignData.keyword;
    if (id) campaign.campaignId = id;
    if (name) campaign.campaignName = name;
    if (source) campaign.campaignSource = source;
    if (medium) campaign.campaignMedium = medium;
    if (content) campaign.campaignContent = content;
    if (keyword) campaign.campaignKeyword = keyword;
    return campaign;
}
function scriptLoaded(scriptSrc) {
    var scripts = document.querySelectorAll("script[src]");
    var regex = new RegExp("^".concat(scriptSrc));
    return Boolean(Object.values(scripts).filter(function(value) {
        return regex.test(value.src);
    }).length);
}
/* This module will shake out unused code + work in browser and node 🎉 */ var index = googleAnalytics;
/* init for CDN usage. globalName.init() */ var init = googleAnalytics;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["iMq8e"], null, "parcelRequireaaed")

//# sourceMappingURL=reporting.87270bcb.js.map
