import { fetchJSON } from "../utils/fetch.js"

export const ENSEMBLE_PRESETS_URL = "./assets/ensemble-presets.json"

export const loadEnsembleInstrumentPresets = async (url=ENSEMBLE_PRESETS_URL) => {
	const data = await fetchJSON(url)
	const presets = Array.isArray(data?.presets) ? data.presets : []
	return presets.filter(preset => preset?.id && preset?.title && preset?.voicings)
}
