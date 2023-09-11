import {copyBlobToClipboard} from '../utils/clipboard'

/**
 * Todo: remove all individual canvas references
 */
export const canvas = document.getElementById('interface')

let width = canvas.width
let height = canvas.height

export const updateCanvasSize = (w,h) => {
	width = w ?? canvas.width
	height = h ?? canvas.height
	// console.error("Updated canvas size to", {w,h}, canvas.width, canvas.height)
}

export const getCanvasDimensions = (canvas) => { 
	if (canvas)
	{
		return {
			width:canvas.width,
			height:canvas.height
		}
	}
	return {
		width, height
	}
}



/**
 * Overwrite the existing canvas with the same one but
 * positioned at a specific offset to make it look cool
 * @param {Number} x 
 * @param {Number} y 
 */
export const overdraw = (context, x=0, y=-1) => {
	
	// context.save()
	//context.translate(0, -1)
	context.drawImage(canvas,x,y)
	// for (var i = 0; i < numImages; i++) {
	// 	context.drawImage(img, i * img.width, 0);
	// }

	// context.restore()
}

/**
 * FIXME: Wrap in ty catch always
 * @param {Canvas} canvas 
 * @returns 
 */
export const copyCanvasToClipboard = 
	async (canvas) => canvas.toBlob(async (blob) => {
		copyBlobToClipboard(blob)
})