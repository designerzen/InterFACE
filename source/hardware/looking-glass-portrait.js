import { getConnectedPortraitCount } from '../../packages/looking-glass/src/detect.js'

// Keep the app's existing API while loading only the dependency-free device probe.
export const howManyHolographicDisplaysAreConnected = (timeOut = 1500) =>
  getConnectedPortraitCount({ timeoutMs: timeOut })
