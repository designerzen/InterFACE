/**
 * Main entry point for emoji recognition
 * Routes to accurate or original implementation based on USE_ACCURATE_DETECTION flag
 * @param {Object} prediction - the ML prediction from mediaPipe
 * @param {Object} options - configuration options
 * @returns {string} emoji string
 */
export declare const recogniseEmoji: (prediction: Object, options: Object, emotionState: any) => string;
export declare const recogniseEmojiFromFaceModel: (prediction: any, options?: {}) => any;
/**
 * Convert a face model into an emoji using ordered logic rules.
 * This mirrors the original priority tree while making each decision testable.
 * @param {Object} prediction - the ML prediction from mediaPipe
 * @param {Object} options - configuration options
 */
export declare const recogniseEmojiFromFaceModelLogical: (prediction: Object, options?: Object) => any;
/**
 * EmojiDetector class manages emoji detection state per person
 * Each person instance gets their own detector with independent state
 */
export declare class EmojiDetector {
    previousEmoji: string;
    frameCount: number;
    candidateEmoji: any;
    candidateSamples: number;
    lastSwitchAt: number;
    lastSourceTimestamp: any;
    lastFreshObservationAt: any;
    signalFilters: Map<any, any>;
    filteredPrediction: any;
    leftEyeClosed: boolean;
    rightEyeClosed: boolean;
    isMirrored: boolean;
    constructor();
    filterPrediction(prediction: any): any;
    getRequiredSamples(currentEmoji: any, smileEvidence: any): 1 | 2;
    handleStalePrediction(observationTime: any): string;
    /**
     * Detect an emoji from a new model sample. Strong expressions react on the
     * first sample; ambiguous changes use one extra fresh inference sample.
     * Repeated cached render frames do not vote.
     */
    detect(prediction: any, options: {} | undefined, suppliedObservationTime: any): string;
    /**
     * Reset state (when switching people or restarting)
     */
    reset(): void;
    /**
     * Get current state for debugging
     */
    getState(): {
        previousEmoji: string;
        frameCount: number;
        candidateEmoji: any;
        candidateSamples: number;
        lastSwitchAt: number;
        smileEvidence: number;
    };
}
/**
 * Convert a face model into an emoji with improved accuracy
 * Uses composite emotion scoring, temporal smoothing, and stability checks
 * @param {Object} prediction - the ML prediction from mediaPipe
 * @param {Object} options - configuration options
 * @param {Object} emotionState - state object tracking emotion changes
 * @param {Object} debugMode - set to true to log prediction values
 */
export declare const recogniseEmojiFromFaceModelAccurate: (prediction: Object, options: Object, emotionState: Object, debugMode?: Object) => any;
