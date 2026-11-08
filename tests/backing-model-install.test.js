import fs from 'node:fs/promises'
import path from 'node:path'
import { installBackingModel } from '../actions/install-backing-model.cjs'

let temporary,directory
const config={type:'MusicRNN',chordEncoder:'PitchChordEncoder'}
const manifest=[{paths:['group1-shard1of1'],weights:[{name:'test',shape:[1],dtype:'float32'}]}]
const assets={'config.json':JSON.stringify(config),'weights_manifest.json':JSON.stringify(manifest),'group1-shard1of1':Buffer.from([0,0,0,0])}
const response=value=>({ok:true,arrayBuffer:async()=>Buffer.from(value)})
beforeEach(async()=>{temporary=await fs.mkdtemp(path.resolve(__dirname,'../.backing-install-test-'));directory=path.join(temporary,'installed')})
afterEach(async()=>{
	if(!temporary.startsWith(path.resolve(__dirname,'..')+path.sep))throw new Error('Test cleanup path outside workspace')
	await fs.rm(temporary,{recursive:true,force:true})
})

test('installer falls back to the public MUSKI copy when Google rejects the download',async()=>{
	const fetcher=jest.fn(async url=>url.hostname==='storage.googleapis.com'?{ok:false,status:403}:response(assets[path.posix.basename(url.pathname)]))
	await installBackingModel({directory,fetcher,log:()=>{}})
	expect(fetcher.mock.calls.map(([url])=>url.hostname)).toEqual(['storage.googleapis.com','static.muski.io','static.muski.io','static.muski.io'])
	expect(JSON.parse(await fs.readFile(path.join(directory,'config.json'),'utf8'))).toEqual(config)
	expect(await fs.readFile(path.join(directory,'group1-shard1of1'))).toEqual(Buffer.from([0,0,0,0]))
})

test('an installed local checkpoint never triggers a network request',async()=>{
	await fs.mkdir(directory)
	for(const [file,data] of Object.entries(assets))await fs.writeFile(path.join(directory,file),data)
	const fetcher=jest.fn()
	await installBackingModel({directory,fetcher,log:()=>{}})
	expect(fetcher).not.toHaveBeenCalled()
})

test('explicit local source copies the checkpoint without network access',async()=>{
	const source=path.join(temporary,'source');await fs.mkdir(source)
	for(const [file,data] of Object.entries(assets))await fs.writeFile(path.join(source,file),data)
	const fetcher=jest.fn()
	await installBackingModel({input:source,directory,fetcher,log:()=>{}})
	expect(fetcher).not.toHaveBeenCalled()
	expect(await fs.readFile(path.join(directory,'weights_manifest.json'),'utf8')).toBe(JSON.stringify(manifest))
})

test('failed shard download does not leave a partially installed model',async()=>{
	const fetcher=jest.fn(async url=>url.pathname.endsWith('group1-shard1of1')?{ok:false,status:503}:response(assets[path.posix.basename(url.pathname)]))
	await expect(installBackingModel({input:'https://models.test/improv',directory,fetcher,log:()=>{}})).rejects.toThrow('HTTP 503')
	await expect(fs.stat(directory)).rejects.toMatchObject({code:'ENOENT'})
	expect(fetcher.mock.calls.every(([url])=>url.hostname==='models.test')).toBe(true)
})
