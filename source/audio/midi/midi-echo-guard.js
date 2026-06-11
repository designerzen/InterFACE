const MIDI_ECHO_GUARD_TTL = 150
const MIDI_OUTPUT_LOOP_WINDOW = 250
const MIDI_OUTPUT_LOOP_LIMIT = 24
const MIDI_PANIC_LOOP_LIMIT = 2
const MIDI_DEBUG_ENABLED_STORAGE_KEY = 'photosynth-midi-debug-enabled'
const MIDI_DEBUG_STORAGE_KEY = 'photosynth-midi-debug-log'
const MIDI_DEBUG_STORAGE_LIMIT = 80

export const isMIDIDebugEnabled = () => {
	if (globalThis.__photosynthMIDIDebugEnabled === true)
	{
		return true
	}

	try{
		return globalThis.localStorage?.getItem(MIDI_DEBUG_ENABLED_STORAGE_KEY) === 'true'
	}catch(error){
		return false
	}
}

const getMIDIDebugState = () => {
	const debugState = globalThis.__photosynthMIDIDebug ?? {
		inputs: new Map(),
		outputs: new Map(),
		loops: new Map(),
		recentOutputs: new Map(),
		activeNotes: new Map(),
		totals: {
			input: 0,
			output: 0,
			suppressed: 0,
			loopWarnings: 0
		},
		lastSummaryAt: 0,
		startedAt: performance.now()
	}

	debugState.inputs ??= new Map()
	debugState.outputs ??= new Map()
	debugState.loops ??= new Map()
	debugState.recentOutputs ??= new Map()
	debugState.activeNotes ??= new Map()
	debugState.totals ??= {}
	debugState.totals.input ??= 0
	debugState.totals.output ??= 0
	debugState.totals.suppressed ??= 0
	debugState.totals.loopWarnings ??= 0

	globalThis.__photosynthMIDIDebug = debugState
	return debugState
}

const getMIDIDebugPanel = () => {
	if (!globalThis.document?.body)
	{
		return null
	}

	let panel = document.getElementById('photosynth-midi-debug')
	if (!panel)
	{
		panel = document.createElement('pre')
		panel.id = 'photosynth-midi-debug'
		panel.style.cssText = [
			'position:fixed',
			'z-index:2147483647',
			'left:0',
			'right:0',
			'bottom:0',
			'max-height:35vh',
			'overflow:auto',
			'margin:0',
			'padding:8px',
			'background:rgba(0,0,0,0.88)',
			'color:#9cff9c',
			'font:12px/1.35 monospace',
			'white-space:pre-wrap',
			'pointer-events:none'
		].join(';')
		document.body.appendChild(panel)
	}
	return panel
}

export const logMIDIDebug = (message, detail = {}, level = 'warn') => {
	if (!isMIDIDebugEnabled())
	{
		return false
	}

	const entry = {
		at: Math.round(performance.now()),
		message,
		detail
	}

	try{
		const previous = JSON.parse(localStorage.getItem(MIDI_DEBUG_STORAGE_KEY) || '[]')
		previous.push(entry)
		localStorage.setItem(MIDI_DEBUG_STORAGE_KEY, JSON.stringify(previous.slice(-MIDI_DEBUG_STORAGE_LIMIT)))
	}catch(error){
		// Storage can fail in private mode or during shutdown; console/panel logging still helps.
	}

	const panel = getMIDIDebugPanel()
	if (panel)
	{
		const line = `[${entry.at}ms] ${message} ${JSON.stringify(detail)}`
		panel.textContent = `${line}\n${panel.textContent}`.slice(0, 12000)
	}

	console[level]?.(message, detail)
	return true
}

const getPortId = port => {
	const output = port?.output ?? port?.port
	const id = port?.id ?? output?.id ?? port?.name ?? output?.name ?? 'unknown-midi-port'
	const channel = port?.number ?? port?.channel ?? port?.channelNumber
	return channel === undefined ? id : `${id}:channel-${channel}`
}

