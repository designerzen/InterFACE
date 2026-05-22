import { measureNaturalWidth, prepareWithSegments, type PreparedTextWithSegments } from '@chenglou/pretext'
import { cosine, ONE_DEGREE_IN_RADIANS, sine } from '../maths/maths.js'
import { drawCircles } from '../visual/2d.js'
import { drawInstrument, drawParagraph, drawText } from '../visual/2d.text.js'

type Rect = { x: number, y: number, width: number, height: number }

const DEFAULT_PADDING = 24
const EMOJI_FONT_FACE = 'noto-emoji'
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const SHADOW_COLOUR = 'rgba(0, 0, 0, 0.9)'
const SHADOW_BLUR = 0
const SHADOW_OFFSET_X = 2
const SHADOW_OFFSET_Y = 2
const SHADOW_STROKE_COLOUR = '#0a0a0a'

const clampRect = (rect: Rect, width: number, height: number): Rect => {
    const x = Math.max(0, Math.floor(rect.x))
    const y = Math.max(0, Math.floor(rect.y))
    const right = Math.min(width, Math.ceil(rect.x + rect.width))
    const bottom = Math.min(height, Math.ceil(rect.y + rect.height))
    return {
        x,
        y,
        width: Math.max(0, right - x),
        height: Math.max(0, bottom - y)
    }
}

const rectsOverlap = (a: Rect, b: Rect): boolean => {
    return a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y
}

const mergeRects = (a: Rect, b: Rect): Rect => {
    const x = Math.min(a.x, b.x)
    const y = Math.min(a.y, b.y)
    const right = Math.max(a.x + a.width, b.x + b.width)
    const bottom = Math.max(a.y + a.height, b.y + b.height)
    return { x, y, width: right - x, height: bottom - y }
}

export default class DisplayOverlay2d {
    name = 'DisplayOverlay2D'
    canvas: HTMLCanvasElement
    canvasWidth: number
    canvasHeight: number

    private context: CanvasRenderingContext2D | null = null
    private dirtyRects: Rect[] = []
    private pendingClear = false
    private drewThisFrame = false
    private batchingFrame = false
    private renderingBatch = false
    private frameCommands: Array<() => void> = []
    private worker: Worker | null = null
    private usesWorker = false
    private preparedTextCache = new Map<string, PreparedTextWithSegments>()

    get width(): number {
        return this.canvasWidth
    }

    get height(): number {
        return this.canvasHeight
    }

    get canvasContext(): CanvasRenderingContext2D {
        if (!this.context) {
            throw new Error('Overlay canvas is controlled by an OffscreenCanvas worker')
        }
        return this.context
    }

    constructor(canvas: HTMLCanvasElement, initialWidth: number = canvas.width, initialHeight: number = canvas.height) {
        this.canvas = canvas
        this.canvasWidth = initialWidth
        this.canvasHeight = initialHeight
        this.canvas.width = initialWidth
        this.canvas.height = initialHeight

        if (this.canUseWorkerCanvas(canvas)) {
            const offscreenCanvas = canvas.transferControlToOffscreen()
            this.worker = new Worker(new URL('./DisplayOverlay2d.worker.ts', import.meta.url), { type: 'module' })
            this.worker.postMessage({
                type: 'init',
                payload: {
                    canvas: offscreenCanvas,
                    width: initialWidth,
                    height: initialHeight
                }
            }, [offscreenCanvas])
            this.usesWorker = true
            return
        }

        const context = canvas.getContext('2d', { alpha: true })
        if (!context) {
            throw new Error('Could not create overlay canvas context')
        }
        this.context = context
        document.fonts?.load(`900 54px ${EMOJI_FONT}`).catch((error) => {
            console.warn('Could not load overlay emoji font', error)
        })
    }

    destroy(): void {
        this.worker?.terminate()
        this.worker = null
    }

    setSize(width: number, height: number): void {
        this.canvasWidth = width
        this.canvasHeight = height

        if (this.usesWorker) {
            this.post('setSize', { width, height })
            return
        }

        if (this.canvas.width === width && this.canvas.height === height) {
            return
        }
        this.canvas.width = width
        this.canvas.height = height
        this.dirtyRects = []
        this.pendingClear = false
        this.drewThisFrame = false
        this.batchingFrame = false
        this.frameCommands = []
    }

    clear(): void {
        if (this.usesWorker) {
            this.post('clear')
            return
        }

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.dirtyRects = []
        this.pendingClear = false
        this.drewThisFrame = false
        this.batchingFrame = false
        this.frameCommands = []
    }

    clearDirty(): void {
        if (this.usesWorker) {
            this.post('clearDirty')
            return
        }

        this.pendingClear = this.dirtyRects.length > 0
        this.drewThisFrame = false
        this.batchingFrame = true
        this.frameCommands = []
    }

