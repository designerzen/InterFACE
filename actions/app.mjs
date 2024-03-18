import {existsSync,renameSync, readdir,statSync,unlink} from 'fs'
import * as path from 'path'

if (!existsSync('./dist/index.html'))
{
  console.log("Renaming app to index")
//   renameSync("./dist/app.html", "./dist/index.html")
}

// import { builder } from "electron-builder"

// const Platform = builder.Platform

// let target = "WIN"
// if ( process.argv.indexOf('--platform') > -1 )
// {
//     target = process.argv[process.argv.indexOf('--platform')]
// }

// // first rename app.html to index.html if not found...


// console.log(`Building APP to platform ${target}...`)

// // Promise is returned
// builder.build({
//   targets: Platform[target].createTarget(),
//   config: {
//    "//": "build options, see https://goo.gl/QQXmcV"
//   }
// })
//   .then(() => {
//     // handle result
	
// console.log(`Built to platform ${target}...`)

//   })
//   .catch((error) => {
//     // handle error
	
// console.error(`Building APP failed ${error}...`)

//   })
