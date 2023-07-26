/**
 * Looking Glass Portrait Display
 */

import { AbstractDisplay } from "./display-abstract"
import { FaceLandmarker } from "@mediapipe/tasks-vision"
import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"

import * as THREE from "three/src/Three.js"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
import { DisplayWebGL3D } from "./display-webgl-3d"

/**
 * Three JS Based with Web VR renderer
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export class DisplayLookingGlass3D extends DisplayWebGL3D{

	constructor( canvas, initialWidth, initialHeight, keypointQuantity=478 ){
		
		super( canvas, initialWidth, initialHeight, keypointQuantity )
	
		
		// set up Portrait
		const config = LookingGlassConfig
		config.tileHeight = 512
		config.numViews = 45
		config.targetY = 0
		config.targetZ = 0
		config.targetDiam = 3
		config.fovy = (14 * Math.PI) / 180

		new LookingGlassWebXRPolyfill()

		// Neccessary
		this.renderer.xr.enabled = true
		// this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		// this.renderer.toneMappingExposure = 1;
		// this.renderer.outputEncoding = THREE.sRGBEncoding;

		
		document.body.append(VRButton.createButton(renderer))
		this.available = true
	}
}

