export const convertOptionToObject = items => items.reduce( (accumulator, current) => {
	const c = current.split(":")
	accumulator[c[0]] = parseFloat(c[1])
	return accumulator
}, {})

export const debounce = (callback, wait) => {
	let timerId
	
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	  return timerId
	}
}


// memoize this method
export const memoize = ( method ) => {

	// store outputs and inputs
	const cache = new Map()

	// takes same args as the method
	return (...args) => {

		// check to see if we have a cached entry
		if (cache.has(args))
		{
			return cache.get(args)
		}

		const result = method.apply( this, args )
		cache.set( args, result )
		return result
	}
}


export const injectJavascript = async(url) => new Promise((resolve, reject) => {
	const script = document.createElement("script")
	script.onload = () => { resolve(url) }
	script.onerror = error => { reject(error) }
	script.src = url
	document.head.appendChild(script)
	// console.error("injecting JS", url , script)
})


// DECODE UTILITIES


/*
Base64 / binary data / UTF-8 strings utilities
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
https://github.com/audiojs/audio-loader/blob/master/lib/base64.js
*/
export const b64ToUint6 = nChr => {
	return nChr > 64 && nChr < 91 ? nChr - 65
	  : nChr > 96 && nChr < 123 ? nChr - 71
	  : nChr > 47 && nChr < 58 ? nChr + 4
	  : nChr === 43 ? 62
	  : nChr === 47 ? 63
	  : 0
}

/**
 * Base64 string to array encoding 
 * @param {Uint6} nUint6 
 * @returns 
 */
export const uint6ToB64 = nUint6 => {
	return nUint6 < 26 ? nUint6 + 65
	  : nUint6 < 52 ? nUint6 + 71
	  : nUint6 < 62 ? nUint6 - 4
	  : nUint6 === 62 ? 43
	  : nUint6 === 63 ? 47
	  : 65
}

/**
 * Decode Base64 to Uint8Array
 * @param {sBase64} sBase64 
 * @param {nBlocksSize} nBlocksSize 
 * @returns Uint8Array
 */
export const decodeBase64 = (sBase64, nBlocksSize) => {
	const sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '')
	const nInLen = sB64Enc.length
	const nOutLen = nBlocksSize
	  ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
	  : nInLen * 3 + 1 >> 2

	const taBytes = new Uint8Array(nOutLen)
  
	for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) 
	{
	  nMod4 = nInIdx & 3
	  nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
	  if (nMod4 === 3 || nInLen - nInIdx === 1) 
	  {
		for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) 
		{
		  taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255
		}
		nUint24 = 0
	  }
	}
	return taBytes
}
  

export const asciiToBinary = (base64) => {
	if (typeof window !== "undefined")
	{
		return atobUTF8(base64)
	}
	
	return atob(base64)	
}


export function base64Decode(base64) {
	const binaryString = atob(base64)
	const len = binaryString.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
	  bytes[i] = binaryString.charCodeAt(i)
	}
	return bytes
}

  




export const base64DecToArr = (sBase64, nBlocksSize) => {

  var
    sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;

    }
  }

  return taBytes;
}


export const base64EncArr = (aBytes) => {

  let nMod3 = 2, sB64Enc = ""
  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) 
  {
    nMod3 = nIdx % 3
    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) 
	{ 
		sB64Enc += "\r\n" 
	}
    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24)
    if (nMod3 === 2 || aBytes.length - nIdx === 1) 
	{
      sB64Enc += String.fromCodePoint(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63))
      nUint24 = 0
    }
  }

  return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
}

/**
 * UTF-8 array to JS string and vice versa 
 */
export const UTF8ArrToStr = (aBytes) => {
  let sView = ""
  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) 
  {
    nPart = aBytes[nIdx]
    sView += String.fromCodePoint(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
        (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
        (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
        (nPart - 192 << 6) + aBytes[++nIdx] - 128
      : /* nPart < 127 ? */ /* one byte */
        nPart
    )
  }
  return sView
}

/**
 * 
 * @param {*} sDOMStr 
 * @returns 
 */
export const strToUTF8Arr = (sDOMStr) => {

  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) 
  {
    nChr = sDOMStr.codePointAt(nMapIdx)

    if (nChr > 65536) {
      nMapIdx++
    }

    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6
  }

  aBytes = new Uint8Array(nArrLen)

  /* transcription... */
  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) 
  {
    nChr = sDOMStr.codePointAt(nChrIdx)
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6)
      aBytes[nIdx++] = 128 + (nChr & 63)
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12)
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18)
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63)
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24)
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
      nChrIdx++
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30)
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63)
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
      nChrIdx++
    }
  }
  return aBytes
}


export const toBytes = (number, byteCount) => {
	const bytes = new Array(byteCount)
	for (let i = byteCount - 1; i >= 0; i--) 
	{
		bytes[i] = number & 255
		number >>= 8
	}
	return bytes
}

export const toVarLenBytes = (number) => {
	const bytes = []
	let last = true
	do {
		const partial_value = number & 127
		number >>= 7
		if (last) {
			// first bit is off for last byte
			bytes.unshift(partial_value)
			last = false
		}
		else {
			// set first bit on for all other bytes
			bytes.unshift(partial_value | 128)
		}
	} while (number > 0)
	return bytes
}


/* Array of bytes to Base64 string decoding */

// export const b64ToUint6 = (nChr) => {
// 	return nChr > 64 && nChr < 91 ?
// 		nChr - 65
// 	  : nChr > 96 && nChr < 123 ?
// 		nChr - 71
// 	  : nChr > 47 && nChr < 58 ?
// 		nChr + 4
// 	  : nChr === 43 ?
// 		62
// 	  : nChr === 47 ?
// 		63
// 	  :
// 		0;
//   }  

/**
 * 
const a2b = (a) => {
	let b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length
	for (b = 0; 64 > b; b++){
		e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b
	}
	for (c = 0; j > c; c++){
		for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) {
			((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d))
		}
	}
	return h
}
 */