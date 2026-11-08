import { FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'
import { FMVoice } from '../source/audio/instruments/fm-engine.js'

// Measure the loudest 100 ms across two seconds, so plucks and slow attacks
// are comparable without boosting their silence or changing their envelopes.
const sampleRate = 24000
const calibrate = process.argv.includes('--calibrate')
const results = FM_FACTORY_PRESETS.map(preset => {
	const patch = calibrate ? {...preset, levelTrim:1} : preset
	let rms = 0, peak = 0
	for (const note of [48,60,72]) {
		const voice = new FMVoice(patch,note,80/127,sampleRate)
		let energy = 0
		for (let frame=0; frame<sampleRate*2; frame++) {
			const value = voice.next()
			if (!Number.isFinite(value)) throw Error(`Non-finite audio: ${preset.name}`)
			energy += value*value
			peak = Math.max(peak,Math.abs(value))
			if (frame % 2400 === 2399) { rms = Math.max(rms,Math.sqrt(energy/2400)); energy = 0 }
		}
	}
	return {program:preset.program,name:preset.name,rms,peak,db:20*Math.log10(rms)}
})
if (calibrate) {
	console.log(JSON.stringify(results.map(({rms,peak}) => Number(Math.min(18,20*Math.log10(0.05/rms),20*Math.log10(0.3/peak)).toFixed(2)))))
} else {
	console.table(results.map(({program,name,db,peak}) => ({program,name,dBFS:db.toFixed(2),peak:peak.toFixed(4)})))
	const levels = results.map(result => result.db)
	console.log(`128 FM programs: ${(Math.max(...levels)-Math.min(...levels)).toFixed(2)} dB range; peak ${Math.max(...results.map(result => result.peak)).toFixed(4)}`)
	if (results.some(result => result.db < -32 || result.db > -25 || result.peak > 0.31)) process.exitCode = 1
}
