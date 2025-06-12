import PALETTE from "../settings/palette"
/**
 * Add a string of text to the canvas
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} text 
 * @param {Number} size 
 * @param {String} align  
 * @param {String} font 
 * @param {Boolean} invertColours - invert the colours (white on black)
 */
export const drawText = ( canvasContext, x, y, text='', size=10, align="center", font="Oxanium", invertColours=false) => {
	canvasContext.font = `900 ${size}px ${font}`
// console.info("drawText FONT", `900 ${size}px ${font}`)
	canvasContext.textAlign = align
	canvasContext.fillStyle = invertColours ? PALETTE.dark :  PALETTE.white
	canvasContext.strokeStyle  = invertColours ? PALETTE.white : PALETTE.dark
	canvasContext.strokeText( text, x,y )
	canvasContext.fillText( text, x, y )
}

export const drawRotatedText = ( canvasContext, x, y, rotation=0, text='', size=10, align="center", font="Oxanium", invertColours=false) => {
	canvasContext.save()
	// position it in the centre of the x y coords
	canvasContext.translate( x, y )
	canvasContext.rotate( rotation )
	drawText( canvasContext, 0, 0, text, size, align, font, invertColours )
	canvasContext.restore()
}
/**
 * multi line
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} paragraph of text
 * @param {Number} size font size
 * @param {Number} lineHeight gap between lines
 */
export const drawParagraph = ( canvasContext, x, y, paragraph=[], size='8px', lineHeight=20, invertColours=false) => {
	let textY = y
	for (const p of paragraph)
	{
		// vertically space out
		drawText( canvasContext, x, textY, p, size, "left", undefined, invertColours )
		textY += lineHeight
	}
	
	//console.log("drawParagraph", x,y)
	return textY
}

/**
 * Write out the intstrument text
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Object} boundingBox 
 * @param {String} instrumentName 
 * @param {String} extra 
 */
export const drawInstrument = ( canvasContext, x, y, instrumentName, extra='', fontSize='24px') => {

	if (!instrumentName)
	{
		return
	}
	// use prediction.boundingBox to position text
	const text = `${instrumentName.toUpperCase()}` + (extra ? `- ${extra}` : '')
	// canvasContext.beginPath()
	// these aren't scaled :(
	// canvasContext.fillStyle  = colour
	// canvasContext.rect( boundingBox.xMin boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	// canvasContext.strokeRect( boundingBox.xMin, boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	// canvasContext.fill()
	drawText( canvasContext, x, y, text, fontSize )
}
