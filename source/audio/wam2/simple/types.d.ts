/**
 * Interface that exposes Input methods for a MIDI1.0
 * compatable 
 */

export interface MIDI1Input extends CompositeAudioNode {
	prototype: CompositeAudioNode;
    new (options: AudioWorkletNodeOptions): CompositeAudioNode;
	noteOn(): void;
	noteOff(): void;    
}

export interface MIDI2Input extends CompositeAudioNode {
	prototype: CompositeAudioNode;
    new (options: AudioWorkletNodeOptions): CompositeAudioNode;
	noteOn(): void;
	noteOff(): void;
}

/**
 * If you want your WAM to communicate with MIDI devices
 * externally
 */
export interface MIDIOutput extends CompositeAudioNode {
	prototype: CompositeAudioNode;
    new (options: AudioWorkletNodeOptions): CompositeAudioNode;
	noteOn(): void;
	noteOff(): void;
}