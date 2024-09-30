
import QRCode from 'easyqrcodejs'
import { QR_CODE_OPTIONS } from '../settings/options.barcodes.js'

/**
 * Create a QR code for this URL and show it in the dialog
 * then open the dialog
 * 
 * @param {Object} options 
 */
export const createQRCode = async (element, options=QR_CODE_OPTIONS) => {
	
	let qrcode 
	// text: "https://interface.place",
	const onRenderingEnd = (result) => {
		// Download the png image or svg file
		// The '.png' or '.svg' suffix will be added to filename automatically 
		// const fileName = 'EasyQRCode-file'
		// qrcode.download(fileName)
		return result
	}

	options = { ...QR_CODE_OPTIONS, ...options, onRenderingEnd }
	qrcode = new QRCode( element, options)
}