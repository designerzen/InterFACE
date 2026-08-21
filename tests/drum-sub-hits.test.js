import { applyDrumSubHitEnvelope, createDrumArranger, createDrumSubHits } from '../source/timing/drum-arranger.js'

const intent = { energy:0.9, density:0.9, tension:0.8 }

describe('drum fill subdivisions', () => {
	test('creates exact hat sextuplets without snare roll events', () => {
		const events = createDrumSubHits({ inFill:true, inRoll:false, stepInPhrase:2, bpm:120, intent, random:() => 0.5 })
		const snares = events.filter(event => event.lane === 'snare')
		const hats = events.filter(event => event.lane === 'hat')

		expect(snares).toHaveLength(0)
		expect(hats).toHaveLength(5)
		expect(hats[0].offset).toBeCloseTo(0.5 / 6)
		expect(hats[4].offset).toBeCloseTo(0.5 * 5 / 6)
	})

	test('creates up to 32nd-note density in high-energy straight fills', () => {
		const events = createDrumSubHits({ inFill:true, inRoll:false, stepInPhrase:3, bpm:120, intent, random:() => 0.5 })
		const hats = events.filter(event => event.lane === 'hat')

		expect(hats).toHaveLength(7)
		expect(hats[0].offset).toBeCloseTo(0.5 / 8)
		expect(hats[6].offset).toBeCloseTo(0.5 * 7 / 8)
		expect(Math.max(...events.map(event => event.velocity))).toBeLessThan(90)
		expect(events.reduce((total, event) => total + event.velocity, 0)).toBeLessThan(700)
	})

	test('shortens dense voices to prevent overlapping full-length envelopes', () => {
		const [event] = createDrumSubHits({ inFill:true, inRoll:false, stepInPhrase:3, bpm:120, intent, random:() => 0.5 })
		const envelope = applyDrumSubHitEnvelope({ length:0.4, attack:0.01, decay:0.2, release:0.15 }, event)

		expect(envelope.length).toBeLessThan(0.15)
		expect(envelope.decay).toBeLessThan(envelope.length)
		expect(envelope.release).toBeLessThan(envelope.length)
	})

	test('named timing grooves schedule their subdivisions without requesting a fill', () => {
		const arranger = createDrumArranger({ groove:'garage-triplets', bpm:120, seed:'timed-preset', rapidPercussion:true })
		arranger.next({ bpm:120 })
		arranger.next({ bpm:120 })
		const parts = arranger.next({ bpm:120 })

		expect(parts.events.filter(event => event.lane === 'snare')).toHaveLength(0)
		expect(parts.events.filter(event => event.lane === 'hat')).toHaveLength(2)
	})

	test('keeps rapid percussion subdivisions disabled by default', () => {
		const arranger = createDrumArranger({ groove:'garage-triplets', bpm:120, seed:'timed-preset' })
		arranger.next({ bpm:120 })
		arranger.next({ bpm:120 })
		const parts = arranger.next({ bpm:120 })

		expect(parts.events).toEqual([])
	})

	test('can enable rapid percussion subdivisions while playing', () => {
		const arranger = createDrumArranger({ groove:'garage-triplets', bpm:120, seed:'timed-preset' })
		arranger.setRapidPercussion(true)
		arranger.next({ bpm:120 })
		arranger.next({ bpm:120 })
		const enabledParts = arranger.next({ bpm:120 })
		arranger.setRapidPercussion(false)
		const disabledParts = arranger.next({ bpm:120 })

		expect(enabledParts.events).toHaveLength(2)
		expect(disabledParts.events).toEqual([])
	})

	test('lets performance shape percussion by default', () => {
		const arranger = createDrumArranger({ seed:'performance-default' })
		arranger.updatePerson({ noteVelocity:0.8, pitchBend:0.25 })
		const updatedIntent = arranger.getIntent()

		expect(updatedIntent.energy).toBeCloseTo(0.8)
		expect(updatedIntent.density).toBeCloseTo(0.77)
		expect(updatedIntent.tension).toBeCloseTo(0.25)
	})

	test('can stop performance from changing percussion intent', () => {
		const arranger = createDrumArranger({ seed:'performance-disabled', performanceControl:false })
		const initialIntent = arranger.getIntent()
		arranger.updatePerson({ noteVelocity:0.95, pitchBend:0.8 })

		expect(arranger.getIntent()).toEqual(initialIntent)
		arranger.setPerformanceControl(true)
		arranger.updatePerson({ noteVelocity:0.95, pitchBend:0.8 })
		expect(arranger.getIntent()).not.toEqual(initialIntent)
	})

	test('never creates snare subdivisions for fills or rolls', () => {
		for (const mode of [
			{ inFill:true, inRoll:false, style:'triplet' },
			{ inFill:true, inRoll:false, style:'sextuplet' },
			{ inFill:true, inRoll:false, style:'rapid' },
			{ inFill:false, inRoll:true, style:'auto' }
		]) {
			const events = createDrumSubHits({ ...mode, stepInPhrase:3, bpm:120, intent, random:() => 0.5 })
			expect(events.every(event => event.lane === 'hat')).toBe(true)
		}
	})

	test('plays named auxiliary lanes as deterministic arranger parts', () => {
		const arranger = createDrumArranger({ groove:'cha-cha', seed:'cha-cha-test', bpm:112 })
		const phrase = Array.from({ length:16 }, () => arranger.next({ bpm:112 }))

		expect(phrase.some(parts => parts.congaLow > 0)).toBe(true)
		expect(phrase.some(parts => parts.bongoHigh > 0)).toBe(true)
		expect(phrase.some(parts => parts.triangleMute > 0)).toBe(true)
		expect(phrase.some(parts => parts.triangleOpen > 0)).toBe(true)
	})

	test('orchestrates recognisable GM colours across ordinary grooves', () => {
		const arranger = createDrumArranger({
			groove:'amen', seed:'gm-colours', bpm:120, phraseBars:2, stepsPerBar:16,
		})
		const heard = new Set()
		for (let step = 0; step < 128; step++) {
			const parts = arranger.next({ triggerAt:step / 8, bpm:120 })
			for (const [part, velocity] of Object.entries(parts)) {
				if (Number.isFinite(velocity) && velocity > 0) heard.add(part)
			}
		}

		expect([...heard]).toEqual(expect.arrayContaining([
			'crash', 'crash2', 'ride', 'ride2', 'rideBell',
			'rimshot', 'claves', 'fingerSnap', 'snareElectric', 'hatPedal',
			'tomFloorLow', 'tomFloorHigh', 'tomMidHigh', 'vibraslap', 'jingleBell',
		]))
	})

	test('exposes a full bar of upcoming percussion for the beat display', () => {
		const arranger = createDrumArranger({ groove:'cha-cha', seed:'beat-display', bpm:112, stepsPerBar:16 })
		arranger.next({ bpm:112 })
		const beats = arranger.getBeatSequence()

		expect(arranger.getStepsPerBar()).toBe(16)
		expect(arranger.getActiveLanes()).toEqual(expect.arrayContaining(['kick', 'snare', 'hat', 'congaLow', 'cowbell']))
		expect(beats).toHaveLength(16)
		expect(arranger.getBeatSequence(48)).toHaveLength(48)
		expect(beats.some(beat => beat.kick > 0)).toBe(true)
		expect(beats.some(beat => beat.congaLow > 0)).toBe(true)
		expect(beats.some(beat => beat.triangleMute > 0 || beat.triangleOpen > 0)).toBe(true)
	})
})
