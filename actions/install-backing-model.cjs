// Copy an existing local checkpoint, or explicitly download it once for bundling.
const fs=require('node:fs/promises')
const path=require('node:path')
const {fileURLToPath,pathToFileURL}=require('node:url')

const destination=path.resolve(__dirname,'../static/magenta/checkpoints/chord_pitches_improv')
const official='https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv/'
// Public copy used by IMAGINARY's https://www.muski.io/melody demo.
const mirror='https://static.muski.io/checkpoints/chord_pitches_improv/'

const shardPath=value=>{
	if(typeof value!=='string'||!value||value.includes('\\')||value.includes('%')||value.includes('?')||value.includes('#')||value.split('/').some(part=>!part||part==='.'||part==='..')||/^[a-z]+:/i.test(value))throw new Error('Invalid checkpoint shard path')
	return value
}
const manifestFiles=manifest=>{
	if(!Array.isArray(manifest)||!manifest.length)throw new Error('Invalid checkpoint manifest')
	return [...new Set(manifest.flatMap(group=>{
		if(!Array.isArray(group.paths)||!Array.isArray(group.weights))throw new Error('Invalid checkpoint weights')
		return group.paths.map(shardPath)
	}))]
}
const complete=async destination=>{
	try{
		const config=JSON.parse(await fs.readFile(path.join(destination,'config.json'),'utf8'))
		if(config.type!=='MusicRNN'||config.chordEncoder!=='PitchChordEncoder')return false
		const manifest=JSON.parse(await fs.readFile(path.join(destination,'weights_manifest.json'),'utf8'))
		for(const file of manifestFiles(manifest))if(!(await fs.stat(path.join(destination,file))).size)return false
		return true
	}catch{return false}
}

const download=async (source,fetcher)=>{
	const read=async file=>{
		const url=new URL(file,source)
		if(url.protocol==='file:')return fs.readFile(fileURLToPath(url))
		const response=await fetcher(url,{signal:AbortSignal.timeout(60000)})
		if(!response.ok)throw new Error(`Checkpoint unavailable (HTTP ${response.status}) from ${source.href}`)
		return Buffer.from(await response.arrayBuffer())
	}
	const configBytes=await read('config.json'), config=JSON.parse(configBytes)
	if(config.type!=='MusicRNN'||config.chordEncoder!=='PitchChordEncoder')throw new Error('Expected the chord-conditioned ImprovRNN checkpoint')
	const manifestBytes=await read('weights_manifest.json'), manifest=JSON.parse(manifestBytes)
	const files=[]
	for(const file of manifestFiles(manifest)){
		const data=await read(file)
		if(!data.length)throw new Error(`Empty checkpoint shard: ${file}`)
		files.push({file,data})
	}
	return {configBytes,manifestBytes,files}
}

const installBackingModel=async ({input,directory=destination,fetcher=fetch,log=console.log}={})=>{
	if(!input && await complete(directory)){log('Local backing model already installed');return}
	const sources=input
		?[new URL(/^https?:\/\//.test(input)?(input.endsWith('/')?input:input+'/'):pathToFileURL(path.resolve(input)+path.sep).href)]
		:[new URL(official),new URL(mirror)]
	let checkpoint
	for(let i=0;i<sources.length;i++){
		try{checkpoint=await download(sources[i],fetcher);break}
		catch(error){
			if(i===sources.length-1)throw error
			log(`${error.message}. Trying IMAGINARY's MUSKI mirror…`)
		}
	}
	const {configBytes,manifestBytes,files}=checkpoint
	// Fetch every file before changing the installed checkpoint. Config is last
	// so an interrupted first install cannot appear ready to the runtime.
	await fs.mkdir(directory,{recursive:true})
	for(const {file,data} of files){const target=path.join(directory,file);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,data)}
	await fs.writeFile(path.join(directory,'weights_manifest.json'),manifestBytes)
	await fs.writeFile(path.join(directory,'config.json'),configBytes)
	log(`Installed local backing model: ${directory}`)
}

module.exports={installBackingModel}
if(require.main===module)installBackingModel({input:process.argv[2]}).catch(error=>{console.error(error.message);process.exitCode=1})
