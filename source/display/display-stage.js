const getFiniteDimension = (value) => Number.isFinite(value) && value > 0 ? value : 0

export const getMediaDimensions = (mediaElement) => {
	const width = getFiniteDimension(
		mediaElement?.videoWidth ||
		mediaElement?.naturalWidth ||
		mediaElement?.width ||
		mediaElement?.clientWidth
	)
	const height = getFiniteDimension(
		mediaElement?.videoHeight ||
		mediaElement?.naturalHeight ||
		mediaElement?.height ||
		mediaElement?.clientHeight
	)
	return { width, height }
}

export const getStageDisplaySize = ({
	frameWidth,
	frameHeight,
	mediaWidth,
	mediaHeight,
	flood = false
}) => {
	if (
		!Number.isFinite(frameWidth) || frameWidth <= 0 ||
		!Number.isFinite(frameHeight) || frameHeight <= 0 ||
		!Number.isFinite(mediaWidth) || mediaWidth <= 0 ||
		!Number.isFinite(mediaHeight) || mediaHeight <= 0
	){
		return null
	}

	const scale = flood ?
		Math.max(frameWidth / mediaWidth, frameHeight / mediaHeight) :
		Math.min(frameWidth / mediaWidth, frameHeight / mediaHeight)

	return {
		width: Math.round(mediaWidth * scale),
		height: Math.round(mediaHeight * scale)
	}
}

export const createDisplayStageController = ({
	mainElement,
	frameElement,
	getDisplayManager = () => null,
	getOverlayDisplay = () => null,
	getFlood = () => false
}) => {
	const resizeDisplay = (width, height) => {
		if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
		{
			return false
		}

		mainElement.style.setProperty('--width', width)
		mainElement.style.setProperty('--height', height)

		const frameWidth = frameElement?.clientWidth || window.innerWidth || width
		const frameHeight = frameElement?.clientHeight || window.innerHeight || height
		const stageSize = getStageDisplaySize({
			frameWidth,
			frameHeight,
			mediaWidth: width,
			mediaHeight: height,
			flood: getFlood()
		})

		if (stageSize)
		{
			mainElement.style.setProperty('--stage-display-width', `${stageSize.width}px`)
			mainElement.style.setProperty('--stage-display-height', `${stageSize.height}px`)
		}

		getDisplayManager()?.setSize(width, height)
		getOverlayDisplay()?.setSize(width, height)
		return true
	}

	const syncToMedia = (mediaElement) => {
		const { width, height } = getMediaDimensions(mediaElement)
		if (!resizeDisplay(width, height))
		{
			return false
		}
		mainElement.classList.toggle('landscape', width > height)
		mainElement.classList.toggle('portrait', width < height)
		mainElement.classList.toggle('square', width === height)
		return true
	}

	return {
		getMediaDimensions,
		getStageDisplaySize,
		resizeDisplay,
		syncToMedia
	}
}
