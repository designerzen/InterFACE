export const DISPLAY_MEDIA_PIPE_2D = "DisplayMediaPipe2D"
export const DISPLAY_WEB_GL_3D = "DisplayWebGL3D"
export const DISPLAY_WEB_GPU_3D = "DisplayWebGPU3D"
export const DISPLAY_THREE_WEBGPU_PARTICLE = "DisplayThreeWebGPUParticle"
export const DISPLAY_BABYLON_3D = "DisplayBabylon3D"
export const DISPLAY_MEDIA_VISION_2D = "DisplayMediaVision2D"
export const DISPLAY_LOOKING_GLASS_3D = "DisplayLookingGlass3D"
export const DISPLAY_LOOKING_GLASS_WEBGPU = "DisplayLookingGlassWebGPU"
export const DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL = "DisplayLookingGlass3DWebGPUTSL"
export const DISPLAY_CANVAS_2D = "DisplayCanvas2D"
export const DISPLAY_COMPOSITE = "DisplayComposite"

export const DISPLAY_TYPES = {
	DISPLAY_MEDIA_VISION_2D, 
	DISPLAY_MEDIA_PIPE_2D,
	DISPLAY_LOOKING_GLASS_3D, 
	DISPLAY_LOOKING_GLASS_WEBGPU,
	DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL,
	DISPLAY_WEB_GL_3D, 
	DISPLAY_WEB_GPU_3D,
	DISPLAY_BABYLON_3D,
	DISPLAY_THREE_WEBGPU_PARTICLE,
	DISPLAY_CANVAS_2D,
	DISPLAY_COMPOSITE
}

export const DISPLAY_IDS = Object.values(DISPLAY_TYPES)

// Stable IDs keep saved URLs working; captions describe what people see.
export const DISPLAY_LABELS = {
	[DISPLAY_COMPOSITE]: 'Multiple views',
	[DISPLAY_CANVAS_2D]: 'Visualisers and overlays',
	[DISPLAY_MEDIA_VISION_2D]: 'Face tracking',
	[DISPLAY_MEDIA_PIPE_2D]: 'Face tracking (classic)',
	[DISPLAY_WEB_GL_3D]: '3D face mesh',
	[DISPLAY_WEB_GPU_3D]: 'Face particles (WebGPU, experimental)',
	[DISPLAY_BABYLON_3D]: '3D face particles (Babylon)',
	[DISPLAY_THREE_WEBGPU_PARTICLE]: 'Face particles (Three.js)',
	[DISPLAY_LOOKING_GLASS_3D]: 'Looking Glass Portrait (classic)',
	[DISPLAY_LOOKING_GLASS_WEBGPU]: 'Looking Glass Portrait',
	[DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL]: 'Looking Glass Portrait (classic 3D)'
}
