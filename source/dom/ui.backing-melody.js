import { createBackingMelody } from '../audio/backing-melody.js'
import { faderToGain, gainToFader } from '../audio/volume-curve.js'
import { createBackingMelodyPlayer } from '../audio/backing-melody-player.js'
import { observeSessionEvents, recordSessionEvent } from '../storage/session-events.js'

export const setupBackingMelody = ({context,destination,stateMachine,personManager,document=globalThis.document}) => {
	const output=document.getElementById('backing-melody-status')
	const settings=() => Object.fromEntries(['backingMelody','backingMelodyVolume','backingMelodyPlayer','backingMelodyModelURL','key','keyScale','bpm','muted'].map(key => [key,stateMachine.get(key)]))
	const containsSource=(instrument,source) => Boolean(instrument && (instrument.id===source || instrument.instruments?.some(child => containsSource(child,source)) || containsSource(instrument.activeInstrument,source)))
	const controller=createBackingMelody({
		loadModel:async () => (await import('../audio/backing-melody-model.js')).createBackingMelodyModel(stateMachine.get('backingMelodyModelURL')),
		player:createBackingMelodyPlayer(context,destination,recordSessionEvent),
		subscribe:observeSessionEvents,
		acceptsInput:(event,index) => {
			const person=personManager.getPerson(Number(index))
			return event.person===Number(index) || person?.instruments?.some(instrument => containsSource(instrument,event.source)) || containsSource(person?.activeInstrument,event.source)
		},
		onStatus:message => { if (output) output.textContent=message }
	})
	const configure=() => controller.configure(settings())
	const volume=document.getElementById('backing-melody-volume')
	if (volume) {
		const amount=document.getElementById('backing-melody-volume-output')
		const updateVolume=() => {
			if (amount) amount.value=`${Math.round(faderToGain(volume.value)*100)}%`
			volume.setAttribute('aria-valuetext', `${Math.round(faderToGain(volume.value)*100)}%`)
			for (const button of document.querySelectorAll('[data-volume-target="backing-melody-volume"]')) {
				button.disabled=button.dataset.volumeDirection==='decrease'?Number(volume.value)<=0:Number(volume.value)>=1
			}
		}
		volume.value=gainToFader(stateMachine.get('backingMelodyVolume') ?? 0.25)
		volume.oninput=() => { stateMachine.set('backingMelodyVolume',faderToGain(volume.value)); configure(); updateVolume() }
		updateVolume()
	}
	const performer=document.getElementById('backing-melody-player')
	if (performer) {
		performer.value=stateMachine.get('backingMelody') ? String(stateMachine.get('backingMelodyPlayer') ?? 0) : 'disabled'
		performer.onchange=() => {
			const enabled=performer.value !== 'disabled'
			if (enabled) stateMachine.set('backingMelodyPlayer',Number(performer.value))
			stateMachine.set('backingMelody',enabled)
			if (enabled && context.state==='suspended') context.resume().catch(() => {})
			configure()
		}
	}
	configure()
	const location=document.getElementById('backing-melody-model-url')
	if (location) {
		location.value=stateMachine.get('backingMelodyModelURL') ?? ''
		location.onchange=() => { stateMachine.set('backingMelodyModelURL',location.value.trim()); configure() }
	}
	document.getElementById('timer-toggle')?.addEventListener('change',event => {
		if (!event.currentTarget.checked) controller.stop()
	})
	return { tick:tick => { configure(); controller.tick(tick) }, stop:controller.stop, destroy:controller.destroy }
}
