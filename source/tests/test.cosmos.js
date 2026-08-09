import { loadAudio, playTrack } from '../audio/audio.js'
import { createDrumkit } from '../audio/drum-kit.js'
import OscillatorInstrument from '../audio/instruments/instrument.oscillator.js'
import { DEFAULT_CLOSED_HIHAT, DEFAULT_OPEN_HIHAT } from '../audio/synthesizers/hihat.js'
import { PRESET_SUB_BOOMER_KICK } from '../audio/synthesizers/kick.js'

const STORAGE = Object.freeze({
	volume: 'photosynth.cosmos.volume',
	pack: 'photosynth.cosmos.pack',
	midi: 'photosynth.cosmos.midi',
})

const SAMPLE_ROOT = './assets/audio/fx'
const PACKS = Object.freeze({
	family: {
		label: 'Family favourites',
		description: 'Eight playful, familiar sounds',
		sounds: [
			['Wow!', `${SAMPLE_ROOT}/meme/anime-wow-sound-effect.mp3`],
			['Applause', `${SAMPLE_ROOT}/meme/applause-4.mp3`],
			['Ba dum tss', `${SAMPLE_ROOT}/meme/ba-dum-tss_87uziQL.mp3`],
			['Air horn', `${SAMPLE_ROOT}/meme/dragon-studio-air-horn-sound-effect-372453.mp3`],
			['Dramatic thud', `${SAMPLE_ROOT}/meme/dragon-studio-thud-sound-effect-405470.mp3`],
			['Good!', `${SAMPLE_ROOT}/meme/freesound_community-good-6081.mp3`],
			['Sad trombone', `${SAMPLE_ROOT}/meme/freesound_community-wah-wah-sad-trombone-6347.mp3`],
			['Pop', `${SAMPLE_ROOT}/meme/pop_7e9Is8L.mp3`],
		],
	},
	magic: {
		label: 'Magic & wonder',
		description: 'Sparkles, spells and whooshes',
		sounds: [
			['Enchanted spell', `${SAMPLE_ROOT}/spells/enchanted-spell-casting-229208.mp3`],
			['Magic mallet', `${SAMPLE_ROOT}/spells/magic-mallet-6262.mp3`],
			['Magic sparkle', `${SAMPLE_ROOT}/spells/magic-sparkle-190030.mp3`],
			['Spell cast', `${SAMPLE_ROOT}/spells/magic-spell-cast-sound-effect-224173.mp3`],
			['Magical sound', `${SAMPLE_ROOT}/spells/magical-sound-effect-7137.mp3`],
			['Twinkle', `${SAMPLE_ROOT}/spells/magical-twinkle-242245.mp3`],
			['Particles', `${SAMPLE_ROOT}/spells/particles-143023.mp3`],
			['Fire whoosh', `${SAMPLE_ROOT}/spells/whoosh-fire-cast-243100.mp3`],
		],
	},
	percussion: {
		label: 'Percussion lab',
		description: 'The main PhotoSYNTH drum kit and percussion presets',
		engine: 'drumkit',
		sounds: [['Kick'], ['Snare'], ['Closed hi-hat'], ['Open hi-hat'], ['Clap'], ['Cowbell'], ['Clack'], ['Sub Boomer kick']],
	},
	synth: {
		label: 'PhotoSYNTH oscillator',
		description: 'The same oscillator instrument used by the main app',
		engine: 'oscillator',
		notes: [48, 50, 52, 55, 57, 60, 64, 67],
		sounds: [['C3'], ['D3'], ['E3'], ['G3'], ['A3'], ['C4'], ['E4'], ['G4']],
	},
})
const PACK_IDS = Object.freeze(Object.keys(PACKS))

const PERCUSSION_VOICES = Object.freeze([
	kit => kit.kick(),
	kit => kit.snare(),
	kit => kit.hat(DEFAULT_CLOSED_HIHAT),
	kit => kit.hat(DEFAULT_OPEN_HIHAT),
	kit => kit.clap(),
	kit => kit.cowbell(),
	kit => kit.clack(),
	kit => kit.kick(PRESET_SUB_BOOMER_KICK),
])

