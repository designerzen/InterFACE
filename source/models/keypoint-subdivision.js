/** Increase point density without loading a 3D engine or avatar assets. */
export const subdivideKeypoints = (keypoints, subdivisions = 0) => {
	if (!keypoints || subdivisions <= 0) return keypoints
	let current = keypoints
	for (let sub = 0; sub < subdivisions; sub++) {
		const subdivided = []
		for (let i = 0; i < current.length; i++) {
			subdivided.push(current[i])
			if (i < current.length - 1) {
				const next = current[i + 1]
				const interpolated = { x: (current[i].x + next.x) * .5, y: (current[i].y + next.y) * .5 }
				if (current[i].z !== undefined && next.z !== undefined) interpolated.z = (current[i].z + next.z) * .5
				subdivided.push(interpolated)
			}
		}
		current = subdivided
	}
	return current
}
