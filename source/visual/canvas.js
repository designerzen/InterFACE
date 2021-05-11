
export const canvas = document.querySelector("canvas")
export const canvasContext = canvas.getContext('2d')

let width = canvas.width
let height = canvas.height

export const updateCanvasSize = (w,h) => {
	width = w || canvas.width
	height = h || canvas.height
	// console.error("Updated canvas size to", {w,h}, canvas.width, canvas.height)
}

export const getCanvasDimensions = () => { 
	return {
		width, height
	}
	// width:canvas.width, 
	// height:canvas.height 
}


export const clear = () => {
	// canvasContext.fillStyle = 'rgba(255,0,0,0)'
	canvasContext.clearRect(0, 0, width, height)
	// canvasContext.fillRect(0, 0, width, height)
	// canvasContext.restore()
}

//////////////////////////////////////////////////////////////////////
// Overwrite the existing canvas with another -> funky effects!	
//////////////////////////////////////////////////////////////////////
export const overdraw = (x=0, y=-1) => {
	
	canvasContext.save()
	
	//canvasContext.translate(0, -1)
	canvasContext.drawImage(canvas,x,y)
	// for (var i = 0; i < numImages; i++) {
	// 	canvasContext.drawImage(img, i * img.width, 0);
	// }
	canvasContext.restore()
}

//////////////////////////////////////////////////////////////////////
// FIXME: Wrap in ty catch always
//////////////////////////////////////////////////////////////////////
export const copyCanvasToClipboard = async () => canvas.toBlob(async (blob) => {
	await navigator.clipboard.write([ new ClipboardItem({ [blob.type]:blob }) ])
})

export const drawElement = element => {
	
	canvasContext.save()
	canvasContext.translate(width, 0)
	canvasContext.scale(-1, 1)
	// draw data frame to canvas but invert horizontally?
	canvasContext.drawImage(element , 0, 0)
	canvasContext.restore()
}