import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import {createRequire} from 'node:module'
import pug from 'pug'
import {JSDOM} from 'jsdom'
import {ACTIVE_KEY, DRAFT_KEY, createGuideProject, importGuideProject, normaliseGuideFile, validateGuideProject, readActiveGuide} from '../source/models/guide-editor.js'
import {getInstructions} from '../source/models/instructions.js'
import {getDirections} from '../source/models/directions.js'

const instructions = JSON.parse(readFileSync('static/locales/en/instructions.json'))
const directions = JSON.parse(readFileSync('static/locales/en/directions.json'))
const example = () => importGuideProject({name:'My lesson', instructions, directions})
const {locals} = createRequire(import.meta.url)('../.pugrc.js')

test('the existing guide list includes every shipped instructions and directions file, and each opens in the editor format', () => {
	const expected = readdirSync('static/locales/en').filter(file => /^(instructions|directions)(?:-[a-z0-9-]+)?\.json$/i.test(file)).sort()
	assert.deepEqual(locals.guideFiles.filter(guide => guide.language === 'en').map(guide => guide.file).sort(), expected)
	for (const guide of locals.guideFiles) {
		const data = JSON.parse(readFileSync(`static/locales/${guide.language}/${guide.file}`))
		const opened = normaliseGuideFile(data, guide.kind)
		assert.ok(Array.isArray(opened.basic.default), guide.file)
		assert.ok(Array.isArray(opened.advanced.default), guide.file)
	}
})

test('existing guide formats round trip without losing stages, groups, rewards or metadata', () => {
	const project = example()
	project.directions.groups = {smiles:[{emoji:'🙂', points:20, congratulation:'Lovely!'}]}
	project.directions.basic.blocks.push({from:30, for:20, directions:[{id:'timed', message:'Smile', expects:{type:'expression', group:'smiles'}}]})
	project.instructions.basic.blocks.push({from:30, for:20, instructions:['Keep going.']})
	const imported = importGuideProject(JSON.parse(JSON.stringify(project)))
	assert.equal(imported.directions.basic.blocks[0].directions[0].points, 0)
	assert.deepEqual(imported.directions.groups, project.directions.groups)
	assert.deepEqual(imported.instructions, project.instructions)
	assert.deepEqual(validateGuideProject(imported), [])
	const single = importGuideProject(['One', 'Two'], project)
	assert.deepEqual(single.instructions.advanced.default, ['One','Two'])
	assert.deepEqual(single.directions, project.directions)
	assert.throws(() => importGuideProject({basic:{default:'bad'}}))
	assert.throws(() => importGuideProject({instructions:{basic:['Text']}, directions:{basic:[{id:5}]}}))
})

test('validation rejects duplicate IDs, missing responses, invalid times and unknown expressions', () => {
	const project = example()
	project.directions.basic.default[1].id = project.directions.basic.default[0].id
	project.directions.basic.default[0].expects.emoji = []
	project.directions.advanced.default[0].expects.emoji = ['invalid-expression']
	project.instructions.basic.blocks.push({from:-1, for:0, instructions:[]})
	const errors = validateGuideProject(project).join(' ')
	assert.match(errors, /unique ID/)
	assert.match(errors, /Choose an expression/)
	assert.match(errors, /recognised PhotoSYNTH/)
	assert.match(errors, /duration greater than 0/)
	assert.ok(validateGuideProject(createGuideProject()).length)
})

