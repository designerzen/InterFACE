
export const EVENT_STATE_INITIALISING = "initialising"
export const EVENT_STATE_LOADING = "application-loading"
export const EVENT_STATE_LOADED = "application-loaded"
export const EVENT_STATE_PARKED = "application-parked"

export default class InterfaceEvent extends Event{

	details

	constructor( type, details, cancelable=true, bubbles=false ){
		super( type,  {
			bubbles,
			cancelable,
			composed: true
		} )
		this.details = details
	}

	clone(){
		return new InterfaceEvent( this.type, this.details, this.cancelable, this.bubbles )
	}
}