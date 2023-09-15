import { now } from '../timing/timing.js'
import { getCanvasDimensions } from '../visual/canvas'
import { takePhotograph } from '../visual/2d'

export const createPhotographElement = (canvas) => {
	const unique = Math.ceil( now() * 10000000 )
	const id = `photograph-${unique}`
	const dimensions = getCanvasDimensions(canvas)
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
	document.getElementById("photographs").appendChild( photo )
	// Scroll the photograph frame into view
	requestAnimationFrame( ()=>document.getElementById(photo.id).scrollIntoView() )
}