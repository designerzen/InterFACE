const assert=require('node:assert/strict')
const http=require('node:http')
const fs=require('node:fs')
const path=require('node:path')
const esbuild=require('esbuild')
const root=path.resolve(__dirname,'..')
// The existing HarmonEasy comparison supplies the browser and reference test.
const {chromium}=require(require.resolve('playwright',{paths:[root,path.resolve(root,'../harmoneasy/packages/control-surface')]}))
let origin,browser
const plugins=[{name:'parcel-assets',setup(build){
	build.onResolve({filter:/^(url:|worklet:)/},args=>({path:path.resolve(args.resolveDir,args.path.replace(/^(url:|worklet:)/,'')),namespace:'asset-url'}))
	build.onLoad({filter:/.*/,namespace:'asset-url'},args=>({contents:`export default ${JSON.stringify('/'+path.relative(root,args.path).replaceAll('\\','/'))}`,loader:'js'}))
	build.onLoad({filter:/\.js$/},args=>{
		if(!args.path.startsWith(path.join(root,'source')))return
		return {contents:fs.readFileSync(args.path,'utf8').replaceAll('import.meta.url',JSON.stringify(origin+'/'+path.relative(root,args.path).replaceAll('\\','/'))),loader:'js'}
	})
}}]
const bundle=entry=>esbuild.build({entryPoints:[entry],bundle:true,write:false,format:'esm',platform:'browser',plugins,loader:{'.png':'dataurl','.jpg':'dataurl','.svg':'dataurl','.mp3':'dataurl','.wav':'dataurl'}})
const server=http.createServer(async(req,res)=>{
	try {
		const pathname=decodeURIComponent(new URL(req.url,origin).pathname)
		res.setHeader('Cross-Origin-Opener-Policy','same-origin')
		res.setHeader('Cross-Origin-Embedder-Policy','require-corp')
		if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Engine audio regression</title>');return}
		let file=path.resolve(root,'.'+pathname)
		if(!file.startsWith(root+path.sep))throw Error('Invalid path')
		if(!fs.existsSync(file))file=path.join(root,'static',pathname)
		if(!fs.existsSync(file))file=path.join(root,'releases/web',pathname)
		if(!fs.existsSync(file)){res.writeHead(404);res.end(pathname);return}
		if(file.startsWith(path.join(root,'source'))||file===path.join(__dirname,'engine-level-check.js')){
			if(file.endsWith('.js')){res.setHeader('Content-Type','text/javascript');res.end((await bundle(file)).outputFiles[0].contents);return}
		}
		const type={'.js':'text/javascript','.wasm':'application/wasm','.json':'application/json','.zip':'application/zip'}[path.extname(file)]??'application/octet-stream'
		res.setHeader('Content-Type',type);fs.createReadStream(file).pipe(res)
	} catch(error){console.error(error);res.writeHead(500);res.end(String(error))}
})
;(async()=>{
	await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
	origin=`http://127.0.0.1:${server.address().port}`
	try {
		browser=await chromium.launch({headless:true,channel:'chrome',executablePath:process.env.SURFACE_BROWSER_EXECUTABLE,args:['--autoplay-policy=no-user-gesture-required']})
		const page=await browser.newPage()
		page.on('console',message=>{if(/^(Measuring|Result)/.test(message.text()))console.log(message.text())})
		page.on('pageerror',error=>console.error(error.message))
		page.on('requestfailed',req=>console.error('Request failed:',req.url(),req.failure()?.errorText))
		await page.goto(origin)
		// --programs=<engine>[:first-last] measures a range, keeping SoundFont memory bounded.
		const [programEngine,range]=process.argv.find(argument=>argument.startsWith('--programs='))?.slice(11).split(':') ?? []
		if(programEngine){
			const [first,last]=range ? range.split('-').map(Number) : [0,127]
			const programs=Array.from({length:last-first+1},(_,index)=>first+index)
			console.log(JSON.stringify(await page.evaluate(async ([engine,programs])=>{
				const {measureEnginePrograms}=await import('/actions/engine-level-check.js')
				return await measureEnginePrograms(engine,programs)
			},[programEngine,programs])))
			return
		}
		const raw=process.argv.includes('--raw')
		const results=await page.evaluate(async raw=>{
			const {measureEngines}=await import('/actions/engine-level-check.js')
			return await measureEngines(raw)
		},raw)
		console.log(JSON.stringify(results,null,2))
		if(!raw){
			for(const result of results){assert.ok(result.rms>0.01,`${result.engine} is too quiet`);assert.ok(result.peak<1,`${result.engine} clips`)}
			const levels=results.map(result=>result.rms)
			assert.ok(Math.max(...levels)/Math.min(...levels)<10**(4/20),'Engine output levels differ by more than 4 dB')
		}
	} finally {await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1})
