export declare const HARMONY_MODE_GLOBAL_KEY = "global-key";
export declare const HARMONY_MODE_FREE_RANGE = "free-range";
export declare const PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS = 0;
export declare const PERSON_TYPE_CHROMATIC = 1;
export declare const PERSON_TYPE_ARPEGGIO = 2;
export declare const PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS = 3;
export declare const PERSON_TYPE_HARP = 4;
export declare const PERSON_TYPE_HARP_CIRCLE_OF_FIFTHS = 5;
export declare const PERSON_TYPE_DATA: ({
    name: string;
    description: string;
    arpeggiate: boolean;
    noteSequence: string;
    leftFacingKeys: string[];
    rightFacingKeys: string[];
    performanceMode?: undefined;
} | {
    name: string;
    description: string;
    arpeggiate: boolean;
    performanceMode: string;
    noteSequence: string;
    leftFacingKeys: string[];
    rightFacingKeys: string[];
})[];
export declare const normalisePersonOperatingMode: (operatingMode?: number) => number;
export declare const configurePersonKey: (person: any) => void;
/**
 * Configure a Person to act in a certain way.
 * This doesn't affect the control mechanism, only
 * how the control mechanism sounds
 *
 * @param {Person} person
 * @param {Number|String} operatingMode
 */
export declare const configurePersonByOperatingMode: (person: Person, operatingMode?: number | string) => void;
/**
 * Pass an index and configure this Person with the
 * appropriate userModes and data
 *
 * @param {Person} person
 * @param {Array<Person>} people
 */
export declare const configurePersonByIndex: (person: Person, people: Array<Person>) => void;
