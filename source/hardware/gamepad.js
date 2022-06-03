
const getGamePads = () => navigator.getGamepads || navigator.webkitGetGamepads
export default class GamePad {

	gamePadIndex

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

    constructor( gamePadId=0 ) {
      
      this.connected = false
	  this.gamePadIndex = gamePadId
      
      window.addEventListener("gamepadconnected", e => this.connect(e) )
      window.addEventListener("gamepaddisconnected", e => this.disconnect(e) )
    }

	addEventListener( eventType, callback ) {

	}
    
    connect(e) {
		const gamepad = e.originalEvent.gamepad || e.gamepad
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			gamepad.index, gamepad.id,
			gamepad.buttons.length, gamepad.axes.length)
		// check to see if this is the right id...
		if (gamepad.index === this.gamePadIndex){
			this.connected = true
			console.log(this.connected)
		}
    }
    
    disconnect(e) {
		const gamepad = e.originalEvent.gamepad || e.gamepad
		console.log("Gamepad disconnected from index %d: %s",
		gamepad.index, gamepad.id)
		if (gamepad.index === this.gamePadIndex){
			this.connected = false
			console.log(this.connected)
		}
    }
    
    update() {
		
		let gamepad = getGamepads()[this.gamePadIndex]
  
    	if (gamepad && this.connected) {
			this.a = !!gamepad.buttons[0].value
			this.b = !!gamepad.buttons[1].value
			this.x = !!gamepad.buttons[2].value
			this.y = !!gamepad.buttons[3].value
			this.lb = !!gamepad.buttons[4].value
			this.rb = !!gamepad.buttons[5].value
			this. lt = !!gamepad.buttons[6].value
			this.rt = !!gamepad.buttons[7].value
			this.select = !!gamepad.buttons[8].value
			this.start = !!gamepad.buttons[9].value
			this.ls = !!gamepad.buttons[10].value
			this.rs = !!gamepad.buttons[11].value
			this.dup = !!gamepad.buttons[12].value
			this.ddown = !!gamepad.buttons[13].value
			this.dleft = !!gamepad.buttons[14].value
			this.dright = !!gamepad.buttons[15].value

			this.leftstickX = gamepad.axes[0]
			this.leftstickY = gamepad.axes[1]
			this.rightstickX = gamepad.axes[2]
			this.rightstickY = gamepad.axes[3]
		}
    }
  }