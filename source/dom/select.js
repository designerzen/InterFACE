/**
 * Populate a <select> element with options. Icons and details are only painted
 * by the customizable select (appearance: base-select), other browsers show the
 * text of the same options. Selects with data-native-select get text only.
 *
 * @param {HTMLSelectElement|string} element - Select element or its ID
 * @param {Array} items - Flat array or grouped array of item objects
 * @returns {HTMLSelectElement} The populated select element
 * 
 * Item shape:
 * {
 *   value:    string,           // required - option value
 *   label:    string,           // required - display text
 *   icon:     string,           // optional - emoji, image URL, or inline SVG string
 *   detail:   string,           // optional - secondary text (e.g. "BPM", "48kHz")
 *   selected: boolean,          // optional - pre-selected state
 *   disabled: boolean,          // optional - disabled state
 *   className: string,          // optional - custom CSS class on the <option>
 * }
 * 
 * Grouped shape:
 * {
 *   group: string,              // group legend text
 *   icon:  string,              // optional - icon for the group legend
 *   items: Array<Item>          // array of item objects
 * }
 * 
 * @example Flat items (camera)
 * populateSelect('select-camera', [
 *   { value: 'abc123', label: 'Front Camera', icon: '📷' },
 *   { value: 'def456', label: 'Back Camera', icon: '📷' }
 * ])
 * 
 * @example Grouped items with detail text (tempo)
 * populateSelect('select-tempo', [
 *   { group: 'Slow', items: [
 *     { value: '60', label: '60', detail: 'BPM' },
 *     { value: '75', label: '75', detail: 'BPM' }
 *   ]},
 *   { group: 'Fast', items: [
 *     { value: '140', label: '140', detail: 'BPM' }
 *   ]}
 * ])
 * 
 * @example Items with image icons (theme)
 * populateSelect('select-theme', [
 *   { value: 'theme-neon', label: 'Neon', icon: './assets/icons/neon.svg' },
 *   { value: 'theme-pastel', label: 'Pastel', icon: '🎨' }
 * ])
 * 
 * @example Items with disabled option
 * populateSelect('select-eyes', [
 *   { value: 'none', label: 'Disabled', detail: 'no eyes', disabled: true },
 *   { value: 'googly', label: 'Googly Eyes', icon: '👀' }
 * ])
 */
export const populateSelect = (element, items) => {

	const select = typeof element === "string" ? document.getElementById(element) : element

	if (!select) {
		return null
	}

	const isGrouped = items.length > 0 && items[0].group !== undefined
	const isRich = !select.hasAttribute('data-native-select')
	const createOption = isRich ? createRichOption : createPlainOption

	// control panel tiles paint their own caption so never show the selected option
	const existingButton = select.querySelector(':scope > button')
	const showsSelected = isRich && !existingButton && !select.matches('.controls label select')
	const button = showsSelected ? createSelectedContentButton() : existingButton

	const fragment = document.createDocumentFragment()
	if (button) {
		fragment.appendChild(button)
	}

	if (isGrouped) {
		for (const group of items) {
			const optgroup = document.createElement('optgroup')
			optgroup.label = group.group
			if (isRich) {
				optgroup.appendChild(createLegend(group.group, group.icon))
			}
			for (const item of group.items) {
				optgroup.appendChild(createOption(item))
			}
			fragment.appendChild(optgroup)
		}
	} else {
		for (const item of items) {
			fragment.appendChild(createOption(item))
		}
	}

	select.replaceChildren(fragment)

	return select
}

/**
 * Build the rich content of options written in markup. Parcel's HTML parser
 * strips any elements inside <option> and <optgroup>, so the markup carries
 * data-icon, data-swatch and data-detail and the elements are made here.
 *
 * @param {HTMLSelectElement} select
 * @returns {HTMLSelectElement}
 */
export const enhanceSelect = (select) => {
	if (select.hasAttribute('data-native-select')) {
		return select
	}

	for (const optgroup of select.querySelectorAll('optgroup[data-icon]')) {
		if (!optgroup.querySelector(':scope > legend')) {
			optgroup.prepend(createLegend(optgroup.label, optgroup.dataset.icon))
		}
	}

	for (const option of select.querySelectorAll('option:is([data-icon], [data-swatch], [data-detail])')) {
		if (option.querySelector('.option-label')) {
			continue
		}
		const label = option.textContent.trim()
		option.replaceChildren()
		fillRichOption(option, { label, ...option.dataset })
	}

	return select
}

/**
 * Enhance every select inside an element
 * @param {ParentNode} [root]
 */
export const enhanceSelects = (root = document) => {
	root.querySelectorAll('select').forEach(enhanceSelect)
}

/**
 * Create the trigger that mirrors the selected option's markup
 * @returns {HTMLButtonElement}
 */
const createSelectedContentButton = () => {
	const button = document.createElement('button')
	button.type = 'button'
	button.appendChild(document.createElement('selectedcontent'))
	return button
}

/**
 * Determine if a string is an image URL rather than emoji or inline SVG
 * @param {string} icon
 * @returns {boolean}
 */
