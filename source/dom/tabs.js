const instances = new WeakMap()

export const setupTabs = root => {
	if (!root) return null
	if (instances.has(root)) return instances.get(root)
	const list = root.querySelector(':scope > [role="tablist"]')
	const tabs = [...list.querySelectorAll('[role="tab"]')]
	const panels = tabs.map(tab => root.querySelector(`#${CSS.escape(tab.getAttribute('aria-controls'))}`))
	const select = (index, focus = false) => {
		tabs.forEach((tab, i) => {
			tab.setAttribute('aria-selected', String(i === index))
			tab.tabIndex = i === index ? 0 : -1
			panels[i].hidden = i !== index
		})
		if (focus) tabs[index].focus()
	}
	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => select(index))
		tab.addEventListener('keydown', event => {
			const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
				: event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
				: event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null
			if (next === null) return
			event.preventDefault()
			event.stopPropagation()
			select(next, true)
		})
	})
	select(Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')))
	const controller = { select: id => {
		const index = tabs.findIndex(tab => tab.id === id)
		if (index !== -1) select(index)
	} }
	instances.set(root, controller)
	return controller
}
