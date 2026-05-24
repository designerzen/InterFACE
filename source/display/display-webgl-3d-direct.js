/**
 * Raw WebGL 2.0 implementation for 3D landmarks
 * No external libraries (No Three.js, No Babylon)
 * Based on working TypeScript implementation from displays/DisplayWebGL3d.ts
 */

import AbstractDisplay from './display-abstract.js'
import { DISPLAY_WEB_GL_3D } from './display-types.js'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from '../settings/options.displays.js'
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js'
import { subdivideKeypoints } from '../models/avatar.js'
import { getDisplayColourAlpha, getPredictionLandmarks } from './display-landmarks.js'

const DEFAULT_OPTIONS_DISPLAY_WEBGL_3D = {
	debug: false,
	stats: false,
	resize: true,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	opacity: 1,
	dotSize: 2,
	geometrySubdivisions: 0
}

export default class DisplayWebGL3D extends AbstractDisplay {

	name = DISPLAY_WEB_GL_3D
	transparentCanvas = true

	get type() {
		return DISPLAY_WEB_GL_3D
	}

	// WebGL core
	gl = null
	program = null
	vao = null
	vbo = null
	ibo = null
	lineCount = 0

	// Uniform locations
	uProjectionMatrix = null
	uPointSize = null
	uColor = null

	// DPR tracking
	dpr = 1

	constructor(canvas, initialWidth = 1920, initialHeight = 1080, options = DEFAULT_OPTIONS_DISPLAY_WEBGL_3D) {
		options = Object.assign({}, DEFAULT_OPTIONS_DISPLAY_WEBGL_3D, options)
		super(canvas, initialWidth, initialHeight, options)

		this.dpr = 1

		this.initWebGL(canvas).then(e => {
			this.loadComplete('ready')
		}).catch(error => {
			console.error('ERROR loading WebGL 3D display', error)
			this.loadFailed(error)
		})
	}

	/**
	 * Initialize WebGL2 context and shaders
	 */
	async initWebGL(canvas) {
		this.gl = canvas.getContext('webgl2', {
			antialias: true,
			alpha: true,
			preserveDrawingBuffer: true
		})

		if (!this.gl) {
			throw new Error('WebGL 2.0 not supported')
		}

		// Vertex shader
		const vsSource = `#version 300 es
			layout(location = 0) in vec3 aPosition;
			uniform mat4 uProjectionMatrix;
			uniform float uPointSize;
			void main() {
				gl_Position = uProjectionMatrix * vec4(aPosition, 1.0);
				gl_PointSize = uPointSize;
			}
		`

		// Fragment shader
		const fsSource = `#version 300 es
			precision mediump float;
			uniform vec4 uColor;
			out vec4 outColor;
			void main() {
				outColor = uColor;
			}
		`

		this.program = this.createProgram(vsSource, fsSource)
		this.gl.useProgram(this.program)

		// Enable alpha blending
		this.gl.enable(this.gl.BLEND)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
		this.gl.clearColor(0, 0, 0, 0)

		// Get uniform locations
		this.uProjectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix')
		this.uPointSize = this.gl.getUniformLocation(this.program, 'uPointSize')
		this.uColor = this.gl.getUniformLocation(this.program, 'uColor')

		// Setup VAO & VBO
		this.vao = this.gl.createVertexArray()
		this.vbo = this.gl.createBuffer()
		this.ibo = this.gl.createBuffer()

		this.gl.bindVertexArray(this.vao)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
		this.gl.enableVertexAttribArray(0)
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0)

