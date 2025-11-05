
// ARKit blendshape facial models
// import CYBORG_FACE from "url:../assets/actors/FaceCapLiveModeAvatar/FaceCapLiveModeAvatar.fbx"
// import OLIVIER_WILDE from "url:../assets/actors/Olivia Wilde - 3D Model.fbx"
import BRUNETTE from "url:../assets/actors/brunette.glb"
// import CYBORG_FACE from "url:../assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb"
// import CYBORG_FACE from "url:../assets/actors/cyborg.glb"

// import SUSHI_FACE_MESH from 'url:../assets/actors/blender_sushi_virtual_journal_16th_april_2020.glb'

// https://github.com/hinzka/52blendshapes-for-VRoid-face
// import AL_FACE_MESH from 'url:../assets/actors/AL_Standard.fbx'
import ALBERT_FACE_MESH from 'url:../assets/actors/albert_e_two_face_with_blendshapes.glb'
// import ALBERT_FACE_MESH from 'url:../assets/actors/Albert 2 model.fbx'
// import SIMPLE_MALE_FACE_MESH from 'url:../assets/actors/simple-male.glb'
// import SIMPLE_FEMALE_FACE_MESH from 'url:../assets/actors/AnimationLibrary_Godot_Standard.glb'
// import NEUTRAL_FACE_MESH from 'url:../assets/actors/generic_neutral_mesh.obj'
// import IRIS_FACE_MESH from 'url:../assets/actors/face_model_with_iris.obj'
import SAMANTHA_FACE_MESH from 'url:../assets/actors/Beautiful 3D Model Head - Samantha.fbx'

// VRMs
// import ANIME_MALE_FACE_MESH from 'url:../assets/actors/VRoid_V110_Male_v1.1.3.vrm'
// import ANIME_FEMALE_FACE_MESH from 'url:../assets/actors/VRoid_V110_Female_v1.1.3.vrm'
// import ANIME_SAVI_FACE_MESH from 'url:../assets/actors/savi.vrm'

// import CANONICAL_FACE from "url:../assets/actors/canonical_face_model.fbx"
// import CANONICAL_FACE from "url:../assets/actors/canonical_face_model.obj"
import RACOON_FACE_MESH from 'url:../assets/actors/raccoon_head.glb'
// import TWIST_FACE_MESH from 'url:../assets/actors/VRM1_Constraint_Twist_Sample.vrm'
// import VRDROID_FACE_MESH from 'url:../assets/actors/vrdroid.vrm'
// import ALIEN_FACE_MESH from 'url:../assets/actors/Female Blue Alien Face/Female Blue Alien Face model.fbx'


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