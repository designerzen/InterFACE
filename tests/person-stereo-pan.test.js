import { updateStereoPan } from '../source/people/stereo-pan.js'

const options = { stereoPan:true, stereoController:'eyesHorizontal' }
const createNode = () => ({
	context:{ currentTime:2 },
	pan:{ value:0, setTargetAtTime:jest.fn() }
})

test('glides toward mirrored eye movement on the audio clock without stepping the pan', () => {
	const node = createNode()
	updateStereoPan(node, { eyesHorizontal:0.8 }, options)
	expect(node.pan.setTargetAtTime).toHaveBeenLastCalledWith(-0.8, 2, 0.06)
	node.context.currentTime += 1 / 30
	updateStereoPan(node, { eyesHorizontal:-0.6 }, options)
	expect(node.pan.setTargetAtTime).toHaveBeenLastCalledWith(0.6, node.context.currentTime, 0.06)
	expect(node.pan.value).toBe(0)
})

test.each(['leftEyeClosed', 'rightEyeClosed'])('holds the gaze target during %s and resumes when open', eye => {
	const node = createNode()
	updateStereoPan(node, { eyesHorizontal:0.4 }, options)
	updateStereoPan(node, { eyesHorizontal:-1, [eye]:true }, options)
	expect(node.pan.setTargetAtTime).toHaveBeenCalledTimes(1)
	updateStereoPan(node, { eyesHorizontal:0.5 }, options)
	expect(node.pan.setTargetAtTime).toHaveBeenLastCalledWith(-0.5, 2, 0.06)
})

test.each([undefined, NaN, Infinity, -Infinity, null])('ignores invalid tracking values: %s', eyesHorizontal => {
	const node = createNode()
	updateStereoPan(node, { eyesHorizontal }, options)
	expect(node.pan.setTargetAtTime).not.toHaveBeenCalled()
})

test('clamps pan and supports other movement controllers during blinks', () => {
	const node = createNode()
	const headOptions = { ...options, stereoController:'roll' }
	updateStereoPan(node, { roll:3, leftEyeClosed:true }, headOptions)
	expect(node.pan.setTargetAtTime).toHaveBeenLastCalledWith(-1, 2, 0.06)
	updateStereoPan(node, { roll:-3 }, headOptions)
	expect(node.pan.setTargetAtTime).toHaveBeenLastCalledWith(1, 2, 0.06)
})

test('smoothly recentres when stereo control is disabled, including during a blink', () => {
	const node = createNode()
	updateStereoPan(node, { leftEyeClosed:true }, { ...options, stereoPan:false })
	expect(node.pan.setTargetAtTime.mock.calls[0][0]).toBeCloseTo(0)
	expect(node.pan.setTargetAtTime).toHaveBeenCalledWith(expect.any(Number), 2, 0.06)
	expect(() => updateStereoPan(undefined, {}, options)).not.toThrow()
})
