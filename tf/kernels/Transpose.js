/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { Transpose } from '@tensorflow/tfjs-core';
import { identity } from './Identity';
import { CppDType } from './types';
let wasmTranspose;
function setup(backend) {
    wasmTranspose = backend.wasm.cwrap(Transpose, null /* void */, [
        'number',
        'array',
        'number',
        'number',
        'number',
        'array',
        'number',
    ]);
}
export function transpose(args) {
    const { inputs, backend, attrs } = args;
    // Reduce any dimensions with size one. Lower-rank transpose kernel performs
    // better due to simpler memory access pattern.
    const [reducedShape, perm] = removeOneSizeDims(inputs.x.shape, attrs.perm);
    let permIsNoOp = true;
    for (let i = 0; i < perm.length; i++) {
        if (perm[i] !== i) {
            permIsNoOp = false;
        }
    }
    const outShape = computeOutShape(inputs.x.shape, attrs.perm);
    const x = {
        dataId: inputs.x.dataId,
        shape: reducedShape,
        dtype: inputs.x.dtype
    };
    if (permIsNoOp) {
        const cloned = identity({ inputs, backend });
        cloned.shape = outShape;
        return cloned;
    }
    const out = backend.makeOutput(outShape, x.dtype);
    const xId = backend.dataIdMap.get(x.dataId).id;
    const outId = backend.dataIdMap.get(out.dataId).id;
    const permBytes = new Uint8Array(new Int32Array(perm).buffer);
    const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    wasmTranspose(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], outId, permBytes, perm.length);
    return out;
}
function computeOutShape(inShape, perm) {
    const outShape = new Array(inShape.length);
    for (let i = 0; i < outShape.length; i++) {
        outShape[i] = inShape[perm[i]];
    }
    return outShape;
}
function removeOneSizeDims(shape, perm) {
    const newShape = [];
    const newPerm = [];
    for (let i = 0; i < shape.length; ++i) {
        if (shape[i] !== 1) {
            newShape.push(shape[i]);
        }
        if (shape[perm[i]] !== 1) {
            newPerm.push(perm[i]);
        }
    }
    for (let i = 0; i < newPerm.length; ++i) {
        let minValIdx = -1;
        for (let j = 0; j < newPerm.length; ++j) {
            if (newPerm[j] >= i &&
                (minValIdx === -1 || newPerm[minValIdx] > newPerm[j])) {
                minValIdx = j;
            }
        }
        newPerm[minValIdx] = i;
    }
    return [newShape, newPerm];
}
export const transposeConfig = {
    kernelName: Transpose,
    backendName: 'wasm',
    kernelFunc: transpose,
    setupFunc: setup,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNwb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdhc20vc3JjL2tlcm5lbHMvVHJhbnNwb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBdUMsU0FBUyxFQUFrQyxNQUFNLHVCQUF1QixDQUFDO0FBSXZILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUVqQyxJQUFJLGFBRTRELENBQUM7QUFFakUsU0FBUyxLQUFLLENBQUMsT0FBb0I7SUFDakMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQzdELFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FDckIsSUFDMEU7SUFFNUUsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLDRFQUE0RTtJQUM1RSwrQ0FBK0M7SUFDL0MsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFM0UsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMs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QVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN2QyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNmLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDekQsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNmO1NBQ0Y7UUFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFpQjtJQUMzQyxVQUFVLEVBQUUsU0FBUztJQUNyQixXQUFXLEVBQUUsTUFBTTtJQUNuQixVQUFVLEVBQUUsU0FBNkI7SUFDekMsU0FBUyxFQUFFLEtBQUs7Q0FDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFRlbnNvckluZm8sIFRyYW5zcG9zZSwgVHJhbnNwb3NlQXR0cnMsIFRyYW5zcG9zZUlucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtCYWNrZW5kV2FzbX0gZnJvbSAnLi4vYmFja2VuZF93YXNtJztcblxuaW1wb3J0IHtpZGVudGl0eX0gZnJvbSAnLi9JZGVudGl0eSc7XG5pbXBvcnQge0NwcERUeXBlfSBmcm9tICcuL3R5cGVzJztcblxubGV0IHdhc21UcmFuc3Bvc2U6IChcbiAgICB4SWQ6IG51bWJlciwgeFNoYXBlOiBVaW50OEFycmF5LCB4U2hhcGVMZW5ndGg6IG51bWJlciwgZHR5cGU6IENwcERUeXBlLFxuICAgIG91dElkOiBudW1iZXIsIHBlcm06IFVpbnQ4QXJyYXksIHBlcm1MZW5ndGg6IG51bWJlcikgPT4gdm9pZDtcblxuZnVuY3Rpb24gc2V0dXAoYmFja2VuZDogQmFja2VuZFdhc20pIHtcbiAgd2FzbVRyYW5zcG9zZSA9IGJhY2tlbmQud2FzbS5jd3JhcChUcmFuc3Bvc2UsIG51bGwgLyogdm9pZCAqLywgW1xuICAgICdudW1iZXInLCAgLy8geElkXG4gICAgJ2FycmF5JywgICAvLyB4LnNoYXBlXG4gICAgJ251bWJlcicsICAvLyB4LnNoYXBlLmxlbmd0aFxuICAgICdudW1iZXInLCAgLy8gZHR5cGVcbiAgICAnbnVtYmVyJywgIC8vIG91dElkXG4gICAgJ2FycmF5JywgICAvLyBwZXJtXG4gICAgJ251bWJlcicsICAvLyBwZXJtLmxlbmd0aFxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcG9zZShcbiAgICBhcmdzOlxuICAgICAgICB7aW5wdXRzOiBUcmFuc3Bvc2VJbnB1dHMsIGJhY2tlbmQ6IEJhY2tlbmRXYXNtLCBhdHRyczogVHJhbnNwb3NlQXR0cnN9KTpcbiAgICBUZW5zb3JJbmZvIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZCwgYXR0cnN9ID0gYXJncztcbiAgLy8gUmVkdWNlIGFueSBkaW1lbnNpb25zIHdpdGggc2l6ZSBvbmUuIExvd2VyLXJhbmsgdHJhbnNwb3NlIGtlcm5lbCBwZXJmb3Jtc1xuICAvLyBiZXR0ZXIgZHVlIHRvIHNpbXBsZXIgbWVtb3J5IGFjY2VzcyBwYXR0ZXJuLlxuICBjb25zdCBbcmVkdWNlZFNoYXBlLCBwZXJtXSA9IHJlbW92ZU9uZVNpemVEaW1zKGlucHV0cy54LnNoYXBlLCBhdHRycy5wZXJtKTtcblxuICBsZXQgcGVybUlzTm9PcCA9IHRydWU7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGVybS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwZXJtW2ldICE9PSBpKSB7XG4gICAgICBwZXJtSXNOb09wID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGNvbnN0IG91dFNoYXBlID0gY29tcHV0ZU91dFNoYXBlKGlucHV0cy54LnNoYXBlLCBhdHRycy5wZXJtKTtcbiAgY29uc3QgeCA9IHtcbiAgICBkYXRhSWQ6IGlucHV0cy54LmRhdGFJZCxcbiAgICBzaGFwZTogcmVkdWNlZFNoYXBlLFxuICAgIGR0eXBlOiBpbnB1dHMueC5kdHlwZVxuICB9O1xuXG4gIGlmIChwZXJtSXNOb09wKSB7XG4gICAgY29uc3QgY2xvbmVkID0gaWRlbnRpdHkoe2lucHV0cywgYmFja2VuZH0pO1xuICAgIGNsb25lZC5zaGFwZSA9IG91dFNoYXBlO1xuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICBjb25zdCBvdXQgPSBiYWNrZW5kLm1ha2VPdXRwdXQob3V0U2hhcGUsIHguZHR5cGUpO1xuICBjb25zdCB4SWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQoeC5kYXRhSWQpLmlkO1xuICBjb25zdCBvdXRJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChvdXQuZGF0YUlkKS5pZDtcbiAgY29uc3QgcGVybUJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkobmV3IEludDMyQXJyYXkocGVybSkuYnVmZmVyKTtcbiAgY29uc3QgeFNoYXBlQnl0ZXMgPSBuZXcgVWludDhBcnJheShuZXcgSW50MzJBcnJheSh4LnNoYXBlKS5idWZmZXIpO1xuXG4gIHdhc21UcmFuc3Bvc2UoXG4gICAgICB4SWQsIHhTaGFwZUJ5dGVzLCB4LnNoYXBlLmxlbmd0aCwgQ3BwRFR5cGVbeC5kdHlwZV0sIG91dElkLCBwZXJtQnl0ZXMsXG4gICAgICBwZXJtLmxlbmd0aCk7XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVPdXRTaGFwZShpblNoYXBlOiBudW1iZXJbXSwgcGVybTogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IG91dFNoYXBlID0gbmV3IEFycmF5KGluU2hhcGUubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgIG91dFNoYXBlW2ldID0gaW5TaGFwZVtwZXJtW2ldXTtcbiAgfVxuICByZXR1cm4gb3V0U2hhcGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU9uZVNpemVEaW1zKFxuICAgIHNoYXBlOiBudW1iZXJbXSwgcGVybTogbnVtYmVyW10pOiBbbnVtYmVyW10sIG51bWJlcltdXSB7XG4gIGNvbnN0IG5ld1NoYXBlOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBuZXdQZXJtOiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKHNoYXBlW2ldICE9PSAxKSB7XG4gICAgICBuZXdTaGFwZS5wdXNoKHNoYXBlW2ldKTtcbiAgICB9XG4gICAgaWYgKHNoYXBlW3Blcm1baV1dICE9PSAxKSB7XG4gICAgICBuZXdQZXJtLnB1c2gocGVybVtpXSk7XG4gICAgfVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3UGVybS5sZW5ndGg7ICsraSkge1xuICAgIGxldCBtaW5WYWxJZHggPSAtMTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ld1Blcm0ubGVuZ3RoOyArK2opIHtcbiAgICAgIGlmIChuZXdQZXJtW2pdID49IGkgJiZcbiAgICAgICAgICAobWluVmFsSWR4ID09PSAtMSB8fCBuZXdQZXJtW21pblZhbElkeF0gPiBuZXdQZXJtW2pdKSkge1xuICAgICAgICBtaW5WYWxJZHggPSBqO1xuICAgICAgfVxuICAgIH1cbiAgICBuZXdQZXJtW21pblZhbElkeF0gPSBpO1xuICB9XG4gIHJldHVybiBbbmV3U2hhcGUsIG5ld1Blcm1dO1xufVxuXG5leHBvcnQgY29uc3QgdHJhbnNwb3NlQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFRyYW5zcG9zZSxcbiAgYmFja2VuZE5hbWU6ICd3YXNtJyxcbiAga2VybmVsRnVuYzogdHJhbnNwb3NlIGFzIHt9IGFzIEtlcm5lbEZ1bmMsXG4gIHNldHVwRnVuYzogc2V0dXAsXG59O1xuIl19