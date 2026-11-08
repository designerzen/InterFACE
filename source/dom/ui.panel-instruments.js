import { EYEBROW_STYLES, getEyebrowStyle, eyebrowStyleIcon } from '../visual/eyebrow-styles.js'
import { populateSelect } from './select.js'
import { resolveLipSetting, normaliseMouthDynamicsOverride, normaliseLipRangeOverride, formatLipSetting, getMouthDynamicsPresetId, MOUTH_DYNAMICS_PRESETS, LIP_SENSITIVITY_INHERIT } from '../people/lip-sensitivity.js'
import { WebMidi } from "webmidi"
import { INSTRUMENT_TYPE_FM } from "../audio/instrument-list.js"
import { GENERAL_MIDI_INSTRUMENT_LIST } from "../audio/midi/general-midi.constants.js"
import { INSTRUMENT_TYPE_COMPOSITE, INSTRUMENT_TYPE_SOUNDFONT, PERSON_INSTRUMENT_OPTIONS } from "../audio/instrument-list.js"
import { INTERVAL_LIBRARY } from "../audio/tuning/scales.js"
import { EMOJI_MOOD_ALL, EMOJI_MOOD_HAPPY, EMOJI_MOOD_SAD } from "../models/emoji.js"
import {
	NOTE_PARTICLE_GRAPHIC_OPTIONS,
	NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC,
	POINTS_OVERRIDE_INHERIT,
	POINTS_OVERRIDE_OFF,
	POINTS_OVERRIDE_ON,
	normalisePointsOverride
} from "../settings/options.people.js"
import {
	HEAD_NOTE_RANGE_INHERIT,
	HEAD_VERTICAL_RANGE_INHERIT,
	MAX_HEAD_NOTE_RANGE_DEGREES,
	MIN_HEAD_NOTE_RANGE_DEGREES,
	normaliseHeadNoteRangeOverride,
	normaliseHeadVerticalRangeOverride
} from "../people/head-note-range.js"
import { debounce } from "../utils/utils.js"
import { openPersonReportDialog } from './person-report-dialog.js'

import { getLipStyle, LIP_STYLE_OPTIONS } from '../visual/lip-styles.js'

const INSTRUMENT_CLASS = "btn-select-instrument"
const PERSON_OPTION_CLASS = "person-option-control"
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]))

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

const EMOJI_MOOD_OPTIONS = [
	[EMOJI_MOOD_ALL, "All faces"],
	[EMOJI_MOOD_HAPPY, "Happy faces"],
	[EMOJI_MOOD_SAD, "Sad faces"]
]

const MIDI_DEVICE_AUTO = "auto"
const MIDI_DEVICE_ALL = "all"
const MIDI_PORT_AUTO = "auto"
const MIDI_PORT_ALL = "all"

const MIDI_PORT_OPTIONS = [
	[MIDI_PORT_AUTO, "Auto"],
	[MIDI_PORT_ALL, "All channels"],
	...Array.from({length:16}, (_, index) => {
		const port = index + 1
		return [port, `Channel ${port}`]
	})
]

const createMIDIDeviceOptions = () => [
	[MIDI_DEVICE_AUTO, "Auto"],
	[MIDI_DEVICE_ALL, "All MIDI devices"],
	...WebMidi.outputs.map((output, index) => [
		output.id,
		output.name || output.manufacturer || `MIDI device ${index + 1}`
	])
]

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

const createRangeControl = (
	label,
	name,
	currentValue,
	id,
	disabled=false,
	min=MIN_HEAD_NOTE_RANGE_DEGREES,
	max=MAX_HEAD_NOTE_RANGE_DEGREES,
	description=""
) => `
	<div class="person-option person-option-range person-option-wide">
		<label class="person-option-label" for="${id}">${label}</label>
		<div class="person-option-range-row">
			<input class="${PERSON_OPTION_CLASS}" data-person-option="${name}" id="${id}" type="range" min="${min}" max="${max}" step="1" value="${currentValue}" aria-describedby="${id}-output${description ? ` ${id}-description` : ""}"${disabled ? " disabled" : ""} />
			<output id="${id}-output" for="${id}">${name.startsWith("lip") ? formatLipSetting(name.replace("Override", ""), currentValue) : `${currentValue}°`}</output>
		</div>
		${description ? `<small id="${id}-description">${description}</small>` : ""}
	</div>`

// Players follow the global curve or pick their own preset.
const MOUTH_DYNAMICS_OVERRIDE_OPTIONS = [[LIP_SENSITIVITY_INHERIT, "Use global curve"], ...MOUTH_DYNAMICS_PRESETS.map(({id, label}) => [id, label])]
const getMouthDynamicsOverrideValue = options => {
	const override = normaliseMouthDynamicsOverride(options.mouthDynamicsOverride)
	return override === LIP_SENSITIVITY_INHERIT ? override : getMouthDynamicsPresetId(override)
}

