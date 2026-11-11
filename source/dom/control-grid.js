// Balance complete rows while preserving the order of labelled and icon-only controls.
export const balanceControlRows = (weights, columns) => {
	const rows = []
	let remaining = weights.reduce((sum, weight) => sum + weight, 0)
	let count = Math.max(1, Math.ceil(remaining / (columns * 2)))
	let start = 0
	while (start < weights.length) {
		const target = remaining / count
		let end = start
		let units = 0
		while (end < weights.length - count + 1) {
			const next = units + weights[end]
			if (units && Math.abs(next - target) > Math.abs(units - target)) break
			units = next
			end++
		}
		rows.push({ start, end, units })
		remaining -= units
		start = end
		count--
	}
	const gcd = (a, b) => b ? gcd(b, a % b) : a
	const tracks = rows.reduce((total, row) => total * row.units / gcd(total, row.units), 1)
	return { rows, tracks }
}

export const setupControlGrid = (document = globalThis.document) => {
	const panel = document.getElementById('control-panel')
	if (!panel || panel.controlGrid) return panel?.controlGrid
	const window = document.defaultView
	let frame
	const setProperty = (element, name, value) => {
		if (element.style.getPropertyValue(name) !== String(value)) element.style.setProperty(name, value)
	}
	const update = () => {
		frame = null
		if (panel.classList.contains('controls-list-open')) return
		for (const section of panel.querySelectorAll(':scope > .controls')) {
			if (!section.getClientRects().length) continue
			const items = [...section.children].filter(item =>
				item.matches('button, label, .folder-menu') &&
				!item.classList.contains('button-close') &&
				window.getComputedStyle(item).display !== 'none'
			)
			if (!items.length) continue
			const weights = items.map(item => item.matches('.hide-text:not(.text-always)') ? 1 : 2)
			const columns = Number(window.getComputedStyle(section).getPropertyValue('--grid-column-count')) || 4
			const { rows, tracks } = balanceControlRows(weights, columns)
			setProperty(section, '--control-tracks', tracks)
			rows.forEach((row, index) => {
				for (let i = row.start; i < row.end; i++) {
					setProperty(items[i], '--control-row', index + 1)
					setProperty(items[i], '--control-span', tracks / row.units * weights[i])
				}
			})
		}
	}
	const schedule = () => {
		if (frame == null) frame = window.requestAnimationFrame(update)
	}
	const resize = new window.ResizeObserver(schedule)
	resize.observe(panel)
	const mutations = new window.MutationObserver(schedule)
	mutations.observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] })
	for (const ancestor of [panel.closest('main'), document.body, document.documentElement]) {
		if (ancestor) mutations.observe(ancestor, { attributes: true, attributeFilter: ['class'] })
	}
	panel.controlGrid = { update }
	schedule()
	return panel.controlGrid
}
