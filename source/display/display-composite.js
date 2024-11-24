/**
 * A way to call all displays at once!
 */

import AbstractDisplay from "./display-abstract"
import { DISPLAY_COMPOSITE } from "./display-types"

export default class DisplayComposite extends AbstractDisplay{
	
	name = DISPLAY_COMPOSITE

	initialDisplay

	get firstDisplay(){
		return this.initialDisplay
	}

	get width(){
		return this.initialDisplay.width
	}

	get height(){
		return this.initialDisplay.height
	}

	constructor( canvas, initialWidth, initialHeight, keypointQuantity=478 ){
		
		super( canvas, initialWidth, initialHeight, keypointQuantity )
		this.available = true
		this.loadComplete("ready")
	}

	/**
	 * addDisplay
	 * @param {AbstractDisplay} display 
	 */
	addDisplay( display ){
	
		if (!this.initialDisplay)
		{
			this.initialDisplay = display
		}

		super.addDisplay(display)
	}

	// Now we cover all public methods and loop

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() { 

		let display = this.initialDisplay
		while(display){

			display.clear()
			display = display.nextDisplay
		}
	}

	/**
	 * Draw a Person model to the screen
	 */
	drawPerson( person, beatJustPlayed, colours, options={} ){

		let display = this.initialDisplay
		while(display){

			display.drawPerson( person, beatJustPlayed, colours, options )
			display = display.nextDisplay
		}
	}

	/**
	 * Unknown arguments
	 */
	render(){

		let display = this.initialDisplay
		while(display){
			display.render.apply(display, arguments)
			display = display.nextDisplay
		}
	}

	// FIXME: takePhotograph
	
}

