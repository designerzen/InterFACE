import { createNoteCircleData } from "./note-circle.js"

const EMOJI_FONT_FACE = "noto-emoji"
const EMOJI_FONT = `"${EMOJI_FONT_FACE}"`
const CANVAS_SIZE = 192
const CANVAS_HALF = CANVAS_SIZE * 0.5
const SAMPLE_STEP = 3
const ALPHA_THRESHOLD = 24
const CRISP_CANVAS_SIZE = 768

export const DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES = {
	lookingGlassEmoticons: true,
	lookingGlassEmoticonStyle: 'crisp',
	lookingGlassEmoticonSize: 0.014,
	lookingGlassEmoticonScale: 0.00425,
	lookingGlassEmoticonYOffset: 0.26,
	lookingGlassEmoticonScreenYOffset: 0.025,
	lookingGlassEmoticonZOffset: 0.08,
	lookingGlassEmoticonMaxParticles: 1500
}

const drawEmoticonCanvas = (emoji, activeCircleIndex = -1, numberOfNotesInKey = 12, noteRangeDegrees = 90, activeNoteColour = '#fff', resolution = CANVAS_SIZE) => {
	const canvas = document.createElement("canvas")
	canvas.width = resolution
	canvas.height = resolution
	const context = canvas.getContext("2d", { willReadFrequently: resolution === CANVAS_SIZE })
	if (!context)
	{
		return null
	}

	document.fonts?.load(`900 72px ${EMOJI_FONT}`).catch(error => {
		console.warn("Could not load Looking Glass emoji particle font", error)
	})

	context.clearRect(0, 0, resolution, resolution)
	context.scale(resolution / CANVAS_SIZE, resolution / CANVAS_SIZE)
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
		const notes = createNoteCircleData(CANVAS_HALF, CANVAS_HALF - 1, noteRangeDegrees, 56, numberOfNotesInKey)
		notes.forEach(note => { note.radius = 2.4 })
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

		if (activeCircleIndex > -1 && notes.length)
		{
			const activeNote = notes[Math.min(activeCircleIndex, notes.length - 1)]
			context.save()
			context.fillStyle = activeNoteColour
			context.beginPath()
			context.arc(activeNote.x, activeNote.y, 2.7, 0, Math.PI * 2)
			context.fill()
			context.restore()
		}
	}

	return canvas
}

const createEmoticonGeometry = (THREE, emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour, options) => {
	const canvas = drawEmoticonCanvas(emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour)
	if (!canvas)
	{
		return null
	}
	const pixels = canvas.getContext('2d').getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data

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

const createCrispEmoticon = (THREE, emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour, options) => {
	const canvas = drawEmoticonCanvas(emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour, CRISP_CANVAS_SIZE)
	if (!canvas) return null
	const texture = new THREE.CanvasTexture(canvas)
	texture.colorSpace = THREE.SRGBColorSpace
	texture.magFilter = THREE.LinearFilter
	texture.minFilter = THREE.LinearMipmapLinearFilter
	const size = CANVAS_SIZE * (options.lookingGlassEmoticonScale ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonScale)
	return new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		opacity: 1,
		alphaTest: 0.01,
		depthTest: false,
		depthWrite: false,
		toneMapped: false,
		// The 2D mirroring transform can reverse the plane's winding.
		side: THREE.DoubleSide
	}))
}

const disposeEmoticonVisual = visual => {
	visual?.material?.map?.dispose?.()
	visual?.geometry?.dispose?.()
	visual?.material?.dispose?.()
}

const getParticleBounds = (particles, yUp = false) => {
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
		topY: yUp ? maxY : minY,
		centerZ: (minZ + maxZ) * 0.5
	}
}

export const clampEmoticonToCameraTop = (group, camera, THREE) => {
	if (!camera) return
	camera.updateWorldMatrix(true, false)
	group.updateWorldMatrix(true, true)
	const bounds = new THREE.Box3().setFromObject(group)
	if (bounds.isEmpty()) return
	// Include the radius of particle sprites, whose geometry only stores centres.
	group.traverse(visual => {
		if (visual.isPoints) bounds.expandByScalar((visual.material.size ?? 0) * 0.5)
	})
	const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize()
	let drop = 0
	for (const x of [bounds.min.x, bounds.max.x]) {
		for (const y of [bounds.min.y, bounds.max.y]) {
			for (const z of [bounds.min.z, bounds.max.z]) {
				const corner = new THREE.Vector3(x, y, z)
				const projected = corner.clone().project(camera)
				if (projected.y <= 0.98) continue
				// Clamp in camera space so rotated heads and parent transforms cannot
				// carry either the emoji or its head-angle arc above the viewport.
				projected.y = 0.98
				const target = projected.unproject(camera)
				drop = Math.max(drop, corner.sub(target).dot(up))
			}
		}
	}
	if (drop > 0) {
		const position = group.getWorldPosition(new THREE.Vector3()).addScaledVector(up, -drop)
		group.position.copy(group.parent ? group.parent.worldToLocal(position) : position)
		group.updateWorldMatrix(false, true)
	}
}

