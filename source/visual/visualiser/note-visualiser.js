/**
 * Scrolling note on / off visualisation
 */
import NOTE_VISUALISER_CANVAS_WORKER from "url:./note-visualiser-worker.js"
import ResizeableCanvasWithWorker from "../resizeable-canvas-with-worker.js"

export default class NoteVisualiser extends ResizeableCanvasWithWorker{

    notes
    canvas
    context

    height
    counter = 0
    notesOn = 0

    started = false
    mouseDown = false

    mouseX = 0
    mouseY = 0

    #blendMode = 23

    set blendMode(value){
        this.#blendMode = value
        // console.error("Blendmode requested", value)
        //this.worker.postMessage({type:"blendMode", blendMode:value})
    }

    get blendMode(){
        return this.#blendMode
    }

    get backgroundColour(){
        return getComputedStyle(this.canvas).getPropertyValue("background-color")
        return this.canvas.style.backgroundColor
    }

    constructor( canvas, notes, vertical=false, wave=0 ){
        
        super( canvas, NOTE_VISUALISER_CANVAS_WORKER, {vertical, notes})

        this.notes = notes
        this.canvas = canvas
        this.wave = wave
        this.vertical = vertical
    }

    /**
     * Note On
     * @param {Note} note 
     * @param {number} velocity 
     */
    noteOn( note, velocity=1 ){
        const payload = { 
			type:"noteOn", 
			note:note.number,
			colour:note.colour, 
			velocity 
		}

        // console.info("NOTEVIZ noteOn", {note, velocity, payload} )
        this.notesOn++
        this.worker.postMessage(payload)
    }

    /**
     * Note Off
     * @param {Note} note 
     * @param {Number} velocity 
     */
    noteOff( note, velocity=1 ){
		 const payload = { 
			type:"noteOff", 
			note:note.number,
			colour:note.colour, 
			velocity 
		}
        this.notesOn--
        this.worker.postMessage(payload)
    }

	destroy(){
		super.destroy()
	}
}