import { INSTRUMENT_PACK_FATBOY, INSTRUMENT_PACK_FM, INSTRUMENT_PACK_MUSYNGKITE } from './audio/instruments'

export const DEFAULT_OPTIONS = {

	// this allows us to show some extra options if set to true...
	advancedMode:false,
	// initially show the settings panel
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
	// stereo panning with eyes
	stereo:false,
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
	model:"face",
	// sample set
	instrumentPack:INSTRUMENT_PACK_FATBOY,
	instrumentPacks:[INSTRUMENT_PACK_FATBOY, INSTRUMENT_PACK_FM, INSTRUMENT_PACK_MUSYNGKITE].join(","),
	// global mode that get's passed into person too
	photoSensitive: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches || false
}

// For kid friendly versions with big eyes, no scary overlays and 
// simpler buttons and fewer controls and settings
export const KIDS_OPTIONS = {
	...DEFAULT_OPTIONS ,
	advancedMode:false,
	text:false,
	masks:false,
}

// simpler buttons and fewer controls and settings
export const BODY_OPTIONS = {
	...DEFAULT_OPTIONS ,
	// model:'hand'
	backingTrack:true
}

// simpler buttons and fewer controls and settings
export const DANCE_OPTIONS = {
	...DEFAULT_OPTIONS ,
	// model:'hand'
	instrumentPack:INSTRUMENT_PACK_MUSYNGKITE,
	instrumentPacks:[INSTRUMENT_PACK_MUSYNGKITE].join(",")
}


// NB. These must align with the button names
// 		in the DOM when the app is launched
export const NAMES = ['a','b','c','d'].map( m => `person-${m}` )

export const getFactoryDefaults = ( options=DEFAULT_OPTIONS ) => Object.assign( {}, options )

export const getDomainDefaults = (name) => {

	switch(name.toLowerCase())
	{
		// localhost 127.0.0.(1)
		// case 'localhost': 
		// case '1': return getFactoryDefaults(KIDS_OPTIONS)
		
		case 'lol': return getFactoryDefaults(KIDS_OPTIONS)
		case 'band': return getFactoryDefaults()
		case 'dance': return getFactoryDefaults(DANCE_OPTIONS)
		// defaults to interface.place
		default: return getFactoryDefaults()
	}
}