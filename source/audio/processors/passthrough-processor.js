/**
* A simple bypass node demo.
*
* @class BypassProcessor
* @extends AudioWorkletProcessor
*/
class PassthroughProcessor extends AudioWorkletProcessor {

	name = "PassthroughProcessor"

	constructor() {
		console.log("Processor created")
	  	super()
	}
  
	process(inputs, outputs, parameters) {
	  // Using the inputs (or not, as needed),
	  // write the output into each of the outputs
	  // By default, the node has single input and output.
	  const input = inputs[0]
	  const output = outputs[0]
   
	  for (let channel = 0; channel < output.length; ++channel) {
		output[channel].set(input[channel])
	  }
   
	  return true
	}
}
  
registerProcessor("passthrough-processor", PassthroughProcessor)