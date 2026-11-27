import { createRequire } from 'node:module'

export interface SerialPortInfo {
	path: string
	vendorId: number | null
	productId: number | null
	manufacturer?: string
	serialNumber?: string
}

export interface SerialFilter {
	usbVendorId?: number
	usbProductId?: number
	vendorId?: number
	productId?: number
}

const PICADE_USB_IDS = [
	{ vendorId: 0x2e8a, productId: 0x1098 },
	{ vendorId: 0xcafe, productId: 0x400d },
]

const parseHexId = (value: unknown): number | null => {
	if (typeof value === 'number' && Number.isInteger(value)) return value
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number.parseInt(value.replace(/^0x/i, ''), 16)
		return Number.isNaN(parsed) ? null : parsed
	}
	return null
}

export const matchesSerialFilters = (
	info: SerialPortInfo,
	filters: SerialFilter[] = PICADE_USB_IDS,
): boolean => {
	if (!filters.length) return true
	return filters.some(filter => {
		const vid = filter.usbVendorId ?? filter.vendorId
		const pid = filter.usbProductId ?? filter.productId
		if (vid != null && info.vendorId !== vid) return false
		if (pid != null && info.productId !== pid) return false
		return true
	})
}

export const loadSerialPortModule = (): any | null => {
	try {
		const req = createRequire(import.meta.url || __filename)
		return req('serialport')
	} catch {
		return null
	}
}

export class NativeSerialManager {
	private serialportModule: any
	private openPorts = new Map<string, any>()

	constructor(serialportModule: any = loadSerialPortModule()) {
		this.serialportModule = serialportModule
	}

	get available(): boolean {
		return Boolean(this.serialportModule?.SerialPort)
	}

	async listPorts(filters: SerialFilter[] = PICADE_USB_IDS): Promise<SerialPortInfo[]> {
		if (!this.available) return []
		const rawPorts = await this.serialportModule.SerialPort.list()
		const normalised: SerialPortInfo[] = rawPorts.map((port: any) => ({
			path: String(port.path),
			vendorId: parseHexId(port.vendorId),
			productId: parseHexId(port.productId),
			manufacturer: port.manufacturer ? String(port.manufacturer) : undefined,
			serialNumber: port.serialNumber ? String(port.serialNumber) : undefined,
		}))
		return normalised.filter(port => matchesSerialFilters(port, filters))
	}

	async open(
		portPath: string,
		baudRate = 115200,
		onData?: (chunk: Uint8Array) => void,
		onClose?: () => void,
		onError?: (error: Error) => void,
	): Promise<void> {
		if (!this.available) throw new Error('Native serialport module is unavailable')
		if (this.openPorts.has(portPath)) await this.close(portPath)

		const { SerialPort } = this.serialportModule
		const port = new SerialPort({ path: portPath, baudRate, autoOpen: false })

		await new Promise<void>((resolve, reject) => {
			port.open((error: Error | null) => (error ? reject(error) : resolve()))
		})

		port.on('data', (chunk: Buffer) => {
			onData?.(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength))
		})
		port.on('close', () => {
			this.openPorts.delete(portPath)
			onClose?.()
		})
		port.on('error', (error: Error) => onError?.(error))

		this.openPorts.set(portPath, port)
	}

	async write(portPath: string, data: Uint8Array | ArrayBuffer): Promise<void> {
		const port = this.openPorts.get(portPath)
		if (!port) throw new Error(`Serial port not open: ${portPath}`)
		const buffer = data instanceof ArrayBuffer
			? Buffer.from(data)
			: Buffer.from(data.buffer, data.byteOffset, data.byteLength)

		await new Promise<void>((resolve, reject) => {
			port.write(buffer, (error: Error | null) => {
				if (error) reject(error)
				else resolve()
			})
		})
	}

	async close(portPath: string): Promise<void> {
		const port = this.openPorts.get(portPath)
		if (!port) return
		this.openPorts.delete(portPath)
		await new Promise<void>(resolve => {
			if (!port.isOpen) {
				resolve()
				return
			}
			port.close(() => resolve())
		})
	}

	async closeAll(): Promise<void> {
		for (const portPath of [...this.openPorts.keys()]) {
			await this.close(portPath)
		}
	}
}
