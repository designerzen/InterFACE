/**
 * Midi Stream
 * Abstract    - A string based byte nibbler and convertor
 * Description - Feed it a data file then request bytes as needed
 */
export default class MIDIStream {

	position = 0
	str

	/**
	 * Create an instance of a MIDI data stream
	 * @param {String} data - RAW data
	 */
	constructor(data) {
		this.str = data
	}

	/**
	 * Read X length of the internal string
	 * @param {*} length 
	 * @returns {String} 
	 */
	read(length) {
		const result = this.str.substr(this.position, length)
		this.position += length
		return result
	}

	/**
	 * Read a big-endian 32-bit integer
	 * @returns {String} XXXX
	 */
	readInt32() {
		const result = (
			(this.str.charCodeAt(this.position) << 24)
			+ (this.str.charCodeAt(this.position + 1) << 16)
			+ (this.str.charCodeAt(this.position + 2) << 8)
			+ this.str.charCodeAt(this.position + 3))
		this.position += 4
		return result
	}

	/**
	 * Read a big-endian 16-bit integer
	 * @returns {String} XX
	 */
	readInt16() {
		const result = (
			(this.str.charCodeAt(this.position) << 8)
			+ this.str.charCodeAt(this.position + 1))
		this.position += 2
		return result
	}

	/**
	 * read an 8-bit integer
	 * @param {Boolean} signed 
	 * @returns {String} X
	 */
	readInt8(signed = false) {
		const result = this.str.charCodeAt(this.position)
		if (signed && result > 127) {
			result -= 256
		}
		this.position += 1
		return result
	}

	/**
	 * Read a MIDI-style variable-length integer
	 * (big-endian value in groups of 7 bits,
	 * with top bit set to signify that another byte follows)
	 * @returns {Number} A
	 */
	readVarInt() {
		let result = 0
		while (true) {
			const b = this.readInt8(false)
			if (b & 0x80) {
				result += (b & 0x7f)
				result <<= 7
			} else {
				return result + b
				// b is the last byte
			}
		}
	}
	
	// End of File - bool
	eof() {
		return this.position >= this.str.length
	}
}