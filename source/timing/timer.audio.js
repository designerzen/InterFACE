import Timer from "./timer.js"
import { createTimingProcessor } from "./timing.audioworklet.js"
import AUDIOTIMER_PROCESSOR_URI from 'url:./timing.audioworklet-processor.js'

export const MIDI_DIVISIONS = 24

export default class AudioTimer extends Timer {
	
	/**
	 * Accurate time in milliseconds
	 * @returns {Number} The current time as of now
	 */
	get now(){ 
		return this.audioContext ? this.audioContext.currentTime : performance.now() 
	}
	
	constructor(audioContext, type=AUDIOTIMER_PROCESSOR_URI){
		const timerOptions = {
			audioContext,
			divisions: MIDI_DIVISIONS,
			type	
		}
		super( timerOptions )
	}

	startTimer( callback, options={} ){
		
		// on Safari macOS/iOS, the audioContext is suspended if it's not created
		// in the event handler of a user action: we attempt to resume it.
		if (this.audioContext.state === 'suspended') 
		{
			this.audioContext.resume()
		}

		super.startTimer(callback, options)
	}

	/**
	 * 
	 * @param {String} type 
	 * @returns 
	 */
	async loadTimingWorker(type){
		// in the future, we may be able to pass offlineAudioContext to a worker
		// and at that point, we can finally tie in the actual timing by using the 
		// context as the global clock
		return await createTimingProcessor( this.audioContext )
	}
	
	/**
	 * 
	 * @param {String} type 
	 * @returns Timer Worker or Worklet
	 */
	async setTimingWorker(type){
		
		if (!this.audioContext)
		{
			throw Error('No AudioContext specified')
		}
	
		return super.setTimingWorker(type)
	}
}