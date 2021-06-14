const DEFAULT_OPTIONS = {

	// this allows us to show some extra options if set to true...
	advancedMode:false,

	showSettings:false,
	// play a constant beat
	metronome:false,
	// play music at same time
	backingTrack:false,
	// clear canvas every frame (if transparent will be ignored)
	clear:true,
	// should canvas be transparent to let video bleed through?
	transparent:true,
	// draw video onto canvas every frame (transparent doesn't have to be true then)
	synch:true,
	// show debug texts
	debug:process.env.NODE_ENV === "development",
	// cancel audio playback (not midi)
	muted:false,
	// dual person mode (required reload)
	duet:false,
	// show face overlays
	masks:true,
	// show eye tracking
	eyes:true,
	// synchronise the beats with metronome
	quantise:true,
	// show the person's texts above them
	text:true,
	// audio visualiser is actually helpful to play
	spectrogram:true,
	// read out important instructions
	speak:true,
	// midi channel (0/"all" means send to all)
	midiChannel:"all",
	// saved BPM that can be shared?
	bpm:120,
	// choice of different models to use
	model:"face"
}

// NB. These must align with the button names
// 		in the DOM when the app is launched
export const NAMES = ['a','b','c'].map( m => `person-${m}` )

export const getFactoryDefaults = () => {
	return Object.assign( {}, DEFAULT_OPTIONS )
}