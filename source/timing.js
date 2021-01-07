export const CMD_START = "start"
export const CMD_STOP  = "stop"
export const CMD_UPDATE  = "update"

export const EVENT_READY = "ready"
export const EVENT_STARTING = "starting"
export const EVENT_STOPPING = "stopping"
export const EVENT_TICK = "tick"

const AudioContext = window.AudioContext || window.webkitAudioContext

// Load in the correct worker...timing.requestframe.worker.js
let timingWorker = new Worker("data-url:./timing.requestframe.worker.js") // new Worker(WORKER_URL)

let startTime = -1
let currentInterval = 1
let audioContext = null
let isRunning = false

const now = () => audioContext.currentTime

const elapsed = () => (now() - startTime) * 0.001

// export const setMode = newMode => {
//     // check to see if in array of acceptable types
//     mode = newMode
//     timingWorker = new Worker(`${prefix}/timing.${mode}.worker.js`)
//     // TODO: restart if running
//    // console.error("Changing mode",mode, timingWorker)
//     if (isRunning)
//     {
//         // 
//     }
// }

export const setTimeBetween = time => {
    currentInterval = time
    // if it is running, stop and restart it?
     //interval = newInterval
    // TODO
    // FIXME
    timingWorker.postMessage({command:CMD_UPDATE, interval:currentInterval, time:now() })
}

export const start = (callback, timeBetween=200) => {

    // lazily initialise a context
    if (audioContext === null)
    {
        audioContext = new AudioContext()
        // on Safari macOS/iOS, the audioContext is suspended if it's not created
        // in the event handler of a user action: we attempt to resume it.
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    currentInterval = timeBetween

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
                const time = data.time
                // save start time
                startTime = currentTime
                isRunning = true
                //console.log("EVENT_STARTING", {time, startTime})
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
                
                // update offset?

                // elapsed should === time
                //console.log("EVENT_TICK", {timePassed, elapsed, drift, art})
                callback && callback({timePassed, elapsed, expected, drift, level, intervals, lag})
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

    // send command to worker
    timingWorker.postMessage({command:CMD_START, time:audioContext.currentTime, interval:timeBetween })
    console.log("Starting...", {audioContext, interval:timeBetween, timingWorker} )

    // methods that can be chained?
    return {
        currentTime:now(),
        timingWorker
    }
}

export const stop = () => {
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
        currentTime:now(),
        timingWorker
    }
}