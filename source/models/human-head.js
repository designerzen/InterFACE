import { Box3, Group, MeshBasicMaterial, Vector3, LoadingManager, Texture } from 'three'

export async function loadHumanHead(uri) {
  if (/\.glb(?:[?#]|$)/i.test(uri)) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
    return new GLTFLoader().loadAsync(uri)
  }
  const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
  // FBX's texture lookups use extension keys. The white head needs no texture downloads.
  const manager = new LoadingManager()
  const placeholder = { path: '', setPath(path) { this.path = path; return this }, load() { return new Texture() } }
  manager.addHandler(/^\./, placeholder)
  return new FBXLoader(manager).loadAsync(uri)
}

export const canonicalMorphName = name => name.split('.').pop()
  .replace(/^./, first => first.toLowerCase()).replace(/_L$/, 'Left').replace(/_R$/, 'Right')

// Each mesh owns its own target ordering. Never share numeric indices between meshes.
export function bindMorphTargets(meshes) {
  const bindings = new Map()
  for (const mesh of meshes) for (const [name, index] of Object.entries(mesh.morphTargetDictionary ?? {})) {
    const feature = canonicalMorphName(name)
    if (!bindings.has(feature)) bindings.set(feature, [])
    bindings.get(feature).push({ mesh, index })
  }
  return bindings
}

export function applyMorphScore(bindings, name, score, smoothing = .5) {
  if (!Number.isFinite(score)) return
  for (const { mesh, index } of bindings.get(name) ?? []) {
    const current = mesh.morphTargetInfluences[index] ?? 0
    mesh.morphTargetInfluences[index] = current + (Math.min(1, Math.max(0, score)) - current) * smoothing
  }
}

export function prepareHumanHead(root) {
  root.updateMatrixWorld(true)
  const bounds = new Box3()
  const point = new Vector3()
  // Base vertices give neutral dimensions, unlike bounds expanded by all morph extremes.
  root.traverse(mesh => {
    if (!mesh.isMesh) return
    const positions = mesh.geometry.attributes.position
    const faceCount = mesh.userData.faceVertexCount ?? positions.count
    if (mesh.morphTargetInfluences?.length) for (let i = 0; i < faceCount; i++) {
      bounds.expandByPoint(point.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld))
    }
    const previous = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    // A uniform translucent silhouette: scene lights must not turn the nose
    // and ears into bright patches against the rest of the face.
    mesh.material = new MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
    previous.forEach(material => {
      for (const value of Object.values(material ?? {})) if (value?.isTexture) value.dispose()
      material?.dispose()
    })
  })
  const height = bounds.getSize(new Vector3()).y
  if (!Number.isFinite(height) || height <= 0) throw new Error('Human head requires valid neutral morph geometry')
  const centered = new Group()
  centered.add(root)
  centered.scale.setScalar(1 / height)
  centered.position.copy(bounds.getCenter(new Vector3())).multiplyScalar(-1 / height)
  const head = new Group()
  head.name = 'Neutral human head'
  head.userData.humanFace = true
  head.add(centered)
  return head
}
