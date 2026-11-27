import { spawn } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'

const ROOT = process.cwd()
const PORT = 303
const DEV_URL = `http://localhost:${PORT}/app.html`
const DIST_RENDERER = path.join(ROOT, 'dist-electron', 'main')
const RENDERER_ENTRY = path.join(DIST_RENDERER, 'app.html')
const IS_WIN = process.platform === 'win32'

const MIME_TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.cjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.wasm': 'application/wasm',
	'.task': 'application/octet-stream',
	'.tflite': 'application/octet-stream',
	'.bin': 'application/octet-stream',
	'.glb': 'model/gltf-binary',
	'.fbx': 'application/octet-stream',
	'.zip': 'application/zip',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.mp3': 'audio/mpeg',
	'.ogg': 'audio/ogg',
	'.wav': 'audio/wav',
	'.webm': 'video/webm',
	'.mp4': 'video/mp4',
	'.webmanifest': 'application/manifest+json',
}

const ensureStaticAssets = () => {
	const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
	const entries = Array.isArray(pkg.staticFiles) ? pkg.staticFiles : []
	fs.mkdirSync(DIST_RENDERER, { recursive: true })

	for (const entry of entries) {
		const src = path.resolve(ROOT, entry.staticPath)
		if (!fs.existsSync(src)) continue
		const stat = fs.statSync(src)
		if (entry.staticOutPath) {
			const outRaw = path.join(DIST_RENDERER, entry.staticOutPath)
			const dest = stat.isFile() && entry.staticOutPath.endsWith('/')
				? path.join(outRaw, path.basename(src))
				: outRaw
			if (fs.existsSync(dest)) continue
			fs.mkdirSync(path.dirname(dest), { recursive: true })
			if (stat.isDirectory()) {
				try {
					fs.symlinkSync(src, dest, IS_WIN ? 'junction' : 'dir')
				} catch {
					fs.cpSync(src, dest, { recursive: true })
				}
			} else {
				fs.copyFileSync(src, dest)
			}
		} else if (stat.isDirectory()) {
			for (const child of fs.readdirSync(src)) {
				const childSrc = path.join(src, child)
				const childDest = path.join(DIST_RENDERER, child)
				if (fs.existsSync(childDest)) continue
				const childStat = fs.statSync(childSrc)
				if (childStat.isDirectory()) {
					try {
						fs.symlinkSync(childSrc, childDest, IS_WIN ? 'junction' : 'dir')
					} catch {
						fs.cpSync(childSrc, childDest, { recursive: true })
					}
				} else {
					fs.copyFileSync(childSrc, childDest)
				}
			}
		}
	}
}

const spawnPnpm = (args) => IS_WIN
	? spawn('cmd.exe', ['/d', '/s', '/c', `pnpm ${args.join(' ')}`], { cwd: ROOT, stdio: 'inherit' })
	: spawn('pnpm', args, { cwd: ROOT, stdio: 'inherit' })

const runSyncStep = (args) => new Promise((resolve, reject) => {
	const child = spawnPnpm(args)
	child.on('exit', code => code === 0 ? resolve() : reject(new Error(`pnpm ${args.join(' ')} exited with code ${code}`)))
	child.on('error', reject)
})

const startStaticServer = () => new Promise((resolve, reject) => {
	const rootResolved = path.resolve(DIST_RENDERER)
	const server = http.createServer(async (req, res) => {
		try {
			const parsed = new URL(req.url || '/', `http://localhost:${PORT}`)
			const rel = decodeURIComponent(parsed.pathname).replace(/^\/+/, '') || 'app.html'
			const candidate = path.resolve(rootResolved, rel)
			if (candidate !== rootResolved && !candidate.startsWith(rootResolved + path.sep)) {
				res.writeHead(403)
				res.end('Forbidden')
				return
			}
			const stat = await fsp.stat(candidate).catch(() => null)
			if (!stat || !stat.isFile()) {
				res.writeHead(404)
				res.end('Not Found')
				return
			}
			const ext = path.extname(candidate).toLowerCase()
			res.writeHead(200, {
				'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream',
				'Cache-Control': 'no-cache',
			})
			fs.createReadStream(candidate).pipe(res)
		} catch (error) {
			res.writeHead(500)
			res.end(String(error?.message ?? error))
		}
	})
	server.once('error', reject)
	server.listen(PORT, '127.0.0.1', () => resolve(server))
})

const main = async () => {
	await runSyncStep(['run', 'electron:compile'])

	if (!fs.existsSync(RENDERER_ENTRY) || process.argv.includes('--rebuild-renderer')) {
		console.log('[electron:dev] Building renderer bundle into dist-electron/main ...')
		await runSyncStep(['run', 'electron:renderer'])
	}

	ensureStaticAssets()

	const server = await startStaticServer()
	console.log(`[electron:dev] Serving dist-electron/main at ${DEV_URL}`)

	const cleanup = () => {
		try { server.close() } catch {}
	}
	process.on('SIGINT', () => { cleanup(); process.exit(0) })
	process.on('SIGTERM', () => { cleanup(); process.exit(0) })

	const env = { ...process.env }
	delete env.ELECTRON_RUN_AS_NODE

	const electronBin = path.join(
		ROOT,
		'node_modules',
		'electron',
		'dist',
		IS_WIN ? 'electron.exe' : process.platform === 'darwin' ? 'Electron.app/Contents/MacOS/Electron' : 'electron',
	)

	const electron = spawn(electronBin, ['--inspect=9229', '--enable-logging', 'dist-electron/electron/main.js'], {
		cwd: ROOT,
		env,
		stdio: 'inherit',
	})

	electron.on('exit', code => {
		cleanup()
		process.exit(code ?? 0)
	})
}

main().catch(error => {
	console.error('[electron:dev] Failed:', error)
	process.exit(1)
})
