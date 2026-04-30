import {updateTempo} from './ui'

const supportsBaseSelect = CSS.supports("appearance", "base-select")

/**
 * Populate a <select> element with options, using the customizable 
 * select (appearance: base-select) when supported by the browser,
 * falling back to classic <option> elements otherwise.
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
		throw Error("populateSelect: No element found")
	}

	const isGrouped = items.length > 0 && items[0].group !== undefined

	if (supportsBaseSelect) {

		select.classList.add('select-content')

		// preserve any existing button or create one
		let button = select.querySelector(':scope > button')
		if (!button) {
			button = document.createElement('button')
			button.type = 'button'
			const selectedcontent = document.createElement('selectedcontent')
			button.appendChild(selectedcontent)
			select.prepend(button)
		}

		// clear everything after the button
		while (button.nextSibling) {
			button.nextSibling.remove()
		}

		const fragment = document.createDocumentFragment()

		if (isGrouped) {
			for (const group of items) {
				const optgroup = document.createElement('optgroup')
				const legend = document.createElement('legend')
				if (group.icon) {
					legend.appendChild(createIcon(group.icon))
				}
				legend.appendChild(document.createTextNode(group.group))
				optgroup.appendChild(legend)
				for (const item of group.items) {
					optgroup.appendChild(createRichOption(item))
				}
				fragment.appendChild(optgroup)
			}
		} else {
			for (const item of items) {
				fragment.appendChild(createRichOption(item))
			}
		}

		select.appendChild(fragment)

	} else {

		// classic fallback — plain <option> elements
		const fragment = document.createDocumentFragment()

		if (isGrouped) {
			for (const group of items) {
				const optgroup = document.createElement('optgroup')
				optgroup.label = group.group
				for (const item of group.items) {
					optgroup.appendChild(createPlainOption(item))
				}
				fragment.appendChild(optgroup)
			}
		} else {
			for (const item of items) {
				fragment.appendChild(createPlainOption(item))
			}
		}

		select.innerHTML = ''
		select.appendChild(fragment)
	}

	return select
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
 * Create a rich <option> with structured content for customizable select.
 * Renders: [icon] [label] [detail]
 * @param {Object} item
 * @returns {HTMLOptionElement}
 */
const createRichOption = ({ value, label, icon, detail, selected, disabled, className }) => {
	const option = document.createElement('option')
	option.value = value
	if (selected) option.selected = true
	if (disabled) option.disabled = true
	if (className) option.className = className

	if (icon) {
		option.appendChild(createIcon(icon))
	}

	const labelSpan = document.createElement('span')
	labelSpan.className = 'option-label'
	labelSpan.textContent = label
	option.appendChild(labelSpan)

	if (detail) {
		const detailSpan = document.createElement('span')
		detailSpan.className = 'option-detail'
		detailSpan.textContent = detail
		option.appendChild(detailSpan)
	}

	return option
}

/**
 * Create a plain <option> for classic select fallback.
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
		throw Error("No element found with that spec")
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

export const connectTempoControls = (callback) => {
	connectSelect('select-tempo', (option)=>{
		const tempo = parseInt( option.value )
		updateTempo(tempo)
		callback && callback (tempo)
	} )
}


import {loadImpulseJSON, DIRS, REVERB_PATHS} from '../audio/effects/reverb'

const path = './assets/audio/acoustics/'	

// Connect the options comand to the JSON files
export const connectReverbControls = (callback) => {

	const ID = 'select-impulse'
	const dirs = DIRS

	const maapped = dirs.map( async (dir) => {
		try {
			const json = await loadImpulseJSON(dir)
			const items = json.map( item => {
				item = item.trim()
				const fileName = item.substring( item.lastIndexOf("/") + 1 )
				const name = fileName.substring(0, fileName.lastIndexOf('.'))
				return { value: item, label: name }
			})
			return { group: dir, items }
		} catch(error) {
			console.error("Couldn't load reverb impulse json", error)
			return null
		}
	})

	Promise.all(maapped).then( groups => {
		const validGroups = groups.filter(Boolean)
		if (validGroups.length) {
			populateSelect(ID, validGroups)
		} else {
			console.error("Injecting impulse FAILED to ", ID)
		}
	})

	return connectSelect( ID, (option)=> callback && callback(option) )
}
