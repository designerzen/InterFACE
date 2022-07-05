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
})({"7Qo3L":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "c6625cd32675afee";
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

},{}],"b6SeL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _locationHandler = require("./location-handler");
var _loadProgress = require("./dom/load-progress");
var _version = require("./version");
var _i18N = require("./i18n");
var _settings = require("./settings");
var _pwa = require("./pwa/pwa");
var _store = require("./store");
var _errors = require("./dom/errors");
var _tooltips = require("./dom/tooltips");
var _mouse = require("./hardware/mouse");
var _capabilities = require("./capabilities");
var _capabilitiesDefault = parcelHelpers.interopDefault(_capabilities);
var _attractor = require("./attractor");
var _attractorDefault = parcelHelpers.interopDefault(_attractor);
const LTD = (0, _locationHandler.getRefererHostname)().split(".").pop();
const IS_DEVELOPMENT_MODE = true;
const body = document.documentElement;
const debugMode = IS_DEVELOPMENT_MODE || new URLSearchParams(window.location.search).has("debug");
// if on http flip to https and exit
(0, _locationHandler.forceSecure)(IS_DEVELOPMENT_MODE);
const capabilities = new (0, _capabilitiesDefault.default)();
// TODO: 
// ESCAPE - no cameras found on system?
// ESCAPE - no GPU?
// start loading / updating...
body.classList.add("loading", IS_DEVELOPMENT_MODE ? "debug" : LTD);
// FIXME: show updates button
const showUpgradeDialog = ()=>{
    const updateButton = document.getElementById("button-update");
    const changes = (0, _pwa.showChangelog)(document.getElementById("changelog"));
    document.getElementById("pwa").setAttribute("open", true);
    updateButton.setAttribute("hidden", false);
};
const start = ()=>{
    // if we have a specific referer, we can change the options accordingly
    // allow different domains to show different styles / options / configs
    // current domains that point this way include :
    // interface.place
    // interface.lol	<- defaults to simple 'kid' mode
    // interface.band	<- defaults to duet mode
    // const referer = getReferer()
    const defaultOptions = (0, _settings.getDomainDefaults)(LTD);
    const language = (0, _i18N.getBrowserLocales)()[0];
    const store = (0, _store.createStore)();
    require("a91a3d2b644d6c5a").then(async ({ createInterface  })=>{
        let halfLoaded = false;
        const title = document.title;
        try {
            const application = await createInterface(defaultOptions, store, capabilities, language, (loadProgress, message)=>{
                if (loadProgress === 1) {
                    if (!halfLoaded) {
                        halfLoaded = true;
                        (0, _loadProgress.setLoadProgress)(0.99, " ");
                    } else (0, _loadProgress.setLoadProgress)(1, "Ready!");
                    document.title = title;
                } else {
                    (0, _loadProgress.setLoadProgress)(loadProgress, message);
                    document.title = title + " - " + Math.ceil(loadProgress * 100) + "%";
                }
            });
            const automator = application.setAutomator(new (0, _attractorDefault.default)(application));
            // console.log("Attract mode!", {automator, application})
            // let installation = null
            // // at any point we can now trigger the installation
            // if (installation)
            // {
            // 	try{
            // 		const destination = document.getElementById("shared-controls")
            // 		const needsInstall = await installation( destination )		
            // 		canBeInstalled = needsInstall
            // 	}catch(error){
            // 		body.classList.add("installation-unavailable")
            // 		console.error("Install/Update issue", error)
            // 	}
            // }else{
            // 	// console.log("Loaded Webpage")
            // }
            // const Attractor = await import('./attractor.js')
            // For automatic stuff...
            // const attractMode = new Attractor( application )
            // Show hackers message to debuggers
            if (application.debug) console.log(`InterFACE Version ${(0, _version.VERSION)} from ${(0, _locationHandler.getReferer)()} in ${language} used ${application.count} times, last time was ${Math.ceil(application.timeElapsedSinceLastPlay / 1000)} seconds ago`, {
                application
            });
        } catch (error) {
            // body.classList.add("failed")
            //uninstall()
            (0, _errors.showError)(error, "Oh no! Try a hard refresh (CTRL-SHIFT-R)");
            console.error("Ultimate failure - remove loading - add error class?");
        }
    });
};
// import {installer} from './install'
// import {update}  from './update.js'
// const test = async ()=>{
// 	const {installer} = await import('./install.js')
// 	const {update} = await import('./update.js')
// 	const destination = document.getElementById("shared-controls")
// 	const install = await installer(true)
// 	const needsInstall = await install( destination )		
// 	const needsUpdate = await update()
// }
// test()
// PWA Install / Update / Load from cache
// needs to be run early on ideally and in a seperate thread
// loads in the relevant data to determine if the app needs to be 
// updated if installed or installed if uninstalled
const versionElement = document.getElementById("version");
const runningVersion = versionElement.innerText;
(0, _pwa.installOrUpdate)(debugMode, runningVersion).then((state)=>{
    // this is the amount of time to run before we "check" for things
    // const TIME_BEFORE_REFRESH = 24 * 60 * 60 * 1000
    if (debugMode) console.info("PWA", state.log, {
        state
    });
    // add custom classes to elements so that we can 
    // show a bit more useful feedback about the status of the web app
    // and whether it is installed / has updates available etc...
    // TODO: Add an update button!?
    // previousVersion, currentVersion,
    // isInstallable, isFirstRun, isRunningAsApp, install:(), updatesAvailable, updating, updated, update:()
    // add some useful classes to <body> element for styling
    body.classList.toggle("updates-available", state.hasUpdates);
    body.classList.toggle("first-run", state.isFirstRun);
    body.classList.toggle("installable", state.isInstallable);
    body.classList.toggle("installed", state.isRunningAsApp);
    if (state.isInstallable) {
        // hook into button and show...
        const installButton = document.getElementById("button-install");
        installButton.addEventListener("click", async (event)=>{
            const installed = await state.install(installButton);
            console.log("installed", installed.success, {
                installed
            });
            (0, _tooltips.setToast)(installed.success ? "Installed to HomeScreen" : "You can always install again in the future");
        });
        installButton.hidden = false;
    } else if (state.updatesAvailable) showUpgradeDialog();
//setToast( canBeInstalled ? "You can install this as an app...<br>Click install when prompted!" : "" )
}).catch((error)=>{
    console.error("PWA", error);
}).finally((p)=>{
    start();
}).catch((error)=>{
    // uninstall() ?
    console.error("FATAL ERROR ;(", error);
});
const versionButton = document.getElementById("version");
(0, _mouse.addMouseTapAndHoldEvents)(versionButton);
versionButton.addEventListener((0, _mouse.MOUSE_TAP), (event)=>{
// allow pass through to github
});
versionButton.addEventListener((0, _mouse.MOUSE_HELD), (event)=>{
    // Show dialog for upgrade?
    showUpgradeDialog();
});

},{"./location-handler":"iYStN","./dom/load-progress":"7KwQi","./version":"7AyKa","./i18n":"gseYz","./settings":"heiex","./pwa/pwa":"kOXsT","./store":"6qVfF","./dom/errors":"kOYvE","./dom/tooltips":"8RoHD","./hardware/mouse":"5goDw","./capabilities":"4LUzi","./attractor":"kFspz","a91a3d2b644d6c5a":"ax5Is","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iYStN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "parseType", ()=>parseType);
parcelHelpers.export(exports, "getLocationSettings", ()=>getLocationSettings);
parcelHelpers.export(exports, "createQueryString", ()=>createQueryString);
parcelHelpers.export(exports, "getShareLink", ()=>getShareLink);
parcelHelpers.export(exports, "getReferer", ()=>getReferer);
parcelHelpers.export(exports, "getRefererHostname", ()=>getRefererHostname);
parcelHelpers.export(exports, "refresh", ()=>refresh);
parcelHelpers.export(exports, "forceSecure", ()=>forceSecure);
parcelHelpers.export(exports, "addToHistory", ()=>addToHistory);
/**
 *  Convert a URL query value into a JS data type by inferring the type
 * @param {Any} JavaScript data type (eg. String, Number, Boolean, Array, Object)
 */ const guessType = (value)=>{
    if (typeof value === "string") {
        const lower = value.toLowerCase();
        // check for bool and such
        if (lower === "true" || lower === "1") return true;
        else if (lower === "false" || lower === "0") return false;
        return value;
    } else if (Array.isArray(value)) // Array convert the array to a string?
    // convert booleans from 1 / 0 ?
    return value.toString();
    else return data;
};
const parseType = (value)=>{
    // check to see if the string is also an array...
    if (typeof value === "string") {
        if (!isNaN(parseFloat(value))) return parseFloat(value);
        else if (value.toLowerCase() === "true") return true;
        else if (value === "false") return false;
        else if (value.indexOf(",") >= 0) // this is a comma seperated list array...
        return convertIntegerArrayToBooleans(value.split(","));
        else return value;
    } else if (Array.isArray(value)) // Array convert the array to a string?
    // convert booleans from 1 / 0 ?
    return value.toString();
    else // God only knows
    return value;
};
/**
 *  Fetch the current URL query as an object
 * @returns {URLSearchParams} URL States
 */ const fetchStateFromURL = ()=>{
    return new URLSearchParams(window.location.search);
};
const getLocationSettings = (defaultOptions)=>{
    {
        const urlParams = fetchStateFromURL();
        const locationOptions = Object.assign({}, defaultOptions);
        for (const [key, value] of urlParams)// NB. ensure we data type these
        locationOptions[key] = guessType(value);
        //console.log(`query:${locationOptions}`)
        return locationOptions;
    }
};
const createQueryString = (options)=>{
    return new URLSearchParams(options).toString();
};
const getShareLink = (options)=>{
    return window.location + createQueryString(options);
};
const getReferer = ()=>{
    const ref = document.referrer;
    // check against our list
    return ref || document.location || "interface.place";
};
const getRefererHostname = ()=>{
    const referrer = new URL(getReferer());
    // now strip out everything but the location
    // check against our list
    return referrer.hostname;
};
const refresh = (options)=>{
    if (options) addToHistory(options);
    window.location.reload();
};
const forceSecure = (debug = false)=>{
    if (!debug && location.hostname !== "localhost" && location.protocol !== "https:") location.protocol = "https:";
    return false;
};
const addToHistory = (options, title = "")=>{
    const url = new URL(window.location);
    for(let i in options){
        const option = options[i];
        url.searchParams.set(i, option);
    //console.log("History", {out, options, title, url} )
    }
    //
    const out = window.history.pushState(options, title, url);
//console.log("History", {out, options, title, url} )
};

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

},{}],"7KwQi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setLoadProgress", ()=>setLoadProgress);
parcelHelpers.export(exports, "getLoadProgress", ()=>getLoadProgress);
const doc = document;
let loadMeter = 0;
let loadMessageIndex = 0;
const LOAD_MESSAGES = [
    "Please wait, this can take<br>up to 6 minutes to load!",
    "Lots of data is required so this can take a long time",
    "Still Loading! Still may take a few minutes yet!",
    "Almost done! Just hang on in there!"
];
const BE_PATIENT_MESSAGES = [
    "Loading.",
    "Loading..",
    "Loading..."
];
const progressMessage = doc.querySelector('label[for="progress-bar"]');
const progressBar = doc.querySelector("progress");
const setLoadProgress = (progress, message)=>{
    const rounded = parseInt(progress);
    const percentage = rounded * 100;
    const hasProgressed = loadMeter !== rounded;
    if (hasProgressed) loadMeter = rounded;
    progressBar.style.setProperty("--progress", loadMeter);
    progressBar.setAttribute("value", loadMeter);
    if (rounded === 0) message = LOAD_MESSAGES[0];
    else if (message && message.length) // use message but break lines?
    // append percentage
    message += " " + percentage + "%";
    else {
        // get prescripted from list...
        message = LOAD_MESSAGES[Math.ceil(progress * (LOAD_MESSAGES.length - 1))];
        message += " " + percentage + "%";
    }
    //console.log("load", {progress, message} , Math.ceil(progress * LOAD_MESSAGES.length), LOAD_MESSAGES)
    if (progressMessage.innerHTML !== message) // only change label text not the input field too?
    progressMessage.innerHTML = message;
    else if (hasProgressed) // add an extra message if it hasn't actually progressed?
    progressMessage.innerHTML = message + " " + BE_PATIENT_MESSAGES[(loadMessageIndex++) % BE_PATIENT_MESSAGES.length - 1];
};
const getLoadProgress = ()=>loadMeter;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7AyKa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
parcelHelpers.export(exports, "DATE", ()=>DATE);
const VERSION = "0.8.21";
const DATE = 1657029024493;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gseYz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "trimLocaleCode", ()=>trimLocaleCode);
parcelHelpers.export(exports, "getBrowserLocales", ()=>getBrowserLocales);
const trimLocaleCode = (locale)=>locale.split(/-|_/)[0];
const getBrowserLocales = (options = {})=>{
    const defaultOptions = {
        languageCodeOnly: false,
        fallback: "en-GB"
    };
    const settings = Object.assign({}, defaultOptions, options);
    const browserLocales = navigator.languages === undefined ? [
        navigator.language
    ] : navigator.languages;
    // we could assume english here but hey
    if (!browserLocales) return settings.fallback ? [
        settings.fallback
    ] : undefined;
    return browserLocales.map((locale)=>{
        const trimmedLocale = locale.trim();
        return settings.languageCodeOnly ? trimLocaleCode(trimmedLocale) : trimmedLocale;
    });
} // TODO: Load pot files
;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"heiex":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MIDI_ID", ()=>MIDI_ID);
parcelHelpers.export(exports, "DEFAULT_TENSORFLOW_OPTIONS", ()=>DEFAULT_TENSORFLOW_OPTIONS);
parcelHelpers.export(exports, "DEFAULT_OPTIONS", ()=>DEFAULT_OPTIONS);
parcelHelpers.export(exports, "KIDS_OPTIONS", ()=>KIDS_OPTIONS);
parcelHelpers.export(exports, "BODY_OPTIONS", ()=>BODY_OPTIONS);
parcelHelpers.export(exports, "DANCE_OPTIONS", ()=>DANCE_OPTIONS);
parcelHelpers.export(exports, "NAMES", ()=>NAMES);
parcelHelpers.export(exports, "getFactoryDefaults", ()=>getFactoryDefaults);
parcelHelpers.export(exports, "getDomainDefaults", ()=>getDomainDefaults);
parcelHelpers.export(exports, "DEFAULT_PERSON_OPTIONS", ()=>DEFAULT_PERSON_OPTIONS);
var _instruments = require("./audio/instruments");
var _palette = require("./palette");
var _easing = require("./maths/easing");
const isDevelopmentMode = true;
const MIDI_ID = "00H 21H 71H";
const DEFAULT_TENSORFLOW_OPTIONS = {
    // or 'tfjs' (mediapipe is far smoother)
    runtime: "mediapipe",
    // location of actual ML model
    // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    // maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
    maxFaces: 1,
    // Whether to load the MediaPipe iris detection model (an additional 2.6 MB of weights). The MediaPipe iris detection model provides (1) an additional 10 keypoints outlining the irises and (2) improved eye region keypoints enabling blink detection. Defaults to true.
    shouldLoadIrisModel: true
};
const DEFAULT_OPTIONS = {
    // this allows us to show some extra options if set to true...
    advancedMode: true,
    // initially show the settings panel
    showSettings: false,
    // play a constant beat
    metronome: false,
    // play music at same time
    backingTrack: false,
    // clear the canvas on every frame
    // also doubles as a video hider
    clear: false,
    // draw video onto canvas every frame (transparent doesn't have to be true then)
    // clear will always take precedence
    synch: true,
    // start in MTV disco mode
    disco: false,
    // AR mode (without this - just video stream or blank)
    overlays: true,
    // show face overlays
    masks: true,
    // show eye tracking
    eyes: true,
    // synchronise the beats with metronome
    quantise: true,
    // show the person's texts above them
    text: true,
    // audio visualiser is actually helpful to play
    spectrogram: true,
    // read out important instructions
    speak: true,
    // show debug texts
    debug: isDevelopmentMode,
    // cancel audio playback (not midi)
    muted: false,
    // dual person mode (required reload)
    duet: false,
    // stereo panning with eyes
    stereo: true,
    // midi channel (0/"all" means send to all)
    midiChannel: "all",
    // saved BPM that can be shared?
    bpm: 200,
    // hide menu if mouse outside of screen...
    autoHide: !isDevelopmentMode,
    // load a midi track automatically on app start
    loadMIDIPerformance: isDevelopmentMode,
    // allow game pads such as the xbox controller to do cool
    // stuff as a modifier for the audio
    useGamePad: true,
    // choice of different models to use
    model: "face",
    // sample set
    instrumentPack: (0, _instruments.INSTRUMENT_PACK_FATBOY),
    instrumentPacks: [
        (0, _instruments.INSTRUMENT_PACK_FATBOY),
        (0, _instruments.INSTRUMENT_PACK_FM),
        (0, _instruments.INSTRUMENT_PACK_MUSYNGKITE)
    ].join(","),
    // global mode that get's passed into person too
    photoSensitive: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches || false
};
const KIDS_OPTIONS = {
    ...DEFAULT_OPTIONS,
    advancedMode: false,
    text: false,
    masks: false
};
const BODY_OPTIONS = {
    ...DEFAULT_OPTIONS,
    // model:'hand'
    backingTrack: true
};
const DANCE_OPTIONS = {
    ...DEFAULT_OPTIONS,
    // model:'hand'
    instrumentPack: (0, _instruments.INSTRUMENT_PACK_MUSYNGKITE),
    instrumentPacks: [
        (0, _instruments.INSTRUMENT_PACK_MUSYNGKITE)
    ].join(",")
};
const NAMES = [
    "a",
    "b",
    "c",
    "d"
].map((m)=>`person-${m}`);
const getFactoryDefaults = (options = DEFAULT_OPTIONS)=>Object.assign({}, options);
const getDomainDefaults = (name)=>{
    switch(name.toLowerCase()){
        // localhost 127.0.0.(1)
        // case 'localhost': 
        // case '1': return getFactoryDefaults(KIDS_OPTIONS)
        case "lol":
            return getFactoryDefaults(KIDS_OPTIONS);
        case "band":
            return getFactoryDefaults();
        case "dance":
            return getFactoryDefaults(DANCE_OPTIONS);
        // defaults to interface.place
        default:
            return getFactoryDefaults();
    }
};
const DEFAULT_PERSON_OPTIONS = {
    ...(0, _palette.DEFAULT_COLOURS),
    // Passed to the delay node
    // NB. There is a global delay too remember
    useDelay: false,
    delayTime: 0.14,
    delayLength: 10,
    // left / right ear stereo panning
    stereoPan: true,
    sendMIDI: true,
    // if you want the axis to be switched
    swapControls: false,
    // if the user has epilepsy, set to true
    photoSensitive: false,
    // force draw face mesh
    drawMesh: false,
    // force draw face blob nodes
    drawNodes: true,
    // alternate between mesh and blobs depending on mouth
    // NB. The two above will override this behaviour
    meshOnSing: false,
    // all the above can be disabled!
    drawMask: true,
    // draw these parts over the mesh...
    drawMouth: true,
    // kid mode turns eyes googly!
    drawEyes: true,
    // ratios of size of eye
    // white bit
    scleraRadius: 1,
    // blue bit
    irisRadius: 0.8,
    // black bit
    pupilRadius: 0.3,
    // frank sidebottom angle
    eyeRatio: 0.8,
    // mouse hold for clicking in seconds 0.5 and more feels weird
    mouseHoldDuration: 0.6,
    // if both eyes are closed for X ms do something...
    eyeShutHolddDuration: 3500,
    // how much feedback to apply to the feedback node
    feedback: 0.1,
    // to adjust the angle that the head has to roll...
    // larger means less movement required
    rollSensitivity: 1.2,
    // to adjust the amount of pitching (head rocking)
    // depending on how complicated the piece is the octaves
    // can also be shifted between a certain range...
    pitchSensitivity: 1,
    // size of the mouth to signal activity
    mouthCutOff: 0.2,
    // size of the mouth to signal silence
    mouthSilence: 0.05,
    // volume smooth rate = smaller means faster fades?
    volumeRate: 0.7,
    // Samples to use for the audio engine INSTRUMENT_PACKS[0]
    //instrumentPack:INSTRUMENT_PACK_MUSYNGKITE,
    instrumentPack: (0, _instruments.INSTRUMENT_PACK_MUSYNGKITE),
    // this is the amount of decimal places used to smooth the mouth
    // the higher the number the less smooth the output is
    // 1 or 2 should be more than enough
    precision: 3,
    // set this to one of the interpolation methods above
    // IN means that it starts off slowly (prefered)
    ease: (0, _easing.easeInSine // easeInSine // linear
    )
};

},{"./audio/instruments":"kJRh1","./palette":"7zTRL","./maths/easing":"kqCqx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kJRh1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MUSICAL_NOTES", ()=>MUSICAL_NOTES);
parcelHelpers.export(exports, "INSTRUMENT_PACK_FM", ()=>INSTRUMENT_PACK_FM);
parcelHelpers.export(exports, "INSTRUMENT_PACK_FATBOY", ()=>INSTRUMENT_PACK_FATBOY);
parcelHelpers.export(exports, "INSTRUMENT_PACK_MUSYNGKITE", ()=>INSTRUMENT_PACK_MUSYNGKITE);
parcelHelpers.export(exports, "INSTRUMENT_PACKS", ()=>INSTRUMENT_PACKS);
parcelHelpers.export(exports, "DEFAULT_FOLDERS", ()=>DEFAULT_FOLDERS);
parcelHelpers.export(exports, "instrumentFolders", ()=>instrumentFolders);
parcelHelpers.export(exports, "instrumentNames", ()=>instrumentNames);
parcelHelpers.export(exports, "getRandomInstrument", ()=>getRandomInstrument);
parcelHelpers.export(exports, "getInstrumentFamily", ()=>getInstrumentFamily);
parcelHelpers.export(exports, "getInstrumentTitle", ()=>getInstrumentTitle);
parcelHelpers.export(exports, "createInstruments", ()=>createInstruments);
parcelHelpers.export(exports, "instrumentCache", ()=>instrumentCache);
parcelHelpers.export(exports, "fetchInstrument", ()=>fetchInstrument);
parcelHelpers.export(exports, "storeInstrument", ()=>storeInstrument);
parcelHelpers.export(exports, "loadInstrumentDataPack", ()=>loadInstrumentDataPack);
parcelHelpers.export(exports, "getFolderNameForInstrument", ()=>getFolderNameForInstrument);
var _generalMidi = require("./midi/general-midi");
const MUSICAL_NOTES = [
    "\u266B",
    "\uD834\uDD5E",
    "\uD834\uDD5F",
    "\uD834\uDD60",
    "\uD834\uDD61",
    "\uD834\uDD62",
    "\uD834\uDD63",
    "\uD834\uDD64"
];
const INSTRUMENT_PACK_FM = "FluidR3_GM";
const INSTRUMENT_PACK_FATBOY = "FatBoy";
const INSTRUMENT_PACK_MUSYNGKITE = "MusyngKite";
const INSTRUMENT_PACKS = [
    INSTRUMENT_PACK_FM,
    INSTRUMENT_PACK_FATBOY
];
const DEFAULT_FOLDERS = [
    "acoustic_grand_piano",
    "bright_acoustic_piano",
    "electric_grand_piano",
    "honkytonk_piano",
    "electric_piano_1",
    "electric_piano_2",
    "harpsichord",
    "clavinet",
    "celesta",
    "glockenspiel",
    "music_box",
    "vibraphone",
    "marimba",
    "xylophone",
    "tubular_bells",
    "dulcimer",
    "drawbar_organ",
    "percussive_organ",
    "rock_organ",
    "church_organ",
    "reed_organ",
    "accordion",
    "harmonica",
    "tango_accordion",
    "acoustic_guitar_nylon",
    "acoustic_guitar_steel",
    "electric_guitar_jazz",
    "electric_guitar_clean",
    "electric_guitar_muted",
    "overdriven_guitar",
    "distortion_guitar",
    "guitar_harmonics",
    "acoustic_bass",
    "electric_bass_finger",
    "electric_bass_pick",
    "fretless_bass",
    "slap_bass_1",
    "slap_bass_2",
    "synth_bass_1",
    "synth_bass_2",
    "violin",
    "viola",
    "cello",
    "contrabass",
    "tremolo_strings",
    "pizzicato_strings",
    "orchestral_harp",
    "timpani",
    "string_ensemble_1",
    "string_ensemble_2",
    "synth_strings_1",
    "synth_strings_2",
    "choir_aahs",
    "voice_oohs",
    "synth_choir",
    "orchestra_hit",
    "trumpet",
    "trombone",
    "tuba",
    "muted_trumpet",
    "french_horn",
    "brass_section",
    "synth_brass_1",
    "synth_brass_2",
    "soprano_sax",
    "alto_sax",
    "tenor_sax",
    "baritone_sax",
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "piccolo",
    "flute",
    "recorder",
    "pan_flute",
    "blown_bottle",
    "shakuhachi",
    "whistle",
    "ocarina",
    "lead_1_square",
    "lead_2_sawtooth",
    "lead_3_calliope",
    "lead_4_chiff",
    "lead_5_charang",
    "lead_6_voice",
    "lead_7_fifths",
    "lead_8_bass__lead",
    "pad_1_new_age",
    "pad_2_warm",
    "pad_3_polysynth",
    "pad_4_choir",
    "pad_5_bowed",
    "pad_6_metallic",
    "pad_7_halo",
    "pad_8_sweep",
    "fx_1_rain",
    "fx_2_soundtrack",
    "fx_3_crystal",
    "fx_4_atmosphere",
    "fx_5_brightness",
    "fx_6_goblins",
    "fx_7_echoes",
    "fx_8_scifi",
    "sitar",
    "banjo",
    "shamisen",
    "koto",
    "kalimba",
    "bagpipe",
    "fiddle",
    "shanai",
    "tinkle_bell",
    "agogo",
    "steel_drums",
    "woodblock",
    "taiko_drum",
    "melodic_tom",
    "synth_drum",
    "reverse_cymbal",
    "guitar_fret_noise",
    "breath_noise",
    "seashore",
    "bird_tweet",
    "telephone_ring",
    "helicopter",
    "applause",
    "gunshot"
];
let instrumentFolders = DEFAULT_FOLDERS.map((instrumentFolder)=>instrumentFolder + `-mp3`);
let instrumentNames = instrumentFolders.map((instrument, index)=>(0, _generalMidi.GENERAL_MIDI_INSTRUMENTS)[index]);
// combine those 2 together
const TITLE_DICTIONARY = {};
instrumentFolders.forEach((name, index)=>TITLE_DICTIONARY[name] = instrumentNames[index]);
const getRandomInstrument = ()=>instrumentFolders[Math.floor(Math.random() * instrumentFolders.length)];
const getInstrumentFamily = (instrumentName)=>(0, _generalMidi.FAMILY_DICTIONARY)[instrumentName];
const getInstrumentTitle = (instrumentName)=>TITLE_DICTIONARY[instrumentName];
const createInstruments = ()=>DEFAULT_FOLDERS.map((folder, index)=>{
        const name = (0, _generalMidi.GENERAL_MIDI_INSTRUMENTS)[index];
        const family = (0, _generalMidi.FAMILY_DICTIONARY)[name];
        const location = instrumentFolders[index];
        return {
            folder,
            name,
            family,
            location
        };
    });
