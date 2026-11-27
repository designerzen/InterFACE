const browserDownloadBlob = (blob, fileName) => {
	const url = URL.createObjectURL(blob), anchor = document.createElement('a')
	anchor.href = url
	anchor.download = fileName
	document.body.appendChild(anchor)
	try { anchor.click() } finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000) }
}

export const downloadBlob = (blob, fileName) => {
	const saveFile = globalThis.electron?.storage?.saveFile
	if (typeof saveFile === 'function' && typeof blob?.arrayBuffer === 'function') {
		return blob.arrayBuffer()
			.then(buffer => saveFile(fileName, buffer, blob.type || 'application/octet-stream'))
			.catch(() => browserDownloadBlob(blob, fileName))
	}
	return browserDownloadBlob(blob, fileName)
}
