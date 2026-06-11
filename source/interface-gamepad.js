import { 
	BUTTON_P1, 
	BUTTON_P2,
	BUTTON_A, BUTTON_B, BUTTON_X, BUTTON_Y,
	BUTTON_LEFT_SHOULDER_BUTTON, BUTTON_RIGHT_SHOULDER_BUTTON, BUTTON_LEFT_SHOULDER_TWO, BUTTON_RIGHT_SHOULDER_TWO, 
	BUTTON_SELECT, BUTTON_START, 
	BUTTON_LEFT_S, BUTTON_RIGHT_S, 
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT
} from "./hardware/gamepad/gamepad-commands"

import { 
	GAME_PAD_CONNECTED, 
	GAME_PAD_DISCONNECTED,
	GamePadManager
} from "./hardware/gamepad/gamepad-manager.js"

import {
	PIMORONI_PICADE_MAX_CONTROLLER_PLAYER_1,
	PIMORONI_PICADE_MAX_CONTROLLER_PLAYER_2,
} from "./hardware/gamepad/gamepad-device-names.js"

import { PicadeLeds, PICADE_MAX_BUTTONS, picadeColor } from "./hardware/gamepad/picade-leds.js"

export const GAMEPAD_MODE_PERCUSSION = 'beats'
export const GAMEPAD_MODE_INSTRUMENT = 'instruments'
export const GAMEPAD_MODE_VFX = 'vfx'
export const GAMEPAD_MODE_CONTROLS = 'controls'

export const GAMEPAD_MODES = [
	GAMEPAD_MODE_PERCUSSION,
	GAMEPAD_MODE_INSTRUMENT,
	GAMEPAD_MODE_VFX,
	GAMEPAD_MODE_CONTROLS
]

const PICADE_GAMEPAD_IDS = new Set([
	PIMORONI_PICADE_MAX_CONTROLLER_PLAYER_1,
	PIMORONI_PICADE_MAX_CONTROLLER_PLAYER_2,
])

const PICADE_BUTTON_MAP = Object.freeze({
	[BUTTON_Y]: 0,
	[BUTTON_X]: 1,
	[BUTTON_LEFT_SHOULDER_BUTTON]: 2,
	[BUTTON_B]: 3,
	[BUTTON_A]: 4,
	[BUTTON_RIGHT_SHOULDER_BUTTON]: 5,
})

const PICADE_SOUND_COLORS = Object.freeze({
	kick: picadeColor('#ff1744', 24),
	snare: picadeColor('#ffb000', 22),
	hat: picadeColor('#b6ff00', 18),
	hatAccent: picadeColor('#ffe600', 20),
	clap: picadeColor('#fff4a3', 18),
	cowbell: picadeColor('#00e5ff', 18),
	timbre: picadeColor('#c77dff', 16),
	mode: picadeColor('#ffffff', 14),
})

const PICADE_BUTTON_LIGHTS = Object.freeze({
	[BUTTON_Y]: { led: 0, color: PICADE_SOUND_COLORS.snare },
	[BUTTON_X]: { led: 1, color: PICADE_SOUND_COLORS.kick },
	[BUTTON_LEFT_SHOULDER_BUTTON]: { led: 2, color: PICADE_SOUND_COLORS.hat },
	[BUTTON_B]: { led: 3, color: PICADE_SOUND_COLORS.clap },
	[BUTTON_A]: { led: 4, color: PICADE_SOUND_COLORS.timbre },
	[BUTTON_RIGHT_SHOULDER_BUTTON]: { led: 5, color: PICADE_SOUND_COLORS.clap },
	[BUTTON_LEFT_SHOULDER_TWO]: { led: 2, color: PICADE_SOUND_COLORS.cowbell },
	[BUTTON_RIGHT_SHOULDER_TWO]: { led: 5, color: PICADE_SOUND_COLORS.hatAccent },
	[BUTTON_P1]: { led: 1, color: PICADE_SOUND_COLORS.kick },
	[BUTTON_P2]: { led: 0, color: PICADE_SOUND_COLORS.snare },
	[DIRECTION_LEFT]: { led: 1, color: PICADE_SOUND_COLORS.kick },
	[DIRECTION_RIGHT]: { led: 0, color: PICADE_SOUND_COLORS.snare },
	[DIRECTION_UP]: { led: 2, color: PICADE_SOUND_COLORS.hat },
	[DIRECTION_DOWN]: { led: 5, color: PICADE_SOUND_COLORS.cowbell },
})

