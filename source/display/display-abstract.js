// We may want a maximim size
// that then get's scaled up proportiaonatly
// so for example, rather than 1000 it may double 500 instead
// so here we specify the max size... if the screen
// grows bigger than the max size then we simply
// divide the screen size by 2 or 3 accordingly
const DEFAULT_PERFORMANCE_BOUNDARY_SIZE = 1080

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
	loadFailed

	// private (consume this in the constructor	)
	loading = new Promise((resolve,reject)=>{
		this.loadComplete = resolve
		this.loadFailed = reject
	})

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
		this.options = {...options}
		this.onResize = this.onViewportResize.bind(this) 
		this.debug = options.debug || false
		AbstractDisplay.index++
		 
		if (options.resizeable)
		{
			// if we want to use the CSS size rather than implicit sizes...
			const resizeObserver = new ResizeObserver(this.onViewportResize)
			resizeObserver.observe(canvas, {box: 'content-box'})		
		}
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

	drawInstrument(boundingBox, instrumentName, extra){}

	drawText( x, y, text, size, align, font, invertColours ){}
	drawParagraph(x, y,  paragraphh, size, lineHeight, invertColours ){}
	drawEmoticon( x, y, emoji, rotation=0 ){}

	
	setFilter( filterIndex ){}
	
	/**
	 * Next Filter for the post processing
	 */
	nextFilter(){}

	postProcess( options ){}

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
	
    /**
     * Prevents Overgrowth and small sizes too :)
     * @param {Number} displayWidth 
     * @param {Number} displayHeight 
     * @param {Number} dpr - pixe density 
     * @returns 
     */
    resizeCanvasToDisplaySize(width, height, dpr ){

        // do we ignore the DPR too???
        let displayWidth = Math.round(width * dpr)
        let displayHeight = Math.round(height * dpr)
        let scaleFactor = 1

        // HALVE if over size, and keep halving it till it is smaller
        // the CSS should automatically scale it up
        while (displayWidth > this.optional.screenBoundary || displayHeight > this.optional.screenBoundary)
        {
            displayWidth /= 2
            displayHeight /= 2
            scaleFactor++
        }
      
        // console.info( "size",{ displayWidth, displayHeight, dpr, width, height })
        // Get the size the browser is displaying the canvas in device pixels.
        // Check if the canvas is not the same size.
        const needResize = this.canvas.width !== displayWidth || this.canvas.height !== displayHeight

        if (needResize) 
        {
            this.started = true

            this.canvasWidth = displayWidth
            this.canvasHeight = displayHeight
			setSize(displayWidth, displayHeight)
        }

        return needResize
    }

	// EVENTS -----------------------------------------------------
	onRender(){

	}

	onResize(width, height){

	}

    /**
     * EVENT
     * @param {Array} entries 
     */
    onViewportResize(entries) {
       
        for (const entry of entries) 
        {
            let width
            let height
            let dpr = window.devicePixelRatio
            // let dprSupport = false

            if (entry.devicePixelContentBoxSize) {
                // NOTE: Only this path gives the correct answer
                // The other paths are an imperfect fallback
                // for browsers that don't provide anyway to do this
                width = entry.devicePixelContentBoxSize[0].inlineSize
                height = entry.devicePixelContentBoxSize[0].blockSize
                dpr = 1 // it's already in width and height
                // dprSupport = true

            } else if (entry.contentBoxSize) {

                if (entry.contentBoxSize[0]) {

                    width = entry.contentBoxSize[0].inlineSize
                    height = entry.contentBoxSize[0].blockSize

                } else {

                    // legacy
                    width = entry.contentBoxSize.inlineSize
                    height = entry.contentBoxSize.blockSize
                }

            } else {
                // legacy
                width = entry.contentRect.width
                height = entry.contentRect.height
            }

            this.resizeCanvasToDisplaySize(width, height, dpr)
        }
    }
}