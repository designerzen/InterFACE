const descriptions = {
	'button-controls-list': { on: 'Return to the compact grid of controls.', off: 'Show all controls in a full-screen list grouped into sections.' },
	'select-key': 'Choose the home note used by all players.',
	'select-key-scale': 'Choose which notes and intervals are available to all players.',
	'folder-tempo': 'Set the speed, tap a tempo, adjust swing or synchronise with other machines.',
	'button-metronome': { on: 'A steady click is playing to help you keep time.', off: 'Play a steady click to help you keep time.' },
	'button-quantise': { on: 'Notes are aligned to regular beats.', off: 'Notes follow your playing without being aligned to the beat.' },
	'select-arp-rate': 'Choose how quickly arpeggios step through their notes.',
	'button-percussion': { on: 'Background beats are playing along with you.', off: 'Add background beats to play along with.' },
	'backing-melody-player': { on: 'AI backing melody follows the selected player and the global key and scale. Adjust its volume in the mixer.', off: 'Backing melody is disabled. Choose a player to follow.', isEnabled: control => control.value !== 'disabled' },
	'backing-melody-volume': 'Adjust the volume of the backing melody independently of the drums.',
	'backing-melody-model-url': 'Uses the bundled local checkpoint by default. Optionally choose another checkpoint directory.',
	'select-percussion-preset': 'Choose a ready-made combination of drum patterns and sounds.',
	'select-percussion-pattern': 'Choose the rhythm played by the backing drums.',
	'select-percussion-sound': 'Choose the set of sounds used by the backing drums.',
	'button-randomise-percussion': 'Create a new variation of the backing beats.',
	'button-rapid-percussion': { on: 'Drum patterns can include rapid hits and triplets.', off: 'Drum patterns avoid the extra rapid hits and triplets.' },
	'button-performance-drums': { on: 'Your performance changes how active the backing drums are.', off: 'The backing drums play independently of your performance.' },
	'snare-reverb-range': 'Adjust how much room ambience is added to the snare drum.',
	'select-percussion-panning': 'Choose where the drums sit between the left and right speakers.',
	'select-beat-viz': { on: 'The backing drum pattern is shown on screen. Choose how it is drawn.', off: 'The backing drum pattern display is disabled.', isEnabled: control => control.value !== 'disabled' },
	'button-midi-percussion': { on: 'Backing drum notes are sent to connected MIDI outputs.', off: 'Backing drum notes are not sent to MIDI outputs.' },
	'folder-volume': 'Adjust the overall volume, mute the sound or balance the mixer channels.',
	'select-impulse': 'Choose the room or space simulated by the reverb effect.',
	'select-samples': 'Choose the sound library used for sampled instruments.',
	'folder-midi': 'Connect MIDI devices and choose how notes and controls are routed.',
	'select-display': 'Choose the renderer used to draw the performance.',
	'button-flood': { on: 'Video and overlays fill the screen, cropping the edges when needed.', off: 'Video and overlays keep their full picture, leaving space around the edges when needed.' },
	'button-clear': { on: 'The video image is hidden from the performance display.', off: 'The video image is shown in the performance display.' },
	'button-sync-video': { on: 'Video timing is synchronised with the performance where possible.', off: 'Video timing is not synchronised with the performance.' },
	'select-viz': { on: 'Sound-reactive visuals are shown. Choose their pattern.', off: 'Sound-reactive visuals are turned off.', isEnabled: control => control.value !== 'off' },
	'button-disco': { on: 'Psychedelic visual effects are enabled.', off: 'Psychedelic visual effects are disabled.' },
	'button-meshes': { on: 'Face overlays are shown on tracked faces.', off: 'Face overlays are hidden.' },
	'select-eyes': { on: 'Eye overlays are enabled. Choose their style.', off: 'Eye overlays are disabled. Choose a style to show them.', isEnabled: control => !!control.value && !/^s:0(?:,|$)/.test(control.value) },
	'button-eyebrows': { on: 'Eyebrow overlays are shown on tracked faces.', off: 'Eyebrow overlays are hidden.' },
	'select-lips': { on: 'Lipstick is enabled. Choose a solid colour, music pulse or beat flash.', off: 'Lipstick is disabled. Choose a style to show it.', isEnabled: control => control.value !== 'disabled' },
	'select-subdivisions': { on: 'Extra detail is added to the face geometry. Choose the subdivision level.', off: 'No extra subdivisions are added to the face geometry.', isEnabled: control => Number(control.value) > 0 },
	'select-palette': 'Choose the colours used to draw the overlays.',
	'button-toggle-overlay': { on: 'The text and symbol overlay canvas is visible.', off: 'The text and symbol overlay canvas is hidden.' },
	'button-subtitles': { on: 'Text overlays are shown during the performance.', off: 'Text overlays are hidden during the performance.' },
	'button-hud': { on: 'The input device display is visible.', off: 'The input device display is hidden.' },
	'button-overlay': { on: 'Face overlays are enabled. Use the individual controls to choose what is shown.', off: 'Face overlays are disabled.' },
	'folder-engine': 'Choose the voice engine and adjust its settings for all players. Percussion uses its own engine.',
	'select-voice-engine': 'Choose the voice engine for all players. Percussion uses its own engine.',
	'select-camera': 'Choose which camera supplies the live video and tracking.',
	'select-keyboard-mode': 'Choose whether the keyboard controls the app or plays notes, chords, drums or samples.',
	'folder-head': 'Adjust how head movement plays notes for all players: side-to-side lean range, up-and-down nod range and the neutral height.',
	'head-note-range': 'Set the head turning angle that covers the available note range.',
	'head-vertical-offset': 'Set the head height that plays the middle octave. Higher means looking ahead plays lower octaves and the top octave needs a higher head.',
	'folder-mouth': 'Shape how mouth opening becomes loudness for all players, with presets, a note gate and the opening range.',
	'select-mouth-dynamics': 'Choose a starting loudness curve. Editing the graph makes it a custom curve.',
	'mouth-gate': 'Set how far the mouth must open before a note starts.',
	'lip-range': 'Set how much mouth opening the loudness curve covers.',
	'head-vertical-range': 'Set the vertical head angle that covers the available range.',
	'button-points': { on: 'Player points and achievement progress are shown.', off: 'Player points and achievement progress are hidden.' },
	'button-automate': { on: 'Supervised automation can change controls while you play.', off: 'Supervised automation is disabled; you choose the controls yourself.' },
	'button-accessibility': 'Adjust text size, contrast, motion and other accessibility preferences.',
	'button-speak': { on: 'Instructions and help can be read aloud.', off: 'Spoken instructions and help are disabled.' },
	'select-theme': 'Choose the app colour scheme and visual theme.',
	'button-help': 'Open instructions and help for using PhotoSYNTH.',
	'button-command-palette': 'Search for an app section, control or action.',
	'button-toggle-advanced': { on: 'Expert mode is enabled, with more settings and controls available.', off: 'Expert mode is disabled to keep the controls simpler.' },
	'button-reset': 'Restore the app settings to their factory defaults.',
	'button-settings': { on: 'The compact settings panel is open.', off: 'Open the compact settings panel to change app behaviour and sound.' },
	'button-share': 'Share a link to this PhotoSYNTH session.',
	'button-fullscreen': { on: 'PhotoSYNTH fills the display. Activate to leave full screen.', off: 'Fill the display with PhotoSYNTH.' },
	'button-record-session': { on: 'A performance is being recorded. Activate to stop recording.', off: 'Record your played notes, with optional audio and video.' },
	'session-replay': { on: 'Saved notes are playing back. Activate to pause playback.', off: 'Play back the notes from a saved performance.' },
	'session-rewind': 'Move playback back by ten seconds.',
	'session-forward': 'Move playback forward by ten seconds.',
	'button-save-midi': 'Browse saved recordings, export them or delete them to free browser storage.',
	'session-replay-choose': 'Pause this replay and pick a different saved performance to play back.',
	'session-replay-position': 'Move to a different point in the saved performance.',
	'folder-record': 'Take a photograph or record audio and video.',
	'button-photograph': 'Capture a photograph of the performance display.',
	'button-record-audio': { on: 'Audio recording is running.', off: 'Record the sound of your performance.' },
	'button-record-video': { on: 'Video recording is running.', off: 'Record a video of your performance.' },
	'button-record': 'Record a short performance loop.',
	'tempo-input-text': 'Set the speed in beats per minute.',
	'tempo-input-range': 'Slide to change the speed in beats per minute.',
	'tempo-swing-range': 'Adjust how much alternate beats are delayed to create swing.',
	'tempo-tab': 'Adjust tempo and swing on this machine.',
	'tempo-sync-tab': 'Share timing with other machines in the same room.',
	'timing-room-id': 'Enter the room code used by the machines playing together.',
	'timing-room-host': 'Create a room and control its shared tempo and timing.',
	'timing-room-join': 'Import the host’s invitation or a guest’s response to connect directly.',
	'timing-room-invite': 'Create a separate invitation link and QR code for another guest.',
	'timing-room-pairing': 'Paste an invitation or response link to pair machines.',
	'timing-room-scan': 'Use the camera to scan an invitation or response QR code.',
	'timing-room-image': 'Read a pairing QR code from an image.',
	'timing-room-stop-scan': 'Stop the QR scanner and release its camera.',
	'timing-room-leave': 'Leave the shared timing room and play independently.',
	'timing-room-start': 'Start the machines in the room at the same shared boundary.',
	'timing-room-pause': 'Pause the machines in the room together.',
	'timing-room-copy': 'Copy the invitation or response link for this pairing.',
	'button-volume-mixer-mode': { on: 'The full mixer is open. Activate to return to master volume.', off: 'Show separate mixer channels as well as master volume.' },
	'mixer-master-volume': 'Adjust the overall output volume.',
	'mixer-percussion-volume': 'Adjust the volume of the backing drums.',
	'mixer-sample-volume': 'Adjust the volume of samples and sound effects.',
	'mixer-trim-volume': 'Adjust the level of the player instruments.',
	'button-mute': { on: 'The sound is muted. Activate to restore it.', off: 'The sound is unmuted. Activate to silence it.' },
	'toggle-midi': { on: 'MIDI devices can send and receive notes and controls.', off: 'MIDI device communication is disabled.' },
	'midi-inputs': 'Choose which MIDI devices supply incoming notes and controls.',
	'midi-outputs': 'Choose which MIDI devices receive outgoing notes and controls.',
	'midi-cc-open': 'Look up the MIDI control change numbers used by the app.',
	'midi-eyebrow-mode': 'Choose whether eyebrow movement sends MIDI control changes.',
	'midi-eyebrow-cc': 'Choose the MIDI control change number used for eyebrow movement.',
	'midi-cc-enabled': { on: 'MIDI control changes can operate the app and report its settings.', off: 'Two-way MIDI control of app settings is disabled.' },
	'midi-cc-channel': 'Choose the MIDI channel used for app control messages.',
	'midi-cc-sync': 'Send the current app control settings to connected MIDI outputs.',
}

