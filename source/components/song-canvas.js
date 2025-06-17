export class SongCanvas {
    
    canvas

    context

    melodyRecorder

    quantized = true

    index = 0


    lastNoteTime = 0

    constructor(canvas, melodyRecorder){
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.melodyRecorder = melodyRecorder
 
        const resizeObserver = new ResizeObserver( e => this.onResize(e) )
        resizeObserver.observe(canvas, {box: 'content-box'})
    }


    /**
     * Note On
     * @param {Note} note 
     * @param {number} velocity 
     */
    noteOn( note, velocity=1, time=0 ){
        let hasAdvancedThroughTime = false
        if (this.lastNoteTime < time)
        {
            this.lastNoteTime = time
            hasAdvancedThroughTime = true
            this.index++
        }
        this.drawNote(note, this.quantized ? this.index : time )
    }

    /**
     * Note Off
     * @param {Note} note 
     * @param {Number} velocity 
     */
    noteOff( note, velocity=1, time=0 ){
      
    }

    drawNote(note, time){
        this.context.fillStyle = note.colour
        this.context.fillRect( time, note.number, 1, 1)
        // console.info("note", note, time)
    }

    redraw(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        const t = this.melodyRecorder.getRecording()
        if (this.canvas.width < t.size )
        {
            this.canvas.width = t.size
        }
        this.index = 0
        t.forEach((data) => {
            this.drawNote(data.note, this.quantized ? this.index : data.time)
            this.index++
        })
    }

    resizeCanvasToDisplaySize(width, height, dpr ){

        const displayWidth = Math.round(width * dpr)
        if (this.canvas.width !== displayWidth )
        {
            this.canvas.width = displayWidth
        }
        this.redraw()
    }
      
    /**
     * EVENT
     * @param {Array} entries 
     */
    onResize(entries) {
       
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