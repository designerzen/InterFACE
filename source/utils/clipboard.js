/**
* FIXME: Wrap in ty catch always
* @param {Canvas} canvas 
* @returns 
*/
export const copyBlobToClipboard = async (blob) => await navigator.clipboard.write([ new ClipboardItem({ [blob.type]:blob }) ])