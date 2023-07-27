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
})({"8t7iA":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "71dd47dae81f0e84";
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

},{}],"6mWq3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CompositeAudioNode", ()=>CompositeAudioNode);
parcelHelpers.export(exports, "ParamMgrFactory", ()=>ParamMgrFactory);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __spreadValues = (a, b)=>{
    for(var prop in b || (b = {}))if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) {
        for (var prop of __getOwnPropSymbols(b))if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
};
var __spreadProps = (a, b)=>__defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value)=>{
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
};
// src/CompositeAudioNode.js
var CompositeAudioNode = class extends GainNode {
    constructor(){
        super(...arguments);
        /**
     * @type {AudioNode}
     */ __publicField(this, "_output");
        /**
     * @type {WamNode}
     */ __publicField(this, "_wamNode");
    }
    get groupId() {
        return this.module.groupId;
    }
    get moduleId() {
        return this.module.moduleId;
    }
    get instanceId() {
        return this.module.instanceId;
    }
    get module() {
        return this._wamNode.module;
    }
    /**
   * @param {Parameters<WamNode['addEventListener']>} args
   */ addEventListener(...args) {
        return this._wamNode.addEventListener(...args);
    }
    /**
   * @param {Parameters<WamNode['removeEventListener']>} args
   */ removeEventListener(...args) {
        return this._wamNode.removeEventListener(...args);
    }
    /**
   * @param {Parameters<WamNode['dispatchEvent']>} args
   */ dispatchEvent(...args) {
        return this._wamNode.dispatchEvent(...args);
    }
    /**
   * @param {Parameters<WamNode['getParameterInfo']>} args
   */ getParameterInfo(...args) {
        return this._wamNode.getParameterInfo(...args);
    }
    /**
   * @param {Parameters<WamNode['getParameterValues']>} args
   */ getParameterValues(...args) {
        return this._wamNode.getParameterValues(...args);
    }
    /**
   * @param {Parameters<WamNode['setParameterValues']>} args
   */ setParameterValues(...args) {
        return this._wamNode.setParameterValues(...args);
    }
    getState() {
        return this._wamNode.getState();
    }
    /**
   * @param {Parameters<WamNode['setState']>} args
   */ setState(...args) {
        return this._wamNode.setState(...args);
    }
    getCompensationDelay() {
        return this._wamNode.getCompensationDelay();
    }
    /**
   * @param {Parameters<WamNode['scheduleEvents']>} args
   */ scheduleEvents(...args) {
        return this._wamNode.scheduleEvents(...args);
    }
    clearEvents() {
        return this._wamNode.clearEvents();
    }
    /**
   * @param {Parameters<WamNode['connectEvents']>} args
   */ connectEvents(...args) {
        return this._wamNode.connectEvents(...args);
    }
    /**
   * @param {Parameters<WamNode['disconnectEvents']>} args
   */ disconnectEvents(...args) {
        return this._wamNode.disconnectEvents(...args);
    }
    destroy() {
        return this._wamNode.destroy();
    }
    set channelCount(count) {
        if (this._output) this._output.channelCount = count;
        else super.channelCount = count;
    }
    get channelCount() {
        if (this._output) return this._output.channelCount;
        return super.channelCount;
    }
    set channelCountMode(mode) {
        if (this._output) this._output.channelCountMode = mode;
        else super.channelCountMode = mode;
    }
    get channelCountMode() {
        if (this._output) return this._output.channelCountMode;
        return super.channelCountMode;
    }
    set channelInterpretation(interpretation) {
        if (this._output) this._output.channelInterpretation = interpretation;
        else super.channelInterpretation = interpretation;
    }
    get channelInterpretation() {
        if (this._output) return this._output.channelInterpretation;
        return super.channelInterpretation;
    }
    get numberOfInputs() {
        return super.numberOfInputs;
    }
    get numberOfOutputs() {
        if (this._output) return this._output.numberOfOutputs;
        return super.numberOfOutputs;
    }
    get gain() {
        return void 0;
    }
    connect(...args) {
        if (this._output && this._output !== this) return this._output.connect(...args);
        return super.connect(...args);
    }
    disconnect(...args) {
        if (this._output && this._output !== this) return this._output.disconnect(...args);
        return super.disconnect(...args);
    }
};
// src/sdk/src/addFunctionModule.js
var addFunctionModule = (audioWorklet, processorFunction, ...injection)=>{
    const text = `(${processorFunction.toString()})(${injection.map((s)=>JSON.stringify(s)).join(", ")});`;
    const url = URL.createObjectURL(new Blob([
        text
    ], {
        type: "text/javascript"
    }));
    return audioWorklet.addModule(url);
};
var addFunctionModule_default = addFunctionModule;
// src/ParamMgrProcessor.js
var processor = (moduleId, paramsConfig)=>{
    const audioWorkletGlobalScope = globalThis;
    const { AudioWorkletProcessor, registerProcessor, webAudioModules } = audioWorkletGlobalScope;
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    const supportSharedArrayBuffer = !!globalThis.SharedArrayBuffer;
    const SharedArrayBuffer = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
    const normExp = (x, e)=>e === 0 ? x : x ** 1.5 ** -e;
    const normalizeE = (x, min, max, e = 0)=>min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
    const normalize = (x, min, max)=>min === 0 && max === 1 ? x : (x - min) / (max - min) || 0;
    const denormalize = (x, min, max)=>min === 0 && max === 1 ? x : x * (max - min) + min;
    const mapValue = (x, eMin, eMax, sMin, sMax, tMin, tMax)=>denormalize(normalize(normalize(Math.min(sMax, Math.max(sMin, x)), eMin, eMax), normalize(sMin, eMin, eMax), normalize(sMax, eMin, eMax)), tMin, tMax);
    class ParamMgrProcessor extends AudioWorkletProcessor {
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
            this.paramsValues = {};
            Object.entries(paramsConfig).forEach(([name, { defaultValue }])=>{
                this.paramsValues[name] = defaultValue;
            });
            this.internalParams = internalParams;
            this.internalParamsCount = this.internalParams.length;
            this.buffer = new SharedArrayBuffer((this.internalParamsCount + 1) * Float32Array.BYTES_PER_ELEMENT);
            this.$lock = new Int32Array(this.buffer, 0, 1);
            this.$internalParamsBuffer = new Float32Array(this.buffer, 4, this.internalParamsCount);
            this.eventQueue = [];
            this.handleEvent = null;
            audioWorkletGlobalScope.webAudioModules.addWam(this);
            if (!ModuleScope.paramMgrProcessors) ModuleScope.paramMgrProcessors = {};
            ModuleScope.paramMgrProcessors[this.instanceId] = this;
            this.messagePortRequestId = -1;
            const resolves = {};
            const rejects = {};
            this.call = (call, ...args)=>new Promise((resolve, reject)=>{
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
                var _a, _b;
                const { id, call, args, value, error } = data;
                if (call) {
                    const r = {
                        id
                    };
                    try {
                        r.value = this[call](...args);
                    } catch (e) {
                        r.error = e;
                    }
                    this.port.postMessage(r);
                } else {
                    if (error) (_a = rejects[id]) == null || _a.call(rejects, error);
                    else (_b = resolves[id]) == null || _b.call(resolves, value);
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
            const parameterInfo = {};
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
            const parameterValues = {};
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
                if (name in this.paramsValues) this.paramsValues[name] = raw[raw.length - 1];
                if (!this.paramsMapping[name]) return;
                Object.entries(this.paramsMapping[name]).forEach(([targetName, targetMapping])=>{
                    const j = this.internalParams.indexOf(targetName);
                    if (j === -1) return;
                    const intrinsicValue = this.internalParamsMinValues[j];
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
        console.warn(error);
    }
};
var ParamMgrProcessor_default = processor;
// src/sdk/src/WamParameterInfo.js
var getWamParameterInfo = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    const normExp = (x, e)=>e === 0 ? x : x ** 1.5 ** -e;
    const denormExp = (x, e)=>e === 0 ? x : x ** 1.5 ** e;
    const normalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
    const denormalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
    const inRange = (x, min, max)=>x >= min && x <= max;
    class WamParameterInfo2 {
        /**
     * @param {string} id
     * @param {WamParameterConfiguration} [config]
     */ constructor(id, config = {}){
            let { type, label, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units } = config;
            if (type === void 0) type = "float";
            if (label === void 0) label = "";
            if (defaultValue === void 0) defaultValue = 0;
            if (choices === void 0) choices = [];
            if (type === "boolean" || type === "choice") {
                discreteStep = 1;
                minValue = 0;
                if (choices.length) maxValue = choices.length - 1;
                else maxValue = 1;
            } else {
                if (minValue === void 0) minValue = 0;
                if (maxValue === void 0) maxValue = 1;
                if (discreteStep === void 0) discreteStep = 0;
                if (exponent === void 0) exponent = 0;
                if (units === void 0) units = "";
            }
            const errBase = `Param config error | ${id}: `;
            if (minValue >= maxValue) throw Error(errBase.concat("minValue must be less than maxValue"));
            if (!inRange(defaultValue, minValue, maxValue)) throw Error(errBase.concat("defaultValue out of range"));
            if (discreteStep % 1 || discreteStep < 0) throw Error(errBase.concat("discreteStep must be a non-negative integer"));
            else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) throw Error(errBase.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
            if (type === "choice" && !choices.length) throw Error(errBase.concat("choice type parameter requires list of strings in choices"));
            this.id = id;
            this.label = label;
            this.type = type;
            this.defaultValue = defaultValue;
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.discreteStep = discreteStep;
            this.exponent = exponent;
            this.choices = choices;
            this.units = units;
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
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamParameterInfo) ModuleScope.WamParameterInfo = WamParameterInfo2;
    }
    return WamParameterInfo2;
};
var WamParameterInfo_default = getWamParameterInfo;
// src/ParamConfigurator.js
var WamParameterInfo = WamParameterInfo_default();
var ParamMappingConfigurator = class {
    /**
   * @param {ParametersMappingConfiguratorOptions} [options = {}]
   */ constructor(options = {}){
        /**
     * @private
     * @type {Record<string, WamParameterConfiguration>}
     */ __publicField(this, "_paramsConfig");
        /**
     * @private
     * @type {InternalParametersDescriptor}
     */ __publicField(this, "_internalParamsConfig");
        /**
     * @private
     * @type {ParametersMapping}
     */ __publicField(this, "_paramsMapping", {});
        const { paramsConfig, paramsMapping, internalParamsConfig } = options;
        this._paramsConfig = paramsConfig;
        this._paramsMapping = paramsMapping;
        this._internalParamsConfig = internalParamsConfig;
    }
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
            var _a, _b, _c, _d;
            const internalParam = internalParamsConfig[id];
            configs[id] = new WamParameterInfo(id, __spreadProps(__spreadValues({}, config), {
                label: (_a = config.label) != null ? _a : id,
                defaultValue: (_b = config.defaultValue) != null ? _b : internalParam == null ? void 0 : internalParam.defaultValue,
                minValue: (_c = config.minValue) != null ? _c : internalParam == null ? void 0 : internalParam.minValue,
                maxValue: (_d = config.maxValue) != null ? _d : internalParam == null ? void 0 : internalParam.maxValue
            }));
            return configs;
        }, {});
    }
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
                configs[name] = __spreadValues(__spreadValues({}, defaultConfig), config);
            }
            return configs;
        }, {});
    }
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
                    if (internalParams[targetName]) targets[targetName] = __spreadValues(__spreadValues({}, defaultMapping), targetMapping);
                    return targets;
                }, {});
                mapping[name] = declaredTargets;
            } else if (internalParams[name]) mapping[name] = {
                [name]: __spreadValues({}, defaultMapping)
            };
            return mapping;
        }, {});
    }
};
// src/MgrAudioParam.js
var MgrAudioParam = class extends AudioParam {
    constructor(){
        super(...arguments);
        /**
     * @type {WamParameterInfo}
     */ __publicField(this, "_info");
    }
    get exponent() {
        return this.info.exponent;
    }
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
};
// src/ParamMgrNode.js
var AudioWorkletNode = globalThis.AudioWorkletNode;
var ParamMgrNode = class extends AudioWorkletNode {
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
        /**
     * @param {string} name
     */ __publicField(this, "requestDispatchIParamChange", (name)=>{
            const config = this.internalParamsConfig[name];
            if (!("onChange" in config)) return;
            const { automationRate, onChange } = config;
            if (typeof automationRate !== "number" || !automationRate) return;
            const interval = 1e3 / automationRate;
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
            Object.setPrototypeOf(param, MgrAudioParam.prototype);
            param._info = this.paramsConfig[name];
        });
        const resolves = {};
        const rejects = {};
        this.call = (call, ...args)=>{
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
            var _a, _b;
            const { id, call, args, value, error } = data;
            if (call) {
                const r = {
                    id
                };
                try {
                    r.value = this[call](...args);
                } catch (e) {
                    r.error = e;
                }
                this.port.postMessage(r);
            } else {
                if (error) (_a = rejects[id]) == null || _a.call(rejects, error);
                else (_b = resolves[id]) == null || _b.call(resolves, value);
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
        return super.parameters;
    }
    get moduleId() {
        return this.module.moduleId;
    }
    async initialize() {
        const response = await this.call("getBuffer");
        const { lock, paramsBuffer } = response;
        this.$lock = lock;
        this.$paramsBuffer = paramsBuffer;
        const offset = 1;
        Object.entries(this.internalParamsConfig).forEach(([name, config], i)=>{
            if (this.context.state === "suspended") this.$paramsBuffer[i] = config.defaultValue;
            if (config instanceof AudioParam) try {
                config.automationRate = "a-rate";
            } catch (e) {} finally{
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
        } else if (normalized) audioParam.setNormalizedValueAtTime(value, time);
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
        const values = {};
        this.internalParams.forEach((name, i)=>{
            values[name] = this.$paramsBuffer[i];
        });
        return values;
    }
    getParam(name) {
        return this.parameters.get(name) || null;
    }
    getParams() {
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
        const values = {};
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
};
// src/ParamMgrFactory.js
var ParamMgrFactory = class {
    /**
   * @param {WebAudioModule} module
   * @param {ParametersMappingConfiguratorOptions} [optionsIn = {}]
   */ static async create(module, optionsIn = {}) {
        const { audioContext, moduleId } = module;
        const instanceId = optionsIn.instanceId || module.instanceId;
        const groupId = optionsIn.groupId || module.groupId;
        const { paramsConfig, paramsMapping, internalParamsConfig } = new ParamMappingConfigurator(optionsIn);
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
        await addFunctionModule_default(audioContext.audioWorklet, ParamMgrProcessor_default, moduleId, serializableParamsConfig);
        const options = {
            internalParamsConfig,
            parameterData: initialParamsValue,
            processorOptions: {
                paramsConfig,
                paramsMapping,
                internalParamsMinValues: Object.values(internalParamsConfig).map((config)=>Math.max(0, (config == null ? void 0 : config.minValue) || 0)),
                internalParams: Object.keys(internalParamsConfig),
                groupId,
                instanceId,
                moduleId
            }
        };
        const node = new ParamMgrNode(module, options);
        await node.initialize();
        return node;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["8t7iA"], null, "parcelRequireaaed")

//# sourceMappingURL=sampler.e81f0e84.js.map
