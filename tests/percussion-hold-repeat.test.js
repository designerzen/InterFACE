import {
	PERCUSSION_HOLD_THRESHOLD_TICKS,
	createPercussionHoldRepeater,
	getPercussionRepeatTicks,
} from '../source/timing/percussion-quantise.js'

describe('held percussion repeats', () => {
	test('waits a bar before repeating', () => {
		const onRepeat = jest.fn()
		const repeater = createPercussionHoldRepeater({ onRepeat })
		repeater.press('keyboard:Digit0', 'kick')

		for (let tick = 1; tick < PERCUSSION_HOLD_THRESHOLD_TICKS; tick++) {
			repeater.advance()
		}
		expect(onRepeat).not.toHaveBeenCalled()

		repeater.advance()
		expect(onRepeat).toHaveBeenCalledWith('kick', expect.objectContaining({
			heldTicks: 96,
			inputId: 'keyboard:Digit0',
		}))
	})

	test('repeats hats faster than kicks while both remain held', () => {
		const repeats = []
		const repeater = createPercussionHoldRepeater({
			onRepeat: part => repeats.push(part),
		})
		repeater.press('keyboard:Digit0', 'kick')
		repeater.press('keyboard:Digit2', 'hat')

		for (let tick = 0; tick < 144; tick++) repeater.advance()

		expect(repeats.filter(part => part === 'hat')).toHaveLength(17)
		expect(repeats.filter(part => part === 'kick')).toHaveLength(2)
		expect(getPercussionRepeatTicks('hat')).toBe(3)
		expect(getPercussionRepeatTicks('kick')).toBe(48)
	})

	test('stops an individual rhythm on release', () => {
		const onRepeat = jest.fn()
		const repeater = createPercussionHoldRepeater({ onRepeat })
		repeater.press('gamepad-0:button-a', 'kick')
		repeater.press('gamepad-0:button-x', 'hat')

		for (let tick = 0; tick < 96; tick++) repeater.advance()
		repeater.release('gamepad-0:button-x')
		for (let tick = 0; tick < 48; tick++) repeater.advance()

		expect(onRepeat.mock.calls.filter(([part]) => part === 'hat')).toHaveLength(1)
		expect(onRepeat.mock.calls.filter(([part]) => part === 'kick')).toHaveLength(2)
	})

	test('clears all held inputs for a disconnected device', () => {
		const onRepeat = jest.fn()
		const repeater = createPercussionHoldRepeater({ onRepeat })
		repeater.press('gamepad-0:button-a', 'kick')
		repeater.press('gamepad-0:button-x', 'hat')
		repeater.press('gamepad-1:button-a', 'kick')

		expect(repeater.releasePrefix('gamepad-0:')).toBe(2)
		expect(repeater.size).toBe(1)
		for (let tick = 0; tick < 96; tick++) repeater.advance()

		expect(onRepeat).toHaveBeenCalledTimes(1)
		expect(onRepeat).toHaveBeenCalledWith('kick', expect.objectContaining({
			inputId: 'gamepad-1:button-a',
		}))
	})

	test('coalesces duplicate voices due on the same tick', () => {
		const onRepeat = jest.fn()
		const repeater = createPercussionHoldRepeater({ onRepeat })
		repeater.press('gamepad-0:button-b', 'snare')
		repeater.press('gamepad-1:button-b', 'snare')

		for (let tick = 0; tick < 96; tick++) repeater.advance()

		expect(onRepeat).toHaveBeenCalledTimes(1)
	})
})
