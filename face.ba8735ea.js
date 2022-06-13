!function(e,t,n,r,a){var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o="function"==typeof s.parcelRequireaaed&&s.parcelRequireaaed,i=o.cache||{},l="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,n){if(!i[t]){if(!e[t]){var r="function"==typeof s.parcelRequireaaed&&s.parcelRequireaaed;if(!n&&r)return r(t,!0);if(o)return o(t,!0);if(l&&"string"==typeof t)return l(t);var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}p.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},p.cache={};var c=i[t]=new u.Module(t);e[t][0].call(c.exports,p,c,c.exports,this)}return i[t].exports;function p(e){var t=p.resolve(e);return!1===t?{}:u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=i,u.parent=o,u.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(u,"root",{get:function(){return s.parcelRequireaaed}}),s.parcelRequireaaed=u;for(var c=0;c<t.length;c++)u(t[c])}({gi7kh:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"loadFaceModel",(()=>u));var a=e("@tensorflow-models/face-landmarks-detection"),s=(e("@tensorflow/tfjs-backend-webgl"),e("@tensorflow/tfjs"));e("./face-model"),e("@tensorflow/tfjs-backend-wasm");let o;const i=t=>new Promise(((n,r)=>{o||(o=new Worker(e("84b97a5b4fabb77f"))),o.onmessage=e=>n(e.data),o.postMessage(t)})),l=async(e,t)=>{performance.now||Date.now;const n=await t.estimateFaces({input:e,returnTensors:!1,flipHorizontal:true,predictIrises:!0});if(n.length>0)for(let e=0,t=n.length;e<t;e++){let t;t=await i(n[e]),n[e]=t}return n},u=async(e,t)=>{await s.ready();const n=t.maxFaces,r=await a.load(a.SupportedPackages.mediapipeFacemesh,t),o=async(t,a,s=null)=>{if(!s||s()){const t=await l(e,r),s=Math.min(n,t.length);a(t.length?t.slice(0,s):[])}t&&requestAnimationFrame((()=>o(t,a,s)))};return o}},{"@tensorflow-models/face-landmarks-detection":"TPfUW","@tensorflow/tfjs-backend-webgl":"evSKx","@tensorflow/tfjs":"foAaF","./face-model":"knIxD","@tensorflow/tfjs-backend-wasm":"38Jex","84b97a5b4fabb77f":"htEXj","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],TPfUW:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"SupportedPackages",(()=>U)),r.export(n,"load",(()=>H));
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
    */
var a=e("@tensorflow/tfjs-core"),s=e("@tensorflow/tfjs-converter"),o=function(){return(o=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)};function i(e,t,n,r){return new(n||(n=Promise))((function(a,s){function o(e){try{l(r.next(e))}catch(e){s(e)}}function i(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,i)}l((r=r.apply(e,t||[])).next())}))}function l(e,t){var n,r,a,s,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return s={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function i(s){return function(i){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&s[0]?r.return:s[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,s[1])).done)return a;switch(r=0,a&&(s=[2&s[0],a.value]),s[0]){case 0:case 1:a=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,r=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==s[0]&&2!==s[0])){o=0;continue}if(3===s[0]&&(!a||s[1]>a[0]&&s[1]<a[3])){o.label=s[1];break}if(6===s[0]&&o.label<a[1]){o.label=a[1],a=s;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(s);break}a[2]&&o.ops.pop(),o.trys.pop();continue}s=t.call(e,o)}catch(e){s=[6,e],r=0}finally{n=a=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,i])}}}function u(e,t,n,r){return new(n||(n=Promise))((function(a,s){function o(e){try{l(r.next(e))}catch(e){s(e)}}function i(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,i)}l((r=r.apply(e,t||[])).next())}))}function c(e,t){var n,r,a,s,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return s={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function i(s){return function(i){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&s[0]?r.return:s[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,s[1])).done)return a;switch(r=0,a&&(s=[2&s[0],a.value]),s[0]){case 0:case 1:a=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,r=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!(a=(a=o.trys).length>0&&a[a.length-1])&&(6===s[0]||2===s[0])){o=0;continue}if(3===s[0]&&(!a||s[1]>a[0]&&s[1]<a[3])){o.label=s[1];break}if(6===s[0]&&o.label<a[1]){o.label=a[1],a=s;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(s);break}a[2]&&o.ops.pop(),o.trys.pop();continue}s=t.call(e,o)}catch(e){s=[6,e],r=0}finally{n=a=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,i])}}}var p=function(e){return{startEndTensor:e,startPoint:a.slice(e,[0,0],[-1,2]),endPoint:a.slice(e,[0,2],[-1,2])}},d={strides:[8,16],anchors:[2,6]};function f(e,t){var n,r,s;if(e.topLeft instanceof a.Tensor&&e.bottomRight instanceof a.Tensor){var o=a.tidy((function(){return[a.concat([a.slice(a.sub(t-1,e.topLeft),0,1),a.slice(e.topLeft,1,1)]),a.concat([a.sub(t-1,a.slice(e.bottomRight,0,1)),a.slice(e.bottomRight,1,1)])]}));n=o[0],r=o[1],null!=e.landmarks&&(s=a.tidy((function(){var n=a.sub(a.tensor1d([t-1,0]),e.landmarks),r=a.tensor1d([1,-1]);return a.mul(n,r)})))}else{var i=e.topLeft,l=i[0],u=i[1],c=e.bottomRight,p=c[0],d=c[1];n=[t-1-l,u],r=[t-1-p,d],null!=e.landmarks&&(s=e.landmarks.map((function(e){return[t-1-e[0],e[1]]})))}var f={topLeft:n,bottomRight:r};return null!=s&&(f.landmarks=s),null!=e.probability&&(f.probability=e.probability instanceof a.Tensor?e.probability.clone():e.probability),f}function m(e,t){return a.tidy((function(){var n,r,s,o,i,l;return n=e.hasOwnProperty("box")?e.box:e,a.squeeze((r=n,s=t,o=a.mul(r.startPoint,s),i=a.mul(r.endPoint,s),l=a.concat2d([o,i],1),p(l)).startEndTensor)}))}var h=function(){function e(e,t,n,r,s,o){this.blazeFaceModel=e,this.width=t,this.height=n,this.maxFaces=r,this.anchorsData=function(e,t,n){for(var r=[],a=0;a<n.strides.length;a++)for(var s=n.strides[a],o=Math.floor((t+s-1)/s),i=Math.floor((e+s-1)/s),l=n.anchors[a],u=0;u<o;u++)for(var c=s*(u+.5),p=0;p<i;p++)for(var d=s*(p+.5),f=0;f<l;f++)r.push([d,c]);return r}(t,n,d),this.anchors=a.tensor2d(this.anchorsData),this.inputSizeData=[t,n],this.inputSize=a.tensor1d([t,n]),this.iouThreshold=s,this.scoreThreshold=o}return e.prototype.getBoundingBoxes=function(e,t,n){return void 0===n&&(n=!0),u(this,void 0,void 0,(function(){var r,s,o,i,l,d,f,m,h,g,b,y,k,_,w=this;return c(this,(function(v){switch(v.label){case 0:return r=a.tidy((function(){var t,n,r,s,o,i,l,u,c,p,d,f,m,h=a.image.resizeBilinear(e,[w.width,w.height]),g=a.mul(a.sub(a.div(h,255),.5),2),b=w.blazeFaceModel.predict(g),y=a.squeeze(b),k=(t=y,n=w.anchors,r=w.inputSize,s=a.slice(t,[0,1],[-1,2]),o=a.add(s,n),i=a.slice(t,[0,3],[-1,2]),l=a.div(i,r),u=a.div(o,r),c=a.div(l,2),p=a.sub(u,c),d=a.add(u,c),f=a.mul(p,r),m=a.mul(d,r),a.concat2d([f,m],1)),_=a.slice(y,[0,0],[-1,1]);return[y,k,a.squeeze(a.sigmoid(_))]})),s=r[0],o=r[1],i=r[2],l=console.warn,console.warn=function(){},d=a.image.nonMaxSuppression(o,i,this.maxFaces,this.iouThreshold,this.scoreThreshold),console.warn=l,[4,d.array()];case 1:return f=v.sent(),d.dispose(),m=f.map((function(e){return a.slice(o,[e,0],[1,-1])})),t?[3,3]:[4,Promise.all(m.map((function(e){return u(w,void 0,void 0,(function(){var t;return c(this,(function(n){switch(n.label){case 0:return[4,e.array()];case 1:return t=n.sent(),e.dispose(),[2,t]}}))}))})))];case 2:m=v.sent(),v.label=3;case 3:for(h=e.shape[1],g=e.shape[2],b=t?a.div([g,h],this.inputSize):[g/this.inputSizeData[0],h/this.inputSizeData[1]],y=[],k=function(e){var r=m[e],o=a.tidy((function(){var o=p(r instanceof a.Tensor?r:a.tensor2d(r));if(!n)return o;var l,u=f[e];return l=t?a.slice(w.anchors,[u,0],[1,2]):w.anchorsData[u],{box:o,landmarks:a.reshape(a.squeeze(a.slice(s,[u,5],[1,-1])),[6,-1]),probability:a.slice(i,[u],[1]),anchor:l}}));y.push(o)},_=0;_<m.length;_++)k(_);return o.dispose(),i.dispose(),s.dispose(),[2,{boxes:y,scaleFactor:b}]}}))}))},e.prototype.estimateFaces=function(e,t,n,r){return void 0===t&&(t=!1),void 0===n&&(n=!1),void 0===r&&(r=!0),u(this,void 0,void 0,(function(){var s,o,i,l,p,d,h=this;return c(this,(function(g){switch(g.label){case 0:return s=(b=e)instanceof a.Tensor?[b.shape[0],b.shape[1]]:[b.height,b.width],o=s[1],i=a.tidy((function(){return e instanceof a.Tensor||(e=a.browser.fromPixels(e)),a.expandDims(a.cast(e,"float32"),0)})),[4,this.getBoundingBoxes(i,t,r)];case 1:return l=g.sent(),p=l.boxes,d=l.scaleFactor,i.dispose(),t?[2,p.map((function(e){var t=m(e,d),s={topLeft:a.slice(t,[0],[2]),bottomRight:a.slice(t,[2],[2])};if(r){var i=e,l=i.landmarks,u=i.probability,c=i.anchor,p=a.mul(a.add(l,c),d);s.landmarks=p,s.probability=u}return n&&(s=f(s,o)),s}))]:[2,Promise.all(p.map((function(e){return u(h,void 0,void 0,(function(){var t,a,s,i,l,p,h,g,b,y,k,_=this;return c(this,(function(w){switch(w.label){case 0:return t=m(e,d),r?[3,2]:[4,t.array()];case 1:return l=w.sent(),a={topLeft:l.slice(0,2),bottomRight:l.slice(2)},[3,4];case 2:return[4,Promise.all([e.landmarks,t,e.probability].map((function(e){return u(_,void 0,void 0,(function(){return c(this,(function(t){return[2,e.array()]}))}))})))];case 3:s=w.sent(),i=s[0],l=s[1],p=s[2],h=e.anchor,b=(g=d)[0],y=g[1],k=i.map((function(e){return[(e[0]+h[0])*b,(e[1]+h[1])*y]})),a={topLeft:l.slice(0,2),bottomRight:l.slice(2),landmarks:k,probability:p},function(e){e.startEndTensor.dispose(),e.startPoint.dispose(),e.endPoint.dispose()}(e.box),e.landmarks.dispose(),e.probability.dispose(),w.label=4;case 4:return t.dispose(),n&&(a=f(a,o)),[2,a]}}))}))})))]}var b}))}))},e}();function g(e){var t=void 0===e?{}:e,n=t.maxFaces,r=void 0===n?10:n,a=t.inputWidth,o=void 0===a?128:a,i=t.inputHeight,l=void 0===i?128:i,p=t.iouThreshold,d=void 0===p?.3:p,f=t.scoreThreshold,m=void 0===f?.75:f,g=t.modelUrl;return u(this,void 0,void 0,(function(){var e;return c(this,(function(t){switch(t.label){case 0:return null==g?[3,2]:[4,s.loadGraphModel(g)];case 1:return e=t.sent(),[3,4];case 2:return[4,s.loadGraphModel("https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1",{fromTFHub:!0})];case 3:e=t.sent(),t.label=4;case 4:return[2,new h(e,o,l,r,d,m)]}}))}))}var b={silhouette:[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],lipsUpperOuter:[61,185,40,39,37,0,267,269,270,409,291],lipsLowerOuter:[146,91,181,84,17,314,405,321,375,291],lipsUpperInner:[78,191,80,81,82,13,312,311,310,415,308],lipsLowerInner:[78,95,88,178,87,14,317,402,318,324,308],rightEyeUpper0:[246,161,160,159,158,157,173],rightEyeLower0:[33,7,163,144,145,153,154,155,133],rightEyeUpper1:[247,30,29,27,28,56,190],rightEyeLower1:[130,25,110,24,23,22,26,112,243],rightEyeUpper2:[113,225,224,223,222,221,189],rightEyeLower2:[226,31,228,229,230,231,232,233,244],rightEyeLower3:[143,111,117,118,119,120,121,128,245],rightEyebrowUpper:[156,70,63,105,66,107,55,193],rightEyebrowLower:[35,124,46,53,52,65],rightEyeIris:[473,474,475,476,477],leftEyeUpper0:[466,388,387,386,385,384,398],leftEyeLower0:[263,249,390,373,374,380,381,382,362],leftEyeUpper1:[467,260,259,257,258,286,414],leftEyeLower1:[359,255,339,254,253,252,256,341,463],leftEyeUpper2:[342,445,444,443,442,441,413],leftEyeLower2:[446,261,448,449,450,451,452,453,464],leftEyeLower3:[372,340,346,347,348,349,350,357,465],leftEyebrowUpper:[383,300,293,334,296,336,285,417],leftEyebrowLower:[265,353,276,283,282,295],leftEyeIris:[468,469,470,471,472],midwayBetweenEyes:[168],noseTip:[1],noseBottom:[2],noseRightCorner:[98],noseLeftCorner:[327],rightCheek:[205],leftCheek:[425]};function y(e){return[Math.abs(e.endPoint[0]-e.startPoint[0]),Math.abs(e.endPoint[1]-e.startPoint[1])]}function k(e){return[e.startPoint[0]+(e.endPoint[0]-e.startPoint[0])/2,e.startPoint[1]+(e.endPoint[1]-e.startPoint[1])/2]}function _(e,t){void 0===t&&(t=1.5);var n=k(e),r=y(e),a=[t*r[0]/2,t*r[1]/2];return{startPoint:[n[0]-a[0],n[1]-a[1]],endPoint:[n[0]+a[0],n[1]+a[1]],landmarks:e.landmarks}}function w(e){var t=k(e),n=y(e),r=Math.max.apply(Math,n)/2;return{startPoint:[t[0]-r,t[1]-r],endPoint:[t[0]+r,t[1]+r],landmarks:e.landmarks}}var v=[[1,0,0],[0,1,0],[0,0,1]];function j(e,t){return[[1,0,e],[0,1,t],[0,0,1]]}function C(e,t){for(var n=0,r=0;r<e.length;r++)n+=e[r]*t[r];return n}function I(e,t){for(var n=[],r=0;r<e.length;r++)n.push(e[r][t]);return n}function x(e,t){for(var n=[],r=e.length,a=0;a<r;a++){n.push([]);for(var s=0;s<r;s++)n[a].push(C(e[a],I(t,s)))}return n}function D(e,t){var n=Math.cos(e),r=Math.sin(e),a=[[n,-r,0],[r,n,0],[0,0,1]],s=x(j(t[0],t[1]),a);return x(s,j(-t[0],-t[1]))}var M=[13,b.midwayBetweenEyes[0]],S=[3,2],F=b.leftEyeLower0,A=[F[0],F[F.length-1]],N=b.rightEyeLower0,P=[N[0],N[N.length-1]],E=[{key:"EyeUpper0",indices:[9,10,11,12,13,14,15]},{key:"EyeUpper1",indices:[25,26,27,28,29,30,31]},{key:"EyeUpper2",indices:[41,42,43,44,45,46,47]},{key:"EyeLower0",indices:[0,1,2,3,4,5,6,7,8]},{key:"EyeLower1",indices:[16,17,18,19,20,21,22,23,24]},{key:"EyeLower2",indices:[32,33,34,35,36,37,38,39,40]},{key:"EyeLower3",indices:[54,55,56,57,58,59,60,61,62]},{key:"EyebrowUpper",indices:[63,64,65,66,67,68,69,70]},{key:"EyebrowLower",indices:[48,49,50,51,52,53]}];function R(e,t,n,r){for(var a=0;a<E.length;a++){var s=E[a],o=s.key,i=s.indices,l=b[""+n+o];if(null==r||r.includes(o))for(var u=0;u<i.length;u++){var c=i[u];e[l[u]]=[t[c][0],t[c][1],(t[c][2]+e[l[u]][2])/2]}}}var B=function(){function e(e,t,n,r,a,s,o){this.regionsOfInterest=[],this.runsWithoutFaceDetector=0,this.boundingBoxDetector=e,this.meshDetector=t,this.irisModel=o,this.meshWidth=n,this.meshHeight=r,this.maxContinuousChecks=a,this.maxFaces=s}return e.prototype.transformRawCoords=function(e,t,n,r){var a,s,o,i,l=this,u=y({startPoint:t.startPoint,endPoint:t.endPoint}),c=[u[0]/this.meshWidth,u[1]/this.meshHeight],p=e.map((function(e){return[c[0]*(e[0]-l.meshWidth/2),c[1]*(e[1]-l.meshHeight/2),e[2]]})),d=D(n,[0,0]),f=p.map((function(e){return(t=e,n=d,[C(t,n[0]),C(t,n[1])]).concat([e[2]]);var t,n})),m=(s=[[(a=r)[0][0],a[1][0]],[a[0][1],a[1][1]]],o=[a[0][2],a[1][2]],i=[-C(s[0],o),-C(s[1],o)],[s[0].concat(i[0]),s[1].concat(i[1]),[0,0,1]]),h=k({startPoint:t.startPoint,endPoint:t.endPoint}).concat([1]),g=[C(h,m[0]),C(h,m[1])];return f.map((function(e){return[e[0]+g[0],e[1]+g[1],e[2]]}))},e.prototype.getLeftToRightEyeDepthDifference=function(e){return e[A[0]][2]-e[P[0]][2]},e.prototype.getEyeBox=function(e,t,n,r,s){void 0===s&&(s=!1);var o=w(_(this.calculateLandmarksBoundingBox([e[n],e[r]]),2.3)),i=y(o),l=a.image.cropAndResize(t,[[o.startPoint[1]/this.meshHeight,o.startPoint[0]/this.meshWidth,o.endPoint[1]/this.meshHeight,o.endPoint[0]/this.meshWidth]],[0],[64,64]);return s&&(l=a.image.flipLeftRight(l)),{box:o,boxSize:i,crop:l}},e.prototype.getEyeCoords=function(e,t,n,r){void 0===r&&(r=!1);for(var a=[],s=0;s<76;s++){var o=e[3*s],i=e[3*s+1],l=e[3*s+2];a.push([(r?1-o/64:o/64)*n[0]+t.startPoint[0],i/64*n[1]+t.startPoint[1],l])}return{rawCoords:a,iris:a.slice(71)}},e.prototype.getAdjustedIrisCoords=function(e,t,n){var r=e[b[n+"EyeUpper0"][3]][2],a=e[b[n+"EyeLower0"][4]][2],s=(r+a)/2;return t.map((function(e,t){var n=s;return 2===t?n=r:4===t&&(n=a),[e[0],e[1],n]}))},e.prototype.predict=function(e,t){return i(this,void 0,void 0,(function(){var n,r,s,i,u=this;return l(this,(function(l){switch(l.label){case 0:return this.shouldUpdateRegionsOfInterest()?[4,this.boundingBoxDetector.getBoundingBoxes(e,!1,!0)]:[3,2];case 1:return n=l.sent(),r=n.boxes,s=n.scaleFactor,0===r.length?(this.regionsOfInterest=[],[2,null]):(i=r.map((function(e){var t,n,r={startPoint:a.squeeze(e.box.startPoint).arraySync(),endPoint:a.squeeze(e.box.endPoint).arraySync()},i=w(_((n=s,{startPoint:[(t=r).startPoint[0]*n[0],t.startPoint[1]*n[1]],endPoint:[t.endPoint[0]*n[0],t.endPoint[1]*n[1]]})));return o({},i,{landmarks:e.landmarks.arraySync()})})),r.forEach((function(e){null!=e&&null!=e.startPoint&&(e.startEndTensor.dispose(),e.startPoint.dispose(),e.endPoint.dispose())})),this.updateRegionsOfInterest(i),this.runsWithoutFaceDetector=0,[3,3]);case 2:this.runsWithoutFaceDetector++,l.label=3;case 3:return[2,a.tidy((function(){return u.regionsOfInterest.map((function(n,r){var s,i,l,c,p=n.landmarks.length>=468,d=M[0],f=M[1];!1===p&&(d=S[0],f=S[1]),i=n.landmarks[d],l=n.landmarks[f],s=(c=Math.PI/2-Math.atan2(-(l[1]-i[1]),l[0]-i[0]))-2*Math.PI*Math.floor((c+Math.PI)/(2*Math.PI));var m=k({startPoint:n.startPoint,endPoint:n.endPoint}),h=[m[0]/e.shape[2],m[1]/e.shape[1]],g=e,b=v;0!==s&&(g=a.image.rotateWithOffset(e,s,0,h),b=D(-s,m));var y={startPoint:n.startPoint,endPoint:n.endPoint},j=a.div(function(e,t,n){var r=t.shape[1],s=t.shape[2],o=[[e.startPoint[1]/r,e.startPoint[0]/s,e.endPoint[1]/r,e.endPoint[0]/s]];return a.image.cropAndResize(t,o,[0],n,"bilinear",0)}(y,g,[u.meshHeight,u.meshWidth]),255),C=u.meshDetector.predict(j),I=C[1],x=C[2],F=a.reshape(x,[-1,3]).arraySync();if(t){var N=u.getEyeBox(F,j,A[0],A[1],!0),E=N.box,B=N.boxSize,T=N.crop,q=u.getEyeBox(F,j,P[0],P[1]),O=q.box,W=q.boxSize,L=q.crop,G=u.irisModel.predict(a.concat([T,L])).dataSync(),U=G.slice(0,228),z=u.getEyeCoords(U,E,B,!0),H=z.rawCoords,V=z.iris,K=G.slice(228),Y=u.getEyeCoords(K,O,W),$=Y.rawCoords,X=Y.iris,Q=u.getLeftToRightEyeDepthDifference(F);Math.abs(Q)<30?(R(F,H,"left"),R(F,$,"right")):Q<1?R(F,H,"left",["EyeUpper0","EyeLower0"]):R(F,$,"right",["EyeUpper0","EyeLower0"]);var Z=u.getAdjustedIrisCoords(F,V,"left"),J=u.getAdjustedIrisCoords(F,X,"right");F=F.concat(Z).concat(J)}var ee=u.transformRawCoords(F,n,s,b),te=a.tensor2d(ee),ne=_(u.calculateLandmarksBoundingBox(ee)),re=w(ne);return u.regionsOfInterest[r]=o({},re,{landmarks:te.arraySync()}),{coords:a.tensor2d(F,[F.length,3]),scaledCoords:te,box:ne,flag:a.squeeze(I)}}))}))]}}))}))},e.prototype.updateRegionsOfInterest=function(e){for(var t=0;t<e.length;t++){var n=e[t],r=this.regionsOfInterest[t],a=0;if(r&&r.startPoint){var s=n.startPoint,o=s[0],i=s[1],l=n.endPoint,u=l[0],c=l[1],p=r.startPoint,d=p[0],f=p[1],m=r.endPoint,h=m[0],g=m[1],b=Math.max(o,d),y=Math.max(i,f),k=(Math.min(u,h)-b)*(Math.min(c,g)-y);a=k/((u-o)*(c-i)+(h-d)*(g-i)-k)}a<.25&&(this.regionsOfInterest[t]=n)}this.regionsOfInterest=this.regionsOfInterest.slice(0,e.length)},e.prototype.clearRegionOfInterest=function(e){null!=this.regionsOfInterest[e]&&(this.regionsOfInterest=this.regionsOfInterest.slice(0,e).concat(this.regionsOfInterest.slice(e+1)))},e.prototype.shouldUpdateRegionsOfInterest=function(){var e=this.regionsOfInterest.length,t=0===e;return 1===this.maxFaces||t?t:e!==this.maxFaces&&this.runsWithoutFaceDetector>=this.maxContinuousChecks},e.prototype.calculateLandmarksBoundingBox=function(e){var t=e.map((function(e){return e[0]})),n=e.map((function(e){return e[1]}));return{startPoint:[Math.min.apply(Math,t),Math.min.apply(Math,n)],endPoint:[Math.max.apply(Math,t),Math.max.apply(Math,n)]}},e}(),T=[[.499976992607117,.652534008026123],[.500025987625122,.547487020492554],[.499974012374878,.602371990680695],[.482113003730774,.471979022026062],[.500150978565216,.527155995368958],[.499909996986389,.498252987861633],[.499523013830185,.40106201171875],[.289712011814117,.380764007568359],[.499954998493195,.312398016452789],[.499987006187439,.269918978214264],[.500023007392883,.107050001621246],[.500023007392883,.666234016418457],[.5000159740448,.679224014282227],[.500023007392883,.692348003387451],[.499976992607117,.695277988910675],[.499976992607117,.70593398809433],[.499976992607117,.719385027885437],[.499976992607117,.737019002437592],[.499967992305756,.781370997428894],[.499816000461578,.562981009483337],[.473773002624512,.573909997940063],[.104906998574734,.254140973091125],[.365929991006851,.409575998783112],[.338757991790771,.41302502155304],[.311120003461838,.409460008144379],[.274657994508743,.389131009578705],[.393361985683441,.403706014156342],[.345234006643295,.344011008739471],[.370094001293182,.346076011657715],[.319321990013123,.347265005111694],[.297903001308441,.353591024875641],[.24779200553894,.410809993743896],[.396889001131058,.842755019664764],[.280097991228104,.375599980354309],[.106310002505779,.399955987930298],[.2099249958992,.391353011131287],[.355807989835739,.534406006336212],[.471751004457474,.65040397644043],[.474155008792877,.680191993713379],[.439785003662109,.657229006290436],[.414617002010345,.66654098033905],[.450374007225037,.680860996246338],[.428770989179611,.682690978050232],[.374971002340317,.727805018424988],[.486716985702515,.547628998756409],[.485300987958908,.527395009994507],[.257764995098114,.314490020275116],[.401223003864288,.455172002315521],[.429818987846375,.548614978790283],[.421351999044418,.533740997314453],[.276895999908447,.532056987285614],[.483370006084442,.499586999416351],[.33721199631691,.282882988452911],[.296391993761063,.293242990970612],[.169294998049736,.193813979625702],[.447580009698868,.302609980106354],[.392390012741089,.353887975215912],[.354490011930466,.696784019470215],[.067304998636246,.730105042457581],[.442739009857178,.572826027870178],[.457098007202148,.584792017936707],[.381974011659622,.694710969924927],[.392388999462128,.694203019142151],[.277076005935669,.271932005882263],[.422551989555359,.563233017921448],[.385919004678726,.281364023685455],[.383103013038635,.255840003490448],[.331431001424789,.119714021682739],[.229923993349075,.232002973556519],[.364500999450684,.189113974571228],[.229622006416321,.299540996551514],[.173287004232407,.278747975826263],[.472878992557526,.666198015213013],[.446828007698059,.668527007102966],[.422762006521225,.673889994621277],[.445307999849319,.580065965652466],[.388103008270264,.693961024284363],[.403039008378983,.706539988517761],[.403629004955292,.693953037261963],[.460041999816895,.557139039039612],[.431158006191254,.692366003990173],[.452181994915009,.692366003990173],[.475387006998062,.692366003990173],[.465828001499176,.779190003871918],[.472328990697861,.736225962638855],[.473087012767792,.717857003211975],[.473122000694275,.704625964164734],[.473033010959625,.695277988910675],[.427942007780075,.695277988910675],[.426479011774063,.703539967536926],[.423162013292313,.711845993995667],[.4183090031147,.720062971115112],[.390094995498657,.639572978019714],[.013953999616206,.560034036636353],[.499913990497589,.58014702796936],[.413199990987778,.69539999961853],[.409626007080078,.701822996139526],[.468080013990402,.601534962654114],[.422728985548019,.585985004901886],[.463079988956451,.593783974647522],[.37211999297142,.47341400384903],[.334562003612518,.496073007583618],[.411671012639999,.546965003013611],[.242175996303558,.14767599105835],[.290776997804642,.201445996761322],[.327338010072708,.256527006626129],[.399509996175766,.748921036720276],[.441727995872498,.261676013469696],[.429764986038208,.187834024429321],[.412198007106781,.108901023864746],[.288955003023148,.398952007293701],[.218936994671822,.435410976409912],[.41278201341629,.398970007896423],[.257135003805161,.355440020561218],[.427684992551804,.437960982322693],[.448339998722076,.536936044692993],[.178560003638268,.45755398273468],[.247308000922203,.457193970680237],[.286267012357712,.467674970626831],[.332827985286713,.460712015628815],[.368755996227264,.447206974029541],[.398963987827301,.432654976844788],[.476410001516342,.405806005001068],[.189241006970406,.523923993110657],[.228962004184723,.348950982093811],[.490725994110107,.562400996685028],[.404670000076294,.485132992267609],[.019469000399113,.401564002037048],[.426243007183075,.420431017875671],[.396993011236191,.548797011375427],[.266469985246658,.376977026462555],[.439121007919312,.51895797252655],[.032313998788595,.644356966018677],[.419054001569748,.387154996395111],[.462783008813858,.505746960639954],[.238978996872902,.779744982719421],[.198220998048782,.831938028335571],[.107550002634525,.540755033493042],[.183610007166862,.740257024765015],[.134409993886948,.333683013916016],[.385764002799988,.883153975009918],[.490967005491257,.579378008842468],[.382384985685349,.508572995662689],[.174399003386497,.397670984268188],[.318785011768341,.39623498916626],[.343364000320435,.400596976280212],[.396100014448166,.710216999053955],[.187885001301765,.588537991046906],[.430987000465393,.944064974784851],[.318993002176285,.898285031318665],[.266247987747192,.869701027870178],[.500023007392883,.190576016902924],[.499976992607117,.954452991485596],[.366169989109039,.398822009563446],[.393207013607025,.39553701877594],[.410373002290726,.391080021858215],[.194993004202843,.342101991176605],[.388664990663528,.362284004688263],[.365961998701096,.355970978736877],[.343364000320435,.355356991291046],[.318785011768341,.35834002494812],[.301414996385574,.363156020641327],[.058132998645306,.319076001644135],[.301414996385574,.387449026107788],[.499987989664078,.618434011936188],[.415838003158569,.624195992946625],[.445681989192963,.566076993942261],[.465844005346298,.620640993118286],[.49992299079895,.351523995399475],[.288718998432159,.819945991039276],[.335278987884521,.852819979190826],[.440512001514435,.902418971061707],[.128294005990028,.791940987110138],[.408771991729736,.373893976211548],[.455606997013092,.451801002025604],[.499877005815506,.908990025520325],[.375436991453171,.924192011356354],[.11421000212431,.615022003650665],[.448662012815475,.695277988910675],[.4480200111866,.704632043838501],[.447111994028091,.715808033943176],[.444831997156143,.730794012546539],[.430011987686157,.766808986663818],[.406787008047104,.685672998428345],[.400738000869751,.681069016456604],[.392399996519089,.677703022956848],[.367855995893478,.663918972015381],[.247923001646996,.601333022117615],[.452769994735718,.420849978923798],[.43639200925827,.359887003898621],[.416164010763168,.368713974952698],[.413385987281799,.692366003990173],[.228018000721931,.683571994304657],[.468268007040024,.352671027183533],[.411361992359161,.804327011108398],[.499989002943039,.469825029373169],[.479153990745544,.442654013633728],[.499974012374878,.439637005329132],[.432112008333206,.493588984012604],[.499886006116867,.866917014122009],[.49991300702095,.821729004383087],[.456548988819122,.819200992584229],[.344549000263214,.745438992977142],[.37890899181366,.574010014533997],[.374292999505997,.780184984207153],[.319687992334366,.570737957954407],[.357154995203018,.604269981384277],[.295284003019333,.621580958366394],[.447750002145767,.862477004528046],[.410986006259918,.508723020553589],[.31395098567009,.775308012962341],[.354128003120422,.812552988529205],[.324548006057739,.703992962837219],[.189096003770828,.646299958229065],[.279776990413666,.71465802192688],[.1338230073452,.682700991630554],[.336768001317978,.644733011722565],[.429883986711502,.466521978378296],[.455527991056442,.548622965812683],[.437114000320435,.558896005153656],[.467287987470627,.529924988746643],[.414712011814117,.335219979286194],[.37704598903656,.322777986526489],[.344107985496521,.320150971412659],[.312875986099243,.32233202457428],[.283526003360748,.333190023899078],[.241245999932289,.382785975933075],[.102986000478268,.468762993812561],[.267612010240555,.424560010433197],[.297879010438919,.433175981044769],[.333433985710144,.433878004550934],[.366427004337311,.426115989685059],[.396012008190155,.416696012020111],[.420121014118195,.41022801399231],[.007561000064015,.480777025222778],[.432949006557465,.569517970085144],[.458638995885849,.479089021682739],[.473466008901596,.545744001865387],[.476087987422943,.563830018043518],[.468472003936768,.555056989192963],[.433990985155106,.582361996173859],[.483518004417419,.562983989715576],[.482482999563217,.57784903049469],[.42645001411438,.389798998832703],[.438998997211456,.39649498462677],[.450067013502121,.400434017181396],[.289712011814117,.368252992630005],[.276670008897781,.363372981548309],[.517862021923065,.471948027610779],[.710287988185883,.380764007568359],[.526226997375488,.573909997940063],[.895093023777008,.254140973091125],[.634069979190826,.409575998783112],[.661242008209229,.41302502155304],[.688880026340485,.409460008144379],[.725341975688934,.389131009578705],[.606630027294159,.40370500087738],[.654766023159027,.344011008739471],[.629905998706818,.346076011657715],[.680678009986877,.347265005111694],[.702096998691559,.353591024875641],[.75221198797226,.410804986953735],[.602918028831482,.842862963676453],[.719901978969574,.375599980354309],[.893692970275879,.399959981441498],[.790081977844238,.391354024410248],[.643998026847839,.534487962722778],[.528249025344849,.65040397644043],[.525849997997284,.680191040039062],[.560214996337891,.657229006290436],[.585384011268616,.66654098033905],[.549625992774963,.680860996246338],[.57122802734375,.682691991329193],[.624852001667023,.72809898853302],[.513050019741058,.547281980514526],[.51509702205658,.527251958847046],[.742246985435486,.314507007598877],[.598631024360657,.454979002475739],[.570338010787964,.548575043678284],[.578631997108459,.533622980117798],[.723087012767792,.532054007053375],[.516445994377136,.499638974666595],[.662801027297974,.282917976379395],[.70362401008606,.293271005153656],[.830704987049103,.193813979625702],[.552385985851288,.302568018436432],[.607609987258911,.353887975215912],[.645429015159607,.696707010269165],[.932694971561432,.730105042457581],[.557260990142822,.572826027870178],[.542901992797852,.584792017936707],[.6180260181427,.694710969924927],[.607590973377228,.694203019142151],[.722943007946014,.271963000297546],[.577413976192474,.563166975975037],[.614082992076874,.281386971473694],[.616907000541687,.255886018276215],[.668509006500244,.119913995265961],[.770092010498047,.232020974159241],[.635536015033722,.189248979091644],[.77039098739624,.299556016921997],[.826722025871277,.278755009174347],[.527121007442474,.666198015213013],[.553171992301941,.668527007102966],[.577238023281097,.673889994621277],[.554691970348358,.580065965652466],[.611896991729736,.693961024284363],[.59696102142334,.706539988517761],[.596370995044708,.693953037261963],[.539958000183105,.557139039039612],[.568841993808746,.692366003990173],[.547818005084991,.692366003990173],[.52461302280426,.692366003990173],[.534089982509613,.779141008853912],[.527670979499817,.736225962638855],[.526912987232208,.717857003211975],[.526877999305725,.704625964164734],[.526966989040375,.695277988910675],[.572058022022247,.695277988910675],[.573521018028259,.703539967536926],[.57683801651001,.711845993995667],[.581691026687622,.720062971115112],[.609944999217987,.639909982681274],[.986046016216278,.560034036636353],[.5867999792099,.69539999961853],[.590372025966644,.701822996139526],[.531915009021759,.601536989212036],[.577268004417419,.585934996604919],[.536915004253387,.593786001205444],[.627542972564697,.473352015018463],[.665585994720459,.495950996875763],[.588353991508484,.546862006187439],[.757824003696442,.14767599105835],[.709249973297119,.201507985591888],[.672684013843536,.256581008434296],[.600408971309662,.74900496006012],[.55826598405838,.261672019958496],[.570303976535797,.187870979309082],[.588165998458862,.109044015407562],[.711045026779175,.398952007293701],[.781069993972778,.435405015945435],[.587247014045715,.398931980133057],[.742869973182678,.355445981025696],[.572156012058258,.437651991844177],[.55186802148819,.536570012569427],[.821442008018494,.457556009292603],[.752701997756958,.457181990146637],[.71375697851181,.467626988887787],[.66711300611496,.460672974586487],[.631101012229919,.447153985500336],[.6008620262146,.432473003864288],[.523481011390686,.405627012252808],[.810747981071472,.523926019668579],[.771045982837677,.348959028720856],[.509127020835876,.562718033790588],[.595292985439301,.485023975372314],[.980530977249146,.401564002037048],[.573499977588654,.420000016689301],[.602994978427887,.548687994480133],[.733529984951019,.376977026462555],[.560611009597778,.519016981124878],[.967685997486115,.644356966018677],[.580985009670258,.387160003185272],[.537728011608124,.505385041236877],[.760966002941132,.779752969741821],[.801778972148895,.831938028335571],[.892440974712372,.54076099395752],[.816350996494293,.740260004997253],[.865594983100891,.333687007427216],[.614073991775513,.883246004581451],[.508952975273132,.579437971115112],[.617941975593567,.508316040039062],[.825608015060425,.397674977779388],[.681214988231659,.39623498916626],[.656635999679565,.400596976280212],[.603900015354156,.710216999053955],[.81208598613739,.588539004325867],[.56801301240921,.944564998149872],[.681007981300354,.898285031318665],[.733752012252808,.869701027870178],[.633830010890961,.398822009563446],[.606792986392975,.39553701877594],[.589659988880157,.391062021255493],[.805015981197357,.342108011245728],[.611334979534149,.362284004688263],[.634037971496582,.355970978736877],[.656635999679565,.355356991291046],[.681214988231659,.35834002494812],[.698584973812103,.363156020641327],[.941866993904114,.319076001644135],[.698584973812103,.387449026107788],[.584177017211914,.624107003211975],[.554318010807037,.566076993942261],[.534153997898102,.62064003944397],[.711217999458313,.819975018501282],[.664629995822906,.852871000766754],[.559099972248077,.902631998062134],[.871706008911133,.791940987110138],[.591234028339386,.373893976211548],[.544341027736664,.451583981513977],[.624562978744507,.924192011356354],[.88577002286911,.615028977394104],[.551338016986847,.695277988910675],[.551980018615723,.704632043838501],[.552887976169586,.715808033943176],[.555167973041534,.730794012546539],[.569944024085999,.767035007476807],[.593203008174896,.685675978660583],[.599261999130249,.681069016456604],[.607599973678589,.677703022956848],[.631937980651855,.663500010967255],[.752032995223999,.601315021514893],[.547226011753082,.420395016670227],[.563543975353241,.359827995300293],[.583841025829315,.368713974952698],[.586614012718201,.692366003990173],[.771915018558502,.683578014373779],[.531597018241882,.352482974529266],[.588370978832245,.804440975189209],[.52079701423645,.442565023899078],[.567984998226166,.493479013442993],[.543282985687256,.819254994392395],[.655317008495331,.745514988899231],[.621008992195129,.574018001556396],[.625559985637665,.78031200170517],[.680198013782501,.570719003677368],[.64276397228241,.604337990283966],[.704662978649139,.621529996395111],[.552012026309967,.862591981887817],[.589071989059448,.508637011051178],[.685944974422455,.775357007980347],[.645735025405884,.812640011310577],[.675342977046967,.703978002071381],[.810858011245728,.646304965019226],[.72012197971344,.714666962623596],[.866151988506317,.682704985141754],[.663187026977539,.644596993923187],[.570082008838654,.466325998306274],[.544561982154846,.548375964164734],[.562758982181549,.558784961700439],[.531987011432648,.530140042304993],[.585271000862122,.335177004337311],[.622952997684479,.32277899980545],[.655896008014679,.320163011550903],[.687132000923157,.322345972061157],[.716481983661652,.333200991153717],[.758756995201111,.382786989212036],[.897013008594513,.468769013881683],[.732392013072968,.424547016620636],[.70211398601532,.433162987232208],[.66652500629425,.433866024017334],[.633504986763,.426087975502014],[.603875994682312,.416586995124817],[.579657971858978,.409945011138916],[.992439985275269,.480777025222778],[.567192018032074,.569419980049133],[.54136598110199,.478899002075195],[.526564002037048,.546118021011353],[.523913025856018,.563830018043518],[.531529009342194,.555056989192963],[.566035985946655,.582329034805298],[.51631098985672,.563053965568542],[.5174720287323,.577877044677734],[.573594987392426,.389806985855103],[.560697972774506,.395331978797913],[.549755990505219,.399751007556915],[.710287988185883,.368252992630005],[.723330020904541,.363372981548309]];function q(e){return i(this,void 0,void 0,(function(){var t,n,r,a,s,o,i,u,c,p,d,f,m,h,g,b;return l(this,(function(l){switch(l.label){case 0:return t=e.maxContinuousChecks,n=void 0===t?5:t,r=e.detectionConfidence,a=void 0===r?.9:r,s=e.maxFaces,o=void 0===s?10:s,i=e.iouThreshold,u=void 0===i?.3:i,c=e.scoreThreshold,p=void 0===c?.75:c,d=e.shouldLoadIrisModel,f=void 0===d||d,m=e.modelUrl,h=e.detectorModelUrl,g=e.irisModelUrl,f?[4,Promise.all([O(h,o,u,p),W(m),L(g)])]:[3,2];case 1:return b=l.sent(),[3,4];case 2:return[4,Promise.all([O(h,o,u,p),W(m)])];case 3:b=l.sent(),l.label=4;case 4:return[2,new z(b[0],b[1],n,a,o,f?b[2]:null)]}}))}))}function O(e,t,n,r){return i(this,void 0,void 0,(function(){return l(this,(function(a){return[2,g({modelUrl:e,maxFaces:t,iouThreshold:n,scoreThreshold:r})]}))}))}function W(e){return i(this,void 0,void 0,(function(){return l(this,(function(t){return null!=e?[2,s.loadGraphModel(e)]:[2,s.loadGraphModel("https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1",{fromTFHub:!0})]}))}))}function L(e){return i(this,void 0,void 0,(function(){return l(this,(function(t){return null!=e?[2,s.loadGraphModel(e)]:[2,s.loadGraphModel("https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2",{fromTFHub:!0})]}))}))}function G(e,t){if(e.mesh instanceof a.Tensor){var n=a.tidy((function(){var n=a.tensor1d([t-1,0,0]),r=a.tensor1d([1,-1,1]);return a.tidy((function(){return[a.concat([a.sub(t-1,a.slice(e.boundingBox.topLeft,0,1)),a.slice(e.boundingBox.topLeft,1,1)]),a.concat([a.sub(t-1,a.slice(e.boundingBox.bottomRight,0,1)),a.slice(e.boundingBox.bottomRight,1,1)]),a.mul(a.sub(n,e.mesh),r),a.mul(a.sub(n,e.scaledMesh),r)]}))})),r=n[0],s=n[1],o=n[2],i=n[3];return Object.assign({},e,{boundingBox:{topLeft:r,bottomRight:s},mesh:o,scaledMesh:i})}return Object.assign({},e,{boundingBox:{topLeft:[t-1-e.boundingBox.topLeft[0],e.boundingBox.topLeft[1]],bottomRight:[t-1-e.boundingBox.bottomRight[0],e.boundingBox.bottomRight[1]]},mesh:e.mesh.map((function(e){var n=e.slice(0);return n[0]=t-1-e[0],n})),scaledMesh:e.scaledMesh.map((function(e){var n=e.slice(0);return n[0]=t-1-e[0],n}))})}var U,z=function(){function e(e,t,n,r,a,s){this.kind="MediaPipeFaceMesh",this.pipeline=new B(e,t,192,192,n,a,s),this.detectionConfidence=r}return e.getAnnotations=function(){return b},e.getUVCoords=function(){return T},e.prototype.estimateFaces=function(e){return i(this,void 0,void 0,(function(){var t,n,r,s,o,u,c,p,d,f,m,h,g=this;return l(this,(function(y){switch(y.label){case 0:if(t=e.returnTensors,n=void 0!==t&&t,r=e.flipHorizontal,s=void 0!==r&&r,o=e.predictIrises,u=void 0===o||o,c=e.input,u&&null==this.pipeline.irisModel)throw new Error("The iris model was not loaded as part of facemesh. Please initialize the model with facemesh.load({shouldLoadIrisModel: true}).");return p=(k=c)instanceof a.Tensor?[k.shape[0],k.shape[1]]:[k.height,k.width],d=p[1],f=a.tidy((function(){return c instanceof a.Tensor||(c=a.browser.fromPixels(c)),a.expandDims(a.cast(c,"float32"),0)})),"webgl"!==a.getBackend()?[3,2]:(h=a.env().get("WEBGL_PACK_DEPTHWISECONV"),a.env().set("WEBGL_PACK_DEPTHWISECONV",!0),[4,this.pipeline.predict(f,u)]);case 1:return m=y.sent(),a.env().set("WEBGL_PACK_DEPTHWISECONV",h),[3,4];case 2:return[4,this.pipeline.predict(f,u)];case 3:m=y.sent(),y.label=4;case 4:return f.dispose(),null!=m&&m.length>0?[2,Promise.all(m.map((function(e,t){return i(g,void 0,void 0,(function(){var r,o,c,p,f,m,h,g,y,k,_,w,v,j,C=this;return l(this,(function(I){switch(I.label){case 0:return r=e.coords,o=e.scaledCoords,c=e.box,p=e.flag,f=[p],n||(f=f.concat([r,o])),[4,Promise.all(f.map((function(e){return i(C,void 0,void 0,(function(){return l(this,(function(t){return[2,e.array()]}))}))})))];case 1:if(m=I.sent(),h=m[0],p.dispose(),h<this.detectionConfidence&&this.pipeline.clearRegionOfInterest(t),n)return g={kind:"MediaPipePredictionTensors",faceInViewConfidence:h,mesh:r,scaledMesh:o,boundingBox:{topLeft:a.tensor1d(c.startPoint),bottomRight:a.tensor1d(c.endPoint)}},s?[2,G(g,d)]:[2,g];for(j in y=m.slice(1),k=y[0],_=y[1],o.dispose(),r.dispose(),w={kind:"MediaPipePredictionValues",faceInViewConfidence:h,boundingBox:{topLeft:c.startPoint,bottomRight:c.endPoint},mesh:k,scaledMesh:_},s&&(w=G(w,d)),v={},b)(u||!1===j.includes("Iris"))&&(v[j]=b[j].map((function(e){return w.scaledMesh[e]})));return w.annotations=v,[2,w]}}))}))})))]:[2,[]]}var k}))}))},e}();function H(e,t){return void 0===e&&(e=U.mediapipeFacemesh),void 0===t&&(t={}),i(this,void 0,void 0,(function(){return l(this,(function(n){if(e===U.mediapipeFacemesh)return[2,q(t)];throw new Error(e+" is not a valid package name.")}))}))}(U||(U={})).mediapipeFacemesh="mediapipe-facemesh"},{"@tensorflow/tfjs-core":"fqGP4","@tensorflow/tfjs-converter":"l98bQ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],knIxD:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"enhancePrediction",(()=>c));var a=e("../maths/maths");const{PI:s,abs:o,sqrt:i,atan2:l,tan:u}=Math,c=(e,t,n=!0)=>{const{boundingBox:r,mesh:i,scaledMesh:u,annotations:c}=e,{noseTip:p,noseBottom:d,noseRightCorner:f}=c,m=(u[168],u[10],u[109]),h=u[400],g=a.distanceBetween2Points(h,m),{leftEyeIris:b,leftEyeLower0:y,leftEyeLower1:k,leftEyeUpper1:_,rightEyeIris:w,rightEyeLower0:v,rightEyeLower1:j,rightEyeUpper0:C,rightEyeUpper1:I,midwayBetweenEyes:x}=c,D=b[0],M=w[0],S=x[0],F=S[0],A=(S[1],a.distanceBetween2Points(D,M)),N=D[2]<M[2],P=2*(S[0]-D[0])/A-1,E=a.distanceBetween3Points(_[3],I[3])/80,R=a.distanceBetween3Points(k[4],_[4]),B=a.distanceBetween3Points(j[4],I[4]),T=(b[4][1],b[2][1],w[4][1],w[2][1],y[0][0]),q=v[0][0],O=y[0][1],W=v[0][1];e.lookingRight=n?!N:N,e.eyeDirection=-1*P,e.eyeDistance=A,e.leftEye=R/E,e.leftEyeClosed=e.leftEye<20.2,e.rightEye=B/E,e.rightEyeClosed=e.rightEye<20.2;const L=-1*(F-T),G=F-q,U=n?-1*(l(L,G)-2):-1*(l(L,G)-.75),z=l(m[2],p[0][2]),H=8*a.twist(z/s,-.15),V=T-q,K=O-W,Y=n?-1*(l(V,K)+a.HALF_PI):l(V,K)-a.HALF_PI;e.pitch=H,e.roll=Y,e.yaw=U;const{lipsUpperInner:$,lipsLowerInner:X}=c,Q=$.length,Z=$[0],J=X[0],ee=$[5],te=X[5],ne=$[Q-1],re=X[Q-1],ae=a.distanceBetween2Points(te,ee),se=a.distanceBetween2Points(re,J);e.headHeight=g,e.mouthRange=ae,e.mouthRatio=ae/g,e.mouthWidth=se,e.mouthOpen=ae/(.25*g);const oe=o(a.determineAngle(Z,ee))/s,ie=o(a.determineAngle(ee,ne))/s;return e.happiness=10*(.5*(oe+ie)-.9),e.leftSmirk=1e5*(oe-1),e.rightSmirk=1e5*(ie-1),e.time=t,e}},{"../maths/maths":"iDBHd","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"38Jex":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);
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
 */
