import { measureNaturalWidth, prepareWithSegments, type PreparedTextWithSegments } from '@chenglou/pretext'

type Rect = { x: number, y: number, width: number, height: number }
type OverlayCommand = { type: string, payload: any }

const TAU = Math.PI * 2
const ONE_DEGREE_IN_RADIANS = Math.PI / 180
const PADDING = 24
const WHITE = '#ffffff'
const DARK = '#0a0a0a'
const EMOJI_FONT_FACE = 'noto-emoji'
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const EMOJI_FONT_URL = new URL('../assets/fonts/noto-emoji/NotoEmoji-VariableFont_wght.ttf', import.meta.url).toString()
const SHADOW_COLOUR = 'rgba(0, 0, 0, 0.9)'
const SHADOW_BLUR = 0
const SHADOW_OFFSET_X = 2
const SHADOW_OFFSET_Y = 2

let canvas: OffscreenCanvas | null = null
let context: OffscreenCanvasRenderingContext2D | null = null
let dirtyRects: Rect[] = []
let pendingClear = false
let drewThisFrame = false
let batchingFrame = false
let renderingBatch = false
let frameCommands: OverlayCommand[] = []
let emojiFontReady: Promise<void> | null = null
const preparedTextCache = new Map<string, PreparedTextWithSegments>()
let messageQueue = Promise.resolve()

const ensureEmojiFont = (): Promise<void> => {
    if (emojiFontReady) return emojiFontReady

    emojiFontReady = (async () => {
        const WorkerFontFace = (self as any).FontFace
        const workerFonts = (self as any).fonts
        if (!WorkerFontFace || !workerFonts) return

        const fontFace = new WorkerFontFace(EMOJI_FONT_FACE, `url(${EMOJI_FONT_URL})`, {
            weight: '100 900'
        })
        await fontFace.load()
        workerFonts.add(fontFace)
        await workerFonts.load(`900 54px ${EMOJI_FONT}`)
    })().catch((error) => {
        console.warn('Could not load overlay emoji font in worker', error)
    })

    return emojiFontReady
}

const clampRect = (rect: Rect): Rect => {
    if (!canvas) return rect
    const x = Math.max(0, Math.floor(rect.x))
    const y = Math.max(0, Math.floor(rect.y))
    const right = Math.min(canvas.width, Math.ceil(rect.x + rect.width))
    const bottom = Math.min(canvas.height, Math.ceil(rect.y + rect.height))
    return { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) }
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

const markDirty = (rect: Rect): void => {
    const nextRect: Rect = {
        x: rect.x - PADDING,
        y: rect.y - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2
    }

    for (let i = 0; i < dirtyRects.length; i++) {
        const dirtyRect = dirtyRects[i]
        if (rectsOverlap(dirtyRect, nextRect)) {
            dirtyRects[i] = mergeRects(dirtyRect, nextRect)
            return
        }
    }

    dirtyRects.push(nextRect)
}

const clearPendingDirty = (): void => {
    if (!context) return

    for (const dirtyRect of dirtyRects) {
        const rect = clampRect(dirtyRect)
        if (rect.width > 0 && rect.height > 0) {
            context.clearRect(rect.x, rect.y, rect.width, rect.height)
        }
    }

    dirtyRects = []
    pendingClear = false
}

const prepareDraw = (): void => {
    if (!pendingClear) {
        drewThisFrame = true
        return
    }

    clearPendingDirty()
    drewThisFrame = true
}

const drawWithShadow = (draw: () => void): void => {
    if (!context) return
    context.save()
    context.shadowColor = SHADOW_COLOUR
    context.shadowBlur = SHADOW_BLUR
    context.shadowOffsetX = SHADOW_OFFSET_X
    context.shadowOffsetY = SHADOW_OFFSET_Y
    draw()
    context.restore()
}

const measureText = (text: string, size: number, font: string): number => {
    const content = String(text)
    const fontDeclaration = `900 ${size}px ${font}`
    const cacheKey = `${fontDeclaration}\n${content}`
    let prepared = preparedTextCache.get(cacheKey)

    if (!prepared) {
        prepared = prepareWithSegments(content, fontDeclaration)
        preparedTextCache.set(cacheKey, prepared)
    }

    return measureNaturalWidth(prepared)
}

const markTextDirty = (x: number, y: number, text: string, size: number, align: CanvasTextAlign, font: string): void => {
    const width = measureText(text, size, font)
    const left = align === 'center' ? x - width / 2 : align === 'right' || align === 'end' ? x - width : x
    markDirty({ x: left, y: y - size, width, height: size * 1.6 })
}

const drawText = (x: number, y: number, text = '', size = 10, align: CanvasTextAlign = 'center', font = 'Oxanium', invertColours = false): void => {
    if (!context) return
    prepareDraw()
    drawWithShadow(() => {
        if (!context) return
        context.font = `900 ${size}px ${font}`
        context.textAlign = align
        context.fillStyle = invertColours ? DARK : WHITE
        context.strokeStyle = invertColours ? WHITE : DARK
        context.strokeText(text, x, y)
        context.fillText(text, x, y)
    })
    markTextDirty(x, y, text, size, align, font)
}

const drawRotatedText = (x: number, y: number, text: string, size: number, rotateZ: number, rotateX: number, rotateY: number, flipX: boolean): void => {
    if (!context) return
    prepareDraw()
    drawWithShadow(() => {
        if (!context) return
        context.save()
        if (flipX) context.scale(-1, 1)
        context.transform(0, rotateY, rotateX, 0, x, y)
        context.rotate(rotateZ)
        context.font = `900 ${size}px ${EMOJI_FONT}`
        context.textAlign = 'center'
        context.strokeStyle = DARK
        context.fillStyle = WHITE
        context.strokeText(text, 0, 0)
        context.fillText(text, 0, 0)
        context.restore()
    })
    markTextDirty(x, y, text, size, 'center', EMOJI_FONT)
}