		// Pre-fill index buffer for lines
		const indices = new Uint16Array(MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.flat())
		this.lineCount = indices.length
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo)
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)

		this.updateProjection()
		this.available = true
	}

	/**
	 * Create WebGL program from vertex and fragment shaders
	 */
	createProgram(vsSource, fsSource) {
		const vs = this.compileShader(this.gl.VERTEX_SHADER, vsSource)
		const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource)
		const program = this.gl.createProgram()
		this.gl.attachShader(program, vs)
		this.gl.attachShader(program, fs)
		this.gl.linkProgram(program)
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw new Error('Program link error: ' + this.gl.getProgramInfoLog(program))
		}
		return program
	}

	/**
	 * Compile individual shader
	 */
	compileShader(type, source) {
		const shader = this.gl.createShader(type)
		this.gl.shaderSource(shader, source)
		this.gl.compileShader(shader)
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			const info = this.gl.getShaderInfoLog(shader)
			this.gl.deleteShader(shader)
			throw new Error('Shader compile error: ' + info)
		}
		return shader
	}

	/**
	 * Update projection matrix
	 */
	updateProjection() {
		if (!this.gl || !this.uProjectionMatrix) return

		// Orthographic projection: (0,0) top-left, (W,H) bottom-right
		const left = 0
		const right = this.canvasWidth
		const top = 0
		const bottom = this.canvasHeight
		const near = -1000
		const far = 1000

		// Column-major mat4
		const ortho = new Float32Array([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, -2 / (far - near), 0,
			-(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
		])

		this.gl.uniformMatrix4fv(this.uProjectionMatrix, false, ortho)
	}

	/**
	 * Transform landmark data to screen coordinates
	 */
	transformData(data, internalScale, regionSize, offsetX, offsetY) {
		const numPoints = Math.floor(data.length / 3)
		const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
		const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale)
		const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale)
		const offX = offsetX || 0
		const offY = offsetY || 0

		const transformedData = new Float32Array(numPoints * 3)
		for (let i = 0; i < numPoints; i++) {
			transformedData[i * 3] = data[i * 3] * scaleX + offX
			transformedData[i * 3 + 1] = data[i * 3 + 1] * scaleY + offY
			transformedData[i * 3 + 2] = data[i * 3 + 2] * scaleX
		}
		return transformedData
	}

	/**
	 * Hex color to RGBA
	 */
	hexToRgba(hex) {
		// Remove # if present
		hex = hex.replace('#', '')
		
		// Parse hex to RGB
		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)
		const a = hex.length > 6 ? parseInt(hex.substring(6, 8), 16) : 255

		return [r, g, b, a]
	}

	/**
	 * Draw landmarks as points
	 */
	drawLandmarks(data, colorHex, internalScale, regionSize, offsetX, offsetY) {
		if (!this.gl || !this.program) return

		const numPoints = Math.floor(data.length / 3)
		if (numPoints === 0) return
		const transformedData = this.transformData(data, internalScale, regionSize, offsetX, offsetY)

		// Set state
		this.gl.useProgram(this.program)
		this.gl.bindVertexArray(this.vao)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, transformedData, this.gl.DYNAMIC_DRAW)

		// Uniforms
		const [r, g, b, a] = this.hexToRgba(colorHex)
		this.gl.uniform4f(this.uColor, r / 255, g / 255, b / 255, (a / 255) * this.options.opacity)
		this.gl.uniform1f(this.uPointSize, this.options.dotSize)

		// Draw points
		this.gl.drawArrays(this.gl.POINTS, 0, numPoints)
	}

	/**
	 * Draw face mesh connections as lines
	 */
	drawFaceConnections(data, colorHex, internalScale, regionSize, offsetX, offsetY) {
		if (!this.gl || !this.program || !this.ibo) return
		if (Math.floor(data.length / 3) === 0) return

		const transformedData = this.transformData(data, internalScale, regionSize, offsetX, offsetY)

		// Set state
		this.gl.useProgram(this.program)
		this.gl.bindVertexArray(this.vao)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, transformedData, this.gl.DYNAMIC_DRAW)

		// Re-bind IBO
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo)

		// Uniforms
		const [r, g, b, a] = this.hexToRgba(colorHex)
		this.gl.uniform4f(this.uColor, r / 255, g / 255, b / 255, (a / 255) * this.options.opacity)

		// Draw lines
		this.gl.drawElements(this.gl.LINES, this.lineCount, this.gl.UNSIGNED_SHORT, 0)
	}

	/**
	 * Clear canvas
	 */
	clear() {
		if (!this.gl) return
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
	}

	/**
	 * Draw a person's landmarks
	 */
	drawPerson(person, beatJustPlayed, colours, options = {}) {
		const prediction = person.data
		const landmarks = getPredictionLandmarks(prediction)
		if (!prediction || landmarks.length === 0) return

		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		const pointLandmarks = this.options.geometrySubdivisions > 0
			? subdivideKeypoints(landmarks, this.options.geometrySubdivisions)
			: landmarks
		const hue = person.hue || 0

		// Convert landmarks to Float32Array
		const landmarkData = new Float32Array(landmarks.length * 3)
		for (let i = 0; i < landmarks.length; i++) {
			landmarkData[i * 3] = landmarks[i].x || 0
			landmarkData[i * 3 + 1] = landmarks[i].y || 0
			landmarkData[i * 3 + 2] = landmarks[i].z || 0
		}

		const pointData = new Float32Array(pointLandmarks.length * 3)
		for (let i = 0; i < pointLandmarks.length; i++) {
			pointData[i * 3] = pointLandmarks[i].x || 0
			pointData[i * 3 + 1] = pointLandmarks[i].y || 0
			pointData[i * 3 + 2] = pointLandmarks[i].z || 0
		}

		// HSL to Hex
		const hex = this.hslToHex(hue, colours.s || 100, colours.l || 50, getDisplayColourAlpha(colours, options))

		// Draw connections first (so they appear behind points)
		this.drawFaceConnections(landmarkData, hex, 1, undefined, 0, 0)

		// Draw points on top
		this.drawLandmarks(pointData, hex, 1, undefined, 0, 0)
	}

	/**
	 * Convert HSL to hex color
	 */
	hslToHex(h, s, l, a = 1) {
		h = h % 360
		s = s / 100
		l = l / 100

		const c = (1 - Math.abs(2 * l - 1)) * s
		const hp = h / 60
		const x = c * (1 - Math.abs((hp % 2) - 1))

		let r = 0, g = 0, b = 0

		if (hp < 1) { r = c; g = x; b = 0 }
		else if (hp < 2) { r = x; g = c; b = 0 }
		else if (hp < 3) { r = 0; g = c; b = x }
		else if (hp < 4) { r = 0; g = x; b = c }
		else if (hp < 5) { r = x; g = 0; b = c }
		else if (hp < 6) { r = c; g = 0; b = x }

		const m = l - c / 2
		r = Math.round(Math.max(0, Math.min(1, r + m)) * 255)
		g = Math.round(Math.max(0, Math.min(1, g + m)) * 255)
		b = Math.round(Math.max(0, Math.min(1, b + m)) * 255)

		const alpha = Math.round(Math.max(0, Math.min(1, a)) * 255)
		return '#' + [r, g, b, alpha].map(x => x.toString(16).padStart(2, '0')).join('')
	}

	/**
	 * Handle window/canvas resize
	 */
	onResize(width, height) {
		if (this.gl) {
			this.canvas.width = Math.floor(width)
			this.canvas.height = Math.floor(height)
			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
			this.updateProjection()
		}
	}

	/**
	 * Render
	 */
	render() {
		this.count++
		super.render()
	}

	/**
	 * Draw bars (audio visualization) - not implemented for WebGL
	 */
	drawBars(dataArray, bufferLength) {
		// To be implemented if needed
	}

	/**
	 * Draw visualiser - not implemented for WebGL
	 */
	drawVisualiser(dataArray, bufferLength, type) {
		// To be implemented if needed
	}

	/**
	 * Draw instrument - not implemented for WebGL
	 */
	drawInstrument(boundingBox, instrumentName, extra) {
		// To be implemented if needed
	}

	drawText(x, y, text, size, align, font, invertColours) {
		// Text is rendered by DisplayOverlay2d; do not request a 2D context
		// from a canvas already owned by WebGL.
	}

	drawParagraph(x, y, paragraphs, size, lineHeight, invertColours) {
		// Text is rendered by DisplayOverlay2d.
	}

	/**
	 * Draw emoticon - not implemented for WebGL
	 */
	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false) {
		// To be implemented if needed
	}

	/**
	 * Set filter
	 */
	setFilter(filterIndex) {
		// To be implemented if needed
	}

	/**
	 * Next filter
	 */
	nextFilter() {
		// To be implemented if needed
	}

	/**
	 * Reset filter
	 */
	resetFilter() {
		// To be implemented if needed
	}

	/**
	 * Post-process
	 */
	postProcess(options) {
		// To be implemented if needed
	}

	/**
	 * Take screenshot
	 */
	takePhotograph(type = 'image/png') {
		if (this.canvas && this.canvas instanceof HTMLCanvasElement) {
			return this.canvas.toDataURL(type)
		}
		return null
	}

	/**
	 * Cleanup and destroy
	 */
	async destroy() {
		if (this.gl) {
			this.gl.deleteBuffer(this.vbo)
			this.gl.deleteVertexArray(this.vao)
			this.gl.deleteProgram(this.program)
			this.gl = null
		}

		this.cancelAnimationLoop()
		return super.destroy()
	}
}
