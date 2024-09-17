import AbstractDisplay from "./display-abstract"

import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import * as THREE from "three/src/Three.js"
// 	OBJLoader, MTLLoader,
// import { 
// 	FocusShader, BloomPass, ShaderPass, FilmPass, GlitchPass 
// } from 'three-addons'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js'
// import { FocusShader } from 'three/examples/jsm/postprocessing/FocusShader.js'
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

// import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
// import { randomPointsInBufferGeometry } from "three/examples/jsm/utils/GeometryUtils.js"

//- import WebGPU from 'three/addons/capabilities/WebGPU.js'
//- import WebGL from 'three/addons/capabilities/WebGL.js'
//- import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { FaceLandmarker } from "@mediapipe/tasks-vision"

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { SelectiveUnrealBloomPass } from '@visualsource/selective-unrealbloompass'

import {Text, getCaretAtPoint} from 'troika-three-text'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from 'three/examples/jsm/libs/stats.module'

// Assets :
// import FACE_MATERIAL from '/source/assets/actors/ICTFaceModelMaterial.mtl'
import {TRIANGULATION} from '../models/face-mesh-constants.js'
import { FRAGMENT_SHADER, VERTEX_SHADER } from "../display/shaders/3d.js"
import CANONICAL_FACE from "/source/assets/actors/canonical_face_model.fbx"
import FACE_MESH from '/source/assets/actors/generic_neutral_mesh.obj'

// Pick your preferred particle texture
// import PARTICLE_URI from '../assets/particles/particle.png'
// import PARTICLE_URI from '../assets/particles/voxel.png'
//import PARTICLE_URI from '../assets/particles/soft-inverted.png'
import PARTICLE_URI from '../assets/particles/particle.png'

//FIXME
import DATA from '/source/tests/test.face.json'
import { TAU } from "../maths/maths.js"

import { 
	arrangeFaceData,
	preload3dFont,
	createFaceGeometryFromData,
	convertMeshToSimplifiedGeometry
} from '../visual/3d.js'

import { 
	Particle, ParticleTracer
} from "../visual/3d.particles.js"

import FONT from 'raw:../assets/fonts/oxanium/Oxanium.ttf'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.js"

export const DISPLAY_WEB_GL_3D = "DisplayWebGL3D"

// if you want post processing
// import { OverrideMaterialManager } from 'postprocessing'
// OverrideMaterialManager.workaroundEnabled = true

window.THREE = THREE

let stats

export const MAX_COUNT = 1024
export const MAX_WIDTH = 720

export const KEYPOINT_QUANTITY = 478

const VIEW_CONE_ANGLE = TAU / 4
const VIEW_CONE_ANGLE_Z = 0.6

const FACE_SIZE = 0.59 // 0.06
const FACE_OPACITY = 0.1

export const DEFAULT_OPTIONS_DISPLAY_WEBGL = {
	colour:0xff44ee,
	quantity :KEYPOINT_QUANTITY * 3,
	fx:true,
	antialias: true, 
	alpha: true,
	lightColour:0xcccccc,
	lightIntensity: 0.7,
	fog:false,
	showStats:true,
	particeSize:0.03,
	opacity:1,
	mouse:false,
	debug:false
}

// coord for top lip center
const TLC = 61 * 3
const BLC = 308 * 3

