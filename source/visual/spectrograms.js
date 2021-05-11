
import { canvasContext, getCanvasDimensions  } from './canvas'

let counter = 0
const { width, height} = getCanvasDimensions()

// Visualisations
export const drawWaves = (dataArray, bufferLength)=>{

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

	canvasContext.lineTo(width, height/2)
	canvasContext.stroke()
}


export const drawBars = (dataArray, bufferLength)=>{

	const barWidth = (width / bufferLength) * 2	// number here is just cos we only care about a really narrow band
	let barHeight
	let x = 0

	for(let i = 0; i < bufferLength; i++) 
	{
		barHeight = dataArray[i]

		canvasContext.fillStyle = 'hsla(' + (barHeight/height*360) + ',50%,50%,0.3)'
		canvasContext.fillRect(x, 0, barWidth, barHeight )
// height-barHeight
		x += barWidth + 1
	}

	// console.log("draw bars", dataArray, bufferLength)
}