import GamePad, { fetchGamePads } from "./gamepad"
import * as COMMANDS from './gamepad-commands'

export const GAME_PAD_CONNECTED = "game-pad-connected"
export const GAME_PAD_DISCONNECTED = "game-pad-disconnected"

/**
 * 
 * Manager for the GamePad class
 */
export class GamePadManager {
	
	#controllers = new Map()
	#callbacks = new Set()
	#held = new Map()
	#autoUpdate = false

	get isAnyButtonHeld(){
		return this.#held.size > 0
	}

	get heldButtons(){
		return this.#held
	}

	constructor(autoUpdate = true){

		this.#autoUpdate = autoUpdate

		// fetch any previously registered game pads
		let pads = fetchGamePads()
		let quantity = 0
		let intervalID = -1
		const eventLoop = () => {

			// console.info("checking buttons for pads", quantity)
			this.update()
			if (quantity > 0 )
			{
				//console.info("Gamepads", { pads }, this )
				cancelAnimationFrame(intervalID)
				intervalID = requestAnimationFrame( eventLoop )
			}else{
				console.warn("Gamepads loop exit", { pads }, this )
			}
		}

		//pads.forEach( pad => pad && this.controllers.set(pad.index, new GamePad(pad.index)) )
		console.info("Existing Gamepads", { pads }, this )

		window.addEventListener("gamepadconnected", e => {

			const event = e.originalEvent ? e.originalEvent.gamepad : e.gamepad
			const gamePad = new GamePad(e.index, quantity++)
			gamePad.connect(e)
			gamePad.available = true
			gamePad.on( (buttonName, value, heldFor ) => {
					
				switch(buttonName)
				{
					// ignore caching these
					case GAME_PAD_CONNECTED:
					case GAME_PAD_DISCONNECTED:
					case COMMANDS.DIRECTION_LEFT_STICK_Y: 
					case COMMANDS.DIRECTION_LEFT_STICK_X: 
					case COMMANDS.DIRECTION_RIGHT_STICK_Y: 
					case COMMANDS.DIRECTION_RIGHT_STICK_X:
					// case COMMANDS.DIRECTION_UP: 
					// case COMMANDS.DIRECTION_DOWN: 
					// case COMMANDS.DIRECTION_LEFT: 
					// case COMMANDS.DIRECTION_RIGHT: 
						break
				
					default: 
						if (value)
						{
							this.#held.set(buttonName, value)
						}else{
							this.#held.delete(buttonName)
						}
				}
				console.info("gamepad message", buttonName, value )
				this.dispatchEvent( buttonName, value, gamePad, heldFor )
			})
						
			pads = fetchGamePads()
			this.#controllers.set( event.index, gamePad )
			
			console.info(
				"Gamepad connected at index %d: %s. %d buttons, %d axes.",
				event.index,
				event.id,
				event.buttons.length,
				event.axes.length,
				{gamePad, e, event},
				this.#controllers,
				pads
			)
			this.dispatchEvent( GAME_PAD_CONNECTED, gamePad )
			// start loop if not started already
			if (this.#autoUpdate){
				eventLoop()
			}
		})

		window.addEventListener("gamepaddisconnected", e =>{
			let gamePad = this.#controllers.get(e.gamepad.connectionIndex)
			gamePad?.disconnect()
			this.#controllers.delete(e.gamepad.connectionIndex)
			quantity--
			this.dispatchEvent( GAME_PAD_DISCONNECTED, gamePad )
			gamePad = null
			console.info("Gamepad disconnected", {gamePad, e}, this.#controllers )
	 	} )

		// start loop for an existing pre-connected gamepads
		if (autoUpdate){
			eventLoop()
		}
	}

	update(){
		this.#controllers.forEach( gamePad => gamePad.update() )	
	}

	isHeld( buttonName ){
		return this.#held.has(buttonName)
	}

	/**
	 * 
	 * @param {String} key 
	 * @param {Boolean|String|Object} value 
	 */
	dispatchEvent( key, value, gamePad ){
		if (this.#callbacks.size)
		{
			this.#callbacks.forEach( callback => callback(key,value, gamePad) )
		}
	}

	addEventListener( callback ){
		this.#callbacks.add(callback)
	}

	removeEventListener( callback ){
		this.#callbacks.delete(callback)
	}
}
