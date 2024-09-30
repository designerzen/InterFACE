/**
 * nav.circular-menu
	
	button(type=button).open-menu Open Menu
	menu
		button(type=button) Up
		button(type=button) Right
		button(type=button) Down
		button(type=button) Left

 */
export const createRadialMenu = () => {

	const DISTANCE = 10
	const DURATION = 500

	const TO_RADIANS = 180 / Math.PI

	let coords = {x:0, y:0}
	let mouseDownAt = -1
	let mouseDown = false

	const circularMenu = document.querySelector("nav.circular-menu")
	const buttonsOpenMenu = circularMenu.querySelectorAll("button.open-menu")
	const buttonsSwipe = circularMenu.querySelectorAll("menu > button")
				
	circularMenu.setAttribute("style", `--duration:${DURATION}; --trigger:${DISTANCE};` )

	buttonsSwipe.forEach( button => {
		
		button.addEventListener( "mouseup", e => {
			const direction = e.target.innerText 
			console.error("MOUSE UP > SWIPE!", direction )
		})
		button.addEventListener( "touchend", e => {
			console.error("FINGER UP SWIPE!", e)
		})
	})

	buttonsOpenMenu.forEach( button => {
		
		const onMouseDown = function(e){
			
			let elapsed = 0
			let progress = 0
			
			mouseDown = true
			mouseDownAt = Date.now()
			circularMenu.classList.toggle( "mouse-down", true )
		
			// record initial mouse coords
			coords.x = e.clientX
			coords.y = e.clientY
			
			const onMouseLongPressed = function(event, elapsed) {
				
				circularMenu.classList.toggle( "mouse-held", true )
				console.log("LONG Mouse press", elapsed)
			}
			
			// will self call until mouse *has* bee held
			const onMouseHeld = function(event){
				if (mouseDown){
					elapsed = Date.now() - mouseDownAt
					progress = elapsed / DURATION
					if (progress >= 1){
						requestAnimationFrame( ()=> onMouseLongPressed(event, elapsed) )
						return true
					}else{
						// TODO: Update size of internal 
						//console.log(progress, "Mouse progressing", elapsed )
						requestAnimationFrame( () => onMouseHeld(event) )
						return false
					}
				}
			}
			
			const onMouseMove = function(event){
				const horizontal = event.clientX - coords.x
				const vertical =  event.clientY - coords.y
				const angle = (Math.atan2(vertical, horizontal)) * TO_RADIANS
				
				requestAnimationFrame( ()=>{
					circularMenu.setAttribute( "style", `--angle:${angle};--duration:${DURATION}; --trigger:${DISTANCE};`  )
				})
				
				return {
					vertical, horizontal, angle
				}
			}
			
			const checkSwipe = function(vertical, horizontal, angle, elapsed){
				// we can also send out a swipe if conditions are met on release
				const swipedLeft = horizontal < -DISTANCE
				const swipedRight = horizontal > DISTANCE
				const swipedUp = vertical < -DISTANCE
				const swipedDown = vertical > DISTANCE
				if (swipedLeft||swipedRight||swipedUp||swipedDown){
					
				}
				
				console.log("Mouse", {horizontal, vertical, elapsed, swipedLeft, swipedRight, swipedUp, swipedDown } )
				// const {swipedLeft,swipedRight, swipedUp, swipedDown }
			}
			
			const onMouseUp = function(event){
				elapsed = Date.now() - mouseDownAt
				
				const {vertical, horizontal, angle} = onMouseMove(event)
				const wasMouseHeld = onMouseHeld()
				const swipe = checkSwipe(vertical, horizontal, angle, elapsed)
				
				// reset variables
				mouseDown = false
				mouseDownAt = -1
				coords.x = 0
				coords.y = 0
				
				// remove listeners
				document.removeEventListener("mousemove", onMouseMove )
				document.removeEventListener("touchmove",onMouseMove )
				document.removeEventListener("mouseup", onMouseUp )
				document.removeEventListener("touchend", onMouseUp )
				
				// update GUI at first opportunity
				requestAnimationFrame( ()=>{
					circularMenu.classList.toggle( "mouse-down", false )
					circularMenu.classList.toggle( "mouse-held", false )
				} )
			}
			
			// start animating the inner "latch" animation
			if (mouseDown){
				requestAnimationFrame( onMouseHeld )
			}
			
			
			document.addEventListener("touchmove",onMouseMove)
			document.addEventListener("mousemove",onMouseMove)
			
			document.addEventListener("mouseup", onMouseUp, {once:true})
			document.addEventListener("touchend", onMouseUp, {once:true})
		}
		
		button.addEventListener( "mousedown", onMouseDown)
		button.addEventListener( "touchstart", onMouseDown)
	})

}
