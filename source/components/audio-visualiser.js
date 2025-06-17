/**
 * Classic audio waveform visualiser
 */

const DEFAULT_OPTIONS = {
    backgroundColour:false,
    lineColour:false, //"rgb(255, 0, 0)",
    lineWidth:3,
    fftSize: 512    // 2048
}

export default class AudioVisualiser{

    options
    ctx
    canvas
    width
    height

    analyser

    bufferLength
    dataArray 

    count = 0
    alpha = 256

    isTimeDomain = false

    set colour(value){
        this.options.lineColour = value
        this.count = 0
    }

    constructor( canvasContext, audioContext, inputAudioNode, options=DEFAULT_OPTIONS ){
        
        this.options = { ...DEFAULT_OPTIONS,...options }
        this.ctx = canvasContext
        this.canvas = canvasContext.canvas

        this.width = canvasContext.canvas.width
        this.height = canvasContext.canvas.height
        this.verticalCentre = this.height / 2

        this.analyser = audioContext.createAnalyser()

        this.analyser.fftSize = this.options.fftSize
        // frequencyBinCount = fftSize / 2
        this.bufferLength = this.analyser.frequencyBinCount

        // startIndex = startFrequency / frequencyPerBin
        // endIndex = endFrequency / frequencyPerBin

        // frequencyPerBin = 44100 / 2 * 1024 = 44100 / 2048 ≈ 21.53 Hz per bin
        this.dataArray = new Uint8Array(this.bufferLength)

        // data for drawing to screen
        // this.path = new Path2D()

        // connect input to analyser
        inputAudioNode.connect( this.analyser )
        this.analyser.connect( audioContext.destination )
    }

    /**
     * For bar charts
     * @returns Array<UInt8>
     */
    fetchFrequencyData(){
        this.analyser.getByteFrequencyData( this.dataArray )
        return this.dataArray
    }

    /**
     * For waveforms
     * @returns Array<UInt8>
     */
    fetchByteTimeDomainData(){
        this.analyser.getByteTimeDomainData( this.dataArray )
        return this.dataArray
    }

    /**
     * clear the canvas of all data
     * @param {Number|Boolean} backgroundColour 
     */
    clear( backgroundColour="rgb(0,0,0)" ){
        if (backgroundColour)
        {
            this.ctx.fillStyle = backgroundColour
            this.ctx.fillRect(0, 0, this.width, this.height)
        }else{
            this.ctx.clearRect(0, 0, this.width, this.height)
        }
    }

    /**
     * Call every frame to show an animated waveform!
     */
    drawWaveform(){

        const sliceWidth = this.width / this.bufferLength
       
        this.path = new Path2D()

        let x = 0
        
        // const h = (this.height / 2)
        this.fetchByteTimeDomainData()

        this.count = (this.count + 1) % 4096

        let volume = 0

        // console.info("updating visualiser", this.dataArray)
        for (let i=0; i<this.bufferLength; ++i)
        {
            const band = this.dataArray[i]

            // Remap 0 -> 128 to 0 -> 1
            const ratio = band / 128
            const y = ratio * this.verticalCentre   // this is just a factor to reduce for clipping
          
            if (i === 0) {
                this.path.moveTo(x, y)
            } else {
                this.path.lineTo(x, y)
            }
            x += sliceWidth
            volume += ratio
        }

        // console.log(volume)

        // close
        // this.path.lineTo(this.width, this.height)

        // paint
        this.clear( this.options.backgroundColour )
         
        // choose colour and size
        this.ctx.lineWidth = this.options.lineWidth

        // SILENCE?
        if ( volume === 256 )
        {
            // cycle colours
            this.ctx.strokeStyle = `hsla(${this.count%256}, 90%, 20%, ${ Math.max( 0, this.alpha / 256) })`
            this.alpha -= 16
            
        }else{

            this.alpha = 256
            this.ctx.strokeStyle = this.options.lineColour
        }
        
        this.ctx.stroke(this.path)
    }

    /**
     * 
     */
    drawBarChart(){
        this.fetchFrequencyData()
    }

    /**
     * Handy public method
     */
    draw(){
        if (this.isTimeDomain)
        {
            this.drawBarChart()
        }else{
            this.drawWaveform()
        }
    }
}