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

// Stable IDs keep saved URLs working; captions describe the actual backend.
export const DISPLAY_LABELS = {
	[DISPLAY_COMPOSITE]: 'Composite — multiple displays',
	[DISPLAY_CANVAS_2D]: 'Canvas 2D — visualisers and overlays',
	[DISPLAY_MEDIA_VISION_2D]: 'Face 2D',
	[DISPLAY_MEDIA_PIPE_2D]: 'Face 2D — legacy preset',
	[DISPLAY_WEB_GL_3D]: 'WebGL 2 — face mesh',
	[DISPLAY_WEB_GPU_3D]: 'WebGPU — face particles (experimental)',
	[DISPLAY_BABYLON_3D]: 'Babylon — 3D face particles',
	[DISPLAY_THREE_WEBGPU_PARTICLE]: 'Three — WebGL 2 particles',
	[DISPLAY_LOOKING_GLASS_3D]: 'Looking Glass — Three WebGL 2',
	[DISPLAY_LOOKING_GLASS_WEBGPU]: 'Looking Glass Portrait',
	[DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL]: 'Looking Glass — legacy TSL preset (WebGL 2)'
}
