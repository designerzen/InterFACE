import {
	kickSequences,
	snareSequences,
	hatSequences,
	drumRollSequence,
	DRUM_GROOVES,
	AUXILIARY_DRUM_LANES,
} from './drum-patterns.js'
import { compileDrumFeel, getDrumGrid } from './drum-feel.js'

const CORE_LANES = [
	'kick', 
	'snare', 
	'hat', 
	'clap' 
]
const SOUND_LANES = new Set([...CORE_LANES, 'cowbell', ...AUXILIARY_DRUM_LANES])

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

export const DRUM_PERFORMANCE_PRESETS = Object.freeze({
	steady:Object.freeze({ id:'steady', title:'Steady' }),
	crescendo:Object.freeze({ id:'crescendo', title:'Crescendo' }),
	bridge:Object.freeze({ id:'bridge', title:'Bridge' }),
	'snare-roll':Object.freeze({ id:'snare-roll', title:'Snare Roll' }),
	breakdown:Object.freeze({ id:'breakdown', title:'Breakdown' }),
	drop:Object.freeze({ id:'drop', title:'Drop' }),
})

const PERFORMANCE_PRESET_IDS = new Set(['auto', ...Object.keys(DRUM_PERFORMANCE_PRESETS)])

const clamp = (value, min=0, max=1) => Math.min(max, Math.max(min, value))
const clampVelocity = value => Math.round(Math.min(255, Math.max(0, value)))
const wrap = (index, length) => ((index % length) + length) % length

// Additional hits scheduled inside the current beat. Keeping these as offsets
// avoids increasing the master clock rate and gives tuplets an exact grid.
export const createDrumSubHits = ({ inFill, inRoll, stepInPhrase, bpm, intent, stepDuration=60 / bpm, maxEvents=7, style='auto', random=Math.random }) => {
	if ((!inFill && !inRoll) || !Number.isFinite(bpm) || bpm <= 0)
	{
		return []
	}

	const beat = stepDuration
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
	return events.slice(0, Math.max(0, maxEvents))
		.map(event => ({
			...event,
			velocity:clampVelocity(event.velocity * densityGain),
			lengthScale:event.lane === 'hat'
				? Math.min(0.55, 1.8 / event.division)
				: Math.min(0.65, 2.4 / event.division)
		}))
		.sort((a, b) => a.offset - b.offset)
}

