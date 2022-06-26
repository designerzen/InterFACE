
const getGamePads = () => navigator.getGamepads || navigator.webkitGetGamepads

const BUTTON_NAMES = [
	"a",
	"b",
	"x",
	"y",
	"lb",
	"rb",
	"lt",
	"rt",
	"select",
	"start", 
	"ls", 
	"rs", 
	"dup", 
	"ddown", 
	"dleft", 
	"dright"
]

export default class GamePad {

	gamePadIndex = -1
	gamepad = null
	available = false

	buttonLibrary = {}

	a = false
	b = false
	x = false
	y = false
	rb = false
	lb = false
	rt = false
	lt = false
	rs = false
	ls = false
	start = false
	select = false
	dup = false
	ddown = false
	dleft = false
	dright = false

	leftstickX = 0
	leftstickY = 0
	rightstickX = 0
	rightstickY = 0

	watcher = null

	get buttons(){
		return this.gamepad ? this.gamepad.buttons : null
	}

	get axes(){
		return this.gamepad ? this.gamepad.axes : null
	}

    constructor( gamePadId=0 ) {
      
      this.connected = false
	  this.gamePadIndex = gamePadId
      
      window.addEventListener("gamepadconnected", e => this.connect(e) )
      window.addEventListener("gamepaddisconnected", e => this.disconnect(e) )
    }

	getButton(name){
		return this.buttonLibrary[name]
	}
	
	on( callback ) {
		this.watcher = callback
	}

	dispatch( key, value ){
		this.watcher && this.watcher(key, value)
	}
	
    connect(e) {
		const gamepad = e.originalEvent ? e.originalEvent.gamepad : e.gamepad
		const log = `Gamepad #${gamepad.index+1} : ${gamepad.id} Connected`
		// check to see if this is the right id...
		if (gamepad.index === this.gamePadIndex)
		{
			this.connected = true
			this.available = true
			this.gamepad = gamepad

			BUTTON_NAMES.forEach( (button,index) => {
				buttonLibrary[button] = this.buttons[i]
			})
		
			this.update()
			this.dispatch("connected", log)
		}
    }
    
    disconnect(e) {
		const gamepad = e.originalEvent ? e.originalEvent.gamepad : e.gamepad
		const log = `Gamepad #${gamepad.index+1} : ${gamepad.id} Disconnected`
		if (gamepad.index === this.gamePadIndex)
		{
			this.connected = false
			this.available = false
			this.gamepad = null
			this.dispatch("disconnected", log)
		}
    }

	setBoolean( gamepad, button, buttonIndex ){
		// check if changed and send out event if so
		const value = gamepad.buttons[buttonIndex].pressed || gamepad.buttons[buttonIndex].value === 1
		if (this[button] !== value)
		{
			this[button] = value
			// dispatch changes
			this.dispatch(button, value)
			console.log(gamepad.buttons[buttonIndex].value,  "Dispatching gamepad data",this.gamepad, {button, value} )
			
		}else{
			console.log( "unchanged gamepad data",this.gamepad, value, this[button] )
		}
		// not changed
	}
    
    update() {
		
		if (!this.gamepad)
		{
			const all = getGamePads()
			
			this.gamepad = all[this.gamePadIndex]
			this.available = !!this.gamepad

			console.log(this.available, "Updating gamepad data", {all}, this.gamepad)
		}
		
    	if (this.available && this.connected) 
		{
			//console.log(this.available, "Updating gamepad data",this.gamepad)
			
			this.leftstickX = this.gamepad.axes[0]
			this.leftstickY = this.gamepad.axes[1]
			this.rightstickX = this.gamepad.axes[2]
			this.rightstickY = this.gamepad.axes[3]
			for (var i = 0, l=BUTTON_NAMES.length; i < l; ++i) 
			{
				this.setBoolean( this.gamepad, BUTTON_NAMES[i], i)
			}

			//BUTTON_NAMES.forEach( (button, i) => this.setBoolean( this.gamepad, button, i) )
			// this.setBoolean( gamepad, "a", 0)
			// this.setBoolean( gamepad, "b", 1)
			// this.setBoolean( gamepad, "x", 2)
			// this.setBoolean( gamepad, "y", 3)
			// this.setBoolean( gamepad, "lb", 4)
			// this.setBoolean( gamepad, "rb", 5)
			// this.setBoolean( gamepad, "lt", 6)
			// this.setBoolean( gamepad, "rt", 7)
			// this.setBoolean( gamepad, "select", 8)
			// this.setBoolean( gamepad, "start", 9)
			// this.setBoolean( gamepad, "ls", 10)
			// this.setBoolean( gamepad, "rs", 11)
			// this.setBoolean( gamepad, "dup", 12)
			// this.setBoolean( gamepad, "ddown", 13)
			// this.setBoolean( gamepad, "dleft", 14)
			// this.setBoolean( gamepad, "dright", 15)

			// this.a = !!gamepad.buttons[0].value
			// this.b = !!gamepad.buttons[1].value
			// this.x = !!gamepad.buttons[2].value
			// this.y = !!gamepad.buttons[3].value
			// this.lb = !!gamepad.buttons[4].value
			// this.rb = !!gamepad.buttons[5].value
			// this. lt = !!gamepad.buttons[6].value
			// this.rt = !!gamepad.buttons[7].value
			// this.select = !!gamepad.buttons[8].value
			// this.start = !!gamepad.buttons[9].value
			// this.ls = !!gamepad.buttons[10].value
			// this.rs = !!gamepad.buttons[11].value
			// this.dup = !!gamepad.buttons[12].value
			// this.ddown = !!gamepad.buttons[13].value
			// this.dleft = !!gamepad.buttons[14].value
			// this.dright = !!gamepad.buttons[15].value

		}else{
			//console.log(this.available, "failing to update gamepad data", this.gamepad)
		}
    }
  }