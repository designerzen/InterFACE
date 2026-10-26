// Call synchronously from a user gesture, then initialise the renderer on the returned canvas.
export function openLookingGlassWindow({ width = 1536, height = 2048, canvas: suppliedCanvas, onClose = () => {} } = {}) {
  const popup = window.open('', '', `popup,width=${width},height=${height}`)
  if (!popup) throw new Error('The Looking Glass display window was blocked')
  popup.document.title = 'Looking Glass'
  popup.document.body.style.cssText = 'margin:0;background:#000;overflow:hidden'
  const canvas = suppliedCanvas ?? popup.document.createElement('canvas')
  const parent = canvas.parentNode, next = canvas.nextSibling, style = canvas.getAttribute?.('style'), document = canvas.ownerDocument
  canvas.style.cssText = 'display:block;width:100vw;height:100vh;object-fit:contain'
  popup.document.body.append(canvas)
  const fullscreen = () => canvas.requestFullscreen().catch(() => {})
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
  return { canvas, window: popup, close }
}
