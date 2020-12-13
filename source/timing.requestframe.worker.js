const CMD_START = "start"
const CMD_STOP  = "stop"
const CMD_UPDATE  = "update"

const EVENT_READY = "ready"
const EVENT_STARTING = "starting"
const EVENT_STOPPING = "stopping"
const EVENT_TICK = "tick"

let isRunning = false
let startTime = -1
let currentTime = -1
let nextInterval = -1
let gap = 0
let intervals = 0
let exit = false

const elapsed = () => (performance.now() - startTime) * 0.001

const reset = () =>{
    intervals = 0
    startTime = performance.now()
}

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
        // it has happened! so re-adjust the next interval
        nextInterval += gap
        // update our counter
        intervals++
        // callback
        postMessage({ event:EVENT_TICK, time:elapsed(), intervals })
    }

    requestAnimationFrame(loop)
}

const start = (interval=250)=>{

    gap = interval
    startTime = performance.now()

    // work out the next step from this step...
    nextInterval = startTime + interval

    if (!isRunning)
    {   
        isRunning = true
        postMessage({event:EVENT_STARTING, time:0, intervals})
    }
   
    // Loop
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
