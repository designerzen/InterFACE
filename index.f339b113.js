// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
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

  Object.defineProperty(newRequire, 'root', {
    get: function() {
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
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"6QUtJ":[function(require,module,exports) {
var HMR_HOST = null;var HMR_PORT = 11358;var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";module.bundle.HMR_BUNDLE_ID = "8463965451ff0e55b8a2ca5cf339b113";/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';

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
    },
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return (
    HMR_HOST ||
    (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost')
  );
}

function getPort() {
  return HMR_PORT || location.port;
}

// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(
    protocol + '://' + hostname + (port ? ':' + port : '') + '/',
  );
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();

      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH);

      // Handle HMR Update
      var handled = false;
      assets.forEach(asset => {
        var didAccept =
          asset.type === 'css' || hmrAcceptCheck(module.bundle.root, asset.id);
        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();

        assets.forEach(function(asset) {
          hmrApply(module.bundle.root, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];
          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe
          ? ansiDiagnostic.codeframe
          : ansiDiagnostic.stack;

        console.error(
          '🚨 [parcel]: ' +
            ansiDiagnostic.message +
            '\n' +
            stack +
            '\n\n' +
            ansiDiagnostic.hints.join('\n'),
        );
      }

      // Render the fancy html overlay
      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };
  ws.onerror = function(e) {
    console.error(e.message);
  };
  ws.onclose = function(e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  let errorHTML =
    '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;

    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';

  overlay.innerHTML = errorHTML;

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function() {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute(
    'href',
    link.getAttribute('href').split('?')[0] + '?' + Date.now(),
  );
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer =
        hostname === 'localhost'
          ? new RegExp(
              '^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort(),
            ).test(href)
          : href.indexOf(hostname + ':' + getPort());
      var absolute =
        /^https?:\/\//i.test(href) &&
        href.indexOf(window.location.origin) !== 0 &&
        !servedFromHMRServer;
      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(module.bundle.root, id).some(function(v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function(cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function(cb) {
      var assetsToAlsoAccept = cb(function() {
        return getParents(module.bundle.root, id);
      });
      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }
  acceptedAssets[id] = true;
}

},{}],"57NIz":[function(require,module,exports) {
"use strict";

require("@pwabuilder/pwainstall");

require("@pwabuilder/pwaupdate");
},{"@pwabuilder/pwainstall":"2jjvc","@pwabuilder/pwaupdate":"sDlwm"}],"2jjvc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pwainstall = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t = "undefined" != typeof window && null != window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
      e = (t, e, i = null) => {
  for (; e !== i;) {
    const i = e.nextSibling;
    t.removeChild(e), e = i;
  }
},
      i = `{{lit-${String(Math.random()).slice(2)}}}`,
      n = `\x3c!--${i}--\x3e`,
      s = new RegExp(`${i}|${n}`);

class o {
  constructor(t, e) {
    this.parts = [], this.element = e;
    const n = [],
          o = [],
          a = document.createTreeWalker(e.content, 133, null, !1);
    let p = 0,
        h = -1,
        c = 0;
    const {
      strings: u,
      values: {
        length: m
      }
    } = t;

    for (; c < m;) {
      const t = a.nextNode();

      if (null !== t) {
        if (h++, 1 === t.nodeType) {
          if (t.hasAttributes()) {
            const e = t.attributes,
                  {
              length: i
            } = e;
            let n = 0;

            for (let t = 0; t < i; t++) r(e[t].name, "$lit$") && n++;

            for (; n-- > 0;) {
              const e = u[c],
                    i = d.exec(e)[2],
                    n = i.toLowerCase() + "$lit$",
                    o = t.getAttribute(n);
              t.removeAttribute(n);
              const r = o.split(s);
              this.parts.push({
                type: "attribute",
                index: h,
                name: i,
                strings: r
              }), c += r.length - 1;
            }
          }

          "TEMPLATE" === t.tagName && (o.push(t), a.currentNode = t.content);
        } else if (3 === t.nodeType) {
          const e = t.data;

          if (e.indexOf(i) >= 0) {
            const i = t.parentNode,
                  o = e.split(s),
                  a = o.length - 1;

            for (let e = 0; e < a; e++) {
              let n,
                  s = o[e];
              if ("" === s) n = l();else {
                const t = d.exec(s);
                null !== t && r(t[2], "$lit$") && (s = s.slice(0, t.index) + t[1] + t[2].slice(0, -"$lit$".length) + t[3]), n = document.createTextNode(s);
              }
              i.insertBefore(n, t), this.parts.push({
                type: "node",
                index: ++h
              });
            }

            "" === o[a] ? (i.insertBefore(l(), t), n.push(t)) : t.data = o[a], c += a;
          }
        } else if (8 === t.nodeType) if (t.data === i) {
          const e = t.parentNode;
          null !== t.previousSibling && h !== p || (h++, e.insertBefore(l(), t)), p = h, this.parts.push({
            type: "node",
            index: h
          }), null === t.nextSibling ? t.data = "" : (n.push(t), h--), c++;
        } else {
          let e = -1;

          for (; -1 !== (e = t.data.indexOf(i, e + 1));) this.parts.push({
            type: "node",
            index: -1
          }), c++;
        }
      } else a.currentNode = o.pop();
    }

    for (const t of n) t.parentNode.removeChild(t);
  }

}

const r = (t, e) => {
  const i = t.length - e.length;
  return i >= 0 && t.slice(i) === e;
},
      a = t => -1 !== t.index,
      l = () => document.createComment(""),
      d = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

function p(t, e) {
  const {
    element: {
      content: i
    },
    parts: n
  } = t,
        s = document.createTreeWalker(i, 133, null, !1);
  let o = c(n),
      r = n[o],
      a = -1,
      l = 0;
  const d = [];
  let p = null;

  for (; s.nextNode();) {
    a++;
    const t = s.currentNode;

    for (t.previousSibling === p && (p = null), e.has(t) && (d.push(t), null === p && (p = t)), null !== p && l++; void 0 !== r && r.index === a;) r.index = null !== p ? -1 : r.index - l, o = c(n, o), r = n[o];
  }

  d.forEach(t => t.parentNode.removeChild(t));
}

const h = t => {
  let e = 11 === t.nodeType ? 0 : 1;
  const i = document.createTreeWalker(t, 133, null, !1);

  for (; i.nextNode();) e++;

  return e;
},
      c = (t, e = -1) => {
  for (let i = e + 1; i < t.length; i++) {
    const e = t[i];
    if (a(e)) return i;
  }

  return -1;
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const u = new WeakMap(),
      m = t => "function" == typeof t && u.has(t),
      f = {},
      g = {};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


class y {
  constructor(t, e, i) {
    this.__parts = [], this.template = t, this.processor = e, this.options = i;
  }

  update(t) {
    let e = 0;

    for (const i of this.__parts) void 0 !== i && i.setValue(t[e]), e++;

    for (const t of this.__parts) void 0 !== t && t.commit();
  }

  _clone() {
    const e = t ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
          i = [],
          n = this.template.parts,
          s = document.createTreeWalker(e, 133, null, !1);
    let o,
        r = 0,
        l = 0,
        d = s.nextNode();

    for (; r < n.length;) if (o = n[r], a(o)) {
      for (; l < o.index;) l++, "TEMPLATE" === d.nodeName && (i.push(d), s.currentNode = d.content), null === (d = s.nextNode()) && (s.currentNode = i.pop(), d = s.nextNode());

      if ("node" === o.type) {
        const t = this.processor.handleTextExpression(this.options);
        t.insertAfterNode(d.previousSibling), this.__parts.push(t);
      } else this.__parts.push(...this.processor.handleAttributeExpressions(d, o.name, o.strings, this.options));

      r++;
    } else this.__parts.push(void 0), r++;

    return t && (document.adoptNode(e), customElements.upgrade(e)), e;
  }

}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const v = ` ${i} `;

class b {
  constructor(t, e, i, n) {
    this.strings = t, this.values = e, this.type = i, this.processor = n;
  }

  getHTML() {
    const t = this.strings.length - 1;
    let e = "",
        s = !1;

    for (let o = 0; o < t; o++) {
      const t = this.strings[o],
            r = t.lastIndexOf("\x3c!--");
      s = (r > -1 || s) && -1 === t.indexOf("--\x3e", r + 1);
      const a = d.exec(t);
      e += null === a ? t + (s ? v : n) : t.substr(0, a.index) + a[1] + a[2] + "$lit$" + a[3] + i;
    }

    return e += this.strings[t], e;
  }

  getTemplateElement() {
    const t = document.createElement("template");
    return t.innerHTML = this.getHTML(), t;
  }

}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const x = t => null === t || !("object" == typeof t || "function" == typeof t),
      w = t => Array.isArray(t) || !(!t || !t[Symbol.iterator]);

class _ {
  constructor(t, e, i) {
    this.dirty = !0, this.element = t, this.name = e, this.strings = i, this.parts = [];

    for (let t = 0; t < i.length - 1; t++) this.parts[t] = this._createPart();
  }

  _createPart() {
    return new S(this);
  }

  _getValue() {
    const t = this.strings,
          e = t.length - 1;
    let i = "";

    for (let n = 0; n < e; n++) {
      i += t[n];
      const e = this.parts[n];

      if (void 0 !== e) {
        const t = e.value;
        if (x(t) || !w(t)) i += "string" == typeof t ? t : String(t);else for (const e of t) i += "string" == typeof e ? e : String(e);
      }
    }

    return i += t[e], i;
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }

}

class S {
  constructor(t) {
    this.value = void 0, this.committer = t;
  }

  setValue(t) {
    t === f || x(t) && t === this.value || (this.value = t, m(t) || (this.committer.dirty = !0));
  }

  commit() {
    for (; m(this.value);) {
      const t = this.value;
      this.value = f, t(this);
    }

    this.value !== f && this.committer.commit();
  }

}

class C {
  constructor(t) {
    this.value = void 0, this.__pendingValue = void 0, this.options = t;
  }

  appendInto(t) {
    this.startNode = t.appendChild(l()), this.endNode = t.appendChild(l());
  }

  insertAfterNode(t) {
    this.startNode = t, this.endNode = t.nextSibling;
  }

  appendIntoPart(t) {
    t.__insert(this.startNode = l()), t.__insert(this.endNode = l());
  }

  insertAfterPart(t) {
    t.__insert(this.startNode = l()), this.endNode = t.endNode, t.endNode = this.startNode;
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    if (null === this.startNode.parentNode) return;

    for (; m(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = f, t(this);
    }

    const t = this.__pendingValue;
    t !== f && (x(t) ? t !== this.value && this.__commitText(t) : t instanceof b ? this.__commitTemplateResult(t) : t instanceof Node ? this.__commitNode(t) : w(t) ? this.__commitIterable(t) : t === g ? (this.value = g, this.clear()) : this.__commitText(t));
  }

  __insert(t) {
    this.endNode.parentNode.insertBefore(t, this.endNode);
  }

  __commitNode(t) {
    this.value !== t && (this.clear(), this.__insert(t), this.value = t);
  }

  __commitText(t) {
    const e = this.startNode.nextSibling,
          i = "string" == typeof (t = null == t ? "" : t) ? t : String(t);
    e === this.endNode.previousSibling && 3 === e.nodeType ? e.data = i : this.__commitNode(document.createTextNode(i)), this.value = t;
  }

  __commitTemplateResult(t) {
    const e = this.options.templateFactory(t);
    if (this.value instanceof y && this.value.template === e) this.value.update(t.values);else {
      const i = new y(e, t.processor, this.options),
            n = i._clone();

      i.update(t.values), this.__commitNode(n), this.value = i;
    }
  }

  __commitIterable(t) {
    Array.isArray(this.value) || (this.value = [], this.clear());
    const e = this.value;
    let i,
        n = 0;

    for (const s of t) i = e[n], void 0 === i && (i = new C(this.options), e.push(i), 0 === n ? i.appendIntoPart(this) : i.insertAfterPart(e[n - 1])), i.setValue(s), i.commit(), n++;

    n < e.length && (e.length = n, this.clear(i && i.endNode));
  }

  clear(t = this.startNode) {
    e(this.startNode.parentNode, t.nextSibling, this.endNode);
  }

}

class P {
  constructor(t, e, i) {
    if (this.value = void 0, this.__pendingValue = void 0, 2 !== i.length || "" !== i[0] || "" !== i[1]) throw new Error("Boolean attributes can only contain a single expression");
    this.element = t, this.name = e, this.strings = i;
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    for (; m(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = f, t(this);
    }

    if (this.__pendingValue === f) return;
    const t = !!this.__pendingValue;
    this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = t), this.__pendingValue = f;
  }

}

class k extends _ {
  constructor(t, e, i) {
    super(t, e, i), this.single = 2 === i.length && "" === i[0] && "" === i[1];
  }

  _createPart() {
    return new N(this);
  }

  _getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }

}

class N extends S {}

let E = !1;

(() => {
  try {
    const t = {
      get capture() {
        return E = !0, !1;
      }

    };
    window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
  } catch (t) {}
})();

class A {
  constructor(t, e, i) {
    this.value = void 0, this.__pendingValue = void 0, this.element = t, this.eventName = e, this.eventContext = i, this.__boundHandleEvent = t => this.handleEvent(t);
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    for (; m(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = f, t(this);
    }

    if (this.__pendingValue === f) return;
    const t = this.__pendingValue,
          e = this.value,
          i = null == t || null != e && (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive),
          n = null != t && (null == e || i);
    i && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), n && (this.__options = T(t), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = t, this.__pendingValue = f;
  }

  handleEvent(t) {
    "function" == typeof this.value ? this.value.call(this.eventContext || this.element, t) : this.value.handleEvent(t);
  }

}

const T = t => t && (E ? {
  capture: t.capture,
  passive: t.passive,
  once: t.once
} : t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
;

function $(t) {
  let e = M.get(t.type);
  void 0 === e && (e = {
    stringsArray: new WeakMap(),
    keyString: new Map()
  }, M.set(t.type, e));
  let n = e.stringsArray.get(t.strings);
  if (void 0 !== n) return n;
  const s = t.strings.join(i);
  return n = e.keyString.get(s), void 0 === n && (n = new o(t, t.getTemplateElement()), e.keyString.set(s, n)), e.stringsArray.set(t.strings, n), n;
}

const M = new Map(),
      B = new WeakMap();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const V = new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class {
  handleAttributeExpressions(t, e, i, n) {
    const s = e[0];

    if ("." === s) {
      return new k(t, e.slice(1), i).parts;
    }

    if ("@" === s) return [new A(t, e.slice(1), n.eventContext)];
    if ("?" === s) return [new P(t, e.slice(1), i)];
    return new _(t, e, i).parts;
  }

  handleTextExpression(t) {
    return new C(t);
  }

}();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

"undefined" != typeof window && (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.2.1");

const O = (t, ...e) => new b(t, e, "html", V)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
,
      U = (t, e) => `${t}--${e}`;

let z = !0;
void 0 === window.ShadyCSS ? z = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."), z = !1);

const j = t => e => {
  const n = U(e.type, t);
  let s = M.get(n);
  void 0 === s && (s = {
    stringsArray: new WeakMap(),
    keyString: new Map()
  }, M.set(n, s));
  let r = s.stringsArray.get(e.strings);
  if (void 0 !== r) return r;
  const a = e.strings.join(i);

  if (r = s.keyString.get(a), void 0 === r) {
    const i = e.getTemplateElement();
    z && window.ShadyCSS.prepareTemplateDom(i, t), r = new o(e, i), s.keyString.set(a, r);
  }

  return s.stringsArray.set(e.strings, r), r;
},
      R = ["html", "svg"],
      L = new Set(),
      I = (t, e, i) => {
  L.add(t);
  const n = i ? i.element : document.createElement("template"),
        s = e.querySelectorAll("style"),
        {
    length: o
  } = s;
  if (0 === o) return void window.ShadyCSS.prepareTemplateStyles(n, t);
  const r = document.createElement("style");

  for (let t = 0; t < o; t++) {
    const e = s[t];
    e.parentNode.removeChild(e), r.textContent += e.textContent;
  }

  (t => {
    R.forEach(e => {
      const i = M.get(U(e, t));
      void 0 !== i && i.keyString.forEach(t => {
        const {
          element: {
            content: e
          }
        } = t,
              i = new Set();
        Array.from(e.querySelectorAll("style")).forEach(t => {
          i.add(t);
        }), p(t, i);
      });
    });
  })(t);

  const a = n.content;
  i ? function (t, e, i = null) {
    const {
      element: {
        content: n
      },
      parts: s
    } = t;
    if (null == i) return void n.appendChild(e);
    const o = document.createTreeWalker(n, 133, null, !1);
    let r = c(s),
        a = 0,
        l = -1;

    for (; o.nextNode();) {
      l++;

      for (o.currentNode === i && (a = h(e), i.parentNode.insertBefore(e, i)); -1 !== r && s[r].index === l;) {
        if (a > 0) {
          for (; -1 !== r;) s[r].index += a, r = c(s, r);

          return;
        }

        r = c(s, r);
      }
    }
  }(i, r, a.firstChild) : a.insertBefore(r, a.firstChild), window.ShadyCSS.prepareTemplateStyles(n, t);
  const l = a.querySelector("style");
  if (window.ShadyCSS.nativeShadow && null !== l) e.insertBefore(l.cloneNode(!0), e.firstChild);else if (i) {
    a.insertBefore(r, a.firstChild);
    const t = new Set();
    t.add(r), p(i, t);
  }
};

window.JSCompiler_renameProperty = (t, e) => t;

const D = {
  toAttribute(t, e) {
    switch (e) {
      case Boolean:
        return t ? "" : null;

      case Object:
      case Array:
        return null == t ? t : JSON.stringify(t);
    }

    return t;
  },

  fromAttribute(t, e) {
    switch (e) {
      case Boolean:
        return null !== t;

      case Number:
        return null === t ? null : Number(t);

      case Object:
      case Array:
        return JSON.parse(t);
    }

    return t;
  }

},
      F = (t, e) => e !== t && (e == e || t == t),
      q = {
  attribute: !0,
  type: String,
  converter: D,
  reflect: !1,
  hasChanged: F
};

class W extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = new Promise(t => this._enableUpdatingResolver = t), this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
  }

  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this._classProperties.forEach((e, i) => {
      const n = this._attributeNameForProperty(i, e);

      void 0 !== n && (this._attributeToPropertyMap.set(n, i), t.push(n));
    }), t;
  }

  static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = new Map();

      const t = Object.getPrototypeOf(this)._classProperties;

      void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
    }
  }

  static createProperty(t, e = q) {
    if (this._ensureClassProperties(), this._classProperties.set(t, e), e.noAccessor || this.prototype.hasOwnProperty(t)) return;
    const i = "symbol" == typeof t ? Symbol() : "__" + t,
          n = this.getPropertyDescriptor(t, i, e);
    void 0 !== n && Object.defineProperty(this.prototype, t, n);
  }

  static getPropertyDescriptor(t, e, i) {
    return {
      get() {
        return this[e];
      },

      set(i) {
        const n = this[t];
        this[e] = i, this._requestUpdate(t, n);
      },

      configurable: !0,
      enumerable: !0
    };
  }

  static getPropertyOptions(t) {
    return this._classProperties && this._classProperties.get(t) || q;
  }

  static finalize() {
    const t = Object.getPrototypeOf(this);

    if (t.hasOwnProperty("finalized") || t.finalize(), this.finalized = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map(), this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const t = this.properties,
            e = [...Object.getOwnPropertyNames(t), ...("function" == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t) : [])];

      for (const i of e) this.createProperty(i, t[i]);
    }
  }

  static _attributeNameForProperty(t, e) {
    const i = e.attribute;
    return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
  }

  static _valueHasChanged(t, e, i = F) {
    return i(t, e);
  }

  static _propertyValueFromAttribute(t, e) {
    const i = e.type,
          n = e.converter || D,
          s = "function" == typeof n ? n : n.fromAttribute;
    return s ? s(t, i) : t;
  }

  static _propertyValueToAttribute(t, e) {
    if (void 0 === e.reflect) return;
    const i = e.type,
          n = e.converter;
    return (n && n.toAttribute || D.toAttribute)(t, i);
  }

  initialize() {
    this._saveInstanceProperties(), this._requestUpdate();
  }

  _saveInstanceProperties() {
    this.constructor._classProperties.forEach((t, e) => {
      if (this.hasOwnProperty(e)) {
        const t = this[e];
        delete this[e], this._instanceProperties || (this._instanceProperties = new Map()), this._instanceProperties.set(e, t);
      }
    });
  }

  _applyInstanceProperties() {
    this._instanceProperties.forEach((t, e) => this[e] = t), this._instanceProperties = void 0;
  }

  connectedCallback() {
    this.enableUpdating();
  }

  enableUpdating() {
    void 0 !== this._enableUpdatingResolver && (this._enableUpdatingResolver(), this._enableUpdatingResolver = void 0);
  }

  disconnectedCallback() {}

  attributeChangedCallback(t, e, i) {
    e !== i && this._attributeToProperty(t, i);
  }

  _propertyToAttribute(t, e, i = q) {
    const n = this.constructor,
          s = n._attributeNameForProperty(t, i);

    if (void 0 !== s) {
      const t = n._propertyValueToAttribute(e, i);

      if (void 0 === t) return;
      this._updateState = 8 | this._updateState, null == t ? this.removeAttribute(s) : this.setAttribute(s, t), this._updateState = -9 & this._updateState;
    }
  }

  _attributeToProperty(t, e) {
    if (8 & this._updateState) return;

    const i = this.constructor,
          n = i._attributeToPropertyMap.get(t);

    if (void 0 !== n) {
      const t = i.getPropertyOptions(n);
      this._updateState = 16 | this._updateState, this[n] = i._propertyValueFromAttribute(e, t), this._updateState = -17 & this._updateState;
    }
  }

  _requestUpdate(t, e) {
    let i = !0;

    if (void 0 !== t) {
      const n = this.constructor,
            s = n.getPropertyOptions(t);
      n._valueHasChanged(this[t], e, s.hasChanged) ? (this._changedProperties.has(t) || this._changedProperties.set(t, e), !0 !== s.reflect || 16 & this._updateState || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(t, s))) : i = !1;
    }

    !this._hasRequestedUpdate && i && (this._updatePromise = this._enqueueUpdate());
  }

  requestUpdate(t, e) {
    return this._requestUpdate(t, e), this.updateComplete;
  }

  async _enqueueUpdate() {
    this._updateState = 4 | this._updateState;

    try {
      await this._updatePromise;
    } catch (t) {}

    const t = this.performUpdate();
    return null != t && (await t), !this._hasRequestedUpdate;
  }

  get _hasRequestedUpdate() {
    return 4 & this._updateState;
  }

  get hasUpdated() {
    return 1 & this._updateState;
  }

  performUpdate() {
    this._instanceProperties && this._applyInstanceProperties();
    let t = !1;
    const e = this._changedProperties;

    try {
      t = this.shouldUpdate(e), t ? this.update(e) : this._markUpdated();
    } catch (e) {
      throw t = !1, this._markUpdated(), e;
    }

    t && (1 & this._updateState || (this._updateState = 1 | this._updateState, this.firstUpdated(e)), this.updated(e));
  }

  _markUpdated() {
    this._changedProperties = new Map(), this._updateState = -5 & this._updateState;
  }

  get updateComplete() {
    return this._getUpdateComplete();
  }

  _getUpdateComplete() {
    return this._updatePromise;
  }

  shouldUpdate(t) {
    return !0;
  }

  update(t) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)), this._reflectingProperties = void 0), this._markUpdated();
  }

  updated(t) {}

  firstUpdated(t) {}

}

