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
})({"k5Lsx":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "14dd6991f75ecb4f";
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

},{}],"gmSJu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Canvas based front end engine
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */ parcelHelpers.export(exports, "DisplayMediaVision2D", ()=>DisplayMediaVision2D);
var _faceLandmarkConstants = require("../models/face-landmark-constants");
var _2DEyes = require("../visual/2d.eyes");
var _displayAbstract = require("./display-abstract");
var _tasksVision = require("@mediapipe/tasks-vision");
const faceOvalStyle = {
    // The color that is used to draw the shape. Defaults to white.
    // string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
    color: "hsl(90,50%,50%)",
    // color: "hsl(90,50%,50%)",
    // color: "#C0C0C070",
    /**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 * string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	 */ fillColor: "hsl(90,50%,50%)",
    // The width of the line boundary of the shape. Defaults to 4. 
    lineWidth: 3,
    // The radius of location marker. Defaults to 6.
    radius: 12
};
// For landmarks
const blobStyle = {
    //color?: string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
    color: "hsla(90,50%,50%, 0.2)",
    /** The width of the line boundary of the shape. Defaults to 4. */ lineWidth: 0.5,
    /**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 */ fillColor: "hsla(90,50%,50%, 0.5)",
    /** The radius of location marker. Defaults to 6. */ radius: 0.25
};
const eyeBrowStyle = {
    color: "#FF000070",
    /**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 * string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	 */ fillColor: "hsls(90,50%,50%, 0.5)",
    lineWidth: 1
};
class DisplayMediaVision2D extends (0, _displayAbstract.AbstractDisplay) {
    canvasContext;
    constructor(canvas, initialWidth, initialHeight){
        super(canvas, initialWidth, initialHeight);
        this.canvasContext = canvas.getContext("2d");
        this.drawingUtils = new (0, _tasksVision.DrawingUtils)(this.canvasContext);
        this.available = true;
    }
    /**
	 * Empty the canvas and paint it transparent
	 */ clear() {
        // this.canvasContext.fillStyle = 'rgba(255,0,0,0)'
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    // this.canvasContext.fillRect(0, 0, width, height)
    // this.canvasContext.restore()
    }
    /**
	 * Paints an existing element onto our display
	 * Used to paint a video frame to the canvas
	 * @param {HTMLElement} element - video / image
	 * @param {Number} x - default to 0
	 * @param {Number} y - default to 0
	 * @param {Boolean} flip - default to true
	 */ drawElement(element, x = 0, y = 0, flip = true) {
        this.canvasContext.save();
        // invert horizontally (mirror image)
        if (flip) {
            this.canvasContext.translate(this.width, 0);
            this.canvasContext.scale(-1, 1);
        }
        this.canvasContext.drawImage(element, x, y);
        this.canvasContext.restore();
    }
    /**
	 * 
	 * @param {Person} person 
	 */ drawPerson(person, beatJustPlayed, colours) {
        const prediction = person.data;
        const landmarks = prediction.faceLandmarks;
        const options = person.options;
        const flipped = options.flipped;
        // const hue = person.hue
        // const saturation = person.saturation
        // const luminosity = person.luminosity
        // generic face colour
        const col = person.hsla;
        //  `hsla(${mouthColours.h},${mouthColours.s},${mouthColours.l},${mouthColours.a}})`
        // console.log("drawing person", person, "to canvas", this )
        // FIXME:
        // if (person.isMouseDown)
        // {
        // 	drawMousePressure( person.mouseHoldProgress, options.mouseHoldDuration )
        // }
        // NB. assumes screen has been previously cleared	
        // drawBox( prediction )
        //drawFace( prediction, options, this.singing, this.isMouthOpen, this.debug )
        if (options.drawMask) {
            // we go from nodes to mesh if mouth active...
            if (!options.drawNodes && !options.drawMesh && options.meshOnSing) {
                // this.isMouthOpen = true
                if (person.singing) {
                    if (person.instrumentLoading) this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_TESSELATION, {
                        color: person.hsl,
                        lineWidth: 1
                    });
                    else if (person.isMouthOpen) this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_TESSELATION, {
                        color: person.hsl,
                        lineWidth: 2
                    });
                } else {
                    faceOvalStyle.fillColor = person.hsl;
                    this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_FACE_OVAL, faceOvalStyle);
                }
            } else if (options.drawNodes) {
                // just blobs
                blobStyle.color = col;
                blobStyle.fillColor = col;
                // drawPoints( prediction, colours, 3, person.instrumentLoading, this.debug )
                this.drawingUtils.drawLandmarks(landmarks, blobStyle);
            } else if (options.drawMesh) // just mesh
            this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_TESSELATION, {
                color: col,
                lineWidth: 1
            });
        }
        // drawBoundingBox( boundingBox )
        //console.error("Bounding box", {boundingBox} )
        //const { height,width,xMax,xMin,yMax,yMin} = boundingBox
        // if this is mirrored using the option in the TF model...
        // now overlay the mouth
        if (options.drawMouth) {
            const mouthColours = {
                h: col,
                s: options.saturation,
                l: options.luminosity,
                a: 1
            };
            const mouthColoursClosed = {
                h: col,
                s: options.saturation,
                l: 20,
                a: 1
            };
            const lipColours = {
                h: 90,
                s: 50,
                l: 50,
                a: 1
            };
            // This overlays the mouth and the eyes
            if (person.isMouthOpen && person.singing) // Inner
            // drawLip( annotations.innerLip, lipColours, mouthColours )
            this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_LIPS, {
                color: options.mouth,
                lineWidth: 3
            });
            else // Outer
            // drawLip( annotations.outerLip, lipColours, mouthColoursClosed )
            this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_LIPS, {
                color: options.mouthClosed,
                lineWidth: 1
            });
        }
        // draw silhoette if the user is 
        // if you want it to flicker...
        // interacting&& this.counter%2 === 0)
        // EYES ===================================================================
        // eyes have been closed for X -period of time
        if (person.areEyesClosed) ;
        else if (options.drawEyes) {
            const eyeOptions = {
                // colourful part of the eye
                iris: options.leftEyeIris,
                // size of the colourful part
                irisRadius: options.irisRadius,
                // holes in the eyes
                pupil: options.pupil,
                // size of the hole
                pupilRadius: options.pupilRadius,
                // big white bit of the eyed
                sclera: "white",
                // size of the white bit
                scleraRadius: options.scleraRadius,
                ratio: options.eyeRatio,
                outline: false,
                scaleX: this.width,
                scaleY: this.height
            };
            const leftEyeData = (0, _faceLandmarkConstants.LEFT_EYE_PATH).map((connection, i)=>landmarks[connection]);
            // fetch group of keyframes that represent eyes...
            // const leftEyeData =  landmarks.slice( FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.start, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.end )
            // const leftPupilData = LEFT_IRIS_PATH.map( (connection,i) => landmarks[connection] )
            const leftPupilData = landmarks[(0, _faceLandmarkConstants.LEFT_IRIS_PATH)[0]];
            // FIXME:
            // const irisData = isLeft ? keypoints.leftIris : keypoints.rightIris
            const rightEyeData = (0, _faceLandmarkConstants.RIGHT_EYE_PATH).map((connection, i)=>landmarks[connection]);
            //const rightEyeData = landmarks.slice( FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.start, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.end )
            // const rightPupilData = RIGHT_IRIS_PATH.map( (connection,i) => landmarks[connection] )
            const rightPupilData = landmarks[(0, _faceLandmarkConstants.RIGHT_IRIS_PATH)[0]];
            // console.error( "FaceLandmarker", FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {leftEyeData,leftPupilData})
            // Draw the eyes over the face
            const eyeDirection = prediction.eyeDirection;
            this.drawEye(leftEyeData, leftPupilData, person.isLeftEyeOpen, eyeDirection, eyeOptions);
            eyeOptions.iris = options.rightEyeIris;
            this.drawEye(rightEyeData, rightPupilData, person.isRightEyeOpen, eyeDirection, eyeOptions);
        }
        if (options.drawEyebrows) {
            eyeBrowStyle.color = col;
            eyeBrowStyle.fillColor = options.leftEyebrow;
            // FIXME: draw some funky eyebrows!
            this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_LEFT_EYEBROW, eyeBrowStyle);
            eyeBrowStyle.fillColor = options.rightEyebrow;
            this.drawingUtils.drawConnectors(landmarks, (0, _tasksVision.FaceLandmarker).FACE_LANDMARKS_RIGHT_EYEBROW, eyeBrowStyle);
        }
    // Person drawn to screen
    }
    // TODO:
    drawEye(eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions) {
        // FIXME: size of eyes!
        pupilData.diameter = 20;
        (0, _2DEyes.drawEye)(this.canvasContext, eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions);
    //drawEye( annotations, true, person.isLeftEyeOpen, eyeDirection, eyeOptions)	
    // this.drawingUtils.drawConnectors(
    // 	landmarks,
    // 	FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
    // 	{ color: "#55555570", lineWidth: 3 }
    // )
    // this.drawingUtils.drawConnectors(
    // 	landmarks,
    // 	FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
    // 	{ color: "#FF000070", lineWidth: 3 }
    // )
    }
    /**
	 * Overwrite the existing canvas with the same one but
	 * positioned at a specific offset to make it look cool
	 * @param {Number} offsetX 
	 * @param {Number} offsetY 
	 */ overdraw(offsetX = 0, offsetY = -1) {
        // this.canvasContext.save()
        //this.canvasContext.translate(0, -1)
        this.canvasContext.drawImage(this.canvas, offsetX, offsetY);
    // for (var i = 0; i < numImages; i++) {
    // 	this.canvasContext.drawImage(img, i * img.width, 0);
    // }
    // this.canvasContext.restore()
    }
    /**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */ takePhotograph(type = "image/png") {
        // TODO: reassemble canvas with logo and stuff?
        return this.canvas.toDataURL(type);
    }
}

},{"../models/face-landmark-constants":"1U5wU","../visual/2d.eyes":"9VNyr","./display-abstract":"fgqcQ","@mediapipe/tasks-vision":"e5Mjq","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9VNyr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "drawEye", ()=>drawEye);
var _maths = require("../maths/maths");
var _palette = require("../palette");
var _paletteDefault = parcelHelpers.interopDefault(_palette);
const DEFAULT_OPTIONS = {
    // colourful part of the eye
    iris: "rgba(100,255,100,0.8)",
    irisRadius: 1,
    // holes in the eyes
    pupil: "rgba(0,0,0,0.8)",
    pupilRadius: 0.3,
    // big white bit of the eye
    sclera: "white",
    scleraRadius: 4,
    outline: false,
    ratio: 1,
    // sometimes x,y,z are returned as widths already
    scaleX: 1,
    scaleY: 1
};
const drawEye = (canvasContext, eyeData, pupilData, open = true, eyeDirection = 0, options = DEFAULT_OPTIONS)=>{
    const showRatio = options.ratio || 0.8;
    const radius = pupilData.diameter * 0.5;
    // console.log( {eyeData, irisWidth,irisHeight, diameter, options })
    canvasContext.strokeWidth = 0;
    // draw iris path
    // arc(x, y, radius, startAngle, endAngle, counterClockwise) 
    // straight lines
    // canvasContext.moveTo(up.x, up.y)
    // canvasContext.lineTo(inner.x, inner.y)
    // canvasContext.lineTo(down.x, down.y)
    // canvasContext.lineTo(outer.x, outer.y)
    // canvasContext.moveTo(up.x, up.y)
    // canvasContext.arcTo(inner.x, inner.y)
    // canvasContext.arcTo(down.x, down.y)
    // canvasContext.arcTo(outer.x, outer.y)
    // canvasContext.arcTo(up.x, up.y)
    if (open) {
        // round no perspective...
        const scleraRadius = radius * options.scleraRadius;
        const irisRadius = radius * options.irisRadius;
        const pupilRadius = radius * options.pupilRadius;
        const socketRadius = scleraRadius - irisRadius;
        const eyeOffset = socketRadius * -eyeDirection;
        const pupilX = pupilData.x * options.scaleX;
        const pupilY = pupilData.y * options.scaleY;
        // SCLERA - the white stuff... 
        canvasContext.beginPath();
        if (options.outline) // this could be wrapped in the eye socket...
        eyeData.forEach((data)=>{
            const x = data.x * options.scaleX;
            const y = data.y * options.scaleY;
            canvasContext.lineTo(x, y);
        // console.log("draw eyes", options, x,y )
        });
        else // or as a funky overlay
        canvasContext.arc(pupilX + eyeOffset, pupilY, scleraRadius, 0, (0, _maths.TAU));
        canvasContext.fillStyle = options.sclera;
        canvasContext.fill();
        canvasContext.closePath();
        // IRIS - two different styles... 
        // 1. Circular Eyes
        // 2. Frank Sidebottom Eyes
        canvasContext.beginPath();
        canvasContext.fillStyle = options.iris;
        // pie chart eyes because of showRatio
        canvasContext.arc(pupilX, pupilY, irisRadius, 0, (0, _maths.TAU) * showRatio);
        canvasContext.lineTo(pupilX, pupilY);
        canvasContext.fill();
        canvasContext.closePath();
        // canvasContext.arcTo(up.x, up.y, inner.x, inner.y, options.irisRadius)
        // canvasContext.arcTo(inner.x, inner.y, down.x, down.y, options.irisRadius)
        // canvasContext.arcTo(down.x, down.y, outer.x, outer.y, options.irisRadius)
        // canvasContext.arcTo(outer.x, outer.y, up.x, up.y, options.irisRadius)
        // canvasContext.fill()
        //canvasContext.arc(pupil.x, pupil.y, radius * options.irisRadius, 0, TAU)
        // canvasContext.ellipse(pupil.x, pupil.y, irisWidth, irisHeight, 0, 0, TAU)
        // canvasContext.ellipse(pupil.x, pupil.y, irisHeight, irisWidth, 0, 0, TAU)
        // PUPILS
        // 1 + clamp( (10+iris[2]) * 0.8, 5, 10 )
        canvasContext.beginPath();
        canvasContext.fillStyle = options.pupil;
        canvasContext.arc(pupilX, pupilY, pupilRadius, 0, (0, _maths.TAU));
        canvasContext.fill();
    } else {
        // ---- EYES CLOSED -----
        // draw cute triangle
        canvasContext.beginPath();
        canvasContext.lineStyle = options.iris;
        canvasContext.fillStyle = options.pupil;
        canvasContext.moveTo(eyeData[0].x, eyeData[0].y);
        canvasContext.lineTo(eyeData[4].x, eyeData[4].y);
        canvasContext.lineTo(eyeData[6].x, eyeData[6].y);
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.fill();
    // canvasContext.fillRect( 
    // 	(!isLeft ? inner.x : outer.x), 
    // 	(!isLeft ? inner.y : outer.y), 
    // 	radius * options.scleraRadius, 
    // 	irisHeight 
    // )
    // canvasContext.rect(pupil.x, pupil.y, diameter, diameter * 0.2 )
    // canvasContext.fill()
    }
/*
	radius = 4
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'blue'
	canvasContext.arc(up.x, up.y, radius, 0, TAU)
	canvasContext.fill()
	canvasContext.closePath()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'purple'
	canvasContext.arc(outer.x, outer.y, radius, 0, TAU)
	canvasContext.fill()
		
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'green'
	canvasContext.arc(down.x, down.y, radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'yellow'
	canvasContext.arc(inner.x, inner.y, radius, 0, TAU)
	canvasContext.fill()
	*/ /*
	// there are four outer balls
	for (let i = 0  ; i < eye.length -1; i++ ) 
	{
		const x = eye[i].x
		const y = eye[i].y
		const z = eye[i].z || 1

		// const radius = 1 + clamp( (10+z) * 0.8, 5, 10 )
		// canvasContext.arc(x, y, radius, 0, TAU)
		// canvasContext.fill()

		if (i > 0)
		{
			const arcLength = 7 ;//Math.abs( i%2 ? iris - x : iris - y )
			const previous = eye[i-1]
			canvasContext.arcTo(previous.x,previous.y, x,y,arcLength)
		}
	}*/ // canvasContext.stroke()
};

},{"../maths/maths":"iZJNT","../palette":"7zTRL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fgqcQ":[function(require,module,exports) {
/**
 * Overwrite these methods in your own displays
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AbstractDisplay", ()=>AbstractDisplay);
class AbstractDisplay {
    // allows you to debug this view
    debug = true;
    available = false;
    canvas;
    // Linked List --------------------
    nextDisplayLink;
    previousDisplayLink;
    get previousDisplay() {
        return this.previousDisplayLink;
    }
    get nextDisplay() {
        return this.nextDisplayLink;
    }
    get firstDisplay() {
        let i = this;
        while(i.previousDisplay)i = i.previousDisplay;
        return i;
    }
    get lastDisplay() {
        let i = this;
        while(i.nextDisplayLink)i = i.nextDisplayLink;
        return i;
    }
    /**
	 * 
	 * @param {AbstractDisplay} display 
	 */ addDisplay(display) {
        const last = this.lastDisplay;
        // navigate to end of chain and append our new display
        last.nextDisplayLink = display;
        display.previousDisplayLink = last;
    }
    // Linked List --------------------
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    constructor(canvas, initialWidth, initialHeight){
        this.canvas = canvas;
        this.canvas.width = initialWidth;
        this.canvas.height = initialHeight;
    }
    /**
	 * Empty the canvas and paint it transparent
	 */ clear() {}
    /**
	 * Draw a Person model to the screen
	 */ drawPerson(person, beatJustPlayed, colours) {}
    /**
	 * Draw a Person model to the screen
	 */ drawElement(person, beatJustPlayed, colours) {}
    /**
	 * Draw to screen?
	 */ render() {}
    /**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */ takePhotograph(type = "image/png") {}
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["k5Lsx"], null, "parcelRequireaaed")

//# sourceMappingURL=display-mediavision-2d.f75ecb4f.js.map
