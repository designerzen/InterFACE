import Timer from "./timer.js"

export const MIDI_DIVISIONS = 24

export default class AudioTimer extends Timer {
	
	audioContext = null
	/**
	 * Accurate time in milliseconds
	 * @returns {Number} The current time as of now
	 */
	get now(){ 
		return this.audioContext ? this.audioContext.currentTime : Performance.now() 
	}
	
	constructor(audioContext){
		super(MIDI_DIVISIONS)
		// lazily initialise a context
		this.audioContext = audioContext ?? new AudioContext()
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
}