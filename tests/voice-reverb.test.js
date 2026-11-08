import {createVoiceReverb} from '../source/audio/voice-engines/reverb.js'
import {normaliseEngineSettings} from '../source/audio/voice-engine-settings.js'
import {GENERAL_MIDI_INSTRUMENT_DATA} from '../source/audio/general-midi-instruments.data.js'
import {voiceEngineGain} from '../source/audio/voice-engine-levels.js'
import {presets as ENSEMBLE_PRESETS} from '../static/assets/ensemble-presets.json'
import {REVERB_SPACES, generateRoomImpulse, getReverbSpace, shapeImpulse} from '../source/audio/effects/reverb-spaces.js'

const node = () => ({connect:jest.fn(),disconnect:jest.fn(),gain:{value:1,setTargetAtTime:jest.fn(),cancelScheduledValues:jest.fn()}})
const audioBuffer = (channels,length,sampleRate=100) => {
	const data = Array.from({length:channels},() => new Float32Array(length))
	return {numberOfChannels:channels,length,sampleRate,duration:length/sampleRate,getChannelData:channel => data[channel]}
}
const context = () => ({sampleRate:100,currentTime:0,createGain:jest.fn(node),createConvolver:jest.fn(node),
	createBuffer:jest.fn((channels,length,rate) => audioBuffer(channels,length,rate))})

afterEach(() => jest.useRealTimers())

test.each(['native','fm','wam2','supersonic'])('%s output trim scales dry and wet together without changing player expression', async engine => {
	const ctx = context(), source = node(), person = {gainNode:node(),trimNode:node()}
	person.gainNode.gain.value = 0.4
	const handle = {options:{voicePerson:person},volume:0.5}
	const reverb = createVoiceReverb(ctx,source,node(),{wetDestination:node(),handle,engine})
	const settings = normaliseEngineSettings(engine,{outputGainDb:-6,reverbMode:'custom',reverbMix:0.2})
	await reverb.configure(settings,0)
	const [dry,expression,send] = ctx.createGain.mock.results.map(result => result.value)
	const level = voiceEngineGain(engine,{outputGainDb:-6})
	// a 20% mix adds reverb without thinning the dry voice
	expect(dry.gain.setTargetAtTime).toHaveBeenLastCalledWith(level,0,0.01)
	expect(expression.gain.value).toBeCloseTo(0.2*level)
	expect(send.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.2,0,0.01)
	person.gainNode.gain.value = 0
	reverb.sync()
	expect(expression.gain.value).toBe(0)
	await reverb.configure({...settings,outputGainDb:6,reverbMode:'off'},0)
	expect(dry.gain.setTargetAtTime).toHaveBeenLastCalledWith(voiceEngineGain(engine,{outputGainDb:6}),0,0.01)
	expect(handle.volume).toBe(0.5)
	reverb.destroy()
})

test('mix above half crossfades towards a fully wet signal', async () => {
	const ctx = context(), reverb = createVoiceReverb(ctx,node(),node(),{applyOutputGain:false})
	await reverb.configure(normaliseEngineSettings('fm',{reverbMode:'custom',reverbMix:0.75}),0)
	const [dry,expression,send] = ctx.createGain.mock.results.map(result => result.value)
	expect(dry.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.5,0,0.01)
	expect(expression.gain.setTargetAtTime).toHaveBeenLastCalledWith(1,0,0.01)
	expect(send.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.75,0,0.01)
	await reverb.configure(normaliseEngineSettings('fm',{reverbMode:'custom',reverbMix:1}),0)
	expect(dry.gain.setTargetAtTime).toHaveBeenLastCalledWith(0,0,0.01)
	reverb.destroy()
})

