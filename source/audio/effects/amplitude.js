import { clamp } from '../../maths/maths'

// smaller means slower
const rate = 0.1

let destinationVolume = 0

export const createAmplitude = async ( 
	audioContext,
	volume = 1,
	// smooth volume fading?
	fade = false
) => {
	
	const gainNode = audioContext.createGain()

	const fadeVolume = (destinationVolume) => {

		const currentVolume = gainNode.gain.value
		//gainNode.gain.value = lerp( gain.gain.value, destinationVolume, 0.1 )
		const newVolume = currentVolume + (destinationVolume - currentVolume) * rate
		gainNode.gain.value.setValueAtTime(destinationVolume, audioContext.currentTime)
		
		if (currentVolume === destinationVolume)
		{
	
		}else{
			requestAnimationFrame( fadeVolume )
		}
		return newVolume
	}
	
	// Set the actual volume
	const setVolume = vol => {
		if (fade)
		{
			fadeVolume()
		}else{
			gainNode.gain.value = clamp(volume, 0, 1)	
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