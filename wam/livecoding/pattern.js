const noteStringToNoteNumberMap = 
    new Array(128).fill(null).map((v, ndx) => 
        (['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'])[ndx%12]+''+Math.floor(ndx/12)
    ).reduce((prev, curr, ndx) => {
        prev[curr] = ndx;
        return prev;
    }, {});

export let startTime = Date.now();
export let bpm = 110;
export const setBPM = (tempo) => bpm = tempo;

export const currentBeat = () =>
    ((Date.now() -
        startTime)/
        (60*1000)
) * bpm; 

console.log('hello from pattern');
export const beatToTime = async (beatNo) => ((beatNo / bpm) * 60 * 1000) + startTime;

export async function waitForBeat(beatNo) {
        let timeout = Math.floor((((beatNo) / bpm) * (60*1000)) - 
                (Date.now() -
                startTime)); 
        
        if(timeout<0) {
            timeout = 0;
        }

        return new Promise((resolve, reject) =>
            setTimeout(() => {                
                resolve();
            },
              timeout  
            )
        );
    };

/**
 * Wait before starting play so that initialization can finish
 * @param {*} delay (default is 100 ms)
 */
export async function delayPlay(delay) {
    startTime = new Date().getTime() + (delay ? delay : 100);
    delayPlay = async () => console.log('delay play only has effect once');
    await waitForBeat(0);
}

export async function waitForFixedStartTime(startTime) {
    if(!startTime) {
        startTime = new Date().getTime() + 100;
    }
    startTime = startTime;
    delayPlay = async () => console.log('delay play only has effect once');
    await waitForBeat(0);
}

export async function countdown(counter) {
    let beat = Math.round(currentBeat());                              
    while(counter>0) {
        console.log(counter--);
        beat++;
        await waitForBeat(beat);     
    }
}

export class Pattern {
    constructor(output) {
        this.currentbeat = 0;
        this.output = output;
        this.channel = 0;
        this.velocity = 100;
        this.offset = 0;
        this.stepsperbeat = 16;
    }

    setChannel(channel) {
        this.channel = channel;
    }


    waitForStep(stepno) {
        return this.waitForBeat(stepno / this.stepsperbeat);
    }

    waitForBeat(beatNo) {   
        
        let timeout = Math.floor((((beatNo + this.offset) / bpm) * (60*1000)) - 
                (Date.now() -
                startTime)); 

        if(timeout<0) {
            timeout = 0;
        }

        return new Promise((resolve, reject) =>
            setTimeout(() => {
                this.currentbeat = beatNo;
                resolve();
            },
              timeout  
            )
        );
    }

    toNoteNumber(note) {
        return noteStringToNoteNumberMap[note];
    }

    async waitDuration(duration) {
        const timeout = (duration*60*1000) / bpm; 
        
        return new Promise((resolve, reject) =>
            setTimeout(() => {
                resolve();
            },
              timeout  
            )
        );
    }

    async pitchbend(start, target, duration, steps) {
        const stepdiff = (target - start) / steps;
        let currentValue = start;
        for(let step = 0 ; step < steps; step++) {
            
            const rounded = Math.round(currentValue);
            this.output.sendMessage([0xe0 + this.channel, 0x007f & rounded, (0x3f80 & rounded) >> 7 ]);

            currentValue += stepdiff;
            
            await this.waitDuration( duration / steps);
        }
        this.output.sendMessage([0xe0 + this.channel, 0x007f & target, (0x3f80 & target) >> 7 ]);
    }

    async controlchange(controller, start, target, duration, steps) {
        const stepdiff = (target - start) / steps;
        let currentValue = start;
        for(let step = 0 ; step < steps; step++) {
            
            const rounded = Math.round(currentValue);
            this.output.sendMessage([0xb0 + this.channel, controller, rounded]);
            
            currentValue += stepdiff;
        
            await this.waitDuration( duration / steps);
        }
        this.output.sendMessage([0xb0 + this.channel, controller, 0x7f & target]);
    }

    async note(noteNumber, duration) {
        this.output.sendMessage([0x90 + this.channel, noteNumber, this.velocity]);
        
        await this.waitDuration(duration);
        this.output.sendMessage([0x80 + this.channel, noteNumber, 0]);        
    }    

    async playNote(note, duration) {
        this.output.sendMessage([0x90 + this.channel, noteStringToNoteNumberMap[note], this.velocity]);
        
        await this.waitDuration(duration);
        this.output.sendMessage([0x80 + this.channel, noteStringToNoteNumberMap[note], 0]);
        
    }    
}
