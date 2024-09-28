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

const DEFAULT_FILTER = {
	name:"source-over",
	description:"This is the default setting and draws new shapes on top of the existing canvas content."
}
const FILTER_LIBRARY = [
	// {
	// 	name:"source-over",
	// 	description:"This is the default setting and draws new shapes on top of the existing canvas content."
	// },
	// {
	// 	name:"source-in",
	// 	description:"The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent."
	// },
	// {
	// 	name:"source-out",
	// 	description:"The new shape is drawn where it doesn't overlap the existing canvas content."
	// },
	// {
	// 	name:"source-atop",
	// 	description:"The new shape is only drawn where it overlaps the existing canvas content."
	// },

	// {
	// 	name:"destination-over",
	// 	description:"New shapes are drawn behind the existing canvas content."
	// },
	// {
	// 	name:"destination-in",
	// 	description:"The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent."
	// },
	// {
	// 	name:"destination-out",
	// 	description:"The existing content is kept where it doesn't overlap the new shape."
	// },
	// {
	// 	name:"destination-atop",
	// 	description:"The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content."
	// },

	{
		name:"lighter",
		description:"Where both shapes overlap the color is determined by adding color values."
	},
	// {
	// 	name:"copy",
	// 	description:"Only the new shape is shown."
	// },
	{
		name:"xor",
		description:"Shapes are made transparent where both overlap and drawn normal everywhere else."
	},
	// {
	// 	name:"multiply",
	// 	description:"The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result."
	// },


	// Useful as a BLOOM effect
	// {
	// 	name:"screen",
	// 	description:"The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)"
	// },

	// {
	// 	name:"overlay",
	// 	description:"A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter."
	// },
	// {
	// 	name:"darken",
	// 	description:"Retains the darkest pixels of both layers."
	// },
	{
		name:"lighten",
		description:"Retains the lightest pixels of both layers."
	},

	// {
	// 	name:"color-dodge",
	// 	description:"Divides the bottom layer by the inverted top layer."
	// },
	// {
	// 	name:"color-burn",
	// 	description:"Divides the inverted bottom layer by the top layer, and then inverts the result."
	// },

	// {
	// 	name:"hard-light",
	// 	description:"A combination of multiply and screen like overlay, but with top and bottom layer swapped."
	// },
	// {
	// 	name:"soft-light",
	// 	description:"A softer version of hard-light. Pure black or white does not result in pure black or white."
	// },

	{
		name:"difference",
		description:"Subtracts the bottom layer from the top layer or the other way round to always get a positive value."
	},
	// {
	// 	name:"exclusion",
	// 	description:"Like difference, but with lower contrast."
	// },

	// {
	// 	name:"hue",
	// 	description:"Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer."
	// },
	// {
	// 	name:"saturation",
	// 	description:"Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer."
	// },
	// could be good but expensive
	// {
	// 	name:"color",
	// 	description:"Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer."
	// },
	{
		name:"luminosity",
		description:"Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer."
	},
].reverse()

/**
 * Canvas based front end engine for Tensor flow @media pipe
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class Display2D extends AbstractDisplay{

	name = DISPLAY_CANVAS_2D
	
	canvas2DContext = null

	filterIndex = 0 % (FILTER_LIBRARY.length-1)

	get filterModel(){
		return FILTER_LIBRARY[this.filterIndex]
	}

	get filter(){
		return this.filterModel.name
	}

	get filterDescription(){
		return this.filterModel.description
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
		return (this.filterIndex + 1) % (FILTER_LIBRARY.length-1)
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
	resetFilter(){
		this.canvasContext.globalCompositeOperation = DEFAULT_FILTER.name
		// console.info("Display filter RESET", this.filter, this.filterDescription )
	}

	setFilter( filterIndex ){
		this.filterIndex = filterIndex
		// console.info("Display filter", this.filter, this.filterDescription )
	}

	/**
	 * Next Filter for the post processing. 
	 * WARNING : Some of these make the person invisible!
	 */
	nextFilter(){
		this.setFilter( this.nextFilterIndex )
		// console.info("Display filter", this.filter, this.filterDescription )
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
		// if (this.count%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		// {
		// 	this.movePersonButton(person, prediction)
		// }
		// FIXME: Fix this in JS using thte video button
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

	drawInstrument(x, y, instrumentName, extra, fontSize='24px' ){
		drawInstrument( this.canvasContext, x, y, instrumentName, extra, fontSize ) 
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
		
		// ctx.clearRect(0, 0, width, height);
		
		//this.canvasContext.translate(0, -1)
		this.canvasContext.drawImage( this.canvas, offsetX, offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }
		// 
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
			this.filterIndex = options.filterIndex % (FILTER_LIBRARY.length-1)
		}
		this.canvasContext.save()	
		this.canvasContext.globalCompositeOperation = this.filter
		// use this filter
		this.overdraw( options.offsetX ?? 0, options.offsetY ?? 0 )
		this.canvasContext.restore()
	}
}