// A bounded, reused pool. All note bursts share one small draw and animate once
// per frame, before the holographic views render the same scene.
export function createMouthNoteEmitter(host, THREE) {
  const capacity = 256
  const positions = new Float32Array(capacity * 3), colours = new Float32Array(capacity * 4)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 4))
  geometry.setDrawRange(0, 0)
  const material = new THREE.PointsMaterial({
    size: host.options?.mouthNoteParticleSize ?? .018, vertexColors: true,
    transparent: true, depthWrite: false, toneMapped: false, sizeAttenuation: true
  })
  const visual = new THREE.Points(geometry, material)
  visual.name = 'mouth-note-particles'; visual.frustumCulled = false; visual.renderOrder = 25; visual.visible = false
  host.scene.add(visual)
  const pool = Array.from({ length: capacity }, () => ({ age: 0, life: 0 }))
  const queue = [], colour = new THREE.Color(), origin = new THREE.Vector3(), across = new THREE.Vector3(), up = new THREE.Vector3(), direction = new THREE.Vector3(), scratch = new THREE.Vector3()
  let cursor = 0, lastTime, disposed = false
  return {
    visual,
    emit(person, { at = performance.now(), velocity = person.noteVelocity ?? .7 } = {}) {
      if (disposed || person.dead || person.alive === false || !(velocity > 0)) return false
      const points = person.data?.keypoints ?? person.data?.faceLandmarks
      const finite = p => p && [p.x, p.y, p.z ?? 0].every(Number.isFinite)
      if (!finite(points?.[13]) || !finite(points?.[14])) return false
      let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
      for (const p of points) if (finite(p)) {
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x)
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y)
        minZ = Math.min(minZ, p.z ?? 0); maxZ = Math.max(maxZ, p.z ?? 0)
      }
      const zoom = host.options?.mirrorFaceScale ?? 3.14
      const world = (index, target) => {
        const p = points[index]
        return target.set((p.x - (minX + maxX) * .5) * zoom + (host.options?.mirrorCenterX ?? 0),
          -(p.y - (minY + maxY) * .5) * zoom + (host.options?.mirrorCenterY ?? 0),
          -((p.z ?? 0) - (minZ + maxZ) * .5) * zoom + (host.options?.mirrorCenterZ ?? 0))
      }
      origin.copy(world(13, scratch)).add(world(14, scratch)).multiplyScalar(.5)
      direction.set(0, 0, 1)
      if ([234, 454, 10, 152].every(i => finite(points[i]))) {
        across.copy(world(454, scratch)).sub(world(234, scratch))
        up.copy(world(10, scratch)).sub(world(152, scratch))
        direction.crossVectors(across, up)
        if (direction.lengthSq() < 1e-8) direction.set(0, 0, 1)
        else direction.normalize()
        if (direction.z < 0) direction.negate()
      }
      colour.setHSL(((person.hue ?? 0) % 360 + 360) % 360 / 360,
        (person.saturation ?? 80) / 100, (person.luminosity ?? 50) / 100, THREE.SRGBColorSpace)
      if (queue.length === 16) queue.shift()
      queue.push({ at, x: origin.x, y: origin.y, z: origin.z,
        dx: direction.x, dy: direction.y, dz: direction.z,
        r: colour.r, g: colour.g, b: colour.b, velocity: Math.min(1, velocity) })
      return true
    },
    update(now = performance.now()) {
      if (disposed) return
      const elapsed = lastTime === undefined ? 0 : Math.max(0, (now - lastTime) / 1000)
      lastTime = now
      const dt = Math.min(.05, elapsed), drag = Math.exp(-dt * .8)
      for (let i = queue.length - 1; i >= 0; i--) {
        const event = queue[i]
        if (event.at > now) continue
        queue.splice(i, 1)
        if (now - event.at > 1200) continue
        const quantity = 8 + Math.round(event.velocity * 8)
        for (let j = 0; j < quantity; j++) {
          const p = pool[cursor++ % capacity], speed = .6 + event.velocity * .65 + Math.random() * .3
          Object.assign(p, { x: event.x + (Math.random() - .5) * .025,
            y: event.y + (Math.random() - .5) * .012, z: event.z + .015,
            vx: event.dx * speed + (Math.random() - .5) * .22,
            vy: event.dy * speed + .1 + Math.random() * .18,
            vz: event.dz * speed + (Math.random() - .5) * .12,
            age: Math.max(0, (now - event.at) / 1000) - elapsed,
            life: .65 + Math.random() * .4, r: event.r, g: event.g, b: event.b })
        }
      }
      let active = 0
      for (const p of pool) {
        p.age += elapsed
        if (p.age >= p.life) continue
        if (p.age > 0) {
          p.vx *= drag; p.vy = p.vy * drag + .12 * dt; p.vz *= drag
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt
        }
        positions[active * 3] = p.x; positions[active * 3 + 1] = p.y; positions[active * 3 + 2] = p.z
        colours[active * 4] = p.r; colours[active * 4 + 1] = p.g; colours[active * 4 + 2] = p.b
        colours[active * 4 + 3] = (1 - p.age / p.life) ** 2 * .85
        active++
      }
      geometry.setDrawRange(0, active)
      visual.visible = active > 0
      if (active) {
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
      }
    },
    dispose() {
      disposed = true; queue.length = 0
      visual.removeFromParent(); geometry.dispose(); material.dispose()
    }
  }
}
