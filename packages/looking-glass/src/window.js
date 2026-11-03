const placeOnPortrait = async (popup, serial, isClosed) => {
  if (typeof window.getScreenDetails !== 'function') return { placed: false, reason: 'unsupported' }
  try {
    const { screens } = await window.getScreenDetails()
    if (isClosed() || popup.closed) return { placed: false, reason: 'closed' }
    const matchingSerial = serial ? screens.filter(screen => screen.label?.includes(serial)) : []
    const candidates = matchingSerial.length ? matchingSerial : screens.filter(screen => /looking\s*glass|\blkg\b/i.test(screen.label ?? ''))
    // Screen labels do not always include serials. Never guess between multiple panels.
    if (candidates.length !== 1) return { placed: false, reason: 'ambiguous-or-missing' }
    const screen = candidates[0]
    if (![screen.left, screen.top, screen.width, screen.height].every(Number.isFinite) || screen.width <= 0 || screen.height <= 0) {
      return { placed: false, reason: 'invalid-screen' }
    }
    popup.moveTo(screen.left, screen.top)
    popup.resizeTo(screen.width, screen.height)
    return { placed: true }
  } catch {
    // Permission denial and unsupported window managers retain manual placement.
    return { placed: false, reason: 'unavailable' }
  }
}

// Open synchronously from a user gesture; requesting placement must not delay the popup.
export function openLookingGlassWindow({ width = 1536, height = 2048, serial, canvas: suppliedCanvas, onClose = () => {} } = {}) {
  const popup = window.open('', '', `popup,width=${width},height=${height}`)
  if (!popup) throw new Error('The Looking Glass display window was blocked')
  popup.document.title = 'Looking Glass'
  popup.document.body.style.cssText = 'margin:0;background:#000;overflow:hidden'
  const canvas = suppliedCanvas ?? popup.document.createElement('canvas')
  const parent = canvas.parentNode, next = canvas.nextSibling, style = canvas.getAttribute?.('style'), document = canvas.ownerDocument
  canvas.style.cssText = 'display:block;width:100vw;height:100vh;object-fit:contain'
  popup.document.body.append(canvas)
  const fullscreen = () => canvas.requestFullscreen?.()?.catch(() => {})
  canvas.addEventListener('dblclick', fullscreen)
  let closed = false
  const close = () => {
    if (closed) return
    closed = true
    canvas.removeEventListener('dblclick', fullscreen)
    popup.removeEventListener('pagehide', close)
    window.removeEventListener('pagehide', close)
    if (suppliedCanvas) {
      document?.adoptNode(canvas)
      parent?.insertBefore(canvas, next?.parentNode === parent ? next : null)
      if (style === null) canvas.removeAttribute('style')
      else canvas.setAttribute('style', style)
    }
    if (!popup.closed) popup.close()
    onClose()
  }
  popup.addEventListener('pagehide', close)
  window.addEventListener('pagehide', close)
  const placement = placeOnPortrait(popup, serial, () => closed)
  return { canvas, window: popup, close, placement }
}
