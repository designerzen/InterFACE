import {
	kickSequences,
	snareSequences,
	hatSequences,
	drumRollSequence,
	DRUM_GROOVES
} from './drum-patterns.js'

const LANES = [ 
	'kick', 
	'snare', 
	'hat', 
	'clap' 
]

const DEFAULT_INTENT = {
	energy: 0.5,
	density: 0.5,
	tension: 0.35,
	fillChance: 0.35,
	rollChance: 0.25,
	chaos: 0.15,
	muteKick: false,
	muteSnare: false,
	muteHat: false,
	muteClap: false
}

const clamp = (value, min=0, max=1) => Math.min(max, Math.max(min, value))
const clampVelocity = value => Math.round(Math.min(255, Math.max(0, value)))
const wrap = (index, length) => ((index % length) + length) % length

// Additional hits scheduled inside the current beat. Keeping these as offsets
// avoids increasing the master clock rate and gives tuplets an exact grid.
export const createDrumSubHits = ({ inFill, inRoll, stepInPhrase, bpm, intent, style='auto', random=Math.random }) => {
	if ((!inFill && !inRoll) || !Number.isFinite(bpm) || bpm <= 0)
	{
		return []
	}

	const beat = 60 / bpm
	const events = []
	const add = (lane, division, positions, strength) => positions.forEach(position => {
		const accent = position === positions.length - 1 ? 1 : 0.82 + random() * 0.12
		events.push({
			lane,
			offset:beat * position / division,
			velocity:clampVelocity(strength * accent),
			division
		})
	})

	if (inFill)
	{
		// Alternate straight rapid bursts with true triplets/sextuplets so fills
		// do not collapse into the same machine-gun rhythm every phrase.
		const tripletFill = style === 'triplet' || style === 'sextuplet' || (style === 'auto' && stepInPhrase % 2 === 0)
		const density = intent.density + intent.energy + intent.tension
		if (tripletFill)
		{
			const hatDivision = style === 'triplet' ? 3 : 6
			add('hat', hatDivision, Array.from({ length:hatDivision - 1 }, (_, index) => index + 1), 105 + intent.energy * 100)
		}else{
			const division = style === 'rapid' || density > 1.75 ? 8 : 4
			add('hat', division, Array.from({ length:division - 1 }, (_, index) => index + 1), 100 + intent.energy * 105)
		}
	}else if (inRoll)
	{
		add('hat', 3, [1, 2], 95 + intent.energy * 105)
	}

	// Equal-power density compensation prevents tuplets from becoming several
	// times louder simply because more voices occur inside one beat.
	const densityGain = Math.min(0.6, 1 / Math.sqrt(Math.max(1, events.length)))
	return events
		.map(event => ({
			...event,
			velocity:clampVelocity(event.velocity * densityGain),
			lengthScale:event.lane === 'hat'
				? Math.min(0.55, 1.8 / event.division)
				: Math.min(0.65, 2.4 / event.division)
		}))
		.sort((a, b) => a.offset - b.offset)
}

export const applyDrumSubHitEnvelope = (options, event) => {
	const minimumLength = event.lane === 'hat' ? 0.025 : 0.04
	const length = Math.max(minimumLength, options.length * (event.lengthScale ?? 1))
	const scaled = {
		...options,
		length,
		attack:Math.min(options.attack, length * 0.15),
		decay:Math.min(options.decay, length * 0.3)
	}
	if (Number.isFinite(options.release))
	{
		scaled.release = Math.min(options.release, length * 0.35)
	}
	return scaled
}

const hashSeed = value => {
	const text = String(value ?? 'photosynth-drums')
	let hash = 2166136261
	for (let i = 0; i < text.length; i++)
	{
		hash ^= text.charCodeAt(i)
		hash = Math.imul(hash, 16777619)
	}
	return hash >>> 0
}

// deterministic randomness
const createRandom = seed => {
	let state = hashSeed(seed)
	return () => {
		state += 0x6D2B79F5
		let value = state
		value = Math.imul(value ^ value >>> 15, value | 1)
		value ^= value + Math.imul(value ^ value >>> 7, value | 61)
		return ((value ^ value >>> 14) >>> 0) / 4294967296
	}
}

