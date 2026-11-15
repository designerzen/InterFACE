/*

Audiobus sound engines, effects and performers

Use the factories to list and create any output or effect by id, each loaded on demand,
or import a class directly when the engine is known in advance.

import { createOutputById, RomplerOutput, ROMPLER_BASE_URL } from "./audio/audiobus.js"
const synth = await createOutputById("fm", { audioContext })
const piano = new RomplerOutput({ audioContext, baseUrl:ROMPLER_BASE_URL })
piano.noteOn(60, 100)

*/

import { setYoshimiAssetBase } from "audiobus/wam/yoshimi-assets.ts"

export {
	OUTPUT_FACTORIES,
	getAvailableOutputFactories,
	createOutputById,
	registerOutput
} from "audiobus/io/output-factory.ts"
export { EFFECT_REGISTRY } from "audiobus/effects/effect-registry.ts"

export { default as RomplerOutput } from "audiobus/io/outputs/rompler/output-rompler.ts"
export { default as FMOutput } from "audiobus/io/outputs/output-fm.ts"
export { default as MonotronOutput } from "audiobus/io/outputs/output-monotron.ts"
export { default as WaveguideOutput } from "audiobus/io/outputs/output-waveguide.ts"
export { default as MultiOscillatorOutput } from "audiobus/io/outputs/output-multi-oscillator.ts"
export { default as MoogOutput } from "audiobus/io/outputs/output-moog.ts"
export { default as YoshimiOutput } from "audiobus/io/outputs/output-yoshimi.ts"
export { default as WAM2Output } from "audiobus/io/outputs/output-wam2.ts"
export { default as SuperSonicOutput } from "audiobus/io/outputs/output-supersonic.ts"
export { default as WebMIDIOutput } from "audiobus/io/outputs/output-webmidi-device.ts"
export { PercussionSynth } from "audiobus/instruments/percussion/percussion-synth.ts"

export { default as ChannelStripEffect } from "audiobus/effects/effect-channel-strip.ts"
export { default as DubDelayEffect } from "audiobus/effects/effect-dub-delay.ts"
export { default as SnareReverbEffect } from "audiobus/effects/effect-snare-reverb.ts"
export { default as SaturatorEffect } from "audiobus/effects/effect-saturator.ts"
export { default as ExpressionEffect } from "audiobus/effects/effect-expression.ts"
export { default as DrumBusEffect } from "audiobus/effects/effect-drum-bus.ts"
export { default as CompressorEffect } from "audiobus/effects/effect-compressor.ts"
export { default as LimiterEffect } from "audiobus/effects/effect-limiter.ts"
export { default as DelayEffect } from "audiobus/effects/effect-delay.ts"
export { default as DistortionEffect } from "audiobus/effects/effect-distortion.ts"
export { default as FilterEffect } from "audiobus/effects/effect-filter.ts"
export { default as ReverbEffect } from "audiobus/effects/effect-reverb.ts"

export { ChordPerformer } from "audiobus/io/chord-performer.ts"
export { TransformerArpeggiator } from "audiobus/io/transformers/transformer-arpeggiator.ts"
export { TransformerStrummer } from "audiobus/io/transformers/transformer-strummer.ts"
export { TransformerHarp } from "audiobus/io/transformers/transformer-harp.ts"
export { TransformerChordPattern } from "audiobus/io/transformers/transformer-chord-pattern.ts"

// The OpenGM24 samples copied into the build by the staticFiles settings in package.json
export const ROMPLER_BASE_URL = "./assets/audio/OpenGM24/"

// Audiobus's multipart Yoshimi engine, copied into the build by the staticFiles settings in package.json.
// The older single-part engine in static/wam does not speak to audiobus's Yoshimi output.
setYoshimiAssetBase("./audiobus/yoshimi/")
