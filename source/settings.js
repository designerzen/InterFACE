import { DEFAULT_COLOURS } from './palette'
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad, easeOutQuint, easeInQuad} from "./maths/easing"

const isDevelopmentMode = process.env.NODE_ENV === "development"

// Actual file names of the json data files in assets/audio
const INSTRUMENT_DATA_PACK_FM = "fluid"
const INSTRUMENT_DATA_PACK_FATBOY = "fatboy"
const INSTRUMENT_DATA_PACK_MUSYNGKITE = "musyng"

// Names set by pack authors
export const INSTRUMENT_PACK_FM = "FluidR3_GM"
export const INSTRUMENT_PACK_FATBOY = "FatBoy"
export const INSTRUMENT_PACK_MUSYNGKITE = "MusyngKite"

// Sound font settings 
export const SOUNDFONT_FM_JS = {
	title:INSTRUMENT_PACK_FM,
	filename:`${INSTRUMENT_DATA_PACK_FM}.js`,
	location:"./"
}

export const SOUNDFONT_FM_JSON = {
	title:INSTRUMENT_PACK_FM,
	filename:`${INSTRUMENT_DATA_PACK_FM}.json`,
	location:"./assets/audio/"
}

export const SOUNDFONT_FATBOY_JS = {
	title:INSTRUMENT_PACK_FATBOY,
	filename:`${INSTRUMENT_DATA_PACK_FATBOY}.js`,
	location:"./assets/audio/"
}

export const SOUNDFONT_FATBOY_JSON = {
	title:INSTRUMENT_PACK_FATBOY,
	filename:`${INSTRUMENT_DATA_PACK_FATBOY}.json`,
	location:"./assets/audio/"
}

export const SOUNDFONT_MUSYNGKITE_JS = {
	title:INSTRUMENT_PACK_MUSYNGKITE,
	filename:`${INSTRUMENT_DATA_PACK_MUSYNGKITE}.js`,
	location:"./assets/audio/"
}

export const SOUNDFONT_MUSYNGKITE_JSON = {
	title:INSTRUMENT_PACK_MUSYNGKITE,
	filename:`${INSTRUMENT_DATA_PACK_MUSYNGKITE}.json`,
	location:"./assets/audio/"
}


// https://www.midi.org/specifications-old/item/manufacturer-id-numbers
export const MIDI_ID = "00H 21H 71H"


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
	outputFacialTransformationMatrixes: true
}

export const DEFAULT_TENSORFLOW_OPTIONS = {
	
	// or 'tfjs' (mediapipe is far smoother and gives us handy annotations)
	runtime: 'mediapipe', 
	// runtime: 'tfjs', 

	// location of actual ML model
	// solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
	// solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
	solutionPath: './@mediapipe/',

	// maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
	// maxFaces:1,
	
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
	// cancel audio playback (not midi)
	muted:false,
	// dual person mode (required reload)
	duet:false,
	players:1,
	
	// FIXME: monophonic?
	stereo:true,

	// stereo panning with eyes
	stereoPan:true,

	// FIXME:
	// DEFAULT midi channel (0/"all" means send to all)
	midiChannel:"all",

	// saved BPM that can be shared?
	bpm:200,
	
	// hide menu if mouse outside of screen...
	autoHide:!isDevelopmentMode,

	// load a midi track automatically on app start
	loadMIDIPerformance:false,

	// allow game pads such as the xbox controller to do cool
	// stuff as a modifier for the audio
	useGamePad:true,
	
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

	// use the LTD 
	switch(name.split('.').pop().toLowerCase())
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
	mouthOpen:false,
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

	// // add a dynamic comp
	// limiter:true,

	// send out MIDI per person...
	// see Instrument.MIDI
	sendMIDI:true,

	// if you want the axis to be switched
	swapControls:false,

	// Here we bind which model variables is assigned to
	// which audio selection mechanism.
	// can be 'gazeHorizontal', 'pitch', 'roll', 'yaw'
	// eyeSquintLeft, eyeSquintRight, leftSmirk, rightSmirk, 
	// see models/landmarks
	noteController:'pitch',
	octaveController:'roll',
	gateController:'mouth',

	pitchbendController:'leftSmirk',
	aftertouchController:'rightSmirk',

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

	// mouse hold for clicking in seconds 0.5 and more feels weird
	mouseHoldDuration:0.4,

	// for how many pixels do you have to drag before it becomes a swipe?
	mouseGestureDistance:40,

	// if both eyes are closed for X ms do something...
	eyeShutHolddDuration:1500, // ms

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
	mouthCutOff:0.1,

	// size of the mouth to signal silence
	mouthSilence:0.05,

	// volume smooth rate = smaller means faster fades?
	volumeRate:0.7,

	// Samples to use for the audio engine INSTRUMENT_PACKS[0]
	//instrumentPack:INSTRUMENT_PACK_MUSYNGKITE,
	instrumentPack:INSTRUMENT_PACK_MUSYNGKITE,

	// this is the amount of decimal places used to smooth the mouth
	// the higher the number the less smooth the output is
	// 1 or 2 should be more than enough
	precision:3,

	// set this to one of the interpolation methods above
	// IN means that it starts off slowly (prefered)
	// ease:easeInSine // easeInSine // linear
	// ease:easeInQuad // easeInSine // linear
	ease:easeOutSine // easeInSine // linear
}


export const DEFAULT_CHILD_OPTIONS = {
	...DEFAULT_PERSON_OPTIONS
}