W.finalized = !0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const H = (t, e) => "method" === e.kind && e.descriptor && !("value" in e.descriptor) ? Object.assign(Object.assign({}, e), {
  finisher(i) {
    i.createProperty(e.key, t);
  }

}) : {
  kind: "field",
  key: Symbol(),
  placement: "own",
  descriptor: {},

  initializer() {
    "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
  },

  finisher(i) {
    i.createProperty(e.key, t);
  }

};

function J(t) {
  return (e, i) => void 0 !== i ? ((t, e, i) => {
    e.constructor.createProperty(i, t);
  })(t, e, i) : H(t, e);
}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/


const Y = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      K = Symbol();

class Z {
  constructor(t, e) {
    if (e !== K) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t;
  }

  get styleSheet() {
    return void 0 === this._styleSheet && (Y ? (this._styleSheet = new CSSStyleSheet(), this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
  }

  toString() {
    return this.cssText;
  }

}

const G = (t, ...e) => {
  const i = e.reduce((e, i, n) => e + (t => {
    if (t instanceof Z) return t.cssText;
    if ("number" == typeof t) return t;
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(i) + t[n + 1], t[0]);
  return new Z(i, K);
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


(window.litElementVersions || (window.litElementVersions = [])).push("2.3.1");
const Q = {};

class X extends W {
  static getStyles() {
    return this.styles;
  }

  static _getUniqueStyles() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("_styles", this))) return;
    const t = this.getStyles();
    if (void 0 === t) this._styles = [];else if (Array.isArray(t)) {
      const e = (t, i) => t.reduceRight((t, i) => Array.isArray(i) ? e(i, t) : (t.add(i), t), i),
            i = e(t, new Set()),
            n = [];

      i.forEach(t => n.unshift(t)), this._styles = n;
    } else this._styles = [t];
  }

  initialize() {
    super.initialize(), this.constructor._getUniqueStyles(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }

  createRenderRoot() {
    return this.attachShadow({
      mode: "open"
    });
  }

  adoptStyles() {
    const t = this.constructor._styles;
    0 !== t.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? Y ? this.renderRoot.adoptedStyleSheets = t.map(t => t.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t => t.cssText), this.localName));
  }

  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }

