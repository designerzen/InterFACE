import {
	LedMatrix,
	PlasmaButtons,
	RGBl,
	PICADE_MAX_BUTTONS,
	PICADE_MAX_BUTTON_LED_GROUP_SIZE,
	PICADE_MAX_BUTTON_FRAME_LEDS,
} from './picade-max-input.js'

export const PICADE_MAX_NUM_LEDS = PICADE_MAX_BUTTONS * PICADE_MAX_BUTTON_LED_GROUP_SIZE
export const PICADE_MAX_REFRESH_RATE = 20
export const PICADE_6_BUTTON_LABELS = Object.freeze([
	'P1:Y',
	'P1:X',
	'P1:L1',
	'P1:B',
	'P1:A',
	'P1:R1',
])

const PICADE_MAX_BUTTON_MAP_FULL = Object.freeze({
	'P1:START': 14,
	'P1:A': 13,
	'P1:B': 11,
	'P1:X': 9,
	'P1:Y': 7,
	'P1:L1': 12,
	'P1:L2': 15,
	'P1:R1': 8,
	'P1:R2': 18,
	'P1:SELECT': 10,
	'P1:L3': 16,
	'P1:R3': 17,
	'P1:HOTKEY': 24,
	'P1:X1': 29,
	'P1:X2': 26,
	'P2:START': 19,
	'P2:A': 6,
	'P2:B': 4,
	'P2:X': 2,
	'P2:Y': 0,
	'P2:L1': 5,
	'P2:L2': 20,
	'P2:R1': 1,
	'P2:R2': 23,
	'P2:SELECT': 3,
	'P2:L3': 21,
	'P2:R3': 22,
	'P2:HOTKEY': 25,
	'P2:X1': 28,
	'P2:X2': 27,
})

const PICADE_MAX_COORD_MAP_FULL = Object.freeze({
	'68,14': 0, '65,12': 1, '63,15': 2, '66,17': 3, '67,7': 4, '64,5': 5, '62,8': 6, '65,10': 7,
	'62,16': 8, '59,14': 9, '57,17': 10, '60,19': 11, '61,9': 12, '58,7': 13, '56,10': 14, '59,12': 15,
	'56,18': 16, '53,16': 17, '51,19': 18, '54,21': 19, '55,11': 20, '52,9': 21, '50,12': 22, '53,14': 23,
	'55,25': 24, '52,23': 25, '50,26': 26, '53,28': 27, '31,19': 28, '29,16': 29, '26,18': 30, '28,21': 31,
	'33,13': 32, '31,10': 33, '28,12': 34, '30,15': 35, '25,19': 36, '23,16': 37, '20,18': 38, '22,21': 39,
	'27,13': 40, '25,10': 41, '22,12': 42, '24,15': 43, '19,19': 44, '17,16': 45, '14,18': 46, '16,21': 47,
	'21,13': 48, '19,10': 49, '16,12': 50, '18,15': 51, '16,25': 52, '14,22': 53, '11,24': 54, '13,27': 55,
	'4,3': 56, '2,1': 57, '0,3': 58, '2,5': 59, '13,3': 60, '11,1': 61, '9,3': 62, '11,5': 63,
	'19,3': 64, '17,1': 65, '15,3': 66, '17,5': 67, '25,3': 68, '23,1': 69, '21,3': 70, '23,5': 71,
	'31,3': 72, '29,1': 73, '27,3': 74, '29,5': 75, '43,3': 76, '41,1': 77, '39,3': 78, '41,5': 79,
	'52,3': 80, '50,1': 81, '48,3': 82, '50,5': 83, '58,3': 84, '56,1': 85, '54,3': 86, '56,5': 87,
	'64,3': 88, '62,1': 89, '60,3': 90, '62,5': 91, '70,3': 92, '68,1': 93, '66,3': 94, '68,5': 95,
})

