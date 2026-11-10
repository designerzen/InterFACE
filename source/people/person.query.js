import { DEFAULT_PEOPLE_OPTIONS, DEFAULT_PERSON_OPTIONS, IDENTIFIERS } from '../settings/options.people.js'
import { serialiseStateValue } from '../utils/state-encoding.js'

// Already stored in the compact p-N record (see Person.exportData)
export const PERSON_COMPACT_OPTION_KEYS = new Set([
	'defaultPreset', 'defaultInstrument', 'autoRepeat', 'noteParticleGraphics',
	'showPointsOverride', 'headNoteRangeOverride', 'headVerticalRangeOverride',
	'mouthDynamicsOverride', 'lipRangeOverride'
])

// Copied into every person from the global settings when they are created
export const PERSON_INHERITED_OPTION_KEYS = new Set([
	'dots', 'leftEyeIris', 'rightEyeIris', 'debug', 'photoSensitive',
	'tonic', 'harmonyMode', 'instrumentPack', 'midiPercussion', 'performanceDrums',
	'showPoints', 'headNoteRangeDegrees', 'lipRange', 'mouthDynamics',
	'headVerticalRangeDegrees', 'headVerticalOffsetDegrees', 'stereoPan',
	'drawMask', 'drawEyes', 'drawEyebrows', 'drawMouth', 'lipStyle',
	'recordData', 'mouthCutOff', 'mouthSilence', 'trim'
])

export const getPersonQueryPrefixes = (personOrIndex=0) => {
	const personIndex = typeof personOrIndex === "number" ?
		personOrIndex :
		(personOrIndex?.personIndex ?? personOrIndex?.playerNumber ?? 0)
	const identifier = IDENTIFIERS[personIndex] ?? `person-${personIndex + 1}`
	return [`p-${personIndex + 1}`, identifier]
}

export const getPersonQueryOptionMap = () => ({
	instrument:"defaultInstrument",
	preset:"defaultPreset",
	particles:"noteParticleGraphics"
})

export const getPersonQueryOptions = (data, prefixes=[]) => {
	if (!data || typeof data !== "object")
	{
		return {}
	}
	const optionKeys = Object.keys(DEFAULT_PERSON_OPTIONS)
	const optionMap = getPersonQueryOptionMap()
	const entries = []
	for (const prefix of prefixes)
	{
		for (const optionKey of optionKeys)
		{
			entries.push([`${prefix}-${optionKey}`, optionKey])
			entries.push([`${prefix}.${optionKey}`, optionKey])
		}
		for (const [queryKey, optionKey] of Object.entries(optionMap))
		{
			entries.push([`${prefix}-${queryKey}`, optionKey])
			entries.push([`${prefix}.${queryKey}`, optionKey])
		}
	}
	return entries.reduce((options, [queryKey, optionKey]) => {
		if (Object.prototype.hasOwnProperty.call(data, queryKey))
		{
			options[optionKey] = data[queryKey]
		}
		return options
	}, {})
}

/**
 * Export only the options this person has changed from their defaults,
 * under a single prefix. Older links with both prefixes and the
 * instrument / preset / particles aliases are still read.
 * @param {Person} person
 * @param {String} prefix optional prefix, defaults to p-N
 * @returns {Object}
 */
export const exportPersonQueryOptions = (person, prefix='') => {
	const personPrefix = prefix.length > 0 ?
		(prefix.endsWith('-') ? prefix.slice(0, -1) : prefix) :
		getPersonQueryPrefixes(person)[0]
	const personIndex = person?.personIndex ?? person?.playerNumber ?? 0
	const defaults = DEFAULT_PEOPLE_OPTIONS[personIndex] ?? DEFAULT_PERSON_OPTIONS
	const data = {}

	Object.entries(person.options).forEach(([optionKey, value]) => {
		if (PERSON_COMPACT_OPTION_KEYS.has(optionKey) || PERSON_INHERITED_OPTION_KEYS.has(optionKey)) return
		if (value === undefined || value === null || typeof value === 'function') return
		// plain objects cannot round trip through a query string
		if (typeof value === 'object' && !Array.isArray(value)) return
		if (serialiseStateValue(value) === serialiseStateValue(defaults[optionKey])) return
		data[`${personPrefix}-${optionKey}`] = value
	})

	return data
}
