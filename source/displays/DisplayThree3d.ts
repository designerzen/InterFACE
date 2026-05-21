// @ts-nocheck
import * as THREE from 'three';
import AbstractDisplay from './AbstractDisplay';
import { displaySettings } from './DisplaySettings';
import { DISPLAY_BACKEND } from './DisplayTypes';
import type { DisplayOptions } from './types';
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js';
import type { IDisplay } from './IDisplay';

export const DEFAULT_OPTIONS_DISPLAY_THREE = {
    controls: '#shared-controls',
    updateFaceButtonAfter: 10
};

export default class DisplayThree3D extends AbstractDisplay implements IDisplay {
    name: string = DISPLAY_BACKEND.THREE3D;

    renderer: THREE.WebGLRenderer | null = null;
    scene: THREE.Scene | null = null;
    camera: THREE.OrthographicCamera | null = null;

    constructor(canvas: HTMLCanvasElement | OffscreenCanvas, initialWidth: number = 1920, initialHeight: number = 1080, options: DisplayOptions = {}) {
        const mergedOptions = Object.assign({}, DEFAULT_OPTIONS_DISPLAY_THREE, options);
        super(canvas, initialWidth, initialHeight, mergedOptions);

        this.create(canvas, mergedOptions)
            .then(() => {
                this.loadComplete('ready');
            })
            .catch((error) => {
                console.error('ERROR loading Three.js 3D display', error);
                this.loadFailed(error);
            });
    }

    async create(canvas: HTMLCanvasElement | OffscreenCanvas, _options: DisplayOptions): Promise<boolean> {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas as any,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });

        this.renderer.setPixelRatio(this.dpr);
        this.renderer.setSize(this.canvasWidth, this.canvasHeight, false);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
            0, this.canvasWidth,   // left, right
            0, this.canvasHeight,  // top, bottom
            -1000, 1000            // near, far
        );
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        this.available = true;
        return true;
    }

    drawLandmarks(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene || !this.renderer || !this.camera) return;

        const color = new THREE.Color(colorHex);
        const numPoints = Math.floor(data.length / 3);
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;

        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const positions = new Float32Array(numPoints * 3);
        for (let i = 0; i < numPoints; i++) {
            positions[i * 3] = data[i * 3] * scaleX + offX;
            positions[i * 3 + 1] = data[i * 3 + 1] * scaleY + offY;
            positions[i * 3 + 2] = data[i * 3 + 2] * scaleX;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({ 
            color, 
            size: displaySettings.dotSize * this.dpr,
            transparent: true,
            opacity: displaySettings.opacity
        });
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    drawFaceConnections(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene || !this.renderer || !this.camera) return;

        const color = new THREE.Color(colorHex);
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;

        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const linePositions = new Float32Array(MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.length * 2 * 3);

        for (let i = 0; i < MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.length; i++) {
            const [startIdx, endIdx] = MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS[i];

            // Start point
            linePositions[i * 6] = data[startIdx * 3] * scaleX + offX;
            linePositions[i * 6 + 1] = data[startIdx * 3 + 1] * scaleY + offY;
            linePositions[i * 6 + 2] = data[startIdx * 3 + 2] * scaleX;

            // End point
            linePositions[i * 6 + 3] = data[endIdx * 3] * scaleX + offX;
            linePositions[i * 6 + 4] = data[endIdx * 3 + 1] * scaleY + offY;
            linePositions[i * 6 + 5] = data[endIdx * 3 + 2] * scaleX;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const material = new THREE.LineBasicMaterial({ 
            color,
            transparent: true,
            opacity: displaySettings.opacity
        });
        const lines = new THREE.LineSegments(geometry, material);
        this.scene.add(lines);
    }

    drawConnectionDots(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        if (!this.scene || !this.renderer || !this.camera) return;

        const color = new THREE.Color(colorHex);
        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;

        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
        const offX = offsetX || 0;
        const offY = offsetY || 0;

        const connectionDotsCount = displaySettings.connectionDotsCount;
        const totalDots = MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.length * connectionDotsCount;
        const positions = new Float32Array(totalDots * 3);
        let posIdx = 0;

        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX;
            const sy = data[startIdx * 3 + 1] * scaleY + offY;
            const sz = data[startIdx * 3 + 2] * scaleX;

            const ex = data[endIdx * 3] * scaleX + offX;
            const ey = data[endIdx * 3 + 1] * scaleY + offY;
            const ez = data[endIdx * 3 + 2] * scaleX;

            for (let i = 1; i <= connectionDotsCount; i++) {
                const t = i / (connectionDotsCount + 1);
                positions[posIdx++] = sx + (ex - sx) * t;
                positions[posIdx++] = sy + (ey - sy) * t;
                positions[posIdx++] = sz + (ez - sz) * t;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({ 
            color, 
            size: displaySettings.dotSize * this.dpr,
            transparent: true,
            opacity: displaySettings.opacity
        });
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    clear(): void {
        super.clear();
        if (this.scene) {
            while (this.scene.children.length > 0) {
                const child = this.scene.children[0];
                if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.LineSegments) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((m: THREE.Material) => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
                this.scene.remove(child);
            }
        }
    }

    onResize(width: number, height: number): void {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.onWindowResize();
    }

    onWindowResize(): void {
        if (!this.renderer || !this.camera) return;

        this.camera.left = 0;
        this.camera.right = this.canvasWidth;
        this.camera.top = 0;
        this.camera.bottom = this.canvasHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.canvasWidth, this.canvasHeight, false);
    }

    render(): void {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        this.onRender();
    }

    submitFrame(): void {
        this.render();
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
        if (!this.scene || !this.camera) return;

        // Create a canvas texture for the text
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

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Create material with texture
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Create plane geometry for text
        const width = canvas.width / 50;
        const height = canvas.height / 50;
        const geometry = new THREE.PlaneGeometry(width, height);

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);

        this.scene.add(mesh);
    }

    async destroy(): Promise<void> {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        await super.destroy();
    }
}
