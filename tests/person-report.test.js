import fs from 'fs'
import path from 'path'
import pug from 'pug'
import PersonActivity from '../source/people/person-activity.js'
import PersonalProgress from '../source/people/person-progress.js'
import { createPersonReport, personReportCSV } from '../source/people/person-report.js'
import { openPersonReportDialog } from '../source/dom/person-report-dialog.js'
import { downloadBlob } from '../source/dom/download.js'

jest.mock('../source/dom/download.js', () => ({downloadBlob:jest.fn()}))
jest.mock('dialog-polyfill', () => ({registerDialog:jest.fn()}))

const player = () => {
	const activity = new PersonActivity()
	return {id:'person-a', playerNumber:0, displayName:'Alex', activity, personalProgress:new PersonalProgress(activity)}
}

beforeEach(() => {
	const source = fs.readFileSync(path.resolve(__dirname, '../source/partials/dialogs.pug'), 'utf8')
	document.body.innerHTML = pug.render(source.slice(0, source.indexOf('dialog#midi-cc-dialog')))
	HTMLDialogElement.prototype.showModal = function(){ this.setAttribute('open', '') }
	HTMLDialogElement.prototype.close = function(){ this.removeAttribute('open'); this.dispatchEvent(new Event('close')) }
})

test('exports finite empty-session values, private activity counters, and Sets', () => {
	const person = player()
	const empty = createPersonReport(person)
	expect(empty.analysis.noteEventsPerMinute).toBeNull()
	expect(empty.activity.lowestNotePlayed).toBeNull()
	expect(empty.progress.noteRange).toBe(0)
	person.activity.trackNote(60)
	person.activity.trackNote(67)
	person.personalProgress.trackExpression('🙂')
	const report = JSON.parse(JSON.stringify(createPersonReport(person)))
	expect(report.activity).toMatchObject({notesPlayed:2, uniqueNotesPlayed:2, lowestNotePlayed:60, highestNotePlayed:67, noteRange:7})
	expect(report.progress.expressions).toEqual(['🙂'])
	expect(report.player.name).toBe('Alex')
})

test('CSV preserves quoted names and neutralises spreadsheet formulas', () => {
	const person = player()
	person.displayName = '=HYPERLINK("bad"),\nname'
	const csv = personReportCSV(createPersonReport(person))
	expect(csv).toContain('"player.name","\'=HYPERLINK(""bad""),\nname"')
	expect(csv).toContain('"units.durations","milliseconds"')
	expect(personReportCSV({direction:-1})).toContain('"direction","-1"')
})

test('template supports separate players, safe names, refresh, snapshot exports, and dismissal', () => {
	const person = player()
	person.displayName = '<img src=x onerror=alert(1)>'
	const opener = document.createElement('button')
	document.body.appendChild(opener)
	const dialog = openPersonReportDialog(person, opener)
	expect(dialog.querySelector('img')).toBeNull()
	expect(dialog.querySelector('h2').textContent).toContain(person.displayName)
	expect(dialog.querySelector('[data-report-summary]').textContent).toContain('No activity')
	person.activity.trackNote(60)
	dialog.querySelector('[data-report-refresh]').click()
	expect(dialog.querySelector('[data-report-summary]').textContent).toContain('1 notes played')
	person.activity.trackNote(62)
	dialog.querySelector('[data-report-export="json"]').click()
	expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), expect.stringMatching(/\.json$/))
	expect(dialog.querySelector('[data-report-summary]').textContent).toContain('1 notes played')
	const other = openPersonReportDialog({...player(), id:'person-b', displayName:'Sam'})
	expect(other.getAttribute('aria-labelledby')).not.toBe(dialog.getAttribute('aria-labelledby'))
	expect(other.querySelector('h2').textContent).toContain('Sam')
	dialog.querySelector('[data-report-close]').click()
	expect(dialog.isConnected).toBe(false)
	expect(document.activeElement).toBe(opener)
	other.close()
	expect(document.querySelectorAll('dialog')).toHaveLength(0)
	expect(document.querySelector('template').content.querySelector('dialog')).not.toBeNull()
})
