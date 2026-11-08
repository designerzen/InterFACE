import { HEAD_PARTICLE_MODES } from './head-particle-modes.js'

const number = (key, label, group, value, min, max, step) => ({ key, label, group, value, min, max, step, type: 'range' })
const toggle = (key, label, group, value = true) => ({ key, label, group, value, type: 'checkbox' })
export const LOOKING_GLASS_SETTINGS = [
  number('depthiness', 'Depth strength', 'Optics', .7, 0, 1.5, .05),
  number('focusOffset', 'Focus plane offset', 'Optics', 0, -1, 1, .05),
  number('targetDiam', 'Scene size', 'Optics', 2, .5, 5, .1),
  number('fovy', 'Field of view', 'Optics', 16 * Math.PI / 180, 5 * Math.PI / 180, 60 * Math.PI / 180, Math.PI / 180),
  number('cameraDistanceScale', 'Camera distance', 'Optics', .8, .4, 1.5, .05),
  number('targetX', 'Horizontal position', 'Optics', 0, -1, 1, .05),
  number('targetY', 'Vertical position', 'Optics', 0, -1, 1, .05),
  number('targetZ', 'Scene depth position', 'Optics', 1.5, 0, 3, .05),
  number('headOpacityOverride', 'Face opacity', 'Face', .025, 0, .5, .005),
  { key: 'headColourMode', label: 'Face colour', group: 'Face', value: 'white', type: 'select', choices: [['white', 'White'], ['note', 'Current note colour']] },
  { key: 'headParticleMode', label: 'Particle arrangement', group: 'Particles', value: 'surface', type: 'select', choices: HEAD_PARTICLE_MODES.map((key, i) => [key, ['Organic surface + live detail', 'Organic volume + live detail', 'Regular grid — solid head', 'Regular grid — head shell', 'Regular grid — expressive head', 'Even surface dots', 'Horizontal dotted slices', 'Live facial contours', 'Translucent face + contour accents', 'Even surface — hidden rear particles'][i]]) },
  { key: 'headParticleGridSpacing', label: 'Particle spacing', group: 'Particles', value: .04, type: 'select', choices: [[.06, 'Wide — 6%'], [.04, 'Medium — 4%'], [.025, 'Fine — 2.5%']] },
  number('geometrySubdivisions', 'Particle density', 'Particles', 3, 0, 4, 1),
  number('particleSize', 'Particle size', 'Particles', .006, .001, .02, .001),
  toggle('particleIdleMotion', 'Organic idle motion', 'Particles'),
  number('particleWander', 'Wander distance', 'Particles', .018, 0, .06, .002),
  number('particleArrivalStagger', 'Arrival stagger (seconds)', 'Particles', .65, 0, 2, .05),
  number('particleFallStagger', 'Falling stagger (seconds)', 'Particles', 1, 0, 2, .05),
  toggle('showWalls', 'Show walls', 'Scene'),
  number('wallDepthScale', 'Wall length', 'Scene', 1.25, .25, 3, .05),
  toggle('wallStripeAnimation', 'Animate wall stripe with tempo', 'Scene'),
  toggle('mouthNoteParticles', 'Particles from mouth on notes', 'Scene'),
  toggle('lookingGlassEmoticons', 'Show emoticon', 'Scene'),
  { key: 'lookingGlassEmoticonStyle', label: 'Emoticon style', group: 'Scene', value: 'crisp', type: 'select', choices: [['crisp', 'Crisp'], ['particles', 'Particles']] },
  number('lookingGlassEmoticonScreenYOffset', 'Emoticon downward offset', 'Scene', .025, -.1, .15, .005)
]

export const CAMERA_SETTING_KEYS = ['depthiness', 'focusOffset', 'targetDiam', 'fovy', 'cameraDistanceScale', 'targetX', 'targetY', 'targetZ']
export function normalizeLookingGlassSettings(values = {}) {
  const result = {}
  for (const spec of LOOKING_GLASS_SETTINGS) {
    const value = values[spec.key]
    if (value === undefined) continue
    if (spec.type === 'checkbox') { if (typeof value === 'boolean') result[spec.key] = value }
    else if (spec.type === 'select') {
      const choice = spec.choices.find(([key]) => String(key) === String(value))
      if (choice) result[spec.key] = choice[0]
    } else if (typeof value === 'number' && Number.isFinite(value)) result[spec.key] = Math.max(spec.min, Math.min(spec.max, value))
  }
  return result
}
