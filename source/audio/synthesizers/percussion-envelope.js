export const getVelocityEnvelopeLevels = (options, gain=1) => ({
	peak:options.velocity * gain,
	sustain:options.velocity * options.sustain * gain
})
