import { WebMidi } from "webmidi"
import { getActiveMIDINotesForPerson, isMIDINoteActive } from "./audio/instrumentMediators/mediator.person-webmidi.js"
import { isMIDIDebugEnabled, isRecentMIDIOutputEcho, logMIDIDebug, sendGuardedMIDIOutput } from "./audio/midi/midi-echo-guard.js"
import { getMusicalDetailsFromEmoji } from "./models/emoji-to-music.js"
import { EVENT_EMOTION_CHANGED } from "./people/person-event.js"

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
	statusAPI?.setDeviceStatus?.(id, {
		type: 'midi',
		label: input.name || input.manufacturer || 'MIDI Input',
		detail,
		connected: true,
		active,
		ttl
	})
}

const sendMIDIEventToAllDevices = (type, noteNumber, source = 'input-relay') => {
	let sent = 0
	switch(type){
		case "noteon":
			WebMidi.outputs.forEach(output => {
				recordMIDIOutputDebug(output, type, noteNumber, source)
				if (sendGuardedMIDIOutput(output, 'playNote', noteNumber, undefined, source))
				{
					sent++
				}
			})
			break
		case "noteoff":
			WebMidi.outputs.forEach(output => {
				recordMIDIOutputDebug(output, type, noteNumber, source)
				if (sendGuardedMIDIOutput(output, 'stopNote', noteNumber, undefined, source))
				{
					sent++
				}
			})
			break
		case "clock":
			WebMidi.outputs.forEach(output => {
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

const isNoteAlreadyActiveForPerson = (person, noteNumber) => {
	if (!person)
	{
		return false
	}
	const activeNotes = getActiveMIDINotesForPerson(person.playerNumber)
	return Boolean(activeNotes?.get(noteNumber))
}

const getActivePerson = (personManager) => {
	return personManager.getSelectedPerson() || personManager.getActivePerson()
}

const getChordKey = chordDetails => chordDetails.map(chord => chord.noteNumber).join(',')

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
	statusAPI = null
}) => {
	if (!stateMachine.get("midiInput"))
	{
		return false
	}

	logMIDIDebug("MIDI:Observing inputs", {
		inputs: WebMidi.inputs.map(input => ({
			id: input.id,
			name: input.name,
			manufacturer: input.manufacturer,
			connection: input.connection,
			state: input.state
		})),
		outputs: WebMidi.outputs.map(output => ({
			id: output.id,
			name: output.name,
			manufacturer: output.manufacturer,
			connection: output.connection,
			state: output.state
		}))
	})

	WebMidi.inputs.forEach((input, inputIndex) => {
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
			existingObserver.input.removeListener("midimessage", existingObserver.onMIDIMessage)
			existingObserver.input.removeListener("noteon", existingObserver.onNoteOn)
			existingObserver.input.removeListener("noteoff", existingObserver.onNoteOff)
			midiInputCleanupCallbacks.delete(existingObserver.stopNotesForPerson)
			midiInputObservers.delete(statusId)
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
				WebMidi.outputs.forEach(output => {
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
				WebMidi.outputs.forEach(output => {
					recordMIDIOutputDebug(output, "noteoff", chord.noteNumber, 'midi-sympathiser')
					sendGuardedMIDIOutput(output, 'stopNote', chord.noteNumber, undefined, 'midi-sympathiser')
				})
			}
		}

		const refreshPlayingEntryChord = playingEntry => {
			const nextChordDetails = getMusicalDetailsFromEmoji(playingEntry.noteNumber, playingEntry.person.emoticon, false)
			const nextChordKey = getChordKey(nextChordDetails)
			if (nextChordKey === playingEntry.chordKey)
			{
				return false
			}

			sendChordNotesOff(playingEntry.chordDetails)
			if (stateMachine.get("midiOnboard") && globalChordPlayer)
			{
				globalChordPlayer.chordOff(playingEntry.chordDetails, playingEntry.velocity)
			}

			playingEntry.chordDetails = nextChordDetails
			playingEntry.chordKey = nextChordKey

			sendChordNotesOn(nextChordDetails)
			if (stateMachine.get("midiOnboard") && globalChordPlayer)
			{
				globalChordPlayer.chordOn(nextChordDetails, playingEntry.person.noteVelocity || playingEntry.velocity)
			}
			return true
		}

		const playMIDINoteOn = (person, noteNumber, velocity = 1) => {
			const chordDetails = getMusicalDetailsFromEmoji(noteNumber, person.emoticon, false)
			const abortController = new AbortController()
			const playingEntry = {
				abortController,
				chordDetails,
				chordKey: getChordKey(chordDetails),
				noteNumber,
				person,
				velocity
			}

			person.addEventListener?.(EVENT_EMOTION_CHANGED, () => refreshPlayingEntryChord(playingEntry), {
				signal: abortController.signal
			})
			playingMIDINotes.set(noteNumber, playingEntry)

			if (stateMachine.get("midiInputPersonRootNote"))
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

			sendChordNotesOn(chordDetails)

			if (stateMachine.get("midiOnboard") && globalChordPlayer)
			{
				globalChordPlayer.chordOn(chordDetails, person.noteVelocity || velocity)
			}
		}

		const playMIDINoteOffEntry = (playingEntry) => {
			if (!playingEntry)
			{
				return false
			}

			const { chordDetails, person, noteNumber, velocity } = playingEntry
			playingEntry.abortController?.abort()
			sendChordNotesOff(chordDetails)

			if (stateMachine.get("midiRelay"))
			{
				releaseOutputNote(noteNumber)
				sendMIDIEventToAllDevices("noteoff", noteNumber, 'midi-relay')
			}

			playingMIDINotes.delete(noteNumber)

			if (stateMachine.get("midiInputPersonRootNote"))
			{
				person.clearMIDIRootNoteOverride(noteNumber)
			}

			if (stateMachine.get("midiOnboard") && globalChordPlayer)
			{
				globalChordPlayer.chordOff(chordDetails, velocity)
			}

			return true
		}

		const playMIDINoteOff = (noteNumber) => {
			return playMIDINoteOffEntry(playingMIDINotes.get(noteNumber))
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
			const person = getActivePerson(personManager)
			const isActiveOutputNote = isMIDINoteActive(noteNumber)
			const recentOutputEcho = isRecentMIDIOutputEcho(event, 'noteon', input)
			const debug = recordMIDIInputDebug(input, event, 'noteon', {
				isActiveOutputNote,
				recentOutputEcho,
				hasActiveOutputNote: activeOutputNotes.has(noteNumber),
				hasPlayingInputNote: playingMIDINotes.has(noteNumber),
				personNumber: person?.playerNumber
			})
			if (debug.isLooping)
			{
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} loop suppressed`, true)
				return
			}

			if (!person)
			{
				logMIDIDebug("MIDI:noteon ignored, no active person", {
					input: input.name,
					noteNumber
				})
				return
			}

			const isLoopedNote =
				playingMIDINotes.has(noteNumber) ||
				Boolean(recentOutputEcho) ||
				isNoteAlreadyActiveForPerson(person, noteNumber)
			if (isLoopedNote)
			{
				logMIDIDebug("MIDI:noteon ignored because note is already active", {
					input: input.name,
					noteNumber,
					activeOutputNotes: Array.from(activeOutputNotes.keys()),
					playingMIDINotes: Array.from(playingMIDINotes.keys()),
					isActiveOutputNote,
					recentOutputEcho,
					personNumber: person.playerNumber
				})
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} active`, true)
				return
			}

			setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} on`, true)
			playMIDINoteOn(person, noteNumber, event.value ?? event.velocity ?? 1)
		}

		const onNoteOff = event => {
			const playingEntry = playingMIDINotes.get(event.note.number)
			const recentOutputEcho = isRecentMIDIOutputEcho(event, 'noteoff', input)
			const debug = recordMIDIInputDebug(input, event, 'noteoff', {
				recentOutputEcho,
				hasPlayingInputNote: Boolean(playingEntry)
			})
			if (debug.isLooping)
			{
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} off loop suppressed`, true)
				return
			}
			if (playingEntry)
			{
				if (recentOutputEcho)
				{
					logMIDIDebug("MIDI:noteoff echo ignored while input note is held", {
						input: input.name,
						noteNumber: event.note.number,
						recentOutputEcho
					}, 'info')
					return
				}
				setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} off`, true)
				playMIDINoteOffEntry(playingEntry)
				return
			}
			if (recentOutputEcho)
			{
				logMIDIDebug("MIDI:noteoff ignored because it matches recent outbound MIDI", {
					input: input.name,
					noteNumber: event.note.number,
					recentOutputEcho
				})
				return
			}

			setMIDIInputStatus(statusAPI, input, statusId, `${getMIDINoteLabel(event)} off`, true)
			playMIDINoteOff(event.note.number)
		}

		input.addListener("midimessage", onMIDIMessage)
		input.addListener("noteon", onNoteOn)
		input.addListener("noteoff", onNoteOff)

		midiInputObservers.set(statusId, {
			input,
			onMIDIMessage,
			onNoteOn,
			onNoteOff,
			stopNotesForPerson
		})

		logMIDIDebug("MIDI:Available input device", {
			manufacturer: input.manufacturer,
			name: input.name
		}, 'info')
	})

	return WebMidi.inputs.length > 0
}
