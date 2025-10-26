export const BLENDSHAPE_IDS = [
	"browDownLeft",
	"browDownRight",
	"browInnerUp",
	"browOuterUpLeft",
	"browOuterUpRight",
	"cheekPuff",
	"cheekSquintLeft",
	"cheekSquintRight",
	"eyeBlinkLeft",
	"eyeBlinkRight",
	"eyeLookDownLeft",
	"eyeLookDownRight",
	"eyeLookInLeft",
	"eyeLookInRight",
	"eyeLookOutLeft",
	"eyeLookOutRight",
	"eyeLookUpLeft",
	"eyeLookUpRight",
	"eyeSquintLeft",
	"eyeSquintRight",
	"eyeWideLeft",
	"eyeWideRight",
	"jawForward",
	"jawLeft",
	"jawOpen",
	"jawRight",
	"mouthClose",
	"mouthDimpleLeft",
	"mouthDimpleRight",
	"mouthFrownLeft",
	"mouthFrownRight",
	"mouthFunnel",
	"mouthLeft",
	"mouthLowerDownLeft",
	"mouthLowerDownRight",
	"mouthPressLeft",
	"mouthPressRight",
	"mouthPucker",
	"mouthRight",
	"mouthRollLower",
	"mouthRollUpper",
	"mouthShrugLower",
	"mouthShrugUpper",
	"mouthSmileLeft",
	"mouthSmileRight",
	"mouthStretchLeft",
	"mouthStretchRight",
	"mouthUpperUpLeft",
	"mouthUpperUpRight",
	"noseSneerLeft",
	"noseSneerRight",
	"tongueOut"
]

/**
 * Take in a BlendShape ID and get it's mirror
 * tihs is useful when trying to "mirror" the user
 */
export const swapEyeSide = (feature) =>{

	switch(feature)
	{
		case "eyeBlinkLeft": return "eyeBlinkRight"
		case "eyeLookDownLeft": return "eyeLookDownRight"
		case "eyeLookInLeft": return "eyeLookInRight"
		case "eyeLookOutLeft": return "eyeLookOutRight"
		case "eyeLookUpLeft": return "eyeLookUpRight"
		case "eyeSquintLeft": return "eyeSquintRight"
		case "eyeWideLeft": return "eyeWideRight"
		
		case "eyeLookInRight": return "eyeLookInLeft"
		case "eyeLookDownRight": return "eyeLookDownLeft"
		case "eyeBlinkRight": return "eyeBlinkLeft"
		case "eyeLookOutRight": return "eyeLookOutLeft"
		case "eyeLookUpRight": return "eyeLookUpLeft"
		case "eyeSquintRight": return "eyeSquintLeft"
		case "eyeWideRight": return "eyeWideLeft"
	}
}