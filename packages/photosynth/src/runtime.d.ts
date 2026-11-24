import type { PhotosynthOptions, PhotosynthConfiguration, PhotosynthFrame, PhotosynthState, TrackingPrediction, MusicEvent, PerformerOptions, CameraStartOptions } from './types.js';
import type { CameraSession } from './camera.js';
import type { Performer } from './performer.js';
export declare class Photosynth extends EventTarget {
 constructor(options?: PhotosynthOptions);
 readonly performers: Performer[];
 readonly options: PhotosynthOptions;
 readonly camera: CameraSession;
 readonly video?: HTMLVideoElement;
 readonly state: PhotosynthState;
 now(): number;
 onMusic(listener: (event: MusicEvent) => void): () => void;
 onFrame(listener: (frame: PhotosynthFrame) => void): () => void;
 process(predictions: TrackingPrediction[], time?: number, options?: { repeat?: boolean }): MusicEvent[];
 configure(index: number, options: PerformerOptions): void;
 exportConfiguration(): PhotosynthConfiguration;
 restoreConfiguration(configuration: PhotosynthConfiguration): void;
 calibrate(index?: number): boolean;
 start(options?: CameraStartOptions): Promise<void>;
 tick(time?: number): void;
 release(time?: number): void;
 stop(): void;
 dispose(): void;
}
