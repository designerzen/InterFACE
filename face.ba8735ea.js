var vs=(n,R)=>()=>(R||n((R={exports:{}}).exports,R),R.exports);var _s=vs((Ea,sr)=>{(function(n,R,i,o,s){var l=typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:typeof global!="undefined"?global:{},h=typeof l[o]=="function"&&l[o],I=h.cache||{},S=typeof sr!="undefined"&&typeof sr.require=="function"&&sr.require.bind(sr);function e(d,_){if(!I[d]){if(!n[d]){var y=typeof l[o]=="function"&&l[o];if(!_&&y)return y(d,!0);if(h)return h(d,!0);if(S&&typeof d=="string")return S(d);var j=new Error("Cannot find module '"+d+"'");throw j.code="MODULE_NOT_FOUND",j}b.resolve=v,b.cache={};var r=I[d]=new e.Module(d);n[d][0].call(r.exports,b,r,r.exports,this)}return I[d].exports;function b(C){var M=b.resolve(C);return M===!1?{}:e(M)}function v(C){var M=n[d][1][C];return M??C}}function w(d){this.id=d,this.bundle=e,this.exports={}}e.isParcelRequire=!0,e.Module=w,e.modules=n,e.cache=I,e.parent=h,e.register=function(d,_){n[d]=[function(y,j){j.exports=_},{}]},Object.defineProperty(e,"root",{get:function(){return l[o]}}),l[o]=e;for(var m=0;m<R.length;m++)e(R[m]);if(i){var f=e(i);typeof Ea=="object"&&typeof sr!="undefined"?sr.exports=f:typeof define=="function"&&define.amd?define(function(){return f}):s&&(this[s]=f)}})({gi7kh:[function(n,R,i){var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"loadFaceModel",()=>V);var s=n("@tensorflow/tfjs"),l=n("@tensorflow/tfjs-core"),h=n("@tensorflow/tfjs-backend-webgl"),I=n("@tensorflow/tfjs-backend-wasm"),S=n("@tensorflow/tfjs-backend-wasm/dist/index.js"),e=n("url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm.wasm"),w=o.interopDefault(e),m=n("url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-simd.wasm"),f=o.interopDefault(m),d=n("url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.wasm"),_=o.interopDefault(d),y=n("@mediapipe/face_mesh"),j=n("@tensorflow-models/face-detection"),r=n("./face-model-calculations"),b=n("../timing/timing");const v=!0,C=!0;let M;const P=H=>new Promise((K,E)=>{M||(M=new Worker(n("a02db1813e52cd3c"))),M.onmessage=L=>K(L.data),M.postMessage(H)}),F=async(H,K)=>{const E={flipHorizontal:!1};return(await K.estimateFaces(H,E)).length},U=async(H,K)=>{try{const E=(0,b.now)(),L={input:H,returnTensors:!1,flipHorizontal:C,predictIrises:!0},re=await K.estimateFaces(H,L);if(re.length>0)for(let ne=0,oe=re.length;ne<oe;ne++){let he;v?he=await P(re[ne]):he=(0,r.enhanceFaceModelPrediction)(re[ne],E),re[ne]=he}return re}catch(E){return console.error("Model failure!",E,{inputElement:H,detector:K}),null}},T=H=>H.solutionPath||`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${y.VERSION}`,V=async(H,K,E)=>{const L=.5,re=.3,ne=2;let oe=0;E&&E(L+re*(oe++/ne),"Loading Brains"),I.setWasmPaths({"tfjs-backend-wasm.wasm":w.default,"tfjs-backend-wasm-simd.wasm":f.default,"tfjs-backend-wasm-threaded-simd.wasm":_.default});let he=!1;const be=K.backEnds||[];be.forEach(async Z=>{he=await s.setBackend(Z)}),await s.ready(),E&&E(L+re*(oe++/ne));const ve=K.maxFaces,ke=j.SupportedModels.MediaPipeFaceMesh,We=T(K);console.error("Loading Face Model",{options:K,backEnds:be,solutionPath:We});const X=await(()=>{switch(K.runtime){case"mediapipe":return(0,j.createDetector)(ke,{...K,solutionPath:We});case"tfjs":return(0,j.createDetector)(ke,{...K})}})(ke,K);E&&E(L+re*(oe++/ne),"Loaded Detector");const q=async(Z,te,ee=null)=>{if(ee?ee():!0){const se=await U(H,X);if(!se){console.warn("face>tfjs",{predictions:se,inputElement:H,model:ke});return}const me=Math.min(ve,se.length);te(se.length?se.slice(0,me):[])}Z&&requestAnimationFrame(()=>q(Z,te,ee))};return q}},{"@tensorflow/tfjs":"foAaF","@tensorflow/tfjs-core":"fqGP4","@tensorflow/tfjs-backend-webgl":"evSKx","@tensorflow/tfjs-backend-wasm":"38Jex","@tensorflow/tfjs-backend-wasm/dist/index.js":"38Jex","url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm.wasm":"8W571","url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-simd.wasm":"i8iSb","url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.wasm":"8vNwt","@mediapipe/face_mesh":"78EPD","@tensorflow-models/face-detection":"fX6lB","./face-model-calculations":"grwI9","../timing/timing":"adRuD",a02db1813e52cd3c:"bhPSB","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"38Jex":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i);var s=n("./register_all_kernels"),l=n("./base");o.exportAll(l,i)},{"./register_all_kernels":"5eNmj","./base":"24GdS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5eNmj":[function(n,R,i){/**
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
 */var o=n("@tensorflow/tfjs-core"),s=n("./kernels/_FusedMatMul"),l=n("./kernels/Abs"),h=n("./kernels/Acos"),I=n("./kernels/Acosh"),S=n("./kernels/Add"),e=n("./kernels/AddN"),w=n("./kernels/All"),m=n("./kernels/Any"),f=n("./kernels/ArgMax"),d=n("./kernels/ArgMin"),_=n("./kernels/Asin"),y=n("./kernels/Asinh"),j=n("./kernels/Atan"),r=n("./kernels/Atan2"),b=n("./kernels/Atanh"),v=n("./kernels/AvgPool"),C=n("./kernels/AvgPool3D"),M=n("./kernels/AvgPool3DGrad"),P=n("./kernels/AvgPoolGrad"),F=n("./kernels/BatchMatMul"),U=n("./kernels/BatchToSpaceND"),T=n("./kernels/Bincount"),V=n("./kernels/BitwiseAnd"),H=n("./kernels/BroadcastArgs"),K=n("./kernels/Cast"),E=n("./kernels/Ceil"),L=n("./kernels/ClipByValue"),re=n("./kernels/Concat"),ne=n("./kernels/Conv2D"),oe=n("./kernels/Conv2DBackpropInput"),he=n("./kernels/Conv3D"),be=n("./kernels/Conv3DBackpropFilterV2"),ve=n("./kernels/Conv3DBackpropInputV2"),ke=n("./kernels/Cos"),We=n("./kernels/Cosh"),rt=n("./kernels/CropAndResize"),X=n("./kernels/Cumprod"),q=n("./kernels/Cumsum"),Z=n("./kernels/DenseBincount"),te=n("./kernels/DepthToSpace"),ee=n("./kernels/DepthwiseConv2dNative"),pe=n("./kernels/Diag"),se=n("./kernels/Dilation2D"),me=n("./kernels/Dilation2DBackpropFilter"),ue=n("./kernels/Dilation2DBackpropInput"),le=n("./kernels/Elu"),ae=n("./kernels/EluGrad"),ge=n("./kernels/Equal"),je=n("./kernels/Erf"),ye=n("./kernels/Exp"),Se=n("./kernels/ExpandDims"),Oe=n("./kernels/Expm1"),it=n("./kernels/Fill"),ut=n("./kernels/FlipLeftRight"),Fe=n("./kernels/Floor"),Ue=n("./kernels/FloorDiv"),gt=n("./kernels/FusedBatchNorm"),Ke=n("./kernels/FusedConv2D"),wt=n("./kernels/FusedDepthwiseConv2D"),kt=n("./kernels/GatherNd"),Dt=n("./kernels/GatherV2"),Et=n("./kernels/Greater"),Ae=n("./kernels/GreaterEqual"),lt=n("./kernels/Identity"),mt=n("./kernels/IsFinite"),At=n("./kernels/IsInf"),un=n("./kernels/IsNan"),Ot=n("./kernels/LeakyRelu"),nn=n("./kernels/Less"),yn=n("./kernels/LessEqual"),Pt=n("./kernels/LinSpace"),jt=n("./kernels/Log"),vt=n("./kernels/Log1p"),cn=n("./kernels/LogicalAnd"),pn=n("./kernels/LogicalNot"),ht=n("./kernels/LogicalOr"),bn=n("./kernels/LogicalXor"),zt=n("./kernels/LRN"),yt=n("./kernels/LRNGrad"),et=n("./kernels/Max"),Ve=n("./kernels/Maximum"),Wt=n("./kernels/MaxPool"),Ut=n("./kernels/MaxPool3D"),Nn=n("./kernels/MaxPool3DGrad"),wn=n("./kernels/MaxPoolGrad"),Ht=n("./kernels/MaxPoolWithArgmax"),Mt=n("./kernels/Mean"),Kt=n("./kernels/Min"),$t=n("./kernels/Minimum"),Bn=n("./kernels/MirrorPad"),rr=n("./kernels/Multinomial"),Rt=n("./kernels/Mod"),Jt=n("./kernels/Multiply"),rn=n("./kernels/Neg"),an=n("./kernels/NonMaxSuppressionV3"),Dn=n("./kernels/NonMaxSuppressionV4"),tn=n("./kernels/NonMaxSuppressionV5"),fn=n("./kernels/NotEqual"),kn=n("./kernels/OneHot"),jn=n("./kernels/OnesLike"),Qn=n("./kernels/Pack"),In=n("./kernels/PadV2"),Zt=n("./kernels/Pow"),De=n("./kernels/Prelu"),Cn=n("./kernels/Prod"),dn=n("./kernels/Range"),Pn=n("./kernels/RealDiv"),mn=n("./kernels/Reciprocal"),qn=n("./kernels/Relu"),Gn=n("./kernels/Relu6"),Rn=n("./kernels/Reshape"),Tn=n("./kernels/ResizeBilinear"),Hn=n("./kernels/ResizeBilinearGrad"),Ln=n("./kernels/ResizeNearestNeighbor"),Wn=n("./kernels/ResizeNearestNeighborGrad"),er=n("./kernels/Reverse"),Un=n("./kernels/RotateWithOffset"),Vn=n("./kernels/Round"),Sn=n("./kernels/Rsqrt"),hn=n("./kernels/ScatterNd"),zn=n("./kernels/SearchSorted"),En=n("./kernels/Select"),Xt=n("./kernels/Selu"),Vt=n("./kernels/Sigmoid"),On=n("./kernels/Sign"),Kn=n("./kernels/Sin"),Yn=n("./kernels/Sinh"),xn=n("./kernels/Slice"),Lt=n("./kernels/Softmax"),Xn=n("./kernels/Softplus"),sn=n("./kernels/SpaceToBatchND"),Qt=n("./kernels/SparseFillEmptyRows"),on=n("./kernels/SparseReshape"),$n=n("./kernels/SparseSegmentMean"),Jn=n("./kernels/SparseSegmentSum"),gn=n("./kernels/SparseToDense"),Zn=n("./kernels/SplitV"),An=n("./kernels/Sqrt"),a=n("./kernels/Square"),u=n("./kernels/SquaredDifference"),p=n("./kernels/Step"),x=n("./kernels/StridedSlice"),B=n("./kernels/StringNGrams"),J=n("./kernels/StringSplit"),W=n("./kernels/StringToHashBucketFast"),Q=n("./kernels/Sub"),ce=n("./kernels/Sum"),_e=n("./kernels/Tan"),Re=n("./kernels/Tanh"),at=n("./kernels/TensorScatterUpdate"),ze=n("./kernels/Tile"),Ee=n("./kernels/TopK"),Ie=n("./kernels/Transform"),Pe=n("./kernels/Transpose"),He=n("./kernels/Unique"),Ze=n("./kernels/Unpack"),Ct=n("./kernels/ZerosLike");const pt=[s._fusedMatMulConfig,l.absConfig,h.acosConfig,I.acoshConfig,S.addConfig,e.addNConfig,w.allConfig,m.anyConfig,f.argMaxConfig,d.argMinConfig,_.asinConfig,y.asinhConfig,j.atanConfig,r.atan2Config,b.atanhConfig,v.avgPoolConfig,P.avgPoolGradConfig,C.avgPool3DConfig,M.avgPool3DGradConfig,F.batchMatMulConfig,U.batchToSpaceNDConfig,T.bincountConfig,V.bitwiseAndConfig,H.broadcastArgsConfig,K.castConfig,E.ceilConfig,L.clipByValueConfig,re.concatConfig,ne.conv2DConfig,oe.conv2DBackpropInputConfig,he.conv3DConfig,be.conv3DBackpropFilterV2Config,ve.conv3DBackpropInputV2Config,ke.cosConfig,We.coshConfig,rt.cropAndResizeConfig,X.cumprodConfig,q.cumsumConfig,Z.denseBincountConfig,te.depthToSpaceConfig,ee.depthwiseConv2dNativeConfig,pe.diagConfig,se.dilation2DConfig,me.dilation2DBackpropFilterConfig,ue.dilation2DBackpropInputConfig,le.eluConfig,ae.eluGradConfig,ge.equalConfig,je.erfConfig,ye.expConfig,Se.expandDimsConfig,Oe.expm1Config,it.fillConfig,ut.flipLeftRightConfig,Fe.floorConfig,Ue.floorDivConfig,gt.fusedBatchNormConfig,Ke.fusedConv2DConfig,wt.fusedDepthwiseConv2DConfig,kt.gatherNdConfig,Dt.gatherV2Config,Et.greaterConfig,Ae.greaterEqualConfig,lt.identityConfig,mt.isFiniteConfig,At.isInfConfig,un.isNaNConfig,Ot.leakyReluConfig,nn.lessConfig,yn.lessEqualConfig,Pt.linSpaceConfig,vt.log1pConfig,jt.logConfig,cn.logicalAndConfig,pn.logicalNotConfig,ht.logicalOrConfig,bn.logicalXorConfig,zt.lrnConfig,yt.lrnGradConfig,et.maxConfig,Ve.maximumConfig,Wt.maxPoolConfig,Ut.maxPool3DConfig,Nn.maxPool3DGradConfig,wn.maxPoolGradConfig,Ht.maxPoolWithArgmaxConfig,Mt.meanConfig,Kt.minConfig,$t.minimumConfig,Bn.mirrorPadConfig,rr.multinomialConfig,Rt.modConfig,Jt.multiplyConfig,rn.negConfig,an.nonMaxSuppressionV3Config,Dn.nonMaxSuppressionV4Config,tn.nonMaxSuppressionV5Config,fn.notEqualConfig,kn.oneHotConfig,jn.onesLikeConfig,Qn.packConfig,In.padV2Config,Zt.powConfig,De.preluConfig,Cn.prodConfig,dn.rangeConfig,Pn.realDivConfig,mn.reciprocalConfig,qn.reluConfig,Gn.relu6Config,Rn.reshapeConfig,Tn.resizeBilinearConfig,Hn.resizeBilinearGradConfig,Ln.resizeNearestNeighborConfig,Wn.resizeNearestNeighborGradConfig,er.reverseConfig,Un.rotateWithOffsetConfig,Vn.roundConfig,Sn.rsqrtConfig,hn.scatterNdConfig,zn.searchSortedConfig,En.selectConfig,Xt.seluConfig,Vt.sigmoidConfig,On.signConfig,Kn.sinConfig,Yn.sinhConfig,xn.sliceConfig,Lt.softmaxConfig,Xn.softplusConfig,sn.spaceToBatchNDConfig,Qt.sparseFillEmptyRowsConfig,on.sparseReshapeConfig,$n.sparseSegmentMeanConfig,Jn.sparseSegmentSumConfig,gn.sparseToDenseConfig,Zn.splitVConfig,An.sqrtConfig,a.squareConfig,u.squaredDifferenceConfig,p.stepConfig,x.stridedSliceConfig,B.stringNGramsConfig,J.stringSplitConfig,W.stringToHashBucketFastConfig,Q.subConfig,ce.sumConfig,_e.tanConfig,Re.tanhConfig,at.tensorScatterUpdateConfig,ze.tileConfig,Ee.topKConfig,Ie.transformConfig,Pe.transposeConfig,He.uniqueConfig,Ze.unpackConfig,Ct.zerosLikeConfig];for(const Ft of pt)(0,o.registerKernel)(Ft)},{"@tensorflow/tfjs-core":"fqGP4","./kernels/_FusedMatMul":"k59RG","./kernels/Abs":"2GdDk","./kernels/Acos":"4wga7","./kernels/Acosh":"3jQcj","./kernels/Add":"babIa","./kernels/AddN":"1zSOX","./kernels/All":"8uwjX","./kernels/Any":"5tCdr","./kernels/ArgMax":"hniZ5","./kernels/ArgMin":"fwP75","./kernels/Asin":"d0C9F","./kernels/Asinh":"bIa3m","./kernels/Atan":"fZUXt","./kernels/Atan2":"kfAHh","./kernels/Atanh":"i1uKA","./kernels/AvgPool":"6v80u","./kernels/AvgPool3D":"eR7nL","./kernels/AvgPool3DGrad":"8bldZ","./kernels/AvgPoolGrad":"kEBm7","./kernels/BatchMatMul":"ghCmV","./kernels/BatchToSpaceND":"4eu0q","./kernels/Bincount":"jqmJj","./kernels/BitwiseAnd":"c7xm1","./kernels/BroadcastArgs":"4QfkB","./kernels/Cast":"bGPlI","./kernels/Ceil":"dx9ZV","./kernels/ClipByValue":"e8U5N","./kernels/Concat":"gg3oU","./kernels/Conv2D":"3weVS","./kernels/Conv2DBackpropInput":"cNlL5","./kernels/Conv3D":"6dmzH","./kernels/Conv3DBackpropFilterV2":"buiqm","./kernels/Conv3DBackpropInputV2":"2vkNx","./kernels/Cos":"condh","./kernels/Cosh":"e7YUt","./kernels/CropAndResize":"7voe3","./kernels/Cumprod":"3DVNe","./kernels/Cumsum":"3PHjZ","./kernels/DenseBincount":"9A4DJ","./kernels/DepthToSpace":"eP6yj","./kernels/DepthwiseConv2dNative":"5qoZn","./kernels/Diag":"iZETk","./kernels/Dilation2D":"C1MuG","./kernels/Dilation2DBackpropFilter":"deAYm","./kernels/Dilation2DBackpropInput":"2Wfxa","./kernels/Elu":"hTLQ9","./kernels/EluGrad":"oj4DQ","./kernels/Equal":"6NRgP","./kernels/Erf":"g2W0V","./kernels/Exp":"9puem","./kernels/ExpandDims":"2OTFi","./kernels/Expm1":"lVQHI","./kernels/Fill":"geiWD","./kernels/FlipLeftRight":"d7JTg","./kernels/Floor":"29SUM","./kernels/FloorDiv":"bJ7qU","./kernels/FusedBatchNorm":"i7ayZ","./kernels/FusedConv2D":"bXSgI","./kernels/FusedDepthwiseConv2D":"fpjh5","./kernels/GatherNd":"9McxH","./kernels/GatherV2":"e6daa","./kernels/Greater":"6JnB0","./kernels/GreaterEqual":"6T8x5","./kernels/Identity":"j2v3m","./kernels/IsFinite":"eQQpo","./kernels/IsInf":"7HgCK","./kernels/IsNan":"1dy0x","./kernels/LeakyRelu":"jyGti","./kernels/Less":"6302T","./kernels/LessEqual":"bgZoQ","./kernels/LinSpace":"kXZYO","./kernels/Log":"h9Yb3","./kernels/Log1p":"hI0xM","./kernels/LogicalAnd":"7S6JD","./kernels/LogicalNot":"gQmpO","./kernels/LogicalOr":"aqmTw","./kernels/LogicalXor":"5o6Uq","./kernels/LRN":"2rXNf","./kernels/LRNGrad":"blTZv","./kernels/Max":"4RGKM","./kernels/Maximum":"cL64O","./kernels/MaxPool":"ImEix","./kernels/MaxPool3D":"lkZwn","./kernels/MaxPool3DGrad":"cLYKY","./kernels/MaxPoolGrad":"b0bF5","./kernels/MaxPoolWithArgmax":"810JB","./kernels/Mean":"8hVA0","./kernels/Min":"hmNa0","./kernels/Minimum":"cN515","./kernels/MirrorPad":"g4N8P","./kernels/Multinomial":"gXdfb","./kernels/Mod":"3y4Jw","./kernels/Multiply":"98fwB","./kernels/Neg":"atIMr","./kernels/NonMaxSuppressionV3":"fMb6L","./kernels/NonMaxSuppressionV4":"6gLQs","./kernels/NonMaxSuppressionV5":"kWIaw","./kernels/NotEqual":"gE58W","./kernels/OneHot":"2auC5","./kernels/OnesLike":"2C4KL","./kernels/Pack":"anZaM","./kernels/PadV2":"jxDD1","./kernels/Pow":"lSU1e","./kernels/Prelu":"17lcP","./kernels/Prod":"cce5D","./kernels/Range":"j2Vlu","./kernels/RealDiv":"Br6Ma","./kernels/Reciprocal":"ckWYc","./kernels/Relu":"YAD8N","./kernels/Relu6":"ecfwq","./kernels/Reshape":"carA0","./kernels/ResizeBilinear":"hqU2G","./kernels/ResizeBilinearGrad":"6yngM","./kernels/ResizeNearestNeighbor":"3xd1y","./kernels/ResizeNearestNeighborGrad":"dEWoe","./kernels/Reverse":"h8p0f","./kernels/RotateWithOffset":"9Dmog","./kernels/Round":"49MFW","./kernels/Rsqrt":"7tjno","./kernels/ScatterNd":"1FCGT","./kernels/SearchSorted":"kWH8o","./kernels/Select":"jCsx6","./kernels/Selu":"jgpnu","./kernels/Sigmoid":"4QdGq","./kernels/Sign":"8oasS","./kernels/Sin":"hJMTy","./kernels/Sinh":"fpizJ","./kernels/Slice":"fC7Xk","./kernels/Softmax":"3nqRh","./kernels/Softplus":"dHbD1","./kernels/SpaceToBatchND":"5gV7j","./kernels/SparseFillEmptyRows":"jrzyQ","./kernels/SparseReshape":"59PNO","./kernels/SparseSegmentMean":"eDnJR","./kernels/SparseSegmentSum":"jwNwx","./kernels/SparseToDense":"7nC5M","./kernels/SplitV":"kpanS","./kernels/Sqrt":"7Bfb4","./kernels/Square":"4eqUw","./kernels/SquaredDifference":"3xMkV","./kernels/Step":"b4iTq","./kernels/StridedSlice":"2nai6","./kernels/StringNGrams":"9jOel","./kernels/StringSplit":"8DZyo","./kernels/StringToHashBucketFast":"62PSK","./kernels/Sub":"auNTX","./kernels/Sum":"itfOR","./kernels/Tan":"2BnQa","./kernels/Tanh":"92eBX","./kernels/TensorScatterUpdate":"lsnnq","./kernels/Tile":"9dHgQ","./kernels/TopK":"3N5sa","./kernels/Transform":"73Gmi","./kernels/Transpose":"af8LA","./kernels/Unique":"b1RSn","./kernels/Unpack":"eRN3n","./kernels/ZerosLike":"e67PN"}],k59RG:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"_fusedMatMulConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s._FusedMatMul,null,["number","array","number","number","array","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{a:_,b:y,bias:j,preluActivationWeights:r}=m;if(_.dtype!=="float32"||y.dtype!=="float32")throw new Error("_FusedMatMul for non non-float32 tensors not yet supported.");const{transposeA:b,transposeB:v,activation:C,leakyreluAlpha:M}=d,P=f.dataIdMap.get(_.dataId).id,F=f.dataIdMap.get(y.dataId).id;let U=0;if(j!=null){const he=f.dataIdMap.get(j.dataId);if(he.shape.length!==1)throw new Error(`_FusedMatMul only supports rank-1 bias but got rank ${he.shape.length}.`);U=he.id}const T=r==null?0:f.dataIdMap.get(r.dataId).id,V=l.FusableActivation[C];if(V==null)throw new Error(`${C} activation not yet supported for FusedConv2D in the wasm backend.`);const H=b?_.shape[2]:_.shape[1],K=v?y.shape[1]:y.shape[2],E=s.broadcast_util.assertAndGetBroadcastShape(_.shape.slice(0,-2),y.shape.slice(0,-2)),L=f.makeOutput([...E,H,K],_.dtype),re=f.dataIdMap.get(L.dataId).id,ne=new Uint8Array(new Int32Array(_.shape).buffer),oe=new Uint8Array(new Int32Array(y.shape).buffer);return h(P,ne,_.shape.length,F,oe,y.shape.length,b,v,V,U,T,M||0,re),L}const e={kernelName:s._FusedMatMul,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3tWYo":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"CppDType",()=>s),o.export(i,"FusableActivation",()=>l);var s;(function(h){h[h.float32=0]="float32",h[h.int32=1]="int32",h[h.bool=2]="bool",h[h.string=3]="string",h[h.complex64=4]="complex64"})(s||(s={}));var l;(function(h){h[h.linear=0]="linear",h[h.relu=1]="relu",h[h.relu6=2]="relu6",h[h.prelu=3]="prelu",h[h.leakyrelu=4]="leakyrelu",h[h.sigmoid=5]="sigmoid",h[h.elu=6]="elu"})(l||(l={}))},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2GdDk":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"absConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Abs)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iAt0j:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"createUnaryKernelConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./types");function h(I,S){let e;function w(f){e=f.wasm.cwrap(I,null,["number","number","number"])}function m(f){const{backend:d,inputs:{x:_}}=f,y=d.dataIdMap.get(_.dataId).id,j=d.makeOutput(_.shape,S||_.dtype),r=d.dataIdMap.get(j.dataId).id;return s.util.sizeFromShape(j.shape)===0||e(y,l.CppDType[_.dtype],r),j}return{kernelName:I,backendName:"wasm",setupFunc:w,kernelFunc:m}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4wga7":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"acosConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Acos)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3jQcj":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"acoshConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Acosh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],babIa:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"addConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.Add,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6tYNr":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"createBinaryKernelConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./types");function h(I,S,e){let w;function m(d){w=d.wasm.cwrap(I,null,["number","array","number","number","array","number","number","number"])}function f(d){const{backend:_,inputs:y}=d,{a:j,b:r}=y,b=_.dataIdMap.get(j.dataId).id,v=_.dataIdMap.get(r.dataId).id,C=e??j.dtype,M=s.backend_util.assertAndGetBroadcastShape(j.shape,r.shape),P=_.makeOutput(M,C);if(s.util.sizeFromShape(M)===0)return P;const F=new Uint8Array(new Int32Array(j.shape).buffer),U=new Uint8Array(new Int32Array(r.shape).buffer),T=_.dataIdMap.get(P.dataId).id;return(()=>w(b,F,j.shape.length,v,U,r.shape.length,l.CppDType[j.dtype],T))(),P}return{kernelName:I,backendName:"wasm",setupFunc:m,kernelFunc:f}}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1zSOX":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"addNConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.AddN,null,["array","number","number","number"])}function S(w){const{inputs:m,backend:f}=w,d=f.makeOutput(m[0].shape,m[0].dtype);if(s.util.sizeFromShape(d.shape)===0)return d;const _=m.map(r=>f.dataIdMap.get(r.dataId).id),y=new Uint8Array(new Int32Array(_).buffer),j=f.dataIdMap.get(d.dataId).id;return h(y,_.length,l.CppDType[d.dtype],j),d}const e={kernelName:s.AddN,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8uwjX":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"allConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils");let h;function I(w){h=w.wasm.cwrap(s.All,null,["number, number, number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{axis:_,keepDims:y}=d,{x:j}=f;let b=m.dataIdMap.get(j.dataId).id,v=j;const{transposed:C,axes:M,originalAxes:P,inputWasTransposed:F}=(0,l.permuteAxesAndTranspose)(j,_,m);if(F){const E=m.dataIdMap.get(C.dataId).id;v=C,b=E}const U=v.shape.length;s.backend_util.assertAxesAreInnerMostDims("all",M,U);const[T,V]=s.backend_util.computeOutAndReduceShapes(v.shape,M),H=s.util.sizeFromShape(V),K=m.makeOutput(T,j.dtype);if(s.util.sizeFromShape(v.shape)!==0){const E=m.dataIdMap.get(K.dataId).id;h(b,H,E)}if(F&&m.disposeData(C.dataId),y){const E=s.backend_util.expandShapeToKeepDim(K.shape,P);K.shape=E}return K}const e={kernelName:s.All,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bvaRF:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"permuteAxesAndTranspose",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./Transpose");function h(I,S,e){const w=I.shape,m=I.shape.length,f=s.util.parseAxisParam(S,w);let d=f;const _=s.backend_util.getAxesPermutation(d,m);let y=null,j=!1;if(_!=null){const r=new Array(m);for(let C=0;C<r.length;C++)r[C]=w[_[C]];d=s.backend_util.getInnerMostAxes(d.length,m),y=(0,l.transpose)({inputs:{x:I},attrs:{perm:_},backend:e});const b=e.dataIdMap.get(I.dataId).id;e.dataIdMap.get(y.dataId).id!==b&&(j=!0)}return{transposed:y,originalAxes:f,axes:d,inputWasTransposed:j}}},{"@tensorflow/tfjs-core":"fqGP4","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],af8LA:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"transpose",()=>e),o.export(i,"transposeConfig",()=>f);var s=n("@tensorflow/tfjs-core"),l=n("./Identity"),h=n("./types");let I;function S(d){I=d.wasm.cwrap(s.Transpose,null,["number","array","number","number","number","array","number"])}function e(d){const{inputs:_,backend:y,attrs:j}=d,[r,b]=m(_.x.shape,j.perm);let v=!0;for(let H=0;H<b.length;H++)b[H]!==H&&(v=!1);const C=w(_.x.shape,j.perm),M={dataId:_.x.dataId,shape:r,dtype:_.x.dtype};if(v){const H=(0,l.identity)({inputs:_,backend:y});return H.shape=C,H}const P=y.makeOutput(C,M.dtype),F=y.dataIdMap.get(M.dataId).id,U=y.dataIdMap.get(P.dataId).id,T=new Uint8Array(new Int32Array(b).buffer),V=new Uint8Array(new Int32Array(M.shape).buffer);return I(F,V,M.shape.length,h.CppDType[M.dtype],U,T,b.length),P}function w(d,_){const y=new Array(d.length);for(let j=0;j<y.length;j++)y[j]=d[_[j]];return y}function m(d,_){const y=[],j=[];for(let r=0;r<d.length;++r)d[r]!==1&&y.push(d[r]),d[_[r]]!==1&&j.push(_[r]);for(let r=0;r<j.length;++r){let b=-1;for(let v=0;v<j.length;++v)j[v]>=r&&(b===-1||j[b]>j[v])&&(b=v);j[b]=r}return[y,j]}const f={kernelName:s.Transpose,backendName:"wasm",kernelFunc:e,setupFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Identity":"j2v3m","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j2v3m:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"identity",()=>l),o.export(i,"identityConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:{x:S},backend:e}=I;if(S.dtype==="string")return(0,s.tensor)(e.readSync(S.dataId),S.shape,S.dtype);const w=e.makeOutput(S.shape,S.dtype),m=e.typedArrayFromHeap(S);return e.typedArrayFromHeap(w).set(m),w}const h={kernelName:s.Identity,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5tCdr":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"anyConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils");let h;function I(w){h=w.wasm.cwrap(s.Any,null,["number, number, number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{axis:_,keepDims:y}=d,{x:j}=f;let b=m.dataIdMap.get(j.dataId).id,v=j;const{transposed:C,axes:M,originalAxes:P,inputWasTransposed:F}=(0,l.permuteAxesAndTranspose)(j,_,m);if(F){const E=m.dataIdMap.get(C.dataId).id;v=C,b=E}const U=v.shape.length;s.backend_util.assertAxesAreInnerMostDims("any",M,U);const[T,V]=s.backend_util.computeOutAndReduceShapes(v.shape,M),H=s.util.sizeFromShape(V),K=m.makeOutput(T,j.dtype);if(s.util.sizeFromShape(v.shape)!==0){const E=m.dataIdMap.get(K.dataId).id;h(b,H,E)}if(F&&m.disposeData(C.dataId),y){const E=s.backend_util.expandShapeToKeepDim(K.shape,P);K.shape=E}return K}const e={kernelName:s.Any,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hniZ5:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"argMaxConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./argminmax_kernel");const h=(0,l.createArgMinMaxKernelConfig)(s.ArgMax)},{"@tensorflow/tfjs-core":"fqGP4","./argminmax_kernel":"5BxsZ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5BxsZ":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"createArgMinMaxKernelConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils"),h=n("./types");function I(S){let e;function w(f){e=f.wasm.cwrap(S,null,["number","number","number","number","number"])}function m(f){const{backend:d,inputs:_,attrs:y}=f,{axis:j}=y,{x:r}=_,b=d.dataIdMap.get(r.dataId).id;let v=b,C=r;const{transposed:M,axes:P,inputWasTransposed:F}=(0,l.permuteAxesAndTranspose)(r,j,d);if(F){const E=d.dataIdMap.get(M.dataId).id;E!==b&&(C=M,v=E)}const U=C.shape.slice(0,-1),T=d.makeOutput(U,"int32"),V=d.dataIdMap.get(T.dataId).id,H=s.util.sizeFromShape(T.shape),K=C.shape[P[0]];return e(v,h.CppDType[C.dtype],H,K,V),F&&d.disposeData(M.dataId),T}return{kernelName:S,backendName:"wasm",setupFunc:w,kernelFunc:m}}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fwP75:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"argMinConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./argminmax_kernel");const h=(0,l.createArgMinMaxKernelConfig)(s.ArgMin)},{"@tensorflow/tfjs-core":"fqGP4","./argminmax_kernel":"5BxsZ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d0C9F:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"asinConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Asin)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bIa3m:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"asinhConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Asinh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fZUXt:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"atanConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Atan)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kfAHh:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"atan2Config",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=(0,l.createBinaryKernelConfig)(s.Atan2,!1)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],i1uKA:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"atanhConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Atanh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6v80u":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"avgPoolConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.AvgPool,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,attrs:m,backend:f}=e,d=w.x,_=f.dataIdMap.get(d.dataId).id,{filterSize:y,strides:j,pad:r,dimRoundingMode:b}=m,v=s.backend_util.computePool2DInfo(d.shape,y,j,1,r,b),C=v.filterHeight,M=v.filterWidth,P=v.padInfo.top,F=v.padInfo.right,U=v.padInfo.bottom,T=v.padInfo.left,V=v.strideHeight,H=v.strideWidth,K=v.inChannels;if(v.dataFormat!=="channelsLast")throw new Error(`wasm backend does not support dataFormat:'${v.dataFormat}'. Please use 'channelsLast'.`);if(v.dilationWidth!==1||v.dilationHeight!==1)throw new Error(`was backend only supports average pooling with dilation = [1, 1], got [${v.dilationHeight}, ${v.dilationWidth}].`);const E=f.makeOutput(v.outShape,"float32"),L=f.dataIdMap.get(E.dataId).id;return l(_,d.shape[0],d.shape[1],d.shape[2],C,M,P,F,U,T,V,H,K,L),E}const S={kernelName:s.AvgPool,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eR7nL:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"avgPool3D",()=>I),o.export(i,"avgPool3DConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("AvgPool3D",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d}=w,{filterSize:_,strides:y,pad:j,dimRoundingMode:r,dataFormat:b}=f,v=s.backend_util.computePool3DInfo(d.shape,_,y,1,j,r,b),C=m.makeOutput(v.outShape,d.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(C.dataId).id,v.batchSize,v.inChannels,v.inDepth,v.inHeight,v.inWidth,v.outDepth,v.outHeight,v.outWidth,v.strideDepth,v.strideHeight,v.strideWidth,v.dilationDepth,v.dilationHeight,v.dilationWidth,v.effectiveFilterDepth,v.effectiveFilterHeight,v.effectiveFilterWidth,v.padInfo.front,v.padInfo.top,v.padInfo.left),C}const S={kernelName:s.AvgPool3D,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8bldZ":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"avgPool3DGrad",()=>I),o.export(i,"avgPool3DGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("AvgPool3DGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{dy:d,input:_}=w,{filterSize:y,strides:j,pad:r,dimRoundingMode:b}=f,v=s.backend_util.computePool3DInfo(_.shape,y,j,1,r,b),C=m.makeOutput(_.shape,_.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(C.dataId).id,v.batchSize,v.inChannels,v.inDepth,v.inHeight,v.inWidth,v.outDepth,v.outHeight,v.outWidth,v.strideDepth,v.strideHeight,v.strideWidth,v.dilationDepth,v.dilationHeight,v.dilationWidth,v.effectiveFilterDepth,v.effectiveFilterHeight,v.effectiveFilterWidth,v.padInfo.front,v.padInfo.top,v.padInfo.left,v.filterDepth,v.filterHeight,v.filterWidth),C}const S={kernelName:s.AvgPool3DGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kEBm7:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"avgPoolGrad",()=>I),o.export(i,"avgPoolGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("AvgPoolGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{dy:d,input:_}=w,{filterSize:y,strides:j,pad:r}=f,b=s.backend_util.computePool2DInfo(_.shape,y,j,1,r),v=m.makeOutput(_.shape,_.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(v.dataId).id,b.batchSize,b.inChannels,b.inHeight,b.inWidth,b.outHeight,b.outWidth,b.strideHeight,b.strideWidth,b.dilationHeight,b.dilationWidth,b.effectiveFilterHeight,b.effectiveFilterWidth,b.padInfo.top,b.padInfo.left,b.filterHeight,b.filterWidth),v}const S={kernelName:s.AvgPoolGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ghCmV:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"batchMatMulConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Reshape");let h;function I(w){h=w.wasm.cwrap(s.BatchMatMul,null,["number","array","number","number","array","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{a:_,b:y}=m,{transposeA:j,transposeB:r}=d;if(_.dtype!=="float32"||y.dtype!=="float32")throw new Error("BatchMatMul for non non-float32 tensors not yet supported.");const b=_.shape.length,v=y.shape.length,C=j?_.shape[b-2]:_.shape[b-1],M=r?y.shape[v-1]:y.shape[v-2],P=j?_.shape[b-1]:_.shape[b-2],F=r?y.shape[v-2]:y.shape[v-1],U=_.shape.slice(0,-2),T=y.shape.slice(0,-2),V=s.util.sizeFromShape(U),H=s.util.sizeFromShape(T),E=s.broadcast_util.assertAndGetBroadcastShape(_.shape.slice(0,-2),y.shape.slice(0,-2)).concat([P,F]);s.util.assert(C===M,()=>`Error in matMul: inner shapes (${C}) and (${M}) of Tensors with shapes ${_.shape} and ${y.shape} and transposeA=${j} and transposeB=${r} must match.`);const L=j?[V,C,P]:[V,P,C],re=r?[H,F,M]:[H,M,F],ne=(0,l.reshape)({inputs:{x:_},backend:f,attrs:{shape:L}}),oe=(0,l.reshape)({inputs:{x:y},backend:f,attrs:{shape:re}}),he=f.dataIdMap.get(ne.dataId).id,be=f.dataIdMap.get(oe.dataId).id,ve=j?ne.shape[2]:ne.shape[1],ke=r?oe.shape[1]:oe.shape[2],We=Math.max(V,H),rt=f.makeOutput([We,ve,ke],ne.dtype),X=f.dataIdMap.get(rt.dataId).id,q=new Uint8Array(new Int32Array(ne.shape).buffer),Z=new Uint8Array(new Int32Array(oe.shape).buffer);return h(he,q,ne.shape.length,be,Z,oe.shape.length,j,r,X),f.disposeData(ne.dataId),f.disposeData(oe.dataId),rt.shape=E,rt}const e={kernelName:s.BatchMatMul,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],carA0:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"reshape",()=>l),o.export(i,"reshapeConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:S,attrs:e}=I,{x:w}=S,{shape:m}=e,f=s.util.sizeFromShape(w.shape),d=s.util.inferFromImplicitShape(m,f);return s.util.assert(f===s.util.sizeFromShape(d),()=>`new shape: ${d}, old shape: ${w.shape}. New shape and old shape must have the same number of elements.`),I.backend.incRef(w.dataId),{dataId:w.dataId,shape:d,dtype:w.dtype}}const h={kernelName:s.Reshape,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4eu0q":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"batchToSpaceNDConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Reshape"),h=n("./Slice"),I=n("./Transpose");function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_}=m,{blockShape:y,crops:j}=d,r=y.reduce((H,K)=>H*K),b=s.backend_util.getReshaped(_.shape,y,r),v=s.backend_util.getPermuted(b.length,y.length),C=s.backend_util.getReshapedPermuted(_.shape,y,r),M=s.backend_util.getSliceBeginCoords(j,y.length),P=s.backend_util.getSliceSize(C,j,y.length),F=(0,l.reshape)({inputs:{x:_},backend:f,attrs:{shape:b}}),U=(0,I.transpose)({inputs:{x:F},backend:f,attrs:{perm:v}}),T=(0,l.reshape)({inputs:{x:U},backend:f,attrs:{shape:C}}),V=(0,h.slice)({inputs:{x:T},backend:f,attrs:{begin:M,size:P}});return f.disposeData(F.dataId),f.disposeData(U.dataId),f.disposeData(F.dataId),V}const e={kernelName:s.BatchToSpaceND,backendName:"wasm",kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./Slice":"fC7Xk","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fC7Xk:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"slice",()=>h),o.export(i,"sliceConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");function h(m){const{inputs:{x:f},attrs:{begin:d,size:_},backend:y}=m,[j,r]=s.slice_util.parseSliceParams(f,d,_),b=s.slice_util.isSliceContinous(f.shape,j,r),v=y.readSync(f.dataId),C=y.makeOutput(r,f.dtype),M=s.util.computeStrides(f.shape),P=y.dataIdMap.get(C.dataId);if(b){const T=s.slice_util.computeFlatOffset(j,M);return f.dtype==="string"?P.stringBytes=v.slice(T,T+s.util.sizeFromShape(r)):y.typedArrayFromHeap(C).set(v.subarray(T,T+s.util.sizeFromShape(r))),C}if(f.dtype==="string"){const T=(0,l.sliceImplCPU)(v,j,r,f.shape,f.dtype);return P.stringBytes=T,C}const F=y.typedArrayFromHeap(C),U=f.shape.length;if(U===2)I(v,M[0],F,j,r);else if(U===3)S(v,M[0],M[1],F,j,r);else if(U===4)e(v,M[0],M[1],M[2],F,j,r);else{const T=(0,l.sliceImplCPU)(v,j,r,f.shape,f.dtype);F.set(T)}return C}function I(m,f,d,_,y){let j=0;const r=_[0],b=_[1],v=r+y[0];for(let C=r;C<v;C++){const M=C*f+b;d.set(m.subarray(M,M+y[1]),j),j+=y[1]}}function S(m,f,d,_,y,j){let r=0;const b=y[0],v=y[1],C=y[2],M=b+j[0],P=v+j[1];for(let F=b;F<M;F++)for(let U=v;U<P;U++){const T=F*f+U*d+C;_.set(m.subarray(T,T+j[2]),r),r+=j[2]}}function e(m,f,d,_,y,j,r){let b=0;const v=j[0],C=j[1],M=j[2],P=v+r[0],F=C+r[1],U=M+r[2],T=j[3];for(let V=v;V<P;V++)for(let H=C;H<F;H++)for(let K=M;K<U;K++){const E=V*f+H*d+K*_+T;y.set(m.subarray(E,E+r[3]),b),b+=r[3]}}const w={kernelName:s.Slice,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gOlqM:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"concatImplCPU",()=>s.concatImpl),o.export(i,"rangeImplCPU",()=>s.rangeImpl),o.export(i,"sliceImplCPU",()=>s.sliceImpl),o.export(i,"stringNGramsImplCPU",()=>s.stringNGramsImpl),o.export(i,"stringSplitImplCPU",()=>s.stringSplitImpl),o.export(i,"stringToHashBucketFastImplCPU",()=>s.stringToHashBucketFastImpl),o.export(i,"uniqueImplCPU",()=>s.uniqueImpl);var s=n("@tensorflow/tfjs-backend-cpu/dist/shared")},{"@tensorflow/tfjs-backend-cpu/dist/shared":"2aoP6","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jqmJj:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"bincountConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Bincount,null,["number","number","boolean","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{x:_,weights:y}=f,{size:j}=d,r=y.shape.reduce((M,P)=>M*P,1)!==0,b=_.shape.length===1?[j]:[_.shape[0],j],v=m.makeOutput(b,y.dtype);function C(M){return m.dataIdMap.get(M.dataId).id}return h(C(_),j,r,C(y),l.CppDType[y.dtype],C(v)),v}const e={kernelName:s.Bincount,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],c7xm1:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"bitwiseAndConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.BitwiseAnd,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4QfkB":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"broadcastArgs",()=>l),o.export(i,"broadcastArgsConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:S,backend:e}=I,{s0:w,s1:m}=S,f=e.typedArrayFromHeap(w),d=e.typedArrayFromHeap(m),_=s.backend_util.assertAndGetBroadcastShape(Array.from(f),Array.from(d));return e.makeOutput([_.length],"int32",void 0,new Int32Array(_))}const h={kernelName:s.BroadcastArgs,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bGPlI:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"cast",()=>l),o.export(i,"castConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:{x:S},attrs:{dtype:e},backend:w}=I,m=w.makeOutput(S.shape,e),f=w.typedArrayFromHeap(S);return w.typedArrayFromHeap(m).set(f),m}const h={kernelName:s.Cast,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dx9ZV:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"ceilConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Ceil)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e8U5N:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"clipByValueConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.ClipByValue,null,["number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d}=w,{clipValueMin:_,clipValueMax:y}=f,j=m.dataIdMap.get(d.dataId).id,r=m.makeOutput(d.shape,d.dtype),b=m.dataIdMap.get(r.dataId).id;return l(j,_,y,b),r}const S={kernelName:s.ClipByValue,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gg3oU:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"concat",()=>S),o.export(i,"concatConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared"),h=n("./Identity"),I=n("./Reshape");function S(w){const{inputs:m,backend:f}=w,d=s.util.parseAxisParam(w.attrs.axis,m[0].shape)[0],_=m.map(F=>F.shape);s.backend_util.assertParamsConsistent(_,d);let y=s.backend_util.computeOutShape(m.map(F=>F.shape),d);const j=m.filter(F=>s.util.sizeFromShape(F.shape)>0);if(j.length===1)return(0,h.identity)({inputs:{x:j[0]},backend:f});const r=f.makeOutput(y,m[0].dtype);if(s.util.sizeFromShape(y)===0)return r;if(j[0].dtype==="string"){const F=j.map(E=>{const L=s.util.sizeFromShape(E.shape.slice(d)),re=[-1,L];return(0,I.reshape)({inputs:{x:E},backend:f,attrs:{shape:re}})}),U=F.map(E=>({vals:f.readSync(E.dataId),shape:E.shape}));y=s.backend_util.computeOutShape(F.map(E=>E.shape),1);const T=F[0].shape[0]===1,V=(0,l.concatImplCPU)(U,y,m[0].dtype,T),H=s.backend_util.computeOutShape(j.map(E=>E.shape),d);r.shape=H;const K=f.dataIdMap.get(r.dataId);return K.stringBytes=s.backend_util.fromStringArrayToUint8(V),F.forEach(E=>f.disposeData(E.dataId)),r}const b=s.util.sizeFromShape(j[0].shape.slice(0,d));let v=0;const C=j.map(F=>{const U=s.util.sizeFromShape(F.shape.slice(d));return v+=U,U}),M=j.map(F=>f.typedArrayFromHeap(F)),P=f.typedArrayFromHeap(r);for(let F=0;F<b;F++){let U=F*v;for(let T=0;T<M.length;T++){const V=C[T],H=F*V,K=M[T].subarray(H,H+V);P.set(K,U),U+=V}}return r}const e={kernelName:s.Concat,backendName:"wasm",kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","./Identity":"j2v3m","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3weVS":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"conv2DConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Conv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,attrs:m,backend:f}=e,{x:d,filter:_}=w,y=f.dataIdMap.get(d.dataId).id,j=f.dataIdMap.get(_.dataId).id,{strides:r,dilations:b,pad:v,dimRoundingMode:C,dataFormat:M}=m,P=s.backend_util.convertConv2DDataFormat(M),F=s.backend_util.computeConv2DInfo(d.shape,_.shape,r,b,v,C,!1,P),U=F.filterHeight,T=F.filterWidth,V=F.padInfo.top,H=F.padInfo.right,K=F.padInfo.bottom,E=F.padInfo.left,L=F.dilationHeight,re=F.dilationWidth,ne=F.strideHeight,oe=F.strideWidth,he=F.inChannels,be=F.outChannels,ve=F.padInfo.type==="SAME"?1:0;if(F.dataFormat!=="channelsLast")throw new Error(`wasm backend Conv2D does not support dataFormat:'${F.dataFormat}'. Please use 'channelsLast'.`);const ke=f.makeOutput(F.outShape,"float32"),We=f.dataIdMap.get(ke.dataId).id;return l(y,d.shape[0],d.shape[1],d.shape[2],j,U,T,V,H,K,E,ve,L,re,ne,oe,he,be,We),ke}const S={kernelName:s.Conv2D,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cNlL5:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"conv2DBackpropInputConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Conv2DBackpropInput,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{backend:w,inputs:m,attrs:f}=e,{dy:d,filter:_}=m,{strides:y,pad:j,dataFormat:r,dimRoundingMode:b,inputShape:v}=f,C=1,M=s.backend_util.convertConv2DDataFormat(r),P=s.backend_util.computeConv2DInfo(v,_.shape,y,C,j,b,!1,M),{batchSize:F,filterHeight:U,filterWidth:T,inChannels:V,inHeight:H,inWidth:K,outChannels:E,outHeight:L,outWidth:re,strideHeight:ne,strideWidth:oe}=P,he=U-1-P.padInfo.top,be=T-1-P.padInfo.left,ve=P.dataFormat==="channelsLast",ke=s.util.computeStrides(P.inShape),We=s.util.computeStrides(d.shape),[rt,X,q]=s.util.computeStrides(_.shape),Z=ke[0],te=ve?ke[1]:ke[2],ee=ve?ke[2]:1,pe=ve?1:ke[1],se=We[0],me=ve?We[1]:We[2],ue=ve?We[2]:1,le=ve?1:We[1],ae=w.makeOutput(P.inShape,"float32"),ge=w.dataIdMap.get(ae.dataId).id,je=w.dataIdMap.get(d.dataId).id,ye=w.dataIdMap.get(_.dataId).id;return l(je,ye,F,U,T,H,K,V,L,re,E,ne,oe,he,be,rt,X,q,Z,te,ee,pe,se,me,ue,le,ge),ae}const S={kernelName:s.Conv2DBackpropInput,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6dmzH":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"conv3D",()=>I),o.export(i,"conv3DConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Conv3D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d,filter:_}=w,{strides:y,pad:j,dilations:r}=f;if(d.dtype!=="float32")throw new Error(`Tensor x must have dtype float32, got ${d.dtype}`);if(_.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${_.dtype}`);const b=s.backend_util.computeConv3DInfo(d.shape,_.shape,y,r,j),v=m.makeOutput(b.outShape,d.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(v.dataId).id,b.batchSize,b.inDepth,b.inHeight,b.inWidth,b.inChannels,b.outDepth,b.outHeight,b.outWidth,b.outChannels,b.strideDepth,b.strideHeight,b.strideWidth,b.dilationDepth,b.dilationHeight,b.dilationWidth,b.filterDepth,b.filterHeight,b.filterWidth,b.padInfo.front,b.padInfo.top,b.padInfo.left),v}const S={kernelName:s.Conv3D,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],buiqm:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"conv3DBackpropFilterV2",()=>I),o.export(i,"conv3DBackpropFilterV2Config",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Conv3DBackpropFilterV2,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d,dy:_}=w,{strides:y,pad:j,filterShape:r}=f;if(d.dtype!=="float32")throw new Error(`Tensor dy must have dtype float32, got ${d.dtype}`);if(_.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${_.dtype}`);const b=s.backend_util.computeConv3DInfo(d.shape,r,y,1,j),v=m.makeOutput(b.filterShape,_.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(v.dataId).id,b.batchSize,b.inDepth,b.inHeight,b.inWidth,b.inChannels,b.outDepth,b.outHeight,b.outWidth,b.outChannels,b.strideDepth,b.strideHeight,b.strideWidth,b.dilationDepth,b.dilationHeight,b.dilationWidth,b.filterDepth,b.filterHeight,b.filterWidth,b.padInfo.front,b.padInfo.top,b.padInfo.left),v}const S={kernelName:s.Conv3DBackpropFilterV2,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2vkNx":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"conv3DBackpropInputV2",()=>I),o.export(i,"conv3DBackpropInputV2Config",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Conv3DBackpropInputV2,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{dy:d,filter:_}=w,{pad:y,strides:j,inputShape:r}=f;if(d.dtype!=="float32")throw new Error(`Tensor dy must have dtype float32, got ${d.dtype}`);if(_.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${_.dtype}`);const b=s.backend_util.computeConv3DInfo(r,_.shape,j,1,y),v=m.makeOutput(b.inShape,d.dtype);return l(m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(v.dataId).id,b.batchSize,b.inDepth,b.inHeight,b.inWidth,b.inChannels,b.outDepth,b.outHeight,b.outWidth,b.outChannels,b.strideDepth,b.strideHeight,b.strideWidth,b.dilationDepth,b.dilationHeight,b.dilationWidth,b.filterDepth,b.filterHeight,b.filterWidth,b.padInfo.front,b.padInfo.top,b.padInfo.left),v}const S={kernelName:s.Conv3DBackpropInputV2,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],condh:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"cosConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Cos)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e7YUt:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"coshConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Cosh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7voe3":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"cropAndResizeConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Cast"),h;(function(m){m[m.bilinear=0]="bilinear",m[m.nearest=1]="nearest"})(h||(h={}));let I;function S(m){I=m.wasm.cwrap(s.CropAndResize,null,["number","number","number","number","array","number","number","number","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{method:y,extrapolationValue:j,cropSize:r}=_,{image:b,boxes:v,boxInd:C}=d,M=v.shape[0],[P,F]=r,U=[M,P,F,b.shape[3]];let T=f.dataIdMap.get(b.dataId),V;b.dtype!=="float32"&&(V=(0,l.cast)({backend:f,inputs:{x:b},attrs:{dtype:"float32"}}),T=f.dataIdMap.get(V.dataId));const H=T.id,K=f.dataIdMap.get(v.dataId).id,E=f.dataIdMap.get(C.dataId).id,L=f.makeOutput(U,"float32"),re=f.dataIdMap.get(L.dataId).id,ne=new Uint8Array(new Int32Array(b.shape).buffer);return I(H,K,E,M,ne,P,F,h[y],j,re),V!=null&&f.disposeData(V.dataId),L}const w={kernelName:s.CropAndResize,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3DVNe":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"cumprod",()=>e),o.export(i,"cumprodConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./types"),h=n("./Transpose");let I;function S(m){I=m.wasm.cwrap(s.Cumprod,null,["number","number","number","number","number","number"])}function e(m){const{inputs:f,backend:d,attrs:_}=m,{x:y}=f,{axis:j,exclusive:r,reverse:b}=_,v=y.shape.length;s.util.assert(y.dtype==="float32"||y.dtype==="int32",()=>`cumprod does not support ${y.dtype} tensors in the WASM backend`);const C=s.backend_util.getAxesPermutation([j],v);let M=y;C!==null&&(M=(0,h.transpose)({inputs:{x:y},attrs:{perm:C},backend:d}));const P=s.backend_util.getInnerMostAxes(1,v)[0];s.backend_util.assertAxesAreInnerMostDims("cumprod",[P],v);const F=d.makeOutput(M.shape,M.dtype),U=M.shape[P],T=d.dataIdMap.get(M.dataId).id,V=d.dataIdMap.get(F.dataId).id;I(T,r?1:0,b?1:0,U,V,l.CppDType[y.dtype]);let H=F;if(C!==null){const K=s.backend_util.getUndoAxesPermutation(C);H=(0,h.transpose)({inputs:{x:F},attrs:{perm:K},backend:d}),d.disposeData(M.dataId),d.disposeData(F.dataId)}return H}const w={kernelName:s.Cumprod,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3PHjZ":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"cumsum",()=>e),o.export(i,"cumsumConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./types"),h=n("./Transpose");let I;function S(m){I=m.wasm.cwrap(s.Cumsum,null,["number","number","number","number","number","number"])}function e(m){const{inputs:f,backend:d,attrs:_}=m,{x:y}=f,{axis:j,exclusive:r,reverse:b}=_,v=y.shape.length;s.util.assert(y.dtype==="float32"||y.dtype==="int32",()=>`cumsum does not support ${y.dtype} tensors in the WASM backend`);const C=s.backend_util.getAxesPermutation([j],v);let M=y;C!==null&&(M=(0,h.transpose)({inputs:{x:y},attrs:{perm:C},backend:d}));const P=s.backend_util.getInnerMostAxes(1,v)[0];s.backend_util.assertAxesAreInnerMostDims("cumsum",[P],v);const F=d.makeOutput(M.shape,M.dtype),U=M.shape[P],T=d.dataIdMap.get(M.dataId).id,V=d.dataIdMap.get(F.dataId).id;I(T,r?1:0,b?1:0,U,V,l.CppDType[y.dtype]);let H=F;if(C!==null){const K=s.backend_util.getUndoAxesPermutation(C);H=(0,h.transpose)({inputs:{x:F},attrs:{perm:K},backend:d}),d.disposeData(M.dataId),d.disposeData(F.dataId)}return H}const w={kernelName:s.Cumsum,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9A4DJ":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"denseBincountConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap("DenseBincount",null,["number","array","number","number","boolean","number","number","boolean","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{x:_,weights:y}=f,{size:j,binaryOutput:r}=d,b=y.shape.reduce((P,F)=>P*F,1)!==0,v=_.shape.length===1?[j]:[_.shape[0],j],C=m.makeOutput(v,y.dtype);function M(P){return m.dataIdMap.get(P.dataId).id}return h(M(_),new Uint8Array(new Int32Array(_.shape).buffer),_.shape.length,j,b,M(y),l.CppDType[y.dtype],r,M(C)),C}const e={kernelName:s.DenseBincount,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eP6yj:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"depthToSpace",()=>I),o.export(i,"depthToSpaceConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.DepthToSpace,null,["number","number","number","array","number","array","array","number","number"])}function I(e){const{backend:w,inputs:m,attrs:f}=e,{x:d}=m,{blockSize:_,dataFormat:y}=f,j=d.shape[0],r=y==="NHWC"?d.shape[1]:d.shape[2],b=y==="NHWC"?d.shape[2]:d.shape[3],v=y==="NHWC"?d.shape[3]:d.shape[1],C=r*_,M=b*_,P=v/(_*_),F=y==="NHWC"?[j,C,M,P]:[j,P,C,M],U=w.makeOutput(F,"float32"),V=w.dataIdMap.get(d.dataId).id,H=new Uint8Array(new Int32Array(s.util.computeStrides(d.shape)).buffer),K=new Uint8Array(new Int32Array(F).buffer),E=new Uint8Array(new Int32Array(s.util.computeStrides(F)).buffer),L=w.dataIdMap.get(U.dataId).id;return l(V,_,y==="NHWC"?1:0,H,d.shape.length-1,K,E,F.length,L),U}const S={kernelName:s.DepthToSpace,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5qoZn":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"depthwiseConv2dNativeConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.DepthwiseConv2dNative,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,attrs:m,backend:f}=e,{x:d,filter:_}=w,y=f.dataIdMap.get(d.dataId).id,j=f.dataIdMap.get(_.dataId).id,{strides:r,dilations:b,pad:v,dimRoundingMode:C}=m,M=b??[1,1],P=s.backend_util.computeConv2DInfo(d.shape,_.shape,r,M,v,C,!0),F=P.filterHeight,U=P.filterWidth,T=P.padInfo.top,V=P.padInfo.right,H=P.padInfo.bottom,K=P.padInfo.left,E=P.dilationHeight,L=P.dilationWidth,re=P.strideHeight,ne=P.strideWidth,oe=P.inChannels,he=P.outChannels,be=P.padInfo.type==="SAME"?1:0;if(P.dataFormat!=="channelsLast")throw new Error(`wasm backend DepthwiseConv2dNative does not support dataFormat:'${P.dataFormat}'. Please use 'channelsLast'.`);const ve=f.makeOutput(P.outShape,"float32"),ke=f.dataIdMap.get(ve.dataId).id;return l(y,d.shape[0],d.shape[1],d.shape[2],j,F,U,T,V,H,K,be,E,L,re,ne,oe,he,ke),ve}const S={kernelName:s.DepthwiseConv2dNative,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iZETk:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"diag",()=>S),o.export(i,"diagConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap("Diag",null,["number","number","number","number"])}function S(w){const{inputs:m,backend:f}=w,{x:d}=m,_=s.util.sizeFromShape(d.shape),y=f.makeOutput([...d.shape,...d.shape],d.dtype);return h(f.dataIdMap.get(d.dataId).id,l.CppDType[d.dtype],_,f.dataIdMap.get(y.dataId).id),y}const e={kernelName:s.Diag,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],C1MuG:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"dilation2D",()=>S),o.export(i,"dilation2DConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Dilation2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_,filter:y}=m,{strides:j,pad:r,dilations:b}=d;if(_.dtype!==y.dtype)throw new Error(`Dilation2D error: x must have the same dtype as filter. Got ${_.dtype} and ${y.dtype}`);const v=s.backend_util.computeDilation2DInfo(_.shape,y.shape,j,r,"NHWC",b),C=f.makeOutput(v.outShape,_.dtype);return h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(y.dataId).id,f.dataIdMap.get(C.dataId).id,l.CppDType[_.dtype],v.batchSize,v.inChannels,v.inHeight,v.inWidth,v.outHeight,v.outWidth,v.strideHeight,v.strideWidth,v.dilationHeight,v.dilationWidth,v.filterHeight,v.filterWidth,v.padInfo.top,v.padInfo.left),C}const e={kernelName:s.Dilation2D,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],deAYm:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"dilation2DBackpropFilter",()=>S),o.export(i,"dilation2DBackpropFilterConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Dilation2DBackpropFilter,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_,filter:y,dy:j}=m,{strides:r,pad:b,dilations:v}=d;if(_.dtype!==y.dtype||_.dtype!==j.dtype)throw new Error(`Dilation2DBackpropFilter error: x must have the same dtype as filter and dy. Got ${_.dtype}, ${y.dtype}, and ${j.dtype}`);const C=s.backend_util.computeDilation2DInfo(_.shape,y.shape,r,b,"NHWC",v),M=f.makeOutput(y.shape,y.dtype);return h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(y.dataId).id,f.dataIdMap.get(j.dataId).id,f.dataIdMap.get(M.dataId).id,l.CppDType[_.dtype],C.batchSize,C.inChannels,C.inHeight,C.inWidth,C.outHeight,C.outWidth,C.strideHeight,C.strideWidth,C.dilationHeight,C.dilationWidth,C.filterHeight,C.filterWidth,C.padInfo.top,C.padInfo.left),M}const e={kernelName:s.Dilation2DBackpropFilter,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2Wfxa":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"dilation2DBackpropInput",()=>S),o.export(i,"dilation2DBackpropInputConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Dilation2DBackpropInput,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_,filter:y,dy:j}=m,{strides:r,pad:b,dilations:v}=d;if(_.dtype!==y.dtype||_.dtype!==j.dtype)throw new Error(`Dilation2DBackpropInput error: x must have the same dtype as filter and dy. Got ${_.dtype}, ${y.dtype}, and ${j.dtype}`);const C=s.backend_util.computeDilation2DInfo(_.shape,y.shape,r,b,"NHWC",v),M=f.makeOutput(_.shape,_.dtype);return h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(y.dataId).id,f.dataIdMap.get(j.dataId).id,f.dataIdMap.get(M.dataId).id,l.CppDType[_.dtype],C.batchSize,C.inChannels,C.inHeight,C.inWidth,C.outHeight,C.outWidth,C.strideHeight,C.strideWidth,C.dilationHeight,C.dilationWidth,C.filterHeight,C.filterWidth,C.padInfo.top,C.padInfo.left),M}const e={kernelName:s.Dilation2DBackpropInput,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hTLQ9:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"eluConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Elu)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],oj4DQ:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"eluGrad",()=>I),o.export(i,"eluGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.EluGrad,null,["number","number","number"])}function I(e){const{inputs:w,backend:m}=e,{dy:f,y:d}=w,_=m.makeOutput(d.shape,"float32"),y=j=>m.dataIdMap.get(j.dataId).id;return l(y(d),y(f),y(_)),_}const S={kernelName:s.EluGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6NRgP":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"equalConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Equal,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],g2W0V:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"erfConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Erf)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9puem":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"expConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Exp,"float32")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2OTFi":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"expandDims",()=>h),o.export(i,"expandDimsConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./Reshape");function h(S){const{inputs:e,attrs:w,backend:m}=S,{input:f}=e,{dim:d}=w,_=f.shape.length,y=f.shape.slice();let j=d;return d<0&&(s.util.assert(-(_+1)<=d,()=>`Axis must be in the interval [${-(_+1)}, ${_}]`),j=_+d+1),y.splice(j,0,1),(0,l.reshape)({inputs:{x:f},backend:m,attrs:{shape:y}})}const I={kernelName:s.ExpandDims,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lVQHI:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"expm1Config",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Expm1,"float32")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],geiWD:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"fill",()=>l),o.export(i,"fillConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{attrs:{shape:S,value:e,dtype:w},backend:m}=I,f=m.makeOutput(S,w);return m.typedArrayFromHeap(f).fill(e),f}const h={kernelName:s.Fill,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d7JTg:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"flipLeftRight",()=>I),o.export(i,"flipLeftRightConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.FlipLeftRight,null,["number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m}=e,{image:f}=w,d=m.makeOutput(f.shape,f.dtype),_=m.dataIdMap.get(f.dataId).id,y=m.dataIdMap.get(d.dataId).id,[j,r,b,v]=f.shape;return l(_,j,r,b,v,y),d}const S={kernelName:s.FlipLeftRight,backendName:"wasm",kernelFunc:I,setupFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"29SUM":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"floorConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Floor)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bJ7qU:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"floorDivConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.FloorDiv,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],i7ayZ:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"fusedBatchNormConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.FusedBatchNorm,null,["number","number","number","number","number","number","number"])}function I(e){const{backend:w,inputs:m,attrs:f}=e,{varianceEpsilon:d}=f,{x:_,mean:y,variance:j,offset:r,scale:b}=m,v=w.dataIdMap.get(_.dataId).id,C=w.dataIdMap.get(y.dataId).id,M=w.dataIdMap.get(j.dataId).id,P=r!=null?w.dataIdMap.get(r.dataId).id:0,F=b!=null?w.dataIdMap.get(b.dataId).id:0,U=w.makeOutput(_.shape,_.dtype);if(s.util.sizeFromShape(_.shape)===0)return U;const T=w.dataIdMap.get(U.dataId).id;return l(v,C,M,P,F,d,T),U}const S={kernelName:s.FusedBatchNorm,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bXSgI:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"fusedConv2DConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.FusedConv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,attrs:f,backend:d}=w,{x:_,filter:y,bias:j,preluActivationWeights:r}=m,{strides:b,pad:v,dilations:C,dataFormat:M,dimRoundingMode:P,activation:F,leakyreluAlpha:U}=f,T=s.backend_util.computeConv2DInfo(_.shape,y.shape,b,C,v,P),V=l.FusableActivation[F];if(V==null)throw new Error(`${F} activation not yet supported for FusedConv2D in the wasm backend.`);const H=d.dataIdMap.get(_.dataId).id,K=d.dataIdMap.get(y.dataId).id,E=T.outChannels;let L=0;if(j!=null){const le=d.dataIdMap.get(j.dataId);if(le.shape.length!==1)throw new Error(`FusedConv2D only supports rank-1 bias but got rank ${le.shape.length}.`);if(le.shape[0]!==E)throw new Error(`FusedConv2D bias shape (${le.shape}) does not match the number of output channels (${E})`);L=le.id}const re=T.filterHeight,ne=T.filterWidth,oe=T.padInfo.top,he=T.padInfo.right,be=T.padInfo.bottom,ve=T.padInfo.left,ke=T.dilationHeight,We=T.dilationWidth,rt=T.strideHeight,X=T.strideWidth,q=T.inChannels,Z=T.padInfo.type==="SAME"?1:0,te=T.batchSize,ee=T.inHeight,pe=T.inWidth;if(M!=="NHWC")throw new Error(`wasm backend FusedConv2D does not support dataFormat:'${M}'. Please use 'NHWC'.`);const se=d.makeOutput(T.outShape,"float32"),me=d.dataIdMap.get(se.dataId).id,ue=r==null?0:d.dataIdMap.get(r.dataId).id;return h(H,te,ee,pe,K,re,ne,L,oe,he,be,ve,Z,ke,We,rt,X,q,E,V,ue,U||0,me),se}const e={kernelName:s.FusedConv2D,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fpjh5:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"fusedDepthwiseConv2DConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.FusedDepthwiseConv2D,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,attrs:f,backend:d}=w,{x:_,filter:y,bias:j,preluActivationWeights:r}=m,{strides:b,pad:v,dilations:C,dataFormat:M,dimRoundingMode:P,activation:F,leakyreluAlpha:U}=f,T=s.backend_util.computeConv2DInfo(_.shape,y.shape,b,C,v,P,!0),V=l.FusableActivation[F];if(V==null)throw new Error(`${F} activation not yet supported for FusedDepthwiseConv2D in the wasm backend.`);const H=d.dataIdMap.get(_.dataId).id,K=d.dataIdMap.get(y.dataId).id,E=T.outChannels;let L=0;if(j!=null){const le=d.dataIdMap.get(j.dataId);if(le.shape.length!==1)throw new Error(`FusedDepthwiseConv2D only supports rank-1 bias but got rank ${le.shape.length}.`);if(le.shape[0]!==E)throw new Error(`FusedDepthwiseConv2D bias shape (${le.shape}) does not match the number of output channels (${E})`);L=le.id}const re=T.filterHeight,ne=T.filterWidth,oe=T.padInfo.top,he=T.padInfo.right,be=T.padInfo.bottom,ve=T.padInfo.left,ke=T.dilationHeight,We=T.dilationWidth,rt=T.strideHeight,X=T.strideWidth,q=T.inChannels,Z=T.padInfo.type==="SAME"?1:0,te=T.batchSize,ee=T.inHeight,pe=T.inWidth;if(M!=="NHWC")throw new Error(`wasm backend FusedDepthwiseConv2D does not support dataFormat:'${M}'. Please use 'NHWC'.`);const se=d.makeOutput(T.outShape,"float32"),me=d.dataIdMap.get(se.dataId).id,ue=r==null?0:d.dataIdMap.get(r.dataId).id;return h(H,te,ee,pe,K,re,ne,L,oe,he,be,ve,Z,ke,We,rt,X,q,E,V,ue,U||0,me),se}const e={kernelName:s.FusedDepthwiseConv2D,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9McxH":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"gatherNdConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.GatherNd,null,["number","number","number","number","number","number","array","number"])}function S(w){const{backend:m,inputs:f}=w,{params:d,indices:_}=f,[y,j,r,b]=s.gather_util.prepareAndValidate(d,_),v=m.makeOutput(y,d.dtype);if(j===0)return v;const C=_.shape,M=C[C.length-1],F=m.dataIdMap.get(d.dataId).id,T=m.dataIdMap.get(_.dataId).id,V=new Uint8Array(new Int32Array(b).buffer),H=m.dataIdMap.get(v.dataId).id;return h(F,l.CppDType[d.dtype],T,j,M,r,V,H),v}const e={kernelName:s.GatherNd,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e6daa:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"gatherV2Config",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Reshape"),h=n("./types");let I;function S(m){I=m.wasm.cwrap("Gather",null,["number","number","array","number","number","number","array","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{x:y,indices:j}=d,{axis:r,batchDims:b}=_,v=s.util.parseAxisParam(r,y.shape)[0],C=f.readSync(j.dataId),M=y.shape[v];for(let ve=0;ve<C.length;++ve){const ke=C[ve];s.util.assert(ke<=M-1&&ke>=0,()=>`GatherV2: the index value ${ke} is not in [0, ${M-1}]`)}const P=s.backend_util.segment_util.collectGatherOpShapeInfo(y,j,v,b),F=(0,l.reshape)({inputs:{x:y},attrs:{shape:[P.batchSize,P.outerSize,P.dimSize,P.sliceSize]},backend:f}),U=s.util.sizeFromShape(j.shape),T=(0,l.reshape)({inputs:{x:j},attrs:{shape:[P.batchSize,U/P.batchSize]},backend:f}),V=[P.batchSize,P.outerSize,U/P.batchSize,P.sliceSize],H=f.makeOutput(V,y.dtype);if(s.util.sizeFromShape(y.shape)===0)return H;const K=F.shape.length-1,L=f.dataIdMap.get(F.dataId).id,ne=f.dataIdMap.get(T.dataId).id,oe=f.dataIdMap.get(H.dataId).id,he=new Uint8Array(new Int32Array(s.util.computeStrides(F.shape)).buffer),be=new Uint8Array(new Int32Array(s.util.computeStrides(V)).buffer);return I(L,h.CppDType[y.dtype],he,K,ne,P.batchSize,be,oe),f.disposeData(F.dataId),f.disposeData(T.dataId),H.shape=P.outputShape,H}const w={kernelName:s.GatherV2,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6JnB0":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"greaterConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Greater,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6T8x5":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"greaterEqualConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.GreaterEqual,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eQQpo:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"isFiniteConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.IsFinite,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7HgCK":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"isInfConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.IsInf,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1dy0x":[function(n,R,i){/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"isNaNConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.IsNan,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jyGti:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"leakyRelu",()=>S),o.export(i,"leakyReluConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.LeakyRelu,null,["number","number","number","number"])}function S(w){const{inputs:{x:m},attrs:{alpha:f},backend:d}=w,_=d.dataIdMap.get(m.dataId).id,y=d.makeOutput(m.shape,"float32");if(s.util.sizeFromShape(m.shape)!==0){const j=d.dataIdMap.get(y.dataId).id;h(_,l.CppDType[m.dtype],f,j)}return y}const e={kernelName:s.LeakyRelu,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6302T":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"lessConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Less,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bgZoQ:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"lessEqualConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.LessEqual,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kXZYO:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"linSpace",()=>I),o.export(i,"linSpaceConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.LinSpace,null,["number","number","number","number"])}function I(e){const{attrs:w,backend:m}=e,{start:f,stop:d,num:_}=w,y=Math.floor(_),j=m.makeOutput([y],"float32");return l(m.dataIdMap.get(j.dataId).id,f,d,y),j}const S={kernelName:s.LinSpace,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],h9Yb3:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"logConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Log)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hI0xM:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"log1pConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Log1p)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7S6JD":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"logicalAndConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.LogicalAnd,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gQmpO:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"logicalNotConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.LogicalNot)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aqmTw:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"logicalOrConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.LogicalOr,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5o6Uq":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"logicalXorConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.LogicalXor,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2rXNf":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"lrn",()=>I),o.export(i,"lrnConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.LRN,null,["number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d}=w,{depthRadius:_,bias:y,alpha:j,beta:r}=f;if(d.dtype!=="float32")throw new Error("LRN error: x must have dtype float32");const b=m.makeOutput(d.shape,d.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(b.dataId).id,d.shape[3],_,y,j,r),b}const S={kernelName:s.LRN,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],blTZv:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"lrnGrad",()=>I),o.export(i,"lrnGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.LRNGrad,null,["number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d,y:_,dy:y}=w,{depthRadius:j,bias:r,alpha:b,beta:v}=f;if(d.dtype!=="float32"||_.dtype!=="float32"||y.dtype!=="float32")throw new Error("LRNGrad error: x, y, and dy must have dtype float32");const C=m.makeOutput(d.shape,d.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(y.dataId).id,m.dataIdMap.get(C.dataId).id,y.shape[3],j,r,b,v),C}const S={kernelName:s.LRNGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4RGKM":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils"),h=n("./types");let I;function S(m){I=m.wasm.cwrap(s.Max,null,["number","number","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{reductionIndices:y,keepDims:j}=_,{x:r}=d;let v=f.dataIdMap.get(r.dataId).id,C=r;const{transposed:M,axes:P,originalAxes:F,inputWasTransposed:U}=(0,l.permuteAxesAndTranspose)(r,y,f);if(U){const L=f.dataIdMap.get(M.dataId).id;C=M,v=L}const T=C.shape.length;s.backend_util.assertAxesAreInnerMostDims("max",P,T);const[V,H]=s.backend_util.computeOutAndReduceShapes(C.shape,P),K=s.util.sizeFromShape(H),E=f.makeOutput(V,r.dtype);if(s.util.sizeFromShape(C.shape)!==0){const L=f.dataIdMap.get(E.dataId).id;I(v,h.CppDType[r.dtype],K,L)}if(U&&f.disposeData(M.dataId),j){const L=s.backend_util.expandShapeToKeepDim(E.shape,F);E.shape=L}return E}const w={kernelName:s.Max,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cL64O:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maximumConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Maximum,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ImEix:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxPoolConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.MaxPool,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,attrs:m,backend:f}=e,d=w.x,_=f.dataIdMap.get(d.dataId).id;s.util.assert(d.dtype==="float32",()=>`Error in MaxPool: only float32 input is supported. Got ${d.dtype}.`);const{filterSize:y,strides:j,pad:r,dimRoundingMode:b}=m,v=s.backend_util.computePool2DInfo(d.shape,y,j,1,r,b),C=v.filterHeight,M=v.filterWidth,P=v.padInfo.top,F=v.padInfo.right,U=v.padInfo.bottom,T=v.padInfo.left,V=v.dilationHeight,H=v.dilationWidth,K=v.strideHeight,E=v.strideWidth,L=v.inChannels,re=v.outChannels;if(v.dataFormat!=="channelsLast")throw new Error(`wasm backend does not support dataFormat:'${v.dataFormat}'. Please use 'channelsLast'.`);const ne=f.makeOutput(v.outShape,"float32"),oe=f.dataIdMap.get(ne.dataId).id;return l(_,d.shape[0],d.shape[1],d.shape[2],C,M,P,F,U,T,V,H,K,E,L,re,oe),ne}const S={kernelName:s.MaxPool,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lkZwn:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxPool3D",()=>I),o.export(i,"maxPool3DConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("MaxPool3D",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{x:d}=w,{filterSize:_,strides:y,pad:j,dimRoundingMode:r,dataFormat:b}=f,v=s.backend_util.computePool3DInfo(d.shape,_,y,1,j,r,b),C=m.makeOutput(v.outShape,d.dtype);return l(m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(C.dataId).id,v.batchSize,v.inChannels,v.inDepth,v.inHeight,v.inWidth,v.outDepth,v.outHeight,v.outWidth,v.strideDepth,v.strideHeight,v.strideWidth,v.dilationDepth,v.dilationHeight,v.dilationWidth,v.effectiveFilterDepth,v.effectiveFilterHeight,v.effectiveFilterWidth,v.padInfo.front,v.padInfo.top,v.padInfo.left),C}const S={kernelName:s.MaxPool3D,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cLYKY:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxPool3DGrad",()=>I),o.export(i,"maxPool3DGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("MaxPool3DGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{dy:d,input:_}=w,{filterSize:y,strides:j,pad:r,dimRoundingMode:b}=f,v=s.backend_util.computePool3DInfo(_.shape,y,j,1,r,b),C=m.makeOutput(_.shape,_.dtype);return l(m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(C.dataId).id,v.batchSize,v.inChannels,v.inDepth,v.inHeight,v.inWidth,v.outDepth,v.outHeight,v.outWidth,v.strideDepth,v.strideHeight,v.strideWidth,v.dilationDepth,v.dilationHeight,v.dilationWidth,v.effectiveFilterDepth,v.effectiveFilterHeight,v.effectiveFilterWidth,v.padInfo.front,v.padInfo.top,v.padInfo.left),C}const S={kernelName:s.MaxPool3DGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],b0bF5:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxPoolGrad",()=>I),o.export(i,"maxPoolGradConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("MaxPoolGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{dy:d,input:_}=w,{filterSize:y,strides:j,pad:r,dimRoundingMode:b}=f,v=s.backend_util.computePool2DInfo(_.shape,y,j,1,r,b),C=m.makeOutput(_.shape,_.dtype);return l(m.dataIdMap.get(_.dataId).id,m.dataIdMap.get(d.dataId).id,m.dataIdMap.get(C.dataId).id,v.batchSize,v.inChannels,v.inHeight,v.inWidth,v.outHeight,v.outWidth,v.strideHeight,v.strideWidth,v.dilationHeight,v.dilationWidth,v.effectiveFilterHeight,v.effectiveFilterWidth,v.padInfo.top,v.padInfo.left),C}const S={kernelName:s.MaxPoolGrad,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"810JB":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"maxPoolWithArgmax",()=>S),o.export(i,"maxPoolWithArgmaxConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap("MaxPoolWithArgmax",null,["number","number","number","number","boolean","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_}=m,{filterSize:y,strides:j,pad:r,includeBatchInIndex:b}=d;s.util.assert(_.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${_.shape.length}.`);const v=[1,1];s.util.assert(s.backend_util.eitherStridesOrDilationsAreOne(j,v),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${j} and dilations '${v}'`);const C=s.backend_util.computePool2DInfo(_.shape,y,j,[1,1],r),M=f.makeOutput(C.outShape,_.dtype),P=f.makeOutput(C.outShape,"int32");return h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(M.dataId).id,f.dataIdMap.get(P.dataId).id,l.CppDType[_.dtype],b,C.batchSize,C.inChannels,C.inHeight,C.inWidth,C.outHeight,C.outWidth,C.strideHeight,C.strideWidth,C.dilationHeight,C.dilationWidth,C.effectiveFilterHeight,C.effectiveFilterWidth,C.padInfo.top,C.padInfo.left),[M,P]}const e={kernelName:s.MaxPoolWithArgmax,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8hVA0":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"mean",()=>e),o.export(i,"meanConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Cast"),h=n("./kernel_utils");let I;function S(m){I=m.wasm.cwrap(s.Mean,null,["number, number, number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{axis:y,keepDims:j}=_,{x:r}=d,b=f.dataIdMap.get(r.dataId).id;let v=b,C=r;const{transposed:M,axes:P,originalAxes:F,inputWasTransposed:U}=(0,h.permuteAxesAndTranspose)(r,y,f);let T=P;if(U){const re=f.dataIdMap.get(M.dataId).id;re!==b&&(C=M,v=re,T=s.backend_util.getInnerMostAxes(T.length,C.shape.length))}s.backend_util.assertAxesAreInnerMostDims("mean",T,C.shape.length);const[V,H]=s.backend_util.computeOutAndReduceShapes(C.shape,T),K=s.util.sizeFromShape(H);let E=C;C.dtype!=="float32"&&(E=(0,l.cast)({backend:f,inputs:{x:C},attrs:{dtype:"float32"}}),v=f.dataIdMap.get(E.dataId).id);const L=f.makeOutput(V,"float32");if(s.util.sizeFromShape(C.shape)!==0){const re=f.dataIdMap.get(L.dataId).id;I(v,K,re)}if(U&&f.disposeData(M.dataId),j){const re=s.backend_util.expandShapeToKeepDim(L.shape,F);L.shape=re}return C.dtype!=="float32"&&f.disposeData(E.dataId),L}const w={kernelName:s.Mean,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","./kernel_utils":"bvaRF","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hmNa0:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"minConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils"),h=n("./types");let I;function S(m){I=m.wasm.cwrap(s.Min,null,["number","number","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{axis:y,keepDims:j}=_,{x:r}=d,b=f.dataIdMap.get(r.dataId).id;let v=b,C=r;const{transposed:M,axes:P,originalAxes:F,inputWasTransposed:U}=(0,l.permuteAxesAndTranspose)(r,y,f);if(U){const L=f.dataIdMap.get(M.dataId).id;L!==b&&(C=M,v=L)}const T=C.shape.length;s.backend_util.assertAxesAreInnerMostDims("min",P,T);const[V,H]=s.backend_util.computeOutAndReduceShapes(C.shape,P),K=s.util.sizeFromShape(H),E=f.makeOutput(V,C.dtype);if(s.util.sizeFromShape(C.shape)!==0){const L=f.dataIdMap.get(E.dataId).id;I(v,h.CppDType[r.dtype],K,L)}if(U&&f.disposeData(M.dataId),j){const L=s.backend_util.expandShapeToKeepDim(E.shape,F);E.shape=L}return E}const w={kernelName:s.Min,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cN515:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"minimumConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Minimum,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],g4N8P:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"mirrorPadConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./types"),h;(function(m){m[m.reflect=0]="reflect",m[m.symmetric=1]="symmetric"})(h||(h={}));let I;function S(m){I=m.wasm.cwrap(s.MirrorPad,null,["number","array","number","number","array","array","number","number"])}function e(m){const{inputs:{x:f},backend:d,attrs:{paddings:_,mode:y}}=m,j=_.map((T,V)=>T[0]+f.shape[V]+T[1]),r=d.dataIdMap.get(f.dataId).id,b=d.makeOutput(j,f.dtype),v=d.dataIdMap.get(b.dataId).id,C=new Uint8Array(new Int32Array(f.shape).buffer),M=_.map(T=>T[0]),P=_.map(T=>T[1]),F=new Uint8Array(new Int32Array(M).buffer),U=new Uint8Array(new Int32Array(P).buffer);return I(r,C,f.shape.length,l.CppDType[f.dtype],F,U,h[y],v),b}const w={kernelName:s.MirrorPad,backendName:"wasm",kernelFunc:e,setupFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gXdfb:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"multinomial",()=>S),o.export(i,"multinomialConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Softmax");let h;function I(w){h=w.wasm.cwrap(s.Multinomial,null,["number","number","number","number","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{logits:_}=m,{numSamples:y,seed:j,normalized:r}=d;if(_.dtype!=="float32")throw new Error(`Tensor logits must have dtype float32, got ${_.dtype}`);const b=r?_:(0,l.softmax)({inputs:{logits:_},backend:f,attrs:{dim:_.shape.length-1}}),[v,C]=b.shape,M=f.makeOutput([v,y],"int32");return h(f.dataIdMap.get(b.dataId).id,v,C,y,j,f.dataIdMap.get(M.dataId).id),r||f.disposeData(b.dataId),M}const e={kernelName:s.Multinomial,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Softmax":"3nqRh","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3nqRh":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"softmax",()=>I),o.export(i,"softmaxConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Softmax,null,["number","number","number","number"])}function I(e){const{backend:w,inputs:{logits:m},attrs:{dim:f}}=e,d=w.dataIdMap.get(m.dataId).id,_=w.makeOutput(m.shape,m.dtype),y=w.dataIdMap.get(_.dataId).id,j=m.shape[f],r=s.util.sizeFromShape(m.shape)/j;return s.util.sizeFromShape(_.shape)===0||l(d,y,j,r),_}const S={kernelName:s.Softmax,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3y4Jw":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"modConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=(0,l.createBinaryKernelConfig)(s.Mod,!0)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"98fwB":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"multiplyConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.Multiply,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],atIMr:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"negConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Neg)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fMb6L:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"nonMaxSuppressionV3Config",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./NonMaxSuppression_util");let h;function I(w){h=w.wasm.cwrap(s.NonMaxSuppressionV3,"number",["number","number","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{iouThreshold:_,maxOutputSize:y,scoreThreshold:j}=d,{boxes:r,scores:b}=f,v=m.dataIdMap.get(r.dataId).id,C=m.dataIdMap.get(b.dataId).id,M=h(v,C,y,_,j),{pSelectedIndices:P,selectedSize:F,pSelectedScores:U,pValidOutputs:T}=(0,l.parseResultStruct)(m,M);return m.wasm._free(U),m.wasm._free(T),m.makeOutput([F],"int32",P)}const e={kernelName:s.NonMaxSuppressionV3,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hs22K:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"parseResultStruct",()=>s);function s(l,h){const I=new Int32Array(l.wasm.HEAPU8.buffer,h,4),S=I[0],e=I[1],w=I[2],m=I[3];return l.wasm._free(h),{pSelectedIndices:S,selectedSize:e,pSelectedScores:w,pValidOutputs:m}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6gLQs":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"nonMaxSuppressionV4Config",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./NonMaxSuppression_util");let h;function I(w){h=w.wasm.cwrap(s.NonMaxSuppressionV4,"number",["number","number","number","number","number","bool"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{iouThreshold:_,maxOutputSize:y,scoreThreshold:j,padToMaxOutputSize:r}=d,{boxes:b,scores:v}=f,C=m.dataIdMap.get(b.dataId).id,M=m.dataIdMap.get(v.dataId).id,P=h(C,M,y,_,j,r),{pSelectedIndices:F,selectedSize:U,pSelectedScores:T,pValidOutputs:V}=(0,l.parseResultStruct)(m,P);m.wasm._free(T);const H=m.makeOutput([U],"int32",F),K=m.makeOutput([],"int32",V);return[H,K]}const e={kernelName:s.NonMaxSuppressionV4,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kWIaw:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"nonMaxSuppressionV5Config",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./NonMaxSuppression_util");let h;function I(w){h=w.wasm.cwrap(s.NonMaxSuppressionV5,"number",["number","number","number","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{iouThreshold:_,maxOutputSize:y,scoreThreshold:j,softNmsSigma:r}=d,{boxes:b,scores:v}=f,C=m.dataIdMap.get(b.dataId).id,M=m.dataIdMap.get(v.dataId).id,P=h(C,M,y,_,j,r),{pSelectedIndices:F,selectedSize:U,pSelectedScores:T,pValidOutputs:V}=(0,l.parseResultStruct)(m,P);m.wasm._free(V);const H=m.makeOutput([U],"int32",F),K=m.makeOutput([U],"float32",T);return[H,K]}const e={kernelName:s.NonMaxSuppressionV5,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./NonMaxSuppression_util":"hs22K","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gE58W:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"notEqualConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.NotEqual,h,"bool")},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2auC5":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"oneHotConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.OneHot,null,["number","number","number","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{indices:d}=w,{dtype:_,depth:y,onValue:j,offValue:r}=f,b=m.makeOutput([...d.shape,y],_),v=m.dataIdMap.get(b.dataId).id,M=m.dataIdMap.get(d.dataId).id;return l(M,y,j,r,v),b}const S={kernelName:s.OneHot,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2C4KL":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"onesLikeConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:{x:S},backend:e}=I,w=e.makeOutput(S.shape,S.dtype);return e.typedArrayFromHeap(w).fill(1),w}const h={kernelName:s.OnesLike,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],anZaM:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"pack",()=>I),o.export(i,"packConfig",()=>S);var s=n("@tensorflow/tfjs-core"),l=n("./Concat"),h=n("./ExpandDims");function I(e){const{inputs:w,backend:m,attrs:f}=e,{axis:d}=f;if(w.length===1)return(0,h.expandDims)({inputs:{input:w[0]},backend:m,attrs:{dim:d}});const _=w[0].shape,y=w[0].dtype;w.forEach(v=>{s.util.assertShapesMatch(_,v.shape,"All tensors passed to stack must have matching shapes"),s.util.assert(y===v.dtype,()=>"All tensors passed to stack must have matching dtypes")});const j=[],r=w.map(v=>{const C=(0,h.expandDims)({inputs:{input:v},backend:m,attrs:{dim:d}});return j.push(C),C}),b=(0,l.concat)({inputs:r,backend:m,attrs:{axis:d}});return j.forEach(v=>m.disposeData(v.dataId)),b}const S={kernelName:s.Pack,backendName:"wasm",kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","./Concat":"gg3oU","./ExpandDims":"2OTFi","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jxDD1:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"padV2Config",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Fill"),h=n("./types");let I;function S(m){I=m.wasm.cwrap(s.PadV2,null,["number","array","number","number","array","array","number","number"])}function e(m){const{inputs:{x:f},backend:d,attrs:{paddings:_,constantValue:y}}=m,j=_.map((V,H)=>V[0]+f.shape[H]+V[1]);if(s.util.sizeFromShape(f.shape)===0)return(0,l.fill)({backend:d,attrs:{shape:j,value:y,dtype:f.dtype}});const r=d.dataIdMap.get(f.dataId).id,b=d.makeOutput(j,f.dtype),C=d.dataIdMap.get(b.dataId).id,M=new Uint8Array(new Int32Array(f.shape).buffer),P=_.map(V=>V[0]),F=_.map(V=>V[1]),U=new Uint8Array(new Int32Array(P).buffer),T=new Uint8Array(new Int32Array(F).buffer);return I(r,M,f.shape.length,h.CppDType[f.dtype],U,T,y,C),b}const w={kernelName:s.PadV2,backendName:"wasm",kernelFunc:e,setupFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Fill":"geiWD","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lSU1e:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"powConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!1,I=(0,l.createBinaryKernelConfig)(s.Pow,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"17lcP":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"preluConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Cast");let h;function I(w){h=w.wasm.cwrap(s.Prelu,null,["number","number","number"])}function S(w){const{inputs:m,backend:f}=w,{x:d,alpha:_}=m,y=f.dataIdMap.get(d.dataId).id,j=f.dataIdMap.get(_.dataId).id;let r=y;const b=d;let v=b;b.dtype!=="float32"&&(v=(0,l.cast)({backend:f,inputs:{x:d},attrs:{dtype:"float32"}}),r=f.dataIdMap.get(v.dataId).id);const C=f.makeOutput(d.shape,"float32"),M=f.dataIdMap.get(C.dataId).id;return h(r,j,M),b.dtype!=="float32"&&f.disposeData(v.dataId),C}const e={kernelName:s.Prelu,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cce5D:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"prodConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils"),h=n("./types");let I;function S(m){I=m.wasm.cwrap(s.Prod,null,["number","number","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{axis:y,keepDims:j}=_,{x:r}=d,b=f.dataIdMap.get(r.dataId).id;let v=b,C=r;const{transposed:M,axes:P,originalAxes:F,inputWasTransposed:U}=(0,l.permuteAxesAndTranspose)(r,y,f);let T=P;if(U){const L=f.dataIdMap.get(M.dataId).id;L!==b&&(C=M,v=L,T=s.backend_util.getInnerMostAxes(T.length,C.shape.length))}s.backend_util.assertAxesAreInnerMostDims("prod",T,C.shape.length);const[V,H]=s.backend_util.computeOutAndReduceShapes(C.shape,T),K=s.util.sizeFromShape(H),E=f.makeOutput(V,C.dtype);if(s.util.sizeFromShape(C.shape)!==0){const L=f.dataIdMap.get(E.dataId).id;I(v,K,h.CppDType[E.dtype],L)}if(U&&f.disposeData(M.dataId),j){const L=s.backend_util.expandShapeToKeepDim(E.shape,F);E.shape=L}return E}const w={kernelName:s.Prod,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j2Vlu:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"range",()=>h),o.export(i,"rangeConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");const h=S=>{const{backend:e,attrs:w}=S,{start:m,stop:f,step:d,dtype:_}=w,y=(0,l.rangeImplCPU)(m,f,d,_),j=e.makeOutput([y.length],_);return e.typedArrayFromHeap(j).set(y),j},I={kernelName:s.Range,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],Br6Ma:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"realDivConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.RealDiv,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ckWYc:[function(n,R,i){/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"reciprocalConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Reciprocal)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],YAD8N:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"reluConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Relu)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ecfwq:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"relu6Config",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Relu6)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hqU2G:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"resizeBilinearConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Cast");let h;function I(w){h=w.wasm.cwrap(s.ResizeBilinear,null,["number","number","number","number","number","number","number","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{images:_}=f,{alignCorners:y,halfPixelCenters:j,size:r}=d,[b,v]=r,[C,M,P,F]=_.shape,U=[C,b,v,F];let T=m.dataIdMap.get(_.dataId),V;T.dtype!=="float32"&&(V=(0,l.cast)({backend:m,inputs:{x:_},attrs:{dtype:"float32"}}),T=m.dataIdMap.get(V.dataId));const H=T.id,K=m.makeOutput(U,"float32");if(s.util.sizeFromShape(_.shape)===0)return K;const E=m.dataIdMap.get(K.dataId).id;return h(H,C,M,P,F,b,v,y?1:0,j?1:0,E),V!=null&&m.disposeData(V.dataId),K}const e={kernelName:s.ResizeBilinear,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6yngM":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"resizeBilinearGradConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Cast");let h;function I(w){h=w.wasm.cwrap(s.ResizeBilinearGrad,null,["number","number","number","array","array","boolean"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{images:_,dy:y}=m,{alignCorners:j}=d,r=f.makeOutput(_.shape,"float32");let b=f.dataIdMap.get(_.dataId),v;return b.dtype!=="float32"&&(v=(0,l.cast)({backend:f,inputs:{x:_},attrs:{dtype:"float32"}}),b=f.dataIdMap.get(v.dataId)),h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(y.dataId).id,f.dataIdMap.get(r.dataId).id,new Uint8Array(new Int32Array(_.shape).buffer),new Uint8Array(new Int32Array(y.shape).buffer),j),v!=null&&f.disposeData(v.dataId),r}const e={kernelName:s.ResizeBilinearGrad,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3xd1y":[function(n,R,i){/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"resizeNearestNeighborConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Cast");let h;function I(w){h=w.wasm.cwrap(s.ResizeNearestNeighbor,null,["number","number","number","number","number","number","number","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{images:_}=f,{alignCorners:y,halfPixelCenters:j,size:r}=d,[b,v]=r,[C,M,P,F]=_.shape,U=[C,b,v,F],T=m.makeOutput(U,"float32");if(s.util.sizeFromShape(_.shape)===0)return T;let V=m.dataIdMap.get(_.dataId),H;V.dtype!=="float32"&&(H=(0,l.cast)({backend:m,inputs:{x:_},attrs:{dtype:"float32"}}),V=m.dataIdMap.get(H.dataId));const K=V.id,E=m.dataIdMap.get(T.dataId).id;return h(K,C,M,P,F,b,v,y?1:0,j?1:0,E),H!=null&&m.disposeData(H.dataId),T}const e={kernelName:s.ResizeNearestNeighbor,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dEWoe:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"resizeNearestNeighborGradConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./Cast");let h;function I(w){h=w.wasm.cwrap(s.ResizeNearestNeighborGrad,null,["number","number","number","array","array","boolean"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{images:_,dy:y}=m,{alignCorners:j}=d,r=f.makeOutput(_.shape,"float32");let b=f.dataIdMap.get(_.dataId),v;return b.dtype!=="float32"&&(v=(0,l.cast)({backend:f,inputs:{x:_},attrs:{dtype:"float32"}}),b=f.dataIdMap.get(v.dataId)),h(f.dataIdMap.get(_.dataId).id,f.dataIdMap.get(y.dataId).id,f.dataIdMap.get(r.dataId).id,new Uint8Array(new Int32Array(_.shape).buffer),new Uint8Array(new Int32Array(y.shape).buffer),j),v!=null&&f.disposeData(v.dataId),r}const e={kernelName:s.ResizeNearestNeighborGrad,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Cast":"bGPlI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],h8p0f:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"reverse",()=>e),o.export(i,"reverseConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Identity"),h=n("./Reshape");let I;function S(m){I=m.wasm.cwrap(s.Reverse,null,["number","array","number","array","number","number"])}function e(m){const{inputs:f,backend:d,attrs:_}=m,{x:y}=f,{dims:j}=_,r=s.util.parseAxisParam(j,y.shape);if(y.shape.length===0)return(0,l.identity)({inputs:{x:y},backend:d});const b=d.makeOutput(y.shape,y.dtype),v=d.dataIdMap.get(y.dataId).id,C=d.dataIdMap.get(b.dataId).id,M=new Uint8Array(new Int32Array(r).buffer),P=new Uint8Array(new Int32Array(y.shape).buffer);I(v,M,r.length,P,y.shape.length,C);const F=(0,h.reshape)({inputs:{x:b},attrs:{shape:y.shape},backend:d});return d.disposeData(b.dataId),F}const w={kernelName:s.Reverse,backendName:"wasm",kernelFunc:e,setupFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./Identity":"j2v3m","./Reshape":"carA0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9Dmog":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"rotateWithOffset",()=>I),o.export(i,"rotateWithOffsetConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.RotateWithOffset,null,["number","number","number","number","number","number","number","number","array","number","number"])}function I(e){const{inputs:w,backend:m,attrs:f}=e,{image:d}=w,{radians:_,fillValue:y,center:j}=f,r=m.makeOutput(d.shape,d.dtype),b=m.dataIdMap.get(d.dataId).id,v=m.dataIdMap.get(r.dataId).id,[C,M,P,F]=d.shape,[U,T]=s.backend_util.getImageCenter(j,M,P),V=y===0,H=255,K=typeof y=="number"?[y,y,y,V?0:H]:[...y,H],E=new Uint8Array(new Int32Array(K).buffer);return l(b,C,M,P,F,_,U,T,E,K.length,v),r}const S={kernelName:s.RotateWithOffset,backendName:"wasm",kernelFunc:I,setupFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"49MFW":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"roundConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Round)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7tjno":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"rsqrtConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Rsqrt)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1FCGT":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"scatterNdConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.ScatterNd,null,["number","number","number","number","number","number","array","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{indices:_,updates:y}=f,{shape:j}=d,r=m.makeOutput(j,y.dtype);if(s.util.sizeFromShape(j)===0)return r;const{sliceRank:b,numUpdates:v,sliceSize:C,strides:M,outputSize:P}=s.scatter_util.calculateShapes(y,_,j),U=m.dataIdMap.get(_.dataId).id,V=m.dataIdMap.get(y.dataId).id,H=new Uint8Array(new Int32Array(M).buffer),K=m.dataIdMap.get(r.dataId).id;return h(U,V,l.CppDType[y.dtype],b,v,C,H,P,K),r}const e={kernelName:s.ScatterNd,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kWH8o:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"searchSortedConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.SearchSorted,null,["number","number","number","number","number","number","bool","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{sortedSequence:_,values:y}=m,{side:j}=d;if(_.dtype!==y.dtype)throw new Error(`SearchSorted error: sorted_sequence must have the same dtype as values. Got ${_.dtype} and ${y.dtype}`);const r=f.makeOutput(y.shape,"int32");function b(v){return f.dataIdMap.get(v.dataId).id}return h(b(_),b(y),_.shape[0],_.shape[1],y.shape[1],l.CppDType[_.dtype],j==="left",b(r)),r}const e={kernelName:s.SearchSorted,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jCsx6:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"selectConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap("SelectV2",null,["number","number","number","number","number"])}function I(e){const{inputs:w,backend:m}=e,{condition:f,t:d,e:_}=w,y=m.dataIdMap.get(f.dataId).id,j=m.dataIdMap.get(d.dataId).id,r=m.dataIdMap.get(_.dataId).id,b=m.makeOutput(d.shape,d.dtype),v=m.dataIdMap.get(b.dataId).id,C=f.shape.length,M=d.shape.length,P=C===0||C>1||M===1?1:s.util.sizeFromShape(d.shape.slice(1));return l(y,j,r,P,v),b}const S={kernelName:s.Select,backendName:"wasm",kernelFunc:I,setupFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jgpnu:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"seluConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Selu)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4QdGq":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sigmoidConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Sigmoid,null,["number","number"])}function I(e){const{backend:w,inputs:{x:m}}=e,f=w.dataIdMap.get(m.dataId).id,d=w.makeOutput(m.shape,m.dtype),_=w.dataIdMap.get(d.dataId).id;return s.util.sizeFromShape(d.shape)===0||l(f,_),d}const S={kernelName:"Sigmoid",backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8oasS":[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"signConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Sign)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hJMTy:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sinConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Sin)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fpizJ:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sinhConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Sinh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dHbD1:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"softplusConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Softplus)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5gV7j":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"spaceToBatchNDConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./PadV2"),h=n("./Reshape"),I=n("./Transpose");function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_}=m,{blockShape:y,paddings:j}=d,r=s.util.sizeFromShape(y),b=[[0,0]];b.push(...j);for(let ne=1+y.length;ne<_.shape.length;++ne)b.push([0,0]);const v=l.padV2Config.kernelFunc({inputs:{x:_},backend:f,attrs:{paddings:b,constantValue:0}}),C=s.backend_util.getReshaped(v.shape,y,r,!1),M=s.backend_util.getPermuted(C.length,y.length,!1),P=s.backend_util.getReshapedPermuted(v.shape,y,r,!1),F={x:v},U={shape:C},T=(0,h.reshape)({inputs:F,backend:f,attrs:U}),V={x:T},H={perm:M},K=(0,I.transpose)({inputs:V,backend:f,attrs:H}),E={x:K},L={shape:P},re=(0,h.reshape)({inputs:E,backend:f,attrs:L});return f.disposeData(v.dataId),f.disposeData(T.dataId),f.disposeData(K.dataId),re}const e={kernelName:s.SpaceToBatchND,backendName:"wasm",kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./PadV2":"jxDD1","./Reshape":"carA0","./Transpose":"af8LA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jrzyQ:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"setup",()=>S),o.export(i,"sparseFillEmptyRows",()=>e),o.export(i,"sparseFillEmptyRowsConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Slice"),h=n("./types");let I;function S(m){I=m.wasm.cwrap("SparseFillEmptyRows","number",["number","number","number","number","number","number","number","number","number","number","number","number"])}function e(m){const{backend:f,inputs:d}=m,{indices:_,values:y,denseShape:j,defaultValue:r}=d,b=_.shape[0],v=_.shape[1],C=f.readSync(j.dataId)[0],M=[b+C,v],P=f.dataIdMap.get(_.dataId).id,F=f.dataIdMap.get(y.dataId).id,U=f.dataIdMap.get(r.dataId).id,T=f.makeOutput(M,_.dtype),V=f.dataIdMap.get(T.dataId).id,H=f.makeOutput(M.slice(0,1),y.dtype),K=f.dataIdMap.get(H.dataId).id,E=f.makeOutput([C],"bool"),L=f.dataIdMap.get(E.dataId).id,re=f.makeOutput([b],_.dtype),ne=f.dataIdMap.get(re.dataId).id,oe=f.makeOutput([4],"int32"),he=f.dataIdMap.get(oe.dataId).id,be=I(P,F,h.CppDType[y.dtype],b,C,v,U,V,K,L,ne,he),ve=f.readSync(oe.dataId);let ke;switch(ve[0]){case 1:ke=s.backend_util.getSparseFillEmptyRowsIndicesDenseShapeMismatch(ve[1]);break;case 2:ke=s.backend_util.getSparseFillEmptyRowsNegativeIndexErrorMessage(ve[1],ve[2]);break;case 3:ke=s.backend_util.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(ve[1],ve[2],ve[3]);break;default:ke=""}if(f.disposeData(oe.dataId),ke)throw f.disposeData(T.dataId),f.disposeData(H.dataId),f.disposeData(E.dataId),f.disposeData(re.dataId),new Error(ke);let We=T,rt=H;return be!==M[0]&&(We=(0,l.slice)({inputs:{x:T},attrs:{begin:0,size:[be,v]},backend:f}),rt=(0,l.slice)({inputs:{x:H},attrs:{begin:0,size:be},backend:f}),f.disposeData(T.dataId),f.disposeData(H.dataId)),[We,rt,E,re]}const w={kernelName:s.SparseFillEmptyRows,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"59PNO":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sparseReshapeConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.SparseReshape,null,["number","number","number","number","number","number","number"])}function I(e){const{backend:w,inputs:m}=e,{inputIndices:f,inputShape:d,newShape:_}=m;if(f.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape
        ${f.shape}`);if(d.shape.length!==1)throw new Error(`Input shape should be a vector but received shape
        ${d.shape}`);if(_.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${_.shape}`);const y=w.dataIdMap.get(f.dataId).id,j=w.dataIdMap.get(d.dataId).id,r=w.dataIdMap.get(_.dataId).id,b=f.shape[0],v=s.util.sizeFromShape(_.shape),C=w.makeOutput([b,v],f.dtype),M=w.dataIdMap.get(C.dataId).id,P=w.makeOutput([v],_.dtype),F=w.dataIdMap.get(P.dataId).id,U=w.makeOutput([3],"int32"),T=w.dataIdMap.get(U.dataId).id;l(y,j,r,b,M,F,T);const V=w.readSync(U.dataId);let H;switch(V[0]){case 0:H=s.backend_util.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(V[1],V[2]);break;case 1:H=s.backend_util.getSparseReshapeNegativeOutputDimErrorMessage(V[1],V[2]);break;case 2:H=s.backend_util.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage();break;case 3:{const K=Array.from(w.readSync(d.dataId)),E=Array.from(w.readSync(P.dataId));H=s.backend_util.getSparseReshapeInputOutputMultipleErrorMessage(K,E);break}case 4:{const K=Array.from(w.readSync(d.dataId)),E=Array.from(w.readSync(P.dataId));H=s.backend_util.getSparseReshapeInputOutputMismatchErrorMessage(K,E);break}default:H=""}if(w.disposeData(U.dataId),H)throw w.disposeData(C.dataId),w.disposeData(P.dataId),new Error(H);return[C,P]}const S={kernelName:s.SparseReshape,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eDnJR:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sparseSegmentMeanConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./SparseSegmentReduction");function h(S){return(0,l.sparseSegmentReduction)(S,!0)}const I={kernelName:s.SparseSegmentMean,backendName:"wasm",setupFunc:l.setup,kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","./SparseSegmentReduction":"gnL8M","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gnL8M:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"setup",()=>I),o.export(i,"sparseSegmentReduction",()=>S);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(e){h=e.wasm.cwrap("SparseSegmentReduction",null,["number","number","number","number","number","number","number","number","number"])}function S(e,w){const{backend:m,inputs:f}=e,{data:d,indices:_,segmentIds:y}=f,j=_.shape[0],r=m.readSync(y.dataId,j-1,j)[0],v=j>0?r+1:0;if(v<0)throw new Error(s.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());const C=d.shape.slice();C[0]=v;const M=m.dataIdMap.get(d.dataId).id,P=m.dataIdMap.get(_.dataId).id,F=m.dataIdMap.get(y.dataId).id,U=m.makeOutput(C,d.dtype),T=m.dataIdMap.get(U.dataId).id,V=m.makeOutput([4],"int32"),H=m.dataIdMap.get(V.dataId).id;h(M,l.CppDType[d.dtype],d.shape[0],P,F,T,H,w,0);const K=m.readSync(V.dataId);let E;switch(K[0]){case 0:E=s.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage();break;case 1:E=s.backend_util.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage();break;case 2:E=s.backend_util.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(K[1],K[2]);break;case 3:E=s.backend_util.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(K[1],K[2],K[3]);break;default:E=""}if(m.disposeData(V.dataId),E)throw m.disposeData(U.dataId),new Error(E);return U}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jwNwx:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sparseSegmentSumConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./SparseSegmentReduction");function h(S){return(0,l.sparseSegmentReduction)(S,!1)}const I={kernelName:s.SparseSegmentSum,backendName:"wasm",setupFunc:l.setup,kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","./SparseSegmentReduction":"gnL8M","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7nC5M":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sparseToDenseConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.SparseToDense,null,["number","number","number","number","number","number","number","number","array","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{sparseIndices:_,sparseValues:y,defaultValue:j}=f,{outputShape:r}=d,b=m.makeOutput(r,j.dtype);if(s.util.sizeFromShape(r)===0)return b;const{sliceRank:v,numUpdates:C,sliceSize:M,strides:P,outputSize:F}=s.backend_util.calculateShapes(y,_,r),U=m.dataIdMap.get(_.dataId).id,T=m.dataIdMap.get(y.dataId).id,V=m.dataIdMap.get(j.dataId).id,H=new Uint8Array(new Int32Array(P).buffer),K=m.dataIdMap.get(b.dataId).id;return h(U,T,y.shape.length,V,l.CppDType[j.dtype],v,C,M,H,F,K),b}const e={kernelName:s.SparseToDense,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kpanS:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"splitV",()=>h),o.export(i,"splitVConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./Slice");function h(S){const{inputs:e,attrs:w,backend:m}=S,{x:f}=e,{numOrSizeSplits:d,axis:_}=w,y=s.util.parseAxisParam(_,f.shape)[0],j=s.backend_util.prepareSplitSize(f,d,y),r=new Array(f.shape.length).fill(0),b=f.shape.slice();return j.map(v=>{const C=[...b];C[y]=v;const M=(0,l.slice)({inputs:{x:f},attrs:{begin:r,size:C},backend:m});return r[y]+=v,M})}const I={kernelName:s.SplitV,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7Bfb4":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sqrtConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Sqrt)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4eqUw":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"squareConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Square)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3xMkV":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"squaredDifferenceConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.SquaredDifference,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],b4iTq:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"stepConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Step,null,["number","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{alpha:_}=d,{x:y}=f,j=m.dataIdMap.get(y.dataId).id,r=m.makeOutput(y.shape,y.dtype),b=m.dataIdMap.get(r.dataId).id;return h(j,_,l.CppDType[y.dtype],b),r}const e={kernelName:s.Step,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2nai6":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"stridedSlice",()=>e),o.export(i,"stridedSliceConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./Reshape"),h=n("./Slice");let I;function S(m){I=m.wasm.cwrap(s.StridedSlice,null,["number","array","number","array","array","array","array","array","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{x:y}=d,{begin:j,end:r,strides:b,beginMask:v,endMask:C,ellipsisMask:M,newAxisMask:P,shrinkAxisMask:F}=_,{finalShapeSparse:U,finalShape:T,isIdentity:V,sliceDim0:H,isSimpleSlice:K,begin:E,end:L,strides:re}=s.slice_util.sliceInfo(y.shape,j,r,b,v,C,M,P,F);let ne;if(V)ne=(0,l.reshape)({inputs:{x:y},backend:f,attrs:{shape:T}});else if(H||K){s.util.assert(y.shape.length>=1,()=>`Input must have rank at least 1, got: ${y.shape.length}`);const oe=s.slice_util.computeOutShape(E,L,re),he=(0,h.slice)({inputs:{x:y},backend:f,attrs:{begin:E,size:oe}});ne=(0,l.reshape)({inputs:{x:he},backend:f,attrs:{shape:T}}),f.disposeData(he.dataId)}else{const oe=f.makeOutput(U,"float32"),he=f.dataIdMap.get(y.dataId).id,be=new Uint8Array(new Int32Array(s.util.computeStrides(y.shape)).buffer),ve=new Uint8Array(new Int32Array(E).buffer),ke=new Uint8Array(new Int32Array(L).buffer),We=new Uint8Array(new Int32Array(re).buffer),rt=new Uint8Array(new Int32Array(U).buffer),X=new Uint8Array(new Int32Array(s.util.computeStrides(U)).buffer),q=f.dataIdMap.get(oe.dataId).id;I(he,be,y.shape.length,ve,ke,We,rt,X,U.length,q),ne=(0,l.reshape)({inputs:{x:oe},backend:f,attrs:{shape:T}}),f.disposeData(oe.dataId)}return ne}const w={kernelName:s.StridedSlice,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./Reshape":"carA0","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9jOel":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"stringNGramsConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");function h(S){const{backend:e,inputs:w,attrs:m}=S,{data:f,dataSplits:d}=w,{separator:_,nGramWidths:y,leftPad:j,rightPad:r,padWidth:b,preserveShortSequences:v}=m,C=e.readSync(f.dataId),M=e.readSync(d.dataId),[P,F]=(0,l.stringNGramsImplCPU)(C,M,_,y,j,r,b,v),U=e.makeOutput([P.length],"string"),T=e.dataIdMap.get(U.dataId);T.stringBytes=P;const V=e.makeOutput(d.shape,"int32");return e.typedArrayFromHeap(V).set(F),[U,V]}const I={kernelName:s.StringNGrams,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8DZyo":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"stringSplitConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");function h(S){const{backend:e,inputs:w,attrs:m}=S,{input:f,delimiter:d}=w,{skipEmpty:_}=m,y=e.readSync(f.dataId),j=e.readSync(d.dataId),[r,b,v]=(0,l.stringSplitImplCPU)(y,j[0],_),C=b.length,M=e.makeOutput([C,2],"int32");e.typedArrayFromHeap(M).set(r);const F=e.makeOutput([C],"string"),U=e.dataIdMap.get(F.dataId);U.stringBytes=b;const T=e.makeOutput([2],"int32");return e.typedArrayFromHeap(T).set(v),[M,F,T]}const I={kernelName:s.StringSplit,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"62PSK":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"stringToHashBucketFastConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");function h(S){const{backend:e,inputs:w,attrs:m}=S,{input:f}=w,{numBuckets:d}=m,_=e.readSync(f.dataId),y=(0,l.stringToHashBucketFastImplCPU)(_,d),j=e.makeOutput(f.shape,"int32");return e.typedArrayFromHeap(j).set(y),j}const I={kernelName:s.StringToHashBucketFast,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],auNTX:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"subConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./binary_kernel");const h=!0,I=(0,l.createBinaryKernelConfig)(s.Sub,h)},{"@tensorflow/tfjs-core":"fqGP4","./binary_kernel":"6tYNr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],itfOR:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"sumConfig",()=>w);var s=n("@tensorflow/tfjs-core"),l=n("./kernel_utils"),h=n("./types");let I;function S(m){I=m.wasm.cwrap(s.Sum,null,["number","number","number","number"])}function e(m){const{backend:f,inputs:d,attrs:_}=m,{axis:y,keepDims:j}=_,{x:r}=d,b=f.dataIdMap.get(r.dataId).id;let v=b,C=r;const{transposed:M,axes:P,originalAxes:F,inputWasTransposed:U}=(0,l.permuteAxesAndTranspose)(r,y,f);let T=P;if(U){const L=f.dataIdMap.get(M.dataId).id;L!==b&&(C=M,v=L,T=s.backend_util.getInnerMostAxes(T.length,C.shape.length))}s.backend_util.assertAxesAreInnerMostDims("sum",T,C.shape.length);const[V,H]=s.backend_util.computeOutAndReduceShapes(C.shape,T),K=s.util.sizeFromShape(H),E=f.makeOutput(V,C.dtype);if(s.util.sizeFromShape(C.shape)!==0){const L=f.dataIdMap.get(E.dataId).id;I(v,K,h.CppDType[E.dtype],L)}if(U&&f.disposeData(M.dataId),j){const L=s.backend_util.expandShapeToKeepDim(E.shape,F);E.shape=L}return E}const w={kernelName:s.Sum,backendName:"wasm",setupFunc:S,kernelFunc:e}},{"@tensorflow/tfjs-core":"fqGP4","./kernel_utils":"bvaRF","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2BnQa":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"tanConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Tan)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"92eBX":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"tanhConfig",()=>h);var s=n("@tensorflow/tfjs-core"),l=n("./unary_kernel");const h=(0,l.createUnaryKernelConfig)(s.Tanh)},{"@tensorflow/tfjs-core":"fqGP4","./unary_kernel":"iAt0j","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lsnnq:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"tensorScatterUpdateConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.TensorScatterUpdate,null,["number","number","number","number","number","number","array","number","number","number"])}function S(w){const{backend:m,inputs:f,attrs:d}=w,{tensor:_,indices:y,updates:j}=f,{}=d,r=m.makeOutput(_.shape,_.dtype);if(s.util.sizeFromShape(_.shape)===0)return r;const{sliceRank:b,numUpdates:v,sliceSize:C,strides:M,outputSize:P}=s.scatter_util.calculateShapes(j,y,_.shape),U=m.dataIdMap.get(y.dataId).id,V=m.dataIdMap.get(j.dataId).id,K=m.dataIdMap.get(_.dataId).id,E=new Uint8Array(new Int32Array(M).buffer),L=m.dataIdMap.get(r.dataId).id;return h(U,V,l.CppDType[j.dtype],b,v,C,E,P,L,K),r}const e={kernelName:s.TensorScatterUpdate,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9dHgQ":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"tileConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.Tile,null,["number","array","number","array","number","number"])}function S(w){const{inputs:m,backend:f,attrs:d}=w,{x:_}=m,y=f.dataIdMap.get(_.dataId).id,{reps:j}=d,r=new Array(_.shape.length);for(let P=0;P<r.length;P++)r[P]=_.shape[P]*j[P];const b=new Uint8Array(new Int32Array(_.shape).buffer),v=new Uint8Array(new Int32Array(r).buffer),C=f.makeOutput(r,_.dtype),M=f.dataIdMap.get(C.dataId).id;return h(y,b,_.shape.length,v,r.length,l.CppDType[C.dtype],M),C}const e={kernelName:s.Tile,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3N5sa":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"topk",()=>S),o.export(i,"topKConfig",()=>e);var s=n("@tensorflow/tfjs-core"),l=n("./types");let h;function I(w){h=w.wasm.cwrap(s.TopK,null,["number","array","number","number","number","bool","number","number"])}const S=({inputs:w,backend:m,attrs:f})=>{const{x:d}=w,{k:_,sorted:y}=f,j=m.dataIdMap.get(d.dataId).id,r=new Uint8Array(new Int32Array(d.shape).buffer),b=d.shape.slice();b[b.length-1]=_;const v=m.makeOutput(b,d.dtype),C=m.dataIdMap.get(v.dataId).id,M=m.makeOutput(b,"int32"),P=m.dataIdMap.get(M.dataId).id;return h(j,r,d.shape.length,l.CppDType[d.dtype],_,y,C,P),[v,M]},e={kernelName:s.TopK,backendName:"wasm",setupFunc:I,kernelFunc:S}},{"@tensorflow/tfjs-core":"fqGP4","./types":"3tWYo","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"73Gmi":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"transformConfig",()=>S);var s=n("@tensorflow/tfjs-core");let l;function h(e){l=e.wasm.cwrap(s.Transform,null,["number","number","bool","number","number","number","number","number","number","array","number","array","number","number","number","number","number"])}function I(e){const{backend:w,inputs:m,attrs:f}=e,{image:d,transforms:_}=m,{interpolation:y,fillMode:j,fillValue:r,outputShape:b}=f,[v,C,M,P]=d.shape,[F,U]=b??[C,M],T=[v,F,U,P],V=new Uint8Array(new Int32Array(s.util.computeStrides(d.shape)).buffer),H=new Uint8Array(new Int32Array(s.util.computeStrides(T)).buffer),K=w.makeOutput(T,d.dtype),E=w.dataIdMap.get(K.dataId).id,re=w.dataIdMap.get(d.dataId).id,oe=w.dataIdMap.get(_.dataId).id,he=y==="nearest"?1:2;let be;switch(j){case"constant":be=1;break;case"reflect":be=2;break;case"wrap":be=3;break;case"nearest":be=4;break;default:be=1;break}return l(re,oe,_.shape[0]>1,v,F,U,P,M,C,V,d.shape.length-1,H,T.length-1,he,be,r,E),K}const S={kernelName:s.Transform,backendName:"wasm",setupFunc:h,kernelFunc:I}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],b1RSn:[function(n,R,i){/**
 * @license
 * Copyright 2023 Google LLC.
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"uniqueConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("../kernel_utils/shared");function h(S){const{inputs:e,attrs:w,backend:m}=S,{axis:f}=w,{x:d}=e,{outputValues:_,outputShape:y,indices:j}=(0,l.uniqueImplCPU)(m.readSync(d.dataId),f,d.shape,d.dtype);return[m.makeOutput(y,d.dtype,void 0,_),m.makeOutput([j.length],"int32",void 0,j)]}const I={kernelName:s.Unique,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","../kernel_utils/shared":"gOlqM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eRN3n:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"unpackConfig",()=>I);var s=n("@tensorflow/tfjs-core"),l=n("./Slice");function h(S){const{inputs:e,backend:w,attrs:m}=S,{value:f}=e;let{axis:d}=m;d<0&&(d+=f.shape.length);const _=f.shape[d],y=f.shape.length,j=new Array(y-1);let r=0;for(let M=0;M<y;M++)M!==d&&(j[r++]=f.shape[M]);const b=new Array(_),v=new Array(y).fill(0),C=f.shape.slice();C[d]=1;for(let M=0;M<b.length;M++)v[d]=M,b[M]=(0,l.slice)({inputs:{x:f},attrs:{begin:v,size:C},backend:w});return b.map(({dataId:M,dtype:P})=>({dataId:M,dtype:P,shape:j}))}const I={kernelName:s.Unpack,backendName:"wasm",kernelFunc:h}},{"@tensorflow/tfjs-core":"fqGP4","./Slice":"fC7Xk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e67PN:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"zerosLikeConfig",()=>h);var s=n("@tensorflow/tfjs-core");function l(I){const{inputs:{x:S},backend:e}=I,w=e.makeOutput(S.shape,S.dtype);return e.typedArrayFromHeap(w).fill(0),w}const h={kernelName:s.ZerosLike,backendName:"wasm",kernelFunc:l}},{"@tensorflow/tfjs-core":"fqGP4","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"24GdS":[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"BackendWasm",()=>h.BackendWasm),o.export(i,"getThreadsCount",()=>h.getThreadsCount),o.export(i,"setThreadsCount",()=>h.setThreadsCount),o.export(i,"setWasmPath",()=>h.setWasmPath),o.export(i,"setWasmPaths",()=>h.setWasmPaths),o.export(i,"version_wasm",()=>I.version);var s=n("./flags_wasm"),l=n("@tensorflow/tfjs-core"),h=n("./backend_wasm"),I=n("./version");const S=2;(0,l.registerBackend)("wasm",async()=>{const{wasm:e}=await(0,h.init)();return new h.BackendWasm(e)},S)},{"./flags_wasm":"lbvcn","@tensorflow/tfjs-core":"fqGP4","./backend_wasm":"a0163","./version":"gZXkh","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lbvcn:[function(n,R,i){/**
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
 */var o=n("@tensorflow/tfjs-core");const s=(0,o.env)();s.registerFlag("WASM_HAS_SIMD_SUPPORT",async()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]))}catch{return!1}}),s.registerFlag("WASM_HAS_MULTITHREAD_SUPPORT",async()=>{if(s.get("IS_NODE"))return!1;try{return new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}})},{"@tensorflow/tfjs-core":"fqGP4"}],a0163:[function(n,R,i){/**
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
 */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"BackendWasm",()=>m),o.export(i,"init",()=>_),o.export(i,"setWasmPath",()=>P),o.export(i,"setWasmPaths",()=>F),o.export(i,"resetWasmPath",()=>U),o.export(i,"setThreadsCount",()=>H),o.export(i,"getThreadsCount",()=>K);var s=n("./flags_wasm"),l=n("@tensorflow/tfjs-core"),h=n("../wasm-out/tfjs-backend-wasm-threaded-simd.js"),I=n("../wasm-out/tfjs-backend-wasm-threaded-simd.worker.js"),S=n("../wasm-out/tfjs-backend-wasm.js");const e=h.default||h,w=S.default||S;class m extends l.KernelBackend{constructor(L){super();this.wasm=L,this.dataIdNextNumber=1,this.wasm.tfjs.initWithThreadsCount(T),V=this.wasm.tfjs.getThreadsCount(),this.dataIdMap=new l.DataStorage(this,(0,l.engine)())}write(L,re,ne){const oe={id:this.dataIdNextNumber++};return this.move(oe,L,re,ne,1),oe}numDataIds(){return this.dataIdMap.numDataIds()}async time(L){const re=l.util.now();return L(),{kernelMs:l.util.now()-re}}move(L,re,ne,oe,he){const be=this.dataIdNextNumber++;if(oe==="string"){const rt=re;this.dataIdMap.set(L,{id:be,stringBytes:rt,shape:ne,dtype:oe,memoryOffset:null,refCount:he});return}const ve=l.util.sizeFromShape(ne),ke=ve*l.util.bytesPerElement(oe),We=this.wasm._malloc(ke)>>>0;this.dataIdMap.set(L,{id:be,memoryOffset:We,shape:ne,dtype:oe,refCount:he}),this.wasm.tfjs.registerTensor(be,ve,We),re!=null&&this.wasm.HEAPU8.set(new Uint8Array(re.buffer,re.byteOffset,ke),We)}async read(L){return this.readSync(L)}readSync(L,re,ne){const{memoryOffset:oe,dtype:he,shape:be,stringBytes:ve}=this.dataIdMap.get(L);if(he==="string")return(re==null||re===0)&&(ne==null||ne>=ve.length)?ve:ve.slice(re,ne);re=re||0,ne=ne||l.util.sizeFromShape(be);const ke=l.util.bytesPerElement(he),We=this.wasm.HEAPU8.slice(oe+re*ke,oe+ne*ke);return y(We.buffer,he)}disposeData(L,re=!1){if(this.dataIdMap.has(L)){const ne=this.dataIdMap.get(L);if(ne.refCount--,!re&&ne.refCount>0)return!1;this.wasm._free(ne.memoryOffset),this.wasm.tfjs.disposeData(ne.id),this.dataIdMap.delete(L)}return!0}refCount(L){return this.dataIdMap.has(L)?this.dataIdMap.get(L).refCount:0}incRef(L){const re=this.dataIdMap.get(L);re!=null&&re.refCount++}floatPrecision(){return 32}getMemoryOffset(L){return this.dataIdMap.get(L).memoryOffset}dispose(){this.wasm.tfjs.dispose(),"PThread"in this.wasm&&this.wasm.PThread.terminateAllThreads(),this.wasm=null}memory(){return{unreliable:!1}}makeOutput(L,re,ne,oe){let he;if(ne==null)he=this.write(oe??null,L,re);else{const be=this.dataIdNextNumber++;he={id:be},this.dataIdMap.set(he,{id:be,memoryOffset:ne,shape:L,dtype:re,refCount:1});const ve=l.util.sizeFromShape(L);this.wasm.tfjs.registerTensor(be,ve,ne)}return{dataId:he,shape:L,dtype:re}}typedArrayFromHeap({shape:L,dtype:re,dataId:ne}){const oe=this.wasm.HEAPU8.buffer,{memoryOffset:he}=this.dataIdMap.get(ne),be=l.util.sizeFromShape(L);switch(re){case"float32":return new Float32Array(oe,he,be);case"int32":return new Int32Array(oe,he,be);case"bool":return new Uint8Array(oe,he,be);default:throw new Error(`Unknown dtype ${re}`)}}}function f(E){return(L,re)=>(l.util.fetch(E,{credentials:"same-origin"}).then(ne=>{ne.ok||L.env.a(`failed to load wasm binary file at '${E}'`),ne.arrayBuffer().then(oe=>{WebAssembly.instantiate(oe,L).then(he=>{re(he.instance,he.module)})})}),{})}function d(E,L,re){if(r!=null)return r;let ne="tfjs-backend-wasm.wasm";return E&&L?ne="tfjs-backend-wasm-threaded-simd.wasm":E&&(ne="tfjs-backend-wasm-simd.wasm"),v!=null&&v[ne]!=null?v[ne]:re+ne}async function _(){const[E,L]=await Promise.all([(0,l.env)().getAsync("WASM_HAS_SIMD_SUPPORT"),(0,l.env)().getAsync("WASM_HAS_MULTITHREAD_SUPPORT")]);return new Promise((re,ne)=>{const oe={};oe.locateFile=(ve,ke)=>{if(ve.endsWith(".worker.js")){const We=I.wasmWorkerContents.replace(/\n/g,"\\n"),rt=new Blob([We],{type:"application/javascript"});return URL.createObjectURL(rt)}return ve.endsWith(".wasm")?d(E,L,b??ke):ke+ve},M&&(oe.instantiateWasm=f(d(E,L,b??"")));let he=!1;oe.onAbort=()=>{if(he||C)return;C=!0,ne({message:"Make sure the server can serve the `.wasm` file relative to the bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers"})};let be;L&&E&&r==null?(oe.mainScriptUrlOrBlob=new Blob(["var WasmBackendModuleThreadedSimd = "+e.toString()],{type:"text/javascript"}),be=e(oe)):be=w(oe),be.then(ve=>{he=!0,C=!1;const ke=null;ve.tfjs={init:ve.cwrap("init",null,[]),initWithThreadsCount:ve.cwrap("init_with_threads_count",null,["number"]),getThreadsCount:ve.cwrap("get_threads_count","number",[]),registerTensor:ve.cwrap("register_tensor",null,["number","number","number"]),disposeData:ve.cwrap("dispose_data",ke,["number"]),dispose:ve.cwrap("dispose",ke,[])},re({wasm:ve})}).catch(ne)})}function y(E,L){switch(L){case"float32":return new Float32Array(E);case"int32":return new Int32Array(E);case"bool":return new Uint8Array(E);default:throw new Error(`Unknown dtype ${L}`)}}const j=["tfjs-backend-wasm.wasm","tfjs-backend-wasm-simd.wasm","tfjs-backend-wasm-threaded-simd.wasm"];let r=null,b=null,v={},C=!1,M=!1;function P(E,L=!1){if((0,l.deprecationWarn)("setWasmPath has been deprecated in favor of setWasmPaths and will be removed in a future release."),C)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`");r=E,M=L}function F(E,L=!1){if(C)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPaths()` before you call `tf.setBackend()` or `tf.ready()`");if(typeof E=="string")b=E;else{v=E;const re=j.filter(ne=>v[ne]==null);if(re.length>0)throw new Error(`There were no entries found for the following binaries: ${re.join(",")}. Please either call setWasmPaths with a map providing a path for each binary, or with a string indicating the directory where all the binaries can be found.`)}M=L}function U(){r=null,b=null,v={},M=!1,C=!1}let T=-1,V=-1;function H(E){T=E}function K(){if(V===-1)throw new Error("WASM backend not initialized.");return V}},{"./flags_wasm":"lbvcn","@tensorflow/tfjs-core":"fqGP4","../wasm-out/tfjs-backend-wasm-threaded-simd.js":"gDXL8","../wasm-out/tfjs-backend-wasm-threaded-simd.worker.js":"bpcnH","../wasm-out/tfjs-backend-wasm.js":"2FM6X","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gDXL8:[function(n,R,i){var o="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.js",s=n("c97449055ca5d2fc"),l="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out",h=arguments[3],I=(()=>{var S=typeof document!="undefined"&&document.currentScript?document.currentScript.src:void 0;return typeof o!="undefined"&&(S=S||o),function(e){e=e||{};function w(){return ue.buffer!=Fe&&lt(ue.buffer),Ue}function m(){return ue.buffer!=Fe&&lt(ue.buffer),gt}function f(){return ue.buffer!=Fe&&lt(ue.buffer),Ke}function d(){return ue.buffer!=Fe&&lt(ue.buffer),kt}function _(){return ue.buffer!=Fe&&lt(ue.buffer),Dt}function y(){return ue.buffer!=Fe&&lt(ue.buffer),Et}function j(){return ue.buffer!=Fe&&lt(ue.buffer),Ae}var r=typeof e!="undefined"?e:{},b,v;r.ready=new Promise(function(A,G){b=A,v=G});var C;typeof s!="undefined"&&s.listeners&&(C={uncaughtException:s.listeners("uncaughtException"),unhandledRejection:s.listeners("unhandledRejection")});var M=Object.assign({},r),P=[],F="./this.program",U=(A,G)=>{throw G},T=typeof window=="object",V=typeof importScripts=="function",H=typeof s=="object"&&typeof s.versions=="object"&&typeof s.versions.node=="string",K=r.ENVIRONMENT_IS_PTHREAD||!1,E="";function L(A){return r.locateFile?r.locateFile(A,E):E+A}var re,ne,oe,he;function be(A){if(A instanceof rn)return;q("exiting due to exception: "+A)}if(H){var ve=n("9157d0e129178d4c"),ke=n("d059fbaf750b223d");V?E=ke.dirname(E)+"/":E=l+"/",re=(G,de)=>(G=Ht(G)?new URL(G):ke.normalize(G),ve.readFileSync(G,de?void 0:"utf8")),oe=G=>{var de=re(G,!0);return de.buffer||(de=new Uint8Array(de)),de},ne=(G,de,Te)=>{G=Ht(G)?new URL(G):ke.normalize(G),ve.readFile(G,function(Je,Xe){Je?Te(Je):de(Xe.buffer)})},s.argv.length>1&&(F=s.argv[1].replace(/\\/g,"/")),P=s.argv.slice(2),s.on("uncaughtException",function(G){if(!(G instanceof rn))throw G}),s.on("unhandledRejection",function(G){throw G}),U=(G,de)=>{if(Pt())throw s.exitCode=G,de;be(de),s.exit(G)},r.inspect=function(){return"[Emscripten Module object]"};let A;try{A=n("b824e375529306ca")}catch(G){throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'),G}h.Worker=A.Worker}else(T||V)&&(V?E=self.location.href:typeof document!="undefined"&&document.currentScript&&(E=document.currentScript.src),typeof S!="undefined"&&S&&(E=S),E.indexOf("blob:")!==0?E=E.substr(0,E.replace(/[?#].*/,"").lastIndexOf("/")+1):E="",H||(re=A=>{var G=new XMLHttpRequest;return G.open("GET",A,!1),G.send(null),G.responseText},V&&(oe=A=>{var G=new XMLHttpRequest;return G.open("GET",A,!1),G.responseType="arraybuffer",G.send(null),new Uint8Array(G.response)}),ne=(A,G,de)=>{var Te=new XMLHttpRequest;Te.open("GET",A,!0),Te.responseType="arraybuffer",Te.onload=()=>{if(Te.status==200||Te.status==0&&Te.response){G(Te.response);return}de()},Te.onerror=de,Te.send(null)}),he=A=>document.title=A);H&&typeof performance=="undefined"&&(h.performance=n("61c738ede5584793").performance);var We=console.log.bind(console),rt=console.warn.bind(console);H&&(We=A=>ve.writeSync(1,A+`
`),rt=A=>ve.writeSync(2,A+`
`));var X=r.print||We,q=r.printErr||rt;Object.assign(r,M),M=null,r.arguments&&(P=r.arguments),r.thisProgram&&(F=r.thisProgram),r.quit&&(U=r.quit);var Z=4,te=Atomics.load,ee=Atomics.store,pe=Atomics.compareExchange,se;r.wasmBinary&&(se=r.wasmBinary);var me=r.noExitRuntime||!0;typeof WebAssembly!="object"&&Ut("no native wasm support detected");var ue,le,ae=!1,ge;function je(A,G){A||Ut(G)}var ye=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):void 0;function Se(A,G,de){G>>>=0;for(var Te=G+de,Je=G;A[Je]&&!(Je>=Te);)++Je;if(Je-G>16&&A.buffer&&ye)return ye.decode(A.buffer instanceof SharedArrayBuffer?A.slice(G,Je):A.subarray(G,Je));for(var Xe="";G<Je;){var we=A[G++];if(!(we&128)){Xe+=String.fromCharCode(we);continue}var Me=A[G++]&63;if((we&224)==192){Xe+=String.fromCharCode((we&31)<<6|Me);continue}var Nt=A[G++]&63;if((we&240)==224?we=(we&15)<<12|Me<<6|Nt:we=(we&7)<<18|Me<<12|Nt<<6|A[G++]&63,we<65536)Xe+=String.fromCharCode(we);else{var _n=we-65536;Xe+=String.fromCharCode(55296|_n>>10,56320|_n&1023)}}return Xe}function Oe(A,G){return A>>>=0,A?Se(m(),A,G):""}function it(A,G,de,Te){if(de>>>=0,!(Te>0))return 0;for(var Je=de,Xe=de+Te-1,we=0;we<A.length;++we){var Me=A.charCodeAt(we);if(Me>=55296&&Me<=57343){var Nt=A.charCodeAt(++we);Me=65536+((Me&1023)<<10)|Nt&1023}if(Me<=127){if(de>=Xe)break;G[de++>>>0]=Me}else if(Me<=2047){if(de+1>=Xe)break;G[de++>>>0]=192|Me>>6,G[de++>>>0]=128|Me&63}else if(Me<=65535){if(de+2>=Xe)break;G[de++>>>0]=224|Me>>12,G[de++>>>0]=128|Me>>6&63,G[de++>>>0]=128|Me&63}else{if(de+3>=Xe)break;G[de++>>>0]=240|Me>>18,G[de++>>>0]=128|Me>>12&63,G[de++>>>0]=128|Me>>6&63,G[de++>>>0]=128|Me&63}}return G[de>>>0]=0,de-Je}function ut(A,G,de){return it(A,m(),G,de)}var Fe,Ue,gt,Ke,wt,kt,Dt,Et,Ae;K&&(Fe=r.buffer);function lt(A){Fe=A,r.HEAP8=Ue=new Int8Array(A),r.HEAP16=Ke=new Int16Array(A),r.HEAP32=kt=new Int32Array(A),r.HEAPU8=gt=new Uint8Array(A),r.HEAPU16=wt=new Uint16Array(A),r.HEAPU32=Dt=new Uint32Array(A),r.HEAPF32=Et=new Float32Array(A),r.HEAPF64=Ae=new Float64Array(A)}var mt=r.INITIAL_MEMORY||16777216;if(K)ue=r.wasmMemory,Fe=r.buffer;else if(r.wasmMemory)ue=r.wasmMemory;else if(ue=new WebAssembly.Memory({initial:mt/65536,maximum:65536,shared:!0}),!(ue.buffer instanceof SharedArrayBuffer))throw q("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),H&&q("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"),Error("bad memory");ue&&(Fe=ue.buffer),mt=Fe.byteLength,lt(Fe);var At,un=[],Ot=[],nn=[],yn=!1;function Pt(){return me}function jt(){if(r.preRun)for(typeof r.preRun=="function"&&(r.preRun=[r.preRun]);r.preRun.length;)pn(r.preRun.shift());Cn(un)}function vt(){yn=!0,!K&&Cn(Ot)}function cn(){if(!K){if(r.postRun)for(typeof r.postRun=="function"&&(r.postRun=[r.postRun]);r.postRun.length;)bn(r.postRun.shift());Cn(nn)}}function pn(A){un.unshift(A)}function ht(A){Ot.unshift(A)}function bn(A){nn.unshift(A)}var zt=0,yt=null,et=null;function Ve(A){zt++,r.monitorRunDependencies&&r.monitorRunDependencies(zt)}function Wt(A){if(zt--,r.monitorRunDependencies&&r.monitorRunDependencies(zt),zt==0&&(yt!==null&&(clearInterval(yt),yt=null),et)){var G=et;et=null,G()}}function Ut(A){r.onAbort&&r.onAbort(A),A="Aborted("+A+")",q(A),ae=!0,ge=1,A+=". Build with -sASSERTIONS for more info.";var G=new WebAssembly.RuntimeError(A);throw v(G),G}var Nn="data:application/octet-stream;base64,";function wn(A){return A.startsWith(Nn)}function Ht(A){return A.startsWith("file://")}var Mt;Mt="tfjs-backend-wasm-threaded-simd.wasm",wn(Mt)||(Mt=L(Mt));function Kt(A){try{if(A==Mt&&se)return new Uint8Array(se);if(oe)return oe(A);throw"both async and sync fetching of the wasm failed"}catch(G){Ut(G)}}function $t(){if(!se&&(T||V)){if(typeof fetch=="function"&&!Ht(Mt))return fetch(Mt,{credentials:"same-origin"}).then(function(A){if(!A.ok)throw"failed to load wasm binary file at '"+Mt+"'";return A.arrayBuffer()}).catch(function(){return Kt(Mt)});if(ne)return new Promise(function(A,G){ne(Mt,function(de){A(new Uint8Array(de))},G)})}return Promise.resolve().then(function(){return Kt(Mt)})}function Bn(){var A={env:_e,wasi_snapshot_preview1:_e};function G(we,Me){var Nt=we.exports;if(r.asm=Nt,Rn(r.asm._emscripten_tls_init),At=r.asm.__indirect_function_table,ht(r.asm.__wasm_call_ctors),le=Me,!K){var _n=De.unusedWorkers.length;De.unusedWorkers.forEach(function(nr){De.loadWasmModuleToWorker(nr,function(){--_n||Wt("wasm-instantiate")})})}}K||Ve("wasm-instantiate");function de(we){G(we.instance,we.module)}function Te(we){return $t().then(function(Me){return WebAssembly.instantiate(Me,A)}).then(function(Me){return Me}).then(we,function(Me){q("failed to asynchronously prepare wasm: "+Me),Ut(Me)})}function Je(){return!se&&typeof WebAssembly.instantiateStreaming=="function"&&!wn(Mt)&&!Ht(Mt)&&!H&&typeof fetch=="function"?fetch(Mt,{credentials:"same-origin"}).then(function(we){var Me=WebAssembly.instantiateStreaming(we,A);return Me.then(de,function(Nt){return q("wasm streaming compile failed: "+Nt),q("falling back to ArrayBuffer instantiation"),Te(de)})}):Te(de)}if(r.instantiateWasm)try{var Xe=r.instantiateWasm(A,G);return Xe}catch(we){q("Module.instantiateWasm callback failed with error: "+we),v(we)}return Je().catch(v),{}}var rr,Rt,Jt={};function rn(A){this.name="ExitStatus",this.message="Program terminated with exit("+A+")",this.status=A}function an(A){var G=De.pthreads[A];delete De.pthreads[A],G.terminate(),Ca(A),De.runningWorkers.splice(De.runningWorkers.indexOf(G),1),G.pthread_ptr=0}function Dn(A){var G=De.pthreads[A];G.postMessage({cmd:"cancel"})}function tn(A){var G=De.pthreads[A];je(G),De.returnWorkerToPool(G)}function fn(A){var G=De.getNewWorker();if(!G)return 6;De.runningWorkers.push(G),De.pthreads[A.pthread_ptr]=G,G.pthread_ptr=A.pthread_ptr;var de={cmd:"run",start_routine:A.startRoutine,arg:A.arg,pthread_ptr:A.pthread_ptr};return G.runPthread=()=>{H&&G.ref(),G.postMessage(de,A.transferList),delete G.runPthread},G.loaded&&G.runPthread(),0}var kn={varargs:void 0,get:function(){kn.varargs+=4;var A=d()[kn.varargs-4>>>2];return A},getStr:function(A){var G=Oe(A);return G}};function jn(A){if(K)return Qt(1,1,A);ge=A,Pt()||(De.terminateAllThreads(),r.onExit&&r.onExit(A),ae=!0),U(A,new rn(A))}function Qn(A,G){if(ge=A,!G&&K)throw Pn(A),"unwind";jn(A)}var In=Qn;function Zt(A){if(A instanceof rn||A=="unwind")return ge;U(1,A)}var De={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init:function(){K?De.initWorker():De.initMainThread()},initMainThread:function(){for(var A=8;A--;)De.allocateUnusedWorker()},initWorker:function(){me=!1},setExitStatus:function(A){ge=A},terminateAllThreads:function(){for(var A of Object.values(De.pthreads))De.returnWorkerToPool(A);for(var A of De.unusedWorkers)A.terminate();De.unusedWorkers=[]},returnWorkerToPool:function(A){var G=A.pthread_ptr;delete De.pthreads[G],De.unusedWorkers.push(A),De.runningWorkers.splice(De.runningWorkers.indexOf(A),1),A.pthread_ptr=0,H&&A.unref(),Ca(G)},receiveObjectTransfer:function(A){},threadInitTLS:function(){De.tlsInitFunctions.forEach(A=>A())},loadWasmModuleToWorker:function(A,G){A.onmessage=Xe=>{var we=Xe.data,Me=we.cmd;if(A.pthread_ptr&&(De.currentProxiedOperationCallerThread=A.pthread_ptr),we.targetThread&&we.targetThread!=br()){var Nt=De.pthreads[we.targetThread];Nt?Nt.postMessage(we,we.transferList):q('Internal error! Worker sent a message "'+Me+'" to target pthread '+we.targetThread+", but that thread no longer exists!"),De.currentProxiedOperationCallerThread=void 0;return}Me==="processProxyingQueue"?Sn(we.queue):Me==="spawnThread"?fn(we):Me==="cleanupThread"?tn(we.thread):Me==="killThread"?an(we.thread):Me==="cancelThread"?Dn(we.thread):Me==="loaded"?(A.loaded=!0,H&&A.unref(),G&&G(A),A.runPthread&&A.runPthread()):Me==="print"?X("Thread "+we.threadId+": "+we.text):Me==="printErr"?q("Thread "+we.threadId+": "+we.text):Me==="alert"?alert("Thread "+we.threadId+": "+we.text):we.target==="setimmediate"?A.postMessage(we):Me==="callHandler"?r[we.handler](...we.args):Me&&q("worker sent an unknown command "+Me),De.currentProxiedOperationCallerThread=void 0},A.onerror=Xe=>{var we="worker sent an error!";throw q(we+" "+Xe.filename+":"+Xe.lineno+": "+Xe.message),Xe},H&&(A.on("message",function(Xe){A.onmessage({data:Xe})}),A.on("error",function(Xe){A.onerror(Xe)}),A.on("detachedExit",function(){}));var de=[],Te=["onExit","onAbort","print","printErr"];for(var Je of Te)r.hasOwnProperty(Je)&&de.push(Je);A.postMessage({cmd:"load",handlers:de,urlOrBlob:r.mainScriptUrlOrBlob||S,wasmMemory:ue,wasmModule:le})},allocateUnusedWorker:function(){var A,G=L("tfjs-backend-wasm-threaded-simd.worker.js");A=new Worker(G),De.unusedWorkers.push(A)},getNewWorker:function(){return De.unusedWorkers.length==0&&(De.allocateUnusedWorker(),De.loadWasmModuleToWorker(De.unusedWorkers[0])),De.unusedWorkers.pop()}};r.PThread=De;function Cn(A){for(;A.length>0;)A.shift()(r)}function dn(){var A=br(),G=d()[A+52>>>2],de=d()[A+56>>>2],Te=G-de;Da(G,Te),wr(G)}r.establishStackSpace=dn;function Pn(A){if(K)return Qt(2,0,A);try{In(A)}catch(G){Zt(G)}}var mn=[];function qn(A){var G=mn[A];return G||(A>=mn.length&&(mn.length=A+1),mn[A]=G=At.get(A)),G}function Gn(A,G){var de=qn(A)(G);Pt()?De.setExitStatus(de):Na(de)}r.invokeEntryPoint=Gn;function Rn(A){De.tlsInitFunctions.push(A)}function Tn(A){Aa(A,!V,1,!T),De.threadInitTLS()}function Hn(A){K?postMessage({cmd:"cleanupThread",thread:A}):tn(A)}function Ln(A,G,de,Te){return K?Qt(3,1,A,G,de,Te):Wn(A,G,de,Te)}function Wn(A,G,de,Te){if(typeof SharedArrayBuffer=="undefined")return q("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var Je=[],Xe=0;if(K&&(Je.length===0||Xe))return Ln(A,G,de,Te);if(Xe)return Xe;var we={startRoutine:de,pthread_ptr:A,arg:Te,transferList:Je};return K?(we.cmd="spawnThread",postMessage(we,Je),0):fn(we)}function er(){return 65536}var Un=!0;function Vn(){return Un}function Sn(A){Atomics.store(d(),A>>2,1),br()&&Fa(A),Atomics.compareExchange(d(),A>>2,1,0)}r.executeNotifiedProxyingQueue=Sn;function hn(A,G,de,Te){if(A==G)setTimeout(()=>Sn(Te));else if(K)postMessage({targetThread:A,cmd:"processProxyingQueue",queue:Te});else{var Je=De.pthreads[A];if(!Je)return;Je.postMessage({cmd:"processProxyingQueue",queue:Te})}return 1}function zn(A,G,de){return-1}function En(){Ut("")}function Xt(A){Xt.shown||(Xt.shown={}),Xt.shown[A]||(Xt.shown[A]=1,H&&(A="warning: "+A),q(A))}function Vt(){H||V||Xt("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread")}function On(){return Date.now()}function Kn(){return 4294901760}function Yn(){return Kn()}var xn;H?xn=()=>{var A=s.hrtime();return A[0]*1e3+A[1]/1e6}:xn=()=>performance.timeOrigin+performance.now();function Lt(A,G,de){m().copyWithin(A>>>0,G>>>0,G+de>>>0)}function Xn(){return H?n("1a28a111b649188c").cpus().length:navigator.hardwareConcurrency}function sn(A){var G=Sa(),de=A();return wr(G),de}function Qt(A,G){var de=arguments.length-2,Te=arguments;return sn(()=>{for(var Je=de,Xe=kr(Je*8),we=Xe>>3,Me=0;Me<de;Me++){var Nt=Te[2+Me];j()[we+Me>>>0]=Nt}return Ma(A,Je,Xe,G)})}var on=[];function $n(A,G,de){on.length=G;for(var Te=de>>3,Je=0;Je<G;Je++)on[Je]=j()[Te+Je>>>0];var Xe=A<0,we=Xe?Jt[-A-1]:ce[A];return we.apply(null,on)}function Jn(A){try{return ue.grow(A-Fe.byteLength+65535>>>16),lt(ue.buffer),1}catch{}}function gn(A){var G=m().length;if(A=A>>>0,A<=G)return!1;var de=Kn();if(A>de)return!1;let Te=(Nt,_n)=>Nt+(_n-Nt%_n)%_n;for(var Je=1;Je<=4;Je*=2){var Xe=G*(1+.2/Je);Xe=Math.min(Xe,A+100663296);var we=Math.min(de,Te(Math.max(A,Xe),65536)),Me=Jn(we);if(Me)return!0}return!1}function Zn(){throw"unwind"}function An(A){return K?Qt(4,1,A):52}function a(A,G,de,Te,Je){return K?Qt(5,1,A,G,de,Te,Je):70}var u=[null,[],[]];function p(A,G){var de=u[A];G===0||G===10?((A===1?X:q)(Se(de,0)),de.length=0):de.push(G)}function x(A,G,de,Te){if(K)return Qt(6,1,A,G,de,Te);for(var Je=0,Xe=0;Xe<de;Xe++){var we=_()[G>>>2],Me=_()[G+4>>>2];G+=8;for(var Nt=0;Nt<Me;Nt++)p(A,m()[we+Nt>>>0]);Je+=Me}return _()[Te>>>2]=Je,0}function B(A){var G=r["_"+A];return G}function J(A,G){w().set(A,G>>>0)}function W(A,G,de,Te,Je){var Xe={string:ln=>{var cr=0;if(ln!=null&&ln!==0){var Ta=(ln.length<<2)+1;cr=kr(Ta),ut(ln,cr,Ta)}return cr},array:ln=>{var cr=kr(ln.length);return J(ln,cr),cr}};function we(ln){return G==="string"?Oe(ln):G==="boolean"?Boolean(ln):ln}var Me=B(A),Nt=[],_n=0;if(Te)for(var nr=0;nr<Te.length;nr++){var Ra=Xe[de[nr]];Ra?(_n===0&&(_n=Sa()),Nt[nr]=Ra(Te[nr])):Nt[nr]=Te[nr]}var xa=Me.apply(null,Nt);function gs(ln){return _n!==0&&wr(_n),we(ln)}return xa=gs(xa),xa}function Q(A,G,de,Te){de=de||[];var Je=de.every(we=>we==="number"||we==="boolean"),Xe=G!=="string";return Xe&&Je&&!Te?B(A):function(){return W(A,G,de,arguments,Te)}}De.init();var ce=[null,jn,Pn,Ln,An,a,x],_e={__emscripten_init_main_thread_js:Tn,__emscripten_thread_cleanup:Hn,__pthread_create_js:Wn,_emscripten_default_pthread_stack_size:er,_emscripten_get_now_is_monotonic:Vn,_emscripten_notify_task_queue:hn,_emscripten_set_offscreencanvas_size:zn,abort:En,emscripten_check_blocking_allowed:Vt,emscripten_date_now:On,emscripten_get_heap_max:Yn,emscripten_get_now:xn,emscripten_memcpy_big:Lt,emscripten_num_logical_cores:Xn,emscripten_receive_on_main_thread_js:$n,emscripten_resize_heap:gn,emscripten_unwind_to_js_event_loop:Zn,exit:In,fd_close:An,fd_seek:a,fd_write:x,memory:ue||r.wasmMemory},Re=Bn(),at=r.___wasm_call_ctors=function(){return(at=r.___wasm_call_ctors=r.asm.__wasm_call_ctors).apply(null,arguments)},ze=r._init=function(){return(ze=r._init=r.asm.init).apply(null,arguments)},Ee=r._init_with_threads_count=function(){return(Ee=r._init_with_threads_count=r.asm.init_with_threads_count).apply(null,arguments)},Ie=r._get_threads_count=function(){return(Ie=r._get_threads_count=r.asm.get_threads_count).apply(null,arguments)},Pe=r._register_tensor=function(){return(Pe=r._register_tensor=r.asm.register_tensor).apply(null,arguments)},He=r._dispose_data=function(){return(He=r._dispose_data=r.asm.dispose_data).apply(null,arguments)},Ze=r._dispose=function(){return(Ze=r._dispose=r.asm.dispose).apply(null,arguments)},Ct=r._Abs=function(){return(Ct=r._Abs=r.asm.Abs).apply(null,arguments)},pt=r._Acos=function(){return(pt=r._Acos=r.asm.Acos).apply(null,arguments)},Ft=r._Acosh=function(){return(Ft=r._Acosh=r.asm.Acosh).apply(null,arguments)},It=r._Add=function(){return(It=r._Add=r.asm.Add).apply(null,arguments)},Le=r._AddN=function(){return(Le=r._AddN=r.asm.AddN).apply(null,arguments)},Qe=r._All=function(){return(Qe=r._All=r.asm.All).apply(null,arguments)},st=r._Any=function(){return(st=r._Any=r.asm.Any).apply(null,arguments)},$e=r._ArgMax=function(){return($e=r._ArgMax=r.asm.ArgMax).apply(null,arguments)},tt=r._ArgMin=function(){return(tt=r._ArgMin=r.asm.ArgMin).apply(null,arguments)},qe=r._Asin=function(){return(qe=r._Asin=r.asm.Asin).apply(null,arguments)},Mn=r._Asinh=function(){return(Mn=r._Asinh=r.asm.Asinh).apply(null,arguments)},pr=r._Atan=function(){return(pr=r._Atan=r.asm.Atan).apply(null,arguments)},fr=r._Atan2=function(){return(fr=r._Atan2=r.asm.Atan2).apply(null,arguments)},or=r._Atanh=function(){return(or=r._Atanh=r.asm.Atanh).apply(null,arguments)},t=r._AvgPool=function(){return(t=r._AvgPool=r.asm.AvgPool).apply(null,arguments)},c=r._AvgPool3D=function(){return(c=r._AvgPool3D=r.asm.AvgPool3D).apply(null,arguments)},g=r._AvgPool3DGrad=function(){return(g=r._AvgPool3DGrad=r.asm.AvgPool3DGrad).apply(null,arguments)},k=r._AvgPoolGrad=function(){return(k=r._AvgPoolGrad=r.asm.AvgPoolGrad).apply(null,arguments)},N=r._BatchMatMul=function(){return(N=r._BatchMatMul=r.asm.BatchMatMul).apply(null,arguments)},O=r._Bincount=function(){return(O=r._Bincount=r.asm.Bincount).apply(null,arguments)},D=r._BitwiseAnd=function(){return(D=r._BitwiseAnd=r.asm.BitwiseAnd).apply(null,arguments)},z=r._Ceil=function(){return(z=r._Ceil=r.asm.Ceil).apply(null,arguments)},$=r._ClipByValue=function(){return($=r._ClipByValue=r.asm.ClipByValue).apply(null,arguments)},fe=r._Conv2D=function(){return(fe=r._Conv2D=r.asm.Conv2D).apply(null,arguments)},Ce=r._Conv2DBackpropInput=function(){return(Ce=r._Conv2DBackpropInput=r.asm.Conv2DBackpropInput).apply(null,arguments)},Be=r._Conv3D=function(){return(Be=r._Conv3D=r.asm.Conv3D).apply(null,arguments)},Ge=r._Conv3DBackpropFilterV2=function(){return(Ge=r._Conv3DBackpropFilterV2=r.asm.Conv3DBackpropFilterV2).apply(null,arguments)},xe=r._Conv3DBackpropInputV2=function(){return(xe=r._Conv3DBackpropInputV2=r.asm.Conv3DBackpropInputV2).apply(null,arguments)},Ye=r._Cos=function(){return(Ye=r._Cos=r.asm.Cos).apply(null,arguments)},ct=r._Cosh=function(){return(ct=r._Cosh=r.asm.Cosh).apply(null,arguments)},bt=r._CropAndResize=function(){return(bt=r._CropAndResize=r.asm.CropAndResize).apply(null,arguments)},_t=r._Cumprod=function(){return(_t=r._Cumprod=r.asm.Cumprod).apply(null,arguments)},Bt=r._Cumsum=function(){return(Bt=r._Cumsum=r.asm.Cumsum).apply(null,arguments)},qt=r._DenseBincount=function(){return(qt=r._DenseBincount=r.asm.DenseBincount).apply(null,arguments)},Yt=r._DepthToSpace=function(){return(Yt=r._DepthToSpace=r.asm.DepthToSpace).apply(null,arguments)},ft=r._DepthwiseConv2dNative=function(){return(ft=r._DepthwiseConv2dNative=r.asm.DepthwiseConv2dNative).apply(null,arguments)},Tt=r._Diag=function(){return(Tt=r._Diag=r.asm.Diag).apply(null,arguments)},Fn=r._Dilation2D=function(){return(Fn=r._Dilation2D=r.asm.Dilation2D).apply(null,arguments)},Sr=r._Dilation2DBackpropFilter=function(){return(Sr=r._Dilation2DBackpropFilter=r.asm.Dilation2DBackpropFilter).apply(null,arguments)},xr=r._Dilation2DBackpropInput=function(){return(xr=r._Dilation2DBackpropInput=r.asm.Dilation2DBackpropInput).apply(null,arguments)},Ar=r._Elu=function(){return(Ar=r._Elu=r.asm.Elu).apply(null,arguments)},Mr=r._EluGrad=function(){return(Mr=r._EluGrad=r.asm.EluGrad).apply(null,arguments)},Fr=r._Equal=function(){return(Fr=r._Equal=r.asm.Equal).apply(null,arguments)},Nr=r._Erf=function(){return(Nr=r._Erf=r.asm.Erf).apply(null,arguments)},Dr=r._Exp=function(){return(Dr=r._Exp=r.asm.Exp).apply(null,arguments)},Pr=r._Expm1=function(){return(Pr=r._Expm1=r.asm.Expm1).apply(null,arguments)},Rr=r._FlipLeftRight=function(){return(Rr=r._FlipLeftRight=r.asm.FlipLeftRight).apply(null,arguments)},Tr=r._Floor=function(){return(Tr=r._Floor=r.asm.Floor).apply(null,arguments)},Er=r._FloorDiv=function(){return(Er=r._FloorDiv=r.asm.FloorDiv).apply(null,arguments)},Or=r._FusedBatchNorm=function(){return(Or=r._FusedBatchNorm=r.asm.FusedBatchNorm).apply(null,arguments)},Br=r._FusedConv2D=function(){return(Br=r._FusedConv2D=r.asm.FusedConv2D).apply(null,arguments)},Gr=r._FusedDepthwiseConv2D=function(){return(Gr=r._FusedDepthwiseConv2D=r.asm.FusedDepthwiseConv2D).apply(null,arguments)},Hr=r._Gather=function(){return(Hr=r._Gather=r.asm.Gather).apply(null,arguments)},Lr=r._GatherNd=function(){return(Lr=r._GatherNd=r.asm.GatherNd).apply(null,arguments)},Wr=r._Greater=function(){return(Wr=r._Greater=r.asm.Greater).apply(null,arguments)},Ur=r._GreaterEqual=function(){return(Ur=r._GreaterEqual=r.asm.GreaterEqual).apply(null,arguments)},Vr=r._IsFinite=function(){return(Vr=r._IsFinite=r.asm.IsFinite).apply(null,arguments)},zr=r._IsInf=function(){return(zr=r._IsInf=r.asm.IsInf).apply(null,arguments)},Kr=r._IsNan=function(){return(Kr=r._IsNan=r.asm.IsNan).apply(null,arguments)},Yr=r._LRN=function(){return(Yr=r._LRN=r.asm.LRN).apply(null,arguments)},Xr=r._LRNGrad=function(){return(Xr=r._LRNGrad=r.asm.LRNGrad).apply(null,arguments)},$r=r._LeakyRelu=function(){return($r=r._LeakyRelu=r.asm.LeakyRelu).apply(null,arguments)},Jr=r._Less=function(){return(Jr=r._Less=r.asm.Less).apply(null,arguments)},Zr=r._LessEqual=function(){return(Zr=r._LessEqual=r.asm.LessEqual).apply(null,arguments)},Qr=r._LinSpace=function(){return(Qr=r._LinSpace=r.asm.LinSpace).apply(null,arguments)},qr=r._Log=function(){return(qr=r._Log=r.asm.Log).apply(null,arguments)},ea=r._Log1p=function(){return(ea=r._Log1p=r.asm.Log1p).apply(null,arguments)},ta=r._LogicalAnd=function(){return(ta=r._LogicalAnd=r.asm.LogicalAnd).apply(null,arguments)},na=r._LogicalNot=function(){return(na=r._LogicalNot=r.asm.LogicalNot).apply(null,arguments)},ra=r._LogicalOr=function(){return(ra=r._LogicalOr=r.asm.LogicalOr).apply(null,arguments)},aa=r._LogicalXor=function(){return(aa=r._LogicalXor=r.asm.LogicalXor).apply(null,arguments)},sa=r._Max=function(){return(sa=r._Max=r.asm.Max).apply(null,arguments)},oa=r._MaxPool=function(){return(oa=r._MaxPool=r.asm.MaxPool).apply(null,arguments)},ia=r._MaxPool3D=function(){return(ia=r._MaxPool3D=r.asm.MaxPool3D).apply(null,arguments)},la=r._MaxPool3DGrad=function(){return(la=r._MaxPool3DGrad=r.asm.MaxPool3DGrad).apply(null,arguments)},ua=r._MaxPoolGrad=function(){return(ua=r._MaxPoolGrad=r.asm.MaxPoolGrad).apply(null,arguments)},ca=r._MaxPoolWithArgmax=function(){return(ca=r._MaxPoolWithArgmax=r.asm.MaxPoolWithArgmax).apply(null,arguments)},pa=r._Maximum=function(){return(pa=r._Maximum=r.asm.Maximum).apply(null,arguments)},fa=r._Mean=function(){return(fa=r._Mean=r.asm.Mean).apply(null,arguments)},da=r._Min=function(){return(da=r._Min=r.asm.Min).apply(null,arguments)},ma=r._Minimum=function(){return(ma=r._Minimum=r.asm.Minimum).apply(null,arguments)},ha=r._MirrorPad=function(){return(ha=r._MirrorPad=r.asm.MirrorPad).apply(null,arguments)},ga=r._Mod=function(){return(ga=r._Mod=r.asm.Mod).apply(null,arguments)},va=r._Multinomial=function(){return(va=r._Multinomial=r.asm.Multinomial).apply(null,arguments)},_a=r._Multiply=function(){return(_a=r._Multiply=r.asm.Multiply).apply(null,arguments)},ya=r._Neg=function(){return(ya=r._Neg=r.asm.Neg).apply(null,arguments)},ba=r._NonMaxSuppressionV3=function(){return(ba=r._NonMaxSuppressionV3=r.asm.NonMaxSuppressionV3).apply(null,arguments)},hr=r._NonMaxSuppressionV4=function(){return(hr=r._NonMaxSuppressionV4=r.asm.NonMaxSuppressionV4).apply(null,arguments)},gr=r._NonMaxSuppressionV5=function(){return(gr=r._NonMaxSuppressionV5=r.asm.NonMaxSuppressionV5).apply(null,arguments)},dr=r._NotEqual=function(){return(dr=r._NotEqual=r.asm.NotEqual).apply(null,arguments)},wa=r._OneHot=function(){return(wa=r._OneHot=r.asm.OneHot).apply(null,arguments)},ka=r._PadV2=function(){return(ka=r._PadV2=r.asm.PadV2).apply(null,arguments)},ir=r._Pow=function(){return(ir=r._Pow=r.asm.Pow).apply(null,arguments)},vr=r._Prelu=function(){return(vr=r._Prelu=r.asm.Prelu).apply(null,arguments)},lr=r._Prod=function(){return(lr=r._Prod=r.asm.Prod).apply(null,arguments)},ur=r._RealDiv=function(){return(ur=r._RealDiv=r.asm.RealDiv).apply(null,arguments)},ja=r._Reciprocal=function(){return(ja=r._Reciprocal=r.asm.Reciprocal).apply(null,arguments)},Y=r._Relu=function(){return(Y=r._Relu=r.asm.Relu).apply(null,arguments)},ie=r._Relu6=function(){return(ie=r._Relu6=r.asm.Relu6).apply(null,arguments)},Ne=r._ResizeBilinear=function(){return(Ne=r._ResizeBilinear=r.asm.ResizeBilinear).apply(null,arguments)},dt=r._ResizeBilinearGrad=function(){return(dt=r._ResizeBilinearGrad=r.asm.ResizeBilinearGrad).apply(null,arguments)},St=r._ResizeNearestNeighbor=function(){return(St=r._ResizeNearestNeighbor=r.asm.ResizeNearestNeighbor).apply(null,arguments)},xt=r._ResizeNearestNeighborGrad=function(){return(xt=r._ResizeNearestNeighborGrad=r.asm.ResizeNearestNeighborGrad).apply(null,arguments)},ot=r._Reverse=function(){return(ot=r._Reverse=r.asm.Reverse).apply(null,arguments)},nt=r._RotateWithOffset=function(){return(nt=r._RotateWithOffset=r.asm.RotateWithOffset).apply(null,arguments)},Gt=r._Round=function(){return(Gt=r._Round=r.asm.Round).apply(null,arguments)},vn=r._Rsqrt=function(){return(vn=r._Rsqrt=r.asm.Rsqrt).apply(null,arguments)},tr=r._ScatterNd=function(){return(tr=r._ScatterNd=r.asm.ScatterNd).apply(null,arguments)},_r=r._SearchSorted=function(){return(_r=r._SearchSorted=r.asm.SearchSorted).apply(null,arguments)},mr=r._SelectV2=function(){return(mr=r._SelectV2=r.asm.SelectV2).apply(null,arguments)},Ia=r._Selu=function(){return(Ia=r._Selu=r.asm.Selu).apply(null,arguments)},en=r._Sigmoid=function(){return(en=r._Sigmoid=r.asm.Sigmoid).apply(null,arguments)},ar=r._Sign=function(){return(ar=r._Sign=r.asm.Sign).apply(null,arguments)},yr=r._Sin=function(){return(yr=r._Sin=r.asm.Sin).apply(null,arguments)},Oa=r._Sinh=function(){return(Oa=r._Sinh=r.asm.Sinh).apply(null,arguments)},Ba=r._Softmax=function(){return(Ba=r._Softmax=r.asm.Softmax).apply(null,arguments)},Ga=r._Softplus=function(){return(Ga=r._Softplus=r.asm.Softplus).apply(null,arguments)},Ha=r._SparseFillEmptyRows=function(){return(Ha=r._SparseFillEmptyRows=r.asm.SparseFillEmptyRows).apply(null,arguments)},La=r._SparseReshape=function(){return(La=r._SparseReshape=r.asm.SparseReshape).apply(null,arguments)},Wa=r._SparseSegmentReduction=function(){return(Wa=r._SparseSegmentReduction=r.asm.SparseSegmentReduction).apply(null,arguments)},Ua=r._SparseToDense=function(){return(Ua=r._SparseToDense=r.asm.SparseToDense).apply(null,arguments)},Va=r._Sqrt=function(){return(Va=r._Sqrt=r.asm.Sqrt).apply(null,arguments)},za=r._Square=function(){return(za=r._Square=r.asm.Square).apply(null,arguments)},Ka=r._SquaredDifference=function(){return(Ka=r._SquaredDifference=r.asm.SquaredDifference).apply(null,arguments)},Ya=r._Step=function(){return(Ya=r._Step=r.asm.Step).apply(null,arguments)},Xa=r._StridedSlice=function(){return(Xa=r._StridedSlice=r.asm.StridedSlice).apply(null,arguments)},$a=r._Sub=function(){return($a=r._Sub=r.asm.Sub).apply(null,arguments)},Ja=r._Sum=function(){return(Ja=r._Sum=r.asm.Sum).apply(null,arguments)},Za=r._Tan=function(){return(Za=r._Tan=r.asm.Tan).apply(null,arguments)},Qa=r._Tanh=function(){return(Qa=r._Tanh=r.asm.Tanh).apply(null,arguments)},qa=r._TensorScatterUpdate=function(){return(qa=r._TensorScatterUpdate=r.asm.TensorScatterUpdate).apply(null,arguments)},es=r._Tile=function(){return(es=r._Tile=r.asm.Tile).apply(null,arguments)},ts=r._TopK=function(){return(ts=r._TopK=r.asm.TopK).apply(null,arguments)},ns=r._Transform=function(){return(ns=r._Transform=r.asm.Transform).apply(null,arguments)},rs=r._Transpose=function(){return(rs=r._Transpose=r.asm.Transpose).apply(null,arguments)},as=r.__FusedMatMul=function(){return(as=r.__FusedMatMul=r.asm._FusedMatMul).apply(null,arguments)},ss=r._malloc=function(){return(ss=r._malloc=r.asm.malloc).apply(null,arguments)},os=r._free=function(){return(os=r._free=r.asm.free).apply(null,arguments)},is=r.__emscripten_tls_init=function(){return(is=r.__emscripten_tls_init=r.asm._emscripten_tls_init).apply(null,arguments)},br=r._pthread_self=function(){return(br=r._pthread_self=r.asm.pthread_self).apply(null,arguments)},ls=r.___errno_location=function(){return(ls=r.___errno_location=r.asm.__errno_location).apply(null,arguments)},Aa=r.__emscripten_thread_init=function(){return(Aa=r.__emscripten_thread_init=r.asm._emscripten_thread_init).apply(null,arguments)},us=r.__emscripten_thread_crashed=function(){return(us=r.__emscripten_thread_crashed=r.asm._emscripten_thread_crashed).apply(null,arguments)},cs=r._emscripten_main_thread_process_queued_calls=function(){return(cs=r._emscripten_main_thread_process_queued_calls=r.asm.emscripten_main_thread_process_queued_calls).apply(null,arguments)},ps=r._emscripten_main_browser_thread_id=function(){return(ps=r._emscripten_main_browser_thread_id=r.asm.emscripten_main_browser_thread_id).apply(null,arguments)},Ma=r._emscripten_run_in_main_runtime_thread_js=function(){return(Ma=r._emscripten_run_in_main_runtime_thread_js=r.asm.emscripten_run_in_main_runtime_thread_js).apply(null,arguments)},fs=r._emscripten_dispatch_to_thread_=function(){return(fs=r._emscripten_dispatch_to_thread_=r.asm.emscripten_dispatch_to_thread_).apply(null,arguments)},Fa=r.__emscripten_proxy_execute_task_queue=function(){return(Fa=r.__emscripten_proxy_execute_task_queue=r.asm._emscripten_proxy_execute_task_queue).apply(null,arguments)},Ca=r.__emscripten_thread_free_data=function(){return(Ca=r.__emscripten_thread_free_data=r.asm._emscripten_thread_free_data).apply(null,arguments)},Na=r.__emscripten_thread_exit=function(){return(Na=r.__emscripten_thread_exit=r.asm._emscripten_thread_exit).apply(null,arguments)},Da=r._emscripten_stack_set_limits=function(){return(Da=r._emscripten_stack_set_limits=r.asm.emscripten_stack_set_limits).apply(null,arguments)},Sa=r.stackSave=function(){return(Sa=r.stackSave=r.asm.stackSave).apply(null,arguments)},wr=r.stackRestore=function(){return(wr=r.stackRestore=r.asm.stackRestore).apply(null,arguments)},kr=r.stackAlloc=function(){return(kr=r.stackAlloc=r.asm.stackAlloc).apply(null,arguments)},ds=r.dynCall_iijjiiii=function(){return(ds=r.dynCall_iijjiiii=r.asm.dynCall_iijjiiii).apply(null,arguments)},ms=r.dynCall_jiji=function(){return(ms=r.dynCall_jiji=r.asm.dynCall_jiji).apply(null,arguments)};r.keepRuntimeAlive=Pt,r.wasmMemory=ue,r.cwrap=Q,r.ExitStatus=rn,r.PThread=De;var jr;et=function A(){jr||Pa(),jr||(et=A)};function Pa(A){if(A=A||P,zt>0)return;if(K){b(r),vt(),startWorker(r);return}if(jt(),zt>0)return;function G(){jr||(jr=!0,r.calledRun=!0,!ae&&(vt(),b(r),r.onRuntimeInitialized&&r.onRuntimeInitialized(),cn()))}r.setStatus?(r.setStatus("Running..."),setTimeout(function(){setTimeout(function(){r.setStatus("")},1),G()},1)):G()}if(r.preInit)for(typeof r.preInit=="function"&&(r.preInit=[r.preInit]);r.preInit.length>0;)r.preInit.pop()();Pa();var Ir;C&&(Ir={uncaughtException:s.listeners("uncaughtException").filter(function(A){return!C.uncaughtException.indexOf(A)>-1}),unhandledRejection:s.listeners("unhandledRejection").filter(function(A){return!C.unhandledRejection.indexOf(A)>-1})});var Cr;if(typeof WasmBackendModule!="undefined")Cr=WasmBackendModule;else if(typeof e!="undefined")Cr=e;else throw new Error("Could not find wasm module in post.js");if(Ir){var hs=Cr._dispose;Cr._dispose=function(){hs(),Ir.uncaughtException.forEach(function(A){s.removeListener("uncaughtException",A)}),Ir.unhandledRejection.forEach(function(A){s.removeListener("unhandledRejection",A)})}}return e.ready}})();R.exports=I},{c97449055ca5d2fc:"5xM3z","9157d0e129178d4c":"34v0S",d059fbaf750b223d:"34v0S",b824e375529306ca:"34v0S","61c738ede5584793":"34v0S","1a28a111b649188c":"34v0S"}],bpcnH:[function(n,R,i){R.exports.wasmWorkerContents=`"use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",data=>onmessage({data:data}));var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8")+"//# sourceURL="+f)},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}var initializedJS=false;var pendingNotifiedProxyingQueues=[];function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"
");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=(info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports};self.onunhandledrejection=e=>{throw e.reason??e};self.startWorker=instance=>{Module=instance;postMessage({"cmd":"loaded"})};self.onmessage=e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;for(const handler of e.data.handlers){Module[handler]=function(){postMessage({cmd:"callHandler",handler:handler,args:[...arguments]})}}Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob=="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module)}else if(e.data.cmd==="run"){Module["__emscripten_thread_init"](e.data.pthread_ptr,0,0,1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInitTLS();if(!initializedJS){pendingNotifiedProxyingQueues.forEach(queue=>{Module["executeNotifiedProxyingQueue"](queue)});pendingNotifiedProxyingQueues=[];initializedJS=true}try{Module["invokeEntryPoint"](e.data.start_routine,e.data.arg)}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processProxyingQueue"){if(initializedJS){Module["executeNotifiedProxyingQueue"](e.data.queue)}else{pendingNotifiedProxyingQueues.push(e.data.queue)}}else if(e.data.cmd){err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}};`},{}],"2FM6X":[function(n,R,i){var o="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm.js",s=n("caec8bcdfe9960aa"),l="node_modules/@tensorflow/tfjs-backend-wasm/wasm-out",h=(()=>{var I=typeof document!="undefined"&&document.currentScript?document.currentScript.src:void 0;return typeof o!="undefined"&&(I=I||o),function(S){S=S||{};var e=typeof S!="undefined"?S:{},w,m;e.ready=new Promise(function(Y,ie){w=Y,m=ie});var f;typeof s!="undefined"&&s.listeners&&(f={uncaughtException:s.listeners("uncaughtException"),unhandledRejection:s.listeners("unhandledRejection")});var d=Object.assign({},e),_=[],y="./this.program",j=(Y,ie)=>{throw ie},r=typeof window=="object",b=typeof importScripts=="function",v=typeof s=="object"&&typeof s.versions=="object"&&typeof s.versions.node=="string",C="";function M(Y){return e.locateFile?e.locateFile(Y,C):C+Y}var P,F,U,T;function V(Y){if(Y instanceof zt)return;L("exiting due to exception: "+Y)}if(v){var H=n("4a73517fc90a67e6"),K=n("bb12b68c9d27b74");b?C=K.dirname(C)+"/":C=l+"/",P=(Y,ie)=>(Y=Pt(Y)?new URL(Y):K.normalize(Y),H.readFileSync(Y,ie?void 0:"utf8")),U=Y=>{var ie=P(Y,!0);return ie.buffer||(ie=new Uint8Array(ie)),ie},F=(Y,ie,Ne)=>{Y=Pt(Y)?new URL(Y):K.normalize(Y),H.readFile(Y,function(dt,St){dt?Ne(dt):ie(St.buffer)})},s.argv.length>1&&(y=s.argv[1].replace(/\\/g,"/")),_=s.argv.slice(2),s.on("uncaughtException",function(Y){if(!(Y instanceof zt))throw Y}),s.on("unhandledRejection",function(Y){throw Y}),j=(Y,ie)=>{if(Ue())throw s.exitCode=Y,ie;V(ie),s.exit(Y)},e.inspect=function(){return"[Emscripten Module object]"}}else(r||b)&&(b?C=self.location.href:typeof document!="undefined"&&document.currentScript&&(C=document.currentScript.src),I&&(C=I),C.indexOf("blob:")!==0?C=C.substr(0,C.replace(/[?#].*/,"").lastIndexOf("/")+1):C="",P=Y=>{var ie=new XMLHttpRequest;return ie.open("GET",Y,!1),ie.send(null),ie.responseText},b&&(U=Y=>{var ie=new XMLHttpRequest;return ie.open("GET",Y,!1),ie.responseType="arraybuffer",ie.send(null),new Uint8Array(ie.response)}),F=(Y,ie,Ne)=>{var dt=new XMLHttpRequest;dt.open("GET",Y,!0),dt.responseType="arraybuffer",dt.onload=()=>{if(dt.status==200||dt.status==0&&dt.response){ie(dt.response);return}Ne()},dt.onerror=Ne,dt.send(null)},T=Y=>document.title=Y);var E=e.print||console.log.bind(console),L=e.printErr||console.warn.bind(console);Object.assign(e,d),d=null,e.arguments&&(_=e.arguments),e.thisProgram&&(y=e.thisProgram),e.quit&&(j=e.quit);var re=4,ne;e.wasmBinary&&(ne=e.wasmBinary);var oe=e.noExitRuntime||!0;typeof WebAssembly!="object"&&Ot("no native wasm support detected");var he,be=!1,ve;function ke(Y,ie){Y||Ot(ie)}var We=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):void 0;function rt(Y,ie,Ne){ie>>>=0;for(var dt=ie+Ne,St=ie;Y[St]&&!(St>=dt);)++St;if(St-ie>16&&Y.buffer&&We)return We.decode(Y.subarray(ie,St));for(var xt="";ie<St;){var ot=Y[ie++];if(!(ot&128)){xt+=String.fromCharCode(ot);continue}var nt=Y[ie++]&63;if((ot&224)==192){xt+=String.fromCharCode((ot&31)<<6|nt);continue}var Gt=Y[ie++]&63;if((ot&240)==224?ot=(ot&15)<<12|nt<<6|Gt:ot=(ot&7)<<18|nt<<12|Gt<<6|Y[ie++]&63,ot<65536)xt+=String.fromCharCode(ot);else{var vn=ot-65536;xt+=String.fromCharCode(55296|vn>>10,56320|vn&1023)}}return xt}function X(Y,ie){return Y>>>=0,Y?rt(pe,Y,ie):""}function q(Y,ie,Ne,dt){if(Ne>>>=0,!(dt>0))return 0;for(var St=Ne,xt=Ne+dt-1,ot=0;ot<Y.length;++ot){var nt=Y.charCodeAt(ot);if(nt>=55296&&nt<=57343){var Gt=Y.charCodeAt(++ot);nt=65536+((nt&1023)<<10)|Gt&1023}if(nt<=127){if(Ne>=xt)break;ie[Ne++>>>0]=nt}else if(nt<=2047){if(Ne+1>=xt)break;ie[Ne++>>>0]=192|nt>>6,ie[Ne++>>>0]=128|nt&63}else if(nt<=65535){if(Ne+2>=xt)break;ie[Ne++>>>0]=224|nt>>12,ie[Ne++>>>0]=128|nt>>6&63,ie[Ne++>>>0]=128|nt&63}else{if(Ne+3>=xt)break;ie[Ne++>>>0]=240|nt>>18,ie[Ne++>>>0]=128|nt>>12&63,ie[Ne++>>>0]=128|nt>>6&63,ie[Ne++>>>0]=128|nt&63}}return ie[Ne>>>0]=0,Ne-St}function Z(Y,ie,Ne){return q(Y,pe,ie,Ne)}var te,ee,pe,se,me,ue,le,ae,ge;function je(Y){te=Y,e.HEAP8=ee=new Int8Array(Y),e.HEAP16=se=new Int16Array(Y),e.HEAP32=ue=new Int32Array(Y),e.HEAPU8=pe=new Uint8Array(Y),e.HEAPU16=me=new Uint16Array(Y),e.HEAPU32=le=new Uint32Array(Y),e.HEAPF32=ae=new Float32Array(Y),e.HEAPF64=ge=new Float64Array(Y)}var ye=e.INITIAL_MEMORY||16777216,Se,Oe=[],it=[],ut=[],Fe=!1;function Ue(){return oe}function gt(){if(e.preRun)for(typeof e.preRun=="function"&&(e.preRun=[e.preRun]);e.preRun.length;)kt(e.preRun.shift());yt(Oe)}function Ke(){Fe=!0,yt(it)}function wt(){if(e.postRun)for(typeof e.postRun=="function"&&(e.postRun=[e.postRun]);e.postRun.length;)Et(e.postRun.shift());yt(ut)}function kt(Y){Oe.unshift(Y)}function Dt(Y){it.unshift(Y)}function Et(Y){ut.unshift(Y)}var Ae=0,lt=null,mt=null;function At(Y){Ae++,e.monitorRunDependencies&&e.monitorRunDependencies(Ae)}function un(Y){if(Ae--,e.monitorRunDependencies&&e.monitorRunDependencies(Ae),Ae==0&&(lt!==null&&(clearInterval(lt),lt=null),mt)){var ie=mt;mt=null,ie()}}function Ot(Y){e.onAbort&&e.onAbort(Y),Y="Aborted("+Y+")",L(Y),be=!0,ve=1,Y+=". Build with -sASSERTIONS for more info.";var ie=new WebAssembly.RuntimeError(Y);throw m(ie),ie}var nn="data:application/octet-stream;base64,";function yn(Y){return Y.startsWith(nn)}function Pt(Y){return Y.startsWith("file://")}var jt;jt="tfjs-backend-wasm.wasm",yn(jt)||(jt=M(jt));function vt(Y){try{if(Y==jt&&ne)return new Uint8Array(ne);if(U)return U(Y);throw"both async and sync fetching of the wasm failed"}catch(ie){Ot(ie)}}function cn(){if(!ne&&(r||b)){if(typeof fetch=="function"&&!Pt(jt))return fetch(jt,{credentials:"same-origin"}).then(function(Y){if(!Y.ok)throw"failed to load wasm binary file at '"+jt+"'";return Y.arrayBuffer()}).catch(function(){return vt(jt)});if(F)return new Promise(function(Y,ie){F(jt,function(Ne){Y(new Uint8Array(Ne))},ie)})}return Promise.resolve().then(function(){return vt(jt)})}function pn(){var Y={env:Dn,wasi_snapshot_preview1:Dn};function ie(ot,nt){var Gt=ot.exports;e.asm=Gt,he=e.asm.memory,je(he.buffer),Se=e.asm.__indirect_function_table,Dt(e.asm.__wasm_call_ctors),un("wasm-instantiate")}At("wasm-instantiate");function Ne(ot){ie(ot.instance)}function dt(ot){return cn().then(function(nt){return WebAssembly.instantiate(nt,Y)}).then(function(nt){return nt}).then(ot,function(nt){L("failed to asynchronously prepare wasm: "+nt),Ot(nt)})}function St(){return!ne&&typeof WebAssembly.instantiateStreaming=="function"&&!yn(jt)&&!Pt(jt)&&!v&&typeof fetch=="function"?fetch(jt,{credentials:"same-origin"}).then(function(ot){var nt=WebAssembly.instantiateStreaming(ot,Y);return nt.then(Ne,function(Gt){return L("wasm streaming compile failed: "+Gt),L("falling back to ArrayBuffer instantiation"),dt(Ne)})}):dt(Ne)}if(e.instantiateWasm)try{var xt=e.instantiateWasm(Y,ie);return xt}catch(ot){L("Module.instantiateWasm callback failed with error: "+ot),m(ot)}return St().catch(m),{}}var ht,bn;function zt(Y){this.name="ExitStatus",this.message="Program terminated with exit("+Y+")",this.status=Y}function yt(Y){for(;Y.length>0;)Y.shift()(e)}function et(){Ot("")}function Ve(){return 4294901760}function Wt(){return Ve()}function Ut(Y,ie,Ne){pe.copyWithin(Y>>>0,ie>>>0,ie+Ne>>>0)}function Nn(Y){try{return he.grow(Y-te.byteLength+65535>>>16),je(he.buffer),1}catch{}}function wn(Y){var ie=pe.length;Y=Y>>>0;var Ne=Ve();if(Y>Ne)return!1;let dt=(Gt,vn)=>Gt+(vn-Gt%vn)%vn;for(var St=1;St<=4;St*=2){var xt=ie*(1+.2/St);xt=Math.min(xt,Y+100663296);var ot=Math.min(Ne,dt(Math.max(Y,xt),65536)),nt=Nn(ot);if(nt)return!0}return!1}var Ht={varargs:void 0,get:function(){Ht.varargs+=4;var Y=ue[Ht.varargs-4>>>2];return Y},getStr:function(Y){var ie=X(Y);return ie}};function Mt(Y){return 52}function Kt(Y,ie,Ne,dt,St){return 70}var $t=[null,[],[]];function Bn(Y,ie){var Ne=$t[Y];ie===0||ie===10?((Y===1?E:L)(rt(Ne,0)),Ne.length=0):Ne.push(ie)}function rr(Y,ie,Ne,dt){for(var St=0,xt=0;xt<Ne;xt++){var ot=le[ie>>>2],nt=le[ie+4>>>2];ie+=8;for(var Gt=0;Gt<nt;Gt++)Bn(Y,pe[ot+Gt>>>0]);St+=nt}return le[dt>>>2]=St,0}function Rt(Y){var ie=e["_"+Y];return ie}function Jt(Y,ie){ee.set(Y,ie>>>0)}function rn(Y,ie,Ne,dt,St){var xt={string:en=>{var ar=0;if(en!=null&&en!==0){var yr=(en.length<<2)+1;ar=dr(yr),Z(en,ar,yr)}return ar},array:en=>{var ar=dr(en.length);return Jt(en,ar),ar}};function ot(en){return ie==="string"?X(en):ie==="boolean"?Boolean(en):en}var nt=Rt(Y),Gt=[],vn=0;if(dt)for(var tr=0;tr<dt.length;tr++){var _r=xt[Ne[tr]];_r?(vn===0&&(vn=hr()),Gt[tr]=_r(dt[tr])):Gt[tr]=dt[tr]}var mr=nt.apply(null,Gt);function Ia(en){return vn!==0&&gr(vn),ot(en)}return mr=Ia(mr),mr}function an(Y,ie,Ne,dt){Ne=Ne||[];var St=Ne.every(ot=>ot==="number"||ot==="boolean"),xt=ie!=="string";return xt&&St&&!dt?Rt(Y):function(){return rn(Y,ie,Ne,arguments,dt)}}var Dn={abort:et,emscripten_get_heap_max:Wt,emscripten_memcpy_big:Ut,emscripten_resize_heap:wn,fd_close:Mt,fd_seek:Kt,fd_write:rr},tn=pn(),fn=e.___wasm_call_ctors=function(){return(fn=e.___wasm_call_ctors=e.asm.__wasm_call_ctors).apply(null,arguments)},kn=e._init=function(){return(kn=e._init=e.asm.init).apply(null,arguments)},jn=e._init_with_threads_count=function(){return(jn=e._init_with_threads_count=e.asm.init_with_threads_count).apply(null,arguments)},Qn=e._get_threads_count=function(){return(Qn=e._get_threads_count=e.asm.get_threads_count).apply(null,arguments)},In=e._register_tensor=function(){return(In=e._register_tensor=e.asm.register_tensor).apply(null,arguments)},Zt=e._dispose_data=function(){return(Zt=e._dispose_data=e.asm.dispose_data).apply(null,arguments)},De=e._dispose=function(){return(De=e._dispose=e.asm.dispose).apply(null,arguments)},Cn=e._Abs=function(){return(Cn=e._Abs=e.asm.Abs).apply(null,arguments)},dn=e._Acos=function(){return(dn=e._Acos=e.asm.Acos).apply(null,arguments)},Pn=e._Acosh=function(){return(Pn=e._Acosh=e.asm.Acosh).apply(null,arguments)},mn=e._Add=function(){return(mn=e._Add=e.asm.Add).apply(null,arguments)},qn=e._AddN=function(){return(qn=e._AddN=e.asm.AddN).apply(null,arguments)},Gn=e._All=function(){return(Gn=e._All=e.asm.All).apply(null,arguments)},Rn=e._Any=function(){return(Rn=e._Any=e.asm.Any).apply(null,arguments)},Tn=e._ArgMax=function(){return(Tn=e._ArgMax=e.asm.ArgMax).apply(null,arguments)},Hn=e._ArgMin=function(){return(Hn=e._ArgMin=e.asm.ArgMin).apply(null,arguments)},Ln=e._Asin=function(){return(Ln=e._Asin=e.asm.Asin).apply(null,arguments)},Wn=e._Asinh=function(){return(Wn=e._Asinh=e.asm.Asinh).apply(null,arguments)},er=e._Atan=function(){return(er=e._Atan=e.asm.Atan).apply(null,arguments)},Un=e._Atan2=function(){return(Un=e._Atan2=e.asm.Atan2).apply(null,arguments)},Vn=e._Atanh=function(){return(Vn=e._Atanh=e.asm.Atanh).apply(null,arguments)},Sn=e._AvgPool=function(){return(Sn=e._AvgPool=e.asm.AvgPool).apply(null,arguments)},hn=e._AvgPool3D=function(){return(hn=e._AvgPool3D=e.asm.AvgPool3D).apply(null,arguments)},zn=e._AvgPool3DGrad=function(){return(zn=e._AvgPool3DGrad=e.asm.AvgPool3DGrad).apply(null,arguments)},En=e._AvgPoolGrad=function(){return(En=e._AvgPoolGrad=e.asm.AvgPoolGrad).apply(null,arguments)},Xt=e._BatchMatMul=function(){return(Xt=e._BatchMatMul=e.asm.BatchMatMul).apply(null,arguments)},Vt=e._Bincount=function(){return(Vt=e._Bincount=e.asm.Bincount).apply(null,arguments)},On=e._BitwiseAnd=function(){return(On=e._BitwiseAnd=e.asm.BitwiseAnd).apply(null,arguments)},Kn=e._Ceil=function(){return(Kn=e._Ceil=e.asm.Ceil).apply(null,arguments)},Yn=e._ClipByValue=function(){return(Yn=e._ClipByValue=e.asm.ClipByValue).apply(null,arguments)},xn=e._Conv2D=function(){return(xn=e._Conv2D=e.asm.Conv2D).apply(null,arguments)},Lt=e._Conv2DBackpropInput=function(){return(Lt=e._Conv2DBackpropInput=e.asm.Conv2DBackpropInput).apply(null,arguments)},Xn=e._Conv3D=function(){return(Xn=e._Conv3D=e.asm.Conv3D).apply(null,arguments)},sn=e._Conv3DBackpropFilterV2=function(){return(sn=e._Conv3DBackpropFilterV2=e.asm.Conv3DBackpropFilterV2).apply(null,arguments)},Qt=e._Conv3DBackpropInputV2=function(){return(Qt=e._Conv3DBackpropInputV2=e.asm.Conv3DBackpropInputV2).apply(null,arguments)},on=e._Cos=function(){return(on=e._Cos=e.asm.Cos).apply(null,arguments)},$n=e._Cosh=function(){return($n=e._Cosh=e.asm.Cosh).apply(null,arguments)},Jn=e._CropAndResize=function(){return(Jn=e._CropAndResize=e.asm.CropAndResize).apply(null,arguments)},gn=e._Cumprod=function(){return(gn=e._Cumprod=e.asm.Cumprod).apply(null,arguments)},Zn=e._Cumsum=function(){return(Zn=e._Cumsum=e.asm.Cumsum).apply(null,arguments)},An=e._DenseBincount=function(){return(An=e._DenseBincount=e.asm.DenseBincount).apply(null,arguments)},a=e._DepthToSpace=function(){return(a=e._DepthToSpace=e.asm.DepthToSpace).apply(null,arguments)},u=e._DepthwiseConv2dNative=function(){return(u=e._DepthwiseConv2dNative=e.asm.DepthwiseConv2dNative).apply(null,arguments)},p=e._Diag=function(){return(p=e._Diag=e.asm.Diag).apply(null,arguments)},x=e._Dilation2D=function(){return(x=e._Dilation2D=e.asm.Dilation2D).apply(null,arguments)},B=e._Dilation2DBackpropFilter=function(){return(B=e._Dilation2DBackpropFilter=e.asm.Dilation2DBackpropFilter).apply(null,arguments)},J=e._Dilation2DBackpropInput=function(){return(J=e._Dilation2DBackpropInput=e.asm.Dilation2DBackpropInput).apply(null,arguments)},W=e._Elu=function(){return(W=e._Elu=e.asm.Elu).apply(null,arguments)},Q=e._EluGrad=function(){return(Q=e._EluGrad=e.asm.EluGrad).apply(null,arguments)},ce=e._Equal=function(){return(ce=e._Equal=e.asm.Equal).apply(null,arguments)},_e=e._Erf=function(){return(_e=e._Erf=e.asm.Erf).apply(null,arguments)},Re=e._Exp=function(){return(Re=e._Exp=e.asm.Exp).apply(null,arguments)},at=e._Expm1=function(){return(at=e._Expm1=e.asm.Expm1).apply(null,arguments)},ze=e._FlipLeftRight=function(){return(ze=e._FlipLeftRight=e.asm.FlipLeftRight).apply(null,arguments)},Ee=e._Floor=function(){return(Ee=e._Floor=e.asm.Floor).apply(null,arguments)},Ie=e._FloorDiv=function(){return(Ie=e._FloorDiv=e.asm.FloorDiv).apply(null,arguments)},Pe=e._FusedBatchNorm=function(){return(Pe=e._FusedBatchNorm=e.asm.FusedBatchNorm).apply(null,arguments)},He=e._FusedConv2D=function(){return(He=e._FusedConv2D=e.asm.FusedConv2D).apply(null,arguments)},Ze=e._FusedDepthwiseConv2D=function(){return(Ze=e._FusedDepthwiseConv2D=e.asm.FusedDepthwiseConv2D).apply(null,arguments)},Ct=e._Gather=function(){return(Ct=e._Gather=e.asm.Gather).apply(null,arguments)},pt=e._GatherNd=function(){return(pt=e._GatherNd=e.asm.GatherNd).apply(null,arguments)},Ft=e._Greater=function(){return(Ft=e._Greater=e.asm.Greater).apply(null,arguments)},It=e._GreaterEqual=function(){return(It=e._GreaterEqual=e.asm.GreaterEqual).apply(null,arguments)},Le=e._IsFinite=function(){return(Le=e._IsFinite=e.asm.IsFinite).apply(null,arguments)},Qe=e._IsInf=function(){return(Qe=e._IsInf=e.asm.IsInf).apply(null,arguments)},st=e._IsNan=function(){return(st=e._IsNan=e.asm.IsNan).apply(null,arguments)},$e=e._LRN=function(){return($e=e._LRN=e.asm.LRN).apply(null,arguments)},tt=e._LRNGrad=function(){return(tt=e._LRNGrad=e.asm.LRNGrad).apply(null,arguments)},qe=e._LeakyRelu=function(){return(qe=e._LeakyRelu=e.asm.LeakyRelu).apply(null,arguments)},Mn=e._Less=function(){return(Mn=e._Less=e.asm.Less).apply(null,arguments)},pr=e._LessEqual=function(){return(pr=e._LessEqual=e.asm.LessEqual).apply(null,arguments)},fr=e._LinSpace=function(){return(fr=e._LinSpace=e.asm.LinSpace).apply(null,arguments)},or=e._Log=function(){return(or=e._Log=e.asm.Log).apply(null,arguments)},t=e._Log1p=function(){return(t=e._Log1p=e.asm.Log1p).apply(null,arguments)},c=e._LogicalAnd=function(){return(c=e._LogicalAnd=e.asm.LogicalAnd).apply(null,arguments)},g=e._LogicalNot=function(){return(g=e._LogicalNot=e.asm.LogicalNot).apply(null,arguments)},k=e._LogicalOr=function(){return(k=e._LogicalOr=e.asm.LogicalOr).apply(null,arguments)},N=e._LogicalXor=function(){return(N=e._LogicalXor=e.asm.LogicalXor).apply(null,arguments)},O=e._Max=function(){return(O=e._Max=e.asm.Max).apply(null,arguments)},D=e._MaxPool=function(){return(D=e._MaxPool=e.asm.MaxPool).apply(null,arguments)},z=e._MaxPool3D=function(){return(z=e._MaxPool3D=e.asm.MaxPool3D).apply(null,arguments)},$=e._MaxPool3DGrad=function(){return($=e._MaxPool3DGrad=e.asm.MaxPool3DGrad).apply(null,arguments)},fe=e._MaxPoolGrad=function(){return(fe=e._MaxPoolGrad=e.asm.MaxPoolGrad).apply(null,arguments)},Ce=e._MaxPoolWithArgmax=function(){return(Ce=e._MaxPoolWithArgmax=e.asm.MaxPoolWithArgmax).apply(null,arguments)},Be=e._Maximum=function(){return(Be=e._Maximum=e.asm.Maximum).apply(null,arguments)},Ge=e._Mean=function(){return(Ge=e._Mean=e.asm.Mean).apply(null,arguments)},xe=e._Min=function(){return(xe=e._Min=e.asm.Min).apply(null,arguments)},Ye=e._Minimum=function(){return(Ye=e._Minimum=e.asm.Minimum).apply(null,arguments)},ct=e._MirrorPad=function(){return(ct=e._MirrorPad=e.asm.MirrorPad).apply(null,arguments)},bt=e._Mod=function(){return(bt=e._Mod=e.asm.Mod).apply(null,arguments)},_t=e._Multinomial=function(){return(_t=e._Multinomial=e.asm.Multinomial).apply(null,arguments)},Bt=e._Multiply=function(){return(Bt=e._Multiply=e.asm.Multiply).apply(null,arguments)},qt=e._Neg=function(){return(qt=e._Neg=e.asm.Neg).apply(null,arguments)},Yt=e._NonMaxSuppressionV3=function(){return(Yt=e._NonMaxSuppressionV3=e.asm.NonMaxSuppressionV3).apply(null,arguments)},ft=e._NonMaxSuppressionV4=function(){return(ft=e._NonMaxSuppressionV4=e.asm.NonMaxSuppressionV4).apply(null,arguments)},Tt=e._NonMaxSuppressionV5=function(){return(Tt=e._NonMaxSuppressionV5=e.asm.NonMaxSuppressionV5).apply(null,arguments)},Fn=e._NotEqual=function(){return(Fn=e._NotEqual=e.asm.NotEqual).apply(null,arguments)},Sr=e._OneHot=function(){return(Sr=e._OneHot=e.asm.OneHot).apply(null,arguments)},xr=e._PadV2=function(){return(xr=e._PadV2=e.asm.PadV2).apply(null,arguments)},Ar=e._Pow=function(){return(Ar=e._Pow=e.asm.Pow).apply(null,arguments)},Mr=e._Prelu=function(){return(Mr=e._Prelu=e.asm.Prelu).apply(null,arguments)},Fr=e._Prod=function(){return(Fr=e._Prod=e.asm.Prod).apply(null,arguments)},Nr=e._RealDiv=function(){return(Nr=e._RealDiv=e.asm.RealDiv).apply(null,arguments)},Dr=e._Reciprocal=function(){return(Dr=e._Reciprocal=e.asm.Reciprocal).apply(null,arguments)},Pr=e._Relu=function(){return(Pr=e._Relu=e.asm.Relu).apply(null,arguments)},Rr=e._Relu6=function(){return(Rr=e._Relu6=e.asm.Relu6).apply(null,arguments)},Tr=e._ResizeBilinear=function(){return(Tr=e._ResizeBilinear=e.asm.ResizeBilinear).apply(null,arguments)},Er=e._ResizeBilinearGrad=function(){return(Er=e._ResizeBilinearGrad=e.asm.ResizeBilinearGrad).apply(null,arguments)},Or=e._ResizeNearestNeighbor=function(){return(Or=e._ResizeNearestNeighbor=e.asm.ResizeNearestNeighbor).apply(null,arguments)},Br=e._ResizeNearestNeighborGrad=function(){return(Br=e._ResizeNearestNeighborGrad=e.asm.ResizeNearestNeighborGrad).apply(null,arguments)},Gr=e._Reverse=function(){return(Gr=e._Reverse=e.asm.Reverse).apply(null,arguments)},Hr=e._RotateWithOffset=function(){return(Hr=e._RotateWithOffset=e.asm.RotateWithOffset).apply(null,arguments)},Lr=e._Round=function(){return(Lr=e._Round=e.asm.Round).apply(null,arguments)},Wr=e._Rsqrt=function(){return(Wr=e._Rsqrt=e.asm.Rsqrt).apply(null,arguments)},Ur=e._ScatterNd=function(){return(Ur=e._ScatterNd=e.asm.ScatterNd).apply(null,arguments)},Vr=e._SearchSorted=function(){return(Vr=e._SearchSorted=e.asm.SearchSorted).apply(null,arguments)},zr=e._SelectV2=function(){return(zr=e._SelectV2=e.asm.SelectV2).apply(null,arguments)},Kr=e._Selu=function(){return(Kr=e._Selu=e.asm.Selu).apply(null,arguments)},Yr=e._Sigmoid=function(){return(Yr=e._Sigmoid=e.asm.Sigmoid).apply(null,arguments)},Xr=e._Sign=function(){return(Xr=e._Sign=e.asm.Sign).apply(null,arguments)},$r=e._Sin=function(){return($r=e._Sin=e.asm.Sin).apply(null,arguments)},Jr=e._Sinh=function(){return(Jr=e._Sinh=e.asm.Sinh).apply(null,arguments)},Zr=e._Softmax=function(){return(Zr=e._Softmax=e.asm.Softmax).apply(null,arguments)},Qr=e._Softplus=function(){return(Qr=e._Softplus=e.asm.Softplus).apply(null,arguments)},qr=e._SparseFillEmptyRows=function(){return(qr=e._SparseFillEmptyRows=e.asm.SparseFillEmptyRows).apply(null,arguments)},ea=e._SparseReshape=function(){return(ea=e._SparseReshape=e.asm.SparseReshape).apply(null,arguments)},ta=e._SparseSegmentReduction=function(){return(ta=e._SparseSegmentReduction=e.asm.SparseSegmentReduction).apply(null,arguments)},na=e._SparseToDense=function(){return(na=e._SparseToDense=e.asm.SparseToDense).apply(null,arguments)},ra=e._Sqrt=function(){return(ra=e._Sqrt=e.asm.Sqrt).apply(null,arguments)},aa=e._Square=function(){return(aa=e._Square=e.asm.Square).apply(null,arguments)},sa=e._SquaredDifference=function(){return(sa=e._SquaredDifference=e.asm.SquaredDifference).apply(null,arguments)},oa=e._Step=function(){return(oa=e._Step=e.asm.Step).apply(null,arguments)},ia=e._StridedSlice=function(){return(ia=e._StridedSlice=e.asm.StridedSlice).apply(null,arguments)},la=e._Sub=function(){return(la=e._Sub=e.asm.Sub).apply(null,arguments)},ua=e._Sum=function(){return(ua=e._Sum=e.asm.Sum).apply(null,arguments)},ca=e._Tan=function(){return(ca=e._Tan=e.asm.Tan).apply(null,arguments)},pa=e._Tanh=function(){return(pa=e._Tanh=e.asm.Tanh).apply(null,arguments)},fa=e._TensorScatterUpdate=function(){return(fa=e._TensorScatterUpdate=e.asm.TensorScatterUpdate).apply(null,arguments)},da=e._Tile=function(){return(da=e._Tile=e.asm.Tile).apply(null,arguments)},ma=e._TopK=function(){return(ma=e._TopK=e.asm.TopK).apply(null,arguments)},ha=e._Transform=function(){return(ha=e._Transform=e.asm.Transform).apply(null,arguments)},ga=e._Transpose=function(){return(ga=e._Transpose=e.asm.Transpose).apply(null,arguments)},va=e.__FusedMatMul=function(){return(va=e.__FusedMatMul=e.asm._FusedMatMul).apply(null,arguments)},_a=e._malloc=function(){return(_a=e._malloc=e.asm.malloc).apply(null,arguments)},ya=e._free=function(){return(ya=e._free=e.asm.free).apply(null,arguments)},ba=e.___errno_location=function(){return(ba=e.___errno_location=e.asm.__errno_location).apply(null,arguments)},hr=e.stackSave=function(){return(hr=e.stackSave=e.asm.stackSave).apply(null,arguments)},gr=e.stackRestore=function(){return(gr=e.stackRestore=e.asm.stackRestore).apply(null,arguments)},dr=e.stackAlloc=function(){return(dr=e.stackAlloc=e.asm.stackAlloc).apply(null,arguments)},wa=e.dynCall_iijjiiii=function(){return(wa=e.dynCall_iijjiiii=e.asm.dynCall_iijjiiii).apply(null,arguments)},ka=e.dynCall_jiji=function(){return(ka=e.dynCall_jiji=e.asm.dynCall_jiji).apply(null,arguments)};e.cwrap=an;var ir;mt=function Y(){ir||vr(),ir||(mt=Y)};function vr(Y){if(Y=Y||_,Ae>0||(gt(),Ae>0))return;function ie(){ir||(ir=!0,e.calledRun=!0,!be&&(Ke(),w(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),wt()))}e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1),ie()},1)):ie()}if(e.preInit)for(typeof e.preInit=="function"&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();vr();var lr;f&&(lr={uncaughtException:s.listeners("uncaughtException").filter(function(Y){return!f.uncaughtException.indexOf(Y)>-1}),unhandledRejection:s.listeners("unhandledRejection").filter(function(Y){return!f.unhandledRejection.indexOf(Y)>-1})});var ur;if(typeof S!="undefined")ur=S;else if(typeof WasmBackendModuleThreadedSimd!="undefined")ur=WasmBackendModuleThreadedSimd;else throw new Error("Could not find wasm module in post.js");if(lr){var ja=ur._dispose;ur._dispose=function(){ja(),lr.uncaughtException.forEach(function(Y){s.removeListener("uncaughtException",Y)}),lr.unhandledRejection.forEach(function(Y){s.removeListener("unhandledRejection",Y)})}}return S.ready}})();R.exports=h},{caec8bcdfe9960aa:"5xM3z","4a73517fc90a67e6":"34v0S",bb12b68c9d27b74:"34v0S"}],gZXkh:[function(n,R,i){/** @license See the LICENSE file. */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"version",()=>s);const s="4.9.0"},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8W571":[function(n,R,i){R.exports=n("d57c9427fe80583").getBundleURL("d5l0U")+n("d42c87647b0ba1fb").resolve("2cQDf")},{d57c9427fe80583:"bGZ1f",d42c87647b0ba1fb:"6jNRu"}],i8iSb:[function(n,R,i){R.exports=n("58797ea39eb0f6a9").getBundleURL("d5l0U")+n("3219ee86225d30ad").resolve("h0L5O")},{"58797ea39eb0f6a9":"bGZ1f","3219ee86225d30ad":"6jNRu"}],"8vNwt":[function(n,R,i){R.exports=n("862a0d2043e51d66").getBundleURL("d5l0U")+n("aa98f08e975ae6d0").resolve("htpB9")},{"862a0d2043e51d66":"bGZ1f",aa98f08e975ae6d0:"6jNRu"}],"78EPD":[function(n,R,i){var o=arguments[3];(function(){"use strict";var s;function l(a){var u=0;return function(){return u<a.length?{done:!1,value:a[u++]}:{done:!0}}}var h=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,p){return a==Array.prototype||a==Object.prototype||(a[u]=p.value),a};function I(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof o=="object"&&o];for(var u=0;u<a.length;++u){var p=a[u];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var S=I(this);function e(a,u){if(u)e:{var p=S;a=a.split(".");for(var x=0;x<a.length-1;x++){var B=a[x];if(!(B in p))break e;p=p[B]}a=a[a.length-1],x=p[a],u=u(x),u!=x&&u!=null&&h(p,a,{configurable:!0,writable:!0,value:u})}}e("Symbol",function(a){function u(J){if(this instanceof u)throw new TypeError("Symbol is not a constructor");return new p(x+(J||"")+"_"+B++,J)}function p(J,W){this.g=J,h(this,"description",{configurable:!0,writable:!0,value:W})}if(a)return a;p.prototype.toString=function(){return this.g};var x="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",B=0;return u}),e("Symbol.iterator",function(a){if(a)return a;a=Symbol("Symbol.iterator");for(var u="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),p=0;p<u.length;p++){var x=S[u[p]];typeof x=="function"&&typeof x.prototype[a]!="function"&&h(x.prototype,a,{configurable:!0,writable:!0,value:function(){return w(l(this))}})}return a});function w(a){return a={next:a},a[Symbol.iterator]=function(){return this},a}function m(a){var u=typeof Symbol!="undefined"&&Symbol.iterator&&a[Symbol.iterator];return u?u.call(a):{next:l(a)}}function f(a){if(!(a instanceof Array)){a=m(a);for(var u,p=[];!(u=a.next()).done;)p.push(u.value);a=p}return a}var d=typeof Object.create=="function"?Object.create:function(a){function u(){}return u.prototype=a,new u},_;if(typeof Object.setPrototypeOf=="function")_=Object.setPrototypeOf;else{var y;e:{var j={a:!0},r={};try{r.__proto__=j,y=r.a;break e}catch{}y=!1}_=y?function(a,u){if(a.__proto__=u,a.__proto__!==u)throw new TypeError(a+" is not extensible");return a}:null}var b=_;function v(a,u){if(a.prototype=d(u.prototype),a.prototype.constructor=a,b)b(a,u);else for(var p in u)if(p!="prototype")if(Object.defineProperties){var x=Object.getOwnPropertyDescriptor(u,p);x&&Object.defineProperty(a,p,x)}else a[p]=u[p];a.ea=u.prototype}function C(){this.l=!1,this.i=null,this.h=void 0,this.g=1,this.s=this.m=0,this.j=null}function M(a){if(a.l)throw new TypeError("Generator is already running");a.l=!0}C.prototype.o=function(a){this.h=a};function P(a,u){a.j={U:u,V:!0},a.g=a.m||a.s}C.prototype.return=function(a){this.j={return:a},this.g=this.s};function F(a,u,p){return a.g=p,{value:u}}function U(a){this.g=new C,this.h=a}function T(a,u){M(a.g);var p=a.g.i;return p?V(a,"return"in p?p.return:function(x){return{value:x,done:!0}},u,a.g.return):(a.g.return(u),H(a))}function V(a,u,p,x){try{var B=u.call(a.g.i,p);if(!(B instanceof Object))throw new TypeError("Iterator result "+B+" is not an object");if(!B.done)return a.g.l=!1,B;var J=B.value}catch(W){return a.g.i=null,P(a.g,W),H(a)}return a.g.i=null,x.call(a.g,J),H(a)}function H(a){for(;a.g.g;)try{var u=a.h(a.g);if(u)return a.g.l=!1,{value:u.value,done:!1}}catch(p){a.g.h=void 0,P(a.g,p)}if(a.g.l=!1,a.g.j){if(u=a.g.j,a.g.j=null,u.V)throw u.U;return{value:u.return,done:!0}}return{value:void 0,done:!0}}function K(a){this.next=function(u){return M(a.g),a.g.i?u=V(a,a.g.i.next,u,a.g.o):(a.g.o(u),u=H(a)),u},this.throw=function(u){return M(a.g),a.g.i?u=V(a,a.g.i.throw,u,a.g.o):(P(a.g,u),u=H(a)),u},this.return=function(u){return T(a,u)},this[Symbol.iterator]=function(){return this}}function E(a,u){return u=new K(new U(u)),b&&a.prototype&&b(u,a.prototype),u}function L(a,u){a instanceof String&&(a+="");var p=0,x=!1,B={next:function(){if(!x&&p<a.length){var J=p++;return{value:u(J,a[J]),done:!1}}return x=!0,{done:!0,value:void 0}}};return B[Symbol.iterator]=function(){return B},B}var re=typeof Object.assign=="function"?Object.assign:function(a,u){for(var p=1;p<arguments.length;p++){var x=arguments[p];if(x)for(var B in x)Object.prototype.hasOwnProperty.call(x,B)&&(a[B]=x[B])}return a};e("Object.assign",function(a){return a||re}),e("Promise",function(a){function u(W){this.h=0,this.i=void 0,this.g=[],this.o=!1;var Q=this.j();try{W(Q.resolve,Q.reject)}catch(ce){Q.reject(ce)}}function p(){this.g=null}function x(W){return W instanceof u?W:new u(function(Q){Q(W)})}if(a)return a;p.prototype.h=function(W){if(this.g==null){this.g=[];var Q=this;this.i(function(){Q.l()})}this.g.push(W)};var B=S.setTimeout;p.prototype.i=function(W){B(W,0)},p.prototype.l=function(){for(;this.g&&this.g.length;){var W=this.g;this.g=[];for(var Q=0;Q<W.length;++Q){var ce=W[Q];W[Q]=null;try{ce()}catch(_e){this.j(_e)}}}this.g=null},p.prototype.j=function(W){this.i(function(){throw W})},u.prototype.j=function(){function W(_e){return function(Re){ce||(ce=!0,_e.call(Q,Re))}}var Q=this,ce=!1;return{resolve:W(this.C),reject:W(this.l)}},u.prototype.C=function(W){if(W===this)this.l(new TypeError("A Promise cannot resolve to itself"));else if(W instanceof u)this.F(W);else{e:switch(typeof W){case"object":var Q=W!=null;break e;case"function":Q=!0;break e;default:Q=!1}Q?this.u(W):this.m(W)}},u.prototype.u=function(W){var Q=void 0;try{Q=W.then}catch(ce){this.l(ce);return}typeof Q=="function"?this.G(Q,W):this.m(W)},u.prototype.l=function(W){this.s(2,W)},u.prototype.m=function(W){this.s(1,W)},u.prototype.s=function(W,Q){if(this.h!=0)throw Error("Cannot settle("+W+", "+Q+"): Promise already settled in state"+this.h);this.h=W,this.i=Q,this.h===2&&this.D(),this.A()},u.prototype.D=function(){var W=this;B(function(){if(W.B()){var Q=S.console;typeof Q!="undefined"&&Q.error(W.i)}},1)},u.prototype.B=function(){if(this.o)return!1;var W=S.CustomEvent,Q=S.Event,ce=S.dispatchEvent;return typeof ce=="undefined"?!0:(typeof W=="function"?W=new W("unhandledrejection",{cancelable:!0}):typeof Q=="function"?W=new Q("unhandledrejection",{cancelable:!0}):(W=S.document.createEvent("CustomEvent"),W.initCustomEvent("unhandledrejection",!1,!0,W)),W.promise=this,W.reason=this.i,ce(W))},u.prototype.A=function(){if(this.g!=null){for(var W=0;W<this.g.length;++W)J.h(this.g[W]);this.g=null}};var J=new p;return u.prototype.F=function(W){var Q=this.j();W.J(Q.resolve,Q.reject)},u.prototype.G=function(W,Q){var ce=this.j();try{W.call(Q,ce.resolve,ce.reject)}catch(_e){ce.reject(_e)}},u.prototype.then=function(W,Q){function ce(ze,Ee){return typeof ze=="function"?function(Ie){try{_e(ze(Ie))}catch(Pe){Re(Pe)}}:Ee}var _e,Re,at=new u(function(ze,Ee){_e=ze,Re=Ee});return this.J(ce(W,_e),ce(Q,Re)),at},u.prototype.catch=function(W){return this.then(void 0,W)},u.prototype.J=function(W,Q){function ce(){switch(_e.h){case 1:W(_e.i);break;case 2:Q(_e.i);break;default:throw Error("Unexpected state: "+_e.h)}}var _e=this;this.g==null?J.h(ce):this.g.push(ce),this.o=!0},u.resolve=x,u.reject=function(W){return new u(function(Q,ce){ce(W)})},u.race=function(W){return new u(function(Q,ce){for(var _e=m(W),Re=_e.next();!Re.done;Re=_e.next())x(Re.value).J(Q,ce)})},u.all=function(W){var Q=m(W),ce=Q.next();return ce.done?x([]):new u(function(_e,Re){function at(Ie){return function(Pe){ze[Ie]=Pe,Ee--,Ee==0&&_e(ze)}}var ze=[],Ee=0;do ze.push(void 0),Ee++,x(ce.value).J(at(ze.length-1),Re),ce=Q.next();while(!ce.done)})},u}),e("Object.is",function(a){return a||function(u,p){return u===p?u!==0||1/u==1/p:u!==u&&p!==p}}),e("Array.prototype.includes",function(a){return a||function(u,p){var x=this;x instanceof String&&(x=String(x));var B=x.length;for(p=p||0,0>p&&(p=Math.max(p+B,0));p<B;p++){var J=x[p];if(J===u||Object.is(J,u))return!0}return!1}}),e("String.prototype.includes",function(a){return a||function(u,p){if(this==null)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(u instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return this.indexOf(u,p||0)!==-1}}),e("Array.prototype.keys",function(a){return a||function(){return L(this,function(u){return u})}});var ne=this||self;function oe(a,u){a=a.split(".");var p=ne;a[0]in p||typeof p.execScript=="undefined"||p.execScript("var "+a[0]);for(var x;a.length&&(x=a.shift());)a.length||u===void 0?p[x]&&p[x]!==Object.prototype[x]?p=p[x]:p=p[x]={}:p[x]=u}function he(a,u){return u=String.fromCharCode.apply(null,u),a==null?u:a+u}var be,ve=typeof TextDecoder!="undefined",ke,We=typeof TextEncoder!="undefined";function rt(a){if(We)a=(ke||(ke=new TextEncoder)).encode(a);else{var u=void 0;u=u===void 0?!1:u;for(var p=0,x=new Uint8Array(3*a.length),B=0;B<a.length;B++){var J=a.charCodeAt(B);if(128>J)x[p++]=J;else{if(2048>J)x[p++]=J>>6|192;else{if(55296<=J&&57343>=J){if(56319>=J&&B<a.length){var W=a.charCodeAt(++B);if(56320<=W&&57343>=W){J=1024*(J-55296)+W-56320+65536,x[p++]=J>>18|240,x[p++]=J>>12&63|128,x[p++]=J>>6&63|128,x[p++]=J&63|128;continue}else B--}if(u)throw Error("Found an unpaired surrogate");J=65533}x[p++]=J>>12|224,x[p++]=J>>6&63|128}x[p++]=J&63|128}}a=x.subarray(0,p)}return a}var X={},q=null;function Z(a,u){u===void 0&&(u=0),pe(),u=X[u];for(var p=Array(Math.floor(a.length/3)),x=u[64]||"",B=0,J=0;B<a.length-2;B+=3){var W=a[B],Q=a[B+1],ce=a[B+2],_e=u[W>>2];W=u[(W&3)<<4|Q>>4],Q=u[(Q&15)<<2|ce>>6],ce=u[ce&63],p[J++]=_e+W+Q+ce}switch(_e=0,ce=x,a.length-B){case 2:_e=a[B+1],ce=u[(_e&15)<<2]||x;case 1:a=a[B],p[J]=u[a>>2]+u[(a&3)<<4|_e>>4]+ce+x}return p.join("")}function te(a){var u=a.length,p=3*u/4;p%3?p=Math.floor(p):"=.".indexOf(a[u-1])!=-1&&(p="=.".indexOf(a[u-2])!=-1?p-2:p-1);var x=new Uint8Array(p),B=0;return ee(a,function(J){x[B++]=J}),x.subarray(0,B)}function ee(a,u){function p(ce){for(;x<a.length;){var _e=a.charAt(x++),Re=q[_e];if(Re!=null)return Re;if(!/^[\s\xa0]*$/.test(_e))throw Error("Unknown base64 encoding at char: "+_e)}return ce}pe();for(var x=0;;){var B=p(-1),J=p(0),W=p(64),Q=p(64);if(Q===64&&B===-1)break;u(B<<2|J>>4),W!=64&&(u(J<<4&240|W>>2),Q!=64&&u(W<<6&192|Q))}}function pe(){if(!q){q={};for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),u=["+/=","+/","-_=","-_.","-_"],p=0;5>p;p++){var x=a.concat(u[p].split(""));X[p]=x;for(var B=0;B<x.length;B++){var J=x[B];q[J]===void 0&&(q[J]=B)}}}}var se=typeof Uint8Array.prototype.slice=="function",me;function ue(a,u,p){return u===p?me||(me=new Uint8Array(0)):se?a.slice(u,p):new Uint8Array(a.subarray(u,p))}var le=0,ae=0;function ge(a,u){u=u===void 0?{}:u,u=u.v===void 0?!1:u.v,this.h=null,this.g=this.j=this.l=0,this.m=!1,this.v=u,a&&je(this,a)}function je(a,u){u=u.constructor===Uint8Array?u:u.constructor===ArrayBuffer?new Uint8Array(u):u.constructor===Array?new Uint8Array(u):u.constructor===String?te(u):u instanceof Uint8Array?new Uint8Array(u.buffer,u.byteOffset,u.byteLength):new Uint8Array(0),a.h=u,a.l=0,a.j=a.h.length,a.g=a.l}ge.prototype.reset=function(){this.g=this.l};function ye(a){for(var u=128,p=0,x=0,B=0;4>B&&128<=u;B++)u=a.h[a.g++],p|=(u&127)<<7*B;if(128<=u&&(u=a.h[a.g++],p|=(u&127)<<28,x|=(u&127)>>4),128<=u)for(B=0;5>B&&128<=u;B++)u=a.h[a.g++],x|=(u&127)<<7*B+3;if(128>u)return a=p>>>0,u=x>>>0,(x=u&2147483648)&&(a=~a+1>>>0,u=~u>>>0,a==0&&(u=u+1>>>0)),a=4294967296*u+(a>>>0),x?-a:a;a.m=!0}ge.prototype.i=function(){var a=this.h,u=a[this.g],p=u&127;return 128>u?(this.g+=1,p):(u=a[this.g+1],p|=(u&127)<<7,128>u?(this.g+=2,p):(u=a[this.g+2],p|=(u&127)<<14,128>u?(this.g+=3,p):(u=a[this.g+3],p|=(u&127)<<21,128>u?(this.g+=4,p):(u=a[this.g+4],p|=(u&15)<<28,128>u?(this.g+=5,p>>>0):(this.g+=5,128<=a[this.g++]&&128<=a[this.g++]&&128<=a[this.g++]&&128<=a[this.g++]&&this.g++,p)))))},ge.prototype.o=function(){var a=this.h[this.g],u=this.h[this.g+1],p=this.h[this.g+2],x=this.h[this.g+3];return this.g+=4,p=(a<<0|u<<8|p<<16|x<<24)>>>0,a=2*(p>>31)+1,u=p>>>23&255,p&=8388607,u==255?p?NaN:1/0*a:u==0?a*Math.pow(2,-149)*p:a*Math.pow(2,u-150)*(p+Math.pow(2,23))};var Se=[];function Oe(){this.g=new Uint8Array(64),this.h=0}Oe.prototype.push=function(a){if(!(this.h+1<this.g.length)){var u=this.g;this.g=new Uint8Array(Math.ceil(1+2*this.g.length)),this.g.set(u)}this.g[this.h++]=a},Oe.prototype.length=function(){return this.h},Oe.prototype.end=function(){var a=this.g,u=this.h;return this.h=0,ue(a,0,u)};function it(a,u){for(;127<u;)a.push(u&127|128),u>>>=7;a.push(u)}function ut(a){var u={},p=u.N===void 0?!1:u.N;this.o={v:u.v===void 0?!1:u.v},this.N=p,u=this.o,Se.length?(p=Se.pop(),u&&(p.v=u.v),a&&je(p,a),a=p):a=new ge(a,u),this.g=a,this.m=this.g.g,this.h=this.i=this.l=-1,this.j=!1}ut.prototype.reset=function(){this.g.reset(),this.h=this.l=-1};function Fe(a){var u=a.g;if((u=u.g==u.j)||(u=a.j)||(u=a.g,u=u.m||0>u.g||u.g>u.j),u)return!1;a.m=a.g.g,u=a.g.i();var p=u&7;return p!=0&&p!=5&&p!=1&&p!=2&&p!=3&&p!=4?(a.j=!0,!1):(a.i=u,a.l=u>>>3,a.h=p,!0)}function Ue(a){switch(a.h){case 0:if(a.h!=0)Ue(a);else{for(a=a.g;a.h[a.g]&128;)a.g++;a.g++}break;case 1:a.h!=1?Ue(a):(a=a.g,a.g+=8);break;case 2:if(a.h!=2)Ue(a);else{var u=a.g.i();a=a.g,a.g+=u}break;case 5:a.h!=5?Ue(a):(a=a.g,a.g+=4);break;case 3:u=a.l;do{if(!Fe(a)){a.j=!0;break}if(a.h==4){a.l!=u&&(a.j=!0);break}Ue(a)}while(1);break;default:a.j=!0}}function gt(a,u,p){var x=a.g.j,B=a.g.i(),J=a.g.g+B;if(a.g.j=J,p(u,a),p=J-a.g.g,p!==0)throw Error("Message parsing ended unexpectedly. Expected to read "+B+" bytes, instead read "+(B-p)+" bytes, either the data ended unexpectedly or the message misreported its own length");return a.g.g=J,a.g.j=x,u}function Ke(a){return a.g.o()}function wt(a){var u=a.g.i();a=a.g;var p=a.g;a.g+=u,a=a.h;var x;if(ve)(x=be)||(x=be=new TextDecoder("utf-8",{fatal:!1})),x=x.decode(a.subarray(p,p+u));else{u=p+u;for(var B=[],J=null,W,Q,ce;p<u;)W=a[p++],128>W?B.push(W):224>W?p>=u?B.push(65533):(Q=a[p++],194>W||(Q&192)!=128?(p--,B.push(65533)):B.push((W&31)<<6|Q&63)):240>W?p>=u-1?B.push(65533):(Q=a[p++],(Q&192)!=128||W===224&&160>Q||W===237&&160<=Q||((x=a[p++])&192)!=128?(p--,B.push(65533)):B.push((W&15)<<12|(Q&63)<<6|x&63)):244>=W?p>=u-2?B.push(65533):(Q=a[p++],(Q&192)!=128||(W<<28)+(Q-144)>>30!=0||((x=a[p++])&192)!=128||((ce=a[p++])&192)!=128?(p--,B.push(65533)):(W=(W&7)<<18|(Q&63)<<12|(x&63)<<6|ce&63,W-=65536,B.push((W>>10&1023)+55296,(W&1023)+56320))):B.push(65533),8192<=B.length&&(J=he(J,B),B.length=0);x=he(J,B)}return x}function kt(a,u,p){var x=a.g.i();for(x=a.g.g+x;a.g.g<x;)p.push(u.call(a.g))}function Dt(a,u){a.h==2?kt(a,ge.prototype.o,u):u.push(Ke(a))}function Et(){this.h=[],this.i=0,this.g=new Oe}function Ae(a,u){u.length!==0&&(a.h.push(u),a.i+=u.length)}function lt(a){var u=a.i+a.g.length();if(u===0)return new Uint8Array(0);u=new Uint8Array(u);for(var p=a.h,x=p.length,B=0,J=0;J<x;J++){var W=p[J];W.length!==0&&(u.set(W,B),B+=W.length)}return p=a.g,x=p.h,x!==0&&(u.set(p.g.subarray(0,x),B),p.h=0),a.h=[u],u}function mt(a,u,p){if(p!=null){it(a.g,8*u+5),a=a.g;var x=p;x=(p=0>x?1:0)?-x:x,x===0?0<1/x?le=ae=0:(ae=0,le=2147483648):isNaN(x)?(ae=0,le=2147483647):34028234663852886e22<x?(ae=0,le=(p<<31|2139095040)>>>0):11754943508222875e-54>x?(x=Math.round(x/Math.pow(2,-149)),ae=0,le=(p<<31|x)>>>0):(u=Math.floor(Math.log(x)/Math.LN2),x*=Math.pow(2,-u),x=Math.round(8388608*x),16777216<=x&&++u,ae=0,le=(p<<31|u+127<<23|x&8388607)>>>0),p=le,a.push(p>>>0&255),a.push(p>>>8&255),a.push(p>>>16&255),a.push(p>>>24&255)}}var At=typeof Uint8Array=="function";function un(a,u,p){if(a!=null)return typeof a=="object"?At&&a instanceof Uint8Array?p(a):Ot(a,u,p):u(a)}function Ot(a,u,p){if(Array.isArray(a)){for(var x=Array(a.length),B=0;B<a.length;B++)x[B]=un(a[B],u,p);return Array.isArray(a)&&a.W&&Pt(x),x}x={};for(B in a)x[B]=un(a[B],u,p);return x}function nn(a){return typeof a=="number"?isFinite(a)?a:String(a):a}var yn={W:{value:!0,configurable:!0}};function Pt(a){return Array.isArray(a)&&!Object.isFrozen(a)&&Object.defineProperties(a,yn),a}var jt;function vt(a,u,p){var x=jt;jt=null,a||(a=x),x=this.constructor.ca,a||(a=x?[x]:[]),this.j=x?0:-1,this.m=this.g=null,this.h=a;e:{if(x=this.h.length,a=x-1,x&&(x=this.h[a],!(x===null||typeof x!="object"||Array.isArray(x)||At&&x instanceof Uint8Array))){this.l=a-this.j,this.i=x;break e}u!==void 0&&-1<u?(this.l=Math.max(u,a+1-this.j),this.i=null):this.l=Number.MAX_VALUE}if(p)for(u=0;u<p.length;u++)a=p[u],a<this.l?(a+=this.j,(x=this.h[a])?Pt(x):this.h[a]=cn):(pn(this),(x=this.i[a])?Pt(x):this.i[a]=cn)}var cn=Object.freeze(Pt([]));function pn(a){var u=a.l+a.j;a.h[u]||(a.i=a.h[u]={})}function ht(a,u,p){return u===-1?null:(p===void 0?0:p)||u>=a.l?a.i?a.i[u]:void 0:a.h[u+a.j]}function bn(a,u){var p=p===void 0?!1:p,x=ht(a,u,p);return x==null&&(x=cn),x===cn&&(x=Pt([]),Ve(a,u,x,p)),x}function zt(a){var u=bn(a,3);if(a.m||(a.m={}),!a.m[3]){for(var p=0;p<u.length;p++)u[p]=+u[p];a.m[3]=!0}return u}function yt(a,u,p){return a=ht(a,u),a??p}function et(a,u,p){return a=ht(a,u),a=a==null?a:+a,a??(p===void 0?0:p)}function Ve(a,u,p,x){(x===void 0?0:x)||u>=a.l?(pn(a),a.i[u]=p):a.h[u+a.j]=p}function Wt(a,u,p){if(p===-1)return null;if(a.g||(a.g={}),!a.g[p]){var x=ht(a,p,!1);x&&(a.g[p]=new u(x))}return a.g[p]}function Ut(a,u){a.g||(a.g={});var p=a.g[1];if(!p){var x=bn(a,1);p=[];for(var B=0;B<x.length;B++)p[B]=new u(x[B]);a.g[1]=p}return p}function Nn(a,u,p){var x=x===void 0?!1:x;a.g||(a.g={});var B=p&&Ht(p,!1);a.g[u]=p,Ve(a,u,B,x)}function wn(a,u,p,x){var B=Ut(a,p);u=u||new p,a=bn(a,1),x!=null?(B.splice(x,0,u),a.splice(x,0,Ht(u,!1))):(B.push(u),a.push(Ht(u,!1)))}vt.prototype.toJSON=function(){var a=Ht(this,!1);return Ot(a,nn,Z)};function Ht(a,u){if(a.g)for(var p in a.g){var x=a.g[p];if(Array.isArray(x))for(var B=0;B<x.length;B++)x[B]&&Ht(x[B],u);else x&&Ht(x,u)}return a.h}vt.prototype.toString=function(){return Ht(this,!1).toString()};function Mt(a,u){if(a=a.o){Ae(u,u.g.end());for(var p=0;p<a.length;p++)Ae(u,a[p])}}function Kt(a,u){if(u.h==4)return!1;var p=u.m;return Ue(u),u.N||(u=ue(u.g.h,p,u.g.g),(p=a.o)?p.push(u):a.o=[u]),!0}function $t(a){vt.call(this,a,-1,rr)}v($t,vt),$t.prototype.getRows=function(){return ht(this,1)},$t.prototype.getCols=function(){return ht(this,2)},$t.prototype.getPackedDataList=function(){return zt(this)},$t.prototype.getLayout=function(){return yt(this,4,0)};function Bn(a,u){for(;Fe(u);)switch(u.i){case 8:var p=u.g.i();Ve(a,1,p);break;case 16:p=u.g.i(),Ve(a,2,p);break;case 29:case 26:Dt(u,a.getPackedDataList());break;case 32:p=ye(u.g),Ve(a,4,p);break;default:if(!Kt(a,u))return a}return a}var rr=[3];function Rt(a,u){var p=void 0;return new(p||(p=Promise))(function(x,B){function J(ce){try{Q(u.next(ce))}catch(_e){B(_e)}}function W(ce){try{Q(u.throw(ce))}catch(_e){B(_e)}}function Q(ce){ce.done?x(ce.value):new p(function(_e){_e(ce.value)}).then(J,W)}Q((u=u.apply(a,void 0)).next())})}function Jt(a){vt.call(this,a)}v(Jt,vt);function rn(a,u){for(;Fe(u);)switch(u.i){case 8:var p=u.g.i();Ve(a,1,p);break;case 21:p=Ke(u),Ve(a,2,p);break;case 26:p=wt(u),Ve(a,3,p);break;case 34:p=wt(u),Ve(a,4,p);break;default:if(!Kt(a,u))return a}return a}function an(a){vt.call(this,a,-1,Dn)}v(an,vt),an.prototype.addClassification=function(a,u){return wn(this,a,Jt,u),this};var Dn=[1];function tn(a){vt.call(this,a)}v(tn,vt);function fn(a,u){for(;Fe(u);)switch(u.i){case 13:var p=Ke(u);Ve(a,1,p);break;case 21:p=Ke(u),Ve(a,2,p);break;case 29:p=Ke(u),Ve(a,3,p);break;case 37:p=Ke(u),Ve(a,4,p);break;case 45:p=Ke(u),Ve(a,5,p);break;default:if(!Kt(a,u))return a}return a}function kn(a){vt.call(this,a,-1,Qn)}v(kn,vt);function jn(a){e:{var u=new kn;for(a=new ut(a);Fe(a);)switch(a.i){case 10:var p=gt(a,new tn,fn);wn(u,p,tn,void 0);break;default:if(!Kt(u,a))break e}}return u}var Qn=[1];function In(a){vt.call(this,a)}v(In,vt);function Zt(a){vt.call(this,a,-1,Cn)}v(Zt,vt),Zt.prototype.getVertexType=function(){return yt(this,1,0)},Zt.prototype.getPrimitiveType=function(){return yt(this,2,0)},Zt.prototype.getVertexBufferList=function(){return zt(this)},Zt.prototype.getIndexBufferList=function(){return bn(this,4)};function De(a,u){for(;Fe(u);)switch(u.i){case 8:var p=ye(u.g);Ve(a,1,p);break;case 16:p=ye(u.g),Ve(a,2,p);break;case 29:case 26:Dt(u,a.getVertexBufferList());break;case 32:case 34:p=u;var x=a.getIndexBufferList();p.h==2?kt(p,ge.prototype.i,x):x.push(p.g.i());break;default:if(!Kt(a,u))return a}return a}var Cn=[3,4];function dn(a){vt.call(this,a)}v(dn,vt),dn.prototype.getMesh=function(){return Wt(this,Zt,1)},dn.prototype.getPoseTransformMatrix=function(){return Wt(this,$t,2)};function Pn(a){e:{var u=new dn;for(a=new ut(a);Fe(a);)switch(a.i){case 10:var p=gt(a,new Zt,De);Nn(u,1,p);break;case 18:p=gt(a,new $t,Bn),Nn(u,2,p);break;default:if(!Kt(u,a))break e}}return u}function mn(a,u,p){if(p=a.createShader(p===0?a.VERTEX_SHADER:a.FRAGMENT_SHADER),a.shaderSource(p,u),a.compileShader(p),!a.getShaderParameter(p,a.COMPILE_STATUS))throw Error(`Could not compile WebGL shader.

`+a.getShaderInfoLog(p));return p}function qn(a){return Ut(a,Jt).map(function(u){return{index:yt(u,1,0),Y:et(u,2),label:ht(u,3)!=null?yt(u,3,""):void 0,displayName:ht(u,4)!=null?yt(u,4,""):void 0}})}function Gn(a){return{x:et(a,1),y:et(a,2),z:et(a,3),visibility:ht(a,4)!=null?et(a,4):void 0}}function Rn(a,u){this.h=a,this.g=u,this.l=0}function Tn(a,u,p){return Hn(a,u),typeof a.g.canvas.transferToImageBitmap=="function"?Promise.resolve(a.g.canvas.transferToImageBitmap()):p?Promise.resolve(a.g.canvas):typeof createImageBitmap=="function"?createImageBitmap(a.g.canvas):(a.i===void 0&&(a.i=document.createElement("canvas")),new Promise(function(x){a.i.height=a.g.canvas.height,a.i.width=a.g.canvas.width,a.i.getContext("2d",{}).drawImage(a.g.canvas,0,0,a.g.canvas.width,a.g.canvas.height),x(a.i)}))}function Hn(a,u){var p=a.g;if(a.m===void 0){var x=mn(p,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,0),B=mn(p,`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D sampler0;
  void main(){
    gl_FragColor = texture2D(sampler0, vTex);
  }`,1),J=p.createProgram();if(p.attachShader(J,x),p.attachShader(J,B),p.linkProgram(J),!p.getProgramParameter(J,p.LINK_STATUS))throw Error(`Could not compile WebGL program.

`+p.getProgramInfoLog(J));x=a.m=J,p.useProgram(x),B=p.getUniformLocation(x,"sampler0"),a.j={I:p.getAttribLocation(x,"aVertex"),H:p.getAttribLocation(x,"aTex"),da:B},a.s=p.createBuffer(),p.bindBuffer(p.ARRAY_BUFFER,a.s),p.enableVertexAttribArray(a.j.I),p.vertexAttribPointer(a.j.I,2,p.FLOAT,!1,0,0),p.bufferData(p.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),p.STATIC_DRAW),p.bindBuffer(p.ARRAY_BUFFER,null),a.o=p.createBuffer(),p.bindBuffer(p.ARRAY_BUFFER,a.o),p.enableVertexAttribArray(a.j.H),p.vertexAttribPointer(a.j.H,2,p.FLOAT,!1,0,0),p.bufferData(p.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),p.STATIC_DRAW),p.bindBuffer(p.ARRAY_BUFFER,null),p.uniform1i(B,0)}x=a.j,p.useProgram(a.m),p.canvas.width=u.width,p.canvas.height=u.height,p.viewport(0,0,u.width,u.height),p.activeTexture(p.TEXTURE0),a.h.bindTexture2d(u.glName),p.enableVertexAttribArray(x.I),p.bindBuffer(p.ARRAY_BUFFER,a.s),p.vertexAttribPointer(x.I,2,p.FLOAT,!1,0,0),p.enableVertexAttribArray(x.H),p.bindBuffer(p.ARRAY_BUFFER,a.o),p.vertexAttribPointer(x.H,2,p.FLOAT,!1,0,0),p.bindFramebuffer(p.DRAW_FRAMEBUFFER?p.DRAW_FRAMEBUFFER:p.FRAMEBUFFER,null),p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT),p.colorMask(!0,!0,!0,!0),p.drawArrays(p.TRIANGLE_FAN,0,4),p.disableVertexAttribArray(x.I),p.disableVertexAttribArray(x.H),p.bindBuffer(p.ARRAY_BUFFER,null),a.h.bindTexture2d(0)}function Ln(a){this.g=a}var Wn=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]);function er(a,u){return u+a}function Un(a,u){window[a]=u}function Vn(a){var u=document.createElement("script");return u.setAttribute("src",a),u.setAttribute("crossorigin","anonymous"),new Promise(function(p){u.addEventListener("load",function(){p()},!1),u.addEventListener("error",function(){p()},!1),document.body.appendChild(u)})}function Sn(){return Rt(this,function a(){return E(a,function(u){switch(u.g){case 1:return u.m=2,F(u,WebAssembly.instantiate(Wn),4);case 4:u.g=3,u.m=0;break;case 2:return u.m=0,u.j=null,u.return(!1);case 3:return u.return(!0)}})})}function hn(a){if(this.g=a,this.listeners={},this.j={},this.F={},this.m={},this.s={},this.G=this.o=this.R=!0,this.C=Promise.resolve(),this.P="",this.B={},this.locateFile=a&&a.locateFile||er,typeof window=="object")var u=window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/";else if(typeof location!="undefined")u=location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/";else throw Error("solutions can only be loaded on a web page or in a web worker");if(this.S=u,a.options){u=m(Object.keys(a.options));for(var p=u.next();!p.done;p=u.next()){p=p.value;var x=a.options[p].default;x!==void 0&&(this.j[p]=typeof x=="function"?x():x)}}}s=hn.prototype,s.close=function(){return this.i&&this.i.delete(),Promise.resolve()};function zn(a,u){return a.g.files===void 0?[]:typeof a.g.files=="function"?a.g.files(u):a.g.files}function En(a){return Rt(a,function u(){var p=this,x,B,J,W,Q,ce,_e,Re,at,ze,Ee;return E(u,function(Ie){switch(Ie.g){case 1:return x=p,p.R?(B=zn(p,p.j),F(Ie,Sn(),2)):Ie.return();case 2:if(J=Ie.h,typeof window=="object")return Un("createMediapipeSolutionsWasm",{locateFile:p.locateFile}),Un("createMediapipeSolutionsPackedAssets",{locateFile:p.locateFile}),ce=B.filter(function(Pe){return Pe.data!==void 0}),_e=B.filter(function(Pe){return Pe.data===void 0}),Re=Promise.all(ce.map(function(Pe){var He=On(x,Pe.url);if(Pe.path!==void 0){var Ze=Pe.path;He=He.then(function(Ct){return x.overrideFile(Ze,Ct),Promise.resolve(Ct)})}return He})),at=Promise.all(_e.map(function(Pe){return Pe.simd===void 0||Pe.simd&&J||!Pe.simd&&!J?Vn(x.locateFile(Pe.url,x.S)):Promise.resolve()})).then(function(){return Rt(x,function Pe(){var He,Ze,Ct=this;return E(Pe,function(pt){if(pt.g==1)return He=window.createMediapipeSolutionsWasm,Ze=window.createMediapipeSolutionsPackedAssets,F(pt,He(Ze),2);Ct.h=pt.h,pt.g=0})})}),ze=function(){return Rt(x,function Pe(){var He=this;return E(Pe,function(Ze){return He.g.graph&&He.g.graph.url?Ze=F(Ze,On(He,He.g.graph.url),0):(Ze.g=0,Ze=void 0),Ze})})}(),F(Ie,Promise.all([at,Re,ze]),7);if(typeof importScripts!="function")throw Error("solutions can only be loaded on a web page or in a web worker");return W=B.filter(function(Pe){return Pe.simd===void 0||Pe.simd&&J||!Pe.simd&&!J}).map(function(Pe){return x.locateFile(Pe.url,x.S)}),importScripts.apply(null,f(W)),F(Ie,createMediapipeSolutionsWasm(Module),6);case 6:p.h=Ie.h,p.l=new OffscreenCanvas(1,1),p.h.canvas=p.l,Q=p.h.GL.createContext(p.l,{antialias:!1,alpha:!1,ba:typeof WebGL2RenderingContext!="undefined"?2:1}),p.h.GL.makeContextCurrent(Q),Ie.g=4;break;case 7:if(p.l=document.createElement("canvas"),Ee=p.l.getContext("webgl2",{}),!Ee&&(Ee=p.l.getContext("webgl",{}),!Ee))return alert("Failed to create WebGL canvas context when passing video frame."),Ie.return();p.D=Ee,p.h.canvas=p.l,p.h.createContext(p.l,!0,!0,{});case 4:p.i=new p.h.SolutionWasm,p.R=!1,Ie.g=0}})})}function Xt(a){return Rt(a,function u(){var p=this,x,B,J,W,Q,ce,_e,Re;return E(u,function(at){if(at.g==1){if(p.g.graph&&p.g.graph.url&&p.P===p.g.graph.url)return at.return();if(p.o=!0,!p.g.graph||!p.g.graph.url){at.g=2;return}return p.P=p.g.graph.url,F(at,On(p,p.g.graph.url),3)}for(at.g!=2&&(x=at.h,p.i.loadGraph(x)),B=m(Object.keys(p.B)),J=B.next();!J.done;J=B.next())W=J.value,p.i.overrideFile(W,p.B[W]);if(p.B={},p.g.listeners)for(Q=m(p.g.listeners),ce=Q.next();!ce.done;ce=Q.next())_e=ce.value,xn(p,_e);Re=p.j,p.j={},p.setOptions(Re),at.g=0})})}s.reset=function(){return Rt(this,function a(){var u=this;return E(a,function(p){u.i&&(u.i.reset(),u.m={},u.s={}),p.g=0})})},s.setOptions=function(a,u){var p=this;if(u=u||this.g.options){for(var x=[],B=[],J={},W=m(Object.keys(a)),Q=W.next();!Q.done;J={K:J.K,L:J.L},Q=W.next()){var ce=Q.value;ce in this.j&&this.j[ce]===a[ce]||(this.j[ce]=a[ce],Q=u[ce],Q!==void 0&&(Q.onChange&&(J.K=Q.onChange,J.L=a[ce],x.push(function(_e){return function(){return Rt(p,function Re(){var at,ze=this;return E(Re,function(Ee){if(Ee.g==1)return F(Ee,_e.K(_e.L),2);at=Ee.h,at===!0&&(ze.o=!0),Ee.g=0})})}}(J))),Q.graphOptionXref&&(ce={valueNumber:Q.type===1?a[ce]:0,valueBoolean:Q.type===0?a[ce]:!1,valueString:Q.type===2?a[ce]:""},Q=Object.assign(Object.assign(Object.assign({},{calculatorName:"",calculatorIndex:0}),Q.graphOptionXref),ce),B.push(Q))))}(x.length!==0||B.length!==0)&&(this.o=!0,this.A=(this.A===void 0?[]:this.A).concat(B),this.u=(this.u===void 0?[]:this.u).concat(x))}};function Vt(a){return Rt(a,function u(){var p=this,x,B,J,W,Q,ce,_e;return E(u,function(Re){switch(Re.g){case 1:if(!p.o)return Re.return();if(!p.u){Re.g=2;break}x=m(p.u),B=x.next();case 3:if(B.done){Re.g=5;break}return J=B.value,F(Re,J(),4);case 4:B=x.next(),Re.g=3;break;case 5:p.u=void 0;case 2:if(p.A){for(W=new p.h.GraphOptionChangeRequestList,Q=m(p.A),ce=Q.next();!ce.done;ce=Q.next())_e=ce.value,W.push_back(_e);p.i.changeOptions(W),W.delete(),p.A=void 0}p.o=!1,Re.g=0}})})}s.initialize=function(){return Rt(this,function a(){var u=this;return E(a,function(p){return p.g==1?F(p,En(u),2):p.g!=3?F(p,Xt(u),3):F(p,Vt(u),0)})})};function On(a,u){return Rt(a,function p(){var x=this,B,J;return E(p,function(W){return u in x.F?W.return(x.F[u]):(B=x.locateFile(u,""),J=fetch(B).then(function(Q){return Q.arrayBuffer()}),x.F[u]=J,W.return(J))})})}s.overrideFile=function(a,u){this.i?this.i.overrideFile(a,u):this.B[a]=u},s.clearOverriddenFiles=function(){this.B={},this.i&&this.i.clearOverriddenFiles()},s.send=function(a,u){return Rt(this,function p(){var x=this,B,J,W,Q,ce,_e,Re,at,ze;return E(p,function(Ee){switch(Ee.g){case 1:return x.g.inputs?(B=1e3*(u??performance.now()),F(Ee,x.C,2)):Ee.return();case 2:return F(Ee,x.initialize(),3);case 3:for(J=new x.h.PacketDataList,W=m(Object.keys(a)),Q=W.next();!Q.done;Q=W.next())if(ce=Q.value,_e=x.g.inputs[ce]){e:{var Ie=x,Pe=a[ce];switch(_e.type){case"video":var He=Ie.m[_e.stream];if(He||(He=new Rn(Ie.h,Ie.D),Ie.m[_e.stream]=He),Ie=He,Ie.l===0&&(Ie.l=Ie.h.createTexture()),typeof HTMLVideoElement!="undefined"&&Pe instanceof HTMLVideoElement){var Ze=Pe.videoWidth;He=Pe.videoHeight}else typeof HTMLImageElement!="undefined"&&Pe instanceof HTMLImageElement?(Ze=Pe.naturalWidth,He=Pe.naturalHeight):(Ze=Pe.width,He=Pe.height);He={glName:Ie.l,width:Ze,height:He},Ze=Ie.g,Ze.canvas.width=He.width,Ze.canvas.height=He.height,Ze.activeTexture(Ze.TEXTURE0),Ie.h.bindTexture2d(Ie.l),Ze.texImage2D(Ze.TEXTURE_2D,0,Ze.RGBA,Ze.RGBA,Ze.UNSIGNED_BYTE,Pe),Ie.h.bindTexture2d(0),Ie=He;break e;case"detections":for(He=Ie.m[_e.stream],He||(He=new Ln(Ie.h),Ie.m[_e.stream]=He),Ie=He,Ie.data||(Ie.data=new Ie.g.DetectionListData),Ie.data.reset(Pe.length),He=0;He<Pe.length;++He){Ze=Pe[He];var Ct=Ie.data,pt=Ct.setBoundingBox,Ft=He,It=Ze.T,Le=new In;Ve(Le,1,It.Z),Ve(Le,2,It.$),Ve(Le,3,It.height),Ve(Le,4,It.width),Ve(Le,5,It.rotation),Ve(Le,6,It.X);var Qe=It=new Et;mt(Qe,1,ht(Le,1)),mt(Qe,2,ht(Le,2)),mt(Qe,3,ht(Le,3)),mt(Qe,4,ht(Le,4)),mt(Qe,5,ht(Le,5));var st=ht(Le,6);if(st!=null&&st!=null){it(Qe.g,48);var $e=Qe.g,tt=st;st=0>tt,tt=Math.abs(tt);var qe=tt>>>0;for(tt=Math.floor((tt-qe)/4294967296),tt>>>=0,st&&(tt=~tt>>>0,qe=(~qe>>>0)+1,4294967295<qe&&(qe=0,tt++,4294967295<tt&&(tt=0))),le=qe,ae=tt,st=le,qe=ae;0<qe||127<st;)$e.push(st&127|128),st=(st>>>7|qe<<25)>>>0,qe>>>=7;$e.push(st)}if(Mt(Le,Qe),It=lt(It),pt.call(Ct,Ft,It),Ze.O)for(Ct=0;Ct<Ze.O.length;++Ct)Le=Ze.O[Ct],Qe=!!Le.visibility,pt=Ie.data,Ft=pt.addNormalizedLandmark,It=He,Le=Object.assign(Object.assign({},Le),{visibility:Qe?Le.visibility:0}),Qe=new tn,Ve(Qe,1,Le.x),Ve(Qe,2,Le.y),Ve(Qe,3,Le.z),Le.visibility&&Ve(Qe,4,Le.visibility),$e=Le=new Et,mt($e,1,ht(Qe,1)),mt($e,2,ht(Qe,2)),mt($e,3,ht(Qe,3)),mt($e,4,ht(Qe,4)),mt($e,5,ht(Qe,5)),Mt(Qe,$e),Le=lt(Le),Ft.call(pt,It,Le);if(Ze.M)for(Ct=0;Ct<Ze.M.length;++Ct){if(pt=Ie.data,Ft=pt.addClassification,It=He,Le=Ze.M[Ct],Qe=new Jt,Ve(Qe,2,Le.Y),Le.index&&Ve(Qe,1,Le.index),Le.label&&Ve(Qe,3,Le.label),Le.displayName&&Ve(Qe,4,Le.displayName),$e=Le=new Et,qe=ht(Qe,1),qe!=null&&qe!=null)if(it($e.g,8),st=$e.g,0<=qe)it(st,qe);else{for(tt=0;9>tt;tt++)st.push(qe&127|128),qe>>=7;st.push(1)}mt($e,2,ht(Qe,2)),st=ht(Qe,3),st!=null&&(st=rt(st),it($e.g,26),it($e.g,st.length),Ae($e,$e.g.end()),Ae($e,st)),st=ht(Qe,4),st!=null&&(st=rt(st),it($e.g,34),it($e.g,st.length),Ae($e,$e.g.end()),Ae($e,st)),Mt(Qe,$e),Le=lt(Le),Ft.call(pt,It,Le)}}Ie=Ie.data;break e;default:Ie={}}}switch(Re=Ie,at=_e.stream,_e.type){case"video":J.pushTexture2d(Object.assign(Object.assign({},Re),{stream:at,timestamp:B}));break;case"detections":ze=Re,ze.stream=at,ze.timestamp=B,J.pushDetectionList(ze);break;default:throw Error("Unknown input config type: '"+_e.type+"'")}}return x.i.send(J),F(Ee,x.C,4);case 4:J.delete(),Ee.g=0}})})};function Kn(a,u,p){return Rt(a,function x(){var B,J,W,Q,ce,_e,Re=this,at,ze,Ee,Ie,Pe,He,Ze,Ct;return E(x,function(pt){switch(pt.g){case 1:if(!p)return pt.return(u);for(B={},J=0,W=m(Object.keys(p)),Q=W.next();!Q.done;Q=W.next())ce=Q.value,_e=p[ce],typeof _e!="string"&&_e.type==="texture"&&u[_e.stream]!==void 0&&++J;1<J&&(Re.G=!1),at=m(Object.keys(p)),Q=at.next();case 2:if(Q.done){pt.g=4;break}if(ze=Q.value,Ee=p[ze],typeof Ee=="string")return Ze=B,Ct=ze,F(pt,Yn(Re,ze,u[Ee]),14);if(Ie=u[Ee.stream],Ee.type==="detection_list"){if(Ie){for(var Ft=Ie.getRectList(),It=Ie.getLandmarksList(),Le=Ie.getClassificationsList(),Qe=[],st=0;st<Ft.size();++st){var $e=Ft.get(st);e:{var tt=new In;for($e=new ut($e);Fe($e);)switch($e.i){case 13:var qe=Ke($e);Ve(tt,1,qe);break;case 21:qe=Ke($e),Ve(tt,2,qe);break;case 29:qe=Ke($e),Ve(tt,3,qe);break;case 37:qe=Ke($e),Ve(tt,4,qe);break;case 45:qe=Ke($e),Ve(tt,5,qe);break;case 48:qe=ye($e.g),Ve(tt,6,qe);break;default:if(!Kt(tt,$e))break e}}tt={Z:et(tt,1),$:et(tt,2),height:et(tt,3),width:et(tt,4),rotation:et(tt,5,0),X:yt(tt,6,0)},$e=Ut(jn(It.get(st)),tn).map(Gn);var Mn=Le.get(st);e:for(qe=new an,Mn=new ut(Mn);Fe(Mn);)switch(Mn.i){case 10:qe.addClassification(gt(Mn,new Jt,rn));break;default:if(!Kt(qe,Mn))break e}tt={T:tt,O:$e,M:qn(qe)},Qe.push(tt)}Ft=Qe}else Ft=[];B[ze]=Ft,pt.g=7;break}if(Ee.type==="proto_list"){if(Ie){for(Ft=Array(Ie.size()),It=0;It<Ie.size();It++)Ft[It]=Ie.get(It);Ie.delete()}else Ft=[];B[ze]=Ft,pt.g=7;break}if(Ie===void 0){pt.g=3;break}if(Ee.type==="float_list"){B[ze]=Ie,pt.g=7;break}if(Ee.type==="proto"){B[ze]=Ie,pt.g=7;break}if(Ee.type!=="texture")throw Error("Unknown output config type: '"+Ee.type+"'");return Pe=Re.s[ze],Pe||(Pe=new Rn(Re.h,Re.D),Re.s[ze]=Pe),F(pt,Tn(Pe,Ie,Re.G),13);case 13:He=pt.h,B[ze]=He;case 7:Ee.transform&&B[ze]&&(B[ze]=Ee.transform(B[ze])),pt.g=3;break;case 14:Ze[Ct]=pt.h;case 3:Q=at.next(),pt.g=2;break;case 4:return pt.return(B)}})})}function Yn(a,u,p){return Rt(a,function x(){var B=this,J;return E(x,function(W){return typeof p=="number"||p instanceof Uint8Array||p instanceof B.h.Uint8BlobList?W.return(p):p instanceof B.h.Texture2dDataOut?(J=B.s[u],J||(J=new Rn(B.h,B.D),B.s[u]=J),W.return(Tn(J,p,B.G))):W.return(void 0)})})}function xn(a,u){for(var p=u.name||"$",x=[].concat(f(u.wants)),B=new a.h.StringList,J=m(u.wants),W=J.next();!W.done;W=J.next())B.push_back(W.value);J=a.h.PacketListener.implement({onResults:function(Q){for(var ce={},_e=0;_e<u.wants.length;++_e)ce[x[_e]]=Q.get(_e);var Re=a.listeners[p];Re&&(a.C=Kn(a,ce,u.outs).then(function(at){at=Re(at);for(var ze=0;ze<u.wants.length;++ze){var Ee=ce[x[ze]];typeof Ee=="object"&&Ee.hasOwnProperty&&Ee.hasOwnProperty("delete")&&Ee.delete()}at&&(a.C=at)}))}}),a.i.attachMultiListener(B,J),B.delete()}s.onResults=function(a,u){this.listeners[u||"$"]=a},oe("Solution",hn),oe("OptionType",{BOOL:0,NUMBER:1,aa:2,0:"BOOL",1:"NUMBER",2:"STRING"});function Lt(a){a=Pn(a);var u=a.getMesh();if(!u)return a;var p=new Float32Array(u.getVertexBufferList());u.getVertexBufferList=function(){return p};var x=new Uint32Array(u.getIndexBufferList());return u.getIndexBufferList=function(){return x},a}var Xn={files:[{url:"face_mesh_solution_packed_assets_loader.js"},{simd:!0,url:"face_mesh_solution_simd_wasm_bin.js"},{simd:!1,url:"face_mesh_solution_wasm_bin.js"}],graph:{url:"face_mesh.binarypb"},listeners:[{wants:["multi_face_geometry","image_transformed","multi_face_landmarks"],outs:{image:"image_transformed",multiFaceGeometry:{type:"proto_list",stream:"multi_face_geometry",transform:function(a){return a.map(Lt)}},multiFaceLandmarks:{type:"proto_list",stream:"multi_face_landmarks",transform:function(a){return a.map(function(u){return Ut(jn(u),tn).map(Gn)})}}}}],inputs:{image:{type:"video",stream:"input_frames_gpu"}},options:{useCpuInference:{type:0,graphOptionXref:{calculatorType:"InferenceCalculator",fieldName:"use_cpu_inference"},default:"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document},enableFaceGeometry:{type:0,graphOptionXref:{calculatorName:"EnableFaceGeometryConstant",calculatorType:"ConstantSidePacketCalculator",fieldName:"bool_value"}},selfieMode:{type:0,graphOptionXref:{calculatorType:"GlScalerCalculator",calculatorIndex:1,fieldName:"flip_horizontal"}},maxNumFaces:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorNumFaces",fieldName:"int_value"}},refineLandmarks:{type:0,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorRefineLandmarks",fieldName:"bool_value"}},minDetectionConfidence:{type:1,graphOptionXref:{calculatorType:"TensorsToDetectionsCalculator",calculatorName:"facelandmarkfrontgpu__facedetectionshortrangegpu__facedetectionshortrangecommon__TensorsToDetectionsCalculator",fieldName:"min_score_thresh"}},minTrackingConfidence:{type:1,graphOptionXref:{calculatorType:"ThresholdingCalculator",calculatorName:"facelandmarkfrontgpu__facelandmarkgpu__ThresholdingCalculator",fieldName:"threshold"}},cameraNear:{type:1,graphOptionXref:{calculatorType:"FaceGeometryEnvGeneratorCalculator",fieldName:"near"}},cameraFar:{type:1,graphOptionXref:{calculatorType:"FaceGeometryEnvGeneratorCalculator",fieldName:"far"}},cameraVerticalFovDegrees:{type:1,graphOptionXref:{calculatorType:"FaceGeometryEnvGeneratorCalculator",fieldName:"vertical_fov_degrees"}}}},sn=[[61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]],Qt=[[263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]],on=[[276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]],$n=[[33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]],Jn=[[46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]],gn=[[10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]],Zn=[].concat(f(sn),f(Qt),f(on),f($n),f(Jn),f(gn));function An(a){a=a||{},a=Object.assign(Object.assign({},Xn),a),this.g=new hn(a)}s=An.prototype,s.close=function(){return this.g.close(),Promise.resolve()},s.onResults=function(a){this.g.onResults(a)},s.initialize=function(){return Rt(this,function a(){var u=this;return E(a,function(p){return F(p,u.g.initialize(),0)})})},s.reset=function(){this.g.reset()},s.send=function(a){return Rt(this,function u(){var p=this;return E(u,function(x){return F(x,p.g.send(a),0)})})},s.setOptions=function(a){this.g.setOptions(a)},oe("FACE_GEOMETRY",{Layout:{COLUMN_MAJOR:0,ROW_MAJOR:1,0:"COLUMN_MAJOR",1:"ROW_MAJOR"},PrimitiveType:{TRIANGLE:0,0:"TRIANGLE"},VertexType:{VERTEX_PT:0,0:"VERTEX_PT"},DEFAULT_CAMERA_PARAMS:{verticalFovDegrees:63,near:1,far:1e4}}),oe("FaceMesh",An),oe("FACEMESH_LIPS",sn),oe("FACEMESH_LEFT_EYE",Qt),oe("FACEMESH_LEFT_EYEBROW",on),oe("FACEMESH_LEFT_IRIS",[[474,475],[475,476],[476,477],[477,474]]),oe("FACEMESH_RIGHT_EYE",$n),oe("FACEMESH_RIGHT_EYEBROW",Jn),oe("FACEMESH_RIGHT_IRIS",[[469,470],[470,471],[471,472],[472,469]]),oe("FACEMESH_FACE_OVAL",gn),oe("FACEMESH_CONTOURS",Zn),oe("FACEMESH_TESSELATION",[[127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]]),oe("matrixDataToMatrix",function(a){for(var u=a.getCols(),p=a.getRows(),x=a.getPackedDataList(),B=[],J=0;J<p;J++)B.push(Array(u));for(J=0;J<p;J++)for(var W=0;W<u;W++){var Q=a.getLayout()===1?J*u+W:W*p+J;B[J][W]=x[Q]}return B}),oe("VERSION","0.4.1633559619")}).call(this)},{}],fX6lB:[function(n,R,i){/**
    * @license
    * Copyright 2023 Google LLC. All Rights Reserved.
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
    */var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"MediaPipeFaceDetectorMediaPipe",()=>f),o.export(i,"MediaPipeFaceDetectorTfjs",()=>ke),o.export(i,"SupportedModels",()=>ve),o.export(i,"createDetector",()=>rt);var s=n("@mediapipe/face_detection"),l=n("@tensorflow/tfjs-core"),h=n("@tensorflow/tfjs-converter"),I=function(){return I=Object.assign||function(X){for(var q,Z=1,te=arguments.length;Z<te;Z++)for(var ee in q=arguments[Z])Object.prototype.hasOwnProperty.call(q,ee)&&(X[ee]=q[ee]);return X},I.apply(this,arguments)};function S(X,q,Z,te){return new(Z||(Z=Promise))(function(ee,pe){function se(le){try{ue(te.next(le))}catch(ae){pe(ae)}}function me(le){try{ue(te.throw(le))}catch(ae){pe(ae)}}function ue(le){var ae;le.done?ee(le.value):(ae=le.value,ae instanceof Z?ae:new Z(function(ge){ge(ae)})).then(se,me)}ue((te=te.apply(X,q||[])).next())})}function e(X,q){var Z,te,ee,pe,se={label:0,sent:function(){if(1&ee[0])throw ee[1];return ee[1]},trys:[],ops:[]};return pe={next:me(0),throw:me(1),return:me(2)},typeof Symbol=="function"&&(pe[Symbol.iterator]=function(){return this}),pe;function me(ue){return function(le){return function(ae){if(Z)throw new TypeError("Generator is already executing.");for(;se;)try{if(Z=1,te&&(ee=2&ae[0]?te.return:ae[0]?te.throw||((ee=te.return)&&ee.call(te),0):te.next)&&!(ee=ee.call(te,ae[1])).done)return ee;switch(te=0,ee&&(ae=[2&ae[0],ee.value]),ae[0]){case 0:case 1:ee=ae;break;case 4:return se.label++,{value:ae[1],done:!1};case 5:se.label++,te=ae[1],ae=[0];continue;case 7:ae=se.ops.pop(),se.trys.pop();continue;default:if(ee=se.trys,!((ee=ee.length>0&&ee[ee.length-1])||ae[0]!==6&&ae[0]!==2)){se=0;continue}if(ae[0]===3&&(!ee||ae[1]>ee[0]&&ae[1]<ee[3])){se.label=ae[1];break}if(ae[0]===6&&se.label<ee[1]){se.label=ee[1],ee=ae;break}if(ee&&se.label<ee[2]){se.label=ee[2],se.ops.push(ae);break}ee[2]&&se.ops.pop(),se.trys.pop();continue}ae=q.call(X,se)}catch(ge){ae=[6,ge],te=0}finally{Z=ee=0}if(5&ae[0])throw ae[1];return{value:ae[0]?ae[1]:void 0,done:!0}}([ue,le])}}}var w=["rightEye","leftEye","noseTip","mouthCenter","rightEarTragion","leftEarTragion"],m={modelType:"short",runtime:"mediapipe",maxFaces:1},f=function(){function X(q){var Z=this;this.width=0,this.height=0,this.selfieMode=!1,this.faceDetectorSolution=new s.FaceDetection({locateFile:function(te,ee){if(q.solutionPath){var pe=q.solutionPath.replace(/\/+$/,"");return"".concat(pe,"/").concat(te)}return"".concat(ee,"/").concat(te)}}),this.faceDetectorSolution.setOptions({selfieMode:this.selfieMode,model:q.modelType}),this.faceDetectorSolution.onResults(function(te){if(Z.height=te.image.height,Z.width=te.image.width,Z.faces=[],te.detections!==null)for(var ee=0,pe=te.detections;ee<pe.length;ee++){var se=pe[ee];Z.faces.push(Z.normalizedToAbsolute(se.landmarks,(me=se.boundingBox,ue=void 0,le=void 0,ae=void 0,ue=me.xCenter-me.width/2,le=ue+me.width,ae=me.yCenter-me.height/2,{xMin:ue,xMax:le,yMin:ae,yMax:ae+me.height,width:me.width,height:me.height})))}var me,ue,le,ae})}return X.prototype.normalizedToAbsolute=function(q,Z){var te=this;return{keypoints:q.map(function(ee,pe){return{x:ee.x*te.width,y:ee.y*te.height,name:w[pe]}}),box:{xMin:Z.xMin*this.width,yMin:Z.yMin*this.height,xMax:Z.xMax*this.width,yMax:Z.yMax*this.height,width:Z.width*this.width,height:Z.height*this.height}}},X.prototype.estimateFaces=function(q,Z){return S(this,void 0,void 0,function(){var te,ee;return e(this,function(pe){switch(pe.label){case 0:return Z&&Z.flipHorizontal&&Z.flipHorizontal!==this.selfieMode&&(this.selfieMode=Z.flipHorizontal,this.faceDetectorSolution.setOptions({selfieMode:this.selfieMode})),q instanceof l.Tensor?(ee=ImageData.bind,[4,l.browser.toPixels(q)]):[3,2];case 1:return te=new(ee.apply(ImageData,[void 0,pe.sent(),q.shape[1],q.shape[0]])),[3,3];case 2:te=q,pe.label=3;case 3:return q=te,[4,this.faceDetectorSolution.send({image:q})];case 4:return pe.sent(),[2,this.faces]}})})},X.prototype.dispose=function(){this.faceDetectorSolution.close()},X.prototype.reset=function(){this.faceDetectorSolution.reset(),this.width=0,this.height=0,this.faces=null,this.selfieMode=!1},X.prototype.initialize=function(){return this.faceDetectorSolution.initialize()},X}();function d(X){return S(this,void 0,void 0,function(){var q,Z;return e(this,function(te){switch(te.label){case 0:return q=function(ee){if(ee==null)return I({},m);var pe=I({},ee);return pe.runtime="mediapipe",pe.modelType==null&&(pe.modelType=m.modelType),pe.maxFaces==null&&(pe.maxFaces=m.maxFaces),pe}(X),[4,(Z=new f(q)).initialize()];case 1:return te.sent(),[2,Z]}})})}function _(X,q,Z,te){var ee=X.width,pe=X.height,se=te?-1:1,me=Math.cos(X.rotation),ue=Math.sin(X.rotation),le=X.xCenter,ae=X.yCenter,ge=1/q,je=1/Z,ye=new Array(16);return ye[0]=ee*me*se*ge,ye[1]=-pe*ue*ge,ye[2]=0,ye[3]=(-.5*ee*me*se+.5*pe*ue+le)*ge,ye[4]=ee*ue*se*je,ye[5]=pe*me*je,ye[6]=0,ye[7]=(-.5*pe*me-.5*ee*ue*se+ae)*je,ye[8]=0,ye[9]=0,ye[10]=ee*ge,ye[11]=0,ye[12]=0,ye[13]=0,ye[14]=0,ye[15]=1,function(Se){if(Se.length!==16)throw new Error("Array length must be 16 but got ".concat(Se.length));return[[Se[0],Se[1],Se[2],Se[3]],[Se[4],Se[5],Se[6],Se[7]],[Se[8],Se[9],Se[10],Se[11]],[Se[12],Se[13],Se[14],Se[15]]]}(ye)}function y(X){return X instanceof l.Tensor?{height:X.shape[0],width:X.shape[1]}:{height:X.height,width:X.width}}function j(X){return X instanceof l.Tensor?X:l.browser.fromPixels(X)}function r(X,q){l.util.assert(X.width!==0,function(){return"".concat(q," width cannot be 0.")}),l.util.assert(X.height!==0,function(){return"".concat(q," height cannot be 0.")})}function b(X,q){var Z=function(te,ee,pe,se){var me=ee-te,ue=se-pe;if(me===0)throw new Error("Original min and max are both ".concat(te,", range cannot be 0."));var le=ue/me;return{scale:le,offset:pe-te*le}}(0,255,q[0],q[1]);return(0,l.tidy)(function(){return(0,l.add)((0,l.mul)(X,Z.scale),Z.offset)})}function v(X,q,Z){var te=q.outputTensorSize,ee=q.keepAspectRatio,pe=q.borderMode,se=q.outputTensorFloatRange,me=y(X),ue=function(je,ye){return ye?{xCenter:ye.xCenter*je.width,yCenter:ye.yCenter*je.height,width:ye.width*je.width,height:ye.height*je.height,rotation:ye.rotation}:{xCenter:.5*je.width,yCenter:.5*je.height,width:je.width,height:je.height,rotation:0}}(me,Z),le=function(je,ye,Se){if(Se===void 0&&(Se=!1),!Se)return{top:0,left:0,right:0,bottom:0};var Oe=ye.height,it=ye.width;r(ye,"targetSize"),r(je,"roi");var ut,Fe,Ue=Oe/it,gt=je.height/je.width,Ke=0,wt=0;return Ue>gt?(ut=je.width,Fe=je.width*Ue,wt=(1-gt/Ue)/2):(ut=je.height/Ue,Fe=je.height,Ke=(1-Ue/gt)/2),je.width=ut,je.height=Fe,{top:wt,left:Ke,right:Ke,bottom:wt}}(ue,te,ee),ae=_(ue,me.width,me.height,!1),ge=(0,l.tidy)(function(){var je=j(X),ye=(0,l.tensor2d)(function(it,ut,Fe){return r(Fe,"inputResolution"),[1/Fe.width*it[0][0]*ut.width,1/Fe.height*it[0][1]*ut.width,it[0][3]*ut.width,1/Fe.width*it[1][0]*ut.height,1/Fe.height*it[1][1]*ut.height,it[1][3]*ut.height,0,0]}(ae,me,te),[1,8]),Se=pe==="zero"?"constant":"nearest",Oe=l.image.transform((0,l.expandDims)((0,l.cast)(je,"float32")),ye,"bilinear",Se,0,[te.height,te.width]);return se!=null?b(Oe,se):Oe});return{imageTensor:ge,padding:le,transformationMatrix:ae}}function C(X){X.reduceBoxesInLowestLayer==null&&(X.reduceBoxesInLowestLayer=!1),X.interpolatedScaleAspectRatio==null&&(X.interpolatedScaleAspectRatio=1),X.fixedAnchorSize==null&&(X.fixedAnchorSize=!1);for(var q=[],Z=0;Z<X.numLayers;){for(var te=[],ee=[],pe=[],se=[],me=Z;me<X.strides.length&&X.strides[me]===X.strides[Z];){var ue=M(X.minScale,X.maxScale,me,X.strides.length);if(me===0&&X.reduceBoxesInLowestLayer)pe.push(1),pe.push(2),pe.push(.5),se.push(.1),se.push(ue),se.push(ue);else{for(var le=0;le<X.aspectRatios.length;++le)pe.push(X.aspectRatios[le]),se.push(ue);if(X.interpolatedScaleAspectRatio>0){var ae=me===X.strides.length-1?1:M(X.minScale,X.maxScale,me+1,X.strides.length);se.push(Math.sqrt(ue*ae)),pe.push(X.interpolatedScaleAspectRatio)}}me++}for(var ge=0;ge<pe.length;++ge){var je=Math.sqrt(pe[ge]);te.push(se[ge]/je),ee.push(se[ge]*je)}var ye=0,Se=0;if(X.featureMapHeight.length>0)ye=X.featureMapHeight[Z],Se=X.featureMapWidth[Z];else{var Oe=X.strides[Z];ye=Math.ceil(X.inputSizeHeight/Oe),Se=Math.ceil(X.inputSizeWidth/Oe)}for(var it=0;it<ye;++it)for(var ut=0;ut<Se;++ut)for(var Fe=0;Fe<te.length;++Fe){var Ue={xCenter:(ut+X.anchorOffsetX)/Se,yCenter:(it+X.anchorOffsetY)/ye,width:0,height:0};X.fixedAnchorSize?(Ue.width=1,Ue.height=1):(Ue.width=ee[Fe],Ue.height=te[Fe]),q.push(Ue)}Z=me}return q}function M(X,q,Z,te){return te===1?.5*(X+q):X+(q-X)*Z/(te-1)}function P(X,q){var Z=q[0],te=q[1];return[Z*X[0]+te*X[1]+X[3],Z*X[4]+te*X[5]+X[7]]}function F(X){return(0,l.tidy)(function(){var q=function(ee){return(0,l.tidy)(function(){return[(0,l.slice)(ee,[0,0,0],[1,-1,1]),(0,l.slice)(ee,[0,0,1],[1,-1,-1])]})}(X),Z=q[0],te=q[1];return{boxes:(0,l.squeeze)(te),logits:(0,l.squeeze)(Z)}})}function U(X,q,Z,te){return S(this,void 0,void 0,function(){var ee,pe,se,me,ue;return e(this,function(le){switch(le.label){case 0:return X.sort(function(ae,ge){return Math.max.apply(Math,ge.score)-Math.max.apply(Math,ae.score)}),ee=(0,l.tensor2d)(X.map(function(ae){return[ae.locationData.relativeBoundingBox.yMin,ae.locationData.relativeBoundingBox.xMin,ae.locationData.relativeBoundingBox.yMax,ae.locationData.relativeBoundingBox.xMax]})),pe=(0,l.tensor1d)(X.map(function(ae){return ae.score[0]})),[4,l.image.nonMaxSuppressionAsync(ee,pe,q,Z)];case 1:return[4,(se=le.sent()).array()];case 2:return me=le.sent(),ue=X.filter(function(ae,ge){return me.indexOf(ge)>-1}),(0,l.dispose)([ee,pe,se]),[2,ue]}})})}function T(X,q,Z){return S(this,void 0,void 0,function(){var te,ee,pe,se,me;return e(this,function(ue){switch(ue.label){case 0:return te=X[0],ee=X[1],pe=function(le,ae,ge){return(0,l.tidy)(function(){var je,ye,Se,Oe;ge.reverseOutputOrder?(ye=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+0],[-1,1])),je=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+1],[-1,1])),Oe=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+2],[-1,1])),Se=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+3],[-1,1]))):(je=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+0],[-1,1])),ye=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+1],[-1,1])),Se=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+2],[-1,1])),Oe=(0,l.squeeze)((0,l.slice)(le,[0,ge.boxCoordOffset+3],[-1,1]))),ye=(0,l.add)((0,l.mul)((0,l.div)(ye,ge.xScale),ae.w),ae.x),je=(0,l.add)((0,l.mul)((0,l.div)(je,ge.yScale),ae.h),ae.y),ge.applyExponentialOnBoxSize?(Se=(0,l.mul)((0,l.exp)((0,l.div)(Se,ge.hScale)),ae.h),Oe=(0,l.mul)((0,l.exp)((0,l.div)(Oe,ge.wScale)),ae.w)):(Se=(0,l.mul)((0,l.div)(Se,ge.hScale),ae.h),Oe=(0,l.mul)((0,l.div)(Oe,ge.wScale),ae.h));var it=(0,l.sub)(je,(0,l.div)(Se,2)),ut=(0,l.sub)(ye,(0,l.div)(Oe,2)),Fe=(0,l.add)(je,(0,l.div)(Se,2)),Ue=(0,l.add)(ye,(0,l.div)(Oe,2)),gt=(0,l.concat)([(0,l.reshape)(it,[ge.numBoxes,1]),(0,l.reshape)(ut,[ge.numBoxes,1]),(0,l.reshape)(Fe,[ge.numBoxes,1]),(0,l.reshape)(Ue,[ge.numBoxes,1])],1);if(ge.numKeypoints)for(var Ke=0;Ke<ge.numKeypoints;++Ke){var wt=ge.keypointCoordOffset+Ke*ge.numValuesPerKeypoint,kt=void 0,Dt=void 0;ge.reverseOutputOrder?(kt=(0,l.squeeze)((0,l.slice)(le,[0,wt],[-1,1])),Dt=(0,l.squeeze)((0,l.slice)(le,[0,wt+1],[-1,1]))):(Dt=(0,l.squeeze)((0,l.slice)(le,[0,wt],[-1,1])),kt=(0,l.squeeze)((0,l.slice)(le,[0,wt+1],[-1,1])));var Et=(0,l.add)((0,l.mul)((0,l.div)(kt,ge.xScale),ae.w),ae.x),Ae=(0,l.add)((0,l.mul)((0,l.div)(Dt,ge.yScale),ae.h),ae.y);gt=(0,l.concat)([gt,(0,l.reshape)(Et,[ge.numBoxes,1]),(0,l.reshape)(Ae,[ge.numBoxes,1])],1)}return gt})}(ee,q,Z),se=(0,l.tidy)(function(){var le=te;return Z.sigmoidScore?(Z.scoreClippingThresh!=null&&(le=(0,l.clipByValue)(te,-Z.scoreClippingThresh,Z.scoreClippingThresh)),le=(0,l.sigmoid)(le)):le}),[4,V(pe,se,Z)];case 1:return me=ue.sent(),(0,l.dispose)([pe,se]),[2,me]}})})}function V(X,q,Z){return S(this,void 0,void 0,function(){var te,ee,pe,se,me,ue,le,ae,ge,je,ye,Se;return e(this,function(Oe){switch(Oe.label){case 0:return te=[],[4,X.data()];case 1:return ee=Oe.sent(),[4,q.data()];case 2:for(pe=Oe.sent(),se=0;se<Z.numBoxes;++se)if(!(Z.minScoreThresh!=null&&pe[se]<Z.minScoreThresh||(me=se*Z.numCoords,ue=H(ee[me+0],ee[me+1],ee[me+2],ee[me+3],pe[se],Z.flipVertically,se),(le=ue.locationData.relativeBoundingBox).width<0||le.height<0))){if(Z.numKeypoints>0)for((ae=ue.locationData).relativeKeypoints=[],ge=Z.numKeypoints*Z.numValuesPerKeypoint,je=0;je<ge;je+=Z.numValuesPerKeypoint)ye=me+Z.keypointCoordOffset+je,Se={x:ee[ye+0],y:Z.flipVertically?1-ee[ye+1]:ee[ye+1]},ae.relativeKeypoints.push(Se);te.push(ue)}return[2,te]}})})}function H(X,q,Z,te,ee,pe,se){return{score:[ee],ind:se,locationData:{relativeBoundingBox:{xMin:q,yMin:pe?1-Z:X,xMax:te,yMax:pe?1-X:Z,width:te-q,height:Z-X}}}}var K={reduceBoxesInLowestLayer:!1,interpolatedScaleAspectRatio:1,featureMapHeight:[],featureMapWidth:[],numLayers:4,minScale:.1484375,maxScale:.75,inputSizeHeight:128,inputSizeWidth:128,anchorOffsetX:.5,anchorOffsetY:.5,strides:[8,16,16,16],aspectRatios:[1],fixedAnchorSize:!0},E={reduceBoxesInLowestLayer:!1,interpolatedScaleAspectRatio:0,featureMapHeight:[],featureMapWidth:[],numLayers:1,minScale:.1484375,maxScale:.75,inputSizeHeight:192,inputSizeWidth:192,anchorOffsetX:.5,anchorOffsetY:.5,strides:[4],aspectRatios:[1],fixedAnchorSize:!0},L={runtime:"tfjs",modelType:"short",maxFaces:1,detectorModelUrl:"https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1"},re={applyExponentialOnBoxSize:!1,flipVertically:!1,ignoreClasses:[],numClasses:1,numBoxes:896,numCoords:16,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:6,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:128,yScale:128,hScale:128,wScale:128,minScoreThresh:.5},ne={applyExponentialOnBoxSize:!1,flipVertically:!1,ignoreClasses:[],numClasses:1,numBoxes:2304,numCoords:16,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:6,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:192,yScale:192,hScale:192,wScale:192,minScoreThresh:.6},oe=.3,he={outputTensorSize:{width:128,height:128},keepAspectRatio:!0,outputTensorFloatRange:[-1,1],borderMode:"zero"},be={outputTensorSize:{width:192,height:192},keepAspectRatio:!0,outputTensorFloatRange:[-1,1],borderMode:"zero"},ve,ke=function(){function X(q,Z,te){this.detectorModel=Z,this.maxFaces=te,q==="full"?(this.imageToTensorConfig=be,this.tensorsToDetectionConfig=ne,this.anchors=C(E)):(this.imageToTensorConfig=he,this.tensorsToDetectionConfig=re,this.anchors=C(K));var ee=(0,l.tensor1d)(this.anchors.map(function(ue){return ue.width})),pe=(0,l.tensor1d)(this.anchors.map(function(ue){return ue.height})),se=(0,l.tensor1d)(this.anchors.map(function(ue){return ue.xCenter})),me=(0,l.tensor1d)(this.anchors.map(function(ue){return ue.yCenter}));this.anchorTensor={x:se,y:me,w:ee,h:pe}}return X.prototype.dispose=function(){this.detectorModel.dispose(),(0,l.dispose)([this.anchorTensor.x,this.anchorTensor.y,this.anchorTensor.w,this.anchorTensor.h])},X.prototype.reset=function(){},X.prototype.detectFaces=function(q,Z){return Z===void 0&&(Z=!1),S(this,void 0,void 0,function(){var te,ee,pe,se,me,ue,le,ae,ge,je,ye;return e(this,function(Se){switch(Se.label){case 0:return q==null?(this.reset(),[2,[]]):(te=(0,l.tidy)(function(){var Oe=(0,l.cast)(j(q),"float32");return Z&&(Oe=(0,l.squeeze)(l.image.flipLeftRight((0,l.expandDims)(Oe,0)),[0])),Oe}),ee=v(te,this.imageToTensorConfig),pe=ee.imageTensor,se=ee.transformationMatrix,me=this.detectorModel.execute(pe,"Identity:0"),ue=F(me),le=ue.boxes,[4,T([ae=ue.logits,le],this.anchorTensor,this.tensorsToDetectionConfig)]);case 1:return(ge=Se.sent()).length===0?((0,l.dispose)([te,pe,me,ae,le]),[2,ge]):[4,U(ge,this.maxFaces,oe)];case 2:return je=Se.sent(),ye=function(Oe,it){Oe===void 0&&(Oe=[]);var ut,Fe=(ut=it,[].concat.apply([],ut));return Oe.forEach(function(Ue){var gt=Ue.locationData;gt.relativeKeypoints.forEach(function(Ae){var lt=P(Fe,[Ae.x,Ae.y]),mt=lt[0],At=lt[1];Ae.x=mt,Ae.y=At});var Ke=gt.relativeBoundingBox,wt=Number.MAX_VALUE,kt=Number.MAX_VALUE,Dt=Number.MIN_VALUE,Et=Number.MIN_VALUE;[[Ke.xMin,Ke.yMin],[Ke.xMin+Ke.width,Ke.yMin],[Ke.xMin+Ke.width,Ke.yMin+Ke.height],[Ke.xMin,Ke.yMin+Ke.height]].forEach(function(Ae){var lt=P(Fe,Ae),mt=lt[0],At=lt[1];wt=Math.min(wt,mt),Dt=Math.max(Dt,mt),kt=Math.min(kt,At),Et=Math.max(Et,At)}),gt.relativeBoundingBox={xMin:wt,xMax:Dt,yMin:kt,yMax:Et,width:Dt-wt,height:Et-kt}}),Oe}(je,se),(0,l.dispose)([te,pe,me,ae,le]),[2,ye]}})})},X.prototype.estimateFaces=function(q,Z){return S(this,void 0,void 0,function(){var te,ee;return e(this,function(pe){return te=y(q),ee=!!Z&&Z.flipHorizontal,[2,this.detectFaces(q,ee).then(function(se){return se.map(function(me){for(var ue=me.locationData.relativeKeypoints.map(function(Se,Oe){return I(I({},Se),{x:Se.x*te.width,y:Se.y*te.height,name:w[Oe]})}),le=me.locationData.relativeBoundingBox,ae=0,ge=["width","xMax","xMin"];ae<ge.length;ae++)le[ge[ae]]*=te.width;for(var je=0,ye=["height","yMax","yMin"];je<ye.length;je++)le[ye[je]]*=te.height;return{keypoints:ue,box:le}})})]})})},X}();function We(X){return S(this,void 0,void 0,function(){var q,Z,te;return e(this,function(ee){switch(ee.label){case 0:return q=function(pe){if(pe==null)return I({},L);var se=I({},pe);return se.modelType==null&&(se.modelType=L.modelType),se.maxFaces==null&&(se.maxFaces=L.maxFaces),se.detectorModelUrl==null&&(se.modelType==="full"?se.detectorModelUrl="https://tfhub.dev/mediapipe/tfjs-model/face_detection/full/1":se.detectorModelUrl="https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1"),se}(X),Z=typeof q.detectorModelUrl=="string"&&q.detectorModelUrl.indexOf("https://tfhub.dev")>-1,[4,(0,h.loadGraphModel)(q.detectorModelUrl,{fromTFHub:Z})];case 1:return te=ee.sent(),[2,new ke(q.modelType,te,q.maxFaces)]}})})}function rt(X,q){return S(this,void 0,void 0,function(){var Z,te;return e(this,function(ee){if(X===ve.MediaPipeFaceDetector){if(te=void 0,(Z=q)!=null){if(Z.runtime==="tfjs")return[2,We(Z)];if(Z.runtime==="mediapipe")return[2,d(Z)];te=Z.runtime}throw new Error("Expect modelConfig.runtime to be either 'tfjs' "+"or 'mediapipe', but got ".concat(te))}throw new Error("".concat(X," is not a supported model name."))})})}(function(X){X.MediaPipeFaceDetector="MediaPipeFaceDetector"})(ve||(ve={}))},{"@mediapipe/face_detection":"9bpk0","@tensorflow/tfjs-core":"fqGP4","@tensorflow/tfjs-converter":"l98bQ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9bpk0":[function(n,R,i){var o=arguments[3];(function(){"use strict";var s;function l(t){var c=0;return function(){return c<t.length?{done:!1,value:t[c++]}:{done:!0}}}var h=typeof Object.defineProperties=="function"?Object.defineProperty:function(t,c,g){return t==Array.prototype||t==Object.prototype||(t[c]=g.value),t};function I(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof o=="object"&&o];for(var c=0;c<t.length;++c){var g=t[c];if(g&&g.Math==Math)return g}throw Error("Cannot find global object")}var S=I(this);function e(t,c){if(c)e:{var g=S;t=t.split(".");for(var k=0;k<t.length-1;k++){var N=t[k];if(!(N in g))break e;g=g[N]}t=t[t.length-1],k=g[t],c=c(k),c!=k&&c!=null&&h(g,t,{configurable:!0,writable:!0,value:c})}}e("Symbol",function(t){function c(O){if(this instanceof c)throw new TypeError("Symbol is not a constructor");return new g(k+(O||"")+"_"+N++,O)}function g(O,D){this.g=O,h(this,"description",{configurable:!0,writable:!0,value:D})}if(t)return t;g.prototype.toString=function(){return this.g};var k="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",N=0;return c}),e("Symbol.iterator",function(t){if(t)return t;t=Symbol("Symbol.iterator");for(var c="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),g=0;g<c.length;g++){var k=S[c[g]];typeof k=="function"&&typeof k.prototype[t]!="function"&&h(k.prototype,t,{configurable:!0,writable:!0,value:function(){return w(l(this))}})}return t});function w(t){return t={next:t},t[Symbol.iterator]=function(){return this},t}function m(t){var c=typeof Symbol!="undefined"&&Symbol.iterator&&t[Symbol.iterator];return c?c.call(t):{next:l(t)}}function f(t){if(!(t instanceof Array)){t=m(t);for(var c,g=[];!(c=t.next()).done;)g.push(c.value);t=g}return t}var d=typeof Object.create=="function"?Object.create:function(t){function c(){}return c.prototype=t,new c},_;if(typeof Object.setPrototypeOf=="function")_=Object.setPrototypeOf;else{var y;e:{var j={a:!0},r={};try{r.__proto__=j,y=r.a;break e}catch{}y=!1}_=y?function(t,c){if(t.__proto__=c,t.__proto__!==c)throw new TypeError(t+" is not extensible");return t}:null}var b=_;function v(t,c){if(t.prototype=d(c.prototype),t.prototype.constructor=t,b)b(t,c);else for(var g in c)if(g!="prototype")if(Object.defineProperties){var k=Object.getOwnPropertyDescriptor(c,g);k&&Object.defineProperty(t,g,k)}else t[g]=c[g];t.na=c.prototype}function C(){this.l=!1,this.i=null,this.h=void 0,this.g=1,this.u=this.o=0,this.j=null}function M(t){if(t.l)throw new TypeError("Generator is already running");t.l=!0}C.prototype.s=function(t){this.h=t};function P(t,c){t.j={da:c,ea:!0},t.g=t.o||t.u}C.prototype.return=function(t){this.j={return:t},this.g=this.u};function F(t,c,g){return t.g=g,{value:c}}function U(t){this.g=new C,this.h=t}function T(t,c){M(t.g);var g=t.g.i;return g?V(t,"return"in g?g.return:function(k){return{value:k,done:!0}},c,t.g.return):(t.g.return(c),H(t))}function V(t,c,g,k){try{var N=c.call(t.g.i,g);if(!(N instanceof Object))throw new TypeError("Iterator result "+N+" is not an object");if(!N.done)return t.g.l=!1,N;var O=N.value}catch(D){return t.g.i=null,P(t.g,D),H(t)}return t.g.i=null,k.call(t.g,O),H(t)}function H(t){for(;t.g.g;)try{var c=t.h(t.g);if(c)return t.g.l=!1,{value:c.value,done:!1}}catch(g){t.g.h=void 0,P(t.g,g)}if(t.g.l=!1,t.g.j){if(c=t.g.j,t.g.j=null,c.ea)throw c.da;return{value:c.return,done:!0}}return{value:void 0,done:!0}}function K(t){this.next=function(c){return M(t.g),t.g.i?c=V(t,t.g.i.next,c,t.g.s):(t.g.s(c),c=H(t)),c},this.throw=function(c){return M(t.g),t.g.i?c=V(t,t.g.i.throw,c,t.g.s):(P(t.g,c),c=H(t)),c},this.return=function(c){return T(t,c)},this[Symbol.iterator]=function(){return this}}function E(t){function c(k){return t.next(k)}function g(k){return t.throw(k)}return new Promise(function(k,N){function O(D){D.done?k(D.value):Promise.resolve(D.value).then(c,g).then(O,N)}O(t.next())})}function L(t){return E(new K(new U(t)))}e("Promise",function(t){function c(D){this.h=0,this.i=void 0,this.g=[],this.s=!1;var z=this.j();try{D(z.resolve,z.reject)}catch($){z.reject($)}}function g(){this.g=null}function k(D){return D instanceof c?D:new c(function(z){z(D)})}if(t)return t;g.prototype.h=function(D){if(this.g==null){this.g=[];var z=this;this.i(function(){z.l()})}this.g.push(D)};var N=S.setTimeout;g.prototype.i=function(D){N(D,0)},g.prototype.l=function(){for(;this.g&&this.g.length;){var D=this.g;this.g=[];for(var z=0;z<D.length;++z){var $=D[z];D[z]=null;try{$()}catch(fe){this.j(fe)}}}this.g=null},g.prototype.j=function(D){this.i(function(){throw D})},c.prototype.j=function(){function D(fe){return function(Ce){$||($=!0,fe.call(z,Ce))}}var z=this,$=!1;return{resolve:D(this.D),reject:D(this.l)}},c.prototype.D=function(D){if(D===this)this.l(new TypeError("A Promise cannot resolve to itself"));else if(D instanceof c)this.H(D);else{e:switch(typeof D){case"object":var z=D!=null;break e;case"function":z=!0;break e;default:z=!1}z?this.A(D):this.o(D)}},c.prototype.A=function(D){var z=void 0;try{z=D.then}catch($){this.l($);return}typeof z=="function"?this.I(z,D):this.o(D)},c.prototype.l=function(D){this.u(2,D)},c.prototype.o=function(D){this.u(1,D)},c.prototype.u=function(D,z){if(this.h!=0)throw Error("Cannot settle("+D+", "+z+"): Promise already settled in state"+this.h);this.h=D,this.i=z,this.h===2&&this.G(),this.B()},c.prototype.G=function(){var D=this;N(function(){if(D.C()){var z=S.console;typeof z!="undefined"&&z.error(D.i)}},1)},c.prototype.C=function(){if(this.s)return!1;var D=S.CustomEvent,z=S.Event,$=S.dispatchEvent;return typeof $=="undefined"?!0:(typeof D=="function"?D=new D("unhandledrejection",{cancelable:!0}):typeof z=="function"?D=new z("unhandledrejection",{cancelable:!0}):(D=S.document.createEvent("CustomEvent"),D.initCustomEvent("unhandledrejection",!1,!0,D)),D.promise=this,D.reason=this.i,$(D))},c.prototype.B=function(){if(this.g!=null){for(var D=0;D<this.g.length;++D)O.h(this.g[D]);this.g=null}};var O=new g;return c.prototype.H=function(D){var z=this.j();D.M(z.resolve,z.reject)},c.prototype.I=function(D,z){var $=this.j();try{D.call(z,$.resolve,$.reject)}catch(fe){$.reject(fe)}},c.prototype.then=function(D,z){function $(Ge,xe){return typeof Ge=="function"?function(Ye){try{fe(Ge(Ye))}catch(ct){Ce(ct)}}:xe}var fe,Ce,Be=new c(function(Ge,xe){fe=Ge,Ce=xe});return this.M($(D,fe),$(z,Ce)),Be},c.prototype.catch=function(D){return this.then(void 0,D)},c.prototype.M=function(D,z){function $(){switch(fe.h){case 1:D(fe.i);break;case 2:z(fe.i);break;default:throw Error("Unexpected state: "+fe.h)}}var fe=this;this.g==null?O.h($):this.g.push($),this.s=!0},c.resolve=k,c.reject=function(D){return new c(function(z,$){$(D)})},c.race=function(D){return new c(function(z,$){for(var fe=m(D),Ce=fe.next();!Ce.done;Ce=fe.next())k(Ce.value).M(z,$)})},c.all=function(D){var z=m(D),$=z.next();return $.done?k([]):new c(function(fe,Ce){function Be(Ye){return function(ct){Ge[Ye]=ct,xe--,xe==0&&fe(Ge)}}var Ge=[],xe=0;do Ge.push(void 0),xe++,k($.value).M(Be(Ge.length-1),Ce),$=z.next();while(!$.done)})},c});function re(t,c){t instanceof String&&(t+="");var g=0,k=!1,N={next:function(){if(!k&&g<t.length){var O=g++;return{value:c(O,t[O]),done:!1}}return k=!0,{done:!0,value:void 0}}};return N[Symbol.iterator]=function(){return N},N}var ne=typeof Object.assign=="function"?Object.assign:function(t,c){for(var g=1;g<arguments.length;g++){var k=arguments[g];if(k)for(var N in k)Object.prototype.hasOwnProperty.call(k,N)&&(t[N]=k[N])}return t};e("Object.assign",function(t){return t||ne}),e("Object.is",function(t){return t||function(c,g){return c===g?c!==0||1/c==1/g:c!==c&&g!==g}}),e("Array.prototype.includes",function(t){return t||function(c,g){var k=this;k instanceof String&&(k=String(k));var N=k.length;for(g=g||0,0>g&&(g=Math.max(g+N,0));g<N;g++){var O=k[g];if(O===c||Object.is(O,c))return!0}return!1}}),e("String.prototype.includes",function(t){return t||function(c,g){if(this==null)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(c instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return this.indexOf(c,g||0)!==-1}}),e("Array.prototype.keys",function(t){return t||function(){return re(this,function(c){return c})}});var oe=this||self;function he(t,c){t=t.split(".");var g=oe;t[0]in g||typeof g.execScript=="undefined"||g.execScript("var "+t[0]);for(var k;t.length&&(k=t.shift());)t.length||c===void 0?g[k]&&g[k]!==Object.prototype[k]?g=g[k]:g=g[k]={}:g[k]=c}function be(){throw Error("Invalid UTF8")}function ve(t,c){return c=String.fromCharCode.apply(null,c),t==null?c:t+c}var ke,We=typeof TextDecoder!="undefined",rt,X=typeof TextEncoder!="undefined",q={},Z=null;function te(t){var c;c===void 0&&(c=0),se(),c=q[c];for(var g=Array(Math.floor(t.length/3)),k=c[64]||"",N=0,O=0;N<t.length-2;N+=3){var D=t[N],z=t[N+1],$=t[N+2],fe=c[D>>2];D=c[(D&3)<<4|z>>4],z=c[(z&15)<<2|$>>6],$=c[$&63],g[O++]=fe+D+z+$}switch(fe=0,$=k,t.length-N){case 2:fe=t[N+1],$=c[(fe&15)<<2]||k;case 1:t=t[N],g[O]=c[t>>2]+c[(t&3)<<4|fe>>4]+$+k}return g.join("")}function ee(t){var c=t.length,g=3*c/4;g%3?g=Math.floor(g):"=.".indexOf(t[c-1])!=-1&&(g="=.".indexOf(t[c-2])!=-1?g-2:g-1);var k=new Uint8Array(g),N=0;return pe(t,function(O){k[N++]=O}),N!==g?k.subarray(0,N):k}function pe(t,c){function g($){for(;k<t.length;){var fe=t.charAt(k++),Ce=Z[fe];if(Ce!=null)return Ce;if(!/^[\s\xa0]*$/.test(fe))throw Error("Unknown base64 encoding at char: "+fe)}return $}se();for(var k=0;;){var N=g(-1),O=g(0),D=g(64),z=g(64);if(z===64&&N===-1)break;c(N<<2|O>>4),D!=64&&(c(O<<4&240|D>>2),z!=64&&c(D<<6&192|z))}}function se(){if(!Z){Z={};for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),c=["+/=","+/","-_=","-_.","-_"],g=0;5>g;g++){var k=t.concat(c[g].split(""));q[g]=k;for(var N=0;N<k.length;N++){var O=k[N];Z[O]===void 0&&(Z[O]=N)}}}}var me=typeof Uint8Array=="function";function ue(t){return me&&t!=null&&t instanceof Uint8Array}var le;function ae(t){if(this.L=t,t!==null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}var ge=typeof Uint8Array.prototype.slice=="function",je=0,ye=0;function Se(t,c){if(t.constructor===Uint8Array)return t;if(t.constructor===ArrayBuffer)return new Uint8Array(t);if(t.constructor===Array)return new Uint8Array(t);if(t.constructor===String)return ee(t);if(t.constructor===ae)return!c&&(c=t.L)&&c.constructor===Uint8Array?c:(c=t.L,c=c==null||ue(c)?c:typeof c=="string"?ee(c):null,(t=t.L=c)?new Uint8Array(t):le||(le=new Uint8Array(0)));if(t instanceof Uint8Array)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, or Array of numbers")}function Oe(t,c){return Error("Invalid wire type: "+t+" (at position "+c+")")}function it(){return Error("Failed to read varint, encoding is invalid.")}function ut(t,c){c=c===void 0?{}:c,c=c.v===void 0?!1:c.v,this.h=null,this.g=this.i=this.j=0,this.v=c,t&&Fe(this,t)}function Fe(t,c){t.h=Se(c,t.v),t.j=0,t.i=t.h.length,t.g=t.j}ut.prototype.reset=function(){this.g=this.j};function Ue(t){if(t.g>t.i)throw Error("Tried to read past the end of the data "+t.g+" > "+t.i)}function gt(t){var c=t.h,g=c[t.g],k=g&127;if(128>g)return t.g+=1,Ue(t),k;if(g=c[t.g+1],k|=(g&127)<<7,128>g)return t.g+=2,Ue(t),k;if(g=c[t.g+2],k|=(g&127)<<14,128>g)return t.g+=3,Ue(t),k;if(g=c[t.g+3],k|=(g&127)<<21,128>g)return t.g+=4,Ue(t),k;if(g=c[t.g+4],t.g+=5,k|=(g&15)<<28,128>g)return Ue(t),k;if(128<=c[t.g++]&&128<=c[t.g++]&&128<=c[t.g++]&&128<=c[t.g++]&&128<=c[t.g++])throw it();return Ue(t),k}var Ke=[];function wt(){this.g=[]}wt.prototype.length=function(){return this.g.length},wt.prototype.end=function(){var t=this.g;return this.g=[],t};function kt(t,c){for(;127<c;)t.g.push(c&127|128),c>>>=7;t.g.push(c)}function Dt(t){var c={},g=c.W===void 0?!1:c.W;this.l={v:c.v===void 0?!1:c.v},this.W=g,c=this.l,Ke.length?(g=Ke.pop(),c&&(g.v=c.v),t&&Fe(g,t),t=g):t=new ut(t,c),this.g=t,this.j=this.g.g,this.h=this.i=-1}Dt.prototype.reset=function(){this.g.reset(),this.j=this.g.g,this.h=this.i=-1};function Et(t){var c=t.g;if(c.g==c.i)return!1;t.j=t.g.g;var g=gt(t.g)>>>0;if(c=g>>>3,g&=7,!(0<=g&&5>=g))throw Oe(g,t.j);if(1>c)throw Error("Invalid field number: "+c+" (at position "+t.j+")");return t.i=c,t.h=g,!0}function Ae(t){switch(t.h){case 0:if(t.h!=0)Ae(t);else e:{t=t.g;for(var c=t.g,g=c+10;c<g;)if((t.h[c++]&128)==0){t.g=c,Ue(t);break e}throw it()}break;case 1:t=t.g,t.g+=8,Ue(t);break;case 2:t.h!=2?Ae(t):(c=gt(t.g)>>>0,t=t.g,t.g+=c,Ue(t));break;case 5:t=t.g,t.g+=4,Ue(t);break;case 3:c=t.i;do{if(!Et(t))throw Error("Unmatched start-group tag: stream EOF");if(t.h==4){if(t.i!=c)throw Error("Unmatched end-group tag");break}Ae(t)}while(1);break;default:throw Oe(t.h,t.j)}}var lt=[];function mt(){this.i=[],this.h=0,this.g=new wt}function At(t,c){c.length!==0&&(t.i.push(c),t.h+=c.length)}function un(t,c){if(c=c.ba){At(t,t.g.end());for(var g=0;g<c.length;g++)At(t,c[g])}}var Ot=typeof Symbol=="function"&&typeof Symbol()=="symbol"?Symbol(void 0):void 0;function nn(t,c){Object.isFrozen(t)||(Ot?t[Ot]|=c:t.N!==void 0?t.N|=c:Object.defineProperties(t,{N:{value:c,configurable:!0,writable:!0,enumerable:!1}}))}function yn(t){var c;return Ot?c=t[Ot]:c=t.N,c??0}function Pt(t){return nn(t,1),t}function jt(t){return Array.isArray(t)?!!(yn(t)&2):!1}function vt(t){if(!Array.isArray(t))throw Error("cannot mark non-array as immutable");nn(t,2)}function cn(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)&&t.constructor===Object}var pn=Object.freeze(Pt([]));function ht(t){if(jt(t.m))throw Error("Cannot mutate an immutable Message")}var bn=typeof Symbol!="undefined"&&typeof Symbol.hasInstance!="undefined";function zt(t){return{value:t,configurable:!1,writable:!1,enumerable:!1}}function yt(t,c,g){return c===-1?null:c>=t.i?t.g?t.g[c]:void 0:(g===void 0?0:g)&&t.g&&(g=t.g[c],g!=null)?g:t.m[c+t.h]}function et(t,c,g,k){k=k===void 0?!1:k,ht(t),c<t.i&&!k?t.m[c+t.h]=g:(t.g||(t.g=t.m[t.i+t.h]={}))[c]=g}function Ve(t,c,g,k){g=g===void 0?!0:g,k=k===void 0?!1:k;var N=yt(t,c,k);return N==null&&(N=pn),jt(t.m)?g&&(vt(N),Object.freeze(N)):(N===pn||jt(N))&&(N=Pt(N.slice()),et(t,c,N,k)),N}function Wt(t,c,g){return t=yt(t,c),t=t==null?t:+t,t??(g===void 0?0:g)}function Ut(t,c,g,k){t.j||(t.j={});var N=jt(t.m),O=t.j[g];if(!O){k=Ve(t,g,!0,k===void 0?!1:k),O=[],N=N||jt(k);for(var D=0;D<k.length;D++)O[D]=new c(k[D]),N&&vt(O[D].m);N&&(vt(O),Object.freeze(O)),t.j[g]=O}return O}function Nn(t,c,g,k,N){var O=O===void 0?!1:O;return ht(t),O=Ut(t,g,c,O),g=k||new g,t=Ve(t,c),N!=null?(O.splice(N,0,g),t.splice(N,0,g.m)):(O.push(g),t.push(g.m)),g}function wn(t,c){return t=yt(t,c),t??0}function Ht(t,c){return t=yt(t,c),t??""}function Mt(t){switch(typeof t){case"number":return isFinite(t)?t:String(t);case"object":if(t&&!Array.isArray(t)){if(ue(t))return te(t);if(t instanceof ae){var c=t.L;return c=c==null||typeof c=="string"?c:me&&c instanceof Uint8Array?te(c):null,(t.L=c)||""}}}return t}function Kt(t){var c=rr;return c=c===void 0?Rt:c,Bn(t,c)}function $t(t,c){if(t!=null){if(Array.isArray(t))t=Bn(t,c);else if(cn(t)){var g={},k;for(k in t)g[k]=$t(t[k],c);t=g}else t=c(t);return t}}function Bn(t,c){for(var g=t.slice(),k=0;k<g.length;k++)g[k]=$t(g[k],c);return Array.isArray(t)&&yn(t)&1&&Pt(g),g}function rr(t){return t&&typeof t=="object"&&t.toJSON?t.toJSON():(t=Mt(t),Array.isArray(t)?Kt(t):t)}function Rt(t){return ue(t)?new Uint8Array(t):t}function Jt(t,c,g){t||(t=rn),rn=null;var k=this.constructor.h;t||(t=k?[k]:[]),this.h=(k?0:-1)-(this.constructor.g||0),this.j=void 0,this.m=t;e:{if(k=this.m.length,t=k-1,k&&(k=this.m[t],cn(k))){this.i=t-this.h,this.g=k;break e}c!==void 0&&-1<c?(this.i=Math.max(c,t+1-this.h),this.g=void 0):this.i=Number.MAX_VALUE}if(g)for(c=0;c<g.length;c++)if(t=g[c],t<this.i)t+=this.h,(k=this.m[t])?Array.isArray(k)&&Pt(k):this.m[t]=pn;else{k=this.g||(this.g=this.m[this.i+this.h]={});var N=k[t];N?Array.isArray(N)&&Pt(N):k[t]=pn}}Jt.prototype.toJSON=function(){return Kt(this.m)},Jt.prototype.toString=function(){return this.m.toString()};var rn;function an(){Jt.apply(this,arguments)}if(v(an,Jt),bn){var Dn={};Object.defineProperties(an,(Dn[Symbol.hasInstance]=zt(function(){throw Error("Cannot perform instanceof checks for MutableMessage")}),Dn))}function tn(t,c,g){if(g){var k={},N;for(N in g){var O=g[N],D=O.ha;D||(k.F=O.la||O.fa.P,O.aa?(k.U=Cn(O.aa),D=function(z){return function($,fe,Ce){return z.F($,fe,Ce,z.U)}}(k)):O.ca?(k.T=dn(O.X.g,O.ca),D=function(z){return function($,fe,Ce){return z.F($,fe,Ce,z.T)}}(k)):D=k.F,O.ha=D),D(c,t,O.X),k={F:k.F,U:k.U,T:k.T}}}un(c,t)}var fn=Symbol();function kn(t,c,g){return t[fn]||(t[fn]=function(k,N){return c(k,N,g)})}function jn(t){var c=t[fn];if(!c){var g=Vn(t);c=function(k,N){return Sn(k,N,g)},t[fn]=c}return c}function Qn(t){var c=t.aa;if(c)return jn(c);if(c=t.ka)return kn(t.X.g,c,t.ca)}function In(t){var c=Qn(t),g=t.X,k=t.fa.O;return c?function(N,O){return k(N,O,g,c)}:function(N,O){return k(N,O,g)}}function Zt(t,c,g,k,N,O){t=t();var D=0;for(t.length&&typeof t[0]!="number"&&(g(c,t[0]),D++);D<t.length;){g=t[D++];for(var z=D+1;z<t.length&&typeof t[z]!="number";)z++;var $=t[D++];switch(z-=D,z){case 0:k(c,g,$);break;case 1:k(c,g,$,t[D++]);break;case 2:N(c,g,$,t[D++],t[D++]);break;case 3:z=t[D++];var fe=t[D++],Ce=t[D++];Array.isArray(Ce)?N(c,g,$,z,fe,Ce):O(c,g,$,z,fe,Ce);break;case 4:O(c,g,$,t[D++],t[D++],t[D++],t[D++]);break;default:throw Error("unexpected number of binary field arguments: "+z)}}return c}var De=Symbol();function Cn(t){var c=t[De];if(!c){var g=Tn(t);c=function(k,N){return zn(k,N,g)},t[De]=c}return c}function dn(t,c){var g=t[De];return g||(g=function(k,N){return tn(k,N,c)},t[De]=g),g}var Pn=Symbol();function mn(t,c){t.push(c)}function qn(t,c,g){t.push(c,g.P)}function Gn(t,c,g,k,N){var O=Cn(N),D=g.P;t.push(c,function(z,$,fe){return D(z,$,fe,k,O)})}function Rn(t,c,g,k,N,O){var D=dn(k,O),z=g.P;t.push(c,function($,fe,Ce){return z($,fe,Ce,k,D)})}function Tn(t){var c=t[Pn];return c||Zt(t,t[Pn]=[],mn,qn,Gn,Rn)}var Hn=Symbol();function Ln(t,c){t[0]=c}function Wn(t,c,g,k){var N=g.O;t[c]=k?function(O,D,z){return N(O,D,z,k)}:N}function er(t,c,g,k,N,O){var D=g.O,z=jn(N);t[c]=function($,fe,Ce){return D($,fe,Ce,k,z,O)}}function Un(t,c,g,k,N,O,D){var z=g.O,$=kn(k,N,O);t[c]=function(fe,Ce,Be){return z(fe,Ce,Be,k,$,D)}}function Vn(t){var c=t[Hn];return c||Zt(t,t[Hn]={},Ln,Wn,er,Un)}function Sn(t,c,g){for(;Et(c)&&c.h!=4;){var k=c.i,N=g[k];if(!N){var O=g[0];O&&(O=O[k])&&(N=g[k]=In(O))}if((!N||!N(c,t,k))&&(N=c,k=t,O=N.j,Ae(N),!N.W)){var D=N.g.h;N=N.g.g,N=O===N?le||(le=new Uint8Array(0)):ge?D.slice(O,N):new Uint8Array(D.subarray(O,N)),(O=k.ba)?O.push(N):k.ba=[N]}}return t}function hn(t,c,g){if(lt.length){var k=lt.pop();t&&(Fe(k.g,t),k.i=-1,k.h=-1),t=k}else t=new Dt(t);try{return Sn(new c,t,Vn(g))}finally{c=t.g,c.h=null,c.j=0,c.i=0,c.g=0,c.v=!1,t.i=-1,t.h=-1,100>lt.length&&lt.push(t)}}function zn(t,c,g){for(var k=g.length,N=k%2==1,O=N?1:0;O<k;O+=2)(0,g[O+1])(c,t,g[O]);tn(t,c,N?g[0]:void 0)}function En(t,c){var g=new mt;zn(t,g,Tn(c)),At(g,g.g.end()),t=new Uint8Array(g.h),c=g.i;for(var k=c.length,N=0,O=0;O<k;O++){var D=c[O];t.set(D,N),N+=D.length}return g.i=[t],t}function Xt(t,c){return{O:t,P:c}}var Vt=Xt(function(t,c,g){if(t.h!==5)return!1;t=t.g;var k=t.h[t.g],N=t.h[t.g+1],O=t.h[t.g+2],D=t.h[t.g+3];return t.g+=4,Ue(t),N=(k<<0|N<<8|O<<16|D<<24)>>>0,t=2*(N>>31)+1,k=N>>>23&255,N&=8388607,et(c,g,k==255?N?NaN:1/0*t:k==0?t*Math.pow(2,-149)*N:t*Math.pow(2,k-150)*(N+Math.pow(2,23))),!0},function(t,c,g){if(c=yt(c,g),c!=null){kt(t.g,8*g+5),t=t.g;var k=c;k=(g=0>k?1:0)?-k:k,k===0?0<1/k?je=ye=0:(ye=0,je=2147483648):isNaN(k)?(ye=0,je=2147483647):34028234663852886e22<k?(ye=0,je=(g<<31|2139095040)>>>0):11754943508222875e-54>k?(k=Math.round(k/Math.pow(2,-149)),ye=0,je=(g<<31|k)>>>0):(c=Math.floor(Math.log(k)/Math.LN2),k*=Math.pow(2,-c),k=Math.round(8388608*k),16777216<=k&&++c,ye=0,je=(g<<31|c+127<<23|k&8388607)>>>0),g=je,t.g.push(g>>>0&255),t.g.push(g>>>8&255),t.g.push(g>>>16&255),t.g.push(g>>>24&255)}}),On=Xt(function(t,c,g){if(t.h!==0)return!1;for(var k=t.g,N=128,O=0,D=t=0;4>D&&128<=N;D++)N=k.h[k.g++],Ue(k),O|=(N&127)<<7*D;if(128<=N&&(N=k.h[k.g++],Ue(k),O|=(N&127)<<28,t|=(N&127)>>4),128<=N)for(D=0;5>D&&128<=N;D++)N=k.h[k.g++],Ue(k),t|=(N&127)<<7*D+3;if(128>N)k=O>>>0,N=t>>>0,(t=N&2147483648)&&(k=~k+1>>>0,N=~N>>>0,k==0&&(N=N+1>>>0)),k=4294967296*N+(k>>>0);else throw it();return et(c,g,t?-k:k),!0},function(t,c,g){if(c=yt(c,g),c!=null&&c!=null){kt(t.g,8*g),t=t.g;var k=c;for(g=0>k,k=Math.abs(k),c=k>>>0,k=Math.floor((k-c)/4294967296),k>>>=0,g&&(k=~k>>>0,c=(~c>>>0)+1,4294967295<c&&(c=0,k++,4294967295<k&&(k=0))),je=c,ye=k,g=je,c=ye;0<c||127<g;)t.g.push(g&127|128),g=(g>>>7|c<<25)>>>0,c>>>=7;t.g.push(g)}}),Kn=Xt(function(t,c,g){return t.h!==0?!1:(et(c,g,gt(t.g)),!0)},function(t,c,g){if(c=yt(c,g),c!=null&&c!=null)if(kt(t.g,8*g),t=t.g,g=c,0<=g)kt(t,g);else{for(c=0;9>c;c++)t.g.push(g&127|128),g>>=7;t.g.push(1)}}),Yn=Xt(function(t,c,g){if(t.h!==2)return!1;var k=gt(t.g)>>>0;t=t.g;var N=t.g;t.g+=k,Ue(t),t=t.h;var O;if(We)(O=ke)||(O=ke=new TextDecoder("utf-8",{fatal:!0})),O=O.decode(t.subarray(N,N+k));else{k=N+k;for(var D=[],z=null,$,fe,Ce;N<k;)$=t[N++],128>$?D.push($):224>$?N>=k?be():(fe=t[N++],194>$||(fe&192)!=128?(N--,be()):D.push(($&31)<<6|fe&63)):240>$?N>=k-1?be():(fe=t[N++],(fe&192)!=128||$===224&&160>fe||$===237&&160<=fe||((O=t[N++])&192)!=128?(N--,be()):D.push(($&15)<<12|(fe&63)<<6|O&63)):244>=$?N>=k-2?be():(fe=t[N++],(fe&192)!=128||($<<28)+(fe-144)>>30!=0||((O=t[N++])&192)!=128||((Ce=t[N++])&192)!=128?(N--,be()):($=($&7)<<18|(fe&63)<<12|(O&63)<<6|Ce&63,$-=65536,D.push(($>>10&1023)+55296,($&1023)+56320))):be(),8192<=D.length&&(z=ve(z,D),D.length=0);O=ve(z,D)}return et(c,g,O),!0},function(t,c,g){if(c=yt(c,g),c!=null){var k=!1;if(k=k===void 0?!1:k,X){if(k&&/(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(c))throw Error("Found an unpaired surrogate");c=(rt||(rt=new TextEncoder)).encode(c)}else{for(var N=0,O=new Uint8Array(3*c.length),D=0;D<c.length;D++){var z=c.charCodeAt(D);if(128>z)O[N++]=z;else{if(2048>z)O[N++]=z>>6|192;else{if(55296<=z&&57343>=z){if(56319>=z&&D<c.length){var $=c.charCodeAt(++D);if(56320<=$&&57343>=$){z=1024*(z-55296)+$-56320+65536,O[N++]=z>>18|240,O[N++]=z>>12&63|128,O[N++]=z>>6&63|128,O[N++]=z&63|128;continue}else D--}if(k)throw Error("Found an unpaired surrogate");z=65533}O[N++]=z>>12|224,O[N++]=z>>6&63|128}O[N++]=z&63|128}}c=O.subarray(0,N)}kt(t.g,8*g+2),kt(t.g,c.length),At(t,t.g.end()),At(t,c)}}),xn=Xt(function(t,c,g,k,N){if(t.h!==2)return!1;c=Nn(c,g,k),g=t.g.i,k=gt(t.g)>>>0;var O=t.g.g+k,D=O-g;if(0>=D&&(t.g.i=O,N(c,t),D=O-t.g.g),D)throw Error("Message parsing ended unexpectedly. Expected to read "+(k+" bytes, instead read "+(k-D)+" bytes, either the data ended unexpectedly or the message misreported its own length"));return t.g.g=O,t.g.i=g,!0},function(t,c,g,k,N){if(c=Ut(c,k,g),c!=null)for(k=0;k<c.length;k++){var O=t;kt(O.g,8*g+2);var D=O.g.end();At(O,D),D.push(O.h),O=D,N(c[k],t),D=t;var z=O.pop();for(z=D.h+D.g.length()-z;127<z;)O.push(z&127|128),z>>>=7,D.h++;O.push(z),D.h++}});function Lt(){an.apply(this,arguments)}if(v(Lt,an),bn){var Xn={};Object.defineProperties(Lt,(Xn[Symbol.hasInstance]=zt(Object[Symbol.hasInstance]),Xn))}function sn(t){Lt.call(this,t)}v(sn,Lt);function Qt(){return[1,Kn,2,Vt,3,Yn,4,Yn]}function on(t){Lt.call(this,t,-1,Jn)}v(on,Lt),on.prototype.addClassification=function(t,c){return Nn(this,1,sn,t,c),this};function $n(){return[1,xn,sn,Qt]}var Jn=[1];function gn(t){Lt.call(this,t)}v(gn,Lt);function Zn(){return[1,Vt,2,Vt,3,Vt,4,Vt,5,Vt]}function An(t){Lt.call(this,t,-1,u)}v(An,Lt);function a(){return[1,xn,gn,Zn]}var u=[1];function p(t){Lt.call(this,t)}v(p,Lt);function x(){return[1,Vt,2,Vt,3,Vt,4,Vt,5,Vt,6,On]}var B=[[61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]],J=[[263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]],W=[[276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]],Q=[[33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]],ce=[[46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]],_e=[[10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]],Re=[].concat(f(B),f(J),f(W),f(Q),f(ce),f(_e));function at(t,c,g){if(g=t.createShader(g===0?t.VERTEX_SHADER:t.FRAGMENT_SHADER),t.shaderSource(g,c),t.compileShader(g),!t.getShaderParameter(g,t.COMPILE_STATUS))throw Error(`Could not compile WebGL shader.

`+t.getShaderInfoLog(g));return g}function ze(t){return Ut(t,sn,1).map(function(c){return{index:wn(c,1),ga:Wt(c,2),label:yt(c,3)!=null?Ht(c,3):void 0,displayName:yt(c,4)!=null?Ht(c,4):void 0}})}function Ee(t){return{x:Wt(t,1),y:Wt(t,2),z:Wt(t,3),visibility:yt(t,4)!=null?Wt(t,4):void 0}}function Ie(t,c){this.h=t,this.g=c,this.l=0}function Pe(t,c,g){return He(t,c),typeof t.g.canvas.transferToImageBitmap=="function"?Promise.resolve(t.g.canvas.transferToImageBitmap()):g?Promise.resolve(t.g.canvas):typeof createImageBitmap=="function"?createImageBitmap(t.g.canvas):(t.i===void 0&&(t.i=document.createElement("canvas")),new Promise(function(k){t.i.height=t.g.canvas.height,t.i.width=t.g.canvas.width,t.i.getContext("2d",{}).drawImage(t.g.canvas,0,0,t.g.canvas.width,t.g.canvas.height),k(t.i)}))}function He(t,c){var g=t.g;if(t.o===void 0){var k=at(g,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,0),N=at(g,`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D sampler0;
  void main(){
    gl_FragColor = texture2D(sampler0, vTex);
  }`,1),O=g.createProgram();if(g.attachShader(O,k),g.attachShader(O,N),g.linkProgram(O),!g.getProgramParameter(O,g.LINK_STATUS))throw Error(`Could not compile WebGL program.

`+g.getProgramInfoLog(O));k=t.o=O,g.useProgram(k),N=g.getUniformLocation(k,"sampler0"),t.j={K:g.getAttribLocation(k,"aVertex"),J:g.getAttribLocation(k,"aTex"),ma:N},t.u=g.createBuffer(),g.bindBuffer(g.ARRAY_BUFFER,t.u),g.enableVertexAttribArray(t.j.K),g.vertexAttribPointer(t.j.K,2,g.FLOAT,!1,0,0),g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),g.STATIC_DRAW),g.bindBuffer(g.ARRAY_BUFFER,null),t.s=g.createBuffer(),g.bindBuffer(g.ARRAY_BUFFER,t.s),g.enableVertexAttribArray(t.j.J),g.vertexAttribPointer(t.j.J,2,g.FLOAT,!1,0,0),g.bufferData(g.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),g.STATIC_DRAW),g.bindBuffer(g.ARRAY_BUFFER,null),g.uniform1i(N,0)}k=t.j,g.useProgram(t.o),g.canvas.width=c.width,g.canvas.height=c.height,g.viewport(0,0,c.width,c.height),g.activeTexture(g.TEXTURE0),t.h.bindTexture2d(c.glName),g.enableVertexAttribArray(k.K),g.bindBuffer(g.ARRAY_BUFFER,t.u),g.vertexAttribPointer(k.K,2,g.FLOAT,!1,0,0),g.enableVertexAttribArray(k.J),g.bindBuffer(g.ARRAY_BUFFER,t.s),g.vertexAttribPointer(k.J,2,g.FLOAT,!1,0,0),g.bindFramebuffer(g.DRAW_FRAMEBUFFER?g.DRAW_FRAMEBUFFER:g.FRAMEBUFFER,null),g.clearColor(0,0,0,0),g.clear(g.COLOR_BUFFER_BIT),g.colorMask(!0,!0,!0,!0),g.drawArrays(g.TRIANGLE_FAN,0,4),g.disableVertexAttribArray(k.K),g.disableVertexAttribArray(k.J),g.bindBuffer(g.ARRAY_BUFFER,null),t.h.bindTexture2d(0)}function Ze(t){this.g=t}var Ct=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]);function pt(t,c){return c+t}function Ft(t,c){window[t]=c}function It(t){var c=document.createElement("script");return c.setAttribute("src",t),c.setAttribute("crossorigin","anonymous"),new Promise(function(g){c.addEventListener("load",function(){g()},!1),c.addEventListener("error",function(){g()},!1),document.body.appendChild(c)})}function Le(){return L(function(t){switch(t.g){case 1:return t.o=2,F(t,WebAssembly.instantiate(Ct),4);case 4:t.g=3,t.o=0;break;case 2:return t.o=0,t.j=null,t.return(!1);case 3:return t.return(!0)}})}function Qe(t){if(this.g=t,this.listeners={},this.j={},this.H={},this.o={},this.u={},this.I=this.s=this.Z=!0,this.D=Promise.resolve(),this.Y="",this.C={},this.locateFile=t&&t.locateFile||pt,typeof window=="object")var c=window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/";else if(typeof location!="undefined")c=location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/";else throw Error("solutions can only be loaded on a web page or in a web worker");if(this.$=c,t.options){c=m(Object.keys(t.options));for(var g=c.next();!g.done;g=c.next()){g=g.value;var k=t.options[g].default;k!==void 0&&(this.j[g]=typeof k=="function"?k():k)}}}s=Qe.prototype,s.close=function(){return this.i&&this.i.delete(),Promise.resolve()};function st(t){var c,g,k,N,O,D,z,$,fe,Ce,Be;return L(function(Ge){switch(Ge.g){case 1:return t.Z?(c=t.g.files===void 0?[]:typeof t.g.files=="function"?t.g.files(t.j):t.g.files,F(Ge,Le(),2)):Ge.return();case 2:if(g=Ge.h,typeof window=="object")return Ft("createMediapipeSolutionsWasm",{locateFile:t.locateFile}),Ft("createMediapipeSolutionsPackedAssets",{locateFile:t.locateFile}),D=c.filter(function(xe){return xe.data!==void 0}),z=c.filter(function(xe){return xe.data===void 0}),$=Promise.all(D.map(function(xe){var Ye=qe(t,xe.url);if(xe.path!==void 0){var ct=xe.path;Ye=Ye.then(function(bt){return t.overrideFile(ct,bt),Promise.resolve(bt)})}return Ye})),fe=Promise.all(z.map(function(xe){return xe.simd===void 0||xe.simd&&g||!xe.simd&&!g?It(t.locateFile(xe.url,t.$)):Promise.resolve()})).then(function(){var xe,Ye,ct;return L(function(bt){if(bt.g==1)return xe=window.createMediapipeSolutionsWasm,Ye=window.createMediapipeSolutionsPackedAssets,ct=t,F(bt,xe(Ye),2);ct.h=bt.h,bt.g=0})}),Ce=function(){return L(function(xe){return t.g.graph&&t.g.graph.url?xe=F(xe,qe(t,t.g.graph.url),0):(xe.g=0,xe=void 0),xe})}(),F(Ge,Promise.all([fe,$,Ce]),7);if(typeof importScripts!="function")throw Error("solutions can only be loaded on a web page or in a web worker");return k=c.filter(function(xe){return xe.simd===void 0||xe.simd&&g||!xe.simd&&!g}).map(function(xe){return t.locateFile(xe.url,t.$)}),importScripts.apply(null,f(k)),N=t,F(Ge,createMediapipeSolutionsWasm(Module),6);case 6:N.h=Ge.h,t.l=new OffscreenCanvas(1,1),t.h.canvas=t.l,O=t.h.GL.createContext(t.l,{antialias:!1,alpha:!1,ja:typeof WebGL2RenderingContext!="undefined"?2:1}),t.h.GL.makeContextCurrent(O),Ge.g=4;break;case 7:if(t.l=document.createElement("canvas"),Be=t.l.getContext("webgl2",{}),!Be&&(Be=t.l.getContext("webgl",{}),!Be))return alert("Failed to create WebGL canvas context when passing video frame."),Ge.return();t.G=Be,t.h.canvas=t.l,t.h.createContext(t.l,!0,!0,{});case 4:t.i=new t.h.SolutionWasm,t.Z=!1,Ge.g=0}})}function $e(t){var c,g,k,N,O,D,z,$;return L(function(fe){if(fe.g==1){if(t.g.graph&&t.g.graph.url&&t.Y===t.g.graph.url)return fe.return();if(t.s=!0,!t.g.graph||!t.g.graph.url){fe.g=2;return}return t.Y=t.g.graph.url,F(fe,qe(t,t.g.graph.url),3)}for(fe.g!=2&&(c=fe.h,t.i.loadGraph(c)),g=m(Object.keys(t.C)),k=g.next();!k.done;k=g.next())N=k.value,t.i.overrideFile(N,t.C[N]);if(t.C={},t.g.listeners)for(O=m(t.g.listeners),D=O.next();!D.done;D=O.next())z=D.value,fr(t,z);$=t.j,t.j={},t.setOptions($),fe.g=0})}s.reset=function(){var t=this;return L(function(c){t.i&&(t.i.reset(),t.o={},t.u={}),c.g=0})},s.setOptions=function(t,c){var g=this;if(c=c||this.g.options){for(var k=[],N=[],O={},D=m(Object.keys(t)),z=D.next();!z.done;O={R:O.R,S:O.S},z=D.next()){var $=z.value;$ in this.j&&this.j[$]===t[$]||(this.j[$]=t[$],z=c[$],z!==void 0&&(z.onChange&&(O.R=z.onChange,O.S=t[$],k.push(function(fe){return function(){var Ce;return L(function(Be){if(Be.g==1)return F(Be,fe.R(fe.S),2);Ce=Be.h,Ce===!0&&(g.s=!0),Be.g=0})}}(O))),z.graphOptionXref&&($={valueNumber:z.type===1?t[$]:0,valueBoolean:z.type===0?t[$]:!1,valueString:z.type===2?t[$]:""},z=Object.assign(Object.assign(Object.assign({},{calculatorName:"",calculatorIndex:0}),z.graphOptionXref),$),N.push(z))))}(k.length!==0||N.length!==0)&&(this.s=!0,this.B=(this.B===void 0?[]:this.B).concat(N),this.A=(this.A===void 0?[]:this.A).concat(k))}};function tt(t){var c,g,k,N,O,D,z;return L(function($){switch($.g){case 1:if(!t.s)return $.return();if(!t.A){$.g=2;break}c=m(t.A),g=c.next();case 3:if(g.done){$.g=5;break}return k=g.value,F($,k(),4);case 4:g=c.next(),$.g=3;break;case 5:t.A=void 0;case 2:if(t.B){for(N=new t.h.GraphOptionChangeRequestList,O=m(t.B),D=O.next();!D.done;D=O.next())z=D.value,N.push_back(z);t.i.changeOptions(N),N.delete(),t.B=void 0}t.s=!1,$.g=0}})}s.initialize=function(){var t=this;return L(function(c){return c.g==1?F(c,st(t),2):c.g!=3?F(c,$e(t),3):F(c,tt(t),0)})};function qe(t,c){var g,k;return L(function(N){return c in t.H?N.return(t.H[c]):(g=t.locateFile(c,""),k=fetch(g).then(function(O){return O.arrayBuffer()}),t.H[c]=k,N.return(k))})}s.overrideFile=function(t,c){this.i?this.i.overrideFile(t,c):this.C[t]=c},s.clearOverriddenFiles=function(){this.C={},this.i&&this.i.clearOverriddenFiles()},s.send=function(t,c){var g=this,k,N,O,D,z,$,fe,Ce,Be;return L(function(Ge){switch(Ge.g){case 1:return g.g.inputs?(k=1e3*(c??performance.now()),F(Ge,g.D,2)):Ge.return();case 2:return F(Ge,g.initialize(),3);case 3:for(N=new g.h.PacketDataList,O=m(Object.keys(t)),D=O.next();!D.done;D=O.next())if(z=D.value,$=g.g.inputs[z]){e:{var xe=t[z];switch($.type){case"video":var Ye=g.o[$.stream];if(Ye||(Ye=new Ie(g.h,g.G),g.o[$.stream]=Ye),Ye.l===0&&(Ye.l=Ye.h.createTexture()),typeof HTMLVideoElement!="undefined"&&xe instanceof HTMLVideoElement)var ct=xe.videoWidth,bt=xe.videoHeight;else typeof HTMLImageElement!="undefined"&&xe instanceof HTMLImageElement?(ct=xe.naturalWidth,bt=xe.naturalHeight):(ct=xe.width,bt=xe.height);bt={glName:Ye.l,width:ct,height:bt},ct=Ye.g,ct.canvas.width=bt.width,ct.canvas.height=bt.height,ct.activeTexture(ct.TEXTURE0),Ye.h.bindTexture2d(Ye.l),ct.texImage2D(ct.TEXTURE_2D,0,ct.RGBA,ct.RGBA,ct.UNSIGNED_BYTE,xe),Ye.h.bindTexture2d(0),Ye=bt;break e;case"detections":for(Ye=g.o[$.stream],Ye||(Ye=new Ze(g.h),g.o[$.stream]=Ye),Ye.data||(Ye.data=new Ye.g.DetectionListData),Ye.data.reset(xe.length),bt=0;bt<xe.length;++bt){ct=xe[bt];var _t=Ye.data,Bt=_t.setBoundingBox,qt=bt,Yt=ct.boundingBox,ft=new p;if(et(ft,1,Yt.xCenter),et(ft,2,Yt.yCenter),et(ft,3,Yt.height),et(ft,4,Yt.width),et(ft,5,Yt.rotation),et(ft,6,Yt.rectId),Yt=En(ft,x),Bt.call(_t,qt,Yt),ct.landmarks)for(_t=0;_t<ct.landmarks.length;++_t){ft=ct.landmarks[_t];var Tt=!!ft.visibility;Bt=Ye.data,qt=Bt.addNormalizedLandmark,Yt=bt,ft=Object.assign(Object.assign({},ft),{visibility:Tt?ft.visibility:0}),Tt=new gn,et(Tt,1,ft.x),et(Tt,2,ft.y),et(Tt,3,ft.z),ft.visibility&&et(Tt,4,ft.visibility),ft=En(Tt,Zn),qt.call(Bt,Yt,ft)}if(ct.V)for(_t=0;_t<ct.V.length;++_t)Bt=Ye.data,qt=Bt.addClassification,Yt=bt,ft=ct.V[_t],Tt=new sn,et(Tt,2,ft.ga),ft.index&&et(Tt,1,ft.index),ft.label&&et(Tt,3,ft.label),ft.displayName&&et(Tt,4,ft.displayName),ft=En(Tt,Qt),qt.call(Bt,Yt,ft)}Ye=Ye.data;break e;default:Ye={}}}switch(fe=Ye,Ce=$.stream,$.type){case"video":N.pushTexture2d(Object.assign(Object.assign({},fe),{stream:Ce,timestamp:k}));break;case"detections":Be=fe,Be.stream=Ce,Be.timestamp=k,N.pushDetectionList(Be);break;default:throw Error("Unknown input config type: '"+$.type+"'")}}return g.i.send(N),F(Ge,g.D,4);case 4:N.delete(),Ge.g=0}})};function Mn(t,c,g){var k,N,O,D,z,$,fe,Ce,Be,Ge,xe,Ye,ct,bt;return L(function(_t){switch(_t.g){case 1:if(!g)return _t.return(c);for(k={},N=0,O=m(Object.keys(g)),D=O.next();!D.done;D=O.next())z=D.value,$=g[z],typeof $!="string"&&$.type==="texture"&&c[$.stream]!==void 0&&++N;1<N&&(t.I=!1),fe=m(Object.keys(g)),D=fe.next();case 2:if(D.done){_t.g=4;break}if(Ce=D.value,Be=g[Ce],typeof Be=="string")return ct=k,bt=Ce,F(_t,pr(t,Ce,c[Be]),14);if(Ge=c[Be.stream],Be.type==="detection_list"){if(Ge){for(var Bt=Ge.getRectList(),qt=Ge.getLandmarksList(),Yt=Ge.getClassificationsList(),ft=[],Tt=0;Tt<Bt.size();++Tt){var Fn=hn(Bt.get(Tt),p,x);Fn={boundingBox:{xCenter:Wt(Fn,1),yCenter:Wt(Fn,2),height:Wt(Fn,3),width:Wt(Fn,4),rotation:Wt(Fn,5,0),rectId:wn(Fn,6)},landmarks:Ut(hn(qt.get(Tt),An,a),gn,1).map(Ee),V:ze(hn(Yt.get(Tt),on,$n))},ft.push(Fn)}Bt=ft}else Bt=[];k[Ce]=Bt,_t.g=7;break}if(Be.type==="proto_list"){if(Ge){for(Bt=Array(Ge.size()),qt=0;qt<Ge.size();qt++)Bt[qt]=Ge.get(qt);Ge.delete()}else Bt=[];k[Ce]=Bt,_t.g=7;break}if(Ge===void 0){_t.g=3;break}if(Be.type==="float_list"){k[Ce]=Ge,_t.g=7;break}if(Be.type==="proto"){k[Ce]=Ge,_t.g=7;break}if(Be.type!=="texture")throw Error("Unknown output config type: '"+Be.type+"'");return xe=t.u[Ce],xe||(xe=new Ie(t.h,t.G),t.u[Ce]=xe),F(_t,Pe(xe,Ge,t.I),13);case 13:Ye=_t.h,k[Ce]=Ye;case 7:Be.transform&&k[Ce]&&(k[Ce]=Be.transform(k[Ce])),_t.g=3;break;case 14:ct[bt]=_t.h;case 3:D=fe.next(),_t.g=2;break;case 4:return _t.return(k)}})}function pr(t,c,g){var k;return L(function(N){return typeof g=="number"||g instanceof Uint8Array||g instanceof t.h.Uint8BlobList?N.return(g):g instanceof t.h.Texture2dDataOut?(k=t.u[c],k||(k=new Ie(t.h,t.G),t.u[c]=k),N.return(Pe(k,g,t.I))):N.return(void 0)})}function fr(t,c){for(var g=c.name||"$",k=[].concat(f(c.wants)),N=new t.h.StringList,O=m(c.wants),D=O.next();!D.done;D=O.next())N.push_back(D.value);O=t.h.PacketListener.implement({onResults:function(z){for(var $={},fe=0;fe<c.wants.length;++fe)$[k[fe]]=z.get(fe);var Ce=t.listeners[g];Ce&&(t.D=Mn(t,$,c.outs).then(function(Be){Be=Ce(Be);for(var Ge=0;Ge<c.wants.length;++Ge){var xe=$[k[Ge]];typeof xe=="object"&&xe.hasOwnProperty&&xe.hasOwnProperty("delete")&&xe.delete()}Be&&(t.D=Be)}))}}),t.i.attachMultiListener(N,O),N.delete()}s.onResults=function(t,c){this.listeners[c||"$"]=t},he("Solution",Qe),he("OptionType",{BOOL:0,NUMBER:1,ia:2,0:"BOOL",1:"NUMBER",2:"STRING"});function or(t){var c=this;t=t||{};var g={url:"face_detection_short.binarypb"},k={type:1,graphOptionXref:{calculatorType:"TensorsToDetectionsCalculator",calculatorName:"facedetectionshortrangegpu__facedetectionshortrangecommon__TensorsToDetectionsCalculator",fieldName:"min_score_thresh"}};this.g=new Qe({locateFile:t.locateFile,files:[{data:!0,url:"face_detection_short.binarypb"},{data:!0,url:"face_detection_short_range.tflite"},{simd:!0,url:"face_detection_solution_simd_wasm_bin.js"},{simd:!1,url:"face_detection_solution_wasm_bin.js"}],graph:g,listeners:[{wants:["detections","image_transformed"],outs:{image:"image_transformed",detections:{type:"detection_list",stream:"detections"}}}],inputs:{image:{type:"video",stream:"input_frames_gpu"}},options:{useCpuInference:{type:0,graphOptionXref:{calculatorType:"InferenceCalculator",fieldName:"use_cpu_inference"},default:typeof window!="object"||window.navigator===void 0?!1:"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document},selfieMode:{type:0,graphOptionXref:{calculatorType:"GlScalerCalculator",calculatorIndex:1,fieldName:"flip_horizontal"}},model:{type:0,onChange:function(N){var O,D,z,$,fe,Ce;return L(function(Be){switch(Be.g){case 1:O=N==="short"?["face_detection_short_range.tflite"]:["face_detection_full_range_sparse.tflite"],D=m(O),z=D.next();case 2:if(z.done){Be.g=4;break}return $=z.value,fe="third_party/mediapipe/modules/face_detection/"+$,F(Be,qe(c.g,$),5);case 5:Ce=Be.h,c.g.overrideFile(fe,Ce),z=D.next(),Be.g=2;break;case 4:return g.url=N==="short"?"face_detection_short.binarypb":"face_detection_full.binarypb",k.graphOptionXref.calculatorName=N==="short"?"facedetectionshortrangegpu__facedetectionshortrangecommon__TensorsToDetectionsCalculator":"facedetectionfullrangegpu__facedetectionfullrangecommon__TensorsToDetectionsCalculator",Be.return(!0)}})}},minDetectionConfidence:k}})}s=or.prototype,s.close=function(){return this.g.close(),Promise.resolve()},s.onResults=function(t){this.g.onResults(t)},s.initialize=function(){var t=this;return L(function(c){return F(c,t.g.initialize(),0)})},s.reset=function(){this.g.reset()},s.send=function(t){var c=this;return L(function(g){return F(g,c.g.send(t),0)})},s.setOptions=function(t){this.g.setOptions(t)},he("FaceDetection",or),he("FACEDETECTION_LIPS",B),he("FACEDETECTION_LEFT_EYE",J),he("FACEDETECTION_LEFT_EYEBROW",W),he("FACEDETECTION_RIGHT_EYE",Q),he("FACEDETECTION_RIGHT_EYEBROW",ce),he("FACEDETECTION_FACE_OVAL",_e),he("FACEDETECTION_CONTOURS",Re),he("FACEDETECTION_TESSELATION",[[127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]]),he("VERSION","0.4.1646425229")}).call(this)},{}],grwI9:[function(n,R,i){var o=n("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(i),o.export(i,"enhanceFaceModelPrediction",()=>f);var s=n("../maths/maths"),l=n("./face-landmark-constants");const{PI:h,abs:I,sqrt:S,atan2:e,tan:w}=Math,m=(d,_,y)=>{const j=S(_*_+y*y),r=w(d/2);return[2*atan(_*r/j),2*atan(y*r/j)]},f=(d,_,y=!0)=>{if(!d)throw Error("This is *not* a valid prediction");const{keypoints:j}=d;let r=0,b=Number.POSITIVE_INFINITY,v,C,M=j[152],P=j[10];const F={faceOval:l.FACE_CONTOURS.faceOval.map(Ae=>{const lt=j[Ae];return lt.y>r&&(r=lt.y,v=Ae),lt.y<b&&(b=lt.y,C=Ae),lt}),lips:l.FACE_CONTOURS.lips.map(Ae=>j[Ae]),leftEye:l.FACE_CONTOURS.leftEye.map(Ae=>j[Ae]),leftEyebrow:l.FACE_CONTOURS.leftEyebrow.map(Ae=>j[Ae]),leftIris:l.FACE_CONTOURS.leftIris.map(Ae=>j[Ae]),rightEye:l.FACE_CONTOURS.rightEye.map(Ae=>j[Ae]),rightEyebrow:l.FACE_CONTOURS.rightEyebrow.map(Ae=>j[Ae]),rightIris:l.FACE_CONTOURS.rightIris.map(Ae=>j[Ae])};F.outerLip=l.LIP_PATH_OUTER.map(Ae=>F.lips[Ae]),F.innerLip=l.LIP_PATH_INNER.map(Ae=>F.lips[Ae]);const U=j[4],T=j[9],V=j[0],H=(0,s.hypoteneuse2D)(M,P);d.headHeight=H,F.headVertical=[M,U,P];const K=Ae=>{const lt=Ae[0],mt=Ae[1],At=Ae[2],un=Ae[3],Ot=Math.abs(lt.x-At.x),nn=un.y-mt.y;return{x:Ot*.5+At.x,y:nn*.5+mt.y,diameter:Math.max(Ot,nn)}},E=K(F.leftIris),L=K(F.rightIris),re=j[362],ne=j[263],oe=j[133],he=j[33],be=(0,s.hypoteneuse2D)(re,ne),ve=(0,s.hypoteneuse2D)(oe,he);F.leftEyeSocket=[re,ne],F.rightEyeSocket=[oe,he],F.leftPupil=E,F.rightPupil=L,d.rightEyeDirection=(L.x-he.x)/ve*-2+1,d.leftEyeDirection=(E.x-re.x)/be*2-1,d.eyeDirection=.5*(d.rightEyeDirection+d.leftEyeDirection),d.isLookingRight=d.eyeDirection>.5;const ke=F.lips,We=ke.length,rt=10,X=5,q=ke[0],Z=ke[rt*2],te=ke[rt*2],ee=ke[We-1],pe=ke[We-X-1],se=ke[rt*2+X],me=(0,s.hypoteneuse2D)(pe,se),ue=((0,s.hypoteneuse2D)(Z,ee)+(0,s.hypoteneuse2D)(q,te))*.5,le=H*l.RATIO_OF_MOUTH_TO_FACE,ae=me/le,ge=ae>.2,je=ue>me;d.mouthRange=me,d.mouthRatio=ae,d.mouthOpen=ge,d.mouthHeight=me,d.mouthWidth=ue,d.mouthShape=ge?je?l.MOUTH_SHAPE_E:l.MOUTH_SHAPE_O:l.MOUTH_SHAPE_CLOSED;const Se=((y?be/ve:ve/be)-1)*2,Oe=(0,s.clamp)(Se<0?Se*2:Se,-1,1),it=re.x-oe.x,ut=re.y-oe.y,Fe=e(it,ut),gt=((y?-Fe:Fe)+Math.PI*.5)*1.3,Ke=(0,s.clamp)(gt,-1,1),wt=M.z-P.z,kt=M.y-P.y,Dt=e(wt,kt)*1.5,Et=(0,s.clamp)(Dt,-1,1);return d.isFacingRight=Oe>0,d.pitch=Et,d.roll=Ke,d.yaw=Oe,d.time=_,d.annotations=F,d}},{"../maths/maths":"iDBHd","./face-landmark-constants":"518W7","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bhPSB:[function(n,R,i){let o=n("58eeb638a627de46"),s=n("aade7d6e696e89d4"),l=s.getBundleURL("d5l0U")+n("85f44aac60b4404d").resolve("2Z2gq");R.exports=o(l,s.getOrigin(l),!1)},{"58eeb638a627de46":"5Byxz",aade7d6e696e89d4:"bGZ1f","85f44aac60b4404d":"6jNRu"}]},[],null,"parcelRequireaaed")});export default _s();
