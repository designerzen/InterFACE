import DisplayMediaVision2D from './display-mediavision-2d.js'
import { DISPLAY_MEDIA_PIPE_2D } from './display-types.js'

// Compatibility ID for saved settings; both models use the shared face renderer.
export default class DisplayMediaPipe2D extends DisplayMediaVision2D {
 name = DISPLAY_MEDIA_PIPE_2D
 get type(){ return DISPLAY_MEDIA_PIPE_2D }
}
