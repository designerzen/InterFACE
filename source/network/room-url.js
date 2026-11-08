export const validRoomId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{6,80}$/.test(value)

export const getPathRoomId = pathname => {
	const match = /^\/room\/([a-zA-Z0-9_-]{6,80})\/?$/.exec(pathname)
	return match?.[1] ?? ''
}

export const getRoomURL = (base, room) => {
	if (!validRoomId(room)) throw new Error('Enter a room code of 6–80 letters, numbers, hyphens or underscores')
	const url = new URL(base)
	if (['/', '/index.html', '/room/', '/room/index.html'].includes(url.pathname) || getPathRoomId(url.pathname)) {
		url.pathname = `/room/${room}`
		url.searchParams.delete('room')
	} else url.searchParams.set('room', room)
	url.searchParams.delete('syncServer')
	return url
}
