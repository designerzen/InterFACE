import changesPath from "url:../changes.html"

export const fetchChangesAsText = async () => {
    const response = await fetch(changesPath)
    return await response.text()
}

export const injectChangeLog = async (id) => {
	const contentDiv = document.getElementById(id)
	contentDiv.innerHTML = await fetchChangesAsText()
}
