/** Persistent, premultiplied paint history independent of the presentation texture. */
export class WebGPUPaint {
	constructor(device, format, width, height){
		this.device = device
		this.format = format
		this.width = Math.max(1, Math.floor(width))
		this.height = Math.max(1, Math.floor(height))
		this.index = 0
		this.uniforms = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
		this.sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' })
		const module = device.createShaderModule({ code: `
			struct Settings { resolution: vec2f, offset: vec2f }
			@group(0) @binding(0) var image: texture_2d<f32>;
			@group(0) @binding(1) var imageSampler: sampler;
			@group(0) @binding(2) var<uniform> settings: Settings;
			@vertex fn vertex(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
				let positions = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
				return vec4f(positions[index], 0.0, 1.0);
			}
			@fragment fn copy(@builtin(position) position: vec4f) -> @location(0) vec4f {
				return textureSampleLevel(image, imageSampler, position.xy / settings.resolution, 0.0);
			}
			@fragment fn feedback(@builtin(position) position: vec4f) -> @location(0) vec4f {
				let original = textureSampleLevel(image, imageSampler, position.xy / settings.resolution, 0.0);
				let uv = (position.xy - settings.offset) / settings.resolution;
				var shifted = vec4f(0.0);
				if (all(uv >= vec2f(0.0)) && all(uv <= vec2f(1.0))) {
					shifted = textureSampleLevel(image, imageSampler, uv, 0.0);
				}
				return shifted + original * (1.0 - shifted.a);
			}
		` })
		const bindLayout = device.createBindGroupLayout({ entries: [
			{ binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {} },
			{ binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
			{ binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }
		] })
		this.bindLayout = bindLayout
		const layout = device.createPipelineLayout({ bindGroupLayouts: [bindLayout] })
		const pipeline = (entryPoint, blend) => device.createRenderPipeline({
			layout, vertex: { module, entryPoint: 'vertex' },
			fragment: { module, entryPoint, targets: [{ format, ...(blend ? { blend } : {}) }] },
			primitive: { topology: 'triangle-list' }
		})
		this.copyPipeline = pipeline('copy')
		this.feedbackPipeline = pipeline('feedback')
		this.paintPipeline = pipeline('copy', {
			color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
			alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
		})
		this.textures = [this.createTexture(), this.createTexture()]
		this.groups = this.textures.map(texture => this.createGroup(texture))
		this.clear()
	}
	createTexture(extraUsage = 0){
		return this.device.createTexture({ size: [this.width, this.height], format: this.format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | extraUsage })
	}
	createGroup(texture){
		return this.device.createBindGroup({ layout: this.bindLayout, entries: [
			{ binding: 0, resource: texture.createView() },
			{ binding: 1, resource: this.sampler },
			{ binding: 2, resource: { buffer: this.uniforms } }
		] })
	}
	get view(){ return this.textures[this.index].createView() }
	clear(){
		const encoder = this.device.createCommandEncoder()
		for (const texture of this.textures) {
			const pass = encoder.beginRenderPass({ colorAttachments: [{ view: texture.createView(),
				clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }] })
			pass.end()
		}
		this.device.queue.submit([encoder.finish()])
		this.index = 0
	}
	blit(view, group, pipeline, loadOp = 'clear', offsetX = 0, offsetY = 0){
		this.device.queue.writeBuffer(this.uniforms, 0, new Float32Array([this.width, this.height, offsetX, offsetY]))
		const encoder = this.device.createCommandEncoder()
		const pass = encoder.beginRenderPass({ colorAttachments: [{ view,
			clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp, storeOp: 'store' }] })
		pass.setPipeline(pipeline)
		pass.setBindGroup(0, group)
		pass.draw(3)
		pass.end()
		this.device.queue.submit([encoder.finish()])
	}
	feedback(offsetX, offsetY){
		const next = 1 - this.index
		this.blit(this.textures[next].createView(), this.groups[this.index], this.feedbackPipeline, 'clear', offsetX, offsetY)
		this.index = next
	}
	paintCanvas(canvas){
		if (!canvas || canvas.width !== this.width || canvas.height !== this.height) return
		if (!this.overlay) {
			this.overlay = this.createTexture(GPUTextureUsage.COPY_DST)
			this.overlayGroup = this.createGroup(this.overlay)
		}
		this.device.queue.copyExternalImageToTexture({ source: canvas }, { texture: this.overlay, premultipliedAlpha: true }, [this.width, this.height])
		this.blit(this.view, this.overlayGroup, this.paintPipeline, 'load')
	}
	present(context){ this.blit(context.getCurrentTexture().createView(), this.groups[this.index], this.copyPipeline) }
	destroy(){
		for (const texture of this.textures) texture.destroy()
		this.overlay?.destroy()
		this.uniforms.destroy()
	}
}