const formatGamePadButtonName = button => String(button)
	.replace(/^button[-_]?/i, '')
	.replace(/^direction[-_]?/i, 'D-pad ')
	.replace(/^game[-_]?pad[-_]?/i, '')
	.split(/[-_]/)
	.filter(Boolean)
	.map(part => part.charAt(0).toUpperCase() + part.slice(1))
	.join(' ')

const getGamePadStatusId = gamePad => `gamepad-${gamePad?.index ?? gamePad?.gamepad?.index ?? 'unknown'}`
const getGamePadStatusLabel = gamePad => gamePad?.gamepad?.id ?? 'Gamepad'
const getGamePadPlayerLabel = gamePadPlayerIndex => gamePadPlayerIndex > -1 ? `Player ${gamePadPlayerIndex + 1}` : 'No player selected'
const setGamePadStatus = (application, gamePad, gamePadPlayerIndex, detail = '', active = false) => {
	if (!gamePad) {
		return
	}

	application.setInputStatus?.(getGamePadStatusId(gamePad), {
		type: 'gamepad',
		label: getGamePadStatusLabel(gamePad),
		detail: detail || getGamePadPlayerLabel(gamePadPlayerIndex),
		connected: true,
		active,
		ttl: active ? 1400 : undefined,
	})
}

const isPicadeGamepad = gamePad => PICADE_GAMEPAD_IDS.has(gamePad?.gamepad?.id)
const getEventGamePad = (value, gamePad) => gamePad ?? (value?.gamepad ? value : null)
const getPicadeFallbackLed = button => {
	const name = String(button)
	let hash = 0
	for (let index = 0; index < name.length; index++) {
		hash += name.charCodeAt(index)
	}
	return hash % PICADE_MAX_BUTTONS
}
const getPicadeReleaseFadeDuration = heldFor => {
	const heldSeconds = Math.max((heldFor ?? 0) / 1000, 0)
	return Math.min(Math.max(heldSeconds * 0.6, 0.12), 2.4)
}
const getApplicationState = (application, key) => application.getState?.(key) ?? application.stateMachine?.get?.(key)
const fadePicadeClockButton = (application, buttonIndex, color, options) => {
	if (application.picadeHeldLights?.has(buttonIndex)) return
	application.picadeLeds.fadeButton(buttonIndex, color, null, options)
}

const ensurePicadeLeds = async application => {
	if (application.picadeLeds) return application.picadeLeds
	const picadeLeds = new PicadeLeds()
	application.picadeLeds = picadeLeds
	try {
		await picadeLeds.connect()
		application.setFeedback?.("Picade lights connected", 0, 'gamepad')
	} catch (error) {
		console.warn("Unable to connect Picade lights", error)
		application.setFeedback?.("Picade lights unavailable", 0, 'gamepad')
	}
	return picadeLeds
}

const flashPicadeButton = (application, gamePad, button, isButtonHeld, heldFor) => {
	if (
		button === GAME_PAD_CONNECTED ||
		button === GAME_PAD_DISCONNECTED ||
		!isPicadeGamepad(gamePad) ||
		!application.picadeLeds?.connected
	) {
		return
	}
	const light = PICADE_BUTTON_LIGHTS[button]
	const buttonIndex = light?.led ?? PICADE_BUTTON_MAP[button] ?? getPicadeFallbackLed(button)
	const color = light?.color ?? PICADE_SOUND_COLORS.mode
	application.picadeHeldLights ??= new Set()
	if (isButtonHeld) {
		application.picadeHeldLights.add(buttonIndex)
		application.picadeLeds.setButton(buttonIndex, color)
	}else{
		application.picadeHeldLights.delete(buttonIndex)
		application.picadeLeds.fadeButton(buttonIndex, color, null, {
			duration: getPicadeReleaseFadeDuration(heldFor),
		})
	}
}

