import Instrument from '../source/audio/instruments/instrument.js'

test('engine instruments become ready without waiting for a rendered frame',async()=>{
	const frame=jest.spyOn(global,'requestAnimationFrame').mockImplementation(()=>1)
	try {
		const instrument=new Instrument({currentTime:0},{managedByVoiceEngine:true})
		await expect(instrument.loaded).resolves.toBe(instrument)
		expect(instrument.available).toBe(true)
		expect(frame).not.toHaveBeenCalled()
	}finally{frame.mockRestore()}
})

test('creation errors reject readiness even when animation frames are paused',async()=>{
	const frame=jest.spyOn(global,'requestAnimationFrame').mockImplementation(()=>1)
	class Broken extends Instrument { async create(){throw Error('Audio module failed')} }
	try {
		const instrument=new Broken({},{managedByVoiceEngine:true})
		await expect(instrument.loaded).rejects.toThrow('Audio module failed')
		expect(instrument.available).toBe(false)
		expect(frame).not.toHaveBeenCalled()
	}finally{frame.mockRestore()}
})

test('all-notes-off waits for active voices to finish stopping before teardown',async()=>{
	let release
	class Voice extends Instrument {
		async noteOff(note){await new Promise(resolve=>{release=resolve});return super.noteOff(note)}
	}
	const instrument=new Voice({},{managedByVoiceEngine:true})
	await instrument.loaded;await instrument.noteOn(60)
	let stopped=false
	const stop=instrument.allNotesOff().then(()=>{stopped=true})
	await Promise.resolve()
	expect(stopped).toBe(false)
	release();await stop
	expect(instrument.activeNotes.size).toBe(0)
})
