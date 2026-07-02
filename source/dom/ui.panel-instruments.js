import { GENERAL_MIDI_INSTRUMENT_LIST } from "../audio/midi/general-midi.constants.js"
import { INTERVAL_LIBRARY } from "../audio/tuning/scales.js"

const INSTRUMENT_CLASS = "btn-select-instrument"
const PERSON_OPTION_CLASS = "person-option-control"

const OCTAVE_OPTIONS = Array.from({length:9}, (_, octave) => [octave, octave])

const SEQUENCE_OPTIONS = [
	["circle-of-fifths", "Circle of Fifths", "FIFTHS_SCALE"],
	["chromatic", "Chromatic", "CHROMATIC_SCALE"],
	["major", "Major", "MAJOR_SCALE"],
	["natural-minor", "Natural minor", "NATURAL_MINOR_SCALE"],
	["pentatonic-major", "Pentatonic major", "PENTATONIC_MAJOR_SCALE"],
	["pentatonic-minor", "Pentatonic minor", "PENTATONIC_MINOR_SCALE"],
	["blues", "Blues", "BLUES_SCALE"],
	["whole-tone", "Whole tone", "WHOLE_TONE_SCALE"],
	["diminished", "Diminished", "DIMINISHED_SCALE"],
	["augmented", "Augmented", "AUGMENTED_SCALE"]
].filter(([, , scale]) => INTERVAL_LIBRARY[scale]).map(([value, label]) => [value, label])

const createOptions = (options, currentValue) => options.map(([value, label]) => {
	const selected = String(value) === String(currentValue) ? " selected" : ""
	return `<option value="${value}"${selected}>${label}</option>`
}).join("")

const createSelectControl = (label, name, currentValue, options, attributes="data-person-option", className="") => `
	<label class="person-option ${className}">
		<span class="person-option-label">${label}</span>
		<select class="${PERSON_OPTION_CLASS}" ${attributes}="${name}">
			${createOptions(options, currentValue)}
		</select>
	</label>`

const createToggleControl = (label, name, currentValue) => `
	<label class="person-option person-option-toggle">
		<input class="${PERSON_OPTION_CLASS} toggle" data-person-option="${name}" type="checkbox"${currentValue ? " checked" : ""} />
		<span class="person-option-label">${label}</span>
	</label>`

const createSummaryContent = (label) => `<span class="instrument-summary-title">${label}</span>`

const createPersonOptionsHTML = (person) => {
	if (!person)
	{
		return ""
	}

	const options = person.options ?? {}
	const playMode = person.activeInstrument?.arpeggiate ? "arpeggio" : "chord"
	const lowOctave = Number.isFinite(Number(options.octaveLow)) ? Number(options.octaveLow) : 2
	const highOctave = Number.isFinite(Number(options.octaveHigh)) ? Number(options.octaveHigh) : 6

	return `<details class="person-options">
		<summary>${createSummaryContent("Options")}</summary>
		<div class="person-options-grid">
			${createSelectControl("Note sequence", "noteSequence", person.noteSequence, SEQUENCE_OPTIONS, "data-person-action", "person-option-wide")}
			${createSelectControl("Play", "playMode", playMode, [["chord", "Sympathetic Chords"], ["arpeggio", "Arpeggio"]], "data-person-action")}
			${createSelectControl("Lower octave", "octaveLow", lowOctave, OCTAVE_OPTIONS, "data-person-option", "person-option-compact")}
			${createSelectControl("Upper octave", "octaveHigh", highOctave, OCTAVE_OPTIONS, "data-person-option", "person-option-compact")}
			${createToggleControl("Mute", "muted", options.muted)}
			${createToggleControl("Chord labels", "showChordNames", options.showChordNames)}
			${createToggleControl("Pitch bend", "pitchBend", options.pitchBend)}
			${createToggleControl("Eyebrows", "drawEyebrows", options.drawEyebrows)}
			${createToggleControl("Eyes", "drawEyes", options.drawEyes)}
			${createToggleControl("Mouth", "drawMouth", options.drawMouth)}
			${createToggleControl("Nose", "drawNose", options.drawNose)}
			${createToggleControl("Stereo pan", "stereoPan", options.stereoPan)}
		</div>
	</details>`
}

