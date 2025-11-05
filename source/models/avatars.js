// Test Data available at :
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js'
// import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import { VRMUtils } from '@pixiv/three-vrm'
import { Box3, Vector3 } from 'three'

export const createLoaderForModel = (modelURI) => {
	let extension = modelURI.split('.').pop()//.split("?")[0]
	if (extension.indexOf("?") > -1)
	{
		extension = extension.split("?")[0]
	}
	switch(extension.toLowerCase())
	{
		case "dae":
			return new ColladaLoader()
		// case "vrml":
		// 	return new VRMLLoader()
		case "bvh":
			return new BVHLoader()
		case "glb":
		case "gltf":
			return new GLTFLoader()
		case "vrm":
			const loader = new GLTFLoader()
			loader.crossOrigin = "anonymous"
			loader.register(parser => new VRMLoaderPlugin(parser)) 
			
			return loader
		case "fbx":
			return new FBXLoader()
		case "obj":
			return new OBJLoader()
	}
}

export const improveVRMPerformance = ((gltf, vrm) => {
	// calling these functions greatly improves the performance
	VRMUtils.removeUnnecessaryVertices( gltf.scene )
	VRMUtils.combineSkeletons( gltf.scene )
	VRMUtils.combineMorphs( vrm )

	//  THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene)

	// Disable frustum culling
	vrm.scene.traverse( ( obj ) => {
		obj.frustumCulled = false
	} )	
})


export const unloadModel = (target) => { 
	target.removeFromParent()
	target.traverse((child) => {
		// disposing materials
		if (child.material && !child.material._isDisposed){
			// disposing textures
			for (const [key, value] of Object.entries(child.material) ){
				if (!value) continue;
				if (typeof value.dispose === "function" && !value._isDisposed){
					value.dispose()
					value._isDisposed = true
					child[key] = null
				}
			}
			child.material.dispose()
			child.material._isDisposed = true
			child.material = null
		}

		// disposing geometries
		if (child.geometry?.dispose && !child.geometry._isDisposed){
			child.geometry.dispose()
			child.geometry._isDisposed = true
			child.geometry = null
		}

		// disposing skinned mesh
		if (child.skeleton?.boneTexture && !child.skeleton?.boneTexture._isDisposed){
			child.skeleton.boneTexture.dispose()
			child.skeleton.boneTexture._isDisposed = true
			child.skeleton.boneTexture = null
		}

		requestAnimationFrame(() => child.children = null)
	})
}


// Add a method to calculate appropriate scale for any model
export const calculateModelScale = (model, targetSize=1)=> { 
	// Create a bounding box for the model
	const box = (new Box3()).setFromObject(model)
	const size = box.getSize(new Vector3())
	
	// Calculate the largest dimension
	const maxDimension = Math.max(size.x, size.y, size.z)
	
	// We want models to be roughly 0.6 units in their largest dimension
	// This matches the previous avatar.size constant's effect
	return targetSize / maxDimension
}

export const rescaleAndCenter = (object3d) => {
	
	// firstly try and find any geometries and center them...
	if (object3d.geometry)
	{
		console.info("Centering geometry for", object3d)
		object3d.geometry.center()
	}
	
	const box = new Box3().setFromObject(object3d)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())

    //Rescale the object to normalized space
    const maxAxis = Math.max(size.x, size.y, size.z)
    object3d.scale.multiplyScalar(1.0 / maxAxis)
    
	// get bounding box
	box.setFromObject(object3d)
    box.getCenter(center)
    box.getSize(size)

    // Reposition to 0, halfY, 0
    object3d.position.copy(center).multiplyScalar(-1)
    object3d.position.y-= (size.y * 0.5)
}