/**
 * WebGPU implementation for 3D landmarks
 * Based on working TypeScript implementation from displays/DisplayWebGPU.ts
 */

import AbstractDisplay from './display-abstract.js'
import { DISPLAY_WEB_GPU_3D } from './display-types.js'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from '../settings/options.displays.js'
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js'

const DEFAULT_OPTIONS_DISPLAY_WEBGPU_3D = {
	debug: false,
	stats: false,
	resize: true,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	opacity: 1,
	dotSize: 5
}

export default class DisplayWebGPU extends AbstractDisplay {

	name = DISPLAY_WEB_GPU_3D

	get type() {
		return DISPLAY_WEB_GPU_3D
	}

	// WebGPU resources
	context = null
	device = null
	pipeline = null
	linePipeline = null
	lineIndexBuffer = null
	lineIndexCount = 0
	uniformBuffer = null
	bindGroup = null

	// DPR tracking
	dpr = 1

	constructor(canvas, initialWidth = 1920, initialHeight = 1080, options = DEFAULT_OPTIONS_DISPLAY_WEBGPU_3D) {
		options = Object.assign({}, DEFAULT_OPTIONS_DISPLAY_WEBGPU_3D, options)
		super(canvas, initialWidth, initialHeight, options)

		this.dpr = window.devicePixelRatio || 1

		const ctx = canvas.getContext('webgpu')
		if (ctx) {
			this.context = ctx
		} else {
			this.loadFailed(new Error('WebGPU context failed'))
			return
		}

		this.init().then(e => {
			this.loadComplete('ready')
		}).catch(error => {
			console.error('ERROR loading WebGPU display', error)
			this.loadFailed(error)
		})
	}

	/**
	 * Initialize WebGPU
	 */
	async init() {
		if (!navigator.gpu) throw new Error('WebGPU not supported')

		const adapter = await navigator.gpu.requestAdapter()
		if (!adapter) throw new Error('No WebGPU Adapter found')

		this.device = await adapter.requestDevice()
		if (!this.device) throw new Error('Failed to create WebGPU device')

		// Pre-allocate line index buffer
		const flatIndices = new Uint16Array(MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.flat())
		this.lineIndexCount = flatIndices.length
		this.lineIndexBuffer = this.device.createBuffer({
			size: flatIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true
		})
		new Uint16Array(this.lineIndexBuffer.getMappedRange()).set(flatIndices)
		this.lineIndexBuffer.unmap()

		this.createPipelines()

		// Configure context
		const format = navigator.gpu.getPreferredCanvasFormat()
		this.context.configure({
			device: this.device,
			format: format,
			alphaMode: 'premultiplied'
		})

		this.available = true
	}

