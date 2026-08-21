import {
	PRESET_808_LOW_CONGA,
	PRESET_808_HIGH_CONGA,
	PRESET_808_MUTE_CONGA,
	PRESET_727_HIGH_BONGO,
	PRESET_727_LOW_BONGO,
} from '../source/audio/synthesizers/hand-drum-presets.js'
import { createHandDrum } from '../source/audio/synthesizers/hand-drum.js'
import {
	PRESET_SOFT_SHAKER,
	PRESET_808_MARACAS,
	PRESET_727_CABASA,
} from '../source/audio/synthesizers/shaker-presets.js'
import { createShaker } from '../source/audio/synthesizers/shaker.js'
import { PRESET_MUTED_TRIANGLE, PRESET_OPEN_TRIANGLE, PRESET_TRIANGLES } from '../source/audio/synthesizers/triangle-presets.js'
import { createTriangle } from '../source/audio/synthesizers/triangle.js'
import { createJingle, PRESET_707_TAMBOURINE } from '../source/audio/synthesizers/jingle.js'
import { createScrape, PRESET_LONG_GUIRO } from '../source/audio/synthesizers/scrape.js'
import { createFrictionDrum, PRESET_OPEN_CUICA } from '../source/audio/synthesizers/friction-drum.js'
import { createWhistle, PRESET_727_LONG_WHISTLE } from '../source/audio/synthesizers/whistle.js'
import { createChime, PRESET_WIND_CHIME } from '../source/audio/synthesizers/chime.js'
import { createElectronicPercussion, PRESET_SYNDRUM } from '../source/audio/synthesizers/electronic-percussion.js'
import { AUXILIARY_DRUM_LANES, DRUM_GROOVES } from '../source/timing/drum-patterns.js'
import { KEYBOARD_PERCUSSION_ASSIGNMENTS, KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS } from '../source/hardware/keyboard/keyboard-performance.js'

jest.mock('../source/audio/audio.js', () => ({ ZERO:0.0001 }))
jest.mock('../source/audio/synthesizers.js', () => ({ chokeGains:jest.fn() }))

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})
const createNode = properties => ({ connect:jest.fn(), ...properties })
const createAudioContext = () => {
	const oscillators = []
	const bufferSources = []
	const gains = []
	return {
		currentTime:1,
		sampleRate:8000,
		oscillators,
		bufferSources,
		gains,
		createOscillator:jest.fn(() => {
			const node = createNode({ frequency:createAudioParam(), start:jest.fn() })
			oscillators.push(node)
			return node
		}),
		createGain:jest.fn(() => {
			const node = createNode({ gain:createAudioParam() })
			gains.push(node)
			return node
		}),
		createBiquadFilter:jest.fn(() => createNode({ frequency:createAudioParam(), Q:createAudioParam() })),
		createDelay:jest.fn(() => createNode({ delayTime:createAudioParam() })),
		createConvolver:jest.fn(() => createNode({ buffer:null, normalize:true })),
		createBuffer:jest.fn((channels, length) => {
			const data = new Float32Array(length)
			return { getChannelData:jest.fn(() => data) }
		}),
		createBufferSource:jest.fn(() => {
			const node = createNode({ start:jest.fn() })
			bufferSources.push(node)
			return node
		}),
	}
}

