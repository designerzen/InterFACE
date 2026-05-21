// We may want a maximum size
// that then get's scaled up proportionally
// so for example, rather than 1000 it may double 500 instead
// so here we specify the max size... if the screen
// grows bigger than the max size then we simply
// divide the screen size by 2 or 3 accordingly
const DEFAULT_PERFORMANCE_BOUNDARY_SIZE = 1080

import type {
  DisplayOptions,
  Person,
  Prediction
} from './types'
import type { IDisplay } from './IDisplay'

/**
 * @returns {String} portrait-primary, portrait-secondary, landscape-primary, or landscape-secondary
 */
export const getScreenOrientation = (): string => {
  if ('orientation' in screen) {
    // console.log('Screen Orientation API is supported')
    // console.log(`screen Current Orientation: ${screen.orientation.type}`, {video} )
    // screen.orientation.addEventListener('change', function() {
    // 	console.log(`screen New Orientation: ${screen.orientation.type}`)
    // 	// Add custom logic here to handle orientation changes
    // })
    return screen.orientation.type
  }
  const isLandscape = window.innerWidth > window.innerHeight
  console.log('Screen Orientation API is not supported in your browser.', {
    isLandscape,
  })
  return isLandscape ? 'landscape-primary' : 'portrait-primary'
}

export const isScreenPortrait = (): boolean => getScreenOrientation().startsWith('portrait-')
export const isScreenLandscape = (): boolean => getScreenOrientation().startsWith('landscape-')

export const observeOrientationChange = (
  callback: () => void,
  debounceTime: number = 5
): void => {
  if (
    'orientation' in screen &&
    screen.orientation &&
    typeof screen.orientation.addEventListener === 'function'
  ) {
    screen.orientation.addEventListener('change', callback)
  } else {
    // Polyfill: listen to window resize and call callback if orientation changes
    let lastOrientation = getScreenOrientation()
    let intervalId = -1
    window.addEventListener('resize', function onResize() {
      const current = getScreenOrientation()
      if (current === lastOrientation) {
        // nothing has changed
        return
      }

      clearInterval(intervalId)
      setTimeout(() => {
        lastOrientation = current
        callback()
      }, debounceTime)
    })
    //console.log('Screen Orientation API is not supported in your browser. Polyfilling orientation change with resize event.')
  }
}

/**
 * Abstract base class for all display implementations
 * Overwrite these methods in your own displays
 */
export default class AbstractDisplay {

  static index = 0

  name: string = 'AbstractDisplay'
  #id: string = this.name + '_' + AbstractDisplay.index

  // allows you to debug this view
  options: DisplayOptions = {}
  debug: boolean = false
  available: boolean = false

  count: number = 0

  // for MTV mode
  extraVisualMode: boolean = false

  canvas: HTMLCanvasElement | OffscreenCanvas
  canvasWidth: number = 0
  canvasHeight: number = 0
  dpr: number = 1
  canvas2DContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null

  // method to run to kickstart unless option autoStart:true
  start = (): void => {
    console.info('Display starting', this)
  }

  // Linked List --------------------
  nextDisplayLink: IDisplay | null = null
  previousDisplayLink: IDisplay | null = null

  // Loading ------------------------
  loadComplete!: (result: string) => void
  loadFailed!: (error: Error) => void

  // private (consume this in the constructor)
  loading: Promise<string>

  loopId: number = 0
  optional: any = { screenBoundary: DEFAULT_PERFORMANCE_BOUNDARY_SIZE }
  started: boolean = false

  // Linked List --------------------

  get previousDisplay(): IDisplay | null {
    return this.previousDisplayLink
  }

  get nextDisplay(): IDisplay | null {
    return this.nextDisplayLink
  }

  get firstDisplay(): AbstractDisplay {
    let i: AbstractDisplay = this
    while (i.previousDisplay) {
      i = i.previousDisplay as unknown as AbstractDisplay
    }
    return i
  }

  get lastDisplay(): AbstractDisplay {
    let i: AbstractDisplay = this
    while (i.nextDisplayLink) {
      i = i.nextDisplayLink as unknown as AbstractDisplay
    }
    return i
  }

  get width(): number {
    return this.canvasWidth
  }

  get height(): number {
    return this.canvasHeight
  }

  get discoMode(): boolean {
    return false
  }

  set discoMode(value: boolean) {
    this.extraVisualMode = value
  }

  /**
   * Unique ID for this Display that includes its type
   * @returns {String} ID
   */
  get id(): string {
    return this.#id
  }

