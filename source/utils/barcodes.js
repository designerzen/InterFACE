
import QRCode from 'easyqrcodejs'
import {default as QRCodeSVG} from 'qrcode-svg'
import { QR_CODE_OPTIONS, QR_CODE_SVG_OPTIONS } from '../settings/options.barcodes.js'

/**
 * Create a QR code for this URL and show it in the dialog
 * then open the dialog
 * 
 * @param {Object} options 
 */
export const createQRCode = (element, options=QR_CODE_OPTIONS) => new Promise((resolve, reject) => {
	
	const onRenderingEnd = (result) => {
		// Download the png image or svg file
		// The '.png' or '.svg' suffix will be added to filename automatically 
		// const fileName = 'EasyQRCode-file'
		// qrcode.download(fileName)
		resolve( result  )
	}

	try{
		options = { ...QR_CODE_OPTIONS, ...options, onRenderingEnd }
		const qrcode = new QRCode( element, options)
		console.info("Creating QR code", {options, qrcode, element} ) 	
	}catch(error){
		console.error("QR Code could not be created", error)
		reject(error)
	}
})

// FIXME: Make into a worker
// element.innerHTML = createQRCodeFromURL()
export const createSVGQRCodeFromURL = async ( options=QR_CODE_SVG_OPTIONS) => {
	options = { ...QR_CODE_SVG_OPTIONS, ...options}
	const qrcode = new QRCodeSVG(options)
	return qrcode.svg()
}