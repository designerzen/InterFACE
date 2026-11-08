import {createMidiVoiceBackend} from '../source/audio/voice-engines/midi.js'

jest.mock('@webaudiomodules/sdk',()=>({initializeWamHost:jest.fn(async()=>['host'])}))
jest.mock('../source/audio/voice-engines/import-module.js',()=>({importVoiceModule:jest.fn()}))
const {importVoiceModule}=require('../source/audio/voice-engines/import-module.js')
const node=()=>({connect:jest.fn(),disconnect:jest.fn(),gain:{value:1}})

test('three TinySynth controls use one plugin with separate MIDI parts and share one control frame',async()=>{
	const channels=Array.from({length:16},node)
	const plugin={audioNode:{...node(),numberOfInputs:0,scheduleEvents:jest.fn(),destroy:jest.fn(),synth:{chpan:channels,out:node(),setQuality:jest.fn()}}}
	const createInstance=jest.fn(async()=>plugin)
	importVoiceModule.mockResolvedValue({default:{createInstance}})
	let frame
	const raf=jest.spyOn(global,'requestAnimationFrame').mockImplementation(callback=>{frame=callback;return 1})
	const cancel=jest.spyOn(global,'cancelAnimationFrame').mockImplementation(()=>{})
	const context={currentTime:0,createGain:node}, destination=node()
	let backend
	try {
		backend=await createMidiVoiceBackend('wam2',context,destination)
		const handles=Array.from({length:3},(_,index)=>({currentTime:0,program:index,patch:'gm',volume:1,options:{},output:node()}))
		await Promise.all(handles.map(handle=>backend.attach(handle)))
		expect(createInstance).toHaveBeenCalledTimes(1)
		expect(raf).toHaveBeenCalledTimes(1)
		plugin.audioNode.scheduleEvents.mockClear()
		for(const handle of handles)backend.noteOn(handle,60,0.8)
		expect(plugin.audioNode.scheduleEvents.mock.calls.map(([event])=>event.data.bytes)).toEqual([[0x90,60,102],[0x91,60,102],[0x92,60,102]])
		frame()
		expect(plugin.audioNode.scheduleEvents).toHaveBeenCalledTimes(3)
		await backend.detach(handles[1])
		expect(plugin.audioNode.destroy).not.toHaveBeenCalled()
		plugin.audioNode.scheduleEvents.mockClear()
		backend.noteOn(handles[2],64,1)
		expect(plugin.audioNode.scheduleEvents).toHaveBeenLastCalledWith(expect.objectContaining({data:{bytes:[0x92,64,127]}}))
		await backend.destroy();backend=null
		expect(plugin.audioNode.destroy).toHaveBeenCalledTimes(1)
		expect(cancel).toHaveBeenCalledTimes(1)
	}finally{await backend?.destroy();raf.mockRestore();cancel.mockRestore()}
})
