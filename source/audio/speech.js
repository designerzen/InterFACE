// https://www.chromestatus.com/features/5687444770914304
const TIME_OUT = 10000

export const hasSpeech = () => ("speechSynthesis" in window)

const isSpeechSynthesSupported = hasSpeech()

// we have to loop this with a settimout until voices are available...
const getVoices = async () => new Promise( (resolve,reject) => {

  let voices 
  const startTime = Date.now()

  const waitForVoices = () => {

    voices = window.speechSynthesis.getVoices()

    if (voices.length > 0)
    {
      resolve( voices )

    }else{

      // check to see we aren't wasting too much time
      const elapsed = Date.now() - startTime

      if (elapsed < TIME_OUT)
      {
        // in some ways this is a fudge factor as the voices
        // aren't always known about on DOM available : LOOP
        setTimeout(waitForVoices,0)

      }else{
        reject("No voices found")
      }
    
    }
  }

  waitForVoices()
})

const getSpecificVoice = async (lang = "en-US", name ="Zira") =>{
  const voices = getVoices()
  const filtered = voices.filter( voice => {
    // first we check to see if the language is the same...
    return (voice.lang === lang && voice.name.indexOf(name) > -1 )
  })
  return filtered.length < 1 ? voices : filtered
}

////////////////////////////////////////////////////////////
// Speak this out loud
// rate     0.1 to 10
// pitch    0 to 2
////////////////////////////////////////////////////////////
export const say = async (text, interupt=true, volume=1, rate=1, pitch=1, lang, name ) =>{

  	return new Promise( (resolve,reject)=>{

		try{

			if (!isSpeechSynthesSupported)
			{
				reject("Speech tech not available")

			}else{

				// now pause whilst we attempt to list...
				const talk = async () => {

					const voices = (lang && name) ? await getSpecificVoice(lang, name) : await getVoices()
					const person = voices[0]
					const speech = new SpeechSynthesisUtterance()

					speech.lang = 'en-US'
					// set voice if specified
					// Note: some voices don't support altering params
					speech.voice = person
					speech.voiceURI = 'native'

					// watch for ending...
					speech.onend = (event) => {
						//console.log('Finished in ' + event.elapsedTime + ' seconds.')
						speech.onend = null
						resolve(event)
					}

					speech.onerror = (event) =>{
						reject()
					}

					// 0 to 1
					speech.volume = volume
					// 0.1 to 10
					speech.rate = rate
					//0 to 2
					speech.pitch = pitch
					speech.text = text
						// console.error("specific voices", {
						//   speech, lang,
						//   name,
						//   voices
						// });

					// kill any pending!
					if (interupt)
					{
						window.speechSynthesis.cancel()
					}
					window.speechSynthesis.speak(speech)
				}

				talk()
			}
		
		}catch (error){

			reject(error) 
		}
	})
}

/**
 * Force the voice to stop speaking
 */
export const stopSpeaking = ()=>{

  return window.speechSynthesis.cancel()
}

/**
 *  Is the voice currently speaking?
 * @returns true is voice is speaking or waiting to speak
 */
export const isVoiceActive = ()=>{

  return window.speechSynthesis.pending
}