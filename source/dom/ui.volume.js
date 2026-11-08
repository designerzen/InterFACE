import { setToggle } from './toggle.js'
import { faderToGain, gainToFader } from '../audio/volume-curve.js'

export const setupVolumeInterface = (
	currentVolume=1,
	startMuted=false,
	{
		onVolumeChanged=null,
		onPercussionVolumeChanged=null,
		onTrimVolumeChanged=null,
		onSampleVolumeChanged=null,
		currentPercussionVolume=null,
		currentTrimVolume=null,
		currentSampleVolume=null,
		trimVolumeScale=5,
		onMuteChanged=null
	} = {}
) => {
	
	let muted = startMuted 
	let shiftPressed = false
	let controlPressed = false
	let altPressed = false

	const icon = document.querySelector('a.folder-link[href="#folder-volume"]').parentNode
	const volumeLink = icon.querySelector('.folder-link')
	const volumePanel = document.getElementById('folder-volume')
	const volumeReturn = volumePanel?.querySelector(':scope > .folder-return')
	const controlsPanel = document.getElementById('control-panel')
	// Focus alone cannot hold a drawer open when a touch or a press on its
	// fieldset moves focus away from the launcher. Latch it before that happens.
	const openVolumePanel = () => {
		if (!controlsPanel?.classList.contains('controls-list-open'))
		{
			icon.classList.add('open')
		}
	}
	const closeVolumePanel = () => {
		icon.classList.remove('open')
		if (controlsPanel?.classList.contains('controls-list-open')) return
		if (window.location.hash === '#folder-volume')
		{
			const url = new URL(window.location.href)
			url.hash = ''
			window.history.replaceState(window.history.state, '', url)
		}
		// Leaving focus inside the drawer would immediately reopen :focus-within.
		if (icon.contains(document.activeElement)) document.activeElement.blur()
		const focusTarget = document.getElementById('button-settings') ?? document.getElementById('button-controls-list')
		focusTarget?.focus({ preventScroll:true })
	}
	const handlePanelKeyDown = event => {
		if (event.key !== 'Escape' || controlsPanel?.classList.contains('controls-list-open')) return
		if (!icon.classList.contains('open') && window.location.hash !== '#folder-volume' && !icon.contains(document.activeElement)) return
		event.preventDefault()
		event.stopPropagation()
		closeVolumePanel()
	}
	volumeLink.addEventListener('pointerdown', openVolumePanel)
	volumeLink.addEventListener('click', openVolumePanel)
	volumePanel?.addEventListener('pointerdown', openVolumePanel, true)
	volumeReturn?.addEventListener('click', closeVolumePanel)
	window.addEventListener('keydown', handlePanelKeyDown)
	const muteButton = document.getElementById("button-mute")
	const output = document.getElementById("mixer-master-output")
	const sliderVolume = document.getElementById("mixer-master-volume")
	const mixerModeButton = document.getElementById("button-volume-mixer-mode")
	const advancedModeToggle = document.getElementById("button-toggle-advanced")
	const mixerControls = {
		master: {
			input: document.getElementById("mixer-master-volume"),
			output: document.getElementById("mixer-master-output")
		},
		percussion: {
			input: document.getElementById("mixer-percussion-volume"),
			output: document.getElementById("mixer-percussion-output")
		},
		sample: {
			input: document.getElementById("mixer-sample-volume"),
			output: document.getElementById("mixer-sample-output")
		},
		trim: {
			input: document.getElementById("mixer-trim-volume"),
			output: document.getElementById("mixer-trim-output")
		}
	}
	const rangeInputs = Array.from(new Set([
		sliderVolume,
		...Object.values(mixerControls).map(control => control.input)
	].filter(Boolean)))
	const stepButtons = Array.from(document.querySelectorAll(".volume-step-button[data-volume-target][data-volume-direction]"))
	

	const updateMixerModeButton = () => {
		if (!mixerModeButton)
		{
			return
		}
		const expanded = !document.documentElement.classList.contains("beginner")
		mixerModeButton.setAttribute("aria-expanded", String(expanded))
		mixerModeButton.setAttribute("aria-label", expanded ? "Collapse to simple volume" : "Expand to full mixer")
	}

	const handleMixerModeClick = () => {
		advancedModeToggle?.click()
		updateMixerModeButton()
	}

	const handleAdvancedModeClick = () => {
		requestAnimationFrame(updateMixerModeButton)
	}

	const determineVolumeIcon = volume =>{
		if (volume > 0.5)
		{
			return "hi"
		}else if(volume > 0){
			return "low"
		}
		return "mute"
	}

	const setVolumeIcon = (volume = currentVolume) => {
		// The icon shares its container with the drawer's open and list-view state.
		const activeIcon = determineVolumeIcon(muted ? 0 : volume)
		for (const name of ["hi", "low", "mute"])
		{
			icon.classList.toggle(name, name === activeIcon)
		}
	}

	const setVisualVolumeLevel = (volume, setSlider=true)=>{
		currentVolume = volume ?? currentVolume ?? 1
		setVolumeIcon()
		if (setSlider){
			sliderVolume.value = gainToFader(currentVolume)
		}
	}
	
	const setMeter = volume => {
		const volumeString = Math.round( 100 * volume ) + "%"
		output.innerText = volumeString
		sliderVolume.setAttribute('aria-valuetext', volumeString)
		return volumeString
	}

	const getModeVolume = mode => mode === "trim"
		? currentTrimVolume
		: mode === "sample"
			? currentSampleVolume
			: mode === "percussion"
				? currentPercussionVolume
				: currentVolume

	const getModeCallback = mode => mode === "trim"
		? onTrimVolumeChanged
		: mode === "sample"
			? onSampleVolumeChanged
			: mode === "percussion"
				? onPercussionVolumeChanged
				: onVolumeChanged

	const setModeVolume = (mode, volume) => {
		if (mode === "master")
		{
			currentVolume = volume
		}else if (mode === "percussion"){
			currentPercussionVolume = volume
		}else if (mode === "sample"){
			currentSampleVolume = volume
		}else{
			currentTrimVolume = volume
		}
	}

	const updateMixerControl = (mode, volume, setSlider=true) => {
		const control = mixerControls[mode]
		if (!control?.input || volume == null)
		{
			return
		}
		if (setSlider) control.input.value = gainToFader(volume)
		if (control.output)
		{
			const displayedVolume = mode === "trim" ? volume * trimVolumeScale : volume
			control.output.innerText = Math.round(100 * displayedVolume) + "%"
			control.input.setAttribute('aria-valuetext', control.output.innerText)
		}
	}

	const updateStepButtons = input => {
		const value = input.valueAsNumber
		const minimum = Number(input.min)
		const maximum = Number(input.max)
		stepButtons.forEach(button => {
			if (button.dataset.volumeTarget !== input.id)
			{
				return
			}
			const isDecrease = button.dataset.volumeDirection === "decrease"
			button.disabled = muted || input.disabled || (isDecrease ? value <= minimum : value >= maximum)
		})
	}

	const handleStepClick = event => {
		const button = event.currentTarget
		const input = document.getElementById(button.dataset.volumeTarget)
		if (!input || input.disabled)
		{
			return
		}
		if (button.dataset.volumeDirection === "decrease")
		{
			input.stepDown()
		}else{
			input.stepUp()
		}
		input.dispatchEvent(new Event("input", { bubbles:true }))
	}

	const toggleMute = (mute) =>{
		mute = mute ?? !muted
		muted = mute
		if (mute)
		{
			setVolumeIcon(0)
			sliderVolume.disabled = true
		}else{
			setVolumeIcon(currentVolume)
			sliderVolume.disabled = false
		}
		Object.values(mixerControls).forEach(control => {
			if (control.input)
			{
				control.input.disabled = mute
			}
		})
		rangeInputs.forEach(updateStepButtons)
	}


	const getVolumeMode = event => {
		if (!document.documentElement.classList.contains("beginner"))
		{
			return "master"
		}
		if (onTrimVolumeChanged && (controlPressed || event?.ctrlKey))
		{
			return "trim"
		}
		if (onSampleVolumeChanged && (altPressed || event?.altKey))
		{
			return "sample"
		}
		if (onPercussionVolumeChanged && (shiftPressed || event?.shiftKey))
		{
			return "percussion"
		}
		return "master"
	}

	const showVolumeMode = mode => {
		const volume = getModeVolume(mode)
		if (volume == null)
		{
			return
		}
		// Modifier keys preview other channels in the shared fader only.
		sliderVolume.value = gainToFader(volume)
		setVolumeIcon()
		setMeter(mode === "trim" ? volume * trimVolumeScale : volume)
	}

	const handleVolumeChange = e => {

		const volume = faderToGain(sliderVolume.value)
		const mode = getVolumeMode(e)
		const volumeString = setMeter(mode === "trim" ? volume * trimVolumeScale : volume)
		setModeVolume(mode, volume)
		setVolumeIcon()
		// Preserve the native fader value: converting gain back to a fader can
		// land just below a step boundary and make the next + press repeat it.
		updateMixerControl(mode, volume, mode !== 'master')
		updateStepButtons(sliderVolume)
		console.log(
			`slider changed ${mode} volume`,
			e,
			volume,
			volumeString
		)
		requestAnimationFrame(()=>{
			const callback = getModeCallback(mode)
			callback && callback(volume)
		})
	}

	const handleMixerChange = mode => event => {
		const volume = faderToGain(event.currentTarget.value)
		setModeVolume(mode, volume)
		updateMixerControl(mode, volume, false)
		updateStepButtons(event.currentTarget)
		if (mode === "master")
		{
			setVisualVolumeLevel(volume, false)
			setMeter(volume)
		}
		requestAnimationFrame(() => {
			const callback = getModeCallback(mode)
			callback && callback(volume)
		})
	}

	const handleKeyDown = event => {
		if (event.key === "Shift")
		{
			shiftPressed = true
		}else if (event.key === "Control"){
			controlPressed = true
		}else if (event.key === "Alt"){
			altPressed = true
		}
		if (document.activeElement === sliderVolume)
		{
			showVolumeMode(getVolumeMode(event))
		}
	}

	const handleKeyUp = event => {
		if (event.type === "blur")
		{
			shiftPressed = false
			controlPressed = false
			altPressed = false
		}else if (event.key === "Shift"){
			shiftPressed = false
		}else if (event.key === "Control"){
			controlPressed = false
		}else if (event.key === "Alt"){
			altPressed = false
		}
		showVolumeMode(getVolumeMode(event))
	}

	window.addEventListener("keydown", handleKeyDown)
	window.addEventListener("keyup", handleKeyUp)
	window.addEventListener("blur", handleKeyUp)

	// The input event covers pointer and keyboard adjustments without firing a
	// second callback on release, as change would.
	sliderVolume.oninput = handleVolumeChange
	Object.entries(mixerControls).forEach(([mode, control]) => {
		if (control.input)
		{
			control.input.oninput = mode === "master"
				? handleVolumeChange
				: handleMixerChange(mode)
			updateMixerControl(mode, getModeVolume(mode))
		}
	})
	stepButtons.forEach(button => button.addEventListener("click", handleStepClick))
	mixerModeButton?.addEventListener("click", handleMixerModeClick)
	advancedModeToggle?.addEventListener("click", handleAdvancedModeClick)
	updateMixerModeButton()

	setToggle( "button-mute", status => {
		toggleMute(status)
		onMuteChanged && onMuteChanged(status)
	}, startMuted )

	setVisualVolumeLevel(currentVolume ?? 1)
	setMeter(currentVolume ?? 1)
	toggleMute(startMuted)
	
	return {
		setVolumeIcon,
		setVisualVolumeLevel,
		toggleMute,
		destroy: () => {
			volumeLink.removeEventListener('pointerdown', openVolumePanel)
			volumeLink.removeEventListener('click', openVolumePanel)
			volumePanel?.removeEventListener('pointerdown', openVolumePanel, true)
			volumeReturn?.removeEventListener('click', closeVolumePanel)
			window.removeEventListener('keydown', handlePanelKeyDown)
			window.removeEventListener("keydown", handleKeyDown)
			window.removeEventListener("keyup", handleKeyUp)
			window.removeEventListener("blur", handleKeyUp)
			sliderVolume.oninput = null
			Object.values(mixerControls).forEach(control => {
				if (control.input)
				{
					control.input.oninput = null
				}
			})
			stepButtons.forEach(button => button.removeEventListener("click", handleStepClick))
			mixerModeButton?.removeEventListener("click", handleMixerModeClick)
			advancedModeToggle?.removeEventListener("click", handleAdvancedModeClick)
		}
	}
}
