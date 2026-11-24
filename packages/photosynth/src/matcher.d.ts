import type { Performer as Person } from './performer.js';
export declare class PredictionMatcher {
    normaliseBoundingBox(box: any): {
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
        area: number;
        centerX: number;
        centerY: number;
    } | null;
    getBoundingBoxOverlap(boxA: any, boxB: any): number;
    getBoundingBoxMatchScore(predictionBox: any, personBox: any, person: any): {
        distance: number;
        overlap: number;
        score: number;
    } | null;
    getClosestTrackedPersonIndex(predictionBox: any, normalisedPeople: any, activePeople: any, assignedPersonIndexes: any): number;
    /**
     * Match this frame's model predictions to stable Person slots.
     * Model output order can change, so score every possible pair before assigning.
     * @param {Array<Object>} predictions
     * @param {Array<Person>} activePeople
     * @returns {Array<{prediction:Object, predictionIndex:Number, person:Person, personIndex:Number}>}
     */
    matchPredictionsToPeople(predictions?: Array<Object>, activePeople?: Array<Person>): Array<{
        prediction: Object;
        predictionIndex: number;
        person: Person;
        personIndex: number;
    }>;
}
