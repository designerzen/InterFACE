// https://www.g200kg.com/en/docs/webmidilink/spec.html
// This DOES NOT WORK IN NODE

// == RECEIVE ==============================================

export const observeWeblink = ( instrument ) => {

	const onWebMIDILinkReceived = (event) => {

		const data = event.data

		if (typeof data === 'string' || data instanceof String){
			// this is the format we expect
		}else{
			// this is what spams every DOM if you have react-dom tools installed!
			console.info("Ignored message", {data} )
			return
		}

		const msg = data.split(",") 

		switch (msg[0]) 
		{
			// Level1 messages
			case "link":  
				switch (msg[1]) {
					case "reqpatch":
						event.source.postMessage("link,patch," + instrument.getPatch(),"*")
						break
					case "setpatch":
						instrument.programChange(msg[2])
						break
				}
				break


			// Level0 messages
			case "midi":  

				switch (parseInt(msg[1], 16) & 0xf0) {
					case 0x80:
						instrument.noteOn(parseInt(msg[2], 16))
						break

					case 0x90:
						const velo = parseInt(msg[3], 16)
						if (velo > 0)
						{
							instrument.noteOn(parseInt(msg[2], 16), velo)
						}else{
							instrument.noteOff(parseInt(msg[2], 16))
						}
						break

					case 0xb0:
						if (parseInt(msg[2], 16) == 0x78) 
						{
							instrument.allNotesOff()
						}
						break
				}
				break
		}
	}
	window.addEventListener("message", onWebMIDILinkReceived, false)
}

// Functions should be implemented.
// function NoteOn(note,velo) {  }
// function NoteOff(note) {  }
// function NoteAllOff() {  }
// function GetPatchString() {  return strPatch; } // Get current patch data as a string.
// function SetPatchString(strPatch) {  } // Setup Synthesizer with strPatch

// == DISPATCH ==============================================

// Message	Direction	Description
// "link,ready"	Host<=Synth	Synthesizer should send this message to host when ready after start up. The host may be window.opener or window.parent depends on popup or iframe. Host noticed the synthesizer is LinkLevel 1 with this message and enable following LinkLevel 1 messages.
// "link,reqpatch"	Host=>Synth	Host request the current configuration data to synthesizer. The synthesizer should send following "link,patch" message.
// "link,patch,<data>"	Host<=Synth	The synthesizer send current configuration data to host with this message when received the "link,reqpatch".
// <data> is a proprietary data of this synthesizer but should be represented as a string and should not use comma (,). For example, it may be a url-encoded query string (a=00&b=11&c=33), or a Base64 / Base64url encoded binary-data.
// "link,setpatch,<data>"	Host=>Synth	Host send configuration data to synthesizer with this message. This <data> is a data acquired with "link,patch,<data>". The synthesizer should set-up the sound patch with this message.

const windowOpener = window.opener ? window.opener : window.parent

// Should be called when the Synthesizer is ready.
export const notifyObserversThatWeblinkIsAvailable = (msg) => {
	windowOpener.postMessage("link,ready", "*")
}


