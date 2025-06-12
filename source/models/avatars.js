import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js'
// import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'

// ARKit blendshape facial models
// import CYBORG_FACE from "url:/source/assets/actors/FaceCapLiveModeAvatar/FaceCapLiveModeAvatar.fbx"
// import CYBORG_FACE from "url:/source/assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb"
import CYBORG_FACE from "url:/source/assets/actors/cyborg.glb"
import SUSHI_FACE_MESH from 'url:/source/assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb'
// import CANONICAL_FACE from "url:/source/assets/actors/canonical_face_model.fbx"
import CANONICAL_FACE from "url:/source/assets/actors/canonical_face_model.obj"
import RACOON_FACE_MESH from 'url:/source/assets/actors/raccoon_head.glb'
// https://github.com/hinzka/52blendshapes-for-VRoid-face
import AL_FACE_MESH from 'url:/source/assets/actors/AL_Standard.fbx'
import ALBERT_FACE_MESH from 'url:/source/assets/actors/albert_e_two_face_with_blendshapes.glb'
// import ALBERT_FACE_MESH from 'url:/source/assets/actors/Albert 2 model.fbx'
import SIMPLE_MALE_FACE_MESH from 'url:/source/assets/actors/simple-male.glb'
import SIMPLE_FEMALE_FACE_MESH from 'url:/source/assets/actors/AnimationLibrary_Godot_Standard.glb'
import NEUTRAL_FACE_MESH from 'url:/source/assets/actors/generic_neutral_mesh.obj'
import IRIS_FACE_MESH from 'url:/source/assets/actors/face_model_with_iris.obj'
import SAMANTHA_FACE_MESH from 'url:/source/assets/actors/Beautiful 3D Model Head - Samantha.fbx'

// VRMs
import ANIME_MALE_FACE_MESH from 'url:/source/assets/actors/VRoid_V110_Male_v1.1.3.vrm'
import ANIME_FEMALE_FACE_MESH from 'url:/source/assets/actors/VRoid_V110_Female_v1.1.3.vrm'
import ANIME_SAVI_FACE_MESH from 'url:/source/assets/actors/savi.vrm'


export const AVATAR_DATA = {

	// this does *not* have blendshapes
	cyborg:{
		model:CYBORG_FACE,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	sushi:{
		model:SUSHI_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	iris:{
		model:IRIS_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	face:{
		model:CANONICAL_FACE,
		size:3,
		opacity:0.16,
		HSL:[ 0.5, 0.6, 0.6 ],
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// All 52!	
	racoon:{
		model:RACOON_FACE_MESH,
		size:5,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},	

	// no blendshapes 	
	al:{
		model:AL_FACE_MESH,
		size:3,
		opacity:0.16,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// blendshapes 	
	sam:{
		model:SAMANTHA_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-3 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	albert:{
		model:ALBERT_FACE_MESH,
		size:3,
		opacity:0.16,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:3*Math.PI/2, y:0, z:0 }
	},

	// NO Blendshapes!
	anime_male:{
		model:ANIME_MALE_FACE_MESH,
		size:11,
		opacity:1,
		pos:{ x:0, y:-8, z:-5 },
		rot:{ x:0, y:Math.PI, z:0 }
	},

	anime_female:{
		model:ANIME_FEMALE_FACE_MESH,
		size:3,
		opacity:0.16,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	anime_savi:{
		model:ANIME_SAVI_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:Math.PI, z:0 }
	},

	// has SOME
	simple_male:{
		model:SIMPLE_MALE_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// has NONE
	simple_female:{
		model:SIMPLE_FEMALE_FACE_MESH,
		size:3,
		opacity:1,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	},

	// no blendshapes 	
	neutral:{
		model:NEUTRAL_FACE_MESH,
		size:3,
		opacity:0.5,
		pos:{ x:0, y:0.015, z:-5 },
		rot:{ x:0, y:0, z:0 }
	}	
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
			loader.register(parser => new VRMLoaderPlugin(parser)) 
			return loader
		case "fbx":
			return new FBXLoader()
		case "obj":
			return new OBJLoader()
	}
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
	const box = new THREE.Box3().setFromObject(model)
	const size = box.getSize(new THREE.Vector3())
	
	// Calculate the largest dimension
	const maxDimension = Math.max(size.x, size.y, size.z)
	
	// We want models to be roughly 0.6 units in their largest dimension
	// This matches the previous avatar.size constant's effect
	return targetSize / maxDimension
}