export declare const ARPEGGIO_FAST_BPM_THRESHOLD = 90;
export declare const ARPEGGIO_GRID_QUARTER_NOTE = "quarter-note";
export declare const ARPEGGIO_GRID_HALF_NOTE = "half-note";
export declare const ARPEGGIO_GRID_BAR = "bar";
export declare const ARPEGGIO_GRID_CLOCK = "clock";
export declare const DEFAULT_CLOCK_DIVISIONS_PER_BAR = 24;
export declare const ARPEGGIO_VARIATION = "arpeggio";
export declare const HARP_ARPEGGIO_VARIATION = "harp";
export declare const ARPEGGIO_RATE_AUTO = "auto";
export declare const ARPEGGIO_RATE_SLOW = "slow";
export declare const ARPEGGIO_RATE_MEDIUM = "medium";
export declare const ARPEGGIO_RATE_FAST = "fast";
export declare const normaliseArpeggioRate: (rate: any) => any;
export declare const getArpeggioRateLabel: (rate: any) => any;
export declare const isArpeggioPlayMode: (playMode: any) => boolean;
export declare const hasPresentArpeggioPlayer: (people?: any[]) => boolean;
export declare const getArpeggioTimingOptionsForRate: (rate: any, playMode?: string) => {
    clockStep: number;
    grid?: undefined;
} | {
    clockStep?: undefined;
    grid: string;
} | {
    clockStep?: undefined;
    grid?: undefined;
};
export declare const getArpeggioGridForBPM: (bpm: any, forceBar?: boolean) => "bar" | "half-note" | "quarter-note";
export declare const getArpeggioTriggerIntervalMs: (bpm: any, grid?: string) => number;
export declare const getArpeggioGateMs: (bpm: any, { grid, gateRatio, minimumGateMs, maximumGateMs, minimumRestMs }?: {
    gateRatio?: number | undefined;
    grid?: string | undefined;
    maximumGateMs?: number | undefined;
    minimumGateMs?: number | undefined;
    minimumRestMs?: number | undefined;
}) => number;
export declare const getArpeggioTiming: (bpm: any, options?: {}) => {
    grid: any;
    intervalMs: number;
    gateMs: number;
    shouldTrigger: boolean;
};
export declare class Arpeggio {
    enabled: boolean;
    variation: string;
    config: Readonly<{
        octaveSpan: 1;
        clockStep: 0;
    }>;
    configure(value?: boolean): Readonly<{
        octaveSpan: 1;
        clockStep: 0;
    }>;
    getSequence(chordArray?: any[]): any[];
    getTiming(bpm: any, options?: {}): {
        grid: any;
        intervalMs: number;
        gateMs: number;
        shouldTrigger: boolean;
    };
}
