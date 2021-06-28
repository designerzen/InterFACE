// const cam = (video) => {

// 	video = video || document.createElement('video')

// 	const stream = await navigator.mediaDevices.getUserMedia({
// 	  audio: false,
// 	  video: {
// 		facingMode: 'user',
// 		width: 640,
// 		height: 640
// 	  }
// 	})

// 	video.srcObject = stream
// }

// export const hasCameraCapabilities = () => {

// }
export const filterVideoCameras = (devices) => {
	
	return devices.filter( device => {
		// console.log("filterVideoCameras", device.kind, device.kind === "videoinput" , device)
		return device.kind === "videoinput"
		
	})
}

export const setupCamera = async (video, deviceId ) => {

	return new Promise( async (resolve,reject) => {
		
		let stream
		video = video ?? document.createElement('video')

		// stop it if it is already running?
		//video.stop()

		video.onloadedmetadata = (event) => { 
			
			// if not from a user document interaction, this
			// will throw some blah blah error so we must wrap and re-act
			try{
				video.play()
				video.width = video.videoWidth
				video.height = video.videoHeight
				resolve(stream)	
			}catch(error){
				reject(stream)
			}
			
		}

		video.onerror = event => {
			console.error("VIDEO:Error", event)
			reject(stream)
		}
		
		const videoConstraints = {}
		if (deviceId) {
		  videoConstraints.deviceId = { exact: deviceId }
		} else {
		  videoConstraints.facingMode = 'user' // 'environment'
		}

		const constraints = {
		  video: videoConstraints,
		  audio: false
		}

		try{
			// hope and preay that this is the right camera...
			stream = await navigator.mediaDevices.getUserMedia( constraints )
			
			video.srcObject = stream
			
		}catch(error){
			// console.error("stream",{constraints,stream,video})
	
			reject(error)
		}
	})
}

let cameraLoading = false

export const loadCamera = async (video, deviceId, name="Default") => {
	let newCamera
	// prevent screen re-draw
	cameraLoading = true
	try{
		
		if (deviceId && deviceId.length > 0)
		{
			newCamera = await setupCamera( video, deviceId )
		
			// store.setItem( 'camera', {deviceId} )
			// console.log( deviceId, "Camera id saved")
			// track('Action', {category:'Camera', label:name, value:deviceId})
			
		}else{

			console.log( deviceId, "Camera unfound", {video,deviceId})
			throw Error("Camera Device not specified "+ deviceId )
		}
		 
					
	}catch(error){
		// console.error( deviceId, "Camera errored", error)
		// trackError( `${name} camera could not be accessed`, deviceId, "Camera" )
		throw error
	}
	
	cameraLoading = false
	return newCamera
}

export const findBestCamera = async (store, video) => {

	let camera
	let log 
	let saved = false

	const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
			
	// first fetch all cameras!
	const videoCameraDevices = filterVideoCameras( await detectCameras() )
	
	// 1st point of failure is if there are no cameras at all...
	if (videoCameraDevices.length < 1)
	{
		throw Error("No Cameras found on this device")
	}
	
	// the deviceId is only a suggestion as the camera may well have been removed
	// since the last time that the app was used or may have changed names

	// we do not have any device id so attempt to load the default 
	if (!deviceId)
	{
		try{
			camera = await setupCamera( video )
			return {
				camera, log, videoCameraDevices, saved
			}
		}catch(error){
			// next...
			console.log("default camera not found")
		}
	}

	// a saved device ID was found let's test to see if it works...
	try{
		camera = await loadCamera(video, deviceId, "Saved")
		log = "Camera Found"
		saved = true
	
	}catch( error ) {

		// delete saved key as was invalid...
		store.removeItem('camera')

		// bummer! try and use fallback?
	
		// loop through and try the others?
		log = "Could not open saved camera, but found others..."
		camera = await setupCamera( video )
	}

	return {
		camera,
		log,
		videoCameraDevices,
		saved
	}
}

// WARNING : Triggers an error if not from a user click!?
// This returns a list of IDS that you can then feed into the setupCamera
// if you want to select a specific camera
export const detectCameras = async () => {
	return navigator.mediaDevices.enumerateDevices()
}