const pads = [...document.querySelectorAll('.cosmos-pad')]
const eventStatus = document.querySelector('#event-status')
const volume = document.querySelector('#cosmos-volume')
const volumeValue = document.querySelector('#volume-value')
const currentPack = document.querySelector('#current-pack')
const packDescription = document.querySelector('#pack-description')
const packInputs = [...document.querySelectorAll('input[name="cosmos-pack"]')]
const midiDialog = document.querySelector('#midi-settings')
const midiSummary = document.querySelector('#midi-summary')
const midiDialogStatus = document.querySelector('#midi-dialog-status')
const midiOutput = document.querySelector('#midi-output')
const midiChannel = document.querySelector('#midi-channel')
const midiRootNote = document.querySelector('#midi-root-note')
const midiVelocity = document.querySelector('#midi-velocity')
const midiVelocityValue = document.querySelector('#midi-velocity-value')
const enableMidiButton = document.querySelector('#enable-midi')
const nextPackButton = document.querySelector('#next-sound-pack')

let audioContext
let masterGain
let drumkit
let oscillatorVoices = []
let oscillatorVoicesReady
let selectedPack = PACKS.family
let midiAccess
let midiSettings = { outputId: '', channel: 1, rootNote: 60, velocity: 100 }
const audioBuffers = new Map()
const heldInputs = new Set()
const activeVoices = new Map()

const readStorage = (key, fallback) => {
	try {
		const value = localStorage.getItem(key)
		return value == null ? fallback : value
	} catch {
		return fallback
	}
}

const writeStorage = (key, value) => {
	try {
		localStorage.setItem(key, value)
	} catch {
		// Storage can be unavailable in privacy modes; controls still work for this session.
	}
}

const clampNumber = (value, min, max, fallback) => {
	const number = Number(value)
	return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback
}

const ensureAudio = () => {
	if (!audioContext) {
		const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
		if (!AudioContextClass) throw new Error('Web Audio is unavailable in this browser')
		audioContext = new AudioContextClass({ latencyHint: 'interactive' })
		masterGain = audioContext.createGain()
		masterGain.gain.value = Number(volume.value) / 100
		masterGain.connect(audioContext.destination)
		drumkit = createDrumkit(audioContext, masterGain)
	}
	return audioContext
}

const stopVoice = index => {
	const voice = activeVoices.get(index)
	if (!voice) return
	activeVoices.delete(index)
	voice.stop?.()
}

const playPercussion = index => {
	ensureAudio()
	return PERCUSSION_VOICES[index]?.(drumkit)
}

const ensureOscillatorVoices = async () => {
	ensureAudio()
	if (!oscillatorVoicesReady) {
		oscillatorVoices = Array.from({ length: 8 }, () => new OscillatorInstrument(audioContext))
		oscillatorVoicesReady = Promise.all(oscillatorVoices.map(voice => voice.loaded)).then(() => {
			oscillatorVoices.forEach(voice => voice.output.connect(masterGain))
			return oscillatorVoices
		})
	}
	return oscillatorVoicesReady
}

const playSynthTone = async (index, number, note) => {
	const voices = await ensureOscillatorVoices()
	if (!heldInputs.has(number)) return false
	return voices[index].noteOn(note, 1)
}

const releaseSynthTone = index => {
	if (!oscillatorVoicesReady) return
	oscillatorVoicesReady.then(voices => voices[index].noteOff(PACKS.synth.notes[index], 0))
}

const playSample = async (index, src) => {
	const context = ensureAudio()
	let buffer = audioBuffers.get(src)
	if (!buffer) {
		buffer = await loadAudio(context, src, {})
		audioBuffers.set(src, buffer)
	}
	const source = playTrack(context, buffer, 0, masterGain, { loop: false }, () => {
		if (activeVoices.get(index)?.source === source) activeVoices.delete(index)
	})
	activeVoices.set(index, { source, stop: () => source.stop() })
}

const getMidiOutput = () => midiAccess?.outputs.get(midiSettings.outputId)
const noteForIndex = index => clampNumber(midiSettings.rootNote + index, 0, 127, 60 + index)

const sendMidi = (index, on) => {
	const output = getMidiOutput()
	if (!output) return false
	const channel = clampNumber(midiSettings.channel, 1, 16, 1) - 1
	const note = noteForIndex(index)
	const velocity = on ? clampNumber(midiSettings.velocity, 1, 127, 100) : 0
	output.send([(on ? 0x90 : 0x80) + channel, note, velocity])
	return true
}

