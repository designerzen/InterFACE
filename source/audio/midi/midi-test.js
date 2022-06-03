import { loadMIDIFile } from './midi-file-load'

// import midiFileFrontieres from '../../assets/audio/midi_midi-sans-frontieres.mid'
// import midiFileNyanCat from '../../assets/audio/midi_nyan-cat.mid'

export const loadMIDI = async () => {
	console.error("Loading Test MIDI file...")
	const nyan = await loadMIDIFile( "./assets/audio/midi_nyan-cat.mid" )
	console.error("Loaded MIDI file", nyan )
	
	return nyan
}
