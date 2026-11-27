import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

const assertSafeFileName = (name: string) => {
	if (typeof name !== 'string' || !name || name.includes('/') || name.includes('\\') || name.includes('..')) {
		throw new Error(`Invalid storage file name: ${String(name)}`)
	}
}

class NodeSyncAccessHandle {
	private fd: number
	private closed = false

	constructor(filePath: string) {
		this.fd = fs.openSync(filePath, 'a+')
	}

	getSize(): number {
		return fs.fstatSync(this.fd).size
	}

	write(buffer: ArrayBufferView | ArrayBuffer, options?: { at?: number }): number {
		const view = ArrayBuffer.isView(buffer)
			? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
			: new Uint8Array(buffer)
		const position = options?.at ?? this.getSize()
		return fs.writeSync(this.fd, view, 0, view.byteLength, position)
	}

	read(buffer: ArrayBufferView | ArrayBuffer, options?: { at?: number }): number {
		const view = ArrayBuffer.isView(buffer)
			? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
			: new Uint8Array(buffer)
		const position = options?.at ?? 0
		return fs.readSync(this.fd, view, 0, view.byteLength, position)
	}

	truncate(newSize: number): void {
		fs.ftruncateSync(this.fd, newSize)
	}

	flush(): void {
		if (!this.closed) fs.fsyncSync(this.fd)
	}

	close(): void {
		if (this.closed) return
		this.closed = true
		fs.closeSync(this.fd)
	}
}

const createReadableFile = async (filePath: string, name: string) => {
	const stat = await fsp.stat(filePath)
	const makeSlice = (start = 0, end = stat.size) => {
		const clampedStart = Math.max(0, Math.min(stat.size, start))
		const clampedEnd = Math.max(clampedStart, Math.min(stat.size, end))
		const length = clampedEnd - clampedStart
		return {
			size: length,
			type: '',
			async arrayBuffer() {
				if (length === 0) return new ArrayBuffer(0)
				const handle = await fsp.open(filePath, 'r')
				try {
					const out = Buffer.allocUnsafe(length)
					let offset = 0
					while (offset < length) {
						const { bytesRead } = await handle.read(out, offset, length - offset, clampedStart + offset)
						if (!bytesRead) break
						offset += bytesRead
					}
					return out.buffer.slice(out.byteOffset, out.byteOffset + offset)
				} finally {
					await handle.close()
				}
			},
			async text() {
				return new TextDecoder().decode(await this.arrayBuffer())
			},
			slice(nextStart = 0, nextEnd = length) {
				return makeSlice(clampedStart + nextStart, clampedStart + nextEnd)
			},
		}
	}

	return {
		name,
		...makeSlice(0, stat.size),
	}
}

/**
 * Node.js filesystem adapter implementing the OPFS FileSystemDirectoryHandle
 * subset required by `createSessionStore` in `source/storage/session-store.js`.
 */
export const createNodeDirectoryHandle = async (rootDir: string) => {
	await fsp.mkdir(rootDir, { recursive: true })

	return {
		async getFileHandle(name: string, options: { create?: boolean } = {}) {
			assertSafeFileName(name)
			const filePath = path.join(rootDir, name)
			const exists = fs.existsSync(filePath)
			if (!exists) {
				if (!options.create) {
					const error = new Error(`File not found: ${name}`)
					error.name = 'NotFoundError'
					throw error
				}
				const fh = await fsp.open(filePath, 'a')
				await fh.close()
			}

			return {
				name,
				async getFile() {
					return createReadableFile(filePath, name)
				},
				async createWritable() {
					const chunks: Uint8Array[] = []
					const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`
					return {
						async write(data: string | ArrayBuffer | ArrayBufferView | Blob) {
							if (typeof data === 'string') {
								chunks.push(new TextEncoder().encode(data))
							} else if (data instanceof Blob) {
								chunks.push(new Uint8Array(await data.arrayBuffer()))
							} else if (ArrayBuffer.isView(data)) {
								chunks.push(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))
							} else {
								chunks.push(new Uint8Array(data))
							}
						},
						async close() {
							await fsp.writeFile(tempPath, Buffer.concat(chunks.map(chunk => Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength))))
							await fsp.rename(tempPath, filePath)
						},
						async abort() {
							try { await fsp.unlink(tempPath) } catch {}
						},
					}
				},
				async createSyncAccessHandle() {
					return new NodeSyncAccessHandle(filePath)
				},
			}
		},

		async removeEntry(name: string) {
			assertSafeFileName(name)
			await fsp.unlink(path.join(rootDir, name))
		},

		async *entries(): AsyncGenerator<[string, { kind: 'file'; name: string }]> {
			const dirEntries = await fsp.readdir(rootDir, { withFileTypes: true })
			for (const entry of dirEntries) {
				if (entry.isFile() && !entry.name.includes('.tmp-')) {
					yield [entry.name, { kind: 'file', name: entry.name }]
				}
			}
		},
	}
}
