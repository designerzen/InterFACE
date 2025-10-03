export const convertOptionToObject = items => items.reduce( (accumulator, current) => {
	const c = current.split(":")
	accumulator[c[0]] = parseFloat(c[1])
	return accumulator
}, {})


export const toKebabCase = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

export const debounce = (callback, wait) => {
	let timerId
	
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	  return timerId
	}
}


// memoize this method
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


export const injectJavascript = async(url) => new Promise((resolve, reject) => {
	const script = document.createElement("script")
	script.onload = () => { resolve(url) }
	script.onerror = error => { reject(error) }
	script.src = url
	document.head.appendChild(script)
	// console.error("injecting JS", url , script)
})

/**
 * Save file with "File save as" native dialog
 * @param {Blob} blob
 */
export const fileSaveAs = async (blob) => {
	try {
		
		const writable = await (await window.showSaveFilePicker({
			types: [
				{
					description: 'PNG Image',
					accept: {
						'image/png': ['.png']
					}
				}
			]
		})).createWritable()

		await writable.write(blob)
		await writable.close()
		return true
	} catch {
		// alert('File not saved');
		return false
	}
}



export const isBrowser = () => typeof window === "object" && typeof process === "undefined";

export const disableContextMenu = () => {
	document.documentElement.oncontextmenu = function() {
		return false
	}
}