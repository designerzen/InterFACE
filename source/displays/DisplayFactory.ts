import type { IDisplay } from './IDisplay'
import { DISPLAY_BACKEND, type DisplayBackendId } from './DisplayTypes'

// helper for lazy loading of classes
const loadDisplayClass = async (type: DisplayBackendId) => {
    switch (type) {
        case DISPLAY_BACKEND.CANVAS2D: {
            const { DisplayCanvas2d } = await import('./DisplayCanvas2d')
            return { default: DisplayCanvas2d }
        }
        case DISPLAY_BACKEND.WEBGPU: {
            const { DisplayWebGPU } = await import('./DisplayWebGPU')
            return { default: DisplayWebGPU }
        }
        case DISPLAY_BACKEND.THREE3D: {
            const { default: DisplayThree3D } = await import('./DisplayThree3d')
            return { default: DisplayThree3D }
        }
        case DISPLAY_BACKEND.WEBGL3D: {
            const { default: DisplayWebGL3D } = await import('./DisplayWebGL3d')
            return { default: DisplayWebGL3D }
        }
        case DISPLAY_BACKEND.BABYLON3D: {
            const { default: DisplayBabylon3D } = await import('./DisplayBabylon3d')
            return { default: DisplayBabylon3D }
        }
        case DISPLAY_BACKEND.LOOKINGGLASS3D: {
            const { default: DisplayLookingGlass3D, requiredXRSetupForLookingGlass } = await import('./DisplayLookingGlass3d')
            return { default: DisplayLookingGlass3D, before: requiredXRSetupForLookingGlass }
        }
        case DISPLAY_BACKEND.THREEWEBGPU_TSL: {
            const { default: DisplayWebGPU } = await import('./DisplayWebGPU')
            return { default: DisplayWebGPU }
        }
        case DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL: {
            const { default: DisplayLookingGlassWebGPU_TSL, requiredXRSetupForLookingGlassWebGPU } = await import('./DisplayLookingGlassWebGPU_TSL')
            return { default: DisplayLookingGlassWebGPU_TSL, before: requiredXRSetupForLookingGlassWebGPU }
        }
        default:
            throw new Error(`Unknown display type: ${type}`)
    }
}

export type FactoryFn = (canvas: HTMLCanvasElement) => Promise<IDisplay> | IDisplay

export class DisplayFactory {
    private static factories: Record<DisplayBackendId, FactoryFn> = {} as any

    static register(id: DisplayBackendId, factory: FactoryFn) {
        this.factories[id] = factory
    }

    static async create(id: DisplayBackendId, canvas: HTMLCanvasElement): Promise<IDisplay> {
        const factory = this.factories[id]
        if (!factory) {
            throw new Error(`DisplayFactory: No factory registered for backend "${id}"`)
        }
        return await factory(canvas)
    }
}

// capability detection helpers
const canUseWebGPU = (): boolean => {
    return 'gpu' in navigator
}

const canUseWebGL = (canvas: HTMLCanvasElement): boolean => {
    try {
        return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'))
    } catch {
        return false
    }
}

const canUseWebXR = (): boolean => {
    return 'xr' in navigator
}

// register defaults
const registerDefaults = () => {
    // Canvas2D is always available :)
    DisplayFactory.register(DISPLAY_BACKEND.CANVAS2D, async (canvas) => {
        const { default: DisplayCanvas2d } = await loadDisplayClass(DISPLAY_BACKEND.CANVAS2D) as { default: typeof import('./DisplayCanvas2d').DisplayCanvas2d }
        return new DisplayCanvas2d(canvas, window.innerWidth, window.innerHeight) as unknown as IDisplay
    })

    // WebGPU - test if supported
    if (canUseWebGPU()) {
        DisplayFactory.register(DISPLAY_BACKEND.WEBGPU, async (canvas) => {
            const { default: DisplayWebGPU } = await loadDisplayClass(DISPLAY_BACKEND.WEBGPU) as { default: typeof import('./DisplayWebGPU').DisplayWebGPU }
            const display = new DisplayWebGPU(canvas, window.innerWidth, window.innerHeight)
            return display
        })

        DisplayFactory.register(DISPLAY_BACKEND.THREEWEBGPU_TSL, async (canvas) => {
            const { default: DisplayWebGPU } = await loadDisplayClass(DISPLAY_BACKEND.THREEWEBGPU_TSL) as { default: typeof import('./DisplayWebGPU').default }
            return new DisplayWebGPU(canvas, window.innerWidth, window.innerHeight)
        })
    }

    // WebGL - test if supported (used by Three.js, Babylon.js, and WebGL3D)
    if (canUseWebGL(document.createElement('canvas'))) {
        DisplayFactory.register(DISPLAY_BACKEND.THREE3D, async (canvas) => {
            const { default: DisplayThree3D } = await loadDisplayClass(DISPLAY_BACKEND.THREE3D) as { default: typeof import('./DisplayThree3d').default }
            return new DisplayThree3D(canvas, window.innerWidth, window.innerHeight)
        })

        DisplayFactory.register(DISPLAY_BACKEND.WEBGL3D, async (canvas) => {
            const { default: DisplayWebGL3D } = await loadDisplayClass(DISPLAY_BACKEND.WEBGL3D) as { default: typeof import('./DisplayWebGL3d').default }
            return new DisplayWebGL3D(canvas, window.innerWidth, window.innerHeight)
        })

        DisplayFactory.register(DISPLAY_BACKEND.BABYLON3D, async (canvas) => {
            const { default: DisplayBabylon3D } = await loadDisplayClass(DISPLAY_BACKEND.BABYLON3D) as { default: typeof import('./DisplayBabylon3d').default }
            return new DisplayBabylon3D(canvas, window.innerWidth, window.innerHeight)
        })
    }

    // LookingGlass3D - test if WebXR is supported
    if (canUseWebXR()) {
        DisplayFactory.register(DISPLAY_BACKEND.LOOKINGGLASS3D, async (canvas) => {
            const { default: DisplayLookingGlass3D, before } = await loadDisplayClass(DISPLAY_BACKEND.LOOKINGGLASS3D) as { default: typeof import('./DisplayLookingGlass3d').default, before?: () => any }
            const options: any = {}
            if (before) options.lookingGlassWebXR = before()
            return new DisplayLookingGlass3D(canvas, window.innerWidth, window.innerHeight, options)
        })

        // LookingGlass3D with WebGPU/TSL - requires both WebGPU and WebXR
        if (canUseWebGPU()) {
            DisplayFactory.register(DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL, async (canvas) => {
                const { default: DisplayLookingGlassWebGPU_TSL, before } = await loadDisplayClass(DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL) as { default: typeof import('./DisplayLookingGlassWebGPU_TSL').default, before?: () => any }
                const options: any = {}
                if (before) options.lookingGlassWebXR = before()
                return new DisplayLookingGlassWebGPU_TSL(canvas, window.innerWidth, window.innerHeight, options)
            })
        }
    }
}

registerDefaults()
