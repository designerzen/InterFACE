
export const canvas = document.getElementById('interface') // document.querySelector("canvas")
export const canvasContext = canvas.getContext('2d')

let width = canvas.width
let height = canvas.height

export const updateCanvasSize = (w,h) => {
	width = w ?? canvas.width
	height = h ?? canvas.height
	// console.error("Updated canvas size to", {w,h}, canvas.width, canvas.height)
}

export const getCanvasDimensions = () => { 
	return {
		width, height
	}
}

/**
 * Empty the canvas and paint it transparent
 */
export const clear = () => {
	// canvasContext.fillStyle = 'rgba(255,0,0,0)'
	canvasContext.clearRect(0, 0, width, height)
	// canvasContext.fillRect(0, 0, width, height)
	// canvasContext.restore()
}

/**
 * Overwrite the existing canvas with the same one but
 * positioned at a specific offset to make it look cool
 * @param {*} x 
 * @param {*} y 
 */
export const overdraw = (x=0, y=-1) => {
	
	// canvasContext.save()
	
	//canvasContext.translate(0, -1)
	canvasContext.drawImage(canvas,x,y)
	// for (var i = 0; i < numImages; i++) {
	// 	canvasContext.drawImage(img, i * img.width, 0);
	// }


	// canvasContext.restore()
}

//////////////////////////////////////////////////////////////////////
// FIXME: Wrap in ty catch always
//////////////////////////////////////////////////////////////////////
export const copyCanvasToClipboard = async () => canvas.toBlob(async (blob) => {
	await navigator.clipboard.write([ new ClipboardItem({ [blob.type]:blob }) ])
})


export const drawElement = (element, x=0, y=0, flip=true) => {
	
	canvasContext.save()
	// invert horizontally (mirror image)
	if (flip){
		canvasContext.translate(width, 0)
		canvasContext.scale(-1, 1)
	}
	canvasContext.drawImage(element , x, y)
	canvasContext.restore()
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
 export const drawRoundedRect = (
	ctx,
	x,
	y,
	width,
	height,
	radius = 5,
	fill = false,
	stroke = true
  ) => {
	if (typeof radius === 'number') {
	  radius = {tl: radius, tr: radius, br: radius, bl: radius}
	} else {
	  radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius}
	}
	ctx.beginPath()
	ctx.moveTo(x + radius.tl, y)
	ctx.lineTo(x + width - radius.tr, y)
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
	ctx.lineTo(x + width, y + height - radius.br)
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
	ctx.lineTo(x + radius.bl, y + height)
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
	ctx.lineTo(x, y + radius.tl)
	ctx.quadraticCurveTo(x, y, x + radius.tl, y)
	ctx.closePath()
	if (fill) {
	  ctx.fill()
	}
	if (stroke) {
	  ctx.stroke()
	}
  }