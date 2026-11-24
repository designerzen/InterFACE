import type { PerformerOptions, TrackingPrediction, MusicEvent, MusicNote } from './types.js';
import type PersonMotion from './people/person-motion.js';
export declare const DEFAULT_PERFORMER_OPTIONS: Readonly<PerformerOptions>;
export declare class Performer {
 constructor(index: number, options?: PerformerOptions);
 readonly id: string;
 readonly playerNumber: number;
 readonly options: PerformerOptions;
 readonly data: TrackingPrediction | null;
 readonly motion: PersonMotion;
 readonly activeNotes: Map<number, Array<number | MusicNote>>;
 readonly noteNumber: number;
 readonly noteVelocity: number;
 readonly singing: boolean;
 readonly state: string;
 configure(options: PerformerOptions): void;
 reset(time: number, trackingLost?: boolean): MusicEvent[];
 update(prediction: TrackingPrediction | null, time: number, options?: { repeat?: boolean; bpm?: number }): MusicEvent[];
}
