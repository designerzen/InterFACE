import * as HoloPlayCore from './node_modules/holoplay-core/dist/holoplaycore.module.js'

// the holoplay renderer should act as your THREE.WebGLRenderer
const renderer = new HoloPlayCore.Renderer()
renderer.webglRenderer.shadowMap.enabled = true
renderer.webglRenderer.shadowMap.autoUpdate = false
renderer.webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap

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

// the holoplay camera should be used like a THREE.PerspectiveCamera
const camera = new HoloPlayCore.Camera()
camera.add( new THREE.PointLight( 0xffffff, 0.8 ) )
// camera.lookAt( { x: videoWidth / 2, y: -videoHeight / 2, z: 0, isVector3: true } )

// adding three cubes to the scene in different locations
for (let i = 0; i < 3; i++) 
{
  const box = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(0.05, 0.05, 0.05),
	  new THREE.MeshLambertMaterial({color: new THREE.Color().setHSL(i / 3, 1, 0.5)}))
  box.position.setScalar(i - 1).multiplyScalar(0.05)
  scene.add(box)
}

// add the renderer's canvas to your web page (it will size to fill the page)
document.body.appendChild(renderer.domElement)

// the update function gets called every frame, thanks to requestAnimationFrame()
export const updateLoookingGlass = (time) => {
	//renderer.webglRenderer.shadowMap.needsUpdate = true;
	// render() draws the scene, just like THREE.WebGLRenderer.render()
	renderer.render(scene, camera)

	requestAnimationFrame(updateLoookingGlass)
}
requestAnimationFrame(updateLoookingGlass)

// HoloPlay.Buttons will emit events when the display's buttons are touched
const buttons = new HoloPlay.Buttons()
buttons.addEventListener('buttonPressed', (e) => {
  switch (e.detail.name) 
  {
	case 'left':
	  camera.rotation.y -= 0.002
	  break

	case 'right':
	  camera.rotation.y += 0.002
	  break

	case 'square':
	  if (camera.position.z > 0.2) {
		camera.position.z -= 0.01
	  }
	  break

	case 'circle':
	  if (camera.position.z < 100) {
		camera.position.z += 0.01
	  }
	  break
  }
})