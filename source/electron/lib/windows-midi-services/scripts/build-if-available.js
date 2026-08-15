'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const packageRoot = path.resolve(__dirname, '..')
const requiredHeaders = [
	'winrt/Microsoft.Windows.Devices.Midi2.h',
	'winmidi/init/Microsoft.Windows.Devices.Midi2.Initialization.hpp',
]

if (process.platform !== 'win32') process.exit(0)

const missingHeaders = requiredHeaders.filter(header => !fs.existsSync(path.join(packageRoot, 'sdk/include', header)))
if (missingHeaders.length) {
	console.warn(`Skipping optional Windows MIDI Services addon; install the Microsoft SDK headers in sdk/include (${missingHeaders.join(', ')})`)
	process.exit(0)
}

const nodeGyp = path.join(packageRoot, 'node_modules', 'node-gyp', 'bin', 'node-gyp.js')
const result = spawnSync(process.execPath, [nodeGyp, 'rebuild'], { cwd:packageRoot, stdio:'inherit' })
process.exit(result.status ?? 1)
