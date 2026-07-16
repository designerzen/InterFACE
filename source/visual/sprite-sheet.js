export class SpriteSheet {
	canvas = null
	context = null
	areas = new Map()
	emojiVariants = new Map()
	x = 0
	y = 0
	rowHeight = 0

	constructor({ width = 2048, height = 2048, padding = 12, canvasFactory } = {}) {
		this.padding = padding
		this.canvas = canvasFactory?.(width, height) ?? this.createAtlasCanvas(width, height)
		this.context = this.canvas?.getContext?.('2d') ?? null
	}

	createAtlasCanvas(width, height) {
		if (typeof document !== 'undefined') {
			const canvas = document.createElement('canvas')
			canvas.width = width
			canvas.height = height
			return canvas
		}
		return typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(width, height) : null
	}

	get available() {
		return Boolean(this.canvas && this.context)
	}

	getCanvas() {
		return { canvas:this.canvas, context:this.context }
	}

	createCanvas(font = '900 54px "noto-emoji"', text = 'M') {
		if (!this.context) return this.getCanvas()
		this.context.font = font
		return { canvas:this.canvas, context:this.context, metrics:this.context.measureText(text) }
	}

	reserve(width, height) {
		if (!this.available || width > this.canvas.width || height > this.canvas.height) return null
		if (this.x + width > this.canvas.width) {
			this.x = 0
			this.y += this.rowHeight
			this.rowHeight = 0
		}
		if (this.y + height > this.canvas.height) return null
		const area = { x:this.x, y:this.y, width, height }
		this.x += width
		this.rowHeight = Math.max(this.rowHeight, height)
		return area
	}

	getSprite(text, { font = '900 54px "noto-emoji"', mirrored = false, fillStyle = '#fff', strokeStyle = '#0a0a0a', align = 'center' } = {}) {
		if (!this.available || !text) return null
		const key = `${font}|${mirrored ? 'mirrored' : 'normal'}|${align}|${text}`
		const cached = this.areas.get(key)
		if (cached) return cached

		const context = this.context
		context.save()
		context.font = font
		const metrics = context.measureText(text)
		context.restore()
		const width = Math.ceil(Math.max(metrics.width, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight, 1)) + this.padding * 2
		const fontSize = Number.parseFloat(font.match(/(\d+(?:\.\d+)?)px/)?.[1]) || 1
		const height = Math.ceil(Math.max(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent, fontSize, 1)) + this.padding * 2
		const area = this.reserve(width, height)
		if (!area) return null

		const centerX = align === 'left' ? area.x + this.padding : align === 'right' ? area.x + area.width - this.padding : area.x + area.width * 0.5
		const centerY = area.y + area.height * 0.5
		context.save()
		context.font = font
		context.textAlign = align
		context.textBaseline = 'middle'
		context.fillStyle = fillStyle
		context.strokeStyle = strokeStyle
		if (mirrored) {
			context.translate(centerX, 0)
			context.scale(-1, 1)
			context.translate(-centerX, 0)
		}
		context.strokeText(text, centerX, centerY)
		context.fillText(text, centerX, centerY)
		context.restore()
		const sprite = { ...area, text, font, mirrored }
		this.areas.set(key, sprite)
		return sprite
	}

	addText(text, fontSize = 54, fontName = 'noto-emoji', fontWeight = 900, align = 'center', fillStyle = '#fff', strokeStyle = '#0a0a0a', mirrored = false) {
		return this.getSprite(text, {
			font:`${fontWeight} ${fontSize}px ${fontName}`,
			mirrored,
			fillStyle,
			strokeStyle,
			align
		})
	}

	addEmoji(emoji, options = {}) {
		const size = options.size ?? 54
		return this.getSprite(emoji, { ...options, font:options.font ?? `900 ${size}px "noto-emoji"` })
	}

	addMirroredEmoji(emoji, options = {}) {
		const font = options.font ?? `900 ${options.size ?? 54}px "noto-emoji"`
		const key = `${font}|${emoji}`
		const cached = this.emojiVariants.get(key)
		if (cached) return cached
		const variants = {
			normal:this.addEmoji(emoji, { ...options, mirrored:false }),
			mirrored:this.addEmoji(emoji, { ...options, mirrored:true })
		}
		this.emojiVariants.set(key, variants)
		return variants
	}

	preloadMirroredEmojis(emojis, options = {}) {
		const sprites = new Map()
		for (const emoji of new Set(emojis ?? [])) {
			sprites.set(emoji, this.addMirroredEmoji(emoji, options))
		}
		return sprites
	}

	getEmojiVariants(emoji, options = {}) {
		const font = options.font ?? `900 ${options.size ?? 54}px "noto-emoji"`
		return this.emojiVariants.get(`${font}|${emoji}`) ?? this.addMirroredEmoji(emoji, options)
	}

	getArea(text, options = {}) {
		return this.getSprite(text, options)
	}

	draw(context, text, x, y, options = {}) {
		const sprite = this.getSprite(text, options)
		if (!sprite || !context) return false
		context.drawImage(this.canvas, sprite.x, sprite.y, sprite.width, sprite.height, x - sprite.width * 0.5, y - sprite.height * 0.5, sprite.width, sprite.height)
		return true
	}
}
