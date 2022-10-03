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
import { DepthToSpace, util } from '@tensorflow/tfjs-core';
let wasmDepthToSpace;
function setup(backend) {
    wasmDepthToSpace = backend.wasm.cwrap(DepthToSpace, null /*void*/, [
        'number',
        'number',
        'number',
        'array',
        'number',
        'array',
        'array',
        'number',
        'number',
    ]);
}
export function depthToSpace(args) {
    const { backend, inputs, attrs } = args;
    const { x } = inputs;
    const { blockSize, dataFormat } = attrs;
    const batchSize = x.shape[0];
    const inputHeight = (dataFormat === 'NHWC') ? x.shape[1] : x.shape[2];
    const inputWidth = (dataFormat === 'NHWC') ? x.shape[2] : x.shape[3];
    const inputDepth = (dataFormat === 'NHWC') ? x.shape[3] : x.shape[1];
    const outputHeight = inputHeight * blockSize;
    const outputWidth = inputWidth * blockSize;
    const outputDepth = inputDepth / (blockSize * blockSize);
    const outputShape = (dataFormat === 'NHWC') ?
        [batchSize, outputHeight, outputWidth, outputDepth] :
        [batchSize, outputDepth, outputHeight, outputWidth];
    const out = backend.makeOutput(outputShape, 'float32');
    const xData = backend.dataIdMap.get(x.dataId);
    const xId = xData.id;
    const xStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(x.shape)).buffer);
    const outputShapeBytes = new Uint8Array(new Int32Array(outputShape).buffer);
    const outStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(outputShape)).buffer);
    const outId = backend.dataIdMap.get(out.dataId).id;
    const channelsLast = dataFormat === 'NHWC' ? 1 : 0;
    wasmDepthToSpace(xId, blockSize, channelsLast, xStridesBytes, x.shape.length - 1, outputShapeBytes, outStridesBytes, outputShape.length, outId);
    return out;
}
export const depthToSpaceConfig = {
    kernelName: DepthToSpace,
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: depthToSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwdGhUb1NwYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdhc20vc3JjL2tlcm5lbHMvRGVwdGhUb1NwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQStFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSXRJLElBQUksZ0JBR3VDLENBQUM7QUFFNUMsU0FBUyxLQUFLLENBQUMsT0FBb0I7SUFDakMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDakUsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO0tBQ1QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsSUFJNUI7SUFDQyxNQUFNLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLENBQUMsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUNuQixNQUFNLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxHQUFHLEtBQUssQ0FBQztJQUV0QyxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sV0FBVyxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLE1BQU0sVUFBVSxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sVUFBVSxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJFLE1BQU0sWUFBWSxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDN0MsTUFBTSxXQUFXLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFFekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUV4RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV2RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNyQixNQUFNLGFBQWEsR0FDZixJQUFJLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXhFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUUsTUFBTSxlQUFlLEdBQ2pCLElBQUksVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1RSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25ELE1BQU0sWUFBWSxHQUFHLFVBQVUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELGdCQUFnQixDQUNaLEdBQUcsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQy9ELGdCQUFnQixFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWxFLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFpQjtJQUM5QyxVQUFVLEVBQUUsWUFBWTtJQUN4QixXQUFXLEVBQUUsTUFBTTtJQUNuQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsWUFBZ0M7Q0FDN0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEZXB0aFRvU3BhY2UsIERlcHRoVG9TcGFjZUF0dHJzLCBEZXB0aFRvU3BhY2VJbnB1dHMsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuYywgVGVuc29ySW5mbywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtCYWNrZW5kV2FzbX0gZnJvbSAnLi4vYmFja2VuZF93YXNtJztcblxubGV0IHdhc21EZXB0aFRvU3BhY2U6IChcbiAgICB4SWQ6IG51bWJlciwgYmxvY2tTaXplOiBudW1iZXIsIGNoYW5uZWxzTGFzdDogbnVtYmVyLCB4U3RyaWRlczogVWludDhBcnJheSxcbiAgICB4U3RyaWRlc0xlbmd0aDogbnVtYmVyLCBvdXRwdXRTaGFwZTogVWludDhBcnJheSwgb3V0cHV0U3RyaWRlczogVWludDhBcnJheSxcbiAgICBvdXRTaXplOiBudW1iZXIsIG91dElkOiBudW1iZXIpID0+IHZvaWQ7XG5cbmZ1bmN0aW9uIHNldHVwKGJhY2tlbmQ6IEJhY2tlbmRXYXNtKTogdm9pZCB7XG4gIHdhc21EZXB0aFRvU3BhY2UgPSBiYWNrZW5kLndhc20uY3dyYXAoRGVwdGhUb1NwYWNlLCBudWxsIC8qdm9pZCovLCBbXG4gICAgJ251bWJlcicsICAvLyB4SWRcbiAgICAnbnVtYmVyJywgIC8vIGJsb2NrU2l6ZVxuICAgICdudW1iZXInLCAgLy8gY2hhbm5lbHNMYXN0XG4gICAgJ2FycmF5JywgICAvLyB4U3RyaWRlc1xuICAgICdudW1iZXInLCAgLy8geFN0cmlkZXNMZW5ndGhcbiAgICAnYXJyYXknLCAgIC8vIG91dHB1dFNoYXBlXG4gICAgJ2FycmF5JywgICAvLyBvdXRwdXRTdHJpZGVzXG4gICAgJ251bWJlcicsICAvLyBvdXRTaXplXG4gICAgJ251bWJlcicsICAvLyBvdXRJZFxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcHRoVG9TcGFjZShhcmdzOiB7XG4gIGJhY2tlbmQ6IEJhY2tlbmRXYXNtLFxuICBpbnB1dHM6IERlcHRoVG9TcGFjZUlucHV0cyxcbiAgYXR0cnM6IERlcHRoVG9TcGFjZUF0dHJzXG59KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtiYWNrZW5kLCBpbnB1dHMsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHt4fSA9IGlucHV0cztcbiAgY29uc3Qge2Jsb2NrU2l6ZSwgZGF0YUZvcm1hdH0gPSBhdHRycztcblxuICBjb25zdCBiYXRjaFNpemUgPSB4LnNoYXBlWzBdO1xuICBjb25zdCBpbnB1dEhlaWdodCA9IChkYXRhRm9ybWF0ID09PSAnTkhXQycpID8geC5zaGFwZVsxXSA6IHguc2hhcGVbMl07XG4gIGNvbnN0IGlucHV0V2lkdGggPSAoZGF0YUZvcm1hdCA9PT0gJ05IV0MnKSA/IHguc2hhcGVbMl0gOiB4LnNoYXBlWzNdO1xuICBjb25zdCBpbnB1dERlcHRoID0gKGRhdGFGb3JtYXQgPT09ICdOSFdDJykgPyB4LnNoYXBlWzNdIDogeC5zaGFwZVsxXTtcblxuICBjb25zdCBvdXRwdXRIZWlnaHQgPSBpbnB1dEhlaWdodCAqIGJsb2NrU2l6ZTtcbiAgY29uc3Qgb3V0cHV0V2lkdGggPSBpbnB1dFdpZHRoICogYmxvY2tTaXplO1xuICBjb25zdCBvdXRwdXREZXB0aCA9IGlucHV0RGVwdGggLyAoYmxvY2tTaXplICogYmxvY2tTaXplKTtcblxuICBjb25zdCBvdXRwdXRTaGFwZSA9IChkYXRhRm9ybWF0ID09PSAnTkhXQycpID9cbiAgICAgIFtiYXRjaFNpemUsIG91dHB1dEhlaWdodCwgb3V0cHV0V2lkdGgsIG91dHB1dERlcHRoXSA6XG4gICAgICBbYmF0Y2hTaXplLCBvdXRwdXREZXB0aCwgb3V0cHV0SGVpZ2h0LCBvdXRwdXRXaWR0aF07XG5cbiAgY29uc3Qgb3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KG91dHB1dFNoYXBlLCAnZmxvYXQzMicpO1xuXG4gIGNvbnN0IHhEYXRhID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KHguZGF0YUlkKTtcbiAgY29uc3QgeElkID0geERhdGEuaWQ7XG4gIGNvbnN0IHhTdHJpZGVzQnl0ZXMgPVxuICAgICAgbmV3IFVpbnQ4QXJyYXkobmV3IEludDMyQXJyYXkodXRpbC5jb21wdXRlU3RyaWRlcyh4LnNoYXBlKSkuYnVmZmVyKTtcblxuICBjb25zdCBvdXRwdXRTaGFwZUJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkobmV3IEludDMyQXJyYXkob3V0cHV0U2hhcGUpLmJ1ZmZlcik7XG4gIGNvbnN0IG91dFN0cmlkZXNCeXRlcyA9XG4gICAgICBuZXcgVWludDhBcnJheShuZXcgSW50MzJBcnJheSh1dGlsLmNvbXB1dGVTdHJpZGVzKG91dHB1dFNoYXBlKSkuYnVmZmVyKTtcblxuICBjb25zdCBvdXRJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChvdXQuZGF0YUlkKS5pZDtcbiAgY29uc3QgY2hhbm5lbHNMYXN0ID0gZGF0YUZvcm1hdCA9PT0gJ05IV0MnID8gMSA6IDA7XG4gIHdhc21EZXB0aFRvU3BhY2UoXG4gICAgICB4SWQsIGJsb2NrU2l6ZSwgY2hhbm5lbHNMYXN0LCB4U3RyaWRlc0J5dGVzLCB4LnNoYXBlLmxlbmd0aCAtIDEsXG4gICAgICBvdXRwdXRTaGFwZUJ5dGVzLCBvdXRTdHJpZGVzQnl0ZXMsIG91dHB1dFNoYXBlLmxlbmd0aCwgb3V0SWQpO1xuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBjb25zdCBkZXB0aFRvU3BhY2VDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRGVwdGhUb1NwYWNlLFxuICBiYWNrZW5kTmFtZTogJ3dhc20nLFxuICBzZXR1cEZ1bmM6IHNldHVwLFxuICBrZXJuZWxGdW5jOiBkZXB0aFRvU3BhY2UgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==