/**
 * Generic 2D Canvas to override
 */
import AbstractDisplay from "./display-abstract"
import { clearCanvas, drawElement, drawFaceMesh, drawPart, drawPoints } from "../visual/2d"
import { drawEye } from "../visual/2d.eyes"
import { drawLip } from "../visual/2d.mouth"
import { hasOffscreenCanvasCapability} from '../capabilities'
import { drawBars } from "../visual/spectrograms"
import { drawInstrument, drawParagraph } from "../visual/2d.text"

/**
 * Canvas based front end engine for Tensor flow @media pipe
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class Display2D extends AbstractDisplay{

	
	canvas2DContext = false

	/**
	 * 
	 */
	get canvasContext(){
		if (!this.canvas2DContext)
		{
			this.canvas2DContext = this.canvas.getContext('2d')
		}
		return this.canvas2DContext
	}

	constructor( canvas, initialWidth, initialHeight, offscreen=false )
	{
		super( offscreen && hasOffscreenCanvasCapability() ? canvas.transferControlToOffscreen() : canvas, initialWidth, initialHeight)
		// immediately fetch context? NB. this will destroy the offscreen canvas
		this.available = true
	}

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() {
		clearCanvas( this.canvasContext, this.width, this.height )
	}

	/**
	 * Paints an existing element onto our display
	 * Used to paint a video frame to the canvas
	 * @param {HTMLElement} element - video / image
	 * @param {Number} x - default to 0
	 * @param {Number} y - default to 0
	 * @param {Boolean} flip - default to true
	 */
	drawElement( element, x=0, y=0, flip=true){	
		drawElement( this.canvasContext, element, x, y, flip, this.width )
	}

	/**
	 * You'll likely want to write your own...
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours ){
		// Person drawn to screen
	}
	
	/**
	 * VU Meter bars
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawBars( dataArray, bufferLength ){
		drawBars( this.canvasContext, dataArray, bufferLength )
	}

	drawInstrument(x, y, instrumentName, extra ){
		drawInstrument( this.canvasContext, x, y, instrumentName, extra )
	}

	drawParagraph(x, y,  paragraph, size, lineHeight, invertColours  ){
		drawParagraph( this.canvasContext, x, y, paragraph, size, lineHeight, invertColours  )
	}

	/**
	 * Overwrite the existing canvas with the same one but
	 * positioned at a specific offset to make it look cool
	 * @param {Number} offsetX 
	 * @param {Number} offsetY 
	 */
	overdraw( offsetX=0, offsetY=-1) {
		
		// this.canvasContext.save()
		
		//this.canvasContext.translate(0, -1)
		this.canvasContext.drawImage( this.canvas,offsetX,offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }

		// this.canvasContext.restore()
	}

	drawBars( dataArray, bufferLength ){
		drawBars( this.canvasContext, dataArray, bufferLength )
	}
	
	
	/**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){
		// TODO: reassemble canvas with logo and stuff?
		return this.canvas.toDataURL(type)
	}
}