const sequenceDensity = sequence => {
	const hits = sequence.filter(value => value > 0).length
	return hits / sequence.length
}

const sequenceEnergy = sequence => {
	const total = sequence.reduce((sum, value) => sum + value, 0)
	return total / (sequence.length * 255)
}

const createCells = (lane, sequences) => sequences.map((sequence, index) => ({
	id: `${lane}-${index}`,
	index,
	lane,
	sequence,
	density: sequenceDensity(sequence),
	energy: sequenceEnergy(sequence),
	length: sequence.length
}))

const chooseWeighted = (items, score, random) => {
	let total = 0
	const weighted = items.map(item => {
		const weight = Math.max(0.001, score(item))
		total += weight
		return { item, weight }
	})
	let cursor = random() * total
	for (const entry of weighted)
	{
		cursor -= entry.weight
		if (cursor <= 0)
		{
			return entry.item
		}
	}
	return weighted[weighted.length - 1].item
}

const getTempoProfile = bpm => {
	if (!Number.isFinite(bpm) || bpm <= 0)
	{
		return {
			name: 'unknown',
			density: 0.5,
			fillChance: 0.9,
			rollChance: 0.8,
			stability: 0.9
		}
	}
	if (bpm < 72)
	{
		return {
			name: 'slow',
			density: 0.7,
			fillChance: 1.2,
			rollChance: 1.1,
			stability: 0.75
		}
	}
	if (bpm < 118)
	{
		return {
			name: 'medium',
			density: 0.55,
			fillChance: 1,
			rollChance: 0.9,
			stability: 0.9
		}
	}
	if (bpm < 154)
	{
		return {
			name: 'fast',
			density: 0.42,
			fillChance: 0.75,
			rollChance: 0.65,
			stability: 1.05
		}
	}
	return {
		name: 'very-fast',
		density: 0.32,
		fillChance: 0.55,
		rollChance: 0.45,
		stability: 1.2
	}
}

const createFill = (lane, stepInPhrase, phraseLength, tempoProfile, intent) => {
	const remaining = phraseLength - stepInPhrase
	const fillWindow = tempoProfile.name === 'very-fast' ? 4 : 8
	if (remaining > fillWindow)
	{
		return 0
	}

	const fillStep = fillWindow - remaining
	const ramp = (fillStep + 1) / fillWindow
	const energy = clamp(0.45 + intent.energy * 0.55)

	switch(lane)
	{
		case 'snare':
		case 'clap':
			return fillStep % 2 === 0 || ramp > 0.75 ? clampVelocity((120 + ramp * 135) * energy) : 0
		case 'hat':
			return clampVelocity((80 + ramp * 150) * energy)
		case 'kick':
			return remaining <= 3 && fillStep % 2 === 0 ? clampVelocity(150 + ramp * 90) : 0
		default:
			return 0
	}
}

const shouldKeepMutedHit = (lane, step, velocity, intent) => {
	if (velocity <= 0)
	{
		return false
	}
	if (lane === 'kick' && intent.muteKick)
	{
		return step % 4 === 0 && velocity > 220 && intent.energy > 0.65
	}
	if ((lane === 'snare' || lane === 'clap') && (intent.muteSnare || intent.muteClap))
	{
		return false
	}
	if (lane === 'hat' && intent.muteHat)
	{
		return step % 8 === 0 && intent.tension > 0.65
	}
	return true
}