const isImageURL = (icon) => /\.(svg|png|jpg|jpeg|gif|webp|avif)(\?|#|$)/i.test(icon) || icon.startsWith('data:image')

/**
 * Create an icon element from a string — handles emoji, image URLs, and inline SVG
 * @param {string} icon - Emoji character, image URL, or raw SVG markup
 * @returns {HTMLElement}
 */
const createIcon = (icon) => {
	if (isImageURL(icon)) {
		const img = document.createElement('img')
		img.src = icon
		img.alt = ''
		img.setAttribute('aria-hidden', 'true')
		img.className = 'option-icon'
		return img
	}
	// emoji or inline SVG text
	const span = document.createElement('span')
	span.className = 'option-icon'
	span.setAttribute('aria-hidden', 'true')
	span.innerHTML = icon
	return span
}

/**
 * Create a round colour chip in place of an icon
 * @param {string} colour - Any CSS background, gradients included
 * @returns {HTMLSpanElement}
 */
const createSwatch = (colour) => {
	const span = document.createElement('span')
	span.className = 'option-icon option-swatch'
	span.setAttribute('aria-hidden', 'true')
	span.style.setProperty('--swatch', colour)
	return span
}

/**
 * Create the heading of an <optgroup>
 * @param {string} text
 * @param {string} [icon]
 * @returns {HTMLLegendElement}
 */
const createLegend = (text, icon) => {
	const legend = document.createElement('legend')
	if (icon) {
		legend.appendChild(createIcon(icon))
	}
	legend.appendChild(document.createTextNode(text))
	return legend
}

/**
 * Create a rich <option> with structured content for customizable select.
 * Renders: [icon] [label] [detail]
 * @param {Object} item
 * @returns {HTMLOptionElement}
 */
const createRichOption = ({ value, label, icon, swatch, detail, selected, disabled, className }) => {
	const option = document.createElement('option')
	option.value = value
	if (selected) option.selected = true
	if (disabled) option.disabled = true
	if (className) option.className = className
	return fillRichOption(option, { label, icon, swatch, detail })
}

/**
 * Fill an <option> with [icon] [label] [detail] markup
 * @param {HTMLOptionElement} option
 * @param {Object} content - label, plus optional icon, swatch colour and detail
 * @returns {HTMLOptionElement}
 */
const fillRichOption = (option, { label, icon, swatch, detail }) => {
	if (swatch) {
		option.appendChild(createSwatch(swatch))
	} else if (icon) {
		option.appendChild(createIcon(icon))
	}

	const labelSpan = document.createElement('span')
	labelSpan.className = 'option-label'
	labelSpan.textContent = label
	option.appendChild(labelSpan)

	if (detail) {
		// keeps the words apart when a browser only shows the option's text
		option.appendChild(document.createTextNode(' '))
		const detailSpan = document.createElement('span')
		detailSpan.className = 'option-detail'
		detailSpan.textContent = detail
		option.appendChild(detailSpan)
	}

	return option
}

/**
 * Create a plain <option> for data-native-select elements.
 * Concatenates label + detail as text since classic options are text-only.
 * @param {Object} item
 * @returns {HTMLOptionElement}
 */
const createPlainOption = ({ value, label, detail, selected, disabled }) => {
	const option = document.createElement('option')
	option.value = value
	option.textContent = detail ? `${label} ${detail}` : label
	if (selected) option.selected = true
	if (disabled) option.disabled = true
	return option
}

export const connectSelect = (element,callback) => {
	const select = typeof element === "string" ? document.getElementById(element) : element
	
	if (!select){
		return null
	}
	// select.addEventListener( 'change', event=>{
	select.onchange = event =>{
		//const selection = select.options.selectedIndex
		// const option = select.childNodes[selection]
		const option = select.options[select.selectedIndex || select.options.selectedIndex] 
		callback && callback (option)
		console.info("selected", option)
		event.preventDefault()
	}

	return select
}

export const connectPaletteSelector = (callback) => connectSelect('select-palette', callback )
export const connectReverbSelector = (callback) => connectSelect('select-impulse', callback )




import {loadImpulseJSON, DIRS} from '../audio/effects/reverb'
import {REVERB_SPACES, isReverbImpulseFile} from '../audio/effects/reverb-spaces.js'

const IMPULSE_GROUP_LABELS = { 'EMT140-Plate':'All plates (EMT 140)', 'Voxengo':'All rooms (Voxengo)' }
const titleCase = text => text.replace(/[_-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())

// Curated spaces first, every usable impulse file after them
export const connectReverbControls = (callback, {onPopulated}={}) => {

	const ID = 'select-impulse'
	const select = document.getElementById(ID)
	if (!select)
	{
		return null
	}

	const curated = { group:'Spaces', items:REVERB_SPACES.map(space => ({ value:space.id, label:space.label })) }
	const files = DIRS.map( async (dir) => {
		try {
			const json = await loadImpulseJSON(dir)
			const items = json.map( item => item.trim() ).filter(isReverbImpulseFile).map( item => {
				const fileName = item.substring( item.lastIndexOf("/") + 1 )
				return { value: item, label: titleCase(fileName.substring(0, fileName.lastIndexOf('.'))) }
			})
			return { group: IMPULSE_GROUP_LABELS[dir] ?? dir, items }
		} catch(error) {
			console.error("Couldn't load reverb impulse json", error)
			return null
		}
	})

	Promise.all(files).then( groups => {
		populateSelect(select, [curated, ...groups.filter(Boolean)])
		onPopulated?.()
	})

	return connectSelect(select, option => callback && callback(option))
}
