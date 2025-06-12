/**
 * The flow for MIDI devices is as such
 * 
 * Once user touch has been established... connect to MIDI manager
 * Watch for devices to be attached or detached
 * Check to see if any devices are *already* connected
 * 
 * As soon as *any* device is available - update the UI as such :
 * A MIDI Device has inputs and outputs
 * 
 * MIDI Inputs allow us to use the clock rate from an external source
 * as well as read any MIDI events dispatched from the MIDI device such as noteOn / Off
 * 
 * MIDI Outputs allow us to send MIDI events to external devices
 * This is the more common use for this application
 * 
 * A 
 */

import { setToast } from "./tooltips.js"

/**
 * Create a MIDI dialogue popover with MIDI options and also add
 * each MIDI device to the settings form
 * 
 * @param {Array} outputs 
 * @param {Array} inputs 
 * @param {Event} event 
 */
export const setupMIDIDialog = (outputs, inputs, event) => {

	return
	// there is a popover dialog

	const dialog = document.getElementById('select-midi')
	const deviceStatus = document.getElementById('select-midi-output')

	const deviceList = outputs.map( o => `<label>${o.name}<input class="midi-output" type="radio" value="${o.id}" /></label>` ).join("")
	const syncSelector = `<label><select><option>Sync to internal clock</option></select></label>`
	console.warn("updateMIDIDevicesStatus", {outputs, inputs, event, deviceStatus, deviceList})
	
	deviceStatus.innerHTML = deviceList + syncSelector

	dialog.open = true
}

/**
 * So *Each* MIDI Device has it's own custom form that offers the following options
 * and affords selecting multiple options for each setting
 * 
 * DEVICE NAME (ICON) / MANUFACTURER 
 * [Person A / Person B / Person C / Person D / All People] 
 * [MIDI Channel 0-16 / ALL Channels]
 * 
 * @returns 
 */
const createMIDIDeviceForm = (midiDevice) => {

	const midiDeviceName = ``
	const midiDeviceId = ``

	// Choose which channel to output the MIDI data to
	const midiDeviceSelection = `<select name="${midiDeviceId}" multiple>
		<option>123</option>
		<option>456</option>
		<option>789</option>
	</select>`

	return midiDeviceSelection
}

/**
 * Create a custom midi devices form by looping through all
 * available midi outputs and showing them as routing options
 * @param {*} outputs 
 * @param {*} inputs 
 * @param {*} event 
 * 
 * £3100 dividends
 * sip pension
 * £300 for party - Staff welfare
 * 150 for me + 150 for another (£50 )
 * 
 * @returns 
 */
const setupMIDIDeviceForm = (outputs, inputs, event) => {

	// we want to show each MIDI output as a multiple select box?
	const formElements = outputs.map( output => createMIDIDeviceForm(output) )
	console.log("setupMIDIDeviceForm", {formElements, outputs, inputs, event} )

	return formElements.join("")
}

/**
 * Show that MIDI confg and hardware are available / unavailable
 * @param {Array} outputs - MIDI Devices we want to use
 */