const pulsePicadeClock = (application, isBar) => {
	const picadeLeds = application.picadeLeds
	if (!picadeLeds?.connected) return

	const isMetronomeEnabled = getApplicationState(application, 'metronome')
	const isBackingTrackEnabled = getApplicationState(application, 'backingTrack')

	const clock = application.clock
	const divisionsElapsed = clock?.divisionsElapsed
	if (!Number.isFinite(divisionsElapsed) || application.picadeClockLightDivision === divisionsElapsed) {
		return
	}

	application.picadeClockLightDivision = divisionsElapsed

	const totalDivisions = Math.max(clock?.totalDivisions ?? 96, 4)
	const divisionsPerQuarter = Math.max(1, Math.round(totalDivisions / 4))
	const divisionsPerEighth = Math.max(1, Math.round(divisionsPerQuarter / 2))
	const quarterIndex = Math.floor(divisionsElapsed / divisionsPerQuarter) % 4

	if ((isMetronomeEnabled || !isBackingTrackEnabled) && (isBar || clock?.isAtStart)) {
		fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_B], PICADE_SOUND_COLORS.mode, { duration: 0.22 })
	}

	if (!isBackingTrackEnabled) return

	if (isBar || clock?.isAtStart) {
		fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_X], PICADE_SOUND_COLORS.kick, { duration: 0.5 })
		fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_A], PICADE_SOUND_COLORS.kick, { duration: 0.7 })
		return
	}

	if (divisionsElapsed % divisionsPerQuarter === 0) {
		if (quarterIndex === 2) {
			fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_X], PICADE_SOUND_COLORS.kick, { duration: 0.42 })
		}else{
			fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_Y], PICADE_SOUND_COLORS.snare, { duration: 0.34 })
		}
	}

	if (divisionsElapsed % divisionsPerEighth === 0) {
		const color = (divisionsElapsed / divisionsPerEighth) % 2 === 0 ? PICADE_SOUND_COLORS.hat : PICADE_SOUND_COLORS.hatAccent
		fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_LEFT_SHOULDER_BUTTON], color, { duration: 0.18 })
		fadePicadeClockButton(application, PICADE_BUTTON_MAP[BUTTON_RIGHT_SHOULDER_BUTTON], color, { duration: 0.18 })
	}
}


