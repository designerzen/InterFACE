import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const require = createRequire(import.meta.url)
const threeRoot = path.dirname(path.dirname(require.resolve('three')))
export const importMap = { imports: {
  'three': '/three/build/three.webgpu.js',
  'three/webgpu': '/three/build/three.webgpu.js',
  'three/tsl': '/three/build/three.tsl.js'
} }

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      const isThree = pathname.startsWith('/three/')
      const base = isThree ? threeRoot : root
      const relative = isThree ? pathname.slice(7) : pathname === '/' ? 'examples/index.html' : pathname.slice(1)
      const filename = path.resolve(base, relative)
      if (!filename.startsWith(path.resolve(base) + path.sep)) {
        response.writeHead(403).end()
        return
      }
      let body = await readFile(filename)
      if (filename.endsWith('.html')) body = body.toString().replace('IMPORT_MAP', JSON.stringify(importMap))
      response.setHeader('Content-Type', filename.endsWith('.html') ? 'text/html' : filename.endsWith('.json') ? 'application/json' : 'text/javascript')
      response.end(body)
    } catch {
      response.writeHead(404).end('Not found')
    }
  })
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  createServer().listen(8096, '127.0.0.1', () => console.log('Looking Glass demo: http://127.0.0.1:8096'))
}
