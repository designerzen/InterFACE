import test from 'node:test'
import assert from 'node:assert/strict'
import {build} from 'esbuild'
import {JSDOM} from 'jsdom'

 test('directions share setFeedback without adding elements, controls or styling', async () => {
	const bundle = await build({stdin:{contents:`
		import {createDirections} from './source/models/directions.js'
		import DirectionsSession from './source/models/directions-session.js'
		import {createDirectionsFeedback} from './source/dom/directions-feedback.js'
		import {bindTextElement} from './source/dom/text.js'
		let time = 0, owns = false
		const now = () => time
		const people = [{playerNumber:0}, {playerNumber:1}]
		const engine = createDirections({basic:[
			{id:'smile', message:'Beam us a solar smile!', hint:'Try a gentle smile.', points:12, congratulation:'Solar smile received!', expects:{type:'expression', emoji:['smile']}},
			{id:'kiss', message:'Blow a comet kiss!', points:20, expects:{type:'expression', emoji:['kiss']}}
		]}, {advancedMode:false, now})
		const session = new DirectionsSession(engine, {now})
		const write = bindTextElement(document.getElementById('feedback'), 42, 200, false, false)
		const setFeedback = (message, rate, style, announce, directionMessage = false) => {
			if (message) owns = directionMessage
			return write(message, rate, style)
		}
		const view = createDirectionsFeedback(setFeedback, () => owns)
		const tick = ms => {
			time += ms
			view.render(session.update(people, {paused:!!setFeedback() && !owns}))
		}
		window.challenge = {session, view, people, setFeedback, tick}
		tick(0)
	`, resolveDir:process.cwd()}, bundle:true, write:false, format:'iife'})
	const dom = new JSDOM('<body><p id="feedback" role="status" class="none">Ready</p></body>', {runScripts:'dangerously', pretendToBeVisual:true})
	try {
		dom.window.eval(bundle.outputFiles[0].text)
		const element = dom.window.document.getElementById('feedback')
		const {session,view,people,setFeedback,tick} = dom.window.challenge
		assert.equal(element.textContent, 'Beam us a solar smile!')
		assert.equal(dom.window.document.body.children.length, 1)
		assert.equal(dom.window.document.querySelectorAll('button, .directions-feedback').length, 0)
		assert.equal(element.getAttribute('style'), null)
		assert.equal(element.className, 'none')
		tick(7000)
		assert.equal(element.textContent, 'Try a gentle smile.')
		session.respond('smile', people[0])
		view.render(session.getSnapshot())
		assert.match(element.textContent, /Solar smile received! \+12 points!/)
		setFeedback('X', 0, 'volume')
		tick(1000)
		assert.equal(element.textContent, 'X')
		assert.equal(session.getSnapshot().phase, 'paused')
		await new Promise(resolve => setTimeout(resolve, 250))
		tick(10000)
		assert.match(element.textContent, /Solar smile received/)
		const state = session.getSnapshot()
		state.responses = []
		state.supporting = false
		state.direction.message = '<img src=x onerror="window.injected=true">'
		view.render(state)
		assert.equal(element.querySelectorAll('img').length, 0)
		assert.equal(!!dom.window.injected, false)
	} finally {
		dom.window.close()
	}
})
