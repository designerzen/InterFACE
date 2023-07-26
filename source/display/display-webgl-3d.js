import { AbstractDisplay } from "./display-abstract"
import { FaceLandmarker } from "@mediapipe/tasks-vision"
import * as THREE from "three/src/Three.js"
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

import PARTICLE_URI from '../assets/particles/particle.png'

const loader = new THREE.TextureLoader()
 
const wavespeed = 1
const zIndex = 1200
/**
 * Three JS Based with Web VR renderer
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export class DisplayWebGL3D extends AbstractDisplay{

	camera
	scene
	renderer
	particles

	get depth(){
		return 100
	}

	constructor( canvas, initialWidth, initialHeight, keypointQuantity=478 ){
		
		super(canvas, initialWidth, initialHeight)
		this.create(keypointQuantity)
	}

	async create(keypointQuantity){

		const scene = new THREE.Scene()
		
		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(2, 0.1, 0.1),
			new THREE.MeshStandardMaterial({ color: "red" })
		)

		scene.add(cube)

		scene.add(new THREE.AmbientLight( 0xcccccc, 0.4 ))

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		directionalLight.position.set(3, 3, 3)
		scene.add(directionalLight)
		
		const renderer = new THREE.WebGLRenderer({ 
			antialias: true, 
			canvas:this.canvas,
			alpha: true
		})
		renderer.setPixelRatio(window.devicePixelRatio)

		
		// we can swap this for the orthogonal camera
		// for extra style points
		const camera = new THREE.PerspectiveCamera()
		camera.position.z = zIndex


		this.scene = scene
		this.renderer = renderer
		this.camera = camera

		// this.controls = new OrbitControls( camera, renderer.domElement )
		
		this.particles = await this.createParticles(keypointQuantity)
		
		// console.error("F:particles",this.particles, this ) 
		
		// renderer.setAnimationLoop(() => {
		// 	cube.rotation.z += 0.01
		// 	cube.rotation.x += 0.02
		// 	renderer.render(scene, camera)
		// })

		// function resize() {
		// 	renderer.setSize(innerWidth, innerHeight)
		// 	camera.aspect = innerWidth / innerHeight
		// 	camera.updateProjectionMatrix()
		// }

		// resize()

		// window.addEventListener("resize", resize)
		this.available = true
	}

	/**
	 * 
	 */
	render(){

		// this.controls.update()
		// move camera in accordance to mouse
		
		this.renderer.render( this.scene, this.camera )
		//console.log("updating three scene",  this.scene, this.camera, this)
	}

	/**
	 * Create Particles
	 * @param {Number} quantity 
	 */
	async createParticles( quantity=478 )
	{
		return new Promise((resolve,reject)=>{

			loader.load( PARTICLE_URI, (tex)=>{
		
				const materialOptions = { 
					map: tex, 
					transparent : true, 
					opacity :1, 
					color: 0xefefef88 
				}

				const spriteMaterial = new THREE.SpriteMaterial( materialOptions )
			
				const particles = []
				let x = 0
				let y = 0
				const root = Math.floor( Math.sqrt(quantity) )
	
				for (let i=0; i < quantity; ++i)
				{
					const mesh = new THREE.Sprite( spriteMaterial )
					const xPercent = x / root
					const zPercent = y / root
					
					mesh.scale.set(10, 10, 10)              // scale
					mesh.position.x = xPercent * this.width    // POSITION X
					mesh.position.y = 0
					mesh.position.z = zPercent * this.height    //POSITION Y
	
					particles[i] = mesh
	
					this.scene.add( mesh )
	
					if (i%root === 0)
					{
						y++
						x = 0
					}else{
						x++
					}
				}
	
				return resolve(particles)
	
			}, error => {
	
				console.error("Couldn't load particle") 
				return reject("Couldn't load particle")
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
	 * 
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours ){

		if (this.available === false)
		{
			return
		}

		const prediction = person.data
		const landmarks = prediction.faceLandmarks
		const options = person.options
		const hue = person.hue
		const elapsed = person.now

		// use the matrix to alter something?
		if (prediction.facialTransformationMatrixes)
		{
			const matrix = prediction.facialTransformationMatrixes
			const m = new THREE.Matrix4()
			m.set( ...matrix.data )


			// console.log("matrix", m, m.invert() )
		}else{
			// console.log(prediction)
		}

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

		
		/*
		
					*/	
		// console.log("particles", this.particles)

		return
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
		this.canvasContext.drawImage( this.canvas,offsetX,offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }

		// this.canvasContext.restore()
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
}

