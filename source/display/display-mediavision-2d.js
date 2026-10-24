import Display2D from './display-canvas-2d.js'
import { FaceLandmarker, DrawingUtils } from '@mediapipe/tasks-vision'
import { drawFace } from '../visual/2d.face.js'
import { drawEye } from '../visual/2d.eyes.js'
import { DISPLAY_MEDIA_VISION_2D } from './display-types.js'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from '../settings/options.displays.js'

/** Shared face renderer for both Tasks Vision and legacy model predictions. */
export default class DisplayMediaVision2D extends Display2D {
 name = DISPLAY_MEDIA_VISION_2D
 drawsFaceFeaturesOnCanvas = true
 get type(){ return DISPLAY_MEDIA_VISION_2D }
 constructor(canvas, width, height, options = {}){
  // The former worker path transferred an already-owned context and never drew faces.
  super(canvas, width, height, { updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES, geometrySubdivisions: 0, ...options, offscreen: false })
 }
 async create(canvas, options){
  await super.create(canvas, options)
  this.drawingUtils = new DrawingUtils(this.canvasContext)
 }
 drawPerson(person, beatJustPlayed, colours, options = {}){
  if (person.data && this.count % this.options.updateFaceButtonAfter === 0) this.movePersonButton(person, person.data)
  drawFace(this.canvasContext, person, beatJustPlayed, colours, this.drawingUtils, FaceLandmarker, { ...this.options, ...options })
 }
 drawEye(eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions){
  drawEye(this.canvasContext, eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions)
 }
}
