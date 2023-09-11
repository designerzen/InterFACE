/**
 * Load in different displays to use as the front end.
 * 
 * There are differernt displays depending on which library is used
 * and which hardware is available.
 * 
 * The WebXR version has an extra holographic mode too
 */

export const DISPLAY_COMPOSITE = "DisplayComposite"
export const DISPLAY_CANVAS_2D = "DisplayCanvas2D"
export const DISPLAY_MEDIA_PIPE_2D = "DisplayMediaPipe2D"
export const DISPLAY_MEDIA_VISION_2D = "DisplayMediaVision2D"
export const DISPLAY_WEB_GL_3D = "DisplayWebGL3D"
export const DISPLAY_LOOKING_GLASS_3D = "DisplayLookingGlass3D"

export const loadDisplay = async( type ) => {
	switch(type)
	{
		// FIXME: Face detection has dependency clash
		// case DISPLAY_CANVAS_2D: 
		// 	const {Display2D} = await import('./display-canvas-2d.js')
		// 	return Display2D
		case DISPLAY_MEDIA_PIPE_2D: 
			const { default:DisplayMediaPipe2D} = await import('./display-mediapipe-2d.js')
			return DisplayMediaPipe2D

		case DISPLAY_COMPOSITE: 
			const { default:DisplayComposite} = await import('./display-composite.js')
			return DisplayComposite

		case DISPLAY_MEDIA_VISION_2D: 
			const { default:DisplayMediaVision2D} = await import('./display-mediavision-2d.js')
			return DisplayMediaVision2D

		case DISPLAY_WEB_GL_3D: 
			const { default:DisplayWebGL3D } = await import( './display-webgl-3d.js')
			return DisplayWebGL3D

		case DISPLAY_LOOKING_GLASS_3D: 
			const { default:DisplayLookingGlass3D } = await import( './display-looking-glass-3d.js')
			return DisplayLookingGlass3D
	}
}