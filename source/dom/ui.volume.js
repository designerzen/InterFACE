import { setToggle } from './toggle.js'

export const setupVolumeInterface = (
	currentVolume=1,
	startMuted=false,
	{
		onVolumeChanged=null,
		onPercussionVolumeChanged=null,
		onTrimVolumeChanged=null,
		currentPercussionVolume=null,
		currentTrimVolume=null,
		trimVolumeScale=4,
		onMuteChanged=null
	} = {}
) => {
	
	let muted = startMuted 
	let shiftPressed = false
	let controlPressed = false

	const icon = document.querySelector('a.folder-link[href="#folder-volume"]').parentNode
	const muteButton = document.getElementById("button-mute")
	const output = document.getElementById("volumeoutput")
	const sliderVolume = document.getElementById("volume-input-range")
	

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
		muted = mute
	}


	const getVolumeMode = event => {
		if (onTrimVolumeChanged && (controlPressed || event?.ctrlKey))
		{
			return "trim"
		}
		if (onPercussionVolumeChanged && (shiftPressed || event?.shiftKey))
		{
			return "percussion"
		}
		return "master"
	}

	const showVolumeMode = mode => {
		const volume = mode === "trim"
			? currentTrimVolume
			: mode === "percussion"
				? currentPercussionVolume
				: currentVolume
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
		if (mode === "master")
		{
			currentVolume = volume
		}else if (mode === "percussion"){
			currentPercussionVolume = volume
		}else{
			currentTrimVolume = volume
		}
		console.log(
			`slider changed ${mode} volume`,
			e,
			volume,
			volumeString
		)
		requestAnimationFrame(()=>{
			const callback = mode === "trim"
				? onTrimVolumeChanged
				: mode === "percussion"
					? onPercussionVolumeChanged
					: onVolumeChanged
			callback && callback(volume)
		})
	}

	const handleKeyDown = event => {
		if (event.key === "Shift")
		{
			shiftPressed = true
		}else if (event.key === "Control"){
			controlPressed = true
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
		}else if (event.key === "Shift"){
			shiftPressed = false
		}else if (event.key === "Control"){
			controlPressed = false
		}
		showVolumeMode(getVolumeMode(event))
	}

	window.addEventListener("keydown", handleKeyDown)
	window.addEventListener("keyup", handleKeyUp)
	window.addEventListener("blur", handleKeyUp)

	// The input event covers pointer and keyboard adjustments without firing a
	// second callback on release, as change would.
	sliderVolume.oninput = handleVolumeChange

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
		}
	}
}