const normalizeMIDIPortName = value => String(value ?? '').trim().toLowerCase()

const isSameMIDIDevice = (input, recentOutput) => {
	if (!input || !recentOutput)
	{
		return true
	}

	const inputId = normalizeMIDIPortName(input.id)
	const inputName = normalizeMIDIPortName(input.name)
	const outputId = normalizeMIDIPortName(recentOutput.portId)
	const outputName = normalizeMIDIPortName(recentOutput.outputName)

	return Boolean(
		inputId && (inputId === outputId || inputId === outputName) ||
		inputName && (inputName === outputId || inputName === outputName)
	)
}

const getNoteKeys = note => {
	const keys = new Set()
	if (note === undefined || note === null)
	{
		keys.add('none')
		return keys
	}

	if (typeof note === 'object')
	{
		if (note.noteNumber !== undefined)
		{
			keys.add(String(note.noteNumber))
		}
		if (note.number !== undefined)
		{
			keys.add(String(note.number))
		}
		if (note.identifier)
		{
			keys.add(String(note.identifier))
		}
		if (note.name)
		{
			keys.add(String(note.name))
		}
		return keys.size ? keys : new Set([String(note)])
	}

	keys.add(String(note))
	return keys
}

const getEventNoteKeys = event => {
	const keys = getNoteKeys(event?.note)
	if (event?.message?.dataBytes?.[0] !== undefined)
	{
		keys.add(String(event.message.dataBytes[0]))
	}
	return keys
}

const getPrimaryNoteKey = note => Array.from(getNoteKeys(note))[0]

const getActiveNoteKey = (output, note, options) => {
	const rawChannels = options?.channels ?? options?.channel
	const optionChannels = Array.isArray(rawChannels) ? rawChannels.join(',') : rawChannels
	return [
		getPortId(output),
		optionChannels === undefined ? 'channels-default' : `channels-${optionChannels}`,
		getPrimaryNoteKey(note)
	].join('|')
}

const getEchoTypes = type => {
	switch(type){
		case 'playNote':
			return ['playNote', 'noteon']
		case 'stopNote':
			return ['stopNote', 'noteoff']
		case 'noteon':
			return ['noteon', 'playNote']
		case 'noteoff':
			return ['noteoff', 'stopNote']
		case 'sendClock':
			return ['sendClock', 'clock']
		case 'clock':
			return ['clock', 'sendClock']
		case 'sendAllNotesOff':
			return ['sendAllNotesOff', 'allnotesoff']
		case 'allnotesoff':
			return ['allnotesoff', 'sendAllNotesOff']
		case 'sendAllSoundOff':
		case 'turnSoundOff':
		case 'turnNotesOff':
			return [type, 'allnotesoff']
		default:
			return [type]
	}
}

export const recordMIDIOutputForEchoGuard = (output, type, note, source = 'unknown') => {
	const debugState = getMIDIDebugState()
	const now = performance.now()
	const portId = getPortId(output)
	const noteKeys = getNoteKeys(note)

	for (const echoType of getEchoTypes(type))
	{
		for (const noteKey of noteKeys)
		{
			debugState.recentOutputs.set(`${echoType}|${noteKey}`, {
				type: echoType,
				note: noteKey,
				portId,
				outputName: output?.name,
				source,
				at: now
			})
		}
	}
}

export const isRecentMIDIOutputEcho = (event, type, input = null) => {
	const debugState = getMIDIDebugState()
	const now = performance.now()
	for (const echoType of getEchoTypes(type))
	{
		for (const noteKey of getEventNoteKeys(event))
		{
			const recentOutput = debugState.recentOutputs.get(`${echoType}|${noteKey}`)
			if (recentOutput && now - recentOutput.at <= MIDI_ECHO_GUARD_TTL && isSameMIDIDevice(input, recentOutput))
			{
				return recentOutput
			}
		}
	}
	return null
}

