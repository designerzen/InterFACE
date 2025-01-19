// inspired by
// https://web.dev/building-a-dialog-component/
// https://github.com/argyleink/gui-challenges/tree/main/dialog
import dialogPolyfill from 'dialog-polyfill'

// custom events to be added to <dialog>
const dialogClosingEvent = new Event('closing')
const dialogClosedEvent  = new Event('closed')
const dialogOpeningEvent = new Event('opening')
const dialogOpenedEvent  = new Event('opened')
const dialogRemovedEvent = new Event('removed')

// track opening
const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async mutation => {
    if (mutation.attributeName === 'open') {
      const dialog = mutation.target

      const isOpen = dialog.hasAttribute('open')
      if (!isOpen) return

      dialog.removeAttribute('inert')

      // set focus
      const focusTarget = dialog.querySelector('[autofocus]')
      focusTarget
        ? focusTarget.focus({ focusVisible: false })
        : dialog.querySelector('button').focus({ focusVisible: false })

      dialog.dispatchEvent(dialogOpeningEvent)
      await animationsComplete(dialog)
      dialog.dispatchEvent(dialogOpenedEvent)
    }
  })
})

// track deletion
const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(removedNode => {
      if (removedNode.nodeName === 'DIALOG') {
        dialog.removeEventListener('click', lightDismiss)
        dialog.removeEventListener('close', dialogClose)
        removedNode.dispatchEvent(dialogRemovedEvent)
      }
    })
  })
})

// wait for all dialog animations to complete their promises
const animationsComplete = element =>
  Promise.allSettled(element.getAnimations().map(animation => animation.finished))

// click outside the dialog handler
const lightDismiss = ({target:dialog}) => {
  if (dialog.nodeName === 'DIALOG')
    dialog.close('dismiss')
}

const dialogClose = async ({target:dialog}) => {
  dialog.setAttribute('inert', '')
  dialog.dispatchEvent(dialogClosingEvent)

  await animationsComplete(dialog)

  dialog.dispatchEvent(dialogClosedEvent)
}

// page load dialogs setup
const setupDialog = async (dialog) => {
  dialog.addEventListener('click', lightDismiss)
  dialog.addEventListener('close', dialogClose)

  dialogAttrObserver.observe(dialog, { 
    attributes: true,
  })

  dialogDeleteObserver.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  })

  // remove loading attribute
  // prevent page load @keyframes playing
  await animationsComplete(dialog)
  dialog.removeAttribute('loading')
}

// -------------------------------------------------------

const onDialogClosing = ({target:dialog}) => {
	// console.log('Dialog closing', dialog)
}

const onDialogClosed = ({target:dialog}) => {
	// console.log('Dialog closed', dialog)
	// console.info('Dialog user action:', dialog.returnValue)

	if (dialog.returnValue === 'confirm') {
		// const dialogFormData = new FormData(dialog.querySelector('form'))
		// console.info('Dialog form data', Object.fromEntries(dialogFormData.entries()))
		// dialog.querySelector('form')?.reset()
	}
}

const onDialogOpened = ({target:dialog}) => {
	// console.log('Dialog open', dialog)
}

const onDialogOpening = ({target:dialog}) => {
	// console.log('Dialog opening', dialog)
}

const onDialogRemoved = ({target:dialog}) => {
	// cleanup new/optional <dialog> events
	dialog.removeEventListener('closing', onDialogClosing)
	dialog.removeEventListener('closed', onDialogClosed)
	dialog.removeEventListener('opening', onDialogOpening)
	dialog.removeEventListener('opened', onDialogOpened)
	dialog.removeEventListener('removed', onDialogRemoved)
}

// ----------------------------------------------------

// adds extra events and glosss to dialogs
const setupDialogs = () => {

	const dialogs = document.querySelectorAll('dialog')
	dialogs.forEach( dialog => {
		dialogPolyfill.registerDialog(dialog) 
		setupDialog( dialog )
		
		// new/optional <dialog> events to choose from
		dialog.addEventListener('closing', onDialogClosing)
		dialog.addEventListener('closed', onDialogClosed)
		dialog.addEventListener('opening', onDialogOpening)
		dialog.addEventListener('opened', onDialogOpened)
		dialog.addEventListener('removed', onDialogRemoved)
	} )	
	return dialogs
}

export default setupDialogs