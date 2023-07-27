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
})({"2SXBX":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "498353046f5afaf7";
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

},{}],"kswz0":[function(require,module,exports) {
/**
 * 
 * Follows interface
 * 
 * Uses 
 * MediaPipe Vision by Google
 * https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js
 * 
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "loadFaceLandmarksModel", ()=>loadFaceLandmarksModel);
//const FACE_LANDMARK_TASK = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
// import FACE_LANDMARK_TASK from "url:./face_landmarker.task"
var _tasksVision = require("@mediapipe/tasks-vision");
var _faceLandmarksCalculations = require("./face-landmarks-calculations");
const FACE_LANDMARK_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
// import { now } from '../timing/timing'
// This flips to using a seperate thread for the 
// prediction calculations - dunno if it makes it quicker
// but it certainly uses more CPU which then shonks audio
const useWorker = false;
// inline 
let faceLandmarker;
// via worker... preferred but requires re-render
let faceLandmarksWorker;
let lastVideoTime = 0;
const setOptions = async (options)=>{
    if (useWorker) faceLandmarksWorker.postMessage({
        command: "setOptions",
        options
    });
    else await faceLandmarker.setOptions(options);
};
let previousPrediction = [];
/**
 * Send an input element and determine how the faces look within
 * @param {HTMLElement} inputElement 
 * @param {*} detector 
 * @param {Boolean} flipHorizontally 
 * @returns 
 */ const predict = async (inputElement, detector, flipHorizontally = true)=>{
    // const radio = inputElement.videoHeight / inputElement.videoWidth
    // TODO: Resize video if too large
    // video.style.width = videoWidth + "px"
    // video.style.height = videoWidth * radio + "px"
    // canvasElement.style.width = videoWidth + "px"
    // canvasElement.style.height = videoWidth * radio + "px"
    // canvasElement.width = video.videoWidth
    // canvasElement.height = video.videoHeight
    if (lastVideoTime !== inputElement.currentTime) {
        lastVideoTime = inputElement.currentTime;
        results = detector.detectForVideo(inputElement, Date.now());
        // results = detector.detectForVideo(inputElement, lastVideoTime)
        const people = [];
        // array
        if (results.faceLandmarks) {
            const faceQuantity = results.faceLandmarks.length;
            for(let i = 0; i < faceQuantity; ++i){
                const faceLandmarks = results.faceLandmarks[i];
                const faceBlendshapes = results.faceBlendshapes[i];
                const faceMatrix = results.facialTransformationMatrixes[i];
                // 	 drawingUtils.drawConnectors(
                //     landmarks,
                //     FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                //     { color: "#C0C0C070", lineWidth: 1 }
                //   );
                if (!useWorker) // direct (no worker)
                people[i] = (0, _faceLandmarksCalculations.enhanceFaceLandmarksModelPrediction)(faceLandmarks, faceBlendshapes, faceMatrix, lastVideoTime, flipHorizontally);
            }
            // console.error("Person", results)
            previousPrediction = people;
            return people;
        }
    }
    return previousPrediction;
};
const loadFaceLandmarksModel = async (inputElement, options, progressCallback, flipHorizontally = true)=>{
    const startLoadProgress = 0.5;
    const loadRange = 0.3;
    const loadTotal = useWorker ? 3 : 2;
    let loadIndex = 0;
    let detector;
    const faceLandmarkerOptions = {
        baseOptions: {
            modelAssetPath: "/face_landmarker.task",
            delegate: "GPU"
        },
        // override defaults
        ...options
    };
    progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++ / loadTotal), "Loading Brains");
    if (useWorker) {
        const connectToWorker = async ()=>{
            // request it to load all the required data...
            function handleMessageFromWorker(msg) {
                faceLandmarksWorker.removeEventListener("error", handleMessageFromWorker);
                faceLandmarksWorker.removeEventListener("message", handleMessageFromWorker);
                console.warn("Worker connected to App");
                return true;
            }
            faceLandmarksWorker.addEventListener("error", handleMessageFromWorker);
            faceLandmarksWorker.addEventListener("message", handleMessageFromWorker);
            faceLandmarksWorker.postMessage({
                command: "load",
                faceLandmarkerOptions
            });
        };
        // FIXME: Loading this as a module prevents the vision task working
        // faceWorker = new Worker( faceLandmarkerWorker )
        // faceLandmarksWorker = new Worker( new URL('./face-landmarks-worker.js', import.meta.url) )
        // faceLandmarksWorker = new Worker( new URL('data-url:./face-landmarks-worker.js', import.meta.url), {type:'module'} )
        // faceLandmarksWorker = new Worker(
        // 	new URL('./face-landmarks-worker.js', import.meta.url), 
        // 	{type:'module'} 
        // )
        faceLandmarksWorker = new Worker(new URL("./face-landmarks-worker.js"));
        progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++ / loadTotal), "Loading Brains");
        await connectToWorker();
        progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++ / loadTotal), "Loading Brains");
        const update = async (repeat, callback, isPaused = null)=>{
            faceLandmarksWorker.addEventListener("message", (e)=>{
                callback(e.data);
                // loop or use worker???
                if (repeat) requestAnimationFrame(()=>update(repeat, callback, isPaused));
            }, {
                once: true
            });
            faceLandmarksWorker.postMessage({
                command: "predict",
                callback
            }, flipHorizontally, [
                inputElement
            ]);
        };
        return update;
    } else {
        const filesetResolver = await (0, _tasksVision.FilesetResolver).forVisionTasks(FACE_LANDMARK_WASM);
        progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++ / loadTotal), "Loading Eyes");
        const detector = await (0, _tasksVision.FaceLandmarker).createFromOptions(filesetResolver, faceLandmarkerOptions);
        progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++ / loadTotal), "Loading Brains");
        // now subscribe to events and monitor
        const update = async (repeat, callback, isPaused = null)=>{
            const shouldUpdate = isPaused ? isPaused() : true;
            // console.log("shouldUpdate", shouldUpdate, {isPaused})
            // console.log("Combining TF model", model, "with element", inputElement, "..." )
            if (shouldUpdate) {
                const prediction = await predict(inputElement, detector, flipHorizontally);
                // enhance prediction to create our model...
                // console.error("results.prediction", {prediction} )
                callback(prediction);
            }
            // loop or use worker???
            if (repeat) requestAnimationFrame(()=>update(repeat, callback, isPaused));
        };
        return update;
    }
};

},{"@mediapipe/tasks-vision":"e5Mjq","./face-landmarks-calculations":"ifxaO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ifxaO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "enhanceFaceLandmarksModelPrediction", ()=>enhanceFaceLandmarksModelPrediction);
var _maths = require("../maths/maths");
var _faceModelConstants = require("./face-model-constants");
var _tasksVision = require("@mediapipe/tasks-vision");
/*
const drawingUtils = new DrawingUtils(canvasCtx);

// TODO: Check out 
FaceLandmarker.FACE_LANDMARKS_TESSELATION
drawingUtils.drawConnectors(
	landmarks,
	FaceLandmarker.FACE_LANDMARKS_TESSELATION,
	{ color: "#C0C0C070", lineWidth: 1 }
  );
*/ // FACE_LANDMARKS_LIPS: Connection[];
// /** Landmark connections to draw the connection between a face's left eye. */
//  FACE_LANDMARKS_LEFT_EYE: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's left eyebrow.
//  */
// FACE_LANDMARKS_LEFT_EYEBROW: Connection[];
// /** Landmark connections to draw the connection between a face's left iris. */
// FACE_LANDMARKS_LEFT_IRIS: Connection[];
// /** Landmark connections to draw the connection between a face's right eye. */
// FACE_LANDMARKS_RIGHT_EYE: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's right
//  * eyebrow.
//  */
// FACE_LANDMARKS_RIGHT_EYEBROW: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's right iris.
//  */
// FACE_LANDMARKS_RIGHT_IRIS: Connection[];
// /** Landmark connections to draw the face's oval. */
// FACE_LANDMARKS_FACE_OVAL: Connection[];
// /** Landmark connections to draw the face's contour. */
// FACE_LANDMARKS_CONTOURS: Connection[];
// /** Landmark connections to draw the face's tesselation. */
// FACE_LANDMARKS_TESSELATION: Connection[];
// ** === ^ == Math.pow in ECMA22
const { PI, abs, sqrt, atan2, tan } = Math;
const enhanceFaceLandmarksModelPrediction = (faceLandmarks, faceBlendshapes, facialTransformationMatrixes, time, flipHorizontally = true)=>{
    // Blendshapes infor courtesy of 
    // https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapelocation/
    const keypoints = faceLandmarks;
    const landmarks = faceBlendshapes.categories;
    if (flipHorizontally) faceLandmarks.forEach((faceLandmark)=>{
        faceLandmark.x = 1 - faceLandmark.x;
    });
    const prediction = {
        flipped: flipHorizontally,
        keypoints,
        faceBlendshapes,
        faceLandmarks,
        facialTransformationMatrixes
    };
    // first create an output that contains everything then overwrite it
    // you can remove this for speed reasons if you are providing a full options config
    // options = { ...DEFAULT_OPTIONS, ...options }
    // This is a virtual line from the top of the head to the bottom...
    // we can use this and the eyes to determine face roll, pitch, yaw
    // we can use the bounding box or actual face mesh coords
    let topOfHead = 0;
    let bottomOfHead = Number.POSITIVE_INFINITY;
    let referenceTopOfHead;
    let referenceBottomOfHead;
    let pointApexOfHead = keypoints[152];
    let pointBottomOfChin = keypoints[10];
    // FIXME:
    let pointLeftOfFace = keypoints[234];
    // let pointRightOfFace  = keypoints[454]
    // let pointRightOfFace  = keypoints[356]
    let pointRightOfFace = keypoints[447];
    const annotations = {};
    // Head ------------------------------------------------------
    // 1, 4, 5, 195, 197 are all nose based
    const pointNoseTip = keypoints[4];
    const pointForehead = keypoints[9];
    const pointFeltrum = keypoints[0];
    // const pointTopOfHead = keypoints[109]
    // const pointBottomOfHead = keypoints[400]
    // const centerOfHead = keypoints[168]
    // const forehead = keypoints[10]
    // Calculate some sizes : size of head from chin to top
    // const headHeight = bottomOfHead[1] - topOfHead[1]
    const headHeight = (0, _maths.hypoteneuse2D)(pointApexOfHead, pointBottomOfChin);
    prediction.headHeight = headHeight;
    //console.error("head", {topOfHead: pointTopOfHead, bottomOfHead: pointBottomOfHead}, headHeight )
    // This is a virtual line from the top of the head to the bottom...
    // we can use this and the eyes to determine face roll, pitch, yaw
    // we can use the bounding box or actual face mesh coords
    annotations.headVertical = [
        pointApexOfHead,
        pointNoseTip,
        pointBottomOfChin
    ];
    // Eyes ------------------------------------------------------
    // Which way are we facing?
    // const eyeDirection = widthLeftEye / widthRightEye
    const pointLeftEyeSocketOuter = keypoints[362];
    const pointLeftEyeCaruncle = keypoints[263];
    const pointRightEyeSocketOuter = keypoints[133];
    const pointRightEyeCaruncle = keypoints[33];
    // Eye socket extents - size of each individual eye sockets heights (eye lid openings)
    // const leftEyeSocketHeight =	hypoteneuse2D( annotations.leftEye[0], annotations.leftEye[4] )
    // const rightEyeSocketHeight = hypoteneuse2D( annotations.rightEye[0], annotations.rightEye[4] )
    // const leftEyeSocketHeight = hypoteneuse2D( keypoints[257], keypoints[253] )
    // const rightEyeSocketHeight = hypoteneuse2D( keypoints[27], keypoints[23] ) 
    const leftEyeSocketWidth = (0, _maths.hypoteneuse2D)(pointLeftEyeSocketOuter, pointLeftEyeCaruncle);
    const rightEyeSocketWidth = (0, _maths.hypoteneuse2D)(pointRightEyeSocketOuter, pointRightEyeCaruncle);
    // which ways are the eyes pointing to? we want from -1 -> 1
    // left is -ve right is +ve
    prediction.rightEyeDirection = landmarks[16].score - landmarks[14].score;
    prediction.leftEyeDirection = landmarks[13].score - landmarks[15].score;
    prediction.eyeDirection = 0.5 * (prediction.rightEyeDirection + prediction.leftEyeDirection);
    prediction.isLookingRight = prediction.eyeDirection > 0.5;
    // before an eye blink is the squint!
    prediction.eyeSquintLeft = landmarks[19].score;
    prediction.eyeSquintRight = landmarks[20].score;
    // eye blink!
    const leftBlink = landmarks[9].score;
    const rightBlink = landmarks[10].score;
    prediction.leftEyeClosedBy = leftBlink;
    prediction.rightEyeClosedBy = rightBlink;
    // how much is considered open????
    prediction.leftEyeClosed = leftBlink > 0.6;
    prediction.rightEyeClosed = rightBlink > 0.6;
    // both together
    prediction.eyesClosed = prediction.leftEyeClosed && prediction.rightEyeClosed;
    // console.error("eyes", {pointBetweenTheEyes,distanceBetweenIrises,leftEyeSocketHeight,rightEyeSocketHeight, l:annotations.leftEye, r:annotations.rightEye, leftEyeSocketWidth, rightEyeSocketWidth }, eyes )
    // - MOUTH ------------------------------------------------------
    const jawOpeness = landmarks[25].score;
    const mouthCloseness = landmarks[27].score;
    // ooooooo
    const mouthFunnel = landmarks[32].score;
    // kissing
    const mouthPucker = landmarks[38].score;
    const isMouthOpen = jawOpeness > 0.2;
    // is wider than tall?
    const isMouthWide = jawOpeness > 0.5;
    prediction.mouthRatio = jawOpeness;
    // TODO: this is the size of the mouth as a factor of the head size
    prediction.mouthOpen = isMouthOpen;
    // TODO: FIXME: mouth shape fixing
    // if it is wider than tall - E
    // if it is about the same width as height - O
    prediction.mouthShape = isMouthOpen ? !mouthPucker > 0.3 ? (0, _faceModelConstants.MOUTH_SHAPE_O) : (0, _faceModelConstants.MOUTH_SHAPE_E) : (0, _faceModelConstants.MOUTH_SHAPE_CLOSED);
    // - BOUNDING BOX ------------------------------------------------
    prediction.box = {
        xMin: flipHorizontally ? 1 - pointRightOfFace.x : pointLeftOfFace.x,
        xMax: flipHorizontally ? 1 - pointLeftOfFace.x : pointRightOfFace.x,
        yMin: pointBottomOfChin.y,
        yMax: pointApexOfHead.y
    };
    // - ORIENTATION ------------------------------------------------
    // To determine the orientation and angle of the head we do
    // some triangulation to draw right angles where we can infer
    // using trigonometry the angles against themn
    // FIXME: as this is -1 -> 1 we need to wrap it better
    const rawYaw = flipHorizontally ? leftEyeSocketWidth / rightEyeSocketWidth : rightEyeSocketWidth / leftEyeSocketWidth;
    const regulatedYaw = (rawYaw - 1) * 2;
    // this maps from 2 -> 0
    const yaw = (0, _maths.clamp)(regulatedYaw < 0 ? regulatedYaw * 2 : regulatedYaw, -1, 1);
    // if either eye is lower than the other : 
    // triangle between eye extents and vertical
    const rollX = flipHorizontally ? pointRightEyeSocketOuter.x - pointLeftEyeSocketOuter.x : pointLeftEyeSocketOuter.x - pointRightEyeSocketOuter.x;
    const rollY = pointLeftEyeSocketOuter.y - pointRightEyeSocketOuter.y;
    const rollRegular = atan2(rollX, rollY);
    const rawRoll = flipHorizontally ? -rollRegular : rollRegular;
    const regulatedRoll = (rawRoll + Math.PI * 0.5) * 1.3;
    const roll = (0, _maths.clamp)(regulatedRoll, -1, 1);
    // we use two lengths to determine the angles
    // to determine how much the head is rocking forwards and backwards
    // a triangle can be created  
    // const distanceFromFeltrumToForeHead = hypoteneuse3D( feltrum, forehead )	
    // UP & DOWN in RADIANS
    const pitchDepth = pointApexOfHead.z - pointBottomOfChin.z;
    const pitchHeight = pointApexOfHead.y - pointBottomOfChin.y;
    const pitchInRadians = atan2(pitchDepth, pitchHeight) * 1.5;
    const pitch = (0, _maths.clamp)(pitchInRadians, -1, 1);
    // 0 -> 1
    // 44
    prediction.rightSmirk = landmarks[44].score // mouthSmileRight
    ;
    //45
    prediction.leftSmirk = landmarks[45].score // mouthSmileLeft
    ;
    prediction.isFacingRight = yaw > 0;
    // leaning head as if to look at own chest / sky
    prediction.pitch = pitch;
    // tilting head towards shoulders
    prediction.roll = roll;
    // regular left right neck rotational movement
    prediction.yaw = yaw;
    // useful sometimes (different time to audio context?)
    prediction.time = time;
    return prediction;
};

},{"../maths/maths":"iZJNT","./face-model-constants":"2nnRQ","@mediapipe/tasks-vision":"e5Mjq","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2nnRQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FACE_CONTOURS", ()=>FACE_CONTOURS);
parcelHelpers.export(exports, "MOUTH_SHAPE_CLOSED", ()=>MOUTH_SHAPE_CLOSED);
parcelHelpers.export(exports, "MOUTH_SHAPE_O", ()=>MOUTH_SHAPE_O);
parcelHelpers.export(exports, "MOUTH_SHAPE_E", ()=>MOUTH_SHAPE_E);
parcelHelpers.export(exports, "MOUTH_SHAPE_I", ()=>MOUTH_SHAPE_I);
parcelHelpers.export(exports, "MOUTH_SHAPE_U", ()=>MOUTH_SHAPE_U);
parcelHelpers.export(exports, "RATIO_OF_MOUTH_TO_FACE", ()=>RATIO_OF_MOUTH_TO_FACE);
parcelHelpers.export(exports, "EYE_CLOSED_AT", ()=>EYE_CLOSED_AT);
parcelHelpers.export(exports, "PITCH_SCALE", ()=>PITCH_SCALE);
parcelHelpers.export(exports, "createDefaultFaceModel", ()=>createDefaultFaceModel);
var _faceLandmarkConstants = require("./face-landmark-constants");
const FACE_CONTOURS = _faceLandmarkConstants.MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR;
const MOUTH_SHAPE_CLOSED = "-";
const MOUTH_SHAPE_O = "o";
const MOUTH_SHAPE_E = "e";
const MOUTH_SHAPE_I = "i";
const MOUTH_SHAPE_U = "u";
const RATIO_OF_MOUTH_TO_FACE = 0.25;
const EYE_CLOSED_AT = 20.2 //.5
;
const PITCH_SCALE = 8;
const createDefaultFaceModel = ()=>{
    return {};
};

},{"./face-landmark-constants":"1U5wU","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["2SXBX"], null, "parcelRequireaaed")

//# sourceMappingURL=face-landmarks.6f5afaf7.js.map
