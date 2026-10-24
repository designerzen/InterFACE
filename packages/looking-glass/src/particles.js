import { MeshBasicNodeMaterial } from 'three/webgpu'
import { positionLocal, time, uniform, vec3 } from 'three/tsl'

// Stateless GPU vertex animation shared by both backends, without CPU attribute uploads.
// Use with meshes/instanced billboards; this does not replace a stateful physics simulation.
export function createParticleMaterial({ color = 0xffffff, amplitude = 0.025, speed = 1, ...options } = {}) {
  const material = new MeshBasicNodeMaterial({ color, ...options })
  const strength = uniform(amplitude)
  const rate = uniform(speed)
  material.positionNode = positionLocal.add(vec3(
    positionLocal.y.mul(11).add(time.mul(rate)).sin().mul(strength),
    positionLocal.x.mul(7).add(time.mul(rate)).cos().mul(strength),
    positionLocal.y.mul(5).add(time.mul(rate)).sin().mul(strength)
  ))
  return { material, amplitude: strength, speed: rate }
}
