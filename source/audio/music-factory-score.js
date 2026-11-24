export const clampFactory = (value, min=0, max=1) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
export const factoryHash = value => {
	let hash = 2166136261
	for (const letter of String(value)) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619)
	return hash >>> 0
}
const unit = key => factoryHash(key) / 4294967296
const mod = (value, length) => ((value % length) + length) % length
const degreePitch = (degree, scale, root) => root + scale[mod(degree, scale.length)] + 12 * Math.floor(degree / scale.length)

export const createFactoryIdentity = (seed, id, signature) => {
	const key = `${seed}:${id}:${signature}`
	const motif = [0, 2, 1, 4].map((degree, index) => degree + (index && unit(`${key}:${index}`) > 0.6 ? 1 : 0))
	return Object.freeze({id, seed:factoryHash(key), motif:Object.freeze(motif), shift:Math.floor(unit(`${key}:shift`) * 3)})
}

export const combineFactoryPlayers = players => {
	const members = players.slice(0, 4)
	const average = key => members.length ? members.reduce((sum, player) => sum + clampFactory(player[key]), 0) / members.length : 0
	const energy = average('energy')
	return {members, energy, tension:average('tension'), brightness:average('brightness'),
		contrast:members.length ? Math.max(...members.map(player => player.energy)) - Math.min(...members.map(player => player.energy)) : 0,
		// This is the contract already consumed by the expressive percussion arranger.
		noteVelocity:energy, pitchBend:average('tension')}
}

// Pure bar queries: previewing, reordering or skipping bars cannot consume randomness.
export const composeFactoryBar = ({profile, bar, root=0, ensemble, identities, seed, ending=false}) => {
	const {members, energy, tension} = ensemble
	if (!members.length) return {events:[], section:'waiting', lead:null}
	const sectionIndex = Math.floor(bar / profile.phraseBars) % profile.form.length
	const section = ending ? 'ending' : profile.form[sectionIndex]
	const route = section === 'contrast' ? profile.contrast : profile.progression
	const degree = ending ? 0 : route[bar % route.length]
	const scale = profile.scale
	const chord = Array.from({length:profile.chordSize}, (_, i) => degreePitch(degree + i * 2, scale, 48 + root))
	if (profile.blues) {
		chord[1] = chord[0] + 4; chord[2] = chord[0] + 7
	}
	const phrase = Math.floor(bar / profile.phraseBars)
	const leadIndex = phrase % members.length
	const lead = members[leadIndex]
	const events = []
	const add = (role, person, step, pitch, length, velocity) => {
		const swing = step % 2 === 1 ? profile.swing : 0
		events.push({id:`${bar}:${role}:${person}:${step}:${events.length}`, role, person, step:step + swing,
			pitch:Math.round(clampFactory(pitch, 28, 96)), length:Math.max(0.2, Math.min(length, profile.steps * 2)),
			velocity:clampFactory(velocity, 0.08, 0.8), tone:profile[`${role}Tone`], program:role === 'bass' ? 33 : role === 'harmony' ? 4 : profile.program})
	}
	const bassSteps = ending ? [0] : profile.bass
	for (const [index, step] of bassSteps.entries()) {
		let bass = chord[0] - 12
		if (!ending && profile.id === 'jazz') bass = degreePitch(degree + [0, 2, 4, 5][index % 4], scale, 36 + root)
		else if (!ending && index % 2) bass = chord[2] - 12
		add('bass', null, step, bass, ending ? profile.steps : Math.min(3, profile.steps / bassSteps.length * 0.8), 0.38 + energy * 0.18)
	}
	for (const step of ending ? [0] : profile.harmony) {
		const sustained = profile.harmonyTone === 'soft'
		const length = ending || sustained ? profile.steps * 0.92 : profile.harmonyTone === 'pluck' ? 0.65 : 2.4
		// Keep common tones near the middle register rather than jumping root blocks.
		const voiced = chord.map(note => note > 65 ? note - 12 : note)
		for (const note of voiced) add('harmony', null, step, note, length, (0.3 + energy * 0.12) / Math.sqrt(voiced.length))
	}
	if (ending) {
		add('lead', lead.id, 0, degreePitch(0, scale, 72 + root), profile.steps * 0.8, 0.45)
		return {events, section, lead:lead.id, chord}
	}
	// Share a fixed foreground budget. Four participants do not create four solos.
	const foreground = profile.lead.slice(0, Math.min(profile.lead.length, 3 + Math.round(energy * 4)))
	const ownerOffset = bar % members.length
	for (const [index, step] of foreground.entries()) {
		const answering = index >= Math.ceil(foreground.length * 0.6)
		const owner = answering && members.length > 1 ? members[(leadIndex + 1 + ownerOffset) % members.length] : lead
		const identity = identities.get(owner.id)
		if (!identity) continue
		const motifDegree = identity.motif[index % identity.motif.length]
		const transform = section === 'develop' ? 1 : section === 'contrast' ? -1 : 0
		let target = degree + motifDegree + transform
		const anchor = index === 0 || index === foreground.length - 1
		if (anchor) target = degree + [0, 2, 4][mod(identity.shift + index, 3)]
		if (!anchor && tension > 0.55 && unit(`${seed}:${bar}:${index}`) > 0.5) target++
		const register = owner.contour > 0.35 ? 72 : 60
		const pitch = degreePitch(target, scale, register + root)
		const next = foreground[index + 1] ?? profile.steps
		add('lead', owner.id, step, pitch, (next - step) * profile.gate, 0.34 + owner.energy * 0.26)
	}
	// In sparse profiles each person gets a timed colour/answer, rather than a louder mix.
	for (const [index, member] of members.entries()) {
		if (events.some(event => event.person === member.id)) continue
		const identity = identities.get(member.id)
		const step = Math.min(profile.steps - 1, 1 + Math.floor(index * profile.steps / members.length))
		add('lead', member.id, step, degreePitch(degree + (identity?.motif[1] ?? 2), scale, 60 + root), 1.5, 0.25 + member.energy * 0.12)
	}
	return {events:events.sort((a,b) => a.step - b.step), section, lead:lead.id, chord}
}
