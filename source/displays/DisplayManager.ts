import type { IDisplay } from './IDisplay'
import { displaySettings } from './DisplaySettings'
import {
  DEFAULT_DISPLAY_BACKEND,
  DISPLAY_BACKEND,
  DISPLAY_CONFIGS,
  DISPLAY_TYPES,
  type DisplayBackendId
} from './DisplayTypes'
import { DisplayFactory } from './DisplayFactory'
import type { DisplayManagerOptions } from './types'

type DisplayType = string | DisplayBackendId
type RenderLoop = () => void
type LoadedDisplayClass = { default: new (...args: any[]) => any, before?: () => any }

export const isWebGLAvailable = (): boolean => {
  const canvas = document.createElement('canvas')
  try {
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

const normalizeDisplayType = (displayType: DisplayType): string => {
  if ((DISPLAY_TYPES as Record<string, string>)[displayType as string]) {
    return (DISPLAY_TYPES as Record<string, string>)[displayType as string]
  }
  return displayType as string
}

const backendToDisplayType = (id: DisplayBackendId): string => {
  switch (id) {
    case DISPLAY_BACKEND.CANVAS2D:
      return DISPLAY_TYPES.DISPLAY_CANVAS_2D
    case DISPLAY_BACKEND.WEBGPU:
      return DISPLAY_TYPES.DISPLAY_WEB_GPU_3D
    case DISPLAY_BACKEND.THREE3D:
    case DISPLAY_BACKEND.WEBGL3D:
      return DISPLAY_TYPES.DISPLAY_WEB_GL_3D
    case DISPLAY_BACKEND.BABYLON3D:
      return DISPLAY_TYPES.DISPLAY_BABYLON_3D
    case DISPLAY_BACKEND.LOOKINGGLASS3D:
      return DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D
    case DISPLAY_BACKEND.THREEWEBGPU_TSL:
      return DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE
    case DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL:
      return DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL
    default:
      return DISPLAY_TYPES.DISPLAY_CANVAS_2D
  }
}

const displayTypeToBackend = (displayType: string): DisplayBackendId => {
  switch (displayType) {
    case DISPLAY_TYPES.DISPLAY_WEB_GPU_3D:
    case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU:
      return DISPLAY_BACKEND.WEBGPU
    case DISPLAY_TYPES.DISPLAY_BABYLON_3D:
      return DISPLAY_BACKEND.BABYLON3D
    case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D:
      return DISPLAY_BACKEND.LOOKINGGLASS3D
    case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL:
      return DISPLAY_BACKEND.LOOKINGGLASS3D_WEBGPU_TSL
    case DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE:
      return DISPLAY_BACKEND.THREEWEBGPU_TSL
    case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
      return DISPLAY_BACKEND.WEBGL3D
    case DISPLAY_TYPES.DISPLAY_CANVAS_2D:
    case DISPLAY_TYPES.DISPLAY_MEDIA_PIPE_2D:
    case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D:
    case DISPLAY_TYPES.DISPLAY_COMPOSITE:
    default:
      return DISPLAY_BACKEND.CANVAS2D
  }
}

export const loadDisplayClass = async (type: DisplayType): Promise<LoadedDisplayClass | undefined> => {
  const displayType = normalizeDisplayType(type)

  try {
    switch (displayType) {
      case DISPLAY_TYPES.DISPLAY_WEB_GL_3D: {
        const { default: DisplayWebGL3D } = await import('../display/display-webgl-3d-direct.js')
        return { default: DisplayWebGL3D }
      }
      case DISPLAY_TYPES.DISPLAY_WEB_GPU_3D: {
        const { default: DisplayWebGPU } = await import('../display/display-webgpu-direct.js')
        return { default: DisplayWebGPU }
      }
      case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU: {
        const { default: DisplayLookingGlassWebGPU } = await import('../display/display-looking-glass-webgpu.js')
        return { default: DisplayLookingGlassWebGPU }
      }
      case DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE: {
        const { default: DisplayThreeWebGPUParticle } = await import('../display/display-three-webgpu-particle.js')
        return { default: DisplayThreeWebGPUParticle }
      }
      case DISPLAY_TYPES.DISPLAY_BABYLON_3D: {
        const { default: DisplayBabylon3D } = await import('../display/display-babylon-3d.js')
        return { default: DisplayBabylon3D }
      }
      case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D: {
        const { default: DisplayLookingGlass3D, requiredXRSetupForLookingGlass } = await import('../display/display-looking-glass-3d.js')
        return { default: DisplayLookingGlass3D, before: requiredXRSetupForLookingGlass }
      }
      case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL: {
        const { default: DisplayLookingGlassWebGPUTSL } = await import('../display/display-looking-glass-3d-webgpu-tsl.js')
        return { default: DisplayLookingGlassWebGPUTSL }
      }
      case DISPLAY_TYPES.DISPLAY_CANVAS_2D: {
        const { default: DisplayCanvas2D } = await import('./DisplayCanvas2d')
        return { default: DisplayCanvas2D }
      }
      case DISPLAY_TYPES.DISPLAY_MEDIA_PIPE_2D: {
        const { default: DisplayMediaPipe2D } = await import('../display/display-mediapipe-2d.js')
        return { default: DisplayMediaPipe2D }
      }
      case DISPLAY_TYPES.DISPLAY_COMPOSITE: {
        const { default: DisplayComposite } = await import('../display/display-composite.js')
        return { default: DisplayComposite }
      }
      case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D:
      default: {
        const { default: DisplayMediaVision2D } = await import('../display/display-mediavision-2d.js')
        return { default: DisplayMediaVision2D }
      }
    }
  } catch (error) {
    console.error("Couldn't load Display Library", error)
    return undefined
  }
}

export const createDisplay = async (
  canvasElement: HTMLCanvasElement,
  displayType: DisplayType,
  options: DisplayManagerOptions = {}
): Promise<IDisplay> => {
  const normalizedDisplayType = normalizeDisplayType(displayType)

  console.info('DISPLAY:Creating new', normalizedDisplayType, 'on', canvasElement, { options })
  canvasElement.setAttribute('data-display-type', normalizedDisplayType)

  const loaded = await loadDisplayClass(normalizedDisplayType)
  if (!loaded) {
    throw Error(`Display type ${normalizedDisplayType} could not be loaded`)
  }

  const DisplayClass = loaded.default
  const setup = loaded.before ? loaded.before() : undefined
  const display = new DisplayClass(
    canvasElement,
    canvasElement.width,
    canvasElement.height,
    setup ? { ...options, lookingGlassWebXR: setup } : options
  )

  await display.loading
  return display as IDisplay
}

export const restartCanvas = async (canvasElement: HTMLCanvasElement, _maxWidth: number = -1): Promise<HTMLCanvasElement> => {
  const classNames = canvasElement.className
  const id = canvasElement.id
  const parent = canvasElement.parentNode
  const dataId = canvasElement.getAttribute('data-id') ?? '0'
  const width = (canvasElement as any).canvasWidth ?? canvasElement.width ?? 640
  const height = (canvasElement as any).canvasHeight ?? canvasElement.height ?? 480

  if (!parent) {
    throw Error('Canvas provided is not yet a DOM member - please add before calling restartCanvas()')
  }

  const newCanvasElement = document.createElement('canvas')
  newCanvasElement.width = width
  newCanvasElement.height = height
  newCanvasElement.id = id
  newCanvasElement.className = classNames
  newCanvasElement.setAttribute('data-id', String(parseInt(dataId, 10) + 1))

  parent.appendChild(newCanvasElement)
  canvasElement.remove()

  console.info('DISPLAY:restartCanvas', { canvasElement, newCanvasElement, parent })
  return newCanvasElement
}

export const getAvailableDisplays = (hasHolographicDisplayConnected: boolean = false): string[] => {
  const availableDisplays: string[] = [
    DISPLAY_TYPES.DISPLAY_COMPOSITE,
    DISPLAY_TYPES.DISPLAY_CANVAS_2D,
    DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D
  ]

  if (isWebGLAvailable()) {
    availableDisplays.push(DISPLAY_TYPES.DISPLAY_WEB_GL_3D)
    availableDisplays.push(DISPLAY_TYPES.DISPLAY_BABYLON_3D)
  }

  if (navigator.gpu) {
    availableDisplays.push(DISPLAY_TYPES.DISPLAY_WEB_GPU_3D)
    availableDisplays.push(DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE)
  }

  if (hasHolographicDisplayConnected) {
    availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D)
    navigator.gpu && availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU)
  }

  return availableDisplays
}

