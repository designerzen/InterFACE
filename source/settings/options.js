
import { DEFAULT_COLOURS } from './palette'
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad, easeOutQuint, easeInQuad} from "../maths/easing"
import { isProductionBuild } from '../utils/is-production'

// sample string
// import { INSTRUMENT_PACK_FATBOY, INSTRUMENT_PACK_FM, INSTRUMENT_PACK_MUSYNGKITE, INSTRUMENT_PACK_OPEN_SF } from './options.instruments.js'
import { INSTRUMENT_PACK_OPEN_SF } from './options.instruments.js'
import { TUNING_MODE_IONIAN, TUNING_MODE_NAMES } from '../audio/tuning/scales.js'
import { INSTRUMENT_TYPE_OSCILLATOR, INSTRUMENT_TYPE_SOUNDFONT } from '../audio/instrument-list.js'

// INSTRUMENT_TYPE_SOUNDFONT

const isDevelopmentMode = !isProductionBuild()

export const MAX_CANVAS_WIDTH = 1080

// after X amount of frames we move the face button
export const UPDATE_FACE_BUTTON_AFTER_FRAMES = 750

// timeout for loading as there are some issues with continuation...
export const LOAD_TIMEOUT = 5 * 60 * 1000 // 5 minutes

// https://www.midi.org/specifications-old/item/manufacturer-id-numbers
export const MIDI_ID = "00H 21H 71H"

export const BROADCAST_KEY = "photosynth"

/**
Option Name 						Description 	Type 	Default
running_mode 						Sets the running mode for the task. There are two modes: IMAGE: The mode for single image inputs. / VIDEO: The mode for decoded frames of a video or on a livestream of input data, such as from a camera. 	{IMAGE, VIDEO} 	IMAGE
numFaces 							The maximum number of faces that can be detected by the the FaceLandmarker. Smoothing is only applied when num_faces is set to 1. 	Integer > 0 	1
minFaceDetectionConfidence 			The minimum confidence score for the face detection to be considered successful. 	Float [0.0,1.0] 	0.5
minFacePresenceConfidence 			The minimum confidence score of face presence score in the face landmark detection. 	Float [0.0,1.0] 	0.5
minTrackingConfidence 				The minimum confidence score for the face tracking to be considered successful. 	Float [0.0,1.0] 	0.5
outputFaceBlendshapes 				Whether Face Landmarker outputs face blendshapes. Face blendshapes are used for rendering the 3D face model. 	Boolean 	False
outputFacialTransformationMatrixes 	Whether FaceLandmarker outputs the facial transformation matrix. FaceLandmarker uses the matrix to transform the face landmarks from a canonical face model to the detected face, so users can apply effects on the detected landmarks. 	Boolean 	False
 */
// https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js
export const DEFAULT_TASKS_VISION_OPTIONS = {
	
	// runningMode: "IMAGE" | "VIDEO"
	runningMode:"VIDEO",
	
	// numFaces 	The maximum number of faces that can be detected by the the FaceLandmarker. Smoothing is only applied when num_faces is set to 1. 	Integer > 0 	1
	numFaces: 1,
	
	// minFaceDetectionConfidence 	The minimum confidence score for the face detection to be considered successful. 	Float [0.0,1.0] 	0.5
	// minFacePresenceConfidence 	The minimum confidence score of face presence score in the face landmark detection. 	Float [0.0,1.0] 	0.5
	// minTrackingConfidence 	The minimum confidence score for the face tracking to be considered successful. 	Float [0.0,1.0] 	0.5
	
	// Whether Face Landmarker outputs face blendshapes. Face blendshapes are used for rendering the 3D face model. 	Boolean 	False
	outputFaceBlendshapes :true,
	
	// Whether FaceLandmarker outputs the facial transformation matrix.
	// FaceLandmarker uses the matrix to transform the face landmarks from 
	// a canonical face model to the detected face, so users can apply 
	// effects on the detected landmarks.
	outputFacialTransformationMatrixes: true,


	// selfieMode: true,
	// enableFaceGeometry: false,
	
	// confidence in predictions
	minFaceDetectionConfidence: 0.5,
	minFacePresenceConfidence: 0.5,
	minTrackingConfidence: 0.5
}

export const DEFAULT_TENSORFLOW_OPTIONS = {
	
	// or 'tfjs' (mediapipe is far smoother and gives us handy annotations)
	runtime: 'mediapipe', 
	// runtime: 'tfjs', 

	// location of actual ML model
	// solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
	// solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
	solutionPath: './@mediapipe/',

	// maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 1.
	maxFaces:4,
	
	// Whether to load the MediaPipe iris detection model (an additional 2.6 MB of weights). The MediaPipe iris detection model provides (1) an additional 10 keypoints outlining the irises and (2) improved eye region keypoints enabling blink detection. Defaults to true.
	// shouldLoadIrisModel:true,
	
	// Minimum detection Confidence - Threshold for discarding a prediction. 
	// [0 - 1] for a face to be considered detected
    // detectionConfidence: 0.9,
    
    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    // minTrackingConfidence: 0.5

	// maxContinuousChecks - How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
	// iouThreshold - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3. A score of 0 means no overlapping faces will be detected, whereas a score closer to 1 means the model will attempt to detect completely overlapping faces.
	// scoreThreshold - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75. Increase this score in order to reduce false positives (detects fewer faces).
	// modelUrl - Optional param for specifying a custom facemesh model url or a tf.io.IOHandler object.
	// irisModelUrl - Optional param for specifying a custom iris model url or a tf.io.IOHandler object.

	// send out normalised bits of face too
	// NB. this we handle ourselves
	refineLandmarks: true,

	triangulateMesh: false,

	boundingBox: true,

	backEnds:[
		// 'cpu',
		'wasm',
		'webgl'
	]
	,
	...DEFAULT_TASKS_VISION_OPTIONS
}

