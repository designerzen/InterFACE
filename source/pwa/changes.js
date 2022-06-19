import changesPath from "url:../changes.html"
import MANIFEST_PATH from "url:../manifest.webmanifest"

export const fetchChangesAsText = async () => {
    const response = await fetch(changesPath)
    return await response.text()
}

export const injectChangeLog = async (contentDiv) => {
	const log = await fetchChangesAsText()
	contentDiv.innerHTML = log
}


// Load the manifest file that has information about this release
// and app
export const getManifestData = async (manifestPath=MANIFEST_PATH) => {
	try {
	  const response = await fetch(manifestPath)
	  const data = await response.json()
	  if (data) 
	  {
		return data
	  }

	} catch (err) {
		console.error("Manifest could not be loaded",err)
		return null
	}
}
