import { readFileSync } from 'fs'
import { presets } from '../static/assets/ensemble-presets.json'
import { createDrumArranger } from '../source/timing/drum-arranger.js'
import { DRUM_GROOVES } from '../source/timing/drum-patterns.js'
import { getPercussionPreset } from '../source/audio/synthesizers/percussion-presets.js'
import { getPitchClassForKey, normaliseKeyName } from '../source/audio/tuning/keys.js'

// Run the actual interface handler with lightweight control and clock adapters.
const source=readFileSync('source/interface.js','utf8')
const handler=source.match(/const applyEnsemblePresetOptions = (\(preset=\{\}\) => \{[\s\S]*?\n\t\})/)[1]
const harness=()=>{
	const state=new Map([['percussionPattern','random'],['percussionSound','random'],['drumkit','trap'],['bpm',90],['swing',0.3]])
	const clock={BPM:90,swing:0.3}
	const controls=['key','keyScale','percussionPattern','percussionSound','drumkit']
	const selects=Object.fromEntries(controls.map(name=>[name,{value:''}]))
	const kit={cancel:jest.fn()}
	const applyPercussionSoundPreset=jest.fn()
	const deps={
		clock,selects,kit,networkTiming:null,
		stateMachine:{get:key=>state.get(key),set:(key,value)=>state.set(key,value)},
		setBPM:value=>{clock.BPM=value;state.set('bpm',value)},
		syncTempoControls:jest.fn(),updateKeyScaleControlVisibility:jest.fn(),
		getPitchClassForKey,normaliseKeyName,getPercussionPreset,
		applyPercussionSoundPreset,applyPercussionKitPreset:jest.fn(),
		createDrumArranger,setElementCheckState:jest.fn(),buttonPercussion:{},changeDrumPattern:jest.fn(),
	}
	const api=new Function(...Object.keys(deps),`let drumArranger;return {apply:(${handler}),getArranger:()=>drumArranger}`)(...Object.values(deps))
	return {...api,state,clock,selects,kit,applyPercussionSoundPreset}
}

test.each(presets.filter(preset=>preset.style).map(preset=>[preset.title,preset]))('%s applies and saves the full musical setup', (_,preset)=>{
	const api=harness()
	api.apply(preset)
	expect(api.clock).toMatchObject({BPM:preset.tempo.bpm,swing:preset.tempo.swing})
	expect(api.state.get('key')).toBe(preset.harmony.key)
	expect(api.state.get('keyScale')).toBe(preset.harmony.scale)
	expect(api.state.get('harmonyMode')).toBe('global-key')
	expect(api.state.get('backingTrack')).toBe(true)
	expect(api.state.get('drumkit')).toBe('')
	expect(api.state.get('percussionPattern')).toBe(preset.percussion.pattern)
	expect(api.state.get('percussionSound')).toBe(preset.percussion.sound)
	expect(api.selects.percussionPattern.value).toBe(preset.percussion.pattern)
	expect(api.selects.percussionSound.value).toBe(preset.percussion.sound)
	expect(api.applyPercussionSoundPreset).toHaveBeenCalledWith(preset.percussion.sound)
	const pattern=getPercussionPreset(preset.percussion.pattern)
	const groove=DRUM_GROOVES[pattern.groove]
	expect(api.getArranger().getStepsPerBar()).toBe(groove.stepsPerBar)
	expect(api.getArranger().getStepDuration()*groove.stepsPerBar).toBeCloseTo(60/preset.tempo.bpm*groove.meter[0]*4/groove.meter[1])
	// Startup and the percussion toggle both rebuild from these persisted IDs.
	const restored=createDrumArranger({groove:getPercussionPreset(api.state.get('percussionPattern')).groove,bpm:api.clock.BPM})
	expect(restored.getStepDuration()).toBe(api.getArranger().getStepDuration())
	for(let step=0;step<groove.kick.length;step++) {
		const parts=api.getArranger().next({bpm:api.clock.BPM})
		for(const [part,sequence] of Object.entries(groove)) {
			if(Array.isArray(sequence)&&sequence.length===groove.kick.length&&parts[part]>0)expect(sequence[step]).toBeGreaterThan(0)
		}
	}
})

test('legacy ensembles can still disable drums or select free-range harmony', ()=>{
	const api=harness()
	api.apply(presets.find(preset=>preset.id==='orchestra'))
	expect(api.state.get('backingTrack')).toBe(false)
	expect(api.kit.cancel).toHaveBeenCalled()
	api.apply(presets.find(preset=>preset.id==='sound-fx'))
	expect(api.state.get('harmonyMode')).toBe('free-range')
})
