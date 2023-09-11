import { RGBA_ASTC_4x4_Format } from 'three'
import {drawRoundedRect} from './2d'

const whiteKeys = 7
const blackKeys = 5
const keyRadius = 2
const BLACK_KEY_HEIGHT_SCALE = 0.5
const BLACK_KEY_WIDTH_SCALE = 0.5

const NO_KEY = 0
const WHITE_KEY = 1
const BLACK_KEY = 2
const KEY_SEQUENCE = [ WHITE_KEY, BLACK_KEY, WHITE_KEY, BLACK_KEY, WHITE_KEY, NO_KEY, WHITE_KEY, BLACK_KEY, WHITE_KEY, BLACK_KEY, WHITE_KEY, BLACK_KEY, WHITE_KEY ]
const DRAW_SEQUENCE = [ WHITE_KEY, BLACK_KEY ]

const getKeyInSequence = (noteNumber) => KEY_SEQUENCE[ noteNumber % (KEY_SEQUENCE.length-1) ]


class MusicalKey{
	constructor(){

	}

	update(){

	}
}

/**
 * Just an onscreen canvas keyboard that changes colour when midi signal sent in
 * It is actually two canvasses one with outlines over blocks of colour
 */
export default class MusicalKeyboard{

	octaves = 1

	context
	buffer
	originalKeyboard

	get keyboardCanvas(){
		return this.originalKeyboard
	}

	get canvas(){
		return this.buffer
	}

	constructor( width, height, amountOfOctaves=1 ){
		this.octaves = amountOfOctaves

		// create custom double blit canvas
		this.draw( width, height, amountOfOctaves )
	}

	drawKey( colour, noteNumber ){
		const height = this.buffer.height
		this.context.fillStyle = 'transparent'//colour === BLACK_KEY ? "black" : "white" 
		const key = drawRoundedRect( 
			this.context, 
			this.keyPositions[noteNumber], 0, 
			this.keyWidths[noteNumber], this.keyHeights[noteNumber],
			keyRadius, 
			true, true
		)
	}

	drawActiveKey( noteColour, noteNumber, velocity ){
		// * velocity as alpha / white blend
		this.context.fillStyle = noteColour
		const key = drawRoundedRect( 
			this.context, 
			this.keyPositions[noteNumber], 0, 
			this.keyWidths[noteNumber], this.keyHeights[noteNumber],
			keyRadius, 
			true, false
		)
		console.error("drawActiveKey", {...arguments})
	}


	clearActiveKey( noteNumber ){
		this.context.clearRect( 
			this.keyPositions[noteNumber], 0,
			this.keyWidths[noteNumber], this.keyHeights[noteNumber]
		)
	}

	clear(){
		this.context.drawImage(this.originalKeyboard, 0, 0)
	}

	draw( width, height, amountOfOctaves ){

		const buffer = document.createElement('canvas')		
		buffer.width = width
		buffer.height = height

		const context = buffer.getContext("2d")
		
		this.buffer = buffer
		this.context = context

		// create a sequence the length of how many octaves
		const keySequence = new Array(amountOfOctaves).fill([...KEY_SEQUENCE]).flat()
		//const colourSequence = (new Array(whiteKeys)).map( (k,i) => keySequence[i]))
		const keyQuantity = amountOfOctaves * (whiteKeys ) // keySequence.length
		const whiteKeyWidth = width / (keyQuantity + 1)
		const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_SCALE
		
		this.whiteKeyWidth = whiteKeyWidth
		this.blackKeyWidth = blackKeyWidth
		
		this.keyWidths = []
		this.keyHeights = []

		let xi = 0
		this.keyPositions = keySequence.map( (key, index) => {
			switch(key)
			{
				case WHITE_KEY: 
					xi += whiteKeyWidth
					this.keyWidths.push( whiteKeyWidth )
					this.keyHeights.push( height )
					return xi

				case BLACK_KEY: 
					this.keyWidths.push( blackKeyWidth  )
					this.keyHeights.push( height * BLACK_KEY_HEIGHT_SCALE )
					return xi +( whiteKeyWidth / 2 )+ (blackKeyWidth / 2)

				case NO_KEY:
				default: 
					this.keyWidths.push( 0 )
					this.keyHeights.push( 0 )
					return -1
			} 
		})

		context.strokeStyle = "black" 
		DRAW_SEQUENCE.forEach( keyColour => {
			this.keyPositions.forEach( (position,i) => {
				const colour = keySequence[i]
				if (colour === keyColour)
				{
					this.drawKey(colour, i)
				}
			})
		})
		
		// allow us to return to the clean state
		context.save()

		//create a new canvas to save our perfect keyboard in
		const newCanvas = document.createElement('canvas')
		const spareContext = newCanvas.getContext('2d')
		newCanvas.width = buffer.width
		newCanvas.height = buffer.height
		spareContext.drawImage(buffer, 0, 0)
		this.originalKeyboard = newCanvas

		// console.error("2d::KeyBoard", this)
	}

	// call every frame to redraw
	redraw(){

	}

	// MIDI interface!
	noteOn( noteNumber, velocity=1 ){
		// new MusicalKey()
		const colour = `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`
		this.drawActiveKey( colour, noteNumber, velocity )
	}

	noteOff( noteNumber, velocity=1 ){
		//this.drawActiveKey( noteNumber, colour )
		// this.clear()
		this.clearActiveKey( noteNumber )
	}
}