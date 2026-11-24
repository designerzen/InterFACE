export interface Point { x: number; y: number; z?: number }
export interface BoundingBox { xMin: number; xMax: number; yMin: number; yMax: number }
export interface TrackingPrediction {
  box?: BoundingBox;
  keypoints?: Point[];
  landmarks?: Point[];
  time?: number;
  pitch?: number;
  yaw?: number;
  roll?: number;
  headRollRadians?: number;
  mouthRatio?: number;
  mouthVolumeRatio?: number;
  happiness?: number;
  eyesHorizontal?: number;
  eyebrowExtents?: number;
  [signal: string]: unknown;
}
export interface MusicNote { noteNumber: number; [detail: string]: unknown }
/** Velocity/controllers: 0–1; pitch bend: -1–1; time: monotonic milliseconds. */
export interface MusicEvent {
  type: 'noteOn' | 'noteOff' | 'retrigger' | 'chordOn' | 'chordOff' | 'chordRetrigger' | 'allNotesOff' | 'controlChange' | 'pitchBend' | 'instrumentRequest' | 'parameterChange';
  source: string; performer: number; channel: number; time: number;
  note?: number; notes?: Array<number | MusicNote>; velocity?: number; controller?: number; value?: number;
  action?: 'previous' | 'next' | 'random';
  parameter?: 'reverb' | 'lowPass' | 'delay' | 'compression';
}
export interface PerformerOptions {
  channel?: number; operatingMode?: number; chord?: boolean; muted?: boolean; instrumentGestures?: boolean;
  noteController?: 'roll' | 'pitch' | 'yaw'; octaveController?: 'roll' | 'pitch' | 'yaw'; sharpController?: string;
  octaveLow?: number; octaveHigh?: number;
  headNoteRangeDegrees?: number; headVerticalRangeDegrees?: number; headVerticalOffsetDegrees?: number;
  lipRange?: number; mouthDynamics?: string; mouthCutOff?: number; maximumAmplitude?: number;
  harmonyMode?: 'free-range' | 'global-key'; tonic?: number | string; keyScale?: string; emojiMood?: string;
  pitchBend?: boolean; stereoPan?: boolean; arpeggioRate?: 'auto' | 'slow' | 'medium' | 'fast';
  mode?: 'face' | 'hands'; handPinch?: number; root?: number;
  drawEyes?: boolean; eyebrowStyle?: string; lipStyle?: string; photoSensitive?: boolean;
  [option: string]: unknown;
}
export interface CameraStartOptions {
  deviceId?: string;
  /** Borrowed streams are never stopped by the SDK. */
  stream?: MediaStream;
  video?: HTMLVideoElement;
  constraints?: MediaTrackConstraints;
  onEnded?: () => void;
}
export interface Tracker {
  load(): Promise<void>;
  detect(video: HTMLVideoElement, time: number): TrackingPrediction[] | Promise<TrackingPrediction[]>;
  close(): void;
}
export interface TrackingOptions {
  mode?: 'face' | 'hands'; maxPerformers?: number; mirrored?: boolean;
  wasmPath?: string; modelAssetPath?: string; delegate?: 'CPU' | 'GPU';
  createDetector?: (options: TrackingOptions) => Promise<{
    close(): void;
    detectForVideo?(video: HTMLVideoElement, timestampMs: number): unknown;
    recognizeForVideo?(video: HTMLVideoElement, timestampMs: number): unknown;
  }>;
}
export interface PhotosynthOptions extends TrackingOptions {
  framesPerSecond?: number; trackingTimeoutMs?: number; bpm?: number;
  pauseWhenHidden?: boolean;
  visibilityDocument?: Document;
  /** When true, the host drives arpeggios through tick(timeMs). */
  externalClock?: boolean;
  performer?: PerformerOptions; performers?: PerformerOptions[];
  now?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
  camera?: import('./camera.js').CameraSession;
  createTracker?: () => Tracker;
  mediaDevices?: MediaDevices;
  createVideo?: () => HTMLVideoElement;
}
export interface PhotosynthConfiguration { version: 1; performers: PerformerOptions[] }
export interface PerformerFrame {
  id: string; index: number; tracked: boolean; prediction: TrackingPrediction | null;
  note: number; velocity: number; emoji?: string; mouthCurvePosition?: number;
}
export interface PhotosynthFrame { time: number; predictions: TrackingPrediction[]; performers: PerformerFrame[] }
export type PhotosynthState = 'idle' | 'loading' | 'running' | 'error' | 'disposed';
