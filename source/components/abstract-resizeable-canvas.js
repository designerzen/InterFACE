// We may want a maximim size
// that then get's scaled up proportiaonatly
// so for example, rather than 1000 it may double 500 instead
// so here we specify the max size... if the screen
// grows bigger than the max size then we simply
// divide the screen size by 2 or 3 accordingly
const DEFAULT_PERFORMANCE_BOUNDARY_SIZE = 1080

export class AbstractResizeable{

    element
    worker
    optional

    /**
     * 
     * @param {HTMLElement} canvas 
     * @param {String} workerURI 
     * @param {Object} optional 
     */
    constructor( canvas, workerURI, optional={} ){
        this.element = canvas        
        this.optional = {screenBoundary:DEFAULT_PERFORMANCE_BOUNDARY_SIZE, ...optional}        
        this.onResize = this.onResize.bind(this) 
     
        const canvasWorker = canvas.transferControlToOffscreen()
        const payload = { canvas:canvasWorker, ...this.optional }
        this.worker = new Worker(workerURI)
        this.worker.postMessage(payload, [canvasWorker])
        
        // Add error listeners for the worker
        this.worker.onerror = (error) => {
            console.error("NoteVisualiser Worker Error:", error.message, error.filename, error.lineno, error);
            // You might want to add logic here to try and recover or display a message
        }

        this.worker.onmessageerror = (event) => {
            console.error("NoteVisualiser Worker Message Error:", event);
        }
      
        const resizeObserver = new ResizeObserver(this.onResize)
        resizeObserver.observe(canvas, {box: 'content-box'})
    }
    
    /**
     * Prevents Overgrowth and small sizes too
     * @param {Number} displayWidth 
     * @param {Number} displayHeight 
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
        const needResize = this.element.width !== displayWidth || this.element.height !== displayHeight

        if (needResize) 
        {
            this.started = true

            this.width = displayWidth
            this.height = displayHeight

            // NB. Make the canvas the same size via OffscreenCanvas
            //      this.canvas.width  = displayWidth
            //      this.canvas.height = displayHeight
            const payload = { type:"resize", displayWidth, displayHeight, scaleFactor, ...this.optional }
            this.worker.postMessage(payload)
        }

        return needResize
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