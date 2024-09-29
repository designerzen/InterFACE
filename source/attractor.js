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
	1000 * 13,
	1000 * 19,
	1000 * 23,
	1000 *31
]

const BARS_BEFORE_CHANGING_DRUMS = 16
const BARS_BEFORE_TOGGLING_DISCO = 32

export default class Attractor{

	barCounter = 0

	constructor( application ) {
		this.application = application
	}

	/**
	 * Tick this along!
	 */
	tick(elapsed, clock){

		const players = this.application.getPlayers() 
		const userActive = this.application.isUserActive()

		if ( clock.barProgress === 0)
		{
			this.barCounter++

			if (this.barCounter%BARS_BEFORE_CHANGING_DRUMS)
			{
				this.application.setRandomDrumPattern()
			}
				
			// toggles disco mode!
			if (this.barCounter%BARS_BEFORE_TOGGLING_DISCO)
			{
				// toggle if no arg passed
				this.application.setDiscoMode()
			}
		}

		if (!userActive )
		{
			// inactive - ATTRACT MODE
			if ( clock.barProgress === 0)
			{
				players.forEach( (player, index) => {
					const durationBeforeChange = DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE[index]
					
					if ( !player.isFormShowing && player.timeSinceInstrumentChanged > durationBeforeChange )
					{
						// console.log("Has player been stuck on this instrument too long?", 
						// 	player.timeSinceInstrumentChanged,
						// 	durationBeforeChange, 
						// 	player.timeSinceInstrumentChanged > durationBeforeChange,
						// 	player.instrumentLoadedAt,
						// 	player.now
						// )
						const result = player.loadRandomPreset()
						//console.warn("Changing", player.name,  player.timeSinceInstrumentChanged - durationBeforeChange, "instrument", result )
						
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
				// occassionally turn on a feature or two...
				//this.application.setBPM( Math.random() * 100 + 60 )
				//console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
			}
		}else{

			// active - just change instruments every now and then
			if ( clock.barProgress === 0)
			{
				//this.application.setState( 'backingTrack', true )
			
				players.forEach( (player, index) => {
					const durationBeforeChange = DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE[index]
					// console.log("Has player been stuck on this instrument too long?", 
					// 	player.timeSinceInstrumentChanged,
					// 	durationBeforeChange, 
					// 	player.timeSinceInstrumentChanged > durationBeforeChange,
					// 	player.instrumentLoadedAt,
					// 	player.now
					// )

					if ( !player.isFormShowing && player.timeSinceInstrumentChanged > durationBeforeChange )
					{
						
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