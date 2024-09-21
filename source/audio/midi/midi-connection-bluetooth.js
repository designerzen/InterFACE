/**
 * This binds WebMIDI via Bluetooth LE
 * so that you can connect your bluetooth devices as 
 * MIDI devices if they are paired in the OS
 * 
 * Based on
 * https://github.com/BLE-MIDI/WebMIDI/blob/main/blerx.js
 */


import MIDIConnection from './midi-connection'
// import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"
import {WebMidi} from "webmidi"

// https://mpe.js.org/#Installation
// import mpeInstrument from 'mpe'
// Define `instrument` as an instance of `mpeInstrument`
// const instrument = mpeInstrument()

// Request MIDI device access from the Web MIDI API
// navigator.requestMIDIAccess().then(access => {
//   // Iterate over the list of inputs returned
//   access.inputs.forEach(midiInput => {
//     // Send 'midimessage' events to the mpe.js `instrument` instance
//     midiInput.addEventListener(
//       'midimessage',
//       (event) => instrument.processMidiMessage(event.data)
//     )
//   })
// })

// TODO: Load lib from local

/**
 * Check to see if MIDI is available on this platform
 * @returns {Boolean} true if MIDI is available
 */
export const testForWebMIDI = () => navigator.requestMIDIAccess === undefined ? false : true


