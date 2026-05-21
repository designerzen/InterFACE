// @ts-nocheck
/**
 * Looking Glass Portrait Display with WebGPU and TSL
 * 
 * Holographic 3D display using Looking Glass Portrait hardware with WebXR and WebGPU/TSL
 */

import { LookingGlassWebXRPolyfill } from '@lookingglass/webxr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

import DisplayWebGPU from './DisplayWebGPU'
import { DISPLAY_BACKEND } from './DisplayTypes'

import type { DisplayOptions } from './types'
import type { IDisplay } from './IDisplay'

// Settings
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

let openXRButton: HTMLElement | null = null

export const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL: DisplayOptions = {
  controls: '#shared-controls',
}

export const createXRToggleButtonWebGPU = (renderer: any, destination: HTMLElement): HTMLElement | null => {
  if (openXRButton) {
    destination.append(openXRButton)
    return openXRButton
  }
  openXRButton = VRButton.createButton(renderer)
  if (openXRButton) {
    openXRButton.style.cssText = ''
    openXRButton.setAttribute('type', 'button')
    destination.append(openXRButton)
  }
  return openXRButton
}

let hasXRBeenPolyfilled = false
let lookingGlassWebXR: LookingGlassWebXRPolyfill | null = null

/**
 * Setup required for Looking Glass WebXR polyfill (WebGPU variant)
 */
export const requiredXRSetupForLookingGlassWebGPU = (): LookingGlassWebXRPolyfill | null => {
  if (!hasXRBeenPolyfilled) {
    hasXRBeenPolyfilled = true

    const lookingGlassConfig: any = {
      tileHeight: 512,
      numViews: 45,
      depthiness: 0.7,
      targetX: 0,
      targetY: 0,
      targetZ: 1.5,
      targetDiam: 2,
      fovy: (16 * Math.PI) / 180,
      inlineView: 'quilt',
    }

    lookingGlassWebXR = new LookingGlassWebXRPolyfill(lookingGlassConfig)
  }
  return lookingGlassWebXR
}

/**
 * Three.js Based Looking Glass 3D Display with WebXR and WebGPU/TSL.
 * WebGPU-backed Looking Glass-compatible display facade.
 */
export default class DisplayLookingGlassWebGPU_TSL extends DisplayWebGPU implements IDisplay {
  name: string = DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL;

  isButtonFullSize: boolean = false
  lookingGlassWebXR: LookingGlassWebXRPolyfill | null = null
  controls: HTMLElement | null = null

  constructor(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    initialWidth: number = LOOKING_GLASS_PORTRAIT_WIDTH,
    initialHeight: number = LOOKING_GLASS_PORTRAIT_HEIGHT,
    options: DisplayOptions = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL
  ) {
    options = { ...DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL, ...options }
    super(canvas, initialWidth, initialHeight, options)
  }

  async create(_canvas: HTMLCanvasElement | OffscreenCanvas, options: DisplayOptions): Promise<boolean> {
    if (options.lookingGlassWebXR) {
      this.lookingGlassWebXR = options.lookingGlassWebXR
    } else {
      this.lookingGlassWebXR = requiredXRSetupForLookingGlassWebGPU()
    }

    return true
  }

  render(): void {
    super.render()
  }

  async destroy(): Promise<void> {
    this.lookingGlassWebXR = null
    await super.destroy()
  }
}
