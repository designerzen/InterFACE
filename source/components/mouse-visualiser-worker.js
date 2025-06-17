import { easeOutSine } from "../easing"

const TAU = Math.PI * 2
const FRICTION = 0.3

const STROKE_ACTIVE = 2
const STROKE_REGULAR = 1
const MIN_RADIUS = 1
const MAX_RADIUS = 44
const RADIUS_RANGE = MAX_RADIUS - MIN_RADIUS

const MAX_SIZE = (MAX_RADIUS + STROKE_ACTIVE) * 2
const HALF_MAX_RADIUS = MAX_SIZE / 2

const SHRINK_DURATION = 101 // 101 is good   // this should be similar to the decay on the instrument

const OFFSET = 6
const X_OFFSET = -OFFSET
const Y_OFFSET = -OFFSET

const START_RADIUS =  -Math.PI * 0.5

let mouseDown = false 
let mouseX = -1
let mouseY = -1
let currentX = 0
let currentY = 0
let scaleFactor = 1
let hoveredElement = null

let radius = MAX_RADIUS
let lastNoteColour

let canvas
let context
const notes = new Set()

let countDown = 0

/**
 * Draw mouse circle onto canvas and lerp towards
 * @param {Number} radius 
 * @returns 
 */
function renderMouse(x, y, radius=MAX_RADIUS, nodeTypeHovered=null, mouseDown=false){
  
    if (nodeTypeHovered !== "CANVAS")
    {
        return
    }
    /*
    // we can adjust the behaviour and style depending
    // on what element the mouse is over.
    // for example, change to a square or triangle
    switch(nodeTypeHovered)
    {
        case "A":
        case "NAV":
        case "MENU":
        case "LABEL":
        case "LEGEND":
        case "INPUT":
        case "BUTTON":
        case "SELECT":
        case "FIELDSET":
            return

        case "SECTION":
        case "ARTICLE":
        case "DIV":
            return
    }

    */

    x += X_OFFSET
    y += Y_OFFSET

    if (notes.size > 0)
    {
        // now fill the other segments
        const radians = TAU / notes.size
        let last = START_RADIUS
       
        let i = 0

        // draw parts of the PI!
        notes.forEach((data, colour, map) => {

            const segment = new Path2D()
            segment.moveTo(x, y)
            // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            segment.arc(x, y, radius, last, last+radians, false)
            segment.closePath()
            
            context.fillStyle = colour
            context.fill(segment)
            
            last += radians
            // console.error(i++, "->", radians * (180/Math.PI),  {countDown, x, y, radius, colour, last, radians, notes} )
        })
    }

    // only fill if mouse is pressed or the circle is shrinking out 
    if (notes.size > 0 )
    {
        // draw a circle at the mouse position
       const colour = !mouseDown ?  'rgba(0,0,0,0.8)' : lastNoteColour ?? 'rgba(0,0,0,0.8)'
        
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        const outline = new Path2D()
        outline.arc(x, y, radius, 0, TAU, true)
        outline.closePath()
        
        // now draw the outlines...
        context.strokeStyle = colour
        context.lineWidth = mouseDown ? STROKE_ACTIVE : STROKE_REGULAR
        // context.fill(path)
        context.stroke(outline)

        // draw a play icon in front of the pie
        if (!mouseDown)
        {
            x += 4
            const triangle = new Path2D()
            const side = radius * 0.44
            triangle.moveTo(x - side, y - side)
            triangle.lineTo(x + side, y)
            triangle.lineTo(x - side, y + side)
            triangle.closePath()
            context.fillStyle = colour
        context.strokeStyle = 'white'
            context.lineWidth = 2
            context.fill(triangle)
            context.stroke(triangle)
        }
    }
    
    // console.error("HOVERED ELEMENT", nodeTypeHovered)
}

/**
 * Loop starts when mouse event and continues until cursor is in position
 */
function render() {

    if (mouseX === -1 || mouseY === -1)
    {
        return requestAnimationFrame(render)
    }

    // clear previous shape
    const max = MAX_SIZE + 6
    context.clearRect( currentX - 3 - HALF_MAX_RADIUS + X_OFFSET, currentY - 3 - HALF_MAX_RADIUS + Y_OFFSET, max, max )
    // context.fillStyle = "rgba(0,255,0,0.8)"
    // context.drawRect( currentX - HALF_MAX_RADIUS + X_OFFSET, currentY - HALF_MAX_RADIUS + Y_OFFSET, MAX_SIZE, MAX_SIZE )

    // shrink radius if mouse is not held down
    if (!mouseDown && countDown > 0)
    {
        // 0 -> 1
        countDown--
        //radius = MIN_RADIUS + RADIUS_RANGE * easeOutSine( countDown / SHRINK_DURATION )
    }

    // LERP TOWARDS MOUSE!
    currentX += (mouseX - currentX) * FRICTION
    currentY += (mouseY - currentY) * FRICTION

    // redraw the mouse position
    if (radius > MIN_RADIUS )
    {
        renderMouse( Math.max(0, currentX), Math.max(0, currentY), radius / scaleFactor, hoveredElement, mouseDown ) 
    }
    
    // console.info("mouse visualiser", countDown, {mouseX, mouseY, currentX, currentY, radius}, easeOutSine( countDown / SHRINK_DURATION ) )

    // continue to loop until we have reached the mouse position
    // if (currentX !== mouseX || currentY !== mouseY || countDown > 0)
    // {
    //     requestAnimationFrame(render)
    // }

    requestAnimationFrame(render)
}


onmessage = (evt) => {

    if (evt.data.canvas)
    {
        canvas = evt.data.canvas
        context = canvas.getContext('2d')
        requestAnimationFrame(render)
        return
    }
   
    switch (evt.data.type)
    {
        case "noteOn":
            lastNoteColour = evt.data.colour
            notes.add( evt.data.colour )
            mouseDown = evt.data.playing
            countDown = SHRINK_DURATION
            radius = MAX_RADIUS
            // console.error("VIZ:noteOn", notes ) 
            break

        case "noteOff":
            lastNoteColour = "transparent"
            // FIXME:
            notes.delete(evt.data.colour)
            // console.error("VIZ:noteOff", notes ) 
            mouseDown = evt.data.playing
            // console.info("VIZ:noteOff", evt.data, {lastNoteColour, mouseDown} )
            break

        case "pointer":
            mouseX = evt.data.x
            mouseY = evt.data.y
            mouseDown = evt.data.pressed
            hoveredElement = evt.data.target
            // console.info("VIZ:pointer", evt.data, {mouseX, mouseY, mouseDown, hoveredElement} )
           
            break

        case "resize":
            // console.info("Resize", evt.data)
            // FIXME: If we are on a 4k screen this may be a huge width
            // so we should have a divison factor to scale the canvas for
            // higher than 2048 then divide the size by 2 and use CSS to scale it
            canvas.width = evt.data.displayWidth
            canvas.height = evt.data.displayHeight
            scaleFactor = evt.data.scaleFactor
            break
    }
}