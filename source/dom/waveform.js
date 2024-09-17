const createWavePath = (data, key=0, direction=-1, className="lines") => {
	return `<path
				class="${className}"
				key=${key}
				d="M ${key}, ${255 / 2} l 0, ${direction * data / 2}" 
			/>`
}

export const createWaveform = (data, lineTo) => {

	const pathA = data.map( (d, i) => createWavePath(d, i,-1, "top") )
	const pathB = data.map( (d, i) => createWavePath(d, i, 1, "bottom") )

	return `
	<svg class="waveform"
        viewBox="0 0 255 255"
        preserveAspectRatio="none"
    >
        <path
			class="waveform-start"
			d="M 0, ${255 / 2} l 255, 0"
        />

		${pathA.join("")}
		${pathB.join("")}

        <path
			class="waveform-end"
          	d="M 0, ${255 / 2} l ${lineTo}, 0"
        />

    </svg>`
}

/**
 * Create a SVG string element from the waveform data
 * @param {SVGElement} waveforms 
 * @returns 
 */
export const createSVGWaveformFromData = (waveforms) => {
	
	if (waveforms && waveforms.length)
	{
		// process the waveforms
		let lastNonZero = 0
		let datum
		
		const compacted = waveforms.map( freqByteData=> {
			
			const waveformDataCompacted = []
			for (let idx = 0; idx < 255; idx += 1) {
				datum = Math.floor(freqByteData[idx]) - (Math.floor(freqByteData[idx]) % 5)

				if (datum !== 0) {
					lastNonZero = idx
				}

				waveformDataCompacted[idx] = datum
			}
			return waveformDataCompacted
		})

		const f = compacted.flat(1)
		return createWaveform( f, lastNonZero )	
		// console.log( f, {compacted, waveforms, waveformData} )
		// console.log(svg)
	}else{
		return ''
	}
}