  get type(): string {
    return this.name
  }

  /**
   * Lazily create the canvasContext
   * NB. Ensure you overwrite this in your
   * displays as this defaults to 2d whereas
   * you may want webGL or WebGPU for example
   */
  get canvasContext(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D {
    if (!this.canvas2DContext) {
      this.canvas2DContext = this.canvas.getContext('2d') as any
    }
    return this.canvas2DContext as any
  }

  constructor(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    initialWidth: number,
    initialHeight: number,
    options: DisplayOptions = {}
  ) {
    this.canvas = canvas
    this.canvas.width = this.canvasWidth = initialWidth
    this.canvas.height = this.canvasHeight = initialHeight
    this.options = { ...options }
    //
    this.debug = options.debug || false
    AbstractDisplay.index++

    if (options.dpr !== undefined) {
      this.dpr = options.dpr
    } else if (typeof window !== 'undefined') {
      this.dpr = window.devicePixelRatio || 1
    }

    this.loading = new Promise((resolve, reject) => {
      this.loadComplete = resolve
      this.loadFailed = reject
    })

    if (options.resize === true && canvas instanceof HTMLCanvasElement) {
      // if we want to use the CSS size rather than implicit sizes...
      this.onViewportResize = this.onViewportResize.bind(this)
      const resizeObserver = new ResizeObserver(this.onViewportResize)
      resizeObserver.observe(canvas, { box: 'content-box' })
    }
  }

  // Create

  /**
   * Remove display from linked list
   * Delete all references, listeners and handlers
   * Free up memory
   */
  async destroy(): Promise<void> {
    // CLEAN UP
    AbstractDisplay.index--
  }

  addDisplay(display: IDisplay): void {
    const last = this.lastDisplay
    // navigate to end of chain and append our new display
    last.nextDisplayLink = display
    display.previousDisplayLink = last as unknown as IDisplay
  }

  /**
   * Draw a hit area on the canvas
   */
  drawHitArea(x: number, y: number, width: number, height: number, colour: string = 'transparent'): Path2D {
    // create path
    const path = new Path2D()
    // path.arc(150, 75, 50, 0, 2 * Math.PI)
    path.rect(x, y, width, height)
    // draw to canvas
    this.canvasContext.fillStyle = colour
    this.canvasContext.fill(path)
    return path
  }

  cancelAnimationLoop(): void {
    cancelAnimationFrame(this.loopId)
  }

  // This varies for each display but here we create a neverending
  // loop using requestFrame - be sure to overwrite
  setAnimationLoop(callback: () => void, autoStart: boolean = false): void {
    const looper = (): void => {
      callback()
      this.loopId = requestAnimationFrame(looper)
    }
    if (autoStart) {
      looper()
    }
    this.start = looper
  }

  movePersonButton(person: Person, prediction: Prediction): void {
    // we only want this every frame or so as this
    // is altering the DOM and very costly
    const boundingBox = prediction.box
    const boundingBoxWidth = boundingBox.width || boundingBox.xMax! - boundingBox.xMin!
    const boundingBoxHeight = boundingBox.height || boundingBox.yMax! - boundingBox.yMin!
    //console.error("Display", display.width, display.height, {boundingBoxWidth,boundingBoxHeight,boundingBox} )
    person.moveButton(boundingBox.xMax || 0, boundingBox.yMin || 0, boundingBoxWidth, boundingBoxHeight)
  }

  /**
   * Empty the canvas and paint it transparent
   */
  clear(): void { }

  /**
   * Draw a Person model to the screen
   */
  drawPerson(person: Person, _beatJustPlayed: any, colours: any, _options: any = {}): void {
    const prediction = person.data
    const keypoints = prediction?.keypoints ?? prediction?.faceLandmarks
    if (!keypoints || typeof (this as any).drawLandmarks !== 'function') {
      return
    }

    if (prediction && this.count % 3 === 0) {
      this.movePersonButton(person, prediction)
    }

    const data = new Float32Array(keypoints.length * 3)
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i]
      data[i * 3] = keypoint.x ?? keypoint[0] ?? 0
      data[i * 3 + 1] = keypoint.y ?? keypoint[1] ?? 0
      data[i * 3 + 2] = keypoint.z ?? keypoint[2] ?? 0
    }

