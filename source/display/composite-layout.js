export const COMPOSITE_LAYOUTS = {
	layers: 'Layered',
	grid: 'Grid',
	row: 'Horizontal split',
	column: 'Vertical split'
}

export const getCompositeViewports = (count, width, height, layout = 'layers') => {
	if (!Object.hasOwn(COMPOSITE_LAYOUTS, layout)) throw new Error(`Unknown Composite layout: ${layout}`)
	if (!count) return []
	const columns = layout === 'row' ? count : layout === 'grid' ? Math.ceil(Math.sqrt(count)) : 1
	const rows = layout === 'column' ? count : layout === 'grid' ? Math.ceil(count / columns) : 1
	return Array.from({ length: count }, (_, index) => {
		const column = layout === 'layers' ? 0 : index % columns
		const row = layout === 'layers' ? 0 : Math.floor(index / columns)
		const x = Math.round(column * width / columns), y = Math.round(row * height / rows)
		return { x, y, width: Math.round((column + 1) * width / columns) - x, height: Math.round((row + 1) * height / rows) - y }
	})
}
