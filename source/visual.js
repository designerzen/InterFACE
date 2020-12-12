// const cam = (video) => {

// 	video = video || document.createElement('video')

// 	const stream = await navigator.mediaDevices.getUserMedia({
// 	  audio: false,
// 	  video: {
// 		facingMode: 'user',
// 		width: 640,
// 		height: 640
// 	  }
// 	})

// 	video.srcObject = stream
// }
import { clamp, TAU} from "./maths"


async function startCamera(video) {

	return new Promise( async (resolve,reject) => {
		
		video = video || document.createElement('video')

		const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			facingMode: 'user',
			width: 640,
			height: 640
		}
		})

		video.onloadedmetadata = (event) => { 

			video.play()
			video.width = video.videoWidth
			video.height = video.videoHeight

			console.log("Video camera", video)

			resolve(stream)
		}

		video.srcObject = stream
	
	})
	
  }


export const setupCamera = async (video) => {
	return startCamera(video) 
}


async function loadImage(image) {
	return new Promise( async (resolve,reject) => {
		const setSize = ()=> {
			image.width = image.naturalWidth
			image.height = image.naturalHeight
		}
		// check to see if has already loaded...
		if (image.naturalWidth > 0)
		{
			setSize()
			resolve(image) 
		}else{
			image.onloaded = ()=>{ 
				setSize()
				resolve(image)
			}
			image.onerror = error => reject(error)
		}
	})
}

export const setupImage = async (image) => {
	return loadImage(image) 
}

export const canvas = document.querySelector("canvas")
export const canvasContext = canvas.getContext('2d')

const width = canvas.width
const height = canvas.height

canvasContext.save()

export const clear = () => {
	canvasContext.fillStyle = 'rgba(255,0,0,0)'
	canvasContext.fillRect(0, 0, width, height)
	// canvasContext.restore()
}


export const drawPart = (part, radius=4, colour="red", lines=true) => {
	
	canvasContext.fillStyle  = colour
	canvasContext.strokeStyle = colour
	
	canvasContext.moveTo(part[0][0], part[0][1])
	
	canvasContext.beginPath()
	for (let i = 0,  l= part.length; i < l; i++) 
	{
		const x = part[i][0]
		const y = part[i][1]

		canvasContext.arc(x, y, radius, 0, TAU)
		
		if (lines){
			canvasContext.lineTo(x, y)
		}
	}	
	canvasContext.fill()

	if (lines){
		canvasContext.stroke()
	}
}

