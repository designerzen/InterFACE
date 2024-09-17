/**
 * Overwrite these methods in your own displays
 */
export default class AbstractDisplay{

	static index = 0

	name = "AbstractDisplay"
	// allows you to debug this view
	options
	debug = false
	available = false

	count = 0

	// for MTV mode
	extraVisualMode = false

	canvas
	canvasWidth
	canvasHeight

	// Linked List --------------------
	nextDisplayLink
	previousDisplayLink
		

	// Loading ------------------------
	loadComplete

	// private (consume this in the constructor	)
	loading = new Promise((resolve,reject)=>this.loadComplete = resolve)

	// Linked List --------------------

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


	get width(){
		return this.canvasWidth
	}

	get height(){
		return this.canvasHeight
	}


	get discoMode(){
		return false
	}
	set discoMode(value){
		this.extraVisualMode = value
	}

	/**
	 * Unique ID for this Display that includes its type
	 * @returns {String} ID
	 */
	get id(){
		return this.name + "_" + AbstractDisplay.index
	}

	constructor(canvas, initialWidth, initialHeight, options={} ){
		this.canvas = canvas
		this.canvas.width = this.canvasWidth = initialWidth
		this.canvas.height = this.canvasHeight = initialHeight
		this.options = options
		this.debug = options.debug || false
		AbstractDisplay.index++
	}

	// Create
	
	/**
	 * Remove display from linked list
	 * Delete all references, listeners and handlers
	 * Free up memory
	 */
	async destroy(){
		// CLEAN UP
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

	cancelAnimationLoop(){
		cancelAnimationFrame(this.loopId)
	}
	
	// This varies for each display but here we create a neverending
	// loop using requestFrame - be sure to overwrite
	setAnimationLoop( callback ){
	
		const looper = ()=>{
			callback()
			this.loopId = requestAnimationFrame(looper)
		}
		looper()
	}


	movePersonButton(person, prediction){
		// we only want this every frame or so as this 
		// is altering the DOM and very costly
		const boundingBox = prediction.box
		const boundingBoxWidth = boundingBox.width || boundingBox.xMax - boundingBox.xMin
		const boundingBoxHeight = boundingBox.height || boundingBox.yMax - boundingBox.yMin
		//console.error("Display", display.width, display.height, {boundingBoxWidth,boundingBoxHeight,boundingBox} )
		person.moveButton( boundingBox.xMax, boundingBox.yMin, boundingBoxWidth, boundingBoxHeight ) 
	}

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() { }

	/**
	 * Draw a Person model to the screen
	 */
	drawPerson( person, beatJustPlayed, colours, options={} ){}
	
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
	
	/**
	 * VU Visuals feast!
	 * @param {FFT} dataArray 
	 * @param {Number} bufferLength 
	 */
	drawVisualiser( dataArray, bufferLength ){}

	postProcess( options ){}

	drawInstrument(boundingBox, instrumentName, extra){}

	drawText( x, y, text, size, align, font, invertColours ){}
	drawParagraph(x, y,  paragraphh, size, lineHeight, invertColours ){}


	/**
	 * Draw to screen?
	 */
	render(){ 
		this.onRender()
	}
	
	/**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){}

	setSize(width, height){	
		this.onResize(width, height)
	}


	// EVENTS -----------------------------------------------------
	onRender(){

	}

	onResize(width, height){

	}
}
