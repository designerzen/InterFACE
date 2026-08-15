const getMIDIPortIdentity = port => [
	port?.id,
	port?.name,
	port?.manufacturer,
].filter(Boolean).join(' ')

export const isDigitCMPSRPort = port => {
	const identity = getMIDIPortIdentity(port)
	return /\bcmpsr\b/i.test(identity)
		|| (/\bdigit(?: audio| music)?\b/i.test(identity) && /\bcomposer\b/i.test(identity))
}

export const getMIDIPortDisplayName = (port, fallback = 'MIDI Input') =>
	isDigitCMPSRPort(port) ? 'DIGIT CMPSR' : (port?.name || port?.manufacturer || fallback)
