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
