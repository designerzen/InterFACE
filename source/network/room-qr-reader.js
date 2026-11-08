import { prepareZXingModule, readBarcodes } from 'zxing-wasm/dist/es/reader/index.js'

const wasmURL = new URL('zxing/zxing_reader.wasm', document.baseURI).href

// Bundle the decoder locally so pairing does not depend on a CDN.
prepareZXingModule({ overrides: { locateFile: path => path.endsWith('.wasm') ? wasmURL : path } })
export const readPairingQR = async image => {
	const results = await readBarcodes(image, { formats: ['QRCode'], maxNumberOfSymbols: 1 })
	return results[0]?.text ?? ''
}
