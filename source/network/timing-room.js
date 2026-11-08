import { NetworkSession } from 'netronome'
import { validRoomId } from './room-url.js'
import { validateBundle, INVITE_LIFETIME_MS } from './room-invite.js'
export { validRoomId, getRoomURL } from './room-url.js'

// One host-to-guest connection per invitation. No discovery or relay service.
export class TimingRoom {
	constructor(clock, { onState = () => {}, onTransport = () => {}, rtcConfig, iceTimeoutMs = 15000, connectionTimeoutMs = 30000 } = {}) {
		Object.assign(this, { clock, onState, onTransport, iceTimeoutMs, connectionTimeoutMs })
		this.rtcConfig = rtcConfig ?? { iceServers: [] }
		this.peers = new Map()
		this.generation = 0
		this.active = false
	}
	get isLeader() { return this.active && this.peerId === this.leaderId }
	get canEdit() { return !this.active || Boolean(this.isLeader && this.session?.getState().ready) }
	async start(roomId, peerId, leaderId) {
		if (!validRoomId(roomId)) throw new Error('Enter a room code of 6–80 letters, numbers, hyphens or underscores')
		if (typeof RTCPeerConnection === 'undefined') throw new Error('This browser does not support direct WebRTC rooms')
		await this.leave(false)
		const generation = ++this.generation
		Object.assign(this, { roomId, peerId, leaderId, active: true, pairingStatus: 'connecting' })
		this.clock.networkTimingActive = true
		this.clock.bypass(true)
		try {
			const session = new NetworkSession(this.clock, { peerId, leaderId,
				send: (id, message) => this.send(id, message), onTransport: this.onTransport,
				onStateChange: state => { if (generation === this.generation) this.emit(undefined, state) } })
			this.session = session
			await session.start()
			if (generation !== this.generation) throw new Error('Pairing cancelled')
			if (this.isLeader) session.setTransport({ playing: true, position: 0 })
			this.emit()
		} catch (error) { if (generation === this.generation) await this.leave(); throw error }
	}
	async host(roomId = crypto.randomUUID()) {
		const id = crypto.randomUUID()
		await this.start(roomId, id, id)
	}
	addPeer(id, invite) {
		const pc = new RTCPeerConnection(this.rtcConfig)
		const peer = { id, pc, invite, connected: false, accepted: false, lastSeen: performance.now() }
		this.peers.set(id, peer)
		pc.ondatachannel = ({ channel }) => this.attachChannel(peer, channel)
		pc.onconnectionstatechange = () => {
			if (['failed', 'closed'].includes(pc.connectionState)) this.dropPeer(peer, 'Connection failed. Pair again; check both devices are on the same network without guest isolation.')
		}
		peer.expiry = setTimeout(() => this.dropPeer(peer), Math.max(1, invite.expires - Date.now()))
		return peer
	}
	async gather(peer) {
		if (peer.pc.iceGatheringState === 'complete') return
		await new Promise((resolve, reject) => {
			const pc = peer.pc
			const finish = error => {
				clearTimeout(timeout)
				pc.removeEventListener('icegatheringstatechange', check)
				peer.cancelGather = null
				error ? reject(error) : resolve()
			}
			const check = () => { if (pc.iceGatheringState === 'complete') finish() }
			const timeout = setTimeout(() => finish(new Error('Connection setup timed out. Create a new invitation.')), this.iceTimeoutMs)
			peer.cancelGather = () => finish(new Error('Pairing cancelled'))
			pc.addEventListener('icegatheringstatechange', check)
			check()
		})
	}
	async createInvitation() {
		if (!this.isLeader) throw new Error('Host a room before inviting a guest')
		for (const peer of [...this.peers.values()]) if (!peer.connected && peer.invite.expires <= Date.now()) this.dropPeer(peer)
		if ([...this.peers.values()].filter(peer => !peer.connected).length >= 8) throw new Error('Finish pairing the waiting guests before creating more invitations')
		const invite = { version: 1, roomId: this.roomId, hostId: this.peerId, guestId: crypto.randomUUID(), inviteId: crypto.randomUUID(), expires: Date.now() + INVITE_LIFETIME_MS }
		const peer = this.addPeer(invite.guestId, invite)
		try {
			this.attachChannel(peer, peer.pc.createDataChannel('photosynth-timing'))
			await peer.pc.setLocalDescription(await peer.pc.createOffer())
			await this.gather(peer)
			if (this.peers.get(peer.id) !== peer) throw new Error('Pairing cancelled')
			this.emit('waiting-for-response')
			return { ...invite, description: { type: 'offer', sdp: peer.pc.localDescription.sdp } }
		} catch (error) { this.dropPeer(peer); throw error }
	}
	async acceptInvitation(bundle) {
		validateBundle(bundle)
		if (bundle.description.type !== 'offer') throw new Error('Ask the host for an invitation link')
		if (this.active) throw new Error('Leave the current room before accepting another invitation')
		await this.start(bundle.roomId, bundle.guestId, bundle.hostId)
		try {
			const peer = this.addPeer(bundle.hostId, bundle)
			await peer.pc.setRemoteDescription(bundle.description)
			await peer.pc.setLocalDescription(await peer.pc.createAnswer())
			await this.gather(peer)
			if (this.peers.get(peer.id) !== peer) throw new Error('Pairing cancelled')
			this.pairingStatus = 'waiting-for-host'
			this.emit()
			return { ...bundle, description: { type: 'answer', sdp: peer.pc.localDescription.sdp } }
		} catch (error) { await this.leave(); throw error }
	}
	async acceptResponse(bundle) {
		validateBundle(bundle)
		const peer = this.peers.get(bundle.guestId)
		if (!this.isLeader || bundle.description.type !== 'answer' || bundle.roomId !== this.roomId
			|| bundle.hostId !== this.peerId || !peer || peer.accepted
			|| bundle.inviteId !== peer.invite.inviteId || bundle.expires !== peer.invite.expires) {
			throw new Error('This response does not match a waiting invitation in this room')
		}
		peer.accepted = true
		try {
			await peer.pc.setRemoteDescription(bundle.description)
			this.waitForConnection(peer)
			this.emit('connecting')
		} catch (error) { this.dropPeer(peer); throw error }
	}
	waitForConnection(peer) {
		if (peer.connected || peer.connectionTimer) return
		peer.connectionTimer = setTimeout(() => this.dropPeer(peer, 'Could not connect directly. Check your network and pair again.'), this.connectionTimeoutMs)
	}
	attachChannel(peer, channel) {
		if (peer.channel || channel.label !== 'photosynth-timing' || !channel.ordered || channel.maxRetransmits != null || channel.maxPacketLifeTime != null) { channel.close(); return }
		peer.channel = channel
		channel.onopen = () => {
			if (this.peers.get(peer.id) !== peer) return
			peer.connected = true
			peer.lastSeen = performance.now()
			clearTimeout(peer.expiry); clearTimeout(peer.connectionTimer)
			peer.watchdog = setInterval(() => {
				if (performance.now() - peer.lastSeen > 10000) this.dropPeer(peer, 'Connection lost. Pair again to rejoin the room.')
			}, 2000)
			this.session?.addPeer(peer.id)
			this.emit()
		}
		channel.onclose = () => this.dropPeer(peer, 'Connection closed. Pair again to rejoin the room.')
		channel.onerror = () => this.dropPeer(peer, 'Connection failed. Pair again to rejoin the room.')
		channel.onmessage = ({ data }) => {
			if (!peer.connected || typeof data !== 'string' || data.length > 32768) return
			try {
				const message = JSON.parse(data)
				if (message?.protocol !== 'netronome/1') return
				peer.lastSeen = performance.now()
				this.session?.receive(peer.id, message)
			} catch { /* Ignore malformed peer data. */ }
		}
	}
	send(id, message) {
		const peer = this.peers.get(id)
		if (peer?.channel?.readyState !== 'open') return
		if (peer.channel.bufferedAmount > 65536) { this.dropPeer(peer, 'Connection is too slow. Pair again.'); return }
		try { peer.channel.send(JSON.stringify(message)) } catch { this.dropPeer(peer, 'Connection lost. Pair again.') }
	}
	dropPeer(peer, error) {
		if (this.peers.get(peer.id) !== peer) return
		this.peers.delete(peer.id)
		clearTimeout(peer.expiry); clearTimeout(peer.connectionTimer); clearInterval(peer.watchdog)
		peer.cancelGather?.()
		peer.pc.onconnectionstatechange = peer.pc.ondatachannel = null
		if (peer.channel) { peer.channel.onopen = peer.channel.onclose = peer.channel.onerror = peer.channel.onmessage = null; peer.channel.close() }
		peer.pc.close()
		this.session?.removePeer(peer.id)
		if (!this.isLeader) {
			this.pairingStatus = 'disconnected'
			this.connectionError = error ?? 'Invitation expired. Ask the host for a new one.'
			if (this.active) this.onTransport({ ...this.session?.getState(), playing: false })
		}
		this.emit(error ? 'error' : undefined, undefined, error)
	}
	emit(status, state = this.session?.getState(), error) {
		if (!this.active) return
		const connected = [...this.peers.values()].some(peer => peer.connected)
		this.onState({ ...state, role: this.isLeader ? 'leader' : 'follower', roomId: this.roomId,
			status: status ?? (!connected ? this.isLeader ? 'hosting' : this.pairingStatus : state?.status) ?? 'connecting',
			error: error ?? this.connectionError,
			peers: (state?.peers ?? []).map(peer => ({ ...peer, path: 'rtc' })) })
	}
	setTransport(change) { if (this.canEdit && this.session) return this.session.setTransport(change) }
	async leave(resume = true) {
		++this.generation
		this.active = false
		this.clock.networkTimingActive = false
		for (const peer of [...this.peers.values()]) this.dropPeer(peer)
		const session = this.session
		this.session = null
		await session?.destroy()
		this.leaderId = null; this.connectionError = null; this.pairingStatus = null
		this.clock.bypass(false)
		if (resume) await this.clock.startTimer()
		this.onState({ status: 'solo', peers: [] })
	}
}
