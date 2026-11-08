import { getPicadeConnectionFeedback } from './picade-config-navigation.js'
import { PicadePlasma } from './picade-plasma.js'

const PICADE_RAINBOW = [
	'#ff0000', '#ff8800', '#ffff00', '#88ff00',
	'#00ff00', '#00ff88', '#00ffff', '#0088ff',
	'#0000ff', '#8800ff', '#ff00ff', '#ff0088',
	'#ffffff', '#ff6666', '#66ff66', '#6666ff',
]

let plasma = null
let flashTimer = null

export async function testPicadePlasmaLights(plasmaBtn, plasmaStatus) {
	plasmaStatus.dataset.state = 'working'
	if (plasma?.connected) {
		clearTimeout(flashTimer)
		await plasma.clear()
		plasmaStatus.textContent = 'Lights cleared.'
		plasmaStatus.dataset.state = 'success'
		plasmaBtn.textContent = 'Connect & Test Lights'
		return
	}
	if (!('serial' in navigator)) {
		plasmaStatus.textContent = 'WebSerial is unavailable. Use Chrome, Edge, or the Electron app.'
		plasmaStatus.dataset.state = 'error'
		return
	}
	plasmaBtn.disabled = true
	plasmaBtn.textContent = 'Connecting…'
	plasmaStatus.textContent = 'Choose the Picade Plasma serial device…'
	try {
		plasma = new PicadePlasma({ buttonCount: 16, playerCount: 2 })
		await plasma.connect()
		plasmaBtn.disabled = false
		plasmaBtn.textContent = 'Clear Lights'
		plasmaStatus.textContent = 'Connected! Flashing lights in order…'
		plasmaStatus.dataset.state = 'success'
		await flashSequence(plasmaStatus)
	} catch (error) {
		const feedback = getPicadeConnectionFeedback(error)
		plasmaStatus.textContent = feedback.message
		plasmaStatus.dataset.state = feedback.state
		console.warn('Unable to connect Picade Plasma lights', error)
		plasmaBtn.disabled = false
		plasmaBtn.textContent = 'Connect Picade Plasma Lights'
	}
}

async function flashSequence(plasmaStatus) {
	const count = plasma.buttonCount
	for (let i = 0; i < count; i++) {
		const color = PICADE_RAINBOW[i % PICADE_RAINBOW.length]
		plasma.light(i, color)
		await new Promise(resolve => { flashTimer = setTimeout(resolve, 180) })
	}
	await new Promise(resolve => { flashTimer = setTimeout(resolve, 600) })
	for (let i = count - 1; i >= 0; i--) {
		plasma.light(i, null)
		await new Promise(resolve => { flashTimer = setTimeout(resolve, 80) })
	}
	plasmaStatus.textContent = `Flashed ${count} lights in order. Press again to replay.`
	plasmaStatus.dataset.state = 'success'
}
