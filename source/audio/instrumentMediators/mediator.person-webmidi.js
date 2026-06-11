import { WebMidi } from "webmidi"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_RELEASE, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from "../../people/person-states.js"
import { isMIDIDebugEnabled, sendGuardedMIDIOutput, stopActiveMIDIOutputNotes } from "../midi/midi-echo-guard.js"
import { ROLI_PIANO } from "../midi/midi-devices-constants.js"

// This is a dirty hack to fix ROLI piano keyboards
// we use map rather than arrays as they are not zero indexed
const peopleNotes = new Map()
peopleNotes.set( 0, new Map() )
peopleNotes.set( 1, new Map() )
peopleNotes.set( 2, new Map() )
peopleNotes.set( 3, new Map() )

const MIDI_DEBUG_SUMMARY_INTERVAL = 1000

const getMIDIDebugState = () => {
	const debugState = globalThis.__photosynthMIDIDebug ?? {
		inputs: new Map(),
		outputs: new Map(),
		loops: new Map(),
		totals: {
			input: 0,
			output: 0,
			suppressed: 0,
			loopWarnings: 0
		},
		lastSummaryAt: 0,
		startedAt: performance.now()
	}
	globalThis.__photosynthMIDIDebug = debugState
	return debugState
}

const recordMIDISummary = () => {
	if (!isMIDIDebugEnabled())
	{
		return
	}

	const debugState = getMIDIDebugState()
	const now = performance.now()
	if (now - debugState.lastSummaryAt < MIDI_DEBUG_SUMMARY_INTERVAL)
	{
		return
	}

	debugState.lastSummaryAt = now
	console.info("MIDI:Debug summary", {
		totals: debugState.totals,
		inputs: Array.from(debugState.inputs?.values?.() ?? []),
		outputs: Array.from(debugState.outputs?.values?.() ?? []),
		loopKeys: debugState.loops?.size ?? 0,
		uptimeMs: Math.round(now - debugState.startedAt)
	})
}

const recordMIDIOutputDebug = (output, type, noteNumber, source, extra = {}) => {
	const debugState = getMIDIDebugState()
	const portId = output?.id ?? output?.name ?? 'unknown-output'
	const outputStats = debugState.outputs.get(portId) ?? {
		id: portId,
		name: output?.name,
		manufacturer: output?.manufacturer,
		count: 0,
		types: {},
		lastType: null,
		lastNote: null,
		lastSource: null,
		lastAt: 0
	}

	outputStats.count++
	outputStats.types[type] = (outputStats.types[type] ?? 0) + 1
	outputStats.lastType = type
	outputStats.lastNote = noteNumber
	outputStats.lastSource = source
	outputStats.lastAt = performance.now()
	outputStats.extra = extra
	debugState.outputs.set(portId, outputStats)
	debugState.totals.output++
	recordMIDISummary()
}

const getMIDINotesForPerson = personIndex => {
	if (!peopleNotes.has(personIndex))
	{
		peopleNotes.set(personIndex, new Map())
	}
	return peopleNotes.get(personIndex)
}

export const getActiveMIDINotesForPerson = personIndex => {
	return getMIDINotesForPerson(personIndex)
}

export const isMIDINoteActive = noteNumber => {
	for (const personNotes of peopleNotes.values())
	{
		if (personNotes.has(noteNumber))
		{
			return true
		}
	}
	return false
}

export const stopWebMIDIForPerson = (person, useSendAllNotesOff = false) => {
	if (!person)
	{
		return false
	}

	const personNotes = getMIDINotesForPerson(person.playerNumber)
	if (!personNotes)
	{
		return false
	}

	const multiplePeople = person.playerNumber > -1
	const multipleMIDIDevices = WebMidi.outputs.length > 1
	const useDedicatedMIDIDevicePerPerson = multiplePeople && multipleMIDIDevices
	const dedicatedOutput = useDedicatedMIDIDevicePerPerson ?
		WebMidi.outputs[person.playerNumber] ?? WebMidi.outputs[0] :
		null
	const outputs = useDedicatedMIDIDevicePerPerson ?
		[dedicatedOutput].filter(Boolean) :
		WebMidi.outputs

	personNotes.forEach((note, noteNumber) => {
		outputs.forEach(output => {
			recordMIDIOutputDebug(output, "noteoff", noteNumber, 'stopWebMIDIForPerson', {
				personNumber: person.playerNumber
			})
			sendGuardedMIDIOutput(output, 'stopNote', noteNumber, { release: 0.2 }, 'stopWebMIDIForPerson')
		})
	})

	if (useSendAllNotesOff)
	{
		outputs.forEach(output => {
			recordMIDIOutputDebug(output, "allnotesoff", 'all', 'stopWebMIDIForPerson', {
				personNumber: person.playerNumber
			})
			stopActiveMIDIOutputNotes(output, 'stopWebMIDIForPerson-allnotesoff')
		})
	}

	personNotes.clear()
	return true
}

/**
 * On every frame 
 * @param {Person} person 
 * @param {[Person]} people 
 */
