export const DEFAULT_WALL_OPTIONS = {
	showWalls: true,
	wallHeight: 5.5,
	wallAspectRatio: 16 / 9,
	wallDepthMultiplier: 5.2,
	wallFrontZ: 0.5,
	wallAttachToCamera: true,
	wallCameraFrontDistance: 1.2,
	wallCameraDepthMultiplier: 6.5,
	wallBackScale: 0.62,
	wallBackPlane: false,
	wallCenterX: 0,
	wallCenterY: 0,
	wallPlaneColour: 0x59616b,
	wallPlaneEmissive: 0x202833,
	wallPlaneEmissiveIntensity: 0.28,
	wallEdgeColour: 0x7f8896,
	wallGuideColour: 0x414b58,
	wallPlaneOpacity: 0.52,
	wallEdgeOpacity: 0.32,
	wallGuideOpacity: 0.26,
	wallGuideLineCount: 8,
	wallSideLightColour: 0xc7ddff,
	wallSideLightIntensity: 2.8,
	wallSideLightDistance: 18,
	wallLightColour: 0xdde8ff,
	wallLightIntensity: 6.5,
	wallLightDistance: 24,
	wallLightDecay: 1.12,
	wallLightOffsetZ: 1.2,
	wallOpeningGlowOpacity: 0
}

const makeWall = (THREE, geometry, material, position, rotation = {}) => {
	const wall = new THREE.Mesh(geometry, material)
	wall.position.set(position.x, position.y, position.z)
	wall.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0)
	return wall
}

const makeQuadGeometry = (THREE, points) => {
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(points.flatMap(point => [point.x, point.y, point.z]), 3))
	geometry.setIndex([0, 1, 2, 0, 2, 3])
	geometry.computeVertexNormals?.()
	return geometry
}

const addLine = (points, from, to) => {
	points.push(from.x, from.y, from.z, to.x, to.y, to.z)
}

export const createWallDisplayOptions = (width, height, {
	wallHeight = DEFAULT_WALL_OPTIONS.wallHeight,
	wallDepthMultiplier = DEFAULT_WALL_OPTIONS.wallDepthMultiplier,
	wallFrontZ = DEFAULT_WALL_OPTIONS.wallFrontZ,
	...options
} = {}) => {
	const aspectRatio = height > 0 ? width / height : DEFAULT_WALL_OPTIONS.wallAspectRatio
	const wallWidth = wallHeight * aspectRatio
	const wallDepth = Math.max(wallHeight, wallWidth) * wallDepthMultiplier
	return {
		...options,
		wallAspectRatio: aspectRatio,
		wallWidth,
		wallHeight,
		wallDepth,
		wallFrontZ,
		wallCenterZ: wallFrontZ - (wallDepth * 0.5)
	}
}

const getWallDimensions = (camera, wallOptions) => {
	if (wallOptions.wallAttachToCamera && camera?.isPerspectiveCamera)
	{
		const frontDistance = wallOptions.wallCameraFrontDistance
		const aspect = camera.aspect || wallOptions.wallAspectRatio
		const frontHeight = 2 * Math.tan((camera.fov * Math.PI / 180) * 0.5) * frontDistance
		const frontWidth = frontHeight * aspect
		const depth = wallOptions.wallDepth ?? Math.max(frontWidth, frontHeight) * wallOptions.wallCameraDepthMultiplier
		return {
			width: frontWidth,
			height: frontHeight,
			depth,
			centerX: 0,
			centerY: 0,
			frontZ: -frontDistance,
			backZ: -frontDistance - depth
		}
	}

	const height = wallOptions.wallHeight
	const width = wallOptions.wallWidth ?? height * wallOptions.wallAspectRatio
	const depth = wallOptions.wallDepth ?? Math.max(width, height) * wallOptions.wallDepthMultiplier
	const centerX = wallOptions.wallCenterX
	const centerY = wallOptions.wallCenterY
	const centerZ = wallOptions.wallCenterZ ?? (wallOptions.wallFrontZ - (depth * 0.5))
	const halfDepth = depth * 0.5
	return {
		width,
		height,
		depth,
		centerX,
		centerY,
		frontZ: centerZ + halfDepth,
		backZ: centerZ - halfDepth
	}
}

