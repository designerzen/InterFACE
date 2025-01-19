

/**
 * Find the largest data point in the array with Math.max(), 
 * takes its inverse with Math.pow(n, -1), and multiplies 
 * each value in the array by that number. 
 * This guarantees that the largest data point will be set to 1, 
 * and the rest of the data will scale proportionally.
 * @param filteredData 
 * @returns 
 */
export const normalizeData = (filteredData) => {
	// find the largest data point in the array
	const largest = Math.max(...filteredData)
	// inverted as scale
	const multiplier = Math.pow(largest, -1)
	// normalise data set
	return filteredData.map(n => n * multiplier)
}

/**
 * 
 * @param audioBuffer 
 * @param samples Number of samples we want to have in our final data set
 * @returns 
 */
export const filterData = (audioBuffer, samples = 70) => {
	const rawData = audioBuffer.getChannelData(0)           // We only need to work with one channel of data
	const blockSize = Math.floor(rawData.length / samples)  // the number of samples in each subdivision
	const filteredData = []
	for (let i = 0; i < samples; i++) {
		let blockStart = blockSize * i // the location of the first sample in the block
		// rolling summary
		let sum = 0
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
		}
		filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
	}
	return filteredData
}



// draw waveform data
/**
 * 
 * @param {Canvas2dContext} waveformContext 
 * @param {*} waveformData 
 * @param {number} hue 
 */
export const drawWaveform = ( waveformContext, waveformData, hue=50 ) =>{
	
	const waveformCanvas = waveformContext.canvas
	const width = waveformCanvas.width
	const height = waveformCanvas.height
	const quantity = waveformData.length
	const every = quantity / width

	waveformContext.clearRect(0,0,width,height)
	waveformContext.lineWidth = 2
	waveformContext.strokeStyle = `hsla(${hue}, 100, 150, 0.5)`
	waveformContext.beginPath()

	let x = 0
	const sliceWidth = width * 1/ quantity

	for(let i = 0; i < quantity; i+=every) 
	{
		const v = waveformData[i]
		const y = v * height / 2

		if(i === 0) 
		{
			waveformContext.moveTo(x, y)
		} else {
			waveformContext.lineTo(x, y)
		}

		x += sliceWidth
	}

	waveformContext.lineTo( width, height * 0.5 )
	waveformContext.stroke()
}
