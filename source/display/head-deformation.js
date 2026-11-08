// Blend once per expression update, rather than repeating 51 texture-driven
// morph targets for every vertex in every Looking Glass quilt view.
export function createHeadDeformer(root) {
  const meshes = []
  root.traverse(mesh => {
    const geometry = mesh.geometry
    if (!mesh.isMesh || !geometry.morphAttributes.position?.length) return
    if (!geometry.morphTargetsRelative) throw new Error('Quilt head deformation requires relative morph targets')
    const channels = ['position', 'normal'].filter(name => geometry.morphAttributes[name]?.length)
    const attributes = channels.map(name => {
      const attribute = geometry.attributes[name]
      const blended = Float64Array.from(attribute.array)
      const targets = geometry.morphAttributes[name].map(target => {
        const indices = [], values = []
        for (let i = 0; i < target.array.length; i++) if (target.array[i] !== 0) {
          indices.push(i); values.push(target.array[i])
        }
        return { indices: Uint32Array.from(indices), values: Float32Array.from(values) }
      })
      return { attribute, blended, targets }
    })
    meshes.push({ mesh, attributes, weights: new Float64Array(mesh.morphTargetInfluences.length), initialized: false })
    // Avatar keeps the named influences; the render geometry now holds the final
    // positions/normals, so neither the GPU nor landmark fitting applies them twice.
    geometry.morphAttributes = {}
    mesh.frustumCulled = false
  })
  return {
    update() {
      let changed = false
      for (const state of meshes) {
        const { mesh, attributes, weights } = state
        const influences = mesh.morphTargetInfluences
        const changes = []
        for (let i = 0; i < weights.length; i++) if (weights[i] !== influences[i]) {
          changes.push({ target: i, weight: influences[i] - weights[i] })
        }
        if (!changes.length && state.initialized) continue
        for (const { attribute, blended, targets } of attributes) {
          // Double precision retains the accumulated shape without float32 drift.
          // Apply only changed coefficients, then convert/upload each buffer once.
          for (const { target, weight } of changes) {
            const { indices, values } = targets[target]
            for (let i = 0; i < indices.length; i++) blended[indices[i]] += values[i] * weight
          }
          attribute.array.set(blended)
          attribute.needsUpdate = true
        }
        weights.set(influences)
        state.initialized = true
        changed = true
      }
      return changed
    }
  }
}
