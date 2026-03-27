// Dispatched events that each person creates
export const EVENT_EMOTION_CHANGED = "emotion-changed"
export const EVENT_EMOTION_UNLOCKED = "emotion-unlocked"
export const EVENT_INSTRUMENT_CHANGED = "instrument-changed"
export const EVENT_INSTRUMENT_LOADING = "instrument-loading"
export const EVENT_USER_MODE_CHANGED = "usermode-changed"
export const EVENT_PERSON_BORN = "person-born"
export const EVENT_PERSON_DEAD = "person-dead"

export default class PersonEvent extends Event{

	data

	constructor( type, data ){
		super( type,  {
			bubbles: true,
			cancelable: true,
			composed: true
		} )
		this.data = data
	}

	clone(){
		return new PersonEvent( this.type, this.data )
	}
}