const instrumentCache = {};
const fetchInstrument = (name)=>{
    // FIXME: Create if it doesn't exist?
    return instrumentCache[name];
};
const storeInstrument = (name, data)=>{
    instrumentCache[name] = data;
};
const createPack = (packs, format = "mp3")=>{
    return packs.map((instrument, i)=>{
        const formatted = `${instrument}-${format}`;
        instrumentFolders[i] = formatted;
        // FIXME: May not always align...
        instrumentNames[i] = (0, _generalMidi.GENERAL_MIDI_INSTRUMENTS)[i];
        return formatted;
    });
};
const loadInstrumentDataPack = async (packName = "musyng.json", format = "mp3")=>{
    const url = `./assets/audio/${packName}`;
    try {
        const request = await fetch(url);
        const packs = await request.json();
        return createPack(packs, format);
    } catch (error) {
        return [];
    }
};
const getFolderNameForInstrument = (name)=>{
    let index = instrumentFolders.indexOf(name);
    if (index === -1) index = instrumentNames.indexOf(name);
    return instrumentFolders[index];
};

},{"./midi/general-midi":"4Ubqr","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4Ubqr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
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
    "gunshot", 
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
    "sound effects", 
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7zTRL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DEFAULT_COLOURS", ()=>DEFAULT_COLOURS);
parcelHelpers.export(exports, "DAMI_KIM_COLOURS", ()=>DAMI_KIM_COLOURS);
parcelHelpers.export(exports, "PASTEL_COLOURS", ()=>PASTEL_COLOURS);
const PALETTE = {
    white: "hsl(22, 28%, 87%)",
    dark: "hsl(30, 6%, 14%)",
    grey: "hsl(11, 6%, 50%)",
    cream: "hsl(27, 30%, 45%)",
    brown: "hsl(23, 22%, 30%)",
    blue: "hsl(196, 18%, 33%)",
    green: "hsl(56, 18%, 33%)",
    yellow: "hsl(56, 18%, 33%)",
    orange: "hsl(28, 69%, 38%)",
    red: "hsl(9, 58%, 35%)"
};
const DEFAULT_COLOURS = {
    // 0->hueRange
    hue: 90,
    // percentages
    saturation: 80,
    // used to create white mode / black mode and greyscale modes
    luminosity: 50,
    // 0->360
    hueRange: 360,
    // dots hue? still used?
    dots: 60,
    mouth: "rgba(255,0,0,0.5)",
    mouthClosed: "rgba(255,0,0,0.2)",
    lipsUpperInner: "pink",
    lipsLowerInner: "pink",
    midwayBetweenEyes: "blue",
    leftEyeLower0: "red",
    rightEyeLower0: "red",
    leftEyeIris: "yellow",
    rightEyeIris: "yellow"
};
const DAMI_KIM_COLOURS = {
    ...DEFAULT_COLOURS
};
const PASTEL_COLOURS = {
    ...DEFAULT_COLOURS
};
exports.default = PALETTE;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kqCqx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "linear", ()=>linear);
parcelHelpers.export(exports, "easeInSine", ()=>easeInSine);
// Slight deceleration at the end
parcelHelpers.export(exports, "easeOutSine", ()=>easeOutSine);
// Slight acceleration at beginning and slight deceleration at end
parcelHelpers.export(exports, "easeInOutSine", ()=>easeInOutSine);
// Accelerating from zero velocity
parcelHelpers.export(exports, "easeInQuad", ()=>easeInQuad);
// Decelerating to zero velocity
parcelHelpers.export(exports, "easeOutQuad", ()=>easeOutQuad);
// Acceleration until halfway, then deceleration
parcelHelpers.export(exports, "easeInOutQuad", ()=>easeInOutQuad);
// Accelerating from zero velocity
parcelHelpers.export(exports, "easeInCubic", ()=>easeInCubic);
// Decelerating to zero velocity
parcelHelpers.export(exports, "easeOutCubic", ()=>easeOutCubic);
// Acceleration until halfway, then deceleration
parcelHelpers.export(exports, "easeInOutCubic", ()=>easeInOutCubic);
// Accelerating from zero velocity
parcelHelpers.export(exports, "easeInQuart", ()=>easeInQuart);
// Decelerating to zero velocity
parcelHelpers.export(exports, "easeOutQuart", ()=>easeOutQuart);
// Acceleration until halfway, then deceleration
parcelHelpers.export(exports, "easeInOutQuart", ()=>easeInOutQuart);
// Accelerating from zero velocity
parcelHelpers.export(exports, "easeInQuint", ()=>easeInQuint);
// Decelerating to zero velocity
parcelHelpers.export(exports, "easeOutQuint", ()=>easeOutQuint);
// Acceleration until halfway, then deceleration
parcelHelpers.export(exports, "easeInOutQuint", ()=>easeInOutQuint);
// Accelerate exponentially until finish
parcelHelpers.export(exports, "easeInExpo", ()=>easeInExpo);
// Initial exponential acceleration slowing to stop
parcelHelpers.export(exports, "easeOutExpo", ()=>easeOutExpo);
// Exponential acceleration and deceleration
parcelHelpers.export(exports, "easeInOutExpo", ()=>easeInOutExpo);
// Increasing velocity until stop
parcelHelpers.export(exports, "easeInCirc", ()=>easeInCirc);
// Start fast, decreasing velocity until stop
parcelHelpers.export(exports, "easeOutCirc", ()=>easeOutCirc);
// Fast increase in velocity, fast decrease in velocity
parcelHelpers.export(exports, "easeInOutCirc", ()=>easeInOutCirc);
// Slow movement backwards then fast snap to finish
parcelHelpers.export(exports, "easeInBack", ()=>easeInBack);
// Fast snap to backwards point then slow resolve to finish
parcelHelpers.export(exports, "easeOutBack", ()=>easeOutBack);
// Slow movement backwards, fast snap to past finish, slow resolve to finish
parcelHelpers.export(exports, "easeInOutBack", ()=>easeInOutBack);
// Bounces slowly then quickly to finish
parcelHelpers.export(exports, "easeInElastic", ()=>easeInElastic);
// Fast acceleration, bounces to zero
parcelHelpers.export(exports, "easeOutElastic", ()=>easeOutElastic);
// Slow start and end, two bounces sandwich a fast motion
parcelHelpers.export(exports, "easeInOutElastic", ()=>easeInOutElastic);
// Bounce to completion
parcelHelpers.export(exports, "easeOutBounce", ()=>easeOutBounce);
// Bounce increasing in velocity until completion
parcelHelpers.export(exports, "easeInBounce", ()=>easeInBounce);
// Bounce in and bounce out
parcelHelpers.export(exports, "easeInOutBounce", ()=>easeInOutBounce);
const linear = (t)=>t;
const easeInSine = (t)=>-1 * Math.cos(t * (Math.PI / 2)) + 1;
function easeOutSine(t) {
    return Math.sin(t * (Math.PI / 2));
}
function easeInOutSine(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}
function easeInQuad(t) {
    return t * t;
}
function easeOutQuad(t) {
    return t * (2 - t);
}
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeInCubic(t) {
    return t * t * t;
}
function easeOutCubic(t) {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
}
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
function easeInQuart(t) {
    return t * t * t * t;
}
function easeOutQuart(t) {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
}
function easeInOutQuart(t) {
    const t1 = t - 1;
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
}
function easeInQuint(t) {
    return t * t * t * t * t;
}
function easeOutQuint(t) {
    const t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
}
function easeInOutQuint(t) {
    const t1 = t - 1;
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
}
function easeInExpo(t) {
    if (t === 0) return 0;
    return Math.pow(2, 10 * (t - 1));
}
function easeOutExpo(t) {
    if (t === 1) return 1;
    return -Math.pow(2, -10 * t) + 1;
}
function easeInOutExpo(t) {
    if (t === 0 || t === 1) return t;
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;
    if (scaledTime < 1) return 0.5 * Math.pow(2, 10 * scaledTime1);
    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
}
function easeInCirc(t) {
    const scaledTime = t / 1;
    return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
}
function easeOutCirc(t) {
    const t1 = t - 1;
    return Math.sqrt(1 - t1 * t1);
}
function easeInOutCirc(t) {
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 2;
    if (scaledTime < 1) return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
}
function easeInBack(t, magnitude = 1.70158) {
    return t * t * ((magnitude + 1) * t - magnitude);
}
function easeOutBack(t, magnitude = 1.70158) {
    const scaledTime = t / 1 - 1;
    return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
}
function easeInOutBack(t, magnitude = 1.70158) {
    const scaledTime = t * 2;
    const scaledTime2 = scaledTime - 2;
    const s = magnitude * 1.525;
    if (scaledTime < 1) return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
}
function easeInElastic(t, magnitude = 0.7) {
    if (t === 0 || t === 1) return t;
    const scaledTime = t / 1;
    const scaledTime1 = scaledTime - 1;
    const p = 1 - magnitude;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return -(Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
}
function easeOutElastic(t, magnitude = 0.7) {
    const p = 1 - magnitude;
    const scaledTime = t * 2;
    if (t === 0 || t === 1) return t;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return Math.pow(2, -10 * scaledTime) * Math.sin((scaledTime - s) * (2 * Math.PI) / p) + 1;
}
function easeInOutElastic(t, magnitude = 0.65) {
    const p = 1 - magnitude;
    if (t === 0 || t === 1) return t;
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;
    const s = p / (2 * Math.PI) * Math.asin(1);
    if (scaledTime < 1) return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
    return Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
}
function easeOutBounce(t) {
    const scaledTime = t / 1;
    if (scaledTime < 1 / 2.75) return 7.5625 * scaledTime * scaledTime;
    else if (scaledTime < 2 / 2.75) {
        const scaledTime2 = scaledTime - 1.5 / 2.75;
        return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
    } else if (scaledTime < 2.5 / 2.75) {
        const scaledTime2 = scaledTime - 2.25 / 2.75;
        return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
    } else {
        const scaledTime2 = scaledTime - 2.625 / 2.75;
        return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
    }
}
function easeInBounce(t) {
    return 1 - easeOutBounce(1 - t);
}
function easeInOutBounce(t) {
    if (t < 0.5) return easeInBounce(t * 2) * 0.5;
    return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kOXsT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isSupportingBrowser", ()=>isSupportingBrowser);
parcelHelpers.export(exports, "uninstall", ()=>uninstall);
parcelHelpers.export(exports, "showChangelog", ()=>showChangelog);
parcelHelpers.export(exports, "installOrUpdate", ()=>installOrUpdate);
// checkForUpdates()
// await checkForUpdates() => { currentVersion:0.0.1, newVersion:0.0.2, updateAvailable:true } 
// Fix some issues with early browsers
// import './servicewaiting.polyfill'
var _version = require("../version");
// import serviceWorkerPath from "url:../service-worker.js"
// console.error({serviceWorkerPath, manifestPath})
// ? made CloudFlare barf up the ServiceWorker so meh!
const URL_SEPERATOR = "#";
const NAME = "ploppypantspwaispoo";
let deferredPrompt;
// flags
const PWA_TYPES = [
    "standalone",
    "fullscreen",
    "minimal-ui"
];
// Determine as much functionality as possible
const isInWebAppiOS = "standalone" in navigator ? window.navigator.standalone === true : matchMedia("(display-mode: standalone)").matches;
// as there are other modes that are active as pwa such as fullscreen
const displayMode = PWA_TYPES.filter((displayMode1)=>window.matchMedia(`(display-mode:${displayMode1})`).matches);
const isInWebAppChrome = PWA_TYPES.includes(displayMode);
// const isInWebAppChrome = ["fullscreen", "standalone", "minimal-ui"].some( displayMode => window.matchMedia( `(display-mode:${displayMode})` ).matches )
// const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches
// handle iOS specifically
// this includes the regular iPad and the iPad pro but not macOS
const isIOS = navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
// is this an APK TWA android app?
const isTWAAndroid = document.referrer.includes("android-app://");
// check to see if it is in the microsoft store pwas format
const isMicrosoftStore = Array.isArray(navigator.userAgent.match(/MSAppHost/i));
// if this is the first ever run or if this is the cache has been cleared...
const isFirstRun = navigator.serviceWorker.controller === null;
// Is the user online or offline?
const isOnline = navigator.onLine;
const isSupportingBrowser = window.hasOwnProperty("BeforeInstallPromptEvent");
// 2. Check if the app was JUST installed (previously before refresh)
// was installed on the last refresh
// - if so then quit
const wasJustInstalled = new URLSearchParams(window.location.search).installing || false;
// 3. Check to see if the app has already been installed!
//		- if it has continue to UPDATE step
//		- if it has not, continue to INSTALL step
// is this runnning as an App on the device? PWA / TWA / MSStore 
const isRunningAsApp = isInWebAppiOS || isInWebAppChrome || isTWAAndroid || isMicrosoftStore || false;
// 4. If Installed check for updates
const platform = {
    ios: isIOS,
    android: isTWAAndroid,
    microsoft: isMicrosoftStore,
    pwa: isRunningAsApp,
    offline: !isOnline,
    displayMode
};
// The process goes like this...
// FIXME: show change log if just installed and silently exit!
const setJustBeenInstalled = (cookieSecret = NAME)=>{
    // checks a few things... query string for "installing=true"
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.installing = true;
    localStorage.setItem(cookieSecret, {
        installing: true,
        version: (0, _version.VERSION)
    });
};
// INSTALL PATH
// - set localstorage flag for version and for date installed as well as if it has JUST been installed (gets cleared after first refresh)
// UPDATE PATH
let installed;
// TODO: Lazy load from install
const showInstallPrompt = (installButton, prompt)=>new Promise(async (resolve, reject)=>{
        if (!prompt) return reject();
        window.addEventListener("appinstalled", (evt)=>{
            //console.log("appinstalled fired", evt)
            resolve({
                success: true,
                log: "Your PWA has been installed"
            });
        }, {
            once: true
        });
        // show the actual prompt
        prompt.prompt();
        // disable the install button to prevent repress
        installButton.disabled = true;
        // wait for the user to click a button...
        const choiceResult = await prompt.userChoice;
        // user clicked...
        if (choiceResult.outcome === "accepted") {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.installing = true;
            // set?
            installed = true;
            installButton.hidden = true;
        //prompt = null
        // this should trigger the above event!
        } else {
            installButton.disabled = false;
            installed = false;
            resolve({
                success: false,
                log: "User chose to not install"
            });
        //reject("User chose to not install")
        }
    });
const uninstall = ()=>{
    navigator.serviceWorker.getRegistrations().then((registrations)=>{
        for (let registration of registrations)registration.unregister().then(()=>self.clients.matchAll()).then((clients)=>{
            clients.forEach((client)=>{
                if (client.url && "navigate" in client) client.navigate(client.url);
            });
        });
    });
};
const showChangelog = async (domElement)=>{
    const { injectChangeLog , fetchChangesAsText  } = await require("3ff03aacb10143d6");
    const changes = await fetchChangesAsText("changelog");
    injectChangeLog(domElement);
    return changes;
};
let isInstallable = false;
let updating = false;
let updatesAvailable = false;
let updated = false;
let newVersionAvailable = false;
// versioning
const currentVersion = (0, _version.VERSION);
let previousVersion;
const installOrUpdate = async (debug = false, currentlyRunningVersion = "")=>{
    let log = [];
    let output = {};
    // 1. Check browser allows PWAs
    if (!isSupportingBrowser) throw Error("Browser does not support PWA installation");
    // 2. check to see if it is already installed and running as a PWA
    if (isRunningAsApp) log.push(`PWA ${(0, _version.VERSION)} Installed, checking for updates`, {
        deferredPrompt,
        isFirstRun,
        isInWebAppiOS,
        isInWebAppChrome
    });
    else {
        // check to see if the service worker is running...
        if (isFirstRun) // totally clean setup
        log.push(`PWA ${(0, _version.VERSION)} AVAILABLE WWW / PWA`, {
            deferredPrompt,
            isFirstRun,
            first: navigator.serviceWorker.controller
        });
        else if (wasJustInstalled) // recently installed
        log.push(`PWA ${(0, _version.VERSION)} was JUST installed`);
        else // check to see if the service worker is running...
        log.push(`WWW ${(0, _version.VERSION)}`, {
            deferredPrompt,
            isFirstRun,
            first: navigator.serviceWorker.controller
        });
    }
    const registration = await navigator.serviceWorker.getRegistration();
    // ===================================================
    // INSTALLATION OF SERVICE WORKER MEANS IT WAS JUST INSTALLED 
    // check if installing...
    if (registration && registration.installing) // if the feature exists, we can work out how heavy the app is
    {
        if (navigator.storage) {
            const storageData = await navigator.storage.estimate();
            console.log("Checking for installed storage space", storageData);
        }
    }
    // FIXME: Check if we are installing the app!
    // INSTALL UPDATES ===================================================
    // Updates - the app does not need to be installed to have updates!
    // updates simply means that the service-worker has changed since last time
    // and that there are new assets that need to be cached and downloaded.
    // 1. Check to see if it is installed as a service worker
    if (registration) {
        // if there is an active SW it means that this isn't the first
        // time that the app has run and that there maybe updates to this
        // service worker that will be noticed when the new service worker
        // is registered below...
        const activeWorker = registration.active;
        const previousServiceWorkerURL = new URL(activeWorker.scriptURL);
        previousVersion = previousServiceWorkerURL.search.split("=")[1] || currentlyRunningVersion;
        newVersionAvailable = previousVersion !== (0, _version.VERSION);
        // "installing" - the install event has fired, but not yet complete
        // "installed"  - install complete
        // "activating" - the activate event has fired, but not yet complete
        // "activated"  - fully active
        // "redundant"  - discarded. Either failed install, or it's been
        //                replaced by a newer version
        const activatedState = activeWorker.state;
        log.push("PREVIOUS SW URL", `${previousServiceWorkerURL}`);
        log.push("EXPECTED VERSION", `${(0, _version.VERSION)}`);
        log.push("SW Reg v", `${previousVersion} -> ${currentVersion}`, {
            updatesAvailable,
            previousVersion,
            registration,
            activatedState,
            activeWorker,
            previousServiceWorkerURL
        });
        log.push(`SW State ${activatedState}`);
        // As in our service worker we have the self.skipWaiting() command set up
        // the update should automatically install in the background 
        // FOR USE AFTER RELOAD - for the time being the previous Service-Worker is used
        registration.addEventListener("updatefound", async ()=>{
            const installingWorker = registration.installing;
            // check this version installed and the updated version????
            log.push("Update found", {
                registration,
                installWorker: installingWorker,
                activeWorker,
                previousServiceWorkerURL
            });
            updating = true;
            // show "install update" buton?
            //log.push( {changes,waiting: installWorker.waiting, controller: navigator.serviceWorker.controller  } )
            // if there is already a service-worker registered and running as the controller...
            // as well as a worker "waiting" to be installed... resolve immediately?
            if (installingWorker && installingWorker.waiting && navigator.serviceWorker.controller) // FIXME: 
            //newWorker = reg.waiting
            log.push("sanity check", {
                installWorker: installingWorker,
                nav: navigator.serviceWorker.controller
            });
            if (installingWorker) installingWorker.addEventListener("statechange", ()=>{
                switch(installingWorker.state){
                    case "installed":
                        if (navigator.serviceWorker.controller) // New Service-Worker has replaced the old one!
                        // new update available!
                        updatesAvailable = true;
                        else {
                            // no update available
                            updatesAvailable = false;
                            log.push("update", installingWorker.state, {
                                registration,
                                installWorker: installingWorker
                            });
                        }
                        log.push("update installed expected truth", navigator.serviceWorker.controller, {
                            registration,
                            installWorker: installingWorker
                        });
                        break;
                }
                installingWorker.state;
            });
        // if (navigator.storage) 
        // {
        // 	const storageData = await navigator.storage.estimate()
        // }
        }, {
            once: true
        });
    } else // no service worker installed yet?
    log.push("PWA NO service worker registered");
    //log.push("PWA registering service worker..." )
    // as there is no previously one registered, we 
    // This "installs" the app into the local app cache but does
    // not create the icon on the homescreen or desktop
    // NB. By appending the Version as an GET var we can specify which version this matches
    const hashedSWURL = `../service-worker.js#v=${(0, _version.VERSION)}`;
    let serviceWorker = await navigator.serviceWorker.register(hashedSWURL);
    log.push("Service worker with #", hashedSWURL, serviceWorker);
    if (!serviceWorker) {
        const querySWURL = `../service-worker.js?v=${(0, _version.VERSION)}`;
        serviceWorker = await navigator.serviceWorker.register(querySWURL);
        log.push("Service worker with ?", querySWURL, serviceWorker);
    }
    // annoying really but we leave this in just for parcel to force copy it
    if (!serviceWorker) {
        serviceWorker = await navigator.serviceWorker.register(require("859dbabfced9cec8"));
        // serviceWorker = await navigator.serviceWorker.register("../service-worker.js")	
        log.push("Service worker falling back to default :*(", serviceWorker);
    }
    // at this point, if the service worker is a different version,
    // the update method above begins
    if (isFirstRun) log.push("PWA FRESH service worker registering", {
        serviceWorker
    });
    else log.push("PWA registering service worker", {
        serviceWorker
    });
    // INSTALLABLE!
    // app is running as a PWA so we don't have to show the install button ever! 
    // if not installed we can also show an install button
    if (!isRunningAsApp) // get install stuff prepared...
    // check if prompt is available else wait...
    {
        if (!deferredPrompt) {
            // if this is not installable it will hang forever here
            deferredPrompt = await interceptPrompt();
            isInstallable = true;
            log.push("Waiting prompts", deferredPrompt);
        }
    }
    output = {
        log,
        online: isOnline,
        offline: !isOnline,
        previousVersion,
        currentVersion,
        isInstallable,
        isFirstRun,
        isRunningAsApp,
        // 
        hasUpdates: updatesAvailable && !isFirstRun,
        // FIXME
        isInstalled: isRunningAsApp,
        // Show the installer if not installed?
        // NB. THIS MUST BE TIES INTO A USER INTERACTION
        install: (button)=>showInstallPrompt(button, deferredPrompt),
        prompt: deferredPrompt,
        updatesAvailable,
        updating,
        updated,
        newVersionAvailable,
        // requestAddToHomescreen 
        // The actual update / reload script for if user wants new version now!
        update: ()=>{
            registration.waiting.postMessage({
                type: "SKIP_WAITING"
            });
            window.location.reload();
        },
        ...platform
    };
    debug;
    return output;
};
// Prevent the install app popup appearing
const interceptPrompt = ()=>new Promise((resolve, reject)=>{
        if (!isSupportingBrowser) return reject("Unsupported Browser");
        if (deferredPrompt) return resolve(deferredPrompt);
        // Intercept install prompt catch install prompt and prevent it showing immediately
        // you can run deferredPrompt.prompt() to start it again
        window.addEventListener("beforeinstallprompt", (event)=>{
            event.preventDefault();
            resolve(event);
        }, {
            once: true
        });
    });
// No need to watch if already installed
if (!isRunningAsApp) interceptPrompt().then((prompt)=>deferredPrompt = prompt);

},{"../version":"7AyKa","3ff03aacb10143d6":"fMusI","859dbabfced9cec8":"iYUaC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fMusI":[function(require,module,exports) {
module.exports = require("./helpers/browser/js-loader")(require("./helpers/bundle-url").getBundleURL("h1ZFd") + "changes.a7179ccd.js" + "?" + Date.now()).catch((err)=>{
    delete module.bundle.cache[module.id];
    throw err;
}).then(()=>module.bundle.root("3MFIV"));

},{"./helpers/browser/js-loader":"61B45","./helpers/bundle-url":"lgJ39"}],"61B45":[function(require,module,exports) {
"use strict";
var cacheLoader = require("../cacheLoader");
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
        var script1 = document.createElement("script");
        script1.async = true;
        script1.type = "text/javascript";
        script1.charset = "utf-8";
        script1.src = bundle;
        script1.onerror = function(e) {
            var error = new TypeError("Failed to fetch dynamically imported module: ".concat(bundle, ". Error: ").concat(e.message));
            script1.onerror = script1.onload = null;
            script1.remove();
            reject(error);
        };
        script1.onload = function() {
            script1.onerror = script1.onload = null;
            resolve();
        };
        document.getElementsByTagName("head")[0].appendChild(script1);
    });
});

},{"../cacheLoader":"j49pS"}],"j49pS":[function(require,module,exports) {
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

},{}],"lgJ39":[function(require,module,exports) {
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
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ("" + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error("Origin not found");
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"iYUaC":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("h1ZFd") + "service-worker.js" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"6qVfF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createStore", ()=>createStore);
var _utils = require("./utils");
const createStore = (name = "InterFACE")=>{
    const storage = localStorage.getItem(name);
    const data = Object.assign({}, JSON.parse(storage));
    const save = (0, _utils.debounce)((updates)=>{
        const encoded = JSON.stringify(updates);
        localStorage.setItem(name, encoded);
    }, 20);
    return {
        save,
        has: (key)=>{
            return data[key] ? true : false;
        },
        removeItem: (key)=>{
            delete data[key];
            save(data);
        },
        getItem: (key)=>{
            return data[key];
        },
        setItem: (key, value)=>{
            data[key] = Object.assign({}, data[key], value);
            // save to local
            save(data);
            return data;
        }
    };
};

},{"./utils":"2ofLa","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2ofLa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "convertOptionToObject", ()=>convertOptionToObject);
parcelHelpers.export(exports, "debounce", ()=>debounce);
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kOYvE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showError", ()=>showError);
var _button = require("../dom/button");
const showError = (error, solution, fatal = false)=>{
    const body = document.documentElement;
    body.classList.add("failure");
    body.classList.remove("loading");
    document.getElementById("feedback").appendChild((0, _button.showReloadButton)(true));
    console.error("Could not load", error);
    console.warn("Consider:", solution);
    // play lemmings sound effect...
    let audio = new Audio();
    audio.src = "/assets/audio/lemmings.wav";
    audio.play();
// if fatal then we can't continue so show reload button?
};

},{"../dom/button":"gUPRN","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gUPRN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setButton", ()=>setButton);
parcelHelpers.export(exports, "setPressureButton", ()=>setPressureButton);
parcelHelpers.export(exports, "createButton", ()=>createButton);
parcelHelpers.export(exports, "showReloadButton", ()=>showReloadButton);
parcelHelpers.export(exports, "createInstallButton", ()=>createInstallButton);
parcelHelpers.export(exports, "showUpdateButton", ()=>showUpdateButton);
parcelHelpers.export(exports, "setupMIDIButton", ()=>setupMIDIButton);
var _tooltips = require("./tooltips");
var _version = require("../version");
var _info = require("../models/info");
var _mouse = require("../hardware/mouse");
const setButton = (buttonNameOrElement, callback, eventType = "mousedown", preventDefault = false)=>{
    const element = typeof buttonNameOrElement === "string" ? document.getElementById(buttonNameOrElement) : buttonNameOrElement;
    // check to see that the button hasn't got the display:none!
    if (element) {
        // element.addEventListener("click", (event) => {
        // click was too unresponsive so lets use touch / mousedown
        element.addEventListener(eventType, (event)=>{
            if (preventDefault) event.preventDefault();
            callback && callback({
                element,
                event
            });
        });
        return element;
    }
    return null;
};
const setPressureButton = (buttonNameOrElement, tapCallback, holdCallback, holdingCallback)=>{
    const element = typeof buttonNameOrElement === "string" ? document.getElementById(buttonNameOrElement) : buttonNameOrElement;
    if (element) {
        (0, _mouse.addMouseTapAndHoldEvents)(element);
        element.addEventListener((0, _mouse.MOUSE_TAP), (event)=>{
            tapCallback && tapCallback(event);
        });
        element.addEventListener((0, _mouse.MOUSE_HOLDING), (event)=>{
            holdingCallback && holdingCallback(event);
        });
        element.addEventListener((0, _mouse.MOUSE_HELD), (event)=>{
            holdCallback && holdCallback(event);
        });
        return element;
    }
    return null;
};
const createButton = (label, tip, classes = "")=>{
    const button = document.createElement("button");
    button.classList.add(classes);
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", tip);
    button.innerHTML = label;
    (0, _tooltips.addTooltip)(button);
    return button;
};
const showReloadButton = (reset)=>{
    const button = createButton("Try again! Reload and reset", "Reload this application!", "reload-app");
    button.addEventListener("click", (event)=>{
        // remove any potential options that could cause issue?
        if (reset) history.replaceState(null, null, "?");
        window.location.reload();
    });
    button.id = "button-reload";
    return button;
};
const createInstallButton = (manifestData)=>{
    // show install button or update button???
    const tip = `Click to install ${manifestData.short_name} V-${(0, _version.VERSION).replaceAll(".", "-")}<br>Date:${(0, _info.formattedDate)}`;
    const button = createButton("Install", tip, "install-app");
    button.id = "button-install";
    button.style.setProperty("--logo", `url(${manifestData.icons[0].src})`);
    return button;
};
const showUpdateButton = (domElement, action)=>{
    const button = createButton("Update", `Update to new version`, "update-available");
    button.id = "button-update";
    button.addEventListener("click", ()=>action());
// reveal update button?
//domElement.appendChild(button)
};
const setupMIDIButton = (buttonMIDI, callback)=>{
    let midiEnabled = false;
    const onStartRequested = async (event)=>{
        event.preventDefault();
        callback && callback();
        midiEnabled = true;
        //buttonMIDI.removeEventListener('mousedown', onStartRequested)
        return false;
    };
    buttonMIDI.addEventListener("mousedown", onStartRequested, {
        once: true
    });
    return {
        setText: (text)=>buttonMIDI.innerHTML = text,
        setLabel: (text)=>buttonMIDI.setAttribute("aria-label", text)
    };
};

},{"./tooltips":"8RoHD","../version":"7AyKa","../models/info":"5ZmWx","../hardware/mouse":"5goDw","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8RoHD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setToast", ()=>setToast);
parcelHelpers.export(exports, "addTooltip", ()=>addTooltip);
parcelHelpers.export(exports, "removeTooltip", ()=>removeTooltip);
parcelHelpers.export(exports, "addToolTips", ()=>addToolTips);
/**
 * Create a tooltip and bind it to the element
 * @param {HTMLElement} element DOM element to bind to
 * @param {Number} revealRate typing rate in characters per second
 * @param {Number} clearRate clear word after x ms
 * @returns {Function} method with 2 arguments to set the tip message
 */ const createTip = (element, revealRate = 6, clearRate = 550)=>{
    let previousMessage = "";
    let interval = null;
    let frame = null;
    let isAnimating = false;
    let hasCompleted = false;
    return element ? (message, letterRate = revealRate)=>{
        // prevent hiding 
        clearInterval(interval);
        // check to see if it has changed...
        if (message === previousMessage) // or do we just show it all???
        return;
        // write the message letter by letter
        function write(index = 0, speed = 1, returnVisit = false) {
            // if (!returnVisit){
            // 	console.log( index, "isAnimating", {interval}, letterRate, "tip", {message, previousMessage} )
            // }
            cancelAnimationFrame(frame);
            const revealingMessage = message.slice(0, index);
            const isWriting = index < message.length;
            //console.log( "draw",isWriting, message, index, message.length )
            if (isWriting) {
                //console.log( index,  message.length, "wrting", {interval}, {message, previousMessage} )
                // ok, so we have a new message and immediately we overwrite the previous message
                element.innerHTML = revealingMessage;
                //write( index + speed, speed, true )
                isAnimating = true;
                frame = requestAnimationFrame(()=>write(index + speed, speed, true));
            } else {
                // ended!
                isAnimating = false;
                element.innerHTML = message;
                // console.log( index,  message.length, "wrte end", {interval}, {message, previousMessage} )
                // clear the previous interval after x chars read
                const after = clearRate * message.length;
                // and then hide this after x seconds...
                interval = setTimeout(()=>{
                    element.innerHTML = "";
                    hasCompleted = true;
                }, after);
            }
        }
        // if the letterRate is 0, then we just show the message
        if (letterRate < 1) write(message.length, 10);
        else if (isAnimating) // just animate the new characters
        write(previousMessage.length, letterRate);
        else // ended!?
        write(0, letterRate);
        previousMessage = message;
    } : null;
};
/**
 * Create a method that controls the toast element remotely
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */ const toastElement = document.getElementById("toast");
const setToast = createTip(toastElement);
const tooltips = new Map();
const setToolTipPosition = (target)=>{
    toastElement.setAttribute("style", `--left: ${target.offsetLeft}; 
		 --top: ${target.offsetTop};`);
};
const addTooltip = (element)=>{
    const callback = (event)=>{
        const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML;
        if (event.target.nodeName === "BUTTON") setToolTipPosition(event.target);
        else setToolTipPosition(event.target.parentElement);
        setToast(toolTip);
    };
    element.addEventListener("mouseover", callback);
    tooltips.set(element, callback);
};
const removeTooltip = (element)=>{
    const callback = tooltips.get(element);
    if (callback) {
        element.removeEventListener("mouseover", callback);
        tooltips.delete(element);
    }
};
const addToolTips = (controls, query = "button, select, input")=>{
    // do a query here to catch all buttons?
    const buttons = controls.querySelectorAll(query);
    // const fragment = doc.createDocumentFragment() 
    // fragment.appendChild(doc.createElement('fieldset'))
    // const fragment = doc.createElement('fieldset')
    // fragment.innerHTML = setupInstrumentForm()
    // add to dom
    // controls.appendChild( fragment )
    // intercept any hover events...
    buttons.forEach((button)=>addTooltip(button));
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5ZmWx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "formattedDate", ()=>formattedDate);
var _version = require("../version");
const releaseDate = new Date((0, _version.DATE));
const dateOptions = {
    hour12: true,
    hour: "numeric",
    minute: "numeric"
};
const formattedDate = `${releaseDate.getDate()}/${releaseDate.getMonth() + 1}/${releaseDate.getFullYear()} ${releaseDate.toLocaleTimeString("en-GB", dateOptions)}`;

},{"../version":"7AyKa","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5goDw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MOUSE_HELD", ()=>MOUSE_HELD);
parcelHelpers.export(exports, "MOUSE_HOLDING", ()=>MOUSE_HOLDING);
parcelHelpers.export(exports, "MOUSE_TAP", ()=>MOUSE_TAP);
parcelHelpers.export(exports, "addMouseTapAndHoldEvents", ()=>addMouseTapAndHoldEvents);
parcelHelpers.export(exports, "getMouseCoords", ()=>getMouseCoords);
parcelHelpers.export(exports, "watchMouseCoords", ()=>watchMouseCoords);
// watch for global mouse moves...
// watch for mouse holding
const now = ()=>performance.now() || Date.now();
const MOUSE_HELD = "mouse_held";
const MOUSE_HOLDING = "mouse_holding";
const MOUSE_TAP = "mouse_tap";
const addMouseTapAndHoldEvents = (button, onlySendHoldOnMouseUp = false, holdTime = 800)=>{
    let mouseDownAt = -1;
    // FIXME: Immediately test to see if this actually *is* false???
    let isMouseOver = false;
    let isMouseDown = false;
    let isMouseHeld = false;
    // fetch dom element
    const dispatch = (name, detail = {})=>{
        button.dispatchEvent(new CustomEvent(name, {
            detail
        }));
    };
    // test to see how long we are help down for?
    const waitPatiently = ()=>{
        // we have lost focus
        if (isMouseOver && isMouseDown) {
            const elapsed = now() - mouseDownAt;
            if (elapsed < holdTime) {
                // BEFORE HOLDING TIME... ignore?
                const remaining = 1 - elapsed / holdTime;
                const percentageRemaining = 100 - Math.ceil(remaining * 100);
                dispatch(MOUSE_HOLDING, {
                    elapsed,
                    isMouseOver,
                    remaining,
                    percentageRemaining
                });
                requestAnimationFrame(waitPatiently);
            } else {
                isMouseHeld = true;
                // HELD long enough
                if (!onlySendHoldOnMouseUp) dispatch(MOUSE_HELD, {
                    elapsed,
                    isMouseOver
                });
            // FIXME
            // mouseDownAt = -1
            }
        }
    };
    const onMouseUp = (event)=>{
        event.preventDefault();
        if (!isMouseDown) return;
        // should this trigger something else depending on time?
        const elapsed = now() - mouseDownAt;
        if (elapsed < holdTime) dispatch(MOUSE_TAP, {
            elapsed,
            isMouseOver
        });
        else if (isMouseHeld && onlySendHoldOnMouseUp) dispatch(MOUSE_HELD, {
            elapsed,
            isMouseOver
        });
        //console.log("mouseDownFor", elapsed )
        // CALLBACKS
        // dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
        // and reset
        mouseDownAt = -1;
        isMouseDown = false;
        document.removeEventListener("mouse", onMouseUp);
    };
    // BUTTON has been pressed!
    button.addEventListener("mousedown", (event)=>{
        mouseDownAt = now();
        isMouseDown = true;
        isMouseHeld = false;
        waitPatiently();
        // TODO: add in document listener in case mouse out and back up?
        event.preventDefault();
        // watch for any mouse up
        document.addEventListener("mouseup", onMouseUp, false);
    });
    // FIXME: Is mouse out useful here?
    //button.addEventListener( 'mouseup', onMouseUp, false)
    button.addEventListener("mouseover", (event)=>{
        isMouseOver = true;
    });
    button.addEventListener("mouseout", (event)=>{
        isMouseOver = false;
    });
    // return some controls or destroy?
    return button;
};
const coords = {
    x: 0,
    y: 0
};
const getMouseCoords = ()=>coords;
const watchMouseCoords = (element, callback)=>{
    element.addEventListener("mousemove", (event)=>{
        coords.x = event.pageX || event.clientX;
        coords.y = event.pageY || event.clientY;
        callback && callback(coords);
    }, false);
} // window.addEventListener('wheel' , event => {
 // 	return
 // 	let d = event.detail
 // 	const w =  event.deltaY || event.wheelDelta
 // 	let n = 225
 // 	let n1 = n-1
 // 	let f
 // 	// Normalize delta
 // 	d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120
 // 	// Quadratic scale if |d| > 1
 // 	d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n
 // 	// Delta *should* not be greater than 2...
 // 	const wheel = Math.min(Math.max(d / 2, -1), 1) * 0.1
 // 	const volume = getVolume()
 // 	//const result = setMasterVolume(volume + wheel)
 // 	console.log("mouse wheel",{ wheel, volume, result}, event)	
 // })
