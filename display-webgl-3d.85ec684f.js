var vs=(e,N)=>()=>(N||e((N={exports:{}}).exports,N),N.exports);var xs=vs((Xr,or)=>{(function(e,N,o,a,m){var M=typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:typeof global!="undefined"?global:{},v=typeof M[a]=="function"&&M[a],n=v.cache||{},i=typeof or!="undefined"&&typeof or.require=="function"&&or.require.bind(or);function t(f,c){if(!n[f]){if(!e[f]){var s=typeof M[a]=="function"&&M[a];if(!c&&s)return s(f,!0);if(v)return v(f,!0);if(i&&typeof f=="string")return i(f);var d=new Error("Cannot find module '"+f+"'");throw d.code="MODULE_NOT_FOUND",d}u.resolve=g,u.cache={};var p=n[f]=new t.Module(f);e[f][0].call(p.exports,u,p,p.exports,this)}return n[f].exports;function u(S){var y=u.resolve(S);return y===!1?{}:t(y)}function g(S){var y=e[f][1][S];return y??S}}function r(f){this.id=f,this.bundle=t,this.exports={}}t.isParcelRequire=!0,t.Module=r,t.modules=e,t.cache=n,t.parent=v,t.register=function(f,c){e[f]=[function(s,d){d.exports=c},{}]},Object.defineProperty(t,"root",{get:function(){return M[a]}}),M[a]=t;for(var l=0;l<N.length;l++)t(N[l]);if(o){var h=t(o);typeof Xr=="object"&&typeof or!="undefined"?or.exports=h:typeof define=="function"&&define.amd?define(function(){return h}):m&&(this[m]=h)}})({kYJdi:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DisplayWebGL3D",()=>f);var m=e("./display-abstract"),M=e("@mediapipe/tasks-vision"),v=e("three/src/Three.js"),n=e("three/examples/jsm/controls/OrbitControls"),i=e("../assets/particles/particle.png"),t=a.interopDefault(i);const r=new v.TextureLoader,l=1,h=1200;class f extends m.AbstractDisplay{camera;scene;renderer;particles;get depth(){return 100}constructor(s,d,p,u=478){super(s,d,p);this.create(u)}async create(s){const d=new v.Scene,p=new v.Mesh(new v.BoxGeometry(2,.1,.1),new v.MeshStandardMaterial({color:"red"}));d.add(p),d.add(new v.AmbientLight(13421772,.4));const u=new v.DirectionalLight(16777215,1);u.position.set(3,3,3),d.add(u);const g=new v.WebGLRenderer({antialias:!0,canvas:this.canvas,alpha:!0});g.setPixelRatio(window.devicePixelRatio);const S=new v.PerspectiveCamera;S.position.z=h,this.scene=d,this.renderer=g,this.camera=S,this.particles=await this.createParticles(s),this.available=!0}render(){this.renderer.render(this.scene,this.camera)}async createParticles(s=478){return new Promise((d,p)=>{r.load(t.default,u=>{const g={map:u,transparent:!0,opacity:1,color:4025479048},S=new v.SpriteMaterial(g),y=[];let T=0,x=0;const _=Math.floor(Math.sqrt(s));for(let A=0;A<s;++A){const w=new v.Sprite(S),j=T/_,R=x/_;w.scale.set(10,10,10),w.position.x=j*this.width,w.position.y=0,w.position.z=R*this.height,y[A]=w,this.scene.add(w),A%_==0?(x++,T=0):T++}return d(y)},u=>(console.error("Couldn't load particle"),p("Couldn't load particle")))})}clear(){}drawElement(s,d=0,p=0,u=!0){}drawPerson(s,d,p){if(this.available===!1)return;const u=s.data,g=u.faceLandmarks,S=s.options,y=s.hue,T=s.now;if(u.facialTransformationMatrixes){const x=u.facialTransformationMatrixes;new v.Matrix4().set(...x.data)}s.isMouthOpen?(g.forEach((x,_)=>{const A=this.particles[_];A.material.color.set(s.hsl),A.position.x=(1-x.x-.5)*this.width,A.position.y=(x.y-.5)*-this.height,A.position.z=x.z*this.depth}),console.log("particle",s.hsl,g[0],g[0].material)):this.particles.forEach((x,_)=>{x.position.y=Math.cos((T+x.position.x/this.width+x.position.z/this.width)*l)*this.depth})}overdraw(s=0,d=-1){this.canvasContext.drawImage(this.canvas,s,d)}takePhotograph(s="image/png"){return this.canvas.toDataURL(s)}}},{"./display-abstract":"5Ql3r","@mediapipe/tasks-vision":"fKA8n","three/src/Three.js":"3iqaT","three/examples/jsm/controls/OrbitControls":"atg5I","../assets/particles/particle.png":"aXOpX","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5Ql3r":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AbstractDisplay",()=>m);class m{debug=!0;available=!1;canvas;nextDisplayLink;previousDisplayLink;get previousDisplay(){return this.previousDisplayLink}get nextDisplay(){return this.nextDisplayLink}get firstDisplay(){let v=this;for(;v.previousDisplay;)v=v.previousDisplay;return v}get lastDisplay(){let v=this;for(;v.nextDisplayLink;)v=v.nextDisplayLink;return v}addDisplay(v){const n=this.lastDisplay;n.nextDisplayLink=v,v.previousDisplayLink=n}get width(){return this.canvas.width}get height(){return this.canvas.height}constructor(v,n,i){this.canvas=v,this.canvas.width=n,this.canvas.height=i}clear(){}drawPerson(v,n,i){}drawElement(v,n,i){}render(){}takePhotograph(v="image/png"){}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3iqaT":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLArrayRenderTarget",()=>M.WebGLArrayRenderTarget),a.export(o,"WebGL3DRenderTarget",()=>v.WebGL3DRenderTarget),a.export(o,"WebGLMultipleRenderTargets",()=>n.WebGLMultipleRenderTargets),a.export(o,"WebGLCubeRenderTarget",()=>i.WebGLCubeRenderTarget),a.export(o,"WebGLRenderTarget",()=>t.WebGLRenderTarget),a.export(o,"WebGLRenderer",()=>r.WebGLRenderer),a.export(o,"WebGL1Renderer",()=>l.WebGL1Renderer),a.export(o,"ShaderLib",()=>h.ShaderLib),a.export(o,"UniformsLib",()=>f.UniformsLib),a.export(o,"UniformsUtils",()=>c.UniformsUtils),a.export(o,"ShaderChunk",()=>s.ShaderChunk),a.export(o,"FogExp2",()=>d.FogExp2),a.export(o,"Fog",()=>p.Fog),a.export(o,"Scene",()=>u.Scene),a.export(o,"Sprite",()=>g.Sprite),a.export(o,"LOD",()=>S.LOD),a.export(o,"SkinnedMesh",()=>y.SkinnedMesh),a.export(o,"Skeleton",()=>T.Skeleton),a.export(o,"Bone",()=>x.Bone),a.export(o,"Mesh",()=>_.Mesh),a.export(o,"InstancedMesh",()=>A.InstancedMesh),a.export(o,"LineSegments",()=>w.LineSegments),a.export(o,"LineLoop",()=>j.LineLoop),a.export(o,"Line",()=>R.Line),a.export(o,"Points",()=>L.Points),a.export(o,"Group",()=>D.Group),a.export(o,"VideoTexture",()=>P.VideoTexture),a.export(o,"FramebufferTexture",()=>k.FramebufferTexture),a.export(o,"Source",()=>O.Source),a.export(o,"DataTexture",()=>F.DataTexture),a.export(o,"DataArrayTexture",()=>G.DataArrayTexture),a.export(o,"Data3DTexture",()=>b.Data3DTexture),a.export(o,"CompressedTexture",()=>C.CompressedTexture),a.export(o,"CompressedArrayTexture",()=>I.CompressedArrayTexture),a.export(o,"CubeTexture",()=>B.CubeTexture),a.export(o,"CanvasTexture",()=>H.CanvasTexture),a.export(o,"DepthTexture",()=>X.DepthTexture),a.export(o,"Texture",()=>Y.Texture),a.export(o,"AnimationLoader",()=>ne.AnimationLoader),a.export(o,"CompressedTextureLoader",()=>ge.CompressedTextureLoader),a.export(o,"CubeTextureLoader",()=>me.CubeTextureLoader),a.export(o,"DataTextureLoader",()=>_e.DataTextureLoader),a.export(o,"TextureLoader",()=>le.TextureLoader),a.export(o,"ObjectLoader",()=>ee.ObjectLoader),a.export(o,"MaterialLoader",()=>je.MaterialLoader),a.export(o,"BufferGeometryLoader",()=>z.BufferGeometryLoader),a.export(o,"DefaultLoadingManager",()=>$.DefaultLoadingManager),a.export(o,"LoadingManager",()=>$.LoadingManager),a.export(o,"ImageLoader",()=>se.ImageLoader),a.export(o,"ImageBitmapLoader",()=>ie.ImageBitmapLoader),a.export(o,"FileLoader",()=>te.FileLoader),a.export(o,"Loader",()=>q.Loader),a.export(o,"LoaderUtils",()=>ce.LoaderUtils),a.export(o,"Cache",()=>xe.Cache),a.export(o,"AudioLoader",()=>we.AudioLoader),a.export(o,"SpotLight",()=>Ee.SpotLight),a.export(o,"PointLight",()=>ae.PointLight),a.export(o,"RectAreaLight",()=>be.RectAreaLight),a.export(o,"HemisphereLight",()=>Se.HemisphereLight),a.export(o,"HemisphereLightProbe",()=>Ae.HemisphereLightProbe),a.export(o,"DirectionalLight",()=>Ce.DirectionalLight),a.export(o,"AmbientLight",()=>Be.AmbientLight),a.export(o,"AmbientLightProbe",()=>U.AmbientLightProbe),a.export(o,"Light",()=>E.Light),a.export(o,"LightProbe",()=>V.LightProbe),a.export(o,"StereoCamera",()=>re.StereoCamera),a.export(o,"PerspectiveCamera",()=>ue.PerspectiveCamera),a.export(o,"OrthographicCamera",()=>J.OrthographicCamera),a.export(o,"CubeCamera",()=>fe.CubeCamera),a.export(o,"ArrayCamera",()=>Te.ArrayCamera),a.export(o,"Camera",()=>pe.Camera),a.export(o,"AudioListener",()=>Ie.AudioListener),a.export(o,"PositionalAudio",()=>ke.PositionalAudio),a.export(o,"AudioContext",()=>De.AudioContext),a.export(o,"AudioAnalyser",()=>Ge.AudioAnalyser),a.export(o,"Audio",()=>Ue.Audio),a.export(o,"VectorKeyframeTrack",()=>K.VectorKeyframeTrack),a.export(o,"StringKeyframeTrack",()=>Le.StringKeyframeTrack),a.export(o,"QuaternionKeyframeTrack",()=>Re.QuaternionKeyframeTrack),a.export(o,"NumberKeyframeTrack",()=>Pe.NumberKeyframeTrack),a.export(o,"ColorKeyframeTrack",()=>ve.ColorKeyframeTrack),a.export(o,"BooleanKeyframeTrack",()=>Ne.BooleanKeyframeTrack),a.export(o,"PropertyMixer",()=>Oe.PropertyMixer),a.export(o,"PropertyBinding",()=>Ke.PropertyBinding),a.export(o,"KeyframeTrack",()=>dt.KeyframeTrack),a.export(o,"AnimationUtils",()=>he.AnimationUtils),a.export(o,"AnimationObjectGroup",()=>ot.AnimationObjectGroup),a.export(o,"AnimationMixer",()=>Qe.AnimationMixer),a.export(o,"AnimationClip",()=>$e.AnimationClip),a.export(o,"AnimationAction",()=>Ze.AnimationAction),a.export(o,"Uniform",()=>lt.Uniform),a.export(o,"UniformsGroup",()=>qe.UniformsGroup),a.export(o,"InstancedBufferGeometry",()=>et.InstancedBufferGeometry),a.export(o,"BufferGeometry",()=>bt.BufferGeometry),a.export(o,"InterleavedBufferAttribute",()=>Mt.InterleavedBufferAttribute),a.export(o,"InstancedInterleavedBuffer",()=>Tt.InstancedInterleavedBuffer),a.export(o,"InterleavedBuffer",()=>Rt.InterleavedBuffer),a.export(o,"InstancedBufferAttribute",()=>St.InstancedBufferAttribute),a.export(o,"GLBufferAttribute",()=>gt.GLBufferAttribute),a.export(o,"Object3D",()=>jt.Object3D),a.export(o,"Raycaster",()=>Et.Raycaster),a.export(o,"Layers",()=>ft.Layers),a.export(o,"EventDispatcher",()=>ct.EventDispatcher),a.export(o,"Clock",()=>pt.Clock),a.export(o,"QuaternionLinearInterpolant",()=>Ut.QuaternionLinearInterpolant),a.export(o,"LinearInterpolant",()=>Bt.LinearInterpolant),a.export(o,"DiscreteInterpolant",()=>Nt.DiscreteInterpolant),a.export(o,"CubicInterpolant",()=>mt.CubicInterpolant),a.export(o,"Interpolant",()=>vt.Interpolant),a.export(o,"Triangle",()=>Ct.Triangle),a.export(o,"MathUtils",()=>Gt.MathUtils),a.export(o,"Spherical",()=>it.Spherical),a.export(o,"Cylindrical",()=>kt.Cylindrical),a.export(o,"Plane",()=>Ot.Plane),a.export(o,"Frustum",()=>Vt.Frustum),a.export(o,"Sphere",()=>Ht.Sphere),a.export(o,"Ray",()=>Qt.Ray),a.export(o,"Matrix4",()=>$t.Matrix4),a.export(o,"Matrix3",()=>It.Matrix3),a.export(o,"Box3",()=>qt.Box3),a.export(o,"Box2",()=>zt.Box2),a.export(o,"Line3",()=>Jt.Line3),a.export(o,"Euler",()=>xt.Euler),a.export(o,"Vector4",()=>Wt.Vector4),a.export(o,"Vector3",()=>Xt.Vector3),a.export(o,"Vector2",()=>er.Vector2),a.export(o,"Quaternion",()=>wt.Quaternion),a.export(o,"Color",()=>Yt.Color),a.export(o,"ColorManagement",()=>Lt.ColorManagement),a.export(o,"SphericalHarmonics3",()=>Zt.SphericalHarmonics3),a.export(o,"SpotLightHelper",()=>tr.SpotLightHelper),a.export(o,"SkeletonHelper",()=>rr.SkeletonHelper),a.export(o,"PointLightHelper",()=>sr.PointLightHelper),a.export(o,"HemisphereLightHelper",()=>W.HemisphereLightHelper),a.export(o,"GridHelper",()=>de.GridHelper),a.export(o,"PolarGridHelper",()=>ye.PolarGridHelper),a.export(o,"DirectionalLightHelper",()=>oe.DirectionalLightHelper),a.export(o,"CameraHelper",()=>Me.CameraHelper),a.export(o,"BoxHelper",()=>Fe.BoxHelper),a.export(o,"Box3Helper",()=>Ve.Box3Helper),a.export(o,"PlaneHelper",()=>He.PlaneHelper),a.export(o,"ArrowHelper",()=>ze.ArrowHelper),a.export(o,"AxesHelper",()=>Xe.AxesHelper),a.export(o,"Shape",()=>We.Shape),a.export(o,"Path",()=>tt.Path),a.export(o,"ShapePath",()=>rt.ShapePath),a.export(o,"CurvePath",()=>ht.CurvePath),a.export(o,"Curve",()=>_t.Curve),a.export(o,"DataUtils",()=>st.DataUtils),a.export(o,"ImageUtils",()=>Ye.ImageUtils),a.export(o,"ShapeUtils",()=>Dt.ShapeUtils),a.export(o,"PMREMGenerator",()=>nt.PMREMGenerator),a.export(o,"WebGLUtils",()=>yt.WebGLUtils);var m=e("./constants.js"),M=e("./renderers/WebGLArrayRenderTarget.js"),v=e("./renderers/WebGL3DRenderTarget.js"),n=e("./renderers/WebGLMultipleRenderTargets.js"),i=e("./renderers/WebGLCubeRenderTarget.js"),t=e("./renderers/WebGLRenderTarget.js"),r=e("./renderers/WebGLRenderer.js"),l=e("./renderers/WebGL1Renderer.js"),h=e("./renderers/shaders/ShaderLib.js"),f=e("./renderers/shaders/UniformsLib.js"),c=e("./renderers/shaders/UniformsUtils.js"),s=e("./renderers/shaders/ShaderChunk.js"),d=e("./scenes/FogExp2.js"),p=e("./scenes/Fog.js"),u=e("./scenes/Scene.js"),g=e("./objects/Sprite.js"),S=e("./objects/LOD.js"),y=e("./objects/SkinnedMesh.js"),T=e("./objects/Skeleton.js"),x=e("./objects/Bone.js"),_=e("./objects/Mesh.js"),A=e("./objects/InstancedMesh.js"),w=e("./objects/LineSegments.js"),j=e("./objects/LineLoop.js"),R=e("./objects/Line.js"),L=e("./objects/Points.js"),D=e("./objects/Group.js"),P=e("./textures/VideoTexture.js"),k=e("./textures/FramebufferTexture.js"),O=e("./textures/Source.js"),F=e("./textures/DataTexture.js"),G=e("./textures/DataArrayTexture.js"),b=e("./textures/Data3DTexture.js"),C=e("./textures/CompressedTexture.js"),I=e("./textures/CompressedArrayTexture.js"),B=e("./textures/CubeTexture.js"),H=e("./textures/CanvasTexture.js"),X=e("./textures/DepthTexture.js"),Y=e("./textures/Texture.js"),Z=e("./geometries/Geometries.js");a.exportAll(Z,o);var Q=e("./materials/Materials.js");a.exportAll(Q,o);var ne=e("./loaders/AnimationLoader.js"),ge=e("./loaders/CompressedTextureLoader.js"),me=e("./loaders/CubeTextureLoader.js"),_e=e("./loaders/DataTextureLoader.js"),le=e("./loaders/TextureLoader.js"),ee=e("./loaders/ObjectLoader.js"),je=e("./loaders/MaterialLoader.js"),z=e("./loaders/BufferGeometryLoader.js"),$=e("./loaders/LoadingManager.js"),se=e("./loaders/ImageLoader.js"),ie=e("./loaders/ImageBitmapLoader.js"),te=e("./loaders/FileLoader.js"),q=e("./loaders/Loader.js"),ce=e("./loaders/LoaderUtils.js"),xe=e("./loaders/Cache.js"),we=e("./loaders/AudioLoader.js"),Ee=e("./lights/SpotLight.js"),ae=e("./lights/PointLight.js"),be=e("./lights/RectAreaLight.js"),Se=e("./lights/HemisphereLight.js"),Ae=e("./lights/HemisphereLightProbe.js"),Ce=e("./lights/DirectionalLight.js"),Be=e("./lights/AmbientLight.js"),U=e("./lights/AmbientLightProbe.js"),E=e("./lights/Light.js"),V=e("./lights/LightProbe.js"),re=e("./cameras/StereoCamera.js"),ue=e("./cameras/PerspectiveCamera.js"),J=e("./cameras/OrthographicCamera.js"),fe=e("./cameras/CubeCamera.js"),Te=e("./cameras/ArrayCamera.js"),pe=e("./cameras/Camera.js"),Ie=e("./audio/AudioListener.js"),ke=e("./audio/PositionalAudio.js"),De=e("./audio/AudioContext.js"),Ge=e("./audio/AudioAnalyser.js"),Ue=e("./audio/Audio.js"),K=e("./animation/tracks/VectorKeyframeTrack.js"),Le=e("./animation/tracks/StringKeyframeTrack.js"),Re=e("./animation/tracks/QuaternionKeyframeTrack.js"),Pe=e("./animation/tracks/NumberKeyframeTrack.js"),ve=e("./animation/tracks/ColorKeyframeTrack.js"),Ne=e("./animation/tracks/BooleanKeyframeTrack.js"),Oe=e("./animation/PropertyMixer.js"),Ke=e("./animation/PropertyBinding.js"),dt=e("./animation/KeyframeTrack.js"),he=e("./animation/AnimationUtils.js"),ot=e("./animation/AnimationObjectGroup.js"),Qe=e("./animation/AnimationMixer.js"),$e=e("./animation/AnimationClip.js"),Ze=e("./animation/AnimationAction.js"),lt=e("./core/Uniform.js"),qe=e("./core/UniformsGroup.js"),et=e("./core/InstancedBufferGeometry.js"),bt=e("./core/BufferGeometry.js"),Mt=e("./core/InterleavedBufferAttribute.js"),Tt=e("./core/InstancedInterleavedBuffer.js"),Rt=e("./core/InterleavedBuffer.js"),St=e("./core/InstancedBufferAttribute.js"),gt=e("./core/GLBufferAttribute.js"),Pt=e("./core/BufferAttribute.js");a.exportAll(Pt,o);var jt=e("./core/Object3D.js"),Et=e("./core/Raycaster.js"),ft=e("./core/Layers.js"),ct=e("./core/EventDispatcher.js"),pt=e("./core/Clock.js"),Ut=e("./math/interpolants/QuaternionLinearInterpolant.js"),Bt=e("./math/interpolants/LinearInterpolant.js"),Nt=e("./math/interpolants/DiscreteInterpolant.js"),mt=e("./math/interpolants/CubicInterpolant.js"),vt=e("./math/Interpolant.js"),Ct=e("./math/Triangle.js"),Gt=e("./math/MathUtils.js"),it=e("./math/Spherical.js"),kt=e("./math/Cylindrical.js"),Ot=e("./math/Plane.js"),Vt=e("./math/Frustum.js"),Ht=e("./math/Sphere.js"),Qt=e("./math/Ray.js"),$t=e("./math/Matrix4.js"),It=e("./math/Matrix3.js"),qt=e("./math/Box3.js"),zt=e("./math/Box2.js"),Jt=e("./math/Line3.js"),xt=e("./math/Euler.js"),Wt=e("./math/Vector4.js"),Xt=e("./math/Vector3.js"),er=e("./math/Vector2.js"),wt=e("./math/Quaternion.js"),Yt=e("./math/Color.js"),Lt=e("./math/ColorManagement.js"),Zt=e("./math/SphericalHarmonics3.js"),tr=e("./helpers/SpotLightHelper.js"),rr=e("./helpers/SkeletonHelper.js"),sr=e("./helpers/PointLightHelper.js"),W=e("./helpers/HemisphereLightHelper.js"),de=e("./helpers/GridHelper.js"),ye=e("./helpers/PolarGridHelper.js"),oe=e("./helpers/DirectionalLightHelper.js"),Me=e("./helpers/CameraHelper.js"),Fe=e("./helpers/BoxHelper.js"),Ve=e("./helpers/Box3Helper.js"),He=e("./helpers/PlaneHelper.js"),ze=e("./helpers/ArrowHelper.js"),Xe=e("./helpers/AxesHelper.js"),Je=e("./extras/curves/Curves.js");a.exportAll(Je,o);var We=e("./extras/core/Shape.js"),tt=e("./extras/core/Path.js"),rt=e("./extras/core/ShapePath.js"),ht=e("./extras/core/CurvePath.js"),_t=e("./extras/core/Curve.js"),st=e("./extras/DataUtils.js"),Ye=e("./extras/ImageUtils.js"),Dt=e("./extras/ShapeUtils.js"),nt=e("./extras/PMREMGenerator.js"),yt=e("./renderers/webgl/WebGLUtils.js");a.exportAll(m,o);var Kt=e("./Three.Legacy.js");a.exportAll(Kt,o),typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:m.REVISION}})),typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=m.REVISION)},{"./constants.js":"bqsVL","./renderers/WebGLArrayRenderTarget.js":"aKnGN","./renderers/WebGL3DRenderTarget.js":"2QwrA","./renderers/WebGLMultipleRenderTargets.js":"hIsm5","./renderers/WebGLCubeRenderTarget.js":"8nOAb","./renderers/WebGLRenderTarget.js":"azVIG","./renderers/WebGLRenderer.js":"9OF3S","./renderers/WebGL1Renderer.js":"fUT9s","./renderers/shaders/ShaderLib.js":"lxrgR","./renderers/shaders/UniformsLib.js":"fRE1G","./renderers/shaders/UniformsUtils.js":"4tBjA","./renderers/shaders/ShaderChunk.js":"3CV51","./scenes/FogExp2.js":"btueC","./scenes/Fog.js":"lgETf","./scenes/Scene.js":"3Xh8n","./objects/Sprite.js":"eTjd4","./objects/LOD.js":"bBvxa","./objects/SkinnedMesh.js":"5xf7y","./objects/Skeleton.js":"k7L5l","./objects/Bone.js":"ihC8O","./objects/Mesh.js":"d9YFT","./objects/InstancedMesh.js":"fB156","./objects/LineSegments.js":"cOWpn","./objects/LineLoop.js":"11P2S","./objects/Line.js":"li6mQ","./objects/Points.js":"gR9K2","./objects/Group.js":"c5DBK","./textures/VideoTexture.js":"fMTJT","./textures/FramebufferTexture.js":"f5ZOG","./textures/Source.js":"1xLMW","./textures/DataTexture.js":"6eyK2","./textures/DataArrayTexture.js":"aY9tP","./textures/Data3DTexture.js":"2fyDm","./textures/CompressedTexture.js":"1DPW2","./textures/CompressedArrayTexture.js":"8jeyI","./textures/CubeTexture.js":"jcedY","./textures/CanvasTexture.js":"huGWz","./textures/DepthTexture.js":"2m8py","./textures/Texture.js":"2paEl","./geometries/Geometries.js":"8bcQC","./materials/Materials.js":"lNrQp","./loaders/AnimationLoader.js":"glV4f","./loaders/CompressedTextureLoader.js":"ex9gW","./loaders/CubeTextureLoader.js":"xlXc4","./loaders/DataTextureLoader.js":"4ip7i","./loaders/TextureLoader.js":"9WN7O","./loaders/ObjectLoader.js":"9KzHM","./loaders/MaterialLoader.js":"bUSZA","./loaders/BufferGeometryLoader.js":"aVfyA","./loaders/LoadingManager.js":"boZML","./loaders/ImageLoader.js":"12z9k","./loaders/ImageBitmapLoader.js":"eBumg","./loaders/FileLoader.js":"9KnLd","./loaders/Loader.js":"l8uTS","./loaders/LoaderUtils.js":"5qKFH","./loaders/Cache.js":"hTZnD","./loaders/AudioLoader.js":"cuZrC","./lights/SpotLight.js":"9LpqN","./lights/PointLight.js":"lxZ00","./lights/RectAreaLight.js":"giWpp","./lights/HemisphereLight.js":"9KuCh","./lights/HemisphereLightProbe.js":"2kwbV","./lights/DirectionalLight.js":"aQgd4","./lights/AmbientLight.js":"6NGDW","./lights/AmbientLightProbe.js":"8ujvT","./lights/Light.js":"j3zG9","./lights/LightProbe.js":"cwFzz","./cameras/StereoCamera.js":"XfZRQ","./cameras/PerspectiveCamera.js":"bazbq","./cameras/OrthographicCamera.js":"aETgy","./cameras/CubeCamera.js":"bLWI2","./cameras/ArrayCamera.js":"7lwaI","./cameras/Camera.js":"2L3jQ","./audio/AudioListener.js":"f2zzH","./audio/PositionalAudio.js":"iIm9V","./audio/AudioContext.js":"fhjv7","./audio/AudioAnalyser.js":"hvTZm","./audio/Audio.js":"27Sl5","./animation/tracks/VectorKeyframeTrack.js":"bzrH8","./animation/tracks/StringKeyframeTrack.js":"4V00d","./animation/tracks/QuaternionKeyframeTrack.js":"1z8JV","./animation/tracks/NumberKeyframeTrack.js":"a6p6H","./animation/tracks/ColorKeyframeTrack.js":"3ASO0","./animation/tracks/BooleanKeyframeTrack.js":"5eXpE","./animation/PropertyMixer.js":"b2rcU","./animation/PropertyBinding.js":"5fWtn","./animation/KeyframeTrack.js":"6BDOr","./animation/AnimationUtils.js":"lFJRf","./animation/AnimationObjectGroup.js":"7A7q1","./animation/AnimationMixer.js":"kFzcX","./animation/AnimationClip.js":"gfGc5","./animation/AnimationAction.js":"dxlJk","./core/Uniform.js":"4eEt7","./core/UniformsGroup.js":"gAg4k","./core/InstancedBufferGeometry.js":"4q67B","./core/BufferGeometry.js":"jAZYz","./core/InterleavedBufferAttribute.js":"1TZ2X","./core/InstancedInterleavedBuffer.js":"jNLuQ","./core/InterleavedBuffer.js":"931Vz","./core/InstancedBufferAttribute.js":"cf2Wn","./core/GLBufferAttribute.js":"6LcIe","./core/BufferAttribute.js":"7hhbt","./core/Object3D.js":"ibguD","./core/Raycaster.js":"bIJmc","./core/Layers.js":"4RZ6C","./core/EventDispatcher.js":"d6Goy","./core/Clock.js":"e6hUj","./math/interpolants/QuaternionLinearInterpolant.js":"e1PzR","./math/interpolants/LinearInterpolant.js":"le8UA","./math/interpolants/DiscreteInterpolant.js":"i6w2Q","./math/interpolants/CubicInterpolant.js":"j4MdW","./math/Interpolant.js":"jjk6p","./math/Triangle.js":"bT9h1","./math/MathUtils.js":"9o1gq","./math/Spherical.js":"fbHxV","./math/Cylindrical.js":"fFKSr","./math/Plane.js":"a9oL5","./math/Frustum.js":"hmBSr","./math/Sphere.js":"jgQJ1","./math/Ray.js":"8evV6","./math/Matrix4.js":"64n8p","./math/Matrix3.js":"85Mgp","./math/Box3.js":"dDJ5Q","./math/Box2.js":"g7q1e","./math/Line3.js":"jTaDW","./math/Euler.js":"9PbQd","./math/Vector4.js":"h0tSe","./math/Vector3.js":"fUbuJ","./math/Vector2.js":"crXpG","./math/Quaternion.js":"iTBTv","./math/Color.js":"gFgcM","./math/ColorManagement.js":"4c2nU","./math/SphericalHarmonics3.js":"kiZTk","./helpers/SpotLightHelper.js":"enmRj","./helpers/SkeletonHelper.js":"6OkiN","./helpers/PointLightHelper.js":"bJcrf","./helpers/HemisphereLightHelper.js":"jeUz9","./helpers/GridHelper.js":"amMcV","./helpers/PolarGridHelper.js":"gJ4KC","./helpers/DirectionalLightHelper.js":"5ikJJ","./helpers/CameraHelper.js":"iTrqa","./helpers/BoxHelper.js":"jAmrE","./helpers/Box3Helper.js":"91ILL","./helpers/PlaneHelper.js":"7o05K","./helpers/ArrowHelper.js":"4wjXv","./helpers/AxesHelper.js":"6lTlj","./extras/curves/Curves.js":"d3xIh","./extras/core/Shape.js":"Rgbrn","./extras/core/Path.js":"11ocG","./extras/core/ShapePath.js":"f1l8r","./extras/core/CurvePath.js":"eWmYX","./extras/core/Curve.js":"5LCIB","./extras/DataUtils.js":"k0z4p","./extras/ImageUtils.js":"bdPum","./extras/ShapeUtils.js":"6HiLE","./extras/PMREMGenerator.js":"eiBEx","./renderers/webgl/WebGLUtils.js":"9KSSb","./Three.Legacy.js":"erqVk","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bqsVL:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"REVISION",()=>m),a.export(o,"MOUSE",()=>M),a.export(o,"TOUCH",()=>v),a.export(o,"CullFaceNone",()=>n),a.export(o,"CullFaceBack",()=>i),a.export(o,"CullFaceFront",()=>t),a.export(o,"CullFaceFrontBack",()=>r),a.export(o,"BasicShadowMap",()=>l),a.export(o,"PCFShadowMap",()=>h),a.export(o,"PCFSoftShadowMap",()=>f),a.export(o,"VSMShadowMap",()=>c),a.export(o,"FrontSide",()=>s),a.export(o,"BackSide",()=>d),a.export(o,"DoubleSide",()=>p),a.export(o,"TwoPassDoubleSide",()=>u),a.export(o,"NoBlending",()=>g),a.export(o,"NormalBlending",()=>S),a.export(o,"AdditiveBlending",()=>y),a.export(o,"SubtractiveBlending",()=>T),a.export(o,"MultiplyBlending",()=>x),a.export(o,"CustomBlending",()=>_),a.export(o,"AddEquation",()=>A),a.export(o,"SubtractEquation",()=>w),a.export(o,"ReverseSubtractEquation",()=>j),a.export(o,"MinEquation",()=>R),a.export(o,"MaxEquation",()=>L),a.export(o,"ZeroFactor",()=>D),a.export(o,"OneFactor",()=>P),a.export(o,"SrcColorFactor",()=>k),a.export(o,"OneMinusSrcColorFactor",()=>O),a.export(o,"SrcAlphaFactor",()=>F),a.export(o,"OneMinusSrcAlphaFactor",()=>G),a.export(o,"DstAlphaFactor",()=>b),a.export(o,"OneMinusDstAlphaFactor",()=>C),a.export(o,"DstColorFactor",()=>I),a.export(o,"OneMinusDstColorFactor",()=>B),a.export(o,"SrcAlphaSaturateFactor",()=>H),a.export(o,"NeverDepth",()=>X),a.export(o,"AlwaysDepth",()=>Y),a.export(o,"LessDepth",()=>Z),a.export(o,"LessEqualDepth",()=>Q),a.export(o,"EqualDepth",()=>ne),a.export(o,"GreaterEqualDepth",()=>ge),a.export(o,"GreaterDepth",()=>me),a.export(o,"NotEqualDepth",()=>_e),a.export(o,"MultiplyOperation",()=>le),a.export(o,"MixOperation",()=>ee),a.export(o,"AddOperation",()=>je),a.export(o,"NoToneMapping",()=>z),a.export(o,"LinearToneMapping",()=>$),a.export(o,"ReinhardToneMapping",()=>se),a.export(o,"CineonToneMapping",()=>ie),a.export(o,"ACESFilmicToneMapping",()=>te),a.export(o,"CustomToneMapping",()=>q),a.export(o,"UVMapping",()=>ce),a.export(o,"CubeReflectionMapping",()=>xe),a.export(o,"CubeRefractionMapping",()=>we),a.export(o,"EquirectangularReflectionMapping",()=>Ee),a.export(o,"EquirectangularRefractionMapping",()=>ae),a.export(o,"CubeUVReflectionMapping",()=>be),a.export(o,"RepeatWrapping",()=>Se),a.export(o,"ClampToEdgeWrapping",()=>Ae),a.export(o,"MirroredRepeatWrapping",()=>Ce),a.export(o,"NearestFilter",()=>Be),a.export(o,"NearestMipmapNearestFilter",()=>U),a.export(o,"NearestMipMapNearestFilter",()=>E),a.export(o,"NearestMipmapLinearFilter",()=>V),a.export(o,"NearestMipMapLinearFilter",()=>re),a.export(o,"LinearFilter",()=>ue),a.export(o,"LinearMipmapNearestFilter",()=>J),a.export(o,"LinearMipMapNearestFilter",()=>fe),a.export(o,"LinearMipmapLinearFilter",()=>Te),a.export(o,"LinearMipMapLinearFilter",()=>pe),a.export(o,"UnsignedByteType",()=>Ie),a.export(o,"ByteType",()=>ke),a.export(o,"ShortType",()=>De),a.export(o,"UnsignedShortType",()=>Ge),a.export(o,"IntType",()=>Ue),a.export(o,"UnsignedIntType",()=>K),a.export(o,"FloatType",()=>Le),a.export(o,"HalfFloatType",()=>Re),a.export(o,"UnsignedShort4444Type",()=>Pe),a.export(o,"UnsignedShort5551Type",()=>ve),a.export(o,"UnsignedInt248Type",()=>Ne),a.export(o,"AlphaFormat",()=>Oe),a.export(o,"RGBAFormat",()=>Ke),a.export(o,"LuminanceFormat",()=>dt),a.export(o,"LuminanceAlphaFormat",()=>he),a.export(o,"DepthFormat",()=>ot),a.export(o,"DepthStencilFormat",()=>Qe),a.export(o,"RedFormat",()=>$e),a.export(o,"RedIntegerFormat",()=>Ze),a.export(o,"RGFormat",()=>lt),a.export(o,"RGIntegerFormat",()=>qe),a.export(o,"RGBAIntegerFormat",()=>et),a.export(o,"RGB_S3TC_DXT1_Format",()=>bt),a.export(o,"RGBA_S3TC_DXT1_Format",()=>Mt),a.export(o,"RGBA_S3TC_DXT3_Format",()=>Tt),a.export(o,"RGBA_S3TC_DXT5_Format",()=>Rt),a.export(o,"RGB_PVRTC_4BPPV1_Format",()=>St),a.export(o,"RGB_PVRTC_2BPPV1_Format",()=>gt),a.export(o,"RGBA_PVRTC_4BPPV1_Format",()=>Pt),a.export(o,"RGBA_PVRTC_2BPPV1_Format",()=>jt),a.export(o,"RGB_ETC1_Format",()=>Et),a.export(o,"RGB_ETC2_Format",()=>ft),a.export(o,"RGBA_ETC2_EAC_Format",()=>ct),a.export(o,"RGBA_ASTC_4x4_Format",()=>pt),a.export(o,"RGBA_ASTC_5x4_Format",()=>Ut),a.export(o,"RGBA_ASTC_5x5_Format",()=>Bt),a.export(o,"RGBA_ASTC_6x5_Format",()=>Nt),a.export(o,"RGBA_ASTC_6x6_Format",()=>mt),a.export(o,"RGBA_ASTC_8x5_Format",()=>vt),a.export(o,"RGBA_ASTC_8x6_Format",()=>Ct),a.export(o,"RGBA_ASTC_8x8_Format",()=>Gt),a.export(o,"RGBA_ASTC_10x5_Format",()=>it),a.export(o,"RGBA_ASTC_10x6_Format",()=>kt),a.export(o,"RGBA_ASTC_10x8_Format",()=>Ot),a.export(o,"RGBA_ASTC_10x10_Format",()=>Vt),a.export(o,"RGBA_ASTC_12x10_Format",()=>Ht),a.export(o,"RGBA_ASTC_12x12_Format",()=>Qt),a.export(o,"RGBA_BPTC_Format",()=>$t),a.export(o,"RED_RGTC1_Format",()=>It),a.export(o,"SIGNED_RED_RGTC1_Format",()=>qt),a.export(o,"RED_GREEN_RGTC2_Format",()=>zt),a.export(o,"SIGNED_RED_GREEN_RGTC2_Format",()=>Jt),a.export(o,"LoopOnce",()=>xt),a.export(o,"LoopRepeat",()=>Wt),a.export(o,"LoopPingPong",()=>Xt),a.export(o,"InterpolateDiscrete",()=>er),a.export(o,"InterpolateLinear",()=>wt),a.export(o,"InterpolateSmooth",()=>Yt),a.export(o,"ZeroCurvatureEnding",()=>Lt),a.export(o,"ZeroSlopeEnding",()=>Zt),a.export(o,"WrapAroundEnding",()=>tr),a.export(o,"NormalAnimationBlendMode",()=>rr),a.export(o,"AdditiveAnimationBlendMode",()=>sr),a.export(o,"TrianglesDrawMode",()=>W),a.export(o,"TriangleStripDrawMode",()=>de),a.export(o,"TriangleFanDrawMode",()=>ye),a.export(o,"LinearEncoding",()=>oe),a.export(o,"sRGBEncoding",()=>Me),a.export(o,"BasicDepthPacking",()=>Fe),a.export(o,"RGBADepthPacking",()=>Ve),a.export(o,"TangentSpaceNormalMap",()=>He),a.export(o,"ObjectSpaceNormalMap",()=>ze),a.export(o,"NoColorSpace",()=>Xe),a.export(o,"SRGBColorSpace",()=>Je),a.export(o,"LinearSRGBColorSpace",()=>We),a.export(o,"DisplayP3ColorSpace",()=>tt),a.export(o,"ZeroStencilOp",()=>rt),a.export(o,"KeepStencilOp",()=>ht),a.export(o,"ReplaceStencilOp",()=>_t),a.export(o,"IncrementStencilOp",()=>st),a.export(o,"DecrementStencilOp",()=>Ye),a.export(o,"IncrementWrapStencilOp",()=>Dt),a.export(o,"DecrementWrapStencilOp",()=>nt),a.export(o,"InvertStencilOp",()=>yt),a.export(o,"NeverStencilFunc",()=>Kt),a.export(o,"LessStencilFunc",()=>Ft),a.export(o,"EqualStencilFunc",()=>nr),a.export(o,"LessEqualStencilFunc",()=>at),a.export(o,"GreaterStencilFunc",()=>At),a.export(o,"NotEqualStencilFunc",()=>ir),a.export(o,"GreaterEqualStencilFunc",()=>ut),a.export(o,"AlwaysStencilFunc",()=>ar),a.export(o,"NeverCompare",()=>cr),a.export(o,"LessCompare",()=>lr),a.export(o,"EqualCompare",()=>hr),a.export(o,"LessEqualCompare",()=>ur),a.export(o,"GreaterCompare",()=>dr),a.export(o,"NotEqualCompare",()=>fr),a.export(o,"GreaterEqualCompare",()=>pr),a.export(o,"AlwaysCompare",()=>mr),a.export(o,"StaticDrawUsage",()=>gr),a.export(o,"DynamicDrawUsage",()=>_r),a.export(o,"StreamDrawUsage",()=>vr),a.export(o,"StaticReadUsage",()=>xr),a.export(o,"DynamicReadUsage",()=>yr),a.export(o,"StreamReadUsage",()=>br),a.export(o,"StaticCopyUsage",()=>Mr),a.export(o,"DynamicCopyUsage",()=>Sr),a.export(o,"StreamCopyUsage",()=>Tr),a.export(o,"GLSL1",()=>Ar),a.export(o,"GLSL3",()=>jr),a.export(o,"_SRGBAFormat",()=>Er),a.export(o,"WebGLCoordinateSystem",()=>Cr),a.export(o,"WebGPUCoordinateSystem",()=>wr);const m="154",M={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},v={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},n=0,i=1,t=2,r=3,l=0,h=1,f=2,c=3,s=0,d=1,p=2,u=2,g=0,S=1,y=2,T=3,x=4,_=5,A=100,w=101,j=102,R=103,L=104,D=200,P=201,k=202,O=203,F=204,G=205,b=206,C=207,I=208,B=209,H=210,X=0,Y=1,Z=2,Q=3,ne=4,ge=5,me=6,_e=7,le=0,ee=1,je=2,z=0,$=1,se=2,ie=3,te=4,q=5,ce=300,xe=301,we=302,Ee=303,ae=304,be=306,Se=1e3,Ae=1001,Ce=1002,Be=1003,U=1004,E=1004,V=1005,re=1005,ue=1006,J=1007,fe=1007,Te=1008,pe=1008,Ie=1009,ke=1010,De=1011,Ge=1012,Ue=1013,K=1014,Le=1015,Re=1016,Pe=1017,ve=1018,Ne=1020,Oe=1021,Ke=1023,dt=1024,he=1025,ot=1026,Qe=1027,$e=1028,Ze=1029,lt=1030,qe=1031,et=1033,bt=33776,Mt=33777,Tt=33778,Rt=33779,St=35840,gt=35841,Pt=35842,jt=35843,Et=36196,ft=37492,ct=37496,pt=37808,Ut=37809,Bt=37810,Nt=37811,mt=37812,vt=37813,Ct=37814,Gt=37815,it=37816,kt=37817,Ot=37818,Vt=37819,Ht=37820,Qt=37821,$t=36492,It=36283,qt=36284,zt=36285,Jt=36286,xt=2200,Wt=2201,Xt=2202,er=2300,wt=2301,Yt=2302,Lt=2400,Zt=2401,tr=2402,rr=2500,sr=2501,W=0,de=1,ye=2,oe=3e3,Me=3001,Fe=3200,Ve=3201,He=0,ze=1,Xe="",Je="srgb",We="srgb-linear",tt="display-p3",rt=0,ht=7680,_t=7681,st=7682,Ye=7683,Dt=34055,nt=34056,yt=5386,Kt=512,Ft=513,nr=514,at=515,At=516,ir=517,ut=518,ar=519,cr=512,lr=513,hr=514,ur=515,dr=516,fr=517,pr=518,mr=519,gr=35044,_r=35048,vr=35040,xr=35045,yr=35049,br=35041,Mr=35046,Sr=35050,Tr=35042,Ar="100",jr="300 es",Er=1035,Cr=2e3,wr=2001},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aKnGN:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLArrayRenderTarget",()=>v);var m=e("./WebGLRenderTarget.js"),M=e("../textures/DataArrayTexture.js");class v extends m.WebGLRenderTarget{constructor(i=1,t=1,r=1){super(i,t);this.isWebGLArrayRenderTarget=!0,this.depth=r,this.texture=new M.DataArrayTexture(null,i,t,r),this.texture.isRenderTargetTexture=!0}}},{"./WebGLRenderTarget.js":"azVIG","../textures/DataArrayTexture.js":"aY9tP","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],azVIG:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLRenderTarget",()=>r);var m=e("../core/EventDispatcher.js"),M=e("../textures/Texture.js"),v=e("../constants.js"),n=e("../math/Vector4.js"),i=e("../textures/Source.js"),t=e("../utils.js");class r extends m.EventDispatcher{constructor(h=1,f=1,c={}){super();this.isWebGLRenderTarget=!0,this.width=h,this.height=f,this.depth=1,this.scissor=new n.Vector4(0,0,h,f),this.scissorTest=!1,this.viewport=new n.Vector4(0,0,h,f);const s={width:h,height:f,depth:1};c.encoding!==void 0&&((0,t.warnOnce)("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),c.colorSpace=c.encoding===v.sRGBEncoding?v.SRGBColorSpace:v.NoColorSpace),this.texture=new M.Texture(s,c.mapping,c.wrapS,c.wrapT,c.magFilter,c.minFilter,c.format,c.type,c.anisotropy,c.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=c.generateMipmaps!==void 0?c.generateMipmaps:!1,this.texture.internalFormat=c.internalFormat!==void 0?c.internalFormat:null,this.texture.minFilter=c.minFilter!==void 0?c.minFilter:v.LinearFilter,this.depthBuffer=c.depthBuffer!==void 0?c.depthBuffer:!0,this.stencilBuffer=c.stencilBuffer!==void 0?c.stencilBuffer:!1,this.depthTexture=c.depthTexture!==void 0?c.depthTexture:null,this.samples=c.samples!==void 0?c.samples:0}setSize(h,f,c=1){(this.width!==h||this.height!==f||this.depth!==c)&&(this.width=h,this.height=f,this.depth=c,this.texture.image.width=h,this.texture.image.height=f,this.texture.image.depth=c,this.dispose()),this.viewport.set(0,0,h,f),this.scissor.set(0,0,h,f)}clone(){return new this.constructor().copy(this)}copy(h){this.width=h.width,this.height=h.height,this.depth=h.depth,this.scissor.copy(h.scissor),this.scissorTest=h.scissorTest,this.viewport.copy(h.viewport),this.texture=h.texture.clone(),this.texture.isRenderTargetTexture=!0;const f=Object.assign({},h.texture.image);return this.texture.source=new i.Source(f),this.depthBuffer=h.depthBuffer,this.stencilBuffer=h.stencilBuffer,h.depthTexture!==null&&(this.depthTexture=h.depthTexture.clone()),this.samples=h.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}},{"../core/EventDispatcher.js":"d6Goy","../textures/Texture.js":"2paEl","../constants.js":"bqsVL","../math/Vector4.js":"h0tSe","../textures/Source.js":"1xLMW","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d6Goy:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"EventDispatcher",()=>m);class m{addEventListener(v,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[v]===void 0&&(i[v]=[]),i[v].indexOf(n)===-1&&i[v].push(n)}hasEventListener(v,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[v]!==void 0&&i[v].indexOf(n)!==-1}removeEventListener(v,n){if(this._listeners===void 0)return;const t=this._listeners[v];if(t!==void 0){const r=t.indexOf(n);r!==-1&&t.splice(r,1)}}dispatchEvent(v){if(this._listeners===void 0)return;const i=this._listeners[v.type];if(i!==void 0){v.target=this;const t=i.slice(0);for(let r=0,l=t.length;r<l;r++)t[r].call(this,v);v.target=null}}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2paEl":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Texture",()=>h);var m=e("../core/EventDispatcher.js"),M=e("../constants.js"),v=e("../math/MathUtils.js"),n=e("../math/Vector2.js"),i=e("../math/Matrix3.js"),t=e("./Source.js"),r=e("../utils.js");let l=0;class h extends m.EventDispatcher{constructor(c=h.DEFAULT_IMAGE,s=h.DEFAULT_MAPPING,d=M.ClampToEdgeWrapping,p=M.ClampToEdgeWrapping,u=M.LinearFilter,g=M.LinearMipmapLinearFilter,S=M.RGBAFormat,y=M.UnsignedByteType,T=h.DEFAULT_ANISOTROPY,x=M.NoColorSpace){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:l++}),this.uuid=v.generateUUID(),this.name="",this.source=new t.Source(c),this.mipmaps=[],this.mapping=s,this.channel=0,this.wrapS=d,this.wrapT=p,this.magFilter=u,this.minFilter=g,this.anisotropy=T,this.format=S,this.internalFormat=null,this.type=y,this.offset=new n.Vector2(0,0),this.repeat=new n.Vector2(1,1),this.center=new n.Vector2(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new i.Matrix3,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof x=="string"?this.colorSpace=x:((0,r.warnOnce)("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=x===M.sRGBEncoding?M.SRGBColorSpace:M.NoColorSpace),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(c=null){this.source.data=c}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(c){return this.name=c.name,this.source=c.source,this.mipmaps=c.mipmaps.slice(0),this.mapping=c.mapping,this.channel=c.channel,this.wrapS=c.wrapS,this.wrapT=c.wrapT,this.magFilter=c.magFilter,this.minFilter=c.minFilter,this.anisotropy=c.anisotropy,this.format=c.format,this.internalFormat=c.internalFormat,this.type=c.type,this.offset.copy(c.offset),this.repeat.copy(c.repeat),this.center.copy(c.center),this.rotation=c.rotation,this.matrixAutoUpdate=c.matrixAutoUpdate,this.matrix.copy(c.matrix),this.generateMipmaps=c.generateMipmaps,this.premultiplyAlpha=c.premultiplyAlpha,this.flipY=c.flipY,this.unpackAlignment=c.unpackAlignment,this.colorSpace=c.colorSpace,this.userData=JSON.parse(JSON.stringify(c.userData)),this.needsUpdate=!0,this}toJSON(c){const s=c===void 0||typeof c=="string";if(!s&&c.textures[this.uuid]!==void 0)return c.textures[this.uuid];const d={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(c).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(d.userData=this.userData),s||(c.textures[this.uuid]=d),d}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(c){if(this.mapping!==M.UVMapping)return c;if(c.applyMatrix3(this.matrix),c.x<0||c.x>1)switch(this.wrapS){case M.RepeatWrapping:c.x=c.x-Math.floor(c.x);break;case M.ClampToEdgeWrapping:c.x=c.x<0?0:1;break;case M.MirroredRepeatWrapping:Math.abs(Math.floor(c.x)%2)===1?c.x=Math.ceil(c.x)-c.x:c.x=c.x-Math.floor(c.x);break}if(c.y<0||c.y>1)switch(this.wrapT){case M.RepeatWrapping:c.y=c.y-Math.floor(c.y);break;case M.ClampToEdgeWrapping:c.y=c.y<0?0:1;break;case M.MirroredRepeatWrapping:Math.abs(Math.floor(c.y)%2)===1?c.y=Math.ceil(c.y)-c.y:c.y=c.y-Math.floor(c.y);break}return this.flipY&&(c.y=1-c.y),c}set needsUpdate(c){c===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return(0,r.warnOnce)("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===M.SRGBColorSpace?M.sRGBEncoding:M.LinearEncoding}set encoding(c){(0,r.warnOnce)("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=c===M.sRGBEncoding?M.SRGBColorSpace:M.NoColorSpace}}h.DEFAULT_IMAGE=null,h.DEFAULT_MAPPING=M.UVMapping,h.DEFAULT_ANISOTROPY=1},{"../core/EventDispatcher.js":"d6Goy","../constants.js":"bqsVL","../math/MathUtils.js":"9o1gq","../math/Vector2.js":"crXpG","../math/Matrix3.js":"85Mgp","./Source.js":"1xLMW","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9o1gq":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DEG2RAD",()=>v),a.export(o,"RAD2DEG",()=>n),a.export(o,"generateUUID",()=>i),a.export(o,"clamp",()=>t),a.export(o,"euclideanModulo",()=>r),a.export(o,"mapLinear",()=>l),a.export(o,"inverseLerp",()=>h),a.export(o,"lerp",()=>f),a.export(o,"damp",()=>c),a.export(o,"pingpong",()=>s),a.export(o,"smoothstep",()=>d),a.export(o,"smootherstep",()=>p),a.export(o,"randInt",()=>u),a.export(o,"randFloat",()=>g),a.export(o,"randFloatSpread",()=>S),a.export(o,"seededRandom",()=>y),a.export(o,"degToRad",()=>T),a.export(o,"radToDeg",()=>x),a.export(o,"isPowerOfTwo",()=>_),a.export(o,"ceilPowerOfTwo",()=>A),a.export(o,"floorPowerOfTwo",()=>w),a.export(o,"setQuaternionFromProperEuler",()=>j),a.export(o,"normalize",()=>L),a.export(o,"denormalize",()=>R),a.export(o,"MathUtils",()=>D);const m=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let M=1234567;const v=Math.PI/180,n=180/Math.PI;function i(){const P=Math.random()*4294967295|0,k=Math.random()*4294967295|0,O=Math.random()*4294967295|0,F=Math.random()*4294967295|0;return(m[P&255]+m[P>>8&255]+m[P>>16&255]+m[P>>24&255]+"-"+m[k&255]+m[k>>8&255]+"-"+m[k>>16&15|64]+m[k>>24&255]+"-"+m[O&63|128]+m[O>>8&255]+"-"+m[O>>16&255]+m[O>>24&255]+m[F&255]+m[F>>8&255]+m[F>>16&255]+m[F>>24&255]).toLowerCase()}function t(P,k,O){return Math.max(k,Math.min(O,P))}function r(P,k){return(P%k+k)%k}function l(P,k,O,F,G){return F+(P-k)*(G-F)/(O-k)}function h(P,k,O){return P!==k?(O-P)/(k-P):0}function f(P,k,O){return(1-O)*P+O*k}function c(P,k,O,F){return f(P,k,1-Math.exp(-O*F))}function s(P,k=1){return k-Math.abs(r(P,k*2)-k)}function d(P,k,O){return P<=k?0:P>=O?1:(P=(P-k)/(O-k),P*P*(3-2*P))}function p(P,k,O){return P<=k?0:P>=O?1:(P=(P-k)/(O-k),P*P*P*(P*(P*6-15)+10))}function u(P,k){return P+Math.floor(Math.random()*(k-P+1))}function g(P,k){return P+Math.random()*(k-P)}function S(P){return P*(.5-Math.random())}function y(P){P!==void 0&&(M=P);let k=M+=1831565813;return k=Math.imul(k^k>>>15,k|1),k^=k+Math.imul(k^k>>>7,k|61),((k^k>>>14)>>>0)/4294967296}function T(P){return P*v}function x(P){return P*n}function _(P){return(P&P-1)==0&&P!==0}function A(P){return Math.pow(2,Math.ceil(Math.log(P)/Math.LN2))}function w(P){return Math.pow(2,Math.floor(Math.log(P)/Math.LN2))}function j(P,k,O,F,G){const b=Math.cos,C=Math.sin,I=b(O/2),B=C(O/2),H=b((k+F)/2),X=C((k+F)/2),Y=b((k-F)/2),Z=C((k-F)/2),Q=b((F-k)/2),ne=C((F-k)/2);switch(G){case"XYX":P.set(I*X,B*Y,B*Z,I*H);break;case"YZY":P.set(B*Z,I*X,B*Y,I*H);break;case"ZXZ":P.set(B*Y,B*Z,I*X,I*H);break;case"XZX":P.set(I*X,B*ne,B*Q,I*H);break;case"YXY":P.set(B*Q,I*X,B*ne,I*H);break;case"ZYZ":P.set(B*ne,B*Q,I*X,I*H);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+G)}}function R(P,k){switch(k.constructor){case Float32Array:return P;case Uint32Array:return P/4294967295;case Uint16Array:return P/65535;case Uint8Array:return P/255;case Int32Array:return Math.max(P/2147483647,-1);case Int16Array:return Math.max(P/32767,-1);case Int8Array:return Math.max(P/127,-1);default:throw new Error("Invalid component type.")}}function L(P,k){switch(k.constructor){case Float32Array:return P;case Uint32Array:return Math.round(P*4294967295);case Uint16Array:return Math.round(P*65535);case Uint8Array:return Math.round(P*255);case Int32Array:return Math.round(P*2147483647);case Int16Array:return Math.round(P*32767);case Int8Array:return Math.round(P*127);default:throw new Error("Invalid component type.")}}const D={DEG2RAD:v,RAD2DEG:n,generateUUID:i,clamp:t,euclideanModulo:r,mapLinear:l,inverseLerp:h,lerp:f,damp:c,pingpong:s,smoothstep:d,smootherstep:p,randInt:u,randFloat:g,randFloatSpread:S,seededRandom:y,degToRad:T,radToDeg:x,isPowerOfTwo:_,ceilPowerOfTwo:A,floorPowerOfTwo:w,setQuaternionFromProperEuler:j,normalize:L,denormalize:R}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],crXpG:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Vector2",()=>M);var m=e("./MathUtils.js");class M{constructor(n=0,i=0){M.prototype.isVector2=!0,this.x=n,this.y=i}get width(){return this.x}set width(n){this.x=n}get height(){return this.y}set height(n){this.y=n}set(n,i){return this.x=n,this.y=i,this}setScalar(n){return this.x=n,this.y=n,this}setX(n){return this.x=n,this}setY(n){return this.y=n,this}setComponent(n,i){switch(n){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+n)}return this}getComponent(n){switch(n){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+n)}}clone(){return new this.constructor(this.x,this.y)}copy(n){return this.x=n.x,this.y=n.y,this}add(n){return this.x+=n.x,this.y+=n.y,this}addScalar(n){return this.x+=n,this.y+=n,this}addVectors(n,i){return this.x=n.x+i.x,this.y=n.y+i.y,this}addScaledVector(n,i){return this.x+=n.x*i,this.y+=n.y*i,this}sub(n){return this.x-=n.x,this.y-=n.y,this}subScalar(n){return this.x-=n,this.y-=n,this}subVectors(n,i){return this.x=n.x-i.x,this.y=n.y-i.y,this}multiply(n){return this.x*=n.x,this.y*=n.y,this}multiplyScalar(n){return this.x*=n,this.y*=n,this}divide(n){return this.x/=n.x,this.y/=n.y,this}divideScalar(n){return this.multiplyScalar(1/n)}applyMatrix3(n){const i=this.x,t=this.y,r=n.elements;return this.x=r[0]*i+r[3]*t+r[6],this.y=r[1]*i+r[4]*t+r[7],this}min(n){return this.x=Math.min(this.x,n.x),this.y=Math.min(this.y,n.y),this}max(n){return this.x=Math.max(this.x,n.x),this.y=Math.max(this.y,n.y),this}clamp(n,i){return this.x=Math.max(n.x,Math.min(i.x,this.x)),this.y=Math.max(n.y,Math.min(i.y,this.y)),this}clampScalar(n,i){return this.x=Math.max(n,Math.min(i,this.x)),this.y=Math.max(n,Math.min(i,this.y)),this}clampLength(n,i){const t=this.length();return this.divideScalar(t||1).multiplyScalar(Math.max(n,Math.min(i,t)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(n){return this.x*n.x+this.y*n.y}cross(n){return this.x*n.y-this.y*n.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(n){const i=Math.sqrt(this.lengthSq()*n.lengthSq());if(i===0)return Math.PI/2;const t=this.dot(n)/i;return Math.acos(m.clamp(t,-1,1))}distanceTo(n){return Math.sqrt(this.distanceToSquared(n))}distanceToSquared(n){const i=this.x-n.x,t=this.y-n.y;return i*i+t*t}manhattanDistanceTo(n){return Math.abs(this.x-n.x)+Math.abs(this.y-n.y)}setLength(n){return this.normalize().multiplyScalar(n)}lerp(n,i){return this.x+=(n.x-this.x)*i,this.y+=(n.y-this.y)*i,this}lerpVectors(n,i,t){return this.x=n.x+(i.x-n.x)*t,this.y=n.y+(i.y-n.y)*t,this}equals(n){return n.x===this.x&&n.y===this.y}fromArray(n,i=0){return this.x=n[i],this.y=n[i+1],this}toArray(n=[],i=0){return n[i]=this.x,n[i+1]=this.y,n}fromBufferAttribute(n,i){return this.x=n.getX(i),this.y=n.getY(i),this}rotateAround(n,i){const t=Math.cos(i),r=Math.sin(i),l=this.x-n.x,h=this.y-n.y;return this.x=l*t-h*r+n.x,this.y=l*r+h*t+n.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}},{"./MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"85Mgp":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Matrix3",()=>m);class m{constructor(n,i,t,r,l,h,f,c,s){m.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],n!==void 0&&this.set(n,i,t,r,l,h,f,c,s)}set(n,i,t,r,l,h,f,c,s){const d=this.elements;return d[0]=n,d[1]=r,d[2]=f,d[3]=i,d[4]=l,d[5]=c,d[6]=t,d[7]=h,d[8]=s,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(n){const i=this.elements,t=n.elements;return i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=t[3],i[4]=t[4],i[5]=t[5],i[6]=t[6],i[7]=t[7],i[8]=t[8],this}extractBasis(n,i,t){return n.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),t.setFromMatrix3Column(this,2),this}setFromMatrix4(n){const i=n.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(n){return this.multiplyMatrices(this,n)}premultiply(n){return this.multiplyMatrices(n,this)}multiplyMatrices(n,i){const t=n.elements,r=i.elements,l=this.elements,h=t[0],f=t[3],c=t[6],s=t[1],d=t[4],p=t[7],u=t[2],g=t[5],S=t[8],y=r[0],T=r[3],x=r[6],_=r[1],A=r[4],w=r[7],j=r[2],R=r[5],L=r[8];return l[0]=h*y+f*_+c*j,l[3]=h*T+f*A+c*R,l[6]=h*x+f*w+c*L,l[1]=s*y+d*_+p*j,l[4]=s*T+d*A+p*R,l[7]=s*x+d*w+p*L,l[2]=u*y+g*_+S*j,l[5]=u*T+g*A+S*R,l[8]=u*x+g*w+S*L,this}multiplyScalar(n){const i=this.elements;return i[0]*=n,i[3]*=n,i[6]*=n,i[1]*=n,i[4]*=n,i[7]*=n,i[2]*=n,i[5]*=n,i[8]*=n,this}determinant(){const n=this.elements,i=n[0],t=n[1],r=n[2],l=n[3],h=n[4],f=n[5],c=n[6],s=n[7],d=n[8];return i*h*d-i*f*s-t*l*d+t*f*c+r*l*s-r*h*c}invert(){const n=this.elements,i=n[0],t=n[1],r=n[2],l=n[3],h=n[4],f=n[5],c=n[6],s=n[7],d=n[8],p=d*h-f*s,u=f*c-d*l,g=s*l-h*c,S=i*p+t*u+r*g;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/S;return n[0]=p*y,n[1]=(r*s-d*t)*y,n[2]=(f*t-r*h)*y,n[3]=u*y,n[4]=(d*i-r*c)*y,n[5]=(r*l-f*i)*y,n[6]=g*y,n[7]=(t*c-s*i)*y,n[8]=(h*i-t*l)*y,this}transpose(){let n;const i=this.elements;return n=i[1],i[1]=i[3],i[3]=n,n=i[2],i[2]=i[6],i[6]=n,n=i[5],i[5]=i[7],i[7]=n,this}getNormalMatrix(n){return this.setFromMatrix4(n).invert().transpose()}transposeIntoArray(n){const i=this.elements;return n[0]=i[0],n[1]=i[3],n[2]=i[6],n[3]=i[1],n[4]=i[4],n[5]=i[7],n[6]=i[2],n[7]=i[5],n[8]=i[8],this}setUvTransform(n,i,t,r,l,h,f){const c=Math.cos(l),s=Math.sin(l);return this.set(t*c,t*s,-t*(c*h+s*f)+h+n,-r*s,r*c,-r*(-s*h+c*f)+f+i,0,0,1),this}scale(n,i){return this.premultiply(M.makeScale(n,i)),this}rotate(n){return this.premultiply(M.makeRotation(-n)),this}translate(n,i){return this.premultiply(M.makeTranslation(n,i)),this}makeTranslation(n,i){return n.isVector2?this.set(1,0,n.x,0,1,n.y,0,0,1):this.set(1,0,n,0,1,i,0,0,1),this}makeRotation(n){const i=Math.cos(n),t=Math.sin(n);return this.set(i,-t,0,t,i,0,0,0,1),this}makeScale(n,i){return this.set(n,0,0,0,i,0,0,0,1),this}equals(n){const i=this.elements,t=n.elements;for(let r=0;r<9;r++)if(i[r]!==t[r])return!1;return!0}fromArray(n,i=0){for(let t=0;t<9;t++)this.elements[t]=n[t+i];return this}toArray(n=[],i=0){const t=this.elements;return n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3],n[i+4]=t[4],n[i+5]=t[5],n[i+6]=t[6],n[i+7]=t[7],n[i+8]=t[8],n}clone(){return new this.constructor().fromArray(this.elements)}}const M=new m},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1xLMW":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Source",()=>n);var m=e("../extras/ImageUtils.js"),M=e("../math/MathUtils.js");let v=0;class n{constructor(r=null){this.isSource=!0,Object.defineProperty(this,"id",{value:v++}),this.uuid=M.generateUUID(),this.data=r,this.version=0}set needsUpdate(r){r===!0&&this.version++}toJSON(r){const l=r===void 0||typeof r=="string";if(!l&&r.images[this.uuid]!==void 0)return r.images[this.uuid];const h={uuid:this.uuid,url:""},f=this.data;if(f!==null){let c;if(Array.isArray(f)){c=[];for(let s=0,d=f.length;s<d;s++)f[s].isDataTexture?c.push(i(f[s].image)):c.push(i(f[s]))}else c=i(f);h.url=c}return l||(r.images[this.uuid]=h),h}}function i(t){return typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap?m.ImageUtils.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}},{"../extras/ImageUtils.js":"bdPum","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bdPum:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ImageUtils",()=>n);var m=e("../utils.js"),M=e("../math/ColorManagement.js");let v;class n{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let r;if(t instanceof HTMLCanvasElement)r=t;else{v===void 0&&(v=(0,m.createElementNS)("canvas")),v.width=t.width,v.height=t.height;const l=v.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),r=v}return r.width>2048||r.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),r.toDataURL("image/jpeg",.6)):r.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const r=(0,m.createElementNS)("canvas");r.width=t.width,r.height=t.height;const l=r.getContext("2d");l.drawImage(t,0,0,t.width,t.height);const h=l.getImageData(0,0,t.width,t.height),f=h.data;for(let c=0;c<f.length;c++)f[c]=(0,M.SRGBToLinear)(f[c]/255)*255;return l.putImageData(h,0,0),r}else if(t.data){const r=t.data.slice(0);for(let l=0;l<r.length;l++)r instanceof Uint8Array||r instanceof Uint8ClampedArray?r[l]=Math.floor((0,M.SRGBToLinear)(r[l]/255)*255):r[l]=(0,M.SRGBToLinear)(r[l]);return{data:r,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}},{"../utils.js":"d61Et","../math/ColorManagement.js":"4c2nU","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d61Et:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"arrayMin",()=>m),a.export(o,"arrayMax",()=>M),a.export(o,"arrayNeedsUint32",()=>v),a.export(o,"getTypedArray",()=>i),a.export(o,"createElementNS",()=>t),a.export(o,"warnOnce",()=>l);function m(h){if(h.length===0)return 1/0;let f=h[0];for(let c=1,s=h.length;c<s;++c)h[c]<f&&(f=h[c]);return f}function M(h){if(h.length===0)return-1/0;let f=h[0];for(let c=1,s=h.length;c<s;++c)h[c]>f&&(f=h[c]);return f}function v(h){for(let f=h.length-1;f>=0;--f)if(h[f]>=65535)return!0;return!1}const n={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function i(h,f){return new n[h](f)}function t(h){return document.createElementNS("http://www.w3.org/1999/xhtml",h)}const r={};function l(h){h in r||(r[h]=!0,console.warn(h))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4c2nU":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SRGBToLinear",()=>v),a.export(o,"LinearToSRGB",()=>n),a.export(o,"ColorManagement",()=>c);var m=e("../constants.js"),M=e("./Matrix3.js");function v(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function n(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const i=new M.Matrix3().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),t=new M.Matrix3().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function r(s){return s.convertSRGBToLinear().applyMatrix3(t)}function l(s){return s.applyMatrix3(i).convertLinearToSRGB()}const h={[m.LinearSRGBColorSpace]:s=>s,[m.SRGBColorSpace]:s=>s.convertSRGBToLinear(),[m.DisplayP3ColorSpace]:r},f={[m.LinearSRGBColorSpace]:s=>s,[m.SRGBColorSpace]:s=>s.convertLinearToSRGB(),[m.DisplayP3ColorSpace]:l},c={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(s){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!s},get workingColorSpace(){return m.LinearSRGBColorSpace},set workingColorSpace(s){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(s,d,p){if(this.enabled===!1||d===p||!d||!p)return s;const u=h[d],g=f[p];if(u===void 0||g===void 0)throw new Error(`Unsupported color space conversion, "${d}" to "${p}".`);return g(u(s))},fromWorkingColorSpace:function(s,d){return this.convert(s,this.workingColorSpace,d)},toWorkingColorSpace:function(s,d){return this.convert(s,d,this.workingColorSpace)}}},{"../constants.js":"bqsVL","./Matrix3.js":"85Mgp","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],h0tSe:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Vector4",()=>m);class m{constructor(v=0,n=0,i=0,t=1){m.prototype.isVector4=!0,this.x=v,this.y=n,this.z=i,this.w=t}get width(){return this.z}set width(v){this.z=v}get height(){return this.w}set height(v){this.w=v}set(v,n,i,t){return this.x=v,this.y=n,this.z=i,this.w=t,this}setScalar(v){return this.x=v,this.y=v,this.z=v,this.w=v,this}setX(v){return this.x=v,this}setY(v){return this.y=v,this}setZ(v){return this.z=v,this}setW(v){return this.w=v,this}setComponent(v,n){switch(v){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+v)}return this}getComponent(v){switch(v){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+v)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(v){return this.x=v.x,this.y=v.y,this.z=v.z,this.w=v.w!==void 0?v.w:1,this}add(v){return this.x+=v.x,this.y+=v.y,this.z+=v.z,this.w+=v.w,this}addScalar(v){return this.x+=v,this.y+=v,this.z+=v,this.w+=v,this}addVectors(v,n){return this.x=v.x+n.x,this.y=v.y+n.y,this.z=v.z+n.z,this.w=v.w+n.w,this}addScaledVector(v,n){return this.x+=v.x*n,this.y+=v.y*n,this.z+=v.z*n,this.w+=v.w*n,this}sub(v){return this.x-=v.x,this.y-=v.y,this.z-=v.z,this.w-=v.w,this}subScalar(v){return this.x-=v,this.y-=v,this.z-=v,this.w-=v,this}subVectors(v,n){return this.x=v.x-n.x,this.y=v.y-n.y,this.z=v.z-n.z,this.w=v.w-n.w,this}multiply(v){return this.x*=v.x,this.y*=v.y,this.z*=v.z,this.w*=v.w,this}multiplyScalar(v){return this.x*=v,this.y*=v,this.z*=v,this.w*=v,this}applyMatrix4(v){const n=this.x,i=this.y,t=this.z,r=this.w,l=v.elements;return this.x=l[0]*n+l[4]*i+l[8]*t+l[12]*r,this.y=l[1]*n+l[5]*i+l[9]*t+l[13]*r,this.z=l[2]*n+l[6]*i+l[10]*t+l[14]*r,this.w=l[3]*n+l[7]*i+l[11]*t+l[15]*r,this}divideScalar(v){return this.multiplyScalar(1/v)}setAxisAngleFromQuaternion(v){this.w=2*Math.acos(v.w);const n=Math.sqrt(1-v.w*v.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=v.x/n,this.y=v.y/n,this.z=v.z/n),this}setAxisAngleFromRotationMatrix(v){let n,i,t,r;const l=.01,h=.1,f=v.elements,c=f[0],s=f[4],d=f[8],p=f[1],u=f[5],g=f[9],S=f[2],y=f[6],T=f[10];if(Math.abs(s-p)<l&&Math.abs(d-S)<l&&Math.abs(g-y)<l){if(Math.abs(s+p)<h&&Math.abs(d+S)<h&&Math.abs(g+y)<h&&Math.abs(c+u+T-3)<h)return this.set(1,0,0,0),this;n=Math.PI;const _=(c+1)/2,A=(u+1)/2,w=(T+1)/2,j=(s+p)/4,R=(d+S)/4,L=(g+y)/4;return _>A&&_>w?_<l?(i=0,t=.707106781,r=.707106781):(i=Math.sqrt(_),t=j/i,r=R/i):A>w?A<l?(i=.707106781,t=0,r=.707106781):(t=Math.sqrt(A),i=j/t,r=L/t):w<l?(i=.707106781,t=.707106781,r=0):(r=Math.sqrt(w),i=R/r,t=L/r),this.set(i,t,r,n),this}let x=Math.sqrt((y-g)*(y-g)+(d-S)*(d-S)+(p-s)*(p-s));return Math.abs(x)<.001&&(x=1),this.x=(y-g)/x,this.y=(d-S)/x,this.z=(p-s)/x,this.w=Math.acos((c+u+T-1)/2),this}min(v){return this.x=Math.min(this.x,v.x),this.y=Math.min(this.y,v.y),this.z=Math.min(this.z,v.z),this.w=Math.min(this.w,v.w),this}max(v){return this.x=Math.max(this.x,v.x),this.y=Math.max(this.y,v.y),this.z=Math.max(this.z,v.z),this.w=Math.max(this.w,v.w),this}clamp(v,n){return this.x=Math.max(v.x,Math.min(n.x,this.x)),this.y=Math.max(v.y,Math.min(n.y,this.y)),this.z=Math.max(v.z,Math.min(n.z,this.z)),this.w=Math.max(v.w,Math.min(n.w,this.w)),this}clampScalar(v,n){return this.x=Math.max(v,Math.min(n,this.x)),this.y=Math.max(v,Math.min(n,this.y)),this.z=Math.max(v,Math.min(n,this.z)),this.w=Math.max(v,Math.min(n,this.w)),this}clampLength(v,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(v,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(v){return this.x*v.x+this.y*v.y+this.z*v.z+this.w*v.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(v){return this.normalize().multiplyScalar(v)}lerp(v,n){return this.x+=(v.x-this.x)*n,this.y+=(v.y-this.y)*n,this.z+=(v.z-this.z)*n,this.w+=(v.w-this.w)*n,this}lerpVectors(v,n,i){return this.x=v.x+(n.x-v.x)*i,this.y=v.y+(n.y-v.y)*i,this.z=v.z+(n.z-v.z)*i,this.w=v.w+(n.w-v.w)*i,this}equals(v){return v.x===this.x&&v.y===this.y&&v.z===this.z&&v.w===this.w}fromArray(v,n=0){return this.x=v[n],this.y=v[n+1],this.z=v[n+2],this.w=v[n+3],this}toArray(v=[],n=0){return v[n]=this.x,v[n+1]=this.y,v[n+2]=this.z,v[n+3]=this.w,v}fromBufferAttribute(v,n){return this.x=v.getX(n),this.y=v.getY(n),this.z=v.getZ(n),this.w=v.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aY9tP:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DataArrayTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i=null,t=1,r=1,l=1){super(null);this.isDataArrayTexture=!0,this.image={data:i,width:t,height:r,depth:l},this.magFilter=M.NearestFilter,this.minFilter=M.NearestFilter,this.wrapR=M.ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2QwrA":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGL3DRenderTarget",()=>v);var m=e("./WebGLRenderTarget.js"),M=e("../textures/Data3DTexture.js");class v extends m.WebGLRenderTarget{constructor(i=1,t=1,r=1){super(i,t);this.isWebGL3DRenderTarget=!0,this.depth=r,this.texture=new M.Data3DTexture(null,i,t,r),this.texture.isRenderTargetTexture=!0}}},{"./WebGLRenderTarget.js":"azVIG","../textures/Data3DTexture.js":"2fyDm","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2fyDm":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Data3DTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i=null,t=1,r=1,l=1){super(null);this.isData3DTexture=!0,this.image={data:i,width:t,height:r,depth:l},this.magFilter=M.NearestFilter,this.minFilter=M.NearestFilter,this.wrapR=M.ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hIsm5:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLMultipleRenderTargets",()=>M);var m=e("./WebGLRenderTarget.js");class M extends m.WebGLRenderTarget{constructor(n=1,i=1,t=1,r={}){super(n,i,r);this.isWebGLMultipleRenderTargets=!0;const l=this.texture;this.texture=[];for(let h=0;h<t;h++)this.texture[h]=l.clone(),this.texture[h].isRenderTargetTexture=!0}setSize(n,i,t=1){if(this.width!==n||this.height!==i||this.depth!==t){this.width=n,this.height=i,this.depth=t;for(let r=0,l=this.texture.length;r<l;r++)this.texture[r].image.width=n,this.texture[r].image.height=i,this.texture[r].image.depth=t;this.dispose()}return this.viewport.set(0,0,n,i),this.scissor.set(0,0,n,i),this}copy(n){this.dispose(),this.width=n.width,this.height=n.height,this.depth=n.depth,this.scissor.copy(n.scissor),this.scissorTest=n.scissorTest,this.viewport.copy(n.viewport),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,n.depthTexture!==null&&(this.depthTexture=n.depthTexture.clone()),this.texture.length=0;for(let i=0,t=n.texture.length;i<t;i++)this.texture[i]=n.texture[i].clone(),this.texture[i].isRenderTargetTexture=!0;return this}}},{"./WebGLRenderTarget.js":"azVIG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8nOAb":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLCubeRenderTarget",()=>f);var m=e("../constants.js"),M=e("../objects/Mesh.js"),v=e("../geometries/BoxGeometry.js"),n=e("../materials/ShaderMaterial.js"),i=e("./shaders/UniformsUtils.js"),t=e("./WebGLRenderTarget.js"),r=e("../cameras/CubeCamera.js"),l=e("../textures/CubeTexture.js"),h=e("../utils.js");class f extends t.WebGLRenderTarget{constructor(s=1,d={}){super(s,s,d);this.isWebGLCubeRenderTarget=!0;const p={width:s,height:s,depth:1},u=[p,p,p,p,p,p];d.encoding!==void 0&&((0,h.warnOnce)("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),d.colorSpace=d.encoding===m.sRGBEncoding?m.SRGBColorSpace:m.NoColorSpace),this.texture=new l.CubeTexture(u,d.mapping,d.wrapS,d.wrapT,d.magFilter,d.minFilter,d.format,d.type,d.anisotropy,d.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=d.generateMipmaps!==void 0?d.generateMipmaps:!1,this.texture.minFilter=d.minFilter!==void 0?d.minFilter:m.LinearFilter}fromEquirectangularTexture(s,d){this.texture.type=d.type,this.texture.colorSpace=d.colorSpace,this.texture.generateMipmaps=d.generateMipmaps,this.texture.minFilter=d.minFilter,this.texture.magFilter=d.magFilter;const p={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},u=new v.BoxGeometry(5,5,5),g=new n.ShaderMaterial({name:"CubemapFromEquirect",uniforms:(0,i.cloneUniforms)(p.uniforms),vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,side:m.BackSide,blending:m.NoBlending});g.uniforms.tEquirect.value=d;const S=new M.Mesh(u,g),y=d.minFilter;return d.minFilter===m.LinearMipmapLinearFilter&&(d.minFilter=m.LinearFilter),new r.CubeCamera(1,10,this).update(s,S),d.minFilter=y,S.geometry.dispose(),S.material.dispose(),this}clear(s,d,p,u){const g=s.getRenderTarget();for(let S=0;S<6;S++)s.setRenderTarget(this,S),s.clear(d,p,u);s.setRenderTarget(g)}}},{"../constants.js":"bqsVL","../objects/Mesh.js":"d9YFT","../geometries/BoxGeometry.js":"5eHyr","../materials/ShaderMaterial.js":"bnM8h","./shaders/UniformsUtils.js":"4tBjA","./WebGLRenderTarget.js":"azVIG","../cameras/CubeCamera.js":"bLWI2","../textures/CubeTexture.js":"jcedY","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d9YFT:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Mesh",()=>P);var m=e("../math/Vector3.js"),M=e("../math/Vector2.js"),v=e("../math/Sphere.js"),n=e("../math/Ray.js"),i=e("../math/Matrix4.js"),t=e("../core/Object3D.js"),r=e("../math/Triangle.js"),l=e("../constants.js"),h=e("../materials/MeshBasicMaterial.js"),f=e("../core/BufferGeometry.js");const c=new i.Matrix4,s=new n.Ray,d=new v.Sphere,p=new m.Vector3,u=new m.Vector3,g=new m.Vector3,S=new m.Vector3,y=new m.Vector3,T=new m.Vector3,x=new M.Vector2,_=new M.Vector2,A=new M.Vector2,w=new m.Vector3,j=new m.Vector3,R=new m.Vector3,L=new m.Vector3,D=new m.Vector3;class P extends t.Object3D{constructor(G=new f.BufferGeometry,b=new h.MeshBasicMaterial){super();this.isMesh=!0,this.type="Mesh",this.geometry=G,this.material=b,this.updateMorphTargets()}copy(G,b){return super.copy(G,b),G.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=G.morphTargetInfluences.slice()),G.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},G.morphTargetDictionary)),this.material=G.material,this.geometry=G.geometry,this}updateMorphTargets(){const b=this.geometry.morphAttributes,C=Object.keys(b);if(C.length>0){const I=b[C[0]];if(I!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let B=0,H=I.length;B<H;B++){const X=I[B].name||String(B);this.morphTargetInfluences.push(0),this.morphTargetDictionary[X]=B}}}}getVertexPosition(G,b){const C=this.geometry,I=C.attributes.position,B=C.morphAttributes.position,H=C.morphTargetsRelative;b.fromBufferAttribute(I,G);const X=this.morphTargetInfluences;if(B&&X){T.set(0,0,0);for(let Y=0,Z=B.length;Y<Z;Y++){const Q=X[Y],ne=B[Y];Q!==0&&(y.fromBufferAttribute(ne,G),H?T.addScaledVector(y,Q):T.addScaledVector(y.sub(b),Q))}b.add(T)}return b}raycast(G,b){const C=this.geometry,I=this.material,B=this.matrixWorld;I!==void 0&&(C.boundingSphere===null&&C.computeBoundingSphere(),d.copy(C.boundingSphere),d.applyMatrix4(B),s.copy(G.ray).recast(G.near),!(d.containsPoint(s.origin)===!1&&(s.intersectSphere(d,p)===null||s.origin.distanceToSquared(p)>(G.far-G.near)**2))&&(c.copy(B).invert(),s.copy(G.ray).applyMatrix4(c),!(C.boundingBox!==null&&s.intersectsBox(C.boundingBox)===!1)&&this._computeIntersections(G,b,s)))}_computeIntersections(G,b,C){let I;const B=this.geometry,H=this.material,X=B.index,Y=B.attributes.position,Z=B.attributes.uv,Q=B.attributes.uv1,ne=B.attributes.normal,ge=B.groups,me=B.drawRange;if(X!==null)if(Array.isArray(H))for(let _e=0,le=ge.length;_e<le;_e++){const ee=ge[_e],je=H[ee.materialIndex],z=Math.max(ee.start,me.start),$=Math.min(X.count,Math.min(ee.start+ee.count,me.start+me.count));for(let se=z,ie=$;se<ie;se+=3){const te=X.getX(se),q=X.getX(se+1),ce=X.getX(se+2);I=O(this,je,G,C,Z,Q,ne,te,q,ce),I&&(I.faceIndex=Math.floor(se/3),I.face.materialIndex=ee.materialIndex,b.push(I))}}else{const _e=Math.max(0,me.start),le=Math.min(X.count,me.start+me.count);for(let ee=_e,je=le;ee<je;ee+=3){const z=X.getX(ee),$=X.getX(ee+1),se=X.getX(ee+2);I=O(this,H,G,C,Z,Q,ne,z,$,se),I&&(I.faceIndex=Math.floor(ee/3),b.push(I))}}else if(Y!==void 0)if(Array.isArray(H))for(let _e=0,le=ge.length;_e<le;_e++){const ee=ge[_e],je=H[ee.materialIndex],z=Math.max(ee.start,me.start),$=Math.min(Y.count,Math.min(ee.start+ee.count,me.start+me.count));for(let se=z,ie=$;se<ie;se+=3){const te=se,q=se+1,ce=se+2;I=O(this,je,G,C,Z,Q,ne,te,q,ce),I&&(I.faceIndex=Math.floor(se/3),I.face.materialIndex=ee.materialIndex,b.push(I))}}else{const _e=Math.max(0,me.start),le=Math.min(Y.count,me.start+me.count);for(let ee=_e,je=le;ee<je;ee+=3){const z=ee,$=ee+1,se=ee+2;I=O(this,H,G,C,Z,Q,ne,z,$,se),I&&(I.faceIndex=Math.floor(ee/3),b.push(I))}}}}function k(F,G,b,C,I,B,H,X){let Y;if(G.side===l.BackSide?Y=C.intersectTriangle(H,B,I,!0,X):Y=C.intersectTriangle(I,B,H,G.side===l.FrontSide,X),Y===null)return null;D.copy(X),D.applyMatrix4(F.matrixWorld);const Z=b.ray.origin.distanceTo(D);return Z<b.near||Z>b.far?null:{distance:Z,point:D.clone(),object:F}}function O(F,G,b,C,I,B,H,X,Y,Z){F.getVertexPosition(X,u),F.getVertexPosition(Y,g),F.getVertexPosition(Z,S);const Q=k(F,G,b,C,u,g,S,L);if(Q){I&&(x.fromBufferAttribute(I,X),_.fromBufferAttribute(I,Y),A.fromBufferAttribute(I,Z),Q.uv=r.Triangle.getInterpolation(L,u,g,S,x,_,A,new M.Vector2)),B&&(x.fromBufferAttribute(B,X),_.fromBufferAttribute(B,Y),A.fromBufferAttribute(B,Z),Q.uv1=r.Triangle.getInterpolation(L,u,g,S,x,_,A,new M.Vector2),Q.uv2=Q.uv1),H&&(w.fromBufferAttribute(H,X),j.fromBufferAttribute(H,Y),R.fromBufferAttribute(H,Z),Q.normal=r.Triangle.getInterpolation(L,u,g,S,w,j,R,new m.Vector3),Q.normal.dot(C.direction)>0&&Q.normal.multiplyScalar(-1));const ne={a:X,b:Y,c:Z,normal:new m.Vector3,materialIndex:0};r.Triangle.getNormal(u,g,S,ne.normal),Q.face=ne}return Q}},{"../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","../math/Sphere.js":"jgQJ1","../math/Ray.js":"8evV6","../math/Matrix4.js":"64n8p","../core/Object3D.js":"ibguD","../math/Triangle.js":"bT9h1","../constants.js":"bqsVL","../materials/MeshBasicMaterial.js":"gXfgB","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fUbuJ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Vector3",()=>v);var m=e("./MathUtils.js"),M=e("./Quaternion.js");class v{constructor(r=0,l=0,h=0){v.prototype.isVector3=!0,this.x=r,this.y=l,this.z=h}set(r,l,h){return h===void 0&&(h=this.z),this.x=r,this.y=l,this.z=h,this}setScalar(r){return this.x=r,this.y=r,this.z=r,this}setX(r){return this.x=r,this}setY(r){return this.y=r,this}setZ(r){return this.z=r,this}setComponent(r,l){switch(r){case 0:this.x=l;break;case 1:this.y=l;break;case 2:this.z=l;break;default:throw new Error("index is out of range: "+r)}return this}getComponent(r){switch(r){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+r)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(r){return this.x=r.x,this.y=r.y,this.z=r.z,this}add(r){return this.x+=r.x,this.y+=r.y,this.z+=r.z,this}addScalar(r){return this.x+=r,this.y+=r,this.z+=r,this}addVectors(r,l){return this.x=r.x+l.x,this.y=r.y+l.y,this.z=r.z+l.z,this}addScaledVector(r,l){return this.x+=r.x*l,this.y+=r.y*l,this.z+=r.z*l,this}sub(r){return this.x-=r.x,this.y-=r.y,this.z-=r.z,this}subScalar(r){return this.x-=r,this.y-=r,this.z-=r,this}subVectors(r,l){return this.x=r.x-l.x,this.y=r.y-l.y,this.z=r.z-l.z,this}multiply(r){return this.x*=r.x,this.y*=r.y,this.z*=r.z,this}multiplyScalar(r){return this.x*=r,this.y*=r,this.z*=r,this}multiplyVectors(r,l){return this.x=r.x*l.x,this.y=r.y*l.y,this.z=r.z*l.z,this}applyEuler(r){return this.applyQuaternion(i.setFromEuler(r))}applyAxisAngle(r,l){return this.applyQuaternion(i.setFromAxisAngle(r,l))}applyMatrix3(r){const l=this.x,h=this.y,f=this.z,c=r.elements;return this.x=c[0]*l+c[3]*h+c[6]*f,this.y=c[1]*l+c[4]*h+c[7]*f,this.z=c[2]*l+c[5]*h+c[8]*f,this}applyNormalMatrix(r){return this.applyMatrix3(r).normalize()}applyMatrix4(r){const l=this.x,h=this.y,f=this.z,c=r.elements,s=1/(c[3]*l+c[7]*h+c[11]*f+c[15]);return this.x=(c[0]*l+c[4]*h+c[8]*f+c[12])*s,this.y=(c[1]*l+c[5]*h+c[9]*f+c[13])*s,this.z=(c[2]*l+c[6]*h+c[10]*f+c[14])*s,this}applyQuaternion(r){const l=this.x,h=this.y,f=this.z,c=r.x,s=r.y,d=r.z,p=r.w,u=p*l+s*f-d*h,g=p*h+d*l-c*f,S=p*f+c*h-s*l,y=-c*l-s*h-d*f;return this.x=u*p+y*-c+g*-d-S*-s,this.y=g*p+y*-s+S*-c-u*-d,this.z=S*p+y*-d+u*-s-g*-c,this}project(r){return this.applyMatrix4(r.matrixWorldInverse).applyMatrix4(r.projectionMatrix)}unproject(r){return this.applyMatrix4(r.projectionMatrixInverse).applyMatrix4(r.matrixWorld)}transformDirection(r){const l=this.x,h=this.y,f=this.z,c=r.elements;return this.x=c[0]*l+c[4]*h+c[8]*f,this.y=c[1]*l+c[5]*h+c[9]*f,this.z=c[2]*l+c[6]*h+c[10]*f,this.normalize()}divide(r){return this.x/=r.x,this.y/=r.y,this.z/=r.z,this}divideScalar(r){return this.multiplyScalar(1/r)}min(r){return this.x=Math.min(this.x,r.x),this.y=Math.min(this.y,r.y),this.z=Math.min(this.z,r.z),this}max(r){return this.x=Math.max(this.x,r.x),this.y=Math.max(this.y,r.y),this.z=Math.max(this.z,r.z),this}clamp(r,l){return this.x=Math.max(r.x,Math.min(l.x,this.x)),this.y=Math.max(r.y,Math.min(l.y,this.y)),this.z=Math.max(r.z,Math.min(l.z,this.z)),this}clampScalar(r,l){return this.x=Math.max(r,Math.min(l,this.x)),this.y=Math.max(r,Math.min(l,this.y)),this.z=Math.max(r,Math.min(l,this.z)),this}clampLength(r,l){const h=this.length();return this.divideScalar(h||1).multiplyScalar(Math.max(r,Math.min(l,h)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(r){return this.normalize().multiplyScalar(r)}lerp(r,l){return this.x+=(r.x-this.x)*l,this.y+=(r.y-this.y)*l,this.z+=(r.z-this.z)*l,this}lerpVectors(r,l,h){return this.x=r.x+(l.x-r.x)*h,this.y=r.y+(l.y-r.y)*h,this.z=r.z+(l.z-r.z)*h,this}cross(r){return this.crossVectors(this,r)}crossVectors(r,l){const h=r.x,f=r.y,c=r.z,s=l.x,d=l.y,p=l.z;return this.x=f*p-c*d,this.y=c*s-h*p,this.z=h*d-f*s,this}projectOnVector(r){const l=r.lengthSq();if(l===0)return this.set(0,0,0);const h=r.dot(this)/l;return this.copy(r).multiplyScalar(h)}projectOnPlane(r){return n.copy(this).projectOnVector(r),this.sub(n)}reflect(r){return this.sub(n.copy(r).multiplyScalar(2*this.dot(r)))}angleTo(r){const l=Math.sqrt(this.lengthSq()*r.lengthSq());if(l===0)return Math.PI/2;const h=this.dot(r)/l;return Math.acos(m.clamp(h,-1,1))}distanceTo(r){return Math.sqrt(this.distanceToSquared(r))}distanceToSquared(r){const l=this.x-r.x,h=this.y-r.y,f=this.z-r.z;return l*l+h*h+f*f}manhattanDistanceTo(r){return Math.abs(this.x-r.x)+Math.abs(this.y-r.y)+Math.abs(this.z-r.z)}setFromSpherical(r){return this.setFromSphericalCoords(r.radius,r.phi,r.theta)}setFromSphericalCoords(r,l,h){const f=Math.sin(l)*r;return this.x=f*Math.sin(h),this.y=Math.cos(l)*r,this.z=f*Math.cos(h),this}setFromCylindrical(r){return this.setFromCylindricalCoords(r.radius,r.theta,r.y)}setFromCylindricalCoords(r,l,h){return this.x=r*Math.sin(l),this.y=h,this.z=r*Math.cos(l),this}setFromMatrixPosition(r){const l=r.elements;return this.x=l[12],this.y=l[13],this.z=l[14],this}setFromMatrixScale(r){const l=this.setFromMatrixColumn(r,0).length(),h=this.setFromMatrixColumn(r,1).length(),f=this.setFromMatrixColumn(r,2).length();return this.x=l,this.y=h,this.z=f,this}setFromMatrixColumn(r,l){return this.fromArray(r.elements,l*4)}setFromMatrix3Column(r,l){return this.fromArray(r.elements,l*3)}setFromEuler(r){return this.x=r._x,this.y=r._y,this.z=r._z,this}setFromColor(r){return this.x=r.r,this.y=r.g,this.z=r.b,this}equals(r){return r.x===this.x&&r.y===this.y&&r.z===this.z}fromArray(r,l=0){return this.x=r[l],this.y=r[l+1],this.z=r[l+2],this}toArray(r=[],l=0){return r[l]=this.x,r[l+1]=this.y,r[l+2]=this.z,r}fromBufferAttribute(r,l){return this.x=r.getX(l),this.y=r.getY(l),this.z=r.getZ(l),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const r=(Math.random()-.5)*2,l=Math.random()*Math.PI*2,h=Math.sqrt(1-r**2);return this.x=h*Math.cos(l),this.y=h*Math.sin(l),this.z=r,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const n=new v,i=new M.Quaternion},{"./MathUtils.js":"9o1gq","./Quaternion.js":"iTBTv","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iTBTv:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Quaternion",()=>M);var m=e("./MathUtils.js");class M{constructor(n=0,i=0,t=0,r=1){this.isQuaternion=!0,this._x=n,this._y=i,this._z=t,this._w=r}static slerpFlat(n,i,t,r,l,h,f){let c=t[r+0],s=t[r+1],d=t[r+2],p=t[r+3];const u=l[h+0],g=l[h+1],S=l[h+2],y=l[h+3];if(f===0){n[i+0]=c,n[i+1]=s,n[i+2]=d,n[i+3]=p;return}if(f===1){n[i+0]=u,n[i+1]=g,n[i+2]=S,n[i+3]=y;return}if(p!==y||c!==u||s!==g||d!==S){let T=1-f;const x=c*u+s*g+d*S+p*y,_=x>=0?1:-1,A=1-x*x;if(A>Number.EPSILON){const j=Math.sqrt(A),R=Math.atan2(j,x*_);T=Math.sin(T*R)/j,f=Math.sin(f*R)/j}const w=f*_;if(c=c*T+u*w,s=s*T+g*w,d=d*T+S*w,p=p*T+y*w,T===1-f){const j=1/Math.sqrt(c*c+s*s+d*d+p*p);c*=j,s*=j,d*=j,p*=j}}n[i]=c,n[i+1]=s,n[i+2]=d,n[i+3]=p}static multiplyQuaternionsFlat(n,i,t,r,l,h){const f=t[r],c=t[r+1],s=t[r+2],d=t[r+3],p=l[h],u=l[h+1],g=l[h+2],S=l[h+3];return n[i]=f*S+d*p+c*g-s*u,n[i+1]=c*S+d*u+s*p-f*g,n[i+2]=s*S+d*g+f*u-c*p,n[i+3]=d*S-f*p-c*u-s*g,n}get x(){return this._x}set x(n){this._x=n,this._onChangeCallback()}get y(){return this._y}set y(n){this._y=n,this._onChangeCallback()}get z(){return this._z}set z(n){this._z=n,this._onChangeCallback()}get w(){return this._w}set w(n){this._w=n,this._onChangeCallback()}set(n,i,t,r){return this._x=n,this._y=i,this._z=t,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(n){return this._x=n.x,this._y=n.y,this._z=n.z,this._w=n.w,this._onChangeCallback(),this}setFromEuler(n,i){const t=n._x,r=n._y,l=n._z,h=n._order,f=Math.cos,c=Math.sin,s=f(t/2),d=f(r/2),p=f(l/2),u=c(t/2),g=c(r/2),S=c(l/2);switch(h){case"XYZ":this._x=u*d*p+s*g*S,this._y=s*g*p-u*d*S,this._z=s*d*S+u*g*p,this._w=s*d*p-u*g*S;break;case"YXZ":this._x=u*d*p+s*g*S,this._y=s*g*p-u*d*S,this._z=s*d*S-u*g*p,this._w=s*d*p+u*g*S;break;case"ZXY":this._x=u*d*p-s*g*S,this._y=s*g*p+u*d*S,this._z=s*d*S+u*g*p,this._w=s*d*p-u*g*S;break;case"ZYX":this._x=u*d*p-s*g*S,this._y=s*g*p+u*d*S,this._z=s*d*S-u*g*p,this._w=s*d*p+u*g*S;break;case"YZX":this._x=u*d*p+s*g*S,this._y=s*g*p+u*d*S,this._z=s*d*S-u*g*p,this._w=s*d*p-u*g*S;break;case"XZY":this._x=u*d*p-s*g*S,this._y=s*g*p-u*d*S,this._z=s*d*S+u*g*p,this._w=s*d*p+u*g*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i!==!1&&this._onChangeCallback(),this}setFromAxisAngle(n,i){const t=i/2,r=Math.sin(t);return this._x=n.x*r,this._y=n.y*r,this._z=n.z*r,this._w=Math.cos(t),this._onChangeCallback(),this}setFromRotationMatrix(n){const i=n.elements,t=i[0],r=i[4],l=i[8],h=i[1],f=i[5],c=i[9],s=i[2],d=i[6],p=i[10],u=t+f+p;if(u>0){const g=.5/Math.sqrt(u+1);this._w=.25/g,this._x=(d-c)*g,this._y=(l-s)*g,this._z=(h-r)*g}else if(t>f&&t>p){const g=2*Math.sqrt(1+t-f-p);this._w=(d-c)/g,this._x=.25*g,this._y=(r+h)/g,this._z=(l+s)/g}else if(f>p){const g=2*Math.sqrt(1+f-t-p);this._w=(l-s)/g,this._x=(r+h)/g,this._y=.25*g,this._z=(c+d)/g}else{const g=2*Math.sqrt(1+p-t-f);this._w=(h-r)/g,this._x=(l+s)/g,this._y=(c+d)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(n,i){let t=n.dot(i)+1;return t<Number.EPSILON?(t=0,Math.abs(n.x)>Math.abs(n.z)?(this._x=-n.y,this._y=n.x,this._z=0,this._w=t):(this._x=0,this._y=-n.z,this._z=n.y,this._w=t)):(this._x=n.y*i.z-n.z*i.y,this._y=n.z*i.x-n.x*i.z,this._z=n.x*i.y-n.y*i.x,this._w=t),this.normalize()}angleTo(n){return 2*Math.acos(Math.abs(m.clamp(this.dot(n),-1,1)))}rotateTowards(n,i){const t=this.angleTo(n);if(t===0)return this;const r=Math.min(1,i/t);return this.slerp(n,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(n){return this._x*n._x+this._y*n._y+this._z*n._z+this._w*n._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let n=this.length();return n===0?(this._x=0,this._y=0,this._z=0,this._w=1):(n=1/n,this._x=this._x*n,this._y=this._y*n,this._z=this._z*n,this._w=this._w*n),this._onChangeCallback(),this}multiply(n){return this.multiplyQuaternions(this,n)}premultiply(n){return this.multiplyQuaternions(n,this)}multiplyQuaternions(n,i){const t=n._x,r=n._y,l=n._z,h=n._w,f=i._x,c=i._y,s=i._z,d=i._w;return this._x=t*d+h*f+r*s-l*c,this._y=r*d+h*c+l*f-t*s,this._z=l*d+h*s+t*c-r*f,this._w=h*d-t*f-r*c-l*s,this._onChangeCallback(),this}slerp(n,i){if(i===0)return this;if(i===1)return this.copy(n);const t=this._x,r=this._y,l=this._z,h=this._w;let f=h*n._w+t*n._x+r*n._y+l*n._z;if(f<0?(this._w=-n._w,this._x=-n._x,this._y=-n._y,this._z=-n._z,f=-f):this.copy(n),f>=1)return this._w=h,this._x=t,this._y=r,this._z=l,this;const c=1-f*f;if(c<=Number.EPSILON){const g=1-i;return this._w=g*h+i*this._w,this._x=g*t+i*this._x,this._y=g*r+i*this._y,this._z=g*l+i*this._z,this.normalize(),this._onChangeCallback(),this}const s=Math.sqrt(c),d=Math.atan2(s,f),p=Math.sin((1-i)*d)/s,u=Math.sin(i*d)/s;return this._w=h*p+this._w*u,this._x=t*p+this._x*u,this._y=r*p+this._y*u,this._z=l*p+this._z*u,this._onChangeCallback(),this}slerpQuaternions(n,i,t){return this.copy(n).slerp(i,t)}random(){const n=Math.random(),i=Math.sqrt(1-n),t=Math.sqrt(n),r=2*Math.PI*Math.random(),l=2*Math.PI*Math.random();return this.set(i*Math.cos(r),t*Math.sin(l),t*Math.cos(l),i*Math.sin(r))}equals(n){return n._x===this._x&&n._y===this._y&&n._z===this._z&&n._w===this._w}fromArray(n,i=0){return this._x=n[i],this._y=n[i+1],this._z=n[i+2],this._w=n[i+3],this._onChangeCallback(),this}toArray(n=[],i=0){return n[i]=this._x,n[i+1]=this._y,n[i+2]=this._z,n[i+3]=this._w,n}fromBufferAttribute(n,i){return this._x=n.getX(i),this._y=n.getY(i),this._z=n.getZ(i),this._w=n.getW(i),this}toJSON(){return this.toArray()}_onChange(n){return this._onChangeCallback=n,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}},{"./MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jgQJ1:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Sphere",()=>t);var m=e("./Box3.js"),M=e("./Vector3.js");const v=new m.Box3,n=new M.Vector3,i=new M.Vector3;class t{constructor(l=new M.Vector3,h=-1){this.center=l,this.radius=h}set(l,h){return this.center.copy(l),this.radius=h,this}setFromPoints(l,h){const f=this.center;h!==void 0?f.copy(h):v.setFromPoints(l).getCenter(f);let c=0;for(let s=0,d=l.length;s<d;s++)c=Math.max(c,f.distanceToSquared(l[s]));return this.radius=Math.sqrt(c),this}copy(l){return this.center.copy(l.center),this.radius=l.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(l){return l.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(l){return l.distanceTo(this.center)-this.radius}intersectsSphere(l){const h=this.radius+l.radius;return l.center.distanceToSquared(this.center)<=h*h}intersectsBox(l){return l.intersectsSphere(this)}intersectsPlane(l){return Math.abs(l.distanceToPoint(this.center))<=this.radius}clampPoint(l,h){const f=this.center.distanceToSquared(l);return h.copy(l),f>this.radius*this.radius&&(h.sub(this.center).normalize(),h.multiplyScalar(this.radius).add(this.center)),h}getBoundingBox(l){return this.isEmpty()?(l.makeEmpty(),l):(l.set(this.center,this.center),l.expandByScalar(this.radius),l)}applyMatrix4(l){return this.center.applyMatrix4(l),this.radius=this.radius*l.getMaxScaleOnAxis(),this}translate(l){return this.center.add(l),this}expandByPoint(l){if(this.isEmpty())return this.center.copy(l),this.radius=0,this;n.subVectors(l,this.center);const h=n.lengthSq();if(h>this.radius*this.radius){const f=Math.sqrt(h),c=(f-this.radius)*.5;this.center.addScaledVector(n,c/f),this.radius+=c}return this}union(l){return l.isEmpty()?this:this.isEmpty()?(this.copy(l),this):(this.center.equals(l.center)===!0?this.radius=Math.max(this.radius,l.radius):(i.subVectors(l.center,this.center).setLength(l.radius),this.expandByPoint(n.copy(l.center).add(i)),this.expandByPoint(n.copy(l.center).sub(i))),this)}equals(l){return l.center.equals(this.center)&&l.radius===this.radius}clone(){return new this.constructor().copy(this)}}},{"./Box3.js":"dDJ5Q","./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dDJ5Q:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Box3",()=>M);var m=e("./Vector3.js");class M{constructor(y=new m.Vector3(1/0,1/0,1/0),T=new m.Vector3(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=y,this.max=T}set(y,T){return this.min.copy(y),this.max.copy(T),this}setFromArray(y){this.makeEmpty();for(let T=0,x=y.length;T<x;T+=3)this.expandByPoint(n.fromArray(y,T));return this}setFromBufferAttribute(y){this.makeEmpty();for(let T=0,x=y.count;T<x;T++)this.expandByPoint(n.fromBufferAttribute(y,T));return this}setFromPoints(y){this.makeEmpty();for(let T=0,x=y.length;T<x;T++)this.expandByPoint(y[T]);return this}setFromCenterAndSize(y,T){const x=n.copy(T).multiplyScalar(.5);return this.min.copy(y).sub(x),this.max.copy(y).add(x),this}setFromObject(y,T=!1){return this.makeEmpty(),this.expandByObject(y,T)}clone(){return new this.constructor().copy(this)}copy(y){return this.min.copy(y.min),this.max.copy(y.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(y){return this.isEmpty()?y.set(0,0,0):y.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(y){return this.isEmpty()?y.set(0,0,0):y.subVectors(this.max,this.min)}expandByPoint(y){return this.min.min(y),this.max.max(y),this}expandByVector(y){return this.min.sub(y),this.max.add(y),this}expandByScalar(y){return this.min.addScalar(-y),this.max.addScalar(y),this}expandByObject(y,T=!1){if(y.updateWorldMatrix(!1,!1),y.boundingBox!==void 0)y.boundingBox===null&&y.computeBoundingBox(),i.copy(y.boundingBox),i.applyMatrix4(y.matrixWorld),this.union(i);else{const _=y.geometry;if(_!==void 0)if(T&&_.attributes!==void 0&&_.attributes.position!==void 0){const A=_.attributes.position;for(let w=0,j=A.count;w<j;w++)n.fromBufferAttribute(A,w).applyMatrix4(y.matrixWorld),this.expandByPoint(n)}else _.boundingBox===null&&_.computeBoundingBox(),i.copy(_.boundingBox),i.applyMatrix4(y.matrixWorld),this.union(i)}const x=y.children;for(let _=0,A=x.length;_<A;_++)this.expandByObject(x[_],T);return this}containsPoint(y){return!(y.x<this.min.x||y.x>this.max.x||y.y<this.min.y||y.y>this.max.y||y.z<this.min.z||y.z>this.max.z)}containsBox(y){return this.min.x<=y.min.x&&y.max.x<=this.max.x&&this.min.y<=y.min.y&&y.max.y<=this.max.y&&this.min.z<=y.min.z&&y.max.z<=this.max.z}getParameter(y,T){return T.set((y.x-this.min.x)/(this.max.x-this.min.x),(y.y-this.min.y)/(this.max.y-this.min.y),(y.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(y){return!(y.max.x<this.min.x||y.min.x>this.max.x||y.max.y<this.min.y||y.min.y>this.max.y||y.max.z<this.min.z||y.min.z>this.max.z)}intersectsSphere(y){return this.clampPoint(y.center,n),n.distanceToSquared(y.center)<=y.radius*y.radius}intersectsPlane(y){let T,x;return y.normal.x>0?(T=y.normal.x*this.min.x,x=y.normal.x*this.max.x):(T=y.normal.x*this.max.x,x=y.normal.x*this.min.x),y.normal.y>0?(T+=y.normal.y*this.min.y,x+=y.normal.y*this.max.y):(T+=y.normal.y*this.max.y,x+=y.normal.y*this.min.y),y.normal.z>0?(T+=y.normal.z*this.min.z,x+=y.normal.z*this.max.z):(T+=y.normal.z*this.max.z,x+=y.normal.z*this.min.z),T<=-y.constant&&x>=-y.constant}intersectsTriangle(y){if(this.isEmpty())return!1;this.getCenter(s),d.subVectors(this.max,s),t.subVectors(y.a,s),r.subVectors(y.b,s),l.subVectors(y.c,s),h.subVectors(r,t),f.subVectors(l,r),c.subVectors(t,l);let T=[0,-h.z,h.y,0,-f.z,f.y,0,-c.z,c.y,h.z,0,-h.x,f.z,0,-f.x,c.z,0,-c.x,-h.y,h.x,0,-f.y,f.x,0,-c.y,c.x,0];return!g(T,t,r,l,d)||(T=[1,0,0,0,1,0,0,0,1],!g(T,t,r,l,d))?!1:(p.crossVectors(h,f),T=[p.x,p.y,p.z],g(T,t,r,l,d))}clampPoint(y,T){return T.copy(y).clamp(this.min,this.max)}distanceToPoint(y){return this.clampPoint(y,n).distanceTo(y)}getBoundingSphere(y){return this.isEmpty()?y.makeEmpty():(this.getCenter(y.center),y.radius=this.getSize(n).length()*.5),y}intersect(y){return this.min.max(y.min),this.max.min(y.max),this.isEmpty()&&this.makeEmpty(),this}union(y){return this.min.min(y.min),this.max.max(y.max),this}applyMatrix4(y){return this.isEmpty()?this:(v[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(y),v[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(y),v[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(y),v[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(y),v[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(y),v[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(y),v[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(y),v[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(y),this.setFromPoints(v),this)}translate(y){return this.min.add(y),this.max.add(y),this}equals(y){return y.min.equals(this.min)&&y.max.equals(this.max)}}const v=[new m.Vector3,new m.Vector3,new m.Vector3,new m.Vector3,new m.Vector3,new m.Vector3,new m.Vector3,new m.Vector3],n=new m.Vector3,i=new M,t=new m.Vector3,r=new m.Vector3,l=new m.Vector3,h=new m.Vector3,f=new m.Vector3,c=new m.Vector3,s=new m.Vector3,d=new m.Vector3,p=new m.Vector3,u=new m.Vector3;function g(S,y,T,x,_){for(let A=0,w=S.length-3;A<=w;A+=3){u.fromArray(S,A);const j=_.x*Math.abs(u.x)+_.y*Math.abs(u.y)+_.z*Math.abs(u.z),R=y.dot(u),L=T.dot(u),D=x.dot(u);if(Math.max(-Math.max(R,L,D),Math.min(R,L,D))>j)return!1}return!0}},{"./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8evV6":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Ray",()=>h);var m=e("./Vector3.js");const M=new m.Vector3,v=new m.Vector3,n=new m.Vector3,i=new m.Vector3,t=new m.Vector3,r=new m.Vector3,l=new m.Vector3;class h{constructor(c=new m.Vector3,s=new m.Vector3(0,0,-1)){this.origin=c,this.direction=s}set(c,s){return this.origin.copy(c),this.direction.copy(s),this}copy(c){return this.origin.copy(c.origin),this.direction.copy(c.direction),this}at(c,s){return s.copy(this.origin).addScaledVector(this.direction,c)}lookAt(c){return this.direction.copy(c).sub(this.origin).normalize(),this}recast(c){return this.origin.copy(this.at(c,M)),this}closestPointToPoint(c,s){s.subVectors(c,this.origin);const d=s.dot(this.direction);return d<0?s.copy(this.origin):s.copy(this.origin).addScaledVector(this.direction,d)}distanceToPoint(c){return Math.sqrt(this.distanceSqToPoint(c))}distanceSqToPoint(c){const s=M.subVectors(c,this.origin).dot(this.direction);return s<0?this.origin.distanceToSquared(c):(M.copy(this.origin).addScaledVector(this.direction,s),M.distanceToSquared(c))}distanceSqToSegment(c,s,d,p){v.copy(c).add(s).multiplyScalar(.5),n.copy(s).sub(c).normalize(),i.copy(this.origin).sub(v);const u=c.distanceTo(s)*.5,g=-this.direction.dot(n),S=i.dot(this.direction),y=-i.dot(n),T=i.lengthSq(),x=Math.abs(1-g*g);let _,A,w,j;if(x>0)if(_=g*y-S,A=g*S-y,j=u*x,_>=0)if(A>=-j)if(A<=j){const R=1/x;_*=R,A*=R,w=_*(_+g*A+2*S)+A*(g*_+A+2*y)+T}else A=u,_=Math.max(0,-(g*A+S)),w=-_*_+A*(A+2*y)+T;else A=-u,_=Math.max(0,-(g*A+S)),w=-_*_+A*(A+2*y)+T;else A<=-j?(_=Math.max(0,-(-g*u+S)),A=_>0?-u:Math.min(Math.max(-u,-y),u),w=-_*_+A*(A+2*y)+T):A<=j?(_=0,A=Math.min(Math.max(-u,-y),u),w=A*(A+2*y)+T):(_=Math.max(0,-(g*u+S)),A=_>0?u:Math.min(Math.max(-u,-y),u),w=-_*_+A*(A+2*y)+T);else A=g>0?-u:u,_=Math.max(0,-(g*A+S)),w=-_*_+A*(A+2*y)+T;return d&&d.copy(this.origin).addScaledVector(this.direction,_),p&&p.copy(v).addScaledVector(n,A),w}intersectSphere(c,s){M.subVectors(c.center,this.origin);const d=M.dot(this.direction),p=M.dot(M)-d*d,u=c.radius*c.radius;if(p>u)return null;const g=Math.sqrt(u-p),S=d-g,y=d+g;return y<0?null:S<0?this.at(y,s):this.at(S,s)}intersectsSphere(c){return this.distanceSqToPoint(c.center)<=c.radius*c.radius}distanceToPlane(c){const s=c.normal.dot(this.direction);if(s===0)return c.distanceToPoint(this.origin)===0?0:null;const d=-(this.origin.dot(c.normal)+c.constant)/s;return d>=0?d:null}intersectPlane(c,s){const d=this.distanceToPlane(c);return d===null?null:this.at(d,s)}intersectsPlane(c){const s=c.distanceToPoint(this.origin);return s===0||c.normal.dot(this.direction)*s<0}intersectBox(c,s){let d,p,u,g,S,y;const T=1/this.direction.x,x=1/this.direction.y,_=1/this.direction.z,A=this.origin;return T>=0?(d=(c.min.x-A.x)*T,p=(c.max.x-A.x)*T):(d=(c.max.x-A.x)*T,p=(c.min.x-A.x)*T),x>=0?(u=(c.min.y-A.y)*x,g=(c.max.y-A.y)*x):(u=(c.max.y-A.y)*x,g=(c.min.y-A.y)*x),d>g||u>p||((u>d||isNaN(d))&&(d=u),(g<p||isNaN(p))&&(p=g),_>=0?(S=(c.min.z-A.z)*_,y=(c.max.z-A.z)*_):(S=(c.max.z-A.z)*_,y=(c.min.z-A.z)*_),d>y||S>p)||((S>d||d!==d)&&(d=S),(y<p||p!==p)&&(p=y),p<0)?null:this.at(d>=0?d:p,s)}intersectsBox(c){return this.intersectBox(c,M)!==null}intersectTriangle(c,s,d,p,u){t.subVectors(s,c),r.subVectors(d,c),l.crossVectors(t,r);let g=this.direction.dot(l),S;if(g>0){if(p)return null;S=1}else if(g<0)S=-1,g=-g;else return null;i.subVectors(this.origin,c);const y=S*this.direction.dot(r.crossVectors(i,r));if(y<0)return null;const T=S*this.direction.dot(t.cross(i));if(T<0||y+T>g)return null;const x=-S*i.dot(l);return x<0?null:this.at(x/g,u)}applyMatrix4(c){return this.origin.applyMatrix4(c),this.direction.transformDirection(c),this}equals(c){return c.origin.equals(this.origin)&&c.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}},{"./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"64n8p":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Matrix4",()=>v);var m=e("../constants.js"),M=e("./Vector3.js");class v{constructor(s,d,p,u,g,S,y,T,x,_,A,w,j,R,L,D){v.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],s!==void 0&&this.set(s,d,p,u,g,S,y,T,x,_,A,w,j,R,L,D)}set(s,d,p,u,g,S,y,T,x,_,A,w,j,R,L,D){const P=this.elements;return P[0]=s,P[4]=d,P[8]=p,P[12]=u,P[1]=g,P[5]=S,P[9]=y,P[13]=T,P[2]=x,P[6]=_,P[10]=A,P[14]=w,P[3]=j,P[7]=R,P[11]=L,P[15]=D,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new v().fromArray(this.elements)}copy(s){const d=this.elements,p=s.elements;return d[0]=p[0],d[1]=p[1],d[2]=p[2],d[3]=p[3],d[4]=p[4],d[5]=p[5],d[6]=p[6],d[7]=p[7],d[8]=p[8],d[9]=p[9],d[10]=p[10],d[11]=p[11],d[12]=p[12],d[13]=p[13],d[14]=p[14],d[15]=p[15],this}copyPosition(s){const d=this.elements,p=s.elements;return d[12]=p[12],d[13]=p[13],d[14]=p[14],this}setFromMatrix3(s){const d=s.elements;return this.set(d[0],d[3],d[6],0,d[1],d[4],d[7],0,d[2],d[5],d[8],0,0,0,0,1),this}extractBasis(s,d,p){return s.setFromMatrixColumn(this,0),d.setFromMatrixColumn(this,1),p.setFromMatrixColumn(this,2),this}makeBasis(s,d,p){return this.set(s.x,d.x,p.x,0,s.y,d.y,p.y,0,s.z,d.z,p.z,0,0,0,0,1),this}extractRotation(s){const d=this.elements,p=s.elements,u=1/n.setFromMatrixColumn(s,0).length(),g=1/n.setFromMatrixColumn(s,1).length(),S=1/n.setFromMatrixColumn(s,2).length();return d[0]=p[0]*u,d[1]=p[1]*u,d[2]=p[2]*u,d[3]=0,d[4]=p[4]*g,d[5]=p[5]*g,d[6]=p[6]*g,d[7]=0,d[8]=p[8]*S,d[9]=p[9]*S,d[10]=p[10]*S,d[11]=0,d[12]=0,d[13]=0,d[14]=0,d[15]=1,this}makeRotationFromEuler(s){const d=this.elements,p=s.x,u=s.y,g=s.z,S=Math.cos(p),y=Math.sin(p),T=Math.cos(u),x=Math.sin(u),_=Math.cos(g),A=Math.sin(g);if(s.order==="XYZ"){const w=S*_,j=S*A,R=y*_,L=y*A;d[0]=T*_,d[4]=-T*A,d[8]=x,d[1]=j+R*x,d[5]=w-L*x,d[9]=-y*T,d[2]=L-w*x,d[6]=R+j*x,d[10]=S*T}else if(s.order==="YXZ"){const w=T*_,j=T*A,R=x*_,L=x*A;d[0]=w+L*y,d[4]=R*y-j,d[8]=S*x,d[1]=S*A,d[5]=S*_,d[9]=-y,d[2]=j*y-R,d[6]=L+w*y,d[10]=S*T}else if(s.order==="ZXY"){const w=T*_,j=T*A,R=x*_,L=x*A;d[0]=w-L*y,d[4]=-S*A,d[8]=R+j*y,d[1]=j+R*y,d[5]=S*_,d[9]=L-w*y,d[2]=-S*x,d[6]=y,d[10]=S*T}else if(s.order==="ZYX"){const w=S*_,j=S*A,R=y*_,L=y*A;d[0]=T*_,d[4]=R*x-j,d[8]=w*x+L,d[1]=T*A,d[5]=L*x+w,d[9]=j*x-R,d[2]=-x,d[6]=y*T,d[10]=S*T}else if(s.order==="YZX"){const w=S*T,j=S*x,R=y*T,L=y*x;d[0]=T*_,d[4]=L-w*A,d[8]=R*A+j,d[1]=A,d[5]=S*_,d[9]=-y*_,d[2]=-x*_,d[6]=j*A+R,d[10]=w-L*A}else if(s.order==="XZY"){const w=S*T,j=S*x,R=y*T,L=y*x;d[0]=T*_,d[4]=-A,d[8]=x*_,d[1]=w*A+L,d[5]=S*_,d[9]=j*A-R,d[2]=R*A-j,d[6]=y*_,d[10]=L*A+w}return d[3]=0,d[7]=0,d[11]=0,d[12]=0,d[13]=0,d[14]=0,d[15]=1,this}makeRotationFromQuaternion(s){return this.compose(t,s,r)}lookAt(s,d,p){const u=this.elements;return f.subVectors(s,d),f.lengthSq()===0&&(f.z=1),f.normalize(),l.crossVectors(p,f),l.lengthSq()===0&&(Math.abs(p.z)===1?f.x+=1e-4:f.z+=1e-4,f.normalize(),l.crossVectors(p,f)),l.normalize(),h.crossVectors(f,l),u[0]=l.x,u[4]=h.x,u[8]=f.x,u[1]=l.y,u[5]=h.y,u[9]=f.y,u[2]=l.z,u[6]=h.z,u[10]=f.z,this}multiply(s){return this.multiplyMatrices(this,s)}premultiply(s){return this.multiplyMatrices(s,this)}multiplyMatrices(s,d){const p=s.elements,u=d.elements,g=this.elements,S=p[0],y=p[4],T=p[8],x=p[12],_=p[1],A=p[5],w=p[9],j=p[13],R=p[2],L=p[6],D=p[10],P=p[14],k=p[3],O=p[7],F=p[11],G=p[15],b=u[0],C=u[4],I=u[8],B=u[12],H=u[1],X=u[5],Y=u[9],Z=u[13],Q=u[2],ne=u[6],ge=u[10],me=u[14],_e=u[3],le=u[7],ee=u[11],je=u[15];return g[0]=S*b+y*H+T*Q+x*_e,g[4]=S*C+y*X+T*ne+x*le,g[8]=S*I+y*Y+T*ge+x*ee,g[12]=S*B+y*Z+T*me+x*je,g[1]=_*b+A*H+w*Q+j*_e,g[5]=_*C+A*X+w*ne+j*le,g[9]=_*I+A*Y+w*ge+j*ee,g[13]=_*B+A*Z+w*me+j*je,g[2]=R*b+L*H+D*Q+P*_e,g[6]=R*C+L*X+D*ne+P*le,g[10]=R*I+L*Y+D*ge+P*ee,g[14]=R*B+L*Z+D*me+P*je,g[3]=k*b+O*H+F*Q+G*_e,g[7]=k*C+O*X+F*ne+G*le,g[11]=k*I+O*Y+F*ge+G*ee,g[15]=k*B+O*Z+F*me+G*je,this}multiplyScalar(s){const d=this.elements;return d[0]*=s,d[4]*=s,d[8]*=s,d[12]*=s,d[1]*=s,d[5]*=s,d[9]*=s,d[13]*=s,d[2]*=s,d[6]*=s,d[10]*=s,d[14]*=s,d[3]*=s,d[7]*=s,d[11]*=s,d[15]*=s,this}determinant(){const s=this.elements,d=s[0],p=s[4],u=s[8],g=s[12],S=s[1],y=s[5],T=s[9],x=s[13],_=s[2],A=s[6],w=s[10],j=s[14],R=s[3],L=s[7],D=s[11],P=s[15];return R*(+g*T*A-u*x*A-g*y*w+p*x*w+u*y*j-p*T*j)+L*(+d*T*j-d*x*w+g*S*w-u*S*j+u*x*_-g*T*_)+D*(+d*x*A-d*y*j-g*S*A+p*S*j+g*y*_-p*x*_)+P*(-u*y*_-d*T*A+d*y*w+u*S*A-p*S*w+p*T*_)}transpose(){const s=this.elements;let d;return d=s[1],s[1]=s[4],s[4]=d,d=s[2],s[2]=s[8],s[8]=d,d=s[6],s[6]=s[9],s[9]=d,d=s[3],s[3]=s[12],s[12]=d,d=s[7],s[7]=s[13],s[13]=d,d=s[11],s[11]=s[14],s[14]=d,this}setPosition(s,d,p){const u=this.elements;return s.isVector3?(u[12]=s.x,u[13]=s.y,u[14]=s.z):(u[12]=s,u[13]=d,u[14]=p),this}invert(){const s=this.elements,d=s[0],p=s[1],u=s[2],g=s[3],S=s[4],y=s[5],T=s[6],x=s[7],_=s[8],A=s[9],w=s[10],j=s[11],R=s[12],L=s[13],D=s[14],P=s[15],k=A*D*x-L*w*x+L*T*j-y*D*j-A*T*P+y*w*P,O=R*w*x-_*D*x-R*T*j+S*D*j+_*T*P-S*w*P,F=_*L*x-R*A*x+R*y*j-S*L*j-_*y*P+S*A*P,G=R*A*T-_*L*T-R*y*w+S*L*w+_*y*D-S*A*D,b=d*k+p*O+u*F+g*G;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/b;return s[0]=k*C,s[1]=(L*w*g-A*D*g-L*u*j+p*D*j+A*u*P-p*w*P)*C,s[2]=(y*D*g-L*T*g+L*u*x-p*D*x-y*u*P+p*T*P)*C,s[3]=(A*T*g-y*w*g-A*u*x+p*w*x+y*u*j-p*T*j)*C,s[4]=O*C,s[5]=(_*D*g-R*w*g+R*u*j-d*D*j-_*u*P+d*w*P)*C,s[6]=(R*T*g-S*D*g-R*u*x+d*D*x+S*u*P-d*T*P)*C,s[7]=(S*w*g-_*T*g+_*u*x-d*w*x-S*u*j+d*T*j)*C,s[8]=F*C,s[9]=(R*A*g-_*L*g-R*p*j+d*L*j+_*p*P-d*A*P)*C,s[10]=(S*L*g-R*y*g+R*p*x-d*L*x-S*p*P+d*y*P)*C,s[11]=(_*y*g-S*A*g-_*p*x+d*A*x+S*p*j-d*y*j)*C,s[12]=G*C,s[13]=(_*L*u-R*A*u+R*p*w-d*L*w-_*p*D+d*A*D)*C,s[14]=(R*y*u-S*L*u-R*p*T+d*L*T+S*p*D-d*y*D)*C,s[15]=(S*A*u-_*y*u+_*p*T-d*A*T-S*p*w+d*y*w)*C,this}scale(s){const d=this.elements,p=s.x,u=s.y,g=s.z;return d[0]*=p,d[4]*=u,d[8]*=g,d[1]*=p,d[5]*=u,d[9]*=g,d[2]*=p,d[6]*=u,d[10]*=g,d[3]*=p,d[7]*=u,d[11]*=g,this}getMaxScaleOnAxis(){const s=this.elements,d=s[0]*s[0]+s[1]*s[1]+s[2]*s[2],p=s[4]*s[4]+s[5]*s[5]+s[6]*s[6],u=s[8]*s[8]+s[9]*s[9]+s[10]*s[10];return Math.sqrt(Math.max(d,p,u))}makeTranslation(s,d,p){return s.isVector3?this.set(1,0,0,s.x,0,1,0,s.y,0,0,1,s.z,0,0,0,1):this.set(1,0,0,s,0,1,0,d,0,0,1,p,0,0,0,1),this}makeRotationX(s){const d=Math.cos(s),p=Math.sin(s);return this.set(1,0,0,0,0,d,-p,0,0,p,d,0,0,0,0,1),this}makeRotationY(s){const d=Math.cos(s),p=Math.sin(s);return this.set(d,0,p,0,0,1,0,0,-p,0,d,0,0,0,0,1),this}makeRotationZ(s){const d=Math.cos(s),p=Math.sin(s);return this.set(d,-p,0,0,p,d,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(s,d){const p=Math.cos(d),u=Math.sin(d),g=1-p,S=s.x,y=s.y,T=s.z,x=g*S,_=g*y;return this.set(x*S+p,x*y-u*T,x*T+u*y,0,x*y+u*T,_*y+p,_*T-u*S,0,x*T-u*y,_*T+u*S,g*T*T+p,0,0,0,0,1),this}makeScale(s,d,p){return this.set(s,0,0,0,0,d,0,0,0,0,p,0,0,0,0,1),this}makeShear(s,d,p,u,g,S){return this.set(1,p,g,0,s,1,S,0,d,u,1,0,0,0,0,1),this}compose(s,d,p){const u=this.elements,g=d._x,S=d._y,y=d._z,T=d._w,x=g+g,_=S+S,A=y+y,w=g*x,j=g*_,R=g*A,L=S*_,D=S*A,P=y*A,k=T*x,O=T*_,F=T*A,G=p.x,b=p.y,C=p.z;return u[0]=(1-(L+P))*G,u[1]=(j+F)*G,u[2]=(R-O)*G,u[3]=0,u[4]=(j-F)*b,u[5]=(1-(w+P))*b,u[6]=(D+k)*b,u[7]=0,u[8]=(R+O)*C,u[9]=(D-k)*C,u[10]=(1-(w+L))*C,u[11]=0,u[12]=s.x,u[13]=s.y,u[14]=s.z,u[15]=1,this}decompose(s,d,p){const u=this.elements;let g=n.set(u[0],u[1],u[2]).length();const S=n.set(u[4],u[5],u[6]).length(),y=n.set(u[8],u[9],u[10]).length();this.determinant()<0&&(g=-g),s.x=u[12],s.y=u[13],s.z=u[14],i.copy(this);const x=1/g,_=1/S,A=1/y;return i.elements[0]*=x,i.elements[1]*=x,i.elements[2]*=x,i.elements[4]*=_,i.elements[5]*=_,i.elements[6]*=_,i.elements[8]*=A,i.elements[9]*=A,i.elements[10]*=A,d.setFromRotationMatrix(i),p.x=g,p.y=S,p.z=y,this}makePerspective(s,d,p,u,g,S,y=m.WebGLCoordinateSystem){const T=this.elements,x=2*g/(d-s),_=2*g/(p-u),A=(d+s)/(d-s),w=(p+u)/(p-u);let j,R;if(y===m.WebGLCoordinateSystem)j=-(S+g)/(S-g),R=-2*S*g/(S-g);else if(y===m.WebGPUCoordinateSystem)j=-S/(S-g),R=-S*g/(S-g);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+y);return T[0]=x,T[4]=0,T[8]=A,T[12]=0,T[1]=0,T[5]=_,T[9]=w,T[13]=0,T[2]=0,T[6]=0,T[10]=j,T[14]=R,T[3]=0,T[7]=0,T[11]=-1,T[15]=0,this}makeOrthographic(s,d,p,u,g,S,y=m.WebGLCoordinateSystem){const T=this.elements,x=1/(d-s),_=1/(p-u),A=1/(S-g),w=(d+s)*x,j=(p+u)*_;let R,L;if(y===m.WebGLCoordinateSystem)R=(S+g)*A,L=-2*A;else if(y===m.WebGPUCoordinateSystem)R=g*A,L=-1*A;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+y);return T[0]=2*x,T[4]=0,T[8]=0,T[12]=-w,T[1]=0,T[5]=2*_,T[9]=0,T[13]=-j,T[2]=0,T[6]=0,T[10]=L,T[14]=-R,T[3]=0,T[7]=0,T[11]=0,T[15]=1,this}equals(s){const d=this.elements,p=s.elements;for(let u=0;u<16;u++)if(d[u]!==p[u])return!1;return!0}fromArray(s,d=0){for(let p=0;p<16;p++)this.elements[p]=s[p+d];return this}toArray(s=[],d=0){const p=this.elements;return s[d]=p[0],s[d+1]=p[1],s[d+2]=p[2],s[d+3]=p[3],s[d+4]=p[4],s[d+5]=p[5],s[d+6]=p[6],s[d+7]=p[7],s[d+8]=p[8],s[d+9]=p[9],s[d+10]=p[10],s[d+11]=p[11],s[d+12]=p[12],s[d+13]=p[13],s[d+14]=p[14],s[d+15]=p[15],s}}const n=new M.Vector3,i=new v,t=new M.Vector3(0,0,0),r=new M.Vector3(1,1,1),l=new M.Vector3,h=new M.Vector3,f=new M.Vector3},{"../constants.js":"bqsVL","./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ibguD:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Object3D",()=>A);var m=e("../math/Quaternion.js"),M=e("../math/Vector3.js"),v=e("../math/Matrix4.js"),n=e("./EventDispatcher.js"),i=e("../math/Euler.js"),t=e("./Layers.js"),r=e("../math/Matrix3.js"),l=e("../math/MathUtils.js");let h=0;const f=new M.Vector3,c=new m.Quaternion,s=new v.Matrix4,d=new M.Vector3,p=new M.Vector3,u=new M.Vector3,g=new m.Quaternion,S=new M.Vector3(1,0,0),y=new M.Vector3(0,1,0),T=new M.Vector3(0,0,1),x={type:"added"},_={type:"removed"};class A extends n.EventDispatcher{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:h++}),this.uuid=l.generateUUID(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=A.DEFAULT_UP.clone();const j=new M.Vector3,R=new i.Euler,L=new m.Quaternion,D=new M.Vector3(1,1,1);function P(){L.setFromEuler(R,!1)}function k(){R.setFromQuaternion(L,void 0,!1)}R._onChange(P),L._onChange(k),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:j},rotation:{configurable:!0,enumerable:!0,value:R},quaternion:{configurable:!0,enumerable:!0,value:L},scale:{configurable:!0,enumerable:!0,value:D},modelViewMatrix:{value:new v.Matrix4},normalMatrix:{value:new r.Matrix3}}),this.matrix=new v.Matrix4,this.matrixWorld=new v.Matrix4,this.matrixAutoUpdate=A.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=A.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new t.Layers,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(j){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(j),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(j){return this.quaternion.premultiply(j),this}setRotationFromAxisAngle(j,R){this.quaternion.setFromAxisAngle(j,R)}setRotationFromEuler(j){this.quaternion.setFromEuler(j,!0)}setRotationFromMatrix(j){this.quaternion.setFromRotationMatrix(j)}setRotationFromQuaternion(j){this.quaternion.copy(j)}rotateOnAxis(j,R){return c.setFromAxisAngle(j,R),this.quaternion.multiply(c),this}rotateOnWorldAxis(j,R){return c.setFromAxisAngle(j,R),this.quaternion.premultiply(c),this}rotateX(j){return this.rotateOnAxis(S,j)}rotateY(j){return this.rotateOnAxis(y,j)}rotateZ(j){return this.rotateOnAxis(T,j)}translateOnAxis(j,R){return f.copy(j).applyQuaternion(this.quaternion),this.position.add(f.multiplyScalar(R)),this}translateX(j){return this.translateOnAxis(S,j)}translateY(j){return this.translateOnAxis(y,j)}translateZ(j){return this.translateOnAxis(T,j)}localToWorld(j){return this.updateWorldMatrix(!0,!1),j.applyMatrix4(this.matrixWorld)}worldToLocal(j){return this.updateWorldMatrix(!0,!1),j.applyMatrix4(s.copy(this.matrixWorld).invert())}lookAt(j,R,L){j.isVector3?d.copy(j):d.set(j,R,L);const D=this.parent;this.updateWorldMatrix(!0,!1),p.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?s.lookAt(p,d,this.up):s.lookAt(d,p,this.up),this.quaternion.setFromRotationMatrix(s),D&&(s.extractRotation(D.matrixWorld),c.setFromRotationMatrix(s),this.quaternion.premultiply(c.invert()))}add(j){if(arguments.length>1){for(let R=0;R<arguments.length;R++)this.add(arguments[R]);return this}return j===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",j),this):(j&&j.isObject3D?(j.parent!==null&&j.parent.remove(j),j.parent=this,this.children.push(j),j.dispatchEvent(x)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",j),this)}remove(j){if(arguments.length>1){for(let L=0;L<arguments.length;L++)this.remove(arguments[L]);return this}const R=this.children.indexOf(j);return R!==-1&&(j.parent=null,this.children.splice(R,1),j.dispatchEvent(_)),this}removeFromParent(){const j=this.parent;return j!==null&&j.remove(this),this}clear(){for(let j=0;j<this.children.length;j++){const R=this.children[j];R.parent=null,R.dispatchEvent(_)}return this.children.length=0,this}attach(j){return this.updateWorldMatrix(!0,!1),s.copy(this.matrixWorld).invert(),j.parent!==null&&(j.parent.updateWorldMatrix(!0,!1),s.multiply(j.parent.matrixWorld)),j.applyMatrix4(s),this.add(j),j.updateWorldMatrix(!1,!0),this}getObjectById(j){return this.getObjectByProperty("id",j)}getObjectByName(j){return this.getObjectByProperty("name",j)}getObjectByProperty(j,R){if(this[j]===R)return this;for(let L=0,D=this.children.length;L<D;L++){const k=this.children[L].getObjectByProperty(j,R);if(k!==void 0)return k}}getObjectsByProperty(j,R){let L=[];this[j]===R&&L.push(this);for(let D=0,P=this.children.length;D<P;D++){const k=this.children[D].getObjectsByProperty(j,R);k.length>0&&(L=L.concat(k))}return L}getWorldPosition(j){return this.updateWorldMatrix(!0,!1),j.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(j){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(p,j,u),j}getWorldScale(j){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(p,g,j),j}getWorldDirection(j){this.updateWorldMatrix(!0,!1);const R=this.matrixWorld.elements;return j.set(R[8],R[9],R[10]).normalize()}raycast(){}traverse(j){j(this);const R=this.children;for(let L=0,D=R.length;L<D;L++)R[L].traverse(j)}traverseVisible(j){if(this.visible===!1)return;j(this);const R=this.children;for(let L=0,D=R.length;L<D;L++)R[L].traverseVisible(j)}traverseAncestors(j){const R=this.parent;R!==null&&(j(R),R.traverseAncestors(j))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(j){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||j)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,j=!0);const R=this.children;for(let L=0,D=R.length;L<D;L++){const P=R[L];(P.matrixWorldAutoUpdate===!0||j===!0)&&P.updateMatrixWorld(j)}}updateWorldMatrix(j,R){const L=this.parent;if(j===!0&&L!==null&&L.matrixWorldAutoUpdate===!0&&L.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),R===!0){const D=this.children;for(let P=0,k=D.length;P<k;P++){const O=D[P];O.matrixWorldAutoUpdate===!0&&O.updateWorldMatrix(!1,!0)}}}toJSON(j){const R=j===void 0||typeof j=="string",L={};R&&(j={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},L.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const D={};D.uuid=this.uuid,D.type=this.type,this.name!==""&&(D.name=this.name),this.castShadow===!0&&(D.castShadow=!0),this.receiveShadow===!0&&(D.receiveShadow=!0),this.visible===!1&&(D.visible=!1),this.frustumCulled===!1&&(D.frustumCulled=!1),this.renderOrder!==0&&(D.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(D.userData=this.userData),D.layers=this.layers.mask,D.matrix=this.matrix.toArray(),D.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(D.matrixAutoUpdate=!1),this.isInstancedMesh&&(D.type="InstancedMesh",D.count=this.count,D.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(D.instanceColor=this.instanceColor.toJSON()));function P(O,F){return O[F.uuid]===void 0&&(O[F.uuid]=F.toJSON(j)),F.uuid}if(this.isScene)this.background&&(this.background.isColor?D.background=this.background.toJSON():this.background.isTexture&&(D.background=this.background.toJSON(j).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(D.environment=this.environment.toJSON(j).uuid);else if(this.isMesh||this.isLine||this.isPoints){D.geometry=P(j.geometries,this.geometry);const O=this.geometry.parameters;if(O!==void 0&&O.shapes!==void 0){const F=O.shapes;if(Array.isArray(F))for(let G=0,b=F.length;G<b;G++){const C=F[G];P(j.shapes,C)}else P(j.shapes,F)}}if(this.isSkinnedMesh&&(D.bindMode=this.bindMode,D.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(P(j.skeletons,this.skeleton),D.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const O=[];for(let F=0,G=this.material.length;F<G;F++)O.push(P(j.materials,this.material[F]));D.material=O}else D.material=P(j.materials,this.material);if(this.children.length>0){D.children=[];for(let O=0;O<this.children.length;O++)D.children.push(this.children[O].toJSON(j).object)}if(this.animations.length>0){D.animations=[];for(let O=0;O<this.animations.length;O++){const F=this.animations[O];D.animations.push(P(j.animations,F))}}if(R){const O=k(j.geometries),F=k(j.materials),G=k(j.textures),b=k(j.images),C=k(j.shapes),I=k(j.skeletons),B=k(j.animations),H=k(j.nodes);O.length>0&&(L.geometries=O),F.length>0&&(L.materials=F),G.length>0&&(L.textures=G),b.length>0&&(L.images=b),C.length>0&&(L.shapes=C),I.length>0&&(L.skeletons=I),B.length>0&&(L.animations=B),H.length>0&&(L.nodes=H)}return L.object=D,L;function k(O){const F=[];for(const G in O){const b=O[G];delete b.metadata,F.push(b)}return F}}clone(j){return new this.constructor().copy(this,j)}copy(j,R=!0){if(this.name=j.name,this.up.copy(j.up),this.position.copy(j.position),this.rotation.order=j.rotation.order,this.quaternion.copy(j.quaternion),this.scale.copy(j.scale),this.matrix.copy(j.matrix),this.matrixWorld.copy(j.matrixWorld),this.matrixAutoUpdate=j.matrixAutoUpdate,this.matrixWorldNeedsUpdate=j.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=j.matrixWorldAutoUpdate,this.layers.mask=j.layers.mask,this.visible=j.visible,this.castShadow=j.castShadow,this.receiveShadow=j.receiveShadow,this.frustumCulled=j.frustumCulled,this.renderOrder=j.renderOrder,this.animations=j.animations,this.userData=JSON.parse(JSON.stringify(j.userData)),R===!0)for(let L=0;L<j.children.length;L++){const D=j.children[L];this.add(D.clone())}return this}}A.DEFAULT_UP=new M.Vector3(0,1,0),A.DEFAULT_MATRIX_AUTO_UPDATE=!0,A.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0},{"../math/Quaternion.js":"iTBTv","../math/Vector3.js":"fUbuJ","../math/Matrix4.js":"64n8p","./EventDispatcher.js":"d6Goy","../math/Euler.js":"9PbQd","./Layers.js":"4RZ6C","../math/Matrix3.js":"85Mgp","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9PbQd":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Euler",()=>t);var m=e("./Quaternion.js"),M=e("./Matrix4.js"),v=e("./MathUtils.js");const n=new M.Matrix4,i=new m.Quaternion;class t{constructor(l=0,h=0,f=0,c=t.DEFAULT_ORDER){this.isEuler=!0,this._x=l,this._y=h,this._z=f,this._order=c}get x(){return this._x}set x(l){this._x=l,this._onChangeCallback()}get y(){return this._y}set y(l){this._y=l,this._onChangeCallback()}get z(){return this._z}set z(l){this._z=l,this._onChangeCallback()}get order(){return this._order}set order(l){this._order=l,this._onChangeCallback()}set(l,h,f,c=this._order){return this._x=l,this._y=h,this._z=f,this._order=c,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(l){return this._x=l._x,this._y=l._y,this._z=l._z,this._order=l._order,this._onChangeCallback(),this}setFromRotationMatrix(l,h=this._order,f=!0){const c=l.elements,s=c[0],d=c[4],p=c[8],u=c[1],g=c[5],S=c[9],y=c[2],T=c[6],x=c[10];switch(h){case"XYZ":this._y=Math.asin((0,v.clamp)(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-S,x),this._z=Math.atan2(-d,s)):(this._x=Math.atan2(T,g),this._z=0);break;case"YXZ":this._x=Math.asin(-(0,v.clamp)(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(p,x),this._z=Math.atan2(u,g)):(this._y=Math.atan2(-y,s),this._z=0);break;case"ZXY":this._x=Math.asin((0,v.clamp)(T,-1,1)),Math.abs(T)<.9999999?(this._y=Math.atan2(-y,x),this._z=Math.atan2(-d,g)):(this._y=0,this._z=Math.atan2(u,s));break;case"ZYX":this._y=Math.asin(-(0,v.clamp)(y,-1,1)),Math.abs(y)<.9999999?(this._x=Math.atan2(T,x),this._z=Math.atan2(u,s)):(this._x=0,this._z=Math.atan2(-d,g));break;case"YZX":this._z=Math.asin((0,v.clamp)(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-S,g),this._y=Math.atan2(-y,s)):(this._x=0,this._y=Math.atan2(p,x));break;case"XZY":this._z=Math.asin(-(0,v.clamp)(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(T,g),this._y=Math.atan2(p,s)):(this._x=Math.atan2(-S,x),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+h)}return this._order=h,f===!0&&this._onChangeCallback(),this}setFromQuaternion(l,h,f){return n.makeRotationFromQuaternion(l),this.setFromRotationMatrix(n,h,f)}setFromVector3(l,h=this._order){return this.set(l.x,l.y,l.z,h)}reorder(l){return i.setFromEuler(this),this.setFromQuaternion(i,l)}equals(l){return l._x===this._x&&l._y===this._y&&l._z===this._z&&l._order===this._order}fromArray(l){return this._x=l[0],this._y=l[1],this._z=l[2],l[3]!==void 0&&(this._order=l[3]),this._onChangeCallback(),this}toArray(l=[],h=0){return l[h]=this._x,l[h+1]=this._y,l[h+2]=this._z,l[h+3]=this._order,l}_onChange(l){return this._onChangeCallback=l,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}t.DEFAULT_ORDER="XYZ"},{"./Quaternion.js":"iTBTv","./Matrix4.js":"64n8p","./MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4RZ6C":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Layers",()=>m);class m{constructor(){this.mask=1}set(v){this.mask=(1<<v|0)>>>0}enable(v){this.mask|=1<<v|0}enableAll(){this.mask=-1}toggle(v){this.mask^=1<<v|0}disable(v){this.mask&=~(1<<v|0)}disableAll(){this.mask=0}test(v){return(this.mask&v.mask)!=0}isEnabled(v){return(this.mask&(1<<v|0))!=0}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bT9h1:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Triangle",()=>d);var m=e("./Vector3.js");const M=new m.Vector3,v=new m.Vector3,n=new m.Vector3,i=new m.Vector3,t=new m.Vector3,r=new m.Vector3,l=new m.Vector3,h=new m.Vector3,f=new m.Vector3,c=new m.Vector3;let s=!1;class d{constructor(u=new m.Vector3,g=new m.Vector3,S=new m.Vector3){this.a=u,this.b=g,this.c=S}static getNormal(u,g,S,y){y.subVectors(S,g),M.subVectors(u,g),y.cross(M);const T=y.lengthSq();return T>0?y.multiplyScalar(1/Math.sqrt(T)):y.set(0,0,0)}static getBarycoord(u,g,S,y,T){M.subVectors(y,g),v.subVectors(S,g),n.subVectors(u,g);const x=M.dot(M),_=M.dot(v),A=M.dot(n),w=v.dot(v),j=v.dot(n),R=x*w-_*_;if(R===0)return T.set(-2,-1,-1);const L=1/R,D=(w*A-_*j)*L,P=(x*j-_*A)*L;return T.set(1-D-P,P,D)}static containsPoint(u,g,S,y){return this.getBarycoord(u,g,S,y,i),i.x>=0&&i.y>=0&&i.x+i.y<=1}static getUV(u,g,S,y,T,x,_,A){return s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),s=!0),this.getInterpolation(u,g,S,y,T,x,_,A)}static getInterpolation(u,g,S,y,T,x,_,A){return this.getBarycoord(u,g,S,y,i),A.setScalar(0),A.addScaledVector(T,i.x),A.addScaledVector(x,i.y),A.addScaledVector(_,i.z),A}static isFrontFacing(u,g,S,y){return M.subVectors(S,g),v.subVectors(u,g),M.cross(v).dot(y)<0}set(u,g,S){return this.a.copy(u),this.b.copy(g),this.c.copy(S),this}setFromPointsAndIndices(u,g,S,y){return this.a.copy(u[g]),this.b.copy(u[S]),this.c.copy(u[y]),this}setFromAttributeAndIndices(u,g,S,y){return this.a.fromBufferAttribute(u,g),this.b.fromBufferAttribute(u,S),this.c.fromBufferAttribute(u,y),this}clone(){return new this.constructor().copy(this)}copy(u){return this.a.copy(u.a),this.b.copy(u.b),this.c.copy(u.c),this}getArea(){return M.subVectors(this.c,this.b),v.subVectors(this.a,this.b),M.cross(v).length()*.5}getMidpoint(u){return u.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(u){return d.getNormal(this.a,this.b,this.c,u)}getPlane(u){return u.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(u,g){return d.getBarycoord(u,this.a,this.b,this.c,g)}getUV(u,g,S,y,T){return s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),s=!0),d.getInterpolation(u,this.a,this.b,this.c,g,S,y,T)}getInterpolation(u,g,S,y,T){return d.getInterpolation(u,this.a,this.b,this.c,g,S,y,T)}containsPoint(u){return d.containsPoint(u,this.a,this.b,this.c)}isFrontFacing(u){return d.isFrontFacing(this.a,this.b,this.c,u)}intersectsBox(u){return u.intersectsTriangle(this)}closestPointToPoint(u,g){const S=this.a,y=this.b,T=this.c;let x,_;t.subVectors(y,S),r.subVectors(T,S),h.subVectors(u,S);const A=t.dot(h),w=r.dot(h);if(A<=0&&w<=0)return g.copy(S);f.subVectors(u,y);const j=t.dot(f),R=r.dot(f);if(j>=0&&R<=j)return g.copy(y);const L=A*R-j*w;if(L<=0&&A>=0&&j<=0)return x=A/(A-j),g.copy(S).addScaledVector(t,x);c.subVectors(u,T);const D=t.dot(c),P=r.dot(c);if(P>=0&&D<=P)return g.copy(T);const k=D*w-A*P;if(k<=0&&w>=0&&P<=0)return _=w/(w-P),g.copy(S).addScaledVector(r,_);const O=j*P-D*R;if(O<=0&&R-j>=0&&D-P>=0)return l.subVectors(T,y),_=(R-j)/(R-j+(D-P)),g.copy(y).addScaledVector(l,_);const F=1/(O+k+L);return x=k*F,_=L*F,g.copy(S).addScaledVector(t,x).addScaledVector(r,_)}equals(u){return u.a.equals(this.a)&&u.b.equals(this.b)&&u.c.equals(this.c)}}},{"./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gXfgB:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshBasicMaterial",()=>n);var m=e("./Material.js"),M=e("../constants.js"),v=e("../math/Color.js");class n extends m.Material{constructor(t){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new v.Color(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=M.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}},{"./Material.js":"l4ClZ","../constants.js":"bqsVL","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],l4ClZ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Material",()=>i);var m=e("../core/EventDispatcher.js"),M=e("../constants.js"),v=e("../math/MathUtils.js");let n=0;class i extends m.EventDispatcher{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:n++}),this.uuid=v.generateUUID(),this.name="",this.type="Material",this.blending=M.NormalBlending,this.side=M.FrontSide,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=M.SrcAlphaFactor,this.blendDst=M.OneMinusSrcAlphaFactor,this.blendEquation=M.AddEquation,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=M.LessEqualDepth,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=M.AlwaysStencilFunc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=M.KeepStencilOp,this.stencilZFail=M.KeepStencilOp,this.stencilZPass=M.KeepStencilOp,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(r){this._alphaTest>0!=r>0&&this.version++,this._alphaTest=r}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(r){if(r!==void 0)for(const l in r){const h=r[l];if(h===void 0){console.warn(`THREE.Material: parameter '${l}' has value of undefined.`);continue}const f=this[l];if(f===void 0){console.warn(`THREE.Material: '${l}' is not a property of THREE.${this.type}.`);continue}f&&f.isColor?f.set(h):f&&f.isVector3&&h&&h.isVector3?f.copy(h):this[l]=h}}toJSON(r){const l=r===void 0||typeof r=="string";l&&(r={textures:{},images:{}});const h={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};h.uuid=this.uuid,h.type=this.type,this.name!==""&&(h.name=this.name),this.color&&this.color.isColor&&(h.color=this.color.getHex()),this.roughness!==void 0&&(h.roughness=this.roughness),this.metalness!==void 0&&(h.metalness=this.metalness),this.sheen!==void 0&&(h.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(h.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(h.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(h.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(h.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(h.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(h.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(h.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(h.shininess=this.shininess),this.clearcoat!==void 0&&(h.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(h.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(h.clearcoatMap=this.clearcoatMap.toJSON(r).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(h.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(r).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(h.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(r).uuid,h.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(h.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(h.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(h.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(h.iridescenceMap=this.iridescenceMap.toJSON(r).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(h.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(r).uuid),this.anisotropy!==void 0&&(h.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(h.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(h.anisotropyMap=this.anisotropyMap.toJSON(r).uuid),this.map&&this.map.isTexture&&(h.map=this.map.toJSON(r).uuid),this.matcap&&this.matcap.isTexture&&(h.matcap=this.matcap.toJSON(r).uuid),this.alphaMap&&this.alphaMap.isTexture&&(h.alphaMap=this.alphaMap.toJSON(r).uuid),this.lightMap&&this.lightMap.isTexture&&(h.lightMap=this.lightMap.toJSON(r).uuid,h.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(h.aoMap=this.aoMap.toJSON(r).uuid,h.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(h.bumpMap=this.bumpMap.toJSON(r).uuid,h.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(h.normalMap=this.normalMap.toJSON(r).uuid,h.normalMapType=this.normalMapType,h.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(h.displacementMap=this.displacementMap.toJSON(r).uuid,h.displacementScale=this.displacementScale,h.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(h.roughnessMap=this.roughnessMap.toJSON(r).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(h.metalnessMap=this.metalnessMap.toJSON(r).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(h.emissiveMap=this.emissiveMap.toJSON(r).uuid),this.specularMap&&this.specularMap.isTexture&&(h.specularMap=this.specularMap.toJSON(r).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(h.specularIntensityMap=this.specularIntensityMap.toJSON(r).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(h.specularColorMap=this.specularColorMap.toJSON(r).uuid),this.envMap&&this.envMap.isTexture&&(h.envMap=this.envMap.toJSON(r).uuid,this.combine!==void 0&&(h.combine=this.combine)),this.envMapIntensity!==void 0&&(h.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(h.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(h.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(h.gradientMap=this.gradientMap.toJSON(r).uuid),this.transmission!==void 0&&(h.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(h.transmissionMap=this.transmissionMap.toJSON(r).uuid),this.thickness!==void 0&&(h.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(h.thicknessMap=this.thicknessMap.toJSON(r).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(h.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(h.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(h.size=this.size),this.shadowSide!==null&&(h.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(h.sizeAttenuation=this.sizeAttenuation),this.blending!==M.NormalBlending&&(h.blending=this.blending),this.side!==M.FrontSide&&(h.side=this.side),this.vertexColors&&(h.vertexColors=!0),this.opacity<1&&(h.opacity=this.opacity),this.transparent===!0&&(h.transparent=this.transparent),h.depthFunc=this.depthFunc,h.depthTest=this.depthTest,h.depthWrite=this.depthWrite,h.colorWrite=this.colorWrite,h.stencilWrite=this.stencilWrite,h.stencilWriteMask=this.stencilWriteMask,h.stencilFunc=this.stencilFunc,h.stencilRef=this.stencilRef,h.stencilFuncMask=this.stencilFuncMask,h.stencilFail=this.stencilFail,h.stencilZFail=this.stencilZFail,h.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(h.rotation=this.rotation),this.polygonOffset===!0&&(h.polygonOffset=!0),this.polygonOffsetFactor!==0&&(h.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(h.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(h.linewidth=this.linewidth),this.dashSize!==void 0&&(h.dashSize=this.dashSize),this.gapSize!==void 0&&(h.gapSize=this.gapSize),this.scale!==void 0&&(h.scale=this.scale),this.dithering===!0&&(h.dithering=!0),this.alphaTest>0&&(h.alphaTest=this.alphaTest),this.alphaHash===!0&&(h.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(h.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(h.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(h.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(h.wireframe=this.wireframe),this.wireframeLinewidth>1&&(h.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(h.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(h.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(h.flatShading=this.flatShading),this.visible===!1&&(h.visible=!1),this.toneMapped===!1&&(h.toneMapped=!1),this.fog===!1&&(h.fog=!1),Object.keys(this.userData).length>0&&(h.userData=this.userData);function f(c){const s=[];for(const d in c){const p=c[d];delete p.metadata,s.push(p)}return s}if(l){const c=f(r.textures),s=f(r.images);c.length>0&&(h.textures=c),s.length>0&&(h.images=s)}return h}clone(){return new this.constructor().copy(this)}copy(r){this.name=r.name,this.blending=r.blending,this.side=r.side,this.vertexColors=r.vertexColors,this.opacity=r.opacity,this.transparent=r.transparent,this.blendSrc=r.blendSrc,this.blendDst=r.blendDst,this.blendEquation=r.blendEquation,this.blendSrcAlpha=r.blendSrcAlpha,this.blendDstAlpha=r.blendDstAlpha,this.blendEquationAlpha=r.blendEquationAlpha,this.depthFunc=r.depthFunc,this.depthTest=r.depthTest,this.depthWrite=r.depthWrite,this.stencilWriteMask=r.stencilWriteMask,this.stencilFunc=r.stencilFunc,this.stencilRef=r.stencilRef,this.stencilFuncMask=r.stencilFuncMask,this.stencilFail=r.stencilFail,this.stencilZFail=r.stencilZFail,this.stencilZPass=r.stencilZPass,this.stencilWrite=r.stencilWrite;const l=r.clippingPlanes;let h=null;if(l!==null){const f=l.length;h=new Array(f);for(let c=0;c!==f;++c)h[c]=l[c].clone()}return this.clippingPlanes=h,this.clipIntersection=r.clipIntersection,this.clipShadows=r.clipShadows,this.shadowSide=r.shadowSide,this.colorWrite=r.colorWrite,this.precision=r.precision,this.polygonOffset=r.polygonOffset,this.polygonOffsetFactor=r.polygonOffsetFactor,this.polygonOffsetUnits=r.polygonOffsetUnits,this.dithering=r.dithering,this.alphaTest=r.alphaTest,this.alphaHash=r.alphaHash,this.alphaToCoverage=r.alphaToCoverage,this.premultipliedAlpha=r.premultipliedAlpha,this.forceSinglePass=r.forceSinglePass,this.visible=r.visible,this.toneMapped=r.toneMapped,this.userData=JSON.parse(JSON.stringify(r.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(r){r===!0&&this.version++}}},{"../core/EventDispatcher.js":"d6Goy","../constants.js":"bqsVL","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gFgcM:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Color",()=>l);var m=e("./MathUtils.js"),M=e("./ColorManagement.js"),v=e("../constants.js");const n={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},i={h:0,s:0,l:0},t={h:0,s:0,l:0};function r(f,c,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?f+(c-f)*6*s:s<.5?c:s<2/3?f+(c-f)*6*(2/3-s):f}class l{constructor(c,s,d){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(c,s,d)}set(c,s,d){if(s===void 0&&d===void 0){const p=c;p&&p.isColor?this.copy(p):typeof p=="number"?this.setHex(p):typeof p=="string"&&this.setStyle(p)}else this.setRGB(c,s,d);return this}setScalar(c){return this.r=c,this.g=c,this.b=c,this}setHex(c,s=v.SRGBColorSpace){return c=Math.floor(c),this.r=(c>>16&255)/255,this.g=(c>>8&255)/255,this.b=(c&255)/255,M.ColorManagement.toWorkingColorSpace(this,s),this}setRGB(c,s,d,p=M.ColorManagement.workingColorSpace){return this.r=c,this.g=s,this.b=d,M.ColorManagement.toWorkingColorSpace(this,p),this}setHSL(c,s,d,p=M.ColorManagement.workingColorSpace){if(c=(0,m.euclideanModulo)(c,1),s=(0,m.clamp)(s,0,1),d=(0,m.clamp)(d,0,1),s===0)this.r=this.g=this.b=d;else{const u=d<=.5?d*(1+s):d+s-d*s,g=2*d-u;this.r=r(g,u,c+1/3),this.g=r(g,u,c),this.b=r(g,u,c-1/3)}return M.ColorManagement.toWorkingColorSpace(this,p),this}setStyle(c,s=v.SRGBColorSpace){function d(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+c+" will be ignored.")}let p;if(p=/^(\w+)\(([^\)]*)\)/.exec(c)){let u;const g=p[1],S=p[2];switch(g){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(S))return d(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,s);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(S))return d(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,s);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(S))return d(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,s);break;default:console.warn("THREE.Color: Unknown color model "+c)}}else if(p=/^\#([A-Fa-f\d]+)$/.exec(c)){const u=p[1],g=u.length;if(g===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,s);if(g===6)return this.setHex(parseInt(u,16),s);console.warn("THREE.Color: Invalid hex color "+c)}else if(c&&c.length>0)return this.setColorName(c,s);return this}setColorName(c,s=v.SRGBColorSpace){const d=n[c.toLowerCase()];return d!==void 0?this.setHex(d,s):console.warn("THREE.Color: Unknown color "+c),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(c){return this.r=c.r,this.g=c.g,this.b=c.b,this}copySRGBToLinear(c){return this.r=(0,M.SRGBToLinear)(c.r),this.g=(0,M.SRGBToLinear)(c.g),this.b=(0,M.SRGBToLinear)(c.b),this}copyLinearToSRGB(c){return this.r=(0,M.LinearToSRGB)(c.r),this.g=(0,M.LinearToSRGB)(c.g),this.b=(0,M.LinearToSRGB)(c.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(c=v.SRGBColorSpace){return M.ColorManagement.fromWorkingColorSpace(h.copy(this),c),Math.round((0,m.clamp)(h.r*255,0,255))*65536+Math.round((0,m.clamp)(h.g*255,0,255))*256+Math.round((0,m.clamp)(h.b*255,0,255))}getHexString(c=v.SRGBColorSpace){return("000000"+this.getHex(c).toString(16)).slice(-6)}getHSL(c,s=M.ColorManagement.workingColorSpace){M.ColorManagement.fromWorkingColorSpace(h.copy(this),s);const d=h.r,p=h.g,u=h.b,g=Math.max(d,p,u),S=Math.min(d,p,u);let y,T;const x=(S+g)/2;if(S===g)y=0,T=0;else{const _=g-S;switch(T=x<=.5?_/(g+S):_/(2-g-S),g){case d:y=(p-u)/_+(p<u?6:0);break;case p:y=(u-d)/_+2;break;case u:y=(d-p)/_+4;break}y/=6}return c.h=y,c.s=T,c.l=x,c}getRGB(c,s=M.ColorManagement.workingColorSpace){return M.ColorManagement.fromWorkingColorSpace(h.copy(this),s),c.r=h.r,c.g=h.g,c.b=h.b,c}getStyle(c=v.SRGBColorSpace){M.ColorManagement.fromWorkingColorSpace(h.copy(this),c);const s=h.r,d=h.g,p=h.b;return c!==v.SRGBColorSpace?`color(${c} ${s.toFixed(3)} ${d.toFixed(3)} ${p.toFixed(3)})`:`rgb(${Math.round(s*255)},${Math.round(d*255)},${Math.round(p*255)})`}offsetHSL(c,s,d){return this.getHSL(i),i.h+=c,i.s+=s,i.l+=d,this.setHSL(i.h,i.s,i.l),this}add(c){return this.r+=c.r,this.g+=c.g,this.b+=c.b,this}addColors(c,s){return this.r=c.r+s.r,this.g=c.g+s.g,this.b=c.b+s.b,this}addScalar(c){return this.r+=c,this.g+=c,this.b+=c,this}sub(c){return this.r=Math.max(0,this.r-c.r),this.g=Math.max(0,this.g-c.g),this.b=Math.max(0,this.b-c.b),this}multiply(c){return this.r*=c.r,this.g*=c.g,this.b*=c.b,this}multiplyScalar(c){return this.r*=c,this.g*=c,this.b*=c,this}lerp(c,s){return this.r+=(c.r-this.r)*s,this.g+=(c.g-this.g)*s,this.b+=(c.b-this.b)*s,this}lerpColors(c,s,d){return this.r=c.r+(s.r-c.r)*d,this.g=c.g+(s.g-c.g)*d,this.b=c.b+(s.b-c.b)*d,this}lerpHSL(c,s){this.getHSL(i),c.getHSL(t);const d=(0,m.lerp)(i.h,t.h,s),p=(0,m.lerp)(i.s,t.s,s),u=(0,m.lerp)(i.l,t.l,s);return this.setHSL(d,p,u),this}setFromVector3(c){return this.r=c.x,this.g=c.y,this.b=c.z,this}applyMatrix3(c){const s=this.r,d=this.g,p=this.b,u=c.elements;return this.r=u[0]*s+u[3]*d+u[6]*p,this.g=u[1]*s+u[4]*d+u[7]*p,this.b=u[2]*s+u[5]*d+u[8]*p,this}equals(c){return c.r===this.r&&c.g===this.g&&c.b===this.b}fromArray(c,s=0){return this.r=c[s],this.g=c[s+1],this.b=c[s+2],this}toArray(c=[],s=0){return c[s]=this.r,c[s+1]=this.g,c[s+2]=this.b,c}fromBufferAttribute(c,s){return this.r=c.getX(s),this.g=c.getY(s),this.b=c.getZ(s),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const h=new l;l.NAMES=n},{"./MathUtils.js":"9o1gq","./ColorManagement.js":"4c2nU","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jAZYz:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"BufferGeometry",()=>T);var m=e("../math/Vector3.js"),M=e("../math/Vector2.js"),v=e("../math/Box3.js"),n=e("./EventDispatcher.js"),i=e("./BufferAttribute.js"),t=e("../math/Sphere.js"),r=e("./Object3D.js"),l=e("../math/Matrix4.js"),h=e("../math/Matrix3.js"),f=e("../math/MathUtils.js"),c=e("../utils.js");let s=0;const d=new l.Matrix4,p=new r.Object3D,u=new m.Vector3,g=new v.Box3,S=new v.Box3,y=new m.Vector3;class T extends n.EventDispatcher{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:s++}),this.uuid=f.generateUUID(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(_){return Array.isArray(_)?this.index=new((0,c.arrayNeedsUint32)(_)?i.Uint32BufferAttribute:i.Uint16BufferAttribute)(_,1):this.index=_,this}getAttribute(_){return this.attributes[_]}setAttribute(_,A){return this.attributes[_]=A,this}deleteAttribute(_){return delete this.attributes[_],this}hasAttribute(_){return this.attributes[_]!==void 0}addGroup(_,A,w=0){this.groups.push({start:_,count:A,materialIndex:w})}clearGroups(){this.groups=[]}setDrawRange(_,A){this.drawRange.start=_,this.drawRange.count=A}applyMatrix4(_){const A=this.attributes.position;A!==void 0&&(A.applyMatrix4(_),A.needsUpdate=!0);const w=this.attributes.normal;if(w!==void 0){const R=new h.Matrix3().getNormalMatrix(_);w.applyNormalMatrix(R),w.needsUpdate=!0}const j=this.attributes.tangent;return j!==void 0&&(j.transformDirection(_),j.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(_){return d.makeRotationFromQuaternion(_),this.applyMatrix4(d),this}rotateX(_){return d.makeRotationX(_),this.applyMatrix4(d),this}rotateY(_){return d.makeRotationY(_),this.applyMatrix4(d),this}rotateZ(_){return d.makeRotationZ(_),this.applyMatrix4(d),this}translate(_,A,w){return d.makeTranslation(_,A,w),this.applyMatrix4(d),this}scale(_,A,w){return d.makeScale(_,A,w),this.applyMatrix4(d),this}lookAt(_){return p.lookAt(_),p.updateMatrix(),this.applyMatrix4(p.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(u).negate(),this.translate(u.x,u.y,u.z),this}setFromPoints(_){const A=[];for(let w=0,j=_.length;w<j;w++){const R=_[w];A.push(R.x,R.y,R.z||0)}return this.setAttribute("position",new i.Float32BufferAttribute(A,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new v.Box3);const _=this.attributes.position,A=this.morphAttributes.position;if(_&&_.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new m.Vector3(-1/0,-1/0,-1/0),new m.Vector3(1/0,1/0,1/0));return}if(_!==void 0){if(this.boundingBox.setFromBufferAttribute(_),A)for(let w=0,j=A.length;w<j;w++){const R=A[w];g.setFromBufferAttribute(R),this.morphTargetsRelative?(y.addVectors(this.boundingBox.min,g.min),this.boundingBox.expandByPoint(y),y.addVectors(this.boundingBox.max,g.max),this.boundingBox.expandByPoint(y)):(this.boundingBox.expandByPoint(g.min),this.boundingBox.expandByPoint(g.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new t.Sphere);const _=this.attributes.position,A=this.morphAttributes.position;if(_&&_.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new m.Vector3,1/0);return}if(_){const w=this.boundingSphere.center;if(g.setFromBufferAttribute(_),A)for(let R=0,L=A.length;R<L;R++){const D=A[R];S.setFromBufferAttribute(D),this.morphTargetsRelative?(y.addVectors(g.min,S.min),g.expandByPoint(y),y.addVectors(g.max,S.max),g.expandByPoint(y)):(g.expandByPoint(S.min),g.expandByPoint(S.max))}g.getCenter(w);let j=0;for(let R=0,L=_.count;R<L;R++)y.fromBufferAttribute(_,R),j=Math.max(j,w.distanceToSquared(y));if(A)for(let R=0,L=A.length;R<L;R++){const D=A[R],P=this.morphTargetsRelative;for(let k=0,O=D.count;k<O;k++)y.fromBufferAttribute(D,k),P&&(u.fromBufferAttribute(_,k),y.add(u)),j=Math.max(j,w.distanceToSquared(y))}this.boundingSphere.radius=Math.sqrt(j),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const _=this.index,A=this.attributes;if(_===null||A.position===void 0||A.normal===void 0||A.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const w=_.array,j=A.position.array,R=A.normal.array,L=A.uv.array,D=j.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new i.BufferAttribute(new Float32Array(4*D),4));const P=this.getAttribute("tangent").array,k=[],O=[];for(let le=0;le<D;le++)k[le]=new m.Vector3,O[le]=new m.Vector3;const F=new m.Vector3,G=new m.Vector3,b=new m.Vector3,C=new M.Vector2,I=new M.Vector2,B=new M.Vector2,H=new m.Vector3,X=new m.Vector3;function Y(le,ee,je){F.fromArray(j,le*3),G.fromArray(j,ee*3),b.fromArray(j,je*3),C.fromArray(L,le*2),I.fromArray(L,ee*2),B.fromArray(L,je*2),G.sub(F),b.sub(F),I.sub(C),B.sub(C);const z=1/(I.x*B.y-B.x*I.y);!isFinite(z)||(H.copy(G).multiplyScalar(B.y).addScaledVector(b,-I.y).multiplyScalar(z),X.copy(b).multiplyScalar(I.x).addScaledVector(G,-B.x).multiplyScalar(z),k[le].add(H),k[ee].add(H),k[je].add(H),O[le].add(X),O[ee].add(X),O[je].add(X))}let Z=this.groups;Z.length===0&&(Z=[{start:0,count:w.length}]);for(let le=0,ee=Z.length;le<ee;++le){const je=Z[le],z=je.start,$=je.count;for(let se=z,ie=z+$;se<ie;se+=3)Y(w[se+0],w[se+1],w[se+2])}const Q=new m.Vector3,ne=new m.Vector3,ge=new m.Vector3,me=new m.Vector3;function _e(le){ge.fromArray(R,le*3),me.copy(ge);const ee=k[le];Q.copy(ee),Q.sub(ge.multiplyScalar(ge.dot(ee))).normalize(),ne.crossVectors(me,ee);const z=ne.dot(O[le])<0?-1:1;P[le*4]=Q.x,P[le*4+1]=Q.y,P[le*4+2]=Q.z,P[le*4+3]=z}for(let le=0,ee=Z.length;le<ee;++le){const je=Z[le],z=je.start,$=je.count;for(let se=z,ie=z+$;se<ie;se+=3)_e(w[se+0]),_e(w[se+1]),_e(w[se+2])}}computeVertexNormals(){const _=this.index,A=this.getAttribute("position");if(A!==void 0){let w=this.getAttribute("normal");if(w===void 0)w=new i.BufferAttribute(new Float32Array(A.count*3),3),this.setAttribute("normal",w);else for(let G=0,b=w.count;G<b;G++)w.setXYZ(G,0,0,0);const j=new m.Vector3,R=new m.Vector3,L=new m.Vector3,D=new m.Vector3,P=new m.Vector3,k=new m.Vector3,O=new m.Vector3,F=new m.Vector3;if(_)for(let G=0,b=_.count;G<b;G+=3){const C=_.getX(G+0),I=_.getX(G+1),B=_.getX(G+2);j.fromBufferAttribute(A,C),R.fromBufferAttribute(A,I),L.fromBufferAttribute(A,B),O.subVectors(L,R),F.subVectors(j,R),O.cross(F),D.fromBufferAttribute(w,C),P.fromBufferAttribute(w,I),k.fromBufferAttribute(w,B),D.add(O),P.add(O),k.add(O),w.setXYZ(C,D.x,D.y,D.z),w.setXYZ(I,P.x,P.y,P.z),w.setXYZ(B,k.x,k.y,k.z)}else for(let G=0,b=A.count;G<b;G+=3)j.fromBufferAttribute(A,G+0),R.fromBufferAttribute(A,G+1),L.fromBufferAttribute(A,G+2),O.subVectors(L,R),F.subVectors(j,R),O.cross(F),w.setXYZ(G+0,O.x,O.y,O.z),w.setXYZ(G+1,O.x,O.y,O.z),w.setXYZ(G+2,O.x,O.y,O.z);this.normalizeNormals(),w.needsUpdate=!0}}normalizeNormals(){const _=this.attributes.normal;for(let A=0,w=_.count;A<w;A++)y.fromBufferAttribute(_,A),y.normalize(),_.setXYZ(A,y.x,y.y,y.z)}toNonIndexed(){function _(D,P){const k=D.array,O=D.itemSize,F=D.normalized,G=new k.constructor(P.length*O);let b=0,C=0;for(let I=0,B=P.length;I<B;I++){D.isInterleavedBufferAttribute?b=P[I]*D.data.stride+D.offset:b=P[I]*O;for(let H=0;H<O;H++)G[C++]=k[b++]}return new i.BufferAttribute(G,O,F)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const A=new T,w=this.index.array,j=this.attributes;for(const D in j){const P=j[D],k=_(P,w);A.setAttribute(D,k)}const R=this.morphAttributes;for(const D in R){const P=[],k=R[D];for(let O=0,F=k.length;O<F;O++){const G=k[O],b=_(G,w);P.push(b)}A.morphAttributes[D]=P}A.morphTargetsRelative=this.morphTargetsRelative;const L=this.groups;for(let D=0,P=L.length;D<P;D++){const k=L[D];A.addGroup(k.start,k.count,k.materialIndex)}return A}toJSON(){const _={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(_.uuid=this.uuid,_.type=this.type,this.name!==""&&(_.name=this.name),Object.keys(this.userData).length>0&&(_.userData=this.userData),this.parameters!==void 0){const P=this.parameters;for(const k in P)P[k]!==void 0&&(_[k]=P[k]);return _}_.data={attributes:{}};const A=this.index;A!==null&&(_.data.index={type:A.array.constructor.name,array:Array.prototype.slice.call(A.array)});const w=this.attributes;for(const P in w){const k=w[P];_.data.attributes[P]=k.toJSON(_.data)}const j={};let R=!1;for(const P in this.morphAttributes){const k=this.morphAttributes[P],O=[];for(let F=0,G=k.length;F<G;F++){const b=k[F];O.push(b.toJSON(_.data))}O.length>0&&(j[P]=O,R=!0)}R&&(_.data.morphAttributes=j,_.data.morphTargetsRelative=this.morphTargetsRelative);const L=this.groups;L.length>0&&(_.data.groups=JSON.parse(JSON.stringify(L)));const D=this.boundingSphere;return D!==null&&(_.data.boundingSphere={center:D.center.toArray(),radius:D.radius}),_}clone(){return new this.constructor().copy(this)}copy(_){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const A={};this.name=_.name;const w=_.index;w!==null&&this.setIndex(w.clone(A));const j=_.attributes;for(const k in j){const O=j[k];this.setAttribute(k,O.clone(A))}const R=_.morphAttributes;for(const k in R){const O=[],F=R[k];for(let G=0,b=F.length;G<b;G++)O.push(F[G].clone(A));this.morphAttributes[k]=O}this.morphTargetsRelative=_.morphTargetsRelative;const L=_.groups;for(let k=0,O=L.length;k<O;k++){const F=L[k];this.addGroup(F.start,F.count,F.materialIndex)}const D=_.boundingBox;D!==null&&(this.boundingBox=D.clone());const P=_.boundingSphere;return P!==null&&(this.boundingSphere=P.clone()),this.drawRange.start=_.drawRange.start,this.drawRange.count=_.drawRange.count,this.userData=_.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}},{"../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","../math/Box3.js":"dDJ5Q","./EventDispatcher.js":"d6Goy","./BufferAttribute.js":"7hhbt","../math/Sphere.js":"jgQJ1","./Object3D.js":"ibguD","../math/Matrix4.js":"64n8p","../math/Matrix3.js":"85Mgp","../math/MathUtils.js":"9o1gq","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7hhbt":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Float64BufferAttribute",()=>y),a.export(o,"Float32BufferAttribute",()=>S),a.export(o,"Float16BufferAttribute",()=>g),a.export(o,"Uint32BufferAttribute",()=>u),a.export(o,"Int32BufferAttribute",()=>p),a.export(o,"Uint16BufferAttribute",()=>d),a.export(o,"Int16BufferAttribute",()=>s),a.export(o,"Uint8ClampedBufferAttribute",()=>c),a.export(o,"Uint8BufferAttribute",()=>f),a.export(o,"Int8BufferAttribute",()=>h),a.export(o,"BufferAttribute",()=>l);var m=e("../math/Vector3.js"),M=e("../math/Vector2.js"),v=e("../math/MathUtils.js"),n=e("../constants.js"),i=e("../extras/DataUtils.js");const t=new m.Vector3,r=new M.Vector2;class l{constructor(x,_,A=!1){if(Array.isArray(x))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=x,this.itemSize=_,this.count=x!==void 0?x.length/_:0,this.normalized=A,this.usage=n.StaticDrawUsage,this.updateRange={offset:0,count:-1},this.gpuType=n.FloatType,this.version=0}onUploadCallback(){}set needsUpdate(x){x===!0&&this.version++}setUsage(x){return this.usage=x,this}copy(x){return this.name=x.name,this.array=new x.array.constructor(x.array),this.itemSize=x.itemSize,this.count=x.count,this.normalized=x.normalized,this.usage=x.usage,this.gpuType=x.gpuType,this}copyAt(x,_,A){x*=this.itemSize,A*=_.itemSize;for(let w=0,j=this.itemSize;w<j;w++)this.array[x+w]=_.array[A+w];return this}copyArray(x){return this.array.set(x),this}applyMatrix3(x){if(this.itemSize===2)for(let _=0,A=this.count;_<A;_++)r.fromBufferAttribute(this,_),r.applyMatrix3(x),this.setXY(_,r.x,r.y);else if(this.itemSize===3)for(let _=0,A=this.count;_<A;_++)t.fromBufferAttribute(this,_),t.applyMatrix3(x),this.setXYZ(_,t.x,t.y,t.z);return this}applyMatrix4(x){for(let _=0,A=this.count;_<A;_++)t.fromBufferAttribute(this,_),t.applyMatrix4(x),this.setXYZ(_,t.x,t.y,t.z);return this}applyNormalMatrix(x){for(let _=0,A=this.count;_<A;_++)t.fromBufferAttribute(this,_),t.applyNormalMatrix(x),this.setXYZ(_,t.x,t.y,t.z);return this}transformDirection(x){for(let _=0,A=this.count;_<A;_++)t.fromBufferAttribute(this,_),t.transformDirection(x),this.setXYZ(_,t.x,t.y,t.z);return this}set(x,_=0){return this.array.set(x,_),this}getX(x){let _=this.array[x*this.itemSize];return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setX(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize]=_,this}getY(x){let _=this.array[x*this.itemSize+1];return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setY(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+1]=_,this}getZ(x){let _=this.array[x*this.itemSize+2];return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setZ(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+2]=_,this}getW(x){let _=this.array[x*this.itemSize+3];return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setW(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+3]=_,this}setXY(x,_,A){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array)),this.array[x+0]=_,this.array[x+1]=A,this}setXYZ(x,_,A,w){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array),w=(0,v.normalize)(w,this.array)),this.array[x+0]=_,this.array[x+1]=A,this.array[x+2]=w,this}setXYZW(x,_,A,w,j){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array),w=(0,v.normalize)(w,this.array),j=(0,v.normalize)(j,this.array)),this.array[x+0]=_,this.array[x+1]=A,this.array[x+2]=w,this.array[x+3]=j,this}onUpload(x){return this.onUploadCallback=x,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const x={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(x.name=this.name),this.usage!==n.StaticDrawUsage&&(x.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(x.updateRange=this.updateRange),x}}class h extends l{constructor(x,_,A){super(new Int8Array(x),_,A)}}class f extends l{constructor(x,_,A){super(new Uint8Array(x),_,A)}}class c extends l{constructor(x,_,A){super(new Uint8ClampedArray(x),_,A)}}class s extends l{constructor(x,_,A){super(new Int16Array(x),_,A)}}class d extends l{constructor(x,_,A){super(new Uint16Array(x),_,A)}}class p extends l{constructor(x,_,A){super(new Int32Array(x),_,A)}}class u extends l{constructor(x,_,A){super(new Uint32Array(x),_,A)}}class g extends l{constructor(x,_,A){super(new Uint16Array(x),_,A);this.isFloat16BufferAttribute=!0}getX(x){let _=(0,i.fromHalfFloat)(this.array[x*this.itemSize]);return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setX(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize]=(0,i.toHalfFloat)(_),this}getY(x){let _=(0,i.fromHalfFloat)(this.array[x*this.itemSize+1]);return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setY(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+1]=(0,i.toHalfFloat)(_),this}getZ(x){let _=(0,i.fromHalfFloat)(this.array[x*this.itemSize+2]);return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setZ(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+2]=(0,i.toHalfFloat)(_),this}getW(x){let _=(0,i.fromHalfFloat)(this.array[x*this.itemSize+3]);return this.normalized&&(_=(0,v.denormalize)(_,this.array)),_}setW(x,_){return this.normalized&&(_=(0,v.normalize)(_,this.array)),this.array[x*this.itemSize+3]=(0,i.toHalfFloat)(_),this}setXY(x,_,A){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array)),this.array[x+0]=(0,i.toHalfFloat)(_),this.array[x+1]=(0,i.toHalfFloat)(A),this}setXYZ(x,_,A,w){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array),w=(0,v.normalize)(w,this.array)),this.array[x+0]=(0,i.toHalfFloat)(_),this.array[x+1]=(0,i.toHalfFloat)(A),this.array[x+2]=(0,i.toHalfFloat)(w),this}setXYZW(x,_,A,w,j){return x*=this.itemSize,this.normalized&&(_=(0,v.normalize)(_,this.array),A=(0,v.normalize)(A,this.array),w=(0,v.normalize)(w,this.array),j=(0,v.normalize)(j,this.array)),this.array[x+0]=(0,i.toHalfFloat)(_),this.array[x+1]=(0,i.toHalfFloat)(A),this.array[x+2]=(0,i.toHalfFloat)(w),this.array[x+3]=(0,i.toHalfFloat)(j),this}}class S extends l{constructor(x,_,A){super(new Float32Array(x),_,A)}}class y extends l{constructor(x,_,A){super(new Float64Array(x),_,A)}}},{"../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","../math/MathUtils.js":"9o1gq","../constants.js":"bqsVL","../extras/DataUtils.js":"k0z4p","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],k0z4p:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"toHalfFloat",()=>n),a.export(o,"fromHalfFloat",()=>i),a.export(o,"DataUtils",()=>t);var m=e("../math/MathUtils.js");const M=v();function v(){const r=new ArrayBuffer(4),l=new Float32Array(r),h=new Uint32Array(r),f=new Uint32Array(512),c=new Uint32Array(512);for(let u=0;u<256;++u){const g=u-127;g<-27?(f[u]=0,f[u|256]=32768,c[u]=24,c[u|256]=24):g<-14?(f[u]=1024>>-g-14,f[u|256]=1024>>-g-14|32768,c[u]=-g-1,c[u|256]=-g-1):g<=15?(f[u]=g+15<<10,f[u|256]=g+15<<10|32768,c[u]=13,c[u|256]=13):g<128?(f[u]=31744,f[u|256]=64512,c[u]=24,c[u|256]=24):(f[u]=31744,f[u|256]=64512,c[u]=13,c[u|256]=13)}const s=new Uint32Array(2048),d=new Uint32Array(64),p=new Uint32Array(64);for(let u=1;u<1024;++u){let g=u<<13,S=0;for(;(g&8388608)==0;)g<<=1,S-=8388608;g&=-8388609,S+=947912704,s[u]=g|S}for(let u=1024;u<2048;++u)s[u]=939524096+(u-1024<<13);for(let u=1;u<31;++u)d[u]=u<<23;d[31]=1199570944,d[32]=2147483648;for(let u=33;u<63;++u)d[u]=2147483648+(u-32<<23);d[63]=3347054592;for(let u=1;u<64;++u)u!==32&&(p[u]=1024);return{floatView:l,uint32View:h,baseTable:f,shiftTable:c,mantissaTable:s,exponentTable:d,offsetTable:p}}function n(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=(0,m.clamp)(r,-65504,65504),M.floatView[0]=r;const l=M.uint32View[0],h=l>>23&511;return M.baseTable[h]+((l&8388607)>>M.shiftTable[h])}function i(r){const l=r>>10;return M.uint32View[0]=M.mantissaTable[M.offsetTable[l]+(r&1023)]+M.exponentTable[l],M.floatView[0]}const t={toHalfFloat:n,fromHalfFloat:i}},{"../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5eHyr":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"BoxGeometry",()=>n);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js");class n extends m.BufferGeometry{constructor(t=1,r=1,l=1,h=1,f=1,c=1){super();this.type="BoxGeometry",this.parameters={width:t,height:r,depth:l,widthSegments:h,heightSegments:f,depthSegments:c};const s=this;h=Math.floor(h),f=Math.floor(f),c=Math.floor(c);const d=[],p=[],u=[],g=[];let S=0,y=0;T("z","y","x",-1,-1,l,r,t,c,f,0),T("z","y","x",1,-1,l,r,-t,c,f,1),T("x","z","y",1,1,t,l,r,h,c,2),T("x","z","y",1,-1,t,l,-r,h,c,3),T("x","y","z",1,-1,t,r,l,h,f,4),T("x","y","z",-1,-1,t,r,-l,h,f,5),this.setIndex(d),this.setAttribute("position",new M.Float32BufferAttribute(p,3)),this.setAttribute("normal",new M.Float32BufferAttribute(u,3)),this.setAttribute("uv",new M.Float32BufferAttribute(g,2));function T(x,_,A,w,j,R,L,D,P,k,O){const F=R/P,G=L/k,b=R/2,C=L/2,I=D/2,B=P+1,H=k+1;let X=0,Y=0;const Z=new v.Vector3;for(let Q=0;Q<H;Q++){const ne=Q*G-C;for(let ge=0;ge<B;ge++){const me=ge*F-b;Z[x]=me*w,Z[_]=ne*j,Z[A]=I,p.push(Z.x,Z.y,Z.z),Z[x]=0,Z[_]=0,Z[A]=D>0?1:-1,u.push(Z.x,Z.y,Z.z),g.push(ge/P),g.push(1-Q/k),X+=1}}for(let Q=0;Q<k;Q++)for(let ne=0;ne<P;ne++){const ge=S+ne+B*Q,me=S+ne+B*(Q+1),_e=S+(ne+1)+B*(Q+1),le=S+(ne+1)+B*Q;d.push(ge,me,le),d.push(me,_e,le),Y+=6}s.addGroup(y,Y,O),y+=Y,S+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bnM8h:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShaderMaterial",()=>r);var m=e("./Material.js"),M=e("../renderers/shaders/UniformsUtils.js"),v=e("../renderers/shaders/ShaderChunk/default_vertex.glsl.js"),n=a.interopDefault(v),i=e("../renderers/shaders/ShaderChunk/default_fragment.glsl.js"),t=a.interopDefault(i);class r extends m.Material{constructor(h){super();this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=n.default,this.fragmentShader=t.default,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,h!==void 0&&this.setValues(h)}copy(h){return super.copy(h),this.fragmentShader=h.fragmentShader,this.vertexShader=h.vertexShader,this.uniforms=(0,M.cloneUniforms)(h.uniforms),this.uniformsGroups=(0,M.cloneUniformsGroups)(h.uniformsGroups),this.defines=Object.assign({},h.defines),this.wireframe=h.wireframe,this.wireframeLinewidth=h.wireframeLinewidth,this.fog=h.fog,this.lights=h.lights,this.clipping=h.clipping,this.extensions=Object.assign({},h.extensions),this.glslVersion=h.glslVersion,this}toJSON(h){const f=super.toJSON(h);f.glslVersion=this.glslVersion,f.uniforms={};for(const s in this.uniforms){const p=this.uniforms[s].value;p&&p.isTexture?f.uniforms[s]={type:"t",value:p.toJSON(h).uuid}:p&&p.isColor?f.uniforms[s]={type:"c",value:p.getHex()}:p&&p.isVector2?f.uniforms[s]={type:"v2",value:p.toArray()}:p&&p.isVector3?f.uniforms[s]={type:"v3",value:p.toArray()}:p&&p.isVector4?f.uniforms[s]={type:"v4",value:p.toArray()}:p&&p.isMatrix3?f.uniforms[s]={type:"m3",value:p.toArray()}:p&&p.isMatrix4?f.uniforms[s]={type:"m4",value:p.toArray()}:f.uniforms[s]={value:p}}Object.keys(this.defines).length>0&&(f.defines=this.defines),f.vertexShader=this.vertexShader,f.fragmentShader=this.fragmentShader,f.lights=this.lights,f.clipping=this.clipping;const c={};for(const s in this.extensions)this.extensions[s]===!0&&(c[s]=!0);return Object.keys(c).length>0&&(f.extensions=c),f}}},{"./Material.js":"l4ClZ","../renderers/shaders/UniformsUtils.js":"4tBjA","../renderers/shaders/ShaderChunk/default_vertex.glsl.js":"zYgTB","../renderers/shaders/ShaderChunk/default_fragment.glsl.js":"8y3Pa","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4tBjA":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"cloneUniforms",()=>M),a.export(o,"mergeUniforms",()=>v),a.export(o,"cloneUniformsGroups",()=>n),a.export(o,"getUnlitUniformColorSpace",()=>i),a.export(o,"UniformsUtils",()=>t);var m=e("../../constants.js");function M(r){const l={};for(const h in r){l[h]={};for(const f in r[h]){const c=r[h][f];c&&(c.isColor||c.isMatrix3||c.isMatrix4||c.isVector2||c.isVector3||c.isVector4||c.isTexture||c.isQuaternion)?c.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),l[h][f]=null):l[h][f]=c.clone():Array.isArray(c)?l[h][f]=c.slice():l[h][f]=c}}return l}function v(r){const l={};for(let h=0;h<r.length;h++){const f=M(r[h]);for(const c in f)l[c]=f[c]}return l}function n(r){const l=[];for(let h=0;h<r.length;h++)l.push(r[h].clone());return l}function i(r){return r.getRenderTarget()===null?r.outputColorSpace:m.LinearSRGBColorSpace}const t={clone:M,merge:v}},{"../../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],zYgTB:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8y3Pa":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bLWI2:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubeCamera",()=>t);var m=e("../constants.js"),M=e("../core/Object3D.js"),v=e("./PerspectiveCamera.js");const n=-90,i=1;class t extends M.Object3D{constructor(l,h,f){super();this.type="CubeCamera",this.renderTarget=f,this.coordinateSystem=null;const c=new v.PerspectiveCamera(n,i,l,h);c.layers=this.layers,this.add(c);const s=new v.PerspectiveCamera(n,i,l,h);s.layers=this.layers,this.add(s);const d=new v.PerspectiveCamera(n,i,l,h);d.layers=this.layers,this.add(d);const p=new v.PerspectiveCamera(n,i,l,h);p.layers=this.layers,this.add(p);const u=new v.PerspectiveCamera(n,i,l,h);u.layers=this.layers,this.add(u);const g=new v.PerspectiveCamera(n,i,l,h);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const l=this.coordinateSystem,h=this.children.concat(),[f,c,s,d,p,u]=h;for(const g of h)this.remove(g);if(l===m.WebGLCoordinateSystem)f.up.set(0,1,0),f.lookAt(1,0,0),c.up.set(0,1,0),c.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(l===m.WebGPUCoordinateSystem)f.up.set(0,-1,0),f.lookAt(-1,0,0),c.up.set(0,-1,0),c.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+l);for(const g of h)this.add(g),g.updateMatrixWorld()}update(l,h){this.parent===null&&this.updateMatrixWorld();const f=this.renderTarget;this.coordinateSystem!==l.coordinateSystem&&(this.coordinateSystem=l.coordinateSystem,this.updateCoordinateSystem());const[c,s,d,p,u,g]=this.children,S=l.getRenderTarget(),y=l.toneMapping,T=l.xr.enabled;l.toneMapping=m.NoToneMapping,l.xr.enabled=!1;const x=f.texture.generateMipmaps;f.texture.generateMipmaps=!1,l.setRenderTarget(f,0),l.render(h,c),l.setRenderTarget(f,1),l.render(h,s),l.setRenderTarget(f,2),l.render(h,d),l.setRenderTarget(f,3),l.render(h,p),l.setRenderTarget(f,4),l.render(h,u),f.texture.generateMipmaps=x,l.setRenderTarget(f,5),l.render(h,g),l.setRenderTarget(S),l.toneMapping=y,l.xr.enabled=T,f.texture.needsPMREMUpdate=!0}}},{"../constants.js":"bqsVL","../core/Object3D.js":"ibguD","./PerspectiveCamera.js":"bazbq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bazbq:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PerspectiveCamera",()=>v);var m=e("./Camera.js"),M=e("../math/MathUtils.js");class v extends m.Camera{constructor(i=50,t=1,r=.1,l=2e3){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=i,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(i,t){return super.copy(i,t),this.fov=i.fov,this.zoom=i.zoom,this.near=i.near,this.far=i.far,this.focus=i.focus,this.aspect=i.aspect,this.view=i.view===null?null:Object.assign({},i.view),this.filmGauge=i.filmGauge,this.filmOffset=i.filmOffset,this}setFocalLength(i){const t=.5*this.getFilmHeight()/i;this.fov=M.RAD2DEG*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const i=Math.tan(M.DEG2RAD*.5*this.fov);return .5*this.getFilmHeight()/i}getEffectiveFOV(){return M.RAD2DEG*2*Math.atan(Math.tan(M.DEG2RAD*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(i,t,r,l,h,f){this.aspect=i/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=i,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=l,this.view.width=h,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const i=this.near;let t=i*Math.tan(M.DEG2RAD*.5*this.fov)/this.zoom,r=2*t,l=this.aspect*r,h=-.5*l;const f=this.view;if(this.view!==null&&this.view.enabled){const s=f.fullWidth,d=f.fullHeight;h+=f.offsetX*l/s,t-=f.offsetY*r/d,l*=f.width/s,r*=f.height/d}const c=this.filmOffset;c!==0&&(h+=i*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(h,h+l,t,t-r,i,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(i){const t=super.toJSON(i);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}},{"./Camera.js":"2L3jQ","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2L3jQ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Camera",()=>n);var m=e("../constants.js"),M=e("../math/Matrix4.js"),v=e("../core/Object3D.js");class n extends v.Object3D{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new M.Matrix4,this.projectionMatrix=new M.Matrix4,this.projectionMatrixInverse=new M.Matrix4,this.coordinateSystem=m.WebGLCoordinateSystem}copy(t,r){return super.copy(t,r),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const r=this.matrixWorld.elements;return t.set(-r[8],-r[9],-r[10]).normalize()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,r){super.updateWorldMatrix(t,r),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}},{"../constants.js":"bqsVL","../math/Matrix4.js":"64n8p","../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jcedY:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubeTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i,t,r,l,h,f,c,s,d,p){i=i!==void 0?i:[],t=t!==void 0?t:M.CubeReflectionMapping;super(i,t,r,l,h,f,c,s,d,p);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(i){this.image=i}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9OF3S":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLRenderer",()=>Y);var m=e("../constants.js"),M=e("../math/Color.js"),v=e("../math/Frustum.js"),n=e("../math/Matrix4.js"),i=e("../math/Vector2.js"),t=e("../math/Vector3.js"),r=e("../math/Vector4.js"),l=e("../math/MathUtils.js"),h=e("./webgl/WebGLAnimation.js"),f=e("./webgl/WebGLAttributes.js"),c=e("./webgl/WebGLBackground.js"),s=e("./webgl/WebGLBindingStates.js"),d=e("./webgl/WebGLBufferRenderer.js"),p=e("./webgl/WebGLCapabilities.js"),u=e("./webgl/WebGLClipping.js"),g=e("./webgl/WebGLCubeMaps.js"),S=e("./webgl/WebGLCubeUVMaps.js"),y=e("./webgl/WebGLExtensions.js"),T=e("./webgl/WebGLGeometries.js"),x=e("./webgl/WebGLIndexedBufferRenderer.js"),_=e("./webgl/WebGLInfo.js"),A=e("./webgl/WebGLMorphtargets.js"),w=e("./webgl/WebGLObjects.js"),j=e("./webgl/WebGLPrograms.js"),R=e("./webgl/WebGLProperties.js"),L=e("./webgl/WebGLRenderLists.js"),D=e("./webgl/WebGLRenderStates.js"),P=e("./WebGLRenderTarget.js"),k=e("./webgl/WebGLShadowMap.js"),O=e("./webgl/WebGLState.js"),F=e("./webgl/WebGLTextures.js"),G=e("./webgl/WebGLUniforms.js"),b=e("./webgl/WebGLUtils.js"),C=e("./webxr/WebXRManager.js"),I=e("./webgl/WebGLMaterials.js"),B=e("./webgl/WebGLUniformsGroups.js"),H=e("../utils.js");function X(){const Z=(0,H.createElementNS)("canvas");return Z.style.display="block",Z}class Y{constructor(Q={}){const{canvas:ne=X(),context:ge=null,depth:me=!0,stencil:_e=!0,alpha:le=!1,antialias:ee=!1,premultipliedAlpha:je=!0,preserveDrawingBuffer:z=!1,powerPreference:$="default",failIfMajorPerformanceCaveat:se=!1}=Q;this.isWebGLRenderer=!0;let ie;ge!==null?ie=ge.getContextAttributes().alpha:ie=le;const te=new Uint32Array(4),q=new Int32Array(4);let ce=null,xe=null;const we=[],Ee=[];this.domElement=ne,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=m.SRGBColorSpace,this.useLegacyLights=!0,this.toneMapping=m.NoToneMapping,this.toneMappingExposure=1;const ae=this;let be=!1,Se=0,Ae=0,Ce=null,Be=-1,U=null;const E=new r.Vector4,V=new r.Vector4;let re=null;const ue=new M.Color(0);let J=0,fe=ne.width,Te=ne.height,pe=1,Ie=null,ke=null;const De=new r.Vector4(0,0,fe,Te),Ge=new r.Vector4(0,0,fe,Te);let Ue=!1;const K=new v.Frustum;let Le=!1,Re=!1,Pe=null;const ve=new n.Matrix4,Ne=new i.Vector2,Oe=new t.Vector3,Ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function dt(){return Ce===null?pe:1}let he=ge;function ot(W,de){for(let ye=0;ye<W.length;ye++){const oe=W[ye],Me=ne.getContext(oe,de);if(Me!==null)return Me}return null}try{const W={alpha:!0,depth:me,stencil:_e,antialias:ee,premultipliedAlpha:je,preserveDrawingBuffer:z,powerPreference:$,failIfMajorPerformanceCaveat:se};if("setAttribute"in ne&&ne.setAttribute("data-engine",`three.js r${m.REVISION}`),ne.addEventListener("webglcontextlost",kt,!1),ne.addEventListener("webglcontextrestored",Ot,!1),ne.addEventListener("webglcontextcreationerror",Vt,!1),he===null){const de=["webgl2","webgl","experimental-webgl"];if(ae.isWebGL1Renderer===!0&&de.shift(),he=ot(de,W),he===null)throw ot(de)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext!="undefined"&&he instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),he.getShaderPrecisionFormat===void 0&&(he.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(W){throw console.error("THREE.WebGLRenderer: "+W.message),W}let Qe,$e,Ze,lt,qe,et,bt,Mt,Tt,Rt,St,gt,Pt,jt,Et,ft,ct,pt,Ut,Bt,Nt,mt,vt,Ct;function Gt(){Qe=new y.WebGLExtensions(he),$e=new p.WebGLCapabilities(he,Qe,Q),Qe.init($e),mt=new b.WebGLUtils(he,Qe,$e),Ze=new O.WebGLState(he,Qe,$e),lt=new _.WebGLInfo(he),qe=new R.WebGLProperties,et=new F.WebGLTextures(he,Qe,Ze,qe,$e,mt,lt),bt=new g.WebGLCubeMaps(ae),Mt=new S.WebGLCubeUVMaps(ae),Tt=new f.WebGLAttributes(he,$e),vt=new s.WebGLBindingStates(he,Qe,Tt,$e),Rt=new T.WebGLGeometries(he,Tt,lt,vt),St=new w.WebGLObjects(he,Rt,Tt,lt),Ut=new A.WebGLMorphtargets(he,$e,et),ft=new u.WebGLClipping(qe),gt=new j.WebGLPrograms(ae,bt,Mt,Qe,$e,vt,ft),Pt=new I.WebGLMaterials(ae,qe),jt=new L.WebGLRenderLists,Et=new D.WebGLRenderStates(Qe,$e),pt=new c.WebGLBackground(ae,bt,Mt,Ze,St,ie,je),ct=new k.WebGLShadowMap(ae,St,$e),Ct=new B.WebGLUniformsGroups(he,lt,$e,Ze),Bt=new d.WebGLBufferRenderer(he,Qe,lt,$e),Nt=new x.WebGLIndexedBufferRenderer(he,Qe,lt,$e),lt.programs=gt.programs,ae.capabilities=$e,ae.extensions=Qe,ae.properties=qe,ae.renderLists=jt,ae.shadowMap=ct,ae.state=Ze,ae.info=lt}Gt();const it=new C.WebXRManager(ae,he);this.xr=it,this.getContext=function(){return he},this.getContextAttributes=function(){return he.getContextAttributes()},this.forceContextLoss=function(){const W=Qe.get("WEBGL_lose_context");W&&W.loseContext()},this.forceContextRestore=function(){const W=Qe.get("WEBGL_lose_context");W&&W.restoreContext()},this.getPixelRatio=function(){return pe},this.setPixelRatio=function(W){W!==void 0&&(pe=W,this.setSize(fe,Te,!1))},this.getSize=function(W){return W.set(fe,Te)},this.setSize=function(W,de,ye=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}fe=W,Te=de,ne.width=Math.floor(W*pe),ne.height=Math.floor(de*pe),ye===!0&&(ne.style.width=W+"px",ne.style.height=de+"px"),this.setViewport(0,0,W,de)},this.getDrawingBufferSize=function(W){return W.set(fe*pe,Te*pe).floor()},this.setDrawingBufferSize=function(W,de,ye){fe=W,Te=de,pe=ye,ne.width=Math.floor(W*ye),ne.height=Math.floor(de*ye),this.setViewport(0,0,W,de)},this.getCurrentViewport=function(W){return W.copy(E)},this.getViewport=function(W){return W.copy(De)},this.setViewport=function(W,de,ye,oe){W.isVector4?De.set(W.x,W.y,W.z,W.w):De.set(W,de,ye,oe),Ze.viewport(E.copy(De).multiplyScalar(pe).floor())},this.getScissor=function(W){return W.copy(Ge)},this.setScissor=function(W,de,ye,oe){W.isVector4?Ge.set(W.x,W.y,W.z,W.w):Ge.set(W,de,ye,oe),Ze.scissor(V.copy(Ge).multiplyScalar(pe).floor())},this.getScissorTest=function(){return Ue},this.setScissorTest=function(W){Ze.setScissorTest(Ue=W)},this.setOpaqueSort=function(W){Ie=W},this.setTransparentSort=function(W){ke=W},this.getClearColor=function(W){return W.copy(pt.getClearColor())},this.setClearColor=function(){pt.setClearColor.apply(pt,arguments)},this.getClearAlpha=function(){return pt.getClearAlpha()},this.setClearAlpha=function(){pt.setClearAlpha.apply(pt,arguments)},this.clear=function(W=!0,de=!0,ye=!0){let oe=0;if(W){let Me=!1;if(Ce!==null){const Fe=Ce.texture.format;Me=Fe===m.RGBAIntegerFormat||Fe===m.RGIntegerFormat||Fe===m.RedIntegerFormat}if(Me){const Fe=Ce.texture.type,Ve=Fe===m.UnsignedByteType||Fe===m.UnsignedIntType||Fe===m.UnsignedShortType||Fe===m.UnsignedInt248Type||Fe===m.UnsignedShort4444Type||Fe===m.UnsignedShort5551Type,He=pt.getClearColor(),ze=pt.getClearAlpha(),Xe=He.r,Je=He.g,We=He.b;Ve?(te[0]=Xe,te[1]=Je,te[2]=We,te[3]=ze,he.clearBufferuiv(he.COLOR,0,te)):(q[0]=Xe,q[1]=Je,q[2]=We,q[3]=ze,he.clearBufferiv(he.COLOR,0,q))}else oe|=he.COLOR_BUFFER_BIT}de&&(oe|=he.DEPTH_BUFFER_BIT),ye&&(oe|=he.STENCIL_BUFFER_BIT),he.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){ne.removeEventListener("webglcontextlost",kt,!1),ne.removeEventListener("webglcontextrestored",Ot,!1),ne.removeEventListener("webglcontextcreationerror",Vt,!1),jt.dispose(),Et.dispose(),qe.dispose(),bt.dispose(),Mt.dispose(),St.dispose(),vt.dispose(),Ct.dispose(),gt.dispose(),it.dispose(),it.removeEventListener("sessionstart",zt),it.removeEventListener("sessionend",Jt),Pe&&(Pe.dispose(),Pe=null),xt.stop()};function kt(W){W.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),be=!0}function Ot(){console.log("THREE.WebGLRenderer: Context Restored."),be=!1;const W=lt.autoReset,de=ct.enabled,ye=ct.autoUpdate,oe=ct.needsUpdate,Me=ct.type;Gt(),lt.autoReset=W,ct.enabled=de,ct.autoUpdate=ye,ct.needsUpdate=oe,ct.type=Me}function Vt(W){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",W.statusMessage)}function Ht(W){const de=W.target;de.removeEventListener("dispose",Ht),Qt(de)}function Qt(W){$t(W),qe.remove(W)}function $t(W){const de=qe.get(W).programs;de!==void 0&&(de.forEach(function(ye){gt.releaseProgram(ye)}),W.isShaderMaterial&&gt.releaseShaderCache(W))}this.renderBufferDirect=function(W,de,ye,oe,Me,Fe){de===null&&(de=Ke);const Ve=Me.isMesh&&Me.matrixWorld.determinant()<0,He=tr(W,de,ye,oe,Me);Ze.setMaterial(oe,Ve);let ze=ye.index,Xe=1;oe.wireframe===!0&&(ze=Rt.getWireframeAttribute(ye),Xe=2);const Je=ye.drawRange,We=ye.attributes.position;let tt=Je.start*Xe,rt=(Je.start+Je.count)*Xe;Fe!==null&&(tt=Math.max(tt,Fe.start*Xe),rt=Math.min(rt,(Fe.start+Fe.count)*Xe)),ze!==null?(tt=Math.max(tt,0),rt=Math.min(rt,ze.count)):We!=null&&(tt=Math.max(tt,0),rt=Math.min(rt,We.count));const ht=rt-tt;if(ht<0||ht===1/0)return;vt.setup(Me,oe,He,ye,ze);let _t,st=Bt;if(ze!==null&&(_t=Tt.get(ze),st=Nt,st.setIndex(_t)),Me.isMesh)oe.wireframe===!0?(Ze.setLineWidth(oe.wireframeLinewidth*dt()),st.setMode(he.LINES)):st.setMode(he.TRIANGLES);else if(Me.isLine){let Ye=oe.linewidth;Ye===void 0&&(Ye=1),Ze.setLineWidth(Ye*dt()),Me.isLineSegments?st.setMode(he.LINES):Me.isLineLoop?st.setMode(he.LINE_LOOP):st.setMode(he.LINE_STRIP)}else Me.isPoints?st.setMode(he.POINTS):Me.isSprite&&st.setMode(he.TRIANGLES);if(Me.isInstancedMesh)st.renderInstances(tt,ht,Me.count);else if(ye.isInstancedBufferGeometry){const Ye=ye._maxInstanceCount!==void 0?ye._maxInstanceCount:1/0,Dt=Math.min(ye.instanceCount,Ye);st.renderInstances(tt,ht,Dt)}else st.render(tt,ht)},this.compile=function(W,de){function ye(oe,Me,Fe){oe.transparent===!0&&oe.side===m.DoubleSide&&oe.forceSinglePass===!1?(oe.side=m.BackSide,oe.needsUpdate=!0,Lt(oe,Me,Fe),oe.side=m.FrontSide,oe.needsUpdate=!0,Lt(oe,Me,Fe),oe.side=m.DoubleSide):Lt(oe,Me,Fe)}xe=Et.get(W),xe.init(),Ee.push(xe),W.traverseVisible(function(oe){oe.isLight&&oe.layers.test(de.layers)&&(xe.pushLight(oe),oe.castShadow&&xe.pushShadow(oe))}),xe.setupLights(ae.useLegacyLights),W.traverse(function(oe){const Me=oe.material;if(Me)if(Array.isArray(Me))for(let Fe=0;Fe<Me.length;Fe++){const Ve=Me[Fe];ye(Ve,W,oe)}else ye(Me,W,oe)}),Ee.pop(),xe=null};let It=null;function qt(W){It&&It(W)}function zt(){xt.stop()}function Jt(){xt.start()}const xt=new h.WebGLAnimation;xt.setAnimationLoop(qt),typeof self!="undefined"&&xt.setContext(self),this.setAnimationLoop=function(W){It=W,it.setAnimationLoop(W),W===null?xt.stop():xt.start()},it.addEventListener("sessionstart",zt),it.addEventListener("sessionend",Jt),this.render=function(W,de){if(de!==void 0&&de.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(be===!0)return;W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),de.parent===null&&de.matrixWorldAutoUpdate===!0&&de.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(de),de=it.getCamera()),W.isScene===!0&&W.onBeforeRender(ae,W,de,Ce),xe=Et.get(W,Ee.length),xe.init(),Ee.push(xe),ve.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),K.setFromProjectionMatrix(ve),Re=this.localClippingEnabled,Le=ft.init(this.clippingPlanes,Re),ce=jt.get(W,we.length),ce.init(),we.push(ce),Wt(W,de,0,ae.sortObjects),ce.finish(),ae.sortObjects===!0&&ce.sort(Ie,ke),this.info.render.frame++,Le===!0&&ft.beginShadows();const ye=xe.state.shadowsArray;if(ct.render(ye,W,de),Le===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset(),pt.render(ce,W),xe.setupLights(ae.useLegacyLights),de.isArrayCamera){const oe=de.cameras;for(let Me=0,Fe=oe.length;Me<Fe;Me++){const Ve=oe[Me];Xt(ce,W,Ve,Ve.viewport)}}else Xt(ce,W,de);Ce!==null&&(et.updateMultisampleRenderTarget(Ce),et.updateRenderTargetMipmap(Ce)),W.isScene===!0&&W.onAfterRender(ae,W,de),vt.resetDefaultState(),Be=-1,U=null,Ee.pop(),Ee.length>0?xe=Ee[Ee.length-1]:xe=null,we.pop(),we.length>0?ce=we[we.length-1]:ce=null};function Wt(W,de,ye,oe){if(W.visible===!1)return;if(W.layers.test(de.layers)){if(W.isGroup)ye=W.renderOrder;else if(W.isLOD)W.autoUpdate===!0&&W.update(de);else if(W.isLight)xe.pushLight(W),W.castShadow&&xe.pushShadow(W);else if(W.isSprite){if(!W.frustumCulled||K.intersectsSprite(W)){oe&&Oe.setFromMatrixPosition(W.matrixWorld).applyMatrix4(ve);const Ve=St.update(W),He=W.material;He.visible&&ce.push(W,Ve,He,ye,Oe.z,null)}}else if((W.isMesh||W.isLine||W.isPoints)&&(!W.frustumCulled||K.intersectsObject(W))){const Ve=St.update(W),He=W.material;if(oe&&(W.boundingSphere!==void 0?(W.boundingSphere===null&&W.computeBoundingSphere(),Oe.copy(W.boundingSphere.center)):(Ve.boundingSphere===null&&Ve.computeBoundingSphere(),Oe.copy(Ve.boundingSphere.center)),Oe.applyMatrix4(W.matrixWorld).applyMatrix4(ve)),Array.isArray(He)){const ze=Ve.groups;for(let Xe=0,Je=ze.length;Xe<Je;Xe++){const We=ze[Xe],tt=He[We.materialIndex];tt&&tt.visible&&ce.push(W,Ve,tt,ye,Oe.z,We)}}else He.visible&&ce.push(W,Ve,He,ye,Oe.z,null)}}const Fe=W.children;for(let Ve=0,He=Fe.length;Ve<He;Ve++)Wt(Fe[Ve],de,ye,oe)}function Xt(W,de,ye,oe){const Me=W.opaque,Fe=W.transmissive,Ve=W.transparent;xe.setupLightsView(ye),Le===!0&&ft.setGlobalState(ae.clippingPlanes,ye),Fe.length>0&&er(Me,Fe,de,ye),oe&&Ze.viewport(E.copy(oe)),Me.length>0&&wt(Me,de,ye),Fe.length>0&&wt(Fe,de,ye),Ve.length>0&&wt(Ve,de,ye),Ze.buffers.depth.setTest(!0),Ze.buffers.depth.setMask(!0),Ze.buffers.color.setMask(!0),Ze.setPolygonOffset(!1)}function er(W,de,ye,oe){const Me=$e.isWebGL2;Pe===null&&(Pe=new P.WebGLRenderTarget(1,1,{generateMipmaps:!0,type:Qe.has("EXT_color_buffer_half_float")?m.HalfFloatType:m.UnsignedByteType,minFilter:m.LinearMipmapLinearFilter,samples:Me?4:0})),ae.getDrawingBufferSize(Ne),Me?Pe.setSize(Ne.x,Ne.y):Pe.setSize((0,l.floorPowerOfTwo)(Ne.x),(0,l.floorPowerOfTwo)(Ne.y));const Fe=ae.getRenderTarget();ae.setRenderTarget(Pe),ae.getClearColor(ue),J=ae.getClearAlpha(),J<1&&ae.setClearColor(16777215,.5),ae.clear();const Ve=ae.toneMapping;ae.toneMapping=m.NoToneMapping,wt(W,ye,oe),et.updateMultisampleRenderTarget(Pe),et.updateRenderTargetMipmap(Pe);let He=!1;for(let ze=0,Xe=de.length;ze<Xe;ze++){const Je=de[ze],We=Je.object,tt=Je.geometry,rt=Je.material,ht=Je.group;if(rt.side===m.DoubleSide&&We.layers.test(oe.layers)){const _t=rt.side;rt.side=m.BackSide,rt.needsUpdate=!0,Yt(We,ye,oe,tt,rt,ht),rt.side=_t,rt.needsUpdate=!0,He=!0}}He===!0&&(et.updateMultisampleRenderTarget(Pe),et.updateRenderTargetMipmap(Pe)),ae.setRenderTarget(Fe),ae.setClearColor(ue,J),ae.toneMapping=Ve}function wt(W,de,ye){const oe=de.isScene===!0?de.overrideMaterial:null;for(let Me=0,Fe=W.length;Me<Fe;Me++){const Ve=W[Me],He=Ve.object,ze=Ve.geometry,Xe=oe===null?Ve.material:oe,Je=Ve.group;He.layers.test(ye.layers)&&Yt(He,de,ye,ze,Xe,Je)}}function Yt(W,de,ye,oe,Me,Fe){W.onBeforeRender(ae,de,ye,oe,Me,Fe),W.modelViewMatrix.multiplyMatrices(ye.matrixWorldInverse,W.matrixWorld),W.normalMatrix.getNormalMatrix(W.modelViewMatrix),Me.onBeforeRender(ae,de,ye,oe,W,Fe),Me.transparent===!0&&Me.side===m.DoubleSide&&Me.forceSinglePass===!1?(Me.side=m.BackSide,Me.needsUpdate=!0,ae.renderBufferDirect(ye,de,oe,Me,W,Fe),Me.side=m.FrontSide,Me.needsUpdate=!0,ae.renderBufferDirect(ye,de,oe,Me,W,Fe),Me.side=m.DoubleSide):ae.renderBufferDirect(ye,de,oe,Me,W,Fe),W.onAfterRender(ae,de,ye,oe,Me,Fe)}function Lt(W,de,ye){de.isScene!==!0&&(de=Ke);const oe=qe.get(W),Me=xe.state.lights,Fe=xe.state.shadowsArray,Ve=Me.state.version,He=gt.getParameters(W,Me.state,Fe,de,ye),ze=gt.getProgramCacheKey(He);let Xe=oe.programs;oe.environment=W.isMeshStandardMaterial?de.environment:null,oe.fog=de.fog,oe.envMap=(W.isMeshStandardMaterial?Mt:bt).get(W.envMap||oe.environment),Xe===void 0&&(W.addEventListener("dispose",Ht),Xe=new Map,oe.programs=Xe);let Je=Xe.get(ze);if(Je!==void 0){if(oe.currentProgram===Je&&oe.lightsStateVersion===Ve)return Zt(W,He),Je}else He.uniforms=gt.getUniforms(W),W.onBuild(ye,He,ae),W.onBeforeCompile(He,ae),Je=gt.acquireProgram(He,ze),Xe.set(ze,Je),oe.uniforms=He.uniforms;const We=oe.uniforms;(!W.isShaderMaterial&&!W.isRawShaderMaterial||W.clipping===!0)&&(We.clippingPlanes=ft.uniform),Zt(W,He),oe.needsLights=sr(W),oe.lightsStateVersion=Ve,oe.needsLights&&(We.ambientLightColor.value=Me.state.ambient,We.lightProbe.value=Me.state.probe,We.directionalLights.value=Me.state.directional,We.directionalLightShadows.value=Me.state.directionalShadow,We.spotLights.value=Me.state.spot,We.spotLightShadows.value=Me.state.spotShadow,We.rectAreaLights.value=Me.state.rectArea,We.ltc_1.value=Me.state.rectAreaLTC1,We.ltc_2.value=Me.state.rectAreaLTC2,We.pointLights.value=Me.state.point,We.pointLightShadows.value=Me.state.pointShadow,We.hemisphereLights.value=Me.state.hemi,We.directionalShadowMap.value=Me.state.directionalShadowMap,We.directionalShadowMatrix.value=Me.state.directionalShadowMatrix,We.spotShadowMap.value=Me.state.spotShadowMap,We.spotLightMatrix.value=Me.state.spotLightMatrix,We.spotLightMap.value=Me.state.spotLightMap,We.pointShadowMap.value=Me.state.pointShadowMap,We.pointShadowMatrix.value=Me.state.pointShadowMatrix);const tt=Je.getUniforms(),rt=G.WebGLUniforms.seqWithValue(tt.seq,We);return oe.currentProgram=Je,oe.uniformsList=rt,Je}function Zt(W,de){const ye=qe.get(W);ye.outputColorSpace=de.outputColorSpace,ye.instancing=de.instancing,ye.skinning=de.skinning,ye.morphTargets=de.morphTargets,ye.morphNormals=de.morphNormals,ye.morphColors=de.morphColors,ye.morphTargetsCount=de.morphTargetsCount,ye.numClippingPlanes=de.numClippingPlanes,ye.numIntersection=de.numClipIntersection,ye.vertexAlphas=de.vertexAlphas,ye.vertexTangents=de.vertexTangents,ye.toneMapping=de.toneMapping}function tr(W,de,ye,oe,Me){de.isScene!==!0&&(de=Ke),et.resetTextureUnits();const Fe=de.fog,Ve=oe.isMeshStandardMaterial?de.environment:null,He=Ce===null?ae.outputColorSpace:Ce.isXRRenderTarget===!0?Ce.texture.colorSpace:m.LinearSRGBColorSpace,ze=(oe.isMeshStandardMaterial?Mt:bt).get(oe.envMap||Ve),Xe=oe.vertexColors===!0&&!!ye.attributes.color&&ye.attributes.color.itemSize===4,Je=!!ye.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),We=!!ye.morphAttributes.position,tt=!!ye.morphAttributes.normal,rt=!!ye.morphAttributes.color,ht=oe.toneMapped?ae.toneMapping:m.NoToneMapping,_t=ye.morphAttributes.position||ye.morphAttributes.normal||ye.morphAttributes.color,st=_t!==void 0?_t.length:0,Ye=qe.get(oe),Dt=xe.state.lights;if(Le===!0&&(Re===!0||W!==U)){const ut=W===U&&oe.id===Be;ft.setState(oe,W,ut)}let nt=!1;oe.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==Dt.state.version||Ye.outputColorSpace!==He||Me.isInstancedMesh&&Ye.instancing===!1||!Me.isInstancedMesh&&Ye.instancing===!0||Me.isSkinnedMesh&&Ye.skinning===!1||!Me.isSkinnedMesh&&Ye.skinning===!0||Ye.envMap!==ze||oe.fog===!0&&Ye.fog!==Fe||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==ft.numPlanes||Ye.numIntersection!==ft.numIntersection)||Ye.vertexAlphas!==Xe||Ye.vertexTangents!==Je||Ye.morphTargets!==We||Ye.morphNormals!==tt||Ye.morphColors!==rt||Ye.toneMapping!==ht||$e.isWebGL2===!0&&Ye.morphTargetsCount!==st)&&(nt=!0):(nt=!0,Ye.__version=oe.version);let yt=Ye.currentProgram;nt===!0&&(yt=Lt(oe,de,Me));let Kt=!1,Ft=!1,nr=!1;const at=yt.getUniforms(),At=Ye.uniforms;if(Ze.useProgram(yt.program)&&(Kt=!0,Ft=!0,nr=!0),oe.id!==Be&&(Be=oe.id,Ft=!0),Kt||U!==W){if(at.setValue(he,"projectionMatrix",W.projectionMatrix),$e.logarithmicDepthBuffer&&at.setValue(he,"logDepthBufFC",2/(Math.log(W.far+1)/Math.LN2)),U!==W&&(U=W,Ft=!0,nr=!0),oe.isShaderMaterial||oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshStandardMaterial||oe.envMap){const ut=at.map.cameraPosition;ut!==void 0&&ut.setValue(he,Oe.setFromMatrixPosition(W.matrixWorld))}(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&at.setValue(he,"isOrthographic",W.isOrthographicCamera===!0),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial||oe.isShadowMaterial||Me.isSkinnedMesh)&&at.setValue(he,"viewMatrix",W.matrixWorldInverse)}if(Me.isSkinnedMesh){at.setOptional(he,Me,"bindMatrix"),at.setOptional(he,Me,"bindMatrixInverse");const ut=Me.skeleton;ut&&($e.floatVertexTextures?(ut.boneTexture===null&&ut.computeBoneTexture(),at.setValue(he,"boneTexture",ut.boneTexture,et),at.setValue(he,"boneTextureSize",ut.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const ir=ye.morphAttributes;if((ir.position!==void 0||ir.normal!==void 0||ir.color!==void 0&&$e.isWebGL2===!0)&&Ut.update(Me,ye,yt),(Ft||Ye.receiveShadow!==Me.receiveShadow)&&(Ye.receiveShadow=Me.receiveShadow,at.setValue(he,"receiveShadow",Me.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(At.envMap.value=ze,At.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),Ft&&(at.setValue(he,"toneMappingExposure",ae.toneMappingExposure),Ye.needsLights&&rr(At,nr),Fe&&oe.fog===!0&&Pt.refreshFogUniforms(At,Fe),Pt.refreshMaterialUniforms(At,oe,pe,Te,Pe),G.WebGLUniforms.upload(he,Ye.uniformsList,At,et)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(G.WebGLUniforms.upload(he,Ye.uniformsList,At,et),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&at.setValue(he,"center",Me.center),at.setValue(he,"modelViewMatrix",Me.modelViewMatrix),at.setValue(he,"normalMatrix",Me.normalMatrix),at.setValue(he,"modelMatrix",Me.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const ut=oe.uniformsGroups;for(let ar=0,cr=ut.length;ar<cr;ar++)if($e.isWebGL2){const lr=ut[ar];Ct.update(lr,yt),Ct.bind(lr,yt)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yt}function rr(W,de){W.ambientLightColor.needsUpdate=de,W.lightProbe.needsUpdate=de,W.directionalLights.needsUpdate=de,W.directionalLightShadows.needsUpdate=de,W.pointLights.needsUpdate=de,W.pointLightShadows.needsUpdate=de,W.spotLights.needsUpdate=de,W.spotLightShadows.needsUpdate=de,W.rectAreaLights.needsUpdate=de,W.hemisphereLights.needsUpdate=de}function sr(W){return W.isMeshLambertMaterial||W.isMeshToonMaterial||W.isMeshPhongMaterial||W.isMeshStandardMaterial||W.isShadowMaterial||W.isShaderMaterial&&W.lights===!0}this.getActiveCubeFace=function(){return Se},this.getActiveMipmapLevel=function(){return Ae},this.getRenderTarget=function(){return Ce},this.setRenderTargetTextures=function(W,de,ye){qe.get(W.texture).__webglTexture=de,qe.get(W.depthTexture).__webglTexture=ye;const oe=qe.get(W);oe.__hasExternalTextures=!0,oe.__hasExternalTextures&&(oe.__autoAllocateDepthBuffer=ye===void 0,oe.__autoAllocateDepthBuffer||Qe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),oe.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(W,de){const ye=qe.get(W);ye.__webglFramebuffer=de,ye.__useDefaultFramebuffer=de===void 0},this.setRenderTarget=function(W,de=0,ye=0){Ce=W,Se=de,Ae=ye;let oe=!0,Me=null,Fe=!1,Ve=!1;if(W){const ze=qe.get(W);ze.__useDefaultFramebuffer!==void 0?(Ze.bindFramebuffer(he.FRAMEBUFFER,null),oe=!1):ze.__webglFramebuffer===void 0?et.setupRenderTarget(W):ze.__hasExternalTextures&&et.rebindTextures(W,qe.get(W.texture).__webglTexture,qe.get(W.depthTexture).__webglTexture);const Xe=W.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(Ve=!0);const Je=qe.get(W).__webglFramebuffer;W.isWebGLCubeRenderTarget?(Me=Je[de],Fe=!0):$e.isWebGL2&&W.samples>0&&et.useMultisampledRTT(W)===!1?Me=qe.get(W).__webglMultisampledFramebuffer:Me=Je,E.copy(W.viewport),V.copy(W.scissor),re=W.scissorTest}else E.copy(De).multiplyScalar(pe).floor(),V.copy(Ge).multiplyScalar(pe).floor(),re=Ue;if(Ze.bindFramebuffer(he.FRAMEBUFFER,Me)&&$e.drawBuffers&&oe&&Ze.drawBuffers(W,Me),Ze.viewport(E),Ze.scissor(V),Ze.setScissorTest(re),Fe){const ze=qe.get(W.texture);he.framebufferTexture2D(he.FRAMEBUFFER,he.COLOR_ATTACHMENT0,he.TEXTURE_CUBE_MAP_POSITIVE_X+de,ze.__webglTexture,ye)}else if(Ve){const ze=qe.get(W.texture),Xe=de||0;he.framebufferTextureLayer(he.FRAMEBUFFER,he.COLOR_ATTACHMENT0,ze.__webglTexture,ye||0,Xe)}Be=-1},this.readRenderTargetPixels=function(W,de,ye,oe,Me,Fe,Ve){if(!(W&&W.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=qe.get(W).__webglFramebuffer;if(W.isWebGLCubeRenderTarget&&Ve!==void 0&&(He=He[Ve]),He){Ze.bindFramebuffer(he.FRAMEBUFFER,He);try{const ze=W.texture,Xe=ze.format,Je=ze.type;if(Xe!==m.RGBAFormat&&mt.convert(Xe)!==he.getParameter(he.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const We=Je===m.HalfFloatType&&(Qe.has("EXT_color_buffer_half_float")||$e.isWebGL2&&Qe.has("EXT_color_buffer_float"));if(Je!==m.UnsignedByteType&&mt.convert(Je)!==he.getParameter(he.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Je===m.FloatType&&($e.isWebGL2||Qe.has("OES_texture_float")||Qe.has("WEBGL_color_buffer_float")))&&!We){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}de>=0&&de<=W.width-oe&&ye>=0&&ye<=W.height-Me&&he.readPixels(de,ye,oe,Me,mt.convert(Xe),mt.convert(Je),Fe)}finally{const ze=Ce!==null?qe.get(Ce).__webglFramebuffer:null;Ze.bindFramebuffer(he.FRAMEBUFFER,ze)}}},this.copyFramebufferToTexture=function(W,de,ye=0){const oe=Math.pow(2,-ye),Me=Math.floor(de.image.width*oe),Fe=Math.floor(de.image.height*oe);et.setTexture2D(de,0),he.copyTexSubImage2D(he.TEXTURE_2D,ye,0,0,W.x,W.y,Me,Fe),Ze.unbindTexture()},this.copyTextureToTexture=function(W,de,ye,oe=0){const Me=de.image.width,Fe=de.image.height,Ve=mt.convert(ye.format),He=mt.convert(ye.type);et.setTexture2D(ye,0),he.pixelStorei(he.UNPACK_FLIP_Y_WEBGL,ye.flipY),he.pixelStorei(he.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ye.premultiplyAlpha),he.pixelStorei(he.UNPACK_ALIGNMENT,ye.unpackAlignment),de.isDataTexture?he.texSubImage2D(he.TEXTURE_2D,oe,W.x,W.y,Me,Fe,Ve,He,de.image.data):de.isCompressedTexture?he.compressedTexSubImage2D(he.TEXTURE_2D,oe,W.x,W.y,de.mipmaps[0].width,de.mipmaps[0].height,Ve,de.mipmaps[0].data):he.texSubImage2D(he.TEXTURE_2D,oe,W.x,W.y,Ve,He,de.image),oe===0&&ye.generateMipmaps&&he.generateMipmap(he.TEXTURE_2D),Ze.unbindTexture()},this.copyTextureToTexture3D=function(W,de,ye,oe,Me=0){if(ae.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Fe=W.max.x-W.min.x+1,Ve=W.max.y-W.min.y+1,He=W.max.z-W.min.z+1,ze=mt.convert(oe.format),Xe=mt.convert(oe.type);let Je;if(oe.isData3DTexture)et.setTexture3D(oe,0),Je=he.TEXTURE_3D;else if(oe.isDataArrayTexture)et.setTexture2DArray(oe,0),Je=he.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}he.pixelStorei(he.UNPACK_FLIP_Y_WEBGL,oe.flipY),he.pixelStorei(he.UNPACK_PREMULTIPLY_ALPHA_WEBGL,oe.premultiplyAlpha),he.pixelStorei(he.UNPACK_ALIGNMENT,oe.unpackAlignment);const We=he.getParameter(he.UNPACK_ROW_LENGTH),tt=he.getParameter(he.UNPACK_IMAGE_HEIGHT),rt=he.getParameter(he.UNPACK_SKIP_PIXELS),ht=he.getParameter(he.UNPACK_SKIP_ROWS),_t=he.getParameter(he.UNPACK_SKIP_IMAGES),st=ye.isCompressedTexture?ye.mipmaps[0]:ye.image;he.pixelStorei(he.UNPACK_ROW_LENGTH,st.width),he.pixelStorei(he.UNPACK_IMAGE_HEIGHT,st.height),he.pixelStorei(he.UNPACK_SKIP_PIXELS,W.min.x),he.pixelStorei(he.UNPACK_SKIP_ROWS,W.min.y),he.pixelStorei(he.UNPACK_SKIP_IMAGES,W.min.z),ye.isDataTexture||ye.isData3DTexture?he.texSubImage3D(Je,Me,de.x,de.y,de.z,Fe,Ve,He,ze,Xe,st.data):ye.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),he.compressedTexSubImage3D(Je,Me,de.x,de.y,de.z,Fe,Ve,He,ze,st.data)):he.texSubImage3D(Je,Me,de.x,de.y,de.z,Fe,Ve,He,ze,Xe,st),he.pixelStorei(he.UNPACK_ROW_LENGTH,We),he.pixelStorei(he.UNPACK_IMAGE_HEIGHT,tt),he.pixelStorei(he.UNPACK_SKIP_PIXELS,rt),he.pixelStorei(he.UNPACK_SKIP_ROWS,ht),he.pixelStorei(he.UNPACK_SKIP_IMAGES,_t),Me===0&&oe.generateMipmaps&&he.generateMipmap(Je),Ze.unbindTexture()},this.initTexture=function(W){W.isCubeTexture?et.setTextureCube(W,0):W.isData3DTexture?et.setTexture3D(W,0):W.isDataArrayTexture||W.isCompressedArrayTexture?et.setTexture2DArray(W,0):et.setTexture2D(W,0),Ze.unbindTexture()},this.resetState=function(){Se=0,Ae=0,Ce=null,Ze.reset(),vt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return m.WebGLCoordinateSystem}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(Q){console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!Q}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===m.SRGBColorSpace?m.sRGBEncoding:m.LinearEncoding}set outputEncoding(Q){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=Q===m.sRGBEncoding?m.SRGBColorSpace:m.LinearSRGBColorSpace}}},{"../constants.js":"bqsVL","../math/Color.js":"gFgcM","../math/Frustum.js":"hmBSr","../math/Matrix4.js":"64n8p","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../math/Vector4.js":"h0tSe","../math/MathUtils.js":"9o1gq","./webgl/WebGLAnimation.js":"78VzK","./webgl/WebGLAttributes.js":"6wkDb","./webgl/WebGLBackground.js":"8jgjL","./webgl/WebGLBindingStates.js":"kHg51","./webgl/WebGLBufferRenderer.js":"9yoFK","./webgl/WebGLCapabilities.js":"i1yj4","./webgl/WebGLClipping.js":"14JNB","./webgl/WebGLCubeMaps.js":"6K7J3","./webgl/WebGLCubeUVMaps.js":"gXKtb","./webgl/WebGLExtensions.js":"3hZAz","./webgl/WebGLGeometries.js":"8DvPJ","./webgl/WebGLIndexedBufferRenderer.js":"gLlAr","./webgl/WebGLInfo.js":"dNjRL","./webgl/WebGLMorphtargets.js":"ejerF","./webgl/WebGLObjects.js":"2ZIqK","./webgl/WebGLPrograms.js":"l4goT","./webgl/WebGLProperties.js":"iDm8Y","./webgl/WebGLRenderLists.js":"cYJDq","./webgl/WebGLRenderStates.js":"dnvrX","./WebGLRenderTarget.js":"azVIG","./webgl/WebGLShadowMap.js":"bETLW","./webgl/WebGLState.js":"hg75Y","./webgl/WebGLTextures.js":"9fDRC","./webgl/WebGLUniforms.js":"e624H","./webgl/WebGLUtils.js":"9KSSb","./webxr/WebXRManager.js":"8gw6i","./webgl/WebGLMaterials.js":"1ccgH","./webgl/WebGLUniformsGroups.js":"74Rh4","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hmBSr:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Frustum",()=>r);var m=e("../constants.js"),M=e("./Vector3.js"),v=e("./Sphere.js"),n=e("./Plane.js");const i=new v.Sphere,t=new M.Vector3;class r{constructor(h=new n.Plane,f=new n.Plane,c=new n.Plane,s=new n.Plane,d=new n.Plane,p=new n.Plane){this.planes=[h,f,c,s,d,p]}set(h,f,c,s,d,p){const u=this.planes;return u[0].copy(h),u[1].copy(f),u[2].copy(c),u[3].copy(s),u[4].copy(d),u[5].copy(p),this}copy(h){const f=this.planes;for(let c=0;c<6;c++)f[c].copy(h.planes[c]);return this}setFromProjectionMatrix(h,f=m.WebGLCoordinateSystem){const c=this.planes,s=h.elements,d=s[0],p=s[1],u=s[2],g=s[3],S=s[4],y=s[5],T=s[6],x=s[7],_=s[8],A=s[9],w=s[10],j=s[11],R=s[12],L=s[13],D=s[14],P=s[15];if(c[0].setComponents(g-d,x-S,j-_,P-R).normalize(),c[1].setComponents(g+d,x+S,j+_,P+R).normalize(),c[2].setComponents(g+p,x+y,j+A,P+L).normalize(),c[3].setComponents(g-p,x-y,j-A,P-L).normalize(),c[4].setComponents(g-u,x-T,j-w,P-D).normalize(),f===m.WebGLCoordinateSystem)c[5].setComponents(g+u,x+T,j+w,P+D).normalize();else if(f===m.WebGPUCoordinateSystem)c[5].setComponents(u,T,w,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+f);return this}intersectsObject(h){if(h.boundingSphere!==void 0)h.boundingSphere===null&&h.computeBoundingSphere(),i.copy(h.boundingSphere).applyMatrix4(h.matrixWorld);else{const f=h.geometry;f.boundingSphere===null&&f.computeBoundingSphere(),i.copy(f.boundingSphere).applyMatrix4(h.matrixWorld)}return this.intersectsSphere(i)}intersectsSprite(h){return i.center.set(0,0,0),i.radius=.7071067811865476,i.applyMatrix4(h.matrixWorld),this.intersectsSphere(i)}intersectsSphere(h){const f=this.planes,c=h.center,s=-h.radius;for(let d=0;d<6;d++)if(f[d].distanceToPoint(c)<s)return!1;return!0}intersectsBox(h){const f=this.planes;for(let c=0;c<6;c++){const s=f[c];if(t.x=s.normal.x>0?h.max.x:h.min.x,t.y=s.normal.y>0?h.max.y:h.min.y,t.z=s.normal.z>0?h.max.z:h.min.z,s.distanceToPoint(t)<0)return!1}return!0}containsPoint(h){const f=this.planes;for(let c=0;c<6;c++)if(f[c].distanceToPoint(h)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}},{"../constants.js":"bqsVL","./Vector3.js":"fUbuJ","./Sphere.js":"jgQJ1","./Plane.js":"a9oL5","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],a9oL5:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Plane",()=>t);var m=e("./Matrix3.js"),M=e("./Vector3.js");const v=new M.Vector3,n=new M.Vector3,i=new m.Matrix3;class t{constructor(l=new M.Vector3(1,0,0),h=0){this.isPlane=!0,this.normal=l,this.constant=h}set(l,h){return this.normal.copy(l),this.constant=h,this}setComponents(l,h,f,c){return this.normal.set(l,h,f),this.constant=c,this}setFromNormalAndCoplanarPoint(l,h){return this.normal.copy(l),this.constant=-h.dot(this.normal),this}setFromCoplanarPoints(l,h,f){const c=v.subVectors(f,h).cross(n.subVectors(l,h)).normalize();return this.setFromNormalAndCoplanarPoint(c,l),this}copy(l){return this.normal.copy(l.normal),this.constant=l.constant,this}normalize(){const l=1/this.normal.length();return this.normal.multiplyScalar(l),this.constant*=l,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(l){return this.normal.dot(l)+this.constant}distanceToSphere(l){return this.distanceToPoint(l.center)-l.radius}projectPoint(l,h){return h.copy(l).addScaledVector(this.normal,-this.distanceToPoint(l))}intersectLine(l,h){const f=l.delta(v),c=this.normal.dot(f);if(c===0)return this.distanceToPoint(l.start)===0?h.copy(l.start):null;const s=-(l.start.dot(this.normal)+this.constant)/c;return s<0||s>1?null:h.copy(l.start).addScaledVector(f,s)}intersectsLine(l){const h=this.distanceToPoint(l.start),f=this.distanceToPoint(l.end);return h<0&&f>0||f<0&&h>0}intersectsBox(l){return l.intersectsPlane(this)}intersectsSphere(l){return l.intersectsPlane(this)}coplanarPoint(l){return l.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(l,h){const f=h||i.getNormalMatrix(l),c=this.coplanarPoint(v).applyMatrix4(l),s=this.normal.applyMatrix3(f).normalize();return this.constant=-c.dot(s),this}translate(l){return this.constant-=l.dot(this.normal),this}equals(l){return l.normal.equals(this.normal)&&l.constant===this.constant}clone(){return new this.constructor().copy(this)}}},{"./Matrix3.js":"85Mgp","./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"78VzK":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLAnimation",()=>m);function m(){let M=null,v=!1,n=null,i=null;function t(r,l){n(r,l),i=M.requestAnimationFrame(t)}return{start:function(){v!==!0&&n!==null&&(i=M.requestAnimationFrame(t),v=!0)},stop:function(){M.cancelAnimationFrame(i),v=!1},setAnimationLoop:function(r){n=r},setContext:function(r){M=r}}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6wkDb":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLAttributes",()=>m);function m(M,v){const n=v.isWebGL2,i=new WeakMap;function t(c,s){const d=c.array,p=c.usage,u=M.createBuffer();M.bindBuffer(s,u),M.bufferData(s,d,p),c.onUploadCallback();let g;if(d instanceof Float32Array)g=M.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(n)g=M.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=M.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=M.SHORT;else if(d instanceof Uint32Array)g=M.UNSIGNED_INT;else if(d instanceof Int32Array)g=M.INT;else if(d instanceof Int8Array)g=M.BYTE;else if(d instanceof Uint8Array)g=M.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=M.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:u,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,s,d){const p=s.array,u=s.updateRange;M.bindBuffer(d,c),u.count===-1?M.bufferSubData(d,0,p):(n?M.bufferSubData(d,u.offset*p.BYTES_PER_ELEMENT,p,u.offset,u.count):M.bufferSubData(d,u.offset*p.BYTES_PER_ELEMENT,p.subarray(u.offset,u.offset+u.count)),u.count=-1),s.onUploadCallback()}function l(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function h(c){c.isInterleavedBufferAttribute&&(c=c.data);const s=i.get(c);s&&(M.deleteBuffer(s.buffer),i.delete(c))}function f(c,s){if(c.isGLBufferAttribute){const p=i.get(c);(!p||p.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=i.get(c);d===void 0?i.set(c,t(c,s)):d.version<c.version&&(r(d.buffer,c,s),d.version=c.version)}return{get:l,remove:h,update:f}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8jgjL":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLBackground",()=>f);var m=e("../../constants.js"),M=e("../../geometries/BoxGeometry.js"),v=e("../../geometries/PlaneGeometry.js"),n=e("../../materials/ShaderMaterial.js"),i=e("../../math/Color.js"),t=e("../../objects/Mesh.js"),r=e("../shaders/ShaderLib.js"),l=e("../shaders/UniformsUtils.js");const h={r:0,b:0,g:0};function f(c,s,d,p,u,g,S){const y=new i.Color(0);let T=g===!0?0:1,x,_,A=null,w=0,j=null;function R(D,P){let k=!1,O=P.isScene===!0?P.background:null;switch(O&&O.isTexture&&(O=(P.backgroundBlurriness>0?d:s).get(O)),O===null?L(y,T):O&&O.isColor&&(L(O,1),k=!0),c.xr.getEnvironmentBlendMode()){case"opaque":k=!0;break;case"additive":p.buffers.color.setClear(0,0,0,1,S),k=!0;break;case"alpha-blend":p.buffers.color.setClear(0,0,0,0,S),k=!0;break}(c.autoClear||k)&&c.clear(c.autoClearColor,c.autoClearDepth,c.autoClearStencil),O&&(O.isCubeTexture||O.mapping===m.CubeUVReflectionMapping)?(_===void 0&&(_=new t.Mesh(new M.BoxGeometry(1,1,1),new n.ShaderMaterial({name:"BackgroundCubeMaterial",uniforms:(0,l.cloneUniforms)(r.ShaderLib.backgroundCube.uniforms),vertexShader:r.ShaderLib.backgroundCube.vertexShader,fragmentShader:r.ShaderLib.backgroundCube.fragmentShader,side:m.BackSide,depthTest:!1,depthWrite:!1,fog:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(b,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),u.update(_)),_.material.uniforms.envMap.value=O,_.material.uniforms.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=P.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,_.material.toneMapped=O.colorSpace!==m.SRGBColorSpace,(A!==O||w!==O.version||j!==c.toneMapping)&&(_.material.needsUpdate=!0,A=O,w=O.version,j=c.toneMapping),_.layers.enableAll(),D.unshift(_,_.geometry,_.material,0,0,null)):O&&O.isTexture&&(x===void 0&&(x=new t.Mesh(new v.PlaneGeometry(2,2),new n.ShaderMaterial({name:"BackgroundMaterial",uniforms:(0,l.cloneUniforms)(r.ShaderLib.background.uniforms),vertexShader:r.ShaderLib.background.vertexShader,fragmentShader:r.ShaderLib.background.fragmentShader,side:m.FrontSide,depthTest:!1,depthWrite:!1,fog:!1})),x.geometry.deleteAttribute("normal"),Object.defineProperty(x.material,"map",{get:function(){return this.uniforms.t2D.value}}),u.update(x)),x.material.uniforms.t2D.value=O,x.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,x.material.toneMapped=O.colorSpace!==m.SRGBColorSpace,O.matrixAutoUpdate===!0&&O.updateMatrix(),x.material.uniforms.uvTransform.value.copy(O.matrix),(A!==O||w!==O.version||j!==c.toneMapping)&&(x.material.needsUpdate=!0,A=O,w=O.version,j=c.toneMapping),x.layers.enableAll(),D.unshift(x,x.geometry,x.material,0,0,null))}function L(D,P){D.getRGB(h,(0,l.getUnlitUniformColorSpace)(c)),p.buffers.color.setClear(h.r,h.g,h.b,P,S)}return{getClearColor:function(){return y},setClearColor:function(D,P=1){y.set(D),T=P,L(y,T)},getClearAlpha:function(){return T},setClearAlpha:function(D){T=D,L(y,T)},render:R}}},{"../../constants.js":"bqsVL","../../geometries/BoxGeometry.js":"5eHyr","../../geometries/PlaneGeometry.js":"amiFV","../../materials/ShaderMaterial.js":"bnM8h","../../math/Color.js":"gFgcM","../../objects/Mesh.js":"d9YFT","../shaders/ShaderLib.js":"lxrgR","../shaders/UniformsUtils.js":"4tBjA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],amiFV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PlaneGeometry",()=>v);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js");class v extends m.BufferGeometry{constructor(i=1,t=1,r=1,l=1){super();this.type="PlaneGeometry",this.parameters={width:i,height:t,widthSegments:r,heightSegments:l};const h=i/2,f=t/2,c=Math.floor(r),s=Math.floor(l),d=c+1,p=s+1,u=i/c,g=t/s,S=[],y=[],T=[],x=[];for(let _=0;_<p;_++){const A=_*g-f;for(let w=0;w<d;w++){const j=w*u-h;y.push(j,-A,0),T.push(0,0,1),x.push(w/c),x.push(1-_/s)}}for(let _=0;_<s;_++)for(let A=0;A<c;A++){const w=A+d*_,j=A+d*(_+1),R=A+1+d*(_+1),L=A+1+d*_;S.push(w,j,L),S.push(j,R,L)}this.setIndex(S),this.setAttribute("position",new M.Float32BufferAttribute(y,3)),this.setAttribute("normal",new M.Float32BufferAttribute(T,3)),this.setAttribute("uv",new M.Float32BufferAttribute(x,2))}copy(i){return super.copy(i),this.parameters=Object.assign({},i.parameters),this}static fromJSON(i){return new v(i.width,i.height,i.widthSegments,i.heightSegments)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lxrgR:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShaderLib",()=>l);var m=e("./ShaderChunk.js"),M=e("./UniformsUtils.js"),v=e("../../math/Vector2.js"),n=e("../../math/Vector3.js"),i=e("./UniformsLib.js"),t=e("../../math/Color.js"),r=e("../../math/Matrix3.js");const l={basic:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.specularmap,i.UniformsLib.envmap,i.UniformsLib.aomap,i.UniformsLib.lightmap,i.UniformsLib.fog]),vertexShader:m.ShaderChunk.meshbasic_vert,fragmentShader:m.ShaderChunk.meshbasic_frag},lambert:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.specularmap,i.UniformsLib.envmap,i.UniformsLib.aomap,i.UniformsLib.lightmap,i.UniformsLib.emissivemap,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,i.UniformsLib.fog,i.UniformsLib.lights,{emissive:{value:new t.Color(0)}}]),vertexShader:m.ShaderChunk.meshlambert_vert,fragmentShader:m.ShaderChunk.meshlambert_frag},phong:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.specularmap,i.UniformsLib.envmap,i.UniformsLib.aomap,i.UniformsLib.lightmap,i.UniformsLib.emissivemap,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,i.UniformsLib.fog,i.UniformsLib.lights,{emissive:{value:new t.Color(0)},specular:{value:new t.Color(1118481)},shininess:{value:30}}]),vertexShader:m.ShaderChunk.meshphong_vert,fragmentShader:m.ShaderChunk.meshphong_frag},standard:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.envmap,i.UniformsLib.aomap,i.UniformsLib.lightmap,i.UniformsLib.emissivemap,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,i.UniformsLib.roughnessmap,i.UniformsLib.metalnessmap,i.UniformsLib.fog,i.UniformsLib.lights,{emissive:{value:new t.Color(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:m.ShaderChunk.meshphysical_vert,fragmentShader:m.ShaderChunk.meshphysical_frag},toon:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.aomap,i.UniformsLib.lightmap,i.UniformsLib.emissivemap,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,i.UniformsLib.gradientmap,i.UniformsLib.fog,i.UniformsLib.lights,{emissive:{value:new t.Color(0)}}]),vertexShader:m.ShaderChunk.meshtoon_vert,fragmentShader:m.ShaderChunk.meshtoon_frag},matcap:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,i.UniformsLib.fog,{matcap:{value:null}}]),vertexShader:m.ShaderChunk.meshmatcap_vert,fragmentShader:m.ShaderChunk.meshmatcap_frag},points:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.points,i.UniformsLib.fog]),vertexShader:m.ShaderChunk.points_vert,fragmentShader:m.ShaderChunk.points_frag},dashed:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:m.ShaderChunk.linedashed_vert,fragmentShader:m.ShaderChunk.linedashed_frag},depth:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.displacementmap]),vertexShader:m.ShaderChunk.depth_vert,fragmentShader:m.ShaderChunk.depth_frag},normal:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.bumpmap,i.UniformsLib.normalmap,i.UniformsLib.displacementmap,{opacity:{value:1}}]),vertexShader:m.ShaderChunk.meshnormal_vert,fragmentShader:m.ShaderChunk.meshnormal_frag},sprite:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.sprite,i.UniformsLib.fog]),vertexShader:m.ShaderChunk.sprite_vert,fragmentShader:m.ShaderChunk.sprite_frag},background:{uniforms:{uvTransform:{value:new r.Matrix3},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:m.ShaderChunk.background_vert,fragmentShader:m.ShaderChunk.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:m.ShaderChunk.backgroundCube_vert,fragmentShader:m.ShaderChunk.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:m.ShaderChunk.cube_vert,fragmentShader:m.ShaderChunk.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:m.ShaderChunk.equirect_vert,fragmentShader:m.ShaderChunk.equirect_frag},distanceRGBA:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.common,i.UniformsLib.displacementmap,{referencePosition:{value:new n.Vector3},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:m.ShaderChunk.distanceRGBA_vert,fragmentShader:m.ShaderChunk.distanceRGBA_frag},shadow:{uniforms:(0,M.mergeUniforms)([i.UniformsLib.lights,i.UniformsLib.fog,{color:{value:new t.Color(0)},opacity:{value:1}}]),vertexShader:m.ShaderChunk.shadow_vert,fragmentShader:m.ShaderChunk.shadow_frag}};l.physical={uniforms:(0,M.mergeUniforms)([l.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new r.Matrix3},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new r.Matrix3},clearcoatNormalScale:{value:new v.Vector2(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new r.Matrix3},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new r.Matrix3},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new r.Matrix3},sheen:{value:0},sheenColor:{value:new t.Color(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new r.Matrix3},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new r.Matrix3},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new r.Matrix3},transmissionSamplerSize:{value:new v.Vector2},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new r.Matrix3},attenuationDistance:{value:0},attenuationColor:{value:new t.Color(0)},specularColor:{value:new t.Color(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new r.Matrix3},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new r.Matrix3},anisotropyVector:{value:new v.Vector2},anisotropyMap:{value:null},anisotropyMapTransform:{value:new r.Matrix3}}]),vertexShader:m.ShaderChunk.meshphysical_vert,fragmentShader:m.ShaderChunk.meshphysical_frag}},{"./ShaderChunk.js":"3CV51","./UniformsUtils.js":"4tBjA","../../math/Vector2.js":"crXpG","../../math/Vector3.js":"fUbuJ","./UniformsLib.js":"fRE1G","../../math/Color.js":"gFgcM","../../math/Matrix3.js":"85Mgp","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3CV51":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShaderChunk",()=>_s);var m=e("./ShaderChunk/alphahash_fragment.glsl.js"),M=a.interopDefault(m),v=e("./ShaderChunk/alphahash_pars_fragment.glsl.js"),n=a.interopDefault(v),i=e("./ShaderChunk/alphamap_fragment.glsl.js"),t=a.interopDefault(i),r=e("./ShaderChunk/alphamap_pars_fragment.glsl.js"),l=a.interopDefault(r),h=e("./ShaderChunk/alphatest_fragment.glsl.js"),f=a.interopDefault(h),c=e("./ShaderChunk/alphatest_pars_fragment.glsl.js"),s=a.interopDefault(c),d=e("./ShaderChunk/aomap_fragment.glsl.js"),p=a.interopDefault(d),u=e("./ShaderChunk/aomap_pars_fragment.glsl.js"),g=a.interopDefault(u),S=e("./ShaderChunk/begin_vertex.glsl.js"),y=a.interopDefault(S),T=e("./ShaderChunk/beginnormal_vertex.glsl.js"),x=a.interopDefault(T),_=e("./ShaderChunk/bsdfs.glsl.js"),A=a.interopDefault(_),w=e("./ShaderChunk/iridescence_fragment.glsl.js"),j=a.interopDefault(w),R=e("./ShaderChunk/bumpmap_pars_fragment.glsl.js"),L=a.interopDefault(R),D=e("./ShaderChunk/clipping_planes_fragment.glsl.js"),P=a.interopDefault(D),k=e("./ShaderChunk/clipping_planes_pars_fragment.glsl.js"),O=a.interopDefault(k),F=e("./ShaderChunk/clipping_planes_pars_vertex.glsl.js"),G=a.interopDefault(F),b=e("./ShaderChunk/clipping_planes_vertex.glsl.js"),C=a.interopDefault(b),I=e("./ShaderChunk/color_fragment.glsl.js"),B=a.interopDefault(I),H=e("./ShaderChunk/color_pars_fragment.glsl.js"),X=a.interopDefault(H),Y=e("./ShaderChunk/color_pars_vertex.glsl.js"),Z=a.interopDefault(Y),Q=e("./ShaderChunk/color_vertex.glsl.js"),ne=a.interopDefault(Q),ge=e("./ShaderChunk/common.glsl.js"),me=a.interopDefault(ge),_e=e("./ShaderChunk/cube_uv_reflection_fragment.glsl.js"),le=a.interopDefault(_e),ee=e("./ShaderChunk/defaultnormal_vertex.glsl.js"),je=a.interopDefault(ee),z=e("./ShaderChunk/displacementmap_pars_vertex.glsl.js"),$=a.interopDefault(z),se=e("./ShaderChunk/displacementmap_vertex.glsl.js"),ie=a.interopDefault(se),te=e("./ShaderChunk/emissivemap_fragment.glsl.js"),q=a.interopDefault(te),ce=e("./ShaderChunk/emissivemap_pars_fragment.glsl.js"),xe=a.interopDefault(ce),we=e("./ShaderChunk/colorspace_fragment.glsl.js"),Ee=a.interopDefault(we),ae=e("./ShaderChunk/colorspace_pars_fragment.glsl.js"),be=a.interopDefault(ae),Se=e("./ShaderChunk/envmap_fragment.glsl.js"),Ae=a.interopDefault(Se),Ce=e("./ShaderChunk/envmap_common_pars_fragment.glsl.js"),Be=a.interopDefault(Ce),U=e("./ShaderChunk/envmap_pars_fragment.glsl.js"),E=a.interopDefault(U),V=e("./ShaderChunk/envmap_pars_vertex.glsl.js"),re=a.interopDefault(V),ue=e("./ShaderChunk/envmap_vertex.glsl.js"),J=a.interopDefault(ue),fe=e("./ShaderChunk/fog_vertex.glsl.js"),Te=a.interopDefault(fe),pe=e("./ShaderChunk/fog_pars_vertex.glsl.js"),Ie=a.interopDefault(pe),ke=e("./ShaderChunk/fog_fragment.glsl.js"),De=a.interopDefault(ke),Ge=e("./ShaderChunk/fog_pars_fragment.glsl.js"),Ue=a.interopDefault(Ge),K=e("./ShaderChunk/gradientmap_pars_fragment.glsl.js"),Le=a.interopDefault(K),Re=e("./ShaderChunk/lightmap_fragment.glsl.js"),Pe=a.interopDefault(Re),ve=e("./ShaderChunk/lightmap_pars_fragment.glsl.js"),Ne=a.interopDefault(ve),Oe=e("./ShaderChunk/lights_lambert_fragment.glsl.js"),Ke=a.interopDefault(Oe),dt=e("./ShaderChunk/lights_lambert_pars_fragment.glsl.js"),he=a.interopDefault(dt),ot=e("./ShaderChunk/lights_pars_begin.glsl.js"),Qe=a.interopDefault(ot),$e=e("./ShaderChunk/envmap_physical_pars_fragment.glsl.js"),Ze=a.interopDefault($e),lt=e("./ShaderChunk/lights_toon_fragment.glsl.js"),qe=a.interopDefault(lt),et=e("./ShaderChunk/lights_toon_pars_fragment.glsl.js"),bt=a.interopDefault(et),Mt=e("./ShaderChunk/lights_phong_fragment.glsl.js"),Tt=a.interopDefault(Mt),Rt=e("./ShaderChunk/lights_phong_pars_fragment.glsl.js"),St=a.interopDefault(Rt),gt=e("./ShaderChunk/lights_physical_fragment.glsl.js"),Pt=a.interopDefault(gt),jt=e("./ShaderChunk/lights_physical_pars_fragment.glsl.js"),Et=a.interopDefault(jt),ft=e("./ShaderChunk/lights_fragment_begin.glsl.js"),ct=a.interopDefault(ft),pt=e("./ShaderChunk/lights_fragment_maps.glsl.js"),Ut=a.interopDefault(pt),Bt=e("./ShaderChunk/lights_fragment_end.glsl.js"),Nt=a.interopDefault(Bt),mt=e("./ShaderChunk/logdepthbuf_fragment.glsl.js"),vt=a.interopDefault(mt),Ct=e("./ShaderChunk/logdepthbuf_pars_fragment.glsl.js"),Gt=a.interopDefault(Ct),it=e("./ShaderChunk/logdepthbuf_pars_vertex.glsl.js"),kt=a.interopDefault(it),Ot=e("./ShaderChunk/logdepthbuf_vertex.glsl.js"),Vt=a.interopDefault(Ot),Ht=e("./ShaderChunk/map_fragment.glsl.js"),Qt=a.interopDefault(Ht),$t=e("./ShaderChunk/map_pars_fragment.glsl.js"),It=a.interopDefault($t),qt=e("./ShaderChunk/map_particle_fragment.glsl.js"),zt=a.interopDefault(qt),Jt=e("./ShaderChunk/map_particle_pars_fragment.glsl.js"),xt=a.interopDefault(Jt),Wt=e("./ShaderChunk/metalnessmap_fragment.glsl.js"),Xt=a.interopDefault(Wt),er=e("./ShaderChunk/metalnessmap_pars_fragment.glsl.js"),wt=a.interopDefault(er),Yt=e("./ShaderChunk/morphcolor_vertex.glsl.js"),Lt=a.interopDefault(Yt),Zt=e("./ShaderChunk/morphnormal_vertex.glsl.js"),tr=a.interopDefault(Zt),rr=e("./ShaderChunk/morphtarget_pars_vertex.glsl.js"),sr=a.interopDefault(rr),W=e("./ShaderChunk/morphtarget_vertex.glsl.js"),de=a.interopDefault(W),ye=e("./ShaderChunk/normal_fragment_begin.glsl.js"),oe=a.interopDefault(ye),Me=e("./ShaderChunk/normal_fragment_maps.glsl.js"),Fe=a.interopDefault(Me),Ve=e("./ShaderChunk/normal_pars_fragment.glsl.js"),He=a.interopDefault(Ve),ze=e("./ShaderChunk/normal_pars_vertex.glsl.js"),Xe=a.interopDefault(ze),Je=e("./ShaderChunk/normal_vertex.glsl.js"),We=a.interopDefault(Je),tt=e("./ShaderChunk/normalmap_pars_fragment.glsl.js"),rt=a.interopDefault(tt),ht=e("./ShaderChunk/clearcoat_normal_fragment_begin.glsl.js"),_t=a.interopDefault(ht),st=e("./ShaderChunk/clearcoat_normal_fragment_maps.glsl.js"),Ye=a.interopDefault(st),Dt=e("./ShaderChunk/clearcoat_pars_fragment.glsl.js"),nt=a.interopDefault(Dt),yt=e("./ShaderChunk/iridescence_pars_fragment.glsl.js"),Kt=a.interopDefault(yt),Ft=e("./ShaderChunk/opaque_fragment.glsl.js"),nr=a.interopDefault(Ft),at=e("./ShaderChunk/packing.glsl.js"),At=a.interopDefault(at),ir=e("./ShaderChunk/premultiplied_alpha_fragment.glsl.js"),ut=a.interopDefault(ir),ar=e("./ShaderChunk/project_vertex.glsl.js"),cr=a.interopDefault(ar),lr=e("./ShaderChunk/dithering_fragment.glsl.js"),hr=a.interopDefault(lr),ur=e("./ShaderChunk/dithering_pars_fragment.glsl.js"),dr=a.interopDefault(ur),fr=e("./ShaderChunk/roughnessmap_fragment.glsl.js"),pr=a.interopDefault(fr),mr=e("./ShaderChunk/roughnessmap_pars_fragment.glsl.js"),gr=a.interopDefault(mr),_r=e("./ShaderChunk/shadowmap_pars_fragment.glsl.js"),vr=a.interopDefault(_r),xr=e("./ShaderChunk/shadowmap_pars_vertex.glsl.js"),yr=a.interopDefault(xr),br=e("./ShaderChunk/shadowmap_vertex.glsl.js"),Mr=a.interopDefault(br),Sr=e("./ShaderChunk/shadowmask_pars_fragment.glsl.js"),Tr=a.interopDefault(Sr),Ar=e("./ShaderChunk/skinbase_vertex.glsl.js"),jr=a.interopDefault(Ar),Er=e("./ShaderChunk/skinning_pars_vertex.glsl.js"),Cr=a.interopDefault(Er),wr=e("./ShaderChunk/skinning_vertex.glsl.js"),Yr=a.interopDefault(wr),Zr=e("./ShaderChunk/skinnormal_vertex.glsl.js"),Kr=a.interopDefault(Zr),Qr=e("./ShaderChunk/specularmap_fragment.glsl.js"),$r=a.interopDefault(Qr),qr=e("./ShaderChunk/specularmap_pars_fragment.glsl.js"),es=a.interopDefault(qr),ts=e("./ShaderChunk/tonemapping_fragment.glsl.js"),rs=a.interopDefault(ts),ss=e("./ShaderChunk/tonemapping_pars_fragment.glsl.js"),ns=a.interopDefault(ss),is=e("./ShaderChunk/transmission_fragment.glsl.js"),as=a.interopDefault(is),os=e("./ShaderChunk/transmission_pars_fragment.glsl.js"),ls=a.interopDefault(os),cs=e("./ShaderChunk/uv_pars_fragment.glsl.js"),hs=a.interopDefault(cs),us=e("./ShaderChunk/uv_pars_vertex.glsl.js"),ds=a.interopDefault(us),fs=e("./ShaderChunk/uv_vertex.glsl.js"),ps=a.interopDefault(fs),ms=e("./ShaderChunk/worldpos_vertex.glsl.js"),gs=a.interopDefault(ms),Lr=e("./ShaderLib/background.glsl.js"),Rr=e("./ShaderLib/backgroundCube.glsl.js"),Pr=e("./ShaderLib/cube.glsl.js"),Ir=e("./ShaderLib/depth.glsl.js"),Dr=e("./ShaderLib/distanceRGBA.glsl.js"),Fr=e("./ShaderLib/equirect.glsl.js"),Ur=e("./ShaderLib/linedashed.glsl.js"),Br=e("./ShaderLib/meshbasic.glsl.js"),Nr=e("./ShaderLib/meshlambert.glsl.js"),Gr=e("./ShaderLib/meshmatcap.glsl.js"),kr=e("./ShaderLib/meshnormal.glsl.js"),Or=e("./ShaderLib/meshphong.glsl.js"),Vr=e("./ShaderLib/meshphysical.glsl.js"),Hr=e("./ShaderLib/meshtoon.glsl.js"),zr=e("./ShaderLib/points.glsl.js"),Jr=e("./ShaderLib/shadow.glsl.js"),Wr=e("./ShaderLib/sprite.glsl.js");const _s={alphahash_fragment:M.default,alphahash_pars_fragment:n.default,alphamap_fragment:t.default,alphamap_pars_fragment:l.default,alphatest_fragment:f.default,alphatest_pars_fragment:s.default,aomap_fragment:p.default,aomap_pars_fragment:g.default,begin_vertex:y.default,beginnormal_vertex:x.default,bsdfs:A.default,iridescence_fragment:j.default,bumpmap_pars_fragment:L.default,clipping_planes_fragment:P.default,clipping_planes_pars_fragment:O.default,clipping_planes_pars_vertex:G.default,clipping_planes_vertex:C.default,color_fragment:B.default,color_pars_fragment:X.default,color_pars_vertex:Z.default,color_vertex:ne.default,common:me.default,cube_uv_reflection_fragment:le.default,defaultnormal_vertex:je.default,displacementmap_pars_vertex:$.default,displacementmap_vertex:ie.default,emissivemap_fragment:q.default,emissivemap_pars_fragment:xe.default,colorspace_fragment:Ee.default,colorspace_pars_fragment:be.default,envmap_fragment:Ae.default,envmap_common_pars_fragment:Be.default,envmap_pars_fragment:E.default,envmap_pars_vertex:re.default,envmap_physical_pars_fragment:Ze.default,envmap_vertex:J.default,fog_vertex:Te.default,fog_pars_vertex:Ie.default,fog_fragment:De.default,fog_pars_fragment:Ue.default,gradientmap_pars_fragment:Le.default,lightmap_fragment:Pe.default,lightmap_pars_fragment:Ne.default,lights_lambert_fragment:Ke.default,lights_lambert_pars_fragment:he.default,lights_pars_begin:Qe.default,lights_toon_fragment:qe.default,lights_toon_pars_fragment:bt.default,lights_phong_fragment:Tt.default,lights_phong_pars_fragment:St.default,lights_physical_fragment:Pt.default,lights_physical_pars_fragment:Et.default,lights_fragment_begin:ct.default,lights_fragment_maps:Ut.default,lights_fragment_end:Nt.default,logdepthbuf_fragment:vt.default,logdepthbuf_pars_fragment:Gt.default,logdepthbuf_pars_vertex:kt.default,logdepthbuf_vertex:Vt.default,map_fragment:Qt.default,map_pars_fragment:It.default,map_particle_fragment:zt.default,map_particle_pars_fragment:xt.default,metalnessmap_fragment:Xt.default,metalnessmap_pars_fragment:wt.default,morphcolor_vertex:Lt.default,morphnormal_vertex:tr.default,morphtarget_pars_vertex:sr.default,morphtarget_vertex:de.default,normal_fragment_begin:oe.default,normal_fragment_maps:Fe.default,normal_pars_fragment:He.default,normal_pars_vertex:Xe.default,normal_vertex:We.default,normalmap_pars_fragment:rt.default,clearcoat_normal_fragment_begin:_t.default,clearcoat_normal_fragment_maps:Ye.default,clearcoat_pars_fragment:nt.default,iridescence_pars_fragment:Kt.default,opaque_fragment:nr.default,packing:At.default,premultiplied_alpha_fragment:ut.default,project_vertex:cr.default,dithering_fragment:hr.default,dithering_pars_fragment:dr.default,roughnessmap_fragment:pr.default,roughnessmap_pars_fragment:gr.default,shadowmap_pars_fragment:vr.default,shadowmap_pars_vertex:yr.default,shadowmap_vertex:Mr.default,shadowmask_pars_fragment:Tr.default,skinbase_vertex:jr.default,skinning_pars_vertex:Cr.default,skinning_vertex:Yr.default,skinnormal_vertex:Kr.default,specularmap_fragment:$r.default,specularmap_pars_fragment:es.default,tonemapping_fragment:rs.default,tonemapping_pars_fragment:ns.default,transmission_fragment:as.default,transmission_pars_fragment:ls.default,uv_pars_fragment:hs.default,uv_pars_vertex:ds.default,uv_vertex:ps.default,worldpos_vertex:gs.default,background_vert:Lr.vertex,background_frag:Lr.fragment,backgroundCube_vert:Rr.vertex,backgroundCube_frag:Rr.fragment,cube_vert:Pr.vertex,cube_frag:Pr.fragment,depth_vert:Ir.vertex,depth_frag:Ir.fragment,distanceRGBA_vert:Dr.vertex,distanceRGBA_frag:Dr.fragment,equirect_vert:Fr.vertex,equirect_frag:Fr.fragment,linedashed_vert:Ur.vertex,linedashed_frag:Ur.fragment,meshbasic_vert:Br.vertex,meshbasic_frag:Br.fragment,meshlambert_vert:Nr.vertex,meshlambert_frag:Nr.fragment,meshmatcap_vert:Gr.vertex,meshmatcap_frag:Gr.fragment,meshnormal_vert:kr.vertex,meshnormal_frag:kr.fragment,meshphong_vert:Or.vertex,meshphong_frag:Or.fragment,meshphysical_vert:Vr.vertex,meshphysical_frag:Vr.fragment,meshtoon_vert:Hr.vertex,meshtoon_frag:Hr.fragment,points_vert:zr.vertex,points_frag:zr.fragment,shadow_vert:Jr.vertex,shadow_frag:Jr.fragment,sprite_vert:Wr.vertex,sprite_frag:Wr.fragment}},{"./ShaderChunk/alphahash_fragment.glsl.js":"4Z7C9","./ShaderChunk/alphahash_pars_fragment.glsl.js":"ifEUW","./ShaderChunk/alphamap_fragment.glsl.js":"80Zdi","./ShaderChunk/alphamap_pars_fragment.glsl.js":"3OroX","./ShaderChunk/alphatest_fragment.glsl.js":"lqhMo","./ShaderChunk/alphatest_pars_fragment.glsl.js":"eopQe","./ShaderChunk/aomap_fragment.glsl.js":"gqJxg","./ShaderChunk/aomap_pars_fragment.glsl.js":"2XmJo","./ShaderChunk/begin_vertex.glsl.js":"cIb31","./ShaderChunk/beginnormal_vertex.glsl.js":"91pSU","./ShaderChunk/bsdfs.glsl.js":"4NApJ","./ShaderChunk/iridescence_fragment.glsl.js":"5EDjg","./ShaderChunk/bumpmap_pars_fragment.glsl.js":"dwWgk","./ShaderChunk/clipping_planes_fragment.glsl.js":"bBKEW","./ShaderChunk/clipping_planes_pars_fragment.glsl.js":"8dcLa","./ShaderChunk/clipping_planes_pars_vertex.glsl.js":"6pQpz","./ShaderChunk/clipping_planes_vertex.glsl.js":"ecCJm","./ShaderChunk/color_fragment.glsl.js":"abPrD","./ShaderChunk/color_pars_fragment.glsl.js":"cO9To","./ShaderChunk/color_pars_vertex.glsl.js":"bDKUF","./ShaderChunk/color_vertex.glsl.js":"fPbId","./ShaderChunk/common.glsl.js":"R90Ch","./ShaderChunk/cube_uv_reflection_fragment.glsl.js":"bVCh9","./ShaderChunk/defaultnormal_vertex.glsl.js":"edXzZ","./ShaderChunk/displacementmap_pars_vertex.glsl.js":"fKYjJ","./ShaderChunk/displacementmap_vertex.glsl.js":"7KG51","./ShaderChunk/emissivemap_fragment.glsl.js":"bFvWQ","./ShaderChunk/emissivemap_pars_fragment.glsl.js":"akCdC","./ShaderChunk/colorspace_fragment.glsl.js":"2aiAd","./ShaderChunk/colorspace_pars_fragment.glsl.js":"4CydH","./ShaderChunk/envmap_fragment.glsl.js":"dNJo2","./ShaderChunk/envmap_common_pars_fragment.glsl.js":"ibeZC","./ShaderChunk/envmap_pars_fragment.glsl.js":"chmjx","./ShaderChunk/envmap_pars_vertex.glsl.js":"7kmW4","./ShaderChunk/envmap_vertex.glsl.js":"ck6m1","./ShaderChunk/fog_vertex.glsl.js":"6P6Cr","./ShaderChunk/fog_pars_vertex.glsl.js":"jnBgp","./ShaderChunk/fog_fragment.glsl.js":"jzm8I","./ShaderChunk/fog_pars_fragment.glsl.js":"6baXX","./ShaderChunk/gradientmap_pars_fragment.glsl.js":"1dNtW","./ShaderChunk/lightmap_fragment.glsl.js":"8ppBT","./ShaderChunk/lightmap_pars_fragment.glsl.js":"27T6Y","./ShaderChunk/lights_lambert_fragment.glsl.js":"7Lusa","./ShaderChunk/lights_lambert_pars_fragment.glsl.js":"046mn","./ShaderChunk/lights_pars_begin.glsl.js":"2XLTt","./ShaderChunk/envmap_physical_pars_fragment.glsl.js":"6yqLU","./ShaderChunk/lights_toon_fragment.glsl.js":"c56oD","./ShaderChunk/lights_toon_pars_fragment.glsl.js":"9GJd0","./ShaderChunk/lights_phong_fragment.glsl.js":"e7rQH","./ShaderChunk/lights_phong_pars_fragment.glsl.js":"arGaR","./ShaderChunk/lights_physical_fragment.glsl.js":"05aKK","./ShaderChunk/lights_physical_pars_fragment.glsl.js":"iZKdc","./ShaderChunk/lights_fragment_begin.glsl.js":"5kEBV","./ShaderChunk/lights_fragment_maps.glsl.js":"d7sYZ","./ShaderChunk/lights_fragment_end.glsl.js":"3ldTZ","./ShaderChunk/logdepthbuf_fragment.glsl.js":"9qU8G","./ShaderChunk/logdepthbuf_pars_fragment.glsl.js":"gfeZZ","./ShaderChunk/logdepthbuf_pars_vertex.glsl.js":"eENX1","./ShaderChunk/logdepthbuf_vertex.glsl.js":"eecoV","./ShaderChunk/map_fragment.glsl.js":"9xjJ8","./ShaderChunk/map_pars_fragment.glsl.js":"9F8dZ","./ShaderChunk/map_particle_fragment.glsl.js":"4tiW6","./ShaderChunk/map_particle_pars_fragment.glsl.js":"3oVSZ","./ShaderChunk/metalnessmap_fragment.glsl.js":"9iOcu","./ShaderChunk/metalnessmap_pars_fragment.glsl.js":"jbZu4","./ShaderChunk/morphcolor_vertex.glsl.js":"5XKrT","./ShaderChunk/morphnormal_vertex.glsl.js":"dX3rJ","./ShaderChunk/morphtarget_pars_vertex.glsl.js":"gPUT6","./ShaderChunk/morphtarget_vertex.glsl.js":"hoIm5","./ShaderChunk/normal_fragment_begin.glsl.js":"5EEe5","./ShaderChunk/normal_fragment_maps.glsl.js":"ksxZw","./ShaderChunk/normal_pars_fragment.glsl.js":"79L3U","./ShaderChunk/normal_pars_vertex.glsl.js":"5w0nF","./ShaderChunk/normal_vertex.glsl.js":"X7wXm","./ShaderChunk/normalmap_pars_fragment.glsl.js":"dVcoN","./ShaderChunk/clearcoat_normal_fragment_begin.glsl.js":"aPNWO","./ShaderChunk/clearcoat_normal_fragment_maps.glsl.js":"fiFUF","./ShaderChunk/clearcoat_pars_fragment.glsl.js":"2U3zP","./ShaderChunk/iridescence_pars_fragment.glsl.js":"aatav","./ShaderChunk/opaque_fragment.glsl.js":"dxPLg","./ShaderChunk/packing.glsl.js":"7RAzS","./ShaderChunk/premultiplied_alpha_fragment.glsl.js":"7J321","./ShaderChunk/project_vertex.glsl.js":"lOf9O","./ShaderChunk/dithering_fragment.glsl.js":"1GNTi","./ShaderChunk/dithering_pars_fragment.glsl.js":"kxzoB","./ShaderChunk/roughnessmap_fragment.glsl.js":"3ib5U","./ShaderChunk/roughnessmap_pars_fragment.glsl.js":"ciZqQ","./ShaderChunk/shadowmap_pars_fragment.glsl.js":"35Dot","./ShaderChunk/shadowmap_pars_vertex.glsl.js":"bkBCA","./ShaderChunk/shadowmap_vertex.glsl.js":"gPO2B","./ShaderChunk/shadowmask_pars_fragment.glsl.js":"au7f3","./ShaderChunk/skinbase_vertex.glsl.js":"8XiY3","./ShaderChunk/skinning_pars_vertex.glsl.js":"6zho4","./ShaderChunk/skinning_vertex.glsl.js":"ek5JQ","./ShaderChunk/skinnormal_vertex.glsl.js":"aeylv","./ShaderChunk/specularmap_fragment.glsl.js":"5xLqq","./ShaderChunk/specularmap_pars_fragment.glsl.js":"05e87","./ShaderChunk/tonemapping_fragment.glsl.js":"8oOk7","./ShaderChunk/tonemapping_pars_fragment.glsl.js":"l0aV8","./ShaderChunk/transmission_fragment.glsl.js":"aPoc7","./ShaderChunk/transmission_pars_fragment.glsl.js":"lTvsu","./ShaderChunk/uv_pars_fragment.glsl.js":"kJoVw","./ShaderChunk/uv_pars_vertex.glsl.js":"pKzYM","./ShaderChunk/uv_vertex.glsl.js":"3Au0L","./ShaderChunk/worldpos_vertex.glsl.js":"dqp2p","./ShaderLib/background.glsl.js":"hXVcA","./ShaderLib/backgroundCube.glsl.js":"9vnhI","./ShaderLib/cube.glsl.js":"dQYNr","./ShaderLib/depth.glsl.js":"5pPNo","./ShaderLib/distanceRGBA.glsl.js":"aMVUh","./ShaderLib/equirect.glsl.js":"cJfjV","./ShaderLib/linedashed.glsl.js":"4TxDg","./ShaderLib/meshbasic.glsl.js":"fgskp","./ShaderLib/meshlambert.glsl.js":"3cV4t","./ShaderLib/meshmatcap.glsl.js":"eGxJJ","./ShaderLib/meshnormal.glsl.js":"9SGwV","./ShaderLib/meshphong.glsl.js":"57v62","./ShaderLib/meshphysical.glsl.js":"herwM","./ShaderLib/meshtoon.glsl.js":"9zgEF","./ShaderLib/points.glsl.js":"8oxyQ","./ShaderLib/shadow.glsl.js":"cXD7f","./ShaderLib/sprite.glsl.js":"6MgV0","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4Z7C9":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHAHASH

	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ifEUW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHAHASH

	/**
	 * See: https://casual-effects.com/research/Wyman2017Hashed/index.html
	 */

	const float ALPHA_HASH_SCALE = 0.05; // Derived from trials only, and may be changed.

	float hash2D( vec2 value ) {

		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );

	}

	float hash3D( vec3 value ) {

		return hash2D( vec2( hash2D( value.xy ), value.z ) );

	}

	float getAlphaHashThreshold( vec3 position ) {

		// Find the discretized derivatives of our coordinates
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );

		// Find two nearest log-discretized noise scales
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);

		// Compute alpha thresholds at our two noise scales
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);

		// Factor to interpolate lerp with
		float lerpFactor = fract( log2( pixScale ) );

		// Interpolate alpha threshold from noise at two scales
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;

		// Pass into CDF to compute uniformly distrib threshold
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);

		// Find our final, uniformly distributed alpha threshold (\u03B1\u03C4)
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;

		// Avoids \u03B1\u03C4 == 0. Could also do \u03B1\u03C4 =1-\u03B1\u03C4
		return clamp( threshold , 1.0e-6, 1.0 );

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"80Zdi":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3OroX":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lqhMo:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHATEST

	if ( diffuseColor.a < alphaTest ) discard;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eopQe:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gqJxg:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_AOMAP

	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;

	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( STANDARD )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2XmJo":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_AOMAP

	uniform sampler2D aoMap;
	uniform float aoMapIntensity;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cIb31:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
vec3 transformed = vec3( position );

#ifdef USE_ALPHAHASH

	vPosition = vec3( position );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"91pSU":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
vec3 objectNormal = vec3( normal );

#ifdef USE_TANGENT

	vec3 objectTangent = vec3( tangent.xyz );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4NApJ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

float G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {

	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)
	return 0.25;

}

float D_BlinnPhong( const in float shininess, const in float dotNH ) {

	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );

}

vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( specularColor, 1.0, dotVH );

	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );

	float D = D_BlinnPhong( shininess, dotNH );

	return F * ( G * D );

} // validated

`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5EDjg":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#ifdef USE_IRIDESCENCE

	// XYZ to linear-sRGB color space
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);

	// Assume air interface for top
	// Note: We don't handle the case fresnel0 == 1
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {

		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );

	}

	// Conversion FO/IOR
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {

		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );

	}

	// ior is a value between 1.0 and 3.0. 1.0 is air interface
	float IorToFresnel0( float transmittedIor, float incidentIor ) {

		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));

	}

	// Fresnel equations for dielectric/dielectric interfaces.
	// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
	// Evaluation XYZ sensitivity curves in Fourier space
	vec3 evalSensitivity( float OPD, vec3 shift ) {

		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );

		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;

		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;

	}

	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {

		vec3 I;

		// Force iridescenceIOR -> outsideIOR when thinFilmThickness -> 0.0
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		// Evaluate the cosTheta on the base layer (Snell law)
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );

		// Handle TIR:
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {

			 return vec3( 1.0 );

		}

		float cosTheta2 = sqrt( cosTheta2Sq );

		// First interface
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;

		// Second interface
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0
		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;

		// Phase shift
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;

		// Compound terms
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );

		// Reflectance term for m = 0 (DC term amplitude)
		vec3 C0 = R12 + Rs;
		I = C0;

		// Reflectance term for m > 0 (pairs of diracs)
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {

			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;

		}

		// Since out of gamut colors might be produced, negative color values are clamped to 0.
		return max( I, vec3( 0.0 ) );

	}

#endif

`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dwWgk:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_BUMPMAP

	uniform sampler2D bumpMap;
	uniform float bumpScale;

	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
	// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf

	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

	vec2 dHdxy_fwd() {

		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );

		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;

		return vec2( dBx, dBy );

	}

	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {

		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm; // normalized

		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );

		float fDet = dot( vSigmaX, R1 ) * faceDirection;

		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bBKEW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if NUM_CLIPPING_PLANES > 0

	vec4 plane;

	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {

		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;

	}
	#pragma unroll_loop_end

	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

		bool clipped = true;

		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {

			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;

		}
		#pragma unroll_loop_end

		if ( clipped ) discard;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8dcLa":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6pQpz":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ecCJm:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if NUM_CLIPPING_PLANES > 0

	vClipPosition = - mvPosition.xyz;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],abPrD:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_COLOR_ALPHA )

	diffuseColor *= vColor;

#elif defined( USE_COLOR )

	diffuseColor.rgb *= vColor;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cO9To:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#elif defined( USE_COLOR )

	varying vec3 vColor;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bDKUF:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	varying vec3 vColor;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fPbId:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_COLOR_ALPHA )

	vColor = vec4( 1.0 );

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	vColor = vec3( 1.0 );

#endif

#ifdef USE_COLOR

	vColor *= color;

#endif

#ifdef USE_INSTANCING_COLOR

	vColor.xyz *= instanceColor.xyz;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],R90Ch:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {

	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

	return fract( sin( sn ) * c );

}

#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};

#ifdef USE_ALPHAHASH

	varying vec3 vPosition;

#endif

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}

mat3 transposeMat3( const in mat3 m ) {

	mat3 tmp;

	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );

	return tmp;

}

float luminance( const in vec3 rgb ) {

	// assumes rgb is in linear color space with sRGB primaries and D65 white point

	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );

	return dot( weights, rgb );

}

bool isPerspectiveMatrix( mat4 m ) {

	return m[ 2 ][ 3 ] == - 1.0;

}

vec2 equirectUv( in vec3 dir ) {

	// dir is assumed to be unit length

	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;

	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

	return vec2( u, v );

}

vec3 BRDF_Lambert( const in vec3 diffuseColor ) {

	return RECIPROCAL_PI * diffuseColor;

} // validated

vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1.0 - dotVH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} // validated

float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1.0 - dotVH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} // validated
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bVCh9:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef ENVMAP_TYPE_CUBE_UV

	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0

	// These shader functions convert between the UV coordinates of a single face of
	// a cubemap, the 0-5 integer index of a cube face, and the direction vector for
	// sampling a textureCube (not generally normalized ).

	float getFace( vec3 direction ) {

		vec3 absDirection = abs( direction );

		float face = - 1.0;

		if ( absDirection.x > absDirection.z ) {

			if ( absDirection.x > absDirection.y )

				face = direction.x > 0.0 ? 0.0 : 3.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		} else {

			if ( absDirection.z > absDirection.y )

				face = direction.z > 0.0 ? 2.0 : 5.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		}

		return face;

	}

	// RH coordinate system; PMREM face-indexing convention
	vec2 getUV( vec3 direction, float face ) {

		vec2 uv;

		if ( face == 0.0 ) {

			uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x

		} else if ( face == 1.0 ) {

			uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y

		} else if ( face == 2.0 ) {

			uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z

		} else if ( face == 3.0 ) {

			uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x

		} else if ( face == 4.0 ) {

			uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y

		} else {

			uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z

		}

		return 0.5 * ( uv + 1.0 );

	}

	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {

		float face = getFace( direction );

		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );

		mipInt = max( mipInt, cubeUV_minMipLevel );

		float faceSize = exp2( mipInt );

		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0; // #25071

		if ( face > 2.0 ) {

			uv.y += faceSize;

			face -= 3.0;

		}

		uv.x += face * faceSize;

		uv.x += filterInt * 3.0 * cubeUV_minTileSize;

		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );

		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;

		#ifdef texture2DGradEXT

			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb; // disable anisotropic filtering

		#else

			return texture2D( envMap, uv ).rgb;

		#endif

	}

	// These defines must match with PMREMGenerator

	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0

	float roughnessToMip( float roughness ) {

		float mip = 0.0;

		if ( roughness >= cubeUV_r1 ) {

			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;

		} else if ( roughness >= cubeUV_r4 ) {

			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;

		} else if ( roughness >= cubeUV_r5 ) {

			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;

		} else if ( roughness >= cubeUV_r6 ) {

			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;

		} else {

			mip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25
		}

		return mip;

	}

	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {

		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );

		float mipF = fract( mip );

		float mipInt = floor( mip );

		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );

		if ( mipF == 0.0 ) {

			return vec4( color0, 1.0 );

		} else {

			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );

			return vec4( mix( color0, color1, mipF ), 1.0 );

		}

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],edXzZ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
vec3 transformedNormal = objectNormal;

#ifdef USE_INSTANCING

	// this is in lieu of a per-instance normal-matrix
	// shear transforms in the instance matrix are not supported

	mat3 m = mat3( instanceMatrix );

	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );

	transformedNormal = m * transformedNormal;

#endif

transformedNormal = normalMatrix * transformedNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif

#ifdef USE_TANGENT

	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#ifdef FLIP_SIDED

		transformedTangent = - transformedTangent;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fKYjJ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_DISPLACEMENTMAP

	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7KG51":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_DISPLACEMENTMAP

	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bFvWQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],akCdC:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_EMISSIVEMAP

	uniform sampler2D emissiveMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2aiAd":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
gl_FragColor = linearToOutputTexel( gl_FragColor );
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4CydH":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dNJo2:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vec3 cameraToFrag;

		if ( isOrthographic ) {

			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToFrag = normalize( vWorldPosition - cameraPosition );

		}

		// Transforming Normal Vectors with the Inverse Transformation
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( cameraToFrag, worldNormal );

		#else

			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );

		#endif

	#else

		vec3 reflectVec = vReflect;

	#endif

	#ifdef ENVMAP_TYPE_CUBE

		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );

	#else

		vec4 envColor = vec4( 0.0 );

	#endif

	#ifdef ENVMAP_BLENDING_MULTIPLY

		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_MIX )

		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_ADD )

		outgoingLight += envColor.xyz * specularStrength * reflectivity;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ibeZC:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	uniform float envMapIntensity;
	uniform float flipEnvMap;

	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],chmjx:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	uniform float reflectivity;

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7kmW4":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;

	#else

		varying vec3 vReflect;
		uniform float refractionRatio;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ck6m1:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vWorldPosition = worldPosition.xyz;

	#else

		vec3 cameraToVertex;

		if ( isOrthographic ) {

			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

		}

		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vReflect = reflect( cameraToVertex, worldNormal );

		#else

			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );

		#endif

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6P6Cr":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_FOG

	vFogDepth = - mvPosition.z;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jnBgp:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_FOG

	varying float vFogDepth;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jzm8I:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );

	#endif

	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6baXX":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_FOG

	uniform vec3 fogColor;
	varying float vFogDepth;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1dNtW":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#ifdef USE_GRADIENTMAP

	uniform sampler2D gradientMap;

#endif

vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {

	// dotNL will be from -1.0 to 1.0
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );

	#ifdef USE_GRADIENTMAP

		return vec3( texture2D( gradientMap, coord ).r );

	#else

		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );

	#endif

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8ppBT":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_LIGHTMAP

	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;

	reflectedLight.indirectDiffuse += lightMapIrradiance;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"27T6Y":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_LIGHTMAP

	uniform sampler2D lightMap;
	uniform float lightMapIntensity;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7Lusa":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"046mn":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
varying vec3 vViewPosition;

struct LambertMaterial {

	vec3 diffuseColor;
	float specularStrength;

};

void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2XLTt":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];

// get the irradiance (radiance convolved with cosine lobe) at the point 'normal' on the unit sphere
// source: https://graphics.stanford.edu/papers/envmap/envmap.pdf
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {

	// normal is assumed to have unit length

	float x = normal.x, y = normal.y, z = normal.z;

	// band 0
	vec3 result = shCoefficients[ 0 ] * 0.886227;

	// band 1
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;

	// band 2
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );

	return result;

}

vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {

	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );

	return irradiance;

}

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {

	vec3 irradiance = ambientLightColor;

	return irradiance;

}

float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

	#if defined ( LEGACY_LIGHTS )

		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {

			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );

		}

		return 1.0;

	#else

		// based upon Frostbite 3 Moving to Physically-based Rendering
		// page 32, equation 26: E[window1]
		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

		if ( cutoffDistance > 0.0 ) {

			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

		}

		return distanceFalloff;

	#endif

}

float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

	return smoothstep( coneCosine, penumbraCosine, angleCosine );

}

#if NUM_DIR_LIGHTS > 0

	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {

		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;

	}

#endif


#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {

		vec3 lVector = pointLight.position - geometry.position;

		light.direction = normalize( lVector );

		float lightDistance = length( lVector );

		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );

	}

#endif


#if NUM_SPOT_LIGHTS > 0

	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};

	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {

		vec3 lVector = spotLight.position - geometry.position;

		light.direction = normalize( lVector );

		float angleCos = dot( light.direction, spotLight.direction );

		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );

		if ( spotAttenuation > 0.0 ) {

			float lightDistance = length( lVector );

			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );

		} else {

			light.color = vec3( 0.0 );
			light.visible = false;

		}

	}

#endif


#if NUM_RECT_AREA_LIGHTS > 0

	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};

	// Pre-computed values of LinearTransformedCosine approximation of BRDF
	// BRDF approximation Texture is 64x64
	uniform sampler2D ltc_1; // RGBA Float
	uniform sampler2D ltc_2; // RGBA Float

	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];

#endif


#if NUM_HEMI_LIGHTS > 0

	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};

	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];

	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {

		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );

		return irradiance;

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6yqLU":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ENVMAP

	vec3 getIBLIrradiance( const in vec3 normal ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );

			return PI * envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 reflectVec = reflect( - viewDir, normal );

			// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );

			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );

			return envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	#ifdef USE_ANISOTROPY

		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {

			#ifdef ENVMAP_TYPE_CUBE_UV

			  // https://google.github.io/filament/Filament.md.html#lighting/imagebasedlights/anisotropy
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );

				return getIBLRadiance( viewDir, bentNormal, roughness );

			#else

				return vec3( 0.0 );

			#endif

		}

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],c56oD:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9GJd0":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
varying vec3 vViewPosition;

struct ToonMaterial {

	vec3 diffuseColor;

};

void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e7rQH:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],arGaR:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
varying vec3 vViewPosition;

struct BlinnPhongMaterial {

	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;

};

void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;

}

void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"05aKK":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );

vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );

material.roughness = max( roughnessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );

#ifdef IOR

	material.ior = ior;

	#ifdef USE_SPECULAR

		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;

		#ifdef USE_SPECULAR_COLORMAP

			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;

		#endif

		#ifdef USE_SPECULAR_INTENSITYMAP

			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;

		#endif

		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );

	#else

		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;

	#endif

	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );

#else

	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;

#endif

#ifdef USE_CLEARCOAT

	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;

	#ifdef USE_CLEARCOATMAP

		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;

	#endif

	#ifdef USE_CLEARCOAT_ROUGHNESSMAP

		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;

	#endif

	material.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model
	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );

#endif

#ifdef USE_IRIDESCENCE

	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;

	#ifdef USE_IRIDESCENCEMAP

		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;

	#endif

	#ifdef USE_IRIDESCENCE_THICKNESSMAP

		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;

	#else

		material.iridescenceThickness = iridescenceThicknessMaximum;

	#endif

#endif

#ifdef USE_SHEEN

	material.sheenColor = sheenColor;

	#ifdef USE_SHEEN_COLORMAP

		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;

	#endif

	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );

	#ifdef USE_SHEEN_ROUGHNESSMAP

		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;

	#endif

#endif

#ifdef USE_ANISOTROPY

	#ifdef USE_ANISOTROPYMAP

		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;

	#else

		vec2 anisotropyV = anisotropyVector;

	#endif

	material.anisotropy = length( anisotropyV );
	anisotropyV /= material.anisotropy;
	material.anisotropy = saturate( material.anisotropy );

	// Roughness along the anisotropy bitangent is the material roughness, while the tangent roughness increases with anisotropy.
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );

	material.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iZKdc:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

struct PhysicalMaterial {

	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;

	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif

	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif

	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif

	#ifdef IOR
		float ior;
	#endif

	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif

	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif

};

// temporary
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );

vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );

    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {

	float a2 = pow2( alpha );

	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );

	return 0.5 / max( gv + gl, EPSILON );

}

// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney\u2019s reparameterization
float D_GGX( const in float alpha, const in float dotNH ) {

	float a2 = pow2( alpha );

	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1

	return RECIPROCAL_PI * a2 / pow2( denom );

}

// https://google.github.io/filament/Filament.md.html#materialsystem/anisotropicmodel/anisotropicspecularbrdf
#ifdef USE_ANISOTROPY

	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {

		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );

		return saturate(v);

	}

	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {

		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;

		return RECIPROCAL_PI * a2 * pow2 ( w2 );

	}

#endif

#ifdef USE_CLEARCOAT

	// GGX Distribution, Schlick Fresnel, GGX_SmithCorrelated Visibility
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {

		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;

		float alpha = pow2( roughness ); // UE4's roughness

		vec3 halfDir = normalize( lightDir + viewDir );

		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );

		vec3 F = F_Schlick( f0, f90, dotVH );

		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

		float D = D_GGX( alpha, dotNH );

		return F * ( V * D );

	}

#endif

vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {

	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;

	float alpha = pow2( roughness ); // UE4's roughness

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( f0, f90, dotVH );

	#ifdef USE_IRIDESCENCE

		F = mix( F, material.iridescenceFresnel, material.iridescence );

	#endif

	#ifdef USE_ANISOTROPY

		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );

		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );

		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );

	#else

		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

		float D = D_GGX( alpha, dotNH );

	#endif

	return F * ( V * D );

}

// Rect Area Light

// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines
// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt
// code: https://github.com/selfshadow/ltc_code/

vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	float dotNV = saturate( dot( N, V ) );

	// texture parameterized by sqrt( GGX alpha ) and sqrt( 1 - cos( theta ) )
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );

	uv = uv * LUT_SCALE + LUT_BIAS;

	return uv;

}

float LTC_ClippedSphereFormFactor( const in vec3 f ) {

	// Real-Time Area Lighting: a Journey from Research to Production (p.102)
	// An approximation of the form factor of a horizon-clipped rectangle.

	float l = length( f );

	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );

}

vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {

	float x = dot( v1, v2 );

	float y = abs( x );

	// rational polynomial approximation to theta / sin( theta ) / 2PI
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;

	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;

	return cross( v1, v2 ) * theta_sintheta;

}

vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {

	// bail if point is on back side of plane of light
	// assumes ccw winding order of light vertices
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );

	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );

	// construct orthonormal basis around N
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system

	// compute transform
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );

	// transform rect
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );

	// project rect onto sphere
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );

	// calculate vector form factor
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );

	// adjust for horizon clipping
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );

/*
	// alternate method of adjusting for horizon clipping (see referece)
	// refactoring required
	float len = length( vectorFormFactor );
	float z = vectorFormFactor.z / len;

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	// tabulated horizon-clipped sphere, apparently...
	vec2 uv = vec2( z * 0.5 + 0.5, len );
	uv = uv * LUT_SCALE + LUT_BIAS;

	float scale = texture2D( ltc_2, uv ).w;

	float result = len * scale;
*/

	return vec3( result );

}

// End Rect Area Light

#if defined( USE_SHEEN )

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float D_Charlie( float roughness, float dotNH ) {

	float alpha = pow2( roughness );

	// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16

	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );

}

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float V_Neubelt( float dotNV, float dotNL ) {

	// Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );

}

vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );

	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );

	return sheenColor * ( D * V );

}

#endif

// This is a curve-fit approxmation to the "Charlie sheen" BRDF integrated over the hemisphere from 
// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF". The analysis can be found
// in the Sheen section of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );

	float r2 = roughness * roughness;

	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;

	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;

	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );

	return saturate( DG * RECIPROCAL_PI );

}

// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );

	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );

	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );

	vec4 r = roughness * c0 + c1;

	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;

	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;

	return fab;

}

vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {

	vec2 fab = DFGApprox( normal, viewDir, roughness );

	return specularColor * fab.x + specularF90 * fab.y;

}

// Fdez-Ag\xFCera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif

	vec2 fab = DFGApprox( normal, viewDir, roughness );

	#ifdef USE_IRIDESCENCE

		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );

	#else

		vec3 Fr = specularColor;

	#endif

	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;

	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;

	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619; // 1/21
	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

	singleScatter += FssEss;
	multiScatter += Fms * Ems;

}

#if NUM_RECT_AREA_LIGHTS > 0

	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;

		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction
		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;

		vec2 uv = LTC_Uv( normal, viewDir, roughness );

		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );

		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);

		// LTC Fresnel Approximation by Stephen Hill
		// http://blog.selfshadow.com/publications/s2016-advances/s2016_ltc_fresnel.pdf
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );

		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );

		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );

	}

#endif

void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );

	vec3 irradiance = dotNL * directLight.color;

	#ifdef USE_CLEARCOAT

		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );

		vec3 ccIrradiance = dotNLcc * directLight.color;

		clearcoatSpecular += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material );

	#endif

	#ifdef USE_SHEEN

		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );

	#endif

	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material );

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}

void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {

	#ifdef USE_CLEARCOAT

		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

	#endif

	#ifdef USE_SHEEN

		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );

	#endif

	// Both indirect specular and indirect diffuse light accumulate here

	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;

	#ifdef USE_IRIDESCENCE

		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );

	#else

		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );

	#endif

	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );

	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;

	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;

}

#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5kEBV":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

GeometricContext geometry;

geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

#ifdef USE_CLEARCOAT

	geometry.clearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE

	float dotNVi = saturate( dot( normal, geometry.viewDir ) );

	if ( material.iridescenceThickness == 0.0 ) {

		material.iridescence = 0.0;

	} else {

		material.iridescence = saturate( material.iridescence );

	}

	if ( material.iridescence > 0.0 ) {

		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );

		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );

	}

#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometry, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometry, directLight );

		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif

		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif

		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, geometry, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d7sYZ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( RE_IndirectDiffuse )

	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;

		irradiance += lightMapIrradiance;

	#endif

	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )

		iblIrradiance += getIBLIrradiance( geometry.normal );

	#endif

#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )

	#ifdef USE_ANISOTROPY

		radiance += getIBLAnisotropyRadiance( geometry.viewDir, geometry.normal, material.roughness, material.anisotropyB, material.anisotropy );

	#else

		radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );

	#endif

	#ifdef USE_CLEARCOAT

		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3ldTZ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( RE_IndirectDiffuse )

	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );

#endif

#if defined( RE_IndirectSpecular )

	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9qU8G":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )

	// Doing a strict comparison with == 1.0 can cause noise artifacts
	// on some platforms. See issue #17623.
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gfeZZ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )

	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eENX1:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;
		varying float vIsPerspective;

	#else

		uniform float logDepthBufFC;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eecoV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );

	#else

		if ( isPerspectiveMatrix( projectionMatrix ) ) {

			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;

			gl_Position.z *= gl_Position.w;

		}

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9xjJ8":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_MAP

	diffuseColor *= texture2D( map, vMapUv );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9F8dZ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_MAP

	uniform sampler2D map;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4tiW6":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

	#if defined( USE_POINTS_UV )

		vec2 uv = vUv;

	#else

		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

	#endif

#endif

#ifdef USE_MAP

	diffuseColor *= texture2D( map, uv );

#endif

#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, uv ).g;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3oVSZ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_POINTS_UV )

	varying vec2 vUv;

#else

	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

		uniform mat3 uvTransform;

	#endif

#endif

#ifdef USE_MAP

	uniform sampler2D map;

#endif

#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9iOcu":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );

	// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	metalnessFactor *= texelMetalness.b;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jbZu4:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_METALNESSMAP

	uniform sampler2D metalnessMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5XKrT":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	vColor *= morphTargetBaseInfluence;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		#if defined( USE_COLOR_ALPHA )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];

		#elif defined( USE_COLOR )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];

		#endif

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dX3rJ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_MORPHNORMALS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	objectNormal *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];

		}

	#else

		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gPUT6:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_MORPHTARGETS

	uniform float morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;

		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {

			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;

			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );

		}

	#else

		#ifndef USE_MORPHNORMALS

			uniform float morphTargetInfluences[ 8 ];

		#else

			uniform float morphTargetInfluences[ 4 ];

		#endif

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hoIm5:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_MORPHTARGETS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	transformed *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];

		}

	#else

		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];

		#ifndef USE_MORPHNORMALS

			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];

		#endif

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5EEe5":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;

#ifdef FLAT_SHADED

	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );

#else

	vec3 normal = normalize( vNormal );

	#ifdef DOUBLE_SIDED

		normal *= faceDirection;

	#endif

#endif

#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )

	#ifdef USE_TANGENT

		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

	#else

		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);

	#endif

	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;

	#endif

#endif

#ifdef USE_CLEARCOAT_NORMALMAP

	#ifdef USE_TANGENT

		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

	#else

		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

	#endif

	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;

	#endif

#endif

// non perturbed normal for clearcoat among others

vec3 geometryNormal = normal;

`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ksxZw:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#ifdef USE_NORMALMAP_OBJECTSPACE

	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

	#ifdef FLIP_SIDED

		normal = - normal;

	#endif

	#ifdef DOUBLE_SIDED

		normal = normal * faceDirection;

	#endif

	normal = normalize( normalMatrix * normal );

#elif defined( USE_NORMALMAP_TANGENTSPACE )

	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;

	normal = normalize( tbn * mapN );

#elif defined( USE_BUMPMAP )

	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"79L3U":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5w0nF":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],X7wXm:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

	#ifdef USE_TANGENT

		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dVcoN:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

#endif

#ifdef USE_NORMALMAP_OBJECTSPACE

	uniform mat3 normalMatrix;

#endif

#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )

	// Normal Mapping Without Precomputed Tangents
	// http://www.thetenthplanet.de/archives/1180

	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );

		vec3 N = surf_norm; // normalized

		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );

		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;

		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

		return mat3( T * scale, B * scale, N );

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aPNWO:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_CLEARCOAT

	vec3 clearcoatNormal = geometryNormal;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fiFUF:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_CLEARCOAT_NORMALMAP

	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;

	clearcoatNormal = normalize( tbn2 * clearcoatMapN );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2U3zP":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#ifdef USE_CLEARCOATMAP

	uniform sampler2D clearcoatMap;

#endif

#ifdef USE_CLEARCOAT_NORMALMAP

	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;

#endif

#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform sampler2D clearcoatRoughnessMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aatav:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#ifdef USE_IRIDESCENCEMAP

	uniform sampler2D iridescenceMap;

#endif

#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform sampler2D iridescenceThicknessMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dxPLg:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7RAzS":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}

vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

const float ShiftRight8 = 1. / 256.;

vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}

vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}

float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}

vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}

vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

// NOTE: viewZ, the z-coordinate in camera space, is negative for points in front of the camera

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	// -near maps to 0; -far maps to 1
	return ( viewZ + near ) / ( near - far );
}

float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	// maps orthographic depth in [ 0, 1 ] to viewZ
	return depth * ( near - far ) - near;
}

// NOTE: https://twitter.com/gonnavis/status/1377183786949959682

float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	// -near maps to 0; -far maps to 1
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}

float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	// maps perspective depth in [ 0, 1 ] to viewZ
	return ( near * far ) / ( ( far - near ) * depth - far );
}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7J321":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef PREMULTIPLIED_ALPHA

	// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.
	gl_FragColor.rgb *= gl_FragColor.a;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lOf9O:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING

	mvPosition = instanceMatrix * mvPosition;

#endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1GNTi":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef DITHERING

	gl_FragColor.rgb = dithering( gl_FragColor.rgb );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kxzoB:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef DITHERING

	// based on https://www.shadertoy.com/view/MslGR8
	vec3 dithering( vec3 color ) {
		//Calculate grid position
		float grid_position = rand( gl_FragCoord.xy );

		//Shift the individual colors differently, thus making it even harder to see the dithering pattern
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

		//modify shift according to grid position.
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

		//shift the color by dither_shift
		return color + dither_shift_RGB;
	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3ib5U":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );

	// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	roughnessFactor *= texelRoughness.g;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ciZqQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_ROUGHNESSMAP

	uniform sampler2D roughnessMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"35Dot":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if NUM_SPOT_LIGHT_COORDS > 0

	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];

#endif

#if NUM_SPOT_LIGHT_MAPS > 0

	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];

#endif

#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];

		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): create uniforms for area light shadows

	#endif
	*/

	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {

		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );

	}

	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {

		return unpackRGBATo2Half( texture2D( shadow, uv ) );

	}

	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){

		float occlusion = 1.0;

		vec2 distribution = texture2DDistribution( shadow, uv );

		float hard_shadow = step( compare , distribution.x ); // Hard Shadow

		if (hard_shadow != 1.0 ) {

			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );

		}
		return occlusion;

	}

	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

		float shadow = 1.0;

		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;

		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

		if ( frustumTest ) {

		#if defined( SHADOWMAP_TYPE_PCF )

			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;

			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;

			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );

		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )

			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;

			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;

			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );

		#elif defined( SHADOWMAP_TYPE_VSM )

			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );

		#else // no percentage-closer filtering:

			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );

		#endif

		}

		return shadow;

	}

	// cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D
	// vector suitable for 2D texture mapping. This code uses the following layout for the
	// 2D texture:
	//
	// xzXZ
	//  y Y
	//
	// Y - Positive y direction
	// y - Negative y direction
	// X - Positive x direction
	// x - Negative x direction
	// Z - Positive z direction
	// z - Negative z direction
	//
	// Source and test bed:
	// https://gist.github.com/tschw/da10c43c467ce8afd0c4

	vec2 cubeToUV( vec3 v, float texelSizeY ) {

		// Number of texels to avoid at the edge of each square

		vec3 absV = abs( v );

		// Intersect unit cube

		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;

		// Apply scale to avoid seams

		// two texels less per square (one texel will do for NEAREST)
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );

		// Unwrap

		// space: -1 ... 1 range for each square
		//
		// #X##		dim    := ( 4 , 2 )
		//  # #		center := ( 1 , 1 )

		vec2 planar = v.xy;

		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;

		if ( absV.z >= almostOne ) {

			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;

		} else if ( absV.x >= almostOne ) {

			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;

		} else if ( absV.y >= almostOne ) {

			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;

		}

		// Transform to UV space

		// scale := 0.5 / dim
		// translate := ( center + 0.5 ) / dim
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );

	}

	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {

		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );

		// for point lights, the uniform @vShadowCoord is re-purposed to hold
		// the vector from the light to the world-space position of the fragment.
		vec3 lightToPosition = shadowCoord.xyz;

		// dp = normalized distance from light to fragment position
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?
		dp += shadowBias;

		// bd3D = base direction 3D
		vec3 bd3D = normalize( lightToPosition );

		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )

			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;

			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );

		#else // no percentage-closer filtering

			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );

		#endif

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bkBCA:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#if NUM_SPOT_LIGHT_COORDS > 0

	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];

#endif

#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): uniforms for area light shadows

	#endif
	*/

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gPO2B:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`

#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )

	// Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;

#endif

#if defined( USE_SHADOWMAP )

	#if NUM_DIR_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update vAreaShadowCoord with area light info

	#endif
	*/

#endif

// spot lights can be evaluated without active shadow mapping (when SpotLight.map is used)

#if NUM_SPOT_LIGHT_COORDS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {

		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

#endif


`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],au7f3:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

	DirectionalLightShadow directionalLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

	SpotLightShadow spotLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

	PointLightShadow pointLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8XiY3":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_SKINNING

	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6zho4":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_SKINNING

	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;

	mat4 getBoneMatrix( const in float i ) {

		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );

		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );

		y = dy * ( y + 0.5 );

		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );

		mat4 bone = mat4( v1, v2, v3, v4 );

		return bone;

	}

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ek5JQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_SKINNING

	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;

	transformed = ( bindMatrixInverse * skinned ).xyz;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aeylv:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_SKINNING

	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;

	#ifdef USE_TANGENT

		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#endif

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5xLqq":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
float specularStrength;

#ifdef USE_SPECULARMAP

	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"05e87":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_SPECULARMAP

	uniform sampler2D specularMap;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8oOk7":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( TONE_MAPPING )

	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],l0aV8:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifndef saturate
// <common> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

uniform float toneMappingExposure;

// exposure only
vec3 LinearToneMapping( vec3 color ) {

	return saturate( toneMappingExposure * color );

}

// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf
vec3 ReinhardToneMapping( vec3 color ) {

	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );

}

// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 OptimizedCineonToneMapping( vec3 color ) {

	// optimized filmic operator by Jim Hejl and Richard Burgess-Dawson
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );

}

// source: https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs
vec3 RRTAndODTFit( vec3 v ) {

	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;

}

// this implementation of ACES is modified to accommodate a brighter viewing environment.
// the scale factor of 1/0.6 is subjective. see discussion in #19621.

vec3 ACESFilmicToneMapping( vec3 color ) {

	// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);

	// ODT_SAT => XYZ => D60_2_D65 => sRGB
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);

	color *= toneMappingExposure / 0.6;

	color = ACESInputMat * color;

	// Apply RRT and ODT
	color = RRTAndODTFit( color );

	color = ACESOutputMat * color;

	// Clamp to [0, 1]
	return saturate( color );

}

vec3 CustomToneMapping( vec3 color ) { return color; }
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aPoc7:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_TRANSMISSION

	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;

	#ifdef USE_TRANSMISSIONMAP

		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;

	#endif

	#ifdef USE_THICKNESSMAP

		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;

	#endif

	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );

	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );

	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );

	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lTvsu:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#ifdef USE_TRANSMISSION

	// Transmission code is based on glTF-Sampler-Viewer
	// https://github.com/KhronosGroup/glTF-Sample-Viewer

	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;

	#ifdef USE_TRANSMISSIONMAP

		uniform sampler2D transmissionMap;

	#endif

	#ifdef USE_THICKNESSMAP

		uniform sampler2D thicknessMap;

	#endif

	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;

	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;

	varying vec3 vWorldPosition;

	// Mipped Bicubic Texture Filtering by N8
	// https://www.shadertoy.com/view/Dl2SDW

	float w0( float a ) {

		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );

	}

	float w1( float a ) {

		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );

	}

	float w2( float a ){

		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );

	}

	float w3( float a ) {

		return ( 1.0 / 6.0 ) * ( a * a * a );

	}

	// g0 and g1 are the two amplitude functions
	float g0( float a ) {

		return w0( a ) + w1( a );

	}

	float g1( float a ) {

		return w2( a ) + w3( a );

	}

	// h0 and h1 are the two offset functions
	float h0( float a ) {

		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );

	}

	float h1( float a ) {

		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );

	}

	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {

		uv = uv * texelSize.zw + 0.5;

		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );

		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );

		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;

		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );

	}

	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {

		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );

	}

	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {

		// Direction of refracted light.
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );

		// Compute rotation-independant scaling of the model matrix.
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );

		// The thickness is specified in local space.
		return normalize( refractionVector ) * thickness * modelScale;

	}

	float applyIorToRoughness( const in float roughness, const in float ior ) {

		// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
		// an IOR of 1.5 results in the default amount of microfacet refraction.
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );

	}

	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {

		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );

	}

	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {

		if ( isinf( attenuationDistance ) ) {

			// Attenuation distance is +\u221E, i.e. the transmitted color is not attenuated at all.
			return vec3( 1.0 );

		} else {

			// Compute light attenuation using Beer's law.
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
			return transmittance;

		}

	}

	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {

		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;

		// Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;

		// Sample framebuffer to get pixel the refracted ray hits.
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );

		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;

		// Get the specular component.
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );

		// As less light is transmitted, the opacity should be increased. This simple approximation does a decent job 
		// of modulating a CSS background, and has no effect when the buffer is opaque, due to a solid object or clear color.
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;

		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );

	}
#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kJoVw:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;

#endif
#ifdef USE_MAP

	varying vec2 vMapUv;

#endif
#ifdef USE_ALPHAMAP

	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	varying vec2 vNormalMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_SPECULARMAP

	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],pKzYM:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3Au0L":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	vUv = vec3( uv, 1 ).xy;

#endif
#ifdef USE_MAP

	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ALPHAMAP

	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_LIGHTMAP

	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_AOMAP

	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_BUMPMAP

	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_NORMALMAP

	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_DISPLACEMENTMAP

	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_EMISSIVEMAP

	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_METALNESSMAP

	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ROUGHNESSMAP

	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ANISOTROPYMAP

	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOATMAP

	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_IRIDESCENCEMAP

	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SHEEN_COLORMAP

	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULARMAP

	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULAR_COLORMAP

	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_TRANSMISSIONMAP

	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_THICKNESSMAP

	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dqp2p:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),o.default=`
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0

	vec4 worldPosition = vec4( transformed, 1.0 );

	#ifdef USE_INSTANCING

		worldPosition = instanceMatrix * worldPosition;

	#endif

	worldPosition = modelMatrix * worldPosition;

#endif
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hXVcA:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
varying vec2 vUv;
uniform mat3 uvTransform;

void main() {

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	gl_Position = vec4( position.xy, 1.0, 1.0 );

}
`,M=`
uniform sampler2D t2D;
uniform float backgroundIntensity;

varying vec2 vUv;

void main() {

	vec4 texColor = texture2D( t2D, vUv );

	texColor.rgb *= backgroundIntensity;

	gl_FragColor = texColor;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9vnhI":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`,M=`

#ifdef ENVMAP_TYPE_CUBE

	uniform samplerCube envMap;

#elif defined( ENVMAP_TYPE_CUBE_UV )

	uniform sampler2D envMap;

#endif

uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;

varying vec3 vWorldDirection;

#include <cube_uv_reflection_fragment>

void main() {

	#ifdef ENVMAP_TYPE_CUBE

		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );

	#elif defined( ENVMAP_TYPE_CUBE_UV )

		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );

	#else

		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );

	#endif

	texColor.rgb *= backgroundIntensity;

	gl_FragColor = texColor;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dQYNr:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`,M=`
uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;

varying vec3 vWorldDirection;

void main() {

	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );

	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5pPNo":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// This is used for computing an equivalent of gl_FragCoord.z that is as high precision as possible.
// Some platforms compute gl_FragCoord at a lower precision which makes the manually computed value better for
// depth-based postprocessing effects. Reproduced on iPad with A10 processor / iPadOS 13.3.1.
varying vec2 vHighPrecisionZW;

void main() {

	#include <uv_vertex>

	#include <skinbase_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vHighPrecisionZW = gl_Position.zw;

}
`,M=`
#if DEPTH_PACKING == 3200

	uniform float opacity;

#endif

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying vec2 vHighPrecisionZW;

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( 1.0 );

	#if DEPTH_PACKING == 3200

		diffuseColor.a = opacity;

	#endif

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	#include <logdepthbuf_fragment>

	// Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;

	#if DEPTH_PACKING == 3200

		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );

	#elif DEPTH_PACKING == 3201

		gl_FragColor = packDepthToRGBA( fragCoordZ );

	#endif

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aMVUh:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define DISTANCE

varying vec3 vWorldPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	#include <skinbase_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>

	vWorldPosition = worldPosition.xyz;

}
`,M=`
#define DISTANCE

uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>

void main () {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( 1.0 );

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

	gl_FragColor = packDepthToRGBA( dist );

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cJfjV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

}
`,M=`
uniform sampler2D tEquirect;

varying vec3 vWorldDirection;

#include <common>

void main() {

	vec3 direction = normalize( vWorldDirection );

	vec2 sampleUV = equirectUv( direction );

	gl_FragColor = texture2D( tEquirect, sampleUV );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4TxDg":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
uniform float scale;
attribute float lineDistance;

varying float vLineDistance;

#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	vLineDistance = scale * lineDistance;

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,M=`
uniform vec3 diffuse;
uniform float opacity;

uniform float dashSize;
uniform float totalSize;

varying float vLineDistance;

#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	if ( mod( vLineDistance, totalSize ) > dashSize ) {

		discard;

	}

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>

	outgoingLight = diffuseColor.rgb; // simple shader

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fgskp:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}
`,M=`
uniform vec3 diffuse;
uniform float opacity;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	// accumulation (baked indirect lighting only)
	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

	// modulation
	#include <aomap_fragment>

	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	#include <envmap_fragment>

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3cV4t":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define LAMBERT

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,M=`
#define LAMBERT

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eGxJJ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define MATCAP

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

	vViewPosition = - mvPosition.xyz;

}
`,M=`
#define MATCAP

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

varying vec3 vViewPosition;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

	#ifdef USE_MATCAP

		vec4 matcapColor = texture2D( matcap, uv );

	#else

		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 ); // default if matcap is missing

	#endif

	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9SGwV":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define NORMAL

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	varying vec3 vViewPosition;

#endif

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	vViewPosition = - mvPosition.xyz;

#endif

}
`,M=`
#define NORMAL

uniform float opacity;

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	varying vec3 vViewPosition;

#endif

#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );

	#ifdef OPAQUE

		gl_FragColor.a = 1.0;

	#endif

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"57v62":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define PHONG

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,M=`
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],herwM:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define STANDARD

varying vec3 vViewPosition;

#ifdef USE_TRANSMISSION

	varying vec3 vWorldPosition;

#endif

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

#ifdef USE_TRANSMISSION

	vWorldPosition = worldPosition.xyz;

#endif
}
`,M=`
#define STANDARD

#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef IOR
	uniform float ior;
#endif

#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;

	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif

	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif

#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;

	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif

	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif

#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;

	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif

varying vec3 vViewPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

	#include <transmission_fragment>

	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

	#ifdef USE_SHEEN

		// Sheen energy compensation approximation calculation can be found at the end of
		// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );

		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;

	#endif

	#ifdef USE_CLEARCOAT

		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );

		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;

	#endif

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9zgEF":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#define TOON

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,M=`
#define TOON

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8oxyQ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
uniform float size;
uniform float scale;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_POINTS_UV

	varying vec2 vUv;
	uniform mat3 uvTransform;

#endif

void main() {

	#ifdef USE_POINTS_UV

		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	#endif

	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>

	gl_PointSize = size;

	#ifdef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );

	#endif

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>

}
`,M=`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cXD7f:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>

void main() {

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,M=`
uniform vec3 color;
uniform float opacity;

#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

void main() {

	#include <logdepthbuf_fragment>

	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6MgV0":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
uniform float rotation;
uniform vec2 center;

#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

	#ifndef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) scale *= - mvPosition.z;

	#endif

	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;

	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

	mvPosition.xy += rotatedPosition;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,M=`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fRE1G:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"UniformsLib",()=>n);var m=e("../../math/Color.js"),M=e("../../math/Vector2.js"),v=e("../../math/Matrix3.js");const n={common:{diffuse:{value:new m.Color(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new v.Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new v.Matrix3},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new v.Matrix3}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new v.Matrix3}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new v.Matrix3}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new v.Matrix3},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new v.Matrix3},normalScale:{value:new M.Vector2(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new v.Matrix3},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new v.Matrix3}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new v.Matrix3}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new v.Matrix3}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new m.Color(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new m.Color(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new v.Matrix3},alphaTest:{value:0},uvTransform:{value:new v.Matrix3}},sprite:{diffuse:{value:new m.Color(16777215)},opacity:{value:1},center:{value:new M.Vector2(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new v.Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new v.Matrix3},alphaTest:{value:0}}}},{"../../math/Color.js":"gFgcM","../../math/Vector2.js":"crXpG","../../math/Matrix3.js":"85Mgp","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kHg51:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLBindingStates",()=>M);var m=e("../../constants.js");function M(v,n,i,t){const r=v.getParameter(v.MAX_VERTEX_ATTRIBS),l=t.isWebGL2?null:n.get("OES_vertex_array_object"),h=t.isWebGL2||l!==null,f={},c=T(null);let s=c,d=!1;function p(b,C,I,B,H){let X=!1;if(h){const Y=y(B,I,C);s!==Y&&(s=Y,g(s.object)),X=x(b,B,I,H),X&&_(b,B,I,H)}else{const Y=C.wireframe===!0;(s.geometry!==B.id||s.program!==I.id||s.wireframe!==Y)&&(s.geometry=B.id,s.program=I.id,s.wireframe=Y,X=!0)}H!==null&&i.update(H,v.ELEMENT_ARRAY_BUFFER),(X||d)&&(d=!1,D(b,C,I,B),H!==null&&v.bindBuffer(v.ELEMENT_ARRAY_BUFFER,i.get(H).buffer))}function u(){return t.isWebGL2?v.createVertexArray():l.createVertexArrayOES()}function g(b){return t.isWebGL2?v.bindVertexArray(b):l.bindVertexArrayOES(b)}function S(b){return t.isWebGL2?v.deleteVertexArray(b):l.deleteVertexArrayOES(b)}function y(b,C,I){const B=I.wireframe===!0;let H=f[b.id];H===void 0&&(H={},f[b.id]=H);let X=H[C.id];X===void 0&&(X={},H[C.id]=X);let Y=X[B];return Y===void 0&&(Y=T(u()),X[B]=Y),Y}function T(b){const C=[],I=[],B=[];for(let H=0;H<r;H++)C[H]=0,I[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:I,attributeDivisors:B,object:b,attributes:{},index:null}}function x(b,C,I,B){const H=s.attributes,X=C.attributes;let Y=0;const Z=I.getAttributes();for(const Q in Z)if(Z[Q].location>=0){const ge=H[Q];let me=X[Q];if(me===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(me=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(me=b.instanceColor)),ge===void 0||ge.attribute!==me||me&&ge.data!==me.data)return!0;Y++}return s.attributesNum!==Y||s.index!==B}function _(b,C,I,B){const H={},X=C.attributes;let Y=0;const Z=I.getAttributes();for(const Q in Z)if(Z[Q].location>=0){let ge=X[Q];ge===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(ge=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(ge=b.instanceColor));const me={};me.attribute=ge,ge&&ge.data&&(me.data=ge.data),H[Q]=me,Y++}s.attributes=H,s.attributesNum=Y,s.index=B}function A(){const b=s.newAttributes;for(let C=0,I=b.length;C<I;C++)b[C]=0}function w(b){j(b,0)}function j(b,C){const I=s.newAttributes,B=s.enabledAttributes,H=s.attributeDivisors;I[b]=1,B[b]===0&&(v.enableVertexAttribArray(b),B[b]=1),H[b]!==C&&((t.isWebGL2?v:n.get("ANGLE_instanced_arrays"))[t.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](b,C),H[b]=C)}function R(){const b=s.newAttributes,C=s.enabledAttributes;for(let I=0,B=C.length;I<B;I++)C[I]!==b[I]&&(v.disableVertexAttribArray(I),C[I]=0)}function L(b,C,I,B,H,X,Y){Y===!0?v.vertexAttribIPointer(b,C,I,H,X):v.vertexAttribPointer(b,C,I,B,H,X)}function D(b,C,I,B){if(t.isWebGL2===!1&&(b.isInstancedMesh||B.isInstancedBufferGeometry)&&n.get("ANGLE_instanced_arrays")===null)return;A();const H=B.attributes,X=I.getAttributes(),Y=C.defaultAttributeValues;for(const Z in X){const Q=X[Z];if(Q.location>=0){let ne=H[Z];if(ne===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(ne=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(ne=b.instanceColor)),ne!==void 0){const ge=ne.normalized,me=ne.itemSize,_e=i.get(ne);if(_e===void 0)continue;const le=_e.buffer,ee=_e.type,je=_e.bytesPerElement,z=t.isWebGL2===!0&&(ee===v.INT||ee===v.UNSIGNED_INT||ne.gpuType===m.IntType);if(ne.isInterleavedBufferAttribute){const $=ne.data,se=$.stride,ie=ne.offset;if($.isInstancedInterleavedBuffer){for(let te=0;te<Q.locationSize;te++)j(Q.location+te,$.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let te=0;te<Q.locationSize;te++)w(Q.location+te);v.bindBuffer(v.ARRAY_BUFFER,le);for(let te=0;te<Q.locationSize;te++)L(Q.location+te,me/Q.locationSize,ee,ge,se*je,(ie+me/Q.locationSize*te)*je,z)}else{if(ne.isInstancedBufferAttribute){for(let $=0;$<Q.locationSize;$++)j(Q.location+$,ne.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let $=0;$<Q.locationSize;$++)w(Q.location+$);v.bindBuffer(v.ARRAY_BUFFER,le);for(let $=0;$<Q.locationSize;$++)L(Q.location+$,me/Q.locationSize,ee,ge,me*je,me/Q.locationSize*$*je,z)}}else if(Y!==void 0){const ge=Y[Z];if(ge!==void 0)switch(ge.length){case 2:v.vertexAttrib2fv(Q.location,ge);break;case 3:v.vertexAttrib3fv(Q.location,ge);break;case 4:v.vertexAttrib4fv(Q.location,ge);break;default:v.vertexAttrib1fv(Q.location,ge)}}}}R()}function P(){F();for(const b in f){const C=f[b];for(const I in C){const B=C[I];for(const H in B)S(B[H].object),delete B[H];delete C[I]}delete f[b]}}function k(b){if(f[b.id]===void 0)return;const C=f[b.id];for(const I in C){const B=C[I];for(const H in B)S(B[H].object),delete B[H];delete C[I]}delete f[b.id]}function O(b){for(const C in f){const I=f[C];if(I[b.id]===void 0)continue;const B=I[b.id];for(const H in B)S(B[H].object),delete B[H];delete I[b.id]}}function F(){G(),d=!0,s!==c&&(s=c,g(s.object))}function G(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:p,reset:F,resetDefaultState:G,dispose:P,releaseStatesOfGeometry:k,releaseStatesOfProgram:O,initAttributes:A,enableAttribute:w,disableUnusedAttributes:R}}},{"../../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9yoFK":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLBufferRenderer",()=>m);function m(M,v,n,i){const t=i.isWebGL2;let r;function l(c){r=c}function h(c,s){M.drawArrays(r,c,s),n.update(s,r,1)}function f(c,s,d){if(d===0)return;let p,u;if(t)p=M,u="drawArraysInstanced";else if(p=v.get("ANGLE_instanced_arrays"),u="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,c,s,d),n.update(s,r,d)}this.setMode=l,this.render=h,this.renderInstances=f}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],i1yj4:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLCapabilities",()=>m);function m(M,v,n){let i;function t(){if(i!==void 0)return i;if(v.has("EXT_texture_filter_anisotropic")===!0){const R=v.get("EXT_texture_filter_anisotropic");i=M.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(R){if(R==="highp"){if(M.getShaderPrecisionFormat(M.VERTEX_SHADER,M.HIGH_FLOAT).precision>0&&M.getShaderPrecisionFormat(M.FRAGMENT_SHADER,M.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&M.getShaderPrecisionFormat(M.VERTEX_SHADER,M.MEDIUM_FLOAT).precision>0&&M.getShaderPrecisionFormat(M.FRAGMENT_SHADER,M.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const l=typeof WebGL2RenderingContext!="undefined"&&M.constructor.name==="WebGL2RenderingContext";let h=n.precision!==void 0?n.precision:"highp";const f=r(h);f!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",f,"instead."),h=f);const c=l||v.has("WEBGL_draw_buffers"),s=n.logarithmicDepthBuffer===!0,d=M.getParameter(M.MAX_TEXTURE_IMAGE_UNITS),p=M.getParameter(M.MAX_VERTEX_TEXTURE_IMAGE_UNITS),u=M.getParameter(M.MAX_TEXTURE_SIZE),g=M.getParameter(M.MAX_CUBE_MAP_TEXTURE_SIZE),S=M.getParameter(M.MAX_VERTEX_ATTRIBS),y=M.getParameter(M.MAX_VERTEX_UNIFORM_VECTORS),T=M.getParameter(M.MAX_VARYING_VECTORS),x=M.getParameter(M.MAX_FRAGMENT_UNIFORM_VECTORS),_=p>0,A=l||v.has("OES_texture_float"),w=_&&A,j=l?M.getParameter(M.MAX_SAMPLES):0;return{isWebGL2:l,drawBuffers:c,getMaxAnisotropy:t,getMaxPrecision:r,precision:h,logarithmicDepthBuffer:s,maxTextures:d,maxVertexTextures:p,maxTextureSize:u,maxCubemapSize:g,maxAttributes:S,maxVertexUniforms:y,maxVaryings:T,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:A,floatVertexTextures:w,maxSamples:j}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"14JNB":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLClipping",()=>v);var m=e("../../math/Matrix3.js"),M=e("../../math/Plane.js");function v(n){const i=this;let t=null,r=0,l=!1,h=!1;const f=new M.Plane,c=new m.Matrix3,s={value:null,needsUpdate:!1};this.uniform=s,this.numPlanes=0,this.numIntersection=0,this.init=function(u,g){const S=u.length!==0||g||r!==0||l;return l=g,r=u.length,S},this.beginShadows=function(){h=!0,p(null)},this.endShadows=function(){h=!1},this.setGlobalState=function(u,g){t=p(u,g,0)},this.setState=function(u,g,S){const y=u.clippingPlanes,T=u.clipIntersection,x=u.clipShadows,_=n.get(u);if(!l||y===null||y.length===0||h&&!x)h?p(null):d();else{const A=h?0:r,w=A*4;let j=_.clippingState||null;s.value=j,j=p(y,g,w,S);for(let R=0;R!==w;++R)j[R]=t[R];_.clippingState=j,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=A}};function d(){s.value!==t&&(s.value=t,s.needsUpdate=r>0),i.numPlanes=r,i.numIntersection=0}function p(u,g,S,y){const T=u!==null?u.length:0;let x=null;if(T!==0){if(x=s.value,y!==!0||x===null){const _=S+T*4,A=g.matrixWorldInverse;c.getNormalMatrix(A),(x===null||x.length<_)&&(x=new Float32Array(_));for(let w=0,j=S;w!==T;++w,j+=4)f.copy(u[w]).applyMatrix4(A,c),f.normal.toArray(x,j),x[j+3]=f.constant}s.value=x,s.needsUpdate=!0}return i.numPlanes=T,i.numIntersection=0,x}}},{"../../math/Matrix3.js":"85Mgp","../../math/Plane.js":"a9oL5","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6K7J3":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLCubeMaps",()=>v);var m=e("../../constants.js"),M=e("../WebGLCubeRenderTarget.js");function v(n){let i=new WeakMap;function t(f,c){return c===m.EquirectangularReflectionMapping?f.mapping=m.CubeReflectionMapping:c===m.EquirectangularRefractionMapping&&(f.mapping=m.CubeRefractionMapping),f}function r(f){if(f&&f.isTexture&&f.isRenderTargetTexture===!1){const c=f.mapping;if(c===m.EquirectangularReflectionMapping||c===m.EquirectangularRefractionMapping)if(i.has(f)){const s=i.get(f).texture;return t(s,f.mapping)}else{const s=f.image;if(s&&s.height>0){const d=new M.WebGLCubeRenderTarget(s.height/2);return d.fromEquirectangularTexture(n,f),i.set(f,d),f.addEventListener("dispose",l),t(d.texture,f.mapping)}else return null}}return f}function l(f){const c=f.target;c.removeEventListener("dispose",l);const s=i.get(c);s!==void 0&&(i.delete(c),s.dispose())}function h(){i=new WeakMap}return{get:r,dispose:h}}},{"../../constants.js":"bqsVL","../WebGLCubeRenderTarget.js":"8nOAb","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gXKtb:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLCubeUVMaps",()=>v);var m=e("../../constants.js"),M=e("../../extras/PMREMGenerator.js");function v(n){let i=new WeakMap,t=null;function r(c){if(c&&c.isTexture){const s=c.mapping,d=s===m.EquirectangularReflectionMapping||s===m.EquirectangularRefractionMapping,p=s===m.CubeReflectionMapping||s===m.CubeRefractionMapping;if(d||p)if(c.isRenderTargetTexture&&c.needsPMREMUpdate===!0){c.needsPMREMUpdate=!1;let u=i.get(c);return t===null&&(t=new M.PMREMGenerator(n)),u=d?t.fromEquirectangular(c,u):t.fromCubemap(c,u),i.set(c,u),u.texture}else{if(i.has(c))return i.get(c).texture;{const u=c.image;if(d&&u&&u.height>0||p&&u&&l(u)){t===null&&(t=new M.PMREMGenerator(n));const g=d?t.fromEquirectangular(c):t.fromCubemap(c);return i.set(c,g),c.addEventListener("dispose",h),g.texture}else return null}}}return c}function l(c){let s=0;const d=6;for(let p=0;p<d;p++)c[p]!==void 0&&s++;return s===d}function h(c){const s=c.target;s.removeEventListener("dispose",h);const d=i.get(s);d!==void 0&&(i.delete(s),d.dispose())}function f(){i=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:f}}},{"../../constants.js":"bqsVL","../../extras/PMREMGenerator.js":"eiBEx","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eiBEx:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PMREMGenerator",()=>A);var m=e("../constants.js"),M=e("../core/BufferAttribute.js"),v=e("../core/BufferGeometry.js"),n=e("../objects/Mesh.js"),i=e("../cameras/OrthographicCamera.js"),t=e("../cameras/PerspectiveCamera.js"),r=e("../materials/ShaderMaterial.js"),l=e("../math/Vector3.js"),h=e("../math/Color.js"),f=e("../renderers/WebGLRenderTarget.js"),c=e("../materials/MeshBasicMaterial.js"),s=e("../geometries/BoxGeometry.js");const d=4,p=[.125,.215,.35,.446,.526,.582],u=20,g=new i.OrthographicCamera,S=new h.Color;let y=null;const T=(1+Math.sqrt(5))/2,x=1/T,_=[new l.Vector3(1,1,1),new l.Vector3(-1,1,1),new l.Vector3(1,1,-1),new l.Vector3(-1,1,-1),new l.Vector3(0,T,x),new l.Vector3(0,T,-x),new l.Vector3(x,0,T),new l.Vector3(-x,0,T),new l.Vector3(T,x,0),new l.Vector3(-T,x,0)];class A{constructor(F){this._renderer=F,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(F,G=0,b=.1,C=100){y=this._renderer.getRenderTarget(),this._setSize(256);const I=this._allocateTargets();return I.depthBuffer=!0,this._sceneToCubeUV(F,b,C,I),G>0&&this._blur(I,0,0,G),this._applyPMREM(I),this._cleanup(I),I}fromEquirectangular(F,G=null){return this._fromTexture(F,G)}fromCubemap(F,G=null){return this._fromTexture(F,G)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=P(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=D(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(F){this._lodMax=Math.floor(Math.log2(F)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let F=0;F<this._lodPlanes.length;F++)this._lodPlanes[F].dispose()}_cleanup(F){this._renderer.setRenderTarget(y),F.scissorTest=!1,R(F,0,0,F.width,F.height)}_fromTexture(F,G){F.mapping===m.CubeReflectionMapping||F.mapping===m.CubeRefractionMapping?this._setSize(F.image.length===0?16:F.image[0].width||F.image[0].image.width):this._setSize(F.image.width/4),y=this._renderer.getRenderTarget();const b=G||this._allocateTargets();return this._textureToCubeUV(F,b),this._applyPMREM(b),this._cleanup(b),b}_allocateTargets(){const F=3*Math.max(this._cubeSize,112),G=4*this._cubeSize,b={magFilter:m.LinearFilter,minFilter:m.LinearFilter,generateMipmaps:!1,type:m.HalfFloatType,format:m.RGBAFormat,colorSpace:m.LinearSRGBColorSpace,depthBuffer:!1},C=j(F,G,b);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==F||this._pingPongRenderTarget.height!==G){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=j(F,G,b);const{_lodMax:I}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=w(I)),this._blurMaterial=L(I,F,G)}return C}_compileMaterial(F){const G=new n.Mesh(this._lodPlanes[0],F);this._renderer.compile(G,g)}_sceneToCubeUV(F,G,b,C){const I=90,B=1,H=new t.PerspectiveCamera(I,B,G,b),X=[1,-1,1,1,1,1],Y=[1,1,1,-1,-1,-1],Z=this._renderer,Q=Z.autoClear,ne=Z.toneMapping;Z.getClearColor(S),Z.toneMapping=m.NoToneMapping,Z.autoClear=!1;const ge=new c.MeshBasicMaterial({name:"PMREM.Background",side:m.BackSide,depthWrite:!1,depthTest:!1}),me=new n.Mesh(new s.BoxGeometry,ge);let _e=!1;const le=F.background;le?le.isColor&&(ge.color.copy(le),F.background=null,_e=!0):(ge.color.copy(S),_e=!0);for(let ee=0;ee<6;ee++){const je=ee%3;je===0?(H.up.set(0,X[ee],0),H.lookAt(Y[ee],0,0)):je===1?(H.up.set(0,0,X[ee]),H.lookAt(0,Y[ee],0)):(H.up.set(0,X[ee],0),H.lookAt(0,0,Y[ee]));const z=this._cubeSize;R(C,je*z,ee>2?z:0,z,z),Z.setRenderTarget(C),_e&&Z.render(me,H),Z.render(F,H)}me.geometry.dispose(),me.material.dispose(),Z.toneMapping=ne,Z.autoClear=Q,F.background=le}_textureToCubeUV(F,G){const b=this._renderer,C=F.mapping===m.CubeReflectionMapping||F.mapping===m.CubeRefractionMapping;C?(this._cubemapMaterial===null&&(this._cubemapMaterial=P()),this._cubemapMaterial.uniforms.flipEnvMap.value=F.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=D());const I=C?this._cubemapMaterial:this._equirectMaterial,B=new n.Mesh(this._lodPlanes[0],I),H=I.uniforms;H.envMap.value=F;const X=this._cubeSize;R(G,0,0,3*X,2*X),b.setRenderTarget(G),b.render(B,g)}_applyPMREM(F){const G=this._renderer,b=G.autoClear;G.autoClear=!1;for(let C=1;C<this._lodPlanes.length;C++){const I=Math.sqrt(this._sigmas[C]*this._sigmas[C]-this._sigmas[C-1]*this._sigmas[C-1]),B=_[(C-1)%_.length];this._blur(F,C-1,C,I,B)}G.autoClear=b}_blur(F,G,b,C,I){const B=this._pingPongRenderTarget;this._halfBlur(F,B,G,b,C,"latitudinal",I),this._halfBlur(B,F,b,b,C,"longitudinal",I)}_halfBlur(F,G,b,C,I,B,H){const X=this._renderer,Y=this._blurMaterial;B!=="latitudinal"&&B!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const Z=3,Q=new n.Mesh(this._lodPlanes[C],Y),ne=Y.uniforms,ge=this._sizeLods[b]-1,me=isFinite(I)?Math.PI/(2*ge):2*Math.PI/(2*u-1),_e=I/me,le=isFinite(I)?1+Math.floor(Z*_e):u;le>u&&console.warn(`sigmaRadians, ${I}, is too large and will clip, as it requested ${le} samples when the maximum is set to ${u}`);const ee=[];let je=0;for(let te=0;te<u;++te){const q=te/_e,ce=Math.exp(-q*q/2);ee.push(ce),te===0?je+=ce:te<le&&(je+=2*ce)}for(let te=0;te<ee.length;te++)ee[te]=ee[te]/je;ne.envMap.value=F.texture,ne.samples.value=le,ne.weights.value=ee,ne.latitudinal.value=B==="latitudinal",H&&(ne.poleAxis.value=H);const{_lodMax:z}=this;ne.dTheta.value=me,ne.mipInt.value=z-b;const $=this._sizeLods[C],se=3*$*(C>z-d?C-z+d:0),ie=4*(this._cubeSize-$);R(G,se,ie,3*$,2*$),X.setRenderTarget(G),X.render(Q,g)}}function w(O){const F=[],G=[],b=[];let C=O;const I=O-d+1+p.length;for(let B=0;B<I;B++){const H=Math.pow(2,C);G.push(H);let X=1/H;B>O-d?X=p[B-O+d-1]:B===0&&(X=0),b.push(X);const Y=1/(H-2),Z=-Y,Q=1+Y,ne=[Z,Z,Q,Z,Q,Q,Z,Z,Q,Q,Z,Q],ge=6,me=6,_e=3,le=2,ee=1,je=new Float32Array(_e*me*ge),z=new Float32Array(le*me*ge),$=new Float32Array(ee*me*ge);for(let ie=0;ie<ge;ie++){const te=ie%3*2/3-1,q=ie>2?0:-1,ce=[te,q,0,te+2/3,q,0,te+2/3,q+1,0,te,q,0,te+2/3,q+1,0,te,q+1,0];je.set(ce,_e*me*ie),z.set(ne,le*me*ie);const xe=[ie,ie,ie,ie,ie,ie];$.set(xe,ee*me*ie)}const se=new v.BufferGeometry;se.setAttribute("position",new M.BufferAttribute(je,_e)),se.setAttribute("uv",new M.BufferAttribute(z,le)),se.setAttribute("faceIndex",new M.BufferAttribute($,ee)),F.push(se),C>d&&C--}return{lodPlanes:F,sizeLods:G,sigmas:b}}function j(O,F,G){const b=new f.WebGLRenderTarget(O,F,G);return b.texture.mapping=m.CubeUVReflectionMapping,b.texture.name="PMREM.cubeUv",b.scissorTest=!0,b}function R(O,F,G,b,C){O.viewport.set(F,G,b,C),O.scissor.set(F,G,b,C)}function L(O,F,G){const b=new Float32Array(u),C=new l.Vector3(0,1,0);return new r.ShaderMaterial({name:"SphericalGaussianBlur",defines:{n:u,CUBEUV_TEXEL_WIDTH:1/F,CUBEUV_TEXEL_HEIGHT:1/G,CUBEUV_MAX_MIP:`${O}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:b},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:C}},vertexShader:k(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:m.NoBlending,depthTest:!1,depthWrite:!1})}function D(){return new r.ShaderMaterial({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:k(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:m.NoBlending,depthTest:!1,depthWrite:!1})}function P(){return new r.ShaderMaterial({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:k(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:m.NoBlending,depthTest:!1,depthWrite:!1})}function k(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}},{"../constants.js":"bqsVL","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../objects/Mesh.js":"d9YFT","../cameras/OrthographicCamera.js":"aETgy","../cameras/PerspectiveCamera.js":"bazbq","../materials/ShaderMaterial.js":"bnM8h","../math/Vector3.js":"fUbuJ","../math/Color.js":"gFgcM","../renderers/WebGLRenderTarget.js":"azVIG","../materials/MeshBasicMaterial.js":"gXfgB","../geometries/BoxGeometry.js":"5eHyr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aETgy:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"OrthographicCamera",()=>M);var m=e("./Camera.js");class M extends m.Camera{constructor(n=-1,i=1,t=1,r=-1,l=.1,h=2e3){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=n,this.right=i,this.top=t,this.bottom=r,this.near=l,this.far=h,this.updateProjectionMatrix()}copy(n,i){return super.copy(n,i),this.left=n.left,this.right=n.right,this.top=n.top,this.bottom=n.bottom,this.near=n.near,this.far=n.far,this.zoom=n.zoom,this.view=n.view===null?null:Object.assign({},n.view),this}setViewOffset(n,i,t,r,l,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=n,this.view.fullHeight=i,this.view.offsetX=t,this.view.offsetY=r,this.view.width=l,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const n=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),t=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let l=t-n,h=t+n,f=r+i,c=r-i;if(this.view!==null&&this.view.enabled){const s=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=s*this.view.offsetX,h=l+s*this.view.width,f-=d*this.view.offsetY,c=f-d*this.view.height}this.projectionMatrix.makeOrthographic(l,h,f,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(n){const i=super.toJSON(n);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}},{"./Camera.js":"2L3jQ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3hZAz":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLExtensions",()=>m);function m(M){const v={};function n(i){if(v[i]!==void 0)return v[i];let t;switch(i){case"WEBGL_depth_texture":t=M.getExtension("WEBGL_depth_texture")||M.getExtension("MOZ_WEBGL_depth_texture")||M.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":t=M.getExtension("EXT_texture_filter_anisotropic")||M.getExtension("MOZ_EXT_texture_filter_anisotropic")||M.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":t=M.getExtension("WEBGL_compressed_texture_s3tc")||M.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||M.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":t=M.getExtension("WEBGL_compressed_texture_pvrtc")||M.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:t=M.getExtension(i)}return v[i]=t,t}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?n("EXT_color_buffer_float"):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const t=n(i);return t===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),t}}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8DvPJ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLGeometries",()=>v);var m=e("../../core/BufferAttribute.js"),M=e("../../utils.js");function v(n,i,t,r){const l={},h=new WeakMap;function f(u){const g=u.target;g.index!==null&&i.remove(g.index);for(const y in g.attributes)i.remove(g.attributes[y]);for(const y in g.morphAttributes){const T=g.morphAttributes[y];for(let x=0,_=T.length;x<_;x++)i.remove(T[x])}g.removeEventListener("dispose",f),delete l[g.id];const S=h.get(g);S&&(i.remove(S),h.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function c(u,g){return l[g.id]===!0||(g.addEventListener("dispose",f),l[g.id]=!0,t.memory.geometries++),g}function s(u){const g=u.attributes;for(const y in g)i.update(g[y],n.ARRAY_BUFFER);const S=u.morphAttributes;for(const y in S){const T=S[y];for(let x=0,_=T.length;x<_;x++)i.update(T[x],n.ARRAY_BUFFER)}}function d(u){const g=[],S=u.index,y=u.attributes.position;let T=0;if(S!==null){const A=S.array;T=S.version;for(let w=0,j=A.length;w<j;w+=3){const R=A[w+0],L=A[w+1],D=A[w+2];g.push(R,L,L,D,D,R)}}else{const A=y.array;T=y.version;for(let w=0,j=A.length/3-1;w<j;w+=3){const R=w+0,L=w+1,D=w+2;g.push(R,L,L,D,D,R)}}const x=new((0,M.arrayNeedsUint32)(g)?m.Uint32BufferAttribute:m.Uint16BufferAttribute)(g,1);x.version=T;const _=h.get(u);_&&i.remove(_),h.set(u,x)}function p(u){const g=h.get(u);if(g){const S=u.index;S!==null&&g.version<S.version&&d(u)}else d(u);return h.get(u)}return{get:c,update:s,getWireframeAttribute:p}}},{"../../core/BufferAttribute.js":"7hhbt","../../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gLlAr:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLIndexedBufferRenderer",()=>m);function m(M,v,n,i){const t=i.isWebGL2;let r;function l(p){r=p}let h,f;function c(p){h=p.type,f=p.bytesPerElement}function s(p,u){M.drawElements(r,u,h,p*f),n.update(u,r,1)}function d(p,u,g){if(g===0)return;let S,y;if(t)S=M,y="drawElementsInstanced";else if(S=v.get("ANGLE_instanced_arrays"),y="drawElementsInstancedANGLE",S===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}S[y](r,u,h,p*f,g),n.update(u,r,g)}this.setMode=l,this.setIndex=c,this.render=s,this.renderInstances=d}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dNjRL:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLInfo",()=>m);function m(M){const v={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,l,h){switch(n.calls++,l){case M.TRIANGLES:n.triangles+=h*(r/3);break;case M.LINES:n.lines+=h*(r/2);break;case M.LINE_STRIP:n.lines+=h*(r-1);break;case M.LINE_LOOP:n.lines+=h*r;break;case M.POINTS:n.points+=h*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",l);break}}function t(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:v,render:n,programs:null,autoReset:!0,reset:t,update:i}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ejerF:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLMorphtargets",()=>r);var m=e("../../constants.js"),M=e("../../textures/DataArrayTexture.js"),v=e("../../math/Vector4.js"),n=e("../../math/Vector2.js");function i(l,h){return l[0]-h[0]}function t(l,h){return Math.abs(h[1])-Math.abs(l[1])}function r(l,h,f){const c={},s=new Float32Array(8),d=new WeakMap,p=new v.Vector4,u=[];for(let S=0;S<8;S++)u[S]=[S,0];function g(S,y,T){const x=S.morphTargetInfluences;if(h.isWebGL2===!0){const A=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,w=A!==void 0?A.length:0;let j=d.get(y);if(j===void 0||j.count!==w){let Y=function(){H.dispose(),d.delete(y),y.removeEventListener("dispose",Y)};var _=Y;j!==void 0&&j.texture.dispose();const D=y.morphAttributes.position!==void 0,P=y.morphAttributes.normal!==void 0,k=y.morphAttributes.color!==void 0,O=y.morphAttributes.position||[],F=y.morphAttributes.normal||[],G=y.morphAttributes.color||[];let b=0;D===!0&&(b=1),P===!0&&(b=2),k===!0&&(b=3);let C=y.attributes.position.count*b,I=1;C>h.maxTextureSize&&(I=Math.ceil(C/h.maxTextureSize),C=h.maxTextureSize);const B=new Float32Array(C*I*4*w),H=new M.DataArrayTexture(B,C,I,w);H.type=m.FloatType,H.needsUpdate=!0;const X=b*4;for(let Z=0;Z<w;Z++){const Q=O[Z],ne=F[Z],ge=G[Z],me=C*I*4*Z;for(let _e=0;_e<Q.count;_e++){const le=_e*X;D===!0&&(p.fromBufferAttribute(Q,_e),B[me+le+0]=p.x,B[me+le+1]=p.y,B[me+le+2]=p.z,B[me+le+3]=0),P===!0&&(p.fromBufferAttribute(ne,_e),B[me+le+4]=p.x,B[me+le+5]=p.y,B[me+le+6]=p.z,B[me+le+7]=0),k===!0&&(p.fromBufferAttribute(ge,_e),B[me+le+8]=p.x,B[me+le+9]=p.y,B[me+le+10]=p.z,B[me+le+11]=ge.itemSize===4?p.w:1)}}j={count:w,texture:H,size:new n.Vector2(C,I)},d.set(y,j),y.addEventListener("dispose",Y)}let R=0;for(let D=0;D<x.length;D++)R+=x[D];const L=y.morphTargetsRelative?1:1-R;T.getUniforms().setValue(l,"morphTargetBaseInfluence",L),T.getUniforms().setValue(l,"morphTargetInfluences",x),T.getUniforms().setValue(l,"morphTargetsTexture",j.texture,f),T.getUniforms().setValue(l,"morphTargetsTextureSize",j.size)}else{const A=x===void 0?0:x.length;let w=c[y.id];if(w===void 0||w.length!==A){w=[];for(let P=0;P<A;P++)w[P]=[P,0];c[y.id]=w}for(let P=0;P<A;P++){const k=w[P];k[0]=P,k[1]=x[P]}w.sort(t);for(let P=0;P<8;P++)P<A&&w[P][1]?(u[P][0]=w[P][0],u[P][1]=w[P][1]):(u[P][0]=Number.MAX_SAFE_INTEGER,u[P][1]=0);u.sort(i);const j=y.morphAttributes.position,R=y.morphAttributes.normal;let L=0;for(let P=0;P<8;P++){const k=u[P],O=k[0],F=k[1];O!==Number.MAX_SAFE_INTEGER&&F?(j&&y.getAttribute("morphTarget"+P)!==j[O]&&y.setAttribute("morphTarget"+P,j[O]),R&&y.getAttribute("morphNormal"+P)!==R[O]&&y.setAttribute("morphNormal"+P,R[O]),s[P]=F,L+=F):(j&&y.hasAttribute("morphTarget"+P)===!0&&y.deleteAttribute("morphTarget"+P),R&&y.hasAttribute("morphNormal"+P)===!0&&y.deleteAttribute("morphNormal"+P),s[P]=0)}const D=y.morphTargetsRelative?1:1-L;T.getUniforms().setValue(l,"morphTargetBaseInfluence",D),T.getUniforms().setValue(l,"morphTargetInfluences",s)}}return{update:g}}},{"../../constants.js":"bqsVL","../../textures/DataArrayTexture.js":"aY9tP","../../math/Vector4.js":"h0tSe","../../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2ZIqK":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLObjects",()=>m);function m(M,v,n,i){let t=new WeakMap;function r(f){const c=i.render.frame,s=f.geometry,d=v.get(f,s);if(t.get(d)!==c&&(v.update(d),t.set(d,c)),f.isInstancedMesh&&(f.hasEventListener("dispose",h)===!1&&f.addEventListener("dispose",h),t.get(f)!==c&&(n.update(f.instanceMatrix,M.ARRAY_BUFFER),f.instanceColor!==null&&n.update(f.instanceColor,M.ARRAY_BUFFER),t.set(f,c))),f.isSkinnedMesh){const p=f.skeleton;t.get(p)!==c&&(p.update(),t.set(p,c))}return d}function l(){t=new WeakMap}function h(f){const c=f.target;c.removeEventListener("dispose",h),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:r,dispose:l}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],l4goT:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLPrograms",()=>r);var m=e("../../constants.js"),M=e("../../core/Layers.js"),v=e("./WebGLProgram.js"),n=e("./WebGLShaderCache.js"),i=e("../shaders/ShaderLib.js"),t=e("../shaders/UniformsUtils.js");function r(l,h,f,c,s,d,p){const u=new M.Layers,g=new n.WebGLShaderCache,S=[],y=s.isWebGL2,T=s.logarithmicDepthBuffer,x=s.vertexTextures;let _=s.precision;const A={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(b){return b===0?"uv":`uv${b}`}function j(b,C,I,B,H){const X=B.fog,Y=H.geometry,Z=b.isMeshStandardMaterial?B.environment:null,Q=(b.isMeshStandardMaterial?f:h).get(b.envMap||Z),ne=!!Q&&Q.mapping===m.CubeUVReflectionMapping?Q.image.height:null,ge=A[b.type];b.precision!==null&&(_=s.getMaxPrecision(b.precision),_!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",_,"instead."));const me=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,_e=me!==void 0?me.length:0;let le=0;Y.morphAttributes.position!==void 0&&(le=1),Y.morphAttributes.normal!==void 0&&(le=2),Y.morphAttributes.color!==void 0&&(le=3);let ee,je,z,$;if(ge){const $e=i.ShaderLib[ge];ee=$e.vertexShader,je=$e.fragmentShader}else ee=b.vertexShader,je=b.fragmentShader,g.update(b),z=g.getVertexShaderID(b),$=g.getFragmentShaderID(b);const se=l.getRenderTarget(),ie=H.isInstancedMesh===!0,te=!!b.map,q=!!b.matcap,ce=!!Q,xe=!!b.aoMap,we=!!b.lightMap,Ee=!!b.bumpMap,ae=!!b.normalMap,be=!!b.displacementMap,Se=!!b.emissiveMap,Ae=!!b.metalnessMap,Ce=!!b.roughnessMap,Be=b.anisotropy>0,U=b.clearcoat>0,E=b.iridescence>0,V=b.sheen>0,re=b.transmission>0,ue=Be&&!!b.anisotropyMap,J=U&&!!b.clearcoatMap,fe=U&&!!b.clearcoatNormalMap,Te=U&&!!b.clearcoatRoughnessMap,pe=E&&!!b.iridescenceMap,Ie=E&&!!b.iridescenceThicknessMap,ke=V&&!!b.sheenColorMap,De=V&&!!b.sheenRoughnessMap,Ge=!!b.specularMap,Ue=!!b.specularColorMap,K=!!b.specularIntensityMap,Le=re&&!!b.transmissionMap,Re=re&&!!b.thicknessMap,Pe=!!b.gradientMap,ve=!!b.alphaMap,Ne=b.alphaTest>0,Oe=!!b.alphaHash,Ke=!!b.extensions,dt=!!Y.attributes.uv1,he=!!Y.attributes.uv2,ot=!!Y.attributes.uv3;return{isWebGL2:y,shaderID:ge,shaderType:b.type,shaderName:b.name,vertexShader:ee,fragmentShader:je,defines:b.defines,customVertexShaderID:z,customFragmentShaderID:$,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:_,instancing:ie,instancingColor:ie&&H.instanceColor!==null,supportsVertexTextures:x,outputColorSpace:se===null?l.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:m.LinearSRGBColorSpace,map:te,matcap:q,envMap:ce,envMapMode:ce&&Q.mapping,envMapCubeUVHeight:ne,aoMap:xe,lightMap:we,bumpMap:Ee,normalMap:ae,displacementMap:x&&be,emissiveMap:Se,normalMapObjectSpace:ae&&b.normalMapType===m.ObjectSpaceNormalMap,normalMapTangentSpace:ae&&b.normalMapType===m.TangentSpaceNormalMap,metalnessMap:Ae,roughnessMap:Ce,anisotropy:Be,anisotropyMap:ue,clearcoat:U,clearcoatMap:J,clearcoatNormalMap:fe,clearcoatRoughnessMap:Te,iridescence:E,iridescenceMap:pe,iridescenceThicknessMap:Ie,sheen:V,sheenColorMap:ke,sheenRoughnessMap:De,specularMap:Ge,specularColorMap:Ue,specularIntensityMap:K,transmission:re,transmissionMap:Le,thicknessMap:Re,gradientMap:Pe,opaque:b.transparent===!1&&b.blending===m.NormalBlending,alphaMap:ve,alphaTest:Ne,alphaHash:Oe,combine:b.combine,mapUv:te&&w(b.map.channel),aoMapUv:xe&&w(b.aoMap.channel),lightMapUv:we&&w(b.lightMap.channel),bumpMapUv:Ee&&w(b.bumpMap.channel),normalMapUv:ae&&w(b.normalMap.channel),displacementMapUv:be&&w(b.displacementMap.channel),emissiveMapUv:Se&&w(b.emissiveMap.channel),metalnessMapUv:Ae&&w(b.metalnessMap.channel),roughnessMapUv:Ce&&w(b.roughnessMap.channel),anisotropyMapUv:ue&&w(b.anisotropyMap.channel),clearcoatMapUv:J&&w(b.clearcoatMap.channel),clearcoatNormalMapUv:fe&&w(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&w(b.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&w(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&w(b.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&w(b.sheenColorMap.channel),sheenRoughnessMapUv:De&&w(b.sheenRoughnessMap.channel),specularMapUv:Ge&&w(b.specularMap.channel),specularColorMapUv:Ue&&w(b.specularColorMap.channel),specularIntensityMapUv:K&&w(b.specularIntensityMap.channel),transmissionMapUv:Le&&w(b.transmissionMap.channel),thicknessMapUv:Re&&w(b.thicknessMap.channel),alphaMapUv:ve&&w(b.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ae||Be),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,vertexUv1s:dt,vertexUv2s:he,vertexUv3s:ot,pointsUvs:H.isPoints===!0&&!!Y.attributes.uv&&(te||ve),fog:!!X,useFog:b.fog===!0,fogExp2:X&&X.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:T,skinning:H.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:le,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numClippingPlanes:p.numPlanes,numClipIntersection:p.numIntersection,dithering:b.dithering,shadowMapEnabled:l.shadowMap.enabled&&I.length>0,shadowMapType:l.shadowMap.type,toneMapping:b.toneMapped?l.toneMapping:m.NoToneMapping,useLegacyLights:l.useLegacyLights,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===m.DoubleSide,flipSided:b.side===m.BackSide,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:Ke&&b.extensions.derivatives===!0,extensionFragDepth:Ke&&b.extensions.fragDepth===!0,extensionDrawBuffers:Ke&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:Ke&&b.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:y||c.has("EXT_frag_depth"),rendererExtensionDrawBuffers:y||c.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:y||c.has("EXT_shader_texture_lod"),customProgramCacheKey:b.customProgramCacheKey()}}function R(b){const C=[];if(b.shaderID?C.push(b.shaderID):(C.push(b.customVertexShaderID),C.push(b.customFragmentShaderID)),b.defines!==void 0)for(const I in b.defines)C.push(I),C.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(L(C,b),D(C,b),C.push(l.outputColorSpace)),C.push(b.customProgramCacheKey),C.join()}function L(b,C){b.push(C.precision),b.push(C.outputColorSpace),b.push(C.envMapMode),b.push(C.envMapCubeUVHeight),b.push(C.mapUv),b.push(C.alphaMapUv),b.push(C.lightMapUv),b.push(C.aoMapUv),b.push(C.bumpMapUv),b.push(C.normalMapUv),b.push(C.displacementMapUv),b.push(C.emissiveMapUv),b.push(C.metalnessMapUv),b.push(C.roughnessMapUv),b.push(C.anisotropyMapUv),b.push(C.clearcoatMapUv),b.push(C.clearcoatNormalMapUv),b.push(C.clearcoatRoughnessMapUv),b.push(C.iridescenceMapUv),b.push(C.iridescenceThicknessMapUv),b.push(C.sheenColorMapUv),b.push(C.sheenRoughnessMapUv),b.push(C.specularMapUv),b.push(C.specularColorMapUv),b.push(C.specularIntensityMapUv),b.push(C.transmissionMapUv),b.push(C.thicknessMapUv),b.push(C.combine),b.push(C.fogExp2),b.push(C.sizeAttenuation),b.push(C.morphTargetsCount),b.push(C.morphAttributeCount),b.push(C.numDirLights),b.push(C.numPointLights),b.push(C.numSpotLights),b.push(C.numSpotLightMaps),b.push(C.numHemiLights),b.push(C.numRectAreaLights),b.push(C.numDirLightShadows),b.push(C.numPointLightShadows),b.push(C.numSpotLightShadows),b.push(C.numSpotLightShadowsWithMaps),b.push(C.shadowMapType),b.push(C.toneMapping),b.push(C.numClippingPlanes),b.push(C.numClipIntersection),b.push(C.depthPacking)}function D(b,C){u.disableAll(),C.isWebGL2&&u.enable(0),C.supportsVertexTextures&&u.enable(1),C.instancing&&u.enable(2),C.instancingColor&&u.enable(3),C.matcap&&u.enable(4),C.envMap&&u.enable(5),C.normalMapObjectSpace&&u.enable(6),C.normalMapTangentSpace&&u.enable(7),C.clearcoat&&u.enable(8),C.iridescence&&u.enable(9),C.alphaTest&&u.enable(10),C.vertexColors&&u.enable(11),C.vertexAlphas&&u.enable(12),C.vertexUv1s&&u.enable(13),C.vertexUv2s&&u.enable(14),C.vertexUv3s&&u.enable(15),C.vertexTangents&&u.enable(16),C.anisotropy&&u.enable(17),b.push(u.mask),u.disableAll(),C.fog&&u.enable(0),C.useFog&&u.enable(1),C.flatShading&&u.enable(2),C.logarithmicDepthBuffer&&u.enable(3),C.skinning&&u.enable(4),C.morphTargets&&u.enable(5),C.morphNormals&&u.enable(6),C.morphColors&&u.enable(7),C.premultipliedAlpha&&u.enable(8),C.shadowMapEnabled&&u.enable(9),C.useLegacyLights&&u.enable(10),C.doubleSided&&u.enable(11),C.flipSided&&u.enable(12),C.useDepthPacking&&u.enable(13),C.dithering&&u.enable(14),C.transmission&&u.enable(15),C.sheen&&u.enable(16),C.opaque&&u.enable(17),C.pointsUvs&&u.enable(18),b.push(u.mask)}function P(b){const C=A[b.type];let I;if(C){const B=i.ShaderLib[C];I=t.UniformsUtils.clone(B.uniforms)}else I=b.uniforms;return I}function k(b,C){let I;for(let B=0,H=S.length;B<H;B++){const X=S[B];if(X.cacheKey===C){I=X,++I.usedTimes;break}}return I===void 0&&(I=new v.WebGLProgram(l,C,b,d),S.push(I)),I}function O(b){if(--b.usedTimes==0){const C=S.indexOf(b);S[C]=S[S.length-1],S.pop(),b.destroy()}}function F(b){g.remove(b)}function G(){g.dispose()}return{getParameters:j,getProgramCacheKey:R,getUniforms:P,acquireProgram:k,releaseProgram:O,releaseShaderCache:F,programs:S,dispose:G}}},{"../../constants.js":"bqsVL","../../core/Layers.js":"4RZ6C","./WebGLProgram.js":"go4lX","./WebGLShaderCache.js":"6htbX","../shaders/ShaderLib.js":"lxrgR","../shaders/UniformsUtils.js":"4tBjA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],go4lX:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLProgram",()=>O);var m=e("./WebGLUniforms.js"),M=e("./WebGLShader.js"),v=e("../shaders/ShaderChunk.js"),n=e("../../constants.js");let i=0;function t(F,G){const b=F.split(`
`),C=[],I=Math.max(G-6,0),B=Math.min(G+6,b.length);for(let H=I;H<B;H++){const X=H+1;C.push(`${X===G?">":" "} ${X}: ${b[H]}`)}return C.join(`
`)}function r(F){switch(F){case n.LinearSRGBColorSpace:return["Linear","( value )"];case n.SRGBColorSpace:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",F),["Linear","( value )"]}}function l(F,G,b){const C=F.getShaderParameter(G,F.COMPILE_STATUS),I=F.getShaderInfoLog(G).trim();if(C&&I==="")return"";const B=/ERROR: 0:(\d+)/.exec(I);if(B){const H=parseInt(B[1]);return b.toUpperCase()+`

`+I+`

`+t(F.getShaderSource(G),H)}else return I}function h(F,G){const b=r(G);return"vec4 "+F+"( vec4 value ) { return LinearTo"+b[0]+b[1]+"; }"}function f(F,G){let b;switch(G){case n.LinearToneMapping:b="Linear";break;case n.ReinhardToneMapping:b="Reinhard";break;case n.CineonToneMapping:b="OptimizedCineon";break;case n.ACESFilmicToneMapping:b="ACESFilmic";break;case n.CustomToneMapping:b="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",G),b="Linear"}return"vec3 "+F+"( vec3 color ) { return "+b+"ToneMapping( color ); }"}function c(F){return[F.extensionDerivatives||!!F.envMapCubeUVHeight||F.bumpMap||F.normalMapTangentSpace||F.clearcoatNormalMap||F.flatShading||F.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(F.extensionFragDepth||F.logarithmicDepthBuffer)&&F.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",F.extensionDrawBuffers&&F.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(F.extensionShaderTextureLOD||F.envMap||F.transmission)&&F.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(p).join(`
`)}function s(F){const G=[];for(const b in F){const C=F[b];C!==!1&&G.push("#define "+b+" "+C)}return G.join(`
`)}function d(F,G){const b={},C=F.getProgramParameter(G,F.ACTIVE_ATTRIBUTES);for(let I=0;I<C;I++){const B=F.getActiveAttrib(G,I),H=B.name;let X=1;B.type===F.FLOAT_MAT2&&(X=2),B.type===F.FLOAT_MAT3&&(X=3),B.type===F.FLOAT_MAT4&&(X=4),b[H]={type:B.type,location:F.getAttribLocation(G,H),locationSize:X}}return b}function p(F){return F!==""}function u(F,G){const b=G.numSpotLightShadows+G.numSpotLightMaps-G.numSpotLightShadowsWithMaps;return F.replace(/NUM_DIR_LIGHTS/g,G.numDirLights).replace(/NUM_SPOT_LIGHTS/g,G.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,G.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,b).replace(/NUM_RECT_AREA_LIGHTS/g,G.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,G.numPointLights).replace(/NUM_HEMI_LIGHTS/g,G.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,G.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,G.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,G.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,G.numPointLightShadows)}function g(F,G){return F.replace(/NUM_CLIPPING_PLANES/g,G.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,G.numClippingPlanes-G.numClipIntersection)}const S=/^[ \t]*#include +<([\w\d./]+)>/gm;function y(F){return F.replace(S,x)}const T=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function x(F,G){let b=v.ShaderChunk[G];if(b===void 0){const C=T.get(G);if(C!==void 0)b=v.ShaderChunk[C],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',G,C);else throw new Error("Can not resolve #include <"+G+">")}return y(b)}const _=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function A(F){return F.replace(_,w)}function w(F,G,b,C){let I="";for(let B=parseInt(G);B<parseInt(b);B++)I+=C.replace(/\[\s*i\s*\]/g,"[ "+B+" ]").replace(/UNROLLED_LOOP_INDEX/g,B);return I}function j(F){let G="precision "+F.precision+` float;
precision `+F.precision+" int;";return F.precision==="highp"?G+=`
#define HIGH_PRECISION`:F.precision==="mediump"?G+=`
#define MEDIUM_PRECISION`:F.precision==="lowp"&&(G+=`
#define LOW_PRECISION`),G}function R(F){let G="SHADOWMAP_TYPE_BASIC";return F.shadowMapType===n.PCFShadowMap?G="SHADOWMAP_TYPE_PCF":F.shadowMapType===n.PCFSoftShadowMap?G="SHADOWMAP_TYPE_PCF_SOFT":F.shadowMapType===n.VSMShadowMap&&(G="SHADOWMAP_TYPE_VSM"),G}function L(F){let G="ENVMAP_TYPE_CUBE";if(F.envMap)switch(F.envMapMode){case n.CubeReflectionMapping:case n.CubeRefractionMapping:G="ENVMAP_TYPE_CUBE";break;case n.CubeUVReflectionMapping:G="ENVMAP_TYPE_CUBE_UV";break}return G}function D(F){let G="ENVMAP_MODE_REFLECTION";if(F.envMap)switch(F.envMapMode){case n.CubeRefractionMapping:G="ENVMAP_MODE_REFRACTION";break}return G}function P(F){let G="ENVMAP_BLENDING_NONE";if(F.envMap)switch(F.combine){case n.MultiplyOperation:G="ENVMAP_BLENDING_MULTIPLY";break;case n.MixOperation:G="ENVMAP_BLENDING_MIX";break;case n.AddOperation:G="ENVMAP_BLENDING_ADD";break}return G}function k(F){const G=F.envMapCubeUVHeight;if(G===null)return null;const b=Math.log2(G)-2,C=1/G;return{texelWidth:1/(3*Math.max(Math.pow(2,b),112)),texelHeight:C,maxMip:b}}function O(F,G,b,C){const I=F.getContext(),B=b.defines;let H=b.vertexShader,X=b.fragmentShader;const Y=R(b),Z=L(b),Q=D(b),ne=P(b),ge=k(b),me=b.isWebGL2?"":c(b),_e=s(B),le=I.createProgram();let ee,je,z=b.glslVersion?"#version "+b.glslVersion+`
`:"";b.isRawShaderMaterial?(ee=["#define SHADER_TYPE "+b.shaderType,"#define SHADER_NAME "+b.shaderName,_e].filter(p).join(`
`),ee.length>0&&(ee+=`
`),je=[me,"#define SHADER_TYPE "+b.shaderType,"#define SHADER_NAME "+b.shaderName,_e].filter(p).join(`
`),je.length>0&&(je+=`
`)):(ee=[j(b),"#define SHADER_TYPE "+b.shaderType,"#define SHADER_NAME "+b.shaderName,_e,b.instancing?"#define USE_INSTANCING":"",b.instancingColor?"#define USE_INSTANCING_COLOR":"",b.useFog&&b.fog?"#define USE_FOG":"",b.useFog&&b.fogExp2?"#define FOG_EXP2":"",b.map?"#define USE_MAP":"",b.envMap?"#define USE_ENVMAP":"",b.envMap?"#define "+Q:"",b.lightMap?"#define USE_LIGHTMAP":"",b.aoMap?"#define USE_AOMAP":"",b.bumpMap?"#define USE_BUMPMAP":"",b.normalMap?"#define USE_NORMALMAP":"",b.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",b.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",b.displacementMap?"#define USE_DISPLACEMENTMAP":"",b.emissiveMap?"#define USE_EMISSIVEMAP":"",b.anisotropyMap?"#define USE_ANISOTROPYMAP":"",b.clearcoatMap?"#define USE_CLEARCOATMAP":"",b.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",b.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",b.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",b.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",b.specularMap?"#define USE_SPECULARMAP":"",b.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",b.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",b.roughnessMap?"#define USE_ROUGHNESSMAP":"",b.metalnessMap?"#define USE_METALNESSMAP":"",b.alphaMap?"#define USE_ALPHAMAP":"",b.alphaHash?"#define USE_ALPHAHASH":"",b.transmission?"#define USE_TRANSMISSION":"",b.transmissionMap?"#define USE_TRANSMISSIONMAP":"",b.thicknessMap?"#define USE_THICKNESSMAP":"",b.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",b.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",b.mapUv?"#define MAP_UV "+b.mapUv:"",b.alphaMapUv?"#define ALPHAMAP_UV "+b.alphaMapUv:"",b.lightMapUv?"#define LIGHTMAP_UV "+b.lightMapUv:"",b.aoMapUv?"#define AOMAP_UV "+b.aoMapUv:"",b.emissiveMapUv?"#define EMISSIVEMAP_UV "+b.emissiveMapUv:"",b.bumpMapUv?"#define BUMPMAP_UV "+b.bumpMapUv:"",b.normalMapUv?"#define NORMALMAP_UV "+b.normalMapUv:"",b.displacementMapUv?"#define DISPLACEMENTMAP_UV "+b.displacementMapUv:"",b.metalnessMapUv?"#define METALNESSMAP_UV "+b.metalnessMapUv:"",b.roughnessMapUv?"#define ROUGHNESSMAP_UV "+b.roughnessMapUv:"",b.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+b.anisotropyMapUv:"",b.clearcoatMapUv?"#define CLEARCOATMAP_UV "+b.clearcoatMapUv:"",b.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+b.clearcoatNormalMapUv:"",b.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+b.clearcoatRoughnessMapUv:"",b.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+b.iridescenceMapUv:"",b.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+b.iridescenceThicknessMapUv:"",b.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+b.sheenColorMapUv:"",b.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+b.sheenRoughnessMapUv:"",b.specularMapUv?"#define SPECULARMAP_UV "+b.specularMapUv:"",b.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+b.specularColorMapUv:"",b.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+b.specularIntensityMapUv:"",b.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+b.transmissionMapUv:"",b.thicknessMapUv?"#define THICKNESSMAP_UV "+b.thicknessMapUv:"",b.vertexTangents&&b.flatShading===!1?"#define USE_TANGENT":"",b.vertexColors?"#define USE_COLOR":"",b.vertexAlphas?"#define USE_COLOR_ALPHA":"",b.vertexUv1s?"#define USE_UV1":"",b.vertexUv2s?"#define USE_UV2":"",b.vertexUv3s?"#define USE_UV3":"",b.pointsUvs?"#define USE_POINTS_UV":"",b.flatShading?"#define FLAT_SHADED":"",b.skinning?"#define USE_SKINNING":"",b.morphTargets?"#define USE_MORPHTARGETS":"",b.morphNormals&&b.flatShading===!1?"#define USE_MORPHNORMALS":"",b.morphColors&&b.isWebGL2?"#define USE_MORPHCOLORS":"",b.morphTargetsCount>0&&b.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",b.morphTargetsCount>0&&b.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+b.morphTextureStride:"",b.morphTargetsCount>0&&b.isWebGL2?"#define MORPHTARGETS_COUNT "+b.morphTargetsCount:"",b.doubleSided?"#define DOUBLE_SIDED":"",b.flipSided?"#define FLIP_SIDED":"",b.shadowMapEnabled?"#define USE_SHADOWMAP":"",b.shadowMapEnabled?"#define "+Y:"",b.sizeAttenuation?"#define USE_SIZEATTENUATION":"",b.useLegacyLights?"#define LEGACY_LIGHTS":"",b.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",b.logarithmicDepthBuffer&&b.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(p).join(`
`),je=[me,j(b),"#define SHADER_TYPE "+b.shaderType,"#define SHADER_NAME "+b.shaderName,_e,b.useFog&&b.fog?"#define USE_FOG":"",b.useFog&&b.fogExp2?"#define FOG_EXP2":"",b.map?"#define USE_MAP":"",b.matcap?"#define USE_MATCAP":"",b.envMap?"#define USE_ENVMAP":"",b.envMap?"#define "+Z:"",b.envMap?"#define "+Q:"",b.envMap?"#define "+ne:"",ge?"#define CUBEUV_TEXEL_WIDTH "+ge.texelWidth:"",ge?"#define CUBEUV_TEXEL_HEIGHT "+ge.texelHeight:"",ge?"#define CUBEUV_MAX_MIP "+ge.maxMip+".0":"",b.lightMap?"#define USE_LIGHTMAP":"",b.aoMap?"#define USE_AOMAP":"",b.bumpMap?"#define USE_BUMPMAP":"",b.normalMap?"#define USE_NORMALMAP":"",b.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",b.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",b.emissiveMap?"#define USE_EMISSIVEMAP":"",b.anisotropy?"#define USE_ANISOTROPY":"",b.anisotropyMap?"#define USE_ANISOTROPYMAP":"",b.clearcoat?"#define USE_CLEARCOAT":"",b.clearcoatMap?"#define USE_CLEARCOATMAP":"",b.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",b.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",b.iridescence?"#define USE_IRIDESCENCE":"",b.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",b.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",b.specularMap?"#define USE_SPECULARMAP":"",b.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",b.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",b.roughnessMap?"#define USE_ROUGHNESSMAP":"",b.metalnessMap?"#define USE_METALNESSMAP":"",b.alphaMap?"#define USE_ALPHAMAP":"",b.alphaTest?"#define USE_ALPHATEST":"",b.alphaHash?"#define USE_ALPHAHASH":"",b.sheen?"#define USE_SHEEN":"",b.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",b.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",b.transmission?"#define USE_TRANSMISSION":"",b.transmissionMap?"#define USE_TRANSMISSIONMAP":"",b.thicknessMap?"#define USE_THICKNESSMAP":"",b.vertexTangents&&b.flatShading===!1?"#define USE_TANGENT":"",b.vertexColors||b.instancingColor?"#define USE_COLOR":"",b.vertexAlphas?"#define USE_COLOR_ALPHA":"",b.vertexUv1s?"#define USE_UV1":"",b.vertexUv2s?"#define USE_UV2":"",b.vertexUv3s?"#define USE_UV3":"",b.pointsUvs?"#define USE_POINTS_UV":"",b.gradientMap?"#define USE_GRADIENTMAP":"",b.flatShading?"#define FLAT_SHADED":"",b.doubleSided?"#define DOUBLE_SIDED":"",b.flipSided?"#define FLIP_SIDED":"",b.shadowMapEnabled?"#define USE_SHADOWMAP":"",b.shadowMapEnabled?"#define "+Y:"",b.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",b.useLegacyLights?"#define LEGACY_LIGHTS":"",b.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",b.logarithmicDepthBuffer&&b.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",b.toneMapping!==n.NoToneMapping?"#define TONE_MAPPING":"",b.toneMapping!==n.NoToneMapping?v.ShaderChunk.tonemapping_pars_fragment:"",b.toneMapping!==n.NoToneMapping?f("toneMapping",b.toneMapping):"",b.dithering?"#define DITHERING":"",b.opaque?"#define OPAQUE":"",v.ShaderChunk.colorspace_pars_fragment,h("linearToOutputTexel",b.outputColorSpace),b.useDepthPacking?"#define DEPTH_PACKING "+b.depthPacking:"",`
`].filter(p).join(`
`)),H=y(H),H=u(H,b),H=g(H,b),X=y(X),X=u(X,b),X=g(X,b),H=A(H),X=A(X),b.isWebGL2&&b.isRawShaderMaterial!==!0&&(z=`#version 300 es
`,ee=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+ee,je=["#define varying in",b.glslVersion===n.GLSL3?"":"layout(location = 0) out highp vec4 pc_fragColor;",b.glslVersion===n.GLSL3?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+je);const $=z+ee+H,se=z+je+X,ie=(0,M.WebGLShader)(I,I.VERTEX_SHADER,$),te=(0,M.WebGLShader)(I,I.FRAGMENT_SHADER,se);if(I.attachShader(le,ie),I.attachShader(le,te),b.index0AttributeName!==void 0?I.bindAttribLocation(le,0,b.index0AttributeName):b.morphTargets===!0&&I.bindAttribLocation(le,0,"position"),I.linkProgram(le),F.debug.checkShaderErrors){const xe=I.getProgramInfoLog(le).trim(),we=I.getShaderInfoLog(ie).trim(),Ee=I.getShaderInfoLog(te).trim();let ae=!0,be=!0;if(I.getProgramParameter(le,I.LINK_STATUS)===!1)if(ae=!1,typeof F.debug.onShaderError=="function")F.debug.onShaderError(I,le,ie,te);else{const Se=l(I,ie,"vertex"),Ae=l(I,te,"fragment");console.error("THREE.WebGLProgram: Shader Error "+I.getError()+" - VALIDATE_STATUS "+I.getProgramParameter(le,I.VALIDATE_STATUS)+`

Program Info Log: `+xe+`
`+Se+`
`+Ae)}else xe!==""?console.warn("THREE.WebGLProgram: Program Info Log:",xe):(we===""||Ee==="")&&(be=!1);be&&(this.diagnostics={runnable:ae,programLog:xe,vertexShader:{log:we,prefix:ee},fragmentShader:{log:Ee,prefix:je}})}I.deleteShader(ie),I.deleteShader(te);let q;this.getUniforms=function(){return q===void 0&&(q=new m.WebGLUniforms(I,le)),q};let ce;return this.getAttributes=function(){return ce===void 0&&(ce=d(I,le)),ce},this.destroy=function(){C.releaseStatesOfProgram(this),I.deleteProgram(le),this.program=void 0},this.type=b.shaderType,this.name=b.shaderName,this.id=i++,this.cacheKey=G,this.usedTimes=1,this.program=le,this.vertexShader=ie,this.fragmentShader=te,this}},{"./WebGLUniforms.js":"e624H","./WebGLShader.js":"bjgjd","../shaders/ShaderChunk.js":"3CV51","../../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e624H:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLUniforms",()=>Be);var m=e("../../textures/CubeTexture.js"),M=e("../../textures/Texture.js"),v=e("../../textures/DataArrayTexture.js"),n=e("../../textures/Data3DTexture.js");const i=new M.Texture,t=new v.DataArrayTexture,r=new n.Data3DTexture,l=new m.CubeTexture,h=[],f=[],c=new Float32Array(16),s=new Float32Array(9),d=new Float32Array(4);function p(U,E,V){const re=U[0];if(re<=0||re>0)return U;const ue=E*V;let J=h[ue];if(J===void 0&&(J=new Float32Array(ue),h[ue]=J),E!==0){re.toArray(J,0);for(let fe=1,Te=0;fe!==E;++fe)Te+=V,U[fe].toArray(J,Te)}return J}function u(U,E){if(U.length!==E.length)return!1;for(let V=0,re=U.length;V<re;V++)if(U[V]!==E[V])return!1;return!0}function g(U,E){for(let V=0,re=E.length;V<re;V++)U[V]=E[V]}function S(U,E){let V=f[E];V===void 0&&(V=new Int32Array(E),f[E]=V);for(let re=0;re!==E;++re)V[re]=U.allocateTextureUnit();return V}function y(U,E){const V=this.cache;V[0]!==E&&(U.uniform1f(this.addr,E),V[0]=E)}function T(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y)&&(U.uniform2f(this.addr,E.x,E.y),V[0]=E.x,V[1]=E.y);else{if(u(V,E))return;U.uniform2fv(this.addr,E),g(V,E)}}function x(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z)&&(U.uniform3f(this.addr,E.x,E.y,E.z),V[0]=E.x,V[1]=E.y,V[2]=E.z);else if(E.r!==void 0)(V[0]!==E.r||V[1]!==E.g||V[2]!==E.b)&&(U.uniform3f(this.addr,E.r,E.g,E.b),V[0]=E.r,V[1]=E.g,V[2]=E.b);else{if(u(V,E))return;U.uniform3fv(this.addr,E),g(V,E)}}function _(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z||V[3]!==E.w)&&(U.uniform4f(this.addr,E.x,E.y,E.z,E.w),V[0]=E.x,V[1]=E.y,V[2]=E.z,V[3]=E.w);else{if(u(V,E))return;U.uniform4fv(this.addr,E),g(V,E)}}function A(U,E){const V=this.cache,re=E.elements;if(re===void 0){if(u(V,E))return;U.uniformMatrix2fv(this.addr,!1,E),g(V,E)}else{if(u(V,re))return;d.set(re),U.uniformMatrix2fv(this.addr,!1,d),g(V,re)}}function w(U,E){const V=this.cache,re=E.elements;if(re===void 0){if(u(V,E))return;U.uniformMatrix3fv(this.addr,!1,E),g(V,E)}else{if(u(V,re))return;s.set(re),U.uniformMatrix3fv(this.addr,!1,s),g(V,re)}}function j(U,E){const V=this.cache,re=E.elements;if(re===void 0){if(u(V,E))return;U.uniformMatrix4fv(this.addr,!1,E),g(V,E)}else{if(u(V,re))return;c.set(re),U.uniformMatrix4fv(this.addr,!1,c),g(V,re)}}function R(U,E){const V=this.cache;V[0]!==E&&(U.uniform1i(this.addr,E),V[0]=E)}function L(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y)&&(U.uniform2i(this.addr,E.x,E.y),V[0]=E.x,V[1]=E.y);else{if(u(V,E))return;U.uniform2iv(this.addr,E),g(V,E)}}function D(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z)&&(U.uniform3i(this.addr,E.x,E.y,E.z),V[0]=E.x,V[1]=E.y,V[2]=E.z);else{if(u(V,E))return;U.uniform3iv(this.addr,E),g(V,E)}}function P(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z||V[3]!==E.w)&&(U.uniform4i(this.addr,E.x,E.y,E.z,E.w),V[0]=E.x,V[1]=E.y,V[2]=E.z,V[3]=E.w);else{if(u(V,E))return;U.uniform4iv(this.addr,E),g(V,E)}}function k(U,E){const V=this.cache;V[0]!==E&&(U.uniform1ui(this.addr,E),V[0]=E)}function O(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y)&&(U.uniform2ui(this.addr,E.x,E.y),V[0]=E.x,V[1]=E.y);else{if(u(V,E))return;U.uniform2uiv(this.addr,E),g(V,E)}}function F(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z)&&(U.uniform3ui(this.addr,E.x,E.y,E.z),V[0]=E.x,V[1]=E.y,V[2]=E.z);else{if(u(V,E))return;U.uniform3uiv(this.addr,E),g(V,E)}}function G(U,E){const V=this.cache;if(E.x!==void 0)(V[0]!==E.x||V[1]!==E.y||V[2]!==E.z||V[3]!==E.w)&&(U.uniform4ui(this.addr,E.x,E.y,E.z,E.w),V[0]=E.x,V[1]=E.y,V[2]=E.z,V[3]=E.w);else{if(u(V,E))return;U.uniform4uiv(this.addr,E),g(V,E)}}function b(U,E,V){const re=this.cache,ue=V.allocateTextureUnit();re[0]!==ue&&(U.uniform1i(this.addr,ue),re[0]=ue),V.setTexture2D(E||i,ue)}function C(U,E,V){const re=this.cache,ue=V.allocateTextureUnit();re[0]!==ue&&(U.uniform1i(this.addr,ue),re[0]=ue),V.setTexture3D(E||r,ue)}function I(U,E,V){const re=this.cache,ue=V.allocateTextureUnit();re[0]!==ue&&(U.uniform1i(this.addr,ue),re[0]=ue),V.setTextureCube(E||l,ue)}function B(U,E,V){const re=this.cache,ue=V.allocateTextureUnit();re[0]!==ue&&(U.uniform1i(this.addr,ue),re[0]=ue),V.setTexture2DArray(E||t,ue)}function H(U){switch(U){case 5126:return y;case 35664:return T;case 35665:return x;case 35666:return _;case 35674:return A;case 35675:return w;case 35676:return j;case 5124:case 35670:return R;case 35667:case 35671:return L;case 35668:case 35672:return D;case 35669:case 35673:return P;case 5125:return k;case 36294:return O;case 36295:return F;case 36296:return G;case 35678:case 36198:case 36298:case 36306:case 35682:return b;case 35679:case 36299:case 36307:return C;case 35680:case 36300:case 36308:case 36293:return I;case 36289:case 36303:case 36311:case 36292:return B}}function X(U,E){U.uniform1fv(this.addr,E)}function Y(U,E){const V=p(E,this.size,2);U.uniform2fv(this.addr,V)}function Z(U,E){const V=p(E,this.size,3);U.uniform3fv(this.addr,V)}function Q(U,E){const V=p(E,this.size,4);U.uniform4fv(this.addr,V)}function ne(U,E){const V=p(E,this.size,4);U.uniformMatrix2fv(this.addr,!1,V)}function ge(U,E){const V=p(E,this.size,9);U.uniformMatrix3fv(this.addr,!1,V)}function me(U,E){const V=p(E,this.size,16);U.uniformMatrix4fv(this.addr,!1,V)}function _e(U,E){U.uniform1iv(this.addr,E)}function le(U,E){U.uniform2iv(this.addr,E)}function ee(U,E){U.uniform3iv(this.addr,E)}function je(U,E){U.uniform4iv(this.addr,E)}function z(U,E){U.uniform1uiv(this.addr,E)}function $(U,E){U.uniform2uiv(this.addr,E)}function se(U,E){U.uniform3uiv(this.addr,E)}function ie(U,E){U.uniform4uiv(this.addr,E)}function te(U,E,V){const re=this.cache,ue=E.length,J=S(V,ue);u(re,J)||(U.uniform1iv(this.addr,J),g(re,J));for(let fe=0;fe!==ue;++fe)V.setTexture2D(E[fe]||i,J[fe])}function q(U,E,V){const re=this.cache,ue=E.length,J=S(V,ue);u(re,J)||(U.uniform1iv(this.addr,J),g(re,J));for(let fe=0;fe!==ue;++fe)V.setTexture3D(E[fe]||r,J[fe])}function ce(U,E,V){const re=this.cache,ue=E.length,J=S(V,ue);u(re,J)||(U.uniform1iv(this.addr,J),g(re,J));for(let fe=0;fe!==ue;++fe)V.setTextureCube(E[fe]||l,J[fe])}function xe(U,E,V){const re=this.cache,ue=E.length,J=S(V,ue);u(re,J)||(U.uniform1iv(this.addr,J),g(re,J));for(let fe=0;fe!==ue;++fe)V.setTexture2DArray(E[fe]||t,J[fe])}function we(U){switch(U){case 5126:return X;case 35664:return Y;case 35665:return Z;case 35666:return Q;case 35674:return ne;case 35675:return ge;case 35676:return me;case 5124:case 35670:return _e;case 35667:case 35671:return le;case 35668:case 35672:return ee;case 35669:case 35673:return je;case 5125:return z;case 36294:return $;case 36295:return se;case 36296:return ie;case 35678:case 36198:case 36298:case 36306:case 35682:return te;case 35679:case 36299:case 36307:return q;case 35680:case 36300:case 36308:case 36293:return ce;case 36289:case 36303:case 36311:case 36292:return xe}}class Ee{constructor(E,V,re){this.id=E,this.addr=re,this.cache=[],this.setValue=H(V.type)}}class ae{constructor(E,V,re){this.id=E,this.addr=re,this.cache=[],this.size=V.size,this.setValue=we(V.type)}}class be{constructor(E){this.id=E,this.seq=[],this.map={}}setValue(E,V,re){const ue=this.seq;for(let J=0,fe=ue.length;J!==fe;++J){const Te=ue[J];Te.setValue(E,V[Te.id],re)}}}const Se=/(\w+)(\])?(\[|\.)?/g;function Ae(U,E){U.seq.push(E),U.map[E.id]=E}function Ce(U,E,V){const re=U.name,ue=re.length;for(Se.lastIndex=0;;){const J=Se.exec(re),fe=Se.lastIndex;let Te=J[1];const pe=J[2]==="]",Ie=J[3];if(pe&&(Te=Te|0),Ie===void 0||Ie==="["&&fe+2===ue){Ae(V,Ie===void 0?new Ee(Te,U,E):new ae(Te,U,E));break}else{let De=V.map[Te];De===void 0&&(De=new be(Te),Ae(V,De)),V=De}}}class Be{constructor(E,V){this.seq=[],this.map={};const re=E.getProgramParameter(V,E.ACTIVE_UNIFORMS);for(let ue=0;ue<re;++ue){const J=E.getActiveUniform(V,ue),fe=E.getUniformLocation(V,J.name);Ce(J,fe,this)}}setValue(E,V,re,ue){const J=this.map[V];J!==void 0&&J.setValue(E,re,ue)}setOptional(E,V,re){const ue=V[re];ue!==void 0&&this.setValue(E,re,ue)}static upload(E,V,re,ue){for(let J=0,fe=V.length;J!==fe;++J){const Te=V[J],pe=re[Te.id];pe.needsUpdate!==!1&&Te.setValue(E,pe.value,ue)}}static seqWithValue(E,V){const re=[];for(let ue=0,J=E.length;ue!==J;++ue){const fe=E[ue];fe.id in V&&re.push(fe)}return re}}},{"../../textures/CubeTexture.js":"jcedY","../../textures/Texture.js":"2paEl","../../textures/DataArrayTexture.js":"aY9tP","../../textures/Data3DTexture.js":"2fyDm","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bjgjd:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLShader",()=>m);function m(M,v,n){const i=M.createShader(v);return M.shaderSource(i,n),M.compileShader(i),i}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6htbX":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLShaderCache",()=>M);let m=0;class M{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(i){const t=i.vertexShader,r=i.fragmentShader,l=this._getShaderStage(t),h=this._getShaderStage(r),f=this._getShaderCacheForMaterial(i);return f.has(l)===!1&&(f.add(l),l.usedTimes++),f.has(h)===!1&&(f.add(h),h.usedTimes++),this}remove(i){const t=this.materialCache.get(i);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(i),this}getVertexShaderID(i){return this._getShaderStage(i.vertexShader).id}getFragmentShaderID(i){return this._getShaderStage(i.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(i){const t=this.materialCache;let r=t.get(i);return r===void 0&&(r=new Set,t.set(i,r)),r}_getShaderStage(i){const t=this.shaderCache;let r=t.get(i);return r===void 0&&(r=new v(i),t.set(i,r)),r}}class v{constructor(i){this.id=m++,this.code=i,this.usedTimes=0}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iDm8Y:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLProperties",()=>m);function m(){let M=new WeakMap;function v(r){let l=M.get(r);return l===void 0&&(l={},M.set(r,l)),l}function n(r){M.delete(r)}function i(r,l,h){M.get(r)[l]=h}function t(){M=new WeakMap}return{get:v,remove:n,update:i,dispose:t}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cYJDq:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLRenderLists",()=>n),a.export(o,"WebGLRenderList",()=>v);function m(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function M(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function v(){const i=[];let t=0;const r=[],l=[],h=[];function f(){t=0,r.length=0,l.length=0,h.length=0}function c(g,S,y,T,x,_){let A=i[t];return A===void 0?(A={id:g.id,object:g,geometry:S,material:y,groupOrder:T,renderOrder:g.renderOrder,z:x,group:_},i[t]=A):(A.id=g.id,A.object=g,A.geometry=S,A.material=y,A.groupOrder=T,A.renderOrder=g.renderOrder,A.z=x,A.group=_),t++,A}function s(g,S,y,T,x,_){const A=c(g,S,y,T,x,_);y.transmission>0?l.push(A):y.transparent===!0?h.push(A):r.push(A)}function d(g,S,y,T,x,_){const A=c(g,S,y,T,x,_);y.transmission>0?l.unshift(A):y.transparent===!0?h.unshift(A):r.unshift(A)}function p(g,S){r.length>1&&r.sort(g||m),l.length>1&&l.sort(S||M),h.length>1&&h.sort(S||M)}function u(){for(let g=t,S=i.length;g<S;g++){const y=i[g];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:r,transmissive:l,transparent:h,init:f,push:s,unshift:d,finish:u,sort:p}}function n(){let i=new WeakMap;function t(l,h){const f=i.get(l);let c;return f===void 0?(c=new v,i.set(l,[c])):h>=f.length?(c=new v,f.push(c)):c=f[h],c}function r(){i=new WeakMap}return{get:t,dispose:r}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dnvrX:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLRenderStates",()=>v);var m=e("./WebGLLights.js");function M(n,i){const t=new m.WebGLLights(n,i),r=[],l=[];function h(){r.length=0,l.length=0}function f(u){r.push(u)}function c(u){l.push(u)}function s(u){t.setup(r,u)}function d(u){t.setupView(r,u)}return{init:h,state:{lightsArray:r,shadowsArray:l,lights:t},setupLights:s,setupLightsView:d,pushLight:f,pushShadow:c}}function v(n,i){let t=new WeakMap;function r(h,f=0){const c=t.get(h);let s;return c===void 0?(s=new M(n,i),t.set(h,[s])):f>=c.length?(s=new M(n,i),c.push(s)):s=c[f],s}function l(){t=new WeakMap}return{get:r,dispose:l}}},{"./WebGLLights.js":"6zz9k","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6zz9k":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLLights",()=>f);var m=e("../../math/Color.js"),M=e("../../math/Matrix4.js"),v=e("../../math/Vector2.js"),n=e("../../math/Vector3.js"),i=e("../shaders/UniformsLib.js");function t(){const c={};return{get:function(s){if(c[s.id]!==void 0)return c[s.id];let d;switch(s.type){case"DirectionalLight":d={direction:new n.Vector3,color:new m.Color};break;case"SpotLight":d={position:new n.Vector3,direction:new n.Vector3,color:new m.Color,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":d={position:new n.Vector3,color:new m.Color,distance:0,decay:0};break;case"HemisphereLight":d={direction:new n.Vector3,skyColor:new m.Color,groundColor:new m.Color};break;case"RectAreaLight":d={color:new m.Color,position:new n.Vector3,halfWidth:new n.Vector3,halfHeight:new n.Vector3};break}return c[s.id]=d,d}}}function r(){const c={};return{get:function(s){if(c[s.id]!==void 0)return c[s.id];let d;switch(s.type){case"DirectionalLight":d={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new v.Vector2};break;case"SpotLight":d={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new v.Vector2};break;case"PointLight":d={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new v.Vector2,shadowCameraNear:1,shadowCameraFar:1e3};break}return c[s.id]=d,d}}}let l=0;function h(c,s){return(s.castShadow?2:0)-(c.castShadow?2:0)+(s.map?1:0)-(c.map?1:0)}function f(c,s){const d=new t,p=r(),u={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let _=0;_<9;_++)u.probe.push(new n.Vector3);const g=new n.Vector3,S=new M.Matrix4,y=new M.Matrix4;function T(_,A){let w=0,j=0,R=0;for(let X=0;X<9;X++)u.probe[X].set(0,0,0);let L=0,D=0,P=0,k=0,O=0,F=0,G=0,b=0,C=0,I=0;_.sort(h);const B=A===!0?Math.PI:1;for(let X=0,Y=_.length;X<Y;X++){const Z=_[X],Q=Z.color,ne=Z.intensity,ge=Z.distance,me=Z.shadow&&Z.shadow.map?Z.shadow.map.texture:null;if(Z.isAmbientLight)w+=Q.r*ne*B,j+=Q.g*ne*B,R+=Q.b*ne*B;else if(Z.isLightProbe)for(let _e=0;_e<9;_e++)u.probe[_e].addScaledVector(Z.sh.coefficients[_e],ne);else if(Z.isDirectionalLight){const _e=d.get(Z);if(_e.color.copy(Z.color).multiplyScalar(Z.intensity*B),Z.castShadow){const le=Z.shadow,ee=p.get(Z);ee.shadowBias=le.bias,ee.shadowNormalBias=le.normalBias,ee.shadowRadius=le.radius,ee.shadowMapSize=le.mapSize,u.directionalShadow[L]=ee,u.directionalShadowMap[L]=me,u.directionalShadowMatrix[L]=Z.shadow.matrix,F++}u.directional[L]=_e,L++}else if(Z.isSpotLight){const _e=d.get(Z);_e.position.setFromMatrixPosition(Z.matrixWorld),_e.color.copy(Q).multiplyScalar(ne*B),_e.distance=ge,_e.coneCos=Math.cos(Z.angle),_e.penumbraCos=Math.cos(Z.angle*(1-Z.penumbra)),_e.decay=Z.decay,u.spot[P]=_e;const le=Z.shadow;if(Z.map&&(u.spotLightMap[C]=Z.map,C++,le.updateMatrices(Z),Z.castShadow&&I++),u.spotLightMatrix[P]=le.matrix,Z.castShadow){const ee=p.get(Z);ee.shadowBias=le.bias,ee.shadowNormalBias=le.normalBias,ee.shadowRadius=le.radius,ee.shadowMapSize=le.mapSize,u.spotShadow[P]=ee,u.spotShadowMap[P]=me,b++}P++}else if(Z.isRectAreaLight){const _e=d.get(Z);_e.color.copy(Q).multiplyScalar(ne),_e.halfWidth.set(Z.width*.5,0,0),_e.halfHeight.set(0,Z.height*.5,0),u.rectArea[k]=_e,k++}else if(Z.isPointLight){const _e=d.get(Z);if(_e.color.copy(Z.color).multiplyScalar(Z.intensity*B),_e.distance=Z.distance,_e.decay=Z.decay,Z.castShadow){const le=Z.shadow,ee=p.get(Z);ee.shadowBias=le.bias,ee.shadowNormalBias=le.normalBias,ee.shadowRadius=le.radius,ee.shadowMapSize=le.mapSize,ee.shadowCameraNear=le.camera.near,ee.shadowCameraFar=le.camera.far,u.pointShadow[D]=ee,u.pointShadowMap[D]=me,u.pointShadowMatrix[D]=Z.shadow.matrix,G++}u.point[D]=_e,D++}else if(Z.isHemisphereLight){const _e=d.get(Z);_e.skyColor.copy(Z.color).multiplyScalar(ne*B),_e.groundColor.copy(Z.groundColor).multiplyScalar(ne*B),u.hemi[O]=_e,O++}}k>0&&(s.isWebGL2||c.has("OES_texture_float_linear")===!0?(u.rectAreaLTC1=i.UniformsLib.LTC_FLOAT_1,u.rectAreaLTC2=i.UniformsLib.LTC_FLOAT_2):c.has("OES_texture_half_float_linear")===!0?(u.rectAreaLTC1=i.UniformsLib.LTC_HALF_1,u.rectAreaLTC2=i.UniformsLib.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),u.ambient[0]=w,u.ambient[1]=j,u.ambient[2]=R;const H=u.hash;(H.directionalLength!==L||H.pointLength!==D||H.spotLength!==P||H.rectAreaLength!==k||H.hemiLength!==O||H.numDirectionalShadows!==F||H.numPointShadows!==G||H.numSpotShadows!==b||H.numSpotMaps!==C)&&(u.directional.length=L,u.spot.length=P,u.rectArea.length=k,u.point.length=D,u.hemi.length=O,u.directionalShadow.length=F,u.directionalShadowMap.length=F,u.pointShadow.length=G,u.pointShadowMap.length=G,u.spotShadow.length=b,u.spotShadowMap.length=b,u.directionalShadowMatrix.length=F,u.pointShadowMatrix.length=G,u.spotLightMatrix.length=b+C-I,u.spotLightMap.length=C,u.numSpotLightShadowsWithMaps=I,H.directionalLength=L,H.pointLength=D,H.spotLength=P,H.rectAreaLength=k,H.hemiLength=O,H.numDirectionalShadows=F,H.numPointShadows=G,H.numSpotShadows=b,H.numSpotMaps=C,u.version=l++)}function x(_,A){let w=0,j=0,R=0,L=0,D=0;const P=A.matrixWorldInverse;for(let k=0,O=_.length;k<O;k++){const F=_[k];if(F.isDirectionalLight){const G=u.directional[w];G.direction.setFromMatrixPosition(F.matrixWorld),g.setFromMatrixPosition(F.target.matrixWorld),G.direction.sub(g),G.direction.transformDirection(P),w++}else if(F.isSpotLight){const G=u.spot[R];G.position.setFromMatrixPosition(F.matrixWorld),G.position.applyMatrix4(P),G.direction.setFromMatrixPosition(F.matrixWorld),g.setFromMatrixPosition(F.target.matrixWorld),G.direction.sub(g),G.direction.transformDirection(P),R++}else if(F.isRectAreaLight){const G=u.rectArea[L];G.position.setFromMatrixPosition(F.matrixWorld),G.position.applyMatrix4(P),y.identity(),S.copy(F.matrixWorld),S.premultiply(P),y.extractRotation(S),G.halfWidth.set(F.width*.5,0,0),G.halfHeight.set(0,F.height*.5,0),G.halfWidth.applyMatrix4(y),G.halfHeight.applyMatrix4(y),L++}else if(F.isPointLight){const G=u.point[j];G.position.setFromMatrixPosition(F.matrixWorld),G.position.applyMatrix4(P),j++}else if(F.isHemisphereLight){const G=u.hemi[D];G.direction.setFromMatrixPosition(F.matrixWorld),G.direction.transformDirection(P),D++}}}return{setup:T,setupView:x,state:u}}},{"../../math/Color.js":"gFgcM","../../math/Matrix4.js":"64n8p","../../math/Vector2.js":"crXpG","../../math/Vector3.js":"fUbuJ","../shaders/UniformsLib.js":"fRE1G","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bETLW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLShadowMap",()=>d);var m=e("../../constants.js"),M=e("../WebGLRenderTarget.js"),v=e("../../materials/MeshDepthMaterial.js"),n=e("../../materials/MeshDistanceMaterial.js"),i=e("../../materials/ShaderMaterial.js"),t=e("../../core/BufferAttribute.js"),r=e("../../core/BufferGeometry.js"),l=e("../../objects/Mesh.js"),h=e("../../math/Vector4.js"),f=e("../../math/Vector2.js"),c=e("../../math/Frustum.js"),s=e("../shaders/ShaderLib/vsm.glsl.js");function d(p,u,g){let S=new c.Frustum;const y=new f.Vector2,T=new f.Vector2,x=new h.Vector4,_=new v.MeshDepthMaterial({depthPacking:m.RGBADepthPacking}),A=new n.MeshDistanceMaterial,w={},j=g.maxTextureSize,R={[m.FrontSide]:m.BackSide,[m.BackSide]:m.FrontSide,[m.DoubleSide]:m.DoubleSide},L=new i.ShaderMaterial({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new f.Vector2},radius:{value:4}},vertexShader:s.vertex,fragmentShader:s.fragment}),D=L.clone();D.defines.HORIZONTAL_PASS=1;const P=new r.BufferGeometry;P.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const k=new l.Mesh(P,L),O=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=m.PCFShadowMap;let F=this.type;this.render=function(I,B,H){if(O.enabled===!1||O.autoUpdate===!1&&O.needsUpdate===!1||I.length===0)return;const X=p.getRenderTarget(),Y=p.getActiveCubeFace(),Z=p.getActiveMipmapLevel(),Q=p.state;Q.setBlending(m.NoBlending),Q.buffers.color.setClear(1,1,1,1),Q.buffers.depth.setTest(!0),Q.setScissorTest(!1);const ne=F!==m.VSMShadowMap&&this.type===m.VSMShadowMap,ge=F===m.VSMShadowMap&&this.type!==m.VSMShadowMap;for(let me=0,_e=I.length;me<_e;me++){const le=I[me],ee=le.shadow;if(ee===void 0){console.warn("THREE.WebGLShadowMap:",le,"has no shadow.");continue}if(ee.autoUpdate===!1&&ee.needsUpdate===!1)continue;y.copy(ee.mapSize);const je=ee.getFrameExtents();if(y.multiply(je),T.copy(ee.mapSize),(y.x>j||y.y>j)&&(y.x>j&&(T.x=Math.floor(j/je.x),y.x=T.x*je.x,ee.mapSize.x=T.x),y.y>j&&(T.y=Math.floor(j/je.y),y.y=T.y*je.y,ee.mapSize.y=T.y)),ee.map===null||ne===!0||ge===!0){const $=this.type!==m.VSMShadowMap?{minFilter:m.NearestFilter,magFilter:m.NearestFilter}:{};ee.map!==null&&ee.map.dispose(),ee.map=new M.WebGLRenderTarget(y.x,y.y,$),ee.map.texture.name=le.name+".shadowMap",ee.camera.updateProjectionMatrix()}p.setRenderTarget(ee.map),p.clear();const z=ee.getViewportCount();for(let $=0;$<z;$++){const se=ee.getViewport($);x.set(T.x*se.x,T.y*se.y,T.x*se.z,T.y*se.w),Q.viewport(x),ee.updateMatrices(le,$),S=ee.getFrustum(),C(B,H,ee.camera,le,this.type)}ee.isPointLightShadow!==!0&&this.type===m.VSMShadowMap&&G(ee,H),ee.needsUpdate=!1}F=this.type,O.needsUpdate=!1,p.setRenderTarget(X,Y,Z)};function G(I,B){const H=u.update(k);L.defines.VSM_SAMPLES!==I.blurSamples&&(L.defines.VSM_SAMPLES=I.blurSamples,D.defines.VSM_SAMPLES=I.blurSamples,L.needsUpdate=!0,D.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new M.WebGLRenderTarget(y.x,y.y)),L.uniforms.shadow_pass.value=I.map.texture,L.uniforms.resolution.value=I.mapSize,L.uniforms.radius.value=I.radius,p.setRenderTarget(I.mapPass),p.clear(),p.renderBufferDirect(B,null,H,L,k,null),D.uniforms.shadow_pass.value=I.mapPass.texture,D.uniforms.resolution.value=I.mapSize,D.uniforms.radius.value=I.radius,p.setRenderTarget(I.map),p.clear(),p.renderBufferDirect(B,null,H,D,k,null)}function b(I,B,H,X){let Y=null;const Z=H.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(Z!==void 0)Y=Z;else if(Y=H.isPointLight===!0?A:_,p.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0){const Q=Y.uuid,ne=B.uuid;let ge=w[Q];ge===void 0&&(ge={},w[Q]=ge);let me=ge[ne];me===void 0&&(me=Y.clone(),ge[ne]=me),Y=me}if(Y.visible=B.visible,Y.wireframe=B.wireframe,X===m.VSMShadowMap?Y.side=B.shadowSide!==null?B.shadowSide:B.side:Y.side=B.shadowSide!==null?B.shadowSide:R[B.side],Y.alphaMap=B.alphaMap,Y.alphaTest=B.alphaTest,Y.map=B.map,Y.clipShadows=B.clipShadows,Y.clippingPlanes=B.clippingPlanes,Y.clipIntersection=B.clipIntersection,Y.displacementMap=B.displacementMap,Y.displacementScale=B.displacementScale,Y.displacementBias=B.displacementBias,Y.wireframeLinewidth=B.wireframeLinewidth,Y.linewidth=B.linewidth,H.isPointLight===!0&&Y.isMeshDistanceMaterial===!0){const Q=p.properties.get(Y);Q.light=H}return Y}function C(I,B,H,X,Y){if(I.visible===!1)return;if(I.layers.test(B.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&Y===m.VSMShadowMap)&&(!I.frustumCulled||S.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,I.matrixWorld);const ne=u.update(I),ge=I.material;if(Array.isArray(ge)){const me=ne.groups;for(let _e=0,le=me.length;_e<le;_e++){const ee=me[_e],je=ge[ee.materialIndex];if(je&&je.visible){const z=b(I,je,X,Y);p.renderBufferDirect(H,null,ne,z,I,ee)}}}else if(ge.visible){const me=b(I,ge,X,Y);p.renderBufferDirect(H,null,ne,me,I,null)}}const Q=I.children;for(let ne=0,ge=Q.length;ne<ge;ne++)C(Q[ne],B,H,X,Y)}}},{"../../constants.js":"bqsVL","../WebGLRenderTarget.js":"azVIG","../../materials/MeshDepthMaterial.js":"bfDLn","../../materials/MeshDistanceMaterial.js":"8F0sF","../../materials/ShaderMaterial.js":"bnM8h","../../core/BufferAttribute.js":"7hhbt","../../core/BufferGeometry.js":"jAZYz","../../objects/Mesh.js":"d9YFT","../../math/Vector4.js":"h0tSe","../../math/Vector2.js":"crXpG","../../math/Frustum.js":"hmBSr","../shaders/ShaderLib/vsm.glsl.js":"3rKoj","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bfDLn:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshDepthMaterial",()=>v);var m=e("./Material.js"),M=e("../constants.js");class v extends m.Material{constructor(i){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=M.BasicDepthPacking,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(i)}copy(i){return super.copy(i),this.depthPacking=i.depthPacking,this.map=i.map,this.alphaMap=i.alphaMap,this.displacementMap=i.displacementMap,this.displacementScale=i.displacementScale,this.displacementBias=i.displacementBias,this.wireframe=i.wireframe,this.wireframeLinewidth=i.wireframeLinewidth,this}}},{"./Material.js":"l4ClZ","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8F0sF":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshDistanceMaterial",()=>M);var m=e("./Material.js");class M extends m.Material{constructor(n){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(n)}copy(n){return super.copy(n),this.map=n.map,this.alphaMap=n.alphaMap,this.displacementMap=n.displacementMap,this.displacementScale=n.displacementScale,this.displacementBias=n.displacementBias,this}}},{"./Material.js":"l4ClZ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3rKoj":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"vertex",()=>m),a.export(o,"fragment",()=>M);const m=`
void main() {

	gl_Position = vec4( position, 1.0 );

}
`,M=`
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;

#include <packing>

void main() {

	const float samples = float( VSM_SAMPLES );

	float mean = 0.0;
	float squared_mean = 0.0;

	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {

		float uvOffset = uvStart + i * uvStride;

		#ifdef HORIZONTAL_PASS

			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

		#else

			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;

		#endif

	}

	mean = mean / samples;
	squared_mean = squared_mean / samples;

	float std_dev = sqrt( squared_mean - mean * mean );

	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );

}
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hg75Y:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLState",()=>v);var m=e("../../constants.js"),M=e("../../math/Vector4.js");function v(n,i,t){const r=t.isWebGL2;function l(){let K=!1;const Le=new M.Vector4;let Re=null;const Pe=new M.Vector4(0,0,0,0);return{setMask:function(ve){Re!==ve&&!K&&(n.colorMask(ve,ve,ve,ve),Re=ve)},setLocked:function(ve){K=ve},setClear:function(ve,Ne,Oe,Ke,dt){dt===!0&&(ve*=Ke,Ne*=Ke,Oe*=Ke),Le.set(ve,Ne,Oe,Ke),Pe.equals(Le)===!1&&(n.clearColor(ve,Ne,Oe,Ke),Pe.copy(Le))},reset:function(){K=!1,Re=null,Pe.set(-1,0,0,0)}}}function h(){let K=!1,Le=null,Re=null,Pe=null;return{setTest:function(ve){ve?ee(n.DEPTH_TEST):je(n.DEPTH_TEST)},setMask:function(ve){Le!==ve&&!K&&(n.depthMask(ve),Le=ve)},setFunc:function(ve){if(Re!==ve){switch(ve){case m.NeverDepth:n.depthFunc(n.NEVER);break;case m.AlwaysDepth:n.depthFunc(n.ALWAYS);break;case m.LessDepth:n.depthFunc(n.LESS);break;case m.LessEqualDepth:n.depthFunc(n.LEQUAL);break;case m.EqualDepth:n.depthFunc(n.EQUAL);break;case m.GreaterEqualDepth:n.depthFunc(n.GEQUAL);break;case m.GreaterDepth:n.depthFunc(n.GREATER);break;case m.NotEqualDepth:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Re=ve}},setLocked:function(ve){K=ve},setClear:function(ve){Pe!==ve&&(n.clearDepth(ve),Pe=ve)},reset:function(){K=!1,Le=null,Re=null,Pe=null}}}function f(){let K=!1,Le=null,Re=null,Pe=null,ve=null,Ne=null,Oe=null,Ke=null,dt=null;return{setTest:function(he){K||(he?ee(n.STENCIL_TEST):je(n.STENCIL_TEST))},setMask:function(he){Le!==he&&!K&&(n.stencilMask(he),Le=he)},setFunc:function(he,ot,Qe){(Re!==he||Pe!==ot||ve!==Qe)&&(n.stencilFunc(he,ot,Qe),Re=he,Pe=ot,ve=Qe)},setOp:function(he,ot,Qe){(Ne!==he||Oe!==ot||Ke!==Qe)&&(n.stencilOp(he,ot,Qe),Ne=he,Oe=ot,Ke=Qe)},setLocked:function(he){K=he},setClear:function(he){dt!==he&&(n.clearStencil(he),dt=he)},reset:function(){K=!1,Le=null,Re=null,Pe=null,ve=null,Ne=null,Oe=null,Ke=null,dt=null}}}const c=new l,s=new h,d=new f,p=new WeakMap,u=new WeakMap;let g={},S={},y=new WeakMap,T=[],x=null,_=!1,A=null,w=null,j=null,R=null,L=null,D=null,P=null,k=!1,O=null,F=null,G=null,b=null,C=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,H=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(X)[1]),B=H>=1):X.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),B=H>=2);let Y=null,Z={};const Q=n.getParameter(n.SCISSOR_BOX),ne=n.getParameter(n.VIEWPORT),ge=new M.Vector4().fromArray(Q),me=new M.Vector4().fromArray(ne);function _e(K,Le,Re,Pe){const ve=new Uint8Array(4),Ne=n.createTexture();n.bindTexture(K,Ne),n.texParameteri(K,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(K,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<Re;Oe++)r&&(K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY)?n.texImage3D(Le,0,n.RGBA,1,1,Pe,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(Le+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return Ne}const le={};le[n.TEXTURE_2D]=_e(n.TEXTURE_2D,n.TEXTURE_2D,1),le[n.TEXTURE_CUBE_MAP]=_e(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),r&&(le[n.TEXTURE_2D_ARRAY]=_e(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),le[n.TEXTURE_3D]=_e(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),c.setClear(0,0,0,1),s.setClear(1),d.setClear(0),ee(n.DEPTH_TEST),s.setFunc(m.LessEqualDepth),xe(!1),we(m.CullFaceBack),ee(n.CULL_FACE),q(m.NoBlending);function ee(K){g[K]!==!0&&(n.enable(K),g[K]=!0)}function je(K){g[K]!==!1&&(n.disable(K),g[K]=!1)}function z(K,Le){return S[K]!==Le?(n.bindFramebuffer(K,Le),S[K]=Le,r&&(K===n.DRAW_FRAMEBUFFER&&(S[n.FRAMEBUFFER]=Le),K===n.FRAMEBUFFER&&(S[n.DRAW_FRAMEBUFFER]=Le)),!0):!1}function $(K,Le){let Re=T,Pe=!1;if(K)if(Re=y.get(Le),Re===void 0&&(Re=[],y.set(Le,Re)),K.isWebGLMultipleRenderTargets){const ve=K.texture;if(Re.length!==ve.length||Re[0]!==n.COLOR_ATTACHMENT0){for(let Ne=0,Oe=ve.length;Ne<Oe;Ne++)Re[Ne]=n.COLOR_ATTACHMENT0+Ne;Re.length=ve.length,Pe=!0}}else Re[0]!==n.COLOR_ATTACHMENT0&&(Re[0]=n.COLOR_ATTACHMENT0,Pe=!0);else Re[0]!==n.BACK&&(Re[0]=n.BACK,Pe=!0);Pe&&(t.isWebGL2?n.drawBuffers(Re):i.get("WEBGL_draw_buffers").drawBuffersWEBGL(Re))}function se(K){return x!==K?(n.useProgram(K),x=K,!0):!1}const ie={[m.AddEquation]:n.FUNC_ADD,[m.SubtractEquation]:n.FUNC_SUBTRACT,[m.ReverseSubtractEquation]:n.FUNC_REVERSE_SUBTRACT};if(r)ie[m.MinEquation]=n.MIN,ie[m.MaxEquation]=n.MAX;else{const K=i.get("EXT_blend_minmax");K!==null&&(ie[m.MinEquation]=K.MIN_EXT,ie[m.MaxEquation]=K.MAX_EXT)}const te={[m.ZeroFactor]:n.ZERO,[m.OneFactor]:n.ONE,[m.SrcColorFactor]:n.SRC_COLOR,[m.SrcAlphaFactor]:n.SRC_ALPHA,[m.SrcAlphaSaturateFactor]:n.SRC_ALPHA_SATURATE,[m.DstColorFactor]:n.DST_COLOR,[m.DstAlphaFactor]:n.DST_ALPHA,[m.OneMinusSrcColorFactor]:n.ONE_MINUS_SRC_COLOR,[m.OneMinusSrcAlphaFactor]:n.ONE_MINUS_SRC_ALPHA,[m.OneMinusDstColorFactor]:n.ONE_MINUS_DST_COLOR,[m.OneMinusDstAlphaFactor]:n.ONE_MINUS_DST_ALPHA};function q(K,Le,Re,Pe,ve,Ne,Oe,Ke){if(K===m.NoBlending){_===!0&&(je(n.BLEND),_=!1);return}if(_===!1&&(ee(n.BLEND),_=!0),K!==m.CustomBlending){if(K!==A||Ke!==k){if((w!==m.AddEquation||L!==m.AddEquation)&&(n.blendEquation(n.FUNC_ADD),w=m.AddEquation,L=m.AddEquation),Ke)switch(K){case m.NormalBlending:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case m.AdditiveBlending:n.blendFunc(n.ONE,n.ONE);break;case m.SubtractiveBlending:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case m.MultiplyBlending:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",K);break}else switch(K){case m.NormalBlending:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case m.AdditiveBlending:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case m.SubtractiveBlending:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case m.MultiplyBlending:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",K);break}j=null,R=null,D=null,P=null,A=K,k=Ke}return}ve=ve||Le,Ne=Ne||Re,Oe=Oe||Pe,(Le!==w||ve!==L)&&(n.blendEquationSeparate(ie[Le],ie[ve]),w=Le,L=ve),(Re!==j||Pe!==R||Ne!==D||Oe!==P)&&(n.blendFuncSeparate(te[Re],te[Pe],te[Ne],te[Oe]),j=Re,R=Pe,D=Ne,P=Oe),A=K,k=!1}function ce(K,Le){K.side===m.DoubleSide?je(n.CULL_FACE):ee(n.CULL_FACE);let Re=K.side===m.BackSide;Le&&(Re=!Re),xe(Re),K.blending===m.NormalBlending&&K.transparent===!1?q(m.NoBlending):q(K.blending,K.blendEquation,K.blendSrc,K.blendDst,K.blendEquationAlpha,K.blendSrcAlpha,K.blendDstAlpha,K.premultipliedAlpha),s.setFunc(K.depthFunc),s.setTest(K.depthTest),s.setMask(K.depthWrite),c.setMask(K.colorWrite);const Pe=K.stencilWrite;d.setTest(Pe),Pe&&(d.setMask(K.stencilWriteMask),d.setFunc(K.stencilFunc,K.stencilRef,K.stencilFuncMask),d.setOp(K.stencilFail,K.stencilZFail,K.stencilZPass)),ae(K.polygonOffset,K.polygonOffsetFactor,K.polygonOffsetUnits),K.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):je(n.SAMPLE_ALPHA_TO_COVERAGE)}function xe(K){O!==K&&(K?n.frontFace(n.CW):n.frontFace(n.CCW),O=K)}function we(K){K!==m.CullFaceNone?(ee(n.CULL_FACE),K!==F&&(K===m.CullFaceBack?n.cullFace(n.BACK):K===m.CullFaceFront?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):je(n.CULL_FACE),F=K}function Ee(K){K!==G&&(B&&n.lineWidth(K),G=K)}function ae(K,Le,Re){K?(ee(n.POLYGON_OFFSET_FILL),(b!==Le||C!==Re)&&(n.polygonOffset(Le,Re),b=Le,C=Re)):je(n.POLYGON_OFFSET_FILL)}function be(K){K?ee(n.SCISSOR_TEST):je(n.SCISSOR_TEST)}function Se(K){K===void 0&&(K=n.TEXTURE0+I-1),Y!==K&&(n.activeTexture(K),Y=K)}function Ae(K,Le,Re){Re===void 0&&(Y===null?Re=n.TEXTURE0+I-1:Re=Y);let Pe=Z[Re];Pe===void 0&&(Pe={type:void 0,texture:void 0},Z[Re]=Pe),(Pe.type!==K||Pe.texture!==Le)&&(Y!==Re&&(n.activeTexture(Re),Y=Re),n.bindTexture(K,Le||le[K]),Pe.type=K,Pe.texture=Le)}function Ce(){const K=Z[Y];K!==void 0&&K.type!==void 0&&(n.bindTexture(K.type,null),K.type=void 0,K.texture=void 0)}function Be(){try{n.compressedTexImage2D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function U(){try{n.compressedTexImage3D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function E(){try{n.texSubImage2D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function V(){try{n.texSubImage3D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function re(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function ue(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function J(){try{n.texStorage2D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function fe(){try{n.texStorage3D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function Te(){try{n.texImage2D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function pe(){try{n.texImage3D.apply(n,arguments)}catch(K){console.error("THREE.WebGLState:",K)}}function Ie(K){ge.equals(K)===!1&&(n.scissor(K.x,K.y,K.z,K.w),ge.copy(K))}function ke(K){me.equals(K)===!1&&(n.viewport(K.x,K.y,K.z,K.w),me.copy(K))}function De(K,Le){let Re=u.get(Le);Re===void 0&&(Re=new WeakMap,u.set(Le,Re));let Pe=Re.get(K);Pe===void 0&&(Pe=n.getUniformBlockIndex(Le,K.name),Re.set(K,Pe))}function Ge(K,Le){const Pe=u.get(Le).get(K);p.get(Le)!==Pe&&(n.uniformBlockBinding(Le,Pe,K.__bindingPointIndex),p.set(Le,Pe))}function Ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),r===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),g={},Y=null,Z={},S={},y=new WeakMap,T=[],x=null,_=!1,A=null,w=null,j=null,R=null,L=null,D=null,P=null,k=!1,O=null,F=null,G=null,b=null,C=null,ge.set(0,0,n.canvas.width,n.canvas.height),me.set(0,0,n.canvas.width,n.canvas.height),c.reset(),s.reset(),d.reset()}return{buffers:{color:c,depth:s,stencil:d},enable:ee,disable:je,bindFramebuffer:z,drawBuffers:$,useProgram:se,setBlending:q,setMaterial:ce,setFlipSided:xe,setCullFace:we,setLineWidth:Ee,setPolygonOffset:ae,setScissorTest:be,activeTexture:Se,bindTexture:Ae,unbindTexture:Ce,compressedTexImage2D:Be,compressedTexImage3D:U,texImage2D:Te,texImage3D:pe,updateUBOMapping:De,uniformBlockBinding:Ge,texStorage2D:J,texStorage3D:fe,texSubImage2D:E,texSubImage3D:V,compressedTexSubImage2D:re,compressedTexSubImage3D:ue,scissor:Ie,viewport:ke,reset:Ue}}},{"../../constants.js":"bqsVL","../../math/Vector4.js":"h0tSe","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9fDRC":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLTextures",()=>i);var m=e("../../constants.js"),M=e("../../math/MathUtils.js"),v=e("../../extras/ImageUtils.js"),n=e("../../utils.js");function i(t,r,l,h,f,c,s){const d=f.isWebGL2,p=f.maxTextures,u=f.maxCubemapSize,g=f.maxTextureSize,S=f.maxSamples,y=r.has("WEBGL_multisampled_render_to_texture")?r.get("WEBGL_multisampled_render_to_texture"):null,T=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap;let _;const A=new WeakMap;let w=!1;try{w=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function j(U,E){return w?new OffscreenCanvas(U,E):(0,n.createElementNS)("canvas")}function R(U,E,V,re){let ue=1;if((U.width>re||U.height>re)&&(ue=re/Math.max(U.width,U.height)),ue<1||E===!0)if(typeof HTMLImageElement!="undefined"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&U instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&U instanceof ImageBitmap){const J=E?M.floorPowerOfTwo:Math.floor,fe=J(ue*U.width),Te=J(ue*U.height);_===void 0&&(_=j(fe,Te));const pe=V?j(fe,Te):_;return pe.width=fe,pe.height=Te,pe.getContext("2d").drawImage(U,0,0,fe,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+U.width+"x"+U.height+") to ("+fe+"x"+Te+")."),pe}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+U.width+"x"+U.height+")."),U;return U}function L(U){return M.isPowerOfTwo(U.width)&&M.isPowerOfTwo(U.height)}function D(U){return d?!1:U.wrapS!==m.ClampToEdgeWrapping||U.wrapT!==m.ClampToEdgeWrapping||U.minFilter!==m.NearestFilter&&U.minFilter!==m.LinearFilter}function P(U,E){return U.generateMipmaps&&E&&U.minFilter!==m.NearestFilter&&U.minFilter!==m.LinearFilter}function k(U){t.generateMipmap(U)}function O(U,E,V,re,ue=!1){if(d===!1)return E;if(U!==null){if(t[U]!==void 0)return t[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let J=E;return E===t.RED&&(V===t.FLOAT&&(J=t.R32F),V===t.HALF_FLOAT&&(J=t.R16F),V===t.UNSIGNED_BYTE&&(J=t.R8)),E===t.RG&&(V===t.FLOAT&&(J=t.RG32F),V===t.HALF_FLOAT&&(J=t.RG16F),V===t.UNSIGNED_BYTE&&(J=t.RG8)),E===t.RGBA&&(V===t.FLOAT&&(J=t.RGBA32F),V===t.HALF_FLOAT&&(J=t.RGBA16F),V===t.UNSIGNED_BYTE&&(J=re===m.SRGBColorSpace&&ue===!1?t.SRGB8_ALPHA8:t.RGBA8),V===t.UNSIGNED_SHORT_4_4_4_4&&(J=t.RGBA4),V===t.UNSIGNED_SHORT_5_5_5_1&&(J=t.RGB5_A1)),(J===t.R16F||J===t.R32F||J===t.RG16F||J===t.RG32F||J===t.RGBA16F||J===t.RGBA32F)&&r.get("EXT_color_buffer_float"),J}function F(U,E,V){return P(U,V)===!0||U.isFramebufferTexture&&U.minFilter!==m.NearestFilter&&U.minFilter!==m.LinearFilter?Math.log2(Math.max(E.width,E.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?E.mipmaps.length:1}function G(U){return U===m.NearestFilter||U===m.NearestMipmapNearestFilter||U===m.NearestMipmapLinearFilter?t.NEAREST:t.LINEAR}function b(U){const E=U.target;E.removeEventListener("dispose",b),I(E),E.isVideoTexture&&x.delete(E)}function C(U){const E=U.target;E.removeEventListener("dispose",C),H(E)}function I(U){const E=h.get(U);if(E.__webglInit===void 0)return;const V=U.source,re=A.get(V);if(re){const ue=re[E.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&B(U),Object.keys(re).length===0&&A.delete(V)}h.remove(U)}function B(U){const E=h.get(U);t.deleteTexture(E.__webglTexture);const V=U.source,re=A.get(V);delete re[E.__cacheKey],s.memory.textures--}function H(U){const E=U.texture,V=h.get(U),re=h.get(E);if(re.__webglTexture!==void 0&&(t.deleteTexture(re.__webglTexture),s.memory.textures--),U.depthTexture&&U.depthTexture.dispose(),U.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++)t.deleteFramebuffer(V.__webglFramebuffer[ue]),V.__webglDepthbuffer&&t.deleteRenderbuffer(V.__webglDepthbuffer[ue]);else{if(t.deleteFramebuffer(V.__webglFramebuffer),V.__webglDepthbuffer&&t.deleteRenderbuffer(V.__webglDepthbuffer),V.__webglMultisampledFramebuffer&&t.deleteFramebuffer(V.__webglMultisampledFramebuffer),V.__webglColorRenderbuffer)for(let ue=0;ue<V.__webglColorRenderbuffer.length;ue++)V.__webglColorRenderbuffer[ue]&&t.deleteRenderbuffer(V.__webglColorRenderbuffer[ue]);V.__webglDepthRenderbuffer&&t.deleteRenderbuffer(V.__webglDepthRenderbuffer)}if(U.isWebGLMultipleRenderTargets)for(let ue=0,J=E.length;ue<J;ue++){const fe=h.get(E[ue]);fe.__webglTexture&&(t.deleteTexture(fe.__webglTexture),s.memory.textures--),h.remove(E[ue])}h.remove(E),h.remove(U)}let X=0;function Y(){X=0}function Z(){const U=X;return U>=p&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+p),X+=1,U}function Q(U){const E=[];return E.push(U.wrapS),E.push(U.wrapT),E.push(U.wrapR||0),E.push(U.magFilter),E.push(U.minFilter),E.push(U.anisotropy),E.push(U.internalFormat),E.push(U.format),E.push(U.type),E.push(U.generateMipmaps),E.push(U.premultiplyAlpha),E.push(U.flipY),E.push(U.unpackAlignment),E.push(U.colorSpace),E.join()}function ne(U,E){const V=h.get(U);if(U.isVideoTexture&&Ce(U),U.isRenderTargetTexture===!1&&U.version>0&&V.__version!==U.version){const re=U.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{se(V,U,E);return}}l.bindTexture(t.TEXTURE_2D,V.__webglTexture,t.TEXTURE0+E)}function ge(U,E){const V=h.get(U);if(U.version>0&&V.__version!==U.version){se(V,U,E);return}l.bindTexture(t.TEXTURE_2D_ARRAY,V.__webglTexture,t.TEXTURE0+E)}function me(U,E){const V=h.get(U);if(U.version>0&&V.__version!==U.version){se(V,U,E);return}l.bindTexture(t.TEXTURE_3D,V.__webglTexture,t.TEXTURE0+E)}function _e(U,E){const V=h.get(U);if(U.version>0&&V.__version!==U.version){ie(V,U,E);return}l.bindTexture(t.TEXTURE_CUBE_MAP,V.__webglTexture,t.TEXTURE0+E)}const le={[m.RepeatWrapping]:t.REPEAT,[m.ClampToEdgeWrapping]:t.CLAMP_TO_EDGE,[m.MirroredRepeatWrapping]:t.MIRRORED_REPEAT},ee={[m.NearestFilter]:t.NEAREST,[m.NearestMipmapNearestFilter]:t.NEAREST_MIPMAP_NEAREST,[m.NearestMipmapLinearFilter]:t.NEAREST_MIPMAP_LINEAR,[m.LinearFilter]:t.LINEAR,[m.LinearMipmapNearestFilter]:t.LINEAR_MIPMAP_NEAREST,[m.LinearMipmapLinearFilter]:t.LINEAR_MIPMAP_LINEAR},je={[m.NeverCompare]:t.NEVER,[m.AlwaysCompare]:t.ALWAYS,[m.LessCompare]:t.LESS,[m.LessEqualCompare]:t.LEQUAL,[m.EqualCompare]:t.EQUAL,[m.GreaterEqualCompare]:t.GEQUAL,[m.GreaterCompare]:t.GREATER,[m.NotEqualCompare]:t.NOTEQUAL};function z(U,E,V){if(V?(t.texParameteri(U,t.TEXTURE_WRAP_S,le[E.wrapS]),t.texParameteri(U,t.TEXTURE_WRAP_T,le[E.wrapT]),(U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY)&&t.texParameteri(U,t.TEXTURE_WRAP_R,le[E.wrapR]),t.texParameteri(U,t.TEXTURE_MAG_FILTER,ee[E.magFilter]),t.texParameteri(U,t.TEXTURE_MIN_FILTER,ee[E.minFilter])):(t.texParameteri(U,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(U,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY)&&t.texParameteri(U,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(E.wrapS!==m.ClampToEdgeWrapping||E.wrapT!==m.ClampToEdgeWrapping)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(U,t.TEXTURE_MAG_FILTER,G(E.magFilter)),t.texParameteri(U,t.TEXTURE_MIN_FILTER,G(E.minFilter)),E.minFilter!==m.NearestFilter&&E.minFilter!==m.LinearFilter&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(t.texParameteri(U,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(U,t.TEXTURE_COMPARE_FUNC,je[E.compareFunction])),r.has("EXT_texture_filter_anisotropic")===!0){const re=r.get("EXT_texture_filter_anisotropic");if(E.magFilter===m.NearestFilter||E.minFilter!==m.NearestMipmapLinearFilter&&E.minFilter!==m.LinearMipmapLinearFilter||E.type===m.FloatType&&r.has("OES_texture_float_linear")===!1||d===!1&&E.type===m.HalfFloatType&&r.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||h.get(E).__currentAnisotropy)&&(t.texParameterf(U,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,f.getMaxAnisotropy())),h.get(E).__currentAnisotropy=E.anisotropy)}}function $(U,E){let V=!1;U.__webglInit===void 0&&(U.__webglInit=!0,E.addEventListener("dispose",b));const re=E.source;let ue=A.get(re);ue===void 0&&(ue={},A.set(re,ue));const J=Q(E);if(J!==U.__cacheKey){ue[J]===void 0&&(ue[J]={texture:t.createTexture(),usedTimes:0},s.memory.textures++,V=!0),ue[J].usedTimes++;const fe=ue[U.__cacheKey];fe!==void 0&&(ue[U.__cacheKey].usedTimes--,fe.usedTimes===0&&B(E)),U.__cacheKey=J,U.__webglTexture=ue[J].texture}return V}function se(U,E,V){let re=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(re=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(re=t.TEXTURE_3D);const ue=$(U,E),J=E.source;l.bindTexture(re,U.__webglTexture,t.TEXTURE0+V);const fe=h.get(J);if(J.version!==fe.__version||ue===!0){l.activeTexture(t.TEXTURE0+V),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const Te=D(E)&&L(E.image)===!1;let pe=R(E.image,Te,!1,g);pe=Be(E,pe);const Ie=L(pe)||d,ke=c.convert(E.format,E.colorSpace);let De=c.convert(E.type),Ge=O(E.internalFormat,ke,De,E.colorSpace);z(re,E,Ie);let Ue;const K=E.mipmaps,Le=d&&E.isVideoTexture!==!0,Re=fe.__version===void 0||ue===!0,Pe=F(E,pe,Ie);if(E.isDepthTexture)Ge=t.DEPTH_COMPONENT,d?E.type===m.FloatType?Ge=t.DEPTH_COMPONENT32F:E.type===m.UnsignedIntType?Ge=t.DEPTH_COMPONENT24:E.type===m.UnsignedInt248Type?Ge=t.DEPTH24_STENCIL8:Ge=t.DEPTH_COMPONENT16:E.type===m.FloatType&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===m.DepthFormat&&Ge===t.DEPTH_COMPONENT&&E.type!==m.UnsignedShortType&&E.type!==m.UnsignedIntType&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=m.UnsignedIntType,De=c.convert(E.type)),E.format===m.DepthStencilFormat&&Ge===t.DEPTH_COMPONENT&&(Ge=t.DEPTH_STENCIL,E.type!==m.UnsignedInt248Type&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=m.UnsignedInt248Type,De=c.convert(E.type))),Re&&(Le?l.texStorage2D(t.TEXTURE_2D,1,Ge,pe.width,pe.height):l.texImage2D(t.TEXTURE_2D,0,Ge,pe.width,pe.height,0,ke,De,null));else if(E.isDataTexture)if(K.length>0&&Ie){Le&&Re&&l.texStorage2D(t.TEXTURE_2D,Pe,Ge,K[0].width,K[0].height);for(let ve=0,Ne=K.length;ve<Ne;ve++)Ue=K[ve],Le?l.texSubImage2D(t.TEXTURE_2D,ve,0,0,Ue.width,Ue.height,ke,De,Ue.data):l.texImage2D(t.TEXTURE_2D,ve,Ge,Ue.width,Ue.height,0,ke,De,Ue.data);E.generateMipmaps=!1}else Le?(Re&&l.texStorage2D(t.TEXTURE_2D,Pe,Ge,pe.width,pe.height),l.texSubImage2D(t.TEXTURE_2D,0,0,0,pe.width,pe.height,ke,De,pe.data)):l.texImage2D(t.TEXTURE_2D,0,Ge,pe.width,pe.height,0,ke,De,pe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Le&&Re&&l.texStorage3D(t.TEXTURE_2D_ARRAY,Pe,Ge,K[0].width,K[0].height,pe.depth);for(let ve=0,Ne=K.length;ve<Ne;ve++)Ue=K[ve],E.format!==m.RGBAFormat?ke!==null?Le?l.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ve,0,0,0,Ue.width,Ue.height,pe.depth,ke,Ue.data,0,0):l.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ve,Ge,Ue.width,Ue.height,pe.depth,0,Ue.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?l.texSubImage3D(t.TEXTURE_2D_ARRAY,ve,0,0,0,Ue.width,Ue.height,pe.depth,ke,De,Ue.data):l.texImage3D(t.TEXTURE_2D_ARRAY,ve,Ge,Ue.width,Ue.height,pe.depth,0,ke,De,Ue.data)}else{Le&&Re&&l.texStorage2D(t.TEXTURE_2D,Pe,Ge,K[0].width,K[0].height);for(let ve=0,Ne=K.length;ve<Ne;ve++)Ue=K[ve],E.format!==m.RGBAFormat?ke!==null?Le?l.compressedTexSubImage2D(t.TEXTURE_2D,ve,0,0,Ue.width,Ue.height,ke,Ue.data):l.compressedTexImage2D(t.TEXTURE_2D,ve,Ge,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?l.texSubImage2D(t.TEXTURE_2D,ve,0,0,Ue.width,Ue.height,ke,De,Ue.data):l.texImage2D(t.TEXTURE_2D,ve,Ge,Ue.width,Ue.height,0,ke,De,Ue.data)}else if(E.isDataArrayTexture)Le?(Re&&l.texStorage3D(t.TEXTURE_2D_ARRAY,Pe,Ge,pe.width,pe.height,pe.depth),l.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,ke,De,pe.data)):l.texImage3D(t.TEXTURE_2D_ARRAY,0,Ge,pe.width,pe.height,pe.depth,0,ke,De,pe.data);else if(E.isData3DTexture)Le?(Re&&l.texStorage3D(t.TEXTURE_3D,Pe,Ge,pe.width,pe.height,pe.depth),l.texSubImage3D(t.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,ke,De,pe.data)):l.texImage3D(t.TEXTURE_3D,0,Ge,pe.width,pe.height,pe.depth,0,ke,De,pe.data);else if(E.isFramebufferTexture){if(Re)if(Le)l.texStorage2D(t.TEXTURE_2D,Pe,Ge,pe.width,pe.height);else{let ve=pe.width,Ne=pe.height;for(let Oe=0;Oe<Pe;Oe++)l.texImage2D(t.TEXTURE_2D,Oe,Ge,ve,Ne,0,ke,De,null),ve>>=1,Ne>>=1}}else if(K.length>0&&Ie){Le&&Re&&l.texStorage2D(t.TEXTURE_2D,Pe,Ge,K[0].width,K[0].height);for(let ve=0,Ne=K.length;ve<Ne;ve++)Ue=K[ve],Le?l.texSubImage2D(t.TEXTURE_2D,ve,0,0,ke,De,Ue):l.texImage2D(t.TEXTURE_2D,ve,Ge,ke,De,Ue);E.generateMipmaps=!1}else Le?(Re&&l.texStorage2D(t.TEXTURE_2D,Pe,Ge,pe.width,pe.height),l.texSubImage2D(t.TEXTURE_2D,0,0,0,ke,De,pe)):l.texImage2D(t.TEXTURE_2D,0,Ge,ke,De,pe);P(E,Ie)&&k(re),fe.__version=J.version,E.onUpdate&&E.onUpdate(E)}U.__version=E.version}function ie(U,E,V){if(E.image.length!==6)return;const re=$(U,E),ue=E.source;l.bindTexture(t.TEXTURE_CUBE_MAP,U.__webglTexture,t.TEXTURE0+V);const J=h.get(ue);if(ue.version!==J.__version||re===!0){l.activeTexture(t.TEXTURE0+V),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const fe=E.isCompressedTexture||E.image[0].isCompressedTexture,Te=E.image[0]&&E.image[0].isDataTexture,pe=[];for(let ve=0;ve<6;ve++)!fe&&!Te?pe[ve]=R(E.image[ve],!1,!0,u):pe[ve]=Te?E.image[ve].image:E.image[ve],pe[ve]=Be(E,pe[ve]);const Ie=pe[0],ke=L(Ie)||d,De=c.convert(E.format,E.colorSpace),Ge=c.convert(E.type),Ue=O(E.internalFormat,De,Ge,E.colorSpace),K=d&&E.isVideoTexture!==!0,Le=J.__version===void 0||re===!0;let Re=F(E,Ie,ke);z(t.TEXTURE_CUBE_MAP,E,ke);let Pe;if(fe){K&&Le&&l.texStorage2D(t.TEXTURE_CUBE_MAP,Re,Ue,Ie.width,Ie.height);for(let ve=0;ve<6;ve++){Pe=pe[ve].mipmaps;for(let Ne=0;Ne<Pe.length;Ne++){const Oe=Pe[Ne];E.format!==m.RGBAFormat?De!==null?K?l.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne,0,0,Oe.width,Oe.height,De,Oe.data):l.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne,Ue,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):K?l.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne,0,0,Oe.width,Oe.height,De,Ge,Oe.data):l.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne,Ue,Oe.width,Oe.height,0,De,Ge,Oe.data)}}}else{Pe=E.mipmaps,K&&Le&&(Pe.length>0&&Re++,l.texStorage2D(t.TEXTURE_CUBE_MAP,Re,Ue,pe[0].width,pe[0].height));for(let ve=0;ve<6;ve++)if(Te){K?l.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,pe[ve].width,pe[ve].height,De,Ge,pe[ve].data):l.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Ue,pe[ve].width,pe[ve].height,0,De,Ge,pe[ve].data);for(let Ne=0;Ne<Pe.length;Ne++){const Ke=Pe[Ne].image[ve].image;K?l.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne+1,0,0,Ke.width,Ke.height,De,Ge,Ke.data):l.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne+1,Ue,Ke.width,Ke.height,0,De,Ge,Ke.data)}}else{K?l.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,De,Ge,pe[ve]):l.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Ue,De,Ge,pe[ve]);for(let Ne=0;Ne<Pe.length;Ne++){const Oe=Pe[Ne];K?l.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne+1,0,0,De,Ge,Oe.image[ve]):l.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Ne+1,Ue,De,Ge,Oe.image[ve])}}}P(E,ke)&&k(t.TEXTURE_CUBE_MAP),J.__version=ue.version,E.onUpdate&&E.onUpdate(E)}U.__version=E.version}function te(U,E,V,re,ue){const J=c.convert(V.format,V.colorSpace),fe=c.convert(V.type),Te=O(V.internalFormat,J,fe,V.colorSpace);h.get(E).__hasExternalTextures||(ue===t.TEXTURE_3D||ue===t.TEXTURE_2D_ARRAY?l.texImage3D(ue,0,Te,E.width,E.height,E.depth,0,J,fe,null):l.texImage2D(ue,0,Te,E.width,E.height,0,J,fe,null)),l.bindFramebuffer(t.FRAMEBUFFER,U),Ae(E)?y.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,ue,h.get(V).__webglTexture,0,Se(E)):(ue===t.TEXTURE_2D||ue>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,re,ue,h.get(V).__webglTexture,0),l.bindFramebuffer(t.FRAMEBUFFER,null)}function q(U,E,V){if(t.bindRenderbuffer(t.RENDERBUFFER,U),E.depthBuffer&&!E.stencilBuffer){let re=t.DEPTH_COMPONENT16;if(V||Ae(E)){const ue=E.depthTexture;ue&&ue.isDepthTexture&&(ue.type===m.FloatType?re=t.DEPTH_COMPONENT32F:ue.type===m.UnsignedIntType&&(re=t.DEPTH_COMPONENT24));const J=Se(E);Ae(E)?y.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,J,re,E.width,E.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,J,re,E.width,E.height)}else t.renderbufferStorage(t.RENDERBUFFER,re,E.width,E.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,U)}else if(E.depthBuffer&&E.stencilBuffer){const re=Se(E);V&&Ae(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,re,t.DEPTH24_STENCIL8,E.width,E.height):Ae(E)?y.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,re,t.DEPTH24_STENCIL8,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,U)}else{const re=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let ue=0;ue<re.length;ue++){const J=re[ue],fe=c.convert(J.format,J.colorSpace),Te=c.convert(J.type),pe=O(J.internalFormat,fe,Te,J.colorSpace),Ie=Se(E);V&&Ae(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie,pe,E.width,E.height):Ae(E)?y.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ie,pe,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,pe,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ce(U,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(l.bindFramebuffer(t.FRAMEBUFFER,U),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!h.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),ne(E.depthTexture,0);const re=h.get(E.depthTexture).__webglTexture,ue=Se(E);if(E.depthTexture.format===m.DepthFormat)Ae(E)?y.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,re,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,re,0);else if(E.depthTexture.format===m.DepthStencilFormat)Ae(E)?y.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,re,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function xe(U){const E=h.get(U),V=U.isWebGLCubeRenderTarget===!0;if(U.depthTexture&&!E.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");ce(E.__webglFramebuffer,U)}else if(V){E.__webglDepthbuffer=[];for(let re=0;re<6;re++)l.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[re]),E.__webglDepthbuffer[re]=t.createRenderbuffer(),q(E.__webglDepthbuffer[re],U,!1)}else l.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=t.createRenderbuffer(),q(E.__webglDepthbuffer,U,!1);l.bindFramebuffer(t.FRAMEBUFFER,null)}function we(U,E,V){const re=h.get(U);E!==void 0&&te(re.__webglFramebuffer,U,U.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D),V!==void 0&&xe(U)}function Ee(U){const E=U.texture,V=h.get(U),re=h.get(E);U.addEventListener("dispose",C),U.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=t.createTexture()),re.__version=E.version,s.memory.textures++);const ue=U.isWebGLCubeRenderTarget===!0,J=U.isWebGLMultipleRenderTargets===!0,fe=L(U)||d;if(ue){V.__webglFramebuffer=[];for(let Te=0;Te<6;Te++)V.__webglFramebuffer[Te]=t.createFramebuffer()}else{if(V.__webglFramebuffer=t.createFramebuffer(),J)if(f.drawBuffers){const Te=U.texture;for(let pe=0,Ie=Te.length;pe<Ie;pe++){const ke=h.get(Te[pe]);ke.__webglTexture===void 0&&(ke.__webglTexture=t.createTexture(),s.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(d&&U.samples>0&&Ae(U)===!1){const Te=J?E:[E];V.__webglMultisampledFramebuffer=t.createFramebuffer(),V.__webglColorRenderbuffer=[],l.bindFramebuffer(t.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let pe=0;pe<Te.length;pe++){const Ie=Te[pe];V.__webglColorRenderbuffer[pe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,V.__webglColorRenderbuffer[pe]);const ke=c.convert(Ie.format,Ie.colorSpace),De=c.convert(Ie.type),Ge=O(Ie.internalFormat,ke,De,Ie.colorSpace,U.isXRRenderTarget===!0),Ue=Se(U);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ue,Ge,U.width,U.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.RENDERBUFFER,V.__webglColorRenderbuffer[pe])}t.bindRenderbuffer(t.RENDERBUFFER,null),U.depthBuffer&&(V.__webglDepthRenderbuffer=t.createRenderbuffer(),q(V.__webglDepthRenderbuffer,U,!0)),l.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ue){l.bindTexture(t.TEXTURE_CUBE_MAP,re.__webglTexture),z(t.TEXTURE_CUBE_MAP,E,fe);for(let Te=0;Te<6;Te++)te(V.__webglFramebuffer[Te],U,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Te);P(E,fe)&&k(t.TEXTURE_CUBE_MAP),l.unbindTexture()}else if(J){const Te=U.texture;for(let pe=0,Ie=Te.length;pe<Ie;pe++){const ke=Te[pe],De=h.get(ke);l.bindTexture(t.TEXTURE_2D,De.__webglTexture),z(t.TEXTURE_2D,ke,fe),te(V.__webglFramebuffer,U,ke,t.COLOR_ATTACHMENT0+pe,t.TEXTURE_2D),P(ke,fe)&&k(t.TEXTURE_2D)}l.unbindTexture()}else{let Te=t.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(d?Te=U.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),l.bindTexture(Te,re.__webglTexture),z(Te,E,fe),te(V.__webglFramebuffer,U,E,t.COLOR_ATTACHMENT0,Te),P(E,fe)&&k(Te),l.unbindTexture()}U.depthBuffer&&xe(U)}function ae(U){const E=L(U)||d,V=U.isWebGLMultipleRenderTargets===!0?U.texture:[U.texture];for(let re=0,ue=V.length;re<ue;re++){const J=V[re];if(P(J,E)){const fe=U.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Te=h.get(J).__webglTexture;l.bindTexture(fe,Te),k(fe),l.unbindTexture()}}}function be(U){if(d&&U.samples>0&&Ae(U)===!1){const E=U.isWebGLMultipleRenderTargets?U.texture:[U.texture],V=U.width,re=U.height;let ue=t.COLOR_BUFFER_BIT;const J=[],fe=U.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Te=h.get(U),pe=U.isWebGLMultipleRenderTargets===!0;if(pe)for(let Ie=0;Ie<E.length;Ie++)l.bindFramebuffer(t.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ie,t.RENDERBUFFER,null),l.bindFramebuffer(t.FRAMEBUFFER,Te.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ie,t.TEXTURE_2D,null,0);l.bindFramebuffer(t.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),l.bindFramebuffer(t.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Ie=0;Ie<E.length;Ie++){J.push(t.COLOR_ATTACHMENT0+Ie),U.depthBuffer&&J.push(fe);const ke=Te.__ignoreDepthValues!==void 0?Te.__ignoreDepthValues:!1;if(ke===!1&&(U.depthBuffer&&(ue|=t.DEPTH_BUFFER_BIT),U.stencilBuffer&&(ue|=t.STENCIL_BUFFER_BIT)),pe&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Te.__webglColorRenderbuffer[Ie]),ke===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[fe]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[fe])),pe){const De=h.get(E[Ie]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,V,re,0,0,V,re,ue,t.NEAREST),T&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,J)}if(l.bindFramebuffer(t.READ_FRAMEBUFFER,null),l.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),pe)for(let Ie=0;Ie<E.length;Ie++){l.bindFramebuffer(t.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ie,t.RENDERBUFFER,Te.__webglColorRenderbuffer[Ie]);const ke=h.get(E[Ie]).__webglTexture;l.bindFramebuffer(t.FRAMEBUFFER,Te.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ie,t.TEXTURE_2D,ke,0)}l.bindFramebuffer(t.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}}function Se(U){return Math.min(S,U.samples)}function Ae(U){const E=h.get(U);return d&&U.samples>0&&r.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ce(U){const E=s.render.frame;x.get(U)!==E&&(x.set(U,E),U.update())}function Be(U,E){const V=U.colorSpace,re=U.format,ue=U.type;return U.isCompressedTexture===!0||U.format===m._SRGBAFormat||V!==m.LinearSRGBColorSpace&&V!==m.NoColorSpace&&(V===m.SRGBColorSpace?d===!1?r.has("EXT_sRGB")===!0&&re===m.RGBAFormat?(U.format=m._SRGBAFormat,U.minFilter=m.LinearFilter,U.generateMipmaps=!1):E=v.ImageUtils.sRGBToLinear(E):(re!==m.RGBAFormat||ue!==m.UnsignedByteType)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),E}this.allocateTextureUnit=Z,this.resetTextureUnits=Y,this.setTexture2D=ne,this.setTexture2DArray=ge,this.setTexture3D=me,this.setTextureCube=_e,this.rebindTextures=we,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=te,this.useMultisampledRTT=Ae}},{"../../constants.js":"bqsVL","../../math/MathUtils.js":"9o1gq","../../extras/ImageUtils.js":"bdPum","../../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9KSSb":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLUtils",()=>M);var m=e("../../constants.js");function M(v,n,i){const t=i.isWebGL2;function r(l,h=m.NoColorSpace){let f;if(l===m.UnsignedByteType)return v.UNSIGNED_BYTE;if(l===m.UnsignedShort4444Type)return v.UNSIGNED_SHORT_4_4_4_4;if(l===m.UnsignedShort5551Type)return v.UNSIGNED_SHORT_5_5_5_1;if(l===m.ByteType)return v.BYTE;if(l===m.ShortType)return v.SHORT;if(l===m.UnsignedShortType)return v.UNSIGNED_SHORT;if(l===m.IntType)return v.INT;if(l===m.UnsignedIntType)return v.UNSIGNED_INT;if(l===m.FloatType)return v.FLOAT;if(l===m.HalfFloatType)return t?v.HALF_FLOAT:(f=n.get("OES_texture_half_float"),f!==null?f.HALF_FLOAT_OES:null);if(l===m.AlphaFormat)return v.ALPHA;if(l===m.RGBAFormat)return v.RGBA;if(l===m.LuminanceFormat)return v.LUMINANCE;if(l===m.LuminanceAlphaFormat)return v.LUMINANCE_ALPHA;if(l===m.DepthFormat)return v.DEPTH_COMPONENT;if(l===m.DepthStencilFormat)return v.DEPTH_STENCIL;if(l===m._SRGBAFormat)return f=n.get("EXT_sRGB"),f!==null?f.SRGB_ALPHA_EXT:null;if(l===m.RedFormat)return v.RED;if(l===m.RedIntegerFormat)return v.RED_INTEGER;if(l===m.RGFormat)return v.RG;if(l===m.RGIntegerFormat)return v.RG_INTEGER;if(l===m.RGBAIntegerFormat)return v.RGBA_INTEGER;if(l===m.RGB_S3TC_DXT1_Format||l===m.RGBA_S3TC_DXT1_Format||l===m.RGBA_S3TC_DXT3_Format||l===m.RGBA_S3TC_DXT5_Format)if(h===m.SRGBColorSpace)if(f=n.get("WEBGL_compressed_texture_s3tc_srgb"),f!==null){if(l===m.RGB_S3TC_DXT1_Format)return f.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(l===m.RGBA_S3TC_DXT1_Format)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(l===m.RGBA_S3TC_DXT3_Format)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(l===m.RGBA_S3TC_DXT5_Format)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(f=n.get("WEBGL_compressed_texture_s3tc"),f!==null){if(l===m.RGB_S3TC_DXT1_Format)return f.COMPRESSED_RGB_S3TC_DXT1_EXT;if(l===m.RGBA_S3TC_DXT1_Format)return f.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(l===m.RGBA_S3TC_DXT3_Format)return f.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(l===m.RGBA_S3TC_DXT5_Format)return f.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(l===m.RGB_PVRTC_4BPPV1_Format||l===m.RGB_PVRTC_2BPPV1_Format||l===m.RGBA_PVRTC_4BPPV1_Format||l===m.RGBA_PVRTC_2BPPV1_Format)if(f=n.get("WEBGL_compressed_texture_pvrtc"),f!==null){if(l===m.RGB_PVRTC_4BPPV1_Format)return f.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(l===m.RGB_PVRTC_2BPPV1_Format)return f.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(l===m.RGBA_PVRTC_4BPPV1_Format)return f.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(l===m.RGBA_PVRTC_2BPPV1_Format)return f.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(l===m.RGB_ETC1_Format)return f=n.get("WEBGL_compressed_texture_etc1"),f!==null?f.COMPRESSED_RGB_ETC1_WEBGL:null;if(l===m.RGB_ETC2_Format||l===m.RGBA_ETC2_EAC_Format)if(f=n.get("WEBGL_compressed_texture_etc"),f!==null){if(l===m.RGB_ETC2_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ETC2:f.COMPRESSED_RGB8_ETC2;if(l===m.RGBA_ETC2_EAC_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:f.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(l===m.RGBA_ASTC_4x4_Format||l===m.RGBA_ASTC_5x4_Format||l===m.RGBA_ASTC_5x5_Format||l===m.RGBA_ASTC_6x5_Format||l===m.RGBA_ASTC_6x6_Format||l===m.RGBA_ASTC_8x5_Format||l===m.RGBA_ASTC_8x6_Format||l===m.RGBA_ASTC_8x8_Format||l===m.RGBA_ASTC_10x5_Format||l===m.RGBA_ASTC_10x6_Format||l===m.RGBA_ASTC_10x8_Format||l===m.RGBA_ASTC_10x10_Format||l===m.RGBA_ASTC_12x10_Format||l===m.RGBA_ASTC_12x12_Format)if(f=n.get("WEBGL_compressed_texture_astc"),f!==null){if(l===m.RGBA_ASTC_4x4_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:f.COMPRESSED_RGBA_ASTC_4x4_KHR;if(l===m.RGBA_ASTC_5x4_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:f.COMPRESSED_RGBA_ASTC_5x4_KHR;if(l===m.RGBA_ASTC_5x5_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:f.COMPRESSED_RGBA_ASTC_5x5_KHR;if(l===m.RGBA_ASTC_6x5_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:f.COMPRESSED_RGBA_ASTC_6x5_KHR;if(l===m.RGBA_ASTC_6x6_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:f.COMPRESSED_RGBA_ASTC_6x6_KHR;if(l===m.RGBA_ASTC_8x5_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:f.COMPRESSED_RGBA_ASTC_8x5_KHR;if(l===m.RGBA_ASTC_8x6_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:f.COMPRESSED_RGBA_ASTC_8x6_KHR;if(l===m.RGBA_ASTC_8x8_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:f.COMPRESSED_RGBA_ASTC_8x8_KHR;if(l===m.RGBA_ASTC_10x5_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:f.COMPRESSED_RGBA_ASTC_10x5_KHR;if(l===m.RGBA_ASTC_10x6_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:f.COMPRESSED_RGBA_ASTC_10x6_KHR;if(l===m.RGBA_ASTC_10x8_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:f.COMPRESSED_RGBA_ASTC_10x8_KHR;if(l===m.RGBA_ASTC_10x10_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:f.COMPRESSED_RGBA_ASTC_10x10_KHR;if(l===m.RGBA_ASTC_12x10_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:f.COMPRESSED_RGBA_ASTC_12x10_KHR;if(l===m.RGBA_ASTC_12x12_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:f.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(l===m.RGBA_BPTC_Format)if(f=n.get("EXT_texture_compression_bptc"),f!==null){if(l===m.RGBA_BPTC_Format)return h===m.SRGBColorSpace?f.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:f.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(l===m.RED_RGTC1_Format||l===m.SIGNED_RED_RGTC1_Format||l===m.RED_GREEN_RGTC2_Format||l===m.SIGNED_RED_GREEN_RGTC2_Format)if(f=n.get("EXT_texture_compression_rgtc"),f!==null){if(l===m.RGBA_BPTC_Format)return f.COMPRESSED_RED_RGTC1_EXT;if(l===m.SIGNED_RED_RGTC1_Format)return f.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(l===m.RED_GREEN_RGTC2_Format)return f.COMPRESSED_RED_GREEN_RGTC2_EXT;if(l===m.SIGNED_RED_GREEN_RGTC2_Format)return f.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return l===m.UnsignedInt248Type?t?v.UNSIGNED_INT_24_8:(f=n.get("WEBGL_depth_texture"),f!==null?f.UNSIGNED_INT_24_8_WEBGL:null):v[l]!==void 0?v[l]:null}return{convert:r}}},{"../../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8gw6i":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebXRManager",()=>s);var m=e("../../cameras/ArrayCamera.js"),M=e("../../core/EventDispatcher.js"),v=e("../../cameras/PerspectiveCamera.js"),n=e("../../math/Vector3.js"),i=e("../../math/Vector4.js"),t=e("../../math/MathUtils.js"),r=e("../webgl/WebGLAnimation.js"),l=e("../WebGLRenderTarget.js"),h=e("./WebXRController.js"),f=e("../../textures/DepthTexture.js"),c=e("../../constants.js");class s extends M.EventDispatcher{constructor(p,u){super();const g=this;let S=null,y=1,T=null,x="local-floor",_=1,A=null,w=null,j=null,R=null,L=null,D=null;const P=u.getContextAttributes();let k=null,O=null;const F=[],G=[],b=new v.PerspectiveCamera;b.layers.enable(1),b.viewport=new i.Vector4;const C=new v.PerspectiveCamera;C.layers.enable(2),C.viewport=new i.Vector4;const I=[b,C],B=new m.ArrayCamera;B.layers.enable(1),B.layers.enable(2);let H=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let se=F[$];return se===void 0&&(se=new h.WebXRController,F[$]=se),se.getTargetRaySpace()},this.getControllerGrip=function($){let se=F[$];return se===void 0&&(se=new h.WebXRController,F[$]=se),se.getGripSpace()},this.getHand=function($){let se=F[$];return se===void 0&&(se=new h.WebXRController,F[$]=se),se.getHandSpace()};function Y($){const se=G.indexOf($.inputSource);if(se===-1)return;const ie=F[se];ie!==void 0&&(ie.update($.inputSource,$.frame,A||T),ie.dispatchEvent({type:$.type,data:$.inputSource}))}function Z(){S.removeEventListener("select",Y),S.removeEventListener("selectstart",Y),S.removeEventListener("selectend",Y),S.removeEventListener("squeeze",Y),S.removeEventListener("squeezestart",Y),S.removeEventListener("squeezeend",Y),S.removeEventListener("end",Z),S.removeEventListener("inputsourceschange",Q);for(let $=0;$<F.length;$++){const se=G[$];se!==null&&(G[$]=null,F[$].disconnect(se))}H=null,X=null,p.setRenderTarget(k),L=null,R=null,j=null,S=null,O=null,z.stop(),g.isPresenting=!1,g.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){y=$,g.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){x=$,g.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return A||T},this.setReferenceSpace=function($){A=$},this.getBaseLayer=function(){return R!==null?R:L},this.getBinding=function(){return j},this.getFrame=function(){return D},this.getSession=function(){return S},this.setSession=async function($){if(S=$,S!==null){if(k=p.getRenderTarget(),S.addEventListener("select",Y),S.addEventListener("selectstart",Y),S.addEventListener("selectend",Y),S.addEventListener("squeeze",Y),S.addEventListener("squeezestart",Y),S.addEventListener("squeezeend",Y),S.addEventListener("end",Z),S.addEventListener("inputsourceschange",Q),P.xrCompatible!==!0&&await u.makeXRCompatible(),S.renderState.layers===void 0||p.capabilities.isWebGL2===!1){const se={antialias:S.renderState.layers===void 0?P.antialias:!0,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:y};L=new XRWebGLLayer(S,u,se),S.updateRenderState({baseLayer:L}),O=new l.WebGLRenderTarget(L.framebufferWidth,L.framebufferHeight,{format:c.RGBAFormat,type:c.UnsignedByteType,colorSpace:p.outputColorSpace,stencilBuffer:P.stencil})}else{let se=null,ie=null,te=null;P.depth&&(te=P.stencil?u.DEPTH24_STENCIL8:u.DEPTH_COMPONENT24,se=P.stencil?c.DepthStencilFormat:c.DepthFormat,ie=P.stencil?c.UnsignedInt248Type:c.UnsignedIntType);const q={colorFormat:u.RGBA8,depthFormat:te,scaleFactor:y};j=new XRWebGLBinding(S,u),R=j.createProjectionLayer(q),S.updateRenderState({layers:[R]}),O=new l.WebGLRenderTarget(R.textureWidth,R.textureHeight,{format:c.RGBAFormat,type:c.UnsignedByteType,depthTexture:new f.DepthTexture(R.textureWidth,R.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:P.stencil,colorSpace:p.outputColorSpace,samples:P.antialias?4:0});const ce=p.properties.get(O);ce.__ignoreDepthValues=R.ignoreDepthValues}O.isXRRenderTarget=!0,this.setFoveation(_),A=null,T=await S.requestReferenceSpace(x),z.setContext(S),z.start(),g.isPresenting=!0,g.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(S!==null)return S.environmentBlendMode};function Q($){for(let se=0;se<$.removed.length;se++){const ie=$.removed[se],te=G.indexOf(ie);te>=0&&(G[te]=null,F[te].disconnect(ie))}for(let se=0;se<$.added.length;se++){const ie=$.added[se];let te=G.indexOf(ie);if(te===-1){for(let ce=0;ce<F.length;ce++)if(ce>=G.length){G.push(ie),te=ce;break}else if(G[ce]===null){G[ce]=ie,te=ce;break}if(te===-1)break}const q=F[te];q&&q.connect(ie)}}const ne=new n.Vector3,ge=new n.Vector3;function me($,se,ie){ne.setFromMatrixPosition(se.matrixWorld),ge.setFromMatrixPosition(ie.matrixWorld);const te=ne.distanceTo(ge),q=se.projectionMatrix.elements,ce=ie.projectionMatrix.elements,xe=q[14]/(q[10]-1),we=q[14]/(q[10]+1),Ee=(q[9]+1)/q[5],ae=(q[9]-1)/q[5],be=(q[8]-1)/q[0],Se=(ce[8]+1)/ce[0],Ae=xe*be,Ce=xe*Se,Be=te/(-be+Se),U=Be*-be;se.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(U),$.translateZ(Be),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const E=xe+Be,V=we+Be,re=Ae-U,ue=Ce+(te-U),J=Ee*we/V*E,fe=ae*we/V*E;$.projectionMatrix.makePerspective(re,ue,J,fe,E,V),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function _e($,se){se===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(se.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(S===null)return;B.near=C.near=b.near=$.near,B.far=C.far=b.far=$.far,(H!==B.near||X!==B.far)&&(S.updateRenderState({depthNear:B.near,depthFar:B.far}),H=B.near,X=B.far);const se=$.parent,ie=B.cameras;_e(B,se);for(let te=0;te<ie.length;te++)_e(ie[te],se);ie.length===2?me(B,b,C):B.projectionMatrix.copy(b.projectionMatrix),le($,B,se)};function le($,se,ie){ie===null?$.matrix.copy(se.matrixWorld):($.matrix.copy(ie.matrixWorld),$.matrix.invert(),$.matrix.multiply(se.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0);const te=$.children;for(let q=0,ce=te.length;q<ce;q++)te[q].updateMatrixWorld(!0);$.projectionMatrix.copy(se.projectionMatrix),$.projectionMatrixInverse.copy(se.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=t.RAD2DEG*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(R===null&&L===null))return _},this.setFoveation=function($){_=$,R!==null&&(R.fixedFoveation=$),L!==null&&L.fixedFoveation!==void 0&&(L.fixedFoveation=$)};let ee=null;function je($,se){if(w=se.getViewerPose(A||T),D=se,w!==null){const ie=w.views;L!==null&&(p.setRenderTargetFramebuffer(O,L.framebuffer),p.setRenderTarget(O));let te=!1;ie.length!==B.cameras.length&&(B.cameras.length=0,te=!0);for(let q=0;q<ie.length;q++){const ce=ie[q];let xe=null;if(L!==null)xe=L.getViewport(ce);else{const Ee=j.getViewSubImage(R,ce);xe=Ee.viewport,q===0&&(p.setRenderTargetTextures(O,Ee.colorTexture,R.ignoreDepthValues?void 0:Ee.depthStencilTexture),p.setRenderTarget(O))}let we=I[q];we===void 0&&(we=new v.PerspectiveCamera,we.layers.enable(q),we.viewport=new i.Vector4,I[q]=we),we.matrix.fromArray(ce.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray(ce.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(xe.x,xe.y,xe.width,xe.height),q===0&&(B.matrix.copy(we.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),te===!0&&B.cameras.push(we)}}for(let ie=0;ie<F.length;ie++){const te=G[ie],q=F[ie];te!==null&&q!==void 0&&q.update(te,se,A||T)}ee&&ee($,se),se.detectedPlanes&&g.dispatchEvent({type:"planesdetected",data:se}),D=null}const z=new r.WebGLAnimation;z.setAnimationLoop(je),this.setAnimationLoop=function($){ee=$},this.dispose=function(){}}}},{"../../cameras/ArrayCamera.js":"7lwaI","../../core/EventDispatcher.js":"d6Goy","../../cameras/PerspectiveCamera.js":"bazbq","../../math/Vector3.js":"fUbuJ","../../math/Vector4.js":"h0tSe","../../math/MathUtils.js":"9o1gq","../webgl/WebGLAnimation.js":"78VzK","../WebGLRenderTarget.js":"azVIG","./WebXRController.js":"cwKLu","../../textures/DepthTexture.js":"2m8py","../../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7lwaI":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ArrayCamera",()=>M);var m=e("./PerspectiveCamera.js");class M extends m.PerspectiveCamera{constructor(n=[]){super();this.isArrayCamera=!0,this.cameras=n}}},{"./PerspectiveCamera.js":"bazbq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cwKLu:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebXRController",()=>n);var m=e("../../math/Vector3.js"),M=e("../../objects/Group.js");const v={type:"move"};class n{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new M.Group,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new M.Group,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new m.Vector3,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new m.Vector3),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new M.Group,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new m.Vector3,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new m.Vector3),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const r=this._hand;if(r)for(const l of t.hand.values())this._getHandJoint(r,l)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,r,l){let h=null,f=null,c=null;const s=this._targetRay,d=this._grip,p=this._hand;if(t&&r.session.visibilityState!=="visible-blurred"){if(p&&t.hand){c=!0;for(const x of t.hand.values()){const _=r.getJointPose(x,l),A=this._getHandJoint(p,x);_!==null&&(A.matrix.fromArray(_.transform.matrix),A.matrix.decompose(A.position,A.rotation,A.scale),A.matrixWorldNeedsUpdate=!0,A.jointRadius=_.radius),A.visible=_!==null}const u=p.joints["index-finger-tip"],g=p.joints["thumb-tip"],S=u.position.distanceTo(g.position),y=.02,T=.005;p.inputState.pinching&&S>y+T?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!p.inputState.pinching&&S<=y-T&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else d!==null&&t.gripSpace&&(f=r.getPose(t.gripSpace,l),f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,f.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(f.linearVelocity)):d.hasLinearVelocity=!1,f.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(f.angularVelocity)):d.hasAngularVelocity=!1));s!==null&&(h=r.getPose(t.targetRaySpace,l),h===null&&f!==null&&(h=f),h!==null&&(s.matrix.fromArray(h.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,h.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(h.linearVelocity)):s.hasLinearVelocity=!1,h.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(h.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(v)))}return s!==null&&(s.visible=h!==null),d!==null&&(d.visible=f!==null),p!==null&&(p.visible=c!==null),this}_getHandJoint(t,r){if(t.joints[r.jointName]===void 0){const l=new M.Group;l.matrixAutoUpdate=!1,l.visible=!1,t.joints[r.jointName]=l,t.add(l)}return t.joints[r.jointName]}}},{"../../math/Vector3.js":"fUbuJ","../../objects/Group.js":"c5DBK","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],c5DBK:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Group",()=>M);var m=e("../core/Object3D.js");class M extends m.Object3D{constructor(){super();this.isGroup=!0,this.type="Group"}}},{"../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2m8py":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DepthTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i,t,r,l,h,f,c,s,d,p){if(p=p!==void 0?p:M.DepthFormat,p!==M.DepthFormat&&p!==M.DepthStencilFormat)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&p===M.DepthFormat&&(r=M.UnsignedIntType),r===void 0&&p===M.DepthStencilFormat&&(r=M.UnsignedInt248Type);super(null,l,h,f,c,s,p,r,d);this.isDepthTexture=!0,this.image={width:i,height:t},this.magFilter=c!==void 0?c:M.NearestFilter,this.minFilter=s!==void 0?s:M.NearestFilter,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(i){return super.copy(i),this.compareFunction=i.compareFunction,this}toJSON(i){const t=super.toJSON(i);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1ccgH":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLMaterials",()=>v);var m=e("../../constants.js"),M=e("../shaders/UniformsUtils.js");function v(n,i){function t(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function r(x,_){_.color.getRGB(x.fogColor.value,(0,M.getUnlitUniformColorSpace)(n)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function l(x,_,A,w,j){_.isMeshBasicMaterial||_.isMeshLambertMaterial?h(x,_):_.isMeshToonMaterial?(h(x,_),u(x,_)):_.isMeshPhongMaterial?(h(x,_),p(x,_)):_.isMeshStandardMaterial?(h(x,_),g(x,_),_.isMeshPhysicalMaterial&&S(x,_,j)):_.isMeshMatcapMaterial?(h(x,_),y(x,_)):_.isMeshDepthMaterial?h(x,_):_.isMeshDistanceMaterial?(h(x,_),T(x,_)):_.isMeshNormalMaterial?h(x,_):_.isLineBasicMaterial?(f(x,_),_.isLineDashedMaterial&&c(x,_)):_.isPointsMaterial?s(x,_,A,w):_.isSpriteMaterial?d(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function h(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,t(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===m.BackSide&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,t(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===m.BackSide&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,t(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,t(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,t(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const A=i.get(_).envMap;if(A&&(x.envMap.value=A,x.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap){x.lightMap.value=_.lightMap;const w=n.useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=_.lightMapIntensity*w,t(_.lightMap,x.lightMapTransform)}_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,t(_.aoMap,x.aoMapTransform))}function f(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform))}function c(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function s(x,_,A,w){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*A,x.scale.value=w*.5,_.map&&(x.map.value=_.map,t(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function d(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function p(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function u(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function g(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,t(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,t(_.roughnessMap,x.roughnessMapTransform)),i.get(_).envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function S(x,_,A){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,t(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,t(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,t(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,t(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,t(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===m.BackSide&&x.clearcoatNormalScale.value.negate())),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,t(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,t(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=A.texture,x.transmissionSamplerSize.value.set(A.width,A.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,t(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,t(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,t(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,t(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,t(_.specularIntensityMap,x.specularIntensityMapTransform))}function y(x,_){_.matcap&&(x.matcap.value=_.matcap)}function T(x,_){const A=i.get(_).light;x.referencePosition.value.setFromMatrixPosition(A.matrixWorld),x.nearDistance.value=A.shadow.camera.near,x.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}},{"../../constants.js":"bqsVL","../shaders/UniformsUtils.js":"4tBjA","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"74Rh4":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGLUniformsGroups",()=>m);function m(M,v,n,i){let t={},r={},l=[];const h=n.isWebGL2?M.getParameter(M.MAX_UNIFORM_BUFFER_BINDINGS):0;function f(x,_){const A=_.program;i.uniformBlockBinding(x,A)}function c(x,_){let A=t[x.id];A===void 0&&(g(x),A=s(x),t[x.id]=A,x.addEventListener("dispose",y));const w=_.program;i.updateUBOMapping(x,w);const j=v.render.frame;r[x.id]!==j&&(p(x),r[x.id]=j)}function s(x){const _=d();x.__bindingPointIndex=_;const A=M.createBuffer(),w=x.__size,j=x.usage;return M.bindBuffer(M.UNIFORM_BUFFER,A),M.bufferData(M.UNIFORM_BUFFER,w,j),M.bindBuffer(M.UNIFORM_BUFFER,null),M.bindBufferBase(M.UNIFORM_BUFFER,_,A),A}function d(){for(let x=0;x<h;x++)if(l.indexOf(x)===-1)return l.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const _=t[x.id],A=x.uniforms,w=x.__cache;M.bindBuffer(M.UNIFORM_BUFFER,_);for(let j=0,R=A.length;j<R;j++){const L=A[j];if(u(L,j,w)===!0){const D=L.__offset,P=Array.isArray(L.value)?L.value:[L.value];let k=0;for(let O=0;O<P.length;O++){const F=P[O],G=S(F);typeof F=="number"?(L.__data[0]=F,M.bufferSubData(M.UNIFORM_BUFFER,D+k,L.__data)):F.isMatrix3?(L.__data[0]=F.elements[0],L.__data[1]=F.elements[1],L.__data[2]=F.elements[2],L.__data[3]=F.elements[0],L.__data[4]=F.elements[3],L.__data[5]=F.elements[4],L.__data[6]=F.elements[5],L.__data[7]=F.elements[0],L.__data[8]=F.elements[6],L.__data[9]=F.elements[7],L.__data[10]=F.elements[8],L.__data[11]=F.elements[0]):(F.toArray(L.__data,k),k+=G.storage/Float32Array.BYTES_PER_ELEMENT)}M.bufferSubData(M.UNIFORM_BUFFER,D,L.__data)}}M.bindBuffer(M.UNIFORM_BUFFER,null)}function u(x,_,A){const w=x.value;if(A[_]===void 0){if(typeof w=="number")A[_]=w;else{const j=Array.isArray(w)?w:[w],R=[];for(let L=0;L<j.length;L++)R.push(j[L].clone());A[_]=R}return!0}else if(typeof w=="number"){if(A[_]!==w)return A[_]=w,!0}else{const j=Array.isArray(A[_])?A[_]:[A[_]],R=Array.isArray(w)?w:[w];for(let L=0;L<j.length;L++){const D=j[L];if(D.equals(R[L])===!1)return D.copy(R[L]),!0}}return!1}function g(x){const _=x.uniforms;let A=0;const w=16;let j=0;for(let R=0,L=_.length;R<L;R++){const D=_[R],P={boundary:0,storage:0},k=Array.isArray(D.value)?D.value:[D.value];for(let O=0,F=k.length;O<F;O++){const G=k[O],b=S(G);P.boundary+=b.boundary,P.storage+=b.storage}if(D.__data=new Float32Array(P.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=A,R>0){j=A%w;const O=w-j;j!==0&&O-P.boundary<0&&(A+=w-j,D.__offset=A)}A+=P.storage}return j=A%w,j>0&&(A+=w-j),x.__size=A,x.__cache={},this}function S(x){const _={boundary:0,storage:0};return typeof x=="number"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function y(x){const _=x.target;_.removeEventListener("dispose",y);const A=l.indexOf(_.__bindingPointIndex);l.splice(A,1),M.deleteBuffer(t[_.id]),delete t[_.id],delete r[_.id]}function T(){for(const x in t)M.deleteBuffer(t[x]);l=[],t={},r={}}return{bind:f,update:c,dispose:T}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fUT9s:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WebGL1Renderer",()=>M);var m=e("./WebGLRenderer.js");class M extends m.WebGLRenderer{}M.prototype.isWebGL1Renderer=!0},{"./WebGLRenderer.js":"9OF3S","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],btueC:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"FogExp2",()=>M);var m=e("../math/Color.js");class M{constructor(n,i=25e-5){this.isFogExp2=!0,this.name="",this.color=new m.Color(n),this.density=i}clone(){return new M(this.color,this.density)}toJSON(){return{type:"FogExp2",color:this.color.getHex(),density:this.density}}}},{"../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lgETf:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Fog",()=>M);var m=e("../math/Color.js");class M{constructor(n,i=1,t=1e3){this.isFog=!0,this.name="",this.color=new m.Color(n),this.near=i,this.far=t}clone(){return new M(this.color,this.near,this.far)}toJSON(){return{type:"Fog",color:this.color.getHex(),near:this.near,far:this.far}}}},{"../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3Xh8n":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Scene",()=>M);var m=e("../core/Object3D.js");class M extends m.Object3D{constructor(){super();this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(n,i){return super.copy(n,i),n.background!==null&&(this.background=n.background.clone()),n.environment!==null&&(this.environment=n.environment.clone()),n.fog!==null&&(this.fog=n.fog.clone()),this.backgroundBlurriness=n.backgroundBlurriness,this.backgroundIntensity=n.backgroundIntensity,n.overrideMaterial!==null&&(this.overrideMaterial=n.overrideMaterial.clone()),this.matrixAutoUpdate=n.matrixAutoUpdate,this}toJSON(n){const i=super.toJSON(n);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i}}},{"../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eTjd4:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Sprite",()=>w);var m=e("../math/Vector2.js"),M=e("../math/Vector3.js"),v=e("../math/Matrix4.js"),n=e("../math/Triangle.js"),i=e("../core/Object3D.js"),t=e("../core/BufferGeometry.js"),r=e("../core/InterleavedBuffer.js"),l=e("../core/InterleavedBufferAttribute.js"),h=e("../materials/SpriteMaterial.js");let f;const c=new M.Vector3,s=new M.Vector3,d=new M.Vector3,p=new m.Vector2,u=new m.Vector2,g=new v.Matrix4,S=new M.Vector3,y=new M.Vector3,T=new M.Vector3,x=new m.Vector2,_=new m.Vector2,A=new m.Vector2;class w extends i.Object3D{constructor(L){super();if(this.isSprite=!0,this.type="Sprite",f===void 0){f=new t.BufferGeometry;const D=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),P=new r.InterleavedBuffer(D,5);f.setIndex([0,1,2,0,2,3]),f.setAttribute("position",new l.InterleavedBufferAttribute(P,3,0,!1)),f.setAttribute("uv",new l.InterleavedBufferAttribute(P,2,3,!1))}this.geometry=f,this.material=L!==void 0?L:new h.SpriteMaterial,this.center=new m.Vector2(.5,.5)}raycast(L,D){L.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),s.setFromMatrixScale(this.matrixWorld),g.copy(L.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(L.camera.matrixWorldInverse,this.matrixWorld),d.setFromMatrixPosition(this.modelViewMatrix),L.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&s.multiplyScalar(-d.z);const P=this.material.rotation;let k,O;P!==0&&(O=Math.cos(P),k=Math.sin(P));const F=this.center;j(S.set(-.5,-.5,0),d,F,s,k,O),j(y.set(.5,-.5,0),d,F,s,k,O),j(T.set(.5,.5,0),d,F,s,k,O),x.set(0,0),_.set(1,0),A.set(1,1);let G=L.ray.intersectTriangle(S,y,T,!1,c);if(G===null&&(j(y.set(-.5,.5,0),d,F,s,k,O),_.set(0,1),G=L.ray.intersectTriangle(S,T,y,!1,c),G===null))return;const b=L.ray.origin.distanceTo(c);b<L.near||b>L.far||D.push({distance:b,point:c.clone(),uv:n.Triangle.getInterpolation(c,S,y,T,x,_,A,new m.Vector2),face:null,object:this})}copy(L,D){return super.copy(L,D),L.center!==void 0&&this.center.copy(L.center),this.material=L.material,this}}function j(R,L,D,P,k,O){p.subVectors(R,D).addScalar(.5).multiply(P),k!==void 0?(u.x=O*p.x-k*p.y,u.y=k*p.x+O*p.y):u.copy(p),R.copy(L),R.x+=u.x,R.y+=u.y,R.applyMatrix4(g)}},{"../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../math/Matrix4.js":"64n8p","../math/Triangle.js":"bT9h1","../core/Object3D.js":"ibguD","../core/BufferGeometry.js":"jAZYz","../core/InterleavedBuffer.js":"931Vz","../core/InterleavedBufferAttribute.js":"1TZ2X","../materials/SpriteMaterial.js":"6O2rf","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"931Vz":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InterleavedBuffer",()=>v);var m=e("../math/MathUtils.js"),M=e("../constants.js");class v{constructor(i,t){this.isInterleavedBuffer=!0,this.array=i,this.stride=t,this.count=i!==void 0?i.length/t:0,this.usage=M.StaticDrawUsage,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=m.generateUUID()}onUploadCallback(){}set needsUpdate(i){i===!0&&this.version++}setUsage(i){return this.usage=i,this}copy(i){return this.array=new i.array.constructor(i.array),this.count=i.count,this.stride=i.stride,this.usage=i.usage,this}copyAt(i,t,r){i*=this.stride,r*=t.stride;for(let l=0,h=this.stride;l<h;l++)this.array[i+l]=t.array[r+l];return this}set(i,t=0){return this.array.set(i,t),this}clone(i){i.arrayBuffers===void 0&&(i.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=m.generateUUID()),i.arrayBuffers[this.array.buffer._uuid]===void 0&&(i.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(i.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(t,this.stride);return r.setUsage(this.usage),r}onUpload(i){return this.onUploadCallback=i,this}toJSON(i){return i.arrayBuffers===void 0&&(i.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=m.generateUUID()),i.arrayBuffers[this.array.buffer._uuid]===void 0&&(i.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}},{"../math/MathUtils.js":"9o1gq","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1TZ2X":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InterleavedBufferAttribute",()=>i);var m=e("../math/Vector3.js"),M=e("./BufferAttribute.js"),v=e("../math/MathUtils.js");const n=new m.Vector3;class i{constructor(r,l,h,f=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=r,this.itemSize=l,this.offset=h,this.normalized=f}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(r){this.data.needsUpdate=r}applyMatrix4(r){for(let l=0,h=this.data.count;l<h;l++)n.fromBufferAttribute(this,l),n.applyMatrix4(r),this.setXYZ(l,n.x,n.y,n.z);return this}applyNormalMatrix(r){for(let l=0,h=this.count;l<h;l++)n.fromBufferAttribute(this,l),n.applyNormalMatrix(r),this.setXYZ(l,n.x,n.y,n.z);return this}transformDirection(r){for(let l=0,h=this.count;l<h;l++)n.fromBufferAttribute(this,l),n.transformDirection(r),this.setXYZ(l,n.x,n.y,n.z);return this}setX(r,l){return this.normalized&&(l=(0,v.normalize)(l,this.array)),this.data.array[r*this.data.stride+this.offset]=l,this}setY(r,l){return this.normalized&&(l=(0,v.normalize)(l,this.array)),this.data.array[r*this.data.stride+this.offset+1]=l,this}setZ(r,l){return this.normalized&&(l=(0,v.normalize)(l,this.array)),this.data.array[r*this.data.stride+this.offset+2]=l,this}setW(r,l){return this.normalized&&(l=(0,v.normalize)(l,this.array)),this.data.array[r*this.data.stride+this.offset+3]=l,this}getX(r){let l=this.data.array[r*this.data.stride+this.offset];return this.normalized&&(l=(0,v.denormalize)(l,this.array)),l}getY(r){let l=this.data.array[r*this.data.stride+this.offset+1];return this.normalized&&(l=(0,v.denormalize)(l,this.array)),l}getZ(r){let l=this.data.array[r*this.data.stride+this.offset+2];return this.normalized&&(l=(0,v.denormalize)(l,this.array)),l}getW(r){let l=this.data.array[r*this.data.stride+this.offset+3];return this.normalized&&(l=(0,v.denormalize)(l,this.array)),l}setXY(r,l,h){return r=r*this.data.stride+this.offset,this.normalized&&(l=(0,v.normalize)(l,this.array),h=(0,v.normalize)(h,this.array)),this.data.array[r+0]=l,this.data.array[r+1]=h,this}setXYZ(r,l,h,f){return r=r*this.data.stride+this.offset,this.normalized&&(l=(0,v.normalize)(l,this.array),h=(0,v.normalize)(h,this.array),f=(0,v.normalize)(f,this.array)),this.data.array[r+0]=l,this.data.array[r+1]=h,this.data.array[r+2]=f,this}setXYZW(r,l,h,f,c){return r=r*this.data.stride+this.offset,this.normalized&&(l=(0,v.normalize)(l,this.array),h=(0,v.normalize)(h,this.array),f=(0,v.normalize)(f,this.array),c=(0,v.normalize)(c,this.array)),this.data.array[r+0]=l,this.data.array[r+1]=h,this.data.array[r+2]=f,this.data.array[r+3]=c,this}clone(r){if(r===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const l=[];for(let h=0;h<this.count;h++){const f=h*this.data.stride+this.offset;for(let c=0;c<this.itemSize;c++)l.push(this.data.array[f+c])}return new M.BufferAttribute(new this.array.constructor(l),this.itemSize,this.normalized)}else return r.interleavedBuffers===void 0&&(r.interleavedBuffers={}),r.interleavedBuffers[this.data.uuid]===void 0&&(r.interleavedBuffers[this.data.uuid]=this.data.clone(r)),new i(r.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(r){if(r===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const l=[];for(let h=0;h<this.count;h++){const f=h*this.data.stride+this.offset;for(let c=0;c<this.itemSize;c++)l.push(this.data.array[f+c])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:l,normalized:this.normalized}}else return r.interleavedBuffers===void 0&&(r.interleavedBuffers={}),r.interleavedBuffers[this.data.uuid]===void 0&&(r.interleavedBuffers[this.data.uuid]=this.data.toJSON(r)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}},{"../math/Vector3.js":"fUbuJ","./BufferAttribute.js":"7hhbt","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6O2rf":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SpriteMaterial",()=>v);var m=e("./Material.js"),M=e("../math/Color.js");class v extends m.Material{constructor(i){super();this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new M.Color(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(i)}copy(i){return super.copy(i),this.color.copy(i.color),this.map=i.map,this.alphaMap=i.alphaMap,this.rotation=i.rotation,this.sizeAttenuation=i.sizeAttenuation,this.fog=i.fog,this}}},{"./Material.js":"l4ClZ","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bBvxa:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LOD",()=>i);var m=e("../math/Vector3.js"),M=e("../core/Object3D.js");const v=new m.Vector3,n=new m.Vector3;class i extends M.Object3D{constructor(){super();this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(r){super.copy(r,!1);const l=r.levels;for(let h=0,f=l.length;h<f;h++){const c=l[h];this.addLevel(c.object.clone(),c.distance,c.hysteresis)}return this.autoUpdate=r.autoUpdate,this}addLevel(r,l=0,h=0){l=Math.abs(l);const f=this.levels;let c;for(c=0;c<f.length&&!(l<f[c].distance);c++);return f.splice(c,0,{distance:l,hysteresis:h,object:r}),this.add(r),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(r){const l=this.levels;if(l.length>0){let h,f;for(h=1,f=l.length;h<f;h++){let c=l[h].distance;if(l[h].object.visible&&(c-=c*l[h].hysteresis),r<c)break}return l[h-1].object}return null}raycast(r,l){if(this.levels.length>0){v.setFromMatrixPosition(this.matrixWorld);const f=r.ray.origin.distanceTo(v);this.getObjectForDistance(f).raycast(r,l)}}update(r){const l=this.levels;if(l.length>1){v.setFromMatrixPosition(r.matrixWorld),n.setFromMatrixPosition(this.matrixWorld);const h=v.distanceTo(n)/r.zoom;l[0].object.visible=!0;let f,c;for(f=1,c=l.length;f<c;f++){let s=l[f].distance;if(l[f].object.visible&&(s-=s*l[f].hysteresis),h>=s)l[f-1].object.visible=!1,l[f].object.visible=!0;else break}for(this._currentLevel=f-1;f<c;f++)l[f].object.visible=!1}}toJSON(r){const l=super.toJSON(r);this.autoUpdate===!1&&(l.object.autoUpdate=!1),l.object.levels=[];const h=this.levels;for(let f=0,c=h.length;f<c;f++){const s=h[f];l.object.levels.push({object:s.object.uuid,distance:s.distance,hysteresis:s.hysteresis})}return l}}},{"../math/Vector3.js":"fUbuJ","../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5xf7y":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SkinnedMesh",()=>S);var m=e("./Mesh.js"),M=e("../math/Box3.js"),v=e("../math/Matrix4.js"),n=e("../math/Sphere.js"),i=e("../math/Vector3.js"),t=e("../math/Vector4.js"),r=e("../math/Ray.js");const l=new i.Vector3,h=new t.Vector4,f=new t.Vector4,c=new i.Vector3,s=new v.Matrix4,d=new i.Vector3,p=new n.Sphere,u=new v.Matrix4,g=new r.Ray;class S extends m.Mesh{constructor(T,x){super(T,x);this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new v.Matrix4,this.bindMatrixInverse=new v.Matrix4,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const T=this.geometry;this.boundingBox===null&&(this.boundingBox=new M.Box3),this.boundingBox.makeEmpty();const x=T.getAttribute("position");for(let _=0;_<x.count;_++)d.fromBufferAttribute(x,_),this.applyBoneTransform(_,d),this.boundingBox.expandByPoint(d)}computeBoundingSphere(){const T=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new n.Sphere),this.boundingSphere.makeEmpty();const x=T.getAttribute("position");for(let _=0;_<x.count;_++)d.fromBufferAttribute(x,_),this.applyBoneTransform(_,d),this.boundingSphere.expandByPoint(d)}copy(T,x){return super.copy(T,x),this.bindMode=T.bindMode,this.bindMatrix.copy(T.bindMatrix),this.bindMatrixInverse.copy(T.bindMatrixInverse),this.skeleton=T.skeleton,T.boundingBox!==null&&(this.boundingBox=T.boundingBox.clone()),T.boundingSphere!==null&&(this.boundingSphere=T.boundingSphere.clone()),this}raycast(T,x){const _=this.material,A=this.matrixWorld;_!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),p.copy(this.boundingSphere),p.applyMatrix4(A),T.ray.intersectsSphere(p)!==!1&&(u.copy(A).invert(),g.copy(T.ray).applyMatrix4(u),!(this.boundingBox!==null&&g.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(T,x,g)))}getVertexPosition(T,x){return super.getVertexPosition(T,x),this.applyBoneTransform(T,x),x}bind(T,x){this.skeleton=T,x===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),x=this.matrixWorld),this.bindMatrix.copy(x),this.bindMatrixInverse.copy(x).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const T=new t.Vector4,x=this.geometry.attributes.skinWeight;for(let _=0,A=x.count;_<A;_++){T.fromBufferAttribute(x,_);const w=1/T.manhattanLength();w!==1/0?T.multiplyScalar(w):T.set(1,0,0,0),x.setXYZW(_,T.x,T.y,T.z,T.w)}}updateMatrixWorld(T){super.updateMatrixWorld(T),this.bindMode==="attached"?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode==="detached"?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(T,x){const _=this.skeleton,A=this.geometry;h.fromBufferAttribute(A.attributes.skinIndex,T),f.fromBufferAttribute(A.attributes.skinWeight,T),l.copy(x).applyMatrix4(this.bindMatrix),x.set(0,0,0);for(let w=0;w<4;w++){const j=f.getComponent(w);if(j!==0){const R=h.getComponent(w);s.multiplyMatrices(_.bones[R].matrixWorld,_.boneInverses[R]),x.addScaledVector(c.copy(l).applyMatrix4(s),j)}}return x.applyMatrix4(this.bindMatrixInverse)}boneTransform(T,x){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(T,x)}}},{"./Mesh.js":"d9YFT","../math/Box3.js":"dDJ5Q","../math/Matrix4.js":"64n8p","../math/Sphere.js":"jgQJ1","../math/Vector3.js":"fUbuJ","../math/Vector4.js":"h0tSe","../math/Ray.js":"8evV6","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],k7L5l:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Skeleton",()=>l);var m=e("../constants.js"),M=e("./Bone.js"),v=e("../math/Matrix4.js"),n=e("../textures/DataTexture.js"),i=e("../math/MathUtils.js");const t=new v.Matrix4,r=new v.Matrix4;class l{constructor(f=[],c=[]){this.uuid=i.generateUUID(),this.bones=f.slice(0),this.boneInverses=c,this.boneMatrices=null,this.boneTexture=null,this.boneTextureSize=0,this.init()}init(){const f=this.bones,c=this.boneInverses;if(this.boneMatrices=new Float32Array(f.length*16),c.length===0)this.calculateInverses();else if(f.length!==c.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let s=0,d=this.bones.length;s<d;s++)this.boneInverses.push(new v.Matrix4)}}calculateInverses(){this.boneInverses.length=0;for(let f=0,c=this.bones.length;f<c;f++){const s=new v.Matrix4;this.bones[f]&&s.copy(this.bones[f].matrixWorld).invert(),this.boneInverses.push(s)}}pose(){for(let f=0,c=this.bones.length;f<c;f++){const s=this.bones[f];s&&s.matrixWorld.copy(this.boneInverses[f]).invert()}for(let f=0,c=this.bones.length;f<c;f++){const s=this.bones[f];s&&(s.parent&&s.parent.isBone?(s.matrix.copy(s.parent.matrixWorld).invert(),s.matrix.multiply(s.matrixWorld)):s.matrix.copy(s.matrixWorld),s.matrix.decompose(s.position,s.quaternion,s.scale))}}update(){const f=this.bones,c=this.boneInverses,s=this.boneMatrices,d=this.boneTexture;for(let p=0,u=f.length;p<u;p++){const g=f[p]?f[p].matrixWorld:r;t.multiplyMatrices(g,c[p]),t.toArray(s,p*16)}d!==null&&(d.needsUpdate=!0)}clone(){return new l(this.bones,this.boneInverses)}computeBoneTexture(){let f=Math.sqrt(this.bones.length*4);f=i.ceilPowerOfTwo(f),f=Math.max(f,4);const c=new Float32Array(f*f*4);c.set(this.boneMatrices);const s=new n.DataTexture(c,f,f,m.RGBAFormat,m.FloatType);return s.needsUpdate=!0,this.boneMatrices=c,this.boneTexture=s,this.boneTextureSize=f,this}getBoneByName(f){for(let c=0,s=this.bones.length;c<s;c++){const d=this.bones[c];if(d.name===f)return d}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(f,c){this.uuid=f.uuid;for(let s=0,d=f.bones.length;s<d;s++){const p=f.bones[s];let u=c[p];u===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",p),u=new M.Bone),this.bones.push(u),this.boneInverses.push(new v.Matrix4().fromArray(f.boneInverses[s]))}return this.init(),this}toJSON(){const f={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};f.uuid=this.uuid;const c=this.bones,s=this.boneInverses;for(let d=0,p=c.length;d<p;d++){const u=c[d];f.bones.push(u.uuid);const g=s[d];f.boneInverses.push(g.toArray())}return f}}},{"../constants.js":"bqsVL","./Bone.js":"ihC8O","../math/Matrix4.js":"64n8p","../textures/DataTexture.js":"6eyK2","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ihC8O:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Bone",()=>M);var m=e("../core/Object3D.js");class M extends m.Object3D{constructor(){super();this.isBone=!0,this.type="Bone"}}},{"../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6eyK2":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DataTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i=null,t=1,r=1,l,h,f,c,s,d=M.NearestFilter,p=M.NearestFilter,u,g){super(null,f,c,s,d,p,l,h,u,g);this.isDataTexture=!0,this.image={data:i,width:t,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fB156:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InstancedMesh",()=>d);var m=e("../core/InstancedBufferAttribute.js"),M=e("./Mesh.js"),v=e("../math/Box3.js"),n=e("../math/Matrix4.js"),i=e("../math/Sphere.js");const t=new n.Matrix4,r=new n.Matrix4,l=[],h=new v.Box3,f=new n.Matrix4,c=new M.Mesh,s=new i.Sphere;class d extends M.Mesh{constructor(u,g,S){super(u,g);this.isInstancedMesh=!0,this.instanceMatrix=new m.InstancedBufferAttribute(new Float32Array(S*16),16),this.instanceColor=null,this.count=S,this.boundingBox=null,this.boundingSphere=null;for(let y=0;y<S;y++)this.setMatrixAt(y,f)}computeBoundingBox(){const u=this.geometry,g=this.count;this.boundingBox===null&&(this.boundingBox=new v.Box3),u.boundingBox===null&&u.computeBoundingBox(),this.boundingBox.makeEmpty();for(let S=0;S<g;S++)this.getMatrixAt(S,t),h.copy(u.boundingBox).applyMatrix4(t),this.boundingBox.union(h)}computeBoundingSphere(){const u=this.geometry,g=this.count;this.boundingSphere===null&&(this.boundingSphere=new i.Sphere),u.boundingSphere===null&&u.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let S=0;S<g;S++)this.getMatrixAt(S,t),s.copy(u.boundingSphere).applyMatrix4(t),this.boundingSphere.union(s)}copy(u,g){return super.copy(u,g),this.instanceMatrix.copy(u.instanceMatrix),u.instanceColor!==null&&(this.instanceColor=u.instanceColor.clone()),this.count=u.count,u.boundingBox!==null&&(this.boundingBox=u.boundingBox.clone()),u.boundingSphere!==null&&(this.boundingSphere=u.boundingSphere.clone()),this}getColorAt(u,g){g.fromArray(this.instanceColor.array,u*3)}getMatrixAt(u,g){g.fromArray(this.instanceMatrix.array,u*16)}raycast(u,g){const S=this.matrixWorld,y=this.count;if(c.geometry=this.geometry,c.material=this.material,c.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),s.copy(this.boundingSphere),s.applyMatrix4(S),u.ray.intersectsSphere(s)!==!1))for(let T=0;T<y;T++){this.getMatrixAt(T,t),r.multiplyMatrices(S,t),c.matrixWorld=r,c.raycast(u,l);for(let x=0,_=l.length;x<_;x++){const A=l[x];A.instanceId=T,A.object=this,g.push(A)}l.length=0}}setColorAt(u,g){this.instanceColor===null&&(this.instanceColor=new m.InstancedBufferAttribute(new Float32Array(this.instanceMatrix.count*3),3)),g.toArray(this.instanceColor.array,u*3)}setMatrixAt(u,g){g.toArray(this.instanceMatrix.array,u*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}},{"../core/InstancedBufferAttribute.js":"cf2Wn","./Mesh.js":"d9YFT","../math/Box3.js":"dDJ5Q","../math/Matrix4.js":"64n8p","../math/Sphere.js":"jgQJ1","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cf2Wn:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InstancedBufferAttribute",()=>M);var m=e("./BufferAttribute.js");class M extends m.BufferAttribute{constructor(n,i,t,r=1){super(n,i,t);this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(n){return super.copy(n),this.meshPerAttribute=n.meshPerAttribute,this}toJSON(){const n=super.toJSON();return n.meshPerAttribute=this.meshPerAttribute,n.isInstancedBufferAttribute=!0,n}}},{"./BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cOWpn:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineSegments",()=>t);var m=e("./Line.js"),M=e("../math/Vector3.js"),v=e("../core/BufferAttribute.js");const n=new M.Vector3,i=new M.Vector3;class t extends m.Line{constructor(l,h){super(l,h);this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const l=this.geometry;if(l.index===null){const h=l.attributes.position,f=[];for(let c=0,s=h.count;c<s;c+=2)n.fromBufferAttribute(h,c),i.fromBufferAttribute(h,c+1),f[c]=c===0?0:f[c-1],f[c+1]=f[c]+n.distanceTo(i);l.setAttribute("lineDistance",new v.Float32BufferAttribute(f,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}},{"./Line.js":"li6mQ","../math/Vector3.js":"fUbuJ","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],li6mQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Line",()=>p);var m=e("../math/Sphere.js"),M=e("../math/Ray.js"),v=e("../math/Matrix4.js"),n=e("../core/Object3D.js"),i=e("../math/Vector3.js"),t=e("../materials/LineBasicMaterial.js"),r=e("../core/BufferGeometry.js"),l=e("../core/BufferAttribute.js");const h=new i.Vector3,f=new i.Vector3,c=new v.Matrix4,s=new M.Ray,d=new m.Sphere;class p extends n.Object3D{constructor(g=new r.BufferGeometry,S=new t.LineBasicMaterial){super();this.isLine=!0,this.type="Line",this.geometry=g,this.material=S,this.updateMorphTargets()}copy(g,S){return super.copy(g,S),this.material=g.material,this.geometry=g.geometry,this}computeLineDistances(){const g=this.geometry;if(g.index===null){const S=g.attributes.position,y=[0];for(let T=1,x=S.count;T<x;T++)h.fromBufferAttribute(S,T-1),f.fromBufferAttribute(S,T),y[T]=y[T-1],y[T]+=h.distanceTo(f);g.setAttribute("lineDistance",new l.Float32BufferAttribute(y,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(g,S){const y=this.geometry,T=this.matrixWorld,x=g.params.Line.threshold,_=y.drawRange;if(y.boundingSphere===null&&y.computeBoundingSphere(),d.copy(y.boundingSphere),d.applyMatrix4(T),d.radius+=x,g.ray.intersectsSphere(d)===!1)return;c.copy(T).invert(),s.copy(g.ray).applyMatrix4(c);const A=x/((this.scale.x+this.scale.y+this.scale.z)/3),w=A*A,j=new i.Vector3,R=new i.Vector3,L=new i.Vector3,D=new i.Vector3,P=this.isLineSegments?2:1,k=y.index,F=y.attributes.position;if(k!==null){const G=Math.max(0,_.start),b=Math.min(k.count,_.start+_.count);for(let C=G,I=b-1;C<I;C+=P){const B=k.getX(C),H=k.getX(C+1);if(j.fromBufferAttribute(F,B),R.fromBufferAttribute(F,H),s.distanceSqToSegment(j,R,D,L)>w)continue;D.applyMatrix4(this.matrixWorld);const Y=g.ray.origin.distanceTo(D);Y<g.near||Y>g.far||S.push({distance:Y,point:L.clone().applyMatrix4(this.matrixWorld),index:C,face:null,faceIndex:null,object:this})}}else{const G=Math.max(0,_.start),b=Math.min(F.count,_.start+_.count);for(let C=G,I=b-1;C<I;C+=P){if(j.fromBufferAttribute(F,C),R.fromBufferAttribute(F,C+1),s.distanceSqToSegment(j,R,D,L)>w)continue;D.applyMatrix4(this.matrixWorld);const H=g.ray.origin.distanceTo(D);H<g.near||H>g.far||S.push({distance:H,point:L.clone().applyMatrix4(this.matrixWorld),index:C,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const S=this.geometry.morphAttributes,y=Object.keys(S);if(y.length>0){const T=S[y[0]];if(T!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let x=0,_=T.length;x<_;x++){const A=T[x].name||String(x);this.morphTargetInfluences.push(0),this.morphTargetDictionary[A]=x}}}}}},{"../math/Sphere.js":"jgQJ1","../math/Ray.js":"8evV6","../math/Matrix4.js":"64n8p","../core/Object3D.js":"ibguD","../math/Vector3.js":"fUbuJ","../materials/LineBasicMaterial.js":"cRUug","../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cRUug:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineBasicMaterial",()=>v);var m=e("./Material.js"),M=e("../math/Color.js");class v extends m.Material{constructor(i){super();this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new M.Color(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(i)}copy(i){return super.copy(i),this.color.copy(i.color),this.map=i.map,this.linewidth=i.linewidth,this.linecap=i.linecap,this.linejoin=i.linejoin,this.fog=i.fog,this}}},{"./Material.js":"l4ClZ","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"11P2S":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineLoop",()=>M);var m=e("./Line.js");class M extends m.Line{constructor(n,i){super(n,i);this.isLineLoop=!0,this.type="LineLoop"}}},{"./Line.js":"li6mQ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gR9K2:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Points",()=>s);var m=e("../math/Sphere.js"),M=e("../math/Ray.js"),v=e("../math/Matrix4.js"),n=e("../core/Object3D.js"),i=e("../math/Vector3.js"),t=e("../materials/PointsMaterial.js"),r=e("../core/BufferGeometry.js");const l=new v.Matrix4,h=new M.Ray,f=new m.Sphere,c=new i.Vector3;class s extends n.Object3D{constructor(u=new r.BufferGeometry,g=new t.PointsMaterial){super();this.isPoints=!0,this.type="Points",this.geometry=u,this.material=g,this.updateMorphTargets()}copy(u,g){return super.copy(u,g),this.material=u.material,this.geometry=u.geometry,this}raycast(u,g){const S=this.geometry,y=this.matrixWorld,T=u.params.Points.threshold,x=S.drawRange;if(S.boundingSphere===null&&S.computeBoundingSphere(),f.copy(S.boundingSphere),f.applyMatrix4(y),f.radius+=T,u.ray.intersectsSphere(f)===!1)return;l.copy(y).invert(),h.copy(u.ray).applyMatrix4(l);const _=T/((this.scale.x+this.scale.y+this.scale.z)/3),A=_*_,w=S.index,R=S.attributes.position;if(w!==null){const L=Math.max(0,x.start),D=Math.min(w.count,x.start+x.count);for(let P=L,k=D;P<k;P++){const O=w.getX(P);c.fromBufferAttribute(R,O),d(c,O,A,y,u,g,this)}}else{const L=Math.max(0,x.start),D=Math.min(R.count,x.start+x.count);for(let P=L,k=D;P<k;P++)c.fromBufferAttribute(R,P),d(c,P,A,y,u,g,this)}}updateMorphTargets(){const g=this.geometry.morphAttributes,S=Object.keys(g);if(S.length>0){const y=g[S[0]];if(y!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let T=0,x=y.length;T<x;T++){const _=y[T].name||String(T);this.morphTargetInfluences.push(0),this.morphTargetDictionary[_]=T}}}}}function d(p,u,g,S,y,T,x){const _=h.distanceSqToPoint(p);if(_<g){const A=new i.Vector3;h.closestPointToPoint(p,A),A.applyMatrix4(S);const w=y.ray.origin.distanceTo(A);if(w<y.near||w>y.far)return;T.push({distance:w,distanceToRay:Math.sqrt(_),point:A,index:u,face:null,object:x})}}},{"../math/Sphere.js":"jgQJ1","../math/Ray.js":"8evV6","../math/Matrix4.js":"64n8p","../core/Object3D.js":"ibguD","../math/Vector3.js":"fUbuJ","../materials/PointsMaterial.js":"j3vSF","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j3vSF:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PointsMaterial",()=>v);var m=e("./Material.js"),M=e("../math/Color.js");class v extends m.Material{constructor(i){super();this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new M.Color(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(i)}copy(i){return super.copy(i),this.color.copy(i.color),this.map=i.map,this.alphaMap=i.alphaMap,this.size=i.size,this.sizeAttenuation=i.sizeAttenuation,this.fog=i.fog,this}}},{"./Material.js":"l4ClZ","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fMTJT:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"VideoTexture",()=>v);var m=e("../constants.js"),M=e("./Texture.js");class v extends M.Texture{constructor(i,t,r,l,h,f,c,s,d){super(i,t,r,l,h,f,c,s,d);this.isVideoTexture=!0,this.minFilter=f!==void 0?f:m.LinearFilter,this.magFilter=h!==void 0?h:m.LinearFilter,this.generateMipmaps=!1;const p=this;function u(){p.needsUpdate=!0,i.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in i&&i.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const i=this.image;"requestVideoFrameCallback"in i===!1&&i.readyState>=i.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}},{"../constants.js":"bqsVL","./Texture.js":"2paEl","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],f5ZOG:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"FramebufferTexture",()=>v);var m=e("./Texture.js"),M=e("../constants.js");class v extends m.Texture{constructor(i,t){super({width:i,height:t});this.isFramebufferTexture=!0,this.magFilter=M.NearestFilter,this.minFilter=M.NearestFilter,this.generateMipmaps=!1,this.needsUpdate=!0}}},{"./Texture.js":"2paEl","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1DPW2":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CompressedTexture",()=>M);var m=e("./Texture.js");class M extends m.Texture{constructor(n,i,t,r,l,h,f,c,s,d,p,u){super(null,h,f,c,s,d,r,l,p,u);this.isCompressedTexture=!0,this.image={width:i,height:t},this.mipmaps=n,this.flipY=!1,this.generateMipmaps=!1}}},{"./Texture.js":"2paEl","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8jeyI":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CompressedArrayTexture",()=>v);var m=e("../constants.js"),M=e("./CompressedTexture.js");class v extends M.CompressedTexture{constructor(i,t,r,l,h,f){super(i,t,r,h,f);this.isCompressedArrayTexture=!0,this.image.depth=l,this.wrapR=m.ClampToEdgeWrapping}}},{"../constants.js":"bqsVL","./CompressedTexture.js":"1DPW2","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],huGWz:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CanvasTexture",()=>M);var m=e("./Texture.js");class M extends m.Texture{constructor(n,i,t,r,l,h,f,c,s){super(n,i,t,r,l,h,f,c,s);this.isCanvasTexture=!0,this.needsUpdate=!0}}},{"./Texture.js":"2paEl","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8bcQC":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o);var m=e("./BoxGeometry.js");a.exportAll(m,o);var M=e("./CapsuleGeometry.js");a.exportAll(M,o);var v=e("./CircleGeometry.js");a.exportAll(v,o);var n=e("./ConeGeometry.js");a.exportAll(n,o);var i=e("./CylinderGeometry.js");a.exportAll(i,o);var t=e("./DodecahedronGeometry.js");a.exportAll(t,o);var r=e("./EdgesGeometry.js");a.exportAll(r,o);var l=e("./ExtrudeGeometry.js");a.exportAll(l,o);var h=e("./IcosahedronGeometry.js");a.exportAll(h,o);var f=e("./LatheGeometry.js");a.exportAll(f,o);var c=e("./OctahedronGeometry.js");a.exportAll(c,o);var s=e("./PlaneGeometry.js");a.exportAll(s,o);var d=e("./PolyhedronGeometry.js");a.exportAll(d,o);var p=e("./RingGeometry.js");a.exportAll(p,o);var u=e("./ShapeGeometry.js");a.exportAll(u,o);var g=e("./SphereGeometry.js");a.exportAll(g,o);var S=e("./TetrahedronGeometry.js");a.exportAll(S,o);var y=e("./TorusGeometry.js");a.exportAll(y,o);var T=e("./TorusKnotGeometry.js");a.exportAll(T,o);var x=e("./TubeGeometry.js");a.exportAll(x,o);var _=e("./WireframeGeometry.js");a.exportAll(_,o)},{"./BoxGeometry.js":"5eHyr","./CapsuleGeometry.js":"QNepT","./CircleGeometry.js":"3fVKR","./ConeGeometry.js":"joIPs","./CylinderGeometry.js":"1dXMP","./DodecahedronGeometry.js":"f5ZRt","./EdgesGeometry.js":"cTed6","./ExtrudeGeometry.js":"dzQ9i","./IcosahedronGeometry.js":"6AyMY","./LatheGeometry.js":"gAPph","./OctahedronGeometry.js":"fckWH","./PlaneGeometry.js":"amiFV","./PolyhedronGeometry.js":"1WZUt","./RingGeometry.js":"1X2GG","./ShapeGeometry.js":"crgJD","./SphereGeometry.js":"1yNk5","./TetrahedronGeometry.js":"kIIZS","./TorusGeometry.js":"36Bnf","./TorusKnotGeometry.js":"6S0uq","./TubeGeometry.js":"7wPd4","./WireframeGeometry.js":"2CcFO","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],QNepT:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CapsuleGeometry",()=>v);var m=e("../extras/core/Path.js"),M=e("./LatheGeometry.js");class v extends M.LatheGeometry{constructor(i=1,t=1,r=4,l=8){const h=new m.Path;h.absarc(0,-t/2,i,Math.PI*1.5,0),h.absarc(0,t/2,i,0,Math.PI*.5);super(h.getPoints(r),l);this.type="CapsuleGeometry",this.parameters={radius:i,height:t,capSegments:r,radialSegments:l}}static fromJSON(i){return new v(i.radius,i.length,i.capSegments,i.radialSegments)}}},{"../extras/core/Path.js":"11ocG","./LatheGeometry.js":"gAPph","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"11ocG":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Path",()=>l);var m=e("../../math/Vector2.js"),M=e("./CurvePath.js"),v=e("../curves/EllipseCurve.js"),n=e("../curves/SplineCurve.js"),i=e("../curves/CubicBezierCurve.js"),t=e("../curves/QuadraticBezierCurve.js"),r=e("../curves/LineCurve.js");class l extends M.CurvePath{constructor(f){super();this.type="Path",this.currentPoint=new m.Vector2,f&&this.setFromPoints(f)}setFromPoints(f){this.moveTo(f[0].x,f[0].y);for(let c=1,s=f.length;c<s;c++)this.lineTo(f[c].x,f[c].y);return this}moveTo(f,c){return this.currentPoint.set(f,c),this}lineTo(f,c){const s=new r.LineCurve(this.currentPoint.clone(),new m.Vector2(f,c));return this.curves.push(s),this.currentPoint.set(f,c),this}quadraticCurveTo(f,c,s,d){const p=new t.QuadraticBezierCurve(this.currentPoint.clone(),new m.Vector2(f,c),new m.Vector2(s,d));return this.curves.push(p),this.currentPoint.set(s,d),this}bezierCurveTo(f,c,s,d,p,u){const g=new i.CubicBezierCurve(this.currentPoint.clone(),new m.Vector2(f,c),new m.Vector2(s,d),new m.Vector2(p,u));return this.curves.push(g),this.currentPoint.set(p,u),this}splineThru(f){const c=[this.currentPoint.clone()].concat(f),s=new n.SplineCurve(c);return this.curves.push(s),this.currentPoint.copy(f[f.length-1]),this}arc(f,c,s,d,p,u){const g=this.currentPoint.x,S=this.currentPoint.y;return this.absarc(f+g,c+S,s,d,p,u),this}absarc(f,c,s,d,p,u){return this.absellipse(f,c,s,s,d,p,u),this}ellipse(f,c,s,d,p,u,g,S){const y=this.currentPoint.x,T=this.currentPoint.y;return this.absellipse(f+y,c+T,s,d,p,u,g,S),this}absellipse(f,c,s,d,p,u,g,S){const y=new v.EllipseCurve(f,c,s,d,p,u,g,S);if(this.curves.length>0){const x=y.getPoint(0);x.equals(this.currentPoint)||this.lineTo(x.x,x.y)}this.curves.push(y);const T=y.getPoint(1);return this.currentPoint.copy(T),this}copy(f){return super.copy(f),this.currentPoint.copy(f.currentPoint),this}toJSON(){const f=super.toJSON();return f.currentPoint=this.currentPoint.toArray(),f}fromJSON(f){return super.fromJSON(f),this.currentPoint.fromArray(f.currentPoint),this}}},{"../../math/Vector2.js":"crXpG","./CurvePath.js":"eWmYX","../curves/EllipseCurve.js":"djQD2","../curves/SplineCurve.js":"c6WxI","../curves/CubicBezierCurve.js":"OluDe","../curves/QuadraticBezierCurve.js":"gKq69","../curves/LineCurve.js":"avivy","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eWmYX:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CurvePath",()=>v);var m=e("./Curve.js"),M=e("../curves/Curves.js");class v extends m.Curve{constructor(){super();this.type="CurvePath",this.curves=[],this.autoClose=!1}add(i){this.curves.push(i)}closePath(){const i=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);i.equals(t)||this.curves.push(new M.LineCurve(t,i))}getPoint(i,t){const r=i*this.getLength(),l=this.getCurveLengths();let h=0;for(;h<l.length;){if(l[h]>=r){const f=l[h]-r,c=this.curves[h],s=c.getLength(),d=s===0?0:1-f/s;return c.getPointAt(d,t)}h++}return null}getLength(){const i=this.getCurveLengths();return i[i.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const i=[];let t=0;for(let r=0,l=this.curves.length;r<l;r++)t+=this.curves[r].getLength(),i.push(t);return this.cacheLengths=i,i}getSpacedPoints(i=40){const t=[];for(let r=0;r<=i;r++)t.push(this.getPoint(r/i));return this.autoClose&&t.push(t[0]),t}getPoints(i=12){const t=[];let r;for(let l=0,h=this.curves;l<h.length;l++){const f=h[l],c=f.isEllipseCurve?i*2:f.isLineCurve||f.isLineCurve3?1:f.isSplineCurve?i*f.points.length:i,s=f.getPoints(c);for(let d=0;d<s.length;d++){const p=s[d];r&&r.equals(p)||(t.push(p),r=p)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(i){super.copy(i),this.curves=[];for(let t=0,r=i.curves.length;t<r;t++){const l=i.curves[t];this.curves.push(l.clone())}return this.autoClose=i.autoClose,this}toJSON(){const i=super.toJSON();i.autoClose=this.autoClose,i.curves=[];for(let t=0,r=this.curves.length;t<r;t++){const l=this.curves[t];i.curves.push(l.toJSON())}return i}fromJSON(i){super.fromJSON(i),this.autoClose=i.autoClose,this.curves=[];for(let t=0,r=i.curves.length;t<r;t++){const l=i.curves[t];this.curves.push(new M[l.type]().fromJSON(l))}return this}}},{"./Curve.js":"5LCIB","../curves/Curves.js":"d3xIh","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5LCIB":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Curve",()=>i);var m=e("../../math/MathUtils.js"),M=e("../../math/Vector2.js"),v=e("../../math/Vector3.js"),n=e("../../math/Matrix4.js");class i{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(r,l){const h=this.getUtoTmapping(r);return this.getPoint(h,l)}getPoints(r=5){const l=[];for(let h=0;h<=r;h++)l.push(this.getPoint(h/r));return l}getSpacedPoints(r=5){const l=[];for(let h=0;h<=r;h++)l.push(this.getPointAt(h/r));return l}getLength(){const r=this.getLengths();return r[r.length-1]}getLengths(r=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===r+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const l=[];let h,f=this.getPoint(0),c=0;l.push(0);for(let s=1;s<=r;s++)h=this.getPoint(s/r),c+=h.distanceTo(f),l.push(c),f=h;return this.cacheArcLengths=l,l}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(r,l){const h=this.getLengths();let f=0;const c=h.length;let s;l?s=l:s=r*h[c-1];let d=0,p=c-1,u;for(;d<=p;)if(f=Math.floor(d+(p-d)/2),u=h[f]-s,u<0)d=f+1;else if(u>0)p=f-1;else{p=f;break}if(f=p,h[f]===s)return f/(c-1);const g=h[f],y=h[f+1]-g,T=(s-g)/y;return(f+T)/(c-1)}getTangent(r,l){const h=1e-4;let f=r-h,c=r+h;f<0&&(f=0),c>1&&(c=1);const s=this.getPoint(f),d=this.getPoint(c),p=l||(s.isVector2?new M.Vector2:new v.Vector3);return p.copy(d).sub(s).normalize(),p}getTangentAt(r,l){const h=this.getUtoTmapping(r);return this.getTangent(h,l)}computeFrenetFrames(r,l){const h=new v.Vector3,f=[],c=[],s=[],d=new v.Vector3,p=new n.Matrix4;for(let T=0;T<=r;T++){const x=T/r;f[T]=this.getTangentAt(x,new v.Vector3)}c[0]=new v.Vector3,s[0]=new v.Vector3;let u=Number.MAX_VALUE;const g=Math.abs(f[0].x),S=Math.abs(f[0].y),y=Math.abs(f[0].z);g<=u&&(u=g,h.set(1,0,0)),S<=u&&(u=S,h.set(0,1,0)),y<=u&&h.set(0,0,1),d.crossVectors(f[0],h).normalize(),c[0].crossVectors(f[0],d),s[0].crossVectors(f[0],c[0]);for(let T=1;T<=r;T++){if(c[T]=c[T-1].clone(),s[T]=s[T-1].clone(),d.crossVectors(f[T-1],f[T]),d.length()>Number.EPSILON){d.normalize();const x=Math.acos(m.clamp(f[T-1].dot(f[T]),-1,1));c[T].applyMatrix4(p.makeRotationAxis(d,x))}s[T].crossVectors(f[T],c[T])}if(l===!0){let T=Math.acos(m.clamp(c[0].dot(c[r]),-1,1));T/=r,f[0].dot(d.crossVectors(c[0],c[r]))>0&&(T=-T);for(let x=1;x<=r;x++)c[x].applyMatrix4(p.makeRotationAxis(f[x],T*x)),s[x].crossVectors(f[x],c[x])}return{tangents:f,normals:c,binormals:s}}clone(){return new this.constructor().copy(this)}copy(r){return this.arcLengthDivisions=r.arcLengthDivisions,this}toJSON(){const r={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return r.arcLengthDivisions=this.arcLengthDivisions,r.type=this.type,r}fromJSON(r){return this.arcLengthDivisions=r.arcLengthDivisions,this}}},{"../../math/MathUtils.js":"9o1gq","../../math/Vector2.js":"crXpG","../../math/Vector3.js":"fUbuJ","../../math/Matrix4.js":"64n8p","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d3xIh:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ArcCurve",()=>m.ArcCurve),a.export(o,"CatmullRomCurve3",()=>M.CatmullRomCurve3),a.export(o,"CubicBezierCurve",()=>v.CubicBezierCurve),a.export(o,"CubicBezierCurve3",()=>n.CubicBezierCurve3),a.export(o,"EllipseCurve",()=>i.EllipseCurve),a.export(o,"LineCurve",()=>t.LineCurve),a.export(o,"LineCurve3",()=>r.LineCurve3),a.export(o,"QuadraticBezierCurve",()=>l.QuadraticBezierCurve),a.export(o,"QuadraticBezierCurve3",()=>h.QuadraticBezierCurve3),a.export(o,"SplineCurve",()=>f.SplineCurve);var m=e("./ArcCurve.js"),M=e("./CatmullRomCurve3.js"),v=e("./CubicBezierCurve.js"),n=e("./CubicBezierCurve3.js"),i=e("./EllipseCurve.js"),t=e("./LineCurve.js"),r=e("./LineCurve3.js"),l=e("./QuadraticBezierCurve.js"),h=e("./QuadraticBezierCurve3.js"),f=e("./SplineCurve.js")},{"./ArcCurve.js":"4BvpH","./CatmullRomCurve3.js":"atQmI","./CubicBezierCurve.js":"OluDe","./CubicBezierCurve3.js":"jaCOP","./EllipseCurve.js":"djQD2","./LineCurve.js":"avivy","./LineCurve3.js":"gu2BH","./QuadraticBezierCurve.js":"gKq69","./QuadraticBezierCurve3.js":"hXo26","./SplineCurve.js":"c6WxI","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4BvpH":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ArcCurve",()=>M);var m=e("./EllipseCurve.js");class M extends m.EllipseCurve{constructor(n,i,t,r,l,h){super(n,i,t,t,r,l,h);this.isArcCurve=!0,this.type="ArcCurve"}}},{"./EllipseCurve.js":"djQD2","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],djQD2:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"EllipseCurve",()=>v);var m=e("../core/Curve.js"),M=e("../../math/Vector2.js");class v extends m.Curve{constructor(i=0,t=0,r=1,l=1,h=0,f=Math.PI*2,c=!1,s=0){super();this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=i,this.aY=t,this.xRadius=r,this.yRadius=l,this.aStartAngle=h,this.aEndAngle=f,this.aClockwise=c,this.aRotation=s}getPoint(i,t){const r=t||new M.Vector2,l=Math.PI*2;let h=this.aEndAngle-this.aStartAngle;const f=Math.abs(h)<Number.EPSILON;for(;h<0;)h+=l;for(;h>l;)h-=l;h<Number.EPSILON&&(f?h=0:h=l),this.aClockwise===!0&&!f&&(h===l?h=-l:h=h-l);const c=this.aStartAngle+i*h;let s=this.aX+this.xRadius*Math.cos(c),d=this.aY+this.yRadius*Math.sin(c);if(this.aRotation!==0){const p=Math.cos(this.aRotation),u=Math.sin(this.aRotation),g=s-this.aX,S=d-this.aY;s=g*p-S*u+this.aX,d=g*u+S*p+this.aY}return r.set(s,d)}copy(i){return super.copy(i),this.aX=i.aX,this.aY=i.aY,this.xRadius=i.xRadius,this.yRadius=i.yRadius,this.aStartAngle=i.aStartAngle,this.aEndAngle=i.aEndAngle,this.aClockwise=i.aClockwise,this.aRotation=i.aRotation,this}toJSON(){const i=super.toJSON();return i.aX=this.aX,i.aY=this.aY,i.xRadius=this.xRadius,i.yRadius=this.yRadius,i.aStartAngle=this.aStartAngle,i.aEndAngle=this.aEndAngle,i.aClockwise=this.aClockwise,i.aRotation=this.aRotation,i}fromJSON(i){return super.fromJSON(i),this.aX=i.aX,this.aY=i.aY,this.xRadius=i.xRadius,this.yRadius=i.yRadius,this.aStartAngle=i.aStartAngle,this.aEndAngle=i.aEndAngle,this.aClockwise=i.aClockwise,this.aRotation=i.aRotation,this}}},{"../core/Curve.js":"5LCIB","../../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],atQmI:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CatmullRomCurve3",()=>l);var m=e("../../math/Vector3.js"),M=e("../core/Curve.js");function v(){let h=0,f=0,c=0,s=0;function d(p,u,g,S){h=p,f=g,c=-3*p+3*u-2*g-S,s=2*p-2*u+g+S}return{initCatmullRom:function(p,u,g,S,y){d(u,g,y*(g-p),y*(S-u))},initNonuniformCatmullRom:function(p,u,g,S,y,T,x){let _=(u-p)/y-(g-p)/(y+T)+(g-u)/T,A=(g-u)/T-(S-u)/(T+x)+(S-g)/x;_*=T,A*=T,d(u,g,_,A)},calc:function(p){const u=p*p,g=u*p;return h+f*p+c*u+s*g}}}const n=new m.Vector3,i=new v,t=new v,r=new v;class l extends M.Curve{constructor(f=[],c=!1,s="centripetal",d=.5){super();this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=f,this.closed=c,this.curveType=s,this.tension=d}getPoint(f,c=new m.Vector3){const s=c,d=this.points,p=d.length,u=(p-(this.closed?0:1))*f;let g=Math.floor(u),S=u-g;this.closed?g+=g>0?0:(Math.floor(Math.abs(g)/p)+1)*p:S===0&&g===p-1&&(g=p-2,S=1);let y,T;this.closed||g>0?y=d[(g-1)%p]:(n.subVectors(d[0],d[1]).add(d[0]),y=n);const x=d[g%p],_=d[(g+1)%p];if(this.closed||g+2<p?T=d[(g+2)%p]:(n.subVectors(d[p-1],d[p-2]).add(d[p-1]),T=n),this.curveType==="centripetal"||this.curveType==="chordal"){const A=this.curveType==="chordal"?.5:.25;let w=Math.pow(y.distanceToSquared(x),A),j=Math.pow(x.distanceToSquared(_),A),R=Math.pow(_.distanceToSquared(T),A);j<1e-4&&(j=1),w<1e-4&&(w=j),R<1e-4&&(R=j),i.initNonuniformCatmullRom(y.x,x.x,_.x,T.x,w,j,R),t.initNonuniformCatmullRom(y.y,x.y,_.y,T.y,w,j,R),r.initNonuniformCatmullRom(y.z,x.z,_.z,T.z,w,j,R)}else this.curveType==="catmullrom"&&(i.initCatmullRom(y.x,x.x,_.x,T.x,this.tension),t.initCatmullRom(y.y,x.y,_.y,T.y,this.tension),r.initCatmullRom(y.z,x.z,_.z,T.z,this.tension));return s.set(i.calc(S),t.calc(S),r.calc(S)),s}copy(f){super.copy(f),this.points=[];for(let c=0,s=f.points.length;c<s;c++){const d=f.points[c];this.points.push(d.clone())}return this.closed=f.closed,this.curveType=f.curveType,this.tension=f.tension,this}toJSON(){const f=super.toJSON();f.points=[];for(let c=0,s=this.points.length;c<s;c++){const d=this.points[c];f.points.push(d.toArray())}return f.closed=this.closed,f.curveType=this.curveType,f.tension=this.tension,f}fromJSON(f){super.fromJSON(f),this.points=[];for(let c=0,s=f.points.length;c<s;c++){const d=f.points[c];this.points.push(new m.Vector3().fromArray(d))}return this.closed=f.closed,this.curveType=f.curveType,this.tension=f.tension,this}}},{"../../math/Vector3.js":"fUbuJ","../core/Curve.js":"5LCIB","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],OluDe:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubicBezierCurve",()=>n);var m=e("../core/Curve.js"),M=e("../core/Interpolations.js"),v=e("../../math/Vector2.js");class n extends m.Curve{constructor(t=new v.Vector2,r=new v.Vector2,l=new v.Vector2,h=new v.Vector2){super();this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=r,this.v2=l,this.v3=h}getPoint(t,r=new v.Vector2){const l=r,h=this.v0,f=this.v1,c=this.v2,s=this.v3;return l.set((0,M.CubicBezier)(t,h.x,f.x,c.x,s.x),(0,M.CubicBezier)(t,h.y,f.y,c.y,s.y)),l}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}},{"../core/Curve.js":"5LCIB","../core/Interpolations.js":"anIRO","../../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],anIRO:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CatmullRom",()=>m),a.export(o,"QuadraticBezier",()=>i),a.export(o,"CubicBezier",()=>f);function m(c,s,d,p,u){const g=(p-s)*.5,S=(u-d)*.5,y=c*c,T=c*y;return(2*d-2*p+g+S)*T+(-3*d+3*p-2*g-S)*y+g*c+d}function M(c,s){const d=1-c;return d*d*s}function v(c,s){return 2*(1-c)*c*s}function n(c,s){return c*c*s}function i(c,s,d,p){return M(c,s)+v(c,d)+n(c,p)}function t(c,s){const d=1-c;return d*d*d*s}function r(c,s){const d=1-c;return 3*d*d*c*s}function l(c,s){return 3*(1-c)*c*c*s}function h(c,s){return c*c*c*s}function f(c,s,d,p,u){return t(c,s)+r(c,d)+l(c,p)+h(c,u)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jaCOP:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubicBezierCurve3",()=>n);var m=e("../core/Curve.js"),M=e("../core/Interpolations.js"),v=e("../../math/Vector3.js");class n extends m.Curve{constructor(t=new v.Vector3,r=new v.Vector3,l=new v.Vector3,h=new v.Vector3){super();this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=r,this.v2=l,this.v3=h}getPoint(t,r=new v.Vector3){const l=r,h=this.v0,f=this.v1,c=this.v2,s=this.v3;return l.set((0,M.CubicBezier)(t,h.x,f.x,c.x,s.x),(0,M.CubicBezier)(t,h.y,f.y,c.y,s.y),(0,M.CubicBezier)(t,h.z,f.z,c.z,s.z)),l}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}},{"../core/Curve.js":"5LCIB","../core/Interpolations.js":"anIRO","../../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],avivy:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineCurve",()=>v);var m=e("../../math/Vector2.js"),M=e("../core/Curve.js");class v extends M.Curve{constructor(i=new m.Vector2,t=new m.Vector2){super();this.isLineCurve=!0,this.type="LineCurve",this.v1=i,this.v2=t}getPoint(i,t=new m.Vector2){const r=t;return i===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(i).add(this.v1)),r}getPointAt(i,t){return this.getPoint(i,t)}getTangent(i,t=new m.Vector2){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(i,t){return this.getTangent(i,t)}copy(i){return super.copy(i),this.v1.copy(i.v1),this.v2.copy(i.v2),this}toJSON(){const i=super.toJSON();return i.v1=this.v1.toArray(),i.v2=this.v2.toArray(),i}fromJSON(i){return super.fromJSON(i),this.v1.fromArray(i.v1),this.v2.fromArray(i.v2),this}}},{"../../math/Vector2.js":"crXpG","../core/Curve.js":"5LCIB","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gu2BH:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineCurve3",()=>v);var m=e("../../math/Vector3.js"),M=e("../core/Curve.js");class v extends M.Curve{constructor(i=new m.Vector3,t=new m.Vector3){super();this.isLineCurve3=!0,this.type="LineCurve3",this.v1=i,this.v2=t}getPoint(i,t=new m.Vector3){const r=t;return i===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(i).add(this.v1)),r}getPointAt(i,t){return this.getPoint(i,t)}getTangent(i,t=new m.Vector3){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(i,t){return this.getTangent(i,t)}copy(i){return super.copy(i),this.v1.copy(i.v1),this.v2.copy(i.v2),this}toJSON(){const i=super.toJSON();return i.v1=this.v1.toArray(),i.v2=this.v2.toArray(),i}fromJSON(i){return super.fromJSON(i),this.v1.fromArray(i.v1),this.v2.fromArray(i.v2),this}}},{"../../math/Vector3.js":"fUbuJ","../core/Curve.js":"5LCIB","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gKq69:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"QuadraticBezierCurve",()=>n);var m=e("../core/Curve.js"),M=e("../core/Interpolations.js"),v=e("../../math/Vector2.js");class n extends m.Curve{constructor(t=new v.Vector2,r=new v.Vector2,l=new v.Vector2){super();this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=r,this.v2=l}getPoint(t,r=new v.Vector2){const l=r,h=this.v0,f=this.v1,c=this.v2;return l.set((0,M.QuadraticBezier)(t,h.x,f.x,c.x),(0,M.QuadraticBezier)(t,h.y,f.y,c.y)),l}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}},{"../core/Curve.js":"5LCIB","../core/Interpolations.js":"anIRO","../../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hXo26:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"QuadraticBezierCurve3",()=>n);var m=e("../core/Curve.js"),M=e("../core/Interpolations.js"),v=e("../../math/Vector3.js");class n extends m.Curve{constructor(t=new v.Vector3,r=new v.Vector3,l=new v.Vector3){super();this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=r,this.v2=l}getPoint(t,r=new v.Vector3){const l=r,h=this.v0,f=this.v1,c=this.v2;return l.set((0,M.QuadraticBezier)(t,h.x,f.x,c.x),(0,M.QuadraticBezier)(t,h.y,f.y,c.y),(0,M.QuadraticBezier)(t,h.z,f.z,c.z)),l}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}},{"../core/Curve.js":"5LCIB","../core/Interpolations.js":"anIRO","../../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],c6WxI:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SplineCurve",()=>n);var m=e("../core/Curve.js"),M=e("../core/Interpolations.js"),v=e("../../math/Vector2.js");class n extends m.Curve{constructor(t=[]){super();this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,r=new v.Vector2){const l=r,h=this.points,f=(h.length-1)*t,c=Math.floor(f),s=f-c,d=h[c===0?c:c-1],p=h[c],u=h[c>h.length-2?h.length-1:c+1],g=h[c>h.length-3?h.length-1:c+2];return l.set((0,M.CatmullRom)(s,d.x,p.x,u.x,g.x),(0,M.CatmullRom)(s,d.y,p.y,u.y,g.y)),l}copy(t){super.copy(t),this.points=[];for(let r=0,l=t.points.length;r<l;r++){const h=t.points[r];this.points.push(h.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let r=0,l=this.points.length;r<l;r++){const h=this.points[r];t.points.push(h.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let r=0,l=t.points.length;r<l;r++){const h=t.points[r];this.points.push(new v.Vector2().fromArray(h))}return this}}},{"../core/Curve.js":"5LCIB","../core/Interpolations.js":"anIRO","../../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gAPph:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LatheGeometry",()=>t);var m=e("../core/BufferAttribute.js"),M=e("../core/BufferGeometry.js"),v=e("../math/Vector3.js"),n=e("../math/Vector2.js"),i=e("../math/MathUtils.js");class t extends M.BufferGeometry{constructor(l=[new n.Vector2(0,-.5),new n.Vector2(.5,0),new n.Vector2(0,.5)],h=12,f=0,c=Math.PI*2){super();this.type="LatheGeometry",this.parameters={points:l,segments:h,phiStart:f,phiLength:c},h=Math.floor(h),c=i.clamp(c,0,Math.PI*2);const s=[],d=[],p=[],u=[],g=[],S=1/h,y=new v.Vector3,T=new n.Vector2,x=new v.Vector3,_=new v.Vector3,A=new v.Vector3;let w=0,j=0;for(let R=0;R<=l.length-1;R++)switch(R){case 0:w=l[R+1].x-l[R].x,j=l[R+1].y-l[R].y,x.x=j*1,x.y=-w,x.z=j*0,A.copy(x),x.normalize(),u.push(x.x,x.y,x.z);break;case l.length-1:u.push(A.x,A.y,A.z);break;default:w=l[R+1].x-l[R].x,j=l[R+1].y-l[R].y,x.x=j*1,x.y=-w,x.z=j*0,_.copy(x),x.x+=A.x,x.y+=A.y,x.z+=A.z,x.normalize(),u.push(x.x,x.y,x.z),A.copy(_)}for(let R=0;R<=h;R++){const L=f+R*S*c,D=Math.sin(L),P=Math.cos(L);for(let k=0;k<=l.length-1;k++){y.x=l[k].x*D,y.y=l[k].y,y.z=l[k].x*P,d.push(y.x,y.y,y.z),T.x=R/h,T.y=k/(l.length-1),p.push(T.x,T.y);const O=u[3*k+0]*D,F=u[3*k+1],G=u[3*k+0]*P;g.push(O,F,G)}}for(let R=0;R<h;R++)for(let L=0;L<l.length-1;L++){const D=L+R*l.length,P=D,k=D+l.length,O=D+l.length+1,F=D+1;s.push(P,k,F),s.push(O,F,k)}this.setIndex(s),this.setAttribute("position",new m.Float32BufferAttribute(d,3)),this.setAttribute("uv",new m.Float32BufferAttribute(p,2)),this.setAttribute("normal",new m.Float32BufferAttribute(g,3))}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new t(l.points,l.segments,l.phiStart,l.phiLength)}}},{"../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3fVKR":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CircleGeometry",()=>i);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js"),n=e("../math/Vector2.js");class i extends m.BufferGeometry{constructor(r=1,l=32,h=0,f=Math.PI*2){super();this.type="CircleGeometry",this.parameters={radius:r,segments:l,thetaStart:h,thetaLength:f},l=Math.max(3,l);const c=[],s=[],d=[],p=[],u=new v.Vector3,g=new n.Vector2;s.push(0,0,0),d.push(0,0,1),p.push(.5,.5);for(let S=0,y=3;S<=l;S++,y+=3){const T=h+S/l*f;u.x=r*Math.cos(T),u.y=r*Math.sin(T),s.push(u.x,u.y,u.z),d.push(0,0,1),g.x=(s[y]/r+1)/2,g.y=(s[y+1]/r+1)/2,p.push(g.x,g.y)}for(let S=1;S<=l;S++)c.push(S,S+1,0);this.setIndex(c),this.setAttribute("position",new M.Float32BufferAttribute(s,3)),this.setAttribute("normal",new M.Float32BufferAttribute(d,3)),this.setAttribute("uv",new M.Float32BufferAttribute(p,2))}copy(r){return super.copy(r),this.parameters=Object.assign({},r.parameters),this}static fromJSON(r){return new i(r.radius,r.segments,r.thetaStart,r.thetaLength)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],joIPs:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ConeGeometry",()=>M);var m=e("./CylinderGeometry.js");class M extends m.CylinderGeometry{constructor(n=1,i=1,t=32,r=1,l=!1,h=0,f=Math.PI*2){super(0,n,i,t,r,l,h,f);this.type="ConeGeometry",this.parameters={radius:n,height:i,radialSegments:t,heightSegments:r,openEnded:l,thetaStart:h,thetaLength:f}}static fromJSON(n){return new M(n.radius,n.height,n.radialSegments,n.heightSegments,n.openEnded,n.thetaStart,n.thetaLength)}}},{"./CylinderGeometry.js":"1dXMP","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1dXMP":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CylinderGeometry",()=>i);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js"),n=e("../math/Vector2.js");class i extends m.BufferGeometry{constructor(r=1,l=1,h=1,f=32,c=1,s=!1,d=0,p=Math.PI*2){super();this.type="CylinderGeometry",this.parameters={radiusTop:r,radiusBottom:l,height:h,radialSegments:f,heightSegments:c,openEnded:s,thetaStart:d,thetaLength:p};const u=this;f=Math.floor(f),c=Math.floor(c);const g=[],S=[],y=[],T=[];let x=0;const _=[],A=h/2;let w=0;j(),s===!1&&(r>0&&R(!0),l>0&&R(!1)),this.setIndex(g),this.setAttribute("position",new M.Float32BufferAttribute(S,3)),this.setAttribute("normal",new M.Float32BufferAttribute(y,3)),this.setAttribute("uv",new M.Float32BufferAttribute(T,2));function j(){const L=new v.Vector3,D=new v.Vector3;let P=0;const k=(l-r)/h;for(let O=0;O<=c;O++){const F=[],G=O/c,b=G*(l-r)+r;for(let C=0;C<=f;C++){const I=C/f,B=I*p+d,H=Math.sin(B),X=Math.cos(B);D.x=b*H,D.y=-G*h+A,D.z=b*X,S.push(D.x,D.y,D.z),L.set(H,k,X).normalize(),y.push(L.x,L.y,L.z),T.push(I,1-G),F.push(x++)}_.push(F)}for(let O=0;O<f;O++)for(let F=0;F<c;F++){const G=_[F][O],b=_[F+1][O],C=_[F+1][O+1],I=_[F][O+1];g.push(G,b,I),g.push(b,C,I),P+=6}u.addGroup(w,P,0),w+=P}function R(L){const D=x,P=new n.Vector2,k=new v.Vector3;let O=0;const F=L===!0?r:l,G=L===!0?1:-1;for(let C=1;C<=f;C++)S.push(0,A*G,0),y.push(0,G,0),T.push(.5,.5),x++;const b=x;for(let C=0;C<=f;C++){const B=C/f*p+d,H=Math.cos(B),X=Math.sin(B);k.x=F*X,k.y=A*G,k.z=F*H,S.push(k.x,k.y,k.z),y.push(0,G,0),P.x=H*.5+.5,P.y=X*.5*G+.5,T.push(P.x,P.y),x++}for(let C=0;C<f;C++){const I=D+C,B=b+C;L===!0?g.push(B,B+1,I):g.push(B+1,B,I),O+=3}u.addGroup(w,O,L===!0?1:2),w+=O}}copy(r){return super.copy(r),this.parameters=Object.assign({},r.parameters),this}static fromJSON(r){return new i(r.radiusTop,r.radiusBottom,r.height,r.radialSegments,r.heightSegments,r.openEnded,r.thetaStart,r.thetaLength)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],f5ZRt:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DodecahedronGeometry",()=>M);var m=e("./PolyhedronGeometry.js");class M extends m.PolyhedronGeometry{constructor(n=1,i=0){const t=(1+Math.sqrt(5))/2,r=1/t,l=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-t,0,-r,t,0,r,-t,0,r,t,-r,-t,0,-r,t,0,r,-t,0,r,t,0,-t,0,-r,t,0,-r,-t,0,r,t,0,r],h=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(l,h,n,i);this.type="DodecahedronGeometry",this.parameters={radius:n,detail:i}}static fromJSON(n){return new M(n.radius,n.detail)}}},{"./PolyhedronGeometry.js":"1WZUt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1WZUt":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PolyhedronGeometry",()=>i);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js"),n=e("../math/Vector2.js");class i extends m.BufferGeometry{constructor(r=[],l=[],h=1,f=0){super();this.type="PolyhedronGeometry",this.parameters={vertices:r,indices:l,radius:h,detail:f};const c=[],s=[];d(f),u(h),g(),this.setAttribute("position",new M.Float32BufferAttribute(c,3)),this.setAttribute("normal",new M.Float32BufferAttribute(c.slice(),3)),this.setAttribute("uv",new M.Float32BufferAttribute(s,2)),f===0?this.computeVertexNormals():this.normalizeNormals();function d(j){const R=new v.Vector3,L=new v.Vector3,D=new v.Vector3;for(let P=0;P<l.length;P+=3)T(l[P+0],R),T(l[P+1],L),T(l[P+2],D),p(R,L,D,j)}function p(j,R,L,D){const P=D+1,k=[];for(let O=0;O<=P;O++){k[O]=[];const F=j.clone().lerp(L,O/P),G=R.clone().lerp(L,O/P),b=P-O;for(let C=0;C<=b;C++)C===0&&O===P?k[O][C]=F:k[O][C]=F.clone().lerp(G,C/b)}for(let O=0;O<P;O++)for(let F=0;F<2*(P-O)-1;F++){const G=Math.floor(F/2);F%2==0?(y(k[O][G+1]),y(k[O+1][G]),y(k[O][G])):(y(k[O][G+1]),y(k[O+1][G+1]),y(k[O+1][G]))}}function u(j){const R=new v.Vector3;for(let L=0;L<c.length;L+=3)R.x=c[L+0],R.y=c[L+1],R.z=c[L+2],R.normalize().multiplyScalar(j),c[L+0]=R.x,c[L+1]=R.y,c[L+2]=R.z}function g(){const j=new v.Vector3;for(let R=0;R<c.length;R+=3){j.x=c[R+0],j.y=c[R+1],j.z=c[R+2];const L=A(j)/2/Math.PI+.5,D=w(j)/Math.PI+.5;s.push(L,1-D)}x(),S()}function S(){for(let j=0;j<s.length;j+=6){const R=s[j+0],L=s[j+2],D=s[j+4],P=Math.max(R,L,D),k=Math.min(R,L,D);P>.9&&k<.1&&(R<.2&&(s[j+0]+=1),L<.2&&(s[j+2]+=1),D<.2&&(s[j+4]+=1))}}function y(j){c.push(j.x,j.y,j.z)}function T(j,R){const L=j*3;R.x=r[L+0],R.y=r[L+1],R.z=r[L+2]}function x(){const j=new v.Vector3,R=new v.Vector3,L=new v.Vector3,D=new v.Vector3,P=new n.Vector2,k=new n.Vector2,O=new n.Vector2;for(let F=0,G=0;F<c.length;F+=9,G+=6){j.set(c[F+0],c[F+1],c[F+2]),R.set(c[F+3],c[F+4],c[F+5]),L.set(c[F+6],c[F+7],c[F+8]),P.set(s[G+0],s[G+1]),k.set(s[G+2],s[G+3]),O.set(s[G+4],s[G+5]),D.copy(j).add(R).add(L).divideScalar(3);const b=A(D);_(P,G+0,j,b),_(k,G+2,R,b),_(O,G+4,L,b)}}function _(j,R,L,D){D<0&&j.x===1&&(s[R]=j.x-1),L.x===0&&L.z===0&&(s[R]=D/2/Math.PI+.5)}function A(j){return Math.atan2(j.z,-j.x)}function w(j){return Math.atan2(-j.y,Math.sqrt(j.x*j.x+j.z*j.z))}}copy(r){return super.copy(r),this.parameters=Object.assign({},r.parameters),this}static fromJSON(r){return new i(r.vertices,r.indices,r.radius,r.details)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cTed6:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"EdgesGeometry",()=>f);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/MathUtils.js"),n=e("../math/Triangle.js"),i=e("../math/Vector3.js");const t=new i.Vector3,r=new i.Vector3,l=new i.Vector3,h=new n.Triangle;class f extends m.BufferGeometry{constructor(s=null,d=1){super();if(this.type="EdgesGeometry",this.parameters={geometry:s,thresholdAngle:d},s!==null){const u=Math.pow(10,4),g=Math.cos(v.DEG2RAD*d),S=s.getIndex(),y=s.getAttribute("position"),T=S?S.count:y.count,x=[0,0,0],_=["a","b","c"],A=new Array(3),w={},j=[];for(let R=0;R<T;R+=3){S?(x[0]=S.getX(R),x[1]=S.getX(R+1),x[2]=S.getX(R+2)):(x[0]=R,x[1]=R+1,x[2]=R+2);const{a:L,b:D,c:P}=h;if(L.fromBufferAttribute(y,x[0]),D.fromBufferAttribute(y,x[1]),P.fromBufferAttribute(y,x[2]),h.getNormal(l),A[0]=`${Math.round(L.x*u)},${Math.round(L.y*u)},${Math.round(L.z*u)}`,A[1]=`${Math.round(D.x*u)},${Math.round(D.y*u)},${Math.round(D.z*u)}`,A[2]=`${Math.round(P.x*u)},${Math.round(P.y*u)},${Math.round(P.z*u)}`,!(A[0]===A[1]||A[1]===A[2]||A[2]===A[0]))for(let k=0;k<3;k++){const O=(k+1)%3,F=A[k],G=A[O],b=h[_[k]],C=h[_[O]],I=`${F}_${G}`,B=`${G}_${F}`;B in w&&w[B]?(l.dot(w[B].normal)<=g&&(j.push(b.x,b.y,b.z),j.push(C.x,C.y,C.z)),w[B]=null):I in w||(w[I]={index0:x[k],index1:x[O],normal:l.clone()})}}for(const R in w)if(w[R]){const{index0:L,index1:D}=w[R];t.fromBufferAttribute(y,L),r.fromBufferAttribute(y,D),j.push(t.x,t.y,t.z),j.push(r.x,r.y,r.z)}this.setAttribute("position",new M.Float32BufferAttribute(j,3))}}copy(s){return super.copy(s),this.parameters=Object.assign({},s.parameters),this}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/MathUtils.js":"9o1gq","../math/Triangle.js":"bT9h1","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dzQ9i:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ExtrudeGeometry",()=>l);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../extras/curves/Curves.js"),n=e("../math/Vector2.js"),i=e("../math/Vector3.js"),t=e("../extras/core/Shape.js"),r=e("../extras/ShapeUtils.js");class l extends m.BufferGeometry{constructor(s=new t.Shape([new n.Vector2(.5,.5),new n.Vector2(-.5,.5),new n.Vector2(-.5,-.5),new n.Vector2(.5,-.5)]),d={}){super();this.type="ExtrudeGeometry",this.parameters={shapes:s,options:d},s=Array.isArray(s)?s:[s];const p=this,u=[],g=[];for(let y=0,T=s.length;y<T;y++){const x=s[y];S(x)}this.setAttribute("position",new M.Float32BufferAttribute(u,3)),this.setAttribute("uv",new M.Float32BufferAttribute(g,2)),this.computeVertexNormals();function S(y){const T=[],x=d.curveSegments!==void 0?d.curveSegments:12,_=d.steps!==void 0?d.steps:1,A=d.depth!==void 0?d.depth:1;let w=d.bevelEnabled!==void 0?d.bevelEnabled:!0,j=d.bevelThickness!==void 0?d.bevelThickness:.2,R=d.bevelSize!==void 0?d.bevelSize:j-.1,L=d.bevelOffset!==void 0?d.bevelOffset:0,D=d.bevelSegments!==void 0?d.bevelSegments:3;const P=d.extrudePath,k=d.UVGenerator!==void 0?d.UVGenerator:h;let O,F=!1,G,b,C,I;P&&(O=P.getSpacedPoints(_),F=!0,w=!1,G=P.computeFrenetFrames(_,!1),b=new i.Vector3,C=new i.Vector3,I=new i.Vector3),w||(D=0,j=0,R=0,L=0);const B=y.extractPoints(x);let H=B.shape;const X=B.holes;if(!r.ShapeUtils.isClockWise(H)){H=H.reverse();for(let ae=0,be=X.length;ae<be;ae++){const Se=X[ae];r.ShapeUtils.isClockWise(Se)&&(X[ae]=Se.reverse())}}const Z=r.ShapeUtils.triangulateShape(H,X),Q=H;for(let ae=0,be=X.length;ae<be;ae++){const Se=X[ae];H=H.concat(Se)}function ne(ae,be,Se){return be||console.error("THREE.ExtrudeGeometry: vec does not exist"),ae.clone().addScaledVector(be,Se)}const ge=H.length,me=Z.length;function _e(ae,be,Se){let Ae,Ce,Be;const U=ae.x-be.x,E=ae.y-be.y,V=Se.x-ae.x,re=Se.y-ae.y,ue=U*U+E*E,J=U*re-E*V;if(Math.abs(J)>Number.EPSILON){const fe=Math.sqrt(ue),Te=Math.sqrt(V*V+re*re),pe=be.x-E/fe,Ie=be.y+U/fe,ke=Se.x-re/Te,De=Se.y+V/Te,Ge=((ke-pe)*re-(De-Ie)*V)/(U*re-E*V);Ae=pe+U*Ge-ae.x,Ce=Ie+E*Ge-ae.y;const Ue=Ae*Ae+Ce*Ce;if(Ue<=2)return new n.Vector2(Ae,Ce);Be=Math.sqrt(Ue/2)}else{let fe=!1;U>Number.EPSILON?V>Number.EPSILON&&(fe=!0):U<-Number.EPSILON?V<-Number.EPSILON&&(fe=!0):Math.sign(E)===Math.sign(re)&&(fe=!0),fe?(Ae=-E,Ce=U,Be=Math.sqrt(ue)):(Ae=U,Ce=E,Be=Math.sqrt(ue/2))}return new n.Vector2(Ae/Be,Ce/Be)}const le=[];for(let ae=0,be=Q.length,Se=be-1,Ae=ae+1;ae<be;ae++,Se++,Ae++)Se===be&&(Se=0),Ae===be&&(Ae=0),le[ae]=_e(Q[ae],Q[Se],Q[Ae]);const ee=[];let je,z=le.concat();for(let ae=0,be=X.length;ae<be;ae++){const Se=X[ae];je=[];for(let Ae=0,Ce=Se.length,Be=Ce-1,U=Ae+1;Ae<Ce;Ae++,Be++,U++)Be===Ce&&(Be=0),U===Ce&&(U=0),je[Ae]=_e(Se[Ae],Se[Be],Se[U]);ee.push(je),z=z.concat(je)}for(let ae=0;ae<D;ae++){const be=ae/D,Se=j*Math.cos(be*Math.PI/2),Ae=R*Math.sin(be*Math.PI/2)+L;for(let Ce=0,Be=Q.length;Ce<Be;Ce++){const U=ne(Q[Ce],le[Ce],Ae);q(U.x,U.y,-Se)}for(let Ce=0,Be=X.length;Ce<Be;Ce++){const U=X[Ce];je=ee[Ce];for(let E=0,V=U.length;E<V;E++){const re=ne(U[E],je[E],Ae);q(re.x,re.y,-Se)}}}const $=R+L;for(let ae=0;ae<ge;ae++){const be=w?ne(H[ae],z[ae],$):H[ae];F?(C.copy(G.normals[0]).multiplyScalar(be.x),b.copy(G.binormals[0]).multiplyScalar(be.y),I.copy(O[0]).add(C).add(b),q(I.x,I.y,I.z)):q(be.x,be.y,0)}for(let ae=1;ae<=_;ae++)for(let be=0;be<ge;be++){const Se=w?ne(H[be],z[be],$):H[be];F?(C.copy(G.normals[ae]).multiplyScalar(Se.x),b.copy(G.binormals[ae]).multiplyScalar(Se.y),I.copy(O[ae]).add(C).add(b),q(I.x,I.y,I.z)):q(Se.x,Se.y,A/_*ae)}for(let ae=D-1;ae>=0;ae--){const be=ae/D,Se=j*Math.cos(be*Math.PI/2),Ae=R*Math.sin(be*Math.PI/2)+L;for(let Ce=0,Be=Q.length;Ce<Be;Ce++){const U=ne(Q[Ce],le[Ce],Ae);q(U.x,U.y,A+Se)}for(let Ce=0,Be=X.length;Ce<Be;Ce++){const U=X[Ce];je=ee[Ce];for(let E=0,V=U.length;E<V;E++){const re=ne(U[E],je[E],Ae);F?q(re.x,re.y+O[_-1].y,O[_-1].x+Se):q(re.x,re.y,A+Se)}}}se(),ie();function se(){const ae=u.length/3;if(w){let be=0,Se=ge*be;for(let Ae=0;Ae<me;Ae++){const Ce=Z[Ae];ce(Ce[2]+Se,Ce[1]+Se,Ce[0]+Se)}be=_+D*2,Se=ge*be;for(let Ae=0;Ae<me;Ae++){const Ce=Z[Ae];ce(Ce[0]+Se,Ce[1]+Se,Ce[2]+Se)}}else{for(let be=0;be<me;be++){const Se=Z[be];ce(Se[2],Se[1],Se[0])}for(let be=0;be<me;be++){const Se=Z[be];ce(Se[0]+ge*_,Se[1]+ge*_,Se[2]+ge*_)}}p.addGroup(ae,u.length/3-ae,0)}function ie(){const ae=u.length/3;let be=0;te(Q,be),be+=Q.length;for(let Se=0,Ae=X.length;Se<Ae;Se++){const Ce=X[Se];te(Ce,be),be+=Ce.length}p.addGroup(ae,u.length/3-ae,1)}function te(ae,be){let Se=ae.length;for(;--Se>=0;){const Ae=Se;let Ce=Se-1;Ce<0&&(Ce=ae.length-1);for(let Be=0,U=_+D*2;Be<U;Be++){const E=ge*Be,V=ge*(Be+1),re=be+Ae+E,ue=be+Ce+E,J=be+Ce+V,fe=be+Ae+V;xe(re,ue,J,fe)}}}function q(ae,be,Se){T.push(ae),T.push(be),T.push(Se)}function ce(ae,be,Se){we(ae),we(be),we(Se);const Ae=u.length/3,Ce=k.generateTopUV(p,u,Ae-3,Ae-2,Ae-1);Ee(Ce[0]),Ee(Ce[1]),Ee(Ce[2])}function xe(ae,be,Se,Ae){we(ae),we(be),we(Ae),we(be),we(Se),we(Ae);const Ce=u.length/3,Be=k.generateSideWallUV(p,u,Ce-6,Ce-3,Ce-2,Ce-1);Ee(Be[0]),Ee(Be[1]),Ee(Be[3]),Ee(Be[1]),Ee(Be[2]),Ee(Be[3])}function we(ae){u.push(T[ae*3+0]),u.push(T[ae*3+1]),u.push(T[ae*3+2])}function Ee(ae){g.push(ae.x),g.push(ae.y)}}}copy(s){return super.copy(s),this.parameters=Object.assign({},s.parameters),this}toJSON(){const s=super.toJSON(),d=this.parameters.shapes,p=this.parameters.options;return f(d,p,s)}static fromJSON(s,d){const p=[];for(let g=0,S=s.shapes.length;g<S;g++){const y=d[s.shapes[g]];p.push(y)}const u=s.options.extrudePath;return u!==void 0&&(s.options.extrudePath=new v[u.type]().fromJSON(u)),new l(p,s.options)}}const h={generateTopUV:function(c,s,d,p,u){const g=s[d*3],S=s[d*3+1],y=s[p*3],T=s[p*3+1],x=s[u*3],_=s[u*3+1];return[new n.Vector2(g,S),new n.Vector2(y,T),new n.Vector2(x,_)]},generateSideWallUV:function(c,s,d,p,u,g){const S=s[d*3],y=s[d*3+1],T=s[d*3+2],x=s[p*3],_=s[p*3+1],A=s[p*3+2],w=s[u*3],j=s[u*3+1],R=s[u*3+2],L=s[g*3],D=s[g*3+1],P=s[g*3+2];return Math.abs(y-_)<Math.abs(S-x)?[new n.Vector2(S,1-T),new n.Vector2(x,1-A),new n.Vector2(w,1-R),new n.Vector2(L,1-P)]:[new n.Vector2(y,1-T),new n.Vector2(_,1-A),new n.Vector2(j,1-R),new n.Vector2(D,1-P)]}};function f(c,s,d){if(d.shapes=[],Array.isArray(c))for(let p=0,u=c.length;p<u;p++){const g=c[p];d.shapes.push(g.uuid)}else d.shapes.push(c.uuid);return d.options=Object.assign({},s),s.extrudePath!==void 0&&(d.options.extrudePath=s.extrudePath.toJSON()),d}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../extras/curves/Curves.js":"d3xIh","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../extras/core/Shape.js":"Rgbrn","../extras/ShapeUtils.js":"6HiLE","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],Rgbrn:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Shape",()=>v);var m=e("./Path.js"),M=e("../../math/MathUtils.js");class v extends m.Path{constructor(i){super(i);this.uuid=M.generateUUID(),this.type="Shape",this.holes=[]}getPointsHoles(i){const t=[];for(let r=0,l=this.holes.length;r<l;r++)t[r]=this.holes[r].getPoints(i);return t}extractPoints(i){return{shape:this.getPoints(i),holes:this.getPointsHoles(i)}}copy(i){super.copy(i),this.holes=[];for(let t=0,r=i.holes.length;t<r;t++){const l=i.holes[t];this.holes.push(l.clone())}return this}toJSON(){const i=super.toJSON();i.uuid=this.uuid,i.holes=[];for(let t=0,r=this.holes.length;t<r;t++){const l=this.holes[t];i.holes.push(l.toJSON())}return i}fromJSON(i){super.fromJSON(i),this.uuid=i.uuid,this.holes=[];for(let t=0,r=i.holes.length;t<r;t++){const l=i.holes[t];this.holes.push(new m.Path().fromJSON(l))}return this}}},{"./Path.js":"11ocG","../../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6HiLE":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShapeUtils",()=>M);var m=e("./Earcut.js");class M{static area(t){const r=t.length;let l=0;for(let h=r-1,f=0;f<r;h=f++)l+=t[h].x*t[f].y-t[f].x*t[h].y;return l*.5}static isClockWise(t){return M.area(t)<0}static triangulateShape(t,r){const l=[],h=[],f=[];v(t),n(l,t);let c=t.length;r.forEach(v);for(let d=0;d<r.length;d++)h.push(c),c+=r[d].length,n(l,r[d]);const s=m.Earcut.triangulate(l,h);for(let d=0;d<s.length;d+=3)f.push(s.slice(d,d+3));return f}}function v(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function n(i,t){for(let r=0;r<t.length;r++)i.push(t[r].x),i.push(t[r].y)}},{"./Earcut.js":"6khNK","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6khNK":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Earcut",()=>m);const m={triangulate:function(b,C,I=2){const B=C&&C.length,H=B?C[0]*I:b.length;let X=M(b,0,H,I,!0);const Y=[];if(!X||X.next===X.prev)return Y;let Z,Q,ne,ge,me,_e,le;if(B&&(X=h(b,C,X,I)),b.length>80*I){Z=ne=b[0],Q=ge=b[1];for(let ee=I;ee<H;ee+=I)me=b[ee],_e=b[ee+1],me<Z&&(Z=me),_e<Q&&(Q=_e),me>ne&&(ne=me),_e>ge&&(ge=_e);le=Math.max(ne-Z,ge-Q),le=le!==0?32767/le:0}return n(X,Y,I,Z,Q,le,0),Y}};function M(b,C,I,B,H){let X,Y;if(H===G(b,C,I,B)>0)for(X=C;X<I;X+=B)Y=k(X,b[X],b[X+1],Y);else for(X=I-B;X>=C;X-=B)Y=k(X,b[X],b[X+1],Y);return Y&&_(Y,Y.next)&&(O(Y),Y=Y.next),Y}function v(b,C){if(!b)return b;C||(C=b);let I=b,B;do if(B=!1,!I.steiner&&(_(I,I.next)||x(I.prev,I,I.next)===0)){if(O(I),I=C=I.prev,I===I.next)break;B=!0}else I=I.next;while(B||I!==C);return C}function n(b,C,I,B,H,X,Y){if(!b)return;!Y&&X&&p(b,B,H,X);let Z=b,Q,ne;for(;b.prev!==b.next;){if(Q=b.prev,ne=b.next,X?t(b,B,H,X):i(b)){C.push(Q.i/I|0),C.push(b.i/I|0),C.push(ne.i/I|0),O(b),b=ne.next,Z=ne.next;continue}if(b=ne,b===Z){Y?Y===1?(b=r(v(b),C,I),n(b,C,I,B,H,X,2)):Y===2&&l(b,C,I,B,H,X):n(v(b),C,I,B,H,X,1);break}}}function i(b){const C=b.prev,I=b,B=b.next;if(x(C,I,B)>=0)return!1;const H=C.x,X=I.x,Y=B.x,Z=C.y,Q=I.y,ne=B.y,ge=H<X?H<Y?H:Y:X<Y?X:Y,me=Z<Q?Z<ne?Z:ne:Q<ne?Q:ne,_e=H>X?H>Y?H:Y:X>Y?X:Y,le=Z>Q?Z>ne?Z:ne:Q>ne?Q:ne;let ee=B.next;for(;ee!==C;){if(ee.x>=ge&&ee.x<=_e&&ee.y>=me&&ee.y<=le&&y(H,Z,X,Q,Y,ne,ee.x,ee.y)&&x(ee.prev,ee,ee.next)>=0)return!1;ee=ee.next}return!0}function t(b,C,I,B){const H=b.prev,X=b,Y=b.next;if(x(H,X,Y)>=0)return!1;const Z=H.x,Q=X.x,ne=Y.x,ge=H.y,me=X.y,_e=Y.y,le=Z<Q?Z<ne?Z:ne:Q<ne?Q:ne,ee=ge<me?ge<_e?ge:_e:me<_e?me:_e,je=Z>Q?Z>ne?Z:ne:Q>ne?Q:ne,z=ge>me?ge>_e?ge:_e:me>_e?me:_e,$=g(le,ee,C,I,B),se=g(je,z,C,I,B);let ie=b.prevZ,te=b.nextZ;for(;ie&&ie.z>=$&&te&&te.z<=se;){if(ie.x>=le&&ie.x<=je&&ie.y>=ee&&ie.y<=z&&ie!==H&&ie!==Y&&y(Z,ge,Q,me,ne,_e,ie.x,ie.y)&&x(ie.prev,ie,ie.next)>=0||(ie=ie.prevZ,te.x>=le&&te.x<=je&&te.y>=ee&&te.y<=z&&te!==H&&te!==Y&&y(Z,ge,Q,me,ne,_e,te.x,te.y)&&x(te.prev,te,te.next)>=0))return!1;te=te.nextZ}for(;ie&&ie.z>=$;){if(ie.x>=le&&ie.x<=je&&ie.y>=ee&&ie.y<=z&&ie!==H&&ie!==Y&&y(Z,ge,Q,me,ne,_e,ie.x,ie.y)&&x(ie.prev,ie,ie.next)>=0)return!1;ie=ie.prevZ}for(;te&&te.z<=se;){if(te.x>=le&&te.x<=je&&te.y>=ee&&te.y<=z&&te!==H&&te!==Y&&y(Z,ge,Q,me,ne,_e,te.x,te.y)&&x(te.prev,te,te.next)>=0)return!1;te=te.nextZ}return!0}function r(b,C,I){let B=b;do{const H=B.prev,X=B.next.next;!_(H,X)&&A(H,B,B.next,X)&&L(H,X)&&L(X,H)&&(C.push(H.i/I|0),C.push(B.i/I|0),C.push(X.i/I|0),O(B),O(B.next),B=b=X),B=B.next}while(B!==b);return v(B)}function l(b,C,I,B,H,X){let Y=b;do{let Z=Y.next.next;for(;Z!==Y.prev;){if(Y.i!==Z.i&&T(Y,Z)){let Q=P(Y,Z);Y=v(Y,Y.next),Q=v(Q,Q.next),n(Y,C,I,B,H,X,0),n(Q,C,I,B,H,X,0);return}Z=Z.next}Y=Y.next}while(Y!==b)}function h(b,C,I,B){const H=[];let X,Y,Z,Q,ne;for(X=0,Y=C.length;X<Y;X++)Z=C[X]*B,Q=X<Y-1?C[X+1]*B:b.length,ne=M(b,Z,Q,B,!1),ne===ne.next&&(ne.steiner=!0),H.push(S(ne));for(H.sort(f),X=0;X<H.length;X++)I=c(H[X],I);return I}function f(b,C){return b.x-C.x}function c(b,C){const I=s(b,C);if(!I)return C;const B=P(I,b);return v(B,B.next),v(I,I.next)}function s(b,C){let I=C,B=-1/0,H;const X=b.x,Y=b.y;do{if(Y<=I.y&&Y>=I.next.y&&I.next.y!==I.y){const _e=I.x+(Y-I.y)*(I.next.x-I.x)/(I.next.y-I.y);if(_e<=X&&_e>B&&(B=_e,H=I.x<I.next.x?I:I.next,_e===X))return H}I=I.next}while(I!==C);if(!H)return null;const Z=H,Q=H.x,ne=H.y;let ge=1/0,me;I=H;do X>=I.x&&I.x>=Q&&X!==I.x&&y(Y<ne?X:B,Y,Q,ne,Y<ne?B:X,Y,I.x,I.y)&&(me=Math.abs(Y-I.y)/(X-I.x),L(I,b)&&(me<ge||me===ge&&(I.x>H.x||I.x===H.x&&d(H,I)))&&(H=I,ge=me)),I=I.next;while(I!==Z);return H}function d(b,C){return x(b.prev,b,C.prev)<0&&x(C.next,b,b.next)<0}function p(b,C,I,B){let H=b;do H.z===0&&(H.z=g(H.x,H.y,C,I,B)),H.prevZ=H.prev,H.nextZ=H.next,H=H.next;while(H!==b);H.prevZ.nextZ=null,H.prevZ=null,u(H)}function u(b){let C,I,B,H,X,Y,Z,Q,ne=1;do{for(I=b,b=null,X=null,Y=0;I;){for(Y++,B=I,Z=0,C=0;C<ne&&(Z++,B=B.nextZ,!!B);C++);for(Q=ne;Z>0||Q>0&&B;)Z!==0&&(Q===0||!B||I.z<=B.z)?(H=I,I=I.nextZ,Z--):(H=B,B=B.nextZ,Q--),X?X.nextZ=H:b=H,H.prevZ=X,X=H;I=B}X.nextZ=null,ne*=2}while(Y>1);return b}function g(b,C,I,B,H){return b=(b-I)*H|0,C=(C-B)*H|0,b=(b|b<<8)&16711935,b=(b|b<<4)&252645135,b=(b|b<<2)&858993459,b=(b|b<<1)&1431655765,C=(C|C<<8)&16711935,C=(C|C<<4)&252645135,C=(C|C<<2)&858993459,C=(C|C<<1)&1431655765,b|C<<1}function S(b){let C=b,I=b;do(C.x<I.x||C.x===I.x&&C.y<I.y)&&(I=C),C=C.next;while(C!==b);return I}function y(b,C,I,B,H,X,Y,Z){return(H-Y)*(C-Z)>=(b-Y)*(X-Z)&&(b-Y)*(B-Z)>=(I-Y)*(C-Z)&&(I-Y)*(X-Z)>=(H-Y)*(B-Z)}function T(b,C){return b.next.i!==C.i&&b.prev.i!==C.i&&!R(b,C)&&(L(b,C)&&L(C,b)&&D(b,C)&&(x(b.prev,b,C.prev)||x(b,C.prev,C))||_(b,C)&&x(b.prev,b,b.next)>0&&x(C.prev,C,C.next)>0)}function x(b,C,I){return(C.y-b.y)*(I.x-C.x)-(C.x-b.x)*(I.y-C.y)}function _(b,C){return b.x===C.x&&b.y===C.y}function A(b,C,I,B){const H=j(x(b,C,I)),X=j(x(b,C,B)),Y=j(x(I,B,b)),Z=j(x(I,B,C));return!!(H!==X&&Y!==Z||H===0&&w(b,I,C)||X===0&&w(b,B,C)||Y===0&&w(I,b,B)||Z===0&&w(I,C,B))}function w(b,C,I){return C.x<=Math.max(b.x,I.x)&&C.x>=Math.min(b.x,I.x)&&C.y<=Math.max(b.y,I.y)&&C.y>=Math.min(b.y,I.y)}function j(b){return b>0?1:b<0?-1:0}function R(b,C){let I=b;do{if(I.i!==b.i&&I.next.i!==b.i&&I.i!==C.i&&I.next.i!==C.i&&A(I,I.next,b,C))return!0;I=I.next}while(I!==b);return!1}function L(b,C){return x(b.prev,b,b.next)<0?x(b,C,b.next)>=0&&x(b,b.prev,C)>=0:x(b,C,b.prev)<0||x(b,b.next,C)<0}function D(b,C){let I=b,B=!1;const H=(b.x+C.x)/2,X=(b.y+C.y)/2;do I.y>X!=I.next.y>X&&I.next.y!==I.y&&H<(I.next.x-I.x)*(X-I.y)/(I.next.y-I.y)+I.x&&(B=!B),I=I.next;while(I!==b);return B}function P(b,C){const I=new F(b.i,b.x,b.y),B=new F(C.i,C.x,C.y),H=b.next,X=C.prev;return b.next=C,C.prev=b,I.next=H,H.prev=I,B.next=I,I.prev=B,X.next=B,B.prev=X,B}function k(b,C,I,B){const H=new F(b,C,I);return B?(H.next=B.next,H.prev=B,B.next.prev=H,B.next=H):(H.prev=H,H.next=H),H}function O(b){b.next.prev=b.prev,b.prev.next=b.next,b.prevZ&&(b.prevZ.nextZ=b.nextZ),b.nextZ&&(b.nextZ.prevZ=b.prevZ)}function F(b,C,I){this.i=b,this.x=C,this.y=I,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function G(b,C,I,B){let H=0;for(let X=C,Y=I-B;X<I;X+=B)H+=(b[Y]-b[X])*(b[X+1]+b[Y+1]),Y=X;return H}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6AyMY":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"IcosahedronGeometry",()=>M);var m=e("./PolyhedronGeometry.js");class M extends m.PolyhedronGeometry{constructor(n=1,i=0){const t=(1+Math.sqrt(5))/2,r=[-1,t,0,1,t,0,-1,-t,0,1,-t,0,0,-1,t,0,1,t,0,-1,-t,0,1,-t,t,0,-1,t,0,1,-t,0,-1,-t,0,1],l=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,l,n,i);this.type="IcosahedronGeometry",this.parameters={radius:n,detail:i}}static fromJSON(n){return new M(n.radius,n.detail)}}},{"./PolyhedronGeometry.js":"1WZUt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fckWH:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"OctahedronGeometry",()=>M);var m=e("./PolyhedronGeometry.js");class M extends m.PolyhedronGeometry{constructor(n=1,i=0){const t=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(t,r,n,i);this.type="OctahedronGeometry",this.parameters={radius:n,detail:i}}static fromJSON(n){return new M(n.radius,n.detail)}}},{"./PolyhedronGeometry.js":"1WZUt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1X2GG":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"RingGeometry",()=>i);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector2.js"),n=e("../math/Vector3.js");class i extends m.BufferGeometry{constructor(r=.5,l=1,h=32,f=1,c=0,s=Math.PI*2){super();this.type="RingGeometry",this.parameters={innerRadius:r,outerRadius:l,thetaSegments:h,phiSegments:f,thetaStart:c,thetaLength:s},h=Math.max(3,h),f=Math.max(1,f);const d=[],p=[],u=[],g=[];let S=r;const y=(l-r)/f,T=new n.Vector3,x=new v.Vector2;for(let _=0;_<=f;_++){for(let A=0;A<=h;A++){const w=c+A/h*s;T.x=S*Math.cos(w),T.y=S*Math.sin(w),p.push(T.x,T.y,T.z),u.push(0,0,1),x.x=(T.x/l+1)/2,x.y=(T.y/l+1)/2,g.push(x.x,x.y)}S+=y}for(let _=0;_<f;_++){const A=_*(h+1);for(let w=0;w<h;w++){const j=w+A,R=j,L=j+h+1,D=j+h+2,P=j+1;d.push(R,L,P),d.push(L,D,P)}}this.setIndex(d),this.setAttribute("position",new M.Float32BufferAttribute(p,3)),this.setAttribute("normal",new M.Float32BufferAttribute(u,3)),this.setAttribute("uv",new M.Float32BufferAttribute(g,2))}copy(r){return super.copy(r),this.parameters=Object.assign({},r.parameters),this}static fromJSON(r){return new i(r.innerRadius,r.outerRadius,r.thetaSegments,r.phiSegments,r.thetaStart,r.thetaLength)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],crgJD:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShapeGeometry",()=>t);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../extras/core/Shape.js"),n=e("../extras/ShapeUtils.js"),i=e("../math/Vector2.js");class t extends m.BufferGeometry{constructor(h=new v.Shape([new i.Vector2(0,.5),new i.Vector2(-.5,-.5),new i.Vector2(.5,-.5)]),f=12){super();this.type="ShapeGeometry",this.parameters={shapes:h,curveSegments:f};const c=[],s=[],d=[],p=[];let u=0,g=0;if(Array.isArray(h)===!1)S(h);else for(let y=0;y<h.length;y++)S(h[y]),this.addGroup(u,g,y),u+=g,g=0;this.setIndex(c),this.setAttribute("position",new M.Float32BufferAttribute(s,3)),this.setAttribute("normal",new M.Float32BufferAttribute(d,3)),this.setAttribute("uv",new M.Float32BufferAttribute(p,2));function S(y){const T=s.length/3,x=y.extractPoints(f);let _=x.shape;const A=x.holes;n.ShapeUtils.isClockWise(_)===!1&&(_=_.reverse());for(let j=0,R=A.length;j<R;j++){const L=A[j];n.ShapeUtils.isClockWise(L)===!0&&(A[j]=L.reverse())}const w=n.ShapeUtils.triangulateShape(_,A);for(let j=0,R=A.length;j<R;j++){const L=A[j];_=_.concat(L)}for(let j=0,R=_.length;j<R;j++){const L=_[j];s.push(L.x,L.y,0),d.push(0,0,1),p.push(L.x,L.y)}for(let j=0,R=w.length;j<R;j++){const L=w[j],D=L[0]+T,P=L[1]+T,k=L[2]+T;c.push(D,P,k),g+=3}}}copy(h){return super.copy(h),this.parameters=Object.assign({},h.parameters),this}toJSON(){const h=super.toJSON(),f=this.parameters.shapes;return r(f,h)}static fromJSON(h,f){const c=[];for(let s=0,d=h.shapes.length;s<d;s++){const p=f[h.shapes[s]];c.push(p)}return new t(c,h.curveSegments)}}function r(l,h){if(h.shapes=[],Array.isArray(l))for(let f=0,c=l.length;f<c;f++){const s=l[f];h.shapes.push(s.uuid)}else h.shapes.push(l.uuid);return h}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../extras/core/Shape.js":"Rgbrn","../extras/ShapeUtils.js":"6HiLE","../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1yNk5":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SphereGeometry",()=>n);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js");class n extends m.BufferGeometry{constructor(t=1,r=32,l=16,h=0,f=Math.PI*2,c=0,s=Math.PI){super();this.type="SphereGeometry",this.parameters={radius:t,widthSegments:r,heightSegments:l,phiStart:h,phiLength:f,thetaStart:c,thetaLength:s},r=Math.max(3,Math.floor(r)),l=Math.max(2,Math.floor(l));const d=Math.min(c+s,Math.PI);let p=0;const u=[],g=new v.Vector3,S=new v.Vector3,y=[],T=[],x=[],_=[];for(let A=0;A<=l;A++){const w=[],j=A/l;let R=0;A===0&&c===0?R=.5/r:A===l&&d===Math.PI&&(R=-.5/r);for(let L=0;L<=r;L++){const D=L/r;g.x=-t*Math.cos(h+D*f)*Math.sin(c+j*s),g.y=t*Math.cos(c+j*s),g.z=t*Math.sin(h+D*f)*Math.sin(c+j*s),T.push(g.x,g.y,g.z),S.copy(g).normalize(),x.push(S.x,S.y,S.z),_.push(D+R,1-j),w.push(p++)}u.push(w)}for(let A=0;A<l;A++)for(let w=0;w<r;w++){const j=u[A][w+1],R=u[A][w],L=u[A+1][w],D=u[A+1][w+1];(A!==0||c>0)&&y.push(j,R,D),(A!==l-1||d<Math.PI)&&y.push(R,L,D)}this.setIndex(y),this.setAttribute("position",new M.Float32BufferAttribute(T,3)),this.setAttribute("normal",new M.Float32BufferAttribute(x,3)),this.setAttribute("uv",new M.Float32BufferAttribute(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kIIZS:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"TetrahedronGeometry",()=>M);var m=e("./PolyhedronGeometry.js");class M extends m.PolyhedronGeometry{constructor(n=1,i=0){const t=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],r=[2,1,0,0,3,2,1,3,0,2,3,1];super(t,r,n,i);this.type="TetrahedronGeometry",this.parameters={radius:n,detail:i}}static fromJSON(n){return new M(n.radius,n.detail)}}},{"./PolyhedronGeometry.js":"1WZUt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"36Bnf":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"TorusGeometry",()=>n);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js");class n extends m.BufferGeometry{constructor(t=1,r=.4,l=12,h=48,f=Math.PI*2){super();this.type="TorusGeometry",this.parameters={radius:t,tube:r,radialSegments:l,tubularSegments:h,arc:f},l=Math.floor(l),h=Math.floor(h);const c=[],s=[],d=[],p=[],u=new v.Vector3,g=new v.Vector3,S=new v.Vector3;for(let y=0;y<=l;y++)for(let T=0;T<=h;T++){const x=T/h*f,_=y/l*Math.PI*2;g.x=(t+r*Math.cos(_))*Math.cos(x),g.y=(t+r*Math.cos(_))*Math.sin(x),g.z=r*Math.sin(_),s.push(g.x,g.y,g.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),S.subVectors(g,u).normalize(),d.push(S.x,S.y,S.z),p.push(T/h),p.push(y/l)}for(let y=1;y<=l;y++)for(let T=1;T<=h;T++){const x=(h+1)*y+T-1,_=(h+1)*(y-1)+T-1,A=(h+1)*(y-1)+T,w=(h+1)*y+T;c.push(x,_,w),c.push(_,A,w)}this.setIndex(c),this.setAttribute("position",new M.Float32BufferAttribute(s,3)),this.setAttribute("normal",new M.Float32BufferAttribute(d,3)),this.setAttribute("uv",new M.Float32BufferAttribute(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6S0uq":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"TorusKnotGeometry",()=>n);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js");class n extends m.BufferGeometry{constructor(t=1,r=.4,l=64,h=8,f=2,c=3){super();this.type="TorusKnotGeometry",this.parameters={radius:t,tube:r,tubularSegments:l,radialSegments:h,p:f,q:c},l=Math.floor(l),h=Math.floor(h);const s=[],d=[],p=[],u=[],g=new v.Vector3,S=new v.Vector3,y=new v.Vector3,T=new v.Vector3,x=new v.Vector3,_=new v.Vector3,A=new v.Vector3;for(let j=0;j<=l;++j){const R=j/l*f*Math.PI*2;w(R,f,c,t,y),w(R+.01,f,c,t,T),_.subVectors(T,y),A.addVectors(T,y),x.crossVectors(_,A),A.crossVectors(x,_),x.normalize(),A.normalize();for(let L=0;L<=h;++L){const D=L/h*Math.PI*2,P=-r*Math.cos(D),k=r*Math.sin(D);g.x=y.x+(P*A.x+k*x.x),g.y=y.y+(P*A.y+k*x.y),g.z=y.z+(P*A.z+k*x.z),d.push(g.x,g.y,g.z),S.subVectors(g,y).normalize(),p.push(S.x,S.y,S.z),u.push(j/l),u.push(L/h)}}for(let j=1;j<=l;j++)for(let R=1;R<=h;R++){const L=(h+1)*(j-1)+(R-1),D=(h+1)*j+(R-1),P=(h+1)*j+R,k=(h+1)*(j-1)+R;s.push(L,D,k),s.push(D,P,k)}this.setIndex(s),this.setAttribute("position",new M.Float32BufferAttribute(d,3)),this.setAttribute("normal",new M.Float32BufferAttribute(p,3)),this.setAttribute("uv",new M.Float32BufferAttribute(u,2));function w(j,R,L,D,P){const k=Math.cos(j),O=Math.sin(j),F=L/R*j,G=Math.cos(F);P.x=D*(2+G)*.5*k,P.y=D*(2+G)*O*.5,P.z=D*Math.sin(F)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7wPd4":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"TubeGeometry",()=>t);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../extras/curves/Curves.js"),n=e("../math/Vector2.js"),i=e("../math/Vector3.js");class t extends m.BufferGeometry{constructor(l=new v.QuadraticBezierCurve3(new i.Vector3(-1,-1,0),new i.Vector3(-1,1,0),new i.Vector3(1,1,0)),h=64,f=1,c=8,s=!1){super();this.type="TubeGeometry",this.parameters={path:l,tubularSegments:h,radius:f,radialSegments:c,closed:s};const d=l.computeFrenetFrames(h,s);this.tangents=d.tangents,this.normals=d.normals,this.binormals=d.binormals;const p=new i.Vector3,u=new i.Vector3,g=new n.Vector2;let S=new i.Vector3;const y=[],T=[],x=[],_=[];A(),this.setIndex(_),this.setAttribute("position",new M.Float32BufferAttribute(y,3)),this.setAttribute("normal",new M.Float32BufferAttribute(T,3)),this.setAttribute("uv",new M.Float32BufferAttribute(x,2));function A(){for(let L=0;L<h;L++)w(L);w(s===!1?h:0),R(),j()}function w(L){S=l.getPointAt(L/h,S);const D=d.normals[L],P=d.binormals[L];for(let k=0;k<=c;k++){const O=k/c*Math.PI*2,F=Math.sin(O),G=-Math.cos(O);u.x=G*D.x+F*P.x,u.y=G*D.y+F*P.y,u.z=G*D.z+F*P.z,u.normalize(),T.push(u.x,u.y,u.z),p.x=S.x+f*u.x,p.y=S.y+f*u.y,p.z=S.z+f*u.z,y.push(p.x,p.y,p.z)}}function j(){for(let L=1;L<=h;L++)for(let D=1;D<=c;D++){const P=(c+1)*(L-1)+(D-1),k=(c+1)*L+(D-1),O=(c+1)*L+D,F=(c+1)*(L-1)+D;_.push(P,k,F),_.push(k,O,F)}}function R(){for(let L=0;L<=h;L++)for(let D=0;D<=c;D++)g.x=L/h,g.y=D/c,x.push(g.x,g.y)}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}toJSON(){const l=super.toJSON();return l.path=this.parameters.path.toJSON(),l}static fromJSON(l){return new t(new v[l.path.type]().fromJSON(l.path),l.tubularSegments,l.radius,l.radialSegments,l.closed)}}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../extras/curves/Curves.js":"d3xIh","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2CcFO":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"WireframeGeometry",()=>n);var m=e("../core/BufferGeometry.js"),M=e("../core/BufferAttribute.js"),v=e("../math/Vector3.js");class n extends m.BufferGeometry{constructor(r=null){super();if(this.type="WireframeGeometry",this.parameters={geometry:r},r!==null){const l=[],h=new Set,f=new v.Vector3,c=new v.Vector3;if(r.index!==null){const s=r.attributes.position,d=r.index;let p=r.groups;p.length===0&&(p=[{start:0,count:d.count,materialIndex:0}]);for(let u=0,g=p.length;u<g;++u){const S=p[u],y=S.start,T=S.count;for(let x=y,_=y+T;x<_;x+=3)for(let A=0;A<3;A++){const w=d.getX(x+A),j=d.getX(x+(A+1)%3);f.fromBufferAttribute(s,w),c.fromBufferAttribute(s,j),i(f,c,h)===!0&&(l.push(f.x,f.y,f.z),l.push(c.x,c.y,c.z))}}}else{const s=r.attributes.position;for(let d=0,p=s.count/3;d<p;d++)for(let u=0;u<3;u++){const g=3*d+u,S=3*d+(u+1)%3;f.fromBufferAttribute(s,g),c.fromBufferAttribute(s,S),i(f,c,h)===!0&&(l.push(f.x,f.y,f.z),l.push(c.x,c.y,c.z))}}this.setAttribute("position",new M.Float32BufferAttribute(l,3))}}copy(r){return super.copy(r),this.parameters=Object.assign({},r.parameters),this}}function i(t,r,l){const h=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`,f=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`;return l.has(h)===!0||l.has(f)===!0?!1:(l.add(h),l.add(f),!0)}},{"../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lNrQp:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShadowMaterial",()=>m.ShadowMaterial),a.export(o,"SpriteMaterial",()=>M.SpriteMaterial),a.export(o,"RawShaderMaterial",()=>v.RawShaderMaterial),a.export(o,"ShaderMaterial",()=>n.ShaderMaterial),a.export(o,"PointsMaterial",()=>i.PointsMaterial),a.export(o,"MeshPhysicalMaterial",()=>t.MeshPhysicalMaterial),a.export(o,"MeshStandardMaterial",()=>r.MeshStandardMaterial),a.export(o,"MeshPhongMaterial",()=>l.MeshPhongMaterial),a.export(o,"MeshToonMaterial",()=>h.MeshToonMaterial),a.export(o,"MeshNormalMaterial",()=>f.MeshNormalMaterial),a.export(o,"MeshLambertMaterial",()=>c.MeshLambertMaterial),a.export(o,"MeshDepthMaterial",()=>s.MeshDepthMaterial),a.export(o,"MeshDistanceMaterial",()=>d.MeshDistanceMaterial),a.export(o,"MeshBasicMaterial",()=>p.MeshBasicMaterial),a.export(o,"MeshMatcapMaterial",()=>u.MeshMatcapMaterial),a.export(o,"LineDashedMaterial",()=>g.LineDashedMaterial),a.export(o,"LineBasicMaterial",()=>S.LineBasicMaterial),a.export(o,"Material",()=>y.Material);var m=e("./ShadowMaterial.js"),M=e("./SpriteMaterial.js"),v=e("./RawShaderMaterial.js"),n=e("./ShaderMaterial.js"),i=e("./PointsMaterial.js"),t=e("./MeshPhysicalMaterial.js"),r=e("./MeshStandardMaterial.js"),l=e("./MeshPhongMaterial.js"),h=e("./MeshToonMaterial.js"),f=e("./MeshNormalMaterial.js"),c=e("./MeshLambertMaterial.js"),s=e("./MeshDepthMaterial.js"),d=e("./MeshDistanceMaterial.js"),p=e("./MeshBasicMaterial.js"),u=e("./MeshMatcapMaterial.js"),g=e("./LineDashedMaterial.js"),S=e("./LineBasicMaterial.js"),y=e("./Material.js")},{"./ShadowMaterial.js":"d3GHO","./SpriteMaterial.js":"6O2rf","./RawShaderMaterial.js":"kr9UV","./ShaderMaterial.js":"bnM8h","./PointsMaterial.js":"j3vSF","./MeshPhysicalMaterial.js":"bxbO5","./MeshStandardMaterial.js":"iBWwg","./MeshPhongMaterial.js":"d5kcy","./MeshToonMaterial.js":"e8Lie","./MeshNormalMaterial.js":"elpY6","./MeshLambertMaterial.js":"dqsRE","./MeshDepthMaterial.js":"bfDLn","./MeshDistanceMaterial.js":"8F0sF","./MeshBasicMaterial.js":"gXfgB","./MeshMatcapMaterial.js":"1oBnt","./LineDashedMaterial.js":"38CIL","./LineBasicMaterial.js":"cRUug","./Material.js":"l4ClZ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d3GHO:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShadowMaterial",()=>v);var m=e("./Material.js"),M=e("../math/Color.js");class v extends m.Material{constructor(i){super();this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new M.Color(0),this.transparent=!0,this.fog=!0,this.setValues(i)}copy(i){return super.copy(i),this.color.copy(i.color),this.fog=i.fog,this}}},{"./Material.js":"l4ClZ","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kr9UV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"RawShaderMaterial",()=>M);var m=e("./ShaderMaterial.js");class M extends m.ShaderMaterial{constructor(n){super(n);this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}},{"./ShaderMaterial.js":"bnM8h","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bxbO5:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshPhysicalMaterial",()=>i);var m=e("../math/Vector2.js"),M=e("./MeshStandardMaterial.js"),v=e("../math/Color.js"),n=e("../math/MathUtils.js");class i extends M.MeshStandardMaterial{constructor(r){super();this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new m.Vector2(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return n.clamp(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(l){this.ior=(1+.4*l)/(1-.4*l)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new v.Color(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new v.Color(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new v.Color(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(r)}get anisotropy(){return this._anisotropy}set anisotropy(r){this._anisotropy>0!=r>0&&this.version++,this._anisotropy=r}get clearcoat(){return this._clearcoat}set clearcoat(r){this._clearcoat>0!=r>0&&this.version++,this._clearcoat=r}get iridescence(){return this._iridescence}set iridescence(r){this._iridescence>0!=r>0&&this.version++,this._iridescence=r}get sheen(){return this._sheen}set sheen(r){this._sheen>0!=r>0&&this.version++,this._sheen=r}get transmission(){return this._transmission}set transmission(r){this._transmission>0!=r>0&&this.version++,this._transmission=r}copy(r){return super.copy(r),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=r.anisotropy,this.anisotropyRotation=r.anisotropyRotation,this.anisotropyMap=r.anisotropyMap,this.clearcoat=r.clearcoat,this.clearcoatMap=r.clearcoatMap,this.clearcoatRoughness=r.clearcoatRoughness,this.clearcoatRoughnessMap=r.clearcoatRoughnessMap,this.clearcoatNormalMap=r.clearcoatNormalMap,this.clearcoatNormalScale.copy(r.clearcoatNormalScale),this.ior=r.ior,this.iridescence=r.iridescence,this.iridescenceMap=r.iridescenceMap,this.iridescenceIOR=r.iridescenceIOR,this.iridescenceThicknessRange=[...r.iridescenceThicknessRange],this.iridescenceThicknessMap=r.iridescenceThicknessMap,this.sheen=r.sheen,this.sheenColor.copy(r.sheenColor),this.sheenColorMap=r.sheenColorMap,this.sheenRoughness=r.sheenRoughness,this.sheenRoughnessMap=r.sheenRoughnessMap,this.transmission=r.transmission,this.transmissionMap=r.transmissionMap,this.thickness=r.thickness,this.thicknessMap=r.thicknessMap,this.attenuationDistance=r.attenuationDistance,this.attenuationColor.copy(r.attenuationColor),this.specularIntensity=r.specularIntensity,this.specularIntensityMap=r.specularIntensityMap,this.specularColor.copy(r.specularColor),this.specularColorMap=r.specularColorMap,this}}},{"../math/Vector2.js":"crXpG","./MeshStandardMaterial.js":"iBWwg","../math/Color.js":"gFgcM","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iBWwg:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshStandardMaterial",()=>i);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js"),n=e("../math/Color.js");class i extends M.Material{constructor(r){super();this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new n.Color(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new n.Color(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(r)}copy(r){return super.copy(r),this.defines={STANDARD:""},this.color.copy(r.color),this.roughness=r.roughness,this.metalness=r.metalness,this.map=r.map,this.lightMap=r.lightMap,this.lightMapIntensity=r.lightMapIntensity,this.aoMap=r.aoMap,this.aoMapIntensity=r.aoMapIntensity,this.emissive.copy(r.emissive),this.emissiveMap=r.emissiveMap,this.emissiveIntensity=r.emissiveIntensity,this.bumpMap=r.bumpMap,this.bumpScale=r.bumpScale,this.normalMap=r.normalMap,this.normalMapType=r.normalMapType,this.normalScale.copy(r.normalScale),this.displacementMap=r.displacementMap,this.displacementScale=r.displacementScale,this.displacementBias=r.displacementBias,this.roughnessMap=r.roughnessMap,this.metalnessMap=r.metalnessMap,this.alphaMap=r.alphaMap,this.envMap=r.envMap,this.envMapIntensity=r.envMapIntensity,this.wireframe=r.wireframe,this.wireframeLinewidth=r.wireframeLinewidth,this.wireframeLinecap=r.wireframeLinecap,this.wireframeLinejoin=r.wireframeLinejoin,this.flatShading=r.flatShading,this.fog=r.fog,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],d5kcy:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshPhongMaterial",()=>i);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js"),n=e("../math/Color.js");class i extends M.Material{constructor(r){super();this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new n.Color(16777215),this.specular=new n.Color(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new n.Color(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=m.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(r)}copy(r){return super.copy(r),this.color.copy(r.color),this.specular.copy(r.specular),this.shininess=r.shininess,this.map=r.map,this.lightMap=r.lightMap,this.lightMapIntensity=r.lightMapIntensity,this.aoMap=r.aoMap,this.aoMapIntensity=r.aoMapIntensity,this.emissive.copy(r.emissive),this.emissiveMap=r.emissiveMap,this.emissiveIntensity=r.emissiveIntensity,this.bumpMap=r.bumpMap,this.bumpScale=r.bumpScale,this.normalMap=r.normalMap,this.normalMapType=r.normalMapType,this.normalScale.copy(r.normalScale),this.displacementMap=r.displacementMap,this.displacementScale=r.displacementScale,this.displacementBias=r.displacementBias,this.specularMap=r.specularMap,this.alphaMap=r.alphaMap,this.envMap=r.envMap,this.combine=r.combine,this.reflectivity=r.reflectivity,this.refractionRatio=r.refractionRatio,this.wireframe=r.wireframe,this.wireframeLinewidth=r.wireframeLinewidth,this.wireframeLinecap=r.wireframeLinecap,this.wireframeLinejoin=r.wireframeLinejoin,this.flatShading=r.flatShading,this.fog=r.fog,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e8Lie:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshToonMaterial",()=>i);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js"),n=e("../math/Color.js");class i extends M.Material{constructor(r){super();this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new n.Color(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new n.Color(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(r)}copy(r){return super.copy(r),this.color.copy(r.color),this.map=r.map,this.gradientMap=r.gradientMap,this.lightMap=r.lightMap,this.lightMapIntensity=r.lightMapIntensity,this.aoMap=r.aoMap,this.aoMapIntensity=r.aoMapIntensity,this.emissive.copy(r.emissive),this.emissiveMap=r.emissiveMap,this.emissiveIntensity=r.emissiveIntensity,this.bumpMap=r.bumpMap,this.bumpScale=r.bumpScale,this.normalMap=r.normalMap,this.normalMapType=r.normalMapType,this.normalScale.copy(r.normalScale),this.displacementMap=r.displacementMap,this.displacementScale=r.displacementScale,this.displacementBias=r.displacementBias,this.alphaMap=r.alphaMap,this.wireframe=r.wireframe,this.wireframeLinewidth=r.wireframeLinewidth,this.wireframeLinecap=r.wireframeLinecap,this.wireframeLinejoin=r.wireframeLinejoin,this.fog=r.fog,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],elpY6:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshNormalMaterial",()=>n);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js");class n extends M.Material{constructor(t){super();this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dqsRE:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshLambertMaterial",()=>i);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js"),n=e("../math/Color.js");class i extends M.Material{constructor(r){super();this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new n.Color(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new n.Color(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=m.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(r)}copy(r){return super.copy(r),this.color.copy(r.color),this.map=r.map,this.lightMap=r.lightMap,this.lightMapIntensity=r.lightMapIntensity,this.aoMap=r.aoMap,this.aoMapIntensity=r.aoMapIntensity,this.emissive.copy(r.emissive),this.emissiveMap=r.emissiveMap,this.emissiveIntensity=r.emissiveIntensity,this.bumpMap=r.bumpMap,this.bumpScale=r.bumpScale,this.normalMap=r.normalMap,this.normalMapType=r.normalMapType,this.normalScale.copy(r.normalScale),this.displacementMap=r.displacementMap,this.displacementScale=r.displacementScale,this.displacementBias=r.displacementBias,this.specularMap=r.specularMap,this.alphaMap=r.alphaMap,this.envMap=r.envMap,this.combine=r.combine,this.reflectivity=r.reflectivity,this.refractionRatio=r.refractionRatio,this.wireframe=r.wireframe,this.wireframeLinewidth=r.wireframeLinewidth,this.wireframeLinecap=r.wireframeLinecap,this.wireframeLinejoin=r.wireframeLinejoin,this.flatShading=r.flatShading,this.fog=r.fog,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1oBnt":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MeshMatcapMaterial",()=>i);var m=e("../constants.js"),M=e("./Material.js"),v=e("../math/Vector2.js"),n=e("../math/Color.js");class i extends M.Material{constructor(r){super();this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new n.Color(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=m.TangentSpaceNormalMap,this.normalScale=new v.Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(r)}copy(r){return super.copy(r),this.defines={MATCAP:""},this.color.copy(r.color),this.matcap=r.matcap,this.map=r.map,this.bumpMap=r.bumpMap,this.bumpScale=r.bumpScale,this.normalMap=r.normalMap,this.normalMapType=r.normalMapType,this.normalScale.copy(r.normalScale),this.displacementMap=r.displacementMap,this.displacementScale=r.displacementScale,this.displacementBias=r.displacementBias,this.alphaMap=r.alphaMap,this.flatShading=r.flatShading,this.fog=r.fog,this}}},{"../constants.js":"bqsVL","./Material.js":"l4ClZ","../math/Vector2.js":"crXpG","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"38CIL":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LineDashedMaterial",()=>M);var m=e("./LineBasicMaterial.js");class M extends m.LineBasicMaterial{constructor(n){super();this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(n)}copy(n){return super.copy(n),this.scale=n.scale,this.dashSize=n.dashSize,this.gapSize=n.gapSize,this}}},{"./LineBasicMaterial.js":"cRUug","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],glV4f:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AnimationLoader",()=>n);var m=e("../animation/AnimationClip.js"),M=e("./FileLoader.js"),v=e("./Loader.js");class n extends v.Loader{constructor(t){super(t)}load(t,r,l,h){const f=this,c=new M.FileLoader(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(s){try{r(f.parse(JSON.parse(s)))}catch(d){h?h(d):console.error(d),f.manager.itemError(t)}},l,h)}parse(t){const r=[];for(let l=0;l<t.length;l++){const h=m.AnimationClip.parse(t[l]);r.push(h)}return r}}},{"../animation/AnimationClip.js":"gfGc5","./FileLoader.js":"9KnLd","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gfGc5:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AnimationClip",()=>c);var m=e("./AnimationUtils.js"),M=e("./KeyframeTrack.js"),v=e("./tracks/BooleanKeyframeTrack.js"),n=e("./tracks/ColorKeyframeTrack.js"),i=e("./tracks/NumberKeyframeTrack.js"),t=e("./tracks/QuaternionKeyframeTrack.js"),r=e("./tracks/StringKeyframeTrack.js"),l=e("./tracks/VectorKeyframeTrack.js"),h=e("../math/MathUtils.js"),f=e("../constants.js");class c{constructor(u,g=-1,S,y=f.NormalAnimationBlendMode){this.name=u,this.tracks=S,this.duration=g,this.blendMode=y,this.uuid=h.generateUUID(),this.duration<0&&this.resetDuration()}static parse(u){const g=[],S=u.tracks,y=1/(u.fps||1);for(let x=0,_=S.length;x!==_;++x)g.push(d(S[x]).scale(y));const T=new this(u.name,u.duration,g,u.blendMode);return T.uuid=u.uuid,T}static toJSON(u){const g=[],S=u.tracks,y={name:u.name,duration:u.duration,tracks:g,uuid:u.uuid,blendMode:u.blendMode};for(let T=0,x=S.length;T!==x;++T)g.push(M.KeyframeTrack.toJSON(S[T]));return y}static CreateFromMorphTargetSequence(u,g,S,y){const T=g.length,x=[];for(let _=0;_<T;_++){let A=[],w=[];A.push((_+T-1)%T,_,(_+1)%T),w.push(0,1,0);const j=m.getKeyframeOrder(A);A=m.sortedArray(A,1,j),w=m.sortedArray(w,1,j),!y&&A[0]===0&&(A.push(T),w.push(w[0])),x.push(new i.NumberKeyframeTrack(".morphTargetInfluences["+g[_].name+"]",A,w).scale(1/S))}return new this(u,-1,x)}static findByName(u,g){let S=u;if(!Array.isArray(u)){const y=u;S=y.geometry&&y.geometry.animations||y.animations}for(let y=0;y<S.length;y++)if(S[y].name===g)return S[y];return null}static CreateClipsFromMorphTargetSequences(u,g,S){const y={},T=/^([\w-]*?)([\d]+)$/;for(let _=0,A=u.length;_<A;_++){const w=u[_],j=w.name.match(T);if(j&&j.length>1){const R=j[1];let L=y[R];L||(y[R]=L=[]),L.push(w)}}const x=[];for(const _ in y)x.push(this.CreateFromMorphTargetSequence(_,y[_],g,S));return x}static parseAnimation(u,g){if(!u)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const S=function(R,L,D,P,k){if(D.length!==0){const O=[],F=[];m.flattenJSON(D,O,F,P),O.length!==0&&k.push(new R(L,O,F))}},y=[],T=u.name||"default",x=u.fps||30,_=u.blendMode;let A=u.length||-1;const w=u.hierarchy||[];for(let R=0;R<w.length;R++){const L=w[R].keys;if(!(!L||L.length===0))if(L[0].morphTargets){const D={};let P;for(P=0;P<L.length;P++)if(L[P].morphTargets)for(let k=0;k<L[P].morphTargets.length;k++)D[L[P].morphTargets[k]]=-1;for(const k in D){const O=[],F=[];for(let G=0;G!==L[P].morphTargets.length;++G){const b=L[P];O.push(b.time),F.push(b.morphTarget===k?1:0)}y.push(new i.NumberKeyframeTrack(".morphTargetInfluence["+k+"]",O,F))}A=D.length*x}else{const D=".bones["+g[R].name+"]";S(l.VectorKeyframeTrack,D+".position",L,"pos",y),S(t.QuaternionKeyframeTrack,D+".quaternion",L,"rot",y),S(l.VectorKeyframeTrack,D+".scale",L,"scl",y)}}return y.length===0?null:new this(T,A,y,_)}resetDuration(){const u=this.tracks;let g=0;for(let S=0,y=u.length;S!==y;++S){const T=this.tracks[S];g=Math.max(g,T.times[T.times.length-1])}return this.duration=g,this}trim(){for(let u=0;u<this.tracks.length;u++)this.tracks[u].trim(0,this.duration);return this}validate(){let u=!0;for(let g=0;g<this.tracks.length;g++)u=u&&this.tracks[g].validate();return u}optimize(){for(let u=0;u<this.tracks.length;u++)this.tracks[u].optimize();return this}clone(){const u=[];for(let g=0;g<this.tracks.length;g++)u.push(this.tracks[g].clone());return new this.constructor(this.name,this.duration,u,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function s(p){switch(p.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return i.NumberKeyframeTrack;case"vector":case"vector2":case"vector3":case"vector4":return l.VectorKeyframeTrack;case"color":return n.ColorKeyframeTrack;case"quaternion":return t.QuaternionKeyframeTrack;case"bool":case"boolean":return v.BooleanKeyframeTrack;case"string":return r.StringKeyframeTrack}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+p)}function d(p){if(p.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const u=s(p.type);if(p.times===void 0){const g=[],S=[];m.flattenJSON(p.keys,g,S,"value"),p.times=g,p.values=S}return u.parse!==void 0?u.parse(p):new u(p.name,p.times,p.values,p.interpolation)}},{"./AnimationUtils.js":"lFJRf","./KeyframeTrack.js":"6BDOr","./tracks/BooleanKeyframeTrack.js":"5eXpE","./tracks/ColorKeyframeTrack.js":"3ASO0","./tracks/NumberKeyframeTrack.js":"a6p6H","./tracks/QuaternionKeyframeTrack.js":"1z8JV","./tracks/StringKeyframeTrack.js":"4V00d","./tracks/VectorKeyframeTrack.js":"bzrH8","../math/MathUtils.js":"9o1gq","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lFJRf:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"arraySlice",()=>v),a.export(o,"convertArray",()=>n),a.export(o,"isTypedArray",()=>i),a.export(o,"getKeyframeOrder",()=>t),a.export(o,"sortedArray",()=>r),a.export(o,"flattenJSON",()=>l),a.export(o,"subclip",()=>h),a.export(o,"makeClipAdditive",()=>f),a.export(o,"AnimationUtils",()=>c);var m=e("../math/Quaternion.js"),M=e("../constants.js");function v(s,d,p){return i(s)?new s.constructor(s.subarray(d,p!==void 0?p:s.length)):s.slice(d,p)}function n(s,d,p){return!s||!p&&s.constructor===d?s:typeof d.BYTES_PER_ELEMENT=="number"?new d(s):Array.prototype.slice.call(s)}function i(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function t(s){function d(g,S){return s[g]-s[S]}const p=s.length,u=new Array(p);for(let g=0;g!==p;++g)u[g]=g;return u.sort(d),u}function r(s,d,p){const u=s.length,g=new s.constructor(u);for(let S=0,y=0;y!==u;++S){const T=p[S]*d;for(let x=0;x!==d;++x)g[y++]=s[T+x]}return g}function l(s,d,p,u){let g=1,S=s[0];for(;S!==void 0&&S[u]===void 0;)S=s[g++];if(S===void 0)return;let y=S[u];if(y!==void 0)if(Array.isArray(y))do y=S[u],y!==void 0&&(d.push(S.time),p.push.apply(p,y)),S=s[g++];while(S!==void 0);else if(y.toArray!==void 0)do y=S[u],y!==void 0&&(d.push(S.time),y.toArray(p,p.length)),S=s[g++];while(S!==void 0);else do y=S[u],y!==void 0&&(d.push(S.time),p.push(y)),S=s[g++];while(S!==void 0)}function h(s,d,p,u,g=30){const S=s.clone();S.name=d;const y=[];for(let x=0;x<S.tracks.length;++x){const _=S.tracks[x],A=_.getValueSize(),w=[],j=[];for(let R=0;R<_.times.length;++R){const L=_.times[R]*g;if(!(L<p||L>=u)){w.push(_.times[R]);for(let D=0;D<A;++D)j.push(_.values[R*A+D])}}w.length!==0&&(_.times=n(w,_.times.constructor),_.values=n(j,_.values.constructor),y.push(_))}S.tracks=y;let T=1/0;for(let x=0;x<S.tracks.length;++x)T>S.tracks[x].times[0]&&(T=S.tracks[x].times[0]);for(let x=0;x<S.tracks.length;++x)S.tracks[x].shift(-1*T);return S.resetDuration(),S}function f(s,d=0,p=s,u=30){u<=0&&(u=30);const g=p.tracks.length,S=d/u;for(let y=0;y<g;++y){const T=p.tracks[y],x=T.ValueTypeName;if(x==="bool"||x==="string")continue;const _=s.tracks.find(function(k){return k.name===T.name&&k.ValueTypeName===x});if(_===void 0)continue;let A=0;const w=T.getValueSize();T.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(A=w/3);let j=0;const R=_.getValueSize();_.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(j=R/3);const L=T.times.length-1;let D;if(S<=T.times[0]){const k=A,O=w-A;D=v(T.values,k,O)}else if(S>=T.times[L]){const k=L*w+A,O=k+w-A;D=v(T.values,k,O)}else{const k=T.createInterpolant(),O=A,F=w-A;k.evaluate(S),D=v(k.resultBuffer,O,F)}x==="quaternion"&&new m.Quaternion().fromArray(D).normalize().conjugate().toArray(D);const P=_.times.length;for(let k=0;k<P;++k){const O=k*R+j;if(x==="quaternion")m.Quaternion.multiplyQuaternionsFlat(_.values,O,D,0,_.values,O);else{const F=R-j*2;for(let G=0;G<F;++G)_.values[O+G]-=D[G]}}}return s.blendMode=M.AdditiveAnimationBlendMode,s}const c={arraySlice:v,convertArray:n,isTypedArray:i,getKeyframeOrder:t,sortedArray:r,flattenJSON:l,subclip:h,makeClipAdditive:f}},{"../math/Quaternion.js":"iTBTv","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6BDOr":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"KeyframeTrack",()=>t);var m=e("../constants.js"),M=e("../math/interpolants/CubicInterpolant.js"),v=e("../math/interpolants/LinearInterpolant.js"),n=e("../math/interpolants/DiscreteInterpolant.js"),i=e("./AnimationUtils.js");class t{constructor(l,h,f,c){if(l===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(h===void 0||h.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+l);this.name=l,this.times=i.convertArray(h,this.TimeBufferType),this.values=i.convertArray(f,this.ValueBufferType),this.setInterpolation(c||this.DefaultInterpolation)}static toJSON(l){const h=l.constructor;let f;if(h.toJSON!==this.toJSON)f=h.toJSON(l);else{f={name:l.name,times:i.convertArray(l.times,Array),values:i.convertArray(l.values,Array)};const c=l.getInterpolation();c!==l.DefaultInterpolation&&(f.interpolation=c)}return f.type=l.ValueTypeName,f}InterpolantFactoryMethodDiscrete(l){return new n.DiscreteInterpolant(this.times,this.values,this.getValueSize(),l)}InterpolantFactoryMethodLinear(l){return new v.LinearInterpolant(this.times,this.values,this.getValueSize(),l)}InterpolantFactoryMethodSmooth(l){return new M.CubicInterpolant(this.times,this.values,this.getValueSize(),l)}setInterpolation(l){let h;switch(l){case m.InterpolateDiscrete:h=this.InterpolantFactoryMethodDiscrete;break;case m.InterpolateLinear:h=this.InterpolantFactoryMethodLinear;break;case m.InterpolateSmooth:h=this.InterpolantFactoryMethodSmooth;break}if(h===void 0){const f="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(l!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(f);return console.warn("THREE.KeyframeTrack:",f),this}return this.createInterpolant=h,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return m.InterpolateDiscrete;case this.InterpolantFactoryMethodLinear:return m.InterpolateLinear;case this.InterpolantFactoryMethodSmooth:return m.InterpolateSmooth}}getValueSize(){return this.values.length/this.times.length}shift(l){if(l!==0){const h=this.times;for(let f=0,c=h.length;f!==c;++f)h[f]+=l}return this}scale(l){if(l!==1){const h=this.times;for(let f=0,c=h.length;f!==c;++f)h[f]*=l}return this}trim(l,h){const f=this.times,c=f.length;let s=0,d=c-1;for(;s!==c&&f[s]<l;)++s;for(;d!==-1&&f[d]>h;)--d;if(++d,s!==0||d!==c){s>=d&&(d=Math.max(d,1),s=d-1);const p=this.getValueSize();this.times=i.arraySlice(f,s,d),this.values=i.arraySlice(this.values,s*p,d*p)}return this}validate(){let l=!0;const h=this.getValueSize();h-Math.floor(h)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),l=!1);const f=this.times,c=this.values,s=f.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),l=!1);let d=null;for(let p=0;p!==s;p++){const u=f[p];if(typeof u=="number"&&isNaN(u)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,p,u),l=!1;break}if(d!==null&&d>u){console.error("THREE.KeyframeTrack: Out of order keys.",this,p,u,d),l=!1;break}d=u}if(c!==void 0&&i.isTypedArray(c))for(let p=0,u=c.length;p!==u;++p){const g=c[p];if(isNaN(g)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,p,g),l=!1;break}}return l}optimize(){const l=i.arraySlice(this.times),h=i.arraySlice(this.values),f=this.getValueSize(),c=this.getInterpolation()===m.InterpolateSmooth,s=l.length-1;let d=1;for(let p=1;p<s;++p){let u=!1;const g=l[p],S=l[p+1];if(g!==S&&(p!==1||g!==l[0]))if(c)u=!0;else{const y=p*f,T=y-f,x=y+f;for(let _=0;_!==f;++_){const A=h[y+_];if(A!==h[T+_]||A!==h[x+_]){u=!0;break}}}if(u){if(p!==d){l[d]=l[p];const y=p*f,T=d*f;for(let x=0;x!==f;++x)h[T+x]=h[y+x]}++d}}if(s>0){l[d]=l[s];for(let p=s*f,u=d*f,g=0;g!==f;++g)h[u+g]=h[p+g];++d}return d!==l.length?(this.times=i.arraySlice(l,0,d),this.values=i.arraySlice(h,0,d*f)):(this.times=l,this.values=h),this}clone(){const l=i.arraySlice(this.times,0),h=i.arraySlice(this.values,0),f=this.constructor,c=new f(this.name,l,h);return c.createInterpolant=this.createInterpolant,c}}t.prototype.TimeBufferType=Float32Array,t.prototype.ValueBufferType=Float32Array,t.prototype.DefaultInterpolation=m.InterpolateLinear},{"../constants.js":"bqsVL","../math/interpolants/CubicInterpolant.js":"j4MdW","../math/interpolants/LinearInterpolant.js":"le8UA","../math/interpolants/DiscreteInterpolant.js":"i6w2Q","./AnimationUtils.js":"lFJRf","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j4MdW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubicInterpolant",()=>v);var m=e("../../constants.js"),M=e("../Interpolant.js");class v extends M.Interpolant{constructor(i,t,r,l){super(i,t,r,l);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:m.ZeroCurvatureEnding,endingEnd:m.ZeroCurvatureEnding}}intervalChanged_(i,t,r){const l=this.parameterPositions;let h=i-2,f=i+1,c=l[h],s=l[f];if(c===void 0)switch(this.getSettings_().endingStart){case m.ZeroSlopeEnding:h=i,c=2*t-r;break;case m.WrapAroundEnding:h=l.length-2,c=t+l[h]-l[h+1];break;default:h=i,c=r}if(s===void 0)switch(this.getSettings_().endingEnd){case m.ZeroSlopeEnding:f=i,s=2*r-t;break;case m.WrapAroundEnding:f=1,s=r+l[1]-l[0];break;default:f=i-1,s=t}const d=(r-t)*.5,p=this.valueSize;this._weightPrev=d/(t-c),this._weightNext=d/(s-r),this._offsetPrev=h*p,this._offsetNext=f*p}interpolate_(i,t,r,l){const h=this.resultBuffer,f=this.sampleValues,c=this.valueSize,s=i*c,d=s-c,p=this._offsetPrev,u=this._offsetNext,g=this._weightPrev,S=this._weightNext,y=(r-t)/(l-t),T=y*y,x=T*y,_=-g*x+2*g*T-g*y,A=(1+g)*x+(-1.5-2*g)*T+(-.5+g)*y+1,w=(-1-S)*x+(1.5+S)*T+.5*y,j=S*x-S*T;for(let R=0;R!==c;++R)h[R]=_*f[p+R]+A*f[d+R]+w*f[s+R]+j*f[u+R];return h}}},{"../../constants.js":"bqsVL","../Interpolant.js":"jjk6p","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jjk6p:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Interpolant",()=>m);class m{constructor(v,n,i,t){this.parameterPositions=v,this._cachedIndex=0,this.resultBuffer=t!==void 0?t:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(v){const n=this.parameterPositions;let i=this._cachedIndex,t=n[i],r=n[i-1];e:{t:{let l;r:{s:if(!(v<t)){for(let h=i+2;;){if(t===void 0){if(v<r)break s;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===h)break;if(r=t,t=n[++i],v<t)break t}l=n.length;break r}if(!(v>=r)){const h=n[1];v<h&&(i=2,r=h);for(let f=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===f)break;if(t=r,r=n[--i-1],v>=r)break t}l=i,i=0;break r}break e}for(;i<l;){const h=i+l>>>1;v<n[h]?l=h:i=h+1}if(t=n[i],r=n[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(t===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,t)}return this.interpolate_(i,r,v,t)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(v){const n=this.resultBuffer,i=this.sampleValues,t=this.valueSize,r=v*t;for(let l=0;l!==t;++l)n[l]=i[r+l];return n}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],le8UA:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LinearInterpolant",()=>M);var m=e("../Interpolant.js");class M extends m.Interpolant{constructor(n,i,t,r){super(n,i,t,r)}interpolate_(n,i,t,r){const l=this.resultBuffer,h=this.sampleValues,f=this.valueSize,c=n*f,s=c-f,d=(t-i)/(r-i),p=1-d;for(let u=0;u!==f;++u)l[u]=h[s+u]*p+h[c+u]*d;return l}}},{"../Interpolant.js":"jjk6p","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],i6w2Q:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DiscreteInterpolant",()=>M);var m=e("../Interpolant.js");class M extends m.Interpolant{constructor(n,i,t,r){super(n,i,t,r)}interpolate_(n){return this.copySampleValue_(n-1)}}},{"../Interpolant.js":"jjk6p","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5eXpE":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"BooleanKeyframeTrack",()=>v);var m=e("../../constants.js"),M=e("../KeyframeTrack.js");class v extends M.KeyframeTrack{}v.prototype.ValueTypeName="bool",v.prototype.ValueBufferType=Array,v.prototype.DefaultInterpolation=m.InterpolateDiscrete,v.prototype.InterpolantFactoryMethodLinear=void 0,v.prototype.InterpolantFactoryMethodSmooth=void 0},{"../../constants.js":"bqsVL","../KeyframeTrack.js":"6BDOr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"3ASO0":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ColorKeyframeTrack",()=>M);var m=e("../KeyframeTrack.js");class M extends m.KeyframeTrack{}M.prototype.ValueTypeName="color"},{"../KeyframeTrack.js":"6BDOr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],a6p6H:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"NumberKeyframeTrack",()=>M);var m=e("../KeyframeTrack.js");class M extends m.KeyframeTrack{}M.prototype.ValueTypeName="number"},{"../KeyframeTrack.js":"6BDOr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"1z8JV":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"QuaternionKeyframeTrack",()=>n);var m=e("../../constants.js"),M=e("../KeyframeTrack.js"),v=e("../../math/interpolants/QuaternionLinearInterpolant.js");class n extends M.KeyframeTrack{InterpolantFactoryMethodLinear(t){return new v.QuaternionLinearInterpolant(this.times,this.values,this.getValueSize(),t)}}n.prototype.ValueTypeName="quaternion",n.prototype.DefaultInterpolation=m.InterpolateLinear,n.prototype.InterpolantFactoryMethodSmooth=void 0},{"../../constants.js":"bqsVL","../KeyframeTrack.js":"6BDOr","../../math/interpolants/QuaternionLinearInterpolant.js":"e1PzR","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e1PzR:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"QuaternionLinearInterpolant",()=>v);var m=e("../Interpolant.js"),M=e("../Quaternion.js");class v extends m.Interpolant{constructor(i,t,r,l){super(i,t,r,l)}interpolate_(i,t,r,l){const h=this.resultBuffer,f=this.sampleValues,c=this.valueSize,s=(r-t)/(l-t);let d=i*c;for(let p=d+c;d!==p;d+=4)M.Quaternion.slerpFlat(h,0,f,d-c,f,d,s);return h}}},{"../Interpolant.js":"jjk6p","../Quaternion.js":"iTBTv","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4V00d":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"StringKeyframeTrack",()=>v);var m=e("../../constants.js"),M=e("../KeyframeTrack.js");class v extends M.KeyframeTrack{}v.prototype.ValueTypeName="string",v.prototype.ValueBufferType=Array,v.prototype.DefaultInterpolation=m.InterpolateDiscrete,v.prototype.InterpolantFactoryMethodLinear=void 0,v.prototype.InterpolantFactoryMethodSmooth=void 0},{"../../constants.js":"bqsVL","../KeyframeTrack.js":"6BDOr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bzrH8:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"VectorKeyframeTrack",()=>M);var m=e("../KeyframeTrack.js");class M extends m.KeyframeTrack{}M.prototype.ValueTypeName="vector"},{"../KeyframeTrack.js":"6BDOr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9KnLd":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"FileLoader",()=>i);var m=e("./Cache.js"),M=e("./Loader.js");const v={};class n extends Error{constructor(r,l){super(r);this.response=l}}class i extends M.Loader{constructor(r){super(r)}load(r,l,h,f){r===void 0&&(r=""),this.path!==void 0&&(r=this.path+r),r=this.manager.resolveURL(r);const c=m.Cache.get(r);if(c!==void 0)return this.manager.itemStart(r),setTimeout(()=>{l&&l(c),this.manager.itemEnd(r)},0),c;if(v[r]!==void 0){v[r].push({onLoad:l,onProgress:h,onError:f});return}v[r]=[],v[r].push({onLoad:l,onProgress:h,onError:f});const s=new Request(r,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),d=this.mimeType,p=this.responseType;fetch(s).then(u=>{if(u.status===200||u.status===0){if(u.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream=="undefined"||u.body===void 0||u.body.getReader===void 0)return u;const g=v[r],S=u.body.getReader(),y=u.headers.get("Content-Length")||u.headers.get("X-File-Size"),T=y?parseInt(y):0,x=T!==0;let _=0;const A=new ReadableStream({start(w){j();function j(){S.read().then(({done:R,value:L})=>{if(R)w.close();else{_+=L.byteLength;const D=new ProgressEvent("progress",{lengthComputable:x,loaded:_,total:T});for(let P=0,k=g.length;P<k;P++){const O=g[P];O.onProgress&&O.onProgress(D)}w.enqueue(L),j()}})}}});return new Response(A)}else throw new n(`fetch for "${u.url}" responded with ${u.status}: ${u.statusText}`,u)}).then(u=>{switch(p){case"arraybuffer":return u.arrayBuffer();case"blob":return u.blob();case"document":return u.text().then(g=>new DOMParser().parseFromString(g,d));case"json":return u.json();default:if(d===void 0)return u.text();{const S=/charset="?([^;"\s]*)"?/i.exec(d),y=S&&S[1]?S[1].toLowerCase():void 0,T=new TextDecoder(y);return u.arrayBuffer().then(x=>T.decode(x))}}}).then(u=>{m.Cache.add(r,u);const g=v[r];delete v[r];for(let S=0,y=g.length;S<y;S++){const T=g[S];T.onLoad&&T.onLoad(u)}}).catch(u=>{const g=v[r];if(g===void 0)throw this.manager.itemError(r),u;delete v[r];for(let S=0,y=g.length;S<y;S++){const T=g[S];T.onError&&T.onError(u)}this.manager.itemError(r)}).finally(()=>{this.manager.itemEnd(r)}),this.manager.itemStart(r)}setResponseType(r){return this.responseType=r,this}setMimeType(r){return this.mimeType=r,this}}},{"./Cache.js":"hTZnD","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hTZnD:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Cache",()=>m);const m={enabled:!1,files:{},add:function(M,v){this.enabled!==!1&&(this.files[M]=v)},get:function(M){if(this.enabled!==!1)return this.files[M]},remove:function(M){delete this.files[M]},clear:function(){this.files={}}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],l8uTS:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Loader",()=>M);var m=e("./LoadingManager.js");class M{constructor(n){this.manager=n!==void 0?n:m.DefaultLoadingManager,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(n,i){const t=this;return new Promise(function(r,l){t.load(n,r,i,l)})}parse(){}setCrossOrigin(n){return this.crossOrigin=n,this}setWithCredentials(n){return this.withCredentials=n,this}setPath(n){return this.path=n,this}setResourcePath(n){return this.resourcePath=n,this}setRequestHeader(n){return this.requestHeader=n,this}}M.DEFAULT_MATERIAL_NAME="__DEFAULT"},{"./LoadingManager.js":"boZML","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],boZML:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DefaultLoadingManager",()=>M),a.export(o,"LoadingManager",()=>m);class m{constructor(n,i,t){const r=this;let l=!1,h=0,f=0,c;const s=[];this.onStart=void 0,this.onLoad=n,this.onProgress=i,this.onError=t,this.itemStart=function(d){f++,l===!1&&r.onStart!==void 0&&r.onStart(d,h,f),l=!0},this.itemEnd=function(d){h++,r.onProgress!==void 0&&r.onProgress(d,h,f),h===f&&(l=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,p){return s.push(d,p),this},this.removeHandler=function(d){const p=s.indexOf(d);return p!==-1&&s.splice(p,2),this},this.getHandler=function(d){for(let p=0,u=s.length;p<u;p+=2){const g=s[p],S=s[p+1];if(g.global&&(g.lastIndex=0),g.test(d))return S}return null}}}const M=new m},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],ex9gW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CompressedTextureLoader",()=>i);var m=e("../constants.js"),M=e("./FileLoader.js"),v=e("../textures/CompressedTexture.js"),n=e("./Loader.js");class i extends n.Loader{constructor(r){super(r)}load(r,l,h,f){const c=this,s=[],d=new v.CompressedTexture,p=new M.FileLoader(this.manager);p.setPath(this.path),p.setResponseType("arraybuffer"),p.setRequestHeader(this.requestHeader),p.setWithCredentials(c.withCredentials);let u=0;function g(S){p.load(r[S],function(y){const T=c.parse(y,!0);s[S]={width:T.width,height:T.height,format:T.format,mipmaps:T.mipmaps},u+=1,u===6&&(T.mipmapCount===1&&(d.minFilter=m.LinearFilter),d.image=s,d.format=T.format,d.needsUpdate=!0,l&&l(d))},h,f)}if(Array.isArray(r))for(let S=0,y=r.length;S<y;++S)g(S);else p.load(r,function(S){const y=c.parse(S,!0);if(y.isCubemap){const T=y.mipmaps.length/y.mipmapCount;for(let x=0;x<T;x++){s[x]={mipmaps:[]};for(let _=0;_<y.mipmapCount;_++)s[x].mipmaps.push(y.mipmaps[x*y.mipmapCount+_]),s[x].format=y.format,s[x].width=y.width,s[x].height=y.height}d.image=s}else d.image.width=y.width,d.image.height=y.height,d.mipmaps=y.mipmaps;y.mipmapCount===1&&(d.minFilter=m.LinearFilter),d.format=y.format,d.needsUpdate=!0,l&&l(d)},h,f);return d}}},{"../constants.js":"bqsVL","./FileLoader.js":"9KnLd","../textures/CompressedTexture.js":"1DPW2","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],xlXc4:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CubeTextureLoader",()=>i);var m=e("./ImageLoader.js"),M=e("../textures/CubeTexture.js"),v=e("./Loader.js"),n=e("../constants.js");class i extends v.Loader{constructor(r){super(r)}load(r,l,h,f){const c=new M.CubeTexture;c.colorSpace=n.SRGBColorSpace;const s=new m.ImageLoader(this.manager);s.setCrossOrigin(this.crossOrigin),s.setPath(this.path);let d=0;function p(u){s.load(r[u],function(g){c.images[u]=g,d++,d===6&&(c.needsUpdate=!0,l&&l(c))},void 0,f)}for(let u=0;u<r.length;++u)p(u);return c}}},{"./ImageLoader.js":"12z9k","../textures/CubeTexture.js":"jcedY","./Loader.js":"l8uTS","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"12z9k":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ImageLoader",()=>n);var m=e("./Cache.js"),M=e("./Loader.js"),v=e("../utils.js");class n extends M.Loader{constructor(t){super(t)}load(t,r,l,h){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const f=this,c=m.Cache.get(t);if(c!==void 0)return f.manager.itemStart(t),setTimeout(function(){r&&r(c),f.manager.itemEnd(t)},0),c;const s=(0,v.createElementNS)("img");function d(){u(),m.Cache.add(t,this),r&&r(this),f.manager.itemEnd(t)}function p(g){u(),h&&h(g),f.manager.itemError(t),f.manager.itemEnd(t)}function u(){s.removeEventListener("load",d,!1),s.removeEventListener("error",p,!1)}return s.addEventListener("load",d,!1),s.addEventListener("error",p,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(s.crossOrigin=this.crossOrigin),f.manager.itemStart(t),s.src=t,s}}},{"./Cache.js":"hTZnD","./Loader.js":"l8uTS","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4ip7i":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DataTextureLoader",()=>i);var m=e("../constants.js"),M=e("./FileLoader.js"),v=e("../textures/DataTexture.js"),n=e("./Loader.js");class i extends n.Loader{constructor(r){super(r)}load(r,l,h,f){const c=this,s=new v.DataTexture,d=new M.FileLoader(this.manager);return d.setResponseType("arraybuffer"),d.setRequestHeader(this.requestHeader),d.setPath(this.path),d.setWithCredentials(c.withCredentials),d.load(r,function(p){const u=c.parse(p);!u||(u.image!==void 0?s.image=u.image:u.data!==void 0&&(s.image.width=u.width,s.image.height=u.height,s.image.data=u.data),s.wrapS=u.wrapS!==void 0?u.wrapS:m.ClampToEdgeWrapping,s.wrapT=u.wrapT!==void 0?u.wrapT:m.ClampToEdgeWrapping,s.magFilter=u.magFilter!==void 0?u.magFilter:m.LinearFilter,s.minFilter=u.minFilter!==void 0?u.minFilter:m.LinearFilter,s.anisotropy=u.anisotropy!==void 0?u.anisotropy:1,u.colorSpace!==void 0?s.colorSpace=u.colorSpace:u.encoding!==void 0&&(s.encoding=u.encoding),u.flipY!==void 0&&(s.flipY=u.flipY),u.format!==void 0&&(s.format=u.format),u.type!==void 0&&(s.type=u.type),u.mipmaps!==void 0&&(s.mipmaps=u.mipmaps,s.minFilter=m.LinearMipmapLinearFilter),u.mipmapCount===1&&(s.minFilter=m.LinearFilter),u.generateMipmaps!==void 0&&(s.generateMipmaps=u.generateMipmaps),s.needsUpdate=!0,l&&l(s,u))},h,f),s}}},{"../constants.js":"bqsVL","./FileLoader.js":"9KnLd","../textures/DataTexture.js":"6eyK2","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9WN7O":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"TextureLoader",()=>n);var m=e("./ImageLoader.js"),M=e("../textures/Texture.js"),v=e("./Loader.js");class n extends v.Loader{constructor(t){super(t)}load(t,r,l,h){const f=new M.Texture,c=new m.ImageLoader(this.manager);return c.setCrossOrigin(this.crossOrigin),c.setPath(this.path),c.load(t,function(s){f.image=s,f.needsUpdate=!0,r!==void 0&&r(f)},l,h),f}}},{"./ImageLoader.js":"12z9k","../textures/Texture.js":"2paEl","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9KzHM":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ObjectLoader",()=>me);var m=e("../constants.js"),M=e("../core/InstancedBufferAttribute.js"),v=e("../math/Color.js"),n=e("../core/Object3D.js"),i=e("../objects/Group.js"),t=e("../objects/InstancedMesh.js"),r=e("../objects/Sprite.js"),l=e("../objects/Points.js"),h=e("../objects/Line.js"),f=e("../objects/LineLoop.js"),c=e("../objects/LineSegments.js"),s=e("../objects/LOD.js"),d=e("../objects/Mesh.js"),p=e("../objects/SkinnedMesh.js"),u=e("../objects/Bone.js"),g=e("../objects/Skeleton.js"),S=e("../extras/core/Shape.js"),y=e("../scenes/Fog.js"),T=e("../scenes/FogExp2.js"),x=e("../lights/HemisphereLight.js"),_=e("../lights/SpotLight.js"),A=e("../lights/PointLight.js"),w=e("../lights/DirectionalLight.js"),j=e("../lights/AmbientLight.js"),R=e("../lights/RectAreaLight.js"),L=e("../lights/LightProbe.js"),D=e("../cameras/OrthographicCamera.js"),P=e("../cameras/PerspectiveCamera.js"),k=e("../scenes/Scene.js"),O=e("../textures/CubeTexture.js"),F=e("../textures/Texture.js"),G=e("../textures/Source.js"),b=e("../textures/DataTexture.js"),C=e("./ImageLoader.js"),I=e("./LoadingManager.js"),B=e("../animation/AnimationClip.js"),H=e("./MaterialLoader.js"),X=e("./LoaderUtils.js"),Y=e("./BufferGeometryLoader.js"),Z=e("./Loader.js"),Q=e("./FileLoader.js"),ne=e("../geometries/Geometries.js"),ge=e("../utils.js");class me extends Z.Loader{constructor(z){super(z)}load(z,$,se,ie){const te=this,q=this.path===""?X.LoaderUtils.extractUrlBase(z):this.path;this.resourcePath=this.resourcePath||q;const ce=new Q.FileLoader(this.manager);ce.setPath(this.path),ce.setRequestHeader(this.requestHeader),ce.setWithCredentials(this.withCredentials),ce.load(z,function(xe){let we=null;try{we=JSON.parse(xe)}catch(ae){ie!==void 0&&ie(ae),console.error("THREE:ObjectLoader: Can't parse "+z+".",ae.message);return}const Ee=we.metadata;if(Ee===void 0||Ee.type===void 0||Ee.type.toLowerCase()==="geometry"){ie!==void 0&&ie(new Error("THREE.ObjectLoader: Can't load "+z)),console.error("THREE.ObjectLoader: Can't load "+z);return}te.parse(we,$)},se,ie)}async loadAsync(z,$){const se=this,ie=this.path===""?X.LoaderUtils.extractUrlBase(z):this.path;this.resourcePath=this.resourcePath||ie;const te=new Q.FileLoader(this.manager);te.setPath(this.path),te.setRequestHeader(this.requestHeader),te.setWithCredentials(this.withCredentials);const q=await te.loadAsync(z,$),ce=JSON.parse(q),xe=ce.metadata;if(xe===void 0||xe.type===void 0||xe.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+z);return await se.parseAsync(ce)}parse(z,$){const se=this.parseAnimations(z.animations),ie=this.parseShapes(z.shapes),te=this.parseGeometries(z.geometries,ie),q=this.parseImages(z.images,function(){$!==void 0&&$(we)}),ce=this.parseTextures(z.textures,q),xe=this.parseMaterials(z.materials,ce),we=this.parseObject(z.object,te,xe,ce,se),Ee=this.parseSkeletons(z.skeletons,we);if(this.bindSkeletons(we,Ee),$!==void 0){let ae=!1;for(const be in q)if(q[be].data instanceof HTMLImageElement){ae=!0;break}ae===!1&&$(we)}return we}async parseAsync(z){const $=this.parseAnimations(z.animations),se=this.parseShapes(z.shapes),ie=this.parseGeometries(z.geometries,se),te=await this.parseImagesAsync(z.images),q=this.parseTextures(z.textures,te),ce=this.parseMaterials(z.materials,q),xe=this.parseObject(z.object,ie,ce,q,$),we=this.parseSkeletons(z.skeletons,xe);return this.bindSkeletons(xe,we),xe}parseShapes(z){const $={};if(z!==void 0)for(let se=0,ie=z.length;se<ie;se++){const te=new S.Shape().fromJSON(z[se]);$[te.uuid]=te}return $}parseSkeletons(z,$){const se={},ie={};if($.traverse(function(te){te.isBone&&(ie[te.uuid]=te)}),z!==void 0)for(let te=0,q=z.length;te<q;te++){const ce=new g.Skeleton().fromJSON(z[te],ie);se[ce.uuid]=ce}return se}parseGeometries(z,$){const se={};if(z!==void 0){const ie=new Y.BufferGeometryLoader;for(let te=0,q=z.length;te<q;te++){let ce;const xe=z[te];switch(xe.type){case"BufferGeometry":case"InstancedBufferGeometry":ce=ie.parse(xe);break;default:xe.type in ne?ce=ne[xe.type].fromJSON(xe,$):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${xe.type}"`)}ce.uuid=xe.uuid,xe.name!==void 0&&(ce.name=xe.name),xe.userData!==void 0&&(ce.userData=xe.userData),se[xe.uuid]=ce}}return se}parseMaterials(z,$){const se={},ie={};if(z!==void 0){const te=new H.MaterialLoader;te.setTextures($);for(let q=0,ce=z.length;q<ce;q++){const xe=z[q];se[xe.uuid]===void 0&&(se[xe.uuid]=te.parse(xe)),ie[xe.uuid]=se[xe.uuid]}}return ie}parseAnimations(z){const $={};if(z!==void 0)for(let se=0;se<z.length;se++){const ie=z[se],te=B.AnimationClip.parse(ie);$[te.uuid]=te}return $}parseImages(z,$){const se=this,ie={};let te;function q(xe){return se.manager.itemStart(xe),te.load(xe,function(){se.manager.itemEnd(xe)},void 0,function(){se.manager.itemError(xe),se.manager.itemEnd(xe)})}function ce(xe){if(typeof xe=="string"){const we=xe,Ee=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(we)?we:se.resourcePath+we;return q(Ee)}else return xe.data?{data:(0,ge.getTypedArray)(xe.type,xe.data),width:xe.width,height:xe.height}:null}if(z!==void 0&&z.length>0){const xe=new I.LoadingManager($);te=new C.ImageLoader(xe),te.setCrossOrigin(this.crossOrigin);for(let we=0,Ee=z.length;we<Ee;we++){const ae=z[we],be=ae.url;if(Array.isArray(be)){const Se=[];for(let Ae=0,Ce=be.length;Ae<Ce;Ae++){const Be=be[Ae],U=ce(Be);U!==null&&(U instanceof HTMLImageElement?Se.push(U):Se.push(new b.DataTexture(U.data,U.width,U.height)))}ie[ae.uuid]=new G.Source(Se)}else{const Se=ce(ae.url);ie[ae.uuid]=new G.Source(Se)}}}return ie}async parseImagesAsync(z){const $=this,se={};let ie;async function te(q){if(typeof q=="string"){const ce=q,xe=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(ce)?ce:$.resourcePath+ce;return await ie.loadAsync(xe)}else return q.data?{data:(0,ge.getTypedArray)(q.type,q.data),width:q.width,height:q.height}:null}if(z!==void 0&&z.length>0){ie=new C.ImageLoader(this.manager),ie.setCrossOrigin(this.crossOrigin);for(let q=0,ce=z.length;q<ce;q++){const xe=z[q],we=xe.url;if(Array.isArray(we)){const Ee=[];for(let ae=0,be=we.length;ae<be;ae++){const Se=we[ae],Ae=await te(Se);Ae!==null&&(Ae instanceof HTMLImageElement?Ee.push(Ae):Ee.push(new b.DataTexture(Ae.data,Ae.width,Ae.height)))}se[xe.uuid]=new G.Source(Ee)}else{const Ee=await te(xe.url);se[xe.uuid]=new G.Source(Ee)}}}return se}parseTextures(z,$){function se(te,q){return typeof te=="number"?te:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",te),q[te])}const ie={};if(z!==void 0)for(let te=0,q=z.length;te<q;te++){const ce=z[te];ce.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',ce.uuid),$[ce.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",ce.image);const xe=$[ce.image],we=xe.data;let Ee;Array.isArray(we)?(Ee=new O.CubeTexture,we.length===6&&(Ee.needsUpdate=!0)):(we&&we.data?Ee=new b.DataTexture:Ee=new F.Texture,we&&(Ee.needsUpdate=!0)),Ee.source=xe,Ee.uuid=ce.uuid,ce.name!==void 0&&(Ee.name=ce.name),ce.mapping!==void 0&&(Ee.mapping=se(ce.mapping,_e)),ce.channel!==void 0&&(Ee.channel=ce.channel),ce.offset!==void 0&&Ee.offset.fromArray(ce.offset),ce.repeat!==void 0&&Ee.repeat.fromArray(ce.repeat),ce.center!==void 0&&Ee.center.fromArray(ce.center),ce.rotation!==void 0&&(Ee.rotation=ce.rotation),ce.wrap!==void 0&&(Ee.wrapS=se(ce.wrap[0],le),Ee.wrapT=se(ce.wrap[1],le)),ce.format!==void 0&&(Ee.format=ce.format),ce.internalFormat!==void 0&&(Ee.internalFormat=ce.internalFormat),ce.type!==void 0&&(Ee.type=ce.type),ce.colorSpace!==void 0&&(Ee.colorSpace=ce.colorSpace),ce.encoding!==void 0&&(Ee.encoding=ce.encoding),ce.minFilter!==void 0&&(Ee.minFilter=se(ce.minFilter,ee)),ce.magFilter!==void 0&&(Ee.magFilter=se(ce.magFilter,ee)),ce.anisotropy!==void 0&&(Ee.anisotropy=ce.anisotropy),ce.flipY!==void 0&&(Ee.flipY=ce.flipY),ce.generateMipmaps!==void 0&&(Ee.generateMipmaps=ce.generateMipmaps),ce.premultiplyAlpha!==void 0&&(Ee.premultiplyAlpha=ce.premultiplyAlpha),ce.unpackAlignment!==void 0&&(Ee.unpackAlignment=ce.unpackAlignment),ce.compareFunction!==void 0&&(Ee.compareFunction=ce.compareFunction),ce.userData!==void 0&&(Ee.userData=ce.userData),ie[ce.uuid]=Ee}return ie}parseObject(z,$,se,ie,te){let q;function ce(be){return $[be]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",be),$[be]}function xe(be){if(be!==void 0){if(Array.isArray(be)){const Se=[];for(let Ae=0,Ce=be.length;Ae<Ce;Ae++){const Be=be[Ae];se[Be]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",Be),Se.push(se[Be])}return Se}return se[be]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",be),se[be]}}function we(be){return ie[be]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",be),ie[be]}let Ee,ae;switch(z.type){case"Scene":q=new k.Scene,z.background!==void 0&&(Number.isInteger(z.background)?q.background=new v.Color(z.background):q.background=we(z.background)),z.environment!==void 0&&(q.environment=we(z.environment)),z.fog!==void 0&&(z.fog.type==="Fog"?q.fog=new y.Fog(z.fog.color,z.fog.near,z.fog.far):z.fog.type==="FogExp2"&&(q.fog=new T.FogExp2(z.fog.color,z.fog.density))),z.backgroundBlurriness!==void 0&&(q.backgroundBlurriness=z.backgroundBlurriness),z.backgroundIntensity!==void 0&&(q.backgroundIntensity=z.backgroundIntensity);break;case"PerspectiveCamera":q=new P.PerspectiveCamera(z.fov,z.aspect,z.near,z.far),z.focus!==void 0&&(q.focus=z.focus),z.zoom!==void 0&&(q.zoom=z.zoom),z.filmGauge!==void 0&&(q.filmGauge=z.filmGauge),z.filmOffset!==void 0&&(q.filmOffset=z.filmOffset),z.view!==void 0&&(q.view=Object.assign({},z.view));break;case"OrthographicCamera":q=new D.OrthographicCamera(z.left,z.right,z.top,z.bottom,z.near,z.far),z.zoom!==void 0&&(q.zoom=z.zoom),z.view!==void 0&&(q.view=Object.assign({},z.view));break;case"AmbientLight":q=new j.AmbientLight(z.color,z.intensity);break;case"DirectionalLight":q=new w.DirectionalLight(z.color,z.intensity);break;case"PointLight":q=new A.PointLight(z.color,z.intensity,z.distance,z.decay);break;case"RectAreaLight":q=new R.RectAreaLight(z.color,z.intensity,z.width,z.height);break;case"SpotLight":q=new _.SpotLight(z.color,z.intensity,z.distance,z.angle,z.penumbra,z.decay);break;case"HemisphereLight":q=new x.HemisphereLight(z.color,z.groundColor,z.intensity);break;case"LightProbe":q=new L.LightProbe().fromJSON(z);break;case"SkinnedMesh":Ee=ce(z.geometry),ae=xe(z.material),q=new p.SkinnedMesh(Ee,ae),z.bindMode!==void 0&&(q.bindMode=z.bindMode),z.bindMatrix!==void 0&&q.bindMatrix.fromArray(z.bindMatrix),z.skeleton!==void 0&&(q.skeleton=z.skeleton);break;case"Mesh":Ee=ce(z.geometry),ae=xe(z.material),q=new d.Mesh(Ee,ae);break;case"InstancedMesh":Ee=ce(z.geometry),ae=xe(z.material);const be=z.count,Se=z.instanceMatrix,Ae=z.instanceColor;q=new t.InstancedMesh(Ee,ae,be),q.instanceMatrix=new M.InstancedBufferAttribute(new Float32Array(Se.array),16),Ae!==void 0&&(q.instanceColor=new M.InstancedBufferAttribute(new Float32Array(Ae.array),Ae.itemSize));break;case"LOD":q=new s.LOD;break;case"Line":q=new h.Line(ce(z.geometry),xe(z.material));break;case"LineLoop":q=new f.LineLoop(ce(z.geometry),xe(z.material));break;case"LineSegments":q=new c.LineSegments(ce(z.geometry),xe(z.material));break;case"PointCloud":case"Points":q=new l.Points(ce(z.geometry),xe(z.material));break;case"Sprite":q=new r.Sprite(xe(z.material));break;case"Group":q=new i.Group;break;case"Bone":q=new u.Bone;break;default:q=new n.Object3D}if(q.uuid=z.uuid,z.name!==void 0&&(q.name=z.name),z.matrix!==void 0?(q.matrix.fromArray(z.matrix),z.matrixAutoUpdate!==void 0&&(q.matrixAutoUpdate=z.matrixAutoUpdate),q.matrixAutoUpdate&&q.matrix.decompose(q.position,q.quaternion,q.scale)):(z.position!==void 0&&q.position.fromArray(z.position),z.rotation!==void 0&&q.rotation.fromArray(z.rotation),z.quaternion!==void 0&&q.quaternion.fromArray(z.quaternion),z.scale!==void 0&&q.scale.fromArray(z.scale)),z.up!==void 0&&q.up.fromArray(z.up),z.castShadow!==void 0&&(q.castShadow=z.castShadow),z.receiveShadow!==void 0&&(q.receiveShadow=z.receiveShadow),z.shadow&&(z.shadow.bias!==void 0&&(q.shadow.bias=z.shadow.bias),z.shadow.normalBias!==void 0&&(q.shadow.normalBias=z.shadow.normalBias),z.shadow.radius!==void 0&&(q.shadow.radius=z.shadow.radius),z.shadow.mapSize!==void 0&&q.shadow.mapSize.fromArray(z.shadow.mapSize),z.shadow.camera!==void 0&&(q.shadow.camera=this.parseObject(z.shadow.camera))),z.visible!==void 0&&(q.visible=z.visible),z.frustumCulled!==void 0&&(q.frustumCulled=z.frustumCulled),z.renderOrder!==void 0&&(q.renderOrder=z.renderOrder),z.userData!==void 0&&(q.userData=z.userData),z.layers!==void 0&&(q.layers.mask=z.layers),z.children!==void 0){const be=z.children;for(let Se=0;Se<be.length;Se++)q.add(this.parseObject(be[Se],$,se,ie,te))}if(z.animations!==void 0){const be=z.animations;for(let Se=0;Se<be.length;Se++){const Ae=be[Se];q.animations.push(te[Ae])}}if(z.type==="LOD"){z.autoUpdate!==void 0&&(q.autoUpdate=z.autoUpdate);const be=z.levels;for(let Se=0;Se<be.length;Se++){const Ae=be[Se],Ce=q.getObjectByProperty("uuid",Ae.object);Ce!==void 0&&q.addLevel(Ce,Ae.distance,Ae.hysteresis)}}return q}bindSkeletons(z,$){Object.keys($).length!==0&&z.traverse(function(se){if(se.isSkinnedMesh===!0&&se.skeleton!==void 0){const ie=$[se.skeleton];ie===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",se.skeleton):se.bind(ie,se.bindMatrix)}})}}const _e={UVMapping:m.UVMapping,CubeReflectionMapping:m.CubeReflectionMapping,CubeRefractionMapping:m.CubeRefractionMapping,EquirectangularReflectionMapping:m.EquirectangularReflectionMapping,EquirectangularRefractionMapping:m.EquirectangularRefractionMapping,CubeUVReflectionMapping:m.CubeUVReflectionMapping},le={RepeatWrapping:m.RepeatWrapping,ClampToEdgeWrapping:m.ClampToEdgeWrapping,MirroredRepeatWrapping:m.MirroredRepeatWrapping},ee={NearestFilter:m.NearestFilter,NearestMipmapNearestFilter:m.NearestMipmapNearestFilter,NearestMipmapLinearFilter:m.NearestMipmapLinearFilter,LinearFilter:m.LinearFilter,LinearMipmapNearestFilter:m.LinearMipmapNearestFilter,LinearMipmapLinearFilter:m.LinearMipmapLinearFilter}},{"../constants.js":"bqsVL","../core/InstancedBufferAttribute.js":"cf2Wn","../math/Color.js":"gFgcM","../core/Object3D.js":"ibguD","../objects/Group.js":"c5DBK","../objects/InstancedMesh.js":"fB156","../objects/Sprite.js":"eTjd4","../objects/Points.js":"gR9K2","../objects/Line.js":"li6mQ","../objects/LineLoop.js":"11P2S","../objects/LineSegments.js":"cOWpn","../objects/LOD.js":"bBvxa","../objects/Mesh.js":"d9YFT","../objects/SkinnedMesh.js":"5xf7y","../objects/Bone.js":"ihC8O","../objects/Skeleton.js":"k7L5l","../extras/core/Shape.js":"Rgbrn","../scenes/Fog.js":"lgETf","../scenes/FogExp2.js":"btueC","../lights/HemisphereLight.js":"9KuCh","../lights/SpotLight.js":"9LpqN","../lights/PointLight.js":"lxZ00","../lights/DirectionalLight.js":"aQgd4","../lights/AmbientLight.js":"6NGDW","../lights/RectAreaLight.js":"giWpp","../lights/LightProbe.js":"cwFzz","../cameras/OrthographicCamera.js":"aETgy","../cameras/PerspectiveCamera.js":"bazbq","../scenes/Scene.js":"3Xh8n","../textures/CubeTexture.js":"jcedY","../textures/Texture.js":"2paEl","../textures/Source.js":"1xLMW","../textures/DataTexture.js":"6eyK2","./ImageLoader.js":"12z9k","./LoadingManager.js":"boZML","../animation/AnimationClip.js":"gfGc5","./MaterialLoader.js":"bUSZA","./LoaderUtils.js":"5qKFH","./BufferGeometryLoader.js":"aVfyA","./Loader.js":"l8uTS","./FileLoader.js":"9KnLd","../geometries/Geometries.js":"8bcQC","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9KuCh":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"HemisphereLight",()=>n);var m=e("./Light.js"),M=e("../math/Color.js"),v=e("../core/Object3D.js");class n extends m.Light{constructor(t,r,l){super(t,l);this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(v.Object3D.DEFAULT_UP),this.updateMatrix(),this.groundColor=new M.Color(r)}copy(t,r){return super.copy(t,r),this.groundColor.copy(t.groundColor),this}}},{"./Light.js":"j3zG9","../math/Color.js":"gFgcM","../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],j3zG9:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Light",()=>v);var m=e("../core/Object3D.js"),M=e("../math/Color.js");class v extends m.Object3D{constructor(i,t=1){super();this.isLight=!0,this.type="Light",this.color=new M.Color(i),this.intensity=t}dispose(){}copy(i,t){return super.copy(i,t),this.color.copy(i.color),this.intensity=i.intensity,this}toJSON(i){const t=super.toJSON(i);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}},{"../core/Object3D.js":"ibguD","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9LpqN":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SpotLight",()=>n);var m=e("./Light.js"),M=e("./SpotLightShadow.js"),v=e("../core/Object3D.js");class n extends m.Light{constructor(t,r,l=0,h=Math.PI/3,f=0,c=2){super(t,r);this.isSpotLight=!0,this.type="SpotLight",this.position.copy(v.Object3D.DEFAULT_UP),this.updateMatrix(),this.target=new v.Object3D,this.distance=l,this.angle=h,this.penumbra=f,this.decay=c,this.map=null,this.shadow=new M.SpotLightShadow}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,r){return super.copy(t,r),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}},{"./Light.js":"j3zG9","./SpotLightShadow.js":"9nipl","../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"9nipl":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SpotLightShadow",()=>n);var m=e("./LightShadow.js"),M=e("../math/MathUtils.js"),v=e("../cameras/PerspectiveCamera.js");class n extends m.LightShadow{constructor(){super(new v.PerspectiveCamera(50,1,.5,500));this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const r=this.camera,l=M.RAD2DEG*2*t.angle*this.focus,h=this.mapSize.width/this.mapSize.height,f=t.distance||r.far;(l!==r.fov||h!==r.aspect||f!==r.far)&&(r.fov=l,r.aspect=h,r.far=f,r.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}},{"./LightShadow.js":"8MwGP","../math/MathUtils.js":"9o1gq","../cameras/PerspectiveCamera.js":"bazbq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8MwGP":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LightShadow",()=>h);var m=e("../math/Matrix4.js"),M=e("../math/Vector2.js"),v=e("../math/Vector3.js"),n=e("../math/Vector4.js"),i=e("../math/Frustum.js");const t=new m.Matrix4,r=new v.Vector3,l=new v.Vector3;class h{constructor(c){this.camera=c,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new M.Vector2(512,512),this.map=null,this.mapPass=null,this.matrix=new m.Matrix4,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new i.Frustum,this._frameExtents=new M.Vector2(1,1),this._viewportCount=1,this._viewports=[new n.Vector4(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(c){const s=this.camera,d=this.matrix;r.setFromMatrixPosition(c.matrixWorld),s.position.copy(r),l.setFromMatrixPosition(c.target.matrixWorld),s.lookAt(l),s.updateMatrixWorld(),t.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),this._frustum.setFromProjectionMatrix(t),d.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),d.multiply(t)}getViewport(c){return this._viewports[c]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(c){return this.camera=c.camera.clone(),this.bias=c.bias,this.radius=c.radius,this.mapSize.copy(c.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const c={};return this.bias!==0&&(c.bias=this.bias),this.normalBias!==0&&(c.normalBias=this.normalBias),this.radius!==1&&(c.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(c.mapSize=this.mapSize.toArray()),c.camera=this.camera.toJSON(!1).object,delete c.camera.matrix,c}}},{"../math/Matrix4.js":"64n8p","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../math/Vector4.js":"h0tSe","../math/Frustum.js":"hmBSr","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],lxZ00:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PointLight",()=>v);var m=e("./Light.js"),M=e("./PointLightShadow.js");class v extends m.Light{constructor(i,t,r=0,l=2){super(i,t);this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=l,this.shadow=new M.PointLightShadow}get power(){return this.intensity*4*Math.PI}set power(i){this.intensity=i/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(i,t){return super.copy(i,t),this.distance=i.distance,this.decay=i.decay,this.shadow=i.shadow.clone(),this}}},{"./Light.js":"j3zG9","./PointLightShadow.js":"eBs76","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eBs76:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PointLightShadow",()=>f);var m=e("./LightShadow.js"),M=e("../cameras/PerspectiveCamera.js"),v=e("../math/Matrix4.js"),n=e("../math/Vector2.js"),i=e("../math/Vector3.js"),t=e("../math/Vector4.js");const r=new v.Matrix4,l=new i.Vector3,h=new i.Vector3;class f extends m.LightShadow{constructor(){super(new M.PerspectiveCamera(90,1,.5,500));this.isPointLightShadow=!0,this._frameExtents=new n.Vector2(4,2),this._viewportCount=6,this._viewports=[new t.Vector4(2,1,1,1),new t.Vector4(0,1,1,1),new t.Vector4(3,1,1,1),new t.Vector4(1,1,1,1),new t.Vector4(3,0,1,1),new t.Vector4(1,0,1,1)],this._cubeDirections=[new i.Vector3(1,0,0),new i.Vector3(-1,0,0),new i.Vector3(0,0,1),new i.Vector3(0,0,-1),new i.Vector3(0,1,0),new i.Vector3(0,-1,0)],this._cubeUps=[new i.Vector3(0,1,0),new i.Vector3(0,1,0),new i.Vector3(0,1,0),new i.Vector3(0,1,0),new i.Vector3(0,0,1),new i.Vector3(0,0,-1)]}updateMatrices(s,d=0){const p=this.camera,u=this.matrix,g=s.distance||p.far;g!==p.far&&(p.far=g,p.updateProjectionMatrix()),l.setFromMatrixPosition(s.matrixWorld),p.position.copy(l),h.copy(p.position),h.add(this._cubeDirections[d]),p.up.copy(this._cubeUps[d]),p.lookAt(h),p.updateMatrixWorld(),u.makeTranslation(-l.x,-l.y,-l.z),r.multiplyMatrices(p.projectionMatrix,p.matrixWorldInverse),this._frustum.setFromProjectionMatrix(r)}}},{"./LightShadow.js":"8MwGP","../cameras/PerspectiveCamera.js":"bazbq","../math/Matrix4.js":"64n8p","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../math/Vector4.js":"h0tSe","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aQgd4:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DirectionalLight",()=>n);var m=e("./Light.js"),M=e("./DirectionalLightShadow.js"),v=e("../core/Object3D.js");class n extends m.Light{constructor(t,r){super(t,r);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(v.Object3D.DEFAULT_UP),this.updateMatrix(),this.target=new v.Object3D,this.shadow=new M.DirectionalLightShadow}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}},{"./Light.js":"j3zG9","./DirectionalLightShadow.js":"bjOAH","../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bjOAH:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DirectionalLightShadow",()=>v);var m=e("./LightShadow.js"),M=e("../cameras/OrthographicCamera.js");class v extends m.LightShadow{constructor(){super(new M.OrthographicCamera(-5,5,5,-5,.5,500));this.isDirectionalLightShadow=!0}}},{"./LightShadow.js":"8MwGP","../cameras/OrthographicCamera.js":"aETgy","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6NGDW":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AmbientLight",()=>M);var m=e("./Light.js");class M extends m.Light{constructor(n,i){super(n,i);this.isAmbientLight=!0,this.type="AmbientLight"}}},{"./Light.js":"j3zG9","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],giWpp:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"RectAreaLight",()=>M);var m=e("./Light.js");class M extends m.Light{constructor(n,i,t=10,r=10){super(n,i);this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=t,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(n){this.intensity=n/(this.width*this.height*Math.PI)}copy(n){return super.copy(n),this.width=n.width,this.height=n.height,this}toJSON(n){const i=super.toJSON(n);return i.object.width=this.width,i.object.height=this.height,i}}},{"./Light.js":"j3zG9","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cwFzz:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LightProbe",()=>v);var m=e("../math/SphericalHarmonics3.js"),M=e("./Light.js");class v extends M.Light{constructor(i=new m.SphericalHarmonics3,t=1){super(void 0,t);this.isLightProbe=!0,this.sh=i}copy(i){return super.copy(i),this.sh.copy(i.sh),this}fromJSON(i){return this.intensity=i.intensity,this.sh.fromArray(i.sh),this}toJSON(i){const t=super.toJSON(i);return t.object.sh=this.sh.toArray(),t}}},{"../math/SphericalHarmonics3.js":"kiZTk","./Light.js":"j3zG9","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kiZTk:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SphericalHarmonics3",()=>M);var m=e("./Vector3.js");class M{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let n=0;n<9;n++)this.coefficients.push(new m.Vector3)}set(n){for(let i=0;i<9;i++)this.coefficients[i].copy(n[i]);return this}zero(){for(let n=0;n<9;n++)this.coefficients[n].set(0,0,0);return this}getAt(n,i){const t=n.x,r=n.y,l=n.z,h=this.coefficients;return i.copy(h[0]).multiplyScalar(.282095),i.addScaledVector(h[1],.488603*r),i.addScaledVector(h[2],.488603*l),i.addScaledVector(h[3],.488603*t),i.addScaledVector(h[4],1.092548*(t*r)),i.addScaledVector(h[5],1.092548*(r*l)),i.addScaledVector(h[6],.315392*(3*l*l-1)),i.addScaledVector(h[7],1.092548*(t*l)),i.addScaledVector(h[8],.546274*(t*t-r*r)),i}getIrradianceAt(n,i){const t=n.x,r=n.y,l=n.z,h=this.coefficients;return i.copy(h[0]).multiplyScalar(.886227),i.addScaledVector(h[1],1.023328*r),i.addScaledVector(h[2],1.023328*l),i.addScaledVector(h[3],1.023328*t),i.addScaledVector(h[4],.858086*t*r),i.addScaledVector(h[5],.858086*r*l),i.addScaledVector(h[6],.743125*l*l-.247708),i.addScaledVector(h[7],.858086*t*l),i.addScaledVector(h[8],.429043*(t*t-r*r)),i}add(n){for(let i=0;i<9;i++)this.coefficients[i].add(n.coefficients[i]);return this}addScaledSH(n,i){for(let t=0;t<9;t++)this.coefficients[t].addScaledVector(n.coefficients[t],i);return this}scale(n){for(let i=0;i<9;i++)this.coefficients[i].multiplyScalar(n);return this}lerp(n,i){for(let t=0;t<9;t++)this.coefficients[t].lerp(n.coefficients[t],i);return this}equals(n){for(let i=0;i<9;i++)if(!this.coefficients[i].equals(n.coefficients[i]))return!1;return!0}copy(n){return this.set(n.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(n,i=0){const t=this.coefficients;for(let r=0;r<9;r++)t[r].fromArray(n,i+r*3);return this}toArray(n=[],i=0){const t=this.coefficients;for(let r=0;r<9;r++)t[r].toArray(n,i+r*3);return n}static getBasisAt(n,i){const t=n.x,r=n.y,l=n.z;i[0]=.282095,i[1]=.488603*r,i[2]=.488603*l,i[3]=.488603*t,i[4]=1.092548*t*r,i[5]=1.092548*r*l,i[6]=.315392*(3*l*l-1),i[7]=1.092548*t*l,i[8]=.546274*(t*t-r*r)}}},{"./Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bUSZA:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"MaterialLoader",()=>f);var m=e("../math/Color.js"),M=e("../math/Vector2.js"),v=e("../math/Vector3.js"),n=e("../math/Vector4.js"),i=e("../math/Matrix3.js"),t=e("../math/Matrix4.js"),r=e("./FileLoader.js"),l=e("./Loader.js"),h=e("../materials/Materials.js");class f extends l.Loader{constructor(s){super(s);this.textures={}}load(s,d,p,u){const g=this,S=new r.FileLoader(g.manager);S.setPath(g.path),S.setRequestHeader(g.requestHeader),S.setWithCredentials(g.withCredentials),S.load(s,function(y){try{d(g.parse(JSON.parse(y)))}catch(T){u?u(T):console.error(T),g.manager.itemError(s)}},p,u)}parse(s){const d=this.textures;function p(g){return d[g]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",g),d[g]}const u=f.createMaterialFromType(s.type);if(s.uuid!==void 0&&(u.uuid=s.uuid),s.name!==void 0&&(u.name=s.name),s.color!==void 0&&u.color!==void 0&&u.color.setHex(s.color),s.roughness!==void 0&&(u.roughness=s.roughness),s.metalness!==void 0&&(u.metalness=s.metalness),s.sheen!==void 0&&(u.sheen=s.sheen),s.sheenColor!==void 0&&(u.sheenColor=new m.Color().setHex(s.sheenColor)),s.sheenRoughness!==void 0&&(u.sheenRoughness=s.sheenRoughness),s.emissive!==void 0&&u.emissive!==void 0&&u.emissive.setHex(s.emissive),s.specular!==void 0&&u.specular!==void 0&&u.specular.setHex(s.specular),s.specularIntensity!==void 0&&(u.specularIntensity=s.specularIntensity),s.specularColor!==void 0&&u.specularColor!==void 0&&u.specularColor.setHex(s.specularColor),s.shininess!==void 0&&(u.shininess=s.shininess),s.clearcoat!==void 0&&(u.clearcoat=s.clearcoat),s.clearcoatRoughness!==void 0&&(u.clearcoatRoughness=s.clearcoatRoughness),s.iridescence!==void 0&&(u.iridescence=s.iridescence),s.iridescenceIOR!==void 0&&(u.iridescenceIOR=s.iridescenceIOR),s.iridescenceThicknessRange!==void 0&&(u.iridescenceThicknessRange=s.iridescenceThicknessRange),s.transmission!==void 0&&(u.transmission=s.transmission),s.thickness!==void 0&&(u.thickness=s.thickness),s.attenuationDistance!==void 0&&(u.attenuationDistance=s.attenuationDistance),s.attenuationColor!==void 0&&u.attenuationColor!==void 0&&u.attenuationColor.setHex(s.attenuationColor),s.anisotropy!==void 0&&(u.anisotropy=s.anisotropy),s.anisotropyRotation!==void 0&&(u.anisotropyRotation=s.anisotropyRotation),s.fog!==void 0&&(u.fog=s.fog),s.flatShading!==void 0&&(u.flatShading=s.flatShading),s.blending!==void 0&&(u.blending=s.blending),s.combine!==void 0&&(u.combine=s.combine),s.side!==void 0&&(u.side=s.side),s.shadowSide!==void 0&&(u.shadowSide=s.shadowSide),s.opacity!==void 0&&(u.opacity=s.opacity),s.transparent!==void 0&&(u.transparent=s.transparent),s.alphaTest!==void 0&&(u.alphaTest=s.alphaTest),s.alphaHash!==void 0&&(u.alphaHash=s.alphaHash),s.depthTest!==void 0&&(u.depthTest=s.depthTest),s.depthWrite!==void 0&&(u.depthWrite=s.depthWrite),s.colorWrite!==void 0&&(u.colorWrite=s.colorWrite),s.stencilWrite!==void 0&&(u.stencilWrite=s.stencilWrite),s.stencilWriteMask!==void 0&&(u.stencilWriteMask=s.stencilWriteMask),s.stencilFunc!==void 0&&(u.stencilFunc=s.stencilFunc),s.stencilRef!==void 0&&(u.stencilRef=s.stencilRef),s.stencilFuncMask!==void 0&&(u.stencilFuncMask=s.stencilFuncMask),s.stencilFail!==void 0&&(u.stencilFail=s.stencilFail),s.stencilZFail!==void 0&&(u.stencilZFail=s.stencilZFail),s.stencilZPass!==void 0&&(u.stencilZPass=s.stencilZPass),s.wireframe!==void 0&&(u.wireframe=s.wireframe),s.wireframeLinewidth!==void 0&&(u.wireframeLinewidth=s.wireframeLinewidth),s.wireframeLinecap!==void 0&&(u.wireframeLinecap=s.wireframeLinecap),s.wireframeLinejoin!==void 0&&(u.wireframeLinejoin=s.wireframeLinejoin),s.rotation!==void 0&&(u.rotation=s.rotation),s.linewidth!==1&&(u.linewidth=s.linewidth),s.dashSize!==void 0&&(u.dashSize=s.dashSize),s.gapSize!==void 0&&(u.gapSize=s.gapSize),s.scale!==void 0&&(u.scale=s.scale),s.polygonOffset!==void 0&&(u.polygonOffset=s.polygonOffset),s.polygonOffsetFactor!==void 0&&(u.polygonOffsetFactor=s.polygonOffsetFactor),s.polygonOffsetUnits!==void 0&&(u.polygonOffsetUnits=s.polygonOffsetUnits),s.dithering!==void 0&&(u.dithering=s.dithering),s.alphaToCoverage!==void 0&&(u.alphaToCoverage=s.alphaToCoverage),s.premultipliedAlpha!==void 0&&(u.premultipliedAlpha=s.premultipliedAlpha),s.forceSinglePass!==void 0&&(u.forceSinglePass=s.forceSinglePass),s.visible!==void 0&&(u.visible=s.visible),s.toneMapped!==void 0&&(u.toneMapped=s.toneMapped),s.userData!==void 0&&(u.userData=s.userData),s.vertexColors!==void 0&&(typeof s.vertexColors=="number"?u.vertexColors=s.vertexColors>0:u.vertexColors=s.vertexColors),s.uniforms!==void 0)for(const g in s.uniforms){const S=s.uniforms[g];switch(u.uniforms[g]={},S.type){case"t":u.uniforms[g].value=p(S.value);break;case"c":u.uniforms[g].value=new m.Color().setHex(S.value);break;case"v2":u.uniforms[g].value=new M.Vector2().fromArray(S.value);break;case"v3":u.uniforms[g].value=new v.Vector3().fromArray(S.value);break;case"v4":u.uniforms[g].value=new n.Vector4().fromArray(S.value);break;case"m3":u.uniforms[g].value=new i.Matrix3().fromArray(S.value);break;case"m4":u.uniforms[g].value=new t.Matrix4().fromArray(S.value);break;default:u.uniforms[g].value=S.value}}if(s.defines!==void 0&&(u.defines=s.defines),s.vertexShader!==void 0&&(u.vertexShader=s.vertexShader),s.fragmentShader!==void 0&&(u.fragmentShader=s.fragmentShader),s.glslVersion!==void 0&&(u.glslVersion=s.glslVersion),s.extensions!==void 0)for(const g in s.extensions)u.extensions[g]=s.extensions[g];if(s.lights!==void 0&&(u.lights=s.lights),s.clipping!==void 0&&(u.clipping=s.clipping),s.size!==void 0&&(u.size=s.size),s.sizeAttenuation!==void 0&&(u.sizeAttenuation=s.sizeAttenuation),s.map!==void 0&&(u.map=p(s.map)),s.matcap!==void 0&&(u.matcap=p(s.matcap)),s.alphaMap!==void 0&&(u.alphaMap=p(s.alphaMap)),s.bumpMap!==void 0&&(u.bumpMap=p(s.bumpMap)),s.bumpScale!==void 0&&(u.bumpScale=s.bumpScale),s.normalMap!==void 0&&(u.normalMap=p(s.normalMap)),s.normalMapType!==void 0&&(u.normalMapType=s.normalMapType),s.normalScale!==void 0){let g=s.normalScale;Array.isArray(g)===!1&&(g=[g,g]),u.normalScale=new M.Vector2().fromArray(g)}return s.displacementMap!==void 0&&(u.displacementMap=p(s.displacementMap)),s.displacementScale!==void 0&&(u.displacementScale=s.displacementScale),s.displacementBias!==void 0&&(u.displacementBias=s.displacementBias),s.roughnessMap!==void 0&&(u.roughnessMap=p(s.roughnessMap)),s.metalnessMap!==void 0&&(u.metalnessMap=p(s.metalnessMap)),s.emissiveMap!==void 0&&(u.emissiveMap=p(s.emissiveMap)),s.emissiveIntensity!==void 0&&(u.emissiveIntensity=s.emissiveIntensity),s.specularMap!==void 0&&(u.specularMap=p(s.specularMap)),s.specularIntensityMap!==void 0&&(u.specularIntensityMap=p(s.specularIntensityMap)),s.specularColorMap!==void 0&&(u.specularColorMap=p(s.specularColorMap)),s.envMap!==void 0&&(u.envMap=p(s.envMap)),s.envMapIntensity!==void 0&&(u.envMapIntensity=s.envMapIntensity),s.reflectivity!==void 0&&(u.reflectivity=s.reflectivity),s.refractionRatio!==void 0&&(u.refractionRatio=s.refractionRatio),s.lightMap!==void 0&&(u.lightMap=p(s.lightMap)),s.lightMapIntensity!==void 0&&(u.lightMapIntensity=s.lightMapIntensity),s.aoMap!==void 0&&(u.aoMap=p(s.aoMap)),s.aoMapIntensity!==void 0&&(u.aoMapIntensity=s.aoMapIntensity),s.gradientMap!==void 0&&(u.gradientMap=p(s.gradientMap)),s.clearcoatMap!==void 0&&(u.clearcoatMap=p(s.clearcoatMap)),s.clearcoatRoughnessMap!==void 0&&(u.clearcoatRoughnessMap=p(s.clearcoatRoughnessMap)),s.clearcoatNormalMap!==void 0&&(u.clearcoatNormalMap=p(s.clearcoatNormalMap)),s.clearcoatNormalScale!==void 0&&(u.clearcoatNormalScale=new M.Vector2().fromArray(s.clearcoatNormalScale)),s.iridescenceMap!==void 0&&(u.iridescenceMap=p(s.iridescenceMap)),s.iridescenceThicknessMap!==void 0&&(u.iridescenceThicknessMap=p(s.iridescenceThicknessMap)),s.transmissionMap!==void 0&&(u.transmissionMap=p(s.transmissionMap)),s.thicknessMap!==void 0&&(u.thicknessMap=p(s.thicknessMap)),s.anisotropyMap!==void 0&&(u.anisotropyMap=p(s.anisotropyMap)),s.sheenColorMap!==void 0&&(u.sheenColorMap=p(s.sheenColorMap)),s.sheenRoughnessMap!==void 0&&(u.sheenRoughnessMap=p(s.sheenRoughnessMap)),u}setTextures(s){return this.textures=s,this}static createMaterialFromType(s){const d={ShadowMaterial:h.ShadowMaterial,SpriteMaterial:h.SpriteMaterial,RawShaderMaterial:h.RawShaderMaterial,ShaderMaterial:h.ShaderMaterial,PointsMaterial:h.PointsMaterial,MeshPhysicalMaterial:h.MeshPhysicalMaterial,MeshStandardMaterial:h.MeshStandardMaterial,MeshPhongMaterial:h.MeshPhongMaterial,MeshToonMaterial:h.MeshToonMaterial,MeshNormalMaterial:h.MeshNormalMaterial,MeshLambertMaterial:h.MeshLambertMaterial,MeshDepthMaterial:h.MeshDepthMaterial,MeshDistanceMaterial:h.MeshDistanceMaterial,MeshBasicMaterial:h.MeshBasicMaterial,MeshMatcapMaterial:h.MeshMatcapMaterial,LineDashedMaterial:h.LineDashedMaterial,LineBasicMaterial:h.LineBasicMaterial,Material:h.Material};return new d[s]}}},{"../math/Color.js":"gFgcM","../math/Vector2.js":"crXpG","../math/Vector3.js":"fUbuJ","../math/Vector4.js":"h0tSe","../math/Matrix3.js":"85Mgp","../math/Matrix4.js":"64n8p","./FileLoader.js":"9KnLd","./Loader.js":"l8uTS","../materials/Materials.js":"lNrQp","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5qKFH":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"LoaderUtils",()=>m);class m{static decodeText(v){if(typeof TextDecoder!="undefined")return new TextDecoder().decode(v);let n="";for(let i=0,t=v.length;i<t;i++)n+=String.fromCharCode(v[i]);try{return decodeURIComponent(escape(n))}catch{return n}}static extractUrlBase(v){const n=v.lastIndexOf("/");return n===-1?"./":v.slice(0,n+1)}static resolveURL(v,n){return typeof v!="string"||v===""?"":(/^https?:\/\//i.test(n)&&/^\//.test(v)&&(n=n.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(v)||/^data:.*,.*$/i.test(v)||/^blob:.*$/i.test(v)?v:n+v)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aVfyA:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"BufferGeometryLoader",()=>s);var m=e("../math/Sphere.js"),M=e("../math/Vector3.js"),v=e("../core/BufferAttribute.js"),n=e("../core/BufferGeometry.js"),i=e("./FileLoader.js"),t=e("./Loader.js"),r=e("../core/InstancedBufferGeometry.js"),l=e("../core/InstancedBufferAttribute.js"),h=e("../core/InterleavedBufferAttribute.js"),f=e("../core/InterleavedBuffer.js"),c=e("../utils.js");class s extends t.Loader{constructor(p){super(p)}load(p,u,g,S){const y=this,T=new i.FileLoader(y.manager);T.setPath(y.path),T.setRequestHeader(y.requestHeader),T.setWithCredentials(y.withCredentials),T.load(p,function(x){try{u(y.parse(JSON.parse(x)))}catch(_){S?S(_):console.error(_),y.manager.itemError(p)}},g,S)}parse(p){const u={},g={};function S(L,D){if(u[D]!==void 0)return u[D];const k=L.interleavedBuffers[D],O=y(L,k.buffer),F=(0,c.getTypedArray)(k.type,O),G=new f.InterleavedBuffer(F,k.stride);return G.uuid=k.uuid,u[D]=G,G}function y(L,D){if(g[D]!==void 0)return g[D];const k=L.arrayBuffers[D],O=new Uint32Array(k).buffer;return g[D]=O,O}const T=p.isInstancedBufferGeometry?new r.InstancedBufferGeometry:new n.BufferGeometry,x=p.data.index;if(x!==void 0){const L=(0,c.getTypedArray)(x.type,x.array);T.setIndex(new v.BufferAttribute(L,1))}const _=p.data.attributes;for(const L in _){const D=_[L];let P;if(D.isInterleavedBufferAttribute){const k=S(p.data,D.data);P=new h.InterleavedBufferAttribute(k,D.itemSize,D.offset,D.normalized)}else{const k=(0,c.getTypedArray)(D.type,D.array),O=D.isInstancedBufferAttribute?l.InstancedBufferAttribute:v.BufferAttribute;P=new O(k,D.itemSize,D.normalized)}D.name!==void 0&&(P.name=D.name),D.usage!==void 0&&P.setUsage(D.usage),D.updateRange!==void 0&&(P.updateRange.offset=D.updateRange.offset,P.updateRange.count=D.updateRange.count),T.setAttribute(L,P)}const A=p.data.morphAttributes;if(A)for(const L in A){const D=A[L],P=[];for(let k=0,O=D.length;k<O;k++){const F=D[k];let G;if(F.isInterleavedBufferAttribute){const b=S(p.data,F.data);G=new h.InterleavedBufferAttribute(b,F.itemSize,F.offset,F.normalized)}else{const b=(0,c.getTypedArray)(F.type,F.array);G=new v.BufferAttribute(b,F.itemSize,F.normalized)}F.name!==void 0&&(G.name=F.name),P.push(G)}T.morphAttributes[L]=P}p.data.morphTargetsRelative&&(T.morphTargetsRelative=!0);const j=p.data.groups||p.data.drawcalls||p.data.offsets;if(j!==void 0)for(let L=0,D=j.length;L!==D;++L){const P=j[L];T.addGroup(P.start,P.count,P.materialIndex)}const R=p.data.boundingSphere;if(R!==void 0){const L=new M.Vector3;R.center!==void 0&&L.fromArray(R.center),T.boundingSphere=new m.Sphere(L,R.radius)}return p.name&&(T.name=p.name),p.userData&&(T.userData=p.userData),T}}},{"../math/Sphere.js":"jgQJ1","../math/Vector3.js":"fUbuJ","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","./FileLoader.js":"9KnLd","./Loader.js":"l8uTS","../core/InstancedBufferGeometry.js":"4q67B","../core/InstancedBufferAttribute.js":"cf2Wn","../core/InterleavedBufferAttribute.js":"1TZ2X","../core/InterleavedBuffer.js":"931Vz","../utils.js":"d61Et","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4q67B":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InstancedBufferGeometry",()=>M);var m=e("./BufferGeometry.js");class M extends m.BufferGeometry{constructor(){super();this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(n){return super.copy(n),this.instanceCount=n.instanceCount,this}toJSON(){const n=super.toJSON();return n.instanceCount=this.instanceCount,n.isInstancedBufferGeometry=!0,n}}},{"./BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],eBumg:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ImageBitmapLoader",()=>v);var m=e("./Cache.js"),M=e("./Loader.js");class v extends M.Loader{constructor(i){super(i);this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(i){return this.options=i,this}load(i,t,r,l){i===void 0&&(i=""),this.path!==void 0&&(i=this.path+i),i=this.manager.resolveURL(i);const h=this,f=m.Cache.get(i);if(f!==void 0)return h.manager.itemStart(i),setTimeout(function(){t&&t(f),h.manager.itemEnd(i)},0),f;const c={};c.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",c.headers=this.requestHeader,fetch(i,c).then(function(s){return s.blob()}).then(function(s){return createImageBitmap(s,Object.assign(h.options,{colorSpaceConversion:"none"}))}).then(function(s){m.Cache.add(i,s),t&&t(s),h.manager.itemEnd(i)}).catch(function(s){l&&l(s),h.manager.itemError(i),h.manager.itemEnd(i)}),h.manager.itemStart(i)}}},{"./Cache.js":"hTZnD","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],cuZrC:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AudioLoader",()=>n);var m=e("../audio/AudioContext.js"),M=e("./FileLoader.js"),v=e("./Loader.js");class n extends v.Loader{constructor(t){super(t)}load(t,r,l,h){const f=this,c=new M.FileLoader(this.manager);c.setResponseType("arraybuffer"),c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(d){try{const p=d.slice(0);m.AudioContext.getContext().decodeAudioData(p,function(g){r(g)},s)}catch(p){s(p)}},l,h);function s(d){h?h(d):console.error(d),f.manager.itemError(t)}}}},{"../audio/AudioContext.js":"fhjv7","./FileLoader.js":"9KnLd","./Loader.js":"l8uTS","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fhjv7:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AudioContext",()=>M);let m;class M{static getContext(){return m===void 0&&(m=new(window.AudioContext||window.webkitAudioContext)),m}static setContext(n){m=n}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"2kwbV":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"HemisphereLightProbe",()=>n);var m=e("../math/Color.js"),M=e("../math/Vector3.js"),v=e("./LightProbe.js");class n extends v.LightProbe{constructor(t,r,l=1){super(void 0,l);this.isHemisphereLightProbe=!0;const h=new m.Color().set(t),f=new m.Color().set(r),c=new M.Vector3(h.r,h.g,h.b),s=new M.Vector3(f.r,f.g,f.b),d=Math.sqrt(Math.PI),p=d*Math.sqrt(.75);this.sh.coefficients[0].copy(c).add(s).multiplyScalar(d),this.sh.coefficients[1].copy(c).sub(s).multiplyScalar(p)}}},{"../math/Color.js":"gFgcM","../math/Vector3.js":"fUbuJ","./LightProbe.js":"cwFzz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"8ujvT":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AmbientLightProbe",()=>v);var m=e("../math/Color.js"),M=e("./LightProbe.js");class v extends M.LightProbe{constructor(i,t=1){super(void 0,t);this.isAmbientLightProbe=!0;const r=new m.Color().set(i);this.sh.coefficients[0].set(r.r,r.g,r.b).multiplyScalar(2*Math.sqrt(Math.PI))}}},{"../math/Color.js":"gFgcM","./LightProbe.js":"cwFzz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],XfZRQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"StereoCamera",()=>r);var m=e("../math/Matrix4.js"),M=e("../math/MathUtils.js"),v=e("./PerspectiveCamera.js");const n=new m.Matrix4,i=new m.Matrix4,t=new m.Matrix4;class r{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new v.PerspectiveCamera,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new v.PerspectiveCamera,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(h){const f=this._cache;if(f.focus!==h.focus||f.fov!==h.fov||f.aspect!==h.aspect*this.aspect||f.near!==h.near||f.far!==h.far||f.zoom!==h.zoom||f.eyeSep!==this.eyeSep){f.focus=h.focus,f.fov=h.fov,f.aspect=h.aspect*this.aspect,f.near=h.near,f.far=h.far,f.zoom=h.zoom,f.eyeSep=this.eyeSep,t.copy(h.projectionMatrix);const s=f.eyeSep/2,d=s*f.near/f.focus,p=f.near*Math.tan(M.DEG2RAD*f.fov*.5)/f.zoom;let u,g;i.elements[12]=-s,n.elements[12]=s,u=-p*f.aspect+d,g=p*f.aspect+d,t.elements[0]=2*f.near/(g-u),t.elements[8]=(g+u)/(g-u),this.cameraL.projectionMatrix.copy(t),u=-p*f.aspect-d,g=p*f.aspect-d,t.elements[0]=2*f.near/(g-u),t.elements[8]=(g+u)/(g-u),this.cameraR.projectionMatrix.copy(t)}this.cameraL.matrixWorld.copy(h.matrixWorld).multiply(i),this.cameraR.matrixWorld.copy(h.matrixWorld).multiply(n)}}},{"../math/Matrix4.js":"64n8p","../math/MathUtils.js":"9o1gq","./PerspectiveCamera.js":"bazbq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],f2zzH:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AudioListener",()=>f);var m=e("../math/Vector3.js"),M=e("../math/Quaternion.js"),v=e("../core/Clock.js"),n=e("../core/Object3D.js"),i=e("./AudioContext.js");const t=new m.Vector3,r=new M.Quaternion,l=new m.Vector3,h=new m.Vector3;class f extends n.Object3D{constructor(){super();this.type="AudioListener",this.context=i.AudioContext.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new v.Clock}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(s){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=s,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(s){return this.gain.gain.setTargetAtTime(s,this.context.currentTime,.01),this}updateMatrixWorld(s){super.updateMatrixWorld(s);const d=this.context.listener,p=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(t,r,l),h.set(0,0,-1).applyQuaternion(r),d.positionX){const u=this.context.currentTime+this.timeDelta;d.positionX.linearRampToValueAtTime(t.x,u),d.positionY.linearRampToValueAtTime(t.y,u),d.positionZ.linearRampToValueAtTime(t.z,u),d.forwardX.linearRampToValueAtTime(h.x,u),d.forwardY.linearRampToValueAtTime(h.y,u),d.forwardZ.linearRampToValueAtTime(h.z,u),d.upX.linearRampToValueAtTime(p.x,u),d.upY.linearRampToValueAtTime(p.y,u),d.upZ.linearRampToValueAtTime(p.z,u)}else d.setPosition(t.x,t.y,t.z),d.setOrientation(h.x,h.y,h.z,p.x,p.y,p.z)}}},{"../math/Vector3.js":"fUbuJ","../math/Quaternion.js":"iTBTv","../core/Clock.js":"e6hUj","../core/Object3D.js":"ibguD","./AudioContext.js":"fhjv7","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],e6hUj:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Clock",()=>m);class m{constructor(n=!0){this.autoStart=n,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=M(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let n=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const i=M();n=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=n}return n}}function M(){return(typeof performance=="undefined"?Date:performance).now()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iIm9V:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PositionalAudio",()=>l);var m=e("../math/Vector3.js"),M=e("../math/Quaternion.js"),v=e("./Audio.js");const n=new m.Vector3,i=new M.Quaternion,t=new m.Vector3,r=new m.Vector3;class l extends v.Audio{constructor(f){super(f);this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(f){return this.panner.refDistance=f,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(f){return this.panner.rolloffFactor=f,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(f){return this.panner.distanceModel=f,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(f){return this.panner.maxDistance=f,this}setDirectionalCone(f,c,s){return this.panner.coneInnerAngle=f,this.panner.coneOuterAngle=c,this.panner.coneOuterGain=s,this}updateMatrixWorld(f){if(super.updateMatrixWorld(f),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(n,i,t),r.set(0,0,1).applyQuaternion(i);const c=this.panner;if(c.positionX){const s=this.context.currentTime+this.listener.timeDelta;c.positionX.linearRampToValueAtTime(n.x,s),c.positionY.linearRampToValueAtTime(n.y,s),c.positionZ.linearRampToValueAtTime(n.z,s),c.orientationX.linearRampToValueAtTime(r.x,s),c.orientationY.linearRampToValueAtTime(r.y,s),c.orientationZ.linearRampToValueAtTime(r.z,s)}else c.setPosition(n.x,n.y,n.z),c.setOrientation(r.x,r.y,r.z)}}},{"../math/Vector3.js":"fUbuJ","../math/Quaternion.js":"iTBTv","./Audio.js":"27Sl5","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"27Sl5":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Audio",()=>M);var m=e("../core/Object3D.js");class M extends m.Object3D{constructor(n){super();this.type="Audio",this.listener=n,this.context=n.context,this.gain=this.context.createGain(),this.gain.connect(n.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(n){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=n,this.connect(),this}setMediaElementSource(n){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(n),this.connect(),this}setMediaStreamSource(n){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(n),this.connect(),this}setBuffer(n){return this.buffer=n,this.sourceType="buffer",this.autoplay&&this.play(),this}play(n=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+n;const i=this.context.createBufferSource();return i.buffer=this.buffer,i.loop=this.loop,i.loopStart=this.loopStart,i.loopEnd=this.loopEnd,i.onended=this.onEnded.bind(this),i.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=i,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let n=1,i=this.filters.length;n<i;n++)this.filters[n-1].connect(this.filters[n]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let n=1,i=this.filters.length;n<i;n++)this.filters[n-1].disconnect(this.filters[n]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(n){return n||(n=[]),this._connected===!0?(this.disconnect(),this.filters=n.slice(),this.connect()):this.filters=n.slice(),this}setDetune(n){if(this.detune=n,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(n){return this.setFilters(n?[n]:[])}setPlaybackRate(n){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=n,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(n){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=n,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(n){return this.loopStart=n,this}setLoopEnd(n){return this.loopEnd=n,this}getVolume(){return this.gain.gain.value}setVolume(n){return this.gain.gain.setTargetAtTime(n,this.context.currentTime,.01),this}}},{"../core/Object3D.js":"ibguD","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],hvTZm:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AudioAnalyser",()=>m);class m{constructor(v,n=2048){this.analyser=v.context.createAnalyser(),this.analyser.fftSize=n,this.data=new Uint8Array(this.analyser.frequencyBinCount),v.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let v=0;const n=this.getFrequencyData();for(let i=0;i<n.length;i++)v+=n[i];return v/n.length}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],b2rcU:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PropertyMixer",()=>M);var m=e("../math/Quaternion.js");class M{constructor(n,i,t){this.binding=n,this.valueSize=t;let r,l,h;switch(i){case"quaternion":r=this._slerp,l=this._slerpAdditive,h=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(t*6),this._workIndex=5;break;case"string":case"bool":r=this._select,l=this._select,h=this._setAdditiveIdentityOther,this.buffer=new Array(t*5);break;default:r=this._lerp,l=this._lerpAdditive,h=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(t*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=l,this._setIdentity=h,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(n,i){const t=this.buffer,r=this.valueSize,l=n*r+r;let h=this.cumulativeWeight;if(h===0){for(let f=0;f!==r;++f)t[l+f]=t[f];h=i}else{h+=i;const f=i/h;this._mixBufferRegion(t,l,0,f,r)}this.cumulativeWeight=h}accumulateAdditive(n){const i=this.buffer,t=this.valueSize,r=t*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(i,r,0,n,t),this.cumulativeWeightAdditive+=n}apply(n){const i=this.valueSize,t=this.buffer,r=n*i+i,l=this.cumulativeWeight,h=this.cumulativeWeightAdditive,f=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,l<1){const c=i*this._origIndex;this._mixBufferRegion(t,r,c,1-l,i)}h>0&&this._mixBufferRegionAdditive(t,r,this._addIndex*i,1,i);for(let c=i,s=i+i;c!==s;++c)if(t[c]!==t[c+i]){f.setValue(t,r);break}}saveOriginalState(){const n=this.binding,i=this.buffer,t=this.valueSize,r=t*this._origIndex;n.getValue(i,r);for(let l=t,h=r;l!==h;++l)i[l]=i[r+l%t];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const n=this.valueSize*3;this.binding.setValue(this.buffer,n)}_setAdditiveIdentityNumeric(){const n=this._addIndex*this.valueSize,i=n+this.valueSize;for(let t=n;t<i;t++)this.buffer[t]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const n=this._origIndex*this.valueSize,i=this._addIndex*this.valueSize;for(let t=0;t<this.valueSize;t++)this.buffer[i+t]=this.buffer[n+t]}_select(n,i,t,r,l){if(r>=.5)for(let h=0;h!==l;++h)n[i+h]=n[t+h]}_slerp(n,i,t,r){m.Quaternion.slerpFlat(n,i,n,i,n,t,r)}_slerpAdditive(n,i,t,r,l){const h=this._workIndex*l;m.Quaternion.multiplyQuaternionsFlat(n,h,n,i,n,t),m.Quaternion.slerpFlat(n,i,n,i,n,h,r)}_lerp(n,i,t,r,l){const h=1-r;for(let f=0;f!==l;++f){const c=i+f;n[c]=n[c]*h+n[t+f]*r}}_lerpAdditive(n,i,t,r,l){for(let h=0;h!==l;++h){const f=i+h;n[f]=n[f]+n[t+h]*r}}}},{"../math/Quaternion.js":"iTBTv","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5fWtn":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PropertyBinding",()=>s);const m="\\[\\]\\.:\\/",M=new RegExp("["+m+"]","g"),v="[^"+m+"]",n="[^"+m.replace("\\.","")+"]",i=/((?:WC+[\/:])*)/.source.replace("WC",v),t=/(WCOD+)?/.source.replace("WCOD",n),r=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",v),l=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",v),h=new RegExp("^"+i+t+r+l+"$"),f=["material","materials","bones","map"];class c{constructor(p,u,g){const S=g||s.parseTrackName(u);this._targetGroup=p,this._bindings=p.subscribe_(u,S)}getValue(p,u){this.bind();const g=this._targetGroup.nCachedObjects_,S=this._bindings[g];S!==void 0&&S.getValue(p,u)}setValue(p,u){const g=this._bindings;for(let S=this._targetGroup.nCachedObjects_,y=g.length;S!==y;++S)g[S].setValue(p,u)}bind(){const p=this._bindings;for(let u=this._targetGroup.nCachedObjects_,g=p.length;u!==g;++u)p[u].bind()}unbind(){const p=this._bindings;for(let u=this._targetGroup.nCachedObjects_,g=p.length;u!==g;++u)p[u].unbind()}}class s{constructor(p,u,g){this.path=u,this.parsedPath=g||s.parseTrackName(u),this.node=s.findNode(p,this.parsedPath.nodeName),this.rootNode=p,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(p,u,g){return p&&p.isAnimationObjectGroup?new s.Composite(p,u,g):new s(p,u,g)}static sanitizeNodeName(p){return p.replace(/\s/g,"_").replace(M,"")}static parseTrackName(p){const u=h.exec(p);if(u===null)throw new Error("PropertyBinding: Cannot parse trackName: "+p);const g={nodeName:u[2],objectName:u[3],objectIndex:u[4],propertyName:u[5],propertyIndex:u[6]},S=g.nodeName&&g.nodeName.lastIndexOf(".");if(S!==void 0&&S!==-1){const y=g.nodeName.substring(S+1);f.indexOf(y)!==-1&&(g.nodeName=g.nodeName.substring(0,S),g.objectName=y)}if(g.propertyName===null||g.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+p);return g}static findNode(p,u){if(u===void 0||u===""||u==="."||u===-1||u===p.name||u===p.uuid)return p;if(p.skeleton){const g=p.skeleton.getBoneByName(u);if(g!==void 0)return g}if(p.children){const g=function(y){for(let T=0;T<y.length;T++){const x=y[T];if(x.name===u||x.uuid===u)return x;const _=g(x.children);if(_)return _}return null},S=g(p.children);if(S)return S}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(p,u){p[u]=this.targetObject[this.propertyName]}_getValue_array(p,u){const g=this.resolvedProperty;for(let S=0,y=g.length;S!==y;++S)p[u++]=g[S]}_getValue_arrayElement(p,u){p[u]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(p,u){this.resolvedProperty.toArray(p,u)}_setValue_direct(p,u){this.targetObject[this.propertyName]=p[u]}_setValue_direct_setNeedsUpdate(p,u){this.targetObject[this.propertyName]=p[u],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(p,u){this.targetObject[this.propertyName]=p[u],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(p,u){const g=this.resolvedProperty;for(let S=0,y=g.length;S!==y;++S)g[S]=p[u++]}_setValue_array_setNeedsUpdate(p,u){const g=this.resolvedProperty;for(let S=0,y=g.length;S!==y;++S)g[S]=p[u++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(p,u){const g=this.resolvedProperty;for(let S=0,y=g.length;S!==y;++S)g[S]=p[u++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(p,u){this.resolvedProperty[this.propertyIndex]=p[u]}_setValue_arrayElement_setNeedsUpdate(p,u){this.resolvedProperty[this.propertyIndex]=p[u],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(p,u){this.resolvedProperty[this.propertyIndex]=p[u],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(p,u){this.resolvedProperty.fromArray(p,u)}_setValue_fromArray_setNeedsUpdate(p,u){this.resolvedProperty.fromArray(p,u),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(p,u){this.resolvedProperty.fromArray(p,u),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(p,u){this.bind(),this.getValue(p,u)}_setValue_unbound(p,u){this.bind(),this.setValue(p,u)}bind(){let p=this.node;const u=this.parsedPath,g=u.objectName,S=u.propertyName;let y=u.propertyIndex;if(p||(p=s.findNode(this.rootNode,u.nodeName),this.node=p),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!p){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(g){let A=u.objectIndex;switch(g){case"materials":if(!p.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!p.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}p=p.material.materials;break;case"bones":if(!p.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}p=p.skeleton.bones;for(let w=0;w<p.length;w++)if(p[w].name===A){A=w;break}break;case"map":if("map"in p){p=p.map;break}if(!p.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!p.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}p=p.material.map;break;default:if(p[g]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}p=p[g]}if(A!==void 0){if(p[A]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,p);return}p=p[A]}}const T=p[S];if(T===void 0){const A=u.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+A+"."+S+" but it wasn't found.",p);return}let x=this.Versioning.None;this.targetObject=p,p.needsUpdate!==void 0?x=this.Versioning.NeedsUpdate:p.matrixWorldNeedsUpdate!==void 0&&(x=this.Versioning.MatrixWorldNeedsUpdate);let _=this.BindingType.Direct;if(y!==void 0){if(S==="morphTargetInfluences"){if(!p.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!p.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}p.morphTargetDictionary[y]!==void 0&&(y=p.morphTargetDictionary[y])}_=this.BindingType.ArrayElement,this.resolvedProperty=T,this.propertyIndex=y}else T.fromArray!==void 0&&T.toArray!==void 0?(_=this.BindingType.HasFromToArray,this.resolvedProperty=T):Array.isArray(T)?(_=this.BindingType.EntireArray,this.resolvedProperty=T):this.propertyName=S;this.getValue=this.GetterByBindingType[_],this.setValue=this.SetterByBindingTypeAndVersioning[_][x]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}s.Composite=c,s.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},s.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},s.prototype.GetterByBindingType=[s.prototype._getValue_direct,s.prototype._getValue_array,s.prototype._getValue_arrayElement,s.prototype._getValue_toArray],s.prototype.SetterByBindingTypeAndVersioning=[[s.prototype._setValue_direct,s.prototype._setValue_direct_setNeedsUpdate,s.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[s.prototype._setValue_array,s.prototype._setValue_array_setNeedsUpdate,s.prototype._setValue_array_setMatrixWorldNeedsUpdate],[s.prototype._setValue_arrayElement,s.prototype._setValue_arrayElement_setNeedsUpdate,s.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[s.prototype._setValue_fromArray,s.prototype._setValue_fromArray_setNeedsUpdate,s.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]]},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7A7q1":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AnimationObjectGroup",()=>v);var m=e("./PropertyBinding.js"),M=e("../math/MathUtils.js");class v{constructor(){this.isAnimationObjectGroup=!0,this.uuid=M.generateUUID(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const i={};this._indicesByUUID=i;for(let r=0,l=arguments.length;r!==l;++r)i[arguments[r].uuid]=r;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const i=this._objects,t=this._indicesByUUID,r=this._paths,l=this._parsedPaths,h=this._bindings,f=h.length;let c,s=i.length,d=this.nCachedObjects_;for(let p=0,u=arguments.length;p!==u;++p){const g=arguments[p],S=g.uuid;let y=t[S];if(y===void 0){y=s++,t[S]=y,i.push(g);for(let T=0,x=f;T!==x;++T)h[T].push(new m.PropertyBinding(g,r[T],l[T]))}else if(y<d){c=i[y];const T=--d,x=i[T];t[x.uuid]=y,i[y]=x,t[S]=T,i[T]=g;for(let _=0,A=f;_!==A;++_){const w=h[_],j=w[T];let R=w[y];w[y]=j,R===void 0&&(R=new m.PropertyBinding(g,r[_],l[_])),w[T]=R}}else i[y]!==c&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=d}remove(){const i=this._objects,t=this._indicesByUUID,r=this._bindings,l=r.length;let h=this.nCachedObjects_;for(let f=0,c=arguments.length;f!==c;++f){const s=arguments[f],d=s.uuid,p=t[d];if(p!==void 0&&p>=h){const u=h++,g=i[u];t[g.uuid]=p,i[p]=g,t[d]=u,i[u]=s;for(let S=0,y=l;S!==y;++S){const T=r[S],x=T[u],_=T[p];T[p]=x,T[u]=_}}}this.nCachedObjects_=h}uncache(){const i=this._objects,t=this._indicesByUUID,r=this._bindings,l=r.length;let h=this.nCachedObjects_,f=i.length;for(let c=0,s=arguments.length;c!==s;++c){const d=arguments[c],p=d.uuid,u=t[p];if(u!==void 0)if(delete t[p],u<h){const g=--h,S=i[g],y=--f,T=i[y];t[S.uuid]=u,i[u]=S,t[T.uuid]=g,i[g]=T,i.pop();for(let x=0,_=l;x!==_;++x){const A=r[x],w=A[g],j=A[y];A[u]=w,A[g]=j,A.pop()}}else{const g=--f,S=i[g];g>0&&(t[S.uuid]=u),i[u]=S,i.pop();for(let y=0,T=l;y!==T;++y){const x=r[y];x[u]=x[g],x.pop()}}}this.nCachedObjects_=h}subscribe_(i,t){const r=this._bindingsIndicesByPath;let l=r[i];const h=this._bindings;if(l!==void 0)return h[l];const f=this._paths,c=this._parsedPaths,s=this._objects,d=s.length,p=this.nCachedObjects_,u=new Array(d);l=h.length,r[i]=l,f.push(i),c.push(t),h.push(u);for(let g=p,S=s.length;g!==S;++g){const y=s[g];u[g]=new m.PropertyBinding(y,i,t)}return u}unsubscribe_(i){const t=this._bindingsIndicesByPath,r=t[i];if(r!==void 0){const l=this._paths,h=this._parsedPaths,f=this._bindings,c=f.length-1,s=f[c],d=i[c];t[d]=r,f[r]=s,f.pop(),h[r]=h[c],h.pop(),l[r]=l[c],l.pop()}}}},{"./PropertyBinding.js":"5fWtn","../math/MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],kFzcX:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AnimationMixer",()=>h);var m=e("./AnimationAction.js"),M=e("../core/EventDispatcher.js"),v=e("../math/interpolants/LinearInterpolant.js"),n=e("./PropertyBinding.js"),i=e("./PropertyMixer.js"),t=e("./AnimationClip.js"),r=e("../constants.js");const l=new Float32Array(1);class h extends M.EventDispatcher{constructor(c){super();this._root=c,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(c,s){const d=c._localRoot||this._root,p=c._clip.tracks,u=p.length,g=c._propertyBindings,S=c._interpolants,y=d.uuid,T=this._bindingsByRootAndName;let x=T[y];x===void 0&&(x={},T[y]=x);for(let _=0;_!==u;++_){const A=p[_],w=A.name;let j=x[w];if(j!==void 0)++j.referenceCount,g[_]=j;else{if(j=g[_],j!==void 0){j._cacheIndex===null&&(++j.referenceCount,this._addInactiveBinding(j,y,w));continue}const R=s&&s._propertyBindings[_].binding.parsedPath;j=new i.PropertyMixer(n.PropertyBinding.create(d,w,R),A.ValueTypeName,A.getValueSize()),++j.referenceCount,this._addInactiveBinding(j,y,w),g[_]=j}S[_].resultBuffer=j.buffer}}_activateAction(c){if(!this._isActiveAction(c)){if(c._cacheIndex===null){const d=(c._localRoot||this._root).uuid,p=c._clip.uuid,u=this._actionsByClip[p];this._bindAction(c,u&&u.knownActions[0]),this._addInactiveAction(c,p,d)}const s=c._propertyBindings;for(let d=0,p=s.length;d!==p;++d){const u=s[d];u.useCount++==0&&(this._lendBinding(u),u.saveOriginalState())}this._lendAction(c)}}_deactivateAction(c){if(this._isActiveAction(c)){const s=c._propertyBindings;for(let d=0,p=s.length;d!==p;++d){const u=s[d];--u.useCount==0&&(u.restoreOriginalState(),this._takeBackBinding(u))}this._takeBackAction(c)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const c=this;this.stats={actions:{get total(){return c._actions.length},get inUse(){return c._nActiveActions}},bindings:{get total(){return c._bindings.length},get inUse(){return c._nActiveBindings}},controlInterpolants:{get total(){return c._controlInterpolants.length},get inUse(){return c._nActiveControlInterpolants}}}}_isActiveAction(c){const s=c._cacheIndex;return s!==null&&s<this._nActiveActions}_addInactiveAction(c,s,d){const p=this._actions,u=this._actionsByClip;let g=u[s];if(g===void 0)g={knownActions:[c],actionByRoot:{}},c._byClipCacheIndex=0,u[s]=g;else{const S=g.knownActions;c._byClipCacheIndex=S.length,S.push(c)}c._cacheIndex=p.length,p.push(c),g.actionByRoot[d]=c}_removeInactiveAction(c){const s=this._actions,d=s[s.length-1],p=c._cacheIndex;d._cacheIndex=p,s[p]=d,s.pop(),c._cacheIndex=null;const u=c._clip.uuid,g=this._actionsByClip,S=g[u],y=S.knownActions,T=y[y.length-1],x=c._byClipCacheIndex;T._byClipCacheIndex=x,y[x]=T,y.pop(),c._byClipCacheIndex=null;const _=S.actionByRoot,A=(c._localRoot||this._root).uuid;delete _[A],y.length===0&&delete g[u],this._removeInactiveBindingsForAction(c)}_removeInactiveBindingsForAction(c){const s=c._propertyBindings;for(let d=0,p=s.length;d!==p;++d){const u=s[d];--u.referenceCount==0&&this._removeInactiveBinding(u)}}_lendAction(c){const s=this._actions,d=c._cacheIndex,p=this._nActiveActions++,u=s[p];c._cacheIndex=p,s[p]=c,u._cacheIndex=d,s[d]=u}_takeBackAction(c){const s=this._actions,d=c._cacheIndex,p=--this._nActiveActions,u=s[p];c._cacheIndex=p,s[p]=c,u._cacheIndex=d,s[d]=u}_addInactiveBinding(c,s,d){const p=this._bindingsByRootAndName,u=this._bindings;let g=p[s];g===void 0&&(g={},p[s]=g),g[d]=c,c._cacheIndex=u.length,u.push(c)}_removeInactiveBinding(c){const s=this._bindings,d=c.binding,p=d.rootNode.uuid,u=d.path,g=this._bindingsByRootAndName,S=g[p],y=s[s.length-1],T=c._cacheIndex;y._cacheIndex=T,s[T]=y,s.pop(),delete S[u],Object.keys(S).length===0&&delete g[p]}_lendBinding(c){const s=this._bindings,d=c._cacheIndex,p=this._nActiveBindings++,u=s[p];c._cacheIndex=p,s[p]=c,u._cacheIndex=d,s[d]=u}_takeBackBinding(c){const s=this._bindings,d=c._cacheIndex,p=--this._nActiveBindings,u=s[p];c._cacheIndex=p,s[p]=c,u._cacheIndex=d,s[d]=u}_lendControlInterpolant(){const c=this._controlInterpolants,s=this._nActiveControlInterpolants++;let d=c[s];return d===void 0&&(d=new v.LinearInterpolant(new Float32Array(2),new Float32Array(2),1,l),d.__cacheIndex=s,c[s]=d),d}_takeBackControlInterpolant(c){const s=this._controlInterpolants,d=c.__cacheIndex,p=--this._nActiveControlInterpolants,u=s[p];c.__cacheIndex=p,s[p]=c,u.__cacheIndex=d,s[d]=u}clipAction(c,s,d){const p=s||this._root,u=p.uuid;let g=typeof c=="string"?t.AnimationClip.findByName(p,c):c;const S=g!==null?g.uuid:c,y=this._actionsByClip[S];let T=null;if(d===void 0&&(g!==null?d=g.blendMode:d=r.NormalAnimationBlendMode),y!==void 0){const _=y.actionByRoot[u];if(_!==void 0&&_.blendMode===d)return _;T=y.knownActions[0],g===null&&(g=T._clip)}if(g===null)return null;const x=new m.AnimationAction(this,g,s,d);return this._bindAction(x,T),this._addInactiveAction(x,S,u),x}existingAction(c,s){const d=s||this._root,p=d.uuid,u=typeof c=="string"?t.AnimationClip.findByName(d,c):c,g=u?u.uuid:c,S=this._actionsByClip[g];return S!==void 0&&S.actionByRoot[p]||null}stopAllAction(){const c=this._actions,s=this._nActiveActions;for(let d=s-1;d>=0;--d)c[d].stop();return this}update(c){c*=this.timeScale;const s=this._actions,d=this._nActiveActions,p=this.time+=c,u=Math.sign(c),g=this._accuIndex^=1;for(let T=0;T!==d;++T)s[T]._update(p,c,u,g);const S=this._bindings,y=this._nActiveBindings;for(let T=0;T!==y;++T)S[T].apply(g);return this}setTime(c){this.time=0;for(let s=0;s<this._actions.length;s++)this._actions[s].time=0;return this.update(c)}getRoot(){return this._root}uncacheClip(c){const s=this._actions,d=c.uuid,p=this._actionsByClip,u=p[d];if(u!==void 0){const g=u.knownActions;for(let S=0,y=g.length;S!==y;++S){const T=g[S];this._deactivateAction(T);const x=T._cacheIndex,_=s[s.length-1];T._cacheIndex=null,T._byClipCacheIndex=null,_._cacheIndex=x,s[x]=_,s.pop(),this._removeInactiveBindingsForAction(T)}delete p[d]}}uncacheRoot(c){const s=c.uuid,d=this._actionsByClip;for(const g in d){const S=d[g].actionByRoot,y=S[s];y!==void 0&&(this._deactivateAction(y),this._removeInactiveAction(y))}const p=this._bindingsByRootAndName,u=p[s];if(u!==void 0)for(const g in u){const S=u[g];S.restoreOriginalState(),this._removeInactiveBinding(S)}}uncacheAction(c,s){const d=this.existingAction(c,s);d!==null&&(this._deactivateAction(d),this._removeInactiveAction(d))}}},{"./AnimationAction.js":"dxlJk","../core/EventDispatcher.js":"d6Goy","../math/interpolants/LinearInterpolant.js":"le8UA","./PropertyBinding.js":"5fWtn","./PropertyMixer.js":"b2rcU","./AnimationClip.js":"gfGc5","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],dxlJk:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AnimationAction",()=>M);var m=e("../constants.js");class M{constructor(n,i,t=null,r=i.blendMode){this._mixer=n,this._clip=i,this._localRoot=t,this.blendMode=r;const l=i.tracks,h=l.length,f=new Array(h),c={endingStart:m.ZeroCurvatureEnding,endingEnd:m.ZeroCurvatureEnding};for(let s=0;s!==h;++s){const d=l[s].createInterpolant(null);f[s]=d,d.settings=c}this._interpolantSettings=c,this._interpolants=f,this._propertyBindings=new Array(h),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=m.LoopRepeat,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(n){return this._startTime=n,this}setLoop(n,i){return this.loop=n,this.repetitions=i,this}setEffectiveWeight(n){return this.weight=n,this._effectiveWeight=this.enabled?n:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(n){return this._scheduleFading(n,0,1)}fadeOut(n){return this._scheduleFading(n,1,0)}crossFadeFrom(n,i,t){if(n.fadeOut(i),this.fadeIn(i),t){const r=this._clip.duration,l=n._clip.duration,h=l/r,f=r/l;n.warp(1,h,i),this.warp(f,1,i)}return this}crossFadeTo(n,i,t){return n.crossFadeFrom(this,i,t)}stopFading(){const n=this._weightInterpolant;return n!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(n)),this}setEffectiveTimeScale(n){return this.timeScale=n,this._effectiveTimeScale=this.paused?0:n,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(n){return this.timeScale=this._clip.duration/n,this.stopWarping()}syncWith(n){return this.time=n.time,this.timeScale=n.timeScale,this.stopWarping()}halt(n){return this.warp(this._effectiveTimeScale,0,n)}warp(n,i,t){const r=this._mixer,l=r.time,h=this.timeScale;let f=this._timeScaleInterpolant;f===null&&(f=r._lendControlInterpolant(),this._timeScaleInterpolant=f);const c=f.parameterPositions,s=f.sampleValues;return c[0]=l,c[1]=l+t,s[0]=n/h,s[1]=i/h,this}stopWarping(){const n=this._timeScaleInterpolant;return n!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(n)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(n,i,t,r){if(!this.enabled){this._updateWeight(n);return}const l=this._startTime;if(l!==null){const c=(n-l)*t;c<0||t===0?i=0:(this._startTime=null,i=t*c)}i*=this._updateTimeScale(n);const h=this._updateTime(i),f=this._updateWeight(n);if(f>0){const c=this._interpolants,s=this._propertyBindings;switch(this.blendMode){case m.AdditiveAnimationBlendMode:for(let d=0,p=c.length;d!==p;++d)c[d].evaluate(h),s[d].accumulateAdditive(f);break;case m.NormalAnimationBlendMode:default:for(let d=0,p=c.length;d!==p;++d)c[d].evaluate(h),s[d].accumulate(r,f)}}}_updateWeight(n){let i=0;if(this.enabled){i=this.weight;const t=this._weightInterpolant;if(t!==null){const r=t.evaluate(n)[0];i*=r,n>t.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=i,i}_updateTimeScale(n){let i=0;if(!this.paused){i=this.timeScale;const t=this._timeScaleInterpolant;t!==null&&(i*=t.evaluate(n)[0],n>t.parameterPositions[1]&&(this.stopWarping(),i===0?this.paused=!0:this.timeScale=i))}return this._effectiveTimeScale=i,i}_updateTime(n){const i=this._clip.duration,t=this.loop;let r=this.time+n,l=this._loopCount;const h=t===m.LoopPingPong;if(n===0)return l===-1?r:h&&(l&1)==1?i-r:r;if(t===m.LoopOnce){l===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(r>=i)r=i;else if(r<0)r=0;else{this.time=r;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:n<0?-1:1})}}else{if(l===-1&&(n>=0?(l=0,this._setEndings(!0,this.repetitions===0,h)):this._setEndings(this.repetitions===0,!0,h)),r>=i||r<0){const f=Math.floor(r/i);r-=i*f,l+=Math.abs(f);const c=this.repetitions-l;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=n>0?i:0,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:n>0?1:-1});else{if(c===1){const s=n<0;this._setEndings(s,!s,h)}else this._setEndings(!1,!1,h);this._loopCount=l,this.time=r,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:f})}}else this.time=r;if(h&&(l&1)==1)return i-r}return r}_setEndings(n,i,t){const r=this._interpolantSettings;t?(r.endingStart=m.ZeroSlopeEnding,r.endingEnd=m.ZeroSlopeEnding):(n?r.endingStart=this.zeroSlopeAtStart?m.ZeroSlopeEnding:m.ZeroCurvatureEnding:r.endingStart=m.WrapAroundEnding,i?r.endingEnd=this.zeroSlopeAtEnd?m.ZeroSlopeEnding:m.ZeroCurvatureEnding:r.endingEnd=m.WrapAroundEnding)}_scheduleFading(n,i,t){const r=this._mixer,l=r.time;let h=this._weightInterpolant;h===null&&(h=r._lendControlInterpolant(),this._weightInterpolant=h);const f=h.parameterPositions,c=h.sampleValues;return f[0]=l,c[0]=i,f[1]=l+n,c[1]=t,this}}},{"../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4eEt7":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Uniform",()=>m);class m{constructor(v){this.value=v}clone(){return new m(this.value.clone===void 0?this.value:this.value.clone())}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gAg4k:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"UniformsGroup",()=>n);var m=e("./EventDispatcher.js"),M=e("../constants.js");let v=0;class n extends m.EventDispatcher{constructor(){super();this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:v++}),this.name="",this.usage=M.StaticDrawUsage,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){const r=this.uniforms.indexOf(t);return r!==-1&&this.uniforms.splice(r,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(t){this.name=t.name,this.usage=t.usage;const r=t.uniforms;this.uniforms.length=0;for(let l=0,h=r.length;l<h;l++)this.uniforms.push(r[l].clone());return this}clone(){return new this.constructor().copy(this)}}},{"./EventDispatcher.js":"d6Goy","../constants.js":"bqsVL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jNLuQ:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"InstancedInterleavedBuffer",()=>M);var m=e("./InterleavedBuffer.js");class M extends m.InterleavedBuffer{constructor(n,i,t=1){super(n,i);this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=t}copy(n){return super.copy(n),this.meshPerAttribute=n.meshPerAttribute,this}clone(n){const i=super.clone(n);return i.meshPerAttribute=this.meshPerAttribute,i}toJSON(n){const i=super.toJSON(n);return i.isInstancedInterleavedBuffer=!0,i.meshPerAttribute=this.meshPerAttribute,i}}},{"./InterleavedBuffer.js":"931Vz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6LcIe":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"GLBufferAttribute",()=>m);class m{constructor(v,n,i,t,r){this.isGLBufferAttribute=!0,this.name="",this.buffer=v,this.type=n,this.itemSize=i,this.elementSize=t,this.count=r,this.version=0}set needsUpdate(v){v===!0&&this.version++}setBuffer(v){return this.buffer=v,this}setType(v,n){return this.type=v,this.elementSize=n,this}setItemSize(v){return this.itemSize=v,this}setCount(v){return this.count=v,this}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bIJmc:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Raycaster",()=>v);var m=e("../math/Ray.js"),M=e("./Layers.js");class v{constructor(r,l,h=0,f=1/0){this.ray=new m.Ray(r,l),this.near=h,this.far=f,this.camera=null,this.layers=new M.Layers,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(r,l){this.ray.set(r,l)}setFromCamera(r,l){l.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(l.matrixWorld),this.ray.direction.set(r.x,r.y,.5).unproject(l).sub(this.ray.origin).normalize(),this.camera=l):l.isOrthographicCamera?(this.ray.origin.set(r.x,r.y,(l.near+l.far)/(l.near-l.far)).unproject(l),this.ray.direction.set(0,0,-1).transformDirection(l.matrixWorld),this.camera=l):console.error("THREE.Raycaster: Unsupported camera type: "+l.type)}intersectObject(r,l=!0,h=[]){return i(r,this,h,l),h.sort(n),h}intersectObjects(r,l=!0,h=[]){for(let f=0,c=r.length;f<c;f++)i(r[f],this,h,l);return h.sort(n),h}}function n(t,r){return t.distance-r.distance}function i(t,r,l,h){if(t.layers.test(r.layers)&&t.raycast(r,l),h===!0){const f=t.children;for(let c=0,s=f.length;c<s;c++)i(f[c],r,l,!0)}}},{"../math/Ray.js":"8evV6","./Layers.js":"4RZ6C","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fbHxV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Spherical",()=>M);var m=e("./MathUtils.js");class M{constructor(n=1,i=0,t=0){return this.radius=n,this.phi=i,this.theta=t,this}set(n,i,t){return this.radius=n,this.phi=i,this.theta=t,this}copy(n){return this.radius=n.radius,this.phi=n.phi,this.theta=n.theta,this}makeSafe(){const n=1e-6;return this.phi=Math.max(n,Math.min(Math.PI-n,this.phi)),this}setFromVector3(n){return this.setFromCartesianCoords(n.x,n.y,n.z)}setFromCartesianCoords(n,i,t){return this.radius=Math.sqrt(n*n+i*i+t*t),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(n,t),this.phi=Math.acos(m.clamp(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}},{"./MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],fFKSr:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Cylindrical",()=>m);class m{constructor(v=1,n=0,i=0){return this.radius=v,this.theta=n,this.y=i,this}set(v,n,i){return this.radius=v,this.theta=n,this.y=i,this}copy(v){return this.radius=v.radius,this.theta=v.theta,this.y=v.y,this}setFromVector3(v){return this.setFromCartesianCoords(v.x,v.y,v.z)}setFromCartesianCoords(v,n,i){return this.radius=Math.sqrt(v*v+i*i),this.theta=Math.atan2(v,i),this.y=n,this}clone(){return new this.constructor().copy(this)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],g7q1e:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Box2",()=>v);var m=e("./Vector2.js");const M=new m.Vector2;class v{constructor(i=new m.Vector2(1/0,1/0),t=new m.Vector2(-1/0,-1/0)){this.isBox2=!0,this.min=i,this.max=t}set(i,t){return this.min.copy(i),this.max.copy(t),this}setFromPoints(i){this.makeEmpty();for(let t=0,r=i.length;t<r;t++)this.expandByPoint(i[t]);return this}setFromCenterAndSize(i,t){const r=M.copy(t).multiplyScalar(.5);return this.min.copy(i).sub(r),this.max.copy(i).add(r),this}clone(){return new this.constructor().copy(this)}copy(i){return this.min.copy(i.min),this.max.copy(i.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(i){return this.isEmpty()?i.set(0,0):i.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(i){return this.isEmpty()?i.set(0,0):i.subVectors(this.max,this.min)}expandByPoint(i){return this.min.min(i),this.max.max(i),this}expandByVector(i){return this.min.sub(i),this.max.add(i),this}expandByScalar(i){return this.min.addScalar(-i),this.max.addScalar(i),this}containsPoint(i){return!(i.x<this.min.x||i.x>this.max.x||i.y<this.min.y||i.y>this.max.y)}containsBox(i){return this.min.x<=i.min.x&&i.max.x<=this.max.x&&this.min.y<=i.min.y&&i.max.y<=this.max.y}getParameter(i,t){return t.set((i.x-this.min.x)/(this.max.x-this.min.x),(i.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(i){return!(i.max.x<this.min.x||i.min.x>this.max.x||i.max.y<this.min.y||i.min.y>this.max.y)}clampPoint(i,t){return t.copy(i).clamp(this.min,this.max)}distanceToPoint(i){return this.clampPoint(i,M).distanceTo(i)}intersect(i){return this.min.max(i.min),this.max.min(i.max),this.isEmpty()&&this.makeEmpty(),this}union(i){return this.min.min(i.min),this.max.max(i.max),this}translate(i){return this.min.add(i),this.max.add(i),this}equals(i){return i.min.equals(this.min)&&i.max.equals(this.max)}}},{"./Vector2.js":"crXpG","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jTaDW:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Line3",()=>i);var m=e("./Vector3.js"),M=e("./MathUtils.js");const v=new m.Vector3,n=new m.Vector3;class i{constructor(r=new m.Vector3,l=new m.Vector3){this.start=r,this.end=l}set(r,l){return this.start.copy(r),this.end.copy(l),this}copy(r){return this.start.copy(r.start),this.end.copy(r.end),this}getCenter(r){return r.addVectors(this.start,this.end).multiplyScalar(.5)}delta(r){return r.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(r,l){return this.delta(l).multiplyScalar(r).add(this.start)}closestPointToPointParameter(r,l){v.subVectors(r,this.start),n.subVectors(this.end,this.start);const h=n.dot(n);let c=n.dot(v)/h;return l&&(c=M.clamp(c,0,1)),c}closestPointToPoint(r,l,h){const f=this.closestPointToPointParameter(r,l);return this.delta(h).multiplyScalar(f).add(this.start)}applyMatrix4(r){return this.start.applyMatrix4(r),this.end.applyMatrix4(r),this}equals(r){return r.start.equals(this.start)&&r.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}},{"./Vector3.js":"fUbuJ","./MathUtils.js":"9o1gq","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],enmRj:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SpotLightHelper",()=>l);var m=e("../math/Vector3.js"),M=e("../core/Object3D.js"),v=e("../objects/LineSegments.js"),n=e("../materials/LineBasicMaterial.js"),i=e("../core/BufferAttribute.js"),t=e("../core/BufferGeometry.js");const r=new m.Vector3;class l extends M.Object3D{constructor(f,c){super();this.light=f,this.matrix=f.matrixWorld,this.matrixAutoUpdate=!1,this.color=c,this.type="SpotLightHelper";const s=new t.BufferGeometry,d=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let u=0,g=1,S=32;u<S;u++,g++){const y=u/S*Math.PI*2,T=g/S*Math.PI*2;d.push(Math.cos(y),Math.sin(y),1,Math.cos(T),Math.sin(T),1)}s.setAttribute("position",new i.Float32BufferAttribute(d,3));const p=new n.LineBasicMaterial({fog:!1,toneMapped:!1});this.cone=new v.LineSegments(s,p),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1);const f=this.light.distance?this.light.distance:1e3,c=f*Math.tan(this.light.angle);this.cone.scale.set(c,c,f),r.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(r),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}},{"../math/Vector3.js":"fUbuJ","../core/Object3D.js":"ibguD","../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6OkiN":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"SkeletonHelper",()=>c);var m=e("../objects/LineSegments.js"),M=e("../math/Matrix4.js"),v=e("../materials/LineBasicMaterial.js"),n=e("../math/Color.js"),i=e("../math/Vector3.js"),t=e("../core/BufferGeometry.js"),r=e("../core/BufferAttribute.js");const l=new i.Vector3,h=new M.Matrix4,f=new M.Matrix4;class c extends m.LineSegments{constructor(p){const u=s(p),g=new t.BufferGeometry,S=[],y=[],T=new n.Color(0,0,1),x=new n.Color(0,1,0);for(let A=0;A<u.length;A++){const w=u[A];w.parent&&w.parent.isBone&&(S.push(0,0,0),S.push(0,0,0),y.push(T.r,T.g,T.b),y.push(x.r,x.g,x.b))}g.setAttribute("position",new r.Float32BufferAttribute(S,3)),g.setAttribute("color",new r.Float32BufferAttribute(y,3));const _=new v.LineBasicMaterial({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(g,_);this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=p,this.bones=u,this.matrix=p.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(p){const u=this.bones,g=this.geometry,S=g.getAttribute("position");f.copy(this.root.matrixWorld).invert();for(let y=0,T=0;y<u.length;y++){const x=u[y];x.parent&&x.parent.isBone&&(h.multiplyMatrices(f,x.matrixWorld),l.setFromMatrixPosition(h),S.setXYZ(T,l.x,l.y,l.z),h.multiplyMatrices(f,x.parent.matrixWorld),l.setFromMatrixPosition(h),S.setXYZ(T+1,l.x,l.y,l.z),T+=2)}g.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(p)}dispose(){this.geometry.dispose(),this.material.dispose()}}function s(d){const p=[];d.isBone===!0&&p.push(d);for(let u=0;u<d.children.length;u++)p.push.apply(p,s(d.children[u]));return p}},{"../objects/LineSegments.js":"cOWpn","../math/Matrix4.js":"64n8p","../materials/LineBasicMaterial.js":"cRUug","../math/Color.js":"gFgcM","../math/Vector3.js":"fUbuJ","../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],bJcrf:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PointLightHelper",()=>n);var m=e("../objects/Mesh.js"),M=e("../materials/MeshBasicMaterial.js"),v=e("../geometries/SphereGeometry.js");class n extends m.Mesh{constructor(t,r,l){const h=new v.SphereGeometry(r,4,2),f=new M.MeshBasicMaterial({wireframe:!0,fog:!1,toneMapped:!1});super(h,f);this.light=t,this.color=l,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}},{"../objects/Mesh.js":"d9YFT","../materials/MeshBasicMaterial.js":"gXfgB","../geometries/SphereGeometry.js":"1yNk5","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jeUz9:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"HemisphereLightHelper",()=>c);var m=e("../math/Vector3.js"),M=e("../math/Color.js"),v=e("../core/Object3D.js"),n=e("../objects/Mesh.js"),i=e("../materials/MeshBasicMaterial.js"),t=e("../geometries/OctahedronGeometry.js"),r=e("../core/BufferAttribute.js");const l=new m.Vector3,h=new M.Color,f=new M.Color;class c extends v.Object3D{constructor(d,p,u){super();this.light=d,this.matrix=d.matrixWorld,this.matrixAutoUpdate=!1,this.color=u,this.type="HemisphereLightHelper";const g=new t.OctahedronGeometry(p);g.rotateY(Math.PI*.5),this.material=new i.MeshBasicMaterial({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const S=g.getAttribute("position"),y=new Float32Array(S.count*3);g.setAttribute("color",new r.BufferAttribute(y,3)),this.add(new n.Mesh(g,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const d=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const p=d.geometry.getAttribute("color");h.copy(this.light.color),f.copy(this.light.groundColor);for(let u=0,g=p.count;u<g;u++){const S=u<g/2?h:f;p.setXYZ(u,S.r,S.g,S.b)}p.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),d.lookAt(l.setFromMatrixPosition(this.light.matrixWorld).negate())}}},{"../math/Vector3.js":"fUbuJ","../math/Color.js":"gFgcM","../core/Object3D.js":"ibguD","../objects/Mesh.js":"d9YFT","../materials/MeshBasicMaterial.js":"gXfgB","../geometries/OctahedronGeometry.js":"fckWH","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],amMcV:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"GridHelper",()=>t);var m=e("../objects/LineSegments.js"),M=e("../materials/LineBasicMaterial.js"),v=e("../core/BufferAttribute.js"),n=e("../core/BufferGeometry.js"),i=e("../math/Color.js");class t extends m.LineSegments{constructor(l=10,h=10,f=4473924,c=8947848){f=new i.Color(f),c=new i.Color(c);const s=h/2,d=l/h,p=l/2,u=[],g=[];for(let T=0,x=0,_=-p;T<=h;T++,_+=d){u.push(-p,0,_,p,0,_),u.push(_,0,-p,_,0,p);const A=T===s?f:c;A.toArray(g,x),x+=3,A.toArray(g,x),x+=3,A.toArray(g,x),x+=3,A.toArray(g,x),x+=3}const S=new n.BufferGeometry;S.setAttribute("position",new v.Float32BufferAttribute(u,3)),S.setAttribute("color",new v.Float32BufferAttribute(g,3));const y=new M.LineBasicMaterial({vertexColors:!0,toneMapped:!1});super(S,y);this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}},{"../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],gJ4KC:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PolarGridHelper",()=>t);var m=e("../objects/LineSegments.js"),M=e("../materials/LineBasicMaterial.js"),v=e("../core/BufferAttribute.js"),n=e("../core/BufferGeometry.js"),i=e("../math/Color.js");class t extends m.LineSegments{constructor(l=10,h=16,f=8,c=64,s=4473924,d=8947848){s=new i.Color(s),d=new i.Color(d);const p=[],u=[];if(h>1)for(let y=0;y<h;y++){const T=y/h*(Math.PI*2),x=Math.sin(T)*l,_=Math.cos(T)*l;p.push(0,0,0),p.push(x,0,_);const A=y&1?s:d;u.push(A.r,A.g,A.b),u.push(A.r,A.g,A.b)}for(let y=0;y<f;y++){const T=y&1?s:d,x=l-l/f*y;for(let _=0;_<c;_++){let A=_/c*(Math.PI*2),w=Math.sin(A)*x,j=Math.cos(A)*x;p.push(w,0,j),u.push(T.r,T.g,T.b),A=(_+1)/c*(Math.PI*2),w=Math.sin(A)*x,j=Math.cos(A)*x,p.push(w,0,j),u.push(T.r,T.g,T.b)}}const g=new n.BufferGeometry;g.setAttribute("position",new v.Float32BufferAttribute(p,3)),g.setAttribute("color",new v.Float32BufferAttribute(u,3));const S=new M.LineBasicMaterial({vertexColors:!0,toneMapped:!1});super(g,S);this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}},{"../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"5ikJJ":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"DirectionalLightHelper",()=>f);var m=e("../math/Vector3.js"),M=e("../core/Object3D.js"),v=e("../objects/Line.js"),n=e("../core/BufferAttribute.js"),i=e("../core/BufferGeometry.js"),t=e("../materials/LineBasicMaterial.js");const r=new m.Vector3,l=new m.Vector3,h=new m.Vector3;class f extends M.Object3D{constructor(s,d,p){super();this.light=s,this.matrix=s.matrixWorld,this.matrixAutoUpdate=!1,this.color=p,this.type="DirectionalLightHelper",d===void 0&&(d=1);let u=new i.BufferGeometry;u.setAttribute("position",new n.Float32BufferAttribute([-d,d,0,d,d,0,d,-d,0,-d,-d,0,-d,d,0],3));const g=new t.LineBasicMaterial({fog:!1,toneMapped:!1});this.lightPlane=new v.Line(u,g),this.add(this.lightPlane),u=new i.BufferGeometry,u.setAttribute("position",new n.Float32BufferAttribute([0,0,0,0,0,1],3)),this.targetLine=new v.Line(u,g),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),r.setFromMatrixPosition(this.light.matrixWorld),l.setFromMatrixPosition(this.light.target.matrixWorld),h.subVectors(l,r),this.lightPlane.lookAt(l),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(l),this.targetLine.scale.z=h.length()}}},{"../math/Vector3.js":"fUbuJ","../core/Object3D.js":"ibguD","../objects/Line.js":"li6mQ","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../materials/LineBasicMaterial.js":"cRUug","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],iTrqa:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"CameraHelper",()=>f);var m=e("../cameras/Camera.js"),M=e("../math/Vector3.js"),v=e("../objects/LineSegments.js"),n=e("../math/Color.js"),i=e("../materials/LineBasicMaterial.js"),t=e("../core/BufferGeometry.js"),r=e("../core/BufferAttribute.js");const l=new M.Vector3,h=new m.Camera;class f extends v.LineSegments{constructor(d){const p=new t.BufferGeometry,u=new i.LineBasicMaterial({color:16777215,vertexColors:!0,toneMapped:!1}),g=[],S=[],y={};T("n1","n2"),T("n2","n4"),T("n4","n3"),T("n3","n1"),T("f1","f2"),T("f2","f4"),T("f4","f3"),T("f3","f1"),T("n1","f1"),T("n2","f2"),T("n3","f3"),T("n4","f4"),T("p","n1"),T("p","n2"),T("p","n3"),T("p","n4"),T("u1","u2"),T("u2","u3"),T("u3","u1"),T("c","t"),T("p","c"),T("cn1","cn2"),T("cn3","cn4"),T("cf1","cf2"),T("cf3","cf4");function T(L,D){x(L),x(D)}function x(L){g.push(0,0,0),S.push(0,0,0),y[L]===void 0&&(y[L]=[]),y[L].push(g.length/3-1)}p.setAttribute("position",new r.Float32BufferAttribute(g,3)),p.setAttribute("color",new r.Float32BufferAttribute(S,3));super(p,u);this.type="CameraHelper",this.camera=d,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=d.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=y,this.update();const _=new n.Color(16755200),A=new n.Color(16711680),w=new n.Color(43775),j=new n.Color(16777215),R=new n.Color(3355443);this.setColors(_,A,w,j,R)}setColors(d,p,u,g,S){const T=this.geometry.getAttribute("color");T.setXYZ(0,d.r,d.g,d.b),T.setXYZ(1,d.r,d.g,d.b),T.setXYZ(2,d.r,d.g,d.b),T.setXYZ(3,d.r,d.g,d.b),T.setXYZ(4,d.r,d.g,d.b),T.setXYZ(5,d.r,d.g,d.b),T.setXYZ(6,d.r,d.g,d.b),T.setXYZ(7,d.r,d.g,d.b),T.setXYZ(8,d.r,d.g,d.b),T.setXYZ(9,d.r,d.g,d.b),T.setXYZ(10,d.r,d.g,d.b),T.setXYZ(11,d.r,d.g,d.b),T.setXYZ(12,d.r,d.g,d.b),T.setXYZ(13,d.r,d.g,d.b),T.setXYZ(14,d.r,d.g,d.b),T.setXYZ(15,d.r,d.g,d.b),T.setXYZ(16,d.r,d.g,d.b),T.setXYZ(17,d.r,d.g,d.b),T.setXYZ(18,d.r,d.g,d.b),T.setXYZ(19,d.r,d.g,d.b),T.setXYZ(20,d.r,d.g,d.b),T.setXYZ(21,d.r,d.g,d.b),T.setXYZ(22,d.r,d.g,d.b),T.setXYZ(23,d.r,d.g,d.b),T.setXYZ(24,p.r,p.g,p.b),T.setXYZ(25,p.r,p.g,p.b),T.setXYZ(26,p.r,p.g,p.b),T.setXYZ(27,p.r,p.g,p.b),T.setXYZ(28,p.r,p.g,p.b),T.setXYZ(29,p.r,p.g,p.b),T.setXYZ(30,p.r,p.g,p.b),T.setXYZ(31,p.r,p.g,p.b),T.setXYZ(32,u.r,u.g,u.b),T.setXYZ(33,u.r,u.g,u.b),T.setXYZ(34,u.r,u.g,u.b),T.setXYZ(35,u.r,u.g,u.b),T.setXYZ(36,u.r,u.g,u.b),T.setXYZ(37,u.r,u.g,u.b),T.setXYZ(38,g.r,g.g,g.b),T.setXYZ(39,g.r,g.g,g.b),T.setXYZ(40,S.r,S.g,S.b),T.setXYZ(41,S.r,S.g,S.b),T.setXYZ(42,S.r,S.g,S.b),T.setXYZ(43,S.r,S.g,S.b),T.setXYZ(44,S.r,S.g,S.b),T.setXYZ(45,S.r,S.g,S.b),T.setXYZ(46,S.r,S.g,S.b),T.setXYZ(47,S.r,S.g,S.b),T.setXYZ(48,S.r,S.g,S.b),T.setXYZ(49,S.r,S.g,S.b),T.needsUpdate=!0}update(){const d=this.geometry,p=this.pointMap,u=1,g=1;h.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),c("c",p,d,h,0,0,-1),c("t",p,d,h,0,0,1),c("n1",p,d,h,-u,-g,-1),c("n2",p,d,h,u,-g,-1),c("n3",p,d,h,-u,g,-1),c("n4",p,d,h,u,g,-1),c("f1",p,d,h,-u,-g,1),c("f2",p,d,h,u,-g,1),c("f3",p,d,h,-u,g,1),c("f4",p,d,h,u,g,1),c("u1",p,d,h,u*.7,g*1.1,-1),c("u2",p,d,h,-u*.7,g*1.1,-1),c("u3",p,d,h,0,g*2,-1),c("cf1",p,d,h,-u,0,1),c("cf2",p,d,h,u,0,1),c("cf3",p,d,h,0,-g,1),c("cf4",p,d,h,0,g,1),c("cn1",p,d,h,-u,0,-1),c("cn2",p,d,h,u,0,-1),c("cn3",p,d,h,0,-g,-1),c("cn4",p,d,h,0,g,-1),d.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function c(s,d,p,u,g,S,y){l.set(g,S,y).unproject(u);const T=d[s];if(T!==void 0){const x=p.getAttribute("position");for(let _=0,A=T.length;_<A;_++)x.setXYZ(T[_],l.x,l.y,l.z)}}},{"../cameras/Camera.js":"2L3jQ","../math/Vector3.js":"fUbuJ","../objects/LineSegments.js":"cOWpn","../math/Color.js":"gFgcM","../materials/LineBasicMaterial.js":"cRUug","../core/BufferGeometry.js":"jAZYz","../core/BufferAttribute.js":"7hhbt","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],jAmrE:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"BoxHelper",()=>r);var m=e("../math/Box3.js"),M=e("../objects/LineSegments.js"),v=e("../materials/LineBasicMaterial.js"),n=e("../core/BufferAttribute.js"),i=e("../core/BufferGeometry.js");const t=new m.Box3;class r extends M.LineSegments{constructor(h,f=16776960){const c=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(24),d=new i.BufferGeometry;d.setIndex(new n.BufferAttribute(c,1)),d.setAttribute("position",new n.BufferAttribute(s,3));super(d,new v.LineBasicMaterial({color:f,toneMapped:!1}));this.object=h,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(h){if(h!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&t.setFromObject(this.object),t.isEmpty())return;const f=t.min,c=t.max,s=this.geometry.attributes.position,d=s.array;d[0]=c.x,d[1]=c.y,d[2]=c.z,d[3]=f.x,d[4]=c.y,d[5]=c.z,d[6]=f.x,d[7]=f.y,d[8]=c.z,d[9]=c.x,d[10]=f.y,d[11]=c.z,d[12]=c.x,d[13]=c.y,d[14]=f.z,d[15]=f.x,d[16]=c.y,d[17]=f.z,d[18]=f.x,d[19]=f.y,d[20]=f.z,d[21]=c.x,d[22]=f.y,d[23]=f.z,s.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(h){return this.object=h,this.update(),this}copy(h,f){return super.copy(h,f),this.object=h.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}},{"../math/Box3.js":"dDJ5Q","../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"91ILL":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"Box3Helper",()=>i);var m=e("../objects/LineSegments.js"),M=e("../materials/LineBasicMaterial.js"),v=e("../core/BufferAttribute.js"),n=e("../core/BufferGeometry.js");class i extends m.LineSegments{constructor(r,l=16776960){const h=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),f=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],c=new n.BufferGeometry;c.setIndex(new v.BufferAttribute(h,1)),c.setAttribute("position",new v.Float32BufferAttribute(f,3));super(c,new M.LineBasicMaterial({color:l,toneMapped:!1}));this.box=r,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(r){const l=this.box;l.isEmpty()||(l.getCenter(this.position),l.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(r))}dispose(){this.geometry.dispose(),this.material.dispose()}}},{"../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"7o05K":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"PlaneHelper",()=>r);var m=e("../objects/Line.js"),M=e("../objects/Mesh.js"),v=e("../materials/LineBasicMaterial.js"),n=e("../materials/MeshBasicMaterial.js"),i=e("../core/BufferAttribute.js"),t=e("../core/BufferGeometry.js");class r extends m.Line{constructor(h,f=1,c=16776960){const s=c,d=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],p=new t.BufferGeometry;p.setAttribute("position",new i.Float32BufferAttribute(d,3)),p.computeBoundingSphere();super(p,new v.LineBasicMaterial({color:s,toneMapped:!1}));this.type="PlaneHelper",this.plane=h,this.size=f;const u=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],g=new t.BufferGeometry;g.setAttribute("position",new i.Float32BufferAttribute(u,3)),g.computeBoundingSphere(),this.add(new M.Mesh(g,new n.MeshBasicMaterial({color:s,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(h){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(h)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}},{"../objects/Line.js":"li6mQ","../objects/Mesh.js":"d9YFT","../materials/LineBasicMaterial.js":"cRUug","../materials/MeshBasicMaterial.js":"gXfgB","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"4wjXv":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ArrowHelper",()=>d);var m=e("../core/BufferAttribute.js"),M=e("../core/BufferGeometry.js"),v=e("../core/Object3D.js"),n=e("../geometries/CylinderGeometry.js"),i=e("../materials/MeshBasicMaterial.js"),t=e("../materials/LineBasicMaterial.js"),r=e("../objects/Mesh.js"),l=e("../objects/Line.js"),h=e("../math/Vector3.js");const f=new h.Vector3;let c,s;class d extends v.Object3D{constructor(u=new h.Vector3(0,0,1),g=new h.Vector3(0,0,0),S=1,y=16776960,T=S*.2,x=T*.2){super();this.type="ArrowHelper",c===void 0&&(c=new M.BufferGeometry,c.setAttribute("position",new m.Float32BufferAttribute([0,0,0,0,1,0],3)),s=new n.CylinderGeometry(0,.5,1,5,1),s.translate(0,-.5,0)),this.position.copy(g),this.line=new l.Line(c,new t.LineBasicMaterial({color:y,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new r.Mesh(s,new i.MeshBasicMaterial({color:y,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(u),this.setLength(S,T,x)}setDirection(u){if(u.y>.99999)this.quaternion.set(0,0,0,1);else if(u.y<-.99999)this.quaternion.set(1,0,0,0);else{f.set(u.z,0,-u.x).normalize();const g=Math.acos(u.y);this.quaternion.setFromAxisAngle(f,g)}}setLength(u,g=u*.2,S=g*.2){this.line.scale.set(1,Math.max(1e-4,u-g),1),this.line.updateMatrix(),this.cone.scale.set(S,g,S),this.cone.position.y=u,this.cone.updateMatrix()}setColor(u){this.line.material.color.set(u),this.cone.material.color.set(u)}copy(u){return super.copy(u,!1),this.line.copy(u.line),this.cone.copy(u.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}},{"../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../core/Object3D.js":"ibguD","../geometries/CylinderGeometry.js":"1dXMP","../materials/MeshBasicMaterial.js":"gXfgB","../materials/LineBasicMaterial.js":"cRUug","../objects/Mesh.js":"d9YFT","../objects/Line.js":"li6mQ","../math/Vector3.js":"fUbuJ","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],"6lTlj":[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"AxesHelper",()=>t);var m=e("../objects/LineSegments.js"),M=e("../materials/LineBasicMaterial.js"),v=e("../core/BufferAttribute.js"),n=e("../core/BufferGeometry.js"),i=e("../math/Color.js");class t extends m.LineSegments{constructor(l=1){const h=[0,0,0,l,0,0,0,0,0,0,l,0,0,0,0,0,0,l],f=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],c=new n.BufferGeometry;c.setAttribute("position",new v.Float32BufferAttribute(h,3)),c.setAttribute("color",new v.Float32BufferAttribute(f,3));const s=new M.LineBasicMaterial({vertexColors:!0,toneMapped:!1});super(c,s);this.type="AxesHelper"}setColors(l,h,f){const c=new i.Color,s=this.geometry.attributes.color.array;return c.set(l),c.toArray(s,0),c.toArray(s,3),c.set(h),c.toArray(s,6),c.toArray(s,9),c.set(f),c.toArray(s,12),c.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}},{"../objects/LineSegments.js":"cOWpn","../materials/LineBasicMaterial.js":"cRUug","../core/BufferAttribute.js":"7hhbt","../core/BufferGeometry.js":"jAZYz","../math/Color.js":"gFgcM","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],f1l8r:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"ShapePath",()=>i);var m=e("../../math/Color.js"),M=e("./Path.js"),v=e("./Shape.js"),n=e("../ShapeUtils.js");class i{constructor(){this.type="ShapePath",this.color=new m.Color,this.subPaths=[],this.currentPath=null}moveTo(r,l){return this.currentPath=new M.Path,this.subPaths.push(this.currentPath),this.currentPath.moveTo(r,l),this}lineTo(r,l){return this.currentPath.lineTo(r,l),this}quadraticCurveTo(r,l,h,f){return this.currentPath.quadraticCurveTo(r,l,h,f),this}bezierCurveTo(r,l,h,f,c,s){return this.currentPath.bezierCurveTo(r,l,h,f,c,s),this}splineThru(r){return this.currentPath.splineThru(r),this}toShapes(r){function l(w){const j=[];for(let R=0,L=w.length;R<L;R++){const D=w[R],P=new v.Shape;P.curves=D.curves,j.push(P)}return j}function h(w,j){const R=j.length;let L=!1;for(let D=R-1,P=0;P<R;D=P++){let k=j[D],O=j[P],F=O.x-k.x,G=O.y-k.y;if(Math.abs(G)>Number.EPSILON){if(G<0&&(k=j[P],F=-F,O=j[D],G=-G),w.y<k.y||w.y>O.y)continue;if(w.y===k.y){if(w.x===k.x)return!0}else{const b=G*(w.x-k.x)-F*(w.y-k.y);if(b===0)return!0;if(b<0)continue;L=!L}}else{if(w.y!==k.y)continue;if(O.x<=w.x&&w.x<=k.x||k.x<=w.x&&w.x<=O.x)return!0}}return L}const f=n.ShapeUtils.isClockWise,c=this.subPaths;if(c.length===0)return[];let s,d,p;const u=[];if(c.length===1)return d=c[0],p=new v.Shape,p.curves=d.curves,u.push(p),u;let g=!f(c[0].getPoints());g=r?!g:g;const S=[],y=[];let T=[],x=0,_;y[x]=void 0,T[x]=[];for(let w=0,j=c.length;w<j;w++)d=c[w],_=d.getPoints(),s=f(_),s=r?!s:s,s?(!g&&y[x]&&x++,y[x]={s:new v.Shape,p:_},y[x].s.curves=d.curves,g&&x++,T[x]=[]):T[x].push({h:d,p:_[0]});if(!y[0])return l(c);if(y.length>1){let w=!1,j=0;for(let R=0,L=y.length;R<L;R++)S[R]=[];for(let R=0,L=y.length;R<L;R++){const D=T[R];for(let P=0;P<D.length;P++){const k=D[P];let O=!0;for(let F=0;F<y.length;F++)h(k.p,y[F].p)&&(R!==F&&j++,O?(O=!1,S[F].push(k)):w=!0);O&&S[R].push(k)}}j>0&&w===!1&&(T=S)}let A;for(let w=0,j=y.length;w<j;w++){p=y[w].s,u.push(p),A=T[w];for(let R=0,L=A.length;R<L;R++)p.holes.push(A[R].h)}return u}}},{"../../math/Color.js":"gFgcM","./Path.js":"11ocG","./Shape.js":"Rgbrn","../ShapeUtils.js":"6HiLE","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],erqVk:[function(e,N,o){},{}],atg5I:[function(e,N,o){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(o),a.export(o,"OrbitControls",()=>i);var m=e("three");const M={type:"change"},v={type:"start"},n={type:"end"};class i extends m.EventDispatcher{constructor(r,l){super();this.object=r,this.domElement=l,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new m.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:m.MOUSE.ROTATE,MIDDLE:m.MOUSE.DOLLY,RIGHT:m.MOUSE.PAN},this.touches={ONE:m.TOUCH.ROTATE,TWO:m.TOUCH.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return d.phi},this.getAzimuthalAngle=function(){return d.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(J){J.addEventListener("keydown",Ae),this._domElementKeyEvents=J},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ae),this._domElementKeyEvents=null},this.saveState=function(){h.target0.copy(h.target),h.position0.copy(h.object.position),h.zoom0=h.object.zoom},this.reset=function(){h.target.copy(h.target0),h.object.position.copy(h.position0),h.object.zoom=h.zoom0,h.object.updateProjectionMatrix(),h.dispatchEvent(M),h.update(),c=f.NONE},this.update=function(){const J=new m.Vector3,fe=new m.Quaternion().setFromUnitVectors(r.up,new m.Vector3(0,1,0)),Te=fe.clone().invert(),pe=new m.Vector3,Ie=new m.Quaternion,ke=new m.Vector3,De=2*Math.PI;return function(){const Ue=h.object.position;J.copy(Ue).sub(h.target),J.applyQuaternion(fe),d.setFromVector3(J),h.autoRotate&&c===f.NONE&&F(k()),h.enableDamping?(d.theta+=p.theta*h.dampingFactor,d.phi+=p.phi*h.dampingFactor):(d.theta+=p.theta,d.phi+=p.phi);let K=h.minAzimuthAngle,Le=h.maxAzimuthAngle;return isFinite(K)&&isFinite(Le)&&(K<-Math.PI?K+=De:K>Math.PI&&(K-=De),Le<-Math.PI?Le+=De:Le>Math.PI&&(Le-=De),K<=Le?d.theta=Math.max(K,Math.min(Le,d.theta)):d.theta=d.theta>(K+Le)/2?Math.max(K,d.theta):Math.min(Le,d.theta)),d.phi=Math.max(h.minPolarAngle,Math.min(h.maxPolarAngle,d.phi)),d.makeSafe(),d.radius*=u,d.radius=Math.max(h.minDistance,Math.min(h.maxDistance,d.radius)),h.enableDamping===!0?h.target.addScaledVector(g,h.dampingFactor):h.target.add(g),J.setFromSpherical(d),J.applyQuaternion(Te),Ue.copy(h.target).add(J),h.object.lookAt(h.target),h.enableDamping===!0?(p.theta*=1-h.dampingFactor,p.phi*=1-h.dampingFactor,g.multiplyScalar(1-h.dampingFactor)):(p.set(0,0,0),g.set(0,0,0)),u=1,S||pe.distanceToSquared(h.object.position)>s||8*(1-Ie.dot(h.object.quaternion))>s||ke.distanceToSquared(h.target)>0?(h.dispatchEvent(M),pe.copy(h.object.position),Ie.copy(h.object.quaternion),ke.copy(h.target),S=!1,!0):!1}}(),this.dispose=function(){h.domElement.removeEventListener("contextmenu",U),h.domElement.removeEventListener("pointerdown",xe),h.domElement.removeEventListener("pointercancel",Ee),h.domElement.removeEventListener("wheel",Se),h.domElement.removeEventListener("pointermove",we),h.domElement.removeEventListener("pointerup",Ee),h._domElementKeyEvents!==null&&(h._domElementKeyEvents.removeEventListener("keydown",Ae),h._domElementKeyEvents=null)};const h=this,f={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let c=f.NONE;const s=1e-6,d=new m.Spherical,p=new m.Spherical;let u=1;const g=new m.Vector3;let S=!1;const y=new m.Vector2,T=new m.Vector2,x=new m.Vector2,_=new m.Vector2,A=new m.Vector2,w=new m.Vector2,j=new m.Vector2,R=new m.Vector2,L=new m.Vector2,D=[],P={};function k(){return 2*Math.PI/60/60*h.autoRotateSpeed}function O(){return Math.pow(.95,h.zoomSpeed)}function F(J){p.theta-=J}function G(J){p.phi-=J}const b=function(){const J=new m.Vector3;return function(Te,pe){J.setFromMatrixColumn(pe,0),J.multiplyScalar(-Te),g.add(J)}}(),C=function(){const J=new m.Vector3;return function(Te,pe){h.screenSpacePanning===!0?J.setFromMatrixColumn(pe,1):(J.setFromMatrixColumn(pe,0),J.crossVectors(h.object.up,J)),J.multiplyScalar(Te),g.add(J)}}(),I=function(){const J=new m.Vector3;return function(Te,pe){const Ie=h.domElement;if(h.object.isPerspectiveCamera){const ke=h.object.position;J.copy(ke).sub(h.target);let De=J.length();De*=Math.tan(h.object.fov/2*Math.PI/180),b(2*Te*De/Ie.clientHeight,h.object.matrix),C(2*pe*De/Ie.clientHeight,h.object.matrix)}else h.object.isOrthographicCamera?(b(Te*(h.object.right-h.object.left)/h.object.zoom/Ie.clientWidth,h.object.matrix),C(pe*(h.object.top-h.object.bottom)/h.object.zoom/Ie.clientHeight,h.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),h.enablePan=!1)}}();function B(J){h.object.isPerspectiveCamera?u/=J:h.object.isOrthographicCamera?(h.object.zoom=Math.max(h.minZoom,Math.min(h.maxZoom,h.object.zoom*J)),h.object.updateProjectionMatrix(),S=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),h.enableZoom=!1)}function H(J){h.object.isPerspectiveCamera?u*=J:h.object.isOrthographicCamera?(h.object.zoom=Math.max(h.minZoom,Math.min(h.maxZoom,h.object.zoom/J)),h.object.updateProjectionMatrix(),S=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),h.enableZoom=!1)}function X(J){y.set(J.clientX,J.clientY)}function Y(J){j.set(J.clientX,J.clientY)}function Z(J){_.set(J.clientX,J.clientY)}function Q(J){T.set(J.clientX,J.clientY),x.subVectors(T,y).multiplyScalar(h.rotateSpeed);const fe=h.domElement;F(2*Math.PI*x.x/fe.clientHeight),G(2*Math.PI*x.y/fe.clientHeight),y.copy(T),h.update()}function ne(J){R.set(J.clientX,J.clientY),L.subVectors(R,j),L.y>0?B(O()):L.y<0&&H(O()),j.copy(R),h.update()}function ge(J){A.set(J.clientX,J.clientY),w.subVectors(A,_).multiplyScalar(h.panSpeed),I(w.x,w.y),_.copy(A),h.update()}function me(J){J.deltaY<0?H(O()):J.deltaY>0&&B(O()),h.update()}function _e(J){let fe=!1;switch(J.code){case h.keys.UP:J.ctrlKey||J.metaKey||J.shiftKey?G(2*Math.PI*h.rotateSpeed/h.domElement.clientHeight):I(0,h.keyPanSpeed),fe=!0;break;case h.keys.BOTTOM:J.ctrlKey||J.metaKey||J.shiftKey?G(-2*Math.PI*h.rotateSpeed/h.domElement.clientHeight):I(0,-h.keyPanSpeed),fe=!0;break;case h.keys.LEFT:J.ctrlKey||J.metaKey||J.shiftKey?F(2*Math.PI*h.rotateSpeed/h.domElement.clientHeight):I(h.keyPanSpeed,0),fe=!0;break;case h.keys.RIGHT:J.ctrlKey||J.metaKey||J.shiftKey?F(-2*Math.PI*h.rotateSpeed/h.domElement.clientHeight):I(-h.keyPanSpeed,0),fe=!0;break}fe&&(J.preventDefault(),h.update())}function le(){if(D.length===1)y.set(D[0].pageX,D[0].pageY);else{const J=.5*(D[0].pageX+D[1].pageX),fe=.5*(D[0].pageY+D[1].pageY);y.set(J,fe)}}function ee(){if(D.length===1)_.set(D[0].pageX,D[0].pageY);else{const J=.5*(D[0].pageX+D[1].pageX),fe=.5*(D[0].pageY+D[1].pageY);_.set(J,fe)}}function je(){const J=D[0].pageX-D[1].pageX,fe=D[0].pageY-D[1].pageY,Te=Math.sqrt(J*J+fe*fe);j.set(0,Te)}function z(){h.enableZoom&&je(),h.enablePan&&ee()}function $(){h.enableZoom&&je(),h.enableRotate&&le()}function se(J){if(D.length==1)T.set(J.pageX,J.pageY);else{const Te=ue(J),pe=.5*(J.pageX+Te.x),Ie=.5*(J.pageY+Te.y);T.set(pe,Ie)}x.subVectors(T,y).multiplyScalar(h.rotateSpeed);const fe=h.domElement;F(2*Math.PI*x.x/fe.clientHeight),G(2*Math.PI*x.y/fe.clientHeight),y.copy(T)}function ie(J){if(D.length===1)A.set(J.pageX,J.pageY);else{const fe=ue(J),Te=.5*(J.pageX+fe.x),pe=.5*(J.pageY+fe.y);A.set(Te,pe)}w.subVectors(A,_).multiplyScalar(h.panSpeed),I(w.x,w.y),_.copy(A)}function te(J){const fe=ue(J),Te=J.pageX-fe.x,pe=J.pageY-fe.y,Ie=Math.sqrt(Te*Te+pe*pe);R.set(0,Ie),L.set(0,Math.pow(R.y/j.y,h.zoomSpeed)),B(L.y),j.copy(R)}function q(J){h.enableZoom&&te(J),h.enablePan&&ie(J)}function ce(J){h.enableZoom&&te(J),h.enableRotate&&se(J)}function xe(J){h.enabled!==!1&&(D.length===0&&(h.domElement.setPointerCapture(J.pointerId),h.domElement.addEventListener("pointermove",we),h.domElement.addEventListener("pointerup",Ee)),E(J),J.pointerType==="touch"?Ce(J):ae(J))}function we(J){h.enabled!==!1&&(J.pointerType==="touch"?Be(J):be(J))}function Ee(J){V(J),D.length===0&&(h.domElement.releasePointerCapture(J.pointerId),h.domElement.removeEventListener("pointermove",we),h.domElement.removeEventListener("pointerup",Ee)),h.dispatchEvent(n),c=f.NONE}function ae(J){let fe;switch(J.button){case 0:fe=h.mouseButtons.LEFT;break;case 1:fe=h.mouseButtons.MIDDLE;break;case 2:fe=h.mouseButtons.RIGHT;break;default:fe=-1}switch(fe){case m.MOUSE.DOLLY:if(h.enableZoom===!1)return;Y(J),c=f.DOLLY;break;case m.MOUSE.ROTATE:if(J.ctrlKey||J.metaKey||J.shiftKey){if(h.enablePan===!1)return;Z(J),c=f.PAN}else{if(h.enableRotate===!1)return;X(J),c=f.ROTATE}break;case m.MOUSE.PAN:if(J.ctrlKey||J.metaKey||J.shiftKey){if(h.enableRotate===!1)return;X(J),c=f.ROTATE}else{if(h.enablePan===!1)return;Z(J),c=f.PAN}break;default:c=f.NONE}c!==f.NONE&&h.dispatchEvent(v)}function be(J){switch(c){case f.ROTATE:if(h.enableRotate===!1)return;Q(J);break;case f.DOLLY:if(h.enableZoom===!1)return;ne(J);break;case f.PAN:if(h.enablePan===!1)return;ge(J);break}}function Se(J){h.enabled===!1||h.enableZoom===!1||c!==f.NONE||(J.preventDefault(),h.dispatchEvent(v),me(J),h.dispatchEvent(n))}function Ae(J){h.enabled===!1||h.enablePan===!1||_e(J)}function Ce(J){switch(re(J),D.length){case 1:switch(h.touches.ONE){case m.TOUCH.ROTATE:if(h.enableRotate===!1)return;le(),c=f.TOUCH_ROTATE;break;case m.TOUCH.PAN:if(h.enablePan===!1)return;ee(),c=f.TOUCH_PAN;break;default:c=f.NONE}break;case 2:switch(h.touches.TWO){case m.TOUCH.DOLLY_PAN:if(h.enableZoom===!1&&h.enablePan===!1)return;z(),c=f.TOUCH_DOLLY_PAN;break;case m.TOUCH.DOLLY_ROTATE:if(h.enableZoom===!1&&h.enableRotate===!1)return;$(),c=f.TOUCH_DOLLY_ROTATE;break;default:c=f.NONE}break;default:c=f.NONE}c!==f.NONE&&h.dispatchEvent(v)}function Be(J){switch(re(J),c){case f.TOUCH_ROTATE:if(h.enableRotate===!1)return;se(J),h.update();break;case f.TOUCH_PAN:if(h.enablePan===!1)return;ie(J),h.update();break;case f.TOUCH_DOLLY_PAN:if(h.enableZoom===!1&&h.enablePan===!1)return;q(J),h.update();break;case f.TOUCH_DOLLY_ROTATE:if(h.enableZoom===!1&&h.enableRotate===!1)return;ce(J),h.update();break;default:c=f.NONE}}function U(J){h.enabled!==!1&&J.preventDefault()}function E(J){D.push(J)}function V(J){delete P[J.pointerId];for(let fe=0;fe<D.length;fe++)if(D[fe].pointerId==J.pointerId){D.splice(fe,1);return}}function re(J){let fe=P[J.pointerId];fe===void 0&&(fe=new m.Vector2,P[J.pointerId]=fe),fe.set(J.pageX,J.pageY)}function ue(J){const fe=J.pointerId===D[0].pointerId?D[1]:D[0];return P[fe.pointerId]}h.domElement.addEventListener("contextmenu",U),h.domElement.addEventListener("pointerdown",xe),h.domElement.addEventListener("pointercancel",Ee),h.domElement.addEventListener("wheel",Se,{passive:!1}),this.update()}}},{three:"6praL","@parcel/transformer-js/src/esmodule-helpers.js":"14tkN"}],aXOpX:[function(e,N,o){N.exports=e("628ebe2f64cd846d").getBundleURL("9RF07")+e("eeb5f0970ab9438a").resolve("gavAG")},{"628ebe2f64cd846d":"bGZ1f",eeb5f0970ab9438a:"6jNRu"}]},[],null,"parcelRequireaaed")});export default xs();
