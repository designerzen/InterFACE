import { preloadFont } from "troika-three-text"

// Try `npm i --save-dev @types/troika-three-text` if it exists or add a new declaration (.d.ts) file containing `declare module 'troika-three-text';`ts(7016)
export const preload3dFont = async (font, characters='abcdefghijklmnopqrstuvwxyz1234567890-') => new Promise((resolve,reject) => {
	preloadFont(
		{
			font, 
			characters
		},
		(result) => {
			console.info("3d Font loaded", result, {font} )
			resolve()
		}
	)
})
