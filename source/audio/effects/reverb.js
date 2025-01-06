/**
 * inspired by https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/drum-machine/main.js
 */

import { easeInCubic, easeInExpo, easeOutSine, linear } from '../../maths/easing'
import { generateBrownNoise, generatePinkNoise, generateWhiteNoise } from '../../maths/noise'
import {changeParameter} from './effect'
 
// const compressor = new DynamicsCompressorNode(audioContext)
// const convolver = new ConvolverNode(audioContext, {buffer: irBuffer})
// const reverbGain = new GainNode(audioContext, {gain: 0.25})
// compressor.connect(audioContext.destination)
// convolver.connect(reverbGain).connect(audioContext.destination)
// compressor.connect(convolver)

// try to use offline audio context if available
const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext

export const DIRS = [ 'EMT140-Plate' , 'Voxengo' ]
const SAMPLE_PLAYLIST = `sampled.instrument.json`

// local path
const ACOUSTICS_IMPULSE_FILTERS_DIR = './assets/audio/acoustics/'	

export const REVERB_PATHS = DIRS.map( dir => `${ACOUSTICS_IMPULSE_FILTERS_DIR}${dir}/${SAMPLE_PLAYLIST}` )

let impulses
let impulseCounter = 0

/**
 * Random number between -1 -> 1
 * @returns {Number} between -1 and 1
 */
const getRandomFloat = () => Math.random() * 2 - 1

// Cache wherever applicable...
const loadedImpulseLists = {}
export const loadImpulseJSON = async (directory) => {
	if (loadedImpulseLists[directory])
	{
		return loadedImpulseLists[directory]
	}

	const jsonData = await fetch(`${ACOUSTICS_IMPULSE_FILTERS_DIR}${directory}/${SAMPLE_PLAYLIST}`)
	// ensure it is JSON...
	const json = await jsonData.json()
	
	loadedImpulseLists[directory] = json.files.map( item => `${ACOUSTICS_IMPULSE_FILTERS_DIR}${directory}/${item}` )
	return loadedImpulseLists[directory]
}

export const loadImpulseList = async ( dirs = DIRS ) => {
	// console.error({path, dir, sampleFile: SAMPLE_PLAYLIST})
	
	
		// const response = await fetch("./assets/audio/acoustics/reverbs.csv")
		// const table = await response.text()
		// const impulseList = table.split("\r")

		// console.error({path, dir, sampleFile: SAMPLE_PLAYLIST, impulseList})

		const output = dirs.map( async (dir) => {
			const files = await loadImpulseJSON(dir, dir)
			// console.error(files, dir)
			return files
		}) 

		const filePaths = [].concat(...output)

		// console.error(dirs, output, filePaths)
		return filePaths
	try{
		// const filePath = `${path}${dir}`
		const files = []
		// console.error( {impulseList, filePath} )
	
		console.error("files",files)
		

		return files
		// impulseList.map( item => `${filePath}${item}` )//.push(`./assets/audio/ir-hall.mp3`)

	}catch(error){
		throw Error("Impule List Load Failed "+ error)
	}
}

// Grab the list as an array to feed into the system
export const getImpulseList = async () => {
	// lazy load the list
	if (!impulses)
	{
		try{
			impulses = await loadImpulseList()	
			return impulses

		}catch(error){

			console.error({impulses})
		}

	}else{
		return impulses
	}
} 

// Fetch a random reverb :)
export const randomReverb = async () =>{
	try{
		const reverbs = await getImpulseList()
		return reverbs[ Math.ceil( (reverbs.length - 1) * Math.random() ) ]// : reverbs[0]
	}catch(error){
		throw Error("Random reverb failed to fetch list"+error)
	}	
}

// ---------------------------------------------------

/**
 * Default options for custom impulse response
 */
