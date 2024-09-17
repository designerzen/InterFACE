import {copyBlobToClipboard} from '../utils/clipboard'

/**
 * Overwrite the existing canvas with the same one but
 * positioned at a specific offset to make it look cool
 * @param {Number} x 
 * @param {Number} y 
 */
export const overdraw = (context, x=0, y=-1) => {
	
	// context.save()
	//context.translate(0, -1)
	context.drawImage(canvasElement,x,y)
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