e("./register_all_kernels");var a=e("./base");r.exportAll(a,n)},{"./register_all_kernels":"5eNmj","./base":"24GdS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5eNmj":[function(e,t,n){
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var r=e("@tensorflow/tfjs-core"),a=e("./kernels/_FusedMatMul"),s=e("./kernels/Abs"),o=e("./kernels/Add"),i=e("./kernels/AddN"),l=e("./kernels/All"),u=e("./kernels/Any"),c=e("./kernels/ArgMax"),p=e("./kernels/AvgPool"),d=e("./kernels/BatchMatMul"),f=e("./kernels/BatchToSpaceND"),m=e("./kernels/Cast"),h=e("./kernels/Ceil"),g=e("./kernels/ClipByValue"),b=e("./kernels/Concat"),y=e("./kernels/Conv2D"),k=e("./kernels/Conv2DBackpropInput"),_=e("./kernels/Cos"),w=e("./kernels/Cosh"),v=e("./kernels/CropAndResize"),j=e("./kernels/Cumprod"),C=e("./kernels/Cumsum"),I=e("./kernels/DepthToSpace"),x=e("./kernels/DepthwiseConv2dNative"),D=e("./kernels/Elu"),M=e("./kernels/Equal"),S=e("./kernels/Exp"),F=e("./kernels/ExpandDims"),A=e("./kernels/Fill"),N=e("./kernels/FlipLeftRight"),P=e("./kernels/Floor"),E=e("./kernels/FloorDiv"),R=e("./kernels/FusedBatchNorm"),B=e("./kernels/FusedConv2D"),T=e("./kernels/FusedDepthwiseConv2D"),q=e("./kernels/GatherNd"),O=e("./kernels/GatherV2"),W=e("./kernels/Greater"),L=e("./kernels/GreaterEqual"),G=e("./kernels/Identity"),U=e("./kernels/LeakyRelu"),z=e("./kernels/Less"),H=e("./kernels/LessEqual"),V=e("./kernels/Log"),K=e("./kernels/LogicalAnd"),Y=e("./kernels/Max"),$=e("./kernels/Maximum"),X=e("./kernels/MaxPool"),Q=e("./kernels/Mean"),Z=e("./kernels/Min"),J=e("./kernels/Minimum"),ee=e("./kernels/MirrorPad"),te=e("./kernels/Multiply"),ne=e("./kernels/Neg"),re=e("./kernels/NonMaxSuppressionV3"),ae=e("./kernels/NonMaxSuppressionV4"),se=e("./kernels/NonMaxSuppressionV5"),oe=e("./kernels/NotEqual"),ie=e("./kernels/OneHot"),le=e("./kernels/OnesLike"),ue=e("./kernels/Pack"),ce=e("./kernels/PadV2"),pe=e("./kernels/Pow"),de=e("./kernels/Prelu"),fe=e("./kernels/Prod"),me=e("./kernels/Range"),he=e("./kernels/RealDiv"),ge=e("./kernels/Relu"),be=e("./kernels/Relu6"),ye=e("./kernels/Reshape"),ke=e("./kernels/ResizeBilinear"),_e=e("./kernels/Reverse"),we=e("./kernels/RotateWithOffset"),ve=e("./kernels/Round"),je=e("./kernels/Rsqrt"),Ce=e("./kernels/ScatterNd"),Ie=e("./kernels/Select"),xe=e("./kernels/Sigmoid"),De=e("./kernels/Sin"),Me=e("./kernels/Slice"),Se=e("./kernels/Softmax"),Fe=e("./kernels/SpaceToBatchND"),Ae=e("./kernels/SparseFillEmptyRows"),Ne=e("./kernels/SparseReshape"),Pe=e("./kernels/SparseSegmentMean"),Ee=e("./kernels/SparseSegmentSum"),Re=e("./kernels/SplitV"),Be=e("./kernels/Sqrt"),Te=e("./kernels/Square"),qe=e("./kernels/SquaredDifference"),Oe=e("./kernels/Step"),We=e("./kernels/StridedSlice"),Le=e("./kernels/Sub"),Ge=e("./kernels/Sum"),Ue=e("./kernels/Tan"),ze=e("./kernels/Tanh"),He=e("./kernels/Tile"),Ve=e("./kernels/TopK"),Ke=e("./kernels/Transform"),Ye=e("./kernels/Transpose"),$e=e("./kernels/Unpack"),Xe=e("./kernels/ZerosLike");const Qe=[a._fusedMatMulConfig,s.absConfig,o.addConfig,i.addNConfig,l.allConfig,u.anyConfig,c.argMaxConfig,p.avgPoolConfig,d.batchMatMulConfig,f.batchToSpaceNDConfig,m.castConfig,h.ceilConfig,g.clipByValueConfig,b.concatConfig,y.conv2DConfig,k.conv2DBackpropInputConfig,_.cosConfig,w.coshConfig,v.cropAndResizeConfig,j.cumprodConfig,C.cumsumConfig,I.depthToSpaceConfig,x.depthwiseConv2dNativeConfig,D.eluConfig,M.equalConfig,S.expConfig,F.expandDimsConfig,A.fillConfig,N.flipLeftRightConfig,P.floorConfig,E.floorDivConfig,R.fusedBatchNormConfig,B.fusedConv2DConfig,T.fusedDepthwiseConv2DConfig,q.gatherNdConfig,O.gatherV2Config,W.greaterConfig,L.greaterEqualConfig,G.identityConfig,U.leakyReluConfig,z.lessConfig,H.lessEqualConfig,V.logConfig,K.logicalAndConfig,Y.maxConfig,$.maximumConfig,X.maxPoolConfig,Q.meanConfig,Z.minConfig,J.minimumConfig,ee.mirrorPadConfig,te.multiplyConfig,ne.negConfig,re.nonMaxSuppressionV3Config,ae.nonMaxSuppressionV4Config,se.nonMaxSuppressionV5Config,oe.notEqualConfig,ie.oneHotConfig,le.onesLikeConfig,ue.packConfig,ce.padV2Config,pe.powConfig,de.preluConfig,fe.prodConfig,me.rangeConfig,he.realDivConfig,ge.reluConfig,be.relu6Config,ye.reshapeConfig,ke.resizeBilinearConfig,_e.reverseConfig,we.rotateWithOffsetConfig,ve.roundConfig,je.rsqrtConfig,Ce.scatterNdConfig,Ie.selectConfig,xe.sigmoidConfig,De.sinConfig,Me.sliceConfig,Se.softmaxConfig,Fe.spaceToBatchNDConfig,Ae.sparseFillEmptyRowsConfig,Ne.sparseReshapeConfig,Pe.sparseSegmentMeanConfig,Ee.sparseSegmentSumConfig,Re.splitVConfig,Be.sqrtConfig,Te.squareConfig,qe.squaredDifferenceConfig,Oe.stepConfig,We.stridedSliceConfig,Le.subConfig,Ge.sumConfig,Ue.tanConfig,ze.tanhConfig,He.tileConfig,Ve.topKConfig,Ke.transformConfig,Ye.transposeConfig,$e.unpackConfig,Xe.zerosLikeConfig];for(const e of Qe)r.registerKernel(e)},{"@tensorflow/tfjs-core":"fqGP4","./kernels/_FusedMatMul":"k59RG","./kernels/Abs":"2GdDk","./kernels/Add":"babIa","./kernels/AddN":"1zSOX","./kernels/All":"8uwjX","./kernels/Any":"5tCdr","./kernels/ArgMax":"hniZ5","./kernels/AvgPool":"6v80u","./kernels/BatchMatMul":"ghCmV","./kernels/BatchToSpaceND":"4eu0q","./kernels/Cast":"bGPlI","./kernels/Ceil":"dx9ZV","./kernels/ClipByValue":"e8U5N","./kernels/Concat":"gg3oU","./kernels/Conv2D":"3weVS","./kernels/Conv2DBackpropInput":"cNlL5","./kernels/Cos":"condh","./kernels/Cosh":"e7YUt","./kernels/CropAndResize":"7voe3","./kernels/Cumprod":"3DVNe","./kernels/Cumsum":"3PHjZ","./kernels/DepthToSpace":"eP6yj","./kernels/DepthwiseConv2dNative":"5qoZn","./kernels/Elu":"hTLQ9","./kernels/Equal":"6NRgP","./kernels/Exp":"9puem","./kernels/ExpandDims":"2OTFi","./kernels/Fill":"geiWD","./kernels/FlipLeftRight":"d7JTg","./kernels/Floor":"29SUM","./kernels/FloorDiv":"bJ7qU","./kernels/FusedBatchNorm":"i7ayZ","./kernels/FusedConv2D":"bXSgI","./kernels/FusedDepthwiseConv2D":"fpjh5","./kernels/GatherNd":"9McxH","./kernels/GatherV2":"e6daa","./kernels/Greater":"6JnB0","./kernels/GreaterEqual":"6T8x5","./kernels/Identity":"j2v3m","./kernels/LeakyRelu":"jyGti","./kernels/Less":"6302T","./kernels/LessEqual":"bgZoQ","./kernels/Log":"h9Yb3","./kernels/LogicalAnd":"7S6JD","./kernels/Max":"4RGKM","./kernels/Maximum":"cL64O","./kernels/MaxPool":"ImEix","./kernels/Mean":"8hVA0","./kernels/Min":"hmNa0","./kernels/Minimum":"cN515","./kernels/MirrorPad":"g4N8P","./kernels/Multiply":"98fwB","./kernels/Neg":"atIMr","./kernels/NonMaxSuppressionV3":"fMb6L","./kernels/NonMaxSuppressionV4":"6gLQs","./kernels/NonMaxSuppressionV5":"kWIaw","./kernels/NotEqual":"gE58W","./kernels/OneHot":"2auC5","./kernels/OnesLike":"2C4KL","./kernels/Pack":"anZaM","./kernels/PadV2":"jxDD1","./kernels/Pow":"lSU1e","./kernels/Prelu":"17lcP","./kernels/Prod":"cce5D","./kernels/Range":"j2Vlu","./kernels/RealDiv":"Br6Ma","./kernels/Relu":"YAD8N","./kernels/Relu6":"ecfwq","./kernels/Reshape":"carA0","./kernels/ResizeBilinear":"hqU2G","./kernels/Reverse":"h8p0f","./kernels/RotateWithOffset":"9Dmog","./kernels/Round":"49MFW","./kernels/Rsqrt":"7tjno","./kernels/ScatterNd":"1FCGT","./kernels/Select":"jCsx6","./kernels/Sigmoid":"4QdGq","./kernels/Sin":"hJMTy","./kernels/Slice":"fC7Xk","./kernels/Softmax":"3nqRh","./kernels/SpaceToBatchND":"5gV7j","./kernels/SparseFillEmptyRows":"jrzyQ","./kernels/SparseReshape":"59PNO","./kernels/SparseSegmentMean":"eDnJR","./kernels/SparseSegmentSum":"jwNwx","./kernels/SplitV":"kpanS","./kernels/Sqrt":"7Bfb4","./kernels/Square":"4eqUw","./kernels/SquaredDifference":"3xMkV","./kernels/Step":"b4iTq","./kernels/StridedSlice":"2nai6","./kernels/Sub":"auNTX","./kernels/Sum":"itfOR","./kernels/Tan":"2BnQa","./kernels/Tanh":"92eBX","./kernels/Tile":"9dHgQ","./kernels/TopK":"3N5sa","./kernels/Transform":"73Gmi","./kernels/Transpose":"af8LA","./kernels/Unpack":"eRN3n","./kernels/ZerosLike":"e67PN"}],k59RG:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"_fusedMatMulConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a._FusedMatMul,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a._FusedMatMul,null,["number","array","number","number","array","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{a:i,b:l,bias:u,preluActivationWeights:c}=t;if("float32"!==i.dtype||"float32"!==l.dtype)throw new Error("_FusedMatMul for non non-float32 tensors not yet supported.");const{transposeA:p,transposeB:d,activation:f,leakyreluAlpha:m}=r,h=n.dataIdMap.get(i.dataId).id,g=n.dataIdMap.get(l.dataId).id;let b=0;if(null!=u){const e=n.dataIdMap.get(u.dataId);if(1!==e.shape.length)throw new Error(`_FusedMatMul only supports rank-1 bias but got rank ${e.shape.length}.`);b=e.id}const y=null==c?0:n.dataIdMap.get(c.dataId).id,k=s.FusableActivation[f];if(null==k)throw new Error(`${f} activation not yet supported for FusedConv2D in the wasm backend.`);const _=p?i.shape[2]:i.shape[1],w=d?l.shape[1]:l.shape[2],v=a.broadcast_util.assertAndGetBroadcastShape(i.shape.slice(0,-2),l.shape.slice(0,-2)),j=n.makeOutput([...v,_,w],i.dtype),C=n.dataIdMap.get(j.dataId).id,I=new Uint8Array(new Int32Array(i.shape).buffer),x=new Uint8Array(new Int32Array(l.shape).buffer);return o(h,I,i.shape.length,g,x,l.shape.length,p,d,k,b,y,m||0,C),j}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3tWYo":[function(e,t,n){var r,a,s,o,i=e("@parcel/transformer-js/src/esmodule-helpers.js");i.defineInteropFlag(n),i.export(n,"CppDType",(()=>r)),i.export(n,"FusableActivation",(()=>s)),(a=r||(r={}))[a.float32=0]="float32",a[a.int32=1]="int32",a[a.bool=2]="bool",a[a.string=3]="string",a[a.complex64=4]="complex64",(o=s||(s={}))[o.linear=0]="linear",o[o.relu=1]="relu",o[o.relu6=2]="relu6",o[o.prelu=3]="prelu",o[o.leakyrelu=4]="leakyrelu",o[o.sigmoid=5]="sigmoid",o[o.elu=6]="elu"},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2GdDk":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"absConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Abs)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iAt0j:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"createUnaryKernelConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");function o(e,t){let n;return{kernelName:e,backendName:"wasm",setupFunc:function(t){n=t.wasm.cwrap(e,null,["number","number","number"])},kernelFunc:function(e){const{backend:r,inputs:{x:o}}=e,i=r.dataIdMap.get(o.dataId).id,l=r.makeOutput(o.shape,t||o.dtype),u=r.dataIdMap.get(l.dataId).id;return 0===a.util.sizeFromShape(l.shape)||n(i,s.CppDType[o.dtype],u),l}}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],babIa:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"addConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Add,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6tYNr":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"createBinaryKernelConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");function o(e,t,n){let r;return{kernelName:e,backendName:"wasm",setupFunc:function(t){r=t.wasm.cwrap(e,null,["number","array","number","number","array","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:o}=e,{a:i,b:l}=o,u=t.dataIdMap.get(i.dataId).id,c=t.dataIdMap.get(l.dataId).id,p=null!=n?n:i.dtype,d=a.backend_util.assertAndGetBroadcastShape(i.shape,l.shape),f=t.makeOutput(d,p);if(0===a.util.sizeFromShape(d))return f;const m=new Uint8Array(new Int32Array(i.shape).buffer),h=new Uint8Array(new Int32Array(l.shape).buffer),g=t.dataIdMap.get(f.dataId).id;return r(u,m,i.shape.length,c,h,l.shape.length,s.CppDType[i.dtype],g),f}}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1zSOX":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"addNConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.AddN,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.AddN,null,["array","number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n}=e,r=n.makeOutput(t[0].shape,t[0].dtype);if(0===a.util.sizeFromShape(r.shape))return r;const i=t.map((e=>n.dataIdMap.get(e.dataId).id)),l=new Uint8Array(new Int32Array(i).buffer),u=n.dataIdMap.get(r.dataId).id;return o(l,i.length,s.CppDType[r.dtype],u),r}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8uwjX":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"allConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils");let o;const i={kernelName:a.All,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.All,null,["number, number, number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:i,keepDims:l}=r,{x:u}=n;let c=t.dataIdMap.get(u.dataId).id,p=u;const{transposed:d,axes:f,originalAxes:m,inputWasTransposed:h}=s.permuteAxesAndTranspose(u,i,t);if(h){p=d,c=t.dataIdMap.get(d.dataId).id}const g=p.shape.length;a.backend_util.assertAxesAreInnerMostDims("all",f,g);const[b,y]=a.backend_util.computeOutAndReduceShapes(p.shape,f),k=a.util.sizeFromShape(y),_=t.makeOutput(b,u.dtype);if(0!==a.util.sizeFromShape(p.shape)){const e=t.dataIdMap.get(_.dataId).id;o(c,k,e)}if(h&&t.disposeData(d.dataId),l){const e=a.backend_util.expandShapeToKeepDim(_.shape,m);_.shape=e}return _}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bvaRF:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"permuteAxesAndTranspose",(()=>o));
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Transpose");function o(e,t,n){const r=e.shape,o=e.shape.length,i=a.util.parseAxisParam(t,r);let l=i;const u=a.backend_util.getAxesPermutation(l,o);let c=null,p=!1;if(null!=u){const t=new Array(o);for(let e=0;e<t.length;e++)t[e]=r[u[e]];l=a.backend_util.getInnerMostAxes(l.length,o),c=s.transpose({inputs:{x:e},attrs:{perm:u},backend:n});const i=n.dataIdMap.get(e.dataId).id;n.dataIdMap.get(c.dataId).id!==i&&(p=!0)}return{transposed:c,originalAxes:i,axes:l,inputWasTransposed:p}}},{"@tensorflow/tfjs-core":"fqGP4","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],af8LA:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"transpose",(()=>l)),r.export(n,"transposeConfig",(()=>u));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Identity"),o=e("./types");let i;function l(e){const{inputs:t,backend:n,attrs:r}=e,[a,l]=function(e,t){const n=[],r=[];for(let a=0;a<e.length;++a)1!==e[a]&&n.push(e[a]),1!==e[t[a]]&&r.push(t[a]);for(let e=0;e<r.length;++e){let t=-1;for(let n=0;n<r.length;++n)r[n]>=e&&(-1===t||r[t]>r[n])&&(t=n);r[t]=e}return[n,r]}(t.x.shape,r.perm);let u=!0;for(let e=0;e<l.length;e++)l[e]!==e&&(u=!1);const c=function(e,t){const n=new Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[t[r]];return n}(t.x.shape,r.perm),p={dataId:t.x.dataId,shape:a,dtype:t.x.dtype};if(u){const e=s.identity({inputs:t,backend:n});return e.shape=c,e}const d=n.makeOutput(c,p.dtype),f=n.dataIdMap.get(p.dataId).id,m=n.dataIdMap.get(d.dataId).id,h=new Uint8Array(new Int32Array(l).buffer),g=new Uint8Array(new Int32Array(p.shape).buffer);return i(f,g,p.shape.length,o.CppDType[p.dtype],m,h,l.length),d}const u={kernelName:a.Transpose,backendName:"wasm",kernelFunc:l,setupFunc:function(e){i=e.wasm.cwrap(a.Transpose,null,["number","array","number","number","number","array","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","./Identity":"j2v3m","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j2v3m:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function a(e){const{inputs:{x:t},backend:n}=e,r=n.makeOutput(t.shape,t.dtype),a=n.typedArrayFromHeap(t);return n.typedArrayFromHeap(r).set(a),r}r.defineInteropFlag(n),r.export(n,"identity",(()=>a)),r.export(n,"identityConfig",(()=>s));const s={kernelName:e("@tensorflow/tfjs-core").Identity,backendName:"wasm",kernelFunc:a}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5tCdr":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"anyConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils");let o;const i={kernelName:a.Any,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.Any,null,["number, number, number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:i,keepDims:l}=r,{x:u}=n;let c=t.dataIdMap.get(u.dataId).id,p=u;const{transposed:d,axes:f,originalAxes:m,inputWasTransposed:h}=s.permuteAxesAndTranspose(u,i,t);if(h){p=d,c=t.dataIdMap.get(d.dataId).id}const g=p.shape.length;a.backend_util.assertAxesAreInnerMostDims("any",f,g);const[b,y]=a.backend_util.computeOutAndReduceShapes(p.shape,f),k=a.util.sizeFromShape(y),_=t.makeOutput(b,u.dtype);if(0!==a.util.sizeFromShape(p.shape)){const e=t.dataIdMap.get(_.dataId).id;o(c,k,e)}if(h&&t.disposeData(d.dataId),l){const e=a.backend_util.expandShapeToKeepDim(_.shape,m);_.shape=e}return _}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hniZ5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"argMaxConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils"),o=e("./types");let i;const l={kernelName:a.ArgMax,backendName:"wasm",kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:l}=r,{x:u}=n,c=t.dataIdMap.get(u.dataId).id;let p=c,d=u;const{transposed:f,axes:m,inputWasTransposed:h}=s.permuteAxesAndTranspose(u,l,t);if(h){const e=t.dataIdMap.get(f.dataId).id;e!==c&&(d=f,p=e)}const g=d.shape.slice(0,-1),b=t.makeOutput(g,"int32"),y=t.dataIdMap.get(b.dataId).id,k=a.util.sizeFromShape(b.shape),_=d.shape[m[0]];return i(p,o.CppDType[d.dtype],k,_,y),h&&t.disposeData(f.dataId),b},setupFunc:function(e){i=e.wasm.cwrap(a.ArgMax,null,["number","number","number","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6v80u":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"avgPoolConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.AvgPool,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.AvgPool,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,o=t.x,i=r.dataIdMap.get(o.dataId).id,{filterSize:l,strides:u,pad:c,dimRoundingMode:p}=n,d=a.backend_util.computePool2DInfo(o.shape,l,u,1,c,p),f=d.filterHeight,m=d.filterWidth,h=d.padInfo.top,g=d.padInfo.right,b=d.padInfo.bottom,y=d.padInfo.left,k=d.strideHeight,_=d.strideWidth,w=d.inChannels;if("channelsLast"!==d.dataFormat)throw new Error(`wasm backend does not support dataFormat:'${d.dataFormat}'. Please use 'channelsLast'.`);if(1!==d.dilationWidth||1!==d.dilationHeight)throw new Error(`was backend only supports average pooling with dilation = [1, 1], got [${d.dilationHeight}, ${d.dilationWidth}].`);const v=r.makeOutput(d.outShape,"float32"),j=r.dataIdMap.get(v.dataId).id;return s(i,o.shape[0],o.shape[1],o.shape[2],f,m,h,g,b,y,k,_,w,j),v}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ghCmV:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"batchMatMulConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Reshape");let o;const i={kernelName:a.BatchMatMul,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.BatchMatMul,null,["number","array","number","number","array","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{a:i,b:l}=t,{transposeA:u,transposeB:c}=r;if("float32"!==i.dtype||"float32"!==l.dtype)throw new Error("BatchMatMul for non non-float32 tensors not yet supported.");const p=i.shape.length,d=l.shape.length,f=u?i.shape[p-2]:i.shape[p-1],m=c?l.shape[d-1]:l.shape[d-2],h=u?i.shape[p-1]:i.shape[p-2],g=c?l.shape[d-2]:l.shape[d-1],b=i.shape.slice(0,-2),y=l.shape.slice(0,-2),k=a.util.sizeFromShape(b),_=a.util.sizeFromShape(y),w=a.broadcast_util.assertAndGetBroadcastShape(i.shape.slice(0,-2),l.shape.slice(0,-2)).concat([h,g]);a.util.assert(f===m,(()=>`Error in matMul: inner shapes (${f}) and (${m}) of Tensors with shapes ${i.shape} and ${l.shape} and transposeA=${u} and transposeB=${c} must match.`));const v=u?[k,f,h]:[k,h,f],j=c?[_,g,m]:[_,m,g],C=s.reshape({inputs:{x:i},backend:n,attrs:{shape:v}}),I=s.reshape({inputs:{x:l},backend:n,attrs:{shape:j}}),x=n.dataIdMap.get(C.dataId).id,D=n.dataIdMap.get(I.dataId).id,M=u?C.shape[2]:C.shape[1],S=c?I.shape[1]:I.shape[2],F=Math.max(k,_),A=n.makeOutput([F,M,S],C.dtype),N=n.dataIdMap.get(A.dataId).id,P=new Uint8Array(new Int32Array(C.shape).buffer),E=new Uint8Array(new Int32Array(I.shape).buffer);return o(x,P,C.shape.length,D,E,I.shape.length,u,c,N),n.disposeData(C.dataId),n.disposeData(I.dataId),A.shape=w,A}}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],carA0:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"reshape",(()=>s)),r.export(n,"reshapeConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");function s(e){const{inputs:t,attrs:n}=e,{x:r}=t,{shape:s}=n,o=a.util.sizeFromShape(r.shape),i=a.util.inferFromImplicitShape(s,o);return a.util.assert(o===a.util.sizeFromShape(i),(()=>`new shape: ${i}, old shape: ${r.shape}. New shape and old shape must have the same number of elements.`)),e.backend.incRef(r.dataId),{dataId:r.dataId,shape:i,dtype:r.dtype}}const o={kernelName:a.Reshape,backendName:"wasm",kernelFunc:s}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4eu0q":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"batchToSpaceNDConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Reshape"),o=e("./Slice"),i=e("./Transpose");const l={kernelName:a.BatchToSpaceND,backendName:"wasm",kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{x:l}=t,{blockShape:u,crops:c}=r,p=u.reduce(((e,t)=>e*t)),d=a.backend_util.getReshaped(l.shape,u,p),f=a.backend_util.getPermuted(d.length,u.length),m=a.backend_util.getReshapedPermuted(l.shape,u,p),h=a.backend_util.getSliceBeginCoords(c,u.length),g=a.backend_util.getSliceSize(m,c,u.length),b=s.reshape({inputs:{x:l},backend:n,attrs:{shape:d}}),y=i.transpose({inputs:{x:b},backend:n,attrs:{perm:f}}),k=s.reshape({inputs:{x:y},backend:n,attrs:{shape:m}}),_=o.slice({inputs:{x:k},backend:n,attrs:{begin:h,size:g}});return n.disposeData(b.dataId),n.disposeData(y.dataId),n.disposeData(b.dataId),_}}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./Slice":"fC7Xk","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fC7Xk:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"slice",(()=>o)),r.export(n,"sliceConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("../kernel_utils/shared");function o(e){const{inputs:{x:t},attrs:{begin:n,size:r},backend:o}=e,[i,l]=a.slice_util.parseSliceParams(t,n,r),u=a.slice_util.isSliceContinous(t.shape,i,l),c=o.readSync(t.dataId),p=o.makeOutput(l,t.dtype),d=a.util.computeStrides(t.shape),f=o.dataIdMap.get(p.dataId);if(u){const e=a.slice_util.computeFlatOffset(i,d);if("string"===t.dtype)f.stringBytes=c.slice(e,e+a.util.sizeFromShape(l));else{o.typedArrayFromHeap(p).set(c.subarray(e,e+a.util.sizeFromShape(l)))}return p}if("string"===t.dtype){const e=s.sliceImplCPU(c,i,l,t.shape,t.dtype);return f.stringBytes=e,p}const m=o.typedArrayFromHeap(p),h=t.shape.length;if(2===h)!function(e,t,n,r,a){let s=0;const o=r[0],i=r[1],l=o+a[0];for(let r=o;r<l;r++){const o=r*t+i;n.set(e.subarray(o,o+a[1]),s),s+=a[1]}}(c,d[0],m,i,l);else if(3===h)!function(e,t,n,r,a,s){let o=0;const i=a[0],l=a[1],u=a[2],c=i+s[0],p=l+s[1];for(let a=i;a<c;a++)for(let i=l;i<p;i++){const l=a*t+i*n+u;r.set(e.subarray(l,l+s[2]),o),o+=s[2]}}(c,d[0],d[1],m,i,l);else if(4===h)!function(e,t,n,r,a,s,o){let i=0;const l=s[0],u=s[1],c=s[2],p=l+o[0],d=u+o[1],f=c+o[2],m=s[3];for(let s=l;s<p;s++)for(let l=u;l<d;l++)for(let u=c;u<f;u++){const c=s*t+l*n+u*r+m;a.set(e.subarray(c,c+o[3]),i),i+=o[3]}}(c,d[0],d[1],d[2],m,i,l);else{const e=s.sliceImplCPU(c,i,l,t.shape,t.dtype);m.set(e)}return p}const i={kernelName:a.Slice,backendName:"wasm",kernelFunc:o}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gOlqM:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"concatImplCPU",(()=>a.concatImpl)),r.export(n,"rangeImplCPU",(()=>a.rangeImpl)),r.export(n,"sliceImplCPU",(()=>a.sliceImpl));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-backend-cpu/dist/shared")},{"@tensorflow/tfjs-backend-cpu/dist/shared":"2aoP6","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bGPlI:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function a(e){const{inputs:{x:t},attrs:{dtype:n},backend:r}=e,a=r.makeOutput(t.shape,n),s=r.typedArrayFromHeap(t);return r.typedArrayFromHeap(a).set(s),a}r.defineInteropFlag(n),r.export(n,"cast",(()=>a)),r.export(n,"castConfig",(()=>s));const s={kernelName:e("@tensorflow/tfjs-core").Cast,backendName:"wasm",kernelFunc:a}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dx9ZV:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ceilConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Ceil)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e8U5N:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"clipByValueConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.ClipByValue,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.ClipByValue,null,["number","number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{clipValueMin:o,clipValueMax:i}=r,l=n.dataIdMap.get(a.dataId).id,u=n.makeOutput(a.shape,a.dtype),c=n.dataIdMap.get(u.dataId).id;return s(l,o,i,c),u}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gg3oU:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"concat",(()=>l)),r.export(n,"concatConfig",(()=>u));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("../kernel_utils/shared"),o=e("./Identity"),i=e("./Reshape");function l(e){const{inputs:t,backend:n}=e,r=a.util.parseAxisParam(e.attrs.axis,t[0].shape)[0];let l=a.backend_util.computeOutShape(t.map((e=>e.shape)),r);const u=t.filter((e=>a.util.sizeFromShape(e.shape)>0));if(1===u.length)return o.identity({inputs:{x:u[0]},backend:n});const c=n.makeOutput(l,t[0].dtype);if(0===a.util.sizeFromShape(l))return c;const p=u.map((e=>e.shape));if(a.backend_util.assertParamsConsistent(p,r),"string"===u[0].dtype){const e=u.map((e=>{const t=[-1,a.util.sizeFromShape(e.shape.slice(r))];return i.reshape({inputs:{x:e},backend:n,attrs:{shape:t}})})),o=e.map((e=>({vals:n.readSync(e.dataId),shape:e.shape})));l=a.backend_util.computeOutShape(e.map((e=>e.shape)),1);const p=1===e[0].shape[0],d=s.concatImplCPU(o,l,t[0].dtype,p),f=a.backend_util.computeOutShape(u.map((e=>e.shape)),r);c.shape=f;return n.dataIdMap.get(c.dataId).stringBytes=a.backend_util.fromStringArrayToUint8(d),e.forEach((e=>n.disposeData(e.dataId))),c}const d=a.util.sizeFromShape(u[0].shape.slice(0,r));let f=0;const m=u.map((e=>{const t=a.util.sizeFromShape(e.shape.slice(r));return f+=t,t})),h=u.map((e=>n.typedArrayFromHeap(e))),g=n.typedArrayFromHeap(c);for(let e=0;e<d;e++){let t=e*f;for(let n=0;n<h.length;n++){const r=m[n],a=e*r,s=h[n].subarray(a,a+r);g.set(s,t),t+=r}}return c}const u={kernelName:a.Concat,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","./Identity":"j2v3m","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3weVS":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"conv2DConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.Conv2D,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.Conv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,{x:o,filter:i}=t,l=r.dataIdMap.get(o.dataId).id,u=r.dataIdMap.get(i.dataId).id,{strides:c,dilations:p,pad:d,dimRoundingMode:f,dataFormat:m}=n,h=a.backend_util.convertConv2DDataFormat(m),g=a.backend_util.computeConv2DInfo(o.shape,i.shape,c,p,d,f,!1,h),b=g.filterHeight,y=g.filterWidth,k=g.padInfo.top,_=g.padInfo.right,w=g.padInfo.bottom,v=g.padInfo.left,j=g.dilationHeight,C=g.dilationWidth,I=g.strideHeight,x=g.strideWidth,D=g.inChannels,M=g.outChannels,S="SAME"===g.padInfo.type?1:0;if("channelsLast"!==g.dataFormat)throw new Error(`wasm backend Conv2D does not support dataFormat:'${g.dataFormat}'. Please use 'channelsLast'.`);const F=r.makeOutput(g.outShape,"float32"),A=r.dataIdMap.get(F.dataId).id;return s(l,o.shape[0],o.shape[1],o.shape[2],u,b,y,k,_,w,v,S,j,C,I,x,D,M,A),F}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cNlL5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"conv2DBackpropInputConfig",(()=>o));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.Conv2DBackpropInput,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.Conv2DBackpropInput,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{dy:o,filter:i}=n,{strides:l,pad:u,dataFormat:c,dimRoundingMode:p,inputShape:d}=r,f=a.backend_util.convertConv2DDataFormat(c),m=a.backend_util.computeConv2DInfo(d,i.shape,l,1,u,p,!1,f),{batchSize:h,filterHeight:g,filterWidth:b,inChannels:y,inHeight:k,inWidth:_,outChannels:w,outHeight:v,outWidth:j,strideHeight:C,strideWidth:I}=m,x=g-1-m.padInfo.top,D=b-1-m.padInfo.left,M="channelsLast"===m.dataFormat,S=a.util.computeStrides(m.inShape),F=a.util.computeStrides(o.shape),[A,N,P]=a.util.computeStrides(i.shape),E=S[0],R=M?S[1]:S[2],B=M?S[2]:1,T=M?1:S[1],q=F[0],O=M?F[1]:F[2],W=M?F[2]:1,L=M?1:F[1],G=t.makeOutput(m.inShape,"float32"),U=t.dataIdMap.get(G.dataId).id,z=t.dataIdMap.get(o.dataId).id,H=t.dataIdMap.get(i.dataId).id;return s(z,H,h,g,b,k,_,y,v,j,w,C,I,x,D,A,N,P,E,R,B,T,q,O,W,L,U),G}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],condh:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"cosConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Cos)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e7YUt:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"coshConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Cosh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7voe3":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"cropAndResizeConfig",(()=>u));
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
 */
