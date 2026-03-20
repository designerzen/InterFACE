/**
 * This binds WebMIDI via Bluetooth LE
 * so that you can connect your bluetooth devices as 
 * MIDI devices if they are paired in the OS
 * 
 * Based on
 * https://github.com/BLE-MIDI/WebMIDI/blob/main/blerx.js
 */


import MIDIConnection from './midi-connection.js'

import {
	DeviceConnector,
	MIDI_SERVICE_UID,
	MIDI_IO_CHARACTERISTIC_UID,
	MidiPacketParser,
} from "midible"
	
/**
 * This is an interface way to connect to MIDI devices and to swap
 * out the selected midi device and channels etc
 */
export default class BluetoothMIDIConnection extends MIDIConnection {

	useMPE = false
	useSysex = false

	server
	service
	characteristic

	midiPacketParser

	bluetoothDevice

	loggedIndex = 0

	get inputs() {
		return []
	}
	get outputs() {
		return [ this.bluetoothDevice ]
	}

	/**
	 * Initialise and connect to MIDI Hardware
	 * @param {Function} connectedCallback - method to call when connected
	 * @param {Function} disconnectedCallback - method to call when disconnected
	 * @returns 
	 */
	constructor(sysex = true, mpe = false) {
		super()
		this.useMPE = mpe
		this.useSysex = sysex
		this.onMidiMessageRecieved = this.onMidiMessageRecieved.bind(this)
		this.midiPacketParser = new MidiPacketParser()
	}

	/**
	 * TODO: Implement timeout
	 * @param {Object} options
	 * @param {Function} onDeviceListUpdated 
	 * @returns 
	 */
	async connect(options, onDeviceListUpdated = null) {
		const connectedDevice = await DeviceConnector.connect()
		connectedDevice.addEventListener('gattserverdisconnected', this.onDisconnected)
		const server = await connectedDevice.gatt.connect()
		const service = await server.getPrimaryService(MIDI_SERVICE_UID)
		const characteristic = await service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID)
		characteristic.addEventListener('characteristicvaluechanged', this.onMidiMessageRecieved )
		await characteristic.startNotifications()
		this.bluetoothDevice = connectedDevice
		this.connected = true
		this.onConnected()
	}

	async disconnect() {
		if (this.connected)
		{
			this.midiPacketParser.clear()
			this.onDisconnected()
			return true
		}
	
		// NOT CONNECTED!!!
		console.log('> Bluetooth Device is already disconnected')
		return false
	}
		
	onMidiMessageRecieved(event) {
		const eventData = new Uint8Array( event.target.value)
		this.midiPacketParser.parse(eventData)
		const processedMessages = midiPacketParser.processedMessages

		if (processedMessages.length > this.loggedIndex) {
			for (let i = loggedIndex; i < processedMessages.length; i++) {
				const midiEvent = processedMessages[i]
				// TODO: 
				console.info("BTMIDI", midiEvent)
				// 
			}
			this.loggedIndex = processedMessages.length
		}
	}

	onConnected(event, onDeviceListUpdated = null) {
	// 
		console.log(`Connected to: ${this.bluetoothDevice.name || "Unknown Device"}`)
		
	}

	onDisconnected(event, onDeviceListUpdated = null) {
	
	}
}