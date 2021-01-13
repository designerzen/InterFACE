// Be careful, this will reset the package in case it has stopped compiling
// Only use it if you know what the below phrases mean!

import {rmdirSync,unlink} from 'fs'
import * as path from 'path'

// DELETE node_modules too?
const TO_DELETE = [ '.parcel-cache' ]
const directory = TO_DELETE[0]

try {
    rmdirSync(directory, { recursive: true })
    console.log(`${directory} was deleted`)
} catch (err) {
    console.error(`Error while deleting ${dir}.`)
}