/**
 * Three JS Based with Web VR renderer
 * new DisplayWebGL3D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class DisplayWebGL3D extends AbstractDisplay{

	name = DISPLAY_WEB_GL_3D

	camera
	scene
	renderer
	particles
	composer

	controls

	windowHalfX = 0
	windowHalfY = 0

	mouseX = 0
	mouseY = 0

	count = 0

	// stupid this n that
	resizeProxy

	get depth(){
		return 100
	}

	// 0->2	// 0.5 is good, anything more than 1 makes sexy
	set exposure(value){
		//this.renderer.toneMappingExposure = Math.pow( value, 4.0 )
	}

	constructor( canvas, initialWidth, initialHeight, options=DEFAULT_OPTIONS_DISPLAY_WEBGL ){
		console.log("WEBGL Creating Display", { canvas, initialWidth, initialHeight, options} )
		super(canvas, initialWidth, initialHeight, options)
		this.create(options.quantity, options).then( e=>{
			
			// ensure that hte canvas is in the DOM
			if (!canvas)
			{
				document.body.append( this.renderer.domElement)
			}	
		
			console.log("WEBGL Connected and actors intiated", canvas, options, this.particles )
			this.loadComplete("ready")
		})	
	}
	
	// This varies for each display
	setAnimationLoop( callback ){
		return this.renderer.setAnimationLoop(callback)
	}
	cancelAnimationLoop(){
		this.renderer.setAnimationLoop(null)
	}

	createFace(faceMesh, size=0.06 ){

		// enable face mesh
		faceMesh.material.morphtargets = true
		// faceMesh.morphTargetInfluences[0] = 1
		faceMesh.updateMorphTargets()

		// NB. we fade this in
		faceMesh.material.opacity = 0
		faceMesh.material.transparent = true	 
		// faceMesh.material.color.setHex( 0xff0000 )
		faceMesh.material.color.setHSL( 0.5, 0.6, 0.6 )
		faceMesh.scale.set(size,size,size)		 
		// faceMesh.rotation.y = ( this.mouseX * TAU / 2 )
		
		// position in front the camera but behind the particles
		faceMesh.position.z = -10 // -13
		faceMesh.position.y = 0.015

		return new THREE.Box3().setFromObject(faceMesh).getSize(new THREE.Vector3())
	}

	/**
	 * CREATE this Display
	 * @param {Number} keypointQuantity 
	 * @param {Object} options 
	 * @returns 
	 */
	async create( keypointQuantity=478, options={} ){ 

		const scene = new THREE.Scene()
		
		options = {
			...DEFAULT_OPTIONS_DISPLAY_WEBGL,
			...options
		}
		
		// light that illuminates everything
		const ambientLight = new THREE.AmbientLight( options.lightColour, options.lightIntensity )
		scene.add(ambientLight)

		// adding some lights to the scene
		const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
		directionalLight.position.set(0, 1, 2)
		scene.add(directionalLight)
	
		if (options.fog)
		{
			scene.fog = new THREE.FogExp2( 0x000000, 0.001 )
		}

		// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		// directionalLight.position.set(3, 3, 3)
		// scene.add(directionalLight)
		
		const rendererOptions = {
			antialias: true,
			canvas:this.canvas,
			// ...options
		}

		const renderer = new THREE.WebGLRenderer(rendererOptions)
		
		renderer.setPixelRatio(window.devicePixelRatio)

		// renderer.physicallyCorrectLights = true
		// renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMapping = THREE.ReinhardToneMapping
		
		// renderer.toneMappingExposure = 1
		// renderer.shadowMap.enabled = true
		// renderer.shadowMap.type = THREE.PCFSoftShadowMap

		// for model loading we want the correct encoding
		renderer.outputEncoding = THREE.sRGBEncoding
		
		// we can swap this for the orthogonal camera
		// for extra style points
		const camera = new THREE.PerspectiveCamera()
		camera.position.z = 3.5
		camera.lookAt( scene.position )

		const clock = new THREE.Clock()
		
		const {particles, faceMesh, faceGroup, texture} = await this.createParticles(keypointQuantity, options.particeSize, options.colour, options.opacity)
		this.faceMeshSize = this.createFace(faceMesh, FACE_SIZE )

		// Add font and text field
		await preload3dFont(FONT)
		const text = new Text()
		text.textAlign = "left"	// 'left', 'right', 'center', or 'justify'.		
		text.maxWidth = 420		
		// text.position.z = -2
		// text.position.x = -1
		text.position.x = 0
		text.position.y = +0.65
		text.font = FONT
		text.fontSize = 0.05
		text.anchorX = 'center'
		text.anchorY = 'middle'
		text.color = THREE.Color.NAMES.white
		// text.scale.set(0.001)
	 
		scene.add( text )
		scene.add( faceMesh )
		scene.add( particles )

		// for debuggin vectors
		// const tG = new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(), new THREE.Vector3() ])
		// const tM = new THREE.LineBasicMaterial({color: "yellow"})
		// const tracker = new THREE.Line(tG, tM)
		// scene.add(tracker)

		this.scene = scene
		this.renderer = renderer
		this.camera = camera

		this.clock = clock
		// this.tracker = tracker
		this.text = text
		this.particles = particles
		this.faceMesh = faceMesh
		this.faceGroup = faceGroup
		this.texture = texture

		this.ambientLight = ambientLight
		this.directionalLight = directionalLight
			
		this.resizeProxy = this.onWindowResize.bind(this)
		this.onResize( )
		window.addEventListener("resize", this.resizeProxy)

		if (options.mouse)
		{
			this.mouseMoveProxy = this.onPointerMove.bind(this)
			document.body.addEventListener( 'pointermove', this.mouseMoveProxy ) 
		}

		const webcamVideo = document.getElementById("webcam")
		if (webcamVideo) {
			webcamVideo.hidden = true 
		}
		
		if (options.debug)
		{
			this.addDebugElements()
		}
		
		if (options.showStats)
		{
			this.addStats()
		}

		if (options.fx)
		{
			this.addFX()
		}

		this.available = true

		console.info("WEBGL Display START",options, {scene, renderer, camera} ) 

		return true
	}

	/**
	 * DESTROY this Display & free up memory
	 */
	async destroy(){
		
		// stop future loops propogating
		this.cancelAnimationLoop()

		// clean up
		this.scene.remove( this.text )
		this.scene.remove( this.faceMesh )
		this.scene.remove( this.particles )

		this.scene.remove( this.ambientLight )
		this.scene.remove( this.directionalLight )

		window.removeEventListener("resize", this.resizeProxy )
		document.body.removeEventListener( 'pointermove', this.mouseMoveProxy )
	
		// Look into this...
		this.faceMesh.geometry.dispose()
		this.particles.geometry.dispose()
		this.text.geometry.dispose()

		// Materials dispose
		this.faceMesh.material.dispose()
	
		// geometry.dispose()
		// material.dispose()
	
		this.texture.dispose()
		this.renderer.dispose()

		this.faceGroup = null
		this.scene = null
		this.renderer = null
		this.camera = null

		this.clock = null
		this.text = null
		this.particles = null
		this.faceMesh = null
		this.faceGroup = null
		this.texture = null
			
		this.ambientLight = null
		this.directionalLight = null

		// reshow the camera feed
		const webcamVideo = document.getElementById("webcam")
		if (webcamVideo) {
			webcamVideo.hidden = false 
		}

		if (stats)
		{
			this.removeStats()
		}

		this.available = false

		console.info("WEBGL Display END", this ) 
	}

	async addFX(){

		const renderModel = new RenderPass( this.scene, this.camera )
		// const effectBloom = new BloomPass( 0.0000000075 )
		// noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale

		// Bloom! -----------------------------------------------------------------
		const SELECTIVE = false
		let bloomPass
		if (SELECTIVE)
		{
			const ENTIRE_SCENE = 0
			const BLOOM_SCENE = 1

			const BLOOM = BLOOM_SCENE

			// SELECTIVE
			bloomPass = new SelectiveUnrealBloomPass( new THREE.Vector2( this.width, this.height ), 3, 1, 0.01, true, BLOOM, this.scene, this.camera )
					
			this.camera.layers.enable(BLOOM)
			// this.camera.layers.set(BLOOM)

			// create a object to apply bloom to?
			this.particles.layers.set(BLOOM)

		}else{

			// GLOBAL :
			this.camera.layers.enableAll()
			bloomPass = new SelectiveUnrealBloomPass( new THREE.Vector2( this.width, this.height ), 3, 1, 0.01)
		}


		const glitchPass = new GlitchPass()
		glitchPass.uniforms[ 'amount' ].value = 0
		glitchPass.uniforms[ 'angle' ].value = Math.PI
		glitchPass.uniforms[ 'distortion_x' ].value = 0
		glitchPass.uniforms[ 'distortion_y' ].value = 0
		glitchPass.uniforms[ 'seed_x' ].value = THREE.MathUtils.randFloat(-0.01,0.01)
		glitchPass.uniforms[ 'seed_y' ].value = THREE.MathUtils.randFloat(-0.01,0.01)

		const effectFilm = new FilmPass( 0.8, 0.7, 1448, false )
		
		// const effectFocus = new ShaderPass( FocusShader ) 
		// effectFocus.uniforms[ "screenWidth" ].value = this.width
		// effectFocus.uniforms[ "screenHeight" ].value = this.height
		// effectFocus.renderToScreen = true

		// const outputPass = new OutputPass()

		// interesting issue where context is not available immediately
		// for the effect processor so we defer instantiation until a context
		// is available
		//await waitForContext()

		console.info("FX B", this.renderer, this.renderer.domElement,  this.renderer.domElement.context )
	
		bloomPass.renderToScreen = true
		// glitchPass.renderToScreen = true

		// Create our post processing pipeline
		this.composer = new EffectComposer( this.renderer )
		this.composer.addPass( renderModel ) 
		// this.composer.addPass( effectBloom ) 
		this.composer.addPass( bloomPass )
		// this.composer.addPass( effectFilm )
		// this.composer.addPass( glitchPass )
		// this.composer.addPass( effectFocus )
		// this.composer.addPass( outputPass )

		this.bloom = bloomPass
	}

	addLine(geometry, color=0xff0000){
		const lineMaterial = new THREE.LineBasicMaterial( { color } )
		const lines = new THREE.Line( geometry, lineMaterial )
		this.lines = lines
	}

	addVideo( video ){
			
		// create a background video image so we can accurately
		// synch the video to the overlays
		const videoTexture = new THREE.Texture(video)
		videoTexture.minFilter = THREE.LinearFilter


		const videoSprite = new THREE.Sprite(new THREE.MeshBasicMaterial({
			map: videoTexture,
			depthWrite: false,
			// FIXME:
			side: THREE.DoubleSide
		}))
		videoSprite.center.set(0.5, 0.5)
		videoSprite.scale.set(-video.videoWidth, video.videoHeight, 1)
		videoSprite.position.copy(camera.position)
		videoSprite.position.z = 0

		this.scene.add( videoSprite )
		this.videoTexture = videoTexture

		// ensure the camera is in the centre of the video face
		this.camera.position.z = video.videoHeight
		this.camera.position.x = -video.videoWidth / 2
		this.camera.position.y = -video.videoHeight / 2
	}

	addDebugElements(){
		
		const geometry = new THREE.IcosahedronGeometry( 1, 15 )
		for ( let i = 0; i < 50; ++i ) 
		{
			const color = new THREE.Color()
			color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 )

			const material = new THREE.MeshBasicMaterial( { color: color } )
			const sphere = new THREE.Mesh( geometry, material )
			sphere.position.x = Math.random() * 10 - 5
			sphere.position.y = Math.random() * 10 - 5
			sphere.position.z = Math.random() * 10 - 5
			sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 )
			sphere.scale.setScalar( Math.random() * Math.random() + 0.5 )
			this.scene.add( sphere )
		}
	}

	addControls(){
		const controls = new OrbitControls( this.camera, this.canvas)
		controls.target.set(0, 0, 0)
		controls.enableDamping = true
		controls.update()
		this.controls
	}

	addStats(){
		if (!stats)
		{
			stats = new Stats()
		}
		if (!document.getElementById("#realtime-statistics"))
		{
			const element = document.body.appendChild(stats.dom)
			element.id="realtime-statistics"
		}
	}

	removeStats(){
		if (stats)
		{
			document.body.removeChild(stats.dom)
		}
	}

	// Update the voxel positions with respect to the inverted matrix
	arrangeParticles( data, scaleFactor=1, centralise=false)  {

		let count = 0
		const { keypoints, facialTransformationMatrixes, box } = data

		// Rescale the object to normalized space
		const box3 = new THREE.Box3().setFromObject( this.particles )
		const size = box3.getSize(new THREE.Vector3())
		// const center = box3.getCenter(new THREE.Vector3())
		//const zoomLevel = Math.min( this.faceMeshSize.x / size.x, this.faceMeshSize.y / size.y, this.faceMeshSize.z / size.z )
		const zoomLevel =  1.33 + this.faceMeshSize.x / size.x + this.faceMeshSize.y / size.y + this.faceMeshSize.z / size.z
		const zoom = zoomLevel // 4.5
		
		const positions = this.particles.geometry.attributes.position.array
		const scales = this.particles.geometry.attributes.scale.array
		const particleClasses = this.particles.geometry.userData.particles
		
		arrangeFaceData( keypoints, positions, scales, zoom * scaleFactor )
		
		// now make one go for a walk!
		let i = 0
		let particleClass = particleClasses[i]
		while (particleClass.next)
		{
			// do action 
			// const particlePosition = 
			// if ( i > KEYPOINT_QUANTITY) 
				particleClass.update()
			// if ( i > KEYPOINT_QUANTITY && i % 9 === 0)
			if ( i === 0 )
			{
				positions[i+0] = particleClass.x
				positions[i+1] = particleClass.y
				positions[i+2] = particleClass.z				
			}
			// set pointer
			particleClass = particleClass.next
			i++
		}

		/*
		particleClasses.forEach( (particle, i) => {
			const particlePosition = particle.update()
			if ( i > KEYPOINT_QUANTITY && i % 6 === 0)
			{
				positions[i+0] = particle.x
				positions[i+1] = particle.y
				positions[i+2] = particle.z				
			}

			// if (isNaN( particle.x) || isNaN( particle.y) || isNaN( particle.z) ){
			// 	// console.error("particle", {particle, particlePosition}, particle.x, particle.y, particle.z )
			// }
			// console.log("particle", i, particle.x, particle.y, particle.z )
		})
		*/

		if( this.extraVisualMode)
		{
			// extra visual stuff! like post process!
		}


		// console.log("particleClasses", { particlePosition, positions })

		//const {x,y,z} = particle.setPosition(0,0,0)
		
		// then set the particle itself?
		//const {x,y,z, remaining} = particle.update( this.clock.getDelat() )
		//const {x,y,z, remaining} = particle.update( this.clock.getDelat() )
		//const particlePosiition = particle.update()
		//particlePosiition.x
		// remaining
		

		// console.log("updateVoxels", {zoom, zoomLevel, particle, particlePosition} )
		// console.log("updateVoxels", zoom, zoomLevel, positions,{size, faceMeshSize, positionMatrix, positionVector, scaleVector} )//, {facialTransformationMatrixes, faceMeshSize,keypoints, matrix}, {positionVector, positionMatrix, rotationMatrix, scaleVector} ) 
		if (centralise)
		{
			this.particles.geometry.center()
		}
		this.particles.geometry.attributes.position.needsUpdate = true
		this.particles.geometry.attributes.scale.needsUpdate = true

		// console.info("arrangeParticles", this.particles.geometry.attributes.position)
		return data
	}

	/**
	* Create Particles and layout in a 2d grid
	* @param {Number} quantity 
	*/
	async createParticles ( quantity=478, size=0.01, color=0xefefef88, opacity=1 ) { 

		return new Promise((resolve,reject) => {
			const loader = new THREE.TextureLoader()
			loader.colorSpace = THREE.SRGBColorSpace
			loader.load( PARTICLE_URI, (texture)=>{

				const uniforms = {
					diffuseTexture: {
						value: new THREE.TextureLoader().load('./resources/fire.png')
					},
					pointMultiplier: {
						value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
					}
				}

				const materialOptions = { 
				
					// uniforms,
					// vertexShader: VERTEX_SHADER,
					// fragmentShader: FRAGMENT_SHADER,
					
					map: texture, 
					color,
					size,
					blending: THREE.AdditiveBlending,
					sizeAttenuation: true,

					
					transparent : true,  
					opacity,
					depthTest: true,
					
					// depthWrite: false,
					// vertexColors: true
				}

				const particlesMaterial = new THREE.PointsMaterial(materialOptions)
		
				// Load in our canonical face
				const fbxLoader = new FBXLoader()
				fbxLoader.load( CANONICAL_FACE, ( faceGroup ) => {
					// Attributes added to the 2d geometry
					const faceMesh = faceGroup.children[0]
					const particlesGeometry = faceMesh ? 
												faceMesh.geometry : 
												new THREE.SphereGeometry(1, 32, 32)

					console.info("face material", faceMesh.geometry , { CANONICAL_FACE, particlesGeometry,faceMesh, faceGroup } )
			
					// Get uniformly distributed random points in mesh
					// 	- create array with cumulative sums of face areas
					//  - pick random number from 0 to total area
					//  - find corresponding place in area array by binary search
					//	- get random point in face
					// const randomPoints = GeometryUtils.randomPointsInGeometry( new THREE.SphereGeometry(1, 32, 32) )
					// const randomPoints = GeometryUtils.randomPointsInGeometry( faceMesh )
					//const randomBufferPoints = GeometryUtils.randomPointsInBufferGeometry( geometry, 3 )

					const data = DATA[0+'']
					const { keypoints, facialTransformationMatrixes, box } = data
					const liveFaceGeometry = createFaceGeometryFromData(keypoints, quantity, 1,  )
					const tracerParticles = liveFaceGeometry.userData.particles 
					const positions = liveFaceGeometry.attributes.position.array 
					// const freeRadicals = 
					// assign all particles  that arent original positions to be free radicasls
					// tracerParticles.forEach( (tracerParticle,i)=>{
					// 	if (i>KEYPOINT_QUANTITY)
					// 	{
					// 		tracerParticle.isFreeRadical = true
					// 	}
					// })

					// Model from mesh model
					const faceGeom = convertMeshToSimplifiedGeometry(particlesGeometry, quantity)

					const geometry = liveFaceGeometry

					console.info("geometries", geometry, {faceMesh, faceGroup, particlesGeometry, faceGeom, faceGeometry: liveFaceGeometry} )
		
					const particles = new THREE.Points(geometry, particlesMaterial)
					

					// particles.position.z = 3facialTransformationMatrixes

					console.log("Particles", {particles, geometry})
					resolve({particles, faceMesh, faceGroup, texture})
				} )

			}, error => {

				console.error("Couldn't load particle", error) 
				reject("Couldn't load particle "+error )
			})
		})
	}

	/**
	 * Empty the scene and paint it transparent
	 */
	clear() {
		// this.scene.clear()
	}

	/**
	 * draw a text field on the screen in postiion x,y
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {String} text 
	 * @param {Number} color 
	 * @param {String} align 
	 * @param {String} font 
	 * @param {Boolean} invertColours 
	 */
	drawText( x, y, text, color, align, font, invertColours ){
		if (this.text && text)
		{
			// console.error(text)

			// Set properties to configure:
			this.text.text = text

			if (color)
			{
				// invertColours
				text.color = color
			}

			if (align)
			{
				this.text.textAlign = align
			}

			/*
			if (x)
			{
				this.text.offsetX = x
			}

			if (y)
			{
				this.text.offsetY = y
			}
			*/

			// console.info("Text", {text, color, c:this.text.color, align, font, invertColours})

			// Update the rendering:
			this.text.sync()
		}
	}

	// FIXME:
	drawParagraph(x, y,  paragraph, size, lineHeight, invertColours  ){
		this.drawText(x, y, paragraph, undefined, undefined, undefined, invertColours)
	}


	/**
	 * Paints an existing element onto our display
	 * Used to paint a video frame to the canvas
	 * @param {HTMLElement} element - video / image
	 * @param {Number} x - default to 0
	 * @param {Number} y - default to 0
	 * @param {Boolean} flip - default to true
	 */
	drawElement( element, x=0, y=0, flip=true){	
		
	}

	
	/**
	 * Move the previously created particles into the postions
	 * specified in the data
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours, options=DEFAULT_OPTIONS_DISPLAY_WEBGL ){

		if (this.available === false)
		{
			return
		}

		const prediction = person.data
		// const landmarks = prediction.faceLandmarks
		// const options = person.options
		const hue = person.hue
		// const elapsed = person.now

		if ( this.faceMesh &&  this.faceMesh.material )
		{
			// fade the face mesh in
			const faceMeshOpacity = this.faceMesh.material.opacity 
			if ( faceMeshOpacity < FACE_OPACITY ){
				this.faceMesh.material.opacity += ( FACE_OPACITY - faceMeshOpacity ) * 0.5
			}
		}else{
			// ERROR
			console.error("Face Mesh not available", this )
		}
	

		// Person drawn to screen
		// let's position our face button
		if (this.count%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		{
			this.movePersonButton(person, prediction)
		}
		
		this.particles.rotation.x = ( this.mouseY * VIEW_CONE_ANGLE ) + Math.PI
		this.particles.rotation.y = -( this.mouseX * VIEW_CONE_ANGLE ) //+ Math.PI // + TAU		 
		// this.particles.rotation.y += 0.01
		
		// rotate face mesh
		this.faceMesh.rotation.x = prediction.pitch + ( this.mouseY * VIEW_CONE_ANGLE ) - 0.3
		this.faceMesh.rotation.y = prediction.yaw + ( this.mouseX * VIEW_CONE_ANGLE )	
		this.faceMesh.rotation.z = prediction.roll * VIEW_CONE_ANGLE_Z
		
		// console.info("drawPerson", person, prediction )
		this.arrangeParticles( prediction, 1) 

		this.particles.material.color.setHSL( Math.abs(hue/360),0.6, 0.6 ) 
		this.faceMesh.material.color.setHSL( this.mouseX, this.count%1, Math.min( 1, this.mouseY / 2 + 0.5) ) 

		// if singing project some bubbles out of the mouth!
		if (prediction.isMouthOpen)
		{
			// const C = new Three.Vector3()
			// C.lerpVectors(A, B, a)
			const points = this.particles.geometry.attributes.position.array
			const pointQuantity = points.length
			const voxels = this.particles.geometry.userData.particles
			const lastVoxelIndex = voxels.length-1
			const headCenterPoint = new THREE.Vector3()
			const mouthCenterPoint = new THREE.Vector3()
			
			const topLipCenter = new THREE.Vector3( points[TLC], points[TLC+1], points[TLC+2] ) 
			const bottomLipCenter = new THREE.Vector3( points[BLC], points[BLC+1], points[BLC+2] ) 
			
			const rightHeadMidPoint = new THREE.Vector3( points[TLC], points[TLC+1], points[TLC+2] ) 
			const leftHeadMidPoint = new THREE.Vector3( points[BLC], points[BLC+1], points[BLC+2] ) 
			
			mouthCenterPoint.addVectors( topLipCenter, bottomLipCenter ).divideScalar( 2 )
			headCenterPoint.addVectors( leftHeadMidPoint, rightHeadMidPoint ).divideScalar( 2 )
			//.midpoint.lerpVectors(topLipCenter, bottomLipCenter, 0.5 )

			const spitRate = prediction.mouthRatio * 10 ?? 0.01
			const c = Math.round(this.count * spitRate)%lastVoxelIndex

			// discover the throat point behind the mouth where sound is generaated from
			const throatPoint = mouthCenterPoint.clone()
			throatPoint.z -= 0.5
			throatPoint.y -= 0.0001
	
			// this.tracker.geometry.attributes.position.setXYZ(0, throatPoint.x, throatPoint.y, throatPoint.z)
			// this.tracker.geometry.attributes.position.setXYZ(1, mouthCenterPoint.x, mouthCenterPoint.y, mouthCenterPoint.z)
			// this.tracker.geometry.attributes.position.needsUpdate = true
		  
			// // rotate like face mesh
			// this.tracker.rotation.x = prediction.pitch + ( this.mouseY * VIEW_CONE_ANGLE ) - 0.3
			// this.tracker.rotation.y = prediction.yaw + ( this.mouseX * VIEW_CONE_ANGLE )	
			// this.tracker.rotation.z = prediction.roll * VIEW_CONE_ANGLE_Z
			
			// const direction = new THREE.Vector3().subVectors( midpoint,throatPoint ).normalize() // direction from A to B is a normalized vector

			// const Aext = A.clone().addScaledVector(direction, -extend_val)
			// const Bext = B.clone().addScaledVector(direction, extend_val)
		
			for (let i=0; i<3; ++i)
			{
				const offset = i * 6
				const pointIndex = pointQuantity - offset
				const voxel = voxels[lastVoxelIndex - offset]
				
				const percent = 1 - (( prediction.mouthRatio + i * 0.1 * this.count * 0.05) % 1)
				const distanceToProject = throatPoint.distanceTo(mouthCenterPoint) * percent // + 0.5
				const endPoint = (new THREE.Vector3()).subVectors(mouthCenterPoint, throatPoint).normalize().multiplyScalar(distanceToProject).add(throatPoint)
			
				// voxel.setPosition( midpoint.x, midpoint.y, midpoint.z, true )
				voxel.setPosition( endPoint.x, endPoint.y, endPoint.z, false )
				voxel.update()
	
				// find point at back of throat...
				// points[ points.length-9 ] = throatPoint.x
				// points[ points.length-8 ] = throatPoint.y
				// points[ points.length-7 ] = throatPoint.z

				// find projected point at the front.
				points[ pointIndex-6 ] = endPoint.x
				points[ pointIndex-5 ] = endPoint.y
				points[ pointIndex-4 ] = endPoint.z

				// find point at back of throat...
				points[ pointIndex-3 ] = voxel.x
				points[ pointIndex-2 ] = voxel.y
				points[ pointIndex-1 ] = voxel.z

			}

			// points[ points.length-3 ] = midpoint.x
			// points[ points.length-2 ] = midpoint.y
			// points[ points.length-1 ] = midpoint.z
			// console.info("mouth", mouthCenterPoint, {topLipCenter, bottomLipCenter} )
		}

		
		return

		// now copy the particle locations to the face mesh
		// this.faceMesh.geometry.attributes.position.array.set( this.particles.geometry.attributes.position.array )

		// Colours stay white whilst no note then morphs to the correct note when 
		
		if (this.bloom){
			// this.bloom.threshold = params.threshold
			// this.bloom.strength = params.strength
			this.bloom.radius = prediction.mouthRatio
		}
		
		// if (person.singing)
		if (prediction.isMouthOpen)
		{
			if (person.instrumentLoading)
			{
				this.faceMesh.material.color.setHSL( this.mouseX, this.count%1, Math.min( 1, this.mouseY * 0.5 + 0.5)  ) 
				// TODO: improve

			} else if (person.isMouthOpen){
				
				// TODO: tie this into amplitude?
				// this.exposure = 0.3 +  prediction.mouthRatio * 0.5

				this.particles.material.color.setHSL( hue, 0.7, 0.9 ) 
				this.faceMesh.material.color.setHSL( hue, 0.5, Math.min( 1, this.mouseY / 2 + 0.5)  ) 
			
			}else{

				// this.exposure = 0.4 // + this.count % 1.3

				this.particles.material.color.setHSL( hue, 0.6, 0.9 ) 
				this.faceMesh.material.color.setHSL( this.mouseX, this.count%1, Math.min( 1, this.mouseY * 0.5 + 0.5)  ) 
			}
		
		}else{

			// TODO: tie this into amplitude?
			// this.exposure = 1 // + this.count % 1.3

			// this.faceMesh.material.color.setHSL( mouseX, 1-this.count%1, Math.min( 1, mouseY / 2 + 0.5) ) 
			this.faceMesh.material.color.setHSL( this.mouseX, 1, 1 ) 
			this.particles.material.color.setHSL( hue, 1, 1 ) 
		}

		console.info(hue,"drawPerson", person, prediction )

		return

		/*
		
		if (person.isMouthOpen)
		{
			
			landmarks.forEach((landmark, index) => {

				// reposition to landmark location
				const particle = this.particles[index]
				
				particle.material.color.set(person.hsl)

				particle.position.x = ((1-landmark.x) - 0.5) * this.width 
				particle.position.y = (landmark.y - 0.5) * -this.height
				particle.position.z = landmark.z * this.depth
			})
console.log("particle", person.hsl, landmarks[0], landmarks[0].material )
		}else{

			this.particles.forEach( (particle, index) => {

				// particle.position.x = landmark.x 
				// particle.position.y = landmark.y 
				// particle.position.z = landmark.z // * this.depth

				particle.position.y = Math.cos( (elapsed + (particle.position.x /this.width ) + (particle.position.z /this.width ) ) * wavespeed ) * this.depth   
			})
	
		}
		*/
		
		
		// console.log("particles", this.particles)

		// FIXME:
		// if (person.isMouseDown)
		// {
		// 	drawMousePressure( person.mouseHoldProgress, options.mouseHoldDuration )
		// }

		// NB. assumes screen has been previously cleared
		if (options.drawMask)
		{
			// we go from nodes to mesh if mouth active...
			if (!options.drawNodes && !options.drawMesh && options.meshOnSing)
			{
				// this.isMouthOpen = true
				if (person.singing)
				{
					if (person.instrumentLoading)
					{
						FaceLandmarker.FACE_LANDMARKS_TESSELATION

					} else if(person.isMouthOpen) {

						FaceLandmarker.FACE_LANDMARKS_TESSELATION
					}

				}else{
  
					FaceLandmarker.FACE_LANDMARKS_FACE_OVAL
					// default mode is always blobs
					// drawPoints( prediction, colours, 3, person.instrumentLoading, this.debug )
				}

			} else if (options.drawNodes) {

				// just blobs
				// drawPoints( prediction, colours, 3, person.instrumentLoading, this.debug )
				FaceLandmarker.FACE_LANDMARKS_FACE_OVAL
			
			} else if (options.drawMesh) {

				FaceLandmarker.FACE_LANDMARKS_TESSELATION

			}
		}

	
		// drawBoundingBox( boundingBox )

		//console.error("Bounding box", {boundingBox} )

		//const { height,width,xMax,xMin,yMax,yMin} = boundingBox

		// if this is mirrored using the option in the TF model...
		

		// now overlay the mouth
		if (options.drawMouth)
		{	
			const mouthColours = {
				h:hue,
				s:options.saturation, 
				l:options.luminosity,
				a:1
			}

			const mouthColoursClosed = {
				h:hue,
				s:options.saturation, 
				l:20,
				a:1
			}

			const lipColours = {
				h:90,
				s:50, 
				l:50,
				a:1
			}

			// This overlays the mouth and the eyes
			if (person.isMouthOpen && person.singing)
			{
				// Inner
				// drawLip( annotations.innerLip, lipColours, mouthColours )
				
				FaceLandmarker.FACE_LANDMARKS_LIPS
				
			}else{

				// Outer
				// drawLip( annotations.outerLip, lipColours, mouthColoursClosed )
				FaceLandmarker.FACE_LANDMARKS_LIPS
				// mouth closed or not singing
				// drawLip(prediction.annotations.lips, mouthColoursClosed, 1, 9)
			}
		}

		// draw silhoette if the user is 
		// if you want it to flicker...
		// interacting&& this.counter%2 === 0)
	
		// EYES ===================================================================
		
		// eyes have been closed for X -period of time
		if (person.areEyesClosed)
		{
	

		}else if (options.drawEyes){

			const eyeOptions = {
				// colourful part of the eye
				iris:options.leftEyeIris, 
				// size of the colourful part
				irisRadius:options.irisRadius,
				// holes in the eyes
				pupil:'rgba(0,0,0,0.8)', 
				// size of the hole
				pupilRadius:options.pupilRadius,
				// big white bit of the eyed
				sclera:'white',
				// size of the white bit
				scleraRadius:options.scleraRadius,
				ratio:options.eyeRatio
			}

		}
		
		if (options.drawEyebrows){
		
			// FIXME: draw some funky eyebrows!
			FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW
			FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW
			
		}else{
			// default fails
		}
	}
	
	/**
	 * Overwrite the existing canvas with the same one but
	 * positioned at a specific offset to make it look cool
	 * @param {Number} offsetX 
	 * @param {Number} offsetY 
	 */
	overdraw( offsetX=0, offsetY=-1) {
		
		// this.canvasContext.save()
		
		//this.canvasContext.translate(0, -1)
		//this.canvasContext.drawImage( this.canvas,offsetX,offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }

		// this.canvasContext.restore()
	}

	// TODO:
	postProcess( options ){

	}
	/**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){
		// TODO: reassemble canvas with logo and stuff?
		return this.canvas.toDataURL(type)
	}
	
	/**
	 * LOOP
	 */
	render(){
		// we want to face to look at the cursor

		// particle cloud
	
		// move face mesh into position behind the particles
		// this.faceMesh.rotation.x = ( mouseY * angle )
		// this.faceMesh.rotation.y = ( mouseX * angle )	
		// this.faceMesh.rotation.z = 0
		// faceMesh.rotation.y += 0.01

		// if we want the camera to alter the scene instead		
		// camera.position.x += ( mouseX - camera.position.x ) * 0.0005
		// camera.position.y += ( - mouseY - camera.position.y ) * 0.0005


		// if there is a video texture, update the image
		if (this.videoTexture)
		{
			 this.videoTexture.needsUpdate = true
		}

		if (this.composer)
		{
			this.composer.render()
		}else if (this.renderer){
			this.renderer.render( this.scene, this.camera )	
		}
		
		this.count = (this.count + 1 ) % MAX_COUNT
		// console.log("updating three scene", this.particles.position, this)
		super.render()
	}
	
	onRender(){
		this.controls && this.controls.update()
		// move camera in accordance to mouse
		if (stats)
		{
			stats.update()
		}
		// console.info("Rendering", this.particles.position, this.faceMesh.rotation, this.camera.position)
	}

	/**
	 * EVENT : User has interacted with the mouse whilst over this component
	 * @param {*} event 
	 * @returns 
	 */
	
	onPointerMove(event){
		if ( !event || event.isPrimary === false ) return
		this.mouseX = ( event.clientX - this.windowHalfX ) / this.windowHalfX 
		this.mouseY = ( event.clientY - this.windowHalfY ) / this.windowHalfY
		// this.exposure = this.mouseX * 2 + 0.5
		//console.info("pointer move", event.clientX,  event.clientY, this.windowHalfX, this.windowHalfY, this.mouseX, this.mouseY )
	}


	resizeRendererToDisplaySize( maxWidth, maxHeight) {
		const canvas = this.renderer.domElement
		const pixelRatio = window.devicePixelRatio
		const width  = Math.min( maxWidth, Math.floor( canvas.clientWidth * pixelRatio ) )
		const height = Math.min( maxHeight, Math.floor( canvas.clientHeight * pixelRatio ) )
		const needResize = canvas.width !==  width || canvas.height !== height
		if (needResize) 
		{
		 	this.renderer.setSize(width, height, false)
		  	console.info("WEBGL Resized", {width, height, MAX_WIDTH, pixelRatio} )
		}
		return needResize
	}

	/**
	 * EVENT : The canvas has been resized
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	onResize(width, height){

		width = width ?? window.innerWidth
		height = height ?? window.innerHeight

		// ensure we have max sizes setup otherwise GPU will die!
		const aspectRatio = width / height
		if (width > MAX_WIDTH)
		{
			width = MAX_WIDTH
			height = width / aspectRatio
		}

		this.windowHalfX = window.innerWidth * 0.5
		this.windowHalfY = window.innerHeight * 0.5

		// set the canvas size to the size of the Looking Glass Portrait
		const hasResized = this.resizeRendererToDisplaySize(width, height)

		if (this.composer)
		{
			this.composer.setSize( width, height )
		}
		
		this.camera.aspect = aspectRatio
		this.camera.updateProjectionMatrix()
	}

	/**
	 * EVENT: Triggered by the window being resized
	 * either by scaling the app or via device rotation
	 * @param {Event} event 
	 */
	onWindowResize(event){
		this.onResize()
	}
}