import OPFSWorker from 'worker:./opfs.worker.js';

// Adapter for storing stuff in local user dir
export default class StorageOPFS{
	
	// 
	constructor(){

		// load worker
		this.worker = new Worker( OPFSWorker, { type: 'module' } )
	}

	async save( data ){


	}

	async load( id ){

	}
}