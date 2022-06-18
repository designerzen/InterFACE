// Only one instance of this timing class is allowed
// but it is designed as such to allow for complex rythmns to 
// be created as well as very basic events such as metronomes.
// this is the basis for "Transport"

// import TimeSignature from "@tonaljs/time-signature"
// TimeSignature.names()

// MicrosPerPPQN = MicroTempo/TimeBase
// PPQNPerMIDIClock = TimeBase/24
// MicrosPerSubFrame = 1000000 * Frames * SubFrames
// SubFramesPerQuarterNote = MicroTempo/(Frames * SubFrames)
// SubFramesPerPPQN = SubFramesPerQuarterNote/TimeBase
// MicrosPerPPQN = SubFramesPerPPQN * Frames * SubFrames

export const CMD_START = "start"
export const CMD_STOP  = "stop"
export const CMD_UPDATE  = "update"

export const EVENT_READY = "ready"
export const EVENT_STARTING = "starting"
export const EVENT_STOPPING = "stopping"
export const EVENT_TICK = "tick"

export const MAX_BARS_ALLOWED = 32

const DIVISIONS = 4

const AudioContext = window.AudioContext || window.webkitAudioContext

let startTime = -1
let period = 100
let audioContext = null
let isRunning = false
let isCompatible = true

// for time formatting...
let bar = 0
let bars = 16
let barsElapsed = 0

// There are 16 quarter notes in a note
let divisionsElapsed = 0

// NB. https://bugzilla.mozilla.org/show_bug.cgi?id=1203382
//      FF does not allow raf so use setimeout is preffered
let timingWorker
try{

	timingWorker = new Worker(
        new URL('./timing.settimeout.worker.js', import.meta.url),
        {type: 'module'}
    )
		
	// FIX: Safarai does *not* allow inline Workers so we have to use blob
	// const url = `data:text/javascript;charset=utf-8,${encodeURIComponent(js)}`;
	// return url;
	// if (forceDataUri) {
	//     const url = `data:text/javascript;charset=utf-8,${encodeURIComponent(js)}`;
	//     return url;
	// }
	// const blob = new Blob([js], { type: 'application/javascript' });
	// return URL.createObjectURL(blob);

}catch(error){
    isCompatible = false
}

/**
 * Can we use this timing method on this device?
 * @returns {Boolean} is the worker available and compatable
 */
export const isAvailable = () => isCompatible

/**
 * Accurate time in milliseconds
 * @returns {Number} The current time as of now
 */
export const now = () => audioContext.currentTime

/**
 * Amount of time elapsed since startTimer() in seconds
 * @returns {Number} BPM
 */
 export const elapsed = () => (now() - startTime) * 0.001


/**
 * Convert a BPM to a period in ms
 * @param {Number} bpm beats per minute
 * @returns {Number} time in milliseconds
 */
export const convertBPMToPeriod = bpm => 60000 / bpm

/**
 * Fetch current bar length in milliseconds
 * @returns {Number} bar length in milliseconds
 */
export const getTimePerBar = () => period * DIVISIONS

/**
 * Fetch whole loop length in milliseconds
 * @returns {Number} length in milliseconds
 */
export const getTotalTime = () => getTimePerBar() * bars

/**
 * Fetch current bar
 * @returns {Number} current bar
 */
export const getBar = () => bar

/**
 * Fetch total bar quantity
 * @returns {Number} total bars
 */
 export const getBars = () => bars 

/**
 * Percentage duration of bar progress
 * @returns {Number} percentage elapsed
 */
export const getBarProgress = () => bar / bars

/**
 * Allows a user to set the total number of bars
 * @param {Number} value How many bars to have in a measure
 * @returns {Number} total bars
 */
export const setBars = value => {
    bars = value < 1 ? 1 : value > MAX_BARS_ALLOWED ? MAX_BARS_ALLOWED : value
    return bars
}

// Tempos

/**
 * Get the current timing as a Microtempo 
 * @returns {Number} Microtempo
 */
 export const getMicroTempo = () => getTimePerBar() * 0.001

/**
 * Get the current timing in Micros per MIDI clock
 * MicrosPerMIDIClock = MicroTempo / 24 
 * @returns {Number} Microtempo
 */
 export const getMicrosPerMIDIClock = () => getMicroTempo() / 24

/**
 * Get the current timing as Beats per minute
 * BPM = 60,000,000 / MicroTempo
 * @returns {Number} BPM
 */
 export const getBPM = () => 60000 / getTimePerBar()

 /**
  *  Set the current timing using a BPM where 
  *  one beat in milliseconds =  60,000 / BPM
  * @param {Number} bpm Beats per minute
  * @returns {Number} period
  */
 export const setBPM = bpm => setTimeBetween( convertBPMToPeriod( bpm ) )
 
/**
 * Using a time in milliseconds, set the amount of time between tick and tock
 * @param {Number} time Amount of millieconds between ticks
 * @returns {Number} period
 */
