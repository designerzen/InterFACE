// Render the real control markup and styles without camera or audio startup.
const http=require('node:http')
const fs=require('node:fs')
const path=require('node:path')
const pug=require('pug')
const sass=require('sass')
const esbuild=require('esbuild')
const root=path.resolve(__dirname,'..')

;(async()=>{
	const css=sass.compile(path.join(root,'source/index.scss'),{logger:sass.Logger.silent}).css
	const script=await esbuild.build({stdin:{contents:`
		import {setupControlsList} from './source/dom/controls-list.js';
		import {setupEngineInterface} from './source/dom/ui.engine.js';
		import {normaliseEngineSettings} from './source/audio/voice-engine-settings.js';
		// Match the visible state applied by the app's startup animation.
		document.querySelectorAll('.controls').forEach(control=>control.style.opacity='1');
		setupControlsList();
		const host={engine:'native',settings:{},setSettings:async changes=>Object.assign(host.settings[host.engine],changes)};
		for(const engine of ['native','fm','yoshimi','wam2','supersonic'])host.settings[engine]=normaliseEngineSettings(engine);
		const engine=setupEngineInterface({getHost:()=>host,getEngine:()=>host.engine,onChanged:()=>{}});
		document.getElementById('select-voice-engine').onchange=event=>{host.engine=event.target.value;engine.refresh()};
	`,resolveDir:root,sourcefile:'control-layout-check.js'},bundle:true,write:false,format:'iife'})
	const markup=pug.renderFile(path.join(root,'source/partials/control-panel.pug'))
	const html=`<!doctype html><html class="loaded user-active beginner solo flag-showSettings theme-default"><head><meta charset="utf-8"><title>PhotoSYNTH controls</title><link rel="stylesheet" href="/layout.css"></head><body>${markup}<script src="/layout.js"></script></body></html>`
	http.createServer((req,res)=>{
		const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
		if(pathname==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
		if(pathname==='/layout.css'){res.setHeader('Content-Type','text/css');res.end(css);return}
		if(pathname==='/layout.js'){res.setHeader('Content-Type','text/javascript');res.end(script.outputFiles[0].contents);return}
		const file=path.resolve(root,pathname.startsWith('/assets/')?'source'+pathname:pathname.slice(1))
		if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
		res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');fs.createReadStream(file).pipe(res)
	}).listen(919,'127.0.0.1',()=>console.log('Control layout check: http://localhost:919'))
})().catch(error=>{console.error(error);process.exitCode=1})
