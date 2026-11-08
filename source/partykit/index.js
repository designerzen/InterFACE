// Signaling and fallback transport; audio timing runs in each client.
export default class PartyServer {
 constructor(room) { this.room = room; this.leaderId = null }
 roster() { return { type: 'roster', leaderId: this.leaderId, peers: [...this.room.getConnections()].map(c => c.id) } }
 onConnect(connection, context) {
  const host = new URL(context.request.url).searchParams.get('host')
  if (!this.leaderId && ['true', 'auto'].includes(host)) this.leaderId = connection.id
  this.room.broadcast(JSON.stringify(this.roster()))
 }
 onClose(connection) {
  if (this.leaderId === connection.id) this.leaderId = null
  this.room.broadcast(JSON.stringify(this.roster()))
 }
 onMessage(raw, sender) {
  if (typeof raw !== 'string' || raw.length > 32768) return
  let message
  try { message = JSON.parse(raw) } catch { return }
  if (!message || !['signal', 'data', 'probe', 'probe-reply'].includes(message.type)) return
  if (typeof message.to !== 'string' || message.to === sender.id) return
  const target = this.room.getConnection(message.to)
  if (target) target.send(JSON.stringify({ type: message.type, from: sender.id, payload: message.payload }))
 }
}
