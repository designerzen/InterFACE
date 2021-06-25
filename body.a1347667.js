!function(e,t,n,r){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o="function"==typeof i.parcelRequire&&i.parcelRequire,a="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function s(n,r){if(!t[n]){if(!e[n]){var i="function"==typeof parcelRequire&&parcelRequire;if(!r&&i)return i(n,!0);if(o)return o(n,!0);if(a&&"string"==typeof n)return a(n);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}c.resolve=function(t){return e[n][1][t]||t},c.cache={};var u=t[n]=new s.Module(n);e[n][0].call(u.exports,c,u,u.exports,this)}return t[n].exports;function c(e){return s(c.resolve(e))}}s.isParcelRequire=!0,s.Module=function(e){this.id=e,this.bundle=s,this.exports={}},s.modules=e,s.cache=t,s.parent=o,s.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},i.parcelRequire=s;for(var l=0;l<n.length;l++)s(n[l]);if(n.length){var u=s(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof define&&define.amd&&define((function(){return u}))}}({"410ef9c154a1514e5d94d04516f72291":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.loadBodyModel=void 0,e("@tensorflow/tfjs-backend-webgl");var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=o();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}n.default=e,t&&t.set(e,n);return n}(e("@tensorflow-models/pose-detection")),i=(e("../maths/maths"),e("@tensorflow/tfjs"));function o(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return o=function(){return e},e}n.loadBodyModel=async(e,t)=>{await(0,i.ready)();const n=t.maxFaces,o=await r.createDetector(r.SupportedModels.MoveNet),a=async(t,r,i=null)=>{if(!i||i()){const t=await o.estimatePoses(e),i=Math.min(n,t.length);r(t.length?t.slice(0,i):[])}t&&requestAnimationFrame(()=>a(t,r,i))};return a}},{"@tensorflow/tfjs-backend-webgl":"abfbe74d3d522a5e5f1cac93e34baf43","@tensorflow-models/pose-detection":"c28bf1a3b1fed1bd5b28c4827f370586","../maths/maths":"ce2f8ad85ead883d6119bddf22ec8710","@tensorflow/tfjs":"7d98cbcf2543b02520fe8a05f4058784"}],c28bf1a3b1fed1bd5b28c4827f370586:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./create_detector");n.createDetector=r.createDetector,function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(e("./types"));var i=e("./util");n.util=i;var o={keypointsToNormalizedKeypoints:e("./calculators/keypoints_to_normalized_keypoints").keypointsToNormalizedKeypoints};n.calculators=o;var a=e("./movenet/constants"),s={modelType:{SINGLEPOSE_LIGHTNING:a.SINGLEPOSE_LIGHTNING,SINGLEPOSE_THUNDER:a.SINGLEPOSE_THUNDER}};n.movenet=s},{"./create_detector":"1ecec2e5ef78b405a932ba597213bf19","./types":"21cb1b02f10468e03f42b263c7e622c6","./util":"e210d29b6b99f07b54658e3a7f21e2ba","./calculators/keypoints_to_normalized_keypoints":"08c93e0eb136deb038a71dac422c55ab","./movenet/constants":"e59a422da8ac97baaafb459a7cec288f"}],"1ecec2e5ef78b405a932ba597213bf19":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("./blazepose_mediapipe/detector"),a=e("./blazepose_tfjs/detector"),s=e("./movenet/detector"),l=e("./posenet/detector"),u=e("./types");n.createDetector=function(e,t){return r(this,void 0,void 0,(function(){var n,r;return i(this,(function(i){switch(e){case u.SupportedModels.PoseNet:return[2,l.load(t)];case u.SupportedModels.BlazePose:if(r=void 0,null!=(n=t)){if("tfjs"===n.runtime)return[2,a.load(t)];if("mediapipe"===n.runtime)return[2,o.load(t)];r=n.runtime}throw new Error("Expect modelConfig.runtime to be either 'tfjs' or 'mediapipe', but got "+r);case u.SupportedModels.MoveNet:return[2,s.load(t)];default:throw new Error(e+" is not a supported model name.")}return[2]}))}))}},{"./blazepose_mediapipe/detector":"ad6215a8779248ed06e81f6edbb55f77","./blazepose_tfjs/detector":"be0595db8602d187fed0ca4c0bf7c8eb","./movenet/detector":"c7fe595941a1f2e6e5a82f41ea4ee545","./posenet/detector":"d7160f853cb81d3725e04ec4e25b96b1","./types":"21cb1b02f10468e03f42b263c7e622c6"}],ad6215a8779248ed06e81f6edbb55f77:[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var o=e("@mediapipe/pose"),a=e("./detector_utils"),s=function(){function e(e){var t,n=this;switch(this.width=0,this.height=0,this.selfieMode=!1,this.poseSolution=new o.Pose({locateFile:function(t,n){return e.solutionPath?e.solutionPath.replace(/\/+$/,"")+"/"+t:n+"/"+t}}),e.modelType){case"lite":t=0;break;case"heavy":t=2;break;case"full":default:t=1}this.poseSolution.setOptions({modelComplexity:t,smoothLandmarks:e.enableSmoothing||!0,selfieMode:this.selfieMode}),this.poseSolution.onResults((function(e){n.height=e.image.height,n.width=e.image.width,n.poses=n.translateOutputs(e)}))}return e.prototype.translateOutputs=function(e){var t=this;return null!=e.poseLandmarks?[{keypoints:e.poseLandmarks.map((function(e){return{x:e.x*t.width,y:e.y*t.height,z:e.z,score:e.visibility}}))}]:[]},e.prototype.estimatePoses=function(e,t,n){return r(this,void 0,void 0,(function(){return i(this,(function(r){switch(r.label){case 0:return t&&t.flipHorizontal&&t.flipHorizontal!==this.selfieMode&&(this.selfieMode=t.flipHorizontal,this.poseSolution.setOptions({selfieMode:this.selfieMode})),[4,this.poseSolution.send({image:e},n)];case 1:return r.sent(),[2,this.poses]}}))}))},e.prototype.dispose=function(){this.poseSolution.close()},e.prototype.reset=function(){this.poseSolution.reset()},e.prototype.initialize=function(){return this.poseSolution.initialize()},e}();n.load=function(e){return r(this,void 0,void 0,(function(){var t,n;return i(this,(function(r){switch(r.label){case 0:return t=a.validateModelConfig(e),[4,(n=new s(t)).initialize()];case 1:return r.sent(),[2,n]}}))}))}},{"@mediapipe/pose":"b771f7731ab5f63671a78a473328d4b8","./detector_utils":"8db87d893a6c7e1297256e56d04fe2c7"}],b771f7731ab5f63671a78a473328d4b8:[function(e,t,n){var r=arguments[3];(function(){"use strict";var e;function t(e){var t=0;return function(){return t<e.length?{done:!1,value:e[t++]}:{done:!0}}}var n="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};var i,o=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof r&&r];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);function a(e,t){if(t)e:{var r=o;e=e.split(".");for(var i=0;i<e.length-1;i++){var a=e[i];if(!(a in r))break e;r=r[a]}(t=t(i=r[e=e[e.length-1]]))!=i&&null!=t&&n(r,e,{configurable:!0,writable:!0,value:t})}}function s(e){return(e={next:e})[Symbol.iterator]=function(){return this},e}function l(e){var n="undefined"!=typeof Symbol&&Symbol.iterator&&e[Symbol.iterator];return n?n.call(e):{next:t(e)}}function u(e){if(!(e instanceof Array)){e=l(e);for(var t,n=[];!(t=e.next()).done;)n.push(t.value);e=n}return e}if(a("Symbol",(function(e){function t(e,t){this.g=e,n(this,"description",{configurable:!0,writable:!0,value:t})}if(e)return e;t.prototype.toString=function(){return this.g};var r="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",i=0;return function e(n){if(this instanceof e)throw new TypeError("Symbol is not a constructor");return new t(r+(n||"")+"_"+i++,n)}})),a("Symbol.iterator",(function(e){if(e)return e;e=Symbol("Symbol.iterator");for(var r="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),i=0;i<r.length;i++){var a=o[r[i]];"function"==typeof a&&"function"!=typeof a.prototype[e]&&n(a.prototype,e,{configurable:!0,writable:!0,value:function(){return s(t(this))}})}return e})),"function"==typeof Object.setPrototypeOf)i=Object.setPrototypeOf;else{var c;e:{var f={};try{f.__proto__={a:!0},c=f.a;break e}catch(e){}c=!1}i=c?function(e,t){if(e.__proto__=t,e.__proto__!==t)throw new TypeError(e+" is not extensible");return e}:null}var h=i;function d(){this.l=!1,this.h=null,this.i=void 0,this.g=1,this.s=this.m=0,this.j=null}function p(e){if(e.l)throw new TypeError("Generator is already running");e.l=!0}function _(e,t){e.j={O:t,P:!0},e.g=e.m||e.s}function b(e,t,n){return e.g=n,{value:t}}function y(e){this.g=new d,this.h=e}function g(e,t,n,r){try{var i=t.call(e.g.h,n);if(!(i instanceof Object))throw new TypeError("Iterator result "+i+" is not an object");if(!i.done)return e.g.l=!1,i;var o=i.value}catch(t){return e.g.h=null,_(e.g,t),m(e)}return e.g.h=null,r.call(e.g,o),m(e)}function m(e){for(;e.g.g;)try{var t=e.h(e.g);if(t)return e.g.l=!1,{value:t.value,done:!1}}catch(t){e.g.i=void 0,_(e.g,t)}if(e.g.l=!1,e.g.j){if(t=e.g.j,e.g.j=null,t.P)throw t.O;return{value:t.return,done:!0}}return{value:void 0,done:!0}}function v(e){this.next=function(t){return p(e.g),e.g.h?t=g(e,e.g.h.next,t,e.g.o):(e.g.o(t),t=m(e)),t},this.throw=function(t){return p(e.g),e.g.h?t=g(e,e.g.h.throw,t,e.g.o):(_(e.g,t),t=m(e)),t},this.return=function(t){return function(e,t){p(e.g);var n=e.g.h;return n?g(e,"return"in n?n.return:function(e){return{value:e,done:!0}},t,e.g.return):(e.g.return(t),m(e))}(e,t)},this[Symbol.iterator]=function(){return this}}function E(e,t){return t=new v(new y(t)),h&&e.prototype&&h(t,e.prototype),t}d.prototype.o=function(e){this.i=e},d.prototype.return=function(e){this.j={return:e},this.g=this.s};var O="function"==typeof Object.assign?Object.assign:function(e,t){for(var n=1;n<arguments.length;n++){var r=arguments[n];if(r)for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e};a("Object.assign",(function(e){return e||O})),a("Promise",(function(e){function t(e){this.h=0,this.i=void 0,this.g=[],this.o=!1;var t=this.j();try{e(t.resolve,t.reject)}catch(e){t.reject(e)}}function n(){this.g=null}function r(e){return e instanceof t?e:new t((function(t){t(e)}))}if(e)return e;n.prototype.h=function(e){if(null==this.g){this.g=[];var t=this;this.i((function(){t.l()}))}this.g.push(e)};var i=o.setTimeout;n.prototype.i=function(e){i(e,0)},n.prototype.l=function(){for(;this.g&&this.g.length;){var e=this.g;this.g=[];for(var t=0;t<e.length;++t){var n=e[t];e[t]=null;try{n()}catch(e){this.j(e)}}}this.g=null},n.prototype.j=function(e){this.i((function(){throw e}))},t.prototype.j=function(){function e(e){return function(r){n||(n=!0,e.call(t,r))}}var t=this,n=!1;return{resolve:e(this.v),reject:e(this.l)}},t.prototype.v=function(e){if(e===this)this.l(new TypeError("A Promise cannot resolve to itself"));else if(e instanceof t)this.G(e);else{e:switch(typeof e){case"object":var n=null!=e;break e;case"function":n=!0;break e;default:n=!1}n?this.u(e):this.m(e)}},t.prototype.u=function(e){var t=void 0;try{t=e.then}catch(e){return void this.l(e)}"function"==typeof t?this.H(t,e):this.m(e)},t.prototype.l=function(e){this.s(2,e)},t.prototype.m=function(e){this.s(1,e)},t.prototype.s=function(e,t){if(0!=this.h)throw Error("Cannot settle("+e+", "+t+"): Promise already settled in state"+this.h);this.h=e,this.i=t,2===this.h&&this.A(),this.D()},t.prototype.A=function(){var e=this;i((function(){if(e.F()){var t=o.console;void 0!==t&&t.error(e.i)}}),1)},t.prototype.F=function(){if(this.o)return!1;var e=o.CustomEvent,t=o.Event,n=o.dispatchEvent;return void 0===n||("function"==typeof e?e=new e("unhandledrejection",{cancelable:!0}):"function"==typeof t?e=new t("unhandledrejection",{cancelable:!0}):(e=o.document.createEvent("CustomEvent")).initCustomEvent("unhandledrejection",!1,!0,e),e.promise=this,e.reason=this.i,n(e))},t.prototype.D=function(){if(null!=this.g){for(var e=0;e<this.g.length;++e)a.h(this.g[e]);this.g=null}};var a=new n;return t.prototype.G=function(e){var t=this.j();e.I(t.resolve,t.reject)},t.prototype.H=function(e,t){var n=this.j();try{e.call(t,n.resolve,n.reject)}catch(e){n.reject(e)}},t.prototype.then=function(e,n){function r(e,t){return"function"==typeof e?function(t){try{i(e(t))}catch(e){o(e)}}:t}var i,o,a=new t((function(e,t){i=e,o=t}));return this.I(r(e,i),r(n,o)),a},t.prototype.catch=function(e){return this.then(void 0,e)},t.prototype.I=function(e,t){function n(){switch(r.h){case 1:e(r.i);break;case 2:t(r.i);break;default:throw Error("Unexpected state: "+r.h)}}var r=this;null==this.g?a.h(n):this.g.push(n),this.o=!0},t.resolve=r,t.reject=function(e){return new t((function(t,n){n(e)}))},t.race=function(e){return new t((function(t,n){for(var i=l(e),o=i.next();!o.done;o=i.next())r(o.value).I(t,n)}))},t.all=function(e){var n=l(e),i=n.next();return i.done?r([]):new t((function(e,t){function o(t){return function(n){a[t]=n,0==--s&&e(a)}}var a=[],s=0;do{a.push(void 0),s++,r(i.value).I(o(a.length-1),t),i=n.next()}while(!i.done)}))},t})),a("Array.prototype.keys",(function(e){return e||function(){return function(e,t){e instanceof String&&(e+="");var n=0,r=!1,i={next:function(){if(!r&&n<e.length){var i=n++;return{value:t(i,e[i]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}(this,(function(e){return e}))}}));var w=this||self;function S(e,t){e=e.split(".");var n,r=w;e[0]in r||void 0===r.execScript||r.execScript("var "+e[0]);for(;e.length&&(n=e.shift());)e.length||void 0===t?r=r[n]&&r[n]!==Object.prototype[n]?r[n]:r[n]={}:r[n]=t}function T(e,t){var n=void 0;return new(n||(n=Promise))((function(r,i){function o(e){try{s(t.next(e))}catch(e){i(e)}}function a(e){try{s(t.throw(e))}catch(e){i(e)}}function s(e){e.done?r(e.value):new n((function(t){t(e.value)})).then(o,a)}s((t=t.apply(e,void 0)).next())}))}function I(e,t,n){if(n=e.createShader(0===n?e.VERTEX_SHADER:e.FRAGMENT_SHADER),e.shaderSource(n,t),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS))throw Error("Could not compile WebGL shader.\n\n"+e.getShaderInfoLog(n));return n}function x(e,t){this.g=e,this.i=t,this.j=0}function M(e,t){var n=e.i;if(void 0===e.l){var r=I(n,"\n  attribute vec2 aVertex;\n  attribute vec2 aTex;\n  varying vec2 vTex;\n  void main(void) {\n    gl_Position = vec4(aVertex, 0.0, 1.0);\n    vTex = aTex;\n  }",0),i=I(n,"\n  precision highp float;\n  varying vec2 vTex;\n  uniform sampler2D sampler0;\n  void main(){\n    gl_FragColor = texture2D(sampler0, vTex);\n  }",1),o=n.createProgram();if(n.attachShader(o,r),n.attachShader(o,i),n.linkProgram(o),!n.getProgramParameter(o,n.LINK_STATUS))throw Error("Could not compile WebGL program.\n\n"+n.getProgramInfoLog(o));r=e.l=o,n.useProgram(r),i=n.getUniformLocation(r,"sampler0"),e.h={C:n.getAttribLocation(r,"aVertex"),B:n.getAttribLocation(r,"aTex"),S:i},e.o=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,e.o),n.enableVertexAttribArray(e.h.C),n.vertexAttribPointer(e.h.C,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),e.m=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,e.m),n.enableVertexAttribArray(e.h.B),n.vertexAttribPointer(e.h.B,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),n.uniform1i(i,0)}r=e.h,n.useProgram(e.l),n.canvas.width=t.width,n.canvas.height=t.height,n.viewport(0,0,t.width,t.height),n.activeTexture(n.TEXTURE0),e.g.bindTexture2d(t.glName),n.enableVertexAttribArray(r.C),n.bindBuffer(n.ARRAY_BUFFER,e.o),n.vertexAttribPointer(r.C,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(r.B),n.bindBuffer(n.ARRAY_BUFFER,e.m),n.vertexAttribPointer(r.B,2,n.FLOAT,!1,0,0),n.bindFramebuffer(n.DRAW_FRAMEBUFFER?n.DRAW_FRAMEBUFFER:n.FRAMEBUFFER,null),n.drawArrays(n.TRIANGLE_FAN,0,4),n.disableVertexAttribArray(r.C),n.disableVertexAttribArray(r.B),n.bindBuffer(n.ARRAY_BUFFER,null),e.g.bindTexture2d(0)}function N(e){this.g=e}var P=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]);function L(e,t){return t+e}function R(e,t){window[e]=t}function A(e){for(var t=[],n=e.size(),r=0;r<n;++r){var i=e.get(r);t.push({x:i.x,y:i.y,z:i.z,visibility:i.hasVisibility?i.visibility:void 0})}return t}function C(e){for(var t=[],n=e.size(),r=0;r<n;++r){var i=e.get(r);t.push({index:i.index,score:i.score,label:i.hasLabel?i.label:void 0,displayName:i.hasDisplayName?i.displayName:void 0})}return t}function F(e){if(this.g=e,this.listeners={},this.o={},this.F={},this.l={},this.m={},this.s=this.G=!0,this.A=Promise.resolve(),this.locateFile=e&&e.locateFile||L,"object"==typeof window)e=window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/";else{if("undefined"==typeof location)throw Error("solutions can only be loaded on a web page or in a web worker");e=location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/"}this.H=e}function k(e){return T(e,(function e(){var t,n,r,i,o,a,s,c,f,h,d,p,_,y,g=this;return E(e,(function(e){switch(e.g){case 1:return t=g,g.G?(n=function(e,t){return void 0===e.g.files?[]:"function"==typeof e.g.files?e.g.files(t):e.g.files}(g,g.o),b(e,function(){return T(this,(function e(){return E(e,(function(e){switch(e.g){case 1:return e.m=2,b(e,WebAssembly.instantiate(P),4);case 4:e.g=3,e.m=0;break;case 2:return e.m=0,e.j=null,e.return(!1);case 3:return e.return(!0)}}))}))}(),2)):e.return();case 2:if(r=e.i,"object"==typeof window)return R("createMediapipeSolutionsWasm",{locateFile:g.locateFile}),R("createMediapipeSolutionsPackedAssets",{locateFile:g.locateFile}),a=n.filter((function(e){return void 0!==e.data})),s=n.filter((function(e){return void 0===e.data})),c=Promise.all(a.map((function(e){return T(t,(function t(){var n=this;return E(t,(function(t){return b(t,D(n,e.url),0)}))}))}))),f=Promise.all(s.map((function(e){return void 0===e.simd||e.simd&&r||!e.simd&&!r?function(e){var t=document.createElement("script");return t.setAttribute("src",e),t.setAttribute("crossorigin","anonymous"),document.body.appendChild(t),new Promise((function(e){t.addEventListener("load",(function(){e()}),!1)}))}(t.locateFile(e.url,t.H)):Promise.resolve()}))).then((function(){return T(t,(function e(){var t,n,r=this;return E(e,(function(e){if(1==e.g)return t=window.createMediapipeSolutionsWasm,n=window.createMediapipeSolutionsPackedAssets,b(e,t(n),2);r.h=e.i,e.g=0}))}))})),h=T(t,(function e(){var t=this;return E(e,(function(e){return t.g.graph&&t.g.graph.url?e=b(e,D(t,t.g.graph.url),0):(e.g=0,e=void 0),e}))})),b(e,Promise.all([f,c,h]),7);if("function"!=typeof importScripts)throw Error("solutions can only be loaded on a web page or in a web worker");return i=n.filter((function(e){return void 0===e.simd||e.simd&&r||!e.simd&&!r})).map((function(e){return t.locateFile(e.url,t.H)})),importScripts.apply(null,u(i)),b(e,createMediapipeSolutionsWasm(Module),6);case 6:g.h=e.i,g.j=new OffscreenCanvas(1,1),g.h.canvas=g.j,o=g.h.GL.createContext(g.j,{antialias:!1,alpha:!1,R:"undefined"!=typeof WebGL2RenderingContext?2:1}),g.h.GL.makeContextCurrent(o),e.g=4;break;case 7:g.j=document.createElement("canvas"),g.h.canvas=g.j,g.h.createContext(g.j,!0,!0,{});case 4:if(g.i=new g.h.SolutionWasm,!g.g.graph||!g.g.graph.url){e.g=8;break}return b(e,D(g,g.g.graph.url),9);case 9:d=e.i,g.i.loadGraph(d);case 8:if(g.g.listeners)for(p=l(g.g.listeners),_=p.next();!_.done;_=p.next())y=_.value,G(g,y);g.G=!1,e.g=0}}))}))}function D(e,t){return T(e,(function e(){var n,r,i=this;return E(e,(function(e){return t in i.F?e.return(i.F[t]):(n=i.locateFile(t,""),r=fetch(n).then((function(e){return e.arrayBuffer()})),i.F[t]=r,e.return(r))}))}))}function j(e,t,n){if(n.isNumber())return n.getNumber();if(n.isRect())return n.getRect();if(n.isLandmarks())return n.getLandmarks();if(n.isLandmarksList())return n.getLandmarksList();if(n.isClassificationsList())return n.getClassificationsList();if(n.isObjectDetectionList())return n.getObjectDetectionList();if(n.isTexture2d()){var r=e.m[t];return r||(r=new x(e.h,e.D),e.m[t]=r),M(e=r,n=n.getTexture2d()),e.i.canvas}}function G(e,t){for(var n=t.name||"$",r=[].concat(u(t.wants)),i=new e.h.StringList,o=l(t.wants),a=o.next();!a.done;a=o.next())i.push_back(a.value);o=e.h.PacketListener.implement({onResults:function(i){return T(e,(function e(){var o,a,s,u,c,f=this;return E(e,(function(e){if(1==e.g){for(o={},a=0;a<t.wants.length;++a)o[r[a]]=i.get(a);var h;if(h=t.outs){for(var d={},p=l(Object.keys(h)),_=p.next();!_.done;_=p.next()){var y=h[_=_.value];if("string"==typeof y)d[_]=j(f,_,o[y]);else{var g=o[y.stream];if(void 0!==g){if("detection_list"===y.type){var m=g.getRectList(),v=g.getLandmarksList();g=g.getClassificationsList();var E=[];if(m)for(var O=0;O<m.size();++O){var w={N:m.get(O),M:A(v.get(O)),L:C(g.get(O))};E.push(w)}d[_]=E}else if("landmarks"===y.type)m=g.getLandmarks(),d[_]=m?A(m):void 0;else if("landmarks_list"===y.type){if(m=g.getLandmarksList()){for(v=[],g=m.size(),E=0;E<g;++E)O=m.get(E),v.push(A(O));m=v}else m=void 0;d[_]=m}else if("rect_list"===y.type){if(m=g.getRectList()){for(v=[],g=m.size(),E=0;E<g;++E)O=m.get(E),v.push(O);m=v}else m=void 0;d[_]=m}else if("classifications_list"===y.type){if(m=g.getClassificationsList()){for(v=[],g=m.size(),E=0;E<g;++E)O=m.get(E),v.push(C(O));m=v}else m=void 0;d[_]=m}else if("object_detection_list"===y.type){if(m=g.getObjectDetectionList()){for(v=[],g=m.size(),E=0;E<g;++E){var S=m.get(E);w=(O=v).push;for(var T=S.id,I=S.keypoints,N=[],P=I.size(),L=0;L<P;++L){var R=I.get(L);N.push({id:R.id,point3d:{x:R.point3d.x,y:R.point3d.y,z:R.point3d.z},point2d:{x:R.point2d.x,y:R.point2d.y,depth:R.point2d.depth}})}w.call(O,{id:T,keypoints:N,visibility:S.visibility})}m=v}else m=void 0;d[_]=m}else{if("texture"!==y.type)throw Error("Unknown output config type: '"+y.type+"'");(m=f.m[_])||(m=new x(f.h,f.D),f.m[_]=m),M(m,v=g.getTexture2d()),d[_]=m.i.canvas}y.transform&&d[_]&&(d[_]=y.transform(d[_]))}}}h=d}else h=o;return s=h,(u=f.listeners[n])?e=b(e,f.A,3):(e.g=0,e=void 0),e}if(c=u(s))return f.A=c,e.return(c);e.g=0}))}))}}),e.i.attachMultiListener(i,o),i.delete()}function B(e){switch(void 0===e&&(e=0),e){case 1:return"pose_landmark_full.tflite";case 2:return"pose_landmark_heavy.tflite";default:return"pose_landmark_lite.tflite"}}function U(e){var t=this;e=e||{},this.g=new F({locateFile:e.locateFile,files:function(e){return[{url:"pose_solution_packed_assets_loader.js"},{simd:!1,url:"pose_solution_wasm_bin.js"},{simd:!0,url:"pose_solution_simd_wasm_bin.js"},{data:!0,url:B(e.modelComplexity)}]},graph:{url:"pose_web.binarypb"},listeners:[{wants:["pose_landmarks","image_transformed"],outs:{image:"image_transformed",poseLandmarks:{type:"landmarks",stream:"pose_landmarks"}}}],inputs:{image:{type:"video",stream:"input_frames_gpu"}},options:{selfieMode:{type:1,graphOptionXref:{calculatorType:"GlScalerCalculator",calculatorIndex:1,fieldName:"flip_horizontal"}},modelComplexity:{type:0,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorModelComplexity",fieldName:"int_value"},onChange:function(e){return T(t,(function t(){var n,r,i,o=this;return E(t,(function(t){return 1==t.g?(n=B(e),r="third_party/mediapipe/modules/pose_landmark/"+n,b(t,D(o.g,n),2)):(i=t.i,o.g.overrideFile(r,i),t.return(!0))}))}))}},smoothLandmarks:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorSmoothLandmarks",fieldName:"bool_value"}},minDetectionConfidence:{type:0,graphOptionXref:{calculatorType:"TensorsToDetectionsCalculator",calculatorName:"poselandmarkgpu__posedetectiongpu__TensorsToDetectionsCalculator",fieldName:"min_score_thresh"}},minTrackingConfidence:{type:0,graphOptionXref:{calculatorType:"ThresholdingCalculator",calculatorName:"poselandmarkgpu__poselandmarkbyroigpu__ThresholdingCalculator",fieldName:"threshold"}}}})}(e=F.prototype).close=function(){return this.i&&this.i.delete(),Promise.resolve()},e.reset=function(){return T(this,(function e(){var t=this;return E(e,(function(e){t.i&&(t.i.reset(),t.l={},t.m={}),e.g=0}))}))},e.setOptions=function(e){var t=this;if(this.g.options){for(var n=[],r=[],i={},o=l(Object.keys(e)),a=o.next();!a.done;i={J:i.J,K:i.K},a=o.next()){var s=a.value;(!(s in this.o)||this.o[s]!==e[s])&&(this.o[s]=e[s],a=this.g.options[s])&&(a.onChange&&(i.J=a.onChange,i.K=e[s],n.push(function(e){return function(){return T(t,(function t(){var n=this;return E(t,(function(t){if(1==t.g)return b(t,e.J(e.K),2);!0===t.i&&(n.s=!0),t.g=0}))}))}}(i))),a.graphOptionXref&&(s={valueNumber:0===a.type?e[s]:0,valueBoolean:1===a.type&&e[s]},a=Object.assign(Object.assign(Object.assign({},{calculatorName:"",calculatorIndex:0}),a.graphOptionXref),s),r.push(a)))}0===n.length&&0===r.length||(this.s=!0,this.u=r,this.v=n)}},e.initialize=function(){return T(this,(function e(){var t=this;return E(e,(function(e){return 1==e.g?b(e,k(t),2):b(e,T(t,(function e(){var t,n,r,i,o,a,s,u=this;return E(e,(function(e){switch(e.g){case 1:if(!u.s)return e.return();if(!(t=u.j.getContext("webgl2"))&&!(t=u.j.getContext("webgl")))return alert("Failed to create WebGL canvas context when passing video frame."),e.return();if(u.D=t,!u.v){e.g=2;break}n=l(u.v),r=n.next();case 3:if(r.done){e.g=5;break}return b(e,(0,r.value)(),4);case 4:r=n.next(),e.g=3;break;case 5:u.v=void 0;case 2:if(u.u){for(i=new u.h.GraphOptionChangeRequestList,o=l(u.u),a=o.next();!a.done;a=o.next())s=a.value,i.push_back(s);u.i.changeOptions(i),i.delete(),u.u=void 0}u.s=!1,e.g=0}}))})),0)}))}))},e.overrideFile=function(e,t){this.i.overrideFile(e,t)},e.clearOverriddenFiles=function(){this.i.clearOverriddenFiles()},e.send=function(e,t){return T(this,(function n(){var r,i,o,a,s,u,c,f,h,d=this;return E(n,(function(n){if(1==n.g)return d.g.inputs?(r=1e3*(null==t?performance.now():t),b(n,d.A,2)):n.return();if(3!=n.g)return b(n,d.initialize(),3);for(i=new d.h.PacketDataList,o=l(Object.keys(e)),a=o.next();!a.done;a=o.next())if(s=a.value,u=d.g.inputs[s]){e:{var p=d,_=e[s];switch(u.type){case"video":var y=p.l[u.stream];if(y||(y=new x(p.h,p.D),p.l[u.stream]=y),0===(p=y).j&&(p.j=p.g.createTexture()),"undefined"!=typeof HTMLVideoElement&&_ instanceof HTMLVideoElement){var g=_.videoWidth;y=_.videoHeight}else"undefined"!=typeof HTMLImageElement&&_ instanceof HTMLImageElement?(g=_.naturalWidth,y=_.naturalHeight):(g=_.width,y=_.height);y={glName:p.j,width:g,height:y},(g=p.i).canvas.width=y.width,g.canvas.height=y.height,g.activeTexture(g.TEXTURE0),p.g.bindTexture2d(p.j),g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,_),p.g.bindTexture2d(0),p=y;break e;case"detections":for((y=p.l[u.stream])||(y=new N(p.h),p.l[u.stream]=y),(p=y).data||(p.data=new p.g.DetectionListData),p.data.reset(_.length),y=0;y<_.length;++y){if(g=_[y],p.data.setBoundingBox(y,g.N),g.M)for(var m=0;m<g.M.length;++m){var v=g.M[m],E=!!v.visibility;p.data.addNormalizedLandmark(y,Object.assign(Object.assign({},v),{hasVisibility:E,visibility:E?v.visibility:0}))}if(g.L)for(m=0;m<g.L.length;++m){E=!!(v=g.L[m]).index;var O=!!v.label,w=!!v.displayName;p.data.addClassification(y,{score:v.score,hasIndex:E,index:E?v.index:-1,hasLabel:O,label:O?v.label:"",hasDisplayName:w,displayName:w?v.displayName:""})}}p=p.data;break e;default:p={}}}switch(c=p,f=u.stream,u.type){case"video":i.pushTexture2d(Object.assign(Object.assign({},c),{stream:f,timestamp:r}));break;case"detections":(h=c).stream=f,h.timestamp=r,i.pushDetectionList(h);break;default:throw Error("Unknown input config type: '"+u.type+"'")}}d.i.send(i),i.delete(),n.g=0}))}))},e.onResults=function(e,t){this.listeners[t||"$"]=e},S("Solution",F),S("OptionType",{NUMBER:0,BOOL:1,0:"NUMBER",1:"BOOL"}),(e=U.prototype).reset=function(){this.g.reset()},e.close=function(){return this.g.close(),Promise.resolve()},e.onResults=function(e){this.g.onResults(e)},e.initialize=function(){return T(this,(function e(){var t=this;return E(e,(function(e){return b(e,t.g.initialize(),0)}))}))},e.send=function(e,t){return T(this,(function n(){var r=this;return E(n,(function(n){return b(n,r.g.send(e,t),0)}))}))},e.setOptions=function(e){this.g.setOptions(e)},S("Pose",U),S("POSE_CONNECTIONS",[[0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]]),S("POSE_LANDMARKS",{NOSE:0,LEFT_EYE_INNER:1,LEFT_EYE:2,LEFT_EYE_OUTER:3,RIGHT_EYE_INNER:4,RIGHT_EYE:5,RIGHT_EYE_OUTER:6,LEFT_EAR:7,RIGHT_EAR:8,LEFT_RIGHT:9,RIGHT_LEFT:10,LEFT_SHOULDER:11,RIGHT_SHOULDER:12,LEFT_ELBOW:13,RIGHT_ELBOW:14,LEFT_WRIST:15,RIGHT_WRIST:16,LEFT_PINKY:17,RIGHT_PINKY:18,LEFT_INDEX:19,RIGHT_INDEX:20,LEFT_THUMB:21,RIGHT_THUMB:22,LEFT_HIP:23,RIGHT_HIP:24,LEFT_KNEE:25,RIGHT_KNEE:26,LEFT_ANKLE:27,RIGHT_ANKLE:28,LEFT_HEEL:29,RIGHT_HEEL:30,LEFT_FOOT_INDEX:31,RIGHT_FOOT_INDEX:32}),S("POSE_LANDMARKS_LEFT",{LEFT_EYE_INNER:1,LEFT_EYE:2,LEFT_EYE_OUTER:3,LEFT_EAR:7,LEFT_RIGHT:9,LEFT_SHOULDER:11,LEFT_ELBOW:13,LEFT_WRIST:15,LEFT_PINKY:17,LEFT_INDEX:19,LEFT_THUMB:21,LEFT_HIP:23,LEFT_KNEE:25,LEFT_ANKLE:27,LEFT_HEEL:29,LEFT_FOOT_INDEX:31}),S("POSE_LANDMARKS_RIGHT",{RIGHT_EYE_INNER:4,RIGHT_EYE:5,RIGHT_EYE_OUTER:6,RIGHT_EAR:8,RIGHT_LEFT:10,RIGHT_SHOULDER:12,RIGHT_ELBOW:14,RIGHT_WRIST:16,RIGHT_PINKY:18,RIGHT_INDEX:20,RIGHT_THUMB:22,RIGHT_HIP:24,RIGHT_KNEE:26,RIGHT_ANKLE:28,RIGHT_HEEL:30,RIGHT_FOOT_INDEX:32}),S("POSE_LANDMARKS_NEUTRAL",{NOSE:0})}).call(this)},{}],"8db87d893a6c7e1297256e56d04fe2c7":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("./constants");n.validateModelConfig=function(e){if(null==e)return r({},i.DEFAULT_BLAZEPOSE_MODEL_CONFIG);var t=r({},e);return t.runtime="mediapipe",null==t.enableSmoothing&&(t.enableSmoothing=i.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing),null==t.modelType&&(t.modelType=i.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType),t},n.validateEstimationConfig=function(e){if(null==e)return r({},i.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG);var t=r({},e);if(null==t.maxPoses&&(t.maxPoses=1),t.maxPoses<=0)throw new Error("Invalid maxPoses "+t.maxPoses+". Should be > 0.");if(t.maxPoses>1)throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");return null==t.flipHorizontal&&(t.flipHorizontal=i.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG.flipHorizontal),t}},{"./constants":"3d1fb26c26a85c233974543ca76ff36f"}],"3d1fb26c26a85c233974543ca76ff36f":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.DEFAULT_BLAZEPOSE_MODEL_CONFIG={runtime:"mediapipe",enableSmoothing:!0,modelType:"full"},n.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG={maxPoses:1,flipHorizontal:!1}},{}],be0595db8602d187fed0ca4c0bf7c8eb:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("@tensorflow/tfjs-converter"),a=e("@tensorflow/tfjs-core"),s=e("../calculators/constants"),l=e("../calculators/convert_image_to_tensor"),u=e("../calculators/image_utils"),c=e("../calculators/is_video"),f=e("../calculators/keypoints_smoothing"),h=e("../calculators/normalized_keypoints_to_keypoints"),d=e("../calculators/shift_image_value"),p=e("./calculators/calculate_alignment_points_rects"),_=e("./calculators/calculate_landmark_projection"),b=e("./calculators/create_ssd_anchors"),y=e("./calculators/detector_inference"),g=e("./calculators/landmarks_to_detection"),m=e("./calculators/non_max_suppression"),v=e("./calculators/refine_landmarks_from_heatmap"),E=e("./calculators/remove_detection_letterbox"),O=e("./calculators/remove_landmark_letterbox"),w=e("./calculators/tensors_to_detections"),S=e("./calculators/tensors_to_landmarks"),T=e("./calculators/transform_rect"),I=e("./calculators/visibility_smoothing"),x=e("./constants"),M=e("./detector_utils"),N=function(){function e(e,t,n,r){this.detectorModel=e,this.landmarkModel=t,this.enableSmoothing=n,this.modelType=r,this.regionOfInterest=null,this.anchors=b.createSsdAnchors(x.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);var i=a.tensor1d(this.anchors.map((function(e){return e.width}))),o=a.tensor1d(this.anchors.map((function(e){return e.height}))),s=a.tensor1d(this.anchors.map((function(e){return e.xCenter}))),l=a.tensor1d(this.anchors.map((function(e){return e.yCenter})));this.anchorTensor={x:s,y:l,w:i,h:o}}return e.prototype.estimatePoses=function(e,t,n){return r(this,void 0,void 0,(function(){var r,o,l,f,d,p,_,b,y,g,m,v,E,O,w;return i(this,(function(i){switch(i.label){case 0:return r=M.validateEstimationConfig(t),null==e?(this.reset(),[2,[]]):(this.maxPoses=r.maxPoses,this.timestamp=null!=n?n*s.MILLISECOND_TO_MICRO_SECONDS:c.isVideo(e)?e.currentTime*s.SECOND_TO_MICRO_SECONDS:null,o=u.getImageSize(e),l=a.tidy((function(){return a.cast(u.toImageTensor(e),"float32")})),null!=(f=this.regionOfInterest)?[3,2]:[4,this.detectPose(l)]);case 1:if(0===(d=i.sent()).length)return this.reset(),l.dispose(),[2,[]];p=d[0],f=this.poseDetectionToRoi(p,o),i.label=2;case 2:return[4,this.poseLandmarksByRoi(f,l)];case 3:return _=i.sent(),l.dispose(),null==_?(this.reset(),[2,[]]):(b=_.actualLandmarks,y=_.auxiliaryLandmarks,g=_.poseScore,m=this.poseLandmarkFiltering(b,y,o),v=m.actualLandmarksFiltered,E=m.auxiliaryLandmarksFiltered,O=this.poseLandmarksToRoi(E,o),this.regionOfInterest=O,w=null!=v?h.normalizedKeypointsToKeypoints(v,o):null,[2,[{score:g,keypoints:w}]])}}))}))},e.prototype.dispose=function(){this.detectorModel.dispose(),this.landmarkModel.dispose(),a.dispose([this.anchorTensor.x,this.anchorTensor.y,this.anchorTensor.w,this.anchorTensor.h])},e.prototype.reset=function(){this.regionOfInterest=null,this.visibilitySmoothingFilterActual=null,this.visibilitySmoothingFilterAuxiliary=null,this.landmarksSmoothingFilterActual=null,this.landmarksSmoothingFilterAuxiliary=null},e.prototype.detectPose=function(e){return r(this,void 0,void 0,(function(){var t,n,r,o,s,u,c,f,h,p;return i(this,(function(i){switch(i.label){case 0:return t=l.convertImageToTensor(e,x.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG),n=t.imageTensor,r=t.padding,o=d.shiftImageValue(n,[-1,1]),s=y.detectorInference(o,this.detectorModel),u=s.boxes,c=s.scores,[4,w.tensorsToDetections([c,u],this.anchorTensor,x.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION)];case 1:return f=i.sent(),[4,m.nonMaxSuppression(f,this.maxPoses,x.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minSuppressionThreshold,x.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minScoreThreshold)];case 2:return h=i.sent(),p=E.removeDetectionLetterbox(h,r),a.dispose([n,o,c,u]),[2,p]}}))}))},e.prototype.poseDetectionToRoi=function(e,t){var n=p.calculateAlignmentPointsRects(e,t,{rotationVectorEndKeypointIndex:1,rotationVectorStartKeypointIndex:0,rotationVectorTargetAngleDegree:90});return T.transformNormalizedRect(n,t,x.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG)},e.prototype.poseLandmarksByRoi=function(e,t){return r(this,void 0,void 0,(function(){var n,r,o,s,u,c,f,h,p,b,y,g,m,E,w;return i(this,(function(i){switch(i.label){case 0:switch(n=l.convertImageToTensor(t,x.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG,e),r=n.imageTensor,o=n.padding,s=d.shiftImageValue(r,[0,1]),u=this.landmarkModel.predict(s),this.modelType){case"lite":c=u[3],f=u[4],h=u[1];break;case"full":c=u[4],f=u[3],h=u[1];break;case"heavy":c=u[3],f=u[1],h=u[4];break;default:throw new Error("Model type must be one of lite, full or heavy,but got "+this.modelType)}return[4,f.data()];case 1:return(p=i.sent()[0])<x.BLAZEPOSE_POSE_PRESENCE_SCORE?(a.dispose(u),a.dispose([r,s]),[2,null]):[4,S.tensorsToLandmarks(c,x.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG)];case 2:return b=i.sent(),[4,v.refineLandmarksFromHeatmap(b,h,x.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG)];case 3:return y=i.sent(),g=O.removeLandmarkLetterbox(y,o),m=_.calculateLandmarkProjection(g,e),E=m.slice(0,x.BLAZEPOSE_NUM_KEYPOINTS),w=m.slice(x.BLAZEPOSE_NUM_KEYPOINTS,x.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS),a.dispose(u),a.dispose([r,s]),[2,{actualLandmarks:E,auxiliaryLandmarks:w,poseScore:p}]}}))}))},e.prototype.poseLandmarksToRoi=function(e,t){var n=g.landmarksToDetection(e),r=p.calculateAlignmentPointsRects(n,t,{rotationVectorStartKeypointIndex:0,rotationVectorEndKeypointIndex:1,rotationVectorTargetAngleDegree:90});return T.transformNormalizedRect(r,t,x.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG)},e.prototype.poseLandmarkFiltering=function(e,t,n){var r,i;return null!=this.timestamp&&this.enableSmoothing?(null==this.visibilitySmoothingFilterActual&&(this.visibilitySmoothingFilterActual=new I.LowPassVisibilityFilter(x.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG)),r=this.visibilitySmoothingFilterActual.apply(e),null==this.visibilitySmoothingFilterAuxiliary&&(this.visibilitySmoothingFilterAuxiliary=new I.LowPassVisibilityFilter(x.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG)),i=this.visibilitySmoothingFilterAuxiliary.apply(t),null==this.landmarksSmoothingFilterActual&&(this.landmarksSmoothingFilterActual=new f.KeypointsSmoothingFilter(x.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL)),r=this.landmarksSmoothingFilterActual.apply(r,this.timestamp,n,!0),null==this.landmarksSmoothingFilterAuxiliary&&(this.landmarksSmoothingFilterAuxiliary=new f.KeypointsSmoothingFilter(x.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY)),i=this.landmarksSmoothingFilterAuxiliary.apply(i,this.timestamp,n,!0)):(r=e,i=t),{actualLandmarksFiltered:r,auxiliaryLandmarksFiltered:i}},e}();n.load=function(e){return r(this,void 0,void 0,(function(){var t,n,r,a;return i(this,(function(i){switch(i.label){case 0:return t=M.validateModelConfig(e),[4,Promise.all([o.loadGraphModel(t.detectorModelUrl),o.loadGraphModel(t.landmarkModelUrl)])];case 1:return n=i.sent(),r=n[0],a=n[1],[2,new N(r,a,t.enableSmoothing,t.modelType)]}}))}))}},{"@tensorflow/tfjs-converter":"8560db211e8586507d186920da41a1f7","@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","../calculators/constants":"b2a1418f82e95c63d4d5447f855b9d86","../calculators/convert_image_to_tensor":"164be0f53e35af0a61c7318f977a06ec","../calculators/image_utils":"8e8b1aa998d37ce4749a59496f1fbeac","../calculators/is_video":"0ad66c5a3e52c0ecb3b9fa2b815e338a","../calculators/keypoints_smoothing":"aec1bad22d18ea9e5fa8c0e66f885ea7","../calculators/normalized_keypoints_to_keypoints":"8c0a1b326a98896bfad027b9ad4fdd7a","../calculators/shift_image_value":"3e11a20dd3c5eab027d098ce14d31803","./calculators/calculate_alignment_points_rects":"611e96f08a1ee1827575f4255d65ac65","./calculators/calculate_landmark_projection":"fba0119daa7dcff8f8a260fa4afb18fa","./calculators/create_ssd_anchors":"f7803629ce13409b2e94c98ea746289b","./calculators/detector_inference":"3505a9f6fcc51590f49fb2061919cf45","./calculators/landmarks_to_detection":"fa38b77e9139cfe417e008d917c4f7bc","./calculators/non_max_suppression":"581a782b3c222a42ae610a2df9a4568c","./calculators/refine_landmarks_from_heatmap":"0ed93933ae43fddc888b6878170c148d","./calculators/remove_detection_letterbox":"54e35aac509d1ea0e0652e5a088fa3bb","./calculators/remove_landmark_letterbox":"760e667465b4f96d625babf7e4625da4","./calculators/tensors_to_detections":"809bd74c12363d1412cadb7befc0a371","./calculators/tensors_to_landmarks":"96649d618524e600c50f90853e1fe9e8","./calculators/transform_rect":"1eff654caf497c1aa2018a12a00df81e","./calculators/visibility_smoothing":"a8be41cb348c9e3c0ec3eed9d1b187ab","./constants":"1926e0dec784d6c59fbe9eb63ed929e1","./detector_utils":"027e1ecb82fc6c461e525b1f5e6195d9"}],b2a1418f82e95c63d4d5447f855b9d86:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
n.MICRO_SECONDS_TO_SECOND=1e-6,n.SECOND_TO_MICRO_SECONDS=1e6,n.MILLISECOND_TO_MICRO_SECONDS=1e3},{}],"164be0f53e35af0a61c7318f977a06ec":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("@tensorflow/tfjs-core"),i=e("./image_utils");n.convertImageToTensor=function(e,t,n){var o=t.inputResolution,a=t.keepAspectRatio,s=i.getImageSize(e),l=i.getRoi(s,n),u=i.padRoi(l,o,a);return{imageTensor:r.tidy((function(){var t=i.toImageTensor(e),n=r.tensor2d(i.getProjectiveTransformMatrix(l,s,!1,o),[1,8]);return r.image.transform(r.expandDims(r.cast(t,"float32")),n,"bilinear","nearest",0,[o.height,o.width])})),padding:u}}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","./image_utils":"8e8b1aa998d37ce4749a59496f1fbeac"}],"8e8b1aa998d37ce4749a59496f1fbeac":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("@tensorflow/tfjs-core");function i(e,t){r.util.assert(0!==e.width,(function(){return t+" width cannot be 0."})),r.util.assert(0!==e.height,(function(){return t+" height cannot be 0."}))}n.getImageSize=function(e){return e instanceof r.Tensor?{height:e.shape[0],width:e.shape[1]}:{height:e.height,width:e.width}},n.normalizeRadians=function(e){return e-2*Math.PI*Math.floor((e+Math.PI)/(2*Math.PI))},n.transformValueRange=function(e,t,n,r){var i=t-e,o=r-n;if(0===i)throw new Error("Original min and max are both "+e+", range cannot be 0.");var a=o/i;return{scale:a,offset:n-e*a}},n.toImageTensor=function(e){return e instanceof r.Tensor?e:r.browser.fromPixels(e)},n.padRoi=function(e,t,n){if(void 0===n&&(n=!1),!n)return{top:0,left:0,right:0,bottom:0};var r=t.height,o=t.width;i(t,"targetSize"),i(e,"roi");var a,s,l=r/o,u=e.height/e.width,c=0,f=0;return l>u?(a=e.width,s=e.width*l,f=(1-u/l)/2):(a=e.height/l,s=e.height,c=(1-l/u)/2),e.width=a,e.height=s,{top:f,left:c,right:c,bottom:f}},n.getRoi=function(e,t){return t?{xCenter:t.xCenter*e.width,yCenter:t.yCenter*e.height,width:t.width*e.width,height:t.height*e.height,rotation:t.rotation}:{xCenter:.5*e.width,yCenter:.5*e.height,width:e.width,height:e.height,rotation:0}},n.getProjectiveTransformMatrix=function(e,t,n,r){i(r,"inputResolution");var o=1/t.width,a=1/t.height,s=e.xCenter,l=e.yCenter,u=Math.cos(e.rotation),c=Math.sin(e.rotation),f=n?-1:1,h=e.width,d=e.height;return[1/r.width*h*u*f*o*t.width,1/r.height*-d*c*o*t.width,(-.5*h*u*f+.5*d*c+s)*o*t.width,1/r.width*h*c*f*a*t.height,1/r.height*d*u*a*t.height,(-.5*d*u-.5*h*c*f+l)*a*t.height,0,0]}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b"}],"0ad66c5a3e52c0ecb3b9fa2b815e338a":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.isVideo=function(e){return null!=e&&null!=e.currentTime}},{}],aec1bad22d18ea9e5fa8c0e66f885ea7:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r=e("./keypoints_one_euro_filter"),i=e("./keypoints_to_normalized_keypoints"),o=e("./keypoints_velocity_filter"),a=e("./normalized_keypoints_to_keypoints"),s=function(){function e(e){if(null!=e.velocityFilter)this.keypointsFilter=new o.KeypointsVelocityFilter(e.velocityFilter);else{if(null==e.oneEuroFilter)throw new Error("Either configure velocityFilter or oneEuroFilter, but got "+e+".");this.keypointsFilter=new r.KeypointsOneEuroFilter(e.oneEuroFilter)}}return e.prototype.apply=function(e,t,n,r){if(void 0===r&&(r=!1),null==e)return this.keypointsFilter.reset(),null;var o=r?a.normalizedKeypointsToKeypoints(e,n):e,s=this.keypointsFilter.apply(o,t);return r?i.keypointsToNormalizedKeypoints(s,n):s},e}();n.KeypointsSmoothingFilter=s},{"./keypoints_one_euro_filter":"9d03078a252de1e20f9c71c3b5f70575","./keypoints_to_normalized_keypoints":"08c93e0eb136deb038a71dac422c55ab","./keypoints_velocity_filter":"87ac82b743f4a2e3ea9d2273e75b8d23","./normalized_keypoints_to_keypoints":"8c0a1b326a98896bfad027b9ad4fdd7a"}],"9d03078a252de1e20f9c71c3b5f70575":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("./one_euro_filter"),o=e("./velocity_filter_utils"),a=function(){function e(e){this.config=e}return e.prototype.apply=function(e,t){var n=this;if(null==e)return this.reset(),null;this.initializeFiltersIfEmpty(e);var i=1;if(null!=this.config.minAllowedObjectScale){var a=o.getObjectScale(e);if(a<this.config.minAllowedObjectScale)return e.slice();i=1/a}return e.map((function(e,o){var a=r({},e,{x:n.xFilters[o].apply(e.x,t,i),y:n.yFilters[o].apply(e.y,t,i)});return null!=e.z&&(a.z=n.zFilters[o].apply(e.z,t,i)),a}))},e.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},e.prototype.initializeFiltersIfEmpty=function(e){var t=this;null!=this.xFilters&&this.xFilters.length===e.length||(this.xFilters=e.map((function(e){return new i.OneEuroFilter(t.config)})),this.yFilters=e.map((function(e){return new i.OneEuroFilter(t.config)})),this.zFilters=e.map((function(e){return new i.OneEuroFilter(t.config)})))},e}();n.KeypointsOneEuroFilter=a},{"./one_euro_filter":"b6eaea4adfe7818394da8ae9b8619c6f","./velocity_filter_utils":"70beb6a9494fc8ae5a519f3a3b865d63"}],b6eaea4adfe7818394da8ae9b8619c6f:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("./constants"),i=e("./low_pass_filter"),o=function(){function e(e){this.frequency=e.frequency,this.minCutOff=e.minCutOff,this.beta=e.beta,this.thresholdCutOff=e.thresholdCutOff,this.thresholdBeta=e.thresholdBeta,this.derivateCutOff=e.derivateCutOff,this.x=new i.LowPassFilter(this.getAlpha(this.minCutOff)),this.dx=new i.LowPassFilter(this.getAlpha(this.derivateCutOff)),this.lastTimestamp=0}return e.prototype.apply=function(e,t,n){if(null==e)return e;var i=Math.trunc(t);if(this.lastTimestamp>=i)return e;0!==this.lastTimestamp&&0!==i&&(this.frequency=1/((i-this.lastTimestamp)*r.MICRO_SECONDS_TO_SECOND)),this.lastTimestamp=i;var o=this.x.hasLastRawValue()?(e-this.x.lastRawValue())*n*this.frequency:0,a=this.dx.applyWithAlpha(o,this.getAlpha(this.derivateCutOff)),s=this.minCutOff+this.beta*Math.abs(a),l=null!=this.thresholdCutOff?this.thresholdCutOff+this.thresholdBeta*Math.abs(a):null;return this.x.applyWithAlpha(e,this.getAlpha(s),l)},e.prototype.getAlpha=function(e){return 1/(1+this.frequency/(2*Math.PI*e))},e}();n.OneEuroFilter=o},{"./constants":"b2a1418f82e95c63d4d5447f855b9d86","./low_pass_filter":"a963802666be9bfaae53a7ca04666f91"}],a963802666be9bfaae53a7ca04666f91:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=function(){function e(e){this.alpha=e,this.initialized=!1}return e.prototype.apply=function(e,t){var n;return this.initialized?n=null==t?this.storedValue+this.alpha*(e-this.storedValue):this.storedValue+this.alpha*t*Math.asinh((e-this.storedValue)/t):(n=e,this.initialized=!0),this.rawValue=e,this.storedValue=n,n},e.prototype.applyWithAlpha=function(e,t,n){return this.alpha=t,this.apply(e,n)},e.prototype.hasLastRawValue=function(){return this.initialized},e.prototype.lastRawValue=function(){return this.rawValue},e.prototype.reset=function(){this.initialized=!1},e}();n.LowPassFilter=r},{}],"70beb6a9494fc8ae5a519f3a3b865d63":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.getObjectScale=function(e){var t=e.map((function(e){return e.x})),n=Math.min.apply(Math,t),r=Math.max.apply(Math,t),i=e.map((function(e){return e.y})),o=Math.min.apply(Math,i);return(r-n+(Math.max.apply(Math,i)-o))/2}},{}],"08c93e0eb136deb038a71dac422c55ab":[function(e,t,n){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0}),n.keypointsToNormalizedKeypoints=function(e,t){return e.map((function(e){var n=r({},e,{x:e.x/t.width,y:e.y/t.height});return null!=e.z&&(e.z=e.z/t.width),n}))}},{}],"87ac82b743f4a2e3ea9d2273e75b8d23":[function(e,t,n){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("./relative_velocity_filter"),o=e("./velocity_filter_utils"),a=function(){function e(e){this.config=e}return e.prototype.apply=function(e,t){var n=this;if(null==e)return this.reset(),null;var i=1;if(!this.config.disableValueScaling){var a=o.getObjectScale(e);if(a<this.config.minAllowedObjectScale)return e.slice();i=1/a}return this.initializeFiltersIfEmpty(e),e.map((function(e,o){var a=r({},e,{x:n.xFilters[o].apply(e.x,t,i),y:n.yFilters[o].apply(e.y,t,i)});return null!=e.z&&(a.z=n.zFilters[o].apply(e.z,t,i)),a}))},e.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},e.prototype.initializeFiltersIfEmpty=function(e){var t=this;null!=this.xFilters&&this.xFilters.length===e.length||(this.xFilters=e.map((function(e){return new i.RelativeVelocityFilter(t.config)})),this.yFilters=e.map((function(e){return new i.RelativeVelocityFilter(t.config)})),this.zFilters=e.map((function(e){return new i.RelativeVelocityFilter(t.config)})))},e}();n.KeypointsVelocityFilter=a},{"./relative_velocity_filter":"06ea0631b9bb799fc706c51e86abf6a5","./velocity_filter_utils":"70beb6a9494fc8ae5a519f3a3b865d63"}],"06ea0631b9bb799fc706c51e86abf6a5":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("./constants"),i=e("./low_pass_filter"),o=function(){function e(e){this.config=e,this.window=[],this.lowPassFilter=new i.LowPassFilter(1),this.lastValue=0,this.lastValueScale=1,this.lastTimestamp=-1}return e.prototype.apply=function(e,t,n){if(null==e)return e;var i,o=Math.trunc(t);if(this.lastTimestamp>=o)return e;if(-1===this.lastTimestamp)i=1;else{for(var a=e*n-this.lastValue*this.lastValueScale,s=o-this.lastTimestamp,l=a,u=s,c=r.SECOND_TO_MICRO_SECONDS/30,f=(1+this.window.length)*c,h=0,d=this.window;h<d.length;h++){var p=d[h];if(u+p.duration>f)break;l+=p.distance,u+=p.duration}var _=l/(u*r.MICRO_SECONDS_TO_SECOND);i=1-1/(1+this.config.velocityScale*Math.abs(_)),this.window.unshift({distance:a,duration:s}),this.window.length>this.config.windowSize&&this.window.pop()}return this.lastValue=e,this.lastValueScale=n,this.lastTimestamp=o,this.lowPassFilter.applyWithAlpha(e,i)},e}();n.RelativeVelocityFilter=o},{"./constants":"b2a1418f82e95c63d4d5447f855b9d86","./low_pass_filter":"a963802666be9bfaae53a7ca04666f91"}],"8c0a1b326a98896bfad027b9ad4fdd7a":[function(e,t,n){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0}),n.normalizedKeypointsToKeypoints=function(e,t){return e.map((function(e){var n=r({},e,{x:e.x*t.width,y:e.y*t.height});return null!=e.z&&(n.z=e.z*t.width),n}))}},{}],"3e11a20dd3c5eab027d098ce14d31803":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("@tensorflow/tfjs-core"),i=e("./image_utils");n.shiftImageValue=function(e,t){var n=i.transformValueRange(0,255,t[0],t[1]);return r.tidy((function(){return r.add(r.mul(e,n.scale),n.offset)}))}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","./image_utils":"8e8b1aa998d37ce4749a59496f1fbeac"}],"611e96f08a1ee1827575f4255d65ac65":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r=e("./detection_to_rect");n.calculateAlignmentPointsRects=function(e,t,n){var i=n.rotationVectorStartKeypointIndex,o=n.rotationVectorEndKeypointIndex,a=e.locationData,s=a.relativeKeypoints[i].x*t.width,l=a.relativeKeypoints[i].y*t.height,u=a.relativeKeypoints[o].x*t.width,c=a.relativeKeypoints[o].y*t.height,f=2*Math.sqrt((u-s)*(u-s)+(c-l)*(c-l)),h=r.computeRotation(e,t,n);return{xCenter:s/t.width,yCenter:l/t.height,width:f/t.width,height:f/t.height,rotation:h}}},{"./detection_to_rect":"216c45c7c5dc99751d1b9cc6829ab64a"}],"216c45c7c5dc99751d1b9cc6829ab64a":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r=e("../../calculators/image_utils");n.computeRotation=function(e,t,n){var i,o=e.locationData,a=n.rotationVectorStartKeypointIndex,s=n.rotationVectorEndKeypointIndex;i=n.rotationVectorTargetAngle?n.rotationVectorTargetAngle:Math.PI*n.rotationVectorTargetAngleDegree/180;var l=o.relativeKeypoints[a].x*t.width,u=o.relativeKeypoints[a].y*t.height,c=o.relativeKeypoints[s].x*t.width,f=o.relativeKeypoints[s].y*t.height;return r.normalizeRadians(i-Math.atan2(-(f-u),c-l))}},{"../../calculators/image_utils":"8e8b1aa998d37ce4749a59496f1fbeac"}],fba0119daa7dcff8f8a260fa4afb18fa:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0}),n.calculateLandmarkProjection=function(e,t,n){void 0===n&&(n={ignoreRotation:!1});for(var i=[],o=0,a=e;o<a.length;o++){var s=a[o],l=s.x-.5,u=s.y-.5,c=n.ignoreRotation?0:t.rotation,f=Math.cos(c)*l-Math.sin(c)*u,h=Math.sin(c)*l+Math.cos(c)*u;f=f*t.width+t.xCenter,h=h*t.height+t.yCenter;var d=s.z*t.width,p=r({},s);p.x=f,p.y=h,p.z=d,i.push(p)}return i}},{}],f7803629ce13409b2e94c98ea746289b:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r(e,t,n,r){return 1===r?.5*(e+t):e+(t-e)*n/(r-1)}Object.defineProperty(n,"__esModule",{value:!0}),n.createSsdAnchors=function(e){for(var t=[],n=0;n<e.numLayers;){for(var i=[],o=[],a=[],s=[],l=n;l<e.strides.length&&e.strides[l]===e.strides[n];){var u=r(e.minScale,e.maxScale,l,e.strides.length);if(0===l&&e.reduceBoxesInLowestLayer)a.push(1),a.push(2),a.push(.5),s.push(.1),s.push(u),s.push(u);else{for(var c=0;c<e.aspectRatios.length;++c)a.push(e.aspectRatios[c]),s.push(u);if(e.interpolatedScaleAspectRatio>0){var f=l===e.strides.length-1?1:r(e.minScale,e.maxScale,l+1,e.strides.length);s.push(Math.sqrt(u*f)),a.push(e.interpolatedScaleAspectRatio)}}l++}for(var h=0;h<a.length;++h){var d=Math.sqrt(a[h]);i.push(s[h]/d),o.push(s[h]*d)}var p=0,_=0;if(e.featureMapHeight.length>0)p=e.featureMapHeight[n],_=e.featureMapWidth[n];else{var b=e.strides[n];p=Math.ceil(e.inputSizeHeight/b),_=Math.ceil(e.inputSizeWidth/b)}for(var y=0;y<p;++y)for(var g=0;g<_;++g)for(var m=0;m<i.length;++m){var v={xCenter:(g+e.anchorOffsetX)/_,yCenter:(y+e.anchorOffsetY)/p,width:0,height:0};e.fixedAnchorSize?(v.width=1,v.height=1):(v.width=o[m],v.height=i[m]),t.push(v)}n=l}return t}},{}],"3505a9f6fcc51590f49fb2061919cf45":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("@tensorflow/tfjs-core"),i=e("./split_detection_result");n.detectorInference=function(e,t){return r.tidy((function(){var n=t.predict(e),o=i.splitDetectionResult(n),a=o[0],s=o[1];return{boxes:r.squeeze(s),scores:r.squeeze(a)}}))}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","./split_detection_result":"19e1a4d6746997bedcf62f0584c345b8"}],"19e1a4d6746997bedcf62f0584c345b8":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("@tensorflow/tfjs-core");n.splitDetectionResult=function(e){return r.tidy((function(){var t=r.slice(e,[0,0,0],[1,-1,1]);return[r.sigmoid(t),r.slice(e,[0,0,1],[1,-1,-1])]}))}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b"}],fa38b77e9139cfe417e008d917c4f7bc:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.landmarksToDetection=function(e){for(var t={locationData:{relativeKeypoints:[]}},n=Number.MAX_SAFE_INTEGER,r=Number.MIN_SAFE_INTEGER,i=Number.MAX_SAFE_INTEGER,o=Number.MIN_SAFE_INTEGER,a=0;a<e.length;++a){var s=e[a];n=Math.min(n,s.x),r=Math.max(r,s.x),i=Math.min(i,s.y),o=Math.max(o,s.y),t.locationData.relativeKeypoints.push({x:s.x,y:s.y})}return t.locationData.relativeBoundingBox={xMin:n,yMin:i,xMax:r,yMax:o,width:r-n,height:o-i},t}},{}],"581a782b3c222a42ae610a2df9a4568c":[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var o=e("@tensorflow/tfjs-core");n.nonMaxSuppression=function(e,t,n,a){return r(this,void 0,void 0,(function(){var r,s,l,u,c;return i(this,(function(i){switch(i.label){case 0:return r=o.tensor2d(e.map((function(e){return[e.locationData.relativeBoundingBox.yMin,e.locationData.relativeBoundingBox.xMin,e.locationData.relativeBoundingBox.yMax,e.locationData.relativeBoundingBox.xMax]}))),s=o.tensor1d(e.map((function(e){return e.score[0]}))),[4,o.image.nonMaxSuppressionAsync(r,s,t,n,a)];case 1:return[4,(l=i.sent()).array()];case 2:return u=i.sent(),c=e.filter((function(e,t){return u.indexOf(t)>-1})),o.dispose([r,s,l]),[2,c]}}))}))}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b"}],"0ed93933ae43fddc888b6878170c148d":[function(e,t,n){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)},i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var a=e("@tensorflow/tfjs-core");n.refineLandmarksFromHeatmap=function(e,t,n){return i(this,void 0,void 0,(function(){var i,s,l,u,c,f,h,d,p,_,b,y,g,m,v,E,O,w,S,T,I,x,M,N;return o(this,(function(o){switch(o.label){case 0:if(i=a.squeeze(t,[0]),s=i.shape,l=s[0],u=s[1],c=s[2],e.length!==c)throw new Error("Expected heatmap to have same number of channels as the number of landmarks.");return f=[],[4,i.buffer()];case 1:for(h=o.sent(),d=0;d<e.length;d++)if(p=e[d],_=r({},p),f.push(_),b=Math.trunc(_.x*u),y=Math.trunc(_.y*l),!(b<0||b>=u||y<0||b>=l)){for(g=Math.trunc((n.kernelSize-1)/2),m=Math.max(0,b-g),v=Math.min(u,b+g+1),E=Math.max(0,y-g),O=Math.min(l,y+g+1),w=0,S=0,T=0,I=0,x=E;x<O;++x)for(M=m;M<v;++M)N=h.get(x,M,d),w+=N,I=Math.max(I,N),S+=M*N,T+=x*N;I>=n.minConfidenceToRefine&&w>0&&(_.x=S/u/w,_.y=T/l/w)}return i.dispose(),[2,f]}}))}))}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b"}],"54e35aac509d1ea0e0652e5a088fa3bb":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.removeDetectionLetterbox=function(e,t){void 0===e&&(e=[]);for(var n=t.left,r=t.top,i=t.left+t.right,o=t.top+t.bottom,a=0;a<e.length;a++){var s=e[a],l=s.locationData.relativeBoundingBox,u=(l.xMin-n)/(1-i),c=(l.yMin-r)/(1-o),f=l.width/(1-i),h=l.height/(1-o);l.xMin=u,l.yMin=c,l.width=f,l.height=h;for(var d=0;d<s.locationData.relativeKeypoints.length;++d){var p=s.locationData.relativeKeypoints[d],_=(p.x-n)/(1-i),b=(p.y-r)/(1-o);p.x=_,p.y=b}}return e}},{}],"760e667465b4f96d625babf7e4625da4":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0}),n.removeLandmarkLetterbox=function(e,t){var n=t.left,i=t.top,o=t.left+t.right,a=t.top+t.bottom;return e.map((function(e){return r({},e,{x:(e.x-n)/(1-o),y:(e.y-i)/(1-a),z:e.z/(1-o)})}))}},{}],"809bd74c12363d1412cadb7befc0a371":[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var o=e("@tensorflow/tfjs-core");function a(e,t,n){return r(this,void 0,void 0,(function(){var r,o,a,l,u,c,f,h,d,p,_,b;return i(this,(function(i){switch(i.label){case 0:return r=[],[4,e.data()];case 1:return o=i.sent(),[4,t.data()];case 2:for(a=i.sent(),l=0;l<n.numBoxes;++l)if(!(null!=n.minScoreThresh&&a[l]<n.minScoreThresh||(u=l*n.numCoords,c=s(o[u+0],o[u+1],o[u+2],o[u+3],a[l],n.flipVertically,l),(f=c.locationData.relativeBoundingBox).width<0||f.height<0))){if(n.numKeypoints>0)for((h=c.locationData).relativeKeypoints=[],d=n.numKeypoints*n.numValuesPerKeypoint,p=0;p<d;p+=n.numValuesPerKeypoint)_=u+n.keypointCoordOffset+p,b={x:o[_+0],y:n.flipVertically?1-o[_+1]:o[_+1]},h.relativeKeypoints.push(b);r.push(c)}return[2,r]}}))}))}function s(e,t,n,r,i,o,a){return{score:[i],ind:a,locationData:{relativeBoundingBox:{xMin:t,yMin:o?1-n:e,xMax:r,yMax:o?1-e:n,width:r-t,height:n-e}}}}n.tensorsToDetections=function(e,t,n){return r(this,void 0,void 0,(function(){var r,s,l,u,c;return i(this,(function(i){switch(i.label){case 0:return r=e[0],s=e[1],l=function(e,t,n){return o.tidy((function(){var r,i,a,s;n.reverseOutputOrder?(i=o.squeeze(o.slice(e,[0,n.boxCoordOffset+0],[-1,1])),r=o.squeeze(o.slice(e,[0,n.boxCoordOffset+1],[-1,1])),s=o.squeeze(o.slice(e,[0,n.boxCoordOffset+2],[-1,1])),a=o.squeeze(o.slice(e,[0,n.boxCoordOffset+3],[-1,1]))):(r=o.squeeze(o.slice(e,[0,n.boxCoordOffset+0],[-1,1])),i=o.squeeze(o.slice(e,[0,n.boxCoordOffset+1],[-1,1])),a=o.squeeze(o.slice(e,[0,n.boxCoordOffset+2],[-1,1])),s=o.squeeze(o.slice(e,[0,n.boxCoordOffset+3],[-1,1]))),i=o.add(o.mul(o.div(i,n.xScale),t.w),t.x),r=o.add(o.mul(o.div(r,n.yScale),t.h),t.y),n.applyExponentialOnBoxSize?(a=o.mul(o.exp(o.div(a,n.hScale)),t.h),s=o.mul(o.exp(o.div(s,n.wScale)),t.w)):(a=o.mul(o.div(a,n.hScale),t.h),s=o.mul(o.div(s,n.wScale),t.h));var l=o.sub(r,o.div(a,2)),u=o.sub(i,o.div(s,2)),c=o.add(r,o.div(a,2)),f=o.add(i,o.div(s,2)),h=o.concat([o.reshape(l,[n.numBoxes,1]),o.reshape(u,[n.numBoxes,1]),o.reshape(c,[n.numBoxes,1]),o.reshape(f,[n.numBoxes,1])],1);if(n.numKeypoints)for(var d=0;d<n.numKeypoints;++d){var p=n.keypointCoordOffset+d*n.numValuesPerKeypoint,_=void 0,b=void 0;n.reverseOutputOrder?(_=o.squeeze(o.slice(e,[0,p],[-1,1])),b=o.squeeze(o.slice(e,[0,p+1],[-1,1]))):(b=o.squeeze(o.slice(e,[0,p],[-1,1])),_=o.squeeze(o.slice(e,[0,p+1],[-1,1])));var y=o.add(o.mul(o.div(_,n.xScale),t.w),t.x),g=o.add(o.mul(o.div(b,n.yScale),t.h),t.y);h=o.concat([h,o.reshape(y,[n.numBoxes,1]),o.reshape(g,[n.numBoxes,1])],1)}return h}))}(s,t,n),u=o.tidy((function(){var e=r;return n.sigmoidScore?(null!=n.scoreClippingThresh&&(e=o.clipByValue(r,-n.scoreClippingThresh,n.scoreClippingThresh)),e=o.sigmoid(e)):e})),[4,a(l,u,n)];case 1:return c=i.sent(),o.dispose([l,u]),[2,c]}}))}))},n.convertToDetections=a},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b"}],"96649d618524e600c50f90853e1fe9e8":[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("../../calculators/sigmoid");n.tensorsToLandmarks=function(e,t,n,a){return void 0===n&&(n=!1),void 0===a&&(a=!1),r(this,void 0,void 0,(function(){var r,s,l,u,c,f,h,d;return i(this,(function(i){switch(i.label){case 0:return r=e.size,s=r/t.numLandmarks,[4,e.data()];case 1:for(l=i.sent(),u=[],c=0;c<t.numLandmarks;++c)f=c*s,(d={x:0,y:0}).x=n?t.inputImageWidth-l[f]:l[f],s>1&&(d.y=a?t.inputImageHeight-l[f+1]:l[f+1]),s>2&&(d.z=l[f+2]),s>3&&(d.score=o.sigmoid(l[f+3])),u.push(d);for(h=0;h<u.length;++h)(d=u[h]).x=d.x/t.inputImageWidth,d.y=d.y/t.inputImageHeight,d.z=d.z/t.inputImageWidth/(t.normalizeZ||1);return[2,u]}}))}))}},{"../../calculators/sigmoid":"99dc6decc6c14c52e3547987c51f4770"}],"99dc6decc6c14c52e3547987c51f4770":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sigmoid=
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){return 1/(1+Math.exp(-e))}},{}],"1eff654caf497c1aa2018a12a00df81e":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r=e("../../calculators/image_utils");function i(e,t){return null!=t.rotation?e+=t.rotation:null!=t.rotationDegree&&(e+=Math.PI*t.rotationDegree/180),r.normalizeRadians(e)}n.transformNormalizedRect=function(e,t,n){var r=e.width,o=e.height,a=e.rotation;if(null==n.rotation&&null==n.rotationDegree||(a=i(a,n)),0===a)e.xCenter=e.xCenter+r*n.shiftX,e.yCenter=e.yCenter+o*n.shiftY;else{var s=(t.width*r*n.shiftX*Math.cos(a)-t.height*o*n.shiftY*Math.sin(a))/t.width,l=(t.width*r*n.shiftX*Math.sin(a)+t.height*o*n.shiftY*Math.cos(a))/t.height;e.xCenter=e.xCenter+s,e.yCenter=e.yCenter+l}if(n.squareLong){var u=Math.max(r*t.width,o*t.height);r=u/t.width,o=u/t.height}else if(n.squareShort){var c=Math.min(r*t.width,o*t.height);r=c/t.width,o=c/t.height}return e.width=r*n.scaleX,e.height=o*n.scaleY,e},n.computeNewRotation=i},{"../../calculators/image_utils":"8e8b1aa998d37ce4749a59496f1fbeac"}],a8be41cb348c9e3c0ec3eed9d1b187ab:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("../../calculators/low_pass_filter"),o=function(){function e(e){this.alpha=e.alpha}return e.prototype.apply=function(e){var t=this;if(null==e)return this.visibilityFilters=null,null;null!=this.visibilityFilters&&this.visibilityFilters.length===e.length||(this.visibilityFilters=e.map((function(e){return new i.LowPassFilter(t.alpha)})));for(var n=[],o=0;o<e.length;++o){var a=e[o],s=r({},a);s.score=this.visibilityFilters[o].apply(a.score),n.push(s)}return n},e}();n.LowPassVisibilityFilter=o},{"../../calculators/low_pass_filter":"a963802666be9bfaae53a7ca04666f91"}],"1926e0dec784d6c59fbe9eb63ed929e1":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL="https://storage.googleapis.com/tfjs-models/savedmodel/blazepose/detector/f16/model.json",n.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL="https://storage.googleapis.com/tfjs-models/savedmodel/blazepose/landmark/full-f16/model.json",n.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE="https://storage.googleapis.com/tfjs-models/savedmodel/blazepose/landmark/lite-f16/model.json",n.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY="https://storage.googleapis.com/tfjs-models/savedmodel/blazepose/landmark/heavy-f16/model.json",n.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION={reduceBoxesInLowestlayer:!1,interpolatedScaleAspectRatio:1,featureMapHeight:[],featureMapWidth:[],numLayers:5,minScale:.1484375,maxScale:.75,inputSizeHeight:224,inputSizeWidth:224,anchorOffsetX:.5,anchorOffsetY:.5,strides:[8,16,32,32,32],aspectRatios:[1],fixedAnchorSize:!0},n.DEFAULT_BLAZEPOSE_MODEL_CONFIG={runtime:"tfjs",modelType:"full",enableSmoothing:!0,detectorModelUrl:n.DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,landmarkModelUrl:n.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL},n.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG={maxPoses:1,flipHorizontal:!1},n.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION={applyExponentialOnBoxSize:!1,flipVertically:!1,ignoreClasses:[],numClasses:1,numBoxes:2254,numCoords:12,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:4,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:224,yScale:224,hScale:224,wScale:224,minScoreThresh:.5},n.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION={minScoreThreshold:-1,minSuppressionThreshold:.3},n.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG={shiftX:0,shiftY:0,scaleX:1.25,scaleY:1.25,squareLong:!0},n.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG={inputResolution:{width:224,height:224},keepAspectRatio:!0},n.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG={inputResolution:{width:256,height:256},keepAspectRatio:!0},n.BLAZEPOSE_POSE_PRESENCE_SCORE=.5,n.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG={numLandmarks:39,inputImageWidth:256,inputImageHeight:256},n.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG={kernelSize:7,minConfidenceToRefine:.5},n.BLAZEPOSE_NUM_KEYPOINTS=33,n.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS=35,n.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG={alpha:.1},n.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL={oneEuroFilter:{frequency:30,minCutOff:.1,beta:40,derivateCutOff:1,minAllowedObjectScale:1e-6}},n.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY={oneEuroFilter:{frequency:30,minCutOff:.01,beta:1,derivateCutOff:1,minAllowedObjectScale:1e-6}}},{}],"027e1ecb82fc6c461e525b1f5e6195d9":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("./constants");n.validateModelConfig=function(e){var t=r({},null==e?i.DEFAULT_BLAZEPOSE_MODEL_CONFIG:e);if(null==t.enableSmoothing&&(t.enableSmoothing=i.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing),null==t.modelType&&(t.modelType=i.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType),null==t.detectorModelUrl&&(t.detectorModelUrl=i.DEFAULT_BLAZEPOSE_MODEL_CONFIG.detectorModelUrl),null==t.landmarkModelUrl)switch(t.modelType){case"lite":t.landmarkModelUrl=i.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE;break;case"heavy":t.landmarkModelUrl=i.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY;break;case"full":default:t.landmarkModelUrl=i.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL}return t},n.validateEstimationConfig=function(e){var t;if(null==(t=null==e?i.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG:r({},e)).maxPoses&&(t.maxPoses=1),t.maxPoses<=0)throw new Error("Invalid maxPoses "+t.maxPoses+". Should be > 0.");if(t.maxPoses>1)throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");return t}},{"./constants":"1926e0dec784d6c59fbe9eb63ed929e1"}],c7fe595941a1f2e6e5a82f41ea4ee545:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("@tensorflow/tfjs-converter"),a=e("@tensorflow/tfjs-core"),s=e("../calculators/constants"),l=e("../calculators/image_utils"),u=e("../calculators/is_video"),c=e("../calculators/keypoints_one_euro_filter"),f=e("../calculators/low_pass_filter"),h=e("../constants"),d=e("../types"),p=e("../util"),_=e("./constants"),b=e("./detector_utils"),y=function(){function e(e,t){this.moveNetModel=e,this.modelInputResolution={height:0,width:0},this.keypointIndexByName=p.getKeypointIndexByName(d.SupportedModels.MoveNet),this.keypointsFilter=new c.KeypointsOneEuroFilter(_.KEYPOINT_FILTER_CONFIG),this.cropRegionFilterYMin=new f.LowPassFilter(_.CROP_FILTER_ALPHA),this.cropRegionFilterXMin=new f.LowPassFilter(_.CROP_FILTER_ALPHA),this.cropRegionFilterYMax=new f.LowPassFilter(_.CROP_FILTER_ALPHA),this.cropRegionFilterXMax=new f.LowPassFilter(_.CROP_FILTER_ALPHA),t.modelType===_.SINGLEPOSE_LIGHTNING?(this.modelInputResolution.width=_.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION,this.modelInputResolution.height=_.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION):t.modelType===_.SINGLEPOSE_THUNDER&&(this.modelInputResolution.width=_.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION,this.modelInputResolution.height=_.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION),this.enableSmoothing=t.enableSmoothing}return e.prototype.detectKeypoints=function(e,t){return void 0===t&&(t=!0),r(this,void 0,void 0,(function(){var n,r,o,s,l;return i(this,(function(i){switch(i.label){case 0:return this.moveNetModel?(n=17,t?(r=this.moveNetModel.execute(e),[3,3]):[3,1]):[2,null];case 1:return[4,this.moveNetModel.executeAsync(e)];case 2:r=i.sent(),i.label=3;case 3:return r&&4===r.shape.length&&1===r.shape[0]&&1===r.shape[1]&&r.shape[2]===n&&3===r.shape[3]?"webgpu"===a.getBackend()?[3,4]:(o=r.dataSync(),[3,6]):(r.dispose(),[2,null]);case 4:return[4,r.data()];case 5:o=i.sent(),i.label=6;case 6:for(r.dispose(),s=[],l=0;l<n;++l)s[l]={y:o[3*l],x:o[3*l+1],score:o[3*l+2]};return[2,s]}}))}))},e.prototype.estimatePoses=function(e,t,n){return void 0===t&&(t=_.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG),r(this,void 0,void 0,(function(){var r,o,c,f,d,p,y,g,m,v=this;return i(this,(function(i){switch(i.label){case 0:return t=b.validateEstimationConfig(t),null==e?(this.reset(),[2,[]]):(null==n?u.isVideo(e)&&(n=e.currentTime*s.SECOND_TO_MICRO_SECONDS):n*=s.MILLISECOND_TO_MICRO_SECONDS,r=l.toImageTensor(e),o=l.getImageSize(r),c=a.expandDims(r,0),e instanceof a.Tensor||r.dispose(),this.cropRegion||(this.cropRegion=this.initCropRegion(o.width,o.height)),f=a.tidy((function(){var e=a.tensor2d([[v.cropRegion.yMin,v.cropRegion.xMin,v.cropRegion.yMax,v.cropRegion.xMax]]),t=a.zeros([1],"int32"),n=[v.modelInputResolution.height,v.modelInputResolution.width];return a.cast(a.image.cropAndResize(c,e,t,n,"bilinear",0),"int32")})),c.dispose(),[4,this.detectKeypoints(f)]);case 1:if(d=i.sent(),f.dispose(),null==d)return this.reset(),[2,[]];for(m=0;m<d.length;++m)d[m].y=this.cropRegion.yMin+d[m].y*this.cropRegion.height,d[m].x=this.cropRegion.xMin+d[m].x*this.cropRegion.width;for(null!=n&&this.enableSmoothing&&(d=this.keypointsFilter.apply(d,n)),p=this.determineCropRegion(d,o.height,o.width),this.cropRegion=this.filterCropRegion(p),y=0,g=0,m=0;m<d.length;++m)d[m].name=h.COCO_KEYPOINTS[m],d[m].y*=o.height,d[m].x*=o.width,d[m].score>_.MIN_CROP_KEYPOINT_SCORE&&(++y,g+=d[m].score);return y>0?g/=y:this.resetFilters(),[2,[{score:g,keypoints:d}]]}}))}))},e.prototype.filterCropRegion=function(e){if(e){var t=this.cropRegionFilterYMin.apply(e.yMin),n=this.cropRegionFilterXMin.apply(e.xMin),r=this.cropRegionFilterYMax.apply(e.yMax),i=this.cropRegionFilterXMax.apply(e.xMax);return{yMin:t,xMin:n,yMax:r,xMax:i,height:r-t,width:i-n}}return this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset(),null},e.prototype.dispose=function(){this.moveNetModel.dispose()},e.prototype.reset=function(){this.cropRegion=null,this.resetFilters()},e.prototype.resetFilters=function(){this.keypointsFilter.reset(),this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset()},e.prototype.torsoVisible=function(e){return(e[this.keypointIndexByName.left_hip].score>_.MIN_CROP_KEYPOINT_SCORE||e[this.keypointIndexByName.right_hip].score>_.MIN_CROP_KEYPOINT_SCORE)&&(e[this.keypointIndexByName.left_shoulder].score>_.MIN_CROP_KEYPOINT_SCORE||e[this.keypointIndexByName.right_shoulder].score>_.MIN_CROP_KEYPOINT_SCORE)},e.prototype.determineTorsoAndBodyRange=function(e,t,n,r){for(var i=["left_shoulder","right_shoulder","left_hip","right_hip"],o=0,a=0,s=0;s<i.length;s++){(h=Math.abs(n-t[i[s]][0]))>o&&(o=h),(d=Math.abs(r-t[i[s]][1]))>a&&(a=d)}for(var l=0,u=0,c=0,f=Object.keys(t);c<f.length;c++){var h,d,p=f[c];if(!(e[this.keypointIndexByName[p]].score<_.MIN_CROP_KEYPOINT_SCORE))(h=Math.abs(n-t[p][0]))>l&&(l=h),(d=Math.abs(r-t[p][1]))>u&&(u=d)}return[o,a,l,u]},e.prototype.determineCropRegion=function(e,t,n){for(var r={},i=0,o=h.COCO_KEYPOINTS;i<o.length;i++){var a=o[i];r[a]=[e[this.keypointIndexByName[a]].y*t,e[this.keypointIndexByName[a]].x*n]}if(this.torsoVisible(e)){var s=(r.left_hip[0]+r.right_hip[0])/2,l=(r.left_hip[1]+r.right_hip[1])/2,u=this.determineTorsoAndBodyRange(e,r,s,l),c=u[0],f=u[1],d=u[2],p=u[3],_=Math.max(1.9*f,1.9*c,1.2*d,1.2*p),b=[s-(_=Math.min(_,Math.max(l,n-l,s,t-s))),l-_];if(_>Math.max(n,t)/2)return this.initCropRegion(t,n);var y=2*_;return{yMin:b[0]/t,xMin:b[1]/n,yMax:(b[0]+y)/t,xMax:(b[1]+y)/n,height:(b[0]+y)/t-b[0]/t,width:(b[1]+y)/n-b[1]/n}}return this.initCropRegion(t,n)},e.prototype.initCropRegion=function(e,t){var n,r,i,o;return this.cropRegion?t>e?(n=t/e,r=1,i=(e/2-t/2)/e,o=0):(n=1,r=e/t,i=0,o=(t/2-e/2)/t):t>e?(n=1,r=e/t,i=0,o=(t/2-e/2)/t):(n=t/e,r=1,i=(e/2-t/2)/e,o=0),{yMin:i,xMin:o,yMax:i+n,xMax:o+r,height:n,width:r}},e}();n.load=function(e){return void 0===e&&(e=_.MOVENET_CONFIG),r(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(i){switch(i.label){case 0:return(t=b.validateModelConfig(e)).modelUrl?[4,o.loadGraphModel(t.modelUrl)]:[3,2];case 1:return n=i.sent(),[3,4];case 2:return r=void 0,t.modelType===_.SINGLEPOSE_LIGHTNING?r=_.MOVENET_SINGLEPOSE_LIGHTNING_URL:t.modelType===_.SINGLEPOSE_THUNDER&&(r=_.MOVENET_SINGLEPOSE_THUNDER_URL),[4,o.loadGraphModel(r,{fromTFHub:!0})];case 3:n=i.sent(),i.label=4;case 4:return[2,new y(n,t)]}}))}))}},{"@tensorflow/tfjs-converter":"8560db211e8586507d186920da41a1f7","@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","../calculators/constants":"b2a1418f82e95c63d4d5447f855b9d86","../calculators/image_utils":"8e8b1aa998d37ce4749a59496f1fbeac","../calculators/is_video":"0ad66c5a3e52c0ecb3b9fa2b815e338a","../calculators/keypoints_one_euro_filter":"9d03078a252de1e20f9c71c3b5f70575","../calculators/low_pass_filter":"a963802666be9bfaae53a7ca04666f91","../constants":"d1b6644bac2673040191469ef837d3b0","../types":"21cb1b02f10468e03f42b263c7e622c6","../util":"e210d29b6b99f07b54658e3a7f21e2ba","./constants":"e59a422da8ac97baaafb459a7cec288f","./detector_utils":"8133db7f51d1cef85608a7bad3d72b02"}],d1b6644bac2673040191469ef837d3b0:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
n.COCO_KEYPOINTS=["nose","left_eye","right_eye","left_ear","right_ear","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle"],n.BLAZEPOSE_KEYPOINTS=["nose","left_eye_inner","left_eye","left_eye_outer","right_eye_inner","right_eye","right_eye_outer","left_ear","right_ear","mouth_left","mouth_right","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_pinky","right_pinky","left_index","right_index","left_thumb","right_thumb","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle","left_heel","right_heel","left_foot_index","right_foot_index"],n.BLAZEPOSE_KEYPOINTS_BY_SIDE={left:[1,2,3,7,9,11,13,15,17,19,21,23,25,27,29,31],right:[4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32],middle:[0]},n.COCO_KEYPOINTS_BY_SIDE={left:[1,3,5,7,9,11,13,15],right:[2,4,6,8,10,12,14,16],middle:[0]},n.COCO_CONNECTED_KEYPOINTS_PAIRS=[[0,1],[0,2],[1,3],[2,4],[5,6],[5,7],[5,11],[6,8],[6,12],[7,9],[8,10],[11,12],[11,13],[12,14],[13,15],[14,16]],n.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS=[[0,1],[0,4],[1,2],[2,3],[3,7],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[11,23],[12,14],[14,16],[12,24],[13,15],[15,17],[16,18],[16,20],[15,17],[15,19],[15,21],[16,22],[17,19],[18,20],[23,25],[23,24],[24,26],[25,27],[26,28],[27,29],[28,30],[27,31],[28,32],[29,31],[30,32]]},{}],"21cb1b02f10468e03f42b263c7e622c6":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){e.MoveNet="MoveNet",e.BlazePose="BlazePose",e.PoseNet="PoseNet"}(n.SupportedModels||(n.SupportedModels={}))},{}],e210d29b6b99f07b54658e3a7f21e2ba:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var r=e("./constants"),i=e("./types");n.getKeypointIndexBySide=function(e){switch(e){case i.SupportedModels.BlazePose:return r.BLAZEPOSE_KEYPOINTS_BY_SIDE;case i.SupportedModels.PoseNet:case i.SupportedModels.MoveNet:return r.COCO_KEYPOINTS_BY_SIDE;default:throw new Error("Model "+e+" is not supported.")}},n.getAdjacentPairs=function(e){switch(e){case i.SupportedModels.BlazePose:return r.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS;case i.SupportedModels.PoseNet:case i.SupportedModels.MoveNet:return r.COCO_CONNECTED_KEYPOINTS_PAIRS;default:throw new Error("Model "+e+" is not supported.")}},n.getKeypointIndexByName=function(e){switch(e){case i.SupportedModels.BlazePose:return r.BLAZEPOSE_KEYPOINTS.reduce((function(e,t,n){return e[t]=n,e}),{});case i.SupportedModels.PoseNet:case i.SupportedModels.MoveNet:return r.COCO_KEYPOINTS.reduce((function(e,t,n){return e[t]=n,e}),{});default:throw new Error("Model "+e+" is not supported.")}}},{"./constants":"d1b6644bac2673040191469ef837d3b0","./types":"21cb1b02f10468e03f42b263c7e622c6"}],e59a422da8ac97baaafb459a7cec288f:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.SINGLEPOSE_LIGHTNING="SinglePose.Lightning",n.SINGLEPOSE_THUNDER="SinglePose.Thunder",n.VALID_MODELS=[n.SINGLEPOSE_LIGHTNING,n.SINGLEPOSE_THUNDER],n.MOVENET_SINGLEPOSE_LIGHTNING_URL="https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/3",n.MOVENET_SINGLEPOSE_THUNDER_URL="https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/3",n.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION=192,n.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION=256,n.MOVENET_CONFIG={modelType:n.SINGLEPOSE_LIGHTNING,enableSmoothing:!0},n.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG={maxPoses:1},n.KEYPOINT_FILTER_CONFIG={frequency:30,minCutOff:6.36,beta:636.61,derivateCutOff:4.77,thresholdCutOff:.5,thresholdBeta:5},n.CROP_FILTER_ALPHA=.9,n.MIN_CROP_KEYPOINT_SCORE=.2},{}],"8133db7f51d1cef85608a7bad3d72b02":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("./constants");n.validateModelConfig=function(e){var t=null==e?i.MOVENET_CONFIG:r({},e);if(e.modelType){if(i.VALID_MODELS.indexOf(t.modelType)<0)throw new Error("Invalid architecture "+t.modelType+". Should be one of "+i.VALID_MODELS)}else e.modelType="SinglePose.Lightning";return null==t.enableSmoothing&&(t.enableSmoothing=!0),t},n.validateEstimationConfig=function(e){var t=null==e?i.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG:r({},e);if(t.maxPoses||(t.maxPoses=1),t.maxPoses<=0||t.maxPoses>1)throw new Error("Invalid maxPoses "+t.maxPoses+". Should be 1.");return t}},{"./constants":"e59a422da8ac97baaafb459a7cec288f"}],d7160f853cb81d3725e04ec4e25b96b1:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("@tensorflow/tfjs-converter"),a=e("@tensorflow/tfjs-core"),s=e("../calculators/convert_image_to_tensor"),l=e("../calculators/image_utils"),u=e("../calculators/shift_image_value"),c=e("./calculators/decode_multiple_poses"),f=e("./calculators/decode_single_pose"),h=e("./calculators/flip_poses"),d=e("./calculators/scale_poses"),p=e("./constants"),_=e("./detector_utils"),b=e("./load_utils"),y=function(){function e(e,t){this.posenetModel=e;var n=this.posenetModel.inputs[0].shape;a.util.assert(-1===n[1]&&-1===n[2],(function(){return"Input shape ["+n[1]+", "+n[2]+"] must both be equal to or -1"}));var r=b.getValidInputResolutionDimensions(t.inputResolution,t.outputStride);_.assertValidOutputStride(t.outputStride),_.assertValidResolution(r,t.outputStride),this.inputResolution=r,this.outputStride=t.outputStride,this.architecture=t.architecture}return e.prototype.estimatePoses=function(e,t){return void 0===t&&(t=p.SINGLE_PERSON_ESTIMATION_CONFIG),r(this,void 0,void 0,(function(){var n,r,o,b,y,g,m,v,E,O,w,S,T,I,x;return i(this,(function(i){switch(i.label){case 0:return n=_.validateEstimationConfig(t),null==e?[2,[]]:(this.maxPoses=n.maxPoses,r=s.convertImageToTensor(e,{inputResolution:this.inputResolution,keepAspectRatio:!0}),o=r.imageTensor,b=r.padding,y="ResNet50"===this.architecture?a.add(o,p.RESNET_MEAN):u.shiftImageValue(o,[-1,1]),g=this.posenetModel.predict(y),"ResNet50"===this.architecture?(m=a.squeeze(g[2],[0]),v=a.squeeze(g[3],[0]),E=a.squeeze(g[0],[0]),O=a.squeeze(g[1],[0])):(m=a.squeeze(g[0],[0]),v=a.squeeze(g[1],[0]),E=a.squeeze(g[2],[0]),O=a.squeeze(g[3],[0])),w=a.sigmoid(v),1!==this.maxPoses?[3,2]:[4,f.decodeSinglePose(w,m,this.outputStride)]);case 1:return T=i.sent(),S=[T],[3,4];case 2:return[4,c.decodeMultiplePoses(w,m,E,O,this.outputStride,this.maxPoses,n.scoreThreshold,n.nmsRadius)];case 3:S=i.sent(),i.label=4;case 4:return I=l.getImageSize(e),x=d.scalePoses(S,I,this.inputResolution,b),n.flipHorizontal&&(x=h.flipPosesHorizontal(x,I)),o.dispose(),y.dispose(),a.dispose(g),m.dispose(),v.dispose(),E.dispose(),O.dispose(),w.dispose(),[2,x]}}))}))},e.prototype.dispose=function(){this.posenetModel.dispose()},e.prototype.reset=function(){},e}();n.load=function(e){return void 0===e&&(e=p.MOBILENET_V1_CONFIG),r(this,void 0,void 0,(function(){var t,n,r,a,s;return i(this,(function(i){switch(i.label){case 0:return"ResNet50"!==(t=_.validateModelConfig(e)).architecture?[3,2]:(n=b.resNet50Checkpoint(t.outputStride,t.quantBytes),[4,o.loadGraphModel(t.modelUrl||n)]);case 1:return r=i.sent(),[2,new y(r,t)];case 2:return a=b.mobileNetCheckpoint(t.outputStride,t.multiplier,t.quantBytes),[4,o.loadGraphModel(t.modelUrl||a)];case 3:return s=i.sent(),[2,new y(s,t)]}}))}))}},{"@tensorflow/tfjs-converter":"8560db211e8586507d186920da41a1f7","@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","../calculators/convert_image_to_tensor":"164be0f53e35af0a61c7318f977a06ec","../calculators/image_utils":"8e8b1aa998d37ce4749a59496f1fbeac","../calculators/shift_image_value":"3e11a20dd3c5eab027d098ce14d31803","./calculators/decode_multiple_poses":"99ad320b476676eb17ca3d434122161a","./calculators/decode_single_pose":"7eca3fc25286a301d94b95117143828f","./calculators/flip_poses":"6e2e1cf09fbf1f5eb3984b647111aec4","./calculators/scale_poses":"7b73d618cc6db8cc59d052fe962afef4","./constants":"efa325a5852fab2b5633d918a2127393","./detector_utils":"9a66f064f8f753522b350b587a26760c","./load_utils":"6ff312d5d765ebe4808d03abae03082f"}],"99ad320b476676eb17ca3d434122161a":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("../constants"),a=e("./build_part_with_score_queue"),s=e("./decode_multiple_poses_util");n.decodeMultiplePoses=function(e,t,n,l,u,c,f,h){return void 0===f&&(f=.5),void 0===h&&(h=20),r(this,void 0,void 0,(function(){var r,d,p,_,b,y,g,m,v,E,O,w;return i(this,(function(i){switch(i.label){case 0:return[4,s.toTensorBuffers3D([e,t,n,l])];case 1:for(r=i.sent(),d=r[0],p=r[1],_=r[2],b=r[3],y=[],g=a.buildPartWithScoreQueue(f,o.K_LOCAL_MAXIMUM_RADIUS,d),m=h*h;y.length<c&&!g.empty();)v=g.dequeue(),E=s.getImageCoords(v.part,u,p),s.withinNmsRadiusOfCorrespondingPoint(y,m,E,v.part.id)||(O=s.decodePose(v,d,p,u,_,b),w=s.getInstanceScore(y,m,O),y.push({keypoints:O,score:w}));return[2,y]}}))}))}},{"../constants":"efa325a5852fab2b5633d918a2127393","./build_part_with_score_queue":"6545662cc8f557fb89ae6b1c348c51df","./decode_multiple_poses_util":"e9e7836920ad7c11e3079408bf611bb1"}],efa325a5852fab2b5633d918a2127393:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.MOBILENET_V1_CONFIG={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:{height:257,width:257}},n.VALID_ARCHITECTURE=["MobileNetV1","ResNet50"],n.VALID_STRIDE={MobileNetV1:[8,16],ResNet50:[16]},n.VALID_OUTPUT_STRIDES=[8,16,32],n.VALID_MULTIPLIER={MobileNetV1:[.5,.75,1],ResNet50:[1]},n.VALID_QUANT_BYTES=[1,2,4],n.SINGLE_PERSON_ESTIMATION_CONFIG={maxPoses:1,flipHorizontal:!1},n.MULTI_PERSON_ESTIMATION_CONFIG={maxPoses:5,flipHorizontal:!1,scoreThreshold:.5,nmsRadius:20},n.RESNET_MEAN=[-123.15,-115.9,-103.06],n.K_LOCAL_MAXIMUM_RADIUS=1,n.NUM_KEYPOINTS=17,n.POSE_CHAIN=[["nose","left_eye"],["left_eye","left_ear"],["nose","right_eye"],["right_eye","right_ear"],["nose","left_shoulder"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],["left_shoulder","left_hip"],["left_hip","left_knee"],["left_knee","left_ankle"],["nose","right_shoulder"],["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["right_shoulder","right_hip"],["right_hip","right_knee"],["right_knee","right_ankle"]]},{}],"6545662cc8f557fb89ae6b1c348c51df":[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./max_heap");function i(e,t,n,r,i,o){for(var a=o.shape,s=a[0],l=a[1],u=!0,c=Math.max(n-i,0),f=Math.min(n+i+1,s),h=c;h<f;++h){for(var d=Math.max(r-i,0),p=Math.min(r+i+1,l),_=d;_<p;++_)if(o.get(h,_,e)>t){u=!1;break}if(!u)break}return u}n.buildPartWithScoreQueue=function(e,t,n){for(var o=n.shape,a=o[0],s=o[1],l=o[2],u=new r.MaxHeap(a*s*l,(function(e){return e.score})),c=0;c<a;++c)for(var f=0;f<s;++f)for(var h=0;h<l;++h){var d=n.get(c,f,h);d<e||i(h,d,c,f,t,n)&&u.enqueue({score:d,part:{heatmapY:c,heatmapX:f,id:h}})}return u}},{"./max_heap":"247892ae7e83a2b8ffb59a85ac728efb"}],"247892ae7e83a2b8ffb59a85ac728efb":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r(e){return Math.floor(e/2)}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return e.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},e.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},e.prototype.empty=function(){return-1===this.numberOfElements},e.prototype.size=function(){return this.numberOfElements+1},e.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},e.prototype.max=function(){return this.priorityQueue[0]},e.prototype.swim=function(e){for(;e>0&&this.less(r(e),e);)this.exchange(e,r(e)),e=r(e)},e.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},e.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},e.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},e.prototype.exchange=function(e,t){var n=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=n},e}();n.MaxHeap=i},{}],e9e7836920ad7c11e3079408bf611bb1:[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("../../constants"),a=e("../constants");function s(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+a.NUM_KEYPOINTS)}}function l(e,t,n){var r=s(e.heatmapY,e.heatmapX,e.id,n),i=r.y,o=r.x;return{x:e.heatmapX*t+o,y:e.heatmapY*t+i}}function u(e,t,n,r){var i=n-e,o=r-t;return i*i+o*o}function c(e,t,n,r){var i=n.x,o=n.y;return e.some((function(e){var n=e.keypoints;return u(o,i,n[r].y,n[r].x)<=t}))}n.toTensorBuffers3D=function(e){return r(this,void 0,void 0,(function(){return i(this,(function(t){return[2,Promise.all(e.map((function(e){return e.buffer()})))]}))}))},n.getOffsetPoint=s,n.getImageCoords=l,n.squaredDistance=u,n.withinNmsRadiusOfCorrespondingPoint=c;var f=o.COCO_KEYPOINTS.reduce((function(e,t,n){return e[t]=n,e}),{}),h=a.POSE_CHAIN.map((function(e){var t=e[0],n=e[1];return[f[t],f[n]]})),d=h.map((function(e){return e[1]})),p=h.map((function(e){return e[0]}));function _(e,t,n){return e<t?t:e>n?n:e}function b(e,t,n,r){return{y:_(Math.round(e.y/t),0,n-1),x:_(Math.round(e.x/t),0,r-1)}}function y(e,t){return{x:e.x+t.x,y:e.y+t.y}}function g(e,t,n,r,i,a,l,u){void 0===u&&(u=2);for(var c=r.shape,f=c[0],h=c[1],d={y:t.y,x:t.x},p=y(d,function(e,t,n){var r=n.shape[2]/2;return{y:n.get(t.y,t.x,e),x:n.get(t.y,t.x,r+e)}}(e,b(d,a,f,h),l)),_=0;_<u;_++){var g=b(p,a,f,h),m=s(g.y,g.x,n,i);p=y({x:g.x*a,y:g.y*a},{x:m.x,y:m.y})}var v=b(p,a,f,h),E=r.get(v.y,v.x,n);return{y:p.y,x:p.x,name:o.COCO_KEYPOINTS[n],score:E}}n.addVectors=y,n.decodePose=function(e,t,n,r,i,a){var s=t.shape[2],u=d.length,c=new Array(s),f=e.part,h=e.score,_=l(f,r,n);c[f.id]={score:h,name:o.COCO_KEYPOINTS[f.id],y:_.y,x:_.x};for(var b=u-1;b>=0;--b){var y=d[b],m=p[b];c[y]&&!c[m]&&(c[m]=g(b,c[y],m,t,n,r,a))}for(b=0;b<u;++b){y=p[b],m=d[b];c[y]&&!c[m]&&(c[m]=g(b,c[y],m,t,n,r,i))}return c},n.getInstanceScore=function(e,t,n){return n.reduce((function(n,r,i){var o=r.y,a=r.x,s=r.score;return c(e,t,{y:o,x:a},i)||(n+=s),n}),0)/n.length}},{"../../constants":"d1b6644bac2673040191469ef837d3b0","../constants":"efa325a5852fab2b5633d918a2127393"}],"7eca3fc25286a301d94b95117143828f":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(e){o(e)}}function s(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new n((function(t){t(e.value)})).then(a,s)}l((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(n,"__esModule",{value:!0});var o=e("../../constants"),a=e("./decode_single_pose_util");n.decodeSinglePose=function(e,t,n){return r(this,void 0,void 0,(function(){var r,s,l,u,c,f,h,d,p,_;return i(this,(function(i){switch(i.label){case 0:return r=0,s=a.argmax2d(e),[4,Promise.all([e.buffer(),t.buffer(),s.buffer()])];case 1:return l=i.sent(),u=l[0],c=l[1],f=l[2],[4,(h=a.getOffsetPoints(f,n,c)).buffer()];case 2:return d=i.sent(),p=Array.from(a.getPointsConfidence(u,f)),_=p.map((function(e,t){return r+=e,{y:d.get(t,0),x:d.get(t,1),score:e,name:o.COCO_KEYPOINTS[t]}})),s.dispose(),h.dispose(),[2,{keypoints:_,score:r/_.length}]}}))}))}},{"../../constants":"d1b6644bac2673040191469ef837d3b0","./decode_single_pose_util":"b67ff3ef23052bf645806623ad2ecaf3"}],b67ff3ef23052bf645806623ad2ecaf3:[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r=e("@tensorflow/tfjs-core"),i=e("../../constants");function o(e,t){for(var n=[],o=0;o<i.COCO_KEYPOINTS.length;o++){var s=a(e.get(o,0).valueOf(),e.get(o,1).valueOf(),o,t),l=s.x,u=s.y;n.push(u),n.push(l)}return r.tensor2d(n,[i.COCO_KEYPOINTS.length,2])}function a(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+i.COCO_KEYPOINTS.length)}}n.argmax2d=function(e){var t=e.shape,n=t[0],i=t[1],o=t[2];return r.tidy((function(){var t,a,s=r.reshape(e,[n*i,o]),l=r.argMax(s,0),u=r.expandDims(r.div(l,r.scalar(i,"int32")),1),c=r.expandDims((t=l,a=i,r.tidy((function(){var e=r.div(t,r.scalar(a,"int32"));return r.sub(t,r.mul(e,r.scalar(a,"int32")))}))),1);return r.concat([u,c],1)}))},n.getPointsConfidence=function(e,t){for(var n=t.shape[0],r=new Float32Array(n),i=0;i<n;i++){var o=t.get(i,0),a=t.get(i,1);r[i]=e.get(o,a,i)}return r},n.getOffsetPoints=function(e,t,n){return r.tidy((function(){var i=o(e,n);return r.add(r.cast(r.mul(e.toTensor(),r.scalar(t,"int32")),"float32"),i)}))},n.getOffsetVectors=o},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","../../constants":"d1b6644bac2673040191469ef837d3b0"}],"6e2e1cf09fbf1f5eb3984b647111aec4":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.flipPosesHorizontal=function(e,t){for(var n=0,r=e;n<r.length;n++)for(var i=0,o=r[n].keypoints;i<o.length;i++){var a=o[i];a.x=t.width-1-a.x}return e}},{}],"7b73d618cc6db8cc59d052fe962afef4":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0}),n.scalePoses=function(e,t,n,r){var i=t.height,o=t.width,a=i/(n.height*(1-r.top-r.bottom)),s=o/(n.width*(1-r.left-r.right)),l=-r.top*n.height,u=-r.left*n.width;if(1===s&&1===a&&0===l&&0===u)return e;for(var c=0,f=e;c<f.length;c++)for(var h=0,d=f[c].keypoints;h<d.length;h++){var p=d[h];p.x=(p.x+u)*s,p.y=(p.y+l)*a}return e}},{}],"9a66f064f8f753522b350b587a26760c":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=e("@tensorflow/tfjs-core"),o=e("./constants");function a(e,t){return(e-1)%t==0}n.validateModelConfig=function(e){var t=e||o.MOBILENET_V1_CONFIG;if(null==t.architecture&&(t.architecture="MobileNetV1"),o.VALID_ARCHITECTURE.indexOf(t.architecture)<0)throw new Error("Invalid architecture "+t.architecture+". Should be one of "+o.VALID_ARCHITECTURE);if(null==t.inputResolution&&(t.inputResolution={height:257,width:257}),null==t.outputStride&&(t.outputStride=16),o.VALID_STRIDE[t.architecture].indexOf(t.outputStride)<0)throw new Error("Invalid outputStride "+t.outputStride+". Should be one of "+o.VALID_STRIDE[t.architecture]+" for architecture "+t.architecture+".");if(null==t.multiplier&&(t.multiplier=1),o.VALID_MULTIPLIER[t.architecture].indexOf(t.multiplier)<0)throw new Error("Invalid multiplier "+t.multiplier+". Should be one of "+o.VALID_MULTIPLIER[t.architecture]+" for architecture "+t.architecture+".");if(null==t.quantBytes&&(t.quantBytes=4),o.VALID_QUANT_BYTES.indexOf(t.quantBytes)<0)throw new Error("Invalid quantBytes "+t.quantBytes+". Should be one of "+o.VALID_QUANT_BYTES+" for architecture "+t.architecture+".");if("MobileNetV1"===t.architecture&&32===t.outputStride&&1!==t.multiplier)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return t},n.assertValidOutputStride=function(e){i.util.assert(o.VALID_OUTPUT_STRIDES.indexOf(e)>=0,(function(){return"outputStride of "+e+" is invalid. It must be either 8 or 16."}))},n.assertValidResolution=function(e,t){i.util.assert(a(e.height,t),(function(){return"height of "+e.height+" is invalid for output stride "+t+"."})),i.util.assert(a(e.width,t),(function(){return"width of "+e.width+" is invalid for output stride "+t+"."}))},n.validateEstimationConfig=function(e){var t=e;if(null==t.maxPoses&&(t.maxPoses=1),t.maxPoses<=0)throw new Error("Invalid maxPoses "+t.maxPoses+". Should be > 0.");if(t.maxPoses>1){if((t=r({},o.MULTI_PERSON_ESTIMATION_CONFIG,t)).scoreThreshold<0||t.scoreThreshold>1)throw new Error("Invalid scoreThreshold "+t.scoreThreshold+". Should be in range [0.0, 1.0]");if(t.nmsRadius<=0)throw new Error("Invalid nmsRadius "+t.nmsRadius+".")}return t}},{"@tensorflow/tfjs-core":"113c40fae741f1fa8b11f29f407c690b","./constants":"efa325a5852fab2b5633d918a2127393"}],"6ff312d5d765ebe4808d03abae03082f":[function(e,t,n){"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Object.defineProperty(n,"__esModule",{value:!0});var r="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",i="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";function o(e,t){return function(e,t){return(e-1)%t==0}(e,t)?e:Math.floor(e/t)*t+1}n.resNet50Checkpoint=function(e,t){var n="model-stride"+e+".json";return 4===t?i+"float/"+n:i+"quant"+t+"/"+n},n.mobileNetCheckpoint=function(e,t,n){var i={1:"100",.75:"075",.5:"050"},o="model-stride"+e+".json";return 4===n?r+"float/"+i[t]+"/"+o:r+"quant"+n+"/"+i[t]+"/"+o},n.getValidInputResolutionDimensions=function(e,t){return{height:o(e.height,t),width:o(e.width,t)}},n.toValidInputResolution=o},{}]},{},[]);