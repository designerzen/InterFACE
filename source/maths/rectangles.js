export const clampRect = (rect, width, height) => {
	const x = Math.max(0, Math.floor(rect.x))
	const y = Math.max(0, Math.floor(rect.y))
	const right = Math.min(width, Math.ceil(rect.x + rect.width))
	const bottom = Math.min(height, Math.ceil(rect.y + rect.height))
	return {
		x,
		y,
		width: Math.max(0, right - x),
		height: Math.max(0, bottom - y)
	}
}

export const rectsOverlap = (a, b) => {
	return a.x <= b.x + b.width &&
		a.x + a.width >= b.x &&
		a.y <= b.y + b.height &&
		a.y + a.height >= b.y
}

export const mergeRects = (a, b) => {
	const x = Math.min(a.x, b.x)
	const y = Math.min(a.y, b.y)
	const right = Math.max(a.x + a.width, b.x + b.width)
	const bottom = Math.max(a.y + a.height, b.y + b.height)
	return { x, y, width: right - x, height: bottom - y }
}
