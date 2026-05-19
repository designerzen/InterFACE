/**
 * Each mediator controls an instrument
 * through being passed as object
 */
// import DrumkitInstrument, { OPTIONS_DRUMKIT } from "../instruments/instrument.drumkit.js"
import { STATE_INSTRUMENT_SILENT } from "../../people/person-states.js"

/**
 * 
 * @param {Instrument} drumkit 
 * @param {Person} person 
 * @param {Boolean} playAudio 
 * @returns [chord]
 */
export const updtateDrumkitWithPerson = ( drumkit, person, playAudio=true ) => {
	const isSilent = person.state === STATE_INSTRUMENT_SILENT || person.noteVelocity <= 0
	const personData = person.data ?? {}
	const roll = Math.abs(personData.roll ?? person.roll ?? 0)
	const pitch = Math.abs(personData.pitch ?? 0)
	const yaw = Math.abs(personData.yaw ?? 0)
	const expression = Math.max(
		personData.happiness ?? 0,
		personData.mouthRatio ?? 0,
		person.noteVelocity ?? 0
	)

	drumkit.updatePerson?.({
		...personData,
		noteNumber: person.noteNumber,
		noteVelocity: person.noteVelocity,
		velocity: person.noteVelocity,
		pitchBend: person.pitchBendValue,
		roll: person.roll
	})

	drumkit.setMutedParts?.({
		kick: isSilent || pitch > 0.72,
		snare: yaw > 0.82,
		hat: roll > 0.82,
		clap: expression < 0.12
	})

	if (playAudio && expression > 0.7)
	{
		drumkit.requestFill?.(expression)
	}

	return []
}
