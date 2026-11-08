import dialogPolyfill from 'dialog-polyfill'
import { createPersonReport, personReportCSV, personReportRows } from '../people/person-report.js'
import { downloadBlob } from './download.js'

let sequence = 0

export const openPersonReportDialog = (person, opener) => {
	const template = document.getElementById('person-report-template')
	if (!template) throw new Error('Player progress template is missing')
	const dialog = template.content.querySelector('dialog').cloneNode(true)
	const title = dialog.querySelector('[data-report-title]')
	title.id = `person-report-title-${++sequence}`
	dialog.setAttribute('aria-labelledby', title.id)
	const description = dialog.querySelector('[data-report-description]')
	description.id = `person-report-description-${sequence}`
	dialog.setAttribute('aria-describedby', description.id)
	let report
	const refresh = () => {
		report = createPersonReport(person)
		title.textContent = `${report.player.name} · Progress & data`
		dialog.querySelector('[data-report-time]').textContent = `Snapshot: ${new Date(report.exportedAt).toLocaleString()}`
		dialog.querySelector('[data-report-summary]').textContent = report.activity.sampleCount || report.activity.notesPlayed || report.progress.totalNotes || report.progress.engagedTime ?
			`${Math.round(report.progress.engagedTime / 1000)} seconds in Player mode · ${report.activity.notesPlayed} notes played · ${Math.round(report.activity.activeRatio * 100)}% movement-active time · ${report.analysis.expressionVariety} expressions · ${report.analysis.unlockedAchievements} achievements` :
			'No activity recorded yet. Play some notes or move in front of the camera, then refresh.'
		const body = dialog.querySelector('[data-report-metrics]')
		body.replaceChildren()
		personReportRows({activity:report.activity, progress:report.progress, analysis:report.analysis}).forEach(([key, value]) => {
			const row = body.insertRow()
			const label = document.createElement('th')
			label.scope = 'row'
			label.textContent = key.replace('.', ' / ').replace(/([a-z])([A-Z])/g, '$1 $2')
			row.appendChild(label)
			row.insertCell().textContent = value === null ? '—' : typeof value === 'number' ? String(Math.round(value * 1000) / 1000) : String(value)
		})
		const list = dialog.querySelector('[data-report-achievements]')
		list.replaceChildren()
		if (!report.achievements.length) list.textContent = 'No achievements unlocked yet.'
		report.achievements.forEach(achievement => {
			const item = document.createElement('li')
			item.textContent = `${achievement.title} (${achievement.score} XP) · ${achievement.description}`
			list.appendChild(item)
		})
	}
	dialog.querySelector('[data-report-refresh]').addEventListener('click', refresh)
	dialog.querySelectorAll('[data-report-export]').forEach(button => button.addEventListener('click', () => {
		const format = button.dataset.reportExport
		const name = report.player.name.replace(/[^a-z0-9_-]+/gi, '-').slice(0, 60) || 'player'
		const data = format === 'csv' ? personReportCSV(report) : JSON.stringify(report, null, 2)
		downloadBlob(new Blob([data], {type:format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json'}),
			`${name}-progress-${report.exportedAt.replace(/[:.]/g, '-')}.${format}`)
	}))
	dialog.querySelector('[data-report-close]').addEventListener('click', () => dialog.close())
	dialog.addEventListener('close', () => { dialog.remove(); opener?.focus() }, {once:true})
	dialog.addEventListener('click', event => {
		if (event.target !== dialog) return
		const bounds = dialog.getBoundingClientRect()
		if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close()
	})
	document.body.appendChild(dialog)
	dialogPolyfill.registerDialog(dialog)
	refresh()
	dialog.showModal()
	return dialog
}
