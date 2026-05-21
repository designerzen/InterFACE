import type { IDisplay } from './IDisplay'
import type { DisplayOptions } from './types'
import { displaySettings } from './DisplaySettings'

export class DisplayWorkerProxy implements IDisplay {
    public name: string = 'DisplayWorkerProxy'
    public options: DisplayOptions
    public debug: boolean = false
    public available: boolean = true
    public count: number = 0
    public canvas: HTMLCanvasElement
    public canvasWidth: number
    public canvasHeight: number
    public extraVisualMode: boolean = false
    public nextDisplayLink: IDisplay | null = null
    public previousDisplayLink: IDisplay | null = null
    public loading: Promise<string>

    private worker: Worker
    private backendId: string
    private _id: string
    private pendingCommands: any[] = []
    private pendingBuffers: Set<ArrayBuffer> = new Set()

    constructor(
        canvas: HTMLCanvasElement,
        backendId: string,
        initialWidth: number,
        initialHeight: number,
        options: DisplayOptions = {}
    ) {
        this.canvas = canvas
        this.backendId = backendId
        this.canvasWidth = initialWidth
        this.canvasHeight = initialHeight
        this.options = options
        this._id = `${backendId}-worker-proxy-${Math.random().toString(36).substr(2, 9)}`

        // Create the worker using Vite's URL syntax
        this.worker = new Worker(new URL('./DisplayWorker.ts', import.meta.url), {
            type: 'module'
        })

        this.loading = new Promise((resolve) => {
            // Transfer control to offscreen
            const offscreen = canvas.transferControlToOffscreen()

            this.worker.postMessage({
                type: 'INIT',
                payload: {
                    backendId: this.backendId,
                    canvas: offscreen,
                    width: initialWidth,
                    height: initialHeight,
                    dpr: window.devicePixelRatio || 1,
                    options: options
                }
            }, [offscreen])

            // Sync settings changes to worker
            displaySettings.onChange((key, value) => {
                this.worker.postMessage({
                    type: 'UPDATE_SETTINGS',
                    payload: { key, value }
                })
            })

            // For now, assume success immediately or add a message listener
            resolve('Worker initialized')
        })

        // Sync settings
        displaySettings.onChange((key, value) => {
            this.worker.postMessage({
                type: 'UPDATE_SETTINGS',
                payload: { key, value }
            })
        })
    }

    get id(): string { return this._id; }
    get type(): string { return this.name; }
    get width(): number { return this.canvasWidth; }
    get height(): number { return this.canvasHeight; }
    get discoMode(): boolean { return this.extraVisualMode; }
    get previousDisplay(): IDisplay | null { return this.previousDisplayLink; }
    get nextDisplay(): IDisplay | null { return this.nextDisplayLink; }
    get firstDisplay(): IDisplay {
        let i: IDisplay = this
        while (i.previousDisplayLink) i = i.previousDisplayLink
        return i
    }
    get lastDisplay(): IDisplay {
        let i: IDisplay = this
        while (i.nextDisplayLink) i = i.nextDisplayLink
        return i
    }
    get canvasContext(): any { return null; }

    start(): void { }

    async destroy(): Promise<void> {
        this.worker.postMessage({ type: 'DESTROY' })
        this.worker.terminate()
    }

    render(): void {
        this.worker.postMessage({ type: 'RENDER' })
    }

    addDisplay(display: IDisplay): void {
        const last = this.lastDisplay
        last.nextDisplayLink = display
    }

    clear(): void {
        this.pendingCommands.push({ type: 'CLEAR' })
    }

    setSize(width: number, height: number): void {
        this.canvasWidth = width
        this.canvasHeight = height
        this.worker.postMessage({
            type: 'RESIZE',
            payload: { width, height }
        })
    }

    resizeCanvasToDisplaySize(width: number, height: number, dpr: number): boolean {
        const displayWidth = Math.round(width * dpr)
        const displayHeight = Math.round(height * dpr)
        if (this.canvasWidth !== displayWidth || this.canvasHeight !== displayHeight) {
            this.setSize(displayWidth, displayHeight)
            return true
        }
        return false
    }

    takePhotograph(): string | Blob { return ''; }

    drawLandmarks(data: Float32Array, color: string, scale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        this.pendingCommands.push({
            type: 'DRAW_LANDMARKS',
            payload: { data, color, scale, regionSize, offsetX, offsetY }
        })
        if (data.buffer instanceof ArrayBuffer) {
            this.pendingBuffers.add(data.buffer)
        }
    }

    drawFaceConnections(data: Float32Array, color: string, scale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        this.pendingCommands.push({
            type: 'DRAW_CONNECTIONS',
            payload: { data, color, scale, regionSize, offsetX, offsetY }
        })
        if (data.buffer instanceof ArrayBuffer) {
            this.pendingBuffers.add(data.buffer)
        }
    }

    drawConnectionDots(data: Float32Array, color: string, scale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        this.pendingCommands.push({
            type: 'DRAW_CONNECTION_DOTS',
            payload: { data, color, scale, regionSize, offsetX, offsetY }
        })
        if (data.buffer instanceof ArrayBuffer) {
            this.pendingBuffers.add(data.buffer)
        }
    }

    submitFrame(): void {
        if (this.pendingCommands.length === 0) return

        this.worker.postMessage({
            type: 'BATCH',
            payload: this.pendingCommands
        }, Array.from(this.pendingBuffers))

        this.pendingCommands = []
        this.pendingBuffers.clear()
    }

    setFilter(): void { }
    nextFilter(): void { }
    resetFilter(): void { }
    postProcess(): void { }
    setAnimationLoop(): void { }
    cancelAnimationLoop(): void { }
    onRender(): void { }
    onResize(): void { }
    onViewportResize(): void { }
    movePersonButton(): void { }
}

export default DisplayWorkerProxy
