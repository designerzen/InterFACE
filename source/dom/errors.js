
export const showError = (error, solution, fatal=false) => {
	console.error("Could not load", error )
	console.warn( "Consider:", solution )
	// if fatal then we can't continue so show reload button?
}