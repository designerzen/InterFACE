import {
	GENERAL_MIDI_INSTRUMENT_DATA,
	getGeneralMIDIInstrumentData,
	getGeneralMIDIRepetitionRate
} from "../source/audio/general-midi-instruments.data.js"

describe("General MIDI SoundFont data", () => {
	test("provides a complete behavioural record for all 128 programs", () => {
		expect(GENERAL_MIDI_INSTRUMENT_DATA).toHaveLength(128)
		GENERAL_MIDI_INSTRUMENT_DATA.forEach((instrument, program) => {
			expect(instrument).toEqual(expect.objectContaining({
				program,
				name:expect.any(String),
				location:expect.any(String),
				title:expect.any(String),
				group:expect.any(String),
				family:expect.any(String),
				repetitionRate:expect.any(Number),
				synthRepetitionRate:expect.any(Number),
				playbackMode:expect.stringMatching(/^(one-shot|continuous)$/),
				oneShot:expect.any(Boolean),
				continuous:expect.any(Boolean)
			}))
			expect(instrument.oneShot).toBe(!instrument.continuous)
			for (const effect of ["reverb", "lpf", "compressor"])
			{
				expect(instrument[effect] === false || typeof instrument[effect] === "object").toBe(true)
			}
		})
	})

	test("uses canonical eight-program GM families", () => {
		expect(GENERAL_MIDI_INSTRUMENT_DATA[7].family).toBe("Piano")
		expect(GENERAL_MIDI_INSTRUMENT_DATA[8].family).toBe("Percussion")
		expect(GENERAL_MIDI_INSTRUMENT_DATA[40].family).toBe("Strings")
		expect(GENERAL_MIDI_INSTRUMENT_DATA[127].family).toBe("Sound Effects")
	})

	test("resolves program, title, name, and sample location to the same record", () => {
		const piano = getGeneralMIDIInstrumentData(0)
		expect(getGeneralMIDIInstrumentData(piano.name)).toBe(piano)
		expect(getGeneralMIDIInstrumentData(piano.title)).toBe(piano)
		expect(getGeneralMIDIInstrumentData(piano.location)).toBe(piano)
		expect(getGeneralMIDIInstrumentData("acoustic_grand_piano")).toBe(piano)
	})

	test("contains the SoundFont behaviour for a sustained string preset", () => {
		expect(GENERAL_MIDI_INSTRUMENT_DATA[40]).toEqual(expect.objectContaining({
			location:"violin-mp3",
			family:"Strings",
			repetitionRate:2,
			synthRepetitionRate:0,
			playbackMode:"continuous"
		}))
	})

	test("uses sample retriggers and sustained synth templates independently", () => {
		expect(getGeneralMIDIRepetitionRate("violin-mp3")).toBe(2)
		expect(getGeneralMIDIRepetitionRate(40, false)).toBe(0)
		expect(getGeneralMIDIRepetitionRate(0, false)).toBe(4)
		for (const instrument of GENERAL_MIDI_INSTRUMENT_DATA)
		{
			expect(Number.isInteger(instrument.repetitionRate)).toBe(true)
			expect(instrument.repetitionRate).toBeGreaterThan(0)
			if (instrument.continuous) expect(instrument.synthRepetitionRate).toBe(0)
		}
	})
})
