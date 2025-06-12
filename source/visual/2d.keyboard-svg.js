export default class SVGKeyboard{

	static uniqueID = 0

	active = new Map()
	touches = 0
	keyElements = []
	htmlElement

	firstNoteNumber = 0

	get isTouching(){
		return this.touches > 0
	}

	get svg(){
		return this.svgString
	}

	get asElement(){
		return this.htmlElement
	}

	constructor( keys, noteOn, noteOff ){
		const unique = `keyboard-${SVGKeyboard.uniqueID++}`
		this.titleID = `${unique}-title`
		this.descriptionID = `${unique}-desc`
		const {svg, whiteKeyElements, blackKeyElements} = this.createKeyboard(keys)
		this.htmlElement = document.createElement("div")
		this.htmlElement.classNames = "piano"
		this.htmlElement.innerHTML = svg
		this.keyElements = Array.from(this.htmlElement.querySelectorAll(".piano-key"))
		this.firstNoteNumber = keys[0].noteNumber
		this.svgString = svg
		this.addInteractivity( this.keyElements, noteOn, noteOff)
	}

	/**
	 * Add interactivity to the keyboard and wire these
	 * to the noteOn and noteOff functions provided
	 * @param {Function} noteOn 
	 * @param {Function} noteOff 
	 */
	addInteractivity( keys, noteOn, noteOff ){
		
		if(!keys)
		{
			throw Error("No keys provided to add interactivity to")
		}

	
		keys.forEach( (button, i) => {

			const noteNumber = parseInt( button.getAttribute("data-attribute-number") )
			//const noteName = button.getAttribute("data-attribute-note")
			const indicator = document.querySelector(`.indicator[data-attribute-number="${noteNumber}"]`)

			const toggleIndicator = (active)=>{
				indicator?.classList?.toggle("active", active)
			}

			const onPianoInteractionStarting = (event) => {
					
				if (
					event instanceof KeyboardEvent &&
					event.key !== "Enter" &&
					event.key !== " "
				) {
					return
				}

				if (event.preventDefault)
				{
					event.preventDefault()
				}
		
				const id = event.pointerId ?? 0
				const pressure = event.pressure ?? 1
				
				// console.info("REQUEST START", {note, noteName, GENERAL_MIDI_INSTRUMENTS})
				const starting = noteOn(noteNumber, pressure, id)
				this.active.set( button, noteNumber )
				this.touches++

				starting & toggleIndicator(true)
				
				document.addEventListener("pointerleave", onInterationComplete, false)
				document.addEventListener("pointerup", onInterationComplete, false)
				document.addEventListener("pointercancel", onInterationComplete, false)
			}
		
			const onInterationComplete = (event) => {
				if (event.preventDefault)
				{
					event.preventDefault()
				}
		
				const id = event.pointerId ?? 0
				document.removeEventListener("pointerleave", onInterationComplete)
				document.removeEventListener("pointerup", onInterationComplete)
				document.removeEventListener("pointercancel", onInterationComplete)
				
				// const noteNumber = this.active.get( button )
				// const note = convertNoteNameToMIDINoteNumber(noteName)
				// console.info("REQUEST END", {previousNote,note})
				this.touches--

				noteOff(noteNumber,1,id)
				toggleIndicator(false)
				this.active.delete( button )
			}
		
			button.addEventListener("pointerdown", onPianoInteractionStarting, false) 
			
			// if the user has finger down but they change keys...
			button.addEventListener("pointerenter", event => {
				
				if (event.preventDefault)
				{
					event.preventDefault()
				}
		
				const id = event.pointerId ?? 0
				// already interacting so update existing
				if (this.isTouching)
				{	
					// console.info("REQUEST CHANGE", {note, noteName,GENERAL_MIDI_INSTRUMENTS})
					// pitch bend!
					noteOn(noteNumber, 1, id)
					toggleIndicator(true)
					this.active.set( button, noteNumber )
				}else{
					// console.warn("REQUEST CHANGE IGNORED")
				}
			})
		
			button.addEventListener("pointerleave", event => {
				if (event.preventDefault)
				{
					event.preventDefault()
				}
				const id = event.pointerId ?? 0
				noteOff(noteNumber, 1, id)
				toggleIndicator( false )
				this.active.delete( button )
			})
		})
	}

	createBlackKey( key, x, y, r=1.5, width=13, height=80 ){
		return `<rect 
					x="${x}" 
					y="${y}" 
					rx="${r}" 
					class="piano-key piano-key-black" 
					width="${width}" height="${height}" 
					title="${key.noteName}" 
					data-attribute-note="${key.noteName}" 
					data-attribute-number="${key.noteNumber}" 
					data-attribute-frequency="${key.frequency}"
					data-attribute-octave="${key.octave}"
					>
				</rect>`
	}
	
	createBlackKeyElement(x, y, r=1.5){
		const key = document.createElement("rect")
		key.classList.add("piano-key","piano-key-black")
		key.setAttribute("x", x)
		key.setAttribute("y", y)
		key.setAttribute("rx", r)
		key.setAttribute("width", width)
		key.setAttribute("height", height)
		key.setAttribute("data-attribute-note", key.noteName )
		key.setAttribute("data-attribute-number", key.noteNumber)
		key.setAttribute("data-attribute-frequency", key.frequency)
		key.setAttribute("data-attribute-octave", key.octave)
		return key
	}

	createWhiteKey( key, x, y, r=1.5, width=23, height=120 ){
		return `<rect 
					x="${x}" 
					y="${y}" 
					rx="${r}" 
					class="piano-key piano-key-white" 
					width="${width}" height="${height}" 
					title="${key.noteName}" 
					data-attribute-note="${key.noteName}" 
					data-attribute-number="${key.noteNumber}" 
					data-attribute-frequency="${key.frequency}"
					data-attribute-octave="${key.octave}"
					>
				</rect>`
	}
	
	/**
	 * 
	 * @param {Object} key 
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} r 
	 * @returns 
	 */
	createIndicator( key, x, y, r=5.7 ){
		return `<circle 
					cx="${x}" 
					cy="${y}" 
					r="${r}" 
					class="piano-note-indicator" 
					data-attribute-note="${key.noteName}" 
					data-attribute-number="${key.noteNumber}" 
					data-attribute-frequency="${key.frequency}"
					data-attribute-octave="${key.octave}"
					>
				</circle>`
	}
	
	/*
	createWhiteKeyElement(x, y, r=1.5){
		const key = document.createElement("rect")
		key.classList.add("piano-key")
		key.classList.add("piano-key-black")
		key.setAttribute("x", x)
		key.setAttribute("y", y)
		key.setAttribute("width", 23)
		key.setAttribute("height", 120)
		key.setAttribute("data-attribute-note", "A#0")
		key.setAttribute("data-attribute-number", 0)
		key.setAttribute("rx", r)
		return key
	}
	*/

	/**
	 * Create an SVG keyboard
	 * @param {Array} keys 
	 * @param {Number} blackKeyWidth 
	 * @param {Number} whiteKeyWidth 
	 * @returns {SVG}
	 */
	createKeyboard( keys, blackKeyWidth=13, whiteKeyWidth=23, indicatorWidth=8, blackKeyScale=0.5, whiteKeyHeight=140 ){

		let x = 0
		let y = 20

		const curvedRadius = 2
		const halfWhiteKeyWidth = whiteKeyWidth / 2
		const halfBlackKeyWidth = blackKeyWidth / 2
		const halfIndicatorWidth = indicatorWidth / 2
		const indicatorRadius = halfIndicatorWidth
		const spaceBetweenIndicators = whiteKeyWidth - indicatorWidth
		const blackKeyHeight = whiteKeyHeight * blackKeyScale
		const totalHeight = whiteKeyHeight
		
		// rescaled by SVG - just for proportion
		let totalWidth = 0 // 1197.8
		
		// Keys as strings
		const indicatorElements = []
		const whiteKeyElements = []
		const blackKeyElements = []
		const keyElements = keys.map( (key,index)=>{
			
			const isBlack = key.accidental ?? false
			
			// if the key is a black key, we move back
			// x -= isBlack ? blackKeyWidth : 0
			x -= isBlack ? halfBlackKeyWidth : 0
		
			const keyElement = isBlack ?
							this.createBlackKey(key, x, y, curvedRadius, blackKeyWidth, blackKeyHeight) :
							this.createWhiteKey(key, x, y, curvedRadius, whiteKeyWidth, whiteKeyHeight )
			
			const keyQuantity = isBlack ?
			 				blackKeyElements.push( keyElement ) :
			 				whiteKeyElements.push( keyElement )
			
			
			const indicatorOffsetX = isBlack ? halfBlackKeyWidth : halfWhiteKeyWidth
			const indicator = this.createIndicator(key, x + indicatorRadius + indicatorOffsetX / 2, indicatorRadius, indicatorRadius )
			indicatorElements.push(indicator)

			//x += whiteKeyWidth
			x += isBlack ? halfBlackKeyWidth : whiteKeyWidth
			// x += isBlack ? -halfBlackKeyWidth  : whiteKeyWidth
			
			// only white keys affect toal width
			totalWidth += isBlack ? 0 : whiteKeyWidth

			return keyElement
		})

		// Indicators
		x = 0 // spaceBetweenIndicators / 2
		y = indicatorRadius

		// const indicatorElements = keys.map( (key,index)=>{
		// 	const indicator = this.createIndicator(key, x, y, indicatorRadius )
		// 	x += spaceBetweenIndicators
		// 	return indicator
		// })

		const keyboard =   `<g class="piano-key-notes piano-keys-white">${whiteKeyElements.join("")}</g>
							<g class="piano-key-notes piano-keys-black">${blackKeyElements.join("")}</g>`

		const indicators = `<g class="piano-key-indicators">${indicatorElements.join("")}</g>`
		
		const svg = `<svg 
					xmlns="http://www.w3.org/2000/svg" 
					class="piano-keys" 
					viewBox="0 0 ${totalWidth} ${totalHeight}" 
					aria-labelledby="${this.titleID} ${this.descriptionID}"
					draggable="false">
					<title id="${this.titleID}">Piano Keyboard with ${keys.length} keys</title>
					<desc id="${this.descriptionID}">Interactive Piano Keyboard with ${keys.length} keys</desc>
					${keyboard}
					${indicators}
				</svg>`

		return {svg, keyElements, whiteKeyElements, blackKeyElements}
	}

	/**
	 * 
	 * @param {Number} noteNumber 
	 */
	setKeyAsActive( noteNumber ){
		const keys = this.htmlElement.querySelectorAll('[data-attribute-number="'+noteNumber+'"]')
		// const key = this.keyElements[noteNumber - this.firstNoteNumber]
		
		if (keys && keys.length > 0)
		{
			keys.forEach( key => key.classList.toggle("active", true) )
		}else{
			console.warn("Key "+noteNumber+" not found")
		}
	}

	/**
	 * 
	 * @param {Number} noteNumber 
	 */
	setKeyAsInactive( noteNumber ){
		const keys = this.htmlElement.querySelectorAll('[data-attribute-number="'+noteNumber+'"]')
		// const key = this.keyElements[noteNumber - this.firstNoteNumber]
		if (keys && keys.length > 0)
		{
			keys.forEach( key => key.classList.toggle("active", false) )
		}else{
			console.warn("Key "+noteNumber+" not found", {noteNumber} )
		}
	}
}