const DEFAULT_ACTIVE_TTL = 1400
let tooltipIndex = 0

const createRow = document => {
	const row = document.createElement('li')
	row.className = 'input-status-row'
	row.tabIndex = 0

	const icon = document.createElement('span')
	icon.className = 'input-status-icon'
	icon.setAttribute('aria-hidden', 'true')

	const content = document.createElement('span')
	content.className = 'input-status-content'

	const label = document.createElement('span')
	label.className = 'input-status-label'

	const detail = document.createElement('span')
	detail.className = 'input-status-detail'

	const tooltip = document.createElement('div')
	tooltip.className = 'input-status-tooltip'
	const tooltipId = `input-status-tooltip-${++tooltipIndex}`
	tooltip.id = tooltipId
	tooltip.setAttribute('role', 'tooltip')

	const tooltipLabel = document.createElement('strong')
	tooltipLabel.className = 'input-status-tooltip-label'
	tooltipLabel.id = `${tooltipId}-label`

	const tooltipDetail = document.createElement('span')
	tooltipDetail.className = 'input-status-tooltip-detail'

	const tooltipBody = document.createElement('div')
	tooltipBody.className = 'input-status-tooltip-body'
	tooltipBody.id = `${tooltipId}-body`

	const tooltipDetails = document.createElement('dl')
	tooltipDetails.className = 'input-status-tooltip-details'
	tooltipDetails.hidden = true

	content.append(label, detail)
	tooltipBody.append(tooltipDetail, tooltipDetails)
	tooltip.append(tooltipLabel, tooltipBody)
	row.append(icon, content, tooltip)
	row.setAttribute('aria-labelledby', tooltipLabel.id)
	row.setAttribute('aria-describedby', tooltipBody.id)

	row.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			row.classList.add('is-tooltip-dismissed')
		}
	})
	row.addEventListener('mouseleave', () => row.classList.remove('is-tooltip-dismissed'))
	row.addEventListener('blur', () => row.classList.remove('is-tooltip-dismissed'))

	return { row, label, detail, tooltipLabel, tooltipDetail, tooltipDetails }
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
		view.tooltipLabel.textContent = view.label.textContent
		view.tooltipDetail.textContent = view.detail.textContent

		const tooltipDetails = Array.isArray(nextState.tooltipDetails) ? nextState.tooltipDetails : []
		view.tooltipDetails.replaceChildren()
		view.tooltipDetails.hidden = tooltipDetails.length < 1
		tooltipDetails.forEach(item => {
			if (!item?.label || item.value === undefined || item.value === null || item.value === '') {
				return
			}

			const term = ownerDocument.createElement('dt')
			term.textContent = item.label
			const description = ownerDocument.createElement('dd')
			description.textContent = Array.isArray(item.value) ? item.value.join(', ') : String(item.value)
			view.tooltipDetails.append(term, description)
		})
		view.tooltipDetails.hidden = view.tooltipDetails.childElementCount < 1
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
