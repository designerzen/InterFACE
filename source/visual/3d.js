// just a basic three.js scene, nothing special
const scene = new THREE.Scene()
scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) )
scene.add( camera )

// adding some lights to the scene
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
directionalLight.position.set(0, 1, 2)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)
scene.add(ambientLight)

const backdrop = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(2, 2),
	new THREE.MeshStandardMaterial({color: new THREE.Color(0x888888)})
)
backdrop.position.z = -0.5
backdrop.receiveShadow = true
scene.add(backdrop)

// adding three cubes to the scene in different locations
for (let i = 0; i < 3; i++) 
{
  const box = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(0.05, 0.05, 0.05),
	  new THREE.MeshLambertMaterial({color: new THREE.Color().setHSL(i / 3, 1, 0.5)}))
  box.position.setScalar(i - 1).multiplyScalar(0.05)
  scene.add(box)
}

// // the update function gets called every frame, thanks to requestAnimationFrame()
// export const updateLoookingGlass = (time) => {
// 	//renderer.webglRenderer.shadowMap.needsUpdate = true;
// 	// render() draws the scene, just like THREE.WebGLRenderer.render()
// 	renderer.render(scene, camera)

// 	requestAnimationFrame(updateLoookingGlass)
// }
// requestAnimationFrame(updateLoookingGlass)
