
export const showError = (error, solution, fatal=false) => {

	document.documentElement.classList.add("failure")
	document.documentElement.remove("loading")
	document.getElementById("feedback").appendChild( createReloadButton(true) )
			
	console.error("Could not load", error )
	console.warn( "Consider:", solution )

	// play lemmings sound effect...
	let audio = new Audio()
	audio.src = URL.createObjectURL("/assets/audio/lemmings.wav")
	
	// if fatal then we can't continue so show reload button?
}