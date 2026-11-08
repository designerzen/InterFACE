import pug from 'pug'

beforeEach(()=>{document.body.innerHTML=pug.renderFile('source/partials/control-panel.pug')})

test('melody uses one inline selector for None or the player to follow',()=>{
	const select=document.getElementById('backing-melody-player')
	expect(select.closest('label').textContent).toContain('Melody')
	expect(select.closest('.folder-menu')).toBeNull()
	expect(select.value).toBe('disabled')
	expect([...select.options].map(option=>option.value)).toEqual(['disabled','0','1','2','3'])
	expect(document.getElementById('folder-melody')).toBeNull()
	expect(document.getElementById('button-backing-melody')).toBeNull()
	expect(select.getAttribute('aria-describedby')).toBe('backing-melody-status')
})

test('melody volume reuses the mixer channel, vertical fader, readout and step buttons',()=>{
	const slider=document.getElementById('backing-melody-volume')
	expect(slider.closest('#mixer-panel > .mixer-channel')).not.toBeNull()
	expect(slider.classList.contains('vertical')).toBe(true)
	expect(slider.getAttribute('list')).toBe('volume-input-ticks')
	expect(document.querySelectorAll('.volume-step-button[data-volume-target="backing-melody-volume"]')).toHaveLength(2)
	expect(document.querySelector('output[for="backing-melody-volume"]')).not.toBeNull()
})
