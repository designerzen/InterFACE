import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { build } from 'esbuild'
import { createRoomPages } from '../actions/room-pages.mjs'
import { getPathRoomId, getRoomURL } from '../source/network/room-url.js'

test('room paths accept valid names and reject unrelated or malformed routes', () => {
	for (const path of ['/room/shared', '/room/shared/']) assert.equal(getPathRoomId(path), 'shared')
	for (const path of ['/room/', '/room/short', '/room/shared/extra', '/room/bad%20name', '/other/shared']) {
		assert.equal(getPathRoomId(path), '')
	}
})

test('main app links use room paths while standalone pages retain query links', () => {
	const url = getRoomURL('https://interface.place/?room=old-id&syncServer=old', 'shared')
	assert.equal(url.href, 'https://interface.place/room/shared')
	assert.equal(getRoomURL('https://interface.place/room/old-id/', 'new-room', 'signal.example').pathname, '/room/new-room')
	assert.equal(getRoomURL('https://interface.place/test.network-timing.html', 'shared', 'signal.example').searchParams.get('room'), 'shared')
})

const pages = createRoomPages('<!doctype html><html><head><script type="module" src="./app.js"></script></head><body>Instrument</body></html>', '<html><head></head><body>Page not found</body></html>')
const runBootstrap = dom => dom.window.eval(dom.window.document.querySelector('script:not([type])').textContent)

test('room pages support optimized HTML with omitted head tags', () => {
	const html = '<!doctype html><html lang=en><script type="module" src="./app.js"></script><meta charset=utf-8><body>Instrument</body></html>'
	const optimized = createRoomPages(html, html)
	const dom = new JSDOM(optimized.room, { url: 'https://interface.place/room/shared' })
	const head = dom.window.document.head
	assert.equal(head.firstElementChild.tagName, 'BASE')
	assert.equal(head.querySelector('script[type=module]').src, 'https://interface.place/app.js')
	assert.ok(head.querySelector('meta[charset]'))
	assert.equal(dom.window.document.body.textContent, 'Instrument')
	dom.window.close()
	const fallback = new JSDOM(optimized.notFound)
	assert.ok(fallback.window.document.head.firstElementChild.textContent.includes('redirectRoomPage'))
	fallback.window.close()
})

test('copied index restores the named path before modules load and resolves assets at the root', () => {
	const dom = new JSDOM(pages.room, { url: 'https://interface.place/room/?room=another-room&syncServer=signal.example#folder-tempo', runScripts: 'outside-only' })
	runBootstrap(dom)
	assert.equal(dom.window.location.href, 'https://interface.place/room/another-room?syncServer=signal.example#folder-tempo')
	assert.equal(dom.window.document.querySelector('script[type=module]').src, 'https://interface.place/app.js')
	const link = dom.window.document.createElement('a')
	link.href = '#folder-volume'
	dom.window.document.body.append(link)
	link.click()
	assert.equal(dom.window.location.pathname, '/room/another-room')
	assert.equal(dom.window.location.hash, '#folder-volume')
	dom.window.close()
})

test('direct room loads retain their URL and not-found pages only redirect valid room paths', () => {
	const dom = new JSDOM(pages.room, { url: 'https://interface.place/room/shared/', runScripts: 'outside-only' })
	runBootstrap(dom)
	assert.equal(dom.window.location.pathname, '/room/shared/')
	dom.window.close()
	for (const [path, expected] of [
		['/room/another-room?room=wrong-room&syncServer=signal.example#tempo', 'https://interface.place/room/?room=another-room&syncServer=signal.example#tempo'],
		['/missing', null], ['/room/bad%20name', null],
	]) {
		let redirected = null
		const script = new JSDOM(pages.notFound).window.document.querySelector('script').textContent
		const window = { location: { href: `https://interface.place${path}`, replace: url => { redirected = url } } }
		Function('window', script)(window)
		assert.equal(redirected, expected)
	}
})