	/**
	 * Create rendering pipelines
	 */
	createPipelines() {
		if (!this.device) return

		const shaderModule = this.device.createShaderModule({
			code: `
				struct Uniforms {
					resolution: vec2f,
					pointSize: f32,
					color: vec4f,
				}
				@binding(0) @group(0) var<uniform> uniforms: Uniforms;

				struct VertexOutput {
					@builtin(position) position: vec4f,
				}

				@vertex
				fn vs_dots(@builtin(vertex_index) v_idx: u32, @location(0) l_pos: vec2f) -> VertexOutput {
					var pos = vec2f(0.0, 0.0);
					if (v_idx == 0u) { pos = vec2f(-1.0, -1.0); }
					if (v_idx == 1u) { pos = vec2f( 1.0, -1.0); }
					if (v_idx == 2u) { pos = vec2f(-1.0,  1.0); }
					if (v_idx == 3u) { pos = vec2f( 1.0,  1.0); }

					let p_offset = pos * (uniforms.pointSize * 0.5);
					let final_p = l_pos + p_offset;
					
					let clip_x = (final_p.x / uniforms.resolution.x) * 2.0 - 1.0;
					let clip_y = (final_p.y / uniforms.resolution.y) * 2.0 - 1.0;
					
					var out: VertexOutput;
					out.position = vec4f(clip_x, -clip_y, 0.0, 1.0);
					return out;
				}

				@vertex
				fn vs_lines(@location(0) l_pos: vec2f) -> VertexOutput {
					let clip_x = (l_pos.x / uniforms.resolution.x) * 2.0 - 1.0;
					let clip_y = (l_pos.y / uniforms.resolution.y) * 2.0 - 1.0;
					
					var out: VertexOutput;
					out.position = vec4f(clip_x, -clip_y, 0.0, 1.0);
					return out;
				}

				@fragment
				fn fs_main() -> @location(0) vec4f {
					return uniforms.color;
				}
			`
		})

		const blendState = {
			color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
			alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
		}

		const format = navigator.gpu.getPreferredCanvasFormat()

		// Dots Pipeline
		this.pipeline = this.device.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: shaderModule,
				entryPoint: 'vs_dots',
				buffers: [{
					arrayStride: 8,
					stepMode: 'instance',
					attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }]
				}]
			},
			fragment: {
				module: shaderModule,
				entryPoint: 'fs_main',
				targets: [{
					format: format,
					blend: blendState
				}]
			},
			primitive: {
				topology: 'triangle-strip'
			}
		})

		// Lines Pipeline
		this.linePipeline = this.device.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: shaderModule,
				entryPoint: 'vs_lines',
				buffers: [{
					arrayStride: 8,
					stepMode: 'vertex',
					attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }]
				}]
			},
			fragment: {
				module: shaderModule,
				entryPoint: 'fs_main',
				targets: [{
					format: format,
					blend: blendState
				}]
			},
			primitive: {
				topology: 'line-list'
			}
		})
	}

	/**
	 * Hex color to RGBA
	 */
	hexToRgba(hex) {
		hex = hex.replace('#', '')
		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)
		const a = hex.length > 6 ? parseInt(hex.substring(6, 8), 16) : 255
		return [r, g, b, a]
	}

	/**
	 * Convert HSL to hex color
	 */
	hslToHex(h, s, l) {
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

		return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
	}

	/**
	 * Draw landmarks as points and lines
	 */
	drawLandmarks(data, colorHex) {
		if (!this.device || !this.pipeline || !this.linePipeline) return

		const numPoints = Math.floor(data.length / 2)
		if (numPoints === 0) return

		// Create uniforms
		const uniformData = new Float32Array([
			this.canvasWidth,
			this.canvasHeight,
			this.options.dotSize * this.dpr,
			0, // padding
			...this.hexToRgba(colorHex).map(v => v / 255)
		])

		const uniformBuffer = this.device.createBuffer({
			size: uniformData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true
		})
		new Float32Array(uniformBuffer.getMappedRange()).set(uniformData)
		uniformBuffer.unmap()

		// Create vertex buffer for landmarks
		const vertexBuffer = this.device.createBuffer({
			size: data.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true
		})
		new Float32Array(vertexBuffer.getMappedRange()).set(data)
		vertexBuffer.unmap()

		// Create bind group
		const bindGroup = this.device.createBindGroup({
			layout: this.pipeline.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
		})

		// Begin render pass
		const commandEncoder = this.device.createCommandEncoder()
		const textureView = this.context.getCurrentTexture().createView()

		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: textureView,
				clearValue: { r: 0, g: 0, b: 0, a: 0 },
				loadOp: 'clear',
				storeOp: 'store'
			}]
		})

		// Draw lines first
		if (this.lineIndexBuffer && this.lineIndexCount > 0) {
			renderPass.setPipeline(this.linePipeline)
			renderPass.setBindGroup(0, bindGroup)
			renderPass.setVertexBuffer(0, vertexBuffer)
			renderPass.setIndexBuffer(this.lineIndexBuffer, 'uint16')
			renderPass.drawIndexed(this.lineIndexCount, 1, 0, 0, 0)
		}

		// Draw points on top
		renderPass.setPipeline(this.pipeline)
		renderPass.setBindGroup(0, bindGroup)
		renderPass.setVertexBuffer(0, vertexBuffer)
		renderPass.draw(4, numPoints, 0, 0)

		renderPass.end()
		this.device.queue.submit([commandEncoder.finish()])

		// Cleanup
		uniformBuffer.destroy()
		vertexBuffer.destroy()
	}

	/**
	 * Clear canvas
	 */
	clear() {
		if (!this.device) return

		const commandEncoder = this.device.createCommandEncoder()
		const textureView = this.context.getCurrentTexture().createView()

		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: textureView,
				clearValue: { r: 0, g: 0, b: 0, a: 0 },
				loadOp: 'clear',
				storeOp: 'store'
			}]
		})

		renderPass.end()
		this.device.queue.submit([commandEncoder.finish()])
	}

	/**
	 * Draw a person's landmarks
	 */
	drawPerson(person, beatJustPlayed, colours, options = {}) {
		const prediction = person.data
		if (!prediction || !prediction.landmarks) return

		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		const landmarks = prediction.landmarks
		const hue = person.hue || 0

		// Convert landmarks to Float32Array (2D for WebGPU shader)
		const landmarkData = new Float32Array(landmarks.length * 2)
		for (let i = 0; i < landmarks.length; i++) {
			landmarkData[i * 2] = (landmarks[i].x || 0) * this.canvasWidth
			landmarkData[i * 2 + 1] = (landmarks[i].y || 0) * this.canvasHeight
		}

		const hex = this.hslToHex(hue, colours.s || 100, colours.l || 50)
		this.drawLandmarks(landmarkData, hex)
	}

	/**
	 * Handle window/canvas resize
	 */
	onResize(width, height) {
		if (this.device) {
			this.canvas.width = Math.floor(width * this.dpr)
			this.canvas.height = Math.floor(height * this.dpr)
		}
	}

	/**
	 * Render
	 */
	render() {
		this.count++
		this.onRender()
	}

	/**
	 * Draw bars (audio visualization) - not implemented for WebGPU
	 */
	drawBars(dataArray, bufferLength) {
		// To be implemented if needed
	}

	/**
	 * Draw visualiser - not implemented for WebGPU
	 */
	drawVisualiser(dataArray, bufferLength, type) {
		// To be implemented if needed
	}

	/**
	 * Draw instrument - not implemented for WebGPU
	 */
	drawInstrument(boundingBox, instrumentName, extra) {
		// To be implemented if needed
	}

	/**
	 * Draw text
	 */
	drawText(x, y, text, size, align, font, invertColours) {
		const canvas = this.canvas
		if (canvas instanceof HTMLCanvasElement) {
			const ctx2d = canvas.getContext('2d')
			if (ctx2d) {
				ctx2d.font = `${size}px ${font || 'Arial'}`
				ctx2d.textAlign = align || 'left'
				ctx2d.textBaseline = 'top'
				ctx2d.fillStyle = invertColours ? '#000000' : '#FFFFFF'
				ctx2d.fillText(text, x, y)
			}
		}
	}

	/**
	 * Draw paragraph
	 */
	drawParagraph(x, y, paragraphs, size, lineHeight, invertColours) {
		const canvas = this.canvas
		if (canvas instanceof HTMLCanvasElement) {
			const ctx2d = canvas.getContext('2d')
			if (ctx2d) {
				ctx2d.font = `${size}px Arial`
				ctx2d.textAlign = 'left'
				ctx2d.textBaseline = 'top'
				ctx2d.fillStyle = invertColours ? '#000000' : '#FFFFFF'

				let currentY = y
				for (const line of paragraphs) {
					ctx2d.fillText(line, x, currentY)
					currentY += (lineHeight || size * 1.2)
				}
			}
		}
	}

	/**
	 * Draw emoticon - not implemented for WebGPU
	 */
	drawEmoticon(x, y, emoji, rotationZ, rotationY, rotationX, activeCircleIndex, flipX) {
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
		if (this.device) {
			this.lineIndexBuffer?.destroy()
			this.uniformBuffer?.destroy()
			this.device = null
		}

		this.cancelAnimationLoop()
		return super.destroy()
	}
}
