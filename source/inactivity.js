
const TIME_OUT = 4000

const interact = ( activityElement, onActive, onInactive, timeOut=TIME_OUT ) => {

	let isUserActive = true
	let isUserBusy = true
	let interval

	// after a period of inactivity...
	activityElement.addEventListener("mousemove", (event) => {  
		
		clearInterval( interval )

		if (!isUserBusy)
		{
			isUserBusy = true
			onActive && onActive()
			return
		}
		
		interval = setTimeout( ()=>{
			isUserBusy = false
			onInactive && onInactive()
		}, timeOut )
		
	}, false)

	activityElement.addEventListener("mouseout", (event) => {  
		clearInterval( interval )
	}, false)

	document.addEventListener("mouseenter", (event) => {  

		clearInterval( interval )
		if (isUserActive)
		{
			return
		}
		isUserActive = true
		//console.error("user active again")
		onActive && onActive()
	}, false)

	document.addEventListener("mouseleave", (event) => {  
		clearInterval( interval )
		if (isUserActive && (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))) 
		{  
			// outside
			isUserActive = false
			//console.error("user inactive")
			onInactive && onInactive()
		}  
	}, false)

	
	// NB. can trigger multiple times
	document.addEventListener("visibilitychange", e => {
		clearInterval( interval )
		document.documentElement.classList.toggle("tab-hidden", document.hidden)
		if (document.hidden){
			isUserActive = false	
			onInactive && onInactive()
		}else{
			onActive && onActive()
		}
	}, false)

	onActive && onActive()
 }
	
 export default interact