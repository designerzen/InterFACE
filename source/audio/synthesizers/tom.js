import { ZERO } from '../audio-constants.js'
import {createQueue, chokeGains} from '../synthesizers'

// Tom presets live in their own file - re-export for backwards
// compatibility with existing imports.
export {
	DEFAULT_TOM_OPTIONS,
	PRESET_FLOOR_TOM,
	PRESET_LOW_TOM,
	PRESET_MID_TOM,
	PRESET_HIGH_TOM,
	PRESET_RACK_TOM,
	PRESET_DEEP_LOW_TOM,
	PRESET_808_LOW_TOM,
	PRESET_808_MID_TOM,
	PRESET_808_HIGH_TOM,
	PRESET_909_LOW_TOM,
	PRESET_909_HIGH_TOM,
	PRESET_LINN_TOM,
	PRESET_TECH_HOUSE_TOM,
	PRESET_BEEFY_TOM,
	PRESET_TRIBAL_TOM,
	PRESET_TIMBALE_TOM,
	PRESET_727_HIGH_TIMBALE,
	PRESET_727_LOW_TIMBALE,
	PRESET_OPEN_SURDO,
	PRESET_MUTED_SURDO,
	PRESET_CONGA_TOM,
	PRESET_BONGO_TOM,
	PRESET_JUNGLE_TOM,
	PRESET_DNB_TOM,
	PRESET_TRAP_TOM,
	PRESET_LOFI_TOM,
	PRESET_AMBIENT_TOM,
	PRESET_CINEMATIC_TOM,
	PRESET_DISTORTED_TOM,
	PRESET_TIGHT_TOM,
	PRESET_THUD_TOM,
	PRESET_RAVE_TOM,
	PRESET_PITCH_DROP_TOM,
	PRESET_LASER_DROP_TOM,
	PRESETS_TOMS,
	getRandomKTomPreset,
	getRandomTomPreset,
	getTomPresets,
} from './tom-presets.js'

import { DEFAULT_TOM_OPTIONS } from './tom-presets.js'
import { getVelocityEnvelopeLevels, getVelocityTone } from './percussion-envelope.js'
import { resolvePercussionPitchEnvelope, schedulePercussionPitchEnvelope } from './percussion-pitch-envelope.js'
import { createPercussionDynamics } from './percussion-dynamics.js'

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createTom = (audioContext, output ) => {
	const strike = createPercussionDynamics()

	const triangleOscillator = audioContext.createOscillator()
	const sineOscillator = audioContext.createOscillator()
	const gainTriangle = audioContext.createGain()
	const gainSine = audioContext.createGain()
	let isRunning = false

	triangleOscillator.type = "triangle"
	sineOscillator.type = "sine"
	
	// sustain measured in volume rather than time
	const tom = ( options=DEFAULT_TOM_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_TOM_OPTIONS, options )
		const requestedTime = options.triggerAt > 0 ? options.triggerAt : audioContext.currentTime + ZERO
		const time = Math.max(audioContext.currentTime, requestedTime)
		const endAt = time + options.length
		const dynamics = strike(options, time)
		const bodyEndAt = time + options.length * dynamics.bodyDecay
		const ringEndAt = time + options.length * dynamics.ringDecay
		const bodyAttackAt = Math.min(bodyEndAt, time + options.attack)
		const ringAttackAt = Math.min(ringEndAt, time + options.attack)
		
		// console.log("KICK", options )

		if (!isRunning)
		{
			try{
				triangleOscillator.start(time)
				sineOscillator.start(time)

				//osc4.stop(time + 0.05)  			
			}catch(error){
	
			}
			isRunning = true
		}
 
		// clear anything from previous plays
		gainTriangle.gain.cancelScheduledValues(time)
		gainSine.gain.cancelScheduledValues(time)
		
		triangleOscillator.frequency.cancelScheduledValues(time)
		sineOscillator.frequency.cancelScheduledValues(time)

		// set new envelopes
		const levels = getVelocityEnvelopeLevels(options)

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.peak * dynamics.ringGain), ringAttackAt)
		gainTriangle.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.sustain * dynamics.ringGain), Math.min(ringEndAt, ringAttackAt + options.decay))
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, ringEndAt)

		const pitch = resolvePercussionPitchEnvelope(options, time, endAt)
		pitch.startRatio *= getVelocityTone(options, 0.2) * dynamics.pitchAttack
		schedulePercussionPitchEnvelope(triangleOscillator.frequency, {
			start:options.triStart,
			end:options.triEnd,
		}, { ...pitch, startAt:time, attack:options.attack, decay:options.decay })
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.peak * dynamics.bodyGain), bodyAttackAt)
		gainSine.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.sustain * dynamics.bodyGain), Math.min(bodyEndAt, bodyAttackAt + options.decay))
		gainSine.gain.exponentialRampToValueAtTime(ZERO, bodyEndAt)

		schedulePercussionPitchEnvelope(sineOscillator.frequency, {
			start:options.sineStart,
			apex:options.sineApex,
			sustain:options.sineSustain || options.sineApex,
			end:options.sineEnd,
		}, { ...pitch, startAt:time, attack:options.attack, decay:options.decay })

		//  osc.stop(audioContext.currentTime + duration)
		//  osc2.stop(audioContext.currentTime + duration)
		return options
	}
 
	triangleOscillator.connect(gainTriangle)
	gainTriangle.connect(output)
	
	sineOscillator.connect(gainSine)
	gainSine.connect(output)

	tom.cancel = () => {
		strike.reset()
		const now = audioContext.currentTime
		gainTriangle.gain.cancelScheduledValues(now)
		gainTriangle.gain.setValueAtTime(ZERO, now)
		gainSine.gain.cancelScheduledValues(now)
		gainSine.gain.setValueAtTime(ZERO, now)
	}
	tom.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [gainTriangle.gain, gainSine.gain], duration, chokeAt)
	}

	return tom
}

// this is just an array of toms
export const createToms = (audioContext, output, quantity=2) => createQueue( audioContext, output , createTom, quantity)
