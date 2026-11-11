import { balanceControlRows, setupControlGrid } from '../source/dom/control-grid.js'

describe('Balanced control grid', () => {
	test('balances 26 labelled controls into two complete rows', () => {
		const { rows, tracks } = balanceControlRows(Array(26).fill(2), 14)
		expect(rows).toEqual([
			{ start: 0, end: 13, units: 26 },
			{ start: 13, end: 26, units: 26 }
		])
		expect(tracks).toBe(26)
	})

	test.each([4, 8, 10, 14])('fills every row with integer spans at a density of %i', columns => {
		const weights = [...Array(12).fill(2), 1, 1]
		const { rows, tracks } = balanceControlRows(weights, columns)
		expect(rows[rows.length - 1].end).toBe(weights.length)
		for (const row of rows) {
			const spans = weights.slice(row.start, row.end).map(weight => tracks / row.units * weight)
			expect(spans.every(Number.isInteger)).toBe(true)
			expect(spans.reduce((sum, span) => sum + span, 0)).toBe(tracks)
		}
	})

	test('rebalances controls hidden by inline styles and leaves list mode alone', async () => {
		document.body.innerHTML = '<main><menu id="control-panel"><section id="settings" class="controls" style="--grid-column-count:4"></section></menu></main>'
		const section = document.getElementById('settings')
		section.innerHTML = '<button>Control</button>'.repeat(10) + '<button class="hide-text">Share</button>'
		const rects = jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}])
		const raf = jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
		const originalResize = window.ResizeObserver
		window.ResizeObserver = class { observe() {} }
		try {
			const grid = setupControlGrid()
			grid.update()
			expect(section.children[0].style.getPropertyValue('--control-span')).not.toBe('')
			const before = section.style.getPropertyValue('--control-tracks')
			section.lastElementChild.style.display = 'none'
			await Promise.resolve()
			// Run the frame scheduled by the real MutationObserver.
			expect(raf).toHaveBeenCalledTimes(2)
			raf.mock.calls[1][0]()
			expect(section.style.getPropertyValue('--control-tracks')).not.toBe(before)
			// Our own unchanged grid properties must not keep scheduling frames.
			await Promise.resolve()
			raf.mock.calls[2][0]()
			await Promise.resolve()
			expect(raf).toHaveBeenCalledTimes(3)
			document.getElementById('control-panel').classList.add('controls-list-open')
			const saved = section.style.cssText
			section.children[0].hidden = true
			grid.update()
			expect(section.style.cssText).toBe(saved)
		} finally {
			window.ResizeObserver = originalResize
			rects.mockRestore()
			raf.mockRestore()
		}
	})
})
