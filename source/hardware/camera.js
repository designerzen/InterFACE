
let cameraLoading = false

/**
 * This returns a list of IDS that you can then feed into the setupCamera,
 * for if you want to select a specific camera
 * WARNING : Triggers an error if not from a user interaction!
 * @returns {Array<Object>} All camera device objects on this device
 */
export const detectCameras = async () => navigator.mediaDevices.enumerateDevices()

/**
 * filters a list of local cameras to only return videoinputs kinds of camera devices
 * @param {Array<string>} devices Array of video input camera devices
 * @returns {Array<Object>} Collection of video input camera device objects
 */
export const filterVideoCameras = (devices) => devices.filter( device => device.kind === "videoinput" )

/**
 * finds all local cameras and filters them to only return kind of videoinputs
 * @returns {Array<Object>} Collection of video input camera device objects
 */
export const fetchVideoCameras = async() => {
	filterVideoCameras( await detectCameras() )
}

/**
 * Bind a video element to a camera
 * @param {HTMLElement} video A video HTMLElement NB. If not specified a new video element is created in the DOM
 * @param {string} deviceId Device ID unique to the camera to try to access first if provided
 * @returns {Promise} video stream is returned if successfull
 */
export const setupCamera = async (video, deviceId ) => {

	return new Promise( async (resolve,reject) => {
		
		let stream
		video = video ?? document.createElement('video')

		// stop it if it is already running?
		// video.stop()

		let loadCount = 2
		const checkVideoAccess = () => {
			if (--loadCount <= 0)
			{
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
		}

		// FIXED: This was suggested to use rather than meta
		video.onloadedmetadata = (event) => checkVideoAccess()
		video.onloadeddata = (event) => checkVideoAccess()

		video.onerror = event => {
			console.error("VIDEO:Connection Error", event)
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

/**
 * Requests access to a specific device
 * @param {HTMLElement} video A video HTMLElement NB. If not specified a new video element is created in the DOM
 * @param {String} deviceId Device ID unique to the camera to try to access first if provided
 * @param {?String} name Optional name to bind to the camera
 * @returns {Promise} video stream is returned if successfull
 */
export const loadCamera = async (video, deviceId, name="Default") => {

	let newCamera

	// prevent screen re-draw during camera loading
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

/**
 * Try and determine which camera would be best suited for this app
 * @param {?HTMLElement} store A video HTMLElement NB. If not specified a new video element is created in the DOM
 * @param {?HTMLElement} video A video HTMLElement NB. If not specified a new video element is created in the DOM
* @returns {Object} best camera, all cameras, using saved device?
 */
export const findBestCamera = async (store, video) => {

	let camera
	let saved = false

	const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
			
	// first fetch all cameras!
	const videoCameraDevices = fetchVideoCameras()
	
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
				camera, videoCameraDevices, saved
			}
		}catch(error){
			// next...
			// console.log("default camera not found")
		}
	}

	// a saved device ID was found let's test to see if it works...
	try{
		camera = await loadCamera(video, deviceId, "Saved")
		saved = true
	
	}catch( error ) {

		// delete saved key as was invalid...
		store.removeItem('camera')
		saved = false

		// bummer! try and use fallback?
	
		// loop through and try the others?
		camera = await setupCamera( video )
	}

	return {
		camera,
		videoCameraDevices,
		saved
	}
}
