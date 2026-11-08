import { createDisplay, getAvailableDisplays } from '../source/display/display-manager.js'
import { DISPLAY_LABELS } from '../source/display/display-types.js'
import sample from '../source/models/face-model-data.json'

const results = document.getElementById('results')
const previews = document.getElementById('previews')
const report = []
const makePerson = (x, hue) => {
	const points = sample['0'].keypoints
	const xs = points.map(p => p.x), ys = points.map(p => p.y)
	const minX = Math.min(...xs), minY = Math.min(...ys)
	const dx = Math.max(...xs) - minX, dy = Math.max(...ys) - minY
	return {
		data: { ...sample['0'], faceLandmarks: points.map(p => ({ x: x + (p.x - minX) / dx * .3, y: .15 + (p.y - minY) / dy * .65, z: p.z })) },
		options: { drawMask: true, drawNodes: true, drawMesh: false, drawEyes: false, drawEyebrows: false },
		hue, hsla: `hsla(${hue},100%,60%,1)`, hsl: `hsl(${hue},100%,60%)`, moveButton(){}
	}
}
const first = makePerson(.05, 0), second = makePerson(.6, 180)
const counts = image => {
	let left = 0, right = 0
	for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
		if (image.data[(y * image.width + x) * 4 + 3]) x < image.width / 2 ? left++ : right++
	}
	return { left, right }
}

const run = async () => {
const available = getAvailableDisplays()
const cases = available.map(type => ({ type, layout: 'layers' }))
const tiledTypes = ['DisplayMediaVision2D', 'DisplayWebGL3D', 'DisplayBabylon3D', 'DisplayThreeWebGPUParticle'].map(type => available.includes(type) ? type : 'DisplayMediaVision2D')
cases.push({ type: 'DisplayComposite', layout: 'grid', displays: tiledTypes })
for (const { type, layout, displays } of cases) {
	const section = document.createElement('section')
	const title = document.createElement('h2')
	title.textContent = DISPLAY_LABELS[type] + (layout === 'grid' ? ' — 2×2 grid' : '')
	section.append(title)
	previews.append(section)
	const canvas = document.createElement('canvas')
	canvas.width = 640
	canvas.height = 480
	section.append(canvas)
	let display
	try {
		display = await createDisplay(canvas, type, { layout, displays, resize: false, particleSize: 3, geometrySubdivisions: 0 })
		display.device?.pushErrorScope('validation')
		for (let frame = 0; frame < 3; frame++) {
			await new Promise(resolve => setTimeout(resolve, 50))
			display.clear()
			display.drawPerson(first, false, { h: 0, s: 100, l: 60, a: 1 })
			display.drawPerson(second, false, { h: 180, s: 100, l: 60, a: 1 })
			await display.render()
			for (const renderer of display.displays ?? [display]) await renderer.scene?.whenReadyAsync?.()
		}
		const capture = document.createElement('canvas')
		capture.width = 640
		capture.height = 480
		const ctx = capture.getContext('2d')
		ctx.drawImage(canvas, 0, 0)
		const pixels = counts(ctx.getImageData(0, 0, 640, 480))
		if (type !== 'DisplayCanvas2D' && (!pixels.left || !pixels.right)) throw new Error(`Missing player pixels: ${JSON.stringify(pixels)}`)
		if (layout === 'grid') {
			for (const [x, y] of [[0, 0], [320, 0], [0, 240], [320, 240]]) {
				const tile = counts(ctx.getImageData(x, y, 320, 240))
				if (!tile.left || !tile.right) throw new Error(`Missing player in tile ${x},${y}`)
			}
		}
		const gpuError = await display.device?.popErrorScope()
		if (gpuError) throw new Error(gpuError.message)
		display.setSize(320, 240)
		display.clear()
		display.drawPerson(second, false, { h: 180, s: 100, l: 60, a: 1 })
		await display.render()
		await display.destroy()
		display = null
		canvas.replaceWith(capture)
		report.push({ type, layout, status: 'passed', pixels })
	} catch (error) {
		report.push({ type, layout, status: 'failed', error: error.stack })
		await display?.destroy().catch(() => {})
	}
	results.textContent = JSON.stringify(report, null, 2)
}

if (available.includes('DisplayWebGPU3D')) {
	for (const composite of [false, true]) {
		const canvas = document.createElement('canvas')
		canvas.width = 128
		canvas.height = 96
		previews.append(canvas)
		let display
		const name = composite ? 'WebGPU disco in four Composite tiles' : 'WebGPU disco paint'
		try {
			display = await createDisplay(canvas, composite ? 'DisplayComposite' : 'DisplayWebGPU3D', {
				resize: false, dotSize: 8, layout: 'grid', displays: Array(4).fill('DisplayWebGPU3D')
			})
			const renderers = composite ? display.displays : [display]
			for (const renderer of renderers) {
				renderer.device.pushErrorScope('validation')
				renderer.drawLandmarks(new Float32Array([16, 16]), '#ff0000ff')
			}
			// Note particles are drawn after the face, just before presentation.
			for (const renderer of renderers) {
				const effects = renderer.getParticleContext()
				effects.fillStyle = '#00ff00'
				effects.fillRect(40, 8, 4, 4)
			}
			display.render()
			display.postProcess({ offsetX: 12, offsetY: 0 })
			display.render()
			const read = document.createElement('canvas')
			read.width = 128
			read.height = 96
			const ctx = read.getContext('2d')
			ctx.drawImage(canvas, 0, 0)
			for (const { x, y } of composite ? display.viewports : [{ x: 0, y: 0 }]) {
				for (const [px, py] of [[16, 16], [28, 16], [41, 9], [53, 9]]) {
					if (ctx.getImageData(x + px, y + py, 1, 1).data[3] < 100) throw new Error(`Missing paint at ${x + px},${y + py}`)
				}
			}
			// Returning to normal mode wipes paint history, even with no new face.
			display.clearFaceFeatures()
			display.clear()
			display.render()
			ctx.clearRect(0, 0, 128, 96)
			ctx.drawImage(canvas, 0, 0)
			if (ctx.getImageData(0, 0, 128, 96).data.some((value, index) => index % 4 === 3 && value)) throw new Error('Paint survived normal-mode clear')
			for (const renderer of renderers) {
				const error = await renderer.device.popErrorScope()
				if (error) throw new Error(error.message)
			}
			canvas.replaceWith(read)
			report.push({ type: name, status: 'passed' })
		} catch (error) {
			report.push({ type: name, status: 'failed', error: error.stack })
		} finally {
			await display?.destroy().catch(() => {})
		}
		results.textContent = JSON.stringify(report, null, 2)
	}
}
results.dataset.complete = 'true'
}
run().catch(error => { results.textContent = error.stack; results.dataset.complete = 'true' })
