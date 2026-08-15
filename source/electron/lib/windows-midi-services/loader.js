'use strict'

const path = require('node:path')

if (process.platform !== 'win32') {
	throw new Error('Windows MIDI Services is available only on Windows')
}

module.exports = require(path.join(__dirname, 'build', 'Release', 'photosynth_windows_midi.node'))
