/**
 * Looking Glass Portrait Display
 * 
- `tileHeight` - defines the height of the individual quilt view, the width is then set based on the aspect ratio of the connected device.
- `numViews`   - defines the number of views to be rendered
- `targetX`    - defines the position of the camera on the X-axis
- `targetY`    - defines the position of the camera on the Y-axis
- `targetZ`    - defines the position of the camera on the Z-axis
- `trackballX` - defines the rotation of the camera on the X-axis
- `trackballY` - defines the rotation of the camera on the Y-axis
- `targetDiam` - defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
- `fovy`       - defines the vertical FOV of your camera (defined in radians)
- `depthiness` - modifies to the view frustum to increase or decrease the perceived depth of the scene.
- `inlineView` - changes how the original canvas on your main web page is displayed, can show the encoded subpixel matrix, a single centered view, or a quilt view.

 */

// import * as HoloPlayCore from '/node_modules/holoplay-core/dist/holoplaycore.module.js'
// import {BridgeClient} from "@lookingglass/bridge"

// import AbstractDisplay from "./display-abstract"
// import { FaceLandmarker } from "@mediapipe/tasks-vision"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr/dist/bundle/webxr.js"

import * as THREE from "three/src/Three.js"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
// import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js'

import DisplayWebGL3D, { DEFAULT_OPTIONS_DISPLAY_WEBGL } from "./display-webgl-3d.js"
import { DISPLAY_LOOKING_GLASS_3D } from './display-types.js'

// Settings
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

let openXRButton = null
let connectHardwareButtons = false

export const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS = {
	...DEFAULT_OPTIONS_DISPLAY_WEBGL,
	controls:"#shared-controls"
}

export const createXRToggleButton = (renderer, destination) => {
	if (openXRButton)
	{
		destination.append(openXRButton)
		return openXRButton
	}
	// adapt VRButton styles!
	openXRButton = VRButton.createButton(renderer)
	openXRButton.style = ""
	openXRButton.setAttribute("type","button")
	destination.append(openXRButton)
	return openXRButton
}


let hasXRBeenPolyfilled = false
let lookingGlassWebXR

// This cannot be handled by the class as it freaks out and so
// MUST be called before instatiation of the class
// it is correctly set in the display-manager.js
export const requiredXRSetupForLookingGlass = () => {
	
	if (!hasXRBeenPolyfilled)
	{
		// only ever run this once!
		hasXRBeenPolyfilled =  true

		const lookingGlassConfig = {
			// defines the height of the individual quilt view, 
			// the width is then set based on the aspect ratio of the connected device.
			tileHeight: 512,
			// number of views to be rendered
			numViews: 45,
			// modifies the view frustum to increase or decrease the perceived depth of the scene.
			depthiness: 0.7,
			//  defines the position of the camera on the axis
			targetX: 0,
			targetY: 0,
			// matches the camera position in the WebGL vversion
			targetZ: 1.5,
			// defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
			// smaller numbers mean bigger models!
			targetDiam: 2,
			// defines the vertical FOV of your camera (defined in radians)
			fovy: (16 * Math.PI) / 180,
			//  changes how the original canvas on your main web page is displayed, 
			// can show the encoded subpixel matrix, a single centered view, or a quilt view
			inlineView: "quilt",
		}

		// requires VRButton to be available
		lookingGlassWebXR = new LookingGlassWebXRPolyfill(lookingGlassConfig)	

		// update the view controls after instatiating
		// lookingGlassWebXR.update({
		// 	numViews: 80
		// })
		//
		// or...
		//
		// const config = LookingGlassConfig
		// config.tileHeight = 512
		// config.numViews = 45
		// config.targetY = 0
		// config.targetZ = 0
		// config.targetDiam = 3
		// config.fovy = (12 * Math.PI) / 180

		
	}
	return lookingGlassWebXR
}




