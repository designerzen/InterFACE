import { AVATAR_DATA } from "../models/avatar-data.js"
import { AmbientLight, AxesHelper, Clock, Color, DirectionalLight, PerspectiveCamera, ReinhardToneMapping, Scene, WebGLRenderer } from "three"
import Avatar from "../models/avatar.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { BLENDSHAPE_IDS } from "../models/blendshapes.js"
// import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

let camera
let clock
let renderer
let scene
let orbit
let avatarModels
let counter = 0

const createScene = () => {
		
	const rendererOptions = {
		antialias: true,
		canvas: document.querySelector("canvas")
	}

	clock = new Clock()

	scene = new Scene()
	scene.background = new Color( 0xdddddd )
	
	const ambientLight = new AmbientLight( 0xFFFFFF, 0.8 )
	scene.add(ambientLight)

	const directionalLight = new DirectionalLight(0xFFFFFF, 1)
	directionalLight.position.set(0, 1, 2)
	scene.add(directionalLight)

	scene.add(new AxesHelper(.5))

	renderer = new WebGLRenderer(rendererOptions)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.toneMapping = ReinhardToneMapping
	renderer.setClearColor(0xa3a3a3)
	// renderer.physicallyCorrectLights = true
	// renderer.toneMapping = THREE.ACESFilmicToneMapping
	// renderer.toneMappingExposure = 1
	// renderer.shadowMap.enabled = true
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap

	// we can swap this for the orthogonal camera
	// for extra style points
	camera = new PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)

	// camera.position.z = 3.5
	camera.lookAt( scene.position )
	
	orbit = new OrbitControls(camera, renderer.domElement)
	orbit.enableZoom = true
	orbit.enableRotate = true
	orbit.enablePan = true
	orbit.minDistance = 2
	orbit.maxDistance = 2000
	orbit.autoRotateSpeed = 0
	orbit.autoRotate = true

	return scene
}

const addAvatarToScene = (avatar) => {
	console.log("\nAvatar added to scene", avatar.scene, avatar, scene )
	scene.add( avatar.scene )
	camera.lookAt( avatar.scene.position )
}

const loadAvatar = async ( avatarModel, avatarName="Avatar" ) => {
	const avatar = new Avatar(avatarName)
	const faceModel = await avatar.loadModel( avatarModel )
	console.log("Avatar created", avatar, "with face", faceModel, "with", avatarModel  )
	return avatar
}


// test the Avatar loader
const loadAvatars = async() => {

	const avatars = []

	// console.log("\nBody alien loading", AVATAR_DATA.alien, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.alien, "alien" ) )
		
	// console.log("\nAvatar Olivier loading", AVATAR_DATA.olivier, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.olivier, "Olivier" ) )
	
	// console.log("\nBody Brunette loading", AVATAR_DATA.brunette, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.brunette, "Brunette" ) )
	

	// NOOOOO
	// console.log("\nAvatar Cyborg loading", AVATAR_DATA.cyborg, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.cyborg, "Cyborg" ) )

	// console.log("\nAvatar Racoon loading", AVATAR_DATA.racoon, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.racoon, "Racoon" ) )

	// console.log("\nAvatar Face loading", AVATAR_DATA.face, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.face, "face" ) )

	// console.log("\nAvatar Albert loading", AVATAR_DATA.albert, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.albert, "Einstein" ) )

	// console.log("\nAvatar Sam loading", AVATAR_DATA.sam, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.sam, "Sam" ) )

	console.log("\nAvatar Sushi loading", AVATAR_DATA.sushi, "----------------------" )
	avatars.push( await loadAvatar( AVATAR_DATA.sushi, "Sushi" ) )

	// No animations only VRM Expressions for sad and things
	// console.log("\nAvatar Droid loading", AVATAR_DATA.droid, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.droid, "Droid" ) )

	// No aminations :(
	// console.log("\nAvatar Twist loading", AVATAR_DATA.twist, "----------------------" )
	// avatars.push( await loadAvatar( AVATAR_DATA.twist, "Twist" ) )

	return avatars
}

const renderLoop = () => {

	// randmly set avatar blendshapes
	avatarModels.forEach((avatar, index) => {
		avatar.setFeature( BLENDSHAPE_IDS[(index+counter)%BLENDSHAPE_IDS.length], Math.random())
	})	
	
	orbit.update()
	counter++

	renderer.render(scene, camera)
}

const start = async () => {
	createScene()
	avatarModels = await loadAvatars()
	avatarModels.forEach((avatar, index) => {
		addAvatarToScene( avatar)
	})	
	renderer.setAnimationLoop(renderLoop)
	console.log("All avatars loaded", avatarModels)
}

start()