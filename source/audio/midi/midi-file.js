/**
 * Single gateway to Webworker versions of all the MIDI file stuff
 */
import { fetchMIDIFileData, fetchMIDIFileThroughClient, loadRawFile } from "./midi-file-load"
import MidiTrack from "./midi-track"

const createWorker = () => new Worker(
	new URL('./midi-file-load.worker.js', import.meta.url),
	{type: 'module'}
)

const sanitiseTitle = (name) => {
	return (name).split(".mid")[0].replace("_", " ")
}

/**
 * Load in a MIDI file from a URL
 * @param {String} midiFileData - location of the MIDI file or the raw data
 * @param {Object} options - optional settings
 * @returns {MIDITrack}
 */
export const loadMIDIFile =  (midiFileData, options, progressCallback) => new Promise( async (resolve,reject)=>{
	
	// defaults 
	options = { 
		command:"loadMIDIFile", 
		// FIXME:
		useWorker:false, 
		...options 
	}

	try{

		if (!options.useWorker)
		{
			const midi = await fetchMIDIFileData( midiFileData, options, progressCallback )
			// console.error("MIDI:loaded", {url: midiFileData, options, midi})
			resolve(midi)

		}else{
			
			let midiWorker = createWorker()
			midiWorker.onmessage = (e) => {
				// This comes through stripped of prototypes
				const data = e.data
				// console.error("MIDI:Worker loadMIDIFile", {e, data, url: midiFileData, options})
				const track = new MidiTrack(null, data.midi)
				midiWorker.terminate()
				midiWorker = null
				resolve(track)
			}
			midiWorker.onmessage = (event) => {
				reject(event.error)
			}
			midiWorker.postMessage({command:options.command, url: midiFileData, options })	
		}
	
	}catch(error){
		reject("Could not access module : "+error)
	}
})

/**
 * The url can be a File...
 * @param {File} file 
 * @param {Object} options 
 * @param {Function} progressCallback 
 * @returns 
 */
export const loadMIDIFileThroughClient =  async (file, options, progressCallback) => {
	options = { 
		command:"loadMIDIFileThroughClient", 
		trackName:sanitiseTitle(file.name),
		...options
	}
	const rawFile = await loadRawFile( file, progressCallback, options.useBase64 || false )
	return await loadMIDIFile( rawFile, options, progressCallback)
}

/**
 * You can pass this any type of data and it will attempt it's best to
 * determine the type of MIDI it was passed and load it in accordingly
 * 
 * @param {Mixed} midiFileData 
 * @param {Object} options 
 * @param {Function} progressCallback 
 * @returns {MidiTrack}
 */
export const loadMIDI = async( midiFileData, options, progressCallback) => {
	
	const type = typeof midiFileData
	// console.error("Loading MIDI", type, midiFileData)

	switch (type)
	{
		case "string":
			// URL to a midi file... or a base 64 file...
			return await loadMIDIFile( midiFileData, options, progressCallback)
	
		case "file":
		case "object":
			if ( midiFileData instanceof File)
			{
				// File pointer to a midi file
				return await loadMIDIFileThroughClient( midiFileData, options, progressCallback)
			}
			// ???
			return await loadMIDIFile( midiFileData, options, progressCallback)
			
		default:
			throw Error("Could not determine this type of file - are you sure it is MIDI?")
	}
}