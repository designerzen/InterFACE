/**
 * Collection of detected/tracked faces, where each face is represented as a list of 468 face landmarks and each landmark is composed of x, y and z. x and y are normalized to [0.0, 1.0] by the image width and height respectively. z represents the landmark depth with the depth at center of the head being the origin, and the smaller the value the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.
 */

import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import * as THREE from "three/src/Three.js"
window.THREE = THREE

// import { OBJLoader, MTLLoader } from 'three-addons'
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
// import { randomPointsInBufferGeometry } from "three/examples/jsm/utils/GeometryUtils.js"
// import "three-addons/node_modules/three/examples/js/utils/GeometryUtils.js"
// node_modules\three-addons\node_modules\three\examples\js\utils\GeometryUtils.js
import {WebGPU, WebGL} from 'three-addons' 
// import WebGPU from 'three/addons/capabilities/WebGPU.js'
// import WebGL from 'three/addons/capabilities/WebGL.js'
//- import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import PARTICLE_URI from '../assets/particles/particle.png'
import FACE_MATERIAL from '../assets/actors/ICTFaceModelMaterial.mtl'
import {TRIANGULATION} from '../models/face-mesh-constants.js'
import { FRAGMENT_SHADER, VERTEX_SHADER } from "../display/shaders/3d.js"
import CANONICAL_FACE from "../assets/actors/canonical_face_model.fbx"
import FACE_MESH from '../assets/actors/generic_neutral_mesh.obj'
import Stats from 'three/examples/jsm/libs/stats.module'

import { GeometryUtils } from "../display/display-looking-glass-3d.js"
import { preload3dFont } from "../visual/3d.js"
import {Text, getCaretAtPoint} from 'troika-three-text'

import FONT from 'raw:../assets/fonts/oxanium/Oxanium.ttf'

import DATA_SOURCE from 'url:/source/tests/test.face.json'

let DATA
let DATA_KEYS 

// Settings
const TAU = Math.PI / 2
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 72

const createScene = (canvas, useHologram=true) => {

	if (useHologram)
	{
		const config = LookingGlassConfig
		config.tileHeight = 512
		config.numViews = 45
		config.targetY = 0
		config.targetZ = 0
		config.targetDiam = 3
		config.fovy = (12 * Math.PI) / 180

		new LookingGlassWebXRPolyfill()	
	}
	
	const scene = new THREE.Scene()	
	scene.add(new THREE.AmbientLight(0xaaaaaa))
	// scene.fog = new THREE.FogExp2( 0x000000, 0.001 )
	
	// const directionalLight = new THREE.DirectionalLight(0xffffff)
	// directionalLight.position.set(3, 3, 3)
	// scene.add(directionalLight)

		
	//- const cube = new THREE.Mesh(
	//- 	new THREE.BoxGeometry(2, 0.1, 0.1),
	//- 	new THREE.MeshStandardMaterial({ color: "red" })
	//- )
	//- scene.add(cube)

	const rendererOptions = {
		antialias: true,
		canvas
	}

	//- const renderer = new WebGPURenderer( rendererOptions )
	const renderer = new THREE.WebGLRenderer(rendererOptions)
	 
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT )
	// renderer.setSize( window.innerWidth, window.innerHeight )
	renderer.xr.enabled = true
	// for model loading we want the correct encoding
	renderer.outputEncoding = THREE.sRGBEncoding
	
	if (!canvas)
	{
		document.body.append(renderer.domElement)
	}
	
	const camera = new THREE.PerspectiveCamera()
	// const camera = new THREE.OrthographicCamera(1, 1, 1, 1, -1000, 1000)
	camera.position.z = 1.5
	camera.lookAt( scene.position )

	const stats = new Stats()

	return {
		scene,
		renderer,
		camera,
		stats
	}
}

