import { MAX_REVERB_LENGTH, SYNTHETIC_SPACE, getReverbSpace } from './effects/reverb-spaces.js'

const number = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback

const text = value => typeof value === 'string' && value ? value : undefined

// Settings that describe the session's space rather than one engine
export const SHARED_ENGINE_SETTINGS = ['roomSpace','roomMix']

export const normaliseEngineSettings = (engine, value={}) => {
	// Older settings stored an impulse URL and a generated room duration
	const reverbSpace = text(value.reverbSpace) ?? text(value.reverbImpulse) ?? SYNTHETIC_SPACE
	const reverb = {
		levelCalibrationVersion:1,
		outputGainDb:number(value.outputGainDb,0,-18,18),
		reverbMode:['preset','off','custom'].includes(value.reverbMode) ? value.reverbMode : 'preset',
		reverbMix:number(value.reverbMix,engine === 'yoshimi' ? 0.05 : 0.15,0,1),
		reverbSpace,
		reverbLength:number(value.reverbLength ?? value.reverbDuration,engine === 'yoshimi' ? 0.8 : getReverbSpace(reverbSpace).length,0.2,MAX_REVERB_LENGTH),
		reverbTone:number(value.reverbTone,0,-1,1),
		reverbPreDelay:number(value.reverbPreDelay,0.012,0,0.1),
		// A named space every player shares, layered over instrument reverb
		roomSpace:text(value.roomSpace) ?? 'hall',
		roomMix:number(value.roomMix,0,0,1),
		reverbDisabledPrograms:[...new Set((Array.isArray(value.reverbDisabledPrograms) ? value.reverbDisabledPrograms : []).filter(program => Number.isInteger(program) && program >= 0 && program < 128))]
	}
	if (engine === 'native') return reverb
	if (engine === 'yoshimi') return reverb
	if (engine === 'fm' || engine === 'supersonic') return {...reverb,pitchBendRange:number(value.pitchBendRange,2,0,24)}
	if (engine === 'wam2') return {...reverb,quality:Number(value.quality) === 0 ? 0 : 1}
	return {}
}

export const readEngineSettings = value => {
	try {
		const settings = typeof value === 'string' ? JSON.parse(value) : value
		return Object.fromEntries(['native','fm','yoshimi','wam2','supersonic'].map(engine => {
			let saved = settings?.[engine]
			// Older Yoshimi settings included a built-in +6 dB boost in this field.
			// Retain the user's adjustment relative to that old baseline once only.
			if (engine === 'yoshimi' && saved && !saved.levelCalibrationVersion && saved.outputGainDb !== undefined) {
				saved = {...saved,outputGainDb:number(saved.outputGainDb,6,-18,18)-6}
			}
			return [engine,normaliseEngineSettings(engine,saved)]
		}))
	}
	catch { return readEngineSettings({}) }
}
