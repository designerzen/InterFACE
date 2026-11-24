/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
export declare const MEDIAPIPE_FACE_MESH_NUM_KEYPOINTS = 468;
export declare const MEDIAPIPE_FACE_MESH_NUM_KEYPOINTS_WITH_IRISES = 478;
export declare const LIPS_CONNECTIONS: number[][];
export declare const LEFT_EYE_CONNECTIONS: number[][];
export declare const LEFT_EYEBROW_CONNECTIONS: number[][];
export declare const LEFT_IRIS_CONNECTIONS: number[][];
export declare const RIGHT_EYE_CONNECTIONS: number[][];
export declare const RIGHT_EYEBROW_CONNECTIONS: number[][];
export declare const RIGHT_IRIS_CONNECTIONS: number[][];
export declare const FACE_OVAL_CONNECTIONS: number[][];
export declare const MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR: {
    lips: any;
    leftEye: any;
    leftEyebrow: any;
    leftIris: any;
    rightEye: any;
    rightEyebrow: any;
    rightIris: any;
    faceOval: any;
};
export declare const MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS: number[][];
export declare const MEDIAPIPE_FACE_MESH_KEYPOINTS: Map<any, any>;
export declare const FACE_CONTOURS_LIPS: number[];
export declare const FACE_CONTOURS_OUTER_TOP_LIP: number[];
export declare const LIP_PATH_OUTER: number[];
export declare const LIP_PATH_INNER: number[];
export declare const LEFT_EYE_PATH: number[];
export declare const RIGHT_EYE_PATH: number[];
export declare const LEFT_IRIS_PATH: number[];
export declare const RIGHT_IRIS_PATH: number[];
export declare const MESH_ANNOTATIONS: {
    silhouette: number[];
    lipsUpperOuter: number[];
    lipsLowerOuter: number[];
    lipsUpperInner: number[];
    lipsLowerInner: number[];
    rightEyeUpper0: number[];
    rightEyeLower0: number[];
    rightEyeUpper1: number[];
    rightEyeLower1: number[];
    rightEyeUpper2: number[];
    rightEyeLower2: number[];
    rightEyeLower3: number[];
    rightEyebrowUpper: number[];
    rightEyebrowLower: number[];
    rightEyeIris: number[];
    leftEyeUpper0: number[];
    leftEyeLower0: number[];
    leftEyeUpper1: number[];
    leftEyeLower1: number[];
    leftEyeUpper2: number[];
    leftEyeLower2: number[];
    leftEyeLower3: number[];
    leftEyebrowUpper: number[];
    leftEyebrowLower: number[];
    leftEyeIris: number[];
    midwayBetweenEyes: number[];
    noseTip: number[];
    noseBottom: number[];
    noseRightCorner: number[];
    noseLeftCorner: number[];
    rightCheek: number[];
    leftCheek: number[];
};
