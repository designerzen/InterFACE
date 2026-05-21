import * as BABYLON from '@babylonjs/core';
import AbstractDisplay from './AbstractDisplay';
import { displaySettings } from './DisplaySettings';
import { DISPLAY_BACKEND } from './DisplayTypes';
import type { DisplayOptions } from './types';
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js';
import type { IDisplay } from './IDisplay';

export default class DisplayBabylon3d extends AbstractDisplay implements IDisplay {
    name: string = DISPLAY_BACKEND.BABYLON3D;

    private engine: BABYLON.Engine | null = null;
    private scene: BABYLON.Scene | null = null;
    private camera: BABYLON.FreeCamera | null = null;

    constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        initialWidth: number = 1920,
        initialHeight: number = 1080,
        options: DisplayOptions = {}
    ) {
        super(canvas, initialWidth, initialHeight, options);

        this.initBabylon(canvas)
            .then(() => {
                this.loadComplete('ready');
            })
            .catch((error) => {
                console.error('ERROR loading Babylon 3D display', error);
                this.loadFailed(error);
            });
    }

    private async initBabylon(canvas: HTMLCanvasElement | OffscreenCanvas) {
        // We initialize without adaptToDeviceRatio because we will manage the 
        // backbuffer size manually in onResize to match the 16:9 video aspect ratio.
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        }, true);

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent

        // Center camera in logical space
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(centerX, centerY, -1000), this.scene);
        this.camera.setTarget(new BABYLON.Vector3(centerX, centerY, 0));
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

        // Very wide clipping planes
        this.camera.minZ = -5000;
        this.camera.maxZ = 5000;

        this.updateCameraOrtho();

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 1.0;

        this.available = true;
    }

    private updateCameraOrtho() {
        if (!this.camera) return;

        const halfW = this.canvasWidth / 2;
        const halfH = this.canvasHeight / 2;

        // Ortho bounds centered on camera (W/2, H/2)
        this.camera.orthoLeft = -halfW;
        this.camera.orthoRight = halfW;
        this.camera.orthoBottom = -halfH;
        this.camera.orthoTop = halfH;
    }

    public drawLandmarks(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene) return;

        const numPoints = Math.floor(data.length / 3);
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;

        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const color = BABYLON.Color3.FromHexString(colorHex);
        const dotSize = displaySettings.dotSize * this.dpr;

        const meshId = `landmarks-${colorHex}`;
        let mesh = this.scene.getMeshByName(meshId) as BABYLON.Mesh;

        if (!mesh) {
            mesh = new BABYLON.Mesh(meshId, this.scene);
            const material = new BABYLON.StandardMaterial("mat-" + colorHex, this.scene);
            material.emissiveColor = color;
            material.disableLighting = true;
            material.pointsCloud = true;
            material.pointSize = dotSize;
            mesh.material = material;
        } else {
            const mat = mesh.material as BABYLON.StandardMaterial;
            mat.emissiveColor = color;
            mat.pointSize = dotSize;
            mesh.isVisible = true;
        }

        const positions: number[] = [];
        for (let i = 0; i < numPoints; i++) {
            const x = data[i * 3] * scaleX + offX;
            // Invert Y: Screen space (0=Top) -> Babylon Cartesian (0=Bottom)
            const y = this.canvasHeight - (data[i * 3 + 1] * scaleY + offY);
            const z = data[i * 3 + 2] * scaleX;
            positions.push(x, y, z);
        }

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.applyToMesh(mesh, true);
    }

    public drawFaceConnections(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene) return;

        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const color = BABYLON.Color3.FromHexString(colorHex);
        const meshId = `connections-${colorHex}`;
        let mesh = this.scene.getMeshByName(meshId) as BABYLON.LinesMesh;

        const lines: BABYLON.Vector3[][] = [];
        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX;
            const sy = this.canvasHeight - (data[startIdx * 3 + 1] * scaleY + offY);
            const sz = data[startIdx * 3 + 2] * scaleX;

            const ex = data[endIdx * 3] * scaleX + offX;
            const ey = this.canvasHeight - (data[endIdx * 3 + 1] * scaleY + offY);
            const ez = data[endIdx * 3 + 2] * scaleX;

            lines.push([new BABYLON.Vector3(sx, sy, sz), new BABYLON.Vector3(ex, ey, ez)]);
        }

        if (!mesh) {
            mesh = BABYLON.MeshBuilder.CreateLineSystem(meshId, { lines: lines, updatable: true }, this.scene);
            mesh.color = color;
            mesh.alpha = displaySettings.opacity;
        } else {
            BABYLON.MeshBuilder.CreateLineSystem(meshId, { lines: lines, instance: mesh });
            mesh.isVisible = true;
            mesh.alpha = displaySettings.opacity;
        }
    }

    public drawConnectionDots(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene) return;

        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const connectionDotsCount = displaySettings.connectionDotsCount;
        const dotSize = displaySettings.dotSize * this.dpr;
        const color = BABYLON.Color3.FromHexString(colorHex);
        const meshId = `connection-dots-${colorHex}`;

        let mesh = this.scene.getMeshByName(meshId) as BABYLON.Mesh;

        if (!mesh) {
            mesh = new BABYLON.Mesh(meshId, this.scene);
            const material = new BABYLON.StandardMaterial("mat-dots-" + colorHex, this.scene);
            material.emissiveColor = color;
            material.disableLighting = true;
            material.pointsCloud = true;
            material.pointSize = dotSize;
            material.alpha = displaySettings.opacity;
            mesh.material = material;
        } else {
            const mat = mesh.material as BABYLON.StandardMaterial;
            mat.emissiveColor = color;
            mat.pointSize = dotSize;
            mat.alpha = displaySettings.opacity;
            mesh.isVisible = true;
        }

        const positions: number[] = [];
        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX;
            const sy = this.canvasHeight - (data[startIdx * 3 + 1] * scaleY + offY);
            const sz = data[startIdx * 3 + 2] * scaleX;

            const ex = data[endIdx * 3] * scaleX + offX;
            const ey = this.canvasHeight - (data[endIdx * 3 + 1] * scaleY + offY);
            const ez = data[endIdx * 3 + 2] * scaleX;

            for (let i = 1; i <= connectionDotsCount; i++) {
                const t = i / (connectionDotsCount + 1);
                positions.push(sx + (ex - sx) * t, sy + (ey - sy) * t, sz + (ez - sz) * t);
            }
        }

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.applyToMesh(mesh, true);
    }

    public override clear(): void {
        if (!this.scene) return;
        for (const mesh of this.scene.meshes) {
            if (mesh.name.startsWith("landmarks-") || mesh.name.startsWith("connections-") || mesh.name.startsWith("connection-dots-")) {
                mesh.isVisible = false;
            }
        }
    }

    public override onResize(width: number, height: number): void {
        super.onResize(width, height);

        this.canvas.width = Math.floor(width * this.dpr);
        this.canvas.height = Math.floor(height * this.dpr);

        if (this.camera) {
            const centerX = width / 2;
            const centerY = height / 2;
            this.camera.position.set(centerX, centerY, -1000);
            this.camera.setTarget(new BABYLON.Vector3(centerX, centerY, 0));
        }

        this.updateCameraOrtho();
    }

    public drawText(
        x: number,
        y: number,
        text: string,
        size: number = 16,
        align: string = 'left',
        font: string = 'Arial',
        invertColours: boolean = false
    ): void {
        if (!this.scene) return;

        // Create a canvas for text rendering
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaledSize = size * this.dpr;

        // Configure text rendering
        ctx.font = `${scaledSize}px ${font}`;
        ctx.textAlign = align as CanvasTextAlign;
        ctx.textBaseline = 'top';
        ctx.fillStyle = invertColours ? '#000000' : '#FFFFFF';

        // Draw text on canvas
        ctx.fillText(text, 10, 10);

        // Create Babylon texture from canvas
        const texture = new BABYLON.DynamicTexture('textTexture', 512, this.scene);
        texture.drawText(text, 10, scaledSize + 10, `${scaledSize}px ${font}`, invertColours ? '#000000' : '#FFFFFF', null);

        // Create plane for text
        const textPlane = BABYLON.MeshBuilder.CreatePlane('textPlane-' + Date.now(), {
            width: 2,
            height: 0.5,
        }, this.scene);

        // Create material with the texture
        const material = new BABYLON.StandardMaterial('textMaterial-' + Date.now(), this.scene);
        material.emissiveTexture = texture;
        material.backFaceCulling = false;

        textPlane.material = material;
        textPlane.position = new BABYLON.Vector3(x, this.canvasHeight - y, 10);
    }

    public render(): void {
        if (this.scene) {
            this.scene.render();
        }
        this.onRender();
    }

    public submitFrame(): void {
        this.render();
    }

    public async destroy(): Promise<void> {
        if (this.engine) {
            this.engine.dispose();
            this.engine = null;
            this.scene = null;
        }
        await super.destroy();
    }
}
