import { createDAWProject, loadDAWProject } from "./dawproject-utils";



export default class DAWProject{
	
	name = ""
	project

	constructor(name, version){

		super()
		this.project = createDAWProject(name, version)
	}

	async load(file){
		await loadDAWProject(file)
	}

	async save(file){
		// await saveDAWProject(file)
	}
}