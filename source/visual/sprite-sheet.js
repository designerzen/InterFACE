export class SpriteSheet {

	canvas
	context	

	areas = new Map()

	x = 0

	constructor(){

	}

	addItem(){
		// draw to canvas

		// 
		const item = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}
		this.areas.set()
		return item
	}

	createCanvas( font, text="M" ){
		// create a canvas if one doesnt already exist
		const canvas = document.createElement("canvas")
		const context = canvas.getContext("2d")
		context.font = font

		const metrics = context.measureText(text)
		canvas.width = metrics.width
		canvas.height = metrics.height
		
		this.canvas = canvas
		this.context = context

		return {
			canvas, 
			context
		}
	}

	getCanvas(){
		// return the canvas if it exists
		if (!this.canvas)
		{
			// otherwise create it
			return this.createCanvas()
		}

		return {
			canvas: this.canvas,
			context: this.context
		}
	}

	addText( text, fontSize=12, fontName="Arial", fontWeight=900, align="left", fillStyle="#000", strokeStyle="#fff" ){
	
		const {context} = this.getCanvas()
		
		// work out position o
		const x = this.x //areas.size * this.canvas.height
		const y = 0

		context.font = `${fontWeight} ${fontSize}px ${fontName}`
		context.textAlign = align
		context.fillStyle = fillStyle
		context.strokeStyle  = strokeStyle
		context.strokeText( text, x, y )
		context.fillText( text, x, y )
		//  console.info("drawText FONT", `900 ${size}px ${font}`, text )
		
		const metrics = context.measureText(text)
	
		const item = {
			x, y,
			width: metrics.width,
			height: metrics.height
		}

		this.areas.set(text, item)
		this.x += metrics.width
		this.canvas.width += metrics.width

		return item
	}

	getArea( text ){
		return this.areas.get(text)
	}
}