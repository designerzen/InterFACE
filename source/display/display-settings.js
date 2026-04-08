/**
 * Display Settings - Configuration for display rendering options
 */

export const displaySettings = {
    // Point/landmark rendering
    dotSize: 4,
    opacity: 0.8,
    connectionDotsCount: 1,
    
    // Colors
    faceColor: '#ff0055',
    handsColor: '#00ffcc',
    
    // Rendering
    lineWidth: 1.5,
    particleSize: 2,
    
    // Performance
    maxParticles: 468,
    updateFrameInterval: 1
};

/**
 * Update display settings
 */
export const updateDisplaySettings = (updates) => {
    Object.assign(displaySettings, updates);
};

/**
 * Get current display settings
 */
export const getDisplaySettings = () => {
    return { ...displaySettings };
};
