export default class ResizeableCanvasWithWorker{

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
        this.optional = optional        
        this.onResize = this.onResize.bind(this) 
     
        const canvasWorker = canvas.transferControlToOffscreen()
        const payload = { canvas:canvasWorker, ...this.optional }
        this.worker = new Worker(workerURI)
		this.worker.postMessage(payload, [canvasWorker])
        
        // Add error listeners for the worker
        this.worker.onerror = (error) => {
            console.error("Worker Error:", error.message, error.filename, error.lineno, error);
            // You might want to add logic here to try and recover or display a message
        }

		// how do we subscrivbe to
        this.worker.onmessageerror = (event) => {
            console.error("Worker Message Error:", event);
        }

		this.worker.onmessage = optional.onmessage ??( (event) => {
			// console.log("Worker Message Error:", event)
		})
      
        const resizeObserver = new ResizeObserver(this.onResize)
        resizeObserver.observe(canvas, {box: 'content-box'})
    }

	post(payload){
		this.worker.postMessage(payload)
	}

	destroy(){
		this.started = false
		if (this.worker) {
			this.worker.postMessage({ type: "destroy" })
			this.worker.terminate()
			this.worker = null
		}
		if (this.element) {
			this.element = null
		}
		// console.warn("ResizeableCanvasWithWorker destroyed")
	}
    
    /**
     * 
     * @param {Number} displayWidth 
     * @param {Number} displayHeight 
     * @returns 
     */
    resizeCanvasToDisplaySize(width, height, dpr ){

        const displayWidth = Math.round(width * dpr)
        const displayHeight = Math.round(height * dpr)
        
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
            const payload = { type:"resize", displayWidth, displayHeight, ...this.optional }
            this.post(payload)
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

       
			if (width === 0 || height === 0) {
				// console.error( "IGNORE resize",{ dpr, width, height })
			}else{
				//console.info( "size",{ dpr, width, height })
				this.resizeCanvasToDisplaySize(width, height, dpr)
			}
        }
    }
}