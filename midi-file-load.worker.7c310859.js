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
})({"hhz2G":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "a8fb9c35fdafe466";
module.bundle.HMR_BUNDLE_ID = "e9b2d09d7c310859";
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

},{}],"hQi3F":[function(require,module,exports) {
var _midiFileLoad = require("./midi-file-load");
// Capture public methods
self.onmessage = (e)=>{
    console.error("MIDI:Worker", e);
    const data = e.data;
    switch(data.command){
        case "loadMIDIFile":
            (0, _midiFileLoad.loadMIDIFile)(data.url, data.options).then((midi)=>{
                console.error("MIDI:Worker loaded", {
                    url: data.url,
                    midi
                });
                postMessage({
                    event: data.command,
                    midi
                });
            });
            break;
        case "loadMIDIFileThroughClient":
            (0, _midiFileLoad.loadMIDIFileThroughClient)(data.url, data.options).then((midi)=>{
                console.error("MIDI:Worker loaded", {
                    url: data.url,
                    midi
                });
                postMessage({
                    event: data.command,
                    midi
                });
            });
            break;
    }
};

},{"./midi-file-load":"jHQli"}],"jHQli":[function(require,module,exports) {
// Midi File
// ==============
// Abstract    - Load a .midi file from a local server
// Description - Buffers a .midi file into memory, parse the commands
// Use         - Load( file.midi, onComplete ) and wait for the callback
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "loadMIDIFromFile", ()=>loadMIDIFromFile);
parcelHelpers.export(exports, "loadMIDIFile", ()=>loadMIDIFile);
parcelHelpers.export(exports, "loadMIDIFileThroughClient", ()=>loadMIDIFileThroughClient);
var _midiStream = require("./midi-stream");
var _midiStreamDefault = parcelHelpers.interopDefault(_midiStream);
var _midiDecode = require("./midi-decode");
var _utils = require("../../utils");
/**
 * Clean data
 * @param {String} data - raw data
 * @returns String of decoded MIDI data
 */ const sanitizeResponse = (data)=>{
    const chars = [];
    for(let i = 0, quantity = data.length; i < quantity; ++i)chars[i] = String.fromCharCode(data.charCodeAt(i) & 255);
    return chars.join("");
};
/**
 * Convert an array of integers into a string of bytes
 * NB. & 255 is not neccessary
 * @param {*} arrayBuffer 
 * @returns {String} String Bytes
 */ const arrayBufferToBytes = (arrayBuffer)=>Array.prototype.map.call(arrayBuffer, (ch)=>String.fromCharCode(ch)).join("");
/**
 * ASCII to Bytes  bufferToBinaryString
 * WebWorker compatable atob.
 * NB. This is very costly - try and avoid
 * @returns 
 */ const asciiToBinary = (ascii)=>{
    return typeof window == "object" && typeof document == "object" && window.document === document ? window.atob : arrayBufferToBytes((0, _utils.base64DecToArr)(ascii));
};
/**
 * load From Base64 String
 * @param {string} arr - UInt8Array
 * @param {Object} options -
 * @returns 
 */ const loadMIDIFromArray = async (arr, options = {}, progressCallback = null)=>new Promise((resolve, reject)=>{
        try {
            const data = arrayBufferToBytes(new Uint8Array(arr));
            const stream = new (0, _midiStreamDefault.default)(data);
            resolve((0, _midiDecode.decodeMIDI)(stream, options));
        } catch (error) {
            reject(error);
        }
    });
/**
 * load From Base64 String
 * @param {string} file - Base64 string as raw bytes
 * @param {Object} options -
 * @returns 
 */ const loadMIDIFromBase64 = async (file, options = {}, progressCallback = null)=>new Promise((resolve, reject)=>{
        try {
            const encoded = file.split(",")[1];
            const data = asciiToBinary(encoded);
            const stream = new (0, _midiStreamDefault.default)(data);
            resolve((0, _midiDecode.decodeMIDI)(stream, options));
        } catch (error) {
            reject(error);
        }
    });
const loadMIDIFromFile = (url, options = {}, progressCallback = null)=>new Promise((resolve, reject)=>{
        const fetch = new XMLHttpRequest();
        fetch.open("GET", url, true);
        fetch.responseType = "arraybuffer";
        fetch.onerror = (error)=>reject(error);
        fetch.onreadystatechange = (e)=>{
            /*
		0: request not initialized
		1: server connection established
		2: request received
		3: processing request
		4: request finished and response is ready
		*/ if (fetch.readyState === 4 && fetch.status === 200) {
                const arrayBuffer = fetch.response;
                if (arrayBuffer) {
                    const byteArray = new Uint8Array(arrayBuffer);
                    const midi = loadMIDIFromArray(byteArray, options, progressCallback);
                    resolve(midi);
                }
            }
        };
        // fetch.onload = () => {}
        fetch.send(null);
    });
/**
 * Open a file from the client's local machine and load it
 * into memory
 * @param {*} file 
 * @param {*} progressCallback 
 * @returns 
 */ const loadRawFile = (file, progressCallback, base64 = true)=>new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.onload = (event)=>resolve(fileReader.result);
        fileReader.onprogress = (event)=>progressCallback && progressCallback(event);
        fileReader.onerror = (event)=>reject(fileReader.error);
        base64 ? fileReader.readAsDataURL(file) : fileReader.readAsArrayBuffer(file);
    });
const loadMIDIFile = (urlOrBlob, options = {}, progressCallback = null)=>new Promise(async (resolve, reject)=>{
        const isString = typeof urlOrBlob === "string";
        let midiFile;
        if (isString) {
            const isBase64 = urlOrBlob.indexOf("base64,") === -1;
            if (isBase64) midiFile = await loadMIDIFromFile(urlOrBlob, options, progressCallback);
            else midiFile = await loadMIDIFromBase64(urlOrBlob, options, progressCallback);
            console.error("loadMIDIFile via BASE64", {
                urlOrBlob,
                midiFile
            });
        } else {
            midiFile = await loadMIDIFromArray(urlOrBlob, options, progressCallback);
            console.error("loadMIDIFile via ArrayBuffer", {
                urlOrBlob,
                midiFile
            });
        }
        resolve(midiFile);
    });
