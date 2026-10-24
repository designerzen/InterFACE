const DEFAULT_INACTIVE_LENGTH = 10
const DEFAULT_ACTIVE_LENGTH = 22
const DEFAULT_HEIGHT = 54
const DEFAULT_ARC_DEPTH = 8

export const createOctaveLineData = (
	x,
	y,
	octave,
	octaveLow,
	octaveHigh,
	options={}
) => {
	const low = Math.min(Number(octaveLow), Number(octaveHigh))
	const high = Math.max(Number(octaveLow), Number(octaveHigh))
	if (!Number.isFinite(low) || !Number.isFinite(high)) return []

	const activeOctave = Math.min(high, Math.max(low, Number(octave)))
	const inactiveLength = options.inactiveLength ?? DEFAULT_INACTIVE_LENGTH
	const activeLength = options.activeLength ?? DEFAULT_ACTIVE_LENGTH
	const height = Math.max(0, (options.height ?? DEFAULT_HEIGHT) - 4)
	const arcDepth = options.arcDepth ?? DEFAULT_ARC_DEPTH
	const count = Math.floor(high - low) + 1
	const gap = count > 1 ? height / (count - 1) : 0
	const top = y - ((count - 1) * gap) * 0.5

	return Array.from({length:count}, (_, index) => {
		const value = high - index
		const active = value === activeOctave
		const arcProgress = count > 1 ? index / (count - 1) : 0.5
		return {
			value,
			active,
			x:x + Math.sin(arcProgress * Math.PI) * arcDepth,
			y:top + index * gap,
			length:active ? activeLength : inactiveLength
		}
	})
}

export const drawOctaveLines = (context, lines) => {
	context.save()
	context.lineCap = 'round'
	for (const line of lines) {
		context.beginPath()
		context.moveTo(line.x, line.y)
		context.lineTo(line.x + line.length, line.y)
		context.strokeStyle = '#fff'
		context.globalAlpha = line.active ? 1 : 0.72
		context.lineWidth = line.active ? 3 : 2
		context.stroke()
	}
	context.restore()
}
