const CMD_START = "start"
const CMD_STOP  = "stop"
const CMD_UPDATE  = "update"

const EVENT_READY = "ready"
const EVENT_STARTING = "starting"
const EVENT_STOPPING = "stopping"
const EVENT_TICK = "tick"

let timerID = null
let isRunning = false
let startTime = -1
let currentTime = -1
// assumes a constant tempo
let gap = -1
let intervals = 0

const elapsed = () => (performance.now() - startTime) * 0.001

const loop = interval => {
    
    // Loop
    timerID = setInterval( ()=>{

        const expected = intervals * gap * 0.001
        const passed = elapsed()
        const difference = expected - passed
        
        // if the difference is too great, restart with different interval?

        currentTime = performance.now()
        
        intervals++
        
        postMessage({ event:EVENT_TICK, time:passed, intervals })
        console.log({expected,passed,difference,currentTime})

        // modify the interval to accomodate the drift
        
        // call itself with the new interval?
        loop(interval + difference)

    }, interval)
}

const reset = () =>{
    intervals = 0
    startTime = performance.now()
}

const start = (interval=250)=>{
    // stop if running
    if (isRunning)
    {
        clearInterval(timerID)
    }

    startTime = performance.now()
    isRunning = true

    postMessage({event:EVENT_STARTING, time:0})

    gap = interval
    // do the setinterval here
    loop(gap)

    // INITIAL tick
    postMessage({ event:EVENT_TICK, time:elapsed(), intervals })
}

const stop = () => {
    clearInterval(timerID)
    timerID = null
    isRunning = false
    postMessage({ event:EVENT_STOPPING, time:elapsed(), intervals })
}

self.onmessage = e => {

    const data = e.data

    // If we want to get a specific time from outside of this context we need to proxy
    // which is slow but possible
    // postMessage({ event:EVENT_TICK, time:passed, intervals })
    switch (data.command)
    {
        case CMD_START:
            start(data.interval)
            break

        case CMD_STOP:
            stop()
            break

        case CMD_UPDATE:
            start(data.interval)
            break
    }
}
