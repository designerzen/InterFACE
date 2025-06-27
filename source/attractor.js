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

import { 
	EVENT_INSTRUMENT_CHANGED, 
	EVENT_INSTRUMENT_LOADING, 
	EVENT_PERSON_BORN, 
	EVENT_PERSON_DEAD 
} from "./person"

// in seconds
const DURATION_BEFORE_AUTOMATIC_INSTRUMENT_CHANGE = [
	1000 * 33,
	1000 * 67,
	1000 * 95,
	1000 * 121
]

// in bars
const BARS_BEFORE_CHANGING_DRUM_PATTERNS =  32 * 1
const BREAKS_BEFORE_CHANGING_DRUM_TIMBRES = 3
const BARS_BEFORE_TOGGLING_DISCO = 64 + 8
// TODO: make it more frenetic every
const BARS_BEFORE_CHANGING_BPM = 42

export default class Attractor{

	barCounter = 0
	discoModeAt = 0

	constructor( application ) {
		this.onChange.bind(this)
		this.application = application
		this.application.addListener(EVENT_INSTRUMENT_LOADING, this.onChange )
		
		this.application.addListener(EVENT_INSTRUMENT_CHANGED, this.onChange )
		this.application.addListener(EVENT_PERSON_BORN, this.onChange )
		this.application.addListener(EVENT_PERSON_DEAD, this.onChange )
	}

	/**
	 * Tick this along!
	 * FROM CLOCK
	 */
	tick(elapsed, clock){

		const players = this.application.getPlayers() 
		const userActive = this.application.isUserActive()
		const quantityOfActivePeople = this.application.quantityOfActivePeople

		if ( clock.isAtStart )
		{
			this.barCounter++

			// add percussion and alter beats & timing
			if (this.application.getState("backingTrack"))
			{
				// console.info("setRandomDrumTimbres", (this.barCounter+1)%BARS_BEFORE_CHANGING_DRUM_PATTERNS, this.barCounter+1, BARS_BEFORE_CHANGING_DRUM_PATTERNS)
				if ((this.barCounter+1)%BARS_BEFORE_CHANGING_DRUM_PATTERNS === 0)
				{
					this.application.setRandomDrumTimbres()
					// this.application.setDrumKitOptons("") 
				}
				if (this.barCounter%BARS_BEFORE_CHANGING_DRUM_PATTERNS === 0)
				{
					this.application.setRandomDrumPattern()
					if (this.barCounter%BARS_BEFORE_CHANGING_BPM === 0)
					{
						// quantityOfActivePeople
						this.application.setBPM( parseInt((69 + Math.random() * 80).toFixed(2) ))
					}	
				}	
			}			
		}
		
		// no users around so turn off disco mode
		if (!userActive )
		{
			if ( clock.barProgress === 0)
			{
				this.barCounter = 0
				// inactive - ATTRACT MODE
				if (this.application.getState("disco"))
				{
					this.application.setDiscoMode(false)
				}
				
				
				/*
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
						console.warn("Changing", player.name,  player.timeSinceInstrumentChanged - durationBeforeChange, "instrument", result )
						
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
				*/
			}
		
		}else{

			// FIXME: Only action this when there are people!
			// this.application.getQuantityOfPlayers() > 0
			if (clock.isAtMiddleOfBar)
			{
				// toggles disco mode if we haven't done so recently
				if (this.discoModeAt !== this.barCounter && this.barCounter%BARS_BEFORE_TOGGLING_DISCO === 0)
				{
					// toggle if no arg passed
					this.application.setDiscoMode()
					this.discoModeAt = this.barCounter
					//console.info("disco fishing people", this.application.getQuantityOfPlayers(), this.barCounter, elapsed )
				}
			}

			
			
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
	// FROM Prediction
	tock(elapsed, barProgress){
		// FIXME: 
		// console.log(this.counter, "AUTOMATON:", elapsed.toFixed(2), "seconds", barProgress * 100,  this.application )
	}

	onChange(event){
		switch(event.type)
		{
			case EVENT_INSTRUMENT_CHANGED:
				break	
			
			case EVENT_PERSON_BORN:
				// console.info("Automator:New Person", event.detail, this.application)
				break	
			
			case EVENT_PERSON_DEAD:
				// console.info("Automator:Person left field of view", event.detail, this.application)
				break	
				
			default:
		}
	}
}