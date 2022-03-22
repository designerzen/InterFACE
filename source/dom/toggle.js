import {setButton} from './button'

/**
 * this allows checkbox use to determine when the variable is changed
 * @param {HTMLElement} toggleName unique toggle name
 * @param {HTMLElement} callback method to call when selected toggle
 * @param {Boolean} value to set toggle to
 * @return {HTMLElement} is now visible 
 */
export const setToggle = (toggleName, callback, value ) => {
	
	const element = setButton( toggleName, ()=>{
		value = !value
		// add classes to any associated wrapped label
		if (element.parentNode.nodeName === "LABEL")
		{
			element.parentNode.classList.toggle("checked", value )
		}
		//element.setAttribute("checked", value)
		callback(value)
	})
	// preset the button
	if (value)
	{
		// goto parent and add checked classes?
		element.setAttribute('checked', value)
		element.parentNode.classList.toggle("checked", value )
	}
	return element
}