    flushFrame(): void {
        if (this.usesWorker) {
            this.post('flushFrame')
            return
        }

        if (!this.batchingFrame) {
            if (this.pendingClear && !this.drewThisFrame) {
                this.clearPendingDirty()
            }
            return
        }

        const commands = this.frameCommands
        this.frameCommands = []
        this.batchingFrame = false

        if (this.pendingClear) {
            this.clearPendingDirty()
        }

        this.renderingBatch = true
        for (const command of commands) {
            command()
        }
        this.renderingBatch = false
        this.drewThisFrame = commands.length > 0
    }

    drawElement(element: CanvasImageSource, x: number = 0, y: number = 0): void {
        if (this.queueFrameCommand(() => this.drawElement(element, x, y))) {
            return
        }

        const width = (element as any).width ?? (element as any).videoWidth ?? this.canvas.width
        const height = (element as any).height ?? (element as any).videoHeight ?? this.canvas.height

        if (this.usesWorker) {
            createImageBitmap(element as any)
                .then((bitmap) => {
                    this.post('drawElement', { bitmap, x, y, width, height }, [bitmap])
                })
                .catch((error) => console.warn('Could not draw overlay element in worker', error))
            return
        }

        this.prepareDraw()
        this.drawWithShadow(() => {
            this.canvasContext.drawImage(element, x, y)
        })
        this.markDirty({ x, y, width, height })
    }

    drawInstrument(x: number, y: number, instrumentName: string, extra: string = '', fontSize: number = 24): void {
        if (this.queueFrameCommand(() => this.drawInstrument(x, y, instrumentName, extra, fontSize))) {
            return
        }

        if (this.usesWorker) {
            this.post('drawInstrument', { x, y, instrumentName, extra, fontSize })
            return
        }

        this.prepareDraw()
        this.drawWithShadow(() => {
            drawInstrument(this.canvasContext, x, y, instrumentName, extra, fontSize as any)
        })
        const text = `${instrumentName}${extra ? ` ${extra}` : ''}`
        this.markTextDirty(x, y, text, fontSize, 'center')
    }

    drawParagraph(x: number, y: number, paragraph: string[] = [], size: number = 8, lineHeight: number = 20, invertColours: boolean = false): void {
        if (this.queueFrameCommand(() => this.drawParagraph(x, y, paragraph, size, lineHeight, invertColours))) {
            return
        }

        if (this.usesWorker) {
            this.post('drawParagraph', { x, y, paragraph, size, lineHeight, invertColours })
            return
        }

        this.prepareDraw()
        this.drawWithShadow(() => {
            drawParagraph(this.canvasContext, x, y, paragraph as any, size as any, lineHeight, invertColours)
        })
        const width = Math.max(...paragraph.map((line) => this.measureTextWidth(line, size)), 0)
        this.markDirty({
            x,
            y,
            width,
            height: paragraph.length * lineHeight + DEFAULT_PADDING
        })
    }

    drawText(x: number, y: number, text: string, size: number = 24, align: CanvasTextAlign = 'center', font: string = 'oxanium', invertColours: boolean = false): void {
        if (this.queueFrameCommand(() => this.drawText(x, y, text, size, align, font, invertColours))) {
            return
        }

        if (this.usesWorker) {
            this.post('drawText', { x, y, text, size, align, font, invertColours })
            return
        }

        this.prepareDraw()
        this.drawWithShadow(() => {
            drawText(this.canvasContext, x, y, text, size, align, font, invertColours)
        })
        this.markTextDirty(x, y, text, size, align, font)
    }

    drawEmoticon(x: number, y: number, emoji: string, rotationZ: number = 0, rotationY: number = 0, rotationX: number = 0, activeCircleIndex: number = -1, numberOfNotesInKey: number = 12, flipX: boolean = false): void {
        if (this.queueFrameCommand(() => this.drawEmoticon(x, y, emoji, rotationZ, rotationY, rotationX, activeCircleIndex, numberOfNotesInKey, flipX))) {
            return
        }

        if (this.usesWorker) {
            this.post('drawEmoticon', {
                x,
                y,
                emoji,
                rotationZ,
                rotationY,
                rotationX,
                activeCircleIndex,
                numberOfNotesInKey,
                flipX
            })
            return
        }

        const size = 54
        this.prepareDraw()
        this.drawEmoji(x, y + 5, emoji, size, rotationZ, rotationX, rotationY, flipX)

        if (numberOfNotesInKey > 0) {
            const data = this.getNoteCircleData(x, y, 90, size, numberOfNotesInKey)
            if (activeCircleIndex > -1) {
                data[Math.min(activeCircleIndex, data.length - 1)].radius = 4
            }
            this.drawWithShadow(() => {
                drawCircles(this.canvasContext, data, 2, 0, '#fff')
            })
        }

        const radius = size + DEFAULT_PADDING
        this.markDirty({
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2
        })
    }

