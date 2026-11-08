import VoiceEngineHost from '../source/audio/voice-engine-host.js'
import { getYoshimiPatches, resolveVoiceProgram } from '../source/audio/voice-patches.js'
import { readFileSync } from 'fs'

const handle = () => ({rememberPatch:jest.fn(), restorePatch:jest.fn(), allSoundOff:jest.fn(async () => {})})

test('engine settings survive switches and failed updates preserve the previous settings', async () => {
	const configurations = []
	const host = new VoiceEngineHost({}, {settings:'{"fm":{"pitchBendRange":7}}', createBackend:async id => ({
		attach:async () => {}, destroy:async () => {},
		configure:async settings => { configurations.push([id,{...settings}]); if (settings.reverbSpace === 'broken') throw Error('missing impulse') }
	})})
	await host.ensure()
	await host.setSettings({reverbMode:'custom',reverbMix:0.4})
	await host.select('fm')
	expect(configurations.at(-1)).toEqual(['fm',expect.objectContaining({pitchBendRange:7})])
	await host.select('native')
	expect(configurations.at(-1)[1]).toMatchObject({reverbMode:'custom',reverbMix:0.4})
	await expect(host.setSettings({reverbSpace:'broken'})).rejects.toThrow('missing impulse')
	expect(host.settings.native.reverbSpace).toBe('synthetic')
	expect(configurations.at(-1)[1].reverbSpace).toBe('synthetic')
})

test('the shared room follows every engine while other settings stay per engine', async () => {
	const host = new VoiceEngineHost({}, {createBackend:async () => ({attach:async () => {}, destroy:async () => {}, configure:async () => {}})})
	await host.ensure()
	await host.setSettings({roomSpace:'church',roomMix:0.3,reverbMix:0.4})
	expect(host.settings.fm).toMatchObject({roomSpace:'church',roomMix:0.3,reverbMix:0.15})
	expect(host.settings.yoshimi).toMatchObject({roomSpace:'church',roomMix:0.3,reverbMix:0.05})
})

test('settings finish before a switch tears down their backend', async () => {
	const events = []
	const host = new VoiceEngineHost({}, {createBackend:async id => ({
		attach:async () => {}, destroy:async () => {events.push(`stop:${id}`)},
		configure:async settings => {if (settings.reverbMode === 'off') events.push('reverb off')}
	})})
	await host.ensure()
	await Promise.all([host.setSettings({reverbMode:'off'}),host.select('fm')])
	expect(events).toEqual(['reverb off','stop:native'])
})

test('switches every handle while allowing only one live backend', async () => {
	let live = 0, peak = 0
	const backends = []
	const createBackend = jest.fn(async id => {
		live++; peak = Math.max(peak, live)
		const backend = {id,attach:jest.fn(async () => {}),detach:jest.fn(async () => {}),destroy:jest.fn(async () => { live-- })}
		backends.push(backend)
		return backend
	})
	const host = new VoiceEngineHost({}, {createBackend})
	const a = handle(), b = handle()
	await Promise.all([host.add(a), host.add(b)])
	expect(createBackend).toHaveBeenCalledTimes(1)
	await host.select('fm')
	expect(peak).toBe(1)
	expect(backends[0].destroy).toHaveBeenCalledTimes(1)
	expect(backends[1].attach.mock.calls).toEqual([[a],[b]])
	await host.remove(a)
	expect(backends[1].destroy).not.toHaveBeenCalled()
	expect(host.handles.has(b)).toBe(true)
	await host.destroy()
	expect(live).toBe(0)
})

test('failed loading tears down the replacement and restores all handles', async () => {
	const created = []
	const host = new VoiceEngineHost({}, {createBackend:async id => {
		const backend = {id, attach:jest.fn(async () => { if (id === 'yoshimi') throw Error('patch failed') }), destroy:jest.fn(async () => {})}
		created.push(backend)
		return backend
	}})
	const a = handle(), b = handle()
	await host.add(a); await host.add(b)
	await expect(host.select('yoshimi')).rejects.toThrow('patch failed')
	expect(host.engine).toBe('native')
	expect(created.map(backend => backend.id)).toEqual(['native','yoshimi','native'])
	expect(created[1].destroy).toHaveBeenCalledTimes(1)
	expect(created[2].attach.mock.calls).toEqual([[a],[b]])
	expect(host.switching).toBe(false)
})

test('queued switches are serialized and invalid engines cannot replace the renderer', async () => {
	const events = []
	const host = new VoiceEngineHost({}, {createBackend:async id => {
		events.push(`start:${id}`)
		return {attach:async () => {},destroy:async () => { events.push(`stop:${id}`) }}
	}})
	await host.ensure()
	await Promise.all([host.select('fm'),host.select('wam2')])
	expect(events).toEqual(['start:native','stop:native','start:fm','stop:fm','start:wam2'])
	await expect(host.select('unknown')).rejects.toThrow('Unknown voice engine')
	expect(host.engine).toBe('wam2')
})

test('finishes an in-flight patch load before disposing its engine', async () => {
	let release
	const events = []
	const host = new VoiceEngineHost({}, {createBackend:async id => ({attach:async () => {},destroy:async () => { events.push(`stop:${id}`) }})})
	await host.ensure()
	const patch = host.run(async () => { await new Promise(resolve => { release = resolve }); events.push('patch loaded') })
	await Promise.resolve()
	const switchEngine = host.select('fm')
	await Promise.resolve()
	expect(events).toEqual([])
	release()
	await Promise.all([patch,switchEngine])
	expect(events).toEqual(['patch loaded','stop:native'])
})

test('patch mappings preserve GM identity, exclude drum banks and prefer matching names', () => {
	const banks = JSON.parse(readFileSync('static/wam/banks/root.json','utf8'))
	expect(resolveVoiceProgram('acoustic_grand_piano-mp3')).toBe(0)
	expect(resolveVoiceProgram('Acoustic Grand Piano')).toBe(0)
	for (let program = 0; program < 128; program++) {
		const patches = getYoshimiPatches(banks, program)
		expect(patches.length).toBeGreaterThan(0)
		expect(patches.every(patch => patch.bank !== 'Drums')).toBe(true)
		for (const patch of patches) expect(() => readFileSync(`static/wam/banks/${patch.id}`)).not.toThrow()
	}
	expect(getYoshimiPatches(banks,73)[0].title.toLowerCase()).toContain('flute')
})

test('a switch settles the new backend once, after attaching every handle and before notes resume', async () => {
	const events = []
	const host = new VoiceEngineHost({}, {createBackend:async id => ({
		attach:async () => { events.push(`attach:${id}`) },
		settle:async () => { events.push(`settle:${id}:${host.switching}`) },
		destroy:async () => {}
	})})
	await Promise.all([host.add(handle()), host.add(handle())])
	// A handle added outside a switch settles before its first note.
	expect([...events].sort()).toEqual(['attach:native','attach:native','settle:native:false','settle:native:false'])
	await host.select('yoshimi')
	expect(events.filter(event => event.includes('yoshimi'))).toEqual(['attach:yoshimi','attach:yoshimi','settle:yoshimi:true'])
	expect(host.switching).toBe(false)
})
