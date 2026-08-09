import { measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'
import { clamp, cosine, ONE_DEGREE_IN_RADIANS, sine, TAU } from '../maths/maths.js'
import {
	DEFAULT_NOTE_PARTICLE_OPTIONS,
	NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC,
	NOTE_PARTICLE_GRAPHICS_BEES,
	NOTE_PARTICLE_GRAPHICS_BUBBLES,
	NOTE_PARTICLE_GRAPHICS_DINOSAURS,
	NOTE_PARTICLE_GRAPHICS_FACE,
	NOTE_PARTICLE_GRAPHICS_MUSIC,
	NOTE_PARTICLE_GRAPHICS_MUSIC_AND_STARS,
	NOTE_PARTICLE_GRAPHICS_NONE,
	NOTE_PARTICLE_GRAPHICS_NUMBERS,
	NOTE_PARTICLE_GRAPHICS_RANDOM,
	NOTE_PARTICLE_GRAPHICS_SHAPES,
	NOTE_PARTICLE_GRAPHICS_STARS
} from '../settings/options.people.js'
import { MIRRORABLE_EMOJIS } from '../models/emoji.js'
import { drawCircles } from '../visual/2d.js'
import { drawInstrument, drawParagraph, drawText } from '../visual/2d.text.js'
import { SpriteSheet } from '../visual/sprite-sheet.js'

const DEFAULT_PADDING = 24
const EMOJI_FONT_FACE = 'noto-emoji'
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const EMOJI_VISUAL_OFFSET_Y = -15
const SHADOW_COLOUR = 'rgba(0, 0, 0, 0.9)'
const SHADOW_BLUR = 0
const SHADOW_OFFSET_X = 2
const SHADOW_OFFSET_Y = 2
const SHADOW_STROKE_COLOUR = '#0a0a0a'
const MAX_PREPARED_TEXT_CACHE_SIZE = 512
const EMOJI_SPRITE_FONT = `900 54px ${EMOJI_FONT}`

const createEmojiSpriteSheet = () => {
	const sprites = new SpriteSheet()
	sprites.preloadMirroredEmojis(MIRRORABLE_EMOJIS, { font:EMOJI_SPRITE_FONT })
	return sprites
}

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
	noteParticles = []
	lastParticleFrameTime = 0
	emojiSprites = null

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

	getNoteParticleOptions(options = {}) {
		return {
			...DEFAULT_NOTE_PARTICLE_OPTIONS,
			...options,
			noteParticleGlyphs:Array.isArray(options.noteParticleGlyphs) ?
				options.noteParticleGlyphs :
				DEFAULT_NOTE_PARTICLE_OPTIONS.noteParticleGlyphs
		}
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
		this.emojiSprites = createEmojiSpriteSheet()

		document.fonts?.load(`900 54px ${EMOJI_FONT}`)
			.then(() => {
				this.emojiSprites = createEmojiSpriteSheet()
			})
			.catch((error) => {
				console.warn('Could not load overlay emoji font', error)
			})
	}

	destroy() {
		this.clear()
		this.preparedTextCache.clear()
		this.emojiSprites = null
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
		this.preparedTextCache.clear()
		this.noteParticles = []
		this.lastParticleFrameTime = 0
	}

	clear() {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.dirtyRects = []
		this.pendingClear = false
		this.drewThisFrame = false
		this.batchingFrame = false
		this.frameCommands = []
		this.noteParticles = []
		this.lastParticleFrameTime = 0
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
		const drewParticles = this.drawNoteParticleFrame()
		this.drewThisFrame = commands.length > 0 || drewParticles
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

	drawParagraph(x, y, paragraph = [], size = 8, lineHeight = 20, invertColours = false, align = 'center', font = 'oxanium', maxWidth) {
		if (this.queueFrameCommand(() => this.drawParagraph(x, y, paragraph, size, lineHeight, invertColours, align, font, maxWidth))) {
			return
		}

		this.prepareDraw()
		this.drawWithShadow(() => {
			drawParagraph(this.canvasContext, x, y, paragraph, size, lineHeight, invertColours, align, font, maxWidth)
		})
		const lines = Array.isArray(paragraph) ? paragraph : [paragraph]
		const width = Math.max(...lines.map((line) => this.measureTextWidth(line, size, font)), 0)
		this.markDirty({
			x: align === 'center' ? x - width * 0.5 : align === 'right' ? x - width : x,
			y,
			width,
			height: lines.length * lineHeight + DEFAULT_PADDING
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
		this.drawEmoji(x, y + EMOJI_VISUAL_OFFSET_Y, emoji, size, rotationZ, rotationX, rotationY, flipX)

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

	drawNoteParticles(x, y, amplitude = 0, colour = '#fff', options = {}) {
		if (this.queueFrameCommand(() => this.drawNoteParticles(x, y, amplitude, colour, options))) {
			return
		}

		this.spawnNoteParticles(x, y, amplitude, colour, options)
		if (!this.batchingFrame && !this.renderingBatch) {
			this.prepareDraw()
			this.drawNoteParticleFrame()
		}
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
			context.transform(0, rotationY, rotationX, 0, x, y)
			context.rotate(rotationZ)
			const drawnFromSprite = this.emojiSprites?.draw(context, emoji, 0, 0, {
				font:`900 ${size}px ${EMOJI_FONT}`,
				mirrored:flipX,
				fillStyle:'#fff',
				strokeStyle:SHADOW_STROKE_COLOUR
			})
			if (!drawnFromSprite) {
				context.font = `900 ${size}px ${EMOJI_FONT}`
				context.textAlign = 'center'
				context.strokeStyle = SHADOW_STROKE_COLOUR
				context.fillStyle = '#fff'
				if (flipX) context.scale(-1, 1)
				context.strokeText(emoji, 0, 0)
				context.fillText(emoji, 0, 0)
			}
			context.restore()
		})
		this.markTextDirty(x, y, emoji, size, 'center', EMOJI_FONT)
	}

	spawnNoteParticles(x, y, amplitude = 0, colour = '#fff', options = {}) {
		const particleOptions = this.getNoteParticleOptions(options)
		const rawAmplitude = Number(amplitude) || 0
		if (rawAmplitude <= particleOptions.noteParticleAmplitudeThreshold) {
			return
		}

		const amplitudeRatio = clamp(rawAmplitude, 0, 1)
		const quantity = Math.ceil(particleOptions.noteParticleMinQuantity + amplitudeRatio * particleOptions.noteParticleQuantityRange)
		const baseSize = particleOptions.noteParticleMinSize + amplitudeRatio * particleOptions.noteParticleSizeRange
		const horizontalForce = particleOptions.noteParticleHorizontalForceMin + amplitudeRatio * particleOptions.noteParticleHorizontalForceRange
		const verticalForce = particleOptions.noteParticleVerticalForceMin + amplitudeRatio * particleOptions.noteParticleVerticalForceRange
		const particleColour = colour ?? particleOptions.noteParticleDefaultColour
		const rawHorizontalBias = clamp(particleOptions.noteParticleHorizontalBias, -1, 1)
		const horizontalBiasMagnitude = Math.abs(rawHorizontalBias) ** particleOptions.noteParticleHorizontalBiasResponse
		const horizontalBias = Math.sign(rawHorizontalBias) * horizontalBiasMagnitude
		const rawVerticalBias = clamp(particleOptions.noteParticleVerticalBias * particleOptions.noteParticlePitchDirection, -1, 1)
		const verticalBiasResponse = Math.max(Number(particleOptions.noteParticleVerticalBiasResponse) || 1, 0.001)
		const verticalBiasMagnitude = Math.abs(rawVerticalBias) ** verticalBiasResponse
		const verticalBias = Math.sign(rawVerticalBias) * verticalBiasMagnitude
		const verticalForceScale = Math.max(0, 1 + verticalBias * particleOptions.noteParticleVerticalBiasStrength)
		const effectiveVerticalForce = verticalForce * verticalForceScale
		const rightFlowChance = clamp(0.5 + horizontalBias * particleOptions.noteParticleHorizontalBiasStrength * 0.5, 0, 1)
		const amplitudeTravel = particleOptions.noteParticleTravelMin + amplitudeRatio * particleOptions.noteParticleTravelAmplitudeRange

		for (let i = 0; i < quantity; i++) {
			const direction = Math.random() < rightFlowChance ? 1 : -1
			const directionMatch = Math.max(0, horizontalBias * direction)
			const directionBoost = 1 + directionMatch * particleOptions.noteParticleHorizontalBiasStrength
			const maxTravel = Math.min(
				particleOptions.noteParticleMaxTravel,
				amplitudeTravel
					+ directionMatch * particleOptions.noteParticleTravelDirectionRange
					+ Math.max(0, verticalBias) * particleOptions.noteParticleTravelPitchRange
			)
			const spread = direction * directionBoost * (particleOptions.noteParticleHorizontalSpreadMin + Math.random() * particleOptions.noteParticleHorizontalSpreadRange)
			const size = baseSize * (particleOptions.noteParticleSizeRandomMin + Math.random() * particleOptions.noteParticleSizeRandomRange)
			const notesEnabled = particleOptions.noteParticleNotesEnabled !== false
			const graphics = this.getResolvedNoteParticleGraphics(particleOptions)
			const type = this.getNoteParticleType(particleOptions, notesEnabled, graphics)
			const glyph = this.getNoteParticleGlyph(type, amplitudeRatio, particleOptions, graphics)
			const noteRotationLimit = Math.abs(particleOptions.noteParticleNoteRotationLimit)
			if (!type) {
				continue
			}
			this.noteParticles.push({
				x,
				y,
				originX:x,
				originY:y,
				previousX:x,
				previousY:y,
				vx:spread * horizontalForce,
				vy:-(effectiveVerticalForce * (particleOptions.noteParticleVerticalForceRandomMin + Math.random() * particleOptions.noteParticleVerticalForceRandomRange)),
				size,
				age:0,
				life:particleOptions.noteParticleLifeMin + amplitudeRatio * particleOptions.noteParticleLifeRange + Math.random() * particleOptions.noteParticleLifeRandom,
				rotation:type === 'note' ?
					(Math.random() - 0.5) * noteRotationLimit * 2 :
					Math.random() * TAU,
				spin:type === 'note' ?
					(Math.random() - 0.5) * particleOptions.noteParticleNoteSpinRange :
					(Math.random() - 0.5) * particleOptions.noteParticleSpinRange,
				type,
				graphics,
				shape:this.getNoteParticleShape(),
				glyph,
				colour:particleColour,
				maxTravel,
				options:particleOptions
			})
		}

		if (this.noteParticles.length > particleOptions.noteParticleMaxCount) {
			this.noteParticles.splice(0, this.noteParticles.length - particleOptions.noteParticleMaxCount)
		}
	}

	getResolvedNoteParticleGraphics(particleOptions) {
		if (particleOptions.noteParticleGraphics !== NOTE_PARTICLE_GRAPHICS_RANDOM)
		{
			return particleOptions.noteParticleGraphics
		}
		const options = [
			NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC,
			NOTE_PARTICLE_GRAPHICS_MUSIC_AND_STARS,
			NOTE_PARTICLE_GRAPHICS_MUSIC,
			NOTE_PARTICLE_GRAPHICS_STARS,
			NOTE_PARTICLE_GRAPHICS_SHAPES,
			NOTE_PARTICLE_GRAPHICS_BUBBLES,
			NOTE_PARTICLE_GRAPHICS_BEES,
			NOTE_PARTICLE_GRAPHICS_DINOSAURS,
			NOTE_PARTICLE_GRAPHICS_FACE,
			NOTE_PARTICLE_GRAPHICS_NUMBERS
		]
		return options[Math.floor(Math.random() * options.length)]
	}

	getNoteParticleType(particleOptions, notesEnabled = true, graphics = particleOptions.noteParticleGraphics) {
		switch (graphics)
		{
			case NOTE_PARTICLE_GRAPHICS_NONE:
				return null
			case NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC:
			case NOTE_PARTICLE_GRAPHICS_MUSIC:
				return notesEnabled ? 'note' : null
			case NOTE_PARTICLE_GRAPHICS_MUSIC_AND_STARS:
				return notesEnabled && Math.random() >= particleOptions.noteParticleStarProbability ? 'note' : 'star'
			case NOTE_PARTICLE_GRAPHICS_STARS:
				return 'star'
			case NOTE_PARTICLE_GRAPHICS_SHAPES:
				return 'shape'
			case NOTE_PARTICLE_GRAPHICS_BUBBLES:
				return 'bubble'
			case NOTE_PARTICLE_GRAPHICS_BEES:
				return 'bee'
			case NOTE_PARTICLE_GRAPHICS_DINOSAURS:
				return 'dinosaur'
			case NOTE_PARTICLE_GRAPHICS_FACE:
				return 'face'
			case NOTE_PARTICLE_GRAPHICS_NUMBERS:
				return 'number'
			default:
				return notesEnabled && Math.random() >= particleOptions.noteParticleStarProbability ? 'note' : 'star'
		}
	}

	getNoteParticleGlyph(type, amplitudeRatio, particleOptions, graphics = particleOptions.noteParticleGraphics) {
		switch (type)
		{
			case 'bee':
				return particleOptions.noteParticleBeeGlyph ?? DEFAULT_NOTE_PARTICLE_OPTIONS.noteParticleBeeGlyph
			case 'dinosaur':
				return this.getRandomGlyph(particleOptions.noteParticleDinosaurGlyphs, DEFAULT_NOTE_PARTICLE_OPTIONS.noteParticleDinosaurGlyphs)
			case 'face':
				return particleOptions.noteParticleFaceGlyph ?? particleOptions.noteParticleDefaultFaceGlyph
			case 'number':
				return String(clamp(Math.ceil(amplitudeRatio * 9), 1, 9))
			case 'note':
				if (graphics === NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC)
				{
					return this.getAmplitudeGlyph(amplitudeRatio, particleOptions.noteParticleAmplitudeNoteGlyphs, DEFAULT_NOTE_PARTICLE_OPTIONS.noteParticleAmplitudeNoteGlyphs)
				}
				return this.getRandomGlyph(particleOptions.noteParticleGlyphs, DEFAULT_NOTE_PARTICLE_OPTIONS.noteParticleGlyphs)
			default:
				return ''
		}
	}

	getAmplitudeGlyph(amplitudeRatio, glyphs, fallbackGlyphs) {
		const options = Array.isArray(glyphs) && glyphs.length > 0 ? glyphs : fallbackGlyphs
		const index = clamp(Math.ceil(amplitudeRatio * options.length) - 1, 0, options.length - 1)
		return options[index]
	}

	getRandomGlyph(glyphs, fallbackGlyphs) {
		const options = Array.isArray(glyphs) && glyphs.length > 0 ? glyphs : fallbackGlyphs
		return options[Math.floor(Math.random() * options.length)] ?? ''
	}

	getNoteParticleShape() {
		const shapes = ['circle', 'triangle', 'diamond', 'square', 'pentagon', 'hexagon', 'cross', 'plus', 'ring', 'line', 'crescent', 'heart']
		return shapes[Math.floor(Math.random() * shapes.length)]
	}

	drawNoteParticleFrame(now = performance.now()) {
		if (this.noteParticles.length < 1) {
			this.lastParticleFrameTime = now
			return false
		}

		const previousTime = this.lastParticleFrameTime || now
		const frameOptions = this.noteParticles[0]?.options ?? DEFAULT_NOTE_PARTICLE_OPTIONS
		const deltaSeconds = clamp(
			(now - previousTime) / 1000,
			frameOptions.noteParticleFrameMinSeconds,
			frameOptions.noteParticleFrameMaxSeconds
		)
		this.lastParticleFrameTime = now

		const particles = []
		for (const particle of this.noteParticles) {
			particle.previousX = particle.x
			particle.previousY = particle.y
			particle.age += deltaSeconds

			if (particle.age >= particle.life) {
				this.markParticleDirty(particle, 0)
				continue
			}

			const particleOptions = particle.options ?? DEFAULT_NOTE_PARTICLE_OPTIONS
			particle.vy += particleOptions.noteParticleGravity * deltaSeconds
			particle.vx *= particleOptions.noteParticleHorizontalDrag ** (deltaSeconds * 60)
			particle.vy *= particleOptions.noteParticleVerticalDrag ** (deltaSeconds * 60)
			particle.x += particle.vx * deltaSeconds
			particle.y += particle.vy * deltaSeconds
			particle.rotation += particle.spin * deltaSeconds
			if (particle.type === 'note')
			{
				particle.rotation = clamp(particle.rotation, -particleOptions.noteParticleNoteRotationLimit, particleOptions.noteParticleNoteRotationLimit)
			}

			const progress = clamp(particle.age / particle.life, 0, 1)
			const travel = Math.hypot(particle.x - particle.originX, particle.y - particle.originY)
			const maxTravel = particle.maxTravel ?? particleOptions.noteParticleMaxTravel
			const travelFade = 1 - clamp((travel - maxTravel * 0.55) / (maxTravel * 0.45), 0, 1)
			const growDurationRatio = clamp(Number(particleOptions.noteParticleGrowDurationRatio) || 0.35, 0.001, 0.95)
			const growResponse = Math.max(Number(particleOptions.noteParticleGrowResponse) || 1, 0.001)
			const initialSize = Math.max(Number(particleOptions.noteParticleInitialSize) || 1, 0)
			const growProgress = clamp(progress / growDurationRatio, 0, 1)
			const grownSize = initialSize + (particle.size - initialSize) * (growProgress ** growResponse)
			const shrinkProgress = progress <= growDurationRatio ?
				0 :
				(progress - growDurationRatio) / (1 - growDurationRatio)
			const size = grownSize * (1 - shrinkProgress)
			const alpha = (1 - progress) * travelFade

			this.markParticleDirty(particle, size)
			this.drawNoteParticle(particle, size, alpha)
			particles.push(particle)
		}

		this.noteParticles = particles
		return true
	}

	markParticleDirty(particle, size) {
		const radius = Math.max(particle.size, size) + DEFAULT_PADDING
		const left = Math.min(particle.previousX, particle.x) - radius
		const top = Math.min(particle.previousY, particle.y) - radius
		const right = Math.max(particle.previousX, particle.x) + radius
		const bottom = Math.max(particle.previousY, particle.y) + radius

		this.markDirty({
			x:left,
			y:top,
			width:right - left,
			height:bottom - top
		})
	}

	drawNoteParticle(particle, size, alpha) {
		if (size <= 0) {
			return
		}

		const context = this.canvasContext
		context.save()
		context.translate(particle.x, particle.y)
		context.rotate(particle.rotation)
		context.globalAlpha = alpha
		const particleOptions = particle.options ?? DEFAULT_NOTE_PARTICLE_OPTIONS
		context.fillStyle = particle.type === 'note' ? particle.colour ?? particleOptions.noteParticleDefaultColour : particleOptions.noteParticleDefaultColour
		context.strokeStyle = SHADOW_STROKE_COLOUR
		context.lineWidth = Math.max(1, size * 0.08)

		if (particle.type === 'star') {
			context.fillStyle = particleOptions.noteParticleStarColour
			const initialSize = Math.max(Number(particleOptions.noteParticleInitialSize) || 1, 0)
			const starSize = size <= initialSize ?
				size :
				initialSize + (size - initialSize) * particleOptions.noteParticleStarSizeScale
			this.drawStarParticlePath(context, starSize)
			context.stroke()
			context.fill()
		} else if (particle.type === 'shape') {
			this.drawShapeParticlePath(context, particle.shape, size * 0.5)
			context.stroke()
			context.fill()
		} else if (particle.type === 'bubble') {
			context.fillStyle = 'rgba(255, 255, 255, 0.18)'
			context.strokeStyle = particle.colour ?? particleOptions.noteParticleDefaultColour
			context.lineWidth = Math.max(1, size * 0.1)
			this.drawBubbleParticlePath(context, size * 0.48)
			context.fill()
			context.stroke()
		} else if (['bee', 'dinosaur', 'face', 'number'].includes(particle.type)) {
			this.drawTextParticleGlyph(context, particle.glyph, size, ['bee', 'dinosaur', 'face'].includes(particle.type))
		} else {
			this.drawTextParticleGlyph(context, particle.glyph, size, false)
		}

		context.restore()
	}

	drawTextParticleGlyph(context, glyph, size, emoji = false) {
		context.font = emoji ?
			`900 ${size}px ${EMOJI_FONT}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif` :
			`900 ${size}px "noto-music", ${EMOJI_FONT}, serif`
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		if (!emoji)
		{
			context.strokeText(glyph, 0, 0)
		}
		context.fillText(glyph, 0, 0)
	}

	drawBubbleParticlePath(context, radius) {
		context.beginPath()
		context.arc(0, 0, radius, 0, TAU)
		context.moveTo(radius * 0.35, -radius * 0.35)
		context.arc(radius * 0.22, -radius * 0.22, radius * 0.18, -Math.PI * 0.4, Math.PI * 0.85)
	}

	drawShapeParticlePath(context, shape, radius) {
		context.beginPath()
		switch (shape)
		{
			case 'triangle':
				context.moveTo(0, -radius)
				context.lineTo(radius * 0.9, radius * 0.65)
				context.lineTo(-radius * 0.9, radius * 0.65)
				break
			case 'diamond':
				context.moveTo(0, -radius)
				context.lineTo(radius, 0)
				context.lineTo(0, radius)
				context.lineTo(-radius, 0)
				break
			case 'square':
				context.rect(-radius, -radius, radius * 2, radius * 2)
				return
			case 'pentagon':
				this.drawRegularPolygonPath(context, 5, radius)
				return
			case 'hexagon':
				this.drawRegularPolygonPath(context, 6, radius)
				return
			case 'cross':
				this.drawCrossParticlePath(context, radius, true)
				return
			case 'plus':
				this.drawCrossParticlePath(context, radius, false)
				return
			case 'ring':
				context.arc(0, 0, radius, 0, TAU)
				context.arc(0, 0, radius * 0.52, 0, TAU, true)
				return
			case 'line':
				context.moveTo(-radius, 0)
				context.lineTo(radius, 0)
				return
			case 'crescent':
				context.arc(-radius * 0.18, 0, radius, Math.PI * 0.22, Math.PI * 1.78)
				context.arc(radius * 0.28, 0, radius * 0.78, Math.PI * 1.72, Math.PI * 0.28, true)
				break
			case 'heart':
				context.moveTo(0, radius * 0.75)
				context.bezierCurveTo(-radius * 1.25, -radius * 0.05, -radius * 0.78, -radius, 0, -radius * 0.45)
				context.bezierCurveTo(radius * 0.78, -radius, radius * 1.25, -radius * 0.05, 0, radius * 0.75)
				break
			default:
				context.arc(0, 0, radius, 0, TAU)
				return
		}
		context.closePath()
	}

	drawRegularPolygonPath(context, points, radius) {
		context.beginPath()
		for (let i = 0; i < points; i++) {
			const angle = -Math.PI / 2 + i * TAU / points
			const x = cosine(angle) * radius
			const y = sine(angle) * radius
			if (i === 0) {
				context.moveTo(x, y)
			}else{
				context.lineTo(x, y)
			}
		}
		context.closePath()
	}

	drawCrossParticlePath(context, radius, diagonal = false) {
		const arm = radius * 0.36
		const outer = radius
		const points = [
			[-arm, -outer], [arm, -outer], [arm, -arm], [outer, -arm],
			[outer, arm], [arm, arm], [arm, outer], [-arm, outer],
			[-arm, arm], [-outer, arm], [-outer, -arm], [-arm, -arm]
		]
		context.save()
		if (diagonal)
		{
			context.rotate(Math.PI / 4)
		}
		context.beginPath()
		points.forEach(([x, y], index) => {
			if (index === 0) {
				context.moveTo(x, y)
			}else{
				context.lineTo(x, y)
			}
		})
		context.closePath()
		context.restore()
	}

	drawStarParticlePath(context, radius) {
		const innerRadius = radius * 0.45
		context.beginPath()
		for (let i = 0; i < 10; i++) {
			const pointRadius = i % 2 === 0 ? radius : innerRadius
			const angle = -Math.PI / 2 + i * Math.PI / 5
			const x = cosine(angle) * pointRadius
			const y = sine(angle) * pointRadius
			if (i === 0) {
				context.moveTo(x, y)
			} else {
				context.lineTo(x, y)
			}
		}
		context.closePath()
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
			if (this.preparedTextCache.size >= MAX_PREPARED_TEXT_CACHE_SIZE) {
				const oldestKey = this.preparedTextCache.keys().next().value
				if (oldestKey) {
					this.preparedTextCache.delete(oldestKey)
				}
			}
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
