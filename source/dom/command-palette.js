const CONTROL_ACTIONS = [
	["Beats", "button-percussion", ["percussion", "drums", "backing track"]],
	["Quantise", "button-quantise", ["timing", "rhythm"]],
	["Metronome", "button-metronome", ["click", "tempo"]],
	["MTV mode", "button-disco", ["disco", "visuals", "psychedelic"]],
	["V.U. display", "button-spectrogram", ["spectrogram", "visualiser"]],
	["Mute", "button-mute", ["sound", "volume", "audio"]],
	["Fullscreen", "button-fullscreen", ["screen", "display"]],
]

const normalise = value => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

const matchesQuery = (command, query) => {
	const words = normalise(query).split(" ").filter(Boolean)
	const searchable = normalise([command.label, command.description, ...(command.keywords || [])].join(" "))
	return words.every(word => searchable.includes(word))
}

const setControlState = (document, id, checked) => {
	const control = document.getElementById(id)
	if (!control || control.disabled || control.checked === checked) return false
	control.click()
	return true
}

const focusControl = (document, id, hash, openSettings = false) => {
	if (openSettings) setControlState(document, "button-settings", true)
	if (hash && document.defaultView) document.defaultView.location.hash = hash
	const control = document.getElementById(id)
	if (!control) return false
	const focus = () => {
		control.scrollIntoView?.({ block: "center", behavior: "smooth" })
		control.focus({ preventScroll: true })
	}
	document.defaultView?.requestAnimationFrame ? document.defaultView.requestAnimationFrame(focus) : focus()
	return true
}

const createCommands = document => {
	const commands = [
		{ group: "Go to", label: "Open Help", description: "Show instructions and troubleshooting", keywords: ["support"], run: () => document.getElementById("help")?.showModal() },
		{ group: "Go to", label: "Open Settings", description: "Show global settings and options", keywords: ["preferences", "controls"], run: () => focusControl(document, "select-camera", "settings", true) },
		{ group: "Go to", label: "Open Beats and Drumkit", description: "Choose percussion and its sound", keywords: ["percussion", "drums", "backing track"], run: () => {
			setControlState(document, "button-settings", false)
			setControlState(document, "button-percussion", true)
			return focusControl(document, "select-percussion-preset", "percussion-settings")
		} },
		{ group: "Go to", label: "Open Volume controls", description: "Adjust volume or mute audio", keywords: ["sound", "audio"], run: () => focusControl(document, "volume-input-range", "folder-volume") },
		{ group: "Go to", label: "Open Tempo controls", description: "Adjust BPM, swing, or tap tempo", keywords: ["timing", "rhythm"], run: () => focusControl(document, "tempo-input-text", "folder-tempo") },
		{ group: "Go to", label: "Open Recording controls", description: "Record audio or video", keywords: ["save", "capture"], run: () => focusControl(document, "button-record-audio", "folder-record") },
		{ group: "Go to", label: "Open MIDI controls", description: "Connect or configure MIDI", keywords: ["device", "instrument"], run: () => focusControl(document, "toggle-midi", "folder-midi") },
		{ group: "Go to", label: "Open Player instruments", description: "Choose instruments for each player", keywords: ["people", "sounds"], run: () => focusControl(document, "face-buttons", "control-panel") },
	]

	for (const [label, id, keywords] of CONTROL_ACTIONS) {
		for (const [verb, checked] of [["Turn on", true], ["Turn off", false]]) {
			commands.push({
				group: "Actions",
				label: `${verb} ${label}`,
				description: `${checked ? "Enable" : "Disable"} ${label.toLocaleLowerCase()}`,
				keywords,
				isDisabled: () => {
					const control = document.getElementById(id)
					return !control || control.disabled || control.checked === checked
				},
				run: () => setControlState(document, id, checked),
			})
		}
	}

	return commands
}

export const setupCommandPalette = (document = globalThis.document) => {
	const dialog = document?.getElementById("command-palette")
	const launcher = document?.getElementById("button-command-palette")
	const input = document?.getElementById("command-palette-search")
	const results = document?.getElementById("command-palette-results")
	const empty = dialog?.querySelector(".command-palette-empty")
	if (!dialog || !launcher || !input || !results || dialog.dataset.ready) return null

	dialog.dataset.ready = "true"
	const shortcutLabel = launcher.querySelector("kbd")
	if (shortcutLabel && /mac|iphone|ipad/i.test(globalThis.navigator?.platform || "")) shortcutLabel.textContent = "⌘ K"
	const commands = createCommands(document)
	let visibleCommands = []
	let activeIndex = 0

	const selectActive = index => {
		if (!visibleCommands.length) {
			input.removeAttribute("aria-activedescendant")
			return
		}
		activeIndex = (index + visibleCommands.length) % visibleCommands.length
		results.querySelectorAll('[role="option"]').forEach((option, optionIndex) => {
			const selected = optionIndex === activeIndex
			option.setAttribute("aria-selected", String(selected))
			if (selected) {
				input.setAttribute("aria-activedescendant", option.id)
				option.scrollIntoView?.({ block: "nearest" })
			}
		})
	}

	const runCommand = command => {
		if (!command || command.isDisabled?.()) return
		dialog.close()
		command.run()
	}

	const render = () => {
		visibleCommands = commands.filter(command => matchesQuery(command, input.value))
		results.replaceChildren()
		let currentGroup = ""
		visibleCommands.forEach((command, index) => {
			if (command.group !== currentGroup) {
				currentGroup = command.group
				const heading = document.createElement("div")
				heading.className = "command-palette-group"
				heading.textContent = currentGroup
				heading.setAttribute("role", "presentation")
				results.append(heading)
			}
			const option = document.createElement("button")
			option.type = "button"
			option.id = `command-palette-option-${index}`
			option.className = "command-palette-option"
			option.setAttribute("role", "option")
			option.setAttribute("aria-selected", "false")
			const disabled = command.isDisabled?.() || false
			option.setAttribute("aria-disabled", String(disabled))
			const label = document.createElement("span")
			label.textContent = command.label
			const description = document.createElement("small")
			description.textContent = command.description
			option.append(label, description)
			option.addEventListener("pointermove", () => selectActive(index))
			option.addEventListener("click", () => runCommand(command))
			results.append(option)
		})
		empty.hidden = visibleCommands.length > 0
		selectActive(0)
	}

	const open = () => {
		if (dialog.open) return
		input.value = ""
		render()
		dialog.showModal()
		input.focus()
	}

	launcher.addEventListener("click", open)
	document.addEventListener("keydown", event => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
			event.preventDefault()
			dialog.open ? dialog.close() : open()
		}
	})
	input.addEventListener("input", render)
	input.addEventListener("keydown", event => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault()
			selectActive(activeIndex + (event.key === "ArrowDown" ? 1 : -1))
		} else if (event.key === "Enter") {
			event.preventDefault()
			runCommand(visibleCommands[activeIndex])
		}
	})
	dialog.addEventListener("close", () => {
		input.value = ""
		launcher.focus()
	})

	return { open, render, commands }
}
