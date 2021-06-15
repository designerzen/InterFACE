
export const setupImage = async (image) => {
	return new Promise( async (resolve,reject) => {
		const setSize = ()=> {
			image.width = image.naturalWidth
			image.height = image.naturalHeight
		}
		// check to see if has already loaded...
		if (image.naturalWidth > 0)
		{
			setSize()
			resolve(image) 
		}else{
			image.onloaded = ()=>{ 
				setSize()
				resolve(image)
			}
			image.onerror = error => reject(error)
		}
	})
}