test('editor workflow saves drafts, edits both modes and stages, applies to the player and restores defaults', async t => {
	const html = pug.renderFile('source/guide-editor.pug', locals)
	const dom = new JSDOM(html, {url:'http://localhost/guide-editor.html'})
	for (const [key, value] of Object.entries({document:dom.window.document, localStorage:dom.window.localStorage, Option:dom.window.Option})) {
		const descriptor = Object.getOwnPropertyDescriptor(globalThis, key)
		Object.defineProperty(globalThis, key, {value, configurable:true})
		t.after(() => descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key])
	}
	const $ = id => document.getElementById(id)
	const click = id => $(id).click()
	const input = (id, value) => {
		$(id).value = value
		$(id).dispatchEvent(new dom.window.Event('input', {bubbles:true}))
	}
	const change = (id, value) => {
		$(id).value = value
		$(id).dispatchEvent(new dom.window.Event('change', {bubbles:true}))
	}
	localStorage.setItem(DRAFT_KEY, JSON.stringify(example()))
	await import('../source/dom/guide-editor.js')
	assert.equal($('guide-name').value, 'My lesson')
	assert.equal($('guide-form').hidden, false)
	input('guide-name', 'My edited lesson')
	click('next-step')
	input('quick-start', 'Welcome to my lesson')
	input('instruction-lines', 'Play a note\nMake a smile')
	click('add-stage')
	input('stage-from', '10')
	input('stage-duration', '15')
	input('instruction-lines', 'Timed invitation')
	click('copy-mode')
	change('guide-mode', 'advanced')
	assert.equal($('instruction-lines').value, 'Play a note\nMake a smile')
	click('next-step')
	click('add-direction')
	const field = $('direction-list').lastElementChild.querySelector('[data-field="message"]')
	field.value = 'Try a smile'
	field.dispatchEvent(new dom.window.Event('input', {bubbles:true}))
	const expression = $('direction-list').lastElementChild.querySelector('[data-expression]')
	expression.value = '😉'
	expression.dispatchEvent(new dom.window.Event('change', {bubbles:true}))
	assert.equal($('direction-list').lastElementChild.querySelector('[data-field="emoji"]').value, '😉')
	click('copy-mode')
	click('next-step')
	assert.equal($('guide-errors').textContent, '')
	assert.match($('guide-preview').textContent, /Timed invitation/)
	click('use-guide')
	assert.equal(readActiveGuide().name, 'My edited lesson')
	assert.equal($('play-guide').hidden, false)
	assert.equal(JSON.parse(localStorage.getItem(DRAFT_KEY)).instructions.basic.blocks[0].for, 15)

	let failExisting = false
	t.mock.method(globalThis, 'fetch', async url => ({ok:!failExisting, headers:{get:() => 'application/json'}, json:async () => JSON.parse(readFileSync(`static/${url.replace(/^\.\//, '')}`))}))
	const guide = await getInstructions('en', 'emf', {advancedMode:false})
	assert.equal(guide.getInstruction(0), 'Play a note')
	assert.equal(guide.getHelp(0), 'Welcome to my lesson')
	const engine = await getDirections('en', 'emf', {advancedMode:true, now:() => 0})
	assert.equal(engine.getQuantityOfDirections(), directions.advanced.default.length + 1)
	click('restore-guide')
	assert.equal(readActiveGuide(), null)
	assert.equal((await getInstructions()).getInstruction(0), instructions.advanced.default[0])
	assert.equal((await getDirections()).getQuantityOfDirections(), directions.advanced.default.length)
	assert.ok(localStorage.getItem(DRAFT_KEY))
	document.querySelector('[data-step="0"]').click()
	click('new-guide')
	assert.equal($('guide-name').value, 'My guide')
	click('undo-replace')
	assert.equal($('guide-name').value, 'My edited lesson')
	assert.equal(document.querySelectorAll('[data-guide-file]').length, locals.guideFiles.length)
	const existingInstructions = document.querySelector('[data-guide-label="instructions-emf.json"]')
	const existingDirections = document.querySelector('[data-guide-label="directions-allstars.json"]')
	const beforeInstructions = JSON.parse(localStorage.getItem(DRAFT_KEY))
	existingInstructions.click()
	assert.equal(existingDirections.disabled, true)
	await new Promise(setImmediate)
	assert.equal(existingDirections.disabled, false)
	assert.equal(document.querySelector('[data-panel="1"]').hidden, false)
	const afterInstructions = JSON.parse(localStorage.getItem(DRAFT_KEY))
	assert.deepEqual(afterInstructions.directions, beforeInstructions.directions)
	assert.deepEqual(afterInstructions.instructions, normaliseGuideFile(JSON.parse(readFileSync('static/locales/en/instructions-emf.json')), 'instructions'))
	existingDirections.click()
	await new Promise(setImmediate)
	assert.equal(document.querySelector('[data-panel="2"]').hidden, false)
	const afterDirections = JSON.parse(localStorage.getItem(DRAFT_KEY))
	assert.deepEqual(afterDirections.instructions, afterInstructions.instructions)
	assert.deepEqual(afterDirections.directions, normaliseGuideFile(JSON.parse(readFileSync('static/locales/en/directions-allstars.json')), 'directions'))
	document.querySelector('[data-step="0"]').click()
	click('undo-replace')
	assert.deepEqual(JSON.parse(localStorage.getItem(DRAFT_KEY)), afterInstructions)
	failExisting = true
	existingInstructions.click()
	await new Promise(setImmediate)
	assert.deepEqual(JSON.parse(localStorage.getItem(DRAFT_KEY)), afterInstructions)
	assert.match($('editor-status').textContent, /Could not open instructions-emf.json/)
	assert.equal(existingInstructions.disabled, false)
	localStorage.setItem(ACTIVE_KEY, '{invalid')
	assert.equal(readActiveGuide(), null)
	dom.window.close()
})
