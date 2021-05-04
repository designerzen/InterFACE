// This is the Looking Glass Factgory Portrait Display SDK API
// https://docs.lookingglassfactory.com/HoloPlayCore/holoplaycorejs/

import * as HoloPlayCore from './node_modules/holoplay-core/dist/holoplaycore.module.js'
  
// This isn't loaded in automatically but is loaded if a flag is set
// That way it should degrade nicely for those with only 2D displays
export const createHologram = () => {
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