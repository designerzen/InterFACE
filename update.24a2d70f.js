// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
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
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
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
          typeof parcelRequire === 'function' && parcelRequire;
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
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
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
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"574e7470f109f5dcbd28638599bb738e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateApp = exports.updater = void 0;

const formatBytes = (bytes, decimals = 2) => {
  const SIZES = ['Bytes', 'KB', 'MB', 'GB'];

  if (bytes === 0) {
    return '0 ' + SIZES[0];
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + SIZES[i];
};

const updater = async (sw = 'service-worker.js') => new Promise((resolve, reject) => {
  let storageUsed = 0;
  let reg; // The actual install script!
  // NB. exported by wrapper

  const installUpdate = () => {
    reg.waiting.postMessage({
      type: 'SKIP_WAITING'
    });
    window.location.reload();
  }; // Use the window load event to keep the page load performant


  const checkUpdates = async () => {
    reg = await navigator.serviceWorker.register(require("service-worker.js")); // sw

    const worker = reg.installing;

    if (worker && navigator.storage) {
      const storageData = await navigator.storage.estimate();

      if (storageData) {
        storageUsed = formatBytes(storageData.usage);
      }
    }

    reg.onupdatefound = async () => {
      const newWorker = reg.installing;

      newWorker.onstatechange = async () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker) {
            const registeredWorker = await navigator.serviceWorker.getRegistration();

            if (registeredWorker && registeredWorker.waiting) {
              // show update icon!
              resolve(installUpdate);
            }
          } else {
            reject("No Service Worker");
          }
        } else {
          // not instaLLed
          reject("Not Installed");
        }
      };
    };
  }; // Check that service workers are supported


  if ('serviceWorker' in navigator) {
    // hook into load event if we haven't loaded yet
    if (document.readyState === 'complete') {
      checkUpdates();
    } else {
      window.addEventListener('load', checkUpdates, {
        once: true
      });
    }
  } else {
    reject("Service Workers not allowed");
  }
}); // 


exports.updater = updater;

const updateApp = async (sw = 'service-worker.js') => {
  try {
    const update = await updater(sw);
    return {
      updater: update,
      updateAvailable: true
    };
  } catch (error) {
    // no updates or app not installed etc
    console.log(error);
    return false;
  }
};

exports.updateApp = updateApp;
},{"service-worker.js":"3a8c778cdef7cfbf780af0cb34475214"}],"3a8c778cdef7cfbf780af0cb34475214":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("7a8ce0e9b4e134c6", "5b8d97bef6056dba");
},{"./bundle-url":"a079551cb6dc35425204fc0bb93fe7bb","./relative-path":"3d690079c6611245df705566cbbc1942"}]},{},[], null)

//# sourceMappingURL=update.24a2d70f.js.map
