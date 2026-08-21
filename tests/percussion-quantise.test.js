import {
	PERCUSSION_QUANTISE_TICKS,
	createPercussionQuantiser,
	getNextPercussionGridTime,
	getPercussionTriggerTime,
	scheduleAtAudioTime,
} from '../source/timing/percussion-quantise.js'

describe('live percussion quantisation', () => {
	test('uses three 24 PPQ ticks for a thirty-second-note grid', () => {
		expect(PERCUSSION_QUANTISE_TICKS).toBe(3)
	})

	test('schedules onto the next thirty-second-note boundary', () => {
		const triggerAt = getNextPercussionGridTime({
			now: 10.01,
			tickAudioTime: 10,
			divisionsElapsed: 1,
			tickDuration: 0.02,
		})

		expect(triggerAt).toBeCloseTo(10.04, 8)
	})

	test('advances a whole grid when the current boundary is too close', () => {
		const triggerAt = getNextPercussionGridTime({
			now: 10.001,
			tickAudioTime: 10,
			divisionsElapsed: 0,
			tickDuration: 0.02,
		})

		expect(triggerAt).toBeCloseTo(10.06, 8)
	})

	test('returns no schedule until a valid clock tick has been observed', () => {
		const quantiser = createPercussionQuantiser()
		expect(quantiser.getTriggerAt({ inputAudioTime: 10, now: 10 })).toBeNull()

		quantiser.update({
			tickAudioTime: 10,
			divisionsElapsed: 2,
			tickDuration: 0.02,
		})
		expect(quantiser.getTriggerAt({
			inputAudioTime: 10.005,
			now: 10.005,
		})).toBeCloseTo(10.02, 8)
	})

	test('uses MIDI event time to choose the intended grid', () => {
		const triggerAt = getNextPercussionGridTime({
			inputAudioTime: 10.01,
			now: 10.03,
			tickAudioTime: 10.02,
			divisionsElapsed: 2,
			tickDuration: 0.01,
			scheduleAhead: 0,
		})

		expect(triggerAt).toBeCloseTo(10.03, 8)
	})

	test('advances by complete grid intervals when event handling is late', () => {
		const triggerAt = getNextPercussionGridTime({
			inputAudioTime: 10.01,
			now: 10.035,
			tickAudioTime: 10.02,
			divisionsElapsed: 2,
			tickDuration: 0.01,
			scheduleAhead: 0.005,
		})

		expect(triggerAt).toBeCloseTo(10.06, 8)
	})

	test('uses the quantise setting to switch between grid and immediate playback', () => {
		const quantiser = { getTriggerAt: jest.fn(() => 10.06) }

		expect(getPercussionTriggerTime({ now: 10, quantise: true, quantiser })).toBe(10.06)
		expect(getPercussionTriggerTime({ now: 10, quantise: false, quantiser })).toBe(10.01)
		expect(quantiser.getTriggerAt).toHaveBeenCalledTimes(1)
		expect(quantiser.getTriggerAt).toHaveBeenCalledWith({
			inputAudioTime: 10,
			now: 10,
		})
	})

	test('preserves an explicitly scheduled trigger time', () => {
		const quantiser = { getTriggerAt: jest.fn(() => 10.06) }

		expect(getPercussionTriggerTime({
			now: 10,
			triggerAt: 12,
			quantise: true,
			quantiser,
		})).toBe(12)
		expect(quantiser.getTriggerAt).not.toHaveBeenCalled()
	})

	test('schedules a callback using the difference between audio times', () => {
		const callback = jest.fn()
		const setTimer = jest.fn(() => 42)

		scheduleAtAudioTime({
			now: 10,
			triggerAt: 10.06,
			callback,
			setTimer,
		})

		expect(setTimer).toHaveBeenCalledTimes(1)
		expect(setTimer.mock.calls[0][0]).toEqual(expect.any(Function))
		expect(setTimer.mock.calls[0][1]).toBeCloseTo(60, 8)
		expect(callback).not.toHaveBeenCalled()

		setTimer.mock.calls[0][0]()
		expect(callback).toHaveBeenCalledTimes(1)
	})

	test('can cancel a callback before its audio time', () => {
		const callback = jest.fn()
		const setTimer = jest.fn(() => 42)
		const clearTimer = jest.fn()
		const cancel = scheduleAtAudioTime({
			now: 10,
			triggerAt: 10.06,
			callback,
			setTimer,
			clearTimer,
		})

		expect(cancel()).toBe(true)
		expect(cancel()).toBe(false)
		expect(clearTimer).toHaveBeenCalledWith(42)

		setTimer.mock.calls[0][0]()
		expect(callback).not.toHaveBeenCalled()
	})

	test('runs immediately when no future audio time is available', () => {
		const callback = jest.fn()
		const setTimer = jest.fn()
		const cancel = scheduleAtAudioTime({
			now: 10,
			triggerAt: null,
			callback,
			setTimer,
		})

		expect(callback).toHaveBeenCalledTimes(1)
		expect(setTimer).not.toHaveBeenCalled()
		expect(cancel()).toBe(false)
	})
})
