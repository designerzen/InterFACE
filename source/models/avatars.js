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

// ARKit blendshape facial models
// import CYBORG_FACE from "url:/source/assets/actors/FaceCapLiveModeAvatar/FaceCapLiveModeAvatar.fbx"
// import OLIVIER_WILDE from "url:/source/assets/actors/Olivia Wilde - 3D Model.fbx"
import BRUNETTE from "url:/source/assets/actors/brunette.glb"
// import CYBORG_FACE from "url:/source/assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb"
// import CYBORG_FACE from "url:/source/assets/actors/cyborg.glb"

// import SUSHI_FACE_MESH from 'url:/source/assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb'

// https://github.com/hinzka/52blendshapes-for-VRoid-face
// import AL_FACE_MESH from 'url:/source/assets/actors/AL_Standard.fbx'
import ALBERT_FACE_MESH from 'url:/source/assets/actors/albert_e_two_face_with_blendshapes.glb'
// import ALBERT_FACE_MESH from 'url:/source/assets/actors/Albert 2 model.fbx'
// import SIMPLE_MALE_FACE_MESH from 'url:/source/assets/actors/simple-male.glb'
// import SIMPLE_FEMALE_FACE_MESH from 'url:/source/assets/actors/AnimationLibrary_Godot_Standard.glb'
// import NEUTRAL_FACE_MESH from 'url:/source/assets/actors/generic_neutral_mesh.obj'
// import IRIS_FACE_MESH from 'url:/source/assets/actors/face_model_with_iris.obj'
import SAMANTHA_FACE_MESH from 'url:/source/assets/actors/Beautiful 3D Model Head - Samantha.fbx'

// // VRMs
// import ANIME_MALE_FACE_MESH from 'url:/source/assets/actors/VRoid_V110_Male_v1.1.3.vrm'
// import ANIME_FEMALE_FACE_MESH from 'url:/source/assets/actors/VRoid_V110_Female_v1.1.3.vrm'
// import ANIME_SAVI_FACE_MESH from 'url:/source/assets/actors/savi.vrm'

// import CANONICAL_FACE from "url:/source/assets/actors/canonical_face_model.fbx"
// import CANONICAL_FACE from "url:/source/assets/actors/canonical_face_model.obj"
import RACOON_FACE_MESH from 'url:/source/assets/actors/raccoon_head.glb'
// import TWIST_FACE_MESH from 'url:/source/assets/actors/VRM1_Constraint_Twist_Sample.vrm'
// import VRDROID_FACE_MESH from 'url:/source/assets/actors/vrdroid.vrm'
// import ALIEN_FACE_MESH from 'url:/source/assets/actors/Female Blue Alien Face/Female Blue Alien Face model.fbx'


export const AVATAR_DATA = {

	// this does *not* have blendshapes
	brunette:{
		name:"Brunette",
		model:BRUNETTE,
		size:10,
		opacity:1,
		// y is forwards and backwards...
		// z is
		pos:{ x:0, y:0, z: 0.9},
		rot:{ x:-Math.PI / 2, y:0, z:0 }
	},

	/*
	olivier:{
		name:"Olivier",
		model:OLIVIER_WILDE,
		size:10,
		opacity:1,
		// y is forwards and backwards...
		// z is
		pos:{ x:0, y:0, z: 0},
		rot:{ x:0, y:0, z:0 }
	},

	alien:{
		name:"Alien",
		model:ALIEN_FACE_MESH,
		size:10,
		opacity:1,
		// y is forwards and backwards...
		// z is
		pos:{ x:0, y:0, z: 0},
		rot:{ x:0, y:0, z:0 }
	},

	// this does *not* have blendshapes
	cyborg:{
		name:"Cyborg",
		model:CYBORG_FACE,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:0 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	sushi:{
		name:"Sushi",
		model:SUSHI_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	// iris:{
	// 	model:IRIS_FACE_MESH,
	// 	size:3,
	// 	opacity:1,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// },

	// no blendshapes 	
	face:{
		name:"Canonical Face",
		model:CANONICAL_FACE,
		size:3,
		opacity:0.16,
		HSL:[ 0.5, 0.6, 0.6 ],
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:3* Math.PI/2, y:0, z:0 }
	},

	*/

	// All 52!	
	racoon:{
		name:"Racoon",
		model:RACOON_FACE_MESH,
		size:10,
		opacity:1,
		pos:{ x:0, y:0.5, z:-2 },
		// pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},	

	/*
	droid:{
		name:"Droid",
		model:VRDROID_FACE_MESH,
		size:5,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},	

	twist:{
		name:"Twist",
		model:TWIST_FACE_MESH,
		size:70,
		opacity:1,
		pos:{ x:0, y:0, z:0 },
		rot:{ x:0, y:0, z:0 }
	},	
	*/

	// no blendshapes 	
	// al:{
	// 	model:AL_FACE_MESH,
	// 	size:3,
	// 	opacity:0.16,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// },

	// blendshapes 	
	sam:{
		name:"Samantha",
		model:SAMANTHA_FACE_MESH,
		size:8,
		opacity:1,
		pos:{ x:0, y:0, z:0 },
		rot:{ x:3*Math.PI/2, y:0, z:0 }
	},

	// no blendshapes 	
	albert:{
		name:"Albert Einstein",
		model:ALBERT_FACE_MESH,
		size:5,
		opacity:0.16,
		pos:{ x:0, y:0.5, z:-1 },
		rot:{ x:3*Math.PI/2, y:0, z:0 }
	},

	// NO Blendshapes!
	// anime_male:{
	// 	model:ANIME_MALE_FACE_MESH,
	// 	size:11,
	// 	opacity:1,
	// 	pos:{ x:0, y:-8, z:-5 },
	// 	rot:{ x:0, y:Math.PI, z:0 }
	// },

	// anime_female:{
	// 	model:ANIME_FEMALE_FACE_MESH,
	// 	size:3,
	// 	opacity:0.16,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// },

	// no blendshapes 	
	// anime_savi:{
	// 	model:ANIME_SAVI_FACE_MESH,
	// 	size:3,
	// 	opacity:1,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:Math.PI, z:0 }
	// },

	// has SOME
	// simple_male:{
	// 	model:SIMPLE_MALE_FACE_MESH,
	// 	size:3,
	// 	opacity:1,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// },

	// has NONE
	// simple_female:{
	// 	model:SIMPLE_FEMALE_FACE_MESH,
	// 	size:3,
	// 	opacity:1,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// },

	// no blendshapes 	
	// neutral:{
	// 	model:NEUTRAL_FACE_MESH,
	// 	size:3,
	// 	opacity:0.5,
	// 	pos:{ x:0, y:0.015, z:-5 },
	// 	rot:{ x:0, y:0, z:0 }
	// }	
}




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
	const box = new Box3().setFromObject(model)
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