export const downloadBlob = (blob, fileName) => {
	const url=URL.createObjectURL(blob),anchor=document.createElement('a')
	anchor.href=url;anchor.download=fileName
	document.body.appendChild(anchor)
	try {anchor.click()} finally {anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
}
