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
    return { placed: true, fullscreen: false }
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
  let closed = false
  const outputDocument = popup.document
  const fullscreenButton = outputDocument.createElement('button')
  fullscreenButton.type = 'button'
  fullscreenButton.id = 'looking-glass-fullscreen'
  fullscreenButton.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;box-sizing:border-box;z-index:1000;margin:0;padding:5vw;border:0;border-radius:0;background:#15151d99;color:white;font:600 clamp(24px,5vw,80px) system-ui;cursor:pointer'
  let requestingFullscreen = false
  const syncFullscreenButton = () => {
    const active = Boolean(outputDocument.fullscreenElement)
    const supported = typeof outputDocument.documentElement.requestFullscreen === 'function'
    fullscreenButton.disabled = active || requestingFullscreen || !supported
    fullscreenButton.textContent = active ? 'FULLSCREEN' : requestingFullscreen ? 'ENTERING FULLSCREEN…' : supported ? 'ENTER FULLSCREEN' : 'FULLSCREEN UNAVAILABLE'
    fullscreenButton.style.opacity = active ? '0' : fullscreenButton.disabled ? '0.35' : '1'
    fullscreenButton.style.pointerEvents = fullscreenButton.disabled ? 'none' : 'auto'
    fullscreenButton.style.cursor = fullscreenButton.disabled ? 'default' : 'pointer'
  }
  const fullscreen = async () => {
    if (closed || fullscreenButton.disabled) return
    requestingFullscreen = true
    syncFullscreenButton()
    try {
      // The output document includes both the canvas and its overlay button.
      // Request directly in this click, after placement, with fresh activation.
      await outputDocument.documentElement.requestFullscreen({ navigationUI: 'hide' })
    } catch {
      fullscreenButton.title = 'Fullscreen was blocked. Click to try again.'
    } finally {
      requestingFullscreen = false
      if (!closed) syncFullscreenButton()
    }
  }
  fullscreenButton.addEventListener('click', fullscreen)
  outputDocument.addEventListener('fullscreenchange', syncFullscreenButton)
  outputDocument.body.append(fullscreenButton)
  syncFullscreenButton()
  const close = () => {
    if (closed) return
    closed = true
    fullscreenButton.removeEventListener('click', fullscreen)
    outputDocument.removeEventListener('fullscreenchange', syncFullscreenButton)
    fullscreenButton.remove()
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
  return { canvas, window: popup, fullscreenButton, requestFullscreen: fullscreen, close, placement }
}
