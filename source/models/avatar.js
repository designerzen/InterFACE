/**
 * This is a wrapper for the Avatar 3D stuff
 * as it varies depending on the type of model that gets
 * loaded, this just offers a simple interface for controlling
 * animations of 3D head models using both Animations and 
 * BlendShapes
 * 
*/
import { Box3, Clock, Vector3, BufferGeometry, Float32BufferAttribute, MathUtils, Group } from "three"
import { calculateModelScale, createLoaderForModel, improveVRMPerformance, rescaleAndCenter } from "./avatars.js"
import { Particle, ParticleTracer } from "../visual/3d.particles.js"
import { FaceLandmarker } from "@mediapipe/tasks-vision"
import { BLENDSHAPE_IDS, swapEyeSide } from "./blendshapes.js"

// "LipsLowerClose" => 29}
// {"LipsLowerDown" => 30}
// {"LipsLowerOpen" => 31}
// {"LipsUpperClose" => 35}
// {"LipsUpperOpen" => 36}

const compoundKeys = (key) => {
	switch( key )
	{
		case "LipsLowerDown":
			return ["mouthUpperUpLeft","mouthUpperUpRight"]
	
		case "LipsUpperUp":
			return ["mouthUpperUpLeft","mouthUpperUpRight"]

		default:
			return []
	}
}

// ensure that there are no space... no multi dotted elements... camelCase
const cleanKey = key => {

	switch(key){
		case "BrowsD_L":
			return "browDownLeft"
		case "BrowsD_R":
			return "browDownRight"
		case "BrowsU_C":
			return "browInnerUp"
			// "EyesDown"
	}

	key = (key[0].toLowerCase() + key.slice(1))
						.replace( /^puff$/, "cheekPuff")
						.replace( /_L$/, "Left")
						.replace( /_R$/, "Right")
						.replace( /Fwd$/, "Forward")
						.replace( /^lips/, "mouth")
						.replace( /^eyeOpen/, "eyeBlink")
						.trim()
						.split(".").pop()
						.split("_").shift()

	switch(key){
		// there is no mouthOpen blendshape
		case "mouthOpen":
			return "jawOpen"
		case "browsDLeft":
			return "browDownLeft"
		case "browsDRight":
			return "browDownRight"
		case "browsURight":
			return "browUpRight"
		case "browsULeft":
			return "browUpLeft"
		case "lipsFunnel":
			return "mouthFunnel"
	
	}
	return key
}


// For live data :
export const arrangeFaceData = (keypointData, positions, scales, scaleFactor = 1) => {

	let count = 0
	const quantity = positions.length

	for (let i=0; i<quantity;++i)
	{
		const p = i % (keypointData.length - 1)
	
		const particlePosition = keypointData[ p ]

		positions[count] = particlePosition.x * scaleFactor
		positions[count+1] = particlePosition.y * scaleFactor
		positions[count+2] = particlePosition.z * scaleFactor

		scales[i] = 1 
		
		count += 3
	}
	// console.info("Arranged particles",keypointData, { positions, scales, scaleFactor}) 
}

// NB. we need to ensure we dots are rotated to the same plane as the face
export const createFaceGeometryFromData = (keypointData, quantity, scaleFactor = 1) => {
	// Add layers for holding scale and position data (optional)		
	const geometry = new BufferGeometry()
	const positions = new Float32Array( quantity * 3 )
	const scales = new Float32Array( quantity )
	
	arrangeFaceData(keypointData, positions, scales,scaleFactor)
	geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'scale', new Float32BufferAttribute( scales, 1 ) )
	
	const paths = FaceLandmarker.FACE_LANDMARKS_TESSELATION

	console.error("Face paths", paths)

	// const particles = Array(quantity).fill(0).map((e,i)=> new ParticleTracer( geometry, TRIANGULATION, i ))
	const particles = Array(quantity)
						.fill(0)
						.map((e,i)=> new ParticleTracer( geometry, null, i, Math.random() * 0.2, true  ))
	// connect particles....
	particles.forEach( (particle, i) => {
		const next = particles[i+1]
		if (next)
		{
			particle.next = next
			next.previous = particle
		}
	})


	geometry.userData.particles = particles
	// geometry.userData.particles = Array(quantity).map((e,i)=>new Particle(positions[i*3],positions[i*3+1],positions[i*3+2]))
	
	console.error("Particles Generated", {particles, paths})
	return geometry
}








