import DisplayLookingGlassWebGPU, { requiredXRSetupForLookingGlass } from './display-looking-glass-webgpu.js'
import { DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL } from './display-types.js'

// Preserve saved IDs while consolidating the duplicate WebGL implementation.
export const requiredXRSetupForLookingGlassWebGPU = requiredXRSetupForLookingGlass
export default class DisplayLookingGlass3DWebGPUTSL extends DisplayLookingGlassWebGPU {
 name = DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL
 get type(){ return DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL }
}