export const updateLookingGlassEmoticonParticles = (host, THREE, {
	emoji,
	rotationZ = 0,
	rotationY = 0,
	rotationX = 0,
	activeCircleIndex = -1,
	numberOfNotesInKey = 12,
	flipX = false,
	noteRangeDegrees = 90,
	activeNoteColour = '#fff'
} = {}) => {
	if (!host?.particles || !host?.scene || !emoji || host.options?.lookingGlassEmoticons === false)
	{
		if (host?.lookingGlassEmoticonState) host.lookingGlassEmoticonState.group.visible = false
		return
	}

	if (!host.lookingGlassEmoticonState)
	{
		const group = new THREE.Group()
		group.name = "looking-glass-emoticon-particles"
		// GPU face particles replace/remove the CPU Points object. Keep world-space
		// emoticons in the scene so they remain visible on either rendering backend.
		const parent = host.nativeMirrorDisplay ? host.scene : host.particles
		parent.add(group)
		host.lookingGlassEmoticonState = {
			group,
			points: null,
			key: ""
		}
	}

	const state = host.lookingGlassEmoticonState
	const style = host.options?.lookingGlassEmoticonStyle ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonStyle
	const fontReady = document.fonts?.check?.(`900 72px ${EMOJI_FONT}`) ?? true
	const key = `${style}:${fontReady}:${emoji}:${activeCircleIndex}:${numberOfNotesInKey}:${noteRangeDegrees}:${activeNoteColour}`
	if (state.key !== key)
	{
		disposeEmoticonVisual(state.points)
		if (state.points)
		{
			state.group.remove(state.points)
		}
		state.points = null

		if (style === 'particles') {
			const geometry = createEmoticonGeometry(THREE, emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour, host.options ?? {})
			if (!geometry) return
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
		} else {
			state.points = createCrispEmoticon(THREE, emoji, activeCircleIndex, numberOfNotesInKey, noteRangeDegrees, activeNoteColour, host.options ?? {})
			if (!state.points) return
		}
		state.points.renderOrder = 30
		state.group.add(state.points)
		state.key = key
	}

	const math = host.nativeMirrorDisplay ? host.mirrorMath : null
	const bounds = math && Number.isFinite(math.minimum.y) && Number.isFinite(math.maximum.y)
		? {
			centerX: host.options?.mirrorCenterX ?? 0,
			topY: (math.maximum.y - math.minimum.y) * (host.options?.mirrorFaceScale ?? 3.14) * 0.5 + (host.options?.mirrorCenterY ?? 0),
			centerZ: host.options?.mirrorCenterZ ?? 0
		}
		: getParticleBounds(host.particles, host.nativeMirrorDisplay)
	if (bounds)
	{
		const z = bounds.centerZ + (host.options?.lookingGlassEmoticonZOffset ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonZOffset)
		// Convert a screen-height fraction to world units at the emoji's depth.
		const viewHeight = host.camera?.isPerspectiveCamera
			? 2 * Math.tan(host.camera.fov * Math.PI / 360) * Math.abs(host.camera.position.z - z) / (host.camera.zoom || 1)
			: host.mirrorCalibration?.targetDiam ?? 2
		const drop = host.nativeMirrorDisplay
			? viewHeight * (host.options?.lookingGlassEmoticonScreenYOffset ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonScreenYOffset)
			: 0
		state.group.position.set(
			bounds.centerX,
			bounds.topY + (host.nativeMirrorDisplay ? 1 : -1) * (host.options?.lookingGlassEmoticonYOffset ?? DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES.lookingGlassEmoticonYOffset) - drop,
			z
		)
	}

	if (host.nativeMirrorDisplay) {
		// Canvas transform(0, rotationY, rotationX, 0) followed by rotate(rotationZ),
		// converted from canvas Y-down to scene Y-up. X/Y are scale/skew inputs,
		// not Euler angles; reproducing the affine transform avoids different poses.
		const sin = Math.sin(rotationZ), cos = Math.cos(rotationZ), flip = flipX ? -1 : 1
		state.points.matrixAutoUpdate = false
		state.points.matrix.set(
			rotationX * sin * flip, -rotationX * cos, 0, 0,
			-rotationY * cos * flip, -rotationY * sin, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		)
		state.points.matrixWorldNeedsUpdate = true
	} else {
		state.group.rotation.set(Math.PI + rotationX * 0.18, rotationY * 0.18, rotationZ + Math.PI * 0.5)
		state.group.scale.x = flipX ? -1 : 1
	}
	clampEmoticonToCameraTop(state.group, host.camera, THREE)
	state.group.visible = true
}

export const disposeLookingGlassEmoticonParticles = host => {
	const state = host?.lookingGlassEmoticonState
	if (!state)
	{
		return
	}

	disposeEmoticonVisual(state.points)
	if (state.points)
	{
		state.group?.remove?.(state.points)
	}
	host.particles?.remove?.(state.group)
	host.scene?.remove?.(state.group)
	host.lookingGlassEmoticonState = null
}
