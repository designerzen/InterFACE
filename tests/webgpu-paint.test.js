import { WebGPUPaint } from '../source/display/webgpu-paint.js'

const createDevice = () => {
	const passes = [], textures = []
	const device = {
		createBuffer: jest.fn(() => ({ destroy: jest.fn() })),
		createSampler: jest.fn(() => ({})), createShaderModule: jest.fn(value => value),
		createBindGroupLayout: jest.fn(value => value), createPipelineLayout: jest.fn(value => value),
		createRenderPipeline: jest.fn(value => value), createBindGroup: jest.fn(value => value),
		createTexture: jest.fn(options => {
			const texture = { options, createView: () => ({ texture }), destroy: jest.fn() }
			textures.push(texture)
			return texture
		}),
		queue: { writeBuffer: jest.fn(), submit: jest.fn(), copyExternalImageToTexture: jest.fn() },
		createCommandEncoder: () => ({
			beginRenderPass(descriptor){
				const pass = { descriptor, setPipeline: jest.fn(), setBindGroup: jest.fn(), draw: jest.fn(), end: jest.fn() }
				passes.push(pass)
				return pass
			}, finish(){}
		})
	}
	return { device, passes, textures }
}

beforeAll(() => {
	global.GPUBufferUsage = { UNIFORM: 1, COPY_DST: 2 }
	global.GPUTextureUsage = { RENDER_ATTACHMENT: 1, TEXTURE_BINDING: 2, COPY_DST: 4 }
	global.GPUShaderStage = { FRAGMENT: 2 }
})

test('feedback alternates history textures without sampling the attachment being written', () => {
	const { device, passes, textures } = createDevice()
	const paint = new WebGPUPaint(device, 'bgra8unorm', 640, 480)
	expect(textures).toHaveLength(2)
	paint.feedback(12, -4)
	let pass = passes.at(-1)
	expect(pass.descriptor.colorAttachments[0].view.texture).toBe(textures[1])
	expect(pass.setBindGroup.mock.calls[0][1].entries[0].resource.texture).toBe(textures[0])
	expect(Array.from(device.queue.writeBuffer.mock.calls.at(-1)[2])).toEqual([640, 480, 12, -4])
	paint.feedback(-3, 2)
	pass = passes.at(-1)
	expect(pass.descriptor.colorAttachments[0].view.texture).toBe(textures[0])
	expect(pass.setBindGroup.mock.calls[0][1].entries[0].resource.texture).toBe(textures[1])
})

test('presentation copies persistent history to a fresh presentation view', () => {
	const { device, passes, textures } = createDevice()
	const paint = new WebGPUPaint(device, 'bgra8unorm', 64, 48)
	const context = { getCurrentTexture: jest.fn(() => ({ createView: () => ({ presentation: true }) })) }
	paint.feedback(1, 0)
	paint.present(context)
	paint.present(context)
	expect(context.getCurrentTexture).toHaveBeenCalledTimes(2)
	expect(passes.at(-1).descriptor.colorAttachments[0].view).toEqual({ presentation: true })
	expect(passes.at(-1).setBindGroup.mock.calls[0][1].entries[0].resource.texture).toBe(textures[1])
	paint.clear()
	expect(paint.view.texture).toBe(textures[0])
})

test('2D effects use premultiplied alpha and every GPU allocation is released', () => {
	const { device, passes, textures } = createDevice()
	const paint = new WebGPUPaint(device, 'bgra8unorm', 64, 48)
	const canvas = { width: 64, height: 48 }
	paint.paintCanvas(canvas)
	expect(device.queue.copyExternalImageToTexture).toHaveBeenCalledWith(
		{ source: canvas }, { texture: textures[2], premultipliedAlpha: true }, [64, 48]
	)
	expect(passes.at(-1).descriptor.colorAttachments[0].loadOp).toBe('load')
	paint.paintCanvas({ width: 32, height: 24 })
	expect(device.queue.copyExternalImageToTexture).toHaveBeenCalledTimes(1)
	paint.destroy()
	for (const texture of textures) expect(texture.destroy).toHaveBeenCalledTimes(1)
	expect(paint.uniforms.destroy).toHaveBeenCalledTimes(1)
})
