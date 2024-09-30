class PassthroughProcessor extends AudioWorkletProcessor {

	name = "PassthroughProcessor"

	constructor() {
		console.log("Processor created")
	  super();
	}
  
	process(inputList, outputList, parameters) {
	  // Using the inputs (or not, as needed),
	  // write the output into each of the outputs
	  // …
	  return true;
	}
}
  
registerProcessor("passthrough-processor", PassthroughProcessor);
console.log("Processor registered")