const getNoteCircleData = (cx: number, cy: number, range: number, radius: number, points: number): Array<{ x: number, y: number, radius?: number }> => {
    const halfRange = range / 2
    const start = (90 - halfRange) * ONE_DEGREE_IN_RADIANS
    const end = (90 + halfRange) * ONE_DEGREE_IN_RADIANS
    const increment = points > 1 ? (end - start) / (points - 1) : 0

    return Array.from({ length: points }, (_, index) => {
        const angle = start + index * increment
        return {
            x: cx + radius * Math.cos(angle),
            y: cy - radius * Math.sin(angle)
        }
    })
}

const drawCircles = (points: Array<{ x: number, y: number, radius?: number }>, radius: number, fill: string): void => {
    if (!context) return
    drawWithShadow(() => {
        if (!context) return
        context.fillStyle = fill
        for (const point of points) {
            context.beginPath()
            context.arc(point.x, point.y, point.radius ?? radius, 0, TAU, true)
            context.fill()
            context.closePath()
        }
    })
}

const clearDirty = (): void => {
    drewThisFrame = false
    pendingClear = dirtyRects.length > 0
    batchingFrame = true
    frameCommands = []
}

const queueFrameCommand = (type: string, payload: any): boolean => {
    if (!batchingFrame || renderingBatch) {
        return false
    }

    frameCommands.push({ type, payload })
    return true
}

const frameNeedsEmojiFont = (commands: OverlayCommand[]): boolean => {
    return commands.some((command) => command.type === 'drawEmoticon')
}

const flushFrame = async (): Promise<void> => {
    if (!batchingFrame) {
        if (pendingClear && !drewThisFrame) {
            clearPendingDirty()
        }
        return
    }

    const commands = frameCommands
    frameCommands = []
    batchingFrame = false

    if (frameNeedsEmojiFont(commands)) {
        await ensureEmojiFont()
    }

    if (pendingClear) {
        clearPendingDirty()
    }

    renderingBatch = true
    for (const command of commands) {
        await executeDrawCommand(command.type, command.payload)
    }
    renderingBatch = false
    drewThisFrame = commands.length > 0
}

const executeDrawCommand = async (type: string, payload: any = {}): Promise<void> => {
    if (!canvas || !context) return

    switch (type) {
        case 'drawElement':
            prepareDraw()
            drawWithShadow(() => {
                context?.drawImage(payload.bitmap, payload.x, payload.y)
            })
            markDirty({ x: payload.x, y: payload.y, width: payload.width, height: payload.height })
            payload.bitmap.close?.()
            break
        case 'drawInstrument': {
            if (!payload.instrumentName) return
            const text = `${String(payload.instrumentName).toUpperCase()}${payload.extra ? `- ${payload.extra}` : ''}`
            drawText(payload.x, payload.y, text, payload.fontSize, 'center', 'Oxanium', false)
            break
        }
        case 'drawParagraph': {
            let textY = payload.y
            for (const line of payload.paragraph) {
                drawText(payload.x, textY, line, payload.size, 'left', 'Oxanium', payload.invertColours)
                textY += payload.lineHeight
            }
            break
        }
        case 'drawText':
            drawText(payload.x, payload.y, payload.text, payload.size, payload.align, payload.font, payload.invertColours)
            break
        case 'drawEmoticon': {
            const size = 54
            drawRotatedText(payload.x, payload.y + 5, payload.emoji, size, payload.rotationZ, payload.rotationX, payload.rotationY, payload.flipX)
            if (payload.numberOfNotesInKey > 0) {
                const data = getNoteCircleData(payload.x, payload.y, 90, size, payload.numberOfNotesInKey)
                if (payload.activeCircleIndex > -1) data[Math.min(payload.activeCircleIndex, data.length - 1)].radius = 4
                drawCircles(data, 2, WHITE)
            }
            const bounds = size + PADDING
            markDirty({ x: payload.x - bounds, y: payload.y - bounds, width: bounds * 2, height: bounds * 2 })
            break
        }
    }
}

const handleMessage = async ({ type, payload = {} }: OverlayCommand): Promise<void> => {
    if (type === 'init') {
        canvas = payload.canvas
        const targetCanvas = canvas
        if (!targetCanvas) return
        targetCanvas.width = payload.width
        targetCanvas.height = payload.height
        context = targetCanvas.getContext('2d')
        dirtyRects = []
        pendingClear = false
        drewThisFrame = false
        batchingFrame = false
        frameCommands = []
        ensureEmojiFont()
        return
    }

    if (!canvas || !context) return

    switch (type) {
        case 'setSize':
            canvas.width = payload.width
            canvas.height = payload.height
            dirtyRects = []
            pendingClear = false
            drewThisFrame = false
            batchingFrame = false
            frameCommands = []
            break
        case 'clear':
            context.clearRect(0, 0, canvas.width, canvas.height)
            dirtyRects = []
            pendingClear = false
            drewThisFrame = false
            batchingFrame = false
            frameCommands = []
            break
        case 'clearDirty':
            clearDirty()
            break
        case 'flushFrame':
            await flushFrame()
            break
        case 'drawElement':
        case 'drawInstrument':
        case 'drawParagraph':
        case 'drawText':
        case 'drawEmoticon':
            if (!queueFrameCommand(type, payload)) {
                await executeDrawCommand(type, payload)
            }
            break
    }
}

self.onmessage = (event: MessageEvent): void => {
    messageQueue = messageQueue
        .then(() => handleMessage(event.data))
        .catch((error) => {
            console.warn('Overlay worker message failed', error)
        })
}
