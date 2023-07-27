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
})({"2gwYA":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "265a7e0c7356368e";
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

},{}],"8GSE2":[function(require,module,exports) {
/**
 * Looking Glass Portrait Display
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Three JS Based with Web VR renderer
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */ parcelHelpers.export(exports, "DisplayLookingGlass3D", ()=>DisplayLookingGlass3D);
var _displayAbstract = require("./display-abstract");
var _tasksVision = require("@mediapipe/tasks-vision");
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
var _webxr = require("@lookingglass/webxr");
var _threeJs = require("three/src/Three.js");
var _vrbuttonJs = require("three/examples/jsm/webxr/VRButton.js");
var _displayWebgl3D = require("./display-webgl-3d");
class DisplayLookingGlass3D extends (0, _displayWebgl3D.DisplayWebGL3D) {
    constructor(canvas, initialWidth, initialHeight, keypointQuantity = 478){
        super(canvas, initialWidth, initialHeight, keypointQuantity);
        // set up Portrait
        const config = (0, _webxr.LookingGlassConfig);
        config.tileHeight = 512;
        config.numViews = 45;
        config.targetY = 0;
        config.targetZ = 0;
        config.targetDiam = 3;
        config.fovy = 14 * Math.PI / 180;
        new (0, _webxr.LookingGlassWebXRPolyfill)();
        // Neccessary
        this.renderer.xr.enabled = true;
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.toneMappingExposure = 1;
        // this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.append((0, _vrbuttonJs.VRButton).createButton(renderer));
        this.available = true;
    }
}

},{"./display-abstract":"fgqcQ","@mediapipe/tasks-vision":"e5Mjq","@lookingglass/webxr":"2LQVy","three/src/Three.js":"aH4hF","three/examples/jsm/webxr/VRButton.js":"kkyG4","./display-webgl-3d":"44DAj","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2LQVy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LookingGlassConfig", ()=>Xe);
parcelHelpers.export(exports, "LookingGlassWebXRPolyfill", ()=>$);
var _index = require("@lookingglass/webxr-polyfill/src/api/index");
var _indexDefault = parcelHelpers.interopDefault(_index);
var _xrsystem = require("@lookingglass/webxr-polyfill/src/api/XRSystem");
var _xrsystemDefault = parcelHelpers.interopDefault(_xrsystem);
var _webXRPolyfill = require("@lookingglass/webxr-polyfill/src/WebXRPolyfill");
var _webXRPolyfillDefault = parcelHelpers.interopDefault(_webXRPolyfill);
var _holoplayCore = require("holoplay-core");
var _xrdevice = require("@lookingglass/webxr-polyfill/src/devices/XRDevice");
var _xrdeviceDefault = parcelHelpers.interopDefault(_xrdevice);
var _xrspace = require("@lookingglass/webxr-polyfill/src/api/XRSpace");
var _xrspaceDefault = parcelHelpers.interopDefault(_xrspace);
var _glMatrix = require("gl-matrix");
var _xrwebGLLayer = require("@lookingglass/webxr-polyfill/src/api/XRWebGLLayer");
var _xrwebGLLayerDefault = parcelHelpers.interopDefault(_xrwebGLLayer);
var ce = Object.defineProperty;
var ue = (n, i, e)=>i in n ? ce(n, i, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e
    }) : n[i] = e;
var R = (n, i, e)=>(ue(n, typeof i != "symbol" ? i + "" : i, e), e);
const H = 1.6;
var O;
(function(n) {
    n[n.Swizzled = 0] = "Swizzled", n[n.Center = 1] = "Center", n[n.Quilt = 2] = "Quilt";
})(O || (O = {}));
class we extends EventTarget {
    constructor(e){
        super();
        R(this, "_calibration", {
            configVersion: "1.0",
            pitch: {
                value: 45
            },
            slope: {
                value: -5
            },
            center: {
                value: -0.5
            },
            viewCone: {
                value: 40
            },
            invView: {
                value: 1
            },
            verticalAngle: {
                value: 0
            },
            DPI: {
                value: 338
            },
            screenW: {
                value: 250
            },
            screenH: {
                value: 250
            },
            flipImageX: {
                value: 0
            },
            flipImageY: {
                value: 0
            },
            flipSubp: {
                value: 0
            },
            serial: "LKG-DEFAULT-#####"
        });
        R(this, "_viewControls", {
            tileHeight: 512,
            numViews: 48,
            trackballX: 0,
            trackballY: 0,
            targetX: 0,
            targetY: H,
            targetZ: -0.5,
            targetDiam: 2,
            fovy: 13 / 180 * Math.PI,
            depthiness: 1.25,
            inlineView: O.Center,
            capturing: !1,
            quiltResolution: 3840,
            popup: null,
            XRSession: null,
            lkgCanvas: null,
            appCanvas: null
        });
        R(this, "LookingGlassDetected");
        this._viewControls = {
            ...this._viewControls,
            ...e
        }, this.syncCalibration();
    }
    syncCalibration() {
        new _holoplayCore.Client((e)=>{
            if (e.devices.length < 1) {
                console.log("No Looking Glass devices found");
                return;
            }
            e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
        });
    }
    addEventListener(e, s, t) {
        super.addEventListener(e, s, t);
    }
    onConfigChange() {
        this.dispatchEvent(new Event("on-config-changed"));
    }
    get calibration() {
        return this._calibration;
    }
    set calibration(e) {
        this._calibration = {
            ...this._calibration,
            ...e
        }, this.onConfigChange();
    }
    updateViewControls(e) {
        e != null && (this._viewControls = {
            ...this._viewControls,
            ...e
        }, this.onConfigChange());
    }
    get tileHeight() {
        return Math.round(this.framebufferHeight / this.quiltHeight);
    }
    get quiltResolution() {
        return this._viewControls.quiltResolution;
    }
    set quiltResolution(e) {
        this.updateViewControls({
            quiltResolution: e
        });
    }
    get numViews() {
        return this.quiltWidth * this.quiltHeight;
    }
    get targetX() {
        return this._viewControls.targetX;
    }
    set targetX(e) {
        this.updateViewControls({
            targetX: e
        });
    }
    get targetY() {
        return this._viewControls.targetY;
    }
    set targetY(e) {
        this.updateViewControls({
            targetY: e
        });
    }
    get targetZ() {
        return this._viewControls.targetZ;
    }
    set targetZ(e) {
        this.updateViewControls({
            targetZ: e
        });
    }
    get trackballX() {
        return this._viewControls.trackballX;
    }
    set trackballX(e) {
        this.updateViewControls({
            trackballX: e
        });
    }
    get trackballY() {
        return this._viewControls.trackballY;
    }
    set trackballY(e) {
        this.updateViewControls({
            trackballY: e
        });
    }
    get targetDiam() {
        return this._viewControls.targetDiam;
    }
    set targetDiam(e) {
        this.updateViewControls({
            targetDiam: e
        });
    }
    get fovy() {
        return this._viewControls.fovy;
    }
    set fovy(e) {
        this.updateViewControls({
            fovy: e
        });
    }
    get depthiness() {
        return this._viewControls.depthiness;
    }
    set depthiness(e) {
        this.updateViewControls({
            depthiness: e
        });
    }
    get inlineView() {
        return this._viewControls.inlineView;
    }
    set inlineView(e) {
        this.updateViewControls({
            inlineView: e
        });
    }
    get capturing() {
        return this._viewControls.capturing;
    }
    set capturing(e) {
        this.updateViewControls({
            capturing: e
        });
    }
    get popup() {
        return this._viewControls.popup;
    }
    set popup(e) {
        this.updateViewControls({
            popup: e
        });
    }
    get XRSession() {
        return this._viewControls.XRSession;
    }
    set XRSession(e) {
        this.updateViewControls({
            XRSession: e
        });
    }
    get lkgCanvas() {
        return this._viewControls.lkgCanvas;
    }
    set lkgCanvas(e) {
        this.updateViewControls({
            lkgCanvas: e
        });
    }
    get appCanvas() {
        return this._viewControls.appCanvas;
    }
    set appCanvas(e) {
        this.updateViewControls({
            appCanvas: e
        });
    }
    get aspect() {
        return this._calibration.screenW.value / this._calibration.screenH.value;
    }
    get tileWidth() {
        return Math.round(this.framebufferWidth / this.quiltWidth);
    }
    get framebufferWidth() {
        return this._calibration.screenW.value < 7e3 ? this._viewControls.quiltResolution : 7680;
    }
    get quiltWidth() {
        return this.calibration.screenW.value == 1536 ? 8 : this.calibration.screenW.value == 3840 || this.calibration.screenW.value > 7e3 ? 5 : 8;
    }
    get quiltHeight() {
        return this.calibration.screenW.value == 1536 ? 6 : this.calibration.screenW.value == 3840 || this.calibration.screenW.value > 7e3 ? 9 : 6;
    }
    get framebufferHeight() {
        return this._calibration.screenW.value < 7e3 ? this._viewControls.quiltResolution : 4320;
    }
    get viewCone() {
        return this._calibration.viewCone.value * this.depthiness / 180 * Math.PI;
    }
    get tilt() {
        return this._calibration.screenH.value / (this._calibration.screenW.value * this._calibration.slope.value) * (this._calibration.flipImageX.value ? -1 : 1);
    }
    set tilt(e) {}
    get subp() {
        return 1 / (this._calibration.screenW.value * 3);
    }
    get pitch() {
        const e = this._calibration.screenW.value / this._calibration.DPI.value;
        return this._calibration.pitch.value * e * Math.cos(Math.atan(1 / this._calibration.slope.value));
    }
}
let U = null;
function F() {
    return U == null && (U = new we()), U;
}
function z(n) {
    const i = F();
    n != null && i.updateViewControls(n);
}
async function Ee() {
    const n = F();
    let i = 2;
    function e() {
        if (n.appCanvas != null) try {
            let t = n.appCanvas.toDataURL();
            const o = document.createElement("a");
            o.style.display = "none", o.href = t, o.download = `hologram_qs${n.quiltWidth}x${n.quiltHeight}a${n.aspect}.png`, document.body.appendChild(o), o.click(), document.body.removeChild(o), window.URL.revokeObjectURL(t);
        } catch (t) {
            console.error("Error while capturing canvas data:", t);
        } finally{
            n.inlineView = i;
        }
    }
    const s = document.getElementById("screenshotbutton");
    s && s.addEventListener("click", ()=>{
        i = n.inlineView;
        const t = V.getInstance();
        if (!t) {
            console.warn("LookingGlassXRDevice not initialized");
            return;
        }
        n.inlineView = 2, t.captureScreenshot = !0, setTimeout(()=>{
            t.screenshotCallback = e;
        }, 100);
    });
}
function ye() {
    var i;
    const n = F();
    if (console.log(n, "for debugging purposes"), n.lkgCanvas == null) console.warn("window placement called without a valid XR Session!");
    else {
        let e = function() {
            let r = v.d - v.a, c = v.w - v.s;
            r && c && (r *= Math.sqrt(0.5), c *= Math.sqrt(0.5));
            const u = n.trackballX, f = n.trackballY, y = Math.cos(u) * r - Math.sin(u) * Math.cos(f) * c, S = -Math.sin(f) * c, _ = -Math.sin(u) * r - Math.cos(u) * Math.cos(f) * c;
            n.targetX = n.targetX + y * n.targetDiam * 0.03, n.targetY = n.targetY + S * n.targetDiam * 0.03, n.targetZ = n.targetZ + _ * n.targetDiam * 0.03, requestAnimationFrame(e);
        };
        const s = document.createElement("style");
        document.head.appendChild(s), (i = s.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
        const t = document.createElement("div");
        t.id = "LookingGlassWebXRControls", t.style.position = "fixed", t.style.zIndex = "1000", t.style.padding = "15px", t.style.width = "320px", t.style.maxWidth = "calc(100vw - 18px)", t.style.maxHeight = "calc(100vh - 18px)", t.style.whiteSpace = "nowrap", t.style.background = "rgba(0, 0, 0, 0.6)", t.style.color = "white", t.style.borderRadius = "10px", t.style.right = "15px", t.style.bottom = "15px", t.style.flex = "row";
        const o = document.createElement("div");
        t.appendChild(o), o.style.width = "100%", o.style.textAlign = "center", o.style.fontWeight = "bold", o.style.marginBottom = "8px", o.innerText = "Looking Glass Controls";
        const l = document.createElement("button");
        l.style.display = "block", l.style.margin = "auto", l.style.width = "100%", l.style.height = "35px", l.style.padding = "4px", l.style.marginBottom = "8px", l.style.borderRadius = "8px", l.id = "screenshotbutton", t.appendChild(l), l.innerText = "Save Hologram";
        const h = document.createElement("button");
        h.style.display = "block", h.style.margin = "auto", h.style.width = "100%", h.style.height = "35px", h.style.padding = "4px", h.style.marginBottom = "8px", h.style.borderRadius = "8px", h.id = "copybutton", t.appendChild(h), h.innerText = "Copy Config", h.addEventListener("click", ()=>{
            ge(n);
        });
        const p = document.createElement("div");
        t.appendChild(p), p.style.width = "290px", p.style.whiteSpace = "normal", p.style.color = "rgba(255,255,255,0.7)", p.style.fontSize = "14px", p.style.margin = "5px 0", p.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
        const M = document.createElement("div");
        t.appendChild(M);
        const x = (r, c, u)=>{
            const f = u.stringify, y = document.createElement("div");
            y.style.marginBottom = "8px", M.appendChild(y);
            const S = r, _ = n[r], w = document.createElement("label");
            y.appendChild(w), w.innerText = u.label, w.setAttribute("for", S), w.style.width = "100px", w.style.display = "inline-block", w.style.textDecoration = "dotted underline 1px", w.style.fontFamily = '"Courier New"', w.style.fontSize = "13px", w.style.fontWeight = "bold", w.title = u.title;
            const m = document.createElement("input");
            y.appendChild(m), Object.assign(m, c), m.id = S, m.title = u.title, m.value = c.value !== void 0 ? c.value : _;
            const I = (b)=>{
                n[r] = b, P(b);
            };
            m.oninput = ()=>{
                const b = c.type === "range" ? parseFloat(m.value) : c.type === "checkbox" ? m.checked : m.value;
                I(b);
            };
            const A = (b)=>{
                let k = b(n[r]);
                u.fixRange && (k = u.fixRange(k), m.max = Math.max(parseFloat(m.max), k).toString(), m.min = Math.min(parseFloat(m.min), k).toString()), m.value = k, I(k);
            };
            c.type === "range" && (m.style.width = "110px", m.style.height = "8px", m.onwheel = (b)=>{
                A((k)=>k + Math.sign(b.deltaX - b.deltaY) * c.step);
            });
            let P = (b)=>{};
            if (f) {
                const b = document.createElement("span");
                b.style.fontFamily = '"Courier New"', b.style.fontSize = "13px", b.style.marginLeft = "3px", y.appendChild(b), P = (k)=>{
                    b.innerHTML = f(k);
                }, P(_);
            }
            return A;
        };
        x("fovy", {
            type: "range",
            min: 1 / 180 * Math.PI,
            max: 120.1 / 180 * Math.PI,
            step: 1 / 180 * Math.PI
        }, {
            label: "fov",
            title: "perspective fov (degrades stereo effect)",
            fixRange: (r)=>Math.max(1 / 180 * Math.PI, Math.min(r, 120.1 / 180 * Math.PI)),
            stringify: (r)=>{
                const c = r / Math.PI * 180, u = Math.atan(Math.tan(r / 2) * n.aspect) * 2 / Math.PI * 180;
                return `${c.toFixed()}&deg;&times;${u.toFixed()}&deg;`;
            }
        }), x("depthiness", {
            type: "range",
            min: 0,
            max: 2,
            step: 0.01
        }, {
            label: "depthiness",
            title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
            fixRange: (r)=>Math.max(0, r),
            stringify: (r)=>`${r.toFixed(2)}x`
        }), x("inlineView", {
            type: "range",
            min: 0,
            max: 2,
            step: 1
        }, {
            label: "inline view",
            title: "what to show inline on the original canvas (swizzled = no overwrite)",
            fixRange: (r)=>Math.max(0, Math.min(r, 2)),
            stringify: (r)=>r === 0 ? "swizzled" : r === 1 ? "center" : r === 2 ? "quilt" : "?"
        }), n.lkgCanvas.oncontextmenu = (r)=>{
            r.preventDefault();
        }, n.lkgCanvas.addEventListener("wheel", (r)=>{
            const c = n.targetDiam, u = 1.1, f = Math.log(c) / Math.log(u);
            return n.targetDiam = Math.pow(u, f + r.deltaY * 0.01);
        }), n.lkgCanvas.addEventListener("mousemove", (r)=>{
            const c = r.movementX, u = -r.movementY;
            if (r.buttons & 2 || r.buttons & 1 && (r.shiftKey || r.ctrlKey)) {
                const f = n.trackballX, y = n.trackballY, S = -Math.cos(f) * c + Math.sin(f) * Math.sin(y) * u, _ = -Math.cos(y) * u, w = Math.sin(f) * c + Math.cos(f) * Math.sin(y) * u;
                n.targetX = n.targetX + S * n.targetDiam * 1e-3, n.targetY = n.targetY + _ * n.targetDiam * 1e-3, n.targetZ = n.targetZ + w * n.targetDiam * 1e-3;
            } else r.buttons & 1 && (n.trackballX = n.trackballX - c * 0.01, n.trackballY = n.trackballY - u * 0.01);
        });
        const v = {
            w: 0,
            a: 0,
            s: 0,
            d: 0
        };
        return n.lkgCanvas.addEventListener("keydown", (r)=>{
            switch(r.code){
                case "KeyW":
                    v.w = 1;
                    break;
                case "KeyA":
                    v.a = 1;
                    break;
                case "KeyS":
                    v.s = 1;
                    break;
                case "KeyD":
                    v.d = 1;
                    break;
            }
        }), n.lkgCanvas.addEventListener("keyup", (r)=>{
            switch(r.code){
                case "KeyW":
                    v.w = 0;
                    break;
                case "KeyA":
                    v.a = 0;
                    break;
                case "KeyS":
                    v.s = 0;
                    break;
                case "KeyD":
                    v.d = 0;
                    break;
            }
        }), requestAnimationFrame(e), setTimeout(()=>{
            Ee();
        }, 1e3), t;
    }
}
function ge(n) {
    const i = {
        targetX: n.targetX,
        targetY: n.targetY,
        targetZ: n.targetZ,
        fovy: `${Math.round(n.fovy / Math.PI * 180)} * Math.PI / 180`,
        targetDiam: n.targetDiam,
        trackballX: n.trackballX,
        trackballY: n.trackballY,
        depthiness: n.depthiness
    };
    let e = JSON.stringify(i, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
    navigator.clipboard.writeText(e);
}
let G;
const Ce = (n, i)=>{
    const e = F();
    if (e.lkgCanvas == null) {
        console.warn("window placement called without a valid XR Session!");
        return;
    } else if (n == !1) Te(e, G);
    else {
        G == null && (G = ye()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(G);
        const s = "getScreenDetails" in window;
        console.log(s, "Screen placement API exists"), s ? Re(e.lkgCanvas, e, i) : K(e, e.lkgCanvas, i);
    }
};
async function Re(n, i, e) {
    const s = await window.getScreenDetails();
    console.log(s);
    const t = s.screens.filter((o)=>o.label.includes("LKG"))[0];
    if (console.log(t, "monitors"), t === void 0) {
        console.log("no Looking Glass monitor detected - manually opening popup window"), K(i, n, e);
        return;
    } else {
        console.log("monitor ID", t.label, "serial number", i.calibration);
        const o = [
            `left=${t.left}`,
            `top=${t.top}`,
            `width=${t.width}`,
            `height=${t.height}`,
            "menubar=no",
            "toolbar=no",
            "location=no",
            "status=no",
            "resizable=yes",
            "scrollbars=no",
            "fullscreenEnabled=true"
        ].join(",");
        i.popup = window.open("", "new", o), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.style.transform = "1.0", j(i), i.popup.document.body.appendChild(n), console.assert(e), i.popup.onbeforeunload = e);
    }
}
function K(n, i, e) {
    n.popup = window.open("", void 0, "width=640,height=360"), n.popup && (n.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", n.popup.document.body.style.background = "black", n.popup.document.body.style.transform = "1.0", j(n), n.popup.document.body.appendChild(i), console.assert(e), n.popup.onbeforeunload = e);
}
function Te(n, i) {
    var e;
    (e = i.parentElement) == null || e.removeChild(i), n.popup && (n.popup.onbeforeunload = null, n.popup.close(), n.popup = null);
}
function j(n) {
    n.popup && n.popup.document.addEventListener("keydown", (i)=>{
        i.ctrlKey && (i.key === "=" || i.key === "-" || i.key === "+") && i.preventDefault();
    });
}
const B = Symbol("LookingGlassXRWebGLLayer");
class xe extends (0, _xrwebGLLayerDefault.default) {
    constructor(i, e, s){
        super(i, e, s);
        const t = F();
        t.appCanvas = e.canvas, t.lkgCanvas = document.createElement("canvas"), t.lkgCanvas.tabIndex = 0;
        const o = t.lkgCanvas.getContext("2d", {
            alpha: !1
        });
        t.lkgCanvas.addEventListener("dblclick", function() {
            this.requestFullscreen();
        });
        const l = this[0, _xrwebGLLayer.PRIVATE].config, h = e.createTexture();
        let p, M;
        const x = e.createFramebuffer(), v = e.getExtension("OES_vertex_array_object"), r = 34229, c = v ? v.bindVertexArrayOES.bind(v) : e.bindVertexArray.bind(e);
        (l.depth || l.stencil) && (l.depth && l.stencil ? M = {
            format: e.DEPTH_STENCIL,
            attachment: e.DEPTH_STENCIL_ATTACHMENT
        } : l.depth ? M = {
            format: e.DEPTH_COMPONENT16,
            attachment: e.DEPTH_ATTACHMENT
        } : l.stencil && (M = {
            format: e.STENCIL_INDEX8,
            attachment: e.STENCIL_ATTACHMENT
        }), p = e.createRenderbuffer());
        const u = (a, T, g, d, C)=>{
            f(a, T, C.framebufferWidth, C.framebufferHeight), g && y(a, g, d, C.framebufferWidth, C.framebufferHeight);
        }, f = (a, T, g, d)=>{
            const C = a.getParameter(a.TEXTURE_BINDING_2D);
            a.bindTexture(a.TEXTURE_2D, T), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, g, d, 0, a.RGBA, a.UNSIGNED_BYTE, null), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR), a.bindTexture(a.TEXTURE_2D, C);
        }, y = (a, T, g, d, C)=>{
            const L = a.getParameter(a.RENDERBUFFER_BINDING);
            a.bindRenderbuffer(a.RENDERBUFFER, T), a.renderbufferStorage(a.RENDERBUFFER, g.format, d, C), a.bindRenderbuffer(a.RENDERBUFFER, L);
        }, S = (a, T, g, d, C, L)=>{
            const X = a.getParameter(a.FRAMEBUFFER_BINDING);
            a.bindFramebuffer(a.FRAMEBUFFER, T), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, g, 0), (L.depth || L.stencil) && a.framebufferRenderbuffer(a.FRAMEBUFFER, d.attachment, a.RENDERBUFFER, C), a.bindFramebuffer(a.FRAMEBUFFER, X);
        };
        u(e, h, p, M, t), t.addEventListener("on-config-changed", ()=>u(e, h, p, M, t)), S(e, x, h, M, p, l);
        const _ = `
		attribute vec2 a_position;
		varying vec2 v_texcoord;
		void main() {
		  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
		  v_texcoord = a_position;
		}
	  `;
        function w(a, T, g) {
            const d = a.createShader(T);
            return a.shaderSource(d, g), a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) ? d : (console.warn(a.getShaderInfoLog(d)), null);
        }
        function m(a, T, g) {
            let d = a.createProgram();
            const C = w(a, a.VERTEX_SHADER, T), L = w(a, a.FRAGMENT_SHADER, g);
            return C === null || L === null ? (console.error("There was a problem with shader construction"), null) : (a.attachShader(d, C), a.attachShader(d, L), a.linkProgram(d), a.getProgramParameter(d, a.LINK_STATUS) ? d : (console.warn(a.getProgramInfoLog(d)), null));
        }
        let I, A, P, b;
        const k = (a, T, g)=>{
            const d = g(T);
            if (d === A) return;
            A = d;
            const C = w(a, a.FRAGMENT_SHADER, d);
            if (C === null) return;
            I && a.deleteShader(I), I = C;
            const L = m(a, _, d);
            if (L === null) {
                console.warn("There was a problem with shader construction");
                return;
            }
            P = a.getAttribLocation(L, "a_position"), b = a.getUniformLocation(L, "u_viewType");
            const X = a.getUniformLocation(L, "u_texture"), le = a.getParameter(a.CURRENT_PROGRAM);
            a.useProgram(L), a.uniform1i(X, 0), a.useProgram(le), D && a.deleteProgram(D), D = L;
        };
        console.log((0, _holoplayCore.Shader)(t));
        let D = m(e, _, (0, _holoplayCore.Shader)(t));
        D === null && console.warn("There was a problem with shader construction"), t.addEventListener("on-config-changed", ()=>{
            k(e, t, (0, _holoplayCore.Shader));
        });
        const Y = v ? v.createVertexArrayOES() : e.createVertexArray(), Z = e.createBuffer(), Q = e.getParameter(e.ARRAY_BUFFER_BINDING), J = e.getParameter(r);
        c(Y), e.bindBuffer(e.ARRAY_BUFFER, Z), e.bufferData(e.ARRAY_BUFFER, new Float32Array([
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1
        ]), e.STATIC_DRAW), e.enableVertexAttribArray(P), e.vertexAttribPointer(P, 2, e.FLOAT, !1, 0, 0), c(J), e.bindBuffer(e.ARRAY_BUFFER, Q);
        const ee = ()=>{
            console.assert(this[B].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
            const a = e.getParameter(e.COLOR_CLEAR_VALUE), T = e.getParameter(e.DEPTH_CLEAR_VALUE), g = e.getParameter(e.STENCIL_CLEAR_VALUE);
            e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(a[0], a[1], a[2], a[3]), e.clearDepth(T), e.clearStencil(g);
        };
        function te() {
            if (!t.appCanvas || !t.lkgCanvas) return;
            (t.appCanvas.width !== t.framebufferWidth || t.appCanvas.height !== t.framebufferHeight) && (t.appCanvas.width, t.appCanvas.height, t.appCanvas.width = t.framebufferWidth, t.appCanvas.height = t.framebufferHeight);
            const a = ie();
            ae(), re(), se(), oe(), ne(a);
        }
        function ne(a) {
            e.activeTexture(a.activeTexture), e.bindTexture(e.TEXTURE_2D, a.textureBinding), e.useProgram(a.program), e.bindRenderbuffer(e.RENDERBUFFER, a.renderbufferBinding), e.bindFramebuffer(e.FRAMEBUFFER, a.framebufferBinding), a.scissorTest ? e.enable(e.SCISSOR_TEST) : e.disable(e.SCISSOR_TEST), a.stencilTest ? e.enable(e.STENCIL_TEST) : e.disable(e.STENCIL_TEST), a.depthTest ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST), a.blend ? e.enable(e.BLEND) : e.disable(e.BLEND), a.cullFace ? e.enable(e.CULL_FACE) : e.disable(e.CULL_FACE), c(a.VAO);
        }
        function ie() {
            return {
                VAO: e.getParameter(e.VERTEX_ARRAY_BINDING),
                cullFace: e.getParameter(e.CULL_FACE),
                blend: e.getParameter(e.BLEND),
                depthTest: e.getParameter(e.DEPTH_TEST),
                stencilTest: e.getParameter(e.STENCIL_TEST),
                scissorTest: e.getParameter(e.SCISSOR_TEST),
                viewport: e.getParameter(e.VIEWPORT),
                framebufferBinding: e.getParameter(e.FRAMEBUFFER_BINDING),
                renderbufferBinding: e.getParameter(e.RENDERBUFFER_BINDING),
                program: e.getParameter(e.CURRENT_PROGRAM),
                activeTexture: e.getParameter(e.ACTIVE_TEXTURE),
                textureBinding: e.getParameter(e.TEXTURE_BINDING_2D)
            };
        }
        function ae() {
            e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(D), c(Y), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, h), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight);
        }
        function re() {
            e.uniform1i(b, 0), e.drawArrays(e.TRIANGLES, 0, 6);
        }
        function se() {
            if (!t.lkgCanvas || !t.appCanvas) {
                console.warn("Looking Glass Canvas is not defined");
                return;
            }
            o == null || o.clearRect(0, 0, t.lkgCanvas.width, t.lkgCanvas.height), o == null || o.drawImage(t.appCanvas, 0, 0, t.framebufferWidth, t.framebufferHeight, 0, 0, t.calibration.screenW.value, t.calibration.screenH.value);
        }
        function oe() {
            if (!t.appCanvas) {
                console.warn("Looking Glass Canvas is not defined");
                return;
            }
            t.inlineView !== 0 && (t.capturing && t.appCanvas.width !== t.framebufferWidth && (t.appCanvas.width = t.framebufferWidth, t.appCanvas.height = t.framebufferHeight, e.viewport(0, 0, t.framebufferHeight, t.framebufferWidth)), e.uniform1i(b, t.inlineView), e.drawArrays(e.TRIANGLES, 0, 6));
        }
        window.addEventListener("unload", ()=>{
            t.popup && t.popup.close(), t.popup = null;
        }), this[B] = {
            LookingGlassEnabled: !1,
            framebuffer: x,
            clearFramebuffer: ee,
            blitTextureToDefaultFramebufferIfNeeded: te,
            moveCanvasToWindow: Ce
        };
    }
    get framebuffer() {
        return this[B].LookingGlassEnabled ? this[B].framebuffer : null;
    }
    get framebufferWidth() {
        return F().framebufferWidth;
    }
    get framebufferHeight() {
        return F().framebufferHeight;
    }
}
const N = class extends (0, _xrdeviceDefault.default) {
    constructor(i){
        super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = (0, _glMatrix.mat4).create(), this.inlineProjectionMatrix = (0, _glMatrix.mat4).create(), this.inlineInverseViewMatrix = (0, _glMatrix.mat4).create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, N.instance || (N.instance = this);
    }
    static getInstance() {
        return N.instance;
    }
    onBaseLayerSet(i, e) {
        const s = this.sessions.get(i);
        s.baseLayer = e;
        const t = F(), o = e[B];
        o.LookingGlassEnabled = s.immersive, s.immersive && (t.XRSession = this.sessions.get(i), t.popup == null ? o.moveCanvasToWindow(!0, ()=>{
            this.endSession(i);
        }) : console.warn("attempted to assign baselayer twice?"));
    }
    isSessionSupported(i) {
        return i === "inline" || i === "immersive-vr";
    }
    isFeatureSupported(i) {
        switch(i){
            case "viewer":
                return !0;
            case "local":
                return !0;
            case "local-floor":
                return !0;
            case "bounded-floor":
                return !1;
            case "unbounded":
                return !1;
            default:
                return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", i), !1;
        }
    }
    async requestSession(i, e) {
        if (!this.isSessionSupported(i)) return Promise.reject();
        const s = i !== "inline", t = new _e(i, e);
        return this.sessions.set(t.id, t), s && this.dispatchEvent("@@webxr-polyfill/vr-present-start", t.id), Promise.resolve(t.id);
    }
    requestAnimationFrame(i) {
        return this.global.requestAnimationFrame(i);
    }
    cancelAnimationFrame(i) {
        this.global.cancelAnimationFrame(i);
    }
    onFrameStart(i, e) {
        const s = this.sessions.get(i), t = F();
        if (s.immersive) {
            const o = Math.tan(0.5 * t.fovy), l = 0.5 * t.targetDiam / o, h = l - t.targetDiam, p = this.basePoseMatrix;
            (0, _glMatrix.mat4).fromTranslation(p, [
                t.targetX,
                t.targetY,
                t.targetZ
            ]), (0, _glMatrix.mat4).rotate(p, p, t.trackballX, [
                0,
                1,
                0
            ]), (0, _glMatrix.mat4).rotate(p, p, -t.trackballY, [
                1,
                0,
                0
            ]), (0, _glMatrix.mat4).translate(p, p, [
                0,
                0,
                l
            ]);
            for(let x = 0; x < t.numViews; ++x){
                const v = (x + 0.5) / t.numViews - 0.5, r = Math.tan(t.viewCone * v), c = l * r, u = this.LookingGlassInverseViewMatrices[x] = this.LookingGlassInverseViewMatrices[x] || (0, _glMatrix.mat4).create();
                (0, _glMatrix.mat4).translate(u, p, [
                    c,
                    0,
                    0
                ]), (0, _glMatrix.mat4).invert(u, u);
                const f = Math.max(h + e.depthNear, 0.01), y = h + e.depthFar, S = f * o, _ = S, w = -S, m = f * -r, I = t.aspect * S, A = m + I, P = m - I, b = this.LookingGlassProjectionMatrices[x] = this.LookingGlassProjectionMatrices[x] || (0, _glMatrix.mat4).create();
                (0, _glMatrix.mat4).set(b, 2 * f / (A - P), 0, 0, 0, 0, 2 * f / (_ - w), 0, 0, (A + P) / (A - P), (_ + w) / (_ - w), -(y + f) / (y - f), -1, 0, 0, -2 * y * f / (y - f), 0);
            }
            s.baseLayer[B].clearFramebuffer();
        } else {
            const o = s.baseLayer.context, l = o.drawingBufferWidth / o.drawingBufferHeight;
            (0, _glMatrix.mat4).perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, l, e.depthNear, e.depthFar), (0, _glMatrix.mat4).fromTranslation(this.basePoseMatrix, [
                0,
                H,
                0
            ]), (0, _glMatrix.mat4).invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
        }
    }
    onFrameEnd(i) {
        this.sessions.get(i).baseLayer[B].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
    }
    async requestFrameOfReferenceTransform(i, e) {
        const s = (0, _glMatrix.mat4).create();
        switch(i){
            case "viewer":
            case "local":
                return (0, _glMatrix.mat4).fromTranslation(s, [
                    0,
                    -H,
                    0
                ]), s;
            case "local-floor":
                return s;
            default:
                throw new Error("XRReferenceSpaceType not understood");
        }
    }
    endSession(i) {
        const e = this.sessions.get(i);
        e.immersive && e.baseLayer && (e.baseLayer[B].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
    }
    doesSessionSupportReferenceSpace(i, e) {
        const s = this.sessions.get(i);
        return s.ended ? !1 : s.enabledFeatures.has(e);
    }
    getViewSpaces(i) {
        if (i === "immersive-vr") {
            const e = F();
            for(let s = this.viewSpaces.length; s < e.numViews; ++s)this.viewSpaces[s] = new Se(s);
            return this.viewSpaces.length = e.numViews, this.viewSpaces;
        }
    }
    getViewport(i, e, s, t, o) {
        if (o === void 0) {
            const h = this.sessions.get(i).baseLayer.context;
            t.x = 0, t.y = 0, t.width = h.drawingBufferWidth, t.height = h.drawingBufferHeight;
        } else {
            const l = F(), h = o % l.quiltWidth, p = Math.floor(o / l.quiltWidth);
            t.x = l.framebufferWidth / l.quiltWidth * h, t.y = l.framebufferHeight / l.quiltHeight * p, t.width = l.framebufferWidth / l.quiltWidth, t.height = l.framebufferHeight / l.quiltHeight;
        }
        return !0;
    }
    getProjectionMatrix(i, e) {
        return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || (0, _glMatrix.mat4).create();
    }
    getBasePoseMatrix() {
        return this.basePoseMatrix;
    }
    getBaseViewMatrix() {
        return this.inlineInverseViewMatrix;
    }
    _getViewMatrixByIndex(i) {
        return this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || (0, _glMatrix.mat4).create();
    }
    getInputSources() {
        return [];
    }
    getInputPose(i, e, s) {
        return null;
    }
    onWindowResize() {}
};
let V = N;
R(V, "instance", null);
let Le = 0;
class _e {
    constructor(i, e){
        R(this, "mode");
        R(this, "immersive");
        R(this, "id");
        R(this, "baseLayer");
        R(this, "inlineVerticalFieldOfView");
        R(this, "ended");
        R(this, "enabledFeatures");
        this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++Le, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
    }
}
class Se extends (0, _xrspaceDefault.default) {
    constructor(e){
        super();
        R(this, "viewIndex");
        this.viewIndex = e;
    }
    get eye() {
        return "none";
    }
    _onPoseUpdate(e) {
        this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
    }
}
class $ extends (0, _webXRPolyfillDefault.default) {
    constructor(e){
        super();
        R(this, "vrButton");
        R(this, "device");
        R(this, "isPresenting", !1);
        z(e), this.loadPolyfill();
    }
    static async init(e) {
        new $(e);
    }
    async loadPolyfill() {
        this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
        for(const e in 0, _indexDefault.default)this.global[e] = (0, _indexDefault.default)[e];
        this.global.XRWebGLLayer = xe, this.injected = !0, this.device = new V(this.global), this.xr = new (0, _xrsystemDefault.default)(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
            value: this.xr,
            configurable: !0
        });
    }
    async overrideDefaultVRButton() {
        this.vrButton = await ke("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", ()=>{
            this.isPresenting = !0, this.updateVRButtonUI();
        }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", ()=>{
            this.isPresenting = !1, this.updateVRButtonUI();
        }), this.vrButton.addEventListener("click", (e)=>{
            this.updateVRButtonUI();
        }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
    }
    async updateVRButtonUI() {
        if (this.vrButton) {
            await Fe(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
            const e = 220;
            this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
        }
    }
    update(e) {
        z(e);
    }
}
async function ke(n) {
    return new Promise((i)=>{
        const e = new MutationObserver(function(s) {
            s.forEach(function(t) {
                t.addedNodes.forEach(function(o) {
                    const l = o;
                    l.id === n && (i(l), e.disconnect());
                });
            });
        });
        e.observe(document.body, {
            subtree: !1,
            childList: !0
        }), setTimeout(()=>{
            e.disconnect(), i(null);
        }, 5e3);
    });
}
function Fe(n) {
    return new Promise((i)=>setTimeout(i, n));
}
const Xe = F();

},{"@lookingglass/webxr-polyfill/src/api/index":"75ow1","@lookingglass/webxr-polyfill/src/api/XRSystem":"5KOdb","@lookingglass/webxr-polyfill/src/WebXRPolyfill":"juiof","holoplay-core":"5FvDr","@lookingglass/webxr-polyfill/src/devices/XRDevice":"3tJs9","@lookingglass/webxr-polyfill/src/api/XRSpace":"3TNNg","gl-matrix":"9Lecs","@lookingglass/webxr-polyfill/src/api/XRWebGLLayer":"4apJK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"75ow1":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _xrsystem = require("./XRSystem");
var _xrsystemDefault = parcelHelpers.interopDefault(_xrsystem);
var _xrsession = require("./XRSession");
var _xrsessionDefault = parcelHelpers.interopDefault(_xrsession);
var _xrsessionEvent = require("./XRSessionEvent");
var _xrsessionEventDefault = parcelHelpers.interopDefault(_xrsessionEvent);
var _xrframe = require("./XRFrame");
var _xrframeDefault = parcelHelpers.interopDefault(_xrframe);
var _xrview = require("./XRView");
var _xrviewDefault = parcelHelpers.interopDefault(_xrview);
var _xrviewport = require("./XRViewport");
var _xrviewportDefault = parcelHelpers.interopDefault(_xrviewport);
var _xrviewerPose = require("./XRViewerPose");
var _xrviewerPoseDefault = parcelHelpers.interopDefault(_xrviewerPose);
var _xrinputSource = require("./XRInputSource");
var _xrinputSourceDefault = parcelHelpers.interopDefault(_xrinputSource);
var _xrinputSourceEvent = require("./XRInputSourceEvent");
var _xrinputSourceEventDefault = parcelHelpers.interopDefault(_xrinputSourceEvent);
var _xrinputSourcesChangeEvent = require("./XRInputSourcesChangeEvent");
var _xrinputSourcesChangeEventDefault = parcelHelpers.interopDefault(_xrinputSourcesChangeEvent);
var _xrwebGLLayer = require("./XRWebGLLayer");
var _xrwebGLLayerDefault = parcelHelpers.interopDefault(_xrwebGLLayer);
var _xrspace = require("./XRSpace");
var _xrspaceDefault = parcelHelpers.interopDefault(_xrspace);
var _xrreferenceSpace = require("./XRReferenceSpace");
var _xrreferenceSpaceDefault = parcelHelpers.interopDefault(_xrreferenceSpace);
var _xrreferenceSpaceEvent = require("./XRReferenceSpaceEvent");
var _xrreferenceSpaceEventDefault = parcelHelpers.interopDefault(_xrreferenceSpaceEvent);
var _xrrenderState = require("./XRRenderState");
var _xrrenderStateDefault = parcelHelpers.interopDefault(_xrrenderState);
var _xrrigidTransform = require("./XRRigidTransform");
var _xrrigidTransformDefault = parcelHelpers.interopDefault(_xrrigidTransform);
var _xrpose = require("./XRPose");
var _xrposeDefault = parcelHelpers.interopDefault(_xrpose);
/**
 * Everything exposed here will also be attached to the window
 */ exports.default = {
    XRSystem: (0, _xrsystemDefault.default),
    XRSession: (0, _xrsessionDefault.default),
    XRSessionEvent: (0, _xrsessionEventDefault.default),
    XRFrame: (0, _xrframeDefault.default),
    XRView: (0, _xrviewDefault.default),
    XRViewport: (0, _xrviewportDefault.default),
    XRViewerPose: (0, _xrviewerPoseDefault.default),
    XRWebGLLayer: (0, _xrwebGLLayerDefault.default),
    XRSpace: (0, _xrspaceDefault.default),
    XRReferenceSpace: (0, _xrreferenceSpaceDefault.default),
    XRReferenceSpaceEvent: (0, _xrreferenceSpaceEventDefault.default),
    XRInputSource: (0, _xrinputSourceDefault.default),
    XRInputSourceEvent: (0, _xrinputSourceEventDefault.default),
    XRInputSourcesChangeEvent: (0, _xrinputSourcesChangeEventDefault.default),
    XRRenderState: (0, _xrrenderStateDefault.default),
    XRRigidTransform: (0, _xrrigidTransformDefault.default),
    XRPose: (0, _xrposeDefault.default)
};

},{"./XRSystem":"5KOdb","./XRSession":"4yNN0","./XRSessionEvent":"1ExMI","./XRFrame":"27BHo","./XRView":"lVtKL","./XRViewport":"h8Svb","./XRViewerPose":"isVmI","./XRInputSource":"eIB3M","./XRInputSourceEvent":"7yh8Y","./XRInputSourcesChangeEvent":"8IPvK","./XRWebGLLayer":"4apJK","./XRSpace":"3TNNg","./XRReferenceSpace":"iZoqC","./XRReferenceSpaceEvent":"fphje","./XRRenderState":"etcHN","./XRRigidTransform":"4fpYQ","./XRPose":"a3QIC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5KOdb":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
parcelHelpers.export(exports, "XRSessionModes", ()=>XRSessionModes);
var _eventTarget = require("../lib/EventTarget");
var _eventTargetDefault = parcelHelpers.interopDefault(_eventTarget);
var _xrreferenceSpace = require("./XRReferenceSpace");
const PRIVATE = Symbol("@@webxr-polyfill/XR");
const XRSessionModes = [
    "inline",
    "immersive-vr",
    "immersive-ar"
];
const DEFAULT_SESSION_OPTIONS = {
    "inline": {
        requiredFeatures: [
            "viewer"
        ],
        optionalFeatures: []
    },
    "immersive-vr": {
        requiredFeatures: [
            "viewer",
            "local"
        ],
        optionalFeatures: []
    },
    "immersive-ar": {
        requiredFeatures: [
            "viewer",
            "local"
        ],
        optionalFeatures: []
    }
};
const POLYFILL_REQUEST_SESSION_ERROR = `Polyfill Error: Must call navigator.xr.isSessionSupported() with any XRSessionMode
or navigator.xr.requestSession('inline') prior to requesting an immersive
session. This is a limitation specific to the WebXR Polyfill and does not apply
to native implementations of the API.`;
class XRSystem extends (0, _eventTargetDefault.default) {
    /**
   * Receives a promise of an XRDevice, so that the polyfill
   * can pass in some initial checks to asynchronously provide XRDevices
   * if content immediately requests `requestDevice()`.
   *
   * @param {Promise<XRDevice>} devicePromise
   */ constructor(devicePromise){
        super();
        this[PRIVATE] = {
            device: null,
            devicePromise,
            immersiveSession: null,
            inlineSessions: new Set()
        };
        devicePromise.then((device)=>{
            this[PRIVATE].device = device;
        });
    }
    /**
   * @param {XRSessionMode} mode
   * @return {Promise<boolean>}
   */ async isSessionSupported(mode) {
        // Always ensure that we wait for the device promise to resolve.
        if (!this[PRIVATE].device) await this[PRIVATE].devicePromise;
        // 'inline' is always guaranteed to be supported.
        if (mode != "inline") return Promise.resolve(this[PRIVATE].device.isSessionSupported(mode));
        return Promise.resolve(true);
    }
    /**
   * @param {XRSessionMode} mode
   * @param {XRSessionInit} options
   * @return {Promise<XRSession>}
   */ async requestSession(mode, options) {
        // If the device hasn't resolved yet, wait for it and try again.
        if (!this[PRIVATE].device) {
            if (mode != "inline") // Because requesting immersive modes requires a user gesture, we can't
            // wait for a promise to resolve before making the real session request.
            // For that reason, we'll throw a polyfill-specific error here.
            throw new Error(POLYFILL_REQUEST_SESSION_ERROR);
            else await this[PRIVATE].devicePromise;
        }
        if (!XRSessionModes.includes(mode)) throw new TypeError(`The provided value '${mode}' is not a valid enum value of type XRSessionMode`);
        // Resolve which of the requested features are supported and reject if a
        // required feature isn't available.
        const defaultOptions = DEFAULT_SESSION_OPTIONS[mode];
        const requiredFeatures = defaultOptions.requiredFeatures.concat(options && options.requiredFeatures ? options.requiredFeatures : []);
        const optionalFeatures = defaultOptions.optionalFeatures.concat(options && options.optionalFeatures ? options.optionalFeatures : []);
        const enabledFeatures = new Set();
        let requirementsFailed = false;
        for (let feature of requiredFeatures)if (!this[PRIVATE].device.isFeatureSupported(feature)) {
            console.error(`The required feature '${feature}' is not supported`);
            requirementsFailed = true;
        } else enabledFeatures.add(feature);
        if (requirementsFailed) throw new DOMException("Session does not support some required features", "NotSupportedError");
        for (let feature of optionalFeatures)if (!this[PRIVATE].device.isFeatureSupported(feature)) console.log(`The optional feature '${feature}' is not supported`);
        else enabledFeatures.add(feature);
        // Call device's requestSession, which does some initialization (1.1 
        // fallback calls `vrDisplay.requestPresent()` for example). Could throw 
        // due to missing user gesture.
        const sessionId = await this[PRIVATE].device.requestSession(mode, enabledFeatures);
        const session = new XRSession(this[PRIVATE].device, mode, sessionId);
        if (mode == "inline") this[PRIVATE].inlineSessions.add(session);
        else this[PRIVATE].immersiveSession = session;
        const onSessionEnd = ()=>{
            if (mode == "inline") this[PRIVATE].inlineSessions.delete(session);
            else this[PRIVATE].immersiveSession = null;
            session.removeEventListener("end", onSessionEnd);
        };
        session.addEventListener("end", onSessionEnd);
        return session;
    }
}
exports.default = XRSystem;

},{"../lib/EventTarget":"25tGW","./XRReferenceSpace":"iZoqC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"25tGW":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const PRIVATE = Symbol("@@webxr-polyfill/EventTarget");
class EventTarget {
    constructor(){
        this[PRIVATE] = {
            listeners: new Map()
        };
    }
    /**
   * @param {string} type
   * @param {Function} listener
   */ addEventListener(type, listener) {
        if (typeof type !== "string") throw new Error("`type` must be a string");
        if (typeof listener !== "function") throw new Error("`listener` must be a function");
        const typedListeners = this[PRIVATE].listeners.get(type) || [];
        typedListeners.push(listener);
        this[PRIVATE].listeners.set(type, typedListeners);
    }
    /**
   * @param {string} type
   * @param {Function} listener
   */ removeEventListener(type, listener) {
        if (typeof type !== "string") throw new Error("`type` must be a string");
        if (typeof listener !== "function") throw new Error("`listener` must be a function");
        const typedListeners = this[PRIVATE].listeners.get(type) || [];
        for(let i = typedListeners.length; i >= 0; i--)if (typedListeners[i] === listener) typedListeners.pop();
    }
    /**
   * @param {string} type
   * @param {object} event
   */ dispatchEvent(type, event) {
        const typedListeners = this[PRIVATE].listeners.get(type) || [];
        // Copy over all the listeners because a callback could remove
        // an event listener, preventing all listeners from firing when
        // the event was first dispatched.
        const queue = [];
        for(let i = 0; i < typedListeners.length; i++)queue[i] = typedListeners[i];
        for (let listener of queue)listener(event);
        // Also fire if this EventTarget has an `on${EVENT_TYPE}` property
        // that's a function
        if (typeof this[`on${type}`] === "function") this[`on${type}`](event);
    }
}
exports.default = EventTarget;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iZoqC":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
parcelHelpers.export(exports, "XRReferenceSpaceTypes", ()=>XRReferenceSpaceTypes);
var _xrspace = require("./XRSpace");
var _xrspaceDefault = parcelHelpers.interopDefault(_xrspace);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
const DEFAULT_EMULATION_HEIGHT = 1.6;
const PRIVATE = Symbol("@@webxr-polyfill/XRReferenceSpace");
const XRReferenceSpaceTypes = [
    "viewer",
    "local",
    "local-floor",
    "bounded-floor",
    "unbounded" // TODO: 'unbounded' is not supported by the polyfill.
];
/**
 * @param {string} type 
 * @return {boolean}
 */ function isFloor(type) {
    return type === "bounded-floor" || type === "local-floor";
}
class XRReferenceSpace extends (0, _xrspaceDefault.default) {
    /**
   * Optionally takes a `transform` from a device's requestFrameOfReferenceMatrix
   * so device's can provide their own transforms for stage (or if they
   * wanted to override eye-level/head-model).
   *
   * @param {XRReferenceSpaceType} type
   * @param {Float32Array?} transform
   */ constructor(type, transform = null){
        if (!XRReferenceSpaceTypes.includes(type)) throw new Error(`XRReferenceSpaceType must be one of ${XRReferenceSpaceTypes}`);
        super(type);
        // If stage emulation is disabled, and this is a stage frame of reference,
        // and the XRDevice did not provide a transform, this is an invalid
        // configuration and we shouldn't emulate here. XRSession.requestFrameOfReference
        // should check this as well.
        if (type === "bounded-floor" && !transform) throw new Error(`XRReferenceSpace cannot use 'bounded-floor' type if the platform does not provide the floor level`);
        // If we're using floor-level reference and no transform, we're emulating.
        // Set emulated height from option or use the default
        if (isFloor(type) && !transform) {
            // Apply an emulated height to the `y` translation
            transform = _mat4.identity(new Float32Array(16));
            transform[13] = DEFAULT_EMULATION_HEIGHT;
        }
        this._inverseBaseMatrix = transform || _mat4.identity(new Float32Array(16));
        this[PRIVATE] = {
            type,
            transform,
            originOffset: _mat4.identity(new Float32Array(16))
        };
    }
    /**
   * NON-STANDARD
   * Takes a base pose model matrix and transforms it by the
   * frame of reference.
   *
   * @param {Float32Array} out
   * @param {Float32Array} pose
   */ _transformBasePoseMatrix(out, pose) {
        _mat4.multiply(out, this._inverseBaseMatrix, pose);
    }
    /**
   * NON-STANDARD
   * 
   * @return {Float32Array}
   */ _originOffsetMatrix() {
        return this[PRIVATE].originOffset;
    }
    /**
   * transformMatrix = Inv(OriginOffsetMatrix) * transformMatrix
   * @param {Float32Array} transformMatrix 
   */ _adjustForOriginOffset(transformMatrix) {
        let inverseOriginOffsetMatrix = new Float32Array(16);
        _mat4.invert(inverseOriginOffsetMatrix, this[PRIVATE].originOffset);
        _mat4.multiply(transformMatrix, inverseOriginOffsetMatrix, transformMatrix);
    }
    /**
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */ _getSpaceRelativeTransform(space) {
        let transform = super._getSpaceRelativeTransform(space);
        // TODO: Optimize away double creation of XRRigidTransform
        this._adjustForOriginOffset(transform.matrix);
        return new XRRigidTransform(transform.matrix);
    }
    /**
   * Doesn't update the bound geometry for bounded reference spaces.
   * @param {XRRigidTransform} additionalOffset
   * @return {XRReferenceSpace}
  */ getOffsetReferenceSpace(additionalOffset) {
        let newSpace = new XRReferenceSpace(this[PRIVATE].type, this[PRIVATE].transform, this[PRIVATE].bounds);
        _mat4.multiply(newSpace[PRIVATE].originOffset, this[PRIVATE].originOffset, additionalOffset.matrix);
        return newSpace;
    }
}
exports.default = XRReferenceSpace;

},{"./XRSpace":"3TNNg","gl-matrix/src/gl-matrix/mat4":"6Zon6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3TNNg":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
parcelHelpers.export(exports, "XRSpaceSpecialTypes", ()=>XRSpaceSpecialTypes);
var _xrrigidTransform = require("./XRRigidTransform");
var _xrrigidTransformDefault = parcelHelpers.interopDefault(_xrrigidTransform);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
const PRIVATE = Symbol("@@webxr-polyfill/XRSpace");
const XRSpaceSpecialTypes = [
    "grip",
    "target-ray"
];
class XRSpace {
    /**
   * @param {string?} specialType
   * @param {XRInputSource?} inputSource 
   */ constructor(specialType = null, inputSource = null){
        this[PRIVATE] = {
            specialType,
            inputSource,
            // The transform for the space in the base space, along with it's inverse
            baseMatrix: null,
            inverseBaseMatrix: null,
            lastFrameId: -1
        };
    }
    /**
   * @return {string?}
   */ get _specialType() {
        return this[PRIVATE].specialType;
    }
    /**
   * @return {XRInputSource?}
   */ get _inputSource() {
        return this[PRIVATE].inputSource;
    }
    /**
   * NON-STANDARD
   * Trigger an update for this space's base pose if necessary
   * @param {XRDevice} device
   * @param {Number} frameId
   */ _ensurePoseUpdated(device, frameId) {
        if (frameId == this[PRIVATE].lastFrameId) return;
        this[PRIVATE].lastFrameId = frameId;
        this._onPoseUpdate(device);
    }
    /**
   * NON-STANDARD
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */ _onPoseUpdate(device) {
        if (this[PRIVATE].specialType == "viewer") this._baseMatrix = device.getBasePoseMatrix();
    }
    /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */ set _baseMatrix(matrix) {
        this[PRIVATE].baseMatrix = matrix;
        this[PRIVATE].inverseBaseMatrix = null;
    }
    /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */ get _baseMatrix() {
        if (!this[PRIVATE].baseMatrix) {
            if (this[PRIVATE].inverseBaseMatrix) {
                this[PRIVATE].baseMatrix = new Float32Array(16);
                _mat4.invert(this[PRIVATE].baseMatrix, this[PRIVATE].inverseBaseMatrix);
            }
        }
        return this[PRIVATE].baseMatrix;
    }
    /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */ set _inverseBaseMatrix(matrix) {
        this[PRIVATE].inverseBaseMatrix = matrix;
        this[PRIVATE].baseMatrix = null;
    }
    /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */ get _inverseBaseMatrix() {
        if (!this[PRIVATE].inverseBaseMatrix) {
            if (this[PRIVATE].baseMatrix) {
                this[PRIVATE].inverseBaseMatrix = new Float32Array(16);
                _mat4.invert(this[PRIVATE].inverseBaseMatrix, this[PRIVATE].baseMatrix);
            }
        }
        return this[PRIVATE].inverseBaseMatrix;
    }
    /**
   * NON-STANDARD
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */ _getSpaceRelativeTransform(space) {
        if (!this._inverseBaseMatrix || !space._baseMatrix) return null;
        let out = new Float32Array(16);
        _mat4.multiply(out, this._inverseBaseMatrix, space._baseMatrix);
        return new (0, _xrrigidTransformDefault.default)(out);
    }
}
exports.default = XRSpace;

},{"./XRRigidTransform":"4fpYQ","gl-matrix/src/gl-matrix/mat4":"6Zon6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4fpYQ":[function(require,module,exports) {
/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
var _vec3 = require("gl-matrix/src/gl-matrix/vec3");
var _quat = require("gl-matrix/src/gl-matrix/quat");
const PRIVATE = Symbol("@@webxr-polyfill/XRRigidTransform");
class XRRigidTransform {
    // no arguments: identity transform
    // (Float32Array): transform based on matrix
    // (DOMPointReadOnly): transform based on position without any rotation
    // (DOMPointReadOnly, DOMPointReadOnly): transform based on position and
    // orientation quaternion
    constructor(){
        this[PRIVATE] = {
            matrix: null,
            position: null,
            orientation: null,
            inverse: null
        };
        if (arguments.length === 0) this[PRIVATE].matrix = _mat4.identity(new Float32Array(16));
        else if (arguments.length === 1) {
            if (arguments[0] instanceof Float32Array) this[PRIVATE].matrix = arguments[0];
            else {
                this[PRIVATE].position = this._getPoint(arguments[0]);
                this[PRIVATE].orientation = DOMPointReadOnly.fromPoint({
                    x: 0,
                    y: 0,
                    z: 0,
                    w: 1
                });
            }
        } else if (arguments.length === 2) {
            this[PRIVATE].position = this._getPoint(arguments[0]);
            this[PRIVATE].orientation = this._getPoint(arguments[1]);
        } else throw new Error("Too many arguments!");
        if (this[PRIVATE].matrix) {
            // Decompose matrix into position and orientation.
            let position = _vec3.create();
            _mat4.getTranslation(position, this[PRIVATE].matrix);
            this[PRIVATE].position = DOMPointReadOnly.fromPoint({
                x: position[0],
                y: position[1],
                z: position[2]
            });
            let orientation = _quat.create();
            _mat4.getRotation(orientation, this[PRIVATE].matrix);
            this[PRIVATE].orientation = DOMPointReadOnly.fromPoint({
                x: orientation[0],
                y: orientation[1],
                z: orientation[2],
                w: orientation[3]
            });
        } else {
            // Compose matrix from position and orientation.
            this[PRIVATE].matrix = _mat4.identity(new Float32Array(16));
            _mat4.fromRotationTranslation(this[PRIVATE].matrix, _quat.fromValues(this[PRIVATE].orientation.x, this[PRIVATE].orientation.y, this[PRIVATE].orientation.z, this[PRIVATE].orientation.w), _vec3.fromValues(this[PRIVATE].position.x, this[PRIVATE].position.y, this[PRIVATE].position.z));
        }
    }
    /**
   * Try to convert arg to a DOMPointReadOnly if it isn't already one.
   * @param {*} arg
   * @return {DOMPointReadOnly}
   */ _getPoint(arg) {
        if (arg instanceof DOMPointReadOnly) return arg;
        return DOMPointReadOnly.fromPoint(arg);
    }
    /**
   * @return {Float32Array}
   */ get matrix() {
        return this[PRIVATE].matrix;
    }
    /**
   * @return {DOMPointReadOnly}
   */ get position() {
        return this[PRIVATE].position;
    }
    /**
   * @return {DOMPointReadOnly}
   */ get orientation() {
        return this[PRIVATE].orientation;
    }
    /**
   * @return {XRRigidTransform}
   */ get inverse() {
        if (this[PRIVATE].inverse === null) {
            let invMatrix = _mat4.identity(new Float32Array(16));
            _mat4.invert(invMatrix, this[PRIVATE].matrix);
            this[PRIVATE].inverse = new XRRigidTransform(invMatrix);
            this[PRIVATE].inverse[PRIVATE].inverse = this;
        }
        return this[PRIVATE].inverse;
    }
}
exports.default = XRRigidTransform;

},{"gl-matrix/src/gl-matrix/mat4":"6Zon6","gl-matrix/src/gl-matrix/vec3":"k7jpC","gl-matrix/src/gl-matrix/quat":"kJ4kK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6Zon6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */ /**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */ parcelHelpers.export(exports, "clone", ()=>clone);
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "copy", ()=>copy);
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */ parcelHelpers.export(exports, "fromValues", ()=>fromValues);
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "set", ()=>set);
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "identity", ()=>identity);
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "transpose", ()=>transpose);
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "invert", ()=>invert);
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "adjoint", ()=>adjoint);
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */ parcelHelpers.export(exports, "determinant", ()=>determinant);
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "translate", ()=>translate);
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/ parcelHelpers.export(exports, "scale", ()=>scale);
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotate", ()=>rotate);
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateX", ()=>rotateX);
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateY", ()=>rotateY);
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateZ", ()=>rotateZ);
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromTranslation", ()=>fromTranslation);
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromScaling", ()=>fromScaling);
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotation", ()=>fromRotation);
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromXRotation", ()=>fromXRotation);
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromYRotation", ()=>fromYRotation);
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromZRotation", ()=>fromZRotation);
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslation", ()=>fromRotationTranslation);
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {quat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */ parcelHelpers.export(exports, "fromQuat2", ()=>fromQuat2);
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */ parcelHelpers.export(exports, "getTranslation", ()=>getTranslation);
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */ parcelHelpers.export(exports, "getScaling", ()=>getScaling);
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */ parcelHelpers.export(exports, "getRotation", ()=>getRotation);
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslationScale", ()=>fromRotationTranslationScale);
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslationScaleOrigin", ()=>fromRotationTranslationScaleOrigin);
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromQuat", ()=>fromQuat);
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "frustum", ()=>frustum);
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "perspective", ()=>perspective);
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "perspectiveFromFieldOfView", ()=>perspectiveFromFieldOfView);
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "ortho", ()=>ortho);
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "lookAt", ()=>lookAt);
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "targetTo", ()=>targetTo);
/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */ parcelHelpers.export(exports, "str", ()=>str);
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */ parcelHelpers.export(exports, "frob", ()=>frob);
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "add", ()=>add);
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "subtract", ()=>subtract);
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiplyScalar", ()=>multiplyScalar);
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiplyScalarAndAdd", ()=>multiplyScalarAndAdd);
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "sub", ()=>sub);
var _commonJs = require("./common.js");
function create() {
    let out = new _commonJs.ARRAY_TYPE(16);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
}
function clone(a) {
    let out = new _commonJs.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    let out = new _commonJs.ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
}
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        let a01 = a[1], a02 = a[2], a03 = a[3];
        let a12 = a[6], a13 = a[7];
        let a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    return out;
}
function invert(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
}
function adjoint(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
}
function determinant(a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    // Cache only the current line of the second matrix
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}
function translate(out, a, v) {
    let x = v[0], y = v[1], z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
}
function scale(out, a, v) {
    let x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function rotate(out, a, rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;
    if (len < _commonJs.EPSILON) return null;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
}
function rotateX(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];
    if (a !== out) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
}
function rotateY(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];
    if (a !== out) {
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
}
function rotateZ(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    if (a !== out) {
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
}
function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromRotation(out, rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    if (len < _commonJs.EPSILON) return null;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromXRotation(out, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromYRotation(out, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromZRotation(out, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromQuat2(out, a) {
    let translation = new _commonJs.ARRAY_TYPE(3);
    let bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    let magnitude = bx * bx + by * by + bz * bz + bw * bw;
    //Only scale if it makes sense
    if (magnitude > 0) {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
}
function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
}
function getScaling(out, mat) {
    let m11 = mat[0];
    let m12 = mat[1];
    let m13 = mat[2];
    let m21 = mat[4];
    let m22 = mat[5];
    let m23 = mat[6];
    let m31 = mat[8];
    let m32 = mat[9];
    let m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
}
function getRotation(out, mat) {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    let trace = mat[0] + mat[5] + mat[10];
    let S = 0;
    if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        out[3] = 0.25 * S;
        out[0] = (mat[6] - mat[9]) / S;
        out[1] = (mat[8] - mat[2]) / S;
        out[2] = (mat[1] - mat[4]) / S;
    } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
        S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
        out[3] = (mat[6] - mat[9]) / S;
        out[0] = 0.25 * S;
        out[1] = (mat[1] + mat[4]) / S;
        out[2] = (mat[8] + mat[2]) / S;
    } else if (mat[5] > mat[10]) {
        S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
        out[3] = (mat[8] - mat[2]) / S;
        out[0] = (mat[1] + mat[4]) / S;
        out[1] = 0.25 * S;
        out[2] = (mat[6] + mat[9]) / S;
    } else {
        S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
        out[3] = (mat[1] - mat[4]) / S;
        out[0] = (mat[8] + mat[2]) / S;
        out[1] = (mat[6] + mat[9]) / S;
        out[2] = 0.25 * S;
    }
    return out;
}
function fromRotationTranslationScale(out, q, v, s) {
    // Quaternion math
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s[0];
    let sy = s[1];
    let sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    // Quaternion math
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s[0];
    let sy = s[1];
    let sz = s[2];
    let ox = o[0];
    let oy = o[1];
    let oz = o[2];
    let out0 = (1 - (yy + zz)) * sx;
    let out1 = (xy + wz) * sx;
    let out2 = (xz - wy) * sx;
    let out4 = (xy - wz) * sy;
    let out5 = (1 - (xx + zz)) * sy;
    let out6 = (yz + wx) * sy;
    let out8 = (xz + wy) * sz;
    let out9 = (yz - wx) * sz;
    let out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
}
function fromQuat(out, q) {
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function frustum(out, left, right, bottom, top, near, far) {
    let rl = 1 / (right - left);
    let tb = 1 / (top - bottom);
    let nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
}
function perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
    let upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    let downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    let leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    let rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    let xScale = 2.0 / (leftTan + rightTan);
    let yScale = 2.0 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = far * near / (near - far);
    out[15] = 0.0;
    return out;
}
function ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
}
function lookAt(out, eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];
    if (Math.abs(eyex - centerx) < _commonJs.EPSILON && Math.abs(eyey - centery) < _commonJs.EPSILON && Math.abs(eyez - centerz) < _commonJs.EPSILON) return identity(out);
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
}
function targetTo(out, eye, target, up) {
    let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        z0 *= len;
        z1 *= len;
        z2 *= len;
    }
    let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
}
function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
}
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
}
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
}
function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
}
function multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    out[9] = a[9] + b[9] * scale;
    out[10] = a[10] + b[10] * scale;
    out[11] = a[11] + b[11] * scale;
    out[12] = a[12] + b[12] * scale;
    out[13] = a[13] + b[13] * scale;
    out[14] = a[14] + b[14] * scale;
    out[15] = a[15] + b[15] * scale;
    return out;
}
function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    let a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    let a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    let b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    let b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
const mul = multiply;
const sub = subtract;

},{"./common.js":"9al92","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9al92":[function(require,module,exports) {
/**
 * Common utilities
 * @module glMatrix
 */ // Configuration Constants
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "EPSILON", ()=>EPSILON);
parcelHelpers.export(exports, "ARRAY_TYPE", ()=>ARRAY_TYPE);
parcelHelpers.export(exports, "RANDOM", ()=>RANDOM);
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */ parcelHelpers.export(exports, "setMatrixArrayType", ()=>setMatrixArrayType);
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */ parcelHelpers.export(exports, "toRadian", ()=>toRadian);
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
const EPSILON = 0.000001;
let ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
const RANDOM = Math.random;
function setMatrixArrayType(type) {
    ARRAY_TYPE = type;
}
const degree = Math.PI / 180;
function toRadian(a) {
    return a * degree;
}
function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"k7jpC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * 3 Dimensional Vector
 * @module vec3
 */ /**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */ parcelHelpers.export(exports, "clone", ()=>clone);
/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */ parcelHelpers.export(exports, "length", ()=>length);
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */ parcelHelpers.export(exports, "fromValues", ()=>fromValues);
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "copy", ()=>copy);
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "set", ()=>set);
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "add", ()=>add);
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "subtract", ()=>subtract);
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "divide", ()=>divide);
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "ceil", ()=>ceil);
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "floor", ()=>floor);
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "min", ()=>min);
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "max", ()=>max);
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "round", ()=>round);
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "scale", ()=>scale);
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "scaleAndAdd", ()=>scaleAndAdd);
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */ parcelHelpers.export(exports, "distance", ()=>distance);
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */ parcelHelpers.export(exports, "squaredDistance", ()=>squaredDistance);
/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */ parcelHelpers.export(exports, "squaredLength", ()=>squaredLength);
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "negate", ()=>negate);
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "inverse", ()=>inverse);
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "normalize", ()=>normalize);
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */ parcelHelpers.export(exports, "dot", ()=>dot);
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "cross", ()=>cross);
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "lerp", ()=>lerp);
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "hermite", ()=>hermite);
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "bezier", ()=>bezier);
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "random", ()=>random);
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "transformMat4", ()=>transformMat4);
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "transformMat3", ()=>transformMat3);
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "transformQuat", ()=>transformQuat);
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "rotateX", ()=>rotateX);
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "rotateY", ()=>rotateY);
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */ parcelHelpers.export(exports, "rotateZ", ()=>rotateZ);
/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */ parcelHelpers.export(exports, "angle", ()=>angle);
/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */ parcelHelpers.export(exports, "str", ()=>str);
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */ parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "sub", ()=>sub);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "div", ()=>div);
parcelHelpers.export(exports, "dist", ()=>dist);
parcelHelpers.export(exports, "sqrDist", ()=>sqrDist);
parcelHelpers.export(exports, "len", ()=>len);
parcelHelpers.export(exports, "sqrLen", ()=>sqrLen);
parcelHelpers.export(exports, "forEach", ()=>forEach);
var _commonJs = require("./common.js");
function create() {
    let out = new _commonJs.ARRAY_TYPE(3);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
    }
    return out;
}
function clone(a) {
    var out = new _commonJs.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
function length(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
}
function fromValues(x, y, z) {
    let out = new _commonJs.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
function set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
}
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}
function multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
}
function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
}
function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
}
function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
}
function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
}
function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
}
function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
}
function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
}
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
}
function distance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
}
function squaredDistance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return x * x + y * y + z * z;
}
function squaredLength(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return x * x + y * y + z * z;
}
function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
}
function inverse(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    return out;
}
function normalize(out, a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
    let ax = a[0], ay = a[1], az = a[2];
    let bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}
function lerp(out, a, b, t) {
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
}
function hermite(out, a, b, c, d, t) {
    let factorTimes2 = t * t;
    let factor1 = factorTimes2 * (2 * t - 3) + 1;
    let factor2 = factorTimes2 * (t - 2) + t;
    let factor3 = factorTimes2 * (t - 1);
    let factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
}
function bezier(out, a, b, c, d, t) {
    let inverseFactor = 1 - t;
    let inverseFactorTimesTwo = inverseFactor * inverseFactor;
    let factorTimes2 = t * t;
    let factor1 = inverseFactorTimesTwo * inverseFactor;
    let factor2 = 3 * t * inverseFactorTimesTwo;
    let factor3 = 3 * factorTimes2 * inverseFactor;
    let factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
}
function random(out, scale) {
    scale = scale || 1.0;
    let r = _commonJs.RANDOM() * 2.0 * Math.PI;
    let z = _commonJs.RANDOM() * 2.0 - 1.0;
    let zScale = Math.sqrt(1.0 - z * z) * scale;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
}
function transformMat4(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
}
function transformMat3(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
}
function transformQuat(out, a, q) {
    // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    let x = a[0], y = a[1], z = a[2];
    // var qvec = [qx, qy, qz];
    // var uv = vec3.cross([], qvec, a);
    let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    // var uuv = vec3.cross([], qvec, uv);
    let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    // vec3.scale(uv, uv, 2 * w);
    let w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    // vec3.scale(uuv, uuv, 2);
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    // return vec3.add(out, a, vec3.add(out, uv, uuv));
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
}
function rotateX(out, a, b, c) {
    let p = [], r = [];
    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    //perform rotation
    r[0] = p[0];
    r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
    r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
    //translate to correct position
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
function rotateY(out, a, b, c) {
    let p = [], r = [];
    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    //perform rotation
    r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
    //translate to correct position
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
function rotateZ(out, a, b, c) {
    let p = [], r = [];
    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    //perform rotation
    r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
    r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
    r[2] = p[2];
    //translate to correct position
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
function angle(a, b) {
    let tempA = fromValues(a[0], a[1], a[2]);
    let tempB = fromValues(b[0], b[1], b[2]);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    let cosine = dot(tempA, tempB);
    if (cosine > 1.0) return 0;
    else if (cosine < -1) return Math.PI;
    else return Math.acos(cosine);
}
function str(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals(a, b) {
    let a0 = a[0], a1 = a[1], a2 = a[2];
    let b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
const sub = subtract;
const mul = multiply;
const div = divide;
const dist = distance;
const sqrDist = squaredDistance;
const len = length;
const sqrLen = squaredLength;
const forEach = function() {
    let vec = create();
    return function(a, stride, offset, count, fn, arg) {
        let i, l;
        if (!stride) stride = 3;
        if (!offset) offset = 0;
        if (count) l = Math.min(count * stride + offset, a.length);
        else l = a.length;
        for(i = offset; i < l; i += stride){
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
        }
        return a;
    };
}();

},{"./common.js":"9al92","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kJ4kK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Quaternion
 * @module quat
 */ /**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */ parcelHelpers.export(exports, "identity", ()=>identity);
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/ parcelHelpers.export(exports, "setAxisAngle", ()=>setAxisAngle);
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */ parcelHelpers.export(exports, "getAxisAngle", ()=>getAxisAngle);
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */ parcelHelpers.export(exports, "rotateX", ()=>rotateX);
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */ parcelHelpers.export(exports, "rotateY", ()=>rotateY);
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */ parcelHelpers.export(exports, "rotateZ", ()=>rotateZ);
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */ parcelHelpers.export(exports, "calculateW", ()=>calculateW);
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */ parcelHelpers.export(exports, "slerp", ()=>slerp);
/**
 * Generates a random quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */ parcelHelpers.export(exports, "random", ()=>random);
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */ parcelHelpers.export(exports, "invert", ()=>invert);
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */ parcelHelpers.export(exports, "conjugate", ()=>conjugate);
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */ parcelHelpers.export(exports, "fromMat3", ()=>fromMat3);
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */ parcelHelpers.export(exports, "fromEuler", ()=>fromEuler);
/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */ parcelHelpers.export(exports, "str", ()=>str);
parcelHelpers.export(exports, "clone", ()=>clone);
parcelHelpers.export(exports, "fromValues", ()=>fromValues);
parcelHelpers.export(exports, "copy", ()=>copy);
parcelHelpers.export(exports, "set", ()=>set);
parcelHelpers.export(exports, "add", ()=>add);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "scale", ()=>scale);
parcelHelpers.export(exports, "dot", ()=>dot);
parcelHelpers.export(exports, "lerp", ()=>lerp);
parcelHelpers.export(exports, "length", ()=>length);
parcelHelpers.export(exports, "len", ()=>len);
parcelHelpers.export(exports, "squaredLength", ()=>squaredLength);
parcelHelpers.export(exports, "sqrLen", ()=>sqrLen);
parcelHelpers.export(exports, "normalize", ()=>normalize);
parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "rotationTo", ()=>rotationTo);
parcelHelpers.export(exports, "sqlerp", ()=>sqlerp);
parcelHelpers.export(exports, "setAxes", ()=>setAxes);
var _commonJs = require("./common.js");
var _mat3Js = require("./mat3.js");
var _vec3Js = require("./vec3.js");
var _vec4Js = require("./vec4.js");
function create() {
    let out = new _commonJs.ARRAY_TYPE(4);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
    }
    out[3] = 1;
    return out;
}
function identity(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
}
function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
}
function getAxisAngle(out_axis, q) {
    let rad = Math.acos(q[3]) * 2.0;
    let s = Math.sin(rad / 2.0);
    if (s > _commonJs.EPSILON) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
    } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
    }
    return rad;
}
function multiply(out, a, b) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
}
function rotateX(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
}
function rotateY(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let by = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
}
function rotateZ(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bz = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
}
function calculateW(out, a) {
    let x = a[0], y = a[1], z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
}
function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let omega, cosom, sinom, scale0, scale1;
    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > _commonJs.EPSILON) {
        // standard case (slerp)
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
}
function random(out) {
    // Implementation of http://planning.cs.uiuc.edu/node198.html
    // TODO: Calling random 3 times is probably not the fastest solution
    let u1 = _commonJs.RANDOM();
    let u2 = _commonJs.RANDOM();
    let u3 = _commonJs.RANDOM();
    let sqrt1MinusU1 = Math.sqrt(1 - u1);
    let sqrtU1 = Math.sqrt(u1);
    out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
    out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
    out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
    out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
    return out;
}
function invert(out, a) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    let invDot = dot ? 1.0 / dot : 0;
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
}
function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
}
function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    let fTrace = m[0] + m[4] + m[8];
    let fRoot;
    if (fTrace > 0.0) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0); // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot; // 1/(4w)
        out[0] = (m[5] - m[7]) * fRoot;
        out[1] = (m[6] - m[2]) * fRoot;
        out[2] = (m[1] - m[3]) * fRoot;
    } else {
        // |w| <= 1/2
        let i = 0;
        if (m[4] > m[0]) i = 1;
        if (m[8] > m[i * 3 + i]) i = 2;
        let j = (i + 1) % 3;
        let k = (i + 2) % 3;
        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
}
function fromEuler(out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
}
function str(a) {
    return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
const clone = _vec4Js.clone;
const fromValues = _vec4Js.fromValues;
const copy = _vec4Js.copy;
const set = _vec4Js.set;
const add = _vec4Js.add;
const mul = multiply;
const scale = _vec4Js.scale;
const dot = _vec4Js.dot;
const lerp = _vec4Js.lerp;
const length = _vec4Js.length;
const len = length;
const squaredLength = _vec4Js.squaredLength;
const sqrLen = squaredLength;
const normalize = _vec4Js.normalize;
const exactEquals = _vec4Js.exactEquals;
const equals = _vec4Js.equals;
const rotationTo = function() {
    let tmpvec3 = _vec3Js.create();
    let xUnitVec3 = _vec3Js.fromValues(1, 0, 0);
    let yUnitVec3 = _vec3Js.fromValues(0, 1, 0);
    return function(out, a, b) {
        let dot = _vec3Js.dot(a, b);
        if (dot < -0.999999) {
            _vec3Js.cross(tmpvec3, xUnitVec3, a);
            if (_vec3Js.len(tmpvec3) < 0.000001) _vec3Js.cross(tmpvec3, yUnitVec3, a);
            _vec3Js.normalize(tmpvec3, tmpvec3);
            setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            _vec3Js.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return normalize(out, out);
        }
    };
}();
const sqlerp = function() {
    let temp1 = create();
    let temp2 = create();
    return function(out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
    };
}();
const setAxes = function() {
    let matr = _mat3Js.create();
    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];
        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];
        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];
        return normalize(out, fromMat3(out, matr));
    };
}();

},{"./common.js":"9al92","./mat3.js":"5IqcS","./vec3.js":"k7jpC","./vec4.js":"2IKo1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5IqcS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * 3x3 Matrix
 * @module mat3
 */ /**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "fromMat4", ()=>fromMat4);
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */ parcelHelpers.export(exports, "clone", ()=>clone);
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "copy", ()=>copy);
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */ parcelHelpers.export(exports, "fromValues", ()=>fromValues);
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "set", ()=>set);
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "identity", ()=>identity);
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "transpose", ()=>transpose);
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "invert", ()=>invert);
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "adjoint", ()=>adjoint);
/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */ parcelHelpers.export(exports, "determinant", ()=>determinant);
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "translate", ()=>translate);
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "rotate", ()=>rotate);
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/ parcelHelpers.export(exports, "scale", ()=>scale);
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "fromTranslation", ()=>fromTranslation);
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "fromRotation", ()=>fromRotation);
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "fromScaling", ()=>fromScaling);
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/ parcelHelpers.export(exports, "fromMat2d", ()=>fromMat2d);
/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/ parcelHelpers.export(exports, "fromQuat", ()=>fromQuat);
/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/ parcelHelpers.export(exports, "normalFromMat4", ()=>normalFromMat4);
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "projection", ()=>projection);
/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */ parcelHelpers.export(exports, "str", ()=>str);
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */ parcelHelpers.export(exports, "frob", ()=>frob);
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "add", ()=>add);
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "subtract", ()=>subtract);
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "multiplyScalar", ()=>multiplyScalar);
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */ parcelHelpers.export(exports, "multiplyScalarAndAdd", ()=>multiplyScalarAndAdd);
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "sub", ()=>sub);
var _commonJs = require("./common.js");
function create() {
    let out = new _commonJs.ARRAY_TYPE(9);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
}
function fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
}
function clone(a) {
    let out = new _commonJs.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
}
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
}
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    let out = new _commonJs.ARRAY_TYPE(9);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
}
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
}
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        let a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    return out;
}
function invert(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;
    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) return null;
    det = 1.0 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
}
function adjoint(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    out[0] = a11 * a22 - a12 * a21;
    out[1] = a02 * a21 - a01 * a22;
    out[2] = a01 * a12 - a02 * a11;
    out[3] = a12 * a20 - a10 * a22;
    out[4] = a00 * a22 - a02 * a20;
    out[5] = a02 * a10 - a00 * a12;
    out[6] = a10 * a21 - a11 * a20;
    out[7] = a01 * a20 - a00 * a21;
    out[8] = a00 * a11 - a01 * a10;
    return out;
}
function determinant(a) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
function multiply(out, a, b) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    let b00 = b[0], b01 = b[1], b02 = b[2];
    let b10 = b[3], b11 = b[4], b12 = b[5];
    let b20 = b[6], b21 = b[7], b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
}
function translate(out, a, v) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
}
function rotate(out, a, rad) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
}
function scale(out, a, v) {
    let x = v[0], y = v[1];
    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];
    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
}
function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}
function fromRotation(out, rad) {
    let s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = -s;
    out[4] = c;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}
function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}
function fromMat2d(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;
    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;
    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
}
function fromQuat(out, q) {
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
}
function normalFromMat4(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
}
function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}
function str(a) {
    return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
}
function frob(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
}
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
}
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
}
function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
}
function multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    return out;
}
function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}
function equals(a, b) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
    return Math.abs(a0 - b0) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
const mul = multiply;
const sub = subtract;

},{"./common.js":"9al92","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2IKo1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * 4 Dimensional Vector
 * @module vec4
 */ /**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */ parcelHelpers.export(exports, "clone", ()=>clone);
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */ parcelHelpers.export(exports, "fromValues", ()=>fromValues);
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "copy", ()=>copy);
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "set", ()=>set);
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "add", ()=>add);
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "subtract", ()=>subtract);
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "divide", ()=>divide);
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "ceil", ()=>ceil);
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "floor", ()=>floor);
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "min", ()=>min);
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "max", ()=>max);
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "round", ()=>round);
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "scale", ()=>scale);
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "scaleAndAdd", ()=>scaleAndAdd);
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */ parcelHelpers.export(exports, "distance", ()=>distance);
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */ parcelHelpers.export(exports, "squaredDistance", ()=>squaredDistance);
/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */ parcelHelpers.export(exports, "length", ()=>length);
/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */ parcelHelpers.export(exports, "squaredLength", ()=>squaredLength);
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "negate", ()=>negate);
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "inverse", ()=>inverse);
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "normalize", ()=>normalize);
/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */ parcelHelpers.export(exports, "dot", ()=>dot);
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "lerp", ()=>lerp);
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "random", ()=>random);
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "transformMat4", ()=>transformMat4);
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */ parcelHelpers.export(exports, "transformQuat", ()=>transformQuat);
/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */ parcelHelpers.export(exports, "str", ()=>str);
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */ parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "sub", ()=>sub);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "div", ()=>div);
parcelHelpers.export(exports, "dist", ()=>dist);
parcelHelpers.export(exports, "sqrDist", ()=>sqrDist);
parcelHelpers.export(exports, "len", ()=>len);
parcelHelpers.export(exports, "sqrLen", ()=>sqrLen);
parcelHelpers.export(exports, "forEach", ()=>forEach);
var _commonJs = require("./common.js");
function create() {
    let out = new _commonJs.ARRAY_TYPE(4);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
    }
    return out;
}
function clone(a) {
    let out = new _commonJs.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
}
function fromValues(x, y, z, w) {
    let out = new _commonJs.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
}
function set(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
}
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
}
function multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
}
function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
}
function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
}
function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
}
function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
}
function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
}
function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
}
function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
}
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    return out;
}
function distance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    let w = b[3] - a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
}
function squaredDistance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    let w = b[3] - a[3];
    return x * x + y * y + z * z + w * w;
}
function length(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
}
function squaredLength(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = a[3];
    return x * x + y * y + z * z + w * w;
}
function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
}
function inverse(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    out[3] = 1.0 / a[3];
    return out;
}
function normalize(out, a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = a[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function lerp(out, a, b, t) {
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    let aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
}
function random(out, scale) {
    scale = scale || 1.0;
    // Marsaglia, George. Choosing a Point from the Surface of a
    // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
    // http://projecteuclid.org/euclid.aoms/1177692644;
    var v1, v2, v3, v4;
    var s1, s2;
    do {
        v1 = _commonJs.RANDOM() * 2 - 1;
        v2 = _commonJs.RANDOM() * 2 - 1;
        s1 = v1 * v1 + v2 * v2;
    }while (s1 >= 1);
    do {
        v3 = _commonJs.RANDOM() * 2 - 1;
        v4 = _commonJs.RANDOM() * 2 - 1;
        s2 = v3 * v3 + v4 * v4;
    }while (s2 >= 1);
    var d = Math.sqrt((1 - s1) / s2);
    out[0] = scale * v1;
    out[1] = scale * v2;
    out[2] = scale * v3 * d;
    out[3] = scale * v4 * d;
    return out;
}
function transformMat4(out, a, m) {
    let x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
}
function transformQuat(out, a, q) {
    let x = a[0], y = a[1], z = a[2];
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    // calculate quat * vec
    let ix = qw * x + qy * z - qz * y;
    let iy = qw * y + qz * x - qx * z;
    let iz = qw * z + qx * y - qy * x;
    let iw = -qx * x - qy * y - qz * z;
    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
}
function str(a) {
    return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function equals(a, b) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return Math.abs(a0 - b0) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
const sub = subtract;
const mul = multiply;
const div = divide;
const dist = distance;
const sqrDist = squaredDistance;
const len = length;
const sqrLen = squaredLength;
const forEach = function() {
    let vec = create();
    return function(a, stride, offset, count, fn, arg) {
        let i, l;
        if (!stride) stride = 4;
        if (!offset) offset = 0;
        if (count) l = Math.min(count * stride + offset, a.length);
        else l = a.length;
        for(i = offset; i < l; i += stride){
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            vec[3] = a[i + 3];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
            a[i + 3] = vec[3];
        }
        return a;
    };
}();

},{"./common.js":"9al92","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4yNN0":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _eventTarget = require("../lib/EventTarget");
var _eventTargetDefault = parcelHelpers.interopDefault(_eventTarget);
var _now = require("../lib/now");
var _nowDefault = parcelHelpers.interopDefault(_now);
var _xrframe = require("./XRFrame");
var _xrframeDefault = parcelHelpers.interopDefault(_xrframe);
var _xrreferenceSpace = require("./XRReferenceSpace");
var _xrreferenceSpaceDefault = parcelHelpers.interopDefault(_xrreferenceSpace);
var _xrrenderState = require("./XRRenderState");
var _xrrenderStateDefault = parcelHelpers.interopDefault(_xrrenderState);
var _xrinputSourceEvent = require("./XRInputSourceEvent");
var _xrinputSourceEventDefault = parcelHelpers.interopDefault(_xrinputSourceEvent);
var _xrsessionEvent = require("./XRSessionEvent");
var _xrsessionEventDefault = parcelHelpers.interopDefault(_xrsessionEvent);
var _xrspace = require("./XRSpace");
var _xrspaceDefault = parcelHelpers.interopDefault(_xrspace);
var _xrinputSourcesChangeEvent = require("./XRInputSourcesChangeEvent");
var _xrinputSourcesChangeEventDefault = parcelHelpers.interopDefault(_xrinputSourcesChangeEvent);
const PRIVATE = Symbol("@@webxr-polyfill/XRSession");
// Nonstandard helper class. Not exposed by the API anywhere.
class XRViewSpace extends (0, _xrspaceDefault.default) {
    constructor(eye){
        super(eye);
    }
    get eye() {
        return this._specialType;
    }
    /**
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */ _onPoseUpdate(device) {
        this._inverseBaseMatrix = device.getBaseViewMatrix(this._specialType);
    }
}
class XRSession extends (0, _eventTargetDefault.default) {
    /**
   * @param {XRDevice} device
   * @param {XRSessionMode} mode
   * @param {number} id
   */ constructor(device, mode, id){
        super();
        let immersive = mode != "inline";
        // inlineVerticalFieldOfView must initialize to PI/2 for inline sessions.
        let initialRenderState = new (0, _xrrenderStateDefault.default)({
            inlineVerticalFieldOfView: immersive ? null : Math.PI * 0.5
        });
        const defaultViewSpaces = immersive ? [
            new XRViewSpace("left"),
            new XRViewSpace("right")
        ] : [
            new XRViewSpace("none")
        ];
        Object.freeze(defaultViewSpaces);
        this[PRIVATE] = {
            device,
            mode,
            immersive,
            ended: false,
            suspended: false,
            frameCallbacks: [],
            currentFrameCallbacks: null,
            frameHandle: 0,
            deviceFrameHandle: null,
            id,
            activeRenderState: initialRenderState,
            pendingRenderState: null,
            viewerSpace: new (0, _xrreferenceSpaceDefault.default)("viewer"),
            get viewSpaces () {
                return device.getViewSpaces(mode) || defaultViewSpaces;
            },
            currentInputSources: []
        };
        // Single handler for animation frames from the device. The spec says this must
        // run on every candidate frame even if there are no callbacks queued up.
        this[PRIVATE].onDeviceFrame = ()=>{
            if (this[PRIVATE].ended || this[PRIVATE].suspended) return;
            // Queue next frame
            this[PRIVATE].deviceFrameHandle = null;
            this[PRIVATE].startDeviceFrameLoop();
            // - If session’s pending render state is not null, apply the pending render state.
            if (this[PRIVATE].pendingRenderState !== null) {
                // Apply pending render state.
                this[PRIVATE].activeRenderState = new (0, _xrrenderStateDefault.default)(this[PRIVATE].pendingRenderState);
                this[PRIVATE].pendingRenderState = null;
                // Report to the device since it'll need to handle the layer for rendering.
                if (this[PRIVATE].activeRenderState.baseLayer) this[PRIVATE].device.onBaseLayerSet(this[PRIVATE].id, this[PRIVATE].activeRenderState.baseLayer);
            }
            // - If session’s renderState's baseLayer is null, abort these steps.
            if (this[PRIVATE].activeRenderState.baseLayer === null) return;
            // - If session’s mode is "inline" and session’s renderState's output canvas is null,
            //   abort these steps.
            // ???
            const frame = new (0, _xrframeDefault.default)(device, this, this[PRIVATE].id);
            // - Let callbacks be a list of the entries in session’s list of animation frame
            //   callback, in the order in which they were added to the list.
            const callbacks = this[PRIVATE].currentFrameCallbacks = this[PRIVATE].frameCallbacks;
            // - Set session’s list of animation frame callbacks to the empty list.
            this[PRIVATE].frameCallbacks = [];
            // - Set frame’s active boolean to true.
            frame[0, _xrframe.PRIVATE].active = true;
            // - Set frame’s animationFrame boolean to true.
            frame[0, _xrframe.PRIVATE].animationFrame = true;
            this[PRIVATE].device.onFrameStart(this[PRIVATE].id, this[PRIVATE].activeRenderState);
            // inputSources can be populated in .onFrameStart()
            // so check the change and fire inputsourceschange event if needed
            this._checkInputSourcesChange();
            // - For each entry in callbacks, in order:
            //   - If the entry’s cancelled boolean is true, continue to the next entry.
            //   - Invoke the Web IDL callback function, passing now and frame as the arguments
            //   - If an exception is thrown, report the exception.
            const rightNow = (0, _nowDefault.default)(); //should we get this from arguments?
            for(let i = 0; i < callbacks.length; i++)try {
                if (!callbacks[i].cancelled && typeof callbacks[i].callback === "function") callbacks[i].callback(rightNow, frame);
            } catch (err) {
                console.error(err);
            }
            this[PRIVATE].currentFrameCallbacks = null;
            // - Set frame’s active boolean to false.
            frame[0, _xrframe.PRIVATE].active = false;
            this[PRIVATE].device.onFrameEnd(this[PRIVATE].id);
        };
        this[PRIVATE].startDeviceFrameLoop = ()=>{
            if (this[PRIVATE].deviceFrameHandle === null) this[PRIVATE].deviceFrameHandle = this[PRIVATE].device.requestAnimationFrame(this[PRIVATE].onDeviceFrame);
        };
        this[PRIVATE].stopDeviceFrameLoop = ()=>{
            const handle = this[PRIVATE].deviceFrameHandle;
            if (handle !== null) {
                this[PRIVATE].device.cancelAnimationFrame(handle);
                this[PRIVATE].deviceFrameHandle = null;
            }
        };
        // Hook into the XRDisplay's `vr-present-end` event so we can
        // wrap up things here if we're cut off from the underlying
        // polyfilled device or explicitly ended via `session.end()` for this
        // session.
        this[PRIVATE].onPresentationEnd = (sessionId)=>{
            // If this session was suspended, resume it now that an immersive
            // session has ended.
            if (sessionId !== this[PRIVATE].id) {
                this[PRIVATE].suspended = false;
                this[PRIVATE].startDeviceFrameLoop();
                this.dispatchEvent("focus", {
                    session: this
                });
                return;
            }
            // Otherwise, this is the immersive session that has ended.
            // Set `ended` to true so we can disable all functionality
            // in this XRSession
            this[PRIVATE].ended = true;
            this[PRIVATE].stopDeviceFrameLoop();
            device.removeEventListener("@@webxr-polyfill/vr-present-end", this[PRIVATE].onPresentationEnd);
            device.removeEventListener("@@webxr-polyfill/vr-present-start", this[PRIVATE].onPresentationStart);
            device.removeEventListener("@@webxr-polyfill/input-select-start", this[PRIVATE].onSelectStart);
            device.removeEventListener("@@webxr-polyfill/input-select-end", this[PRIVATE].onSelectEnd);
            this.dispatchEvent("end", new (0, _xrsessionEventDefault.default)("end", {
                session: this
            }));
        };
        device.addEventListener("@@webxr-polyfill/vr-present-end", this[PRIVATE].onPresentationEnd);
        // Hook into the XRDisplay's `vr-present-start` event so we can
        // suspend if another session has begun immersive presentation.
        this[PRIVATE].onPresentationStart = (sessionId)=>{
            // Ignore if this is the session that has begun immersive presenting
            if (sessionId === this[PRIVATE].id) return;
            this[PRIVATE].suspended = true;
            this[PRIVATE].stopDeviceFrameLoop();
            this.dispatchEvent("blur", {
                session: this
            });
        };
        device.addEventListener("@@webxr-polyfill/vr-present-start", this[PRIVATE].onPresentationStart);
        this[PRIVATE].onSelectStart = (evt)=>{
            // Ignore if this event is not for this session.
            if (evt.sessionId !== this[PRIVATE].id) return;
            this[PRIVATE].dispatchInputSourceEvent("selectstart", evt.inputSource);
        };
        device.addEventListener("@@webxr-polyfill/input-select-start", this[PRIVATE].onSelectStart);
        this[PRIVATE].onSelectEnd = (evt)=>{
            // Ignore if this event is not for this session.
            if (evt.sessionId !== this[PRIVATE].id) return;
            this[PRIVATE].dispatchInputSourceEvent("selectend", evt.inputSource);
            // Sadly, there's no way to make this a user gesture.
            this[PRIVATE].dispatchInputSourceEvent("select", evt.inputSource);
        };
        device.addEventListener("@@webxr-polyfill/input-select-end", this[PRIVATE].onSelectEnd);
        this[PRIVATE].onSqueezeStart = (evt)=>{
            // Ignore if this event is not for this session.
            if (evt.sessionId !== this[PRIVATE].id) return;
            this[PRIVATE].dispatchInputSourceEvent("squeezestart", evt.inputSource);
        };
        device.addEventListener("@@webxr-polyfill/input-squeeze-start", this[PRIVATE].onSqueezeStart);
        this[PRIVATE].onSqueezeEnd = (evt)=>{
            // Ignore if this event is not for this session.
            if (evt.sessionId !== this[PRIVATE].id) return;
            this[PRIVATE].dispatchInputSourceEvent("squeezeend", evt.inputSource);
            // Following the same way as select event
            this[PRIVATE].dispatchInputSourceEvent("squeeze", evt.inputSource);
        };
        device.addEventListener("@@webxr-polyfill/input-squeeze-end", this[PRIVATE].onSqueezeEnd);
        this[PRIVATE].dispatchInputSourceEvent = (type, inputSource)=>{
            const frame = new (0, _xrframeDefault.default)(device, this, this[PRIVATE].id);
            const event = new (0, _xrinputSourceEventDefault.default)(type, {
                frame,
                inputSource
            });
            frame[0, _xrframe.PRIVATE].active = true;
            this.dispatchEvent(type, event);
            frame[0, _xrframe.PRIVATE].active = false;
        };
        // Start the frame loop
        this[PRIVATE].startDeviceFrameLoop();
        this.onblur = undefined;
        this.onfocus = undefined;
        this.onresetpose = undefined;
        this.onend = undefined;
        this.onselect = undefined;
        this.onselectstart = undefined;
        this.onselectend = undefined;
    }
    /**
   * @return {XRRenderState}
   */ get renderState() {
        return this[PRIVATE].activeRenderState;
    }
    /**
   * @return {XREnvironmentBlendMode}
   */ get environmentBlendMode() {
        return this[PRIVATE].device.environmentBlendMode || "opaque";
    }
    /**
   * @param {string} type
   * @return {XRReferenceSpace}
   */ async requestReferenceSpace(type) {
        if (this[PRIVATE].ended) return;
        if (!(0, _xrreferenceSpace.XRReferenceSpaceTypes).includes(type)) throw new TypeError(`XRReferenceSpaceType must be one of ${(0, _xrreferenceSpace.XRReferenceSpaceTypes)}`);
        if (!this[PRIVATE].device.doesSessionSupportReferenceSpace(this[PRIVATE].id, type)) throw new DOMException(`The ${type} reference space is not supported by this session.`, "NotSupportedError");
        if (type === "viewer") return this[PRIVATE].viewerSpace;
        // Request a transform from the device given the values. If returning a
        // transform (probably "local-floor" or "bounded-floor"), use it, and if
        // undefined, XRReferenceSpace will use a default transform. This call can
        // throw, rejecting the promise, indicating the device does not support that
        // frame of reference.
        let transform = await this[PRIVATE].device.requestFrameOfReferenceTransform(type);
        // TODO: 'bounded-floor' is only blocked because we currently don't report
        // the bounds geometry correctly.
        if (type === "bounded-floor") {
            if (!transform) // 'bounded-floor' spaces must have a transform supplied by the device.
            throw new DOMException(`${type} XRReferenceSpace not supported by this device.`, "NotSupportedError");
            let bounds = this[PRIVATE].device.requestStageBounds();
            if (!bounds) // 'bounded-floor' spaces must have bounds geometry.
            throw new DOMException(`${type} XRReferenceSpace not supported by this device.`, "NotSupportedError");
            // TODO: Create an XRBoundedReferenceSpace with the correct boundaries.
            throw new DOMException(`The WebXR polyfill does not support the ${type} reference space yet.`, "NotSupportedError");
        }
        return new (0, _xrreferenceSpaceDefault.default)(type, transform);
    }
    /**
   * @param {Function} callback
   * @return {number}
   */ requestAnimationFrame(callback) {
        if (this[PRIVATE].ended) return;
        // Add callback to the queue and return its handle
        const handle = ++this[PRIVATE].frameHandle;
        this[PRIVATE].frameCallbacks.push({
            handle,
            callback,
            cancelled: false
        });
        return handle;
    }
    /**
   * @param {number} handle
   */ cancelAnimationFrame(handle) {
        // Remove the callback with that handle from the queue
        let callbacks = this[PRIVATE].frameCallbacks;
        let index = callbacks.findIndex((d)=>d && d.handle === handle);
        if (index > -1) {
            callbacks[index].cancelled = true;
            callbacks.splice(index, 1);
        }
        // If cancelAnimationFrame is called from within a frame callback, also check
        // the remaining callbacks for the current frame:
        callbacks = this[PRIVATE].currentFrameCallbacks;
        if (callbacks) {
            index = callbacks.findIndex((d)=>d && d.handle === handle);
            if (index > -1) callbacks[index].cancelled = true;
        }
    }
    /**
   * @return {Array<XRInputSource>} input sources
   */ get inputSources() {
        return this[PRIVATE].device.getInputSources();
    }
    /**
   * @return {Promise<void>}
   */ async end() {
        if (this[PRIVATE].ended) return;
        // If this is an immersive session, trigger the platform to end, which
        // will call the `onPresentationEnd` handler, wrapping this up.
        if (this[PRIVATE].immersive) {
            this[PRIVATE].ended = true;
            this[PRIVATE].device.removeEventListener("@@webxr-polyfill/vr-present-start", this[PRIVATE].onPresentationStart);
            this[PRIVATE].device.removeEventListener("@@webxr-polyfill/vr-present-end", this[PRIVATE].onPresentationEnd);
            this[PRIVATE].device.removeEventListener("@@webxr-polyfill/input-select-start", this[PRIVATE].onSelectStart);
            this[PRIVATE].device.removeEventListener("@@webxr-polyfill/input-select-end", this[PRIVATE].onSelectEnd);
            this.dispatchEvent("end", new (0, _xrsessionEventDefault.default)("end", {
                session: this
            }));
        }
        this[PRIVATE].stopDeviceFrameLoop();
        return this[PRIVATE].device.endSession(this[PRIVATE].id);
    }
    /**
   * Queues an update to the active render state to be applied on the next
   * frame. Unset fields of newState will not be changed.
   * 
   * @param {XRRenderStateInit?} newState 
   */ updateRenderState(newState) {
        if (this[PRIVATE].ended) {
            const message = "Can't call updateRenderState on an XRSession that has already ended.";
            throw new Error(message);
        }
        if (newState.baseLayer && newState.baseLayer._session !== this) {
            const message = "Called updateRenderState with a base layer that was created by a different session.";
            throw new Error(message);
        }
        const fovSet = newState.inlineVerticalFieldOfView !== null && newState.inlineVerticalFieldOfView !== undefined;
        if (fovSet) {
            if (this[PRIVATE].immersive) {
                const message = "inlineVerticalFieldOfView must not be set for an XRRenderState passed to updateRenderState for an immersive session.";
                throw new Error(message);
            } else // Clamp the inline FoV to a sane range.
            newState.inlineVerticalFieldOfView = Math.min(3.13, Math.max(0.01, newState.inlineVerticalFieldOfView));
        }
        if (this[PRIVATE].pendingRenderState === null) {
            const activeRenderState = this[PRIVATE].activeRenderState;
            this[PRIVATE].pendingRenderState = {
                depthNear: activeRenderState.depthNear,
                depthFar: activeRenderState.depthFar,
                inlineVerticalFieldOfView: activeRenderState.inlineVerticalFieldOfView,
                baseLayer: activeRenderState.baseLayer
            };
        }
        Object.assign(this[PRIVATE].pendingRenderState, newState);
    }
    /**
   * Compares the inputSources with the ones in the previous frame.
   * Fires imputsourceschange event if any added or removed
   * inputSource is found.
   */ _checkInputSourcesChange() {
        const added = [];
        const removed = [];
        const newInputSources = this.inputSources;
        const oldInputSources = this[PRIVATE].currentInputSources;
        for (const newInputSource of newInputSources)if (!oldInputSources.includes(newInputSource)) added.push(newInputSource);
        for (const oldInputSource of oldInputSources)if (!newInputSources.includes(oldInputSource)) removed.push(oldInputSource);
        if (added.length > 0 || removed.length > 0) this.dispatchEvent("inputsourceschange", new (0, _xrinputSourcesChangeEventDefault.default)("inputsourceschange", {
            session: this,
            added: added,
            removed: removed
        }));
        this[PRIVATE].currentInputSources.length = 0;
        for (const newInputSource of newInputSources)this[PRIVATE].currentInputSources.push(newInputSource);
    }
}
exports.default = XRSession;

},{"../lib/EventTarget":"25tGW","../lib/now":"fgoNd","./XRFrame":"27BHo","./XRReferenceSpace":"iZoqC","./XRRenderState":"etcHN","./XRInputSourceEvent":"7yh8Y","./XRSessionEvent":"1ExMI","./XRSpace":"3TNNg","./XRInputSourcesChangeEvent":"8IPvK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fgoNd":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A wrapper around `performance.now()` so that we can run unit tests
 * in Node.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _global = require("./global");
var _globalDefault = parcelHelpers.interopDefault(_global);
let now;
if ("performance" in (0, _globalDefault.default) === false) {
    let startTime = Date.now();
    now = ()=>Date.now() - startTime;
} else now = ()=>performance.now();
exports.default = now;

},{"./global":"8mhRr","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8mhRr":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A library for including application global. Similar to
 * logic provided by `rollup-plugin-node-globals` without the
 * rest of the functionality needed.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var global = arguments[3];
const _global = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
exports.default = _global;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"27BHo":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _xrsession = require("./XRSession");
var _xrviewerPose = require("./XRViewerPose");
var _xrviewerPoseDefault = parcelHelpers.interopDefault(_xrviewerPose);
var _xrview = require("./XRView");
var _xrviewDefault = parcelHelpers.interopDefault(_xrview);
const PRIVATE = Symbol("@@webxr-polyfill/XRFrame");
const NON_ACTIVE_MSG = "XRFrame access outside the callback that produced it is invalid.";
const NON_ANIMFRAME_MSG = "getViewerPose can only be called on XRFrame objects passed to XRSession.requestAnimationFrame callbacks.";
let NEXT_FRAME_ID = 0;
class XRFrame {
    /**
   * @param {XRDevice} device
   * @param {XRSession} session
   * @param {number} sessionId
   */ constructor(device, session, sessionId){
        this[PRIVATE] = {
            id: ++NEXT_FRAME_ID,
            active: false,
            animationFrame: false,
            device,
            session,
            sessionId
        };
    }
    /**
   * @return {XRSession} session
   */ get session() {
        return this[PRIVATE].session;
    }
    /**
   * @param {XRReferenceSpace} referenceSpace
   * @return {XRViewerPose?}
   */ getViewerPose(referenceSpace) {
        if (!this[PRIVATE].animationFrame) throw new DOMException(NON_ANIMFRAME_MSG, "InvalidStateError");
        if (!this[PRIVATE].active) throw new DOMException(NON_ACTIVE_MSG, "InvalidStateError");
        const device = this[PRIVATE].device;
        const session = this[PRIVATE].session;
        session[0, _xrsession.PRIVATE].viewerSpace._ensurePoseUpdated(device, this[PRIVATE].id);
        referenceSpace._ensurePoseUpdated(device, this[PRIVATE].id);
        let viewerTransform = referenceSpace._getSpaceRelativeTransform(session[0, _xrsession.PRIVATE].viewerSpace);
        const views = [];
        for (const viewSpace of session[0, _xrsession.PRIVATE].viewSpaces){
            viewSpace._ensurePoseUpdated(device, this[PRIVATE].id);
            let viewTransform = referenceSpace._getSpaceRelativeTransform(viewSpace);
            let view = new (0, _xrviewDefault.default)(device, viewTransform, viewSpace.eye, this[PRIVATE].sessionId, viewSpace.viewIndex);
            views.push(view);
        }
        let viewerPose = new (0, _xrviewerPoseDefault.default)(viewerTransform, views, false);
        return viewerPose;
    }
    /**
   * @param {XRSpace} space
   * @param {XRSpace} baseSpace
   * @return {XRPose?} pose
   */ getPose(space, baseSpace) {
        if (!this[PRIVATE].active) throw new DOMException(NON_ACTIVE_MSG, "InvalidStateError");
        const device = this[PRIVATE].device;
        if (space._specialType === "target-ray" || space._specialType === "grip") // TODO: Stop special-casing input.
        return device.getInputPose(space._inputSource, baseSpace, space._specialType);
        else {
            space._ensurePoseUpdated(device, this[PRIVATE].id);
            baseSpace._ensurePoseUpdated(device, this[PRIVATE].id);
            let transform = baseSpace._getSpaceRelativeTransform(space);
            if (!transform) return null;
            return new XRPose(transform, false);
        }
        return null;
    }
}
exports.default = XRFrame;

},{"./XRSession":"4yNN0","./XRViewerPose":"isVmI","./XRView":"lVtKL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"isVmI":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _xrpose = require("./XRPose");
var _xrposeDefault = parcelHelpers.interopDefault(_xrpose);
const PRIVATE = Symbol("@@webxr-polyfill/XRViewerPose");
class XRViewerPose extends (0, _xrposeDefault.default) {
    /**
   * @param {XRDevice} device
   */ constructor(transform, views, emulatedPosition = false){
        super(transform, emulatedPosition);
        this[PRIVATE] = {
            views
        };
    }
    /**
   * @return {Array<XRView>}
   */ get views() {
        return this[PRIVATE].views;
    }
}
exports.default = XRViewerPose;

},{"./XRPose":"a3QIC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"a3QIC":[function(require,module,exports) {
/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRPose");
class XRPose {
    /**
   * @param {XRRigidTransform} transform 
   * @param {boolean} emulatedPosition 
   */ constructor(transform, emulatedPosition){
        this[PRIVATE] = {
            transform,
            emulatedPosition
        };
    }
    /**
   * @return {XRRigidTransform}
   */ get transform() {
        return this[PRIVATE].transform;
    }
    /**
   * @return {bool}
   */ get emulatedPosition() {
        return this[PRIVATE].emulatedPosition;
    }
}
exports.default = XRPose;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lVtKL":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _xrviewport = require("./XRViewport");
var _xrviewportDefault = parcelHelpers.interopDefault(_xrviewport);
var _xrrigidTransform = require("./XRRigidTransform");
var _xrrigidTransformDefault = parcelHelpers.interopDefault(_xrrigidTransform);
const XREyes = [
    "left",
    "right",
    "none"
];
const PRIVATE = Symbol("@@webxr-polyfill/XRView");
class XRView {
    /**
   * @param {XRDevice} device
   * @param {XREye} eye
   * @param {number} sessionId
   * @param {number} viewIndex
   */ constructor(device, transform, eye, sessionId, viewIndex){
        if (!XREyes.includes(eye)) throw new Error(`XREye must be one of: ${XREyes}`);
        // Create a shared object that can be updated by other code
        // that can update XRViewport values to adhere to API.
        // Ugly but it works.
        const temp = Object.create(null);
        const viewport = new (0, _xrviewportDefault.default)(temp);
        this[PRIVATE] = {
            device,
            eye,
            viewport,
            temp,
            sessionId,
            transform,
            viewIndex
        };
    }
    /**
   * @return {XREye}
   */ get eye() {
        return this[PRIVATE].eye;
    }
    /**
   * @return {Float32Array}
   */ get projectionMatrix() {
        return this[PRIVATE].device.getProjectionMatrix(this.eye, this[PRIVATE].viewIndex);
    }
    /**
   * @return {XRRigidTransform}
   */ get transform() {
        return this[PRIVATE].transform;
    }
    /**
   * NON-STANDARD
   *
   * `getViewport` is now exposed via XRWebGLLayer instead of XRView.
   * XRWebGLLayer delegates all the actual work to this function.
   *
   * @param {XRWebGLLayer} layer
   * @return {XRViewport?}
   */ _getViewport(layer) {
        if (this[PRIVATE].device.getViewport(this[PRIVATE].sessionId, this.eye, layer, this[PRIVATE].temp, this[PRIVATE].viewIndex)) return this[PRIVATE].viewport;
        return undefined;
    }
}
exports.default = XRView;

},{"./XRViewport":"h8Svb","./XRRigidTransform":"4fpYQ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h8Svb":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRViewport");
class XRViewport {
    /**
   * Takes a proxy object that this viewport's XRView
   * updates and we serve here to match API.
   *
   * @param {Object} target
   */ constructor(target){
        this[PRIVATE] = {
            target
        };
    }
    /**
   * @return {number}
   */ get x() {
        return this[PRIVATE].target.x;
    }
    /**
   * @return {number}
   */ get y() {
        return this[PRIVATE].target.y;
    }
    /**
   * @return {number}
   */ get width() {
        return this[PRIVATE].target.width;
    }
    /**
   * @return {number}
   */ get height() {
        return this[PRIVATE].target.height;
    }
}
exports.default = XRViewport;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"etcHN":[function(require,module,exports) {
/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
parcelHelpers.export(exports, "XRRenderStateInit", ()=>XRRenderStateInit);
const PRIVATE = Symbol("@@webxr-polyfill/XRRenderState");
const XRRenderStateInit = Object.freeze({
    depthNear: 0.1,
    depthFar: 1000.0,
    inlineVerticalFieldOfView: null,
    baseLayer: null
});
class XRRenderState {
    /**
   * @param {Object?} stateInit
   */ constructor(stateInit = {}){
        const config = Object.assign({}, XRRenderStateInit, stateInit);
        this[PRIVATE] = {
            config
        };
    }
    /**
   * @return {number}
   */ get depthNear() {
        return this[PRIVATE].config.depthNear;
    }
    /**
   * @return {number}
   */ get depthFar() {
        return this[PRIVATE].config.depthFar;
    }
    /**
   * @return {number?}
   */ get inlineVerticalFieldOfView() {
        return this[PRIVATE].config.inlineVerticalFieldOfView;
    }
    /**
   * @return {XRWebGLLayer}
   */ get baseLayer() {
        return this[PRIVATE].config.baseLayer;
    }
}
exports.default = XRRenderState;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7yh8Y":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRInputSourceEvent");
class XRInputSourceEvent extends Event {
    /**
   * @param {string} type
   * @param {Object} eventInitDict
   */ constructor(type, eventInitDict){
        super(type, eventInitDict);
        this[PRIVATE] = {
            frame: eventInitDict.frame,
            inputSource: eventInitDict.inputSource
        };
        // safari bug:  super() seems to return object of type Event, with Event as prototype
        Object.setPrototypeOf(this, XRInputSourceEvent.prototype);
    }
    /**
   * @return {XRFrame}
   */ get frame() {
        return this[PRIVATE].frame;
    }
    /**
   * @return {XRInputSource}
   */ get inputSource() {
        return this[PRIVATE].inputSource;
    }
}
exports.default = XRInputSourceEvent;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1ExMI":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRSessionEvent");
class XRSessionEvent extends Event {
    /**
   * @param {string} type
   * @param {Object} eventInitDict
   */ constructor(type, eventInitDict){
        super(type, eventInitDict);
        this[PRIVATE] = {
            session: eventInitDict.session
        };
        // safari bug:  super() seems to return object of type Event, with Event as prototype
        Object.setPrototypeOf(this, XRSessionEvent.prototype);
    }
    /**
   * @return {XRSession}
   */ get session() {
        return this[PRIVATE].session;
    }
}
exports.default = XRSessionEvent;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8IPvK":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRInputSourcesChangeEvent");
class XRInputSourcesChangeEvent extends Event {
    /**
   * @param {string} type
   * @param {Object} eventInitDict
   */ constructor(type, eventInitDict){
        super(type, eventInitDict);
        this[PRIVATE] = {
            session: eventInitDict.session,
            added: eventInitDict.added,
            removed: eventInitDict.removed
        };
        // safari bug:  super() seems to return object of type Event, with Event as prototype
        Object.setPrototypeOf(this, XRInputSourcesChangeEvent.prototype);
    }
    /**
   * @return {XRSession}
   */ get session() {
        return this[PRIVATE].session;
    }
    /**
   * @return {Array<XRInputSource>}
   */ get added() {
        return this[PRIVATE].added;
    }
    /**
   * @return {Array<XRInputSource>}
   */ get removed() {
        return this[PRIVATE].removed;
    }
}
exports.default = XRInputSourcesChangeEvent;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eIB3M":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _xrspace = require("./XRSpace");
var _xrspaceDefault = parcelHelpers.interopDefault(_xrspace);
const PRIVATE = Symbol("@@webxr-polyfill/XRInputSource");
class XRInputSource {
    /**
   * @param {GamepadXRInputSource} impl 
   */ constructor(impl){
        this[PRIVATE] = {
            impl,
            gripSpace: new (0, _xrspaceDefault.default)("grip", this),
            targetRaySpace: new (0, _xrspaceDefault.default)("target-ray", this)
        };
    }
    /**
   * @return {XRHandedness}
   */ get handedness() {
        return this[PRIVATE].impl.handedness;
    }
    /**
   * @return {XRTargetRayMode}
   */ get targetRayMode() {
        return this[PRIVATE].impl.targetRayMode;
    }
    /**
   * @return {XRSpace}
   */ get gripSpace() {
        let mode = this[PRIVATE].impl.targetRayMode;
        if (mode === "gaze" || mode === "screen") // grip space must be null for non-trackable input sources
        return null;
        return this[PRIVATE].gripSpace;
    }
    /**
   * @return {XRSpace}
   */ get targetRaySpace() {
        return this[PRIVATE].targetRaySpace;
    }
    /**
   * @return {Array<String>}
   */ get profiles() {
        return this[PRIVATE].impl.profiles;
    }
    /**
   * @return {Gamepad}
   */ get gamepad() {
        return this[PRIVATE].impl.gamepad;
    }
}
exports.default = XRInputSource;

},{"./XRSpace":"3TNNg","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4apJK":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
parcelHelpers.export(exports, "XRWebGLLayerInit", ()=>XRWebGLLayerInit);
var _xrsession = require("./XRSession");
var _xrsessionDefault = parcelHelpers.interopDefault(_xrsession);
var _constants = require("../constants");
const PRIVATE = Symbol("@@webxr-polyfill/XRWebGLLayer");
const XRWebGLLayerInit = Object.freeze({
    antialias: true,
    depth: true,
    stencil: false,
    alpha: true,
    multiview: false,
    ignoreDepthValues: false,
    framebufferScaleFactor: 1.0
});
class XRWebGLLayer {
    /**
   * @param {XRSession} session 
   * @param {XRWebGLRenderingContext} context 
   * @param {Object?} layerInit 
   */ constructor(session, context, layerInit = {}){
        const config = Object.assign({}, XRWebGLLayerInit, layerInit);
        if (!(session instanceof (0, _xrsessionDefault.default))) throw new Error("session must be a XRSession");
        if (session.ended) throw new Error(`InvalidStateError`);
        // Since we're polyfilling, we're probably polyfilling
        // the compatible XR device bit as well. It'd be
        // unusual for this bit to not be polyfilled.
        if (context[0, _constants.POLYFILLED_XR_COMPATIBLE]) {
            if (context[0, _constants.XR_COMPATIBLE] !== true) throw new Error(`InvalidStateError`);
        }
        this[PRIVATE] = {
            context,
            config,
            session
        };
    }
    /**
   * @return {WebGLRenderingContext}
   */ get context() {
        return this[PRIVATE].context;
    }
    /**
   * @return {boolean}
   */ get antialias() {
        return this[PRIVATE].config.antialias;
    }
    /**
   * The polyfill will always ignore depth values.
   *
   * @return {boolean}
   */ get ignoreDepthValues() {
        return true;
    }
    /**
   * @return {WebGLFramebuffer}
   */ get framebuffer() {
        // Use the default framebuffer
        return null;
    }
    /**
   * @return {number}
   */ get framebufferWidth() {
        return this[PRIVATE].context.drawingBufferWidth;
    }
    /**
   * @return {number}
   */ get framebufferHeight() {
        return this[PRIVATE].context.drawingBufferHeight;
    }
    /**
   * @return {XRSession}
   */ get _session() {
        return this[PRIVATE].session;
    }
    /**
   * @TODO No mention in spec on not reusing the XRViewport on every frame.
   * 
   * @TODO In the future maybe all this logic should be handled here instead of
   * delegated to the XRView?
   *
   * @param {XRView} view
   * @return {XRViewport?}
   */ getViewport(view) {
        return view._getViewport(this);
    }
    /**
   * Gets the scale factor to be requested if you want to match the device
   * resolution at the center of the user's vision. The polyfill will always
   * report 1.0.
   * 
   * @param {XRSession} session 
   * @return {number}
   */ static getNativeFramebufferScaleFactor(session) {
        if (!session) throw new TypeError("getNativeFramebufferScaleFactor must be passed a session.");
        if (session[0, _xrsession.PRIVATE].ended) return 0.0;
        return 1.0;
    }
}
exports.default = XRWebGLLayer;

},{"./XRSession":"4yNN0","../constants":"aMdg6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aMdg6":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Token for storing whether or not a WebGLRenderingContext has
 * a polyfill for `xrCompatible`/`makeXRCompatible()`
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "POLYFILLED_XR_COMPATIBLE", ()=>POLYFILLED_XR_COMPATIBLE);
parcelHelpers.export(exports, "XR_COMPATIBLE", ()=>XR_COMPATIBLE);
const POLYFILLED_XR_COMPATIBLE = Symbol("@@webxr-polyfill/polyfilled-xr-compatible");
const XR_COMPATIBLE = Symbol("@@webxr-polyfill/xr-compatible");

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fphje":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
const PRIVATE = Symbol("@@webxr-polyfill/XRReferenceSpaceEvent");
class XRReferenceSpaceEvent extends Event {
    /**
   * @param {string} type
   * @param {Object} eventInitDict
   */ constructor(type, eventInitDict){
        super(type, eventInitDict);
        this[PRIVATE] = {
            referenceSpace: eventInitDict.referenceSpace,
            transform: eventInitDict.transform || null
        };
        // safari bug:  super() seems to return object of type Event, with Event as prototype
        Object.setPrototypeOf(this, XRReferenceSpaceEvent.prototype);
    }
    /**
   * @return {XRFrame}
   */ get referenceSpace() {
        return this[PRIVATE].referenceSpace;
    }
    /**
   * @return {XRInputSource}
   */ get transform() {
        return this[PRIVATE].transform;
    }
}
exports.default = XRReferenceSpaceEvent;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"juiof":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _global = require("./lib/global");
var _globalDefault = parcelHelpers.interopDefault(_global);
var _index = require("./api/index");
var _indexDefault = parcelHelpers.interopDefault(_index);
var _polyfillGlobals = require("./polyfill-globals");
var _utils = require("./utils");
var _devices = require("./devices");
const CONFIG_DEFAULTS = {
    // The default global to use for needed APIs.
    global: (0, _globalDefault.default),
    // Whether support for a browser implementing WebVR 1.1 is enabled.
    // If enabled, XR support is powered by native WebVR 1.1 VRDisplays,
    // exposed as XRDevices.
    webvr: true,
    // Whether a CardboardXRDevice should be discoverable if on
    // a mobile device, and no other native (1.1 VRDisplay if `webvr` on,
    // or XRDevice) found.
    cardboard: true,
    // The configuration to be used for CardboardVRDisplay when used.
    // Has no effect if `cardboard: false` or another XRDevice is used.
    // Configuration can be found: https://github.com/immersive-web/cardboard-vr-display/blob/master/src/options.js
    cardboardConfig: null,
    // Whether a CardboardXRDevice should be created if no WebXR API found
    // on desktop or not. Stereoscopic rendering with a gyro often does not make sense on desktop, and probably only useful for debugging.
    allowCardboardOnDesktop: false
};
const partials = [
    "navigator",
    "HTMLCanvasElement",
    "WebGLRenderingContext"
];
class WebXRPolyfill {
    /**
   * @param {object?} config
   */ constructor(config = {}){
        this.config = Object.freeze(Object.assign({}, CONFIG_DEFAULTS, config));
        this.global = this.config.global;
        this.nativeWebXR = "xr" in this.global.navigator;
        this.injected = false;
        this._injectPolyfill(this.global);
    }
    _injectPolyfill(global) {
        if (!partials.every((iface)=>!!global[iface])) throw new Error(`Global must have the following attributes : ${partials}`);
        // Apply classes as globals
        for (const className of Object.keys((0, _indexDefault.default)))if (global[className] !== undefined) console.warn(`${className} already defined on global.`);
        else global[className] = (0, _indexDefault.default)[className];
        {
            // Attempts to polyfill WebGLRenderingContext's `makeXRCompatible`
            // if it does not exist.
            const polyfilledCtx = (0, _polyfillGlobals.polyfillMakeXRCompatible)(global.WebGLRenderingContext);
            // If we polyfilled `makeXRCompatible`, also polyfill the context creation
            // parameter `{ xrCompatible }`.
            if (polyfilledCtx) {
                (0, _polyfillGlobals.polyfillGetContext)(global.HTMLCanvasElement);
                // If OffscreenCanvas is available, patch its `getContext` method as well
                // for the compatible XRDevice bit.
                if (global.OffscreenCanvas) (0, _polyfillGlobals.polyfillGetContext)(global.OffscreenCanvas);
                // If we needed to polyfill WebGLRenderingContext, do the same
                // for WebGL2 contexts if it exists.
                if (global.WebGL2RenderingContext) (0, _polyfillGlobals.polyfillMakeXRCompatible)(global.WebGL2RenderingContext);
                if (!window.isSecureContext) console.warn(`WebXR Polyfill Warning:
This page is not running in a secure context (https:// or localhost)!
This means that although the page may be able to use the WebXR Polyfill it will
not be able to use native WebXR implementations, and as such will not be able to
access dedicated VR or AR hardware, and will not be able to take advantage of
any performance improvements a native WebXR implementation may offer. Please
host this content on a secure origin for the best user experience.
`);
            }
        }
        this.injected = true;
        this._patchNavigatorXR();
    }
    _patchNavigatorXR() {
        // Request a polyfilled XRDevice.
        let devicePromise = (0, _devices.requestXRDevice)(this.global, this.config);
        // Create `navigator.xr` instance populated with the XRDevice promise
        // requested above. The promise resolve will be monitored by the XR object.
        this.xr = new (0, _indexDefault.default).XRSystem(devicePromise);
        Object.defineProperty(this.global.navigator, "xr", {
            value: this.xr,
            configurable: true
        });
    }
    _injectCompatibilityShims(global) {
        if (!partials.every((iface)=>!!global[iface])) throw new Error(`Global must have the following attributes : ${partials}`);
        // Patch for Chrome 76-78: exposed supportsSession rather than
        // isSessionSupported. Wraps the function to ensure the promise properly
        // resolves with a boolean.
        if (global.navigator.xr && "supportsSession" in global.navigator.xr && !("isSessionSupported" in global.navigator.xr)) {
            let originalSupportsSession = global.navigator.xr.supportsSession;
            global.navigator.xr.isSessionSupported = function(mode) {
                return originalSupportsSession.call(this, mode).then(()=>{
                    return true;
                }).catch(()=>{
                    return false;
                });
            };
            global.navigator.xr.supportsSession = function(mode) {
                console.warn("navigator.xr.supportsSession() is deprecated. Please call navigator.xr.isSessionSupported() instead and check the boolean value returned when the promise resolves.");
                return originalSupportsSession.call(this, mode);
            };
        }
    }
}
exports.default = WebXRPolyfill;

},{"./lib/global":"8mhRr","./api/index":"75ow1","./polyfill-globals":"2sQez","./utils":"3ahP8","./devices":"lN7Wp","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2sQez":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "polyfillMakeXRCompatible", ()=>polyfillMakeXRCompatible);
parcelHelpers.export(exports, "polyfillGetContext", ()=>polyfillGetContext);
var _constants = require("./constants");
const contextTypes = [
    "webgl",
    "experimental-webgl"
];
const polyfillMakeXRCompatible = (Context)=>{
    typeof Context.prototype.makeXRCompatible;
    // Create `makeXRCompatible` and if successful, store
    // the XRDevice as a private attribute for error checking
    Context.prototype.makeXRCompatible = function() {
        this[0, _constants.XR_COMPATIBLE] = true;
        // This is all fake, so just resolve immediately.
        return Promise.resolve();
    };
    return true;
};
const polyfillGetContext = (Canvas)=>{
    const getContext = Canvas.prototype.getContext;
    Canvas.prototype.getContext = function(contextType, glAttribs) {
        const ctx = getContext.call(this, contextType, glAttribs);
        if (ctx) {
            // Set this bit so the API knows the WebGLRenderingContext is
            // also polyfilled a bit
            ctx[0, _constants.POLYFILLED_XR_COMPATIBLE] = true;
            // If we've polyfilled WebGLRenderingContext's xrCompatible
            // bit, store the boolean in the private token if created via
            // creation parameters
            if (glAttribs && "xrCompatible" in glAttribs) ctx[0, _constants.XR_COMPATIBLE] = glAttribs.xrCompatible;
        }
        return ctx;
    };
};

},{"./constants":"aMdg6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3ahP8":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Whether or an ImageBitMapRenderingContext should be used to polyfill
 * an XRPresentationContext.
 *
 * @return {Boolean}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isImageBitmapSupported", ()=>isImageBitmapSupported);
parcelHelpers.export(exports, "isMobile", ()=>isMobile);
parcelHelpers.export(exports, "applyCanvasStylesForMinimalRendering", ()=>applyCanvasStylesForMinimalRendering);
const isImageBitmapSupported = (global)=>!!(global.ImageBitmapRenderingContext && global.createImageBitmap);
const isMobile = (global)=>{
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(global.navigator.userAgent || global.navigator.vendor || global.opera);
    return check;
};
const applyCanvasStylesForMinimalRendering = (canvas)=>{
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.width = canvas.style.height = "1px";
    canvas.style.top = canvas.style.left = "0px";
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lN7Wp":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "requestXRDevice", ()=>requestXRDevice);
var _cardboardXRDevice = require("./devices/CardboardXRDevice");
var _cardboardXRDeviceDefault = parcelHelpers.interopDefault(_cardboardXRDevice);
var _inlineDevice = require("./devices/InlineDevice");
var _inlineDeviceDefault = parcelHelpers.interopDefault(_inlineDevice);
var _webVRDevice = require("./devices/WebVRDevice");
var _webVRDeviceDefault = parcelHelpers.interopDefault(_webVRDevice);
var _utils = require("./utils");
/**
 * Queries browser to see if any VRDisplay exists.
 * Resolves to a polyfilled XRDevice or null.
 */ const getWebVRDevice = async function(global) {
    let device = null;
    if ("getVRDisplays" in global.navigator) try {
        const displays = await global.navigator.getVRDisplays();
        if (displays && displays.length) device = new (0, _webVRDeviceDefault.default)(global, displays[0]);
    } catch (e) {}
    return device;
};
const requestXRDevice = async function(global, config) {
    // Check for a 1.1 VRDisplay.
    if (config.webvr) {
        let xr = await getWebVRDevice(global);
        if (xr) return xr;
    }
    // If no WebVR devices are present, check to see if a Cardboard device is
    // allowed and if so return that.
    // TODO: This probably requires more changes to allow creating an
    // immersive session in a headset that gets connected later.
    let mobile = (0, _utils.isMobile)(global);
    if (mobile && config.cardboard || !mobile && config.allowCardboardOnDesktop) {
        // If we're on Cardboard, make sure that VRFrameData is a global
        if (!global.VRFrameData) global.VRFrameData = function() {
            this.rightViewMatrix = new Float32Array(16);
            this.leftViewMatrix = new Float32Array(16);
            this.rightProjectionMatrix = new Float32Array(16);
            this.leftProjectionMatrix = new Float32Array(16);
            this.pose = null;
        };
        return new (0, _cardboardXRDeviceDefault.default)(global, config.cardboardConfig);
    }
    // Inline sessions are always allowed, so if no other device is available
    // create one that only supports sensorless inline sessions.
    return new (0, _inlineDeviceDefault.default)(global);
};

},{"./devices/CardboardXRDevice":"kaWuc","./devices/InlineDevice":"g8mvS","./devices/WebVRDevice":"gZ9LI","./utils":"3ahP8","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kaWuc":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _cardboardVrDisplay = require("cardboard-vr-display");
var _cardboardVrDisplayDefault = parcelHelpers.interopDefault(_cardboardVrDisplay);
var _webVRDevice = require("./WebVRDevice");
var _webVRDeviceDefault = parcelHelpers.interopDefault(_webVRDevice);
var global = arguments[3];
class CardboardXRDevice extends (0, _webVRDeviceDefault.default) {
    /**
   * Takes a VRDisplay instance and a VRFrameData
   * constructor from the WebVR 1.1 spec.
   *
   * @param {VRDisplay} display
   * @param {Object?} cardboardConfig
   */ constructor(global1, cardboardConfig){
        const display = new (0, _cardboardVrDisplayDefault.default)(cardboardConfig || {});
        super(global, display);
        this.display = display;
        this.frame = {
            rightViewMatrix: new Float32Array(16),
            leftViewMatrix: new Float32Array(16),
            rightProjectionMatrix: new Float32Array(16),
            leftProjectionMatrix: new Float32Array(16),
            pose: null,
            timestamp: null
        };
    }
}
exports.default = CardboardXRDevice;

},{"cardboard-vr-display":"4Z7c1","./WebVRDevice":"gZ9LI","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4Z7c1":[function(require,module,exports) {
var global = arguments[3];
/**
 * @license
 * cardboard-vr-display
 * Copyright (c) 2015-2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * @license
 * gl-preserve-state
 * Copyright (c) 2016, Brandon Jones.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */ /**
 * @license
 * webvr-polyfill-dpdb
 * Copyright (c) 2015-2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * @license
 * nosleep.js
 * Copyright (c) 2017, Rich Tibbett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */ (function(global, factory) {
    module.exports = factory();
})(this, function() {
    "use strict";
    var asyncGenerator = function() {
        function AwaitValue(value) {
            this.value = value;
        }
        function AsyncGenerator(gen) {
            var front, back;
            function send(key, arg) {
                return new Promise(function(resolve, reject) {
                    var request = {
                        key: key,
                        arg: arg,
                        resolve: resolve,
                        reject: reject,
                        next: null
                    };
                    if (back) back = back.next = request;
                    else {
                        front = back = request;
                        resume(key, arg);
                    }
                });
            }
            function resume(key, arg) {
                try {
                    var result = gen[key](arg);
                    var value = result.value;
                    if (value instanceof AwaitValue) Promise.resolve(value.value).then(function(arg) {
                        resume("next", arg);
                    }, function(arg) {
                        resume("throw", arg);
                    });
                    else settle(result.done ? "return" : "normal", result.value);
                } catch (err) {
                    settle("throw", err);
                }
            }
            function settle(type, value) {
                switch(type){
                    case "return":
                        front.resolve({
                            value: value,
                            done: true
                        });
                        break;
                    case "throw":
                        front.reject(value);
                        break;
                    default:
                        front.resolve({
                            value: value,
                            done: false
                        });
                        break;
                }
                front = front.next;
                if (front) resume(front.key, front.arg);
                else back = null;
            }
            this._invoke = send;
            if (typeof gen.return !== "function") this.return = undefined;
        }
        if (typeof Symbol === "function" && Symbol.asyncIterator) AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
            return this;
        };
        AsyncGenerator.prototype.next = function(arg) {
            return this._invoke("next", arg);
        };
        AsyncGenerator.prototype.throw = function(arg) {
            return this._invoke("throw", arg);
        };
        AsyncGenerator.prototype.return = function(arg) {
            return this._invoke("return", arg);
        };
        return {
            wrap: function(fn) {
                return function() {
                    return new AsyncGenerator(fn.apply(this, arguments));
                };
            },
            await: function(value) {
                return new AwaitValue(value);
            }
        };
    }();
    var classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    };
    var createClass = function() {
        function defineProperties(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    var slicedToArray = function() {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
                for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally{
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally{
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
        return function(arr, i) {
            if (Array.isArray(arr)) return arr;
            else if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
            else throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
    }();
    var MIN_TIMESTEP = 0.001;
    var MAX_TIMESTEP = 1;
    var dataUri = function dataUri(mimeType, svg) {
        return "data:" + mimeType + "," + encodeURIComponent(svg);
    };
    var lerp = function lerp(a, b, t) {
        return a + (b - a) * t;
    };
    var isIOS = function() {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        return function() {
            return isIOS;
        };
    }();
    var isWebViewAndroid = function() {
        var isWebViewAndroid = navigator.userAgent.indexOf("Version") !== -1 && navigator.userAgent.indexOf("Android") !== -1 && navigator.userAgent.indexOf("Chrome") !== -1;
        return function() {
            return isWebViewAndroid;
        };
    }();
    var isSafari = function() {
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return function() {
            return isSafari;
        };
    }();
    var isFirefoxAndroid = function() {
        var isFirefoxAndroid = navigator.userAgent.indexOf("Firefox") !== -1 && navigator.userAgent.indexOf("Android") !== -1;
        return function() {
            return isFirefoxAndroid;
        };
    }();
    var getChromeVersion = function() {
        var match = navigator.userAgent.match(/.*Chrome\/([0-9]+)/);
        var value = match ? parseInt(match[1], 10) : null;
        return function() {
            return value;
        };
    }();
    var isSafariWithoutDeviceMotion = function() {
        var value = false;
        value = isIOS() && isSafari() && navigator.userAgent.indexOf("13_4") !== -1;
        return function() {
            return value;
        };
    }();
    var isChromeWithoutDeviceMotion = function() {
        var value = false;
        if (getChromeVersion() === 65) {
            var match = navigator.userAgent.match(/.*Chrome\/([0-9\.]*)/);
            if (match) {
                var _match$1$split = match[1].split("."), _match$1$split2 = slicedToArray(_match$1$split, 4), major = _match$1$split2[0], minor = _match$1$split2[1], branch = _match$1$split2[2], build = _match$1$split2[3];
                value = parseInt(branch, 10) === 3325 && parseInt(build, 10) < 148;
            }
        }
        return function() {
            return value;
        };
    }();
    var isR7 = function() {
        var isR7 = navigator.userAgent.indexOf("R7 Build") !== -1;
        return function() {
            return isR7;
        };
    }();
    var isLandscapeMode = function isLandscapeMode() {
        var rtn = window.orientation == 90 || window.orientation == -90;
        return isR7() ? !rtn : rtn;
    };
    var isTimestampDeltaValid = function isTimestampDeltaValid(timestampDeltaS) {
        if (isNaN(timestampDeltaS)) return false;
        if (timestampDeltaS <= MIN_TIMESTEP) return false;
        if (timestampDeltaS > MAX_TIMESTEP) return false;
        return true;
    };
    var getScreenWidth = function getScreenWidth() {
        return Math.max(window.screen.width, window.screen.height) * window.devicePixelRatio;
    };
    var getScreenHeight = function getScreenHeight() {
        return Math.min(window.screen.width, window.screen.height) * window.devicePixelRatio;
    };
    var requestFullscreen = function requestFullscreen(element) {
        if (isWebViewAndroid()) return false;
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        else return false;
        return true;
    };
    var exitFullscreen = function exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        else return false;
        return true;
    };
    var getFullscreenElement = function getFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    };
    var linkProgram = function linkProgram(gl, vertexSource, fragmentSource, attribLocationMap) {
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        for(var attribName in attribLocationMap)gl.bindAttribLocation(program, attribLocationMap[attribName], attribName);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return program;
    };
    var getProgramUniforms = function getProgramUniforms(gl, program) {
        var uniforms = {};
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        var uniformName = "";
        for(var i = 0; i < uniformCount; i++){
            var uniformInfo = gl.getActiveUniform(program, i);
            uniformName = uniformInfo.name.replace("[0]", "");
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    };
    var orthoMatrix = function orthoMatrix(out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    };
    var isMobile = function isMobile() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    var extend = function extend(dest, src) {
        for(var key in src)if (src.hasOwnProperty(key)) dest[key] = src[key];
        return dest;
    };
    var safariCssSizeWorkaround = function safariCssSizeWorkaround(canvas) {
        if (isIOS()) {
            var width = canvas.style.width;
            var height = canvas.style.height;
            canvas.style.width = parseInt(width) + 1 + "px";
            canvas.style.height = parseInt(height) + "px";
            setTimeout(function() {
                canvas.style.width = width;
                canvas.style.height = height;
            }, 100);
        }
        window.canvas = canvas;
    };
    var frameDataFromPose = function() {
        var piOver180 = Math.PI / 180.0;
        var rad45 = Math.PI * 0.25;
        function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
            var upTan = Math.tan(fov ? fov.upDegrees * piOver180 : rad45), downTan = Math.tan(fov ? fov.downDegrees * piOver180 : rad45), leftTan = Math.tan(fov ? fov.leftDegrees * piOver180 : rad45), rightTan = Math.tan(fov ? fov.rightDegrees * piOver180 : rad45), xScale = 2.0 / (leftTan + rightTan), yScale = 2.0 / (upTan + downTan);
            out[0] = xScale;
            out[1] = 0.0;
            out[2] = 0.0;
            out[3] = 0.0;
            out[4] = 0.0;
            out[5] = yScale;
            out[6] = 0.0;
            out[7] = 0.0;
            out[8] = -((leftTan - rightTan) * xScale * 0.5);
            out[9] = (upTan - downTan) * yScale * 0.5;
            out[10] = far / (near - far);
            out[11] = -1;
            out[12] = 0.0;
            out[13] = 0.0;
            out[14] = far * near / (near - far);
            out[15] = 0.0;
            return out;
        }
        function mat4_fromRotationTranslation(out, q, v) {
            var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }
        function mat4_translate(out, a, v) {
            var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
            if (a === out) {
                out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            } else {
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a20;
                out[9] = a21;
                out[10] = a22;
                out[11] = a23;
                out[12] = a00 * x + a10 * y + a20 * z + a[12];
                out[13] = a01 * x + a11 * y + a21 * z + a[13];
                out[14] = a02 * x + a12 * y + a22 * z + a[14];
                out[15] = a03 * x + a13 * y + a23 * z + a[15];
            }
            return out;
        }
        function mat4_invert(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) return null;
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            return out;
        }
        var defaultOrientation = new Float32Array([
            0,
            0,
            0,
            1
        ]);
        var defaultPosition = new Float32Array([
            0,
            0,
            0
        ]);
        function updateEyeMatrices(projection, view, pose, fov, offset, vrDisplay) {
            mat4_perspectiveFromFieldOfView(projection, fov || null, vrDisplay.depthNear, vrDisplay.depthFar);
            var orientation = pose.orientation || defaultOrientation;
            var position = pose.position || defaultPosition;
            mat4_fromRotationTranslation(view, orientation, position);
            if (offset) mat4_translate(view, view, offset);
            mat4_invert(view, view);
        }
        return function(frameData, pose, vrDisplay) {
            if (!frameData || !pose) return false;
            frameData.pose = pose;
            frameData.timestamp = pose.timestamp;
            updateEyeMatrices(frameData.leftProjectionMatrix, frameData.leftViewMatrix, pose, vrDisplay._getFieldOfView("left"), vrDisplay._getEyeOffset("left"), vrDisplay);
            updateEyeMatrices(frameData.rightProjectionMatrix, frameData.rightViewMatrix, pose, vrDisplay._getFieldOfView("right"), vrDisplay._getEyeOffset("right"), vrDisplay);
            return true;
        };
    }();
    var isInsideCrossOriginIFrame = function isInsideCrossOriginIFrame() {
        var isFramed = window.self !== window.top;
        var refOrigin = getOriginFromUrl(document.referrer);
        var thisOrigin = getOriginFromUrl(window.location.href);
        return isFramed && refOrigin !== thisOrigin;
    };
    var getOriginFromUrl = function getOriginFromUrl(url) {
        var domainIdx;
        var protoSepIdx = url.indexOf("://");
        if (protoSepIdx !== -1) domainIdx = protoSepIdx + 3;
        else domainIdx = 0;
        var domainEndIdx = url.indexOf("/", domainIdx);
        if (domainEndIdx === -1) domainEndIdx = url.length;
        return url.substring(0, domainEndIdx);
    };
    var getQuaternionAngle = function getQuaternionAngle(quat) {
        if (quat.w > 1) {
            console.warn("getQuaternionAngle: w > 1");
            return 0;
        }
        var angle = 2 * Math.acos(quat.w);
        return angle;
    };
    var warnOnce = function() {
        var observedWarnings = {};
        return function(key, message) {
            if (observedWarnings[key] === undefined) {
                console.warn("webvr-polyfill: " + message);
                observedWarnings[key] = true;
            }
        };
    }();
    var deprecateWarning = function deprecateWarning(deprecated, suggested) {
        var alternative = suggested ? "Please use " + suggested + " instead." : "";
        warnOnce(deprecated, deprecated + " has been deprecated. " + "This may not work on native WebVR displays. " + alternative);
    };
    function WGLUPreserveGLState(gl, bindings, callback) {
        if (!bindings) {
            callback(gl);
            return;
        }
        var boundValues = [];
        var activeTexture = null;
        for(var i = 0; i < bindings.length; ++i){
            var binding = bindings[i];
            switch(binding){
                case gl.TEXTURE_BINDING_2D:
                case gl.TEXTURE_BINDING_CUBE_MAP:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {
                        console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit");
                        boundValues.push(null, null);
                        break;
                    }
                    if (!activeTexture) activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
                    gl.activeTexture(textureUnit);
                    boundValues.push(gl.getParameter(binding), null);
                    break;
                case gl.ACTIVE_TEXTURE:
                    activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
                    boundValues.push(null);
                    break;
                default:
                    boundValues.push(gl.getParameter(binding));
                    break;
            }
        }
        callback(gl);
        for(var i = 0; i < bindings.length; ++i){
            var binding = bindings[i];
            var boundValue = boundValues[i];
            switch(binding){
                case gl.ACTIVE_TEXTURE:
                    break;
                case gl.ARRAY_BUFFER_BINDING:
                    gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);
                    break;
                case gl.COLOR_CLEAR_VALUE:
                    gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.COLOR_WRITEMASK:
                    gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.CURRENT_PROGRAM:
                    gl.useProgram(boundValue);
                    break;
                case gl.ELEMENT_ARRAY_BUFFER_BINDING:
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);
                    break;
                case gl.FRAMEBUFFER_BINDING:
                    gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);
                    break;
                case gl.RENDERBUFFER_BINDING:
                    gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);
                    break;
                case gl.TEXTURE_BINDING_2D:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) break;
                    gl.activeTexture(textureUnit);
                    gl.bindTexture(gl.TEXTURE_2D, boundValue);
                    break;
                case gl.TEXTURE_BINDING_CUBE_MAP:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) break;
                    gl.activeTexture(textureUnit);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);
                    break;
                case gl.VIEWPORT:
                    gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.BLEND:
                case gl.CULL_FACE:
                case gl.DEPTH_TEST:
                case gl.SCISSOR_TEST:
                case gl.STENCIL_TEST:
                    if (boundValue) gl.enable(binding);
                    else gl.disable(binding);
                    break;
                default:
                    console.log("No GL restore behavior for 0x" + binding.toString(16));
                    break;
            }
            if (activeTexture) gl.activeTexture(activeTexture);
        }
    }
    var glPreserveState = WGLUPreserveGLState;
    var distortionVS = [
        "attribute vec2 position;",
        "attribute vec3 texCoord;",
        "varying vec2 vTexCoord;",
        "uniform vec4 viewportOffsetScale[2];",
        "void main() {",
        "  vec4 viewport = viewportOffsetScale[int(texCoord.z)];",
        "  vTexCoord = (texCoord.xy * viewport.zw) + viewport.xy;",
        "  gl_Position = vec4( position, 1.0, 1.0 );",
        "}"
    ].join("\n");
    var distortionFS = [
        "precision mediump float;",
        "uniform sampler2D diffuse;",
        "varying vec2 vTexCoord;",
        "void main() {",
        "  gl_FragColor = texture2D(diffuse, vTexCoord);",
        "}"
    ].join("\n");
    function CardboardDistorter(gl, cardboardUI, bufferScale, dirtySubmitFrameBindings) {
        this.gl = gl;
        this.cardboardUI = cardboardUI;
        this.bufferScale = bufferScale;
        this.dirtySubmitFrameBindings = dirtySubmitFrameBindings;
        this.ctxAttribs = gl.getContextAttributes();
        this.instanceExt = gl.getExtension("ANGLE_instanced_arrays");
        this.meshWidth = 20;
        this.meshHeight = 20;
        this.bufferWidth = gl.drawingBufferWidth;
        this.bufferHeight = gl.drawingBufferHeight;
        this.realBindFramebuffer = gl.bindFramebuffer;
        this.realEnable = gl.enable;
        this.realDisable = gl.disable;
        this.realColorMask = gl.colorMask;
        this.realClearColor = gl.clearColor;
        this.realViewport = gl.viewport;
        if (!isIOS()) {
            this.realCanvasWidth = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, "width");
            this.realCanvasHeight = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, "height");
        }
        this.isPatched = false;
        this.lastBoundFramebuffer = null;
        this.cullFace = false;
        this.depthTest = false;
        this.blend = false;
        this.scissorTest = false;
        this.stencilTest = false;
        this.viewport = [
            0,
            0,
            0,
            0
        ];
        this.colorMask = [
            true,
            true,
            true,
            true
        ];
        this.clearColor = [
            0,
            0,
            0,
            0
        ];
        this.attribs = {
            position: 0,
            texCoord: 1
        };
        this.program = linkProgram(gl, distortionVS, distortionFS, this.attribs);
        this.uniforms = getProgramUniforms(gl, this.program);
        this.viewportOffsetScale = new Float32Array(8);
        this.setTextureBounds();
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indexCount = 0;
        this.renderTarget = gl.createTexture();
        this.framebuffer = gl.createFramebuffer();
        this.depthStencilBuffer = null;
        this.depthBuffer = null;
        this.stencilBuffer = null;
        if (this.ctxAttribs.depth && this.ctxAttribs.stencil) this.depthStencilBuffer = gl.createRenderbuffer();
        else if (this.ctxAttribs.depth) this.depthBuffer = gl.createRenderbuffer();
        else if (this.ctxAttribs.stencil) this.stencilBuffer = gl.createRenderbuffer();
        this.patch();
        this.onResize();
    }
    CardboardDistorter.prototype.destroy = function() {
        var gl = this.gl;
        this.unpatch();
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteTexture(this.renderTarget);
        gl.deleteFramebuffer(this.framebuffer);
        if (this.depthStencilBuffer) gl.deleteRenderbuffer(this.depthStencilBuffer);
        if (this.depthBuffer) gl.deleteRenderbuffer(this.depthBuffer);
        if (this.stencilBuffer) gl.deleteRenderbuffer(this.stencilBuffer);
        if (this.cardboardUI) this.cardboardUI.destroy();
    };
    CardboardDistorter.prototype.onResize = function() {
        var gl = this.gl;
        var self1 = this;
        var glState = [
            gl.RENDERBUFFER_BINDING,
            gl.TEXTURE_BINDING_2D,
            gl.TEXTURE0
        ];
        glPreserveState(gl, glState, function(gl) {
            self1.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
            if (self1.scissorTest) self1.realDisable.call(gl, gl.SCISSOR_TEST);
            self1.realColorMask.call(gl, true, true, true, true);
            self1.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            self1.realClearColor.call(gl, 0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            self1.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self1.framebuffer);
            gl.bindTexture(gl.TEXTURE_2D, self1.renderTarget);
            gl.texImage2D(gl.TEXTURE_2D, 0, self1.ctxAttribs.alpha ? gl.RGBA : gl.RGB, self1.bufferWidth, self1.bufferHeight, 0, self1.ctxAttribs.alpha ? gl.RGBA : gl.RGB, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, self1.renderTarget, 0);
            if (self1.ctxAttribs.depth && self1.ctxAttribs.stencil) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self1.depthStencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, self1.bufferWidth, self1.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, self1.depthStencilBuffer);
            } else if (self1.ctxAttribs.depth) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self1.depthBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, self1.bufferWidth, self1.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, self1.depthBuffer);
            } else if (self1.ctxAttribs.stencil) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self1.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, self1.bufferWidth, self1.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, self1.stencilBuffer);
            }
            if (!gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) console.error("Framebuffer incomplete!");
            self1.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self1.lastBoundFramebuffer);
            if (self1.scissorTest) self1.realEnable.call(gl, gl.SCISSOR_TEST);
            self1.realColorMask.apply(gl, self1.colorMask);
            self1.realViewport.apply(gl, self1.viewport);
            self1.realClearColor.apply(gl, self1.clearColor);
        });
        if (this.cardboardUI) this.cardboardUI.onResize();
    };
    CardboardDistorter.prototype.patch = function() {
        if (this.isPatched) return;
        var self1 = this;
        var canvas = this.gl.canvas;
        var gl = this.gl;
        if (!isIOS()) {
            canvas.width = getScreenWidth() * this.bufferScale;
            canvas.height = getScreenHeight() * this.bufferScale;
            Object.defineProperty(canvas, "width", {
                configurable: true,
                enumerable: true,
                get: function get() {
                    return self1.bufferWidth;
                },
                set: function set(value) {
                    self1.bufferWidth = value;
                    self1.realCanvasWidth.set.call(canvas, value);
                    self1.onResize();
                }
            });
            Object.defineProperty(canvas, "height", {
                configurable: true,
                enumerable: true,
                get: function get() {
                    return self1.bufferHeight;
                },
                set: function set(value) {
                    self1.bufferHeight = value;
                    self1.realCanvasHeight.set.call(canvas, value);
                    self1.onResize();
                }
            });
        }
        this.lastBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (this.lastBoundFramebuffer == null) {
            this.lastBoundFramebuffer = this.framebuffer;
            this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        }
        this.gl.bindFramebuffer = function(target, framebuffer) {
            self1.lastBoundFramebuffer = framebuffer ? framebuffer : self1.framebuffer;
            self1.realBindFramebuffer.call(gl, target, self1.lastBoundFramebuffer);
        };
        this.cullFace = gl.getParameter(gl.CULL_FACE);
        this.depthTest = gl.getParameter(gl.DEPTH_TEST);
        this.blend = gl.getParameter(gl.BLEND);
        this.scissorTest = gl.getParameter(gl.SCISSOR_TEST);
        this.stencilTest = gl.getParameter(gl.STENCIL_TEST);
        gl.enable = function(pname) {
            switch(pname){
                case gl.CULL_FACE:
                    self1.cullFace = true;
                    break;
                case gl.DEPTH_TEST:
                    self1.depthTest = true;
                    break;
                case gl.BLEND:
                    self1.blend = true;
                    break;
                case gl.SCISSOR_TEST:
                    self1.scissorTest = true;
                    break;
                case gl.STENCIL_TEST:
                    self1.stencilTest = true;
                    break;
            }
            self1.realEnable.call(gl, pname);
        };
        gl.disable = function(pname) {
            switch(pname){
                case gl.CULL_FACE:
                    self1.cullFace = false;
                    break;
                case gl.DEPTH_TEST:
                    self1.depthTest = false;
                    break;
                case gl.BLEND:
                    self1.blend = false;
                    break;
                case gl.SCISSOR_TEST:
                    self1.scissorTest = false;
                    break;
                case gl.STENCIL_TEST:
                    self1.stencilTest = false;
                    break;
            }
            self1.realDisable.call(gl, pname);
        };
        this.colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
        gl.colorMask = function(r, g, b, a) {
            self1.colorMask[0] = r;
            self1.colorMask[1] = g;
            self1.colorMask[2] = b;
            self1.colorMask[3] = a;
            self1.realColorMask.call(gl, r, g, b, a);
        };
        this.clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
        gl.clearColor = function(r, g, b, a) {
            self1.clearColor[0] = r;
            self1.clearColor[1] = g;
            self1.clearColor[2] = b;
            self1.clearColor[3] = a;
            self1.realClearColor.call(gl, r, g, b, a);
        };
        this.viewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport = function(x, y, w, h) {
            self1.viewport[0] = x;
            self1.viewport[1] = y;
            self1.viewport[2] = w;
            self1.viewport[3] = h;
            self1.realViewport.call(gl, x, y, w, h);
        };
        this.isPatched = true;
        safariCssSizeWorkaround(canvas);
    };
    CardboardDistorter.prototype.unpatch = function() {
        if (!this.isPatched) return;
        var gl = this.gl;
        var canvas = this.gl.canvas;
        if (!isIOS()) {
            Object.defineProperty(canvas, "width", this.realCanvasWidth);
            Object.defineProperty(canvas, "height", this.realCanvasHeight);
        }
        canvas.width = this.bufferWidth;
        canvas.height = this.bufferHeight;
        gl.bindFramebuffer = this.realBindFramebuffer;
        gl.enable = this.realEnable;
        gl.disable = this.realDisable;
        gl.colorMask = this.realColorMask;
        gl.clearColor = this.realClearColor;
        gl.viewport = this.realViewport;
        if (this.lastBoundFramebuffer == this.framebuffer) gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.isPatched = false;
        setTimeout(function() {
            safariCssSizeWorkaround(canvas);
        }, 1);
    };
    CardboardDistorter.prototype.setTextureBounds = function(leftBounds, rightBounds) {
        if (!leftBounds) leftBounds = [
            0,
            0,
            0.5,
            1
        ];
        if (!rightBounds) rightBounds = [
            0.5,
            0,
            0.5,
            1
        ];
        this.viewportOffsetScale[0] = leftBounds[0];
        this.viewportOffsetScale[1] = leftBounds[1];
        this.viewportOffsetScale[2] = leftBounds[2];
        this.viewportOffsetScale[3] = leftBounds[3];
        this.viewportOffsetScale[4] = rightBounds[0];
        this.viewportOffsetScale[5] = rightBounds[1];
        this.viewportOffsetScale[6] = rightBounds[2];
        this.viewportOffsetScale[7] = rightBounds[3];
    };
    CardboardDistorter.prototype.submitFrame = function() {
        var gl = this.gl;
        var self1 = this;
        var glState = [];
        if (!this.dirtySubmitFrameBindings) glState.push(gl.CURRENT_PROGRAM, gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.TEXTURE0);
        glPreserveState(gl, glState, function(gl) {
            self1.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
            var positionDivisor = 0;
            var texCoordDivisor = 0;
            if (self1.instanceExt) {
                positionDivisor = gl.getVertexAttrib(self1.attribs.position, self1.instanceExt.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE);
                texCoordDivisor = gl.getVertexAttrib(self1.attribs.texCoord, self1.instanceExt.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE);
            }
            if (self1.cullFace) self1.realDisable.call(gl, gl.CULL_FACE);
            if (self1.depthTest) self1.realDisable.call(gl, gl.DEPTH_TEST);
            if (self1.blend) self1.realDisable.call(gl, gl.BLEND);
            if (self1.scissorTest) self1.realDisable.call(gl, gl.SCISSOR_TEST);
            if (self1.stencilTest) self1.realDisable.call(gl, gl.STENCIL_TEST);
            self1.realColorMask.call(gl, true, true, true, true);
            self1.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            if (self1.ctxAttribs.alpha || isIOS()) {
                self1.realClearColor.call(gl, 0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            gl.useProgram(self1.program);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self1.indexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, self1.vertexBuffer);
            gl.enableVertexAttribArray(self1.attribs.position);
            gl.enableVertexAttribArray(self1.attribs.texCoord);
            gl.vertexAttribPointer(self1.attribs.position, 2, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(self1.attribs.texCoord, 3, gl.FLOAT, false, 20, 8);
            if (self1.instanceExt) {
                if (positionDivisor != 0) self1.instanceExt.vertexAttribDivisorANGLE(self1.attribs.position, 0);
                if (texCoordDivisor != 0) self1.instanceExt.vertexAttribDivisorANGLE(self1.attribs.texCoord, 0);
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(self1.uniforms.diffuse, 0);
            gl.bindTexture(gl.TEXTURE_2D, self1.renderTarget);
            gl.uniform4fv(self1.uniforms.viewportOffsetScale, self1.viewportOffsetScale);
            gl.drawElements(gl.TRIANGLES, self1.indexCount, gl.UNSIGNED_SHORT, 0);
            if (self1.cardboardUI) self1.cardboardUI.renderNoState();
            self1.realBindFramebuffer.call(self1.gl, gl.FRAMEBUFFER, self1.framebuffer);
            if (!self1.ctxAttribs.preserveDrawingBuffer) {
                self1.realClearColor.call(gl, 0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            if (!self1.dirtySubmitFrameBindings) self1.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self1.lastBoundFramebuffer);
            if (self1.cullFace) self1.realEnable.call(gl, gl.CULL_FACE);
            if (self1.depthTest) self1.realEnable.call(gl, gl.DEPTH_TEST);
            if (self1.blend) self1.realEnable.call(gl, gl.BLEND);
            if (self1.scissorTest) self1.realEnable.call(gl, gl.SCISSOR_TEST);
            if (self1.stencilTest) self1.realEnable.call(gl, gl.STENCIL_TEST);
            self1.realColorMask.apply(gl, self1.colorMask);
            self1.realViewport.apply(gl, self1.viewport);
            if (self1.ctxAttribs.alpha || !self1.ctxAttribs.preserveDrawingBuffer) self1.realClearColor.apply(gl, self1.clearColor);
            if (self1.instanceExt) {
                if (positionDivisor != 0) self1.instanceExt.vertexAttribDivisorANGLE(self1.attribs.position, positionDivisor);
                if (texCoordDivisor != 0) self1.instanceExt.vertexAttribDivisorANGLE(self1.attribs.texCoord, texCoordDivisor);
            }
        });
        if (isIOS()) {
            var canvas = gl.canvas;
            if (canvas.width != self1.bufferWidth || canvas.height != self1.bufferHeight) {
                self1.bufferWidth = canvas.width;
                self1.bufferHeight = canvas.height;
                self1.onResize();
            }
        }
    };
    CardboardDistorter.prototype.updateDeviceInfo = function(deviceInfo) {
        var gl = this.gl;
        var self1 = this;
        var glState = [
            gl.ARRAY_BUFFER_BINDING,
            gl.ELEMENT_ARRAY_BUFFER_BINDING
        ];
        glPreserveState(gl, glState, function(gl) {
            var vertices = self1.computeMeshVertices_(self1.meshWidth, self1.meshHeight, deviceInfo);
            gl.bindBuffer(gl.ARRAY_BUFFER, self1.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            if (!self1.indexCount) {
                var indices = self1.computeMeshIndices_(self1.meshWidth, self1.meshHeight);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self1.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
                self1.indexCount = indices.length;
            }
        });
    };
    CardboardDistorter.prototype.computeMeshVertices_ = function(width, height, deviceInfo) {
        var vertices = new Float32Array(2 * width * height * 5);
        var lensFrustum = deviceInfo.getLeftEyeVisibleTanAngles();
        var noLensFrustum = deviceInfo.getLeftEyeNoLensTanAngles();
        var viewport = deviceInfo.getLeftEyeVisibleScreenRect(noLensFrustum);
        var vidx = 0;
        for(var e = 0; e < 2; e++){
            for(var j = 0; j < height; j++)for(var i = 0; i < width; i++, vidx++){
                var u = i / (width - 1);
                var v = j / (height - 1);
                var s = u;
                var t = v;
                var x = lerp(lensFrustum[0], lensFrustum[2], u);
                var y = lerp(lensFrustum[3], lensFrustum[1], v);
                var d = Math.sqrt(x * x + y * y);
                var r = deviceInfo.distortion.distortInverse(d);
                var p = x * r / d;
                var q = y * r / d;
                u = (p - noLensFrustum[0]) / (noLensFrustum[2] - noLensFrustum[0]);
                v = (q - noLensFrustum[3]) / (noLensFrustum[1] - noLensFrustum[3]);
                u = (viewport.x + u * viewport.width - 0.5) * 2.0;
                v = (viewport.y + v * viewport.height - 0.5) * 2.0;
                vertices[vidx * 5 + 0] = u;
                vertices[vidx * 5 + 1] = v;
                vertices[vidx * 5 + 2] = s;
                vertices[vidx * 5 + 3] = t;
                vertices[vidx * 5 + 4] = e;
            }
            var w = lensFrustum[2] - lensFrustum[0];
            lensFrustum[0] = -(w + lensFrustum[0]);
            lensFrustum[2] = w - lensFrustum[2];
            w = noLensFrustum[2] - noLensFrustum[0];
            noLensFrustum[0] = -(w + noLensFrustum[0]);
            noLensFrustum[2] = w - noLensFrustum[2];
            viewport.x = 1 - (viewport.x + viewport.width);
        }
        return vertices;
    };
    CardboardDistorter.prototype.computeMeshIndices_ = function(width, height) {
        var indices = new Uint16Array(2 * (width - 1) * (height - 1) * 6);
        var halfwidth = width / 2;
        var halfheight = height / 2;
        var vidx = 0;
        var iidx = 0;
        for(var e = 0; e < 2; e++){
            for(var j = 0; j < height; j++)for(var i = 0; i < width; i++, vidx++){
                if (i == 0 || j == 0) continue;
                if (i <= halfwidth == j <= halfheight) {
                    indices[iidx++] = vidx;
                    indices[iidx++] = vidx - width - 1;
                    indices[iidx++] = vidx - width;
                    indices[iidx++] = vidx - width - 1;
                    indices[iidx++] = vidx;
                    indices[iidx++] = vidx - 1;
                } else {
                    indices[iidx++] = vidx - 1;
                    indices[iidx++] = vidx - width;
                    indices[iidx++] = vidx;
                    indices[iidx++] = vidx - width;
                    indices[iidx++] = vidx - 1;
                    indices[iidx++] = vidx - width - 1;
                }
            }
        }
        return indices;
    };
    CardboardDistorter.prototype.getOwnPropertyDescriptor_ = function(proto, attrName) {
        var descriptor = Object.getOwnPropertyDescriptor(proto, attrName);
        if (descriptor.get === undefined || descriptor.set === undefined) {
            descriptor.configurable = true;
            descriptor.enumerable = true;
            descriptor.get = function() {
                return this.getAttribute(attrName);
            };
            descriptor.set = function(val) {
                this.setAttribute(attrName, val);
            };
        }
        return descriptor;
    };
    var uiVS = [
        "attribute vec2 position;",
        "uniform mat4 projectionMat;",
        "void main() {",
        "  gl_Position = projectionMat * vec4( position, -1.0, 1.0 );",
        "}"
    ].join("\n");
    var uiFS = [
        "precision mediump float;",
        "uniform vec4 color;",
        "void main() {",
        "  gl_FragColor = color;",
        "}"
    ].join("\n");
    var DEG2RAD = Math.PI / 180.0;
    var kAnglePerGearSection = 60;
    var kOuterRimEndAngle = 12;
    var kInnerRimBeginAngle = 20;
    var kOuterRadius = 1;
    var kMiddleRadius = 0.75;
    var kInnerRadius = 0.3125;
    var kCenterLineThicknessDp = 4;
    var kButtonWidthDp = 28;
    var kTouchSlopFactor = 1.5;
    function CardboardUI(gl) {
        this.gl = gl;
        this.attribs = {
            position: 0
        };
        this.program = linkProgram(gl, uiVS, uiFS, this.attribs);
        this.uniforms = getProgramUniforms(gl, this.program);
        this.vertexBuffer = gl.createBuffer();
        this.gearOffset = 0;
        this.gearVertexCount = 0;
        this.arrowOffset = 0;
        this.arrowVertexCount = 0;
        this.projMat = new Float32Array(16);
        this.listener = null;
        this.onResize();
    }
    CardboardUI.prototype.destroy = function() {
        var gl = this.gl;
        if (this.listener) gl.canvas.removeEventListener("click", this.listener, false);
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
    };
    CardboardUI.prototype.listen = function(optionsCallback, backCallback) {
        var canvas = this.gl.canvas;
        this.listener = function(event) {
            var midline = canvas.clientWidth / 2;
            var buttonSize = kButtonWidthDp * kTouchSlopFactor;
            if (event.clientX > midline - buttonSize && event.clientX < midline + buttonSize && event.clientY > canvas.clientHeight - buttonSize) optionsCallback(event);
            else if (event.clientX < buttonSize && event.clientY < buttonSize) backCallback(event);
        };
        canvas.addEventListener("click", this.listener, false);
    };
    CardboardUI.prototype.onResize = function() {
        var gl = this.gl;
        var self1 = this;
        var glState = [
            gl.ARRAY_BUFFER_BINDING
        ];
        glPreserveState(gl, glState, function(gl) {
            var vertices = [];
            var midline = gl.drawingBufferWidth / 2;
            var physicalPixels = Math.max(screen.width, screen.height) * window.devicePixelRatio;
            var scalingRatio = gl.drawingBufferWidth / physicalPixels;
            var dps = scalingRatio * window.devicePixelRatio;
            var lineWidth = kCenterLineThicknessDp * dps / 2;
            var buttonSize = kButtonWidthDp * kTouchSlopFactor * dps;
            var buttonScale = kButtonWidthDp * dps / 2;
            var buttonBorder = (kButtonWidthDp * kTouchSlopFactor - kButtonWidthDp) * dps;
            vertices.push(midline - lineWidth, buttonSize);
            vertices.push(midline - lineWidth, gl.drawingBufferHeight);
            vertices.push(midline + lineWidth, buttonSize);
            vertices.push(midline + lineWidth, gl.drawingBufferHeight);
            self1.gearOffset = vertices.length / 2;
            function addGearSegment(theta, r) {
                var angle = (90 - theta) * DEG2RAD;
                var x = Math.cos(angle);
                var y = Math.sin(angle);
                vertices.push(kInnerRadius * x * buttonScale + midline, kInnerRadius * y * buttonScale + buttonScale);
                vertices.push(r * x * buttonScale + midline, r * y * buttonScale + buttonScale);
            }
            for(var i = 0; i <= 6; i++){
                var segmentTheta = i * kAnglePerGearSection;
                addGearSegment(segmentTheta, kOuterRadius);
                addGearSegment(segmentTheta + kOuterRimEndAngle, kOuterRadius);
                addGearSegment(segmentTheta + kInnerRimBeginAngle, kMiddleRadius);
                addGearSegment(segmentTheta + (kAnglePerGearSection - kInnerRimBeginAngle), kMiddleRadius);
                addGearSegment(segmentTheta + (kAnglePerGearSection - kOuterRimEndAngle), kOuterRadius);
            }
            self1.gearVertexCount = vertices.length / 2 - self1.gearOffset;
            self1.arrowOffset = vertices.length / 2;
            function addArrowVertex(x, y) {
                vertices.push(buttonBorder + x, gl.drawingBufferHeight - buttonBorder - y);
            }
            var angledLineWidth = lineWidth / Math.sin(45 * DEG2RAD);
            addArrowVertex(0, buttonScale);
            addArrowVertex(buttonScale, 0);
            addArrowVertex(buttonScale + angledLineWidth, angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale + angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
            addArrowVertex(0, buttonScale);
            addArrowVertex(buttonScale, buttonScale * 2);
            addArrowVertex(buttonScale + angledLineWidth, buttonScale * 2 - angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
            addArrowVertex(0, buttonScale);
            addArrowVertex(angledLineWidth, buttonScale - lineWidth);
            addArrowVertex(kButtonWidthDp * dps, buttonScale - lineWidth);
            addArrowVertex(angledLineWidth, buttonScale + lineWidth);
            addArrowVertex(kButtonWidthDp * dps, buttonScale + lineWidth);
            self1.arrowVertexCount = vertices.length / 2 - self1.arrowOffset;
            gl.bindBuffer(gl.ARRAY_BUFFER, self1.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        });
    };
    CardboardUI.prototype.render = function() {
        var gl = this.gl;
        var self1 = this;
        var glState = [
            gl.CULL_FACE,
            gl.DEPTH_TEST,
            gl.BLEND,
            gl.SCISSOR_TEST,
            gl.STENCIL_TEST,
            gl.COLOR_WRITEMASK,
            gl.VIEWPORT,
            gl.CURRENT_PROGRAM,
            gl.ARRAY_BUFFER_BINDING
        ];
        glPreserveState(gl, glState, function(gl) {
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            gl.disable(gl.SCISSOR_TEST);
            gl.disable(gl.STENCIL_TEST);
            gl.colorMask(true, true, true, true);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            self1.renderNoState();
        });
    };
    CardboardUI.prototype.renderNoState = function() {
        var gl = this.gl;
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.attribs.position);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 8, 0);
        gl.uniform4f(this.uniforms.color, 1.0, 1.0, 1.0, 1.0);
        orthoMatrix(this.projMat, 0, gl.drawingBufferWidth, 0, gl.drawingBufferHeight, 0.1, 1024.0);
        gl.uniformMatrix4fv(this.uniforms.projectionMat, false, this.projMat);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.gearOffset, this.gearVertexCount);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.arrowOffset, this.arrowVertexCount);
    };
    function Distortion(coefficients) {
        this.coefficients = coefficients;
    }
    Distortion.prototype.distortInverse = function(radius) {
        var r0 = 0;
        var r1 = 1;
        var dr0 = radius - this.distort(r0);
        while(Math.abs(r1 - r0) > 0.0001){
            var dr1 = radius - this.distort(r1);
            var r2 = r1 - dr1 * ((r1 - r0) / (dr1 - dr0));
            r0 = r1;
            r1 = r2;
            dr0 = dr1;
        }
        return r1;
    };
    Distortion.prototype.distort = function(radius) {
        var r2 = radius * radius;
        var ret = 0;
        for(var i = 0; i < this.coefficients.length; i++)ret = r2 * (ret + this.coefficients[i]);
        return (ret + 1) * radius;
    };
    var degToRad = Math.PI / 180;
    var radToDeg = 180 / Math.PI;
    var Vector3 = function Vector3(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };
    Vector3.prototype = {
        constructor: Vector3,
        set: function set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        },
        copy: function copy(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        },
        length: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function normalize() {
            var scalar = this.length();
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.multiplyScalar(invScalar);
            } else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        },
        multiplyScalar: function multiplyScalar(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        },
        applyQuaternion: function applyQuaternion(q) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        },
        dot: function dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        crossVectors: function crossVectors(a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        }
    };
    var Quaternion = function Quaternion(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w !== undefined ? w : 1;
    };
    Quaternion.prototype = {
        constructor: Quaternion,
        set: function set(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        },
        copy: function copy(quaternion) {
            this.x = quaternion.x;
            this.y = quaternion.y;
            this.z = quaternion.z;
            this.w = quaternion.w;
            return this;
        },
        setFromEulerXYZ: function setFromEulerXYZ(x, y, z) {
            var c1 = Math.cos(x / 2);
            var c2 = Math.cos(y / 2);
            var c3 = Math.cos(z / 2);
            var s1 = Math.sin(x / 2);
            var s2 = Math.sin(y / 2);
            var s3 = Math.sin(z / 2);
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 + s1 * s2 * c3;
            this.w = c1 * c2 * c3 - s1 * s2 * s3;
            return this;
        },
        setFromEulerYXZ: function setFromEulerYXZ(x, y, z) {
            var c1 = Math.cos(x / 2);
            var c2 = Math.cos(y / 2);
            var c3 = Math.cos(z / 2);
            var s1 = Math.sin(x / 2);
            var s2 = Math.sin(y / 2);
            var s3 = Math.sin(z / 2);
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 - s1 * s2 * c3;
            this.w = c1 * c2 * c3 + s1 * s2 * s3;
            return this;
        },
        setFromAxisAngle: function setFromAxisAngle(axis, angle) {
            var halfAngle = angle / 2, s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);
            return this;
        },
        multiply: function multiply(q) {
            return this.multiplyQuaternions(this, q);
        },
        multiplyQuaternions: function multiplyQuaternions(a, b) {
            var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
            var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        },
        inverse: function inverse() {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            this.normalize();
            return this;
        },
        normalize: function normalize() {
            var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            if (l === 0) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 1;
            } else {
                l = 1 / l;
                this.x = this.x * l;
                this.y = this.y * l;
                this.z = this.z * l;
                this.w = this.w * l;
            }
            return this;
        },
        slerp: function slerp(qb, t) {
            if (t === 0) return this;
            if (t === 1) return this.copy(qb);
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
            if (cosHalfTheta < 0) {
                this.w = -qb.w;
                this.x = -qb.x;
                this.y = -qb.y;
                this.z = -qb.z;
                cosHalfTheta = -cosHalfTheta;
            } else this.copy(qb);
            if (cosHalfTheta >= 1.0) {
                this.w = w;
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            var halfTheta = Math.acos(cosHalfTheta);
            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                this.w = 0.5 * (w + this.w);
                this.x = 0.5 * (x + this.x);
                this.y = 0.5 * (y + this.y);
                this.z = 0.5 * (z + this.z);
                return this;
            }
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            this.w = w * ratioA + this.w * ratioB;
            this.x = x * ratioA + this.x * ratioB;
            this.y = y * ratioA + this.y * ratioB;
            this.z = z * ratioA + this.z * ratioB;
            return this;
        },
        setFromUnitVectors: function() {
            var v1, r;
            var EPS = 0.000001;
            return function(vFrom, vTo) {
                if (v1 === undefined) v1 = new Vector3();
                r = vFrom.dot(vTo) + 1;
                if (r < EPS) {
                    r = 0;
                    if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) v1.set(-vFrom.y, vFrom.x, 0);
                    else v1.set(0, -vFrom.z, vFrom.y);
                } else v1.crossVectors(vFrom, vTo);
                this.x = v1.x;
                this.y = v1.y;
                this.z = v1.z;
                this.w = r;
                this.normalize();
                return this;
            };
        }()
    };
    function Device(params) {
        this.width = params.width || getScreenWidth();
        this.height = params.height || getScreenHeight();
        this.widthMeters = params.widthMeters;
        this.heightMeters = params.heightMeters;
        this.bevelMeters = params.bevelMeters;
    }
    var DEFAULT_ANDROID = new Device({
        widthMeters: 0.110,
        heightMeters: 0.062,
        bevelMeters: 0.004
    });
    var DEFAULT_IOS = new Device({
        widthMeters: 0.1038,
        heightMeters: 0.0584,
        bevelMeters: 0.004
    });
    var Viewers = {
        CardboardV1: new CardboardViewer({
            id: "CardboardV1",
            label: "Cardboard I/O 2014",
            fov: 40,
            interLensDistance: 0.060,
            baselineLensDistance: 0.035,
            screenLensDistance: 0.042,
            distortionCoefficients: [
                0.441,
                0.156
            ],
            inverseCoefficients: [
                -0.4410035,
                0.42756155,
                -0.4804439,
                0.5460139,
                -0.58821183,
                0.5733938,
                -0.48303202,
                0.33299083,
                -0.17573841,
                0.0651772,
                -0.01488963,
                0.001559834
            ]
        }),
        CardboardV2: new CardboardViewer({
            id: "CardboardV2",
            label: "Cardboard I/O 2015",
            fov: 60,
            interLensDistance: 0.064,
            baselineLensDistance: 0.035,
            screenLensDistance: 0.039,
            distortionCoefficients: [
                0.34,
                0.55
            ],
            inverseCoefficients: [
                -0.33836704,
                -0.18162185,
                0.862655,
                -1.2462051,
                1.0560602,
                -0.58208317,
                0.21609078,
                -0.05444823,
                0.009177956,
                -0.0009904169,
                6.183535E-5,
                -0.0000016981803
            ]
        })
    };
    function DeviceInfo(deviceParams, additionalViewers) {
        this.viewer = Viewers.CardboardV2;
        this.updateDeviceParams(deviceParams);
        this.distortion = new Distortion(this.viewer.distortionCoefficients);
        for(var i = 0; i < additionalViewers.length; i++){
            var viewer = additionalViewers[i];
            Viewers[viewer.id] = new CardboardViewer(viewer);
        }
    }
    DeviceInfo.prototype.updateDeviceParams = function(deviceParams) {
        this.device = this.determineDevice_(deviceParams) || this.device;
    };
    DeviceInfo.prototype.getDevice = function() {
        return this.device;
    };
    DeviceInfo.prototype.setViewer = function(viewer) {
        this.viewer = viewer;
        this.distortion = new Distortion(this.viewer.distortionCoefficients);
    };
    DeviceInfo.prototype.determineDevice_ = function(deviceParams) {
        if (!deviceParams) {
            if (isIOS()) {
                console.warn("Using fallback iOS device measurements.");
                return DEFAULT_IOS;
            } else {
                console.warn("Using fallback Android device measurements.");
                return DEFAULT_ANDROID;
            }
        }
        var METERS_PER_INCH = 0.0254;
        var metersPerPixelX = METERS_PER_INCH / deviceParams.xdpi;
        var metersPerPixelY = METERS_PER_INCH / deviceParams.ydpi;
        var width = getScreenWidth();
        var height = getScreenHeight();
        return new Device({
            widthMeters: metersPerPixelX * width,
            heightMeters: metersPerPixelY * height,
            bevelMeters: deviceParams.bevelMm * 0.001
        });
    };
    DeviceInfo.prototype.getDistortedFieldOfViewLeftEye = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var outerDist = (device.widthMeters - viewer.interLensDistance) / 2;
        var innerDist = viewer.interLensDistance / 2;
        var bottomDist = viewer.baselineLensDistance - device.bevelMeters;
        var topDist = device.heightMeters - bottomDist;
        var outerAngle = radToDeg * Math.atan(distortion.distort(outerDist / eyeToScreenDistance));
        var innerAngle = radToDeg * Math.atan(distortion.distort(innerDist / eyeToScreenDistance));
        var bottomAngle = radToDeg * Math.atan(distortion.distort(bottomDist / eyeToScreenDistance));
        var topAngle = radToDeg * Math.atan(distortion.distort(topDist / eyeToScreenDistance));
        return {
            leftDegrees: Math.min(outerAngle, viewer.fov),
            rightDegrees: Math.min(innerAngle, viewer.fov),
            downDegrees: Math.min(bottomAngle, viewer.fov),
            upDegrees: Math.min(topAngle, viewer.fov)
        };
    };
    DeviceInfo.prototype.getLeftEyeVisibleTanAngles = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var fovLeft = Math.tan(-degToRad * viewer.fov);
        var fovTop = Math.tan(degToRad * viewer.fov);
        var fovRight = Math.tan(degToRad * viewer.fov);
        var fovBottom = Math.tan(-degToRad * viewer.fov);
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = distortion.distort((centerX - halfWidth) / centerZ);
        var screenTop = distortion.distort((centerY + halfHeight) / centerZ);
        var screenRight = distortion.distort((centerX + halfWidth) / centerZ);
        var screenBottom = distortion.distort((centerY - halfHeight) / centerZ);
        var result = new Float32Array(4);
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
    };
    DeviceInfo.prototype.getLeftEyeNoLensTanAngles = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var result = new Float32Array(4);
        var fovLeft = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
        var fovTop = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
        var fovRight = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
        var fovBottom = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = (centerX - halfWidth) / centerZ;
        var screenTop = (centerY + halfHeight) / centerZ;
        var screenRight = (centerX + halfWidth) / centerZ;
        var screenBottom = (centerY - halfHeight) / centerZ;
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
    };
    DeviceInfo.prototype.getLeftEyeVisibleScreenRect = function(undistortedFrustum) {
        var viewer = this.viewer;
        var device = this.device;
        var dist = viewer.screenLensDistance;
        var eyeX = (device.widthMeters - viewer.interLensDistance) / 2;
        var eyeY = viewer.baselineLensDistance - device.bevelMeters;
        var left = (undistortedFrustum[0] * dist + eyeX) / device.widthMeters;
        var top = (undistortedFrustum[1] * dist + eyeY) / device.heightMeters;
        var right = (undistortedFrustum[2] * dist + eyeX) / device.widthMeters;
        var bottom = (undistortedFrustum[3] * dist + eyeY) / device.heightMeters;
        return {
            x: left,
            y: bottom,
            width: right - left,
            height: top - bottom
        };
    };
    DeviceInfo.prototype.getFieldOfViewLeftEye = function(opt_isUndistorted) {
        return opt_isUndistorted ? this.getUndistortedFieldOfViewLeftEye() : this.getDistortedFieldOfViewLeftEye();
    };
    DeviceInfo.prototype.getFieldOfViewRightEye = function(opt_isUndistorted) {
        var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);
        return {
            leftDegrees: fov.rightDegrees,
            rightDegrees: fov.leftDegrees,
            upDegrees: fov.upDegrees,
            downDegrees: fov.downDegrees
        };
    };
    DeviceInfo.prototype.getUndistortedFieldOfViewLeftEye = function() {
        var p = this.getUndistortedParams_();
        return {
            leftDegrees: radToDeg * Math.atan(p.outerDist),
            rightDegrees: radToDeg * Math.atan(p.innerDist),
            downDegrees: radToDeg * Math.atan(p.bottomDist),
            upDegrees: radToDeg * Math.atan(p.topDist)
        };
    };
    DeviceInfo.prototype.getUndistortedViewportLeftEye = function() {
        var p = this.getUndistortedParams_();
        var viewer = this.viewer;
        var device = this.device;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var xPxPerTanAngle = device.width / screenWidth;
        var yPxPerTanAngle = device.height / screenHeight;
        var x = Math.round((p.eyePosX - p.outerDist) * xPxPerTanAngle);
        var y = Math.round((p.eyePosY - p.bottomDist) * yPxPerTanAngle);
        return {
            x: x,
            y: y,
            width: Math.round((p.eyePosX + p.innerDist) * xPxPerTanAngle) - x,
            height: Math.round((p.eyePosY + p.topDist) * yPxPerTanAngle) - y
        };
    };
    DeviceInfo.prototype.getUndistortedParams_ = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var halfLensDistance = viewer.interLensDistance / 2 / eyeToScreenDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var eyePosX = screenWidth / 2 - halfLensDistance;
        var eyePosY = (viewer.baselineLensDistance - device.bevelMeters) / eyeToScreenDistance;
        var maxFov = viewer.fov;
        var viewerMax = distortion.distortInverse(Math.tan(degToRad * maxFov));
        var outerDist = Math.min(eyePosX, viewerMax);
        var innerDist = Math.min(halfLensDistance, viewerMax);
        var bottomDist = Math.min(eyePosY, viewerMax);
        var topDist = Math.min(screenHeight - eyePosY, viewerMax);
        return {
            outerDist: outerDist,
            innerDist: innerDist,
            topDist: topDist,
            bottomDist: bottomDist,
            eyePosX: eyePosX,
            eyePosY: eyePosY
        };
    };
    function CardboardViewer(params) {
        this.id = params.id;
        this.label = params.label;
        this.fov = params.fov;
        this.interLensDistance = params.interLensDistance;
        this.baselineLensDistance = params.baselineLensDistance;
        this.screenLensDistance = params.screenLensDistance;
        this.distortionCoefficients = params.distortionCoefficients;
        this.inverseCoefficients = params.inverseCoefficients;
    }
    DeviceInfo.Viewers = Viewers;
    var format = 1;
    var last_updated = "2019-11-09T17:36:14Z";
    var devices = [
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "asus/*/Nexus 7/*"
                },
                {
                    "ua": "Nexus 7"
                }
            ],
            "dpi": [
                320.8,
                323
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "asus/*/ASUS_X00PD/*"
                },
                {
                    "ua": "ASUS_X00PD"
                }
            ],
            "dpi": 245,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "asus/*/ASUS_X008D/*"
                },
                {
                    "ua": "ASUS_X008D"
                }
            ],
            "dpi": 282,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "asus/*/ASUS_Z00AD/*"
                },
                {
                    "ua": "ASUS_Z00AD"
                }
            ],
            "dpi": [
                403,
                404.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel 2 XL/*"
                },
                {
                    "ua": "Pixel 2 XL"
                }
            ],
            "dpi": 537.9,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel 3 XL/*"
                },
                {
                    "ua": "Pixel 3 XL"
                }
            ],
            "dpi": [
                558.5,
                553.8
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel XL/*"
                },
                {
                    "ua": "Pixel XL"
                }
            ],
            "dpi": [
                537.9,
                533
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel 3/*"
                },
                {
                    "ua": "Pixel 3"
                }
            ],
            "dpi": 442.4,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel 2/*"
                },
                {
                    "ua": "Pixel 2"
                }
            ],
            "dpi": 441,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Google/*/Pixel/*"
                },
                {
                    "ua": "Pixel"
                }
            ],
            "dpi": [
                432.6,
                436.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "HTC/*/HTC6435LVW/*"
                },
                {
                    "ua": "HTC6435LVW"
                }
            ],
            "dpi": [
                449.7,
                443.3
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "HTC/*/HTC One XL/*"
                },
                {
                    "ua": "HTC One XL"
                }
            ],
            "dpi": [
                315.3,
                314.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "htc/*/Nexus 9/*"
                },
                {
                    "ua": "Nexus 9"
                }
            ],
            "dpi": 289,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "HTC/*/HTC One M9/*"
                },
                {
                    "ua": "HTC One M9"
                }
            ],
            "dpi": [
                442.5,
                443.3
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "HTC/*/HTC One_M8/*"
                },
                {
                    "ua": "HTC One_M8"
                }
            ],
            "dpi": [
                449.7,
                447.4
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "HTC/*/HTC One/*"
                },
                {
                    "ua": "HTC One"
                }
            ],
            "dpi": 472.8,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Huawei/*/Nexus 6P/*"
                },
                {
                    "ua": "Nexus 6P"
                }
            ],
            "dpi": [
                515.1,
                518
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Huawei/*/BLN-L24/*"
                },
                {
                    "ua": "HONORBLN-L24"
                }
            ],
            "dpi": 480,
            "bw": 4,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Huawei/*/BKL-L09/*"
                },
                {
                    "ua": "BKL-L09"
                }
            ],
            "dpi": 403,
            "bw": 3.47,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LENOVO/*/Lenovo PB2-690Y/*"
                },
                {
                    "ua": "Lenovo PB2-690Y"
                }
            ],
            "dpi": [
                457.2,
                454.713
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/Nexus 5X/*"
                },
                {
                    "ua": "Nexus 5X"
                }
            ],
            "dpi": [
                422,
                419.9
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LGMS345/*"
                },
                {
                    "ua": "LGMS345"
                }
            ],
            "dpi": [
                221.7,
                219.1
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LG-D800/*"
                },
                {
                    "ua": "LG-D800"
                }
            ],
            "dpi": [
                422,
                424.1
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LG-D850/*"
                },
                {
                    "ua": "LG-D850"
                }
            ],
            "dpi": [
                537.9,
                541.9
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/VS985 4G/*"
                },
                {
                    "ua": "VS985 4G"
                }
            ],
            "dpi": [
                537.9,
                535.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/Nexus 5/*"
                },
                {
                    "ua": "Nexus 5 B"
                }
            ],
            "dpi": [
                442.4,
                444.8
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/Nexus 4/*"
                },
                {
                    "ua": "Nexus 4"
                }
            ],
            "dpi": [
                319.8,
                318.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LG-P769/*"
                },
                {
                    "ua": "LG-P769"
                }
            ],
            "dpi": [
                240.6,
                247.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LGMS323/*"
                },
                {
                    "ua": "LGMS323"
                }
            ],
            "dpi": [
                206.6,
                204.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "LGE/*/LGLS996/*"
                },
                {
                    "ua": "LGLS996"
                }
            ],
            "dpi": [
                403.4,
                401.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Micromax/*/4560MMX/*"
                },
                {
                    "ua": "4560MMX"
                }
            ],
            "dpi": [
                240,
                219.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Micromax/*/A250/*"
                },
                {
                    "ua": "Micromax A250"
                }
            ],
            "dpi": [
                480,
                446.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Micromax/*/Micromax AQ4501/*"
                },
                {
                    "ua": "Micromax AQ4501"
                }
            ],
            "dpi": 240,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/G5/*"
                },
                {
                    "ua": "Moto G (5) Plus"
                }
            ],
            "dpi": [
                403.4,
                403
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/DROID RAZR/*"
                },
                {
                    "ua": "DROID RAZR"
                }
            ],
            "dpi": [
                368.1,
                256.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT830C/*"
                },
                {
                    "ua": "XT830C"
                }
            ],
            "dpi": [
                254,
                255.9
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1021/*"
                },
                {
                    "ua": "XT1021"
                }
            ],
            "dpi": [
                254,
                256.7
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1023/*"
                },
                {
                    "ua": "XT1023"
                }
            ],
            "dpi": [
                254,
                256.7
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1028/*"
                },
                {
                    "ua": "XT1028"
                }
            ],
            "dpi": [
                326.6,
                327.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1034/*"
                },
                {
                    "ua": "XT1034"
                }
            ],
            "dpi": [
                326.6,
                328.4
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1053/*"
                },
                {
                    "ua": "XT1053"
                }
            ],
            "dpi": [
                315.3,
                316.1
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1562/*"
                },
                {
                    "ua": "XT1562"
                }
            ],
            "dpi": [
                403.4,
                402.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/Nexus 6/*"
                },
                {
                    "ua": "Nexus 6 B"
                }
            ],
            "dpi": [
                494.3,
                489.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1063/*"
                },
                {
                    "ua": "XT1063"
                }
            ],
            "dpi": [
                295,
                296.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1064/*"
                },
                {
                    "ua": "XT1064"
                }
            ],
            "dpi": [
                295,
                295.6
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1092/*"
                },
                {
                    "ua": "XT1092"
                }
            ],
            "dpi": [
                422,
                424.1
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/XT1095/*"
                },
                {
                    "ua": "XT1095"
                }
            ],
            "dpi": [
                422,
                423.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "motorola/*/G4/*"
                },
                {
                    "ua": "Moto G (4)"
                }
            ],
            "dpi": 401,
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/A0001/*"
                },
                {
                    "ua": "A0001"
                }
            ],
            "dpi": [
                403.4,
                401
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE E1001/*"
                },
                {
                    "ua": "ONE E1001"
                }
            ],
            "dpi": [
                442.4,
                441.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE E1003/*"
                },
                {
                    "ua": "ONE E1003"
                }
            ],
            "dpi": [
                442.4,
                441.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE E1005/*"
                },
                {
                    "ua": "ONE E1005"
                }
            ],
            "dpi": [
                442.4,
                441.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE A2001/*"
                },
                {
                    "ua": "ONE A2001"
                }
            ],
            "dpi": [
                391.9,
                405.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE A2003/*"
                },
                {
                    "ua": "ONE A2003"
                }
            ],
            "dpi": [
                391.9,
                405.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE A2005/*"
                },
                {
                    "ua": "ONE A2005"
                }
            ],
            "dpi": [
                391.9,
                405.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A3000/*"
                },
                {
                    "ua": "ONEPLUS A3000"
                }
            ],
            "dpi": 401,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A3003/*"
                },
                {
                    "ua": "ONEPLUS A3003"
                }
            ],
            "dpi": 401,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A3010/*"
                },
                {
                    "ua": "ONEPLUS A3010"
                }
            ],
            "dpi": 401,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A5000/*"
                },
                {
                    "ua": "ONEPLUS A5000 "
                }
            ],
            "dpi": [
                403.411,
                399.737
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONE A5010/*"
                },
                {
                    "ua": "ONEPLUS A5010"
                }
            ],
            "dpi": [
                403,
                400
            ],
            "bw": 2,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A6000/*"
                },
                {
                    "ua": "ONEPLUS A6000"
                }
            ],
            "dpi": 401,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A6003/*"
                },
                {
                    "ua": "ONEPLUS A6003"
                }
            ],
            "dpi": 401,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A6010/*"
                },
                {
                    "ua": "ONEPLUS A6010"
                }
            ],
            "dpi": 401,
            "bw": 2,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OnePlus/*/ONEPLUS A6013/*"
                },
                {
                    "ua": "ONEPLUS A6013"
                }
            ],
            "dpi": 401,
            "bw": 2,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "OPPO/*/X909/*"
                },
                {
                    "ua": "X909"
                }
            ],
            "dpi": [
                442.4,
                444.1
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9082/*"
                },
                {
                    "ua": "GT-I9082"
                }
            ],
            "dpi": [
                184.7,
                185.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G360P/*"
                },
                {
                    "ua": "SM-G360P"
                }
            ],
            "dpi": [
                196.7,
                205.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/Nexus S/*"
                },
                {
                    "ua": "Nexus S"
                }
            ],
            "dpi": [
                234.5,
                229.8
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9300/*"
                },
                {
                    "ua": "GT-I9300"
                }
            ],
            "dpi": [
                304.8,
                303.9
            ],
            "bw": 5,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-T230NU/*"
                },
                {
                    "ua": "SM-T230NU"
                }
            ],
            "dpi": 216,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SGH-T399/*"
                },
                {
                    "ua": "SGH-T399"
                }
            ],
            "dpi": [
                217.7,
                231.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SGH-M919/*"
                },
                {
                    "ua": "SGH-M919"
                }
            ],
            "dpi": [
                440.8,
                437.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N9005/*"
                },
                {
                    "ua": "SM-N9005"
                }
            ],
            "dpi": [
                386.4,
                387
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SAMSUNG-SM-N900A/*"
                },
                {
                    "ua": "SAMSUNG-SM-N900A"
                }
            ],
            "dpi": [
                386.4,
                387.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9500/*"
                },
                {
                    "ua": "GT-I9500"
                }
            ],
            "dpi": [
                442.5,
                443.3
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9505/*"
                },
                {
                    "ua": "GT-I9505"
                }
            ],
            "dpi": 439.4,
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G900F/*"
                },
                {
                    "ua": "SM-G900F"
                }
            ],
            "dpi": [
                415.6,
                431.6
            ],
            "bw": 5,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G900M/*"
                },
                {
                    "ua": "SM-G900M"
                }
            ],
            "dpi": [
                415.6,
                431.6
            ],
            "bw": 5,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G800F/*"
                },
                {
                    "ua": "SM-G800F"
                }
            ],
            "dpi": 326.8,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G906S/*"
                },
                {
                    "ua": "SM-G906S"
                }
            ],
            "dpi": [
                562.7,
                572.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9300/*"
                },
                {
                    "ua": "GT-I9300"
                }
            ],
            "dpi": [
                306.7,
                304.8
            ],
            "bw": 5,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-T535/*"
                },
                {
                    "ua": "SM-T535"
                }
            ],
            "dpi": [
                142.6,
                136.4
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N920C/*"
                },
                {
                    "ua": "SM-N920C"
                }
            ],
            "dpi": [
                515.1,
                518.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N920P/*"
                },
                {
                    "ua": "SM-N920P"
                }
            ],
            "dpi": [
                386.3655,
                390.144
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N920W8/*"
                },
                {
                    "ua": "SM-N920W8"
                }
            ],
            "dpi": [
                515.1,
                518.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9300I/*"
                },
                {
                    "ua": "GT-I9300I"
                }
            ],
            "dpi": [
                304.8,
                305.8
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-I9195/*"
                },
                {
                    "ua": "GT-I9195"
                }
            ],
            "dpi": [
                249.4,
                256.7
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SPH-L520/*"
                },
                {
                    "ua": "SPH-L520"
                }
            ],
            "dpi": [
                249.4,
                255.9
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SAMSUNG-SGH-I717/*"
                },
                {
                    "ua": "SAMSUNG-SGH-I717"
                }
            ],
            "dpi": 285.8,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SPH-D710/*"
                },
                {
                    "ua": "SPH-D710"
                }
            ],
            "dpi": [
                217.7,
                204.2
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/GT-N7100/*"
                },
                {
                    "ua": "GT-N7100"
                }
            ],
            "dpi": 265.1,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SCH-I605/*"
                },
                {
                    "ua": "SCH-I605"
                }
            ],
            "dpi": 265.1,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/Galaxy Nexus/*"
                },
                {
                    "ua": "Galaxy Nexus"
                }
            ],
            "dpi": [
                315.3,
                314.2
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N910H/*"
                },
                {
                    "ua": "SM-N910H"
                }
            ],
            "dpi": [
                515.1,
                518
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-N910C/*"
                },
                {
                    "ua": "SM-N910C"
                }
            ],
            "dpi": [
                515.2,
                520.2
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G130M/*"
                },
                {
                    "ua": "SM-G130M"
                }
            ],
            "dpi": [
                165.9,
                164.8
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G928I/*"
                },
                {
                    "ua": "SM-G928I"
                }
            ],
            "dpi": [
                515.1,
                518.4
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G920F/*"
                },
                {
                    "ua": "SM-G920F"
                }
            ],
            "dpi": 580.6,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G920P/*"
                },
                {
                    "ua": "SM-G920P"
                }
            ],
            "dpi": [
                522.5,
                577
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G925F/*"
                },
                {
                    "ua": "SM-G925F"
                }
            ],
            "dpi": 580.6,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G925V/*"
                },
                {
                    "ua": "SM-G925V"
                }
            ],
            "dpi": [
                522.5,
                576.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G930F/*"
                },
                {
                    "ua": "SM-G930F"
                }
            ],
            "dpi": 576.6,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G935F/*"
                },
                {
                    "ua": "SM-G935F"
                }
            ],
            "dpi": 533,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G950F/*"
                },
                {
                    "ua": "SM-G950F"
                }
            ],
            "dpi": [
                562.707,
                565.293
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G955U/*"
                },
                {
                    "ua": "SM-G955U"
                }
            ],
            "dpi": [
                522.514,
                525.762
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G955F/*"
                },
                {
                    "ua": "SM-G955F"
                }
            ],
            "dpi": [
                522.514,
                525.762
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960F/*"
                },
                {
                    "ua": "SM-G960F"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G9600/*"
                },
                {
                    "ua": "SM-G9600"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960T/*"
                },
                {
                    "ua": "SM-G960T"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960N/*"
                },
                {
                    "ua": "SM-G960N"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960U/*"
                },
                {
                    "ua": "SM-G960U"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G9608/*"
                },
                {
                    "ua": "SM-G9608"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960FD/*"
                },
                {
                    "ua": "SM-G960FD"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G960W/*"
                },
                {
                    "ua": "SM-G960W"
                }
            ],
            "dpi": [
                569.575,
                571.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G965F/*"
                },
                {
                    "ua": "SM-G965F"
                }
            ],
            "dpi": 529,
            "bw": 2,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Sony/*/C6903/*"
                },
                {
                    "ua": "C6903"
                }
            ],
            "dpi": [
                442.5,
                443.3
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Sony/*/D6653/*"
                },
                {
                    "ua": "D6653"
                }
            ],
            "dpi": [
                428.6,
                427.6
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Sony/*/E6653/*"
                },
                {
                    "ua": "E6653"
                }
            ],
            "dpi": [
                428.6,
                425.7
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Sony/*/E6853/*"
                },
                {
                    "ua": "E6853"
                }
            ],
            "dpi": [
                403.4,
                401.9
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Sony/*/SGP321/*"
                },
                {
                    "ua": "SGP321"
                }
            ],
            "dpi": [
                224.7,
                224.1
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "TCT/*/ALCATEL ONE TOUCH Fierce/*"
                },
                {
                    "ua": "ALCATEL ONE TOUCH Fierce"
                }
            ],
            "dpi": [
                240,
                247.5
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "THL/*/thl 5000/*"
                },
                {
                    "ua": "thl 5000"
                }
            ],
            "dpi": [
                480,
                443.3
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Fly/*/IQ4412/*"
                },
                {
                    "ua": "IQ4412"
                }
            ],
            "dpi": 307.9,
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "ZTE/*/ZTE Blade L2/*"
                },
                {
                    "ua": "ZTE Blade L2"
                }
            ],
            "dpi": 240,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "BENEVE/*/VR518/*"
                },
                {
                    "ua": "VR518"
                }
            ],
            "dpi": 480,
            "bw": 3,
            "ac": 500
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        640,
                        960
                    ]
                }
            ],
            "dpi": [
                325.1,
                328.4
            ],
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        640,
                        1136
                    ]
                }
            ],
            "dpi": [
                317.1,
                320.2
            ],
            "bw": 3,
            "ac": 1000
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        750,
                        1334
                    ]
                }
            ],
            "dpi": 326.4,
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        1242,
                        2208
                    ]
                }
            ],
            "dpi": [
                453.6,
                458.4
            ],
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        1125,
                        2001
                    ]
                }
            ],
            "dpi": [
                410.9,
                415.4
            ],
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        1125,
                        2436
                    ]
                }
            ],
            "dpi": 458,
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Huawei/*/EML-L29/*"
                },
                {
                    "ua": "EML-L29"
                }
            ],
            "dpi": 428,
            "bw": 3.45,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "Nokia/*/Nokia 7.1/*"
                },
                {
                    "ua": "Nokia 7.1"
                }
            ],
            "dpi": [
                432,
                431.9
            ],
            "bw": 3,
            "ac": 500
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        1242,
                        2688
                    ]
                }
            ],
            "dpi": 458,
            "bw": 4,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G570M/*"
                },
                {
                    "ua": "SM-G570M"
                }
            ],
            "dpi": 320,
            "bw": 3.684,
            "ac": 1000
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G970F/*"
                },
                {
                    "ua": "SM-G970F"
                }
            ],
            "dpi": 438,
            "bw": 2.281,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G973F/*"
                },
                {
                    "ua": "SM-G973F"
                }
            ],
            "dpi": 550,
            "bw": 2.002,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G975F/*"
                },
                {
                    "ua": "SM-G975F"
                }
            ],
            "dpi": 522,
            "bw": 2.054,
            "ac": 500
        },
        {
            "type": "android",
            "rules": [
                {
                    "mdmh": "samsung/*/SM-G977F/*"
                },
                {
                    "ua": "SM-G977F"
                }
            ],
            "dpi": 505,
            "bw": 2.334,
            "ac": 500
        },
        {
            "type": "ios",
            "rules": [
                {
                    "res": [
                        828,
                        1792
                    ]
                }
            ],
            "dpi": 326,
            "bw": 5,
            "ac": 500
        }
    ];
    var DPDB_CACHE = {
        format: format,
        last_updated: last_updated,
        devices: devices
    };
    function Dpdb(url, onDeviceParamsUpdated) {
        this.dpdb = DPDB_CACHE;
        this.recalculateDeviceParams_();
        if (url) {
            this.onDeviceParamsUpdated = onDeviceParamsUpdated;
            var xhr = new XMLHttpRequest();
            var obj = this;
            xhr.open("GET", url, true);
            xhr.addEventListener("load", function() {
                obj.loading = false;
                if (xhr.status >= 200 && xhr.status <= 299) {
                    obj.dpdb = JSON.parse(xhr.response);
                    obj.recalculateDeviceParams_();
                } else console.error("Error loading online DPDB!");
            });
            xhr.send();
        }
    }
    Dpdb.prototype.getDeviceParams = function() {
        return this.deviceParams;
    };
    Dpdb.prototype.recalculateDeviceParams_ = function() {
        var newDeviceParams = this.calcDeviceParams_();
        if (newDeviceParams) {
            this.deviceParams = newDeviceParams;
            if (this.onDeviceParamsUpdated) this.onDeviceParamsUpdated(this.deviceParams);
        } else console.error("Failed to recalculate device parameters.");
    };
    Dpdb.prototype.calcDeviceParams_ = function() {
        var db = this.dpdb;
        if (!db) {
            console.error("DPDB not available.");
            return null;
        }
        if (db.format != 1) {
            console.error("DPDB has unexpected format version.");
            return null;
        }
        if (!db.devices || !db.devices.length) {
            console.error("DPDB does not have a devices section.");
            return null;
        }
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var width = getScreenWidth();
        var height = getScreenHeight();
        if (!db.devices) {
            console.error("DPDB has no devices section.");
            return null;
        }
        for(var i = 0; i < db.devices.length; i++){
            var device = db.devices[i];
            if (!device.rules) {
                console.warn("Device[" + i + "] has no rules section.");
                continue;
            }
            if (device.type != "ios" && device.type != "android") {
                console.warn("Device[" + i + "] has invalid type.");
                continue;
            }
            if (isIOS() != (device.type == "ios")) continue;
            var matched = false;
            for(var j = 0; j < device.rules.length; j++){
                var rule = device.rules[j];
                if (this.ruleMatches_(rule, userAgent, width, height)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) continue;
            var xdpi = device.dpi[0] || device.dpi;
            var ydpi = device.dpi[1] || device.dpi;
            return new DeviceParams({
                xdpi: xdpi,
                ydpi: ydpi,
                bevelMm: device.bw
            });
        }
        console.warn("No DPDB device match.");
        return null;
    };
    Dpdb.prototype.ruleMatches_ = function(rule, ua, screenWidth, screenHeight) {
        if (!rule.ua && !rule.res) return false;
        if (rule.ua && rule.ua.substring(0, 2) === "SM") rule.ua = rule.ua.substring(0, 7);
        if (rule.ua && ua.indexOf(rule.ua) < 0) return false;
        if (rule.res) {
            if (!rule.res[0] || !rule.res[1]) return false;
            var resX = rule.res[0];
            var resY = rule.res[1];
            if (Math.min(screenWidth, screenHeight) != Math.min(resX, resY) || Math.max(screenWidth, screenHeight) != Math.max(resX, resY)) return false;
        }
        return true;
    };
    function DeviceParams(params) {
        this.xdpi = params.xdpi;
        this.ydpi = params.ydpi;
        this.bevelMm = params.bevelMm;
    }
    function SensorSample(sample, timestampS) {
        this.set(sample, timestampS);
    }
    SensorSample.prototype.set = function(sample, timestampS) {
        this.sample = sample;
        this.timestampS = timestampS;
    };
    SensorSample.prototype.copy = function(sensorSample) {
        this.set(sensorSample.sample, sensorSample.timestampS);
    };
    function ComplementaryFilter(kFilter, isDebug) {
        this.kFilter = kFilter;
        this.isDebug = isDebug;
        this.currentAccelMeasurement = new SensorSample();
        this.currentGyroMeasurement = new SensorSample();
        this.previousGyroMeasurement = new SensorSample();
        if (isIOS()) this.filterQ = new Quaternion(-1, 0, 0, 1);
        else this.filterQ = new Quaternion(1, 0, 0, 1);
        this.previousFilterQ = new Quaternion();
        this.previousFilterQ.copy(this.filterQ);
        this.accelQ = new Quaternion();
        this.isOrientationInitialized = false;
        this.estimatedGravity = new Vector3();
        this.measuredGravity = new Vector3();
        this.gyroIntegralQ = new Quaternion();
    }
    ComplementaryFilter.prototype.addAccelMeasurement = function(vector, timestampS) {
        this.currentAccelMeasurement.set(vector, timestampS);
    };
    ComplementaryFilter.prototype.addGyroMeasurement = function(vector, timestampS) {
        this.currentGyroMeasurement.set(vector, timestampS);
        var deltaT = timestampS - this.previousGyroMeasurement.timestampS;
        if (isTimestampDeltaValid(deltaT)) this.run_();
        this.previousGyroMeasurement.copy(this.currentGyroMeasurement);
    };
    ComplementaryFilter.prototype.run_ = function() {
        if (!this.isOrientationInitialized) {
            this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample);
            this.previousFilterQ.copy(this.accelQ);
            this.isOrientationInitialized = true;
            return;
        }
        var deltaT = this.currentGyroMeasurement.timestampS - this.previousGyroMeasurement.timestampS;
        var gyroDeltaQ = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, deltaT);
        this.gyroIntegralQ.multiply(gyroDeltaQ);
        this.filterQ.copy(this.previousFilterQ);
        this.filterQ.multiply(gyroDeltaQ);
        var invFilterQ = new Quaternion();
        invFilterQ.copy(this.filterQ);
        invFilterQ.inverse();
        this.estimatedGravity.set(0, 0, -1);
        this.estimatedGravity.applyQuaternion(invFilterQ);
        this.estimatedGravity.normalize();
        this.measuredGravity.copy(this.currentAccelMeasurement.sample);
        this.measuredGravity.normalize();
        var deltaQ = new Quaternion();
        deltaQ.setFromUnitVectors(this.estimatedGravity, this.measuredGravity);
        deltaQ.inverse();
        if (this.isDebug) console.log("Delta: %d deg, G_est: (%s, %s, %s), G_meas: (%s, %s, %s)", radToDeg * getQuaternionAngle(deltaQ), this.estimatedGravity.x.toFixed(1), this.estimatedGravity.y.toFixed(1), this.estimatedGravity.z.toFixed(1), this.measuredGravity.x.toFixed(1), this.measuredGravity.y.toFixed(1), this.measuredGravity.z.toFixed(1));
        var targetQ = new Quaternion();
        targetQ.copy(this.filterQ);
        targetQ.multiply(deltaQ);
        this.filterQ.slerp(targetQ, 1 - this.kFilter);
        this.previousFilterQ.copy(this.filterQ);
    };
    ComplementaryFilter.prototype.getOrientation = function() {
        return this.filterQ;
    };
    ComplementaryFilter.prototype.accelToQuaternion_ = function(accel) {
        var normAccel = new Vector3();
        normAccel.copy(accel);
        normAccel.normalize();
        var quat = new Quaternion();
        quat.setFromUnitVectors(new Vector3(0, 0, -1), normAccel);
        quat.inverse();
        return quat;
    };
    ComplementaryFilter.prototype.gyroToQuaternionDelta_ = function(gyro, dt) {
        var quat = new Quaternion();
        var axis = new Vector3();
        axis.copy(gyro);
        axis.normalize();
        quat.setFromAxisAngle(axis, gyro.length() * dt);
        return quat;
    };
    function PosePredictor(predictionTimeS, isDebug) {
        this.predictionTimeS = predictionTimeS;
        this.isDebug = isDebug;
        this.previousQ = new Quaternion();
        this.previousTimestampS = null;
        this.deltaQ = new Quaternion();
        this.outQ = new Quaternion();
    }
    PosePredictor.prototype.getPrediction = function(currentQ, gyro, timestampS) {
        if (!this.previousTimestampS) {
            this.previousQ.copy(currentQ);
            this.previousTimestampS = timestampS;
            return currentQ;
        }
        var axis = new Vector3();
        axis.copy(gyro);
        axis.normalize();
        var angularSpeed = gyro.length();
        if (angularSpeed < degToRad * 20) {
            if (this.isDebug) console.log("Moving slowly, at %s deg/s: no prediction", (radToDeg * angularSpeed).toFixed(1));
            this.outQ.copy(currentQ);
            this.previousQ.copy(currentQ);
            return this.outQ;
        }
        var predictAngle = angularSpeed * this.predictionTimeS;
        this.deltaQ.setFromAxisAngle(axis, predictAngle);
        this.outQ.copy(this.previousQ);
        this.outQ.multiply(this.deltaQ);
        this.previousQ.copy(currentQ);
        this.previousTimestampS = timestampS;
        return this.outQ;
    };
    function FusionPoseSensor(kFilter, predictionTime, yawOnly, isDebug) {
        this.yawOnly = yawOnly;
        this.accelerometer = new Vector3();
        this.gyroscope = new Vector3();
        this.filter = new ComplementaryFilter(kFilter, isDebug);
        this.posePredictor = new PosePredictor(predictionTime, isDebug);
        this.isFirefoxAndroid = isFirefoxAndroid();
        this.isIOS = isIOS();
        var chromeVersion = getChromeVersion();
        this.isDeviceMotionInRadians = !this.isIOS && chromeVersion && chromeVersion < 66;
        this.isWithoutDeviceMotion = isChromeWithoutDeviceMotion() || isSafariWithoutDeviceMotion();
        this.filterToWorldQ = new Quaternion();
        if (isIOS()) this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
        else this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
        this.inverseWorldToScreenQ = new Quaternion();
        this.worldToScreenQ = new Quaternion();
        this.originalPoseAdjustQ = new Quaternion();
        this.originalPoseAdjustQ.setFromAxisAngle(new Vector3(0, 0, 1), -window.orientation * Math.PI / 180);
        this.setScreenTransform_();
        if (isLandscapeMode()) this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
        this.resetQ = new Quaternion();
        this.orientationOut_ = new Float32Array(4);
        this.start();
    }
    FusionPoseSensor.prototype.getPosition = function() {
        return null;
    };
    FusionPoseSensor.prototype.getOrientation = function() {
        var orientation = void 0;
        if (this.isWithoutDeviceMotion && this._deviceOrientationQ) {
            this.deviceOrientationFixQ = this.deviceOrientationFixQ || function() {
                var z = new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), 0);
                var y = new Quaternion();
                if (window.orientation === -90) y.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / -2);
                else y.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
                return z.multiply(y);
            }();
            this.deviceOrientationFilterToWorldQ = this.deviceOrientationFilterToWorldQ || function() {
                var q = new Quaternion();
                q.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
                return q;
            }();
            orientation = this._deviceOrientationQ;
            var out = new Quaternion();
            out.copy(orientation);
            out.multiply(this.deviceOrientationFilterToWorldQ);
            out.multiply(this.resetQ);
            out.multiply(this.worldToScreenQ);
            out.multiplyQuaternions(this.deviceOrientationFixQ, out);
            if (this.yawOnly) {
                out.x = 0;
                out.z = 0;
                out.normalize();
            }
            this.orientationOut_[0] = out.x;
            this.orientationOut_[1] = out.y;
            this.orientationOut_[2] = out.z;
            this.orientationOut_[3] = out.w;
            return this.orientationOut_;
        } else {
            var filterOrientation = this.filter.getOrientation();
            orientation = this.posePredictor.getPrediction(filterOrientation, this.gyroscope, this.previousTimestampS);
        }
        var out = new Quaternion();
        out.copy(this.filterToWorldQ);
        out.multiply(this.resetQ);
        out.multiply(orientation);
        out.multiply(this.worldToScreenQ);
        if (this.yawOnly) {
            out.x = 0;
            out.z = 0;
            out.normalize();
        }
        this.orientationOut_[0] = out.x;
        this.orientationOut_[1] = out.y;
        this.orientationOut_[2] = out.z;
        this.orientationOut_[3] = out.w;
        return this.orientationOut_;
    };
    FusionPoseSensor.prototype.resetPose = function() {
        this.resetQ.copy(this.filter.getOrientation());
        this.resetQ.x = 0;
        this.resetQ.y = 0;
        this.resetQ.z *= -1;
        this.resetQ.normalize();
        if (isLandscapeMode()) this.resetQ.multiply(this.inverseWorldToScreenQ);
        this.resetQ.multiply(this.originalPoseAdjustQ);
    };
    FusionPoseSensor.prototype.onDeviceOrientation_ = function(e) {
        this._deviceOrientationQ = this._deviceOrientationQ || new Quaternion();
        var alpha = e.alpha, beta = e.beta, gamma = e.gamma;
        alpha = (alpha || 0) * Math.PI / 180;
        beta = (beta || 0) * Math.PI / 180;
        gamma = (gamma || 0) * Math.PI / 180;
        this._deviceOrientationQ.setFromEulerYXZ(beta, alpha, -gamma);
    };
    FusionPoseSensor.prototype.onDeviceMotion_ = function(deviceMotion) {
        this.updateDeviceMotion_(deviceMotion);
    };
    FusionPoseSensor.prototype.updateDeviceMotion_ = function(deviceMotion) {
        var accGravity = deviceMotion.accelerationIncludingGravity;
        var rotRate = deviceMotion.rotationRate;
        var timestampS = deviceMotion.timeStamp / 1000;
        var deltaS = timestampS - this.previousTimestampS;
        if (deltaS < 0) {
            warnOnce("fusion-pose-sensor:invalid:non-monotonic", "Invalid timestamps detected: non-monotonic timestamp from devicemotion");
            this.previousTimestampS = timestampS;
            return;
        } else if (deltaS <= MIN_TIMESTEP || deltaS > MAX_TIMESTEP) {
            warnOnce("fusion-pose-sensor:invalid:outside-threshold", "Invalid timestamps detected: Timestamp from devicemotion outside expected range.");
            this.previousTimestampS = timestampS;
            return;
        }
        this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
        if (rotRate) {
            if (isR7()) this.gyroscope.set(-rotRate.beta, rotRate.alpha, rotRate.gamma);
            else this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);
            if (!this.isDeviceMotionInRadians) this.gyroscope.multiplyScalar(Math.PI / 180);
            this.filter.addGyroMeasurement(this.gyroscope, timestampS);
        }
        this.filter.addAccelMeasurement(this.accelerometer, timestampS);
        this.previousTimestampS = timestampS;
    };
    FusionPoseSensor.prototype.onOrientationChange_ = function(screenOrientation) {
        this.setScreenTransform_();
    };
    FusionPoseSensor.prototype.onMessage_ = function(event) {
        var message = event.data;
        if (!message || !message.type) return;
        var type = message.type.toLowerCase();
        if (type !== "devicemotion") return;
        this.updateDeviceMotion_(message.deviceMotionEvent);
    };
    FusionPoseSensor.prototype.setScreenTransform_ = function() {
        this.worldToScreenQ.set(0, 0, 0, 1);
        switch(window.orientation){
            case 0:
                break;
            case 90:
                this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2);
                break;
            case -90:
                this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
                break;
            case 180:
                break;
        }
        this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
        this.inverseWorldToScreenQ.inverse();
    };
    FusionPoseSensor.prototype.start = function() {
        this.onDeviceMotionCallback_ = this.onDeviceMotion_.bind(this);
        this.onOrientationChangeCallback_ = this.onOrientationChange_.bind(this);
        this.onMessageCallback_ = this.onMessage_.bind(this);
        this.onDeviceOrientationCallback_ = this.onDeviceOrientation_.bind(this);
        if (isIOS() && isInsideCrossOriginIFrame()) window.addEventListener("message", this.onMessageCallback_);
        window.addEventListener("orientationchange", this.onOrientationChangeCallback_);
        if (this.isWithoutDeviceMotion) window.addEventListener("deviceorientation", this.onDeviceOrientationCallback_);
        else window.addEventListener("devicemotion", this.onDeviceMotionCallback_);
    };
    FusionPoseSensor.prototype.stop = function() {
        window.removeEventListener("devicemotion", this.onDeviceMotionCallback_);
        window.removeEventListener("deviceorientation", this.onDeviceOrientationCallback_);
        window.removeEventListener("orientationchange", this.onOrientationChangeCallback_);
        window.removeEventListener("message", this.onMessageCallback_);
    };
    var SENSOR_FREQUENCY = 60;
    var X_AXIS = new Vector3(1, 0, 0);
    var Z_AXIS = new Vector3(0, 0, 1);
    var SENSOR_TO_VR = new Quaternion();
    SENSOR_TO_VR.setFromAxisAngle(X_AXIS, -Math.PI / 2);
    SENSOR_TO_VR.multiply(new Quaternion().setFromAxisAngle(Z_AXIS, Math.PI / 2));
    var PoseSensor = function() {
        function PoseSensor(config) {
            classCallCheck(this, PoseSensor);
            this.config = config;
            this.sensor = null;
            this.fusionSensor = null;
            this._out = new Float32Array(4);
            this.api = null;
            this.errors = [];
            this._sensorQ = new Quaternion();
            this._outQ = new Quaternion();
            this._onSensorRead = this._onSensorRead.bind(this);
            this._onSensorError = this._onSensorError.bind(this);
            this.init();
        }
        createClass(PoseSensor, [
            {
                key: "init",
                value: function init() {
                    var sensor = null;
                    try {
                        sensor = new RelativeOrientationSensor({
                            frequency: SENSOR_FREQUENCY,
                            referenceFrame: "screen"
                        });
                        sensor.addEventListener("error", this._onSensorError);
                    } catch (error) {
                        this.errors.push(error);
                        if (error.name === "SecurityError") {
                            console.error("Cannot construct sensors due to the Feature Policy");
                            console.warn('Attempting to fall back using "devicemotion"; however this will fail in the future without correct permissions.');
                            this.useDeviceMotion();
                        } else if (error.name === "ReferenceError") this.useDeviceMotion();
                        else console.error(error);
                    }
                    if (sensor) {
                        this.api = "sensor";
                        this.sensor = sensor;
                        this.sensor.addEventListener("reading", this._onSensorRead);
                        this.sensor.start();
                    }
                }
            },
            {
                key: "useDeviceMotion",
                value: function useDeviceMotion() {
                    this.api = "devicemotion";
                    this.fusionSensor = new FusionPoseSensor(this.config.K_FILTER, this.config.PREDICTION_TIME_S, this.config.YAW_ONLY, this.config.DEBUG);
                    if (this.sensor) {
                        this.sensor.removeEventListener("reading", this._onSensorRead);
                        this.sensor.removeEventListener("error", this._onSensorError);
                        this.sensor = null;
                    }
                }
            },
            {
                key: "getOrientation",
                value: function getOrientation() {
                    if (this.fusionSensor) return this.fusionSensor.getOrientation();
                    if (!this.sensor || !this.sensor.quaternion) {
                        this._out[0] = this._out[1] = this._out[2] = 0;
                        this._out[3] = 1;
                        return this._out;
                    }
                    var q = this.sensor.quaternion;
                    this._sensorQ.set(q[0], q[1], q[2], q[3]);
                    var out = this._outQ;
                    out.copy(SENSOR_TO_VR);
                    out.multiply(this._sensorQ);
                    if (this.config.YAW_ONLY) {
                        out.x = out.z = 0;
                        out.normalize();
                    }
                    this._out[0] = out.x;
                    this._out[1] = out.y;
                    this._out[2] = out.z;
                    this._out[3] = out.w;
                    return this._out;
                }
            },
            {
                key: "_onSensorError",
                value: function _onSensorError(event) {
                    this.errors.push(event.error);
                    if (event.error.name === "NotAllowedError") console.error("Permission to access sensor was denied");
                    else if (event.error.name === "NotReadableError") console.error("Sensor could not be read");
                    else console.error(event.error);
                    this.useDeviceMotion();
                }
            },
            {
                key: "_onSensorRead",
                value: function _onSensorRead() {}
            }
        ]);
        return PoseSensor;
    }();
    var rotateInstructionsAsset = "<svg width='198' height='240' viewBox='0 0 198 240' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><path d='M149.625 109.527l6.737 3.891v.886c0 .177.013.36.038.549.01.081.02.162.027.242.14 1.415.974 2.998 2.105 3.999l5.72 5.062.081-.09s4.382-2.53 5.235-3.024l25.97 14.993v54.001c0 .771-.386 1.217-.948 1.217-.233 0-.495-.076-.772-.236l-23.967-13.838-.014.024-27.322 15.775-.85-1.323c-4.731-1.529-9.748-2.74-14.951-3.61a.27.27 0 0 0-.007.024l-5.067 16.961-7.891 4.556-.037-.063v27.59c0 .772-.386 1.217-.948 1.217-.232 0-.495-.076-.772-.236l-42.473-24.522c-.95-.549-1.72-1.877-1.72-2.967v-1.035l-.021.047a5.111 5.111 0 0 0-1.816-.399 5.682 5.682 0 0 0-.546.001 13.724 13.724 0 0 1-1.918-.041c-1.655-.153-3.2-.6-4.404-1.296l-46.576-26.89.005.012-10.278-18.75c-1.001-1.827-.241-4.216 1.698-5.336l56.011-32.345a4.194 4.194 0 0 1 2.099-.572c1.326 0 2.572.659 3.227 1.853l.005-.003.227.413-.006.004a9.63 9.63 0 0 0 1.477 2.018l.277.27c1.914 1.85 4.468 2.801 7.113 2.801 1.949 0 3.948-.517 5.775-1.572.013 0 7.319-4.219 7.319-4.219a4.194 4.194 0 0 1 2.099-.572c1.326 0 2.572.658 3.226 1.853l3.25 5.928.022-.018 6.785 3.917-.105-.182 46.881-26.965m0-1.635c-.282 0-.563.073-.815.218l-46.169 26.556-5.41-3.124-3.005-5.481c-.913-1.667-2.699-2.702-4.66-2.703-1.011 0-2.02.274-2.917.792a3825 3825 0 0 1-7.275 4.195l-.044.024a9.937 9.937 0 0 1-4.957 1.353c-2.292 0-4.414-.832-5.976-2.342l-.252-.245a7.992 7.992 0 0 1-1.139-1.534 1.379 1.379 0 0 0-.06-.122l-.227-.414a1.718 1.718 0 0 0-.095-.154c-.938-1.574-2.673-2.545-4.571-2.545-1.011 0-2.02.274-2.917.792L3.125 155.502c-2.699 1.559-3.738 4.94-2.314 7.538l10.278 18.75c.177.323.448.563.761.704l46.426 26.804c1.403.81 3.157 1.332 5.072 1.508a15.661 15.661 0 0 0 2.146.046 4.766 4.766 0 0 1 .396 0c.096.004.19.011.283.022.109 1.593 1.159 3.323 2.529 4.114l42.472 24.522c.524.302 1.058.455 1.59.455 1.497 0 2.583-1.2 2.583-2.852v-26.562l7.111-4.105a1.64 1.64 0 0 0 .749-.948l4.658-15.593c4.414.797 8.692 1.848 12.742 3.128l.533.829a1.634 1.634 0 0 0 2.193.531l26.532-15.317L193 192.433c.523.302 1.058.455 1.59.455 1.497 0 2.583-1.199 2.583-2.852v-54.001c0-.584-.312-1.124-.818-1.416l-25.97-14.993a1.633 1.633 0 0 0-1.636.001c-.606.351-2.993 1.73-4.325 2.498l-4.809-4.255c-.819-.725-1.461-1.933-1.561-2.936a7.776 7.776 0 0 0-.033-.294 2.487 2.487 0 0 1-.023-.336v-.886c0-.584-.312-1.123-.817-1.416l-6.739-3.891a1.633 1.633 0 0 0-.817-.219' fill='#455A64'/><path d='M96.027 132.636l46.576 26.891c1.204.695 1.979 1.587 2.242 2.541l-.01.007-81.374 46.982h-.001c-1.654-.152-3.199-.6-4.403-1.295l-46.576-26.891 83.546-48.235' fill='#FAFAFA'/><path d='M63.461 209.174c-.008 0-.015 0-.022-.002-1.693-.156-3.228-.609-4.441-1.309l-46.576-26.89a.118.118 0 0 1 0-.203l83.546-48.235a.117.117 0 0 1 .117 0l46.576 26.891c1.227.708 2.021 1.612 2.296 2.611a.116.116 0 0 1-.042.124l-.021.016-81.375 46.981a.11.11 0 0 1-.058.016zm-50.747-28.303l46.401 26.79c1.178.68 2.671 1.121 4.32 1.276l81.272-46.922c-.279-.907-1.025-1.73-2.163-2.387l-46.517-26.857-83.313 48.1z' fill='#607D8B'/><path d='M148.327 165.471a5.85 5.85 0 0 1-.546.001c-1.894-.083-3.302-1.038-3.145-2.132a2.693 2.693 0 0 0-.072-1.105l-81.103 46.822c.628.058 1.272.073 1.918.042.182-.009.364-.009.546-.001 1.894.083 3.302 1.038 3.145 2.132l79.257-45.759' fill='#FFF'/><path d='M69.07 211.347a.118.118 0 0 1-.115-.134c.045-.317-.057-.637-.297-.925-.505-.61-1.555-1.022-2.738-1.074a5.966 5.966 0 0 0-.535.001 14.03 14.03 0 0 1-1.935-.041.117.117 0 0 1-.103-.092.116.116 0 0 1 .055-.126l81.104-46.822a.117.117 0 0 1 .171.07c.104.381.129.768.074 1.153-.045.316.057.637.296.925.506.61 1.555 1.021 2.739 1.073.178.008.357.008.535-.001a.117.117 0 0 1 .064.218l-79.256 45.759a.114.114 0 0 1-.059.016zm-3.405-2.372c.089 0 .177.002.265.006 1.266.056 2.353.488 2.908 1.158.227.274.35.575.36.882l78.685-45.429c-.036 0-.072-.001-.107-.003-1.267-.056-2.354-.489-2.909-1.158-.282-.34-.402-.724-.347-1.107a2.604 2.604 0 0 0-.032-.91L63.846 208.97a13.91 13.91 0 0 0 1.528.012c.097-.005.194-.007.291-.007z' fill='#607D8B'/><path d='M2.208 162.134c-1.001-1.827-.241-4.217 1.698-5.337l56.011-32.344c1.939-1.12 4.324-.546 5.326 1.281l.232.41a9.344 9.344 0 0 0 1.47 2.021l.278.27c3.325 3.214 8.583 3.716 12.888 1.23l7.319-4.22c1.94-1.119 4.324-.546 5.325 1.282l3.25 5.928-83.519 48.229-10.278-18.75z' fill='#FAFAFA'/><path d='M12.486 181.001a.112.112 0 0 1-.031-.005.114.114 0 0 1-.071-.056L2.106 162.19c-1.031-1.88-.249-4.345 1.742-5.494l56.01-32.344a4.328 4.328 0 0 1 2.158-.588c1.415 0 2.65.702 3.311 1.882.01.008.018.017.024.028l.227.414a.122.122 0 0 1 .013.038 9.508 9.508 0 0 0 1.439 1.959l.275.266c1.846 1.786 4.344 2.769 7.031 2.769 1.977 0 3.954-.538 5.717-1.557a.148.148 0 0 1 .035-.013l7.284-4.206a4.321 4.321 0 0 1 2.157-.588c1.427 0 2.672.716 3.329 1.914l3.249 5.929a.116.116 0 0 1-.044.157l-83.518 48.229a.116.116 0 0 1-.059.016zm49.53-57.004c-.704 0-1.41.193-2.041.557l-56.01 32.345c-1.882 1.086-2.624 3.409-1.655 5.179l10.221 18.645 83.317-48.112-3.195-5.829c-.615-1.122-1.783-1.792-3.124-1.792a4.08 4.08 0 0 0-2.04.557l-7.317 4.225a.148.148 0 0 1-.035.013 11.7 11.7 0 0 1-5.801 1.569c-2.748 0-5.303-1.007-7.194-2.835l-.278-.27a9.716 9.716 0 0 1-1.497-2.046.096.096 0 0 1-.013-.037l-.191-.347a.11.11 0 0 1-.023-.029c-.615-1.123-1.783-1.793-3.124-1.793z' fill='#607D8B'/><path d='M42.434 155.808c-2.51-.001-4.697-1.258-5.852-3.365-1.811-3.304-.438-7.634 3.059-9.654l12.291-7.098a7.599 7.599 0 0 1 3.789-1.033c2.51 0 4.697 1.258 5.852 3.365 1.811 3.304.439 7.634-3.059 9.654l-12.291 7.098a7.606 7.606 0 0 1-3.789 1.033zm13.287-20.683a7.128 7.128 0 0 0-3.555.971l-12.291 7.098c-3.279 1.893-4.573 5.942-2.883 9.024 1.071 1.955 3.106 3.122 5.442 3.122a7.13 7.13 0 0 0 3.556-.97l12.291-7.098c3.279-1.893 4.572-5.942 2.883-9.024-1.072-1.955-3.106-3.123-5.443-3.123z' fill='#607D8B'/><path d='M149.588 109.407l6.737 3.89v.887c0 .176.013.36.037.549.011.081.02.161.028.242.14 1.415.973 2.998 2.105 3.999l7.396 6.545c.177.156.358.295.541.415 1.579 1.04 2.95.466 3.062-1.282.049-.784.057-1.595.023-2.429l-.003-.16v-1.151l25.987 15.003v54c0 1.09-.77 1.53-1.72.982l-42.473-24.523c-.95-.548-1.72-1.877-1.72-2.966v-34.033' fill='#FAFAFA'/><path d='M194.553 191.25c-.257 0-.54-.085-.831-.253l-42.472-24.521c-.981-.567-1.779-1.943-1.779-3.068v-34.033h.234v34.033c0 1.051.745 2.336 1.661 2.866l42.473 24.521c.424.245.816.288 1.103.122.285-.164.442-.52.442-1.002v-53.933l-25.753-14.868.003 1.106c.034.832.026 1.654-.024 2.439-.054.844-.396 1.464-.963 1.746-.619.309-1.45.173-2.28-.373a5.023 5.023 0 0 1-.553-.426l-7.397-6.544c-1.158-1.026-1.999-2.625-2.143-4.076a9.624 9.624 0 0 0-.027-.238 4.241 4.241 0 0 1-.038-.564v-.82l-6.68-3.856.117-.202 6.738 3.89.058.034v.954c0 .171.012.351.036.533.011.083.021.165.029.246.138 1.395.948 2.935 2.065 3.923l7.397 6.545c.173.153.35.289.527.406.758.499 1.504.63 2.047.359.49-.243.786-.795.834-1.551.05-.778.057-1.591.024-2.417l-.004-.163v-1.355l.175.1 25.987 15.004.059.033v54.068c0 .569-.198.996-.559 1.204a1.002 1.002 0 0 1-.506.131' fill='#607D8B'/><path d='M145.685 163.161l24.115 13.922-25.978 14.998-1.462-.307c-6.534-2.17-13.628-3.728-21.019-4.616-4.365-.524-8.663 1.096-9.598 3.62a2.746 2.746 0 0 0-.011 1.928c1.538 4.267 4.236 8.363 7.995 12.135l.532.845-25.977 14.997-24.115-13.922 75.518-43.6' fill='#FFF'/><path d='M94.282 220.818l-.059-.033-24.29-14.024.175-.101 75.577-43.634.058.033 24.29 14.024-26.191 15.122-.045-.01-1.461-.307c-6.549-2.174-13.613-3.725-21.009-4.614a13.744 13.744 0 0 0-1.638-.097c-3.758 0-7.054 1.531-7.837 3.642a2.62 2.62 0 0 0-.01 1.848c1.535 4.258 4.216 8.326 7.968 12.091l.016.021.526.835.006.01.064.102-.105.061-25.977 14.998-.058.033zm-23.881-14.057l23.881 13.788 24.802-14.32c.546-.315.846-.489 1.017-.575l-.466-.74c-3.771-3.787-6.467-7.881-8.013-12.168a2.851 2.851 0 0 1 .011-2.008c.815-2.199 4.203-3.795 8.056-3.795.557 0 1.117.033 1.666.099 7.412.891 14.491 2.445 21.041 4.621.836.175 1.215.254 1.39.304l25.78-14.884-23.881-13.788-75.284 43.466z' fill='#607D8B'/><path d='M167.23 125.979v50.871l-27.321 15.773-6.461-14.167c-.91-1.996-3.428-1.738-5.624.574a10.238 10.238 0 0 0-2.33 4.018l-6.46 21.628-27.322 15.774v-50.871l75.518-43.6' fill='#FFF'/><path d='M91.712 220.567a.127.127 0 0 1-.059-.016.118.118 0 0 1-.058-.101v-50.871c0-.042.023-.08.058-.101l75.519-43.6a.117.117 0 0 1 .175.101v50.871c0 .041-.023.08-.059.1l-27.321 15.775a.118.118 0 0 1-.094.01.12.12 0 0 1-.071-.063l-6.46-14.168c-.375-.822-1.062-1.275-1.934-1.275-1.089 0-2.364.686-3.5 1.881a10.206 10.206 0 0 0-2.302 3.972l-6.46 21.627a.118.118 0 0 1-.054.068L91.77 220.551a.12.12 0 0 1-.058.016zm.117-50.92v50.601l27.106-15.65 6.447-21.583a10.286 10.286 0 0 1 2.357-4.065c1.18-1.242 2.517-1.954 3.669-1.954.969 0 1.731.501 2.146 1.411l6.407 14.051 27.152-15.676v-50.601l-75.284 43.466z' fill='#607D8B'/><path d='M168.543 126.213v50.87l-27.322 15.774-6.46-14.168c-.91-1.995-3.428-1.738-5.624.574a10.248 10.248 0 0 0-2.33 4.019l-6.461 21.627-27.321 15.774v-50.87l75.518-43.6' fill='#FFF'/><path d='M93.025 220.8a.123.123 0 0 1-.059-.015.12.12 0 0 1-.058-.101v-50.871c0-.042.023-.08.058-.101l75.518-43.6a.112.112 0 0 1 .117 0c.036.02.059.059.059.1v50.871a.116.116 0 0 1-.059.101l-27.321 15.774a.111.111 0 0 1-.094.01.115.115 0 0 1-.071-.062l-6.46-14.168c-.375-.823-1.062-1.275-1.935-1.275-1.088 0-2.363.685-3.499 1.881a10.19 10.19 0 0 0-2.302 3.971l-6.461 21.628a.108.108 0 0 1-.053.067l-27.322 15.775a.12.12 0 0 1-.058.015zm.117-50.919v50.6l27.106-15.649 6.447-21.584a10.293 10.293 0 0 1 2.357-4.065c1.179-1.241 2.516-1.954 3.668-1.954.969 0 1.732.502 2.147 1.412l6.407 14.051 27.152-15.676v-50.601l-75.284 43.466z' fill='#607D8B'/><path d='M169.8 177.083l-27.322 15.774-6.46-14.168c-.91-1.995-3.428-1.738-5.625.574a10.246 10.246 0 0 0-2.329 4.019l-6.461 21.627-27.321 15.774v-50.87l75.518-43.6v50.87z' fill='#FAFAFA'/><path d='M94.282 220.917a.234.234 0 0 1-.234-.233v-50.871c0-.083.045-.161.117-.202l75.518-43.601a.234.234 0 1 1 .35.202v50.871a.233.233 0 0 1-.116.202l-27.322 15.775a.232.232 0 0 1-.329-.106l-6.461-14.168c-.36-.789-.992-1.206-1.828-1.206-1.056 0-2.301.672-3.415 1.844a10.099 10.099 0 0 0-2.275 3.924l-6.46 21.628a.235.235 0 0 1-.107.136l-27.322 15.774a.23.23 0 0 1-.116.031zm.233-50.969v50.331l26.891-15.525 6.434-21.539a10.41 10.41 0 0 1 2.384-4.112c1.201-1.265 2.569-1.991 3.753-1.991 1.018 0 1.818.526 2.253 1.48l6.354 13.934 26.982-15.578v-50.331l-75.051 43.331z' fill='#607D8B'/><path d='M109.894 199.943c-1.774 0-3.241-.725-4.244-2.12a.224.224 0 0 1 .023-.294.233.233 0 0 1 .301-.023c.78.547 1.705.827 2.75.827 1.323 0 2.754-.439 4.256-1.306 5.311-3.067 9.631-10.518 9.631-16.611 0-1.927-.442-3.56-1.278-4.724a.232.232 0 0 1 .323-.327c1.671 1.172 2.591 3.381 2.591 6.219 0 6.242-4.426 13.863-9.865 17.003-1.574.908-3.084 1.356-4.488 1.356zm-2.969-1.542c.813.651 1.82.877 2.968.877h.001c1.321 0 2.753-.327 4.254-1.194 5.311-3.067 9.632-10.463 9.632-16.556 0-1.979-.463-3.599-1.326-4.761.411 1.035.625 2.275.625 3.635 0 6.243-4.426 13.883-9.865 17.023-1.574.909-3.084 1.317-4.49 1.317-.641 0-1.243-.149-1.799-.341z' fill='#607D8B'/><path d='M113.097 197.23c5.384-3.108 9.748-10.636 9.748-16.814 0-2.051-.483-3.692-1.323-4.86-1.784-1.252-4.374-1.194-7.257.47-5.384 3.108-9.748 10.636-9.748 16.814 0 2.051.483 3.692 1.323 4.86 1.784 1.252 4.374 1.194 7.257-.47' fill='#FAFAFA'/><path d='M108.724 198.614c-1.142 0-2.158-.213-3.019-.817-.021-.014-.04.014-.055-.007-.894-1.244-1.367-2.948-1.367-4.973 0-6.242 4.426-13.864 9.865-17.005 1.574-.908 3.084-1.363 4.49-1.363 1.142 0 2.158.309 3.018.913a.23.23 0 0 1 .056.056c.894 1.244 1.367 2.972 1.367 4.997 0 6.243-4.426 13.783-9.865 16.923-1.574.909-3.084 1.276-4.49 1.276zm-2.718-1.109c.774.532 1.688.776 2.718.776 1.323 0 2.754-.413 4.256-1.28 5.311-3.066 9.631-10.505 9.631-16.598 0-1.909-.434-3.523-1.255-4.685-.774-.533-1.688-.799-2.718-.799-1.323 0-2.755.441-4.256 1.308-5.311 3.066-9.631 10.506-9.631 16.599 0 1.909.434 3.517 1.255 4.679z' fill='#607D8B'/><path d='M149.318 114.262l-9.984 8.878 15.893 11.031 5.589-6.112-11.498-13.797' fill='#FAFAFA'/><path d='M169.676 120.84l-9.748 5.627c-3.642 2.103-9.528 2.113-13.147.024-3.62-2.089-3.601-5.488.041-7.591l9.495-5.608-6.729-3.885-81.836 47.071 45.923 26.514 3.081-1.779c.631-.365.869-.898.618-1.39-2.357-4.632-2.593-9.546-.683-14.262 5.638-13.92 24.509-24.815 48.618-28.07 8.169-1.103 16.68-.967 24.704.394.852.145 1.776.008 2.407-.357l3.081-1.778-25.825-14.91' fill='#FAFAFA'/><path d='M113.675 183.459a.47.47 0 0 1-.233-.062l-45.924-26.515a.468.468 0 0 1 .001-.809l81.836-47.071a.467.467 0 0 1 .466 0l6.729 3.885a.467.467 0 0 1-.467.809l-6.496-3.75-80.9 46.533 44.988 25.973 2.848-1.644c.192-.111.62-.409.435-.773-2.416-4.748-2.658-9.814-.7-14.65 2.806-6.927 8.885-13.242 17.582-18.263 8.657-4.998 19.518-8.489 31.407-10.094 8.198-1.107 16.79-.97 24.844.397.739.125 1.561.007 2.095-.301l2.381-1.374-25.125-14.506a.467.467 0 0 1 .467-.809l25.825 14.91a.467.467 0 0 1 0 .809l-3.081 1.779c-.721.417-1.763.575-2.718.413-7.963-1.351-16.457-1.486-24.563-.392-11.77 1.589-22.512 5.039-31.065 9.977-8.514 4.916-14.456 11.073-17.183 17.805-1.854 4.578-1.623 9.376.666 13.875.37.725.055 1.513-.8 2.006l-3.081 1.78a.476.476 0 0 1-.234.062' fill='#455A64'/><path d='M153.316 128.279c-2.413 0-4.821-.528-6.652-1.586-1.818-1.049-2.82-2.461-2.82-3.975 0-1.527 1.016-2.955 2.861-4.02l9.493-5.607a.233.233 0 1 1 .238.402l-9.496 5.609c-1.696.979-2.628 2.263-2.628 3.616 0 1.34.918 2.608 2.585 3.571 3.549 2.049 9.343 2.038 12.914-.024l9.748-5.628a.234.234 0 0 1 .234.405l-9.748 5.628c-1.858 1.072-4.296 1.609-6.729 1.609' fill='#607D8B'/><path d='M113.675 182.992l-45.913-26.508M113.675 183.342a.346.346 0 0 1-.175-.047l-45.913-26.508a.35.35 0 1 1 .35-.607l45.913 26.508a.35.35 0 0 1-.175.654' fill='#455A64'/><path d='M67.762 156.484v54.001c0 1.09.77 2.418 1.72 2.967l42.473 24.521c.95.549 1.72.11 1.72-.98v-54.001' fill='#FAFAFA'/><path d='M112.727 238.561c-.297 0-.62-.095-.947-.285l-42.473-24.521c-1.063-.613-1.895-2.05-1.895-3.27v-54.001a.35.35 0 1 1 .701 0v54.001c0 .96.707 2.18 1.544 2.663l42.473 24.522c.344.198.661.243.87.122.206-.119.325-.411.325-.799v-54.001a.35.35 0 1 1 .7 0v54.001c0 .655-.239 1.154-.675 1.406a1.235 1.235 0 0 1-.623.162' fill='#455A64'/><path d='M112.86 147.512h-.001c-2.318 0-4.499-.522-6.142-1.471-1.705-.984-2.643-2.315-2.643-3.749 0-1.445.952-2.791 2.68-3.788l12.041-6.953c1.668-.962 3.874-1.493 6.212-1.493 2.318 0 4.499.523 6.143 1.472 1.704.984 2.643 2.315 2.643 3.748 0 1.446-.952 2.791-2.68 3.789l-12.042 6.952c-1.668.963-3.874 1.493-6.211 1.493zm12.147-16.753c-2.217 0-4.298.497-5.861 1.399l-12.042 6.952c-1.502.868-2.33 1.998-2.33 3.182 0 1.173.815 2.289 2.293 3.142 1.538.889 3.596 1.378 5.792 1.378h.001c2.216 0 4.298-.497 5.861-1.399l12.041-6.953c1.502-.867 2.33-1.997 2.33-3.182 0-1.172-.814-2.288-2.292-3.142-1.539-.888-3.596-1.377-5.793-1.377z' fill='#607D8B'/><path d='M165.63 123.219l-5.734 3.311c-3.167 1.828-8.286 1.837-11.433.02-3.147-1.817-3.131-4.772.036-6.601l5.734-3.31 11.397 6.58' fill='#FAFAFA'/><path d='M154.233 117.448l9.995 5.771-4.682 2.704c-1.434.827-3.352 1.283-5.399 1.283-2.029 0-3.923-.449-5.333-1.263-1.29-.744-2-1.694-2-2.674 0-.991.723-1.955 2.036-2.713l5.383-3.108m0-.809l-5.734 3.31c-3.167 1.829-3.183 4.784-.036 6.601 1.568.905 3.623 1.357 5.684 1.357 2.077 0 4.159-.46 5.749-1.377l5.734-3.311-11.397-6.58M145.445 179.667c-1.773 0-3.241-.85-4.243-2.245-.067-.092-.057-.275.023-.356.08-.081.207-.12.3-.055.781.548 1.706.812 2.751.811 1.322 0 2.754-.446 4.256-1.313 5.31-3.066 9.631-10.522 9.631-16.615 0-1.927-.442-3.562-1.279-4.726a.235.235 0 0 1 .024-.301.232.232 0 0 1 .3-.027c1.67 1.172 2.59 3.38 2.59 6.219 0 6.242-4.425 13.987-9.865 17.127-1.573.908-3.083 1.481-4.488 1.481zM142.476 178c.814.651 1.82 1.002 2.969 1.002 1.322 0 2.753-.452 4.255-1.32 5.31-3.065 9.631-10.523 9.631-16.617 0-1.98-.463-3.63-1.325-4.793.411 1.035.624 2.26.624 3.62 0 6.242-4.425 13.875-9.865 17.015-1.573.909-3.084 1.376-4.489 1.376a5.49 5.49 0 0 1-1.8-.283z' fill='#607D8B'/><path d='M148.648 176.704c5.384-3.108 9.748-10.636 9.748-16.813 0-2.052-.483-3.693-1.322-4.861-1.785-1.252-4.375-1.194-7.258.471-5.383 3.108-9.748 10.636-9.748 16.813 0 2.051.484 3.692 1.323 4.86 1.785 1.253 4.374 1.195 7.257-.47' fill='#FAFAFA'/><path d='M144.276 178.276c-1.143 0-2.158-.307-3.019-.911a.217.217 0 0 1-.055-.054c-.895-1.244-1.367-2.972-1.367-4.997 0-6.241 4.425-13.875 9.865-17.016 1.573-.908 3.084-1.369 4.489-1.369 1.143 0 2.158.307 3.019.91a.24.24 0 0 1 .055.055c.894 1.244 1.367 2.971 1.367 4.997 0 6.241-4.425 13.875-9.865 17.016-1.573.908-3.084 1.369-4.489 1.369zm-2.718-1.172c.773.533 1.687.901 2.718.901 1.322 0 2.754-.538 4.256-1.405 5.31-3.066 9.631-10.567 9.631-16.661 0-1.908-.434-3.554-1.256-4.716-.774-.532-1.688-.814-2.718-.814-1.322 0-2.754.433-4.256 1.3-5.31 3.066-9.631 10.564-9.631 16.657 0 1.91.434 3.576 1.256 4.738z' fill='#607D8B'/><path d='M150.72 172.361l-.363-.295a24.105 24.105 0 0 0 2.148-3.128 24.05 24.05 0 0 0 1.977-4.375l.443.149a24.54 24.54 0 0 1-2.015 4.46 24.61 24.61 0 0 1-2.19 3.189M115.917 191.514l-.363-.294a24.174 24.174 0 0 0 2.148-3.128 24.038 24.038 0 0 0 1.976-4.375l.443.148a24.48 24.48 0 0 1-2.015 4.461 24.662 24.662 0 0 1-2.189 3.188M114 237.476V182.584 237.476' fill='#607D8B'/><g><path d='M81.822 37.474c.017-.135-.075-.28-.267-.392-.327-.188-.826-.21-1.109-.045l-6.012 3.471c-.131.076-.194.178-.191.285.002.132.002.461.002.578v.043l-.007.128-6.591 3.779c-.001 0-2.077 1.046-2.787 5.192 0 0-.912 6.961-.898 19.745.015 12.57.606 17.07 1.167 21.351.22 1.684 3.001 2.125 3.001 2.125.331.04.698-.027 1.08-.248l75.273-43.551c1.808-1.069 2.667-3.719 3.056-6.284 1.213-7.99 1.675-32.978-.275-39.878-.196-.693-.51-1.083-.868-1.282l-2.086-.79c-.727.028-1.416.467-1.534.535L82.032 37.072l-.21.402' fill='#FFF'/><path d='M144.311 1.701l2.085.79c.358.199.672.589.868 1.282 1.949 6.9 1.487 31.887.275 39.878-.39 2.565-1.249 5.215-3.056 6.284L69.21 93.486a1.78 1.78 0 0 1-.896.258l-.183-.011c0 .001-2.782-.44-3.003-2.124-.56-4.282-1.151-8.781-1.165-21.351-.015-12.784.897-19.745.897-19.745.71-4.146 2.787-5.192 2.787-5.192l6.591-3.779.007-.128v-.043c0-.117 0-.446-.002-.578-.003-.107.059-.21.191-.285l6.012-3.472a.98.98 0 0 1 .481-.11c.218 0 .449.053.627.156.193.112.285.258.268.392l.211-.402 60.744-34.836c.117-.068.806-.507 1.534-.535m0-.997l-.039.001c-.618.023-1.283.244-1.974.656l-.021.012-60.519 34.706a2.358 2.358 0 0 0-.831-.15c-.365 0-.704.084-.98.244l-6.012 3.471c-.442.255-.699.69-.689 1.166l.001.15-6.08 3.487c-.373.199-2.542 1.531-3.29 5.898l-.006.039c-.009.07-.92 7.173-.906 19.875.014 12.62.603 17.116 1.172 21.465l.002.015c.308 2.355 3.475 2.923 3.836 2.98l.034.004c.101.013.204.019.305.019a2.77 2.77 0 0 0 1.396-.392l75.273-43.552c1.811-1.071 2.999-3.423 3.542-6.997 1.186-7.814 1.734-33.096-.301-40.299-.253-.893-.704-1.527-1.343-1.882l-.132-.062-2.085-.789a.973.973 0 0 0-.353-.065' fill='#455A64'/><path d='M128.267 11.565l1.495.434-56.339 32.326' fill='#FFF'/><path d='M74.202 90.545a.5.5 0 0 1-.25-.931l18.437-10.645a.499.499 0 1 1 .499.864L74.451 90.478l-.249.067M75.764 42.654l-.108-.062.046-.171 5.135-2.964.17.045-.045.171-5.135 2.964-.063.017M70.52 90.375V46.421l.063-.036L137.84 7.554v43.954l-.062.036L70.52 90.375zm.25-43.811v43.38l66.821-38.579V7.985L70.77 46.564z' fill='#607D8B'/><path d='M86.986 83.182c-.23.149-.612.384-.849.523l-11.505 6.701c-.237.139-.206.252.068.252h.565c.275 0 .693-.113.93-.252L87.7 83.705c.237-.139.428-.253.425-.256a11.29 11.29 0 0 1-.006-.503c0-.274-.188-.377-.418-.227l-.715.463' fill='#607D8B'/><path d='M75.266 90.782H74.7c-.2 0-.316-.056-.346-.166-.03-.11.043-.217.215-.317l11.505-6.702c.236-.138.615-.371.844-.519l.715-.464a.488.488 0 0 1 .266-.089c.172 0 .345.13.345.421 0 .214.001.363.003.437l.006.004-.004.069c-.003.075-.003.075-.486.356l-11.505 6.702a2.282 2.282 0 0 1-.992.268zm-.6-.25l.034.001h.566c.252 0 .649-.108.866-.234l11.505-6.702c.168-.098.294-.173.361-.214-.004-.084-.004-.218-.004-.437l-.095-.171-.131.049-.714.463c-.232.15-.616.386-.854.525l-11.505 6.702-.029.018z' fill='#607D8B'/><path d='M75.266 89.871H74.7c-.2 0-.316-.056-.346-.166-.03-.11.043-.217.215-.317l11.505-6.702c.258-.151.694-.268.993-.268h.565c.2 0 .316.056.346.166.03.11-.043.217-.215.317l-11.505 6.702a2.282 2.282 0 0 1-.992.268zm-.6-.25l.034.001h.566c.252 0 .649-.107.866-.234l11.505-6.702.03-.018-.035-.001h-.565c-.252 0-.649.108-.867.234l-11.505 6.702-.029.018zM74.37 90.801v-1.247 1.247' fill='#607D8B'/><path d='M68.13 93.901c-.751-.093-1.314-.737-1.439-1.376-.831-4.238-1.151-8.782-1.165-21.352-.015-12.784.897-19.745.897-19.745.711-4.146 2.787-5.192 2.787-5.192l74.859-43.219c.223-.129 2.487-1.584 3.195.923 1.95 6.9 1.488 31.887.275 39.878-.389 2.565-1.248 5.215-3.056 6.283L69.21 93.653c-.382.221-.749.288-1.08.248 0 0-2.781-.441-3.001-2.125-.561-4.281-1.152-8.781-1.167-21.351-.014-12.784.898-19.745.898-19.745.71-4.146 2.787-5.191 2.787-5.191l6.598-3.81.871-.119 6.599-3.83.046-.461L68.13 93.901' fill='#FAFAFA'/><path d='M68.317 94.161l-.215-.013h-.001l-.244-.047c-.719-.156-2.772-.736-2.976-2.292-.568-4.34-1.154-8.813-1.168-21.384-.014-12.654.891-19.707.9-19.777.725-4.231 2.832-5.338 2.922-5.382l6.628-3.827.87-.119 6.446-3.742.034-.334a.248.248 0 0 1 .273-.223.248.248 0 0 1 .223.272l-.059.589-6.752 3.919-.87.118-6.556 3.785c-.031.016-1.99 1.068-2.666 5.018-.007.06-.908 7.086-.894 19.702.014 12.539.597 16.996 1.161 21.305.091.691.689 1.154 1.309 1.452a1.95 1.95 0 0 1-.236-.609c-.781-3.984-1.155-8.202-1.17-21.399-.014-12.653.891-19.707.9-19.777.725-4.231 2.832-5.337 2.922-5.382-.004.001 74.444-42.98 74.846-43.212l.028-.017c.904-.538 1.72-.688 2.36-.433.555.221.949.733 1.172 1.52 2.014 7.128 1.46 32.219.281 39.983-.507 3.341-1.575 5.515-3.175 6.462L69.335 93.869a2.023 2.023 0 0 1-1.018.292zm-.147-.507c.293.036.604-.037.915-.217l75.273-43.551c1.823-1.078 2.602-3.915 2.934-6.106 1.174-7.731 1.731-32.695-.268-39.772-.178-.631-.473-1.032-.876-1.192-.484-.193-1.166-.052-1.921.397l-.034.021-74.858 43.218c-.031.017-1.989 1.069-2.666 5.019-.007.059-.908 7.085-.894 19.702.015 13.155.386 17.351 1.161 21.303.09.461.476.983 1.037 1.139.114.025.185.037.196.039h.001z' fill='#455A64'/><path d='M69.317 68.982c.489-.281.885-.056.885.505 0 .56-.396 1.243-.885 1.525-.488.282-.884.057-.884-.504 0-.56.396-1.243.884-1.526' fill='#FFF'/><path d='M68.92 71.133c-.289 0-.487-.228-.487-.625 0-.56.396-1.243.884-1.526a.812.812 0 0 1 .397-.121c.289 0 .488.229.488.626 0 .56-.396 1.243-.885 1.525a.812.812 0 0 1-.397.121m.794-2.459a.976.976 0 0 0-.49.147c-.548.317-.978 1.058-.978 1.687 0 .486.271.812.674.812a.985.985 0 0 0 .491-.146c.548-.317.978-1.057.978-1.687 0-.486-.272-.813-.675-.813' fill='#8097A2'/><path d='M68.92 70.947c-.271 0-.299-.307-.299-.439 0-.491.361-1.116.79-1.363a.632.632 0 0 1 .303-.096c.272 0 .301.306.301.438 0 .491-.363 1.116-.791 1.364a.629.629 0 0 1-.304.096m.794-2.086a.812.812 0 0 0-.397.121c-.488.283-.884.966-.884 1.526 0 .397.198.625.487.625a.812.812 0 0 0 .397-.121c.489-.282.885-.965.885-1.525 0-.397-.199-.626-.488-.626' fill='#8097A2'/><path d='M69.444 85.35c.264-.152.477-.031.477.272 0 .303-.213.67-.477.822-.263.153-.477.031-.477-.271 0-.302.214-.671.477-.823' fill='#FFF'/><path d='M69.23 86.51c-.156 0-.263-.123-.263-.337 0-.302.214-.671.477-.823a.431.431 0 0 1 .214-.066c.156 0 .263.124.263.338 0 .303-.213.67-.477.822a.431.431 0 0 1-.214.066m.428-1.412c-.1 0-.203.029-.307.09-.32.185-.57.618-.57.985 0 .309.185.524.449.524a.63.63 0 0 0 .308-.09c.32-.185.57-.618.57-.985 0-.309-.185-.524-.45-.524' fill='#8097A2'/><path d='M69.23 86.322l-.076-.149c0-.235.179-.544.384-.661l.12-.041.076.151c0 .234-.179.542-.383.66l-.121.04m.428-1.038a.431.431 0 0 0-.214.066c-.263.152-.477.521-.477.823 0 .214.107.337.263.337a.431.431 0 0 0 .214-.066c.264-.152.477-.519.477-.822 0-.214-.107-.338-.263-.338' fill='#8097A2'/><path d='M139.278 7.769v43.667L72.208 90.16V46.493l67.07-38.724' fill='#455A64'/><path d='M72.083 90.375V46.421l.063-.036 67.257-38.831v43.954l-.062.036-67.258 38.831zm.25-43.811v43.38l66.821-38.579V7.985L72.333 46.564z' fill='#607D8B'/></g><path d='M125.737 88.647l-7.639 3.334V84l-11.459 4.713v8.269L99 100.315l13.369 3.646 13.368-15.314' fill='#455A64'/></g></svg>";
    function RotateInstructions() {
        this.loadIcon_();
        var overlay = document.createElement("div");
        var s = overlay.style;
        s.position = "fixed";
        s.top = 0;
        s.right = 0;
        s.bottom = 0;
        s.left = 0;
        s.backgroundColor = "gray";
        s.fontFamily = "sans-serif";
        s.zIndex = 1000000;
        var img = document.createElement("img");
        img.src = this.icon;
        var s = img.style;
        s.marginLeft = "25%";
        s.marginTop = "25%";
        s.width = "50%";
        overlay.appendChild(img);
        var text = document.createElement("div");
        var s = text.style;
        s.textAlign = "center";
        s.fontSize = "16px";
        s.lineHeight = "24px";
        s.margin = "24px 25%";
        s.width = "50%";
        text.innerHTML = "Place your phone into your Cardboard viewer.";
        overlay.appendChild(text);
        var snackbar = document.createElement("div");
        var s = snackbar.style;
        s.backgroundColor = "#CFD8DC";
        s.position = "fixed";
        s.bottom = 0;
        s.width = "100%";
        s.height = "48px";
        s.padding = "14px 24px";
        s.boxSizing = "border-box";
        s.color = "#656A6B";
        overlay.appendChild(snackbar);
        var snackbarText = document.createElement("div");
        snackbarText.style.float = "left";
        snackbarText.innerHTML = "No Cardboard viewer?";
        var snackbarButton = document.createElement("a");
        snackbarButton.href = "https://www.google.com/get/cardboard/get-cardboard/";
        snackbarButton.innerHTML = "get one";
        snackbarButton.target = "_blank";
        var s = snackbarButton.style;
        s.float = "right";
        s.fontWeight = 600;
        s.textTransform = "uppercase";
        s.borderLeft = "1px solid gray";
        s.paddingLeft = "24px";
        s.textDecoration = "none";
        s.color = "#656A6B";
        snackbar.appendChild(snackbarText);
        snackbar.appendChild(snackbarButton);
        this.overlay = overlay;
        this.text = text;
        this.hide();
    }
    RotateInstructions.prototype.show = function(parent) {
        if (!parent && !this.overlay.parentElement) document.body.appendChild(this.overlay);
        else if (parent) {
            if (this.overlay.parentElement && this.overlay.parentElement != parent) this.overlay.parentElement.removeChild(this.overlay);
            parent.appendChild(this.overlay);
        }
        this.overlay.style.display = "block";
        var img = this.overlay.querySelector("img");
        var s = img.style;
        if (isLandscapeMode()) {
            s.width = "20%";
            s.marginLeft = "40%";
            s.marginTop = "3%";
        } else {
            s.width = "50%";
            s.marginLeft = "25%";
            s.marginTop = "25%";
        }
    };
    RotateInstructions.prototype.hide = function() {
        this.overlay.style.display = "none";
    };
    RotateInstructions.prototype.showTemporarily = function(ms, parent) {
        this.show(parent);
        this.timer = setTimeout(this.hide.bind(this), ms);
    };
    RotateInstructions.prototype.disableShowTemporarily = function() {
        clearTimeout(this.timer);
    };
    RotateInstructions.prototype.update = function() {
        this.disableShowTemporarily();
        if (!isLandscapeMode() && isMobile()) this.show();
        else this.hide();
    };
    RotateInstructions.prototype.loadIcon_ = function() {
        this.icon = dataUri("image/svg+xml", rotateInstructionsAsset);
    };
    var DEFAULT_VIEWER = "CardboardV1";
    var VIEWER_KEY = "WEBVR_CARDBOARD_VIEWER";
    var CLASS_NAME = "webvr-polyfill-viewer-selector";
    function ViewerSelector(defaultViewer) {
        try {
            this.selectedKey = localStorage.getItem(VIEWER_KEY);
        } catch (error) {
            console.error("Failed to load viewer profile: %s", error);
        }
        if (!this.selectedKey) this.selectedKey = defaultViewer || DEFAULT_VIEWER;
        this.dialog = this.createDialog_(DeviceInfo.Viewers);
        this.root = null;
        this.onChangeCallbacks_ = [];
    }
    ViewerSelector.prototype.show = function(root) {
        this.root = root;
        root.appendChild(this.dialog);
        var selected = this.dialog.querySelector("#" + this.selectedKey);
        selected.checked = true;
        this.dialog.style.display = "block";
    };
    ViewerSelector.prototype.hide = function() {
        if (this.root && this.root.contains(this.dialog)) this.root.removeChild(this.dialog);
        this.dialog.style.display = "none";
    };
    ViewerSelector.prototype.getCurrentViewer = function() {
        return DeviceInfo.Viewers[this.selectedKey];
    };
    ViewerSelector.prototype.getSelectedKey_ = function() {
        var input = this.dialog.querySelector("input[name=field]:checked");
        if (input) return input.id;
        return null;
    };
    ViewerSelector.prototype.onChange = function(cb) {
        this.onChangeCallbacks_.push(cb);
    };
    ViewerSelector.prototype.fireOnChange_ = function(viewer) {
        for(var i = 0; i < this.onChangeCallbacks_.length; i++)this.onChangeCallbacks_[i](viewer);
    };
    ViewerSelector.prototype.onSave_ = function() {
        this.selectedKey = this.getSelectedKey_();
        if (!this.selectedKey || !DeviceInfo.Viewers[this.selectedKey]) {
            console.error("ViewerSelector.onSave_: this should never happen!");
            return;
        }
        this.fireOnChange_(DeviceInfo.Viewers[this.selectedKey]);
        try {
            localStorage.setItem(VIEWER_KEY, this.selectedKey);
        } catch (error) {
            console.error("Failed to save viewer profile: %s", error);
        }
        this.hide();
    };
    ViewerSelector.prototype.createDialog_ = function(options) {
        var container = document.createElement("div");
        container.classList.add(CLASS_NAME);
        container.style.display = "none";
        var overlay = document.createElement("div");
        var s = overlay.style;
        s.position = "fixed";
        s.left = 0;
        s.top = 0;
        s.width = "100%";
        s.height = "100%";
        s.background = "rgba(0, 0, 0, 0.3)";
        overlay.addEventListener("click", this.hide.bind(this));
        var width = 280;
        var dialog = document.createElement("div");
        var s = dialog.style;
        s.boxSizing = "border-box";
        s.position = "fixed";
        s.top = "24px";
        s.left = "50%";
        s.marginLeft = -width / 2 + "px";
        s.width = width + "px";
        s.padding = "24px";
        s.overflow = "hidden";
        s.background = "#fafafa";
        s.fontFamily = "'Roboto', sans-serif";
        s.boxShadow = "0px 5px 20px #666";
        dialog.appendChild(this.createH1_("Select your viewer"));
        for(var id in options)dialog.appendChild(this.createChoice_(id, options[id].label));
        dialog.appendChild(this.createButton_("Save", this.onSave_.bind(this)));
        container.appendChild(overlay);
        container.appendChild(dialog);
        return container;
    };
    ViewerSelector.prototype.createH1_ = function(name) {
        var h1 = document.createElement("h1");
        var s = h1.style;
        s.color = "black";
        s.fontSize = "20px";
        s.fontWeight = "bold";
        s.marginTop = 0;
        s.marginBottom = "24px";
        h1.innerHTML = name;
        return h1;
    };
    ViewerSelector.prototype.createChoice_ = function(id, name) {
        var div = document.createElement("div");
        div.style.marginTop = "8px";
        div.style.color = "black";
        var input = document.createElement("input");
        input.style.fontSize = "30px";
        input.setAttribute("id", id);
        input.setAttribute("type", "radio");
        input.setAttribute("value", id);
        input.setAttribute("name", "field");
        var label = document.createElement("label");
        label.style.marginLeft = "4px";
        label.setAttribute("for", id);
        label.innerHTML = name;
        div.appendChild(input);
        div.appendChild(label);
        return div;
    };
    ViewerSelector.prototype.createButton_ = function(label, onclick) {
        var button = document.createElement("button");
        button.innerHTML = label;
        var s = button.style;
        s.float = "right";
        s.textTransform = "uppercase";
        s.color = "#1094f7";
        s.fontSize = "14px";
        s.letterSpacing = 0;
        s.border = 0;
        s.background = "none";
        s.marginTop = "16px";
        button.addEventListener("click", onclick);
        return button;
    };
    var commonjsGlobal = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function unwrapExports(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
    }
    function createCommonjsModule(fn, module1) {
        return module1 = {
            exports: {}
        }, fn(module1, module1.exports), module1.exports;
    }
    var NoSleep = createCommonjsModule(function(module1, exports) {
        (function webpackUniversalModuleDefinition(root, factory) {
            module1.exports = factory();
        })(commonjsGlobal, function() {
            return function(modules) {
                var installedModules = {};
                function __webpack_require__(moduleId) {
                    if (installedModules[moduleId]) return installedModules[moduleId].exports;
                    var module1 = installedModules[moduleId] = {
                        i: moduleId,
                        l: false,
                        exports: {}
                    };
                    modules[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__);
                    module1.l = true;
                    return module1.exports;
                }
                __webpack_require__.m = modules;
                __webpack_require__.c = installedModules;
                __webpack_require__.d = function(exports, name, getter) {
                    if (!__webpack_require__.o(exports, name)) Object.defineProperty(exports, name, {
                        configurable: false,
                        enumerable: true,
                        get: getter
                    });
                };
                __webpack_require__.n = function(module1) {
                    var getter = module1 && module1.__esModule ? function getDefault() {
                        return module1["default"];
                    } : function getModuleExports() {
                        return module1;
                    };
                    __webpack_require__.d(getter, "a", getter);
                    return getter;
                };
                __webpack_require__.o = function(object, property) {
                    return Object.prototype.hasOwnProperty.call(object, property);
                };
                __webpack_require__.p = "";
                return __webpack_require__(__webpack_require__.s = 0);
            }([
                function(module1, exports, __webpack_require__) {
                    "use strict";
                    var _createClass = function() {
                        function defineProperties(target, props) {
                            for(var i = 0; i < props.length; i++){
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }
                        return function(Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();
                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                    }
                    var mediaFile = __webpack_require__(1);
                    var oldIOS = typeof navigator !== "undefined" && parseFloat(("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [
                        0,
                        ""
                    ])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) < 10 && !window.MSStream;
                    var NoSleep = function() {
                        function NoSleep() {
                            _classCallCheck(this, NoSleep);
                            if (oldIOS) this.noSleepTimer = null;
                            else {
                                this.noSleepVideo = document.createElement("video");
                                this.noSleepVideo.setAttribute("playsinline", "");
                                this.noSleepVideo.setAttribute("src", mediaFile);
                                this.noSleepVideo.addEventListener("timeupdate", (function(e) {
                                    if (this.noSleepVideo.currentTime > 0.5) this.noSleepVideo.currentTime = Math.random();
                                }).bind(this));
                            }
                        }
                        _createClass(NoSleep, [
                            {
                                key: "enable",
                                value: function enable() {
                                    if (oldIOS) {
                                        this.disable();
                                        this.noSleepTimer = window.setInterval(function() {
                                            window.location.href = "/";
                                            window.setTimeout(window.stop, 0);
                                        }, 15000);
                                    } else this.noSleepVideo.play();
                                }
                            },
                            {
                                key: "disable",
                                value: function disable() {
                                    if (oldIOS) {
                                        if (this.noSleepTimer) {
                                            window.clearInterval(this.noSleepTimer);
                                            this.noSleepTimer = null;
                                        }
                                    } else this.noSleepVideo.pause();
                                }
                            }
                        ]);
                        return NoSleep;
                    }();
                    module1.exports = NoSleep;
                },
                function(module1, exports, __webpack_require__) {
                    "use strict";
                    module1.exports = "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA=";
                }
            ]);
        });
    });
    var NoSleep$1 = unwrapExports(NoSleep);
    var nextDisplayId = 1000;
    var defaultLeftBounds = [
        0,
        0,
        0.5,
        1
    ];
    var defaultRightBounds = [
        0.5,
        0,
        0.5,
        1
    ];
    var raf = window.requestAnimationFrame;
    var caf = window.cancelAnimationFrame;
    function VRFrameData() {
        this.leftProjectionMatrix = new Float32Array(16);
        this.leftViewMatrix = new Float32Array(16);
        this.rightProjectionMatrix = new Float32Array(16);
        this.rightViewMatrix = new Float32Array(16);
        this.pose = null;
    }
    function VRDisplayCapabilities(config) {
        Object.defineProperties(this, {
            hasPosition: {
                writable: false,
                enumerable: true,
                value: config.hasPosition
            },
            hasExternalDisplay: {
                writable: false,
                enumerable: true,
                value: config.hasExternalDisplay
            },
            canPresent: {
                writable: false,
                enumerable: true,
                value: config.canPresent
            },
            maxLayers: {
                writable: false,
                enumerable: true,
                value: config.maxLayers
            },
            hasOrientation: {
                enumerable: true,
                get: function get() {
                    deprecateWarning("VRDisplayCapabilities.prototype.hasOrientation", "VRDisplay.prototype.getFrameData");
                    return config.hasOrientation;
                }
            }
        });
    }
    function VRDisplay(config) {
        config = config || {};
        var USE_WAKELOCK = "wakelock" in config ? config.wakelock : true;
        this.isPolyfilled = true;
        this.displayId = nextDisplayId++;
        this.displayName = "";
        this.depthNear = 0.01;
        this.depthFar = 10000.0;
        this.isPresenting = false;
        Object.defineProperty(this, "isConnected", {
            get: function get() {
                deprecateWarning("VRDisplay.prototype.isConnected", "VRDisplayCapabilities.prototype.hasExternalDisplay");
                return false;
            }
        });
        this.capabilities = new VRDisplayCapabilities({
            hasPosition: false,
            hasOrientation: false,
            hasExternalDisplay: false,
            canPresent: false,
            maxLayers: 1
        });
        this.stageParameters = null;
        this.waitingForPresent_ = false;
        this.layer_ = null;
        this.originalParent_ = null;
        this.fullscreenElement_ = null;
        this.fullscreenWrapper_ = null;
        this.fullscreenElementCachedStyle_ = null;
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
        if (USE_WAKELOCK && isMobile()) this.wakelock_ = new NoSleep$1();
    }
    VRDisplay.prototype.getFrameData = function(frameData) {
        return frameDataFromPose(frameData, this._getPose(), this);
    };
    VRDisplay.prototype.getPose = function() {
        deprecateWarning("VRDisplay.prototype.getPose", "VRDisplay.prototype.getFrameData");
        return this._getPose();
    };
    VRDisplay.prototype.resetPose = function() {
        deprecateWarning("VRDisplay.prototype.resetPose");
        return this._resetPose();
    };
    VRDisplay.prototype.getImmediatePose = function() {
        deprecateWarning("VRDisplay.prototype.getImmediatePose", "VRDisplay.prototype.getFrameData");
        return this._getPose();
    };
    VRDisplay.prototype.requestAnimationFrame = function(callback) {
        return raf(callback);
    };
    VRDisplay.prototype.cancelAnimationFrame = function(id) {
        return caf(id);
    };
    VRDisplay.prototype.wrapForFullscreen = function(element) {
        if (isIOS()) return element;
        if (!this.fullscreenWrapper_) {
            this.fullscreenWrapper_ = document.createElement("div");
            var cssProperties = [
                "height: " + Math.min(screen.height, screen.width) + "px !important",
                "top: 0 !important",
                "left: 0 !important",
                "right: 0 !important",
                "border: 0",
                "margin: 0",
                "padding: 0",
                "z-index: 999999 !important",
                "position: fixed"
            ];
            this.fullscreenWrapper_.setAttribute("style", cssProperties.join("; ") + ";");
            this.fullscreenWrapper_.classList.add("webvr-polyfill-fullscreen-wrapper");
        }
        if (this.fullscreenElement_ == element) return this.fullscreenWrapper_;
        if (this.fullscreenElement_) {
            if (this.originalParent_) this.originalParent_.appendChild(this.fullscreenElement_);
            else this.fullscreenElement_.parentElement.removeChild(this.fullscreenElement_);
        }
        this.fullscreenElement_ = element;
        this.originalParent_ = element.parentElement;
        if (!this.originalParent_) document.body.appendChild(element);
        if (!this.fullscreenWrapper_.parentElement) {
            var parent = this.fullscreenElement_.parentElement;
            parent.insertBefore(this.fullscreenWrapper_, this.fullscreenElement_);
            parent.removeChild(this.fullscreenElement_);
        }
        this.fullscreenWrapper_.insertBefore(this.fullscreenElement_, this.fullscreenWrapper_.firstChild);
        this.fullscreenElementCachedStyle_ = this.fullscreenElement_.getAttribute("style");
        var self1 = this;
        function applyFullscreenElementStyle() {
            if (!self1.fullscreenElement_) return;
            var cssProperties = [
                "position: absolute",
                "top: 0",
                "left: 0",
                "width: " + Math.max(screen.width, screen.height) + "px",
                "height: " + Math.min(screen.height, screen.width) + "px",
                "border: 0",
                "margin: 0",
                "padding: 0"
            ];
            self1.fullscreenElement_.setAttribute("style", cssProperties.join("; ") + ";");
        }
        applyFullscreenElementStyle();
        return this.fullscreenWrapper_;
    };
    VRDisplay.prototype.removeFullscreenWrapper = function() {
        if (!this.fullscreenElement_) return;
        var element = this.fullscreenElement_;
        if (this.fullscreenElementCachedStyle_) element.setAttribute("style", this.fullscreenElementCachedStyle_);
        else element.removeAttribute("style");
        this.fullscreenElement_ = null;
        this.fullscreenElementCachedStyle_ = null;
        var parent = this.fullscreenWrapper_.parentElement;
        this.fullscreenWrapper_.removeChild(element);
        if (this.originalParent_ === parent) parent.insertBefore(element, this.fullscreenWrapper_);
        else if (this.originalParent_) this.originalParent_.appendChild(element);
        parent.removeChild(this.fullscreenWrapper_);
        return element;
    };
    VRDisplay.prototype.requestPresent = function(layers) {
        var wasPresenting = this.isPresenting;
        var self1 = this;
        if (!(layers instanceof Array)) {
            deprecateWarning("VRDisplay.prototype.requestPresent with non-array argument", "an array of VRLayers as the first argument");
            layers = [
                layers
            ];
        }
        return new Promise(function(resolve, reject) {
            if (!self1.capabilities.canPresent) {
                reject(new Error("VRDisplay is not capable of presenting."));
                return;
            }
            if (layers.length == 0 || layers.length > self1.capabilities.maxLayers) {
                reject(new Error("Invalid number of layers."));
                return;
            }
            var incomingLayer = layers[0];
            if (!incomingLayer.source) {
                resolve();
                return;
            }
            var leftBounds = incomingLayer.leftBounds || defaultLeftBounds;
            var rightBounds = incomingLayer.rightBounds || defaultRightBounds;
            if (wasPresenting) {
                var layer = self1.layer_;
                if (layer.source !== incomingLayer.source) layer.source = incomingLayer.source;
                for(var i = 0; i < 4; i++){
                    layer.leftBounds[i] = leftBounds[i];
                    layer.rightBounds[i] = rightBounds[i];
                }
                self1.wrapForFullscreen(self1.layer_.source);
                self1.updatePresent_();
                resolve();
                return;
            }
            self1.layer_ = {
                predistorted: incomingLayer.predistorted,
                source: incomingLayer.source,
                leftBounds: leftBounds.slice(0),
                rightBounds: rightBounds.slice(0)
            };
            self1.waitingForPresent_ = false;
            if (self1.layer_ && self1.layer_.source) {
                var fullscreenElement = self1.wrapForFullscreen(self1.layer_.source);
                var onFullscreenChange = function onFullscreenChange() {
                    var actualFullscreenElement = getFullscreenElement();
                    self1.isPresenting = fullscreenElement === actualFullscreenElement;
                    if (self1.isPresenting) {
                        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape-primary").catch(function(error) {
                            console.error("screen.orientation.lock() failed due to", error.message);
                        });
                        self1.waitingForPresent_ = false;
                        self1.beginPresent_();
                        resolve();
                    } else {
                        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
                        self1.removeFullscreenWrapper();
                        self1.disableWakeLock();
                        self1.endPresent_();
                        self1.removeFullscreenListeners_();
                    }
                    self1.fireVRDisplayPresentChange_();
                };
                var onFullscreenError = function onFullscreenError() {
                    if (!self1.waitingForPresent_) return;
                    self1.removeFullscreenWrapper();
                    self1.removeFullscreenListeners_();
                    self1.disableWakeLock();
                    self1.waitingForPresent_ = false;
                    self1.isPresenting = false;
                    reject(new Error("Unable to present."));
                };
                self1.addFullscreenListeners_(fullscreenElement, onFullscreenChange, onFullscreenError);
                if (requestFullscreen(fullscreenElement)) {
                    self1.enableWakeLock();
                    self1.waitingForPresent_ = true;
                } else if (isIOS() || isWebViewAndroid()) {
                    self1.enableWakeLock();
                    self1.isPresenting = true;
                    self1.beginPresent_();
                    self1.fireVRDisplayPresentChange_();
                    resolve();
                }
            }
            if (!self1.waitingForPresent_ && !isIOS()) {
                exitFullscreen();
                reject(new Error("Unable to present."));
            }
        });
    };
    VRDisplay.prototype.exitPresent = function() {
        var wasPresenting = this.isPresenting;
        var self1 = this;
        this.isPresenting = false;
        this.layer_ = null;
        this.disableWakeLock();
        return new Promise(function(resolve, reject) {
            if (wasPresenting) {
                if (!exitFullscreen() && isIOS()) {
                    self1.endPresent_();
                    self1.fireVRDisplayPresentChange_();
                }
                if (isWebViewAndroid()) {
                    self1.removeFullscreenWrapper();
                    self1.removeFullscreenListeners_();
                    self1.endPresent_();
                    self1.fireVRDisplayPresentChange_();
                }
                resolve();
            } else reject(new Error("Was not presenting to VRDisplay."));
        });
    };
    VRDisplay.prototype.getLayers = function() {
        if (this.layer_) return [
            this.layer_
        ];
        return [];
    };
    VRDisplay.prototype.fireVRDisplayPresentChange_ = function() {
        var event = new CustomEvent("vrdisplaypresentchange", {
            detail: {
                display: this
            }
        });
        window.dispatchEvent(event);
    };
    VRDisplay.prototype.fireVRDisplayConnect_ = function() {
        var event = new CustomEvent("vrdisplayconnect", {
            detail: {
                display: this
            }
        });
        window.dispatchEvent(event);
    };
    VRDisplay.prototype.addFullscreenListeners_ = function(element, changeHandler, errorHandler) {
        this.removeFullscreenListeners_();
        this.fullscreenEventTarget_ = element;
        this.fullscreenChangeHandler_ = changeHandler;
        this.fullscreenErrorHandler_ = errorHandler;
        if (changeHandler) {
            if (document.fullscreenEnabled) element.addEventListener("fullscreenchange", changeHandler, false);
            else if (document.webkitFullscreenEnabled) element.addEventListener("webkitfullscreenchange", changeHandler, false);
            else if (document.mozFullScreenEnabled) document.addEventListener("mozfullscreenchange", changeHandler, false);
            else if (document.msFullscreenEnabled) element.addEventListener("msfullscreenchange", changeHandler, false);
        }
        if (errorHandler) {
            if (document.fullscreenEnabled) element.addEventListener("fullscreenerror", errorHandler, false);
            else if (document.webkitFullscreenEnabled) element.addEventListener("webkitfullscreenerror", errorHandler, false);
            else if (document.mozFullScreenEnabled) document.addEventListener("mozfullscreenerror", errorHandler, false);
            else if (document.msFullscreenEnabled) element.addEventListener("msfullscreenerror", errorHandler, false);
        }
    };
    VRDisplay.prototype.removeFullscreenListeners_ = function() {
        if (!this.fullscreenEventTarget_) return;
        var element = this.fullscreenEventTarget_;
        if (this.fullscreenChangeHandler_) {
            var changeHandler = this.fullscreenChangeHandler_;
            element.removeEventListener("fullscreenchange", changeHandler, false);
            element.removeEventListener("webkitfullscreenchange", changeHandler, false);
            document.removeEventListener("mozfullscreenchange", changeHandler, false);
            element.removeEventListener("msfullscreenchange", changeHandler, false);
        }
        if (this.fullscreenErrorHandler_) {
            var errorHandler = this.fullscreenErrorHandler_;
            element.removeEventListener("fullscreenerror", errorHandler, false);
            element.removeEventListener("webkitfullscreenerror", errorHandler, false);
            document.removeEventListener("mozfullscreenerror", errorHandler, false);
            element.removeEventListener("msfullscreenerror", errorHandler, false);
        }
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
    };
    VRDisplay.prototype.enableWakeLock = function() {
        if (this.wakelock_) this.wakelock_.enable();
    };
    VRDisplay.prototype.disableWakeLock = function() {
        if (this.wakelock_) this.wakelock_.disable();
    };
    VRDisplay.prototype.beginPresent_ = function() {};
    VRDisplay.prototype.endPresent_ = function() {};
    VRDisplay.prototype.submitFrame = function(pose) {};
    VRDisplay.prototype.getEyeParameters = function(whichEye) {
        return null;
    };
    var config = {
        ADDITIONAL_VIEWERS: [],
        DEFAULT_VIEWER: "",
        MOBILE_WAKE_LOCK: true,
        DEBUG: false,
        DPDB_URL: "https://dpdb.webvr.rocks/dpdb.json",
        K_FILTER: 0.98,
        PREDICTION_TIME_S: 0.040,
        CARDBOARD_UI_DISABLED: false,
        ROTATE_INSTRUCTIONS_DISABLED: false,
        YAW_ONLY: false,
        BUFFER_SCALE: 0.5,
        DIRTY_SUBMIT_FRAME_BINDINGS: false
    };
    var Eye = {
        LEFT: "left",
        RIGHT: "right"
    };
    function CardboardVRDisplay(config$$1) {
        var defaults = extend({}, config);
        config$$1 = extend(defaults, config$$1 || {});
        VRDisplay.call(this, {
            wakelock: config$$1.MOBILE_WAKE_LOCK
        });
        this.config = config$$1;
        this.displayName = "Cardboard VRDisplay";
        this.capabilities = new VRDisplayCapabilities({
            hasPosition: false,
            hasOrientation: true,
            hasExternalDisplay: false,
            canPresent: true,
            maxLayers: 1
        });
        this.stageParameters = null;
        this.bufferScale_ = this.config.BUFFER_SCALE;
        this.poseSensor_ = new PoseSensor(this.config);
        this.distorter_ = null;
        this.cardboardUI_ = null;
        this.dpdb_ = new Dpdb(this.config.DPDB_URL, this.onDeviceParamsUpdated_.bind(this));
        this.deviceInfo_ = new DeviceInfo(this.dpdb_.getDeviceParams(), config$$1.ADDITIONAL_VIEWERS);
        this.viewerSelector_ = new ViewerSelector(config$$1.DEFAULT_VIEWER);
        this.viewerSelector_.onChange(this.onViewerChanged_.bind(this));
        this.deviceInfo_.setViewer(this.viewerSelector_.getCurrentViewer());
        if (!this.config.ROTATE_INSTRUCTIONS_DISABLED) this.rotateInstructions_ = new RotateInstructions();
        if (isIOS()) window.addEventListener("resize", this.onResize_.bind(this));
    }
    CardboardVRDisplay.prototype = Object.create(VRDisplay.prototype);
    CardboardVRDisplay.prototype._getPose = function() {
        return {
            position: null,
            orientation: this.poseSensor_.getOrientation(),
            linearVelocity: null,
            linearAcceleration: null,
            angularVelocity: null,
            angularAcceleration: null
        };
    };
    CardboardVRDisplay.prototype._resetPose = function() {
        if (this.poseSensor_.resetPose) this.poseSensor_.resetPose();
    };
    CardboardVRDisplay.prototype._getFieldOfView = function(whichEye) {
        var fieldOfView;
        if (whichEye == Eye.LEFT) fieldOfView = this.deviceInfo_.getFieldOfViewLeftEye();
        else if (whichEye == Eye.RIGHT) fieldOfView = this.deviceInfo_.getFieldOfViewRightEye();
        else {
            console.error("Invalid eye provided: %s", whichEye);
            return null;
        }
        return fieldOfView;
    };
    CardboardVRDisplay.prototype._getEyeOffset = function(whichEye) {
        var offset;
        if (whichEye == Eye.LEFT) offset = [
            -this.deviceInfo_.viewer.interLensDistance * 0.5,
            0.0,
            0.0
        ];
        else if (whichEye == Eye.RIGHT) offset = [
            this.deviceInfo_.viewer.interLensDistance * 0.5,
            0.0,
            0.0
        ];
        else {
            console.error("Invalid eye provided: %s", whichEye);
            return null;
        }
        return offset;
    };
    CardboardVRDisplay.prototype.getEyeParameters = function(whichEye) {
        var offset = this._getEyeOffset(whichEye);
        var fieldOfView = this._getFieldOfView(whichEye);
        var eyeParams = {
            offset: offset,
            renderWidth: this.deviceInfo_.device.width * 0.5 * this.bufferScale_,
            renderHeight: this.deviceInfo_.device.height * this.bufferScale_
        };
        Object.defineProperty(eyeParams, "fieldOfView", {
            enumerable: true,
            get: function get() {
                deprecateWarning("VRFieldOfView", "VRFrameData's projection matrices");
                return fieldOfView;
            }
        });
        return eyeParams;
    };
    CardboardVRDisplay.prototype.onDeviceParamsUpdated_ = function(newParams) {
        if (this.config.DEBUG) console.log("DPDB reported that device params were updated.");
        this.deviceInfo_.updateDeviceParams(newParams);
        if (this.distorter_) this.distorter_.updateDeviceInfo(this.deviceInfo_);
    };
    CardboardVRDisplay.prototype.updateBounds_ = function() {
        if (this.layer_ && this.distorter_ && (this.layer_.leftBounds || this.layer_.rightBounds)) this.distorter_.setTextureBounds(this.layer_.leftBounds, this.layer_.rightBounds);
    };
    CardboardVRDisplay.prototype.beginPresent_ = function() {
        var gl = this.layer_.source.getContext("webgl");
        if (!gl) gl = this.layer_.source.getContext("experimental-webgl");
        if (!gl) gl = this.layer_.source.getContext("webgl2");
        if (!gl) return;
        if (this.layer_.predistorted) {
            if (!this.config.CARDBOARD_UI_DISABLED) {
                gl.canvas.width = getScreenWidth() * this.bufferScale_;
                gl.canvas.height = getScreenHeight() * this.bufferScale_;
                this.cardboardUI_ = new CardboardUI(gl);
            }
        } else {
            if (!this.config.CARDBOARD_UI_DISABLED) this.cardboardUI_ = new CardboardUI(gl);
            this.distorter_ = new CardboardDistorter(gl, this.cardboardUI_, this.config.BUFFER_SCALE, this.config.DIRTY_SUBMIT_FRAME_BINDINGS);
            this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
        if (this.cardboardUI_) this.cardboardUI_.listen((function(e) {
            this.viewerSelector_.show(this.layer_.source.parentElement);
            e.stopPropagation();
            e.preventDefault();
        }).bind(this), (function(e) {
            this.exitPresent();
            e.stopPropagation();
            e.preventDefault();
        }).bind(this));
        if (this.rotateInstructions_) {
            if (isLandscapeMode() && isMobile()) this.rotateInstructions_.showTemporarily(3000, this.layer_.source.parentElement);
            else this.rotateInstructions_.update();
        }
        this.orientationHandler = this.onOrientationChange_.bind(this);
        window.addEventListener("orientationchange", this.orientationHandler);
        this.vrdisplaypresentchangeHandler = this.updateBounds_.bind(this);
        window.addEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler);
        this.fireVRDisplayDeviceParamsChange_();
    };
    CardboardVRDisplay.prototype.endPresent_ = function() {
        if (this.distorter_) {
            this.distorter_.destroy();
            this.distorter_ = null;
        }
        if (this.cardboardUI_) {
            this.cardboardUI_.destroy();
            this.cardboardUI_ = null;
        }
        if (this.rotateInstructions_) this.rotateInstructions_.hide();
        this.viewerSelector_.hide();
        window.removeEventListener("orientationchange", this.orientationHandler);
        window.removeEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler);
    };
    CardboardVRDisplay.prototype.updatePresent_ = function() {
        this.endPresent_();
        this.beginPresent_();
    };
    CardboardVRDisplay.prototype.submitFrame = function(pose) {
        if (this.distorter_) {
            this.updateBounds_();
            this.distorter_.submitFrame();
        } else if (this.cardboardUI_ && this.layer_) {
            var gl = this.layer_.source.getContext("webgl");
            if (!gl) gl = this.layer_.source.getContext("experimental-webgl");
            if (!gl) gl = this.layer_.source.getContext("webgl2");
            var canvas = gl.canvas;
            if (canvas.width != this.lastWidth || canvas.height != this.lastHeight) this.cardboardUI_.onResize();
            this.lastWidth = canvas.width;
            this.lastHeight = canvas.height;
            this.cardboardUI_.render();
        }
    };
    CardboardVRDisplay.prototype.onOrientationChange_ = function(e) {
        this.viewerSelector_.hide();
        if (this.rotateInstructions_) this.rotateInstructions_.update();
        this.onResize_();
    };
    CardboardVRDisplay.prototype.onResize_ = function(e) {
        if (this.layer_) {
            var gl = this.layer_.source.getContext("webgl");
            if (!gl) gl = this.layer_.source.getContext("experimental-webgl");
            if (!gl) gl = this.layer_.source.getContext("webgl2");
            var cssProperties = [
                "position: absolute",
                "top: 0",
                "left: 0",
                "width: 100vw",
                "height: 100vh",
                "border: 0",
                "margin: 0",
                "padding: 0px",
                "box-sizing: content-box"
            ];
            gl.canvas.setAttribute("style", cssProperties.join("; ") + ";");
            safariCssSizeWorkaround(gl.canvas);
        }
    };
    CardboardVRDisplay.prototype.onViewerChanged_ = function(viewer) {
        this.deviceInfo_.setViewer(viewer);
        if (this.distorter_) this.distorter_.updateDeviceInfo(this.deviceInfo_);
        this.fireVRDisplayDeviceParamsChange_();
    };
    CardboardVRDisplay.prototype.fireVRDisplayDeviceParamsChange_ = function() {
        var event = new CustomEvent("vrdisplaydeviceparamschange", {
            detail: {
                vrdisplay: this,
                deviceInfo: this.deviceInfo_
            }
        });
        window.dispatchEvent(event);
    };
    CardboardVRDisplay.VRFrameData = VRFrameData;
    CardboardVRDisplay.VRDisplay = VRDisplay;
    return CardboardVRDisplay;
});

},{}],"gZ9LI":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
var _xrdevice = require("./XRDevice");
var _xrdeviceDefault = parcelHelpers.interopDefault(_xrdevice);
var _gamepadXRInputSource = require("./GamepadXRInputSource");
var _gamepadXRInputSourceDefault = parcelHelpers.interopDefault(_gamepadXRInputSource);
var _utils = require("../utils");
var global = arguments[3];
const PRIVATE = Symbol("@@webxr-polyfill/WebVRDevice");
const TEST_ENV = false;
const EXTRA_PRESENTATION_ATTRIBUTES = {
    // Non-standard attribute to enable running at the native device refresh rate
    // on the Oculus Go.
    highRefreshRate: true
};
// If a gamepad id string includes the name of the key from the map, the button
// index given will be the one used as that controller's primary action button
// rather than the default of button 0.
const PRIMARY_BUTTON_MAP = {
    oculus: 1,
    openvr: 1,
    "spatial controller (spatial interaction source)": 1
};
/**
 * A Session helper class to mirror an XRSession and correlate
 * between an XRSession, and tracking sessions in a XRDevice.
 * Mostly referenced via `session.id` due to needing to verify
 * session creation is possible on the XRDevice before
 * the XRSession can be created.
 */ let SESSION_ID = 0;
class Session {
    constructor(mode, enabledFeatures, polyfillOptions = {}){
        this.mode = mode;
        this.enabledFeatures = enabledFeatures;
        this.outputContext = null;
        this.immersive = mode == "immersive-vr" || mode == "immersive-ar";
        this.ended = null;
        this.baseLayer = null;
        this.id = ++SESSION_ID;
        // A flag indicating whether or not the canvas used for
        // XRWebGLLayer was injected into the DOM to work around
        // Firefox Desktop bug: https://bugzil.la/1435339
        this.modifiedCanvasLayer = false;
        // Since XRPresentationContext is created outside of the main API
        // and does not expose the real 2d/bitmaprender context, manually fetch
        // it and store it.
        if (this.outputContext && !TEST_ENV) {
            const renderContextType = polyfillOptions.renderContextType || "2d";
            this.renderContext = this.outputContext.canvas.getContext(renderContextType);
        }
    }
}
class WebVRDevice extends (0, _xrdeviceDefault.default) {
    /**
   * Takes a VRDisplay instance and a VRFrameData
   * constructor from the WebVR 1.1 spec.
   *
   * @param {VRDisplay} display
   * @param {VRFrameData} VRFrameData
   */ constructor(global1, display){
        const { canPresent } = display.capabilities;
        super(global);
        this.display = display;
        this.frame = new global.VRFrameData();
        this.sessions = new Map();
        this.immersiveSession = null;
        this.canPresent = canPresent;
        this.baseModelMatrix = _mat4.create();
        this.gamepadInputSources = {};
        this.tempVec3 = new Float32Array(3);
        this.onVRDisplayPresentChange = this.onVRDisplayPresentChange.bind(this);
        global.window.addEventListener("vrdisplaypresentchange", this.onVRDisplayPresentChange);
        this.CAN_USE_GAMEPAD = global.navigator && "getGamepads" in global.navigator;
        this.HAS_BITMAP_SUPPORT = (0, _utils.isImageBitmapSupported)(global);
    }
    /**
   * @return {number}
   */ get depthNear() {
        return this.display.depthNear;
    }
    /**
   * @param {number}
   */ set depthNear(val) {
        this.display.depthNear = val;
    }
    /**
   * @return {number}
   */ get depthFar() {
        return this.display.depthFar;
    }
    /**
   * @param {number}
   */ set depthFar(val) {
        this.display.depthFar = val;
    }
    /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */ onBaseLayerSet(sessionId, layer) {
        const session = this.sessions.get(sessionId);
        const canvas = layer.context.canvas;
        // If we're in an immersive session, replace the dummy layer on
        // the 1.1 device.
        if (session.immersive) {
            // Wait for this to resolve before setting session.baseLayer,
            // but we can still safely return this function synchronously
            // We have to set the underlying canvas to the size
            // requested by the 1.1 device.
            const left = this.display.getEyeParameters("left");
            const right = this.display.getEyeParameters("right");
            // Generate height/width due to optics as per 1.1 spec
            canvas.width = Math.max(left.renderWidth, right.renderWidth) * 2;
            canvas.height = Math.max(left.renderHeight, right.renderHeight);
            this.display.requestPresent([
                {
                    source: canvas,
                    attributes: EXTRA_PRESENTATION_ATTRIBUTES
                }
            ]).then(()=>{
                // If canvas is not in the DOM, we must inject it anyway,
                // due to a bug in Firefox Desktop, and ensure it is visible,
                // so style it to be 1x1 in the upper left corner.
                // https://bugzil.la/1435339
                // Our test environment doesn't have the canvas package, skip
                // in tests for now.
                if (!TEST_ENV && !this.global.document.body.contains(canvas)) {
                    session.modifiedCanvasLayer = true;
                    this.global.document.body.appendChild(canvas);
                    (0, _utils.applyCanvasStylesForMinimalRendering)(canvas);
                }
                session.baseLayer = layer;
            });
        } else session.baseLayer = layer;
    }
    /**
   * If a 1.1 VRDisplay cannot present, it could be a 6DOF device
   * that doesn't have its own way to present, but used in magic
   * window mode. So in WebXR lingo, this cannot support an
   * "immersive" session.
   *
   * @param {XRSessionMode} mode
   * @return {boolean}
   */ isSessionSupported(mode) {
        // AR is not supported by the WebVRDevice
        if (mode == "immersive-ar") return false;
        if (mode == "immersive-vr" && this.canPresent === false) return false;
        return true;
    }
    /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */ isFeatureSupported(featureDescriptor) {
        switch(featureDescriptor){
            case "viewer":
                return true;
            case "local":
                return true;
            case "local-floor":
                return true;
            // TODO: We *can* support 'bounded-floor' reference spaces with what WebVR
            // gives us, but it'll take some additional work and may have tricky
            // timing issues.
            case "bounded":
                return false;
            // 'unbounded' is unlikely to ever be supported by the polyfill, since
            // it's pretty much impossible to do correctly without native support.
            case "unbounded":
                return false;
            default:
                return false;
        }
    }
    /**
   * Returns a promise of a session ID if creating a session is successful.
   * Usually used to set up presentation in the device.
   * We can't start presenting in a 1.1 device until we have a canvas
   * layer, so use a dummy layer until `onBaseLayerSet` is called.
   * May reject if session is not supported, or if an error is thrown
   * when calling `requestPresent`.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */ async requestSession(mode, enabledFeatures) {
        if (!this.isSessionSupported(mode)) return Promise.reject();
        let immersive = mode == "immersive-vr";
        // If we're going to present to device, immediately call `requestPresent`
        // since this needs to be inside of a user gesture for Cardboard
        // (requires a user gesture for `requestFullscreen`), as well as
        // WebVR 1.1 requiring to be in a user gesture. Use a dummy canvas,
        // until we get the real canvas to present via `onBaseLayerSet`.
        if (immersive) {
            const canvas = this.global.document.createElement("canvas");
            // Our test environment doesn't have the canvas package, nor this
            // restriction, so skip.
            if (!TEST_ENV) {
                // Create and discard a context to avoid
                // "DOMException: Layer source must have a WebGLRenderingContext"
                const ctx = canvas.getContext("webgl");
            }
            await this.display.requestPresent([
                {
                    source: canvas,
                    attributes: EXTRA_PRESENTATION_ATTRIBUTES
                }
            ]);
        }
        const session = new Session(mode, enabledFeatures, {
            renderContextType: this.HAS_BITMAP_SUPPORT ? "bitmaprenderer" : "2d"
        });
        this.sessions.set(session.id, session);
        if (immersive) {
            this.immersiveSession = session;
            this.dispatchEvent("@@webxr-polyfill/vr-present-start", session.id);
        }
        return Promise.resolve(session.id);
    }
    /**
   * @return {Function}
   */ requestAnimationFrame(callback) {
        return this.display.requestAnimationFrame(callback);
    }
    getPrimaryButtonIndex(gamepad) {
        let primaryButton = 0;
        let name = gamepad.id.toLowerCase();
        for(let key in PRIMARY_BUTTON_MAP)if (name.includes(key)) {
            primaryButton = PRIMARY_BUTTON_MAP[key];
            break;
        }
        // Make sure the index is actually in the button range.
        return Math.min(primaryButton, gamepad.buttons.length - 1);
    }
    onFrameStart(sessionId, renderState) {
        this.display.depthNear = renderState.depthNear;
        this.display.depthFar = renderState.depthFar;
        this.display.getFrameData(this.frame);
        const session = this.sessions.get(sessionId);
        if (session.immersive && this.CAN_USE_GAMEPAD) {
            // Update inputs from gamepad data
            let prevInputSources = this.gamepadInputSources;
            this.gamepadInputSources = {};
            let gamepads = this.global.navigator.getGamepads();
            for(let i = 0; i < gamepads.length; ++i){
                let gamepad = gamepads[i];
                // Supposedly the gamepad's displayId should match the VRDisplay's id,
                // but in practice anything with a non-zero displayId is an XR
                // controller, which is almost certainly associated with any VRDisplay
                // we were able to get.
                if (gamepad && gamepad.displayId > 0) {
                    // Found a gamepad input source for this index.
                    let inputSourceImpl = prevInputSources[i];
                    if (!inputSourceImpl) inputSourceImpl = new (0, _gamepadXRInputSourceDefault.default)(this, this.display, this.getPrimaryButtonIndex(gamepad));
                    inputSourceImpl.updateFromGamepad(gamepad);
                    this.gamepadInputSources[i] = inputSourceImpl;
                    // Process the primary action for the controller
                    if (inputSourceImpl.primaryButtonIndex != -1) {
                        let primaryActionPressed = gamepad.buttons[inputSourceImpl.primaryButtonIndex].pressed;
                        if (primaryActionPressed && !inputSourceImpl.primaryActionPressed) this.dispatchEvent("@@webxr-polyfill/input-select-start", {
                            sessionId: session.id,
                            inputSource: inputSourceImpl.inputSource
                        });
                        else if (!primaryActionPressed && inputSourceImpl.primaryActionPressed) // This will also fire a select event
                        this.dispatchEvent("@@webxr-polyfill/input-select-end", {
                            sessionId: session.id,
                            inputSource: inputSourceImpl.inputSource
                        });
                        inputSourceImpl.primaryActionPressed = primaryActionPressed;
                    }
                    if (inputSourceImpl.primarySqueezeButtonIndex != -1) {
                        let primarySqueezeActionPressed = gamepad.buttons[inputSourceImpl.primarySqueezeButtonIndex].pressed;
                        if (primarySqueezeActionPressed && !inputSourceImpl.primarySqueezeActionPressed) this.dispatchEvent("@@webxr-polyfill/input-squeeze-start", {
                            sessionId: session.id,
                            inputSource: inputSourceImpl.inputSource
                        });
                        else if (!primarySqueezeActionPressed && inputSourceImpl.primarySqueezeActionPressed) // This will also fire a select event
                        this.dispatchEvent("@@webxr-polyfill/input-squeeze-end", {
                            sessionId: session.id,
                            inputSource: inputSourceImpl.inputSource
                        });
                        inputSourceImpl.primarySqueezeActionPressed = primarySqueezeActionPressed;
                    }
                }
            }
        }
        // @TODO Our test environment doesn't have the canvas package for now,
        // but this could be something we add to the tests.
        if (TEST_ENV) return;
        // If the session is inline make sure the projection matrix matches the 
        // aspect ratio of the underlying WebGL canvas.
        if (!session.immersive && session.baseLayer) {
            const canvas = session.baseLayer.context.canvas;
            // Update the projection matrix.
            _mat4.perspective(this.frame.leftProjectionMatrix, renderState.inlineVerticalFieldOfView, canvas.width / canvas.height, renderState.depthNear, renderState.depthFar);
        }
    }
    onFrameEnd(sessionId) {
        const session = this.sessions.get(sessionId);
        // Discard if this session is already ended, or if it does
        // not yet have a baseLayer.
        if (session.ended || !session.baseLayer) return;
        // If session is has an outputContext, whether magic window
        // or mirroring (session.immersive === true), copy the baseLayer
        // pixels to the XRPresentationContext
        // However, abort if this a mirrored context, and our VRDisplay
        // does not have an external display; this kills performance rather
        // quickly on mobile for a canvas that's not seen.
        if (session.outputContext && !(session.immersive && !this.display.capabilities.hasExternalDisplay)) {
            const mirroring = session.immersive && this.display.capabilities.hasExternalDisplay;
            const iCanvas = session.baseLayer.context.canvas;
            const iWidth = mirroring ? iCanvas.width / 2 : iCanvas.width;
            const iHeight = iCanvas.height;
            // @TODO Our test environment doesn't have the canvas package for now,
            // but this could be something we add to the tests.
            if (!TEST_ENV) {
                const oCanvas = session.outputContext.canvas;
                const oWidth = oCanvas.width;
                const oHeight = oCanvas.height;
                // The real underlying RenderContext that will display content
                // for the polyfilled XRPresentationContext
                const renderContext = session.renderContext;
                // If we're using an ImageBitmapRenderingContext as our XRPresentationContext
                if (this.HAS_BITMAP_SUPPORT) {
                    // If the developer is using an OffscreenCanvas, and ImageBitmapRenderingContext
                    // is supported, transfer the bitmap directly.
                    if (iCanvas.transferToImageBitmap) renderContext.transferFromImageBitmap(iCanvas.transferToImageBitmap());
                    else this.global.createImageBitmap(iCanvas, 0, 0, iWidth, iHeight, {
                        resizeWidth: oWidth,
                        resizeHeight: oHeight
                    }).then((bitmap)=>renderContext.transferFromImageBitmap(bitmap));
                } else // We want to render only half of the layer context (left eye)
                // proportional to the size of the outputContext canvas.
                // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                renderContext.drawImage(iCanvas, 0, 0, iWidth, iHeight, 0, 0, oWidth, oHeight);
            }
        }
        // Only submit frame if we're presenting an immersive session.
        // on a session will start presenting in 1.1 but we still have
        // to set up the width/height correctly and wait for `baseLayer` to
        // be set.
        if (session.immersive && session.baseLayer) this.display.submitFrame();
    }
    /**
   * @param {number} handle
   */ cancelAnimationFrame(handle) {
        this.display.cancelAnimationFrame(handle);
    }
    /**
   * @TODO Spec
   */ async endSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session.ended) return;
        // If this is an immersive session, end presenting;
        // the vrdisplaypresentchange event will flip the `ended` bit.
        if (session.immersive) return this.display.exitPresent();
        else session.ended = true;
    }
    /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */ doesSessionSupportReferenceSpace(sessionId, type) {
        const session = this.sessions.get(sessionId);
        if (session.ended) return false;
        return session.enabledFeatures.has(type);
    }
    /**
   * If the VRDisplay has stage parameters, convert them
   * to an array of X, Z pairings.
   *
   * @return {Object?}
   */ requestStageBounds() {
        if (this.display.stageParameters) {
            const width = this.display.stageParameters.sizeX;
            const depth = this.display.stageParameters.sizeZ;
            const data = [];
            data.push(-width / 2); // X
            data.push(-depth / 2); // Z
            data.push(width / 2); // X
            data.push(-depth / 2); // Z
            data.push(width / 2); // X
            data.push(depth / 2); // Z
            data.push(-width / 2); // X
            data.push(depth / 2); // Z
            return data;
        }
        return null;
    }
    /**
   * Returns a promise resolving to a transform if XRDevice
   * can support frame of reference and provides its own values.
   * Can resolve to `undefined` if the polyfilled API can provide
   * a default. Rejects if this XRDevice cannot
   * support the frame of reference.
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<float32rray>}
   */ async requestFrameOfReferenceTransform(type, options) {
        if ((type === "local-floor" || type === "bounded-floor") && this.display.stageParameters && this.display.stageParameters.sittingToStandingTransform) return this.display.stageParameters.sittingToStandingTransform;
        return null;
    }
    /**
   * @param {XREye} eye
   * @return {Float32Array}
   */ getProjectionMatrix(eye) {
        if (eye === "left") return this.frame.leftProjectionMatrix;
        else if (eye === "right") return this.frame.rightProjectionMatrix;
        else if (eye === "none") return this.frame.leftProjectionMatrix;
        else throw new Error(`eye must be of type 'left' or 'right'`);
    }
    /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */ getViewport(sessionId, eye, layer, target) {
        // @TODO can we have another layer passed in that
        // wasn't the same one as the `baseLayer`?
        const session = this.sessions.get(sessionId);
        const { width, height } = layer.context.canvas;
        // If this is a non-immersive session, return the
        // whole canvas as the viewport
        if (!session.immersive) {
            target.x = target.y = 0;
            target.width = width;
            target.height = height;
            return true;
        }
        // WebGL 1.1 viewports are just
        if (eye === "left" || eye === "none") target.x = 0;
        else if (eye === "right") target.x = width / 2;
        else return false;
        target.y = 0;
        target.width = width / 2;
        target.height = height;
        return true;
    }
    /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */ getBasePoseMatrix() {
        let { position, orientation } = this.frame.pose;
        // On initialization, we might not have any values
        if (!position && !orientation) return this.baseModelMatrix;
        if (!position) {
            position = this.tempVec3;
            position[0] = position[1] = position[2] = 0;
        }
        _mat4.fromRotationTranslation(this.baseModelMatrix, orientation, position);
        return this.baseModelMatrix;
    }
    /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */ getBaseViewMatrix(eye) {
        if (eye === "left" || eye === "none") return this.frame.leftViewMatrix;
        else if (eye === "right") return this.frame.rightViewMatrix;
        else throw new Error(`eye must be of type 'left' or 'right'`);
    }
    getInputSources() {
        let inputSources = [];
        for(let i in this.gamepadInputSources)inputSources.push(this.gamepadInputSources[i].inputSource);
        return inputSources;
    }
    getInputPose(inputSource, coordinateSystem, poseType) {
        if (!coordinateSystem) return null;
        for(let i in this.gamepadInputSources){
            let inputSourceImpl = this.gamepadInputSources[i];
            if (inputSourceImpl.inputSource === inputSource) return inputSourceImpl.getXRPose(coordinateSystem, poseType);
        }
        return null;
    }
    /**
   * Triggered on window resize.
   *
   */ onWindowResize() {}
    /**
   * Listens to the Native 1.1 `window.addEventListener('vrdisplaypresentchange')`
   * event.
   *
   * @param {Event} event
   */ onVRDisplayPresentChange(e) {
        if (!this.display.isPresenting) this.sessions.forEach((session)=>{
            if (session.immersive && !session.ended) {
                // If we injected and modified the canvas layer
                // due to https://bugzil.la/1435339, then remove it from the DOM
                // and remove styles.
                if (session.modifiedCanvasLayer) {
                    const canvas = session.baseLayer.context.canvas;
                    document.body.removeChild(canvas);
                    canvas.setAttribute("style", "");
                }
                if (this.immersiveSession === session) this.immersiveSession = null;
                this.dispatchEvent("@@webxr-polyfill/vr-present-end", session.id);
            }
        });
    }
}
exports.default = WebVRDevice;

},{"gl-matrix/src/gl-matrix/mat4":"6Zon6","./XRDevice":"3tJs9","./GamepadXRInputSource":"aTFIk","../utils":"3ahP8","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3tJs9":[function(require,module,exports) {
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _eventTarget = require("../lib/EventTarget");
var _eventTargetDefault = parcelHelpers.interopDefault(_eventTarget);
var _xrreferenceSpace = require("../api/XRReferenceSpace");
var _xrreferenceSpaceDefault = parcelHelpers.interopDefault(_xrreferenceSpace);
var global = arguments[3];
class XRDevice extends (0, _eventTargetDefault.default) {
    /**
   * Takes a VRDisplay object from the WebVR 1.1 spec.
   *
   * @param {Object} global
   */ constructor(global1){
        super();
        this.global = global;
        this.onWindowResize = this.onWindowResize.bind(this);
        this.global.window.addEventListener("resize", this.onWindowResize);
        // Value is used for `XRSession.prototype.environmentBlendMode`
        // and should be one of XREnvironmentBlendMode types: 'opaque', 'additive',
        // or 'alpha-blend'.
        this.environmentBlendMode = "opaque";
    }
    /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */ onBaseLayerSet(sessionId, layer) {
        throw new Error("Not implemented");
    }
    /**
   * @param {XRSessionMode} mode
   * @return {boolean}
   */ isSessionSupported(mode) {
        throw new Error("Not implemented");
    }
    /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */ isFeatureSupported(featureDescriptor) {
        throw new Error("Not implemented");
    }
    /**
   * Returns a promise if creating a session is successful.
   * Usually used to set up presentation in the device.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */ async requestSession(mode, enabledFeatures) {
        throw new Error("Not implemented");
    }
    /**
   * @return {Function}
   */ requestAnimationFrame(callback) {
        throw new Error("Not implemented");
    }
    /**
   * @param {number} sessionId
   */ onFrameStart(sessionId) {
        throw new Error("Not implemented");
    }
    /**
   * @param {number} sessionId
   */ onFrameEnd(sessionId) {
        throw new Error("Not implemented");
    }
    /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */ doesSessionSupportReferenceSpace(sessionId, type) {
        throw new Error("Not implemented");
    }
    /**
   * @return {Object?}
   */ requestStageBounds() {
        throw new Error("Not implemented");
    }
    /**
   * Returns a promise resolving to a transform if XRDevice
   * can support frame of reference and provides its own values.
   * Can resolve to `undefined` if the polyfilled API can provide
   * a default. Rejects if this XRDevice cannot
   * support the frame of reference.
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<XRFrameOfReference>}
   */ async requestFrameOfReferenceTransform(type, options) {
        return undefined;
    }
    /**
   * @param {number} handle
   */ cancelAnimationFrame(handle) {
        throw new Error("Not implemented");
    }
    /**
   * @param {number} sessionId
   */ endSession(sessionId) {
        throw new Error("Not implemented");
    }
    /**
   * Allows the XRDevice to override the XRSession's view spaces.
   *
   * @param {XRSessionMode} mode
   * @return {Array<XRSpace> | undefined}
   */ getViewSpaces(mode) {
        return undefined;
    }
    /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @param {number} viewIndex
   * @return {boolean}
   */ getViewport(sessionId, eye, layer, target, viewIndex) {
        throw new Error("Not implemented");
    }
    /**
   * @param {XREye} eye
   * @param {number} viewIndex
   * @return {Float32Array}
   */ getProjectionMatrix(eye, viewIndex) {
        throw new Error("Not implemented");
    }
    /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */ getBasePoseMatrix() {
        throw new Error("Not implemented");
    }
    /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */ getBaseViewMatrix(eye) {
        throw new Error("Not implemented");
    }
    /**
   * Get a list of input sources.
   *
   * @return {Array<XRInputSource>}
   */ getInputSources() {
        throw new Error("Not implemented");
    }
    /**
   * Get the current pose of an input source.
   *
   * @param {XRInputSource} inputSource
   * @param {XRCoordinateSystem} coordinateSystem
   * @param {String} poseType
   * @return {XRPose}
   */ getInputPose(inputSource, coordinateSystem, poseType) {
        throw new Error("Not implemented");
    }
    /**
   * Called on window resize.
   */ onWindowResize() {
        // Bound by XRDevice and called on resize, but
        // this will call child class onWindowResize (or, if not defined,
        // call an infinite loop I guess)
        this.onWindowResize();
    }
}
exports.default = XRDevice;

},{"../lib/EventTarget":"25tGW","../api/XRReferenceSpace":"iZoqC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aTFIk":[function(require,module,exports) {
/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PRIVATE", ()=>PRIVATE);
var _gamepadMappings = require("./GamepadMappings");
var _gamepadMappingsDefault = parcelHelpers.interopDefault(_gamepadMappings);
var _xrinputSource = require("../api/XRInputSource");
var _xrinputSourceDefault = parcelHelpers.interopDefault(_xrinputSource);
var _orientationArmModel = require("../lib/OrientationArmModel");
var _orientationArmModelDefault = parcelHelpers.interopDefault(_orientationArmModel);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
var _vec3 = require("gl-matrix/src/gl-matrix/vec3");
var _quat = require("gl-matrix/src/gl-matrix/quat");
const PRIVATE = Symbol("@@webxr-polyfill/XRRemappedGamepad");
const PLACEHOLDER_BUTTON = {
    pressed: false,
    touched: false,
    value: 0.0
};
Object.freeze(PLACEHOLDER_BUTTON);
class XRRemappedGamepad {
    constructor(gamepad, display, map){
        if (!map) map = {};
        // Apply user-agent-specific overrides to the mapping when applicable.
        if (map.userAgentOverrides) {
            for(let agent in map.userAgentOverrides)if (navigator.userAgent.includes(agent)) {
                let override = map.userAgentOverrides[agent];
                for(let key in override)if (key in map) // If the key already exists, merge the override values into the
                // existing dictionary.
                Object.assign(map[key], override[key]);
                else // If the base mapping doesn't have this key, insert the override
                // values wholesale.
                map[key] = override[key];
                break;
            }
        }
        let axes = new Array(map.axes && map.axes.length ? map.axes.length : gamepad.axes.length);
        let buttons = new Array(map.buttons && map.buttons.length ? map.buttons.length : gamepad.buttons.length);
        let gripTransform = null;
        if (map.gripTransform) {
            let orientation = map.gripTransform.orientation || [
                0,
                0,
                0,
                1
            ];
            gripTransform = _mat4.create();
            _mat4.fromRotationTranslation(gripTransform, _quat.normalize(orientation, orientation), map.gripTransform.position || [
                0,
                0,
                0
            ]);
        }
        let targetRayTransform = null;
        if (map.targetRayTransform) {
            let orientation = map.targetRayTransform.orientation || [
                0,
                0,
                0,
                1
            ];
            targetRayTransform = _mat4.create();
            _mat4.fromRotationTranslation(targetRayTransform, _quat.normalize(orientation, orientation), map.targetRayTransform.position || [
                0,
                0,
                0
            ]);
        }
        let profiles = map.profiles;
        if (map.displayProfiles) {
            if (display.displayName in map.displayProfiles) profiles = map.displayProfiles[display.displayName];
        }
        this[PRIVATE] = {
            gamepad,
            map,
            profiles: profiles || [
                gamepad.id
            ],
            mapping: map.mapping || gamepad.mapping,
            axes,
            buttons,
            gripTransform,
            targetRayTransform
        };
        this._update();
    }
    _update() {
        let gamepad = this[PRIVATE].gamepad;
        let map = this[PRIVATE].map;
        let axes = this[PRIVATE].axes;
        for(let i = 0; i < axes.length; ++i)if (map.axes && i in map.axes) {
            if (map.axes[i] === null) axes[i] = 0;
            else axes[i] = gamepad.axes[map.axes[i]];
        } else axes[i] = gamepad.axes[i];
        if (map.axes && map.axes.invert) {
            for (let axis of map.axes.invert)if (axis < axes.length) axes[axis] *= -1;
        }
        let buttons = this[PRIVATE].buttons;
        for(let i = 0; i < buttons.length; ++i)if (map.buttons && i in map.buttons) {
            if (map.buttons[i] === null) buttons[i] = PLACEHOLDER_BUTTON;
            else buttons[i] = gamepad.buttons[map.buttons[i]];
        } else buttons[i] = gamepad.buttons[i];
    }
    get id() {
        return "";
    }
    get _profiles() {
        return this[PRIVATE].profiles;
    }
    get index() {
        return -1;
    }
    get connected() {
        return this[PRIVATE].gamepad.connected;
    }
    get timestamp() {
        return this[PRIVATE].gamepad.timestamp;
    }
    get mapping() {
        return this[PRIVATE].mapping;
    }
    get axes() {
        return this[PRIVATE].axes;
    }
    get buttons() {
        return this[PRIVATE].buttons;
    }
    // Non-standard extension
    get hapticActuators() {
        return this[PRIVATE].gamepad.hapticActuators;
    }
}
class GamepadXRInputSource {
    constructor(polyfill, display, primaryButtonIndex = 0, primarySqueezeButtonIndex = -1){
        this.polyfill = polyfill;
        this.display = display;
        this.nativeGamepad = null;
        this.gamepad = null;
        this.inputSource = new (0, _xrinputSourceDefault.default)(this);
        this.lastPosition = _vec3.create();
        this.emulatedPosition = false;
        this.basePoseMatrix = _mat4.create();
        this.outputMatrix = _mat4.create();
        this.primaryButtonIndex = primaryButtonIndex;
        this.primaryActionPressed = false;
        this.primarySqueezeButtonIndex = primarySqueezeButtonIndex;
        this.primarySqueezeActionPressed = false;
        this.handedness = "";
        this.targetRayMode = "gaze";
        this.armModel = null;
    }
    get profiles() {
        return this.gamepad ? this.gamepad._profiles : [];
    }
    updateFromGamepad(gamepad) {
        if (this.nativeGamepad !== gamepad) {
            this.nativeGamepad = gamepad;
            if (gamepad) this.gamepad = new XRRemappedGamepad(gamepad, this.display, (0, _gamepadMappingsDefault.default)[gamepad.id]);
            else this.gamepad = null;
        }
        this.handedness = gamepad.hand === "" ? "none" : gamepad.hand;
        if (this.gamepad) this.gamepad._update();
        if (gamepad.pose) {
            this.targetRayMode = "tracked-pointer";
            this.emulatedPosition = !gamepad.pose.hasPosition;
        } else if (gamepad.hand === "") {
            this.targetRayMode = "gaze";
            this.emulatedPosition = false;
        }
    }
    updateBasePoseMatrix() {
        if (this.nativeGamepad && this.nativeGamepad.pose) {
            let pose = this.nativeGamepad.pose;
            let position = pose.position;
            let orientation = pose.orientation;
            // On initialization, we might not have any values
            if (!position && !orientation) return;
            if (!position) {
                if (!pose.hasPosition) {
                    if (!this.armModel) this.armModel = new (0, _orientationArmModelDefault.default)();
                    this.armModel.setHandedness(this.nativeGamepad.hand);
                    this.armModel.update(orientation, this.polyfill.getBasePoseMatrix());
                    position = this.armModel.getPosition();
                } else position = this.lastPosition;
            } else {
                // This is if we temporarily lose tracking, so the controller doesn't
                // snap back to the origin.
                this.lastPosition[0] = position[0];
                this.lastPosition[1] = position[1];
                this.lastPosition[2] = position[2];
            }
            _mat4.fromRotationTranslation(this.basePoseMatrix, orientation, position);
        } else _mat4.copy(this.basePoseMatrix, this.polyfill.getBasePoseMatrix());
        return this.basePoseMatrix;
    }
    /**
   * @param {XRReferenceSpace} coordinateSystem
   * @param {string} poseType
   * @return {XRPose?}
   */ getXRPose(coordinateSystem, poseType) {
        this.updateBasePoseMatrix();
        switch(poseType){
            case "target-ray":
                coordinateSystem._transformBasePoseMatrix(this.outputMatrix, this.basePoseMatrix);
                if (this.gamepad && this.gamepad[PRIVATE].targetRayTransform) _mat4.multiply(this.outputMatrix, this.outputMatrix, this.gamepad[PRIVATE].targetRayTransform);
                break;
            case "grip":
                if (!this.nativeGamepad || !this.nativeGamepad.pose) return null;
                // TODO: Does the grip matrix need to be tweaked?
                coordinateSystem._transformBasePoseMatrix(this.outputMatrix, this.basePoseMatrix);
                if (this.gamepad && this.gamepad[PRIVATE].gripTransform) _mat4.multiply(this.outputMatrix, this.outputMatrix, this.gamepad[PRIVATE].gripTransform);
                break;
            default:
                return null;
        }
        coordinateSystem._adjustForOriginOffset(this.outputMatrix);
        return new XRPose(new XRRigidTransform(this.outputMatrix), this.emulatedPosition);
    }
}
exports.default = GamepadXRInputSource;

},{"./GamepadMappings":"1BNtR","../api/XRInputSource":"eIB3M","../lib/OrientationArmModel":"eD0bI","gl-matrix/src/gl-matrix/mat4":"6Zon6","gl-matrix/src/gl-matrix/vec3":"k7jpC","gl-matrix/src/gl-matrix/quat":"kJ4kK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1BNtR":[function(require,module,exports) {
/*
 * Copyright 2019 Immersive Web Community Group. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /*
Example Gamepad mapping. Any of the values may be omitted for the original
gamepad values to pass through unchanged.

"Gamepad ID String": { // The Gamepad.id that this entry maps to.
  mapping: 'xr-standard', // Overrides the Gamepad.mapping that is reported
  profiles: ['gamepad-id-string'], // The profiles array that should be reported
  displayProfiles: {
    // Alternative profiles arrays to report if the VRDevice.displayName matches
    "WebVR Display Name": ['gamepad-id-string']
  },
  axes: { // Remaps the reported axes
    length: 2, // Overrides the length of the reported axes array
    invert: [0] // List of mapped axes who's value should be inverted
    0: 2, // Remaps axes[0] to report axis[2] from the original gamepad object
    1: null, // Remaps axes[1] to a placeholder axis (always reports 0)
  },
  buttons: { // Remaps the reported buttons
    length: 2, // Overrides the length of the reported buttons array
    0: 2, // Remaps buttons[0] to report buttons[2] from the original gamepad object
    1: null // Remaps buttons[1] to a placeholder button (always reports 0/false)
  },
  gripTransform: { // An additional transform to apply to the gripSpace's pose
    position: [0, 0, 0.5], // Additional translation vector to apply
    orientation: [0, 0, 0, 1] // Additional rotation quaternion to apply
  },
  targetRayTransform: { // An additional transform to apply to the targetRaySpace's pose
    position: [0, 0, 0.5], // Additional translation vector to apply
    orientation: [0, 0, 0, 1] // Additional rotation quaternion to apply
  }
}
*/ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
let daydream = {
    mapping: "",
    profiles: [
        "google-daydream",
        "generic-trigger-touchpad"
    ],
    buttons: {
        length: 3,
        0: null,
        1: null,
        2: 0
    }
};
let viveFocus = {
    mapping: "xr-standard",
    profiles: [
        "htc-vive-focus",
        "generic-trigger-touchpad"
    ],
    buttons: {
        length: 3,
        0: 1,
        1: null,
        2: 0
    }
};
let oculusGo = {
    mapping: "xr-standard",
    profiles: [
        "oculus-go",
        "generic-trigger-touchpad"
    ],
    buttons: {
        length: 3,
        0: 1,
        1: null,
        2: 0
    },
    // Grip adjustments determined experimentally.
    gripTransform: {
        orientation: [
            Math.PI * 0.11,
            0,
            0,
            1
        ]
    }
};
// Applies to both left and right Oculus Touch controllers.
let oculusTouch = {
    mapping: "xr-standard",
    displayProfiles: {
        "Oculus Quest": [
            "oculus-touch-v2",
            "oculus-touch",
            "generic-trigger-squeeze-thumbstick"
        ]
    },
    profiles: [
        "oculus-touch",
        "generic-trigger-squeeze-thumbstick"
    ],
    axes: {
        length: 4,
        0: null,
        1: null,
        2: 0,
        3: 1
    },
    buttons: {
        length: 7,
        0: 1,
        1: 2,
        2: null,
        3: 0,
        4: 3,
        5: 4,
        6: null
    },
    // Grip adjustments determined experimentally.
    gripTransform: {
        position: [
            0,
            -0.02,
            0.04,
            1
        ],
        orientation: [
            Math.PI * 0.11,
            0,
            0,
            1
        ]
    }
};
let openVr = {
    mapping: "xr-standard",
    profiles: [
        "htc-vive",
        "generic-trigger-squeeze-touchpad"
    ],
    displayProfiles: {
        "HTC Vive": [
            "htc-vive",
            "generic-trigger-squeeze-touchpad"
        ],
        "HTC Vive DVT": [
            "htc-vive",
            "generic-trigger-squeeze-touchpad"
        ],
        "Valve Index": [
            "valve-index",
            "generic-trigger-squeeze-touchpad-thumbstick"
        ]
    },
    buttons: {
        length: 3,
        0: 1,
        1: 2,
        2: 0
    },
    // Transform adjustments determined experimentally.
    gripTransform: {
        position: [
            0,
            0,
            0.05,
            1
        ]
    },
    targetRayTransform: {
        orientation: [
            Math.PI * -0.08,
            0,
            0,
            1
        ]
    },
    userAgentOverrides: {
        "Firefox": {
            axes: {
                invert: [
                    1,
                    3
                ]
            }
        }
    }
};
let samsungGearVR = {
    mapping: "xr-standard",
    profiles: [
        "samsung-gearvr",
        "generic-trigger-touchpad"
    ],
    buttons: {
        length: 3,
        0: 1,
        1: null,
        2: 0
    },
    gripTransform: {
        orientation: [
            Math.PI * 0.11,
            0,
            0,
            1
        ]
    }
};
let samsungOdyssey = {
    mapping: "xr-standard",
    profiles: [
        "samsung-odyssey",
        "microsoft-mixed-reality",
        "generic-trigger-squeeze-touchpad-thumbstick"
    ],
    buttons: {
        length: 4,
        0: 1,
        1: 0,
        2: 2,
        3: 4
    },
    // Grip adjustments determined experimentally.
    gripTransform: {
        position: [
            0,
            -0.02,
            0.04,
            1
        ],
        orientation: [
            Math.PI * 0.11,
            0,
            0,
            1
        ]
    }
};
let windowsMixedReality = {
    mapping: "xr-standard",
    profiles: [
        "microsoft-mixed-reality",
        "generic-trigger-squeeze-touchpad-thumbstick"
    ],
    buttons: {
        length: 4,
        0: 1,
        1: 0,
        2: 2,
        3: 4
    },
    // Grip adjustments determined experimentally.
    gripTransform: {
        position: [
            0,
            -0.02,
            0.04,
            1
        ],
        orientation: [
            Math.PI * 0.11,
            0,
            0,
            1
        ]
    }
};
let GamepadMappings = {
    "Daydream Controller": daydream,
    "Gear VR Controller": samsungGearVR,
    "HTC Vive Focus Controller": viveFocus,
    "Oculus Go Controller": oculusGo,
    "Oculus Touch (Right)": oculusTouch,
    "Oculus Touch (Left)": oculusTouch,
    "OpenVR Gamepad": openVr,
    "Spatial Controller (Spatial Interaction Source) 045E-065A": windowsMixedReality,
    "Spatial Controller (Spatial Interaction Source) 045E-065D": samsungOdyssey,
    "Windows Mixed Reality (Right)": windowsMixedReality,
    "Windows Mixed Reality (Left)": windowsMixedReality
};
exports.default = GamepadMappings;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eD0bI":[function(require,module,exports) {
/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _now = require("./now");
var _nowDefault = parcelHelpers.interopDefault(_now);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
var _vec3 = require("gl-matrix/src/gl-matrix/vec3");
var _quat = require("gl-matrix/src/gl-matrix/quat");
const HEAD_ELBOW_OFFSET_RIGHTHANDED = _vec3.fromValues(0.155, -0.465, -0.15);
const HEAD_ELBOW_OFFSET_LEFTHANDED = _vec3.fromValues(-0.155, -0.465, -0.15);
const ELBOW_WRIST_OFFSET = _vec3.fromValues(0, 0, -0.25);
const WRIST_CONTROLLER_OFFSET = _vec3.fromValues(0, 0, 0.05);
const ARM_EXTENSION_OFFSET = _vec3.fromValues(-0.08, 0.14, 0.08);
const ELBOW_BEND_RATIO = 0.4; // 40% elbow, 60% wrist.
const EXTENSION_RATIO_WEIGHT = 0.4;
const MIN_ANGULAR_SPEED = 0.61; // 35 degrees per second (in radians).
const MIN_ANGLE_DELTA = 0.175; // 10 degrees (in radians).
const MIN_EXTENSION_COS = 0.12; // cos of 83 degrees.
const MAX_EXTENSION_COS = 0.87; // cos of 30 degrees.
const RAD_TO_DEG = 180 / Math.PI;
function eulerFromQuaternion(out, q, order) {
    function clamp(value, min, max) {
        return value < min ? min : value > max ? max : value;
    }
    // Borrowed from Three.JS :)
    // q is assumed to be normalized
    // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
    var sqx = q[0] * q[0];
    var sqy = q[1] * q[1];
    var sqz = q[2] * q[2];
    var sqw = q[3] * q[3];
    if (order === "XYZ") {
        out[0] = Math.atan2(2 * (q[0] * q[3] - q[1] * q[2]), sqw - sqx - sqy + sqz);
        out[1] = Math.asin(clamp(2 * (q[0] * q[2] + q[1] * q[3]), -1, 1));
        out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), sqw + sqx - sqy - sqz);
    } else if (order === "YXZ") {
        out[0] = Math.asin(clamp(2 * (q[0] * q[3] - q[1] * q[2]), -1, 1));
        out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), sqw - sqx - sqy + sqz);
        out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), sqw - sqx + sqy - sqz);
    } else if (order === "ZXY") {
        out[0] = Math.asin(clamp(2 * (q[0] * q[3] + q[1] * q[2]), -1, 1));
        out[1] = Math.atan2(2 * (q[1] * q[3] - q[2] * q[0]), sqw - sqx - sqy + sqz);
        out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), sqw - sqx + sqy - sqz);
    } else if (order === "ZYX") {
        out[0] = Math.atan2(2 * (q[0] * q[3] + q[2] * q[1]), sqw - sqx - sqy + sqz);
        out[1] = Math.asin(clamp(2 * (q[1] * q[3] - q[0] * q[2]), -1, 1));
        out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), sqw + sqx - sqy - sqz);
    } else if (order === "YZX") {
        out[0] = Math.atan2(2 * (q[0] * q[3] - q[2] * q[1]), sqw - sqx + sqy - sqz);
        out[1] = Math.atan2(2 * (q[1] * q[3] - q[0] * q[2]), sqw + sqx - sqy - sqz);
        out[2] = Math.asin(clamp(2 * (q[0] * q[1] + q[2] * q[3]), -1, 1));
    } else if (order === "XZY") {
        out[0] = Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), sqw - sqx + sqy - sqz);
        out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), sqw + sqx - sqy - sqz);
        out[2] = Math.asin(clamp(2 * (q[2] * q[3] - q[0] * q[1]), -1, 1));
    } else {
        console.log("No order given for quaternion to euler conversion.");
        return;
    }
}
class OrientationArmModel {
    constructor(){
        this.hand = "right";
        this.headElbowOffset = HEAD_ELBOW_OFFSET_RIGHTHANDED;
        // Current and previous controller orientations.
        this.controllerQ = _quat.create();
        this.lastControllerQ = _quat.create();
        // Current and previous head orientations.
        this.headQ = _quat.create();
        // Current head position.
        this.headPos = _vec3.create();
        // Positions of other joints (mostly for debugging).
        this.elbowPos = _vec3.create();
        this.wristPos = _vec3.create();
        // Current and previous times the model was updated.
        this.time = null;
        this.lastTime = null;
        // Root rotation.
        this.rootQ = _quat.create();
        // Current position that this arm model calculates.
        this.position = _vec3.create();
    }
    setHandedness(hand) {
        if (this.hand != hand) {
            this.hand = hand;
            if (this.hand == "left") this.headElbowOffset = HEAD_ELBOW_OFFSET_LEFTHANDED;
            else this.headElbowOffset = HEAD_ELBOW_OFFSET_RIGHTHANDED;
        }
    }
    /**
   * Called on a RAF.
   */ update(controllerOrientation, headPoseMatrix) {
        this.time = (0, _nowDefault.default)();
        // Update the internal copies of the controller and head pose.
        if (controllerOrientation) {
            _quat.copy(this.lastControllerQ, this.controllerQ);
            _quat.copy(this.controllerQ, controllerOrientation);
        }
        if (headPoseMatrix) {
            _mat4.getTranslation(this.headPos, headPoseMatrix);
            _mat4.getRotation(this.headQ, headPoseMatrix);
        }
        // If the controller's angular velocity is above a certain amount, we can
        // assume torso rotation and move the elbow joint relative to the
        // camera orientation.
        let headYawQ = this.getHeadYawOrientation_();
        let angleDelta = this.quatAngle_(this.lastControllerQ, this.controllerQ);
        let timeDelta = (this.time - this.lastTime) / 1000;
        let controllerAngularSpeed = angleDelta / timeDelta;
        if (controllerAngularSpeed > MIN_ANGULAR_SPEED) // Attenuate the Root rotation slightly.
        _quat.slerp(this.rootQ, this.rootQ, headYawQ, Math.min(angleDelta / MIN_ANGLE_DELTA, 1.0));
        else _quat.copy(this.rootQ, headYawQ);
        // We want to move the elbow up and to the center as the user points the
        // controller upwards, so that they can easily see the controller and its
        // tool tips.
        let controllerForward = _vec3.fromValues(0, 0, -1);
        _vec3.transformQuat(controllerForward, controllerForward, this.controllerQ);
        let controllerDotY = _vec3.dot(controllerForward, [
            0,
            1,
            0
        ]);
        let extensionRatio = this.clamp_((controllerDotY - MIN_EXTENSION_COS) / MAX_EXTENSION_COS, 0.0, 1.0);
        // Controller orientation in camera space.
        let controllerCameraQ = _quat.clone(this.rootQ);
        _quat.invert(controllerCameraQ, controllerCameraQ);
        _quat.multiply(controllerCameraQ, controllerCameraQ, this.controllerQ);
        // Calculate elbow position.
        let elbowPos = this.elbowPos;
        _vec3.copy(elbowPos, this.headPos);
        _vec3.add(elbowPos, elbowPos, this.headElbowOffset);
        let elbowOffset = _vec3.clone(ARM_EXTENSION_OFFSET);
        _vec3.scale(elbowOffset, elbowOffset, extensionRatio);
        _vec3.add(elbowPos, elbowPos, elbowOffset);
        // Calculate joint angles. Generally 40% of rotation applied to elbow, 60%
        // to wrist, but if controller is raised higher, more rotation comes from
        // the wrist.
        let totalAngle = this.quatAngle_(controllerCameraQ, _quat.create());
        let totalAngleDeg = totalAngle * RAD_TO_DEG;
        let lerpSuppression = 1 - Math.pow(totalAngleDeg / 180, 4);
        sssss;
        let elbowRatio = ELBOW_BEND_RATIO;
        let wristRatio = 1 - ELBOW_BEND_RATIO;
        let lerpValue = lerpSuppression * (elbowRatio + wristRatio * extensionRatio * EXTENSION_RATIO_WEIGHT);
        let wristQ = _quat.create();
        _quat.slerp(wristQ, wristQ, controllerCameraQ, lerpValue);
        let invWristQ = _quat.invert(_quat.create(), wristQ);
        let elbowQ = _quat.clone(controllerCameraQ);
        _quat.multiply(elbowQ, elbowQ, invWristQ);
        // Calculate our final controller position based on all our joint rotations
        // and lengths.
        /*
    position_ =
      root_rot_ * (
        controller_root_offset_ +
2:      (arm_extension_ * amt_extension) +
1:      elbow_rot * (kControllerForearm + (wrist_rot * kControllerPosition))
      );
    */ let wristPos = this.wristPos;
        _vec3.copy(wristPos, WRIST_CONTROLLER_OFFSET);
        _vec3.transformQuat(wristPos, wristPos, wristQ);
        _vec3.add(wristPos, wristPos, ELBOW_WRIST_OFFSET);
        _vec3.transformQuat(wristPos, wristPos, elbowQ);
        _vec3.add(wristPos, wristPos, elbowPos);
        let offset = _vec3.clone(ARM_EXTENSION_OFFSET);
        _vec3.scale(offset, offset, extensionRatio);
        // Set the resulting pose orientation and position.
        _vec3.add(this.position, this.wristPos, offset);
        _vec3.transformQuat(this.position, this.position, this.rootQ);
        this.lastTime = this.time;
    }
    /**
   * Returns the position calculated by the model.
   */ getPosition() {
        return this.position;
    }
    getHeadYawOrientation_() {
        let headEuler = _vec3.create();
        eulerFromQuaternion(headEuler, this.headQ, "YXZ");
        let destinationQ = _quat.fromEuler(_quat.create(), 0, headEuler[1] * RAD_TO_DEG, 0);
        return destinationQ;
    }
    clamp_(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    quatAngle_(q1, q2) {
        let vec1 = [
            0,
            0,
            -1
        ];
        let vec2 = [
            0,
            0,
            -1
        ];
        _vec3.transformQuat(vec1, vec1, q1);
        _vec3.transformQuat(vec2, vec2, q2);
        return _vec3.angle(vec1, vec2);
    }
}
exports.default = OrientationArmModel;

},{"./now":"fgoNd","gl-matrix/src/gl-matrix/mat4":"6Zon6","gl-matrix/src/gl-matrix/vec3":"k7jpC","gl-matrix/src/gl-matrix/quat":"kJ4kK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"g8mvS":[function(require,module,exports) {
/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _mat4 = require("gl-matrix/src/gl-matrix/mat4");
var _xrdevice = require("./XRDevice");
var _xrdeviceDefault = parcelHelpers.interopDefault(_xrdevice);
var global = arguments[3];
const TEST_ENV = false;
/**
 * A Session helper class to mirror an XRSession and correlate
 * between an XRSession, and tracking sessions in a XRDevice.
 * Mostly referenced via `session.id` due to needing to verify
 * session creation is possible on the XRDevice before
 * the XRSession can be created.
 */ let SESSION_ID = 0;
class Session {
    constructor(mode, enabledFeatures){
        this.mode = mode;
        this.enabledFeatures = enabledFeatures;
        this.ended = null;
        this.baseLayer = null;
        this.id = ++SESSION_ID;
    }
}
class InlineDevice extends (0, _xrdeviceDefault.default) {
    /**
   * Constructs an inline-only XRDevice
   */ constructor(global1){
        super(global);
        this.sessions = new Map();
        this.projectionMatrix = _mat4.create();
        this.identityMatrix = _mat4.create();
    }
    /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */ onBaseLayerSet(sessionId, layer) {
        const session = this.sessions.get(sessionId);
        session.baseLayer = layer;
    }
    /**
   * Returns true if the requested mode is inline
   *
   * @param {XRSessionMode} mode
   * @return {boolean}
   */ isSessionSupported(mode) {
        return mode == "inline";
    }
    /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */ isFeatureSupported(featureDescriptor) {
        switch(featureDescriptor){
            // Only viewer reference spaces are supported
            case "viewer":
                return true;
            default:
                return false;
        }
    }
    /**
   * Returns a promise of a session ID if creating a session is successful.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */ async requestSession(mode, enabledFeatures) {
        if (!this.isSessionSupported(mode)) return Promise.reject();
        const session = new Session(mode, enabledFeatures);
        this.sessions.set(session.id, session);
        return Promise.resolve(session.id);
    }
    /**
   * @return {Function}
   */ requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback);
    }
    /**
   * @param {number} handle
   */ cancelAnimationFrame(handle) {
        window.cancelAnimationFrame(handle);
    }
    onFrameStart(sessionId, renderState) {
        // @TODO Our test environment doesn't have the canvas package for now,
        // but this could be something we add to the tests.
        if (TEST_ENV) return;
        const session = this.sessions.get(sessionId);
        // If the session is inline make sure the projection matrix matches the 
        // aspect ratio of the underlying WebGL canvas.
        if (session.baseLayer) {
            const canvas = session.baseLayer.context.canvas;
            // Update the projection matrix.
            _mat4.perspective(this.projectionMatrix, renderState.inlineVerticalFieldOfView, canvas.width / canvas.height, renderState.depthNear, renderState.depthFar);
        }
    }
    onFrameEnd(sessionId) {
    // Nothing to do here because inline always renders to the canvas backbuffer
    // directly.
    }
    /**
   * @TODO Spec
   */ async endSession(sessionId) {
        const session = this.sessions.get(sessionId);
        session.ended = true;
    }
    /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */ doesSessionSupportReferenceSpace(sessionId, type) {
        const session = this.sessions.get(sessionId);
        if (session.ended) return false;
        return session.enabledFeatures.has(type);
    }
    /**
   * Inline sessions don't have stage bounds
   *
   * @return {Object?}
   */ requestStageBounds() {
        return null;
    }
    /**
   * Inline sessions don't have multiple frames of reference
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<Float32Array>}
   */ async requestFrameOfReferenceTransform(type, options) {
        return null;
    }
    /**
   * @param {XREye} eye
   * @return {Float32Array}
   */ getProjectionMatrix(eye) {
        return this.projectionMatrix;
    }
    /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */ getViewport(sessionId, eye, layer, target) {
        // @TODO can we have another layer passed in that
        // wasn't the same one as the `baseLayer`?
        const session = this.sessions.get(sessionId);
        const { width, height } = layer.context.canvas;
        // Inline sessions return the whole canvas as the viewport
        target.x = target.y = 0;
        target.width = width;
        target.height = height;
        return true;
    }
    /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */ getBasePoseMatrix() {
        return this.identityMatrix;
    }
    /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */ getBaseViewMatrix(eye) {
        return this.identityMatrix;
    }
    /**
   * No persistent input sources for the inline session
   */ getInputSources() {
        return [];
    }
    getInputPose(inputSource, coordinateSystem, poseType) {
        return null;
    }
    /**
   * Triggered on window resize.
   */ onWindowResize() {}
}
exports.default = InlineDevice;

},{"gl-matrix/src/gl-matrix/mat4":"6Zon6","./XRDevice":"3tJs9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5FvDr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CacheMessage", ()=>CacheMessage);
parcelHelpers.export(exports, "CheckMessage", ()=>CheckMessage);
parcelHelpers.export(exports, "Client", ()=>Client);
parcelHelpers.export(exports, "DeleteMessage", ()=>DeleteMessage);
parcelHelpers.export(exports, "InfoMessage", ()=>InfoMessage);
parcelHelpers.export(exports, "InitMessage", ()=>InitMessage);
parcelHelpers.export(exports, "Message", ()=>Message);
parcelHelpers.export(exports, "Shader", ()=>Shader);
parcelHelpers.export(exports, "ShaderMessage", ()=>ShaderMessage);
parcelHelpers.export(exports, "ShowCachedMessage", ()=>ShowCachedMessage);
parcelHelpers.export(exports, "ShowMessage", ()=>ShowMessage);
parcelHelpers.export(exports, "UniformsMessage", ()=>UniformsMessage);
parcelHelpers.export(exports, "WipeMessage", ()=>WipeMessage);
var global = arguments[3];
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, module) {
    return module = {
        exports: {}
    }, fn(module, module.exports), module.exports;
}
var cbor = createCommonjsModule(function(module) {
    /*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Patrick Gansterer <paroga@paroga.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */ (function(global, undefined$1) {
        var POW_2_24 = Math.pow(2, -24), POW_2_32 = Math.pow(2, 32), POW_2_53 = Math.pow(2, 53);
        function encode(value) {
            var data = new ArrayBuffer(256);
            var dataView = new DataView(data);
            var lastLength;
            var offset = 0;
            function ensureSpace(length) {
                var newByteLength = data.byteLength;
                var requiredLength = offset + length;
                while(newByteLength < requiredLength)newByteLength *= 2;
                if (newByteLength !== data.byteLength) {
                    var oldDataView = dataView;
                    data = new ArrayBuffer(newByteLength);
                    dataView = new DataView(data);
                    var uint32count = offset + 3 >> 2;
                    for(var i = 0; i < uint32count; ++i)dataView.setUint32(i * 4, oldDataView.getUint32(i * 4));
                }
                lastLength = length;
                return dataView;
            }
            function write() {
                offset += lastLength;
            }
            function writeFloat64(value) {
                write(ensureSpace(8).setFloat64(offset, value));
            }
            function writeUint8(value) {
                write(ensureSpace(1).setUint8(offset, value));
            }
            function writeUint8Array(value) {
                var dataView = ensureSpace(value.length);
                for(var i = 0; i < value.length; ++i)dataView.setUint8(offset + i, value[i]);
                write();
            }
            function writeUint16(value) {
                write(ensureSpace(2).setUint16(offset, value));
            }
            function writeUint32(value) {
                write(ensureSpace(4).setUint32(offset, value));
            }
            function writeUint64(value) {
                var low = value % POW_2_32;
                var high = (value - low) / POW_2_32;
                var dataView = ensureSpace(8);
                dataView.setUint32(offset, high);
                dataView.setUint32(offset + 4, low);
                write();
            }
            function writeTypeAndLength(type, length) {
                if (length < 24) writeUint8(type << 5 | length);
                else if (length < 0x100) {
                    writeUint8(type << 5 | 24);
                    writeUint8(length);
                } else if (length < 0x10000) {
                    writeUint8(type << 5 | 25);
                    writeUint16(length);
                } else if (length < 0x100000000) {
                    writeUint8(type << 5 | 26);
                    writeUint32(length);
                } else {
                    writeUint8(type << 5 | 27);
                    writeUint64(length);
                }
            }
            function encodeItem(value) {
                var i;
                if (value === false) return writeUint8(0xf4);
                if (value === true) return writeUint8(0xf5);
                if (value === null) return writeUint8(0xf6);
                if (value === undefined$1) return writeUint8(0xf7);
                switch(typeof value){
                    case "number":
                        if (Math.floor(value) === value) {
                            if (0 <= value && value <= POW_2_53) return writeTypeAndLength(0, value);
                            if (-POW_2_53 <= value && value < 0) return writeTypeAndLength(1, -(value + 1));
                        }
                        writeUint8(0xfb);
                        return writeFloat64(value);
                    case "string":
                        var utf8data = [];
                        for(i = 0; i < value.length; ++i){
                            var charCode = value.charCodeAt(i);
                            if (charCode < 0x80) utf8data.push(charCode);
                            else if (charCode < 0x800) {
                                utf8data.push(0xc0 | charCode >> 6);
                                utf8data.push(0x80 | charCode & 0x3f);
                            } else if (charCode < 0xd800) {
                                utf8data.push(0xe0 | charCode >> 12);
                                utf8data.push(0x80 | charCode >> 6 & 0x3f);
                                utf8data.push(0x80 | charCode & 0x3f);
                            } else {
                                charCode = (charCode & 0x3ff) << 10;
                                charCode |= value.charCodeAt(++i) & 0x3ff;
                                charCode += 0x10000;
                                utf8data.push(0xf0 | charCode >> 18);
                                utf8data.push(0x80 | charCode >> 12 & 0x3f);
                                utf8data.push(0x80 | charCode >> 6 & 0x3f);
                                utf8data.push(0x80 | charCode & 0x3f);
                            }
                        }
                        writeTypeAndLength(3, utf8data.length);
                        return writeUint8Array(utf8data);
                    default:
                        var length;
                        if (Array.isArray(value)) {
                            length = value.length;
                            writeTypeAndLength(4, length);
                            for(i = 0; i < length; ++i)encodeItem(value[i]);
                        } else if (value instanceof Uint8Array) {
                            writeTypeAndLength(2, value.length);
                            writeUint8Array(value);
                        } else {
                            var keys = Object.keys(value);
                            length = keys.length;
                            writeTypeAndLength(5, length);
                            for(i = 0; i < length; ++i){
                                var key = keys[i];
                                encodeItem(key);
                                encodeItem(value[key]);
                            }
                        }
                }
            }
            encodeItem(value);
            if ("slice" in data) return data.slice(0, offset);
            var ret = new ArrayBuffer(offset);
            var retView = new DataView(ret);
            for(var i = 0; i < offset; ++i)retView.setUint8(i, dataView.getUint8(i));
            return ret;
        }
        function decode(data, tagger, simpleValue) {
            var dataView = new DataView(data);
            var offset = 0;
            if (typeof tagger !== "function") tagger = function(value) {
                return value;
            };
            if (typeof simpleValue !== "function") simpleValue = function() {
                return undefined$1;
            };
            function read(value, length) {
                offset += length;
                return value;
            }
            function readArrayBuffer(length) {
                return read(new Uint8Array(data, offset, length), length);
            }
            function readFloat16() {
                var tempArrayBuffer = new ArrayBuffer(4);
                var tempDataView = new DataView(tempArrayBuffer);
                var value = readUint16();
                var sign = value & 0x8000;
                var exponent = value & 0x7c00;
                var fraction = value & 0x03ff;
                if (exponent === 0x7c00) exponent = 261120;
                else if (exponent !== 0) exponent += 114688;
                else if (fraction !== 0) return fraction * POW_2_24;
                tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
                return tempDataView.getFloat32(0);
            }
            function readFloat32() {
                return read(dataView.getFloat32(offset), 4);
            }
            function readFloat64() {
                return read(dataView.getFloat64(offset), 8);
            }
            function readUint8() {
                return read(dataView.getUint8(offset), 1);
            }
            function readUint16() {
                return read(dataView.getUint16(offset), 2);
            }
            function readUint32() {
                return read(dataView.getUint32(offset), 4);
            }
            function readUint64() {
                return readUint32() * POW_2_32 + readUint32();
            }
            function readBreak() {
                if (dataView.getUint8(offset) !== 0xff) return false;
                offset += 1;
                return true;
            }
            function readLength(additionalInformation) {
                if (additionalInformation < 24) return additionalInformation;
                if (additionalInformation === 24) return readUint8();
                if (additionalInformation === 25) return readUint16();
                if (additionalInformation === 26) return readUint32();
                if (additionalInformation === 27) return readUint64();
                if (additionalInformation === 31) return -1;
                throw "Invalid length encoding";
            }
            function readIndefiniteStringLength(majorType) {
                var initialByte = readUint8();
                if (initialByte === 0xff) return -1;
                var length = readLength(initialByte & 0x1f);
                if (length < 0 || initialByte >> 5 !== majorType) throw "Invalid indefinite length element";
                return length;
            }
            function appendUtf16data(utf16data, length) {
                for(var i = 0; i < length; ++i){
                    var value = readUint8();
                    if (value & 0x80) {
                        if (value < 0xe0) {
                            value = (value & 0x1f) << 6 | readUint8() & 0x3f;
                            length -= 1;
                        } else if (value < 0xf0) {
                            value = (value & 0x0f) << 12 | (readUint8() & 0x3f) << 6 | readUint8() & 0x3f;
                            length -= 2;
                        } else {
                            value = (value & 0x0f) << 18 | (readUint8() & 0x3f) << 12 | (readUint8() & 0x3f) << 6 | readUint8() & 0x3f;
                            length -= 3;
                        }
                    }
                    if (value < 0x10000) utf16data.push(value);
                    else {
                        value -= 0x10000;
                        utf16data.push(0xd800 | value >> 10);
                        utf16data.push(0xdc00 | value & 0x3ff);
                    }
                }
            }
            function decodeItem() {
                var initialByte = readUint8();
                var majorType = initialByte >> 5;
                var additionalInformation = initialByte & 0x1f;
                var i;
                var length;
                if (majorType === 7) switch(additionalInformation){
                    case 25:
                        return readFloat16();
                    case 26:
                        return readFloat32();
                    case 27:
                        return readFloat64();
                }
                length = readLength(additionalInformation);
                if (length < 0 && (majorType < 2 || 6 < majorType)) throw "Invalid length";
                switch(majorType){
                    case 0:
                        return length;
                    case 1:
                        return -1 - length;
                    case 2:
                        if (length < 0) {
                            var elements = [];
                            var fullArrayLength = 0;
                            while((length = readIndefiniteStringLength(majorType)) >= 0){
                                fullArrayLength += length;
                                elements.push(readArrayBuffer(length));
                            }
                            var fullArray = new Uint8Array(fullArrayLength);
                            var fullArrayOffset = 0;
                            for(i = 0; i < elements.length; ++i){
                                fullArray.set(elements[i], fullArrayOffset);
                                fullArrayOffset += elements[i].length;
                            }
                            return fullArray;
                        }
                        return readArrayBuffer(length);
                    case 3:
                        var utf16data = [];
                        if (length < 0) while((length = readIndefiniteStringLength(majorType)) >= 0)appendUtf16data(utf16data, length);
                        else appendUtf16data(utf16data, length);
                        return String.fromCharCode.apply(null, utf16data);
                    case 4:
                        var retArray;
                        if (length < 0) {
                            retArray = [];
                            while(!readBreak())retArray.push(decodeItem());
                        } else {
                            retArray = new Array(length);
                            for(i = 0; i < length; ++i)retArray[i] = decodeItem();
                        }
                        return retArray;
                    case 5:
                        var retObject = {};
                        for(i = 0; i < length || length < 0 && !readBreak(); ++i){
                            var key = decodeItem();
                            retObject[key] = decodeItem();
                        }
                        return retObject;
                    case 6:
                        return tagger(decodeItem(), length);
                    case 7:
                        switch(length){
                            case 20:
                                return false;
                            case 21:
                                return true;
                            case 22:
                                return null;
                            case 23:
                                return undefined$1;
                            default:
                                return simpleValue(length);
                        }
                }
            }
            var ret = decodeItem();
            if (offset !== data.byteLength) throw "Remaining bytes";
            return ret;
        }
        var obj = {
            encode: encode,
            decode: decode
        };
        if (typeof undefined$1 === "function" && undefined$1.amd) undefined$1("cbor/cbor", obj);
        else if (module.exports) module.exports = obj;
        else if (!global.CBOR) global.CBOR = obj;
    })(commonjsGlobal);
});
/**
 * This files defines the HoloPlayClient class and Message class.
 *
 * Copyright (c) [2019] [Looking Glass Factory]
 *
 * @link    https://lookingglassfactory.com/
 * @file    This files defines the HoloPlayClient class and Message class.
 * @author  Looking Glass Factory.
 * @version 0.0.8
 * @license SEE LICENSE IN LICENSE.md
 */ // Polyfill WebSocket for nodejs applications.
const WebSocket = typeof window === "undefined" ? require("12543840d8cbc90f") : window.WebSocket;
/** Class representing a client to communicates with the HoloPlayService. */ class Client {
    /**
   * Establish a client to talk to HoloPlayService.
   * @constructor
   * @param {function} initCallback - optional; a function to trigger when
   *     response is received
   * @param {function} errCallback - optional; a function to trigger when there
   *     is a connection error
   * @param {function} closeCallback - optional; a function to trigger when the
   *     socket is closed
   * @param {boolean} debug - optional; default is false
   * @param {string}  appId - optional
   * @param {boolean} isGreedy - optional
   * @param {string}  oncloseBehavior - optional, can be 'wipe', 'hide', 'none'
   */ constructor(initCallback, errCallback, closeCallback, debug = false, appId, isGreedy, oncloseBehavior){
        this.reqs = [];
        this.reps = [];
        this.requestId = this.getRequestId();
        this.debug = debug;
        this.isGreedy = isGreedy;
        this.errCallback = errCallback;
        this.closeCallback = closeCallback;
        this.alwaysdebug = false;
        this.isConnected = false;
        let initCmd = null;
        if (appId || isGreedy || oncloseBehavior) initCmd = new InitMessage(appId, isGreedy, oncloseBehavior, this.debug);
        else {
            if (debug) this.alwaysdebug = true;
            if (typeof initCallback == "function") initCmd = new InfoMessage();
        }
        this.openWebsocket(initCmd, initCallback);
    }
    /**
   * Send a message over the websocket to HoloPlayService.
   * @public
   * @param {Message} msg - message object
   * @param {integer} timeoutSecs - optional, default is 60 seconds
   */ sendMessage(msg, timeoutSecs = 60) {
        if (this.alwaysdebug) msg.cmd.debug = true;
        let cborData = msg.toCbor();
        return this.sendRequestObj(cborData, timeoutSecs);
    }
    /**
   * Disconnects from the web socket.
   * @public
   */ disconnect() {
        this.ws.close();
    }
    /**
   * Open a websocket and set handlers
   * @private
   */ openWebsocket(firstCmd = null, initCallback = null) {
        this.ws = new WebSocket("ws://localhost:11222/driver", [
            "rep.sp.nanomsg.org"
        ]);
        this.ws.parent = this;
        this.ws.binaryType = "arraybuffer";
        this.ws.onmessage = this.messageHandler;
        this.ws.onopen = ()=>{
            this.isConnected = true;
            if (this.debug) console.log("socket open");
            if (firstCmd != null) this.sendMessage(firstCmd).then(initCallback);
        };
        this.ws.onerror = this.onSocketError;
        this.ws.onclose = this.onClose;
    }
    /**
   * Send a request object over websocket
   * @private
   */ sendRequestObj(data, timeoutSecs) {
        return new Promise((resolve, reject)=>{
            let reqObj = {
                id: this.requestId++,
                parent: this,
                payload: data,
                success: resolve,
                error: reject,
                send: function() {
                    if (this.debug) console.log("attemtping to send request with ID " + this.id);
                    this.timeout = setTimeout(reqObj.send.bind(this), timeoutSecs * 1000);
                    let tmp = new Uint8Array(data.byteLength + 4);
                    let view = new DataView(tmp.buffer);
                    view.setUint32(0, this.id);
                    tmp.set(new Uint8Array(this.payload), 4);
                    this.parent.ws.send(tmp.buffer);
                }
            };
            this.reqs.push(reqObj);
            reqObj.send();
        });
    }
    /**
   * Handles a message when received
   * @private
   */ messageHandler(event) {
        console.log("message");
        let data = event.data;
        if (data.byteLength < 4) return;
        let view = new DataView(data);
        let replyId = view.getUint32(0);
        if (replyId < 0x80000000) {
            this.parent.err("bad nng header");
            return;
        }
        let i = this.parent.findReqIndex(replyId);
        if (i == -1) {
            this.parent.err("got reply that doesn't match known request!");
            return;
        }
        let rep = {
            id: replyId,
            payload: cbor.decode(data.slice(4))
        };
        if (rep.payload.error == 0) this.parent.reqs[i].success(rep.payload);
        else this.parent.reqs[i].error(rep.payload);
        clearTimeout(this.parent.reqs[i].timeout);
        this.parent.reqs.splice(i, 1);
        this.parent.reps.push(rep);
        if (this.debug) console.log(rep.payload);
    }
    getRequestId() {
        return Math.floor(this.prng() * 0x7fffffff) + 0x80000000;
    }
    onClose(event) {
        this.parent.isConnected = false;
        if (this.parent.debug) console.log("socket closed");
        if (typeof this.parent.closeCallback == "function") this.parent.closeCallback(event);
    }
    onSocketError(error) {
        if (this.parent.debug) console.log(error);
        if (typeof this.parent.errCallback == "function") this.parent.errCallback(error);
    }
    err(errorMsg) {
        if (this.debug) console.log("[DRIVER ERROR]" + errorMsg);
    // TODO : make this return an event obj rather than a string
    // if (typeof this.errCallback == 'function')
    //   this.errCallback(errorMsg);
    }
    findReqIndex(replyId) {
        let i = 0;
        for(; i < this.reqs.length; i++){
            if (this.reqs[i].id == replyId) return i;
        }
        return -1;
    }
    prng() {
        if (this.rng == undefined) this.rng = generateRng();
        return this.rng();
    }
}
/** A class to represent messages being sent over to HoloPlay Service */ class Message {
    /**
   * Construct a barebone message.
   * @constructor
   */ constructor(cmd, bin){
        this.cmd = cmd;
        this.bin = bin;
    }
    /**
   * Convert the class instance to the CBOR format
   * @public
   * @returns {CBOR} - cbor object of the message
   */ toCbor() {
        return cbor.encode(this);
    }
}
/** Message to init. Extends the base Message class. */ class InitMessage extends Message {
    /**
   * @constructor
   * @param {string}  appId - a unique id for app
   * @param {boolean} isGreedy - will it take over screen
   * @param {string}  oncloseBehavior - can be 'wipe', 'hide', 'none'
   */ constructor(appId = "", isGreedy = false, onclose = "", debug = false){
        let cmd = {
            "init": {}
        };
        if (appId != "") cmd["init"].appid = appId;
        if (onclose != "") cmd["init"].onclose = onclose;
        if (isGreedy) cmd["init"].greedy = true;
        if (debug) cmd["init"].debug = true;
        super(cmd, null);
    }
}
/** Delete a quilt from HoloPlayService. Extends the base Message class. */ class DeleteMessage extends Message {
    /**
   * @constructor
   * @param {string} name - name of the quilt
   */ constructor(name = ""){
        let cmd = {
            "delete": {
                "name": name
            }
        };
        super(cmd, null);
    }
}
/** Check if a quilt exist in cache. Extends the base Message class. */ class CheckMessage extends Message {
    /**
   * @constructor
   * @param {string} name - name of the quilt
   */ constructor(name = ""){
        let cmd = {
            "check": {
                "name": name
            }
        };
        super(cmd, null);
    }
}
/** Wipes the image in Looking Glass and displays the background image */ class WipeMessage extends Message {
    /**
   * @constructor
   * @param {number} targetDisplay - optional, if not provided, default is 0
   */ constructor(targetDisplay = null){
        let cmd = {
            "wipe": {}
        };
        if (targetDisplay != null) cmd["wipe"].targetDisplay = targetDisplay;
        super(cmd, null);
    }
}
/** Get info from the HoloPlayService */ class InfoMessage extends Message {
    /**
   * @constructor
   */ constructor(){
        let cmd = {
            "info": {}
        };
        super(cmd, null);
    }
}
/** Get shader uniforms from HoloPlayService */ class UniformsMessage extends Message {
    /**
   * @constructor
   * @param {object}
   */ constructor(){
        let cmd = {
            "uniforms": {}
        };
        super(cmd, bindata);
    }
}
/** Get GLSL shader code from HoloPlayService */ class ShaderMessage extends Message {
    /**
   * @constructor
   * @param {object}
   */ constructor(){
        let cmd = {
            "shader": {}
        };
        super(cmd, bindata);
    }
}
/** Show a quilt in the Looking Glass with the binary data of quilt provided */ class ShowMessage extends Message {
    /**
   * @constructor
   * @param {object}
   */ constructor(settings = {
        vx: 5,
        vy: 9,
        aspect: 1.6
    }, bindata1 = "", targetDisplay = null){
        let cmd = {
            "show": {
                "source": "bindata",
                "quilt": {
                    "type": "image",
                    "settings": settings
                }
            }
        };
        if (targetDisplay != null) cmd["show"]["targetDisplay"] = targetDisplay;
        super(cmd, bindata1);
    }
}
/** extends the base Message class */ class CacheMessage extends Message {
    constructor(name, settings = {
        vx: 5,
        vy: 9,
        aspect: 1.6
    }, bindata1 = "", show = false){
        let cmd = {
            "cache": {
                "show": show,
                "quilt": {
                    "name": name,
                    "type": "image",
                    "settings": settings
                }
            }
        };
        super(cmd, bindata1);
    }
}
class ShowCachedMessage extends Message {
    constructor(name, targetDisplay = null, settings = null){
        let cmd = {
            "show": {
                "source": "cache",
                "quilt": {
                    "name": name
                }
            }
        };
        if (targetDisplay != null) cmd["show"]["targetDisplay"] = targetDisplay;
        if (settings != null) cmd["show"]["quilt"].settings = settings;
        super(cmd, null);
    }
}
/* helper function */ function generateRng() {
    function xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)h = Math.imul(h ^ str.charCodeAt(i), 3432918353), h = h << 13 | h >>> 19;
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        };
    }
    function xoshiro128ss(a, b, c, d) {
        return ()=>{
            var t = b << 9, r = a * 5;
            r = (r << 7 | r >>> 25) * 9;
            c ^= a;
            d ^= b;
            b ^= c;
            a ^= d;
            c ^= t;
            d = d << 11 | d >>> 21;
            return (r >>> 0) / 4294967296;
        };
    }
    var state = Date.now();
    var seed = xmur3(state.toString());
    return xoshiro128ss(seed(), seed(), seed(), seed());
}
//turn the shader into valid glsl
function glslifyNumbers(strings, ...values) {
    let s = strings[0];
    for(let i = 1; i < strings.length; ++i){
        const v = values[i - 1];
        s += typeof v === "number" ? v.toPrecision(10) : v;
        s += strings[i];
    }
    return s;
}
// export the shader for use in WebXR // cfg is defined in @lookingglass/webxr
function Shader(cfg) {
    return glslifyNumbers`
  precision mediump float;
  uniform int u_viewType;
  uniform sampler2D u_texture;
  varying vec2 v_texcoord;
  const float pitch    = ${cfg.pitch};
  const float tilt     = ${cfg.tilt};
  const float center   = ${cfg.calibration.center.value};
  const float invView  = ${cfg.calibration.invView.value};
  const float flipX    = ${cfg.calibration.flipImageX.value};
  const float flipY    = ${cfg.calibration.flipImageY.value};
  const float subp     = ${cfg.subp};
  const float numViews = ${cfg.numViews};
  const float tilesX   = ${cfg.quiltWidth};
  const float tilesY   = ${cfg.quiltHeight};
  const vec2 quiltViewPortion = vec2(
    ${cfg.quiltWidth * cfg.tileWidth / cfg.framebufferWidth},
    ${cfg.quiltHeight * cfg.tileHeight / cfg.framebufferHeight});
  vec2 texArr(vec3 uvz) {
    float z = floor(uvz.z * numViews);
    float x = (mod(z, tilesX) + uvz.x) / tilesX;
    float y = (floor(z / tilesX) + uvz.y) / tilesY;
    return vec2(x, y) * quiltViewPortion;
  }
  float remap(float value, float from1, float to1, float from2, float to2) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
  }
  void main() {
    if (u_viewType == 2) { // "quilt" view
      gl_FragColor = texture2D(u_texture, v_texcoord);
      return;
    }
    if (u_viewType == 1) { // middle view
      gl_FragColor = texture2D(u_texture, texArr(vec3(v_texcoord.x, v_texcoord.y, 0.5)));
      return;
    }
    vec4 rgb[3];
    vec3 nuv = vec3(v_texcoord.xy, 0.0);
    // Flip UVs if necessary
    nuv.x = (1.0 - flipX) * nuv.x + flipX * (1.0 - nuv.x);
    nuv.y = (1.0 - flipY) * nuv.y + flipY * (1.0 - nuv.y);
    for (int i = 0; i < 3; i++) {
      nuv.z = (v_texcoord.x + float(i) * subp + v_texcoord.y * tilt) * pitch - center;
      nuv.z = mod(nuv.z + ceil(abs(nuv.z)), 1.0);
      nuv.z = (1.0 - invView) * nuv.z + invView * (1.0 - nuv.z);
      rgb[i] = texture2D(u_texture, texArr(vec3(v_texcoord.x, v_texcoord.y, nuv.z)));
    }
    gl_FragColor = vec4(rgb[0].r, rgb[1].g, rgb[2].b, 1);
  }
`;
}

},{"12543840d8cbc90f":"4OuWD","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4OuWD":[function(require,module,exports) {
"use strict";
module.exports = function() {
    throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
};

},{}],"9Lecs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "glMatrix", ()=>_commonJs);
parcelHelpers.export(exports, "mat2", ()=>_mat2Js);
parcelHelpers.export(exports, "mat2d", ()=>_mat2DJs);
parcelHelpers.export(exports, "mat3", ()=>_mat3Js);
parcelHelpers.export(exports, "mat4", ()=>_mat4Js);
parcelHelpers.export(exports, "quat", ()=>_quatJs);
parcelHelpers.export(exports, "quat2", ()=>_quat2Js);
parcelHelpers.export(exports, "vec2", ()=>_vec2Js);
parcelHelpers.export(exports, "vec3", ()=>_vec3Js);
parcelHelpers.export(exports, "vec4", ()=>_vec4Js);
var _commonJs = require("./gl-matrix/common.js");
var _mat2Js = require("./gl-matrix/mat2.js");
var _mat2DJs = require("./gl-matrix/mat2d.js");
var _mat3Js = require("./gl-matrix/mat3.js");
var _mat4Js = require("./gl-matrix/mat4.js");
var _quatJs = require("./gl-matrix/quat.js");
var _quat2Js = require("./gl-matrix/quat2.js");
var _vec2Js = require("./gl-matrix/vec2.js");
var _vec3Js = require("./gl-matrix/vec3.js");
var _vec4Js = require("./gl-matrix/vec4.js");

},{"./gl-matrix/common.js":false,"./gl-matrix/mat2.js":false,"./gl-matrix/mat2d.js":false,"./gl-matrix/mat3.js":false,"./gl-matrix/mat4.js":"7dnOq","./gl-matrix/quat.js":false,"./gl-matrix/quat2.js":false,"./gl-matrix/vec2.js":false,"./gl-matrix/vec3.js":false,"./gl-matrix/vec4.js":false,"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"j0kng":[function(require,module,exports) {
/**
 * Common utilities
 * @module glMatrix
 */ // Configuration Constants
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "EPSILON", ()=>EPSILON);
parcelHelpers.export(exports, "ARRAY_TYPE", ()=>ARRAY_TYPE);
parcelHelpers.export(exports, "RANDOM", ()=>RANDOM);
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */ parcelHelpers.export(exports, "setMatrixArrayType", ()=>setMatrixArrayType);
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */ parcelHelpers.export(exports, "toRadian", ()=>toRadian);
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
function setMatrixArrayType(type) {
    ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
function toRadian(a) {
    return a * degree;
}
function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7dnOq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */ /**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */ parcelHelpers.export(exports, "create", ()=>create);
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */ parcelHelpers.export(exports, "clone", ()=>clone);
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "copy", ()=>copy);
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */ parcelHelpers.export(exports, "fromValues", ()=>fromValues);
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "set", ()=>set);
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "identity", ()=>identity);
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "transpose", ()=>transpose);
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "invert", ()=>invert);
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "adjoint", ()=>adjoint);
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */ parcelHelpers.export(exports, "determinant", ()=>determinant);
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiply", ()=>multiply);
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "translate", ()=>translate);
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/ parcelHelpers.export(exports, "scale", ()=>scale);
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotate", ()=>rotate);
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateX", ()=>rotateX);
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateY", ()=>rotateY);
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "rotateZ", ()=>rotateZ);
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromTranslation", ()=>fromTranslation);
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromScaling", ()=>fromScaling);
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotation", ()=>fromRotation);
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromXRotation", ()=>fromXRotation);
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromYRotation", ()=>fromYRotation);
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromZRotation", ()=>fromZRotation);
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslation", ()=>fromRotationTranslation);
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {quat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */ parcelHelpers.export(exports, "fromQuat2", ()=>fromQuat2);
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */ parcelHelpers.export(exports, "getTranslation", ()=>getTranslation);
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */ parcelHelpers.export(exports, "getScaling", ()=>getScaling);
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */ parcelHelpers.export(exports, "getRotation", ()=>getRotation);
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslationScale", ()=>fromRotationTranslationScale);
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromRotationTranslationScaleOrigin", ()=>fromRotationTranslationScaleOrigin);
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "fromQuat", ()=>fromQuat);
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "frustum", ()=>frustum);
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "perspective", ()=>perspective);
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "perspectiveFromFieldOfView", ()=>perspectiveFromFieldOfView);
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "ortho", ()=>ortho);
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "lookAt", ()=>lookAt);
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "targetTo", ()=>targetTo);
/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */ parcelHelpers.export(exports, "str", ()=>str);
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */ parcelHelpers.export(exports, "frob", ()=>frob);
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "add", ()=>add);
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "subtract", ()=>subtract);
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiplyScalar", ()=>multiplyScalar);
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */ parcelHelpers.export(exports, "multiplyScalarAndAdd", ()=>multiplyScalarAndAdd);
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "exactEquals", ()=>exactEquals);
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */ parcelHelpers.export(exports, "equals", ()=>equals);
parcelHelpers.export(exports, "mul", ()=>mul);
parcelHelpers.export(exports, "sub", ()=>sub);
var _commonJs = require("./common.js");
function create() {
    var out = new _commonJs.ARRAY_TYPE(16);
    if (_commonJs.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
}
function clone(a) {
    var out = new _commonJs.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new _commonJs.ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
}
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3];
        var a12 = a[6], a13 = a[7];
        var a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    return out;
}
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
}
function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
}
function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    // Cache only the current line of the second matrix
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00 = void 0, a01 = void 0, a02 = void 0, a03 = void 0;
    var a10 = void 0, a11 = void 0, a12 = void 0, a13 = void 0;
    var a20 = void 0, a21 = void 0, a22 = void 0, a23 = void 0;
    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
}
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s = void 0, c = void 0, t = void 0;
    var a00 = void 0, a01 = void 0, a02 = void 0, a03 = void 0;
    var a10 = void 0, a11 = void 0, a12 = void 0, a13 = void 0;
    var a20 = void 0, a21 = void 0, a22 = void 0, a23 = void 0;
    var b00 = void 0, b01 = void 0, b02 = void 0;
    var b10 = void 0, b11 = void 0, b12 = void 0;
    var b20 = void 0, b21 = void 0, b22 = void 0;
    if (len < _commonJs.EPSILON) return null;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
}
function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
}
function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
}
function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
}
function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s = void 0, c = void 0, t = void 0;
    if (len < _commonJs.EPSILON) return null;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromQuat2(out, a) {
    var translation = new _commonJs.ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    //Only scale if it makes sense
    if (magnitude > 0) {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
}
function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
}
function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
}
function getRotation(out, mat) {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    var trace = mat[0] + mat[5] + mat[10];
    var S = 0;
    if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        out[3] = 0.25 * S;
        out[0] = (mat[6] - mat[9]) / S;
        out[1] = (mat[8] - mat[2]) / S;
        out[2] = (mat[1] - mat[4]) / S;
    } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
        S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
        out[3] = (mat[6] - mat[9]) / S;
        out[0] = 0.25 * S;
        out[1] = (mat[1] + mat[4]) / S;
        out[2] = (mat[8] + mat[2]) / S;
    } else if (mat[5] > mat[10]) {
        S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
        out[3] = (mat[8] - mat[2]) / S;
        out[0] = (mat[1] + mat[4]) / S;
        out[1] = 0.25 * S;
        out[2] = (mat[6] + mat[9]) / S;
    } else {
        S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
        out[3] = (mat[1] - mat[4]) / S;
        out[0] = (mat[8] + mat[2]) / S;
        out[1] = (mat[6] + mat[9]) / S;
        out[2] = 0.25 * S;
    }
    return out;
}
function fromRotationTranslationScale(out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
}
function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
}
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2), nf = void 0;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    var xScale = 2.0 / (leftTan + rightTan);
    var yScale = 2.0 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = far * near / (near - far);
    out[15] = 0.0;
    return out;
}
function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
}
function lookAt(out, eye, center, up) {
    var x0 = void 0, x1 = void 0, x2 = void 0, y0 = void 0, y1 = void 0, y2 = void 0, z0 = void 0, z1 = void 0, z2 = void 0, len = void 0;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < _commonJs.EPSILON && Math.abs(eyey - centery) < _commonJs.EPSILON && Math.abs(eyez - centerz) < _commonJs.EPSILON) return identity(out);
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
}
function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        z0 *= len;
        z1 *= len;
        z2 *= len;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
}
function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
}
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
}
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
}
function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
}
function multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    out[9] = a[9] + b[9] * scale;
    out[10] = a[10] + b[10] * scale;
    out[11] = a[11] + b[11] * scale;
    out[12] = a[12] + b[12] * scale;
    out[13] = a[13] + b[13] * scale;
    out[14] = a[14] + b[14] * scale;
    out[15] = a[15] + b[15] * scale;
    return out;
}
function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _commonJs.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
var mul = multiply;
var sub = subtract;

},{"./common.js":"j0kng","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kkyG4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VRButton", ()=>VRButton);
class VRButton {
    static createButton(renderer) {
        const button = document.createElement("button");
        function showEnterVR() {
            let currentSession = null;
            async function onSessionStarted(session) {
                session.addEventListener("end", onSessionEnded);
                await renderer.xr.setSession(session);
                button.textContent = "EXIT VR";
                currentSession = session;
            }
            function onSessionEnded() {
                currentSession.removeEventListener("end", onSessionEnded);
                button.textContent = "ENTER VR";
                currentSession = null;
            }
            //
            button.style.display = "";
            button.style.cursor = "pointer";
            button.style.left = "calc(50% - 50px)";
            button.style.width = "100px";
            button.textContent = "ENTER VR";
            button.onmouseenter = function() {
                button.style.opacity = "1.0";
            };
            button.onmouseleave = function() {
                button.style.opacity = "0.5";
            };
            button.onclick = function() {
                if (currentSession === null) {
                    // WebXR's requestReferenceSpace only works if the corresponding feature
                    // was requested at session creation time. For simplicity, just ask for
                    // the interesting ones as optional features, but be aware that the
                    // requestReferenceSpace call will fail if it turns out to be unavailable.
                    // ('local' is always available for immersive sessions and doesn't need to
                    // be requested separately.)
                    const sessionInit = {
                        optionalFeatures: [
                            "local-floor",
                            "bounded-floor",
                            "hand-tracking",
                            "layers"
                        ]
                    };
                    navigator.xr.requestSession("immersive-vr", sessionInit).then(onSessionStarted);
                } else currentSession.end();
            };
        }
        function disableButton() {
            button.style.display = "";
            button.style.cursor = "auto";
            button.style.left = "calc(50% - 75px)";
            button.style.width = "150px";
            button.onmouseenter = null;
            button.onmouseleave = null;
            button.onclick = null;
        }
        function showWebXRNotFound() {
            disableButton();
            button.textContent = "VR NOT SUPPORTED";
        }
        function showVRNotAllowed(exception) {
            disableButton();
            console.warn("Exception when trying to call xr.isSessionSupported", exception);
            button.textContent = "VR NOT ALLOWED";
        }
        function stylizeElement(element) {
            element.style.position = "absolute";
            element.style.bottom = "20px";
            element.style.padding = "12px 6px";
            element.style.border = "1px solid #fff";
            element.style.borderRadius = "4px";
            element.style.background = "rgba(0,0,0,0.1)";
            element.style.color = "#fff";
            element.style.font = "normal 13px sans-serif";
            element.style.textAlign = "center";
            element.style.opacity = "0.5";
            element.style.outline = "none";
            element.style.zIndex = "999";
        }
        if ("xr" in navigator) {
            button.id = "VRButton";
            button.style.display = "none";
            stylizeElement(button);
            navigator.xr.isSessionSupported("immersive-vr").then(function(supported) {
                supported ? showEnterVR() : showWebXRNotFound();
                if (supported && VRButton.xrSessionIsGranted) button.click();
            }).catch(showVRNotAllowed);
            return button;
        } else {
            const message = document.createElement("a");
            if (window.isSecureContext === false) {
                message.href = document.location.href.replace(/^http:/, "https:");
                message.innerHTML = "WEBXR NEEDS HTTPS"; // TODO Improve message
            } else {
                message.href = "https://immersiveweb.dev/";
                message.innerHTML = "WEBXR NOT AVAILABLE";
            }
            message.style.left = "calc(50% - 90px)";
            message.style.width = "180px";
            message.style.textDecoration = "none";
            stylizeElement(message);
            return message;
        }
    }
    static registerSessionGrantedListener() {
        if ("xr" in navigator) {
            // WebXRViewer (based on Firefox) has a bug where addEventListener
            // throws a silent exception and aborts execution entirely.
            if (/WebXRViewer\//i.test(navigator.userAgent)) return;
            navigator.xr.addEventListener("sessiongranted", ()=>{
                VRButton.xrSessionIsGranted = true;
            });
        }
    }
}
VRButton.xrSessionIsGranted = false;
VRButton.registerSessionGrantedListener();

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["2gwYA"], null, "parcelRequireaaed")

//# sourceMappingURL=display-looking-glass-3d.7356368e.js.map
