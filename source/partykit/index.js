/* eslint-env browser */

// @ts-check
// Optional JS type checking, powered by TypeScript.
/** @typedef {import("partykit/server").Room} Room */
/** @typedef {import("partykit/server").Server} Server */
/** @typedef {import("partykit/server").Connection} Connection */
/** @typedef {import("partykit/server").ConnectionContext} ConnectionContext */

/**
 * @implements {Server}
 */
export default class PartyServer {

	/**
	 * @param {Room} room - The Room object.
	 */
	constructor(room) {
		/** @type {Room} */
		this.room = room
	}

	/**
	 * @param {Connection} connection - The connection object.
	 * @param {ConnectionContext} ctx - The context object.
	 */
	onConnect(connection, ctx) {
		// A websocket just connected!
		console.log(
			`Connected:
			id: ${connection.id}
			room: ${this.room.id}
			url: ${new URL(ctx.request.url).pathname}`
		)

		// const country = ctx.request.cf?.country ?? null

		// Stash the country in the websocket attachment
		// connection.serializeAttachment({
		// ...connection.deserializeAttachment(),
		// country: country
		// })

		// Send a message to the connection
		connection.send(`Welcome, ${connection.id}`)
		// let everyone else know that a new connection joined
		this.room.broadcast(`user-connected`, [connection.id])
	}

	/**
	 * @param {string} message
	 * @param {Connection} sender
	 */
	onMessage(message, sender) {
		console.log(`connection ${sender.id} sent message: ${message}`)
		// Broadcast the received message to all other connections in the room except the sender
		this.room.broadcast(`${sender.id}: ${message}`, [sender.id])
		// for (const conn of this.room.getConnections()) {
		//   if (conn.id !== sender.id) {
		//     conn.send(`${sender.id} says: ${message}`)
		//   }
		// }
	}
}