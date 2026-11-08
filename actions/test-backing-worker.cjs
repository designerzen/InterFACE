// Browser smoke fixture: tests the real production worker with tiny synthetic
// weights, without requiring Google's checkpoint host or camera access.
const http=require('node:http')
const fs=require('node:fs')
const path=require('node:path')
const tf=require('@tensorflow/tfjs')
const root=path.resolve(__dirname,'../releases/web')
const vendor=path.resolve(__dirname,'../static/magenta')

;(async()=>{
	await tf.setBackend('cpu')
	const tensors={
		'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel':tf.randomNormal([83,32],0,0.1,'float32',42),
		'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias':tf.zeros([32]),
		'fully_connected/weights':tf.randomNormal([8,38],0,0.1,'float32',42),
		'fully_connected/biases':tf.zeros([38])
	}
	const {data,specs}=await tf.io.encodeWeights(tensors)
	tf.dispose(tensors)
	const worker=fs.readdirSync(root).filter(name=>/^backing-melody\.worker\..*\.js$/.test(name)).sort((a,b)=>fs.statSync(path.join(root,b)).mtimeMs-fs.statSync(path.join(root,a)).mtimeMs)[0]
	if(!worker)throw new Error('Build the web target before testing the worker')
	const config={type:'MusicRNN',dataConverter:{type:'MelodyConverter',args:{minPitch:48,maxPitch:83}},chordEncoder:'PitchChordEncoder'}
	const html=`<!doctype html><html><head><title>Backing melody worker check</title></head><body><h1>Backing melody worker check</h1><p>Uses synthetic weights to check runtime compatibility, not musical quality.</p><button id="run">Run worker check</button><output id="result">Ready</output><script>
	const result=document.getElementById('result');
	document.getElementById('run').onclick=()=>{
		result.textContent='Loading worker…';
		const worker=new Worker('/${worker}');
		worker.onerror=event=>{result.textContent='FAILED: '+event.message;worker.terminate()};
		worker.onmessage=({data})=>{
			if(data.error){result.textContent='FAILED: '+data.error;worker.terminate();return}
			if(data.id===1){result.textContent='Generating…';worker.postMessage({id:2,type:'generate',seed:{notes:[{pitch:60,quantizedStartStep:0,quantizedEndStep:4}],quantizationInfo:{stepsPerQuarter:4},totalQuantizedSteps:16},chord:'C'})}
			else{result.textContent=data.sequence?.totalQuantizedSteps===16?'PASS: worker generated '+data.sequence.notes.length+' notes across 16 steps':'FAILED: invalid generated sequence';worker.terminate()}
		};
		worker.postMessage({id:1,type:'initialize',checkpoint:location.origin+'/fixture'});
	};</script></body></html>`
	const server=http.createServer((req,res)=>{
		const url=new URL(req.url,'http://localhost'), pathname=decodeURIComponent(url.pathname)
		if(pathname==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
		if(pathname==='/fixture/config.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(config));return}
		if(pathname==='/fixture/weights_manifest.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify([{paths:['weights.bin'],weights:specs}]));return}
		if(pathname==='/fixture/weights.bin'){res.end(Buffer.from(data));return}
		const directory=pathname.startsWith('/magenta/')?vendor:root
		const file=path.resolve(directory,pathname.startsWith('/magenta/')?pathname.slice(9):pathname.slice(1))
		if(!file.startsWith(directory+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
		res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'application/octet-stream');fs.createReadStream(file).pipe(res)
	})
	server.listen(919,'127.0.0.1',()=>console.log('Worker check: http://127.0.0.1:919'))
})().catch(error=>{console.error(error);process.exitCode=1})