async function getCharacteristics(service) {
	console.log('Getting Characteristics...');
	const characteristics = await service.getCharacteristics();
	// characteristics.forEach(characteristic => {});
	// only one characteristic in this test case
	characteristic = characteristics[0];
	console.log('>> Characteristic: ', characteristic);
	console.log('>> Characteristic.uuid: ', characteristic.uuid);
	getCharacteristicProperties(characteristic);
	getCharacteristicDescriptors(characteristic);
	// readCharacteristic(characteristic);
	// subscribeToNotifications(characteristic);
	getDeviceInformation(characteristics);
  }
  
  async function getCharacteristicDescriptors(characteristic) {
	console.log('Getting Characteristic Descriptors...');
	const descriptors = await characteristic.getDescriptors();
	for (const descriptor of descriptors) {
	  switch (descriptor.uuid) {
  
		case BluetoothUUID.getDescriptor('gatt.client_characteristic_configuration'):
		  await descriptor.readValue().then(value => {
			console.log('> Client Characteristic Configuration:');
			let notificationsBit = value.getUint8(0) & 0b01;
			console.log('  > Notifications: ' + (notificationsBit ? 'ON' : 'OFF'));
			let indicationsBit = value.getUint8(0) & 0b10;
			console.log('  > Indications: ' + (indicationsBit ? 'ON' : 'OFF'));
		  });
		  break;
  
		case BluetoothUUID.getDescriptor('gatt.characteristic_user_description'):
		  await descriptor.readValue().then(value => {
			let decoder = new TextDecoder('utf-8');
			console.log('> Characteristic User Description: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getDescriptor('report_reference'):
		  await descriptor.readValue().then(value => {
			console.log('> Report Reference:');
			console.log('  > Report ID: ' + value.getUint8(0));
			console.log('  > Report Type: ' + getReportType(value));
		  });
		  break;
  
		default: console.log('> Unknown Descriptor: ' + descriptor.uuid);
	  }
	}
  }
  
  function getCharacteristicProperties(characteristic) {
	console.log('Getting Characteristic Properties...');
	for (const p in characteristic.properties) {
	  console.log('> Property: ', p, characteristic.properties[p]);
	}
  }
  
  async function getDeviceInformation(characteristics) {
	console.log('Getting Device Information Characteristics...');
	const decoder = new TextDecoder('utf-8');
	for (const characteristic of characteristics) {
	  switch (characteristic.uuid) {
  
		case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
		  await characteristic.readValue().then(value => {
			console.log('> Manufacturer Name String: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('model_number_string'):
		  await characteristic.readValue().then(value => {
			console.log('> Model Number String: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('hardware_revision_string'):
		  await characteristic.readValue().then(value => {
			console.log('> Hardware Revision String: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('firmware_revision_string'):
		  await characteristic.readValue().then(value => {
			console.log('> Firmware Revision String: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('software_revision_string'):
		  await characteristic.readValue().then(value => {
			console.log('> Software Revision String: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('system_id'):
		  await characteristic.readValue().then(value => {
			console.log('> System ID: ');
			console.log('  > Manufacturer Identifier: ' +
				padHex(value.getUint8(4)) + padHex(value.getUint8(3)) +
				padHex(value.getUint8(2)) + padHex(value.getUint8(1)) +
				padHex(value.getUint8(0)));
			console.log('  > Organizationally Unique Identifier: ' +
				padHex(value.getUint8(7)) + padHex(value.getUint8(6)) +
				padHex(value.getUint8(5)));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('ieee_11073-20601_regulatory_certification_data_list'):
		  await characteristic.readValue().then(value => {
			console.log('> IEEE 11073-20601 Regulatory Certification Data List: ' + decoder.decode(value));
		  });
		  break;
  
		case BluetoothUUID.getCharacteristic('pnp_id'):
		  await characteristic.readValue().then(value => {
			console.log('> PnP ID:');
			console.log('  > Vendor ID Source: ' + (value.getUint8(0) === 1 ? 'Bluetooth' : 'USB'));
			if (value.getUint8(0) === 1) {
			  console.log('  > Vendor ID: ' + (value.getUint8(1) | value.getUint8(2) << 8));
			} else {
			  console.log('  > Vendor ID: ' + getUsbVendorName(value.getUint8(1) | value.getUint8(2) << 8));
			}
			console.log('  > Product ID: ' + (value.getUint8(3) | value.getUint8(4) << 8));
			console.log('  > Product Version: ' + (value.getUint8(5) | value.getUint8(6) << 8));
		  });
		  break;
  
		default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
	  }
	}
  }
  
  function getReportType(value) {
	let v = value.getUint8(1);
	return v + (v in valueToReportType ? ' (' + valueToReportType[v] + ')' : 'Unknown');
  }
  
  async function getService() {
	console.log('Getting Services...');
	const services = await server.getPrimaryServices();
	console.log('> Bluetooth services', services);
	service = await server.getPrimaryService(bluetoothServiceUUID);
	console.log('> Bluetooth service', service);
	getCharacteristics(service);
}


const connectBluetoothDevice = async (name) => {
	return await navigator.bluetooth.requestDevice({
		filters: [{
			services: [MIDI_SERVICE_UID],
			name
		}]
	})
}
  
/**
 * This is an interface way to connect to MIDI devices and to swap
 * out the selected midi device and channels etc
 */
export default class WebMIDIConnection extends MIDIConnection{

	midi 
	midiChannel
	useMPE = false
	useSysex = false

	get inputs(){
		return WebMidi.inputs
	}
	get outputs(){
		return WebMidi.outputs
	}

	/**
	 * Initialise and connect to MIDI Hardware
	 * @param {Function} connectedCallback - method to call when connected
	 * @param {Function} disconnectedCallback - method to call when disconnected
	 * @returns 
	 */
	constructor( sysex=true, mpe=false )
	{
		super()
		this.useMPE = mpe
		this.useSysex = sysex
	}
	
	/**
	 * TODO: Implement timeout
	 * @param {Object} options
	 * @param {Function} onDeviceListUpdated 
	 * @returns 
	 */
	connect( options, onDeviceListUpdated=null ){
		return new Promise(async (resolve,reject)=>{
			try{
				/*
				WebMidi.addListener("connected", e => this.onConnected(e, onDeviceListUpdated) )
				
				// Reacting when a device becomes unavailable
				WebMidi.addListener("disconnected", e => this.onDisconnected(e, onDeviceListUpdated)  )
	
				// midi device connected! huzzah!
				WebMidi.addListener("enabled", event => {
					WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input))
					WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output))
					resolve( { status:"MIDI:Connection WebMIDI enabled", event, inputs:WebMidi.inputs, outputs:WebMidi.outputs} )
				} )	

				this.midi = await WebMidi.enable({sysex: this.useSysex })
				
				// Retrieving an output port/device using its id, name or index
				// midiChannel = WebMidi.getOutputById("123456789")
				// midiChannel = WebMidi.getOutputByName("Axiom Pro 25 Ext Out")
				// midiChannel = WebMidi.outputs[0]
				if (isNaN(port))
				{
					this.midiChannel = WebMidi.getOutputById(port)
					// midiChannel = WebMidi.getOutputByName(port)
				}else{
					this.midiChannel = WebMidi.outputs[port]
				}
				*/

				//		
				this.bluetoothDevice = await connectBluetoothDevice(options)
				
				console.log('Connecting to GATT server of ' + this.bluetoothDevice.name)
			
				const server = await this.bluetoothDevice.gatt.connect()
				console.log('Getting Service...')
				// const services = await server.getPrimaryServices()
				const service = await server.getPrimaryService(MIDI_SERVICE_UID)
				const characteristic = service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID)

				// FOR RX too...
				characteristic.startNotifications()
				characteristic.addEventListener('characteristicvaluechanged', onMidiMessageRecieved)

				console.log('Found Characteristic...', characteristic)
				this.onConnected()
				resolve(this.bluetoothDevice)

			}catch(error){
				reject(error)
			}
		})
	}

	async disconnect(){
	
		/*
		// midi device connected! huzzah!
		WebMidi.removeListener("connected", this.onConnected )
		
		// Reacting when a device becomes unavailable
		WebMidi.removeListener("disconnected", this.onDisconnected )

		await WebMidi.disable()
		*/

		if (this.bluetoothDevice.gatt.connected) 
		{
			this.bluetoothDevice.gatt.disconnect()
			this.onDisconnected()
			console.info('Disconnecting from Bluetooth Device...')
			return true
		} else {
			// NOT CONNECTED!!!
			console.log('> Bluetooth Device is already disconnected')
			return false
		}
	}

	onMidiMessageRecieved(event) {
		const {buffer}  = event.target.value
		const eventData = new Uint8Array(buffer)
		// bleMIDIrx(eventData);
	}

	onConnected(event, onDeviceListUpdated=null){
		const device = event.target
		onDeviceListUpdated && onDeviceListUpdated( event, this.inputs, this.outputs )
	}

	onDisconnected(event, onDeviceListUpdated=null){
		const device = event.target
		onDeviceListUpdated && onDeviceListUpdated( event, this.inputs, this.outputs )
	}
}


// TX ------------------------------------------------

/** Global Variables */
var midi, data;
var synth;
var bluetoothDevice;
var bleDevice;
var readyBLEpacket = [];
var timer = setInterval(bleSend, 10);

/** Function to run upon window load. */
async function Init(){
  kb=document.getElementById("keyboard");
  kb.addEventListener("change",KeyIn);
}

/** Function for connecting to MIDIBLE Device */
function txConnect() {
  printToConsole('Searching for bluetooth devices...');
  console.log('Requesting Bluetooth Device with MIDI UUID...');
  bluetoothDevice = null;
  console.log('Searching for ' + getUrlVars()["demo"] + getUrlVars()["id"] + "...");

  navigator.bluetooth.requestDevice({
    filters: [{
      services: [MIDI_SERVICE_UID],
      name: bleDevice
    }]
  })
  .then(device =>{
    console.log('Connecting to GATT server of ' + device.name);
    printToConsole('Connecting to bluetooth device '+ device.name + '...');
    bluetoothDevice = device;
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service...');
    return server.getPrimaryService(MIDI_SERVICE_UID);
  })
  .then(service => {
    console.log('Getting Characteristic...');
    return service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID);
  })
  .then(characteristic => {
    console.log('Found Characteristic...');
    printToConsole('Ready to rock!');
    bleConnected();
    midiChar = characteristic;
  })
  .catch(error => {
    printToConsole(error);
    console.log('Argh! ' + error);
  })
}

function txDisconnect() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    bleDisconnect();
    printToConsole('Disconnecting from Bluetooth Device...');
  } else {
    console.log('> Bluetooth Device is already disconnected');
    printToConsole('Bluetooth Device is already disconnected.');
  }
}

function onDisconnected(event) {
  let device = event.target;

  console.log('Device ' + device.name + ' is disconnected.');
  printToConsole('Device ' + device.name + ' is disconnected.');

  bleDisconnect();
}

function midiEncoder(midiData) {
  let midiBLEmessage = [];
  let pos = 0;
  let len = midiData.length;

  console.log('Encoding: ' + midiData);

  midiBLEmessage.push(timestampGenerator()[0]);
  
  for (pos = 0; pos < len;pos++) {
    if ((midiData[pos] >>> 7) === 1) {
      midiBLEmessage.push(timestampGenerator()[1]);
    }
    midiBLEmessage.push(midiData[pos]);
  }

  console.log('Encoded: ' + midiBLEmessage);
  printToConsole('Encoded: ' + midiBLEmessage);
  return midiBLEmessage;
}

function timestampGenerator() {
  let localTime       = performance.now() & 8191;
  let timestamp       = [((localTime >> 7) | 0x80) & 0xBF,(localTime & 0x7F) | 0x80];
  return timestamp;
}

function KeyIn(e){
  let i = 0;
  midiMessage = [0x90,e.note[1],e.note[0]?100:0];
  let l = midiMessage.length; 
  printToConsole('MIDI-message: ' + midiMessage);

  for (i = 0; i < l; i++) {
    readyBLEpacket.push(midiMessage[i]);
  }
}

window.onload=function() {
  console.log('Service: ' + MIDI_SERVICE_UID);
  console.log('Char: ' + MIDI_IO_CHARACTERISTIC_UID);
  document.getElementById('ikeys').style.display = 'none';
  Init();

  let norurl;
  if (getUrlVars()["demo"] !== undefined && getUrlVars()["id"] !== undefined) {
    norurl = "./multitx.html?demo=" + getUrlVars()["demo"] + "&id=" + getUrlVars()["id"];
    console.log(norurl);
    document.getElementById("link").href = norurl;
    bleDevice = getUrlVars()["demo"] + " " + getUrlVars()["id"];
  }else{
    console.log("BLE Device: " + bleDevice);
  }
}

function bleConnected() {
  document.getElementById('ikeys').style.display = 'block';
  document.getElementById('hide').style.display = 'none';
  document.getElementById('ibutton').innerHTML = 'Disconnect';
  document.getElementById('midi-data').style.height = '45vh';
  document.getElementById("ibutton").onclick = txDisconnect;
  document.getElementById("info").style.fontSize = '1.5em';
  document.getElementById('midi-data').style.background = '#ECEFF1'
}

function bleSend(){
  let packet = [];
  if(readyBLEpacket.length > 0) {
    packet = new Uint8Array(midiEncoder(readyBLEpacket));
    console.log('BLE-packet sent: ' + packet);
    midiChar.writeValue(packet);
    readyBLEpacket = [];
  }
}

function bleDisconnect() {
  document.getElementById('ikeys').style.display = 'none';
  document.getElementById('hide').style.display = 'block';
  document.getElementById('ibutton').innerHTML = 'Connect';
  document.getElementById('midi-data').style.height = '10vh';
  document.getElementById("ibutton").onclick = txConnect;
  document.getElementById("info").style.fontSize = '2em';
}


// RX ------------------------------------------------
/** Global Variables */
var connectDevice = null;
var synth;
var bleDevice;

/** Function to run upon window load. */
window.onload=function(){
  let norurl;
  if (getUrlVars()["demo"] !== undefined) {
    norurl = "./no/multirxno.html?demo=" + getUrlVars()["demo"] + "&id=" + getUrlVars()["id"];
    console.log(norurl);
    document.getElementById("link").href = norurl;
    bleDevice = getUrlVars()["demo"] + " " + getUrlVars()["id"];
  }else{
    console.log("BLE Device: " + bleDevice);
  }
  
  /** Synth for Audio feedback */
  synth = new WebAudioTinySynth();
  synth.setTsMode(1);
  synth.setQuality(0);
  console.log('WebAudio Tinysynth is running...'); 
}

/** Connecting to given device. */
function rxConnect() {
  printToConsole('Searching for bluetooth devices...');
  console.log('Requesting Bluetooth Device with MIDI UUID...');
  console.log('Searching for ' + getUrlVars()["demo"] + getUrlVars()["id"] + "...");
  navigator.bluetooth.requestDevice({
    filters: [{
      services: [MIDI_SERVICE_UID],
      name: bleDevice
    }]
  })
  .then(device => {
    // Set up event listener for when device gets disconnected.
    console.log('Connecting to GATT server of ' + device.name);
    printToConsole('Connecting to bluetooth device '+ device.name + '...');
    device.addEventListener('gattserverdisconnected', onDisconnected);
    bleConnected();
    // Attempts to connect to remote GATT Server.
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service...');
    return server.getPrimaryService(MIDI_SERVICE_UID);
  })
  .then(service => {
    console.log('Getting Characteristic...');
    return service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID);
  })
  .then(characteristic => {
    console.log('Found Characteristic...');
    return characteristic.startNotifications();
  })
  .then(characteristic => {
    // Set up event listener for when characteristic value changes.
    characteristic.addEventListener('characteristicvaluechanged',
                    handleMidiMessageRecieved);
    console.log('Notifications have been started.')
    printToConsole('Ready to test!');
  })
  .catch(error => { console.log('ERRORCODE: ' + error); });
}

function rxDisconnect() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    bleDisconnect();
    printToConsole('Disconnecting from Bluetooth Device...');
  } else {
    console.log('> Bluetooth Device is already disconnected');
    printToConsole('Bluetooth Device is already disconnected.');
  }
}

/** Incoming BLE MIDI */
function handleMidiMessageRecieved(event) {
  const {buffer}  = event.target.value;
  const eventData = new Uint8Array(buffer);

  bleMIDIrx(eventData);
}

function onDisconnected(event) {
  if (!connectDevice || !connectDevice.gatt.connected) return;
  connectDevice.gatt.disconnect();
  let device = event.target;
  printToConsole('Connection lost...');
  console.log('Device ' + device.name + ' is disconnected.');
  bleDisconnect();
}

function bleConnected() {
  document.getElementById('hide').style.display = 'none';
  document.getElementById('ibutton').innerHTML = 'Disconnect';
  document.getElementById('midi-data').style.height = '45vh';
  document.getElementById("ibutton").onclick = rxDisconnect;
  document.getElementById("info").style.fontSize = '1.5em';
  document.getElementById('midi-data').style.background = '#ECEFF1'
}

function bleDisconnect() {
  document.getElementById('ikeys').style.display = 'none';
  document.getElementById('hide').style.display = 'block';
  document.getElementById('ibutton').innerHTML = 'Connect';
  document.getElementById('midi-data').style.height = '10vh';
  document.getElementById("ibutton").onclick = rxConnect;
  document.getElementById("info").style.fontSize = '2em';
}



// --- DATA ---------------------------------------

const scanBtn = document.querySelector('.app-test .btn-scan');
const disconnectBtn = document.querySelector('.app-test .btn-disconnect');
const reconnectBtn = document.querySelector('.app-test .btn-reconnect');
const readBtn = document.querySelector('.app-test .btn-read');
const writeBtn = document.querySelector('.app-test .btn-write');
const subscribeBtn = document.querySelector('.app-test .btn-subscribe');
const unsubscribeBtn = document.querySelector('.app-test .btn-unsubscribe');
scanBtn.addEventListener('click', requestDevice);
disconnectBtn.addEventListener('click', disconnectDevice);
reconnectBtn.addEventListener('click', reconnectDevice);
readBtn.addEventListener('click', readCharacteristic);
writeBtn.addEventListener('click', writeCharacteristic);
subscribeBtn.addEventListener('click', subscribeToNotifications);
unsubscribeBtn.addEventListener('click', unsubscribeFromNotifications);

// bleno test const bluetoothServiceUUID = '27cf08c1-076a-41af-becd-02ed6f6109b9';
const bluetoothServiceUUID = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const valueToReportType = {
  1: 'Input Report',
  2: 'Output Report',
  3: 'Feature Report'
};
let device, server, service, characteristic;

async function requestDevice() {
  setupAudio();

	const options = { 
		filters: [{
			namePrefix: 'BlenoService_',
    }],
    optionalServices: [ bluetoothServiceUUID ],
  };
	try {
    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));
		device = await navigator.bluetooth.requestDevice(options);
		device.addEventListener('gattserverdisconnected', onDisconnected);
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
		console.log('> Connected:        ' + device.gatt.connected);
		if (!device.gatt.connected) {
			connectDevice();
		}
  } catch (error)  {
    console.log('No! ' + error);
  }
}

async function connectDevice() {
	console.log('Connecting to Bluetooth Device...');
  server = await device.gatt.connect();
  console.log('> gatt', device.gatt);
  console.log('> server', server);
  console.log('> Bluetooth Device connected');
  getService();
}

function disconnectDevice() {
  if (!device) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (device.gatt.connected) {
    device.gatt.disconnect();
  } else {
    console.log('> Bluetooth Device is already disconnected');
  }
}

function onDisconnected(event) {
  // Object event.target is Bluetooth Device getting disconnected.
  console.log('> Bluetooth Device disconnected');
}

function onCharacteristicValueChanged(e) {
  const { value } = e.target;
  let str = `${value.getUint8(0)}:${value.getUint8(1)}:${value.getUint8(2)}:${value.getUint8(3)}:${value.getUint8(4)}`;
  console.log('> Notification value: ', str);
  playNote(0, value.getUint8(2), value.getUint8(3), value.getUint8(4));
}

function reconnectDevice() {
  if (!device) {
    return;
  }
  if (device.gatt.connected) {
    console.log('> Bluetooth Device is already connected');
    return;
  }
  try {
    connectDevice();
  } catch(error) {
    console.log('Oh no! ' + error);
  }
}

async function readCharacteristic() {
  console.log('>>>>> Characteristic readable: ', characteristic.properties.read);
  if (characteristic.properties.read) {
    characteristic.readValue().then(data => {
      console.log('>>>>> Characteristic readValue: ', data.getUint8());
    });
  }
}

async function subscribeToNotifications() {
  console.log('>>>>> Characteristic notify: ', characteristic.properties.notify);
  if (characteristic.properties.notify) {
    console.log('Subscribing to notifications...');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
  }
}

async function unsubscribeFromNotifications() {
  console.log('Unsubscribing from notifications...');
  await characteristic.stopNotifications();
  characteristic.removeEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
}

async function writeCharacteristic() {
  console.log('>>>>> Characteristic writable: ', characteristic.properties.write);
  if (characteristic.properties.write) {
    let encoder = new TextEncoder('utf-8');
    let value = 38; // document.querySelector('#description').value;
    console.log('Characteristic writeValue...');
    characteristic.writeValue(encoder.encode(value)).then(() => {
      console.log('> Characteristic written to: ', value);
    });
  }
}