export const getDisplaysInformation = async (
  previousDisplay?: string,
  defaultDisplay: string = DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D
): Promise<{ suggested: string, available: string[] }> => {
  let suggestedDisplay = previousDisplay ?? defaultDisplay
  let holographicDisplayQuantity = 0

  try {
    const { howManyHolographicDisplaysAreConnected } = await import('../hardware/looking-glass-portrait.js' as any)
    holographicDisplayQuantity = await howManyHolographicDisplaysAreConnected()
    if (holographicDisplayQuantity > 0) {
      suggestedDisplay = DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D
    }
  } catch (error) {
    console.info('Holographic display not connected', error)
  }

  return {
    suggested: suggestedDisplay,
    available: getAvailableDisplays(holographicDisplayQuantity > 0)
  }
}

export const changeDisplay = async (
  canvasElement: HTMLCanvasElement,
  displayType: DisplayType,
  renderLoop?: RenderLoop,
  options: DisplayManagerOptions = {}
): Promise<IDisplay> => {
  if (!canvasElement) {
    throw Error('No embedded canvas was provided')
  }

  if (!canvasElement.parentNode) {
    throw Error('No DOM canvas was provided - only orphan without parent')
  }

  const normalizedDisplayType = normalizeDisplayType(displayType)
  if (!Object.values(DISPLAY_TYPES).includes(normalizedDisplayType as any) && !Object.values(DISPLAY_BACKEND).includes(normalizedDisplayType as any)) {
    console.warn('Display test', normalizedDisplayType, DISPLAY_TYPES, (DISPLAY_TYPES as any)[normalizedDisplayType])
    throw Error(`Display type ${normalizedDisplayType} is not supported`)
  }

  const newCanvasElement = await restartCanvas(canvasElement, -1)
  const display = await createDisplay(newCanvasElement, normalizedDisplayType, options)

  if (renderLoop) {
    display.setAnimationLoop(renderLoop, options.autoStart ?? true)
  }

  console.info('DISPLAY:created', { display, displayType: normalizedDisplayType, canvasElement, newCanvasElement, renderLoop })
  return display
}

