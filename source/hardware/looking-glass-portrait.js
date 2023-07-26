// This is the Looking Glass Factgory Portrait Display SDK API
// https://docs.lookingglassfactory.com/HoloPlayCore/holoplaycorejs/

import * as HoloPlayCore from './node_modules/holoplay-core/dist/holoplaycore.module.js'
  
import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"

const config = LookingGlassConfig
config.tileHeight = 512
config.numViews = 45
config.targetY = 0
config.targetZ = 0
config.targetDiam = 3
config.fovy = (40 * Math.PI) / 180
new LookingGlassWebXRPolyfill()

// This isn't loaded in automatically but is loaded if a flag is set
// That way it should degrade nicely for those with only 2D displays
export const connectToHologramService = () => {
	const client = new HoloPlayCore.Client(
		// init
		(msg) => {
			console.log('Calibration values:', msg)
		},
		// error
		(err) => {
			console.error('Error creating HoloPlay client:', err)
		},
		// close
		(closeCallback ) => {

		},
		debug || false,
		// app id
		// appId 
	)
	return client
}

 function showCalibration(data) {
        document.getElementById("hops-status").innerHTML = "HoloPlay Service running. Version: " + data['version'];
        if (data.error != 0) {
          // error codes
          document.getElementById("lkg-status").innerHTML = "HoloPlay Service error. Error code: " + data.error.toString();

        } else if (data.devices.length === 0) {
          // no lkg
          document.getElementById("lkg-status").innerHTML = "No Looking Glass connected.";
        } else if (data.devices[0].state == "nocalibration") {
          document.getElementById("calibration").innerHTML = "Error loading calibration, please restart HoloPlay Service and reconnect the cables of Looking Glass.";
        } else {
          // there is lkg 
          const lkgCount = data.devices.length;
          document.getElementById("lkg-status").innerHTML = (lkgCount.toString() + " Looking Glass connected.");
          for (var i=0; i<lkgCount; i++) {
            document.getElementById("calibration").innerHTML += "\n// Calibration for Looking Glass " + i +"\n";
            const calibration = JSON.stringify(data.devices[i].calibration, null, 2);
            document.getElementById("calibration").innerHTML += calibration;
          }
        }
      }

export const sendHologramMessage = async () => {
	const infoMsg = new HoloPlayCore.InfoMessage()
	await client.sendMessage(infoMsg)
	// "error": 0,
	// "version": "1.0.0",
	// "devices": [
	//   {
	// 	"hwid": "LKG030nffpp24",
	// 	"state": "hidden",
	// 	"windowCoords": [1920, 0],
	// 	"hardwareVersion": "standard",
	// 	"buttons": {
	// 	  [0, 0, 0, 0]
	// 	}
	// 	"calibration": {
	// 	  "pitch": 50.060001373291016,
	// 	  "slope": -7.7369561195373535,
	// 	  "center": 0.26147353649139404,
	//   ...
	// 	}
	//   {
	// ]
	
}

// Takes the ThreeJS scene and creates the quilt format
export const createQuilt = () => {

}

export const createHolographicScene = () => {

	// the holoplay renderer should act as your THREE.WebGLRenderer
	const renderer = new HoloPlayCore.Renderer()
	renderer.webglRenderer.shadowMap.enabled = true
	renderer.webglRenderer.shadowMap.autoUpdate = false
	renderer.webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap


	// the holoplay camera should be used like a THREE.PerspectiveCamera
	const camera = new HoloPlayCore.Camera()
	camera.add( new THREE.PointLight( 0xffffff, 0.8 ) )
	// camera.lookAt( { x: videoWidth / 2, y: -videoHeight / 2, z: 0, isVector3: true } )

	// add the renderer's canvas to your web page (it will size to fill the page)
	document.body.appendChild(renderer.domElement)
	
	return renderer
}

export const renderHolographicScene = () => {
	renderer.render(scene, camera)
}

export const createHologram = () => {

}

export const observeLookingGlassButtons = () => {

	// HoloPlay.Buttons will emit events when the display's buttons are touched
	const buttons = new HoloPlay.Buttons()
	buttons.addEventListener('buttonPressed', (e) => {
	switch (e.detail.name) 
	{
		case 'left':
		camera.rotation.y -= 0.002
		break

		case 'right':
		camera.rotation.y += 0.002
		break

		case 'square':
		if (camera.position.z > 0.2) {
			camera.position.z -= 0.01
		}
		break

		case 'circle':
		if (camera.position.z < 100) {
			camera.position.z += 0.01
		}
		break
	}
	})

}