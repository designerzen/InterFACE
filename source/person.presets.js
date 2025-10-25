import { FIFTHS_SCALE_KEYS, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS } from "./audio/tuning/keys.js"
import { NOTES_BLACK, NOTES_WHITE } from "./audio/tuning/notes.js"
import { 
	PERSON_TYPE_ARPEGGIO, 
	PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS, 
	PERSON_TYPE_CHROMATIC, 
	PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS 
} from "./person.js"

/**
 * 
 * @param {Person} person 
 * @param {Number} operatingMode 
 */
export const configurePersonByOperatingMode = (person, operatingMode=0 ) => {
	person.userMode = operatingMode
	switch (operatingMode)
	{
		case PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS:
			// Arp - turn it into an arp if the person has index of 1
			person.leftFacingKeys = FIFTHS_SCALE_KEYS
			person.rightFacingKeys = FIFTHS_SCALE_KEYS
			person.activeInstrument.arpeggiate = true
			// console.info(">>> PERSON "+person.playerNumber+" Arpeggiate") 
			break

		case PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS:
			// Sympathetic chords - all just circle of fifths
			person.leftFacingKeys = FIFTHS_SCALE_KEYS
			person.rightFacingKeys = FIFTHS_SCALE_KEYS
			person.activeInstrument.arpeggiate = false
			// console.info(">>> PERSON "+person.playerNumber+" COF Scales" ) 
			break

		case PERSON_TYPE_CHROMATIC:
			// Sympathetic chords - Chromatic scale
			person.leftFacingKeys = NOTES_BLACK
			person.rightFacingKeys = NOTES_WHITE
			// person.leftFacingKeys = JAZZ_MINOR_SCALE_KEYS
			// person.rightFacingKeys = JAZZ_MINOR_SCALE_KEYS
			person.activeInstrument.arpeggiate = false
			// console.info(">>> PERSON "+person.playerNumber+" Chromatic Scale" ) 
			break
				
		case PERSON_TYPE_ARPEGGIO:
		default:
			// Slow COF Arp
			person.leftFacingKeys = MAJOR_SCALE_KEYS
			person.rightFacingKeys = MINOR_SCALE_KEYS
			person.activeInstrument.arpeggiate = true
			// console.info(">>> PERSON "+person.playerNumber+" Arpeggiate COF" ) 
			break
	}
}

/**
 * 
 * @param {Person} person 
 * @param {Array<Person>} people 
 */
export const configurePersonByIndex = (person, people) => {
	configurePersonByOperatingMode( person, person.playerNumber % people.length )
}