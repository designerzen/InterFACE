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
import { StringSplit } from '@tensorflow/tfjs-core';
import { stringSplitImplCPU } from '../kernel_utils/shared';
function stringSplit(args) {
    const { backend, inputs, attrs } = args;
    const { input, delimiter } = inputs;
    const { skipEmpty } = attrs;
    const inputVals = backend.readSync(input.dataId);
    const delimiterVals = backend.readSync(delimiter.dataId);
    const [indices, values, shape] = stringSplitImplCPU(inputVals, delimiterVals[0], skipEmpty);
    const outputSize = values.length;
    const indicesOut = backend.makeOutput([outputSize, 2], 'int32');
    const indicesOutVals = backend.typedArrayFromHeap(indicesOut);
    indicesOutVals.set(indices);
    const valuesOut = backend.makeOutput([outputSize], 'string');
    const valuesOutData = backend.dataIdMap.get(valuesOut.dataId);
    valuesOutData.stringBytes = values;
    const shapeOut = backend.makeOutput([2], 'int32');
    const shapeOutVals = backend.typedArrayFromHeap(shapeOut);
    shapeOutVals.set(shape);
    return [indicesOut, valuesOut, shapeOut];
}
export const stringSplitConfig = {
    kernelName: StringSplit,
    backendName: 'wasm',
    kernelFunc: stringSplit
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nU3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2FzbS9zcmMva2VybmVscy9TdHJpbmdTcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLFdBQVcsRUFBa0QsTUFBTSx1QkFBdUIsQ0FBQztBQUc3SCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUUxRCxTQUFTLFdBQVcsQ0FBQyxJQUlwQjtJQUNDLE1BQU0sRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztJQUN0QyxNQUFNLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUNsQyxNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRTFCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBaUIsQ0FBQztJQUNqRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQWlCLENBQUM7SUFFekUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQzFCLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVqQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5RCxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUQsYUFBYSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7SUFFbkMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRCxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXhCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBaUI7SUFDN0MsVUFBVSxFQUFFLFdBQVc7SUFDdkIsV0FBVyxFQUFFLE1BQU07SUFDbkIsVUFBVSxFQUFFLFdBQStCO0NBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBTdHJpbmdTcGxpdCwgU3RyaW5nU3BsaXRBdHRycywgU3RyaW5nU3BsaXRJbnB1dHMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5pbXBvcnQge3N0cmluZ1NwbGl0SW1wbENQVX0gZnJvbSAnLi4va2VybmVsX3V0aWxzL3NoYXJlZCc7XG5cbmZ1bmN0aW9uIHN0cmluZ1NwbGl0KGFyZ3M6IHtcbiAgYmFja2VuZDogQmFja2VuZFdhc20sXG4gIGlucHV0czogU3RyaW5nU3BsaXRJbnB1dHMsXG4gIGF0dHJzOiBTdHJpbmdTcGxpdEF0dHJzXG59KTogW1RlbnNvckluZm8sIFRlbnNvckluZm8sIFRlbnNvckluZm9dIHtcbiAgY29uc3Qge2JhY2tlbmQsIGlucHV0cywgYXR0cnN9ID0gYXJncztcbiAgY29uc3Qge2lucHV0LCBkZWxpbWl0ZXJ9ID0gaW5wdXRzO1xuICBjb25zdCB7c2tpcEVtcHR5fSA9IGF0dHJzO1xuXG4gIGNvbnN0IGlucHV0VmFscyA9IGJhY2tlbmQucmVhZFN5bmMoaW5wdXQuZGF0YUlkKSBhcyBVaW50OEFycmF5W107XG4gIGNvbnN0IGRlbGltaXRlclZhbHMgPSBiYWNrZW5kLnJlYWRTeW5jKGRlbGltaXRlci5kYXRhSWQpIGFzIFVpbnQ4QXJyYXlbXTtcblxuICBjb25zdCBbaW5kaWNlcywgdmFsdWVzLCBzaGFwZV0gPVxuICAgICAgc3RyaW5nU3BsaXRJbXBsQ1BVKGlucHV0VmFscywgZGVsaW1pdGVyVmFsc1swXSwgc2tpcEVtcHR5KTtcbiAgY29uc3Qgb3V0cHV0U2l6ZSA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgY29uc3QgaW5kaWNlc091dCA9IGJhY2tlbmQubWFrZU91dHB1dChbb3V0cHV0U2l6ZSwgMl0sICdpbnQzMicpO1xuICBjb25zdCBpbmRpY2VzT3V0VmFscyA9IGJhY2tlbmQudHlwZWRBcnJheUZyb21IZWFwKGluZGljZXNPdXQpO1xuICBpbmRpY2VzT3V0VmFscy5zZXQoaW5kaWNlcyk7XG5cbiAgY29uc3QgdmFsdWVzT3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KFtvdXRwdXRTaXplXSwgJ3N0cmluZycpO1xuICBjb25zdCB2YWx1ZXNPdXREYXRhID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KHZhbHVlc091dC5kYXRhSWQpO1xuICB2YWx1ZXNPdXREYXRhLnN0cmluZ0J5dGVzID0gdmFsdWVzO1xuXG4gIGNvbnN0IHNoYXBlT3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KFsyXSwgJ2ludDMyJyk7XG4gIGNvbnN0IHNoYXBlT3V0VmFscyA9IGJhY2tlbmQudHlwZWRBcnJheUZyb21IZWFwKHNoYXBlT3V0KTtcbiAgc2hhcGVPdXRWYWxzLnNldChzaGFwZSk7XG5cbiAgcmV0dXJuIFtpbmRpY2VzT3V0LCB2YWx1ZXNPdXQsIHNoYXBlT3V0XTtcbn1cblxuZXhwb3J0IGNvbnN0IHN0cmluZ1NwbGl0Q29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFN0cmluZ1NwbGl0LFxuICBiYWNrZW5kTmFtZTogJ3dhc20nLFxuICBrZXJuZWxGdW5jOiBzdHJpbmdTcGxpdCBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19