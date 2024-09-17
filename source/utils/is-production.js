export const isProductionBuild = () => {
	// FIXME: check to see if electron is in dev mode too
	return import.meta?.env?.DEV || false
			// process?.env?.NODE_ENV === "development" || false
	// return 	isElectron() ? true : process?.env?.NODE_ENV === "development" || false
}