export const shouldSuppressMIDIOutput = (output, type, note, source = 'unknown') => {
	const debugState = getMIDIDebugState()
	const now = performance.now()
	const portId = getPortId(output)
	const noteKey = Array.from(getNoteKeys(note)).join('/')
	const key = `output|${portId}|${type}|${noteKey}`
	const loopLimit = type === 'sendAllNotesOff' || type === 'sendAllSoundOff' || type === 'turnSoundOff' || type === 'turnNotesOff' ?
		MIDI_PANIC_LOOP_LIMIT :
		MIDI_OUTPUT_LOOP_LIMIT
	const loopStats = debugState.loops.get(key) ?? {
		key,
		phase: 'output',
		type,
		note: noteKey,
		portId,
		source,
		count: 0,
		windowStartedAt: now,
		warned: false,
		suppressed: 0
	}

	if (now - loopStats.windowStartedAt > MIDI_OUTPUT_LOOP_WINDOW)
	{
		loopStats.count = 0
		loopStats.windowStartedAt = now
		loopStats.warned = false
	}

	loopStats.count++
	debugState.loops.set(key, loopStats)

	if (loopStats.count < loopLimit)
	{
		recordMIDIOutputForEchoGuard(output, type, note, source)
		return false
	}

	loopStats.suppressed++
	debugState.totals.suppressed++
	if (!loopStats.warned)
	{
		loopStats.warned = true
		debugState.totals.loopWarnings++
		logMIDIDebug("MIDI:Suppressing repeated outbound MIDI", {
			output: {
				id: portId,
				name: output?.name,
				manufacturer: output?.manufacturer
			},
			type,
			note,
			source,
			loopStats
		}, 'error')
	}

	return true
}

export const sendGuardedMIDIOutput = (output, method, note, options, source = 'unknown') => {
	if (!output?.[method])
	{
		return false
	}

	const debugState = getMIDIDebugState()
	const activeNoteKey = method === 'playNote' || method === 'stopNote' ?
		getActiveNoteKey(output, note, options) :
		null

	if (method === 'playNote' && debugState.activeNotes.has(activeNoteKey))
	{
		debugState.totals.suppressed++
		return false
	}

	if (method === 'stopNote' && !debugState.activeNotes.has(activeNoteKey))
	{
		debugState.totals.suppressed++
		return false
	}

	if (shouldSuppressMIDIOutput(output, method, note, source))
	{
		return false
	}

	if (note === undefined && options === undefined)
	{
		output[method]()
	}else if (options === undefined){
		output[method](note)
	}else{
		output[method](note, options)
	}

	if (method === 'playNote')
	{
		debugState.activeNotes.set(activeNoteKey, {
			output,
			note,
			options,
			source,
			at: performance.now()
		})
	}else if (method === 'stopNote'){
		debugState.activeNotes.delete(activeNoteKey)
	}
	return true
}

export const stopActiveMIDIOutputNotes = (output, source = 'unknown', options = { release: 0 }) => {
	const debugState = getMIDIDebugState()
	const portId = getPortId(output)
	let stopped = 0

	for (const [activeNoteKey, activeNote] of Array.from(debugState.activeNotes.entries()))
	{
		if (!activeNoteKey.startsWith(`${portId}|`))
		{
			continue
		}

		const activeChannelOptions = activeNote.options?.channels === undefined ?
			(activeNote.options?.channel === undefined ? {} : { channel: activeNote.options.channel }) :
			{ channels: activeNote.options.channels }
		const stopOptions = { ...activeChannelOptions, ...options }
		if (sendGuardedMIDIOutput(output, 'stopNote', activeNote.note, stopOptions, source))
		{
			stopped++
		}
	}

	return stopped
}

export const stopAllActiveMIDIOutputNotes = (source = 'unknown', options = { release: 0 }) => {
	const debugState = getMIDIDebugState()
	const activeOutputs = new Set(
		Array.from(debugState.activeNotes.values())
			.map(activeNote => activeNote.output)
			.filter(Boolean)
	)
	let stopped = 0

	activeOutputs.forEach(output => {
		stopped += stopActiveMIDIOutputNotes(output, source, options)
	})

	return stopped
}