test('dry engine voices get reverb, with independent per-program bypass and shared impulses', async () => {
	jest.useFakeTimers()
	const ctx = context(), destination = node(), sourceA = node(), sourceB = node()
	const a = createVoiceReverb(ctx,sourceA,destination)
	const b = createVoiceReverb(ctx,sourceB,destination)
	const settings = normaliseEngineSettings('fm',{reverbMode:'custom',reverbMix:0.3})
	await a.configure(settings,0); await b.configure(settings,48)
	expect(ctx.createBuffer).toHaveBeenCalledTimes(1)
	expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
	const convolver = ctx.createConvolver.mock.results[0].value
	const wet = convolver.connect.mock.calls[0][0]
	expect(wet.gain.setTargetAtTime).toHaveBeenLastCalledWith(1,0,0.01)
	await a.configure({...settings,reverbDisabledPrograms:[0]},0)
	await b.configure({...settings,reverbDisabledPrograms:[0]},48)
	expect(sourceA.connect.mock.calls[0][0].gain.setTargetAtTime).toHaveBeenLastCalledWith(1,0,0.01)
	expect(sourceA.connect.mock.calls[1][0].connect.mock.calls[0][0].disconnect).toHaveBeenCalledWith(convolver)
	expect(convolver.disconnect).not.toHaveBeenCalled()
	expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
	await a.configure(settings,0)
	expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
	a.destroy(); b.destroy()
	// the shared return fades before it is released, so tails never click off
	expect(wet.gain.setTargetAtTime).toHaveBeenLastCalledWith(0,0,expect.any(Number))
	expect(convolver.disconnect).not.toHaveBeenCalled()
	jest.runAllTimers()
	expect(convolver.disconnect).toHaveBeenCalledTimes(1)
})

test('a space released and reacquired during its fade is reused', async () => {
	jest.useFakeTimers()
	const ctx = context(), destination = node(), settings = normaliseEngineSettings('fm',{reverbMode:'custom'})
	const a = createVoiceReverb(ctx,node(),destination)
	await a.configure(settings,0); a.destroy()
	const b = createVoiceReverb(ctx,node(),destination)
	await b.configure(settings,0)
	jest.runAllTimers()
	expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
	expect(ctx.createConvolver.mock.results[0].value.disconnect).not.toHaveBeenCalled()
	b.destroy()
})

test('the shared room layers over instrument reverb and survives instrument bypass', async () => {
	const ctx = context(), source = node(), reverb = createVoiceReverb(ctx,source,node(),{applyOutputGain:false})
	const settings = normaliseEngineSettings('fm',{reverbMode:'custom',reverbMix:0.2,roomSpace:'synthetic',roomMix:0.3,reverbLength:1})
	await reverb.configure(settings,0)
	const expression = source.connect.mock.calls[1][0]
	const [instrumentSend,roomSend] = expression.connect.mock.calls.map(call => call[0])
	expect(roomSend.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.3,0,0.01)
	// different impulses, so two shared returns
	expect(ctx.createConvolver).toHaveBeenCalledTimes(2)
	const [instrumentReturn,roomReturn] = ctx.createConvolver.mock.results.map(result => result.value)
	expect(instrumentSend.connect).toHaveBeenCalledWith(instrumentReturn)
	expect(roomSend.connect).toHaveBeenCalledWith(roomReturn)
	await reverb.configure({...settings,reverbDisabledPrograms:[0]},0)
	expect(instrumentSend.disconnect).toHaveBeenCalledWith(instrumentReturn)
	expect(roomSend.disconnect).not.toHaveBeenCalled()
	// the tap stays for the room send
	expect(source.disconnect).not.toHaveBeenCalledWith(expression)
	await reverb.configure({...settings,reverbDisabledPrograms:[0],roomMix:0},0)
	expect(roomSend.disconnect).toHaveBeenCalledWith(roomReturn)
	expect(source.disconnect).toHaveBeenCalledWith(expression)
	reverb.destroy()
})

test('players share one room return regardless of instrument', async () => {
	const ctx = context(), destination = node(), settings = normaliseEngineSettings('native',{reverbMode:'off',roomSpace:'synthetic',roomMix:0.25})
	const players = [createVoiceReverb(ctx,node(),destination), createVoiceReverb(ctx,node(),destination), createVoiceReverb(ctx,node(),destination)]
	await Promise.all(players.map((player,index) => player.configure(settings,index*8)))
	expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
	players.forEach(player => player.destroy())
})

test('invalid or duplicated instrument bypass entries are removed', () => {
	expect(normaliseEngineSettings('native',{reverbDisabledPrograms:[0,0,127,128,-1,'2',2.5]}).reverbDisabledPrograms).toEqual([0,127])
})

