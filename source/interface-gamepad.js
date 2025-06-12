import { 
	GAME_PAD_CONNECTED, 
	GAME_PAD_DISCONNECTED,
	BUTTON_P1, 
	BUTTON_P2,
	BUTTON_A, BUTTON_B, BUTTON_X, BUTTON_Y,
	BUTTON_LB, BUTTON_RB, BUTTON_LT, BUTTON_RT, 
	BUTTON_SELECT, BUTTON_START, 
	BUTTON_LEFT_SHOULDER, BUTTON_RIGHT_SHOULDER, 
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT,
	COMMANDS,
	GamePadManager
} from "./hardware/gamepad"


/**
 * Start monitoring for global gamepad input
 * but ignore them until we are ready
 * 
 * 
 * START will alter the PLAYER INDEX
 * SELECT will alter the 
 * 
 */
export const addGamePadEvents = (application) => {
	const gamepadHeld = new Map()
	const gamePadManager = new GamePadManager()

	// enums
	let gamePadMode = 0
	let gamePadPlayerIndex = application.getSelectedPerson()

	const gamePadModes = ["beats", "vfx", "instruments"] 
	gamePadManager.addEventListener( (button, value, gamePad, heldFor ) => {
		
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
				break
		
			default: 
				if (value)
				{
					gamepadHeld.set(button, value)
				}else{
					gamepadHeld.delete(button)
				}
		}
		
		switch(button)
		{
			case GAME_PAD_CONNECTED:
				application.setFeedback( "Gamepad connected" , 0, 'gamepad' )
				console.info("Gamepad connected", button, value, gamePad )
				break

			case GAME_PAD_DISCONNECTED:
				application.setFeedback( "Gamepad connection lost" , 0, 'gamepad' )
				console.info("Gamepad disconnected", button, value, gamePad )
				break

			// open sidebar
			case COMMANDS.START: 
			application.setFeedback( "Gamepad START" , 0, 'gamepad' )
				// if select is also being held....
				if (gamePad.select){
					application.display.nextFilter( )
				}else{
					application.toggleBackgroundPercussion()
				}
				console.info("Gamepad start", value, { gamePad, gamepadHeld } )
				break
			

			// This changes the "selected" user by highlighting their outline
			// this then targets the controller for that specfific person
			case COMMANDS.SELECT: 
				gamePadMode = ( gamePadMode + 1 ) % gamePadModes.length
				const mode = gamePadModes[gamePadMode]
				application.setFeedback( mode, 0, 'gamepad' )
				application.selectPerson( application.getSelectedPerson() + 1 )

				if (mode === "vfx"){
					// etc
				}

				// check to see if another key is held down...
				if (gamePad.start){
					
				}else{
					// application.setDiscoMode()
				}
				
				
				console.info("Gamepad select", value, { gamePad, gamepadHeld, heldFor } )
				break
			
			case COMMANDS.A: 
				console.info("Gamepad A", value, { gamePad, gamepadHeld, heldFor } )
				// To only activate whilst button is held down...
				// if ( value )
				// {
				// 	getPerson(0).showForm() 
				// }else{
				// 	getPerson(0).hideForm() 
				// }
				application.getPerson(0).toggleForm() 
				break
			
			case COMMANDS.B: 
				console.info("Gamepad B", value, { gamePad, gamepadHeld, heldFor } )
				application.getPerson(1).toggleForm() 
				break
			
			case COMMANDS.X: 
				console.info("Gamepad X", value, { gamePad, gamepadHeld, heldFor } )
				application.getPerson(2).toggleForm() 
				break
			
			case COMMANDS.Y: 
				console.info("Gamepad Y", value, { gamePad, gamepadHeld, heldFor } )
				application.getPerson(3).toggleForm() 
				break
			
			// If we are in a certain mode...
			// adapt 
			case COMMANDS.LB: 
				application.stateMachine.get("")
				console.info("Gamepad LB", value, { gamePad, gamepadHeld, heldFor } )
				break
			
			case COMMANDS.LB: 
				console.info("Gamepad LB", value, { gamePad, gamepadHeld, heldFor } )
				break

			case COMMANDS.RB: 
				console.info("Gamepad RB", value, { gamePad, gamepadHeld, heldFor } )
				break

			case COMMANDS.LT: 
				console.info("Gamepad LT", value, { gamePad, gamepadHeld, heldFor } )
				break

			case COMMANDS.RT: 
				console.info("Gamepad RT", value, { gamePad, gamepadHeld, heldFor } )
				break

			default:
				console.info("Gamepad", { gamePadManager, button, value, gamePad, heldFor } )
		}
	})
}
