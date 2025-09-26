export default class VisualiserManager {
	
	loaded = new Promise( (resolve,reject) => this.onLoaded(resolve,reject) )

	constructor(notes, canvas, vertical=false, wave=0) {
		this.notes = notes
		this.canvas = canvas
		this.vertical = vertical
		this.wave = wave
		
		this.load(import("./note-visualiser.js"))
	}

	async load( classPromise ) {	
		
		if (this.visualiser)
		{
			this.visualiser.destroy()
			this.visualiser = null
		}

		const Visualiser = (await classPromise).default	
		this.visualiser = new Visualiser( this.notes, this.canvas, this.vertical )
		
		Promise.resolve( this.loaded )
	}

	// change
	async swap(){

	}
	
    /**
     * Note On
     * @param {Note} note 
     * @param {number} velocity 
     */
    noteOn( note, velocity=1 ){
        this.visualiser && this.visualiser.noteOn(note, velocity)
    }

    /**
     * Note Off
     * @param {Note} note 
     * @param {Number} velocity 
     */
    noteOff( note, velocity=1 ){
		this.visualiser && this.visualiser.noteOff(note, velocity)
    }

	onLoaded(resolve, reject){
		console.info("VisualiserManager loaded", this, this.visualiser)
		resolve( this )
	}
}
