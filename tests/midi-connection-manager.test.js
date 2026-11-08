import MIDIConnectionManager from '../source/audio/midi/midi-connection-manager.js'

test('device snapshots preserve other connections and remove unplugged ports', () => {
	const manager = new MIDIConnectionManager()
	const update = jest.fn()
	manager.observe(update)
	const usb = {id:'usb', name:'Synth'}
	const bluetooth = {id:'ble', name:'Keys'}
	manager.updateDeviceList([usb], [], null, 'system')
	manager.updateDeviceList([], [bluetooth], null, 'bluetooth')
	expect(manager.outputs).toEqual([usb])
	expect(manager.inputs).toEqual([bluetooth])
	manager.updateDeviceList([], [], null, 'system')
	expect(manager.outputs).toEqual([])
	expect(manager.inputs).toEqual([bluetooth])
	expect(update).toHaveBeenLastCalledWith([], [bluetooth], [usb], null)
	manager.updateDeviceList([], [], null, 'bluetooth')
	expect(manager.inputs).toEqual([])
})

test('disabling disconnects backends and announces an empty device list', async () => {
	const manager = new MIDIConnectionManager()
	const disconnect = jest.fn()
	const update = jest.fn()
	manager.observe(update)
	manager.connections = [{disconnect}]
	manager.updateDeviceList([{id:'synth'}], [])
	await manager.disable()
	expect(disconnect).toHaveBeenCalledTimes(1)
	expect(manager.outputs).toEqual([])
	expect(update).toHaveBeenLastCalledWith([], [], [], null)
})
