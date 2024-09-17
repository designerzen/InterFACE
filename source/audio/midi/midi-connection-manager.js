/**
 * Pass in some connections to monitor and this manager 
 * will grant you access to all MIDI devices both
 * real and virtual but all are dealt with via webmidi
 * the virtual ports
 * 
 * Also handles loading and saving existing connections
 * in case you restart and do want to reselect the options
 */
export default class MIDIConnectionManager{
	
	// All devices
	devices

	// Connected Devices
	connections

	inputDevices = []
	outputDevices = []

	inputDeviceMap = new Map()
	outputDeviceMap = new Map()

	deviceChangeCallbacksMap = new Map()

	// 
	get inputs(){
		return this.inputDevices
	}
	
	get outputs(){
		return this.outputDevices
	}

	// FIXME: 
	// Check devices
	get available(){
		return true // capabilities.webMIDIAvailable
	}

	constructor(){

	}

	async load(){

	}

	async save(){
		
	}

	/**
	 * Actual callback handling - add method to stack
	 * if you add the same method twice it will only 
	 * stills end one callback
	 * 
	 * @param {Function} onUpdate 
	 */
	observe(onUpdate){
		if (onUpdate)
		{
			this.deviceChangeCallbacksMap.set(onUpdate, onUpdate)
		}else{
			console.info("MIDI:Enabling without callback")
		}
	}
	
	/**
	 *  NB. this needs a user interaction to trigger the dialog on Web
	 * 
	 * @param {Array<Class>} MIDIConnectionClasses 
	 * @param {Function} onUpdate 
	 */
	async enable( MIDIConnectionClasses, onUpdate=null ) {

		// throw errors if no required MIDIConnection classes provided
		if (!MIDIConnectionClasses || !MIDIConnectionClasses.length)
		{
			throw new Error("No MIDI Connection Classes provided")
		}

		this.observe(onUpdate)
		
		const midiConnections = MIDIConnectionClasses.map( async(MIDIConnectionClass) =>{
			
			const midiPortConnection = new MIDIConnectionClass()
			
			console.info("MIDI:Manager, Creating", midiPortConnection )
			
			try{

				const callback = (outputs, inputs, event) => {

					// midi device dis/connected! huzzah!
					const updates = this.updateDeviceList(outputs, inputs)


					if (event){
						console.log("midi device event!", {event, updates} )
					}
				}

				// wait for all midi connections
				const midiConnection = await midiPortConnection.connect( 0 , (event, inputs, outputs) => callback(outputs, inputs, event) )
				
				// just in case they do not also send event on connect
				// callback(midiConnection.outputs, midiConnection.inputs, null)

				console.info("MIDI:Manager, Connected", midiConnection, midiConnection.inputs, midiConnection.outputs )
				
				return midiConnection

			}catch(error){	
	
				// failed
				console.error("Total MIDI failure", error)
				return {error}
			}
		})

		Promise.all(midiConnections)

		this.devices = midiConnections
		this.connections = midiConnections.filter( device => !device.error )
			
		console.info("MIDI:Manager", this.inputs, this.outputs )
				
		return this.connections
	}

	/**
	 * 
	 * @param {Function} onUpdate 
	 */
	async disable( onUpdate=null ){
		this.updateDeviceList([],[])
	}

	updateDeviceList(portOutputs, portInputs){
		
		const updated = []

		// FIXME: Handle removals too!

		portInputs.forEach(input => {
			if (!this.inputDeviceMap.has( input.id ))
			{
				this.inputDeviceMap.set( input.id, input )  
				updated.push( input )
				console.info("Found new MIDI Device", input.manufacturer, input.name, {input})
			}
		})

		this.inputDevices = Array.from(this.inputDeviceMap.values())
		
		portOutputs.forEach(output => {
			if (!this.outputDeviceMap.has( output.id ))
			{
				this.outputDeviceMap.set( output.id, output )  
				updated.push( output )
				console.info("Found new MIDI Device", output.manufacturer, output.name, {output})
			}
			this.outputDevices.push( output )
		})
		this.outputDevices = Array.from(this.outputDeviceMap.values())

		// on midi device list has changed
		if (updated.length)
		{
			this.onDeviceListUpdated(portOutputs, portInputs, updated, null) 
			
			// onUpdate && onUpdate( this.outputs, this.inputs, updates, event  )
		}else{
			console.info("device already present?", {event})
		}
		
		return updated
	}

	onDeviceListUpdated(outputs, inputs, updates, event){
			
		// A MIDI Device has been connected!
		console.info("onDeviceListUpdated", this.inputDevices, this.outputDevices, {outputs, inputs, event, updates} )
		console.info("onDeviceListUpdated callback map", this.inputDeviceMap, this.outputDeviceMap, this.deviceChangeCallbacksMap )
			
		
		// this.inputs.forEach(input => console.log(input.manufacturer, input.name, input))
		// this.outputs.forEach(output => console.log(output.manufacturer, output.name, output))

		// loop through the onUpdate map and send to all?
		for (const [key, callback] of this.deviceChangeCallbacksMap) 
		{
			console.info("onDeviceListUpdated callback", { outputs, inputs, updates, event} )
			callback( outputs, inputs, updates, event  )
		}
	}
}