const updateMIDIDevicesStatus = (midiButton, midiManager, people, outputs, inputs, event, setFeedback)=>{
	
	const midiDevicesPanel = document.getElementById("midi-panel")
	const midiChannel = 0 // ui.midiChannel
	
	const outputDeviceQuantity = outputs.length
	const hasOutputs = outputDeviceQuantity>0
	const main = document.querySelector("main")
	const noDevicesPanel = document.getElementById("no-midi-devices")
	
	// if before this call we had no devices, show an extra message
	const hadDevicesPreviously = noDevicesPanel.hidden

	console.info("updateMIDIDevicesStatus", {
		hadDevicesPreviously,
		midiDevicesPanel,
		people,
		outputs, inputs, event, hasOutputs,
		midiManager,
		midiButton
	})
	
	// update panel options with available devices!
	setMIDIInputSelector( inputs )
	setMIDIOutputSelector( outputs )

	if (hasOutputs)
	{
		const midiDevices = outputs.map((midiInstrument,i) => midiInstrument.name || "MIDI Device "+i )
		let feedback = hadDevicesPreviously ? 
			`${midiDevices.length} MIDI Devices Detected!<br>${midiDevices.join( "<br>" )}` :
			`${midiDevices.length} MIDI Devices Connected :<br>${midiDevices.join( "<br>" )}`
		
		switch(outputDeviceQuantity)
		{
			// FIXME: 2 instruments have been connected,
			// we should send one to each instrument presumably?
			case 1:
				people.forEach( (person,personIndex) =>{

					//connectMIDIForPerson(i, outputs, ui.midiChannel)
					const port = outputs[ personIndex < outputs.length ? personIndex : 0 ]
					if (port)
					{
						// FIXME:
						
						person.setMIDI(port, midiChannel)	
						//console.info(ui.midiChannel, person.hasMIDI ? `Replacing` : `Enabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, midiDevices, personIndex, midiChannel}, midi.outputs[midiChannel])
					}else{
						console.error("No matching MIDI Instrument availbe for this person", ui.midiChannel, person.hasMIDI ? `Enabling` : `Disabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, portIndex: midiChannel} )
					}
				} )
				break

			default:
				// w00t
				// console.error("MIDI devices",midiInstrument, midiInstrumentName, outputs)
						
				// use this to fill the peoples
				people.forEach( (person,i) => connectMIDIForPerson(i, outputs, ui.midiChannel) )
				
				//midiButton.setText("Click to disable")
		}


		main.classList.toggle('midi-no-devices', false)
		main.classList.toggle('midi-connected', true)
		main.classList.toggle(`midi-devices-${outputDeviceQuantity}`, true)
		main.classList.toggle('midi-available', true )
		main.classList.remove(`midi-unavailable`)
			
		midiDevicesPanel.hidden = false

		setToast( feedback )
		// midiButton.setLabel(feedback)
		// midiButton.setText("<span class='hide-text'>Click to </span>Disable")
				
		// fixme: move to the case above for 2+
		setupMIDIDialog(outputs, inputs, event)
		
		const midiDevicesForm = setupMIDIDeviceForm(outputs, inputs, event)
		console.log("Midi devices form", {midiDevicesForm} )

	}else{

		// bugger - either we never had or we lost...
		setFeedback(hadDevicesPreviously ? "Lost MIDI Device connection" : "MIDI Available but no instruments detected", 0)
		setToast("No MIDI Devices connected")

		main.classList.toggle( 'midi-no-devices', true)
		main.classList.toggle( 'midi-connected', false)
		main.classList.toggle( 'midi-available', false )
		main.classList.toggle( 'midi-unavailable', true )
		
		midiDevicesPanel.hidden = true

		midiButton.element.classList.toggle(`connected`, false)
	}
	
	// FIXME: this changes the behaviour of the button
	// midiButton.setEnabled(hasOutputs)

	return hasOutputs
}

/**
 * Create an "otion" that will be added to the Selector
 * @param {*} name 
 * @param {*} value 
 * @returns 
 */
const createMIDIOption = (name, value=undefined) => `<option value="${value}">${name}</option>`


/**
 * set midi input options in the selector
 * @param {Array} ports 
 */
const setMIDIInputSelector = (ports) => {

	const noInputs = document.getElementById('no-midi-inputs')
	const inputs = document.getElementById('midi-inputs')
	const parent = inputs.parentNode
	const hasInputs = ports.length > 0
	if (!hasInputs)
	{
		// No MIDI clock devices available
		const message = document.getElementById("no-midi-inputs")
		inputs.innerHTML = createMIDIOption("Empty")
		console.info("MIDI:Input Hiding", {parent, ports, message} )	
	}else{
		const options = ports.map( port => createMIDIOption( port, port ) )
		inputs.innerHTML = options.join("")
		console.info("MIDI:Input Devices", {parent, inputs, options, ports} )	
	}
	parent.hidden = hasInputs
	noInputs.hidden = hasInputs
	console.info("setMIDIInputSelector", {parent, ports, inputs, parent} )
}

/**
 * set midi output options in the selector and show an
 * info message if midi is diabled or unavailable
 * @param {Array} ports 
 */
const setMIDIOutputSelector = (ports) => {
	
	const noDevicesPanel = document.getElementById("no-midi-devices")
	
	const noDevices = document.querySelector('[for="waiting-for-midi-devices"]')
	const noOutputs = document.getElementById('no-midi-outputs')
	const outputs = document.getElementById('midi-outputs')
	const parent = outputs.parentNode
	const hasOutputs = ports.length > 0
	if (!hasOutputs)
	{
		// no MIDI output devices!
		const message = document.getElementById("no-midi-outputs")
		outputs.innerHTML = createMIDIOption("Empty")
		console.info("MIDI:Output Hiding", {parent, ports, message} )	

	}else{
		
		const options = ports.map( port => createMIDIOption( port, port ) )
		outputs.innerHTML = options.join("")
		console.info("MIDI:Output Devices", { parent, outputs, options, ports } )
	}
	
	// reveal the no devices panel
	noDevicesPanel.hidden = hasOutputs

	parent.hidden = hasOutputs
	// show the spinner if no outputs (waiting for midi devices)
	noDevices.hidden = hasOutputs
	// hide the no-outputs message if there are outputs
	noOutputs.hidden = hasOutputs
}

/**
 * 
 * @param {Array} midiInputPort 
 */
export const observeMIDIPortClock = (midiInputPort) => {
	if (midiInputPort)
	{
		midiInputPort.addListener("clock", event => {
			console.info("External>MIDI>CLOCK:Devices", {event} )
		})
	}
}

/**
 * Enable MIDI manager to connect to a MIDI device
 * @param {Class} midiButton 
 * @param {Class} midiManager 
 * @param {Array<Class>} MIDIConnectionClasses 
 * @param {Array<Person>} people 
 * @returns Array of connections
 */
export const enableMIDI = async (midiButton, midiManager, MIDIConnectionClasses, people, setFeedback) => {

	const onMIDIUpdate = (outputs, inputs, event) => {

		console.info("Main>MIDI:Devices", {outputs, inputs, event })
		// 
		updateMIDIDevicesStatus(midiButton, midiManager, people, outputs, inputs, event, setFeedback) 
		

		// conenct to port clock...
		// const midiInput = midiManager.inputs[0]	
		// observeMIDIPortClock(midiInput)
	}

	const midiConnections = await midiManager.enable(MIDIConnectionClasses, onMIDIUpdate )

	// defer until awaited?
	setMIDIInputSelector( midiManager.inputs )
	setMIDIOutputSelector( midiManager.outputs )

	console.info("Main>MIDI:enableMIDI", {midiButton, midiManager, MIDIConnectionClasses, people })

	return midiConnections
}

/**
 * Disconnect the midi to either all ports or the ones specified
 * @param {Class} midiButton 
 * @param {Class} midiManager 
 */
export const disableMIDI = async (midiButton, midiManager) => {
	await midiManager.disable()
	// midiButton.setText()
}

/**
 *  a simple midi button with states just set the state with the return
 * @param {HTMLElement} buttonMIDI 
 * @param {Function} callback 
 * @returns 
 */
export const setupMIDIButton = (buttonMIDI, callback) => {
	
	let midiEnabled = false

	// Every other toggle
	const onToggleRequested = async (event) => {

		console.info("Toggle MIDI" )
		event.preventDefault()
		midiEnabled = !midiEnabled
		callback && callback(buttonMIDI, midiEnabled)
	}

	// don't hijack the event just piggyback
	// initialise MIDI connector
	const onStartRequested = async (event) => {
		
		console.info("Setting MIDI INIT" )
		// event.preventDefault()
		midiEnabled = true
		callback && callback(buttonMIDI, midiEnabled)
		//buttonMIDI.removeEventListener('mousedown', onStartRequested)
		// buttonMIDI.addEventListener('mousedown', onToggleRequested )
	
		return false
	}

	console.info("Setting MIDI action to", buttonMIDI )

	buttonMIDI.addEventListener('mousedown', onStartRequested, { once: true })
	
	return {
		element:buttonMIDI,
		getEnabled:()=>midiEnabled,
		setEnabled:(enabled=true)=>{
			midiEnabled = enabled
			buttonMIDI.classList.toggle(`connected`, enabled)
		},
		setText:text=>buttonMIDI.innerHTML = text,
		setLabel:text=>buttonMIDI.setAttribute("aria-label",text)
	}
}

/**
 * FIXME: 
 * Update the GUI to show that MIDI instrument is available
 * NB. MIDI will require a user interaction to initiate
 */
export const createMIDIButton = async ( midiManager, MIDIConnectionClasses, people, setFeedback ) => {

	const midiToggleButton = document.getElementById("button-midi")

	// to skip clicking but results in a warning
	return setupMIDIButton( 

		midiToggleButton, 
		
		async (b) => {

			let midiPortAttempts

			try{
				// on button click we attempt to connect to midi
				midiPortAttempts = await enableMIDI( midiToggleButton, midiManager, MIDIConnectionClasses, people )
				// this needs a user interaction to trigger
				setFeedback( midiPortAttempts.length > 0  ?
					"MIDI available<br>Connecting to instruments..." :
					"No MIDI Devices available" )					
					
			}catch(error){
				
				// this needs a user interaction to trigger
				setFeedback( "No MIDI Devices Available<br>"+error )
			}
			
			return midiPortAttempts.length > 0
		}
	)
}

/**
 * Setup the MIDI buttons and controls as well as the result
 * feedback from any probing
 * @param {Object} options 
 */
export const setMIDIControls = async ( midiManager, MIDIConnectionClasses, people, options, setFeedback ) => {

	// to skip clicking but results in a warning
	
	// button on the DOM that will trigger :
	// 1. MIDI initiation routine and MIDI port probing
	// 2. 
	const midiEnableButton = document.getElementById("button-midi")
	const midiToggleButton = document.getElementById("toggle-midi")
	const outputMIDIInputs = document.getElementById('midi-inputs-output')
	const outputMIDIOutputs = document.getElementById('midi-outputs-output')
	
	// we can also start the MIDI initi via the opening of the parent item...
	const midiPanelAnchor = document.querySelector('[href="#folder-midi"]')

	// attempt to create any midi connections 
	const inititiateMIDIConnections = async( midiToggleGadget, midiEnabled ) =>{
		
		let midiPortAttempts
		try{
			
			// on button click we attempt to connect to midi
			midiPortAttempts = await enableMIDI( midiToggleGadget, midiManager, MIDIConnectionClasses, people )
			// this needs a user interaction to trigger
			console.log("inititiateMIDIConnections", {midiPortAttempts, midiEnabled, MIDIConnectionClasses, midiManager} )
			setFeedback( midiPortAttempts.length > 0  ?
				"MIDI available<br>Connecting to instruments..." :
				"No MIDI Devices available" )		
			
			return midiPortAttempts.length > 0			
				
		}catch(error){
			
			console.error("inititiateMIDIConnections", error, {midiPortAttempts, midiEnabled} )
			// this needs a user interaction to trigger
			setFeedback( "No MIDI Devices Available<br>"+error )
		}
		return false
	}

	
	const disconnectMIDI = async() => {
		// FIXME: define which to disable
		await midiManager.disable()
		console.info("Main>MIDI:DISCONNECT", { midiManager} )
	}

	// Add some midi controls and feedback
	const connectMIDI = async()=>{
		
		console.info("Main>MIDI:Connecting...", {MIDIConnectionClasses, midiManager} )
		const midiConnections = await midiManager.enable(MIDIConnectionClasses, (outputs, inputs, event)=>{
			//- updateMIDIDevicesStatus(outputs, inputs, event) ick first output unless one has been specified
			midiInput = midiManager.inputs[0]
			midiOutput = midiManager.outputs[0]
			console.info("Main>MIDI registered:Devices",{midiInput, midiOutput}, {outputs, inputs, event }, MIDIConnectionClasses )
			// connect to a MIDI output's clock
			// TODO: Show all clock sources in tempo selector!
			if (midiInput)
			{
				midiInput.addListener("clock", event => {
					console.info("External>MIDI>CLOCK:Devices", {event} )
				})
			}
			outputMIDIInputs.innerText = `` + midiManager.inputs.join(",")
			outputMIDIOutputs.innerText = ``+ midiManager.outputs.join(",")
		})
		console.info("Main>MIDI:Devices", {midiConnections, midiManager} )
	}

	// this is something else
	midiToggleButton.onchange = e =>{
		if (inputMIDICheckbox.checked)
		{
			connectMIDI()
		}else{
			disconnectMIDI()
		}
	}
	

	// bind button actions
	const buttonMIDI = setupMIDIButton( midiPanelAnchor, inititiateMIDIConnections )
	
	console.log("Connecting to MIDI stuff...", { midiManager, midiToggleButton: midiEnableButton, buttonMIDI, midiPanelAnchor, options })
}