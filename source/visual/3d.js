import { BufferGeometry } from "three"
import { TRIANGULATION } from "../models/face-mesh-constants"
import { preloadFont } from "troika-three-text"

// Try `npm i --save-dev @types/troika-three-text` if it exists or add a new declaration (.d.ts) file containing `declare module 'troika-three-text';`ts(7016)
export const preload3dFont = async (font, characters='abcdefghijklmnopqrstuvwxyz1234567890-') => new Promise((resolve,reject) => {
	preloadFont(
		{
			font, 
			characters
		},
		(result) => {
			console.info("3d Font loaded", result, {font} )
			resolve()
		}
	)
})


/**
 * To take the keypointsw out from another geometry
 * @param {Geometry} geometry 
 * @param {Number} quantity 
 * @param {Number} scaleFactor 
 * @returns 
 */
export const convertMeshToSimplifiedGeometry = (particleGeometry, quantity, scaleFactor = 1/20) => {
	const geometry = new BufferGeometry()
	const positions = new Float32Array( quantity * 3 )
	const scales = new Float32Array( quantity )
			
	// here we choose the base for copying the positions from
	const particlePositions = particleGeometry.attributes.position.array

	const length = Math.min( quantity, particlePositions.length ) 

	for (let i=0; i < length; i+=3)
	{
		const p = i % (particlePositions.length - 1)
		
		const x = particlePositions[ particlePositions.length - 1 - p ] * scaleFactor 
		const y = particlePositions[ particlePositions.length - 2 - p ] * scaleFactor  
		const z = particlePositions[ particlePositions.length - 3 - p ] * scaleFactor  
						
		positions[i] = x
		positions[i+1] = y
		positions[i+2] = z

		scales[i] =  1
		// console.info(i, "Position",{x,y,z})
	}
	
	// Add layers for holding scale and position data (optional)		
	geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'scale', new Float32BufferAttribute( scales, 1 ) )
	return geometry
}





















const VOXEL_QUANTITY = TRIANGULATION.length / 3
let camera
let scene
let voxels
let lineMaterial
let renderer

/**
 * Create the 3D WebGL scene
 * @returns Render Function
 */
export const createScene = (video) => {

	scene = new THREE.Scene()

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)

	scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) )
	
	// adding some lights to the scene
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
	directionalLight.position.set(0, 1, 2)
	scene.add(directionalLight)

	const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)
	scene.add(ambientLight)

	camera = new THREE.PerspectiveCamera(50, video.videoWidth / video.videoHeight, 1, 5000)
	camera.position.z = video.videoHeight
    camera.position.x = -video.videoWidth / 2
    camera.position.y = -video.videoHeight / 2
	scene.add( camera )

	// create a background video image so we can accurately
	// synch the video to the overlays
    const bg = new THREE.Texture(video)
    bg.minFilter = THREE.LinearFilter

	const videoSprite = new THREE.Sprite(new THREE.MeshBasicMaterial({
        map: bg,
        depthWrite: false,
        side: THREE.DoubleSide
    }))
	videoSprite.center.set(0.5, 0.5)
    videoSprite.scale.set(-video.videoWidth, video.videoHeight, 1)
    videoSprite.position.copy(camera.position)
    videoSprite.position.z = 0
	scene.add(videoSprite)
    
	// const backdrop = new THREE.Mesh(
	// 	new THREE.PlaneBufferGeometry(2, 2),
	// 	new THREE.MeshStandardMaterial({color: new THREE.Color(0x888888)})
	// )
	// backdrop.position.z = -0.5
	// backdrop.receiveShadow = true
	// scene.add(backdrop)

	lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );


	const render = () => requestAnimationFrame( ()=>{
		
		bg.needsUpdate = true
		renderer.render(scene, camera)
		// the update function gets called every frame, thanks to requestAnimationFrame()
		// export const updateLoookingGlass = (time) => {
		// 	renderer.webglRenderer.shadowMap.needsUpdate = true;
		// 	render() draws the scene, just like THREE.WebGLRenderer.render()
		// 	renderer.render(scene, camera)
	})

	return render
}

const drawLine = (points) => {
		
	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	// Note that lines are drawn between each consecutive pair of vertices, but not between the first and last (the line is not closed.)

	// Now that we have points for two lines and a material, we can put them together to form a line.
	const line = new THREE.Line( geometry, material );

	// All that's left is to add it to the scene and call render.
	scene.add( line )
}
 
// THREE.js face mesh - draw lines in THREE?
export const draw3dFaceMesh = (prediction, palette={h:0,s:100,l:100}, strokeWidth=0.5, colourCycle=false, alpha=0.2) => {
	const scaledMesh = prediction.keypoints
	const hue = palette.h
	for( let i = 0, q=TRIANGLE_MATRIX.length - 2; i < q; ++i ) 
	{
		const pointA = scaledMesh[ TRIANGLE_MATRIX[ i ] ]
		const pointB = scaledMesh[ TRIANGLE_MATRIX[ i + 1 ] ]
		const pointC = scaledMesh[ TRIANGLE_MATRIX[ i + 2 ] ]
		const alpha = palette.a || 1
		
		const phase = colourCycle ? (hue + ( 360 * i/q )) % 360 : hue
		const colour = `hsla(${phase},${palette.s}%,${palette.l}%,${alpha})`

		// drawTriangle( pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y, colour, strokeWidth )
		voxels[ Math.round(i/3) ]

		const points = [];
		points.push( new THREE.Vector3( - 10, 0, 0 ) );
		points.push( new THREE.Vector3( 0, 10, 0 ) );
		points.push( new THREE.Vector3( 10, 0, 0 ) );
	}
}



/**
 * Draws a specific part by looping through the part array and 
 * connecting the nodes together with paths
 * @param {Array} keypoints 
 * @param {Boolean} lines 
 * @param {Boolean} fill 
 * @param {Color} color 
 */
export const draw3dPart = (keypoints, lines=true, fill=true, color="rgba(255,0,0,0.5)" ) => {
	
	// console.error("Keypoints", keypoints)
	const length = keypoints.length

	for (let i = 0; i < length; ++i) 
	{
		const position3d = keypoints[i]
		const voxel = voxels[ i ]
		voxel.setPosition( position3d )
	}	

	// if we want a filled shape
	if (fill)
	{
		
	}
	
	if (lines)
	{
		
	}
	
}
