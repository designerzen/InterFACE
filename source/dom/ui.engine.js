import { normaliseEngineSettings } from '../audio/voice-engine-settings.js'
import { GENERAL_MIDI_INSTRUMENT_DATA } from '../audio/general-midi-instruments.data.js'
import { REVERB_SPACES } from '../audio/effects/reverb-spaces.js'

export const setupEngineInterface = ({getHost, getEngine, onChanged, document=globalThis.document}) => {
	const panel = document.getElementById('engine-settings')
	if (!panel) return null
	const folder = panel.closest('.folder-menu')
	const status = document.getElementById('voice-engine-status')
	const instrument = document.getElementById('engine-reverb-instrument')
	const enabled = document.getElementById('engine-reverb-instrument-enabled')
	for (const [program, data] of Object.entries(GENERAL_MIDI_INSTRUMENT_DATA)) {
		const option = document.createElement('option')
		option.value = program
		option.textContent = `${Number(program)+1}. ${data.title ?? data.name ?? program}`
		instrument.append(option)
	}
	const roomSpace = document.getElementById('engine-room-space')
	for (const space of REVERB_SPACES) {
		const option = document.createElement('option')
		option.value = space.id
		option.textContent = space.label
		roomSpace.append(option)
	}
	let busy = false
	let switching = false
	let switchingFocus
	let switchingOpen = false
	const set = (element,key,value) => { if (element[key] !== value) element[key] = value }
	const isOpen = () => folder.classList.contains('open') || document.defaultView.location.hash === '#folder-engine' || folder.classList.contains('controls-list-folder-open')
	const refresh = () => {
		const host = getHost()
		const engine = host?.engine ?? getEngine()
		const settings = host?.settings[engine] ?? normaliseEngineSettings(engine)
		for (const section of panel.querySelectorAll('[data-engine-settings]')) {
			set(section,'hidden',!section.dataset.engineSettings.split(' ').includes(engine))
			set(section,'disabled',!!(section.hidden || !host || busy || switching || host.switching))
		}
		for (const input of panel.querySelectorAll('[data-engine-setting]')) {
			if (input.closest('[data-engine-settings]').hidden) continue
			set(input,'value',String(settings[input.dataset.engineSetting]))
			updateOutput(input)
		}
		const impulse = document.getElementById('select-impulse')
		if (settings.reverbSpace !== undefined) set(impulse,'value',settings.reverbSpace)
		set(document.getElementById('engine-reverb-custom'),'hidden',document.getElementById('engine-app-reverb').hidden || settings.reverbMode !== 'custom')
		set(enabled,'checked',!settings.reverbDisabledPrograms?.includes(Number(instrument.value)))
		set(document.getElementById('engine-reverb-instruments'),'hidden',engine === 'yoshimi')
		set(document.getElementById('engine-reverb-mode').options[0],'textContent',engine === 'yoshimi' ? 'Subtle tail (5%)' : 'Use instrument preset')
		set(document.getElementById('engine-reverb-help'),'textContent',engine === 'yoshimi' ?
			'Yoshimi’s stereo reverb tail is shared by all players. The default app mix is a subtle 5%; its built-in effects stay enabled.' :
			'Applies to all players using the selected instrument. Reverb tails continue after mouth expression closes.')
		const selector = document.getElementById('select-voice-engine')
		set(selector,'disabled',!!(!host || busy || switching || host.switching))
		if (!switching) set(selector,'value',engine)
	}
	const formatters = {
		reverbMix:value => `${Math.round(value*100)}%`,
		roomMix:value => value > 0 ? `${Math.round(value*100)}%` : 'Off',
		outputGainDb:value => `${Number(value) >= 0 ? '+' : ''}${value} dB`,
		reverbLength:value => `${value} s`,
		reverbTone:value => Math.abs(value) < 0.1 ? 'Neutral' : `${value < 0 ? 'Dark' : 'Bright'} ${Math.round(Math.abs(value)*100)}%`,
		reverbPreDelay:value => `${Math.round(value*1000)} ms`
	}
	const updateOutput = input => {
		const output = input.parentElement.querySelector('output')
		const format = formatters[input.dataset.engineSetting]
		if (output) set(output,'value',format ? format(Number(input.value)) : input.value)
	}
	const change = async changes => {
		const host = getHost()
		if (!host || busy) return
		const focus = panel.contains(document.activeElement) ? document.activeElement : null
		const keepOpen = isOpen() || !!focus
		busy = true
		refresh()
		try {
			await host.setSettings(changes)
			onChanged(host.settings)
			status.textContent = 'Engine settings saved for all players.'
		}catch(error){ status.textContent = `Could not apply engine settings: ${error.message}` }
		finally {
			busy = false; refresh()
			if (keepOpen && !folder.classList.contains('engine-dismissed')) {
				folder.classList.add('open')
				focus?.focus({preventScroll:true})
			}
		}
	}
	panel.addEventListener('input', event => { if (event.target.matches('[data-engine-setting]')) updateOutput(event.target) })
	for (const type of ['keydown','keyup']) panel.addEventListener(type, event => {
		if (event.target.matches('input,select') && !['Tab','Escape'].includes(event.key)) event.stopPropagation()
	})
	panel.addEventListener('change', event => {
		const input = event.target
		if (input === instrument) { refresh(); return }
		if (input === enabled) {
			const host = getHost()
			if (!host) return
			const disabled = new Set(host.settings[host.engine].reverbDisabledPrograms)
			if (enabled.checked) disabled.delete(Number(instrument.value))
			else disabled.add(Number(instrument.value))
			void change({reverbDisabledPrograms:[...disabled]})
			return
		}
		if (input.matches('[data-engine-setting]')) void change({[input.dataset.engineSetting]:input.type === 'range' ? Number(input.value) : input.value})
	})
	const close = () => {
		folder.classList.remove('open')
		folder.classList.add('engine-dismissed')
		if (document.defaultView.location.hash === '#folder-engine') document.defaultView.history.replaceState(null,'',document.defaultView.location.pathname+document.defaultView.location.search)
		if (!document.getElementById('control-panel').classList.contains('controls-list-open')) {
			// Focusing the Engine launcher here immediately reopens its :focus-within drawer.
			(document.getElementById('button-settings') ?? document.getElementById('button-controls-list'))?.focus({preventScroll:true})
		}
	}
	const open = () => { folder.classList.remove('engine-dismissed'); folder.classList.add('open') }
	folder.querySelector('.folder-link').addEventListener('click', () => { open(); refresh() })
	panel.addEventListener('pointerdown', open, true)
	panel.addEventListener('change', open, true)
	folder.querySelector('.folder-content > a[href="#control-panel"]').addEventListener('click', close)
	folder.addEventListener('keydown', event => {
		if (event.key === 'Escape' && !document.getElementById('control-panel').classList.contains('controls-list-open')) { event.preventDefault(); event.stopPropagation(); close() }
	})
	refresh()
	return {refresh, change, setSwitching(value){
		if (value) {
			switchingFocus = panel.contains(document.activeElement) ? document.activeElement : null
			switchingOpen = isOpen() || !!switchingFocus
		}
		switching = value; refresh()
		if (!value && switchingOpen && !folder.classList.contains('engine-dismissed')) {
			folder.classList.add('open')
			switchingFocus?.focus({preventScroll:true})
		}
	}}
}
