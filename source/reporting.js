import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'
 
let analytics

/**
 * Create a new analytics instance for sending events
 * @param {String} name Unique name for the store cache
 * @param {id} id Unique Google ID
 */
export const setupReporting = (name="Interface", id="G-1XT0GV0L6J") => {
	analytics = Analytics({
		app: name,
		plugins: [
			googleAnalytics({
				trackingId:id
			})
		]
	})
	
	// Track a page view 
	analytics.page()
	
	return analytics
	

	// // Track a custom event 
	// analytics.track('playedVideo', {
	// 	category: 'Videos',
	// 	label: 'Fall Campaign',
	// 	value: 42
	// })
	
	// // Identify a visitor
	// analytics.identify('user-id-xyz', {
	// 	firstName: 'bill',
	// 	lastName: 'murray'
	// })	
}

/**
 * Send a generic tracking event to Google Analytics
 * @param {String} name Tracking Name
 * @param {String} data Data to send
 */
export const track = (name, data) => {
	if (analytics)
	{
		analytics.track(name, data)		
	}
}

/**
 * Send a tracking event to Google Analytics to
 * signify that a user is laeving the site
 */
export const trackExit = () => {
	// // Track a custom event 
	// analytics.track('playedVideo', {
	// 	category: 'Videos',
	// 	label: 'Fall Campaign',
	// 	value: 42
	// })
}

/**
 * Send a tracking event to Google Analytics of ERROR type
 * @param {String} error Short Error message
 * @param {Number} code Error Code
 * @param {String} category Error Category
 */
export const trackError = (error, code=42, category="Fails") =>{ 
	if (analytics)
	{
		analytics.track('Error', {
			category:category,
			label:error,
			value:code
		})		
	}
}