export const applyDrumSubHitEnvelope = (options, event, output) => {
	const minimumLength = event.lane === 'hat' ? 0.025 : 0.04
	const length = Math.max(minimumLength, options.length * (event.lengthScale ?? 1))
	const scaled = Object.assign(output ?? {}, options)
	scaled.length = length
	scaled.attack = Math.min(options.attack, length * 0.15)
	scaled.decay = Math.min(options.decay, length * 0.3)
	if (Number.isFinite(options.release))
	{
		scaled.release = Math.min(options.release, length * 0.35)
	}else if (output){
		delete scaled.release
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

const TEMPO_PROFILES = Object.freeze({
	unknown:Object.freeze({ name:'unknown', density:0.5, fillChance:0.9, rollChance:0.8, stability:0.9 }),
	slow:Object.freeze({ name:'slow', density:0.7, fillChance:1.2, rollChance:1.1, stability:0.75 }),
	medium:Object.freeze({ name:'medium', density:0.55, fillChance:1, rollChance:0.9, stability:0.9 }),
	fast:Object.freeze({ name:'fast', density:0.42, fillChance:0.75, rollChance:0.65, stability:1.05 }),
	veryFast:Object.freeze({ name:'very-fast', density:0.32, fillChance:0.55, rollChance:0.45, stability:1.2 })
})

const getTempoProfile = bpm => {
	if (!Number.isFinite(bpm) || bpm <= 0)
	{
		return TEMPO_PROFILES.unknown
	}
	if (bpm < 72)
	{
		return TEMPO_PROFILES.slow
	}
	if (bpm < 118)
	{
		return TEMPO_PROFILES.medium
	}
	if (bpm < 154)
	{
		return TEMPO_PROFILES.fast
	}
	return TEMPO_PROFILES.veryFast
}

const createFill = (lane, stepInPhrase, phraseLength, tempoProfile, intent, fillWindow=8) => {
	const remaining = phraseLength - stepInPhrase
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

const shouldKeepMutedHit = (lane, step, velocity, intent, stepsPerBeat=4) => {
	if (velocity <= 0)
	{
		return false
	}
	if (lane === 'kick' && intent.muteKick)
	{
		return step % stepsPerBeat === 0 && velocity > 220 && intent.energy > 0.65
	}
	if ((lane === 'snare' || lane === 'clap') && (intent.muteSnare || intent.muteClap))
	{
		return false
	}
	if (lane === 'hat' && intent.muteHat)
	{
		return step % (stepsPerBeat * 2) === 0 && intent.tension > 0.65
	}
	return true
}

export const createDrumArranger = (options={}) => {
	const random = createRandom(options.seed)
	const selectedGroove = typeof options.groove === 'string' ? DRUM_GROOVES[options.groove] : options.groove
	const grid = getDrumGrid(selectedGroove, options)
	const feel = compileDrumFeel(selectedGroove, grid)
	const protectedLanes = new Set(selectedGroove?.protectedLanes ?? [])
	const auxiliaryLanes = selectedGroove
		? AUXILIARY_DRUM_LANES.filter(lane => Array.isArray(selectedGroove[lane]))
		: []
	const activeLanes = [...CORE_LANES, ...auxiliaryLanes]
	const exposedActiveLanes = Object.freeze([...activeLanes, 'cowbell'])
	const beatSequenceCache = new Map()
	const cells = {
		kick: createCells('kick', selectedGroove ? [selectedGroove.kick] : kickSequences),
		snare: createCells('snare', selectedGroove ? [selectedGroove.snare] : snareSequences),
		hat: createCells('hat', selectedGroove ? [selectedGroove.hat] : hatSequences),
		clap: createCells('clap', selectedGroove ? [selectedGroove.clap] : snareSequences)
	}
	for (const lane of auxiliaryLanes)
	{
		cells[lane] = createCells(lane, [selectedGroove[lane]])
	}
	const state = {
		step: -1,
		bar: 0,
		phraseBars: options.phraseBars ?? 8,
		stepsPerBar: grid.stepsPerBar,
		bpm: options.bpm ?? 0,
		lastTriggerAt: null,
		tempoLocked:Number.isFinite(options.bpm) && options.bpm > 0,
		needsPhrase:true,
		subHitsRemaining:8,
		intent: { ...DEFAULT_INTENT, ...(options.intent ?? {}) },
		current: {},
		recentFills: [],
		fillUntilStep: -1,
		rollUntilStep: -1,
		lastFillPhrase: -8,
		phrase: -1,
		rapidPercussion: options.rapidPercussion === true,
		performanceControl: options.performanceControl !== false,
		performancePreset: PERFORMANCE_PRESET_IDS.has(options.performancePreset) ? options.performancePreset : 'auto',
		performanceTechnique: options.performancePreset && options.performancePreset !== 'auto' ? options.performancePreset : 'steady',
		techniqueStartedAtStep: 0,
		lastActivity: clamp(options.intent?.energy ?? DEFAULT_INTENT.energy),
		activityReserve: 0,
		lastPersonUpdateAt: null,
		lastParts: {}
	}

	const phraseLength = () => state.phraseBars * state.stepsPerBar
	const stepDuration = (bpm=state.bpm) => 60 / (bpm > 0 ? bpm : 120) / grid.stepsPerBeat
	const isStrong = step => feel.strong[wrap(step, state.stepsPerBar)] === 1
	const currentTempoProfile = () => getTempoProfile(state.bpm)
	const fillWindowFor = tempo => Math.min(state.stepsPerBar, Math.max(1, Math.round(grid.stepsPerBeat * (tempo.name === 'very-fast' ? 1 : 2))))

	const selectCell = (lane, tempo) => {
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
		state.phrase = Math.floor(state.step / phraseLength())
		state.needsPhrase = false
		beatSequenceCache.clear()
		const tempo = currentTempoProfile()
		activeLanes.forEach(lane => state.current[lane] = selectCell(lane, tempo))
		const phraseDistance = state.phrase - state.lastFillPhrase
		const phraseAccent = state.phrase % 4 === 3 ? 1.4 : state.phrase % 2 === 1 ? 1 : 0.55
		const fillChance = clamp(state.intent.fillChance * (0.2 + phraseAccent * 0.45 + state.intent.tension * 0.2) * tempo.fillChance)
		const rollChance = clamp(state.intent.rollChance * (0.2 + state.intent.tension * 0.2) * tempo.rollChance)
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
		// Move a weak hat into a ghost stroke; never add to the phrase's hit
		// count or touch a protected timeline. Work is done once per phrase.
		if (feel.ghost && state.current.hat && !protectedLanes.has('hat') && !protectedLanes.has('snare')) {
			const hats = Array.from({length:phraseLength()}, (_, index) => state.current.hat.sequence[index % state.current.hat.length])
			const snares = Array.from({length:phraseLength()}, (_, index) => state.current.snare.sequence[index % state.current.snare.length])
			for (let bar=1; bar<state.phraseBars; bar++) {
				if ((bar % 4 !== 3 && bar !== state.phraseBars - 1) || random() > state.intent.chaos + 0.15) continue
				const first = bar * state.stepsPerBar
				for (let local=1; local<state.stepsPerBar-1; local++) {
					const index = wrap(first + local, hats.length)
					const snareIndex = wrap(first + local, snares.length)
					if (hats[index] > 0 && hats[index] < 170 && snares[snareIndex] === 0 && !isStrong(local)) {
						hats[index] = 0
						snares[snareIndex] = 42 + Math.floor(random() * 25)
						break
					}
				}
			}
			state.current.hat = {...state.current.hat, sequence:hats, length:hats.length}
			state.current.snare = {...state.current.snare, sequence:snares, length:snares.length}
		}
	}

	const maybeEstimateTempo = triggerAt => {
		if (!Number.isFinite(triggerAt) || triggerAt <= 0)
		{
			return
		}
		if (!state.tempoLocked && state.lastTriggerAt !== null)
		{
			const delta = triggerAt - state.lastTriggerAt
			if (delta > 0.015 && delta < 3)
			{
				const bpm = 60 / (delta * grid.stepsPerBeat)
				state.bpm = state.bpm > 0 ? state.bpm * 0.82 + bpm * 0.18 : bpm
			}
		}
		state.lastTriggerAt = triggerAt
	}

	const transformVelocity = (lane, velocity, stepInPhrase, tempo, phraseLengthValue) => {
		const intent = state.intent
		const cell = state.current[lane]
		const fillWindow = fillWindowFor(tempo)
		const phraseEndWindow = phraseLengthValue - stepInPhrase <= fillWindow
		const inFill = state.step < state.fillUntilStep && phraseEndWindow
		const inRoll = state.step < state.rollUntilStep && phraseEndWindow

		if (velocity <= 0 || !shouldKeepMutedHit(lane, state.step, velocity, intent, grid.stepsPerBeat))
		{
			return 0
		}

		let output = velocity
		if (inFill && !protectedLanes.has(lane))
		{
			output = Math.max(output, createFill(lane, stepInPhrase, phraseLengthValue, tempo, intent, fillWindow))
		}
		if (inRoll && !protectedLanes.has(lane) && (lane === 'hat' || lane === 'snare'))
		{
			const roll = drumRollSequence[wrap(stepInPhrase, drumRollSequence.length)] ?? 0
			output = Math.max(output, roll * (lane === 'hat' ? 0.9 : 0.75))
		}

		const isStrongStep = isStrong(state.step)

		if (output > 0)
		{
			const human = 1 + (random() * 2 - 1) * feel.variation
			const accent = isStrongStep ? 1.06 : 1
			output = output * human * accent
		}
		return clampVelocity(output)
	}

	const setPerformanceTechnique = technique => {
		if (!DRUM_PERFORMANCE_PRESETS[technique] || state.performanceTechnique === technique)
		{
			return state.performanceTechnique
		}
		state.performanceTechnique = technique
		state.techniqueStartedAtStep = Math.max(0, state.step + 1)
		return technique
	}

	const applyPerformanceTechnique = parts => {
		if (!state.performanceControl)
		{
			return parts
		}

		const technique = state.performanceTechnique
		const stepInBar = wrap(state.step, state.stepsPerBar)
		const techniqueProgress = clamp(
			(state.step - state.techniqueStartedAtStep) / Math.max(1, state.stepsPerBar - 1)
		)
		const scalePart = (lane, multiplier) => {
			if (SOUND_LANES.has(lane) && Number.isFinite(parts[lane]) && parts[lane] > 0)
			{
				parts[lane] = clampVelocity(parts[lane] * multiplier)
			}
		}
		const scaleAll = multiplier => Object.keys(parts).forEach(lane => scalePart(lane, multiplier))
		const accent = (lane, velocity) => {
			parts[lane] = Math.max(parts[lane] ?? 0, clampVelocity(velocity))
		}

		// Every groove follows the performer dynamically before a technique adds
		// its own arrangement. Disabling Performance bypasses this entire layer.
		scaleAll(0.5 + state.intent.energy * 0.5)
		if (protectedLanes.size > 0) return parts

		switch(technique)
		{
			case 'crescendo':
				scaleAll(0.45 + techniqueProgress * 0.75)
				if (stepInBar >= state.stepsPerBar - 3)
				{
					accent(['tomFloorLow', 'tomFloorHigh', 'tomMidHigh'][stepInBar - (state.stepsPerBar - 3)], 105 + techniqueProgress * 100)
				}
				break

			case 'bridge':
				scalePart('hat', 0.55)
				if (stepInBar % Math.max(1, Math.floor(state.stepsPerBar / 4)) === 0)
				{
					accent('ride', 105 + state.intent.energy * 75)
				}
				if (stepInBar >= state.stepsPerBar - 3)
				{
					accent(['tomFloorLow', 'tomFloorHigh', 'tomMidHigh'][stepInBar - (state.stepsPerBar - 3)], 130 + state.intent.tension * 80)
				}
				break

			case 'snare-roll':
				scalePart('kick', 0.82)
				scalePart('hat', 0.68)
				scalePart('clap', 0.6)
				if (!state.intent.muteSnare)
				{
					accent('snare', 80 + techniqueProgress * 175)
				}
				break

			case 'breakdown': {
				const halfBar = Math.max(1, Math.floor(state.stepsPerBar / 2))
				const quarterBar = Math.max(1, Math.floor(state.stepsPerBar / 4))
				for (const lane of Object.keys(parts))
				{
					if (!SOUND_LANES.has(lane) || !Number.isFinite(parts[lane])) continue
					const keep = lane === 'kick' ? stepInBar % halfBar === 0 :
						(lane === 'snare' || lane === 'clap') ? stepInBar === quarterBar || stepInBar === quarterBar * 3 :
						lane === 'hat' ? stepInBar % quarterBar === 0 : false
					parts[lane] = keep ? clampVelocity(parts[lane] * 0.72) : 0
				}
				break
			}

			case 'drop':
				if (state.step === state.techniqueStartedAtStep)
				{
					accent('kick', 255)
					accent('snare', 230)
					accent('hat', 205)
					accent('crash', 255)
				}
				break
		}

		return parts
	}

	const next = (context={}) => {
		if (Number.isFinite(context.bpm) && context.bpm > 0)
		{
			state.bpm = context.bpm
			state.tempoLocked = true
		}
		maybeEstimateTempo(context.triggerAt)

		state.step++
		const phraseLengthValue = phraseLength()
		const stepInPhrase = wrap(state.step, phraseLengthValue)
		if (stepInPhrase === 0 || state.needsPhrase || activeLanes.some(lane => !state.current[lane]))
		{
			choosePhrase()
		}
		state.bar = Math.floor(state.step / state.stepsPerBar)

		const tempo = currentTempoProfile()
		const parts = {}
		const stepInBar = wrap(state.step, state.stepsPerBar)
		if (stepInBar === 0) state.subHitsRemaining = 8
		parts.offsets = feel.offsets[stepInBar]
		parts.laneDelays = feel.delays
		parts.quarterDuration = 60 / (state.bpm > 0 ? state.bpm : 120)
		const sixteenth = stepInBar / grid.stepsPerBeat * 4
		parts.swingOffset = feel.swingable && Number.isInteger(sixteenth) && sixteenth % 2 === 1
			? Math.min(0.45, Math.max(0, context.swing ?? 0)) * parts.quarterDuration / 4 : 0
		for (const lane of activeLanes)
		{
			const cell = state.current[lane]
			const velocity = cell?.sequence?.[wrap(state.step, cell.length)] ?? 0
			parts[lane] = transformVelocity(lane, velocity, stepInPhrase, tempo, phraseLengthValue)
		}

		// Closed hats choke the shared voice; an occasional offbeat open hat is
		// allowed to ring only until the following closed hit.
		parts.hatOpen = feel.openHats !== false && parts.hat > 0 && !isStrong(state.step) &&
			random() < 0.12 + state.intent.tension * 0.28

		// Cowbell is sparse phrase colour. It appears more as energy/tension rise,
		// avoiding the relentless four-on-the-floor cowbell cliché.
		const cowbellStep = state.step % 8 === 5 || state.step % 16 === 11
		const cowbellChance = 0.025 + state.intent.energy * 0.08 + state.intent.tension * 0.1
		parts.cowbell = !selectedGroove && cowbellStep && random() < cowbellChance
			? clampVelocity(90 + state.intent.energy * 105 + random() * 35)
			: 0

		// Restrict phrase colours to the selected style's vocabulary.
		if (options.percussionColours !== false && feel.colours.length)
		{
			// A colour replaces an existing weak stroke on a phrase response bar.
			// It never layers another voice onto the genre's canonical rhythm.
			if (state.bar % 4 === 3 && parts.snare > 0 && !protectedLanes.has('snare') && stepInBar === Math.round(grid.stepsPerBeat * 3)) {
				const colour = feel.colours[state.phrase % feel.colours.length]
				if (!parts[colour] && !selectedGroove?.[colour]) {
					parts[colour] = parts.snare
					parts.snare = 0
				}
			}
		}

		applyPerformanceTechnique(parts)

		const phraseEndWindow = phraseLengthValue - stepInPhrase <= fillWindowFor(tempo)
		const presetTiming = selectedGroove?.timing
		const presetSubdivisionStep = presetTiming &&
			wrap(state.step - (presetTiming.phase ?? 0), presetTiming.every ?? 4) === 0
		const nextStep = (stepInBar + 1) % state.stepsPerBar
		const nextSixteenth = nextStep / grid.stepsPerBeat * 4
		const nextSwing = feel.swingable && Number.isInteger(nextSixteenth) && nextSixteenth % 2 === 1
			? Math.min(0.45, Math.max(0, context.swing ?? 0)) * parts.quarterDuration / 4 : 0
		const hatInterval = stepDuration() + nextSwing - parts.swingOffset
			+ ((feel.offsets[nextStep].hat ?? 0) - (parts.offsets.hat ?? 0)) * parts.quarterDuration
			+ ((feel.offsets[nextStep].pulse ?? 0) - (parts.offsets.pulse ?? 0)) * parts.quarterDuration
		parts.events = state.rapidPercussion ? createDrumSubHits({
			inFill:presetSubdivisionStep || (!protectedLanes.size && state.step < state.fillUntilStep && phraseEndWindow),
			inRoll:!protectedLanes.size && state.step < state.rollUntilStep && phraseEndWindow,
			stepInPhrase,
			bpm:state.bpm,
			stepDuration:Math.max(stepDuration() * 0.2, hatInterval),
			maxEvents:Math.min(2, state.subHitsRemaining),
			intent:state.intent,
			style:presetSubdivisionStep ? presetTiming.style : 'auto',
			random
		}) : []
		state.subHitsRemaining -= parts.events.length

		state.lastParts = parts
		// Cache the static bar and patch the previous/current live cells in place.
		for (const [count, cached] of beatSequenceCache) {
			const first = Math.floor(state.step / count) * count
			if (cached.firstStep !== first) { beatSequenceCache.delete(count); continue }
			const previous = state.step - 1 - first
			if (previous >= 0) cached.sequence[previous] = cached.base[previous]
			cached.sequence[state.step - first] = parts
		}
		return parts
	}

	const getBeatSequence = (count=state.stepsPerBar) => {
		const beatCount = Math.max(1, Math.floor(count))
		const cached = beatSequenceCache.get(beatCount)
		if (cached) return cached.sequence

		const firstStep = Math.floor(Math.max(0, state.step) / beatCount) * beatCount
		const sequence = Array.from({ length:beatCount }, (_, index) => {
			const step = firstStep + index
			const beat = Object.fromEntries(activeLanes.map(lane => {
				const cell = state.current[lane]
				const velocity = cell?.sequence?.[wrap(step, cell.length)] ?? 0
				return [lane, shouldKeepMutedHit(lane, step, velocity, state.intent, grid.stepsPerBeat) ? velocity : 0]
			}))
			return beat
		})
		const base = sequence.slice()
		if (state.step >= firstStep && state.step < firstStep + beatCount) sequence[state.step - firstStep] = state.lastParts
		beatSequenceCache.set(beatCount, {firstStep, sequence, base})
		return sequence
	}

	return {
		next,
		getStep: () => state.step,
		getStepsPerBar: () => state.stepsPerBar,
		getStepDuration:stepDuration,
		getStepProgress: (audioTime, lastStepAt) => Math.min(1, Math.max(0, (audioTime - lastStepAt) / stepDuration())),
		skipSteps: count => {
			state.step += Math.max(0, Math.floor(count))
			state.needsPhrase = true
			state.lastParts = {}
			beatSequenceCache.clear()
		},
		getActiveLanes: () => exposedActiveLanes,
		getBeatSequence,
		getBPM: () => state.bpm,
		getIntent: () => ({ ...state.intent }),
		getPerformancePreset: () => state.performancePreset,
		getPerformanceTechnique: () => state.performanceTechnique,
		setRapidPercussion: enabled => {
			state.rapidPercussion = enabled === true
			beatSequenceCache.clear()
		},
		setPerformanceControl: enabled => {
			state.performanceControl = enabled !== false
			state.activityReserve = 0
			state.lastPersonUpdateAt = null
			beatSequenceCache.clear()
		},
		setPerformancePreset: preset => {
			state.performancePreset = PERFORMANCE_PRESET_IDS.has(preset) ? preset : 'auto'
			const technique = setPerformanceTechnique(state.performancePreset === 'auto' ? 'steady' : state.performancePreset)
			beatSequenceCache.clear()
			return technique
		},
		setTempo: bpm => {
			if (Number.isFinite(bpm) && bpm > 0)
			{
				state.bpm = bpm
				state.tempoLocked = true
			}
		},
		setMutedParts: (mutes={}) => {
			if (state.intent.muteKick === !!mutes.kick && state.intent.muteSnare === !!mutes.snare &&
				state.intent.muteHat === !!mutes.hat && state.intent.muteClap === !!mutes.clap) return
			state.intent.muteKick = !!mutes.kick
			state.intent.muteSnare = !!mutes.snare
			state.intent.muteHat = !!mutes.hat
			state.intent.muteClap = !!mutes.clap
			beatSequenceCache.clear()
		},
		updatePerson: (person={}, updateAt=performance.now() / 1000) => {
			if (!state.performanceControl)
			{
				return
			}
			const velocity = Number.isFinite(person.noteVelocity) ? person.noteVelocity : person.velocity
			const inputActivity = Number.isFinite(velocity) ? clamp(velocity) : state.lastActivity
			const elapsed = state.lastPersonUpdateAt === null ? 0 : Math.max(0, updateAt - state.lastPersonUpdateAt)
			state.lastPersonUpdateAt = updateAt
			// Only sustained energetic playing earns a tail. Use elapsed seconds
			// so its duration is independent of tempo and input update frequency.
			const reserveTarget = clamp((inputActivity - 0.45) / 0.55)
			const releaseSeconds = state.activityReserve * 3
			const activity = state.activityReserve > 0.02
				? Math.max(inputActivity, state.intent.energy * Math.exp(-elapsed / releaseSeconds))
				: inputActivity
			const reserveSeconds = reserveTarget > state.activityReserve ? 2 : 4
			state.activityReserve += (reserveTarget - state.activityReserve) * (1 - Math.exp(-elapsed / reserveSeconds))
			const tension = clamp(Math.abs(person.pitchBend ?? person.bend ?? 0))
			const previousActivity = state.intent.energy
			state.intent = {
				...state.intent,
				energy: clamp(activity),
				density: clamp(0.25 + activity * 0.65),
				tension,
				fillChance: clamp(0.15 + activity * 0.6),
				rollChance: clamp(0.08 + activity * 0.45)
			}

			if (state.performancePreset === 'auto')
			{
				const techniqueAge = state.step - state.techniqueStartedAtStep
				if (activity <= 0.18)
				{
					setPerformanceTechnique('breakdown')
				}else if (previousActivity <= 0.3 && activity >= 0.72){
					setPerformanceTechnique('drop')
				}else if (tension >= 0.72 && activity >= 0.5){
					setPerformanceTechnique('snare-roll')
				}else if (tension >= 0.36){
					setPerformanceTechnique('bridge')
				}else if (
					activity > previousActivity + 0.06 ||
					(state.performanceTechnique === 'crescendo' && techniqueAge < state.stepsPerBar)
				){
					setPerformanceTechnique('crescendo')
				}else{
					setPerformanceTechnique('steady')
				}
			}
			state.lastActivity = inputActivity
		},
		setIntent: intent => {
			state.intent = { ...state.intent, ...intent }
			beatSequenceCache.clear()
		},
		requestFill: (amount=1) => {
			if (amount > 0)
			{
				state.fillUntilStep = state.step + phraseLength()
			}
		}
	}
}
