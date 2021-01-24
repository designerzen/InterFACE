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
})({"e0816e722f282c5b06f2bb9c31ce0390":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installer = exports.isSupportingBrowser = void 0;

var _ui = require("./ui");

var _version = require("./version");

var _this = void 0;

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<img alt=\"App Screenshot\" src=\"", "\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n\t\t\t\t\t<div id=\"screenshotsContainer\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t@click=\"", "\"\n\t\t\t\t\t\t\taria-label=\"previous image\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\t\tviewBox=\"0 0 512 512\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\td=\"M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t<section id=\"screenshots\">\n\t\t\t\t\t\t", "\n\n\t\t\t\t\t\t</section>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t@click=\"", "\"\n\t\t\t\t\t\taria-label=\"next image\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\tviewBox=\"0 0 512 512\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\td=\"M284.9 412.6l138.1-134c6-5.8 9-13.7 9-22.4v-.4c0-8.7-3-16.6-9-22.4l-138.1-134c-12-12.5-31.3-12.5-43.2 0-11.9 12.5-11.9 32.7 0 45.2l83 79.4h-214c-17 0-30.7 14.3-30.7 32 0 18 13.7 32 30.6 32h214l-83 79.4c-11.9 12.5-11.9 32.7 0 45.2 12 12.5 31.3 12.5 43.3 0z\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var body = document.documentElement; // const shareMenu = document.getElementById('share-menu')
// check for beforeinstallprompt support

var isSupportingBrowser = window.hasOwnProperty("BeforeInstallPromptEvent");
exports.isSupportingBrowser = isSupportingBrowser;
var deferredPrompt;
var installed = false;
var hasPrompt = false;

var installer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var defer,
        openModal,
        manifestData,
        manifestPath,
        relatedApps,
        isIOS,
        cancelInstall,
        getInstalledStatus,
        shouldShowInstall,
        checkManifest,
        getManifestData,
        firstUpdated,
        createOverlayMarkup,
        install,
        begin,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            defer = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : false;
            openModal = false;
            manifestPath = "./manifest.webmanifest";
            relatedApps = []; // handle iOS specifically
            // this includes the regular iPad
            // and the iPad pro
            // but not macOS

            isIOS = navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;

            cancelInstall = function cancelInstall() {
              return new Promise(function (resolve, reject) {
                // close the modal
                openModal = false; //   if (this.hasAttribute("openmodal")) {
                // 	this.removeAttribute("openmodal")
                //   }
                //   let event = new CustomEvent("hide")
                //   this.dispatchEvent(event)

                resolve();
              });
            };

            document.addEventListener("keyup", function (event) {
              if (event.key === "Escape") {
                cancelInstall();
              }
            });

            getInstalledStatus = function getInstalledStatus() {
              if (navigator.standalone) {
                return navigator.standalone;
              } else if (matchMedia("(display-mode: standalone)").matches) {
                return true;
              } else {
                return false;
              }
            };

            shouldShowInstall = function shouldShowInstall() {
              var eligibleUser = isSupportingBrowser && relatedApps.length < 1 && (hasPrompt || isIOS);
              return eligibleUser;
            }; // Check that the manifest has our 3 required properties
            // If not console an error to the user and return


            checkManifest = function checkManifest(manifestToCheck) {
              if (!manifestToCheck.icons || !manifestToCheck.icons[0]) {
                console.error("Your web manifest must have atleast one icon listed");
                return;
              }

              if (!manifestToCheck.name) {
                console.error("Your web manifest must have a name listed");
                return;
              }

              if (!manifestToCheck.description) {
                console.error("Your web manifest must have a description listed");
                return;
              }
            };

            getManifestData = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return fetch(manifestPath);

                      case 3:
                        response = _context.sent;
                        _context.next = 6;
                        return response.json();

                      case 6:
                        data = _context.sent;
                        manifestData = data;

                        if (!data) {
                          _context.next = 11;
                          break;
                        }

                        // any point if it only logs and still continues?
                        checkManifest(data);
                        return _context.abrupt("return", data);

                      case 11:
                        _context.next = 16;
                        break;

                      case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](0);
                        return _context.abrupt("return", null);

                      case 16:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 13]]);
              }));

              return function getManifestData() {
                return _ref2.apply(this, arguments);
              };
            }();

            firstUpdated = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!manifestPath) {
                          _context2.next = 9;
                          break;
                        }

                        _context2.prev = 1;
                        _context2.next = 4;
                        return getManifestData();

                      case 4:
                        _context2.next = 9;
                        break;

                      case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2["catch"](1);
                        console.error("Error getting manifest, check that you have a valid web manifest");

                      case 9:
                        if (!("getInstalledRelatedApps" in navigator)) {
                          _context2.next = 13;
                          break;
                        }

                        _context2.next = 12;
                        return navigator.getInstalledRelatedApps();

                      case 12:
                        relatedApps = _context2.sent;

                      case 13:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[1, 6]]);
              }));

              return function firstUpdated() {
                return _ref3.apply(this, arguments);
              };
            }(); // This is created from the manifest


            createOverlayMarkup = function createOverlayMarkup() {
              return "<button id=\"openButton\" class=\"install-app\">\n\tInstall InterFACE Version ".concat(_version.VERSION, "\n\t</button>\n\t\n\t<dialog open>\n\t\t<!-- background needs to cancel install too? -->\n\t\t<header id=\"logoContainer\">\n\t\t\t<img src=\"").concat(manifestData.icons[0].src, "\" alt=\"App Logo\"/>\n\n\t\t\t<div id=\"installTitle\">\n\t\t\t\t<h1>").concat(manifestData.short_name || manifestData.name, "</h1>\n\t\t\t\t<p id=\"desc\">").concat(explainer, "</p>\n\t\t\t</div>\n\t\t</header>\n\n\t\t<button id=\"closeButton\" click=\"\" aria-label=\"Close\">\n\t\t\t<svg width=\"23\" height=\"22\" viewBox=\"0 0 23 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t\t\t\t<path opacity=\"0.33\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1.11932 0.357981C1.59693 -0.119327 2.37129 -0.119327 2.8489 0.357981L11.7681 9.27152L20.6873 0.357981C21.165 -0.119327 21.9393 -0.119327 22.4169 0.357981C22.8945 0.835288 22.8945 1.60916 22.4169 2.08646L13.4977 11L22.4169 19.9135C22.8945 20.3908 22.8945 21.1647 22.4169 21.642C21.9393 22.1193 21.165 22.1193 20.6873 21.642L11.7681 12.7285L2.8489 21.642C2.37129 22.1193 1.59693 22.1193 1.11932 21.642C0.641705 21.1647 0.641705 20.3908 1.11932 19.9135L10.0385 11L1.11932 2.08646C0.641705 1.60916 0.641705 0.835288 1.11932 0.357981Z\" fill=\"#60656D\"/>\n\t\t\t</svg>\n\t\t</button>\n\n\n\t\t<div id=\"contentContainer\">\n\n\t\t\t<div id=\"featuresScreenDiv\">\n\n\t\t\t").concat(manifestData.features ? "<div id=\"keyFeatures\">\n\t\t\t\t<h3>Features</h3>\n\t\t\t\t<ul>\n\t\t\t\t".concat(manifestData.features ? manifestDatafeatures.map(function (feature) {
                return " <li>".concat(feature, "</li> ");
              }) : null, "\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t</div>") : null, "\n\n\t\t\t").concat(manifestData.screenshots ? html(_templateObject(), function () {
                return _this.scrollToLeft();
              }, manifestData.screenshots.map(function (screen) {
                return html(_templateObject2(), screen.src);
              }), function () {
                return _this.scrollToRight();
              }) : null, "\n\t\t\t</div>\n\n\t\t\t<div id=\"descriptionWrapper\">\n\t\t\t\t<h3>").concat(_this.descriptionheader, "</h3>\n\t\t\t\t<p id=\"manifest-description\">").concat(_this.manifestdata.description, "</p>\n\t\t\t</div>\n\t\t\t\n\t\t\t</div>\n\t\t\n\t\t<button id=\"openButton\" class=\"install-app\">Install InterFACE Version ").concat(_version.VERSION, "</button>\n\t\t<button class=\"cancel-install\">Cancel</button>\n\n\t\t<p id=\"iosText\">").concat(iosinstallinfotext, "</p> \n\n\t</dialog>\n\t");
            };

            install = /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
                          var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
                            var choiceResult;
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    if (!deferredPrompt) {
                                      _context3.next = 10;
                                      break;
                                    }

                                    deferredPrompt.prompt(); //   let event = new CustomEvent("show")
                                    //   this.dispatchEvent(event)

                                    _context3.next = 4;
                                    return cancelInstall();

                                  case 4:
                                    _context3.next = 6;
                                    return deferredPrompt.userChoice;

                                  case 6:
                                    choiceResult = _context3.sent;

                                    if (choiceResult.outcome === "accepted") {
                                      console.log("Your PWA has been installed");
                                      installed = true;
                                      resolve(true);
                                    } else {
                                      console.log("User chose to not install");
                                      installed = false;
                                      resolve(false);
                                    }

                                    _context3.next = 11;
                                    break;

                                  case 10:
                                    // handle else case
                                    reject("no prompt cached");

                                  case 11:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x, _x2) {
                            return _ref5.apply(this, arguments);
                          };
                        }()));

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function install() {
                return _ref4.apply(this, arguments);
              };
            }();

            begin = /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(destination) {
                var showInstaller, test, button;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        showInstaller = shouldShowInstall();

                        if (!(hasPrompt && "standalone" in navigator && navigator.standalone === false || showInstaller && installed === false)) {
                          _context6.next = 21;
                          break;
                        }

                        _context6.next = 4;
                        return firstUpdated();

                      case 4:
                        test = _context6.sent;
                        console.log("Application is currently ", getInstalledStatus() ? "installed" : "not installed");
                        console.log({
                          manifestdata: manifestData
                        });
                        body.classList.add(getInstalledStatus() ? "installed" : "not-installed"); // show install button or update button???
                        // reveal update button?

                        button = document.createElement('button');
                        button.classList.add("install-app");
                        button.setAttribute("aria-label", "Click to install ".concat(manifestData.short_name, " V:").concat(_version.VERSION.replaceAll(".", "-"), " Date:").concat(_version.DATE));
                        button.style.setProperty("--logo", "url(".concat(manifestData.icons[0].src, ")"));
                        button.innerHTML = "Install App";
                        (0, _ui.addTooltip)(button);
                        (0, _ui.setToast)("This App can be installed!<br> Click the orange button on the left"); // on button press...

                        button.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                          var success;
                          return regeneratorRuntime.wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  // show overlay with install button or just install directly?
                                  (0, _ui.setFeedback)("Installing", 0);
                                  _context5.prev = 1;
                                  _context5.next = 4;
                                  return install();

                                case 4:
                                  success = _context5.sent;
                                  (0, _ui.setToast)(success ? "The App was installed" : "Maybe some other time");

                                  if (!success) {
                                    // show buton?
                                    //document.querySelector(".install-app").style.display = "none"
                                    button.classList.add("later");
                                  } else {
                                    // hide button
                                    document.querySelector(".install-app").style.display = "none";
                                  }

                                  _context5.next = 12;
                                  break;

                                case 9:
                                  _context5.prev = 9;
                                  _context5.t0 = _context5["catch"](1);
                                  (0, _ui.setToast)("The App was not installed");

                                case 12:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5, null, [[1, 9]]);
                        })));
                        destination = destination || body;
                        destination.appendChild(button);
                        return _context6.abrupt("return", true);

                      case 21:
                        body.classList.add(installed ? "installed" : "not-installed"); // we are already showing?

                        console.log("Application not installable", {
                          showInstaller: showInstaller,
                          installed: installed
                        }, getInstalledStatus() ? "installed" : "not-installed");
                        console.error({
                          isSupportingBrowser: isSupportingBrowser,
                          relatedApps: relatedApps,
                          hasPrompt: hasPrompt,
                          isIOS: isIOS
                        });
                        return _context6.abrupt("return", false);

                      case 25:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function begin(_x3) {
                return _ref6.apply(this, arguments);
              };
            }(); // hijack an install event


            if (!deferredPrompt && !hasPrompt) {
              window.addEventListener("beforeinstallprompt", function (event) {
                deferredPrompt = event;
                hasPrompt = true;
                event.preventDefault();

                if (!defer && !isIOS) {
                  begin();
                }
              }, {
                once: true
              });
            }

            if (!defer && isIOS) {
              window.addEventListener("load", /*#__PURE__*/function () {
                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          begin();

                        case 1:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x4) {
                  return _ref8.apply(this, arguments);
                };
              }(), {
                once: true
              });
            }

            return _context8.abrupt("return", begin);

          case 18:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function installer() {
    return _ref.apply(this, arguments);
  };
}();