const ui = await build({
	stdin: { contents: "import { setupNetworkTiming } from './source/dom/ui.network-timing.js'; import { createInputStatusOverlay } from './source/dom/ui.input-status.js'; window.setupNetworkTiming = setupNetworkTiming; window.createInputStatusOverlay = createInputStatusOverlay", resolveDir: process.cwd() },
	bundle: true, write: false, format: 'iife',
	plugins: [{ name: 'room-test-dependencies', setup(builder) {
		for (const [filter, path] of [[/network\/timing-room.js$/, 'room'], [/network\/room-invite.js$/, 'invite'], [/utils\/barcodes.js$/, 'qr'], [/network\/room-qr-reader.js$/, 'reader']]) {
			builder.onResolve({ filter }, () => ({ path, namespace: 'stub' }))
		}
		builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ resolveDir: process.cwd(), contents: {
			qr: 'export const createSVGQRCodeFromURL = async () => { if (window.qrFail) throw Error("too large"); return "<svg></svg>" }',
			reader: 'export const readPairingQR = async () => "#pair=answer"',
			invite: `export const PAIRING_PREFIX = '#pair=';
				export const decodeBundle = async input => { if (!input.includes('#pair=')) throw Error('Paste an invitation'); return { roomId:'shared', description:{type:input.includes('answer')?'answer':'offer'} } };
				export const getPairingURL = async (base,bundle) => new URL('/room/shared#pair='+bundle.description.type,base);`,
			room: `export { validRoomId } from './source/network/room-url.js';
				export class TimingRoom {
				 constructor(clock, options) { this.options=options; this.active=false; this.canEdit=true; this.isLeader=false }
				 emit(status) { this.options.onState({status,role:this.isLeader?'leader':'follower',roomId:this.roomId,peers:[]}) }
				 async host(id) { this.active=true; this.isLeader=true; this.roomId=id; window.hosted=id; this.emit('hosting') }
				 async createInvitation() { return { roomId:this.roomId, description:{type:'offer'} } }
				 async acceptInvitation(bundle) { this.active=true; this.canEdit=false; this.roomId=bundle.roomId; window.joined=bundle; this.emit('waiting-for-host'); return { ...bundle, description:{type:'answer'} } }
				 async acceptResponse(bundle) { if (!this.isLeader) throw Error('This response needs the original host page'); window.response=bundle; this.emit('connecting') }
				 async leave() { this.active=false; this.isLeader=false; this.canEdit=true; this.emit('solo') }
				 setTransport(change) { window.transport=change }
				}`,
		}[args.path] }))
	} }],
})
const setup = (path, extra = '') => {
	const dom = new JSDOM(`${extra}${pug.renderFile('source/partials/tempo-panel.pug')}`, { url: `https://interface.place${path}`, runScripts: 'outside-only' })
	const { window } = dom
	window.CSS = { escape: value => value }
	window.eval(ui.outputFiles[0].text)
	const state = { url: new window.URL(window.location.href), set(key, value) { this.url.searchParams.set(key, value); window.history.replaceState(null, '', this.url) } }
	return { dom, window, state }
}

test('bare room URLs never auto-host or claim to join without connection information', async () => {
	for (const path of ['/room/shared', '/?room=shared&syncServer=old']) {
		const { dom, window, state } = setup(path)
		const timing = window.setupNetworkTiming({}, state, () => {})
		await timing.autoJoin()
		assert.equal(window.hosted, undefined)
		assert.equal(window.joined, undefined)
		assert.match(window.document.getElementById('timing-room-status').textContent, /room code alone/)
		assert.equal(window.document.getElementById('timing-room-server'), null)
		dom.window.close()
	}
})

