import PALETTE, { DEFAULT_COLOURS } from "../settings/palette.js"

let counter = 0

// Visualisations
export const drawWaves = (canvasContext, dataArray, bufferLength)=>{

	// PALETTE
	canvasContext.lineWidth = 2
	canvasContext.strokeStyle = `hsla(${counter}, 100, 150, 0.5)`
	canvasContext.beginPath()

	counter = counter++ % 360

	const sliceWidth = width * 1.0 / bufferLength
	let x = 0

	for(let i = 0; i < bufferLength; i++) 
	{
	  const v = dataArray[i] / 128
	  const y = v * height / 2

	  if(i === 0) 
	  {
		canvasContext.moveTo(x, y)
	  } else {
		canvasContext.lineTo(x, y)
	  }

	  x += sliceWidth
	}

	canvasContext.lineTo( canvasContext.canvas.width, canvasContext.canvas.height * 0.5 )
	canvasContext.stroke()
}


let colourCycle = 0
export const drawBars = (canvasContext, dataArray, bufferLength)=>{

	// just  do the first 60%
	const section = bufferLength * 0.6
	const barWidth = (canvasContext.canvas.width / section)	// number here is just cos we only care about a really narrow band
	const height = canvasContext.canvas.height
	let barHeight
	let x = 0

	colourCycle = ( colourCycle + 1 ) % 360

	for(let i = 0; i < section; i++) 
	{
		barHeight = dataArray[i]

		canvasContext.fillStyle = 'hsla(' + ( colourCycle + (barHeight/ height *360 ))%360 + ',50%,50%,0.3)'
		// canvasContext.fillRect(x, 0, barWidth, barHeight )
		canvasContext.fillRect(x, height - barHeight, barWidth, barHeight )
		x += barWidth + 1
	}

	// console.log("draw bars", dataArray, bufferLength)
}