function buildPicadeLayout(labels = PICADE_6_BUTTON_LABELS) {
	const buttonMap = {}
	const coordMap = {}
	const seenButtons = new Map(labels.map((label, index) => [PICADE_MAX_BUTTON_MAP_FULL[label], index]))

	for (const [index, label] of labels.entries()) {
		buttonMap[label] = index
	}

	for (const [coord, ledNumber] of Object.entries(PICADE_MAX_COORD_MAP_FULL)) {
		const originalButtonNumber = Math.floor(ledNumber / PICADE_MAX_BUTTON_LED_GROUP_SIZE)
		const mappedButtonNumber = seenButtons.get(originalButtonNumber)
		if (mappedButtonNumber == null) continue
		const ledOffset = ledNumber % PICADE_MAX_BUTTON_LED_GROUP_SIZE
		coordMap[coord] = mappedButtonNumber * PICADE_MAX_BUTTON_LED_GROUP_SIZE + ledOffset
	}

	return {
		buttonMap: Object.freeze(buttonMap),
		coordMap: Object.freeze(coordMap),
	}
}

const limitedLayout = buildPicadeLayout()
export const PICADE_MAX_BUTTON_MAP = limitedLayout.buttonMap
export const PICADE_MAX_COORD_MAP = limitedLayout.coordMap
export const PICADE_MAX_PACKET_LED_COUNT = PICADE_MAX_BUTTON_FRAME_LEDS

const BUTTON_COLORS = [
	RGBl(0, 63, 0, 15),
	RGBl(0, 0, 63, 15),
	RGBl(63, 0, 0, 15),
	RGBl(63, 63, 0, 15),
	RGBl(0, 63, 63, 15),
	RGBl(63, 0, 63, 15),
	RGBl(63, 63, 63, 15),
]

export const BUTTON_PATTERN_NAMES = Object.freeze([
	'rainbow_fade',
	'sparkle_fade',
	'panel_wave',
	'center_out',
	'edge_in',
	'column_scan',
	'row_scan',
	'alternating_pairs',
	'label_cycle',
])

function wait(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException('Aborted', 'AbortError'))
			return
		}
		const id = setTimeout(resolve, ms)
		signal?.addEventListener('abort', () => {
			clearTimeout(id)
			reject(new DOMException('Aborted', 'AbortError'))
		}, { once: true })
	})
}

function throwIfAborted(signal) {
	if (signal?.aborted) {
		throw new DOMException('Aborted', 'AbortError')
	}
}

function getCoordBounds(coordMap) {
	const coords = Object.keys(coordMap).map(key => key.split(',').map(Number))
	const xs = coords.map(([x]) => x)
	const ys = coords.map(([, y]) => y)
	return {
		minX: Math.min(...xs),
		maxX: Math.max(...xs) + 1,
		minY: Math.min(...ys),
		maxY: Math.max(...ys) + 1,
	}
}

function hsvToRGBl(hue, brightness = 15) {
	const h = ((hue % 360) + 360) % 360
	const c = 63
	const x = Math.round(c * (1 - Math.abs((h / 60) % 2 - 1)))
	let rgb = [0, 0, 0]

	if (h < 60) rgb = [c, x, 0]
	else if (h < 120) rgb = [x, c, 0]
	else if (h < 180) rgb = [0, c, x]
	else if (h < 240) rgb = [0, x, c]
	else if (h < 300) rgb = [x, 0, c]
	else rgb = [c, 0, x]

	return RGBl(rgb[0], rgb[1], rgb[2], brightness)
}

function sleepTicks(refreshRate, ticks, signal) {
	return wait((1000 / refreshRate) * ticks, signal)
}

function getActiveButtonNumbers(buttons) {
	const buttonNumbers = new Set(Object.values(buttons.buttonMap))
	return [...buttonNumbers].sort((a, b) => a - b)
}

function getLedCoordinates(coordMap) {
	return Object.entries(coordMap).map(([key, ledNumber]) => {
		const [x, y] = key.split(',').map(Number)
		return { key, x, y, ledNumber }
	})
}

