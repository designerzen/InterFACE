// @ts-nocheck
/**
 * Looking Glass Portrait Display
 * 
 * Holographic 3D display using Looking Glass Portrait hardware with WebXR
 */

import { LookingGlassWebXRPolyfill } from '@lookingglass/webxr'
import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

import DisplayThree3D, { DEFAULT_OPTIONS_DISPLAY_THREE } from './DisplayThree3d'
import { DISPLAY_BACKEND } from './DisplayTypes'

import type { DisplayOptions } from './types'
import type { IDisplay } from './IDisplay'

// Settings
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

let openXRButton: HTMLElement | null = null

export const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS: DisplayOptions = {
  ...DEFAULT_OPTIONS_DISPLAY_THREE,
  controls: '#shared-controls',
}

export const createXRToggleButton = (renderer: THREE.WebGLRenderer, destination: HTMLElement): HTMLElement | null => {
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
 * Setup required for Looking Glass WebXR polyfill
 */
export const requiredXRSetupForLookingGlass = (): LookingGlassWebXRPolyfill | null => {
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
 * Three.js Based Looking Glass 3D Display with WebXR.
 * Now extends DisplayThree3D (the renamed Three.js backend).
 */
export default class DisplayLookingGlass3D extends DisplayThree3D implements IDisplay {
  name: string = DISPLAY_BACKEND.LOOKINGGLASS3D;

  isButtonFullSize: boolean = false
  lookingGlassWebXR: LookingGlassWebXRPolyfill | null = null
  controls: HTMLElement | null = null

  constructor(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    initialWidth: number = LOOKING_GLASS_PORTRAIT_WIDTH,
    initialHeight: number = LOOKING_GLASS_PORTRAIT_HEIGHT,
    options: DisplayOptions = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS
  ) {
    options = { ...DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS, ...options }
    super(canvas, initialWidth, initialHeight, options)
  }

  async create(canvas: HTMLCanvasElement | OffscreenCanvas, options: DisplayOptions): Promise<boolean> {
    const success = await super.create(canvas, options)

    if (!success || !this.renderer) {
      return false
    }

    if (options.lookingGlassWebXR) {
      this.lookingGlassWebXR = options.lookingGlassWebXR
    } else {
      this.lookingGlassWebXR = requiredXRSetupForLookingGlass()
    }

    if (this.renderer) {
      this.renderer.xr.enabled = true

      try {
        const controlsElement = document.querySelector(options.controls as string) as HTMLElement | null
        if (controlsElement) {
          createXRToggleButton(this.renderer, controlsElement)
        }
      } catch (e) {
        console.warn('Could not setup VR controls:', e)
      }
    }

    return true
  }

  render(): void {
    if (this.renderer?.xr.isPresenting) {
      this.onRender()
    } else {
      super.render()
    }
  }

  async destroy(): Promise<void> {
    this.lookingGlassWebXR = null
    await super.destroy()
  }
}
