import {createSessionMusicXML} from '../audio/notation/session-musicxml.js'
import {createSessionDAWProject} from '../audio/dawproject/session-dawproject.js'
import { createSessionEventHeader, decodeSessionEvents, SESSION_EVENT_HEADER_SIZE as HEADER, SESSION_EVENT_RECORD_SIZE as RECORD, SESSION_EVENT_MAGIC, SESSION_EVENT_VERSION } from './session-format.js'
import { encodeMIDITrack, midiHeader, tempoTrack } from '../audio/midi/session-midi.js'

// Every public operation is dispatched through the storage worker's serial queue.
export const createSessionStore = (getRoot) => {
	let active = null
	const readFile = async name => (await (await getRoot()).getFileHandle(name)).getFile()
	const text = async name => (await readFile(name)).text()
	const manifestName = id => `${id}.manifest.json`
	const writeJSON = async (name, value) => {
		const handle = await (await getRoot()).getFileHandle(name, { create:true })
		const writer = await handle.createWritable()
		try { await writer.write(JSON.stringify(value)); await writer.close() }
		catch (error) { await writer.abort().catch(() => {}); throw error }
	}
	const openHandle = async name => (await (await getRoot()).getFileHandle(name, { create:true })).createSyncAccessHandle()
	const append = (handle, bytes, offset) => {
		if (handle.getSize() !== offset) throw new Error('Recording offset mismatch')
		let done = 0
		try {
			while (done < bytes.byteLength) {
				const count = handle.write(bytes.subarray(done), { at:offset + done })
				if (!count) throw new Error('Storage write made no progress')
				done += count
			}
			handle.flush()
		} catch (error) {
			// A failed transaction may never be retried at the new physical size.
			try { handle.truncate(offset); handle.flush() } catch {}
			throw error
		}
		return offset + done
	}
	const checkpoint = async metadata => {
		if (!active) throw new Error('No recording session')
		Object.assign(active.manifest, metadata)
		active.events.flush()
		active.index.flush()
		active.manifest.committedEventBytes = active.offset
		await writeJSON(manifestName(active.manifest.sessionId), active.manifest)
		return active.manifest
	}
	const close = () => {
		const session = active
		active = null
		if (session) {
			try { session.events.close() } finally { session.index.close() }
		}
	}
	const recover = async (id, includeMedia=true) => {
		const manifest = JSON.parse(await text(manifestName(id)))
		const legacyMedia=manifest.media
		manifest.media = { audio:[], video:[] }
		manifest.warnings = []
		if(manifest.channelOverflow)manifest.warnings.push('More than 15 melodic sources: some MIDI channels are shared. Import tracks separately to assign their sounds.')
		if(includeMedia) {
			const known = new Set()
			let journal = ''
			try { journal = await text(manifest.mediaIndexFile ?? `${id}.media-index.jsonl`) } catch {}
			for (const line of journal.split('\n')) {
				if (!line) continue
				try {
					const entry = JSON.parse(line)
					if (!['audio','video'].includes(entry.kind) || !entry.fileName.startsWith(id + '.')) continue
					const file = await readFile(entry.fileName)
					if (file.size !== entry.byteLength) throw new Error('Chunk length mismatch')
					manifest.media[entry.kind].push(entry)
					known.add(entry.fileName)
				} catch { manifest.warnings.push('An incomplete media index entry was skipped') }
			}
			// Older sessions have only manifest media entries.
			for (const kind of ['audio','video']) for (const entry of legacyMedia?.[kind] ?? []) {
				if (known.has(entry.fileName)) continue
				try {
					const file = await readFile(entry.fileName)
					manifest.media[kind].push({ ...entry, kind, take:entry.take ?? 0, byteLength:file.size })
					known.add(entry.fileName)
				} catch { manifest.warnings.push('A referenced media chunk is missing') }
			}
			manifest.orphans = []
			for await (const [name] of (await getRoot()).entries()) {
				if (name.startsWith(id + '.') && name.endsWith('.bin') && !known.has(name)) manifest.orphans.push(name)
			}
		}
		try {
			const file = await readFile(manifest.eventFile)
			const header = new DataView(await file.slice(0, HEADER).arrayBuffer())
			if (header.byteLength < HEADER || !SESSION_EVENT_MAGIC.every((b,i) => header.getUint8(i) === b) ||
				header.getUint16(4,true) !== SESSION_EVENT_VERSION || header.getUint16(6,true) !== RECORD) throw new Error('Unsupported session format')
			manifest.eventBytes = HEADER + Math.floor((file.size - HEADER) / RECORD) * RECORD
			if (manifest.eventBytes !== file.size) manifest.warnings.push('Partial trailing event excluded')
		} catch(error) {
			manifest.eventError=error.message
			manifest.eventBytes=0
			manifest.warnings.push(`MIDI data unavailable: ${error.message}`)
		}
		manifest.recoverable = manifest.status !== 'stopped'
		if(includeMedia)for(const take of manifest.takes ?? [])for(const kind of ['audio','video']) {
			if(take[kind]&&take.status!=='recording'&&!manifest.media[kind].some(entry=>entry.take===take.take))manifest.warnings.push(`No ${kind} data was saved for take ${take.take+1}`)
		}
		return manifest
	}
	async function* eventsFor(manifest) {
		if (active?.manifest.sessionId === manifest.sessionId) active.events.flush()
		const file = await readFile(manifest.eventFile)
		const end = Math.min(file.size, manifest.eventBytes ?? file.size)
		for (let offset = HEADER; offset < end; offset += RECORD * 2048) {
			yield* decodeSessionEvents(await file.slice(offset, Math.min(end, offset + RECORD * 2048)).arrayBuffer())
		}
	}
	return {
		async begin({ manifest }) {
			if (active) throw new Error('Session already open')
			if (!/^[a-zA-Z0-9_-]+$/.test(manifest.sessionId)) throw new Error('Invalid session id')
			const root = await getRoot()
			try { await root.getFileHandle(manifestName(manifest.sessionId)); throw new Error('Session already exists') }
			catch (error) { if (error.name !== 'NotFoundError') throw error }
			let events, index
			try {
				events = await openHandle(manifest.eventFile)
				if (events.getSize()) throw new Error('Event file already exists')
				const header = new Uint8Array(createSessionEventHeader())
				append(events, header, 0)
				index = await openHandle(manifest.mediaIndexFile)
				active = { manifest, events, index, offset:HEADER, indexOffset:index.getSize() }
				await checkpoint({})
				return manifest
			} catch (error) { events?.close(); index?.close(); active = null; throw error }
		},
		async appendEvents({ buffer, offset }) {
			if (!active || offset !== active.offset || buffer.byteLength % RECORD) throw new Error('Invalid event batch')
			active.offset = append(active.events, new Uint8Array(buffer), offset)
			return active.offset
		},
		async chunk({ blob, entry }) {
			if (!active) throw new Error('No recording session')
			const bytes = new Uint8Array(await blob.arrayBuffer())
			const handle = await openHandle(entry.fileName)
			try {
				if (handle.getSize()) throw new Error('Media chunk already exists')
				append(handle, bytes, 0)
			} finally { handle.close() }
			const committed = { ...entry, byteLength:bytes.byteLength }
			active.indexOffset = append(active.index, new TextEncoder().encode(JSON.stringify(committed) + '\n'), active.indexOffset)
			return committed
		},
		checkpoint,
		async finish(metadata) { try { return await checkpoint(metadata) } finally { close() } },
		close,
		async remove({ id }) {
			if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid session id')
			if (active?.manifest.sessionId === id) throw new Error('Stop this recording before deleting it')
			const root = await getRoot(), names = []
			for await (const [name] of root.entries()) if (name.startsWith(id + '.')) names.push(name)
			// Remove the manifest last so a failed deletion remains visible and retryable.
			names.sort((a,b) => Number(a === manifestName(id)) - Number(b === manifestName(id)))
			for (const name of names) await root.removeEntry(name)
			return { id }
		},
		async list() {
			const sessions = []
			for await (const [name] of (await getRoot()).entries()) {
				if (!name.endsWith('.manifest.json')) continue
				try { sessions.push(await recover(name.slice(0, -14))) }
				catch (error) { sessions.push({ sessionId:name.slice(0,-14), status:'unreadable', warnings:[error.message] }) }
			}
			const sizes = new Map(sessions.map(session => [session.sessionId, 0]))
			for await (const [name] of (await getRoot()).entries()) {
				const id = name.slice(0, name.indexOf('.'))
				if (!sizes.has(id)) continue
				try { sizes.set(id, (sizes.get(id) ?? 0) + (await readFile(name)).size) } catch {}
			}
			return sessions.map(session => ({ ...session, storageBytes:sizes.get(session.sessionId) ?? 0 }))
		},
		recover: ({ id }) => recover(id),
		async media({ id, kind, take }) {
			const manifest = await recover(id)
			const entries = manifest.media[kind]?.filter(e => (e.take ?? 0) === take).sort((a,b) => (a.index ?? 0) - (b.index ?? 0)) ?? []
			if (!entries.length) throw new Error('No media for this take')
			const files = []
			for (const entry of entries) files.push(await readFile(entry.fileName))
			return new Blob(files, { type:entries[0].mimeType })
		},
		async orphan({ name }) { return readFile(name) },
		async noteWindow({id,from=0,to=from+30000,eventBytes,durationMs}) {
			if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||to<=from||to-from>60000)throw new Error('Invalid replay window')
			const manifest=await recover(id,false)
			if(manifest.eventError)throw new Error(manifest.eventError)
			if(eventBytes!=null)manifest.eventBytes=Math.min(manifest.eventBytes,eventBytes)
			const previous=new Map(),events=[]
			const storedDuration=Number(durationMs ?? manifest.durationMs ?? 0)
			let duration=Number.isFinite(storedDuration)?Math.max(0,storedDuration):0,noteCount=0
			for await(const event of eventsFor(manifest)) {
				if(!['noteOn','noteOff'].includes(event.type))continue
				if(!Number.isFinite(event.time)||event.time<0)throw new Error('Invalid saved note timestamp')
				duration=Math.max(duration,event.time)
				if(event.type==='noteOn'&&event.velocity>0)noteCount++
				if(event.time<from) {
					const key=`${event.track}:${event.channel}:${event.note}`,last=previous.get(key)
					if(!last||event.time>last.time||(event.time===last.time&&event.sequence>last.sequence))previous.set(key,event)
				}else if(event.time<to) {
					if(events.length>=65536)throw new Error('Too many notes in this replay window')
					events.push(event)
				}
			}
			return {events:events.sort((a,b)=>a.time-b.time||a.sequence-b.sequence),held:[...previous.values()].filter(e=>e.type==='noteOn'&&e.velocity>0),durationMs:duration,noteCount}
		},
		async dawproject({id,options={}}) {
			const manifest=await recover(id,false)
			if(manifest.eventError)throw new Error(manifest.eventError)
			if(options.eventBytes!=null)manifest.eventBytes=Math.min(manifest.eventBytes,options.eventBytes)
			return createSessionDAWProject(manifest,eventsFor,options)
		},
		async musicxml({id,options={}}) {
			const manifest=await recover(id,false)
			if(manifest.eventError)throw new Error(manifest.eventError)
			if(options.eventBytes!=null)manifest.eventBytes=Math.min(manifest.eventBytes,options.eventBytes)
			return createSessionMusicXML(manifest,eventsFor,options)
		},
		async midi({ id, options = {} }) {
			const manifest = await recover(id,false)
			if(manifest.eventError)throw new Error(manifest.eventError)
			options = {tempoMap:manifest.tempoMap ?? [],...options}
			if(options.eventBytes!=null)manifest.eventBytes=Math.min(manifest.eventBytes,options.eventBytes)
			const tracks = new Set()
			let endTime = options.endTime ?? manifest.durationMs ?? 0
			for await (const e of eventsFor(manifest)) { tracks.add(e.track); endTime = Math.max(endTime, e.time) }
			if (!tracks.size) tracks.add(0)
			const parts = [midiHeader(tracks.size + 1, options.ppq ?? 480), tempoTrack(options)]
			// Only one track is materialised at a time; source reads are paged and
			// all sorting/encoding stays off the performance thread.
			for (const track of tracks) {
				const events = []
				for await (const e of eventsFor(manifest)) if (e.track === track) events.push(e)
				parts.push(encodeMIDITrack(events, { ...options, endTime, name:manifest.tracks?.[track]?.name ?? `Track ${track}` }))
			}
			return new Blob(parts, { type:'audio/midi' })
		}
	}
}
