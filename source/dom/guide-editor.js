import {ACTIVE_KEY, DRAFT_KEY, MODES, createGuideProject, importGuideProject, normaliseGuideFile, validateGuideProject} from '../models/guide-editor.js'
import {downloadBlob} from './download.js'

const $ = id => document.getElementById(id)
const copy = value => JSON.parse(JSON.stringify(value))
const lines = text => text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
let project = createGuideProject()
let previousProject = null
let step = 0
let stageIndex = -1
let mode = 'basic'
const kind = () => step === 2 ? 'directions' : 'instructions'
const modeData = () => project[kind()][mode]
const stageData = () => stageIndex < 0 ? modeData().default : modeData().blocks[stageIndex][kind()]
const status = message => { $('editor-status').textContent = message }

const saveDraft = () => {
	$('play-guide').hidden = true
	try {
		localStorage.setItem(DRAFT_KEY, JSON.stringify(project))
		status('Draft saved in this browser. Choose Save and use when your guide is ready.')
	} catch { status('This browser could not save your draft. Download an editable guide to keep your changes.') }
}

const showErrors = errors => {
	$('guide-errors').replaceChildren()
	if (!errors.length) return
	const list = document.createElement('ul')
	errors.forEach(message => {
		const item = document.createElement('li')
		item.textContent = message
		list.append(item)
	})
	$('guide-errors').append(list)
}

const renderDirections = () => {
	const container = $('direction-list')
	container.replaceChildren()
	const items = stageData()
	items.forEach((direction, index) => {
		const card = $('direction-template').content.firstElementChild.cloneNode(true)
		card.querySelector('legend').textContent = `Direction ${index + 1}`
		const help = card.querySelector('[id="expression-help"]')
		help.id = `expression-help-${index}`
		const groups = [direction.expects?.group ?? [], direction.expects?.groups ?? []].flat().filter(Boolean)
		if (groups.length) help.textContent += ` Also using expression groups: ${groups.join(', ')}. Choosing new expressions replaces these groups.`
		card.querySelector('[data-expression]').addEventListener('change', event => {
			if (!event.target.value) return
			const input = card.querySelector('[data-field="emoji"]')
			input.value = event.target.value
			input.dispatchEvent(new input.ownerDocument.defaultView.Event('input', {bubbles:true}))
		})
		card.querySelectorAll('[data-field]').forEach(input => {
			const field = input.dataset.field
			input.value = field === 'emoji' ? (direction.expects?.emoji ?? []).map(entry => typeof entry === 'string' ? entry : entry.emoji).join(' ') : direction[field] ?? ''
			if (field === 'emoji') input.setAttribute('aria-describedby', help.id)
			input.addEventListener('input', () => {
				if (field === 'emoji') {
					// Keep per-expression rewards when the expression remains selected.
					const previous = direction.expects?.emoji ?? []
					direction.expects = {...direction.expects, type:'expression', emoji:input.value.trim().split(/[\s,]+/u).filter(Boolean).map(emoji => previous.find(entry => entry?.emoji === emoji) ?? emoji)}
					delete direction.expects.group
					delete direction.expects.groups
					help.textContent = 'Example: 🙂 😊 😀 for a smile, 😉 for a wink, 😮 for surprise.'
				} else direction[field] = field === 'points' ? (input.value === '' ? null : Number(input.value)) : input.value
				saveDraft()
			})
		})
		card.querySelector('[data-action="up"]').disabled = index === 0
		card.querySelector('[data-action="down"]').disabled = index === items.length - 1
		card.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
			const action = button.dataset.action
			let focusIndex = index
			if (action === 'remove') { items.splice(index, 1); focusIndex = Math.min(index, items.length - 1) }
			else {
				focusIndex = index + (action === 'up' ? -1 : 1)
				;[items[index], items[focusIndex]] = [items[focusIndex], items[index]]
			}
			saveDraft()
			renderDirections()
			const target = $('direction-list').children[focusIndex]?.querySelector('input') ?? $('add-direction')
			target.focus()
		}))
		container.append(card)
	})
}

const renderStage = () => {
	const blocks = modeData().blocks
	$('guide-stage').replaceChildren(new Option('Default — outside timed stages', '-1'), ...blocks.map((block, i) => new Option(`Stage ${i + 1} — ${block.from}s for ${block.for}s`, String(i))))
	$('guide-stage').value = String(stageIndex)
	$('stage-timing').hidden = stageIndex < 0
	$('remove-stage').disabled = stageIndex < 0
	if (stageIndex >= 0) {
		$('stage-from').value = blocks[stageIndex].from
		$('stage-duration').value = blocks[stageIndex].for
	}
	$('instruction-fields').hidden = step === 2
	$('direction-fields').hidden = step !== 2
	if (step === 2) renderDirections()
	else $('instruction-lines').value = stageData().join('\n')
}

