import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getPathRoomId, validRoomId } from '../source/network/room-url.js'

// These run before the copied index page loads any relative assets or app modules.
export function enterRoomPage() {
	const url = new URL(window.location.href)
	if (!getPathRoomId(url.pathname)) {
		const room = url.searchParams.get('room')
		if (!validRoomId(room)) { window.location.replace('/'); return }
		url.pathname = `/room/${room}`
		url.searchParams.delete('room')
		window.history.replaceState(null, '', url)
	}
	// A root asset base must not send in-page panel links back to the home page.
	window.document.addEventListener('click', event => {
		const link = event.target.closest?.('a[href^="#"]')
		if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey
			|| event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return
		event.preventDefault()
		window.location.hash = link.getAttribute('href')
	})
}

export function redirectRoomPage() {
	const url = new URL(window.location.href)
	const room = getPathRoomId(url.pathname)
	if (!room) return
	url.pathname = '/room/'
	url.searchParams.set('room', room)
	window.location.replace(url.href)
}

const routeScript = action => `<script>(()=>{const getPathRoomId=${getPathRoomId.toString()};const validRoomId=${validRoomId.toString()};(${action.toString()})()})()</script>`
const injectHead = (html, contents) => {
	if (/<head(?:\s[^>]*)?>/i.test(html)) return html.replace(/<head(?:\s[^>]*)?>/i, match => match + contents)
	// HTML optimizers may omit the optional head tags. Restore its opening tag
	// before the first asset; the existing body tag closes it implicitly.
	if (/<html(?:\s[^>]*)?>/i.test(html)) return html.replace(/<html(?:\s[^>]*)?>/i, match => `${match}<head>${contents}`)
	throw new Error('Expected a complete HTML page with a head or html element')
}

export const createRoomPages = (index, notFound) => ({
	room: injectHead(index, `<base href="/">${routeScript(enterRoomPage)}`),
	notFound: injectHead(notFound, routeScript(redirectRoomPage)),
})

export const buildRoomPages = async outputRoot => {
	const [index, notFound] = await Promise.all([
		readFile(resolve(outputRoot, 'index.html'), 'utf8'),
		readFile(resolve(outputRoot, '404.html'), 'utf8'),
	])
	const pages = createRoomPages(index, notFound)
	await mkdir(resolve(outputRoot, 'room', 'shared'), { recursive: true })
	await writeFile(resolve(outputRoot, 'room', 'index.html'), pages.room)
	await writeFile(resolve(outputRoot, 'room', 'shared', 'index.html'), pages.room)
	await writeFile(resolve(outputRoot, '404.html'), pages.notFound)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	await buildRoomPages(resolve(import.meta.dirname, '..', 'releases', 'web'))
	console.log('Room pages ready: /room/shared and named room URL fallback.')
}
