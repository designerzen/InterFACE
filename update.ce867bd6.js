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
})({"2d76700b001e5bc68abef4562dd61779":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateApp = exports.updater = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var formatBytes = function formatBytes(bytes) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var SIZES = ['Bytes', 'KB', 'MB', 'GB'];

  if (bytes === 0) {
    return '0 ' + SIZES[0];
  }

  var k = 1024;
  var dm = decimals < 0 ? 0 : decimals;
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + SIZES[i];
};

var updater = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var sw,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sw = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 'service-worker.js';
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              var storageUsed = 0;
              var reg; // The actual install script!
              // NB. exported by wrapper

              var installUpdate = function installUpdate() {
                reg.waiting.postMessage({
                  type: 'SKIP_WAITING'
                });
                window.location.reload();
              }; // Use the window load event to keep the page load performant


              var checkUpdates = /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  var worker, storageData;
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return navigator.serviceWorker.register(require("service-worker.js"));

                        case 2:
                          reg = _context3.sent;
                          // sw
                          worker = reg.installing;

                          if (!(worker && navigator.storage)) {
                            _context3.next = 9;
                            break;
                          }

                          _context3.next = 7;
                          return navigator.storage.estimate();

                        case 7:
                          storageData = _context3.sent;

                          if (storageData) {
                            storageUsed = formatBytes(storageData.usage);
                          }

                        case 9:
                          reg.onupdatefound = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                            var newWorker;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    newWorker = reg.installing;
                                    newWorker.onstatechange = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                      var registeredWorker;
                                      return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                          switch (_context.prev = _context.next) {
                                            case 0:
                                              if (!(newWorker.state === 'installed')) {
                                                _context.next = 11;
                                                break;
                                              }

                                              if (!navigator.serviceWorker) {
                                                _context.next = 8;
                                                break;
                                              }

                                              _context.next = 4;
                                              return navigator.serviceWorker.getRegistration();

                                            case 4:
                                              registeredWorker = _context.sent;

                                              if (registeredWorker && registeredWorker.waiting) {
                                                // show update icon!
                                                resolve(installUpdate);
                                              }

                                              _context.next = 9;
                                              break;

                                            case 8:
                                              reject("No Service Worker");

                                            case 9:
                                              _context.next = 12;
                                              break;

                                            case 11:
                                              // not instaLLed
                                              reject("Not Installed");

                                            case 12:
                                            case "end":
                                              return _context.stop();
                                          }
                                        }
                                      }, _callee);
                                    }));

                                  case 2:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                        case 10:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function checkUpdates() {
                  return _ref2.apply(this, arguments);
                };
              }(); // Check that service workers are supported


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
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updater() {
    return _ref.apply(this, arguments);
  };
}(); // 


exports.updater = updater;

var updateApp = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var sw,
        update,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            sw = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 'service-worker.js';
            _context5.prev = 1;
            _context5.next = 4;
            return updater(sw);

          case 4:
            update = _context5.sent;
            return _context5.abrupt("return", {
              updater: update,
              updateAvailable: true
            });

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            // no updates or app not installed etc
            console.log(_context5.t0);
            return _context5.abrupt("return", false);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 8]]);
  }));

  return function updateApp() {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateApp = updateApp;
},{"service-worker.js":"f0cb8eecbe34eb11e467a343b32473ab"}],"f0cb8eecbe34eb11e467a343b32473ab":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("29e61d941d853ccd", "00aa8ac05abde1c0");
},{"./bundle-url":"da3a6c17234c5d68d4f1108f53a7bad4","./relative-path":"23e5b69ae2ffddc223b376d75aff9c28"}]},{},[], null)

//# sourceMappingURL=update.ce867bd6.js.map