export const drawEye = (eye, colour="blue") => {
	canvasContext.fillStyle  = colour
	for (let i = 0; i < eye.length; i++) 
	{
		const x = eye[i][0]
		const y = eye[i][1]
		const z = eye[i][2]

		const radius = 1 + Math.abs(z) * 0.8
		canvasContext.beginPath()
		canvasContext.arc(x, y, radius, 0, TAU)
		canvasContext.fill()
	}
}
export const drawMouth = (lipsUpper, lipsLower, colour="yellow") => {
	const lips = [lipsUpper, lipsLower]
	
	// central piece of the mouth
	const lipUpperMiddle = lipsUpper[5]
	const lipLowerMiddle = lipsLower[5]
	const lipVerticalOpening = lipLowerMiddle[1] - lipUpperMiddle[1]


	canvasContext.fillStyle  = colour
	
	canvasContext.beginPath()
	canvasContext.moveTo(lipsUpper[0][0], lipsUpper[0][1])
	
	for (let l = 0, t=lips.length; l < t; l++) {

		const lip = lips[l]
		
		for (let i = 0, q=lip.length; i < q; i++) 
		{
			const x = lip[i][0]
			const y = lip[i][1]
	
			canvasContext.lineTo(x, y)
		}	
	}
	canvasContext.fill()

	
	
	// debug ----
	// centres
	canvasContext.fillStyle  = 'blue'
	canvasContext.beginPath()
	canvasContext.arc(lipUpperMiddle[0], lipUpperMiddle[1], 5, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.arc(lipLowerMiddle[0], lipLowerMiddle[1], 5, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.moveTo(lipUpperMiddle[0], lipUpperMiddle[1])
	canvasContext.strokeStyle = "orange"
	canvasContext.fillStyle = "orange"
	canvasContext.lineTo(lipLowerMiddle[0], lipLowerMiddle[1])

	canvasContext.stroke( )
	canvasContext.font = "12px Oxanium"
	canvasContext.textAlign = "center"
	canvasContext.fillText(`${Math.floor(lipVerticalOpening)}px`, lipLowerMiddle[0], lipLowerMiddle[1] - 20 );
	// -- debug
	return {lipUpperMiddle, lipLowerMiddle,lipVerticalOpening }
}

export const drawBoundingBox = (boundingBox, colour='red') => {
	const {bottomRight, topLeft} = boundingBox
	canvasContext.beginPath()
	// these aren't scaled :(
	canvasContext.fillStyle  = colour
	// canvasContext.rect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	canvasContext.strokeRect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	canvasContext.fill()
}


// Just draws lots of dots on an image on the canvas
export const drawPoints = (prediction, colour='brown') => {

	const { scaledMesh } = prediction
	
	canvasContext.fillStyle  = colour

	// draw face points at correct position on canvas
	for (let i = 0; i < scaledMesh.length; i++) 
	{
		const x = scaledMesh[i][0]
		const y = scaledMesh[i][1]
		const z = scaledMesh[i][2]

		const radius = 1 + Math.abs(100 - z) * 0.01
		canvasContext.beginPath()
		canvasContext.arc(x, y, radius, 0, TAU)
		canvasContext.fill()
	}
}
export const DEFAULT_COLOURS = {
	dots:'red',
	mouth:'rgba(255,0,0,0.5)',
	lipsUpperInner:'pink',
	lipsLowerInner:'pink',
	midwayBetweenEyes:'blue',
	leftEyeLower0:'red',
	rightEyeLower0:'red',
	leftEyeIris:'yellow',
	rightEyeIris:'yellow',
}
// every frame this gets called with an array of points in a mesh face
// we use certain deviations to determine direction and mouth size
export const drawFace = (prediction, options=DEFAULT_COLOURS) => {

	// extract our data
	// const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
	// const data = imageData.data
	// now change the colour of certain pixels in line with the points
	// for (var i = 0; i < data.length; i += 4) 
	// {
    //     data[i]     = 255 - data[i];     // red
    //     data[i + 1] = 255 - data[i + 1]; // green
    //     data[i + 2] = 255 - data[i + 2]; // blue
    // }
	// canvasContext.putImageData(imageData, 0, 0)
	const { scaledMesh, annotations} = prediction
	
	// MOUTH ==============================================
	const {lipsUpperInner,lipsLowerInner } = annotations
	
	// top lips
	drawPart(lipsUpperInner, options.lipsUpperInner)
	drawPart(lipsLowerInner, options.lipsLowerInner)

	//drawMouth(lipsUpperInner,lipsLowerInner)
	drawMouth(lipsUpperInner,lipsLowerInner,options.mouth)

	// EYES ===========================================
	const {leftEyeIris,rightEyeIris} = annotations
	
	drawEye(leftEyeIris, options.leftEyeIris)
	drawEye(rightEyeIris, options.rightEyeIris)

	const {leftEyeLower0,rightEyeLower0, midwayBetweenEyes} = annotations
	
	drawPart(midwayBetweenEyes, options.midwayBetweenEyes )
	
	drawPart(leftEyeLower0, options.leftEyeLower0 )
	drawPart(rightEyeLower0, options.rightEyeLower0 )

	// these aren't scaled :(
	// canvasContext.fillStyle  = 'orange'
	// canvasContext.beginPath()
	// canvasContext.arc( midwayBetweenEyes[0], midwayBetweenEyes[1], 10, 0, TAU )
	// canvasContext.fill()
}


export const drawWaves = (dataArray, bufferLength)=>{

	canvasContext.lineWidth = 2
	canvasContext.strokeStyle = 'rgb(0, 0, 0)'

	canvasContext.beginPath()

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

	const barWidth = (width / bufferLength) * 2
	let barHeight
	let x = 0

	for(var i = 0; i < bufferLength; i++) 
	{
		barHeight = dataArray[i]

		canvasContext.fillStyle = 'hsla(' + (barHeight/height*360) + ',50%,50%,0.8)'
		canvasContext.fillRect(x, height-barHeight, barWidth, barHeight )

		x += barWidth + 1
	}
	
}