import { MeshBasicNodeMaterial, QuadMesh } from 'three/webgpu'
import { float, vec2, vec4, screenUV, texture } from 'three/tsl'

export function createInterlacer(quiltTexture, quilt, calibration) {
  // screenUV and render-target sampling use top-left coordinates in TSL.
  // Calibration and quilt indices use bottom-left coordinates.
  const panel = vec2(screenUV.x, screenUV.y.oneMinus())
  const image = vec2(calibration.flipX ? panel.x.oneMinus() : panel.x,
    calibration.flipY ? panel.y.oneMinus() : panel.y)
  const samples = [0, 1, 2].map(channel => {
    const stripe = calibration.flipSubpixel ? 2 - channel : channel
    const phase = panel.x.add(stripe * calibration.subpixel).add(panel.y.mul(calibration.tilt))
      .mul(calibration.pitch).sub(calibration.center)
    const view = calibration.invertViews ? phase.fract() : phase.fract().oneMinus()
    const index = view.mul(quilt.views).floor().clamp(0, quilt.views - 1)
    // Clamp to texel centres so linear filtering cannot bleed between adjacent tiles.
    const local = image.mul(vec2(quilt.tileWidth, quilt.tileHeight))
      .clamp(vec2(0.5), vec2(quilt.tileWidth - 0.5, quilt.tileHeight - 0.5))
    const u = index.mod(quilt.columns).mul(quilt.tileWidth).add(local.x).div(quilt.width)
    const bottomY = index.div(quilt.columns).floor().mul(quilt.tileHeight).add(local.y).div(quilt.height)
    return texture(quiltTexture, vec2(u, bottomY.oneMinus()))[['r', 'g', 'b'][channel]]
  })
  const material = new MeshBasicNodeMaterial({ depthTest: false, depthWrite: false, toneMapped: false })
  material.fragmentNode = vec4(samples[0], samples[1], samples[2], float(1))
  const quad = new QuadMesh(material)
  return { render: renderer => quad.render(renderer), dispose: () => material.dispose() }
}
