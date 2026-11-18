/**
 * Build a compact MIDI hardware catalogue from the midi-devices package
 * (https://github.com/designerzen/midi-devices) into static/midi-devices/.
 *
 * The app fetches catalogue.json once to recognise connected MIDI ports by
 * their Web MIDI ID or port name, then shows the matching profile's icon,
 * connection diagram, controls and setup notes. Only the assets the MIDI
 * panel displays are copied, and the interactive surface layouts are dropped.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import * as path from 'node:path'
import { MIDI_DEVICE_DIRECTORY, midiDeviceFolders } from 'midi-devices'

const OUTPUT = './static/midi-devices/'

const copyIfChanged = (source, destination) => {
	if (existsSync(destination) && readFileSync(source).equals(readFileSync(destination))) return
	mkdirSync(path.dirname(destination), { recursive: true })
	copyFileSync(source, destination)
}

// Profiles write controls either as { cc } shorthand or as a full message.
const controlMessage = control => control.message ?? (control.cc !== undefined ? { type: 'cc', number: control.cc } : null)

const devices = midiDeviceFolders().sort((a, b) => a.id.localeCompare(b.id)).map(({ id, path: folder }) => {
	const profile = JSON.parse(readFileSync(path.join(MIDI_DEVICE_DIRECTORY, folder, `${id}.json`), 'utf8'))
	const images = {
		icon: profile.icon ?? 'icon.svg',
		connections: profile.diagrams?.connections,
		diagram: profile.diagrams?.interface ?? profile.diagrams?.panel,
	}
	const assets = {}
	for (const [key, file] of Object.entries(images)) {
		const source = file && path.join(MIDI_DEVICE_DIRECTORY, folder, file)
		if (!source || !existsSync(source)) continue
		copyIfChanged(source, path.join(OUTPUT, folder, file))
		assets[key] = `${folder}/${file}`
	}
	return {
		id,
		name: profile.name,
		manufacturer: profile.manufacturer,
		manufacturerId: folder.split('/')[0],
		manufacturerUrl: profile.manufacturerUrl,
		productUrl: profile.productUrl,
		description: profile.description,
		ids: profile.ids ?? [id],
		portNames: profile.portNames ?? [],
		abilities: profile.abilities ?? [],
		hardwareControls: profile.hardwareControls ?? [],
		connections: profile.connections ?? [],
		controls: (profile.controls ?? []).map(control => ({ label: control.label, message: controlMessage(control) })),
		modes: profile.modes ?? [],
		notice: profile.notice,
		documentation: profile.documentation ?? [],
		assets,
	}
})

if (!devices.length) throw new Error(`No MIDI device profiles found in ${MIDI_DEVICE_DIRECTORY}`)

const { version } = JSON.parse(readFileSync(path.join(MIDI_DEVICE_DIRECTORY, '../package.json'), 'utf8'))
mkdirSync(OUTPUT, { recursive: true })
writeFileSync(path.join(OUTPUT, 'catalogue.json'), JSON.stringify({ version, count: devices.length, devices }))
console.info(`MIDI device catalogue: ${devices.length} profiles written to ${OUTPUT}`)
