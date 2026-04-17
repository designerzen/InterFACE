/**
 * Compatibility layer between netronome and PhotoSYNTH
 * This module wraps netronome exports to maintain backward compatibility
 */

// Import from netronome (use require path or dynamic import if needed)
import { Timer, AudioTimer, tapTempo } from 'netronome'

// Export wrapped versions
export { Timer, AudioTimer, tapTempo }

// Export the original timer.js exports for backward compatibility
export { default } from './timer.js'
