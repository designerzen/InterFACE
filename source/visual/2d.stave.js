// this is a visual represntation of musical notes
// that is updated in real time and can paint new notes
// on an add hoc basis

import { clamp, TAU, easeInQuad } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../palette"



const drawNote = (hue, saturation, luminosity, opacity) => {
	const colour = `hsla(${hue},${saturation},${luminosity},${opacity})`

}

const getKey = (name, note) => { 
	return {
		name, note
	}
 }


export default class Stave{

	constructor( canvas, x, y, horizontal=true, size={w:200,h:100} ) {
		
console.log( typeof canvas )

		// create a new smaller canvas to draw directly onto?
		this.canvas = canvas
		this.context = canvas.getContext("2d")
		this.notes = new Map()
		this.isHorizontal = horizontal
		
		this.createPalette()
		
		this.redrawNecessary = true
	}

	// cached palette...
	createPalette( s=50, l=50, a=0.8, c=256 ){
		// create colour scheme?
		this.palette = (new Array(c)).map( (item, index) => drawNote( 360 * index/c, s, l, a ) )
	}

	// this simply takes a note converts it into
	// a coloured blob and draw it on the canvas
	draw( personData  ) {
		// initialise the background lines
		console.log(personData)

		const canvasContext = this.context
		
		if (this.notes.size > 0)
		{
			this.notes
		}else{

		}

		canvasContext.beginPath()
		canvasContext.arc(0,0, 12, 0, TAU)
		canvasContext.fillStyle = 'red'
		canvasContext.fill()
		canvasContext.closePath()
	}

	// usual midi interface...
	noteOn(  note, name='a' ){
		// as we are monophonic each user has specific notes
		// so we first get the currently playing value
		const currentlyPlaying = this.notes.get(name)
		
		// if it has changed...
		if (currentlyPlaying !== note )
		{
			// now we draw to the screen and save a pointer to the data
			this.notes.set(name, note)
			this.redrawNecessary = true
		}
	}

	noteOff( name='a' ){
		// check to see if it changes
		// this.notes.delete( name )
		this.notes.set(name, -1)
		this.redrawNecessary = true
	}

	allNotesOff(){
		this.notes.clear()
		this.redrawNecessary = true
	}

	update(time){
		// as we are not monophonic we have to handle all 
		// concurrent notes and glides
	
		if (this.redrawNecessary)
		{
			draw()
		}
	}

}