jest.mock('dialog-polyfill',()=>({registerDialog:jest.fn()}))
import setupDialogs from '../source/dom/ui.dialog.js'

test('session dialog controls and interior clicks stay open; outside clicks dismiss',()=>{
	document.body.innerHTML='<dialog class="session-dialog"><button>Export</button><input></dialog>'
	const dialog=document.querySelector('dialog')
	dialog.getAnimations=()=>[]
	dialog.getBoundingClientRect=()=>({left:100,right:500,top:100,bottom:500})
	dialog.close=jest.fn()
	setupDialogs()
	const click=target=>target.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:200,clientY:200}))
	click(dialog.querySelector('button'))
	click(dialog.querySelector('input'))
	click(dialog)
	expect(dialog.close).not.toHaveBeenCalled()
	dialog.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:50,clientY:50}))
	expect(dialog.close).toHaveBeenCalledWith('dismiss')
})
