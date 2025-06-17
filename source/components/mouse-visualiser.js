import MOUSE_VISUALISER_CANVAS_WORKER from "url:./mouse-visualiser-worker.js"
import { AbstractResizeable } from "./abstract-resizeable-canvas.js"

export class MouseVisualiser extends AbstractResizeable{

    timeout
    
    mouseDown = false

    hoveredElement = null

    mouseX = 0
    mouseY = 0

    rect

    constructor(canvas){
        super(canvas, MOUSE_VISUALISER_CANVAS_WORKER)
        
        this.rect = canvas.getBoundingClientRect()
 
        const elementToObserve = window ?? document

        // elementToObserve.addEventListener("mousemove", e => {
        elementToObserve.addEventListener("pointermove", e => {
            const details = e.target // can e.something return what element the mouse cursor is over?
            const coords = this.getMouseCoords(canvas, e)
            this.mouseX = coords.x // ?? e.offsetX ?? e.layerX ?? e.clientX
            this.mouseY = coords.y // e.offsetY ?? e.layerY ?? e.clientY
            this.hoveredElement = details ? details.nodeName : null
            this.sendMessage(1)
            // console.log("onmousemove", {details, coords})
        })
    
        elementToObserve.addEventListener( "pointerdown", e => {
            this.mouseDown = true
            this.sendMessage() 
        })

        elementToObserve.addEventListener( "pointerup", e => {
            this.mouseDown = false
            this.sendMessage() 
        })
    }

    /**
     * 
     * @param {Number} delay (only used in debounce mode)
     */
    sendMessage( delay=0 ){
        if (delay === 0)
        {
            // direct
            this.worker.postMessage( this.getPayload() )  
        }else if (delay === 1){ 
            // on next available video frame 
            requestAnimationFrame( e => this.worker.postMessage( this.getPayload() ) )   
        }else{
            // debounced
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => this.worker.postMessage( this.getPayload() ), delay )
        }
    }

    /**
     * update the size of the canvas & rect
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} dpr 
     */
    resizeCanvasToDisplaySize( width, height, dpr ){
        this.rect = this.element.getBoundingClientRect()
        super.resizeCanvasToDisplaySize(width, height, dpr)
    }

    /**
     * get the current mouse coordinates
     * @param {HTMLElement} canvas 
     * @param {MouseEvent} event 
     * @returns 
     */
    getMouseCoords(canvas, event) {
        // this.rect = canvas.getBoundingClientRect()
        const x =  (event.clientX - this.rect.left) / (this.rect.right - this.rect.left) * canvas.width
        const y =  (event.clientY - this.rect.top) / (this.rect.bottom - this.rect.top) * canvas.height
        // *always* round to integers!
        return {
            x: (0.5 + x) | 0,
            y: (0.5 + y) | 0
        }
    }

    /**
     * 
     * @returns {Object}
     */
    getPayload(){
        // console.info("MOUSEMOVE", {type:"mouse", x:this.mouseX , y:this.mouseY, pressed:this.mouseDown})
        return { type:"pointer", x:this.mouseX , y:this.mouseY, pressed:this.mouseDown, target:this.hoveredElement }
    }

    /**
     * Note On
     * @param {Note} note 
     * @param {number} velocity 
     */
    noteOn( note, velocity=1 ){
        const payload = { type:"noteOn", colour:note.colour, velocity, playing:this.mouseDown }
        this.worker.postMessage(payload)  
    }

    /**
     * Note Off
     * @param {Note} note 
     * @param {Number} velocity 
     */
    noteOff( note, velocity=1 ){
        const payload = { type:"noteOff", colour:note.colour, velocity, playing:this.mouseDown }
        this.worker.postMessage(payload)  
    }

    // TODO: chordOn and chordOff
}