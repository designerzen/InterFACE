/**
 * Display Worker Proxy - Manages communication with worker threads
 * Provides a clean interface for offscreen rendering
 */

export class DisplayWorkerProxy {
    constructor(workerPath = new URL('./display-worker.js', import.meta.url)) {
        this.worker = new Worker(workerPath, { type: 'module' });
        this.initialized = false;
        this.setupWorkerListeners();
    }

    /**
     * Setup worker message listeners
     */
    setupWorkerListeners() {
        this.worker.onmessage = (event) => {
            const { command, success } = event.data;
            if (success) {
                if (command === 'init') {
                    this.initialized = true;
                }
            }
        };

        this.worker.onerror = (error) => {
            console.error('Worker error:', error.message);
        };
    }

    /**
     * Initialize worker with canvas
     */
    init(canvas) {
        this.worker.postMessage({
            command: 'init',
            canvas: canvas instanceof OffscreenCanvas ? canvas : canvas.transferControlToOffscreen()
        }, [canvas instanceof OffscreenCanvas ? canvas : canvas.transferControlToOffscreen()]);
    }

    /**
     * Send render command to worker
     */
    render(type, data) {
        if (!this.initialized) {
            console.warn('Worker not initialized');
            return;
        }

        this.worker.postMessage({
            command: 'render',
            type,
            ...data
        });
    }

    /**
     * Clear canvas via worker
     */
    clear() {
        this.worker.postMessage({ command: 'clear' });
    }

    /**
     * Resize canvas via worker
     */
    resize(width, height) {
        this.worker.postMessage({
            command: 'resize',
            width,
            height
        });
    }

    /**
     * Draw landmarks
     */
    drawLandmarks(points, color, dotSize) {
        this.render('drawLandmarks', { points, color, dotSize });
    }

    /**
     * Draw connections
     */
    drawConnections(connections, color, lineWidth) {
        this.render('drawConnections', { connections, color, lineWidth });
    }

    /**
     * Draw text
     */
    drawText(x, y, text, size, font, color) {
        this.render('drawText', { x, y, text, size, font, color });
    }

    /**
     * Terminate worker
     */
    terminate() {
        this.worker.terminate();
        this.initialized = false;
    }
}

export default DisplayWorkerProxy;
