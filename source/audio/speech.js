// https://www.chromestatus.com/features/5687444770914304
const TIME_OUT = 10000

export const hasSpeech = () => ("speechSynthesis" in window)

const isSpeechSynthesSupported = hasSpeech()

// we have to loop this with a settimout until voices are available...
const getVoices = async () => new Promise( (resolve,reject) => {
  const existing = window.speechSynthesis.getVoices()
  if (existing.length > 0) {
    resolve(existing)
    return
  }
  let settled = false
  const finish = (voices) => {
    if (settled) return
    settled = true
    window.speechSynthesis.removeEventListener?.('voiceschanged', onVoicesChanged)
    clearTimeout(timeoutId)
    voices.length > 0 ? resolve(voices) : reject("No voices found")
  }
  const onVoicesChanged = () => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) finish(voices)
  }
  window.speechSynthesis.addEventListener?.('voiceschanged', onVoicesChanged)
  const timeoutId = setTimeout(() => finish(window.speechSynthesis.getVoices()), TIME_OUT)
})

const getSpecificVoice = async (lang = "en-US", name ="Zira") =>{
  const voices = await getVoices()
  const filtered = voices.filter( voice => {
    // first we check to see if the language is the same...
    return (voice.lang === lang && voice.name.indexOf(name) > -1 )
  })
  return filtered.length < 1 ? voices : filtered
}

const thingsBeingSaid = new Set()

let isSpeaking = false
let fixer = null
let speechGeneration = 0

////////////////////////////////////////////////////////////
// Speak this out loud
// rate     0.1 to 10
// pitch    0 to 2
////////////////////////////////////////////////////////////
export const say = async (text, interupt=true, volume=1, rate=1, pitch=1, lang=(globalThis.document?.documentElement?.lang || 'en-GB'), name=undefined ) =>{
	const generation = speechGeneration
	if (!isSpeechSynthesSupported) throw new Error("Speech tech not available")
	const voices = (lang && name) ? await getSpecificVoice(lang, name) : await getVoices()
	if (generation !== speechGeneration) return
  	return new Promise( (resolve,reject)=>{

		if (!isSpeechSynthesSupported)
		{
			reject("Speech tech not available")

		}else{

			// now pause whilst we attempt to list...
			const talk = () => {

				const person = voices[0]
				const speech = new SpeechSynthesisUtterance()

				speech.lang = lang
				// set voice if specified
				// Note: some voices don't support altering params
				speech.voice = person
				speech.voiceURI = 'native'

				// watch for ending...
				speech.onend = (event) => {
					//console.log('Finished in ' + event.elapsedTime + ' seconds.')
					speech.onend = null
					isSpeaking = false
					resolve(event)
				}

				speech.onerror = (event) =>{
					isSpeaking = false
					switch(event.error)
					{
						// these are ones to ignore
						case "interrupted":
						case "canceled":
							// console.info("interrupted!")
							resolve(event)
							break
						default:
							// console.error("SpeechSynthesis Error", {event},  window.speechSynthesis )
							reject("An error occurred while speaking")
					}
				}

				// 0 to 1
				speech.volume = volume
				// 0.1 to 10
				speech.rate = rate
				//0 to 2
				speech.pitch = pitch
				// Emojis are visual cues, so don't read their names aloud
				speech.text = String(text).replace(/<[^>]+>/g, ' ').replace(/(?:^|\s)[=:][DPdp()\/\\]+(?=\s|$)/g, ' ').replace(/\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\uFE0F\u200D\u20E3]/gu, '').replace(/\s{2,}/g, ' ').trim()

				// console.error("specific voices", {
				//   speech, lang,
				//   name,
				//   voices
				// });
	
				
				// kill any pending!
				if (isSpeaking && window.speechSynthesis.speaking && interupt)
				{
					window.speechSynthesis.cancel() 		
				}
			
				window.speechSynthesis.speak(speech)
				isSpeaking = true

			}

			talk()
		}
	
	})
}

/**
 * Force the voice to stop speaking
 */
export const stopSpeaking = ()=>{
  speechGeneration++
  isSpeaking = false
  if (hasSpeech()) return window.speechSynthesis.cancel()
}

/**
 *  Is the voice currently speaking?
 * @returns true is voice is speaking or waiting to speak
 */
export const isVoiceActive = ()=>{

  return window.speechSynthesis.pending
}
