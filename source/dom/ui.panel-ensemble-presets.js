import { loadEnsembleInstrumentPresets } from "../people/person.ensemble-presets.js"

const PANEL_SELECTOR = ".ensemble-preset-panel"
const TOGGLE_SELECTOR = ".ensemble-preset-toggle"
const CONTROLS_SELECTOR = ".ensemble-preset-controls"
const PRESET_INPUT_CLASS = "ensemble-preset-input"
const ACTIVE_CLASS = "expanded"
const DRAGGING_CLASS = "dragging"

const PRESET_ICONS = Object.freeze({
	"four-choirs":"🎶",
	"all-strings":"🎻",
	"synth-pop":"🎹",
	"brass-band":"🎺",
	"dream-pads":"☁️",
	"orchestra":"🎼",
	"rock-band":"🎸",
	"ambient":"🌫️",
	"samba":"🪘",
	"techno":"⚙️",
	"jungle":"🌴",
	"sound-fx":"🔊",
	"hip-hop":"🎤",
	"reggae":"🌞",
	"jazz-club":"🎷",
	"chiptune":"👾",
	"k-pop":"✨",
	"outer-space":"🚀",
	"spooky":"👻",
	"disco":"🪩",
	"cyberpunk":"🌃",
	"medieval":"🏰",
	"underwater":"🌊",
	"cartoon-chase":"💨"
})

const escapeAttribute = (value="") => String(value)
	.replaceAll("&", "&amp;")
	.replaceAll("\"", "&quot;")
	.replaceAll("<", "&lt;")
	.replaceAll(">", "&gt;")

const getPresetInstruments = (preset, quantityOfPeople=1) => {
	const voicing = preset.voicings?.[quantityOfPeople]
	if (voicing)
	{
		return voicing
	}
	const availableCounts = Object.keys(preset.voicings ?? {})
		.map(count => Number.parseInt(count, 10))
		.filter(Number.isFinite)
		.sort((a,b) => a - b)
	const nearestCount = availableCounts.find(count => count >= quantityOfPeople) ?? availableCounts.at(-1)
	return preset.voicings?.[nearestCount] ?? preset.instruments ?? []
}

const getPresetInstrument = (preset, index, quantityOfPeople) => {
	const instruments = getPresetInstruments(preset, quantityOfPeople)
	return instruments[index % instruments.length]
}

const createPresetLineup = (preset, quantityOfPeople) => getPresetInstruments(preset, quantityOfPeople)
	.map(instrument => instrument.replaceAll("_", " "))
	.join(" / ")

const createPresetHTML = (preset, index, quantityOfPeople) => `
	<li class="ensemble-preset">
		<label for="ensemble-preset-${preset.id}" title="${escapeAttribute(preset.description ?? preset.title)}">
			<span class="ensemble-preset-icon" aria-hidden="true">${PRESET_ICONS[preset.id] ?? "🎵"}</span>
			<strong>${preset.title}</strong>
			<small>${createPresetLineup(preset, quantityOfPeople)}</small>
			<input
				class="${PRESET_INPUT_CLASS}"
				id="ensemble-preset-${preset.id}"
				name="ensemble-preset"
				type="radio"
				value="${index}"
			/>
		</label>
	</li>`

const setPanelState = (panel, open) => {
	panel.classList.toggle(ACTIVE_CLASS, open)
	panel.setAttribute("style", open ? "--y:999;" : "--y:0;")
	panel.querySelector(TOGGLE_SELECTOR)?.setAttribute("aria-expanded", String(open))
	document.documentElement.classList.toggle("ensemble-preset-panel-showing", open)
}

const resolvePresetForPerson = async (person, requestedPreset) => {
	const activeInstrument = person.activeInstrument
	if (!activeInstrument)
	{
		return requestedPreset
	}

	const availablePresets = await activeInstrument.getPresets()
	if (!Array.isArray(availablePresets) || !availablePresets.length)
	{
		return requestedPreset
	}

	if (availablePresets.includes(requestedPreset))
	{
		return requestedPreset
	}

	const readablePreset = requestedPreset.replaceAll("_", " ")
	const readableIndex = availablePresets.findIndex(preset => {
		return String(preset).toLowerCase() === readablePreset.toLowerCase()
	})

	return readableIndex > -1 ? availablePresets[readableIndex] : requestedPreset
}

const applyEnsemblePreset = async (people, preset, onApplied) => {
	const playablePeople = people.filter(person => person?.activeInstrument)
	const results = playablePeople.map(async (person, index) => {
		const requestedPreset = getPresetInstrument(preset, index, playablePeople.length)
		const resolvedPreset = await resolvePresetForPerson(person, requestedPreset)
		return person.loadPreset(resolvedPreset)
	})

	await Promise.allSettled(results)
	onApplied?.(preset)
}

const populateEnsemblePresetPanel = (controls, presets, quantityOfPeople=1) => {
	controls.innerHTML = `
		<h4>Ensemble</h4>
		<legend>Band presets for ${quantityOfPeople} ${quantityOfPeople === 1 ? "person" : "people"}</legend>
		<ul>${presets.map((preset, index) => createPresetHTML(preset, index, quantityOfPeople)).join("")}</ul>
	`
}

