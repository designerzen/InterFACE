// States for the audio controlled by the face
export const STATE_INSTRUMENT_SILENT = "instrument-not-playing"
export const STATE_INSTRUMENT_ATTACK = "instrument-attack"
export const STATE_INSTRUMENT_SUSTAIN = "instrument-sustain"
export const STATE_INSTRUMENT_PITCH_BEND = "instrument-pitchbend"
export const STATE_INSTRUMENT_DECAY = "instrument-decay"
export const STATE_INSTRUMENT_RELEASE = "instrument-release"

// Dispatched events that each person creates
export const EVENT_EMOTION_CHANGED = "emotion-changed"
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