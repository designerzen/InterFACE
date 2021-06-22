export const fetchChangesAsText = async () => {
    const response = await fetch("./changes.html")
    return await response.text()
}

export const injectChangeLog = async (id) => {
	const contentDiv = document.getElementById(id)
	contentDiv.innerHTML = await fetchChangesAsText()
}