const createSummaryContent = (label) => `<span class="instrument-summary-title">${label}</span>`

const createPersonOptionsHTML = (person) => {
	if (!person)
	{
		return ""
	}

	const options = person.options ?? {}
	const playMode = person.activeInstrument?.performanceMode ??
		(person.activeInstrument?.arpeggiate ? "arpeggio" : "chord")
	const lowOctave = Number.isFinite(Number(options.octaveLow)) ? Number(options.octaveLow) : 2
	const highOctave = Number.isFinite(Number(options.octaveHigh)) ? Number(options.octaveHigh) : 6
	const midiDevice = options.midiDevice ?? MIDI_DEVICE_AUTO
	const midiPort = options.midiPort ?? MIDI_PORT_AUTO
	const headNoteRangeOverride = normaliseHeadNoteRangeOverride(options.headNoteRangeOverride)
	const hasHeadNoteRangeOverride = headNoteRangeOverride !== HEAD_NOTE_RANGE_INHERIT
	const headNoteRange = hasHeadNoteRangeOverride ? headNoteRangeOverride : person.headNoteRangeDegrees
	const headNoteRangeId = `${person.id}-head-note-range`
	const headVerticalRangeOverride = normaliseHeadVerticalRangeOverride(options.headVerticalRangeOverride)
	const hasHeadVerticalRangeOverride = headVerticalRangeOverride !== HEAD_VERTICAL_RANGE_INHERIT
	const headVerticalRange = hasHeadVerticalRangeOverride ? headVerticalRangeOverride : person.headVerticalRangeDegrees
	const headVerticalRangeId = `${person.id}-head-vertical-range`

	return `<details class="person-options">
		<summary>${createSummaryContent("Options")}</summary>
		<div class="person-options-grid">
			${person.activeInstrument?.instruments?.[0]?.host ?
				createSelectControl("Patch", "voicePatch", person.activeInstrument.instruments[0].patch, person.voicePatchOptions ?? [], "data-person-action", "person-option-wide") :
				createSelectControl("Instrument", "instrumentType", person.instrumentType, PERSON_INSTRUMENT_OPTIONS, "data-person-action", "person-option-wide")}
			${person.instrumentType === INSTRUMENT_TYPE_FM ? `${createSelectControl("Preset bank", "fmBank", person.activeInstrument?.instruments?.[0]?.isGeneralMIDIBank === false ? "dx7" : "gm", [["gm", "General MIDI (128)"], ...(person.fmImportedPresets ? [["dx7", "Imported DX7"]] : [])], "data-person-action", "person-option-wide")}
			<label class="person-option person-option-wide">
				<span class="person-option-label">Load DX7 voice or bank</span>
				<input class="${PERSON_OPTION_CLASS}" type="file" accept=".syx,.dx7" data-person-action="dx7File" />
			</label><p class="person-option-wide" data-dx7-status role="status" aria-live="polite"></p>` : ''}
			${person.activeInstrument?.instruments?.[0]?.host?.engine === 'fm' ? `<label class="person-option person-option-wide"><span class="person-option-label">Load DX7 patches</span><input class="${PERSON_OPTION_CLASS}" type="file" accept=".syx,.dx7" data-person-action="dx7File" /></label><p class="person-option-wide" data-dx7-status role="status" aria-live="polite"></p>` : ''}
			${createSelectControl("Note sequence", "noteSequence", person.noteSequence, SEQUENCE_OPTIONS, "data-person-action", "person-option-wide")}
			${createSelectControl("Play", "playMode", playMode, [["chord", "Chords"], ["arpeggio", "Arpeggio"], ["harp", "Harp"]], "data-person-action")}
			${createSelectControl("Points", "showPointsOverride", normalisePointsOverride(options.showPointsOverride), [[POINTS_OVERRIDE_INHERIT, "Use global setting"], [POINTS_OVERRIDE_ON, "On"], [POINTS_OVERRIDE_OFF, "Off"]], "data-person-option", "person-option-wide")}
			${createSelectControl("MIDI device", "midiDevice", midiDevice, createMIDIDeviceOptions(), "data-person-option", "person-option-wide")}
			${createSelectControl("MIDI channel", "midiPort", midiPort, MIDI_PORT_OPTIONS, "data-person-option")}
			${createSelectControl("Faces", "emojiMood", options.emojiMood ?? EMOJI_MOOD_ALL, EMOJI_MOOD_OPTIONS, "data-person-option")}
			${createSelectControl("Mouth dynamics", "mouthDynamicsOverride", getMouthDynamicsOverrideValue(options), MOUTH_DYNAMICS_OVERRIDE_OPTIONS, "data-person-option", "person-option-wide")}
			${createToggleControl("Override global lip opening range", "lipRangeOverrideEnabled", normaliseLipRangeOverride(options.lipRangeOverride) !== 'inherit')}
			${createRangeControl("Lip opening range", "lipRangeOverride", resolveLipSetting(options, 'lipRange'), `${person.id}-lip-range`, normaliseLipRangeOverride(options.lipRangeOverride) === 'inherit', 0, 100, "Short — less movement for full volume. Long — more room for quiet playing.")}
			${createSelectControl("Lower octave", "octaveLow", lowOctave, OCTAVE_OPTIONS, "data-person-option", "person-option-compact")}
			${createSelectControl("Upper octave", "octaveHigh", highOctave, OCTAVE_OPTIONS, "data-person-option", "person-option-compact")}
			${createToggleControl("Override global head range", "headNoteRangeOverrideEnabled", hasHeadNoteRangeOverride)}
			${createRangeControl("Head note range", "headNoteRangeOverride", headNoteRange, headNoteRangeId, !hasHeadNoteRangeOverride)}
			${createToggleControl("Override global vertical range", "headVerticalRangeOverrideEnabled", hasHeadVerticalRangeOverride)}
			${createRangeControl("Vertical range", "headVerticalRangeOverride", headVerticalRange, headVerticalRangeId, !hasHeadVerticalRangeOverride)}
			${createToggleControl("Mute", "muted", options.muted)}
			${createToggleControl("Auto-repeat", "autoRepeat", options.autoRepeat)}
			${createSelectControl("Repeats per bar", "repetitionRate", options.repetitionRate ?? "template", [["template", "Instrument default"], [0, "0 — One shot"], ...[1, 2, 4, 8, 12, 16, 24].map(rate => [rate, rate])], "data-person-option", "person-option-wide")}
			${createToggleControl("Chord labels", "showChordNames", options.showChordNames)}
			${createSelectControl("Eyebrows", "eyebrowStyle", getEyebrowStyle(options), EYEBROW_STYLES.map(({value, label}) => [value, label]), "data-person-option", "person-option-eyebrows")}
			${createToggleControl("Eyebrow MIDI expression", "pitchBend", options.pitchBend)}
			${createToggleControl("Show face outline", "drawOutline", options.drawOutline)}
			${createToggleControl("Show cartoon eyes", "drawEyes", options.drawEyes)}
			${createSelectControl("Lips", "lipStyle", getLipStyle(options), LIP_STYLE_OPTIONS, "data-person-option")}
			${createToggleControl("Draw nose", "drawNose", options.drawNose)}
			${createToggleControl("Use eye direction to stereo pan", "stereoPan", options.stereoPan)}
			${createSelectControl("Particles", "noteParticleGraphics", options.noteParticleGraphics ?? NOTE_PARTICLE_GRAPHICS_AMPLITUDE_MUSIC, NOTE_PARTICLE_GRAPHIC_OPTIONS, "data-person-option", "person-option-wide")}
		</div>
	</details>`
}

