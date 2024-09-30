import { Message } from "webmidi"
import MIDIConnection from "./midi-connection"

/**
 * This is an interface way to connect to MIDI devices
 * from the virtual port created by the Electron Main process
 * which has exposed and updates the following methods maintained
 * in preload.ts and set from electron.ts
 */
export default class MIDIBridgeConnection extends MIDIConnection{
	
	connected = false
	
	get inputs(){
		return this.connected ? [
			{
				connection:"open",
				id: "photosynth-input-1",
				manufacturer:"designerzen ltd.",
				name:"PhotoSYNTH",
				state:"connected",
				type:"input",
				version:"1.0"
			}
		] : []
	}

	get outputs(){
		return this.connected ? [
			{
				connection:"open",
				id: "photosynth-output-1",
				manufacturer:"designerzen ltd.",
				name:"PhotoSYNTH",
				state:"connected",
				type:"output",
				version:"1.0"
			}
		] : []
	}

	constructor(){
		super()
	}

	async connect( port=0 ){

		if ( !window?.electron?.midi )
		{
			console.error("Electron bridge could not be found, check preload.ts")
			return false
		}	

		const available = await window.electron.hasVirtualMidi
		if ( !available )
		{
			console.error("Electron bridge could not be found, check preload.ts")
			window.electron.feedback("Failure")
			return false
		}

		//window.electron.transport()
		window.electron.midi( (time, message) => {
			switch(message)
			{
				case "fail":
					// tell the preloader to stop sending signals
					window.electron.feedback("Failure accepted")
					//console.error("no virtual midi",time, message)
					break

				default:
					this.connected = true
					const midiMessage = new Message(message)
					console.log("received virtual midi",time, message, midiMessage)
			}
		})

		//console.log("MIDIBridgeConnection:window.electron",window.electron)
		return { 
			status:"Electron MIDI Bridge created", 
			inputs:this.inputs, 
			outputs:this.outputs
		} 
	}

	async disconnect(){
		window.electron.midi( null )
	}
}