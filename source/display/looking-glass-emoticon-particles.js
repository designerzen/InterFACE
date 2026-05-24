import { cosine, ONE_DEGREE_IN_RADIANS, sine } from "../maths/maths.js"

const EMOJI_FONT_FACE = "noto-emoji"
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const CANVAS_SIZE = 192
const CANVAS_HALF = CANVAS_SIZE * 0.5
const SAMPLE_STEP = 3
const ALPHA_THRESHOLD = 24

export const DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES = {
	lookingGlassEmoticons: true,
	lookingGlassEmoticonSize: 0.014,
	lookingGlassEmoticonScale: 0.00425,
	lookingGlassEmoticonYOffset: 0.26,
	lookingGlassEmoticonZOffset: 0.08,
	lookingGlassEmoticonMaxParticles: 1500
}

const getNoteCircleData = (cx, cy, range = 90, radius = 56, numberOfPoints = 12) => {
	const halfRange = range / 2
	const startAngleRadians = (90 - halfRange) * ONE_DEGREE_IN_RADIANS
	const endAngleRadians = (90 + halfRange) * ONE_DEGREE_IN_RADIANS
	const angleIncrement = (endAngleRadians - startAngleRadians) / Math.max(1, numberOfPoints - 1)
	const data = []

	for (let i = 0; i < numberOfPoints; i++)
	{
		const currentAngle = startAngleRadians + (i * angleIncrement)
		data.push({
			x: cx + radius * cosine(currentAngle),
			y: cy - radius * sine(currentAngle),
			radius: 2.4
		})
	}

	return data
}

const drawEmoticonCanvas = (emoji, activeCircleIndex = -1, numberOfNotesInKey = 12) => {
	const canvas = document.createElement("canvas")
	canvas.width = CANVAS_SIZE
	canvas.height = CANVAS_SIZE
	const context = canvas.getContext("2d", { willReadFrequently: true })
	if (!context)
	{
		return null
	}

	document.fonts?.load(`900 72px ${EMOJI_FONT}`).catch(error => {
		console.warn("Could not load Looking Glass emoji particle font", error)
	})

	context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
	context.save()
	context.shadowColor = "rgba(0, 0, 0, 0.9)"
	context.shadowBlur = 0
	context.shadowOffsetX = 3
	context.shadowOffsetY = 3
	context.font = `900 72px ${EMOJI_FONT}`
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.lineWidth = 7
	context.strokeStyle = "#0a0a0a"
	context.fillStyle = "#ffffff"
	context.strokeText(emoji, CANVAS_HALF, CANVAS_HALF + 4)
	context.fillText(emoji, CANVAS_HALF, CANVAS_HALF + 4)
	context.restore()

	if (numberOfNotesInKey > 0)
	{
		const notes = getNoteCircleData(CANVAS_HALF, CANVAS_HALF - 1, 90, 56, numberOfNotesInKey)
		if (activeCircleIndex > -1 && notes.length)
		{
			notes[Math.min(activeCircleIndex, notes.length - 1)].radius = 5
		}

		context.save()
		context.fillStyle = "#ffffff"
		context.shadowColor = "rgba(0, 0, 0, 0.9)"
		context.shadowOffsetX = 2
		context.shadowOffsetY = 2
		notes.forEach(note => {
			context.beginPath()
			context.arc(note.x, note.y, note.radius, 0, Math.PI * 2)
			context.fill()
		})
		context.restore()
	}

	return context.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data
}