const renderPreview = () => {
	const preview = $('guide-preview')
	preview.replaceChildren()
	const heading = document.createElement('h5')
	heading.textContent = project.name
	preview.append(heading)
	const addList = (title, items) => {
		const article = document.createElement('article')
		const heading = document.createElement('h5')
		heading.textContent = title
		article.append(heading)
		const list = document.createElement('ol')
		items.forEach(text => {
			const item = document.createElement('li')
			item.textContent = text
			list.append(item)
		})
		article.append(list)
		preview.append(article)
	}
	addList('Welcome messages', project.instructions.quickStart)
	for (const mode of MODES) {
		for (const kind of ['instructions', 'directions']) {
			const data = project[kind][mode]
			const stages = [{[kind]:data.default}, ...data.blocks]
			stages.forEach((stage, index) => addList(`${mode} ${kind} — ${index ? `stage ${index}, from ${stage.from}s for ${stage.for}s` : 'default'}`, stage[kind].map(item => {
				if (typeof item === 'string') return item
				const expressions = (item.expects?.emoji ?? []).map(entry => typeof entry === 'string' ? entry : entry.emoji).join(' ')
				const groups = [item.expects?.group ?? [], item.expects?.groups ?? []].flat().join(', ')
				return `${item.title || item.id}: ${item.message} (${item.points} points). Expressions: ${expressions}${groups ? ` Groups: ${groups}.` : ''}${item.hint ? ` Hint: ${item.hint}` : ''}${item.congratulation ? ` Success: ${item.congratulation}` : ''}`
			})))
		}
	}
	showErrors(validateGuideProject(project))
}

const showStep = (next, focus = true) => {
	step = next
	stageIndex = -1
	document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = Number(panel.dataset.panel) !== step })
	document.querySelectorAll('[data-step]').forEach(button => {
		if (Number(button.dataset.step) === step) button.setAttribute('aria-current', 'step')
		else button.removeAttribute('aria-current')
	})
	$('mode-editor').hidden = step !== 1 && step !== 2
	$('previous-step').hidden = step === 0
	$('next-step').hidden = step === 3
	$('next-step').textContent = ['Next: instructions', 'Next: directions', 'Next: review & save'][step] ?? 'Next'
	$('guide-name').value = project.name
	$('quick-start').value = project.instructions.quickStart.join('\n')
	const completion = project.directions.complete
	$('completion-message').value = typeof completion === 'string' ? completion : completion?.message ?? ''
	if (step === 1 || step === 2) renderStage()
	if (step === 3) renderPreview()
	if (focus) document.querySelector(`[data-panel="${step}"] h4`).focus()
}

const replaceProject = (next, nextStep = 0) => {
	previousProject = copy(project)
	$('undo-replace').disabled = false
	project = next
	saveDraft()
	showStep(nextStep)
}

