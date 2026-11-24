import type { CameraStartOptions } from './types.js';
export declare const ERROR_NO_CAMERAS: string;
export declare const detectCameras: () => Promise<MediaDeviceInfo[]>;
export declare const filterVideoCameras: (devices: MediaDeviceInfo[]) => MediaDeviceInfo[];
export declare const fetchVideoCameras: () => Promise<MediaDeviceInfo[]>;
export declare const setupCamera: (video?: HTMLVideoElement, deviceId?: string, enableAudio?: boolean, timeOut?: number, cameraLabel?: string) => Promise<MediaStream>;
export declare const loadCamera: (video: HTMLVideoElement, deviceId?: string, name?: string) => Promise<MediaStream>;
export declare const findBestCamera: (store: { has(key: string): boolean; getItem(key: string): any; removeItem(key: string): void }, video: HTMLVideoElement, onStatus?: (message: string) => void) => Promise<{ camera: MediaStream; videoCameraDevices: MediaDeviceInfo[]; saved: boolean; attempts: Record<string, boolean> }>;
export declare class CameraSession {
 constructor(options?: { mediaDevices?: MediaDevices; createVideo?: () => HTMLVideoElement });
 readonly stream?: MediaStream;
 readonly video?: HTMLVideoElement;
 devices(): Promise<MediaDeviceInfo[]>;
 open(options?: CameraStartOptions): Promise<HTMLVideoElement>;
 close(): void;
}
