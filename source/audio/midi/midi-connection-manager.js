import { isMIDIDebugEnabled, logMIDIDebug } from './midi-echo-guard.js'

/**
 * Pass in some connections to monitor and this manager 
 * will grant you access to all MIDI devices both
 * real and virtual but all are dealt with via webmidi
 * the virtual ports
 * 
 * Also handles loading and saving existing connections
 * in case you restart and do want to reselect the options
 * 
 * IMPLEMENTS INSTRUMENT CONTROLS
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
	debugCounters = {
		enableCalls: 0,
		updateCalls: 0,
		callbackCalls: 0,
		noChangeUpdates: 0
	}

	/**
	 * 
	 */
	get inputs(){
		return this.inputDevices
	}
	
	/**
	 * 
	 */
	get outputs(){
		return this.outputDevices
	}

	/**
	 * FIXME: Check devices
	 */
	get available(){
		return true // capabilities.webMIDIAvailable
	}

	constructor(){

	}

	/**
	 * 
	 */
	async load(){

	}

	/**
	 * 
	 */
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
		}else if (isMIDIDebugEnabled()){
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
		this.debugCounters.enableCalls++
		const enableStartedAt = performance.now()
		logMIDIDebug("MIDI:Manager enable starting", {
			enableCalls: this.debugCounters.enableCalls,
			connectionClasses: MIDIConnectionClasses.map(MIDIConnectionClass => MIDIConnectionClass.name),
			callbacks: this.deviceChangeCallbacksMap.size,
			inputs: this.inputDevices.length,
			outputs: this.outputDevices.length
		})

		// throw errors if no required MIDIConnection classes provided
		if (!MIDIConnectionClasses || !MIDIConnectionClasses.length)
		{
			throw new Error("No MIDI Connection Classes provided")
		}

		this.observe(onUpdate)
		
		const midiConnections = await Promise.all(MIDIConnectionClasses.map( async(MIDIConnectionClass) =>{
			
			const midiPortConnection = new MIDIConnectionClass()
			
			logMIDIDebug("MIDI:Manager, Creating", {
				connection: midiPortConnection.constructor?.name
			}, 'info')
			
			try{

				const callback = (outputs, inputs, event) => {
					this.debugCounters.callbackCalls++
					logMIDIDebug("MIDI:Manager connection callback", {
						callbackCalls: this.debugCounters.callbackCalls,
						inputs: inputs.map(input => ({ id: input.id, name: input.name, state: input.state, connection: input.connection })),
						outputs: outputs.map(output => ({ id: output.id, name: output.name, state: output.state, connection: output.connection })),
						eventType: event?.type,
						eventPort: event?.port
					})

					// midi device dis/connected! huzzah!
					const updates = this.updateDeviceList(outputs, inputs, event)


					if (event){
						logMIDIDebug("MIDI:Device event", { event, updates }, 'info')
					}
				}

				// wait for all midi connections
				const midiConnection = await midiPortConnection.connect( 0 , (event, inputs, outputs) => callback(outputs, inputs, event) )
				
				// ensure already-connected devices are surfaced immediately
				callback(midiConnection.outputs ?? [], midiConnection.inputs ?? [], null)

				logMIDIDebug("MIDI:Manager, Connected", {
					connection: midiConnection.constructor?.name,
					inputs: midiConnection.inputs?.map(input => ({ id: input.id, name: input.name })) ?? [],
					outputs: midiConnection.outputs?.map(output => ({ id: output.id, name: output.name })) ?? []
				}, 'info')
				
				return midiConnection

			}catch(error){	
	
				// failed
				console.error("Total MIDI failure", error)
				return {error}
			}
		}))

		this.devices = midiConnections
		this.connections = midiConnections.filter( device => !device.error )
			
		logMIDIDebug("MIDI:Manager enable complete", {
			afterMs: Math.round(performance.now() - enableStartedAt),
			connections: this.connections.length,
			inputs: this.inputs.map(input => ({ id: input.id, name: input.name })),
			outputs: this.outputs.map(output => ({ id: output.id, name: output.name })),
			debugCounters: this.debugCounters
		})
				
		return this.connections
	}

	/**
	 * 
	 * @param {Function} onUpdate 
	 */
	async disable( onUpdate=null ){
		this.inputDeviceMap.clear()
		this.outputDeviceMap.clear()
		this.updateDeviceList([],[])
	}

	updateDeviceList(portOutputs, portInputs, event=null){
		this.debugCounters.updateCalls++
		
		const updated = []

		// FIXME: Handle removals too!

		portInputs.forEach(input => {
			if (!this.inputDeviceMap.has( input.id ))
			{
				this.inputDeviceMap.set( input.id, input )  
				updated.push( input )
				logMIDIDebug("MIDI:Found new input device", {
					manufacturer: input.manufacturer,
					name: input.name,
					id: input.id
				}, 'info')
			}
		})

		this.inputDevices = Array.from(this.inputDeviceMap.values())
		
		portOutputs.forEach(output => {
			if (!this.outputDeviceMap.has( output.id ))
			{
				this.outputDeviceMap.set( output.id, output )  
				updated.push( output )
				logMIDIDebug("MIDI:Found new output device", {
					manufacturer: output.manufacturer,
					name: output.name,
					id: output.id
				}, 'info')
			}
		})
		this.outputDevices = Array.from(this.outputDeviceMap.values())

		// on midi device list has changed
		if (updated.length)
		{
			this.onDeviceListUpdated(portOutputs, portInputs, updated, null) 
			
			// onUpdate && onUpdate( this.outputs, this.inputs, updates, event  )
		}else{
			this.debugCounters.noChangeUpdates++
			logMIDIDebug("MIDI:Device update produced no changes", {
				eventType: event?.type,
				noChangeUpdates: this.debugCounters.noChangeUpdates,
				updateCalls: this.debugCounters.updateCalls,
				inputs: this.inputDevices.map(input => ({ id: input.id, name: input.name })),
				outputs: this.outputDevices.map(output => ({ id: output.id, name: output.name }))
			})
		}
		
		return updated
	}

	onDeviceListUpdated(outputs, inputs, updates, event){
			
		// A MIDI Device has been connected!
		logMIDIDebug("MIDI:onDeviceListUpdated", {
			inputs: this.inputDevices.map(input => ({ id: input.id, name: input.name })),
			outputs: this.outputDevices.map(output => ({ id: output.id, name: output.name })),
			updates: updates.map(update => ({ id: update.id, name: update.name, type: update.type })),
			eventType: event?.type,
			callbacks: this.deviceChangeCallbacksMap.size
		}, 'info')
			
		
		// this.inputs.forEach(input => console.log(input.manufacturer, input.name, input))
		// this.outputs.forEach(output => console.log(output.manufacturer, output.name, output))

		// loop through the onUpdate map and send to all?
		for (const [key, callback] of this.deviceChangeCallbacksMap) 
		{
			logMIDIDebug("MIDI:onDeviceListUpdated callback", {
				outputs: outputs.map(output => ({ id: output.id, name: output.name })),
				inputs: inputs.map(input => ({ id: input.id, name: input.name })),
				updates: updates.map(update => ({ id: update.id, name: update.name, type: update.type })),
				eventType: event?.type,
				callbacks: this.deviceChangeCallbacksMap.size
			})
			callback( outputs, inputs, updates, event  )
		}
	}
}
