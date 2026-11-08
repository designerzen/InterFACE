import { readFileSync } from 'fs'

jest.mock('../source/audio/instruments/instrument.sample.js', () => ({__esModule:true,default:class {}}))
jest.mock('../source/audio/sound-font-instruments', () => ({
	getGeneralMIDIInstrumentNames:() => [], getGeneralMIDIInstrumentFolders:() => [], createInstruments:() => ({}), INSTRUMENT_PACKS:['test']
}))
const SoundFontInstrument = require('../source/audio/instruments/instrument.soundfont.js').default

test('SoundFont app reverb can be disabled, adjusted, and returned to each instrument preset', () => {
	const voice = Object.create(SoundFontInstrument.prototype)
	voice.context = {currentTime:0}
	voice.activePresetData = {reverb:{mix:0.2,duration:2,decay:3}}
	voice.dryGainNode = {gain:{value:0}}
	voice.reverbGainNode = {gain:{value:0}}
	voice.reverbNode = {}
	voice.createReverbImpulse = jest.fn(() => ({room:true}))
	voice.setEngineReverb({reverbMode:'off'})
	expect(voice.dryGainNode.gain.value).toBe(1)
	expect(voice.reverbGainNode.gain.value).toBe(0)
	voice.setEngineReverb({reverbMode:'custom',reverbMix:0.35,reverbDuration:1,reverbDecay:2})
	expect(voice.reverbGainNode.gain.value).toBe(0.35)
	expect(voice.dryGainNode.gain.value).toBe(0.65)
	voice.setEngineReverb({reverbMode:'preset'})
	expect(voice.reverbGainNode.gain.value).toBe(0.2)
	expect(voice.createReverbImpulse).toHaveBeenLastCalledWith(voice.activePresetData.reverb)
})

test('shared audio routes engines to the analyser and mixer without app reverb', () => {
	const source = readFileSync('source/audio/audio.js','utf8')
	const expression = source.match(/return recordableOutput = (chain\( \[[\s\S]*?\], audioContext \))/)[1]
	const analyser = {}, mixer = {}, reverb = {}, context = {}
	const chain = jest.fn(routes => routes[0])
	const input = new Function('chain','analyser','mixer','reverb','audioContext',`return ${expression}`)(chain,analyser,mixer,reverb,context)
	expect(input).toBe(analyser)
	expect(chain).toHaveBeenCalledWith([analyser,mixer],context)
})
