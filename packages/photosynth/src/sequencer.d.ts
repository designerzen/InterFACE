/** Clock-driven note events; hosts may drive tick() without a camera or audio engine. */
export declare class EventSequencer {
    lanes: Map<any, any>;
    accept(events: any, performer: any, bpm: any): any;
    tick(time: any): any[];
    release(source: any, time: any): any[];
    reset(time: any): any[];
}
