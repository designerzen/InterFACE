// Ok, here's a fun one...

// RECORD Vars just save it and it will record the time
export class ParamaterRecorder{

	constructor( audioContext, options={} ) {

		this.isRecording = false
		this.context = audioContext
		this.parameters
		this.startTime
	}

	get recording(){
		return this.parameters
	}
	get isActive(){
		return this.isRecording
	}

	reset(){
		this.parameters = {}
	}

	save( values ){
		let time = this.context.currentTime
		if (!this.isRecording)
		{
			this.startTime = time
			this.isRecording = true
		}
		// save whatever you want innit
		const elapsed = this.startTime - time
		this.parameters[elapsed] = parameters
	}

	getValuesAtTime(time){
		return this.parameters[time]
	}

}