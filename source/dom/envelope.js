/**
 * SVG ADSR envelope
 * simply returns an SVG that has the 
 */

// FIXME: remove console usage for IE compatibility

export default function(elem, conf) {

	// It faster to access a property than to access a variable...
	// See https://jsperf.com/vars-vs-props-speed-comparison/1

	const NS = "http://www.w3.org/2000/svg";

	let svg_element = elem;    // DOM element

	if (typeof elem === "string" || elem instanceof String) {
		elem = document.querySelector(elem);
	}

	if (elem.nodeName.toLowerCase() === "svg") {
		svg_element = elem;
	} else {
		svg_element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		elem.appendChild(svg_element);
	}

	// For the user convenience, the label can be set with the "data-label" attribute.
	// If another label is set in data-config then this later definition will override data-label.
	let label = elem.dataset.label !== undefined ? elem.dataset.label : false;

	//---------------------------------------------------------------------
	// Merge user config with default config:
	let data_config = JSON.parse(svg_element.dataset.config || "{}");
	let config = Object.assign({}, defaults, conf, data_config);


	/**
	 *
	 */
	function draw() {

		// For the use of null argument with setAttributeNS, see https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#Scripting_in_namespaced_XML

		// https://www.w3.org/TR/SVG/render.html#RenderingOrder:
		// Elements in an SVG document fragment have an implicit drawing order, with the first elements in the SVG document
		// fragment getting "painted" first. Subsequent elements are painted on top of previously painted elements.
		// ==> first element -> "painted" first
		const svg_element = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		svg_element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		svg_element.setAttributeNS(null, "viewBox", "0 0 100 100");
		svg_element.setAttributeNS(null, "preserveAspectRatio", "none");
		svg_element.setAttribute("class", "envelope");

		let path = document.createElementNS(NS, "path");
		path.setAttributeNS(null, "d", getPath(env));
		path.setAttribute("vector-effect", "non-scaling-stroke");
		path.setAttribute("stroke", config.env_color);
		path.setAttribute("stroke-width", "" + config.env_width);
		path.setAttribute("fill", "transparent");
		path.setAttribute("class", "envelope-path");
		svg_element.appendChild(path);

	}  // draw()

}

const SVG_NAME_SPACE = "http://www.w3.org/2000/svg";

const DEFAULT_SVG_ENVELOPE_OPTIONS = {
	label: false,
	env_color: "blue",
	env_width: 4,
	with_label: true,
	width_A: 0.25,
	width_D: 0.25,
	width_R: 0.25,
	env: {          // default envelope; structure compatible with BS2.getADSREnv()
		attack: 1,
		decay: 1,
		sustain: 0.5,
		release: 1
	}
}

/**
 * viewBox is (0 0 100 100)
 *
 * env is {attack:0..1, decay:0..1, sustain:0..1, release: 0..1}
 */
const drawPath = (options) => {

	const {
		env_width,
		attack, width_A,
		decay, width_D,
		sustain, 
		release, width_R
	} = options

	options = Obejct.assign( {}, options, DEFAULT_SVG_ENVELOPE_OPTIONS )
	
	let p = ""

	const halfWidth = (env_width / 2)

	// start position
	let x = 0.0
	let y = 0.0
	p += `M${x * 100.0 + halfWidth},${100.0 - y}` // start at lower left corner

	// Attack
	x += attack * width_A
	y = 100.0 - halfWidth
	p += `L${x * 100.0},${100.0 - y}`

	// Decay
	x += decay * config.width_D
	y = sustain * 100.0 - halfWidth
	p += `L${x * 100.0},${100.0 - y + 2}`

	// Sustain
	x = 1.0 - (release * config.width_R)
	y = sustain * 100.0 - halfWidth
	p += `L${x * 100.0},${100.0 - y + 2}`

	// Release
	x = 1.0
	y = halfWidth
	p += `L${x * 100.0 - halfWidth},${100.0 - y + 2}`

	return p
}

export const drawEnvelope = (options) => {

	// https://www.w3.org/TR/SVG/render.html#RenderingOrder:
	// Elements in an SVG document fragment have an implicit drawing order, with the first elements in the SVG document
	// fragment getting "painted" first. Subsequent elements are painted on top of previously painted elements.
	// ==> first element -> "painted" first
	const svg_element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg_element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
	svg_element.setAttributeNS(null, "viewBox", "0 0 100 100")
	svg_element.setAttributeNS(null, "preserveAspectRatio", "none")
	svg_element.setAttribute("class", "envelope")

	const path = document.createElementNS(SVG_NAME_SPACE, "path")
	path.setAttributeNS(null, "d", getPath(options))
	path.setAttribute("vector-effect", "non-scaling-stroke")
	path.setAttribute("stroke", config.env_color)
	path.setAttribute("stroke-width", "" + config.env_width)
	path.setAttribute("fill", "transparent")
	path.setAttribute("class", "envelope-path")
	
	svg_element.appendChild(path)

	return svg_element
}

export const redrawEnevelope = (SVGenvelope, options) => {
	SVGenvelope.childNodes[0].setAttributeNS(null, "d", drawPath(options))
}