/**
 * Three JS Based with Web VR renderer
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class DisplayLookingGlass3D extends DisplayWebGL3D{

	name = DISPLAY_LOOKING_GLASS_3D

	isButtonFullSize = false

	lookingGlassWebXR

	controls

	originalCanvasSize = {
		width:0, height:0
	}

	constructor( canvas, initialWidth=LOOKING_GLASS_PORTRAIT_WIDTH, initialHeight=LOOKING_GLASS_PORTRAIT_HEIGHT, options=DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS ){
		options = {...DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS, ...options}
	
		super( canvas, initialWidth, initialHeight, options )
		
		if (options.lookingGlassWebXR)
		{
			this.lookingGlassWebXR = options.lookingGlassWebXR
			this.lookingGlassWebXR()
		}
		
		// save original dimensions for Looking Glass Portrait dimensions
		this.originalCanvasSize.width = this.canvas.width
		this.originalCanvasSize.height = this.canvas.height
	}

	addSideButtonControls(){
		// NB. Holo buttons dont do anything!
		// HoloPlay.Buttons will emit events when the display's buttons are touched
		// this.controls = new HoloPlayCore.Buttons()
		// this.controls.addEventListener('buttonPressed', this.onLookingGlassControls)	
		// const Bridge = BridgeClient.getInstance()
	}

	removeSideButtonControls(){
		
		// const Bridge = BridgeClient.getInstance()
		// HoloPlay.Buttons will emit events when the display's buttons are touched
		// this.controls.removeEventListener('buttonPressed', this.onLookingGlassControls)	
		// this.controls = null
	}

	async create(keypointQuantity=478, options={}){

		await super.create(keypointQuantity, options)

		// Neccessary for VR button and for headsets
		this.renderer.xr.enabled = true
		this.renderer.setSize( LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT )

		// this requires a button to be pressed but we can make it a hidden button!
		const controls = this.options.controls ? document.querySelector(this.options.controls) : document.body.appendChild(document.createElement("div"))
		// immediately create the VR Button as the Looking Glass will override it
		createXRToggleButton( this.renderer, controls )

		console.info("Adding XR button to", this.options, controls, DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS )

		if (connectHardwareButtons)
		{
			this.addSideButtonControls()
		}
		
		this.available = true

		return true
	}

	/**
	 * 
	 * @returns 
	 */
	async destroy(){
		if (this.controls)
		{
			this.removeSideButtonControls()		
		}
		if (openXRButton)
		{
			openXRButton.parentNode.removeChild(openXRButton)
		}

		// reset canvas size...
		this.renderer.setSize( this.originalCanvasSize.width, this.originalCanvasSize.height )

		return await super.destroy()
	}
	
	/**
	 * NB. We *cannot* use selective bloom in XR mode
	 * 	LookingGlassXRDevice.isFeatureSupported: feature not understood: layers 
	 * 	The optional feature 'layers' is not supported
	 */
	async addFX(){}
	 
	// we always make the button the same size as the screen
	movePersonButton(person, prediction){
		if (!this.isButtonFullSize)
		{
			// resize to Looking Glass Portrait dimensions
			person.moveButton( 0, 0, LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT )
			this.isButtonFullSize = true
		}
	}
	arrangeParticles( data, scaleFactor=1, centralise=true)  {
		return super.arrangeParticles( data, scaleFactor, centralise )
	}
	/*
	render(){
		super.render()
	}

	onRender(){
		super.onRender()
		console.info("Render", this )
	}
	*/
	
	/**
	 * EVENT : The canvas has been resized but we force it to our set dimensions
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	onResize(width, height){
		super.onResize(	LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT )
	}
	
	/**
	 * There are some buttons on the LKP display that can be used
	 * to set other things using the HoloPlay API
	 */
	onLookingGlassControls(e){
		switch (e.detail.name) 
		{
			case 'left':
				this.lookingGlassWebXR.update({

				})
				break

			case 'right':
				
				break

			case 'square':

				break

			case 'circle':
		
				break
		}
	}

}





