import { measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'
import { clamp, cosine, sine, TAU } from '../maths/maths.js'
import { drawNotation as drawTraditionalNotation, getNotationBounds } from '../audio/notation.js'
import {
	DEFAULT_NOTE_PARTICLE_OPTIONS,
	NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC,
	NOTE_PARTICLE_GRAPHICS_BEES,
	NOTE_PARTICLE_GRAPHICS_BUBBLES,
	NOTE_PARTICLE_GRAPHICS_DINOSAURS,
	NOTE_PARTICLE_GRAPHICS_EMOJI,
	NOTE_PARTICLE_GRAPHICS_FACE,
	NOTE_PARTICLE_GRAPHICS_MUSIC,
	NOTE_PARTICLE_GRAPHICS_MUSIC_AND_STARS,
	NOTE_PARTICLE_GRAPHICS_NONE,
	NOTE_PARTICLE_GRAPHICS_NOTE_NAME,
	NOTE_PARTICLE_GRAPHICS_NUMBERS,
	NOTE_PARTICLE_GRAPHICS_POPPING_BUBBLES,
	NOTE_PARTICLE_GRAPHICS_RANDOM,
	NOTE_PARTICLE_GRAPHICS_SHAPES,
	NOTE_PARTICLE_GRAPHICS_STARS
} from '../settings/options.people.js'
import { MIRRORABLE_EMOJIS } from '../models/emoji.js'
import { drawCircle, drawCircles } from '../visual/2d.js'
import { drawInstrument, drawParagraph, drawText } from '../visual/2d.text.js'
import { SpriteSheet } from '../visual/sprite-sheet.js'
import { createNoteCircleData } from './note-circle.js'
import { createOctaveLineData, drawOctaveLines } from './octave-indicator.js'
import { clampRect, mergeRects, rectsOverlap } from '../maths/rectangles.js'

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
const MIN_BEAT_COLUMN_SLOTS = 12
const BEAT_COLUMN_ACCENT_SLOTS = 6
const BEAT_COLOURS = Object.freeze({
	kick:'#ff633f',
	snare:'#ff4f9a',
	cymbal:'#ffd84a',
	drum:'#42bff5',
	shaker:'#55df91',
	metal:'#b68cff',
	wood:'#ff9f43',
	other:'#7ce7ff'
})

const PERCUSSION_COLOUR_BY_LANE = Object.freeze(Object.fromEntries([
	[['kick', 'kickAcoustic', 'surdoMute', 'surdoOpen'], BEAT_COLOURS.kick],
	[['snare', 'snareElectric', 'clap', 'rimshot', 'crossStick', 'fingerSnap'], BEAT_COLOURS.snare],
	[['hat', 'hatOpen', 'hatPedal', 'crash', 'crash2', 'ride', 'ride2', 'rideBell', 'splash', 'china'], BEAT_COLOURS.cymbal],
	[['tomFloorLow', 'tomFloorHigh', 'tomMidHigh', 'laserTom', 'syndrum', 'bongoHigh', 'bongoLow', 'congaMute', 'congaHigh', 'congaLow', 'timbaleHigh', 'timbaleLow', 'cuicaMute', 'cuicaOpen'], BEAT_COLOURS.drum],
	[['cabasa', 'maracas', 'tambourine', 'chekere', 'guiroShort', 'guiroLong', 'quijada'], BEAT_COLOURS.shaker],
	[['triangleMute', 'triangleOpen', 'agogoHigh', 'agogoLow', 'jingleBell', 'starChime', 'windChime', 'whistleShort', 'whistleLong', 'metalHit'], BEAT_COLOURS.metal],
	[['claves', 'woodblockHigh', 'woodblockLow', 'castanets'], BEAT_COLOURS.wood],
].flatMap(([lanes, colour]) => lanes.map(lane => [lane, colour]))))
const percussionColourCache = new Map()

const getPercussionColour = lane => {
	const laneName = String(lane)
	const directColour = PERCUSSION_COLOUR_BY_LANE[laneName]
	if (directColour) return directColour
	const cachedColour = percussionColourCache.get(laneName)
	if (cachedColour) return cachedColour

	const name = laneName.toLowerCase()
	let colour = BEAT_COLOURS.other
	if (name.includes('kick') || name.includes('surdo')) colour = BEAT_COLOURS.kick
	else if (name.includes('snare') || name.includes('clap') || name.includes('rim') || name.includes('stick') || name.includes('snap')) colour = BEAT_COLOURS.snare
	else if (name.includes('hat') || name.includes('crash') || name.includes('ride') || name.includes('splash') || name.includes('china')) colour = BEAT_COLOURS.cymbal
	else if (name.includes('tom') || name.includes('conga') || name.includes('bongo') || name.includes('timbale') || name.includes('cuica')) colour = BEAT_COLOURS.drum
	else if (name.includes('shak') || name.includes('maraca') || name.includes('cabasa') || name.includes('tambourine') || name.includes('chekere') || name.includes('guiro') || name.includes('quijada')) colour = BEAT_COLOURS.shaker
	else if (name.includes('bell') || name.includes('triangle') || name.includes('agogo') || name.includes('metal') || name.includes('chime') || name.includes('whistle')) colour = BEAT_COLOURS.metal
	else if (name.includes('wood') || name.includes('clave') || name.includes('castanet')) colour = BEAT_COLOURS.wood
	percussionColourCache.set(laneName, colour)
	return colour
}

const getBeatPulse = progress => {
	const attack = Math.min(1, progress / 0.12)
	if (progress < 0.12) return 1 - Math.pow(1 - attack, 4)
	return 1 - Math.max(0, (progress - 0.12) / 0.88)
}

const formatPercussionLane = lane => String(lane)
	.replace(/([a-z])([A-Z])/g, '$1 $2')
	.replace(/[-_]/g, ' ')
	.toUpperCase()
	.slice(0, 11)

const getPercussionLanes = (sequence, requestedLanes=[]) => [...new Set([
	...(requestedLanes ?? []),
	...sequence.flatMap(beat => Object.keys(beat ?? {}))
])].filter(lane => !['events', 'hatOpen'].includes(lane))

const getPercussionVelocity = (beat, lane) => lane === 'hat'
	? Math.max(Number(beat.hat) || 0, Number(beat.hatOpen) || 0)
	: Number(beat[lane]) || 0

const getPercussionRippleColour = lane => {
	let hash = 0
	for (const character of String(lane)) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0
	return `hsl(${Math.abs(hash) % 360} 92% 65%)`
}

const EMPTY_BEAT_SEQUENCE = Object.freeze([])
const EMPTY_PERCUSSION_LANES = Object.freeze([])
const beatMetadataCache = new WeakMap()

const createBeatMetadata = (sequence, requestedLanes) => {
	const lanes = getPercussionLanes(sequence, requestedLanes)
	const laneData = lanes.map(lane => ({
		lane,
		label:formatPercussionLane(lane),
		colour:getPercussionColour(lane),
		velocities:Float64Array.from(sequence, beat => getPercussionVelocity(beat ?? {}, lane))
	}))
	const beatColours = new Array(sequence.length)
	const beatHits = new Array(sequence.length)

	for (let beatIndex = 0; beatIndex < sequence.length; beatIndex++) {
		const beat = sequence[beatIndex] ?? {}
		const colours = []
		const seenColours = new Set()
		for (const [lane, velocity] of Object.entries(beat)) {
			if (Number(velocity) <= 0) continue
			const colour = getPercussionColour(lane)
			if (!seenColours.has(colour)) {
				seenColours.add(colour)
				colours.push(colour)
			}
		}
		beatColours[beatIndex] = colours
		beatHits[beatIndex] = laneData
			.filter(({ velocities }) => velocities[beatIndex] > 0)
			.map(({ lane, velocities }) => ({
				lane,
				velocity:Math.min(255, velocities[beatIndex]),
				colour:getPercussionRippleColour(lane)
			}))
	}

	return {
		lanes,
		laneData,
		beatColours,
		beatHits,
		requestedLaneCount:getPercussionLanes(EMPTY_BEAT_SEQUENCE, requestedLanes).length
	}
}

const getBeatMetadata = (sequence, requestedLanes=EMPTY_PERCUSSION_LANES) => {
	let metadataByLanes = beatMetadataCache.get(sequence)
	if (!metadataByLanes) {
		metadataByLanes = new WeakMap()
		beatMetadataCache.set(sequence, metadataByLanes)
	}
	const laneKey = Array.isArray(requestedLanes) ? requestedLanes : EMPTY_PERCUSSION_LANES
	let metadata = metadataByLanes.get(laneKey)
	if (!metadata) {
		metadata = createBeatMetadata(sequence, laneKey)
		metadataByLanes.set(laneKey, metadata)
	}
	return metadata
}

const createEmojiSpriteSheet = () => {
	const sprites = new SpriteSheet()
	sprites.preloadMirroredEmojis(MIRRORABLE_EMOJIS, { font:EMOJI_SPRITE_FONT })
	return sprites
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
	beatRipples = []
	lastBeatRipplePosition = null
	lastBeatRippleStep = null
	beatVizMode = null
	beatStaticLayer = null
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
		this.beatStaticLayer = null
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
		this.beatRipples = []
		this.lastBeatRipplePosition = null
		this.lastBeatRippleStep = null
		this.beatStaticLayer = null
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
		this.beatRipples = []
		this.lastBeatRipplePosition = null
		this.lastBeatRippleStep = null
		this.beatStaticLayer = null
	}

	clearDirty() {
		this.pendingClear = this.dirtyRects.length > 0
		this.drewThisFrame = false
		this.batchingFrame = true
		this.frameCommands = []
	}

	drawBeatProgress(progress=0, beats=16, options={}) {
		const mode = options.mode ?? 'summary'
		if (this.beatVizMode !== mode) {
			this.beatRipples = []
			this.lastBeatRipplePosition = null
			this.lastBeatRippleStep = null
			this.beatVizMode = mode
		}
		if (mode === 'disabled') return
		const context = this.canvasContext
		const sequence = Array.isArray(beats) ? beats : EMPTY_BEAT_SEQUENCE
		const count = Math.max(1, sequence.length || Math.floor(beats) || 16)
		const metadata = getBeatMetadata(sequence, options.lanes)
		const normalisedProgress = ((Number(progress) || 0) % 1 + 1) % 1
		const currentStep = Math.min(count - 1, Math.floor(normalisedProgress * count))
		const stepProgress = normalisedProgress * count - currentStep
		if (mode === 'grid') {
			return this.drawBeatGrid(sequence, currentStep, stepProgress, metadata)
		}
		if (mode === 'vertical') {
			return this.drawBeatColumns(sequence, currentStep, stepProgress, metadata)
		}
		if (mode === 'clock') {
			return this.drawBeatClock(sequence, currentStep, stepProgress, metadata)
		}
		if (mode === 'ripples') {
			return this.drawBeatRipples(sequence, currentStep, stepProgress, metadata)
		}
		const radius = clamp(Math.min(this.width * 0.86 / (count * 3.1), this.height * 0.022), 4.5, 14)
		const gap = radius * 3.05
		const startX = this.width * 0.5 - gap * (count - 1) * 0.5
		const y = Math.max(radius * 3, this.height - radius * 3.4)
		const bounds = { x:startX - radius * 3, y:y - radius * 3, width:gap * (count - 1) + radius * 6, height:radius * 6 }
		const drawBeat = (target, index, animated=false) => {
			const isCurrent = index === currentStep
			const pulse = animated && isCurrent ? getBeatPulse(stepProgress) : 0
			const beatRadius = radius * (1 + pulse * 0.62)
			const x = startX + index * gap
			const colours = metadata.beatColours[index] ?? EMPTY_PERCUSSION_LANES
			const isFuture = index > currentStep
			const alpha = isCurrent ? 1 : isFuture ? 0.82 : 0.26

			target.globalAlpha = alpha
			target.shadowColor = isCurrent ? (colours[0] ?? '#ffffff') : 'rgba(0, 0, 0, 0.8)'
			target.shadowBlur = isCurrent ? radius * (0.8 + pulse * 1.4) : radius * 0.45
			target.beginPath()
			target.arc(x, y, beatRadius, 0, TAU)
			target.fillStyle = 'rgba(12, 16, 24, 0.72)'
			target.fill()

			if (colours.length) {
				const slice = TAU / colours.length
				colours.forEach((colour, colourIndex) => {
					target.beginPath()
					target.moveTo(x, y)
					target.arc(x, y, beatRadius, -Math.PI * 0.5 + colourIndex * slice, -Math.PI * 0.5 + (colourIndex + 1) * slice)
					target.closePath()
					target.fillStyle = colour
					target.fill()
				})
			}

			target.beginPath()
			target.arc(x, y, beatRadius, 0, TAU)
			target.strokeStyle = isCurrent ? '#ffffff' : index % 4 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.48)'
			target.lineWidth = isCurrent ? Math.max(2, radius * 0.24) : index % 4 === 0 ? Math.max(1.5, radius * 0.18) : Math.max(1, radius * 0.12)
			target.stroke()
		}
		const staticLayer = this.getBeatStaticLayer('summary', metadata, currentStep, bounds, target => {
			for (let index = 0; index < count; index++) {
				if (index !== currentStep) drawBeat(target, index)
			}
		})
		const draw = () => {
			context.save()
			if (staticLayer) {
				context.drawImage(staticLayer.canvas, staticLayer.x, staticLayer.y)
				drawBeat(context, currentStep, true)
			}else{
				for (let index = 0; index < count; index++) drawBeat(context, index, true)
			}
			context.restore()
			this.markDirty(bounds)
		}
		if (this.batchingFrame && !this.renderingBatch) this.frameCommands.push(draw)
		else draw()
	}

	drawBeatGrid(sequence=[], currentStep=0, stepProgress=0, metadata=getBeatMetadata(sequence)) {
		const context = this.canvasContext
		const count = Math.max(16, sequence.length)
		const { laneData } = metadata
		if (!laneData.length) return

		const padding = 7
		const maxPanelHeight = this.height * 0.34
		const rowGap = clamp(maxPanelHeight / laneData.length, 4.25, 8)
		const columnGap = clamp(Math.min(this.width * 0.34 / count, 8), 5.25, 8)
		const labelWidth = clamp(this.width * 0.09, 42, 68)
		const gridWidth = columnGap * (count - 1)
		const panelWidth = labelWidth + gridWidth + padding * 2
		const panelHeight = rowGap * Math.max(0, laneData.length - 1) + padding * 2
		const panelX = this.width * 0.5 - panelWidth * 0.5
		const panelY = Math.max(padding, this.height - panelHeight - padding * 2)
		const dotsX = panelX + padding + labelWidth
		const dotsY = panelY + padding
		const pulse = getBeatPulse(stepProgress)
		const bounds = { x:panelX - padding, y:panelY - padding, width:panelWidth + padding * 2, height:panelHeight + padding * 2 }
		const drawGuidesAndLabels = target => {
			for (let column = 0; column < count; column += 4) {
				const x = dotsX + column * columnGap
				target.beginPath()
				target.moveTo(x, panelY + 3)
				target.lineTo(x, panelY + panelHeight - 3)
				target.strokeStyle = 'rgba(255, 255, 255, 0.12)'
				target.lineWidth = 1
				target.stroke()
			}
			laneData.forEach(({ label, colour }, row) => {
				target.globalAlpha = 0.86
				target.fillStyle = colour
				target.font = `600 ${clamp(rowGap * 0.68, 5, 7.5)}px sans-serif`
				target.textAlign = 'right'
				target.textBaseline = 'middle'
				target.fillText(label, dotsX - 6, dotsY + row * rowGap)
			})
		}
		const drawColumn = (target, column, animated=false) => {
			laneData.forEach(({ colour, velocities }, row) => {
				const y = dotsY + row * rowGap
				const velocity = velocities[column] ?? 0
				const hasHit = velocity > 0
				const isCurrent = column === currentStep
				const isFuture = column > currentStep
				const baseRadius = hasHit ? 1.35 + Math.min(1, velocity / 255) * 1.35 : 0.72
				const dotRadius = baseRadius * (animated && isCurrent ? 1 + pulse * 0.72 : 1)
				const x = dotsX + column * columnGap
				target.globalAlpha = isCurrent ? 1 : isFuture ? (hasHit ? 0.82 : 0.38) : (hasHit ? 0.2 : 0.1)
				target.shadowColor = isCurrent ? colour : 'transparent'
				target.shadowBlur = isCurrent ? 2 + pulse * 4 : 0
				target.beginPath()
				target.arc(x, y, dotRadius, 0, TAU)
				target.fillStyle = hasHit ? colour : '#ffffff'
				target.fill()
				if (isCurrent) {
					target.strokeStyle = '#ffffff'
					target.lineWidth = 0.65
					target.stroke()
				}
			})
		}
		const staticLayer = this.getBeatStaticLayer('grid', metadata, currentStep, bounds, target => {
			drawGuidesAndLabels(target)
			for (let column = 0; column < count; column++) {
				if (column !== currentStep) drawColumn(target, column)
			}
		})
		const draw = () => {
			context.save()
			if (staticLayer) {
				context.drawImage(staticLayer.canvas, staticLayer.x, staticLayer.y)
				drawColumn(context, currentStep, true)
			}else{
				drawGuidesAndLabels(context)
				for (let column = 0; column < count; column++) drawColumn(context, column, true)
			}
			context.restore()
			this.markDirty(bounds)
		}
		if (this.batchingFrame && !this.renderingBatch) this.frameCommands.push(draw)
		else draw()
	}

	drawBeatColumns(sequence=[], currentStep=0, stepProgress=0, metadata=getBeatMetadata(sequence)) {
		const context = this.canvasContext
		const count = Math.max(16, sequence.length)
		const { laneData, requestedLaneCount } = metadata
		if (!laneData.length) return

		const margin = clamp(this.width * 0.015, 10, 20)
		// The current beat can introduce short-lived accent lanes. Reserve their
		// slots so those lanes can appear without moving the whole right-hand grid.
		const columnSlotCount = Math.max(
			MIN_BEAT_COLUMN_SLOTS,
			requestedLaneCount + BEAT_COLUMN_ACCENT_SLOTS
		)
		const reservedColumnGap = clamp(Math.min(this.width * 0.28 / columnSlotCount, 8), 5, 8)
		const gridWidth = reservedColumnGap * Math.max(0, columnSlotCount - 1)
		const columnGap = laneData.length > columnSlotCount
			? gridWidth / Math.max(1, laneData.length - 1)
			: reservedColumnGap
		const rowGap = clamp((this.height - margin * 2) / Math.max(1, count - 1), 4, 7)
		const gridHeight = rowGap * Math.max(0, count - 1)
		const dotsX = this.width - margin - gridWidth
		const dotsY = margin
		const pulse = getBeatPulse(stepProgress)
		const bounds = {
			x:dotsX - margin,
			y:0,
			width:gridWidth + margin * 2,
			height:gridHeight + margin * 2
		}
		const drawGuides = target => {
			for (let row = 0; row < count; row += 4) {
				const y = dotsY + row * rowGap
				target.beginPath()
				target.moveTo(dotsX - 3, y)
				target.lineTo(dotsX + gridWidth + 3, y)
				target.strokeStyle = row % 16 === 0 ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.1)'
				target.lineWidth = row % 16 === 0 ? 1.25 : 0.75
				target.stroke()
			}
		}
		const drawRow = (target, row, animated=false) => {
			laneData.forEach(({ colour, velocities }, column) => {
				const x = dotsX + column * columnGap
				const velocity = velocities[row] ?? 0
				const hasHit = velocity > 0
				const isCurrent = row === currentStep
				const isFuture = row > currentStep
				const baseRadius = hasHit ? 1.35 + Math.min(1, velocity / 255) * 1.35 : 0.72
				const dotRadius = baseRadius * (animated && isCurrent ? 1 + pulse * 0.72 : 1)
				const y = dotsY + row * rowGap
				target.globalAlpha = isCurrent ? 0.96 : isFuture ? (hasHit ? 0.76 : 0.34) : (hasHit ? 0.58 : 0.24)
				target.shadowColor = isCurrent ? colour : 'transparent'
				target.shadowBlur = isCurrent ? 2 + pulse * 4 : 0
				target.beginPath()
				target.arc(x, y, dotRadius, 0, TAU)
				target.fillStyle = hasHit ? colour : '#ffffff'
				target.fill()
			})
		}
		const staticLayer = this.getBeatStaticLayer('vertical', metadata, currentStep, bounds, target => {
			drawGuides(target)
			for (let row = 0; row < count; row++) {
				if (row !== currentStep) drawRow(target, row)
			}
		})
		const draw = () => {
			context.save()
			if (staticLayer) {
				context.drawImage(staticLayer.canvas, staticLayer.x, staticLayer.y)
				drawRow(context, currentStep, true)
			}else{
				drawGuides(context)
				for (let row = 0; row < count; row++) drawRow(context, row, true)
			}
			context.restore()
			this.markDirty(bounds)
		}
		if (this.batchingFrame && !this.renderingBatch) this.frameCommands.push(draw)
		else draw()
	}

	drawBeatClock(sequence=[], currentStep=0, stepProgress=0, metadata=getBeatMetadata(sequence)) {
		const context = this.canvasContext
		const count = Math.max(1, sequence.length)
		const { laneData } = metadata
		if (!laneData.length) return

		const size = Math.min(320, this.width * 0.42, this.height * 0.7)
		const x = this.width / 2
		const y = this.height / 2
		const outerRadius = size * 0.37
		const innerRadius = outerRadius * 0.38
		const laneGap = (outerRadius - innerRadius) / Math.max(1, laneData.length - 1)
		const dotSize = Math.min(2.7, laneGap * 0.32, innerRadius * Math.PI / count * 0.65)
		const pulse = getBeatPulse(stepProgress)
		const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
		const position = currentStep + (reducedMotion ? 0 : stepProgress)
		const bounds = { x:x - size / 2, y:y - size / 2, width:size, height:size }
		const draw = () => {
			context.save()
			context.textAlign = 'center'
			context.textBaseline = 'middle'
			context.font = `600 ${Math.max(8, size * 0.035)}px sans-serif`
			context.fillStyle = '#ffffff'
			for (let hour = 1; hour <= 12; hour++) {
				const angle = hour / 12 * TAU - Math.PI / 2
				context.fillText(String(hour), x + Math.cos(angle) * size * 0.44, y + Math.sin(angle) * size * 0.44)
			}
			// The face and playhead stay fixed; upcoming hits approach from the right.
			context.beginPath()
			context.moveTo(x, y - innerRadius + 6)
			context.lineTo(x, y - outerRadius - 7)
			context.strokeStyle = 'rgba(255, 255, 255, 0.7)'
			context.lineWidth = 1.5
			context.stroke()
			laneData.forEach(({ colour, velocities }, lane) => {
				const radius = outerRadius - lane * laneGap
				context.globalAlpha = 0.16
				context.strokeStyle = colour
				context.lineWidth = 0.75
				context.beginPath()
				context.arc(x, y, radius, 0, TAU)
				context.stroke()
				for (let step = 0; step < count; step++) {
					const velocity = velocities[step] ?? 0
					const angle = (step - position) / count * TAU - Math.PI / 2
					context.globalAlpha = velocity > 0 ? 0.8 : 0.15
					context.fillStyle = velocity > 0 ? colour : '#ffffff'
					context.beginPath()
					context.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius,
						velocity > 0 ? dotSize * (0.5 + Math.min(1, velocity / 255) * 0.5) : dotSize * 0.3, 0, TAU)
					context.fill()
				}
				// Keep the sounding beat at twelve throughout its step as the sequence moves on.
				if ((velocities[currentStep] ?? 0) > 0) {
					context.globalAlpha = 1
					context.fillStyle = colour
					context.shadowColor = colour
					context.shadowBlur = reducedMotion ? 0 : 3 + pulse * 5
					context.beginPath()
					context.arc(x, y - radius, dotSize * (reducedMotion ? 1.2 : 1.2 + pulse * 0.6), 0, TAU)
					context.fill()
					context.shadowBlur = 0
				}
			})
			context.restore()
			this.markDirty(bounds)
		}
		if (this.batchingFrame && !this.renderingBatch) this.frameCommands.push(draw)
		else draw()
	}

	drawBeatRipples(sequence=[], currentStep=0, stepProgress=0, metadata=getBeatMetadata(sequence)) {
		const context = this.canvasContext
		const count = Math.max(16, sequence.length)
		const position = currentStep + stepProgress
		const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
		let elapsedSteps = 0
		if (Number.isFinite(this.lastBeatRipplePosition)) {
			elapsedSteps = position - this.lastBeatRipplePosition
			if (elapsedSteps < 0) elapsedSteps += count
			if (elapsedSteps > count * 0.5) elapsedSteps = 0
		}

		this.beatRipples ??= []
		if (!reducedMotion && elapsedSteps > 0) {
			this.beatRipples.forEach(ripple => ripple.age += elapsedSteps)
		}
		this.beatRipples = this.beatRipples.filter(ripple => ripple.age < 2.4)

		if (this.lastBeatRippleStep !== currentStep) {
			if (reducedMotion) this.beatRipples = []
			for (const hit of metadata.beatHits[currentStep] ?? EMPTY_PERCUSSION_LANES) {
				this.beatRipples.push({
					lane:hit.lane,
					velocity:hit.velocity,
					age:reducedMotion ? 0.7 : stepProgress,
					colour:hit.colour
				})
			}
			this.lastBeatRippleStep = currentStep
		}
		this.lastBeatRipplePosition = position

		const x = this.width * 0.5
		const y = this.height * 0.5
		const minDimension = Math.min(this.width, this.height)
		const maximumRadius = minDimension * 0.32
		const bounds = {
			x:x - maximumRadius,
			y:y - maximumRadius,
			width:maximumRadius * 2,
			height:maximumRadius * 2
		}
		const draw = () => {
			context.save()
			for (const ripple of this.beatRipples) {
				const ageProgress = clamp(ripple.age / 2.4, 0, 1)
				const expansion = 1 - Math.pow(1 - ageProgress, 3)
				const velocityRatio = ripple.velocity / 255
				const targetRadius = minDimension * (0.035 + velocityRatio * 0.265)
				const radius = 1 + targetRadius * expansion
				context.save()
				context.globalAlpha = Math.pow(1 - ageProgress, 1.35)
				context.beginPath()
				context.arc(x, y, radius, 0, TAU)
				context.strokeStyle = ripple.colour
				context.lineWidth = 1.25 + velocityRatio * 2
				context.shadowColor = ripple.colour
				context.shadowBlur = 4 + velocityRatio * 8
				context.stroke()
				context.restore()
			}

			context.beginPath()
			context.arc(x, y, 2.2, 0, TAU)
			context.fillStyle = '#ffffff'
			context.shadowColor = 'rgba(0, 0, 0, 0.9)'
			context.shadowBlur = 3
			context.fill()
			context.restore()
			this.markDirty(bounds)
		}
		if (this.batchingFrame && !this.renderingBatch) this.frameCommands.push(draw)
		else draw()
	}

	getBeatStaticLayer(mode, metadata, currentStep, bounds, drawStatic) {
		if (!this.canvas) return null
		let layer = this.beatStaticLayer
		if (!layer) {
			const canvas = typeof globalThis.OffscreenCanvas === 'function'
				? new globalThis.OffscreenCanvas(1, 1)
				: globalThis.document?.createElement?.('canvas')
			const context = canvas?.getContext?.('2d', { alpha:true })
			if (!canvas || !context) return null
			layer = this.beatStaticLayer = { canvas, context }
		}

		const padding = 10
		const x = Math.floor(bounds.x - padding)
		const y = Math.floor(bounds.y - padding)
		const width = Math.max(1, Math.ceil(bounds.width + padding * 2))
		const height = Math.max(1, Math.ceil(bounds.height + padding * 2))
		if (layer.mode === mode && layer.metadata === metadata && layer.currentStep === currentStep &&
			layer.x === x && layer.y === y && layer.width === width && layer.height === height) {
			return layer
		}

		if (layer.canvas.width !== width) layer.canvas.width = width
		if (layer.canvas.height !== height) layer.canvas.height = height
		layer.context.setTransform(1, 0, 0, 1, 0, 0)
		layer.context.clearRect(0, 0, width, height)
		layer.context.save()
		layer.context.translate(-x, -y)
		drawStatic(layer.context)
		layer.context.restore()
		Object.assign(layer, { mode, metadata, currentStep, x, y, width, height })
		return layer
	}

	flushFrame(effectsContext = null) {
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
		const drewParticles = this.drawNoteParticleFrame(performance.now(), effectsContext)
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

	drawNotation(x, y, noteNumbers = [], octave, size = 32) {
		if (this.queueFrameCommand(() => this.drawNotation(x, y, noteNumbers, octave, size))) {
			return
		}

		this.prepareDraw()
		this.drawWithShadow(() => {
			drawTraditionalNotation(this, x, y, noteNumbers, octave, size)
		})
		this.markDirty(getNotationBounds(x, y, noteNumbers, octave, size))
	}

	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false, noteRangeDegrees = 90, activeNoteColour = '#fff') {
		if (this.queueFrameCommand(() => this.drawEmoticon(x, y, emoji, rotationZ, rotationY, rotationX, activeCircleIndex, numberOfNotesInKey, flipX, noteRangeDegrees, activeNoteColour))) {
			return
		}

		const size = 54
		this.prepareDraw()
		this.drawEmoji(x, y + EMOJI_VISUAL_OFFSET_Y, emoji, size, rotationZ, rotationX, rotationY, flipX)

		if (numberOfNotesInKey > 0) {
			const data = this.getNoteCircleData(x, y + EMOJI_VISUAL_OFFSET_Y - 4, noteRangeDegrees, size * 0.67, numberOfNotesInKey)
			let activeCircle
			if (activeCircleIndex > -1) {
				activeCircle = data[Math.min(activeCircleIndex, data.length - 1)]
				activeCircle.radius = 4
			}
			this.drawWithShadow(() => {
				drawCircles(this.canvasContext, data, 1.7, 0, '#fff')
				if (activeCircle) {
					drawCircle(this.canvasContext, activeCircle.x, activeCircle.y, 2.25, 0, activeNoteColour)
				}
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

	drawOctaveIndicator(x, y, octave, octaveLow, octaveHigh, height=54) {
		if (this.queueFrameCommand(() => this.drawOctaveIndicator(x, y, octave, octaveLow, octaveHigh, height))) {
			return
		}

		const lines = createOctaveLineData(x + 38, y + EMOJI_VISUAL_OFFSET_Y - 2, octave, octaveLow, octaveHigh, {height})
		if (!lines.length) return
		this.prepareDraw()
		this.drawWithShadow(() => drawOctaveLines(this.canvasContext, lines))

		const top = lines[0].y
		const bottom = lines[lines.length - 1].y
		const left = Math.min(...lines.map(line => line.x))
		const right = Math.max(...lines.map(line => line.x + line.length))
		this.markDirty({x:left - 4, y:top - 5, width:right - left + 8, height:bottom - top + 10})
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
			NOTE_PARTICLE_GRAPHICS_POPPING_BUBBLES,
			NOTE_PARTICLE_GRAPHICS_BEES,
			NOTE_PARTICLE_GRAPHICS_DINOSAURS,
			NOTE_PARTICLE_GRAPHICS_FACE,
			NOTE_PARTICLE_GRAPHICS_EMOJI,
			NOTE_PARTICLE_GRAPHICS_NUMBERS,
			NOTE_PARTICLE_GRAPHICS_NOTE_NAME
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
			case NOTE_PARTICLE_GRAPHICS_POPPING_BUBBLES:
				return 'popping-bubble'
			case NOTE_PARTICLE_GRAPHICS_BEES:
				return 'bee'
			case NOTE_PARTICLE_GRAPHICS_DINOSAURS:
				return 'dinosaur'
			case NOTE_PARTICLE_GRAPHICS_FACE:
				return 'face'
			case NOTE_PARTICLE_GRAPHICS_EMOJI:
				return 'emoji'
			case NOTE_PARTICLE_GRAPHICS_NUMBERS:
				return 'number'
			case NOTE_PARTICLE_GRAPHICS_NOTE_NAME:
				return 'note-name'
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
			case 'emoji':
				return particleOptions.noteParticleFaceGlyph ?? particleOptions.noteParticleDefaultFaceGlyph
			case 'number':
				return String(clamp(Math.ceil(amplitudeRatio * 9), 1, 9))
			case 'note-name':
				return particleOptions.noteParticleNoteName ?? ''
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

	drawNoteParticleFrame(now = performance.now(), context = null) {
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

			// Effects belong to the face canvas and its feedback history. The text
			// overlay must never clear their bounds or become a fallback target.
			if (context) this.drawNoteParticle(particle, size, alpha, progress, context)
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

	drawNoteParticle(particle, size, alpha, progress = 0, context = null) {
		if (size <= 0 || !context) {
			return
		}

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
		} else if (particle.type === 'popping-bubble') {
			const popProgress = clamp((progress - 0.72) / 0.28, 0, 1)
			context.strokeStyle = particle.colour ?? particleOptions.noteParticleDefaultColour
			context.lineWidth = Math.max(1, size * 0.1 * (1 - popProgress * 0.65))
			if (popProgress <= 0) {
				context.fillStyle = 'rgba(255, 255, 255, 0.18)'
				this.drawBubbleParticlePath(context, size * 0.48)
				context.fill()
				context.stroke()
			}else{
				this.drawPoppingBubbleParticle(context, size * 0.5, popProgress)
			}
		} else if (['bee', 'dinosaur', 'face', 'emoji', 'number', 'note-name'].includes(particle.type)) {
			this.drawTextParticleGlyph(context, particle.glyph, size, ['bee', 'dinosaur', 'face', 'emoji'].includes(particle.type), particle.type === 'note-name')
		} else {
			this.drawTextParticleGlyph(context, particle.glyph, size, false)
		}

		context.restore()
	}

	drawTextParticleGlyph(context, glyph, size, emoji = false, noteName = false) {
		context.font = emoji ?
			`900 ${size}px ${EMOJI_FONT}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif` :
			noteName ?
				`900 ${size}px "Oxanium", sans-serif` :
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

	drawPoppingBubbleParticle(context, radius, progress) {
		const ringRadius = radius * (1 + progress * 0.6)
		context.save()
		context.globalAlpha *= 1 - progress
		context.beginPath()
		context.arc(0, 0, ringRadius, 0, TAU)
		context.stroke()
		for (let i = 0; i < 8; i++) {
			const angle = i * TAU / 8
			const inner = radius * (0.65 + progress * 0.35)
			const outer = radius * (0.95 + progress * 0.9)
			context.beginPath()
			context.moveTo(cosine(angle) * inner, sine(angle) * inner)
			context.lineTo(cosine(angle) * outer, sine(angle) * outer)
			context.stroke()
		}
		context.restore()
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
		return createNoteCircleData(cx, cy, range, radius, numberOfPoints)
	}
}
