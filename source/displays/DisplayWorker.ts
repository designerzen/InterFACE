import { DisplayCanvas2d } from './DisplayCanvas2d';
import { DisplayWebGPU } from './DisplayWebGPU';
import DisplayThree3D from './DisplayThree3d';
import DisplayWebGL3D from './DisplayWebGL3d';
import DisplayBabylon3d from './DisplayBabylon3d';
import { DISPLAY_BACKEND } from './DisplayTypes';
import { displaySettings } from './DisplaySettings';
import type { IDisplay } from './IDisplay';

let currentDisplay: IDisplay | null = null;

self.onmessage = async (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'BATCH') {
        const commands = payload as any[];
        for (const cmd of commands) {
            await handleMessage(cmd.type, cmd.payload);
        }
        if (currentDisplay && currentDisplay.submitFrame) {
            currentDisplay.submitFrame();
        }
    } else {
        await handleMessage(type, payload);
    }
};

async function handleMessage(type: string, payload: any) {
    switch (type) {
        case 'INIT': {
            const { backendId, canvas, width, height, dpr, options } = payload;

            if (currentDisplay) {
                await currentDisplay.destroy();
            }

            switch (backendId) {
                case DISPLAY_BACKEND.CANVAS2D:
                    currentDisplay = new DisplayCanvas2d(canvas, width, height, options);
                    break;
                case DISPLAY_BACKEND.WEBGPU:
                    currentDisplay = new DisplayWebGPU(canvas, width, height, options);
                    await (currentDisplay as any).init();
                    break;
                case DISPLAY_BACKEND.THREE3D:
                    currentDisplay = new DisplayThree3D(canvas, width, height, options);
                    break;
                case DISPLAY_BACKEND.WEBGL3D:
                    currentDisplay = new DisplayWebGL3D(canvas, width, height, options);
                    break;
                case DISPLAY_BACKEND.BABYLON3D:
                    currentDisplay = new DisplayBabylon3d(canvas, width, height, options);
                    break;
                default:
                    console.error(`Worker: Unknown backend ${backendId}`);
                    return;
            }

            if (currentDisplay && dpr) {
                currentDisplay.onResize(width, height); // Ensure size is set
            }

            console.log(`Worker: Initialized ${backendId} with DPR ${dpr}`);
            break;
        }

        case 'RESIZE': {
            if (currentDisplay) {
                currentDisplay.setSize(payload.width, payload.height);
            }
            break;
        }

        case 'CLEAR': {
            if (currentDisplay) {
                currentDisplay.clear();
            }
            break;
        }

        case 'DRAW_LANDMARKS': {
            if (currentDisplay && currentDisplay.drawLandmarks) {
                currentDisplay.drawLandmarks(payload.data, payload.color, payload.scale, payload.regionSize, payload.offsetX, payload.offsetY);
            }
            break;
        }

        case 'DRAW_CONNECTIONS': {
            if (currentDisplay && currentDisplay.drawFaceConnections) {
                currentDisplay.drawFaceConnections(payload.data, payload.color, payload.scale, payload.regionSize, payload.offsetX, payload.offsetY);
            }
            break;
        }

        case 'DRAW_CONNECTION_DOTS': {
            if (currentDisplay && currentDisplay.drawConnectionDots) {
                currentDisplay.drawConnectionDots(payload.data, payload.color, payload.scale, payload.regionSize, payload.offsetX, payload.offsetY);
            }
            break;
        }

        case 'SUBMIT_FRAME': {
            if (currentDisplay && currentDisplay.submitFrame) {
                currentDisplay.submitFrame();
            }
            break;
        }

        case 'UPDATE_SETTINGS': {
            const { key, value } = payload;
            if (key in displaySettings) {
                (displaySettings as any)[key] = value;
            }
            break;
        }

        case 'DESTROY': {
            if (currentDisplay) {
                await currentDisplay.destroy();
                currentDisplay = null;
            }
            break;
        }
    }
}