export const DEFAULT_OPTIONS = {

	display:DISPLAY_MEDIA_VISION_2D,
	// display:DISPLAY_LOOKING_GLASS_3D,

	// do we show the tooltips overlaid on when hovering
	tooltips:true,

	// this allows us to show some extra options if set to true...
	advancedMode:true,
	// initially show the settings panel
	showSettings:false,
	// overlaid screen keyboard
	showPiano:false,

	// play a constant beat
	metronome:false,
	// play music at same time
	backingTrack:false,

	// clear the canvas on every frame
	// also doubles as a video hider
	clear:false,
	// draw video onto canvas every frame (transparent doesn't have to be true then)
	// clear will always take precedence
	synch:true,
	// start in MTV disco mode
	disco:false,


	// AR mode (without this - just video stream or blank)
	overlays:true,

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
	
	// show debug texts
	debug:isDevelopmentMode,
	
	// show the statistics panel overlay!
	stats:isDevelopmentMode,

	// cancel audio playback (not midi)
	muted:false,

	// better than using "duet" or whatever - we just specify players
	players:1,
	
	// FIXME: monophonic?
	stereo:true,

	// stereo panning with eyes
	stereoPan:true,

	// FIXME:
	midi:true,

	// The MIDI relay option will send any MIDI messages received back out
	// to all the channels specified - this can cause infinite loops if misused
	midiRelay:true,

	// Do we augment the MIDI messages with additional notes
	// based on the user's current mood
	midiSympathiser:true,

	// Should a person send out MIDI events?
	// NB. if this is true and sympathiser is true, you can get
	// infinite loops
	midiControl:true,

	// allow midi input to control stuff too
	midiInput:false,
	midiClock:false,

	// DEFAULT midi channel (0/"all" means send to all)
	midiChannel:"all",

	// size of the stars / blobs that overlay the face
	starSize:1,
	
	// hide menu if mouse outside of screen...
	autoHide:!isDevelopmentMode,

	// load a midi track automatically on app start
	loadMIDIPerformance:false,

	// allow game pads such as the xbox controller to do cool
	// stuff as a modifier for the audio
	gamePad:true,

	// choice of different models to use
	model:"face",

	// show the QR code all the time
	// and update when settings change?
	qr:true,

	// send out the clock to other tabs and windows
	broadcast:true,

	// time before we consider the user inactive
	timeout:2000,

	// what theme to show on screen
	theme:"theme-default",

	// TODO: sample set
	instrumentPack:INSTRUMENT_PACK_OPEN_SF,
	// instrumentPacks:[
	// 	INSTRUMENT_PACK_OPEN_SF,
	// 	// INSTRUMENT_PACK_FATBOY,
	// 	// INSTRUMENT_PACK_FM, 
	// 	// INSTRUMENT_PACK_MUSYNGKITE
	// ].join(","),

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
	theme:"theme-friendly"
}

// simpler buttons and fewer controls and settings
export const BODY_OPTIONS = {
	...DEFAULT_OPTIONS ,
	// model:'hand'
	backingTrack:true,
	theme:"theme-high-contrast"
}

// simpler buttons and fewer controls and settings
export const DANCE_OPTIONS = {
	...DEFAULT_OPTIONS ,
	players:4,
	theme:"theme-neon"
}

// simpler buttons and fewer controls and settings
export const BAND_OPTIONS = {
	...DEFAULT_OPTIONS ,
	players:4,
	theme:"theme-neon"
}

export const IDENTIFIERS = ['a','b','c','d'].map( m => `person-${m}` )

// NB. These must align with the button names
// 		in the DOM when the app is launched
export const NAMES = ['⯀','▲','⬣','◉']
// export const NAMES = ['I','II','III','IV']


export const getFactoryDefaults = ( options=DEFAULT_OPTIONS ) => Object.assign( {}, options )

export const getDomainDefaults = (name = '') => {

	// use the LTD 
	switch(name.split('.').pop().toLowerCase())
	{
		// For testing dev : localhost 127.0.0.(1)
		// case 'localhost': 
		// case '1': return getFactoryDefaults(KIDS_OPTIONS)
		case 'lol': return getFactoryDefaults(KIDS_OPTIONS)
		case 'band': return getFactoryDefaults(BAND_OPTIONS)
		case 'dance': return getFactoryDefaults(DANCE_OPTIONS)

		// defaults to interface.place
		// default: return getFactoryDefaults()
	}

	return getFactoryDefaults()
}

import INSTRUMENTS_LIST_LOCATION from "raw:./instruments.json"
// import INSTRUMENTS_LIST_LOCATION from "url:./instruments.json"
import { DISPLAY_MEDIA_VISION_2D } from '../display/display-types.js'
import { INSTRUMENT_TYPE_SOUNDFONT } from '../audio/instrument-list.js'
// console.error("INSTRUMENTS_LIST_LOCATION", INSTRUMENTS_LIST_LOCATION)
export const INSTRUMENT_OPTIONS = {
	list:INSTRUMENTS_LIST_LOCATION
}



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
	drawEyebrows:true,

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
		noteController:'pitch',
		octaveController:'roll',
		gateController:'mouth',
		// minorController:'isFacingRight',
		minorController:'eyebrowsRaisedBy',

		pitchbendController:'leftSmirk',
		aftertouchController:'rightSmirk',
		
		stereoController:'roll',
		// stereoController:'eyesHorizontal',
		// eyeSquintLeft, leftSmirk, rightSmirk, 

		fxAController:'happiness',
		fxBController:'eyebrowsRaisedBy'
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