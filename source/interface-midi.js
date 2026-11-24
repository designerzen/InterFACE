import { getMIDIInputs, getMIDIOutputs } from "./audio/midi/midi-ports.js"
import { forgetMIDIInputNotes, isMIDIDebugEnabled, isRecentMIDIOutputEcho, logMIDIDebug, recordMIDIInputNote, sendGuardedMIDIOutput } from "./audio/midi/midi-echo-guard.js"
import { getMusicalDetailsFromEmoji } from "./models/emoji-to-music.js"
import { EVENT_EMOTION_CHANGED } from "./people/person-event.js"
import { getMIDIPortDisplayName, isDigitCMPSRPort } from "./hardware/digit/cmpsr.js"
import { getMIDIDeviceIntegration, getMIDIDeviceIntegrationPeople, INTEGRATION_HARMONISE, INTEGRATION_MONITOR, INTEGRATION_ROOT, isSameMIDIDevice, onMIDIDeviceIntegrationChanged } from "./audio/midi/midi-device-integration.js"

const midiInputCleanupCallbacks = new Set()
const midiInputObservers = new Map()

const MIDI_CLOCK_STATUS_TTL = 500
const MIDI_INPUT_STATUS_TTL = 1400
const MIDI_DEBUG_SUMMARY_INTERVAL = 1000
const MIDI_DEBUG_LOOP_WINDOW = 250
const MIDI_DEBUG_LOOP_LIMIT = 24

const getMIDIDebugState = () => {
	const debugState = globalThis.__photosynthMIDIDebug ?? {
		inputs: new Map(),
		outputs: new Map(),
		loops: new Map(),
		totals: {
			input: 0,
			output: 0,
			suppressed: 0,
			loopWarnings: 0
		},
		lastSummaryAt: 0,
		startedAt: performance.now()
	}
	globalThis.__photosynthMIDIDebug = debugState
	return debugState
}

const getMIDIEventType = event => event?.message?.type || event?.type || 'unknown'
const getMIDIEventNoteNumber = event => event?.note?.number ?? event?.message?.dataBytes?.[0] ?? 'none'
const getMIDIEventRawData = event => Array.from(event?.message?.data ?? event?.data ?? []).join(',')
const getMIDIEventKey = (input, event, phase) => [
	phase,
	input?.id ?? input?.name ?? 'unknown-input',
	getMIDIEventType(event),
	getMIDIEventNoteNumber(event),
	getMIDIEventRawData(event)
].join('|')

const recordMIDISummary = () => {
	if (!isMIDIDebugEnabled())
	{
		return
	}

	const debugState = getMIDIDebugState()
	const now = performance.now()
	if (now - debugState.lastSummaryAt < MIDI_DEBUG_SUMMARY_INTERVAL)
	{
		return
	}

	debugState.lastSummaryAt = now
	console.info("MIDI:Debug summary", {
		totals: debugState.totals,
		inputs: Array.from(debugState.inputs.values()),
		outputs: Array.from(debugState.outputs.values()),
		loopKeys: debugState.loops.size,
		uptimeMs: Math.round(now - debugState.startedAt)
	})
}

