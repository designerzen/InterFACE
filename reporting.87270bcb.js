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
})({"7Sxqs":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "7cd9f9bb87270bcb";
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
parcelHelpers.export(exports, "CONSTANTS", ()=>k);
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
function P(e1, n1, t1) {
    var r;
    if (typeof n1 === y && typeof t1 === b && (t1 = n1, n1 = void 0), typeof t1 !== b) {
        if (typeof t1 !== y) throw new Error("enhancer" + E);
        return t1(P)(e1, n1);
    }
    if (typeof e1 !== y) throw new Error("reducer" + E);
    var i = e1, a = n1, o = [], u = o, c = !1;
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
        var e2, n = d;
        return (e2 = {
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
        }, e2;
    }, r;
}
function S(e, n) {
    var t = n && n.type;
    return "action " + (t && t.toString() || "?") + "reducer " + e + " returns " + b;
}
function N() {
    var e3 = [].slice.call(arguments);
    return 0 === e3.length ? function(e) {
        return e;
    } : 1 === e3.length ? e3[0] : e3.reduce(function(e, n) {
        return function() {
            return e(n.apply(void 0, [].slice.call(arguments)));
        };
    });
}
function O() {
    var e4 = arguments;
    return function(n) {
        return function(t, r, i) {
            var a, o = n(t, r, i), u = o.dispatch, c = {
                getState: o.getState,
                dispatch: function(e) {
                    return u(e);
                }
            };
            return a = [].slice.call(e4).map(function(e) {
                return e(c);
            }), v({}, o, {
                dispatch: u = N.apply(void 0, a)(o.dispatch)
            });
        };
    };
}
var A = (0, _typeUtils.PREFIX) + "anon_id", _ = (0, _typeUtils.PREFIX) + "user_id", x = (0, _typeUtils.PREFIX) + "user_traits", k = {
    __proto__: null,
    ANON_ID: A,
    USER_ID: _,
    USER_TRAITS: x
}, j = "userId", T = "anonymousId", z = [
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
function C(e5) {
    var n2 = e5.storage.setItem;
    return function(t2) {
        return function(r) {
            return function(i) {
                if (i.type === q.bootstrap) {
                    var a = i.params, o = i.user, u = i.persistedUser, c = i.initialUser, s = u.userId === o.userId;
                    u.anonymousId !== o.anonymousId && n2(A, o.anonymousId), s || n2(_, o.userId), c.traits && n2(x, v({}, s && u.traits ? u.traits : {}, c.traits));
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
                        t2.dispatch(v({
                            type: q.params,
                            raw: a
                        }, p, f ? {
                            userId: f
                        } : {})), f && setTimeout(function() {
                            return e5.identify(f, p.traits);
                        }, 0), d && setTimeout(function() {
                            return e5.track(d, p.props);
                        }, 0), Object.keys(p.campaign).length && t2.dispatch({
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
    return function(n3, t) {
        if (void 0 === n3 && (n3 = {}), void 0 === t && (t = {}), t.type === q.setItemEnd) {
            if (t.key === A) return v({}, n3, {
                anonymousId: t.value
            });
            if (t.key === _) return v({}, n3, {
                userId: t.value
            });
        }
        switch(t.type){
            case q.identify:
                return Object.assign({}, n3, {
                    userId: t.userId,
                    traits: v({}, n3.traits, t.traits)
                });
            case q.reset:
                return [
                    _,
                    A,
                    x
                ].forEach(function(n) {
                    e.removeItem(n);
                }), Object.assign({}, n3, {
                    userId: null,
                    anonymousId: null,
                    traits: {}
                });
            default:
                return n3;
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
function B(n4) {
    var t3 = n4.storage, r = t3.setItem, i = t3.removeItem, a = t3.getItem;
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
                    j,
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
function W(e6, n, t) {
    return new Promise(function(r, i) {
        return n() ? r(e6) : t < 1 ? i(v({}, e6, {
            queue: !0
        })) : new Promise(function(e) {
            return setTimeout(e, 10);
        }).then(function(a) {
            return W(e6, n, t - 10).then(r, i);
        });
    });
}
function H(e7, n5, t4) {
    var r1 = n5(), i1 = e7.getState(), a = i1.plugins, o = i1.queue, u = i1.user;
    if (!i1.context.offline && o && o.actions && o.actions.length) {
        var c1 = o.actions.reduce(function(e, n, t) {
            return a[n.plugin].loaded ? (e.process.push(n), e.processIndex.push(t)) : (e.requeue.push(n), e.requeueIndex.push(t)), e;
        }, {
            processIndex: [],
            process: [],
            requeue: [],
            requeueIndex: []
        });
        if (c1.processIndex && c1.processIndex.length) {
            c1.processIndex.forEach(function(n6) {
                var i = o.actions[n6], c = i.plugin, s = i.payload.type, l = r1[c][s];
                if (l && (0, _typeUtils.isFunction)(l)) {
                    var f = function(e, n) {
                        return void 0 === e && (e = {}), void 0 === n && (n = {}), [
                            j,
                            T
                        ].reduce(function(t, r) {
                            return e.hasOwnProperty(r) && n[r] && n[r] !== e[r] && (t[r] = n[r]), t;
                        }, e);
                    }(i.payload, u);
                    l({
                        payload: f,
                        config: a[c].config,
                        instance: t4
                    });
                    var p = s + ":" + c;
                    e7.dispatch(v({}, f, {
                        type: p,
                        _: {
                            called: p,
                            from: "queueDrain"
                        }
                    }));
                }
            });
            var s1 = o.actions.filter(function(e, n) {
                return !~c1.processIndex.indexOf(n);
            });
            o.actions = s1;
        }
    }
}
var F = function(e8) {
    var n7 = e8.data, t5 = e8.action, r2 = e8.instance, i2 = e8.state, a1 = e8.allPlugins, o1 = e8.allMatches, u1 = e8.store, c3 = e8.EVENTS;
    try {
        var s4 = i2.plugins, f1 = i2.context, p = t5.type, m = p.match(G), g = n7.exact.map(function(e) {
            return e.pluginName;
        });
        m && (g = o1.during.map(function(e) {
            return e.pluginName;
        }));
        var h = function(e9, n8) {
            return function(t6, r3, i3) {
                var a2 = r3.config, o2 = r3.name, u2 = o2 + "." + t6.type;
                i3 && (u2 = i3.event);
                var c4 = t6.type.match(G) ? function(e, n, t, r, i) {
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
                }(o2, u2, n8, i3, t6) : function(e, n) {
                    return function() {
                        throw new Error(e.type + " action not cancellable. Remove abort in " + n);
                    };
                }(t6, u2);
                return {
                    payload: ue(t6),
                    instance: e9,
                    config: a2 || {},
                    abort: c4
                };
            };
        }(r2, g), y1 = n7.exact.reduce(function(e, n) {
            var t = n.pluginName, r = n.methodName, i = !1;
            return r.match(/^initialize/) || r.match(/^reset/) || (i = !s4[t].loaded), f1.offline && r.match(/^(page|track|identify)/) && (i = !0), e["" + t] = i, e;
        }, {});
        return Promise.resolve(n7.exact.reduce(function(e10, i4, o3) {
            var u = i4.pluginName;
            return Promise.resolve(e10).then(function(e11) {
                function i5() {
                    return Promise.resolve(e11);
                }
                var o4 = function() {
                    if (n7.namespaced && n7.namespaced[u]) return Promise.resolve(n7.namespaced[u].reduce(function(e12, n9, t7) {
                        return Promise.resolve(e12).then(function(e13) {
                            var t8, i, o;
                            return n9.method && (0, _typeUtils.isFunction)(n9.method) ? (function(e, n) {
                                var t = oe(e);
                                if (t && t.name === n) {
                                    var r = oe(t.method);
                                    throw new Error([
                                        n + " plugin is calling method " + e,
                                        "Plugins cant call self",
                                        "Use " + t.method + " " + (r ? "or " + r.method : "") + " in " + n + " plugin insteadof " + e
                                    ].join("\n"));
                                }
                            }(n9.methodName, n9.pluginName), Promise.resolve(n9.method({
                                payload: e13,
                                instance: r2,
                                abort: (t8 = e13, i = u, o = n9.pluginName, function(e, n) {
                                    return v({}, t8, {
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
                                config: Z(n9.pluginName, s4, a1),
                                plugins: s4
                            })).then(function(n) {
                                var t = (0, _typeUtils.isObject)(n) ? n : {};
                                return Promise.resolve(v({}, e13, t));
                            })) : e13;
                        });
                    }, Promise.resolve(t5))).then(function(n) {
                        e11[u] = n;
                    });
                    e11[u] = t5;
                }();
                return o4 && o4.then ? o4.then(i5) : i5();
            });
        }, Promise.resolve({}))).then(function(e14) {
            return Promise.resolve(n7.exact.reduce(function(t9, i6, o5) {
                try {
                    var c5 = n7.exact.length === o5 + 1, f = i6.pluginName, d = a1[f];
                    return Promise.resolve(t9).then(function(n) {
                        var t = e14[f] ? e14[f] : {};
                        if (m && (t = n), te(t, f)) return Y({
                            data: t,
                            method: p,
                            instance: r2,
                            pluginName: f,
                            store: u1
                        }), Promise.resolve(n);
                        if (te(n, f)) return c5 && Y({
                            data: n,
                            method: p,
                            instance: r2,
                            store: u1
                        }), Promise.resolve(n);
                        if (y1.hasOwnProperty(f) && !0 === y1[f]) return u1.dispatch({
                            type: "queue",
                            plugin: f,
                            payload: t,
                            _: {
                                called: "queue",
                                from: "queueMechanism"
                            }
                        }), Promise.resolve(n);
                        var i7 = h(e14[f], a1[f]);
                        return Promise.resolve(d[p]({
                            abort: i7.abort,
                            payload: t,
                            instance: r2,
                            config: Z(f, s4, a1),
                            plugins: s4
                        })).then(function(i) {
                            var a = (0, _typeUtils.isObject)(i) ? i : {}, o = v({}, n, a), c = e14[f];
                            if (te(c, f)) Y({
                                data: c,
                                method: p,
                                instance: r2,
                                pluginName: f,
                                store: u1
                            });
                            else {
                                var s = p + ":" + f;
                                (s.match(/:/g) || []).length < 2 && !p.match(K) && !p.match(Q) && r2.dispatch(v({}, m ? o : t, {
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
            }, Promise.resolve(t5))).then(function(e) {
                if (!(p.match(G) || p.match(/^registerPlugin/) || p.match(Q) || p.match(K) || p.match(/^params/) || p.match(/^userIdChanged/))) {
                    if (c3.plugins.includes(p), e._ && e._.originalAction === p) return e;
                    var t = v({}, e, {
                        _: {
                            originalAction: e.type,
                            called: e.type,
                            from: "engineEnd"
                        }
                    });
                    re(e, n7.exact.length) && !p.match(/End$/) && (t = v({}, t, {
                        type: e.type + "Aborted"
                    })), u1.dispatch(t);
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
function ee(e, n10) {
    return n10.reduce(function(n, t) {
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
function ce(e15, n11, t10) {
    var r4 = {};
    return function(i8) {
        return function(a3) {
            return function(o6) {
                try {
                    var u3, c7 = function(e) {
                        return u3 ? e : a3(f3);
                    }, s6 = o6.type, l1 = o6.plugins, f3 = o6;
                    if (o6.abort) return Promise.resolve(a3(o6));
                    if (s6 === q.enablePlugin && i8.dispatch({
                        type: q.initializeStart,
                        plugins: l1,
                        disabled: [],
                        fromEnable: !0,
                        meta: o6.meta
                    }), s6 === q.disablePlugin && setTimeout(function() {
                        return J(o6.meta.rid, {
                            payload: o6
                        });
                    }, 0), s6 === q.initializeEnd) {
                        var m = n11(), g = Object.keys(m), h = g.filter(function(e) {
                            return l1.includes(e);
                        }).map(function(e) {
                            return m[e];
                        }), y2 = [], b1 = [], I1 = o6.disabled, w1 = h.map(function(e16) {
                            var n = e16.name;
                            return W(e16, e16.loaded, 1e4).then(function(t) {
                                return r4[n] || (i8.dispatch({
                                    type: q.pluginReadyType(n),
                                    name: n,
                                    events: Object.keys(e16).filter(function(e) {
                                        return !M.includes(e);
                                    })
                                }), r4[n] = !0), y2 = y2.concat(n), e16;
                            }).catch(function(e) {
                                if (e instanceof Error) throw new Error(e);
                                return b1 = b1.concat(e.name), e;
                            });
                        });
                        Promise.all(w1).then(function(e) {
                            var n = {
                                plugins: y2,
                                failed: b1,
                                disabled: I1
                            };
                            setTimeout(function() {
                                g.length === w1.length + I1.length && i8.dispatch(v({}, {
                                    type: q.ready
                                }, n));
                            }, 0);
                        });
                    }
                    var E1 = function() {
                        if (s6 !== q.bootstrap) return /^ready:([^:]*)$/.test(s6) && setTimeout(function() {
                            return H(i8, n11, e15);
                        }, 0), Promise.resolve(function(e17, n12, t11, r5, i9) {
                            try {
                                var a4 = (0, _typeUtils.isFunction)(n12) ? n12() : n12, o7 = e17.type, u5 = o7.replace(G, "");
                                if (e17._ && e17._.called) return Promise.resolve(e17);
                                var c9 = t11.getState(), s8 = (m = a4, void 0 === (g = c9.plugins) && (g = {}), void 0 === (h = e17.options) && (h = {}), Object.keys(m).filter(function(e) {
                                    var n = h.plugins || {};
                                    return (0, _typeUtils.isBoolean)(n[e]) ? n[e] : !1 !== n.all && (!g[e] || !1 !== g[e].enabled);
                                }).map(function(e) {
                                    return m[e];
                                }));
                                o7 === q.initializeStart && e17.fromEnable && (s8 = Object.keys(c9.plugins).filter(function(n) {
                                    var t = c9.plugins[n];
                                    return e17.plugins.includes(n) && !t.initialized;
                                }).map(function(e) {
                                    return a4[e];
                                }));
                                var l = s8.map(function(e) {
                                    return e.name;
                                }), f = function(e18, n, t12) {
                                    var r6 = ne(e18).map(function(e) {
                                        return ee(e, n);
                                    });
                                    return n.reduce(function(t, r) {
                                        var i = r.name, a = ne(e18, i).map(function(e) {
                                            return ee(e, n);
                                        }), o = a[0], u = a[1], c = a[2];
                                        return o.length && (t.beforeNS[i] = o), u.length && (t.duringNS[i] = u), c.length && (t.afterNS[i] = c), t;
                                    }, {
                                        before: r6[0],
                                        beforeNS: {},
                                        during: r6[1],
                                        duringNS: {},
                                        after: r6[2],
                                        afterNS: {}
                                    });
                                }(o7, s8);
                                return Promise.resolve(F({
                                    action: e17,
                                    data: {
                                        exact: f.before,
                                        namespaced: f.beforeNS
                                    },
                                    state: c9,
                                    allPlugins: a4,
                                    allMatches: f,
                                    instance: t11,
                                    store: r5,
                                    EVENTS: i9
                                })).then(function(e19) {
                                    function n13() {
                                        var n = function() {
                                            if (o7.match(G)) return Promise.resolve(F({
                                                action: v({}, s, {
                                                    type: u5 + "End"
                                                }),
                                                data: {
                                                    exact: f.after,
                                                    namespaced: f.afterNS
                                                },
                                                state: c9,
                                                allPlugins: a4,
                                                allMatches: f,
                                                instance: t11,
                                                store: r5,
                                                EVENTS: i9
                                            })).then(function(e) {
                                                e.meta && e.meta.hasCallback && J(e.meta.rid, {
                                                    payload: e
                                                });
                                            });
                                        }();
                                        return n && n.then ? n.then(function() {
                                            return e19;
                                        }) : e19;
                                    }
                                    if (re(e19, l.length)) return e19;
                                    var s, d = function() {
                                        if (o7 !== u5) return Promise.resolve(F({
                                            action: v({}, e19, {
                                                type: u5
                                            }),
                                            data: {
                                                exact: f.during,
                                                namespaced: f.duringNS
                                            },
                                            state: c9,
                                            allPlugins: a4,
                                            allMatches: f,
                                            instance: t11,
                                            store: r5,
                                            EVENTS: i9
                                        })).then(function(e) {
                                            s = e;
                                        });
                                        s = e19;
                                    }();
                                    return d && d.then ? d.then(n13) : n13();
                                });
                            } catch (e) {
                                return Promise.reject(e);
                            }
                            var m, g, h;
                        }(o6, n11, e15, i8, t10)).then(function(e) {
                            var n = a3(e);
                            return u3 = 1, n;
                        });
                    }();
                    return Promise.resolve(E1 && E1.then ? E1.then(c7) : c7(E1));
                } catch (e) {
                    return Promise.reject(e);
                }
            };
        };
    };
}
function se(e) {
    return function(n14) {
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
    var e20 = this;
    this.before = [], this.after = [], this.addMiddleware = function(n, t) {
        e20[t] = e20[t].concat(n);
    }, this.removeMiddleware = function(n, t) {
        var r = e20[t].findIndex(function(e) {
            return e === n;
        });
        -1 !== r && (e20[t] = [].concat(e20[t].slice(0, r), e20[t].slice(r + 1)));
    }, this.dynamicMiddlewares = function(n) {
        return function(t) {
            return function(r) {
                return function(i) {
                    var a = {
                        getState: t.getState,
                        dispatch: function(e) {
                            return t.dispatch(e);
                        }
                    }, o = e20[n].map(function(e) {
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
            var o = t.enabled;
            return r[i] = {
                enabled: o,
                initialized: !!o && Boolean(!a.initialize),
                loaded: !!o && Boolean(a.loaded()),
                config: a.config || {}
            }, v({}, n, r);
        }
        if (/^initialize:([^:]*)$/.test(t.type)) {
            var u = de(t.type, q.initialize), c = e()[u];
            return c && u ? (r[u] = v({}, n[u], {
                initialized: !0,
                loaded: Boolean(c.loaded())
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
function pe(e21, n, t) {
    return e21.reduce(function(e, r) {
        return e[r] = v({}, t[r], {
            enabled: n
        }), e;
    }, t);
}
function me(e) {
    try {
        return JSON.parse(JSON.stringify(e));
    } catch (e22) {}
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
var we, Ee, Pe, Se, Ne = function(e23) {
    if (void 0 === e23 && (e23 = {}), !(0, _typeUtils.isBrowser)) return e23;
    var n15 = document, t13 = n15.title, r = n15.referrer, i = window, a = i.location, o = i.innerWidth, u = i.innerHeight, c = a.hash, s = a.search, l = function(e24) {
        var n16 = function() {
            if (0, _typeUtils.isBrowser) {
                for(var e, n = document.getElementsByTagName("link"), t = 0; e = n[t]; t++)if ("canonical" === e.getAttribute("rel")) return e.getAttribute("href");
            }
        }();
        return n16 ? n16.match(/\?/) ? n16 : n16 + e24 : window.location.href.replace(be, "");
    }(s), f = {
        title: t13,
        url: l,
        path: Ie(l),
        hash: c,
        search: s,
        width: o,
        height: u
    };
    return r && "" !== r && (f.referrer = r), v({}, f, e23);
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
        version: "0.11.0"
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
var ke = [
    "plugins",
    "reducers",
    "storage"
];
function je(e25, n, t) {
    if (0, _typeUtils.isBrowser) {
        var r = window[(t ? "add" : "remove") + "EventListener"];
        e25.split(" ").forEach(function(e) {
            r(e, n);
        });
    }
}
function Te(e) {
    var n = je.bind(null, "online offline", function(n) {
        return Promise.resolve(!navigator.onLine).then(e);
    });
    return n(!0), function(e) {
        return n(!1);
    };
}
function ze() {
    return (0, _globalStorageUtils.set)("analytics", []), function(e26) {
        return function(n, t, r) {
            var i = e26(n, t, r), a = i.dispatch;
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
function Ue(n17, t14, r7) {
    void 0 === n17 && (n17 = {});
    var i, a, o = (0, _analyticsUtils.uuid)();
    return t14 && (X[o] = (i = t14, a = function(e) {
        for(var n, t = e || Array.prototype.slice.call(arguments), r = 0; r < t.length; r++)if ((0, _typeUtils.isFunction)(t[r])) {
            n = t[r];
            break;
        }
        return n;
    }(r7), function(e) {
        a && a(e), i(e);
    })), v({}, n17, {
        rid: o,
        ts: (new Date).getTime()
    }, t14 ? {
        hasCallback: !0
    } : {});
}
function Ve(n18) {
    void 0 === n18 && (n18 = {});
    var t15 = n18.reducers || {}, c11 = n18.initialUser || {}, s10 = (n18.plugins || []).reduce(function(e27, n19) {
        if ((0, _typeUtils.isFunction)(n19)) return e27.middlewares = e27.middlewares.concat(n19), e27;
        if (n19.NAMESPACE && (n19.name = n19.NAMESPACE), !n19.name) throw new Error("https://lytics.dev/errors/1");
        var t16 = n19.EVENTS ? Object.keys(n19.EVENTS).map(function(e) {
            return n19.EVENTS[e];
        }) : [];
        e27.pluginEnabled[n19.name] = !(!1 === n19.enabled || n19.config && !1 === n19.config.enabled), delete n19.enabled, n19.methods && (e27.methods[n19.name] = Object.keys(n19.methods).reduce(function(e28, t17) {
            var r;
            return e28[t17] = (r = n19.methods[t17], function() {
                for(var e = Array.prototype.slice.call(arguments), n = new Array(r.length), t = 0; t < e.length; t++)n[t] = e[t];
                return n[n.length] = K1, r.apply({
                    instance: K1
                }, n);
            }), e28;
        }, {}), delete n19.methods);
        var r8 = Object.keys(n19).concat(t16), i = new Set(e27.events.concat(r8));
        if (e27.events = Array.from(i), e27.pluginsArray = e27.pluginsArray.concat(n19), e27.plugins[n19.name]) throw new Error(n19.name + "AlreadyLoaded");
        return e27.plugins[n19.name] = n19, e27.plugins[n19.name].loaded || (e27.plugins[n19.name].loaded = function() {
            return !0;
        }), e27;
    }, {
        plugins: {},
        pluginEnabled: {},
        methods: {},
        pluginsArray: [],
        middlewares: [],
        events: []
    }), f5 = n18.storage ? n18.storage : {
        getItem: (0, _globalStorageUtils.get),
        setItem: (0, _globalStorageUtils.set),
        removeItem: (0, _globalStorageUtils.remove)
    }, p = function(e) {
        return function(n, t, r) {
            return t.getState("user")[n] || (r && (0, _typeUtils.isObject)(r) && r[n] ? r[n] : $(e)[n] || (0, _globalStorageUtils.get)(D(n)) || null);
        };
    }(f5), h = s10.plugins, w2 = s10.events.filter(function(e) {
        return !M.includes(e);
    }).sort(), E2 = new Set(w2.concat(z).filter(function(e) {
        return !M.includes(e);
    })), _1 = Array.from(E2).sort(), x1 = function() {
        return h;
    }, k1 = new le, U1 = k1.addMiddleware, V1 = k1.removeMiddleware, L1 = k1.dynamicMiddlewares, X1 = function() {
        throw new Error("Abort disabled inListener");
    }, J1 = (0, _analyticsUtils.paramsParse)(), W1 = $(f5), F1 = v({}, W1, c11, J1.an_uid ? {
        userId: J1.an_uid
    } : {}, J1.an_aid ? {
        anonymousId: J1.an_aid
    } : {});
    F1.anonymousId || (F1.anonymousId = (0, _analyticsUtils.uuid)());
    var G1 = v({
        enable: function(e, n) {
            return new Promise(function(t) {
                oe1.dispatch({
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
                oe1.dispatch({
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
    }, s10.methods), K1 = {
        identify: function(e29, n, t, r) {
            try {
                var i = (0, _typeUtils.isString)(e29) ? e29 : null, a = (0, _typeUtils.isObject)(e29) ? e29 : n, o = t || {}, c = K1.user();
                (0, _globalStorageUtils.set)(D(j), i);
                var s = i || a.userId || p(j, K1, a);
                return Promise.resolve(new Promise(function(e) {
                    oe1.dispatch(v({
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
        track: function(e30, n, t, r) {
            try {
                var i = (0, _typeUtils.isObject)(e30) ? e30.event : e30;
                if (!i || !(0, _typeUtils.isString)(i)) throw new Error("EventMissing");
                var a = (0, _typeUtils.isObject)(e30) ? e30 : n || {}, o = (0, _typeUtils.isObject)(t) ? t : {};
                return Promise.resolve(new Promise(function(e) {
                    oe1.dispatch({
                        type: q.trackStart,
                        event: i,
                        properties: a,
                        options: o,
                        userId: p(j, K1, n),
                        anonymousId: p(T, K1, n)
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
                    oe1.dispatch({
                        type: q.pageStart,
                        properties: Ne(r),
                        options: i,
                        userId: p(j, K1, r),
                        anonymousId: p(T, K1, r)
                    }, a, [
                        e,
                        n,
                        t
                    ]);
                }));
            } catch (e31) {
                return Promise.reject(e31);
            }
        },
        user: function(e) {
            if (e === j || "id" === e) return p(j, K1);
            if (e === T || "anonId" === e) return p(T, K1);
            var n = K1.getState("user");
            return e ? (0, _analyticsUtils.dotProp)(n, e) : n;
        },
        reset: function(e) {
            return new Promise(function(n) {
                oe1.dispatch({
                    type: q.resetStart
                }, n, e);
            });
        },
        ready: function(e) {
            return K1.on(q.ready, e);
        },
        on: function(e32, n) {
            if (!e32 || !(0, _typeUtils.isFunction)(n)) return !1;
            if (e32 === q.bootstrap) throw new Error(".on disabled for " + e32);
            var t18 = /Start$|Start:/;
            if ("*" === e32) {
                var r9 = function(e33) {
                    return function(e) {
                        return function(r) {
                            return r.type.match(t18) && n({
                                payload: r,
                                instance: K1,
                                plugins: h
                            }), e(r);
                        };
                    };
                }, i = function(e34) {
                    return function(e) {
                        return function(r) {
                            return r.type.match(t18) || n({
                                payload: r,
                                instance: K1,
                                plugins: h
                            }), e(r);
                        };
                    };
                };
                return U1(r9, Le), U1(i, Ce), function() {
                    V1(r9, Le), V1(i, Ce);
                };
            }
            var a = e32.match(t18) ? Le : Ce, o = function(t19) {
                return function(t) {
                    return function(r) {
                        return r.type === e32 && n({
                            payload: r,
                            instance: K1,
                            plugins: h,
                            abort: X1
                        }), t(r);
                    };
                };
            };
            return U1(o, a), function() {
                return V1(o, a);
            };
        },
        once: function(e35, n) {
            if (!e35 || !(0, _typeUtils.isFunction)(n)) return !1;
            if (e35 === q.bootstrap) throw new Error(".once disabled for " + e35);
            var t = K1.on(e35, function(e) {
                n({
                    payload: e.payload,
                    instance: K1,
                    plugins: h,
                    abort: X1
                }), t();
            });
            return t;
        },
        getState: function(e) {
            var n = oe1.getState();
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
            oe1.dispatch(t);
        },
        enablePlugin: G1.enable,
        disablePlugin: G1.disable,
        plugins: G1,
        storage: {
            getItem: f5.getItem,
            setItem: function(e, n, t) {
                oe1.dispatch({
                    type: q.setItemStart,
                    key: e,
                    value: n,
                    options: t
                });
            },
            removeItem: function(e, n) {
                oe1.dispatch({
                    type: q.removeItemStart,
                    key: e,
                    options: n
                });
            }
        },
        setAnonymousId: function(e, n) {
            K1.storage.setItem(A, e, n);
        },
        events: {
            core: z,
            plugins: w2
        }
    }, Q1 = s10.middlewares.concat([
        function(e36) {
            return function(e) {
                return function(n) {
                    return n.meta || (n.meta = Ue()), e(n);
                };
            };
        },
        L1(Le),
        ce(K1, x1, {
            all: _1,
            plugins: w2
        }),
        se(f5),
        C(K1),
        B(K1),
        L1(Ce)
    ]), Y1 = {
        context: xe,
        user: R(f5),
        page: Ae,
        track: he,
        plugins: fe(x1),
        queue: ye
    }, Z1 = N, ee1 = N;
    if ((0, _typeUtils.isBrowser) && n18.debug) {
        var ne1 = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        ne1 && (Z1 = ne1({
            trace: !0,
            traceLimit: 25
        })), ee1 = function() {
            return 0 === arguments.length ? ze() : (0, _typeUtils.isObject)(typeof arguments[0]) ? Me() : Me().apply(null, arguments);
        };
    }
    var te1, re1 = function(e) {
        return Object.keys(e).reduce(function(n, t) {
            return ke.includes(t) || (n[t] = e[t]), n;
        }, {});
    }(n18), ie1 = s10.pluginsArray.reduce(function(e, n) {
        var t = n.name, r = n.config, i = n.loaded, a = s10.pluginEnabled[t];
        return e[t] = {
            enabled: a,
            initialized: !!a && Boolean(!n.initialize),
            loaded: Boolean(i()),
            config: r || {}
        }, e;
    }, {}), ae1 = {
        context: re1,
        user: F1,
        plugins: ie1
    }, oe1 = P(function(e37) {
        for(var n20 = Object.keys(e37), t20 = {}, r11 = 0; r11 < n20.length; r11++){
            var i = n20[r11];
            typeof e37[i] === y && (t20[i] = e37[i]);
        }
        var a, o = Object.keys(t20);
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
            }(t20);
        } catch (e38) {
            a = e38;
        }
        return function(e, n) {
            if (void 0 === e && (e = {}), a) throw a;
            for(var r = !1, i = {}, u = 0; u < o.length; u++){
                var c = o[u], s = e[c], l = (0, t20[c])(s, n);
                if (typeof l === b) {
                    var f = S(c, n);
                    throw new Error(f);
                }
                i[c] = l, r = r || l !== s;
            }
            return r ? i : e;
        };
    }(v({}, Y1, t15)), ae1, ee1(Z1(O.apply(void 0, Q1))));
    oe1.dispatch = (te1 = oe1.dispatch, function(e, n, t) {
        var r = v({}, e, {
            meta: Ue(e.meta, n, qe(t))
        });
        return te1.apply(null, [
            r
        ]);
    });
    var ue1 = Object.keys(h);
    oe1.dispatch({
        type: q.bootstrap,
        plugins: ue1,
        config: re1,
        params: J1,
        user: F1,
        initialUser: c11,
        persistedUser: W1
    });
    var de1 = ue1.filter(function(e) {
        return s10.pluginEnabled[e];
    }), pe1 = ue1.filter(function(e) {
        return !s10.pluginEnabled[e];
    });
    return oe1.dispatch({
        type: q.registerPlugins,
        plugins: ue1,
        enabled: s10.pluginEnabled
    }), s10.pluginsArray.map(function(e, n) {
        var t = e.bootstrap, r = e.config, i = e.name;
        t && (0, _typeUtils.isFunction)(t) && t({
            instance: K1,
            config: r,
            payload: e
        }), oe1.dispatch({
            type: q.registerPluginType(i),
            name: i,
            enabled: s10.pluginEnabled[i],
            plugin: e
        }), s10.pluginsArray.length === n + 1 && oe1.dispatch({
            type: q.initializeStart,
            plugins: de1,
            disabled: pe1
        });
    }), Te(function(e) {
        oe1.dispatch({
            type: e ? q.offline : q.online
        });
    }), function(e, n, t) {
        setInterval(function() {
            return H(e, n, t);
        }, 3e3);
    }(oe1, x1, K1), K1;
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
var _typeUtils = require("@analytics/type-utils");
var _dlv = require("dlv");
var _dlvDefault = parcelHelpers.interopDefault(_dlv);
function n(e) {
    try {
        return decodeURIComponent(e.replace(/\+/g, " "));
    } catch (e1) {
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
        var n1 = window.document.location.port, o1 = t.split("/")[2];
        return n1 && (o1 = o1.replace(":" + n1, "")), o1 !== window.location.hostname;
    }
    return !1;
}
function u(n2) {
    if (!(0, _typeUtils.isBrowser)) return !0;
    var o2 = document.getElementsByTagName("script");
    return !!Object.keys(o2).filter(function(e) {
        var a1 = o2[e].src;
        return (0, _typeUtils.isString)(n2) ? -1 !== a1.indexOf(n2) : !!(0, _typeUtils.isRegex)(n2) && a1.match(n2);
    }).length;
}
function c(e, r) {
    var t = (e.split("?") || [
        , 
    ])[1];
    if (!t || -1 === t.indexOf(r)) return e;
    var n3 = new RegExp("(\\&|\\?)" + r + '([_A-Za-z0-9"+=.\\/\\-@%]+)', "g"), o3 = ("?" + t).replace(n3, "").replace(/^&/, "?");
    return e.replace("?" + t, o3);
}
function l(e, r) {
    return n((RegExp(e + "=(.+?)(&|$)").exec(r) || [
        ,
        ""
    ])[1]);
}
function s(r1) {
    return function(e2) {
        for(var r, t = Object.create(null), o4 = /([^&=]+)=?([^&]*)/g; r = o4.exec(e2);){
            var a2 = n(r[1]), i1 = n(r[2]);
            "[]" === a2.substring(a2.length - 2) ? (t[a2 = a2.substring(0, a2.length - 2)] || (t[a2] = [])).push(i1) : t[a2] = "" === i1 || i1;
        }
        for(var u1 in t){
            var c1 = u1.split("[");
            c1.length > 1 && (m(t, c1.map(function(e) {
                return e.replace(/[?[\]\\ ]/g, "");
            }), t[u1]), delete t[u1]);
        }
        return t;
    }(function(r) {
        if (r) {
            var t = r.match(/\?(.*)/);
            return t && t[1] ? t[1].split("#")[0] : "";
        }
        return (0, _typeUtils.isBrowser) && window.location.search.substring(1);
    }(r1));
}
function m(e, r, t) {
    for(var n4 = r.length - 1, o5 = 0; o5 < n4; ++o5){
        var a3 = r[o5];
        if ("__proto__" === a3 || "constructor" === a3) break;
        a3 in e || (e[a3] = {}), e = e[a3];
    }
    e[r[n4]] = t;
}
function f(r, t) {
    return (0, _typeUtils.isBrowser) ? new Promise(function(e, n) {
        if (window.history && window.history.replaceState) {
            var o6 = window.location.href, a4 = c(o6, r);
            o6 !== a4 && history.replaceState({}, "", a4);
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
function v(r2, t1) {
    if (!(0, _typeUtils.isBrowser)) return !1;
    var n5 = {
        source: "(direct)",
        medium: "(none)",
        campaign: "(not set)"
    };
    r2 && i(r2) && (n5.referrer = r2);
    var o7 = function(r) {
        if (!r || !(0, _typeUtils.isBrowser)) return !1;
        var t = p(r), n6 = document.createElement("a");
        if (n6.href = r, n6.hostname.indexOf("google") > -1 && (t = "google"), w[t]) {
            var o8 = w[t], a6 = new RegExp(("string" == typeof o8 ? o8 : o8.p) + "=.*?([^&#]*|$)", "gi"), u3 = n6.search.match(a6);
            return {
                source: o8.n || x(t),
                medium: "organic",
                term: (u3 ? u3[0].split("=")[1] : "") || "(not provided)"
            };
        }
        var c3 = i(r) ? "referral" : "internal";
        return {
            source: n6.hostname,
            medium: c3
        };
    }(r2);
    o7 && Object.keys(o7).length && (n5 = Object.assign({}, n5, o7));
    var a5 = s(t1), u2 = Object.keys(a5);
    if (!u2.length) return n5;
    var c2 = u2.reduce(function(e, r) {
        return r.match(/^utm_/) && (e["" + r.replace(/^utm_/, "")] = a5[r]), r.match(/^(d|g)clid/) && (e.source = "google", e.medium = a5.gclid ? "cpc" : "cpm", e[r] = a5[r]), e;
    }, {});
    return Object.assign({}, n5, c2);
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
        var n7 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[r - 1], o9 = 15 & t;
        e += "-" == n7 || "4" == n7 ? n7 : ("x" == n7 ? o9 : 3 & o9 | 8).toString(16), t = r % 8 == 0 ? 4294967295 * Math.random() | 0 : t >> 4;
    }
    return e;
}
function b(e, r) {
    var t, n8, o10, a7 = null, i2 = 0, u4 = function() {
        i2 = new Date, a7 = null, o10 = e.apply(t, n8);
    };
    return function() {
        var c4 = new Date;
        i2 || (i2 = c4);
        var l1 = r - (c4 - i2);
        return t = this, n8 = arguments, l1 <= 0 ? (clearTimeout(a7), a7 = null, i2 = c4, o10 = e.apply(t, n8)) : a7 || (a7 = setTimeout(u4, l1)), o10;
    };
}

},{"@analytics/type-utils":"aEtAL","dlv":"hKTrw","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aEtAL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ALL", ()=>m);
parcelHelpers.export(exports, "ANY", ()=>g);
parcelHelpers.export(exports, "ARRAY", ()=>u);
parcelHelpers.export(exports, "ASYNC_FUNCTION", ()=>d);
parcelHelpers.export(exports, "ASYNC_GENERATOR_FUNCTION", ()=>y);
parcelHelpers.export(exports, "BOOLEAN", ()=>r);
parcelHelpers.export(exports, "BUTTON", ()=>w);
parcelHelpers.export(exports, "CHANGE", ()=>E);
parcelHelpers.export(exports, "ENV", ()=>P);
parcelHelpers.export(exports, "ERROR", ()=>a);
parcelHelpers.export(exports, "FORM", ()=>O);
parcelHelpers.export(exports, "FUNCTION", ()=>n);
parcelHelpers.export(exports, "GENERATOR_FUNCTION", ()=>p);
parcelHelpers.export(exports, "HIDDEN", ()=>h);
parcelHelpers.export(exports, "INPUT", ()=>S);
parcelHelpers.export(exports, "NONE", ()=>v);
parcelHelpers.export(exports, "NULL", ()=>f);
parcelHelpers.export(exports, "NUMBER", ()=>i);
parcelHelpers.export(exports, "OBJECT", ()=>o);
parcelHelpers.export(exports, "PREFIX", ()=>j);
parcelHelpers.export(exports, "REGEX_EMAIL", ()=>z);
parcelHelpers.export(exports, "REGEX_ISO", ()=>D);
parcelHelpers.export(exports, "REGEX_JSON", ()=>Z);
parcelHelpers.export(exports, "SELECT", ()=>A);
parcelHelpers.export(exports, "STRING", ()=>t);
parcelHelpers.export(exports, "SUBMIT", ()=>N);
parcelHelpers.export(exports, "SYMBOL", ()=>c);
parcelHelpers.export(exports, "SYNTAX_ERROR", ()=>l);
parcelHelpers.export(exports, "TYPE_ERROR", ()=>s);
parcelHelpers.export(exports, "UNDEFINED", ()=>e);
parcelHelpers.export(exports, "ctorName", ()=>yn);
parcelHelpers.export(exports, "ensureArray", ()=>Hn);
parcelHelpers.export(exports, "getType", ()=>R);
parcelHelpers.export(exports, "getTypeName", ()=>J);
parcelHelpers.export(exports, "isArguments", ()=>En);
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
parcelHelpers.export(exports, "isMap", ()=>gn);
parcelHelpers.export(exports, "isMethod", ()=>an);
parcelHelpers.export(exports, "isNoOp", ()=>An);
parcelHelpers.export(exports, "isNode", ()=>_);
parcelHelpers.export(exports, "isNodeList", ()=>Ln);
parcelHelpers.export(exports, "isNodeType", ()=>Tn);
parcelHelpers.export(exports, "isNull", ()=>Y);
parcelHelpers.export(exports, "isNumber", ()=>nn);
parcelHelpers.export(exports, "isNumberLike", ()=>tn);
parcelHelpers.export(exports, "isObject", ()=>on);
parcelHelpers.export(exports, "isObjectLike", ()=>un);
parcelHelpers.export(exports, "isPrimitive", ()=>fn);
parcelHelpers.export(exports, "isProd", ()=>x);
parcelHelpers.export(exports, "isPromise", ()=>sn);
parcelHelpers.export(exports, "isRegex", ()=>mn);
parcelHelpers.export(exports, "isSelect", ()=>Mn);
parcelHelpers.export(exports, "isSet", ()=>bn);
parcelHelpers.export(exports, "isStaging", ()=>C);
parcelHelpers.export(exports, "isString", ()=>q);
parcelHelpers.export(exports, "isSymbol", ()=>X);
parcelHelpers.export(exports, "isSyntaxError", ()=>wn);
parcelHelpers.export(exports, "isTrue", ()=>zn);
parcelHelpers.export(exports, "isTruthy", ()=>Nn);
parcelHelpers.export(exports, "isTypeError", ()=>Sn);
parcelHelpers.export(exports, "isUndefined", ()=>I);
parcelHelpers.export(exports, "isWebWorker", ()=>B);
parcelHelpers.export(exports, "noOp", ()=>b);
var process = require("process");
var n = "function", t = "string", e = "undefined", r = "boolean", o = "object", u = "array", i = "number", c = "symbol", f = "null", a = "error", s = "typeError", l = "syntaxError", d = "asyncFunction", p = "generatorFunction", y = "asyncGeneratorFunction", b = function() {}, g = "any", m = "*", v = "none", h = "hidden", j = "__", O = "form", S = "input", w = "button", A = "select", E = "change", N = "submit", D = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/, z = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Z = /^\{[\s\S]*\}$|^\[[\s\S]*\]$/, F = "undefined" != typeof process ? process : {}, P = F.env && F.env.NODE_ENV || "", x = "production" === P, C = "staging" === P, L = "development" === P, $ = "undefined" != typeof window, T = $ && "localhost" === window.location.hostname, _ = null != F.versions && null != F.versions.node, k = "undefined" != typeof Deno && void 0 !== Deno.core, B = "object" == typeof self && self.constructor && "DedicatedWorkerGlobalScope" === self.constructor.name, G = $ && "nodejs" === window.name || "undefined" != typeof navigator && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
function M(n1, t1) {
    return t1.charAt(0)[n1]() + t1.slice(1);
}
var U = M.bind(null, "toUpperCase"), H = M.bind(null, "toLowerCase");
function J(n2) {
    return Y(n2) ? U("null") : "object" == typeof n2 ? yn(n2) : Object.prototype.toString.call(n2).slice(8, -1);
}
function R(n3, t2) {
    void 0 === t2 && (t2 = !0);
    var e1 = J(n3);
    return t2 ? H(e1) : e1;
}
function V(n4, t3) {
    return typeof t3 === n4;
}
var W = V.bind(null, "function"), q = V.bind(null, "string"), I = V.bind(null, "undefined");
function K(n5) {
    return !I(n5);
}
var Q = V.bind(null, "boolean"), X = V.bind(null, "symbol");
function Y(n6) {
    return null === n6;
}
function nn(n7) {
    return "number" === R(n7) && !isNaN(n7);
}
function tn(n8) {
    return !isNaN(parseFloat(n8));
}
function en(n9) {
    return !!W(n9) && /^class /.test(Function.prototype.toString.call(n9));
}
function rn(n10) {
    return "array" === R(n10);
}
function on(n11) {
    if (!un(n11)) return !1;
    for(var t4 = n11; null !== Object.getPrototypeOf(t4);)t4 = Object.getPrototypeOf(t4);
    return Object.getPrototypeOf(n11) === t4;
}
function un(n12) {
    return n12 && ("object" == typeof n12 || null !== n12);
}
function cn(n13) {
    if (!q(n13) || !Z.test(n13)) return !1;
    try {
        JSON.parse(n13);
    } catch (n) {
        return !1;
    }
    return !0;
}
function fn(n14) {
    if (Y(n14)) return !0;
    switch(typeof n14){
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
function an(n15, t5) {
    return on(n15) && W(n15[t5]);
}
function sn(n16) {
    return !!n16 && !!(!I(Promise) && n16 instanceof Promise || n16.then && W(n16.then));
}
function ln(n17) {
    return un(n17) && W(n17.throw) && W(n17.return) && W(n17.next);
}
function dn(n18) {
    return "generatorFunction" === R(n18);
}
function pn(n19) {
    return "asyncFunction" === R(n19);
}
function yn(n20) {
    return W(n20.constructor) ? n20.constructor.name : null;
}
function bn(n21) {
    return n21 instanceof Set;
}
function gn(n22) {
    return n22 instanceof Map;
}
function mn(n23) {
    return n23 instanceof RegExp;
}
function vn(n24) {
    return !(!n24.constructor || !W(n24.constructor.isBuffer)) && n24.constructor.isBuffer(n24);
}
function hn(n25) {
    return n25 instanceof Error || q(n25.message) && n25.constructor && nn(n25.constructor.stackTraceLimit);
}
function jn(n26) {
    return un(n26) && q(n26.message) && q(n26.name);
}
function On(n27, t6) {
    if ("object" != typeof t6 || Y(t6)) return !1;
    if (t6 instanceof n27) return !0;
    var e2 = R(new n27(""));
    if (hn(t6)) for(; t6;){
        if (R(t6) === e2) return !0;
        t6 = Object.getPrototypeOf(t6);
    }
    return !1;
}
var Sn = On.bind(null, TypeError), wn = On.bind(null, SyntaxError);
function An(n28) {
    if (!W(n28)) return !1;
    var t7 = /{(\r|\n|\s)*}/gm, e3 = b + "";
    return e3 === (n28.toString().match(t7) || [
        ""
    ])[0].replace(t7, e3);
}
function En(n29) {
    try {
        if (nn(n29.length) && W(n29.callee)) return !0;
    } catch (n30) {
        if (-1 !== n30.message.indexOf("callee")) return !0;
    }
    return !1;
}
function Nn(n31) {
    return !(q(n31) && "false" === n31.toLowerCase() || !n31);
}
function Dn(n32) {
    return !n32;
}
function zn(n33) {
    return !0 === n33;
}
function Zn(n34) {
    return !1 === n34;
}
function Fn(n35) {
    return !(n35.length > 320) && z.test(n35);
}
function Pn(n36) {
    return n36 instanceof Date || W(n36.toDateString) && W(n36.getDate) && W(n36.setDate);
}
function xn(n37) {
    return D.test(n37);
}
function Cn(n38) {
    return !(!Y(n38) && (rn(n38) ? n38.length : bn(n38) || gn(n38) ? n38.size : on(n38) && Object.keys(n38).length));
}
function Ln(n39) {
    return NodeList.prototype.isPrototypeOf(n39);
}
function $n(n40, t8) {
    var e4 = n40 instanceof Element || n40 instanceof HTMLDocument;
    return e4 && t8 ? Tn(n40, t8) : e4;
}
function Tn(n41, t9) {
    return void 0 === t9 && (t9 = ""), n41 && n41.nodeName === t9.toUpperCase();
}
function _n(n42) {
    var t10 = [].slice.call(arguments, 1);
    return function() {
        return n42.apply(void 0, [].slice.call(arguments).concat(t10));
    };
}
var kn = _n($n, "form"), Bn = _n($n, "button"), Gn = _n($n, "input"), Mn = _n($n, "select");
function Un(n43, t11) {
    if (!n43 || "hidden" === getComputedStyle(n43).visibility) return !0;
    for(; n43;){
        if (null != t11 && n43 === t11) return !1;
        if ("none" === getComputedStyle(n43).display) return !0;
        n43 = n43.parentElement;
    }
    return !1;
}
function Hn(n44) {
    return n44 ? rn(n44) ? n44 : [
        n44
    ] : [];
}

},{"process":"d5jf4","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hKTrw":[function(require,module,exports) {
!function(t1, n1) {
    module.exports = function(t, n, e, i, o) {
        for(n = n.split ? n.split(".") : n, i = 0; i < n.length; i++)t = t ? t[n[i]] : o;
        return t === o ? e : t;
    };
}(this);

},{}],"46TFL":[function(require,module,exports) {
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
    var l1;
    try {
        if (b(t)) {
            var o1 = window[t];
            l1 = o1[e].bind(o1);
        }
    } catch (t1) {}
    return l1 || r;
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
    } catch (t1) {}
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
    } catch (e1) {
        i = !1;
    }
    return i;
}
function d(e, t1, r1, c1, u1, a1) {
    if ("undefined" != typeof window) {
        var d1 = arguments.length > 1;
        return !1 === i && (d1 ? (0, _globalStorageUtils.set)(e, t1) : (0, _globalStorageUtils.get)(e)), d1 ? document.cookie = e + "=" + encodeURIComponent(t1) + (r1 ? "; expires=" + new Date(+new Date + 1e3 * r1).toUTCString() + (c1 ? "; path=" + c1 : "") + (u1 ? "; domain=" + u1 : "") + (a1 ? "; secure" : "") : "") : decodeURIComponent((("; " + document.cookie).split("; " + e + "=")[1] || "").split(";")[0]);
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
parcelHelpers.export(exports, "init", ()=>init);
parcelHelpers.export(exports, "identify", ()=>identify);
parcelHelpers.export(exports, "track", ()=>track);
parcelHelpers.export(exports, "page", ()=>page);
parcelHelpers.export(exports, "initialize", ()=>initialize$1);
// googleAnalytics events from a node server environment.
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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
/* global ga */ var defaultConfig = {
    /* See description below */ trackingId: null,
    /* See description below */ debug: false,
    /* See description below */ anonymizeIp: false,
    /* See description below */ customDimensions: {},
    /* See description below */ resetCustomDimensionsOnPage: [],
    /* See description below */ setCustomDimensionsToPage: true
};
var loadedInstances = {};
/**
 * Google analytics plugin
 * @link https://getanalytics.io/plugins/google-analytics/
 * @link https://analytics.google.com/analytics/web/
 * @link https://developers.google.com/analytics/devguides/collection/analyticsjs
 * @param {object}  pluginConfig - Plugin settings
 * @param {string}  pluginConfig.trackingId - Google Analytics site tracking Id
 * @param {boolean} [pluginConfig.debug] - Enable Google Analytics debug mode
 * @param {boolean} [pluginConfig.anonymizeIp] - Enable [Anonymizing IP addresses](https://bit.ly/3c660Rd) sent to Google Analytics. [See details below](#anonymize-visitor-ips)
 * @param {object}  [pluginConfig.customDimensions] - Map [Custom dimensions](https://bit.ly/3c5de88) to send extra information to Google Analytics. [See details below](#using-ga-custom-dimensions)
 * @param {object}  [pluginConfig.resetCustomDimensionsOnPage] - Reset custom dimensions by key on analytics.page() calls. Useful for single page apps.
 * @param {boolean} [pluginConfig.setCustomDimensionsToPage] - Mapped dimensions will be set to the page & sent as properties of all subsequent events on that page. If false, analytics will only pass custom dimensions as part of individual events
 * @param {string}  [pluginConfig.instanceName] - Custom tracker name for google analytics. Use this if you need multiple googleAnalytics scripts loaded
 * @param {string}  [pluginConfig.customScriptSrc] - Custom URL for google analytics script, if proxying calls
 * @param {object}  [pluginConfig.cookieConfig] - Additional cookie properties for configuring the [ga cookie](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#configuring_cookie_field_settings)
 * @param {object}  [pluginConfig.tasks] - [Set custom google analytic tasks](https://developers.google.com/analytics/devguides/collection/analyticsjs/tasks)
 * @return {*}
 * @example
 *
 * googleAnalytics({
 *   trackingId: 'UA-1234567'
 * })
 */ function googleAnalytics$1() {
    var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var pageCalledOnce = false; // Allow for multiple google analytics instances
    var _getInstanceDetails = getInstanceDetails(pluginConfig), instanceName = _getInstanceDetails.instanceName, instancePrefix = _getInstanceDetails.instancePrefix;
    return {
        name: "google-analytics",
        config: _objectSpread({}, defaultConfig, pluginConfig),
        // Load google analytics
        initialize: function initialize(pluginApi) {
            var config = pluginApi.config, instance = pluginApi.instance;
            if (!config.trackingId) throw new Error("No GA trackingId defined");
            var customDimensions = config.customDimensions, customScriptSrc = config.customScriptSrc; // var to hoist
            var scriptSrc = customScriptSrc || "https://www.google-analytics.com/analytics.js"; // Load google analytics script to page
            if (gaNotLoaded(scriptSrc)) /* eslint-disable */ (function(i, s, o, g, r, a, m) {
                i["GoogleAnalyticsObject"] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, "script", scriptSrc, "ga");
             // Initialize tracker instance on page
            if (!loadedInstances[instanceName]) {
                var gaConfig = _objectSpread({
                    cookieDomain: config.domain || "auto",
                    siteSpeedSampleRate: config.siteSpeedSampleRate || 1,
                    sampleRate: config.sampleRate || 100,
                    allowLinker: true
                }, config.cookieConfig);
                if (instanceName) gaConfig.name = instanceName;
                ga("create", config.trackingId, gaConfig);
                if (config.debug) {
                    // Disable sends to GA http://bit.ly/2Ro0vTR
                    ga("".concat(instancePrefix, "set"), "sendHitTask", null);
                    window.ga_debug = {
                        trace: true
                    };
                }
                if (config.anonymizeIp) ga("".concat(instancePrefix, "set"), "anonymizeIp", true);
                if (config.tasks) {
                    var taskList = [
                        "customTask",
                        "previewTask",
                        "checkProtocolTask",
                        "validationTask",
                        "checkStorageTask",
                        "historyImportTask",
                        "samplerTask",
                        "buildHitTask",
                        "sendHitTask",
                        "timingTask",
                        "displayFeaturesTask"
                    ];
                    taskList.forEach(function(taskName) {
                        if (config.tasks.hasOwnProperty(taskName)) {
                            var task = config.tasks[taskName];
                            if (typeof task === "function") ga(config.tasks[taskName]);
                            else if (task === null) ga("".concat(instancePrefix, "set"), taskName, task);
                        }
                    });
                }
                /* set custom dimensions from user traits */ var user = instance.user() || {};
                var traits = user.traits || {};
                if (Object.keys(traits).length && customDimensions && Object.keys(customDimensions).length) {
                    var dimensions = formatObjectIntoDimensions$1(traits, config);
                    ga("".concat(instancePrefix, "set"), dimensions);
                }
                loadedInstances[instanceName] = true;
            }
        },
        // Google Analytics page view
        page: function page(_ref) {
            var payload = _ref.payload, config = _ref.config, instance = _ref.instance;
            var properties = payload.properties;
            var resetCustomDimensionsOnPage = config.resetCustomDimensionsOnPage, customDimensions = config.customDimensions;
            var campaign = instance.getState("context.campaign");
            if (gaNotLoaded()) return;
            /* If dimensions are specifiied to reset, clear them before page view */ if (resetCustomDimensionsOnPage && resetCustomDimensionsOnPage.length) {
                var resetDimensions = resetCustomDimensionsOnPage.reduce(function(acc, key) {
                    if (customDimensions[key]) acc[customDimensions[key]] = null; // { dimension1: null } etc
                    return acc;
                }, {});
                if (Object.keys(resetDimensions).length) // Reset custom dimensions
                ga("".concat(instancePrefix, "set"), resetDimensions);
            }
            var path = properties.path || document.location.pathname;
            var pageView = {
                page: path,
                title: properties.title,
                location: properties.url
            };
            var pageData = {
                page: path,
                title: properties.title // allow referrer override if referrer was manually set
            };
            if (properties.referrer !== document.referrer) pageData.referrer = properties.referrer;
            var campaignData = addCampaignData(campaign);
            var dimensions = setCustomDimensions(properties, config, instancePrefix);
            /* Dimensions will only be included in the event if config.setCustomDimensionsToPage is false */ var finalPayload = _objectSpread({}, pageView, campaignData, dimensions);
            ga("".concat(instancePrefix, "set"), pageData); // Remove location for SPA tracking after initial page view
            if (pageCalledOnce) delete finalPayload.location;
            /* send page view to GA */ ga("".concat(instancePrefix, "send"), "pageview", finalPayload); // Set after initial page view
            pageCalledOnce = true;
        },
        /**
     * Google Analytics track event
     * @example
     *
     * analytics.track('playedVideo', {
     *   category: 'Videos',
     *   label: 'Fall Campaign',
     *   value: 42
     * })
     */ track: function track(_ref2) {
            var payload = _ref2.payload, config = _ref2.config, instance = _ref2.instance;
            var properties = payload.properties, event = payload.event;
            var label = properties.label, value = properties.value, category = properties.category, nonInteraction = properties.nonInteraction;
            var campaign = instance.getState("context.campaign"); // TODO inline this trackEvent
            trackEvent$1({
                hitType: "event",
                event: event,
                label: label,
                category: category || "All",
                value: value,
                nonInteraction: nonInteraction,
                campaign: campaign
            }, config, payload);
        },
        identify: function identify(_ref3) {
            var payload = _ref3.payload, config = _ref3.config;
            identifyVisitor$1(payload.userId, payload.traits, config);
        },
        loaded: function loaded() {
            return !!window.gaplugins;
        }
    };
}
function gaNotLoaded(scriptSrc) {
    if (scriptSrc) return !scriptLoaded(scriptSrc);
    return typeof ga === "undefined";
}
function getInstanceDetails(pluginConfig) {
    var instanceName = pluginConfig.instanceName;
    return {
        instancePrefix: instanceName ? "".concat(instanceName, ".") : "",
        instanceName: instanceName
    };
}
/**
 * Send event tracking to Google Analytics
 * @param  {object} eventData - GA event payload
 * @param  {string} [eventData.hitType = 'event'] - hitType https://bit.ly/2Jab9L1 one of 'pageview', 'screenview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'
 * @param  {string} [eventData.event] - event Action https://bit.ly/2CUzeoz
 * @param  {string} [eventData.label] - event Label http://bit.ly/2oo8eb3
 * @param  {string} [eventData.category] - event Category http://bit.ly/2EAy9UP
 * @param  {string} [eventData.nonInteraction = false] - nonInteraction https://bit.ly/2CUzeoz
 * @return {object} sent data
 */ function trackEvent$1(eventData) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var payload = arguments.length > 2 ? arguments[2] : undefined;
    if (gaNotLoaded()) return;
    var _getInstanceDetails2 = getInstanceDetails(opts), instancePrefix = _getInstanceDetails2.instancePrefix;
    var data = {
        // hitType https://bit.ly/2Jab9L1 one of 'pageview', 'screenview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'
        hitType: eventData.hitType || "event",
        // eventAction https://bit.ly/2CUzeoz
        eventAction: eventData.event,
        // eventLabel http://bit.ly/2oo8eb3
        eventLabel: eventData.label,
        // eventCategory http://bit.ly/2EAy9UP
        eventCategory: eventData.category || "All",
        // nonInteraction https://bit.ly/2CUzeoz
        nonInteraction: eventData.nonInteraction !== undefined ? !!eventData.nonInteraction : false
    };
    if (eventData.value) // how much is this action worth?
    data.eventValue = format(eventData.value);
    /* Attach campaign data */ var campaignData = addCampaignData(eventData);
    /* Set Dimensions or return them for payload is config.setCustomDimensionsToPage is false */ var dimensions = setCustomDimensions(payload.properties, opts, instancePrefix);
    var finalPayload = _objectSpread({}, data, campaignData, dimensions);
    /* Send data to Google Analytics */ ga("".concat(instancePrefix, "send"), "event", finalPayload);
    return finalPayload;
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
    var name = campaignData.name, source = campaignData.source, medium = campaignData.medium, content = campaignData.content, keyword = campaignData.keyword;
    if (name) campaign.campaignName = name;
    if (source) campaign.campaignSource = source;
    if (medium) campaign.campaignMedium = medium;
    if (content) campaign.campaignContent = content;
    if (keyword) campaign.campaignKeyword = keyword;
    return campaign;
}
/* Todo add includeSearch options ¯\_(ツ)_/¯
function getPagePath(props, opts = {}) {
  if (!props) return
  if (opts.includeSearch && props.search) {
    return `${props.path}${props.search}`
  }
  return props.path
}
*/ // properties, data=opts
function formatObjectIntoDimensions$1(properties) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var customDimensions = opts.customDimensions; // TODO map opts.customMetrics; Object.keys(customMetrics) { key: 'metric1' }
    // TODO map opts.contentGroupings; Object.keys(contentGroupings) { key: 'contentGroup1' }
    /* Map values from payload to any defined custom dimensions */ return Object.keys(customDimensions).reduce(function(acc, key) {
        var dimensionKey = customDimensions[key];
        var value = get$1(properties, key) || properties[key];
        if (typeof value === "boolean") value = value.toString();
        if (value || value === 0) {
            acc[dimensionKey] = value;
            return acc;
        }
        return acc;
    }, {});
}
function get$1(obj, key, def, p, undef) {
    key = key.split ? key.split(".") : key;
    for(p = 0; p < key.length; p++)obj = obj ? obj[key[p]] : undef;
    return obj === undef ? def : obj;
}
function setCustomDimensions() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var opts = arguments.length > 1 ? arguments[1] : undefined;
    var instancePrefix = arguments.length > 2 ? arguments[2] : undefined;
    var customDimensions = formatObjectIntoDimensions$1(props, opts);
    if (!Object.keys(customDimensions).length) return {};
     // If setCustomDimensionsToPage false, don't save custom dimensions from event to page
    if (!opts.setCustomDimensionsToPage) return customDimensions;
     // Set custom dimensions
    ga("".concat(instancePrefix, "set"), customDimensions);
    return {};
}
/**
 * Identify a visitor by Id
 * @param  {string} id - unique visitor ID
 */ function identifyVisitor$1(id) {
    var traits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (gaNotLoaded()) return;
    var _getInstanceDetails3 = getInstanceDetails(conf), instancePrefix = _getInstanceDetails3.instancePrefix;
    if (id) ga("".concat(instancePrefix, "set"), "userId", id);
    if (Object.keys(traits).length) {
        var custom = formatObjectIntoDimensions$1(traits, conf);
        ga("".concat(instancePrefix, "set"), custom);
    }
}
function scriptLoaded(scriptSrc) {
    var scripts = document.querySelectorAll("script[src]");
    return !!Object.keys(scripts).filter(function(key) {
        return (scripts[key].src || "") === scriptSrc;
    }).length;
}
function format(value) {
    if (!value || value < 0) return 0;
    return Math.round(value);
}
var browser = /*#__PURE__*/ Object.freeze({
    default: googleAnalytics$1,
    trackEvent: trackEvent$1,
    identifyVisitor: identifyVisitor$1
});
/* This module will shake out unused code + work in browser and node 🎉 */ var index = googleAnalytics$1;
/* init for CDN usage. globalName.init() */ var init = googleAnalytics$1;
/* Standalone API */ var initialize$1 = undefined;
var page = undefined;
var track = trackEvent$1;
var identify = identifyVisitor$1;
exports.default = index;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["7Sxqs"], null, "parcelRequireaaed")

//# sourceMappingURL=reporting.87270bcb.js.map