    const colour = colours?.face ?? colours?.primary ?? colours?.[0] ?? '#ffffff'
    if (typeof (this as any).drawFaceConnections === 'function') {
      ;(this as any).drawFaceConnections(data, colour, 1)
    }
    ;(this as any).drawLandmarks(data, colour, 1)
    this.count++
  }

  /**
   * Draw an element to the screen
   */
  drawElement(_element: HTMLElement, _x?: number, _y?: number, _flip?: boolean): void { }

  /**
   * VU Meter bars
   * @param {FFT} dataArray
   * @param {Number} bufferLength
   */
  drawBars(_dataArray: Uint8Array, _bufferLength: number): void { }

  /**
   * VU Visuals feast!
   * @param {FFT} dataArray
   * @param {Number} bufferLength
   */
  drawVisualiser(_dataArray: Uint8Array, _bufferLength: number, _type?: string): void { }

  drawInstrument(_boundingBox: any, _instrumentName: string, _extra?: any): void { }

  drawText(_x: number, _y: number, _text: string, _size?: number, _align?: string, _font?: string, _invertColours?: boolean): void { }

  drawParagraph(_x: number, _y: number, _paragraph: string, _size: number, _lineHeight: number, _invertColours?: boolean): void { }

  drawEmoticon(
    _x: number,
    _y: number,
    _emoji: string,
    _rotationZ: number = 0,
    _rotationY: number = 0,
    _rotationX: number = 0,
    _activeCircleIndex: number = -1,
    _numberOfNotesInKey: number = 12,
    _flipX: boolean = false
  ): void { }

  setFilter(_filterIndex: number): void { }

  /**
   * Next Filter for the post processing
   */
  nextFilter(): void { }

  /**
   * Reset Filter to none
   */
  resetFilter(): void { }

  postProcess(_options: any): void { }

  /**
   * Draw to screen?
   */
  render(): void {
    this.onRender()
  }

  /**
   * converts the canvas into a PNG / JPEG and returns as a blob?
   * @param {String} type
   * @returns Blob or DataURL string
   */
  takePhotograph(_type: string = 'image/png'): string | Blob {
    return ''
  }

  /**
   * Prevents Overgrowth and small sizes too :)
   * @param {Number} displayWidth
   * @param {Number} displayHeight
   * @returns
   */
  setSize(width: number, height: number): void {
    this.canvas.width = this.canvasWidth = width
    this.canvas.height = this.canvasHeight = height

    this.onResize(width, height)
  }

  /**
   * Prevents Overgrowth and small sizes too :)
   * @param {Number} displayWidth
   * @param {Number} displayHeight
   * @param {Number} dpr - pixel density
   * @returns
   */
  resizeCanvasToDisplaySize(width: number, height: number, dpr: number): boolean {
    // do we ignore the DPR too???
    let displayWidth = Math.round(width * dpr)
    let displayHeight = Math.round(height * dpr)
    let scaleFactor = 1

    // HALVE if over size, and keep halving it till it is smaller
    // the CSS should automatically scale it up
    while (
      displayWidth > this.optional.screenBoundary ||
      displayHeight > this.optional.screenBoundary
    ) {
      displayWidth /= 2
      displayHeight /= 2
      scaleFactor++
    }

    // console.info( "size",{ displayWidth, displayHeight, dpr, width, height })
    // Get the size the browser is displaying the canvas in device pixels.
    // Check if the canvas is not the same size.
    const needResize = this.canvas.width !== displayWidth || this.canvas.height !== displayHeight

    if (needResize) {
      this.started = true

      this.setSize(displayWidth, displayHeight)
    }

    return needResize
  }

  // EVENTS -----------------------------------------------------
  onRender(): void { }

  onResize(_width: number, _height: number): void { }

  /**
   * EVENT
   * @param {Array} entries
   */
  onViewportResize = (entries: ResizeObserverEntry[]): void => {
    for (const entry of entries) {
      let width: number
      let height: number
      let dpr = window.devicePixelRatio
      // let dprSupport = false

      if (entry.devicePixelContentBoxSize) {
        // NOTE: Only this path gives the correct answer
        // The other paths are an imperfect fallback
        // for browsers that don't provide anyway to do this
        width = entry.devicePixelContentBoxSize[0].inlineSize
        height = entry.devicePixelContentBoxSize[0].blockSize
        dpr = 1 // it's already in width and height
        // dprSupport = true
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize
          height = entry.contentBoxSize[0].blockSize
        } else {
          // legacy
          width = (entry.contentBoxSize as any).inlineSize
          height = (entry.contentBoxSize as any).blockSize
        }
      } else {
        // legacy
        width = entry.contentRect.width
        height = entry.contentRect.height
      }

      this.resizeCanvasToDisplaySize(width, height, dpr)
    }
  }
}
