import { setTheme, setupThemeControls } from "../theme/theme"

export const setupAccessibilityControls = () => {
	
	const INPUT_NAME_THEMES = "theme"
	const ELEMENT_ACCESSIBILITY_PANEL = "accessibility-panel"
	const elementAccessibilityPanel = document.getElementById(ELEMENT_ACCESSIBILITY_PANEL)
	
	if (!elementAccessibilityPanel)
	{
		throw Error("Accessibility panel #"+ELEMENT_ACCESSIBILITY_PANEL+" was not found in DOM")
	}

	const themeRadioButtons = document.getElementsByName(INPUT_NAME_THEMES)
	const getSelectedValue = () =>{
		const selected = elementAccessibilityPanel.querySelector('input[name="'+INPUT_NAME_THEMES+'"]:checked')
		return selected ? selected.value : null
	}
	
	let abortController

	return {
		show:()=>{
			// get selected	and then set the value if unset...
			const selectedValue = getSelectedValue()
			if (selectedValue)
			{
				
			}

			abortController = new AbortController()
			const signal = abortController.signal
			
			// watch for changes and updates
			themeRadioButtons.forEach(element => {
				element.addEventListener("onchange", event => {
					// change the theme
					setTheme( element.value )
				}, {signal})
			})

			// setup select
			const themeSelector = elementAccessibilityPanel.querySelector("#select-theme-palette")
			setupThemeControls( themeSelector, theme =>{

				console.info("theme", theme )
			} )
			
			// reveal container
			elementAccessibilityPanel.hidden = false
			return true
		},
		hide:()=>{
			if (!abortController)
			{
				return false
			}
			abortController.abort()
			elementAccessibilityPanel.hidden = true
		}
	}	
}