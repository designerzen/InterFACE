import { createDisplay } from './display-manager.js'

// Preserve the older entry point without maintaining a second renderer registry.
export const createEmbeddedDisplay = (canvas, type, options = {}) => createDisplay(canvas, type, options)
