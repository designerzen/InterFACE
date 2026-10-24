import {
	WALLPAPER_EFFECTS,
	vertexSource,
	fragmentSource,
} from './shaders/procedural-wallpaper.js'

const FALLBACK_PALETTE = {
	c1: [0, 0, 0],
	c2: [0, 0, 0],
	c3: [0, 0, 0],
	base: [0, 0, 0],
	accent: [0, 0, 0],
	ink: [0, 0, 0],
}

const parseCssColor = (value, fallback) => {
	const context = document.createElement('canvas').getContext('2d')
	if (!context || !value) return fallback
	context.fillStyle = value
	const parsed = context.fillStyle.match(/rgba?\(([^)]+)\)/i)
	if (parsed) {
		const channels = parsed[1].trim().split(/[\s,]+/).slice(0, 3).map(channel => Number.parseFloat(channel.replace('%', '').trim()))
		if (channels.every(Number.isFinite)) return channels.map(channel => channel / 255)
	}
	const hex = context.fillStyle.match(/^#([0-9a-f]{6})$/i)
	if (hex) return [0, 2, 4].map(index => Number.parseInt(hex[1].slice(index, index + 2), 16) / 255)
	return fallback
}

export const readCssPalette = (root = document.documentElement) => {
	const styles = getComputedStyle(root)
	const probe = document.createElement('span')
	const parent = document.body ?? root
	parent.append(probe)
	const read = (name, fallback) => {
		const value = styles.getPropertyValue(name).trim()
		if (!value) return fallback
		probe.style.color = ''
		probe.style.color = value
		if (!probe.style.color) return fallback
		return parseCssColor(getComputedStyle(probe).color, fallback)
	}
	const dark = read('--shade-dark', FALLBACK_PALETTE.base)
	const brown = read('--shade-brown', dark)
	const cream = read('--shade-cream', read('--shade-white', FALLBACK_PALETTE.accent))
	const background = read('--col-bg', dark)
	const transition = read('--col-transition', cream)
	const palette = {
		c1: read('--c1', dark),
		c2: read('--c2', brown),
		c3: read('--c3', dark),
		base: background,
		paper: cream,
		accent: transition,
		ink: dark,
	}
	probe.remove()
	return palette
}

export const createProceduralWallpaper = (canvas, onFailure) => {
	const gl = canvas.getContext('webgl', { depth: false, stencil: false, antialias: false })
	if (!gl) throw new Error('WebGL unavailable')
	const shaders = []
	let program, buffer, texture
	let disposed = false
	const image = new Image()
	const dispose = () => {
		if (disposed) return
		disposed = true
		image.onload = image.onerror = null
		canvas.removeEventListener('webglcontextlost', lost)
		if (texture) gl.deleteTexture(texture)
		if (buffer) gl.deleteBuffer(buffer)
		if (program) gl.deleteProgram(program)
		shaders.forEach(shader => gl.deleteShader(shader))
		gl.getExtension('WEBGL_lose_context')?.loseContext()
	}
	const lost = () => onFailure()
	canvas.addEventListener('webglcontextlost', lost)
	try {
		program = gl.createProgram()
		for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
			const shader = gl.createShader(type)
			shaders.push(shader)
			gl.shaderSource(shader, source)
			gl.compileShader(shader)
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader))
			gl.attachShader(program, shader)
		}
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))
		gl.useProgram(program)
		buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
		const position = gl.getAttribLocation(program, 'position')
		gl.enableVertexAttribArray(position)
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
		texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))
		image.onload = () => {
			if (disposed) return
			try {
				const stamp = document.createElement('canvas')
				stamp.width = 144
				stamp.height = 120
				stamp.getContext('2d').drawImage(image, 0, 0, 144, 120)
				gl.bindTexture(gl.TEXTURE_2D, texture)
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, stamp)
			} catch { onFailure() }
		}
		image.onerror = onFailure
		image.src = new URL('../assets/logos/photosynth.svg', import.meta.url).href
		const uniforms = Object.fromEntries([
			'resolution', 'viewport', 'phase', 'offset', 'effect', 'nextEffect', 'blend', 'screenMode', 'tileScale',
			'cssC1', 'cssC2', 'cssC3', 'cssBase', 'cssAccent', 'cssInk',
		].map(name => [name, gl.getUniformLocation(program, name)]))
		const requested = new URLSearchParams(location.search).get('backgroundEffect')
		const fixedEffect = WALLPAPER_EFFECTS.indexOf(requested)
		let selectedEffect = fixedEffect >= 0 ? fixedEffect : null
		return {
			nextEffect() { selectedEffect = ((selectedEffect ?? 0) + 1) % WALLPAPER_EFFECTS.length },
			dispose,
			draw(time, offset = { x: time / 100, y: time / 125 }, state = {}) {
				if (disposed) return
				const width = window.innerWidth, height = window.innerHeight
				const scale = Math.min(1, 1280 / Math.max(width, height))
				const w = Math.max(1, Math.round(width * scale)), h = Math.max(1, Math.round(height * scale))
				if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
				const palette = state.colors ?? FALLBACK_PALETTE
				if (selectedEffect === null) {
					const visits = Number.isFinite(state.visitCount) ? Math.max(0, Math.floor(state.visitCount)) : 0
					selectedEffect = visits % WALLPAPER_EFFECTS.length
				}
				gl.viewport(0, 0, w, h)
				gl.uniform2f(uniforms.resolution, w, h)
				gl.uniform2f(uniforms.viewport, width, height)
				// Fractional shader frequencies cannot share a 2π reset without jumping.
				gl.uniform1f(uniforms.phase, time / 19200 * Math.PI * 2)
				gl.uniform2f(uniforms.offset, offset.x, offset.y)
				gl.uniform1f(uniforms.screenMode, state.selection ? 1 : 0)
				gl.uniform1f(uniforms.tileScale, state.size ?? 400)
				gl.uniform3fv(uniforms.cssC1, palette.c1)
				gl.uniform3fv(uniforms.cssC2, palette.c2)
				gl.uniform3fv(uniforms.cssC3, palette.c3)
				gl.uniform3fv(uniforms.cssBase, state.selection ? palette.base : (palette.paper ?? palette.accent))
				gl.uniform3fv(uniforms.cssAccent, palette.accent)
				gl.uniform3fv(uniforms.cssInk, palette.ink)
				// The loading screen always uses the animated logo wallpaper. Visit-count
				// selection and canvas cycling apply to the player-selection screen.
				const current = state.selection ? selectedEffect : 0
				gl.uniform1f(uniforms.effect, current)
				gl.uniform1f(uniforms.nextEffect, (current + 1) % WALLPAPER_EFFECTS.length)
				gl.uniform1f(uniforms.blend, 0)
				gl.drawArrays(gl.TRIANGLES, 0, 3)
			},
		}
	} catch (error) { dispose(); throw error }
}