const convertGamePadActionToMusic = ( application, gamePad, button, isButtonHeld, heldFor, gamePadPlayerIndex ) => {

	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
	const person = application.personManager.getSelectedPerson()

	// Instruments need both values
	// switch(button)
	// {

	// }

	// One shots just need triggers
	if (!isButtonHeld){
		return
	}
	
	switch(button)
	{
		// case LEFT_STICK_Y: 
		// case RIGHT_STICK_Y: 
			
		// case LEFT_STICK_X: 
		// case RIGHT_STICK_X:
		// 	person.loadPreviousInstrument()
		// 	break

		case DIRECTION_UP: 
			if (isUnselected)
			{
				application.setVolume( application.getVolume() + 1 )
			}else{
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend( pitchBend+0.5 )
			}
			break
		
		case DIRECTION_DOWN: 
			if (isUnselected)
			{
				application.setVolume( application.getVolume() - 1 )
			}else{
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend( pitchBend-0.5 )
			}
			break

		case DIRECTION_LEFT: 
			if (isUnselected)
			{
				application.setBPM( clock.BPM - 1 )
			}else{
				person.loadPreviousInstrument()
			}
			break

		case DIRECTION_RIGHT: 
			if (isUnselected)
			{
				application.setBPM( clock.BPM + 1 )
			}else{
				person.loadNextInstrument()
			}
			break

		case BUTTON_A: 
			console.info("Gamepad A", isButtonHeld, { gamePad, heldFor } )
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
		
		case BUTTON_B: 
			console.info("Gamepad B", isButtonHeld, { gamePad, heldFor } )
			break
		
		case BUTTON_X: 
			console.info("Gamepad X", isButtonHeld, { gamePad, heldFor } )
			// application.getPerson(2).toggleForm() 
			if (isUnselected)
			{
				application.kit.kick()
			}else{
				person.loadPreviousInstrument()
				//application.getPerson(gamePadPlayerIndex) 
			}
			break
		
		case BUTTON_Y: 
			console.info("Gamepad Y", isButtonHeld, { gamePad, heldFor } )
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
		case BUTTON_LEFT_SHOULDER_BUTTON: 
			// application.stateMachine.get("")
			console.info("Gamepad LB", isButtonHeld, { gamePad, heldFor } )
			if (isUnselected)
			{
				application.kit.hat()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break

		case BUTTON_RIGHT_SHOULDER_BUTTON: 
			if (isUnselected)
			{
				application.kit.clap()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad RB", isButtonHeld, { gamePad, heldFor } )
			break

		case BUTTON_LEFT_SHOULDER_TWO: 
			if (isUnselected)
			{
				application.kit.cowbell()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad LT", isButtonHeld, { gamePad, heldFor } )
			break

		case BUTTON_RIGHT_SHOULDER_TWO: 
			if (isUnselected)
			{
				application.kit.hat()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			console.info("Gamepad RT", isButtonHeld, { gamePad, heldFor } )
			break

		case BUTTON_P1: 
			if (isUnselected)
			{
				application.kit.kick()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break

		case BUTTON_P2: 
			if (isUnselected)
			{
				application.kit.snare()
			}else{
				//application.getPerson(gamePadPlayerIndex) 
			}
			break
		
		default:
			console.info("Gamepad", { button, value: isButtonHeld, gamePad, heldFor } )
	}
}

const convertGamePadActionToPercussion = ( application, gamePad, button, isButtonHeld, heldFor, gamePadPlayerIndex ) => {
	const getChokeDuration = heldMilliseconds => {
		const heldSeconds = Math.max((heldMilliseconds ?? 0) / 1000, 0)
		return Math.min(Math.max(heldSeconds * 0.25, 0.005), 0.4)
	}

	const triggerOrChoke = drum => {
		if (isButtonHeld)
		{
			drum()
		}else{
			drum.choke?.(getChokeDuration(heldFor))
		}
	}

	switch(button)
	{
		case DIRECTION_UP: 
			triggerOrChoke(application.kit.hat)
			break
		
		case DIRECTION_DOWN: 
			triggerOrChoke(application.kit.cowbell)
			break

		case DIRECTION_LEFT: 
			triggerOrChoke(application.kit.kick)
			break

		case DIRECTION_RIGHT: 
			triggerOrChoke(application.kit.snare)
			break

		case BUTTON_A: 
			if (isButtonHeld)
			{
				application.setRandomDrumTimbres()
			}
			break
		
		case BUTTON_B: 
			if (isButtonHeld)
			{
				application.setRandomDrumPattern()
			}
			break
		
		case BUTTON_X: 
			triggerOrChoke(application.kit.kick)
			break
		
		case BUTTON_Y: 
			triggerOrChoke(application.kit.snare)
			break
		
		// Left Back Trigger
		case BUTTON_LEFT_SHOULDER_BUTTON: 
			triggerOrChoke(application.kit.snare)
			break

		// TODO: SWING!
		case BUTTON_RIGHT_SHOULDER_BUTTON: 
			triggerOrChoke(application.kit.snare)
			break

		case BUTTON_LEFT_SHOULDER_TWO: 
			triggerOrChoke(application.kit.cowbell)
			break

		case BUTTON_RIGHT_SHOULDER_TWO: 
			triggerOrChoke(application.kit.hat)
			break

		case BUTTON_P1: 
			triggerOrChoke(application.kit.kick)
			break

		case BUTTON_P2: 
			triggerOrChoke(application.kit.snare)
			break
		
		default:
			if (isButtonHeld)
			{
				application.kit.cowbell()
			}
			console.info("Gamepad", { button, value: isButtonHeld, gamePad, heldFor } )
	}
}

// Just alter the visuals!
const convertGamePadActionToVFX = ( application, gamePad, button, isButtonHeld, heldFor, gamePadPlayerIndex ) => {
	// One shots just need triggers
	if (!isButtonHeld){
		return
	}

	const cameraPan = application.cameraPan
	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
					
	switch(button)
	{
		// ignore caching these
		case GAME_PAD_CONNECTED:
		case GAME_PAD_DISCONNECTED:
		// 
		case DIRECTION_UP: 
			cameraPan.y -= .5;
			break
		
		case DIRECTION_DOWN: 
			cameraPan.y += .5;
			break
		
		case DIRECTION_LEFT: 
			cameraPan.x -= .5;
			break

		case DIRECTION_RIGHT: 
			cameraPan.x += .5;
			break
		
		default:
			// if select is also being held....
			if (gamePad?.select){
				application.toggleDiscoMode()
			}else{
			
				application.display?.nextFilter?.( )
			}
			break
	}
}

/**
 * For controlling modes and loading specific instruments
 */
const convertGamePadActionToControl = ( application, gamePad, button, isButtonHeld, heldFor, gamePadPlayerIndex ) => {

	// One shots just need triggers
	if (!isButtonHeld){
		return
	}	

	const clock = application.clock
	const isUnselected = gamePadPlayerIndex === -1
	const person = application.personManager.getSelectedPerson()

	switch(button)
	{
		case DIRECTION_UP: 
			application.setVolume( application.getVolume() + 1 )
			break
		
		case DIRECTION_DOWN: 
			application.setVolume( application.getVolume() - 1 )
			break

		case DIRECTION_LEFT: 
			if (isUnselected)
			{

			}else{
				person.loadPreviousInstrument()
			}
			break

		case DIRECTION_RIGHT: 
			if (isUnselected)
			{

			}else{
				person.loadNextInstrument()
			}
			break
		
		case BUTTON_A: 
			if (isUnselected)
			{

			}else{
				// open player menu
			}
			break
		
		case BUTTON_B: 
			application.setDiscoMode()
			break
		
		case BUTTON_X: 
			application.setRandomDrumTimbres()
			break
		
		case BUTTON_Y: 
			application.setRandomDrumPattern()
			break

		case BUTTON_LEFT_SHOULDER_BUTTON:
			application.setVolume( application.getVolume() - 1 )
			break

		case BUTTON_RIGHT_SHOULDER_BUTTON:
			application.setVolume( application.getVolume() + 1 )
			break

		default:			
			application.setRandomDrumPattern()
	}
}

export const GAMEPAD_MODE_METHODS = Object.freeze({
	[GAMEPAD_MODE_PERCUSSION]: convertGamePadActionToPercussion,
	[GAMEPAD_MODE_INSTRUMENT]: convertGamePadActionToMusic,
	[GAMEPAD_MODE_VFX]: convertGamePadActionToVFX,
	[GAMEPAD_MODE_CONTROLS]: convertGamePadActionToControl,
})

const wrapModeIndex = index => (index + GAMEPAD_MODES.length) % GAMEPAD_MODES.length

export const getGamePadModeMethod = mode => GAMEPAD_MODE_METHODS[mode] ?? GAMEPAD_MODE_METHODS[GAMEPAD_MODE_PERCUSSION]

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
	
	let gamePadModeIndex = GAMEPAD_MODES.indexOf(GAMEPAD_MODE_PERCUSSION)
	let gamePadMethod = getGamePadModeMethod(GAMEPAD_MODES[gamePadModeIndex])

	let gamePadPlayerIndex = personManager.getSelectedPerson() ?? -1
	
	const setMode = mode => {
		gamePadModeIndex = wrapModeIndex(mode)
		const modeName = GAMEPAD_MODES[gamePadModeIndex]
		gamePadMethod = getGamePadModeMethod(modeName)
		return modeName
	}

	gamePadManager.addEventListener( async ( eventName, value, gamePad, heldFor ) => {
		const activeGamePad = getEventGamePad(value, gamePad)
		console.info("GAMEPAD:", {eventName, value, gamePad: activeGamePad, heldFor}, arguments )
		switch(eventName)
		{
			// ignore caching these
			case GAME_PAD_CONNECTED:
			case GAME_PAD_DISCONNECTED:
			// case UP: 
			// case DOWN: 
			// case LEFT: 
			// case RIGHT: 
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
				if (isPicadeGamepad(activeGamePad)) {
					await ensurePicadeLeds(application)
				}
				application.setFeedback( "Gamepad connected" , 0, 'gamepad' )
				setGamePadStatus(application, activeGamePad, gamePadPlayerIndex, `${getGamePadPlayerLabel(gamePadPlayerIndex)} / Connected`)
				console.info("Gamepad connected", eventName, value, activeGamePad )
				break

			case GAME_PAD_DISCONNECTED:
				application.setFeedback( "Gamepad connection lost" , 0, 'gamepad' )
				if (activeGamePad) {
					application.clearInputStatus?.(getGamePadStatusId(activeGamePad))
				}
				console.info("Gamepad disconnected", eventName, value, activeGamePad )
				break
		}

		// on press not release
		if (value)
		{
			switch(eventName)
			{
				// This changes the "selected" user by highlighting their outline
				// this then targets the controller for that specfific person.	
				case BUTTON_SELECT: 
					// We can check to see if we are deslected
					const currentlySelected = personManager.selectedPersonIndex
					const isLastPersonSelected = currentlySelected >= playerQuantity - 1
					
					// the final player is currently selected so we now deselect ALL!
					if (isLastPersonSelected || gamePad.start){
						gamePadPlayerIndex = -1
						application.setFeedback( "NO PLAYER SELECTED" , 0, 'gamepad' )
						personManager.deselectPeople()
						personManager.unhighlightPeople()
					}else{
						personManager.selectPerson( currentlySelected + 1 )
						gamePadPlayerIndex = personManager.selectedPersonIndex
						personManager.highlightPerson( gamePadPlayerIndex )
						application.setFeedback( "PLAYER "+gamePadPlayerIndex + " HAS BEEN SELECTED", 0, 'gamepad' )
						console.info("Gamepad select", value, gamePad )
					}
					setGamePadStatus(application, activeGamePad, gamePadPlayerIndex, `${getGamePadPlayerLabel(gamePadPlayerIndex)} / Select`, true)
					break
				
				case BUTTON_START: 
					const mode = setMode( gamePadModeIndex + 1 )
					application.setFeedback( mode + " mode", 0, 'gamepad' )
					setGamePadStatus(application, activeGamePad, gamePadPlayerIndex, `${getGamePadPlayerLabel(gamePadPlayerIndex)} / ${mode}`, true)
					console.info("Gamepad START", value, activeGamePad, mode )
					// check to see if another key is held down...
					break
			}
		}

		if (
			activeGamePad &&
			eventName !== GAME_PAD_CONNECTED &&
			eventName !== GAME_PAD_DISCONNECTED &&
			value
		) {
			setGamePadStatus(
				application,
				activeGamePad,
				gamePadPlayerIndex,
				`${getGamePadPlayerLabel(gamePadPlayerIndex)} / ${formatGamePadButtonName(eventName)}`,
				true
			)
		}

		flashPicadeButton(application, activeGamePad, eventName, value, heldFor)
		gamePadMethod( application, activeGamePad, eventName, value, heldFor, gamePadPlayerIndex )
	})

	// update game pads on beat
	application.setUpdateCallback( (isBar) => {
		gamePadManager.update()
		pulsePicadeClock(application, isBar)
	})
}