const trigger = async (number, source = 'COSMO') => {
	const index = number - 1
	if (heldInputs.has(number)) return
	heldInputs.add(number)
	pads[index]?.classList.add('is-active')
	pads[index]?.setAttribute('aria-pressed', 'true')
	stopVoice(index)
	const pack = selectedPack
	const [name, src] = pack.sounds[index]
	const midiSent = sendMidi(index, true)
	eventStatus.textContent = `${source} ${number} — ${name}${midiSent ? ` · MIDI note ${noteForIndex(index)} on` : ''}`
	try {
		await ensureAudio().resume()
		if (pack.engine === 'drumkit') playPercussion(index)
		else if (pack.engine === 'oscillator') await playSynthTone(index, number, pack.notes[index])
		else await playSample(index, src)
	} catch (error) {
		console.error(`Could not play COSMO ${number}`, error)
		eventStatus.textContent = `Sound ${number} could not be played: ${error.message}`
	}
}

const release = number => {
	if (!heldInputs.delete(number)) return
	const index = number - 1
	pads[index]?.classList.remove('is-active')
	pads[index]?.setAttribute('aria-pressed', 'false')
	if (selectedPack.engine === 'oscillator') releaseSynthTone(index)
	sendMidi(index, false)
}

const releaseAll = () => [...heldInputs].forEach(release)

const updatePack = packId => {
	releaseAll()
	selectedPack = PACKS[packId] ?? PACKS.family
	writeStorage(STORAGE.pack, packId in PACKS ? packId : 'family')
	currentPack.textContent = selectedPack.label
	packDescription.textContent = selectedPack.description
	selectedPack.sounds.forEach(([name], index) => {
		document.querySelector(`#cosmos-sound-${index + 1}`).textContent = name
	})
	eventStatus.textContent = `${selectedPack.label} selected — eight sounds ready.`
}

const selectNextPack = () => {
	const currentPackId = packInputs.find(input => input.checked)?.value ?? PACK_IDS[0]
	const nextPackId = PACK_IDS[(PACK_IDS.indexOf(currentPackId) + 1) % PACK_IDS.length]
	const nextInput = packInputs.find(input => input.value === nextPackId)
	if (nextInput) nextInput.checked = true
	updatePack(nextPackId)
	return nextPackId
}

const refreshMidiPorts = () => {
	const previous = midiOutput.value || midiSettings.outputId
	midiOutput.replaceChildren(new Option('No output selected', ''))
	for (const output of midiAccess?.outputs.values() ?? []) {
		midiOutput.add(new Option(`${output.manufacturer ? `${output.manufacturer} · ` : ''}${output.name}`, output.id))
	}
	midiOutput.disabled = !midiAccess
	if ([...midiOutput.options].some(option => option.value === previous)) midiOutput.value = previous
	else if (midiAccess?.outputs.size === 1) midiOutput.value = [...midiAccess.outputs.keys()][0]
	const output = midiAccess?.outputs.get(midiOutput.value)
	midiDialogStatus.textContent = output
		? `Ready to send to ${output.name}.`
		: midiAccess?.outputs.size
			? 'Choose the MIDI output that should receive COSMO notes.'
			: 'MIDI access is enabled, but no output device is connected.'
	midiSummary.dataset.state = output ? 'on' : 'off'
	midiSummary.querySelector('span:last-child').textContent = output ? `MIDI · ${output.name}` : 'MIDI off'
}

const enableMidi = async () => {
	if (!navigator.requestMIDIAccess) {
		midiDialogStatus.textContent = 'Web MIDI is unavailable in this browser. Try a current Chromium-based browser.'
		enableMidiButton.disabled = true
		return
	}
	enableMidiButton.disabled = true
	midiDialogStatus.textContent = 'Requesting permission to use MIDI devices…'
	try {
		midiAccess = await navigator.requestMIDIAccess({ sysex: false })
		midiAccess.addEventListener('statechange', refreshMidiPorts)
		enableMidiButton.textContent = 'Refresh MIDI devices'
		refreshMidiPorts()
	} catch (error) {
		midiDialogStatus.textContent = `MIDI access was not enabled: ${error.message}`
	} finally {
		enableMidiButton.disabled = false
	}
}

const loadMidiSettings = () => {
	try {
		midiSettings = { ...midiSettings, ...JSON.parse(readStorage(STORAGE.midi, '{}')) }
	} catch {
		// Ignore invalid settings and keep safe defaults.
	}
	midiChannel.value = String(clampNumber(midiSettings.channel, 1, 16, 1))
	midiRootNote.value = String(clampNumber(midiSettings.rootNote, 0, 120, 60))
	midiVelocity.value = String(clampNumber(midiSettings.velocity, 1, 127, 100))
	midiVelocityValue.value = midiVelocity.value
}

