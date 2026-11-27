import { net, protocol } from 'electron'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
	APP_PROTOCOL_ORIGIN,
	APP_PROTOCOL_SCHEME,
	getMimeTypeForPath,
	resolveSafeChildPath,
} from './protocol-utils.ts'

export { APP_PROTOCOL_ORIGIN, APP_PROTOCOL_SCHEME, getMimeTypeForPath, resolveSafeChildPath }

export const getAppProtocolSchemes = (): Electron.CustomScheme[] => [
	{
		scheme: APP_PROTOCOL_SCHEME,
		privileges: {
			standard: true,
			secure: true,
			supportFetchAPI: true,
			corsEnabled: true,
			stream: true,
		},
	},
]

const serveLocalFile = async (filePath: string): Promise<Response> => {
	const data = await fsp.readFile(filePath)
	return new Response(data, {
		status: 200,
		headers: {
			'Content-Type': getMimeTypeForPath(filePath),
			'Cache-Control': 'no-cache',
		},
	})
}

export interface AppProtocolOptions {
	rendererRoot: string
	staticRoot: string
	cacheRoot: string
	remoteFallbackOrigin?: string
}

export const registerAppProtocol = ({
	rendererRoot,
	staticRoot,
	cacheRoot,
	remoteFallbackOrigin = 'https://interface.place',
}: AppProtocolOptions) => {
	protocol.handle(APP_PROTOCOL_SCHEME, async request => {
		const url = new URL(request.url)
		const host = url.hostname

		if (host === 'app') {
			const primary = resolveSafeChildPath(rendererRoot, url.pathname)
			if (primary && fs.existsSync(primary) && fs.statSync(primary).isFile()) {
				return serveLocalFile(primary)
			}
			const fallbackStatic = resolveSafeChildPath(staticRoot, url.pathname)
			if (fallbackStatic && fs.existsSync(fallbackStatic) && fs.statSync(fallbackStatic).isFile()) {
				return serveLocalFile(fallbackStatic)
			}
			return new Response('Not Found', { status: 404 })
		}

		if (host === 'assets' || host === 'cache') {
			const bundled = resolveSafeChildPath(staticRoot, url.pathname)
			if (bundled && fs.existsSync(bundled) && fs.statSync(bundled).isFile()) {
				return serveLocalFile(bundled)
			}

			const cached = resolveSafeChildPath(cacheRoot, url.pathname)
			if (cached && fs.existsSync(cached) && fs.statSync(cached).isFile()) {
				return serveLocalFile(cached)
			}

			if (cached && remoteFallbackOrigin) {
				try {
					const upstreamUrl = new URL(url.pathname, remoteFallbackOrigin).href
					const response = await net.fetch(upstreamUrl)
					if (response.ok) {
						const buffer = Buffer.from(await response.arrayBuffer())
						await fsp.mkdir(path.dirname(cached), { recursive: true })
						await fsp.writeFile(cached, buffer)
						return new Response(buffer, {
							status: 200,
							headers: {
								'Content-Type': response.headers.get('content-type') ?? getMimeTypeForPath(cached),
								'X-PhotoSYNTH-Cache': 'MISS',
							},
						})
					}
					return new Response(null, { status: response.status })
				} catch {
					return new Response('Offline asset unavailable', { status: 503 })
				}
			}

			return new Response('Not Found', { status: 404 })
		}

		return net.fetch(pathToFileURL(rendererRoot).href)
	})
}
