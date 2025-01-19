import { clamp } from '../../maths/maths'

// smaller means slower
const rate = 0.1

let destinationVolume = 0

export const createAmplitude = async ( 
	audioContext,
	volume = 1,
	// smooth volume fading?
	fade = false,
	fadeDuration = 100
) => {
	
	const gainNode = audioContext.createGain()

	const fadeVolume = (destinationVolume) => {
		gainNode.gain.linearRampToValueAtTime(destinationVolume, audioContext.currentTime + fadeDuration)
		return gainNode.gain.value
	}
	
	// Set the actual volume
	const setVolume = vol => {
		if (fade)
		{
			fadeVolume()
		}else{
			const clampedVolume = clamp(vol, 0, 1)	 
			// gainNode.gain.value = clampedVolume
			gainNode.gain.setValueAtTime(clampedVolume, audioContext.currentTime)
		}
	}

	setVolume(volume)

	return {
		name:"amplitude",
		node:gainNode,
		volume:value => {

			if (value)
			{
				setVolume(value)
				return value
			}

			// if we lerp
			return gainNode.gain.value
		}
	}
}