function createCanvas(width, height) {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

function fillCanvas(ctx, color, width, height) {
	ctx.fillStyle = color
	ctx.fillRect(0, 0, width, height)
}

function drawArcadeFrame(ctx, width, height, tick = 0) {
	fillCanvas(ctx, '#02050c', width, height)
	const grad = ctx.createLinearGradient(0, 0, width, height)
	grad.addColorStop(0, '#0f2744')
	grad.addColorStop(1, '#31051f')
	ctx.fillStyle = grad
	ctx.fillRect(0, 0, width, height)

	ctx.strokeStyle = 'rgba(255,255,255,0.18)'
	for (let x = 0; x < width; x += 4) {
		ctx.beginPath()
		ctx.moveTo(x + 0.5, 0)
		ctx.lineTo(x + 0.5, height)
		ctx.stroke()
	}

	ctx.fillStyle = '#f7b500'
	ctx.font = `bold ${Math.max(8, Math.floor(height * 0.72))}px monospace`
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('ARCADE', width / 2, height / 2)

	const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(tick / 6))
	ctx.fillStyle = `rgba(78,168,222,${pulse})`
	ctx.fillRect(0, height - 3, width, 3)
}

function drawAnimatedFrame(ctx, width, height, tick, palette) {
	fillCanvas(ctx, '#000000', width, height)
	for (let x = 0; x < width; x++) {
		const idx = Math.abs(Math.floor((x + tick) / 3)) % palette.length
		ctx.fillStyle = palette[idx]
		ctx.fillRect(x, 0, 1, height)
	}

	for (let y = 0; y < height; y += 2) {
		ctx.fillStyle = `rgba(255,255,255,${0.04 + ((tick + y) % 5) * 0.02})`
		ctx.fillRect(0, y, width, 1)
	}
}

async function pushCanvasToMatrix(matrix, canvas, brightness = 127) {
	matrix.clear()
	matrix.drawCanvas(canvas, brightness)
	await matrix.writeToDisplay()
}

export async function runExamples3(buttons, {
	signal,
	durationMs = 60000,
	log = () => {},
} = {}) {
	log('examples3.py: lighting active buttons with ascending brightness')
	for (const button of getActiveButtonNumbers(buttons)) {
		throwIfAborted(signal)
		buttons.setButtonMode(button, 'normal', {
			colorTo: RGBl(30, 10, 10, (button % 15) * 2 + 1),
		})
	}
	await wait(durationMs, signal)
}

export async function runExamplesButtonDemo(buttons, {
	signal,
	log = () => {},
} = {}) {
	log('examples.py: blinking button groups')
	const activeButtons = getActiveButtonNumbers(buttons)
	for (let index = 0; index < activeButtons.length; index++) {
		const button = activeButtons[index]
		const color = BUTTON_COLORS[button % BUTTON_COLORS.length]
		const reverse = index >= Math.ceil(activeButtons.length / 2)
		buttons.setButtonMode(button, 'blink', {
			colorTo: reverse ? RGBl(0, 0, 0, 0) : color,
			colorFrom: reverse ? color : RGBl(0, 0, 0, 0),
			transitionTime: 0.25,
		})
	}
	await wait(3000, signal)

	log('examples.py: holding button colors')
	for (const button of activeButtons) {
		buttons.setButtonMode(button, 'normal', {
			colorTo: BUTTON_COLORS[button % BUTTON_COLORS.length],
		})
	}
	await wait(3000, signal)

	log('examples.py: fading button groups down')
	for (const button of activeButtons) {
		buttons.setButtonMode(button, 'fade', {
			colorTo: RGBl(10, 10, 10, 5),
			transitionTime: 2,
		})
	}
	await wait(5000, signal)

	log('examples.py: sweeping across Picade Max coordinates')
	const { minX, maxX, minY, maxY } = getCoordBounds(buttons.coordMap)
	for (let column = minX; column < maxX; column++) {
		throwIfAborted(signal)
		for (let row = minY; row < maxY; row++) {
			buttons.setLedModeByCoord([column, row], 'normal', { colorTo: RGBl(31, 31, 31, 5) })
		}
		await wait(10, signal)
	}
	for (let column = minX; column < maxX; column++) {
		throwIfAborted(signal)
		for (let row = minY; row < maxY; row++) {
			buttons.setLedModeByCoord([column, row], 'normal', { colorTo: RGBl(15, 15, 0, 5) })
		}
		await wait(10, signal)
	}
	await wait(200, signal)

	for (let row = minY; row < maxY; row++) {
		throwIfAborted(signal)
		for (let column = minX; column < maxX; column++) {
			buttons.setLedModeByCoord([column, row], 'normal', { colorTo: RGBl(31, 31, 31, 5) })
		}
		await wait(10, signal)
	}
	for (let row = minY; row < maxY; row++) {
		throwIfAborted(signal)
		for (let column = minX; column < maxX; column++) {
			buttons.setLedModeByCoord([column, row], 'normal', { colorTo: RGBl(0, 15, 15, 5) })
		}
		await wait(10, signal)
	}
	await wait(200, signal)

	log('examples.py: label-based player highlighting')
	buttons.setButtonModeByLabel('P1:A', 'fade sweep', {
		colorFrom: RGBl(0, 63, 63, 15),
		colorTo: RGBl(0, 0, 63, 15),
		transitionTime: 0.5,
	})
	for (const label of PICADE_6_BUTTON_LABELS.filter(label => label !== 'P1:A')) {
		buttons.setButtonModeByLabel(label, 'normal', { colorTo: RGBl(15, 15, 63, 15) })
	}
	await wait(5000, signal)

	log('examples.py: fading active buttons out')
	for (const button of activeButtons) {
		buttons.setButtonMode(button, 'fade', {
			colorTo: RGBl(0, 0, 0, 0),
			transitionTime: 2,
		})
	}
	await wait(3000, signal)
}

