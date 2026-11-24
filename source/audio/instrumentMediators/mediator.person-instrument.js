import { planPersonPerformance } from '../../../packages/photosynth/src/performance.js'
import { INSTRUMENT_TYPE_CHORD } from '../instrument-list.js'
import { applyPerformanceEvents } from './performance-output.js'

export const updateInstrumentWithPerson = (instrument, person, playAudio = true, repeatNote = false) => {
	const result = planPersonPerformance(person, {
		chord: instrument.type === INSTRUMENT_TYPE_CHORD && instrument.playsChords !== false,
		repeat: repeatNote,
		time: performance.now()
	})
	applyPerformanceEvents(instrument, result.events, playAudio)
	return result.notes
}
