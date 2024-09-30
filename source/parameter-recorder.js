// Ok, here's a fun one...

import { now } from "./timing/timing"

// RECORD Vars just save it and it will record the time
export class ParamaterRecorder{

	constructor( options={} ) {

		this.isRecording = false
		this.parameters
		this.startTime = now()
		this.reset()
	}

	get recording(){
		return this.parameters
	}
	get isActive(){
		return this.isRecording
	}

	reset(){
		this.parameters = new Map()
	}

	add( values, time ){
		time = time ?? now()
		if (!this.isRecording)
		{
			this.startTime = time
			this.isRecording = true
		}
		// save whatever you want innit
		const elapsed = Math.floor(time - this.startTime)
		this.parameters.set(elapsed, values)
	}

	getValuesAtTime(time){
		return this.parameters[time]
	}

	export(){
		const data = {}
		this.parameters.forEach((value,key)=>data[key] = value )
		return JSON.stringify( data )
	}
}