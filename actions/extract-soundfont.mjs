/**
 * This script extracts the soundfont from the .sf2 file
 * and saves them as individual wav files named appropriately
 */
// I will assume that you use the following for the rest of this guide
import * as fflate from 'fflate'

// However, you should import ONLY what you need to minimize bloat.
// So, if you just need GZIP compression support:
import { gzipSync } from 'fflate'
// Woo! You just saved 20 kB off your bundle with one line.