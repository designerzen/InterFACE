/**
 * http://soundfile.sapp.org/doc/WaveFormat/
 * @param {*} sampleChannels 
 * @param {*} sampleRate 
 * @returns 
 */


// wav.js by Frank Force 2020 - https://github.com/KilledByAPixel/ZzFX
export function buildWavBlob(sampleChannels, sampleRate = 44100) {
    // adapted from https://gist.github.com/asanoboy/3979747
    const channelCount = sampleChannels.length
    const sampleCount = sampleChannels[0].length
    const length = channelCount * sampleCount

    // Convert to Data View to avoid ENDIAN issues
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
    const buffer = new Int16Array(length + 23)

    console.assert(channelCount && sampleCount, 'No channels or samples found!');

    // wave header
    buffer[0] = 0x4952; // RI
    buffer[1] = 0x4646; // FF
    buffer[2] = (2 * length + 15) & 0x0000ffff; // RIFF size
    buffer[3] = ((2 * length + 15) & 0xffff0000) >> 16; // RIFF size
    buffer[4] = 0x4157; // WA
    buffer[5] = 0x4556; // VE
    buffer[6] = 0x6d66; // fm
    buffer[7] = 0x2074; // t
    buffer[8] = 0x0012; // fmt chunksize: 18
    buffer[9] = 0x0000; //
    buffer[10] = 0x0001; // format tag : 1 
    buffer[11] = channelCount; // channelCount
    buffer[12] = sampleRate & 0x0000ffff; // sample per sec
    buffer[13] = (sampleRate & 0xffff0000) >> 16; // sample per sec
    buffer[14] = (2 * channelCount * sampleRate) & 0x0000ffff; // byte per sec
    buffer[15] = ((2 * channelCount * sampleRate) & 0xffff0000) >> 16; // byte per sec
    buffer[16] = 0x0004; // block align
    buffer[17] = 0x0010; // bit per sample
    buffer[18] = 0x0000; // cb size
    buffer[19] = 0x6164; // da
    buffer[20] = 0x6174; // ta
    buffer[21] = (2 * length) & 0x0000ffff; // data size[byte]
    buffer[22] = ((2 * length) & 0xffff0000) >> 16; // data size[byte]	

    // copy samples to buffer
    for (let i = 0; i < sampleCount; i++) {
        for (let j = 0; j < channelCount; j++) {
            const s = sampleChannels[j][i]
            buffer[i * channelCount + j + 23] = s >= 1 ? (1 << 15) - 1 : (s * (1 << 15) | 0)
        }
    }

    // build the blob
    let end = 0
    let bufferNeedle = 0
    const blobData = []
    const GetBuffer = (length) => {
        end = bufferNeedle + length >= buffer.length
        const rt = new Int16Array(end ? buffer.length - bufferNeedle : length)
        for (let i = 0; i < rt.length; i++) {
            rt[i] = buffer[i + bufferNeedle]
        }
        bufferNeedle += rt.length
        return rt.buffer
    }
    while (!end) {
        blobData.push(GetBuffer(1e3))
    }
    return new Blob(blobData, { type: 'audio/wav' })
}

/**
 * 
 * @param {AudioBuffer|Array} buffers 
 * @param {Object} settings 
 * @returns 
 */
// https://gist.github.com/tatsuyasusukida/b6daa0cd09bba2fbbf6289c58777eeca?permalink_comment_id=5223299
export const encodeAudioBufferIntoWav = (buffers, settings = {
    sampleRate:44100,
    stereo:true,
    sampleSize:16 // 32
}) => {

    // constants
    const BITS_PER_BYTE = 8
   
    // if buffers is an AudioBuffer, we convert it to a basic array
    if (typeof buffers === "object" &&  buffers?.numberOfChannels)
    {
        const audioBuffer = []
        if (settings.stereo)
        {
            for (let i = 0; i < buffers.numberOfChannels; i++) 
            {
                audioBuffer.push(buffers.getChannelData(i))
            }    

        }else{
            // just use the left channel?
            // or should we take the average of both channels?
            audioBuffer.push(buffers.getChannelData(0))
        }
       
        // sampleCount = buffers[0].length
        settings.sampleRate = buffers.sampleRate
        buffers = audioBuffer
        
    }else{
        // assuming an array of floats...
    }

    // add up all space in the array
    const sampleCount = buffers.reduce((memo, buffer) => memo + buffer.length, 0)

    const bytesPerSample = settings.sampleSize / 8      // 4 or 2
    const dataLength = sampleCount * bytesPerSample
    const sampleRate = settings.sampleRate ?? 44100

    // ensure all the above data is valid and workable
    // console.assert(channelCount && sampleCount, 'No channels or samples found!');
    const arrayBuffer = new ArrayBuffer(44 + dataLength)
    const dataView = new DataView(arrayBuffer)

    // Set binary header - Chunk ID
    dataView.setUint8(0, 'R'.charCodeAt(0)) // <10>
    dataView.setUint8(1, 'I'.charCodeAt(0))
    dataView.setUint8(2, 'F'.charCodeAt(0))
    dataView.setUint8(3, 'F'.charCodeAt(0))
    // RIFF Chunk Size
    dataView.setUint32(4, 36 + dataLength, true)
    // Format 
    dataView.setUint8(8, 'W'.charCodeAt(0))
    dataView.setUint8(9, 'A'.charCodeAt(0))
    dataView.setUint8(10, 'V'.charCodeAt(0))
    dataView.setUint8(11, 'E'.charCodeAt(0))
    // Sub Chunk ID
    dataView.setUint8(12, 'f'.charCodeAt(0))
    dataView.setUint8(13, 'm'.charCodeAt(0))
    dataView.setUint8(14, 't'.charCodeAt(0))
    dataView.setUint8(15, ' '.charCodeAt(0))

    // Flags ---
    // Format sub chunk size
    dataView.setUint32(16, 16, true)
    // Audio format tag : 1 
    dataView.setUint16(20, 1, true)
    // Number of channels
    dataView.setUint16(22, 1, true)

    // Sample data ---
    // Sample rate (samples per second)
    dataView.setUint32(24, sampleRate, true)
    // Byte rate (bytes per second)
    dataView.setUint32(28, sampleRate * 2, true)
    // Block align
    dataView.setUint16(32, bytesPerSample, true)
    // Bits per sample
    dataView.setUint16(34, BITS_PER_BYTE * bytesPerSample, true)
    // Sub Chunk 2 ID
    dataView.setUint8(36, 'd'.charCodeAt(0))
    dataView.setUint8(37, 'a'.charCodeAt(0))
    dataView.setUint8(38, 't'.charCodeAt(0))
    dataView.setUint8(39, 'a'.charCodeAt(0))
    // Sub Chunk 2 size (data size in bytes)
    dataView.setUint32(40, dataLength, true)

    let index = 44

    // now inject audio buffer data
    // loop through all the buffer channels
    for (const buffer of buffers) 
    {
        // loop through all the samples in this channel
        for (const value of buffer) 
        {
            dataView.setInt16(index, value * 0x7fff, true)
            index += 2
        }
    }

    return new Blob([dataView], { type: 'audio/wav' })
}