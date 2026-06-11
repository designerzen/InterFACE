import PALETTE from "../settings/palette.js"
import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext"

const getFontSizeValue = (size=10) => {
	if (typeof size === "number")
	{
		return size
	}

	const parsed = Number.parseFloat(size)
	return Number.isFinite(parsed) ? parsed : 10
}

const getFontString = (size=10, font="Oxanium") => {
	return `900 ${getFontSizeValue(size)}px ${font || "Oxanium"}`
}

const applyTextColours = (canvasContext, invertColours=false) => {
	canvasContext.fillStyle = invertColours ? PALETTE.dark :  PALETTE.white
	canvasContext.strokeStyle  = invertColours ? PALETTE.white : PALETTE.dark
}

const drawLaidOutLine = (canvasContext, line, x, y, align="center") => {
	const lineX = align === "center" ? x - line.width * 0.5 : align === "right" ? x - line.width : x
	canvasContext.strokeText( line.text, lineX, y )
	canvasContext.fillText( line.text, lineX, y )
}

export const drawPretext = ( canvasContext, x, y, text='', size=10, align="center", font="Oxanium", invertColours=false, lineHeight, maxWidth=Number.POSITIVE_INFINITY ) => {
	const fontString = getFontString(size, font)
	const fontSize = getFontSizeValue(size)
	const resolvedLineHeight = lineHeight ?? fontSize * 1.2
	const prepared = prepareWithSegments(`${text}`, fontString, { whiteSpace:"pre-wrap" })
	const layoutWidth = Number.isFinite(maxWidth) && maxWidth > 0 ? maxWidth : 100000
	const { lines } = layoutWithLines(prepared, layoutWidth, resolvedLineHeight)

	canvasContext.save()
	canvasContext.font = fontString
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "middle"
	applyTextColours(canvasContext, invertColours)

	for (let i=0; i < lines.length; i++)
	{
		drawLaidOutLine(canvasContext, lines[i], x, y + i * resolvedLineHeight, align)
	}

	canvasContext.restore()
	return {
		height: lines.length * resolvedLineHeight,
		lineCount: lines.length,
		width: Math.max(...lines.map(line => line.width), 0)
	}
}

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
	return drawPretext( canvasContext, x, y, text, size, align, font, invertColours )
}

export const drawRotatedText = ( canvasContext, x, y, text='', size=10, rotateZ=1, rotateX=1, rotateY=1, align="center", font="Oxanium", invertColours=false, flipX=false ) => {
	canvasContext.save()
	// position it in the centre of the x y coords
	// canvasContext.translate( x, y )

	if (flipX)
	{
		canvasContext.scale( -1, 1 )
	}

	// skew if required
	const a = 0 //scale x
    const b = rotateY // Math.sin(rotateY) // skew y
    const c = rotateX // Math.cos(rotateX) // skew x
    const d = 0 // scale y
    const e = x // move x
    const f = y // move y
    canvasContext.transform(a, b, c, d, e, f)

	// rotate once skewed
	canvasContext.rotate( rotateZ )

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
export const drawParagraph = ( canvasContext, x, y, paragraph=[], size=8, lineHeight=20, invertColours=false, align="center", font="Oxanium", maxWidth=Number.POSITIVE_INFINITY) => {
	const text = Array.isArray(paragraph) ? paragraph.join("\n") : `${paragraph}`
	const metrics = drawPretext( canvasContext, x, y, text, size, align, font, invertColours, lineHeight, maxWidth )
	return y + metrics.height
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
