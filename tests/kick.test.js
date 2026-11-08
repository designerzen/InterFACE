import {
	DEFAULT_KICK_VOICES,
	createKick,
	createKicks,
} from '../source/audio/synthesizers/kick.js'
import {
	PRESET_PITCH_DIVE_KICK,
	PRESET_ELASTIC_KICK,
	PRESETS_KICKS,
} from '../source/audio/synthesizers/kick-presets.js'
import { ZERO } from '../source/audio/audio-constants.js'

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})

const createNode = (properties={}) => ({
	connect:jest.fn(),
	disconnect:jest.fn(),
	...properties,
})

const createAudioContext = () => {
	const oscillators = []
	const gains = []
	return {
		currentTime:1,
		oscillators,
		gains,
		createOscillator:jest.fn(() => {
			const oscillator = createNode({
				frequency:createAudioParam(),
				start:jest.fn(),
				stop:jest.fn(),
				onended:null,
			})
			oscillators.push(oscillator)
			return oscillator
		}),
		createGain:jest.fn(() => {
			const gain = createNode({ gain:createAudioParam() })
			gains.push(gain)
			return gain
		}),
	}
}

describe('kick polyphony', () => {
	test('creates fresh oscillators for every hit', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())

		kick({ triggerAt:1.1 })
		kick({ triggerAt:1.2 })

		expect(context.oscillators).toHaveLength(4)
		expect(context.oscillators.every(oscillator => oscillator.start.mock.calls.length === 1)).toBe(true)
		expect(kick.activeVoiceCount).toBe(2)
		expect(kick.maxVoices).toBe(DEFAULT_KICK_VOICES)
	})

	test('never reserves more than eight simultaneous kick voices', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())
		const options = { triggerAt:2, length:1, attack:0.01, decay:0.1, release:0.2 }

		for (let hit = 0; hit < DEFAULT_KICK_VOICES + 1; hit++) kick(options)

		expect(kick.activeVoiceCount).toBe(DEFAULT_KICK_VOICES)
		expect(context.oscillators).toHaveLength((DEFAULT_KICK_VOICES + 1) * 2)
		expect(context.oscillators[0].stop).toHaveBeenLastCalledWith(2)
		expect(context.oscillators.at(-1).start).toHaveBeenCalledWith(2)
	})

	test('delays an immediate replacement until the stolen voice has faded', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode(), { maxVoices:1 })

		kick({ triggerAt:1, length:1 })
		const replacement = kick({ triggerAt:1, length:1 })

		expect(context.oscillators[0].stop).toHaveBeenLastCalledWith(1.005)
		expect(replacement.triggerAt).toBe(1.005)
		expect(context.oscillators[2].start).toHaveBeenCalledWith(1.005)
		expect(kick.activeVoiceCount).toBe(1)
	})

	test('uses the configured release as the final envelope stage', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())

		kick({
			triggerAt:1,
			length:1,
			attack:0.01,
			decay:0.1,
			release:0.2,
			velocity:0.5,
			sustain:0.5,
		})

		expect(context.gains[1].gain.setValueAtTime).toHaveBeenLastCalledWith(0.25 * 0.9, 1.8)
		expect(context.gains[1].gain.exponentialRampToValueAtTime).toHaveBeenLastCalledWith(ZERO, 2)
		expect(context.oscillators[0].stop.mock.calls[0][0]).toBeCloseTo(1 + 0.42 * 0.91)
		expect(context.oscillators[1].stop).toHaveBeenCalledWith(2)
	})

	test('treats triggerAt zero as an immediate hit', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())

		const played = kick({ triggerAt:0 })

		expect(played.triggerAt).toBe(context.currentTime + ZERO)
		expect(context.oscillators[0].start).toHaveBeenCalledWith(context.currentTime + ZERO)
	})

	test('lets instrument factories choose a different voice limit', () => {
		const context = createAudioContext()
		const kicks = createKicks(context, createNode(), 3)

		expect(kicks.maxVoices).toBe(3)
	})

	test('chokes every active voice with a short release', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())
		kick({ triggerAt:1, length:1 })
		kick({ triggerAt:1, length:1 })

		kick.choke(0.01, 1.1)

		expect(kick.activeVoiceCount).toBe(0)
		expect(context.oscillators[0].stop).toHaveBeenLastCalledWith(1.11)
		expect(context.oscillators[2].stop).toHaveBeenLastCalledWith(1.11)
	})

	test('bends both kick oscillators across the configured pitch range and duration', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())

		kick({
			triggerAt:1.1,
			length:0.5,
			pitchStartRatio:4,
			pitchEndRatio:0.5,
			pitchDecay:0.04,
			triStart:100,
			triEnd:50,
			sineStart:120,
			sineApex:150,
			sineSustain:80,
			sineEnd:40,
		})

		expect(context.oscillators[0].frequency.setValueAtTime).toHaveBeenCalledWith(400, 1.1)
		const [triangleEnd, triangleEndAt] = context.oscillators[0].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)
		expect(triangleEnd).toBe(25)
		expect(triangleEndAt).toBeCloseTo(1.14)
		expect(context.oscillators[1].frequency.setValueAtTime).toHaveBeenCalledWith(480, 1.1)
		const [sineEnd, sineEndAt] = context.oscillators[1].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)
		expect(sineEnd).toBe(20)
		expect(sineEndAt).toBeCloseTo(1.14)
	})

	test('includes short and elastic pitch-bend kick presets', () => {
		expect(PRESETS_KICKS).toEqual(expect.arrayContaining([PRESET_PITCH_DIVE_KICK, PRESET_ELASTIC_KICK]))
		expect(PRESET_PITCH_DIVE_KICK.pitchStartRatio).toBeGreaterThan(4)
		expect(PRESET_PITCH_DIVE_KICK.pitchDecay).toBeLessThan(0.05)
		expect(PRESET_ELASTIC_KICK.pitchDecay).toBeGreaterThan(PRESET_PITCH_DIVE_KICK.pitchDecay)
	})

	test('softens the pitch attack without changing the tuned tail or adding nodes', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())
		kick({ velocity:0.2, triggerAt:1.1 })
		kick({ velocity:1, triggerAt:1.3 })
		expect(context.oscillators[0].frequency.setValueAtTime.mock.calls[0][0])
			.toBeLessThan(context.oscillators[2].frequency.setValueAtTime.mock.calls[0][0])
		expect(context.oscillators[0].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)[0])
			.toBe(context.oscillators[2].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)[0])
		expect(context.oscillators).toHaveLength(4)
		expect(context.gains).toHaveLength(4)
	})

	test('fades body and sub independently when stealing or choking', () => {
		const context = createAudioContext()
		const kick = createKick(context, createNode())
		kick({ triggerAt:1.1, length:1 })
		kick.choke(0.005, 1.2)
		const body = context.gains[0].gain.setValueAtTime.mock.calls.at(-1)[0]
		const sub = context.gains[1].gain.setValueAtTime.mock.calls.at(-1)[0]
		expect(body).toBeGreaterThan(0)
		expect(sub).toBeGreaterThan(body)
	})
})
