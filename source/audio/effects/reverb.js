import {changeParameter} from './effect'

// inspired by https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/drum-machine/main.js
// const compressor = new DynamicsCompressorNode(audioContext)
// const convolver = new ConvolverNode(audioContext, {buffer: irBuffer})
// const reverbGain = new GainNode(audioContext, {gain: 0.25})
// compressor.connect(audioContext.destination)
// convolver.connect(reverbGain).connect(audioContext.destination)
// compressor.connect(convolver)
export const DIRS = [ 'EMT140-Plate' , 'Voxengo' ]
const SAMPLE_PLAYLIST = `sampled.instrument.json`

let impulses
let impulseCounter = 0

// Custom responses (lack soul)
const impulseResponse = ( audioContext, duration=4, decay=4, reverse=false ) => {
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = audioContext.createBuffer(2, length, sampleRate)
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)

    if (!decay)
	{
		 decay = 2
	}
     
    for (var i = 0; i < length; ++i )
	{
      const n = reverse ? length - i : i
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
    }

    return impulse
}

// local path
const path = './assets/audio/acoustics/'	

export const REVERB_PATHS = DIRS.map( dir => `${path}${dir}/${SAMPLE_PLAYLIST}` )

// Cache wherever applicable...
const loadedImpulseLists = {}
export const loadImpulseJSON = async (directory) => {
	if (loadedImpulseLists[directory])
	{
		return loadedImpulseLists[directory]
	}
	const jsonData = await fetch(`${path}${directory}/${SAMPLE_PLAYLIST}`)
	const json = await jsonData.json()
	
	loadedImpulseLists[directory] = json.files.map( item => `${path}${directory}/${item}` )
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
			console.error(files, dir)
			return files
		}) 

		const filePaths = [].concat(...output)

		console.error(dirs, output, filePaths)
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

export const createReverb = async ( 
	audioContext,
	gain = 0.4,
	normalize=true,
	impulseFilterFilename='./assets/audio/acoustics/ir-hall.mp3'
) => {

	const loadImpulseFilter = async (filename) => {
		const response = await fetch(filename)
		const arrayBuffer = await response.arrayBuffer()
		return await audioContext.decodeAudioData(arrayBuffer)
	}
	
	// first load our filter into memory...
	const compressor = new DynamicsCompressorNode(audioContext)
	const reverbGain = new GainNode( audioContext, {gain: gain} )
	
	// const convolver = new ConvolverNode( audioContext , {
	// 	buffer : audioBuffer,
	// 	normalize : normalize
	// } )
	const convolver = audioContext.createConvolver()// null, true
	// const audioBuffer = await loadImpulseFilter(impulseFilterFilename)
	convolver.buffer =  await loadImpulseFilter(impulseFilterFilename)
	convolver.normalize = normalize

	//console.log("Reverb", {arrayBuffer, filterBuffer, reverbGain, convolver } )

	compressor.connect(audioContext.destination)
	compressor.connect(convolver)

	convolver.connect(reverbGain).connect(audioContext.destination)
	
	return {
		name:"reverb",
		node:convolver,
		impulseFilter:async (filterFilename) => {
			convolver.buffer =  await loadImpulseFilter(filterFilename)
			convolver.normalize = normalize	
			return filterFilename
		},
		gain:value => changeParameter( reverbGain, "gain", value)
	}
}