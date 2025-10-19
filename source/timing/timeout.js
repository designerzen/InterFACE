const getNow  = () => performance.now()
/**
 * This is just a way to see if a certain time
 * span has elaped
 */
export class Timeout{

	#duration 
	#startTime

	get duration(){
		return this.#duration
	}
	
	get elapsed(){
		return parseInt(getNow() - this.#startTime)
	}

	get percentElapsed(){
		return this.elapsed / this.#duration
	}

	get remaining(){
		return this.#duration - this.elapsed
	}

	get hasCompleted(){
		return this.elapsed > this.#duration
	}
	
	constructor( timeSpan ){
		this.#duration = timeSpan	// milliseconds!
		this.reset()
	}

	/**
	 * Restart the timer
	 */
	reset(){
		this.#startTime = getNow()
	}

	/**
	 * update this countdown and return whether it
	 * has completed or not
	 * 
	 * @returns {Boolean}
	 */
	update(){

		if ( this.hasCompleted )
		{
			// countdown has completed
			return true
		}

		// countdown has not completed
		return false
	}
}