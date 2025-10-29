// after X amount of frames we move the face button
export const UPDATE_FACE_BUTTON_AFTER_FRAMES = 750

export const KEYPOINT_QUANTITY = 478

export const DEFAULT_OPTIONS_DISPLAY_WEBGL = {
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
	debug:false,
	stats:false,
	// voxels
	showParticles:true,
	// 3d model
	showAvatar:false,
	blendShapes:true,
	updateFaceButtonAfter:UPDATE_FACE_BUTTON_AFTER_FRAMES
}
