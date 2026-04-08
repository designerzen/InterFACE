/**
 * Display Worker - Offscreen canvas rendering worker
 * Handles rendering in a separate thread to avoid blocking the main thread
 */

let canvas = null;
let canvasContext = null;

/**
 * Initialize worker with canvas
 */
self.onmessage = (event) => {
    const { command, payload } = event.data;

    switch (command) {
        case 'init':
            handleInit(event.data);
            break;
        case 'render':
            handleRender(event.data);
            break;
        case 'clear':
            handleClear();
            break;
        case 'resize':
            handleResize(event.data);
            break;
        default:
            console.warn('Unknown worker command:', command);
    }
};

/**
 * Initialize the worker with canvas and context
 */
function handleInit(data) {
    canvas = data.canvas;
    canvasContext = canvas.getContext('2d');
    self.postMessage({ command: 'init', success: true });
}

/**
 * Handle rendering commands
 */
function handleRender(data) {
    if (!canvasContext) return;

    const { type, ...renderData } = data;

    switch (type) {
        case 'drawLandmarks':
            drawLandmarks(renderData);
            break;
        case 'drawConnections':
            drawConnections(renderData);
            break;
        case 'drawText':
            drawText(renderData);
            break;
        default:
            console.warn('Unknown render type:', type);
    }

    self.postMessage({ command: 'render', success: true });
}

/**
 * Clear the canvas
 */
function handleClear() {
    if (canvasContext) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Resize canvas
 */
function handleResize(data) {
    if (canvas) {
        canvas.width = data.width;
        canvas.height = data.height;
    }
}

/**
 * Draw landmarks on canvas
 */
function drawLandmarks(data) {
    const { points, color, dotSize } = data;
    canvasContext.fillStyle = color;

    points.forEach(point => {
        canvasContext.fillRect(point.x, point.y, dotSize, dotSize);
    });
}

/**
 * Draw connections between landmarks
 */
function drawConnections(data) {
    const { connections, color, lineWidth } = data;
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = lineWidth;

    connections.forEach(([start, end]) => {
        canvasContext.beginPath();
        canvasContext.moveTo(start.x, start.y);
        canvasContext.lineTo(end.x, end.y);
        canvasContext.stroke();
    });
}

/**
 * Draw text on canvas
 */
function drawText(data) {
    const { x, y, text, size, font, color } = data;
    canvasContext.font = `${size}px ${font}`;
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, x, y);
}
