import { TextDecoder, TextEncoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const PREFIX = new TextEncoder().encode('multiverse:data')

let PicadePlasma
let PICADE_PLASMA_BUTTON_EVENTS
let getPicadePlasmaLightPreset
let parsePicadePlasmaLightLayout

beforeAll(async () => {
	;({ PicadePlasma, PICADE_PLASMA_BUTTON_EVENTS, getPicadePlasmaLightPreset, parsePicadePlasmaLightLayout } = await import('../source/hardware/gamepad/picade-plasma.js'))
})

describe('PicadePlasma named button layout', () => {
	test('defaults to the Picade physical button order', () => {
		expect(PICADE_PLASMA_BUTTON_EVENTS.slice(0, 8)).toEqual([
			'a', 'b', 'x', 'y', 'lb', 'rb', 'start', 'select',
		])
	})

	test('defaults to one shared sixteen-light panel split between two players', () => {
		const plasma = new PicadePlasma()

		expect(plasma.buttonCount).toBe(16)
		expect(plasma.playerButtonEvents).toEqual([
			['a', 'b', 'x', 'y', 'lb', 'rb', 'start', 'select'],
			['a', 'b', 'x', 'y', 'lb', 'rb', 'start', 'select'],
		])
	})

	test('uses the configured event order for each player transport group', () => {
		const plasma = new PicadePlasma({
			buttonEvents: ['kick', 'snare', 'hat'],
			playerCount: 2,
		})

		expect(plasma.buttonEvents).toEqual(['kick', 'snare', 'hat'])
		expect(plasma.getButtonIndex(0, 'kick')).toBe(0)
		expect(plasma.getButtonIndex(0, 'hat')).toBe(2)
		expect(plasma.getButtonIndex(1, 'kick')).toBe(3)
		expect(plasma.getButtonIndex(1, 'snare')).toBe(4)
	})

	test('loads the fifteen-light table preset in its physical button order', () => {
		const plasma = new PicadePlasma(getPicadePlasmaLightPreset('table'))

		expect(plasma.buttonCount).toBe(15)
		expect(plasma.playerButtonEvents).toEqual([
			['lb', 'lt', 'rt', 'ls', 'x', 'a', 'y', 'b'],
			['b', 'a', 'y', 'x', 'lt', 'rt', 'ls'],
		])
		expect(plasma.getButtonIndex(1, 'b')).toBe(0)
		expect(plasma.getButtonIndex(1, 'ls')).toBe(6)
		expect(plasma.getButtonIndex(0, 'lb')).toBe(7)
		expect(plasma.getButtonIndex(0, 'lt')).toBe(8)
		expect(plasma.getButtonIndex(0, 'x')).toBe(11)
		expect(plasma.getButtonIndex(0, 'b')).toBe(14)
		expect(plasma.hasSystemLight('s1')).toBe(false)
	})

	test('loads the six-light Picade preset in its physical button order', () => {
		const plasma = new PicadePlasma(getPicadePlasmaLightPreset('picade'))

		expect(plasma.buttonCount).toBe(6)
		expect(plasma.playerButtonEvents).toEqual([
			['a', 'b', 'lb', 'rb', 'y', 'x'],
			[],
		])
		expect(plasma.buttonMappings).toEqual([
			{ player: 0, eventType: 'a', index: 0 },
			{ player: 0, eventType: 'b', index: 1 },
			{ player: 0, eventType: 'lb', index: 2 },
			{ player: 0, eventType: 'rb', index: 3 },
			{ player: 0, eventType: 'y', index: 4 },
			{ player: 0, eventType: 'x', index: 5 },
		])
		expect(plasma.getButtonIndex(0, 'a')).toBe(0)
		expect(plasma.getButtonIndex(0, 'x')).toBe(5)
		expect(plasma.getButtonIndex(1, 'a')).toBeNull()
	})

	test('falls back to the default layout for an unknown preset name', () => {
		const plasma = new PicadePlasma(getPicadePlasmaLightPreset('unknown'))

		expect(plasma.buttonCount).toBe(16)
		expect(plasma.getButtonIndex(1, 'a')).toBe(8)
	})

	test('parses a custom query layout with explicit Player 2 controls', () => {
		const layout = parsePicadePlasmaLightLayout('x,y,a,b,2rb,2lb,2y,2x,2b,2a')
		const plasma = new PicadePlasma(layout)

		expect(plasma.playerButtonEvents).toEqual([
			['x', 'y', 'a', 'b'],
			['rb', 'lb', 'y', 'x', 'b', 'a'],
		])
		expect(plasma.getButtonIndex(0, 'x')).toBe(0)
		expect(plasma.getButtonIndex(1, 'rb')).toBe(4)
		expect(plasma.getButtonIndex(1, 'a')).toBe(9)
	})

	test('preserves the physical slot order when Player 1 and Player 2 controls are interleaved', () => {
		const plasma = new PicadePlasma(parsePicadePlasmaLightLayout('a,2b,x,2y'))

		expect(plasma.getButtonIndex(0, 'a')).toBe(0)
		expect(plasma.getButtonIndex(1, 'b')).toBe(1)
		expect(plasma.getButtonIndex(0, 'x')).toBe(2)
		expect(plasma.getButtonIndex(1, 'y')).toBe(3)
	})

	test('allows multiple buttons to target one physical slot without renumbering the layout', () => {
		const plasma = new PicadePlasma(parsePicadePlasmaLightLayout('1a+1b,-,-,-,-,1x'))

		expect(plasma.buttonCount).toBe(6)
		expect(plasma.getButtonIndex(0, 'a')).toBe(0)
		expect(plasma.getButtonIndex(0, 'b')).toBe(0)
		expect(plasma.getButtonIndex(0, 'x')).toBe(5)
	})

	test('accepts raw plus signs after a query string has decoded them as spaces', () => {
		const plasma = new PicadePlasma(parsePicadePlasmaLightLayout('1a 1b,-,-,-,-,1x'))

		expect(plasma.buttonCount).toBe(6)
		expect(plasma.getButtonIndex(0, 'a')).toBe(0)
		expect(plasma.getButtonIndex(0, 'b')).toBe(0)
		expect(plasma.getButtonIndex(0, 'x')).toBe(5)
	})

	test('maps the standalone s1 system light without exposing it as a player button', () => {
		const plasma = new PicadePlasma(parsePicadePlasmaLightLayout('a,s1,2b'))

		expect(plasma.playerButtonEvents).toEqual([['a'], ['b']])
		expect(plasma.getButtonIndex(0, 'a')).toBe(0)
		expect(plasma.getSystemLightIndex('s1')).toBe(1)
		expect(plasma.hasSystemLight('s1')).toBe(true)
		expect(plasma.buttonMappings).toEqual([
			{ player: 0, eventType: 'a', index: 0 },
			{ player: null, eventType: 's1', index: 1 },
			{ player: 1, eventType: 'b', index: 2 },
		])

		plasma.setSystemLight('S1', '#112233')
		const payload = plasma.getPacket().slice(PREFIX.length)
		const ledOffset = (1 * 4) * 4
		expect(Array.from(payload.slice(ledOffset, ledOffset + 4))).toEqual([0x33, 0x22, 0x11, 31])
	})

	test('accepts s1 as a standalone system-only light layout', () => {
		const plasma = new PicadePlasma(getPicadePlasmaLightPreset('s1'))

		expect(plasma.buttonCount).toBe(1)
		expect(plasma.getSystemLightIndex('s1')).toBe(0)
		expect(plasma.playerButtonEvents).toEqual([[], []])
	})

	test('supports multiple uniquely indexed system lights', () => {
		const plasma = new PicadePlasma(parsePicadePlasmaLightLayout('a,s1,s2,2b,s3'))

		expect(plasma.buttonCount).toBe(5)
		expect(plasma.getSystemLightIndex('s1')).toBe(1)
		expect(plasma.getSystemLightIndex('s2')).toBe(2)
		expect(plasma.getSystemLightIndex('s3')).toBe(4)
		expect(plasma.hasSystemLight('s4')).toBe(false)
	})

	test('defaults an unprefixed custom query layout to Player 1', () => {
		const plasma = new PicadePlasma(getPicadePlasmaLightPreset('a,b,l1,r1'))

		expect(plasma.playerButtonEvents).toEqual([
			['a', 'b', 'lb', 'rb'],
			[],
		])
		expect(plasma.buttonCount).toBe(4)
		expect(plasma.getButtonIndex(1, 'a')).toBeNull()
	})

	test('sets and resets a named player button without using a transport index', () => {
		const plasma = new PicadePlasma({
			buttonEvents: ['kick', 'snare', 'hat'],
			playerCount: 2,
		})

		plasma.setButtonLight(1, 'snare', '#112233')
		const payload = plasma.getPacket().slice(PREFIX.length)
		const ledOffset = (4 * 4) * 4
		expect(Array.from(payload.slice(ledOffset, ledOffset + 4))).toEqual([0x33, 0x22, 0x11, 31])

		plasma.resetButtonLight(1, 'snare')
		const resetPayload = plasma.getPacket().slice(PREFIX.length)
		expect(Array.from(resetPayload.slice(ledOffset, ledOffset + 4))).toEqual([0, 0, 0, 0])
	})

	test('sets and resets every configured button light', () => {
		const plasma = new PicadePlasma({ buttonEvents: ['kick', 'snare'], playerCount: 2 })

		plasma.setAllButtonLights('#ff0000')
		const litPayload = plasma.getPacket().slice(PREFIX.length)
		expect(Array.from(litPayload.slice(0, 4))).toEqual([0, 0, 0xff, 31])
		expect(Array.from(litPayload.slice((3 * 4) * 4, (3 * 4) * 4 + 4))).toEqual([0, 0, 0xff, 31])

		plasma.resetAllButtonLights()
		const resetPayload = plasma.getPacket().slice(PREFIX.length)
		expect(Array.from(resetPayload.slice(0, 4))).toEqual([0, 0, 0, 0])
	})

	test('clears and writes every light when the page unloads', async () => {
		const serialDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serial')
		const requestAnimationFrame = global.requestAnimationFrame
		const cancelAnimationFrame = global.cancelAnimationFrame
		const writes = []
		const writer = {
			write: jest.fn(async data => writes.push(new Uint8Array(data))),
			releaseLock: jest.fn(),
		}
		const port = {
			getInfo: () => ({ usbVendorId: 0x2e8a, usbProductId: 0x1098 }),
			open: jest.fn(async () => {}),
			close: jest.fn(async () => {}),
			writable: { getWriter: () => writer },
		}

		Object.defineProperty(navigator, 'serial', {
			configurable: true,
			value: { getPorts: jest.fn(async () => [port]) },
		})
		global.requestAnimationFrame = jest.fn(() => 1)
		global.cancelAnimationFrame = jest.fn()

		try {
			const plasma = new PicadePlasma({ buttonEvents: ['a'], playerCount: 1 })
			plasma.setButtonLight(0, 'a', '#ff0000')
			await plasma.connect()
			window.dispatchEvent(new Event('pagehide'))
			await Promise.resolve()

			const payload = writes.at(-1).slice(PREFIX.length)
			expect(Array.from(payload)).toEqual(new Array(payload.length).fill(0))
			await plasma.disconnect()
		} finally {
			if (serialDescriptor) Object.defineProperty(navigator, 'serial', serialDescriptor)
			else delete navigator.serial
			global.requestAnimationFrame = requestAnimationFrame
			global.cancelAnimationFrame = cancelAnimationFrame
		}
	})
})
