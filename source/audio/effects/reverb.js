// inspired by https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/drum-machine/main.js
// const compressor = new DynamicsCompressorNode(audioContext)
// const convolver = new ConvolverNode(audioContext, {buffer: irBuffer})
// const reverbGain = new GainNode(audioContext, {gain: 0.25})
// compressor.connect(audioContext.destination)
// convolver.connect(reverbGain).connect(audioContext.destination)
// compressor.connect(convolver)

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

export const createReverb = async ( 
	audioContext,
	gain = 0.4,
	normalize=true,
	filterFile='./assets/audio/ir-hall.mp3'
) => {

	// first load our filter into memory...
	const response = await fetch(filterFile)
	const arrayBuffer = await response.arrayBuffer()
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
	const compressor = new DynamicsCompressorNode(audioContext)
	const reverbGain = new GainNode( audioContext, {gain: gain} )
	
	// const convolver = new ConvolverNode( audioContext , {
	// 	buffer : audioBuffer,
	// 	normalize : normalize
	// } )
	const convolver = audioContext.createConvolver(null, true)
	convolver.buffer = audioBuffer
	convolver.normalize = normalize

	//console.log("Reverb", {arrayBuffer, filterBuffer, reverbGain, convolver } )

	compressor.connect(audioContext.destination)
	compressor.connect(convolver)

	convolver.connect(reverbGain).connect(audioContext.destination)
	
	return {
		name:"reverb",
		node:convolver,
		gain:value => reverbGain.gain.value = value
	}
}