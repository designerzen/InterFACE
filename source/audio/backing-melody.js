import { backingHarmony, BACKING_SOURCE, createBackingSeed, constrainBacking } from './backing-melody-sequence.js'

export const createBackingMelody = ({ loadModel, player, subscribe, acceptsInput, onStatus=()=>{}, now=()=>performance.now() }) => {
	let wanted=false, enabled=false, ready=false, busy=false, epoch=0, model=null
	let options={}, signature='', queued=null, notes=[], lastInput=-Infinity, suspended=false
	let lifetime=0
	const held = new Map()
	const status = message => onStatus(message)
	const reset = () => { epoch++; queued=null; notes=[]; held.clear(); lastInput=-Infinity; player.stop() }
	const fail = (error, token) => {
		if (token!==epoch) return
		reset(); enabled=false; ready=false; busy=false
		model?.destroy(); model=null
		status(`Backing melody unavailable: ${error.message}. Turn it off and on to retry.`)
	}
	const setEnabled = value => {
		const life=++lifetime
		wanted=Boolean(value); enabled=wanted; ready=false; busy=false
		reset(); model?.destroy(); model=null
		if (!enabled) { status('Backing melody off'); return }
		status('Loading backing melody model…')
		Promise.resolve().then(loadModel).then(async instance => {
			if (life!==lifetime) { instance.destroy(); return }
			model=instance
			await instance.initialize()
			if (life!==lifetime) return
			ready=true; status('Play a phrase to start the backing melody')
		}).catch(error => { if (life===lifetime) fail(error,epoch) })
	}
	const unsubscribe = subscribe(event => {
		if (!enabled || suspended || event.source===BACKING_SOURCE || event.channel===9 || event.transient || String(event.source).startsWith('midi-output:') || !acceptsInput(event,options.backingMelodyPlayer ?? 0)) return
		if (!Number.isInteger(event.note) || event.note<0 || event.note>127) return
		const time=Number.isFinite(event.performanceTime)?event.performanceTime:now()
		const key=`${event.source}:${event.channel ?? 0}:${event.note}`
		if (event.type==='noteOff' || (event.type==='noteOn' && event.velocity<=0)) {
			const note=held.get(key)
			if (note) { note.end=time; held.delete(key) }
		} else if (event.type==='noteOn' && event.velocity>0) {
			if (held.has(key)) held.get(key).end=time
			const note={pitch:event.note,start:time}
			notes.push(note); held.set(key,note); lastInput=time
			// Bound memory even if an input never releases its notes.
			if (notes.length>512) notes=notes.slice(-512)
		}
	})
	return {
		configure:settings => {
			const oldLocation=options.backingMelodyModelURL
			options={...settings}
			player.setVolume(options.backingMelodyVolume ?? 0.25)
			const nextSignature=JSON.stringify([options.key,options.keyScale,options.backingMelodyPlayer,options.bpm])
			if (signature && nextSignature!==signature) reset()
			signature=nextSignature
			if (Boolean(options.backingMelody)!==wanted || (wanted && oldLocation!==options.backingMelodyModelURL)) setEnabled(options.backingMelody)
			const nextSuspended=Boolean(options.muted)
			if (nextSuspended!==suspended) { suspended=nextSuspended; reset() }
		},
		tick:({isBar,at,bpm}) => {
			if (!enabled || !ready || suspended || !isBar || !Number.isFinite(at) || !Number.isFinite(bpm) || bpm<=0) return
			const time=now(), barMs=240000/bpm
			if (time-lastInput>barMs*2) { queued=null; player.stop(); status('Play a phrase to start the backing melody'); return }
			if (queued) { player.play(queued,at,bpm); queued=null; status('Backing melody playing') }
			if (busy) return
			notes=notes.filter(note => (note.end ?? time)>time-barMs*2)
			const seed=createBackingSeed(notes,time,bpm)
			if (!seed.notes.length) return
			const harmony=backingHarmony(options), token=epoch, instance=model
			busy=true
			status('Creating the next backing phrase…')
			instance.generate(seed,harmony.chord).then(sequence => {
				if (token!==epoch) return
				queued=constrainBacking(sequence,harmony.pitches)
				status('Backing melody ready for the next bar')
			}).catch(error => fail(error,token)).finally(() => { if (model===instance) busy=false })
		},
		stop:reset,
		destroy:() => { setEnabled(false); unsubscribe(); player.destroy() }
	}
}
