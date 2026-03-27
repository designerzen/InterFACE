import { FIFTHS_SCALE_KEYS, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS } from "../audio/tuning/keys.js"
import { NOTES_BLACK, NOTES_WHITE } from "../audio/tuning/notes.js"

// varieties of users (tie them into PlayerNumbers)
export const PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS = 0
export const PERSON_TYPE_CHROMATIC = 1
export const PERSON_TYPE_ARPEGGIO = 2
export const PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS = 3

export const PERSON_TYPE_DATA = [
	{
		// This is how we represent the above on screen
		name:"〇",
		description:"Sympathetic Circle of Fifths",
		arpeggiate:false,
		leftFacingKeys:FIFTHS_SCALE_KEYS,
		rightFacingKeys:FIFTHS_SCALE_KEYS,
	},
	{
		name:"12",
		description:"Classical Chromatic",
		arpeggiate:false,
		leftFacingKeys:NOTES_BLACK,
		rightFacingKeys:NOTES_WHITE,
	},
	{
		name:"𝆃",
		description:"Arpeggio",
		arpeggiate:true,
		leftFacingKeys:MAJOR_SCALE_KEYS,
		rightFacingKeys:MINOR_SCALE_KEYS,
	},
	{
		name:"⯂",
		description:"Arpeggio Circle of Fifths",
		arpeggiate:true,
		leftFacingKeys:FIFTHS_SCALE_KEYS,
		rightFacingKeys:FIFTHS_SCALE_KEYS,
	}
]

/**
 * Configure a Person to act in a certain way.
 * This doesn't affect the control mechanism, only
 * how the control mechanism sounds
 * 
 * @param {Person} person 
 * @param {Number|String} operatingMode 
 */
export const configurePersonByOperatingMode = (person, operatingMode=0 ) => {
	
	operatingMode %= PERSON_TYPE_DATA.length
	person.userMode = operatingMode

	const data = PERSON_TYPE_DATA[operatingMode]

	if (!data)
	{
		throw Error("No User Mode with that index")
	}

	person.leftFacingKeys = data.leftFacingKeys
	person.rightFacingKeys = data.rightFacingKeys
	if (person.activeInstrument) {
		person.activeInstrument.arpeggiate = data.arpeggiate
	}

	// special cases
	switch (operatingMode)
	{
		default:
			// console.info(">>> PERSON "+person.playerNumber+" Arpeggiate COF" ) 
			break
	}
}

/**
 * Pass an index and configure this Person with the 
 * appropriate userModes and data 
 * 
 * @param {Person} person 
 * @param {Array<Person>} people 
 */
export const configurePersonByIndex = (person, people) => {
	// depending on the amount of people playing, we choose appropriate userModes
	if (people.length === 1)
	{
		configurePersonByOperatingMode( person, PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS )
	}else{
		configurePersonByOperatingMode( person, person.playerNumber % people.length )
	}
}