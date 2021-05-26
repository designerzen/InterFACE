export const showStats = async () => {
	let Stats = await import("stats.js")

	const stats = new Stats()
	stats.showPanel( 1 ) // 0: fps, 1: ms, 2: mb, 3+: custom
	
	document.body.appendChild( stats.dom )
	
	return (callback) => {
		stats.begin()
		
		// monitored code goes here
		callback()
	
		stats.end()
	}
}