test('invitation links auto-pair after audio starts, expose a response, and leaving clears the route and UI', async () => {
	const { dom, window, state } = setup('/room/shared#pair=offer')
	const timing = window.setupNetworkTiming({}, state, () => {})
	await timing.autoJoin()
	assert.equal(window.joined.description.type, 'offer')
	assert.equal(window.document.querySelector('.form-tempo').disabled, true)
	assert.equal(window.document.getElementById('timing-room-share').hidden, false)
	assert.match(window.document.getElementById('timing-room-link').href, /#pair=answer$/)
	assert.match(window.document.getElementById('timing-room-share-help').textContent, /host’s scanner/)
	assert.equal(window.location.hash, '')
	await window.document.getElementById('timing-room-leave').onclick()
	assert.equal(window.location.pathname, '/')
	assert.equal(window.document.getElementById('timing-room-id').value, '')
	assert.equal(window.document.getElementById('timing-room-share').hidden, true)
	assert.equal(window.document.querySelector('.form-tempo').disabled, false)
	dom.window.close()
})

test('host can import an answer, invite another guest, and retain a link when QR capacity is exceeded', async () => {
	const { dom, window, state } = setup('/room/shared')
	const timing = window.setupNetworkTiming({}, state, () => {})
	await window.document.getElementById('timing-room-host').onclick()
	assert.equal(window.hosted, 'shared')
	assert.equal(window.document.getElementById('timing-room-invite').disabled, false)
	window.document.getElementById('timing-room-pairing').value = '#pair=answer'
	await window.document.getElementById('timing-room-join').onclick()
	assert.equal(window.response.description.type, 'answer')
	assert.equal(window.document.getElementById('timing-room-share').hidden, true)
	window.qrFail = true
	await window.document.getElementById('timing-room-invite').onclick()
	assert.equal(window.document.getElementById('timing-room-share').hidden, false)
	assert.match(window.document.getElementById('timing-room-qr-warning').textContent, /too large/)
	assert.match(window.document.getElementById('timing-room-link').href, /#pair=offer$/)
	timing.tempoClock.BPM = 123
	assert.equal(window.transport.bpm, 123)
	dom.window.close()
})

test('opening a response in a fresh page explains that the original host must import it', async () => {
	const { dom, window, state } = setup('/room/shared#pair=answer')
	const timing = window.setupNetworkTiming({}, state, () => {})
	await timing.autoJoin()
	assert.match(window.document.getElementById('timing-room-status').textContent, /original host page/)
	assert.equal(window.hosted, undefined)
	dom.window.close()
})

test('HUD tracks direct pairing and connection state and clears on leaving', async () => {
	const { dom, window, state } = setup('/room/shared', '<aside hidden><ul id="input-status-list"></ul></aside>')
	const list = window.document.getElementById('input-status-list'), overlay = window.createInputStatusOverlay(list)
	const timing = window.setupNetworkTiming({}, state, () => {}, overlay)
	await window.document.getElementById('timing-room-host').onclick()
	const display = timing.room.options.onState
	for (const [status, role, expected] of [
		['connecting', 'follower', 'Connecting directly…'],
		['hosting', 'leader', 'Room ready. Invite a guest.'],
		['synchronizing', 'follower', 'Measuring clock timing…'],
		['locked', 'leader', 'Connected · shared'],
		['armed', 'follower', 'Connected · shared'],
		['waiting-for-response', 'leader', 'Waiting for the guest’s response'],
	]) {
		display({ status, role, roomId: 'shared', peers: [{id:'guest-id',rttMs:5,locked:true}] })
		assert.equal(list.parentElement.hidden, false)
		assert.equal(list.querySelector('.input-status-detail').textContent, expected)
		assert.equal(list.firstElementChild.classList.contains('is-connected'), ['locked', 'armed'].includes(status))
		assert.equal(list.children.length, 1)
	}
	await window.document.getElementById('timing-room-leave').onclick()
	assert.equal(list.children.length, 0)
	dom.window.close()
})
test('camera requests cancelled while permission is pending release the returned stream', async () => {
	const { dom, window, state } = setup('/room/shared')
	window.setupNetworkTiming({}, state, () => {})
	let resolveCamera, stops = 0
	Object.defineProperty(window.navigator, 'mediaDevices', { value: { getUserMedia: () => new Promise(resolve => { resolveCamera = resolve }) } })
	const pending = window.document.getElementById('timing-room-scan').onclick()
	window.document.getElementById('timing-room-stop-scan').onclick()
	resolveCamera({ getTracks: () => [{ stop: () => { ++stops } }] })
	await pending
	assert.equal(stops, 1)
	assert.equal(window.document.getElementById('timing-room-scanner').hidden, true)
	dom.window.close()
})

test('camera access failures explain the text and image alternatives', async () => {
	const { dom, window, state } = setup('/room/shared')
	window.setupNetworkTiming({}, state, () => {})
	await window.document.getElementById('timing-room-scan').onclick()
	assert.match(window.document.getElementById('timing-room-status').textContent, /Paste a link or choose a QR image/)
	assert.equal(window.document.getElementById('timing-room-scanner').hidden, true)
	dom.window.close()
})
test('pairing errors remain readable across clock updates and clear on the next action', async () => {
	const { dom, window, state } = setup('/room/shared')
	const timing = window.setupNetworkTiming({}, state, () => {})
	await window.document.getElementById('timing-room-host').onclick()
	window.document.getElementById('timing-room-pairing').value = 'bad link'
	await window.document.getElementById('timing-room-join').onclick()
	const alert = window.document.getElementById('timing-room-error')
	assert.equal(alert.hidden, false)
	timing.room.emit('hosting')
	assert.match(alert.textContent, /Paste an invitation/)
	await window.document.getElementById('timing-room-invite').onclick()
	assert.equal(alert.hidden, true)
	dom.window.close()
})
