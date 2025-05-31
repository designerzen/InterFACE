class AbstractAudioWorkletNode extends AudioWorkletNode {

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

	constructor(audioContext) 
	{
	  super(audioContext)
	  this.port.onmessage = this.onmessage.bind(this)
	  this.post('Hi!')
	}

	post( data){
		return this.port.postMessage(data)
	}

	/**
	 * Pass in the event data to the AudioWorkletNode
	 * @param {Event} event 
	 */
	onmessage(event) {
		// Handling data from the node.
		// console.log("SampleAudioWorkletNode:", event.data)
		// loadSample(event.data)
		switch (event.data.type) {
			case 'available':
				console.log('[AudioWorkletNode:Available]')
				break

			case 'load':
				console.error("AudioWorkletNode: Loading", event)
				
				break

			default:
				console.error("AudioWorkletNode: Unknown message type", event)
		}
	}
}