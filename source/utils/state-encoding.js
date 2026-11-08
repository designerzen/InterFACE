import { decompressSync, compressSync, strFromU8, strToU8 } from 'fflate'

import { base64DecodeNative, base64EncArr } from './base64.js'

export const ENCODED_QUERY_PARAM = 'b'

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

export const uncompressQueryString = compressed => {
	const buffer = typeof compressed === 'string'
		? base64DecodeNative(fromURLSafeBase64(compressed))
		: compressed
	return strFromU8(decompressSync(buffer))
}

export const compressQueryString = (string, zipOptions={ level:6, mem:4 }) => {
	const compressed = compressSync(strToU8(string), zipOptions)
	return toURLSafeBase64(base64EncArr(compressed))
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
