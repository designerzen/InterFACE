/**
 * P2P WebRTC data broadcasting
 * I wanted to use PartyKit and Cloudflare durables
 * but whilst this project is given away for free,
 * have to be very careful I don't ruin myself through popularity
 * so instead we repurpose the WebSocket announcements for
 * webtoorrents by essentially creating a magnet: link
 * and sending a very small data file into the public domain
 * which is then used to reverse connect the peers who have
 * downloaded the file through their own clients.
 * 
 * 1. Connect to a torrent announcement pool
 * 2. Search for Peers
 * 3. Connect directly to Peers IP
 * 4. Broadcast data to all peers
*/
import {
	P2PT, 
	SimplePeer,
	SimplePeerFiles
} from './network/p2p.js'

// List all publically available WebSocket trackers
const TRACKERS_ANNOUNCE_URIS = [
	'wss://tracker.btorrent.xyz',
	'wss://tracker.openwebtorrent.com',
	'wss://tracker.fastcast.nz',
	'wss://tracker.sloppyta.co:443/',
	'wss://tracker.novage.com.ua:443/',
	// 'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
	'wss://tracker.files.fm:7073/announce',
]

export const monitorBroadCastChannel = ( application, channelId ='p2p', trackers=TRACKERS_ANNOUNCE_URIS ) => {

	const clock = application.clock
	const activePeers = new Set()

	// Create a new P2PT instance with the trackers and room ID
	const p2pt = new P2PT( trackers,
		// Create a room with a unique ID
		channelId
	)

	p2pt.on('trackerwarning', (error, stats) => {

	})
	
	p2pt.on('trackerconnect', (tracker, stats) => {

	})

	p2pt.on('peerconnect', (peer) => {
		activePeers.add(peer)
	
	})

	p2pt.on('peerclose', (peer) => {
		activePeers.delete(peer)

	})

	p2pt.on('msg', (peer, message) => {
		if (message.text) {
			const remote = peer.remoteAddress || String(peer.id).slice(0, 8)
		}
		switch(message.type){
			default:
				if (!application.isLoading)
				{
					// slaves never dispatch events
					application.setAsSlave(true)
					// console.log("Received message from master", event)
					return
				}
				if (application.isSlave)
				{

				}
		}
	})
		
	// post some data to the Peer argument connection!
	// p2pt.send(peer, { message: 'meow' })

	p2pt.start()

	const send = (peer, text) => {
		p2pt.send(peer, {text})
	}
	const sendToAll = (text) => {
		for (const peer of activePeers) {
			p2pt.send(peer, {text})
		}
	}

	// to send a tempo we send a clock timestamp and an interval, 
	// that way the clock isn't directly triggered by the 
	// message but it gives the clock all the information required
	// to synchronise with the master clock
	
	sendToAll("announcement")

	return {
		send, sendToAll,
		getQuantityOfPeers:()=> activePeers.size,
		getPeers: () => Array.from(activePeers),
	}
}