import { convertHeadOrientationIntoNoteData } from './people/person.controls.js'
import { configurePersonByOperatingMode, configurePersonKey } from './people/person.presets.js'
import { convertNoteNameToMIDINoteNumber, chooseNoteNameUsingPercentage, getFriendlyNoteName } from './audio/tuning/notes.js'
import { getLipVolume, getLipCurvePosition, normaliseLipOptions } from './people/lip-sensitivity.js'
import { EmojiDetector } from './models/emoji-detection.js'
import PersonMotion from './people/person-motion.js'
import EyeInstrumentGesture from './people/eye-instrument-gesture.js'
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_SUSTAIN, STATE_INSTRUMENT_SILENT } from './people/person-states.js'
import { planPersonPerformance } from './performance.js'

export const DEFAULT_PERFORMER_OPTIONS = Object.freeze({
	channel: 1, operatingMode: 0, chord: true, muted: false,
	noteController: 'roll', octaveController: 'pitch', sharpController: 'isFacingRight',
	octaveLow: 2, octaveHigh: 6, headNoteRangeDegrees: 90,
	headVerticalRangeDegrees: 90, headVerticalOffsetDegrees: 10,
	lipRange: 100, mouthDynamics: 'gentle', mouthCutOff: 0.06,
	maximumAmplitude: 0.6, harmonyMode: 'free-range', tonic: 0, keyScale: 'MAJOR_SCALE',
	emojiMood: 'all', pitchBend: false, stereoPan: true,
	arpeggioRate: 'auto', instrumentGestures: true,
	drawEyes: true, eyebrowStyle: 'classic', lipStyle: 'music', photoSensitive: false,
	mode: 'face', handPinch: 0.3, root: 60
})

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export class Performer {
	activeNotes = new Map()
	noteNumber = -1
	lastNoteNumber = -1
	noteVelocity = 0
	state = STATE_INSTRUMENT_SILENT
	singing = false
	data = null
	controls = new Map()
	lastRepeat = -Infinity
	constructor(index, options = {}) {
		this.playerNumber = index
		this.id = `person-${index}`
		this.motion = new PersonMotion(options)
		this.emojiDetector = new EmojiDetector()
		this.instrumentGesture = new EyeInstrumentGesture(options)
		this.options = { ...DEFAULT_PERFORMER_OPTIONS, channel: index % 16 + 1 }
		this.configure(options)
	}
	configure(options) {
		const next = normaliseLipOptions({ ...this.options, ...options })
		for (const key of ['channel', 'octaveLow', 'octaveHigh', 'headNoteRangeDegrees', 'headVerticalRangeDegrees', 'headVerticalOffsetDegrees', 'mouthCutOff', 'maximumAmplitude', 'root', 'handPinch']) {
			if (!Number.isFinite(next[key])) throw new RangeError(`${key} must be finite`)
		}
		if (!Number.isInteger(next.channel) || next.channel < 1 || next.channel > 16) throw new RangeError('Channel must be 1–16')
		if (next.octaveLow < 0 || next.octaveHigh > 8 || next.octaveLow > next.octaveHigh) throw new RangeError('Invalid octave range')
		if (!['face', 'hands'].includes(next.mode)) throw new RangeError('Unknown performer mode')
		if (next.maximumAmplitude < 0 || next.maximumAmplitude > 1 || next.mouthCutOff < 0 || next.mouthCutOff > 1) throw new RangeError('Amplitude and mouth gate must be 0–1')
		this.options = next
		configurePersonByOperatingMode(this, next.operatingMode)
		configurePersonKey(this)
	}
	reset(time, trackingLost = true) {
		const events = []
		for (const notes of this.activeNotes.values()) {
			for (const value of notes) events.push(this.event('noteOff', time, { note: typeof value === 'number' ? value : value.noteNumber, velocity: 0 }))
		}
		for (const [key, type, detail] of [
			['expression', 'controlChange', { controller: 11, value: 0 }],
			['timbre', 'controlChange', { controller: 74, value: 0 }],
			['pan', 'controlChange', { controller: 10, value: 0.5 }],
			['bend', 'pitchBend', { value: 0 }]
		]) if (this.controls.has(key)) events.push(this.event(type, time, detail))
		for (const key of this.controls.keys()) if (key.startsWith('parameter:')) {
			events.push(this.event('parameterChange', time, { parameter: key.slice(10), value: 0 }))
		}
		this.activeNotes.clear()
		this.controls.clear()
		this.singing = false
		this.state = STATE_INSTRUMENT_SILENT
		if (trackingLost) {
			this.data = null
			this.motion.invalidate()
			this.instrumentGesture.reset()
		}
		this.lastRepeat = -Infinity
		return events
	}
	event(type, time, detail) {
		return { source: this.id, performer: this.playerNumber, channel: this.options.channel, time, type, ...detail }
	}
	update(prediction, time, { repeat = false, bpm = 120 } = {}) {
		if (!prediction) return this.reset(time)
		this.data = prediction
		this.motion.update(prediction, time)
		const options = this.options
		const data = {
			roll: 0, pitch: 0, yaw: 0, mouthRatio: 0, happiness: 0, eyebrowExtents: 0,
			...prediction
		}
		for (const key of ['roll', 'pitch', 'yaw', 'mouthRatio', 'happiness', 'eyebrowExtents']) data[key] = finite(data[key])
		data.isFacingRight ??= data.yaw > 0
		this.playingEmoticon = this.emojiDetector.detect(data, options, time)
		const action = this.instrumentGesture.update(data, time, 240000 / bpm, !options.instrumentGestures || options.muted)
		const requests = action ? [this.event('instrumentRequest', time, { action })] : []
		this.lastNoteNumber = this.noteNumber
		let velocity
		if (options.mode === 'hands') {
			const points = prediction.landmarks ?? prediction.keypoints
			if (!points || points.length < 21 || !points.every(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))) return this.reset(time)
			const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
			const scale = distance(points[0], points[9])
			const pinch = distance(points[4], points[8]) / Math.max(0.001, scale)
			const active = pinch <= options.handPinch * (this.singing ? 1.3 : 1)
			this.noteNumber = clamp(Math.round(options.root + clamp(1 - points[8].x) * 24), 0, 127)
			velocity = active ? clamp(1 - points[8].y) * options.maximumAmplitude : 0
			this.singing = active
		} else {
			const control = convertHeadOrientationIntoNoteData(data, options)
			const name = chooseNoteNameUsingPercentage((1 + control.noteNumber) / 2, control.newOctave, control.isSharp, this.leftFacingKeys, this.rightFacingKeys)
			this.noteNumber = clamp(convertNoteNameToMIDINoteNumber(name), 0, 127)
			this.noteName = getFriendlyNoteName(name)
			const opening = Math.max(finite(data.mouthRatio), finite(data.happiness))
			this.mouthCurvePosition = getLipCurvePosition(opening, options, data.mouthVolumeRatio)
			this.singing = 1 - Math.cos(opening * Math.PI / 2) >= options.mouthCutOff
			velocity = this.singing ? options.maximumAmplitude * getLipVolume(opening, options, data.mouthVolumeRatio) : 0
		}
		this.noteVelocity = clamp(finite(velocity))
		if (options.muted || !this.singing || !this.noteVelocity || !Number.isFinite(this.noteNumber)) return [...requests, ...this.reset(time, false)]
		const changed = this.lastNoteNumber !== this.noteNumber || !this.activeNotes.size
		this.state = changed ? STATE_INSTRUMENT_ATTACK : STATE_INSTRUMENT_SUSTAIN
		const result = planPersonPerformance(this, { chord: options.chord && options.mode === 'face', repeat, time })
		result.events.unshift(...requests)
		const values = [
			['expression', this.noteVelocity, 'controlChange', { controller: 11 }],
			['timbre', clamp(finite(data.happiness)), 'controlChange', { controller: 74 }]
		]
		if (options.pitchBend || options.eyebrowStyle === 'bend') values.push(['bend', clamp(finite(data.eyebrowExtents) - 1, -1, 1), 'pitchBend', {}])
		const parameter = { space: 'reverb', filter: 'lowPass', echo: 'delay', squish: 'compression' }[options.eyebrowStyle]
		if (parameter) values.push([`parameter:${parameter}`, clamp(finite(data.eyebrowsRaisedBy)), 'parameterChange', { parameter }])
		if (options.stereoPan && !data.leftEyeClosed && !data.rightEyeClosed) values.push(['pan', (1 - clamp(finite(data.eyesHorizontal), -1, 1)) / 2, 'controlChange', { controller: 10 }])
		for (const [key, raw, type, detail] of values) {
			const value = Math.round(raw * 1000) / 1000
			if (this.controls.get(key) !== value) {
				this.controls.set(key, value)
				result.events.push(this.event(type, time, { ...detail, value }))
			}
		}
		return result.events
	}
}
