import { DEFAULT_PERSON_OPTIONS, IDENTIFIERS } from '../settings/options.people.js'

export const getPersonQueryPrefixes = (personOrIndex=0) => {
	const personIndex = typeof personOrIndex === "number" ?
		personOrIndex :
		(personOrIndex?.personIndex ?? personOrIndex?.playerNumber ?? 0)
	const identifier = IDENTIFIERS[personIndex] ?? `person-${personIndex + 1}`
	return [`p-${personIndex + 1}`, identifier]
}

export const getPersonQueryOptionMap = () => ({
	instrument:"defaultInstrument",
	preset:"defaultPreset",
	particles:"noteParticleGraphics"
})

export const getPersonQueryOptions = (data, prefixes=[]) => {
	if (!data || typeof data !== "object")
	{
		return {}
	}
	const optionKeys = Object.keys(DEFAULT_PERSON_OPTIONS)
	const optionMap = getPersonQueryOptionMap()
	const entries = []
	for (const prefix of prefixes)
	{
		for (const optionKey of optionKeys)
		{
			entries.push([`${prefix}-${optionKey}`, optionKey])
			entries.push([`${prefix}.${optionKey}`, optionKey])
		}
		for (const [queryKey, optionKey] of Object.entries(optionMap))
		{
			entries.push([`${prefix}-${queryKey}`, optionKey])
			entries.push([`${prefix}.${queryKey}`, optionKey])
		}
	}
	return entries.reduce((options, [queryKey, optionKey]) => {
		if (Object.prototype.hasOwnProperty.call(data, queryKey))
		{
			options[optionKey] = data[queryKey]
		}
		return options
	}, {})
}

export const exportPersonQueryOptions = (person, prefix='') => {
	const prefixes = prefix.length > 0 ?
		[prefix.endsWith('-') ? prefix.slice(0, -1) : prefix] :
		getPersonQueryPrefixes(person)
	const data = {}
	const exportedOptions = {
		...person.options,
		defaultInstrument:person.instrumentType ?? person.activeInstrument?.type ?? person.options.defaultInstrument,
		defaultPreset:person.activeInstrument?.activePresetIndex ?? person.options.defaultPreset
	}

	prefixes.forEach(personPrefix => {
		Object.entries(exportedOptions).forEach(([optionKey, value]) => {
			if (value !== undefined && value !== null)
			{
				data[`${personPrefix}-${optionKey}`] = value
			}
		})
		data[`${personPrefix}-instrument`] = exportedOptions.defaultInstrument
		data[`${personPrefix}-preset`] = exportedOptions.defaultPreset
		data[`${personPrefix}-particles`] = person.options.noteParticleGraphics
	})

	return data
}
