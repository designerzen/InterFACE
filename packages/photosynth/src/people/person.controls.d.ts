/**
 * Default head control input mechanism
 * Where looking left and right sets the Scale
 * Where looking up and down sets the octave
 * Rolling the head left sets the pitch
 * @param {Object} prediction
 * @param {Object} options
 * @returns
 */
export declare const convertHeadOrientationIntoNoteData: (prediction: Object, options: Object) => {
    octaveNumber: any;
    noteNumber: any;
    newOctave: any;
    afterTouch: number;
    pitchBend: number;
    isSharp: any;
};
export declare const PERSON_INPUT_MODE_HEAD_UP_DOWN_OCTAVE = 0;
export declare const PERSON_INPUT_MODE_HEAD_LEFT_RIGHT_OCTAVE = 1;
export declare const PERSON_INPUT_MODE_DATA: readonly (Readonly<{
    name: "UD";
    description: "Head up/down controls octave";
    controlMode: typeof convertHeadOrientationIntoNoteData;
    options: Readonly<{
        noteController: "roll";
        octaveController: "pitch";
        gateController: "mouth";
        pitchbendController: "leftSmirk";
        aftertouchController: "rightSmirk";
        sharpController: "isFacingRight";
    }>;
}> | Readonly<{
    name: "LR";
    description: "Head left/right controls octave";
    controlMode: typeof convertHeadOrientationIntoNoteData;
    options: Readonly<{
        noteController: "pitch";
        octaveController: "roll";
        gateController: "mouth";
        pitchbendController: "leftSmirk";
        aftertouchController: "rightSmirk";
        sharpController: "isFacingRight";
    }>;
}>)[];
export declare const normalisePersonInputMode: (inputMode?: number) => number;
export declare const getPersonInputModeData: (inputMode?: number) => Readonly<{
    name: "UD";
    description: "Head up/down controls octave";
    controlMode: typeof convertHeadOrientationIntoNoteData;
    options: Readonly<{
        noteController: "roll";
        octaveController: "pitch";
        gateController: "mouth";
        pitchbendController: "leftSmirk";
        aftertouchController: "rightSmirk";
        sharpController: "isFacingRight";
    }>;
}> | Readonly<{
    name: "LR";
    description: "Head left/right controls octave";
    controlMode: typeof convertHeadOrientationIntoNoteData;
    options: Readonly<{
        noteController: "pitch";
        octaveController: "roll";
        gateController: "mouth";
        pitchbendController: "leftSmirk";
        aftertouchController: "rightSmirk";
        sharpController: "isFacingRight";
    }>;
}>;
export declare const convertHeadRollToScaleAndPitchToOctaveAndYawToPitch: (prediction: any) => {
    octaveNumber: any;
    noteNumber: any;
    newOctave: any;
    afterTouch: number;
    pitchBend: number;
    isSharp: any;
};
export declare const convertHeadRollToOctaveAndPitchToScaleAndYawToPitch: (prediction: any) => {
    octaveNumber: any;
    noteNumber: any;
    newOctave: any;
    afterTouch: number;
    pitchBend: number;
    isSharp: any;
};
