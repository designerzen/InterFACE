import { isSupportedMediaFile } from '../hardware/media-source.js'

const DRAG_EVENTS = ['dragenter', 'dragover', 'dragleave', 'drop']

const openModal = dialog => {
	if (!dialog || dialog.open) return
	if (typeof dialog.showModal === 'function') {
		dialog.showModal()
	} else {
		dialog.open = true
		dialog.setAttribute('open', '')
	}
}

const closeModal = (dialog, returnValue = 'close') => {
	if (!dialog || !dialog.open) return
	if (typeof dialog.close === 'function') {
		dialog.close(returnValue)
	} else {
		dialog.returnValue = returnValue
		dialog.open = false
		dialog.removeAttribute('open')
		dialog.dispatchEvent(new Event('close'))
	}
}

/**
 * Show the non-fatal upload dialog that lets the user choose or drop a video
 * or image file to use in place of a missing camera.
 *
 * @param {Object} options
 * @param {(file: File) => Promise<void>} options.onFileSelected
 * @param {() => Promise<boolean>|boolean} [options.onRetryCamera]
 * @param {(reason: string) => void} [options.onClose]
 * @param {HTMLDialogElement|null} [options.dialog]
 * @returns {{ close: (reason?: string) => void, setStatus: (message: string, state?: string) => void, dialog: HTMLDialogElement } | null}
 */
export const showCameraUploadDialog = ({
	onFileSelected,
	onRetryCamera,
	onClose,
	dialog = document.getElementById('camera-upload'),
} = {}) => {
	if (!dialog) return null

	// Tear down any previous binding on this dialog instance before re-binding.
	dialog._cameraUploadCleanup?.()

	const fileInput = dialog.querySelector('#camera-upload-input')
	const dropzone = dialog.querySelector('.camera-upload-dropzone')
	const chooseButton = dialog.querySelector('#button-camera-upload-choose')
	const retryButton = dialog.querySelector('#button-camera-upload-retry')
	const statusElement = dialog.querySelector('#camera-upload-status')

	let isBusy = false
	let closed = false

	const setStatus = (message = '', state = '') => {
		if (!statusElement) return
		statusElement.textContent = message
		statusElement.hidden = !message
		if (state) statusElement.dataset.state = state
		else delete statusElement.dataset.state
	}

	const setBusy = busy => {
		isBusy = busy
		if (chooseButton) chooseButton.disabled = busy
		if (retryButton) retryButton.disabled = busy
		if (fileInput) fileInput.disabled = busy
		dialog.classList.toggle('loading-media', busy)
	}

	const handleFile = async file => {
		if (!file || isBusy || closed) return

		if (!isSupportedMediaFile(file)) {
			setStatus('Unsupported file type. Please choose a video or image file.', 'error')
			return
		}

		setBusy(true)
		setStatus(`Loading ${file.name || 'selected file'}…`, 'loading')

		try {
			await onFileSelected?.(file)
			setStatus('')
			closeModal(dialog, 'uploaded')
		} catch (error) {
			const message = error?.message || 'Could not load that file. Please choose another video or image.'
			setStatus(message, 'error')
		} finally {
			if (!closed) setBusy(false)
		}
	}

	const onChooseClick = () => {
		if (isBusy) return
		fileInput?.click()
	}

	const onInputChange = () => {
		const file = fileInput?.files?.[0]
		if (fileInput) fileInput.value = ''
		if (file) void handleFile(file)
	}

	const onRetryClick = async () => {
		if (isBusy || closed) return
		setStatus('Checking for cameras…', 'loading')
		try {
			const found = await onRetryCamera?.()
			if (!closed && !found) {
				setStatus('Still no camera detected. Connect a camera or upload a video or image.', 'info')
			}
		} catch (error) {
			if (!closed) {
				setStatus(error?.message || 'Could not check for cameras. Upload a video or image to continue.', 'error')
			}
		}
	}

	const onDragEvent = event => {
		event.preventDefault()
		event.stopPropagation()
		if (isBusy || closed) return

		if (event.type === 'dragenter' || event.type === 'dragover') {
			dropzone?.classList.add('dragging')
		} else {
			dropzone?.classList.remove('dragging')
		}

		if (event.type === 'drop') {
			const file = event.dataTransfer?.files?.[0]
			if (file) void handleFile(file)
		}
	}

	const cleanup = () => {
		if (dialog._cameraUploadCleanup === cleanup) {
			delete dialog._cameraUploadCleanup
		}
		chooseButton?.removeEventListener('click', onChooseClick)
		fileInput?.removeEventListener('change', onInputChange)
		retryButton?.removeEventListener('click', onRetryClick)
		dialog.removeEventListener('close', onDialogClose)
		if (dropzone) {
			dropzone.classList.remove('dragging')
			DRAG_EVENTS.forEach(eventName => dropzone.removeEventListener(eventName, onDragEvent))
		}
		setBusy(false)
	}

	const onDialogClose = () => {
		if (closed) return
		closed = true
		const reason = dialog.returnValue || 'close'
		cleanup()
		onClose?.(reason)
	}

	dialog._cameraUploadCleanup = cleanup

	if (fileInput) fileInput.value = ''
	setStatus('')
	setBusy(false)

	chooseButton?.addEventListener('click', onChooseClick)
	fileInput?.addEventListener('change', onInputChange)
	retryButton?.addEventListener('click', onRetryClick)
	dialog.addEventListener('close', onDialogClose)
	if (dropzone) {
		DRAG_EVENTS.forEach(eventName => dropzone.addEventListener(eventName, onDragEvent))
	}

	openModal(dialog)

	return {
		dialog,
		setStatus,
		close: (reason = 'programmatic') => {
			if (closed) return
			closeModal(dialog, reason)
		},
	}
}
