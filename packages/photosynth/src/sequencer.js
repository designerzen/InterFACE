import { getArpeggioTiming, getArpeggioTimingOptionsForRate } from './timing/arpeggio.js'
import { PERSON_TYPE_DATA } from './people/person.presets.js'

/** Clock-driven note events; hosts may drive tick() without a camera or audio engine. */
export class EventSequencer {
	lanes = new Map()
	accept(events, performer, bpm) {
		const mode = PERSON_TYPE_DATA[performer.userMode]
		if (!mode?.arpeggiate) return events
		const current = this.lanes.get(performer.id)
		if (current) current.event = { ...current.event, velocity: performer.noteVelocity }
		const output = []
		for (const event of events) {
			if (event.type === 'allNotesOff' || event.type === 'noteOff' || event.type === 'chordOff') {
				output.push(...this.release(event.source, event.time))
				continue
			}
			if (event.type !== 'chordOn' && event.type !== 'chordRetrigger') { output.push(event); continue }
			output.push(...this.release(event.source, event.time))
			const timingOptions = { ...(mode.performanceMode === 'harp' ? { clockStep: 4 } : {}), ...getArpeggioTimingOptionsForRate(performer.options.arpeggioRate, mode.performanceMode ?? 'arpeggio') }
			const timing = getArpeggioTiming(bpm, timingOptions)
			const notes = event.notes.map(value => typeof value === 'number' ? value : value.noteNumber)
			const expanded = mode.performanceMode === 'harp' ? Array.from({ length: 4 }, (_, octave) => notes.map(note => note + octave * 12)).flat().filter(note => note <= 127) : notes
			if (expanded.length) this.lanes.set(event.source, { event, notes: expanded, position: 0, nextAt: event.time, offAt: Infinity, timingOptions, bpm, ...timing })
		}
		return output
	}
	tick(time, bpm) {
		const output = []
		for (const lane of this.lanes.values()) {
			if (bpm !== undefined && lane.bpm !== bpm) {
				const timing = getArpeggioTiming(bpm, lane.timingOptions)
				lane.nextAt = time + Math.max(0, (lane.nextAt - time) / lane.intervalMs) * timing.intervalMs
				Object.assign(lane, timing, { bpm })
			}
			if (lane.active !== undefined && time >= lane.offAt) {
				output.push({ ...lane.event, notes: undefined, type: 'noteOff', note: lane.active, velocity: 0, time: lane.offAt })
				lane.active = undefined
			}
			if (time < lane.nextAt) continue
			// Skip missed clock positions after suspension instead of bursting old notes.
			const skipped = Math.floor((time - lane.nextAt) / lane.intervalMs)
			lane.position += skipped
			const at = lane.nextAt + skipped * lane.intervalMs
			if (lane.active !== undefined) output.push({ ...lane.event, notes: undefined, type: 'noteOff', note: lane.active, velocity: 0, time: at })
			lane.active = lane.notes[lane.position++ % lane.notes.length]
			lane.offAt = at + lane.gateMs
			lane.nextAt = at + lane.intervalMs
			output.push({ ...lane.event, notes: undefined, type: 'noteOn', note: lane.active, time: at })
		}
		return output
	}
	release(source, time) {
		const lane = this.lanes.get(source)
		this.lanes.delete(source)
		return lane?.active === undefined ? [] : [{ ...lane.event, notes: undefined, type: 'noteOff', note: lane.active, velocity: 0, time }]
	}
	reset(time) { return [...this.lanes.keys()].flatMap(source => this.release(source, time)) }
}
