import AbstractDisplay from "./display-abstract"
import { DISPLAY_WEB_GL } from "./display-types.js"

// Basic vertex and fragment shaders for 2D rendering
const VERTEX_SHADER = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    
    varying vec2 v_texCoord;
    
    void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
    }
`

const FRAGMENT_SHADER = `
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform float u_time;
    uniform vec2 u_resolution;
    
    varying vec2 v_texCoord;
    
    void main() {
        vec2 uv = v_texCoord;
        vec4 color = texture2D(u_image, uv);
        
        // Add some basic effects
        float brightness = 1.0 + 0.1 * sin(u_time * 0.001);
        color.rgb *= brightness;
        
        gl_FragColor = color;
    }
`

export default class DisplayWebGL extends AbstractDisplay {
    name = DISPLAY_WEB_GL
    gl = null
    program = null
    startTime = Date.now()
    
    constructor(canvas, initialWidth, initialHeight, options = {}) {
        super(canvas, initialWidth, initialHeight, options)
        this.initWebGL()
    }

    initWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')
        if (!this.gl) {
            throw new Error('WebGL not supported')
        }

        // Create shader program
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER)
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
        this.program = this.createProgram(vertexShader, fragmentShader)

        // Setup buffers
        this.setupBuffers()
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader))
            this.gl.deleteShader(shader)
            return null
        }
        return shader
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram()
        this.gl.attachShader(program, vertexShader)
        this.gl.attachShader(program, fragmentShader)
        this.gl.linkProgram(program)

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(program))
            return null
        }
        return program
    }

    setupBuffers() {
        // Create position buffer
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ])
        const positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW)

        // Create texture coordinate buffer
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ])
        const texCoordBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW)

        // Store buffer references
        this.buffers = { position: positionBuffer, texCoord: texCoordBuffer }
    }

    drawElement(element, x = 0, y = 0, flip = true) {
        this.gl.useProgram(this.program)

        // Create and bind texture
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, element)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)

        // Set uniforms
        const timeLocation = this.gl.getUniformLocation(this.program, 'u_time')
        const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution')
        
        this.gl.uniform1f(timeLocation, Date.now() - this.startTime)
        this.gl.uniform2f(resolutionLocation, this.width, this.height)

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    }

    clear() {
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    onResize(width, height) {
        super.onResize(width, height)
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    }

    destroy() {
        if (this.gl) {
            this.gl.deleteProgram(this.program)
            this.gl = null
        }
        super.destroy()
    }
}