const recordMIDIInputDebug = (input, event, phase, extra = {}) => {
	const debugState = getMIDIDebugState()
	const portId = input?.id ?? input?.name ?? 'unknown-input'
	const eventType = getMIDIEventType(event)
	const noteNumber = getMIDIEventNoteNumber(event)
	const inputStats = debugState.inputs.get(portId) ?? {
		id: portId,
		name: input?.name,
		manufacturer: input?.manufacturer,
		count: 0,
		types: {},
		lastType: null,
		lastNote: null,
		lastAt: 0
	}

	inputStats.count++
	inputStats.types[eventType] = (inputStats.types[eventType] ?? 0) + 1
	inputStats.lastType = eventType
	inputStats.lastNote = noteNumber
	inputStats.lastAt = performance.now()
	debugState.inputs.set(portId, inputStats)
	debugState.totals.input++

	const key = getMIDIEventKey(input, event, phase)
	const loopStats = debugState.loops.get(key) ?? {
		key,
		phase,
		eventType,
		noteNumber,
		count: 0,
		windowStartedAt: performance.now(),
		warned: false,
		suppressed: 0
	}

	const now = performance.now()
	if (now - loopStats.windowStartedAt > MIDI_DEBUG_LOOP_WINDOW)
	{
		loopStats.count = 0
		loopStats.windowStartedAt = now
		loopStats.warned = false
	}

	loopStats.count++
	debugState.loops.set(key, loopStats)
	recordMIDISummary()

	const isLooping = loopStats.count >= MIDI_DEBUG_LOOP_LIMIT
	if (isLooping)
	{
		loopStats.suppressed++
		debugState.totals.suppressed++
		if (!loopStats.warned)
		{
			loopStats.warned = true
			debugState.totals.loopWarnings++
			logMIDIDebug("MIDI:Potential feedback loop detected", {
				input: {
					id: portId,
					name: input?.name,
					manufacturer: input?.manufacturer
				},
				phase,
				eventType,
				noteNumber,
				rawData: getMIDIEventRawData(event),
				loopStats,
				extra
			})
		}
	}

	return { isLooping, loopStats, inputStats }
}

const recordMIDIOutputDebug = (output, type, noteNumber, source) => {
	const debugState = getMIDIDebugState()
	const portId = output?.id ?? output?.name ?? 'unknown-output'
	const outputStats = debugState.outputs.get(portId) ?? {
		id: portId,
		name: output?.name,
		manufacturer: output?.manufacturer,
		count: 0,
		types: {},
		lastType: null,
		lastNote: null,
		lastSource: null,
		lastAt: 0
	}

	outputStats.count++
	outputStats.types[type] = (outputStats.types[type] ?? 0) + 1
	outputStats.lastType = type
	outputStats.lastNote = noteNumber
	outputStats.lastSource = source
	outputStats.lastAt = performance.now()
	debugState.outputs.set(portId, outputStats)
	debugState.totals.output++
	recordMIDISummary()
}

const getMIDIInputStatusId = (input, index = 0) => `midi-input-${input.id ?? input.name ?? index}`

const getMIDINoteLabel = event => {
	const note = event?.note
	if (!note)
	{
		return 'Note'
	}

	const noteName = note.identifier || note.name
	return noteName ? `${noteName} (${note.number})` : `Note ${note.number}`
}

const setMIDIInputStatus = (statusAPI, input, id, detail, active = false, ttl = MIDI_INPUT_STATUS_TTL) => {
	const isCMPSR = isDigitCMPSRPort(input)
	statusAPI?.setDeviceStatus?.(id, {
		type: 'midi',
		label: getMIDIPortDisplayName(input),
		detail: isCMPSR && detail === 'Ready' ? 'Available · MIDI input ready' : detail,
		connected: true,
		active,
		ttl
	})
}

const sendMIDIEventToAllDevices = (type, noteNumber, source = 'input-relay') => {
	let sent = 0
	const outputs = getMIDIOutputs()
	switch(type){
		case "noteon":
			outputs.forEach(output => {
				recordMIDIOutputDebug(output, type, noteNumber, source)
				if (sendGuardedMIDIOutput(output, 'playNote', noteNumber, undefined, source))
				{
					sent++
				}
			})
			break
		case "noteoff":
			outputs.forEach(output => {
				recordMIDIOutputDebug(output, type, noteNumber, source)
				if (sendGuardedMIDIOutput(output, 'stopNote', noteNumber, undefined, source))
				{
					sent++
				}
			})
			break
		case "clock":
			outputs.forEach(output => {
				recordMIDIOutputDebug(output, type, noteNumber, source)
				if (sendGuardedMIDIOutput(output, 'sendClock', 'clock', undefined, source))
				{
					sent++
				}
			})
			break
	}
	return sent
}

const getChordKey = chordDetails => chordDetails.map(chord => chord.noteNumber).join(',')

const getPlayingEntryKey = (person, noteNumber) => `${person.playerNumber}|${noteNumber}`

