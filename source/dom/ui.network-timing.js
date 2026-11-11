import { TimingRoom, validRoomId } from '../network/timing-room.js'
import { getPathRoomId } from '../network/room-url.js'
import { decodeBundle, getPairingURL, PAIRING_PREFIX } from '../network/room-invite.js'
import { createSVGQRCodeFromURL } from '../utils/barcodes.js'
import { setupTabs } from './tabs.js'
import { getLocationParam } from '../utils/state-encoding.js'

// Capture before application settings rebuild the URL during boot.
const initialURL = new URL(window.location.href)
const pathRoomId = getPathRoomId(initialURL.pathname)

export const setupNetworkTiming = (clock, stateMachine, onTransport, statusAPI) => {
	const tabs = setupTabs(document.getElementById('tempo-tabs'))
	document.getElementById('network-timing-summary')?.addEventListener('click', () => tabs?.select('tempo-sync-tab'))
	const panel = document.getElementById('network-timing')
	if (!panel) return null
	const find = id => document.getElementById(id)
	const roomInput = find('timing-room-id'), pairingInput = find('timing-room-pairing')
	const status = find('timing-room-status'), peers = find('timing-room-peers')
	const alert = find('timing-room-error')
	const share = find('timing-room-share'), link = find('timing-room-link')
	const start = find('timing-room-start'), pause = find('timing-room-pause')
	let shareGeneration = 0, scanGeneration = 0, scanTimer, cameraStream, busy = false, hudStateKey = ''
	let pendingInitialLink = initialURL.hash.startsWith(PAIRING_PREFIX) ? initialURL.href : ''
	let sessionState = { status: 'solo' }
	const labels = { solo: 'Playing on my own', connecting: 'Connecting directly…', creating: 'Creating invitation…',
		hosting: 'Room ready. Invite a guest.', 'waiting-for-response': 'Waiting for the guest’s response',
		'waiting-for-host': 'Return this response to the host to finish joining', synchronizing: 'Measuring clock timing…',
		armed: 'Change scheduled for the next shared boundary', locked: 'Synchronized', disconnected: 'Connection lost. Pair again to rejoin.' }
	const display = state => {
		sessionState = state
		const text = state.error ?? labels[state.status] ?? state.status
		if (state.error && alert.textContent !== state.error) { alert.textContent = state.error; alert.hidden = false }
		const prefix = room.active && state.role ? state.role === 'leader' ? 'Hosting · ' : 'Following · ' : ''
		status.textContent = prefix + text
		const summary = find('network-timing-summary')
		if (summary) { summary.hidden = !room.active; summary.textContent = prefix + text }
		const roomId = state.roomId ?? room.roomId ?? roomInput.value
		const connected = ['locked', 'armed'].includes(state.status) && Boolean(state.peers?.length)
		const hudDetail = connected ? `Connected · ${roomId}` : text
		const nextHudStateKey = JSON.stringify([room.active, hudDetail, state.role, roomId, state.peers?.length])
		if (hudStateKey !== nextHudStateKey) {
			hudStateKey = nextHudStateKey
			if (!room.active) statusAPI?.clearDeviceStatus('timing-room')
			else statusAPI?.setDeviceStatus('timing-room', {
				type: 'room', label: 'Shared timing room', detail: hudDetail, connected,
				tooltipDetails: [{ label: 'Room', value: roomId },
					{ label: 'Role', value: state.role === 'leader' ? 'Host' : 'Following host' }, { label: 'Status', value: text }],
			})
		}
		panel.dataset.status = state.status
		document.querySelector('.form-tempo').disabled = !room.canEdit
		start.disabled = pause.disabled = !room.active || !room.canEdit
		find('tempo-input-text').min = find('tempo-input-range').min = room.active ? '10' : '1'
		find('timing-room-leave').disabled = !room.active && !busy
		roomInput.disabled = room.active || busy
		find('timing-room-host').disabled = room.active || busy
		find('timing-room-invite').disabled = !room.isLeader || busy
		find('timing-room-join').disabled = busy
		find('timing-room-scan').disabled = busy
		find('timing-room-image').disabled = busy
		peers.replaceChildren(...(state.peers ?? []).map(peer => {
			const item = document.createElement('li')
			item.textContent = `${peer.id.slice(0, 8)} · Direct WebRTC · ${Math.round(peer.rttMs)} ms round trip · ${peer.locked ? 'clock ready' : 'measuring'}`
			return item
		}))
	}
	const room = new TimingRoom(clock, { onState: display, onTransport })
	roomInput.value = pathRoomId || getLocationParam('room', initialURL.search) || ''
	pairingInput.value = pendingInitialLink
	const error = reason => display({ ...sessionState, status: 'error', error: reason.message ?? String(reason) })
	const stopScanning = () => {
		++scanGeneration
		clearTimeout(scanTimer)
		cameraStream?.getTracks().forEach(track => track.stop())
		cameraStream = null
		find('timing-room-video').srcObject = null
		find('timing-room-scanner').hidden = true
	}
	const cleanPairingHash = () => {
		if (window.location.hash.startsWith(PAIRING_PREFIX)) {
			const url = new URL(window.location.href)
			url.hash = ''
			window.history.replaceState(null, '', url)
		}
		if (stateMachine.url?.hash.startsWith(PAIRING_PREFIX)) stateMachine.url.hash = ''
	}
	const saveRoom = () => { cleanPairingHash(); roomInput.value = room.roomId; stateMachine.set('room', room.roomId) }
	const shareBundle = async bundle => {
		const generation = ++shareGeneration
		const base = new URL(initialURL)
		if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Open PhotoSYNTH in a web browser to share a pairing link')
		const url = await getPairingURL(base, bundle)
		if (generation !== shareGeneration || !room.active) return
		link.href = url.href
		link.textContent = url.href
		find('timing-room-share-help').textContent = bundle.description.type === 'offer'
			? 'One guest: open or scan this invitation, then import their response here. This invitation expires in 10 minutes.'
			: 'Show this response QR to the host’s scanner, or send the response link for the host to import into their open room.'
		find('timing-room-qr').replaceChildren()
		find('timing-room-qr-warning').textContent = ''
		share.hidden = false
		try {
			const svg = await createSVGQRCodeFromURL({ content: url.href, width: 320, height: 320, padding: 4, ecl: 'M', color: '#000000', background: '#ffffff' })
			if (generation === shareGeneration) find('timing-room-qr').innerHTML = svg
		} catch {
			if (generation === shareGeneration) find('timing-room-qr-warning').textContent = 'This connection is too large for one QR code. Copy and send the pairing link instead.'
		}
	}
	const run = async action => {
		if (busy) return
		busy = true
		alert.textContent = ''; alert.hidden = true
		display({ ...sessionState, error: undefined })
		try { await action() } catch (reason) { error(reason) }
		finally { busy = false; display(sessionState) }
	}
	const importLink = async input => {
		const bundle = await decodeBundle(input)
		if (bundle.description.type === 'offer') {
			const response = await room.acceptInvitation(bundle)
			saveRoom()
			await shareBundle(response)
		} else {
			await room.acceptResponse(bundle)
			++shareGeneration
			share.hidden = true
		}
		pairingInput.value = ''
		pendingInitialLink = ''
		cleanPairingHash()
	}
	find('timing-room-host').onclick = () => run(async () => {
		const id = roomInput.value.trim() || crypto.randomUUID()
		if (!validRoomId(id)) throw new Error('Enter a room code of 6–80 letters, numbers, hyphens or underscores')
		await room.host(id)
		saveRoom()
		await shareBundle(await room.createInvitation())
	})
	find('timing-room-invite').onclick = () => run(async () => { await shareBundle(await room.createInvitation()) })
	find('timing-room-join').onclick = () => run(() => importLink(pairingInput.value))
	find('timing-room-leave').onclick = async () => {
		++shareGeneration
		stopScanning()
		share.hidden = true
		pendingInitialLink = ''
		pairingInput.value = ''
		alert.textContent = ''; alert.hidden = true
		await room.leave()
		cleanPairingHash()
		if (getPathRoomId(window.location.pathname)) {
			const url = new URL(window.location.href)
			url.pathname = '/'
			window.history.replaceState(null, '', url)
			if (stateMachine.url) stateMachine.url.pathname = '/'
		}
		stateMachine.set('room', '')
		roomInput.value = ''
	}
	find('timing-room-copy').onclick = async () => {
		try { await navigator.clipboard.writeText(link.href); status.textContent = 'Pairing link copied' }
		catch { status.textContent = 'Select and copy the pairing link below' }
	}
	find('timing-room-image').onchange = event => run(async () => {
		const file = event.target.files?.[0]
		if (!file) return
		try {
			if (file.size > 12 * 1024 * 1024) throw new Error('Choose a QR image smaller than 12 MB')
			const { readPairingQR } = await import('../network/room-qr-reader.js')
			const result = await readPairingQR(file)
			if (!result) throw new Error('No QR code found. Try a clearer image, or paste the link.')
			await importLink(result)
		} finally { event.target.value = '' }
	})
	find('timing-room-stop-scan').onclick = stopScanning
	find('timing-room-scan').onclick = async () => {
		stopScanning()
		alert.textContent = ''; alert.hidden = true
		const generation = scanGeneration
		try {
			if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera scanning requires HTTPS and camera access. Paste a link or choose a QR image instead.')
			const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
			if (generation !== scanGeneration) { stream.getTracks().forEach(track => track.stop()); return }
			cameraStream = stream
			const video = find('timing-room-video')
			video.srcObject = stream
			find('timing-room-scanner').hidden = false
			await video.play()
			const { readPairingQR } = await import('../network/room-qr-reader.js')
			const canvas = document.createElement('canvas'), context = canvas.getContext('2d', { willReadFrequently: true })
			const scan = async () => {
				if (generation !== scanGeneration) return
				try {
					if (video.readyState >= 2 && !busy) {
						canvas.width = Math.min(video.videoWidth, 1280)
						canvas.height = Math.round(video.videoHeight * canvas.width / video.videoWidth)
						context.drawImage(video, 0, 0, canvas.width, canvas.height)
						const result = await readPairingQR(context.getImageData(0, 0, canvas.width, canvas.height))
						if (generation !== scanGeneration) return
						if (result) { stopScanning(); pairingInput.value = result; await run(() => importLink(result)); return }
					}
					scanTimer = setTimeout(scan, 350)
				} catch (reason) { stopScanning(); error(reason) }
			}
			await scan()
		} catch (reason) { if (generation === scanGeneration) { stopScanning(); error(reason) } }
	}
	start.onclick = () => { try { room.setTransport({ playing: true, position: 0 }) } catch (reason) { error(reason) } }
	pause.onclick = () => { try { room.setTransport({ playing: false }) } catch (reason) { error(reason) } }
	window.addEventListener('hashchange', () => {
		if (!window.location.hash.startsWith(PAIRING_PREFIX)) return
		pairingInput.value = window.location.href
		tabs?.select('tempo-sync-tab')
		// Import stays explicit so a scanned invitation cannot replace an active room.
		status.textContent = 'Pairing link ready. Select Import link to continue.'
	})
	window.addEventListener('pagehide', () => { stopScanning(); ++shareGeneration; room.leave(false) }, { once: true })
	document.addEventListener('visibilitychange', () => { if (document.hidden) stopScanning() })
	display(sessionState)
	return {
		room,
		// Preserve Timer private-field receivers while routing all tempo-panel mutations.
		tempoClock: new Proxy(clock, {
			get(target, key) { const value = Reflect.get(target, key, target); return typeof value === 'function' ? value.bind(target) : value },
			set(target, key, value) {
				if (room.active && ['BPM', 'swing', 'bar'].includes(key)) {
					if (room.canEdit) {
						const changes = key === 'BPM' ? { bpm: Number(value) } : key === 'swing' ? { swing: Number(value) } : { position: Number(value) }
						try { room.setTransport(changes) } catch (reason) { error(reason) }
					}
					return true
				}
				return Reflect.set(target, key, value, target)
			}
		}),
		autoJoin: async () => {
			if (pendingInitialLink) {
				const input = pendingInitialLink
				pendingInitialLink = ''
				tabs?.select('tempo-sync-tab')
				await run(() => importLink(input))
			} else if (roomInput.value && !room.active) {
				tabs?.select('tempo-sync-tab')
				status.textContent = 'To join, import the host’s invitation link or scan their QR. A room code alone cannot connect devices.'
			}
		}
	}
}
