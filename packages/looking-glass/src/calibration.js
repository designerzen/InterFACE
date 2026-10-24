const value = entry => typeof entry === 'object' && entry !== null ? entry.value : entry

const finite = (entry, name) => {
  const result = value(entry)
  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new TypeError(`${name} must be a finite number`)
  }
  return result
}

const positive = (entry, name) => {
  const result = finite(entry, name)
  if (result <= 0) throw new RangeError(`${name} must be positive`)
  return result
}

export const PORTRAIT_QUILT = Object.freeze({ width: 3360, height: 3360, columns: 8, rows: 6, views: 48 })

export function normalizeQuilt(options = {}) {
  const quilt = { ...PORTRAIT_QUILT, ...options }
  quilt.views = options.views ?? quilt.columns * quilt.rows
  for (const name of ['width', 'height', 'columns', 'rows', 'views']) {
    if (!Number.isSafeInteger(quilt[name]) || quilt[name] < 1) {
      throw new RangeError(`quilt.${name} must be a positive integer`)
    }
  }
  if (quilt.views > quilt.columns * quilt.rows) throw new RangeError('Quilt has insufficient tiles')
  if (quilt.width % quilt.columns || quilt.height % quilt.rows) {
    throw new RangeError('Quilt dimensions must divide evenly into tiles')
  }
  return Object.freeze({ ...quilt, tileWidth: quilt.width / quilt.columns, tileHeight: quilt.height / quilt.rows })
}

// Accepts a raw Bridge/HoloPlay calibration, without modifying the caller's data.
// Non-stripe panels require a different subpixel shader and are deliberately rejected.
export function normalizeCalibration(raw) {
  if (!raw || typeof raw !== 'object') throw new TypeError('Device calibration is required')
  if (raw.subpixelCells?.length || value(raw.CellPatternMode ?? 0) !== 0) {
    throw new RangeError('Only RGB-stripe calibration is supported by this version')
  }
  const screenWidth = positive(raw.screenW, 'screenW')
  const screenHeight = positive(raw.screenH, 'screenH')
  if (!Number.isSafeInteger(screenWidth) || !Number.isSafeInteger(screenHeight)) {
    throw new RangeError('Panel dimensions must be integers')
  }
  const slope = finite(raw.slope, 'slope')
  if (!slope) throw new RangeError('slope must not be zero')
  const dpi = positive(raw.DPI, 'DPI')
  const flip = name => {
    const flag = value(raw[name] ?? 0)
    if (![0, 1, false, true].includes(flag)) throw new RangeError(`${name} must be 0 or 1`)
    return Boolean(flag)
  }
  const flipX = flip('flipImageX')
  return Object.freeze({
    screenWidth, screenHeight,
    aspect: screenWidth / screenHeight,
    pitch: positive(raw.pitch, 'pitch') * screenWidth / dpi * Math.cos(Math.atan(1 / slope)),
    tilt: screenHeight / (screenWidth * slope) * (flipX ? -1 : 1),
    subpixel: (flipX ? -1 : 1) / (screenWidth * 3),
    center: finite(raw.center, 'center'),
    viewCone: positive(raw.viewCone, 'viewCone') * Math.PI / 180,
    flipX,
    flipY: flip('flipImageY'),
    flipSubpixel: flip('flipSubp'),
    invertViews: flip('invView'),
    serial: typeof raw.serial === 'string' ? raw.serial : ''
  })
}

// Top-left viewport coordinates for Three's modern renderer; quilt view 0 is bottom-left.
export function getTileViewport(index, quilt) {
  if (!Number.isInteger(index) || index < 0 || index >= quilt.views) throw new RangeError('Invalid view index')
  return {
    x: index % quilt.columns * quilt.tileWidth,
    y: (quilt.rows - 1 - Math.floor(index / quilt.columns)) * quilt.tileHeight,
    width: quilt.tileWidth,
    height: quilt.tileHeight
  }
}

// Reference implementation for calibration tests and diagnostic tools.
export function getViewIndex(x, y, channel, calibration, views) {
  const stripe = calibration.flipSubpixel ? 2 - channel : channel
  const phase = (x + stripe * calibration.subpixel + y * calibration.tilt) * calibration.pitch - calibration.center
  let view = 1 - (phase - Math.floor(phase))
  if (calibration.invertViews) view = 1 - view
  return Math.min(views - 1, Math.max(0, Math.floor(view * views)))
}
