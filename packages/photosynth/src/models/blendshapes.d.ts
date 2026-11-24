export declare const BLENDSHAPE_IDS: string[];
/**
 * Create a stable score reader for MediaPipe blendshape categories. Category
 * names are authoritative; the optional index only supports older fixtures and
 * compatible model output that omits names.
 */
export declare const createBlendshapeScoreReader: (categories?: any[]) => (categoryName: any, legacyIndex: any) => any;
/**
 * Infer continuous visible-expression parameters from MediaPipe's facial
 * action blendshapes. These are expression strengths, not claims about a
 * person's internal emotional state.
 */
export declare const inferExpressionParameters: (categories: any) => {
    happiness: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    neutral: number;
    mouthSmile: number;
    mouthSmileLeft: any;
    mouthSmileRight: any;
    cheekSquint: number;
    mouthFrown: number;
    browDown: number;
    browInnerUp: any;
    browOuterUp: number;
    eyeSquint: number;
    eyeWide: number;
    jawOpen: any;
    mouthPress: number;
    mouthStretch: number;
    noseSneer: number;
};
/**
 * Take in a BlendShape ID and get it's mirror
 * tihs is useful when trying to "mirror" the user
 */
export declare const swapEyeSide: (feature: any) => any;
