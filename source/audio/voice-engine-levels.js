import { VOICE_ENGINE_PROGRAM_TRIM_DB } from './voice-engines/program-levels.js'

// HarmonEasy's audio-smoke-entry.ts reference phrase and <4 dB acceptance check
// are reused by actions/check-engine-levels.cjs for our five renderers
// (A3, MIDI velocity 80, 600 ms after warmup, default GM piano).
// Native/TinySynth already agree; FM and SuperSonic need their own companion trims
// because they aren't HarmonEasy's Tone/Sonic Pi voices. Yoshimi's parts can only be
// attenuated, so its trim is the boost that program-levels.js works down from.
// Native's -2 dB offsets the +2 dB its piano gets in program-levels.js.
export const VOICE_ENGINE_TRIM_DB = Object.freeze({
	native:-2,
	fm:4.5,
	yoshimi:10.29,
	wam2:0,
	supersonic:1
})

// Evens out the General MIDI programs within one engine.
export const voiceProgramGain = (engine,program) =>
	10 ** ((VOICE_ENGINE_PROGRAM_TRIM_DB[engine]?.[program] ?? 0)/20)

// Apply the fixed calibration independently of saved user gain and expression.
export const voiceEngineGain = (engine,settings={}) =>
	10 ** (((VOICE_ENGINE_TRIM_DB[engine] ?? 0)+(settings.outputGainDb ?? 0))/20)