var a,s,o=e("@tensorflow/tfjs-core"),i=e("./Cast");let l;(s=a||(a={}))[s.bilinear=0]="bilinear",s[s.nearest=1]="nearest";const u={kernelName:o.CropAndResize,backendName:"wasm",setupFunc:function(e){l=e.wasm.cwrap(o.CropAndResize,null,["number","number","number","number","array","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{method:s,extrapolationValue:o,cropSize:u}=r,{image:c,boxes:p,boxInd:d}=n,f=p.shape[0],[m,h]=u,g=[f,m,h,c.shape[3]];let b,y=t.dataIdMap.get(c.dataId);"float32"!==c.dtype&&(b=i.cast({backend:t,inputs:{x:c},attrs:{dtype:"float32"}}),y=t.dataIdMap.get(b.dataId));const k=y.id,_=t.dataIdMap.get(p.dataId).id,w=t.dataIdMap.get(d.dataId).id,v=t.makeOutput(g,"float32"),j=t.dataIdMap.get(v.dataId).id,C=new Uint8Array(new Int32Array(c.shape).buffer);return l(k,_,w,f,C,m,h,a[s],o,j),null!=b&&t.disposeData(b.dataId),v}}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3DVNe":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"cumprod",(()=>l)),r.export(n,"cumprodConfig",(()=>u));
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types"),o=e("./Transpose");let i;function l(e){const{inputs:t,backend:n,attrs:r}=e,{x:l}=t,{axis:u,exclusive:c,reverse:p}=r,d=l.shape.length;a.util.assert("float32"===l.dtype||"int32"===l.dtype,(()=>`cumprod does not support ${l.dtype} tensors in the WASM backend`));const f=a.backend_util.getAxesPermutation([u],d);let m=l;null!==f&&(m=o.transpose({inputs:{x:l},attrs:{perm:f},backend:n}));const h=a.backend_util.getInnerMostAxes(1,d)[0];a.backend_util.assertAxesAreInnerMostDims("cumprod",[h],d);const g=n.makeOutput(m.shape,m.dtype),b=m.shape[h],y=n.dataIdMap.get(m.dataId).id,k=n.dataIdMap.get(g.dataId).id;i(y,c?1:0,p?1:0,b,k,s.CppDType[l.dtype]);let _=g;if(null!==f){const e=a.backend_util.getUndoAxesPermutation(f);_=o.transpose({inputs:{x:g},attrs:{perm:e},backend:n}),n.disposeData(m.dataId),n.disposeData(g.dataId)}return _}const u={kernelName:a.Cumprod,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Cumprod,null,["number","number","number","number","number","number"])},kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3PHjZ":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"cumsum",(()=>l)),r.export(n,"cumsumConfig",(()=>u));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types"),o=e("./Transpose");let i;function l(e){const{inputs:t,backend:n,attrs:r}=e,{x:l}=t,{axis:u,exclusive:c,reverse:p}=r,d=l.shape.length;a.util.assert("float32"===l.dtype||"int32"===l.dtype,(()=>`cumsum does not support ${l.dtype} tensors in the WASM backend`));const f=a.backend_util.getAxesPermutation([u],d);let m=l;null!==f&&(m=o.transpose({inputs:{x:l},attrs:{perm:f},backend:n}));const h=a.backend_util.getInnerMostAxes(1,d)[0];a.backend_util.assertAxesAreInnerMostDims("cumsum",[h],d);const g=n.makeOutput(m.shape,m.dtype),b=m.shape[h],y=n.dataIdMap.get(m.dataId).id,k=n.dataIdMap.get(g.dataId).id;i(y,c?1:0,p?1:0,b,k,s.CppDType[l.dtype]);let _=g;if(null!==f){const e=a.backend_util.getUndoAxesPermutation(f);_=o.transpose({inputs:{x:g},attrs:{perm:e},backend:n}),n.disposeData(m.dataId),n.disposeData(g.dataId)}return _}const u={kernelName:a.Cumsum,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Cumsum,null,["number","number","number","number","number","number"])},kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eP6yj:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"depthToSpace",(()=>o)),r.export(n,"depthToSpaceConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core");let s;function o(e){const{backend:t,inputs:n,attrs:r}=e,{x:o}=n,{blockSize:i,dataFormat:l}=r,u=o.shape[0],c=("NHWC"===l?o.shape[1]:o.shape[2])*i,p=("NHWC"===l?o.shape[2]:o.shape[3])*i,d=("NHWC"===l?o.shape[3]:o.shape[1])/(i*i),f="NHWC"===l?[u,c,p,d]:[u,d,c,p],m=t.makeOutput(f,"float32"),h=t.dataIdMap.get(o.dataId).id,g=new Uint8Array(new Int32Array(a.util.computeStrides(o.shape)).buffer),b=new Uint8Array(new Int32Array(f).buffer),y=new Uint8Array(new Int32Array(a.util.computeStrides(f)).buffer),k=t.dataIdMap.get(m.dataId).id;return s(h,i,"NHWC"===l?1:0,g,o.shape.length-1,b,y,f.length,k),m}const i={kernelName:a.DepthToSpace,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.DepthToSpace,null,["number","number","number","array","number","array","array","number","number"])},kernelFunc:o}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5qoZn":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"depthwiseConv2dNativeConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.DepthwiseConv2dNative,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.DepthwiseConv2dNative,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,{x:o,filter:i}=t,l=r.dataIdMap.get(o.dataId).id,u=r.dataIdMap.get(i.dataId).id,{strides:c,dilations:p,pad:d,dimRoundingMode:f}=n,m=null==p?[1,1]:p,h=a.backend_util.computeConv2DInfo(o.shape,i.shape,c,m,d,f,!0),g=h.filterHeight,b=h.filterWidth,y=h.padInfo.top,k=h.padInfo.right,_=h.padInfo.bottom,w=h.padInfo.left,v=h.dilationHeight,j=h.dilationWidth,C=h.strideHeight,I=h.strideWidth,x=h.inChannels,D=h.outChannels,M="SAME"===h.padInfo.type?1:0;if("channelsLast"!==h.dataFormat)throw new Error(`wasm backend DepthwiseConv2dNative does not support dataFormat:'${h.dataFormat}'. Please use 'channelsLast'.`);const S=r.makeOutput(h.outShape,"float32"),F=r.dataIdMap.get(S.dataId).id;return s(l,o.shape[0],o.shape[1],o.shape[2],u,g,b,y,k,_,w,M,v,j,C,I,x,D,F),S}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hTLQ9:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"eluConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Elu)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6NRgP":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"equalConfig",(()=>s));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Equal,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9puem":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"expConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Exp,"float32")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2OTFi":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"expandDims",(()=>o)),r.export(n,"expandDimsConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Reshape");function o(e){const{inputs:t,attrs:n,backend:r}=e,{input:o}=t,{dim:i}=n,l=o.shape.length,u=o.shape.slice();let c=i;return i<0&&(a.util.assert(-(l+1)<=i,(()=>`Axis must be in the interval [${-(l+1)}, ${l}]`)),c=l+i+1),u.splice(c,0,1),s.reshape({inputs:{x:o},backend:r,attrs:{shape:u}})}const i={kernelName:a.ExpandDims,backendName:"wasm",kernelFunc:o}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],geiWD:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function a(e){const{attrs:{shape:t,value:n,dtype:r},backend:a}=e,s=a.makeOutput(t,r);return a.typedArrayFromHeap(s).fill(n),s}r.defineInteropFlag(n),r.export(n,"fill",(()=>a)),r.export(n,"fillConfig",(()=>s));const s={kernelName:e("@tensorflow/tfjs-core").Fill,backendName:"wasm",kernelFunc:a}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d7JTg:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"flipLeftRight",(()=>o)),r.export(n,"flipLeftRightConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core");let s;function o(e){const{inputs:t,backend:n}=e,{image:r}=t,a=n.makeOutput(r.shape,r.dtype),o=n.dataIdMap.get(r.dataId).id,i=n.dataIdMap.get(a.dataId).id,[l,u,c,p]=r.shape;return s(o,l,u,c,p,i),a}const i={kernelName:a.FlipLeftRight,backendName:"wasm",kernelFunc:o,setupFunc:function(e){s=e.wasm.cwrap(a.FlipLeftRight,null,["number","number","number","number","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"29SUM":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"floorConfig",(()=>s));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Floor)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bJ7qU:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"floorDivConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.FloorDiv,!1)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],i7ayZ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"fusedBatchNormConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.FusedBatchNorm,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.FusedBatchNorm,null,["number","number","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{varianceEpsilon:o}=r,{x:i,mean:l,variance:u,offset:c,scale:p}=n,d=t.dataIdMap.get(i.dataId).id,f=t.dataIdMap.get(l.dataId).id,m=t.dataIdMap.get(u.dataId).id,h=null!=c?t.dataIdMap.get(c.dataId).id:0,g=null!=p?t.dataIdMap.get(p.dataId).id:0,b=t.makeOutput(i.shape,i.dtype);if(0===a.util.sizeFromShape(i.shape))return b;const y=t.dataIdMap.get(b.dataId).id;return s(d,f,m,h,g,o,y),b}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bXSgI:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"fusedConv2DConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.FusedConv2D,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.FusedConv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,{x:i,filter:l,bias:u,preluActivationWeights:c}=t,{strides:p,pad:d,dilations:f,dataFormat:m,dimRoundingMode:h,activation:g,leakyreluAlpha:b}=n,y=a.backend_util.computeConv2DInfo(i.shape,l.shape,p,f,d,h),k=s.FusableActivation[g];if(null==k)throw new Error(`${g} activation not yet supported for FusedConv2D in the wasm backend.`);const _=r.dataIdMap.get(i.dataId).id,w=r.dataIdMap.get(l.dataId).id,v=y.outChannels;let j=0;if(null!=u){const e=r.dataIdMap.get(u.dataId);if(1!==e.shape.length)throw new Error(`FusedConv2D only supports rank-1 bias but got rank ${e.shape.length}.`);if(e.shape[0]!==v)throw new Error(`FusedConv2D bias shape (${e.shape}) does not match the number of output channels (${v})`);j=e.id}const C=y.filterHeight,I=y.filterWidth,x=y.padInfo.top,D=y.padInfo.right,M=y.padInfo.bottom,S=y.padInfo.left,F=y.dilationHeight,A=y.dilationWidth,N=y.strideHeight,P=y.strideWidth,E=y.inChannels,R="SAME"===y.padInfo.type?1:0,B=y.batchSize,T=y.inHeight,q=y.inWidth;if("NHWC"!==m)throw new Error(`wasm backend FusedConv2D does not support dataFormat:'${m}'. Please use 'NHWC'.`);const O=r.makeOutput(y.outShape,"float32"),W=r.dataIdMap.get(O.dataId).id,L=null==c?0:r.dataIdMap.get(c.dataId).id;return o(_,B,T,q,w,C,I,j,x,D,M,S,R,F,A,N,P,E,v,k,L,b||0,W),O}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fpjh5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"fusedDepthwiseConv2DConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.FusedDepthwiseConv2D,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.FusedDepthwiseConv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,{x:i,filter:l,bias:u,preluActivationWeights:c}=t,{strides:p,pad:d,dilations:f,dataFormat:m,dimRoundingMode:h,activation:g,leakyreluAlpha:b}=n,y=a.backend_util.computeConv2DInfo(i.shape,l.shape,p,f,d,h,!0),k=s.FusableActivation[g];if(null==k)throw new Error(`${g} activation not yet supported for FusedDepthwiseConv2D in the wasm backend.`);const _=r.dataIdMap.get(i.dataId).id,w=r.dataIdMap.get(l.dataId).id,v=y.outChannels;let j=0;if(null!=u){const e=r.dataIdMap.get(u.dataId);if(1!==e.shape.length)throw new Error(`FusedDepthwiseConv2D only supports rank-1 bias but got rank ${e.shape.length}.`);if(e.shape[0]!==v)throw new Error(`FusedDepthwiseConv2D bias shape (${e.shape}) does not match the number of output channels (${v})`);j=e.id}const C=y.filterHeight,I=y.filterWidth,x=y.padInfo.top,D=y.padInfo.right,M=y.padInfo.bottom,S=y.padInfo.left,F=y.dilationHeight,A=y.dilationWidth,N=y.strideHeight,P=y.strideWidth,E=y.inChannels,R="SAME"===y.padInfo.type?1:0,B=y.batchSize,T=y.inHeight,q=y.inWidth;if("NHWC"!==m)throw new Error(`wasm backend FusedDepthwiseConv2D does not support dataFormat:'${m}'. Please use 'NHWC'.`);const O=r.makeOutput(y.outShape,"float32"),W=r.dataIdMap.get(O.dataId).id,L=null==c?0:r.dataIdMap.get(c.dataId).id;return o(_,B,T,q,w,C,I,j,x,D,M,S,R,F,A,N,P,E,v,k,L,b||0,W),O}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9McxH":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"gatherNdConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.GatherNd,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.GatherNd,null,["number","number","number","number","number","number","array","number"])},kernelFunc:function(e){const{backend:t,inputs:n}=e,{params:r,indices:i}=n,[l,u,c,p]=a.gather_util.prepareAndValidate(r,i),d=t.makeOutput(l,r.dtype);if(0===u)return d;const f=i.shape,m=f[f.length-1],h=t.dataIdMap.get(r.dataId).id,g=t.dataIdMap.get(i.dataId).id,b=new Uint8Array(new Int32Array(p).buffer),y=t.dataIdMap.get(d.dataId).id;return o(h,s.CppDType[r.dtype],g,u,m,c,b,y),d}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e6daa:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"gatherV2Config",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Reshape"),o=e("./types");let i;const l={kernelName:a.GatherV2,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap("Gather",null,["number","number","array","number","number","number","array","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{x:l,indices:u}=n,{axis:c,batchDims:p}=r,d=a.util.parseAxisParam(c,l.shape)[0],f=t.readSync(u.dataId),m=l.shape[d];for(let e=0;e<f.length;++e){const t=f[e];a.util.assert(t<=m-1&&t>=0,(()=>`GatherV2: the index value ${t} is not in [0, ${m-1}]`))}const h=a.backend_util.segment_util.collectGatherOpShapeInfo(l,u,d,p),g=s.reshape({inputs:{x:l},attrs:{shape:[h.batchSize,h.outerSize,h.dimSize,h.sliceSize]},backend:t}),b=a.util.sizeFromShape(u.shape),y=s.reshape({inputs:{x:u},attrs:{shape:[h.batchSize,b/h.batchSize]},backend:t}),k=[h.batchSize,h.outerSize,b/h.batchSize,h.sliceSize],_=t.makeOutput(k,l.dtype);if(0===a.util.sizeFromShape(l.shape))return _;const w=g.shape.length-1,v=t.dataIdMap.get(g.dataId).id,j=t.dataIdMap.get(y.dataId).id,C=t.dataIdMap.get(_.dataId).id,I=new Uint8Array(new Int32Array(a.util.computeStrides(g.shape)).buffer),x=new Uint8Array(new Int32Array(a.util.computeStrides(k)).buffer);return i(v,o.CppDType[l.dtype],I,w,j,h.batchSize,x,C),t.disposeData(g.dataId),t.disposeData(y.dataId),_.shape=h.outputShape,_}}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6JnB0":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"greaterConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Greater,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6T8x5":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"greaterEqualConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.GreaterEqual,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jyGti:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"leakyRelu",(()=>i)),r.export(n,"leakyReluConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;function i(e){const{inputs:{x:t},attrs:{alpha:n},backend:r}=e,i=r.dataIdMap.get(t.dataId).id,l=r.makeOutput(t.shape,"float32");if(0!==a.util.sizeFromShape(t.shape)){const e=r.dataIdMap.get(l.dataId).id;o(i,s.CppDType[t.dtype],n,e)}return l}const l={kernelName:a.LeakyRelu,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.LeakyRelu,null,["number","number","number","number"])},kernelFunc:i}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6302T":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"lessConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Less,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bgZoQ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"lessEqualConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.LessEqual,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],h9Yb3:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"logConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Log)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7S6JD":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"logicalAndConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.LogicalAnd,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4RGKM":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"maxConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils"),o=e("./types");let i;const l={kernelName:a.Max,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Max,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{reductionIndices:l,keepDims:u}=r,{x:c}=n;let p=t.dataIdMap.get(c.dataId).id,d=c;const{transposed:f,axes:m,originalAxes:h,inputWasTransposed:g}=s.permuteAxesAndTranspose(c,l,t);if(g){d=f,p=t.dataIdMap.get(f.dataId).id}const b=d.shape.length;a.backend_util.assertAxesAreInnerMostDims("max",m,b);const[y,k]=a.backend_util.computeOutAndReduceShapes(d.shape,m),_=a.util.sizeFromShape(k),w=t.makeOutput(y,c.dtype);if(0!==a.util.sizeFromShape(d.shape)){const e=t.dataIdMap.get(w.dataId).id;i(p,o.CppDType[c.dtype],_,e)}if(g&&t.disposeData(f.dataId),u){const e=a.backend_util.expandShapeToKeepDim(w.shape,h);w.shape=e}return w}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cL64O:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"maximumConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Maximum,!1)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ImEix:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"maxPoolConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.MaxPool,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.MaxPool,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,attrs:n,backend:r}=e,o=t.x,i=r.dataIdMap.get(o.dataId).id;a.util.assert("float32"===o.dtype,(()=>`Error in MaxPool: only float32 input is supported. Got ${o.dtype}.`));const{filterSize:l,strides:u,pad:c,dimRoundingMode:p}=n,d=a.backend_util.computePool2DInfo(o.shape,l,u,1,c,p),f=d.filterHeight,m=d.filterWidth,h=d.padInfo.top,g=d.padInfo.right,b=d.padInfo.bottom,y=d.padInfo.left,k=d.dilationHeight,_=d.dilationWidth,w=d.strideHeight,v=d.strideWidth,j=d.inChannels,C=d.outChannels;if("channelsLast"!==d.dataFormat)throw new Error(`wasm backend does not support dataFormat:'${d.dataFormat}'. Please use 'channelsLast'.`);const I=r.makeOutput(d.outShape,"float32"),x=r.dataIdMap.get(I.dataId).id;return s(i,o.shape[0],o.shape[1],o.shape[2],f,m,h,g,b,y,k,_,w,v,j,C,x),I}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8hVA0":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"mean",(()=>l)),r.export(n,"meanConfig",(()=>u));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Cast"),o=e("./kernel_utils");let i;function l(e){const{backend:t,inputs:n,attrs:r}=e,{axis:l,keepDims:u}=r,{x:c}=n,p=t.dataIdMap.get(c.dataId).id;let d=p,f=c;const{transposed:m,axes:h,originalAxes:g,inputWasTransposed:b}=o.permuteAxesAndTranspose(c,l,t);let y=h;if(b){const e=t.dataIdMap.get(m.dataId).id;e!==p&&(f=m,d=e,y=a.backend_util.getInnerMostAxes(y.length,f.shape.length))}a.backend_util.assertAxesAreInnerMostDims("mean",y,f.shape.length);const[k,_]=a.backend_util.computeOutAndReduceShapes(f.shape,y),w=a.util.sizeFromShape(_);let v=f;"float32"!==f.dtype&&(v=s.cast({backend:t,inputs:{x:f},attrs:{dtype:"float32"}}),d=t.dataIdMap.get(v.dataId).id);const j=t.makeOutput(k,"float32");if(0!==a.util.sizeFromShape(f.shape)){const e=t.dataIdMap.get(j.dataId).id;i(d,w,e)}if(b&&t.disposeData(m.dataId),u){const e=a.backend_util.expandShapeToKeepDim(j.shape,g);j.shape=e}return"float32"!==f.dtype&&t.disposeData(v.dataId),j}const u={kernelName:a.Mean,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Mean,null,["number, number, number"])},kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hmNa0:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"minConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils"),o=e("./types");let i;const l={kernelName:a.Min,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Min,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:l,keepDims:u}=r,{x:c}=n,p=t.dataIdMap.get(c.dataId).id;let d=p,f=c;const{transposed:m,axes:h,originalAxes:g,inputWasTransposed:b}=s.permuteAxesAndTranspose(c,l,t);if(b){const e=t.dataIdMap.get(m.dataId).id;e!==p&&(f=m,d=e)}const y=f.shape.length;a.backend_util.assertAxesAreInnerMostDims("min",h,y);const[k,_]=a.backend_util.computeOutAndReduceShapes(f.shape,h),w=a.util.sizeFromShape(_),v=t.makeOutput(k,f.dtype);if(0!==a.util.sizeFromShape(f.shape)){const e=t.dataIdMap.get(v.dataId).id;i(d,o.CppDType[c.dtype],w,e)}if(b&&t.disposeData(m.dataId),u){const e=a.backend_util.expandShapeToKeepDim(v.shape,g);v.shape=e}return v}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cN515:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"minimumConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Minimum,!1)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],g4N8P:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"mirrorPadConfig",(()=>u));
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
 */