export const createDrumArranger = (options={}) => {
	const random = createRandom(options.seed)
	const selectedGroove = typeof options.groove === 'string' ? DRUM_GROOVES[options.groove] : options.groove
	const cells = {
		kick: createCells('kick', selectedGroove ? [selectedGroove.kick] : kickSequences),
		snare: createCells('snare', selectedGroove ? [selectedGroove.snare] : snareSequences),
		hat: createCells('hat', selectedGroove ? [selectedGroove.hat] : hatSequences),
		clap: createCells('clap', selectedGroove ? [selectedGroove.clap] : snareSequences)
	}
	const state = {
		step: -1,
		bar: 0,
		phraseBars: options.phraseBars ?? 8,
		stepsPerBar: options.stepsPerBar ?? 4,
		bpm: options.bpm ?? 0,
		lastTriggerAt: 0,
		intent: { ...DEFAULT_INTENT, ...(options.intent ?? {}) },
		current: {},
		recentFills: [],
		fillUntilStep: -1,
		rollUntilStep: -1,
		lastFillPhrase: -8,
		phrase: -1
	}

	const phraseLength = () => state.phraseBars * state.stepsPerBar
	const currentTempoProfile = () => getTempoProfile(state.bpm)

	const selectCell = lane => {
		const tempo = currentTempoProfile()
		const intent = state.intent
		const targetDensity = clamp((intent.density * 0.65) + (tempo.density * 0.35))
		const targetEnergy = clamp((intent.energy * 0.75) + (targetDensity * 0.25))
		const previous = state.current[lane]

		return chooseWeighted(cells[lane], cell => {
			const densityDistance = Math.abs(cell.density - targetDensity)
			const energyDistance = Math.abs(cell.energy - targetEnergy)
			const repeatPenalty = previous && previous.id === cell.id ? 0.3 : 1
			const busyFastPenalty = tempo.name === 'very-fast' && cell.density > 0.6 ? 0.35 : 1
			const sparseSlowPenalty = tempo.name === 'slow' && cell.density < 0.18 ? 0.6 : 1
			return (1.4 - densityDistance - energyDistance * 0.7) * repeatPenalty * busyFastPenalty * sparseSlowPenalty
		}, random)
	}

	const choosePhrase = () => {
		state.phrase++
		LANES.forEach(lane => state.current[lane] = selectCell(lane))
		const tempo = currentTempoProfile()
		const phraseDistance = state.phrase - state.lastFillPhrase
		const phraseAccent = state.phrase % 4 === 3 ? 1.4 : state.phrase % 2 === 1 ? 1 : 0.55
		const fillChance = clamp(0.08 * phraseAccent * tempo.fillChance + state.intent.fillChance * 0.18 + state.intent.tension * 0.08)
		const rollChance = clamp(0.04 * tempo.rollChance + state.intent.rollChance * 0.12)
		const canFill = phraseDistance > 1

		if (canFill && random() < fillChance)
		{
			state.fillUntilStep = state.step + phraseLength()
			state.lastFillPhrase = state.phrase
			state.recentFills.push(state.phrase)
			state.recentFills = state.recentFills.slice(-8)
		}else if (canFill && random() < rollChance)
		{
			state.rollUntilStep = state.step + phraseLength()
			state.lastFillPhrase = state.phrase
		}
	}

	const maybeEstimateTempo = triggerAt => {
		if (!Number.isFinite(triggerAt) || triggerAt <= 0)
		{
			return
		}
		if (state.lastTriggerAt > 0)
		{
			const delta = triggerAt - state.lastTriggerAt
			if (delta > 0.08 && delta < 3)
			{
				const bpm = 60 / delta
				state.bpm = state.bpm > 0 ? state.bpm * 0.82 + bpm * 0.18 : bpm
			}
		}
		state.lastTriggerAt = triggerAt
	}

	const transformVelocity = (lane, velocity, stepInPhrase) => {
		const intent = state.intent
		const tempo = currentTempoProfile()
		const cell = state.current[lane]
		const phraseEndWindow = phraseLength() - stepInPhrase <= (tempo.name === 'very-fast' ? 4 : 8)
		const inFill = state.step < state.fillUntilStep && phraseEndWindow
		const inRoll = state.step < state.rollUntilStep && phraseEndWindow

		if (!shouldKeepMutedHit(lane, state.step, velocity, intent))
		{
			return 0
		}

		let output = velocity
		if (inFill)
		{
			output = Math.max(output, createFill(lane, stepInPhrase, phraseLength(), tempo, intent))
		}
		if (inRoll && (lane === 'hat' || lane === 'snare'))
		{
			const roll = drumRollSequence[wrap(stepInPhrase, drumRollSequence.length)] ?? 0
			output = Math.max(output, roll * (lane === 'hat' ? 0.9 : 0.75))
		}

		const isStrongStep = state.step % 4 === 0
		const ghostChance = tempo.name === 'very-fast' ? 0.02 : 0.04 + intent.chaos * 0.08
		if (output <= 0 && !inFill && random() < ghostChance)
		{
			if (lane === 'hat' && cell.density < tempo.density + 0.25)
			{
				output = 35 + random() * 70
			}
			if ((lane === 'snare' || lane === 'clap') && !isStrongStep && intent.energy > 0.35)
			{
				output = 25 + random() * 55
			}
			if (lane === 'kick' && !isStrongStep && intent.energy > 0.75 && tempo.name !== 'very-fast')
			{
				output = 65 + random() * 75
			}
		}

		if (output > 0)
		{
			const human = 0.9 + random() * 0.16
			const accent = isStrongStep ? 1.06 : 1
			output = output * human * accent
		}
		return clampVelocity(output)
	}

	const next = (context={}) => {
		if (Number.isFinite(context.bpm) && context.bpm > 0)
		{
			state.bpm = context.bpm
		}
		maybeEstimateTempo(context.triggerAt)

		state.step++
		const stepInPhrase = wrap(state.step, phraseLength())
		if (stepInPhrase === 0 || LANES.some(lane => !state.current[lane]))
		{
			choosePhrase()
		}
		state.bar = Math.floor(state.step / state.stepsPerBar)

		const parts = LANES.reduce((parts, lane) => {
			const cell = state.current[lane]
			const velocity = cell?.sequence?.[wrap(state.step, cell.length)] ?? 0
			parts[lane] = transformVelocity(lane, velocity, stepInPhrase)
			return parts
		}, {})

		// Closed hats choke the shared voice; an occasional offbeat open hat is
		// allowed to ring only until the following closed hit.
		parts.hatOpen = parts.hat > 0 && state.step % 4 === 3 &&
			random() < 0.12 + state.intent.tension * 0.28

		// Cowbell is sparse phrase colour. It appears more as energy/tension rise,
		// avoiding the relentless four-on-the-floor cowbell cliché.
		const cowbellStep = state.step % 8 === 5 || state.step % 16 === 11
		const cowbellChance = 0.025 + state.intent.energy * 0.08 + state.intent.tension * 0.1
		parts.cowbell = cowbellStep && random() < cowbellChance
			? clampVelocity(90 + state.intent.energy * 105 + random() * 35)
			: 0

		const phraseEndWindow = phraseLength() - stepInPhrase <= (currentTempoProfile().name === 'very-fast' ? 4 : 8)
		const presetTiming = selectedGroove?.timing
		const presetSubdivisionStep = presetTiming &&
			wrap(state.step - (presetTiming.phase ?? 0), presetTiming.every ?? 4) === 0
		parts.events = createDrumSubHits({
			inFill:presetSubdivisionStep || (state.step < state.fillUntilStep && phraseEndWindow),
			inRoll:state.step < state.rollUntilStep && phraseEndWindow,
			stepInPhrase,
			bpm:state.bpm,
			intent:state.intent,
			style:presetSubdivisionStep ? presetTiming.style : 'auto',
			random
		})

		return parts
	}

	return {
		next,
		getStep: () => state.step,
		getBPM: () => state.bpm,
		setTempo: bpm => {
			if (Number.isFinite(bpm) && bpm > 0)
			{
				state.bpm = bpm
			}
		},
		setMutedParts: (mutes={}) => {
			state.intent.muteKick = !!mutes.kick
			state.intent.muteSnare = !!mutes.snare
			state.intent.muteHat = !!mutes.hat
			state.intent.muteClap = !!mutes.clap
		},
		updatePerson: (person={}) => {
			const velocity = Number.isFinite(person.noteVelocity) ? person.noteVelocity : person.velocity
			const activity = Number.isFinite(velocity) ? clamp(velocity) : state.intent.energy
			state.intent = {
				...state.intent,
				energy: clamp(activity),
				density: clamp(0.25 + activity * 0.65),
				tension: clamp(Math.abs(person.pitchBend ?? person.bend ?? 0)),
				fillChance: clamp(0.15 + activity * 0.6),
				rollChance: clamp(0.08 + activity * 0.45)
			}
		},
		setIntent: intent => state.intent = { ...state.intent, ...intent },
		requestFill: (amount=1) => {
			if (amount > 0)
			{
				state.fillUntilStep = state.step + phraseLength()
			}
		}
	}
}
