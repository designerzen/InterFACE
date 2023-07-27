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
})({"1l47W":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "a56909e6623e57a9";
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

},{}],"agJ2u":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ShareMenu", ()=>e);
const t = (t)=>t.nodeType === Node.ELEMENT_NODE && t.nodeName.startsWith("SHARE-TARGET-"), i = (t)=>{
    const i = t;
    return "string" == typeof i.displayName && "string" == typeof i.color && "string" == typeof i.icon && "function" == typeof i.share;
};
class e extends HTMLElement {
    get opened() {
        return this.hasAttribute("opened");
    }
    set opened(t) {
        t ? this.setAttribute("opened", "") : this.removeAttribute("opened");
    }
    get dialogTitle() {
        return this.getAttribute("dialog-title");
    }
    set dialogTitle(t) {
        this.setAttribute("dialog-title", t);
    }
    get copyHint() {
        return this.getAttribute("copy-hint");
    }
    set copyHint(t) {
        this.setAttribute("copy-hint", t);
    }
    get text() {
        return this.getAttribute("text");
    }
    set text(t) {
        this.setAttribute("text", t);
    }
    get title() {
        return this.getAttribute("title");
    }
    set title(t) {
        this.setAttribute("title", t);
    }
    get url() {
        return this.getAttribute("url");
    }
    set url(t) {
        this.setAttribute("url", t);
    }
    get noBackdrop() {
        return this.hasAttribute("no-backdrop");
    }
    set noBackdrop(t) {
        t ? this.setAttribute("no-backdrop", "") : this.removeAttribute("no-backdrop");
    }
    get handle() {
        return this.getAttribute("handle");
    }
    set handle(t) {
        this.setAttribute("handle", t);
    }
    get targets() {
        return this.t;
    }
    constructor(){
        super(), this.t = [], this.i = ":host{font-family:Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';position:fixed;top:0;left:0;width:100%;height:100%;max-height:100%;z-index:-1;will-change:z-index;transition:z-index .3s step-end;overflow-y:auto;display:none}:host([opened]){z-index:9999;transition:z-index .3s step-start}*{box-sizing:border-box}#backdrop{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;background:var(--backdrop-color,#000);will-change:opacity;transition:opacity .3s cubic-bezier(.4,0,1,1);cursor:pointer;z-index:-1}#dialog,.target{will-change:transform}:host([opened]) #backdrop{opacity:.6;transition:opacity .3s cubic-bezier(0,0,.2,1)}:host([no-backdrop]) #backdrop{display:none}#dialog{margin:100vh auto 0;background:var(--background-color,#fff);width:100%;max-width:640px;transform:translateY(100vh);transition:transform .3s cubic-bezier(.4,0,1,1);border-radius:16px 16px 0 0}:host([opened]) #dialog{transform:translateY(0);transition:transform .3s cubic-bezier(0,0,.2,1)}#handle{padding:18px 0 4px}:host([handle=never]) #handle{display:none}@media (pointer:fine){:host([handle=auto]) #handle{display:none}}#handle::after{content:'';display:block;width:24px;height:4px;border-radius:2px;background:var(--handle-color,rgba(0,0,0,.6));margin:auto}hr{margin:0;border-style:solid;border-color:var(--divider-color,rgba(0,0,0,.12))}#title{color:var(--title-color,rgba(0,0,0,.6));font-weight:500;font-size:18px;margin:0;padding:18px;text-align:center}#clipboard-container{display:grid;grid-template:72px/1fr 72px;align-items:center;padding:24px 12px 24px 24px}#clipboard-container>p{margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}#targets-container{display:flex;flex-wrap:wrap;justify-content:center;padding:12px}.target{padding:12px;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;appearance:none;cursor:pointer;border:none;outline:0;background:0 0;transition:transform .3s}.target:hover{transform:scale(1.05)}.clipboard-icon,.icon{position:relative;border-radius:50%}.icon{width:42px;height:42px;padding:12px;fill:#fff}.clipboard-icon{width:26px;height:26px;padding:2px;fill:var(--hint-color,rgba(0,0,0,.6))}.clipboard-icon::after,.clipboard-icon::before,.icon::after,.icon::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;background:var(--ripple-color,#fff);opacity:.3;will-change:transform;transition:transform .3s;transform:scale(0)}.clipboard-icon::after,.icon::after{opacity:.4}.target:active .clipboard-icon::after,.target:active .icon::after,.target:focus .clipboard-icon::before,.target:focus .icon::before{transform:scale(1)}.hint,.label{width:72px;font-weight:400;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.label{padding-top:10px;color:var(--labels-color,rgba(0,0,0,.87));font-size:14px}.hint{padding-top:4px;color:var(--hint-color,rgba(0,0,0,.6));font-size:12px}slot{display:none}", this.o = document.createElement("template"), this.o.innerHTML = (e.h ? "" : `<style>${this.i}</style>`) + '<div id="backdrop"part="backdrop"tabindex="-1"></div><div id="dialog"part="dialog"aria-labelledby="title"role="dialog"><div id="handle"></div><h2 id="title"part="title"></h2><div id="clipboard-container"><p id="clipboard-preview"></p><button class="target"id="clipboard"><div class="clipboard-icon"><svg viewBox="0 0 256 256"><path d="M180 233H41V70H17v164a23 23 0 0024 22h139zm36-24a23 23 0 0023-23V23v-1a23 23 0 00-24-22H87a23 23 0 00-23 23v163a23 23 0 0023 23h128zm-1-23H87V23h128z"/></svg></div><div id="copy-hint"class="hint"></div></button></div><hr><div id="targets-container"></div></div><slot></slot>', this.attachShadow({
            mode: "open"
        }), e.h && (e.stylesheet = new CSSStyleSheet, this.shadowRoot.adoptedStyleSheets = [
            e.stylesheet
        ]), this.shadowRoot.appendChild(this.o.content.cloneNode(!0));
    }
    share({ text: t = this.text, title: i = this.title, url: e = this.url } = {}) {
        return this.text = t, this.title = i, this.url = e, navigator.share ? navigator.share({
            text: this.text,
            title: this.title,
            url: this.url
        }).then(()=>{
            this.opened = !1, [
                "share",
                "close"
            ].forEach((t)=>this.l(t, {
                    origin: "native"
                }));
        }).catch(({ name: t })=>{
            if ("AbortError" !== t) return this.p();
            this.l("close", {
                origin: "native"
            });
        }) : this.p();
    }
    connectedCallback() {
        var o, s;
        if (e.h && e.stylesheet && 0 === e.stylesheet.cssRules.length && e.stylesheet.replace(this.i), null === this.text && (this.text = (null === (o = document.querySelector("meta[name=description]")) || void 0 === o ? void 0 : o.content) || ""), null === this.title && (this.title = document.title || ""), null === this.url && (this.url = (null === (s = document.querySelector("link[rel=canonical]")) || void 0 === s ? void 0 : s.href) || window.location.href), this.dialogTitle || (this.dialogTitle = "Share"), this.copyHint || (this.copyHint = "Copy"), this.handle || (this.handle = "auto"), this.g = this.shadowRoot.querySelector("#backdrop"), this.u = this.shadowRoot.querySelector("#dialog"), this.v = this.shadowRoot.querySelector("#title"), this.v.textContent = this.dialogTitle, this.m = this.shadowRoot.querySelector("#targets-container"), this.k = this.shadowRoot.querySelector("#copy-hint"), this.k.textContent = this.copyHint, this.$ = this.shadowRoot.querySelector("#clipboard-preview"), this.$.innerHTML = `${this.title}<br>${this.text}<br>${this.url}`, navigator.clipboard) {
            const t = this.shadowRoot.querySelector("#clipboard");
            t.addEventListener("click", ()=>{
                var t;
                null === (t = navigator.clipboard) || void 0 === t || t.writeText(`${this.title}\n\n${this.text}\n\n${this.url}`).catch((t)=>this.dispatchEvent(new ErrorEvent("error", {
                        message: "Unable to copy to clipboard",
                        error: t
                    }))), this.l("share", {
                    target: "clipboard",
                    origin: "fallback"
                }), this.S();
            }), this.H = t;
        } else {
            const t = this.shadowRoot.querySelector("#clipboard-container");
            t.parentNode.removeChild(t);
        }
        const r = this.shadowRoot.querySelector("slot");
        r.addEventListener("slotchange", async ()=>{
            const e = r.assignedNodes({
                flatten: !0
            }).filter(t);
            await Promise.all(e.map((t)=>customElements.whenDefined(t.nodeName.toLowerCase()))), this.t = e.filter(i), this.C();
        });
    }
    attributeChangedCallback(t, i, e) {
        if (i !== e) switch(t){
            case "dialog-title":
                this.v && (this.v.textContent = e);
                break;
            case "copy-hint":
                this.k && (this.k.textContent = e);
                break;
            case "opened":
                null === e ? this.S() : this.share();
                break;
            case "text":
            case "title":
            case "url":
                this.$ && (this.$.innerHTML = `${this.title}<br>${this.text}<br>${this.url}`);
        }
    }
    C() {
        this.m && (this.m.innerHTML = "", this.t.forEach((t, i)=>{
            const { nodeName: e, color: o, icon: s, displayName: r, hint: a } = t, n = e.slice(13).toLowerCase(), h = document.createElement("button");
            h.className = "target", h.id = n, h.title = r, h.setAttribute("part", "target-button"), h.addEventListener("click", ()=>{
                t.share(this), this.l("share", {
                    target: n,
                    origin: "fallback"
                }), this.S();
            });
            const l = document.createElement("div");
            l.className = "icon", l.innerHTML = `<svg viewBox="0 0 256 256"><path d="${s}"/></svg>`, l.style.background = `#${o}`, l.setAttribute("part", "target-icon"), h.appendChild(l);
            const c = document.createElement("div");
            if (c.className = "label", c.textContent = r, c.setAttribute("part", "target-label"), h.appendChild(c), a) {
                const t = document.createElement("div");
                t.className = "hint", t.textContent = a, h.appendChild(t);
            }
            this.m.appendChild(h), navigator.clipboard || 0 !== i || (this.H = h), i === this.t.length - 1 && (this.T = h);
        }));
    }
    openWindow(t, i = {}, e) {
        const o = Object.entries(i);
        return window.open(i ? `${t}${o.length > 0 ? `?${new URLSearchParams(o.reduce((t, [i, e])=>Object.assign(Object.assign({}, t), void 0 !== e && {
                [i]: `${e}`
            }), {})).toString()}` : ""}` : t, e ? "_self" : "_blank", `width=${screen.width / 2},height=${screen.height / 2},left=${screen.width / 4},top=${screen.height / 4},menubar=0,status=0,titlebar=0,toolbar=0`);
    }
    l(t, i) {
        return this.dispatchEvent(new CustomEvent(t, {
            bubbles: !0,
            composed: !0,
            detail: i
        }));
    }
    p() {
        return new Promise((t)=>{
            this._ = document.activeElement, this.style.display = "block", this.H.focus(), this.scrollTop = Math.max(window.innerHeight / 2, window.innerHeight - this.u.offsetHeight), this.opened = !0, this.g.addEventListener("click", this.S.bind(this)), this.addEventListener("scroll", this.j.bind(this)), this.addEventListener("keydown", this.A.bind(this)), this.addEventListener("share", (function i() {
                this.removeEventListener("share", i), t();
            }).bind(this));
        });
    }
    S() {
        this.g.removeEventListener("click", this.S), this.removeEventListener("scroll", this.j), this.opened = !1, this.scroll({
            behavior: "smooth",
            top: 0
        }), this._ && (this._.focus(), this._ = null), setTimeout(()=>{
            this.style.display = "none", this.l("close", {
                origin: "fallback"
            });
        }, 300);
    }
    j() {
        this.scrollTop < 80 && this.S();
    }
    A(t) {
        switch(t.key){
            case "Escape":
                this.S();
                break;
            case "Tab":
                if (this.t.length < 2) {
                    t.preventDefault();
                    break;
                }
                const i = this.shadowRoot.activeElement || document.activeElement;
                t.shiftKey && i === this.H ? (t.preventDefault(), this.T.focus()) : t.shiftKey || i !== this.T || (t.preventDefault(), this.H.focus());
        }
    }
}
e.observedAttributes = [
    "dialog-title",
    "copy-hint",
    "opened",
    "text",
    "title",
    "url",
    "no-backdrop",
    "handle"
], e.h = "adoptedStyleSheets" in Document.prototype, window.customElements.define("share-menu", e);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["1l47W"], null, "parcelRequireaaed")

//# sourceMappingURL=share-menu.623e57a9.js.map