// Augmented notes reach the onboard instruments only, never MIDI outputs
const startInstrumentNotes = (instrument, chordDetails, velocity) => {
	if (typeof instrument?.chordOn === 'function')
	{
		instrument.chordOn(chordDetails, velocity)
		return
	}
	chordDetails.forEach(chord => instrument?.noteOn?.(chord.noteNumber, velocity))
}

const stopInstrumentNotes = (instrument, chordDetails, velocity) => {
	if (typeof instrument?.chordOff === 'function')
	{
		instrument.chordOff(chordDetails, velocity)
		return
	}
	chordDetails.forEach(chord => instrument?.noteOff?.(chord.noteNumber, velocity))
}

// Changing how a device plays releases its held and pending notes
onMIDIDeviceIntegrationChanged(port => {
	midiInputObservers.forEach(observer => {
		if (isSameMIDIDevice(observer.input, port))
		{
			observer.stopAllNotes()
		}
	})
})

const releaseMIDIInputObserver = (statusId, statusAPI = null) => {
	const observer = midiInputObservers.get(statusId)
	if (!observer)
	{
		return false
	}
	observer.input.removeListener("midimessage", observer.onMIDIMessage)
	observer.input.removeListener("noteon", observer.onNoteOn)
	observer.input.removeListener("noteoff", observer.onNoteOff)
	observer.stopAllNotes()
	forgetMIDIInputNotes(observer.input)
	midiInputCleanupCallbacks.delete(observer.stopNotesForPerson)
	midiInputObservers.delete(statusId)
	statusAPI?.clearDeviceStatus?.(statusId)
	return true
}


export const stopMIDIInputForPerson = (person) => {
	let stopped = false
	midiInputCleanupCallbacks.forEach(callback => {
		stopped = callback(person) || stopped
	})
	return stopped
}

