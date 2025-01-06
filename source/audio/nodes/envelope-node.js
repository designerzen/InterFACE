/**
 * REALTIME Envelope is a type of time activate gain node
 * that shapes the gain of the audio signal over time
 * based on the current time and the duration of the note
 * and then the classic ADSR shape
 */

const DEFAULT_ENVELOPE_OPTIONS = {
	attack:0.001,
	decay:0.1,
	sustain:0.5,
	release:0.1,
    gain:1
}

export default class EnvelopeNode extends GainNode{

    attack
    decay
    sustain
    release
	
    constructor( audioContext, options=DEFAULT_ENVELOPE_OPTIONS ){
		options = { ...DEFAULT_ENVELOPE_OPTIONS, ...options }
        super(audioContext, options)
        this.attack = options.attack
        this.decay = options.decay
        this.sustain = options.sustain
        this.release = options.release
        // NB. handled in super options
        // this.gain.value = options.gain
	}

    on( now=null, volume=1 ){
        now = now ?? this.context.currentTime
        // start on silent
        // this.gain.setValueAtTime(0, this.context.currentTime)
        
        // ATTACK
        // this.gain.exponentialRampToValueAtTime(1, this.context.currentTime + this.attack )
        this.gain.linearRampToValueAtTime(volume, now + this.attack )
        
        // DECAY to SUSTAIN
        // this.gain.exponentialRampToValueAtTime(this.sustain, this.context.currentTime + this.attack + this.decay )
        this.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay )
    }

    off( now=null, endVolume=0 ){
        now = now ?? this.context.currentTime
        // RELEASE to silence
        // this.gain.exponentialRampToValueAtTime(0, now + this.release )
        this.gain.linearRampToValueAtTime(endVolume, now + this.release )
    }

    // start(){
    //     const now = this.context.currentTime
    //     this.on(now)
    //     this.off(now + this.attack + this.decay)
    // }
}