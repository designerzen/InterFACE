/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { backend_util, SparseReshape, util } from '@tensorflow/tfjs-core';
let wasmSparseReshape;
function setup(backend) {
    wasmSparseReshape = backend.wasm.cwrap(SparseReshape, null /*void*/, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
    ]);
}
function sparseReshape(args) {
    const { backend, inputs } = args;
    const { inputIndices, inputShape, newShape } = inputs;
    if (inputIndices.shape.length !== 2) {
        throw new Error(`Input indices should be a matrix but received shape
        ${inputIndices.shape}`);
    }
    if (inputShape.shape.length !== 1) {
        throw new Error(`Input shape should be a vector but received shape
        ${inputShape.shape}`);
    }
    if (newShape.shape.length !== 1) {
        throw new Error(`Target shape should be a vector but received shape ${newShape.shape}`);
    }
    const inputIndicesId = backend.dataIdMap.get(inputIndices.dataId).id;
    const inputShapeId = backend.dataIdMap.get(inputShape.dataId).id;
    const newShapeId = backend.dataIdMap.get(newShape.dataId).id;
    const nnz = inputIndices.shape[0];
    const outputRank = util.sizeFromShape(newShape.shape);
    const newIndices = backend.makeOutput([nnz, outputRank], inputIndices.dtype);
    const newIndicesId = backend.dataIdMap.get(newIndices.dataId).id;
    const outputShape = backend.makeOutput([outputRank], newShape.dtype);
    const outputShapeId = backend.dataIdMap.get(outputShape.dataId).id;
    const exceptionValues = backend.makeOutput([3], 'int32');
    const exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
    wasmSparseReshape(inputIndicesId, inputShapeId, newShapeId, nnz, newIndicesId, outputShapeId, exceptionValuesId);
    const exceptionValuesArray = backend.readSync(exceptionValues.dataId);
    let exceptionMessage;
    switch (exceptionValuesArray[0]) {
        case 0: {
            exceptionMessage =
                backend_util.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(exceptionValuesArray[1], exceptionValuesArray[2]);
            break;
        }
        case 1: {
            exceptionMessage =
                backend_util.getSparseReshapeNegativeOutputDimErrorMessage(exceptionValuesArray[1], exceptionValuesArray[2]);
            break;
        }
        case 2:
            exceptionMessage =
                backend_util.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage();
            break;
        case 3: {
            const inputShapeValues = Array.from(backend.readSync(inputShape.dataId)), outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
            exceptionMessage =
                backend_util.getSparseReshapeInputOutputMultipleErrorMessage(inputShapeValues, outputShapeValues);
            break;
        }
        case 4: {
            const inputShapeValues = Array.from(backend.readSync(inputShape.dataId)), outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
            exceptionMessage =
                backend_util.getSparseReshapeInputOutputMismatchErrorMessage(inputShapeValues, outputShapeValues);
            break;
        }
        default:
            exceptionMessage = '';
    }
    backend.disposeData(exceptionValues.dataId);
    if (exceptionMessage) {
        backend.disposeData(newIndices.dataId);
        backend.disposeData(outputShape.dataId);
        throw new Error(exceptionMessage);
    }
    return [newIndices, outputShape];
}
export const sparseReshapeConfig = {
    kernelName: SparseReshape,
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: sparseReshape
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BhcnNlUmVzaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL1NwYXJzZVJlc2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBNEIsYUFBYSxFQUFtQyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUluSSxJQUFJLGlCQUdrQyxDQUFDO0FBRXZDLFNBQVMsS0FBSyxDQUFDLE9BQW9CO0lBQ2pDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ25FLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsSUFHdEI7SUFDQyxNQUFNLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxHQUFHLElBQUksQ0FBQztJQUMvQixNQUFNLEVBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFcEQsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQztVQUNWLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQztVQUNWLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDL0IsTUFB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QUFDLENBQUM7WUFDN0MsTUFBTTtTQUNQO1FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNOLE1BQU0sZ0JBQWdCLEdBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFlLENBQUMsRUFDM0QsaUJBQWlCLEdBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQWUsQ0FBQyxDQUFDO1lBQ3pFLGdCQUFnQjtnQkFDWixZQUFZLENBQUMsK0NBQStDLENBQ3hELGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDN0MsTUFBTTtTQUNQO1FBQ0Q7WUFDRSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7S0FDekI7SUFFRCxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxJQUFJLGdCQUFnQixFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUNuQztJQUVELE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFpQjtJQUMvQyxVQUFVLEVBQUUsYUFBYTtJQUN6QixXQUFXLEVBQUUsTUFBTTtJQUNuQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsYUFBaUM7Q0FDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuYywgU3BhcnNlUmVzaGFwZSwgU3BhcnNlUmVzaGFwZUlucHV0cywgVGVuc29ySW5mbywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtCYWNrZW5kV2FzbX0gZnJvbSAnLi4vYmFja2VuZF93YXNtJztcblxubGV0IHdhc21TcGFyc2VSZXNoYXBlOiAoXG4gICAgaW5wdXRJbmRpY2VzSWQ6IG51bWJlciwgaW5wdXRTaGFwZUlkOiBudW1iZXIsIG5ld1NoYXBlSWQ6IG51bWJlcixcbiAgICBubno6IG51bWJlciwgbmV3SW5kaWNlc0lkOiBudW1iZXIsIG91dHB1dFNoYXBlSWQ6IG51bWJlcixcbiAgICBleGNlcHRpb25WYWx1ZXNJZDogbnVtYmVyKSA9PiB2b2lkO1xuXG5mdW5jdGlvbiBzZXR1cChiYWNrZW5kOiBCYWNrZW5kV2FzbSk6IHZvaWQge1xuICB3YXNtU3BhcnNlUmVzaGFwZSA9IGJhY2tlbmQud2FzbS5jd3JhcChTcGFyc2VSZXNoYXBlLCBudWxsIC8qdm9pZCovLCBbXG4gICAgJ251bWJlcicsICAvLyBpbnB1dEluZGljZXNJZFxuICAgICdudW1iZXInLCAgLy8gaW5wdXRTaGFwZUlkXG4gICAgJ251bWJlcicsICAvLyBuZXdTaGFwZUlkXG4gICAgJ251bWJlcicsICAvLyBubnpcbiAgICAnbnVtYmVyJywgIC8vIG5ld0luZGljZXNJZFxuICAgICdudW1iZXInLCAgLy8gb3V0cHV0U2hhcGVJZFxuICAgICdudW1iZXInLCAgLy8gZXhjZXB0aW9uVmFsdWVzSWRcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIHNwYXJzZVJlc2hhcGUoYXJnczoge1xuICBiYWNrZW5kOiBCYWNrZW5kV2FzbSxcbiAgaW5wdXRzOiBTcGFyc2VSZXNoYXBlSW5wdXRzLFxufSk6IFtUZW5zb3JJbmZvLCBUZW5zb3JJbmZvXSB7XG4gIGNvbnN0IHtiYWNrZW5kLCBpbnB1dHN9ID0gYXJncztcbiAgY29uc3Qge2lucHV0SW5kaWNlcywgaW5wdXRTaGFwZSwgbmV3U2hhcGV9ID0gaW5wdXRzO1xuXG4gIGlmIChpbnB1dEluZGljZXMuc2hhcGUubGVuZ3RoICE9PSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCBpbmRpY2VzIHNob3VsZCBiZSBhIG1hdHJpeCBidXQgcmVjZWl2ZWQgc2hhcGVcbiAgICAgICAgJHtpbnB1dEluZGljZXMuc2hhcGV9YCk7XG4gIH1cbiAgaWYgKGlucHV0U2hhcGUuc2hhcGUubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCBzaGFwZSBzaG91bGQgYmUgYSB2ZWN0b3IgYnV0IHJlY2VpdmVkIHNoYXBlXG4gICAgICAgICR7aW5wdXRTaGFwZS5zaGFwZX1gKTtcbiAgfVxuICBpZiAobmV3U2hhcGUuc2hhcGUubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVGFyZ2V0IHNoYXBlIHNob3VsZCBiZSBhIHZlY3RvciBidXQgcmVjZWl2ZWQgc2hhcGUgJHtuZXdTaGFwZS5zaGFwZX1gKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0SW5kaWNlc0lkID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KGlucHV0SW5kaWNlcy5kYXRhSWQpLmlkO1xuICBjb25zdCBpbnB1dFNoYXBlSWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQoaW5wdXRTaGFwZS5kYXRhSWQpLmlkO1xuICBjb25zdCBuZXdTaGFwZUlkID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KG5ld1NoYXBlLmRhdGFJZCkuaWQ7XG5cbiAgY29uc3Qgbm56ID0gaW5wdXRJbmRpY2VzLnNoYXBlWzBdO1xuICBjb25zdCBvdXRwdXRSYW5rID0gdXRpbC5zaXplRnJvbVNoYXBlKG5ld1NoYXBlLnNoYXBlKTtcblxuICBjb25zdCBuZXdJbmRpY2VzID0gYmFja2VuZC5tYWtlT3V0cHV0KFtubnosIG91dHB1dFJhbmtdLCBpbnB1dEluZGljZXMuZHR5cGUpO1xuICBjb25zdCBuZXdJbmRpY2VzSWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQobmV3SW5kaWNlcy5kYXRhSWQpLmlkO1xuXG4gIGNvbnN0IG91dHB1dFNoYXBlID0gYmFja2VuZC5tYWtlT3V0cHV0KFtvdXRwdXRSYW5rXSwgbmV3U2hhcGUuZHR5cGUpO1xuICBjb25zdCBvdXRwdXRTaGFwZUlkID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KG91dHB1dFNoYXBlLmRhdGFJZCkuaWQ7XG5cbiAgY29uc3QgZXhjZXB0aW9uVmFsdWVzID0gYmFja2VuZC5tYWtlT3V0cHV0KFszXSwgJ2ludDMyJyk7XG4gIGNvbnN0IGV4Y2VwdGlvblZhbHVlc0lkID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KGV4Y2VwdGlvblZhbHVlcy5kYXRhSWQpLmlkO1xuXG4gIHdhc21TcGFyc2VSZXNoYXBlKFxuICAgICAgaW5wdXRJbmRpY2VzSWQsIGlucHV0U2hhcGVJZCwgbmV3U2hhcGVJZCwgbm56LCBuZXdJbmRpY2VzSWQsXG4gICAgICBvdXRwdXRTaGFwZUlkLCBleGNlcHRpb25WYWx1ZXNJZCk7XG5cbiAgY29uc3QgZXhjZXB0aW9uVmFsdWVzQXJyYXkgPVxuICAgICAgYmFja2VuZC5yZWFkU3luYyhleGNlcHRpb25WYWx1ZXMuZGF0YUlkKSBhcyBJbnQzMkFycmF5O1xuXG4gIGxldCBleGNlcHRpb25NZXNzYWdlOiBzdHJpbmc7XG4gIHN3aXRjaCAoZXhjZXB0aW9uVmFsdWVzQXJyYXlbMF0pIHtcbiAgICBjYXNlIDA6IHtcbiAgICAgIGV4Y2VwdGlvbk1lc3NhZ2UgPVxuICAgICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VSZXNoYXBlTXVsdGlwbGVOZWdhdGl2ZU9uZU91dHB1dERpbUVycm9yTWVzc2FnZShcbiAgICAgICAgICAgICAgZXhjZXB0aW9uVmFsdWVzQXJyYXlbMV0sIGV4Y2VwdGlvblZhbHVlc0FycmF5WzJdKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDE6IHtcbiAgICAgIGV4Y2VwdGlvbk1lc3NhZ2UgPVxuICAgICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VSZXNoYXBlTmVnYXRpdmVPdXRwdXREaW1FcnJvck1lc3NhZ2UoXG4gICAgICAgICAgICAgIGV4Y2VwdGlvblZhbHVlc0FycmF5WzFdLCBleGNlcHRpb25WYWx1ZXNBcnJheVsyXSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAyOlxuICAgICAgZXhjZXB0aW9uTWVzc2FnZSA9XG4gICAgICAgICAgYmFja2VuZF91dGlsLmdldFNwYXJzZVJlc2hhcGVFbXB0eVRlbnNvclplcm9PdXRwdXREaW1FcnJvck1lc3NhZ2UoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzoge1xuICAgICAgY29uc3QgaW5wdXRTaGFwZVZhbHVlcyA9XG4gICAgICAgICAgQXJyYXkuZnJvbShiYWNrZW5kLnJlYWRTeW5jKGlucHV0U2hhcGUuZGF0YUlkKSBhcyBJbnQzMkFycmF5KSxcbiAgICAgICAgICAgIG91dHB1dFNoYXBlVmFsdWVzID1cbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGJhY2tlbmQucmVhZFN5bmMob3V0cHV0U2hhcGUuZGF0YUlkKSBhcyBJbnQzMkFycmF5KTtcbiAgICAgIGV4Y2VwdGlvbk1lc3NhZ2UgPVxuICAgICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VSZXNoYXBlSW5wdXRPdXRwdXRNdWx0aXBsZUVycm9yTWVzc2FnZShcbiAgICAgICAgICAgICAgaW5wdXRTaGFwZVZhbHVlcywgb3V0cHV0U2hhcGVWYWx1ZXMpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgNDoge1xuICAgICAgY29uc3QgaW5wdXRTaGFwZVZhbHVlcyA9XG4gICAgICAgICAgQXJyYXkuZnJvbShiYWNrZW5kLnJlYWRTeW5jKGlucHV0U2hhcGUuZGF0YUlkKSBhcyBJbnQzMkFycmF5KSxcbiAgICAgICAgICAgIG91dHB1dFNoYXBlVmFsdWVzID1cbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGJhY2tlbmQucmVhZFN5bmMob3V0cHV0U2hhcGUuZGF0YUlkKSBhcyBJbnQzMkFycmF5KTtcbiAgICAgIGV4Y2VwdGlvbk1lc3NhZ2UgPVxuICAgICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VSZXNoYXBlSW5wdXRPdXRwdXRNaXNtYXRjaEVycm9yTWVzc2FnZShcbiAgICAgICAgICAgICAgaW5wdXRTaGFwZVZhbHVlcywgb3V0cHV0U2hhcGVWYWx1ZXMpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6XG4gICAgICBleGNlcHRpb25NZXNzYWdlID0gJyc7XG4gIH1cblxuICBiYWNrZW5kLmRpc3Bvc2VEYXRhKGV4Y2VwdGlvblZhbHVlcy5kYXRhSWQpO1xuICBpZiAoZXhjZXB0aW9uTWVzc2FnZSkge1xuICAgIGJhY2tlbmQuZGlzcG9zZURhdGEobmV3SW5kaWNlcy5kYXRhSWQpO1xuICAgIGJhY2tlbmQuZGlzcG9zZURhdGEob3V0cHV0U2hhcGUuZGF0YUlkKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXhjZXB0aW9uTWVzc2FnZSk7XG4gIH1cblxuICByZXR1cm4gW25ld0luZGljZXMsIG91dHB1dFNoYXBlXTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwYXJzZVJlc2hhcGVDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU3BhcnNlUmVzaGFwZSxcbiAgYmFja2VuZE5hbWU6ICd3YXNtJyxcbiAgc2V0dXBGdW5jOiBzZXR1cCxcbiAga2VybmVsRnVuYzogc3BhcnNlUmVzaGFwZSBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19