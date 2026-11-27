import path from 'node:path'

export const APP_PROTOCOL_SCHEME = 'photosynth'
export const APP_PROTOCOL_ORIGIN = `${APP_PROTOCOL_SCHEME}://app`

const MIME_TYPES: Record<string, string> = {
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

export const getMimeTypeForPath = (filePath: string): string => {
	const ext = path.extname(filePath).toLowerCase()
	return MIME_TYPES[ext] ?? 'application/octet-stream'
}

export const resolveSafeChildPath = (rootDir: string, requestPath: string): string | null => {
	let decoded: string
	try {
		decoded = decodeURIComponent(requestPath).replace(/^\/+/, '')
	} catch {
		return null
	}
	const resolvedRoot = path.resolve(rootDir)
	const candidate = path.resolve(resolvedRoot, decoded || 'app.html')
	if (candidate === resolvedRoot) return candidate
	if (!candidate.startsWith(resolvedRoot + path.sep)) return null
	return candidate
}
