const WORKLET_SAMPLER = "sampler-processor"

class SampleAudioWorkletNode extends AudioWorkletProcessor  {

	// Static getter to define AudioParam objects in this custom processor.
	static get parameterDescriptors() {
		return [{
			name: 'myParam',
			defaultValue: 0.707
		}]
	}

	constructor(context) {

		super(context, WORKLET_SAMPLER)

		this.port.onmessage = (event) => {
			// Handling data from the node.
			console.log("SampleAudioWorkletNode:", event.data)
			// loadSample(event.data)
		}
	  
		this.port.postMessage('Hi!')
	}

	async loadSample(path){
		const response = await fetch(path)
		const arrayBuffer = await response.arrayBuffer()
		const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
		return audioBuffer
	}

	async createBuffer(audioBuffer)
	{
		const trackSource = this.context.createBufferSource()
		trackSource.buffer = audioBuffer
		return trackSource
	}

	async play(audioBuffer, offset=0, velocity=128, options={ loop:false } ){
		
		let trackSource = this.createBuffer( audioBuffer )
		
		trackSource.loop = options.loop || false

		if (this.context.state === 'suspended') 
		{
			await this.context.resume()
		}
		
		if (offset == 0) 
		{
			trackSource.start( 0 )
		//offset = context.currentTime
		} else {
			trackSource.start(0, this.context.currentTime - offset)
		}
	}

	// Float32Array(128)
	process(inputs, outputs, parameters) {
		// The processor may have multiple inputs and outputs. Get the first input and
		// output.
		const input = inputs[0]
		const output = outputs[0]

		console.error("process", {inputs, outputs, parameters} )

		// Each input or output may have multiple channels. Get the first channel.
		const inputChannel0 = input[0]
		const outputChannel0 = output[0]

		// Get the parameter value array.
		// |myParamValues| is a Float32Array of either 1 or 128 audio samples
		// calculated by WebAudio engine from regular AudioParam operations.
		// (automation methods, setter) Without any AudioParam change, this array
		// would be a single value of 0.707.
		const myParamValues = parameters.myParam || []

		// if |myParam| has been a constant value during this render quantum, the
		// length of the array would be 1.
		if (myParamValues.length === 1) {

			// |myParam| has been a constant value for the current render quantum,
			// which can be accessed by |myParamValues[0]|.

			// Simple gain (multiplication) processing over a render quantum
			// (128 samples). This processor only supports the mono channel.
			for (let i = 0; i < inputChannel0.length; ++i) {
				outputChannel0[i] = inputChannel0[i] * myParamValues[0]
			}

		} else {

			// |myParam| has been changed and |myParamValues| has 128 values.
			for (let i = 0; i < inputChannel0.length; ++i) {
				outputChannel0[i] = inputChannel0[i] * myParamValues[i]
			}
		}

		// To keep this processor alive.
		return true
	}	
}


registerProcessor( WORKLET_SAMPLER , SampleAudioWorkletNode)