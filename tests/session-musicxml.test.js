/** @jest-environment node */
import {JSDOM} from 'jsdom'
import {createSessionMusicXML} from '../source/audio/notation/session-musicxml.js'

const event=(time,type,note=60,track=0,velocity=100)=>({time,type,note,track,channel:0,velocity})
const generate=async(events,manifest={},options={})=>{
	const blob=await createSessionMusicXML({durationMs:3000,tracks:{0:{name:'Keys & strings',program:0}},tempoMap:[{time:0,bpm:120}],...manifest},async function*(){yield* events},options)
	expect(blob.type).toBe('application/vnd.recordare.musicxml+xml')
	return new JSDOM(await blob.text(),{contentType:'text/xml'}).window.document
}

test('exports named parts, escaped titles, pitch and tempo-aware durations',async()=>{
	const doc=await generate([event(0,'noteOn',61),event(1000,'noteOff',61),event(1000,'noteOn',48,1),event(2000,'noteOff',48,1)],{tempoMap:[{time:0,bpm:120},{time:500,bpm:60}]},{title:'A <song>'})
	expect(doc.documentElement.tagName).toBe('score-partwise')
	expect(doc.querySelector('work-title').textContent).toBe('A <song>')
	expect(doc.querySelector('part-name').textContent).toBe('Keys & strings')
	expect(doc.querySelectorAll('part')).toHaveLength(2)
	expect(doc.querySelector('pitch').textContent).toBe('C14')
	expect(doc.querySelector('note duration').textContent).toBe('1440')
	expect(doc.querySelector('midi-program').textContent).toBe('1')
	expect([...doc.querySelectorAll('part:first-of-type sound')].map(n=>n.getAttribute('tempo'))).toEqual(['120','60'])
})

test('overlapping notes use separate voices, with ties at bar lines and complete measures',async()=>{
	const doc=await generate([event(0,'noteOn'),event(500,'noteOn',64),event(1000,'noteOff',64),event(2500,'noteOff')])
	expect(doc.querySelector('backup duration').textContent).toBe('3840')
	expect(doc.querySelectorAll('tie[type="start"]')).toHaveLength(1)
	expect(doc.querySelectorAll('tie[type="stop"]')).toHaveLength(1)
	for(const measure of doc.querySelectorAll('measure')){
		let cursor=0
		for(const node of measure.children){
			if(node.tagName==='note')cursor+=Number(node.querySelector('duration').textContent)
			if(node.tagName==='backup')cursor-=Number(node.querySelector('duration').textContent)
			expect(cursor).toBeGreaterThanOrEqual(0)
			expect(cursor).toBeLessThanOrEqual(3840)
		}
		expect(cursor).toBe(3840)
	}
})

test('zero-velocity note-ons end notes and held notes end at the export snapshot',async()=>{
	const doc=await generate([event(0,'noteOn'),event(500,'noteOn',60,0,0),event(1000,'noteOn',62)],{}, {endTime:1500})
	expect([...doc.querySelectorAll('note')].filter(n=>n.querySelector('pitch')).map(n=>n.querySelector('duration').textContent)).toEqual(['960','960'])
})

test('rejects invalid timestamps and recordings without notes',async()=>{
	await expect(generate([event(NaN,'noteOn')])).rejects.toThrow('Invalid saved note timestamp')
	await expect(generate([])).rejects.toThrow('no saved notes')
})
