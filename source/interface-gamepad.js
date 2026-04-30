import { 
	BUTTON_P1, 
	BUTTON_P2,
	BUTTON_A, BUTTON_B, BUTTON_X, BUTTON_Y,
	BUTTON_LB, BUTTON_RB, BUTTON_LT, BUTTON_RT, 
	BUTTON_SELECT, BUTTON_START, 
	BUTTON_LEFT_SHOULDER, BUTTON_RIGHT_SHOULDER, 
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT,
	COMMANDS
} from "./hardware/gamepad/gamepad.js"
import { 
	GAME_PAD_CONNECTED, 
	GAME_PAD_DISCONNECTED,
	GamePadManager
} from "./hardware/gamepad/gamepad-manager.js"

export const GAMEPAD_MODE_PERCUSSION = 'beats'
export const GAMEPAD_MODE_INSTRUMENT = 'instruments'
export const GAMEPAD_MODE_VFX = 'vfx'
export const GAMEPAD_MODE_CONTROLS = 'controls'

export const GAMEPAD_MODES = [
	GAMEPAD_MODE_PERCUSSION,
	GAMEPAD_MODE_INSTRUMENT,
	GAMEPAD_MODE_VFX
]

const convertGamePadActionToMusic = ( application, gamePad, button, value, heldFor, gamePadPlayerIndex ) => {

	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
	const person = application.personManager.getSelectedPerson()

	// Instruments need both values
	switch(button)
	{

	}

	// One shots just need triggers
	if (!value){
		return
	}
	
	switch(button)
	{
		// case COMMANDS.LEFT_STICK_Y: 
		// case COMMANDS.RIGHT_STICK_Y: 
			
		// case COMMANDS.LEFT_STICK_X: 
		// case COMMANDS.RIGHT_STICK_X:
		// 	person.loadPreviousInstrument()
		// 	break

		case COMMANDS.UP: 
			if (isUnselected)
			{
				application.setVolume( application.getVolume() + 1 )
			}else{
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend( pitchBend+0.5 )
			}
			break
		
		case COMMANDS.DOWN: 
			if (isUnselected)
			{
				application.setVolume( application.getVolume() - 1 )
			}else{
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend( pitchBend-0.5 )
			}
			break

		case COMMANDS.LEFT: 
			if (isUnselected)
			{
				application.setBPM( clock.BPM - 1 )
			}else{
				person.loadPreviousInstrument()
			}
			break

		case COMMANDS.RIGHT: 
			if (isUnselected)
			{
				application.setBPM( clock.BPM + 1 )
			}else{
				person.loadNextInstrument()
			}
			break

		case COMMANDS.A: 
			console.info("Gamepad A", value, { gamePad, heldFor } )
			// To only activate whilst button is held down...
			// if ( value )
			// {
			// 	getPerson(0).showForm() 
			// }else{
			// 	getPerson(0).hideForm() 
			// }
			application.setRandomDrumTimbres()
			// application.getPerson(gamePadPlayerIndex).toggleForm() 
			break
		
		case COMMANDS.B: 
			console.info("Gamepad B", value, { gamePad, heldFor } )
			break
		
		case COMMANDS.X: 
			console.info("Gamepad X", value, { gamePad, heldFor } )
			// application.getPerson(2).toggleForm() 
			if (isUnselected)
			{
				application.kit.kick()
			}else{
				person.loadPreviousInstrument()
				//application.getPerson(gamePadPlayerIndex) 
			}
			break
		
		case COMMANDS.Y: 
			console.info("Gamepad Y", value, { gamePad, heldFor } )
			// application.getPerson(3).toggleForm() 
			if (isUnselected)
			{
				application.kit.snare()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break
		
		// If we are in a certain mode...
		// adapt 
		case COMMANDS.LB: 
			// application.stateMachine.get("")
			console.info("Gamepad LB", value, { gamePad, heldFor } )
			if (isUnselected)
			{
				application.kit.hat()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break

		case COMMANDS.RB: 
			if (isUnselected)
			{
				application.kit.clap()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad RB", value, { gamePad, heldFor } )
			break

		case COMMANDS.LT: 
			if (isUnselected)
			{
				application.kit.cowbell()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad LT", value, { gamePad, heldFor } )
			break

		case COMMANDS.RT: 
			if (isUnselected)
			{
				application.kit.hat()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad RT", value, { gamePad, heldFor } )
			break

		case COMMANDS.P1: 
			if (isUnselected)
			{
				application.kit.kick()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break

		case COMMANDS.P2: 
			if (isUnselected)
			{
				application.kit.snare()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break
		
		default:
			console.info("Gamepad", { button, value, gamePad, heldFor } )
	}
}

const convertGamePadActionToPercussion = ( application, gamePad, button, value, heldFor, gamePadPlayerIndex ) => {
	// One shots just need triggers
	if (!value){
		return
	}

	switch(button)
	{
		case COMMANDS.UP: 
			application.kit.hat()
			break
		
		case COMMANDS.DOWN: 
			application.kit.cowbell()
			break

		case COMMANDS.LEFT: 
			application.kit.kick()
			break

		case COMMANDS.RIGHT: 
			application.kit.snare()
			break

		case COMMANDS.A: 
			application.setRandomDrumTimbres()
			break
		
		case COMMANDS.B: 
			application.setRandomDrumPattern()
			break
		
		case COMMANDS.X: 
			application.kit.kick()
			break
		
		case COMMANDS.Y: 
			application.kit.snare()
			break
		
		// Left Back Trigger
		case COMMANDS.LB: 
			application.kit.snare()
			break

		// toggleBackgroundPercussion
		case COMMANDS.RB: 
			application.kit.snare()
			break

		case COMMANDS.LT: 
			application.kit.cowbell()
			break

		case COMMANDS.RT: 
			application.kit.hat()
			break

		case COMMANDS.P1: 
			application.kit.kick()
			break

		case COMMANDS.P2: 
			application.kit.snare()
			break
		
		default:
			application.kit.cowbell()
			console.info("Gamepad", { button, value, gamePad, heldFor } )
	}
}

// Just alter the visuals!
const convertGamePadActionToVFX = ( application, gamePad, button, value, heldFor, gamePadPlayerIndex ) => {
	// One shots just need triggers
	if (!value){
		return
	}

	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
					
	switch(button)
	{
		// ignore caching these
		case GAME_PAD_CONNECTED:
		case GAME_PAD_DISCONNECTED:
		case COMMANDS.LEFT_STICK_Y: 
		case COMMANDS.LEFT_STICK_X: 
		case COMMANDS.RIGHT_STICK_Y: 
		case COMMANDS.RIGHT_STICK_X:
		// case COMMANDS.UP: 
		// case COMMANDS.DOWN: 
		// case COMMANDS.LEFT: 
		// case COMMANDS.RIGHT: 
		default:
			// if select is also being held....
			if (gamePad.select){
				application.toggleDiscoMode()
			}else{
			
				application.display.nextFilter( )
			}
			break
	}
}

/**
 * For controlling modes and loading specific instruments
 */
const convertGamePadActionToControl = ( application, gamePad, button, value, heldFor, gamePadPlayerIndex ) => {

	// One shots just need triggers
	if (!value){
		return
	}	

	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
	const person = application.personManager.getSelectedPerson()

	switch(button)
	{
		case COMMANDS.UP: 
			application.setVolume( application.getVolume() + 1 )
			break
		
		case COMMANDS.DOWN: 
			application.setVolume( application.getVolume() - 1 )
			break

		case COMMANDS.LEFT: 
			if (isUnselected)
			{

			}else{
				person.loadPreviousInstrument()
			}
			break

		case COMMANDS.RIGHT: 
			if (isUnselected)
			{

			}else{
				person.loadNextInstrument()
			}
			break
		
		case COMMANDS.A: 
			if (isUnselected)
			{

			}else{
				// open player menu
			}
			break
		
		case COMMANDS.B: 
			application.setDiscoMode()
			break
		
		case COMMANDS.X: 
			application.setRandomDrumTimbres()
			break
		
		case COMMANDS.Y: 
		
		application.setRandomDrumPattern()
			break

		case COMMANDS.LEFT_SHOULDER:
			application.setVolume( application.getVolume() - 1 )
			break

		case COMMANDS.RIGHT_SHOULDER:
			application.setVolume( application.getVolume() + 1 )
			break

		default:			
			application.setRandomDrumPattern()
	}
}

const convertMethods = [
	convertGamePadActionToMusic,
	convertGamePadActionToPercussion,
	convertGamePadActionToVFX,
	convertGamePadActionToControl
]

/**
 * Start monitoring for global gamepad input
 * but ignore them until we are ready
 * 
 * START will alter the PLAYER INDEX
 * SELECT will alter the MODE
 */
export const addGamePadEvents = (application) => {
	const gamepadHeld = new Map()
	const gamePadManager = new GamePadManager()
	const personManager = application.personManager
	const playerQuantity = personManager.quantityOfPlayers
	
	let gamePadModeIndex = 0
	let gamePadMethod = convertMethods[gamePadModeIndex]

	let gamePadPlayerIndex = personManager.getSelectedPerson() ?? -1
	
	const setMode = mode => {
		gamePadModeIndex = mode % GAMEPAD_MODES.length
		gamePadMethod = convertMethods[gamePadModeIndex]
		return GAMEPAD_MODES[gamePadModeIndex]
	}

	gamePadManager.addEventListener( ( eventName, value, gamePad, heldFor ) => {
		console.info("GAMEPAD:", {eventName, value, gamePad, heldFor}, arguments )
		switch(eventName)
		{
			// ignore caching these
			case GAME_PAD_CONNECTED:
			case GAME_PAD_DISCONNECTED:
			case COMMANDS.LEFT_STICK_Y: 
			case COMMANDS.LEFT_STICK_X: 
			case COMMANDS.RIGHT_STICK_Y: 
			case COMMANDS.RIGHT_STICK_X:
			// case COMMANDS.UP: 
			// case COMMANDS.DOWN: 
			// case COMMANDS.LEFT: 
			// case COMMANDS.RIGHT: 
				break
		
			default: 
				if (value)
				{
					gamepadHeld.set(eventName, value)
				}else{
					gamepadHeld.delete(eventName)
				}
		}

		switch(eventName)
		{
			case GAME_PAD_CONNECTED:
				application.setFeedback( "Gamepad connected" , 0, 'gamepad' )
				console.info("Gamepad connected", eventName, value, gamePad )
				break

			case GAME_PAD_DISCONNECTED:
				application.setFeedback( "Gamepad connection lost" , 0, 'gamepad' )
				console.info("Gamepad disconnected", eventName, value, gamePad )
				break
		}

		// on press not release
		if (value)
		{
			switch(eventName)
			{
				// This changes the "selected" user by highlighting their outline
				// this then targets the controller for that specfific person.	
				case COMMANDS.SELECT: 
					// We can check to see if we are deslected
					const currentlySelected = personManager.getSelectedPerson() 
					const isLastPersonSelected = currentlySelected >= playerQuantity - 1
					
					// the final player is currently selected so we now deselect ALL!
					if (isLastPersonSelected || gamePad.start){
						gamePadPlayerIndex = -1
						application.setFeedback( "Deselect all" , 0, 'gamepad' )
						personManager.deselectPeople()
						personManager.unhighlightPeople()
					}else{
						gamePadPlayerIndex = personManager.selectPerson( currentlySelected + 1 )
						personManager.highlightPerson( gamePadPlayerIndex )
						application.setFeedback( "Gamepad SELECT "+gamePadPlayerIndex , 0, 'gamepad' )
						console.info("Gamepad select", selectedId, value, gamePad )
					}
					break
				
				case COMMANDS.START: 
					const mode = setMode( gamePadModeIndex + 1 )
					application.setFeedback( mode + " mode", 0, 'gamepad' )
					console.info("Gamepad START", value, gamePad )
					// check to see if another key is held down...
					break
			}
		}

		gamePadMethod( application, gamePad, eventName, value, heldFor, gamePadPlayerIndex )
	})

	// update game pads on beat
	application.setUpdateCallback( (isBar) => {
		gamePadManager.update()
	})
}