class InstrumentProcessor extends AudioWorkletProcessor {

	constructor() 
	{
	  super()
	  this.port.onmessage = (event) => {
		// Handling data from the node.
		console.log(event.data)
	  }
  
	  this.port.postMessage('Hi!')
	}

	static get parameterDescriptors() {
		return [
			{
				name: "gain",
				defaultValue: 0.5,
				minValue: 0,
				maxValue: 1
			},
			{
				name: "frequency",
				defaultValue: 440.0,
				minValue: 27.5,
				maxValue: 4186.009
			}
		]
	}

	/**
	 * Fundamentally, the audio for a single audio channel 
	 * (such as the left speaker or the subwoofer, for example) 
	 * is represented as a Float32Array whose values are the 
	 * individual audio samples. By specification, each block 
	 * of audio your process() function receives contains 
	 * 128 frames (that is, 128 samples for each channel), 
	 * but it is planned that this value will change in the 
	 * future, and may in fact vary depending on circumstances, 
	 * so you should always check the array's length rather 
	 * than assuming a particular size. It is, however, 
	 * guaranteed that the inputs and outputs will have the 
	 * same block length.
	 * @param {*} inputList 
	 * @param {*} outputList 
	 * @param {*} parameters 
	 * @returns 
	 */
	process(inputList, outputList, parameters) 
	{
	  	/* using the inputs (or not, as needed), write the output
		 into each of the outputs */
		// const numberOfInputs = inputList.length
		// const firstInput = inputList[0]

		// const firstInputChannelCount = firstInput.length
		// const firstInputFirstChannel = firstInput[0] // (or inputList[0][0])

		// const firstChannelByteCount = firstInputFirstChannel.length
		// const firstByteOfFirstChannel = firstInputFirstChannel[0] // (or inputList[0][0][0])

		//console.log("process", {inputList, outputList, parameters} )
	  	return true
	}
}
  
registerProcessor("interface-processor", InstrumentProcessor)