import AbstractDisplay from './AbstractDisplay';
import { displaySettings } from './DisplaySettings';
import { DISPLAY_BACKEND } from './DisplayTypes';
import type { DisplayOptions } from './types';
import { hexToRgba } from './colorUtils';
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js';
import type { IDisplay } from './IDisplay';

/**
 * Raw WebGL 2.0 implementation for 3D landmarks.
 * No external libraries (No Three.js, No Babylon).
 */
export default class DisplayWebGL3D extends AbstractDisplay implements IDisplay {
  name: string = DISPLAY_BACKEND.WEBGL3D;

  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private vbo: WebGLBuffer | null = null;
  private ibo: WebGLBuffer | null = null;
  private lineCount: number = 0;

  // Uniform locations
  private uProjectionMatrix: WebGLUniformLocation | null = null;
  private uPointSize: WebGLUniformLocation | null = null;
  private uColor: WebGLUniformLocation | null = null;

  constructor(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    initialWidth: number = 1920,
    initialHeight: number = 1080,
    _options: DisplayOptions = {}
  ) {
    super(canvas, initialWidth, initialHeight, _options);

    const targetCanvas = canvas as any;
    this.initWebGL(targetCanvas)
      .then(() => {
        this.loadComplete('ready');
      })
      .catch((error) => {
        console.error('ERROR loading Raw WebGL 3D display', error);
        this.loadFailed(error);
      });
  }

