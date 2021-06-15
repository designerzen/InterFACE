export const changeParameter = (parameter, feature, value ) => {
	if (value)
	{
		parameter[feature] = value
	}
	return value ?? parameter[feature]
}