import { measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'
import { cosine, ONE_DEGREE_IN_RADIANS, sine } from '../maths/maths.js'
import { drawCircles } from '../visual/2d.js'
import { drawInstrument, drawParagraph, drawText } from '../visual/2d.text.js'

const DEFAULT_PADDING = 24
const EMOJI_FONT_FACE = 'noto-emoji'
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const SHADOW_COLOUR = 'rgba(0, 0, 0, 0.9)'
const SHADOW_BLUR = 0
const SHADOW_OFFSET_X = 2
const SHADOW_OFFSET_Y = 2
const SHADOW_STROKE_COLOUR = '#0a0a0a'

const clampRect = (rect, width, height) => {
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

const rectsOverlap = (a, b) => {
	return a.x <= b.x + b.width &&
		a.x + a.width >= b.x &&
		a.y <= b.y + b.height &&
		a.y + a.height >= b.y
}

const mergeRects = (a, b) => {
	const x = Math.min(a.x, b.x)
	const y = Math.min(a.y, b.y)
	const right = Math.max(a.x + a.width, b.x + b.width)
	const bottom = Math.max(a.y + a.height, b.y + b.height)
	return { x, y, width: right - x, height: bottom - y }
}

export default class DisplayOverlay2d {
	name = 'DisplayOverlay2D'
	context = null
	dirtyRects = []
	pendingClear = false
	drewThisFrame = false
	batchingFrame = false
	renderingBatch = false
	frameCommands = []
	preparedTextCache = new Map()

	get width() {
		return this.canvasWidth
	}

	get height() {
		return this.canvasHeight
	}

	get canvasContext() {
		if (!this.context) {
			throw new Error('Could not create overlay canvas context')
		}
		return this.context
	}

	constructor(canvas, initialWidth = canvas.width, initialHeight = canvas.height) {
		this.canvas = canvas
		this.canvasWidth = initialWidth
		this.canvasHeight = initialHeight
		this.canvas.width = initialWidth
		this.canvas.height = initialHeight

		const context = canvas.getContext('2d', { alpha: true })
		if (!context) {
			throw new Error('Could not create overlay canvas context')
		}
		this.context = context

		document.fonts?.load(`900 54px ${EMOJI_FONT}`).catch((error) => {
			console.warn('Could not load overlay emoji font', error)
		})
	}

	destroy() {
		this.clear()
		this.context = null
	}

	setSize(width, height) {
		this.canvasWidth = width
		this.canvasHeight = height

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

	clear() {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.dirtyRects = []
		this.pendingClear = false
		this.drewThisFrame = false
		this.batchingFrame = false
		this.frameCommands = []
	}

	clearDirty() {
		this.pendingClear = this.dirtyRects.length > 0
		this.drewThisFrame = false
		this.batchingFrame = true
		this.frameCommands = []
	}

	flushFrame() {
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

	drawElement(element, x = 0, y = 0) {
		if (this.queueFrameCommand(() => this.drawElement(element, x, y))) {
			return
		}

		const width = element.width ?? element.videoWidth ?? this.canvas.width
		const height = element.height ?? element.videoHeight ?? this.canvas.height

		this.prepareDraw()
		this.drawWithShadow(() => {
			this.canvasContext.drawImage(element, x, y)
		})
		this.markDirty({ x, y, width, height })
	}

	drawInstrument(x, y, instrumentName, extra = '', fontSize = 24) {
		if (this.queueFrameCommand(() => this.drawInstrument(x, y, instrumentName, extra, fontSize))) {
			return
		}

		this.prepareDraw()
		this.drawWithShadow(() => {
			drawInstrument(this.canvasContext, x, y, instrumentName, extra, fontSize)
		})
		const text = `${instrumentName}${extra ? ` ${extra}` : ''}`
		this.markTextDirty(x, y, text, fontSize, 'center')
	}

	drawParagraph(x, y, paragraph = [], size = 8, lineHeight = 20, invertColours = false) {
		if (this.queueFrameCommand(() => this.drawParagraph(x, y, paragraph, size, lineHeight, invertColours))) {
			return
		}

		this.prepareDraw()
		this.drawWithShadow(() => {
			drawParagraph(this.canvasContext, x, y, paragraph, size, lineHeight, invertColours)
		})
		const width = Math.max(...paragraph.map((line) => this.measureTextWidth(line, size)), 0)
		this.markDirty({
			x,
			y,
			width,
			height: paragraph.length * lineHeight + DEFAULT_PADDING
		})
	}

	drawText(x, y, text, size = 24, align = 'center', font = 'oxanium', invertColours = false) {
		if (this.queueFrameCommand(() => this.drawText(x, y, text, size, align, font, invertColours))) {
			return
		}

		this.prepareDraw()
		this.drawWithShadow(() => {
			drawText(this.canvasContext, x, y, text, size, align, font, invertColours)
		})
		this.markTextDirty(x, y, text, size, align, font)
	}

	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false) {
		if (this.queueFrameCommand(() => this.drawEmoticon(x, y, emoji, rotationZ, rotationY, rotationX, activeCircleIndex, numberOfNotesInKey, flipX))) {
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

	queueFrameCommand(command) {
		if (!this.batchingFrame || this.renderingBatch) {
			return false
		}

		this.frameCommands.push(command)
		return true
	}

	markDirty(rect) {
		const nextRect = {
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

	prepareDraw() {
		if (!this.pendingClear) {
			this.drewThisFrame = true
			return
		}

		this.clearPendingDirty()
		this.drewThisFrame = true
	}

	clearPendingDirty() {
		for (const dirtyRect of this.dirtyRects) {
			const rect = clampRect(dirtyRect, this.canvas.width, this.canvas.height)
			if (rect.width > 0 && rect.height > 0) {
				this.canvasContext.clearRect(rect.x, rect.y, rect.width, rect.height)
			}
		}

		this.dirtyRects = []
		this.pendingClear = false
	}

	drawWithShadow(draw) {
		const context = this.canvasContext
		context.save()
		context.shadowColor = SHADOW_COLOUR
		context.shadowBlur = SHADOW_BLUR
		context.shadowOffsetX = SHADOW_OFFSET_X
		context.shadowOffsetY = SHADOW_OFFSET_Y
		draw()
		context.restore()
	}

	drawEmoji(x, y, emoji, size, rotationZ, rotationX, rotationY, flipX) {
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

	markTextDirty(x, y, text, size, align = 'center', font = 'oxanium') {
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

	measureTextWidth(text, size, font = 'oxanium') {
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

	getNoteCircleData(cx, cy, range = 90, radius = 70, numberOfPoints = 12) {
		const halfRange = range / 2
		const startAngleDegrees = 90 - halfRange
		const endAngleDegrees = 90 + halfRange

		const startAngleRadians = startAngleDegrees * ONE_DEGREE_IN_RADIANS
		const endAngleRadians = endAngleDegrees * ONE_DEGREE_IN_RADIANS
		const angleIncrement = numberOfPoints > 1 ? (endAngleRadians - startAngleRadians) / (numberOfPoints - 1) : 0

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