var a,s,o=e("@tensorflow/tfjs-core"),i=e("./types");let l;(s=a||(a={}))[s.reflect=0]="reflect",s[s.symmetric=1]="symmetric";const u={kernelName:o.MirrorPad,backendName:"wasm",kernelFunc:function(e){const{inputs:{x:t},backend:n,attrs:{paddings:r,mode:s}}=e,o=r.map(((e,n)=>e[0]+t.shape[n]+e[1])),u=n.dataIdMap.get(t.dataId).id,c=n.makeOutput(o,t.dtype),p=n.dataIdMap.get(c.dataId).id,d=new Uint8Array(new Int32Array(t.shape).buffer),f=r.map((e=>e[0])),m=r.map((e=>e[1])),h=new Uint8Array(new Int32Array(f).buffer),g=new Uint8Array(new Int32Array(m).buffer);return l(u,d,t.shape.length,i.CppDType[t.dtype],h,g,a[s],p),c},setupFunc:function(e){l=e.wasm.cwrap(o.MirrorPad,null,["number","array","number","number","array","array","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"98fwB":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"multiplyConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Multiply,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],atIMr:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"negConfig",(()=>s));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Neg)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fMb6L:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"nonMaxSuppressionV3Config",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./NonMaxSuppression_util");let o;const i={kernelName:a.NonMaxSuppressionV3,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.NonMaxSuppressionV3,"number",["number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{iouThreshold:a,maxOutputSize:i,scoreThreshold:l}=r,{boxes:u,scores:c}=n,p=t.dataIdMap.get(u.dataId).id,d=t.dataIdMap.get(c.dataId).id,f=o(p,d,i,a,l),{pSelectedIndices:m,selectedSize:h,pSelectedScores:g,pValidOutputs:b}=s.parseResultStruct(t,f);return t.wasm._free(g),t.wasm._free(b),t.makeOutput([h],"int32",m)}}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hs22K:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function a(e,t){const n=new Int32Array(e.wasm.HEAPU8.buffer,t,4),r=n[0],a=n[1],s=n[2],o=n[3];return e.wasm._free(t),{pSelectedIndices:r,selectedSize:a,pSelectedScores:s,pValidOutputs:o}}r.defineInteropFlag(n),
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
 */
