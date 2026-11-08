/** @jest-environment node */
import {unzipSync,strFromU8} from 'fflate'
import {JSDOM} from 'jsdom'
import {createSessionDAWProject} from '../source/audio/dawproject/session-dawproject.js'

const event=(time,type,note,velocity=100,track=0,channel=0)=>({time,type,note,velocity,track,channel})
const parse=text=>new JSDOM(text,{contentType:'text/xml'}).window.document
const generate=async(events,options={})=>{
	const manifest={durationMs:3000,tracks:{0:{name:'Piano & "keys"'},1:{name:'Bass'}},tempoMap:[{time:0,bpm:90},{time:1000,bpm:120}]}
	const blob=await createSessionDAWProject(manifest,async function*(){yield* events},options)
	const files=unzipSync(new Uint8Array(await blob.arrayBuffer()))
	return {files,project:parse(strFromU8(files['project.xml'])),metadata:parse(strFromU8(files['metadata.xml']))}
}

test('creates a DAWproject ZIP with separate note tracks, escaped names, seconds and tempo automation',async()=>{
	const {files,project,metadata}=await generate([
		event(500,'noteOff',60,30),event(0,'noteOn',60),
		event(1000,'noteOn',48,127,1,2),event(2500,'noteOff',48,0,1,2)
	],{title:'A <performance> & friends'})
	expect(Object.keys(files).sort()).toEqual(['metadata.xml','project.xml'])
	expect(project.documentElement.nodeName).toBe('Project')
	expect(metadata.querySelector('Title').textContent).toBe('A <performance> & friends')
	expect(project.querySelector('Track').getAttribute('name')).toBe('Piano & "keys"')
	const notes=[...project.querySelectorAll('Note')]
	expect(notes).toHaveLength(2)
	expect(notes[0].getAttribute('duration')).toBe('0.5')
	expect(notes[1].getAttribute('time')).toBe('1')
	expect(notes[1].getAttribute('duration')).toBe('1.5')
	expect(notes[1].getAttribute('channel')).toBe('2')
	expect(notes[1].getAttribute('vel')).toBe('1')
	expect(project.querySelector('Tempo').getAttribute('value')).toBe('90')
	expect(project.querySelector('TempoAutomation RealPoint:last-child').getAttribute('value')).toBe('120')
	const ids=new Set([...project.querySelectorAll('[id]')].map(n=>n.id))
	for(const node of project.querySelectorAll('[track],[destination],[parameter]')){
		for(const attr of ['track','destination','parameter'])if(node.hasAttribute(attr))expect(ids.has(node.getAttribute(attr))).toBe(true)
	}
})

test('repeated notes, zero-velocity note-offs and held notes have bounded durations',async()=>{
	const {project}=await generate([event(0,'noteOn',60),event(500,'noteOn',60),event(1000,'noteOn',60,0),event(1200,'noteOn',62)],{endTime:2000})
	expect([...project.querySelectorAll('Note')].map(n=>n.getAttribute('duration'))).toEqual(['0.5','0.5','0.8'])
})

test('rejects invalid event timing rather than exporting corrupt XML',async()=>{
	await expect(generate([event(NaN,'noteOn',60)])).rejects.toThrow('Invalid saved note timestamp')
})
