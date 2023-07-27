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
})({"2z8Du":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "76a2321a35437246";
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

},{}],"44DAj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Three JS Based with Web VR renderer
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */ parcelHelpers.export(exports, "DisplayWebGL3D", ()=>DisplayWebGL3D);
var _displayAbstract = require("./display-abstract");
var _tasksVision = require("@mediapipe/tasks-vision");
var _threeJs = require("three/src/Three.js");
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
var _orbitControls = require("three/examples/jsm/controls/OrbitControls");
var _particlePng = require("../assets/particles/particle.png");
var _particlePngDefault = parcelHelpers.interopDefault(_particlePng);
const loader = new _threeJs.TextureLoader();
const wavespeed = 1;
const zIndex = 1200;
class DisplayWebGL3D extends (0, _displayAbstract.AbstractDisplay) {
    camera;
    scene;
    renderer;
    particles;
    get depth() {
        return 100;
    }
    constructor(canvas, initialWidth, initialHeight, keypointQuantity = 478){
        super(canvas, initialWidth, initialHeight);
        this.create(keypointQuantity);
    }
    async create(keypointQuantity) {
        const scene = new _threeJs.Scene();
        const cube = new _threeJs.Mesh(new _threeJs.BoxGeometry(2, 0.1, 0.1), new _threeJs.MeshStandardMaterial({
            color: "red"
        }));
        scene.add(cube);
        scene.add(new _threeJs.AmbientLight(0xcccccc, 0.4));
        const directionalLight = new _threeJs.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(3, 3, 3);
        scene.add(directionalLight);
        const renderer = new _threeJs.WebGLRenderer({
            antialias: true,
            canvas: this.canvas,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        // we can swap this for the orthogonal camera
        // for extra style points
        const camera = new _threeJs.PerspectiveCamera();
        camera.position.z = zIndex;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        // this.controls = new OrbitControls( camera, renderer.domElement )
        this.particles = await this.createParticles(keypointQuantity);
        // console.error("F:particles",this.particles, this ) 
        // renderer.setAnimationLoop(() => {
        // 	cube.rotation.z += 0.01
        // 	cube.rotation.x += 0.02
        // 	renderer.render(scene, camera)
        // })
        // function resize() {
        // 	renderer.setSize(innerWidth, innerHeight)
        // 	camera.aspect = innerWidth / innerHeight
        // 	camera.updateProjectionMatrix()
        // }
        // resize()
        // window.addEventListener("resize", resize)
        this.available = true;
    }
    /**
	 * 
	 */ render() {
        // this.controls.update()
        // move camera in accordance to mouse
        this.renderer.render(this.scene, this.camera);
    //console.log("updating three scene",  this.scene, this.camera, this)
    }
    /**
	 * Create Particles
	 * @param {Number} quantity 
	 */ async createParticles(quantity = 478) {
        return new Promise((resolve, reject)=>{
            loader.load((0, _particlePngDefault.default), (tex)=>{
                const materialOptions = {
                    map: tex,
                    transparent: true,
                    opacity: 1,
                    color: 0xefefef88
                };
                const spriteMaterial = new _threeJs.SpriteMaterial(materialOptions);
                const particles = [];
                let x = 0;
                let y = 0;
                const root = Math.floor(Math.sqrt(quantity));
                for(let i = 0; i < quantity; ++i){
                    const mesh = new _threeJs.Sprite(spriteMaterial);
                    const xPercent = x / root;
                    const zPercent = y / root;
                    mesh.scale.set(10, 10, 10) // scale
                    ;
                    mesh.position.x = xPercent * this.width // POSITION X
                    ;
                    mesh.position.y = 0;
                    mesh.position.z = zPercent * this.height //POSITION Y
                    ;
                    particles[i] = mesh;
                    this.scene.add(mesh);
                    if (i % root === 0) {
                        y++;
                        x = 0;
                    } else x++;
                }
                return resolve(particles);
            }, (error)=>{
                console.error("Couldn't load particle");
                return reject("Couldn't load particle");
            });
        });
    }
    /**
	 * Empty the scene and paint it transparent
	 */ clear() {
    // this.scene.clear()
    }
    /**
	 * Paints an existing element onto our display
	 * Used to paint a video frame to the canvas
	 * @param {HTMLElement} element - video / image
	 * @param {Number} x - default to 0
	 * @param {Number} y - default to 0
	 * @param {Boolean} flip - default to true
	 */ drawElement(element, x = 0, y = 0, flip = true) {}
    /**
	 * 
	 * @param {Person} person 
	 */ drawPerson(person, beatJustPlayed, colours) {
        if (this.available === false) return;
        const prediction = person.data;
        const landmarks = prediction.faceLandmarks;
        const options = person.options;
        const hue = person.hue;
        const elapsed = person.now;
        // use the matrix to alter something?
        if (prediction.facialTransformationMatrixes) {
            const matrix = prediction.facialTransformationMatrixes;
            const m = new _threeJs.Matrix4();
            m.set(...matrix.data);
        // console.log("matrix", m, m.invert() )
        }
        if (person.isMouthOpen) {
            landmarks.forEach((landmark, index)=>{
                // reposition to landmark location
                const particle = this.particles[index];
                particle.material.color.set(person.hsl);
                particle.position.x = (1 - landmark.x - 0.5) * this.width;
                particle.position.y = (landmark.y - 0.5) * -this.height;
                particle.position.z = landmark.z * this.depth;
            });
            console.log("particle", person.hsl, landmarks[0], landmarks[0].material);
        } else this.particles.forEach((particle, index)=>{
            // particle.position.x = landmark.x 
            // particle.position.y = landmark.y 
            // particle.position.z = landmark.z // * this.depth
            particle.position.y = Math.cos((elapsed + particle.position.x / this.width + particle.position.z / this.width) * wavespeed) * this.depth;
        });
        /*
		
					*/ // console.log("particles", this.particles)
        return;
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

},{"./display-abstract":"fgqcQ","@mediapipe/tasks-vision":"e5Mjq","three/src/Three.js":"aH4hF","three/examples/jsm/controls/OrbitControls":"7mqRv","../assets/particles/particle.png":"azsGO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fgqcQ":[function(require,module,exports) {
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7mqRv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "OrbitControls", ()=>OrbitControls);
var _three = require("three");
// OrbitControls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move
const _changeEvent = {
    type: "change"
};
const _startEvent = {
    type: "start"
};
const _endEvent = {
    type: "end"
};
class OrbitControls extends (0, _three.EventDispatcher) {
    constructor(object, domElement){
        super();
        this.object = object;
        this.domElement = domElement;
        this.domElement.style.touchAction = "none"; // disable touch scroll
        // Set to false to disable this control
        this.enabled = true;
        // "target" sets the location of focus, where the object orbits around
        this.target = new (0, _three.Vector3)();
        // How far you can dolly in and out ( PerspectiveCamera only )
        this.minDistance = 0;
        this.maxDistance = Infinity;
        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0;
        this.maxZoom = Infinity;
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians
        // How far you can orbit horizontally, upper and lower limits.
        // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians
        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.05;
        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 1.0;
        // Set to false to disable panning
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
        this.keyPanSpeed = 7.0; // pixels moved per arrow key push
        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60
        // The four arrow keys
        this.keys = {
            LEFT: "ArrowLeft",
            UP: "ArrowUp",
            RIGHT: "ArrowRight",
            BOTTOM: "ArrowDown"
        };
        // Mouse buttons
        this.mouseButtons = {
            LEFT: (0, _three.MOUSE).ROTATE,
            MIDDLE: (0, _three.MOUSE).DOLLY,
            RIGHT: (0, _three.MOUSE).PAN
        };
        // Touch fingers
        this.touches = {
            ONE: (0, _three.TOUCH).ROTATE,
            TWO: (0, _three.TOUCH).DOLLY_PAN
        };
        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;
        // the target DOM element for key events
        this._domElementKeyEvents = null;
        //
        // public methods
        //
        this.getPolarAngle = function() {
            return spherical.phi;
        };
        this.getAzimuthalAngle = function() {
            return spherical.theta;
        };
        this.getDistance = function() {
            return this.object.position.distanceTo(this.target);
        };
        this.listenToKeyEvents = function(domElement) {
            domElement.addEventListener("keydown", onKeyDown);
            this._domElementKeyEvents = domElement;
        };
        this.stopListenToKeyEvents = function() {
            this._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
            this._domElementKeyEvents = null;
        };
        this.saveState = function() {
            scope.target0.copy(scope.target);
            scope.position0.copy(scope.object.position);
            scope.zoom0 = scope.object.zoom;
        };
        this.reset = function() {
            scope.target.copy(scope.target0);
            scope.object.position.copy(scope.position0);
            scope.object.zoom = scope.zoom0;
            scope.object.updateProjectionMatrix();
            scope.dispatchEvent(_changeEvent);
            scope.update();
            state = STATE.NONE;
        };
        // this method is exposed, but perhaps it would be better if we can make it private...
        this.update = function() {
            const offset = new (0, _three.Vector3)();
            // so camera.up is the orbit axis
            const quat = new (0, _three.Quaternion)().setFromUnitVectors(object.up, new (0, _three.Vector3)(0, 1, 0));
            const quatInverse = quat.clone().invert();
            const lastPosition = new (0, _three.Vector3)();
            const lastQuaternion = new (0, _three.Quaternion)();
            const lastTargetPosition = new (0, _three.Vector3)();
            const twoPI = 2 * Math.PI;
            return function update() {
                const position = scope.object.position;
                offset.copy(position).sub(scope.target);
                // rotate offset to "y-axis-is-up" space
                offset.applyQuaternion(quat);
                // angle from z-axis around y-axis
                spherical.setFromVector3(offset);
                if (scope.autoRotate && state === STATE.NONE) rotateLeft(getAutoRotationAngle());
                if (scope.enableDamping) {
                    spherical.theta += sphericalDelta.theta * scope.dampingFactor;
                    spherical.phi += sphericalDelta.phi * scope.dampingFactor;
                } else {
                    spherical.theta += sphericalDelta.theta;
                    spherical.phi += sphericalDelta.phi;
                }
                // restrict theta to be between desired limits
                let min = scope.minAzimuthAngle;
                let max = scope.maxAzimuthAngle;
                if (isFinite(min) && isFinite(max)) {
                    if (min < -Math.PI) min += twoPI;
                    else if (min > Math.PI) min -= twoPI;
                    if (max < -Math.PI) max += twoPI;
                    else if (max > Math.PI) max -= twoPI;
                    if (min <= max) spherical.theta = Math.max(min, Math.min(max, spherical.theta));
                    else spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
                }
                // restrict phi to be between desired limits
                spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
                spherical.makeSafe();
                spherical.radius *= scale;
                // restrict radius to be between desired limits
                spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
                // move target to panned location
                if (scope.enableDamping === true) scope.target.addScaledVector(panOffset, scope.dampingFactor);
                else scope.target.add(panOffset);
                offset.setFromSpherical(spherical);
                // rotate offset back to "camera-up-vector-is-up" space
                offset.applyQuaternion(quatInverse);
                position.copy(scope.target).add(offset);
                scope.object.lookAt(scope.target);
                if (scope.enableDamping === true) {
                    sphericalDelta.theta *= 1 - scope.dampingFactor;
                    sphericalDelta.phi *= 1 - scope.dampingFactor;
                    panOffset.multiplyScalar(1 - scope.dampingFactor);
                } else {
                    sphericalDelta.set(0, 0, 0);
                    panOffset.set(0, 0, 0);
                }
                scale = 1;
                // update condition is:
                // min(camera displacement, camera rotation in radians)^2 > EPS
                // using small-angle approximation cos(x/2) = 1 - x^2 / 8
                if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS || lastTargetPosition.distanceToSquared(scope.target) > 0) {
                    scope.dispatchEvent(_changeEvent);
                    lastPosition.copy(scope.object.position);
                    lastQuaternion.copy(scope.object.quaternion);
                    lastTargetPosition.copy(scope.target);
                    zoomChanged = false;
                    return true;
                }
                return false;
            };
        }();
        this.dispose = function() {
            scope.domElement.removeEventListener("contextmenu", onContextMenu);
            scope.domElement.removeEventListener("pointerdown", onPointerDown);
            scope.domElement.removeEventListener("pointercancel", onPointerUp);
            scope.domElement.removeEventListener("wheel", onMouseWheel);
            scope.domElement.removeEventListener("pointermove", onPointerMove);
            scope.domElement.removeEventListener("pointerup", onPointerUp);
            if (scope._domElementKeyEvents !== null) {
                scope._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
                scope._domElementKeyEvents = null;
            }
        //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
        };
        //
        // internals
        //
        const scope = this;
        const STATE = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_PAN: 4,
            TOUCH_DOLLY_PAN: 5,
            TOUCH_DOLLY_ROTATE: 6
        };
        let state = STATE.NONE;
        const EPS = 0.000001;
        // current position in spherical coordinates
        const spherical = new (0, _three.Spherical)();
        const sphericalDelta = new (0, _three.Spherical)();
        let scale = 1;
        const panOffset = new (0, _three.Vector3)();
        let zoomChanged = false;
        const rotateStart = new (0, _three.Vector2)();
        const rotateEnd = new (0, _three.Vector2)();
        const rotateDelta = new (0, _three.Vector2)();
        const panStart = new (0, _three.Vector2)();
        const panEnd = new (0, _three.Vector2)();
        const panDelta = new (0, _three.Vector2)();
        const dollyStart = new (0, _three.Vector2)();
        const dollyEnd = new (0, _three.Vector2)();
        const dollyDelta = new (0, _three.Vector2)();
        const pointers = [];
        const pointerPositions = {};
        function getAutoRotationAngle() {
            return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
        }
        function getZoomScale() {
            return Math.pow(0.95, scope.zoomSpeed);
        }
        function rotateLeft(angle) {
            sphericalDelta.theta -= angle;
        }
        function rotateUp(angle) {
            sphericalDelta.phi -= angle;
        }
        const panLeft = function() {
            const v = new (0, _three.Vector3)();
            return function panLeft(distance, objectMatrix) {
                v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
                v.multiplyScalar(-distance);
                panOffset.add(v);
            };
        }();
        const panUp = function() {
            const v = new (0, _three.Vector3)();
            return function panUp(distance, objectMatrix) {
                if (scope.screenSpacePanning === true) v.setFromMatrixColumn(objectMatrix, 1);
                else {
                    v.setFromMatrixColumn(objectMatrix, 0);
                    v.crossVectors(scope.object.up, v);
                }
                v.multiplyScalar(distance);
                panOffset.add(v);
            };
        }();
        // deltaX and deltaY are in pixels; right and down are positive
        const pan = function() {
            const offset = new (0, _three.Vector3)();
            return function pan(deltaX, deltaY) {
                const element = scope.domElement;
                if (scope.object.isPerspectiveCamera) {
                    // perspective
                    const position = scope.object.position;
                    offset.copy(position).sub(scope.target);
                    let targetDistance = offset.length();
                    // half of the fov is center to top of screen
                    targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);
                    // we use only clientHeight here so aspect ratio does not distort speed
                    panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                    panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
                } else if (scope.object.isOrthographicCamera) {
                    // orthographic
                    panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                    panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
                } else {
                    // camera neither orthographic nor perspective
                    console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
                    scope.enablePan = false;
                }
            };
        }();
        function dollyOut(dollyScale) {
            if (scope.object.isPerspectiveCamera) scale /= dollyScale;
            else if (scope.object.isOrthographicCamera) {
                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;
            } else {
                console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                scope.enableZoom = false;
            }
        }
        function dollyIn(dollyScale) {
            if (scope.object.isPerspectiveCamera) scale *= dollyScale;
            else if (scope.object.isOrthographicCamera) {
                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;
            } else {
                console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                scope.enableZoom = false;
            }
        }
        //
        // event callbacks - update the object state
        //
        function handleMouseDownRotate(event) {
            rotateStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownDolly(event) {
            dollyStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownPan(event) {
            panStart.set(event.clientX, event.clientY);
        }
        function handleMouseMoveRotate(event) {
            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            const element = scope.domElement;
            rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
            rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
            rotateStart.copy(rotateEnd);
            scope.update();
        }
        function handleMouseMoveDolly(event) {
            dollyEnd.set(event.clientX, event.clientY);
            dollyDelta.subVectors(dollyEnd, dollyStart);
            if (dollyDelta.y > 0) dollyOut(getZoomScale());
            else if (dollyDelta.y < 0) dollyIn(getZoomScale());
            dollyStart.copy(dollyEnd);
            scope.update();
        }
        function handleMouseMovePan(event) {
            panEnd.set(event.clientX, event.clientY);
            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
            pan(panDelta.x, panDelta.y);
            panStart.copy(panEnd);
            scope.update();
        }
        function handleMouseWheel(event) {
            if (event.deltaY < 0) dollyIn(getZoomScale());
            else if (event.deltaY > 0) dollyOut(getZoomScale());
            scope.update();
        }
        function handleKeyDown(event) {
            let needsUpdate = false;
            switch(event.code){
                case scope.keys.UP:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateUp(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(0, scope.keyPanSpeed);
                    needsUpdate = true;
                    break;
                case scope.keys.BOTTOM:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateUp(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(0, -scope.keyPanSpeed);
                    needsUpdate = true;
                    break;
                case scope.keys.LEFT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateLeft(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(scope.keyPanSpeed, 0);
                    needsUpdate = true;
                    break;
                case scope.keys.RIGHT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateLeft(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(-scope.keyPanSpeed, 0);
                    needsUpdate = true;
                    break;
            }
            if (needsUpdate) {
                // prevent the browser from scrolling on cursor keys
                event.preventDefault();
                scope.update();
            }
        }
        function handleTouchStartRotate() {
            if (pointers.length === 1) rotateStart.set(pointers[0].pageX, pointers[0].pageY);
            else {
                const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
                const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
                rotateStart.set(x, y);
            }
        }
        function handleTouchStartPan() {
            if (pointers.length === 1) panStart.set(pointers[0].pageX, pointers[0].pageY);
            else {
                const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
                const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
                panStart.set(x, y);
            }
        }
        function handleTouchStartDolly() {
            const dx = pointers[0].pageX - pointers[1].pageX;
            const dy = pointers[0].pageY - pointers[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            dollyStart.set(0, distance);
        }
        function handleTouchStartDollyPan() {
            if (scope.enableZoom) handleTouchStartDolly();
            if (scope.enablePan) handleTouchStartPan();
        }
        function handleTouchStartDollyRotate() {
            if (scope.enableZoom) handleTouchStartDolly();
            if (scope.enableRotate) handleTouchStartRotate();
        }
        function handleTouchMoveRotate(event) {
            if (pointers.length == 1) rotateEnd.set(event.pageX, event.pageY);
            else {
                const position = getSecondPointerPosition(event);
                const x = 0.5 * (event.pageX + position.x);
                const y = 0.5 * (event.pageY + position.y);
                rotateEnd.set(x, y);
            }
            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            const element = scope.domElement;
            rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
            rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
            rotateStart.copy(rotateEnd);
        }
        function handleTouchMovePan(event) {
            if (pointers.length === 1) panEnd.set(event.pageX, event.pageY);
            else {
                const position = getSecondPointerPosition(event);
                const x = 0.5 * (event.pageX + position.x);
                const y = 0.5 * (event.pageY + position.y);
                panEnd.set(x, y);
            }
            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
            pan(panDelta.x, panDelta.y);
            panStart.copy(panEnd);
        }
        function handleTouchMoveDolly(event) {
            const position = getSecondPointerPosition(event);
            const dx = event.pageX - position.x;
            const dy = event.pageY - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            dollyEnd.set(0, distance);
            dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
            dollyOut(dollyDelta.y);
            dollyStart.copy(dollyEnd);
        }
        function handleTouchMoveDollyPan(event) {
            if (scope.enableZoom) handleTouchMoveDolly(event);
            if (scope.enablePan) handleTouchMovePan(event);
        }
        function handleTouchMoveDollyRotate(event) {
            if (scope.enableZoom) handleTouchMoveDolly(event);
            if (scope.enableRotate) handleTouchMoveRotate(event);
        }
        //
        // event handlers - FSM: listen for events and reset state
        //
        function onPointerDown(event) {
            if (scope.enabled === false) return;
            if (pointers.length === 0) {
                scope.domElement.setPointerCapture(event.pointerId);
                scope.domElement.addEventListener("pointermove", onPointerMove);
                scope.domElement.addEventListener("pointerup", onPointerUp);
            }
            //
            addPointer(event);
            if (event.pointerType === "touch") onTouchStart(event);
            else onMouseDown(event);
        }
        function onPointerMove(event) {
            if (scope.enabled === false) return;
            if (event.pointerType === "touch") onTouchMove(event);
            else onMouseMove(event);
        }
        function onPointerUp(event) {
            removePointer(event);
            if (pointers.length === 0) {
                scope.domElement.releasePointerCapture(event.pointerId);
                scope.domElement.removeEventListener("pointermove", onPointerMove);
                scope.domElement.removeEventListener("pointerup", onPointerUp);
            }
            scope.dispatchEvent(_endEvent);
            state = STATE.NONE;
        }
        function onMouseDown(event) {
            let mouseAction;
            switch(event.button){
                case 0:
                    mouseAction = scope.mouseButtons.LEFT;
                    break;
                case 1:
                    mouseAction = scope.mouseButtons.MIDDLE;
                    break;
                case 2:
                    mouseAction = scope.mouseButtons.RIGHT;
                    break;
                default:
                    mouseAction = -1;
            }
            switch(mouseAction){
                case (0, _three.MOUSE).DOLLY:
                    if (scope.enableZoom === false) return;
                    handleMouseDownDolly(event);
                    state = STATE.DOLLY;
                    break;
                case (0, _three.MOUSE).ROTATE:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        if (scope.enablePan === false) return;
                        handleMouseDownPan(event);
                        state = STATE.PAN;
                    } else {
                        if (scope.enableRotate === false) return;
                        handleMouseDownRotate(event);
                        state = STATE.ROTATE;
                    }
                    break;
                case (0, _three.MOUSE).PAN:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        if (scope.enableRotate === false) return;
                        handleMouseDownRotate(event);
                        state = STATE.ROTATE;
                    } else {
                        if (scope.enablePan === false) return;
                        handleMouseDownPan(event);
                        state = STATE.PAN;
                    }
                    break;
                default:
                    state = STATE.NONE;
            }
            if (state !== STATE.NONE) scope.dispatchEvent(_startEvent);
        }
        function onMouseMove(event) {
            switch(state){
                case STATE.ROTATE:
                    if (scope.enableRotate === false) return;
                    handleMouseMoveRotate(event);
                    break;
                case STATE.DOLLY:
                    if (scope.enableZoom === false) return;
                    handleMouseMoveDolly(event);
                    break;
                case STATE.PAN:
                    if (scope.enablePan === false) return;
                    handleMouseMovePan(event);
                    break;
            }
        }
        function onMouseWheel(event) {
            if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE) return;
            event.preventDefault();
            scope.dispatchEvent(_startEvent);
            handleMouseWheel(event);
            scope.dispatchEvent(_endEvent);
        }
        function onKeyDown(event) {
            if (scope.enabled === false || scope.enablePan === false) return;
            handleKeyDown(event);
        }
        function onTouchStart(event) {
            trackPointer(event);
            switch(pointers.length){
                case 1:
                    switch(scope.touches.ONE){
                        case (0, _three.TOUCH).ROTATE:
                            if (scope.enableRotate === false) return;
                            handleTouchStartRotate();
                            state = STATE.TOUCH_ROTATE;
                            break;
                        case (0, _three.TOUCH).PAN:
                            if (scope.enablePan === false) return;
                            handleTouchStartPan();
                            state = STATE.TOUCH_PAN;
                            break;
                        default:
                            state = STATE.NONE;
                    }
                    break;
                case 2:
                    switch(scope.touches.TWO){
                        case (0, _three.TOUCH).DOLLY_PAN:
                            if (scope.enableZoom === false && scope.enablePan === false) return;
                            handleTouchStartDollyPan();
                            state = STATE.TOUCH_DOLLY_PAN;
                            break;
                        case (0, _three.TOUCH).DOLLY_ROTATE:
                            if (scope.enableZoom === false && scope.enableRotate === false) return;
                            handleTouchStartDollyRotate();
                            state = STATE.TOUCH_DOLLY_ROTATE;
                            break;
                        default:
                            state = STATE.NONE;
                    }
                    break;
                default:
                    state = STATE.NONE;
            }
            if (state !== STATE.NONE) scope.dispatchEvent(_startEvent);
        }
        function onTouchMove(event) {
            trackPointer(event);
            switch(state){
                case STATE.TOUCH_ROTATE:
                    if (scope.enableRotate === false) return;
                    handleTouchMoveRotate(event);
                    scope.update();
                    break;
                case STATE.TOUCH_PAN:
                    if (scope.enablePan === false) return;
                    handleTouchMovePan(event);
                    scope.update();
                    break;
                case STATE.TOUCH_DOLLY_PAN:
                    if (scope.enableZoom === false && scope.enablePan === false) return;
                    handleTouchMoveDollyPan(event);
                    scope.update();
                    break;
                case STATE.TOUCH_DOLLY_ROTATE:
                    if (scope.enableZoom === false && scope.enableRotate === false) return;
                    handleTouchMoveDollyRotate(event);
                    scope.update();
                    break;
                default:
                    state = STATE.NONE;
            }
        }
        function onContextMenu(event) {
            if (scope.enabled === false) return;
            event.preventDefault();
        }
        function addPointer(event) {
            pointers.push(event);
        }
        function removePointer(event) {
            delete pointerPositions[event.pointerId];
            for(let i = 0; i < pointers.length; i++)if (pointers[i].pointerId == event.pointerId) {
                pointers.splice(i, 1);
                return;
            }
        }
        function trackPointer(event) {
            let position = pointerPositions[event.pointerId];
            if (position === undefined) {
                position = new (0, _three.Vector2)();
                pointerPositions[event.pointerId] = position;
            }
            position.set(event.pageX, event.pageY);
        }
        function getSecondPointerPosition(event) {
            const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
            return pointerPositions[pointer.pointerId];
        }
        //
        scope.domElement.addEventListener("contextmenu", onContextMenu);
        scope.domElement.addEventListener("pointerdown", onPointerDown);
        scope.domElement.addEventListener("pointercancel", onPointerUp);
        scope.domElement.addEventListener("wheel", onMouseWheel, {
            passive: false
        });
        // force an update at start
        this.update();
    }
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"azsGO":[function(require,module,exports) {
module.exports = require("fe1cd1ca92eb0c0a").getBundleURL("abtZw") + "particle.12d0a705.png" + "?" + Date.now();

},{"fe1cd1ca92eb0c0a":"lgJ39"}]},["2z8Du"], null, "parcelRequireaaed")

//# sourceMappingURL=display-webgl-3d.35437246.js.map
