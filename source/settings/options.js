
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

	// track face movements
	trackFace:true,

	// track hand movements
	trackHands:true,
	
	// read out important instructions
	// NB. OFF by default
	speak:false,
	
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
	midiRelay:false,

	// Do we augment the MIDI messages with additional notes
	// based on the user's current mood
	midiSympathiser:true,

	// Should a person send out MIDI events?
	// NB. if this is true and sympathiser is true, you can get
	// infinite loops
	midiControl:true,

	// allow midi input to control stuff too
	midiInput:true,

	// if there is a midi clock incoming, replace the
	// internal clock with it
	midiClock:false,

	// allow MIDI to control onboard synth
	midiOnboard:true,

	// DEFAULT midi channel (0/"all" means send to all)
	midiChannel:"all",

	// Do not make any internal noise - only augment
	// the midi inputs. Ignore the internal playing and 
	// just use expressions to augment mdi ins
	midiOnly:false,

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
	qr:false,

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