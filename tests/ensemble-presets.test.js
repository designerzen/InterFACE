const { presets } = require('../static/assets/ensemble-presets.json')

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
	test('assign the lead first and the bass second before supporting instruments', () => {
		for (const preset of presets)
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
})
