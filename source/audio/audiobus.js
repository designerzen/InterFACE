class AudioBus extends AudioWorkletNode {
	
	// Custom AudioParams can be defined with this static getter.
	static get parameterDescriptors() {
		return [{ name: 'volume', defaultValue: 1 }];
	}

	constructor(context) {
	  super(context, 'audiobus-processor')

	  this.port.onmessage = (event) => {
		// Handling data from outside
		console.log(event.data)
	  }

	}
}
  

registerProcessor('audiobus-processor', AudioBus)
  
//  do do dooo something!
//  audioContext.audioWorklet.addModule('processors.js').then(() => {
// 	let node = new MyWorkletNode(context)
//  })