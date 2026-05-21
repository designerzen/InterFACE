/**
 * Shared interfaces and types for all Display implementations
 */

export interface DisplayOptions {
    debug?: boolean
    resize?: boolean
    [key: string]: any
}

export interface DisplaySize {
    width: number
    height: number
}

export interface CanvasContextType {
    canvasContext: CanvasRenderingContext2D | WebGLRenderingContext | GPUCanvasContext | null
}

export interface DrawingOptions {
    invertColours?: boolean
    [key: string]: any
}

export interface BoundingBox {
    xMin?: number
    yMin?: number
    xMax?: number
    yMax?: number
    width?: number
    height?: number
}

export interface Prediction {
    box: BoundingBox
    [key: string]: any
}

export interface Person {
    data?: any
    moveButton(x: number, y: number, width: number, height: number): void
    [key: string]: any
}

export interface FilterModel {
    name: string
    description: string
}

export interface DisplayLoadState {
    complete: (result: string) => void
    failed: (error: Error) => void
}

/**
 * Display manager options for creating displays
 */
export interface DisplayManagerOptions {
    resize?: boolean
    debug?: boolean
    stats?: boolean
    offscreen?: boolean
    autoStart?: boolean
    [key: string]: any
}