export default class DisplayManager {
  #display?: IDisplay
  #canvas: HTMLCanvasElement
  type: string

  private backends: Record<string, IDisplay> = {}
  private currentBackendId: DisplayBackendId = DEFAULT_DISPLAY_BACKEND
  private currentWidth?: number
  private currentHeight?: number

  get display(): IDisplay | undefined {
    return this.#display
  }

  constructor(canvasVideoElement: HTMLCanvasElement, initialDisplayType: DisplayType = DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D) {
    this.#canvas = canvasVideoElement
    this.type = normalizeDisplayType(initialDisplayType)
    this.currentBackendId = displayTypeToBackend(this.type)
  }

  listAvailable(): string[] {
    return getAvailableDisplays()
  }

  async create(displayType: DisplayType = this.type, options: DisplayManagerOptions = {}): Promise<IDisplay> {
    this.#display = await createDisplay(this.#canvas, displayType, options)
    this.type = normalizeDisplayType(displayType)
    this.currentBackendId = displayTypeToBackend(this.type)
    this.backends[this.currentBackendId] = this.#display
    return this.#display
  }

  async switchTo(displayType: DisplayType, renderLoop?: RenderLoop, options: DisplayManagerOptions = {}): Promise<IDisplay> {
    if (!this.#canvas) {
      throw Error('No embedded canvas was provided')
    }

    if (!this.#canvas.parentNode) {
      throw Error('No DOM canvas was provided - only orphan without parent')
    }

    const normalizedDisplayType = normalizeDisplayType(displayType)
    const display = await changeDisplay(this.#canvas, normalizedDisplayType, renderLoop, options)

    this.#display = display
    this.#canvas = display.canvas as HTMLCanvasElement
    this.type = normalizedDisplayType
    this.currentBackendId = displayTypeToBackend(normalizedDisplayType)
    this.backends[this.currentBackendId] = display

    return display
  }

  async restart(): Promise<HTMLCanvasElement> {
    this.#canvas = await restartCanvas(this.#canvas)
    return this.#canvas
  }

  setSize(width: number, height: number): void {
    this.#display?.setSize(width, height)
  }

  async switchBackend(id: DisplayBackendId): Promise<void> {
    await this.switchTo(backendToDisplayType(id))
  }

  getCurrent(): IDisplay | undefined {
    return this.#display ?? this.backends[this.currentBackendId]
  }

  resize(width: number, height: number): void {
    this.currentWidth = width
    this.currentHeight = height
    this.getCurrent()?.setSize(width, height)
  }

  handlePrediction(result: any): void {
    const display = this.getCurrent()
    if (!display) return

    const config = DISPLAY_CONFIGS[this.currentBackendId] ?? DISPLAY_CONFIGS[DEFAULT_DISPLAY_BACKEND]
    const { face: faceColor, hands: handsColor } = config.colors

    display.clear()

    const { showDots, showLines, connectionDotsCount } = displaySettings
    const faceList = result.faces && result.faces.length > 0 ? result.faces : result.face ? [result.face] : []

    for (let idx = 0; idx < faceList.length; idx++) {
      const f = faceList[idx]
      if (!f || f.score <= 0.5) continue
      if (showLines) {
        display.drawFaceConnections?.(f.data, faceColor, 1.0)
      }
      if (connectionDotsCount > 0) {
        display.drawConnectionDots?.(f.data, faceColor, 1.0)
      }
      if (showDots) {
        display.drawLandmarks?.(f.data, faceColor, 1.0)
      }
      const box = f.box
      if (box) {
        const cx = ((box.xMin || 0) + (box.xMax || 0)) / 2
        const cy = (box.yMin || 0) - 20
        const label = `face${faceList.length > 1 ? ` ${idx + 1}` : ''} ${f.score?.toFixed ? f.score.toFixed(2) : ''}`
        display.drawText?.(cx, cy, label, 24, 'center')
      }
    }

    if (result.hands) {
      for (const hand of result.hands) {
        if (hand.score > 0.5) {
          if (showDots) {
            display.drawLandmarks?.(hand.data, handsColor, 1.0)
          }
          const box = hand.box
          if (box) {
            const cx = ((box.xMin || 0) + (box.xMax || 0)) / 2
            const cy = (box.yMin || 0) - 20
            const label = `hand ${hand.score?.toFixed ? hand.score.toFixed(2) : ''}`
            display.drawText?.(cx, cy, label, 20, 'center')
          }
        }
      }
    }

    display.submitFrame?.()
  }
}
