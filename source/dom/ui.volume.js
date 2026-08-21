import { setToggle } from './toggle.js'

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
		trimVolumeScale=4,
		onMuteChanged=null
	} = {}
) => {
	
	let muted = startMuted 
	let shiftPressed = false
	let controlPressed = false
	let altPressed = false

	const icon = document.querySelector('a.folder-link[href="#folder-volume"]').parentNode
	const muteButton = document.getElementById("button-mute")
	const output = document.getElementById("volumeoutput")
	const sliderVolume = document.getElementById("volume-input-range")
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
	

	let originalClassNames = icon.className

	const determineVolumeIcon = volume =>{
		if (volume > 0.5)
		{
			return "hi"
		}else if(volume > 0.3){
			return "low"
		}
		return "mute"
	}

	const setVolumeIcon = volume => {
		icon.className = originalClassNames + " " + determineVolumeIcon(volume)
	}

	const setVisualVolumeLevel = (volume, setSlider=true)=>{
		setVolumeIcon(volume)
		if (setSlider){
			sliderVolume.value = volume ?? currentVolume ?? 1
		}
	}
	
	const setMeter = volume => {
		const volumeString = Math.round( 100 * volume ) + "%"
		output.innerText = volumeString
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

	const updateMixerControl = (mode, volume) => {
		const control = mixerControls[mode]
		if (!control?.input || volume == null)
		{
			return
		}
		control.input.value = volume
		if (control.output)
		{
			const displayedVolume = mode === "trim" ? volume * trimVolumeScale : volume
			control.output.innerText = Math.round(100 * displayedVolume) + "%"
		}
	}

	const toggleMute = (mute) =>{
		mute = mute ?? !muted
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
		muted = mute
	}


	const getVolumeMode = event => {
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
		setVisualVolumeLevel(volume)
		setMeter(mode === "trim" ? volume * trimVolumeScale : volume)
	}

	const handleVolumeChange = e => {

		const volume = sliderVolume.value
		const mode = getVolumeMode(e)
		const volumeString = setMeter(mode === "trim" ? volume * trimVolumeScale : volume)
		setVisualVolumeLevel( volume, false )
		setModeVolume(mode, volume)
		updateMixerControl(mode, volume)
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
		const volume = event.currentTarget.value
		setModeVolume(mode, volume)
		updateMixerControl(mode, volume)
		if (mode === "master")
		{
			setVisualVolumeLevel(volume)
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
			control.input.oninput = handleMixerChange(mode)
			updateMixerControl(mode, getModeVolume(mode))
		}
	})

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
		}
	}
}
