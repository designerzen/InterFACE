import {
	isPicadeSerialPort,
	PICADE_DEFAULT_FILTERS,
} from './picade-leds.js'
import { getPicadeMaxGamepadInfo } from './picade-max-interface.js'

export const hasVisiblePicadeMaxGamepad = (gamepads = navigator.getGamepads?.() ?? []) =>
	Array.from(gamepads).some(gamepad => gamepad?.connected && getPicadeMaxGamepadInfo(gamepad))

export async function requestPicadeSerialPortFromUserGesture(serial = navigator.serial) {
	console.groupCollapsed?.('[Picade Max Serial] requestPicadeSerialPortFromUserGesture')
	console.info('[Picade Max Serial] serial available', Boolean(serial), {
		hasRequestPort: Boolean(serial?.requestPort),
		hasGetPorts: Boolean(serial?.getPorts),
		filters: PICADE_DEFAULT_FILTERS,
	})
	if (!serial?.requestPort) {
		console.warn('[Picade Max Serial] navigator.serial.requestPort unavailable')
		console.groupEnd?.()
		return { status: 'unavailable', port: null }
	}

	const pairedPorts = await serial.getPorts?.() ?? []
	console.info('[Picade Max Serial] paired ports', pairedPorts.map(port => port.getInfo?.()))
	const pairedPort = pairedPorts.find(port => isPicadeSerialPort(port))
	if (pairedPort) {
		console.info('[Picade Max Serial] matched paired Picade port', pairedPort.getInfo?.())
		console.groupEnd?.()
		return { status: 'paired', port: pairedPort }
	}

	console.info('[Picade Max Serial] requesting Picade serial port with filters', PICADE_DEFAULT_FILTERS)
	const port = await serial.requestPort({ filters: PICADE_DEFAULT_FILTERS })
	console.info('[Picade Max Serial] selected Picade serial port', port?.getInfo?.())
	console.groupEnd?.()
	return { status: 'selected', port }
}
