import { BROADCAST_KEY } from "./settings/options"

// global singletons
let broadCast = null

// BROADCAST TO PEERS ---------------------------------------------------------------
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