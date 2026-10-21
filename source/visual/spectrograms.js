import { normaliseVisualiser } from './visualiser-modes.js'
import { drawExtraVisualiser, drawNoteHistory } from './visualiser-drawings.js'
export { normaliseVisualiser } from './visualiser-modes.js'

let colourCycle = 0
export const drawBars = (canvasContext, dataArray, bufferLength)=>{

	// just  do the first 60%
	const section = bufferLength * 0.6
	const barWidth = (canvasContext.canvas.width / section)	// number here is just cos we only care about a really narrow band
	const height = canvasContext.canvas.height
	let barHeight
	let x = 0

	colourCycle = ( colourCycle + 1 ) % 360

	for(let i = 0; i < section; i++) 
	{
		barHeight = dataArray[i]

		canvasContext.fillStyle = 'hsla(' + ( colourCycle + (barHeight/ height *360 ))%360 + ',50%,50%,0.3)'
		// canvasContext.fillRect(x, 0, barWidth, barHeight )
		canvasContext.fillRect(x, height - barHeight, barWidth, barHeight )
		x += barWidth + 1
	}

	// console.log("draw bars", dataArray, bufferLength)
}

// Cache geometry and palette per canvas; no arrays or gradients allocated per frame.
const caches = new WeakMap()
const getGeometry = (context, length) => {
	const { width, height } = context.canvas
	let cache = caches.get(context)
	if (cache?.width === width && cache.height === height && cache.length === length) return cache
	const count = Math.min(64, length, Math.max(1, Math.floor(width / 8)))
	const edges = new Uint16Array(count + 1)
	const sine = new Float32Array(count)
	const cosine = new Float32Array(count)
	const colours = []
	for (let i = 0; i <= count; i++) {
		edges[i] = Math.min(length, Math.floor(Math.pow(length + 1, i / count) - 1))
		if (i < count) {
			const angle = i / count * Math.PI * 2 - Math.PI / 2
			sine[i] = Math.sin(angle)
			cosine[i] = Math.cos(angle)
			colours.push(`hsla(${180 + i / count * 140},85%,65%,0.65)`)
		}
	}
	cache = { width, height, length, count, edges, sine, cosine, colours,
		levels:new Float32Array(count), peaks:new Float32Array(count), peakUntil:new Float64Array(count), lastPeakTime:null, type:null }
	caches.set(context, cache)
	return cache
}

export const drawWaves = (context, samples, length = samples?.length, centre = 0.72, amplitude = 0.2) => {
	if (!samples?.length || length < 2) return
	const { width, height } = context.canvas
	const count = Math.min(length, samples.length, 512)
	context.lineWidth = 2
	context.strokeStyle = "rgba(175,255,240,0.9)"
	context.beginPath()
	for (let i = 0; i < count; i++) {
		const sample = samples[Math.floor(i * (Math.min(length, samples.length) - 1) / (count - 1))]
		const x = i / (count - 1) * width
		const y = height * (centre - (sample - 128) / 128 * amplitude)
		if (i === 0) context.moveTo(x, y)
		else context.lineTo(x, y)
	}
	context.stroke()
}

export const drawVisualiser = (context, frequency, length, type = "vu", time = null, notes = null) => {
	if (!context?.canvas) return
	const { width, height } = context.canvas
	if (width <= 0 || height <= 0) return
	type = normaliseVisualiser(type)
	context.save()
	try {
		if (type === "vu") {
			if (frequency?.length && length > 0) drawBars(context, frequency, Math.min(length, frequency.length))
			return
		}
		if (type === "wave") {
			drawWaves(context, time)
			return
		}
		if (type === 'notes-horizontal' || type === 'notes-vertical') {
			drawNoteHistory(context, notes, type === 'notes-vertical')
			return
		}
		const bins = Math.min(length || 0, frequency?.length ?? 0)
		const geometry = getGeometry(context, Math.max(1, bins))
		if (geometry.type !== type) {
			geometry.peaks.fill(0)
			geometry.peakUntil.fill(0)
			geometry.lastPeakTime = null
			geometry.type = type
		}
		for (let i = 0; i < geometry.count; i++) {
			let peak = 0
			const end = Math.min(bins, Math.max(geometry.edges[i] + 1, geometry.edges[i + 1]))
			for (let bin = geometry.edges[i]; bin < end; bin++) peak = Math.max(peak, frequency[bin])
			geometry.levels[i] = peak / 255
		}
		if (drawExtraVisualiser(context, type, geometry, time, notes, notes?.now ?? performance.now())) return
		if (!bins) return
		const { count, sine, cosine, colours } = geometry
		const step = width / count
		const radius = Math.min(width, height) * 0.16
		context.lineWidth = Math.max(2, Math.min(6, radius / count))
		for (let i = 0; i < count; i++) {
			const level = geometry.levels[i]
			context.fillStyle = colours[i]
			if (type === "radial") {
				const outer = radius + level * Math.min(width, height) * 0.24
				context.strokeStyle = colours[i]
				context.beginPath()
				context.moveTo(width / 2 + cosine[i] * radius, height / 2 + sine[i] * radius)
				context.lineTo(width / 2 + cosine[i] * outer, height / 2 + sine[i] * outer)
				context.stroke()
			} else if (type === "mirror") {
				const bar = level * height * 0.22
				context.fillRect(i * step, height * 0.7 - bar, Math.max(1, step - 2), bar * 2)
			} else {
				const bar = level * height * 0.38
				context.fillRect(i * step, height - bar, Math.max(1, step - 2), bar)
			}
		}
		if (type === "hybrid") drawWaves(context, time, time?.length, 0.78, 0.16)
	} finally {
		context.restore()
	}
}
