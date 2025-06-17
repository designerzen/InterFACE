import { GENERAL_MIDI_INSTRUMENT_LIST } from "../audio/midi/general-midi.constants"

const createInstrumentFamilyTitle = (family, personName) => `<h4>${personName.length ? personName : family.replace("Instrument","")}</h4>`
const createInstrumentFamilySummary = (family) => `<summary><h5>${family}</h5></summary>`
const createInstrumentFamilyDetails = family => `<summary><h5>${family}</h5></summary>`

/**
 * Create the markup required for one single instrument request
 *  
 * @param {String} folder 
 * @param {String} instrumentName 
 * @returns 
 */
const createInstumentForForm = 
	( folder, instrumentName, personName ) => 
		`<li class="instrument">
			<label for="${personName}-${folder}">
				${instrumentName}
				<input id="${personName}-${folder}" name="instrument-selector" type="radio" value="${folder}" />
			</label>
		</li>`


const createInstumentFamilyForForm = 
	( family, instruments ) => 
		`<details open id="instrument-family-${family.toLowerCase()}">
			${createInstrumentFamilySummary(family)}
			<ul>${instruments.join('')}</ul>
		</details>`


/**
 * Show the instrument panel for Person 
 * @param {String} playerName 
 * @param {HTMLElement} controls 
 * @param {String} instrumentName 
 * @param {String} activeClassName 
 * @returns {Boolean}
 */
export const showPersonalControlPanel = (playerName, controls, instrumentName, activeClassName="expanded") => {
	
	if (instrumentName)
	{
		// find active input field and focus
		const active = document.getElementById(instrumentName)
		
		if (active)
		{
			active.focus({ focusVisible: false })
		}else{
			// send focus to form?
			controls.focus({ focusVisible: false })
		}
		
		// console.log("SHOW Form", {active, controls })
	}
	
	// FIXME: Add aria-roles
	controls.classList.toggle(activeClassName,true)
	document.documentElement.classList.toggle(`${playerName}-sidebar-showing`,true)

	return true
}

/**
 * Move any visible side bar into it's hidden state via animation
 * @param {String} playerName 
 * @param {HTMLElement} controls 
 * @param {String} activeClassName 
 * @returns 
 */
export const hidePersonalControlPanel = (playerName, controls,  activeClassName="expanded") => {
	// console.log("HIDE Form")
	controls.setAttribute("style", "--x:0;")
	controls.classList.toggle(activeClassName,false)
	document.documentElement.classList.toggle(`${playerName}-sidebar-showing`,false)
	return false
}

/**
 * Setup the instrument selection list 
 * @param {Function} callback Method to trigger when instument selected
 * @returns {String} HTML
 */
export const createInstrumentFormHTML = (instruments, packName="", personName="" ) => {

	let output = `${createInstrumentFamilyTitle(packName, personName)}
					<legend>Select an instrument</legend>`

	let family = instruments && instruments.length && instruments[0].family ? instruments[0].family : "Presets"
	//const uiOptions = []// instruments.map( (instrument, index) => createInstumentForForm( instrument.location, instrument.name ) ) 
	// add a title at the start...
	// uiOptions.unshift("<legend>Select an instrument</legend>")

	output += `<details open class="instrument-family-${family.toLowerCase()}">
					${createInstrumentFamilySummary(family)}
					<ul>`

	
	// FIXME: Presets come in different styles
	// if (typeof instruments[0] === "string")
	// {
		
	// }else{
	// 	// assuming object

	// }
	const isSimple = typeof instruments[0] === "string"
	// now group them into families...
	if (isSimple)
	{
		instruments.forEach( (instrument, index) => {
			const form = createInstumentForForm( instrument, instrument, personName )
			output += form
			output += `</ul>`
			output += `<ul>`
		})

	}else{

		instruments.forEach( (instrument, index) => {
			
			const form = createInstumentForForm( instrument.location, instrument.name, personName )
			output += form
			if (family !== instrument.family)
			{
				family = instrument.family ?? 'Family'
				output += `</ul></details>`
				output += `<details open id="${personName}-instrument-family-${family.toLowerCase()}">
							${createInstrumentFamilySummary(family, personName)}
							<ul>`
			}
		})	
	}
	
	output += `</ul></details>`
	return output
}


export const hideExistingInstruments = (controls) => {
	const allInstruments = controls.querySelectorAll(".instrument")
	allInstruments.forEach( instrument => instrument.hidden = true )
	// allInstruments.forEach( instrument => instrument.classList.add("hide") )
}

export const populateInstrumentPanel = async (controls, instrument, personName="") => {
	// populate the sidebar
	let presets = await instrument.getPresets()

	if (!presets )
	{
		return null
	} 

	console.info( "Presets available :", typeof presets[0], {presets})

	// FIXME: HACK!
	if (instrument.type === "sample")
	{
		presets = GENERAL_MIDI_INSTRUMENT_LIST
	}



	const existing = controls.querySelector(`.person-controls`)
	const instrumentMenuPanel = existing ? existing : document.createElement("div")
	instrumentMenuPanel.innerHTML = createInstrumentFormHTML( presets, instrument.name, personName  )
	// instrumentMenuPanel.className = `${instrument.name} person-controls`
	
	controls.appendChild(instrumentMenuPanel)
	return presets
}

/**
 * Adds mouse and touch and drag events
 * to the instrument panel so that the user
 * can drag or double click or drag it open!
 * @param {HTMLElement} controls 
 * @param {Function} onInstrumentInput 
 */
