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

// in seconds
const DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE = [
	60 * 1.3,
	60 * 1.5,
	60 * 1.7,
	60 * 1.9
]

const BARS_BEFORE_CHANGING_DRUMS = 10
const BARS_BEFORE_TOGGLING_DISCO = 13

export default class Attractor{

	barCounter = 0

	constructor( application ) {
		this.application = application
	}

	/**
	 * Tick this along!
	 */
	tick(elapsed, barProgress=0){

		const players = this.application.getPlayers() 
		const userActive = this.application.isUserActive()
		if (!userActive )
		{
			// inactive - ATTRACT MODE
			if (barProgress === 0)
			{
				this.barCounter++

				players.forEach( (player, index) => {
					const durationBeforeChange = DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE[index]
					if ( !player.isFormShowing && player.timeSinceInstrumentChanged > durationBeforeChange )
					{
						//console.log("Has player been stuck on this instrument too long?", player.timeSinceInstrumentChanged, DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE)
					
						player.loadRandomPreset()

						// change styles use array for 2 people...
						// this.application.setPlayerOption("scleraRadius",value)
						// this.application.setPlayerOptions({ 
						// 	scleraRadius:eye.s,
						// 	irisRadius:eye.i,
						// 	pupilRadius:eye.p,
						// 	eyeRatio:eye.a || 1
						// saturation:palette.s,
						// luminosity:palette.l,
						// })
					}
				})
					
				// toggles disco mode!
				if (this.barCounter%BARS_BEFORE_TOGGLING_DISCO)
				{
					// toggle if no arg passed
					this.application.setDiscoMode()
				}
				
				// occassionally turn on a feature or two...
				//this.application.setBPM( Math.random() * 100 + 60 )
				//console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )

				if (this.barCounter%BARS_BEFORE_CHANGING_DRUMS)
				{
					this.application.setRandomDrumPattern()
				}
			}
			
		}else{

			// active - just change instruments every now and then
			if (barProgress === 0)
			{
				//this.application.setState( 'backingTrack', true )
				this.barCounter++
				// players.forEach( player => {
				// 	if ( player.timeSinceInstrumentChanged > DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE )
				// 	{
				// 		player.loadRandomPreset()
				// 	}
				// })
				
				if (this.barCounter%BARS_BEFORE_CHANGING_DRUMS)
				{
					this.application.setRandomDrumPattern()
				}
				
			}else{
				//this.application.setState( 'backingTrack', false )
			}
		}

		// FIXME: 
		//console.log(this.barCounter, "AUTOMATON:", elapsed.toFixed(2) + "seconds", barProgress,  {players, userActive, photoSYNTH: this.application,} )
	}

	// every frame....
	tock(elapsed, barProgress){
		// FIXME: 
		// console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
	}

}