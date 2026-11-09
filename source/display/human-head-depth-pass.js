import { MeshBasicMaterial } from 'three'

// Resolve the nearest surface before blending the translucent colour. A single
// transparent draw cannot do this: triangles blend in geometry order.
export function createHumanHeadDepthPass(root) {
  const meshes = []
  root.traverse(mesh => { if (mesh.isMesh) meshes.push(mesh) })
  const passes = meshes.map(mesh => {
    const pass = mesh.clone(false)
    pass.name = `${mesh.name} depth`
    pass.userData = { humanHeadDepthPass: true }
    pass.position.set(0, 0, 0)
    pass.rotation.set(0, 0, 0)
    pass.scale.set(1, 1, 1)
    pass.matrix.identity()
    pass.matrixAutoUpdate = false
    pass.morphTargetInfluences = mesh.morphTargetInfluences
    pass.morphTargetDictionary = {}
    pass.material = new MeshBasicMaterial({
      colorWrite: false, depthWrite: true, depthTest: true,
      transparent: true, toneMapped: false
    })
    pass.frustumCulled = false
    pass.renderOrder = 9
    pass.visible = false
    mesh.add(pass)
    return pass
  })
  return {
    update(visible) { for (const pass of passes) pass.visible = visible },
    dispose() {
      for (const pass of passes) {
        pass.removeFromParent()
        pass.material.dispose()
      }
    }
  }
}
