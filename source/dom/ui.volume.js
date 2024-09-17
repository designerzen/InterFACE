export const setupVolumeInterface = ( currentVolume=1, startMuted=false, callback=null ) => {
	
	let muted = startMuted 

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
			sliderVolume.setAttribute("disabled")
		}else{
			setVolumeIcon(currentVolume)
			sliderVolume.removeAttribute("disabled")
		}
		muteButton.classList.toggle("muted",mute)
		muted = mute
	}


	sliderVolume.onchange = sliderVolume.oninput = e => {

		const volume = sliderVolume.value
		const volumeString = setMeter(volume)
		setVisualVolumeLevel( volume, false )
		currentVolume = volume
		console.log("slider changed volume", e, volume, volumeString )
		requestAnimationFrame(()=>{
			callback && callback(volume)
		})
	}

	muteButton.addEventListener("click", event=>{
		toggleMute(!muted)
	})

	setVisualVolumeLevel(currentVolume ?? 1)
	setMeter(currentVolume ?? 1)
	
	return {
		setVolumeIcon,
		setVisualVolumeLevel,
		toggleMute
	}
}