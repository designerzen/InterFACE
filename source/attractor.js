/**
 * Attract Mode! 
 * This demos the app and allows for a player to totally immerse
 * themselves in play without having to concern with actually
 * interacting
 * getPerson,getPlayers
	fetchPlayerOptions,setPlayerOption, setPlayerOptions,
	language, 
	...ui, 
	...information,
	setBPM, setMasterVolume,
	loadInstruments, 
	loadRandomInstrument, previousInstrument, nextInstrument,
	toggleRecording
 */

const DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE = 3
export default class Attractor{

	counter = 0
	userActive = true

	constructor( application ) {
		this.application = application
	}

	/**
	 * Tick this along!
	 */
	tick(elapsed, barProgress){

		const players = this.application.getPlayers() 
	
		if (!this.application.isUserActive() )
		{
			// inactive - ATTRACT MODE
			if (barProgress === 0)
			{
				this.counter++
				players.forEach( player => {
					if ( player.timeSinceInstrumentChanged > DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE )
					{
						player.loadRandomInstrument()
					}
				})
					
				// occassionally turn on a feature or two...
				//this.application.setBPM( Math.random() * 100 + 60 )
				//console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
			}
			
		}else{

			// active - just change instruments every now and then
			if (barProgress === 0)
			{
				//this.application.setState( 'backingTrack', true )
				this.counter++
				players.forEach( player => {
					if ( player.timeSinceInstrumentChanged > DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE )
					{
						player.loadRandomInstrument()
					}
				})
			}else{
				//this.application.setState( 'backingTrack', false )
			}
		}

		// FIXME: 
		// console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
	}

	tock(elapsed, barProgress){
		// FIXME: 
		// console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
	}

	// setUserActive(){
	// 	this.userActive = true
	// 	//console.log("User engaged... disengaging advanced attract mode." )
	// }

	// setUserInactive(){
	// 	this.userActive = false
	// 	//console.log("User disengaged... attracting..." )
	// }
}