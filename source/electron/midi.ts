// Singleton
import { electronApp, optimizer, is, platform } from '@electron-toolkit/utils'
import midi from 'midi'

// FIXME: MIDI 2.0
// import midi2 from './lib/winmidi2/lib/main.js'

// using MIDI lib
// import {MidiInPort,MidiOutPort,MidiSynthesizer} from '@nodert-win11/windows.devices.midi'
// import {MidiInPort,MidiOutPort,MidiSynthesizer, MidiVirtualDevice} from './lib/winmidi2/lib/main.js'




let ticks = 0
let step = 0

let interval 

let input
let output

const VIRTUAL_MIDI_DEVICE_NAME_IN = "PhotoSYNTH-InterFACE In"
const VIRTUAL_MIDI_DEVICE_NAME_OUT = "PhotoSYNTH-InterFACE Out"

const USE_VIRTUAL_PORT = false // Try and connect to a DAW

const MIDI_CLOCK_PER_QUARTER_NOTE = 24 // From MIDI specification:
const MASTER_TEMPO = 40 // BPM = number of quarter notes per minute
let totalClockPerMinute = MIDI_CLOCK_PER_QUARTER_NOTE * MASTER_TEMPO


// const loopbackAId = midi2.MidiEndpointDeviceInformation.diagnosticsLoopbackAEndpointId;
// const loopbackBId = midi2.MidiEndpointDeviceInformation.diagnosticsLoopbackBEndpointId;



export const destroyMIDI = () => {

	input && input.closePort()
	output && output.closePort()
}

/**
 * TODO:
 * @param mainWindow 
 * @param ipcMain 
 */
const registerWindowsVirtualMIDI = (mainWindow,ipcMain) => {


	// const vd = new MidiVirtualDevice()
}

/**
 * On Linux and Mac we have Alsa / Pulse which allows
 * us to create a virtual MIDI port that then allows other
 * apps such as Ableton or Bitwig to connect to this app's 
 * MIDI port
 * 
 * @param mainWindow 
 * @param ipcMain 
 */
const registerUnixVirtualMIDI = (mainWindow,ipcMain) => {

	// const midi = midi2
	try{
		// MIDI Virtual IO
		// Allow DAW to control tempo
		input = new midi.Input()
		// Allow piping the MIDI out to a DAW
		output = new midi.Output()

		input.on('message', (deltaTime, message) => {
			console.log(`message received on virtual input: ${message} d: ${deltaTime}`)
			mainWindow.webContents.send("midi", deltaTime, message )
		})

		input.on("clock", () => {
			ticks++
			// 6 MIDI clock ticks equals a 16th note.
			if (ticks % 6 != 0) return
			mainWindow.webContents.send("transport", step++ % 16)
		})

		if (USE_VIRTUAL_PORT)
		{
			// Create a virtual input port to allow other instruments
			// as well as DAWs to control the tempo
			const virtualIn = input.openVirtualPort( VIRTUAL_MIDI_DEVICE_NAME_IN )
			const virtualOut = output.openVirtualPort( VIRTUAL_MIDI_DEVICE_NAME_OUT )

			if (virtualOut)
			{
				// pipe out messages
				interval = setInterval( ()=>{
					console.log(`main send MIDI m: ${ticks} d: ${VIRTUAL_MIDI_DEVICE_NAME_IN}`, virtualIn, virtualOut)
					mainWindow.webContents.send("midi", ticks, VIRTUAL_MIDI_DEVICE_NAME_OUT )	
				}, 1000)

			}else{

				// pipe out failure message
				interval = setInterval( ()=>{
					console.log(`main send FAIL to bridge m: ${ticks} d: ${VIRTUAL_MIDI_DEVICE_NAME_IN}`, virtualIn, virtualOut)
					mainWindow.webContents.send("midi", -1, "fail" )	
				}, 1000)

				// type?: ('none' | 'info' | 'error' | 'question' | 'warning')
			}

			// Main process
			ipcMain.handle('hasVirtualMidi', async (event, someArgument) => {
				return !!virtualOut
			})
		}

	}catch(error){
		console.error(`error:`, error)
	}
}



export const registerMIDI = (mainWindow, ipcMain) => {
	
	// MIDI WORKS IN 2 WAYS 
	if (platform.isWindows)
	{
		registerWindowsVirtualMIDI()
	}else if (platform.isMacOS || platform.isLinux){
		registerUnixVirtualMIDI(mainWindow,ipcMain)
	}
}