/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export const GeometryUtils = {

	// Merge two geometries or geometry and geometry from object (using object's transform)

	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );

	},

	// Get random point in triangle (via barycentric coordinates)
	// 	(uniform distribution)
	// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle

	randomPointInTriangle: function () {

		var vector = new THREE.Vector3();

		return function ( vectorA, vectorB, vectorC ) {

			var point = new THREE.Vector3();

			var a = Math.random();
			var b = Math.random();

			if ( ( a + b ) > 1 ) {

				a = 1 - a;
				b = 1 - b;

			}

			var c = 1 - a - b;

			point.copy( vectorA );
			point.multiplyScalar( a );

			vector.copy( vectorB );
			vector.multiplyScalar( b );

			point.add( vector );

			vector.copy( vectorC );
			vector.multiplyScalar( c );

			point.add( vector );

			return point;

		};

	}(),

	// Get random point in face (triangle)
	// (uniform distribution)

	randomPointInFace: function ( face, geometry ) {

		var vA, vB, vC;

		vA = geometry.vertices[ face.a ];
		vB = geometry.vertices[ face.b ];
		vC = geometry.vertices[ face.c ];

		return GeometryUtils.randomPointInTriangle( vA, vB, vC );

	},

	// Get uniformly distributed random points in mesh
	// 	- create array with cumulative sums of face areas
	//  - pick random number from 0 to total area
	//  - find corresponding place in area array by binary search
	//	- get random point in face

	randomPointsInGeometry: function ( geometry, n ) {

		var face, i,
			faces = geometry.faces,
			vertices = geometry.vertices,
			il = faces.length,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC;

		// precompute face areas

		for ( i = 0; i < il; i ++ ) {

			face = faces[ i ];

			vA = vertices[ face.a ];
			vB = vertices[ face.b ];
			vC = vertices[ face.c ];

			face._area = GeometryUtils.triangleArea( vA, vB, vC );

			totalArea += face._area;

			cumulativeAreas[ i ] = totalArea;

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 );
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		var stats = {};

		for ( i = 0; i < n; i ++ ) {

			r = Math.random() * totalArea;

			index = binarySearchIndices( r );

			result[ i ] = GeometryUtils.randomPointInFace( faces[ index ], geometry );

			if ( ! stats[ index ] ) {

				stats[ index ] = 1;

			} else {

				stats[ index ] += 1;

			}

		}

		return result;

	},

	randomPointsInBufferGeometry: function ( geometry, n ) {

		var i,
			vertices = geometry.attributes.position.array,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC;

		// precompute face areas
		vA = new THREE.Vector3();
		vB = new THREE.Vector3();
		vC = new THREE.Vector3();

		// geometry._areas = [];
		var il = vertices.length / 9;

		for ( i = 0; i < il; i ++ ) {

			vA.set( vertices[ i * 9 + 0 ], vertices[ i * 9 + 1 ], vertices[ i * 9 + 2 ] );
			vB.set( vertices[ i * 9 + 3 ], vertices[ i * 9 + 4 ], vertices[ i * 9 + 5 ] );
			vC.set( vertices[ i * 9 + 6 ], vertices[ i * 9 + 7 ], vertices[ i * 9 + 8 ] );

			totalArea += GeometryUtils.triangleArea( vA, vB, vC );

			cumulativeAreas.push( totalArea );

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 );
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		for ( i = 0; i < n; i ++ ) {

			r = Math.random() * totalArea;

			index = binarySearchIndices( r );

			// result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
			vA.set( vertices[ index * 9 + 0 ], vertices[ index * 9 + 1 ], vertices[ index * 9 + 2 ] );
			vB.set( vertices[ index * 9 + 3 ], vertices[ index * 9 + 4 ], vertices[ index * 9 + 5 ] );
			vC.set( vertices[ index * 9 + 6 ], vertices[ index * 9 + 7 ], vertices[ index * 9 + 8 ] );
			result[ i ] = GeometryUtils.randomPointInTriangle( vA, vB, vC );

		}

		return result;

	},

	// Get triangle area (half of parallelogram)
	// http://mathworld.wolfram.com/TriangleArea.html

	triangleArea: function () {

		var vector1 = new THREE.Vector3();
		var vector2 = new THREE.Vector3();

		return function ( vectorA, vectorB, vectorC ) {

			vector1.subVectors( vectorB, vectorA );
			vector2.subVectors( vectorC, vectorA );
			vector1.cross( vector2 );

			return 0.5 * vector1.length();

		};

	}(),

	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();

	}

}
