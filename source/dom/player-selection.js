import { addTooltip, removeTooltip } from "./tooltips"


const doc = document

/**
 * This is the 2nd screen, just after loading
 * @param {Object} options Configuration object
 * @param {Object} state State object - used for preselecting options
 * @returns {Boolean} true if the user hit duet
 */
export const showPlayerSelector = (options, state) => new Promise( (resolve,reject)=>{

	const CSS_CLASS = "player-selection"
	const form = doc.getElementById("onboard")
	const panel = doc.getElementById("player-selector")
	const solo = panel.querySelector("#button-solo")
	const duet = panel.querySelector("#button-duet")
	const trio = panel.querySelector("#button-trio")
	const start =  doc.getElementById("button-start")
	const body = doc.documentElement
	
	const advanced = panel.querySelector("#toggle-advanced-mode")
	const automation = panel.querySelector("#toggle-automation-mode")

	// 1. We first set the state of the gadgets based on the query string set object 
	//	  passed in as a property

	// 2. We await an input from the user

	// determine state of the UI and update the DOM
	let advancedMode = state.advancedMode
	let automationMode = state.automationMode
	let players = state.duet ? 2 : 1

	const setPlayers = amount => {
		players = amount
		body.classList.remove("solo", "duet", "trio")
		body.classList.add( players === 1 ? "solo" : "duet")
	}

	const complete = result => {
		
		// if we are in solo mode
		if (result < 2)
		{
			solo.classList.toggle( "hide", true)
			duet.classList.toggle( "hide", false)
			
			doc.documentElement.classList.add("solo")
		
		}else{
			
			duet.classList.toggle( "hide", true)
			solo.classList.toggle( "hide", false)
			
			doc.documentElement.classList.add("duet")
		}

		// start the animation out.
		// NB. This is not superflous as the camera
		// takes a broze age to load into memory
		panel.classList.add("completed")
		body.classList.toggle(CSS_CLASS, true)
			
		// wait for animation to complete
		setTimeout( ()=> {
			//console.log({advancedMode})
			body.classList.toggle('advanced', advancedMode)
			body.classList.toggle(CSS_CLASS, false)
			panel.classList.remove("completed")
		}, 45 )

		// removeTooltip( start.parentElement )
		// removeTooltip( automation.parentElement )
		
		resolve({
			players:result,
			advancedMode,
			automationMode
		})
	}

	solo.addEventListener("click", event => setPlayers(1) )
	duet.addEventListener("click", event => setPlayers(2) )
	trio.addEventListener("click", event => setPlayers(3) )

	advanced.addEventListener("change", event =>{ 
		advancedMode = !advancedMode 
		body.classList.toggle("beginner", !advancedMode)
	})
	
	automation.addEventListener("change", event =>{ 
		automationMode = !automationMode 
		body.classList.toggle("automated", automationMode)
	})
	
	// start.addEventListener("click", event => {
	// 	event.preventDefault()
	// 	complete(players)
	// 	return false
	// } , true )
	
	form.addEventListener("submit", (event) => {
		event.preventDefault()
		complete(players)
		return false
	}, true)
	
	// update UI
	setPlayers( players )
	advanced.checked = !advancedMode
	automation.checked = automationMode
	body.classList.toggle("beginner", !advancedMode)
	body.classList.toggle("automated", automationMode)
	
	switch(players)
	{		
		case 2:
			duet.checked = true
			break

		case 1:
		default:
	}

	body.classList.toggle(CSS_CLASS, true)

	// add tooltips
	// addTooltip( start.parentElement )
	// addTooltip( automation.parentElement )

	panel.focus()
})
