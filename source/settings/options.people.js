import { INSTRUMENT_TYPE_SOUNDFONT } from "../audio/instrument-list"
import { TUNING_MODE_NAMES } from "../audio/tuning/scales"
import { INSTRUMENT_PACK_OPEN_SF } from "./options.instruments"
import { DEFAULT_COLOURS } from "./palette"

// NB. These must align with the button names
// 		in the DOM when the app is launched
export const NAMES = ['⯀','▲','⬣','◉'] // ♥︎
// export const NAMES = ['I','II','III','IV']

export const IDENTIFIERS = ['a','b','c','d'].map( m => `person-${m}` )


export const EYE_COLOURS = ['blue','green','brown','orange']

export const DEFAULT_VOICE_OPTIONS = {
	yaw:0, pitch:0, roll:0,
	hue:90,
	lipPercentage:0,
	eyeDirection:0,
	octave:4,
	note:-1,
	noteName:'',
	volume:0,
	singing:false,
	isMouthOpen:false,
	active:false
}

export const DEFAULT_PERSON_OPTIONS = {
	...DEFAULT_COLOURS,

	musicTheory:false,

	// Passed to the delay node
	// NB. There is a global delay too remember
	useDelay:false,
	delayTime: 0.14,
	delayLength: 10,

	// left / right ear stereo panning
	stereoPan:true,

	// use eyebrows to control pitch bending
	pitchBend:true,

	// saved BPM that can be shared
	bpm:90,

	// scale is confusing as it can mean visual audio or physical
	tuning:TUNING_MODE_NAMES[0],

	// add a dynamic comp
	// limiter:true,

	// record data for each Person for use later in playback
	// and as a performance - NB. this *will* impact performance
	recordData:false,

	// send out MIDI per person...
	// see instrument-midi
	sendMIDI:true,

	// if you want the axis to be switched
	swapControls:false,

	// Here we bind which model variables is assigned to
	// which audio selection mechanism.
	// can be 'gazeHorizontal', 'pitch', 'roll', 'yaw'
	// eyeSquintLeft, eyeSquintRight, leftSmirk, rightSmirk, 
	// see models/landmarks
	// noteController:'pitch',		// up down
	// octaveController:'roll',	// lean tilt
	
	noteController:'roll',		// up down
	octaveController:'pitch',	// lean tilt

	gateController:'mouth',

	pitchbendController:'leftSmirk',
	aftertouchController:'rightSmirk',
	// minorController:'eyebrowsRaisedBy',
	minorController:'isFacingRight',

	stereoController:'eyesHorizontal',
	// eyeSquintLeft, leftSmirk, rightSmirk, 

	fxAController:'happiness',
	fxBController:'eyebrowsRaisedBy',


	// if the user has epilepsy, set to true
	photoSensitive:false,

	// force draw face mesh
	drawMesh:false,
	// force draw face blob nodes
	drawNodes:true,
	// alternate between mesh and blobs depending on mouth
	// NB. The two above will override this behaviour
	meshOnSing:false,

	// all the above can be disabled!
	drawMask:true,

	// draw these parts over the mesh...
	drawMouth:true,
	// kid mode turns eyes googly!
	drawEyes:true,

	// extra controls
	drawEyebrows:false,

	// use the nostrils to alter the sound
	// NB. these are still disabled in media-vision
	// but hopefully will work in the future!
	drawNose:false,

	// ratios of size of eye
	// white bit
	scleraRadius:1,
	// blue bit
	irisRadius:0.8,
	// black bit
	pupilRadius:0.3,
	// frank sidebottom angle
	eyeRatio:0.8,

	// mouse hold for clicking in millseconds 0.5s and more feels weird
	// NB. if you use audioContext timer rather than Performance now then this will need to be 0.4!
	mouseHoldDuration:400,

	// for how many pixels do you have to drag before it becomes a swipe?
	mouseGestureDistance:40,

	// if both eyes are closed for X ms do something...
	eyeShutHolddDuration:2000, // ms

	// how much feedback to apply to the feedback node
	feedback:0.1,

	// to adjust the angle that the head has to roll...
	// larger means less movement required
	rollSensitivity:1.2,

	// to adjust the amount of pitching (head rocking)
	// depending on how complicated the piece is the octaves
	// can also be shifted between a certain range...
	pitchSensitivity:1,

	// size of the mouth to signal activity
	mouthCutOff:0.06,

	// size of the mouth to signal silence
	mouthSilence:0.03,

	// volume smooth rate = smaller means faster fades?
	volumeRate:0.7,

	// which instrument should each person load by default
	// TODO: this is currently set for all users
	// Samples to use for the audio engine INSTRUMENT_PACKS[0]
	instrumentPack:INSTRUMENT_PACK_OPEN_SF,

	// default person instument when a person is create
	// defaultInstrument:INSTRUMENT_TYPE_SAMPLE,
	// defaultInstrument:INSTRUMENT_TYPE_OSCILLATOR,
	defaultInstrument:INSTRUMENT_TYPE_SOUNDFONT,
	// which instrument preset to load?
	defaultPreset:0,

	// this is the amount of decimal places used to smooth the mouth
	// the higher the number the less smooth the output is
	// 1 or 2 should be more than enough
	precision:3,


	// how long vefore we consider the person has left the playing arena
	timeToDie:1000,

	// set this to one of the interpolation methods above
	// IN means that it starts off slowly (prefered)
	// ease:easeInSine // easeInSine // linear
	// ease:easeInQuad // easeInSine // linear
	// ease:easeOutSine // easeInSine // linear

	scale:''
}

export const DEFAULT_CHILD_OPTIONS = {
	...DEFAULT_PERSON_OPTIONS
}

// Per Person Options 
export const DEFAULT_PEOPLE_OPTIONS = [
	{
		...DEFAULT_PERSON_OPTIONS,
		hue:Math.random() * 360
	},
	{
		...DEFAULT_PERSON_OPTIONS,
		hue:Math.random() * 360,
		// Here we bind which model variables is assigned to
		// which audio selection mechanism.
		// can be 'gazeHorizontal', 'pitch', 'roll', 'yaw'
		// eyeSquintLeft, eyeSquintRight, leftSmirk, rightSmirk, 
		// see models/landmarks
		// noteController:'pitch',
		// octaveController:'roll',
		// gateController:'mouth',
		// // minorController:'isFacingRight',
		// minorController:'eyebrowsRaisedBy',

		// pitchbendController:'leftSmirk',
		// aftertouchController:'rightSmirk',
		
		// stereoController:'roll',
		// // stereoController:'eyesHorizontal',
		// // eyeSquintLeft, leftSmirk, rightSmirk, 

		// fxAController:'happiness',
		// fxBController:'eyebrowsRaisedBy'
	},
	{
		...DEFAULT_PERSON_OPTIONS,
		hue:Math.random() * 360
	},
	{
		...DEFAULT_PERSON_OPTIONS,
		hue:Math.random() * 360
	}
]