const DEFAULT_CUSTOM_IMPULSE_OPTIONS = { 
	duration:4, 
	// output max amplitude
	gain : 0.4,
	// as ratios
	attack:0.001, 
	decay:0.1, 
	sustain:1, 
	release:1,
	// booleans
	normalize : true,
	// flip horizontally (not that useful!)
	reverse:false,
	// deafult noise types
	noise:'white' // 'pink', 'brown'
}

/**
 * Create a buffer for the impulse response
 * @param {AudioContext} audioContext 
 * @param {Number} duration 
 * @param {Number} channels 
 * @returns Buffer
 */
const generateImpulseResponseBuffer = ( audioContext, duration=4, channels=2 ) => {
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = audioContext.createBuffer(channels, length, sampleRate)
	return impulse
}

/**
 * Custom impulse filter responses : Linear (lack soul)
 * @param {AudioContext} audioContext 
 * @param {Number} duration 
 * @param {Number} decay 
 * @param {Boolean} reverse 
 * @returns Buffer
 */
export const generateSimpleImpulseResponse = ( audioContext, duration=4, decay=4, reverse=false ) => {
  	const impulse = generateImpulseResponseBuffer( audioContext, duration ) 
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)
	const length = impulseL.length

    if (!decay || isNaN(decay))
	{
		decay = 2
	}
     
    for (let i = 0; i < length; ++i )
	{
      const n = reverse ? length - i : i
	  const l = 1 - n / length
      impulseL[i] = getRandomFloat() * Math.pow(l, decay)
      impulseR[i] = getRandomFloat() * Math.pow(l, decay)
    }

    return impulse
}

/**
 * Return noise function based on color
 * @param {String} color 
 * @returns {Function}
 */
const generateNoise = color => {
	switch( color.toLowerCase() )
	{
		case 'pink':
			return generatePinkNoise
		case 'brown':
			return generateBrownNoise
		default:
			return generateWhiteNoise
	}
}


/**
 * Custom responses : ADSR shaped noise
 * @param {AudioContext} audioContext 
 * @param {Object} options 
 * @returns Buffer
 */
export const generateCustomImpulseResponse = ( audioContext, options = DEFAULT_CUSTOM_IMPULSE_OPTIONS ) => { 

	const maxRelease = 1 - options.attack - options.decay
	options = { release:Math.min(maxRelease, options.release), ...DEFAULT_CUSTOM_IMPULSE_OPTIONS, ...options }

	// const offlineContext = new OfflineAudioContext( 2, audioContext.sampleRate * options.duration, audioContext.sampleRate )

    const impulse = generateImpulseResponseBuffer( audioContext, options.duration ) 
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)
	const length = impulseL.length
	// we can work out where we are in the cycle

	// A D R
	const attackTime = options.attack * length
	const decayTime = options.decay * length 
	const releaseTime = options.release * length 
	const sustainTime = length - attackTime - decayTime - releaseTime

	// create base noise to modulate
	const noiseGenerator = generateNoise( options.noise )
	const leftNoise = noiseGenerator( length )
	const rightNoise = noiseGenerator( length )

    for (let i = 0; i < length; ++i )
	{
		const state = i < attackTime ? 'ATTACK' : 
						i < attackTime + decayTime ? 'DECAY' :
						i < attackTime + decayTime + sustainTime ? 'SUSTAIN' :
						'RELEASE'

		const index = options.isPrototypeOfreverse ? length - i : i
		const percentage = index / length
		// const l = 1 - percentage

		let curve = options.sustain // = Math.pow(l, options.decay)

		switch( state )
		{
			case 'ATTACK':
				// curve IN from 0 -> 1
				const attackProgress = i / attackTime
				curve = easeInExpo(attackProgress)
				// curve = Math.pow(l, options.attack)
				break

			case 'DECAY':
				// curve slightly out
				const decayProgress = (i-attackTime) / decayTime
				const decayCurve = easeOutSine(1 - decayProgress)
				const decayRange = 1 - options.sustain
 				curve = decayCurve * decayRange + options.sustain
				// curve = Math.pow(l, options.decay)
				break

			case 'RELEASE':
				// fade out
				const releaseProgress = (i-sustainTime) / releaseTime
				curve = linear( 1 - releaseProgress)
				// curve = easeOutSine( releaseProgress)
				// curve = Math.pow(l, options.release)
				break

			// case 'SUSTAIN':
			// default:
			// 	const sustainProgress = (i-decayTime) / sustainTime
			// 	// retain the same level
			// 	curve = 1 // Math.pow(l, options.sustain)
		}

		// now set the impule over the noise
		const potential = curve * (options.gain ?? 1) 
		impulseL[i] = leftNoise[i] * potential 
		impulseR[i] = rightNoise[i] * potential
    }

    return impulse
}


