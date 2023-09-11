/**
 * Overwrite these methods in your own displays
 */
export default class AbstractDisplay{

	// allows you to debug this view
	debug = true
	available = false

	canvas
	canvasWidth
	canvasHeight

	// Linked List --------------------
	nextDisplayLink
	previousDisplayLink
		
	get previousDisplay(){
		return this.previousDisplayLink
	}
	
	get nextDisplay(){
		return this.nextDisplayLink
	}

	get firstDisplay(){
		let i = this
		while(i.previousDisplay)
		{
			i = i.previousDisplay
		}
		return i
	}

	get lastDisplay(){
		let i = this
		while(i.nextDisplayLink)
		{
			i = i.nextDisplayLink
		}
		return i
	}

	/**
	 * 
	 * @param {AbstractDisplay} display 
	 */
	addDisplay( display ){
		const last = this.lastDisplay
		// navigate to end of chain and append our new display
		last.nextDisplayLink = display
		display.previousDisplayLink = last
	}

	// Linked List --------------------

	get width(){
		return this.canvasWidth
	}

	get height(){
		return this.canvasHeight
	}

	constructor(canvas, initialWidth, initialHeight){
		this.canvas = canvas
		this.canvas.width = this.canvasWidth = initialWidth
		this.canvas.height = this.canvasHeight = initialHeight
	}

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() { }

	/**
	 * Draw a Person model to the screen
	 */
	drawPerson( person, beatJustPlayed, colours ){}
	

	/**
	 * Draw a Person model to the screen
	 */
	drawElement( person, beatJustPlayed, colours ){}
	
	/**
	 * VU Meter bars
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawBars( dataArray, bufferLength ){}
	

	drawInstrument(boundingBox, instrumentName, extra){}

	drawText( x, y, text, size, align, font, invertColours ){}
	drawParagraph(x, y,  paragraphh, size, lineHeight, invertColours ){}
	/**
	 * Draw to screen?
	 */
	render(){ }
	
	/**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){}
}
