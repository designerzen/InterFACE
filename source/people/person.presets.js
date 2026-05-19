import { SCALE_LIBRARY, getKeyScaleNotes } from "../audio/tuning/keys.js"
import { NOTES_BLACK, NOTES_WHITE, NOTES_CIRCLE_OF_FIFTHS_NO_SHARPS, NOTES_CIRCLE_OF_FIFTHS_SHARPS } from "../audio/tuning/notes.js"

export const HARMONY_MODE_GLOBAL_KEY = "global-key"
export const HARMONY_MODE_FREE_RANGE = "free-range"

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
		leftFacingKeys:NOTES_CIRCLE_OF_FIFTHS_SHARPS,
		rightFacingKeys:NOTES_CIRCLE_OF_FIFTHS_NO_SHARPS,
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
		// leftFacingKeys:SCALE_LIBRARY.get("C MAJOR"),
		// rightFacingKeys:SCALE_LIBRARY.get("C MINOR"),
		leftFacingKeys:NOTES_BLACK,
		rightFacingKeys:NOTES_WHITE,
	},
	{
		name:"⯂",
		description:"Arpeggio Circle of Fifths",
		arpeggiate:true,
		leftFacingKeys:NOTES_CIRCLE_OF_FIFTHS_SHARPS,
		rightFacingKeys:NOTES_CIRCLE_OF_FIFTHS_NO_SHARPS
	}
]

export const normalisePersonOperatingMode = (operatingMode=0) => {
	const parsedMode = Number.parseInt(operatingMode, 10)
	const safeMode = Number.isFinite(parsedMode) ? parsedMode : 0
	return ((safeMode % PERSON_TYPE_DATA.length) + PERSON_TYPE_DATA.length) % PERSON_TYPE_DATA.length
}

export const configurePersonKey = (person) => {
	if (person.options?.harmonyMode !== HARMONY_MODE_GLOBAL_KEY)
	{
		return
	}
	const cacheKey = `${person.options.tonic}|${person.options.keyScale}`
	if (person.harmonyKeyCacheKey === cacheKey)
	{
		return
	}
	const keyNotes = getKeyScaleNotes(person.options.tonic, person.options.keyScale)
	person.leftFacingKeys = keyNotes
	person.rightFacingKeys = keyNotes
	person.quantityOfPlayableNotes = keyNotes.length
	person.harmonyKeyCacheKey = cacheKey
}

/**
 * Configure a Person to act in a certain way.
 * This doesn't affect the control mechanism, only
 * how the control mechanism sounds
 * 
 * @param {Person} person 
 * @param {Number|String} operatingMode 
 */
export const configurePersonByOperatingMode = (person, operatingMode=0 ) => {
	
	operatingMode = normalisePersonOperatingMode(operatingMode)
	person.userMode = operatingMode

	const data = PERSON_TYPE_DATA[operatingMode]

	if (!data)
	{
		throw Error("No User Mode with that index")
	}

	person.leftFacingKeys = data.leftFacingKeys
	person.rightFacingKeys = data.rightFacingKeys
	person.harmonyKeyCacheKey = null
	configurePersonKey(person)
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