  private async initWebGL(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    if (!this.gl) {
      throw new Error('WebGL 2.0 not supported');
    }

    const vsSource = `#version 300 es
            layout(location = 0) in vec3 aPosition;
            uniform mat4 uProjectionMatrix;
            uniform float uPointSize;
            void main() {
                gl_Position = uProjectionMatrix * vec4(aPosition, 1.0);
                gl_PointSize = uPointSize;
            }
        `;

    const fsSource = `#version 300 es
            precision mediump float;
            uniform vec4 uColor;
            out vec4 outColor;
            void main() {
                outColor = uColor;
            }
        `;

    this.program = this.createProgram(vsSource, fsSource);
    this.gl.useProgram(this.program);

    // Enable alpha blending
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Get uniform locations
    this.uProjectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
    this.uPointSize = this.gl.getUniformLocation(this.program, 'uPointSize');
    this.uColor = this.gl.getUniformLocation(this.program, 'uColor');

    // Setup VAO & VBO
    this.vao = this.gl.createVertexArray();
    this.vbo = this.gl.createBuffer();
    this.ibo = this.gl.createBuffer();

    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

    // Pre-fill index buffer for lines
    const indices = new Uint16Array(MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.flat());
    this.lineCount = indices.length;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    this.updateProjection();
    this.available = true;
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram {
    if (!this.gl) throw new Error('GL context lost');
    const vs = this.compileShader(this.gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource);
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + this.gl.getProgramInfoLog(program));
    }
    return program;
  }

  private compileShader(type: number, source: string): WebGLShader {
    if (!this.gl) throw new Error('GL context lost');
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('Shader compile error: ' + info);
    }
    return shader;
  }

  private updateProjection() {
    if (!this.gl || !this.uProjectionMatrix) return;

    // Orthographic projection matrix: maps (0,0) to top-left, (W,H) to bottom-right
    const left = 0;
    const right = this.canvasWidth;
    const top = 0; // Screen space Y=0 is top
    const bottom = this.canvasHeight;
    const near = -1000;
    const far = 1000;

    // Column-major mat4
    const ortho = new Float32Array([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, -2 / (far - near), 0,
      -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
    ]);

    this.gl.uniformMatrix4fv(this.uProjectionMatrix, false, ortho);
  }

  private transformData(data: Float32Array, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): Float32Array {
    const numPoints = Math.floor(data.length / 3);
    const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;
    const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
    const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
    const offX = offsetX || 0;
    const offY = offsetY || 0;

    const transformedData = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      transformedData[i * 3] = data[i * 3] * scaleX + offX;
      transformedData[i * 3 + 1] = data[i * 3 + 1] * scaleY + offY;
      transformedData[i * 3 + 2] = data[i * 3 + 2] * scaleX;
    }
    return transformedData;
  }

  public drawLandmarks(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
    if (!this.gl || !this.program) return;

    const numPoints = Math.floor(data.length / 3);
    const transformedData = this.transformData(data, internalScale, regionSize, offsetX, offsetY);

    // Set state
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, transformedData, this.gl.DYNAMIC_DRAW);

    // Uniforms
    const [r, g, b, a] = hexToRgba(colorHex);
    this.gl.uniform4f(this.uColor, r / 255, g / 255, b / 255, (a / 255) * displaySettings.opacity);
    this.gl.uniform1f(this.uPointSize, displaySettings.dotSize * this.dpr);

    // Draw points
    this.gl.drawArrays(this.gl.POINTS, 0, numPoints);
  }

  public drawFaceConnections(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
    if (!this.gl || !this.program || !this.ibo) return;

    const transformedData = this.transformData(data, internalScale, regionSize, offsetX, offsetY);

    // Set state
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, transformedData, this.gl.DYNAMIC_DRAW);

    // Re-bind IBO as it's part of VAO state but sometimes needs explicit re-bind if VAO was recreated
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);

    // Uniforms
    const [r, g, b, a] = hexToRgba(colorHex);
    this.gl.uniform4f(this.uColor, r / 255, g / 255, b / 255, (a / 255) * displaySettings.opacity);

    // Draw lines
    this.gl.drawElements(this.gl.LINES, this.lineCount, this.gl.UNSIGNED_SHORT, 0);
  }

  public drawConnectionDots(data: Float32Array, colorHex: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
    if (!this.gl || !this.program) return;

    const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined;
    const scaleX = useRegion ? (regionSize / internalScale) : (this.canvasWidth / internalScale);
    const scaleY = useRegion ? (regionSize / internalScale) : (this.canvasHeight / internalScale);
    const offX = offsetX || 0;
    const offY = offsetY || 0;

    const connectionDotsCount = displaySettings.connectionDotsCount;
    const totalDots = MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS.length * connectionDotsCount;
    const dotPositions = new Float32Array(totalDots * 3);
    let pIdx = 0;

    for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
      const sx = data[startIdx * 3] * scaleX + offX;
      const sy = data[startIdx * 3 + 1] * scaleY + offY;
      const sz = data[startIdx * 3 + 2] * scaleX;

      const ex = data[endIdx * 3] * scaleX + offX;
      const ey = data[endIdx * 3 + 1] * scaleY + offY;
      const ez = data[endIdx * 3 + 2] * scaleX;

      for (let i = 1; i <= connectionDotsCount; i++) {
        const t = i / (connectionDotsCount + 1);
        dotPositions[pIdx++] = sx + (ex - sx) * t;
        dotPositions[pIdx++] = sy + (ey - sy) * t;
        dotPositions[pIdx++] = sz + (ez - sz) * t;
      }
    }

    // Set state
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, dotPositions, this.gl.DYNAMIC_DRAW);

    // Uniforms
    const [r, g, b, a] = hexToRgba(colorHex);
    this.gl.uniform4f(this.uColor, r / 255, g / 255, b / 255, (a / 255) * displaySettings.opacity);
    this.gl.uniform1f(this.uPointSize, displaySettings.dotSize * this.dpr);

    // Draw dots
    this.gl.drawArrays(this.gl.POINTS, 0, totalDots);
  }

  public override clear(): void {
    if (!this.gl) return;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public override onResize(width: number, height: number): void {
    super.onResize(width, height);
    if (this.gl) {
      this.canvas.width = Math.floor(width * this.dpr);
      this.canvas.height = Math.floor(height * this.dpr);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.updateProjection();
    }
  }

  public render(): void {
    this.onRender();
  }

  public submitFrame(): void {
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
    // WebGL doesn't have native text rendering - use canvas fallback
    // Create a temporary canvas for text rendering
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    if (!textCtx) {
      console.warn('Could not get 2D context for text rendering in WebGL');
      return;
    }

    const scaledSize = size * this.dpr;
    textCanvas.width = 512;
    textCanvas.height = 128;

    textCtx.font = `${scaledSize}px ${font}`;
    textCtx.textAlign = align as CanvasTextAlign;
    textCtx.textBaseline = 'top';
    textCtx.fillStyle = invertColours ? '#000000' : '#FFFFFF';

    textCtx.fillText(text, 10, 10);

    // Create a 2D texture from the canvas and render it at the given position
    // For simplicity, we'll render as an overlay using 2D context on top
    if (this.canvas instanceof HTMLCanvasElement) {
      const ctx2d = this.canvas.getContext('2d');
      if (ctx2d) {
        ctx2d.font = `${scaledSize}px ${font}`;
        ctx2d.textAlign = align as CanvasTextAlign;
        ctx2d.textBaseline = 'top';
        ctx2d.fillStyle = invertColours ? '#000000' : '#FFFFFF';
        ctx2d.fillText(text, x * this.dpr, y * this.dpr);
      }
    }
  }

  public async destroy(): Promise<void> {
    if (this.gl) {
      this.gl.deleteBuffer(this.vbo);
      this.gl.deleteVertexArray(this.vao);
      this.gl.deleteProgram(this.program);
      this.gl = null;
    }
    await super.destroy();
  }
}