/*
export const generateNoiseImpulseResponse = async (audioContext, options) => {

	const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration

	// try using offline audio context first...
    // const impulse = audioContext.createBuffer(2, length, sampleRate)

	const tailContext = new OfflineAudioContext( 2, length, sampleRate )
	tailContext.oncomplete = (buffer) => {
		//const impulse = generateImpulseResponseBuffer( audioContext, length ) 
    	return createReverbFromBuffer( audioContext, buffer.renderedBuffer, options )
	}

const oscillator = new Noise(tailContext, 1)
oscillator.init()
oscillator.connect(tailContext.destination)
oscillator.attack = this.attack
oscillator.decay = this.decay
oscillator.release = this.release


oscillator.on({frequency: 500, velocity: 1})
tailContext.startRendering()
setTimeout(()=>{
oscillator.off()
},20)
}


set decayTime(value) {
	let dc = value/3;
	this.reverbTime = value;
	this.attack = 0;
	this.decay = 0;
	this.release = dc;
	return this.renderTail();
}

renderTail () {

    const tailContext = new OfflineAudioContext( 2, this.context.sampleRate * this.reverbTime, this.context.sampleRate );
	
	tailContext.oncomplete = (buffer) => {
		this.effect.buffer = buffer.renderedBuffer;
	}
		
    const tailOsc = new Noise(tailContext, 1);
          tailOsc.init();
          tailOsc.connect(tailContext.destination);
          tailOsc.attack = this.attack;
          tailOsc.decay = this.decay;
          tailOsc.release = this.release;
		
      
      tailOsc.on({frequency: 500, velocity: 1});
			tailContext.startRendering();
		setTimeout(()=>{
			tailOsc.off(); 
		},20)
}
*/
// ------------------------------------------------------------------


/**
 * Create reverb nodes based on buffer
 * @param {AudioContext} audioContext 
 * @param {Buffer} audioBuffer 
 * @param {Object} options 
 * @returns 
 */
export const createReverbFromBuffer = async ( 
	audioContext,
	audioBuffer,
	options={
		normalize:true,
		gain:0.4
	}
) => {
	const reverbGain = new GainNode( audioContext, options )
	const convolver = audioContext.createConvolver()
	convolver.buffer = audioBuffer
	convolver.normalize = options.normalize
	convolver.connect(reverbGain)
	
	return {
		// unique effect name
		name:"reverb",
		// audio node
		node:convolver,
		// stash audioBuffer data for reference in waveforms
		audioBuffer : audioBuffer,
		// methods to change parameters
		gain:value => changeParameter( reverbGain, "gain", value)
	}
}

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Object} options 
 * @returns {Object} Reverb
 */
export const createCustomReverb = async ( audioContext, options = DEFAULT_CUSTOM_IMPULSE_OPTIONS ) => {
	const audioBuffer = await generateCustomImpulseResponse(audioContext, options)
	let reverb = await createReverbFromBuffer(audioContext, audioBuffer, options)
	reverb.setOptions = async (options) => {
		// reverb = await createCustomReverb(audioContext, options)
		reverb.node.buffer = await generateCustomImpulseResponse(audioContext, options)
	}
	return reverb
}

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Number} gain 
 * @param {Boolean} normalize 
 * @param {String} impulseFilterFilename 
 * @returns {Object} Reverb
 */