  update(t) {
    const e = this.render();
    super.update(t), e !== Q && this.constructor.render(e, this.renderRoot, {
      scopeName: this.localName,
      eventContext: this
    }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(t => {
      const e = document.createElement("style");
      e.textContent = t.cssText, this.renderRoot.appendChild(e);
    }));
  }

  render() {
    return Q;
  }

}

X.finalized = !0, X.render = (t, i, n) => {
  if (!n || "object" != typeof n || !n.scopeName) throw new Error("The `scopeName` option is required.");
  const s = n.scopeName,
        o = B.has(i),
        r = z && 11 === i.nodeType && !!i.host,
        a = r && !L.has(s),
        l = a ? document.createDocumentFragment() : i;

  if (((t, i, n) => {
    let s = B.get(i);
    void 0 === s && (e(i, i.firstChild), B.set(i, s = new C(Object.assign({
      templateFactory: $
    }, n))), s.appendInto(i)), s.setValue(t), s.commit();
  })(t, l, Object.assign({
    templateFactory: j(s)
  }, n)), a) {
    const t = B.get(l);
    B.delete(l);
    const n = t.value instanceof y ? t.value.template : void 0;
    I(s, l, n), e(i, i.firstChild), i.appendChild(l), B.set(i, t);
  }

  !o && r && window.ShadyCSS.styleElement(i.host);
};

var tt = function (t, e, i, n) {
  var s,
      o = arguments.length,
      r = o < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, i, n);else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (r = (o < 3 ? s(r) : o > 3 ? s(e, i, r) : s(e, i)) || r);
  return o > 3 && r && Object.defineProperty(e, i, r), r;
};