exports.installer = installer;
window.addEventListener("beforeinstallprompt", function (event) {
  deferredPrompt = event;
  hasPrompt = true;
  event.preventDefault();
}, {
  once: true
});
/*

*/
//   render() {
//     return html`
//       ${("standalone" in navigator &&
//         (navigator as any).standalone === false) ||
//       (this.usecustom !== true &&
//         this.shouldShowInstall() &&
//         this.installed === false)
//         ? html`<button
//             part="openButton"
//             id="openButton"
//             @click="${() => this.openPrompt()}"
//           >
//             <slot>
//               ${this.installbuttontext}
//             </slot>
//           </button>`
//         : null}
//       ${this.openmodal === true
//         ? html`
//           <div id="installModalWrapper">
//           ${
//             this.openmodal
//               ? html`<div
//                   id="background"
//                   @click="${() => this.cancel()}"
//                 ></div>`
//               : null
//           }
//           <div id="installModal" part="installModal">
//           <div id="headerContainer">
//           <div id="logoContainer">
//             <img src="${
//               this.iconpath ? this.iconpath : this.manifestdata.icons[0].src
//             }" alt="App Logo"/>
//             <div id="installTitle">
//               <h1>${this.manifestdata.short_name || this.manifestdata.name}</h1>
//               <p id="desc">
//                 ${this.explainer}
//               </p>
//             </div>
//           </div>
//           <button id="closeButton" @click="${() =>
//             this.cancel()}" aria-label="Close">
//             <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path opacity="0.33" fill-rule="evenodd" clip-rule="evenodd" d="M1.11932 0.357981C1.59693 -0.119327 2.37129 -0.119327 2.8489 0.357981L11.7681 9.27152L20.6873 0.357981C21.165 -0.119327 21.9393 -0.119327 22.4169 0.357981C22.8945 0.835288 22.8945 1.60916 22.4169 2.08646L13.4977 11L22.4169 19.9135C22.8945 20.3908 22.8945 21.1647 22.4169 21.642C21.9393 22.1193 21.165 22.1193 20.6873 21.642L11.7681 12.7285L2.8489 21.642C2.37129 22.1193 1.59693 22.1193 1.11932 21.642C0.641705 21.1647 0.641705 20.3908 1.11932 19.9135L10.0385 11L1.11932 2.08646C0.641705 1.60916 0.641705 0.835288 1.11932 0.357981Z" fill="#60656D"/>
//             </svg>
//           </button>
//         </div>
//         <div id="contentContainer">
//         <div id="featuresScreenDiv">
//           ${
//             this.manifestdata.features
//               ? html`<div id="keyFeatures">
//             <h3>${this.featuresheader}</h3>
//             <ul>
//               ${
//                 this.manifestdata.features
//                   ? this.manifestdata.features.map((feature) => {
//                       return html` <li>${feature}</li> `;
//                     })
//                   : null
//               }
//             </ul>
//           </div>
//           </div>`
//               : null
//           }
//           ${
//             this.manifestdata.screenshots
//               ? html`
//                   <div id="screenshotsContainer">
//                     <button
//                       @click="${() => this.scrollToLeft()}"
//                       aria-label="previous image"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 512 512"
//                       >
//                         <path
//                           d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"
//                         />
//                       </svg>
//                     </button>
//                     <section id="screenshots">
//                       ${this.manifestdata.screenshots.map((screen) => {
//                         return html`
//                           <div>
//                             <img alt="App Screenshot" src="${screen.src}" />
//                           </div>
//                         `;
//                       })}
//                     </section>
//                     <button
//                       @click="${() => this.scrollToRight()}"
//                       aria-label="next image"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 512 512"
//                       >
//                         <path
//                           d="M284.9 412.6l138.1-134c6-5.8 9-13.7 9-22.4v-.4c0-8.7-3-16.6-9-22.4l-138.1-134c-12-12.5-31.3-12.5-43.2 0-11.9 12.5-11.9 32.7 0 45.2l83 79.4h-214c-17 0-30.7 14.3-30.7 32 0 18 13.7 32 30.6 32h214l-83 79.4c-11.9 12.5-11.9 32.7 0 45.2 12 12.5 31.3 12.5 43.3 0z"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 `
//               : null
//           }
//           </div>
//           <div id="descriptionWrapper">
//             <h3>${this.descriptionheader}</h3>
//             <p id="manifest-description">${this.manifestdata.description}</p>
//           </div>
//         </div>
//         ${
//           !this.isIOS
//             ? html`<div id="buttonsContainer">
//           ${
//             this.deferredprompt
//               ? html`<button
//                   id="installButton"
//                   @click="${() => this.install()}"
//                 >
//                   ${this.installbuttontext} ${this.manifestdata.short_name}
//                 </button>`
//               : html`<button
//                   @click="${() => this.cancel()}"
//                   id="installCancelButton"
//                 >
//                   ${this.cancelbuttontext}
//                 </button>`
//           }
//         </div>
//           </div>`
//             : html`<p id="iosText">${this.iosinstallinfotext}</p>`
//         }
//         `
//         : null}
//     `;
//   }
// }
// Allow app to be installed
// FIXME: Lazy load this whilst camera searching...
// @customElement("pwa-install")
// export class pwainstall extends LitElement {
//   @property({ type: String }) manifestpath: string = "manifest.json";
//   @property({ type: String }) iconpath: string;
//   @property({ type: Object }) manifestdata: ManifestData;
//   @property({ type: Boolean }) openmodal: boolean = false;
//   @property({ type: Boolean }) showopen: boolean;
//   @property({ type: Boolean }) isSupportingBrowser: boolean;
//   @property({ type: Boolean }) isIOS: boolean;
//   @property({ type: Boolean }) installed: boolean;
//   @property({ type: Boolean }) hasprompt: boolean = false;
//   @property({ type: Boolean }) usecustom: boolean;
//   @property({ type: Array }) relatedApps: any[] = [];
//   @property({ type: String }) explainer: string =
//     "This app can be installed on your PC or mobile device.  This will allow this web app to look and behave like any other installed app.  You will find it in your app lists and be able to pin it to your home screen, start menus or task bars.  This installed web app will also be able to safely interact with other apps and your operating system. ";
//   @property({ type: String }) featuresheader: string = "Key Features";
//   @property({ type: String }) descriptionheader: string = "Description";
//   @property({ type: String }) installbuttontext: string = "Install";
//   @property({ type: String }) cancelbuttontext: string = "Cancel";
//   @property({ type: String }) iosinstallinfotext: string =
//     "Tap the share button and then 'Add to Homescreen'";
//   @property() deferredprompt: any;
//   static get styles() {
//     return css`
//       :host {
//         --install-focus-color: #919c9c;
//         --install-button-color: #0078d4;
//         --modal-z-index: 9999;
//         --background-z-index: 9998;
//         --modal-background-color: white;
//       }
//       button {
//         outline: none;
//       }
//       #installModalWrapper {
//         height: 100vh;
//         width: 100vw;
//         overflow: auto;
//         position: fixed;
//         bottom: 0;
//         top: 0;
//         left: 0;
//         right: 0;
//         z-index: var(--modal-z-index);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//       }
//       #descriptionWrapper {
//         margin-bottom: 3em;
//       }
//       #installModal {
//         position: absolute;
//         background: var(--modal-background-color);
//         font-family: sans-serif;
//         box-shadow: 0px 25px 26px rgba(32, 36, 50, 0.25),
//           0px 5px 9px rgba(51, 58, 83, 0.53);
//         border-radius: 10px;
//         display: flex;
//         flex-direction: column;
//         padding: 0;
//         animation-name: opened;
//         animation-duration: 150ms;
//         z-index: var(--modal-z-index);
//         max-width: 56em;
//       }
//       @keyframes opened {
//         from {
//           transform: scale(0.8, 0.8);
//           opacity: 0.4;
//         }
//         to {
//           transform: scale(1, 1);
//           opacity: 1;
//         }
//       }
//       @keyframes mobile {
//         from {
//           opacity: 0.6;
//         }
//         to {
//           opacity: 1;
//         }
//       }
//       @keyframes fadein {
//         from {
//           opacity: 0.2;
//         }
//         to {
//           opacity: 1;
//         }
//       }
//       #background {
//         position: fixed;
//         top: 0;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         background: #e3e3e3b0;
//         backdrop-filter: blur(5px);
//         z-index: var(--background-z-index);
//         animation-name: fadein;
//         animation-duration: 250ms;
//       }
//       #headerContainer {
//         display: flex;
//         justify-content: space-between;
//         margin: 40px;
//         margin-bottom: 32px;
//       }
//       #headerContainer h1 {
//         font-size: 34px;
//         color: #3c3c3c;
//         margin-top: 20px;
//         margin-bottom: 7px;
//       }
//       #headerContainer img {
//         height: 122px;
//         width: 122px;
//         background: lightgrey;
//         border-radius: 10px;
//         padding: 12px;
//         border-radius: 24px;
//         margin-right: 24px;
//       }
//       #buttonsContainer {
//         display: flex;
//         justify-content: flex-end;
//         position: relative;
//         height: 100px;
//         background: #dedede75;
//         width: 100%;
//         right: 0em;
//         border-radius: 0px 0px 12px 12px;
//       }
//       #openButton,
//       #installButton,
//       #installCancelButton {
//         text-align: center;
//         align-content: center;
//         align-self: center;
//         vertical-align: middle;
//         justify-self: flex-end;
//         line-height: 200%;
//         flex: 0 0 auto;
//         display: inline-block;
//         background: #0078d4;
//         color: #ffffff;
//         cursor: pointer;
//         border: solid 1px rgba(0, 0, 0, 0);
//         outline: none;
//       }
//       #openButton {
//         background: var(--install-button-color);
//       }
//       #openButton:focus {
//         outline: auto;
//         outline: -webkit-focus-ring-color auto 1px;
//       }
//       #installButton,
//       #installCancelButton {
//         min-width: 130px;
//         margin-right: 30px;
//         background: var(--install-button-color);
//         border-radius: 20px;
//         font-weight: 600;
//         font-size: 14px;
//         line-height: 21px;
//         padding-top: 10px;
//         padding-bottom: 9px;
//         padding-left: 20px;
//         padding-right: 20px;
//         outline: none;
//         color: white;
//       }
//       #closeButton {
//         background: transparent;
//         border: none;
//         color: black;
//         padding-left: 12px;
//         padding-right: 12px;
//         padding-top: 4px;
//         padding-bottom: 4px;
//         border-radius: 20px;
//         font-weight: 600;
//         outline: none;
//         cursor: pointer;
//         align-self: self-end;
//       }
//       #closeButton:focus,
//       #installButton:focus,
//       #installCancelButton:focus {
//         box-shadow: 0 0 0 3px var(--install-focus-color);
//       }
//       #contentContainer {
//         margin-left: 40px;
//         margin-right: 40px;
//         flex: 1;
//       }
//       #contentContainer h3 {
//         font-size: 22px;
//         color: #3c3c3c;
//         margin-bottom: 12px;
//       }
//       #contentContainer p {
//         font-size: 14px;
//         color: #3c3c3c;
//       }
//       #featuresScreenDiv {
//         display: flex;
//         justify-content: space-around;
//         align-items: center;
//         margin-right: 20px;
//       }
//       #featuresScreenDiv h3 {
//         font-style: normal;
//         font-weight: 600;
//         font-size: 22px;
//         line-height: 225%;
//         margin-top: 0px;
//       }
//       #keyFeatures {
//         overflow: hidden;
//         padding-right: 2em;
//       }
//       #keyFeatures ul {
//         padding-inline-start: 22px;
//         margin-block-start: 12px;
//       }
//       #featuresScreenDiv #keyFeatures li {
//         font-style: normal;
//         font-weight: 600;
//         font-size: 16px;
//         line-height: 29px;
//         color: rgba(51, 51, 51, 0.72);
//       }
//       #screenshotsContainer {
//         max-height: 220px;
//         display: flex;
//         max-width: 30em;
//       }
//       #screenshotsContainer button {
//         border: none;
//         width: 4em;
//         transition: background-color 0.2s;
//       }
//       #screenshotsContainer button:focus,
//       #screenshotsContainer button:hover {
//         background-color: #bbbbbb;
//       }
//       #screenshotsContainer button svg {
//         width: 28px;
//         fill: #6b6969;
//       }
//       #screenshots {
//         display: flex;
//         scroll-snap-type: x mandatory;
//         flex-wrap: wrap;
//         flex-direction: column;
//         overflow-x: scroll;
//         width: 22em;
//         max-height: 220px;
//         -webkit-overflow-scrolling: touch;
//       }
//       #screenshots div {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         scroll-snap-align: start;
//         height: 14em;
//         width: 100%;
//         background: #efefef;
//       }
//       #screenshots img {
//         height: 100%;
//         object-fit: contain;
//       }
//       #screenshots::-webkit-scrollbar {
//         display: none;
//       }
//       #tagsDiv {
//         margin-top: 1em;
//         margin-bottom: 1em;
//       }
//       #desc {
//         width: 100%;
//         max-width: 40em;
//         font-size: 14px;
//         color: #7e7e7e;
//         text-overflow: ellipsis;
//         overflow: hidden;
//       }
//       #logoContainer {
//         display: flex;
//       }
//       #tagsDiv span {
//         background: grey;
//         color: white;
//         padding-left: 12px;
//         padding-right: 12px;
//         padding-bottom: 4px;
//         font-weight: bold;
//         border-radius: 24px;
//         margin-right: 12px;
//         padding-top: 1px;
//       }
//       #iosText {
//         color: var(--install-button-color);
//         text-align: center;
//         font-weight: bold;
//         position: fixed;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         backdrop-filter: blur(10px);
//         background: rgba(239, 239, 239, 0.17);
//         margin: 0;
//         padding: 2em;
//       }
//       #manifest-description {
//         white-space: pre-wrap;
//       }
//       @media (max-height: 780px) {
//         #buttonsContainer {
//           height: 70px;
//           background: transparent;
//         }
//       }
//       @media (max-width: 1220px) {
//         #installModal {
//           margin: 0;
//           border-radius: 0px;
//           min-height: 100%;
//           width: 100%;
//           animation-name: mobile;
//           animation-duration: 250ms;
//         }
//         #screenshots {
//           justify-content: center;
//         }
//       }
//       @media (max-width: 962px) {
//         #headerContainer h1 {
//           margin-top: 0;
//           margin-bottom: 0;
//         }
//         #logoContainer {
//           align-items: center;
//         }
//         #desc {
//           display: none;
//         }
//         #headerContainer {
//           margin-bottom: 24px;
//         }
//         #headerContainer img {
//           height: 42px;
//           width: 42px;
//         }
//       }
//       @media (max-width: 800px) {
//         #background {
//           display: none;
//         }
//         #installModal {
//           overflow: scroll;
//           box-shadow: none;
//           max-width: 100%;
//           height: 100%;
//         }
//         #screenshotsContainer {
//           width: 100%;
//         }
//         #screenshots img {
//           height: 180px;
//         }
//         #buttonsContainer {
//           display: flex;
//           justify-content: center;
//           bottom: 0;
//           margin-bottom: 0;
//           border-radius: 0;
//           padding-top: 1em;
//           padding-bottom: 1em;
//         }
//         #buttonsContainer #installButton {
//           margin-right: 0px;
//         }
//         #featuresScreenDiv {
//           flex-direction: column;
//           align-items: flex-start;
//           margin-right: 0px;
//         }
//         #headerContainer {
//           margin: 20px;
//         }
//         #desc {
//           display: none;
//         }
//         #contentContainer {
//           margin-left: 20px;
//           margin-right: 20px;
//           margin-bottom: 5em;
//         }
//         #headerContainer img {
//           height: 60px;
//           width: 60px;
//           margin-right: 12px;
//         }
//         #buttonsContainer {
//           position: fixed;
//           bottom: 0;
//           background: #efefef2b;
//           backdrop-filter: blur(10px);
//         }
//       }
//       @media (max-width: 400px) {
//         #headerContainer h1 {
//           font-size: 26px;
//         }
//         #headerContainer img {
//           height: 40px;
//           width: 40px;
//         }
//         #featuresScreenDiv h3 {
//           font-size: 18px;
//           margin-bottom: 0px;
//         }
//         #keyFeatures ul {
//           margin-top: 0px;
//         }
//       }
//       @media all and (display-mode: standalone) {
//         button {
//           display: none;
//         }
//       }
//       @media (prefers-color-scheme: dark) {
//         :host {
//           --modal-background-color: black;
//         }
//         #installModal h1,
//         #installModal h2,
//         #installModal h3,
//         #installModal p,
//         #featuresScreenDiv #keyFeatures li {
//           color: #ffffff;
//         }
//         #closeButton svg path {
//           fill: #ffffff;
//           opacity: 1;
//         }
//         #buttonsContainer {
//           background: rgb(36 36 36);
//         }
//       }
//       /* 08-26-2020: supported by only safari desktop */
//       @media (inverted-colors: inverted) {
//         :host {
//           --install-focus-color: #6e6363;
//           --install-button-color: #ff872b;
//           --modal-background-color: black;
//         }
//         #installModal h1,
//         #installModal h2,
//         #installModal h3,
//         #installModal p,
//         #featuresScreenDiv #keyFeatures li {
//           color: #ffffff;
//         }
//         #closeButton svg path {
//           fill: #ffffff;
//           opacity: 1;
//         }
//         #buttonsContainer {
//           background: rgb(36 36 36);
//         }
//       }
//     `;
//   }
},{"./ui":"f1945c1ea0a102386be390585e044c46","./version":"96bbf71b97db043de13209fe2c1629cf"}]},{},[], null)

//# sourceMappingURL=install.4db668eb.js.map
