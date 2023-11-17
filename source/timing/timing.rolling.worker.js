const CMD_START = "start"
const CMD_STOP  = "stop"
const CMD_UPDATE  = "update"

const EVENT_READY = "ready"
const EVENT_STARTING = "starting"
const EVENT_STOPPING = "stopping"
const EVENT_TICK = "tick"

const GAP_BETWEEN_LOOPS = 1

let isRunning = false
let startTime = -1
let currentTime = -1
let nextInterval = -1
let gap = 0
let intervals = 0
let exit = false
let accurateTiming = true

const elapsed = () => (performance.now() - startTime) * 0.001

const reset = () =>{
    intervals = 0
    startTime = performance.now()
}

/**
 * drifting short loop
 * @returns 
 */
const loop = () => {

    if (exit)
    {
        exit = false
        return
    }

    currentTime = performance.now()
  
    // if the currentTime is equal or greater to our rolling time + interval
    if (currentTime >= nextInterval)
    {
        // update our counter
        intervals++
        // callback
        postMessage({ event:EVENT_TICK, time:elapsed(), intervals })
    }

    setTimeout(loop, GAP_BETWEEN_LOOPS )
}

const start = (interval=250, accurateTiming=true )=>{

    gap = interval
   
    // work out the next step from this step...
    nextInterval = startTime + interval

    if (!isRunning)
    {   
        startTime = performance.now()
        isRunning = true
        postMessage({event:EVENT_STARTING, time:0, intervals})
    }
   
    loop()
	
    // INITIAL tick
    postMessage({event:EVENT_TICK, time:elapsed(), intervals})
}

const stop = () => {
    exit = true
    isRunning = false
    postMessage({ event:EVENT_STOPPING, time:elapsed(), intervals })
}

self.onmessage = e => {

    const data = e.data

    switch (data.command)
    {
        case CMD_START:
            accurateTiming = data.accurateTiming || false
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