r.export(n,"parseResultStruct",(()=>a))},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6gLQs":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"nonMaxSuppressionV4Config",(()=>i));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./NonMaxSuppression_util");let o;const i={kernelName:a.NonMaxSuppressionV4,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.NonMaxSuppressionV4,"number",["number","number","number","number","number","bool"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{iouThreshold:a,maxOutputSize:i,scoreThreshold:l,padToMaxOutputSize:u}=r,{boxes:c,scores:p}=n,d=t.dataIdMap.get(c.dataId).id,f=t.dataIdMap.get(p.dataId).id,m=o(d,f,i,a,l,u),{pSelectedIndices:h,selectedSize:g,pSelectedScores:b,pValidOutputs:y}=s.parseResultStruct(t,m);return t.wasm._free(b),[t.makeOutput([g],"int32",h),t.makeOutput([],"int32",y)]}}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kWIaw:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"nonMaxSuppressionV5Config",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./NonMaxSuppression_util");let o;const i={kernelName:a.NonMaxSuppressionV5,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.NonMaxSuppressionV5,"number",["number","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{iouThreshold:a,maxOutputSize:i,scoreThreshold:l,softNmsSigma:u}=r,{boxes:c,scores:p}=n,d=t.dataIdMap.get(c.dataId).id,f=t.dataIdMap.get(p.dataId).id,m=o(d,f,i,a,l,u),{pSelectedIndices:h,selectedSize:g,pSelectedScores:b,pValidOutputs:y}=s.parseResultStruct(t,m);return t.wasm._free(y),[t.makeOutput([g],"int32",h),t.makeOutput([g],"float32",b)]}}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gE58W:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"notEqualConfig",(()=>s));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.NotEqual,!1,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2auC5":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"oneHotConfig",(()=>o));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.OneHot,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.OneHot,null,["number","number","number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{indices:a}=t,{depth:o,onValue:i,offValue:l}=r,u=n.makeOutput([...a.shape,o],"int32"),c=n.dataIdMap.get(u.dataId).id,p=n.dataIdMap.get(a.dataId).id;return s(p,o,i,l,c),u}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2C4KL":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"onesLikeConfig",(()=>a));const a={kernelName:e("@tensorflow/tfjs-core").OnesLike,backendName:"wasm",kernelFunc:function(e){const{inputs:{x:t},backend:n}=e,r=n.makeOutput(t.shape,t.dtype);return n.typedArrayFromHeap(r).fill(1),r}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],anZaM:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"pack",(()=>i)),r.export(n,"packConfig",(()=>l));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Concat"),o=e("./ExpandDims");function i(e){const{inputs:t,backend:n,attrs:r}=e,{axis:i}=r;if(1===t.length)return o.expandDims({inputs:{input:t[0]},backend:n,attrs:{dim:i}});const l=t[0].shape,u=t[0].dtype;t.forEach((e=>{a.util.assertShapesMatch(l,e.shape,"All tensors passed to stack must have matching shapes"),a.util.assert(u===e.dtype,(()=>"All tensors passed to stack must have matching dtypes"))}));const c=[],p=t.map((e=>{const t=o.expandDims({inputs:{input:e},backend:n,attrs:{dim:i}});return c.push(t),t})),d=s.concat({inputs:p,backend:n,attrs:{axis:i}});return c.forEach((e=>n.disposeData(e.dataId))),d}const l={kernelName:a.Pack,backendName:"wasm",kernelFunc:i}},{"@tensorflow/tfjs-core":"fqGP4","./Concat":"gg3oU","./ExpandDims":"2OTFi","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jxDD1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"padV2Config",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Fill"),o=e("./types");let i;const l={kernelName:a.PadV2,backendName:"wasm",kernelFunc:function(e){const{inputs:{x:t},backend:n,attrs:{paddings:r,constantValue:l}}=e,u=r.map(((e,n)=>e[0]+t.shape[n]+e[1]));if(0===a.util.sizeFromShape(t.shape))return s.fill({backend:n,attrs:{shape:u,value:l,dtype:t.dtype}});const c=n.dataIdMap.get(t.dataId).id,p=n.makeOutput(u,t.dtype),d=n.dataIdMap.get(p.dataId).id,f=new Uint8Array(new Int32Array(t.shape).buffer),m=r.map((e=>e[0])),h=r.map((e=>e[1])),g=new Uint8Array(new Int32Array(m).buffer),b=new Uint8Array(new Int32Array(h).buffer);return i(c,f,t.shape.length,o.CppDType[t.dtype],g,b,l,d),p},setupFunc:function(e){i=e.wasm.cwrap(a.PadV2,null,["number","array","number","number","array","array","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","./Fill":"geiWD","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lSU1e:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"powConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Pow,!1)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"17lcP":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"preluConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Cast");let o;const i={kernelName:a.Prelu,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.Prelu,null,["number","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n}=e,{x:r,alpha:a}=t,i=n.dataIdMap.get(r.dataId).id,l=n.dataIdMap.get(a.dataId).id;let u=i;const c=r;let p=c;"float32"!==c.dtype&&(p=s.cast({backend:n,inputs:{x:r},attrs:{dtype:"float32"}}),u=n.dataIdMap.get(p.dataId).id);const d=n.makeOutput(r.shape,"float32"),f=n.dataIdMap.get(d.dataId).id;return o(u,l,f),"float32"!==c.dtype&&n.disposeData(p.dataId),d}}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cce5D:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"prodConfig",(()=>l));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils"),o=e("./types");let i;const l={kernelName:a.Prod,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Prod,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:l,keepDims:u}=r,{x:c}=n,p=t.dataIdMap.get(c.dataId).id;let d=p,f=c;const{transposed:m,axes:h,originalAxes:g,inputWasTransposed:b}=s.permuteAxesAndTranspose(c,l,t);let y=h;if(b){const e=t.dataIdMap.get(m.dataId).id;e!==p&&(f=m,d=e,y=a.backend_util.getInnerMostAxes(y.length,f.shape.length))}a.backend_util.assertAxesAreInnerMostDims("prod",y,f.shape.length);const[k,_]=a.backend_util.computeOutAndReduceShapes(f.shape,y),w=a.util.sizeFromShape(_),v=t.makeOutput(k,f.dtype);if(0!==a.util.sizeFromShape(f.shape)){const e=t.dataIdMap.get(v.dataId).id;i(d,w,o.CppDType[v.dtype],e)}if(b&&t.disposeData(m.dataId),u){const e=a.backend_util.expandShapeToKeepDim(v.shape,g);v.shape=e}return v}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j2Vlu:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"range",(()=>o)),r.export(n,"rangeConfig",(()=>i));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("../kernel_utils/shared");const o=e=>{const{backend:t,attrs:n}=e,{start:r,stop:a,step:o,dtype:i}=n,l=s.rangeImplCPU(r,a,o,i),u=t.makeOutput([l.length],i);return t.typedArrayFromHeap(u).set(l),u},i={kernelName:a.Range,backendName:"wasm",kernelFunc:o}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],Br6Ma:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"realDivConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.RealDiv,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],YAD8N:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"reluConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Relu)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ecfwq:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"relu6Config",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Relu6)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hqU2G:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"resizeBilinearConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Cast");let o;const i={kernelName:a.ResizeBilinear,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.ResizeBilinear,null,["number","number","number","number","number","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{images:i}=n,{alignCorners:l,halfPixelCenters:u,size:c}=r,[p,d]=c,[f,m,h,g]=i.shape,b=[f,p,d,g];let y,k=t.dataIdMap.get(i.dataId);"float32"!==k.dtype&&(y=s.cast({backend:t,inputs:{x:i},attrs:{dtype:"float32"}}),k=t.dataIdMap.get(y.dataId));const _=k.id,w=t.makeOutput(b,"float32");if(0===a.util.sizeFromShape(i.shape))return w;const v=t.dataIdMap.get(w.dataId).id;return o(_,f,m,h,g,p,d,l?1:0,u?1:0,v),null!=y&&t.disposeData(y.dataId),w}}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],h8p0f:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"reverse",(()=>l)),r.export(n,"reverseConfig",(()=>u));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Identity"),o=e("./Reshape");let i;function l(e){const{inputs:t,backend:n,attrs:r}=e,{x:l}=t,{dims:u}=r,c=a.util.parseAxisParam(u,l.shape);if(0===l.shape.length)return s.identity({inputs:{x:l},backend:n});const p=n.makeOutput(l.shape,l.dtype),d=n.dataIdMap.get(l.dataId).id,f=n.dataIdMap.get(p.dataId).id,m=new Uint8Array(new Int32Array(c).buffer),h=new Uint8Array(new Int32Array(l.shape).buffer);i(d,m,c.length,h,l.shape.length,f);const g=o.reshape({inputs:{x:p},attrs:{shape:l.shape},backend:n});return n.disposeData(p.dataId),g}const u={kernelName:a.Reverse,backendName:"wasm",kernelFunc:l,setupFunc:function(e){i=e.wasm.cwrap(a.Reverse,null,["number","array","number","array","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","./Identity":"j2v3m","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9Dmog":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"rotateWithOffset",(()=>o)),r.export(n,"rotateWithOffsetConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core");let s;function o(e){const{inputs:t,backend:n,attrs:r}=e,{image:o}=t,{radians:i,fillValue:l,center:u}=r,c=n.makeOutput(o.shape,o.dtype),p=n.dataIdMap.get(o.dataId).id,d=n.dataIdMap.get(c.dataId).id,[f,m,h,g]=o.shape,[b,y]=a.backend_util.getImageCenter(u,m,h),k="number"==typeof l?[l,l,l,0===l?0:255]:[...l,255],_=new Uint8Array(new Int32Array(k).buffer);return s(p,f,m,h,g,i,b,y,_,k.length,d),c}const i={kernelName:a.RotateWithOffset,backendName:"wasm",kernelFunc:o,setupFunc:function(e){s=e.wasm.cwrap(a.RotateWithOffset,null,["number","number","number","number","number","number","number","number","array","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"49MFW":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"roundConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Round)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7tjno":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"rsqrtConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Rsqrt)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1FCGT":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"scatterNdConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.ScatterNd,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.ScatterNd,null,["number","number","number","number","number","number","array","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{indices:i,updates:l}=n,{shape:u}=r,c=t.makeOutput(u,l.dtype);if(0===a.util.sizeFromShape(u))return c;const{sliceRank:p,numUpdates:d,sliceSize:f,strides:m,outputSize:h}=a.scatter_util.calculateShapes(l,i,u),g=t.dataIdMap.get(i.dataId).id,b=t.dataIdMap.get(l.dataId).id,y=new Uint8Array(new Int32Array(m).buffer),k=t.dataIdMap.get(c.dataId).id;return o(g,b,s.CppDType[l.dtype],p,d,f,y,h,k),c}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jCsx6:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"selectConfig",(()=>o));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.Select,backendName:"wasm",kernelFunc:function(e){const{inputs:t,backend:n}=e,{condition:r,t:o,e:i}=t,l=n.dataIdMap.get(r.dataId).id,u=n.dataIdMap.get(o.dataId).id,c=n.dataIdMap.get(i.dataId).id,p=n.makeOutput(o.shape,o.dtype),d=n.dataIdMap.get(p.dataId).id,f=r.shape.length,m=o.shape.length,h=0===f||f>1||1===m?1:a.util.sizeFromShape(o.shape.slice(1));return s(l,u,c,h,d),p},setupFunc:function(e){s=e.wasm.cwrap("SelectV2",null,["number","number","number","number","number"])}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4QdGq":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sigmoidConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:"Sigmoid",backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.Sigmoid,null,["number","number"])},kernelFunc:function(e){const{backend:t,inputs:{x:n}}=e,r=t.dataIdMap.get(n.dataId).id,o=t.makeOutput(n.shape,n.dtype),i=t.dataIdMap.get(o.dataId).id;return 0===a.util.sizeFromShape(o.shape)||s(r,i),o}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hJMTy:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sinConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Sin)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3nqRh":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"softmaxConfig",(()=>o));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.Softmax,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.Softmax,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:{logits:n},attrs:{dim:r}}=e,o=t.dataIdMap.get(n.dataId).id,i=t.makeOutput(n.shape,n.dtype),l=t.dataIdMap.get(i.dataId).id,u=n.shape[r],c=a.util.sizeFromShape(n.shape)/u;return 0===a.util.sizeFromShape(i.shape)||s(o,l,u,c),i}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5gV7j":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"spaceToBatchNDConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./PadV2"),o=e("./Reshape"),i=e("./Transpose");const l={kernelName:a.SpaceToBatchND,backendName:"wasm",kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{x:l}=t,{blockShape:u,paddings:c}=r,p=a.util.sizeFromShape(u),d=[[0,0]];d.push(...c);for(let e=1+u.length;e<l.shape.length;++e)d.push([0,0]);const f=s.padV2Config.kernelFunc({inputs:{x:l},backend:n,attrs:{paddings:d,constantValue:0}}),m=a.backend_util.getReshaped(f.shape,u,p,!1),h=a.backend_util.getPermuted(m.length,u.length,!1),g=a.backend_util.getReshapedPermuted(f.shape,u,p,!1),b={x:f},y={shape:m},k=o.reshape({inputs:b,backend:n,attrs:y}),_={x:k},w={perm:h},v=i.transpose({inputs:_,backend:n,attrs:w}),j={x:v},C={shape:g},I=o.reshape({inputs:j,backend:n,attrs:C});return n.disposeData(f.dataId),n.disposeData(k.dataId),n.disposeData(v.dataId),I}}},{"@tensorflow/tfjs-core":"fqGP4","./PadV2":"jxDD1","./Reshape":"carA0","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jrzyQ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"setup",(()=>l)),r.export(n,"sparseFillEmptyRows",(()=>u)),r.export(n,"sparseFillEmptyRowsConfig",(()=>c));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Slice"),o=e("./types");let i;function l(e){i=e.wasm.cwrap("SparseFillEmptyRows","number",["number","number","number","number","number","number","number","number","number","number","number","number"])}function u(e){const{backend:t,inputs:n}=e,{indices:r,values:l,denseShape:u,defaultValue:c}=n,p=r.shape[0],d=r.shape[1],f=t.readSync(u.dataId)[0],m=[p+f,d],h=t.dataIdMap.get(r.dataId).id,g=t.dataIdMap.get(l.dataId).id,b=t.dataIdMap.get(c.dataId).id,y=t.makeOutput(m,r.dtype),k=t.dataIdMap.get(y.dataId).id,_=t.makeOutput(m.slice(0,1),l.dtype),w=t.dataIdMap.get(_.dataId).id,v=t.makeOutput([f],"bool"),j=t.dataIdMap.get(v.dataId).id,C=t.makeOutput([p],r.dtype),I=t.dataIdMap.get(C.dataId).id,x=t.makeOutput([4],"int32"),D=t.dataIdMap.get(x.dataId).id,M=i(h,g,o.CppDType[l.dtype],p,f,d,b,k,w,j,I,D),S=t.readSync(x.dataId);let F;switch(S[0]){case 1:F=a.backend_util.getSparseFillEmptyRowsIndicesDenseShapeMismatch(S[1]);break;case 2:F=a.backend_util.getSparseFillEmptyRowsNegativeIndexErrorMessage(S[1],S[2]);break;case 3:F=a.backend_util.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(S[1],S[2],S[3]);break;default:F=""}if(t.disposeData(x.dataId),F)throw t.disposeData(y.dataId),t.disposeData(_.dataId),t.disposeData(v.dataId),t.disposeData(C.dataId),new Error(F);let A=y,N=_;return M!==m[0]&&(A=s.slice({inputs:{x:y},attrs:{begin:0,size:[M,d]},backend:t}),N=s.slice({inputs:{x:_},attrs:{begin:0,size:M},backend:t}),t.disposeData(y.dataId),t.disposeData(_.dataId)),[A,N,v,C]}const c={kernelName:a.SparseFillEmptyRows,backendName:"wasm",setupFunc:l,kernelFunc:u}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"59PNO":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sparseReshapeConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.SparseReshape,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.SparseReshape,null,["number","number","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n}=e,{inputIndices:r,inputShape:o,newShape:i}=n;if(2!==r.shape.length)throw new Error(`Input indices should be a matrix but received shape\n        ${r.shape}`);if(1!==o.shape.length)throw new Error(`Input shape should be a vector but received shape\n        ${o.shape}`);if(1!==i.shape.length)throw new Error(`Target shape should be a vector but received shape ${i.shape}`);const l=t.dataIdMap.get(r.dataId).id,u=t.dataIdMap.get(o.dataId).id,c=t.dataIdMap.get(i.dataId).id,p=r.shape[0],d=a.util.sizeFromShape(i.shape),f=t.makeOutput([p,d],r.dtype),m=t.dataIdMap.get(f.dataId).id,h=t.makeOutput([d],i.dtype),g=t.dataIdMap.get(h.dataId).id,b=t.makeOutput([3],"int32"),y=t.dataIdMap.get(b.dataId).id;s(l,u,c,p,m,g,y);const k=t.readSync(b.dataId);let _;switch(k[0]){case 0:_=a.backend_util.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(k[1],k[2]);break;case 1:_=a.backend_util.getSparseReshapeNegativeOutputDimErrorMessage(k[1],k[2]);break;case 2:_=a.backend_util.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage();break;case 3:{const e=Array.from(t.readSync(o.dataId)),n=Array.from(t.readSync(h.dataId));_=a.backend_util.getSparseReshapeInputOutputMultipleErrorMessage(e,n);break}case 4:{const e=Array.from(t.readSync(o.dataId)),n=Array.from(t.readSync(h.dataId));_=a.backend_util.getSparseReshapeInputOutputMismatchErrorMessage(e,n);break}default:_=""}if(t.disposeData(b.dataId),_)throw t.disposeData(f.dataId),t.disposeData(h.dataId),new Error(_);return[f,h]}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eDnJR:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sparseSegmentMeanConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./SparseSegmentReduction");const o={kernelName:a.SparseSegmentMean,backendName:"wasm",setupFunc:s.setup,kernelFunc:function(e){return s.sparseSegmentReduction(e,!0)}}},{"@tensorflow/tfjs-core":"fqGP4","./SparseSegmentReduction":"gnL8M","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gnL8M:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"setup",(()=>i)),r.export(n,"sparseSegmentReduction",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;function i(e){o=e.wasm.cwrap("SparseSegmentReduction",null,["number","number","number","number","number","number","number","number","number"])}function l(e,t){const{backend:n,inputs:r}=e,{data:i,indices:l,segmentIds:u}=r,c=l.shape[0],p=n.readSync(u.dataId,c-1,c)[0],d=c>0?p+1:0;if(d<0)throw new Error(a.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());const f=i.shape.slice();f[0]=d;const m=n.dataIdMap.get(i.dataId).id,h=n.dataIdMap.get(l.dataId).id,g=n.dataIdMap.get(u.dataId).id,b=n.makeOutput(f,i.dtype),y=n.dataIdMap.get(b.dataId).id,k=n.makeOutput([4],"int32"),_=n.dataIdMap.get(k.dataId).id;o(m,s.CppDType[i.dtype],i.shape[0],h,g,y,_,t,0);const w=n.readSync(k.dataId);let v;switch(w[0]){case 0:v=a.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage();break;case 1:v=a.backend_util.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage();break;case 2:v=a.backend_util.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(w[1],w[2]);break;case 3:v=a.backend_util.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(w[1],w[2],w[3]);break;default:v=""}if(n.disposeData(k.dataId),v)throw n.disposeData(b.dataId),new Error(v);return b}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jwNwx:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sparseSegmentSumConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./SparseSegmentReduction");const o={kernelName:a.SparseSegmentSum,backendName:"wasm",setupFunc:s.setup,kernelFunc:function(e){return s.sparseSegmentReduction(e,!1)}}},{"@tensorflow/tfjs-core":"fqGP4","./SparseSegmentReduction":"gnL8M","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kpanS:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"splitV",(()=>o)),r.export(n,"splitVConfig",(()=>i));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Slice");function o(e){const{inputs:t,attrs:n,backend:r}=e,{x:o}=t,{numOrSizeSplits:i,axis:l}=n,u=a.util.parseAxisParam(l,o.shape)[0],c=a.backend_util.prepareSplitSize(o,i,u),p=new Array(o.shape.length).fill(0),d=o.shape.slice();return c.map((e=>{const t=[...d];t[u]=e;const n=s.slice({inputs:{x:o},attrs:{begin:p,size:t},backend:r});return p[u]+=e,n}))}const i={kernelName:a.SplitV,backendName:"wasm",kernelFunc:o}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7Bfb4":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sqrtConfig",(()=>s));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Sqrt)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4eqUw":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"squareConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Square)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3xMkV":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"squaredDifferenceConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.SquaredDifference,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],b4iTq:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"stepConfig",(()=>i));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.Step,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.Step,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{alpha:a}=r,{x:i}=n,l=t.dataIdMap.get(i.dataId).id,u=t.makeOutput(i.shape,i.dtype),c=t.dataIdMap.get(u.dataId).id;return o(l,a,s.CppDType[i.dtype],c),u}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2nai6":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"stridedSlice",(()=>l)),r.export(n,"stridedSliceConfig",(()=>u));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Reshape"),o=e("./Slice");let i;function l(e){const{backend:t,inputs:n,attrs:r}=e,{x:l}=n,{begin:u,end:c,strides:p,beginMask:d,endMask:f,ellipsisMask:m,newAxisMask:h,shrinkAxisMask:g}=r,{finalShapeSparse:b,finalShape:y,isIdentity:k,sliceDim0:_,isSimpleSlice:w,begin:v,end:j,strides:C}=a.slice_util.sliceInfo(l.shape,u,c,p,d,f,m,h,g);let I;if(k)I=s.reshape({inputs:{x:l},backend:t,attrs:{shape:y}});else if(_||w){a.util.assert(l.shape.length>=1,(()=>`Input must have rank at least 1, got: ${l.shape.length}`));const e=a.slice_util.computeOutShape(v,j,C),n=o.slice({inputs:{x:l},backend:t,attrs:{begin:v,size:e}});I=s.reshape({inputs:{x:n},backend:t,attrs:{shape:y}}),t.disposeData(n.dataId)}else{const e=t.makeOutput(b,"float32"),n=t.dataIdMap.get(l.dataId).id,r=new Uint8Array(new Int32Array(a.util.computeStrides(l.shape)).buffer),o=new Uint8Array(new Int32Array(v).buffer),u=new Uint8Array(new Int32Array(j).buffer),c=new Uint8Array(new Int32Array(C).buffer),p=new Uint8Array(new Int32Array(b).buffer),d=new Uint8Array(new Int32Array(a.util.computeStrides(b)).buffer),f=t.dataIdMap.get(e.dataId).id;i(n,r,l.shape.length,o,u,c,p,d,b.length,f),I=s.reshape({inputs:{x:e},backend:t,attrs:{shape:y}}),t.disposeData(e.dataId)}return I}const u={kernelName:a.StridedSlice,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.StridedSlice,null,["number","array","number","array","array","array","array","array","number","number"])},kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],auNTX:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"subConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./binary_kernel").createBinaryKernelConfig(a.Sub,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],itfOR:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"sumConfig",(()=>l));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./kernel_utils"),o=e("./types");let i;const l={kernelName:a.Sum,backendName:"wasm",setupFunc:function(e){i=e.wasm.cwrap(a.Sum,null,["number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{axis:l,keepDims:u}=r,{x:c}=n,p=t.dataIdMap.get(c.dataId).id;let d=p,f=c;const{transposed:m,axes:h,originalAxes:g,inputWasTransposed:b}=s.permuteAxesAndTranspose(c,l,t);let y=h;if(b){const e=t.dataIdMap.get(m.dataId).id;e!==p&&(f=m,d=e,y=a.backend_util.getInnerMostAxes(y.length,f.shape.length))}a.backend_util.assertAxesAreInnerMostDims("sum",y,f.shape.length);const[k,_]=a.backend_util.computeOutAndReduceShapes(f.shape,y),w=a.util.sizeFromShape(_),v=t.makeOutput(k,f.dtype);if(0!==a.util.sizeFromShape(f.shape)){const e=t.dataIdMap.get(v.dataId).id;i(d,w,o.CppDType[v.dtype],e)}if(b&&t.disposeData(m.dataId),u){const e=a.backend_util.expandShapeToKeepDim(v.shape,g);v.shape=e}return v}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2BnQa":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"tanConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Tan)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"92eBX":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"tanhConfig",(()=>s));
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
 */
var a=e("@tensorflow/tfjs-core");const s=e("./unary_kernel").createUnaryKernelConfig(a.Tanh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9dHgQ":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"tileConfig",(()=>i));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i={kernelName:a.Tile,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.Tile,null,["number","array","number","array","number","number"])},kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{x:a}=t,i=n.dataIdMap.get(a.dataId).id,{reps:l}=r,u=new Array(a.shape.length);for(let e=0;e<u.length;e++)u[e]=a.shape[e]*l[e];const c=new Uint8Array(new Int32Array(a.shape).buffer),p=new Uint8Array(new Int32Array(u).buffer),d=n.makeOutput(u,a.dtype),f=n.dataIdMap.get(d.dataId).id;return o(i,c,a.shape.length,p,u.length,s.CppDType[d.dtype],f),d}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3N5sa":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"topk",(()=>i)),r.export(n,"topKConfig",(()=>l));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./types");let o;const i=({inputs:e,backend:t,attrs:n})=>{const{x:r}=e,{k:a,sorted:i}=n,l=t.dataIdMap.get(r.dataId).id,u=new Uint8Array(new Int32Array(r.shape).buffer),c=r.shape.slice();c[c.length-1]=a;const p=t.makeOutput(c,r.dtype),d=t.dataIdMap.get(p.dataId).id,f=t.makeOutput(c,"int32"),m=t.dataIdMap.get(f.dataId).id;return o(l,u,r.shape.length,s.CppDType[r.dtype],a,i,d,m),[p,f]},l={kernelName:a.TopK,backendName:"wasm",setupFunc:function(e){o=e.wasm.cwrap(a.TopK,null,["number","array","number","number","number","bool","number","number"])},kernelFunc:i}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"73Gmi":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"transformConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core");let s;const o={kernelName:a.Transform,backendName:"wasm",setupFunc:function(e){s=e.wasm.cwrap(a.Transform,null,["number","number","bool","number","number","number","number","number","number","array","number","number","number","number","number"])},kernelFunc:function(e){const{backend:t,inputs:n,attrs:r}=e,{image:o,transforms:i}=n,{interpolation:l,fillMode:u,fillValue:c,outputShape:p}=r,[d,f,m,h]=o.shape,[g,b]=null!=p?p:[f,m],y=[d,g,b,h],k=new Uint8Array(new Int32Array(a.util.computeStrides(o.shape)).buffer),_=t.makeOutput(y,o.dtype),w=t.dataIdMap.get(_.dataId).id,v=t.dataIdMap.get(o.dataId).id,j=t.dataIdMap.get(i.dataId).id,C="nearest"===l?1:2;let I;switch(u){case"constant":default:I=1;break;case"reflect":I=2;break;case"wrap":I=3;break;case"nearest":I=4}return s(v,j,i.shape[0]>1,d,g,b,h,m,f,k,o.shape.length-1,C,I,c,w),_}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eRN3n:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"unpackConfig",(()=>o));
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
 */