export const addInteractivityToInstrumentPanel = (controls, onInstrumentInput, passive=true ) => {
	
	if (!controls)
	{
		throw Error("The instrument panel does not contain the required menu element")
	}
	
	const controller = new AbortController()

	const inputs = controls.querySelectorAll('input')
	inputs.forEach( input => input.addEventListener('change', e => onInstrumentInput(e), {signal: controller.signal, passive }) )
	
	// console.error("addInteractivityToInstrumentPanel", {controls, inputs} )

	// toggle the accordian modes for the details
	const legend = controls.querySelector('legend')
	legend.addEventListener("click", event => {
		const details = controls.querySelectorAll('details')
		if (details.length)
		{
			const shouldOpen = !details[0].hasAttribute("open")
			details.forEach( detail => {
				shouldOpen ? detail.setAttribute("open", true) : detail.removeAttribute("open")
			})
		}
	}, {signal: controller.signal, passive })

	// DESTROY
	return ()=>{
		controller.abort()
	}
}

export const createDraggablePanel = (person, controls, onLeftSide=true, activeClassName="expanded", considerOpenAt=0.5) => {

	const playerToggleSelector = ".person-toggle-controls"
	const playerName = controls.className.split(" ")[1] //.replace("person-","" ).replace("-panel","" )
	const drawerToggle = controls.querySelector( playerToggleSelector )
	
	let isDrawerOpen = controls.classList.contains(activeClassName) 
	let bypass = false

	// console.error("Creating sidebar", {isDrawerOpen, onLeftSide} )
	
	const setDrawerState = (open) => {

		isDrawerOpen = open
		//- controls.setAttribute("style", `--x:${!isOpen ? 999 : 0 };`)
		
		// reset the drag state
		if (open)
		{
			showPersonalControlPanel( playerName, controls, person.instrumentTitle )
		}else{
			hidePersonalControlPanel( playerName, controls )
		}
		// controls.classList.toggle(activeClassName, open)
	}

	const onDragControlStart = (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}
		controls.classList.toggle("dragging", true)
	}

	const onDragControls = (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		if (bypass)
		{
			// console.warn("dragend:BYPASS", event)  
			return
		}

		// FIXME: onLeftSide needs to be pixels from right edge
		const x = onLeftSide ? 
			event.clientX :
			window.innerWidth - event.screenX

		// now move the controls into position!
		controls.setAttribute("style", `--x:${x};`)
		// ensure we can drag it
		controls.classList.toggle(activeClassName, false)

		// console.warn("mousemove", x, window.innerWidth , {event, onLeftSide, })
	}

	// 
	const onDragControlsEnd = (event) => {
		if (bypass)
		{
			// console.warn("dragend:BYPASS", event)  
			return
		}
				
		if (event.preventDefault)
		{
			event.preventDefault()
		}
		
		// FIXME: onLeftSide needs to be pixels from right edge
		const x = onLeftSide ? 
			event.clientX :
			window.innerWidth - event.screenX

		const panelWidth = controls.clientWidth || 25
		// see if it has been dropped near?
		// snap into position!
	// determine if it is open or closed!

		document.removeEventListener("mousemove", onDragControls)
		document.removeEventListener("mouseup", onDragControlsEnd)
		controls.classList.toggle("dragging", false)

		isDrawerOpen = x >= panelWidth * considerOpenAt

		if (isDrawerOpen)
		{
			// console.error(x, panelWidth/2, "dragend:SHOW", event)
			controls.classList.toggle(activeClassName, true)
			controls.setAttribute("style", `--x:${999};`)
		}else{

			// console.error(x, panelWidth/2, "dragend:HIDE", event)
			controls.classList.toggle(activeClassName, false)
			controls.setAttribute("style", `--x:${0};`)
		}
	}
	
	//- controls.addEventListener("dragstart", (event) => {
	controls.addEventListener("mousedown", (event) => {
		
		// check the type of the target - if it is a button
		// or a summary we choose to ignore it.
		const nodeType = event.target.nodeName
		// const isInstrumentButton = 
		if (nodeType === "DIV" || nodeType === "BUTTON")
		{
			// console.log("action click", nodeType)
			
		}else{
			// console.log("ignored click", nodeType)
			return
		}
		
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		// console.log("controls:mousedown", event)
		
		// see if it has been dropped near?
		document.addEventListener("mousemove", onDragControls)
		document.addEventListener("mouseup", onDragControlsEnd)
	})


	controls.addEventListener("dragstart", (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}
		// console.log("dragstart", event)
		controls.classList.toggle(activeClassName, false)
			
		// see if it has been dropped near?
		onDragControlStart(event)
	})

	controls.addEventListener("dragend", onDragControlsEnd)
	
	const onDragCompleteOrCancelled = e => {

		// as we may have had some external control, we re-check this state
		isDrawerOpen = controls.classList.contains(activeClassName) 

		if (e.preventDefault)
		{
			e.preventDefault()
		}
		
		setDrawerState( !isDrawerOpen )
		
		document.removeEventListener("mouseleave", onDragCompleteOrCancelled)
		document.removeEventListener("mouseup", onDragCompleteOrCancelled)
	
		bypass = false
	}
	
	// Event instant open / close drawer by tapping the button
	drawerToggle.addEventListener("mousedown", event => {

		if (event.preventDefault)
		{
			event.preventDefault()
			event.stopPropagation()
		}
		
		bypass = true

		// console.error("drawerToggle:down showing", isDrawerOpen)

		document.addEventListener("mouseleave", onDragCompleteOrCancelled)
		document.addEventListener("mouseup", onDragCompleteOrCancelled)
	})
	
	// same as above but anywhere
	controls.addEventListener("dblclick", (e) => {
		if (e.preventDefault)
		{
			e.preventDefault()
		}
		// double clicking the toggle button should probably be ignored
		if (e.target.matches(playerToggleSelector))
		{
			return
		}
		setDrawerState( !isDrawerOpen )
	})

	return person
}