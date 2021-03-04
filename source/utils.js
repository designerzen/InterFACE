
export const debounce = (callback, wait) => {
	let timerId
	
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	  return timerId
	}
}