describe('auxiliary percussion voices', () => {
	test('separates hand-drum registers and articulations', () => {
		expect(PRESET_808_LOW_CONGA.frequency).toBeLessThan(PRESET_808_HIGH_CONGA.frequency)
		expect(PRESET_727_LOW_BONGO.frequency).toBeLessThan(PRESET_727_HIGH_BONGO.frequency)
		expect(PRESET_808_MUTE_CONGA.length).toBeLessThan(PRESET_808_HIGH_CONGA.length)
		expect(PRESET_808_MUTE_CONGA.noiseLevel).toBeGreaterThan(PRESET_808_HIGH_CONGA.noiseLevel)
	})

	test('schedules membrane pitch bend and hand transient', () => {
		const context = createAudioContext()
		const voice = createHandDrum(context, createNode())
		voice({ ...PRESET_808_HIGH_CONGA, triggerAt:1.25 })

		expect(context.oscillators[0].frequency.setValueAtTime).toHaveBeenCalledWith(
			PRESET_808_HIGH_CONGA.frequency * PRESET_808_HIGH_CONGA.pitchBend, 1.25
		)
		expect(context.oscillators[0].frequency.exponentialRampToValueAtTime)
			.toHaveBeenCalledWith(PRESET_808_HIGH_CONGA.frequency, 1.272)
		expect(context.bufferSources[0].start).toHaveBeenCalledWith(1.25)
	})

	test('offers soft, analog-style and coarse vintage shaker colours', () => {
		expect(PRESET_SOFT_SHAKER.bandpass).toBeLessThan(PRESET_808_MARACAS.bandpass)
		expect(PRESET_727_CABASA.coarseLevel).toBeGreaterThan(PRESET_808_MARACAS.coarseLevel)
		expect(PRESET_727_CABASA.length).toBeGreaterThan(PRESET_808_MARACAS.length)

		const context = createAudioContext()
		const voice = createShaker(context, createNode())
		voice(PRESET_727_CABASA)
		expect(context.bufferSources).toHaveLength(2)
		expect(context.bufferSources.every(source => source.start.mock.calls.length === 1)).toBe(true)
	})

	test('models triangle damping independently of pitch', () => {
		expect(PRESET_MUTED_TRIANGLE.length).toBeLessThan(PRESET_OPEN_TRIANGLE.length)
		expect(PRESET_MUTED_TRIANGLE.sustain).toBeLessThan(PRESET_OPEN_TRIANGLE.sustain)
		expect(PRESET_OPEN_TRIANGLE.frequency).toBeGreaterThanOrEqual(3300)
		expect(PRESET_OPEN_TRIANGLE.outputGain).toBeLessThanOrEqual(0.04)
		expect(PRESET_OPEN_TRIANGLE.length).toBeLessThanOrEqual(0.32)
		expect(PRESET_OPEN_TRIANGLE.reverb).toBeGreaterThan(0)
		expect(Math.min(...PRESET_TRIANGLES.map(preset => preset.frequency))).toBeGreaterThanOrEqual(2800)
		expect(Math.max(...PRESET_TRIANGLES.map(preset => preset.outputGain))).toBeLessThanOrEqual(0.043)
		expect(Math.max(...PRESET_TRIANGLES.map(preset => preset.length))).toBeLessThanOrEqual(0.4)

		const context = createAudioContext()
		const voice = createTriangle(context, createNode(), () => 0.5)
		voice(PRESET_OPEN_TRIANGLE)
		expect(context.oscillators).toHaveLength(PRESET_OPEN_TRIANGLE.partialRatios.length)
		expect(context.oscillators[1].frequency.setValueAtTime).toHaveBeenCalledWith(
			PRESET_OPEN_TRIANGLE.frequency * PRESET_OPEN_TRIANGLE.partialRatios[1], 1.0001
		)
		expect(context.createConvolver).toHaveBeenCalledTimes(1)
		expect(context.createConvolver.mock.results[0].value.normalize).toBe(true)
		expect(context.gains[1].gain.setValueAtTime).toHaveBeenCalledWith(PRESET_OPEN_TRIANGLE.reverb, 1.0001)
	})

	test('varies triangle pitch, modes, levels and decay within preset bounds', () => {
		const lowHit = createTriangle(createAudioContext(), createNode(), () => 0)(PRESET_OPEN_TRIANGLE)
		const highHit = createTriangle(createAudioContext(), createNode(), () => 1)(PRESET_OPEN_TRIANGLE)

		expect(lowHit.frequency).toBeLessThan(PRESET_OPEN_TRIANGLE.frequency)
		expect(highHit.frequency).toBeGreaterThan(PRESET_OPEN_TRIANGLE.frequency)
		expect(lowHit.length).toBeLessThan(PRESET_OPEN_TRIANGLE.length)
		expect(highHit.length).toBeGreaterThan(PRESET_OPEN_TRIANGLE.length)
	})

	test.each([
		['tambourine', createJingle, PRESET_707_TAMBOURINE],
		['guiro', createScrape, PRESET_LONG_GUIRO],
		['cuica', createFrictionDrum, PRESET_OPEN_CUICA],
		['whistle', createWhistle, PRESET_727_LONG_WHISTLE],
		['chime', createChime, PRESET_WIND_CHIME],
		['electronic percussion', createElectronicPercussion, PRESET_SYNDRUM],
	])('schedules the %s synthesis voice and exposes cancel/choke', (name, factory, preset) => {
		const context = createAudioContext()
		const voice = factory(context, createNode(), () => 0.5)
		const result = voice({ ...preset, triggerAt:1.25, velocity:0.7 })

		expect(result.name).toBe(preset.name)
		expect(context.oscillators.length + context.bufferSources.length).toBeGreaterThan(0)
		expect(voice.cancel).toEqual(expect.any(Function))
		expect(voice.choke).toEqual(expect.any(Function))
	})

	test('registers every expanded voice as an arranger lane and uses them in grooves', () => {
		const expanded = [
			'kickAcoustic', 'snareElectric', 'tomFloorLow', 'tomFloorHigh', 'tomMidHigh', 'hatPedal',
			'rimshot', 'crossStick', 'claves', 'woodblockHigh', 'woodblockLow', 'castanets',
			'crash', 'crash2', 'ride', 'ride2', 'rideBell', 'splash', 'china', 'tambourine', 'chekere', 'agogoHigh', 'agogoLow',
			'timbaleHigh', 'timbaleLow', 'guiroShort', 'guiroLong', 'cuicaMute', 'cuicaOpen',
			'whistleShort', 'whistleLong', 'surdoMute', 'surdoOpen', 'quijada', 'starChime',
			'windChime', 'fingerSnap', 'jingleBell', 'vibraslap', 'syndrum', 'laserTom', 'metalHit',
		]
		expect(AUXILIARY_DRUM_LANES).toEqual(expect.arrayContaining(expanded))
		const usedLanes = new Set(Object.values(DRUM_GROOVES).flatMap(pattern => Object.keys(pattern)))
		expect(expanded.every(part => usedLanes.has(part))).toBe(true)
	})

	test('exposes every new articulation on the percussion keyboard', () => {
		const parts = [...KEYBOARD_PERCUSSION_ASSIGNMENTS, ...KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS]
			.map(assignment => assignment.part)
		expect(parts).toEqual(expect.arrayContaining([
			'low-bongo', 'high-bongo',
			'low-conga', 'high-conga', 'mute-conga',
			'cabasa', 'maracas', 'mute-triangle', 'open-triangle',
		]))
		expect(parts).toEqual(expect.arrayContaining([
			'rimshot', 'crossStick', 'claves', 'woodblockHigh', 'woodblockLow', 'castanets',
			'splash', 'china', 'tambourine', 'chekere', 'agogoHigh', 'agogoLow',
			'timbaleHigh', 'timbaleLow', 'guiroShort', 'guiroLong', 'cuicaMute', 'cuicaOpen',
			'whistleShort', 'whistleLong', 'surdoMute', 'surdoOpen', 'quijada', 'starChime',
			'windChime', 'fingerSnap', 'syndrum', 'laserTom', 'metalHit',
		]))
		expect(parts).toEqual(expect.arrayContaining([
			'hatPedal', 'rideBell', 'crash2', 'vibraslap', 'jingleBell',
		]))
		expect(KEYBOARD_PERCUSSION_ASSIGNMENTS).toHaveLength(36)
		expect(KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS).toHaveLength(36)
	})
})
