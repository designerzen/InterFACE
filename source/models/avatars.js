import { Box3, Vector3 } from 'three'

// Test Data available at :
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
// import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js'

// import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js'
// import { VRMLoaderPlugin } from '@pixiv/three-vrm'
// import { VRMUtils } from '@pixiv/three-vrm'

const loaders = new Map()

export const createLoaderForModel = async (modelURI) => {
	let extension = modelURI.split('.').pop()//.split("?")[0]
	if (extension.indexOf("?") > -1)
	{
		extension = extension.split("?")[0]
	}
	const type = extension.toLowerCase()
	switch(type)
	{
		case "dae":
			if (!loaders.has(type))
			{
				loaders.set( type, (await import('three/examples/jsm/loaders/ColladaLoader.js')).ColladaLoader )
			}
			return ( new loaders.get(type) )()
		// case "vrml":
		// 	return new VRMLLoader()
		case "bvh":
			if (!loaders.has(type))
			{
				loaders.set( type, (await import('three/examples/jsm/loaders/BVHLoader.js')).BVHLoader )
			}
			return ( new loaders.get(type) )()

		case "glb":
		case "gltf":
			if (!loaders.has(type))
			{
				loaders.set( type, (await import('three/examples/jsm/loaders/GLTFLoader.js')).GLTFLoader )
			}
			return ( new loaders.get(type) )()

		case "vrm":
			if (!loaders.has(type))
			{
				const plugin = ( await import('@pixiv/three-vrm') ).VRMLoaderPlugin
				loaders.set( type, plugin )
			}

			const loader = ( new loaders.get(type) )()
			loader.crossOrigin = "anonymous"
			loader.register(parser => new VRMLoaderPlugin(parser)) 
			
			return loader

		case "fbx":
			if (!loaders.has(type))
			{
				loaders.set( type, (await import('three/examples/jsm/loaders/FBXLoader.js')).FBXLoader )
			}
			return ( new loaders.get(type) )()

		case "obj":
			if (!loaders.has(type))
			{
				loaders.set( type, (await import('three/examples/jsm/loaders/OBJLoader.js')).OBJLoader )
			}
			return ( new loaders.get(type) )()
	}
}

export const improveVRMPerformance = async(gltf, vrm) => {

	const VRMUtils = ( await import('@pixiv/three-vrm') ).VRMUtils
				
	// calling these functions greatly improves the performance
	VRMUtils.removeUnnecessaryVertices( gltf.scene )
	VRMUtils.combineSkeletons( gltf.scene )
	VRMUtils.combineMorphs( vrm )

	//  THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene)

	// Disable frustum culling
	vrm.scene.traverse( ( obj ) => {
		obj.frustumCulled = false
	} )	
}


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