export const observeMIDIInputs = ({
	stateMachine,
	personManager,
	globalChordPlayer,
	clock,
	startBackgroundPercussion,
	stopBackgroundPercussion,
	toggleBackgroundPercussion,
	scheduleMIDIInput = callback => {
		callback()
		return () => false
	},
	statusAPI = null
}) => {
	if (!stateMachine.get("midiInput"))
	{
		return false
	}

	const allInputs = getMIDIInputs()
	const allOutputs = getMIDIOutputs()

	logMIDIDebug("MIDI:Observing inputs", {
		inputs: allInputs.map(input => ({
			id: input.id,
			name: input.name,
			manufacturer: input.manufacturer,
			connection: input.connection,
			state: input.state
		})),
		outputs: allOutputs.map(output => ({
			id: output.id,
			name: output.name,
			manufacturer: output.manufacturer,
			connection: output.connection,
			state: output.state
		}))
	})

	// Forget unplugged inputs so this can run again whenever devices change
	const currentInputs = new Set(allInputs.filter(input => input.state !== 'disconnected'))
	midiInputObservers.forEach((observer, statusId) => {
		if (!currentInputs.has(observer.input))
		{
			releaseMIDIInputObserver(statusId, statusAPI)
		}
	})

	currentInputs.forEach(input => {
		const inputIndex = allInputs.indexOf(input)
		logMIDIDebug("MIDI:Observing input device", {
			id: input.id,
			name: input.name,
			manufacturer: input.manufacturer,
			connection: input.connection,
			state: input.state,
			inputIndex
		})

		const statusId = getMIDIInputStatusId(input, inputIndex)
		const existingObserver = midiInputObservers.get(statusId)
		if (existingObserver?.input === input)
		{
			logMIDIDebug("MIDI:Input already observed", { statusId, inputIndex, name: input.name }, 'info')
			setMIDIInputStatus(statusAPI, input, statusId, 'Ready')
			return
		}
		if (existingObserver)
		{
			logMIDIDebug("MIDI:Replacing stale input observer", { statusId, inputIndex, name: input.name })
			releaseMIDIInputObserver(statusId)
		}

		const playingMIDINotes = new Map()
		const activeOutputNotes = new Map()
		let lastClockStatusAt = 0

		setMIDIInputStatus(statusAPI, input, statusId, 'Ready')

		const retainOutputNote = (noteNumber) => {
			activeOutputNotes.set(noteNumber, (activeOutputNotes.get(noteNumber) ?? 0) + 1)
		}

		const releaseOutputNote = (noteNumber) => {
			const count = activeOutputNotes.get(noteNumber) ?? 0
			if (count <= 1)
			{
				activeOutputNotes.delete(noteNumber)
			}else{
				activeOutputNotes.set(noteNumber, count - 1)
			}
		}

		const sendChordNotesOn = chordDetails => {
			if (!stateMachine.get("midiSympathiser"))
			{
				return
			}

			for (const chord of chordDetails)
			{
				let sent = 0
				getMIDIOutputs().forEach(output => {
					recordMIDIOutputDebug(output, "noteon", chord.noteNumber, 'midi-sympathiser')
					if (sendGuardedMIDIOutput(output, 'playNote', chord.noteNumber, undefined, 'midi-sympathiser'))
					{
						sent++
					}
				})
				if (sent > 0)
				{
					retainOutputNote(chord.noteNumber)
				}
			}
		}

		const sendChordNotesOff = chordDetails => {
			if (!stateMachine.get("midiSympathiser"))
			{
				return
			}

			for (const chord of chordDetails)
			{
				releaseOutputNote(chord.noteNumber)
				getMIDIOutputs().forEach(output => {
					recordMIDIOutputDebug(output, "noteoff", chord.noteNumber, 'midi-sympathiser')
					sendGuardedMIDIOutput(output, 'stopNote', chord.noteNumber, undefined, 'midi-sympathiser')
				})
			}
		}

		// The onboard voice for an entry: the person's own instrument, or the
		// shared chord player when MIDI drives the onboard engine
		const getEntryInstrument = person => person.activeInstrument ?? (stateMachine.get("midiOnboard") ? globalChordPlayer : null)

		const refreshPlayingEntryChord = playingEntry => {
			const nextChordDetails = getMusicalDetailsFromEmoji(playingEntry.noteNumber, playingEntry.person.emoticon, false)
			const nextChordKey = getChordKey(nextChordDetails)
			if (nextChordKey === playingEntry.chordKey)
			{
				return false
			}

			if (playingEntry.started)
			{
				sendChordNotesOff(playingEntry.chordDetails)
				stopInstrumentNotes(playingEntry.instrument, playingEntry.chordDetails, playingEntry.velocity)
			}

			playingEntry.chordDetails = nextChordDetails
			playingEntry.chordKey = nextChordKey

			if (playingEntry.started)
			{
				sendChordNotesOn(nextChordDetails)
				startInstrumentNotes(playingEntry.instrument, nextChordDetails, playingEntry.person.noteVelocity || playingEntry.velocity)
			}
			return true
		}

		const startPlayingEntry = playingEntry => {
			if (
				playingEntry.started
				|| playingMIDINotes.get(playingEntry.key) !== playingEntry
			)
			{
				return false
			}

			const { chordDetails, mode, noteNumber, person, velocity } = playingEntry
			playingEntry.started = true
			playingEntry.cancelPendingStart = null

			if (mode === INTEGRATION_ROOT || stateMachine.get("midiInputPersonRootNote"))
			{
				person.setMIDIRootNoteOverride(noteNumber, velocity)
			}

			if (stateMachine.get("midiRelay"))
			{
				if (sendMIDIEventToAllDevices("noteon", noteNumber, 'midi-relay') > 0)
				{
					retainOutputNote(noteNumber)
				}
			}

			if (mode === INTEGRATION_HARMONISE)
			{
				sendChordNotesOn(chordDetails)
			}

			if (mode !== INTEGRATION_ROOT)
			{
				playingEntry.instrument = getEntryInstrument(person)
				startInstrumentNotes(playingEntry.instrument, chordDetails, mode === INTEGRATION_HARMONISE ? person.noteVelocity || velocity : velocity)
			}

			return true
		}

		const playMIDINoteOn = (person, noteNumber, velocity = 1, inputPerformanceTimeMs, mode = INTEGRATION_HARMONISE) => {
			const chordDetails = mode === INTEGRATION_HARMONISE ?
				getMusicalDetailsFromEmoji(noteNumber, person.emoticon, false) :
				[{ noteNumber, velocity }]
			const abortController = new AbortController()
			const playingEntry = {
				abortController,
				cancelPendingStart: null,
				chordDetails,
				chordKey: getChordKey(chordDetails),
				instrument: null,
				key: getPlayingEntryKey(person, noteNumber),
				mode,
				noteNumber,
				person,
				started: false,
				velocity
			}

			if (mode === INTEGRATION_HARMONISE)
			{
				person.addEventListener?.(EVENT_EMOTION_CHANGED, () => refreshPlayingEntryChord(playingEntry), {
					signal: abortController.signal
				})
			}
			playingMIDINotes.set(playingEntry.key, playingEntry)

			playingEntry.cancelPendingStart = scheduleMIDIInput(
				() => startPlayingEntry(playingEntry),
				inputPerformanceTimeMs
			)
			return playingEntry
		}

		const playMIDINoteOffEntry = (playingEntry) => {
			if (!playingEntry)
			{
				return false
			}

			const { chordDetails, mode, person, noteNumber, velocity } = playingEntry
			playingEntry.cancelPendingStart?.()
			playingEntry.cancelPendingStart = null
			playingEntry.abortController?.abort()

			if (playingEntry.started)
			{
				if (mode === INTEGRATION_HARMONISE)
				{
					sendChordNotesOff(chordDetails)
				}

				if (stateMachine.get("midiRelay"))
				{
					releaseOutputNote(noteNumber)
					sendMIDIEventToAllDevices("noteoff", noteNumber, 'midi-relay')
				}

				if (mode === INTEGRATION_ROOT || stateMachine.get("midiInputPersonRootNote"))
				{
					person.clearMIDIRootNoteOverride(noteNumber)
				}

				stopInstrumentNotes(playingEntry.instrument, chordDetails, velocity)
			}

			playingMIDINotes.delete(playingEntry.key)
			return true
		}

		// One device note can be playing for several people at once
		const playMIDINoteOff = (noteNumber) => {
			let stopped = false
			Array.from(playingMIDINotes.values()).forEach(playingEntry => {
				if (playingEntry.noteNumber === noteNumber)
				{
					stopped = playMIDINoteOffEntry(playingEntry) || stopped
				}
			})
			return stopped
		}

		const stopNotesForPerson = (person) => {
			if (!person)
			{
				return false
			}

			let stopped = false
			Array.from(playingMIDINotes.values()).forEach(playingEntry => {
				if (playingEntry.person?.playerNumber === person.playerNumber)
				{
					stopped = playMIDINoteOffEntry(playingEntry) || stopped
				}
			})
			return stopped
		}

		midiInputCleanupCallbacks.add(stopNotesForPerson)

		const onMIDIMessage = event => {
			const recentOutputEcho = isRecentMIDIOutputEcho(event, getMIDIEventType(event), input)
			const debug = recordMIDIInputDebug(input, event, 'midimessage', { recentOutputEcho })
			if (debug.isLooping)
			{
				return
			}
			if (recentOutputEcho)
			{
				logMIDIDebug("MIDI:midimessage ignored because it matches recent outbound MIDI", {
					input: input.name,
					type: getMIDIEventType(event),
					recentOutputEcho
				})
				return
			}
			// Transport and clock only follow devices people have chosen to play with
			if (getMIDIDeviceIntegration(input).mode === INTEGRATION_MONITOR)
			{
				return
			}
			switch(event.message.type){
				case "start":
					setMIDIInputStatus(statusAPI, input, statusId, 'Start', true)
					startBackgroundPercussion()
					break
				case "stop":
					setMIDIInputStatus(statusAPI, input, statusId, 'Stop', true)
					stopBackgroundPercussion()
					break
				case "continue":
					setMIDIInputStatus(statusAPI, input, statusId, 'Continue', true)
					toggleBackgroundPercussion()
					break
				case "clock":
					if (clock.networkTimingActive) break
					if (performance.now() - lastClockStatusAt > MIDI_CLOCK_STATUS_TTL)
					{
						lastClockStatusAt = performance.now()
						setMIDIInputStatus(statusAPI, input, statusId, 'Clock', true, MIDI_CLOCK_STATUS_TTL)
					}
					clock.bypass(true)
					clock.externalTrigger()
					break
			}
		}

		const onNoteOn = event => {
			const noteNumber = event.note.number
			const integration = getMIDIDeviceIntegration(input)
			const people = integration.mode === INTEGRATION_MONITOR ? [] : getMIDIDeviceIntegrationPeople(integration, personManager)
			const recentOutputEcho = isRecentMIDIOutputEcho(event, 'noteon', input)
			const debug = recordMIDIInputDebug(input, event, 'noteon', {
				recentOutputEcho,
				hasActiveOutputNote: activeOutputNotes.has(noteNumber),
				mode: integration.mode,
				personNumbers: people.map(person => person.playerNumber)
			})
			if (debug.isLooping)
			{
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} loop suppressed`, true)
				return
			}

			// A note we just sent to this device coming back through it
			if (recentOutputEcho)
			{
				logMIDIDebug("MIDI:noteon ignored because this device was just sent it", {
					input: input.name,
					noteNumber,
					recentOutputEcho
				})
				return
			}

			// Whatever happens next, never send this note back to the device that played it
			recordMIDIInputNote(input, noteNumber, true)

			if (integration.mode === INTEGRATION_MONITOR)
			{
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} · monitor only`, true)
				return
			}

			if (!people.length)
			{
				logMIDIDebug("MIDI:noteon ignored, no person to augment", {
					input: input.name,
					noteNumber
				})
				return
			}

			people.forEach(person => {
				// A repeated note-on retriggers the note
				playMIDINoteOffEntry(playingMIDINotes.get(getPlayingEntryKey(person, noteNumber)))
				playMIDINoteOn(
					person,
					noteNumber,
					event.value ?? event.velocity ?? 1,
					event.timestamp,
					integration.mode
				)
			})

			setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} on`, true)
		}

		const onNoteOff = event => {
			const noteNumber = event.note.number
			const isPlaying = Array.from(playingMIDINotes.values()).some(playingEntry => playingEntry.noteNumber === noteNumber)
			const recentOutputEcho = isRecentMIDIOutputEcho(event, 'noteoff', input)
			const debug = recordMIDIInputDebug(input, event, 'noteoff', {
				recentOutputEcho,
				hasPlayingInputNote: isPlaying
			})
			if (debug.isLooping)
			{
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} off loop suppressed`, true)
				return
			}
			if (recentOutputEcho)
			{
				logMIDIDebug(isPlaying ? "MIDI:noteoff echo ignored while input note is held" : "MIDI:noteoff ignored because it matches recent outbound MIDI", {
					input: input.name,
					noteNumber,
					recentOutputEcho
				}, isPlaying ? 'info' : undefined)
				return
			}

			recordMIDIInputNote(input, noteNumber, false)
			setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} off`, true)
			playMIDINoteOff(noteNumber)
		}

		const stopAllNotes = () => {
			Array.from(playingMIDINotes.values()).forEach(playMIDINoteOffEntry)
		}

		input.addListener("midimessage", onMIDIMessage)
		input.addListener("noteon", onNoteOn)
		input.addListener("noteoff", onNoteOff)

		midiInputObservers.set(statusId, {
			input,
			onMIDIMessage,
			onNoteOn,
			onNoteOff,
			stopAllNotes,
			stopNotesForPerson
		})

		logMIDIDebug("MIDI:Available input device", {
			manufacturer: input.manufacturer,
			name: input.name
		}, 'info')
	})

	return allInputs.length > 0
}
