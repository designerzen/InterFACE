import { hexToRgba } from './colorUtils'
import AbstractDisplay from './AbstractDisplay'
import { displaySettings } from './DisplaySettings'
import type { DisplayOptions } from './types'
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js'
import type { IDisplay } from './IDisplay'

export class DisplayWebGPU extends AbstractDisplay implements IDisplay {
    name: string = 'DisplayWebGPU3D'
    private context!: GPUCanvasContext
    private device: GPUDevice | null = null
    private pipeline: GPURenderPipeline | null = null
    private linePipeline: GPURenderPipeline | null = null
    private lineIndexBuffer: GPUBuffer | null = null
    private lineIndexCount: number = 0


    // Frame management
    private commandEncoder: GPUCommandEncoder | null = null
    private currentView: GPUTextureView | null = null

    constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        initialWidth: number = 1920,
        initialHeight: number = 1080,
        options: DisplayOptions = {}
    ) {
        super(canvas, initialWidth, initialHeight, options)

        const ctx = this.canvas.getContext('webgpu')
        if (ctx) {
            this.context = ctx as unknown as GPUCanvasContext
        } else {
            throw new Error("WebGPU context failed")
        }

        this.init()
            .then(() => {
                this.loadComplete('ready')
            })
            .catch((error) => {
                console.error('ERROR loading WebGPU display', error)
                this.loadFailed(error)
            })
    }



    async init() {
        if (!navigator.gpu) throw new Error("WebGPU not supported")
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) throw new Error("No WebGPU Adapter found")
        const device = await adapter.requestDevice()
        if (!device) throw new Error("Failed to create WebGPU device")

        // Cast to any/unknown to resolve the __brand issue in some environments
        this.device = device as unknown as GPUDevice

        // Pre-allocate line index buffer
        const flatIndices = new Uint16Array(MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.flat())
        this.lineIndexCount = flatIndices.length
        this.lineIndexBuffer = this.device.createBuffer({
            size: flatIndices.byteLength,
            usage: (globalThis as any).GPUBufferUsage.INDEX | (globalThis as any).GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        })
        new Uint16Array(this.lineIndexBuffer.getMappedRange()).set(flatIndices)
        this.lineIndexBuffer.unmap()

        this.createPipelines()

        // Configure context immediately so it's ready before first render/resize
        this.context.configure({
            device: this.device,
            format: (navigator.gpu as any).getPreferredCanvasFormat ? (navigator.gpu as any).getPreferredCanvasFormat() : (navigator as any).gpu.getPreferredCanvasFormat(),
            alphaMode: 'premultiplied',
        })
    }

    private createPipelines() {
        if (!this.device || !navigator.gpu) return

        const shaderModule = this.device.createShaderModule({
            code: `
                struct Uniforms {
                    resolution: vec2f,
                    pointSize: f32,
                    color: vec4f,
                }
                @binding(0) @group(0) var<uniform> uniforms: Uniforms

                struct VertexOutput {
                    @builtin(position) position: vec4f,
                }

                @vertex
                fn vs_dots(@builtin(vertex_index) v_idx: u32, @location(0) l_pos: vec2f) -> VertexOutput {
                    var pos = vec2f(0.0, 0.0)
                    if (v_idx == 0u) { pos = vec2f(-1.0, -1.0); }
                    if (v_idx == 1u) { pos = vec2f( 1.0, -1.0); }
                    if (v_idx == 2u) { pos = vec2f(-1.0,  1.0); }
                    if (v_idx == 3u) { pos = vec2f( 1.0,  1.0); }

                    let p_offset = pos * (uniforms.pointSize * 0.5)
                    let final_p = l_pos + p_offset
                    
                    let clip_x = (final_p.x / uniforms.resolution.x) * 2.0 - 1.0
                    let clip_y = (final_p.y / uniforms.resolution.y) * 2.0 - 1.0
                    
                    var out: VertexOutput
                    out.position = vec4f(clip_x, -clip_y, 0.0, 1.0)
                    return out
                }

                @vertex
                fn vs_lines(@location(0) l_pos: vec2f) -> VertexOutput {
                    let clip_x = (l_pos.x / uniforms.resolution.x) * 2.0 - 1.0
                    let clip_y = (l_pos.y / uniforms.resolution.y) * 2.0 - 1.0
                    
                    var out: VertexOutput
                    out.position = vec4f(clip_x, -clip_y, 0.0, 1.0)
                    return out
                }

                @fragment
                fn fs_main() -> @location(0) vec4f {
                    return uniforms.color
                }
            `
        })

        const blendState: GPUBlendState = {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
        }

        const canvasFormat = navigator.gpu.getPreferredCanvasFormat()

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
                    format: canvasFormat,
                    blend: blendState
                }]
            },
            primitive: { topology: 'triangle-strip' }
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
                    format: canvasFormat,
                    blend: blendState
                }]
            },
            primitive: { topology: 'line-list' }
        })
    }

    override onResize(_width: number, _height: number): void {
        if (this.device && navigator.gpu) {
            this.context.configure({
                device: this.device,
                format: navigator.gpu.getPreferredCanvasFormat(),
                alphaMode: 'premultiplied',
            })
        }
    }

    override clear() {
        if (!this.device) return
        // Reset draw-call index so each frame's slots start from 0
        this.drawCallIndex = 0
        this.commandEncoder = this.device.createCommandEncoder()
        this.currentView = this.context.getCurrentTexture().createView()

        const pass = this.commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.currentView,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }]
        })
        pass.end()
    }


    // Counts draw calls within the current frame so each gets its own pre-allocated buffer.
    private drawCallIndex: number = 0
    private instanceBuffers: (GPUBuffer | null)[] = []
    private uniformBuffers: (GPUBuffer | null)[] = []

    private getBuffers(points: Float32Array): { instBuf: GPUBuffer, uniBuf: GPUBuffer } {
        if (!this.device) throw new Error("No device")
        const idx = this.drawCallIndex++

        // Dynamic re-allocation if buffer is too small
        if (!this.instanceBuffers[idx] || this.instanceBuffers[idx]!.size < points.byteLength) {
            if (this.instanceBuffers[idx]) {
                this.instanceBuffers[idx]!.destroy()
            }
            this.instanceBuffers[idx] = this.device.createBuffer({
                size: Math.max(points.byteLength, 128), // ensure minimum size
                usage: (globalThis as any).GPUBufferUsage.VERTEX | (globalThis as any).GPUBufferUsage.COPY_DST
            })
        }

        if (!this.uniformBuffers[idx]) {
            this.uniformBuffers[idx] = this.device.createBuffer({
                size: 32, usage: (globalThis as any).GPUBufferUsage.UNIFORM | (globalThis as any).GPUBufferUsage.COPY_DST
            })
        }
        return { instBuf: this.instanceBuffers[idx]!, uniBuf: this.uniformBuffers[idx]! }
    }

    private prepareFrame(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number) {
        if (!this.device) return null

        const numPoints = Math.floor(data.length / 3)
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale)
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale)
        const offX = offsetX || 0
        const offY = offsetY || 0

        const points = new Float32Array(numPoints * 2)
        for (let i = 0; i < numPoints; i++) {
            points[i * 2] = data[i * 3] * scaleX + offX
            points[i * 2 + 1] = data[i * 3 + 1] * scaleY + offY
        }

        const { instBuf, uniBuf } = this.getBuffers(points)

        // Upload landmark positions
        this.device.queue.writeBuffer(instBuf, 0, points)

        // Upload uniforms: resolution, pointSize, color
        const [r, g, b, a] = hexToRgba(colorHex)
        this.device.queue.writeBuffer(uniBuf, 0, new Float32Array([
            this.canvasWidth, this.canvasHeight,
            displaySettings.dotSize * this.dpr, 0,  // pointSize, padding
            r / 255, g / 255, b / 255, (a / 255) * displaySettings.opacity,
        ]))

        return { instBuf, uniBuf, numPoints }
    }

    drawLandmarks(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number) {
        if (!this.device || !this.pipeline || !this.commandEncoder || !this.currentView) return

        const frame = this.prepareFrame(data, colorHex, internalScale, regionSize, offsetX, offsetY)
        if (!frame) return

        const pass = this.commandEncoder.beginRenderPass({
            colorAttachments: [{ view: this.currentView, loadOp: 'load', storeOp: 'store' }]
        })

        pass.setPipeline(this.pipeline)
        pass.setBindGroup(0, this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0) as any,
            entries: [{ binding: 0, resource: { buffer: frame.uniBuf } }]
        }))
        pass.setVertexBuffer(0, frame.instBuf)
        pass.draw(4, frame.numPoints)
        pass.end()
    }

    drawFaceConnections(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number) {
        if (!this.device || !this.linePipeline || !this.commandEncoder || !this.currentView || !this.lineIndexBuffer) return

        const frame = this.prepareFrame(data, colorHex, internalScale, regionSize, offsetX, offsetY)
        if (!frame) return

        const pass = this.commandEncoder.beginRenderPass({
            colorAttachments: [{ view: this.currentView, loadOp: 'load', storeOp: 'store' }]
        })

        pass.setPipeline(this.linePipeline)
        pass.setBindGroup(0, this.device.createBindGroup({
            layout: this.linePipeline.getBindGroupLayout(0) as any,
            entries: [{ binding: 0, resource: { buffer: frame.uniBuf } }]
        }))
        pass.setVertexBuffer(0, frame.instBuf)
        pass.setIndexBuffer(this.lineIndexBuffer, 'uint16')
        pass.drawIndexed(this.lineIndexCount)
        pass.end()
    }

    drawConnectionDots(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number) {
        if (!this.device || !this.pipeline || !this.commandEncoder || !this.currentView) return

        const connectionDotsCount = displaySettings.connectionDotsCount
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale)
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale)
        const offX = offsetX || 0
        const offY = offsetY || 0

        const totalDots = MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.length * connectionDotsCount
        const points = new Float32Array(totalDots * 2)
        let pIdx = 0

        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX
            const sy = data[startIdx * 3 + 1] * scaleY + offY
            const ex = data[endIdx * 3] * scaleX + offX
            const ey = data[endIdx * 3 + 1] * scaleY + offY

            for (let i = 1; i <= connectionDotsCount; i++) {
                const t = i / (connectionDotsCount + 1)
                points[pIdx++] = sx + (ex - sx) * t
                points[pIdx++] = sy + (ey - sy) * t
            }
        }

        const { instBuf, uniBuf } = this.getBuffers(points)

        // Upload landmark positions
        this.device.queue.writeBuffer(instBuf, 0, points)

        // Upload uniforms: resolution, pointSize, color
        const [r, g, b, a] = hexToRgba(colorHex)
        this.device.queue.writeBuffer(uniBuf, 0, new Float32Array([
            this.canvasWidth, this.canvasHeight,
            displaySettings.dotSize * this.dpr, 0,  // pointSize, padding
            r / 255, g / 255, b / 255, a / 255,
        ]))

        const pass = this.commandEncoder.beginRenderPass({
            colorAttachments: [{ view: this.currentView, loadOp: 'load', storeOp: 'store' }]
        })

        pass.setPipeline(this.pipeline)
        pass.setBindGroup(0, this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0) as any,
            entries: [{ binding: 0, resource: { buffer: uniBuf } }]
        }))
        pass.setVertexBuffer(0, instBuf)
        pass.draw(4, totalDots)
        pass.end()
    }

    public drawText(
        x: number,
        y: number,
        text: string,
        size: number = 16,
        align: string = 'left',
        font: string = 'Arial',
        invertColours: boolean = false
    ): void {
        // WebGPU doesn't have native text rendering - use canvas overlay
        const textCanvas = document.createElement('canvas')
        textCanvas.width = 512
        textCanvas.height = 128
        const textCtx = textCanvas.getContext('2d')
        if (!textCtx) {
            console.warn('Could not get 2D context for text rendering in WebGPU')
            return
        }

        // WTF IS THIS???
        const scaledSize = size * this.dpr
        textCtx.font = `${scaledSize}px ${font}`
        textCtx.textAlign = align as CanvasTextAlign
        textCtx.textBaseline = 'top'
        textCtx.fillStyle = invertColours ? '#000000' : '#FFFFFF'

        textCtx.fillText(text, 10, 10)

        // For WebGPU, we need to render text as an overlay using canvas 2D
        // Create a bitmap texture from the text canvas
        if (this.canvas instanceof HTMLCanvasElement) {
            const ctx2d = this.canvas.getContext('2d')
            if (ctx2d) {
                ctx2d.font = `${scaledSize}px ${font}`
                ctx2d.textAlign = align as CanvasTextAlign
                ctx2d.textBaseline = 'top'
                ctx2d.fillStyle = invertColours ? '#000000' : '#FFFFFF'
                ctx2d.fillText(text, x * this.dpr, y * this.dpr)
            }
        }
    }

    submitFrame(): void {
        if (!this.device || !this.commandEncoder) return
        this.device.queue.submit([this.commandEncoder.finish()])
        this.commandEncoder = null
        this.currentView = null
    }
}

export default DisplayWebGPU
