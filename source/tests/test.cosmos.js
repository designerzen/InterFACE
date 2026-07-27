import { loadAudio, playTrack } from '../audio/audio.js'
import WebMIDIConnection, { testForWebMIDI } from '../audio/midi/midi-connection-webmidi.js'
import { createCosmosKeyboardHandler } from '../interface-cosmos.js'

const MIDI_ROOT_NOTE = 60

const midiButton = document.querySelector('#enable-midi')
const midiStatus = document.querySelector('#midi-status')
const bankStatus = document.querySelector('#bank-status')
const eventStatus = document.querySelector('#event-status')
const pads = [...document.querySelectorAll('.cosmos-pad')]

let audioContext
let masterMixdown
let midiConnection
const activeMidiNotes = new Set()

const ensureAudio = () => {
	if (!audioContext) {
		const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
		if (!AudioContextClass) throw new Error('Web Audio is unavailable in this browser')
		audioContext = new AudioContextClass()
		masterMixdown = audioContext.createGain()
		masterMixdown.connect(audioContext.destination)
	}
	return audioContext
}

const noteForSwitch = index => MIDI_ROOT_NOTE + index

const noteOn = index => {
	const note = noteForSwitch(index)
	pads[index]?.classList.add('is-active')
	if (midiConnection?.midiChannel) {
		midiConnection.noteOn(note, 1)
		activeMidiNotes.add(note)
	}
	eventStatus.textContent = `Switch ${index} down — sample triggered, MIDI note ${note} on${midiConnection?.midiChannel ? '' : ' (no output connected)'}.`
}

const noteOff = index => {
	const note = noteForSwitch(index)
	pads[index]?.classList.remove('is-active')
	if (activeMidiNotes.delete(note)) midiConnection?.noteOff(note, 0)
	eventStatus.textContent = `Switch ${index} up — MIDI note ${note} off.`
}

const application = {
	getAudioContext: ensureAudio,
	getMasterMixdown: () => {
		ensureAudio()
		return masterMixdown
	},
	resumeAudio: () => ensureAudio().resume(),
	loadAudioSample: loadAudio,
	playAudioSample: playTrack,
	setFeedback: message => {
		eventStatus.textContent = message
	},
	setInputStatus: (_id, status) => {
		const bank = status.detail?.split(':')[0]
		if (bank) bankStatus.textContent = bank
	},
}

const handleCosmosKeyboard = createCosmosKeyboardHandler(application, {
	onSwitchDown: noteOn,
	onSwitchUp: noteOff,
})

const routeKeyboardEvent = event => {
	if (handleCosmosKeyboard(event)) event.preventDefault()
}

const releaseHeldSwitches = () => handleCosmosKeyboard({ type: 'blur' })

const connectMIDI = async () => {
	midiButton.disabled = true
	midiStatus.textContent = 'Requesting MIDI access…'
	try {
		midiConnection ??= new WebMIDIConnection(false)
		const result = await midiConnection.connect({ port: 0 })
		const output = result.outputs[0]
		if (!output) {
			midiStatus.textContent = 'MIDI access is enabled, but no output is connected.'
			midiButton.textContent = 'Retry MIDI output'
			midiButton.disabled = false
			return
		}
		midiStatus.textContent = `Sending on ${output.manufacturer ? `${output.manufacturer} ` : ''}${output.name}.`
		midiButton.textContent = 'MIDI output enabled'
	} catch (error) {
		console.error('Could not enable MIDI output', error)
		midiStatus.textContent = `MIDI could not be enabled: ${error.message}`
		midiButton.disabled = false
	}
}

window.addEventListener('keydown', routeKeyboardEvent)
window.addEventListener('keyup', routeKeyboardEvent)
window.addEventListener('blur', releaseHeldSwitches)
window.addEventListener('pagehide', releaseHeldSwitches)

if (testForWebMIDI()) {
	midiButton.addEventListener('click', connectMIDI)
} else {
	midiButton.disabled = true
	midiButton.textContent = 'Web MIDI unavailable'
	midiStatus.textContent = 'This browser does not provide Web MIDI.'
}
