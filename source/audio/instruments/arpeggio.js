import { getArpeggioTiming } from '../../timing/arpeggio.js'

export const ARPEGGIO_VARIATION = 'arpeggio'
export const HARP_ARPEGGIO_VARIATION = 'harp'

const VARIATIONS = Object.freeze({
	[ARPEGGIO_VARIATION]:Object.freeze({ octaveSpan:1, clockStep:0 }),
	[HARP_ARPEGGIO_VARIATION]:Object.freeze({ octaveSpan:4, clockStep:3 })
})

export default class Arpeggio {
	enabled = false
	variation = ARPEGGIO_VARIATION
	config = VARIATIONS[ARPEGGIO_VARIATION]

	configure(value=false){
		if (!value || value === 'chord')
		{
			this.enabled = false
			return this.config
		}

		const variation = typeof value === 'string' ? value : value.variation ?? ARPEGGIO_VARIATION
		this.variation = VARIATIONS[variation] ? variation : ARPEGGIO_VARIATION
		const baseConfig = VARIATIONS[this.variation]
		this.config = typeof value === 'object' ? Object.freeze({
			octaveSpan:Number.isInteger(value.octaveSpan) && value.octaveSpan > 0 ? value.octaveSpan : baseConfig.octaveSpan,
			clockStep:Number.isInteger(value.clockStep) && value.clockStep >= 0 ? value.clockStep : baseConfig.clockStep
		}) : baseConfig
		this.enabled = true
		return this.config
	}

	getSequence(chordArray=[]){
		const sequence = []
		for (let octave=0; octave<this.config.octaveSpan; ++octave)
		{
			const octaveOffset = octave * 12
			chordArray.forEach(chord => {
				const noteNumber = chord?.noteNumber + octaveOffset
				if (Number.isFinite(noteNumber) && noteNumber <= 127)
				{
					sequence.push({ ...chord, noteNumber })
				}
			})
		}
		return sequence
	}

	getTiming(bpm, options={}){
		return getArpeggioTiming(bpm, { ...options, clockStep:this.config.clockStep })
	}
}
