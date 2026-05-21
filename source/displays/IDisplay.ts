import type { BoundingBox, DisplayOptions, DrawingOptions, Person, Prediction } from "./types"

/**
 * Main Display interface - all display types must implement this
 */
export interface IDisplay {

    // Properties
    name: string
    options: DisplayOptions
    debug: boolean
    available: boolean
    count: number
    canvas: HTMLCanvasElement | OffscreenCanvas
    canvasWidth: number
    canvasHeight: number
    extraVisualMode: boolean
    nextDisplayLink: IDisplay | null
    previousDisplayLink: IDisplay | null
    loading: Promise<string>

    // Getters
    readonly id: string
    readonly type: string
    readonly width: number
    readonly height: number
    readonly discoMode: boolean
    readonly previousDisplay: IDisplay | null
    readonly nextDisplay: IDisplay | null
    readonly firstDisplay: IDisplay
    readonly lastDisplay: IDisplay
    readonly canvasContext: any

    // Lifecycle
    start(): void
    destroy(): Promise<void>
    render(): void

    // Linked List Management
    addDisplay(display: IDisplay): void

    // Canvas Operations
    clear(): void
    setSize(width: number, height: number): void
    resizeCanvasToDisplaySize(width: number, height: number, dpr: number): boolean
    takePhotograph(type?: string): string | Blob

    // Drawing Operations
    drawPerson?(person: Person, beatJustPlayed: any, colours: any, options?: DrawingOptions): void
    drawElement?(element: HTMLElement, x?: number, y?: number, flip?: boolean): void
    drawBars?(dataArray: Uint8Array, bufferLength: number): void
    drawVisualiser?(dataArray: Uint8Array, bufferLength: number, type?: string): void
    drawInstrument?(boundingBox: BoundingBox, instrumentName: string, extra?: any): void
    drawText?(x: number, y: number, text: string, size?: number, align?: string, font?: string, invertColours?: boolean): void
    drawParagraph?(x: number, y: number, paragraph: string, size: number, lineHeight: number, invertColours?: boolean): void
    drawEmoticon?(x: number, y: number, emoji: string, rotationZ?: number, rotationY?: number, rotationX?: number, activeCircleIndex?: number, numberOfNotesInKey?: number, flipX?: boolean): void
    drawHitArea?(x: number, y: number, width: number, height: number, colour?: string): Path2D

    // Filtering
    setFilter(filterIndex: number): void
    nextFilter(): void
    resetFilter(): void

    // Post-processing
    postProcess(options: any): void

    // Animation
    setAnimationLoop(callback: () => void, autoStart?: boolean): void
    cancelAnimationLoop(): void

    // Event Handlers
    onRender(): void
    onResize(width: number, height: number): void
    onViewportResize(entries: ResizeObserverEntry[]): void

    // Utility
    movePersonButton(person: Person, prediction: Prediction): void

    // Specific to landmarks
    drawLandmarks?(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void
    drawFaceConnections?(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void
    drawConnectionDots?(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void
    submitFrame?(): void
}