export const createReverb = async ( 
	audioContext,
	gain = 0.4,
	normalize=true,
	impulseFilterFilename='./assets/audio/acoustics/ir-hall.mp3'
) => {

	// Load from a local WAV / MP3 file
	const loadImpulseFilter = async (filename) => {
		try{
			const response = await fetch(filename)
			const arrayBuffer = await response.arrayBuffer()
			return await audioContext.decodeAudioData(arrayBuffer)
		}catch(error){
			throw Error("Could not load impulse filter "+filename)
		}
	}
	
	// first load our filter into memory...
	const audioBuffer = await loadImpulseFilter(impulseFilterFilename)
	const reverb = createReverbFromBuffer(audioContext, audioBuffer, {normalize, gain} )

	// add our custom methods for this reverb
	reverb.impulseFilter = async (filterFilename) => {
		convolver.buffer =  await loadImpulseFilter(filterFilename)
		convolver.normalize = normalize	
		return filterFilename
	}

	return reverb
}

/*
class AdvancedReverb extends SimpleReverb {
	constructor (context) {
		super(context);
		this.name = "AdvancedReverb";
	}

	setup (reverbTime=1, preDelay = 0.03) {
		this.effect = this.context.createConvolver();

		this.reverbTime = reverbTime;

		this.attack = 0.001;
		this.decay = 0.1;
		this.release = reverbTime;

    this.preDelay = this.context.createDelay(reverbTime);
    this.preDelay.delayTime.setValueAtTime(preDelay, this.context.currentTime);
    
    this.multitap = [];
    
    for(let i = 2; i > 0; i--) {
      this.multitap.push(this.context.createDelay(reverbTime));
    }
    this.multitap.map((t,i)=>{
      if(this.multitap[i+1]) {
        t.connect(this.multitap[i+1])
      }
      t.delayTime.setValueAtTime(0.001+(i*(preDelay/2)), this.context.currentTime);
    })
    
    this.multitapGain = this.context.createGain();
    this.multitap[this.multitap.length-1].connect(this.multitapGain);
    
    this.multitapGain.gain.value = 0.2;
    
    this.multitapGain.connect(this.output);
    
		this.wet = this.context.createGain();
     
    this.input.connect(this.wet);
    this.wet.connect(this.preDelay);
    this.wet.connect(this.multitap[0]);
    this.preDelay.connect(this.effect);
		this.effect.connect(this.output);
   
	}
	renderTail () {

    const tailContext = new OfflineAudioContext( 2, this.context.sampleRate * this.reverbTime, this.context.sampleRate );
					tailContext.oncomplete = (buffer) => {
						this.effect.buffer = buffer.renderedBuffer;
					}
    const tailOsc = new Noise(tailContext, 1);
    const tailLPFilter = new Filter(tailContext, "lowpass", 2000, 0.2);
    const tailHPFilter = new Filter(tailContext, "highpass", 500, 0.1);
    
    tailOsc.init();
		tailOsc.connect(tailHPFilter.input);
    tailHPFilter.connect(tailLPFilter.input);
    tailLPFilter.connect(tailContext.destination);
		tailOsc.attack = this.attack;
		tailOsc.decay = this.decay;
		tailOsc.release = this.release;
    
		tailContext.startRendering()

		tailOsc.on({frequency: 500, velocity: 1});
		setTimeout(()=>{
					tailOsc.off();
		},20)
	}

	set decayTime(value) {
		let dc = value/3;
		this.reverbTime = value;
		this.attack = 0;
		this.decay = 0;
		this.release = dc;
    return this.renderTail();
	}
}

let filter = new Filter(Audio, "lowpass", 50000, 0.8);
    filter.setup();
let verb = new AdvancedReverb(Audio); 
      verb.setup(2,0.01);
			verb.renderTail();
      verb.wet.gain.value = 1;
*/