var a=e("@tensorflow/tfjs-core"),s=e("./Slice");const o={kernelName:a.Unpack,backendName:"wasm",kernelFunc:function(e){const{inputs:t,backend:n,attrs:r}=e,{value:a}=t;let{axis:o}=r;o<0&&(o+=a.shape.length);const i=a.shape[o],l=a.shape.length,u=new Array(l-1);let c=0;for(let e=0;e<l;e++)e!==o&&(u[c++]=a.shape[e]);const p=new Array(i),d=new Array(l).fill(0),f=a.shape.slice();f[o]=1;for(let e=0;e<p.length;e++)d[o]=e,p[e]=s.slice({inputs:{x:a},attrs:{begin:d,size:f},backend:n});return p.map((({dataId:e,dtype:t})=>({dataId:e,dtype:t,shape:u})))}}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e67PN:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"zerosLikeConfig",(()=>a));const a={kernelName:e("@tensorflow/tfjs-core").ZerosLike,backendName:"wasm",kernelFunc:function(e){const{inputs:{x:t},backend:n}=e,r=n.makeOutput(t.shape,t.dtype);return n.typedArrayFromHeap(r).fill(0),r}}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"24GdS":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"BackendWasm",(()=>s.BackendWasm)),r.export(n,"getThreadsCount",(()=>s.getThreadsCount)),r.export(n,"setThreadsCount",(()=>s.setThreadsCount)),r.export(n,"setWasmPath",(()=>s.setWasmPath)),r.export(n,"setWasmPaths",(()=>s.setWasmPaths)),r.export(n,"version_wasm",(()=>o.version));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */
e("./flags_wasm");var a=e("@tensorflow/tfjs-core"),s=e("./backend_wasm"),o=e("./version");a.registerBackend("wasm",(async()=>{const{wasm:e}=await s.init();return new s.BackendWasm(e)}),2)},{"./flags_wasm":"lbvcn","@tensorflow/tfjs-core":"fqGP4","./backend_wasm":"a0163","./version":"gZXkh","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lbvcn:[function(e,t,n){const r=e("@tensorflow/tfjs-core").env();r.registerFlag("WASM_HAS_SIMD_SUPPORT",(async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11])))),r.registerFlag("WASM_HAS_MULTITHREAD_SUPPORT",(async()=>{if(r.get("IS_NODE"))return!1;try{return(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch(e){return!1}}))},{"@tensorflow/tfjs-core":"fqGP4"}],a0163:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"BackendWasm",(()=>c)),r.export(n,"init",(()=>d)),r.export(n,"setWasmPath",(()=>k)),r.export(n,"setWasmPaths",(()=>_)),r.export(n,"resetWasmPath",(()=>w)),r.export(n,"setThreadsCount",(()=>C)),r.export(n,"getThreadsCount",(()=>I));
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
 */
e("./flags_wasm");var a=e("@tensorflow/tfjs-core"),s=e("../wasm-out/tfjs-backend-wasm-threaded-simd.js"),o=r.interopDefault(s),i=e("../wasm-out/tfjs-backend-wasm-threaded-simd.worker.js"),l=e("../wasm-out/tfjs-backend-wasm.js"),u=r.interopDefault(l);class c extends a.KernelBackend{constructor(e){super(),this.wasm=e,this.dataIdNextNumber=1,this.wasm.tfjs.initWithThreadsCount(v),j=this.wasm.tfjs.getThreadsCount(),this.dataIdMap=new a.DataStorage(this,a.engine())}write(e,t,n){const r={id:this.dataIdNextNumber++};return this.move(r,e,t,n,1),r}numDataIds(){return this.dataIdMap.numDataIds()}async time(e){const t=a.util.now();e();return{kernelMs:a.util.now()-t}}move(e,t,n,r,s){const o=this.dataIdNextNumber++;if("string"===r){const a=t;return void this.dataIdMap.set(e,{id:o,stringBytes:a,shape:n,dtype:r,memoryOffset:null,refCount:s})}const i=a.util.sizeFromShape(n),l=i*a.util.bytesPerElement(r),u=this.wasm._malloc(l);this.dataIdMap.set(e,{id:o,memoryOffset:u,shape:n,dtype:r,refCount:s}),this.wasm.tfjs.registerTensor(o,i,u),null!=t&&this.wasm.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,l),u)}async read(e){return this.readSync(e)}readSync(e,t,n){const{memoryOffset:r,dtype:s,shape:o,stringBytes:i}=this.dataIdMap.get(e);if("string"===s)return null!=t&&0!==t||!(null==n||n>=i.length)?i.slice(t,n):i;t=t||0,n=n||a.util.sizeFromShape(o);const l=a.util.bytesPerElement(s);return function(e,t){switch(t){case"float32":return new Float32Array(e);case"int32":return new Int32Array(e);case"bool":return new Uint8Array(e);default:throw new Error(`Unknown dtype ${t}`)}}(this.wasm.HEAPU8.slice(r+t*l,r+n*l).buffer,s)}disposeData(e,t=!1){if(this.dataIdMap.has(e)){const n=this.dataIdMap.get(e);if(n.refCount--,!t&&n.refCount>0)return!1;this.wasm._free(n.memoryOffset),this.wasm.tfjs.disposeData(n.id),this.dataIdMap.delete(e)}return!0}refCount(e){if(this.dataIdMap.has(e)){return this.dataIdMap.get(e).refCount}return 0}incRef(e){const t=this.dataIdMap.get(e);null!=t&&t.refCount++}floatPrecision(){return 32}getMemoryOffset(e){return this.dataIdMap.get(e).memoryOffset}dispose(){this.wasm.tfjs.dispose(),"PThread"in this.wasm&&this.wasm.PThread.terminateAllThreads(),this.wasm=null}memory(){return{unreliable:!1}}makeOutput(e,t,n){let r;if(null==n)r=this.write(null,e,t);else{const s=this.dataIdNextNumber++;r={id:s},this.dataIdMap.set(r,{id:s,memoryOffset:n,shape:e,dtype:t,refCount:1});const o=a.util.sizeFromShape(e);this.wasm.tfjs.registerTensor(s,o,n)}return{dataId:r,shape:e,dtype:t}}typedArrayFromHeap({shape:e,dtype:t,dataId:n}){const r=this.wasm.HEAPU8.buffer,{memoryOffset:s}=this.dataIdMap.get(n),o=a.util.sizeFromShape(e);switch(t){case"float32":return new Float32Array(r,s,o);case"int32":return new Int32Array(r,s,o);case"bool":return new Uint8Array(r,s,o);default:throw new Error(`Unknown dtype ${t}`)}}}function p(e,t,n){if(null!=m)return m;let r="tfjs-backend-wasm.wasm";return e&&t?r="tfjs-backend-wasm-threaded-simd.wasm":e&&(r="tfjs-backend-wasm-simd.wasm"),null!=g&&null!=g[r]?g[r]:n+r}async function d(){const[e,t]=await Promise.all([a.env().getAsync("WASM_HAS_SIMD_SUPPORT"),a.env().getAsync("WASM_HAS_MULTITHREAD_SUPPORT")]);return new Promise(((n,r)=>{const s={};var l;s.locateFile=(n,r)=>{if(n.endsWith(".worker.js")){const e=i.wasmWorkerContents.replace(/\n/g,"\\n"),t=new Blob([e],{type:"application/javascript"});return URL.createObjectURL(t)}return n.endsWith(".wasm")?p(e,t,null!=h?h:r):r+n},y&&(s.instantiateWasm=(l=p(e,t,null!=h?h:""),(e,t)=>(a.util.fetch(l,{credentials:"same-origin"}).then((n=>{n.ok||e.env.a(`failed to load wasm binary file at '${l}'`),n.arrayBuffer().then((n=>{WebAssembly.instantiate(n,e).then((e=>{t(e.instance,e.module)}))}))})),{})));let c,d=!1;s.onAbort=()=>{if(d)return;if(b)return;b=!0;r({message:"Make sure the server can serve the `.wasm` file relative to the bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers"})},t&&e&&null==m?(s.mainScriptUrlOrBlob=new Blob(["var WasmBackendModuleThreadedSimd = "+o.default.toString()],{type:"text/javascript"}),c=o.default(s)):c=u.default(s),c.then((e=>{d=!0,b=!1;e.tfjs={init:e.cwrap("init",null,[]),initWithThreadsCount:e.cwrap("init_with_threads_count",null,["number"]),getThreadsCount:e.cwrap("get_threads_count","number",[]),registerTensor:e.cwrap("register_tensor",null,["number","number","number"]),disposeData:e.cwrap("dispose_data",null,["number"]),dispose:e.cwrap("dispose",null,[])},n({wasm:e})}))}))}const f=["tfjs-backend-wasm.wasm","tfjs-backend-wasm-simd.wasm","tfjs-backend-wasm-threaded-simd.wasm"];let m=null,h=null,g={},b=!1,y=!1;function k(e,t=!1){if(a.deprecationWarn("setWasmPath has been deprecated in favor of setWasmPaths and will be removed in a future release."),b)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`");m=e,y=t}function _(e,t=!1){if(b)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPaths()` before you call `tf.setBackend()` or `tf.ready()`");if("string"==typeof e)h=e;else{g=e;const t=f.filter((e=>null==g[e]));if(t.length>0)throw new Error(`There were no entries found for the following binaries: ${t.join(",")}. Please either call setWasmPaths with a map providing a path for each binary, or with a string indicating the directory where all the binaries can be found.`)}y=t}function w(){m=null,h=null,g={},y=!1,b=!1}let v=-1,j=-1;function C(e){v=e}function I(){if(-1===j)throw new Error("WASM backend not initialized.");return j}},{"./flags_wasm":"lbvcn","@tensorflow/tfjs-core":"fqGP4","../wasm-out/tfjs-backend-wasm-threaded-simd.js":"gDXL8","../wasm-out/tfjs-backend-wasm-threaded-simd.worker.js":"bpcnH","../wasm-out/tfjs-backend-wasm.js":"2FM6X","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gDXL8:[function(e,t,n){var r,a="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out",s=arguments[3],o=e("process"),i="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.js",l=(r="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0,void 0!==i&&(r=r||i),function(t){function n(){return R.buffer!=U&&Z(R.buffer),z}function i(){return R.buffer!=U&&Z(R.buffer),H}function l(){return R.buffer!=U&&Z(R.buffer),V}function u(){return R.buffer!=U&&Z(R.buffer),K}var c,p,d,f=void 0!==(t=t||{})?t:{};f.ready=new Promise((function(e,t){c=e,p=t})),void 0!==o&&o.listeners&&(d={uncaughtException:o.listeners("uncaughtException"),unhandledRejection:o.listeners("unhandledRejection")});var m,h,g,b,y,k,_=Object.assign({},f),w=[],v=(e,t)=>{throw t},j="object"==typeof window,C="function"==typeof importScripts,I="object"==typeof o&&"object"==typeof o.versions&&"string"==typeof o.versions.node,x=f.ENVIRONMENT_IS_PTHREAD||!1,D="";function M(e){return f.locateFile?f.locateFile(e,D):D+e}if(I){let t;D=C?e("path").dirname(D)+"/":a+"/",k=()=>{y||(b=e("fs"),y=e("path"))},m=function(e,t){return k(),e=y.normalize(e),b.readFileSync(e,t?void 0:"utf8")},g=e=>{var t=m(e,!0);return t.buffer||(t=new Uint8Array(t)),t},h=(e,t,n)=>{k(),e=y.normalize(e),b.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},o.argv.length>1&&o.argv[1].replace(/\\/g,"/"),w=o.argv.slice(2),o.on("uncaughtException",(function(e){if(!(e instanceof pt))throw e})),o.on("unhandledRejection",(function(e){throw e})),v=(e,t)=>{if(se())throw o.exitCode=e,t;var n;(n=t)instanceof pt||P("exiting due to exception: "+n),o.exit(e)},f.inspect=function(){return"[Emscripten Module object]"};try{t=e("worker_threads")}catch(e){throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'),e}s.Worker=t.Worker}else(j||C)&&(C?D=self.location.href:"undefined"!=typeof document&&document.currentScript&&(D=document.currentScript.src),void 0!==r&&r&&(D=r),D=0!==D.indexOf("blob:")?D.substr(0,D.replace(/[?#].*/,"").lastIndexOf("/")+1):"",I||(m=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},C&&(g=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),h=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)}));I&&"undefined"==typeof performance&&(s.performance=e("perf_hooks").performance);var S=console.log.bind(console),F=console.warn.bind(console);I&&(k(),S=e=>b.writeSync(1,e+"\n"),F=e=>b.writeSync(2,e+"\n"));var A,N=f.print||S,P=f.printErr||F;function E(e){E.shown||(E.shown={}),E.shown[e]||(E.shown[e]=1,P(e))}Object.assign(f,_),_=null,f.arguments&&(w=f.arguments),f.thisProgram&&f.thisProgram,f.quit&&(v=f.quit),Atomics.load,Atomics.store,Atomics.compareExchange,f.wasmBinary&&(A=f.wasmBinary);var R,B,T=f.noExitRuntime||!0;"object"!=typeof WebAssembly&&pe("no native wasm support detected");var q,O=!1;function W(e){return f["_"+e]}function L(e,t,r,a,s){var o={string:function(e){var t=0;if(null!=e&&0!==e){var n=1+(e.length<<2);Q(e,t=ut(n),n)}return t},array:function(e){var t,r,a=ut(e.length);return t=e,r=a,n().set(t,r),a}},i=W(e),l=[],u=0;if(a)for(var c=0;c<a.length;c++){var p=o[r[c]];p?(0===u&&(u=it()),l[c]=p(a[c])):l[c]=a[c]}var d,f=i.apply(null,l);return d=f,0!==u&&lt(u),f=function(e){return"string"===t?X(e):"boolean"===t?Boolean(e):e}(d),f}function G(e){var t=new TextDecoder(e);this.decode=e=>(e.buffer instanceof SharedArrayBuffer&&(e=new Uint8Array(e)),t.decode.call(t,e))}var U,z,H,V,K,Y="undefined"!=typeof TextDecoder?new G("utf8"):void 0;function $(e,t,n){for(var r=t+n,a=t;e[a]&&!(a>=r);)++a;if(a-t>16&&e.subarray&&Y)return Y.decode(e.subarray(t,a));for(var s="";t<a;){var o=e[t++];if(128&o){var i=63&e[t++];if(192!=(224&o)){var l=63&e[t++];if((o=224==(240&o)?(15&o)<<12|i<<6|l:(7&o)<<18|i<<12|l<<6|63&e[t++])<65536)s+=String.fromCharCode(o);else{var u=o-65536;s+=String.fromCharCode(55296|u>>10,56320|1023&u)}}else s+=String.fromCharCode((31&o)<<6|i)}else s+=String.fromCharCode(o)}return s}function X(e,t){return e?$(i(),e,t):""}function Q(e,t,n){return function(e,t,n,r){if(!(r>0))return 0;for(var a=n,s=n+r-1,o=0;o<e.length;++o){var i=e.charCodeAt(o);if(i>=55296&&i<=57343&&(i=65536+((1023&i)<<10)|1023&e.charCodeAt(++o)),i<=127){if(n>=s)break;t[n++]=i}else if(i<=2047){if(n+1>=s)break;t[n++]=192|i>>6,t[n++]=128|63&i}else if(i<=65535){if(n+2>=s)break;t[n++]=224|i>>12,t[n++]=128|i>>6&63,t[n++]=128|63&i}else{if(n+3>=s)break;t[n++]=240|i>>18,t[n++]=128|i>>12&63,t[n++]=128|i>>6&63,t[n++]=128|63&i}}return t[n]=0,n-a}(e,i(),t,n)}function Z(e){U=e,f.HEAP8=z=new Int8Array(e),f.HEAP16=new Int16Array(e),f.HEAP32=V=new Int32Array(e),f.HEAPU8=H=new Uint8Array(e),f.HEAPU16=new Uint16Array(e),f.HEAPU32=new Uint32Array(e),f.HEAPF32=new Float32Array(e),f.HEAPF64=K=new Float64Array(e)}"undefined"!=typeof TextDecoder&&new G("utf-16le"),x&&(U=f.buffer);var J,ee=f.INITIAL_MEMORY||16777216;if(x)R=f.wasmMemory,U=f.buffer;else if(f.wasmMemory)R=f.wasmMemory;else if(!((R=new WebAssembly.Memory({initial:ee/65536,maximum:32768,shared:!0})).buffer instanceof SharedArrayBuffer))throw P("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),I&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),Error("bad memory");R&&(U=R.buffer),ee=U.byteLength,Z(U);var te=[],ne=[],re=[],ae=[];function se(){return T||!1}function oe(){x||ge(ne)}var ie,le=0,ue=null,ce=null;function pe(e){x?postMessage({cmd:"onAbort",arg:e}):f.onAbort&&f.onAbort(e),P(e="Aborted("+e+")"),O=!0,q=1,e+=". Build with -s ASSERTIONS=1 for more info.";var t=new WebAssembly.RuntimeError(e);throw p(t),t}function de(e){return e.startsWith("data:application/octet-stream;base64,")}function fe(e){return e.startsWith("file://")}function me(e){try{if(e==ie&&A)return new Uint8Array(A);if(g)return g(e);throw"both async and sync fetching of the wasm failed"}catch(e){pe(e)}}f.preloadedImages={},f.preloadedAudios={},de(ie="tfjs-backend-wasm-threaded-simd.wasm")||(ie=M(ie));var he={};function ge(e){for(;e.length>0;){var t=e.shift();if("function"!=typeof t){var n=t.func;"number"==typeof n?void 0===t.arg?Ce(n)():Ce(n)(t.arg):n(void 0===t.arg?null:t.arg)}else t(f)}}function be(e){var t=it(),n=e();return lt(t),n}function ye(e){var t=_e.pthreads[e];if(t){l()[e>>2]=0;var n=t.worker;_e.returnWorkerToPool(n)}}function ke(e){!function(e,t){if(q=e,!t&&x)throw we(e),"unwind";var n;se()||x||_e.terminateAllThreads(),q=n=e,se()||(_e.terminateAllThreads(),f.onExit&&f.onExit(n),O=!0),v(n,new pt(n))}(e)}var _e={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],init:function(){x?_e.initWorker():_e.initMainThread()},initMainThread:function(){for(var e=0;e<8;++e)_e.allocateUnusedWorker()},initWorker:function(){T=!1},pthreads:{},setExitStatus:function(e){q=e},terminateAllThreads:function(){for(var e in _e.pthreads){var t=_e.pthreads[e];t&&t.worker&&_e.returnWorkerToPool(t.worker)}for(var n=0;n<_e.unusedWorkers.length;++n)_e.unusedWorkers[n].terminate();_e.unusedWorkers=[]},returnWorkerToPool:function(e){_e.runWithoutMainThreadQueuedCalls((function(){delete _e.pthreads[e.pthread.threadInfoStruct],_e.unusedWorkers.push(e),_e.runningWorkers.splice(_e.runningWorkers.indexOf(e),1),st(e.pthread.threadInfoStruct),e.pthread=void 0}))},runWithoutMainThreadQueuedCalls:function(e){l()[ct>>2]=0;try{e()}finally{l()[ct>>2]=1}},receiveObjectTransfer:function(e){},threadInit:function(){for(var e in _e.tlsInitFunctions)_e.tlsInitFunctions[e]()},loadWasmModuleToWorker:function(e,t){e.onmessage=n=>{var r,a=n.data,s=a.cmd;if(e.pthread&&(_e.currentProxiedOperationCallerThread=e.pthread.threadInfoStruct),a.targetThread&&a.targetThread!=Je()){var o=_e.pthreads[a.targetThread];return o?o.worker.postMessage(a,a.transferList):P('Internal error! Worker sent a message "'+s+'" to target pthread '+a.targetThread+", but that thread no longer exists!"),void(_e.currentProxiedOperationCallerThread=void 0)}"processQueuedMainThreadWork"===s?et():"spawnThread"===s?xe(a):"cleanupThread"===s?ye(a.thread):"killThread"===s?function(e){l()[e>>2]=0;var t=_e.pthreads[e];delete _e.pthreads[e],t.worker.terminate(),st(e),_e.runningWorkers.splice(_e.runningWorkers.indexOf(t.worker),1),t.worker.pthread=void 0}(a.thread):"cancelThread"===s?(r=a.thread,_e.pthreads[r].worker.postMessage({cmd:"cancel"})):"loaded"===s?(e.loaded=!0,t&&t(e),e.runPthread&&(e.runPthread(),delete e.runPthread)):"print"===s?N("Thread "+a.threadId+": "+a.text):"printErr"===s?P("Thread "+a.threadId+": "+a.text):"alert"===s?alert("Thread "+a.threadId+": "+a.text):"setimmediate"===a.target?e.postMessage(a):"onAbort"===s?f.onAbort&&f.onAbort(a.arg):P("worker sent an unknown command "+s),_e.currentProxiedOperationCallerThread=void 0},e.onerror=e=>{throw P("worker sent an error! "+e.filename+":"+e.lineno+": "+e.message),e},I&&(e.on("message",(function(t){e.onmessage({data:t})})),e.on("error",(function(t){e.onerror(t)})),e.on("detachedExit",(function(){}))),e.postMessage({cmd:"load",urlOrBlob:f.mainScriptUrlOrBlob||r,wasmMemory:R,wasmModule:B})},allocateUnusedWorker:function(){var e=M("tfjs-backend-wasm-threaded-simd.worker.js");_e.unusedWorkers.push(new Worker(e))},getNewWorker:function(){return 0==_e.unusedWorkers.length&&(_e.allocateUnusedWorker(),_e.loadWasmModuleToWorker(_e.unusedWorkers[0])),_e.unusedWorkers.pop()}};function we(e){if(x)return Me(1,0,e);try{ke(e)}catch(e){!function(e){if(e instanceof pt||"unwind"==e)return q;v(1,e)}(e)}}f.establishStackSpace=function(){var e=Je(),t=l()[e+44>>2],n=l()[e+48>>2];ot(t,t-n),lt(t)};var ve,je=[];function Ce(e){var t=je[e];return t||(e>=je.length&&(je.length=e+1),je[e]=t=J.get(e)),t}function Ie(e,t){var n,r;if(0===e)n=Date.now();else{if(1!==e&&4!==e)return r=28,l()[Ze()>>2]=r,-1;n=ve()}return l()[t>>2]=n/1e3|0,l()[t+4>>2]=n%1e3*1e6|0,0}function xe(e){var t=_e.getNewWorker();if(!t)return 6;_e.runningWorkers.push(t);var n=_e.pthreads[e.pthread_ptr]={worker:t,threadInfoStruct:e.pthread_ptr};t.pthread=n;var r={cmd:"run",start_routine:e.startRoutine,arg:e.arg,threadInfoStruct:e.pthread_ptr};return t.runPthread=()=>{r.time=performance.now(),t.postMessage(r,e.transferList)},t.loaded&&(t.runPthread(),delete t.runPthread),0}function De(){return 2147483648}function Me(e,t){var n=arguments.length-2,r=arguments;return be((function(){for(var a=n,s=ut(8*a),o=s>>3,i=0;i<n;i++){var l=r[2+i];u()[o+i]=l}return rt(e,a,s,t)}))}f.invokeEntryPoint=function(e,t){return Ce(e)(t)},ve=I?()=>{var e=o.hrtime();return 1e3*e[0]+e[1]/1e6}:x?()=>performance.now()-f.__performance_now_clock_drift:()=>performance.now();var Se=[];function Fe(e){try{return R.grow(e-U.byteLength+65535>>>16),Z(R.buffer),1}catch(e){}}var Ae={inEventHandler:0,removeAllEventListeners:function(){for(var e=Ae.eventHandlers.length-1;e>=0;--e)Ae._removeHandler(e);Ae.eventHandlers=[],Ae.deferredCalls=[]},registerRemoveEventListeners:function(){Ae.removeEventListenersRegistered||(re.push(Ae.removeAllEventListeners),Ae.removeEventListenersRegistered=!0)},deferredCalls:[],deferCall:function(e,t,n){function r(e,t){if(e.length!=t.length)return!1;for(var n in e)if(e[n]!=t[n])return!1;return!0}for(var a in Ae.deferredCalls){var s=Ae.deferredCalls[a];if(s.targetFunction==e&&r(s.argsList,n))return}Ae.deferredCalls.push({targetFunction:e,precedence:t,argsList:n}),Ae.deferredCalls.sort((function(e,t){return e.precedence<t.precedence}))},removeDeferredCalls:function(e){for(var t=0;t<Ae.deferredCalls.length;++t)Ae.deferredCalls[t].targetFunction==e&&(Ae.deferredCalls.splice(t,1),--t)},canPerformEventHandlerRequests:function(){return Ae.inEventHandler&&Ae.currentEventHandler.allowsDeferredCalls},runDeferredCalls:function(){if(Ae.canPerformEventHandlerRequests())for(var e=0;e<Ae.deferredCalls.length;++e){var t=Ae.deferredCalls[e];Ae.deferredCalls.splice(e,1),--e,t.targetFunction.apply(null,t.argsList)}},eventHandlers:[],removeAllHandlersOnTarget:function(e,t){for(var n=0;n<Ae.eventHandlers.length;++n)Ae.eventHandlers[n].target!=e||t&&t!=Ae.eventHandlers[n].eventTypeString||Ae._removeHandler(n--)},_removeHandler:function(e){var t=Ae.eventHandlers[e];t.target.removeEventListener(t.eventTypeString,t.eventListenerFunc,t.useCapture),Ae.eventHandlers.splice(e,1)},registerOrRemoveHandler:function(e){var t=function(t){++Ae.inEventHandler,Ae.currentEventHandler=e,Ae.runDeferredCalls(),e.handlerFunc(t),Ae.runDeferredCalls(),--Ae.inEventHandler};if(e.callbackfunc)e.eventListenerFunc=t,e.target.addEventListener(e.eventTypeString,t,e.useCapture),Ae.eventHandlers.push(e),Ae.registerRemoveEventListeners();else for(var n=0;n<Ae.eventHandlers.length;++n)Ae.eventHandlers[n].target==e.target&&Ae.eventHandlers[n].eventTypeString==e.eventTypeString&&Ae._removeHandler(n--)},queueEventHandlerOnThread_iiii:function(e,t,n,r,a){be((function(){var s=ut(12);l()[s>>2]=n,l()[s+4>>2]=r,l()[s+8>>2]=a,at(e,637534208,t,r,s)}))},getTargetThreadForEventCallback:function(e){switch(e){case 1:return 0;case 2:return _e.currentProxiedOperationCallerThread;default:return e}},getNodeNameForTarget:function(e){return e?e==window?"#window":e==screen?"#screen":e&&e.nodeName?e.nodeName:"":""},fullscreenEnabled:function(){return document.fullscreenEnabled||document.webkitFullscreenEnabled}};function Ne(e,t,n,r){be((function(){var a,s,o,i=ut(12),u=0;t&&(s=function(e){for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);r>=55296&&r<=57343&&(r=65536+((1023&r)<<10)|1023&e.charCodeAt(++n)),r<=127?++t:t+=r<=2047?2:r<=65535?3:4}return t}(a=t)+1,o=Xe(s),Q(a,o,s),u=o),l()[i>>2]=u,l()[i+4>>2]=n,l()[i+8>>2]=r,at(e,657457152,0,u,i)}))}var Pe=[0,"undefined"!=typeof document?document:0,"undefined"!=typeof window?window:0];function Ee(e){var t;return e=(t=e)>2?X(t):t,Pe[e]||("undefined"!=typeof document?document.querySelector(e):void 0)}function Re(e){return Ee(e)}function Be(e,t,n){var r=Re(e);if(!r)return-4;if(r.canvasSharedPtr&&(l()[r.canvasSharedPtr>>2]=t,l()[r.canvasSharedPtr+4>>2]=n),!r.offscreenCanvas&&r.controlTransferredOffscreen)return r.canvasSharedPtr?(function(e,t,n,r){Ne(e,t=t?X(t):"",n,r)}(l()[r.canvasSharedPtr+8>>2],e,t,n),1):-4;r.offscreenCanvas&&(r=r.offscreenCanvas);var a=!1;if(r.GLctxObject&&r.GLctxObject.GLctx){var s=r.GLctxObject.GLctx.getParameter(2978);a=0===s[0]&&0===s[1]&&s[2]===r.width&&s[3]===r.height}return r.width=t,r.height=n,a&&r.GLctxObject.GLctx.viewport(0,0,t,n),0}function Te(e,t,n){return x?Me(2,1,e,t,n):Be(e,t,n)}var qe,Oe={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],shaders:[],vaos:[],contexts:{},offscreenCanvases:{},queries:[],stringCache:{},unpackAlignment:4,recordError:function(e){Oe.lastError||(Oe.lastError=e)},getNewId:function(e){for(var t=Oe.counter++,n=e.length;n<t;n++)e[n]=null;return t},getSource:function(e,t,n,r){for(var a="",s=0;s<t;++s){var o=r?l()[r+4*s>>2]:-1;a+=X(l()[n+4*s>>2],o<0?void 0:o)}return a},createContext:function(e,t){e.getContextSafariWebGL2Fixed||(e.getContextSafariWebGL2Fixed=e.getContext,e.getContext=function(t,n){var r=e.getContextSafariWebGL2Fixed(t,n);return"webgl"==t==r instanceof WebGLRenderingContext?r:null});var n=e.getContext("webgl",t);return n?Oe.registerContext(n,t):0},registerContext:function(e,t){var n=Xe(8);l()[n+4>>2]=Je();var r={handle:n,attributes:t,version:t.majorVersion,GLctx:e};return e.canvas&&(e.canvas.GLctxObject=r),Oe.contexts[n]=r,(void 0===t.enableExtensionsByDefault||t.enableExtensionsByDefault)&&Oe.initExtensions(r),n},makeContextCurrent:function(e){return Oe.currentContext=Oe.contexts[e],f.ctx=qe=Oe.currentContext&&Oe.currentContext.GLctx,!(e&&!qe)},getContext:function(e){return Oe.contexts[e]},deleteContext:function(e){Oe.currentContext===Oe.contexts[e]&&(Oe.currentContext=null),"object"==typeof Ae&&Ae.removeAllHandlersOnTarget(Oe.contexts[e].GLctx.canvas),Oe.contexts[e]&&Oe.contexts[e].GLctx.canvas&&(Oe.contexts[e].GLctx.canvas.GLctxObject=void 0),Qe(Oe.contexts[e].handle),Oe.contexts[e]=null},initExtensions:function(e){if(e||(e=Oe.currentContext),!e.initExtensionsDone){e.initExtensionsDone=!0;var t,n=e.GLctx;!function(e){var t=e.getExtension("ANGLE_instanced_arrays");t&&(e.vertexAttribDivisor=function(e,n){t.vertexAttribDivisorANGLE(e,n)},e.drawArraysInstanced=function(e,n,r,a){t.drawArraysInstancedANGLE(e,n,r,a)},e.drawElementsInstanced=function(e,n,r,a,s){t.drawElementsInstancedANGLE(e,n,r,a,s)})}(n),function(e){var t=e.getExtension("OES_vertex_array_object");t&&(e.createVertexArray=function(){return t.createVertexArrayOES()},e.deleteVertexArray=function(e){t.deleteVertexArrayOES(e)},e.bindVertexArray=function(e){t.bindVertexArrayOES(e)},e.isVertexArray=function(e){return t.isVertexArrayOES(e)})}(n),function(e){var t=e.getExtension("WEBGL_draw_buffers");t&&(e.drawBuffers=function(e,n){t.drawBuffersWEBGL(e,n)})}(n),n.disjointTimerQueryExt=n.getExtension("EXT_disjoint_timer_query"),(t=n).multiDrawWebgl=t.getExtension("WEBGL_multi_draw"),(n.getSupportedExtensions()||[]).forEach((function(e){e.includes("lose_context")||e.includes("debug")||n.getExtension(e)}))}}},We=["default","low-power","high-performance"],Le={mappings:{},buffers:[null,[],[]],printChar:function(e,t){var n=Le.buffers[e];0===t||10===t?((1===e?N:P)($(n,0)),n.length=0):n.push(t)},varargs:void 0,get:function(){return Le.varargs+=4,l()[Le.varargs-4>>2]},getStr:function(e){return X(e)},get64:function(e,t){return e}};function Ge(e){return x?Me(3,1,e):0}function Ue(e,t,n,r,a){if(x)return Me(4,1,e,t,n,r,a)}function ze(e,t,n,r){if(x)return Me(5,1,e,t,n,r);for(var a=0,s=0;s<n;s++){var o=l()[t>>2],u=l()[t+4>>2];t+=8;for(var c=0;c<u;c++)Le.printChar(e,i()[o+c]);a+=u}return l()[r>>2]=a,0}_e.init();var He,Ve,Ke,Ye=[null,we,Te,Ge,Ue,ze],$e={__clock_gettime:function(e,t){return Ie(e,t)},__emscripten_init_main_thread_js:function(e){tt(e,!C,1,!j),_e.threadInit()},__emscripten_thread_cleanup:function(e){x?postMessage({cmd:"cleanupThread",thread:e}):ye(e)},__pthread_create_js:function(e,t,n,r){if("undefined"==typeof SharedArrayBuffer)return P("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var a=[];if(x&&0===a.length)return nt(687865856,e,t,n,r);var s={startRoutine:n,pthread_ptr:e,arg:r,transferList:a};return x?(s.cmd="spawnThread",postMessage(s,a),0):xe(s)},_emscripten_default_pthread_stack_size:function(){return 2097152},_emscripten_notify_thread_queue:function(e,t){if(e==t)postMessage({cmd:"processQueuedMainThreadWork"});else if(x)postMessage({targetThread:e,cmd:"processThreadQueue"});else{var n=_e.pthreads[e],r=n&&n.worker;if(!r)return;r.postMessage({cmd:"processThreadQueue"})}return 1},abort:function(){pe("")},emscripten_check_blocking_allowed:function(){I||C||E("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread")},emscripten_get_heap_max:De,emscripten_get_now:ve,emscripten_memcpy_big:function(e,t,n){i().copyWithin(e,t,t+n)},emscripten_num_logical_cores:function(){return I?e("os").cpus().length:navigator.hardwareConcurrency},emscripten_receive_on_main_thread_js:function(e,t,n){Se.length=t;for(var r=n>>3,a=0;a<t;a++)Se[a]=u()[r+a];return(e<0?he[-e-1]:Ye[e]).apply(null,Se)},emscripten_resize_heap:function(e){var t=i().length;if((e>>>=0)<=t)return!1;var n,r,a=2147483648;if(e>a)return!1;for(var s=1;s<=4;s*=2){var o=t*(1+.2/s);if(o=Math.min(o,e+100663296),Fe(Math.min(a,((n=Math.max(e,o))%(r=65536)>0&&(n+=r-n%r),n))))return!0}return!1},emscripten_set_canvas_element_size:function(e,t,n){return Re(e)?Be(e,t,n):Te(e,t,n)},emscripten_unwind_to_js_event_loop:function(){throw"unwind"},emscripten_webgl_create_context:function(e,t){return n=e,r=t>>2,a=l()[r+6],s={alpha:!!l()[r+0],depth:!!l()[r+1],stencil:!!l()[r+2],antialias:!!l()[r+3],premultipliedAlpha:!!l()[r+4],preserveDrawingBuffer:!!l()[r+5],powerPreference:We[a],failIfMajorPerformanceCaveat:!!l()[r+7],majorVersion:l()[r+8],minorVersion:l()[r+9],enableExtensionsByDefault:l()[r+10],explicitSwapControl:l()[r+11],proxyContextToMainThread:l()[r+12],renderViaOffscreenBackBuffer:l()[r+13]},(o=Re(n))?s.explicitSwapControl?0:Oe.createContext(o,s):0;var n,r,a,s,o},exit:ke,fd_close:Ge,fd_seek:Ue,fd_write:ze,memory:R||f.wasmMemory,setTempRet0:function(e){}},Xe=(function(){var e={env:$e,wasi_snapshot_preview1:$e};function t(e,t){var n,r,a=e.exports;if(f.asm=a,n=f.asm.emscripten_tls_init,_e.tlsInitFunctions.push(n),J=f.asm.__indirect_function_table,r=f.asm.__wasm_call_ctors,ne.unshift(r),B=t,!x){var s=_e.unusedWorkers.length;_e.unusedWorkers.forEach((function(e){_e.loadWasmModuleToWorker(e,(function(){--s||function(e){if(le--,f.monitorRunDependencies&&f.monitorRunDependencies(le),0==le&&(null!==ue&&(clearInterval(ue),ue=null),ce)){var t=ce;ce=null,t()}}()}))}))}}function n(e){t(e.instance,e.module)}function r(t){return function(){if(!A&&(j||C)){if("function"==typeof fetch&&!fe(ie))return fetch(ie,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+ie+"'";return e.arrayBuffer()})).catch((function(){return me(ie)}));if(h)return new Promise((function(e,t){h(ie,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return me(ie)}))}().then((function(t){return WebAssembly.instantiate(t,e)})).then((function(e){return e})).then(t,(function(e){P("failed to asynchronously prepare wasm: "+e),pe(e)}))}if(x||(le++,f.monitorRunDependencies&&f.monitorRunDependencies(le)),f.instantiateWasm)try{return f.instantiateWasm(e,t)}catch(e){return P("Module.instantiateWasm callback failed with error: "+e),!1}(A||"function"!=typeof WebAssembly.instantiateStreaming||de(ie)||fe(ie)||"function"!=typeof fetch?r(n):fetch(ie,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,e).then(n,(function(e){return P("wasm streaming compile failed: "+e),P("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(p)}(),f.___wasm_call_ctors=function(){return(f.___wasm_call_ctors=f.asm.__wasm_call_ctors).apply(null,arguments)},f._init=function(){return(f._init=f.asm.init).apply(null,arguments)},f._init_with_threads_count=function(){return(f._init_with_threads_count=f.asm.init_with_threads_count).apply(null,arguments)},f._get_threads_count=function(){return(f._get_threads_count=f.asm.get_threads_count).apply(null,arguments)},f._register_tensor=function(){return(f._register_tensor=f.asm.register_tensor).apply(null,arguments)},f._dispose_data=function(){return(f._dispose_data=f.asm.dispose_data).apply(null,arguments)},f._dispose=function(){return(f._dispose=f.asm.dispose).apply(null,arguments)},f._Abs=function(){return(f._Abs=f.asm.Abs).apply(null,arguments)},f._Add=function(){return(f._Add=f.asm.Add).apply(null,arguments)},f._AddN=function(){return(f._AddN=f.asm.AddN).apply(null,arguments)},f._All=function(){return(f._All=f.asm.All).apply(null,arguments)},f._Any=function(){return(f._Any=f.asm.Any).apply(null,arguments)},f._ArgMax=function(){return(f._ArgMax=f.asm.ArgMax).apply(null,arguments)},f._AvgPool=function(){return(f._AvgPool=f.asm.AvgPool).apply(null,arguments)},f._BatchMatMul=function(){return(f._BatchMatMul=f.asm.BatchMatMul).apply(null,arguments)},f._Ceil=function(){return(f._Ceil=f.asm.Ceil).apply(null,arguments)},f._ClipByValue=function(){return(f._ClipByValue=f.asm.ClipByValue).apply(null,arguments)},f._Conv2D=function(){return(f._Conv2D=f.asm.Conv2D).apply(null,arguments)},f._Conv2DBackpropInput=function(){return(f._Conv2DBackpropInput=f.asm.Conv2DBackpropInput).apply(null,arguments)},f._Cos=function(){return(f._Cos=f.asm.Cos).apply(null,arguments)},f._Cosh=function(){return(f._Cosh=f.asm.Cosh).apply(null,arguments)},f._CropAndResize=function(){return(f._CropAndResize=f.asm.CropAndResize).apply(null,arguments)},f._Cumprod=function(){return(f._Cumprod=f.asm.Cumprod).apply(null,arguments)},f._Cumsum=function(){return(f._Cumsum=f.asm.Cumsum).apply(null,arguments)},f._DepthToSpace=function(){return(f._DepthToSpace=f.asm.DepthToSpace).apply(null,arguments)},f._DepthwiseConv2dNative=function(){return(f._DepthwiseConv2dNative=f.asm.DepthwiseConv2dNative).apply(null,arguments)},f._Elu=function(){return(f._Elu=f.asm.Elu).apply(null,arguments)},f._Equal=function(){return(f._Equal=f.asm.Equal).apply(null,arguments)},f._Exp=function(){return(f._Exp=f.asm.Exp).apply(null,arguments)},f._FlipLeftRight=function(){return(f._FlipLeftRight=f.asm.FlipLeftRight).apply(null,arguments)},f._Floor=function(){return(f._Floor=f.asm.Floor).apply(null,arguments)},f._FloorDiv=function(){return(f._FloorDiv=f.asm.FloorDiv).apply(null,arguments)},f._FusedBatchNorm=function(){return(f._FusedBatchNorm=f.asm.FusedBatchNorm).apply(null,arguments)},f._FusedConv2D=function(){return(f._FusedConv2D=f.asm.FusedConv2D).apply(null,arguments)},f._FusedDepthwiseConv2D=function(){return(f._FusedDepthwiseConv2D=f.asm.FusedDepthwiseConv2D).apply(null,arguments)},f._Gather=function(){return(f._Gather=f.asm.Gather).apply(null,arguments)},f._GatherNd=function(){return(f._GatherNd=f.asm.GatherNd).apply(null,arguments)},f._Greater=function(){return(f._Greater=f.asm.Greater).apply(null,arguments)},f._GreaterEqual=function(){return(f._GreaterEqual=f.asm.GreaterEqual).apply(null,arguments)},f._LeakyRelu=function(){return(f._LeakyRelu=f.asm.LeakyRelu).apply(null,arguments)},f._Less=function(){return(f._Less=f.asm.Less).apply(null,arguments)},f._LessEqual=function(){return(f._LessEqual=f.asm.LessEqual).apply(null,arguments)},f._Log=function(){return(f._Log=f.asm.Log).apply(null,arguments)},f._LogicalAnd=function(){return(f._LogicalAnd=f.asm.LogicalAnd).apply(null,arguments)},f._Max=function(){return(f._Max=f.asm.Max).apply(null,arguments)},f._MaxPool=function(){return(f._MaxPool=f.asm.MaxPool).apply(null,arguments)},f._Maximum=function(){return(f._Maximum=f.asm.Maximum).apply(null,arguments)},f._Mean=function(){return(f._Mean=f.asm.Mean).apply(null,arguments)},f._Min=function(){return(f._Min=f.asm.Min).apply(null,arguments)},f._Minimum=function(){return(f._Minimum=f.asm.Minimum).apply(null,arguments)},f._MirrorPad=function(){return(f._MirrorPad=f.asm.MirrorPad).apply(null,arguments)},f._Multiply=function(){return(f._Multiply=f.asm.Multiply).apply(null,arguments)},f._Neg=function(){return(f._Neg=f.asm.Neg).apply(null,arguments)},f._NonMaxSuppressionV3=function(){return(f._NonMaxSuppressionV3=f.asm.NonMaxSuppressionV3).apply(null,arguments)},f._NonMaxSuppressionV4=function(){return(f._NonMaxSuppressionV4=f.asm.NonMaxSuppressionV4).apply(null,arguments)},f._NonMaxSuppressionV5=function(){return(f._NonMaxSuppressionV5=f.asm.NonMaxSuppressionV5).apply(null,arguments)},f._NotEqual=function(){return(f._NotEqual=f.asm.NotEqual).apply(null,arguments)},f._OneHot=function(){return(f._OneHot=f.asm.OneHot).apply(null,arguments)},f._PadV2=function(){return(f._PadV2=f.asm.PadV2).apply(null,arguments)},f._Pow=function(){return(f._Pow=f.asm.Pow).apply(null,arguments)},f._Prelu=function(){return(f._Prelu=f.asm.Prelu).apply(null,arguments)},f._Prod=function(){return(f._Prod=f.asm.Prod).apply(null,arguments)},f._RealDiv=function(){return(f._RealDiv=f.asm.RealDiv).apply(null,arguments)},f._Relu=function(){return(f._Relu=f.asm.Relu).apply(null,arguments)},f._Relu6=function(){return(f._Relu6=f.asm.Relu6).apply(null,arguments)},f._ResizeBilinear=function(){return(f._ResizeBilinear=f.asm.ResizeBilinear).apply(null,arguments)},f._Reverse=function(){return(f._Reverse=f.asm.Reverse).apply(null,arguments)},f._RotateWithOffset=function(){return(f._RotateWithOffset=f.asm.RotateWithOffset).apply(null,arguments)},f._Round=function(){return(f._Round=f.asm.Round).apply(null,arguments)},f._Rsqrt=function(){return(f._Rsqrt=f.asm.Rsqrt).apply(null,arguments)},f._ScatterNd=function(){return(f._ScatterNd=f.asm.ScatterNd).apply(null,arguments)},f._SelectV2=function(){return(f._SelectV2=f.asm.SelectV2).apply(null,arguments)},f._Sigmoid=function(){return(f._Sigmoid=f.asm.Sigmoid).apply(null,arguments)},f._Sin=function(){return(f._Sin=f.asm.Sin).apply(null,arguments)},f._Softmax=function(){return(f._Softmax=f.asm.Softmax).apply(null,arguments)},f._SparseFillEmptyRows=function(){return(f._SparseFillEmptyRows=f.asm.SparseFillEmptyRows).apply(null,arguments)},f._SparseReshape=function(){return(f._SparseReshape=f.asm.SparseReshape).apply(null,arguments)},f._SparseSegmentReduction=function(){return(f._SparseSegmentReduction=f.asm.SparseSegmentReduction).apply(null,arguments)},f._Sqrt=function(){return(f._Sqrt=f.asm.Sqrt).apply(null,arguments)},f._Square=function(){return(f._Square=f.asm.Square).apply(null,arguments)},f._SquaredDifference=function(){return(f._SquaredDifference=f.asm.SquaredDifference).apply(null,arguments)},f._Step=function(){return(f._Step=f.asm.Step).apply(null,arguments)},f._StridedSlice=function(){return(f._StridedSlice=f.asm.StridedSlice).apply(null,arguments)},f._Sub=function(){return(f._Sub=f.asm.Sub).apply(null,arguments)},f._Sum=function(){return(f._Sum=f.asm.Sum).apply(null,arguments)},f._Tan=function(){return(f._Tan=f.asm.Tan).apply(null,arguments)},f._Tanh=function(){return(f._Tanh=f.asm.Tanh).apply(null,arguments)},f._Tile=function(){return(f._Tile=f.asm.Tile).apply(null,arguments)},f._TopK=function(){return(f._TopK=f.asm.TopK).apply(null,arguments)},f._Transform=function(){return(f._Transform=f.asm.Transform).apply(null,arguments)},f._Transpose=function(){return(f._Transpose=f.asm.Transpose).apply(null,arguments)},f.__FusedMatMul=function(){return(f.__FusedMatMul=f.asm._FusedMatMul).apply(null,arguments)},f._malloc=function(){return(Xe=f._malloc=f.asm.malloc).apply(null,arguments)}),Qe=f._free=function(){return(Qe=f._free=f.asm.free).apply(null,arguments)},Ze=(f._emscripten_tls_init=function(){return(f._emscripten_tls_init=f.asm.emscripten_tls_init).apply(null,arguments)},f.___errno_location=function(){return(Ze=f.___errno_location=f.asm.__errno_location).apply(null,arguments)}),Je=f._pthread_self=function(){return(Je=f._pthread_self=f.asm.pthread_self).apply(null,arguments)},et=f._emscripten_main_thread_process_queued_calls=function(){return(et=f._emscripten_main_thread_process_queued_calls=f.asm.emscripten_main_thread_process_queued_calls).apply(null,arguments)},tt=(f.__emscripten_thread_crashed=function(){return(f.__emscripten_thread_crashed=f.asm._emscripten_thread_crashed).apply(null,arguments)},f.__emscripten_thread_init=function(){return(tt=f.__emscripten_thread_init=f.asm._emscripten_thread_init).apply(null,arguments)}),nt=(f._emscripten_current_thread_process_queued_calls=function(){return(f._emscripten_current_thread_process_queued_calls=f.asm.emscripten_current_thread_process_queued_calls).apply(null,arguments)},f._emscripten_main_browser_thread_id=function(){return(f._emscripten_main_browser_thread_id=f.asm.emscripten_main_browser_thread_id).apply(null,arguments)},f._emscripten_sync_run_in_main_thread_2=function(){return(f._emscripten_sync_run_in_main_thread_2=f.asm.emscripten_sync_run_in_main_thread_2).apply(null,arguments)},f._emscripten_sync_run_in_main_thread_4=function(){return(nt=f._emscripten_sync_run_in_main_thread_4=f.asm.emscripten_sync_run_in_main_thread_4).apply(null,arguments)}),rt=f._emscripten_run_in_main_runtime_thread_js=function(){return(rt=f._emscripten_run_in_main_runtime_thread_js=f.asm.emscripten_run_in_main_runtime_thread_js).apply(null,arguments)},at=f._emscripten_dispatch_to_thread_=function(){return(at=f._emscripten_dispatch_to_thread_=f.asm.emscripten_dispatch_to_thread_).apply(null,arguments)},st=f.__emscripten_thread_free_data=function(){return(st=f.__emscripten_thread_free_data=f.asm._emscripten_thread_free_data).apply(null,arguments)},ot=(f.__emscripten_thread_exit=function(){return(f.__emscripten_thread_exit=f.asm._emscripten_thread_exit).apply(null,arguments)},f._memalign=function(){return(f._memalign=f.asm.memalign).apply(null,arguments)},f._emscripten_stack_set_limits=function(){return(ot=f._emscripten_stack_set_limits=f.asm.emscripten_stack_set_limits).apply(null,arguments)}),it=f.stackSave=function(){return(it=f.stackSave=f.asm.stackSave).apply(null,arguments)},lt=f.stackRestore=function(){return(lt=f.stackRestore=f.asm.stackRestore).apply(null,arguments)},ut=f.stackAlloc=function(){return(ut=f.stackAlloc=f.asm.stackAlloc).apply(null,arguments)},ct=(f.dynCall_iijjiiii=function(){return(f.dynCall_iijjiiii=f.asm.dynCall_iijjiiii).apply(null,arguments)},f.dynCall_jiji=function(){return(f.dynCall_jiji=f.asm.dynCall_jiji).apply(null,arguments)},f.__emscripten_allow_main_runtime_queued_calls=21464);function pt(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function dt(e){if(e=e||w,!(le>0)){if(x)return c(f),oe(),void postMessage({cmd:"loaded"});!function(){if(f.preRun)for("function"==typeof f.preRun&&(f.preRun=[f.preRun]);f.preRun.length;)e=f.preRun.shift(),te.unshift(e);var e;ge(te)}(),le>0||(f.setStatus?(f.setStatus("Running..."),setTimeout((function(){setTimeout((function(){f.setStatus("")}),1),t()}),1)):t())}function t(){He||(He=!0,f.calledRun=!0,O||(oe(),c(f),f.onRuntimeInitialized&&f.onRuntimeInitialized(),function(){if(!x){if(f.postRun)for("function"==typeof f.postRun&&(f.postRun=[f.postRun]);f.postRun.length;)e=f.postRun.shift(),ae.unshift(e);var e;ge(ae)}}()))}}if(f.cwrap=function(e,t,n,r){var a=(n=n||[]).every((function(e){return"number"===e}));return"string"!==t&&a&&!r?W(e):function(){return L(e,t,n,arguments)}},f.keepRuntimeAlive=se,f.PThread=_e,f.PThread=_e,f.wasmMemory=R,f.ExitStatus=pt,ce=function e(){He||dt(),He||(ce=e)},f.run=dt,f.preInit)for("function"==typeof f.preInit&&(f.preInit=[f.preInit]);f.preInit.length>0;)f.preInit.pop()();if(dt(),d&&(Ve={uncaughtException:o.listeners("uncaughtException").filter((function(e){return!d.uncaughtException.indexOf(e)>-1})),unhandledRejection:o.listeners("unhandledRejection").filter((function(e){return!d.unhandledRejection.indexOf(e)>-1}))}),"undefined"!=typeof WasmBackendModule)Ke=WasmBackendModule;else{if(void 0===t)throw new Error("Could not find wasm module in post.js");Ke=t}if(Ve){var ft=Ke._dispose;Ke._dispose=function(){ft(),Ve.uncaughtException.forEach((function(e){o.removeListener("uncaughtException",e)})),Ve.unhandledRejection.forEach((function(e){o.removeListener("unhandledRejection",e)}))}}return t.ready});t.exports=l},{process:"5xM3z",path:"34v0S",fs:"34v0S",worker_threads:"34v0S",perf_hooks:"34v0S",os:"34v0S"}],bpcnH:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"wasmWorkerContents",(()=>a));const a='"use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",function(data){onmessage({data:data})});var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8"))},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"\n");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=((info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports});self.onmessage=(e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob==="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module).then(function(instance){Module=instance})}else if(e.data.cmd==="run"){Module["__performance_now_clock_drift"]=performance.now()-e.data.time;Module["__emscripten_thread_init"](e.data.threadInfoStruct,0,0,1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInit();try{var result=Module["invokeEntryPoint"](e.data.start_routine,e.data.arg);if(Module["keepRuntimeAlive"]()){Module["PThread"].setExitStatus(result)}else{Module["__emscripten_thread_exit"](result)}}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processThreadQueue"){if(Module["_pthread_self"]()){Module["_emscripten_current_thread_process_queued_calls"]()}}else if(e.data.cmd==="processProxyingQueue"){if(Module["_pthread_self"]()){Module["_emscripten_proxy_execute_queue"](e.data.queue)}}else{err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){err("worker.js onmessage() captured an uncaught exception: "+ex);if(ex&&ex.stack)err(ex.stack);if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}});'},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2FM6X":[function(e,t,n){var r,a="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm.js",s=e("process"),o=(r=(r="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||a,function(t){var n,a,o,i=void 0!==(t=t||{})?t:{};i.ready=new Promise((function(e,t){n=e,a=t})),void 0!==s&&s.listeners&&(o={uncaughtException:s.listeners("uncaughtException"),unhandledRejection:s.listeners("unhandledRejection")});var l,u,c,p,d,f,m=Object.assign({},i),h=[],g="object"==typeof window,b="function"==typeof importScripts,y="object"==typeof s&&"object"==typeof s.versions&&"string"==typeof s.versions.node,k="";y?(k=b?e("path").dirname(k)+"/":"node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/",f=()=>{d||(p=e("fs"),d=e("path"))},l=function(e,t){return f(),e=d.normalize(e),p.readFileSync(e,t?void 0:"utf8")},c=e=>{var t=l(e,!0);return t.buffer||(t=new Uint8Array(t)),t},u=(e,t,n)=>{f(),e=d.normalize(e),p.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},s.argv.length>1&&s.argv[1].replace(/\\/g,"/"),h=s.argv.slice(2),s.on("uncaughtException",(function(e){if(!(e instanceof ie))throw e})),s.on("unhandledRejection",(function(e){throw e})),i.inspect=function(){return"[Emscripten Module object]"}):(g||b)&&(b?k=self.location.href:"undefined"!=typeof document&&document.currentScript&&(k=document.currentScript.src),r&&(k=r),k=0!==k.indexOf("blob:")?k.substr(0,k.replace(/[?#].*/,"").lastIndexOf("/")+1):"",l=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},b&&(c=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),u=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)});var _,w=i.print||console.log.bind(console),v=i.printErr||console.warn.bind(console);Object.assign(i,m),m=null,i.arguments&&(h=i.arguments),i.thisProgram&&i.thisProgram,i.quit&&i.quit,i.wasmBinary&&(_=i.wasmBinary);var j;i.noExitRuntime;"object"!=typeof WebAssembly&&z("no native wasm support detected");var C=!1;function I(e){return i["_"+e]}function x(e,t,n,r,a){var s={string:function(e){var t=0;if(null!=e&&0!==e){var n=1+(e.length<<2);!function(e,t,n){!function(e,t,n,r){if(!(r>0))return 0;for(var a=n+r-1,s=0;s<e.length;++s){var o=e.charCodeAt(s);if(o>=55296&&o<=57343&&(o=65536+((1023&o)<<10)|1023&e.charCodeAt(++s)),o<=127){if(n>=a)break;t[n++]=o}else if(o<=2047){if(n+1>=a)break;t[n++]=192|o>>6,t[n++]=128|63&o}else if(o<=65535){if(n+2>=a)break;t[n++]=224|o>>12,t[n++]=128|o>>6&63,t[n++]=128|63&o}else{if(n+3>=a)break;t[n++]=240|o>>18,t[n++]=128|o>>12&63,t[n++]=128|o>>6&63,t[n++]=128|63&o}}t[n]=0}(e,S,t,n)}(e,t=oe(n),n)}return t},array:function(e){var t,n,r=oe(e.length);return t=e,n=r,M.set(t,n),r}},o=I(e),i=[],l=0;if(r)for(var u=0;u<r.length;u++){var c=s[n[u]];c?(0===l&&(l=ae()),i[u]=c(r[u])):i[u]=r[u]}var p,d=o.apply(null,i);return p=d,0!==l&&se(l),d=function(e){return"string"===t?P(e):"boolean"===t?Boolean(e):e}(p),d}var D,M,S,F,A="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function N(e,t,n){for(var r=t+n,a=t;e[a]&&!(a>=r);)++a;if(a-t>16&&e.subarray&&A)return A.decode(e.subarray(t,a));for(var s="";t<a;){var o=e[t++];if(128&o){var i=63&e[t++];if(192!=(224&o)){var l=63&e[t++];if((o=224==(240&o)?(15&o)<<12|i<<6|l:(7&o)<<18|i<<12|l<<6|63&e[t++])<65536)s+=String.fromCharCode(o);else{var u=o-65536;s+=String.fromCharCode(55296|u>>10,56320|1023&u)}}else s+=String.fromCharCode((31&o)<<6|i)}else s+=String.fromCharCode(o)}return s}function P(e,t){return e?N(S,e,t):""}function E(e){D=e,i.HEAP8=M=new Int8Array(e),i.HEAP16=new Int16Array(e),i.HEAP32=F=new Int32Array(e),i.HEAPU8=S=new Uint8Array(e),i.HEAPU16=new Uint16Array(e),i.HEAPU32=new Uint32Array(e),i.HEAPF32=new Float32Array(e),i.HEAPF64=new Float64Array(e)}"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le"),i.INITIAL_MEMORY;var R,B=[],T=[],q=[];var O,W,L=0,G=null,U=null;function z(e){i.onAbort&&i.onAbort(e),v(e="Aborted("+e+")"),C=!0,e+=". Build with -s ASSERTIONS=1 for more info.";var t=new WebAssembly.RuntimeError(e);throw a(t),t}function H(e){return e.startsWith("data:application/octet-stream;base64,")}function V(e){return e.startsWith("file://")}function K(e){try{if(e==O&&_)return new Uint8Array(_);if(c)return c(e);throw"both async and sync fetching of the wasm failed"}catch(e){z(e)}}function Y(e){for(;e.length>0;){var t=e.shift();if("function"!=typeof t){var n=t.func;"number"==typeof n?void 0===t.arg?X(n)():X(n)(t.arg):n(void 0===t.arg?null:t.arg)}else t(i)}}i.preloadedImages={},i.preloadedAudios={},H(O="tfjs-backend-wasm.wasm")||(W=O,O=i.locateFile?i.locateFile(W,k):k+W);var $=[];function X(e){var t=$[e];return t||(e>=$.length&&($.length=e+1),$[e]=t=R.get(e)),t}function Q(){return 2147483648}function Z(e){try{return j.grow(e-D.byteLength+65535>>>16),E(j.buffer),1}catch(e){}}var J,ee,te,ne={mappings:{},buffers:[null,[],[]],printChar:function(e,t){var n=ne.buffers[e];0===t||10===t?((1===e?w:v)(N(n,0)),n.length=0):n.push(t)},varargs:void 0,get:function(){return ne.varargs+=4,F[ne.varargs-4>>2]},getStr:function(e){return P(e)},get64:function(e,t){return e}},re={abort:function(){z("")},emscripten_get_heap_max:Q,emscripten_memcpy_big:function(e,t,n){S.copyWithin(e,t,t+n)},emscripten_resize_heap:function(e){var t,n,r=S.length,a=2147483648;if((e>>>=0)>a)return!1;for(var s=1;s<=4;s*=2){var o=r*(1+.2/s);if(o=Math.min(o,e+100663296),Z(Math.min(a,((t=Math.max(e,o))%(n=65536)>0&&(t+=n-t%n),t))))return!0}return!1},fd_close:function(e){return 0},fd_seek:function(e,t,n,r,a){},fd_write:function(e,t,n,r){for(var a=0,s=0;s<n;s++){var o=F[t>>2],i=F[t+4>>2];t+=8;for(var l=0;l<i;l++)ne.printChar(e,S[o+l]);a+=i}return F[r>>2]=a,0},setTempRet0:function(e){}},ae=(function(){var e={env:re,wasi_snapshot_preview1:re};function t(e,t){var n,r=e.exports;i.asm=r,E((j=i.asm.memory).buffer),R=i.asm.__indirect_function_table,n=i.asm.__wasm_call_ctors,T.unshift(n),function(e){if(L--,i.monitorRunDependencies&&i.monitorRunDependencies(L),0==L&&(null!==G&&(clearInterval(G),G=null),U)){var t=U;U=null,t()}}()}function n(e){t(e.instance)}function r(t){return function(){if(!_&&(g||b)){if("function"==typeof fetch&&!V(O))return fetch(O,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+O+"'";return e.arrayBuffer()})).catch((function(){return K(O)}));if(u)return new Promise((function(e,t){u(O,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return K(O)}))}().then((function(t){return WebAssembly.instantiate(t,e)})).then((function(e){return e})).then(t,(function(e){v("failed to asynchronously prepare wasm: "+e),z(e)}))}if(L++,i.monitorRunDependencies&&i.monitorRunDependencies(L),i.instantiateWasm)try{return i.instantiateWasm(e,t)}catch(e){return v("Module.instantiateWasm callback failed with error: "+e),!1}(_||"function"!=typeof WebAssembly.instantiateStreaming||H(O)||V(O)||"function"!=typeof fetch?r(n):fetch(O,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,e).then(n,(function(e){return v("wasm streaming compile failed: "+e),v("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(a)}(),i.___wasm_call_ctors=function(){return(i.___wasm_call_ctors=i.asm.__wasm_call_ctors).apply(null,arguments)},i._init=function(){return(i._init=i.asm.init).apply(null,arguments)},i._init_with_threads_count=function(){return(i._init_with_threads_count=i.asm.init_with_threads_count).apply(null,arguments)},i._get_threads_count=function(){return(i._get_threads_count=i.asm.get_threads_count).apply(null,arguments)},i._register_tensor=function(){return(i._register_tensor=i.asm.register_tensor).apply(null,arguments)},i._dispose_data=function(){return(i._dispose_data=i.asm.dispose_data).apply(null,arguments)},i._dispose=function(){return(i._dispose=i.asm.dispose).apply(null,arguments)},i._Abs=function(){return(i._Abs=i.asm.Abs).apply(null,arguments)},i._Add=function(){return(i._Add=i.asm.Add).apply(null,arguments)},i._AddN=function(){return(i._AddN=i.asm.AddN).apply(null,arguments)},i._All=function(){return(i._All=i.asm.All).apply(null,arguments)},i._Any=function(){return(i._Any=i.asm.Any).apply(null,arguments)},i._ArgMax=function(){return(i._ArgMax=i.asm.ArgMax).apply(null,arguments)},i._AvgPool=function(){return(i._AvgPool=i.asm.AvgPool).apply(null,arguments)},i._BatchMatMul=function(){return(i._BatchMatMul=i.asm.BatchMatMul).apply(null,arguments)},i._Ceil=function(){return(i._Ceil=i.asm.Ceil).apply(null,arguments)},i._ClipByValue=function(){return(i._ClipByValue=i.asm.ClipByValue).apply(null,arguments)},i._Conv2D=function(){return(i._Conv2D=i.asm.Conv2D).apply(null,arguments)},i._Conv2DBackpropInput=function(){return(i._Conv2DBackpropInput=i.asm.Conv2DBackpropInput).apply(null,arguments)},i._Cos=function(){return(i._Cos=i.asm.Cos).apply(null,arguments)},i._Cosh=function(){return(i._Cosh=i.asm.Cosh).apply(null,arguments)},i._CropAndResize=function(){return(i._CropAndResize=i.asm.CropAndResize).apply(null,arguments)},i._Cumprod=function(){return(i._Cumprod=i.asm.Cumprod).apply(null,arguments)},i._Cumsum=function(){return(i._Cumsum=i.asm.Cumsum).apply(null,arguments)},i._DepthToSpace=function(){return(i._DepthToSpace=i.asm.DepthToSpace).apply(null,arguments)},i._DepthwiseConv2dNative=function(){return(i._DepthwiseConv2dNative=i.asm.DepthwiseConv2dNative).apply(null,arguments)},i._Elu=function(){return(i._Elu=i.asm.Elu).apply(null,arguments)},i._Equal=function(){return(i._Equal=i.asm.Equal).apply(null,arguments)},i._Exp=function(){return(i._Exp=i.asm.Exp).apply(null,arguments)},i._FlipLeftRight=function(){return(i._FlipLeftRight=i.asm.FlipLeftRight).apply(null,arguments)},i._Floor=function(){return(i._Floor=i.asm.Floor).apply(null,arguments)},i._FloorDiv=function(){return(i._FloorDiv=i.asm.FloorDiv).apply(null,arguments)},i._FusedBatchNorm=function(){return(i._FusedBatchNorm=i.asm.FusedBatchNorm).apply(null,arguments)},i._FusedConv2D=function(){return(i._FusedConv2D=i.asm.FusedConv2D).apply(null,arguments)},i._FusedDepthwiseConv2D=function(){return(i._FusedDepthwiseConv2D=i.asm.FusedDepthwiseConv2D).apply(null,arguments)},i._Gather=function(){return(i._Gather=i.asm.Gather).apply(null,arguments)},i._GatherNd=function(){return(i._GatherNd=i.asm.GatherNd).apply(null,arguments)},i._Greater=function(){return(i._Greater=i.asm.Greater).apply(null,arguments)},i._GreaterEqual=function(){return(i._GreaterEqual=i.asm.GreaterEqual).apply(null,arguments)},i._LeakyRelu=function(){return(i._LeakyRelu=i.asm.LeakyRelu).apply(null,arguments)},i._Less=function(){return(i._Less=i.asm.Less).apply(null,arguments)},i._LessEqual=function(){return(i._LessEqual=i.asm.LessEqual).apply(null,arguments)},i._Log=function(){return(i._Log=i.asm.Log).apply(null,arguments)},i._LogicalAnd=function(){return(i._LogicalAnd=i.asm.LogicalAnd).apply(null,arguments)},i._Max=function(){return(i._Max=i.asm.Max).apply(null,arguments)},i._MaxPool=function(){return(i._MaxPool=i.asm.MaxPool).apply(null,arguments)},i._Maximum=function(){return(i._Maximum=i.asm.Maximum).apply(null,arguments)},i._Mean=function(){return(i._Mean=i.asm.Mean).apply(null,arguments)},i._Min=function(){return(i._Min=i.asm.Min).apply(null,arguments)},i._Minimum=function(){return(i._Minimum=i.asm.Minimum).apply(null,arguments)},i._MirrorPad=function(){return(i._MirrorPad=i.asm.MirrorPad).apply(null,arguments)},i._Multiply=function(){return(i._Multiply=i.asm.Multiply).apply(null,arguments)},i._Neg=function(){return(i._Neg=i.asm.Neg).apply(null,arguments)},i._NonMaxSuppressionV3=function(){return(i._NonMaxSuppressionV3=i.asm.NonMaxSuppressionV3).apply(null,arguments)},i._NonMaxSuppressionV4=function(){return(i._NonMaxSuppressionV4=i.asm.NonMaxSuppressionV4).apply(null,arguments)},i._NonMaxSuppressionV5=function(){return(i._NonMaxSuppressionV5=i.asm.NonMaxSuppressionV5).apply(null,arguments)},i._NotEqual=function(){return(i._NotEqual=i.asm.NotEqual).apply(null,arguments)},i._OneHot=function(){return(i._OneHot=i.asm.OneHot).apply(null,arguments)},i._PadV2=function(){return(i._PadV2=i.asm.PadV2).apply(null,arguments)},i._Pow=function(){return(i._Pow=i.asm.Pow).apply(null,arguments)},i._Prelu=function(){return(i._Prelu=i.asm.Prelu).apply(null,arguments)},i._Prod=function(){return(i._Prod=i.asm.Prod).apply(null,arguments)},i._RealDiv=function(){return(i._RealDiv=i.asm.RealDiv).apply(null,arguments)},i._Relu=function(){return(i._Relu=i.asm.Relu).apply(null,arguments)},i._Relu6=function(){return(i._Relu6=i.asm.Relu6).apply(null,arguments)},i._ResizeBilinear=function(){return(i._ResizeBilinear=i.asm.ResizeBilinear).apply(null,arguments)},i._Reverse=function(){return(i._Reverse=i.asm.Reverse).apply(null,arguments)},i._RotateWithOffset=function(){return(i._RotateWithOffset=i.asm.RotateWithOffset).apply(null,arguments)},i._Round=function(){return(i._Round=i.asm.Round).apply(null,arguments)},i._Rsqrt=function(){return(i._Rsqrt=i.asm.Rsqrt).apply(null,arguments)},i._ScatterNd=function(){return(i._ScatterNd=i.asm.ScatterNd).apply(null,arguments)},i._SelectV2=function(){return(i._SelectV2=i.asm.SelectV2).apply(null,arguments)},i._Sigmoid=function(){return(i._Sigmoid=i.asm.Sigmoid).apply(null,arguments)},i._Sin=function(){return(i._Sin=i.asm.Sin).apply(null,arguments)},i._Softmax=function(){return(i._Softmax=i.asm.Softmax).apply(null,arguments)},i._SparseFillEmptyRows=function(){return(i._SparseFillEmptyRows=i.asm.SparseFillEmptyRows).apply(null,arguments)},i._SparseReshape=function(){return(i._SparseReshape=i.asm.SparseReshape).apply(null,arguments)},i._SparseSegmentReduction=function(){return(i._SparseSegmentReduction=i.asm.SparseSegmentReduction).apply(null,arguments)},i._Sqrt=function(){return(i._Sqrt=i.asm.Sqrt).apply(null,arguments)},i._Square=function(){return(i._Square=i.asm.Square).apply(null,arguments)},i._SquaredDifference=function(){return(i._SquaredDifference=i.asm.SquaredDifference).apply(null,arguments)},i._Step=function(){return(i._Step=i.asm.Step).apply(null,arguments)},i._StridedSlice=function(){return(i._StridedSlice=i.asm.StridedSlice).apply(null,arguments)},i._Sub=function(){return(i._Sub=i.asm.Sub).apply(null,arguments)},i._Sum=function(){return(i._Sum=i.asm.Sum).apply(null,arguments)},i._Tan=function(){return(i._Tan=i.asm.Tan).apply(null,arguments)},i._Tanh=function(){return(i._Tanh=i.asm.Tanh).apply(null,arguments)},i._Tile=function(){return(i._Tile=i.asm.Tile).apply(null,arguments)},i._TopK=function(){return(i._TopK=i.asm.TopK).apply(null,arguments)},i._Transform=function(){return(i._Transform=i.asm.Transform).apply(null,arguments)},i._Transpose=function(){return(i._Transpose=i.asm.Transpose).apply(null,arguments)},i.__FusedMatMul=function(){return(i.__FusedMatMul=i.asm._FusedMatMul).apply(null,arguments)},i._malloc=function(){return(i._malloc=i.asm.malloc).apply(null,arguments)},i._free=function(){return(i._free=i.asm.free).apply(null,arguments)},i.___errno_location=function(){return(i.___errno_location=i.asm.__errno_location).apply(null,arguments)},i._emscripten_main_thread_process_queued_calls=function(){return(i._emscripten_main_thread_process_queued_calls=i.asm.emscripten_main_thread_process_queued_calls).apply(null,arguments)},i.stackSave=function(){return(ae=i.stackSave=i.asm.stackSave).apply(null,arguments)}),se=i.stackRestore=function(){return(se=i.stackRestore=i.asm.stackRestore).apply(null,arguments)},oe=i.stackAlloc=function(){return(oe=i.stackAlloc=i.asm.stackAlloc).apply(null,arguments)};function ie(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function le(e){function t(){J||(J=!0,i.calledRun=!0,C||(Y(T),n(i),i.onRuntimeInitialized&&i.onRuntimeInitialized(),function(){if(i.postRun)for("function"==typeof i.postRun&&(i.postRun=[i.postRun]);i.postRun.length;)e=i.postRun.shift(),q.unshift(e);var e;Y(q)}()))}e=e||h,L>0||(function(){if(i.preRun)for("function"==typeof i.preRun&&(i.preRun=[i.preRun]);i.preRun.length;)e=i.preRun.shift(),B.unshift(e);var e;Y(B)}(),L>0||(i.setStatus?(i.setStatus("Running..."),setTimeout((function(){setTimeout((function(){i.setStatus("")}),1),t()}),1)):t()))}if(i.dynCall_iijjiiii=function(){return(i.dynCall_iijjiiii=i.asm.dynCall_iijjiiii).apply(null,arguments)},i.dynCall_jiji=function(){return(i.dynCall_jiji=i.asm.dynCall_jiji).apply(null,arguments)},i.cwrap=function(e,t,n,r){var a=(n=n||[]).every((function(e){return"number"===e}));return"string"!==t&&a&&!r?I(e):function(){return x(e,t,n,arguments)}},U=function e(){J||le(),J||(U=e)},i.run=le,i.preInit)for("function"==typeof i.preInit&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();if(le(),o&&(ee={uncaughtException:s.listeners("uncaughtException").filter((function(e){return!o.uncaughtException.indexOf(e)>-1})),unhandledRejection:s.listeners("unhandledRejection").filter((function(e){return!o.unhandledRejection.indexOf(e)>-1}))}),void 0!==t)te=t;else{if("undefined"==typeof WasmBackendModuleThreadedSimd)throw new Error("Could not find wasm module in post.js");te=WasmBackendModuleThreadedSimd}if(ee){var ue=te._dispose;te._dispose=function(){ue(),ee.uncaughtException.forEach((function(e){s.removeListener("uncaughtException",e)})),ee.unhandledRejection.forEach((function(e){s.removeListener("unhandledRejection",e)}))}}return t.ready});t.exports=o},{process:"5xM3z",path:"34v0S",fs:"34v0S"}],gZXkh:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"version",(()=>a));
/** @license See the LICENSE file. */
const a="3.18.0"},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],htEXj:[function(e,t,n){t.exports="data:application/javascript,%21function%28e%2Ct%2Cn%2Cr%2Co%29%7Bvar%20i%3D%22undefined%22%21%3Dtypeof%20globalThis%3FglobalThis%3A%22undefined%22%21%3Dtypeof%20self%3Fself%3A%22undefined%22%21%3Dtypeof%20window%3Fwindow%3A%22undefined%22%21%3Dtypeof%20global%3Fglobal%3A%7B%7D%2Cs%3D%22function%22%3D%3Dtypeof%20i.parcelRequireaaed%26%26i.parcelRequireaaed%2Ca%3Ds.cache%7C%7C%7B%7D%2Cl%3D%22undefined%22%21%3Dtypeof%20module%26%26%22function%22%3D%3Dtypeof%20module.require%26%26module.require.bind%28module%29%3Bfunction%20c%28t%2Cn%29%7Bif%28%21a%5Bt%5D%29%7Bif%28%21e%5Bt%5D%29%7Bvar%20r%3D%22function%22%3D%3Dtypeof%20i.parcelRequireaaed%26%26i.parcelRequireaaed%3Bif%28%21n%26%26r%29return%20r%28t%2C%210%29%3Bif%28s%29return%20s%28t%2C%210%29%3Bif%28l%26%26%22string%22%3D%3Dtypeof%20t%29return%20l%28t%29%3Bvar%20o%3Dnew%20Error%28%22Cannot%20find%20module%20%27%22%2Bt%2B%22%27%22%29%3Bthrow%20o.code%3D%22MODULE_NOT_FOUND%22%2Co%7Df.resolve%3Dfunction%28n%29%7Bvar%20r%3De%5Bt%5D%5B1%5D%5Bn%5D%3Breturn%20null%21%3Dr%3Fr%3An%7D%2Cf.cache%3D%7B%7D%3Bvar%20u%3Da%5Bt%5D%3Dnew%20c.Module%28t%29%3Be%5Bt%5D%5B0%5D.call%28u.exports%2Cf%2Cu%2Cu.exports%2Cthis%29%7Dreturn%20a%5Bt%5D.exports%3Bfunction%20f%28e%29%7Bvar%20t%3Df.resolve%28e%29%3Breturn%211%3D%3D%3Dt%3F%7B%7D%3Ac%28t%29%7D%7Dc.isParcelRequire%3D%210%2Cc.Module%3Dfunction%28e%29%7Bthis.id%3De%2Cthis.bundle%3Dc%2Cthis.exports%3D%7B%7D%7D%2Cc.modules%3De%2Cc.cache%3Da%2Cc.parent%3Ds%2Cc.register%3Dfunction%28t%2Cn%29%7Be%5Bt%5D%3D%5Bfunction%28e%2Ct%29%7Bt.exports%3Dn%7D%2C%7B%7D%5D%7D%2CObject.defineProperty%28c%2C%22root%22%2C%7Bget%3Afunction%28%29%7Breturn%20i.parcelRequireaaed%7D%7D%29%2Ci.parcelRequireaaed%3Dc%3Bfor%28var%20u%3D0%3Bu%3Ct.length%3Bu%2B%2B%29c%28t%5Bu%5D%29%3Bvar%20f%3Dc%28n%29%3B%22object%22%3D%3Dtypeof%20exports%26%26%22undefined%22%21%3Dtypeof%20module%3Fmodule.exports%3Df%3A%22function%22%3D%3Dtypeof%20define%26%26define.amd%26%26define%28%28function%28%29%7Breturn%20f%7D%29%29%7D%28%7B%223u4hT%22%3A%5Bfunction%28e%2Ct%2Cn%29%7Bvar%20r%3De%28%22.%2Fface-model%22%29%3Bself.onmessage%3De%3D%3E%7Bconst%20t%3Dr.enhancePrediction%28e.data%29%3BpostMessage%28t%29%7D%7D%2C%7B%22.%2Fface-model%22%3A%2203PpB%22%7D%5D%2C%2203PpB%22%3A%5Bfunction%28e%2Ct%2Cn%29%7Bvar%20r%3De%28%22%40parcel%2Ftransformer-js%2Fsrc%2Fesmodule-helpers.js%22%29%3Br.defineInteropFlag%28n%29%2Cr.export%28n%2C%22enhancePrediction%22%2C%28%28%29%3D%3Eu%29%29%3Bvar%20o%3De%28%22..%2Fmaths%2Fmaths%22%29%3Bconst%7BPI%3Ai%2Cabs%3As%2Csqrt%3Aa%2Catan2%3Al%2Ctan%3Ac%7D%3DMath%2Cu%3D%28e%2Ct%2Cn%3D%210%29%3D%3E%7Bconst%7BboundingBox%3Ar%2Cmesh%3Aa%2CscaledMesh%3Ac%2Cannotations%3Au%7D%3De%2C%7BnoseTip%3Af%2CnoseBottom%3Ad%2CnoseRightCorner%3Ap%7D%3Du%2Ch%3D%28c%5B168%5D%2Cc%5B10%5D%2Cc%5B109%5D%29%2Cm%3Dc%5B400%5D%2Cy%3Do.distanceBetween2Points%28m%2Ch%29%2C%7BleftEyeIris%3Ag%2CleftEyeLower0%3AP%2CleftEyeLower1%3Aw%2CleftEyeUpper1%3Ax%2CrightEyeIris%3AE%2CrightEyeLower0%3Ab%2CrightEyeLower1%3AI%2CrightEyeUpper0%3Av%2CrightEyeUpper1%3Aj%2CmidwayBetweenEyes%3AB%7D%3Du%2CL%3Dg%5B0%5D%2CM%3DE%5B0%5D%2Cq%3DB%5B0%5D%2CR%3Dq%5B0%5D%2C_%3D%28q%5B1%5D%2Co.distanceBetween2Points%28L%2CM%29%29%2CO%3DL%5B2%5D%3CM%5B2%5D%2CA%3D2%2a%28q%5B0%5D-L%5B0%5D%29%2F_-1%2CT%3Do.distanceBetween3Points%28x%5B3%5D%2Cj%5B3%5D%29%2F80%2CD%3Do.distanceBetween3Points%28w%5B4%5D%2Cx%5B4%5D%29%2CF%3Do.distanceBetween3Points%28I%5B4%5D%2Cj%5B4%5D%29%2CU%3D%28g%5B4%5D%5B1%5D%2Cg%5B2%5D%5B1%5D%2CE%5B4%5D%5B1%5D%2CE%5B2%5D%5B1%5D%2CP%5B0%5D%5B0%5D%29%2Ck%3Db%5B0%5D%5B0%5D%2CC%3DP%5B0%5D%5B1%5D%2CH%3Db%5B0%5D%5B1%5D%3Be.lookingRight%3Dn%3F%21O%3AO%2Ce.eyeDirection%3D-1%2aA%2Ce.eyeDistance%3D_%2Ce.leftEye%3DD%2FT%2Ce.leftEyeClosed%3De.leftEye%3C20.2%2Ce.rightEye%3DF%2FT%2Ce.rightEyeClosed%3De.rightEye%3C20.2%3Bconst%20N%3D-1%2a%28R-U%29%2CS%3DR-k%2CW%3Dn%3F-1%2a%28l%28N%2CS%29-2%29%3A-1%2a%28l%28N%2CS%29-.75%29%2Cz%3Dl%28h%5B2%5D%2Cf%5B0%5D%5B2%5D%29%2CG%3D8%2ao.twist%28z%2Fi%2C-.15%29%2CJ%3DU-k%2CK%3DC-H%2CQ%3Dn%3F-1%2a%28l%28J%2CK%29%2Bo.HALF_PI%29%3Al%28J%2CK%29-o.HALF_PI%3Be.pitch%3DG%2Ce.roll%3DQ%2Ce.yaw%3DW%3Bconst%7BlipsUpperInner%3AV%2ClipsLowerInner%3AX%7D%3Du%2CY%3DV.length%2CZ%3DV%5B0%5D%2C%24%3DX%5B0%5D%2Cee%3DV%5B5%5D%2Cte%3DX%5B5%5D%2Cne%3DV%5BY-1%5D%2Cre%3DX%5BY-1%5D%2Coe%3Do.distanceBetween2Points%28te%2Cee%29%2Cie%3Do.distanceBetween2Points%28re%2C%24%29%3Be.headHeight%3Dy%2Ce.mouthRange%3Doe%2Ce.mouthRatio%3Doe%2Fy%2Ce.mouthWidth%3Die%2Ce.mouthOpen%3Doe%2F%28.25%2ay%29%3Bconst%20se%3Ds%28o.determineAngle%28Z%2Cee%29%29%2Fi%2Cae%3Ds%28o.determineAngle%28ee%2Cne%29%29%2Fi%3Breturn%20e.happiness%3D10%2a%28.5%2a%28se%2Bae%29-.9%29%2Ce.leftSmirk%3D1e5%2a%28se-1%29%2Ce.rightSmirk%3D1e5%2a%28ae-1%29%2Ce.time%3Dt%2Ce%7D%7D%2C%7B%22..%2Fmaths%2Fmaths%22%3A%22bExI4%22%2C%22%40parcel%2Ftransformer-js%2Fsrc%2Fesmodule-helpers.js%22%3A%22f4L6P%22%7D%5D%2CbExI4%3A%5Bfunction%28e%2Ct%2Cn%29%7Bvar%20r%3De%28%22%40parcel%2Ftransformer-js%2Fsrc%2Fesmodule-helpers.js%22%29%3Br.defineInteropFlag%28n%29%2Cr.export%28n%2C%22TAU%22%2C%28%28%29%3D%3Eo%29%29%2Cr.export%28n%2C%22HALF_PI%22%2C%28%28%29%3D%3Ei%29%29%2Cr.export%28n%2C%22rescale%22%2C%28%28%29%3D%3Eu%29%29%2Cr.export%28n%2C%22determineAngle%22%2C%28%28%29%3D%3Ef%29%29%2Cr.export%28n%2C%22distanceBetween2Points%22%2C%28%28%29%3D%3Ed%29%29%2Cr.export%28n%2C%22distanceBetween3Points%22%2C%28%28%29%3D%3Ep%29%29%2Cr.export%28n%2C%22distance3D%22%2C%28%28%29%3D%3Eh%29%29%2Cr.export%28n%2C%22distance2D%22%2C%28%28%29%3D%3Em%29%29%2Cr.export%28n%2C%22lerp%22%2C%28%28%29%3D%3Ey%29%29%2Cr.export%28n%2C%22clamp%22%2C%28%28%29%3D%3Eg%29%29%2Cr.export%28n%2C%22twist%22%2C%28%28%29%3D%3EP%29%29%3Bconst%20o%3D2%2aMath.PI%2Ci%3D.5%2aMath.PI%2C%7BPI%3As%2Csqrt%3Aa%2Catan2%3Al%2Ctan%3Ac%7D%3DMath%2Cu%3D%28e%2Ct%3D1%29%3D%3E%7Bconst%20n%3D1%2F%28t-e%29%3Breturn%20t%3D%3En%2a%28t-e%29%7D%2Cf%3D%28e%2Ct%29%3D%3E%7Bconst%20n%3De%5B1%5D-t%5B1%5D%2Cr%3Dt%5B0%5D-e%5B0%5D%3Breturn%20l%28n%2Cr%29%7D%2Cd%3D%28e%2Ct%29%3D%3Ea%28%28e%5B0%5D-t%5B0%5D%29%2a%2a2%2B%28e%5B1%5D-t%5B1%5D%29%2a%2a2%29%2Cp%3D%28e%2Ct%29%3D%3Ea%28%28e%5B0%5D-t%5B0%5D%29%2a%2a2%2B%28e%5B1%5D-t%5B1%5D%29%2a%2a2%2B%28e%5B2%5D-t%5B2%5D%29%2a%2a2%29%2Ch%3D%28e%2Ct%2Cn%2Cr%2Co%2Ci%29%3D%3Ea%28%28e-t%29%2a%2a2%2B%28n-r%29%2a%2a2%2B%28o-i%29%2a%2a2%29%2Cm%3D%28e%2Ct%2Cn%2Cr%29%3D%3Ea%28%28e-t%29%2a%2a2%2B%28n-r%29%2a%2a2%29%2Cy%3D%28e%2Ct%2Cn%29%3D%3E%281-n%29%2ae%2Bn%2at%2Cg%3D%28e%2Ct%2Cn%29%3D%3Ee%3En%3Fn%3Ae%3Ct%3Ft%3Ae%2CP%3D%28e%2Ct%3D0%29%3D%3Eg%28%28e%3De%3C0%3F-1%2a%28e%2B1%29%3A1-e%29%2Bt%2C-1%2C1%29%7D%2C%7B%22%40parcel%2Ftransformer-js%2Fsrc%2Fesmodule-helpers.js%22%3A%22f4L6P%22%7D%5D%2Cf4L6P%3A%5Bfunction%28e%2Ct%2Cn%29%7Bn.interopDefault%3Dfunction%28e%29%7Breturn%20e%26%26e.__esModule%3Fe%3A%7Bdefault%3Ae%7D%7D%2Cn.defineInteropFlag%3Dfunction%28e%29%7BObject.defineProperty%28e%2C%22__esModule%22%2C%7Bvalue%3A%210%7D%29%7D%2Cn.exportAll%3Dfunction%28e%2Ct%29%7Breturn%20Object.keys%28e%29.forEach%28%28function%28n%29%7B%22default%22%3D%3D%3Dn%7C%7C%22__esModule%22%3D%3D%3Dn%7C%7Ct.hasOwnProperty%28n%29%7C%7CObject.defineProperty%28t%2Cn%2C%7Benumerable%3A%210%2Cget%3Afunction%28%29%7Breturn%20e%5Bn%5D%7D%7D%29%7D%29%29%2Ct%7D%2Cn.export%3Dfunction%28e%2Ct%2Cn%29%7BObject.defineProperty%28e%2Ct%2C%7Benumerable%3A%210%2Cget%3An%7D%29%7D%7D%2C%7B%7D%5D%7D%2C%5B%223u4hT%22%5D%2C%223u4hT%22%29%3B"},{}]},[]);