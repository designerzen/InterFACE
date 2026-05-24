export const getKeypointZoom = (keypoints, fallback = 3.14) => {
	if (!keypoints?.length)
	{
		return fallback
	}

	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity

	for (const keypoint of keypoints)
	{
		const x = keypoint.x ?? 0
		const y = keypoint.y ?? 0
		const z = keypoint.z ?? 0
		minX = Math.min(minX, x)
		minY = Math.min(minY, y)
		minZ = Math.min(minZ, z)
		maxX = Math.max(maxX, x)
		maxY = Math.max(maxY, y)
		maxZ = Math.max(maxZ, z)
	}

	const zoomLevel = (maxX - minX) + (maxY - minY) + (maxZ - minZ)
	return Math.max(Math.min(zoomLevel * zoomLevel, 5.5), 3.14)
}

export const centrePositionBuffer = positions => {
	if (!positions?.length)
	{
		return { x: 0, y: 0, z: 0 }
	}

	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity

	for (let i = 0; i < positions.length; i += 3)
	{
		const x = positions[i]
		const y = positions[i + 1]
		const z = positions[i + 2]
		minX = Math.min(minX, x)
		minY = Math.min(minY, y)
		minZ = Math.min(minZ, z)
		maxX = Math.max(maxX, x)
		maxY = Math.max(maxY, y)
		maxZ = Math.max(maxZ, z)
	}

	const centre = {
		x: (minX + maxX) * 0.5,
		y: (minY + maxY) * 0.5,
		z: (minZ + maxZ) * 0.5
	}

	for (let i = 0; i < positions.length; i += 3)
	{
		positions[i] -= centre.x
		positions[i + 1] -= centre.y
		positions[i + 2] -= centre.z
	}

	return centre
}

const smoothstep = value => value * value * (3 - 2 * value)

export const updateMouthNoteBursts = ({
	host,
	positions,
	scales = null,
	topLipIndex,
	bottomLipIndex,
	beatJustPlayed = false,
	count = 0,
	poolSize = 12,
	duration = 70,
	distance = 1.7
}) => {
	if (!host || !positions?.length)
	{
		return
	}

	const pointCount = positions.length / 3
	if (pointCount < 2)
	{
		return
	}

	host.mouthNoteBursts ??= []
	host.mouthNoteBurstCursor ??= 0

	const top = topLipIndex
	const bottom = bottomLipIndex
	if (top + 2 >= positions.length || bottom + 2 >= positions.length)
	{
		return
	}

	const mouthX = (positions[top] + positions[bottom]) * 0.5
	const mouthY = (positions[top + 1] + positions[bottom + 1]) * 0.5
	const mouthZ = (positions[top + 2] + positions[bottom + 2]) * 0.5
	const lipX = positions[top] - positions[bottom]
	const lipY = positions[top + 1] - positions[bottom + 1]
	const lipZ = positions[top + 2] - positions[bottom + 2]
	const lipLength = Math.hypot(lipX, lipY, lipZ) || 1
	const normalX = -lipY / lipLength * 0.08
	const normalY = lipX / lipLength * 0.08
	const normalZ = 1
	const normalLength = Math.hypot(normalX, normalY, normalZ) || 1

	if (beatJustPlayed)
	{
		const slot = Math.max(0, pointCount - 1 - (host.mouthNoteBurstCursor % poolSize))
		host.mouthNoteBurstCursor++
		host.mouthNoteBursts.push({
			slot,
			start: count,
			x: mouthX,
			y: mouthY,
			z: mouthZ,
			dx: normalX / normalLength,
			dy: normalY / normalLength,
			dz: normalZ / normalLength,
			wobble: ((host.mouthNoteBurstCursor * 37) % 17) / 17
		})
	}

	host.mouthNoteBursts = host.mouthNoteBursts.filter(burst => {
		const age = count - burst.start
		const progress = Math.max(0, Math.min(1, age / duration))
		const eased = smoothstep(progress)
		const fade = 1 - progress
		const offset = burst.slot * 3
		const side = Math.sin(progress * Math.PI * 2 + burst.wobble * Math.PI * 2) * 0.045 * fade

		positions[offset] = burst.x + burst.dx * distance * eased + side
		positions[offset + 1] = burst.y + burst.dy * distance * eased - side * 0.35
		positions[offset + 2] = burst.z + burst.dz * distance * eased

		if (scales)
		{
			scales[burst.slot] = 0.75 + fade * 3.75
		}

		return progress < 1
	})
}
