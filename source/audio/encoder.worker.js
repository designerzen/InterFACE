export const CMD_ENCODE = "command-encode"
export const EVENT_ENCODED = "encode complete"

const encodeRecording = ( dataArray, format="audio", type= "mp3", codecs="") => {
	
	// ='audio/mp3;'
	// var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' 
	// 'audio': [
	// 	'audio/webm;codecs=opus',
	// 	'audio/webm',
	// 	'audio/ogg',
	// 	'audio/mp3',
	// 	'audio/wav'
	// ],
	// 'video': [
	// 	'video/webm;codecs=vp9',
	// 	'video/webm;codecs=vp8',
	// 	'video/webm;codecs=h264',
	// 	'video/webm;codecs=opus',
	// 	'video/webm',
	// 	'video/mp4',
	// 	'video/mpeg'
	// ]

	const encode = `${format}/${type}` + codecs.length ? ';codecs=' + codecs : ''
	//console.error("Encoding", encode, dataArray, codecs)
	const audioData = new Blob(dataArray, { 'type': encode })
	return audioData
}

self.onmessage = ( e ) => {
	const {command, data, format, type, codecs} = e.data
    switch (command)  {
        case CMD_ENCODE:
			const audioData = encodeRecording( data, format, type, codecs )
			postMessage({ event:EVENT_ENCODED, audio:audioData })
			break
	}
}