/**
 * Generic 2D Canvas to override
 */
import AbstractDisplay from "./display-abstract"

import { drawElement } from "../visual/2d"

// import { drawEye } from "../visual/2d.eyes"
// import { drawLip } from "../visual/2d.mouth"
import { hasOffscreenCanvasCapability} from '../capabilities'
import { drawBars } from "../visual/spectrograms"
import { drawInstrument, drawParagraph } from "../visual/2d.text"
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.js"

export const DISPLAY_CANVAS_2D = "DisplayCanvas2D"

// deafult is source-over
const FILTERS = [
	"source-over",
	"source-in",
	"source-out",
	"source-atop",
	"destination-over",
	"destination-in",
	"destination-out",
	"destination-atop",
	"lighter",
	"copy",
	"xor",
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity",
].reverse()

const FILTER_DESCRIPTIONS = [
	"This is the default setting and draws new shapes on top of the existing canvas content.",
	"The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.",
	"The new shape is drawn where it doesn't overlap the existing canvas content.",
	"The new shape is only drawn where it overlaps the existing canvas content.",
	"New shapes are drawn behind the existing canvas content.",
	"The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.",
	"The existing content is kept where it doesn't overlap the new shape.",
	"The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.",
	"Where both shapes overlap the color is determined by adding color values.",
	"Only the new shape is shown.",
	"Shapes are made transparent where both overlap and drawn normal everywhere else.",
	"The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.",
	"The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)",
	"A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.",
	"Retains the darkest pixels of both layers.",
	"Retains the lightest pixels of both layers.",
	"Divides the bottom layer by the inverted top layer.",
	"Divides the inverted bottom layer by the top layer, and then inverts the result.",
	"A combination of multiply and screen like overlay, but with top and bottom layer swapped.",
	"A softer version of hard-light. Pure black or white does not result in pure black or white.",
	"Subtracts the bottom layer from the top layer or the other way round to always get a positive value.",
	"Like difference, but with lower contrast.",
	"Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.",
	"Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.",
	"Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.",
	"Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.",
  ].reverse()

/**
 * Canvas based front end engine for Tensor flow @media pipe
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class Display2D extends AbstractDisplay{

	name = DISPLAY_CANVAS_2D
	
	canvas2DContext = null

	filterIndex = 0 % (FILTERS.length-1)

	get filter(){
		return FILTERS[this.filterIndex]
	}

	get filterDescription(){
		return FILTER_DESCRIPTIONS[this.filterIndex]
	}

	/**
	 * 
	 */
	get canvasContext()
	{
		if (!this.canvas2DContext)
		{
			this.canvas2DContext = this.canvas.getContext('2d')
		}
		return this.canvas2DContext
	}

	get nextFilterIndex()
	{
		return (this.filterIndex + 1) % (FILTERS.length-1)
	}

	constructor( canvas, initialWidth, initialHeight, offscreen=false )
	{
		super( offscreen && hasOffscreenCanvasCapability() ? canvas.transferControlToOffscreen() : canvas, initialWidth, initialHeight)
		// immediately fetch context?  this is useful for immediate rendering
		// NB. this will destroy the offscreen canvas
		if (!offscreen) 
		{
			// this.getContext
		}
		this.available = true
		this.loadComplete("ready")
		canvas.addEventListener("click", e => this.nextFilter() )
	}

	/**
	 * Next Filter for the post processing. 
	 * WARNING : Some of these make the person invisible!
	 */
	nextFilter(){
		this.filterIndex = this.nextFilterIndex
		console.info("Display filter", this.filter, this.filterDescription )
	}

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() {
		this.canvasContext.clearRect( 0,0, this.width, this.height )
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
	drawPerson( person, beatJustPlayed, colours, options={} ){
		const prediction = person.data
		// Person drawn to screen
		// let's position our face button
		if (this.count%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		{
			this.movePersonButton(person, prediction)
		}
	}
	
	/**
	 * VU Meter bars
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawBars( dataArray, bufferLength ){

		drawBars( this.canvasContext, dataArray, bufferLength )
	}
		
	/**
	 * VU Meter bars
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawWaves( dataArray, bufferLength ){

		drawBars( this.canvasContext, dataArray, bufferLength )
	}
		
	/**
	 * TODO: Fancier visualiser
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawVisualiser( dataArray, bufferLength, type ){
		// FIXME:
		switch(type){
			case "line":
				drawBars( this.canvasContext, dataArray, bufferLength )
				break
			default:
				drawBars( this.canvasContext, dataArray, bufferLength )
		}
	}

	drawInstrument(x, y, instrumentName, extra ){
		drawInstrument( this.canvasContext, x, y, instrumentName, extra )
	}

	drawParagraph(x, y,  paragraph, size, lineHeight, invertColours  ){
		drawParagraph( this.canvasContext, x, y, paragraph, size, lineHeight, invertColours  )
	}

	// TODO: drawText

	/**
	 * Overwrite the existing canvas with the same one but
	 * positioned at a specific offset to make it look cool
	 * @param {Number} offsetX 
	 * @param {Number} offsetY 
	 */
	overdraw( offsetX=0, offsetY=-1) {
		
		// ctx.clearRect(0, 0, width, height);
		// this.canvasContext.save()
		// this.canvasContext.save()
		// use this filter
		this.canvasContext.globalCompositeOperation = this.filter
		//this.canvasContext.translate(0, -1)
		this.canvasContext.drawImage( this.canvas, offsetX, offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }
	
		// this.canvasContext.restore()
	}

	/**
	 * Converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){
		// TODO: reassemble canvas with logo and stuff?
		return this.canvas.toDataURL(type)
	}
	
	/**
	 * Post process the canvas with some kind of effect
	 * Here the effect will offset the image on the canvas
	 * @param {Object} options 
	 */
	postProcess( options ){
		if (options.filterIndex && options.filterIndex !== this.filterIndex)
		{
			this.filterIndex = options.filterIndex % (FILTERS.length-1)
		}
		this.overdraw( options.offsetX ?? 0, options.offsetY ?? 0 )
	}
}