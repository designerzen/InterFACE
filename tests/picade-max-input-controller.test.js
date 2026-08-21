import { TextDecoder, TextEncoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

let createPicadeMaxController
let findPicadeMaxInputGamepads
let isPicadeMaxInputController
let PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS
let PICADE_MAX_JOYSTICK_DOWN
let PICADE_MAX_JOYSTICK_LEFT
let PICADE_MAX_JOYSTICK_RIGHT
let PICADE_MAX_JOYSTICK_UP
let DIRECTION_DOWN
let DIRECTION_LEFT
let DIRECTION_RIGHT
let DIRECTION_UP
let BUTTON_LEFT_S

beforeAll(async () => {
	;({
		createPicadeMaxController,
		findPicadeMaxInputGamepads,
		isPicadeMaxInputController,
		PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS,
		PICADE_MAX_JOYSTICK_DOWN,
		PICADE_MAX_JOYSTICK_LEFT,
		PICADE_MAX_JOYSTICK_RIGHT,
		PICADE_MAX_JOYSTICK_UP,
	} = await import('../source/hardware/gamepad/picade-max-input-controller.js'))
	;({
		DIRECTION_DOWN,
		DIRECTION_LEFT,
		DIRECTION_RIGHT,
		DIRECTION_UP,
		BUTTON_LEFT_S,
	} = await import('../source/hardware/gamepad/gamepad-commands.js'))
})

describe('picade-max-input-controller', () => {
	test('recognises the Picade Max Input USB gamepad signature', () => {
		expect(isPicadeMaxInputController({ id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' })).toBe(true)
		expect(isPicadeMaxInputController({ id: 'GamePad 1 (Vendor: cafe Product: 400d)' })).toBe(true)
		expect(isPicadeMaxInputController({ id: 'Picade Max Input VID 0xcafe PID 0x400d' })).toBe(true)
		expect(isPicadeMaxInputController({
			gamepad: { id: 'GamePad 1 (Vendor: cafe Product: 400d)' },
		})).toBe(true)
		expect(isPicadeMaxInputController({ id: 'GamePad 0 (Vendor: 045e Product: 02ea)' })).toBe(false)
	})

	test('discovers two separate Picade Max player gamepads', () => {
		const gamepads = [
			null,
			{ index: 3, connected: true, id: 'GamePad 1 (Vendor: 2e8a Product: 1098)' },
			{ index: 2, connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
		]
		expect(findPicadeMaxInputGamepads(gamepads).map(gamepad => gamepad.index)).toEqual([3, 2])
		expect(findPicadeMaxInputGamepads(gamepads).map(gamepad => gamepad.player)).toEqual([0, 1])
	})

	test('discovers browser Picade Max gamepads with blank mappings', () => {
		const gamepads = [
			{
				index: 0,
				connected: true,
				id: 'GamePad 2 (Vendor: 2e8a Product: 1098)',
				axes: new Array(2),
				buttons: new Array(15),
				mapping: '',
			},
			{
				index: 1,
				connected: true,
				id: 'GamePad 1 (Vendor: 2e8a Product: 1098)',
				axes: new Array(2),
				buttons: new Array(15),
				mapping: '',
			},
			null,
			null,
		]
		expect(findPicadeMaxInputGamepads(gamepads).map(gamepad => gamepad.index)).toEqual([1, 0])
		expect(findPicadeMaxInputGamepads(gamepads).map(gamepad => gamepad.player)).toEqual([0, 1])
	})

	test('splits a single macOS combined Picade Max gamepad into two player inputs', () => {
		const gamepads = [
			{
				index: 0,
				connected: true,
				id: 'GamePad 1 (Vendor: 2e8a Product: 1098)',
				axes: new Array(4),
				buttons: new Array(30),
				mapping: '',
			},
			null,
			null,
			null,
		]
		const players = findPicadeMaxInputGamepads(gamepads)
		expect(players).toHaveLength(2)
		expect(players.map(player => player.index)).toEqual([0, 0])
		expect(players.map(player => player.source)).toEqual(['combined', 'combined'])
		expect(players.map(player => player.buttonOffset)).toEqual([0, 15])
		expect(players.map(player => player.axisOffset)).toEqual([0, 2])

		const controller = createPicadeMaxController(players)
		expect(controller.plasma.buttonEvents).toHaveLength(8)
		expect(controller.plasma.getButtonIndex(1, controller.plasma.buttonEvents[0])).toBe(8)
	})

	test('binds a single macOS Picade Max slot even when no second player slot exists', () => {
		const gamepads = [
			{
				index: 0,
				connected: true,
				id: 'GamePad 1 (Vendor: 2e8a Product: 1098)',
				axes: new Array(2),
				buttons: new Array(15),
				mapping: '',
			},
			null,
			null,
			null,
		]
		const players = findPicadeMaxInputGamepads(gamepads)
		expect(players).toHaveLength(2)
		expect(players.map(player => player.index)).toEqual([0, 0])
		expect(players.map(player => player.source)).toEqual(['single', 'placeholder'])

		const controller = createPicadeMaxController(players)
		expect(controller.gamepads.map(player => player.source)).toEqual(['single', 'placeholder'])
	})

	test('keeps the named Player 2 slot on Player 2 when macOS exposes only that interface', () => {
		const players = findPicadeMaxInputGamepads([{
			index: 0,
			connected: true,
			id: 'GamePad 2 (Vendor: 2e8a Product: 1098)',
			axes: new Array(2),
			buttons: new Array(15),
			mapping: '',
		}])

		expect(players.map(player => player.source)).toEqual(['placeholder', 'single'])
		expect(players.map(player => player.player)).toEqual([0, 1])
	})

	test('reads live value-only buttons and joystick axes from a single macOS Picade slot', () => {
		const previousNavigator = Object.getOwnPropertyDescriptor(global, 'navigator')
		const previousRequestAnimationFrame = global.requestAnimationFrame
		const previousCancelAnimationFrame = global.cancelAnimationFrame
		let frame = null
		const gamepad = {
			index: 0,
			connected: true,
			id: 'GamePad 1 (Vendor: 2e8a Product: 1098)',
			axes: [0, 0],
			buttons: Array.from({ length: 15 }, () => ({ pressed: false, value: 0 })),
			mapping: '',
		}

		Object.defineProperty(global, 'navigator', {
			configurable: true,
			value: { getGamepads: () => [gamepad] },
		})
		global.requestAnimationFrame = callback => {
			frame = callback
			return 1
		}
		global.cancelAnimationFrame = jest.fn()

		try {
			const controller = createPicadeMaxController(findPicadeMaxInputGamepads([gamepad]))
			const events = []
			controller.onButton(event => events.push(event))
			controller.start()
			frame()
			gamepad.axes[0] = 1
			frame()
			gamepad.axes[0] = 0
			frame()

			gamepad.buttons[0].value = 1
			frame()
			gamepad.buttons[0].value = 0
			frame()

			expect(events).toEqual(expect.arrayContaining([
				expect.objectContaining({ player: 0, action: PICADE_MAX_JOYSTICK_RIGHT, pressed: true, gamepad }),
				expect.objectContaining({ player: 0, action: PICADE_MAX_JOYSTICK_RIGHT, pressed: false, gamepad }),
				expect.objectContaining({ player: 0, button: 0, pressed: true, gamepad }),
				expect.objectContaining({ player: 0, button: 0, pressed: false, gamepad }),
			]))
			controller.stop()
		} finally {
			if (previousNavigator) {
				Object.defineProperty(global, 'navigator', previousNavigator)
			} else {
				delete global.navigator
			}
			global.requestAnimationFrame = previousRequestAnimationFrame
			global.cancelAnimationFrame = previousCancelAnimationFrame
		}
	})

	test('reads Player 2 from its own live Picade gamepad slot', () => {
		const previousNavigator = Object.getOwnPropertyDescriptor(global, 'navigator')
		const previousRequestAnimationFrame = global.requestAnimationFrame
		const previousCancelAnimationFrame = global.cancelAnimationFrame
		let frame = null
		const playerOne = {
			index: 0,
			connected: true,
			id: 'GamePad 1 (Vendor: 2e8a Product: 1098)',
			axes: [0, 0],
			buttons: Array.from({ length: 15 }, () => ({ pressed: false, value: 0 })),
			mapping: '',
		}
		const playerTwo = {
			index: 1,
			connected: true,
			id: 'GamePad 2 (Vendor: 2e8a Product: 1098)',
			axes: [0, 0],
			buttons: Array.from({ length: 15 }, () => ({ pressed: false, value: 0 })),
			mapping: '',
		}

		Object.defineProperty(global, 'navigator', {
			configurable: true,
			value: { getGamepads: () => [playerOne, playerTwo] },
		})
		global.requestAnimationFrame = callback => {
			frame = callback
			return 1
		}
		global.cancelAnimationFrame = jest.fn()

		try {
			const controller = createPicadeMaxController(findPicadeMaxInputGamepads([playerOne, playerTwo]))
			const events = []
			controller.onButton(event => events.push(event))
			controller.start()
			frame()
			playerTwo.buttons[0].value = 1
			frame()
			playerTwo.buttons[0].value = 0
			frame()

			expect(events).toEqual(expect.arrayContaining([
				expect.objectContaining({ player: 1, button: 0, pressed: true, gamepad: playerTwo }),
				expect.objectContaining({ player: 1, button: 0, pressed: false, gamepad: playerTwo }),
			]))
			controller.stop()
		} finally {
			if (previousNavigator) {
				Object.defineProperty(global, 'navigator', previousNavigator)
			} else {
				delete global.navigator
			}
			global.requestAnimationFrame = previousRequestAnimationFrame
			global.cancelAnimationFrame = previousCancelAnimationFrame
		}
	})

	test('discovers alternate Picade Max player gamepad IDs', () => {
		const gamepads = [
			{ index: 1, connected: true, id: 'GamePad 0 (Vendor: 045e Product: 02ea)' },
			{ index: 4, connected: true, id: 'GamePad 1 (Vendor: cafe Product: 400d)' },
			{ index: 5, connected: true, id: 'Picade Max Input VID 0xcafe PID 0x400d' },
		]
		expect(findPicadeMaxInputGamepads(gamepads).map(gamepad => gamepad.index)).toEqual([4, 5])
	})

	test('passes the named button event order to the Plasma controller', () => {
		const players = [
			{ index: 2, connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
			{ index: 3, connected: true, id: 'GamePad 1 (Vendor: 2e8a Product: 1098)' },
		]
		const controller = createPicadeMaxController(players, {
			buttonEvents: ['kick', 'snare', 'hat'],
		})
		expect(controller.plasma.buttonEvents).toEqual(['kick', 'snare', 'hat'])
		expect(controller.plasma.getButtonIndex(1, 'snare')).toBe(4)
	})

	test('loads the table Plasma light preset for both Picade players', () => {
		const players = [
			{ index: 2, connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
			{ index: 3, connected: true, id: 'GamePad 1 (Vendor: 2e8a Product: 1098)' },
		]
		const controller = createPicadeMaxController(players, { lightPreset: 'table' })

		expect(controller.plasma.getButtonIndex(0, 'a')).toBe(12)
		expect(controller.plasma.getButtonIndex(0, 'lb')).toBe(7)
		expect(controller.plasma.getButtonIndex(1, 'a')).toBe(1)
		expect(controller.plasma.buttonCount).toBe(15)
		expect(controller.plasma.hasSystemLight('s1')).toBe(false)
	})

	test('forwards non-drum Picade button actions for the light mapping editor', () => {
		const players = [
			{ index: 2, connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
			{ index: 3, connected: true, id: 'GamePad 1 (Vendor: 2e8a Product: 1098)' },
		]
		const controller = createPicadeMaxController(players)
		const events = []
		controller.onButton(event => events.push(event))

		controller.handleInput(0, BUTTON_LEFT_S, true)

		expect(events).toEqual([expect.objectContaining({
			player: 0,
			action: BUTTON_LEFT_S,
			button: null,
			pressed: true,
		})])
	})

	test('repeats a held button light using its original press colour until release', () => {
		const players = [
			{ index: 2, connected: true, id: 'GamePad 1 (Vendor: 2e8a Product: 1098)' },
			{ index: 3, connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
		]
		const plasma = {
			connected: true,
			hasButtonEvent: jest.fn(() => true),
			triggerButtonLight: jest.fn(),
			resetButtonLight: jest.fn(),
			setButtonLight: jest.fn(),
		}
		const controller = createPicadeMaxController(players, {
			plasma,
			getButtonLightOptions: () => ({
				color: '#b6ff00',
				brightness: 18,
				fadeTime: 0.24,
			}),
		})

		controller.handleInput(0, 'a', true)
		expect(plasma.triggerButtonLight).toHaveBeenLastCalledWith(
			0,
			'a',
			'#b6ff00',
			{ brightness: 18, fadeTime: 0.24 },
		)
		expect(plasma.setButtonLight).not.toHaveBeenCalled()

		expect(controller.repeatHeldButtonLight(0, 'a')).toBe(true)
		expect(plasma.triggerButtonLight).toHaveBeenCalledTimes(2)

		controller.handleInput(0, 'a', false)
		expect(plasma.resetButtonLight).toHaveBeenCalledWith(0, 'a')
		expect(controller.repeatHeldButtonLight(0, 'a')).toBe(false)
	})

	test('maps Picade D-pad button directions to joystick percussion actions', () => {
		expect(PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS[DIRECTION_UP]).toBe(PICADE_MAX_JOYSTICK_UP)
		expect(PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS[DIRECTION_DOWN]).toBe(PICADE_MAX_JOYSTICK_DOWN)
		expect(PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS[DIRECTION_LEFT]).toBe(PICADE_MAX_JOYSTICK_LEFT)
		expect(PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS[DIRECTION_RIGHT]).toBe(PICADE_MAX_JOYSTICK_RIGHT)
	})
})
