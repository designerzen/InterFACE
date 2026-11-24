/**
 * Live control signals, updated in place with constant memory and no frame history.
 * timeNow is monotonic milliseconds (never prediction.time: some models use video seconds).
 * yaw/pitch/roll retain the model's normalized units, NOT radians or degrees.
 * x/y are face-size units from the calibrated centre; scale is log(size / neutralSize),
 * an apparent approach/retreat estimate, not metric depth. Derivatives use seconds.
 * inertia is a low-pass velocity tail for effects, not physical mass or momentum.
 * Consumers should treat these objects as read-only and check tracked before use.
 */
export default class PersonMotion {
    #private;
    x: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    y: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    scale: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    yaw: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    pitch: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    roll: {
        value: number;
        extension: number;
        delta: number;
        velocity: number;
        speed: number;
        acceleration: number;
        inertia: number;
        direction: number;
        reversed: boolean;
        travel: number;
        peakSpeed: number;
        previousValue: number;
        previousVelocity: number;
        previousDirection: number;
        origin: number;
    };
    tracked: boolean;
    sampleCount: number;
    deltaTime: number;
    translationSpeed: number;
    rotationSpeed: number;
    translationExtension: number;
    rotationExtension: number;
    constructor(options?: {});
    reset(): this;
    invalidate(): this;
    calibrate(): boolean;
    update(prediction: any, timeNow: any): this;
}