const createInstrumentFamilyTitle = (family, personName) => `<h4 class="instrument-families">${personName.length ? personName : family.replace("Instrument","")}</h4>`
const createInstrumentFamilySummary = (family) => `<summary>${createSummaryContent(family)}</summary>`
const createInstrumentInput = (personName, folder) => `<input class='${INSTRUMENT_CLASS}' id="${escapeHTML(personName)}-${escapeHTML(folder)}" name="instrument-selector-${escapeHTML(personName)}" type="radio" value="${escapeHTML(folder)}" />`

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
			<label for="${escapeHTML(personName)}-${escapeHTML(folder)}">
				${escapeHTML(instrumentName)}
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
const selectInstrumentFamily = (controls, selectedPreset) => {
	const inputs = [...controls.querySelectorAll(`input.${INSTRUMENT_CLASS}`)]
	const active = typeof selectedPreset === "number" ? inputs[selectedPreset] :
		inputs.find(input => input.value === selectedPreset || input.id === selectedPreset)
	inputs.forEach(input => { input.checked = input === active })
	controls.querySelectorAll('details[data-instrument-family]').forEach(details => {
		const selected = !!active && details.contains(active)
		details.open = selected
		details.classList.toggle('selected-instrument-family', selected)
	})
	return active
}

export const showPersonalControlPanel = (playerName, controls, instrumentName, activeClassName="expanded") => {
	const active = selectInstrumentFamily(controls, instrumentName)
	
	if (instrumentName !== undefined)
	{
		// find active input field and focus
		
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

	output += `<details data-instrument-family="${escapeHTML(family)}" class="instrument-family-${family.toLowerCase()}">
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
			
			if (family !== instrument.family)
			{
				family = instrument.family ?? 'Family'
				output += `</ul></details>`
				output += `<details data-instrument-family="${escapeHTML(family)}" id="${personName}-instrument-family-${family.toLowerCase()}">
							${createInstrumentFamilySummary(family, personName)}
							<ul>`
			}
			output += createInstumentForForm( instrument.location, instrument.name, personName )
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
	const voice = instrument.instruments?.[0]
	if (person && voice?.getPatches) {
		person.voicePatchOptions = (await voice.getPatches()).map(patch => [patch.id, patch.title + (patch.approximate ? ' (approx.)' : '')])
	}

	if (!presets )
	{
		return null
	} 

	console.info( "Presets available :", typeof presets[0], {presets})

	// FIXME: HACK!
	if (instrument.type === "sample" || [INSTRUMENT_TYPE_COMPOSITE, INSTRUMENT_TYPE_SOUNDFONT].includes(person?.instrumentType))
	{
		presets = GENERAL_MIDI_INSTRUMENT_LIST
	}

	const existing = controls.querySelector(`.person-controls`)
	const instrumentMenuPanel = existing ? existing : document.createElement("div")
	instrumentMenuPanel.classList.add("person-controls")
	instrumentMenuPanel.innerHTML = (person ? `<h4 class="instrument-families player-header"><input class="${PERSON_OPTION_CLASS} player-name-title" type="text" data-person-action="displayName" aria-label="Player ${person.playerNumber + 1} name" maxlength="60" autocomplete="off" spellcheck="false" placeholder="Player ${person.playerNumber + 1}" value="${escapeHTML(person.displayName || `Player ${person.playerNumber + 1}`)}" /><button class="player-report-button" type="button" data-person-report aria-label="Progress &amp; data" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" /></svg></button></h4>` : createInstrumentFamilyTitle(instrument.name, escapeHTML(personName))) +
		createPersonOptionsHTML(person) +
		createInstrumentFormHTML( presets, instrument.name, personName, false )
	// instrumentMenuPanel.className = `${instrument.name} person-controls`
	
	controls.appendChild(instrumentMenuPanel)
	const eyebrowSelect = instrumentMenuPanel.querySelector('[data-person-option="eyebrowStyle"]')
	if (eyebrowSelect) {
		eyebrowSelect.classList.add('eyebrow-select')
		populateSelect(eyebrowSelect, EYEBROW_STYLES.map(style => ({
			...style, icon:eyebrowStyleIcon(style.value), selected:style.value === getEyebrowStyle(person.options)
		})))
	}

	selectInstrumentFamily(controls, instrument.activePresetIndex)
	const reportButton = instrumentMenuPanel.querySelector('[data-person-report]')
	if (reportButton) reportButton.addEventListener('click', () => openPersonReportDialog(person, reportButton))
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
	const onRangeInput = debounce(onInstrumentInput, 150)

	controls.addEventListener('change', event => {
		if ((event.target.matches('input.'+INSTRUMENT_CLASS) || event.target.matches('.'+PERSON_OPTION_CLASS)) && event.target.type !== 'range')
		{
			onInstrumentInput(event)
		}
	}, {signal: controller.signal, passive })

	controls.addEventListener('input', event => {
		if (event.target.matches('[data-person-action="displayName"]'))
		{
			onInstrumentInput(event)
		}
		if (event.target.matches(`input.${PERSON_OPTION_CLASS}[type="range"]`))
		{
			const output = controls.querySelector(`#${event.target.id}-output`)
			if (output)
			{
				const option = event.target.dataset.personOption
				const label = option.startsWith('lip') ? formatLipSetting(option.replace('Override', ''), event.target.value) : `${event.target.value}°`
				output.value = label
				event.target.setAttribute('aria-valuetext', label)
			}
			onRangeInput(event)
		}
	}, {signal: controller.signal, passive })

	controls.addEventListener('keydown', event => {
		if (event.key === 'Enter' && event.target.matches('[data-person-action="displayName"]'))
		{
			event.preventDefault()
			onInstrumentInput(event)
			event.target.blur()
		}
	}, {signal: controller.signal })
	
	// console.error("addInteractivityToInstrumentPanel", {controls, inputs} )

	// toggle the accordion modes for the details
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
			selectInstrumentFamily(controls, person.activePresetIndex)
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
			showPersonalControlPanel( playerName, controls, person.activePresetIndex )
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
