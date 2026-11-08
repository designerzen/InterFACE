const SUMMARY_SELECTOR = 'p[aria-label="summary" i]'

export const isReturningUser = (storage = globalThis.localStorage) => {
	return getVisitCount(storage) > 0
}

export const getVisitCount = (storage = globalThis.localStorage) => {
	try {
		const storedApplication = JSON.parse(storage?.getItem('InterFACE') ?? 'null')
		const count = Number(storedApplication?.meta?.count)
		return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
	} catch {
		return 0
	}
}

export const updateSummaryText = (returning = false, root = document) => {
	const summaries = root.querySelectorAll(SUMMARY_SELECTOR)

	if (summaries.length < 2) {
		console.info(`Expected two summary fields matching ${SUMMARY_SELECTOR} on DOM`)
		return false
	}

	summaries.forEach(summary => {
		summary.hidden = summary.classList.contains('returning-client') !== returning
	})

	return true
}