const addVerticalDrawerInteractivity = (panel, controls) => {
	const toggle = panel.querySelector(TOGGLE_SELECTOR)
	let isOpen = panel.classList.contains(ACTIVE_CLASS)
	let bypass = false

	const getDragY = (event) => {
		const point = event.changedTouches?.[0] ?? event.touches?.[0] ?? event
		return Math.max(0, point.clientY)
	}

	const setOpen = (open) => {
		isOpen = open
		setPanelState(panel, isOpen)
	}

	const onDragMove = (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		if (bypass)
		{
			return
		}

		const y = getDragY(event)
		panel.setAttribute("style", `--y:${y};`)
		panel.classList.toggle(ACTIVE_CLASS, false)
		panel.classList.toggle(DRAGGING_CLASS, true)
	}

	const onDragEnd = (event) => {
		if (bypass)
		{
			return
		}

		if (event.preventDefault)
		{
			event.preventDefault()
		}

		document.removeEventListener("mousemove", onDragMove)
		document.removeEventListener("mouseup", onDragEnd)
		document.removeEventListener("touchmove", onDragMove)
		document.removeEventListener("touchend", onDragEnd)
		document.removeEventListener("touchcancel", onDragEnd)
		panel.classList.toggle(DRAGGING_CLASS, false)

		const y = getDragY(event)
		const panelHeight = controls.clientHeight || panel.clientHeight || 25
		setOpen(y >= panelHeight * 0.35)
	}

	panel.addEventListener("mousedown", event => {
		if (!event.target.closest(TOGGLE_SELECTOR) && !event.target.closest(PANEL_SELECTOR))
		{
			return
		}

		if (event.target.closest("label, input, summary"))
		{
			return
		}

		if (event.preventDefault)
		{
			event.preventDefault()
		}

		panel.classList.toggle(DRAGGING_CLASS, true)
		document.addEventListener("mousemove", onDragMove)
		document.addEventListener("mouseup", onDragEnd)
	})

	panel.addEventListener("touchstart", event => {
		if (!event.target.closest(TOGGLE_SELECTOR) && !event.target.closest(PANEL_SELECTOR))
		{
			return
		}

		if (event.target.closest("label, input, summary"))
		{
			return
		}

		if (event.preventDefault)
		{
			event.preventDefault()
		}

		panel.classList.toggle(DRAGGING_CLASS, true)
		document.addEventListener("touchmove", onDragMove, {passive:false})
		document.addEventListener("touchend", onDragEnd)
		document.addEventListener("touchcancel", onDragEnd)
	}, {passive:false})

	const onToggleComplete = event => {
		isOpen = panel.classList.contains(ACTIVE_CLASS)

		if (event.preventDefault)
		{
			event.preventDefault()
		}

		setOpen(!isOpen)
		document.removeEventListener("mouseleave", onToggleComplete)
		document.removeEventListener("mouseup", onToggleComplete)
		document.removeEventListener("touchend", onToggleComplete)
		document.removeEventListener("touchcancel", onToggleComplete)
		panel.classList.toggle(DRAGGING_CLASS, false)
		bypass = false
	}

	toggle.addEventListener("mousedown", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
			event.stopPropagation()
		}

		bypass = true
		document.addEventListener("mouseleave", onToggleComplete)
		document.addEventListener("mouseup", onToggleComplete)
	})

	toggle.addEventListener("touchstart", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
			event.stopPropagation()
		}

		bypass = true
		document.addEventListener("touchend", onToggleComplete)
		document.addEventListener("touchcancel", onToggleComplete)
	}, {passive:false})

	panel.addEventListener("dblclick", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}
		setOpen(!isOpen)
	})
}

export const setupEnsemblePresetPanel = async (people, optionsOrOnApplied) => {
	const options = typeof optionsOrOnApplied === "function" ?
		{ onApplied:optionsOrOnApplied } :
		(optionsOrOnApplied ?? {})
	const panel = document.querySelector(PANEL_SELECTOR)
	if (!panel)
	{
		return null
	}

	const controls = panel.querySelector(CONTROLS_SELECTOR)
	if (!controls)
	{
		throw Error("The ensemble preset panel is missing the required menu element")
	}

	const presets = await loadEnsembleInstrumentPresets(options.url)
	populateEnsemblePresetPanel(controls, presets, people.length)
	addVerticalDrawerInteractivity(panel, controls)

	controls.addEventListener("change", event => {
		if (!event.target.matches(`input.${PRESET_INPUT_CLASS}`))
		{
			return
		}

		const preset = presets[Number.parseInt(event.target.value, 10)]
		if (!preset)
		{
			return
		}

		options.onSelected?.(preset)
		options.applyOptions?.(preset)
		applyEnsemblePreset(people, preset, options.onApplied).catch(error => {
			console.error("Failed to apply ensemble preset", error)
		})
		setPanelState(panel, false)
	})

	panel.hidden = false
	setPanelState(panel, false)

	return {
		panel,
		presets,
		applyPresetById:(id) => {
			const preset = presets.find(item => item.id === id)
			if (!preset)
			{
				return Promise.resolve(null)
			}
			options.onSelected?.(preset)
			options.applyOptions?.(preset)
			return applyEnsemblePreset(people, preset, options.onApplied)
		}
	}
}
