import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import vm from 'node:vm'

const script=readFileSync(resolve(__dirname,'../source/audio/backing-melody.worker.js'),'utf8')
const harness=(response={ok:true,json:async()=>({type:'MusicRNN'})})=>{
	const fetch=jest.fn(async()=>response),postMessage=jest.fn(),imports=jest.fn()
	const self={location:{href:'https://photosynth.test/app/backing.worker.js'},postMessage,tf:{setBackend:jest.fn(async()=>{}),ready:jest.fn(async()=>{})},music_rnn:{MusicRNN:class{async initialize(){} }}}
	vm.runInNewContext(script,{self,URL,fetch,importScripts:imports})
	return {self,fetch,postMessage,imports}
}

test('default worker loads only local runtime bundles and local checkpoint files',async()=>{
	const h=harness();await h.self.onmessage({data:{id:1,type:'initialize'}})
	expect(h.fetch).toHaveBeenCalledWith('https://photosynth.test/app/magenta/checkpoints/chord_pitches_improv/config.json')
	expect(h.imports).toHaveBeenCalledWith('https://photosynth.test/app/magenta/tfjs-4.22.0.min.js','https://photosynth.test/app/magenta/music_rnn-1.23.1.js')
	expect(h.postMessage).toHaveBeenCalledWith({id:1,sequence:undefined})
})

test('missing local weights report installation instructions without contacting a remote host',async()=>{
	const h=harness({ok:false,status:404});await h.self.onmessage({data:{id:1,type:'initialize'}})
	expect(h.fetch).toHaveBeenCalledTimes(1)
	expect(h.postMessage).toHaveBeenCalledWith(expect.objectContaining({error:expect.stringContaining('Local backing model is missing')}))
})

test('a different host is used only when explicitly configured',async()=>{
	const h=harness();await h.self.onmessage({data:{id:1,type:'initialize',checkpoint:'https://models.test/improv'}})
	expect(h.fetch).toHaveBeenCalledWith('https://models.test/improv/config.json')
})
