/**
 * Just a simple wrapper for the window.title
 */
export default class Title{

	#original = document.title
	#title = document.title

	setTitle(title, loadProgress=-1 ){

		let newTitle = title
		
		if (loadProgress > -1){
			newTitle += " " + Math.ceil(loadProgress * 100) + "%"
		}
		
		if (this.#title !== newTitle) {
			document.title = newTitle
			this.#title = title
		}
	}

	setLoadProgress(loadProgress){
		this.setTitle( this.#original, loadProgress )
	}

	reset(){
		this.#title = document.title = this.#original
	}
}