let et = class extends X {
  constructor() {
    super(), this.manifestpath = "manifest.json", this.openmodal = !1, this.hasprompt = !1, this.relatedApps = [], this.explainer = "This app can be installed on your PC or mobile device.  This will allow this web app to look and behave like any other installed app.  You will find it in your app lists and be able to pin it to your home screen, start menus or task bars.  This installed web app will also be able to safely interact with other apps and your operating system. ", this.featuresheader = "Key Features", this.descriptionheader = "Description", this.installbuttontext = "Install", this.cancelbuttontext = "Cancel", this.iosinstallinfotext = "Tap the share button and then 'Add to Homescreen'", this.isSupportingBrowser = window.hasOwnProperty("BeforeInstallPromptEvent"), this.isIOS = navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 2, this.installed = !1, window.addEventListener("beforeinstallprompt", t => this.handleInstallPromptEvent(t)), document.addEventListener("keyup", t => {
      "Escape" === t.key && this.cancel();
    });
  }

  static get styles() {
    return G`:host{--install-focus-color:#919c9c;--install-button-color:#0078d4;--modal-z-index:9999;--background-z-index:9998;--modal-background-color:white}button{outline:0}#installModalWrapper{height:100vh;width:100vw;overflow:auto;position:fixed;bottom:0;top:0;left:0;right:0;z-index:var(--modal-z-index);display:flex;justify-content:center;align-items:center}#descriptionWrapper{margin-bottom:3em}#installModal{position:absolute;background:var(--modal-background-color);font-family:sans-serif;box-shadow:0 25px 26px rgba(32,36,50,.25),0 5px 9px rgba(51,58,83,.53);border-radius:10px;display:flex;flex-direction:column;padding:0;animation-name:opened;animation-duration:150ms;z-index:var(--modal-z-index);max-width:56em}@keyframes opened{from{transform:scale(.8,.8);opacity:.4}to{transform:scale(1,1);opacity:1}}@keyframes mobile{from{opacity:.6}to{opacity:1}}@keyframes fadein{from{opacity:.2}to{opacity:1}}#background{position:fixed;top:0;bottom:0;left:0;right:0;background:#e3e3e3b0;backdrop-filter:blur(5px);z-index:var(--background-z-index);animation-name:fadein;animation-duration:250ms}#headerContainer{display:flex;justify-content:space-between;margin:40px;margin-bottom:32px}#headerContainer h1{font-size:34px;color:#3c3c3c;margin-top:20px;margin-bottom:7px}#headerContainer img{height:122px;width:122px;background:#d3d3d3;border-radius:10px;padding:12px;border-radius:24px;margin-right:24px}#buttonsContainer{display:flex;justify-content:flex-end;position:relative;height:100px;background:#dedede75;width:100%;right:0;border-radius:0 0 12px 12px}#installButton,#installCancelButton,#openButton{text-align:center;align-content:center;align-self:center;vertical-align:middle;justify-self:flex-end;line-height:200%;flex:0 0 auto;display:inline-block;background:#0078d4;color:#fff;cursor:pointer;border:solid 1px transparent;outline:0}#openButton{background:var(--install-button-color)}#openButton:focus{outline:auto;outline:-webkit-focus-ring-color auto 1px}#installButton,#installCancelButton{min-width:130px;margin-right:30px;background:var(--install-button-color);border-radius:20px;font-weight:600;font-size:14px;line-height:21px;padding-top:10px;padding-bottom:9px;padding-left:20px;padding-right:20px;outline:0;color:#fff}#closeButton{background:0 0;border:none;color:#000;padding-left:12px;padding-right:12px;padding-top:4px;padding-bottom:4px;border-radius:20px;font-weight:600;outline:0;cursor:pointer;align-self:self-end}#closeButton:focus,#installButton:focus,#installCancelButton:focus{box-shadow:0 0 0 3px var(--install-focus-color)}#contentContainer{margin-left:40px;margin-right:40px;flex:1}#contentContainer h3{font-size:22px;color:#3c3c3c;margin-bottom:12px}#contentContainer p{font-size:14px;color:#3c3c3c}#featuresScreenDiv{display:flex;justify-content:space-around;align-items:center;margin-right:20px}#featuresScreenDiv h3{font-style:normal;font-weight:600;font-size:22px;line-height:225%;margin-top:0}#keyFeatures{overflow:hidden;padding-right:2em}#keyFeatures ul{padding-inline-start:22px;margin-block-start:12px}#featuresScreenDiv #keyFeatures li{font-style:normal;font-weight:600;font-size:16px;line-height:29px;color:rgba(51,51,51,.72)}#screenshotsContainer{max-height:220px;display:flex;max-width:30em}#screenshotsContainer button{border:none;width:4em;transition:background-color .2s}#screenshotsContainer button:focus,#screenshotsContainer button:hover{background-color:#bbb}#screenshotsContainer button svg{width:28px;fill:#6b6969}#screenshots{display:flex;scroll-snap-type:x mandatory;flex-wrap:wrap;flex-direction:column;overflow-x:scroll;width:22em;max-height:220px;-webkit-overflow-scrolling:touch}#screenshots div{display:flex;align-items:center;justify-content:center;scroll-snap-align:start;height:14em;width:100%;background:#efefef}#screenshots img{height:100%;object-fit:contain}#screenshots::-webkit-scrollbar{display:none}#tagsDiv{margin-top:1em;margin-bottom:1em}#desc{width:100%;max-width:40em;font-size:14px;color:#7e7e7e;text-overflow:ellipsis;overflow:hidden}#logoContainer{display:flex}#tagsDiv span{background:grey;color:#fff;padding-left:12px;padding-right:12px;padding-bottom:4px;font-weight:700;border-radius:24px;margin-right:12px;padding-top:1px}#iosText{color:var(--install-button-color);text-align:center;font-weight:700;position:fixed;bottom:0;left:0;right:0;backdrop-filter:blur(10px);background:rgba(239,239,239,.17);margin:0;padding:2em}#manifest-description{white-space:pre-wrap}@media (max-height:780px){#buttonsContainer{height:70px;background:0 0}}@media (max-width:1220px){#installModal{margin:0;border-radius:0;min-height:100%;width:100%;animation-name:mobile;animation-duration:250ms}#screenshots{justify-content:center}}@media (max-width:962px){#headerContainer h1{margin-top:0;margin-bottom:0}#logoContainer{align-items:center}#desc{display:none}#headerContainer{margin-bottom:24px}#headerContainer img{height:42px;width:42px}}@media (max-width:800px){#background{display:none}#installModal{overflow:scroll;box-shadow:none;max-width:100%;height:100%}#screenshotsContainer{width:100%}#screenshots img{height:180px}#buttonsContainer{display:flex;justify-content:center;bottom:0;margin-bottom:0;border-radius:0;padding-top:1em;padding-bottom:1em}#buttonsContainer #installButton{margin-right:0}#featuresScreenDiv{flex-direction:column;align-items:flex-start;margin-right:0}#headerContainer{margin:20px}#desc{display:none}#contentContainer{margin-left:20px;margin-right:20px;margin-bottom:5em}#headerContainer img{height:60px;width:60px;margin-right:12px}#buttonsContainer{position:fixed;bottom:0;background:#efefef2b;backdrop-filter:blur(10px)}}@media (max-width:400px){#headerContainer h1{font-size:26px}#headerContainer img{height:40px;width:40px}#featuresScreenDiv h3{font-size:18px;margin-bottom:0}#keyFeatures ul{margin-top:0}}@media all and (display-mode:standalone){button{display:none}}@media (prefers-color-scheme:dark){:host{--modal-background-color:black}#featuresScreenDiv #keyFeatures li,#installModal h1,#installModal h2,#installModal h3,#installModal p{color:#fff}#closeButton svg path{fill:#fff;opacity:1}#buttonsContainer{background:rgb(36 36 36)}}@media (inverted-colors:inverted){:host{--install-focus-color:#6e6363;--install-button-color:#ff872b;--modal-background-color:black}#featuresScreenDiv #keyFeatures li,#installModal h1,#installModal h2,#installModal h3,#installModal p{color:#fff}#closeButton svg path{fill:#fff;opacity:1}#buttonsContainer{background:rgb(36 36 36)}}`;
  }

  async firstUpdated() {
    if (this.manifestpath) try {
      await this.getManifestData();
    } catch (t) {
      console.error("Error getting manifest, check that you have a valid web manifest");
    }
    "getInstalledRelatedApps" in navigator && (this.relatedApps = await navigator.getInstalledRelatedApps());
  }

  handleInstallPromptEvent(t) {
    this.deferredprompt = t, this.hasprompt = !0, t.preventDefault();
  }

  checkManifest(t) {
    t.icons && t.icons[0] ? t.name ? t.description || console.error("Your web manifest must have a description listed") : console.error("Your web manifest must have a name listed") : console.error("Your web manifest must have atleast one icon listed");
  }

  async getManifestData() {
    try {
      const t = await fetch(this.manifestpath),
            e = await t.json();
      if (this.manifestdata = e, this.manifestdata) return this.checkManifest(this.manifestdata), e;
    } catch (t) {
      return null;
    }
  }

  scrollToLeft() {
    const t = this.shadowRoot.querySelector("#screenshots");
    t.scrollBy({
      left: -t.clientWidth,
      top: 0,
      behavior: "smooth"
    });
  }

  scrollToRight() {
    const t = this.shadowRoot.querySelector("#screenshots");
    t.scrollBy({
      left: t.clientWidth,
      top: 0,
      behavior: "smooth"
    });
  }

  openPrompt() {
    this.openmodal = !0;
    let t = new CustomEvent("show");
    this.dispatchEvent(t);
  }

  closePrompt() {
    this.openmodal = !1;
    let t = new CustomEvent("hide");
    this.dispatchEvent(t);
  }

  shouldShowInstall() {
    return this.isSupportingBrowser && this.relatedApps.length < 1 && (this.hasprompt || this.isIOS);
  }

  async install() {
    if (this.deferredprompt) {
      this.deferredprompt.prompt();
      let t = new CustomEvent("show");
      this.dispatchEvent(t);

      if ("accepted" === (await this.deferredprompt.userChoice).outcome) {
        await this.cancel(), this.installed = !0;
        let t = new CustomEvent("hide");
        return this.dispatchEvent(t), !0;
      }

      {
        await this.cancel(), this.installed = !0;
        let t = new CustomEvent("hide");
        return this.dispatchEvent(t), !1;
      }
    }
  }

  getInstalledStatus() {
    return navigator.standalone ? navigator.standalone : !!matchMedia("(display-mode: standalone)").matches;
  }

  cancel() {
    return new Promise((t, e) => {
      this.openmodal = !1, this.hasAttribute("openmodal") && this.removeAttribute("openmodal");
      let i = new CustomEvent("hide");
      this.dispatchEvent(i), t();
    });
  }

  render() {
    return O`${"standalone" in navigator && !1 === navigator.standalone || !0 !== this.usecustom && this.shouldShowInstall() && !1 === this.installed ? O`<button part="openButton" id="openButton" @click="${() => this.openPrompt()}"><slot>${this.installbuttontext}</slot></button>` : null} ${!0 === this.openmodal ? O`<div id="installModalWrapper">${this.openmodal ? O`<div id="background" @click="${() => this.cancel()}"></div>` : null}<div id="installModal" part="installModal"><div id="headerContainer"><div id="logoContainer"><img src="${this.iconpath ? this.iconpath : this.manifestdata.icons[0].src}" alt="App Logo"><div id="installTitle"><h1>${this.manifestdata.short_name || this.manifestdata.name}</h1><p id="desc">${this.explainer}</p></div></div><button id="closeButton" @click="${() => this.cancel()}" aria-label="Close"><svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.33" fill-rule="evenodd" clip-rule="evenodd" d="M1.11932 0.357981C1.59693 -0.119327 2.37129 -0.119327 2.8489 0.357981L11.7681 9.27152L20.6873 0.357981C21.165 -0.119327 21.9393 -0.119327 22.4169 0.357981C22.8945 0.835288 22.8945 1.60916 22.4169 2.08646L13.4977 11L22.4169 19.9135C22.8945 20.3908 22.8945 21.1647 22.4169 21.642C21.9393 22.1193 21.165 22.1193 20.6873 21.642L11.7681 12.7285L2.8489 21.642C2.37129 22.1193 1.59693 22.1193 1.11932 21.642C0.641705 21.1647 0.641705 20.3908 1.11932 19.9135L10.0385 11L1.11932 2.08646C0.641705 1.60916 0.641705 0.835288 1.11932 0.357981Z" fill="#60656D"/></svg></button></div><div id="contentContainer"><div id="featuresScreenDiv">${this.manifestdata.features ? O`<div id="keyFeatures"><h3>${this.featuresheader}</h3><ul>${this.manifestdata.features ? this.manifestdata.features.map(t => O`<li>${t}</li>`) : null}</ul></div>` : null} ${this.manifestdata.screenshots ? O`<div id="screenshotsContainer"><button @click="${() => this.scrollToLeft()}" aria-label="previous image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"/></svg></button><section id="screenshots">${this.manifestdata.screenshots.map(t => O`<div><img alt="App Screenshot" src="${t.src}"></div>`)}</section><button @click="${() => this.scrollToRight()}" aria-label="next image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M284.9 412.6l138.1-134c6-5.8 9-13.7 9-22.4v-.4c0-8.7-3-16.6-9-22.4l-138.1-134c-12-12.5-31.3-12.5-43.2 0-11.9 12.5-11.9 32.7 0 45.2l83 79.4h-214c-17 0-30.7 14.3-30.7 32 0 18 13.7 32 30.6 32h214l-83 79.4c-11.9 12.5-11.9 32.7 0 45.2 12 12.5 31.3 12.5 43.3 0z"/></svg></button></div>` : null}</div><div id="descriptionWrapper"><h3>${this.descriptionheader}</h3><p id="manifest-description">${this.manifestdata.description}</p></div></div>${this.isIOS ? O`<p id="iosText">${this.iosinstallinfotext}</p>` : O`<div id="buttonsContainer">${this.deferredprompt ? O`<button id="installButton" @click="${() => this.install()}">${this.installbuttontext} ${this.manifestdata.short_name}</button>` : O`<button @click="${() => this.cancel()}" id="installCancelButton">${this.cancelbuttontext}</button>`}</div>`}</div></div>` : null}`;
  }

};
exports.pwainstall = et;
var it;
tt([J({
  type: String
})], et.prototype, "manifestpath", void 0), tt([J({
  type: String
})], et.prototype, "iconpath", void 0), tt([J({
  type: Object
})], et.prototype, "manifestdata", void 0), tt([J({
  type: Boolean
})], et.prototype, "openmodal", void 0), tt([J({
  type: Boolean
})], et.prototype, "showopen", void 0), tt([J({
  type: Boolean
})], et.prototype, "isSupportingBrowser", void 0), tt([J({
  type: Boolean
})], et.prototype, "isIOS", void 0), tt([J({
  type: Boolean
})], et.prototype, "installed", void 0), tt([J({
  type: Boolean
})], et.prototype, "hasprompt", void 0), tt([J({
  type: Boolean
})], et.prototype, "usecustom", void 0), tt([J({
  type: Array
})], et.prototype, "relatedApps", void 0), tt([J({
  type: String
})], et.prototype, "explainer", void 0), tt([J({
  type: String
})], et.prototype, "featuresheader", void 0), tt([J({
  type: String
})], et.prototype, "descriptionheader", void 0), tt([J({
  type: String
})], et.prototype, "installbuttontext", void 0), tt([J({
  type: String
})], et.prototype, "cancelbuttontext", void 0), tt([J({
  type: String
})], et.prototype, "iosinstallinfotext", void 0), tt([J()], et.prototype, "deferredprompt", void 0), exports.pwainstall = et = tt([(it = "pwa-install", t => "function" == typeof t ? ((t, e) => (window.customElements.define(t, e), e))(it, t) : ((t, e) => {
  const {
    kind: i,
    elements: n
  } = e;
  return {
    kind: i,
    elements: n,

    finisher(e) {
      window.customElements.define(t, e);
    }

  };
})(it, t))], et);
},{}],"sDlwm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pwaupdate = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t = new WeakMap(),
      e = e => "function" == typeof e && t.has(e),
      s = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
      i = (t, e, s = null) => {
  for (; e !== s;) {
    const s = e.nextSibling;
    t.removeChild(e), e = s;
  }
},
      n = {},
      o = {},
      r = `{{lit-${String(Math.random()).slice(2)}}}`,
      a = `\x3c!--${r}--\x3e`,
      l = new RegExp(`${r}|${a}`);