export default class Avatar{

	name = "Avatar"

	#hasBlendShapes = false
	#morphableMeshes = []

	#clock = null
	#opacity = 1

	#parent
	#faceMesh

	modelScale
	faceMeshSize

	relationships = new Map()

	get isMorphable(){
		return this.#hasBlendShapes
	}

	get scene(){
		return this.#parent
	}

	get opacity(){
		return this.#opacity
	}

	constructor( name, clock ){
		this.name = name
		this.#clock = clock ?? new Clock()
	}

	/**
	 * 
	 * @param {String} feature 
	 * @param {Number} value 
	 */
	setFeature( feature, value, speed=0.5 ){
		// need to swap eyes around...

		feature = swapEyeSide( feature )

		const blendShapeIndex = this.relationships.get(feature)
		if (blendShapeIndex && blendShapeIndex > -1)
		{
			this.#morphableMeshes.forEach( morphableMesh => {
				morphableMesh.morphTargetInfluences[blendShapeIndex] = MathUtils.lerp(
					morphableMesh.morphTargetInfluences[blendShapeIndex],
					value,
					speed
				)
			})
			

			// FIXME: 
			// eyeBlink is inverted to eyeOpen :(
			// 
			// this blendshape or animation is not
			// available in this 3d model
			return feature
		}

		return null
	}

	/**
	 * Pass in the blendshapes prediction array
	 * and it will update the weightings accordingly
	 * 
	 * @param {Array} blendShapePredictions 
	 */
	updateFromPrediction( blendShapePredictions ){
		return blendShapePredictions.map((blendShape,index) => {
			return this.setFeature( blendShape.categoryName, blendShape.score )		
		})	
	}

	/**
	 * 
	 * @param {Array} morphableMeshes 
	 */
	setupMorphTargets(morphableMeshes){

		const targets = morphableMeshes.map( morphableMesh => {

			const morphShapes = morphableMesh.morphTargetDictionary
			const morphKeys = Object.keys( morphShapes )

			// FIXME: this needs to also convert to actual blendshape names
			morphKeys.forEach( morphKey =>{
				// loop through CORRECT keys first and see if there are exact matches...
				const cleanedKey = cleanKey(morphKey)
				if (BLENDSHAPE_IDS.includes(cleanedKey))
				{
					this.relationships.set( cleanedKey, morphShapes[morphKey] ) 
									
				}else{
					// check for eyes and sneers which can compound...
					const compounds = compoundKeys(morphKey)
					if (compounds.length > 0){

						// there are multiple keys
						compounds.forEach(  key => this.relationships.set( key, morphShapes[morphKey] ) )

					}else{
						this.relationships.set( morphKey, morphShapes[morphKey] ) 	
					}
				}
			})

			BLENDSHAPE_IDS.forEach( id => {
				if ( this.relationships.has(id) )
				{
					//this.relationships.set( id, morphShapes[id] ) 
					console.info("Avatar "+this.name+" Blendhsape available", id)
				}else{
					console.error("Avatar "+this.name+" Blendhsape key missing", id)
				}
			})

			console.error("Avatar:setupMorphTarget", {morphShapes, morphKeys, relationships:this.relationships})
		
			return morphKeys
		})

		this.#morphableMeshes = morphableMeshes

		// morphTargetInfluences
		// morphTargetDictionary
		console.error("Avatar:setupMorphTargets Morph Target Meshes", {morphableMeshes, targets})
	}

	/**
	 * Sometimes Avatar models use Animations rather than 
	 * BlendShapes - we can still use these but we must
	 * handle their bones
	 */
	setupAnimations(){
		// Create an AnimationMixer, and get the list of AnimationClip instances
		const mixer = new THREE.AnimationMixer( mesh )
		const clips = mesh.animations

		// Update the mixer on each frame
		function update () {	
			// you must do this every frame
			mixer.update( clock.getDelta() )
		}

		// Play a specific animation
		const clip = THREE.AnimationClip.findByName( clips, 'dance' )
		const action = mixer.clipAction( clip )
		// action.play()

		// Play all animations
		// clips.forEach( function ( clip ) {
		// 	mixer.clipAction( clip ).play()
		// } )
		console.error("Avatar:setupAnimations Timelines", {})
	}

	centraliseGeometry(){
		rescaleAndCenter( this.#faceMesh )
		// this.#faceMesh.geometry.center()
	}
	/**
	 * This attempts to find the object3d face model
	 * isolates it, rescales it to match the screen size
	 * and positions it in the center of the view
	 * 
	 * @param {Mesh} faceMesh 
	 * @param {Vector3} avatar 
	 * @param {Number|Null} size 
	 * @returns 
	 */
	createFace(faceMesh, avatar, size=null) {

		// if there is a face mesh material, activate it
		const meshes = faceMesh.material ? [faceMesh] : faceMesh.children
		
		this.#faceMesh = faceMesh

		// try and find all meshes with blendshapes
		if (this.#hasBlendShapes)
		{
			meshes.forEach( mesh => {
				if (mesh.material)
				{
					if (avatar.opacity < 1)
					{
						mesh.material.transparent = true
						mesh.material.opacity = avatar.opacity
					} 	 

					if (avatar.HSL)
					{
						mesh.material.color.setHSL( 0.5, 0.6, 0.6 )
					}

					if (this.hasMorphableMeshes)
					{
						mesh.material.morphtargets = true
					}
				}

				// reset to empty!
				// NB. this breaks the dictionary!
				// child.updateMorphTargets()
			})		
		}
	
		// puts the model at 0,0,0
		// rescales to a nomalized size
		this.centraliseGeometry()

		// Reposition and rotate
		this.position( avatar )
		this.rotate( avatar )


		// Set scale if provided
		// NB. scale directly changes parent
		if (size)
		{
			console.info("Avatar "+this.name+" rescale", size)
			this.scale( size )
		}
		
		// const Blendshape = faceMesh.blendShapeProxy
		// const PresetName = THREE.VRMSchema.BlendShapePresetName
		
		// console.error("Blendshapes", {faceMesh, Blendshape, PresetName} )
		//, Blendshape.getValue(PresetName.CHEEK_PUFF) )
		
		return new Box3().setFromObject(faceMesh).getSize(new Vector3())
	}

	/**
	 * Position relative to parent
	 * @param {Vector3} positionVector 
	 */
	position( positionVector ){
		// position in front the camera but behind the particles
		this.#faceMesh.position.z = positionVector.pos?.z ?? 0
		this.#faceMesh.position.y = positionVector.pos?.y ?? 0
		this.#faceMesh.position.x = positionVector.pos?.x ?? 0	
		//console.info("FaceMesh Position", {positionVector}, this.#faceMesh.position )
	}

	/**
	 * 
	 * @param {Vector3} rotationVector 
	 */
	rotate(rotationVector){
		this.#faceMesh.rotateX( rotationVector.rot?.x ?? 0 )
		this.#faceMesh.rotateY( rotationVector.rot?.y ?? 0 )
		this.#faceMesh.rotateZ( rotationVector.rot?.z ?? 0 )
		console.info("FaceMesh Rotate", {rotationVector}, this.#faceMesh )
	}

	rotateAll(x,y,z, friction=0.3 ){
		this.#parent.x += (x - this.#parent.rotation.x ) * friction
		this.#parent.y += (y - this.#parent.rotation.y ) * friction
		this.#parent.z += (z - this.#parent.rotation.z ) * friction
		console.info("FaceMesh Rotate", {x,y,z, friction}, this.#parent )
	}

	scale( size ){
		this.#parent.scale.set(size, size, size)
		console.info("FaceMesh Scale", {size}, this.#faceMesh.scale)
	}

	async loadAnimation( animationModel ){

	}

	/**
	 * 
	 * @param {Object} faceModel 
	 * @param {Number} scale size
	 * @returns 
	 */
	async loadModel( faceModel, scale=1 ){

		// find animations buried
		// animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name // Check if Idle animation exists otherwise use first animation

		this.#parent = new Group()
		this.#opacity = faceModel.opacity ?? 1

		const faceModelURI = faceModel.model
		const loader = createLoaderForModel(faceModelURI)

		return new Promise((resolve,reject)=>{		

			loader.load( faceModelURI, ( faceGroup ) => {
				
				// Attributes added to the 2d geometry
				let faceMesh = !faceGroup.scene ? faceGroup.children[0] : faceGroup.scene.children[0]
				
				// check to see if it a VRM file...
				const vrm = faceGroup.userData.vrm
				if (vrm)
				{
					faceMesh = vrm.scene
					improveVRMPerformance( faceGroup, vrm )
				}

			
				// Get uniformly distributed random points in mesh
				// 	- create array with cumulative sums of face areas
				//  - pick random number from 0 to total area
				//  - find corresponding place in area array by binary search
				//	- get random point in face
				// const randomPoints = GeometryUtils.randomPointsInGeometry( new THREE.SphereGeometry(1, 32, 32) )
				// const randomPoints = GeometryUtils.randomPointsInGeometry( faceMesh )
				//const randomBufferPoints = GeometryUtils.randomPointsInBufferGeometry( geometry, 3 )

				// Try and determine the animation formats...
				// check for animations!
				const hasAnimations = faceMesh.animations.length > 0
				if (hasAnimations)
				{
					this.setupAnimations()

				}else{

					let morphableMeshes

					if (faceMesh.isMesh && faceMesh.morphTargetInfluences && faceMesh.morphTargetDictionary)
					{
						// root model has morph features
						morphableMeshes = [ faceMesh ]
					}else{
						// let's traverse the tree through children...
						morphableMeshes = faceMesh.children.filter( mesh => mesh.isMesh && mesh.morphTargetInfluences && mesh.morphTargetDictionary ) 
					}
					
					// there are multiple objects in the mesh so we find the one
					// that has morph blend shapes (if it exists)
					const hasMorphableMeshes = morphableMeshes.length > 0
					// is this modle animatable?
					this.#hasBlendShapes = hasMorphableMeshes

					if (hasMorphableMeshes)
					{
						//faceMesh = morphableMeshes[0]
						this.setupMorphTargets(morphableMeshes)

					}else{
						console.error("Avatar:no Animations", {faceMesh, t:this})
					}
				}

				// else{

				// 	console.error("Avatar:no Animations layer or morphshapes", {faceMesh, t:this})
				// }

				
				// Model from mesh model
				// const faceGeom = convertMeshToSimplifiedGeometry(particlesGeometry, quantity)

				// const tracerParticles = liveFaceGeometry.userData.particles 
				// const positions = liveFaceGeometry.attributes.position.array 
				
				// const freeRadicals = 
				// assign all particles  that arent original positions to be free radicasls
				// tracerParticles.forEach( (tracerParticle,i)=>{
				// 	if (i>KEYPOINT_QUANTITY)
				// 	{
				// 		tracerParticle.isFreeRadical = true
				// 	}
				// })
				// console.info("geometries", geometry, {faceMesh, faceGroup, particlesGeometry, faceGeom, faceGeometry: liveFaceGeometry} )

				// Calculate and store the scale for this model
				this.modelScale = calculateModelScale( faceMesh, scale )
				
				// Create face with calculated scale
				this.faceMeshSize = this.createFace( faceMesh, faceModel, scale )
				// this.faceMeshSize = this.createFace( faceMesh, faceModel, this.modelScale )

				console.info("Avatar: faceMesh", faceMesh )
				console.info("Avatar: Face Model loaded", this,this.faceMeshSize , this.modelScale, { faceModelURI, faceGroup, faceMesh, vrm })

				this.#parent.add( faceMesh )

				// if (this.morphable)
				// {
				// 	console.info("MORPH geometries", { faceMesh } , this.faceMeshSize ) 
				// }else{
				// 	console.info("NOMORPH geometries", { faceMesh } , this.faceMeshSize ) 
				// }
				
				resolve( { faceMesh, faceGroup } )
			} )
		})
	}
}