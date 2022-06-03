
let firstNode = null
let finalNode = null
let currentChain = null
let currentContext = null

// If you just want to add things into the mix..
export const inputNode = () => (firstNode.name ? firstNode.node : firstNode )

// If you want to bypass themix and send straight to the amp
export const inputDryNode = () => finalNode

export const resolveRoute = route => {
	return route.name ? route.node : route 
}

/**
 * just does linear connects in sequence for easier protyping
 * @param {Array<Filters>} routes 
 * @param {AudioContext} audioContext 
 * @returns first node in chain
 */
export const chain = ( routes, audioContext=null ) => {

	// we should always unchain before rechaining otherwise... havoc
	unchain()

	// check if already chained and unchain if required... 
	const quantity = routes.length

	if (quantity > 1)
	{
		for (let i=1; i<quantity; ++i)
		{	
			// check to see if it is a wrapped object...
			const previous = resolveRoute( routes[ i-1 ] )
			const route = resolveRoute( routes[ i ] )

			previous.connect(route)
			
			if (i === 1)
			{
				firstNode = previous
			}
	
			if (i === quantity-1 )
			{
				finalNode = route
			}
		}
	}else{

		firstNode = finalNode = resolveRoute( routes[ 0 ] )
	}

	// if last one we can connect to output...
	if (audioContext )
	{
		finalNode.connect(audioContext.destination)
	}

	currentChain = routes
	currentContext = audioContext

	return firstNode
}

// TODO: remove an FX?
export const removeLink = item => {

}

export const unchain = () => {

	// check to see there is a chain and a context...
	if (currentChain && currentContext)
	{
		const quantity = currentChain.length
		// now loop through and unchain...
		// route.disconnect()
		if ( quantity > 1 )
		{
			// many
			for (let i=1; i<quantity; ++i)
			{	
				const previous = resolveRoute( routes[ i-1 ] )
				const route = resolveRoute( routes[ i ] )
				previous.disconnect(route)
			}

		}else{
			// single there is nothing to disconnect!?
		}

		finalNode.disconnect(audioContext.destination)

	}else{
		// nothing to unchain
	}
}