import { definePhotosynthElement } from '../src/element.js'
import { PHOTOSYNTH_MUSIC } from '../src/index.js'

definePhotosynthElement()
const controller = document.querySelector('photosynth-input')
const output = document.querySelector('#event')
controller.addEventListener(PHOTOSYNTH_MUSIC, event => {
	output.textContent = JSON.stringify(event.detail, null, 2)
})
