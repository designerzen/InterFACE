import { BROADCAST_KEY } from "./settings/options"
import PartySocket from "partysocket"

export const connectToWebSocketServer = ( roomName="photosynthparlour", host="localhost:1999" ) => {
		
	const onMIDIMessage = (message, player=0 ) => {
		const midiNote = message.data[1]
		if (message.data[0] === 144 && message.data[2] > 0) {
			playNote(midiNote, 0)
			partySocket.send(message.data)

		}else if (message.data[0] === 128 || message.data[2] === 0) {
			stopNote(midiNote, 0)
			partySocket.send(message.data)
		}
	}
		
	const success = (midi) => {
		const inputs = midi.inputs.values()
		// inputs is an Iterator 
		for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
			// each time there is a midi message call the onMIDIMessage function 
			input.value.onmidimessage = onMIDIMessage
		}
	}

	const failure = (error) => { 
		console.error('No access to your midi devices.', error)
	}

	// connect to our server
	const partySocket = new PartySocket({ host, room:roomName })

	// send a message to the server with some data about this client
	// as this will be then passed to all connected peers
	partySocket.send("Hello everyone")

	// print each incoming message from the server to console
	partySocket.addEventListener("message", (e) => {
		console.log(e)
		onMIDIMessage(e.data, 1)
	})

	navigator.requestMIDIAccess().then(success, failure)

	return {
		send:partySocket.send
	}
}


// global singletons
let broadCast = null

// BROADCAST TO PEERS IN THIS BROWSER ONLY! ---------------------------------------------------------------
export const monitorBroadCastChannel = ( application, key=BROADCAST_KEY ) => {

	if (broadCast)
	{
		// we only ever have one broadcaster
		return broadCast
	}

	const clock = application.clock
	
	// Set the port for the app to communicate to others
	broadCast = new BroadcastChannel( key )

	setBroadCaster( broadCast)
		
	// if there are any clock messages during boot up we assume
	// that means another instance is the master and this is the slave
	broadCast.onmessage = (event) => {
		
		// if there are any messages received before it has loaded
		// then we assume that this is a slave device to a master somewhere
		// else
		if (!application.isLoading)
		{
			// slaves never dispatch events
			application.setAsSlave(true)
			// console.log("Received message from master", event)
			return
		}
	
		// now we have loaded, if we *are* the slave, take the external trigger
		// and use it to control our timer via externalSync
		if (application.isSlave)
		{
			switch(event.data.type)
			{
				case "clock":
					// if we want an exclusive clock
					clock.bypass(true)
					clock.externalTrigger()
					break

				case "announcement":
					// if we are a master we may have sent out htis
					break

				case "demand":
					// if we are a master we may have sent out htis
					break
			}
		}
	}

	broadCast.postMessage({type:"announcement"})

	return broadCast
}