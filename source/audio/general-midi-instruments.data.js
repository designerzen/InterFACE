import instrumentData from "./general-midi-instruments.json"

export const PLAYBACK_MODE_ONE_SHOT = "one-shot"
export const PLAYBACK_MODE_CONTINUOUS = "continuous"

const REQUIRED_FIELDS = [
	"program",
	"name",
	"location",
	"title",
	"group",
	"family",
	"repetitionRate",
	"synthRepetitionRate",
	"playbackMode",
	"oneShot",
	"continuous",
	"reverb",
	"lpf",
	"compressor"
]

const freezeEffect = effect => effect === false ? false : Object.freeze({ ...effect })

const validateInstrument = (instrument, index) => {
	if (!instrument || instrument.program !== index)
	{
		throw Error(`General MIDI instrument ${index} has an invalid program number`)
	}
	for (const field of REQUIRED_FIELDS)
	{
		if (!(field in instrument))
		{
			throw Error(`General MIDI instrument ${index} is missing ${field}`)
		}
	}
	if (![PLAYBACK_MODE_ONE_SHOT, PLAYBACK_MODE_CONTINUOUS].includes(instrument.playbackMode))
	{
		throw Error(`General MIDI instrument ${index} has invalid playbackMode ${instrument.playbackMode}`)
	}
	if (instrument.oneShot === instrument.continuous)
	{
		throw Error(`General MIDI instrument ${index} must be either one-shot or continuous`)
	}
	for (const field of ["repetitionRate", "synthRepetitionRate"])
	{
		if (!Number.isInteger(instrument[field]) || instrument[field] < (field === "repetitionRate" ? 1 : 0))
		{
			throw Error(`General MIDI instrument ${index} has invalid ${field}`)
		}
	}
	return Object.freeze({
		...instrument,
		reverb:freezeEffect(instrument.reverb),
		lpf:freezeEffect(instrument.lpf),
		compressor:freezeEffect(instrument.compressor)
	})
}

if (!Array.isArray(instrumentData) || instrumentData.length !== 128)
{
	throw Error("The General MIDI instrument data file must contain 128 programs")
}

export const GENERAL_MIDI_INSTRUMENT_DATA = Object.freeze(instrumentData.map(validateInstrument))

const normaliseLookupKey = value => typeof value === "string" ? value.trim().toLowerCase() : value

const INSTRUMENT_DATA_BY_KEY = new Map()
GENERAL_MIDI_INSTRUMENT_DATA.forEach(instrument => {
	INSTRUMENT_DATA_BY_KEY.set(instrument.program, instrument)
	INSTRUMENT_DATA_BY_KEY.set(String(instrument.program), instrument)
	INSTRUMENT_DATA_BY_KEY.set(normaliseLookupKey(instrument.name), instrument)
	INSTRUMENT_DATA_BY_KEY.set(normaliseLookupKey(instrument.title), instrument)
	INSTRUMENT_DATA_BY_KEY.set(normaliseLookupKey(instrument.location), instrument)
	INSTRUMENT_DATA_BY_KEY.set(normaliseLookupKey(instrument.location.replace(/-mp3$/, "")), instrument)
})

export const getGeneralMIDIInstrumentData = preset => INSTRUMENT_DATA_BY_KEY.get(normaliseLookupKey(preset)) ?? null

// Rates count retriggers per bar; zero plays once and holds/releases normally.
export const getGeneralMIDIRepetitionRate = (preset, sampleBased = true) => {
	const data = getGeneralMIDIInstrumentData(preset)
	return (sampleBased ? data?.repetitionRate : data?.synthRepetitionRate) ?? 0
}

export default GENERAL_MIDI_INSTRUMENT_DATA