const createEmoticonGeometry = (THREE, emoji, activeCircleIndex, numberOfNotesInKey, options) => {
	const pixels = drawEmoticonCanvas(emoji, activeCircleIndex, numberOfNotesInKey)
	if (!pixels)
	{
		return null
	}

	const positions = []
	const colours = []
	const scale = options.lookingGlassEmoticonScale ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonScale
	const maxParticles = options.lookingGlassEmoticonMaxParticles ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonMaxParticles

	for (let y = 0; y < CANVAS_SIZE; y += SAMPLE_STEP)
	{
		for (let x = 0; x < CANVAS_SIZE; x += SAMPLE_STEP)
		{
			const pixelIndex = (y * CANVAS_SIZE + x) * 4
			const alpha = pixels[pixelIndex + 3]
			if (alpha <= ALPHA_THRESHOLD)
			{
				continue
			}

			const jitterX = (Math.random() - 0.5) * SAMPLE_STEP * 0.42
			const jitterY = (Math.random() - 0.5) * SAMPLE_STEP * 0.42
			const depth = (alpha / 255) * 0.035 + (Math.random() - 0.5) * 0.018
			positions.push(
				(x + jitterX - CANVAS_HALF) * scale,
				-(y + jitterY - CANVAS_HALF) * scale,
				depth
			)
			colours.push(
				pixels[pixelIndex] / 255,
				pixels[pixelIndex + 1] / 255,
				pixels[pixelIndex + 2] / 255
			)
		}
	}

	while (positions.length / 3 > maxParticles)
	{
		const particleIndex = Math.floor(Math.random() * (positions.length / 3))
		positions.splice(particleIndex * 3, 3)
		colours.splice(particleIndex * 3, 3)
	}

	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colours, 3))
	return geometry
}

const getParticleBounds = particles => {
	const positions = particles?.geometry?.attributes?.position?.array
	if (!positions?.length)
	{
		return null
	}

	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity

	for (let index = 0; index < positions.length; index += 3)
	{
		const x = positions[index]
		const y = positions[index + 1]
		const z = positions[index + 2]
		if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z))
		{
			continue
		}
		minX = Math.min(minX, x)
		minY = Math.min(minY, y)
		minZ = Math.min(minZ, z)
		maxX = Math.max(maxX, x)
		maxY = Math.max(maxY, y)
		maxZ = Math.max(maxZ, z)
	}

	if (!Number.isFinite(minX))
	{
		return null
	}

	return {
		centerX: (minX + maxX) * 0.5,
		topY: minY,
		centerZ: (minZ + maxZ) * 0.5
	}
}

export const updateLookingGlassEmoticonParticles = (host, THREE, {
	emoji,
	rotationZ = 0,
	rotationY = 0,
	rotationX = 0,
	activeCircleIndex = -1,
	numberOfNotesInKey = 12,
	flipX = false
} = {}) => {
	if (!host?.particles || !host?.scene || !emoji || host.options?.lookingGlassEmoticons === false)
	{
		return
	}

	if (!host.lookingGlassEmoticonState)
	{
		const group = new THREE.Group()
		group.name = "looking-glass-emoticon-particles"
		host.particles.add(group)
		host.lookingGlassEmoticonState = {
			group,
			points: null,
			key: ""
		}
	}

	const state = host.lookingGlassEmoticonState
	const key = `${emoji}:${activeCircleIndex}:${numberOfNotesInKey}`
	if (state.key !== key)
	{
		state.points?.geometry?.dispose?.()
		state.points?.material?.dispose?.()
		if (state.points)
		{
			state.group.remove(state.points)
		}

		const geometry = createEmoticonGeometry(THREE, emoji, activeCircleIndex, numberOfNotesInKey, host.options ?? {})
		if (!geometry)
		{
			return
		}

		const material = new THREE.PointsMaterial({
			size: host.options?.lookingGlassEmoticonSize ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonSize,
			sizeAttenuation: true,
			transparent: true,
			opacity: 0.96,
			depthTest: false,
			depthWrite: false,
			vertexColors: true
		})
		state.points = new THREE.Points(geometry, material)
		state.group.add(state.points)
		state.key = key
	}

	const bounds = getParticleBounds(host.particles)
	if (bounds)
	{
		state.group.position.set(
			bounds.centerX,
			bounds.topY - (host.options?.lookingGlassEmoticonYOffset ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonYOffset),
			bounds.centerZ + (host.options?.lookingGlassEmoticonZOffset ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonZOffset)
		)
	}

	state.group.rotation.set(Math.PI + rotationX * 0.18, rotationY * 0.18, rotationZ + Math.PI * 0.5)
	state.group.scale.x = flipX ? -1 : 1
	state.group.visible = true
}

export const disposeLookingGlassEmoticonParticles = host => {
	const state = host?.lookingGlassEmoticonState
	if (!state)
	{
		return
	}

	state.points?.geometry?.dispose?.()
	state.points?.material?.dispose?.()
	if (state.points)
	{
		state.group?.remove?.(state.points)
	}
	host.particles?.remove?.(state.group)
	host.scene?.remove?.(state.group)
	host.lookingGlassEmoticonState = null
}