class d {
  constructor(t, e) {
    this.parts = [], this.element = e;
    const s = [],
          i = [],
          n = document.createTreeWalker(e.content, 133, null, !1);
    let o = 0,
        a = -1,
        d = 0;
    const {
      strings: c,
      values: {
        length: f
      }
    } = t;

    for (; d < f;) {
      const t = n.nextNode();

      if (null !== t) {
        if (a++, 1 === t.nodeType) {
          if (t.hasAttributes()) {
            const e = t.attributes,
                  {
              length: s
            } = e;
            let i = 0;

            for (let t = 0; t < s; t++) h(e[t].name, "$lit$") && i++;

            for (; i-- > 0;) {
              const e = c[d],
                    s = u.exec(e)[2],
                    i = s.toLowerCase() + "$lit$",
                    n = t.getAttribute(i);
              t.removeAttribute(i);
              const o = n.split(l);
              this.parts.push({
                type: "attribute",
                index: a,
                name: s,
                strings: o
              }), d += o.length - 1;
            }
          }

          "TEMPLATE" === t.tagName && (i.push(t), n.currentNode = t.content);
        } else if (3 === t.nodeType) {
          const e = t.data;

          if (e.indexOf(r) >= 0) {
            const i = t.parentNode,
                  n = e.split(l),
                  o = n.length - 1;

            for (let e = 0; e < o; e++) {
              let s,
                  o = n[e];
              if ("" === o) s = p();else {
                const t = u.exec(o);
                null !== t && h(t[2], "$lit$") && (o = o.slice(0, t.index) + t[1] + t[2].slice(0, -"$lit$".length) + t[3]), s = document.createTextNode(o);
              }
              i.insertBefore(s, t), this.parts.push({
                type: "node",
                index: ++a
              });
            }

            "" === n[o] ? (i.insertBefore(p(), t), s.push(t)) : t.data = n[o], d += o;
          }
        } else if (8 === t.nodeType) if (t.data === r) {
          const e = t.parentNode;
          null !== t.previousSibling && a !== o || (a++, e.insertBefore(p(), t)), o = a, this.parts.push({
            type: "node",
            index: a
          }), null === t.nextSibling ? t.data = "" : (s.push(t), a--), d++;
        } else {
          let e = -1;

          for (; -1 !== (e = t.data.indexOf(r, e + 1));) this.parts.push({
            type: "node",
            index: -1
          }), d++;
        }
      } else n.currentNode = i.pop();
    }

    for (const t of s) t.parentNode.removeChild(t);
  }

}

