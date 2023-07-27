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
})({"adx77":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "88037bc0399edeb0";
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

},{}],"ha8HP":[function(require,module,exports) {
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _threeJs = require("three/src/Three.js");
// import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
// this just uses Parcel to bundle the file locally
// and stores the URL that the file is available  in the plugin constant
//- import pluginURL from 'url:./audio/wam2/simple/index.js'
var _sdk = require("@webaudiomodules/sdk");
var _indexJs = require("./audio/wam2/simple/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
// import WAM2Instrument from "./audio/instruments/instrument.wam2.js"
// import simplePluginURI from "url:./audio/wam2/simple/index.js"
// import simplePluginURI from "worklet:./audio/wam2/simple/index.js"
// console.error("WAM:", simplePluginURI)
// import samplerPluginURI from "url:./audio/wam2/sampler/index.js"
// import samplerPluginURI from "worklet:./audio/wam2/sampler/index.js"
// import synthWAMPlugin from "./audio/wam2-external/tinySynth/src/index.js"	
// import synthWAMPlugin from "./audio/wam2-external/synth101/src/index.tsx"	
// import synthWAMPlugin from "url:./audio/wam2-external/WamExample/src/index.js"	
var _c3Mp3 = require("url:/dist/assets/audio/Fatboy/bright_acoustic_piano-mp3/C3.mp3");
var _c3Mp3Default = parcelHelpers.interopDefault(_c3Mp3);
var _samplerWorkletJs = require("worklet:./audio/worklets/sampler.worklet.js");
var _samplerWorkletJsDefault = parcelHelpers.interopDefault(_samplerWorkletJs);
// TESTING
// import createAppInterface from './interface-test.js'
let initialised = false;
let currentPluginAudioNode;
const createAudioProcessor = async (audioContext)=>{
    try {
        await audioContext.audioWorklet.addModule((0, _samplerWorkletJsDefault.default));
    } catch (e) {
        console.error("Audio Processor failed", e);
        return null;
    }
    return new AudioWorkletNode(audioContext, "sampler-processor");
};
const create = async (audioContext)=>{
    // Create a wrapped WAM
    // const wam = new WAM2Instrument( audioContext, audioContext.destination, {wamURL:simplePluginURI} )
    // console.log("Creating wam", {wam, simplePluginURI} )
    // load main plugin file
    // const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
    const { default: simpleWAMPlugin } = await require("d766385467863dd3");
    const { default: pingPongDelayWAMPlugin } = await require("81e0e9f245a51273");
    const { default: samplerWAMPlugin } = await require("23e051bdcca14189");
    const [hostGroupId] = await (0, _sdk.initializeWamHost)(audioContext);
    // You can can optionally specify additional information such as the initial state 
    // Create a new instance of the plugin, equivalent to :
    // const wam = new WAM(audioCtx);
    // await wam.initialize(initialState);
    console.log("Creating WAM Instruments...", {
        hostGroupId,
        simpleWAMPlugin
    });
    const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {});
    console.log("Created simplePlugin Instrument", {
        simplePlugin
    });
    // const pingPongDelayPlugin = await pingPongDelayWAMPlugin.createInstance(hostGroupId, audioContext, {})
    // console.log("Created pingPongDelayPlugin Instrument", { pingPongDelayPlugin} )
    const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {});
    console.log("Created samplerPlugin Instrument", {
        samplerPlugin,
        audioSample: (0, _c3Mp3Default.default)
    });
    const sample = await samplerPlugin.audioNode.loadAudio((0, _c3Mp3Default.default));
    samplerPlugin.audioNode.play(sample);
    const sampleRaw = await samplerPlugin.audioNode.loadAudioArrayBuffer((0, _c3Mp3Default.default));
    const cpu = await createAudioProcessor(audioContext);
    console.log("Created Audio Worklet", {
        cpu,
        audioSample: (0, _c3Mp3Default.default),
        sample,
        sampleRaw
    });
    if (!cpu) // now worklet availability :(
    console.error("FAILED Audio Worklet", {
        cpu
    });
    else cpu.port.postMessage("load");
    // GUI -----------------------------------------------------
    // Now Locate the HTMLElement for controlling playback
    const player = document.querySelector("#player");
    // Tie the UI into the HTML
    const mediaElementSource = audioContext.createMediaElementSource(player);
    // Very simple function to connect the plugin audionode to the host
    const connectPlugin = (context, inputNode, plugin)=>{
        const pluginNode = plugin.audioNode;
        const masterGain = new GainNode(context);
        // grab the onscreen streaming media item
        // connect the source to plugin
        // const simpleGainPluginAudioNode = simplePlugin.getAudioNode()
        inputNode.connect(plugin.audioNode);
        // simpleGainPluginAudioNode.connect(audioContext.destination);
        pluginNode.connect(masterGain);
        // pingPongDelayPlugin.audioNode.connect(output.destination)
        // now connect our final node to the audioContext output
        masterGain.connect(context.destination);
        console.log("Creating Media source", {
            context,
            inputNode,
            plugin
        });
        // return the audio node within the plugin
        return pluginNode;
    };
    // Very simple function to append the plugin root dom node to the host
    const mountPlugin = (domNode)=>{
        mount.innerHtml = "";
        mount.appendChild(domNode);
    };
    // create a data object that contains the full state of the plugin
    const downloadState = async ()=>{
        let state = await pluginInstance.audioNode.getState();
        const blob = new Blob([
            JSON.stringify(state, undefined, 2)
        ]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "state.json";
        link.click();
    };
    // plugins AudioNodes are bypassed by default.
    // pingPongDelayPlugin.setState({ enabled: true })
    // instance.audioNode is the plugin WebAudio node (native, AudioWorklet or
    // Composite). It can then be connected to the WebAudio graph.
    // then create the GUI
    //- const pluginDomNode = await pingPongDelayPlugin.createGui()
    //- for example
    //- document.appendChild(pluginDomNode)
    //currentPluginAudioNode = connectPlugin( audioContext, mediaElementSource, simplePlugin )
    currentPluginAudioNode = connectPlugin(audioContext, mediaElementSource, samplerPlugin);
    // now watch for events from the media player on screen
    player.onplay = async (event)=>{
        event.preventDefault();
        // audio context must be resumed because browser restrictions
        await audioContext.resume();
        console.log("Playing back audio with fx", event, {
            player,
            mediaElementSource
        });
    };
    const noteOn = (noteNumber = 74, velocity = 100)=>{
        //console.error("currentPluginAudioNode", currentPluginAudioNode )
        currentPluginAudioNode.noteOn(noteNumber, velocity);
        // currentPluginAudioNode.scheduleEvents({ 
        // 	type: 'wam-midi', 
        // 	time: audioContext.currentTime, 
        // 	data: { bytes: new Uint8Array([0x90, noteNumber, velocity]) } 
        // })
        currentPluginAudioNode.play(sample);
    };
    const noteOff = (noteNumber = 74, velocity = 100)=>{
        //console.error("currentPluginAudioNode", currentPluginAudioNode )
        currentPluginAudioNode.noteOff(noteNumber, velocity);
    // currentPluginAudioNode.scheduleEvents({ 
    // 	type: 'wam-midi', 
    // 	time: audioContext.currentTime + 0.25, 
    // 	data: { bytes: new Uint8Array([0x80, noteNumber, velocity]) } 
    // })
    };
    // player.play()
    console.log("Creating WAM Plugin", {
        player,
        currentPluginAudioNode,
        mediaElementSource
    });
    // play the thing with different inputs!
    window.addEventListener("keydown", (event)=>{
        const keyNumber = parseInt(event.key);
        const isNumber = !isNaN(keyNumber);
        const focussedElement = document.activeElement;
        if (isNumber) noteOn(keyNumber * 10);
        else noteOn(Math.random() * 100 >> 0);
    });
    window.addEventListener("keyup", (event)=>{
        const keyNumber = parseInt(event.key);
        const isNumber = !isNaN(keyNumber);
        const focussedElement = document.activeElement;
        if (isNumber) noteOff(keyNumber * 10);
    });
};
const init = async ()=>{
    if (initialised) return;
    initialised = true;
    // make the URL relative...
    //- let testURL = pluginURL.split("?")[0]
    //- testURL = testURL.replace("http://localhost:909/", "")
    //- const wamURL = new URL(testURL, import.meta.url)
    // Safari...
    const AudioContext1 = window.AudioContext || window.webkitAudioContext || false;
    if (AudioContext1) {
        const context = new AudioContext1({
            latencyHint: "playback"
        });
        await create(context);
        //- console.log(import.meta, "plugin URL", {pluginURL, testURL, wamURL})
        console.log("Plugin created?");
    } else console.error("No Audio Engine on this browser ;(");
/*
	const config = LookingGlassConfig
	config.tileHeight = 512
	config.numViews = 45
	config.targetY = 0
	config.targetZ = 0
	config.targetDiam = 3
	config.fovy = (14 * Math.PI) / 180
	new LookingGlassWebXRPolyfill()

	const scene = new THREE.Scene()

	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(2, 0.1, 0.1),
		new THREE.MeshStandardMaterial({ color: "red" })
	)

	scene.add(cube)

	scene.add(new THREE.AmbientLight(0xaaaaaa))
	const directionalLight = new THREE.DirectionalLight(0xffffff)
	directionalLight.position.set(3, 3, 3)
	scene.add(directionalLight)

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	document.body.append(renderer.domElement)
	renderer.xr.enabled = true

	const camera = new THREE.PerspectiveCamera()
	camera.position.z = 3

	renderer.setAnimationLoop(() => {
		cube.rotation.z += 0.01
		cube.rotation.x += 0.02
		renderer.render(scene, camera)
	});

	document.body.append(VRButton.createButton(renderer))

	function resize() {
		renderer.setSize(innerWidth, innerHeight)
		camera.aspect = innerWidth / innerHeight
		camera.updateProjectionMatrix()
	}
	resize()
	window.addEventListener("resize", resize)
	*/ };
const test = async ()=>{
    const audioContext = new AudioContext({
        latencyHint: "playback"
    });
    const [hostGroupId] = await (0, _sdk.initializeWamHost)(audioContext);
    const { default: simpleWAMPlugin } = await require("14d611b395755332");
    // const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
    // const [hostGroupId] = await initializeWamHost(audioContext)
    // const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
    // console.log("Created simplePlugin Instrument", {simplePlugin} )
    // We need to determine the correct transformer to use
    // as we do *not* want this to be transpiled and transpiling it is breaking it
    // bundle-text:
    // data-url:
    // url:	- causes file read error as uses file://
    // const { default: synthWAMPlugin } = await import("url:./audio/wam2-external/tinySynth/src/index.js")
    // const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
    const synthPlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {});
// const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
// const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
};
// Required to start any kind of audio interaction & playback
document.addEventListener("click", init, {
    once: true
}) // document.addEventListener("click", test, {once:true})
;

},{"three/src/Three.js":"aH4hF","@webaudiomodules/sdk":"eCmgf","./audio/wam2/simple/index.js":"jM1kG","url:/dist/assets/audio/Fatboy/bright_acoustic_piano-mp3/C3.mp3":"9a4Ug","worklet:./audio/worklets/sampler.worklet.js":"gmAgL","d766385467863dd3":"idyE4","81e0e9f245a51273":"cuaoB","23e051bdcca14189":"9UDX4","14d611b395755332":"fCn1T","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jM1kG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _sdk = require("@webaudiomodules/sdk");
// import ParamMgrFactory from '@webaudiomodules/sdk-parammgr/'
var _paramMgrFactoryJs = require("@webaudiomodules/sdk-parammgr/src/ParamMgrFactory.js");
var _paramMgrFactoryJsDefault = parcelHelpers.interopDefault(_paramMgrFactoryJs);
// import ParamMgrFactory from '@webaudiomodules/sdk-parammgr/src/ParamMgrFactory.js'
// import { ParamMgrFactory } from '@webaudiomodules/sdk-parammgr/src/index.js'
var _simpleWamJs = require("./simple.wam.js");
// _baseUrl = getBaseUrl(new URL('./descriptor.json', import.meta.url));
var _descriptorJson = require("url:./descriptor.json");
var _descriptorJsonDefault = parcelHelpers.interopDefault(_descriptorJson);
var _descriptorJson1 = require("./descriptor.json");
var _descriptorJsonDefault1 = parcelHelpers.interopDefault(_descriptorJson1);
const NAME = "simple";
const getBaseUrl = (relativeUrl)=>relativeUrl.substring(0, relativeUrl.lastIndexOf("/"));
class SimplePlugin extends (0, _sdk.WebAudioModule) {
    // _baseURL = getBasetUrl(new URL('.', import.meta.url));
    // check to see if it running via import or not...
    _baseUrl = getBaseUrl((0, _descriptorJsonDefault.default));
    // _baseUrl = getBaseUrl(new URL('./', import.meta.url).href)
    _descriptorUrl = (0, _descriptorJsonDefault.default // `${this._baseUrl}/wam2/${NAME}/descriptor.json`
    );
    _descriptor = (0, _descriptorJsonDefault1.default);
    _templateUrl = `${this._baseUrl}/wam2/${NAME}/template.html`;
    /**
	 * Overide and intercept the descriptor file
	 * @param {Object} initialState 
	 * @returns 
	 */ async initialize(initialState) {
        // we embed the JSON so no need to fetch JSON
        // await this._loadDescriptor()
        const templateRes = await fetch(this._templateUrl);
        this.templateHtmlStr = await templateRes.text();
        initialState;
        return super.initialize(initialState);
    }
    /**
	 * The plugin redefines the async method createAudionode()
	 * that must return an <Audionode>
	 * @param {Object} options 
	 * @returns Audionode
	 */ async createAudioNode(initialState) {
        // this.moduleId
        const node = (0, _simpleWamJs.createSimpleEngine)(this.audioContext, this._descriptor, initialState);
        const internalParamsConfig = {
            gain: 1
        };
        // NB. REQUIRES internalID set in descriptor
        const paramMgrNode = await (0, _paramMgrFactoryJsDefault.default).create(this, {
            internalParamsConfig
        });
        // node.setup(paramMgrNode)
        node.setup(paramMgrNode);
        // if (initialState){ 
        // 	node.setState(initialState)
        // }
        return node;
    }
    /**
	 * Make a front end available to all apps
	 * this should be a combination of parameters
	 * that align with the parameters of the synthesizzer
	 * 
	 * @returns HTMLElement
	 */ async createGui() {
    // return createElement(this)
    }
}
exports.default = SimplePlugin;

},{"@webaudiomodules/sdk":"eCmgf","@webaudiomodules/sdk-parammgr/src/ParamMgrFactory.js":"2iqA7","./simple.wam.js":"6Yea5","url:./descriptor.json":"h6cwM","./descriptor.json":"WpFV3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2iqA7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _addFunctionModuleJs = require("./sdk/src/addFunctionModule.js");
var _addFunctionModuleJsDefault = parcelHelpers.interopDefault(_addFunctionModuleJs);
var _paramMgrProcessorJs = require("./ParamMgrProcessor.js");
var _paramMgrProcessorJsDefault = parcelHelpers.interopDefault(_paramMgrProcessorJs);
var _paramConfiguratorJs = require("./ParamConfigurator.js");
var _paramConfiguratorJsDefault = parcelHelpers.interopDefault(_paramConfiguratorJs);
var _paramMgrNodeJs = require("./ParamMgrNode.js");
var _paramMgrNodeJsDefault = parcelHelpers.interopDefault(_paramMgrNodeJs);
class ParamMgrFactory {
    /**
	 * @param {WebAudioModule} module
	 * @param {ParametersMappingConfiguratorOptions} [optionsIn = {}]
	 */ static async create(module, optionsIn = {}) {
        const { audioContext, moduleId } = module;
        const instanceId = optionsIn.instanceId || module.instanceId;
        const groupId = optionsIn.groupId || module.groupId;
        const { paramsConfig, paramsMapping, internalParamsConfig } = new (0, _paramConfiguratorJsDefault.default)(optionsIn);
        const initialParamsValue = Object.entries(paramsConfig).reduce((currentParams, [name, { defaultValue }])=>{
            currentParams[name] = defaultValue;
            return currentParams;
        }, {});
        const serializableParamsConfig = Object.entries(paramsConfig).reduce((currentParams, [name, { id, label, type, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units }])=>{
            currentParams[name] = {
                id,
                label,
                type,
                defaultValue,
                minValue,
                maxValue,
                discreteStep,
                exponent,
                choices,
                units
            };
            return currentParams;
        }, {});
        console.error("TESTING", {
            module,
            worklet: audioContext.audioWorklet,
            processor: (0, _paramMgrProcessorJsDefault.default),
            moduleId,
            serializableParamsConfig
        });
        await (0, _addFunctionModuleJsDefault.default)(audioContext.audioWorklet, (0, _paramMgrProcessorJsDefault.default), moduleId, serializableParamsConfig);
        /** @type {ParamMgrOptions} */ const options = {
            internalParamsConfig,
            parameterData: initialParamsValue,
            processorOptions: {
                paramsConfig,
                paramsMapping,
                internalParamsMinValues: Object.values(internalParamsConfig).map((config)=>Math.max(0, config?.minValue || 0)),
                internalParams: Object.keys(internalParamsConfig),
                groupId,
                instanceId,
                moduleId
            }
        };
        const node = new (0, _paramMgrNodeJsDefault.default)(module, options);
        await node.initialize();
        return node;
    }
}
exports.default = ParamMgrFactory;

},{"./sdk/src/addFunctionModule.js":"bHn9n","./ParamMgrProcessor.js":"kNeow","./ParamConfigurator.js":"h6tlU","./ParamMgrNode.js":"gxCtI","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bHn9n":[function(require,module,exports) {
/**
 * Take a function, stringify it and inject to an AudioWorklet with parameters.
 *
 * @param {AudioWorklet} audioWorklet
 * @param {(...args: any[]) => any} processorFunction
 * @param {any[]} [injection]
 * @returns {Promise<void>}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const addFunctionModule = (audioWorklet, processorFunction, ...injection)=>{
    const text = `(${processorFunction.toString()})(${injection.map((s)=>JSON.stringify(s)).join(", ")});`;
    const url = URL.createObjectURL(new Blob([
        text
    ], {
        type: "text/javascript"
    }));
    return audioWorklet.addModule(url);
};
exports.default = addFunctionModule;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
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

},{}],"kNeow":[function(require,module,exports) {
/** @typedef {import('@webaudiomodules/api').WamProcessor} WamProcessor */ /** @typedef {import('@webaudiomodules/api').WamParameterInfoMap} WamParameterInfoMap */ /** @typedef {import('@webaudiomodules/api').WamParameterDataMap} WamParameterValueMap */ /** @typedef {import('@webaudiomodules/api').WamEvent} WamEvent */ /** @typedef {import('./types').ParamMgrOptions} ParamMgrProcessorOptions */ /** @typedef {import('./TypedAudioWorklet').AudioWorkletGlobalScope} AudioWorkletGlobalScope */ /** @typedef {import('./TypedAudioWorklet').TypedAudioWorkletProcessor} AudioWorkletProcessor */ /** @template M @typedef {import('./types').MessagePortRequest<M>} MessagePortRequest */ /** @template M @typedef {import('./types').MessagePortResponse<M>} MessagePortResponse */ /** @typedef {import('./types').ParamMgrCallFromProcessor} ParamMgrCallFromProcessor */ /** @typedef {import('./types').ParamMgrCallToProcessor} ParamMgrCallToProcessor */ /** @typedef {import('./types').ParamMgrAudioWorkletOptions} ParamMgrAudioWorkletOptions */ /** @typedef {import('./types').ParametersMapping} ParametersMapping */ /** @typedef {import('./types').WamParamMgrSDKBaseModuleScope} WamParamMgrSDKBaseModuleScope */ /**
 * Main function to stringify as a worklet.
 *
 * @param {string} moduleId processor identifier
 * @param {WamParameterInfoMap} paramsConfig parameterDescriptors
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const processor = (moduleId, paramsConfig)=>{
    /** @type {AudioWorkletGlobalScope} */ // @ts-ignore
    const audioWorkletGlobalScope = globalThis;
    const { AudioWorkletProcessor, registerProcessor, webAudioModules } = audioWorkletGlobalScope;
    /** @type {WamParamMgrSDKBaseModuleScope} */ const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    const supportSharedArrayBuffer = !!globalThis.SharedArrayBuffer;
    const SharedArrayBuffer = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
    const normExp = (x, e)=>e === 0 ? x : x ** 1.5 ** -e;
    const normalizeE = (x, min, max, e = 0)=>min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
    const normalize = (x, min, max)=>min === 0 && max === 1 ? x : (x - min) / (max - min) || 0;
    const denormalize = (x, min, max)=>min === 0 && max === 1 ? x : x * (max - min) + min;
    const mapValue = (x, eMin, eMax, sMin, sMax, tMin, tMax)=>denormalize(normalize(normalize(Math.min(sMax, Math.max(sMin, x)), eMin, eMax), normalize(sMin, eMin, eMax), normalize(sMax, eMin, eMax)), tMin, tMax);
    /**
	 * @typedef {MessagePortRequest<ParamMgrCallToProcessor> & MessagePortResponse<ParamMgrCallFromProcessor>} MsgIn
	 * @typedef {MessagePortResponse<ParamMgrCallToProcessor> & MessagePortRequest<ParamMgrCallFromProcessor>} MsgOut
	 */ /**
	 * `ParamMgrNode`'s `AudioWorkletProcessor`
	 *
	 * @extends {AudioWorkletProcessor<MsgIn, MsgOut>}
	 * @implements {WamProcessor}
	 * @implements {ParamMgrCallToProcessor}
	 */ class ParamMgrProcessor extends AudioWorkletProcessor {
        static get parameterDescriptors() {
            return Object.entries(paramsConfig).map(([name, { defaultValue, minValue, maxValue }])=>({
                    name,
                    defaultValue,
                    minValue,
                    maxValue
                }));
        }
        /**
		 * @param {ParamMgrProcessorOptions} options
		 */ constructor(options){
            super();
            this.destroyed = false;
            this.supportSharedArrayBuffer = supportSharedArrayBuffer;
            const { paramsMapping, internalParamsMinValues, internalParams, groupId, instanceId } = options.processorOptions;
            this.groupId = groupId;
            this.moduleId = moduleId;
            this.instanceId = instanceId;
            this.internalParamsMinValues = internalParamsMinValues;
            this.paramsConfig = paramsConfig;
            this.paramsMapping = paramsMapping;
            /** @type {Record<string, number>} */ this.paramsValues = {};
            Object.entries(paramsConfig).forEach(([name, { defaultValue }])=>{
                this.paramsValues[name] = defaultValue;
            });
            this.internalParams = internalParams;
            this.internalParamsCount = this.internalParams.length;
            this.buffer = new SharedArrayBuffer((this.internalParamsCount + 1) * Float32Array.BYTES_PER_ELEMENT);
            this.$lock = new Int32Array(this.buffer, 0, 1);
            this.$internalParamsBuffer = new Float32Array(this.buffer, 4, this.internalParamsCount);
            /** @type {WamEvent[]} */ this.eventQueue = [];
            /** @type {(event: WamEvent) => any} */ this.handleEvent = null;
            audioWorkletGlobalScope.webAudioModules.addWam(this);
            if (!ModuleScope.paramMgrProcessors) ModuleScope.paramMgrProcessors = {};
            ModuleScope.paramMgrProcessors[this.instanceId] = this;
            this.messagePortRequestId = -1;
            /** @type {Record<number, ((...args: any[]) => any)>} */ const resolves = {};
            /** @type {Record<number, ((...args: any[]) => any)>} */ const rejects = {};
            /**
			 * @param {keyof ParamMgrCallFromProcessor} call
			 * @param {any} args
			 */ this.call = (call, ...args)=>new Promise((resolve, reject)=>{
                    const id = this.messagePortRequestId--;
                    resolves[id] = resolve;
                    rejects[id] = reject;
                    this.port.postMessage({
                        id,
                        call,
                        args
                    });
                });
            this.handleMessage = ({ data })=>{
                const { id, call, args, value, error } = data;
                if (call) {
                    /** @type {any} */ const r = {
                        id
                    };
                    try {
                        r.value = this[call](...args);
                    } catch (e) {
                        r.error = e;
                    }
                    this.port.postMessage(r);
                } else {
                    if (error) rejects[id]?.(error);
                    else resolves[id]?.(value);
                    delete resolves[id];
                    delete rejects[id];
                }
            };
            this.port.start();
            this.port.addEventListener("message", this.handleMessage);
        }
        /**
		 * @param {ParametersMapping} mapping
		 */ setParamsMapping(mapping) {
            this.paramsMapping = mapping;
        }
        getBuffer() {
            return {
                lock: this.$lock,
                paramsBuffer: this.$internalParamsBuffer
            };
        }
        getCompensationDelay() {
            return 128;
        }
        /**
		 * @param {string[]} parameterIdQuery
		 */ getParameterInfo(...parameterIdQuery) {
            if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
            /** @type {WamParameterInfoMap} */ const parameterInfo = {};
            parameterIdQuery.forEach((parameterId)=>{
                parameterInfo[parameterId] = this.paramsConfig[parameterId];
            });
            return parameterInfo;
        }
        /**
		 * @param {boolean} [normalized]
		 * @param {string[]} parameterIdQuery
		 */ getParameterValues(normalized, ...parameterIdQuery) {
            if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
            /** @type {WamParameterValueMap} */ const parameterValues = {};
            parameterIdQuery.forEach((parameterId)=>{
                if (!(parameterId in this.paramsValues)) return;
                const { minValue, maxValue, exponent } = this.paramsConfig[parameterId];
                const value = this.paramsValues[parameterId];
                parameterValues[parameterId] = {
                    id: parameterId,
                    value: normalized ? normalizeE(value, minValue, maxValue, exponent) : value,
                    normalized
                };
            });
            return parameterValues;
        }
        /**
		 * @param {WamEvent[]} events
		 */ scheduleEvents(...events) {
            this.eventQueue.push(...events);
            const { currentTime } = audioWorkletGlobalScope;
            this.eventQueue.sort((a, b)=>(a.time || currentTime) - (b.time || currentTime));
        }
        /**
		 * @param {WamEvent[]} events
		 */ emitEvents(...events) {
            webAudioModules.emitEvents(this, ...events);
        }
        clearEvents() {
            this.eventQueue = [];
        }
        lock() {
            if (globalThis.Atomics) Atomics.store(this.$lock, 0, 1);
        }
        unlock() {
            if (globalThis.Atomics) Atomics.store(this.$lock, 0, 0);
        }
        /**
		 * Main process
		 *
		 * @param {Float32Array[][]} inputs
		 * @param {Float32Array[][]} outputs
		 * @param {Record<string, Float32Array>} parameters
		 */ process(inputs, outputs, parameters) {
            if (this.destroyed) return false;
            const outputOffset = 1;
            this.lock();
            Object.entries(this.paramsConfig).forEach(([name, { minValue, maxValue }])=>{
                const raw = parameters[name];
                if (name in this.paramsValues) this.paramsValues[name] = raw[raw.length - 1]; // Store to local temporary
                if (!this.paramsMapping[name]) return; // No need to output
                Object.entries(this.paramsMapping[name]).forEach(([targetName, targetMapping])=>{
                    const j = this.internalParams.indexOf(targetName);
                    if (j === -1) return;
                    const intrinsicValue = this.internalParamsMinValues[j]; // Output will be added to target intrinsicValue
                    const { sourceRange, targetRange } = targetMapping;
                    const [sMin, sMax] = sourceRange;
                    const [tMin, tMax] = targetRange;
                    let out;
                    if (minValue !== tMin || maxValue !== tMax || minValue !== sMin || maxValue !== sMax) out = raw.map((v)=>{
                        const mappedValue = mapValue(v, minValue, maxValue, sMin, sMax, tMin, tMax);
                        return mappedValue - intrinsicValue;
                    });
                    else if (intrinsicValue) out = raw.map((v)=>v - intrinsicValue);
                    else out = raw;
                    if (out.length === 1) outputs[j + outputOffset][0].fill(out[0]);
                    else outputs[j + outputOffset][0].set(out);
                    this.$internalParamsBuffer[j] = out[0];
                });
            });
            this.unlock();
            if (!this.supportSharedArrayBuffer) this.call("setBuffer", {
                lock: this.$lock,
                paramsBuffer: this.$internalParamsBuffer
            });
            const { currentTime } = audioWorkletGlobalScope;
            let $event;
            for($event = 0; $event < this.eventQueue.length; $event++){
                const event = this.eventQueue[$event];
                if (event.time && event.time > currentTime) break;
                if (typeof this.handleEvent === "function") this.handleEvent(event);
                this.call("dispatchWamEvent", event);
            }
            if ($event) this.eventQueue.splice(0, $event);
            return true;
        }
        /**
		 * @param {string} wamInstanceId
		 * @param {number} [output]
		 */ connectEvents(wamInstanceId, output) {
            webAudioModules.connectEvents(this.groupId, this.instanceId, wamInstanceId, output);
        }
        /**
		 * @param {string} [wamInstanceId]
		 * @param {number} [output]
		 */ disconnectEvents(wamInstanceId, output) {
            if (typeof wamInstanceId === "undefined") {
                webAudioModules.disconnectEvents(this.groupId, this.instanceId);
                return;
            }
            webAudioModules.disconnectEvents(this.groupId, this.instanceId, wamInstanceId, output);
        }
        destroy() {
            audioWorkletGlobalScope.webAudioModules.removeWam(this);
            if (ModuleScope.paramMgrProcessors) delete ModuleScope.paramMgrProcessors[this.instanceId];
            this.destroyed = true;
            this.port.close();
        }
    }
    try {
        registerProcessor(moduleId, ParamMgrProcessor);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
    }
};
exports.default = processor;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h6tlU":[function(require,module,exports) {
/** @typedef {import('@webaudiomodules/api').WamParameterConfiguration} WamParameterConfiguration */ /** @typedef {import('@webaudiomodules/api').WamParameterInfoMap} WamParameterInfoMap */ /** @typedef {import('./types').ParametersMapping} ParametersMapping */ /** @typedef {import('./types').InternalParametersDescriptor} InternalParametersDescriptor */ /** @typedef {import('./types').ParametersMappingConfiguratorOptions} ParametersMappingConfiguratorOptions */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _wamParameterInfoJs = require("./sdk/src/WamParameterInfo.js");
var _wamParameterInfoJsDefault = parcelHelpers.interopDefault(_wamParameterInfoJs);
const WamParameterInfo = (0, _wamParameterInfoJsDefault.default)();
class ParamMappingConfigurator {
    /**
	 * @param {ParametersMappingConfiguratorOptions} [options = {}]
	 */ constructor(options = {}){
        const { paramsConfig, paramsMapping, internalParamsConfig } = options;
        this._paramsConfig = paramsConfig;
        this._paramsMapping = paramsMapping;
        this._internalParamsConfig = internalParamsConfig;
    }
    /**
	 * @private
	 * @type {Record<string, WamParameterConfiguration>}
	 */ _paramsConfig = undefined;
    /**
	 * Auto-completed `paramsConfig`:
	 *
	 * if no `paramsConfig` is defined while initializing, this will be be filled from the internalParamsConfig;
	 *
	 * if a parameter is not fully configured, the incompleted properties will have the same value as in the internalParamsConfig.
	 *
	 * @type {WamParameterInfoMap}
	 */ get paramsConfig() {
        const { internalParamsConfig } = this;
        return Object.entries(this._paramsConfig || internalParamsConfig).reduce((configs, [id, config])=>{
            const internalParam = internalParamsConfig[id];
            configs[id] = new WamParameterInfo(id, {
                ...config,
                label: config.label ?? id,
                defaultValue: config.defaultValue ?? internalParam?.defaultValue,
                minValue: config.minValue ?? internalParam?.minValue,
                maxValue: config.maxValue ?? internalParam?.maxValue
            });
            return configs;
        }, {});
    }
    /**
	 * @private
	 * @type {InternalParametersDescriptor}
	 */ _internalParamsConfig = undefined;
    /**
	 * Auto-completed configuration of the `internalParamsConfig`
	 *
	 * Internal Parameters Config contains all the automatable parameters' information.
	 *
	 * An automatable parameter could be a `WebAudio` `AudioParam`
	 * or a config with an `onChange` callback that will be called while the value has been changed.
	 *
	 * @type {InternalParametersDescriptor}
	 */ get internalParamsConfig() {
        return Object.entries(this._internalParamsConfig || {}).reduce((configs, [name, config])=>{
            if (config instanceof AudioParam) configs[name] = config;
            else {
                const defaultConfig = {
                    minValue: 0,
                    maxValue: 1,
                    defaultValue: 0,
                    automationRate: 30
                };
                configs[name] = {
                    ...defaultConfig,
                    ...config
                };
            }
            return configs;
        }, {});
    }
    /**
	 * @private
	 * @type {ParametersMapping}
	 */ _paramsMapping = {};
    /**
	 * Auto-completed `paramsMapping`,
	 * the mapping can be omitted while initialized,
	 * but is useful when an exposed param (in the `paramsConfig`) should automate
	 * several internal params (in the `internalParamsConfig`) or has a different range there.
	 *
	 * If a parameter is present in both `paramsConfig` and `internalParamsConfig` (or the `paramsConfig` is not configured),
	 * a map of this parameter will be there automatically, if not declared explicitly.
	 *
	 * @type {ParametersMapping}
	 */ get paramsMapping() {
        const declared = this._paramsMapping || {};
        const externalParams = this.paramsConfig;
        const internalParams = this.internalParamsConfig;
        return Object.entries(externalParams).reduce((mapping, [name, { minValue, maxValue }])=>{
            const sourceRange = [
                minValue,
                maxValue
            ];
            const defaultMapping = {
                sourceRange,
                targetRange: [
                    ...sourceRange
                ]
            };
            if (declared[name]) {
                const declaredTargets = Object.entries(declared[name]).reduce((targets, [targetName, targetMapping])=>{
                    if (internalParams[targetName]) targets[targetName] = {
                        ...defaultMapping,
                        ...targetMapping
                    };
                    return targets;
                }, {});
                mapping[name] = declaredTargets;
            } else if (internalParams[name]) mapping[name] = {
                [name]: {
                    ...defaultMapping
                }
            };
            return mapping;
        }, {});
    }
}
exports.default = ParamMappingConfigurator;

},{"./sdk/src/WamParameterInfo.js":"3k68i","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3k68i":[function(require,module,exports) {
/** @typedef {import('@webaudiomodules/api').WamParameterInfo} IWamParameterInfo */ /** @typedef {typeof import('@webaudiomodules/api').WamParameterInfo} WamParameterInfoConstructor */ /** @typedef {import('@webaudiomodules/api').WamParameterType} WamParameterType */ /** @typedef {import('@webaudiomodules/api').WamParameterConfiguration} WamParameterConfiguration */ /** @typedef {import('@webaudiomodules/api').AudioWorkletGlobalScope} AudioWorkletGlobalScope */ /** @typedef {import('./types').WamSDKBaseModuleScope} WamSDKBaseModuleScope */ /**
 * @param {string} [moduleId]
 * @returns {WamParameterInfoConstructor}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const getWamParameterInfo = (moduleId)=>{
    /** @type {AudioWorkletGlobalScope} */ // @ts-ignore
    const audioWorkletGlobalScope = globalThis;
    /**
	 * @param {number} x
	 * @param {number} e
	 */ const normExp = (x, e)=>e === 0 ? x : x ** 1.5 ** -e;
    /**
	 * @param {number} x
	 * @param {number} e
	 */ const denormExp = (x, e)=>e === 0 ? x : x ** 1.5 ** e;
    /**
	 * @param {number} x
	 * @param {number} min
	 * @param {number} max
	 */ const normalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
    /**
	 * @param {any} x
	 * @param {number} min
	 * @param {number} max
	 */ const denormalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
    /**
	 * @param {number} x
	 * @param {number} min
	 * @param {number} max
	 */ const inRange = (x, min, max)=>x >= min && x <= max;
    /**
	 * @implements {IWamParameterInfo}
	 */ class WamParameterInfo {
        /**
		 * @param {string} id
		 * @param {WamParameterConfiguration} [config]
		 */ constructor(id, config = {}){
            let { type, label, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units } = config;
            if (type === undefined) type = "float";
            if (label === undefined) label = "";
            if (defaultValue === undefined) defaultValue = 0;
            if (choices === undefined) choices = [];
            if (type === "boolean" || type === "choice") {
                discreteStep = 1;
                minValue = 0;
                if (choices.length) maxValue = choices.length - 1;
                else maxValue = 1;
            } else {
                if (minValue === undefined) minValue = 0;
                if (maxValue === undefined) maxValue = 1;
                if (discreteStep === undefined) discreteStep = 0;
                if (exponent === undefined) exponent = 0;
                if (units === undefined) units = "";
            }
            const errBase = `Param config error | ${id}: `;
            if (minValue >= maxValue) throw Error(errBase.concat("minValue must be less than maxValue"));
            if (!inRange(defaultValue, minValue, maxValue)) throw Error(errBase.concat("defaultValue out of range"));
            if (discreteStep % 1 || discreteStep < 0) throw Error(errBase.concat("discreteStep must be a non-negative integer"));
            else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) throw Error(errBase.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
            if (type === "choice" && !choices.length) throw Error(errBase.concat("choice type parameter requires list of strings in choices"));
            /**
			 * The parameter's unique identifier.
			 * @readonly @type {string}
			 */ this.id = id;
            /**
			 * The parameter's human-readable name.
			 * @readonly @type {string}
			 */ this.label = label;
            /**
			 * The parameter's data type.
			 * @readonly @type {WamParameterType}
			 */ this.type = type;
            /**
			 * The parameter's default value. Must be
			 * within range `[minValue, maxValue]`.
			 * @readonly @type {number}
			 */ this.defaultValue = defaultValue;
            /**
			 * The minimum valid value of the parameter's range.
			 * @readonly @type {number}
			 */ this.minValue = minValue;
            /**
			 * The maximum valid value of the parameter's range.
			 * @readonly @type {number}
			 */ this.maxValue = maxValue;
            /**
			 * The distance between adjacent valid integer
			 * values, if applicable.
			 * @readonly @type {number}
			 */ this.discreteStep = discreteStep;
            /**
			 * The nonlinear (exponential) skew of the parameter's
			 * range, if applicable.
			 *  @readonly @type {number}
			 */ this.exponent = exponent;
            /**
			 * A list of human-readable choices corresponding to each
			 * valid integer value in the parameter's range, if applicable.
			 * @readonly @type {string[]}
			 */ this.choices = choices;
            /**
			 * A human-readable string representing the units of the
			 * parameter's range, if applicable.
			 * @readonly @type {string}
			 */ this.units = units;
        }
        /**
		 * Convert a value from the parameter's denormalized range
		 * `[minValue, maxValue]` to normalized range `[0, 1]`.
		 * @param {number} value
		 */ normalize(value) {
            return normalize(value, this.minValue, this.maxValue, this.exponent);
        }
        /**
		 * Convert a value from normalized range `[0, 1]` to the
		 * parameter's denormalized range `[minValue, maxValue]`.
		 * @param {number} valueNorm
		 */ denormalize(valueNorm) {
            return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
        }
        /**
		 * Get a human-readable string representing the given value,
		 * including units if applicable.
		 * @param {number} value
		 */ valueString(value) {
            if (this.choices) return this.choices[value];
            if (this.units !== "") return `${value} ${this.units}`;
            return `${value}`;
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        /** @type {WamSDKBaseModuleScope} */ const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamParameterInfo) ModuleScope.WamParameterInfo = WamParameterInfo;
    }
    return WamParameterInfo;
};
exports.default = getWamParameterInfo;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gxCtI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _mgrAudioParamJs = require("./MgrAudioParam.js");
var _mgrAudioParamJsDefault = parcelHelpers.interopDefault(_mgrAudioParamJs);
/** @typedef {import('@webaudiomodules/api').WebAudioModule} WebAudioModule */ /** @typedef {import('@webaudiomodules/api').WamNode} WamNode */ /** @typedef {import('@webaudiomodules/api').WamParameterDataMap} WamParameterValueMap */ /** @typedef {import('@webaudiomodules/api').WamEvent} WamEvent */ /** @typedef {import('@webaudiomodules/api').WamAutomationEvent} WamAutomationEvent */ /** @typedef {import('./types').ParamMgrOptions} ParamMgrOptions */ /** @typedef {import('./types').ParamMgrCallFromProcessor} ParamMgrCallFromProcessor */ /** @typedef {import('./types').ParamMgrCallToProcessor} ParamMgrCallToProcessor */ /** @typedef {import('./types').ParamMgrNodeMsgIn} ParamMgrNodeMsgIn */ /** @typedef {import('./types').ParamMgrNodeMsgOut} ParamMgrNodeMsgOut */ /** @typedef {import('./types').ParamMgrNode} IParamMgrNode */ /** @type {typeof import('./TypedAudioWorklet').TypedAudioWorkletNode} */ // @ts-ignore
const AudioWorkletNode = globalThis.AudioWorkletNode;
class ParamMgrNode extends AudioWorkletNode {
    /**
     * @param {WebAudioModule} module
     * @param {ParamMgrOptions} options
     */ constructor(module, options){
        super(module.audioContext, module.moduleId, {
            numberOfInputs: 0,
            numberOfOutputs: 1 + options.processorOptions.internalParams.length,
            parameterData: options.parameterData,
            processorOptions: options.processorOptions
        });
        const { processorOptions, internalParamsConfig } = options;
        this.initialized = false;
        this.module = module;
        this.instanceId = options.processorOptions.instanceId;
        this.groupId = options.processorOptions.groupId;
        this.paramsConfig = processorOptions.paramsConfig;
        this.internalParams = processorOptions.internalParams;
        this.internalParamsConfig = internalParamsConfig;
        this.$prevParamsBuffer = new Float32Array(this.internalParams.length);
        this.paramsUpdateCheckFn = [];
        this.paramsUpdateCheckFnRef = [];
        this.messageRequestId = 0;
        Object.entries(this.getParams()).forEach(([name, param])=>{
            Object.setPrototypeOf(param, (0, _mgrAudioParamJsDefault.default).prototype);
            param._info = this.paramsConfig[name];
        });
        /** @type {Record<number, ((...args: any[]) => any)>} */ const resolves = {};
        /** @type {Record<number, ((...args: any[]) => any)>} */ const rejects = {};
        /**
		 * @param {keyof ParamMgrCallToProcessor} call
		 * @param {any} args
		 */ this.call = (call, ...args)=>{
            const id = this.messageRequestId;
            this.messageRequestId += 1;
            return new Promise((resolve, reject)=>{
                resolves[id] = resolve;
                rejects[id] = reject;
                this.port.postMessage({
                    id,
                    call,
                    args
                });
            });
        };
        this.handleMessage = ({ data })=>{
            const { id, call, args, value, error } = data;
            if (call) {
                /** @type {any} */ const r = {
                    id
                };
                try {
                    r.value = this[call](...args);
                } catch (e) {
                    r.error = e;
                }
                this.port.postMessage(r);
            } else {
                if (error) rejects[id]?.(error);
                else resolves[id]?.(value);
                delete resolves[id];
                delete rejects[id];
            }
        };
        this.port.start();
        this.port.addEventListener("message", this.handleMessage);
    }
    /**
	 * @returns {ReadonlyMap<string, MgrAudioParam>}
	 */ get parameters() {
        // @ts-ignore
        return super.parameters;
    }
    get moduleId() {
        return this.module.moduleId;
    }
    async initialize() {
        /** @type {ReturnType<ParamMgrCallToProcessor['getBuffer']>} */ const response = await this.call("getBuffer");
        const { lock, paramsBuffer } = response;
        this.$lock = lock;
        this.$paramsBuffer = paramsBuffer;
        const offset = 1;
        Object.entries(this.internalParamsConfig).forEach(([name, config], i)=>{
            if (this.context.state === "suspended") this.$paramsBuffer[i] = config.defaultValue;
            if (config instanceof AudioParam) try {
                config.automationRate = "a-rate";
            // eslint-disable-next-line no-empty
            } catch  {} finally{
                config.value = Math.max(0, config.minValue);
                this.connect(config, offset + i);
            }
            else if (config instanceof AudioNode) this.connect(config, offset + i);
            else this.requestDispatchIParamChange(name);
        });
        this.connect(this.module.audioContext.destination, 0, 0);
        this.initialized = true;
        return this;
    }
    /**
	 * @param {ReturnType<ParamMgrCallToProcessor['getBuffer']>} buffer
	 */ setBuffer({ lock, paramsBuffer }) {
        this.$lock = lock;
        this.$paramsBuffer = paramsBuffer;
    }
    setParamsMapping(paramsMapping) {
        return this.call("setParamsMapping", paramsMapping);
    }
    getCompensationDelay() {
        return this.call("getCompensationDelay");
    }
    getParameterInfo(...parameterIdQuery) {
        return this.call("getParameterInfo", ...parameterIdQuery);
    }
    getParameterValues(normalized, ...parameterIdQuery) {
        return this.call("getParameterValues", normalized, ...parameterIdQuery);
    }
    /**
	 * @param {WamAutomationEvent} event
	 */ scheduleAutomation(event) {
        const time = event.time || this.context.currentTime;
        const { id, normalized, value } = event.data;
        const audioParam = this.getParam(id);
        if (!audioParam) return;
        if (audioParam.info.type === "float") {
            if (normalized) audioParam.linearRampToNormalizedValueAtTime(value, time);
            else audioParam.linearRampToValueAtTime(value, time);
        } else // eslint-disable-next-line no-lonely-if
        if (normalized) audioParam.setNormalizedValueAtTime(value, time);
        else audioParam.setValueAtTime(value, time);
    }
    /**
	 * @param {WamEvent[]} events
	 */ scheduleEvents(...events) {
        events.forEach((event)=>{
            if (event.type === "wam-automation") this.scheduleAutomation(event);
        });
        this.call("scheduleEvents", ...events);
    }
    /**
	 * @param {WamEvent[]} events
	 */ emitEvents(...events) {
        this.call("emitEvents", ...events);
    }
    clearEvents() {
        this.call("clearEvents");
    }
    /**
	 * @param {WamEvent} event
	 */ dispatchWamEvent(event) {
        if (event.type === "wam-automation") this.scheduleAutomation(event);
        else this.dispatchEvent(new CustomEvent(event.type, {
            detail: event
        }));
    }
    /**
	 * @param {WamParameterValueMap} parameterValues
	 */ async setParameterValues(parameterValues) {
        Object.keys(parameterValues).forEach((parameterId)=>{
            const parameterUpdate = parameterValues[parameterId];
            const parameter = this.parameters.get(parameterId);
            if (!parameter) return;
            if (!parameterUpdate.normalized) parameter.value = parameterUpdate.value;
            else parameter.normalizedValue = parameterUpdate.value;
        });
    }
    async getState() {
        return this.getParamsValues();
    }
    async setState(state) {
        this.setParamsValues(state);
    }
    convertTimeToFrame(time) {
        return Math.round(time * this.context.sampleRate);
    }
    convertFrameToTime(frame) {
        return frame / this.context.sampleRate;
    }
    /**
	 * @param {string} name
	 */ requestDispatchIParamChange = (name)=>{
        const config = this.internalParamsConfig[name];
        if (!("onChange" in config)) return;
        const { automationRate, onChange } = config;
        if (typeof automationRate !== "number" || !automationRate) return;
        const interval = 1000 / automationRate;
        const i = this.internalParams.indexOf(name);
        if (i === -1) return;
        if (i >= this.internalParams.length) return;
        if (typeof this.paramsUpdateCheckFnRef[i] === "number") window.clearTimeout(this.paramsUpdateCheckFnRef[i]);
        this.paramsUpdateCheckFn[i] = ()=>{
            const prev = this.$prevParamsBuffer[i];
            const cur = this.$paramsBuffer[i];
            if (cur !== prev) {
                onChange(cur, prev);
                this.$prevParamsBuffer[i] = cur;
            }
            this.paramsUpdateCheckFnRef[i] = window.setTimeout(this.paramsUpdateCheckFn[i], interval);
        };
        this.paramsUpdateCheckFn[i]();
    };
    /**
	 * @param {string} name
	 */ getIParamIndex(name) {
        const i = this.internalParams.indexOf(name);
        return i === -1 ? null : i;
    }
    /**
	 * @param {string} name
	 * @param {AudioParam | AudioNode} dest
	 * @param {number} index
	 */ connectIParam(name, dest, index) {
        const offset = 1;
        const i = this.getIParamIndex(name);
        if (i !== null) {
            if (dest instanceof AudioNode) {
                if (typeof index === "number") this.connect(dest, offset + i, index);
                else this.connect(dest, offset + i);
            } else this.connect(dest, offset + i);
        }
    }
    /**
	 * @param {string} name
	 * @param {AudioParam | AudioNode} dest
	 * @param {number} index
	 */ disconnectIParam(name, dest, index) {
        const offset = 1;
        const i = this.getIParamIndex(name);
        if (i !== null) {
            if (dest instanceof AudioNode) {
                if (typeof index === "number") this.disconnect(dest, offset + i, index);
                else this.disconnect(dest, offset + i);
            } else this.disconnect(dest, offset + i);
        }
    }
    getIParamValue(name) {
        const i = this.getIParamIndex(name);
        return i !== null ? this.$paramsBuffer[i] : null;
    }
    getIParamsValues() {
        /** @type {Record<string, number>} */ const values = {};
        this.internalParams.forEach((name, i)=>{
            values[name] = this.$paramsBuffer[i];
        });
        return values;
    }
    getParam(name) {
        return this.parameters.get(name) || null;
    }
    getParams() {
        // @ts-ignore
        return Object.fromEntries(this.parameters);
    }
    getParamValue(name) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.value;
    }
    setParamValue(name, value) {
        const param = this.parameters.get(name);
        if (!param) return;
        param.value = value;
    }
    getParamsValues() {
        /** @type {Record<string, number>} */ const values = {};
        this.parameters.forEach((v, k)=>{
            values[k] = v.value;
        });
        return values;
    }
    /**
	 * @param {Record<string, number>} values
	 */ setParamsValues(values) {
        if (!values) return;
        Object.entries(values).forEach(([k, v])=>{
            this.setParamValue(k, v);
        });
    }
    getNormalizedParamValue(name) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.normalizedValue;
    }
    setNormalizedParamValue(name, value) {
        const param = this.parameters.get(name);
        if (!param) return;
        param.normalizedValue = value;
    }
    getNormalizedParamsValues() {
        const values = {};
        this.parameters.forEach((v, k)=>{
            values[k] = this.getNormalizedParamValue(k);
        });
        return values;
    }
    setNormalizedParamsValues(values) {
        if (!values) return;
        Object.entries(values).forEach(([k, v])=>{
            this.setNormalizedParamValue(k, v);
        });
    }
    setParamValueAtTime(name, value, startTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setValueAtTime(value, startTime);
    }
    setNormalizedParamValueAtTime(name, value, startTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setNormalizedValueAtTime(value, startTime);
    }
    linearRampToParamValueAtTime(name, value, endTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.linearRampToValueAtTime(value, endTime);
    }
    linearRampToNormalizedParamValueAtTime(name, value, endTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.linearRampToNormalizedValueAtTime(value, endTime);
    }
    exponentialRampToParamValueAtTime(name, value, endTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.exponentialRampToValueAtTime(value, endTime);
    }
    exponentialRampToNormalizedParamValueAtTime(name, value, endTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.exponentialRampToNormalizedValueAtTime(value, endTime);
    }
    setParamTargetAtTime(name, target, startTime, timeConstant) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setTargetAtTime(target, startTime, timeConstant);
    }
    setNormalizedParamTargetAtTime(name, target, startTime, timeConstant) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setNormalizedTargetAtTime(target, startTime, timeConstant);
    }
    setParamValueCurveAtTime(name, values, startTime, duration) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setValueCurveAtTime(values, startTime, duration);
    }
    setNormalizedParamValueCurveAtTime(name, values, startTime, duration) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.setNormalizedValueCurveAtTime(values, startTime, duration);
    }
    cancelScheduledParamValues(name, cancelTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.cancelScheduledValues(cancelTime);
    }
    cancelAndHoldParamAtTime(name, cancelTime) {
        const param = this.parameters.get(name);
        if (!param) return null;
        return param.cancelAndHoldAtTime(cancelTime);
    }
    /**
	 * @param {string} toId
	 * @param {number} [output]
	 */ connectEvents(toId, output) {
        this.call("connectEvents", toId, output);
    }
    /**
	 * @param {string} [toId]
	 * @param {number} [output]
	 */ disconnectEvents(toId, output) {
        this.call("disconnectEvents", toId, output);
    }
    async destroy() {
        this.disconnect();
        this.paramsUpdateCheckFnRef.forEach((ref)=>{
            if (typeof ref === "number") window.clearTimeout(ref);
        });
        await this.call("destroy");
        this.port.close();
    }
}
exports.default = ParamMgrNode;

},{"./MgrAudioParam.js":"am5PQ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"am5PQ":[function(require,module,exports) {
/** @typedef {import('@webaudiomodules/api').WamParameter} WamParameter */ /** @typedef {import('@webaudiomodules/api').WamParameterInfo} WamParameterInfo */ /**
 * @extends {AudioParam}
 * @implements {WamParameter}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class MgrAudioParam extends AudioParam {
    get exponent() {
        return this.info.exponent;
    }
    /**
	 * @type {WamParameterInfo}
	 */ _info = undefined;
    get info() {
        return this._info;
    }
    set info(info) {
        this._info = info;
    }
    set normalizedValue(valueIn) {
        this.value = this.info.denormalize(valueIn);
    }
    get normalizedValue() {
        return this.info.normalize(this.value);
    }
    setValueAtTime(value, startTime) {
        return super.setValueAtTime(value, startTime);
    }
    setNormalizedValueAtTime(valueIn, startTime) {
        const value = this.info.denormalize(valueIn);
        return this.setValueAtTime(value, startTime);
    }
    linearRampToValueAtTime(value, endTime) {
        return super.linearRampToValueAtTime(value, endTime);
    }
    linearRampToNormalizedValueAtTime(valueIn, endTime) {
        const value = this.info.denormalize(valueIn);
        return this.linearRampToValueAtTime(value, endTime);
    }
    exponentialRampToValueAtTime(value, endTime) {
        return super.exponentialRampToValueAtTime(value, endTime);
    }
    exponentialRampToNormalizedValueAtTime(valueIn, endTime) {
        const value = this.info.denormalize(valueIn);
        return this.exponentialRampToValueAtTime(value, endTime);
    }
    setTargetAtTime(target, startTime, timeConstant) {
        return super.setTargetAtTime(target, startTime, timeConstant);
    }
    setNormalizedTargetAtTime(targetIn, startTime, timeConstant) {
        const target = this.info.denormalize(targetIn);
        return this.setTargetAtTime(target, startTime, timeConstant);
    }
    setValueCurveAtTime(values, startTime, duration) {
        return super.setValueCurveAtTime(values, startTime, duration);
    }
    setNormalizedValueCurveAtTime(valuesIn, startTime, duration) {
        const values = Array.from(valuesIn).map((v)=>this.info.denormalize(v));
        return this.setValueCurveAtTime(values, startTime, duration);
    }
    cancelScheduledParamValues(cancelTime) {
        return super.cancelScheduledValues(cancelTime);
    }
    cancelAndHoldParamAtTime(cancelTime) {
        return super.cancelAndHoldAtTime(cancelTime);
    }
}
exports.default = MgrAudioParam;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6Yea5":[function(require,module,exports) {
// import CompositeAudioNode from '@webaudiomodules/sdk/'
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createSimpleEngine", ()=>createSimpleEngine);
var _sdkParammgr = require("@webaudiomodules/sdk-parammgr");
class SimpleExample extends (0, _sdkParammgr.CompositeAudioNode) {
    /**
	 * @type {ParamMgrNode}
	 */ _wamNode = undefined;
    isEnabled = true;
    get paramMgr() {
        return this._wamNode;
    }
    constructor(context, options){
        super(context, options);
        this.createNodes();
    }
    noteOn() {
        console.error("NOTE ON", arguments);
    }
    noteOff() {
        console.error("NOTE OFF", arguments);
    }
    // // The plugin redefines the async method createAudionode()
    // // that must return an <Audionode>
    // async createAudioNode(options) {
    // 	return this.wetGainNode
    // }
    /**
	 * Mandatory
	 * @param {ParamMgrNode} wamNode
	 */ setup(wamNode) {
        // FIXME:
        wamNode.addEventListener("wam-midi", (e)=>this.processMIDIEvents([
                {
                    event: e.detail.data.bytes,
                    time: 0
                }
            ]));
        this._wamNode = wamNode;
        this.connectNodes();
        this._output = this.outputNode;
        console.log("simple.wam CONSTRUCTOR SETUP", {
            wamNode,
            thiswamNode: this._wamNode
        });
    }
    /**
	 * mandatory, will create default input and output
	 */ createNodes() {
        this.outputNode = this.context.createGain();
        this.dryGainNode = this.context.createGain();
        this.wetGainNode = this.context.createGain();
        this.delayNode = this.context.createDelay(0.05);
        this.feedbackGainNode = this.context.createGain();
        this.channelMerger = this.context.createChannelMerger(2);
    }
    connectNodes() {
        super.connect(this.wetGainNode);
        super.connect(this.dryGainNode);
        this.wetGainNode.gain.value = 0.5;
        this.wetGainNode.connect(this.delayNode);
        this.delayNode.delayTime.value = 0.05;
        this.delayNode.connect(this.feedbackGainNode);
        this.feedbackGainNode.gain.value = 0.6;
        this.feedbackGainNode.connect(this.delayNode);
        //this.wetGainNode.connect(this.delayNode)
        this.feedbackGainNode.connect(this.wetGainNode);
        this.wetGainNode.connect(this.outputNode);
    // this.dryGainNode.connect(this.outputNode)
    // this.audioNode.connect(audioContext.destination)
    }
    set status(value) {
        // nothing to update
        if (this.isEnabled === value) return;
        this.isEnabled = value;
        if (this.isEnabled) {
            console.log("BYPASS MODE OFF FX RUNNING");
            this.wetGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5);
            this.dryGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
        // this.delayNode.gain.linearRampToValueAtTime(1200, this.context.currentTime + 0.5)
        } else {
            console.log("BYPASS MODE ON");
            this.wetGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
            this.dryGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5);
        // this.delayNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5)
        }
    }
    /**
	 * 
	 * @param {ScheduledMIDIEvent[]} midiEvents - ScheduledMIDIEvents
	 */ processMIDIEvents(midiEvents) {
        midiEvents.forEach((message)=>{
            if (message.event[0] == MIDI.NOTE_ON) {
                const midiNote = message.event[1];
                const velocity = message.event[2];
                if (velocity) this.noteOn(midiNote, message.time);
                else this.noteOff(midiNote, message.time);
            } else if (message.event[0] == MIDI.NOTE_OFF) {
                const midiNote = message.event[1];
                this.noteOff(midiNote, message.time);
            }
        });
    }
}
exports.default = SimpleExample;
const createSimpleEngine = (audioContext, descriptor, options)=>new SimpleExample(audioContext, options);

},{"@webaudiomodules/sdk-parammgr":"6mWq3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h6cwM":[function(require,module,exports) {
module.exports = require("41689e5d63c0416").getBundleURL("bFZPn") + "descriptor.3e2761d9.js" + "?" + Date.now();

},{"41689e5d63c0416":"lgJ39"}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ("" + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, "$1") + "/";
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ("" + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error("Origin not found");
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"WpFV3":[function(require,module,exports) {
module.exports = JSON.parse('{"name":"WamExample","identifier":"com.designerzen.simple","vendor":"designerzen","description":"Michel told me I should try this out","version":"1.0.0","apiVersion":"2.0.0","thumbnail":"screenshot.png","keywords":["ai","motion-capture","xr"],"website":"https://interface.place","isInstrument":true,"hasMidiInput":true,"hasAudioInput":true,"hasAudioOutput":true}');

},{}],"9a4Ug":[function(require,module,exports) {
module.exports = require("4699932584b7d518").getBundleURL("bFZPn") + "C3.66914d12.mp3" + "?" + Date.now();

},{"4699932584b7d518":"lgJ39"}],"gmAgL":[function(require,module,exports) {
module.exports = require("db9fc2d3c6eda42a").getBundleURL("bFZPn") + "sampler.worklet.b4739056.js" + "?" + Date.now();

},{"db9fc2d3c6eda42a":"lgJ39"}],"idyE4":[function(require,module,exports) {
module.exports = Promise.resolve(module.bundle.root("jM1kG"));

},{}],"cuaoB":[function(require,module,exports) {
module.exports = require("f072ccb991e1761c")(require("5e4d8207fa9e1d42").getBundleURL("bFZPn") + "pingpongdelay.aef003e8.js" + "?" + Date.now()).catch((err)=>{
    delete module.bundle.cache[module.id];
    throw err;
}).then(()=>module.bundle.root("IfR0e"));

},{"f072ccb991e1761c":"61B45","5e4d8207fa9e1d42":"lgJ39"}],"61B45":[function(require,module,exports) {
"use strict";
var cacheLoader = require("ca2a84f7fa4a3bb0");
module.exports = cacheLoader(function(bundle) {
    return new Promise(function(resolve, reject) {
        // Don't insert the same script twice (e.g. if it was already in the HTML)
        var existingScripts = document.getElementsByTagName("script");
        if ([].concat(existingScripts).some(function isCurrentBundle(script) {
            return script.src === bundle;
        })) {
            resolve();
            return;
        }
        var preloadLink = document.createElement("link");
        preloadLink.href = bundle;
        preloadLink.rel = "preload";
        preloadLink.as = "script";
        document.head.appendChild(preloadLink);
        var script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = bundle;
        script.onerror = function(e) {
            var error = new TypeError("Failed to fetch dynamically imported module: ".concat(bundle, ". Error: ").concat(e.message));
            script.onerror = script.onload = null;
            script.remove();
            reject(error);
        };
        script.onload = function() {
            script.onerror = script.onload = null;
            resolve();
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    });
});

},{"ca2a84f7fa4a3bb0":"j49pS"}],"j49pS":[function(require,module,exports) {
"use strict";
var cachedBundles = {};
var cachedPreloads = {};
var cachedPrefetches = {};
function getCache(type) {
    switch(type){
        case "preload":
            return cachedPreloads;
        case "prefetch":
            return cachedPrefetches;
        default:
            return cachedBundles;
    }
}
module.exports = function(loader, type) {
    return function(bundle) {
        var cache = getCache(type);
        if (cache[bundle]) return cache[bundle];
        return cache[bundle] = loader.apply(null, arguments).catch(function(e) {
            delete cache[bundle];
            throw e;
        });
    };
};

},{}],"9UDX4":[function(require,module,exports) {
module.exports = Promise.all([
    require("874fabea6afd4243")(require("90dabff6b8e57cf8").getBundleURL("bFZPn") + "sampler.e81f0e84.js" + "?" + Date.now()).catch((err)=>{
        delete module.bundle.cache[module.id];
        throw err;
    }),
    require("874fabea6afd4243")(require("90dabff6b8e57cf8").getBundleURL("bFZPn") + "sampler.2b3f2914.js" + "?" + Date.now()).catch((err)=>{
        delete module.bundle.cache[module.id];
        throw err;
    })
]).then(()=>module.bundle.root("iWRYu"));

},{"874fabea6afd4243":"61B45","90dabff6b8e57cf8":"lgJ39"}],"fCn1T":[function(require,module,exports) {
module.exports = import("./simple.fc873626.js?" + Date.now()).then(()=>module.bundle.root("9gsHW"));

},{}]},["adx77","ha8HP"], "ha8HP", "parcelRequireaaed")

//# sourceMappingURL=wam.399edeb0.js.map