const selector = '.controls button, .controls input:not([type="hidden"]), .controls select, .controls textarea, .controls .folder-link, .transport-session-controls button, #session-replay-progress button, #session-replay-progress input'
const labelOnlyControls = new Set(['tempo-increase-button', 'tempo-decrease-button', 'tempo-tap-button'])

export const setupGadgetDescriptions = panel => {
	if (panel.gadgetDescriptions) return panel.gadgetDescriptions
	const document = panel.ownerDocument
	const window = document.defaultView
	const entries = new Map()
	let sequence = 0
	let pending = false
	const hostFor = control => control.labels?.[0] || (control.matches('button, a') ? control : control.parentElement)
	const attach = (control, host, description) => {
		if (description.parentElement !== host) host.append(description)
		const refs = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean))
		if (!refs.has(description.id)) {
			refs.add(description.id)
			control.setAttribute('aria-describedby', [...refs].join(' '))
		}
	}
	const refresh = () => {
		for (const control of panel.querySelectorAll(selector)) {
			if (labelOnlyControls.has(control.id) || control.closest('#folder-volume, #mixer-panel')) continue
			if (control.closest('dialog') || (control.tagName !== 'SELECT' && control.closest('select'))) continue
			const host = hostFor(control)
			if (entries.has(control)) { attach(control, host, entries.get(control).description); continue }
			const key = control.matches('.folder-link') ? control.hash.slice(1) : control.id
			const label = host.cloneNode(true)
			label.querySelectorAll('input, select, textarea, kbd, .controls-list-value, .gadget-description').forEach(element => element.remove())
			const fallback = control.getAttribute('aria-label') || label.textContent.trim().replace(/\s+/g, ' ')
			if (!descriptions[key] && !fallback) continue
			const description = document.createElement('small')
			description.className = 'gadget-description sr-only'
			description.id = `gadget-description-${++sequence}`
			// Referenced descriptions remain readable without becoming part of the label/name.
			description.setAttribute('aria-hidden', 'true')
			attach(control, host, description)
			entries.set(control, { description, definition: descriptions[key] || fallback })
		}
		for (const [control, { description, definition }] of entries) {
			if (!panel.contains(control)) { description.remove(); entries.delete(control); continue }
			const nativeToggle = control.matches('input[type="checkbox"], input[type="radio"]')
			let enabled
			if (typeof definition.isEnabled === 'function') enabled = definition.isEnabled(control)
			else if (nativeToggle) enabled = control.checked
			else enabled = control.getAttribute('aria-pressed') === 'true' || control.getAttribute('aria-expanded') === 'true'
			let text = typeof definition === 'string' ? definition : definition[enabled ? 'on' : 'off']
			if (typeof definition === 'string' && (nativeToggle || control.hasAttribute('aria-pressed'))) text = `${enabled ? 'Enabled' : 'Disabled'}. ${text}`
			if (control.disabled) text += ' This control is currently unavailable.'
			if (description.textContent !== text) description.textContent = text
		}
	}
	const schedule = () => {
		if (pending) return
		pending = true
		window.queueMicrotask(() => { pending = false; refresh() })
	}
	refresh()
	for (const event of ['input', 'change', 'click', 'focusin']) panel.addEventListener(event, schedule)
	document.addEventListener('fullscreenchange', schedule)
	const observer = new window.MutationObserver(mutations => {
		if (mutations.some(mutation => !mutation.target.closest?.('.gadget-description'))) schedule()
	})
	observer.observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'checked', 'disabled', 'aria-pressed', 'aria-expanded', 'aria-describedby'] })
	panel.gadgetDescriptions = { refresh }
	return panel.gadgetDescriptions
}
