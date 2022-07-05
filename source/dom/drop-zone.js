
/**
 * Add a drag and drop zone to allow files to be 
 * dragged onto the app to then load additional features
 */
export const connectDropZone = ( method ) => {
	
	const body = document.documentElement
	const dropAreas = [ body ]
	const evs = ['dragenter', 'dragover', 'dragleave', 'drop']

	dropAreas.forEach( dropArea => {
		evs.forEach(eventName => {
			dropArea.addEventListener(eventName, async (event) => {
				event.preventDefault()
				event.stopPropagation()
				switch (event.type)
				{
					case 'dragenter':
					case 'dragover':
						body.classList.toggle('dragging', true)
						break
	
					case 'dragleave':
					case 'drop':
						body.classList.toggle('dragging', false)
						break
				}

				if (event.type === "drop")
				{
					const dataTransfer = event.originalEvent ? event.originalEvent.dataTransfer : event.dataTransfer
					const file = dataTransfer.files[0]
					await method( file )
				}

			}, false)
		})
	})
}