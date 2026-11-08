import {
	DISPLAY_COMPOSITE, DISPLAY_CANVAS_2D, DISPLAY_MEDIA_VISION_2D,
	DISPLAY_MEDIA_PIPE_2D, DISPLAY_WEB_GL_3D, DISPLAY_WEB_GPU_3D,
	DISPLAY_BABYLON_3D, DISPLAY_THREE_WEBGPU_PARTICLE,
	DISPLAY_LOOKING_GLASS_3D, DISPLAY_LOOKING_GLASS_WEBGPU,
	DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL
} from '../display/display-types.js'

const icon = content => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`
const face = '<rect x="5" y="3" width="14" height="18" rx="6"/><path d="M8 9h1m6 0h1m-7 6q3 3 6 0"/>'
const glass = '<path d="M3 5h18v14H3zM7 5v14m5-14v14m5-14v14"/>'

// UI metadata stays separate from the renderer modules so menus load cheaply.
export const DISPLAY_ICONS = {
	[DISPLAY_COMPOSITE]: icon('<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>'),
	[DISPLAY_CANVAS_2D]: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m5 16 4-6 4 4 3-7 3 9"/>'),
	[DISPLAY_MEDIA_VISION_2D]: icon(face),
	[DISPLAY_MEDIA_PIPE_2D]: icon(`${face}<path d="M2 5v5m0 4v5"/>`),
	[DISPLAY_WEB_GL_3D]: icon('<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M12 2v10M3 17l9-5 9 5"/>'),
	[DISPLAY_WEB_GPU_3D]: icon('<path d="m13 2-7 11h6l-1 9 7-12h-6z"/><circle cx="3" cy="6" r="1"/><circle cx="21" cy="18" r="1"/>'),
	[DISPLAY_BABYLON_3D]: icon('<path d="M5 3h8a4 4 0 0 1 0 8H5zm0 8h9a5 5 0 0 1 0 10H5zM9 3v18"/>'),
	[DISPLAY_THREE_WEBGPU_PARTICLE]: icon('<path d="m12 3 10 18H2zM7 12h10M7 21l5-9 5 9M12 3v9"/>'),
	[DISPLAY_LOOKING_GLASS_3D]: icon(`${glass}<path d="m9 9 5 3-5 3z"/>`),
	[DISPLAY_LOOKING_GLASS_WEBGPU]: icon(`${glass}<path d="m13 8-3 4h4l-3 4"/>`),
	[DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL]: icon(`${glass}<path d="m10 9-3 3 3 3m4-6 3 3-3 3"/>`)
}
