/**
 * This is a wrapper for the Avatar 3D stuff
 * as it varies depending on the type of model that gets
 * loaded, this just offers a simple interface for controlling
 * animations of 3D head models using both Animations and 
 * BlendShapes
 * 
*/
import { Box3, Clock, Vector3, BufferGeometry, Float32BufferAttribute, MathUtils, Group, Object3D } from "three"
import { FaceLandmarker } from "@mediapipe/tasks-vision"
import { calculateModelScale, createLoaderForModel, improveVRMPerformance, rescaleAndCenter } from "./avatars.js"
import { Particle, ParticleTracer } from "../visual/3d.particles.js"
import { BLENDSHAPE_IDS } from "./blendshapes.js"
import { subdivideKeypoints } from './keypoint-subdivision.js'
import { prepareHumanHead, loadHumanHead, bindMorphTargets, applyMorphScore } from './human-head.js'
export { subdivideKeypoints } from './keypoint-subdivision.js'

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
export const arrangeFaceData = (keypointData, positions, scales, scaleFactor = 1, subdivisions = 0) => {

	let count = 0
	const arrangedKeypoints = subdivisions > 0 ? subdivideKeypoints(keypointData, subdivisions) : keypointData
	const quantity = positions.length / 3
	const keypointQuantity = arrangedKeypoints?.length ?? 0

	if (keypointQuantity === 0)
	{
		return
	}

	for (let i=0; i<quantity;++i)
	{
		const p = i % keypointQuantity
	
		const particlePosition = arrangedKeypoints[ p ]

		positions[count] = particlePosition.x * scaleFactor
		positions[count+1] = particlePosition.y * scaleFactor
		positions[count+2] = (particlePosition.z ?? 0) * scaleFactor

		scales[i] = 1 
		
		count += 3
	}
	// console.info("Arranged particles",keypointData, { positions, scales, scaleFactor}) 
}

// NB. we need to ensure we dots are rotated to the same plane as the face
/**
 * Subdivide keypoints by interpolating between them
 * Works with any array of {x, y, z?} keypoint objects
 * @param {Array} keypoints - array of keypoint objects with x, y, (z) properties
 * @param {number} subdivisions - how many times to subdivide (0 = disabled, 1 = double, 2 = 4x, etc)
 * @returns {Array} subdivided keypoints
 */

/**
 * Subdivide face geometry by interpolating points between keypoints
 * Creates denser particle clouds by adding intermediate points
 * @param {Float32Array} positions - original keypoint positions
 * @param {Float32Array} scales - original keypoint scales
 * @param {number} subdivisions - how many times to subdivide (0 = no subdivision, 1 = double points, 2 = 4x points, etc)
 * @returns {Object} { positions, scales } with subdivided data
 */
const subdivideGeometry = (positions, scales, subdivisions = 0) => {
	if (subdivisions <= 0) {
		return { positions, scales }
	}
	
	const pointCount = positions.length / 3
	let newPositions = positions
	let newScales = scales
	
	for (let sub = 0; sub < subdivisions; sub++) {
		const currentPointCount = newPositions.length / 3
		const subdivided = new Float32Array((currentPointCount * 2 - 1) * 3)
		const subdividedScales = new Float32Array(currentPointCount * 2 - 1)
		
		let writeIndex = 0
		
		for (let i = 0; i < currentPointCount; i++) {
			// Copy original point
			subdivided[writeIndex * 3] = newPositions[i * 3]
			subdivided[writeIndex * 3 + 1] = newPositions[i * 3 + 1]
			subdivided[writeIndex * 3 + 2] = newPositions[i * 3 + 2]
			subdividedScales[writeIndex] = newScales[i]
			writeIndex++
			
			// Add interpolated point between this and next
			if (i < currentPointCount - 1) {
				subdivided[writeIndex * 3] = (newPositions[i * 3] + newPositions[(i + 1) * 3]) * 0.5
				subdivided[writeIndex * 3 + 1] = (newPositions[i * 3 + 1] + newPositions[(i + 1) * 3 + 1]) * 0.5
				subdivided[writeIndex * 3 + 2] = (newPositions[i * 3 + 2] + newPositions[(i + 1) * 3 + 2]) * 0.5
				subdividedScales[writeIndex] = (newScales[i] + newScales[i + 1]) * 0.5
				writeIndex++
			}
		}
		
		newPositions = subdivided
		newScales = subdividedScales
	}
	
	return { positions: newPositions, scales: newScales }
}

