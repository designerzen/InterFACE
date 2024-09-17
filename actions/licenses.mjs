// Originally I had planned on using this to extract
// the licenses from JS and pt them into anchor links
// but having read the licenses deeper, I don't
// think legally I am allowed to do that so instead
// 300k of license data is loaded and hidden in scripts!

// The LICENSE.md files are created by a package.json script
// that calls a yarn command then plays with the output

import fs from 'fs'
import path from 'path'

const rawLicenses = fs.readFileSync(path.join(__dirname, '../LICENSE.md'), 'utf8')
const licenseData = rawLicenses
						.replaceAll('"""', '"')
						.split('-----')

const licenses = licenseData


const intro = licenses.shift()