export async function runButtonPattern(buttons, name, {
	signal,
	log = () => {},
} = {}) {
	const activeButtons = getActiveButtonNumbers(buttons)
	const ledCoords = getLedCoordinates(buttons.coordMap)
	const { minX, maxX, minY, maxY } = getCoordBounds(buttons.coordMap)
	const centerX = (minX + maxX - 1) / 2
	const centerY = (minY + maxY - 1) / 2

	if (name === 'rainbow_fade') {
		log('pattern: rainbow_fade')
		for (let i = 0; i < activeButtons.length; i++) {
			throwIfAborted(signal)
			buttons.triggerButtonFade(activeButtons[i], hsvToRGBl(i * (360 / activeButtons.length), 15), {
				fadeTime: 0.45,
			})
			await sleepTicks(buttons.refreshRate, 2, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'sparkle_fade') {
		log('pattern: sparkle_fade')
		for (let i = 0; i < 36; i++) {
			throwIfAborted(signal)
			const led = ledCoords[Math.floor(Math.random() * ledCoords.length)]
			buttons.triggerLedFade(led.ledNumber, hsvToRGBl(i * 41, 12 + (i % 4)), {
				fadeTime: 0.5,
			})
			await sleepTicks(buttons.refreshRate, 1, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'panel_wave') {
		log('pattern: panel_wave')
		const palette = [
			RGBl(0, 35, 63, 15),
			RGBl(20, 50, 10, 15),
			RGBl(63, 18, 10, 15),
			RGBl(55, 40, 0, 15),
			RGBl(20, 0, 63, 15),
			RGBl(63, 0, 35, 15),
		]
		for (let index = 0; index < PICADE_6_BUTTON_LABELS.length; index++) {
			const label = PICADE_6_BUTTON_LABELS[index]
			buttons.triggerButtonFadeByLabel(label, palette[index % palette.length], { fadeTime: 0.7 })
			await sleepTicks(buttons.refreshRate, 1, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'center_out') {
		log('pattern: center_out')
		const ordered = [...ledCoords].sort((a, b) =>
			Math.hypot(a.x - centerX, a.y - centerY) - Math.hypot(b.x - centerX, b.y - centerY)
		)
		for (let i = 0; i < ordered.length; i++) {
			throwIfAborted(signal)
			buttons.triggerLedFade(ordered[i].ledNumber, hsvToRGBl(180 + i * 3, 14), { fadeTime: 0.5 })
			if (i % 4 === 0) await sleepTicks(buttons.refreshRate, 1, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'edge_in') {
		log('pattern: edge_in')
		const ordered = [...ledCoords].sort((a, b) => {
			const distA = Math.max(Math.abs(a.x - centerX), Math.abs(a.y - centerY))
			const distB = Math.max(Math.abs(b.x - centerX), Math.abs(b.y - centerY))
			return distB - distA
		})
		for (let i = 0; i < ordered.length; i++) {
			throwIfAborted(signal)
			buttons.triggerLedFade(ordered[i].ledNumber, RGBl(63, 20, 0, 14), { fadeTime: 0.45 })
			if (i % 4 === 0) await sleepTicks(buttons.refreshRate, 1, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'column_scan') {
		log('pattern: column_scan')
		for (let x = minX; x < maxX; x++) {
			throwIfAborted(signal)
			for (const led of ledCoords) {
				if (led.x === x) {
					buttons.triggerLedFade(led.ledNumber, RGBl(15, 63, 15, 15), { fadeTime: 0.4 })
				}
			}
			await sleepTicks(buttons.refreshRate, 2, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'row_scan') {
		log('pattern: row_scan')
		for (let y = minY; y < maxY; y++) {
			throwIfAborted(signal)
			for (const led of ledCoords) {
				if (led.y === y) {
					buttons.triggerLedFade(led.ledNumber, RGBl(63, 0, 35, 15), { fadeTime: 0.4 })
				}
			}
			await sleepTicks(buttons.refreshRate, 2, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'alternating_pairs') {
		log('pattern: alternating_pairs')
		for (let i = 0; i < activeButtons.length; i++) {
			throwIfAborted(signal)
			const color = i % 2 === 0 ? RGBl(63, 63, 0, 15) : RGBl(0, 25, 63, 15)
			buttons.triggerButtonFade(activeButtons[i], color, { fadeTime: 0.6 })
			if (i % 2 === 1) await sleepTicks(buttons.refreshRate, 2, signal)
		}
		await wait(1200, signal)
		return
	}

	if (name === 'label_cycle') {
		log('pattern: label_cycle')
		const labels = [...PICADE_6_BUTTON_LABELS]
		for (let i = 0; i < labels.length; i++) {
			throwIfAborted(signal)
			buttons.triggerButtonFadeByLabel(labels[i], hsvToRGBl(i * 24, 15), {
				fadeTime: 0.5,
				holdTime: 0.03,
			})
			await sleepTicks(buttons.refreshRate, 1, signal)
		}
		await wait(1200, signal)
		return
	}

	throw new Error(`Unknown button pattern "${name}"`)
}

export async function runExamplesMatrixDemo(matrix, {
	signal,
	log = () => {},
} = {}) {
	const canvas = createCanvas(matrix.width, matrix.height)
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Unable to create matrix example canvas context')
	}

	log('examples.py: static arcade frame')
	drawArcadeFrame(ctx, canvas.width, canvas.height)
	await pushCanvasToMatrix(matrix, canvas, 127)
	await wait(5000, signal)

	log('examples.py: animated frame sequence')
	const start = performance.now()
	let tick = 0
	while (performance.now() - start < 5000) {
		throwIfAborted(signal)
		drawAnimatedFrame(ctx, canvas.width, canvas.height, tick, ['#1f4fff', '#19d3da', '#f7b500', '#ff0054'])
		await pushCanvasToMatrix(matrix, canvas, 127)
		tick += 1
		await wait(100, signal)
	}

	log('examples.py: animated frame with darker background')
	const start2 = performance.now()
	tick = 0
	while (performance.now() - start2 < 5000) {
		throwIfAborted(signal)
		drawArcadeFrame(ctx, canvas.width, canvas.height, tick)
		drawAnimatedFrame(ctx, canvas.width, canvas.height, tick * 2, ['rgba(117,180,117,0.35)', 'rgba(0,0,0,0.1)'])
		await pushCanvasToMatrix(matrix, canvas, 127)
		tick += 1
		await wait(100, signal)
	}

	log('examples.py: restore arcade frame')
	drawArcadeFrame(ctx, canvas.width, canvas.height)
	await pushCanvasToMatrix(matrix, canvas, 127)
}
