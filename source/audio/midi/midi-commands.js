// Types!
export const TYPE_CHANNEL                   = 'channel'
export const TYPE_META                      = 'meta'
export const TYPE_SYSTEM_EXCLUSIVE          = 'sysEx'
export const TYPE_DIVIDED_SYSTEM_EXCLUSIVE  = 'dividedSysEx'

// Commands!
export const COMMAND_NOTE_OFF               = 'noteOff'
export const COMMAND_NOTE_ON                = 'noteOn'
export const COMMAND_NOTE_AFTER_TOUCH       = 'noteAftertouch'
export const COMMAND_CONTROLLER             = 'controller'
export const COMMAND_PROGRAM_CHANGE         = 'programChange'

export const COMMAND_CHANNEL_AFTER_TOUCH    = 'channelAftertouch'
export const COMMAND_CHANNEL_PRESSURE       = 'channelPressure'

export const COMMAND_PITCH_BEND             = 'pitchBend'
export const COMMAND_SYSTEM_MESSAGE         = 'systemMessage'

export const COMMANDS = [
	COMMAND_NOTE_OFF,
	COMMAND_NOTE_ON,
	COMMAND_NOTE_AFTER_TOUCH,
	COMMAND_CONTROLLER,
	COMMAND_PROGRAM_CHANGE,
	COMMAND_CHANNEL_PRESSURE,
	COMMAND_PITCH_BEND,
	COMMAND_SYSTEM_MESSAGE
]