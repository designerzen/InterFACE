// after X amount of frames we move the face button
export const UPDATE_FACE_BUTTON_AFTER_FRAMES = 750 * 100

export const KEYPOINT_QUANTITY = 478

export const DEAFULT_OPTIONS_DISPLAY = {
	debug:false,
	stats:false,
	
	// flip video axis
	flipX:true,
	flipY:false,

	targetFrameRate: 60,
	
	blendShapes:true,
	updateFaceButtonAfter:UPDATE_FACE_BUTTON_AFTER_FRAMES
}

// Specific to WebGL / GPU Displays
export const DEFAULT_OPTIONS_DISPLAY_COMPOSITE = {
	...DEAFULT_OPTIONS_DISPLAY,

	colour:0xff44ee,
	quantity: KEYPOINT_QUANTITY * 3,
	fx:true,
	antialias: true, 
	alpha: true,
	lightColour:0xcccccc,
	lightIntensity: 0.7,
	fog:false,
	particeSize:0.03,
	opacity:1,
	mouse:false,

	// voxels
	showParticles:true,
	// geometry subdivision for denser particles (0 = disabled, 1 = double density, 2 = 4x, etc)
	geometrySubdivisions: 0,

	showWalls: false,
	adaptiveGeometrySubdivisions: true,
	
	minimumStableFrameRate: 54,
	frameRateSampleFrames: 90,
	maximumDroppedFrameRatio: 0.1,
	droppedFrameMultiplier: 1.5,
	adaptiveSubdivisionCooldown: 1500,

	// 3d model!
	showAvatar:false,
	avatarOpacity:0.38,
	avatarScaleMultiplier:1.35,
	avatarYOffset:0,
	avatarZOffset:0.055,
	avatarAlignmentSmoothing:0.42
}