export const setTimeBetween = time => {

	// we want 16 notes
    period = time / DIVISIONS

  	// TODO
    // FIXME
    // if it is running, stop and restart it?
    //interval = newInterval
    timingWorker.postMessage({command:CMD_UPDATE, interval:period, time:now() })
    return period
}

/**
 * Starts the timer and begins events being dispatched
 * @param {Function} callback Method to call when the timer ticks
 * @param {Number} timeBetween Milliseconds between ticks aka Period
 * @param {Object} options Other settings
 * @returns {Object} current time and timingWorker
 */
export const startTimer = (callback, timeBetween=200, options={} ) => {

    barsElapsed = 0

    // lazily initialise a context
    if (audioContext === null)
    {
        audioContext = new AudioContext()
        // on Safari macOS/iOS, the audioContext is suspended if it's not created
        // in the event handler of a user action: we attempt to resume it.
        if (audioContext.state === 'suspended') {
            audioContext.resume()
        }
    }

    period = timeBetween

    if (!isRunning)
    {
        // 
    }
   
    // now hook into our worker bee and watch for timing changes
    timingWorker.onmessage = (e) => {

        const currentTime = now()
        const data = e.data
        switch(data.event)
        {
            case EVENT_STARTING:
               	// save start time
                startTime = currentTime
                isRunning = true
				divisionsElapsed = 0
                //console.log("EVENT_STARTING", {time:data.time, startTime})
                break

            case EVENT_TICK:

                // How many ticks have occured yet
                const intervals = data.intervals
                // Expected time stamp
                const expected = intervals * timeBetween * 0.001
                // How long has elapsed according to audio context
                const elapsed = currentTime - startTime
                // How long has elapsed according to our worker
                const timePassed = data.time
                // how much spill over the expected timestamp is there
                const lag = timePassed % timeBetween * 0.001
                // should be 0 if the timer is working...
                const drift = timePassed - elapsed
                // deterministic intervals not neccessary
                const level = Math.floor(timePassed / timeBetween)
                
				if (++divisionsElapsed === DIVISIONS)
				{
					bar = ++barsElapsed % bars
					divisionsElapsed = 0
				}
			
                // elapsed should === time
                //console.log("EVENT_TICK", {timePassed, elapsed, drift, art})
                // console.log(divisionsElapsed, bar +'/' + bars)
                callback && callback({
					divisionsElapsed, bar, bars, barsElapsed, 
					timePassed, elapsed, expected, drift, level, intervals, lag
				})
                // timingWorker.postMessage({command:CMD_UPDATE, time:currentTime, interval})
                break

            default:
                console.log("message: " , e)
        }
    }

    // Error!
    timingWorker.onerror = error =>{
        console.error("error...", {error} )
        timingWorker.postMessage({error, time:audioContext.currentTime })
    }

    // send command to worker... options
    timingWorker.postMessage({
        command:CMD_START, 
        time:audioContext.currentTime, 
        interval:timeBetween,
        // FIXME:
        accurateTiming:false
    })
    //console.log("Starting...", {audioContext, interval:timeBetween, timingWorker} )

    return {
        currentTime:now(),
        timingWorker
    }
}


/**
 * Stops the timer and prevents events being dispatched
 * @returns {Object} current time and timingWorker
 */
export const stopTimer = () => {
    const currentTime = now()
    // cancel the thing thrugh the workers first
    // cancel any scheduled quie noises
    timingWorker.onmessage = (e) => {
        switch(e.event)
        {
            // Clean up
            case EVENT_STOPPING:
                // destroy contexts and unsubscribe from events
                isRunning = false
                audioContext = null
                break
        }
    }

    timingWorker.postMessage({command:CMD_STOP, time:currentTime})

    return {
        currentTime,
        timingWorker
    }
}




// TODO: Implement lienar regression like nayuki
// https://www.nayuki.io/page/tap-to-measure-tempo-javascript
let beatTimes = []
const TAP_TIMEOUT = 10000
const MINIMUM_TEMPOS = 2

/**
 * Converts a series of method calls into a tempo estimate.
 * @param {Boolean} autoReset Start a new estimation session if timeout reached
 * @param {Number} timeOut Time frame before ignoring the event and starting a fresh estimation session
 * @param {Number} minimumTaps Requires at least x taps before estimate set
 * @returns {Number} New Period
 */
export const tapTempo = (autoReset=true, timeOut=TAP_TIMEOUT, minimumTaps = MINIMUM_TEMPOS) => {
    
    const currentTime = now()

    if ( autoReset && beatTimes.length > 0 && currentTime - beatTimes[beatTimes.length-1] > timeOut )
    {
        beatTimes = []
    }

    beatTimes.push(currentTime)

    const quantity = beatTimes.length
    const x = quantity - 1
    const y = beatTimes[x] - beatTimes[0]
    // const time = (y / 1000).toFixed(3)
   
    if (quantity >= minimumTaps) 
    {
        // const tempo = 60000 * x / y
        const period = y / x
        return period
    }
    return -1
}