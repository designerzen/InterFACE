const doc = document

const numberOfPlayersAsString = quantityOfPlayers => {
	switch(quantityOfPlayers)
	{
		case 1:
			return "solo"
		case 2:
			return "duet"
		case 3:
			return "trio"
		case 4:
			return "quartet"
		default:
			return "unknown"
	}
}

/**
 * This is the 2nd screen, just after loading
 * @param {Object} options Configuration object
 * @param {Object} stateMachine State object - used for preselecting options
 * @returns {Promise} with an object payload
 */
export const showPlayerSelector = (options, stateMachine) => new Promise( (resolve,reject)=>{

	// use this to set the buttons on the form
	const maxQuantityOfPlayers = options.maxFaces
	const previouslySelectedQuantityOfPlayers = parseInt(stateMachine.get("players") ?? 1)
	
	let players = previouslySelectedQuantityOfPlayers

	const BODY_CSS_ID_CLASS = "player-selection"
	
	const body = doc.documentElement

	const form = doc.getElementById("onboard")
	const buttonStart =  doc.getElementById("button-start")
	const labelForButtonStart = form.querySelector("label[for=button-start]")
	const panel = doc.getElementById("player-selector")

	const buttonSolo = panel.querySelector("#button-solo")
	const buttonDuet = panel.querySelector("#button-duet")
	const buttonTrio = panel.querySelector("#button-trio")
	const buttonQuartet = panel.querySelector("#button-quartet")
	const feedback = doc.getElementById("advanced-mode-feedback")
	
	// here we allow for however many buttons to show
	
	const playerQuantityButtons = [buttonSolo, buttonDuet, buttonTrio, buttonQuartet]

	const playerQuantities = ["solo", "duet", "trio", "quartet"].slice(0, options.maxFaces ?? 4 )
	
	const advanced = doc.getElementById("toggle-advanced-mode")
	const automation = doc.getElementById("toggle-automation-mode")
	
	// Let us display all the players that can be selected only
	for (let i=0, l=playerQuantityButtons.length; i < l; ++i)
	{
		const button = playerQuantityButtons[i]
		if (!button){
			throw Error("Player "+i+" button not found")
		}
		const label = button.previousSibling
		if (i < maxQuantityOfPlayers)
		{
			// show buttons
			// parent.classList.toggle( "hide", false)
			button.hidden = false 
			label.hidden = false 
		}else{
			// hide buttons
			// parent.classList.toggle( "hide", true)
			button.hidden = true
			label.hidden = true
		}
	}


	// 1. We first set the state of the gadgets based on the query string set object 
	//	  passed in as a property

	// 2. We await an input from the user

	// determine state of the UI and update the DOM
	let advancedMode = stateMachine.get("advancedMode") ?? false
	let automationMode = stateMachine.get("automationMode") ?? false
	

	const setQuantityOfPlayers = amount => {
		players = amount
		body.classList.remove(...playerQuantities)
		body.classList.add( numberOfPlayersAsString(amount) )
		const addendumText = automationMode ? " with automation" : ""
		const advancedModeText = advancedMode ? "an advanced mode" : "a simple mode"
		switch(amount)
		{	
			case 2:
				labelForButtonStart.textContent = `Start ${advancedModeText} Duet${addendumText}`
				buttonStart.value = `Start a Duet`
				break
			case 3:
				labelForButtonStart.textContent = `Start ${advancedModeText} Trio${addendumText}`
				buttonStart.value = `Start a Trio`
				break
			case 4:
				labelForButtonStart.textContent = `Start ${advancedModeText} Quartet${addendumText}`
				buttonStart.value = `Start a Quartet`
				break
			default:
				labelForButtonStart.textContent = `Start${addendumText} ${advancedModeText} Solo`
				buttonStart.value = `Solo Start`
				break
		}
	}

	const complete = result => {

		// hide / show buttons as relevant
		playerQuantityButtons.forEach( (button, index) =>{
			if (index !== result) {
				// hide deselected
				button.hidden = false
			}else{
				// show the selected one
				button.hidden = true
				body.classList.add(playerQuantities[index])
			}
		} )
     
		// start the animation out.
		// NB. This is not superflous as the camera
		// takes a broze age to load into memory
		form.classList.add("completed")
		body.classList.toggle(BODY_CSS_ID_CLASS, true)

		// removeTooltip( start.parentElement )
		// removeTooltip( automation.parentElement )
		setQuantityOfPlayers( result )

		// wait for animation to complete
		// and for button to be clicked
		setTimeout( ()=> {
			//console.log({advancedMode})
			body.classList.toggle('advanced', advancedMode)
			body.classList.toggle(BODY_CSS_ID_CLASS, false)
			panel.classList.remove("completed")
			
			resolve({
				players:result,
				advancedMode,
				automationMode
			})
		}, 45 )
	}

	// Each input chooses how many players can interact
	buttonSolo.addEventListener("click", event => setQuantityOfPlayers(1) )
	buttonDuet.addEventListener("click", event => setQuantityOfPlayers(2) )
	buttonTrio.addEventListener("click", event => setQuantityOfPlayers(3) )
	buttonQuartet.addEventListener("click", event => setQuantityOfPlayers(4) )

	advanced.addEventListener("change", event =>{ 
		advancedMode = advanced.checked 
		body.classList.toggle("beginner", !advancedMode  )
		const explanation = feedback.childNodes[ advancedMode ? 1 : 0 ]
		feedback.childNodes.forEach( child => explanation === child ? child.hidden = false : child.hidden = true )
		
		// update button text
		setQuantityOfPlayers( players )
	})

	// immediately hide the appropriate output info child
	feedback.childNodes[ advancedMode ? 0 : 1 ].hidden = true
	

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
	
	// update UI with previously set options
	setQuantityOfPlayers( previouslySelectedQuantityOfPlayers )
	switch(previouslySelectedQuantityOfPlayers)
	{		
		case 4:
			buttonQuartet.checked = true
			break
		case 3:
			buttonTrio.checked = true
			break
		case 2:
			buttonDuet.checked = true
			break

		case 1:
		default:
	}

	advanced.checked = advancedMode
	automation.checked = automationMode
	
	body.classList.toggle("beginner", !advancedMode)
	body.classList.toggle("automated", automationMode)
	body.classList.toggle(BODY_CSS_ID_CLASS, true)

	// add tooltips
	// addTooltip( start.parentElement )
	// addTooltip( automation.parentElement )

	panel.focus({ focusVisible: false })
})