const saveMidiSettings = event => {
	event.preventDefault()
	midiSettings = {
		outputId: midiOutput.value,
		channel: clampNumber(midiChannel.value, 1, 16, 1),
		rootNote: clampNumber(midiRootNote.value, 0, 120, 60),
		velocity: clampNumber(midiVelocity.value, 1, 127, 100),
	}
	writeStorage(STORAGE.midi, JSON.stringify(midiSettings))
	refreshMidiPorts()
	midiDialog.close('saved')
	eventStatus.textContent = 'MIDI settings saved.'
}

const isEditableTarget = target => target instanceof Element && Boolean(target.closest('input, select, textarea, [contenteditable="true"]'))
const isInteractiveTarget = target => target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"]'))
const numberFromKey = event => {
	const match = /^(?:Digit|Numpad)([1-8])$/.exec(event.code ?? '')
	return match ? Number(match[1]) : /^[1-8]$/.test(event.key ?? '') ? Number(event.key) : null
}

let spaceHeld = false
window.addEventListener('keydown', event => {
	if (event.code === 'Space' && !midiDialog.open && !isInteractiveTarget(event.target)) {
		event.preventDefault()
		if (!event.repeat) spaceHeld = true
		return
	}
	if (isEditableTarget(event.target)) return
	const number = numberFromKey(event)
	if (!number) return
	event.preventDefault()
	if (!event.repeat) trigger(number, 'COSMO')
})
window.addEventListener('keyup', event => {
	if (event.code === 'Space' && spaceHeld) {
		event.preventDefault()
		spaceHeld = false
		selectNextPack()
		return
	}
	const number = numberFromKey(event)
	if (!number) return
	event.preventDefault()
	release(number)
})
const resetHeldInputs = () => {
	spaceHeld = false
	releaseAll()
}
window.addEventListener('blur', resetHeldInputs)
window.addEventListener('pagehide', resetHeldInputs)
nextPackButton.addEventListener('click', selectNextPack)

pads.forEach(pad => {
	const number = Number(pad.dataset.number)
	pad.setAttribute('aria-pressed', 'false')
	pad.addEventListener('pointerdown', event => {
		event.preventDefault()
		pad.setPointerCapture?.(event.pointerId)
		trigger(number, 'On-screen COSMO')
	})
	for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
		pad.addEventListener(eventName, () => release(number))
	}
	pad.addEventListener('click', event => {
		if (event.detail !== 0) return
		trigger(number, 'On-screen COSMO')
		window.setTimeout(() => release(number), 140)
	})
})

volume.value = String(clampNumber(readStorage(STORAGE.volume, '80'), 0, 100, 80))
const updateVolume = () => {
	volumeValue.value = `${volume.value}%`
	writeStorage(STORAGE.volume, volume.value)
	if (masterGain) masterGain.gain.setTargetAtTime(Number(volume.value) / 100, audioContext.currentTime, .015)
}
volume.addEventListener('input', updateVolume)
updateVolume()

const savedPack = readStorage(STORAGE.pack, 'family')
const selectedPackInput = packInputs.find(input => input.value === savedPack) ?? packInputs[0]
selectedPackInput.checked = true
packInputs.forEach(input => input.addEventListener('change', () => input.checked && updatePack(input.value)))
updatePack(selectedPackInput.value)

document.querySelector('#open-midi-settings').addEventListener('click', () => {
	loadMidiSettings()
	if (midiAccess) {
		midiOutput.value = [...midiOutput.options].some(option => option.value === midiSettings.outputId)
			? midiSettings.outputId
			: midiOutput.value
	}
	midiDialog.showModal()
})
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => midiDialog.close('cancel')))
midiDialog.addEventListener('click', event => {
	if (event.target === midiDialog) midiDialog.close('cancel')
})
enableMidiButton.addEventListener('click', enableMidi)
midiVelocity.addEventListener('input', () => { midiVelocityValue.value = midiVelocity.value })
document.querySelector('#default-midi-settings').addEventListener('submit', saveMidiSettings)

loadMidiSettings()
if (!navigator.requestMIDIAccess) {
	enableMidiButton.disabled = true
	enableMidiButton.textContent = 'Web MIDI unavailable'
	midiDialogStatus.textContent = 'This browser does not provide Web MIDI.'
}
