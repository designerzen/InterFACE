import {createHolographicScene} from '../hardware/looking-glass-portrait'

// These methods draw the 3d face in the holographic scene...
const renderer = createHolographicScene()

const updateLoookingGlass = (time) => {
	//renderer.webglRenderer.shadowMap.needsUpdate = true;
	// render() draws the scene, just like THREE.WebGLRenderer.render()
	renderer.render(scene, camera)

	requestAnimationFrame(updateLoookingGlass)
}
requestAnimationFrame(updateLoookingGlass)