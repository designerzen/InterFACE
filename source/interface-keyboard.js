
/**
 *  Add Keyboard listeners and tie in commands
 */
const addKeyboardEvents = ( application ) => {
	let numberSequence = ""

	window.addEventListener('keydown', async (event)=>{

		const isNumber = !isNaN( parseInt(event.key) )
		const focussedElement = document.activeElement

		// Allow Tab to continue to perform its default function
		if ( event.key !== 'Tab' ){
			event.preventDefault()
		}
		
		// Contextual hotkeys - if something is focussed then different keys!
		if (focussedElement && focussedElement !== document.documentElement )
		{
			// not body!
			switch(focussedElement.nodeName)
			{
				case "BUTTON":
					// see if a sample is focussed and if so do something different
					if ( focussedElement.classList.contains("button-play-pause") ){
						// find nearest audio element?

						const audio = focussedElement.parentElement.querySelector("audio")
						const rate = isNumber ? 
							parseInt(event.key) : 
							// check to see if this is a+ or - or up or down
							event.key === 'ArrowRight' ? 
								audio.playbackRate + 0.1 :
								event.key === 'ArrowLeft' ? 
									audio.playbackRate - 0.1 :
									0.2 + Math.random() * 3

						const pitch = isNumber ? 
							parseInt(event.key) : 
							// check to see if this is a+ or - or up or down
							event.key === 'ArrowUp' ? 
								audio.detune.value + 10 :
								event.key === 'ArrowDown' ? 
									audio.detune.value - 10 :
									0.2 + Math.random() * 3

						audio.playbackRate = rate

						// value in cents
						audio.detune.value = pitch
						
						return

					}else{
						
					}
					break

				// 
				case "DIALOG":

					break
				
			}

			// we should quit here?
		}

		
		switch(event.key)
		{
			case 'CapsLock':
				const isDebug = application.stateMachine.toggle( "debug" )
				application.people.forEach( person => person.debug = isDebug )
				// speak( isDebug ? "secret mode unlocked" : "disabling developer mode", true)
				application.setFeedback( isDebug ? 'Debug Mode enabled' : 'Debug Mode disabled', 0, 'debug' )
				break

			case 'Del':
			case 'Delete':
				application.setRandomDrumTimbres()
				break

			case 'Enter':
				if (event.ctrlKey)
				{
					application.setFeedback( 'Press ESC to exit Full Screen', 0, 'fullscreen' )
					application.toggleFullScreen()
				}else{
					application.loadRandomInstrument() 
				}
				break

			case 'Space':
				if (event.ctrlKey)
				{
					application.setFeedback( 'Press ESC to exit Full Screen', 0, 'fullscreen' )
					application.toggleFullScreen()
				}else{
					application.loadRandomInstrument() 
				}
				break

			case 'QuestionMark':
			case '?':
				// read out last bit of help?
				application.speak(feedbackElement.textContent, true)
				break

			// Arrows set timing
			case 'ArrowLeft':
				application.setBPM( clock.BPM - ( event.shiftKey ? 10 : event.ctrlKey ? 25 : 1 ) )
				break

			case 'ArrowRight':
				application.setBPM( clock.BPM + ( event.shiftKey ? 10 : event.ctrlKey ? 25 : 1 ) )
				break

			case 'ArrowUp':
				if (event.ctrlKey || event.shiftKey)
				{
					application.clock.totalBars++
					application.setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')						
				}else{
					// get existing pitchbend value
					const person = application.getPerson(0)
					const pitchBend = person.activeInstrument.pitchOffset
					person.activeInstrument.pitchBend( pitchBend+0.5 )
					// console.log("Pitchbending UP!", getPerson(0) )
				}

				break

			// change amount of bars
			case 'ArrowDown':
				if (event.ctrlKey || event.shiftKey)
				{
					application.clock.totalBars--
					setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')
				}else{
					const person = application.getPerson(0)
					const pitchBend = person.activeInstrument.pitchOffset
					person.activeInstrument.pitchBend( pitchBend-0.5 )
				}
				break

			case ',':
				application.setNodeCount(-1)
				break

			case '.':
				application.setNodeCount(1)
				break

			case 'a':
				application.kit.kick()
				break

			case 'b':
				application.toggleBackgroundPercussion()
				break
		
			case 'c':
				application.stateMachine.toggle("clear", application.buttonClearToggle )
				break

			case 'd':
				application.setDiscoMode()
				break

			case 'e':
				application.kit.clack()
				break

			case 'f':
				application.toggleVisibility( controlPanel )
				break

			case 'g':
				const isVisisble = application.toggleVisibility(document.getElementById("feedback") )
				application.toggleVisibility(document.getElementById("toast") )
				application.stateMachine.set("text", isVisisble )
				break

			case 'h':
				application.toggleVisibility(canvasElement)
				break

			// Change impulse filter in the reverb
			case 'i':
				const reverb = await application.setReverb()
				application.setFeedback( `Reverb : '${reverb}' loaded`, 0, 'tempo')
				break

			case 'j':
				application.previousInstrument()
				break

			// kid mode / advanced mode toggle
			// case 'k':
			// 	//doc.documentElement.classList.toggle('advanced', advancedMode)
			// 	//doc.documentElement.classList.toggle(CSS_CLASS, false)
			// 	break
			case 'k':
				application.nextInstrument() 
				break

			// toggle speech
			case 'l':
				application.stateMachine.toggle("speak", application.buttonSpeakToggle )
				application.setFeedback( application.stateMachine.get("speak") ? `Reading out instructions` : `Staying quiet`, 0, 'voice' )
				break
		
			case 'm':
				const isMetronomeEnabled = application.stateMachine.toggle("metronome", buttonMetronomeToggle )
				application.setFeedback( isMetronomeEnabled ? `Quantised enabled` : `Quantise disabled` )
				break

			case 'n':
				application.toggleVideoFrameCopy()
				break

			case 'o':
				if (application.midiPerformance){

				}
				break

			case 'p':
				if (application.midiPerformance){
					const commands = application.midiPerformance.getNextCommands()
					commands.forEach( command => {
						command.type === COMMAND_NOTE_ON ?
							samplePlayer.noteOn() : 
							samplePlayer.noteOff()
					})
					
				}
				break

			case 'q':
				// FIXME: 
				application.stateMachine.toggle("muted" )
				break
		
			case 'r':
				application.toggleRecording()
				break

			case 's':
				application.kit.snare()
				break

			case 't':
				application.stateMachine.toggle("text" )
				break

			case 'u':
				application.setRandomDrumPattern()
				if (event.ctrlKey)
				{
					application.setRandomDrumTimbres()
				}else if (event.shiftKey){
					application.setRandomDrumTimbres()
				}else{
					application.loadRandomInstrument() 
				}
				break

			// Hide video
			case 'v':
				// FIXME: Also enable sync?
				application.toggleVideoOutput()
				break

			case 'w':
				application.kit.cowbell()
				break
		
			case 'x':
				// if the time since last one is too great clear?
				const tappedTempo = application.tapTempo()
				if (tappedTempo > 1)
				{
					application.setBPM(tappedTempo)
				}
				//console.log("tappedTempo",tappedTempo)
				break

			// Reset help!
			case 'y':
				application.counter = 0
				break
		

			// FIXME: Reset help!
			case 'z':
				// const predictions = getPerson(0).parameterRecorder.export()
				// console.log(predictions)
				application.setRandomDrumTimbres()
				break
		
			// // Swutch between the various displays
			// case "F1":
			// 	event.preventDefault()
			// 	application.switchDisplay( DISPLAY_CANVAS_2D, predictionLoop )
			// 	break
			// case "F2":
			// 	event.preventDefault()
			// 	application.switchDisplay( DISPLAY_MEDIA_VISION_2D, predictionLoop )
			// 	break
			// case "F3":
			// 	event.preventDefault()
			// 	application.switchDisplay( DISPLAY_WEB_GL_3D, predictionLoop )
			// 	break
			// case "F4":
			// 	event.preventDefault()
			// 	application.switchDisplay( DISPLAY_LOOKING_GLASS_3D, predictionLoop )
			// 	break
			// case "F5":
			// 	event.preventDefault()
			// 	application.switchDisplay( DISPLAY_COMPOSITE, predictionLoop )
			// 	break

			case "F1":
				event.preventDefault()
				const player1 = application.getPerson(0)
				application.configurePerson(player1, player1.type+1 )
				break

			case "F2":
				event.preventDefault()
				const player2 = application.getPerson(1)
				application.configurePerson(player2, player2.type+1 )
				break

			case "F3":
				event.preventDefault()
				const player3 = application.getPerson(2)
				application.configurePerson(player3, player3.type+1 )
				break

			case "F4":
				event.preventDefault()
				const player4 = application.getPerson(3)	
				application.configurePerson(player4, player4.type+1 )
				break
		
			// Media Hotkeys

			// Launch Media
			case "LaunchMediaPlayer":
				event.preventDefault()
				application.nextInstrument() 
				break

			// Previous Track
			case "MediaTrackPrevious":
				event.preventDefault()
				application.previousInstrument()
				break

			// Play / Pause Percussion
			case "MediaPlayPause":
				event.preventDefault()
				application.toggleBackgroundPercussion()
				break

			// Next Track
			case "MediaTrackNext":
				event.preventDefault()
				application.nextInstrument() 
				break
				



			// Previous Track
			case "F10":
				event.preventDefault()
				break

			// Play / Pause Percussion
			case "F11":
				event.preventDefault()
				break

			// Next Track
			case "F12":
				event.preventDefault()
				break

			case "F13":
				event.preventDefault()
				break

			case "F14":
				event.preventDefault()
				break

			case "F15":
				event.preventDefault()
				break

			case "F16":
				event.preventDefault()
				break

			case "F17":
				event.preventDefault()
				break

			case "F18":
				event.preventDefault()
				break

			case "F19":
				event.preventDefault()
				break

			// don't hijack tab you numpty!
			// FILTER
			case 'Tab':
				break

			default:
				// check if it is numerical...
				// or if it is a media key?
				if (!isNumber)
				{
					// loadRandomInstrument()
					// speak("Loading random instruments",true)	
				}
				console.log("Key pressed", {event,isNumber,activeElement} )
		}

		// Check to see if it is a number
		if (isNumber)
		{
			numberSequence += event.key
			// now check to see if it is 3 numbers long
			if (numberSequence.length === 3)
			{
				// this is a tempo!
				const tempo = parseFloat(numberSequence)
				application.setBPM(tempo)
				// reset
				numberSequence = ''
			}

		}else{

			numberSequence = ''
		}

		// we run this when we want to ???
		// addToHistory(ui, event.key)
		// console.log("key", ui, event)
	})
}
