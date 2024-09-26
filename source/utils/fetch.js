
export const pause = (duration = 1000) => new Promise((resolve) => setTimeout(resolve, duration))

// Thanks! https://danlevy.net/you-may-not-need-axios/
export const checkForRedirect = (response) => {
	// Check for temporary redirect (307), or permanent (308)
	if (response.status === 307 || response.status === 308) {
	  const location = response.headers.get('location')
	  if (!location) {
		return Promise.reject(new Error('Invalid HTTP Redirect! No Location header.'));
	  }
	  // You can change the behavior here to any custom logic:
	  //   e.g. open a "confirm" modal, log the redirect url, etc.
	  return fetch(location)
		// Bonus: this will handle recursive redirects ✨
		.then(checkForRedirect)
	}
	return response
}

/**
 * const handler = ({loaded, total}) => {
 *      console.log(`Downloaded ${loaded} of ${total}`)
 * }
 * handler args: ({ loaded = Kb, total = 0-100% })
 * const streamProcessor = monitorProgress(handler)
 * => streamProcessor is a function for use with the response _stream_
 * 
 * @param {*} onProgress 
 * @returns 
 */
export const monitorProgress = (onProgress) => {
	return (response) => {
		if (!response.body) return response

		let loaded = 0
		const contentLength = response.headers.get('content-length')
		const total = contentLength ? parseInt(contentLength, 10) : -1

		return new Response(
			new ReadableStream({
				start(controller) {
					const reader = response.body.getReader()
					return read()

					function read() {
						return reader.read()
							.then(({ done, value }) => {
								if (done) return void controller.close()
								loaded += value.byteLength
								onProgress({ loaded, total })
								controller.enqueue(value)
								return read()
							})
							.catch(error => {
								console.error(error)
								controller.error(error)
							})
					}
				}
			})
		)
	}
}

/**
 * Load in text file from a server
 */
export const fetchText = async (url, abortController = null, maximumAttempts = 0, reattempt = 0) => {

	try {
		const response = await fetch(url, abortController !== null ? { signal: abortController.signal } : {})
		const data = await response.text()

		if (!response.ok) {
			// get error message from body or default to response status
			const error = (data && data.message) || response.status
			throw Error(error)
		}

		return data

	} catch (error) {

		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.error('SyntaxError', error)
		} else {
			console.error("Data Set could not be accessed at " + url)
			console.error('Error', error)
		}

		if (reattempt < maximumAttempts) {
			// add some time between attempts?
			return await fetchJSON(url, abortController, maximumAttempts, reattempt + 1)
		} else {
			return null
		}
	}
}



/**
 * Load in our data via JSON
 */
export const fetchJSON = async (url, abortController = null, maximumAttempts = 0, reattempt = 0) => {

	try {
		const response = await fetch(url, abortController !== null ? { signal: abortController.signal } : {})
		// streamProcessor(response)

		const contentType = response.headers.get('content-type')
		const isJson = contentType ? contentType.includes('application/json') : false	
		const data = isJson ? await response.json() : null

		if (!response.ok) {
			// get error message from body or default to response status
			const error = (data && data.message) || response.status
			throw Error(error)
		}

		if (!isJson) {
			console.error("JSON file was mis-named?", {url, contentType, maximumAttempts})
			throw Error(response.status + ": This data file is not a JSON data file; " + response.statusText)
		}

		return data

	} catch (error) {

		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.error('JSON SyntaxError', error)
		} else {
			console.error("Data Set could not be accessed at " + url)
			console.error('Error', error)
		}

		if (reattempt < maximumAttempts) {
			// add some time between attempts?
			return await fetchJSON(url, abortController, maximumAttempts, reattempt + 1)
		} else {
			return null
		}
	}
}
