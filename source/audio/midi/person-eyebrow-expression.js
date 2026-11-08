import { dispatchMIDIActivity, sendGuardedMIDIOutput } from './midi-echo-guard.js'

const expressions = new WeakMap()

export const stopMIDIEyebrowsForPerson = person => {
	const previous = expressions.get(person)
	if (previous?.mode === 'pitchbend' && previous.value !== 0) {
		for (const output of previous.outputs) sendGuardedMIDIOutput(output, 'sendPitchBend', 0, previous.options, 'eyebrows-reset')
	}
	expressions.delete(person)
}

export const updateMIDIEyebrowsForPerson = (person, outputs, options, settings = {}) => {
	const mode = settings.mode === 'pitchbend' ? 'pitchbend' : 'cc'
	const controller = Number.isInteger(settings.cc) && settings.cc >= 0 && settings.cc < 120 ? settings.cc : 74
	const previous = expressions.get(person)
	const sameRoute = previous && previous.mode === mode && previous.controller === controller &&
		JSON.stringify(previous.options) === JSON.stringify(options) &&
		previous.outputs.length === outputs.length && previous.outputs.every((output, index) => output === outputs[index])
	if (!person.options?.pitchBend || !sameRoute) stopMIDIEyebrowsForPerson(person)
	if (!person.options?.pitchBend || !outputs.length) return

	const extent = person.data?.eyebrowExtents
	if (!Number.isFinite(extent)) return
	const bend = Math.max(-1, Math.min(1, extent - 1))
	const value = mode === 'cc' ? Math.round((bend + 1) * 127 / 2) : Math.round(bend * 8191) / 8191
	if (sameRoute && previous.value === value) return

	for (const output of outputs) {
		if (mode === 'pitchbend') {
			sendGuardedMIDIOutput(output, 'sendPitchBend', value, options, 'eyebrows')
		} else if (output.sendControlChange) {
			output.sendControlChange(controller, value, options)
			dispatchMIDIActivity({ direction:'output', type:'controlchange', controller, value, options, port:output.name, source:'eyebrows' })
		}
	}
	expressions.set(person, { mode, controller, value, outputs:[...outputs], options:{...options} })
}