const convertMeshToSimplifiedGeometry = (particlesGeometry, quantity, scaleFactor = 1/20) => {
	
	const positions = new Float32Array( quantity * 3 )
	const scales = new Float32Array( quantity )
			
	// here we choose the base for copying the positions from
	const particlePositions = particlesGeometry.attributes.position.array

	const length = Math.min( quantity, particlePositions.length ) 

	for (let i=0; i < length; i+=3)
	{
		const p = i % (particlePositions.length - 1)
		
		const x = particlePositions[ particlePositions.length - 1 - p ] * scaleFactor ?? (Math.random() * 2 - 1) 
		const y = particlePositions[ particlePositions.length - 2 - p ] * scaleFactor ?? (Math.random() * 2 - 1) 
		const z = particlePositions[ particlePositions.length - 3 - p ] * scaleFactor ?? (Math.random() * 2 - 1) 
						
		positions[i] = x
		positions[i+1] = y
		positions[i+2] = z

		scales[i] =  1
		scales[i+1] = 1
		scales[i+2] = 1
		// console.info(i, "Position",{x,y,z})
	}
	
	// Add layers for holding scale and position data (optional)		
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'scale', new THREE.Float32BufferAttribute( scales, 1 ) )
	return geometry
}


// For live data :
// NB. we need to ensure we dots are rotated to the same plane as the face
const createFaceGeometryFromData = (keypointData, quantity, scaleFactor = 1) => {

	const positions = new Float32Array( quantity * 3 )
	const scales = new Float32Array( quantity )
	let count = 0

	// pitch, roll, yaw

	for (let i=0; i<quantity;++i)
	{
		const p = i % (keypointData.length - 1)
	
		const particlePosition = keypointData[ p ]

		// const position = new THREE.Vector3( particlePosition.x, particlePosition.y, particlePosition.z )
		// position.applyMatrix4( matrix )

		positions[count] = particlePosition.x * scaleFactor
		positions[count+1] = particlePosition.y * scaleFactor
		positions[count+2] = particlePosition.z * scaleFactor

		scales[i] = 1 
		
		count += 3
	}

	// Add layers for holding scale and position data (optional)		
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'scale', new THREE.Float32BufferAttribute( scales, 1 ) )
	return geometry
}


/**
* Create Particles and layout in a 2d grid
* @param {Number} quantity 
*/
const createParticles = async ( quantity=478, size=0.01, color=0xefefef88, opacity=1  ) => {

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
				// transparent : true, 

				// opacity, 
				color,
				size,
				blending: THREE.AdditiveBlending,
				sizeAttenuation: true,
				
				// depthTest: true,
				// depthWrite: false,
				// vertexColors: true
			}

			const particlesMaterial = new THREE.PointsMaterial(materialOptions)
	
			// const mtlLoader = new MTLLoader()
			// mtlLoader.load( FACE_MATERIAL, ( mtl ) => {
			// 	mtl.preload()			
			// } )

			// Load in our canonical face
			// const objLoader = new OBJLoader()
			const objLoader = new FBXLoader()
			// objLoader.setMaterials( mtl )
			objLoader.load( CANONICAL_FACE, ( faceGroup ) => {
				// Attributes added to the 2d geometry
				const faceMesh = faceGroup.children[0]
				const particlesGeometry = faceMesh ? 
											faceMesh.geometry : 
											new THREE.SphereGeometry(1, 32, 32)

				console.info("face material",{ CANONICAL_FACE, particlesGeometry,faceMesh, faceGroup } )
		
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
				const liveFaceGeometry = createFaceGeometryFromData(keypoints, quantity)

				// Model from mesh model
				const faceGeom = convertMeshToSimplifiedGeometry(particlesGeometry, quantity)
			

				const geometry = liveFaceGeometry

				console.info("geometries", geometry, {faceMesh, faceGroup, particlesGeometry, faceGeom, faceGeometry: liveFaceGeometry} )
	
				const particles = new THREE.Points(geometry, particlesMaterial)
				// particles.position.z = 3facialTransformationMatrixes

				/*
				facialTransformationMatrixes.transpose

				// resize the points based on the box
				// use the matrix to REVERT THE TRANSFORMATION
				const matrix = new THREE.Matrix4( ...facialTransformationMatrixes.data )
				// matrix.set( ...facialTransformationMatrixes.data )
				// const eye = matrix.identity()
				const inverse = matrix.invert()
				*/

				
				console.log("Particles", {particles, geometry})
				resolve({particles, faceMesh, faceGroup})
			} )

		}, error => {

			console.error("Couldn't load particle", error) 
			reject("Couldn't load particle "+error )
		})
	})
}

export const createXRToggleButton = (renderer, destination) => {
		// adapt VRButton styles!
	const openXRButton = VRButton.createButton(renderer)
	openXRButton.style = ""
	openXRButton.setAttribute("type","button")
	destination.append(openXRButton)
}


