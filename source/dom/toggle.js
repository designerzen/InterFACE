import {setButton} from './button'

////////////////////////////////////////////////////////////////////
// this allows checkbox use where the variable is changed
////////////////////////////////////////////////////////////////////
export const setToggle = (toggleName, callback, value ) => {
	
	const element = setButton( toggleName, ()=>{
		value = !value
		// add classes to any associated wrapped label
		if (element.parentNode.nodeName === "LABEL")
		{
			element.parentNode.classList.toggle("checked", value )
		}
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