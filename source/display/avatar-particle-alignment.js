import { Box3, DoubleSide, Vector3 } from "three"

export const DEFAULT_AVATAR_PARTICLE_ALIGNMENT = {
	avatarOpacity: 0.38,
	avatarScaleMultiplier: 1.35,
	avatarYOffset: 0,
	avatarZOffset: 0.055,
	avatarAlignmentSmoothing: 0.42
}

const getParticleBounds = particles => {
	const positions = particles?.geometry?.attributes?.position?.array
	if (!positions?.length)
	{
		return null
	}

	const min = new Vector3(Infinity, Infinity, Infinity)
	const max = new Vector3(-Infinity, -Infinity, -Infinity)
	for (let index = 0; index < positions.length; index += 3)
	{
		const x = positions[index]
		const y = positions[index + 1]
		const z = positions[index + 2]
		if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z))
		{
			continue
		}
		min.x = Math.min(min.x, x)
		min.y = Math.min(min.y, y)
		min.z = Math.min(min.z, z)
		max.x = Math.max(max.x, x)
		max.y = Math.max(max.y, y)
		max.z = Math.max(max.z, z)
	}

	if (!Number.isFinite(min.x))
	{
		return null
	}

	return {
		min,
		max,
		center: new Vector3().addVectors(min, max).multiplyScalar(0.5),
		size: new Vector3().subVectors(max, min)
	}
}

const configureMaterial = (material, options) => {
	if (!material)
	{
		return
	}

	material.transparent = true
	material.opacity = options.avatarOpacity ?? DEFAULT_AVATAR_PARTICLE_ALIGNMENT.avatarOpacity
	material.depthTest = false
	material.depthWrite = false
	material.side = DoubleSide
	material.needsUpdate = true
	if (material.color)
	{
		material.color.setHSL(0.58, 0.36, 0.72)
	}
}

export const configureGhostAvatar = (avatarParent, options = {}) => {
	avatarParent?.traverse?.(object => {
		if (!object.material)
		{
			return
		}
		if (Array.isArray(object.material))
		{
			object.material.forEach(material => configureMaterial(material, options))
		}
		else
		{
			configureMaterial(object.material, options)
		}
	})
}

export const attachAvatarToParticles = (display, avatarParent) => {
	if (!display?.particles || !avatarParent)
	{
		return false
	}

	if (avatarParent.parent !== display.particles)
	{
		avatarParent.parent?.remove?.(avatarParent)
		display.particles.add(avatarParent)
	}
	avatarParent.visible = true
	return true
}

const measureLocalObject = object => {
	const previousParent = object.parent
	const previousPosition = object.position.clone()
	const previousRotation = object.rotation.clone()
	const previousScale = object.scale.clone()

	previousParent?.remove?.(object)
	object.position.set(0, 0, 0)
	object.rotation.set(0, 0, 0)
	object.scale.set(1, 1, 1)
	object.updateMatrixWorld(true)

	const box = new Box3().setFromObject(object)
	const size = box.getSize(new Vector3())
	const center = box.getCenter(new Vector3())

	object.position.copy(previousPosition)
	object.rotation.copy(previousRotation)
	object.scale.copy(previousScale)
	previousParent?.add?.(object)
	object.updateMatrixWorld(true)

	return { box, size, center }
}

export const alignAvatarToParticles = (display, options = {}) => {
	const avatarParent = display?.avatar?.scene
	const particles = display?.particles
	if (!avatarParent || !particles)
	{
		return
	}

	const particleBounds = getParticleBounds(particles)
	if (!particleBounds)
	{
		return
	}

	if (!display.avatarAlignmentState)
	{
		const { size: avatarSize, center: avatarCenter } = measureLocalObject(avatarParent)
		display.avatarAlignmentState = {
			baseScale: avatarParent.scale.x || 1,
			avatarSize,
			avatarCenter
		}
	}

	const state = display.avatarAlignmentState
	const smoothing = options.avatarAlignmentSmoothing ?? DEFAULT_AVATAR_PARTICLE_ALIGNMENT.avatarAlignmentSmoothing
	const scaleMultiplier = options.avatarScaleMultiplier ?? DEFAULT_AVATAR_PARTICLE_ALIGNMENT.avatarScaleMultiplier
	const targetHeight = Math.max(0.001, particleBounds.size.y)
	const avatarHeight = Math.max(0.001, state.avatarSize.y)
	const targetScale = (targetHeight / avatarHeight) * scaleMultiplier
	const targetPosition = particleBounds.center.clone()
	targetPosition.y += options.avatarYOffset ?? DEFAULT_AVATAR_PARTICLE_ALIGNMENT.avatarYOffset
	targetPosition.z += options.avatarZOffset ?? DEFAULT_AVATAR_PARTICLE_ALIGNMENT.avatarZOffset
	targetPosition.sub(state.avatarCenter.clone().multiplyScalar(targetScale))

	avatarParent.visible = true
	avatarParent.renderOrder = 12
	avatarParent.scale.lerp(new Vector3(targetScale, targetScale, targetScale), smoothing)
	avatarParent.position.lerp(targetPosition, smoothing)
}
