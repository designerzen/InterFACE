const { presets } = require('../static/assets/ensemble-presets.json')
const instruments = require('../source/audio/general-midi-instruments.json')
const { DRUM_STYLES } = require('../source/timing/drum-styles.js')
const { DRUM_GROOVES } = require('../source/timing/drum-patterns.js')
const { getPercussionPreset } = require('../source/audio/synthesizers/percussion-presets.js')
const { SCALE_INTERVAL_LIBRARY } = require('../source/audio/tuning/intervals.js')

const LEADS = Object.freeze({
	'four-choirs':'choir_aahs',
	'all-strings':{1:'cello', default:'violin'},
	'synth-pop':'lead_2_sawtooth',
	'brass-band':'trumpet',
	'dream-pads':'pad_2_warm',
	orchestra:{1:'violin', default:'flute'},
	'rock-band':'overdriven_guitar',
	ambient:'pad_2_warm',
	samba:'steel_drums',
	techno:{1:'synth_bass_2', default:'lead_1_square'},
	jungle:{1:'synth_bass_1', default:'lead_4_chiff'},
	'sound-fx':'fx_4_atmosphere',
	'hip-hop':{1:'electric_piano_1', 2:'electric_piano_1', default:'lead_6_voice'},
	reggae:'drawbar_organ',
	'jazz-club':{1:'electric_piano_2', 2:'electric_piano_2', default:'muted_trumpet'},
	chiptune:'lead_1_square',
	'k-pop':'lead_6_voice',
	'outer-space':'fx_8_scifi',
	spooky:'church_organ',
	disco:'clavinet',
	cyberpunk:'lead_8_bass__lead',
	medieval:'dulcimer',
	underwater:'blown_bottle',
	'cartoon-chase':'xylophone'
})

const BASS_INSTRUMENTS = new Set([
	'acoustic_bass',
	'cello',
	'contrabass',
	'electric_bass_finger',
	'electric_bass_pick',
	'synth_bass_1',
	'synth_bass_2',
	'tuba'
])

describe('ensemble presets', () => {
	test('original ensembles retain their lead and bass assignments', () => {
		for (const preset of presets.filter(preset => LEADS[preset.id]))
		{
			for (const [quantity, instruments] of Object.entries(preset.voicings))
			{
				const configuredLead = LEADS[preset.id]
				const expectedLead = typeof configuredLead === 'string' ?
					configuredLead :
					configuredLead[quantity] ?? configuredLead.default

				expect(instruments[0]).toBe(expectedLead)

				if (instruments.length > 1)
				{
					const bass = instruments.find(instrument => BASS_INSTRUMENTS.has(instrument))
					if (bass)
					{
						expect(instruments[1]).toBe(bass)
					}
				}
			}
		}
	})

	test('adds one complete ensemble for every requested timing style', () => {
		const genres=presets.filter(preset=>preset.style)
		expect(genres.map(preset=>preset.style)).toEqual(DRUM_STYLES.map(style=>style.id))
		expect(genres).toHaveLength(46)
		expect(presets).toHaveLength(70)
		expect(new Set(presets.map(preset=>preset.id)).size).toBe(presets.length)
	})

	test.each(presets.filter(preset=>preset.style).map(preset=>[preset.title,preset]))('%s has usable instruments, harmony and its matching timing', (_,preset) => {
		const available=new Set(instruments.map(instrument=>instrument.location.replace(/-mp3$/,'')))
		for(const count of [1,2,3,4]) {
			const voices=preset.voicings[count]
			expect(voices).toHaveLength(count)
			expect(voices).toEqual(preset.voicings[4].slice(0,count))
			for(const voice of voices)expect(available.has(voice)).toBe(true)
			if(count>1)expect(BASS_INSTRUMENTS.has(voices[1])).toBe(true)
		}
		expect(preset.tempo.bpm).toBeGreaterThanOrEqual(40)
		expect(preset.tempo.bpm).toBeLessThanOrEqual(240)
		expect(preset.tempo.swing).toBeGreaterThanOrEqual(0)
		expect(preset.tempo.swing).toBeLessThanOrEqual(0.45)
		expect(preset.harmony.key).toMatch(/^[A-G](?:b|#)?$/)
		expect(SCALE_INTERVAL_LIBRARY[preset.harmony.scale]).toBeDefined()
		const pattern=getPercussionPreset(preset.percussion.pattern)
		expect(pattern.groove).toBe(DRUM_STYLES.find(style=>style.id===preset.style).groove)
		expect(preset.percussion.meter).toEqual(DRUM_GROOVES[pattern.groove].meter)
		expect(getPercussionPreset(preset.percussion.sound)?.kit).toBeDefined()
		expect(preset.percussion.enabled).toBe(true)
	})

	test.each(['jazz','blues','irish-jig-inspired','gnawa-inspired','korean-folk-inspired','hip-hop'])('%s avoids adding clock swing over the encoded groove feel', style => {
		expect(presets.find(preset=>preset.style===style).tempo.swing).toBe(0)
	})
})
