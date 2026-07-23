import html2pdf from 'html2pdf.js'

const documentSource = document.querySelector('.document')
const downloadButtons = [...document.querySelectorAll('[data-download-pdf]')]
const exportStatus = document.querySelector('#pdf-export-status')
const pdfFilename = 'camp-bestival-dorset-2026-risk-assessment.pdf'

function setExportState(isBusy, message) {
	exportStatus.textContent = message

	for (const button of downloadButtons) {
		button.disabled = isBusy
		button.setAttribute('aria-busy', String(isBusy))
	}
}

function cloneDocumentForPdf() {
	const clone = documentSource.cloneNode(true)
	const sourceControls = [...documentSource.querySelectorAll('input, textarea')]
	const clonedControls = [...clone.querySelectorAll('input, textarea')]

	clone.classList.add('pdf-export-source')
	clone.removeAttribute('aria-labelledby')

	for (const [index, sourceControl] of sourceControls.entries()) {
		const clonedControl = clonedControls[index]

		if (sourceControl instanceof HTMLInputElement && sourceControl.type === 'checkbox') {
			clonedControl.checked = sourceControl.checked
		} else {
			clonedControl.value = sourceControl.value
		}
	}

	for (const details of clone.querySelectorAll('details')) {
		details.open = true
	}

	const coverPageBreak = document.createElement('div')
	coverPageBreak.className = 'html2pdf__page-break'
	clone.querySelector('.masthead')?.after(coverPageBreak)
	const coverSpacer = document.createElement('div')
	coverSpacer.className = 'pdf-cover-spacer'
	coverPageBreak.after(coverSpacer)

	for (const section of clone.querySelectorAll('.document-section:not(:first-child)')) {
		const pageBreak = document.createElement('div')
		pageBreak.className = 'html2pdf__page-break'
		section.before(pageBreak)
	}

	for (const riskCard of clone.querySelectorAll('.risk-card:not([hidden])')) {
		const pageBreak = document.createElement('div')
		pageBreak.className = 'html2pdf__page-break'
		riskCard.before(pageBreak)
	}

	return clone
}

async function downloadPdf() {
	if (!documentSource || downloadButtons.some((button) => button.disabled)) {
		return
	}

	setExportState(true, 'Creating PDF…')
	const exportSource = cloneDocumentForPdf()

	try {
		await document.fonts?.ready
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

		await html2pdf()
			.set({
				margin: [14, 13, 16, 13],
				filename: pdfFilename,
				enableLinks: true,
				image: {
					type: 'jpeg',
					quality: 0.96
				},
				html2canvas: {
					backgroundColor: '#ffffff',
					logging: false,
					scale: Math.min(window.devicePixelRatio || 1, 1.75),
					useCORS: true,
					windowWidth: 696
				},
				jsPDF: {
					compress: true,
					format: 'a4',
					orientation: 'portrait',
					unit: 'mm'
				},
				pagebreak: {
					mode: ['css', 'legacy']
				}
			})
			.from(exportSource)
			.save()

		setExportState(false, `Downloaded ${pdfFilename}`)
	} catch (error) {
		console.error('PDF generation failed', error)
		setExportState(false, 'The PDF could not be created. Please try again or use Print.')
	} finally {
		window.setTimeout(() => {
			if (!downloadButtons.some((button) => button.disabled)) {
				exportStatus.textContent = ''
			}
		}, 6000)
	}
}

for (const button of downloadButtons) {
	button.addEventListener('click', downloadPdf)
}