export const createWalls = (THREE, options = {}, camera = null) => {
	const wallOptions = { ...DEFAULT_WALL_OPTIONS, ...options }
	if (wallOptions.showWalls === false)
	{
		return null
	}

	const {
		width,
		height,
		depth,
		centerX,
		centerY,
		frontZ,
		backZ
	} = getWallDimensions(camera, wallOptions)
	const backScale = wallOptions.wallBackScale

	const group = new THREE.Group()
	group.name = "walls"

	const WallMaterial = THREE.MeshLambertMaterial ?? THREE.MeshStandardMaterial ?? THREE.MeshBasicMaterial
	const planeMaterial = new WallMaterial({
		color: wallOptions.wallPlaneColour,
		transparent: true,
		opacity: wallOptions.wallPlaneOpacity,
		side: THREE.DoubleSide,
		depthWrite: false
	})
	if (planeMaterial.emissive)
	{
		planeMaterial.emissive.setHex?.(wallOptions.wallPlaneEmissive)
		planeMaterial.emissiveIntensity = wallOptions.wallPlaneEmissiveIntensity
	}
	const edgeMaterial = new THREE.LineBasicMaterial({
		color: wallOptions.wallEdgeColour,
		transparent: true,
		opacity: wallOptions.wallEdgeOpacity,
		depthWrite: false
	})
	const guideMaterial = new THREE.LineBasicMaterial({
		color: wallOptions.wallGuideColour,
		transparent: true,
		opacity: wallOptions.wallGuideOpacity,
		depthWrite: false
	})

	const halfWidth = width * 0.5
	const halfHeight = height * 0.5
	const backHalfWidth = halfWidth * backScale
	const backHalfHeight = halfHeight * backScale

	const front = {
		topLeft: { x: centerX - halfWidth, y: centerY - halfHeight, z: frontZ },
		topRight: { x: centerX + halfWidth, y: centerY - halfHeight, z: frontZ },
		bottomRight: { x: centerX + halfWidth, y: centerY + halfHeight, z: frontZ },
		bottomLeft: { x: centerX - halfWidth, y: centerY + halfHeight, z: frontZ }
	}
	const back = {
		topLeft: { x: centerX - backHalfWidth, y: centerY - backHalfHeight, z: backZ },
		topRight: { x: centerX + backHalfWidth, y: centerY - backHalfHeight, z: backZ },
		bottomRight: { x: centerX + backHalfWidth, y: centerY + backHalfHeight, z: backZ },
		bottomLeft: { x: centerX - backHalfWidth, y: centerY + backHalfHeight, z: backZ }
	}

	const wallGeometries = [
		makeQuadGeometry(THREE, [front.topLeft, back.topLeft, back.bottomLeft, front.bottomLeft]),
		makeQuadGeometry(THREE, [front.topRight, front.bottomRight, back.bottomRight, back.topRight]),
		makeQuadGeometry(THREE, [front.topLeft, front.topRight, back.topRight, back.topLeft]),
		makeQuadGeometry(THREE, [front.bottomLeft, back.bottomLeft, back.bottomRight, front.bottomRight])
	]

	wallGeometries.forEach(geometry => {
		group.add(new THREE.Mesh(geometry, planeMaterial))
	})

	let backGeometry = null
	if (wallOptions.wallBackPlane)
	{
		backGeometry = new THREE.PlaneGeometry(backHalfWidth * 2, backHalfHeight * 2)
		group.add(makeWall(THREE, backGeometry, planeMaterial, { x: centerX, y: centerY, z: backZ }))
	}

	let openingGlowMaterial = null
	let openingGlow = null
	if (wallOptions.wallOpeningGlowOpacity > 0)
	{
		openingGlowMaterial = new THREE.MeshBasicMaterial({
			color: wallOptions.wallLightColour,
			transparent: true,
			opacity: wallOptions.wallOpeningGlowOpacity,
			side: THREE.DoubleSide,
			depthWrite: false
		})
		const openingGlowGeometry = new THREE.PlaneGeometry(width, height)
		openingGlow = makeWall(
			THREE,
			openingGlowGeometry,
			openingGlowMaterial,
			{ x: centerX, y: centerY, z: frontZ + 0.01 }
		)
		openingGlow.userData.geometry = openingGlowGeometry
		group.add(openingGlow)
	}

	if (THREE.PointLight && wallOptions.wallLightIntensity > 0)
	{
		const openingLight = new THREE.PointLight(
			wallOptions.wallLightColour,
			wallOptions.wallLightIntensity,
			wallOptions.wallLightDistance,
			wallOptions.wallLightDecay
		)
		openingLight.position.set(centerX, centerY, frontZ + wallOptions.wallLightOffsetZ)
		group.add(openingLight)
	}
	if (THREE.PointLight && wallOptions.wallSideLightIntensity > 0)
	{
		const sideLight = new THREE.PointLight(
			wallOptions.wallSideLightColour,
			wallOptions.wallSideLightIntensity,
			wallOptions.wallSideLightDistance,
			1.35
		)
		sideLight.position.set(centerX - halfWidth * 0.82, centerY - halfHeight * 0.18, frontZ - depth * 0.18)
		group.add(sideLight)
	}

	const points = [
		centerX - halfWidth, centerY - halfHeight, frontZ,
		centerX + halfWidth, centerY - halfHeight, frontZ,
		centerX + halfWidth, centerY - halfHeight, frontZ,
		centerX + halfWidth, centerY + halfHeight, frontZ,
		centerX + halfWidth, centerY + halfHeight, frontZ,
		centerX - halfWidth, centerY + halfHeight, frontZ,
		centerX - halfWidth, centerY + halfHeight, frontZ,
		centerX - halfWidth, centerY - halfHeight, frontZ,

		centerX - backHalfWidth, centerY - backHalfHeight, backZ,
		centerX + backHalfWidth, centerY - backHalfHeight, backZ,
		centerX + backHalfWidth, centerY - backHalfHeight, backZ,
		centerX + backHalfWidth, centerY + backHalfHeight, backZ,
		centerX + backHalfWidth, centerY + backHalfHeight, backZ,
		centerX - backHalfWidth, centerY + backHalfHeight, backZ,
		centerX - backHalfWidth, centerY + backHalfHeight, backZ,
		centerX - backHalfWidth, centerY - backHalfHeight, backZ,

		centerX - halfWidth, centerY - halfHeight, frontZ,
		centerX - backHalfWidth, centerY - backHalfHeight, backZ,
		centerX + halfWidth, centerY - halfHeight, frontZ,
		centerX + backHalfWidth, centerY - backHalfHeight, backZ,
		centerX + halfWidth, centerY + halfHeight, frontZ,
		centerX + backHalfWidth, centerY + backHalfHeight, backZ,
		centerX - halfWidth, centerY + halfHeight, frontZ,
		centerX - backHalfWidth, centerY + backHalfHeight, backZ
	]

	const edgeGeometry = new THREE.BufferGeometry()
	edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3))
	group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial))

	const guidePoints = []
	const guideLineCount = Math.max(0, wallOptions.wallGuideLineCount ?? 0)
	for (let i = 1; i <= guideLineCount; i++)
	{
		const progress = i / (guideLineCount + 1)
		const z = frontZ + (backZ - frontZ) * progress
		const insetHalfWidth = halfWidth + (backHalfWidth - halfWidth) * progress
		const insetHalfHeight = halfHeight + (backHalfHeight - halfHeight) * progress
		const left = centerX - insetHalfWidth
		const right = centerX + insetHalfWidth
		const top = centerY - insetHalfHeight
		const bottom = centerY + insetHalfHeight

		addLine(guidePoints, { x: left, y: top, z }, { x: right, y: top, z })
		addLine(guidePoints, { x: right, y: top, z }, { x: right, y: bottom, z })
		addLine(guidePoints, { x: right, y: bottom, z }, { x: left, y: bottom, z })
		addLine(guidePoints, { x: left, y: bottom, z }, { x: left, y: top, z })
	}

	const guideGeometry = new THREE.BufferGeometry()
	guideGeometry.setAttribute("position", new THREE.Float32BufferAttribute(guidePoints, 3))
	group.add(new THREE.LineSegments(guideGeometry, guideMaterial))

	group.userData.dispose = () => {
		backGeometry?.dispose()
		wallGeometries.forEach(geometry => geometry.dispose())
		edgeGeometry.dispose()
		guideGeometry.dispose()
		planeMaterial.dispose()
		edgeMaterial.dispose()
		guideMaterial.dispose()
		openingGlow?.userData?.geometry?.dispose?.()
		openingGlowMaterial?.dispose()
	}

	return group
}

export const disposeWalls = walls => {
	walls?.parent?.remove?.(walls)
	walls?.userData?.dispose?.()
}