async function init(){
	
	const request = await fetch(DATA_SOURCE)
	const response = await request.json()

	DATA = response
	DATA_KEYS = Object.keys( DATA )
	

	const COLOUR = 0xdd44ff

	let windowHalfX = window.innerWidth / 2
	let windowHalfY = window.innerHeight / 2
	let mouseX = windowHalfX
	let mouseY = windowHalfY

	// amount of voxels
	const quantity = 478 //* 3

	const {
		scene, renderer, camera, stats
	} = createScene( document.querySelector("canvas"))

	const { 
		particles, faceMesh, faceGroup 
	} = await createParticles( quantity, 0.03, COLOUR, 0.8 )

	createXRToggleButton( renderer, document.getElementById("shared-controls") )


	// Add font and text field
	await preload3dFont(FONT)
	const text = new Text()
	text.textAlign = "left"	// 'left', 'right', 'center', or 'justify'.		
	text.maxWidth = 420		
	// text.position.z = -2
	text.position.x = 0
	console.info("text", {text})

	scene.add( text )
	

	const attributes = particles.geometry.attributes
	const positions = attributes.position.array
	const scales = attributes.scale.array
	const root = Math.floor(Math.sqrt(quantity))
	const AMOUNTX = root
	const AMOUNTY = root

	// enable face mesh
	faceMesh.material.morphtargets = true
    // faceMesh.morphTargetInfluences[0] = 1
    faceMesh.updateMorphTargets()

	const FACE_SIZE = 0.05
	faceMesh.material.opacity = 0.5
	faceMesh.material.transparent = true	 
	// faceMesh.material.color.setHex( 0xff0000 )
	faceMesh.material.color.setHSL( 0.5, 0.6, 0.6 )
	faceMesh.scale.set(FACE_SIZE,FACE_SIZE,FACE_SIZE)		 
	faceMesh.rotation.y = ( mouseX * TAU / 2 )
	
	const faceMeshSize = new THREE.Box3().setFromObject(faceMesh).getSize(new THREE.Vector3())

	scene.add( faceMesh )

	
	// Get uniformly distributed random points in mesh
	// 	- create array with cumulative sums of face areas
	//  - pick random number from 0 to total area
	//  - find corresponding place in area array by binary search
	//	- get random point in face
	// const randomPoints = GeometryUtils.randomPointsInGeometry( faceMesh )
	//const randomBufferPoints = GeometryUtils.randomPointsInBufferGeometry( geometry, 3 )



	scene.add(particles)

	console.log("createParticles", {particles, positions, scales, root, faceMesh} )

	let count = 0

	// Update the voxel positions with respect to the inverted matrix
	const updateVoxels = (particles, index, scaleFactor=1) => {
		const data = DATA[index+'']
		if (data)
		{
			let count = 0
			const { keypoints, facialTransformationMatrixes, box } = data

			// resize the points based on the box

			// use the matrix to REVERT THE TRANSFORMATION
			//const matrix = new THREE.Matrix4( )
			const matrix = new THREE.Matrix4().fromArray( facialTransformationMatrixes.data )
			// matrix.transpose()
			// matrix.invert()
			// const eye = matrix.identity()
			// const inverse = matrix.invert()
			// const inverse = matrixtranspose()
			
			const positionMatrix = new THREE.Matrix4()
			positionMatrix.copyPosition( matrix )

			const positionVector = new THREE.Vector3().setFromMatrixPosition(matrix)
			const scaleVector = new THREE.Vector3().setFromMatrixScale(matrix)
			// const rotationMatrix = new THREE.Matrix4()

			// matrix.extractRotation(rotationMatrix)
			// matrix.invert()
			// matrix.makeRotationY( Math.PI )

			// Rescale the object to normalized space
			const box3 = new THREE.Box3().setFromObject(particles)
			const size = box3.getSize(new THREE.Vector3())
			// const center = box3.getCenter(new THREE.Vector3())
			const zoomLevel = Math.min( faceMeshSize.x / size.x, faceMeshSize.y / size.y, faceMeshSize.z / size.z )
			const zoom = 4 //zoomLevel //
			
			//particles.scale.set(zoomLevel,zoomLevel,zoomLevel)
			// 1. Reposition back into the center of the face
			// matrix.makeTranslation( -44 , -center.y , -center.z ) // 
			// matrix.setPosition( -64 , 0 , 0 ) // 
			// matrix.setPosition( -44 , -center.y , -center.z ) // 
			// matrix.makeTranslation(positionVector)
			// matrix.setPosition(positionVector)
			// particles.position.set( -center.x/2, -center.y/2, -center.z/2 )
			// particles.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, -center.y, -center.z ) )

			// 2. Rescale the object to normalized space
			// matrix.makeScale(zoomLevel,zoomLevel,zoomLevel)
			
			// 3. Flip the object vertically
			//matrix.makeRotationX( Math.PI )
			// matrix.makeRotationZ( Math.PI )
			// matrix.scale(new THREE.Vector3( scaleVector.x, scaleVector.y, scaleVector.z ))

			// console.log("box", {box3,faceMeshSize, size, center} )
		
			// matrix.decompose(positionMatrix, rotationMatrix, scaleMatrix)
			// console.log("updateVoxels", zoom, {size, faceMeshSize} , {facialTransformationMatrixes, faceMeshSize,keypoints, matrix}, {positionVector, positionMatrix, rotationMatrix, scaleVector} ) 

			
		// faceMesh.geometry.attributes.position.array.set( particles.geometry.attributes.position.array )


			// TODO : Unwrap the matrix facialTransformationMatrixes
			for ( let i = 0, q=keypoints.length; i < q; ++i ) 
			{
				const particlePosition = keypoints[ i ]

				

				// const position = new THREE.Vector3( particlePosition.x, particlePosition.y, particlePosition.z )
				//position.applyMatrix4( matrix )

				// centrelised
				// positions[count] = position.x + center.x / 2) * scaleFactor// - positionVector.x / 2
				// positions[count+1] = position.y + center.y / 2)  * scaleFactor //- positionVector.y / 2
				// positions[count+2] = position.z + center.z / 2)  * scaleFactor// + positionVector.z / 2
				// positions[count] = (position.x + positionVector.x) * zoom * scaleFactor// - positionVector.x / 2
				// positions[count] = (position.x + center.x / 2) * scaleFactor// - positionVector.x / 2
				// positions[count+1] = (position.y + center.y / 2)  * scaleFactor //- positionVector.y / 2
				// positions[count+2] = (position.z + center.z / 2)  * scaleFactor// + positionVector.z / 2
				// // positions[count] = (position.x + positionVector.x) * zoom * scaleFactor// - positionVector.x / 2
				// positions[count] = (position.x - center.x / 2) * zoom * scaleFactor// - positionVector.x / 2
				// positions[count+1] = (position.y + center.y / 2) * zoom * scaleFactor //- positionVector.y / 2
				// positions[count+2] = (position.z + center.z / 2) * zoom * scaleFactor// + positionVector.z / 2
				// // positions[count] = (position.x + positionVector.x) * zoom * scaleFactor// - positionVector.x / 2
				// positions[count+1] = (position.y + positionVector.y ) * zoom * scaleFactor //- positionVector.y / 2
				// positions[count+2] = (position.z + positionVector.z ) * zoom * scaleFactor// + positionVector.z / 2

				// positions[count] = position.x * zoom * scaleFactor// - positionVector.x / 2
				// positions[count+1] = position.y * zoom * scaleFactor //- positionVector.y / 2
				// positions[count+2] = position.z * zoom * scaleFactor// + positionVector.z / 2
				// positions[count] = position.x * zoom  * scaleFactor// - positionVector.x / 2
				// positions[count+1] = position.y * zoom * scaleFactor //- positionVector.y / 2
				// positions[count+2] = position.z * zoom * scaleFactor// + positionVector.z / 2

				positions[count] = particlePosition.x * scaleFactor * zoom 
				positions[count+1] = particlePosition.y * scaleFactor * zoom
				positions[count+2] = particlePosition.z * scaleFactor * zoom
				
				// faceMesh.geometry.attributes.position.array[count+2] = particlePosition.x
				// faceMesh.geometry.attributes.position.array[count+1] = particlePosition.x
				// faceMesh.geometry.attributes.position.array[count+2] = particlePosition.x


				// console.log("updateVoxels:position", {positionVector, rotationMatrix, scaleVector}, {particlePosition,position } )
				count += 3
			}

			//console.log("updateVoxels", zoom, zoomLevel, positions,{size, faceMeshSize, positionMatrix, positionVector, scaleVector} )//, {facialTransformationMatrixes, faceMeshSize,keypoints, matrix}, {positionVector, positionMatrix, rotationMatrix, scaleVector} ) 
		
		}else{
			
			const radius = 1
			const size = 1

			let i = 0, j = 0
			for ( let ix = 0; ix < AMOUNTX; ix++ ) 
			{
				for ( let iy = 0; iy < AMOUNTY; iy++ ) 
				{
					positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.5 ) * radius ) + ( Math.sin( ( iy + count ) * 0.5 ) * radius )
					scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * size + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * size
	
					i += 3
					j ++
				}
			}
		}
		
		particles.geometry.center()

		// particles.rotation.x = Math.PI
		particles.geometry.attributes.position.needsUpdate = true
		particles.geometry.attributes.scale.needsUpdate = true
		

		// console.log("updateVoxels", text.position, particles.position )//, {facialTransformationMatrixes, faceMeshSize,keypoints, matrix}, {positionVector, positionMatrix, rotationMatrix, scaleVector} )
		return data
	}

	// / updateVoxels(particles, DATA_KEYS[keyIndex] )
	let keyIndex = 0
	const onLoop = ()=>{
	
		// console.info("Rendering...", count )
		const frame = updateVoxels(particles, DATA_KEYS[keyIndex], 1 )
		keyIndex = (keyIndex + 1 ) % DATA_KEYS.length

		// we want to face to look at the cursor

		// particle cloud
		// particles.rotation.y += 0.01

		text.sync()

		//particles.rotation.y += 0.01
		particles.rotation.x = ( mouseY * TAU / 2 ) + Math.PI
		particles.rotation.y = -( mouseX * TAU / 2 ) //+ Math.PI // + TAU		 

		// move face mesh into position behind the particles
		faceMesh.rotation.x = -frame.pitch + ( mouseY * TAU / 2 )
		faceMesh.rotation.y = frame.yaw + ( mouseX * TAU / 2 )	
		faceMesh.rotation.z = frame.roll
		// faceMesh.rotation.y += 0.01



		// if we want the camera to alter the scene instead		
		// camera.position.x += ( mouseX - camera.position.x ) * 0.0005
		// camera.position.y += ( - mouseY - camera.position.y ) * 0.0005

		particles.material.color.setHSL( count%1,0.6, 0.6 ) 
		faceMesh.material.color.setHSL( mouseX, count%1, Math.min( 1, mouseY / 2 + 0.5) ) 

		
		// move text to the correct position
		// text.position.x = particles.position.x
		// text.position.y = particles.position.y

		// camera.position.z += 0.001

		stats.update()	

		// GAH!
		renderer.render(scene, camera)

		count += 0.01

		// console.info("Render", count, { mouseX, mouseY, g:particles.geometry.attributes.position, scene, camera, positions})
	}

	window.addEventListener("keydown", e => {
		switch (e.key)
		{
			case "w":
				text.position.y+= e.ctrlKey ? 0.5 : e.shiftKey ? 1 : 0.1
				break
			case "a":
				text.position.x-=e.ctrlKey ? 0.5 : e.shiftKey ? 1 : 0.1
				break
			case "s":
				text.position.y-=e.ctrlKey ? 0.5 : e.shiftKey ? 1 : 0.1
				break
			case "d":
				text.position.x+=e.ctrlKey ? 0.5 : e.shiftKey ? 1 : 0.1
				break
			case "q":
				
				break
			default:
				console.info("unknown key", e, text.position)
				break
		}

	})
	const onResize = (w, h) => {

		w = w ?? window.innerWidth
		h = h ?? window.innerHeight

		windowHalfX = window.innerWidth / 2
		windowHalfY = window.innerHeight/ 2

		// set the canvas size to the size of the Looking Glass Portrait
		renderer.setSize(w,h)
		// renderer.setSize(innerWidth, innerHeight)

		camera.aspect = w / h
		camera.updateProjectionMatrix()
	}

	const onPointerMove = ( event ) => {
		if ( !event || event.isPrimary === false ) return
		mouseX = ( event.clientX - windowHalfX ) / windowHalfX 
		mouseY = ( event.clientY - windowHalfY ) / windowHalfY
	}

	onResize(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)
	window.addEventListener("resize", e => onResize(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT))

	document.body.style.touchAction = 'none'
	document.body.addEventListener( 'pointermove', onPointerMove )
	
	// Two ways of 
	renderer.setAnimationLoop(onLoop)

	// const loop = ()=>{
	// 	onLoop()
	// 	requestAnimationFrame(loop)
	// }
	// loop()
}

window.addEventListener("DOMContentLoaded", init)




