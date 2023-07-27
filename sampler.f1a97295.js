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
})({"dtajS":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "1689aeb8f1a97295";
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

},{}],"AKp3Y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _sdk = require("@webaudiomodules/sdk");
var _sdkParammgr = require("@webaudiomodules/sdk-parammgr");
var _samplerWamJs = require("./sampler.wam.js");
var _samplerWamJsDefault = parcelHelpers.interopDefault(_samplerWamJs);
var _descriptorJson = require("url:./descriptor.json");
var _descriptorJsonDefault = parcelHelpers.interopDefault(_descriptorJson);
var _descriptorJson1 = require("./descriptor.json");
var _descriptorJsonDefault1 = parcelHelpers.interopDefault(_descriptorJson1);
// import templateURL from 'url:./template.html'
const NAME = "sampler";
const getBaseUrl = (relativeUrl)=>relativeUrl.substring(0, relativeUrl.lastIndexOf("/"));
class SamplerPlugin extends (0, _sdk.WebAudioModule) {
    _baseUrl = getBaseUrl((0, _descriptorJsonDefault.default));
    _descriptorUrl = (0, _descriptorJsonDefault.default // `${this._baseUrl}/wam2/${NAME}/descriptor.json`
    );
    _descriptor = (0, _descriptorJsonDefault1.default);
    // _templateUrl = templateURL
    /**
	 * Overide and intercept the descriptor file
	 * @param {Object} initialState 
	 * @returns 
	 */ async initialize(initialState) {
        initialState;
        return super.initialize(initialState);
    }
    // The plugin redefines the async method createAudionode()
    // that must return an <Audionode>
    async createAudioNode(options) {
        // const gainNode = new GainNode(this.audioContext, options)
        // createSamplerEngine
        const sampler = new (0, _samplerWamJsDefault.default)(this.audioContext, options);
        const internalParamsConfig = {
            gain: 1
        };
        const paramMgrNode = await (0, _sdkParammgr.ParamMgrFactory).create(this, {
            internalParamsConfig
        });
        sampler.setup(paramMgrNode);
        return sampler;
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
exports.default = SamplerPlugin;

},{"@webaudiomodules/sdk":"eCmgf","@webaudiomodules/sdk-parammgr":"6mWq3","./sampler.wam.js":"5B6K5","url:./descriptor.json":"iPQ36","./descriptor.json":"8vpQT","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eCmgf":[function(require,module,exports) {
// src/WebAudioModule.js
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WamNode", ()=>WamNode);
parcelHelpers.export(exports, "WebAudioModule", ()=>WebAudioModule_default);
parcelHelpers.export(exports, "addFunctionModule", ()=>addFunctionModule_default);
parcelHelpers.export(exports, "apiVersion", ()=>apiVersion_default);
parcelHelpers.export(exports, "getRingBuffer", ()=>RingBuffer_default);
parcelHelpers.export(exports, "getWamArrayRingBuffer", ()=>WamArrayRingBuffer_default);
parcelHelpers.export(exports, "getWamEventRingBuffer", ()=>WamEventRingBuffer_default);
parcelHelpers.export(exports, "getWamParameter", ()=>WamParameter_default);
parcelHelpers.export(exports, "getWamParameterInfo", ()=>WamParameterInfo_default);
parcelHelpers.export(exports, "getWamParameterInterpolator", ()=>WamParameterInterpolator_default);
parcelHelpers.export(exports, "getWamProcessor", ()=>WamProcessor_default);
parcelHelpers.export(exports, "initializeWamEnv", ()=>WamEnv_default);
parcelHelpers.export(exports, "initializeWamGroup", ()=>WamGroup_default);
parcelHelpers.export(exports, "initializeWamHost", ()=>initializeWamHost_default);
var WebAudioModule = class {
    static get isWebAudioModuleConstructor() {
        return true;
    }
    static createInstance(groupId, audioContext, initialState) {
        return new this(groupId, audioContext).initialize(initialState);
    }
    constructor(groupId, audioContext){
        this._groupId = groupId;
        this._audioContext = audioContext;
        this._initialized = false;
        this._audioNode = void 0;
        this._timestamp = performance.now();
        this._guiModuleUrl = void 0;
        this._descriptorUrl = "./descriptor.json";
        this._descriptor = {
            identifier: `com.webaudiomodule.default`,
            name: `WebAudioModule_${this.constructor.name}`,
            vendor: "WebAudioModuleVendor",
            description: "",
            version: "0.0.0",
            apiVersion: "2.0.0",
            thumbnail: "",
            keywords: [],
            isInstrument: false,
            website: "",
            hasAudioInput: true,
            hasAudioOutput: true,
            hasAutomationInput: true,
            hasAutomationOutput: true,
            hasMidiInput: true,
            hasMidiOutput: true,
            hasMpeInput: true,
            hasMpeOutput: true,
            hasOscInput: true,
            hasOscOutput: true,
            hasSysexInput: true,
            hasSysexOutput: true
        };
    }
    get isWebAudioModule() {
        return true;
    }
    get groupId() {
        return this._groupId;
    }
    get moduleId() {
        return this.descriptor.identifier;
    }
    get instanceId() {
        return this.moduleId + this._timestamp;
    }
    get descriptor() {
        return this._descriptor;
    }
    get identifier() {
        return this.descriptor.identifier;
    }
    get name() {
        return this.descriptor.name;
    }
    get vendor() {
        return this.descriptor.vendor;
    }
    get audioContext() {
        return this._audioContext;
    }
    get audioNode() {
        if (!this.initialized) console.warn("WAM should be initialized before getting the audioNode");
        return this._audioNode;
    }
    set audioNode(node) {
        this._audioNode = node;
    }
    get initialized() {
        return this._initialized;
    }
    set initialized(value) {
        this._initialized = value;
    }
    async createAudioNode(initialState) {
        throw new TypeError("createAudioNode() not provided");
    }
    async initialize(state) {
        if (!this._audioNode) this.audioNode = await this.createAudioNode();
        this.initialized = true;
        return this;
    }
    async _loadGui() {
        const url = this._guiModuleUrl;
        if (!url) throw new TypeError("Gui module not found");
        return require(/* webpackIgnore: true */ url);
    }
    async _loadDescriptor() {
        const url = this._descriptorUrl;
        if (!url) throw new TypeError("Descriptor not found");
        const response = await fetch(url);
        const descriptor = await response.json();
        Object.assign(this._descriptor, descriptor);
        return this._descriptor;
    }
    async createGui() {
        if (!this.initialized) console.warn("Plugin should be initialized before getting the gui");
        if (!this._guiModuleUrl) return void 0;
        const { createElement } = await this._loadGui();
        return createElement(this);
    }
    destroyGui() {}
};
var WebAudioModule_default = WebAudioModule;
// src/RingBuffer.js
var getRingBuffer = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    class RingBuffer2 {
        static getStorageForCapacity(capacity, Type) {
            if (!Type.BYTES_PER_ELEMENT) throw new Error("Pass in a ArrayBuffer subclass");
            const bytes = 8 + (capacity + 1) * Type.BYTES_PER_ELEMENT;
            return new SharedArrayBuffer(bytes);
        }
        constructor(sab, Type){
            if (!Type.BYTES_PER_ELEMENT) throw new Error("Pass a concrete typed array class as second argument");
            this._Type = Type;
            this._capacity = (sab.byteLength - 8) / Type.BYTES_PER_ELEMENT;
            this.buf = sab;
            this.write_ptr = new Uint32Array(this.buf, 0, 1);
            this.read_ptr = new Uint32Array(this.buf, 4, 1);
            this.storage = new Type(this.buf, 8, this._capacity);
        }
        get type() {
            return this._Type.name;
        }
        push(elements) {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            if ((wr + 1) % this._storageCapacity() === rd) return 0;
            const toWrite = Math.min(this._availableWrite(rd, wr), elements.length);
            const firstPart = Math.min(this._storageCapacity() - wr, toWrite);
            const secondPart = toWrite - firstPart;
            this._copy(elements, 0, this.storage, wr, firstPart);
            this._copy(elements, firstPart, this.storage, 0, secondPart);
            Atomics.store(this.write_ptr, 0, (wr + toWrite) % this._storageCapacity());
            return toWrite;
        }
        pop(elements) {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            if (wr === rd) return 0;
            const isArray = !Number.isInteger(elements);
            const toRead = Math.min(this._availableRead(rd, wr), isArray ? elements.length : elements);
            if (isArray) {
                const firstPart = Math.min(this._storageCapacity() - rd, toRead);
                const secondPart = toRead - firstPart;
                this._copy(this.storage, rd, elements, 0, firstPart);
                this._copy(this.storage, 0, elements, firstPart, secondPart);
            }
            Atomics.store(this.read_ptr, 0, (rd + toRead) % this._storageCapacity());
            return toRead;
        }
        get empty() {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            return wr === rd;
        }
        get full() {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            return (wr + 1) % this._capacity !== rd;
        }
        get capacity() {
            return this._capacity - 1;
        }
        get availableRead() {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            return this._availableRead(rd, wr);
        }
        get availableWrite() {
            const rd = Atomics.load(this.read_ptr, 0);
            const wr = Atomics.load(this.write_ptr, 0);
            return this._availableWrite(rd, wr);
        }
        _availableRead(rd, wr) {
            if (wr > rd) return wr - rd;
            return wr + this._storageCapacity() - rd;
        }
        _availableWrite(rd, wr) {
            let rv = rd - wr - 1;
            if (wr >= rd) rv += this._storageCapacity();
            return rv;
        }
        _storageCapacity() {
            return this._capacity;
        }
        _copy(input, offsetInput, output, offsetOutput, size) {
            for(let i = 0; i < size; i++)output[offsetOutput + i] = input[offsetInput + i];
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.RingBuffer) ModuleScope.RingBuffer = RingBuffer2;
    }
    return RingBuffer2;
};
var RingBuffer_default = getRingBuffer;
// src/WamArrayRingBuffer.js
var getWamArrayRingBuffer = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    class WamArrayRingBuffer {
        static DefaultArrayCapacity = 2;
        static getStorageForEventCapacity(RingBuffer2, arrayLength, arrayType, maxArrayCapacity) {
            if (maxArrayCapacity === void 0) maxArrayCapacity = WamArrayRingBuffer.DefaultArrayCapacity;
            else maxArrayCapacity = Math.max(maxArrayCapacity, WamArrayRingBuffer.DefaultArrayCapacity);
            if (!arrayType.BYTES_PER_ELEMENT) throw new Error("Pass in a ArrayBuffer subclass");
            const capacity = arrayLength * maxArrayCapacity;
            return RingBuffer2.getStorageForCapacity(capacity, arrayType);
        }
        constructor(RingBuffer2, sab, arrayLength, arrayType, maxArrayCapacity){
            if (!arrayType.BYTES_PER_ELEMENT) throw new Error("Pass in a ArrayBuffer subclass");
            this._arrayLength = arrayLength;
            this._arrayType = arrayType;
            this._arrayElementSizeBytes = arrayType.BYTES_PER_ELEMENT;
            this._arraySizeBytes = this._arrayLength * this._arrayElementSizeBytes;
            this._sab = sab;
            if (maxArrayCapacity === void 0) maxArrayCapacity = WamArrayRingBuffer.DefaultArrayCapacity;
            else maxArrayCapacity = Math.max(maxArrayCapacity, WamArrayRingBuffer.DefaultArrayCapacity);
            this._arrayArray = new arrayType(this._arrayLength);
            this._rb = new RingBuffer2(this._sab, arrayType);
        }
        write(array) {
            if (array.length !== this._arrayLength) return false;
            const elementsAvailable = this._rb.availableWrite;
            if (elementsAvailable < this._arrayLength) return false;
            let success = true;
            const elementsWritten = this._rb.push(array);
            if (elementsWritten != this._arrayLength) success = false;
            return success;
        }
        read(array, newest) {
            if (array.length !== this._arrayLength) return false;
            const elementsAvailable = this._rb.availableRead;
            if (elementsAvailable < this._arrayLength) return false;
            if (newest && elementsAvailable > this._arrayLength) this._rb.pop(elementsAvailable - this._arrayLength);
            let success = false;
            const elementsRead = this._rb.pop(array);
            if (elementsRead === this._arrayLength) success = true;
            return success;
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamArrayRingBuffer) ModuleScope.WamArrayRingBuffer = WamArrayRingBuffer;
    }
    return WamArrayRingBuffer;
};
var WamArrayRingBuffer_default = getWamArrayRingBuffer;
// src/WamEnv.js
var initializeWamEnv = (apiVersion)=>{
    const audioWorkletGlobalScope = globalThis;
    if (audioWorkletGlobalScope.AudioWorkletProcessor && audioWorkletGlobalScope.webAudioModules) return;
    const moduleScopes = /* @__PURE__ */ new Map();
    const groups = /* @__PURE__ */ new Map();
    class WamEnv {
        constructor(){}
        get apiVersion() {
            return apiVersion;
        }
        getModuleScope(moduleId) {
            if (!moduleScopes.has(moduleId)) moduleScopes.set(moduleId, {});
            return moduleScopes.get(moduleId);
        }
        getGroup(groupId, groupKey) {
            const group = groups.get(groupId);
            if (group.validate(groupKey)) return group;
            else throw "Invalid key";
        }
        addGroup(group) {
            if (!groups.has(group.groupId)) groups.set(group.groupId, group);
        }
        removeGroup(group) {
            groups.delete(group.groupId);
        }
        addWam(wam) {
            const group = groups.get(wam.groupId);
            group.addWam(wam);
        }
        removeWam(wam) {
            const group = groups.get(wam.groupId);
            group.removeWam(wam);
        }
        connectEvents(groupId, fromId, toId, output = 0) {
            const group = groups.get(groupId);
            group.connectEvents(fromId, toId, output);
        }
        disconnectEvents(groupId, fromId, toId, output) {
            const group = groups.get(groupId);
            group.disconnectEvents(fromId, toId, output);
        }
        emitEvents(from, ...events) {
            const group = groups.get(from.groupId);
            group.emitEvents(from, ...events);
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        if (!audioWorkletGlobalScope.webAudioModules) audioWorkletGlobalScope.webAudioModules = new WamEnv();
    }
};
var WamEnv_default = initializeWamEnv;
// src/WamGroup.js
var initializeWamGroup = (groupId, groupKey)=>{
    const audioWorkletGlobalScope = globalThis;
    class WamGroup {
        constructor(groupId2, groupKey2){
            this._groupId = groupId2;
            this._validate = (key)=>{
                return key == groupKey2;
            };
            this._processors = /* @__PURE__ */ new Map();
            this._eventGraph = /* @__PURE__ */ new Map();
        }
        get groupId() {
            return this._groupId;
        }
        get processors() {
            return this._processors;
        }
        get eventGraph() {
            return this._eventGraph;
        }
        validate(groupKey2) {
            return this._validate(groupKey2);
        }
        addWam(wam) {
            this._processors.set(wam.instanceId, wam);
        }
        removeWam(wam) {
            if (this._eventGraph.has(wam)) this._eventGraph.delete(wam);
            this._eventGraph.forEach((outputMap)=>{
                outputMap.forEach((set)=>{
                    if (set && set.has(wam)) set.delete(wam);
                });
            });
            this._processors.delete(wam.instanceId);
        }
        connectEvents(fromId, toId, output) {
            const from = this._processors.get(fromId);
            const to = this._processors.get(toId);
            let outputMap;
            if (this._eventGraph.has(from)) outputMap = this._eventGraph.get(from);
            else {
                outputMap = [];
                this._eventGraph.set(from, outputMap);
            }
            if (outputMap[output]) outputMap[output].add(to);
            else {
                const set = /* @__PURE__ */ new Set();
                set.add(to);
                outputMap[output] = set;
            }
        }
        disconnectEvents(fromId, toId, output) {
            const from = this._processors.get(fromId);
            if (!this._eventGraph.has(from)) return;
            const outputMap = this._eventGraph.get(from);
            if (typeof toId === "undefined") {
                outputMap.forEach((set)=>{
                    if (set) set.clear();
                });
                return;
            }
            const to = this._processors.get(toId);
            if (typeof output === "undefined") {
                outputMap.forEach((set)=>{
                    if (set) set.delete(to);
                });
                return;
            }
            if (!outputMap[output]) return;
            outputMap[output].delete(to);
        }
        emitEvents(from, ...events) {
            if (!this._eventGraph.has(from)) return;
            const downstream = this._eventGraph.get(from);
            downstream.forEach((set)=>{
                if (set) set.forEach((wam)=>wam.scheduleEvents(...events));
            });
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) audioWorkletGlobalScope.webAudioModules.addGroup(new WamGroup(groupId, groupKey));
};
var WamGroup_default = initializeWamGroup;
// src/WamEventRingBuffer.js
var getWamEventRingBuffer = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    class WamEventRingBuffer2 {
        static DefaultExtraBytesPerEvent = 64;
        static WamEventBaseBytes = 13;
        static WamAutomationEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 2 + 8 + 1;
        static WamTransportEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1;
        static WamMidiEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 1 + 1 + 1;
        static WamBinaryEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4;
        static getStorageForEventCapacity(RingBuffer2, eventCapacity, maxBytesPerEvent) {
            if (maxBytesPerEvent === void 0) maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;
            else maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
            const capacity = (Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent) * eventCapacity;
            return RingBuffer2.getStorageForCapacity(capacity, Uint8Array);
        }
        constructor(RingBuffer2, sab, parameterIds, maxBytesPerEvent){
            this._eventSizeBytes = {};
            this._encodeEventType = {};
            this._decodeEventType = {};
            const wamEventTypes = [
                "wam-automation",
                "wam-transport",
                "wam-midi",
                "wam-sysex",
                "wam-mpe",
                "wam-osc",
                "wam-info"
            ];
            wamEventTypes.forEach((type, encodedType)=>{
                let byteSize = 0;
                switch(type){
                    case "wam-automation":
                        byteSize = WamEventRingBuffer2.WamAutomationEventBytes;
                        break;
                    case "wam-transport":
                        byteSize = WamEventRingBuffer2.WamTransportEventBytes;
                        break;
                    case "wam-mpe":
                    case "wam-midi":
                        byteSize = WamEventRingBuffer2.WamMidiEventBytes;
                        break;
                    case "wam-osc":
                    case "wam-sysex":
                    case "wam-info":
                        byteSize = WamEventRingBuffer2.WamBinaryEventBytes;
                        break;
                    default:
                        break;
                }
                this._eventSizeBytes[type] = byteSize;
                this._encodeEventType[type] = encodedType;
                this._decodeEventType[encodedType] = type;
            });
            this._parameterCode = 0;
            this._parameterCodes = {};
            this._encodeParameterId = {};
            this._decodeParameterId = {};
            this.setParameterIds(parameterIds);
            this._sab = sab;
            if (maxBytesPerEvent === void 0) maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;
            else maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
            this._eventBytesAvailable = Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent;
            this._eventBytes = new ArrayBuffer(this._eventBytesAvailable);
            this._eventBytesView = new DataView(this._eventBytes);
            this._rb = new RingBuffer2(this._sab, Uint8Array);
            this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4);
            this._eventSizeView = new DataView(this._eventBytes, 0, 4);
        }
        _writeHeader(byteSize, type, time) {
            let byteOffset = 0;
            this._eventBytesView.setUint32(byteOffset, byteSize);
            byteOffset += 4;
            this._eventBytesView.setUint8(byteOffset, this._encodeEventType[type]);
            byteOffset += 1;
            this._eventBytesView.setFloat64(byteOffset, Number.isFinite(time) ? time : -1);
            byteOffset += 8;
            return byteOffset;
        }
        _encode(event) {
            let byteOffset = 0;
            const { type, time } = event;
            switch(event.type){
                case "wam-automation":
                    {
                        if (!(event.data.id in this._encodeParameterId)) break;
                        const byteSize = this._eventSizeBytes[type];
                        byteOffset = this._writeHeader(byteSize, type, time);
                        const { data } = event;
                        const encodedParameterId = this._encodeParameterId[data.id];
                        const { value, normalized } = data;
                        this._eventBytesView.setUint16(byteOffset, encodedParameterId);
                        byteOffset += 2;
                        this._eventBytesView.setFloat64(byteOffset, value);
                        byteOffset += 8;
                        this._eventBytesView.setUint8(byteOffset, normalized ? 1 : 0);
                        byteOffset += 1;
                    }
                    break;
                case "wam-transport":
                    {
                        const byteSize = this._eventSizeBytes[type];
                        byteOffset = this._writeHeader(byteSize, type, time);
                        const { data } = event;
                        const { currentBar, currentBarStarted, tempo, timeSigNumerator, timeSigDenominator, playing } = data;
                        this._eventBytesView.setUint32(byteOffset, currentBar);
                        byteOffset += 4;
                        this._eventBytesView.setFloat64(byteOffset, currentBarStarted);
                        byteOffset += 8;
                        this._eventBytesView.setFloat64(byteOffset, tempo);
                        byteOffset += 8;
                        this._eventBytesView.setUint8(byteOffset, timeSigNumerator);
                        byteOffset += 1;
                        this._eventBytesView.setUint8(byteOffset, timeSigDenominator);
                        byteOffset += 1;
                        this._eventBytesView.setUint8(byteOffset, playing ? 1 : 0);
                        byteOffset += 1;
                    }
                    break;
                case "wam-mpe":
                case "wam-midi":
                    {
                        const byteSize = this._eventSizeBytes[type];
                        byteOffset = this._writeHeader(byteSize, type, time);
                        const { data } = event;
                        const { bytes } = data;
                        let b = 0;
                        while(b < 3){
                            this._eventBytesView.setUint8(byteOffset, bytes[b]);
                            byteOffset += 1;
                            b++;
                        }
                    }
                    break;
                case "wam-osc":
                case "wam-sysex":
                case "wam-info":
                    {
                        let bytes = null;
                        if (event.type === "wam-info") {
                            const { data } = event;
                            bytes = new TextEncoder().encode(data.instanceId);
                        } else {
                            const { data } = event;
                            bytes = data.bytes;
                        }
                        const numBytes = bytes.length;
                        const byteSize = this._eventSizeBytes[type];
                        byteOffset = this._writeHeader(byteSize + numBytes, type, time);
                        this._eventBytesView.setUint32(byteOffset, numBytes);
                        byteOffset += 4;
                        const bytesRequired = byteOffset + numBytes;
                        if (bytesRequired > this._eventBytesAvailable) console.error(`Event requires ${bytesRequired} bytes but only ${this._eventBytesAvailable} have been allocated!`);
                        const buffer = new Uint8Array(this._eventBytes, byteOffset, numBytes);
                        buffer.set(bytes);
                        byteOffset += numBytes;
                    }
                    break;
                default:
                    break;
            }
            return new Uint8Array(this._eventBytes, 0, byteOffset);
        }
        _decode() {
            let byteOffset = 0;
            const type = this._decodeEventType[this._eventBytesView.getUint8(byteOffset)];
            byteOffset += 1;
            let time = this._eventBytesView.getFloat64(byteOffset);
            if (time === -1) time = void 0;
            byteOffset += 8;
            switch(type){
                case "wam-automation":
                    {
                        const encodedParameterId = this._eventBytesView.getUint16(byteOffset);
                        byteOffset += 2;
                        const value = this._eventBytesView.getFloat64(byteOffset);
                        byteOffset += 8;
                        const normalized = !!this._eventBytesView.getUint8(byteOffset);
                        byteOffset += 1;
                        if (!(encodedParameterId in this._decodeParameterId)) break;
                        const id = this._decodeParameterId[encodedParameterId];
                        const event = {
                            type,
                            time,
                            data: {
                                id,
                                value,
                                normalized
                            }
                        };
                        return event;
                    }
                case "wam-transport":
                    {
                        const currentBar = this._eventBytesView.getUint32(byteOffset);
                        byteOffset += 4;
                        const currentBarStarted = this._eventBytesView.getFloat64(byteOffset);
                        byteOffset += 8;
                        const tempo = this._eventBytesView.getFloat64(byteOffset);
                        byteOffset += 8;
                        const timeSigNumerator = this._eventBytesView.getUint8(byteOffset);
                        byteOffset += 1;
                        const timeSigDenominator = this._eventBytesView.getUint8(byteOffset);
                        byteOffset += 1;
                        const playing = this._eventBytesView.getUint8(byteOffset) == 1;
                        byteOffset += 1;
                        const event = {
                            type,
                            time,
                            data: {
                                currentBar,
                                currentBarStarted,
                                tempo,
                                timeSigNumerator,
                                timeSigDenominator,
                                playing
                            }
                        };
                        return event;
                    }
                case "wam-mpe":
                case "wam-midi":
                    {
                        const bytes = [
                            0,
                            0,
                            0
                        ];
                        let b = 0;
                        while(b < 3){
                            bytes[b] = this._eventBytesView.getUint8(byteOffset);
                            byteOffset += 1;
                            b++;
                        }
                        const event = {
                            type,
                            time,
                            data: {
                                bytes
                            }
                        };
                        return event;
                    }
                case "wam-osc":
                case "wam-sysex":
                case "wam-info":
                    {
                        const numBytes = this._eventBytesView.getUint32(byteOffset);
                        byteOffset += 4;
                        const bytes = new Uint8Array(numBytes);
                        bytes.set(new Uint8Array(this._eventBytes, byteOffset, numBytes));
                        byteOffset += numBytes;
                        if (type === "wam-info") {
                            const instanceId = new TextDecoder().decode(bytes);
                            const data = {
                                instanceId
                            };
                            return {
                                type,
                                time,
                                data
                            };
                        } else {
                            const data = {
                                bytes
                            };
                            return {
                                type,
                                time,
                                data
                            };
                        }
                    }
                default:
                    break;
            }
            return false;
        }
        write(...events) {
            const numEvents = events.length;
            let bytesAvailable = this._rb.availableWrite;
            let numSkipped = 0;
            let i = 0;
            while(i < numEvents){
                const event = events[i];
                const bytes = this._encode(event);
                const eventSizeBytes = bytes.byteLength;
                let bytesWritten = 0;
                if (bytesAvailable >= eventSizeBytes) {
                    if (eventSizeBytes === 0) numSkipped++;
                    else bytesWritten = this._rb.push(bytes);
                } else break;
                bytesAvailable -= bytesWritten;
                i++;
            }
            return i - numSkipped;
        }
        read() {
            if (this._rb.empty) return [];
            const events = [];
            let bytesAvailable = this._rb.availableRead;
            let bytesRead = 0;
            while(bytesAvailable > 0){
                bytesRead = this._rb.pop(this._eventSizeArray);
                bytesAvailable -= bytesRead;
                const eventSizeBytes = this._eventSizeView.getUint32(0);
                const eventBytes = new Uint8Array(this._eventBytes, 0, eventSizeBytes - 4);
                bytesRead = this._rb.pop(eventBytes);
                bytesAvailable -= bytesRead;
                const decodedEvent = this._decode();
                if (decodedEvent) events.push(decodedEvent);
            }
            return events;
        }
        setParameterIds(parameterIds) {
            this._encodeParameterId = {};
            this._decodeParameterId = {};
            parameterIds.forEach((parameterId)=>{
                let parameterCode = -1;
                if (parameterId in this._parameterCodes) parameterCode = this._parameterCodes[parameterId];
                else {
                    parameterCode = this._generateParameterCode();
                    this._parameterCodes[parameterId] = parameterCode;
                }
                this._encodeParameterId[parameterId] = parameterCode;
                this._decodeParameterId[parameterCode] = parameterId;
            });
        }
        _generateParameterCode() {
            if (this._parameterCode > 65535) throw Error("Too many parameters have been registered!");
            return this._parameterCode++;
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamEventRingBuffer) ModuleScope.WamEventRingBuffer = WamEventRingBuffer2;
    }
    return WamEventRingBuffer2;
};
var WamEventRingBuffer_default = getWamEventRingBuffer;
// src/addFunctionModule.js
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
// src/WamParameter.js
var getWamParameter = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    class WamParameter {
        constructor(info){
            this.info = info;
            this._value = info.defaultValue;
        }
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        set normalizedValue(valueNorm) {
            this.value = this.info.denormalize(valueNorm);
        }
        get normalizedValue() {
            return this.info.normalize(this.value);
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamParameter) ModuleScope.WamParameter = WamParameter;
    }
    return WamParameter;
};
var WamParameter_default = getWamParameter;
// src/WamParameterInfo.js
var getWamParameterInfo = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    const normExp = (x, e)=>e === 0 ? x : x ** 1.5 ** -e;
    const denormExp = (x, e)=>e === 0 ? x : x ** 1.5 ** e;
    const normalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
    const denormalize = (x, min, max, e = 0)=>min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
    const inRange = (x, min, max)=>x >= min && x <= max;
    class WamParameterInfo {
        constructor(id, config = {}){
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
        normalize(value) {
            return normalize(value, this.minValue, this.maxValue, this.exponent);
        }
        denormalize(valueNorm) {
            return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
        }
        valueString(value) {
            if (this.choices) return this.choices[value];
            if (this.units !== "") return `${value} ${this.units}`;
            return `${value}`;
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamParameterInfo) ModuleScope.WamParameterInfo = WamParameterInfo;
    }
    return WamParameterInfo;
};
var WamParameterInfo_default = getWamParameterInfo;
// src/WamParameterInterpolator.js
var getWamParameterInterpolator = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    const samplesPerQuantum = 128;
    const nullTableKey = "0_0";
    class WamParameterInterpolator {
        static _tables;
        static _tableReferences;
        constructor(info, samplesPerInterpolation, skew = 0){
            if (!WamParameterInterpolator._tables) {
                WamParameterInterpolator._tables = {
                    nullTableKey: new Float32Array(0)
                };
                WamParameterInterpolator._tableReferences = {
                    nullTableKey: []
                };
            }
            this.info = info;
            this.values = new Float32Array(samplesPerQuantum);
            this._tableKey = nullTableKey;
            this._table = WamParameterInterpolator._tables[this._tableKey];
            this._skew = 2;
            const { discreteStep } = info;
            this._discrete = !!discreteStep;
            this._N = this._discrete ? 0 : samplesPerInterpolation;
            this._n = 0;
            this._startValue = info.defaultValue;
            this._endValue = info.defaultValue;
            this._currentValue = info.defaultValue;
            this._deltaValue = 0;
            this._inverted = false;
            this._changed = true;
            this._filled = 0;
            if (!this._discrete) this.setSkew(skew);
            else this._skew = 0;
            this.setStartValue(this._startValue);
        }
        _removeTableReference(oldKey) {
            if (oldKey === nullTableKey) return;
            const { id } = this.info;
            const references = WamParameterInterpolator._tableReferences[oldKey];
            if (references) {
                const index = references.indexOf(id);
                if (index !== -1) references.splice(index, 1);
                if (references.length === 0) {
                    delete WamParameterInterpolator._tables[oldKey];
                    delete WamParameterInterpolator._tableReferences[oldKey];
                }
            }
        }
        setSkew(skew) {
            if (this._skew === skew || this._discrete) return;
            if (skew < -1 || skew > 1) throw Error("skew must be in range [-1.0, 1.0]");
            const newKey = [
                this._N,
                skew
            ].join("_");
            const oldKey = this._tableKey;
            const { id } = this.info;
            if (newKey === oldKey) return;
            if (WamParameterInterpolator._tables[newKey]) {
                const references = WamParameterInterpolator._tableReferences[newKey];
                if (references) references.push(id);
                else WamParameterInterpolator._tableReferences[newKey] = [
                    id
                ];
            } else {
                let e = Math.abs(skew);
                e = Math.pow(3 - e, e * (e + 2));
                const linear = e === 1;
                const N = this._N;
                const table = new Float32Array(N + 1);
                if (linear) for(let n = 0; n <= N; ++n)table[n] = n / N;
                else for(let n = 0; n <= N; ++n)table[n] = (n / N) ** e;
                WamParameterInterpolator._tables[newKey] = table;
                WamParameterInterpolator._tableReferences[newKey] = [
                    id
                ];
            }
            this._removeTableReference(oldKey);
            this._skew = skew;
            this._tableKey = newKey;
            this._table = WamParameterInterpolator._tables[this._tableKey];
        }
        setStartValue(value, fill = true) {
            this._n = this._N;
            this._startValue = value;
            this._endValue = value;
            this._currentValue = value;
            this._deltaValue = 0;
            this._inverted = false;
            if (fill) {
                this.values.fill(value);
                this._changed = true;
                this._filled = this.values.length;
            } else {
                this._changed = false;
                this._filled = 0;
            }
        }
        setEndValue(value) {
            if (value === this._endValue) return;
            this._n = 0;
            this._startValue = this._currentValue;
            this._endValue = value;
            this._deltaValue = this._endValue - this._startValue;
            this._inverted = this._deltaValue > 0 && this._skew >= 0 || this._deltaValue <= 0 && this._skew < 0;
            this._changed = false;
            this._filled = 0;
        }
        process(startSample, endSample) {
            if (this.done) return;
            const length = endSample - startSample;
            let fill = 0;
            const change = this._N - this._n;
            if (this._discrete || !change) fill = length;
            else {
                if (change < length) {
                    fill = Math.min(length - change, samplesPerQuantum);
                    endSample -= fill;
                }
                if (endSample > startSample) {
                    if (this._inverted) for(let i = startSample; i < endSample; ++i){
                        const tableValue = 1 - this._table[this._N - ++this._n];
                        this.values[i] = this._startValue + tableValue * this._deltaValue;
                    }
                    else for(let i = startSample; i < endSample; ++i){
                        const tableValue = this._table[++this._n];
                        this.values[i] = this._startValue + tableValue * this._deltaValue;
                    }
                }
                if (fill > 0) {
                    startSample = endSample;
                    endSample += fill;
                }
            }
            if (fill > 0) {
                this.values.fill(this._endValue, startSample, endSample);
                this._filled += fill;
            }
            this._currentValue = this.values[endSample - 1];
            if (this._n === this._N) {
                if (!this._changed) this._changed = true;
                else if (this._filled >= this.values.length) {
                    this.setStartValue(this._endValue, false);
                    this._changed = true;
                    this._filled = this.values.length;
                }
            }
        }
        get done() {
            return this._changed && this._filled === this.values.length;
        }
        is(value) {
            return this._endValue === value && this.done;
        }
        destroy() {
            this._removeTableReference(this._tableKey);
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
        if (!ModuleScope.WamParameterInterpolator) ModuleScope.WamParameterInterpolator = WamParameterInterpolator;
    }
    return WamParameterInterpolator;
};
var WamParameterInterpolator_default = getWamParameterInterpolator;
// src/WamProcessor.js
var getWamProcessor = (moduleId)=>{
    const audioWorkletGlobalScope = globalThis;
    const { AudioWorkletProcessor, webAudioModules } = audioWorkletGlobalScope;
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    const { RingBuffer: RingBuffer2, WamEventRingBuffer: WamEventRingBuffer2, WamParameter, WamParameterInterpolator } = ModuleScope;
    class WamProcessor extends AudioWorkletProcessor {
        constructor(options){
            super();
            const { groupId, moduleId: moduleId2, instanceId, useSab } = options.processorOptions;
            if (!moduleId2) throw Error("must provide moduleId argument in processorOptions!");
            if (!instanceId) throw Error("must provide instanceId argument in processorOptions!");
            this.groupId = groupId;
            this.moduleId = moduleId2;
            this.instanceId = instanceId;
            this._samplesPerQuantum = 128;
            this._compensationDelay = 0;
            this._parameterInfo = {};
            this._parameterState = {};
            this._parameterInterpolators = {};
            this._eventQueue = [];
            this._pendingResponses = {};
            this._useSab = !!useSab && !!globalThis.SharedArrayBuffer;
            this._eventSabReady = false;
            this._audioToMainEventSab = null;
            this._mainToAudioEventSab = null;
            this._eventWriter = null;
            this._eventReader = null;
            this._initialized = false;
            this._destroyed = false;
            webAudioModules.addWam(this);
            this.port.onmessage = this._onMessage.bind(this);
            if (this._useSab) this._configureSab();
        }
        getCompensationDelay() {
            return this._compensationDelay;
        }
        scheduleEvents(...events) {
            let i = 0;
            while(i < events.length){
                this._eventQueue.push({
                    id: 0,
                    event: events[i]
                });
                i++;
            }
        }
        emitEvents(...events) {
            webAudioModules.emitEvents(this, ...events);
        }
        clearEvents() {
            this._eventQueue = [];
        }
        process(inputs, outputs, parameters) {
            if (!this._initialized) return true;
            if (this._destroyed) return false;
            if (this._eventSabReady) this.scheduleEvents(...this._eventReader.read());
            const processingSlices = this._getProcessingSlices();
            let i = 0;
            while(i < processingSlices.length){
                const { range, events } = processingSlices[i];
                const [startSample, endSample] = range;
                let j = 0;
                while(j < events.length){
                    this._processEvent(events[j]);
                    j++;
                }
                this._interpolateParameterValues(startSample, endSample);
                this._process(startSample, endSample, inputs, outputs, parameters);
                i++;
            }
            return true;
        }
        destroy() {
            this._destroyed = true;
            this.port.close();
            webAudioModules.removeWam(this);
        }
        _generateWamParameterInfo() {
            return {};
        }
        _initialize() {
            this._parameterState = {};
            this._parameterInterpolators = {};
            this._parameterInfo = this._generateWamParameterInfo();
            Object.keys(this._parameterInfo).forEach((parameterId)=>{
                const info = this._parameterInfo[parameterId];
                this._parameterState[parameterId] = new WamParameter(this._parameterInfo[parameterId]);
                this._parameterInterpolators[parameterId] = new WamParameterInterpolator(info, 256);
            });
        }
        _configureSab() {
            const eventCapacity = 1024;
            const parameterIds = Object.keys(this._parameterInfo);
            if (this._eventSabReady) {
                this._eventWriter.setParameterIds(parameterIds);
                this._eventReader.setParameterIds(parameterIds);
            }
            this.port.postMessage({
                eventSab: {
                    eventCapacity,
                    parameterIds
                }
            });
        }
        async _onMessage(message) {
            if (message.data.request) {
                const { id, request, content } = message.data;
                const response = {
                    id,
                    response: request
                };
                const requestComponents = request.split("/");
                const verb = requestComponents[0];
                const noun = requestComponents[1];
                response.content = "error";
                if (verb === "get") {
                    if (noun === "parameterInfo") {
                        let { parameterIds } = content;
                        if (!parameterIds.length) parameterIds = Object.keys(this._parameterInfo);
                        const parameterInfo = {};
                        let i = 0;
                        while(i < parameterIds.length){
                            const parameterId = parameterIds[i];
                            parameterInfo[parameterId] = this._parameterInfo[parameterId];
                            i++;
                        }
                        response.content = parameterInfo;
                    } else if (noun === "parameterValues") {
                        let { normalized, parameterIds } = content;
                        response.content = this._getParameterValues(normalized, parameterIds);
                    } else if (noun === "state") response.content = this._getState();
                    else if (noun === "compensationDelay") response.content = this.getCompensationDelay();
                } else if (verb === "set") {
                    if (noun === "parameterValues") {
                        const { parameterValues } = content;
                        this._setParameterValues(parameterValues, true);
                        delete response.content;
                    } else if (noun === "state") {
                        const { state } = content;
                        this._setState(state);
                        delete response.content;
                    }
                } else if (verb === "add") {
                    if (noun === "event") {
                        const { event } = content;
                        this._eventQueue.push({
                            id,
                            event
                        });
                        return;
                    }
                } else if (verb === "remove") {
                    if (noun === "events") {
                        const ids = this._eventQueue.map((queued)=>queued.id);
                        this.clearEvents();
                        response.content = ids;
                    }
                } else if (verb === "connect") {
                    if (noun === "events") {
                        const { wamInstanceId, output } = content;
                        this._connectEvents(wamInstanceId, output);
                        delete response.content;
                    }
                } else if (verb === "disconnect") {
                    if (noun === "events") {
                        const { wamInstanceId, output } = content;
                        this._disconnectEvents(wamInstanceId, output);
                        delete response.content;
                    }
                } else if (verb === "initialize") {
                    if (noun === "processor") {
                        this._initialize();
                        this._initialized = true;
                        delete response.content;
                    } else if (noun === "eventSab") {
                        const { mainToAudioEventSab, audioToMainEventSab } = content;
                        this._audioToMainEventSab = audioToMainEventSab;
                        this._mainToAudioEventSab = mainToAudioEventSab;
                        const parameterIds = Object.keys(this._parameterInfo);
                        this._eventWriter = new WamEventRingBuffer2(RingBuffer2, this._audioToMainEventSab, parameterIds);
                        this._eventReader = new WamEventRingBuffer2(RingBuffer2, this._mainToAudioEventSab, parameterIds);
                        this._eventSabReady = true;
                        delete response.content;
                    }
                }
                this.port.postMessage(response);
            } else if (message.data.destroy) this.destroy();
        }
        _onTransport(transportData) {
            console.error("_onTransport not implemented!");
        }
        _onMidi(midiData) {
            console.error("_onMidi not implemented!");
        }
        _onSysex(sysexData) {
            console.error("_onMidi not implemented!");
        }
        _onMpe(mpeData) {
            console.error("_onMpe not implemented!");
        }
        _onOsc(oscData) {
            console.error("_onOsc not implemented!");
        }
        _setState(state) {
            if (state.parameterValues) this._setParameterValues(state.parameterValues, false);
        }
        _getState() {
            return {
                parameterValues: this._getParameterValues(false)
            };
        }
        _getParameterValues(normalized, parameterIds) {
            const parameterValues = {};
            if (!parameterIds || !parameterIds.length) parameterIds = Object.keys(this._parameterState);
            let i = 0;
            while(i < parameterIds.length){
                const id = parameterIds[i];
                const parameter = this._parameterState[id];
                parameterValues[id] = {
                    id,
                    value: normalized ? parameter.normalizedValue : parameter.value,
                    normalized
                };
                i++;
            }
            return parameterValues;
        }
        _setParameterValues(parameterUpdates, interpolate) {
            const parameterIds = Object.keys(parameterUpdates);
            let i = 0;
            while(i < parameterIds.length){
                this._setParameterValue(parameterUpdates[parameterIds[i]], interpolate);
                i++;
            }
        }
        _setParameterValue(parameterUpdate, interpolate) {
            const { id, value, normalized } = parameterUpdate;
            const parameter = this._parameterState[id];
            if (!parameter) return;
            if (!normalized) parameter.value = value;
            else parameter.normalizedValue = value;
            const interpolator = this._parameterInterpolators[id];
            if (interpolate) interpolator.setEndValue(parameter.value);
            else interpolator.setStartValue(parameter.value);
        }
        _interpolateParameterValues(startIndex, endIndex) {
            const parameterIds = Object.keys(this._parameterInterpolators);
            let i = 0;
            while(i < parameterIds.length){
                this._parameterInterpolators[parameterIds[i]].process(startIndex, endIndex);
                i++;
            }
        }
        _connectEvents(wamInstanceId, output) {
            webAudioModules.connectEvents(this.groupId, this.instanceId, wamInstanceId, output);
        }
        _disconnectEvents(wamInstanceId, output) {
            if (typeof wamInstanceId === "undefined") {
                webAudioModules.disconnectEvents(this.groupId, this.instanceId);
                return;
            }
            webAudioModules.disconnectEvents(this.groupId, this.instanceId, wamInstanceId, output);
        }
        _getProcessingSlices() {
            const response = "add/event";
            const { currentTime, sampleRate } = audioWorkletGlobalScope;
            const eventsBySampleIndex = {};
            let i = 0;
            while(i < this._eventQueue.length){
                const { id, event } = this._eventQueue[i];
                const offsetSec = event.time - currentTime;
                const sampleIndex = offsetSec > 0 ? Math.round(offsetSec * sampleRate) : 0;
                if (sampleIndex < this._samplesPerQuantum) {
                    if (eventsBySampleIndex[sampleIndex]) eventsBySampleIndex[sampleIndex].push(event);
                    else eventsBySampleIndex[sampleIndex] = [
                        event
                    ];
                    if (id) this.port.postMessage({
                        id,
                        response
                    });
                    else if (this._eventSabReady) this._eventWriter.write(event);
                    else this.port.postMessage({
                        event
                    });
                    this._eventQueue.shift();
                    i = -1;
                } else break;
                i++;
            }
            const processingSlices = [];
            const keys = Object.keys(eventsBySampleIndex);
            if (keys[0] !== "0") {
                keys.unshift("0");
                eventsBySampleIndex["0"] = [];
            }
            const lastIndex = keys.length - 1;
            i = 0;
            while(i < keys.length){
                const key = keys[i];
                const startSample = parseInt(key);
                const endSample = i < lastIndex ? parseInt(keys[i + 1]) : this._samplesPerQuantum;
                processingSlices.push({
                    range: [
                        startSample,
                        endSample
                    ],
                    events: eventsBySampleIndex[key]
                });
                i++;
            }
            return processingSlices;
        }
        _processEvent(event) {
            switch(event.type){
                case "wam-automation":
                    this._setParameterValue(event.data, true);
                    break;
                case "wam-transport":
                    this._onTransport(event.data);
                    break;
                case "wam-midi":
                    this._onMidi(event.data);
                    break;
                case "wam-sysex":
                    this._onSysex(event.data);
                    break;
                case "wam-mpe":
                    this._onMpe(event.data);
                    break;
                case "wam-osc":
                    this._onOsc(event.data);
                    break;
                default:
                    break;
            }
        }
        _process(startSample, endSample, inputs, outputs, parameters) {
            console.error("_process not implemented!");
        }
    }
    if (audioWorkletGlobalScope.AudioWorkletProcessor) {
        if (!ModuleScope.WamProcessor) ModuleScope.WamProcessor = WamProcessor;
    }
    return WamProcessor;
};
var WamProcessor_default = getWamProcessor;
// src/WamNode.js
var RingBuffer = RingBuffer_default();
var WamEventRingBuffer = WamEventRingBuffer_default();
var WamNode = class extends AudioWorkletNode {
    static async addModules(audioContext, moduleId) {
        const { audioWorklet } = audioContext;
        await addFunctionModule_default(audioWorklet, RingBuffer_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamEventRingBuffer_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamArrayRingBuffer_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamParameter_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamParameterInfo_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamParameterInterpolator_default, moduleId);
        await addFunctionModule_default(audioWorklet, WamProcessor_default, moduleId);
    }
    constructor(module, options){
        const { audioContext, groupId, moduleId, instanceId } = module;
        options.processorOptions = {
            groupId,
            moduleId,
            instanceId,
            ...options.processorOptions
        };
        super(audioContext, moduleId, options);
        this.module = module;
        this._supportedEventTypes = /* @__PURE__ */ new Set([
            "wam-automation",
            "wam-transport",
            "wam-midi",
            "wam-sysex",
            "wam-mpe",
            "wam-osc"
        ]);
        this._messageId = 1;
        this._pendingResponses = {};
        this._pendingEvents = {};
        this._useSab = false;
        this._eventSabReady = false;
        this._destroyed = false;
        this.port.onmessage = this._onMessage.bind(this);
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
    async getParameterInfo(...parameterIds) {
        const request = "get/parameterInfo";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    parameterIds
                }
            });
        });
    }
    async getParameterValues(normalized, ...parameterIds) {
        const request = "get/parameterValues";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    normalized,
                    parameterIds
                }
            });
        });
    }
    async setParameterValues(parameterValues) {
        const request = "set/parameterValues";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    parameterValues
                }
            });
        });
    }
    async getState() {
        const request = "get/state";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request
            });
        });
    }
    async setState(state) {
        const request = "set/state";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    state
                }
            });
        });
    }
    async getCompensationDelay() {
        const request = "get/compensationDelay";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request
            });
        });
    }
    addEventListener(type, callback, options) {
        if (this._supportedEventTypes.has(type)) super.addEventListener(type, callback, options);
    }
    removeEventListener(type, callback, options) {
        if (this._supportedEventTypes.has(type)) super.removeEventListener(type, callback, options);
    }
    scheduleEvents(...events) {
        let i = 0;
        const numEvents = events.length;
        if (this._eventSabReady) i = this._eventWriter.write(...events);
        while(i < numEvents){
            const event = events[i];
            const request = "add/event";
            const id = this._generateMessageId();
            let processed = false;
            new Promise((resolve, reject)=>{
                this._pendingResponses[id] = resolve;
                this._pendingEvents[id] = ()=>{
                    if (!processed) reject();
                };
                this.port.postMessage({
                    id,
                    request,
                    content: {
                        event
                    }
                });
            }).then((resolved)=>{
                processed = true;
                delete this._pendingEvents[id];
                this._onEvent(event);
            }).catch((rejected)=>{
                delete this._pendingResponses[id];
            });
            i++;
        }
    }
    async clearEvents() {
        const request = "remove/events";
        const id = this._generateMessageId();
        const ids = Object.keys(this._pendingEvents);
        if (ids.length) return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request
            });
        }).then((clearedIds)=>{
            clearedIds.forEach((clearedId)=>{
                this._pendingEvents[clearedId]();
                delete this._pendingEvents[clearedId];
            });
        });
    }
    connectEvents(toId, output) {
        const request = "connect/events";
        const id = this._generateMessageId();
        new Promise((resolve, reject)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    wamInstanceId: toId,
                    output
                }
            });
        });
    }
    disconnectEvents(toId, output) {
        const request = "disconnect/events";
        const id = this._generateMessageId();
        new Promise((resolve, reject)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request,
                content: {
                    wamInstanceId: toId,
                    output
                }
            });
        });
    }
    destroy() {
        if (this._audioToMainInterval) clearInterval(this._audioToMainInterval);
        this.port.postMessage({
            destroy: true
        });
        this.port.close();
        this.disconnect();
        this._destroyed = true;
    }
    _generateMessageId() {
        return this._messageId++;
    }
    async _initialize() {
        const request = "initialize/processor";
        const id = this._generateMessageId();
        return new Promise((resolve)=>{
            this._pendingResponses[id] = resolve;
            this.port.postMessage({
                id,
                request
            });
        });
    }
    _onMessage(message) {
        const { data } = message;
        const { response, event, eventSab } = data;
        if (response) {
            const { id, content } = data;
            const resolvePendingResponse = this._pendingResponses[id];
            if (resolvePendingResponse) {
                delete this._pendingResponses[id];
                resolvePendingResponse(content);
            }
        } else if (eventSab) {
            this._useSab = true;
            const { eventCapacity, parameterIds } = eventSab;
            if (this._eventSabReady) {
                this._eventWriter.setParameterIds(parameterIds);
                this._eventReader.setParameterIds(parameterIds);
                return;
            }
            this._mainToAudioEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
            this._audioToMainEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
            this._eventWriter = new WamEventRingBuffer(RingBuffer, this._mainToAudioEventSab, parameterIds);
            this._eventReader = new WamEventRingBuffer(RingBuffer, this._audioToMainEventSab, parameterIds);
            const request = "initialize/eventSab";
            const id = this._generateMessageId();
            new Promise((resolve, reject)=>{
                this._pendingResponses[id] = resolve;
                this.port.postMessage({
                    id,
                    request,
                    content: {
                        mainToAudioEventSab: this._mainToAudioEventSab,
                        audioToMainEventSab: this._audioToMainEventSab
                    }
                });
            }).then((resolved)=>{
                this._eventSabReady = true;
                this._audioToMainInterval = setInterval(()=>{
                    const events = this._eventReader.read();
                    events.forEach((e)=>{
                        this._onEvent(e);
                    });
                }, 100);
            });
        } else if (event) this._onEvent(event);
    }
    _onEvent(event) {
        const { type } = event;
        this.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            detail: event
        }));
    }
};
// src/apiVersion.js
var apiVersion_default = "2.0.0-alpha.6";
// src/initializeWamHost.js
var initializeWamHost = async (audioContext, hostGroupId = `wam-host-${performance.now().toString()}`, hostGroupKey = performance.now().toString())=>{
    await addFunctionModule_default(audioContext.audioWorklet, WamEnv_default, apiVersion_default);
    await addFunctionModule_default(audioContext.audioWorklet, WamGroup_default, hostGroupId, hostGroupKey);
    return [
        hostGroupId,
        hostGroupKey
    ];
};
var initializeWamHost_default = initializeWamHost;

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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5B6K5":[function(require,module,exports) {
// import CompositeAudioNode from '@webaudiomodules/sdk/'
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MIDI", ()=>MIDI);
parcelHelpers.export(exports, "createSamplerEngine", ()=>createSamplerEngine);
var _sdkParammgr = require("@webaudiomodules/sdk-parammgr");
class MIDI {
    static NOTE_ON = 0x90;
    static NOTE_OFF = 0x80;
    static CC = 0xB0;
}
class SamplerPlugin extends (0, _sdkParammgr.CompositeAudioNode) {
    /**
	 * @type {ParamMgrNode}
	 */ _wamNode = undefined;
    isEnabled = true;
    pack = undefined;
    audioBuffers = new Map();
    samples = new Map();
    get paramMgr() {
        return this._wamNode;
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
    constructor(context, options){
        super(context, options);
        this.createNodes();
    }
    // // The plugin redefines the async method createAudionode()
    // // that must return an <Audionode>
    // async createAudioNode(options) {
    // 	return this.wetGainNode
    // }
    /**
	 * Mandatory
	 * @param {ParamMgrNode} wamNode
	 */ setup(paramMgr) {
        paramMgr.addEventListener("wam-midi", (e)=>this.processMIDIEvents([
                {
                    event: e.detail.data.bytes,
                    time: 0
                }
            ]));
        this._wamNode = paramMgr;
        this.connectNodes();
        this._output = this.outputNode;
        console.log("sampler.wam CONSTRUCTOR SETUP", {
            thiswamNode: this._wamNode
        });
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
    async noteOn(noteNumber, velocity = 1) {
        console.log("SAMPLER : NOTE ON", {
            noteNumber,
            velocity
        }, this);
    }
    // FIXME: Fade out the gate
    async noteOff(noteNumber, velocity = 0) {
        // this.volume = velocity
        console.log("note off", {
            noteNumber,
            velocity
        }, this);
    }
    /**
	 * mandatory, will create default input and output
	 */ createNodes() {
        this.outputNode = this.context.createGain();
        this.dryGainNode = this.context.createGain();
        this.wetGainNode = this.context.createGain();
        this.delayNode = this.context.createDelay(0.05);
        this.feedbackGainNode = this.context.createGain();
    }
    connectNodes() {
        super.connect(this.wetGainNode);
        super.connect(this.dryGainNode);
        this.wetGainNode.gain.value = 0.5;
        this.wetGainNode.connect(this.delayNode);
        this.delayNode.delayTime.value = 0.05;
        this.delayNode.connect(this.feedbackGainNode);
        this.feedbackGainNode.gain.value = 0.6;
        // this.feedbackGainNode.connect(this.delayNode)
        this.feedbackGainNode.connect(this.wetGainNode);
        this.wetGainNode.connect(this.outputNode);
        this.dryGainNode.connect(this.outputNode);
    }
    async loadAudioArrayBuffer(path) {
        const response = await fetch(path);
        return await response.arrayBuffer();
    }
    /**
	 * We cache all audioBuffer data for re-use later or until
	 * we flushData()
	 * 
	 * @param {String} path - to audio file mp3/wav/ogg etc
	 * @param {Boolean} replaceExisting - forget cache and reload fresh
	 * @returns 
	 */ async loadAudio(path, replaceExisting = false) {
        const existing = this.audioBuffers.get(path);
        if (!replaceExisting && existing !== undefined) return existing;
        const arrayBuffer = await this.loadAudioArrayBuffer(path);
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(path, audioBuffer);
        return audioBuffer;
    }
    fetchAudioBuffer(audioBuffer, replaceExisting = true) {
        const existingAudioBuffer = this.samples.get(audioBuffer);
        if (!replaceExisting && existingAudioBuffer !== undefined) {
            existingAudioBuffer.stop();
            return existingAudioBuffer;
        }
        // FIXME: Re-use one buffer source per sample?
        const trackSource = this.context.createBufferSource();
        // const disconnectTrack = (error) => {
        // 	trackSource.disconnect()
        // 	active = false
        // 	return error ? false : true
        // }	
        // trackSource.onended = disconnectTrack
        // trackSource.onerror = disconnectTrack
        trackSource.connect(this.wetGainNode);
        trackSource.buffer = audioBuffer;
        this.samples.set(audioBuffer, trackSource);
        return trackSource;
    }
    // play( await loadAudio(path) , 50 )
    async play(audioBuffer, offset = 0, velocity = 128, options = {
        loop: false
    }) {
        // FIXME: Re-use one buffer source per sample?
        let trackSource = this.fetchAudioBuffer(audioBuffer);
        trackSource.loop = options.loop || false;
        if (this.context.state === "suspended") await this.context.resume();
        if (offset == 0) trackSource.start(0);
        else trackSource.start(0, this.context.currentTime - offset);
    }
}
exports.default = SamplerPlugin;
const createSamplerEngine = (audioContext, descriptor, options)=>new SamplerPlugin(audioContext, options);

},{"@webaudiomodules/sdk-parammgr":"6mWq3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iPQ36":[function(require,module,exports) {
module.exports = require("358d1fc8a5b12c42").getBundleURL("1VY28") + "descriptor.1f16be45.js" + "?" + Date.now();

},{"358d1fc8a5b12c42":"lgJ39"}],"lgJ39":[function(require,module,exports) {
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

},{}],"8vpQT":[function(require,module,exports) {
module.exports = JSON.parse('{"name":"Sampler","identifier":"com.designerzen.sampler","vendor":"designerzen","description":"Simple Sample Player","version":"1.0.0","apiVersion":"2.0.0","thumbnail":"screenshot.png","keywords":["sampler"],"website":"https://interface.place","isInstrument":true,"hasMidiInput":true,"hasAudioInput":false,"hasAudioOutput":true}');

},{}]},["dtajS","AKp3Y"], "AKp3Y", "parcelRequireaaed")

//# sourceMappingURL=sampler.f1a97295.js.map
