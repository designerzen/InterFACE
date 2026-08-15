export const ERROR_MESSAGES = Object.freeze({
	'camera-permission-denied': Object.freeze({
		title:'Camera access blocked',
		problem:'PhotoSYNTH does not have permission to use your camera.',
		solution:'Allow camera access in your browser or device settings, then try again.',
		primaryAction:'Try again',
		secondaryAction:'Camera help',
	}),
	'camera-not-found': Object.freeze({
		title:'No camera found',
		problem:'PhotoSYNTH could not find a camera on this device.',
		solution:'Connect or enable a camera, then try again.',
		primaryAction:'Try again',
		secondaryAction:'Camera help',
	}),
	'camera-in-use': Object.freeze({
		title:'Camera is unavailable',
		problem:'Another application may be using your camera.',
		solution:'Close other camera applications, then try again.',
		primaryAction:'Try again',
		secondaryAction:'Camera help',
	}),
	'camera-unavailable': Object.freeze({
		title:'Camera unavailable',
		problem:'PhotoSYNTH could not start your camera.',
		solution:'Check that the camera is connected and enabled, then try again.',
		primaryAction:'Try again',
		secondaryAction:'Camera help',
	}),
})

export const ERROR_INTERFACE = Object.freeze({
	detailsLabel:'Technical details',
	cameraHelpLabel:'How to enable camera access',
	cameraHelp:'Open your browser or device privacy settings, allow camera access for PhotoSYNTH, and make sure no other application is using the camera.',
	closeAction:'Return',
})
