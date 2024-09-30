import { now } from '../timing/timing.js'
import { takePhotograph } from '../visual/2d'

let photographCounter = 0

export const createPhotographElement = (canvas) => {
	const unique = (1000 + (++photographCounter) + "" ).replace("1","")
	const id = `photograph-${unique}`
	const dimensions = {
		w:canvas.width,
		h:canvas.height
	}
	const img = new Image()
	img.src = takePhotograph(canvas)
	img.alt = "Photograph taken " + Date.now().toString()
	img.width = dimensions.width
	img.height = dimensions.height

	const anchor = document.createElement("a")
	anchor.href = img.src
	anchor.innerHTML = `Click to download this photograph`
	anchor.id = id
	anchor.download = `snapshot-${unique}.png`
	anchor.appendChild(img)

	//document.getElementById("photographs").appendChild(anchor)
	return anchor
}


export const appendPhotographElement = (canvas) => {
	const photo = createPhotographElement( canvas )
	document.getElementById("taken-photographs").appendChild( photo )
	// Scroll the photograph frame into view
	requestAnimationFrame( ()=>document.getElementById(photo.id).scrollIntoView() )
}