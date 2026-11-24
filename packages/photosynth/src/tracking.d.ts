import type { TrackingOptions, TrackingPrediction, Tracker } from './types.js';
export declare const DEFAULT_WASM_PATH: string;
export declare const DEFAULT_FACE_MODEL: string;
export declare const DEFAULT_HAND_MODEL: string;
export declare class MediaPipeTracker implements Tracker {
 constructor(options?: TrackingOptions);
 load(): Promise<void>;
 detect(video: HTMLVideoElement, time: number): Promise<TrackingPrediction[]>;
 close(): void;
}
