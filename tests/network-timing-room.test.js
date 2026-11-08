/** @jest-environment node */
jest.mock('netronome', () => ({ NetworkSession: jest.fn() }))
import { NetworkSession } from 'netronome'
import { TimingRoom, getRoomURL } from '../source/network/timing-room.js'
import { encodeBundle, decodeBundle, getPairingURL } from '../source/network/room-invite.js'

class FakePC extends EventTarget {
	constructor(config) { super(); this.config = config; this.iceGatheringState = 'complete'; this.connectionState = 'new'; this.channels = [] }
	createDataChannel(label) {
		const channel = { label, ordered: true, readyState: 'connecting', bufferedAmount: 0, send: jest.fn(), close: jest.fn() }
		this.channels.push(channel)
		return channel
	}
	async createOffer() { return { type: 'offer', sdp: 'v=0\r\no=offer\r\n' } }
	async createAnswer() { return { type: 'answer', sdp: 'v=0\r\no=answer\r\n' } }
	async setLocalDescription(value) { this.localDescription = value }
	async setRemoteDescription(value) { this.remoteDescription = value }
	close() { this.connectionState = 'closed' }
}
const rooms = []
const makeRoom = options => {
	const clock = { bypass: jest.fn(), startTimer: jest.fn() }
	const room = new TimingRoom(clock, options)
	rooms.push(room)
	return room
}
const open = (room, id) => {
	const peer = room.peers.get(id)
	peer.channel.readyState = 'open'
	peer.channel.onopen()
	return peer
}
beforeEach(() => {
	global.RTCPeerConnection = FakePC
	NetworkSession.mockImplementation((clock, options) => ({
		options, start: jest.fn(async () => {}), destroy: jest.fn(async () => {}),
		getState: () => ({ ready: true, status: 'locked', peers: [] }),
		setTransport: jest.fn(), addPeer: jest.fn(), removePeer: jest.fn(), receive: jest.fn(),
	}))
})
afterEach(async () => { for (const room of rooms.splice(0)) await room.leave(false); jest.useRealTimers(); delete global.RTCPeerConnection })

test('pairing links round-trip without a server, reject malformed, oversized, or expired data', async () => {
	const host = makeRoom()
	await host.host('shared-room')
	const bundle = await host.createInvitation()
	const url = await getPairingURL('https://photosynth.test/?syncServer=old&b=old#folder-tempo', bundle)
	expect(url.pathname).toBe('/room/shared-room')
	expect(url.search).toBe('')
	expect(await decodeBundle(url.href)).toEqual(bundle)
	expect(await decodeBundle(await encodeBundle(bundle))).toEqual(bundle)
	await expect(decodeBundle('not a link')).rejects.toThrow()
	await expect(decodeBundle('a'.repeat(65537))).rejects.toThrow()
	await expect(encodeBundle({ ...bundle, expires: Date.now() - 1 })).rejects.toThrow('expired')
	const bomb = await new Response(new Blob([new Uint8Array(40000)]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()
	await expect(decodeBundle(Buffer.from(bomb).toString('base64url'))).rejects.toThrow('too large')
	expect(getRoomURL('https://photosynth.test/test.html?syncServer=old', 'shared-room').searchParams.get('room')).toBe('shared-room')
})

test('host pairs two independent guests and registers only open channels', async () => {
	const host = makeRoom()
	await host.host('shared-room')
	for (let i = 0; i < 2; ++i) {
		const offer = await host.createInvitation(), guest = makeRoom()
		const answer = await guest.acceptInvitation(offer)
		expect(host.session.addPeer).not.toHaveBeenCalledWith(offer.guestId)
		await host.acceptResponse(answer)
		const guestPeer = guest.peers.get(offer.hostId)
		guest.attachChannel(guestPeer, guestPeer.pc.createDataChannel('photosynth-timing'))
		open(guest, offer.hostId)
		const hostPeer = open(host, offer.guestId)
		expect(hostPeer.pc.config).toEqual({ iceServers: [] })
		expect(host.session.addPeer).toHaveBeenCalledWith(offer.guestId)
		expect(guest.session.addPeer).toHaveBeenCalledWith(offer.hostId)
		expect(guest.canEdit).toBe(false)
		await expect(host.acceptResponse(answer)).rejects.toThrow('waiting invitation')
		const change = { type: 'state', protocol: 'netronome/1', bpm: 123, swing: .3, playing: true, position: 8 }
		host.session.options.send(offer.guestId, change)
		expect(JSON.parse(hostPeer.channel.send.mock.calls.at(-1)[0])).toEqual(change)
		guestPeer.channel.onmessage({ data: JSON.stringify(change) })
		expect(guest.session.receive).toHaveBeenCalledWith(offer.hostId, change)
		guest.setTransport({ bpm: 140 })
		expect(guest.session.setTransport).not.toHaveBeenCalled()
	}
	expect(host.peers.size).toBe(2)
	host.setTransport({ bpm: 123, swing: .3 })
	expect(host.session.setTransport).toHaveBeenLastCalledWith({ bpm: 123, swing: .3 })
})

test('response cannot be imported by another host or into a different invitation', async () => {
	const host = makeRoom(), stranger = makeRoom(), guest = makeRoom()
	await host.host('shared-room'); await stranger.host('shared-room')
	const offer = await host.createInvitation(), answer = await guest.acceptInvitation(offer)
	await expect(stranger.acceptResponse(answer)).rejects.toThrow('waiting invitation')
	await expect(host.acceptResponse({ ...answer, inviteId: 'wrong-invitation' })).rejects.toThrow('waiting invitation')
	await expect(guest.acceptInvitation(offer)).rejects.toThrow('Leave the current room')
	await host.acceptResponse(answer)
})

test('connection timeout, channel closure, and leave release peers and restore the local clock', async () => {
	jest.useFakeTimers()
	const onTransport = jest.fn()
	const host = makeRoom({ connectionTimeoutMs: 100 }), guest = makeRoom({ onTransport })
	await host.host('shared-room')
	const offer = await host.createInvitation(), answer = await guest.acceptInvitation(offer)
	await host.acceptResponse(answer)
	jest.advanceTimersByTime(101)
	expect(host.peers.size).toBe(0)
	const peer = guest.peers.get(offer.hostId)
	guest.attachChannel(peer, peer.pc.createDataChannel('photosynth-timing'))
	open(guest, offer.hostId)
	peer.channel.onclose()
	expect(guest.session.removePeer).toHaveBeenCalledWith(offer.hostId)
	expect(guest.peers.size).toBe(0)
	expect(onTransport).toHaveBeenCalledWith(expect.objectContaining({ playing: false }))
	const session = host.session
	await host.leave()
	expect(session.destroy).toHaveBeenCalled()
	expect(host.clock.networkTimingActive).toBe(false)
	expect(host.clock.bypass).toHaveBeenLastCalledWith(false)
	expect(host.clock.startTimer).toHaveBeenCalled()
	expect(jest.getTimerCount()).toBe(0)
})

test('leaving cancels ICE gathering and prevents a stale invitation escaping', async () => {
	const host = makeRoom()
	await host.host('shared-room')
	FakePC.prototype.createOffer = async function () { this.iceGatheringState = 'gathering'; return { type: 'offer', sdp: 'v=0' } }
	try {
		const pending = host.createInvitation()
		await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
		await host.leave(false)
		await expect(pending).rejects.toThrow('Pairing cancelled')
		expect(host.peers.size).toBe(0)
	} finally { FakePC.prototype.createOffer = async () => ({ type: 'offer', sdp: 'v=0\r\no=offer\r\n' }) }
})
