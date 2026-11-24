import changesPath from "url:../changelog.html"
import MANIFEST_PATH from "url:../manifest.webmanifest"

export const fetchChangesAsText = async () => {
    const response = await fetch(changesPath)
    const html = await response.text()
    // the url may resolve to a full page (header, logo, styles) so keep only the release sections
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const sections = doc.querySelectorAll('#changes section, body > section')
    return sections.length ? Array.from(sections, section => section.outerHTML).join('') : ''
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
