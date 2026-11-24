import type { Photosynth } from './runtime.js';
export declare class PhotosynthElement extends HTMLElement {
 runtime: Photosynth;
 start(): Promise<void>;
 stop(): void;
 refreshCameras(): Promise<void>;
}
export declare const definePhotosynthElement: (registry?: CustomElementRegistry) => void;
declare global { interface HTMLElementTagNameMap { 'photosynth-input': PhotosynthElement } }
