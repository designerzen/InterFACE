export declare const LIP_SENSITIVITY_INHERIT = "inherit";
export declare const DEFAULT_LIP_RANGE = 100;
export declare const DEFAULT_MOUTH_GATE = 6;
export declare const MAX_MOUTH_GATE = 40;
export declare const MOUTH_CURVE_CUSTOM = "custom";
export declare const MAX_MOUTH_CURVE_POINTS = 8;
export declare const MOUTH_CURVE_MIN_GAP = 2;
export declare const MOUTH_DYNAMICS_PRESETS: {
    id: string;
    label: string;
    description: string;
    points: number[][];
}[];
export declare const DEFAULT_MOUTH_DYNAMICS = "gentle";
export declare const normaliseLipRange: (value: any) => any;
export declare const normaliseLipRangeOverride: (value: any) => any;
export declare const normaliseMouthGate: (value: any) => number;
/**
 * Sorts, clamps and spaces handles, pinning the ends to silence and full volume
 * @returns {Array<Array<Number>>|null} null when the value is not a curve
 */
export declare const parseMouthCurve: (value: any) => Array<Array<number>> | null;
export declare const serialiseMouthCurve: (points: any) => string;
export declare const normaliseMouthDynamics: (value: any) => string;
export declare const normaliseMouthDynamicsOverride: (value: any) => string;
export declare const getMouthDynamicsPresetId: (value: any) => string;
export declare const formatMouthDynamics: (value: any) => string;
export declare const evaluateMouthCurve: (points: any, t: any) => number;
export declare const resolveLipSetting: (options: any, key: any) => any;
export declare const formatLipSetting: (key: any, value: any) => string;
export declare const normaliseLipOptions: (options: any) => any;
/**
 * Where an opening sits along the curve's x axis, 0 at the gate and 1 at full range
 */
export declare const getLipCurvePosition: (opening: any, options: {} | undefined, rawOpening: any) => number;
export declare const getLipVolume: (opening: any, options: {} | undefined, rawOpening: any) => number;
