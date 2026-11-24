/** The standalone app's audio adapter; the SDK never imports this module. */
export const applyPerformanceEvents = (instrument, events, playAudio = true) => {
	for (const event of events) {
		// Preserve release of a previous monophonic note even when playback is disabled.
		if (!playAudio && !event.previous) continue
		switch (event.type) {
			case 'noteOn': instrument.noteOn(event.note, event.velocity); break
			case 'noteOff': instrument.noteOff(event.note, event.velocity); break
			case 'allNotesOff': instrument.allNotesOff(); break
			case 'chordOn': instrument.chordOn(event.notes, event.velocity); break
			case 'chordOff': instrument.chordOff(event.notes, event.velocity); break
			case 'chordRetrigger': (instrument.chordRetrigger ?? instrument.chordOn).call(instrument, event.notes, event.velocity); break
			case 'retrigger': (instrument.retrigger ?? instrument.noteOn).call(instrument, event.note, event.velocity); break
		}
	}
}
