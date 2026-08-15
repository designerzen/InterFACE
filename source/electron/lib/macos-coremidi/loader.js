'use strict'

if (process.platform !== 'darwin') throw new Error('The CoreMIDI backend is only available on macOS')

module.exports = require('./build/Release/photosynth_macos_coremidi.node')