const h = (t, e) => {
  const s = t.length - e.length;
  return s >= 0 && t.slice(s) === e;
},
      c = t => -1 !== t.index,
      p = () => document.createComment(""),
      u = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


class f {
  constructor(t, e, s) {
    this.__parts = [], this.template = t, this.processor = e, this.options = s;
  }

  update(t) {
    let e = 0;

    for (const s of this.__parts) void 0 !== s && s.setValue(t[e]), e++;

    for (const t of this.__parts) void 0 !== t && t.commit();
  }

  _clone() {
    const t = s ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
          e = [],
          i = this.template.parts,
          n = document.createTreeWalker(t, 133, null, !1);
    let o,
        r = 0,
        a = 0,
        l = n.nextNode();

    for (; r < i.length;) if (o = i[r], c(o)) {
      for (; a < o.index;) a++, "TEMPLATE" === l.nodeName && (e.push(l), n.currentNode = l.content), null === (l = n.nextNode()) && (n.currentNode = e.pop(), l = n.nextNode());

      if ("node" === o.type) {
        const t = this.processor.handleTextExpression(this.options);
        t.insertAfterNode(l.previousSibling), this.__parts.push(t);
      } else this.__parts.push(...this.processor.handleAttributeExpressions(l, o.name, o.strings, this.options));

      r++;
    } else this.__parts.push(void 0), r++;

    return s && (document.adoptNode(t), customElements.upgrade(t)), t;
  }

}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const m = ` ${r} `;

class g {
  constructor(t, e, s, i) {
    this.strings = t, this.values = e, this.type = s, this.processor = i;
  }

  getHTML() {
    const t = this.strings.length - 1;
    let e = "",
        s = !1;

    for (let i = 0; i < t; i++) {
      const t = this.strings[i],
            n = t.lastIndexOf("\x3c!--");
      s = (n > -1 || s) && -1 === t.indexOf("--\x3e", n + 1);
      const o = u.exec(t);
      e += null === o ? t + (s ? m : a) : t.substr(0, o.index) + o[1] + o[2] + "$lit$" + o[3] + r;
    }

    return e += this.strings[t], e;
  }

  getTemplateElement() {
    const t = document.createElement("template");
    return t.innerHTML = this.getHTML(), t;
  }

}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const _ = t => null === t || !("object" == typeof t || "function" == typeof t),
      y = t => Array.isArray(t) || !(!t || !t[Symbol.iterator]);

class v {
  constructor(t, e, s) {
    this.dirty = !0, this.element = t, this.name = e, this.strings = s, this.parts = [];

    for (let t = 0; t < s.length - 1; t++) this.parts[t] = this._createPart();
  }

  _createPart() {
    return new w(this);
  }

  _getValue() {
    const t = this.strings,
          e = t.length - 1;
    let s = "";

    for (let i = 0; i < e; i++) {
      s += t[i];
      const e = this.parts[i];

      if (void 0 !== e) {
        const t = e.value;
        if (_(t) || !y(t)) s += "string" == typeof t ? t : String(t);else for (const e of t) s += "string" == typeof e ? e : String(e);
      }
    }

    return s += t[e], s;
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }

}

class w {
  constructor(t) {
    this.value = void 0, this.committer = t;
  }

  setValue(t) {
    t === n || _(t) && t === this.value || (this.value = t, e(t) || (this.committer.dirty = !0));
  }

  commit() {
    for (; e(this.value);) {
      const t = this.value;
      this.value = n, t(this);
    }

    this.value !== n && this.committer.commit();
  }

}

class S {
  constructor(t) {
    this.value = void 0, this.__pendingValue = void 0, this.options = t;
  }

  appendInto(t) {
    this.startNode = t.appendChild(p()), this.endNode = t.appendChild(p());
  }

  insertAfterNode(t) {
    this.startNode = t, this.endNode = t.nextSibling;
  }

  appendIntoPart(t) {
    t.__insert(this.startNode = p()), t.__insert(this.endNode = p());
  }

  insertAfterPart(t) {
    t.__insert(this.startNode = p()), this.endNode = t.endNode, t.endNode = this.startNode;
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    for (; e(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = n, t(this);
    }

    const t = this.__pendingValue;
    t !== n && (_(t) ? t !== this.value && this.__commitText(t) : t instanceof g ? this.__commitTemplateResult(t) : t instanceof Node ? this.__commitNode(t) : y(t) ? this.__commitIterable(t) : t === o ? (this.value = o, this.clear()) : this.__commitText(t));
  }

  __insert(t) {
    this.endNode.parentNode.insertBefore(t, this.endNode);
  }

  __commitNode(t) {
    this.value !== t && (this.clear(), this.__insert(t), this.value = t);
  }

  __commitText(t) {
    const e = this.startNode.nextSibling,
          s = "string" == typeof (t = null == t ? "" : t) ? t : String(t);
    e === this.endNode.previousSibling && 3 === e.nodeType ? e.data = s : this.__commitNode(document.createTextNode(s)), this.value = t;
  }

  __commitTemplateResult(t) {
    const e = this.options.templateFactory(t);
    if (this.value instanceof f && this.value.template === e) this.value.update(t.values);else {
      const s = new f(e, t.processor, this.options),
            i = s._clone();

      s.update(t.values), this.__commitNode(i), this.value = s;
    }
  }

  __commitIterable(t) {
    Array.isArray(this.value) || (this.value = [], this.clear());
    const e = this.value;
    let s,
        i = 0;

    for (const n of t) s = e[i], void 0 === s && (s = new S(this.options), e.push(s), 0 === i ? s.appendIntoPart(this) : s.insertAfterPart(e[i - 1])), s.setValue(n), s.commit(), i++;

    i < e.length && (e.length = i, this.clear(s && s.endNode));
  }

  clear(t = this.startNode) {
    i(this.startNode.parentNode, t.nextSibling, this.endNode);
  }

}

class b {
  constructor(t, e, s) {
    if (this.value = void 0, this.__pendingValue = void 0, 2 !== s.length || "" !== s[0] || "" !== s[1]) throw new Error("Boolean attributes can only contain a single expression");
    this.element = t, this.name = e, this.strings = s;
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    for (; e(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = n, t(this);
    }

    if (this.__pendingValue === n) return;
    const t = !!this.__pendingValue;
    this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = t), this.__pendingValue = n;
  }

}

class x extends v {
  constructor(t, e, s) {
    super(t, e, s), this.single = 2 === s.length && "" === s[0] && "" === s[1];
  }

  _createPart() {
    return new P(this);
  }

  _getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }

}

class P extends w {}

let C = !1;

try {
  const t = {
    get capture() {
      return C = !0, !1;
    }

  };
  window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}

class T {
  constructor(t, e, s) {
    this.value = void 0, this.__pendingValue = void 0, this.element = t, this.eventName = e, this.eventContext = s, this.__boundHandleEvent = t => this.handleEvent(t);
  }

  setValue(t) {
    this.__pendingValue = t;
  }

  commit() {
    for (; e(this.__pendingValue);) {
      const t = this.__pendingValue;
      this.__pendingValue = n, t(this);
    }

    if (this.__pendingValue === n) return;
    const t = this.__pendingValue,
          s = this.value,
          i = null == t || null != s && (t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive),
          o = null != t && (null == s || i);
    i && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), o && (this.__options = N(t), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = t, this.__pendingValue = n;
  }

  handleEvent(t) {
    "function" == typeof this.value ? this.value.call(this.eventContext || this.element, t) : this.value.handleEvent(t);
  }

}

