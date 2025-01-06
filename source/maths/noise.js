/**
 * http://www.musicdsp.org/files/pink.txt
 * 
 */
let b0 = 0
let b1 = 0
let b2 = 0
let b3 = 0
let b4 = 0
let b5 = 0
let b6 = 0

export const generatePinkNoise = (bufferSize=4096) => { 
    const output = new Float32Array(bufferSize)
    for (let i = 0; i < bufferSize; ++i) 
    {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        output[i] *= 0.11       // (roughly) compensate for gain
        b6 = white * 0.115926
    }
    return output
}


let lastOut = 0
export const generateBrownNoise = (bufferSize=4096) => {
    const output = new Float32Array(bufferSize)
    for (let i = 0; i < bufferSize; ++i) 
    {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + (0.02 * white)) / 1.02
        lastOut = output[i]
        output[i] *= 3.5 // (roughly) compensate for gain
    }
    return output
}

export const generateWhiteNoise = (bufferSize=4096) => {
    const output = new Float32Array(bufferSize)
    for (let i = 0; i < bufferSize; ++i) 
    {
        output[i] = Math.random() * 2 - 1
    }
    return output
}