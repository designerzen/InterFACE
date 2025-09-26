import { createDAWProject, loadDAWProject } from "./dawproject-utils"

export default class DAWProject{
	
	name = ""

	// elements
	project
	application
	transport
	structure
	arrangement

	constructor(name, version){
		this.project = createDAWProject(name, version)
		// const project = createDAWProject("PhotoSYNTH", "1.0.0")
		// const projectElement = project.querySelector("Project")
		// const applicationElement = project.querySelector("Application")
		
		// const transportElement = createTransportElement(projectElement)
		// const tempoElement = createTempoElement(transportElement)
		// const timeSignatureElement = createTimeSignatureElement(transportElement)
		
		// const structureElement = createStructureElement(projectElement)
		
		// const notesElement = createNotesElement(projectElement)
		// const noteElement = createNoteElement(notesElement, 0, 1, 1, 0)
	}

	async load(file){
		this.project = await loadDAWProject(file)
	}

	async save(file){
		// await saveDAWProject(file)
	}
}