const loadMIDIFileThroughClient = async (file, options, progressCallback, useBase64 = false)=>{
    const rawFile = await loadRawFile(file, progressCallback, useBase64);
    const midiTrack = await loadMIDIFile(rawFile, {
        ...options,
        trackName: file.name.split(".mid")[0].replace("_", " ")
    }, progressCallback);
    return midiTrack;
};

},{"./midi-stream":"2mr4E","./midi-decode":"gKkqk","../../utils":"cf6Af","@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"2mr4E":[function(require,module,exports) {
/**
 * Midi Stream
 * Abstract    - A string based byte nibbler and convertor
 * Description - Feed it a data file then request bytes as needed
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class MIDIStream {
    position = 0;
    str;
    /**
	 * Create an instance of a MIDI data stream
	 * @param {String} data - RAW data
	 */ constructor(data){
        this.str = data;
    }
    /**
	 * Read X length of the internal string
	 * @param {*} length 
	 * @returns {String} 
	 */ read(length) {
        const result = this.str.substr(this.position, length);
        this.position += length;
        return result;
    }
    /**
	 * Read a big-endian 32-bit integer
	 * @returns {String} XXXX
	 */ readInt32() {
        const result = (this.str.charCodeAt(this.position) << 24) + (this.str.charCodeAt(this.position + 1) << 16) + (this.str.charCodeAt(this.position + 2) << 8) + this.str.charCodeAt(this.position + 3);
        this.position += 4;
        return result;
    }
    /**
	 * Read a big-endian 16-bit integer
	 * @returns {String} XX
	 */ readInt16() {
        const result = (this.str.charCodeAt(this.position) << 8) + this.str.charCodeAt(this.position + 1);
        this.position += 2;
        return result;
    }
    /**
	 * read an 8-bit integer
	 * @param {Boolean} signed 
	 * @returns {String} X
	 */ readInt8(signed = false) {
        const result = this.str.charCodeAt(this.position);
        if (signed && result > 127) result -= 256;
        this.position += 1;
        return result;
    }
    /**
	 * Read a MIDI-style variable-length integer
	 * (big-endian value in groups of 7 bits,
	 * with top bit set to signify that another byte follows)
	 * @returns {Number} A
	 */ readVarInt() {
        let result = 0;
        while(true){
            const b = this.readInt8(false);
            if (b & 0x80) {
                result += b & 0x7f;
                result <<= 7;
            } else return result + b;
        }
    }
    // End of File - bool
    eof() {
        return this.position >= this.str.length;
    }
}
exports.default = MIDIStream;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"fn8Fk":[function(require,module,exports) {
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

},{}],"gKkqk":[function(require,module,exports) {
/*//////////////////////////////////////////////////////////////////////////////

MIT Licence

Midi File
==============
Abstract    - decode a .midi file from an object in memory
Description - Buffers a .midi file into memory, parses the commands
Use         - Load( file.midi, onComplete ) and wait for the callback
Methods     -
Inspired by - https://github.com/gasman/jasmid/blob/master/stream.js#L2
References  - http://www.indiana.edu/~emusic/etext/MIDI/chapter3_MIDI3.shtml

Channel Voice
    Control the instrument's 16 voices (timbres, patches), plays notes, sends
    controller data, etc.

Channel Mode
    Define instrument's response to Voice messages, sent over instrument's
    'basic' channel

System Common
    Messages intended to all networked instruments and devices

System Real-Time
    Intended for all networked instruments and devices. Contain only status
    bytes and is used for syncronization of all devices. essentially a timing
    clock

System Exclusive
    Originally used for manufacturer-specific codes, such as editor/librarians,
    has been expanded to include MIDI Time Code, MIDI Sample Dump Standard and
    MIDI Machine Control

//////////////////////////////////////////////////////////////////////////////*/ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "decodeMIDI", ()=>decodeMIDI);
var _midiStream = require("./midi-stream");
var _midiStreamDefault = parcelHelpers.interopDefault(_midiStream);
var _midiCommand = require("./midi-command");
var _midiCommandDefault = parcelHelpers.interopDefault(_midiCommand);
var _midiTrack = require("./midi-track");
var _midiTrackDefault = parcelHelpers.interopDefault(_midiTrack);
var _midiCommands = require("./midi-commands");
var _notes = require("../notes");
const TIME_CODE_BASED = "time-code-based";
const METRIC_TIME = "metrical";
// some systems leave the last byte out
// to preserve memory but here we can
// re-add it if we want to :)
let lastEventTypeByte;
/**
 * Take a 4 byte chunk out of the data set
 * @param {MidiStream} stream 
 * @returns {Object}
 */ const readChunk = (stream, size = 4)=>{
    const chunk = {};
    // Each midi event message is 4 bytes big...
    chunk.id = stream.read(size);
    chunk.length = stream.readInt32();
    chunk.data = stream.read(chunk.length);
    return chunk;
};
/**
 * Get the amount of frames per second from the division
 * @param {Number} timeDivision 
 * @returns {Number}
 */ const getFramesPerSecond = (timeDivision)=>{
    const bit8_15 = (timeDivision & 0xFF00) >> 8;
    const flippedBit8_15 = bit8_15 ^ 0xFF;
    return flippedBit8_15 + 1;
};
/**
 * Convert Raw header data into readable object data
 * @param {MidiStream} stream 
 * @param {Object} options - defaults
 * @returns 
 */ const decodeHeader = (stream, options = {})=>{
    const headerChunk = readChunk(stream);
    const headerType = headerChunk.id;
    if (headerType !== "MThd" && headerType !== "MTrk" || headerChunk.length !== 6) throw ".mid file could not be read - header chunk 'MThd'/'MTrk' was not found";
    const headerStream = new (0, _midiStreamDefault.default)(headerChunk.data);
    const formatType = headerStream.readInt16();
    const trackCount = headerStream.readInt16();
    const timeDivision = headerStream.readInt16();
    const isTimeCodeBased = timeDivision & 0x8000;
    const timeCodeType = isTimeCodeBased ? TIME_CODE_BASED : METRIC_TIME;
    switch(headerType){
        case "MThd":
            const division = {};
            if (timeCodeType === TIME_CODE_BASED) {
                division.ticksPerFrame = timeDivision & 0x00FF;
                division.framesPerSecond = getFramesPerSecond(timeDivision);
            } else division.ticksPerQuarterNote = timeDivision & 0x7FFF;
            return {
                formatType,
                trackCount,
                timeDivision,
                isTimeCodeBased,
                timeCodeType,
                division
            };
        case "MTrk":
            return {
                formatType,
                trackCount,
                timeDivision,
                isTimeCodeBased,
                timeCodeType
            };
    }
};
/**
 * 
 * @param {MIDITrack} track 
 * @param {MidiStream} stream 
 * @returns 
 */ const decodeTracks = (track, stream)=>{
    const quantity = track.header.trackCount;
    for(let i = 0; i < quantity; i++){
        const trackChunk = readChunk(stream);
        switch(trackChunk.id){
            case "MTrk":
                break;
            case "MThd":
                throw `Still working on MThd implementation... ${trackChunk.id}`;
            default:
                throw `Unexpected chunk - expected MTrk, got ${trackChunk.id}`;
        }
        const trackStream = new (0, _midiStreamDefault.default)(trackChunk.data);
        while(!trackStream.eof()){
            const event = convertEventToCommand(trackStream);
            //tracks[i].push(event);
            track.addEvent(i, event);
        }
    }
    return track;
};
/**
 * 
 * @param {MidiStream} stream 
 * @returns {MIDICommand}
 */ const convertEventToCommand = (stream)=>{
    const event = new (0, _midiCommandDefault.default)();
    const time = stream.readVarInt();
    const eventTypeByte = stream.readInt8();
    event.deltaTime = time;
    const isSystemEvent = (eventTypeByte & 0xf0) === 0xf0;
    return isSystemEvent ? decodeSystemEvent(stream, event, eventTypeByte) : decodeChannelEvent(stream, event, eventTypeByte);
};
/**
 * Control the instrument's 16 voices (timbres, patches),
 * plays notes, sends controller data, etc.
 * @param {MIDIStream} stream -
 * @param {MIDICommand} event -
 * @param {number} eventTypeByte - 
 * @returns {MIDICommand}
 */ const decodeChannelEvent = (stream, event, eventTypeByte)=>{
    let firstParameter;
    if ((eventTypeByte & 0x80) === 0) {
        /* running status - 
		reuse lastEventTypeByte as the event type.
		this allows bytes to be saved if the command repeats
			eventTypeByte is actually the first parameter
		*/ firstParameter = eventTypeByte;
        eventTypeByte = lastEventTypeByte;
    } else {
        firstParameter = stream.readInt8();
        lastEventTypeByte = eventTypeByte;
    }
    const eventType = eventTypeByte >> 4;
    event.channel = eventTypeByte & 0x0f;
    event.type = _midiCommands.TYPE_CHANNEL;
    //event.raw = `"type":${event.type},"channel":${event.channel}`
    switch(eventType){
        case 0x08:
            event.subtype = _midiCommands.COMMAND_NOTE_OFF;
            //'noteOff';
            event.noteNumber = firstParameter;
            event.noteName = (0, _notes.convertMIDINoteNumberToName)(firstParameter);
            event.velocity = stream.readInt8();
            //event.raw += `"subtype":${event.subtype},"noteNumber":${firstParameter}`
            return event;
        case 0x09:
            event.noteNumber = firstParameter;
            event.noteName = (0, _notes.convertMIDINoteNumberToName)(firstParameter);
            event.velocity = stream.readInt8();
            if (event.velocity === 0) event.subtype = _midiCommands.COMMAND_NOTE_OFF;
            else event.subtype = _midiCommands.COMMAND_NOTE_ON; //'noteOn';
            return event;
        case 0x0a:
            event.subtype = _midiCommands.COMMAND_NOTE_AFTER_TOUCH; //'noteAftertouch';
            event.noteNumber = firstParameter;
            event.noteName = (0, _notes.convertMIDINoteNumberToName)(firstParameter);
            event.amount = stream.readInt8();
            return event;
        case 0x0b:
            event.subtype = _midiCommands.COMMAND_CONTROLLER; //'controller';
            event.controllerType = firstParameter;
            event.value = stream.readInt8();
            return event;
        case 0x0c:
            event.subtype = _midiCommands.COMMAND_PROGRAM_CHANGE; //'programChange';
            event.programNumber = firstParameter;
            return event;
        case 0x0d:
            event.subtype = _midiCommands.COMMAND_CHANNEL_AFTER_TOUCH; //'channelAftertouch';
            event.amount = firstParameter;
            return event;
        case 0x0e:
            event.subtype = _midiCommands.COMMAND_PITCH_BEND;
            event.value = firstParameter + (stream.readInt8() << 7);
            return event;
        default:
            throw "Unrecognised MIDI event type: " + eventType;
    }
};
/**
 * 
 * @param {MIDIStream} stream 
 * @param {MIDICommand} event 
 * @param {number} eventTypeByte 
 * @returns MIDICommand
 */ const decodeSystemEvent = (stream, event, eventTypeByte)=>{
    // system / meta event
    if (eventTypeByte === 0xff) {
        // meta event
        event.type = _midiCommands.TYPE_META;
        const subtypeByte = stream.readInt8();
        const length = stream.readVarInt();
        switch(subtypeByte){
            case 0x00:
                event.subtype = "sequenceNumber";
                if (length !== 2) throw "Expected length for sequenceNumber event is 2, got " + length;
                event.sequenceNumber = stream.readInt16();
                return event;
            case 0x01:
                event.subtype = "text";
                event.text = stream.read(length);
                return event;
            case 0x02:
                event.subtype = "copyrightNotice";
                event.text = stream.read(length);
                return event;
            case 0x03:
                event.subtype = "trackName";
                event.text = stream.read(length);
                return event;
            case 0x04:
                event.subtype = "instrumentName";
                event.text = stream.read(length);
                return event;
            case 0x05:
                event.subtype = "lyrics";
                event.text = stream.read(length);
                return event;
            case 0x06:
                event.subtype = "marker";
                event.text = stream.read(length);
                return event;
            case 0x07:
                event.subtype = "cuePoint";
                event.text = stream.read(length);
                return event;
            case 0x20:
                event.subtype = "midiChannelPrefix";
                if (length !== 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
                event.channel = stream.readInt8();
                return event;
            case 0x2f:
                event.subtype = "endOfTrack";
                if (length !== 0) throw "Expected length for endOfTrack event is 0, got " + length;
                return event;
            case 0x51:
                event.subtype = "setTempo";
                if (length !== 3) throw "Expected length for setTempo event is 3, got " + length;
                event.microsecondsPerBeat = (stream.readInt8() << 16) + (stream.readInt8() << 8) + stream.readInt8();
                return event;
            case 0x54:
                event.subtype = "smpteOffset";
                if (length !== 5) throw "Expected length for smpteOffset event is 5, got " + length;
                const hourByte = stream.readInt8();
                // magic
                event.frameRate = ({
                    0x00: 24,
                    0x20: 25,
                    0x40: 29,
                    0x60: 30
                })[hourByte & 0x60];
                //console.error( event.frameRate )
                event.hour = hourByte & 0x1f;
                event.min = stream.readInt8();
                event.sec = stream.readInt8();
                event.frame = stream.readInt8();
                event.subframe = stream.readInt8();
                return event;
            case 0x58:
                event.subtype = "timeSignature";
                if (length !== 4) throw "Expected length for timeSignature event is 4, got " + length;
                event.numerator = stream.readInt8();
                event.denominator = Math.pow(2, stream.readInt8());
                event.metronome = stream.readInt8();
                event.thirtyseconds = stream.readInt8();
                return event;
            case 0x59:
                event.subtype = "keySignature";
                if (length !== 2) throw "Expected length for keySignature event is 2, got " + length;
                event.key = stream.readInt8(true);
                event.scale = stream.readInt8();
                return event;
            case 0x7f:
                event.subtype = "sequencerSpecific";
                event.data = stream.read(length);
                return event;
            default:
                // console.log("Unrecognised meta event subtype: " + subtypeByte);
                event.subtype = "unknown";
                event.data = stream.read(length);
                return event;
        }
    } else if (eventTypeByte === 0xf0) {
        event.type = _midiCommands.TYPE_SYSTEM_EXCLUSIVE;
        const length = stream.readVarInt();
        event.data = stream.read(length);
        return event;
    } else if (eventTypeByte === 0xf7) {
        event.type = _midiCommands.TYPE_DIVIDED_SYSTEM_EXCLUSIVE;
        const length = stream.readVarInt();
        event.data = stream.read(length);
        return event;
    } else throw "Unrecognised MIDI event type byte: " + eventTypeByte;
};
const decodeMIDI = (stream, options = {})=>{
    const header = decodeHeader(stream);
    const track = new (0, _midiTrackDefault.default)(header, options);
    return decodeTracks(track, stream);
};

},{"./midi-stream":"2mr4E","./midi-command":"5NFng","./midi-track":"95BrD","./midi-commands":"dpjGX","../notes":"hRDCO","@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"5NFng":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class MIDICommand {
    // Uint8Array
    raw;
    time = 0;
    timeCode = 0;
    deltaTime;
    frameRate;
    channel;
    type;
    subtype;
    text;
    data;
    hour;
    min;
    sec;
    frame;
    subframe;
    microsecondsPerBeat;
    key;
    scale;
    numerator;
    denominator;
    metronome;
    thirtyseconds;
    amount;
    noteNumber;
    // not an official MIDI spec but we use it in our app
    noteName;
    velocity;
    // pitch value from MIDI is 0 -> 16383
    value;
    controllerType;
    programNumber;
    sequenceNumber;
    constructor(){}
    toString() {
        let output = `${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`;
        if (this.channel) output += ` [Channel ${this.channel}] `;
        if (this.noteNumber) output += ` Note:${this.noteNumber} -> ${this.noteName}`;
        if (this.velocity) output += ` Velocity:${this.velocity}`;
        return output + "\n";
    }
}
exports.default = MIDICommand;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"95BrD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _generalMidi = require("./general-midi");
var _midiCommand = require("./midi-command");
var _midiCommandDefault = parcelHelpers.interopDefault(_midiCommand);
var _midiCommands = require("./midi-commands");
class MidiTrack {
    // :MidiHeader
    header;
    // :Array<MIDICommands>
    tracks = [];
    commands = [];
    instruments = [];
    noteOnCommands = [];
    trackName = "";
    meta = "";
    copyrightNotice = "Copyright held by respective owners";
    lyrics = "";
    trackPosition = 0;
    commandPosition = 0;
    duration = 0;
    mimeType = "audio/mid";
    get ticksPerBeat() {
    // return 
    }
    get tempo() {}
    get timeSignature() {
        return [
            4,
            4
        ];
    }
    getMatchingCommands(types = [
        _midiCommands.COMMAND_NOTE_ON
    ], type = "channel") {
        // check if array or string and if string make array
        if (typeof types === String) types = [
            types
        ];
        return this.commands.filter((value)=>{
            //console.log("getMatchingCommands",value.type === type,value)
            if (value.type === type) {
                const typePosition = types.indexOf(value.subtype);
                //console.log("typePosition > -1", typePosition > -1, types, value.subType)
                return typePosition > -1;
            }
            return false;
        });
    }
    getNextNoteCommand() {
        const commands = [];
        let track = this.tracks[++this.trackPosition];
        while(track && track.subtype !== _midiCommands.COMMAND_NOTE_ON || track.subtype !== _midiCommands.COMMAND_NOTE_OFF)track = this.tracks[++this.trackPosition];
        while(track && (track.subtype === _midiCommands.COMMAND_NOTE_ON || track.subtype === _midiCommands.COMMAND_NOTE_OFF)){
            commands.push(track);
            track = this.tracks[++this.trackPosition];
        }
        return commands;
    }
    getNextNoteOnCommand() {
        const commands = [];
        let track = this.tracks[++this.trackPosition];
        while(track && track.subtype === _midiCommands.COMMAND_NOTE_ON){
            commands.push(track);
            track = this.tracks[++this.trackPosition];
        }
        return commands;
    }
    getNextCommands() {
        return this.tracks[++this.trackPosition];
    }
    getNextNoteOnCommand() {
        return this.noteOnCommands[++this.commandPosition];
    }
    getDurationUntilNextCommand() {
        const r = this.tracks[this.trackPosition + 1];
        return r ? r.deltaTime : -1;
    }
    /**
	 * If you want all of the events to also be stretchable
	 * we can condense an entire track into 1 second and
	 * move all of the events proportionally so that the 
	 * timings align with whatever you would like to fit it too
	 * @param {MIDICommand} command 
	 */ convertTimeToFraction(command) {
        return command.time / this.duration;
    }
    copyCommand(command) {
        const copy = new (0, _midiCommandDefault.default)();
        for(let i in command)copy[i] = command[i];
        return copy;
    }
    constructor(header = null, defaultOptions = {}){
        if (header) this.header = header;
        for(let i in defaultOptions)// check to see if they are one of our subclasses...
        switch(i){
            // case "header": 
            // 	this.header = defaultOptions[i]
            // 	break
            case "commands":
            case "noteOnCommands":
                this[i] = defaultOptions[i].map((command)=>this.copyCommand(command));
                break;
            default:
                // check if is command
                this[i] = defaultOptions[i];
                console.log(i, this[i]);
        }
    }
    // A way of adding an event and multiple events to track
    addEvent(index, midiCommand) {
        // current previous event
        const currentFinalCommand = this.commands[this.commands.length - 1];
        // check to see if there is an pocket already open
        // open a new pocket
        if (midiCommand.type === _midiCommands.TYPE_META) switch(midiCommand.subtype){
            case "trackName":
                if (midiCommand.text && midiCommand.text !== "Untitled") this[midiCommand.subtype] = midiCommand.text;
                break;
            case "text":
            case "copyrightNotice":
            case "lyrics":
                if (midiCommand.text) this[midiCommand.subtype] += midiCommand.text;
                break;
            default:
                if (midiCommand.text) this.meta += midiCommand.text;
        }
        else {
            // Deal with instrument changes
            switch(midiCommand.subtype){
                case _midiCommands.COMMAND_PROGRAM_CHANGE:
                    const instrumentName = (0, _generalMidi.GENERAL_MIDI_INSTRUMENTS)[midiCommand.programNumber];
                    this.instruments.push(instrumentName);
                    break;
            }
            midiCommand.subtype, _midiCommands.COMMAND_NOTE_ON, _midiCommands.COMMAND_NOTE_OFF, _midiCommands.COMMAND_CONTROLLER, _midiCommands.COMMAND_PITCH_BEND, _midiCommands.COMMAND_PROGRAM_CHANGE, _midiCommands.COMMAND_CHANNEL_AFTER_TOUCH;
            // add multidimnsionally?
            if (!currentFinalCommand) // first command!
            //console.log( "Adding command", {currentFinalCommand, midiCommand} )
            this.tracks.push([
                midiCommand
            ]);
            else if (midiCommand.deltaTime === 0) {
                const previousDeltaTime = currentFinalCommand.timeCode;
                midiCommand.timeCode = previousDeltaTime;
                midiCommand.time = this.duration;
                // modify command to contain correct timecode
                const commandsAtLocation = this.tracks[this.tracks.length - 1];
                commandsAtLocation.push(midiCommand);
            //console.log( "Appending deltaTime 0", {commandsAtLocation, currentFinalCommand, midiCommand} )
            } else {
                // add to duration
                this.duration += midiCommand.deltaTime || 0;
                midiCommand.timeCode = midiCommand.deltaTime;
                midiCommand.time = this.duration;
                //console.log( "Adding", {currentFinalCommand, midiCommand} )
                this.tracks.push([
                    midiCommand
                ]);
            }
            this.commands.push(midiCommand);
            switch(midiCommand.subtype){
                case _midiCommands.COMMAND_NOTE_ON:
                    this.noteOnCommands.push(midiCommand);
            }
        }
    }
    toString() {
        return `MIDI:Track::${this.commands.map((track)=>track.toString()).join(", ")}`;
    }
    commandToJSON(command) {
        let output = `${command.time}. MIDI:Input::${command.subtype} Type:${command.type}`;
        if (command.channel) output += ` [Channel ${command.channel}] `;
        if (command.noteNumber) output += ` Note:${command.noteNumber} -> ${command.noteName}`;
        if (command.velocity) output += ` Velocity:${command.velocity}`;
        return output;
    }
    // To load save midi tracks in a web friendlier way, we can serialise it to JSON
    toJSON() {
        const o = this.commands.map((command)=>commandToJSON(command));
        return o // `[${this.tracks.map( track => track.toString() ).join(",")}]`
        ;
    }
}
exports.default = MidiTrack;

},{"./general-midi":"36HzS","./midi-command":"5NFng","./midi-commands":"dpjGX","@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"36HzS":[function(require,module,exports) {
// [General MIDI Instrument Patch Map](https://www.midi.org/specifications/item/gm-level-1-sound-set)
// [General MIDI Instrument Patch Map](http://cs.uccs.edu/~cs525/midi/midi.html)
/*
General MIDI Level 1 Instrument Families

The General MIDI Level 1 instrument sounds are grouped by families.
In each family are 8 specific instruments.

PC# 	Family Name
1-8 	Piano
9-16 	Chromatic Percussion
17-24 	Organ
25-32 	Guitar
33-40 	Bass
41-48 	Strings
49-56 	Ensemble
57-64 	Brass
65-72 	Reed
73-80 	Pipe
81-88 	Synth Lead
89-96 	Synth Pad
97-104 	Synth Effects
105-112 Ethnic
113-120 Percussive
121-128 Sound Effects

On MIDI Channel 10, each MIDI Note number ("Key#") corresponds to a different drum sound, as shown below.
GM-compatible instruments must have the sounds on the keys shown here.

While many current instruments also have additional sounds above or below the range show here,
and may even have additional "kits" with variations of these sounds, only these sounds are supported
by General MIDI Level 1 devices.

*/ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GENERAL_MIDI_INSTRUMENTS", ()=>GENERAL_MIDI_INSTRUMENTS);
parcelHelpers.export(exports, "GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES", ()=>GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES);
parcelHelpers.export(exports, "GENERAL_MIDI_INSTRUMENT_FAMILY_IDS", ()=>GENERAL_MIDI_INSTRUMENT_FAMILY_IDS);
parcelHelpers.export(exports, "GENERAL_MIDI_FAMILIES", ()=>GENERAL_MIDI_FAMILIES);
parcelHelpers.export(exports, "GENERAL_MIDI_INSTRUMENT_FAMILIES", ()=>GENERAL_MIDI_INSTRUMENT_FAMILIES);
parcelHelpers.export(exports, "FAMILY_DICTIONARY", ()=>FAMILY_DICTIONARY);
parcelHelpers.export(exports, "DrumKitByPatchID", ()=>DrumKitByPatchID);
const GENERAL_MIDI_INSTRUMENTS = [
    "acoustic grand piano",
    "bright acoustic piano",
    "electric grand piano",
    "honky-tonk piano",
    "electric piano 1",
    "electric piano 2",
    "harpsichord",
    "clavi",
    "celesta",
    "glockenspiel",
    "music box",
    "vibraphone",
    "marimba",
    "xylophone",
    "tubular bells",
    "dulcimer",
    "drawbar organ",
    "percussive organ",
    "rock organ",
    "church organ",
    "reed organ",
    "accordion",
    "harmonica",
    "tango accordion",
    "acoustic guitar (nylon)",
    "acoustic guitar (steel)",
    "electric guitar (jazz)",
    "electric guitar (clean)",
    "electric guitar (muted)",
    "overdriven guitar",
    "distortion guitar",
    "guitar harmonics",
    "acoustic bass",
    "electric bass (finger)",
    "electric bass (pick)",
    "fretless bass",
    "slap bass 1",
    "slap bass 2",
    "synth bass 1",
    "synth bass 2",
    "violin",
    "viola",
    "cello",
    "contrabass",
    "tremolo strings",
    "pizzicato strings",
    "orchestral harp",
    "timpani",
    "string ensemble 1",
    "string ensemble 2",
    "synthstrings 1",
    "synthstrings 2",
    "choir aahs",
    "voice oohs",
    "synth voice",
    "orchestra hit",
    "trumpet",
    "trombone",
    "tuba",
    "muted trumpet",
    "french horn",
    "brass section",
    "synthbrass 1",
    "synthbrass 2",
    "soprano sax",
    "alto sax",
    "tenor sax",
    "baritone sax",
    "oboe",
    "english horn",
    "bassoon",
    "clarinet",
    "piccolo",
    "flute",
    "recorder",
    "pan flute",
    "blown bottle",
    "shakuhachi",
    "whistle",
    "ocarina",
    "lead 1 (square)",
    "lead 2 (sawtooth)",
    "lead 3 (calliope)",
    "lead 4 (chiff)",
    "lead 5 (charang)",
    "lead 6 (voice)",
    "lead 7 (fifths)",
    "lead 8 (bass + lead)",
    "pad 1 (new age)",
    "pad 2 (warm)",
    "pad 3 (polysynth)",
    "pad 4 (choir)",
    "pad 5 (bowed)",
    "pad 6 (metallic)",
    "pad 7 (halo)",
    "pad 8 (sweep)",
    "fx 1 (rain)",
    "fx 2 (soundtrack)",
    "fx 3 (crystal)",
    "fx 4 (atmosphere)",
    "fx 5 (brightness)",
    "fx 6 (goblins)",
    "fx 7 (echoes)",
    "fx 8 (sci-fi)",
    "sitar",
    "banjo",
    "shamisen",
    "koto",
    "kalimba",
    "bag pipe",
    "fiddle",
    "shanai",
    "tinkle bell",
    "agogo",
    "steel drums",
    "woodblock",
    "taiko drum",
    "melodic tom",
    "synth drum",
    "reverse cymbal",
    "guitar fret noise",
    "breath noise",
    "seashore",
    "bird tweet",
    "telephone ring",
    "helicopter",
    "applause",
    "gunshot"
];
const GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES = [
    "piano",
    "chromatic percussion",
    "organ",
    "guitar",
    "bass",
    "strings",
    "ensemble",
    "brass",
    "reed",
    "pipe",
    "synth lead",
    "synth pad",
    "synth effects",
    "ethnic",
    "percussive",
    "sound effects"
];
const GENERAL_MIDI_INSTRUMENT_FAMILY_IDS = {
    0: "piano",
    7: "chromatic percussion",
    12: "organ",
    25: "guitar",
    33: "bass",
    41: "strings",
    49: "ensemble",
    57: "brass",
    65: "reed",
    69: "pipe",
    81: "synth lead",
    89: "synth pad",
    97: "synth effects",
    // some rasict shit right here akin to "world" music
    105: "ethnic",
    113: "percussive",
    123: "sound effects"
};
const GENERAL_MIDI_FAMILIES = new Map();
const GENERAL_MIDI_INSTRUMENT_FAMILIES = {};
const FAMILY_DICTIONARY = {};
let latch = GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[0];
GENERAL_MIDI_INSTRUMENTS.forEach((instrument, index)=>{
    if (GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index]) latch = GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index];
    // GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index]
    GENERAL_MIDI_FAMILIES.set(latch, [
        ...GENERAL_MIDI_FAMILIES.get(latch) || [],
        instrument
    ]);
    FAMILY_DICTIONARY[instrument] = latch;
});
const DrumKitByPatchID = {
    0: "standard kit",
    8: "room kit",
    16: "power kit",
    24: "electronic kit",
    25: "tr-808 kit",
    32: "jazz kit",
    40: "brush kit",
    48: "orchestra kit",
    56: "sound fx kit"
} /*

Channel 10 Drum sounds (overwrites the noteNumber)

Drum Sound - 35
Acoustic Bass Drum - 36
Bass Drum 1 - 37
Side Stick 38 
Acoustic Snare - 39
Hand Clap 40
Electric Snare 41
Low Floor Tom 42
Closed Hi Hat 43
High Floor Tom 44
Pedal Hi-Hat 45
Low Tom 46
Open Hi-Hat 47
Low-Mid Tom 48
Hi-Mid Tom 49
Crash Cymbal 1 50
High Tom 51
Ride Cymbal 1 52
Chinese Cymbal 53
Ride Bell 54
Tambourine 55
Splash Cymbal 56
Cowbell 57
Crash Cymbal 2 58
Vibraslap 59
Ride Cymbal 2 60
Hi Bongo 61
Low Bongo 62
Mute Hi Conga 63
Open Hi Conga 64
Low Conga 65
High Timbale 66
Low Timbale 67
High Agogo 68
Low Agogo 69
Cabasa 70
Maracas 71
Short Whistle 
72
Long Whistle 
73
Short Guiro 
74
Long Guiro 
75
Claves
76
Hi Wood Block
77
Low Wood Block
78
Mute Cuica
79
Open Cuica
80
Mute Triangle
81
Open Triangle
*/ ;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"dpjGX":[function(require,module,exports) {
// Types!
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TYPE_CHANNEL", ()=>TYPE_CHANNEL);
parcelHelpers.export(exports, "TYPE_META", ()=>TYPE_META);
parcelHelpers.export(exports, "TYPE_SYSTEM_EXCLUSIVE", ()=>TYPE_SYSTEM_EXCLUSIVE);
parcelHelpers.export(exports, "TYPE_DIVIDED_SYSTEM_EXCLUSIVE", ()=>TYPE_DIVIDED_SYSTEM_EXCLUSIVE);
parcelHelpers.export(exports, "COMMAND_NOTE_OFF", ()=>COMMAND_NOTE_OFF);
parcelHelpers.export(exports, "COMMAND_NOTE_ON", ()=>COMMAND_NOTE_ON);
parcelHelpers.export(exports, "COMMAND_NOTE_AFTER_TOUCH", ()=>COMMAND_NOTE_AFTER_TOUCH);
parcelHelpers.export(exports, "COMMAND_CONTROLLER", ()=>COMMAND_CONTROLLER);
parcelHelpers.export(exports, "COMMAND_PROGRAM_CHANGE", ()=>COMMAND_PROGRAM_CHANGE);
parcelHelpers.export(exports, "COMMAND_CHANNEL_AFTER_TOUCH", ()=>COMMAND_CHANNEL_AFTER_TOUCH);
parcelHelpers.export(exports, "COMMAND_CHANNEL_PRESSURE", ()=>COMMAND_CHANNEL_PRESSURE);
parcelHelpers.export(exports, "COMMAND_PITCH_BEND", ()=>COMMAND_PITCH_BEND);
parcelHelpers.export(exports, "COMMAND_SYSTEM_MESSAGE", ()=>COMMAND_SYSTEM_MESSAGE);
parcelHelpers.export(exports, "COMMANDS", ()=>COMMANDS);
const TYPE_CHANNEL = "channel";
const TYPE_META = "meta";
const TYPE_SYSTEM_EXCLUSIVE = "sysEx";
const TYPE_DIVIDED_SYSTEM_EXCLUSIVE = "dividedSysEx";
const COMMAND_NOTE_OFF = "noteOff";
const COMMAND_NOTE_ON = "noteOn";
const COMMAND_NOTE_AFTER_TOUCH = "noteAftertouch";
const COMMAND_CONTROLLER = "controller";
const COMMAND_PROGRAM_CHANGE = "programChange";
const COMMAND_CHANNEL_AFTER_TOUCH = "channelAftertouch";
const COMMAND_CHANNEL_PRESSURE = "channelPressure";
const COMMAND_PITCH_BEND = "pitchBend";
const COMMAND_SYSTEM_MESSAGE = "systemMessage";
const COMMANDS = [
    COMMAND_NOTE_OFF,
    COMMAND_NOTE_ON,
    COMMAND_NOTE_AFTER_TOUCH,
    COMMAND_CONTROLLER,
    COMMAND_PROGRAM_CHANGE,
    COMMAND_CHANNEL_PRESSURE,
    COMMAND_PITCH_BEND,
    COMMAND_SYSTEM_MESSAGE
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"hRDCO":[function(require,module,exports) {
/**
 * Having written this numerous times here are some
 * notes for next time around.
 * 
 * There are MORE MIDI notes than SAMPLES
 * so we have to restrict the octaves from 1-9 to 1-7
 * 
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SOLFEGE_SCALE", ()=>SOLFEGE_SCALE);
parcelHelpers.export(exports, "noteNumberToFrequency", ()=>noteNumberToFrequency);
parcelHelpers.export(exports, "createInstrumentBanks", ()=>createInstrumentBanks);
parcelHelpers.export(exports, "NOTE_NAMES", ()=>NOTE_NAMES);
parcelHelpers.export(exports, "getNoteName", ()=>getNoteName);
parcelHelpers.export(exports, "getNoteSound", ()=>getNoteSound);
parcelHelpers.export(exports, "getFriendlyNoteName", ()=>getFriendlyNoteName);
parcelHelpers.export(exports, "convertNoteNameToMIDINoteNumber", ()=>convertNoteNameToMIDINoteNumber);
parcelHelpers.export(exports, "convertMIDINoteNumberToName", ()=>convertMIDINoteNumberToName);
parcelHelpers.export(exports, "noteNumberToFrequencyFast", ()=>noteNumberToFrequencyFast);
parcelHelpers.export(exports, "frequencyToNoteNumber", ()=>frequencyToNoteNumber);
var _maths = require("../maths/maths");
var _utils = require("../utils");
// Memoize as much as possible
const NOTES_ALPHABETICAL = [
    "A",
    "Ab",
    "B",
    "Bb",
    "C",
    "D",
    "Db",
    "E",
    "Eb",
    "F",
    "G",
    "Gb"
];
// const CONVERSION_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const NOTES_BLACK = [
    "Ab",
    "Bb",
    "Db",
    "Eb",
    "Gb"
];
const NOTES_WHITE = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"
];
const NOTES_BLACK_INDEXES = NOTES_BLACK.length - 1;
const NOTES_WHITE_INDEXES = NOTES_WHITE.length - 1;
const NOTE_RANGE = NOTES_ALPHABETICAL.length;
const SOLFEGE_SCALE = [
    "Doe",
    "Ray",
    "Me",
    "Far",
    "Sew",
    "La",
    "Tea"
];
// this is an object with the keys being the NOTE_NAMES
// MIDI conversion stuff
const NOTE_NAME_MAP = {};
const NOTE_FRIENDLY_NAME_MAP = {};
const MIDI_NOTE_NUMBER_MAP = [];
const MIDI_NOTE_NUMBERS = [];
const MIDI_NOTE_NAMES = [];
const MIDI_NOTE_FRIENDLY_NAMES = [];
const MIDI_NOTE_FREQUENCIES = [];
const GENERAL_MIDI_INSTRUMENTS = [];
const noteNumberToFrequency = (note)=>{
    const c = (note - 69) / 12;
    return 440 * c * c;
};
/**
 * returns a note name from an index and offset
 * @param {Number} index 
 * @param {Number} offset 
 * @returns {Number} noteNumber
 */ const getNoteFromBank = (index = 0, offset = 0)=>{
    const rotation = index + offset;
    return NOTES_ALPHABETICAL[rotation < 0 ? NOTE_RANGE + rotation : rotation % NOTE_RANGE];
};
const createInstrumentBanks = (fileType = "mp3", dot = ".")=>{
    const bank = [];
    for(let b = 0; b < NOTES_ALPHABETICAL.length; ++b){
        const key = NOTES_ALPHABETICAL[b];
        if (key === "A") bank.push(`A0${dot}${fileType}`);
        else if (key === "B") bank.push(`B0${dot}${fileType}`);
        for(let i = 1; i < 8; ++i)bank.push(`${key}${i}${dot}${fileType}`);
        // add an extra one for C
        if (key === "C") bank.push(`C8${dot}${fileType}`);
    }
    return bank;
};
const extractKeyAndOctave = (note)=>{
    const key = note.charAt(0);
    const octave = parseInt(note.charAt(note.length - 1)) // + 1
    ;
    return {
        key,
        octave
    };
};
const friendly = (note)=>{
    const { key, octave } = extractKeyAndOctave(note);
    note = note.replace(octave, `-${octave}`);
    note = note.replace("b", "#");
    return note;
};
const NOTE_NAMES = createInstrumentBanks("", "");
// for each name we do a clever thing innit...
const NOTE_NAMES_FRIENDLY = NOTE_NAMES.map((note)=>friendly(note));
// NB. We only have instruments for the GM Range so 
//		all MIDI numbers below 21 should be ignored really!
for(let noteNumber = 0; noteNumber < 127; noteNumber++){
    // const noteName = NOTE_NAMES[noteNumber]
    // MIDI scale starts at octave = -1
    const octave = (noteNumber / NOTE_RANGE | 0) - 1;
    // Determine which key it is from the number?
    const key = getNoteFromBank(noteNumber % NOTE_RANGE, 4);
    const midiNoteName = `${key}${octave}`;
    const friendlyName = friendly(midiNoteName);
    //console.log( noteNumber, "note", { midiNoteName, friendlyName, octave, key })
    NOTE_FRIENDLY_NAME_MAP[midiNoteName] = friendlyName;
    NOTE_NAME_MAP[midiNoteName] = noteNumber;
    // MIDI_NOTE_NUMBERS[noteNumber] = midiNoteName
    MIDI_NOTE_NAMES[noteNumber] = midiNoteName;
    MIDI_NOTE_FRIENDLY_NAMES[noteNumber] = friendlyName;
    MIDI_NOTE_NUMBER_MAP[noteNumber] = {
        octave,
        key
    };
    MIDI_NOTE_FREQUENCIES[noteNumber] = noteNumberToFrequency(noteNumber);
    // console.log(noteNumber, "Converting", {noteName, octave, key, midiNoteName, friendlyName })
    // // ensure that it exists in our super array...
    const hasSample = NOTE_NAMES.indexOf(midiNoteName) > -1;
    GENERAL_MIDI_INSTRUMENTS[noteNumber] = hasSample ? midiNoteName : `UNKNOWN`;
}
const getNoteName = (percent, octave = 3, isMinor = false)=>{
    // restrict to 1-7 even though 0 is available for many
    // octave = clamp(octave, 1, 7)
    let noteNumber;
    let noteName;
    if (isMinor) {
        noteNumber = Math.floor(percent * NOTES_BLACK_INDEXES);
        noteName = NOTES_BLACK[noteNumber];
    } else {
        noteNumber = Math.floor(percent * NOTES_WHITE_INDEXES);
        noteName = NOTES_WHITE[noteNumber];
    }
    // here is where we need to do our majic
    // const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
    // play a note from bank (this is the same for every octave?)
    // const noteNumber = Math.floor( percent * (BANKS.length-1) )
    // console.log("Creating note", {percent, octave, isMinor, noteNumber, noteName} )
    // const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
    // const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
    // const noteNumber = Math.floor( lipPercentage * (INSTRUMENT_NAMES.length-1) )
    // const noteName = NOTE_NAMES[noteNumber]
    // just in case the note name is not found?
    return `${noteName}${(0, _maths.clamp)(octave, 1, 7)}`;
// return noteName ? `${noteName}${clamp(octave, 1, 7)}` : `A0`
};
const getNoteSound = (percent, isMinor = false)=>SOLFEGE_SCALE[Math.floor(percent * (SOLFEGE_SCALE.length - 1))];
const getFriendlyNoteName = (noteName)=>NOTE_FRIENDLY_NAME_MAP[noteName] || noteName;
const convertNoteNameToMIDINoteNumber = (name)=>NOTE_NAME_MAP[name];
const convertMIDINoteNumberToName = (note)=>GENERAL_MIDI_INSTRUMENTS[note];
const noteNumberToFrequencyFast = (0, _utils.memoize)(noteNumberToFrequency);
const L = Math.log(2);
const frequencyToNoteNumber = (f)=>{
    const log = Math.log(f / 440) / L;
    return Math.round(12 * log + 69);
} // MIDI_NOTE_NAMES.forEach( note => 
 // 	console.error("convertNoteNameToMIDINoteNumber", note, convertNoteNameToMIDINoteNumber(note) , {NOTE_NAMES, NOTE_NAME_MAP, MIDI_NOTE_NAMES} ) 
 // )
 // console.error("NOTE_NAMES", NOTE_NAMES )
 // console.error("NOTE_NAMES_FRIENDLY", NOTE_NAMES_FRIENDLY )
 // console.error("MIDI_NOTE_NAMES", MIDI_NOTE_NAMES )
 // // console.error("MIDI_NOTE_FREQUENCIES", MIDI_NOTE_FREQUENCIES )
 // console.error("MIDI_NOTE_NUMBERS", MIDI_NOTE_NUMBERS )
 // console.error("NOTE_FRIENDLY_NAME_MAP", NOTE_FRIENDLY_NAME_MAP )
 // console.error("MIDI_NOTE_FRIENDLY_NAMES", MIDI_NOTE_FRIENDLY_NAMES )
 // console.error("MIDI_NOTE_NUMBER_MAP", MIDI_NOTE_NUMBER_MAP )
 // console.error("NOTE_NAME_MAP", NOTE_NAME_MAP  )
 // console.error("MIDI", { NOTES_ALPHABETICAL, CHROMATIC, CONVERSION_NOTES, MIDI_NOTE_NUMBERS, MIDI_CONVERTOR })
 // console.error({GENERAL_MIDI_INSTRUMENTS, NOTES_ALPHABETICAL, MIDI_NOTE_NUMBERS, MIDI_NOTE_NUMBER_MAP, NOTE_NAME_MAP, NOTE_NAMES,NOTE_FRIENDLY_NAME_MAP, NOTE_NAMES_FRIENDLY})
;

},{"../maths/maths":"k8Pg1","../utils":"cf6Af","@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"k8Pg1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TAU", ()=>TAU);
parcelHelpers.export(exports, "HALF_PI", ()=>HALF_PI);
parcelHelpers.export(exports, "TWO_PI", ()=>TWO_PI);
parcelHelpers.export(exports, "range", ()=>range);
parcelHelpers.export(exports, "rangeRounded", ()=>rangeRounded);
parcelHelpers.export(exports, "rescale", ()=>rescale);
parcelHelpers.export(exports, "determineAngle", ()=>determineAngle);
parcelHelpers.export(exports, "distance3D", ()=>distance3D);
parcelHelpers.export(exports, "distance2D", ()=>distance2D);
parcelHelpers.export(exports, "hypoteneuse2D", ()=>hypoteneuse2D);
parcelHelpers.export(exports, "hypoteneuse3D", ()=>hypoteneuse3D);
parcelHelpers.export(exports, "add3D", ()=>add3D);
parcelHelpers.export(exports, "subtract3D", ()=>subtract3D);
parcelHelpers.export(exports, "multiply3D", ()=>multiply3D);
parcelHelpers.export(exports, "cross3D", ()=>cross3D);
parcelHelpers.export(exports, "divide3D", ()=>divide3D);
parcelHelpers.export(exports, "lerp", ()=>lerp);
parcelHelpers.export(exports, "clamp", ()=>clamp);
parcelHelpers.export(exports, "twist", ()=>twist);
parcelHelpers.export(exports, "round", ()=>round);
const TAU = 2 * Math.PI;
const HALF_PI = Math.PI * 0.5;
const TWO_PI = Math.PI * 2;
const { PI, sqrt, atan2, tan } = Math;
const range = (input, inputMin, inputMax, outputMin, outputMax)=>{
    const value = (input - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
    if (value < outputMin) return outputMin;
    else if (value > outputMax) return outputMax;
    return value;
};
const rangeRounded = (input, inputMin, inputMax, outputMin, outputMax)=>{
    const value = Math.round((input - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin);
    if (value < outputMin) return outputMin;
    else if (value > outputMax) return outputMax;
    return value;
};
const rescale = (smallest = 0, largest = 1)=>{
    // find the scale and create a method that allows 
    // you to simply rescale at will
    const fullRange = 1 / (largest - smallest);
    // return a method that you can pass a value to
    return (value)=>fullRange * (value - smallest);
};
const determineAngle = (pointA, pointB)=>{
    // work out the lengths of the known edges
    const oppositeLength = pointA.y - pointB.y;
    const adjacentLength = pointB.x - pointA.x;
    const angleInRadians = atan2(oppositeLength, adjacentLength);
    // process?
    return angleInRadians;
};
const distance3D = (aX, bX, aY, bY, aZ, bZ)=>sqrt((aX - bX) ** 2 + (aY - bY) ** 2 + (aZ - bZ) ** 2);
const distance2D = (aX, aY, bX, bY)=>sqrt((aX - bX) ** 2 + (aY - bY) ** 2);
const hypoteneuse2D = (pointA, pointB)=>sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
const hypoteneuse3D = (pointA, pointB)=>sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2 + (pointA.z - pointB.z) ** 2);
const add3D = (a, b, output = {})=>{
    output.x = a.x + b.x;
    output.y = a.y + b.y;
    output.z = a.z + b.z;
    return output;
};
const subtract3D = (a, b, output = {})=>{
    output.x = a.x - b.x;
    output.y = a.y - b.y;
    output.z = a.z - b.z;
    return output;
};
const multiply3D = (a, b, output = {})=>{
    output.x = a.x * b.x;
    output.y = a.y * b.y;
    output.z = a.z * b.z;
    return output;
};
const cross3D = (a, b, output = {})=>{
    output.x = a.y * b.z - a.z * b.y;
    output.y = a.z * b.x - a.x * b.z;
    output.z = a.x * b.y - a.y * b.x;
    return output;
};
const divide3D = (a, b, output = {})=>{
    output.x = a.x / b.x;
    output.y = a.y / b.y;
    output.z = a.z / b.z;
    return output;
};
const lerp = (start, end, amt)=>(1 - amt) * start + amt * end;
const clamp = (val, min, max)=>val > max ? max : val < min ? min : val;
const twist = (value, amount = 0)=>{
    // if it is negative, invert
    if (value < 0) value = (value + 1) * -1;
    else value = 1 - value;
    //return value + amount
    return clamp(value + amount, -1, 1);
};
const round = (somenum)=>{
    // With a bitwise or.
    return 0.5 + somenum | 0;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}],"cf6Af":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "convertOptionToObject", ()=>convertOptionToObject);
parcelHelpers.export(exports, "debounce", ()=>debounce);
parcelHelpers.export(exports, "memoize", ()=>memoize);
parcelHelpers.export(exports, "injectJavascript", ()=>injectJavascript);
parcelHelpers.export(exports, "b64ToUint6", ()=>b64ToUint6);
parcelHelpers.export(exports, "uint6ToB64", ()=>uint6ToB64);
parcelHelpers.export(exports, "decodeBase64", ()=>decodeBase64);
parcelHelpers.export(exports, "base64DecToArr", ()=>base64DecToArr);
parcelHelpers.export(exports, "base64EncArr", ()=>base64EncArr);
parcelHelpers.export(exports, "UTF8ArrToStr", ()=>UTF8ArrToStr);
parcelHelpers.export(exports, "strToUTF8Arr", ()=>strToUTF8Arr);
parcelHelpers.export(exports, "toBytes", ()=>toBytes);
parcelHelpers.export(exports, "toVarLenBytes", ()=>toVarLenBytes);
const convertOptionToObject = (items)=>items.reduce((accumulator, current)=>{
        const c = current.split(":");
        accumulator[c[0]] = parseFloat(c[1]);
        return accumulator;
    }, {});
const debounce = (callback, wait)=>{
    let timerId;
    return (...args)=>{
        //console.error(args, "debounce", arguments)
        clearTimeout(timerId);
        timerId = setTimeout(()=>callback(...args), wait);
        return timerId;
    };
};
const memoize = (method)=>{
    // store outputs and inputs
    const cache = new Map();
    // takes same args as the method
    return (...args)=>{
        // check to see if we have a cached entry
        if (cache.has(args)) return cache.get(args);
        const result = method.apply(undefined, args);
        cache.set(args, result);
        return result;
    };
};
const injectJavascript = async (url)=>new Promise((resolve, reject)=>{
        const script = document.createElement("script");
        script.onload = ()=>{
            resolve(url);
        };
        script.onerror = (error)=>{
            reject(error);
        };
        script.src = url;
        document.head.appendChild(script);
    // console.error("injecting JS", url , script)
    });
const b64ToUint6 = (nChr)=>{
    return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
};
const uint6ToB64 = (nUint6)=>{
    return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
};
const decodeBase64 = (sBase64, nBlocksSize)=>{
    const sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
    const nInLen = sB64Enc.length;
    const nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
    const taBytes = new Uint8Array(nOutLen);
    for(let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++){
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
            for(nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++)taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
            nUint24 = 0;
        }
    }
    return taBytes;
};
const base64DecToArr = (sBase64, nBlocksSize)=>{
    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);
    for(var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++){
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
            for(nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++)taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
            nUint24 = 0;
        }
    }
    return taBytes;
};
const base64EncArr = (aBytes)=>{
    let nMod3 = 2, sB64Enc = "";
    for(var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++){
        nMod3 = nIdx % 3;
        if (nIdx > 0 && nIdx * 4 / 3 % 76 === 0) sB64Enc += "\r\n";
        nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
        if (nMod3 === 2 || aBytes.length - nIdx === 1) {
            sB64Enc += String.fromCodePoint(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
            nUint24 = 0;
        }
    }
    return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==");
};
const UTF8ArrToStr = (aBytes)=>{
    let sView = "";
    for(var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++){
        nPart = aBytes[nIdx];
        sView += String.fromCodePoint(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */ /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */ (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */ (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */ (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */ (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */ (nPart - 192 << 6) + aBytes[++nIdx] - 128 : /* nPart < 127 ? */ /* one byte */ nPart);
    }
    return sView;
};
const strToUTF8Arr = (sDOMStr)=>{
    var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;
    /* mapping... */ for(var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++){
        nChr = sDOMStr.codePointAt(nMapIdx);
        if (nChr > 65536) nMapIdx++;
        nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
    }
    aBytes = new Uint8Array(nArrLen);
    /* transcription... */ for(var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++){
        nChr = sDOMStr.codePointAt(nChrIdx);
        if (nChr < 128) /* one byte */ aBytes[nIdx++] = nChr;
        else if (nChr < 0x800) {
            /* two bytes */ aBytes[nIdx++] = 192 + (nChr >>> 6);
            aBytes[nIdx++] = 128 + (nChr & 63);
        } else if (nChr < 0x10000) {
            /* three bytes */ aBytes[nIdx++] = 224 + (nChr >>> 12);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
        } else if (nChr < 0x200000) {
            /* four bytes */ aBytes[nIdx++] = 240 + (nChr >>> 18);
            aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        } else if (nChr < 0x4000000) {
            /* five bytes */ aBytes[nIdx++] = 248 + (nChr >>> 24);
            aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        } else /* if (nChr <= 0x7fffffff) */ {
            /* six bytes */ aBytes[nIdx++] = 252 + (nChr >>> 30);
            aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        }
    }
    return aBytes;
};
const toBytes = (number, byteCount)=>{
    const bytes = new Array(byteCount);
    for(let i = byteCount - 1; i >= 0; i--){
        bytes[i] = number & 255;
        number >>= 8;
    }
    return bytes;
};
const toVarLenBytes = (number)=>{
    const bytes = [];
    let last = true;
    do {
        const partial_value = number & 127;
        number >>= 7;
        if (last) {
            // first bit is off for last byte
            bytes.unshift(partial_value);
            last = false;
        } else // set first bit on for all other bytes
        bytes.unshift(partial_value | 128);
    }while (number > 0);
    return bytes;
} /* Array of bytes to Base64 string decoding */  // export const b64ToUint6 = (nChr) => {
 // 	return nChr > 64 && nChr < 91 ?
 // 		nChr - 65
 // 	  : nChr > 96 && nChr < 123 ?
 // 		nChr - 71
 // 	  : nChr > 47 && nChr < 58 ?
 // 		nChr + 4
 // 	  : nChr === 43 ?
 // 		62
 // 	  : nChr === 47 ?
 // 		63
 // 	  :
 // 		0;
 //   }  
 /**
 * 
const a2b = (a) => {
	let b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length
	for (b = 0; 64 > b; b++){
		e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b
	}
	for (c = 0; j > c; c++){
		for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) {
			((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d))
		}
	}
	return h
}
 */ ;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fn8Fk"}]},["hhz2G","hQi3F"], "hQi3F", "parcelRequireaaed")

//# sourceMappingURL=midi-file-load.worker.7c310859.js.map
