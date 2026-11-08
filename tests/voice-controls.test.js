import {watchVoiceControls} from '../source/audio/voice-engines/controls.js'

test('one frame per context samples each person once and notifies only changes',() => {
	let frame, nextId=0
	const raf=jest.spyOn(global,'requestAnimationFrame').mockImplementation(callback=>{frame=callback;return ++nextId})
	const cancel=jest.spyOn(global,'cancelAnimationFrame').mockImplementation(()=>{})
	const gainRead=jest.fn(()=>0.5), panRead=jest.fn(()=>-0.2)
	const person={gainNode:{gain:{get value(){return gainRead()}}},stereoNode:{pan:{get value(){return panRead()}}}}
	const context={}, a=jest.fn(), b=jest.fn()
	const first=watchVoiceControls(context,{options:{voicePerson:person},volume:1},a)
	const second=watchVoiceControls(context,{options:{voicePerson:person},volume:0.5},b)
	try {
		expect(raf).toHaveBeenCalledTimes(1)
		gainRead.mockClear();panRead.mockClear()
		frame()
		expect(gainRead).toHaveBeenCalledTimes(1)
		expect(panRead).toHaveBeenCalledTimes(1)
		expect(a).toHaveBeenCalledTimes(1)
		expect(b).toHaveBeenCalledTimes(1)
		gainRead.mockReturnValue(0)
		frame()
		expect(a).toHaveBeenLastCalledWith(0,-0.2)
		expect(b).toHaveBeenLastCalledWith(0,-0.2)
		first.destroy()
		expect(cancel).not.toHaveBeenCalled()
		second.destroy()
		expect(cancel).toHaveBeenCalledTimes(1)
	}finally{first.destroy();second.destroy();raf.mockRestore();cancel.mockRestore()}
})

test('immediate sync observes volume changes and teardown prevents further writes',() => {
	const update=jest.fn(), handle={volume:1,options:{}}
	const watcher=watchVoiceControls({},handle,update)
	handle.volume=0.3;watcher.sync()
	expect(update).toHaveBeenLastCalledWith(0.3,0)
	watcher.sync();expect(update).toHaveBeenCalledTimes(2)
	watcher.sync(true);expect(update).toHaveBeenCalledTimes(3)
	watcher.destroy();handle.volume=1;watcher.sync()
	expect(update).toHaveBeenCalledTimes(3)
})
