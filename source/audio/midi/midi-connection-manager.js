import { setMIDIPortTransport } from './midi-routing.js'
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
	portSnapshots = new Map()
	enabled = false
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
		if (this.enabled && this.connections?.length) return this.connections
		this.enabled = true
		
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
					if (!this.enabled) return
					const name = midiPortConnection.constructor.name
					const transport = /Bluetooth/.test(name) ? 'Bluetooth MIDI' : /Bridge/.test(name) ? 'Native MIDI' : /Virtual/.test(name) ? 'Virtual MIDI' : 'System MIDI (USB / Bluetooth / virtual transport not reported)'
					;[...outputs, ...inputs].filter(Boolean).forEach(port => setMIDIPortTransport(port, transport))
					const updates = this.updateDeviceList(outputs, inputs, event, midiPortConnection)


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
				
				return midiPortConnection

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
	async disable(onUpdate = null){
		this.enabled = false
		await Promise.allSettled((this.connections ?? []).map(connection => connection.disconnect?.()))
		this.connections = []
		this.portSnapshots.clear()
		this.inputDeviceMap.clear()
		this.outputDeviceMap.clear()
		this.inputDevices = []
		this.outputDevices = []
		this.onDeviceListUpdated([], [], [], null)
		onUpdate?.([], [])
	}

	updateDeviceList(portOutputs, portInputs, event = null, source = 'default'){
		this.debugCounters.updateCalls++
		const before = [...this.inputs, ...this.outputs]
		this.portSnapshots.set(source, {
			inputs: portInputs.filter(port => port && port.state !== 'disconnected'),
			outputs: portOutputs.filter(port => port && port.state !== 'disconnected'),
		})
		this.inputDeviceMap.clear()
		this.outputDeviceMap.clear()
		for (const snapshot of this.portSnapshots.values()) {
			snapshot.inputs.forEach(port => this.inputDeviceMap.set(port.id ?? port.name, port))
			snapshot.outputs.forEach(port => this.outputDeviceMap.set(port.id ?? port.name, port))
		}
		this.inputDevices = [...this.inputDeviceMap.values()]
		this.outputDevices = [...this.outputDeviceMap.values()]
		const after = [...this.inputs, ...this.outputs]
		const updated = [...before.filter(port => !after.includes(port)), ...after.filter(port => !before.includes(port))]
		// Notify even for an empty snapshot so the zero-device state stays accurate.
		this.onDeviceListUpdated(this.outputs, this.inputs, updated, event)
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