test('preset mode supplies a room for instruments without preset reverb', async () => {
	const ctx = context()
	const program = GENERAL_MIDI_INSTRUMENT_DATA.findIndex(instrument => !instrument.reverb)
	expect(program).toBeGreaterThanOrEqual(0)
	const source = node(), reverb = createVoiceReverb(ctx,source,node(),{applyOutputGain:false})
	await reverb.configure(normaliseEngineSettings('native'),program)
	const convolver = ctx.createConvolver.mock.results[0].value
	const send = source.connect.mock.calls[1][0].connect.mock.calls[0][0]
	expect(send.connect).toHaveBeenCalledWith(convolver)
	expect(send.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.15,0,0.01)
	await reverb.configure(normaliseEngineSettings('native',{reverbMode:'off'}),program)
	expect(send.disconnect).toHaveBeenCalledWith(convolver)
	reverb.destroy()
})

test('preset instruments use their family space and fall back to a synthetic room if it cannot load', async () => {
	const originalFetch = global.fetch, warn = jest.spyOn(console,'warn').mockImplementation(() => {})
	global.fetch = jest.fn(async () => ({ok:false,status:404}))
	try {
		const ctx = context(), program = GENERAL_MIDI_INSTRUMENT_DATA.findIndex(instrument => instrument.reverb?.space)
		const reverb = createVoiceReverb(ctx,node(),node())
		await reverb.configure(normaliseEngineSettings('native'),program)
		expect(global.fetch).toHaveBeenCalledWith(getReverbSpace(GENERAL_MIDI_INSTRUMENT_DATA[program].reverb.space).url)
		expect(ctx.createConvolver).toHaveBeenCalledTimes(1)
		reverb.destroy()
	} finally { global.fetch = originalFetch; warn.mockRestore() }
})

test('wet return bypasses the downstream mouth gate while its input follows expression', async () => {
	const ctx = context(), source = node(), mouthGate = node(), master = node()
	const person = {gainNode:node(),trimNode:node()}
	person.gainNode.gain.value = 0.4
	person.trimNode.gain.value = 0.5
	const handle = {options:{voicePerson:person},volume:0.8}
	const reverb = createVoiceReverb(ctx,source,mouthGate,{wetDestination:master,handle,applyOutputGain:false})
	await reverb.configure(normaliseEngineSettings('fm',{reverbMode:'custom'}),0)
	const [dry,expression,send,wet] = ctx.createGain.mock.results.map(result => result.value)
	expect(dry.connect).toHaveBeenCalledWith(mouthGate)
	expect(wet.connect).toHaveBeenCalledWith(master)
	expect(wet.connect).not.toHaveBeenCalledWith(mouthGate)
	expect(expression.gain.value).toBeCloseTo(0.16)
	expect(expression.connect).toHaveBeenCalledWith(send)
	expect(send.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.15,0,0.01)
	expect(send.connect).toHaveBeenCalledWith(ctx.createConvolver.mock.results[0].value)
	reverb.destroy()
})

test('disabled reverb allocates no convolver or impulse',async () => {
	const ctx = context(), reverb = createVoiceReverb(ctx,node(),node())
	await reverb.configure(normaliseEngineSettings('fm',{reverbMode:'off'}),0)
	expect(ctx.createConvolver).not.toHaveBeenCalled()
	expect(ctx.createBuffer).not.toHaveBeenCalled()
	expect(ctx.createGain).toHaveBeenCalledTimes(1)
	reverb.destroy()
})

test('different wet levels share one convolver per destination',async () => {
	const ctx = context(), destination = node(), settings = normaliseEngineSettings('fm',{reverbMode:'custom',reverbMix:0.2})
	const a = createVoiceReverb(ctx,node(),destination), b = createVoiceReverb(ctx,node(),destination), c = createVoiceReverb(ctx,node(),node())
	await a.configure(settings,0); await b.configure({...settings,reverbMix:0.4},0); await c.configure(settings,0)
	expect(ctx.createBuffer).toHaveBeenCalledTimes(1)
	expect(ctx.createConvolver).toHaveBeenCalledTimes(2)
	a.destroy(); b.destroy(); c.destroy()
})