const N = t => t && (C ? {
  capture: t.capture,
  passive: t.passive,
  once: t.once
} : t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
;

const E = new class {
  handleAttributeExpressions(t, e, s, i) {
    const n = e[0];

    if ("." === n) {
      return new x(t, e.slice(1), s).parts;
    }

    return "@" === n ? [new T(t, e.slice(1), i.eventContext)] : "?" === n ? [new b(t, e.slice(1), s)] : new v(t, e, s).parts;
  }

  handleTextExpression(t) {
    return new S(t);
  }

}();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

function A(t) {
  let e = k.get(t.type);
  void 0 === e && (e = {
    stringsArray: new WeakMap(),
    keyString: new Map()
  }, k.set(t.type, e));
  let s = e.stringsArray.get(t.strings);
  if (void 0 !== s) return s;
  const i = t.strings.join(r);
  return s = e.keyString.get(i), void 0 === s && (s = new d(t, t.getTemplateElement()), e.keyString.set(i, s)), e.stringsArray.set(t.strings, s), s;
}

const k = new Map(),
      V = new WeakMap();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.1.2");

const O = (t, ...e) => new g(t, e, "html", E)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
;

function U(t, e) {
  const {
    element: {
      content: s
    },
    parts: i
  } = t,
        n = document.createTreeWalker(s, 133, null, !1);
  let o = M(i),
      r = i[o],
      a = -1,
      l = 0;
  const d = [];
  let h = null;

  for (; n.nextNode();) {
    a++;
    const t = n.currentNode;

    for (t.previousSibling === h && (h = null), e.has(t) && (d.push(t), null === h && (h = t)), null !== h && l++; void 0 !== r && r.index === a;) r.index = null !== h ? -1 : r.index - l, o = M(i, o), r = i[o];
  }

  d.forEach(t => t.parentNode.removeChild(t));
}

const R = t => {
  let e = 11 === t.nodeType ? 0 : 1;
  const s = document.createTreeWalker(t, 133, null, !1);

  for (; s.nextNode();) e++;

  return e;
},
      M = (t, e = -1) => {
  for (let s = e + 1; s < t.length; s++) {
    const e = t[s];
    if (c(e)) return s;
  }

  return -1;
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const B = (t, e) => `${t}--${e}`;

let $ = !0;
void 0 === window.ShadyCSS ? $ = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."), $ = !1);

const j = t => e => {
  const s = B(e.type, t);
  let i = k.get(s);
  void 0 === i && (i = {
    stringsArray: new WeakMap(),
    keyString: new Map()
  }, k.set(s, i));
  let n = i.stringsArray.get(e.strings);
  if (void 0 !== n) return n;
  const o = e.strings.join(r);

  if (n = i.keyString.get(o), void 0 === n) {
    const s = e.getTemplateElement();
    $ && window.ShadyCSS.prepareTemplateDom(s, t), n = new d(e, s), i.keyString.set(o, n);
  }

  return i.stringsArray.set(e.strings, n), n;
},
      z = ["html", "svg"],
      q = new Set(),
      F = (t, e, s) => {
  q.add(t);
  const i = s ? s.element : document.createElement("template"),
        n = e.querySelectorAll("style"),
        {
    length: o
  } = n;
  if (0 === o) return void window.ShadyCSS.prepareTemplateStyles(i, t);
  const r = document.createElement("style");

  for (let t = 0; t < o; t++) {
    const e = n[t];
    e.parentNode.removeChild(e), r.textContent += e.textContent;
  }

  (t => {
    z.forEach(e => {
      const s = k.get(B(e, t));
      void 0 !== s && s.keyString.forEach(t => {
        const {
          element: {
            content: e
          }
        } = t,
              s = new Set();
        Array.from(e.querySelectorAll("style")).forEach(t => {
          s.add(t);
        }), U(t, s);
      });
    });
  })(t);

  const a = i.content;
  s ? function (t, e, s = null) {
    const {
      element: {
        content: i
      },
      parts: n
    } = t;
    if (null == s) return void i.appendChild(e);
    const o = document.createTreeWalker(i, 133, null, !1);
    let r = M(n),
        a = 0,
        l = -1;

    for (; o.nextNode();) {
      for (l++, o.currentNode === s && (a = R(e), s.parentNode.insertBefore(e, s)); -1 !== r && n[r].index === l;) {
        if (a > 0) {
          for (; -1 !== r;) n[r].index += a, r = M(n, r);

          return;
        }

        r = M(n, r);
      }
    }
  }(s, r, a.firstChild) : a.insertBefore(r, a.firstChild), window.ShadyCSS.prepareTemplateStyles(i, t);
  const l = a.querySelector("style");
  if (window.ShadyCSS.nativeShadow && null !== l) e.insertBefore(l.cloneNode(!0), e.firstChild);else if (s) {
    a.insertBefore(r, a.firstChild);
    const t = new Set();
    t.add(r), U(s, t);
  }
};

window.JSCompiler_renameProperty = (t, e) => t;

const I = {
  toAttribute(t, e) {
    switch (e) {
      case Boolean:
        return t ? "" : null;

      case Object:
      case Array:
        return null == t ? t : JSON.stringify(t);
    }

    return t;
  },

  fromAttribute(t, e) {
    switch (e) {
      case Boolean:
        return null !== t;

      case Number:
        return null === t ? null : Number(t);

      case Object:
      case Array:
        return JSON.parse(t);
    }

    return t;
  }

},
      W = (t, e) => e !== t && (e == e || t == t),
      L = {
  attribute: !0,
  type: String,
  converter: I,
  reflect: !1,
  hasChanged: W
},
      H = Promise.resolve(!0);

class D extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = H, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
  }

  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this._classProperties.forEach((e, s) => {
      const i = this._attributeNameForProperty(s, e);

      void 0 !== i && (this._attributeToPropertyMap.set(i, s), t.push(i));
    }), t;
  }

  static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = new Map();

      const t = Object.getPrototypeOf(this)._classProperties;

      void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
    }
  }

  static createProperty(t, e = L) {
    if (this._ensureClassProperties(), this._classProperties.set(t, e), e.noAccessor || this.prototype.hasOwnProperty(t)) return;
    const s = "symbol" == typeof t ? Symbol() : `__${t}`;
    Object.defineProperty(this.prototype, t, {
      get() {
        return this[s];
      },

      set(e) {
        const i = this[t];
        this[s] = e, this._requestUpdate(t, i);
      },

      configurable: !0,
      enumerable: !0
    });
  }

  static finalize() {
    const t = Object.getPrototypeOf(this);

    if (t.hasOwnProperty("finalized") || t.finalize(), this.finalized = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map(), this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const t = this.properties,
            e = [...Object.getOwnPropertyNames(t), ...("function" == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t) : [])];

      for (const s of e) this.createProperty(s, t[s]);
    }
  }

  static _attributeNameForProperty(t, e) {
    const s = e.attribute;
    return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0;
  }

  static _valueHasChanged(t, e, s = W) {
    return s(t, e);
  }

  static _propertyValueFromAttribute(t, e) {
    const s = e.type,
          i = e.converter || I,
          n = "function" == typeof i ? i : i.fromAttribute;
    return n ? n(t, s) : t;
  }

  static _propertyValueToAttribute(t, e) {
    if (void 0 === e.reflect) return;
    const s = e.type,
          i = e.converter;
    return (i && i.toAttribute || I.toAttribute)(t, s);
  }

  initialize() {
    this._saveInstanceProperties(), this._requestUpdate();
  }

  _saveInstanceProperties() {
    this.constructor._classProperties.forEach((t, e) => {
      if (this.hasOwnProperty(e)) {
        const t = this[e];
        delete this[e], this._instanceProperties || (this._instanceProperties = new Map()), this._instanceProperties.set(e, t);
      }
    });
  }

  _applyInstanceProperties() {
    this._instanceProperties.forEach((t, e) => this[e] = t), this._instanceProperties = void 0;
  }

  connectedCallback() {
    this._updateState = 32 | this._updateState, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
  }

  disconnectedCallback() {}

  attributeChangedCallback(t, e, s) {
    e !== s && this._attributeToProperty(t, s);
  }

  _propertyToAttribute(t, e, s = L) {
    const i = this.constructor,
          n = i._attributeNameForProperty(t, s);

    if (void 0 !== n) {
      const t = i._propertyValueToAttribute(e, s);

      if (void 0 === t) return;
      this._updateState = 8 | this._updateState, null == t ? this.removeAttribute(n) : this.setAttribute(n, t), this._updateState = -9 & this._updateState;
    }
  }

  _attributeToProperty(t, e) {
    if (8 & this._updateState) return;

    const s = this.constructor,
          i = s._attributeToPropertyMap.get(t);

    if (void 0 !== i) {
      const t = s._classProperties.get(i) || L;
      this._updateState = 16 | this._updateState, this[i] = s._propertyValueFromAttribute(e, t), this._updateState = -17 & this._updateState;
    }
  }

  _requestUpdate(t, e) {
    let s = !0;

    if (void 0 !== t) {
      const i = this.constructor,
            n = i._classProperties.get(t) || L;
      i._valueHasChanged(this[t], e, n.hasChanged) ? (this._changedProperties.has(t) || this._changedProperties.set(t, e), !0 !== n.reflect || 16 & this._updateState || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(t, n))) : s = !1;
    }

    !this._hasRequestedUpdate && s && this._enqueueUpdate();
  }

  requestUpdate(t, e) {
    return this._requestUpdate(t, e), this.updateComplete;
  }

  async _enqueueUpdate() {
    let t, e;
    this._updateState = 4 | this._updateState;
    const s = this._updatePromise;
    this._updatePromise = new Promise((s, i) => {
      t = s, e = i;
    });

    try {
      await s;
    } catch (t) {}

    this._hasConnected || (await new Promise(t => this._hasConnectedResolver = t));

    try {
      const t = this.performUpdate();
      null != t && (await t);
    } catch (t) {
      e(t);
    }

    t(!this._hasRequestedUpdate);
  }

  get _hasConnected() {
    return 32 & this._updateState;
  }

  get _hasRequestedUpdate() {
    return 4 & this._updateState;
  }

  get hasUpdated() {
    return 1 & this._updateState;
  }

  performUpdate() {
    this._instanceProperties && this._applyInstanceProperties();
    let t = !1;
    const e = this._changedProperties;

    try {
      t = this.shouldUpdate(e), t && this.update(e);
    } catch (e) {
      throw t = !1, e;
    } finally {
      this._markUpdated();
    }

    t && (1 & this._updateState || (this._updateState = 1 | this._updateState, this.firstUpdated(e)), this.updated(e));
  }

  _markUpdated() {
    this._changedProperties = new Map(), this._updateState = -5 & this._updateState;
  }

  get updateComplete() {
    return this._getUpdateComplete();
  }

  _getUpdateComplete() {
    return this._updatePromise;
  }

  shouldUpdate(t) {
    return !0;
  }

  update(t) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)), this._reflectingProperties = void 0);
  }

  updated(t) {}

  firstUpdated(t) {}

}

