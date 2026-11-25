import {createMusicFactoryPlayer} from '../source/audio/music-factory-player.js'
import {setupMusicFactory} from '../source/dom/ui.music-factory.js'
import pug from 'pug'

const parameter = () => ({value:0, setValueAtTime:jest.fn(), linearRampToValueAtTime:jest.fn(), setTargetAtTime:jest.fn(), cancelScheduledValues:jest.fn()})
const node = () => ({connect:jest.fn(), disconnect:jest.fn()})
const audio = () => {
	const oscillators = []
	const context = {currentTime:1, state:'running', resume:jest.fn(async()=>{}),
		createGain:()=>({...node(),gain:parameter()}),
		createBiquadFilter:()=>({...node(),frequency:parameter()}),
		createStereoPanner:()=>({...node(),pan:parameter()}),
		createOscillator:()=>{const osc={...node(), frequency:parameter(), start:jest.fn(), stop:jest.fn()};oscillators.push(osc);return osc}}
	return {context,oscillators}
}
const event = {pitch:60,velocity:0.5,role:'lead',person:0,program:4,tone:'keys'}

beforeEach(()=>jest.useFakeTimers())
afterEach(()=>{jest.clearAllTimers();jest.useRealTimers()})

test('audio uses future audio deadlines; stopping cancels unperformed attacks',()=>{
	const {context,oscillators}=audio(), record=jest.fn()
	const player=createMusicFactoryPlayer(context,{},record)
	player.play(event,2,0.5)
	expect(oscillators[0].start).toHaveBeenCalledWith(2)
	expect(record).not.toHaveBeenCalled()
	player.stop();jest.runAllTimers()
	expect(record).not.toHaveBeenCalled()
	expect(oscillators[0].disconnect).toHaveBeenCalled()
	player.destroy()
})

test('recording receives balanced owned note lifetimes and programs on stop',()=>{
	const {context}=audio(),record=jest.fn(),player=createMusicFactoryPlayer(context,{},record)
	player.play(event,1,2);jest.advanceTimersByTime(0)
	expect(record.mock.calls.map(([value])=>value.type)).toEqual(['programChange','noteOn'])
	player.stop();jest.runAllTimers()
	expect(record.mock.calls.map(([value])=>value.type)).toEqual(['programChange','noteOn','noteOff'])
	expect(record.mock.calls[1][0]).toMatchObject({source:'music-factory:lead:0',person:0,program:4})
	player.destroy()
})

test('same-address retrigger explicitly releases the earlier note before attacking again',()=>{
	const {context}=audio(),record=jest.fn(),player=createMusicFactoryPlayer(context,{},record)
	player.play(event,1,2);jest.advanceTimersByTime(0)
	player.play(event,1.5,1)
	context.currentTime=1.5; jest.advanceTimersByTime(500)
	expect(record.mock.calls.map(([value])=>value.type)).toEqual(['programChange','noteOn','noteOff','programChange','noteOn'])
	player.destroy()
})

test('late events are discarded and expression changes do not create attacks',()=>{
	const {context,oscillators}=audio(),player=createMusicFactoryPlayer(context,{},jest.fn())
	player.play(event,0,1)
	player.express([{id:0,energy:0.8,brightness:0.5,pan:-0.3}])
	expect(oscillators).toHaveLength(0)
	player.destroy()
})

test('delayed recording callbacks cannot outlive a stop, even after audio nodes have ended',()=>{
	const {context,oscillators}=audio(),record=jest.fn(),player=createMusicFactoryPlayer(context,{},record)
	player.play(event,2,0.5)
	oscillators[0].onended()
	player.stop();jest.runAllTimers()
	expect(record).not.toHaveBeenCalled()
	player.destroy();player.destroy()
	player.play(event,2,1)
	expect(oscillators).toHaveLength(1)
})

const interfaceHarness = (initial={}) => {
	document.body.innerHTML=pug.renderFile('source/partials/control-panel.pug') + pug.renderFile('source/partials/onboarding.pug')
	document.getElementById('timer-toggle').checked=true
	const {context,oscillators}=audio()
	const values=new Map(Object.entries({musicFactory:false,musicFactoryGenre:'ambient',musicFactorySeed:'saved',players:4,bpm:90,...initial}))
	const onMode=jest.fn(),onProfile=jest.fn()
	const api=setupMusicFactory({context,destination:{},stateMachine:{get:key=>values.get(key),set:(key,value)=>values.set(key,value)},onMode,onProfile})
	return {api,values,context,oscillators,onMode,onProfile}
}

test('the switch selects the saved style, exposes controls and restores instrument mode',()=>{
	const h=interfaceHarness(),toggle=document.getElementById('button-music-factory')
	expect(toggle.parentElement.parentElement.id).toBe('settings')
	expect(toggle.parentElement.classList.contains('type-music')).toBe(true)
	expect(document.querySelector('#shared-controls #button-music-factory')).toBeNull()
	expect(document.querySelector('.music-factory-switch')).toBeNull()
	expect(document.querySelector('#music-factory-controls .folder-content.settings-folder .control-settings')).not.toBeNull()
	expect(document.getElementById('music-factory-genre').options).toHaveLength(12)
	toggle.parentElement.click()
	expect(h.values.get('musicFactory')).toBe(true)
	expect(h.onProfile).toHaveBeenLastCalledWith(expect.objectContaining({id:'ambient'}))
	expect(document.getElementById('music-factory-controls').hidden).toBe(false)
	expect(document.getElementById('toggle-music-factory').checked).toBe(true)
	toggle.parentElement.click()
	expect(h.onMode.mock.calls).toEqual([[true],[false]])
	expect(document.getElementById('music-factory-controls').hidden).toBe(true)
	expect(document.getElementById('toggle-music-factory').checked).toBe(false)
	h.api.destroy()
})

test('style changes and new pieces persist; stopped transport cannot emit future notes',()=>{
	const h=interfaceHarness({musicFactory:true})
	const genre=document.getElementById('music-factory-genre')
	genre.value='waltz';genre.dispatchEvent(new Event('change'))
	expect(h.values.get('musicFactoryGenre')).toBe('waltz')
	document.getElementById('music-factory-new').click()
	expect(h.values.get('musicFactorySeed')).not.toBe('saved')
	const transport=document.getElementById('timer-toggle')
	transport.checked=false;transport.dispatchEvent(new Event('change'))
	h.api.observe(0,{mouthRatio:0.3,pitch:0,time:1},1)
	h.api.tick({at:1,bpm:100,audioNow:1})
	expect(h.oscillators).toHaveLength(0)
	h.api.destroy()
})

test('destroy removes UI listeners and owned voices',()=>{
	const h=interfaceHarness()
	h.api.destroy(); h.onMode.mockClear()
	const toggle=document.getElementById('button-music-factory')
	toggle.checked=true;toggle.dispatchEvent(new Event('change'))
	expect(h.onMode).not.toHaveBeenCalled()
})
