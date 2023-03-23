const GRAMMER = '#JSGF V1.0; grammar commands; public <command> = change instrument | volume up | volume down | mute | drums;'

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const speechRecognitionList = new SpeechGrammarList()

speechRecognitionList.addFromString(GRAMMER, 1)

let isBusy = false

// Make sure this is done THROUGH A USER EVENT!
// otherwise it will get rejected
export const initSpeechRecognition = ( language="en-US", callback=null ) => {
	const recognition = new SpeechRecognition()
	recognition.grammars = speechRecognitionList
	// once off or repeating?
	recognition.continuous = true
	recognition.lang = language
	recognition.interimResults = false
	recognition.maxAlternatives = 1

	recognition.onresult = (event) => {
		const data = event.results[0][0].transcript
		isBusy = true
		callback & callback({data, event})
	}

	recognition.onspeechend = (event) => {
		recognition.stop()
		isBusy = false
	}

	recognition.onerror = (event) => {
		// `Error occurred in recognition: ${event.error}`
	}

	// you also will want to call this on the callback end
	recognition.start()
	return recognition
}

export const connectWordToAction = ( word, action ) => {

	// say this word, do this thing
}