document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => showStep(Number(button.dataset.step))))
$('previous-step').addEventListener('click', () => showStep(step - 1))
$('next-step').addEventListener('click', () => showStep(step + 1))
$('guide-form').addEventListener('submit', event => event.preventDefault())
$('guide-name').addEventListener('input', event => { project.name = event.target.value; saveDraft() })
$('quick-start').addEventListener('input', event => { project.instructions.quickStart = lines(event.target.value); saveDraft() })
$('completion-message').addEventListener('input', event => {
	project.directions.complete = {...(typeof project.directions.complete === 'object' ? project.directions.complete : {}), message:event.target.value}
	saveDraft()
})
$('instruction-lines').addEventListener('input', event => {
	const items = lines(event.target.value)
	if (stageIndex < 0) modeData().default = items
	else modeData().blocks[stageIndex].instructions = items
	saveDraft()
})
$('guide-mode').addEventListener('change', event => { mode = event.target.value; stageIndex = -1; renderStage() })
$('guide-stage').addEventListener('change', event => { stageIndex = Number(event.target.value); renderStage() })
$('copy-mode').addEventListener('click', () => {
	const other = mode === 'basic' ? 'advanced' : 'basic'
	project[kind()][other] = copy(modeData())
	saveDraft()
	const modeName = value => value === 'advanced' ? 'expert mode' : 'basic mode'
	status(`Copied ${modeName(mode)} ${kind()} to ${modeName(other)}.`)
})
$('add-stage').addEventListener('click', () => {
	modeData().blocks.push({from:0, for:60, [kind()]:[]})
	stageIndex = modeData().blocks.length - 1
	saveDraft()
	renderStage()
	$('stage-from').focus()
})
$('remove-stage').addEventListener('click', () => {
	if (stageIndex < 0) return
	modeData().blocks.splice(stageIndex, 1)
	stageIndex = -1
	saveDraft()
	renderStage()
	$('guide-stage').focus()
})
for (const [id, field] of [['stage-from', 'from'], ['stage-duration', 'for']]) {
	$(id).addEventListener('input', event => {
		modeData().blocks[stageIndex][field] = event.target.value === '' ? null : Number(event.target.value)
		const block = modeData().blocks[stageIndex]
		$('guide-stage').selectedOptions[0].textContent = `Stage ${stageIndex + 1} — ${block.from ?? '?'}s for ${block.for ?? '?'}s`
		saveDraft()
	})
}
$('add-direction').addEventListener('click', () => {
	stageData().push({id:`direction-${crypto.randomUUID()}`, title:'', message:'', points:10, hint:'', encouragement:'', congratulation:'Well done!', retryMessage:'Take your time. We can try this again later.', expects:{type:'expression', emoji:['🙂']}})
	saveDraft()
	renderDirections()
	$('direction-list').lastElementChild.querySelector('input').focus()
})
$('new-guide').addEventListener('click', () => {
	replaceProject(createGuideProject())
})
$('undo-replace').addEventListener('click', () => {
	if (!previousProject) return
	const previous = previousProject
	replaceProject(previous)
	status('Previous working draft restored.')
})
document.querySelectorAll('[data-guide-file]').forEach(button => button.addEventListener('click', async () => {
	const buttons = document.querySelectorAll('[data-guide-file], #load-example')
	buttons.forEach(button => { button.disabled = true })
	const {guideFile, guideKind, guideLabel} = button.dataset
	status(`Opening ${guideLabel}…`)
	try {
		const response = await fetch(guideFile)
		if (!response.ok) throw new Error('The file could not be loaded. Please try again.')
		const data = normaliseGuideFile(await response.json(), guideKind)
		const next = copy(project)
		next[guideKind] = data
		replaceProject(next, guideKind === 'instructions' ? 1 : 2)
		status(`Opened ${guideLabel} for editing. Changes are saved in your draft; download the edited file or choose Save and use when ready.`)
	} catch (error) { status(`Could not open ${guideLabel}: ${error.message}`) }
	finally { buttons.forEach(button => { button.disabled = false }) }
}))
$('load-example').addEventListener('click', async event => {
	const button = event.target
	button.disabled = true
	try {
		const files = await Promise.all(['instructions', 'directions'].map(async kind => {
			const response = await fetch(`./locales/en/${kind}.json`)
			if (!response.ok) throw new Error('Could not load the PhotoSYNTH guide. Try importing a JSON file instead.')
			return response.json()
		}))
		const next = importGuideProject({name:'My PhotoSYNTH guide', instructions:files[0], directions:files[1]})
		replaceProject(next)
	} catch (error) { status(error.message) }
	finally { button.disabled = false }
})
$('import-guide').addEventListener('change', async event => {
	const file = event.target.files[0]
	if (!file) return
	try {
		const next = importGuideProject(JSON.parse(await file.text()), project)
		replaceProject(next)
		status(`Opened ${file.name}. Use Undo last replacement if you need your previous draft.`)
	} catch (error) { status(`Could not open this file: ${error.message}`) }
	finally { event.target.value = '' }
})

function download(kind) {
	const data = kind === 'project' ? project : project[kind]
	const name = kind === 'project' ? `${project.name.replace(/[^a-z0-9_-]/gi, '-').slice(0, 80) || 'my'}-guide.json` : `${kind}.json`
	downloadBlob(new Blob([JSON.stringify(data, null, '\t')], {type:'application/json'}), name)
}
document.querySelectorAll('[data-export]').forEach(button => button.addEventListener('click', () => download(button.dataset.export)))
$('use-guide').addEventListener('click', () => {
	const errors = validateGuideProject(project)
	showErrors(errors)
	if (errors.length) { status('Check the messages in Review and save before using this guide.'); return }
	try {
		localStorage.setItem(ACTIVE_KEY, JSON.stringify(project))
		$('play-guide').hidden = false
		status('Guide saved and selected. Open or reload PhotoSYNTH to use it in this browser.')
	} catch { status('This browser could not save your guide. Download it to keep your work.') }
})
$('restore-guide').addEventListener('click', () => {
	try {
		localStorage.removeItem(ACTIVE_KEY)
		$('play-guide').hidden = true
		status('Built-in guides selected. Reload PhotoSYNTH to use them. Your draft is still here.')
	} catch { status('This browser could not change the selected guide.') }
})

try {
	const saved = localStorage.getItem(DRAFT_KEY)
	if (saved) project = importGuideProject(JSON.parse(saved))
	status(saved ? 'Your saved draft is ready to edit.' : 'Start a blank guide, load an example, or open a saved file.')
} catch { status('Your saved draft could not be opened. You can start again or import a backup.') }
$('guide-form').hidden = false
showStep(0, false)
