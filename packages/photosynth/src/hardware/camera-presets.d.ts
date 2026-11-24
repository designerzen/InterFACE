export declare const CAMERA_PRESETS: ({
    name: string;
    deviceIds: string[];
    match: RegExp;
    video: {
        width: {
            exact: number;
        };
        height: {
            exact: number;
        };
        frameRate: {
            ideal: number;
            max: number;
        };
    };
    videoModes?: undefined;
} | {
    deviceIds?: undefined;
    video?: undefined;
    name: string;
    match: RegExp;
    videoModes: {
        width: {
            ideal: number;
            max: number;
        };
        height: {
            ideal: number;
            max: number;
        };
        frameRate: {
            ideal: number;
            max: number;
        };
        aspectRatio: {
            ideal: number;
        };
    }[];
})[];