export const createFaceGeometryFromData = (keypointData, quantity, scaleFactor = 1, subdivisions = 0) => {
	// Add layers for holding scale and position data (optional)		
	const geometry = new BufferGeometry()
	const arrangedKeypoints = subdivisions > 0 ? subdivideKeypoints(keypointData, subdivisions) : keypointData
	const particleQuantity = subdivisions > 0 ? arrangedKeypoints.length : quantity
	let positions = new Float32Array( particleQuantity * 3 )
	let scales = new Float32Array( particleQuantity )
	
	arrangeFaceData(arrangedKeypoints, positions, scales, scaleFactor)

	geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'scale', new Float32BufferAttribute( scales, 1 ) )
	
	// Initialize colors to white
	const colors = new Float32Array( particleQuantity * 3 )
	for (let i = 0; i < colors.length; i += 3) {
		colors[i] = 1
		colors[i + 1] = 1
		colors[i + 2] = 1
	}
	geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )
	
	const paths = FaceLandmarker.FACE_LANDMARKS_TESSELATION

	console.error("Face paths", paths)

	// const particles = Array(quantity).fill(0).map((e,i)=> new ParticleTracer( geometry, TRIANGULATION, i ))
	const particles = Array(particleQuantity)
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

	// cache all particles inside userData
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

	// container
	#parent

	// face mesh model 
	#faceMesh

	// numbers
	modelScale
	faceMeshSize

	relationships = new Map()
	morphBindings = new Map()

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
	setFeature(feature, value, speed = .5) {
		if (!this.morphBindings.has(feature)) return null
		applyMorphScore(this.morphBindings, feature, value, speed)
		return feature
	}
	/**
	 * Pass in the blendshapes prediction array
	 * and it will update the weightings accordingly
	 * 
	 * @param {Array} blendShapePredictions 
	 */
	updateFromPrediction( blendShapePredictions, smoothing = .5 ){
		return blendShapePredictions.map((blendShape,index) => {
			return this.setFeature( blendShape.categoryName, blendShape.score, smoothing )
		})	
	}

	/**
	 * 
	 * @param {Array} morphableMeshes 
	 */
	setupMorphTargets(morphableMeshes) {
		this.morphBindings = bindMorphTargets(morphableMeshes)
		// Retain older FBX aliases while keeping indices local to their owning mesh.
		for (const mesh of morphableMeshes) for (const [name, index] of Object.entries(mesh.morphTargetDictionary)) {
			const alias = cleanKey(name)
			if (!BLENDSHAPE_IDS.includes(alias)) continue
			const bindings = this.morphBindings.get(alias) ?? []
			if (!bindings.some(binding => binding.mesh === mesh && binding.index === index)) bindings.push({ mesh, index })
			this.morphBindings.set(alias, bindings)
		}
		this.#morphableMeshes = morphableMeshes
	}
	/**
	 * FIXME:
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
	 * @param {Object} avatarModel 
	 * @param {Number|Null} size 
	 * @returns 
	 */
	createFace(faceMesh, avatarModel, size=null) {

		const meshes = []
		faceMesh.traverse?.(object => {
			if (object.material)
			{
				meshes.push(object)
			}
		})
		if (faceMesh.material && meshes.length === 0)
		{
			meshes.push(faceMesh)
		}
		
		this.#faceMesh = faceMesh

		// try and find all meshes with blendshapes
		meshes.forEach( mesh => {
			if (mesh.material)
			{
				const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
				materials.forEach(material => {
					if (avatarModel.opacity < 1)
					{
						material.transparent = true
						material.opacity = avatarModel.opacity
						material.depthWrite = false
					}

					if (avatarModel.HSL)
					{
						material.color?.setHSL?.( 0.5, 0.6, 0.6 )
					}

					if (this.#hasBlendShapes)
					{
						material.morphTargets = true
						material.needsUpdate = true
					}
				})
			}

			// reset to empty!
			// NB. this breaks the dictionary!
			// child.updateMorphTargets()
		})
	
		// puts the model at 0,0,0
		// rescales to a nomalized size
		if (!avatarModel.humanFace) this.centraliseGeometry()

		// Reposition and rotate
		this.position( avatarModel )
		this.rotate( avatarModel )


		// Set scale if provided
		// NB. scale directly changes parent
		if (size)
		{
			this.scale( size )
		}
		
		// const Blendshape = faceMesh.blendShapeProxy
		// const PresetName = THREE.VRMSchema.BlendShapePresetName
		
		// console.error("Blendshapes", {faceMesh, Blendshape, PresetName} )
		//, Blendshape.getValue(PresetName.CHEEK_PUFF) )
		
		const box =  new Box3().setFromObject(faceMesh).getSize(new Vector3())
		console.info("Avatar "+this.name+" data", {avatarModel, box, size})
			
		return box
	}

	/**
	 * Position relative to parent
	 * @param {Vector3} positionVector 
	 */
	position( positionVector ){
		// position in front the camera but behind the particles
		this.#parent.position.z = positionVector.pos?.z ?? 0
		this.#parent.position.y = positionVector.pos?.y ?? 0
		this.#parent.position.x = positionVector.pos?.x ?? 0	
		//console.info("FaceMesh Position", {positionVector}, this.#faceMesh.position )
	}

	/**
	 * 
	 * @param {Vector3} rotationVector 
	 */
	rotate(rotationVector){
		this.#parent.rotateX( rotationVector.rot?.x ?? 0 )
		this.#parent.rotateY( rotationVector.rot?.y ?? 0 )
		this.#parent.rotateZ( rotationVector.rot?.z ?? 0 )
		// console.info("FaceMesh Rotate", {rotationVector}, this.#faceMesh )
	}

	rotateAll(x,y,z, friction=0.3 ){
		this.rotateX(x, friction)
		this.rotateY(y, friction)
		this.rotateZ(z, friction)
		// console.info("FaceMesh RotateAll", {x,y,z, friction}, this.#parent )
	}

	rotateX( x, friction=0.3){
		this.#parent.rotation.x += (x - this.#parent.rotation.x ) * friction
		//MathUtils.lerp( this.#parent.rotation.x, x, friction)
	}

	rotateY( y, friction=0.3){
		this.#parent.rotation.y += (y - this.#parent.rotation.y ) * friction
		//MathUtils.lerp( this.#parent.rotation.y, y, friction)
	}

	rotateZ( z, friction=0.3){
		this.#parent.rotation.z += (z - this.#parent.rotation.z ) * friction
		//MathUtils.lerp( this.#parent.rotation.z, z, friction)
	}

	rotateXBy( x, friction=0.3){
		this.rotateX( this.#parent.rotation.x + x, friction )
	}

	rotateYBy( y, friction=0.3){
		this.rotateX( this.#parent.rotation.x + x, friction )
	}

	rotateZBy( z, friction=0.3){
		this.rotateX( this.#parent.rotation.x + x, friction )	
	}

	scale( size ){
		this.#parent.scale.set(size, size, size)
		// console.info("FaceMesh Scale", {size}, this.#faceMesh.scale)
	}

	async loadAnimation( animationModel ){

	}

	/**
	 * 
	 * @param {Object} faceModel 
	 * @param {Number} scale size
	 * @returns 
	 */
	async loadModel(faceModel, scale = 1) {
		this.#parent = new Object3D()
		this.#opacity = faceModel.opacity ?? 1
		const faceGroup = faceModel.humanFace ? await loadHumanHead(faceModel.model) :
			await (await createLoaderForModel(faceModel.model)).loadAsync(faceModel.model)
		let faceMesh = faceGroup.scene ?? faceGroup
		const vrm = faceGroup.userData?.vrm
		if (vrm) {
			faceMesh = vrm.scene
			await improveVRMPerformance(faceGroup, vrm)
		}
		if (faceModel.humanFace) {
			faceMesh = prepareHumanHead(faceMesh)
			this.#parent.userData.humanFace = true
		}
		const morphableMeshes = []
		faceMesh.traverse(mesh => {
			if (mesh.isMesh && mesh.morphTargetInfluences?.length && mesh.morphTargetDictionary) morphableMeshes.push(mesh)
		})
		this.#hasBlendShapes = morphableMeshes.length > 0
		this.setupMorphTargets(morphableMeshes)
		this.modelScale = calculateModelScale(faceMesh, scale)
		this.faceMeshSize = this.createFace(faceMesh, faceModel, scale)
		this.#parent.add(faceMesh)
		return { parent: this.#parent, faceMesh, faceGroup }
	}
	async dispose(){
		return true
	}
}