;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4LUzi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Checks to see if all of the things we need for
 * this to work are available such as camera, midi etc
 */ var _midiOut = require("./audio/midi/midi-out");
const hasTouchEvents = ()=>{
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};
const hasFileHandler = ()=>"launchQueue" in window && "files" in LaunchParams.prototype;
class Capabilities {
    // required = {
    // 	camera:false
    // }
    // optional = {
    // 	midi:false
    // }
    fileHandlerAvailable = hasFileHandler();
    cameraAvailble = navigator.getUserMedia !== undefined;
    webMIDIAvailable = false;
    touchScreen = hasTouchEvents();
    mouse = !window.matchMedia("(hover: none)").matches;
    /**
	 * returns {Boolean} is this machine capable of running this app?
	 */ get willWork() {
        return this.cameraAvailble;
    }
    constructor(){
        this.webMIDIAvailable = (0, _midiOut.testForMIDI)();
    }
}
exports.default = Capabilities;

},{"./audio/midi/midi-out":"4giBk","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4giBk":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "testForMIDI", ()=>testForMIDI);
parcelHelpers.export(exports, "setupMIDI", ()=>setupMIDI);
// import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"
var _webmidi = require("webmidi");
// https://mpe.js.org/#Installation
// import mpeInstrument from 'mpe'
// we load in the relevant lib...
let mpeEnabled = false;
const testForMIDI = ()=>navigator.requestMIDIAccess === undefined ? false : true;
const setupMIDI = (connectedCallback, disconnectedCallback)=>new Promise((resolve, reject)=>{
        (0, _webmidi.WebMidi).enable().then((ports)=>{
            //console.log("WebMidi enabled!", ports, ports.outputs[0] , WebMidi.outputs[0], WebMidi.outputs[0] === ports.outputs[0] )
            // I / O change
            // console.log(WebMidi.inputs)
            // console.log(WebMidi.outputs)
            (0, _webmidi.WebMidi).addListener("connected", function(e) {
                //console.log(e);
                // Check for MIDI Clock events
                // WebMidi.inputs[0].addListener("controlchange", e => {
                // 	console.log(`Received 'controlchange' message.`, e);
                // })
                connectedCallback && connectedCallback(e);
            });
            // Reacting when a device becomes unavailable
            (0, _webmidi.WebMidi).addListener("disconnected", function(e) {
                //console.log(e);
                disconnectedCallback && disconnectedCallback();
            });
            resolve((0, _webmidi.WebMidi));
        // Display the current time
        //   console.log(WebMidi.time)
        // Retrieving an output port/device using its id, name or index
        // midiChannel = WebMidi.getOutputById("123456789")
        // midiChannel = WebMidi.getOutputByName("Axiom Pro 25 Ext Out")
        // midiChannel = WebMidi.outputs[0]
        // if (midiChannel)
        // {
        // 	// Play a note on all channels of the selected output
        // 	midiChannel.playNote("C3");
        // 	// Play a note on channel 3
        // 	midiChannel.playNote("Gb4", 3);
        // 	// Play a chord on all available channels
        // 	midiChannel.playNote(["C3", "D#3", "G3"]);
        // 	// Play a chord on channel 7
        // 	midiChannel.playNote(["C3", "D#3", "G3"], 7);
        // 	// Play a note at full velocity on all channels)
        // 	midiChannel.playNote("F#-1", "all", {velocity: 1});
        // 	// Play a note on channel 16 in 2 seconds (relative time)
        // 	midiChannel.playNote("F5", 16, {time: "+2000"});
        // 	// Play a note on channel 1 at an absolute time in the future
        // 	midiChannel.playNote("F5", 16, {time: WebMidi.time + 3000});
        // 	// Play a note for a duration of 2 seconds (will send a note off message in 2 seconds). Also use
        // 	// a low attack velocity
        // 	midiChannel.playNote("Gb2", 10, {duration: 2000, velocity: 0.25});
        // 	// Stop a playing note on all channels
        // 	midiChannel.stopNote("C-1");
        // 	// Stopping a playing note on channel 11
        // 	midiChannel.stopNote("F3", 11);
        // 	// Stop a playing note on channel 11 and use a high release velocity
        // 	midiChannel.stopNote("G8", 11, {velocity: 0.9});
        // 	// Stopping a playing note in 2.5 seconds
        // 	midiChannel.stopNote("Bb2", 11, {time: "+2500"});
        // 	// Send polyphonic aftertouch message to channel 8
        // 	midiChannel.sendKeyAftertouch("C#3", 8, 0.25);
        // 	// Send pitch bend (between -1 and 1) to channel 12
        // 	midiChannel.sendPitchBend(-1, 12);
        // 	// You can chain most method calls
        // 	midiChannel.playNote("G5", 12)
        // 		.sendPitchBend(-0.5, 12, {time: 400}) // After 400 ms.
        // 		.sendPitchBend(0.5, 12, {time: 800})  // After 800 ms.
        // 		.stopNote("G5", 12, {time: 1200});    // After 1.2 s.
        // }
        }).catch((error)=>reject(error));
    });

},{"webmidi":"7gVlB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7gVlB":[function(require,module,exports) {
/**
 * WEBMIDI.js v3.0.21
 * A JavaScript library to kickstart your MIDI projects
 * https://webmidijs.org
 * Build generated on July 1st, 2022.
 *
 * © Copyright 2015-2022, Jean-Philippe Côté.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */ "use strict";
var global = arguments[3];
var process = require("process");
Object.defineProperty(exports, "__esModule", {
    value: !0
});
class EventEmitter {
    constructor(e = !1){
        this.eventMap = {}, this.eventsSuspended = 1 == e;
    }
    addListener(e, t, n = {}) {
        if ("string" == typeof e && e.length < 1 || e instanceof String && e.length < 1 || "string" != typeof e && !(e instanceof String) && e !== EventEmitter.ANY_EVENT) throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");
        if ("function" != typeof t) throw new TypeError("The callback must be a function.");
        const s = new Listener(e, this, t, n);
        return this.eventMap[e] || (this.eventMap[e] = []), n.prepend ? this.eventMap[e].unshift(s) : this.eventMap[e].push(s), s;
    }
    addOneTimeListener(e, t, n = {}) {
        n.remaining = 1, this.addListener(e, t, n);
    }
    static get ANY_EVENT() {
        return Symbol.for("Any event");
    }
    hasListener(e1, t) {
        if (void 0 === e1) return !!(this.eventMap[EventEmitter.ANY_EVENT] && this.eventMap[EventEmitter.ANY_EVENT].length > 0) || Object.entries(this.eventMap).some(([, e])=>e.length > 0);
        if (this.eventMap[e1] && this.eventMap[e1].length > 0) {
            if (t instanceof Listener) return this.eventMap[e1].filter((e)=>e === t).length > 0;
            if ("function" == typeof t) return this.eventMap[e1].filter((e)=>e.callback === t).length > 0;
            return null == t;
        }
        return !1;
    }
    get eventNames() {
        return Object.keys(this.eventMap);
    }
    getListeners(e) {
        return this.eventMap[e] || [];
    }
    suspendEvent(e2) {
        this.getListeners(e2).forEach((e)=>{
            e.suspended = !0;
        });
    }
    unsuspendEvent(e3) {
        this.getListeners(e3).forEach((e)=>{
            e.suspended = !1;
        });
    }
    getListenerCount(e) {
        return this.getListeners(e).length;
    }
    emit(e4, ...t) {
        if ("string" != typeof e4 && !(e4 instanceof String)) throw new TypeError("The 'event' parameter must be a string.");
        if (this.eventsSuspended) return;
        let n = [], s1 = this.eventMap[EventEmitter.ANY_EVENT] || [];
        return this.eventMap[e4] && (s1 = s1.concat(this.eventMap[e4])), s1.forEach((e)=>{
            if (e.suspended) return;
            let s = [
                ...t
            ];
            Array.isArray(e.arguments) && (s = s.concat(e.arguments)), e.remaining > 0 && (n.push(e.callback.apply(e.context, s)), e.count++), --e.remaining < 1 && e.remove();
        }), n;
    }
    removeListener(e5, t, n = {}) {
        if (void 0 === e5) return void (this.eventMap = {});
        if (!this.eventMap[e5]) return;
        let s = this.eventMap[e5].filter((e)=>t && e.callback !== t || n.remaining && n.remaining !== e.remaining || n.context && n.context !== e.context);
        s.length ? this.eventMap[e5] = s : delete this.eventMap[e5];
    }
    async waitFor(e, t = {}) {
        return t.duration = parseInt(t.duration), (isNaN(t.duration) || t.duration <= 0) && (t.duration = 1 / 0), new Promise((n, s)=>{
            let r, i = this.addListener(e, ()=>{
                clearTimeout(r), n();
            }, {
                remaining: 1
            });
            t.duration !== 1 / 0 && (r = setTimeout(()=>{
                i.remove(), s("The duration expired before the event was emitted.");
            }, t.duration));
        });
    }
    get eventCount() {
        return Object.keys(this.eventMap).length;
    }
}
class Listener {
    constructor(e, t, n, s = {}){
        if ("string" != typeof e && !(e instanceof String) && e !== EventEmitter.ANY_EVENT) throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");
        if (!t) throw new ReferenceError("The 'target' parameter is mandatory.");
        if ("function" != typeof n) throw new TypeError("The 'callback' must be a function.");
        void 0 === s.arguments || Array.isArray(s.arguments) || (s.arguments = [
            s.arguments
        ]), (s = Object.assign({
            context: t,
            remaining: 1 / 0,
            arguments: void 0,
            duration: 1 / 0
        }, s)).duration !== 1 / 0 && setTimeout(()=>this.remove(), s.duration), this.arguments = s.arguments, this.callback = n, this.context = s.context, this.count = 0, this.event = e, this.remaining = parseInt(s.remaining) >= 1 ? parseInt(s.remaining) : 1 / 0, this.suspended = !1, this.target = t;
    }
    remove() {
        this.target.removeListener(this.event, this.callback, {
            context: this.context,
            remaining: this.remaining
        });
    }
}
/**
 * The `Enumerations` class contains enumerations and arrays of elements used throughout the
 * library. All properties are static and should be referenced using the class name. For example:
 * `Enumerations.MIDI_CHANNEL_MESSAGES`.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */ class Enumerations {
    static get MIDI_CHANNEL_MESSAGES() {
        return {
            noteoff: 8,
            noteon: 9,
            keyaftertouch: 10,
            controlchange: 11,
            programchange: 12,
            channelaftertouch: 13,
            pitchbend: 14
        };
    }
    static get MIDI_CHANNEL_NUMBERS() {
        return [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
        ];
    }
    static get MIDI_CHANNEL_MODE_MESSAGES() {
        return {
            allsoundoff: 120,
            resetallcontrollers: 121,
            localcontrol: 122,
            allnotesoff: 123,
            omnimodeoff: 124,
            omnimodeon: 125,
            monomodeon: 126,
            polymodeon: 127
        };
    }
    static get MIDI_CONTROL_CHANGE_MESSAGES() {
        return {
            bankselectcoarse: 0,
            modulationwheelcoarse: 1,
            breathcontrollercoarse: 2,
            controller3: 3,
            footcontrollercoarse: 4,
            portamentotimecoarse: 5,
            dataentrycoarse: 6,
            volumecoarse: 7,
            balancecoarse: 8,
            controller9: 9,
            pancoarse: 10,
            expressioncoarse: 11,
            effectcontrol1coarse: 12,
            effectcontrol2coarse: 13,
            controller14: 14,
            controller15: 15,
            generalpurposeslider1: 16,
            generalpurposeslider2: 17,
            generalpurposeslider3: 18,
            generalpurposeslider4: 19,
            controller20: 20,
            controller21: 21,
            controller22: 22,
            controller23: 23,
            controller24: 24,
            controller25: 25,
            controller26: 26,
            controller27: 27,
            controller28: 28,
            controller29: 29,
            controller30: 30,
            controller31: 31,
            bankselectfine: 32,
            modulationwheelfine: 33,
            breathcontrollerfine: 34,
            controller35: 35,
            footcontrollerfine: 36,
            portamentotimefine: 37,
            dataentryfine: 38,
            volumefine: 39,
            balancefine: 40,
            controller41: 41,
            panfine: 42,
            expressionfine: 43,
            effectcontrol1fine: 44,
            effectcontrol2fine: 45,
            controller46: 46,
            controller47: 47,
            controller48: 48,
            controller49: 49,
            controller50: 50,
            controller51: 51,
            controller52: 52,
            controller53: 53,
            controller54: 54,
            controller55: 55,
            controller56: 56,
            controller57: 57,
            controller58: 58,
            controller59: 59,
            controller60: 60,
            controller61: 61,
            controller62: 62,
            controller63: 63,
            holdpedal: 64,
            portamento: 65,
            sustenutopedal: 66,
            softpedal: 67,
            legatopedal: 68,
            hold2pedal: 69,
            soundvariation: 70,
            resonance: 71,
            soundreleasetime: 72,
            soundattacktime: 73,
            brightness: 74,
            soundcontrol6: 75,
            soundcontrol7: 76,
            soundcontrol8: 77,
            soundcontrol9: 78,
            soundcontrol10: 79,
            generalpurposebutton1: 80,
            generalpurposebutton2: 81,
            generalpurposebutton3: 82,
            generalpurposebutton4: 83,
            controller84: 84,
            controller85: 85,
            controller86: 86,
            controller87: 87,
            controller88: 88,
            controller89: 89,
            controller90: 90,
            reverblevel: 91,
            tremololevel: 92,
            choruslevel: 93,
            celestelevel: 94,
            phaserlevel: 95,
            databuttonincrement: 96,
            databuttondecrement: 97,
            nonregisteredparametercoarse: 98,
            nonregisteredparameterfine: 99,
            registeredparametercoarse: 100,
            registeredparameterfine: 101,
            controller102: 102,
            controller103: 103,
            controller104: 104,
            controller105: 105,
            controller106: 106,
            controller107: 107,
            controller108: 108,
            controller109: 109,
            controller110: 110,
            controller111: 111,
            controller112: 112,
            controller113: 113,
            controller114: 114,
            controller115: 115,
            controller116: 116,
            controller117: 117,
            controller118: 118,
            controller119: 119,
            allsoundoff: 120,
            resetallcontrollers: 121,
            localcontrol: 122,
            allnotesoff: 123,
            omnimodeoff: 124,
            omnimodeon: 125,
            monomodeon: 126,
            polymodeon: 127
        };
    }
    static get MIDI_REGISTERED_PARAMETERS() {
        return {
            pitchbendrange: [
                0,
                0
            ],
            channelfinetuning: [
                0,
                1
            ],
            channelcoarsetuning: [
                0,
                2
            ],
            tuningprogram: [
                0,
                3
            ],
            tuningbank: [
                0,
                4
            ],
            modulationrange: [
                0,
                5
            ],
            azimuthangle: [
                61,
                0
            ],
            elevationangle: [
                61,
                1
            ],
            gain: [
                61,
                2
            ],
            distanceratio: [
                61,
                3
            ],
            maximumdistance: [
                61,
                4
            ],
            maximumdistancegain: [
                61,
                5
            ],
            referencedistanceratio: [
                61,
                6
            ],
            panspreadangle: [
                61,
                7
            ],
            rollangle: [
                61,
                8
            ]
        };
    }
    static get MIDI_SYSTEM_MESSAGES() {
        return {
            sysex: 240,
            timecode: 241,
            songposition: 242,
            songselect: 243,
            tunerequest: 246,
            tuningrequest: 246,
            sysexend: 247,
            clock: 248,
            start: 250,
            continue: 251,
            stop: 252,
            activesensing: 254,
            reset: 255,
            midimessage: 0,
            unknownsystemmessage: -1
        };
    }
    static get CHANNEL_EVENTS() {
        return [
            "noteoff",
            "controlchange",
            "noteon",
            "keyaftertouch",
            "programchange",
            "channelaftertouch",
            "pitchbend",
            "allnotesoff",
            "allsoundoff",
            "localcontrol",
            "monomode",
            "omnimode",
            "resetallcontrollers",
            "nrpn",
            "nrpn-dataentrycoarse",
            "nrpn-dataentryfine",
            "nrpn-databuttonincrement",
            "nrpn-databuttondecrement",
            "rpn",
            "rpn-dataentrycoarse",
            "rpn-dataentryfine",
            "rpn-databuttonincrement",
            "rpn-databuttondecrement"
        ];
    }
}
/**
 * The `Note` class represents a single musical note such as `"D3"`, `"G#4"`, `"F-1"`, `"Gb7"`, etc.
 *
 * `Note` objects can be played back on a single channel by calling
 * [`OutputChannel.playNote()`]{@link OutputChannel#playNote} or, on multiple channels of the same
 * output, by calling [`Output.playNote()`]{@link Output#playNote}.
 *
 * The note has [`attack`](#attack) and [`release`](#release) velocities set at `0.5` by default.
 * These can be changed by passing in the appropriate option. It is also possible to set a
 * system-wide default for attack and release velocities by using the
 * [`WebMidi.defaults`](WebMidi#defaults) property.
 *
 * If you prefer to work with raw MIDI values (`0` to `127`), you can use [`rawAttack`](#rawAttack) and
 * [`rawRelease`](#rawRelease) to both get and set the values.
 *
 * The note may have a [`duration`](#duration). If it does, playback will be automatically stopped
 * when the duration has elapsed by sending a `"noteoff"` event. By default, the duration is set to
 * `Infinity`. In this case, it will never stop playing unless explicitly stopped by calling a
 * method such as [`OutputChannel.stopNote()`]{@link OutputChannel#stopNote},
 * [`Output.stopNote()`]{@link Output#stopNote} or similar.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */ class Note {
    constructor(e, t = {}){
        this.duration = wm.defaults.note.duration, this.attack = wm.defaults.note.attack, this.release = wm.defaults.note.release, null != t.duration && (this.duration = t.duration), null != t.attack && (this.attack = t.attack), null != t.rawAttack && (this.attack = Utilities.from7bitToFloat(t.rawAttack)), null != t.release && (this.release = t.release), null != t.rawRelease && (this.release = Utilities.from7bitToFloat(t.rawRelease)), Number.isInteger(e) ? this.identifier = Utilities.toNoteIdentifier(e) : this.identifier = e;
    }
    get identifier() {
        return this._name + (this._accidental || "") + this._octave;
    }
    set identifier(e) {
        const t = Utilities.getNoteDetails(e);
        if (wm.validation && !e) throw new Error("Invalid note identifier");
        this._name = t.name, this._accidental = t.accidental, this._octave = t.octave;
    }
    get name() {
        return this._name;
    }
    set name(e) {
        if (wm.validation && (e = e.toUpperCase(), ![
            "C",
            "D",
            "E",
            "F",
            "G",
            "A",
            "B"
        ].includes(e))) throw new Error("Invalid name value");
        this._name = e;
    }
    get accidental() {
        return this._accidental;
    }
    set accidental(e) {
        if (wm.validation && (e = e.toLowerCase(), ![
            "#",
            "##",
            "b",
            "bb"
        ].includes(e))) throw new Error("Invalid accidental value");
        this._accidental = e;
    }
    get octave() {
        return this._octave;
    }
    set octave(e) {
        if (wm.validation && (e = parseInt(e), isNaN(e))) throw new Error("Invalid octave value");
        this._octave = e;
    }
    get duration() {
        return this._duration;
    }
    set duration(e) {
        if (wm.validation && (e = parseFloat(e), isNaN(e) || null === e || e < 0)) throw new RangeError("Invalid duration value.");
        this._duration = e;
    }
    get attack() {
        return this._attack;
    }
    set attack(e) {
        if (wm.validation && (e = parseFloat(e), isNaN(e) || !(e >= 0 && e <= 1))) throw new RangeError("Invalid attack value.");
        this._attack = e;
    }
    get release() {
        return this._release;
    }
    set release(e) {
        if (wm.validation && (e = parseFloat(e), isNaN(e) || !(e >= 0 && e <= 1))) throw new RangeError("Invalid release value.");
        this._release = e;
    }
    get rawAttack() {
        return Utilities.fromFloatTo7Bit(this._attack);
    }
    set rawAttack(e) {
        this._attack = Utilities.from7bitToFloat(e);
    }
    get rawRelease() {
        return Utilities.fromFloatTo7Bit(this._release);
    }
    set rawRelease(e) {
        this._release = Utilities.from7bitToFloat(e);
    }
    get number() {
        return Utilities.toNoteNumber(this.identifier);
    }
    getOffsetNumber(e = 0, t = 0) {
        return wm.validation && (e = parseInt(e) || 0, t = parseInt(t) || 0), Math.min(Math.max(this.number + 12 * e + t, 0), 127);
    }
}
/**
 * The `Utilities` class contains general-purpose utility methods. All methods are static and
 * should be called using the class name. For example: `Utilities.getNoteDetails("C4")`.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */ class Utilities {
    /**
   * Returns a MIDI note number matching the identifier passed in the form of a string. The
   * identifier must include the octave number. The identifier also optionally include a sharp (#),
   * a double sharp (##), a flat (b) or a double flat (bb) symbol. For example, these are all valid
   * identifiers: C5, G4, D#-1, F0, Gb7, Eb-1, Abb4, B##6, etc.
   *
   * When converting note identifiers to numbers, C4 is considered to be middle C (MIDI note number
   * 60) as per the scientific pitch notation standard.
   *
   * The resulting note number can be offset by using the `octaveOffset` parameter.
   *
   * @param identifier {string} The identifier in the form of a letter, followed by an optional "#",
   * "##", "b" or "bb" followed by the octave number. For exemple: C5, G4, D#-1, F0, Gb7, Eb-1,
   * Abb4, B##6, etc.
   *
   * @param {number} [octaveOffset=0] A integer to offset the octave by.
   *
   * @returns {number} The MIDI note number (an integer between 0 and 127).
   *
   * @throws RangeError Invalid 'octaveOffset' value
   *
   * @throws TypeError Invalid note identifier
   *
   * @license Apache-2.0
   * @since 3.0.0
   * @static
   */ static toNoteNumber(e, t = 0) {
        if (t = null == t ? 0 : parseInt(t), isNaN(t)) throw new RangeError("Invalid 'octaveOffset' value");
        "string" != typeof e && (e = "");
        const n = this.getNoteDetails(e);
        if (!n) throw new TypeError("Invalid note identifier");
        let s = 12 * (n.octave + 1 + t);
        if (s += ({
            C: 0,
            D: 2,
            E: 4,
            F: 5,
            G: 7,
            A: 9,
            B: 11
        })[n.name], n.accidental && (n.accidental.startsWith("b") ? s -= n.accidental.length : s += n.accidental.length), s < 0 || s > 127) throw new RangeError("Invalid octaveOffset value");
        return s;
    }
    static getNoteDetails(e) {
        Number.isInteger(e) && (e = this.toNoteIdentifier(e));
        const t = e.match(/^([CDEFGAB])(#{0,2}|b{0,2})(-?\d+)$/i);
        if (!t) throw new TypeError("Invalid note identifier");
        const n = t[1].toUpperCase(), s = parseInt(t[3]);
        let r = t[2].toLowerCase();
        return r = "" === r ? void 0 : r, {
            accidental: r,
            identifier: n + (r || "") + s,
            name: n,
            octave: s
        };
    }
    static sanitizeChannels(e6) {
        let t;
        if (this.validation) {
            if ("all" === e6) t = [
                "all"
            ];
            else if ("none" === e6) return [];
        }
        return t = Array.isArray(e6) ? e6 : [
            e6
        ], t.indexOf("all") > -1 && (t = Enumerations.MIDI_CHANNEL_NUMBERS), t.map(function(e) {
            return parseInt(e);
        }).filter(function(e) {
            return e >= 1 && e <= 16;
        });
    }
    static toTimestamp(e) {
        let t = !1;
        const n = parseFloat(e);
        return !isNaN(n) && ("string" == typeof e && "+" === e.substring(0, 1) ? n >= 0 && (t = wm.time + n) : n >= 0 && (t = n), t);
    }
    static guessNoteNumber(e, t) {
        t = parseInt(t) || 0;
        let n = !1;
        if (Number.isInteger(e) && e >= 0 && e <= 127) n = parseInt(e);
        else if (parseInt(e) >= 0 && parseInt(e) <= 127) n = parseInt(e);
        else if ("string" == typeof e || e instanceof String) try {
            n = this.toNoteNumber(e.trim(), t);
        } catch (e7) {
            return !1;
        }
        return n;
    }
    static toNoteIdentifier(e, t) {
        if (e = parseInt(e), isNaN(e) || e < 0 || e > 127) throw new RangeError("Invalid note number");
        if (t = null == t ? 0 : parseInt(t), isNaN(t)) throw new RangeError("Invalid octaveOffset value");
        const n = Math.floor(e / 12 - 1) + t;
        return [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B"
        ][e % 12] + n.toString();
    }
    static buildNote(e, t = {}) {
        if (t.octaveOffset = parseInt(t.octaveOffset) || 0, e instanceof Note) return e;
        let n = this.guessNoteNumber(e, t.octaveOffset);
        if (!1 === n) throw new TypeError(`The input could not be parsed as a note (${e})`);
        return t.octaveOffset = void 0, new Note(n, t);
    }
    static buildNoteArray(e8, t = {}) {
        let n = [];
        return Array.isArray(e8) || (e8 = [
            e8
        ]), e8.forEach((e)=>{
            n.push(this.buildNote(e, t));
        }), n;
    }
    static from7bitToFloat(e) {
        return e === 1 / 0 && (e = 127), e = parseInt(e) || 0, Math.min(Math.max(e / 127, 0), 1);
    }
    static fromFloatTo7Bit(e) {
        return e === 1 / 0 && (e = 1), e = parseFloat(e) || 0, Math.min(Math.max(Math.round(127 * e), 0), 127);
    }
    static fromMsbLsbToFloat(e, t = 0) {
        wm.validation && (e = Math.min(Math.max(parseInt(e) || 0, 0), 127), t = Math.min(Math.max(parseInt(t) || 0, 0), 127));
        const n = ((e << 7) + t) / 16383;
        return Math.min(Math.max(n, 0), 1);
    }
    static fromFloatToMsbLsb(e) {
        wm.validation && (e = Math.min(Math.max(parseFloat(e) || 0, 0), 1));
        const t = Math.round(16383 * e);
        return {
            msb: t >> 7,
            lsb: 127 & t
        };
    }
    static offsetNumber(e, t = 0, n = 0) {
        if (wm.validation) {
            if (e = parseInt(e), isNaN(e)) throw new Error("Invalid note number");
            t = parseInt(t) || 0, n = parseInt(n) || 0;
        }
        return Math.min(Math.max(e + 12 * t + n, 0), 127);
    }
    static getPropertyByValue(e, t) {
        return Object.keys(e).find((n)=>e[n] === t);
    }
    static getCcNameByNumber(e) {
        return Utilities.getPropertyByValue(Enumerations.MIDI_CONTROL_CHANGE_MESSAGES, e);
    }
    static getChannelModeByNumber(e) {
        if (!(e >= 120 && e <= 127)) return !1;
        for(let t in Enumerations.MIDI_CHANNEL_MODE_MESSAGES)if (Enumerations.MIDI_CHANNEL_MODE_MESSAGES.hasOwnProperty(t) && e === Enumerations.MIDI_CHANNEL_MODE_MESSAGES[t]) return t;
        return !1;
    }
    static get isNode() {
        return "undefined" != typeof process && null != process.versions && null != process.versions.node;
    }
    static get isBrowser() {
        return "undefined" != typeof window && void 0 !== window.document;
    }
}
/**
 * The `OutputChannel` class represents a single output MIDI channel. `OutputChannel` objects are
 * provided by an [`Output`](Output) port which, itself, is made available by a device. The
 * `OutputChannel` object is derived from the host's MIDI subsystem and should not be instantiated
 * directly.
 *
 * All 16 `OutputChannel` objects can be found inside the parent output's
 * [`channels`]{@link Output#channels} property.
 *
 * @param {Output} output The [`Output`](Output) this channel belongs to.
 * @param {number} number The MIDI channel number (`1` - `16`).
 *
 * @extends EventEmitter
 * @license Apache-2.0
 * @since 3.0.0
 */ class OutputChannel extends EventEmitter {
    constructor(e, t){
        super(), this._output = e, this._number = t, this._octaveOffset = 0;
    }
    destroy() {
        this._output = null, this._number = null, this._octaveOffset = 0, this.removeListener();
    }
    send(e, t = {
        time: 0
    }) {
        return this.output.send(e, t), this;
    }
    sendKeyAftertouch(e9, t, n = {}) {
        if (wm.validation) {
            if (n.useRawValue && (n.rawValue = n.useRawValue), isNaN(parseFloat(t))) throw new RangeError("Invalid key aftertouch value.");
            if (n.rawValue) {
                if (!(t >= 0 && t <= 127 && Number.isInteger(t))) throw new RangeError("Key aftertouch raw value must be an integer between 0 and 127.");
            } else if (!(t >= 0 && t <= 1)) throw new RangeError("Key aftertouch value must be a float between 0 and 1.");
        }
        n.rawValue || (t = Utilities.fromFloatTo7Bit(t));
        const s = wm.octaveOffset + this.output.octaveOffset + this.octaveOffset;
        return Array.isArray(e9) || (e9 = [
            e9
        ]), Utilities.buildNoteArray(e9).forEach((e)=>{
            this.send([
                (Enumerations.MIDI_CHANNEL_MESSAGES.keyaftertouch << 4) + (this.number - 1),
                e.getOffsetNumber(s),
                t
            ], {
                time: Utilities.toTimestamp(n.time)
            });
        }), this;
    }
    /**
   * Sends a MIDI **control change** message to the channel at the scheduled time. The control
   * change message to send can be specified numerically (`0` to `127`) or by using one of the
   * following common names:
   *
   * | Number | Name                          |
   * |--------|-------------------------------|
   * | 0      |`bankselectcoarse`             |
   * | 1      |`modulationwheelcoarse`        |
   * | 2      |`breathcontrollercoarse`       |
   * | 4      |`footcontrollercoarse`         |
   * | 5      |`portamentotimecoarse`         |
   * | 6      |`dataentrycoarse`              |
   * | 7      |`volumecoarse`                 |
   * | 8      |`balancecoarse`                |
   * | 10     |`pancoarse`                    |
   * | 11     |`expressioncoarse`             |
   * | 12     |`effectcontrol1coarse`         |
   * | 13     |`effectcontrol2coarse`         |
   * | 18     |`generalpurposeslider3`        |
   * | 19     |`generalpurposeslider4`        |
   * | 32     |`bankselectfine`               |
   * | 33     |`modulationwheelfine`          |
   * | 34     |`breathcontrollerfine`         |
   * | 36     |`footcontrollerfine`           |
   * | 37     |`portamentotimefine`           |
   * | 38     |`dataentryfine`                |
   * | 39     |`volumefine`                   |
   * | 40     |`balancefine`                  |
   * | 42     |`panfine`                      |
   * | 43     |`expressionfine`               |
   * | 44     |`effectcontrol1fine`           |
   * | 45     |`effectcontrol2fine`           |
   * | 64     |`holdpedal`                    |
   * | 65     |`portamento`                   |
   * | 66     |`sustenutopedal`               |
   * | 67     |`softpedal`                    |
   * | 68     |`legatopedal`                  |
   * | 69     |`hold2pedal`                   |
   * | 70     |`soundvariation`               |
   * | 71     |`resonance`                    |
   * | 72     |`soundreleasetime`             |
   * | 73     |`soundattacktime`              |
   * | 74     |`brightness`                   |
   * | 75     |`soundcontrol6`                |
   * | 76     |`soundcontrol7`                |
   * | 77     |`soundcontrol8`                |
   * | 78     |`soundcontrol9`                |
   * | 79     |`soundcontrol10`               |
   * | 80     |`generalpurposebutton1`        |
   * | 81     |`generalpurposebutton2`        |
   * | 82     |`generalpurposebutton3`        |
   * | 83     |`generalpurposebutton4`        |
   * | 91     |`reverblevel`                  |
   * | 92     |`tremololevel`                 |
   * | 93     |`choruslevel`                  |
   * | 94     |`celestelevel`                 |
   * | 95     |`phaserlevel`                  |
   * | 96     |`databuttonincrement`          |
   * | 97     |`databuttondecrement`          |
   * | 98     |`nonregisteredparametercoarse` |
   * | 99     |`nonregisteredparameterfine`   |
   * | 100    |`registeredparametercoarse`    |
   * | 101    |`registeredparameterfine`      |
   * | 120    |`allsoundoff`                  |
   * | 121    |`resetallcontrollers`          |
   * | 122    |`localcontrol`                 |
   * | 123    |`allnotesoff`                  |
   * | 124    |`omnimodeoff`                  |
   * | 125    |`omnimodeon`                   |
   * | 126    |`monomodeon`                   |
   * | 127    |`polymodeon`                   |
   *
   * As you can see above, not all control change message have a matching name. This does not mean
   * you cannot use the others. It simply means you will need to use their number
   * (`0` to `127`) instead of their name. While you can still use them, numbers `120` to `127` are
   * usually reserved for *channel mode* messages. See
   * [`sendChannelMode()`]{@link OutputChannel#sendChannelMode} method for more info.
   *
   * To view a detailed list of all available **control change** messages, please consult "Table 3 -
   * Control Change Messages" from the [MIDI Messages](
   * https://www.midi.org/specifications/item/table-3-control-change-messages-data-bytes-2)
   * specification.
   *
   * **Note**: messages #0-31 (MSB) are paired with messages #32-63 (LSB). For example, message #1
   * (`modulationwheelcoarse`) can be accompanied by a second control change message for
   * `modulationwheelfine` to achieve a greater level of precision. if you want to specify both MSB
   * and LSB for messages between `0` and `31`, you can do so by passing a 2-value array as the
   * second parameter.
   *
   * @param {number|string} controller The MIDI controller name or number (`0` - `127`).
   *
   * @param {number|number[]} value The value to send (0-127). You can also use a two-position array
   * for controllers 0 to 31. In this scenario, the first value will be sent as usual and the second
   * value will be sent to the matching LSB controller (which is obtained by adding 32 to the first
   * controller)
   *
   * @param {object} [options={}]
   *
   * @param {number|string} [options.time=(now)] If `time` is a string prefixed with `"+"` and
   * followed by a number, the message will be delayed by that many milliseconds. If the value is a
   * positive number
   * ([`DOMHighResTimeStamp`]{@link https://developer.mozilla.org/docs/Web/API/DOMHighResTimeStamp}),
   * the operation will be scheduled for that time. The current time can be retrieved with
   * [`WebMidi.time`]{@link WebMidi#time}. If `options.time` is omitted, or in the past, the
   * operation will be carried out as soon as possible.
   *
   * @throws {RangeError} Controller numbers must be between 0 and 127.
   * @throws {RangeError} Invalid controller name.
   * @throws {TypeError} The value array must have a length of 2.
   *
   * @returns {OutputChannel} Returns the `OutputChannel` object so methods can be chained.
   *
   * @license Apache-2.0
   * @since 3.0.0
   */ sendControlChange(e10, t1, n = {}) {
        if ("string" == typeof e10 && (e10 = Enumerations.MIDI_CONTROL_CHANGE_MESSAGES[e10]), Array.isArray(t1) || (t1 = [
            t1
        ]), wm.validation) {
            if (void 0 === e10) throw new TypeError("Control change must be identified with a valid name or an integer between 0 and 127.");
            if (!Number.isInteger(e10) || !(e10 >= 0 && e10 <= 127)) throw new TypeError("Control change number must be an integer between 0 and 127.");
            if (2 === (t1 = t1.map((e)=>{
                const t = Math.min(Math.max(parseInt(e), 0), 127);
                if (isNaN(t)) throw new TypeError("Values must be integers between 0 and 127");
                return t;
            })).length && e10 >= 32) throw new TypeError("To use a value array, the controller must be between 0 and 31");
        }
        return t1.forEach((s, r)=>{
            this.send([
                (Enumerations.MIDI_CHANNEL_MESSAGES.controlchange << 4) + (this.number - 1),
                e10 + 32 * r,
                t1[r]
            ], {
                time: Utilities.toTimestamp(n.time)
            });
        }), this;
    }
    _selectNonRegisteredParameter(e, t = {}) {
        return this.sendControlChange(99, e[0], t), this.sendControlChange(98, e[1], t), this;
    }
    _deselectRegisteredParameter(e = {}) {
        return this.sendControlChange(101, 127, e), this.sendControlChange(100, 127, e), this;
    }
    _deselectNonRegisteredParameter(e = {}) {
        return this.sendControlChange(101, 127, e), this.sendControlChange(100, 127, e), this;
    }
    _selectRegisteredParameter(e, t = {}) {
        return this.sendControlChange(101, e[0], t), this.sendControlChange(100, e[1], t), this;
    }
    _setCurrentParameter(e, t = {}) {
        return e = [].concat(e), this.sendControlChange(6, e[0], t), e.length < 2 || this.sendControlChange(38, e[1], t), this;
    }
    sendRpnDecrement(e, t = {}) {
        if (Array.isArray(e) || (e = Enumerations.MIDI_REGISTERED_PARAMETERS[e]), wm.validation) {
            if (void 0 === e) throw new TypeError("The specified registered parameter is invalid.");
            let t = !1;
            if (Object.getOwnPropertyNames(Enumerations.MIDI_REGISTERED_PARAMETERS).forEach((n)=>{
                Enumerations.MIDI_REGISTERED_PARAMETERS[n][0] === e[0] && Enumerations.MIDI_REGISTERED_PARAMETERS[n][1] === e[1] && (t = !0);
            }), !t) throw new TypeError("The specified registered parameter is invalid.");
        }
        return this._selectRegisteredParameter(e, t), this.sendControlChange(97, 0, t), this._deselectRegisteredParameter(t), this;
    }
    sendRpnIncrement(e, t = {}) {
        if (Array.isArray(e) || (e = Enumerations.MIDI_REGISTERED_PARAMETERS[e]), wm.validation) {
            if (void 0 === e) throw new TypeError("The specified registered parameter is invalid.");
            let t = !1;
            if (Object.getOwnPropertyNames(Enumerations.MIDI_REGISTERED_PARAMETERS).forEach((n)=>{
                Enumerations.MIDI_REGISTERED_PARAMETERS[n][0] === e[0] && Enumerations.MIDI_REGISTERED_PARAMETERS[n][1] === e[1] && (t = !0);
            }), !t) throw new TypeError("The specified registered parameter is invalid.");
        }
        return this._selectRegisteredParameter(e, t), this.sendControlChange(96, 0, t), this._deselectRegisteredParameter(t), this;
    }
    playNote(e, t = {}) {
        if (this.sendNoteOn(e, t), t.duration > 0 && isFinite(String(t.duration).trim() || NaN)) {
            let n = {
                time: (Utilities.toTimestamp(t.time) || wm.time) + t.duration,
                release: t.release,
                rawRelease: t.rawRelease
            };
            this.sendNoteOff(e, n);
        }
        return this;
    }
    sendNoteOff(e11, t = {}) {
        if (wm.validation) {
            if (null != t.rawRelease && !(t.rawRelease >= 0 && t.rawRelease <= 127)) throw new RangeError("The 'rawRelease' option must be an integer between 0 and 127");
            if (null != t.release && !(t.release >= 0 && t.release <= 1)) throw new RangeError("The 'release' option must be an number between 0 and 1");
            t.rawVelocity && (t.rawRelease = t.velocity, console.warn("The 'rawVelocity' option is deprecated. Use 'rawRelease' instead.")), t.velocity && (t.release = t.velocity, console.warn("The 'velocity' option is deprecated. Use 'attack' instead."));
        }
        let n = 64;
        null != t.rawRelease ? n = t.rawRelease : isNaN(t.release) || (n = Math.round(127 * t.release));
        const s = wm.octaveOffset + this.output.octaveOffset + this.octaveOffset;
        return Utilities.buildNoteArray(e11, {
            rawRelease: parseInt(n)
        }).forEach((e)=>{
            this.send([
                (Enumerations.MIDI_CHANNEL_MESSAGES.noteoff << 4) + (this.number - 1),
                e.getOffsetNumber(s),
                e.rawRelease
            ], {
                time: Utilities.toTimestamp(t.time)
            });
        }), this;
    }
    stopNote(e, t = {}) {
        return this.sendNoteOff(e, t);
    }
    sendNoteOn(e12, t = {}) {
        if (wm.validation) {
            if (null != t.rawAttack && !(t.rawAttack >= 0 && t.rawAttack <= 127)) throw new RangeError("The 'rawAttack' option must be an integer between 0 and 127");
            if (null != t.attack && !(t.attack >= 0 && t.attack <= 1)) throw new RangeError("The 'attack' option must be an number between 0 and 1");
            t.rawVelocity && (t.rawAttack = t.velocity, t.rawRelease = t.release, console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' or 'rawRelease'.")), t.velocity && (t.attack = t.velocity, console.warn("The 'velocity' option is deprecated. Use 'attack' instead."));
        }
        let n = 64;
        null != t.rawAttack ? n = t.rawAttack : isNaN(t.attack) || (n = Math.round(127 * t.attack));
        const s = wm.octaveOffset + this.output.octaveOffset + this.octaveOffset;
        return Utilities.buildNoteArray(e12, {
            rawAttack: n
        }).forEach((e)=>{
            this.send([
                (Enumerations.MIDI_CHANNEL_MESSAGES.noteon << 4) + (this.number - 1),
                e.getOffsetNumber(s),
                e.rawAttack
            ], {
                time: Utilities.toTimestamp(t.time)
            });
        }), this;
    }
    sendChannelMode(e, t = 0, n = {}) {
        if ("string" == typeof e && (e = Enumerations.MIDI_CHANNEL_MODE_MESSAGES[e]), wm.validation) {
            if (void 0 === e) throw new TypeError("Invalid channel mode message name or number.");
            if (isNaN(e) || !(e >= 120 && e <= 127)) throw new TypeError("Invalid channel mode message number.");
            if (isNaN(parseInt(t)) || t < 0 || t > 127) throw new RangeError("Value must be an integer between 0 and 127.");
        }
        return this.send([
            (Enumerations.MIDI_CHANNEL_MESSAGES.controlchange << 4) + (this.number - 1),
            e,
            t
        ], {
            time: Utilities.toTimestamp(n.time)
        }), this;
    }
    sendOmniMode(e, t = {}) {
        return void 0 === e || e ? this.sendChannelMode("omnimodeon", 0, t) : this.sendChannelMode("omnimodeoff", 0, t), this;
    }
    sendChannelAftertouch(e, t = {}) {
        if (wm.validation) {
            if (isNaN(parseFloat(e))) throw new RangeError("Invalid channel aftertouch value.");
            if (t.rawValue) {
                if (!(e >= 0 && e <= 127 && Number.isInteger(e))) throw new RangeError("Channel aftertouch raw value must be an integer between 0 and 127.");
            } else if (!(e >= 0 && e <= 1)) throw new RangeError("Channel aftertouch value must be a float between 0 and 1.");
        }
        return this.send([
            (Enumerations.MIDI_CHANNEL_MESSAGES.channelaftertouch << 4) + (this.number - 1),
            Math.round(127 * e)
        ], {
            time: Utilities.toTimestamp(t.time)
        }), this;
    }
    sendMasterTuning(e, t = {}) {
        if (e = parseFloat(e) || 0, wm.validation && !(e > -65 && e < 64)) throw new RangeError("The value must be a decimal number larger than -65 and smaller than 64.");
        let n = Math.floor(e) + 64, s = e - Math.floor(e);
        s = Math.round((s + 1) / 2 * 16383);
        let r = s >> 7 & 127, i = 127 & s;
        return this.sendRpnValue("channelcoarsetuning", n, t), this.sendRpnValue("channelfinetuning", [
            r,
            i
        ], t), this;
    }
    sendModulationRange(e, t, n = {}) {
        if (wm.validation) {
            if (!Number.isInteger(e) || !(e >= 0 && e <= 127)) throw new RangeError("The semitones value must be an integer between 0 and 127.");
            if (!(null == t || Number.isInteger(t) && t >= 0 && t <= 127)) throw new RangeError("If specified, the cents value must be an integer between 0 and 127.");
        }
        return t >= 0 && t <= 127 || (t = 0), this.sendRpnValue("modulationrange", [
            e,
            t
        ], n), this;
    }
    sendNrpnValue(e13, t, n = {}) {
        if (t = [].concat(t), wm.validation) {
            if (!Array.isArray(e13) || !Number.isInteger(e13[0]) || !Number.isInteger(e13[1])) throw new TypeError("The specified NRPN is invalid.");
            if (!(e13[0] >= 0 && e13[0] <= 127)) throw new RangeError("The first byte of the NRPN must be between 0 and 127.");
            if (!(e13[1] >= 0 && e13[1] <= 127)) throw new RangeError("The second byte of the NRPN must be between 0 and 127.");
            t.forEach((e)=>{
                if (!(e >= 0 && e <= 127)) throw new RangeError("The data bytes of the NRPN must be between 0 and 127.");
            });
        }
        return this._selectNonRegisteredParameter(e13, n), this._setCurrentParameter(t, n), this._deselectNonRegisteredParameter(n), this;
    }
    sendPitchBend(e, t = {}) {
        if (wm.validation) {
            if (t.rawValue && Array.isArray(e)) {
                if (!(e[0] >= 0 && e[0] <= 127)) throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.");
                if (!(e[1] >= 0 && e[1] <= 127)) throw new RangeError("The pitch bend LSB must be an integer between 0 and 127.");
            } else if (t.rawValue && !Array.isArray(e)) {
                if (!(e >= 0 && e <= 127)) throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.");
            } else {
                if (isNaN(e) || null === e) throw new RangeError("Invalid pitch bend value.");
                if (!(e >= -1 && e <= 1)) throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.");
            }
        }
        let n = 0, s = 0;
        if (t.rawValue && Array.isArray(e)) n = e[0], s = e[1];
        else if (t.rawValue && !Array.isArray(e)) n = e;
        else {
            const t = Utilities.fromFloatToMsbLsb((e + 1) / 2);
            n = t.msb, s = t.lsb;
        }
        return this.send([
            (Enumerations.MIDI_CHANNEL_MESSAGES.pitchbend << 4) + (this.number - 1),
            s,
            n
        ], {
            time: Utilities.toTimestamp(t.time)
        }), this;
    }
    sendPitchBendRange(e, t, n = {}) {
        if (wm.validation) {
            if (!Number.isInteger(e) || !(e >= 0 && e <= 127)) throw new RangeError("The semitones value must be an integer between 0 and 127.");
            if (!Number.isInteger(t) || !(t >= 0 && t <= 127)) throw new RangeError("The cents value must be an integer between 0 and 127.");
        }
        return this.sendRpnValue("pitchbendrange", [
            e,
            t
        ], n), this;
    }
    sendProgramChange(e, t = {}) {
        if (e = parseInt(e) || 0, wm.validation && !(e >= 0 && e <= 127)) throw new RangeError("The program number must be between 0 and 127.");
        return this.send([
            (Enumerations.MIDI_CHANNEL_MESSAGES.programchange << 4) + (this.number - 1),
            e
        ], {
            time: Utilities.toTimestamp(t.time)
        }), this;
    }
    sendRpnValue(e14, t, n = {}) {
        if (Array.isArray(e14) || (e14 = Enumerations.MIDI_REGISTERED_PARAMETERS[e14]), wm.validation) {
            if (!Number.isInteger(e14[0]) || !Number.isInteger(e14[1])) throw new TypeError("The specified NRPN is invalid.");
            if (!(e14[0] >= 0 && e14[0] <= 127)) throw new RangeError("The first byte of the RPN must be between 0 and 127.");
            if (!(e14[1] >= 0 && e14[1] <= 127)) throw new RangeError("The second byte of the RPN must be between 0 and 127.");
            [].concat(t).forEach((e)=>{
                if (!(e >= 0 && e <= 127)) throw new RangeError("The data bytes of the RPN must be between 0 and 127.");
            });
        }
        return this._selectRegisteredParameter(e14, n), this._setCurrentParameter(t, n), this._deselectRegisteredParameter(n), this;
    }
    sendTuningBank(e, t = {}) {
        if (wm.validation && (!Number.isInteger(e) || !(e >= 0 && e <= 127))) throw new RangeError("The tuning bank number must be between 0 and 127.");
        return this.sendRpnValue("tuningbank", e, t), this;
    }
    sendTuningProgram(e, t = {}) {
        if (wm.validation && (!Number.isInteger(e) || !(e >= 0 && e <= 127))) throw new RangeError("The tuning program number must be between 0 and 127.");
        return this.sendRpnValue("tuningprogram", e, t), this;
    }
    sendLocalControl(e, t = {}) {
        return e ? this.sendChannelMode("localcontrol", 127, t) : this.sendChannelMode("localcontrol", 0, t);
    }
    sendAllNotesOff(e = {}) {
        return this.sendChannelMode("allnotesoff", 0, e);
    }
    sendAllSoundOff(e = {}) {
        return this.sendChannelMode("allsoundoff", 0, e);
    }
    sendResetAllControllers(e = {}) {
        return this.sendChannelMode("resetallcontrollers", 0, e);
    }
    sendPolyphonicMode(e, t = {}) {
        return "mono" === e ? this.sendChannelMode("monomodeon", 0, t) : this.sendChannelMode("polymodeon", 0, t);
    }
    get octaveOffset() {
        return this._octaveOffset;
    }
    set octaveOffset(e) {
        if (this.validation && (e = parseInt(e), isNaN(e))) throw new TypeError("The 'octaveOffset' property must be an integer.");
        this._octaveOffset = e;
    }
    get output() {
        return this._output;
    }
    get number() {
        return this._number;
    }
}
/**
 * The `Output` class represents a single MIDI output port (not to be confused with a MIDI channel).
 * A port is made available by a MIDI device. A MIDI device can advertise several input and output
 * ports. Each port has 16 MIDI channels which can be accessed via the [`channels`](#channels)
 * property.
 *
 * The `Output` object is automatically instantiated by the library according to the host's MIDI
 * subsystem and should not be directly instantiated.
 *
 * You can access all available `Output` objects by referring to the
 * [`WebMidi.outputs`](WebMidi#outputs) array or by using methods such as
 * [`WebMidi.getOutputByName()`](WebMidi#getOutputByName) or
 * [`WebMidi.getOutputById()`](WebMidi#getOutputById).
 *
 * @fires Output#opened
 * @fires Output#disconnected
 * @fires Output#closed
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */ class Output extends EventEmitter {
    constructor(e){
        super(), this._midiOutput = e, this._octaveOffset = 0, this.channels = [];
        for(let e15 = 1; e15 <= 16; e15++)this.channels[e15] = new OutputChannel(this, e15);
        this._midiOutput.onstatechange = this._onStateChange.bind(this);
    }
    async destroy() {
        this.removeListener(), this.channels.forEach((e)=>e.destroy()), this.channels = [], this._midiOutput.onstatechange = null, await this.close(), this._midiOutput = null;
    }
    _onStateChange(e) {
        let t = {
            timestamp: wm.time
        };
        "open" === e.port.connection ? (t.type = "opened", t.target = this, t.port = t.target, this.emit("opened", t)) : "closed" === e.port.connection && "connected" === e.port.state ? (t.type = "closed", t.target = this, t.port = t.target, this.emit("closed", t)) : "closed" === e.port.connection && "disconnected" === e.port.state ? (t.type = "disconnected", t.port = {
            connection: e.port.connection,
            id: e.port.id,
            manufacturer: e.port.manufacturer,
            name: e.port.name,
            state: e.port.state,
            type: e.port.type
        }, this.emit("disconnected", t)) : "pending" === e.port.connection && "disconnected" === e.port.state || console.warn("This statechange event was not caught:", e.port.connection, e.port.state);
    }
    async open() {
        try {
            return await this._midiOutput.open(), Promise.resolve(this);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async close() {
        this._midiOutput ? await this._midiOutput.close() : await Promise.resolve();
    }
    /**
   * Sends a MIDI message on the MIDI output port. If no time is specified, the message will be
   * sent immediately. The message should be an array of 8 bit unsigned integers (0-225), a
   * [`Uint8Array`]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array}
   * object or a [`Message`](Message) object.
   *
   * It is usually not necessary to use this method directly as you can use one of the simpler
   * helper methods such as [`playNote()`](#playNote), [`stopNote()`](#stopNote),
   * [`sendControlChange()`](#sendControlChange), etc.
   *
   * Details on the format of MIDI messages are available in the summary of
   * [MIDI messages]{@link https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message}
   * from the MIDI Manufacturers Association.
   *
   * @param message {number[]|Uint8Array|Message} An array of 8bit unsigned integers, a `Uint8Array`
   * object (not available in Node.js) containing the message bytes or a `Message` object.
   *
   * @param {object} [options={}]
   *
   * @param {number|string} [options.time=(now)] If `time` is a string prefixed with `"+"` and
   * followed by a number, the message will be delayed by that many milliseconds. If the value is a
   * positive number
   * ([`DOMHighResTimeStamp`]{@link https://developer.mozilla.org/docs/Web/API/DOMHighResTimeStamp}),
   * the operation will be scheduled for that time. The current time can be retrieved with
   * [`WebMidi.time`]{@link WebMidi#time}. If `options.time` is omitted, or in the past, the
   * operation will be carried out as soon as possible.
   *
   * @throws {RangeError} The first byte (status) must be an integer between 128 and 255.
   *
   * @returns {Output} Returns the `Output` object so methods can be chained.
   *
   * @license Apache-2.0
   */ send(e16, t = {
        time: 0
    }, n = 0) {
        if (e16 instanceof Message && (e16 = Utilities.isNode ? e16.data : e16.rawData), e16 instanceof Uint8Array && Utilities.isNode && (e16 = Array.from(e16)), wm.validation) {
            if (Array.isArray(e16) || e16 instanceof Uint8Array || (e16 = [
                e16
            ], Array.isArray(t) && (e16 = e16.concat(t)), t = isNaN(n) ? {
                time: 0
            } : {
                time: n
            }), !(parseInt(e16[0]) >= 128 && parseInt(e16[0]) <= 255)) throw new RangeError("The first byte (status) must be an integer between 128 and 255.");
            e16.slice(1).forEach((e)=>{
                if (!((e = parseInt(e)) >= 0 && e <= 255)) throw new RangeError("Data bytes must be integers between 0 and 255.");
            }), t || (t = {
                time: 0
            });
        }
        return this._midiOutput.send(e16, Utilities.toTimestamp(t.time)), this;
    }
    sendSysex(e, t = [], n = {}) {
        if (e = [].concat(e), t instanceof Uint8Array) {
            const s = new Uint8Array(1 + e.length + t.length + 1);
            s[0] = Enumerations.MIDI_SYSTEM_MESSAGES.sysex, s.set(Uint8Array.from(e), 1), s.set(t, 1 + e.length), s[s.length - 1] = Enumerations.MIDI_SYSTEM_MESSAGES.sysexend, this.send(s, {
                time: n.time
            });
        } else {
            const s = e.concat(t, Enumerations.MIDI_SYSTEM_MESSAGES.sysexend);
            this.send([
                Enumerations.MIDI_SYSTEM_MESSAGES.sysex
            ].concat(s), {
                time: n.time
            });
        }
        return this;
    }
    clear() {
        return this._midiOutput.clear ? this._midiOutput.clear() : wm.validation && console.warn("The 'clear()' method has not yet been implemented in your environment."), this;
    }
    sendTimecodeQuarterFrame(e, t = {}) {
        if (wm.validation && (e = parseInt(e), isNaN(e) || !(e >= 0 && e <= 127))) throw new RangeError("The value must be an integer between 0 and 127.");
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.timecode,
            e
        ], {
            time: t.time
        }), this;
    }
    sendSongPosition(e = 0, t = {}) {
        var n = (e = Math.floor(e) || 0) >> 7 & 127, s = 127 & e;
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.songposition,
            n,
            s
        ], {
            time: t.time
        }), this;
    }
    sendSongSelect(e = 0, t = {}) {
        if (wm.validation && (e = parseInt(e), isNaN(e) || !(e >= 0 && e <= 127))) throw new RangeError("The program value must be between 0 and 127");
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.songselect,
            e
        ], {
            time: t.time
        }), this;
    }
    sendTuneRequest(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.tunerequest
        ], {
            time: e.time
        }), this;
    }
    sendClock(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.clock
        ], {
            time: e.time
        }), this;
    }
    sendStart(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.start
        ], {
            time: e.time
        }), this;
    }
    sendContinue(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.continue
        ], {
            time: e.time
        }), this;
    }
    sendStop(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.stop
        ], {
            time: e.time
        }), this;
    }
    sendActiveSensing(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.activesensing
        ], {
            time: e.time
        }), this;
    }
    sendReset(e = {}) {
        return this.send([
            Enumerations.MIDI_SYSTEM_MESSAGES.reset
        ], {
            time: e.time
        }), this;
    }
    sendTuningRequest(e = {}) {
        return wm.validation && console.warn("The sendTuningRequest() method has been deprecated. Use sendTuningRequest() instead."), this.sendTuneRequest(e);
    }
    sendKeyAftertouch(e, t, n = {}) {
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendKeyAftertouch(e, t, n);
        }), this;
    }
    sendControlChange(e, t, n = {}, s2 = {}) {
        if (wm.validation && (Array.isArray(n) || Number.isInteger(n) || "all" === n)) {
            const e = n;
            (n = s2).channels = e, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendControlChange(e, t, n);
        }), this;
    }
    sendPitchBendRange(e = 0, t = 0, n = {}) {
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendPitchBendRange(e, t, n);
        }), this;
    }
    setPitchBendRange(e = 0, t = 0, n = "all", s = {}) {
        return wm.validation && (console.warn("The setPitchBendRange() method is deprecated. Use sendPitchBendRange() instead."), s.channels = n, "all" === s.channels && (s.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendPitchBendRange(e, t, s);
    }
    sendRpnValue(e, t, n = {}) {
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendRpnValue(e, t, n);
        }), this;
    }
    setRegisteredParameter(e, t = [], n = "all", s = {}) {
        return wm.validation && (console.warn("The setRegisteredParameter() method is deprecated. Use sendRpnValue() instead."), s.channels = n, "all" === s.channels && (s.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendRpnValue(e, t, s);
    }
    sendChannelAftertouch(e, t = {}, n1 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n1).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendChannelAftertouch(e, t);
        }), this;
    }
    sendPitchBend(e, t = {}, n2 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n2).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendPitchBend(e, t);
        }), this;
    }
    sendProgramChange(e = 0, t = {}, n3 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n3).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendProgramChange(e, t);
        }), this;
    }
    sendModulationRange(e, t, n = {}) {
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendModulationRange(e, t, n);
        }), this;
    }
    setModulationRange(e = 0, t = 0, n = "all", s = {}) {
        return wm.validation && (console.warn("The setModulationRange() method is deprecated. Use sendModulationRange() instead."), s.channels = n, "all" === s.channels && (s.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendModulationRange(e, t, s);
    }
    sendMasterTuning(e, t = {}) {
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendMasterTuning(e, t);
        }), this;
    }
    setMasterTuning(e, t = {}, n = {}) {
        return wm.validation && (console.warn("The setMasterTuning() method is deprecated. Use sendMasterTuning() instead."), n.channels = t, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendMasterTuning(e, n);
    }
    sendTuningProgram(e, t = {}) {
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendTuningProgram(e, t);
        }), this;
    }
    setTuningProgram(e, t = "all", n = {}) {
        return wm.validation && (console.warn("The setTuningProgram() method is deprecated. Use sendTuningProgram() instead."), n.channels = t, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendTuningProgram(e, n);
    }
    sendTuningBank(e = 0, t = {}) {
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendTuningBank(e, t);
        }), this;
    }
    setTuningBank(e, t = "all", n = {}) {
        return wm.validation && (console.warn("The setTuningBank() method is deprecated. Use sendTuningBank() instead."), n.channels = t, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendTuningBank(e, n);
    }
    sendChannelMode(e, t = 0, n = {}, s3 = {}) {
        if (wm.validation && (Array.isArray(n) || Number.isInteger(n) || "all" === n)) {
            const e = n;
            (n = s3).channels = e, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendChannelMode(e, t, n);
        }), this;
    }
    sendAllSoundOff(e = {}) {
        return null == e.channels && (e.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(e.channels).forEach((t)=>{
            this.channels[t].sendAllSoundOff(e);
        }), this;
    }
    sendAllNotesOff(e = {}) {
        return null == e.channels && (e.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(e.channels).forEach((t)=>{
            this.channels[t].sendAllNotesOff(e);
        }), this;
    }
    sendResetAllControllers(e = {}, t2 = {}) {
        if (wm.validation && (Array.isArray(e) || Number.isInteger(e) || "all" === e)) {
            const n = e;
            (e = t2).channels = n, "all" === e.channels && (e.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == e.channels && (e.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(e.channels).forEach((t)=>{
            this.channels[t].sendResetAllControllers(e);
        }), this;
    }
    sendPolyphonicMode(e, t = {}, n4 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n4).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendPolyphonicMode(e, t);
        }), this;
    }
    sendLocalControl(e, t = {}, n5 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n5).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendLocalControl(e, t);
        }), this;
    }
    sendOmniMode(e, t = {}, n6 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n6).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendOmniMode(e, t);
        }), this;
    }
    sendNrpnValue(e, t, n = {}) {
        return null == n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].sendNrpnValue(e, t, n);
        }), this;
    }
    setNonRegisteredParameter(e, t = [], n = "all", s = {}) {
        return wm.validation && (console.warn("The setNonRegisteredParameter() method is deprecated. Use sendNrpnValue() instead."), s.channels = n, "all" === s.channels && (s.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendNrpnValue(e, t, s);
    }
    sendRpnIncrement(e, t = {}) {
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendRpnIncrement(e, t);
        }), this;
    }
    incrementRegisteredParameter(e, t = "all", n = {}) {
        return wm.validation && (console.warn("The incrementRegisteredParameter() method is deprecated. Use sendRpnIncrement() instead."), n.channels = t, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendRpnIncrement(e, n);
    }
    sendRpnDecrement(e, t = {}) {
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendRpnDecrement(e, t);
        }), this;
    }
    decrementRegisteredParameter(e, t = "all", n = {}) {
        return wm.validation && (console.warn("The decrementRegisteredParameter() method is deprecated. Use sendRpnDecrement() instead."), n.channels = t, "all" === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS)), this.sendRpnDecrement(e, n);
    }
    sendNoteOff(e, t = {}, n7 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n7).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendNoteOff(e, t);
        }), this;
    }
    stopNote(e, t) {
        return this.sendNoteOff(e, t);
    }
    playNote(e, t = {}, n8 = {}) {
        if (wm.validation && (t.rawVelocity && console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' instead."), t.velocity && console.warn("The 'velocity' option is deprecated. Use 'velocity' instead."), Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n8).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].playNote(e, t);
        }), this;
    }
    sendNoteOn(e, t = {}, n9 = {}) {
        if (wm.validation && (Array.isArray(t) || Number.isInteger(t) || "all" === t)) {
            const e = t;
            (t = n9).channels = e, "all" === t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
        }
        return null == t.channels && (t.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(t.channels).forEach((n)=>{
            this.channels[n].sendNoteOn(e, t);
        }), this;
    }
    get name() {
        return this._midiOutput.name;
    }
    get id() {
        return this._midiOutput.id;
    }
    get connection() {
        return this._midiOutput.connection;
    }
    get manufacturer() {
        return this._midiOutput.manufacturer;
    }
    get state() {
        return this._midiOutput.state;
    }
    get type() {
        return this._midiOutput.type;
    }
    get octaveOffset() {
        return this._octaveOffset;
    }
    set octaveOffset(e) {
        if (this.validation && (e = parseInt(e), isNaN(e))) throw new TypeError("The 'octaveOffset' property must be an integer.");
        this._octaveOffset = e;
    }
}
/**
 * The `Forwarder` class allows the forwarding of MIDI messages to predetermined outputs. When you
 * call its [`forward()`](#forward) method, it will send the specified [`Message`](Message) object
 * to all the outputs listed in its [`destinations`](#destinations) property.
 *
 * If specific channels or message types have been defined in the [`channels`](#channels) or
 * [`types`](#types) properties, only messages matching the channels/types will be forwarded.
 *
 * While it can be manually instantiated, you are more likely to come across a `Forwarder` object as
 * the return value of the [`Input.addForwarder()`](Input#addForwarder) method.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */ class Forwarder {
    constructor(e17 = [], t = {}){
        this.destinations = [], this.types = [
            ...Object.keys(Enumerations.MIDI_SYSTEM_MESSAGES),
            ...Object.keys(Enumerations.MIDI_CHANNEL_MESSAGES)
        ], this.channels = Enumerations.MIDI_CHANNEL_NUMBERS, this.suspended = !1, Array.isArray(e17) || (e17 = [
            e17
        ]), t.types && !Array.isArray(t.types) && (t.types = [
            t.types
        ]), t.channels && !Array.isArray(t.channels) && (t.channels = [
            t.channels
        ]), wm.validation && (e17.forEach((e)=>{
            if (!(e instanceof Output)) throw new TypeError("Destinations must be of type 'Output'.");
        }), void 0 !== t.types && t.types.forEach((e)=>{
            if (!Enumerations.MIDI_SYSTEM_MESSAGES.hasOwnProperty(e) && !Enumerations.MIDI_CHANNEL_MESSAGES.hasOwnProperty(e)) throw new TypeError("Type must be a valid message type.");
        }), void 0 !== t.channels && t.channels.forEach((e)=>{
            if (!Enumerations.MIDI_CHANNEL_NUMBERS.includes(e)) throw new TypeError("MIDI channel must be between 1 and 16.");
        })), this.destinations = e17, t.types && (this.types = t.types), t.channels && (this.channels = t.channels);
    }
    forward(e) {
        this.suspended || this.types.includes(e.type) && (e.channel && !this.channels.includes(e.channel) || this.destinations.forEach((t)=>{
            (!wm.validation || t instanceof Output) && t.send(e);
        }));
    }
}
/**
 * The `InputChannel` class represents a single MIDI input channel (1-16) from a single input
 * device. This object is derived from the host's MIDI subsystem and should not be instantiated
 * directly.
 *
 * All 16 `InputChannel` objects can be found inside the input's [`channels`](Input#channels)
 * property.
 *
 * @fires InputChannel#midimessage
 * @fires InputChannel#unknownmessage
 *
 * @fires InputChannel#noteoff
 * @fires InputChannel#noteon
 * @fires InputChannel#keyaftertouch
 * @fires InputChannel#programchange
 * @fires InputChannel#event:controlchange-controllerxxx
 * @fires InputChannel#channelaftertouch
 * @fires InputChannel#pitchbend
 * @fires InputChannel#controlchange
 *
 * @fires InputChannel#allnotesoff
 * @fires InputChannel#allsoundoff
 * @fires InputChannel#localcontrol
 * @fires InputChannel#monomode
 * @fires InputChannel#omnimode
 * @fires InputChannel#resetallcontrollers
 *
 * @fires InputChannel#event:nrpn
 * @fires InputChannel#event:nrpn-dataentrycoarse
 * @fires InputChannel#event:nrpn-dataentryfine
 * @fires InputChannel#event:nrpn-databuttonincrement
 * @fires InputChannel#event:nrpn-databuttondecrement
 * @fires InputChannel#event:rpn
 * @fires InputChannel#event:rpn-dataentrycoarse
 * @fires InputChannel#event:rpn-dataentryfine
 * @fires InputChannel#event:rpn-databuttonincrement
 * @fires InputChannel#event:rpn-databuttondecrement
 *
 * @extends EventEmitter
 * @license Apache-2.0
 * @since 3.0.0
 */ class InputChannel extends EventEmitter {
    constructor(e, t){
        super(), this._input = e, this._number = t, this._octaveOffset = 0, this._nrpnBuffer = [], this._rpnBuffer = [], this.parameterNumberEventsEnabled = !0, this.notesState = new Array(128).fill(!1);
    }
    destroy() {
        this._input = null, this._number = null, this._octaveOffset = 0, this._nrpnBuffer = [], this.notesState = new Array(128).fill(!1), this.parameterNumberEventsEnabled = !1, this.removeListener();
    }
    _processMidiMessageEvent(e) {
        const t = Object.assign({}, e);
        t.port = this.input, t.target = this, t.type = "midimessage", this.emit(t.type, t), this._parseEventForStandardMessages(t);
    }
    _parseEventForStandardMessages(e) {
        const t = Object.assign({}, e);
        t.type = t.message.type || "unknownmessage";
        const n = e.message.dataBytes[0], s = e.message.dataBytes[1];
        if ("noteoff" === t.type || "noteon" === t.type && 0 === s) this.notesState[n] = !1, t.type = "noteoff", t.note = new Note(Utilities.offsetNumber(n, this.octaveOffset + this.input.octaveOffset + wm.octaveOffset), {
            rawAttack: 0,
            rawRelease: s
        }), t.value = Utilities.from7bitToFloat(s), t.rawValue = s, t.velocity = t.note.release, t.rawVelocity = t.note.rawRelease;
        else if ("noteon" === t.type) this.notesState[n] = !0, t.note = new Note(Utilities.offsetNumber(n, this.octaveOffset + this.input.octaveOffset + wm.octaveOffset), {
            rawAttack: s
        }), t.value = Utilities.from7bitToFloat(s), t.rawValue = s, t.velocity = t.note.attack, t.rawVelocity = t.note.rawAttack;
        else if ("keyaftertouch" === t.type) t.note = new Note(Utilities.offsetNumber(n, this.octaveOffset + this.input.octaveOffset + wm.octaveOffset)), t.value = Utilities.from7bitToFloat(s), t.rawValue = s, t.identifier = t.note.identifier, t.key = t.note.number, t.rawKey = n;
        else if ("controlchange" === t.type) {
            t.controller = {
                number: n,
                name: Utilities.getCcNameByNumber(n)
            }, t.subtype = t.controller.name || "controller" + n, t.value = Utilities.from7bitToFloat(s), t.rawValue = s;
            const e = Object.assign({}, t);
            e.type = `${t.type}-controller${n}`, delete e.subtype, this.emit(e.type, e), t.message.dataBytes[0] >= 120 && this._parseChannelModeMessage(t), this.parameterNumberEventsEnabled && this._isRpnOrNrpnController(t.message.dataBytes[0]) && this._parseEventForParameterNumber(t);
        } else "programchange" === t.type ? (t.value = n, t.rawValue = t.value) : "channelaftertouch" === t.type ? (t.value = Utilities.from7bitToFloat(n), t.rawValue = n) : "pitchbend" === t.type ? (t.value = ((s << 7) + n - 8192) / 8192, t.rawValue = (s << 7) + n) : t.type = "unknownmessage";
        this.emit(t.type, t);
    }
    _parseChannelModeMessage(e) {
        const t = Object.assign({}, e);
        t.type = t.controller.name, "localcontrol" === t.type && (t.value = 127 === t.message.data[2], t.rawValue = t.message.data[2]), "omnimodeon" === t.type ? (t.type = "omnimode", t.value = !0, t.rawValue = t.message.data[2]) : "omnimodeoff" === t.type && (t.type = "omnimode", t.value = !1, t.rawValue = t.message.data[2]), "monomodeon" === t.type ? (t.type = "monomode", t.value = !0, t.rawValue = t.message.data[2]) : "polymodeon" === t.type && (t.type = "monomode", t.value = !1, t.rawValue = t.message.data[2]), this.emit(t.type, t);
    }
    _parseEventForParameterNumber(e) {
        const t = e.message.dataBytes[0], n = e.message.dataBytes[1], s = Enumerations.MIDI_CONTROL_CHANGE_MESSAGES;
        t === s.nonregisteredparameterfine || t === s.registeredparameterfine ? (this._nrpnBuffer = [], this._rpnBuffer = [], t === s.nonregisteredparameterfine ? this._nrpnBuffer = [
            e.message
        ] : 127 !== n && (this._rpnBuffer = [
            e.message
        ])) : t === s.nonregisteredparametercoarse || t === s.registeredparametercoarse ? t === s.nonregisteredparametercoarse ? (this._rpnBuffer = [], 1 === this._nrpnBuffer.length ? this._nrpnBuffer.push(e.message) : this._nrpnBuffer = []) : (this._nrpnBuffer = [], 1 === this._rpnBuffer.length && 127 !== n ? this._rpnBuffer.push(e.message) : this._rpnBuffer = []) : t !== s.dataentrycoarse && t !== s.dataentryfine && t !== s.databuttonincrement && t !== s.databuttondecrement || (2 === this._rpnBuffer.length ? this._dispatchParameterNumberEvent("rpn", this._rpnBuffer[0].dataBytes[1], this._rpnBuffer[1].dataBytes[1], e) : 2 === this._nrpnBuffer.length ? this._dispatchParameterNumberEvent("nrpn", this._nrpnBuffer[0].dataBytes[1], this._nrpnBuffer[1].dataBytes[1], e) : (this._nrpnBuffer = [], this._rpnBuffer = []));
    }
    _isRpnOrNrpnController(e) {
        return e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.dataentrycoarse || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.dataentryfine || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.databuttonincrement || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.databuttondecrement || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.nonregisteredparametercoarse || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.nonregisteredparameterfine || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.registeredparametercoarse || e === Enumerations.MIDI_CONTROL_CHANGE_MESSAGES.registeredparameterfine;
    }
    _dispatchParameterNumberEvent(e18, t, n, s) {
        e18 = "nrpn" === e18 ? "nrpn" : "rpn";
        const r = {
            target: s.target,
            timestamp: s.timestamp,
            message: s.message,
            parameterMsb: t,
            parameterLsb: n,
            value: Utilities.from7bitToFloat(s.message.dataBytes[1]),
            rawValue: s.message.dataBytes[1]
        };
        r.parameter = "rpn" === e18 ? Object.keys(Enumerations.MIDI_REGISTERED_PARAMETERS).find((e)=>Enumerations.MIDI_REGISTERED_PARAMETERS[e][0] === t && Enumerations.MIDI_REGISTERED_PARAMETERS[e][1] === n) : (t << 7) + n;
        const i = Utilities.getPropertyByValue(Enumerations.MIDI_CONTROL_CHANGE_MESSAGES, s.message.dataBytes[0]);
        r.type = `${e18}-${i}`, this.emit(r.type, r), r.type = e18, r.subtype = i, this.emit(r.type, r);
    }
    getChannelModeByNumber(e) {
        return wm.validation && (console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class."), e = Math.floor(e)), Utilities.getChannelModeByNumber(e);
    }
    getCcNameByNumber(e) {
        if (wm.validation && (console.warn("The 'getCcNameByNumber()' method has been moved to the 'Utilities' class."), !((e = parseInt(e)) >= 0 && e <= 127))) throw new RangeError("Invalid control change number.");
        return Utilities.getCcNameByNumber(e);
    }
    getNoteState(e) {
        e instanceof Note && (e = e.identifier);
        const t = Utilities.guessNoteNumber(e, wm.octaveOffset + this.input.octaveOffset + this.octaveOffset);
        return this.notesState[t];
    }
    get octaveOffset() {
        return this._octaveOffset;
    }
    set octaveOffset(e) {
        if (this.validation && (e = parseInt(e), isNaN(e))) throw new TypeError("The 'octaveOffset' property must be an integer.");
        this._octaveOffset = e;
    }
    get input() {
        return this._input;
    }
    get number() {
        return this._number;
    }
    get nrpnEventsEnabled() {
        return this.parameterNumberEventsEnabled;
    }
    set nrpnEventsEnabled(e) {
        this.validation && (e = !!e), this.parameterNumberEventsEnabled = e;
    }
}
/**
 * The `Message` class represents a single MIDI message. It has several properties that make it
 * easy to make sense of the binary data it contains.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */ class Message {
    constructor(e){
        this.rawData = e, this.data = Array.from(this.rawData), this.statusByte = this.rawData[0], this.rawDataBytes = this.rawData.slice(1), this.dataBytes = this.data.slice(1), this.isChannelMessage = !1, this.isSystemMessage = !1, this.command = void 0, this.channel = void 0, this.manufacturerId = void 0, this.type = void 0, this.statusByte < 240 ? (this.isChannelMessage = !0, this.command = this.statusByte >> 4, this.channel = 1 + (15 & this.statusByte)) : (this.isSystemMessage = !0, this.command = this.statusByte), this.isChannelMessage ? this.type = Utilities.getPropertyByValue(Enumerations.MIDI_CHANNEL_MESSAGES, this.command) : this.isSystemMessage && (this.type = Utilities.getPropertyByValue(Enumerations.MIDI_SYSTEM_MESSAGES, this.command)), this.statusByte === Enumerations.MIDI_SYSTEM_MESSAGES.sysex && (0 === this.dataBytes[0] ? (this.manufacturerId = this.dataBytes.slice(0, 3), this.dataBytes = this.dataBytes.slice(3, this.rawDataBytes.length - 1), this.rawDataBytes = this.rawDataBytes.slice(3, this.rawDataBytes.length - 1)) : (this.manufacturerId = [
            this.dataBytes[0]
        ], this.dataBytes = this.dataBytes.slice(1, this.dataBytes.length - 1), this.rawDataBytes = this.rawDataBytes.slice(1, this.rawDataBytes.length - 1)));
    }
}
/**
 * The `Input` class represents a single MIDI input port. This object is automatically instantiated
 * by the library according to the host's MIDI subsystem and does not need to be directly
 * instantiated. Instead, you can access all `Input` objects by referring to the
 * [`WebMidi.inputs`](WebMidi#inputs) array. You can also retrieve inputs by using methods such as
 * [`WebMidi.getInputByName()`](WebMidi#getInputByName) and
 * [`WebMidi.getInputById()`](WebMidi#getInputById).
 *
 * Note that a single MIDI device may expose several inputs and/or outputs.
 *
 * **Important**: the `Input` class does not directly fire channel-specific MIDI messages
 * (such as [`noteon`](InputChannel#event:noteon) or
 * [`controlchange`](InputChannel#event:controlchange), etc.). The [`InputChannel`](InputChannel)
 * object does that. However, you can still use the
 * [`Input.addListener()`](#addListener) method to listen to channel-specific events on multiple
 * [`InputChannel`](InputChannel) objects at once.
 *
 * @fires Input#opened
 * @fires Input#disconnected
 * @fires Input#closed
 * @fires Input#midimessage
 *
 * @fires Input#sysex
 * @fires Input#timecode
 * @fires Input#songposition
 * @fires Input#songselect
 * @fires Input#tunerequest
 * @fires Input#clock
 * @fires Input#start
 * @fires Input#continue
 * @fires Input#stop
 * @fires Input#activesensing
 * @fires Input#reset
 *
 * @fires Input#unknownmidimessage
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */ class Input extends EventEmitter {
    constructor(e){
        super(), this._midiInput = e, this._octaveOffset = 0, this.channels = [];
        for(let e19 = 1; e19 <= 16; e19++)this.channels[e19] = new InputChannel(this, e19);
        this._forwarders = [], this._midiInput.onstatechange = this._onStateChange.bind(this), this._midiInput.onmidimessage = this._onMidiMessage.bind(this);
    }
    async destroy() {
        this.removeListener(), this.channels.forEach((e)=>e.destroy()), this.channels = [], this._forwarders = [], this._midiInput && (this._midiInput.onstatechange = null, this._midiInput.onmidimessage = null), await this.close(), this._midiInput = null;
    }
    _onStateChange(e) {
        let t = {
            timestamp: wm.time,
            target: this,
            port: this
        };
        "open" === e.port.connection ? (t.type = "opened", this.emit("opened", t)) : "closed" === e.port.connection && "connected" === e.port.state ? (t.type = "closed", this.emit("closed", t)) : "closed" === e.port.connection && "disconnected" === e.port.state ? (t.type = "disconnected", t.port = {
            connection: e.port.connection,
            id: e.port.id,
            manufacturer: e.port.manufacturer,
            name: e.port.name,
            state: e.port.state,
            type: e.port.type
        }, this.emit("disconnected", t)) : "pending" === e.port.connection && "disconnected" === e.port.state || console.warn("This statechange event was not caught: ", e.port.connection, e.port.state);
    }
    _onMidiMessage(e20) {
        const t = new Message(e20.data), n = {
            port: this,
            target: this,
            message: t,
            timestamp: e20.timeStamp,
            type: "midimessage",
            data: t.data,
            rawData: t.data,
            statusByte: t.data[0],
            dataBytes: t.dataBytes
        };
        this.emit("midimessage", n), t.isSystemMessage ? this._parseEvent(n) : t.isChannelMessage && this.channels[t.channel]._processMidiMessageEvent(n), this._forwarders.forEach((e)=>e.forward(t));
    }
    _parseEvent(e) {
        const t = Object.assign({}, e);
        t.type = t.message.type || "unknownmidimessage", "songselect" === t.type && (t.song = e.data[1] + 1, t.value = e.data[1], t.rawValue = t.value), this.emit(t.type, t);
    }
    async open() {
        try {
            await this._midiInput.open();
        } catch (e) {
            return Promise.reject(e);
        }
        return Promise.resolve(this);
    }
    async close() {
        if (!this._midiInput) return Promise.resolve(this);
        try {
            await this._midiInput.close();
        } catch (e) {
            return Promise.reject(e);
        }
        return Promise.resolve(this);
    }
    getChannelModeByNumber() {
        wm.validation && console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class.");
    }
    addListener(e, t, n = {}) {
        if (wm.validation && "function" == typeof n) {
            let e = null != t ? [].concat(t) : void 0;
            t = n, n = {
                channels: e
            };
        }
        if (Enumerations.CHANNEL_EVENTS.includes(e)) {
            void 0 === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS);
            let s = [];
            return Utilities.sanitizeChannels(n.channels).forEach((r)=>{
                s.push(this.channels[r].addListener(e, t, n));
            }), s;
        }
        return super.addListener(e, t, n);
    }
    addOneTimeListener(e, t, n = {}) {
        return n.remaining = 1, this.addListener(e, t, n);
    }
    on(e, t, n, s) {
        return this.addListener(e, t, n, s);
    }
    hasListener(e, t, n10 = {}) {
        if (wm.validation && "function" == typeof n10) {
            let e = [].concat(t);
            t = n10, n10 = {
                channels: e
            };
        }
        return Enumerations.CHANNEL_EVENTS.includes(e) ? (void 0 === n10.channels && (n10.channels = Enumerations.MIDI_CHANNEL_NUMBERS), Utilities.sanitizeChannels(n10.channels).every((n)=>this.channels[n].hasListener(e, t))) : super.hasListener(e, t);
    }
    removeListener(e21, t, n = {}) {
        if (wm.validation && "function" == typeof n) {
            let e = [].concat(t);
            t = n, n = {
                channels: e
            };
        }
        if (void 0 === n.channels && (n.channels = Enumerations.MIDI_CHANNEL_NUMBERS), null == e21) return Utilities.sanitizeChannels(n.channels).forEach((e)=>{
            this.channels[e] && this.channels[e].removeListener();
        }), super.removeListener();
        Enumerations.CHANNEL_EVENTS.includes(e21) ? Utilities.sanitizeChannels(n.channels).forEach((s)=>{
            this.channels[s].removeListener(e21, t, n);
        }) : super.removeListener(e21, t, n);
    }
    addForwarder(e, t = {}) {
        let n;
        return n = e instanceof Forwarder ? e : new Forwarder(e, t), this._forwarders.push(n), n;
    }
    removeForwarder(e) {
        this._forwarders = this._forwarders.filter((t)=>t !== e);
    }
    hasForwarder(e) {
        return this._forwarders.includes(e);
    }
    get name() {
        return this._midiInput.name;
    }
    get id() {
        return this._midiInput.id;
    }
    get connection() {
        return this._midiInput.connection;
    }
    get manufacturer() {
        return this._midiInput.manufacturer;
    }
    get octaveOffset() {
        return this._octaveOffset;
    }
    set octaveOffset(e) {
        if (this.validation && (e = parseInt(e), isNaN(e))) throw new TypeError("The 'octaveOffset' property must be an integer.");
        this._octaveOffset = e;
    }
    get state() {
        return this._midiInput.state;
    }
    get type() {
        return this._midiInput.type;
    }
    get nrpnEventsEnabled() {
        return wm.validation && console.warn("The 'nrpnEventsEnabled' property has been moved to the 'InputChannel' class."), !1;
    }
}
if (Utilities.isNode) {
    try {
        window.navigator;
    } catch (err) {
        let jzz;
        eval('jzz = require("jzz")'), global.navigator = jzz;
    }
    try {
        performance;
    } catch (err1) {
        let performance;
        eval('performance = require("perf_hooks").performance'), global.performance = performance;
    }
}
/**
 * The `WebMidi` object makes it easier to work with the low-level Web MIDI API. Basically, it
 * simplifies sending outgoing MIDI messages and reacting to incoming MIDI messages.
 *
 * When using the WebMidi.js library, you should know that the `WebMidi` class has already been
 * instantiated. You cannot instantiate it yourself. If you use the **IIFE** version, you should
 * simply use the global object called `WebMidi`. If you use the **CJS** (CommonJS) or **ESM** (ES6
 * module) version, you get an already-instantiated object when you import the module.
 *
 * @fires WebMidi#connected
 * @fires WebMidi#disabled
 * @fires WebMidi#disconnected
 * @fires WebMidi#enabled
 * @fires WebMidi#error
 * @fires WebMidi#midiaccessgranted
 * @fires WebMidi#portschanged
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */ class WebMidi extends EventEmitter {
    constructor(){
        super(), this.defaults = {
            note: {
                attack: Utilities.from7bitToFloat(64),
                release: Utilities.from7bitToFloat(64),
                duration: 1 / 0
            }
        }, this.interface = null, this.validation = !0, this._inputs = [], this._disconnectedInputs = [], this._outputs = [], this._disconnectedOutputs = [], this._stateChangeQueue = [], this._octaveOffset = 0;
    }
    async enable(e = {}, t = !1) {
        if (this.validation = !1 !== e.validation, this.validation && ("function" == typeof e && (e = {
            callback: e,
            sysex: t
        }), t && (e.sysex = !0)), this.enabled) return "function" == typeof e.callback && e.callback(), Promise.resolve();
        const n = {
            timestamp: this.time,
            target: this,
            type: "error",
            error: void 0
        }, s = {
            timestamp: this.time,
            target: this,
            type: "midiaccessgranted"
        }, r = {
            timestamp: this.time,
            target: this,
            type: "enabled"
        };
        try {
            "function" == typeof e.requestMIDIAccessFunction ? this.interface = await e.requestMIDIAccessFunction({
                sysex: e.sysex,
                software: e.software
            }) : this.interface = await navigator.requestMIDIAccess({
                sysex: e.sysex,
                software: e.software
            });
        } catch (t3) {
            return n.error = t3, this.emit("error", n), "function" == typeof e.callback && e.callback(t3), Promise.reject(t3);
        }
        this.emit("midiaccessgranted", s), this.interface.onstatechange = this._onInterfaceStateChange.bind(this);
        try {
            await this._updateInputsAndOutputs();
        } catch (t4) {
            return n.error = t4, this.emit("error", n), "function" == typeof e.callback && e.callback(t4), Promise.reject(t4);
        }
        return this.emit("enabled", r), "function" == typeof e.callback && e.callback(), Promise.resolve(this);
    }
    async disable() {
        return this._destroyInputsAndOutputs().then(()=>{
            navigator && "function" == typeof navigator.close && navigator.close(), this.interface && (this.interface.onstatechange = void 0), this.interface = null;
            let e = {
                timestamp: this.time,
                target: this,
                type: "disabled"
            };
            this.emit("disabled", e), this.removeListener();
        });
    }
    getInputById(e, t = {
        disconnected: !1
    }) {
        if (this.validation) {
            if (!this.enabled) throw new Error("WebMidi is not enabled.");
            if (!e) return;
        }
        if (t.disconnected) {
            for(let t = 0; t < this._disconnectedInputs.length; t++)if (this._disconnectedInputs[t].id === e.toString()) return this._disconnectedInputs[t];
        } else for(let t5 = 0; t5 < this.inputs.length; t5++)if (this.inputs[t5].id === e.toString()) return this.inputs[t5];
    }
    getInputByName(e, t = {
        disconnected: !1
    }) {
        if (this.validation) {
            if (!this.enabled) throw new Error("WebMidi is not enabled.");
            if (!e) return;
            e = e.toString();
        }
        if (t.disconnected) {
            for(let t = 0; t < this._disconnectedInputs.length; t++)if (~this._disconnectedInputs[t].name.indexOf(e)) return this._disconnectedInputs[t];
        } else for(let t6 = 0; t6 < this.inputs.length; t6++)if (~this.inputs[t6].name.indexOf(e)) return this.inputs[t6];
    }
    getOutputByName(e, t = {
        disconnected: !1
    }) {
        if (this.validation) {
            if (!this.enabled) throw new Error("WebMidi is not enabled.");
            if (!e) return;
            e = e.toString();
        }
        if (t.disconnected) {
            for(let t = 0; t < this._disconnectedOutputs.length; t++)if (~this._disconnectedOutputs[t].name.indexOf(e)) return this._disconnectedOutputs[t];
        } else for(let t7 = 0; t7 < this.outputs.length; t7++)if (~this.outputs[t7].name.indexOf(e)) return this.outputs[t7];
    }
    getOutputById(e, t = {
        disconnected: !1
    }) {
        if (this.validation) {
            if (!this.enabled) throw new Error("WebMidi is not enabled.");
            if (!e) return;
        }
        if (t.disconnected) {
            for(let t = 0; t < this._disconnectedOutputs.length; t++)if (this._disconnectedOutputs[t].id === e.toString()) return this._disconnectedOutputs[t];
        } else for(let t8 = 0; t8 < this.outputs.length; t8++)if (this.outputs[t8].id === e.toString()) return this.outputs[t8];
    }
    noteNameToNumber(e) {
        return this.validation && console.warn("The noteNameToNumber() method is deprecated. Use Utilities.toNoteNumber() instead."), Utilities.toNoteNumber(e, this.octaveOffset);
    }
    getOctave(e) {
        return this.validation && (console.warn("The getOctave()is deprecated. Use Utilities.getNoteDetails() instead"), e = parseInt(e)), !isNaN(e) && e >= 0 && e <= 127 && Utilities.getNoteDetails(Utilities.offsetNumber(e, this.octaveOffset)).octave;
    }
    sanitizeChannels(e) {
        return this.validation && console.warn("The sanitizeChannels() method has been moved to the utilities class."), Utilities.sanitizeChannels(e);
    }
    toMIDIChannels(e) {
        return this.validation && console.warn("The toMIDIChannels() method has been deprecated. Use Utilities.sanitizeChannels() instead."), Utilities.sanitizeChannels(e);
    }
    guessNoteNumber(e) {
        return this.validation && console.warn("The guessNoteNumber() method has been deprecated. Use Utilities.guessNoteNumber() instead."), Utilities.guessNoteNumber(e, this.octaveOffset);
    }
    getValidNoteArray(e, t = {}) {
        return this.validation && console.warn("The getValidNoteArray() method has been moved to the Utilities.buildNoteArray()"), Utilities.buildNoteArray(e, t);
    }
    convertToTimestamp(e) {
        return this.validation && console.warn("The convertToTimestamp() method has been moved to Utilities.toTimestamp()."), Utilities.toTimestamp(e);
    }
    async _destroyInputsAndOutputs() {
        let e = [];
        return this.inputs.forEach((t)=>e.push(t.destroy())), this.outputs.forEach((t)=>e.push(t.destroy())), Promise.all(e).then(()=>{
            this._inputs = [], this._outputs = [];
        });
    }
    _onInterfaceStateChange(e) {
        this._updateInputsAndOutputs();
        let t = {
            timestamp: e.timeStamp,
            type: e.port.state,
            target: this
        };
        if ("connected" === e.port.state && "open" === e.port.connection) {
            "output" === e.port.type ? t.port = this.getOutputById(e.port.id) : "input" === e.port.type && (t.port = this.getInputById(e.port.id)), this.emit(e.port.state, t);
            const n = Object.assign({}, t);
            n.type = "portschanged", this.emit(n.type, n);
        } else if ("disconnected" === e.port.state && "pending" === e.port.connection) {
            "input" === e.port.type ? t.port = this.getInputById(e.port.id, {
                disconnected: !0
            }) : "output" === e.port.type && (t.port = this.getOutputById(e.port.id, {
                disconnected: !0
            })), this.emit(e.port.state, t);
            const n = Object.assign({}, t);
            n.type = "portschanged", this.emit(n.type, n);
        }
    }
    async _updateInputsAndOutputs() {
        return Promise.all([
            this._updateInputs(),
            this._updateOutputs()
        ]);
    }
    async _updateInputs() {
        if (!this.interface) return;
        for(let e23 = this._inputs.length - 1; e23 >= 0; e23--){
            const t = this._inputs[e23];
            Array.from(this.interface.inputs.values()).find((e)=>e === t._midiInput) || (this._disconnectedInputs.push(t), this._inputs.splice(e23, 1));
        }
        let e22 = [];
        return this.interface.inputs.forEach((t)=>{
            if (!this._inputs.find((e)=>e._midiInput === t)) {
                let n = this._disconnectedInputs.find((e)=>e._midiInput === t);
                n || (n = new Input(t)), this._inputs.push(n), e22.push(n.open());
            }
        }), Promise.all(e22);
    }
    async _updateOutputs() {
        if (!this.interface) return;
        for(let e25 = this._outputs.length - 1; e25 >= 0; e25--){
            const t = this._outputs[e25];
            Array.from(this.interface.outputs.values()).find((e)=>e === t._midiOutput) || (this._disconnectedOutputs.push(t), this._outputs.splice(e25, 1));
        }
        let e24 = [];
        return this.interface.outputs.forEach((t)=>{
            if (!this._outputs.find((e)=>e._midiOutput === t)) {
                let n = this._disconnectedOutputs.find((e)=>e._midiOutput === t);
                n || (n = new Output(t)), this._outputs.push(n), e24.push(n.open());
            }
        }), Promise.all(e24);
    }
    get enabled() {
        return null !== this.interface;
    }
    get inputs() {
        return this._inputs;
    }
    get isNode() {
        return this.validation && console.warn("WebMidi.isNode has been deprecated. Use Utilities.isNode instead."), Utilities.isNode;
    }
    get isBrowser() {
        return this.validation && console.warn("WebMidi.isBrowser has been deprecated. Use Utilities.isBrowser instead."), Utilities.isBrowser;
    }
    get octaveOffset() {
        return this._octaveOffset;
    }
    set octaveOffset(e) {
        if (this.validation && (e = parseInt(e), isNaN(e))) throw new TypeError("The 'octaveOffset' property must be an integer.");
        this._octaveOffset = e;
    }
    get outputs() {
        return this._outputs;
    }
    get supported() {
        return "undefined" != typeof navigator && navigator.requestMIDIAccess;
    }
    get sysexEnabled() {
        return !(!this.interface || !this.interface.sysexEnabled);
    }
    get time() {
        return performance.now();
    }
    get version() {
        return "3.0.21";
    }
    get CHANNEL_EVENTS() {
        return this.validation && console.warn("The CHANNEL_EVENTS enum has been moved to Enumerations.CHANNEL_EVENTS."), Enumerations.CHANNEL_EVENTS;
    }
    get MIDI_SYSTEM_MESSAGES() {
        return this.validation && console.warn("The MIDI_SYSTEM_MESSAGES enum has been moved to Enumerations.MIDI_SYSTEM_MESSAGES."), Enumerations.MIDI_SYSTEM_MESSAGES;
    }
    get MIDI_CHANNEL_MODE_MESSAGES() {
        return this.validation && console.warn("The MIDI_CHANNEL_MODE_MESSAGES enum has been moved to Enumerations.MIDI_CHANNEL_MODE_MESSAGES."), Enumerations.MIDI_CHANNEL_MODE_MESSAGES;
    }
    get MIDI_CONTROL_CHANGE_MESSAGES() {
        return this.validation && console.warn("The MIDI_CONTROL_CHANGE_MESSAGES enum has been moved to Enumerations.MIDI_CONTROL_CHANGE_MESSAGES."), Enumerations.MIDI_CONTROL_CHANGE_MESSAGES;
    }
    get MIDI_REGISTERED_PARAMETER() {
        return this.validation && console.warn("The MIDI_REGISTERED_PARAMETER enum has been moved to Enumerations.MIDI_REGISTERED_PARAMETERS."), this.MIDI_REGISTERED_PARAMETERS;
    }
    get NOTES() {
        return this.validation && console.warn("The NOTES enum has been deprecated."), [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B"
        ];
    }
}
const wm = new WebMidi;
wm.constructor = null, exports.Enumerations = Enumerations, exports.Forwarder = Forwarder, exports.Input = Input, exports.InputChannel = InputChannel, exports.Message = Message, exports.Note = Note, exports.Output = Output, exports.OutputChannel = OutputChannel, exports.Utilities = Utilities, exports.WebMidi = wm;

},{"process":"d5jf4"}],"d5jf4":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
(function() {
    try {
        if (typeof setTimeout === "function") cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === "function") cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e1) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = ""; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error("process.binding is not supported");
};
process.cwd = function() {
    return "/";
};
process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
};
process.umask = function() {
    return 0;
};

},{}],"kFspz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Attract Mode! 
 * This demos the app and allows for a player to totally immerse
 * themselves in play without having to concern with actually
 * interacting
 * getPerson,getPlayers
	fetchPlayerOptions,setPlayerOption, setPlayerOptions,
	language, 
	...ui, 
	...information,
	setBPM, setMasterVolume,
	loadInstruments, 
	loadRandomInstrument, previousInstrument, nextInstrument,
	toggleRecording
 */ // in seconds
const DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE = 180;
class Attractor {
    barCounter = 0;
    constructor(application){
        this.application = application;
    }
    /**
	 * Tick this along!
	 */ tick(elapsed, barProgress = 0) {
        const players = this.application.getPlayers();
        const userActive = this.application.isUserActive();
        if (!userActive) // inactive - ATTRACT MODE
        {
            if (barProgress === 0) {
                this.barCounter++;
                players.forEach((player)=>{
                    if (player.timeSinceInstrumentChanged > DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE) //console.log("Has player been stuck on this instrument too long?", player.timeSinceInstrumentChanged, DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE)
                    player.loadRandomInstrument();
                });
            // occassionally turn on a feature or two...
            //this.application.setBPM( Math.random() * 100 + 60 )
            //console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
            }
        } else // active - just change instruments every now and then
        if (barProgress === 0) {
            //this.application.setState( 'backingTrack', true )
            this.barCounter++;
            players.forEach((player)=>{
                if (player.timeSinceInstrumentChanged > DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE) player.loadRandomInstrument();
            });
        }
    // FIXME: 
    //console.log(this.barCounter, "AUTOMATON:", elapsed.toFixed(2) + "seconds", barProgress,  {players, userActive, photoSYNTH: this.application,} )
    }
    // every frame....
    tock(elapsed, barProgress) {
    // FIXME: 
    // console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
    }
}
exports.default = Attractor;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ax5Is":[function(require,module,exports) {
module.exports = require("./helpers/browser/js-loader")(require("./helpers/bundle-url").getBundleURL("h1ZFd") + "interface.6185bf9f.js" + "?" + Date.now()).catch((err)=>{
    delete module.bundle.cache[module.id];
    throw err;
}).then(()=>module.bundle.root("eYDPu"));

},{"./helpers/browser/js-loader":"61B45","./helpers/bundle-url":"lgJ39"}]},["7Qo3L","b6SeL"], "b6SeL", "parcelRequireaaed")

//# sourceMappingURL=index.2675afee.js.map
