export const memoize = ( method ) => {

	// store outputs and inputs
	const cache = new Map()

	// takes same args as the method
	return (...args) => {

		// check to see if we have a cached entry
		if (cache.has(args))
		{
			return cache.get(args)
		}

		const result = method.apply( this, args )
		cache.set( args, result )
		return result
	}
}