D.finalized = !0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const J = (t, e) => "method" === e.kind && e.descriptor && !("value" in e.descriptor) ? Object.assign({}, e, {
  finisher(s) {
    s.createProperty(e.key, t);
  }

}) : {
  kind: "field",
  key: Symbol(),
  placement: "own",
  descriptor: {},

  initializer() {
    "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
  },

  finisher(s) {
    s.createProperty(e.key, t);
  }

};

function G(t) {
  return (e, s) => void 0 !== s ? ((t, e, s) => {
    e.constructor.createProperty(s, t);
  })(t, e, s) : J(t, e);
}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/


const K = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      Y = Symbol();

class Z {
  constructor(t, e) {
    if (e !== Y) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t;
  }

  get styleSheet() {
    return void 0 === this._styleSheet && (K ? (this._styleSheet = new CSSStyleSheet(), this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
  }

  toString() {
    return this.cssText;
  }

}

const Q = (t, ...e) => {
  const s = e.reduce((e, s, i) => e + (t => {
    if (t instanceof Z) return t.cssText;
    if ("number" == typeof t) return t;
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(s) + t[i + 1], t[0]);
  return new Z(s, Y);
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


(window.litElementVersions || (window.litElementVersions = [])).push("2.2.1");

const X = t => t.flat ? t.flat(1 / 0) : function t(e, s = []) {
  for (let i = 0, n = e.length; i < n; i++) {
    const n = e[i];
    Array.isArray(n) ? t(n, s) : s.push(n);
  }

  return s;
}(t);

class tt extends D {
  static finalize() {
    super.finalize.call(this), this._styles = this.hasOwnProperty(JSCompiler_renameProperty("styles", this)) ? this._getUniqueStyles() : this._styles || [];
  }

  static _getUniqueStyles() {
    const t = this.styles,
          e = [];

    if (Array.isArray(t)) {
      X(t).reduceRight((t, e) => (t.add(e), t), new Set()).forEach(t => e.unshift(t));
    } else t && e.push(t);

    return e;
  }

  initialize() {
    super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }

  createRenderRoot() {
    return this.attachShadow({
      mode: "open"
    });
  }

  adoptStyles() {
    const t = this.constructor._styles;
    0 !== t.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? K ? this.renderRoot.adoptedStyleSheets = t.map(t => t.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t => t.cssText), this.localName));
  }

  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }

  update(t) {
    super.update(t);
    const e = this.render();
    e instanceof g && this.constructor.render(e, this.renderRoot, {
      scopeName: this.localName,
      eventContext: this
    }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(t => {
      const e = document.createElement("style");
      e.textContent = t.cssText, this.renderRoot.appendChild(e);
    }));
  }

  render() {}

}

tt.finalized = !0, tt.render = (t, e, s) => {
  if (!s || "object" != typeof s || !s.scopeName) throw new Error("The `scopeName` option is required.");
  const n = s.scopeName,
        o = V.has(e),
        r = $ && 11 === e.nodeType && !!e.host,
        a = r && !q.has(n),
        l = a ? document.createDocumentFragment() : e;

  if (((t, e, s) => {
    let n = V.get(e);
    void 0 === n && (i(e, e.firstChild), V.set(e, n = new S(Object.assign({
      templateFactory: A
    }, s))), n.appendInto(e)), n.setValue(t), n.commit();
  })(t, l, Object.assign({
    templateFactory: j(n)
  }, s)), a) {
    const t = V.get(l);
    V.delete(l);
    const s = t.value instanceof f ? t.value.template : void 0;
    F(n, l, s), i(e, e.firstChild), e.appendChild(l), V.set(e, t);
  }

  !o && r && window.ShadyCSS.styleElement(e.host);
};

var et = function (t, e, s, i) {
  var n,
      o = arguments.length,
      r = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, s) : i;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, s, i);else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (r = (o < 3 ? n(r) : o > 3 ? n(e, s, r) : n(e, s)) || r);
  return o > 3 && r && Object.defineProperty(e, s, r), r;
};

let st = class extends tt {
  constructor() {
    super(...arguments), this.swpath = "pwabuilder-sw.js", this.updateevent = "SKIP_WAITING", this.updatemessage = "An update for this app is available", this.readyToAsk = !1, this.showStorageEstimate = !1, this.showOfflineToast = !1, this.offlineToastDuration = 2400, this.storageUsed = null;
  }

  static get styles() {
    return Q`:host{font-family:sans-serif;--toast-background:#3c3c3c;--button-background:#0b0b0b}#updateToast{position:fixed;bottom:16px;right:16px;background:var(--toast-background);color:#fff;padding:1em;border-radius:4px;display:flex;align-items:center;justify-content:space-between;min-width:22em;font-weight:600;animation-name:fadein;animation-duration:.3s}#storageToast{position:fixed;bottom:16px;right:16px;background:var(--toast-background);color:#fff;padding:1em;border-radius:4px;display:flex;flex-direction:column;align-items:flex-end;font-weight:600}#storageEstimate{font-size:10px;margin-top:8px}#updateToast button{color:#fff;border:none;background:var(--button-background);padding:8px;border-radius:24px;text-transform:lowercase;padding-left:14px;padding-right:14px;font-weight:700}@keyframes fadein{from{opacity:0}to{opacity:1}}`;
  }

  async firstUpdated() {
    if (this.swpath && "serviceWorker" in navigator) {
      const t = await navigator.serviceWorker.register(this.swpath);

      if (t.installing && navigator.storage) {
        const t = await navigator.storage.estimate();

        if (t) {
          this.storageUsed = this.formatBytes(t.usage), this.showOfflineToast = !0, await this.updateComplete;
          const e = this.shadowRoot.querySelector("#storageToast").animate([{
            opacity: 0
          }, {
            opacity: 1
          }], {
            fill: "forwards",
            duration: 280
          });
          setTimeout(async () => {
            e.onfinish = () => {
              this.showOfflineToast = !1;
            }, await e.reverse();
          }, this.offlineToastDuration);
        }
      }

      t.onupdatefound = async () => {
        let e = t.installing;

        e.onstatechange = () => {
          "installed" === e.state && this.dispatchEvent(new Event("pwaUpdate"));
        };
      };
    }

    this.setupEvents();
  }

  setupEvents() {
    this.addEventListener("pwaUpdate", async () => {
      navigator.serviceWorker && (this.swreg = await navigator.serviceWorker.getRegistration(), this.swreg && this.swreg.waiting && (this.readyToAsk = !0));
    });
  }

  doUpdate() {
    this.swreg.waiting.postMessage({
      type: this.updateevent
    }), window.location.reload();
  }

  formatBytes(t, e = 2) {
    if (0 === t) return "0 Bytes";
    const s = e < 0 ? 0 : e,
          i = Math.floor(Math.log(t) / Math.log(1024));
    return parseFloat((t / Math.pow(1024, i)).toFixed(s)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
  }

  render() {
    return O`<div>${this.readyToAsk ? O`<div id=updateToast part=updateToast><span>${this.updatemessage}</span> <button @click=${() => this.doUpdate()}>Update</button></div>` : null} ${this.showOfflineToast ? O`<div id=storageToast part=offlineToast>Ready to use Offline ${this.showStorageEstimate ? O`<span id=storageEstimate>Cached ${this.storageUsed}</span>` : null}</div>` : null}</div>`;
  }

};
exports.pwaupdate = st;
var it;
et([G({
  type: String
})], st.prototype, "swpath", void 0), et([G({
  type: String
})], st.prototype, "updateevent", void 0), et([G({
  type: String
})], st.prototype, "updatemessage", void 0), et([G({
  type: Boolean
})], st.prototype, "readyToAsk", void 0), et([G({
  type: Boolean
})], st.prototype, "showStorageEstimate", void 0), et([G({
  type: Boolean
})], st.prototype, "showOfflineToast", void 0), et([G({
  type: Number
})], st.prototype, "offlineToastDuration", void 0), et([G({
  type: String
})], st.prototype, "storageUsed", void 0), exports.pwaupdate = st = et([(it = "pwa-update", t => "function" == typeof t ? ((t, e) => (window.customElements.define(t, e), e))(it, t) : ((t, e) => {
  const {
    kind: s,
    elements: i
  } = e;
  return {
    kind: s,
    elements: i,

    finisher(e) {
      window.customElements.define(t, e);
    }

  };
})(it, t))], st);
},{}]},{},["6QUtJ","57NIz"], "57NIz", "parcelRequiree3fa")

//# sourceMappingURL=index.f339b113.js.map