    private canUseWorkerCanvas(canvas: HTMLCanvasElement): boolean {
        return typeof Worker !== 'undefined' &&
            typeof OffscreenCanvas !== 'undefined' &&
            typeof canvas.transferControlToOffscreen === 'function'
    }

    private post(type: string, payload: any = {}, transfer: Transferable[] = []): void {
        this.worker?.postMessage({ type, payload }, transfer)
    }

    private queueFrameCommand(command: () => void): boolean {
        if (!this.batchingFrame || this.renderingBatch) {
            return false
        }

        this.frameCommands.push(command)
        return true
    }

    private markDirty(rect: Rect): void {
        const nextRect: Rect = {
            x: rect.x - DEFAULT_PADDING,
            y: rect.y - DEFAULT_PADDING,
            width: rect.width + DEFAULT_PADDING * 2,
            height: rect.height + DEFAULT_PADDING * 2
        }

        for (let i = 0; i < this.dirtyRects.length; i++) {
            const dirtyRect = this.dirtyRects[i]
            if (rectsOverlap(dirtyRect, nextRect)) {
                this.dirtyRects[i] = mergeRects(dirtyRect, nextRect)
                return
            }
        }

        this.dirtyRects.push(nextRect)
    }

    private prepareDraw(): void {
        if (!this.pendingClear) {
            this.drewThisFrame = true
            return
        }

        this.clearPendingDirty()
        this.drewThisFrame = true
    }

    private clearPendingDirty(): void {
        for (const dirtyRect of this.dirtyRects) {
            const rect = clampRect(dirtyRect, this.canvas.width, this.canvas.height)
            if (rect.width > 0 && rect.height > 0) {
                this.canvasContext.clearRect(rect.x, rect.y, rect.width, rect.height)
            }
        }

        this.dirtyRects = []
        this.pendingClear = false
    }

    private drawWithShadow(draw: () => void): void {
        const context = this.canvasContext
        context.save()
        context.shadowColor = SHADOW_COLOUR
        context.shadowBlur = SHADOW_BLUR
        context.shadowOffsetX = SHADOW_OFFSET_X
        context.shadowOffsetY = SHADOW_OFFSET_Y
        draw()
        context.restore()
    }

    private drawEmoji(x: number, y: number, emoji: string, size: number, rotationZ: number, rotationX: number, rotationY: number, flipX: boolean): void {
        const context = this.canvasContext
        this.drawWithShadow(() => {
            context.save()
            if (flipX) {
                context.scale(-1, 1)
            }
            context.transform(0, rotationY, rotationX, 0, x, y)
            context.rotate(rotationZ)
            context.font = `900 ${size}px ${EMOJI_FONT}`
            context.textAlign = 'center'
            context.strokeStyle = SHADOW_STROKE_COLOUR
            context.fillStyle = '#fff'
            context.strokeText(emoji, 0, 0)
            context.fillText(emoji, 0, 0)
            context.restore()
        })
        this.markTextDirty(x, y, emoji, size, 'center', EMOJI_FONT)
    }

    private markTextDirty(x: number, y: number, text: string, size: number, align: CanvasTextAlign = 'center', font: string = 'oxanium'): void {
        const width = this.measureTextWidth(text, size, font)
        const height = size * 1.6
        const left = align === 'center' ? x - width / 2 : align === 'right' || align === 'end' ? x - width : x
        this.markDirty({
            x: left,
            y: y - size,
            width,
            height
        })
    }

    private measureTextWidth(text: string, size: number, font: string = 'oxanium'): number {
        const content = String(text)
        const fontDeclaration = `900 ${size}px ${font}`
        const cacheKey = `${fontDeclaration}\n${content}`
        let prepared = this.preparedTextCache.get(cacheKey)

        if (!prepared) {
            prepared = prepareWithSegments(content, fontDeclaration)
            this.preparedTextCache.set(cacheKey, prepared)
        }

        return measureNaturalWidth(prepared)
    }

    private getNoteCircleData(cx: number, cy: number, range: number = 90, radius: number = 70, numberOfPoints: number = 12): Array<{ x: number, y: number, radius?: number }> {
        const halfRange = range / 2
        const startAngleDegrees = 90 - halfRange
        const endAngleDegrees = 90 + halfRange

        const startAngleRadians = startAngleDegrees * ONE_DEGREE_IN_RADIANS
        const endAngleRadians = endAngleDegrees * ONE_DEGREE_IN_RADIANS
        const angleIncrement = (endAngleRadians - startAngleRadians) / (numberOfPoints - 1)

        const data = []
        for (let i = 0; i < numberOfPoints; i++) {
            const currentAngle = startAngleRadians + (i * angleIncrement)
            data.push({
                x: cx + radius * cosine(currentAngle),
                y: cy - radius * sine(currentAngle)
            })
        }

        return data
    }
}
