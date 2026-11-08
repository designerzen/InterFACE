const modules = new Map()
let counter = 0

// Preserve the original module URL so relative imports in third-party WAMs work.
// A separate callback per import avoids the legacy loader's global-name races.
export const importVoiceModule = url => {
	if (!modules.has(url)) {
		const pending = new Promise((resolve, reject) => {
			const script = document.createElement('script')
			const key = `__photosynthVoiceModule${counter++}`
			const cleanup = () => { clearTimeout(timeout); delete globalThis[key]; script.remove() }
			const timeout = setTimeout(() => { cleanup(); reject(Error(`Engine module timed out: ${url}`)) }, 30000)
			globalThis[key] = module => { cleanup(); resolve(module) }
			script.type = 'module'
			script.textContent = `import * as module from ${JSON.stringify(url)}; globalThis[${JSON.stringify(key)}]?.(module);`
			script.onerror = () => { cleanup(); reject(Error(`Could not load engine module: ${url}`)) }
			document.head.append(script)
		})
		modules.set(url, pending)
		pending.catch(() => modules.delete(url))
	}
	return modules.get(url)
}