export const updateWebMIDIWithPerson = ( person, people, activeAudioOutput, previouslyActiveAudioOutput ) => {

	if (!activeAudioOutput)
	{
		// note requested but 
		return
		//throw Error("Cannot send to MIDI empty activeAudioOutput")
	}

	// If there are MULTIPLE MIDI devices and MULTIPLE PEOPLE
	// we need to send the MIDI to the correct channel
	// NB. We send the MIDI to ALL devices but have 4 different channels
	// that are 1-4
	const multiplePeople = people.length > 1
	const multipleMIDIDevices = WebMidi.outputs.length > 1
	const useDedicatedMIDIDevicePerPerson = multiplePeople && multipleMIDIDevices
	const dedicatedOutput = useDedicatedMIDIDevicePerPerson ?
		WebMidi.outputs[person.playerNumber] ?? WebMidi.outputs[0] :
		null

	// we have old notes and new notes
	// const previous = person.activeNotes.get( person.lastNoteNumber )
	// const existing = person.activeNotes.get( person.noteNumber )
	// const hasJustFinished = !existing && activeAudioOutput.length > 0
	
	// console.info("midi mediator", { hasJustFinished, activeAudioOutput, existing, previouslyActiveAudioOutput } , person.activeNotes ) 
	
	// Send a single note off
	// const stop = (noteNumber) => {
	// 	console.info("MIDI:STOP",noteNumber)
	// 	if (oneMIDIDevicePerPerson)
	// 	{
	// 		const midiOutputDevice = WebMidi.outputs[person.playerNumber]
	// 		// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})				// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
	// 		// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
	// 		midiOutputDevice.stopNote( noteNumber ) 

	// 	}else if (multipleMIDIDevices){

	// 		WebMidi.outputs.forEach(MIDIoutput =>{
	// 			const midiOutputDevice = MIDIoutput.channels[person.playerNumber+1]
	// 			midiOutputDevice && midiOutputDevice.stopNote( noteNumber ) 
	// 		})

	// 	}else{
			
	// 		WebMidi.outputs.forEach(MIDIoutput =>{
	// 			MIDIoutput.stopNote( noteNumber )
	// 			// console.info("MIDI updated stopNote",  MIDIoutput, activeAudioOutput )
	// 		})
	// 	}	
	// }

	/**
	 * Note ON / Note OFF
	 * @param {Object} note 
	 * @param {String} method (playNote / stopNote)
	 */
	const handleNote = (note, method="playNote")=>{		
		
		if (useDedicatedMIDIDevicePerPerson)
		{
			const personNotes = getMIDINotesForPerson( person.playerNumber )
			switch(method)
			{
				case "playNote":
					personNotes.set( note.noteNumber, note )
					// console.log("playNote oneMIDIDevicePerPerson", note, midiOutputDevice, personNotes )
					break
				case "stopNote":
					personNotes.delete( note.noteNumber )
					// console.log("stopNote oneMIDIDevicePerPerson", note, midiOutputDevice, personNotes )
					break
			}

			if (dedicatedOutput){
				const velocity = dedicatedOutput.name === ROLI_PIANO ? 1 : person.noteVelocity
				recordMIDIOutputDebug(dedicatedOutput, method, note.noteNumber, 'updateWebMIDIWithPerson-dedicated', {
					personNumber: person.playerNumber,
					state: person.state,
					velocity
				})
				sendGuardedMIDIOutput(dedicatedOutput, method, note.noteNumber, {attack:velocity}, 'updateWebMIDIWithPerson-dedicated')
			}

		}else{
			WebMidi.outputs.forEach(MIDIoutput =>{
				const personNotes = getMIDINotesForPerson( person.playerNumber )
				switch(method)
				{
					case "playNote":
						personNotes.set( note.noteNumber, note )
						// console.log("playNote all", note, MIDIoutput, personNotes )
						break
					case "stopNote":
						personNotes.delete( note.noteNumber )
						// console.log("stopNote all", note, MIDIoutput, personNotes )
						break
				}

				const velocity = MIDIoutput.name === ROLI_PIANO ? 1 : person.noteVelocity
				recordMIDIOutputDebug(MIDIoutput, method, note.noteNumber, 'updateWebMIDIWithPerson-all', {
					personNumber: person.playerNumber,
					state: person.state,
					velocity
				})
				sendGuardedMIDIOutput(MIDIoutput, method, note.noteNumber, {attack:velocity}, 'updateWebMIDIWithPerson-all')

				
				// console.info("MIDI updated handleNote", MIDIoutput, activeAudioOutput )
				// MIDIoutput.playNote( person.noteNumber, {attack:person.noteVelocity} ) 
			})
		}
	}

	// GAH: ROLI Piano does *not* have working allNotesOff so we have to do it ourselves
	// by caching all notes requested and then turning them off sequentially
	const stopAll = ( useSendAllNotesOff=false ) => {
		//console.info("update web midi with no audio?", audioOutput )
		if (useSendAllNotesOff)
		{
			stopWebMIDIForPerson(person, true)
		}else{
			const personNotes = getMIDINotesForPerson( person.playerNumber )
			personNotes.forEach((note, noteNumber)=>{
				handleNote( note, "stopNote" )
				personNotes.delete( noteNumber )
			})
		}
	}


	// no audio to play... stop all
	// if (!activeAudioOutput)
	// {
	// 	stopAll()
	// 	return
	// }

	switch(person.state)
	{
		case STATE_INSTRUMENT_ATTACK: {
			const personNotes = getMIDINotesForPerson(person.playerNumber)
			const nextNotes = new Map(activeAudioOutput.map(note => [note.noteNumber, note]))

			personNotes.forEach((note, noteNumber) => {
				if (!nextNotes.has(noteNumber))
				{
					handleNote(note, "stopNote")
				}
			})

			nextNotes.forEach((note, noteNumber) => {
				if (!personNotes.has(noteNumber))
				{
					handleNote(note)
				}
			})
			break
		}

		// Notes stay active through sustain/pitch-bend until release/silent.
		case STATE_INSTRUMENT_SUSTAIN:
		case STATE_INSTRUMENT_PITCH_BEND:
			break

		case STATE_INSTRUMENT_RELEASE:
		case STATE_INSTRUMENT_SILENT:
			stopAll()
			break
	}
}
