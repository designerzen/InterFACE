import OriginalDisplayCanvas2d from '../display/display-canvas-2d.js'
import { MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS } from '../models/face-landmark-constants.js'
import { displaySettings } from './DisplaySettings'

export class DisplayCanvas2d extends OriginalDisplayCanvas2d {
    declare dpr: number

    public drawLandmarks(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        const ctx = this.canvasContext as unknown as CanvasRenderingContext2D
        const originalAlpha = ctx.globalAlpha
        ctx.globalAlpha = displaySettings.opacity
        ctx.fillStyle = color

        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvas.width / internalScale)
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvas.height / internalScale)
        const dot = displaySettings.dotSize * this.dpr
        const path = new Path2D()

        for (let i = 0; i < data.length; i += 3) {
            const x = data[i] * scaleX + (offsetX || 0)
            const y = data[i + 1] * scaleY + (offsetY || 0)
            path.rect(x, y, dot, dot)
        }

        ctx.fill(path)
        ctx.globalAlpha = originalAlpha
    }

    public drawFaceConnections(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        const ctx = this.canvasContext as unknown as CanvasRenderingContext2D
        const originalAlpha = ctx.globalAlpha
        ctx.globalAlpha = displaySettings.opacity
        ctx.strokeStyle = color
        ctx.lineWidth = 1

        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvas.width / internalScale)
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvas.height / internalScale)
        const offX = offsetX || 0
        const offY = offsetY || 0
        const path = new Path2D()

        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX
            const sy = data[startIdx * 3 + 1] * scaleY + offY
            const ex = data[endIdx * 3] * scaleX + offX
            const ey = data[endIdx * 3 + 1] * scaleY + offY

            path.moveTo(sx, sy)
            path.lineTo(ex, ey)
        }

        ctx.stroke(path)
        ctx.globalAlpha = originalAlpha
    }

    public drawConnectionDots(data: Float32Array, color: string, internalScale: number, regionSize?: number, offsetX?: number, offsetY?: number): void {
        const ctx = this.canvasContext as unknown as CanvasRenderingContext2D
        const originalAlpha = ctx.globalAlpha
        ctx.globalAlpha = displaySettings.opacity
        ctx.fillStyle = color

        const useRegion = regionSize !== undefined && offsetX !== undefined && offsetY !== undefined
        const scaleX = useRegion ? (regionSize / internalScale) : (this.canvas.width / internalScale)
        const scaleY = useRegion ? (regionSize / internalScale) : (this.canvas.height / internalScale)
        const offX = offsetX || 0
        const offY = offsetY || 0
        const numIntermediate = displaySettings.connectionDotsCount
        const dot = displaySettings.dotSize * this.dpr
        const path = new Path2D()

        for (const [startIdx, endIdx] of MEDIAPIPE_FACE_MESH_CONNECTED_KEYPOINTS_PAIRS) {
            const sx = data[startIdx * 3] * scaleX + offX
            const sy = data[startIdx * 3 + 1] * scaleY + offY
            const ex = data[endIdx * 3] * scaleX + offX
            const ey = data[endIdx * 3 + 1] * scaleY + offY

            for (let i = 1; i <= numIntermediate; i++) {
                const t = i / (numIntermediate + 1)
                const x = sx + (ex - sx) * t
                const y = sy + (ey - sy) * t
                path.rect(x - dot / 2, y - dot / 2, dot, dot)
            }
        }

        ctx.fill(path)
        ctx.globalAlpha = originalAlpha
    }
}

export default DisplayCanvas2d
