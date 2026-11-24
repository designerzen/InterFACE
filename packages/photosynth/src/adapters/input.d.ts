import type { Photosynth } from '../runtime.js';
import type { PhotosynthOptions, PhotosynthConfiguration, CameraStartOptions, MusicEvent } from '../types.js';
export interface InputCommandFields {
 type: string; number: number; channel: number; velocity: number; value: number;
 pitchBend: number; startAt: number; time: number; from: string; inputId: string; text: string;
}
export interface HostInput extends EventTarget {
 readonly uuid: string; readonly now: number; options: Record<string, any>;
 dispatch(command: any, origin?: object): void;
 setAsConnected(): void; setAsDisconnected(): void;
}
export interface PhotosynthInputOptions {
 runtime?: Photosynth; photosynth?: PhotosynthOptions;
 configuration?: PhotosynthConfiguration; camera?: CameraStartOptions;
 now?: () => number; [option: string]: unknown;
}
export interface PhotosynthInput {
 readonly runtime: Photosynth; readonly name: string; readonly description: string;
 readonly requiresConnectionControl: true;
 hasMidiInput(): boolean; updateTime(nowSeconds: number): void; startClock(): void; stopClock(): void;
 connect(): Promise<void>; disconnect(): Promise<void>;
 createGui(): Promise<HTMLElement>; destroyGui(): Promise<void>; destroy(): void;
}
export declare const toInputCommandFields: (event: MusicEvent, inputId: string) => InputCommandFields;
export declare function createPhotosynthInputClass<T extends new(options?: any) => HostInput>(dependencies: {
 AbstractInput: T; musicalCommand: (fields: InputCommandFields) => any;
}): new(options?: PhotosynthInputOptions) => InstanceType<T> & PhotosynthInput;
