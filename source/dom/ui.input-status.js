const DEFAULT_ACTIVE_TTL = 1400

const createRow = document => {
	const row = document.createElement('li')
	row.className = 'input-status-row'

	const icon = document.createElement('span')
	icon.className = 'input-status-icon'
	icon.setAttribute('aria-hidden', 'true')

	const content = document.createElement('span')
	content.className = 'input-status-content'

	const label = document.createElement('span')
	label.className = 'input-status-label'

	const detail = document.createElement('span')
	detail.className = 'input-status-detail'

	content.append(label, detail)
	row.append(icon, content)

	return { row, label, detail }
}

export const createInputStatusOverlay = listElement => {
	if (!listElement) {
		return {
			setDeviceStatus: () => null,
			pulseDeviceStatus: () => null,
			clearDeviceStatus: () => null,
			setEnabled: () => null,
		}
	}

	const { ownerDocument } = listElement
	const parentElement = listElement.parentElement
	const statusMap = new Map()
	const rowMap = new Map()
	const activeTimers = new Map()
	let enabled = true

	const setVisibility = () => {
		if (parentElement) {
			parentElement.hidden = !enabled || statusMap.size < 1
		}
	}

	const clearActiveTimer = id => {
		const timer = activeTimers.get(id)
		if (timer) {
			clearTimeout(timer)
			activeTimers.delete(id)
		}
	}

	const ensureRow = id => {
		let view = rowMap.get(id)
		if (view) {
			return view
		}

		view = createRow(ownerDocument)
		view.row.dataset.deviceId = id
		rowMap.set(id, view)
		listElement.appendChild(view.row)
		return view
	}

	const applyState = (id, nextState) => {
		const view = ensureRow(id)
		view.row.dataset.type = nextState.type ?? 'input'
		view.row.classList.toggle('is-active', !!nextState.active)
		view.row.classList.toggle('is-connected', nextState.connected !== false)
		view.label.classList.add('sr-only')
		view.label.textContent = nextState.label ?? 'Input'
		view.detail.textContent = nextState.detail || (nextState.connected === false ? 'Disconnected' : 'Ready')
		view.row.title = `${view.label.textContent}${view.detail.textContent ? `: ${view.detail.textContent}` : ''}`
	}

	const setDeviceStatus = (id, patch = {}) => {
		const currentState = statusMap.get(id) ?? { id }
		const nextState = { ...currentState, ...patch, id }

		statusMap.set(id, nextState)
		applyState(id, nextState)
		setVisibility()

		clearActiveTimer(id)
		if (nextState.active) {
			const ttl = Number.isFinite(patch.ttl) ? patch.ttl : DEFAULT_ACTIVE_TTL
			activeTimers.set(id, setTimeout(() => {
				const latestState = statusMap.get(id)
				if (!latestState) {
					return
				}

				statusMap.set(id, { ...latestState, active: false })
				applyState(id, statusMap.get(id))
				activeTimers.delete(id)
			}, ttl))
		}

		return nextState
	}

	const pulseDeviceStatus = (id, detail, patch = {}) =>
		setDeviceStatus(id, {
			...patch,
			detail,
			active: true,
			ttl: patch.ttl ?? DEFAULT_ACTIVE_TTL,
		})

	const clearDeviceStatus = id => {
		clearActiveTimer(id)
		statusMap.delete(id)

		const view = rowMap.get(id)
		if (view) {
			view.row.remove()
			rowMap.delete(id)
		}

		setVisibility()
	}

	const setEnabled = nextEnabled => {
		enabled = nextEnabled !== false
		setVisibility()
	}

	setVisibility()

	return {
		setDeviceStatus,
		pulseDeviceStatus,
		clearDeviceStatus,
		setEnabled,
	}
}
