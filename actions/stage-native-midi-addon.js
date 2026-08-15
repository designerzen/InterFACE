'use strict'

const fs = require('node:fs')
const path = require('node:path')

const targets = {
	win32:{ packageDirectory:'windows-midi-services', binary:'photosynth_windows_midi.node' },
	darwin:{ packageDirectory:'macos-coremidi', binary:'photosynth_macos_coremidi.node' },
}
const target = targets[process.platform]
if (!target) process.exit(0)

const repositoryRoot = path.resolve(__dirname, '..')
const source = path.join(repositoryRoot, 'source/electron/lib', target.packageDirectory, 'build/Release', target.binary)
const destination = path.join(repositoryRoot, 'dist-electron/native', target.binary)

if (!fs.existsSync(source)) throw new Error(`Native MIDI addon was not built: ${source}`)
fs.mkdirSync(path.dirname(destination), { recursive:true })
fs.copyFileSync(source, destination)
console.log(`Staged native MIDI addon at ${destination}`)
