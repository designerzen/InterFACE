/** Musical decisions only. Events use normalized velocity and monotonic milliseconds. */
export declare const planPersonPerformance: (person: any, { chord, repeat, time }?: {
    chord?: boolean | undefined;
    repeat?: boolean | undefined;
    time?: number | undefined;
}) => {
    events: any[];
    notes: any;
};
/** Expand grouped chord intent for hosts whose inputs accept individual notes. */
export declare const expandMusicEvent: (event: any) => any;
