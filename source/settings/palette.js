const PALETTE = {
	white:"hsl(22, 28%, 87%)",
	dark:"hsl(30, 6%, 14%)",
	grey:"hsl(11, 6%, 50%)",
	cream:"hsl(27, 30%, 45%)",
	brown:"hsl(23, 22%, 30%)",
	blue:"hsl(196, 18%, 33%)",
	green:"hsl(56, 18%, 33%)",
	yellow:"hsl(56, 18%, 33%)",
	orange:"hsl(28, 69%, 38%)",
	red:"hsl(9, 58%, 35%)"
}

export const DEFAULT_COLOURS = {
	// 0->hueRange
	hue:90,
	// percentages
	saturation:80,
	// used to create white mode / black mode and greyscale modes
	luminosity:50,
	// 0->360
	hueRange:360,
	// dots hue? still used?
	dots:60,
	mouth:'rgba(255,0,0,0.5)',
	mouthClosed:'rgba(255,0,0,0.2)',
	lipsUpperInner:'pink',
	lipsLowerInner:'pink',
	midwayBetweenEyes:'blue',
	leftEyeLower0:'red',
	rightEyeLower0:'red',
	leftEyeIris:'yellow',
	rightEyeIris:'yellow',
}

// Dami kim special mode
export const DAMI_KIM_COLOURS = { ...DEFAULT_COLOURS }

// Simpler colour scheme
export const PASTEL_COLOURS = { ... DEFAULT_COLOURS }

const REGEX_HSL = /^hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)$/
	
export const fetchBrandColor = ()=> {
	const styles = window.getComputedStyle(document.body)
	const hueBrand = styles.getPropertyValue('--hue-brand')
	const hslBrand = styles.getPropertyValue('--shade-brand')
	// componentsBrand[1] is hue
	const componentsBrand = hslBrand.match(REGEX_HSL)
	return `hsl(${hueBrand},${componentsBrand[3]}%,${componentsBrand[5]}%)`
}

export default PALETTE