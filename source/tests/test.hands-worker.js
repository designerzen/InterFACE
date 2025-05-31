import { DrawingUtils, GestureRecognizer } from "@mediapipe/tasks-vision"

let clearBackground = false

// Canvases
let canvas
let canvasCtx
let drawingUtils
let results

// timer & frame lock
let counter = 0
let lastRenderTime = 0

// LOCK TO 60Hz
const throttle = 1000 / 60

function updateCanvas(){

	canvasCtx.strokeStyle = (0xffffff * Math.random()) >> 0
	canvasCtx.fillStyle = (0xffffff * Math.random()) >> 0

	// clear screen? 
	// TODO: Save the bounding box of the previous draw then just clear those panels
	canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
	canvasCtx.stroke()

	if (results)
	{
		// send these to the worker!
		// canvasCtx.save()
		// canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
		
		if (results.landmarks && results.landmarks.length) {
			for (const landmarks of results.landmarks) {
				drawingUtils.drawConnectors(
					landmarks,
					GestureRecognizer.HAND_CONNECTIONS,
					{
						color: "#00FF00",
						lineWidth: 3
					}
				)
				drawingUtils.drawLandmarks(landmarks, {
					color: "#FF0000",
					lineWidth: 2
				})
				// console.info("Drawing", results.gestures)
			}
			// 
		}

		//Have we recognised any hand gestures that we can exploit?
		if (results.gestures && results.gestures.length > 0) {
			//   gestureOutput.style.display = "block";
			//   gestureOutput.style.width = videoWidth;
			const categoryName = results.gestures[0][0].categoryName
			const categoryScore = parseFloat(
				results.gestures[0][0].score * 100
			).toFixed(2)
			const handedness = results.handednesses[0][0].displayName
			const text = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`
			console.info(text)
			postMessage({type:"gesture", data:{
				categoryName,
				categoryScore,
				handedness
			}})
		} else {
			// gestureOutput.style.display = "none"
		}

		// canvasCtx.restore()

	}
}

function render(time) {
    
    const dt = time - lastRenderTime

    // Accumulate delta time
    // we want to throttle this to only x events every second
    if ( dt < throttle )
    {
        // console.log("throttled", {dt, throttle,time, previousTime} )
    }else{
        updateCanvas()
        // Update the previous time
        lastRenderTime = time
        // console.log("unthrottled", {dt, throttle,time, previousTime} )
    }

    // context.fillStyle = "#ff0000"
    // context.fillRect( 
    //     Math.random() * 400, 
    //     Math.random() * 400, 
    //     Math.random() * 400, 
    //     Math.random() * 400
    
    // if (loop) {
    //     requestAnimationFrame(render)
    // }
}

onmessage = (evt) => {

    if (evt.data.canvas)
    {
        canvas = evt.data.canvas
        canvasCtx = canvas.getContext('2d')
		drawingUtils = new DrawingUtils(canvasCtx) 
        //console.info("mirror created",  context.globalCompositeOperation, CANVAS_BLEND_MODE_DESCRIPTIONS[b] )
        // console.info("mirror created", canvas.width, canvas.height , notes.length, {firstNoteNumber, mirror, canvas, context, mirrorContext, noteSize, notes })
        return
    }
      
    switch (evt.data.type)
    {
        case "data":
			console.log( evt.data.results )
			results = evt.data.results
			render( evt.data.time )
			break

        case "resize":
            // FIXME: If we are on a 4k screen this may be a huge width
            // so we should have a divison factor to scale the canvas for
            // higher than 2048 then divide the size by 2 and use CSS to scale it
            canvas.width = evt.data.displayWidth
            canvas.height = evt.data.displayHeight
            //console.error("mirror", noteSize, evt.data.displayWidth, evt.data.displayHeight, canvas.width, canvas.height )
            break
    }
}