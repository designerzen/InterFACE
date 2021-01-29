// Be careful, this will reset the package in case it has stopped compiling
// Only use it if you know what the below phrases mean!

import {rmdirSync,unlink} from 'fs'
import * as path from 'path'

// get args from node 
// DELETE node_modules too?
const TO_DELETE = [ '.parcel-cache']
if ( process.argv.indexOf('--total') > -1 ){
    TO_DELETE.push('node_modules')
}
    
TO_DELETE.forEach( async (directory) => {

    try {
        rmdirSync(directory, { recursive: true })
        console.log("\x1b[32m", `${directory} was deleted`)
    } catch (err) {
        console.error("\x1b[31m", `Error while deleting ${dir}.`)
    }

})
