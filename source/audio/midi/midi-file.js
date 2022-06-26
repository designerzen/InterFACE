/**
 * Single gateway to Webworker versions of the MIDI stuff
 */
import MidiTrack from "./midi-track"

const createWorker = () => new Worker(
	new URL('./midi-file-load.worker.js', import.meta.url),
	{type: 'module'}
)

export const loadMIDIFile = (url, options) => new Promise( (resolve,reject)=>{
	
	try{
		const midiWorker = createWorker()
		midiWorker.onmessage = (e) => {
			// This comes through stripped of prototypes
			const data = e.data
			console.error("MIDI:Worker loadMIDIFile", {e, data, url, options})
			const track = new MidiTrack(null, data.midi)
			resolve(track)
		}
		midiWorker.postMessage({command:"loadMIDIFile", url, options })
	
	}catch(error){
		reject("Could not access module")
	}
})

// FIXME: The url can be a File
export const loadMIDIFileThroughClient =  (url, options) => new Promise( (resolve,reject) => {

	console.error("loadMIDIFileThroughClient", url )

	try{
		const midiWorker = createWorker()
		midiWorker.onmessage = (e) => {
			const data = e.data
			console.error("MIDI:Worker loadMIDIFileThroughClient", {e, data})
			const track = new MidiTrack(null, data.midi)
			resolve( track )
		}
		console.error("loadMIDIFileThroughClient", {midiWorker} )

		midiWorker.postMessage({command:"loadMIDIFileThroughClient", url, options })		

	}catch(error){
		reject("Could not access module")
	}
})
