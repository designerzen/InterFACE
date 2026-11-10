import { decompressSync, compressSync, deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate'

import { base64DecodeNative, base64EncArr } from './base64.js'
import { PERSON_OPTION_KEYS_V1, STATE_BASELINE_V1 } from './state-baseline.v1.js'

// legacy gzip encoded query string (?b=…)
export const ENCODED_QUERY_PARAM = 'b'

// versioned state link (?s=<version>.<payload>)
export const STATE_QUERY_PARAM = 's'
export const STATE_ENCODING_VERSION = 1

// Links longer than this may be cut off by chat apps, QR codes and proxies
export const URL_LENGTH_BUDGET = 2000

const NUMBER_PATTERN = /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i

export const toURLSafeBase64 = base64String => base64String
	.replace(/\s+/g, '')
	.replace(/\+/g, '-')
	.replace(/\//g, '_')
	.replace(/=+$/g, '')

export const fromURLSafeBase64 = base64String => {
	const restored = base64String
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/')
	const remainder = restored.length % 4
	return remainder === 0 ? restored : restored + '='.repeat(4 - remainder)
}

const fromURLSafeBase64Bytes = encoded => base64DecodeNative(fromURLSafeBase64(encoded))
const toURLSafeBase64Bytes = bytes => toURLSafeBase64(base64EncArr(bytes))

export const uncompressQueryString = compressed => {
	const buffer = typeof compressed === 'string'
		? fromURLSafeBase64Bytes(compressed)
		: compressed
	return strFromU8(decompressSync(buffer))
}

export const compressQueryString = (string, zipOptions={ level:6, mem:4 }) => {
	return toURLSafeBase64Bytes(compressSync(strToU8(string), zipOptions))
}

/**
 * Convert a query string value into a number or boolean only when
 * the whole value matches, so values such as "12,soundfont" stay strings
 * @param {String} value
 * @returns {String|Number|Boolean}
 */
export const parseQueryValue = value => {
	if (typeof value !== 'string') return value
	if (NUMBER_PATTERN.test(value)) return Number(value)
	const lower = value.toLowerCase()
	if (lower === 'true' || lower === 'yes') return true
	if (lower === 'false' || lower === 'no') return false
	return value
}

/**
 * Serialise a state value for a link. Floating point noise from sliders
 * such as 0.30000000000000004 is trimmed to 6 significant digits.
 * @param {Any} value
 * @returns {String}
 */
export const serialiseStateValue = value => {
	if (typeof value === 'number' && Number.isFinite(value) && !Number.isInteger(value))
	{
		return String(Number(value.toPrecision(6)))
	}
	return String(value)
}

// Each version owns an immutable baseline and dictionary
const STATE_CODECS = new Map([
	[1, {
		baseline:STATE_BASELINE_V1,
		createDictionary:() => strToU8(
			PERSON_OPTION_KEYS_V1.map(key => `&p-1-${key}=`).join('') +
			'&' + new URLSearchParams(Object.entries(STATE_BASELINE_V1).map(([key, value]) => [key, String(value)])).toString()
		)
	}]
])

const dictionaries = new Map()
const getCodec = version => {
	const codec = STATE_CODECS.get(version)
	if (!codec) throw new Error(`Unsupported state link version ${version}`)
	if (!dictionaries.has(version)) dictionaries.set(version, codec.createDictionary())
	return { ...codec, dictionary:dictionaries.get(version) }
}

/**
 * Only the values that differ from the versioned baseline, sorted by key
 * so the same state always produces the same link
 * @param {Iterable<[String,Any]>} entries
 * @param {Number} version
 * @returns {String} query string
 */
export const createStateDelta = (entries, version=STATE_ENCODING_VERSION) => {
	const { baseline } = getCodec(version)
	const delta = []
	for (const [key, value] of entries)
	{
		const serialised = serialiseStateValue(value)
		if (Object.prototype.hasOwnProperty.call(baseline, key) && serialiseStateValue(baseline[key]) === serialised) continue
		delta.push([key, serialised])
	}
	delta.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
	return new URLSearchParams(delta).toString()
}

/**
 * @param {Iterable<[String,Any]>} entries state entries
 * @returns {String} "<version>.<payload>"
 */
export const encodeState = (entries, version=STATE_ENCODING_VERSION) => {
	return compressStateDelta(createStateDelta(entries, version), version)
}

/**
 * @param {String} delta query string from createStateDelta
 * @returns {String} "<version>.<payload>"
 */
export const compressStateDelta = (delta, version=STATE_ENCODING_VERSION) => {
	const { dictionary } = getCodec(version)
	return `${version}.${toURLSafeBase64Bytes(deflateSync(strToU8(delta), { level:9, mem:4, dictionary }))}`
}

/**
 * Restore the full typed state from a versioned link value
 * @param {String} encoded "<version>.<payload>"
 * @returns {Object}
 */
export const decodeState = encoded => {
	const separator = encoded.indexOf('.')
	const version = Number(encoded.slice(0, separator))
	const { baseline, dictionary } = getCodec(version)
	const delta = strFromU8(inflateSync(fromURLSafeBase64Bytes(encoded.slice(separator + 1)), { dictionary }))
	const state = { ...baseline }
	for (const [key, value] of new URLSearchParams(delta))
	{
		// keep each setting's original type so "808" stays a string drumkit
		const type = Object.prototype.hasOwnProperty.call(baseline, key) && baseline[key] !== null ? typeof baseline[key] : null
		state[key] = type === 'string' ? value
			: type === 'boolean' ? parseQueryValue(value) === true
			: type === 'number' && NUMBER_PATTERN.test(value) ? Number(value)
			: parseQueryValue(value)
	}
	return state
}

export const mergeEncodedAndRawQueryParams = (
	defaultState={},
	rawParams,
	decodeSearchParams,
	parseValue=value => value,
	encodedParamKey=ENCODED_QUERY_PARAM
) => {
	const mergedState = { ...defaultState }
	const params = rawParams instanceof URLSearchParams ? rawParams : new URLSearchParams(rawParams)
	const encodedValue = params.get(encodedParamKey)

	if (encodedValue && typeof decodeSearchParams === 'function')
	{
		for (const [key, value] of decodeSearchParams(encodedValue).entries())
		{
			mergedState[key] = parseValue(value)
		}
	}

	for (const [key, value] of params.entries())
	{
		if (key === encodedParamKey) continue
		mergedState[key] = parseValue(value)
	}

	return mergedState
}

/**
 * Read any encoded state from a URL (versioned ?s= or legacy ?b=) merged
 * with readable params, which always win so links can be tweaked by hand
 * @param {Object} defaultState
 * @param {URLSearchParams} params
 * @returns {Object}
 */
export const decodeLocationState = (defaultState={}, params) => {
	const state = { ...defaultState }
	try {
		if (params.has(STATE_QUERY_PARAM))
		{
			Object.assign(state, decodeState(params.get(STATE_QUERY_PARAM)))
		}else if (params.has(ENCODED_QUERY_PARAM)){
			for (const [key, value] of new URLSearchParams(uncompressQueryString(params.get(ENCODED_QUERY_PARAM))))
			{
				state[key] = parseQueryValue(value)
			}
		}
	} catch (error) {
		// a truncated or unknown link falls back to the defaults
		console.warn('Could not read the settings from this link', error)
	}
	for (const [key, value] of params)
	{
		if (key === STATE_QUERY_PARAM || key === ENCODED_QUERY_PARAM) continue
		state[key] = parseQueryValue(value)
	}
	return state
}
