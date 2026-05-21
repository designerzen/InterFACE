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
    DISPLAY_MEDIA_PIPE_2D,
    DISPLAY_WEB_GL_3D,
    DISPLAY_WEB_GPU_3D,
    DISPLAY_THREE_WEBGPU_PARTICLE,
    DISPLAY_BABYLON_3D,
    DISPLAY_MEDIA_VISION_2D,
    DISPLAY_LOOKING_GLASS_3D,
    DISPLAY_LOOKING_GLASS_WEBGPU,
    DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL,
    DISPLAY_CANVAS_2D,
    DISPLAY_COMPOSITE
} as const

export const DISPLAY_BACKEND = {
    CANVAS2D: 'canvas2d',
    WEBGPU: 'webgpu',
    THREE3D: 'three3d',
    WEBGL3D: 'webgl3d',
    LOOKINGGLASS3D: 'lookingglass3d',
    BABYLON3D: 'babylon3d',
    THREEWEBGPU_TSL: 'threewebgpu-tsl',
    LOOKINGGLASS3D_WEBGPU_TSL: 'lookingglass3d-webgpu-tsl'
} as const

export type DisplayBackendId = typeof DISPLAY_BACKEND[keyof typeof DISPLAY_BACKEND]

export const DEFAULT_DISPLAY_BACKEND: DisplayBackendId = DISPLAY_BACKEND.CANVAS2D

export interface DisplayConfig {
    label: string
    colors: {
        face: string
        hands: string
    }
}

export const DISPLAY_CONFIGS: Record<string, DisplayConfig> = {
    [DISPLAY_BACKEND.CANVAS2D]: {
        label: 'Canvas 2D',
        colors: { face: '#ff0055', hands: '#00ffcc' }
    },
    [DISPLAY_BACKEND.WEBGPU]: {
        label: 'WebGPU (Experimental)',
        colors: { face: '#00aaff', hands: '#aa00ff' }
    },
    [DISPLAY_BACKEND.THREE3D]: {
        label: 'Three.js 3D',
        colors: { face: '#00ff88', hands: '#ffcc00' }
    },
    [DISPLAY_BACKEND.WEBGL3D]: {
        label: 'WebGL 3D (Raw)',
        colors: { face: '#8888ff', hands: '#ffff00' }
    },
    [DISPLAY_BACKEND.LOOKINGGLASS3D]: {
        label: 'Looking Glass 3D',
        colors: { face: '#ff8800', hands: '#ff00cc' }
    },
    [DISPLAY_BACKEND.BABYLON3D]: {
        label: 'Babylon.js 3D',
        colors: { face: '#33ff33', hands: '#ff33ff' }
    },
    [DISPLAY_BACKEND.THREEWEBGPU_TSL]: {
        label: 'Three.js WebGPU TSL',
        colors: { face: '#ff6600', hands: '#0066ff' }
    },
    [DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL]: {
        label: 'Looking Glass 3D (WebGPU TSL)',
        colors: { face: '#ff8800', hands: '#ff00cc' }
    }
}
