/**
 * Make some funky button sounds / sound effects 
 * inspired by ZZFX
 */
// zzfx object with some extra functionalty
export const ZZFX =
{
    // master volume scale
    volume: .3,
    
    // sample rate for audio
    sampleRate: 44100,
    
    // create shared audio context
    x: new (window.AudioContext || webkitAudioContext),

    // play a sound from zzfx paramerters
    play: function(...parameters)
    {
        // build samples and start sound
        return this.playSamples(this.buildSamples(...parameters))
    },

    // play an array of samples
    playSamples: function(...samples)
    {
        // create buffer and source
        const buffer = this.x.createBuffer(samples.length, samples[0].length, this.sampleRate)
        const source = this.x.createBufferSource()

        samples.map((d,i)=> buffer.getChannelData(i).set(d))
        source.buffer = buffer
        source.connect(this.x.destination)
        source.start()
        return source
    },

    // build an array of samples
    buildSamples: function
    (
        volume = 1, 
        randomness = .05,
        frequency = 220,
        attack = 0,
        sustain = 0,
        release = .1,
        shape = 0,
        shapeCurve = 1,
        slide = 0, 
        deltaSlide = 0, 
        pitchJump = 0, 
        pitchJumpTime = 0, 
        repeatTime = 0, 
        noise = 0,
        modulation = 0,
        bitCrush = 0,
        delay = 0,
        sustainVolume = 1,
        decay = 0,
        tremolo = 0
    )
    {
        // init parameters
        const PI2 = Math.PI*2
        let sampleRate = this.sampleRate,
			sign = v => v>0?1:-1,
			startSlide = slide *= 500 * PI2 / sampleRate / sampleRate,
			startFrequency = frequency *= 
				(1 + randomness*2*Math.random() - randomness) * PI2 / sampleRate,
			b=[], t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;

        // scale by sample rate
        attack = attack * sampleRate + 9 // minimum attack to prevent pop
        decay *= sampleRate
        sustain *= sampleRate
        release *= sampleRate
        delay *= sampleRate
        deltaSlide *= 500 * PI2 / sampleRate**3
        modulation *= PI2 / sampleRate
        pitchJump *= PI2 / sampleRate
        pitchJumpTime *= sampleRate
        repeatTime = repeatTime * sampleRate | 0

        // generate waveform
        for(length = attack + decay + sustain + release + delay | 0
            i < length; b[i++] = s)
        {
            if (!(++c%(bitCrush*100|0)))                      // bit crush
            { 
                s = shape? shape>1? shape>2? shape>3?         // wave shape
                    Math.sin((t%PI2)**3) :                    // 4 noise
                    Math.max(Math.min(Math.tan(t),1),-1):     // 3 tan
                    1-(2*t/PI2%2+2)%2:                        // 2 saw
                    1-4*Math.abs(Math.round(t/PI2)-t/PI2):    // 1 triangle
                    Math.sin(t);                              // 0 sin

                s = (repeatTime ?
                        1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime) // tremolo
                        : 1) *
                    sign(s)*(Math.abs(s)**shapeCurve) *       // curve 0=square, 2=pointy
                    volume * this.volume * (                  // envelope
                    i < attack ? i/attack :                   // attack
                    i < attack + decay ?                      // decay
                    1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                    i < attack  + decay + sustain ?           // sustain
                    sustainVolume :                           // sustain volume
                    i < length - delay ?                      // release
                    (length - i - delay)/release *            // release falloff
                    sustainVolume :                           // release volume
                    0);                                       // post release

                s = delay ? s/2 + (delay > i ? 0 :            // delay
                    (i<length-delay? 1 : (length-i)/delay) *  // release delay 
                    b[i-delay|0]/2) : s;                      // sample delay
            }

            f = (frequency += slide += deltaSlide) *          // frequency
                Math.cos(modulation*tm++)                    // modulation
            t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2)     // noise

            if (j && ++j > pitchJumpTime)       // pitch jump
            {
                frequency += pitchJump         // apply pitch jump
                startFrequency += pitchJump    // also apply to start
                j = 0                          // stop pitch jump time
            }

            if (repeatTime && !(++r % repeatTime)) // repeat
            {
                frequency = startFrequency     // reset frequency
                slide = startSlide             // reset slide
                j = j || 1                     // reset pitch jump time
            }
        }

        return b
    },
    
    // get frequency of a musical note on a diatonic scale
    getNote: function(semitoneOffset=0, rootNoteFrequency=440)
    {
        return rootNoteFrequency * 2**(semitoneOffset/12)
    }
}