test('late impulse loads cannot reconnect destroyed or reconfigured reverbs',async () => {
	const originalFetch = global.fetch
	let finish
	global.fetch = jest.fn(() => new Promise(resolve => {finish=resolve}))
	const ctx = context()
	ctx.decodeAudioData = jest.fn(async () => audioBuffer(2,100))
	try {
		const reverb = createVoiceReverb(ctx,node(),node())
		const pending = reverb.configure(normaliseEngineSettings('fm',{reverbMode:'custom',reverbSpace:'room.wav'}),0)
		await reverb.configure(normaliseEngineSettings('fm',{reverbMode:'off'}),0)
		reverb.destroy()
		finish({ok:true,arrayBuffer:async () => new ArrayBuffer(0)})
		await pending
		expect(ctx.createConvolver).not.toHaveBeenCalled()
	} finally {global.fetch=originalFetch}
})

test('Yoshimi defaults to a shorter, subtler added room than the other engines', () => {
	expect(normaliseEngineSettings('yoshimi')).toMatchObject({reverbMode:'preset',reverbMix:0.05,reverbLength:0.8})
	expect(normaliseEngineSettings('wam2')).toMatchObject({reverbMode:'preset',reverbMix:0.15,quality:1})
})

test('older impulse and duration settings carry over', () => {
	expect(normaliseEngineSettings('native',{reverbImpulse:'./a/hall.wav',reverbDuration:2.5})).toMatchObject({reverbSpace:'./a/hall.wav',reverbLength:2.5})
	expect(normaliseEngineSettings('native',{reverbImpulse:''})).toMatchObject({reverbSpace:'synthetic',reverbLength:1.8})
	expect(normaliseEngineSettings('native',{reverbSpace:'church'}).reverbLength).toBe(getReverbSpace('church').length)
})

test('every preset and ensemble space is in the catalogue', () => {
	const ids = new Set(REVERB_SPACES.map(space => space.id))
	for (const instrument of GENERAL_MIDI_INSTRUMENT_DATA) if (instrument.reverb) expect(ids.has(instrument.reverb.space)).toBe(true)
	for (const preset of ENSEMBLE_PRESETS) {
		expect(preset.reverb === false || (ids.has(preset.reverb?.space) && preset.reverb.mix > 0 && preset.reverb.mix <= 1)).toBe(true)
	}
})

test('the shared room defaults off', () => {
	expect(normaliseEngineSettings('native')).toMatchObject({roomSpace:'hall',roomMix:0})
	expect(normaliseEngineSettings('native',{roomMix:4}).roomMix).toBe(1)
})

describe('impulses', () => {
	const rms = (data, from, to) => Math.sqrt(data.slice(from,to).reduce((sum,value) => sum+value*value,0)/(to-from))
	const rate = 8000, ctx = {sampleRate:rate,createBuffer:(channels,length,sampleRate) => audioBuffer(channels,length,sampleRate)}

	test('generated rooms decay exponentially, start after the pre-delay and fade to silence', () => {
		const impulse = generateRoomImpulse(ctx,{length:1,preDelay:0.02})
		const left = impulse.getChannelData(0), right = impulse.getChannelData(1)
		expect(left.slice(0,160).every(value => value === 0)).toBe(true)
		// RT60: about 20 dB down by a third of the length
		const early = rms(left,400,800), late = rms(left,2800,3200)
		expect(20*Math.log10(early/late)).toBeGreaterThan(14)
		expect(Math.abs(left.at(-1))).toBeLessThan(1e-4)
		expect(left).not.toEqual(right)
		expect(generateRoomImpulse(ctx,{length:1}).getChannelData(0)).toEqual(generateRoomImpulse(ctx,{length:1}).getChannelData(0))
	})

	test('a darker tone removes more high-frequency energy', () => {
		const roughness = data => rms(data.map((value,index) => index ? value-data[index-1] : 0),200,4000)/rms(data,200,4000)
		const dark = generateRoomImpulse(ctx,{tone:-1}).getChannelData(0), bright = generateRoomImpulse(ctx,{tone:1}).getChannelData(0)
		expect(roughness(dark)).toBeLessThan(roughness(bright))
	})

	test('recorded impulses are trimmed with a fade, pre-delayed and made stereo', () => {
		const source = audioBuffer(1,rate*2,rate)
		source.getChannelData(0).fill(0.5)
		const shaped = shapeImpulse(ctx,source,{length:1,preDelay:0.01})
		expect(shaped.length).toBe(rate+80)
		expect(shaped.getChannelData(0)[79]).toBe(0)
		expect(shaped.getChannelData(1)[200]).toBeCloseTo(0.5)
		expect(Math.abs(shaped.getChannelData(1).at(-1))).toBeLessThan(1e-3)
	})
})
