export const ERROR_NO_CAMERAS = "No Cameras found on this device"

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
	const allCameras = await detectCameras()
	return filterVideoCameras( allCameras )
}

/**
 * Bind a video element to a camera
 * @param {HTMLElement} video - A video HTMLElement NB. If not specified a new video element is created in the DOM
 * @param {?string} deviceId - Device ID unique to the camera to try to access first if provided
 * @returns {Promise} video stream is returned if successfull
 */
export const setupCamera = async (video, deviceId, enableAudio=false ) => new Promise( async (resolve,reject) => {
		
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
	video.onerror = event => reject(stream)
	
	const videoConstraints = {}
	if (deviceId) {
		videoConstraints.deviceId = { exact: deviceId }
	} else {
		videoConstraints.facingMode = 'user' // 'environment'
	}

	const constraints = {
		video: videoConstraints,
		audio: enableAudio
	}
	
	try{
		// hope and pray that this is the right camera...
		// NB. FIXME: If the camera is already in use this can take forever
		// and so can hang here - let's add some protection
		const BAD_RESULT = "BAD_RESULT"
		stream = await navigator.mediaDevices.getUserMedia( constraints )
		//stream = navigator.mediaDevices.getUserMedia( constraints )
		const timeout = new Promise((complete) => {
			setTimeout(complete, 5000, BAD_RESULT)
		})
		const result = await Promise.race([ timeout, stream ])
	
		// FIXME: "Failed to set the 'srcObject' property on 'HTMLMediaElement': 
		// Failed to convert value to 'MediaStream'."
		if (result === BAD_RESULT){
			reject("Camera was located but could not be accessed - perhaps it is being used by another page?")
		}else{
			video.srcObject = stream
		}

		// console.log("setupCamera", {constraints, stream})
		
	}catch(error){

		console.error("Camera:Error > ",{constraints,stream,video,error})
		reject(error)
	}
})


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
		
		if (deviceId.length > 0)
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

		// Error: NotReadableError: Could not start video source
		// NotAllowedError: Permission denied
		const errorReason = String(error)
								.replace("NotAllowedError: ",'')
								.replace("NotReadableError: ",'')
	
		// console.error( deviceId, "Camera errored", error)
		// trackError( `${name} camera could not be accessed`, deviceId, "Camera" )
		throw Error(errorReason)
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
export const findBestCamera = async (store, video, onStatus) => {
		
	// first fetch all cameras - array of these objects
	// deviceId: "d3071f102b089a7c24ad1aefc6dc7ab9a22d2707e53c891f6dc5bd9ad182dc70"
	// groupId: "2416e346fdaf93298be3415c78df5eebb51c4945a7c910743406c3cd23eeb004"
	// kind: "videoinput"
	// label: "DroidCam Source 3"
	let videoCameraDevices
	try{
		videoCameraDevices = await fetchVideoCameras()
	}catch(error){
		// Could not access *any* devices
		throw Error(error)
	}

	// 1st point of failure is if there are no cameras at all...
	if (videoCameraDevices.length < 1)
	{
		throw Error(ERROR_NO_CAMERAS)
	}

	let camera
	let saved = false
	const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
	const attempts = {}
	
	// try and find if there is video camera with that ID available...
	// the deviceId is only a suggestion as the camera may well have been removed
	// since the last time that the app was used or may have changed names
	const matches = videoCameraDevices.filter( videoCamera => videoCamera.deviceId === deviceId )
	
	// we do not have any device id so attempt to load the default 
	if (!deviceId || matches.length < 1)
	{
		try{
			camera = await setupCamera( video )
			return {
				camera, videoCameraDevices, saved, attempts
			}
		}catch(error){
			
			onStatus && onStatus("default camera not found")
		}
	}

	if (matches.length > 0)
	{
		// a saved device ID was found let's test to see if it works...
		onStatus && onStatus(`Attempting to connect to saved camera <strong>${matches[0].label}</strong>...` )
		try{
			camera = await loadCamera(video, deviceId, "Saved")
			saved = true
			return {
				camera,
				videoCameraDevices,
				saved, attempts
			}
		
		}catch( error ) {

			// delete saved key as was invalid...
			store.removeItem('camera')
			saved = false
			attempts[deviceId] = false
	
			// bummer! try and use fallback?
			onStatus && onStatus(`Found saved camera <strong>${matches[0].label}</strong> but could not access it` )
			console.error("Couldn't access saved camera - removed from store", errorReason )
		}

	}else{
		// this camera is no longer available on this device so remove from the system?
		store.removeItem('camera')
		saved = false
		attempts[deviceId] = false
		onStatus && onStatus("Saved camera no longer available on this device" )
	}

	// front facing next
	try{
		camera = await loadCamera(video, undefined, "Front-Facing")
		return {
			camera,
			videoCameraDevices,
			saved, attempts
		}
	}catch(error){
		onStatus && onStatus("No front facing camera found on this device" )
	}

	// should we filter these based on certain names?
	// desperation! loop through and try the others?
	const filteredDevices = videoCameraDevices.filter( videoCamera => videoCamera.deviceId !== deviceId )
	for (let i=0; i<filteredDevices.length; ++i)
	{
		const videoCameraDevice = filteredDevices[i]
		try{
			onStatus && onStatus( `Found another camera <br><strong>${videoCameraDevice.label}</strong>` )
			camera = await setupCamera( video, videoCameraDevice.deviceId )
			return {
				camera,
				videoCameraDevices,
				saved, attempts
			}
		}catch(error){
			attempts[videoCameraDevice.deviceId] = false
			//console.error(error)
			onStatus && onStatus(`Camera <strong>${videoCameraDevice.label}</strong> was denied access` )
		}
		// pause to show error and to allow camera hardware to rest
		await new Promise(resolve=>setTimeout(resolve, 900))
	}
	
	// still here huh? 
	// so, we tried the saved camera, that didn't work
	// we tried the forward facing cam, that didn't work
	// then we tried the remaining cameras too!
	onStatus && onStatus( "No cameras accessible!" )
	throw Error("There was no access to the cameras on this machine, <strong>suspect the permission was denied</strong>")
}