const createInstrumentFamilyTitle = (family, personName) => `<h4 class="instrument-families">${personName.length ? personName : family.replace("Instrument","")}</h4>`
const createInstrumentFamilySummary = (family) => `<summary>${createSummaryContent(family)}</summary>`
const createInstrumentInput = (personName, folder) => `<input class='${INSTRUMENT_CLASS}' id="${personName}-${folder}" name="instrument-selector-${personName}" type="radio" value="${folder}" />`

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
				${createInstrumentInput(personName, folder)}
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

	// toggle class in header
	// this allows us to close the others too)
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
export const createInstrumentFormHTML = (instruments, packName="", personName="", includeTitle=true ) => {

	let output = includeTitle ? createInstrumentFamilyTitle(packName, personName) : ""
	output += `<legend class="sr-only">Select an instrument</legend>`

	let family = instruments && instruments.length && instruments[0].family ? instruments[0].family : "Select a preset"
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
			// output += `</ul>`
			// output += `<ul>`
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

export const populateInstrumentPanel = async (controls, instrument, personOrName="") => {
	const person = typeof personOrName === "string" ? null : personOrName
	const personName = person?.id ?? personOrName
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
	instrumentMenuPanel.className = "person-controls"
	instrumentMenuPanel.innerHTML = createInstrumentFamilyTitle(instrument.name, personName) +
		createPersonOptionsHTML(person) +
		createInstrumentFormHTML( presets, instrument.name, personName, false )
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
export const addInteractivityToInstrumentPanel = (controls, onInstrumentInput, passive=false ) => {
	
	if (!controls)
	{
		throw Error("The instrument panel does not contain the required menu element")
	}
	
	const controller = new AbortController()

	controls.addEventListener('change', event => {
		if (event.target.matches('input.'+INSTRUMENT_CLASS) || event.target.matches('.'+PERSON_OPTION_CLASS))
		{
			onInstrumentInput(event)
		}
	}, {signal: controller.signal, passive })
	
	// console.error("addInteractivityToInstrumentPanel", {controls, inputs} )

	// toggle the accordian modes for the details
	controls.addEventListener("click", event => {
		const legend = event.target.closest('legend')
		if (!legend || !controls.contains(legend))
		{
			return
		}
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

	const getDragX = (event) => {
		const point = event.changedTouches?.[0] ?? event.touches?.[0] ?? event
		return onLeftSide ? point.clientX : window.innerWidth - point.clientX
	}

	// console.error("Creating sidebar", {isDrawerOpen, onLeftSide} )

	const refreshDrawerContent = () => {
		person.isFormShowing = isDrawerOpen

		if (isDrawerOpen)
		{
			person.refreshInstrumentPanelIfDirty?.().catch(error => {
				console.error("Failed to refresh instrument panel", error)
			})
		}
	}
	
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
		refreshDrawerContent()
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

		const x = getDragX(event)

		// now move the controls into position!
		controls.setAttribute("style", `--x:${x};`)
		// ensure we can drag it
		controls.classList.toggle(activeClassName, false)
		controls.classList.toggle("dragging", true)

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
		
		const x = getDragX(event)

		const panelWidth = controls.clientWidth || 25
		// see if it has been dropped near?
		// snap into position!
	// determine if it is open or closed!

		document.removeEventListener("mousemove", onDragControls)
		document.removeEventListener("mouseup", onDragControlsEnd)
		document.removeEventListener("touchmove", onDragControls)
		document.removeEventListener("touchend", onDragControlsEnd)
		document.removeEventListener("touchcancel", onDragControlsEnd)
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
		refreshDrawerContent()
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
		controls.classList.toggle("dragging", true)
		document.addEventListener("mousemove", onDragControls)
		document.addEventListener("mouseup", onDragControlsEnd)
	})

	controls.addEventListener("touchstart", (event) => {
		const nodeType = event.target.nodeName
		if (nodeType !== "DIV" && nodeType !== "BUTTON")
		{
			return
		}

		if (event.preventDefault)
		{
			event.preventDefault()
		}

		controls.classList.toggle("dragging", true)
		document.addEventListener("touchmove", onDragControls, {passive:false})
		document.addEventListener("touchend", onDragControlsEnd)
		document.addEventListener("touchcancel", onDragControlsEnd)
	}, {passive:false})


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
		document.removeEventListener("touchend", onDragCompleteOrCancelled)
		document.removeEventListener("touchcancel", onDragCompleteOrCancelled)
		controls.classList.toggle("dragging", false)
	
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

	drawerToggle.addEventListener("touchstart", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
			event.stopPropagation()
		}
		
		bypass = true

		document.addEventListener("touchend", onDragCompleteOrCancelled)
		document.addEventListener("touchcancel", onDragCompleteOrCancelled)
	}, {passive:false})
	
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
