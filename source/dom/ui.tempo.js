import {tapTempo} from '../timing/tap-tempo.js' 

import ROLLING_WORKER_URI from 'url:../timing/timing.rolling.worker.js'
import SETINERVAL_WORKER_URI from 'url:../timing/timing.setinterval.worker.js'
import SETTIMEOUT_WORKER_URI from 'url:../timing/timing.settimeout.worker.js'

import { MOUSE_REPEATING, addMouseRepeaterEvents } from '../hardware/mouse.js'

export const setupTempoInterface = (timer, midiManager, MIDIConnectionClasses, onTimerChanged ) => {
		
	let clockSource
	let midiOutput

	//- audio(src="./assets/audio/metronome.wav")#audio-sample-metronome
	//- const elementMetronome = document.getElementById('audio-sample-metronome')

	const outputMIDIInputs = document.getElementById('midi-inputs-output')
	const outputMIDIOutputs = document.getElementById('midi-outputs-output')

	const outputBeat = document.getElementById('timing-beat-output')
	const outputBar = document.getElementById('timing-bar-output')
	const output = document.getElementById('timing-events-output')
	const outputTempoDrift = document.getElementById('tempo-drift-output')
	const outputTempoLag = document.getElementById('tempo-lag-output')
	const outputTimerElapsed = document.getElementById('timer-elapsed-output') 

	const timingProgress = document.getElementById('timing-progress') 
	const timingFeedback = document.getElementById('timing-feedback') 
	
	let interval

	let estimatedTempo
	const estimateTempoFromTap = () => {
		if (!estimatedTempo)
		{
			estimatedTempo = tapTempo()
		}
		const estimated = estimatedTempo()
		const { accuratePeriod, period, bpm } = estimated

		if (estimated.available)
		{
			const rounded = parseInt(bpm)
			timer.BPM = rounded
			inputTempoRange.value = rounded
			inputTempoField.value = rounded
			onTimerChanged && onTimerChanged( timer.BPM )
			// console.info("Tempo", {estimated,  accuratePeriod, period, rounded, bpm} )
			return rounded
		}else{
			//keep tappin!
			return null
		}
	}

	const onMIDIClockEvent = event => {
		if ( timer.divisionsElapsed === 0)
		{
			estimateTempoFromTap()
		}
// timer.isRunning &&
		console.info("External>MIDI>CLOCK:Devices", {event, timer} )

		// TODO: Retreive clock event and proxy it to the Timer...
		timer.externalTrigger( timer.now )
	}
	
	/**
	 * 
	 * @param {Input} inputPort 
	 */
	const trackPort = (inputPort=null) => {

		if (clockSource)
		{
			// unlisten
			clockSource.removeListener("clock", onMIDIClockEvent)
		}

		const isInternal = !inputPort
		if (!isInternal)
		{
			const trigger = timer.bypass(true)

			// listen
			clockSource = inputPort
			clockSource.addListener("clock", onMIDIClockEvent)

			// test
			interval = setInterval( onMIDIClockEvent, 200 )
			
			timingFeedback.innerText = `Synched to ${inputPort.id}`

			// update ui to prevent tempo input
			document.querySelector(".form-tempo").setAttribute("disabled", true )
	
		}else{

			clearInterval(interval)

			// return to internal clock
			timer.bypass(false)
			clockSource = null
			timingFeedback.innerText = `Internal Clock`
			
			// update ui to prevent tempo input
			document.querySelector(".form-tempo").removeAttribute("disabled")
		}	

	}

	const inputTempoReset = document.getElementById('tempo-reset')
	inputTempoReset.onmousedown = e => {
		timer.BPM = 100
		timer.bar = 0
		inputTempoRange.value = inputTempoField.value = timer.BPM
		onTimerChanged && onTimerChanged( timer.BPM )
	}

	const inputTempoIncrease = document.getElementById('tempo-increase-button')
	const increaseTempo = (event, details) => {
		const bpm = Math.ceil(timer.BPM + 1)
		timer.BPM = bpm
		inputTempoRange.value = bpm
		inputTempoField.value = bpm
		onTimerChanged && onTimerChanged( timer.BPM )
		// console.log("increase", bpm, {timer})
	}
	// inputTempoIncrease.onmousedown = increaseTempo
	addMouseRepeaterEvents(inputTempoIncrease)
	inputTempoIncrease.addEventListener(MOUSE_REPEATING, increaseTempo)


	const inputTempoDecrease = document.getElementById('tempo-decrease-button')
	const decreaseTempo = (event, details) => {
		const bpm = Math.max( 1,  Math.round(timer.BPM - 1) )
		timer.BPM = bpm
		inputTempoRange.value = bpm
		inputTempoField.value = bpm
		onTimerChanged && onTimerChanged( timer.BPM )
	}
	// inputTempoDecrease.onmousedown = decreaseTempo
	addMouseRepeaterEvents(inputTempoDecrease)
	inputTempoDecrease.addEventListener(MOUSE_REPEATING, decreaseTempo)


	const inputTempoTap = document.getElementById('tempo-tap-button')
	inputTempoTap.onmousedown = e => {
		const estimatedTempo = estimateTempoFromTap()
		if (estimatedTempo)
		{
			
		}
	}

	const inputTempoStep = document.getElementById('timing-step')
	inputTempoStep.setAttribute( "max", timer.totalBars )
	inputTempoStep.oninput = e => {
		const step = parseInt(inputTempoStep.value)
		console.log("step to", step, inputTempoStep.value, typeof inputTempoStep.value)
		timer.bar = step
		onTimerChanged && onTimerChanged( timer.BPM )
	}

	const inputTempoField = document.getElementById('tempo-input-text')
	inputTempoField.value = timer.BPM

	// console.error("Setting tempo panel BPM", timer.BPM, inputTempoField.value  )

	// inputTempoField.onmousedown = e => {
	// 	estimateTempoFromTap()
	// }
	//- inputTempoField.onchange = e => {
	inputTempoField.oninput = e => {
		e.preventDefault()
		console.log("tempo BPM request to", inputTempoField.value)
		timer.BPM = inputTempoField.value
		inputTempoRange.value = timer.BPM.toFixed(1)
		onTimerChanged && onTimerChanged( timer.BPM )
	}

	inputTempoField.onkeydown = e => {
		// return
		if(e.which === 13)
		{
			e.preventDefault()
			timer.BPM = inputTempoField.value
			inputTempoRange.value = timer.BPM.toFixed(1)
			onTimerChanged && onTimerChanged( timer.BPM )
			return false
		}
	}

	const inputTempoRange = document.getElementById('tempo-input-range')
	inputTempoRange.value = timer.BPM
	inputTempoRange.oninput = e => {
		console.log("tempo request to", inputTempoRange.value)
		timer.BPM = inputTempoRange.value
		inputTempoField.value = timer.BPM.toFixed(1)
		onTimerChanged && onTimerChanged( timer.BPM )
	}

	const inputClockSelector = document.getElementById('tempo-clock-select')
	inputClockSelector.onchange = e => {

		switch(inputClockSelector.value)
		{
			case "Internal clock":
				console.warn("Clock changed to INTERNAL", e )
				trackPort(null)
				break

			default: 
				const id = inputClockSelector.value //.split("-")
				const input = midiManager.inputs[id] 
				// if clock is specified to follow
				// const input = inputClockSelector.options[id] 
				trackPort(input)
				console.warn("Watching for external Clock change", e, inputClockSelector.value, {id, input, inputClockSelector} )
		}
	}

	const inputTempoWorker = document.getElementById('tempo-worker')
	inputTempoWorker.onchange = e => {
		//console.log("tempo worker",inputTempoWorker, inputTempoWorker.value)
		switch(inputTempoWorker.value)
		{
			case "SetTimeOut Loop":
				timer.setTimingWorker(SETTIMEOUT_WORKER_URI)
				break

			case "SetInterval Loop":
				timer.setTimingWorker(SETINERVAL_WORKER_URI)
				break

			case "SetTimeOut Rolling":
				timer.setTimingWorker(ROLLING_WORKER_URI)
				break
		}
	}

	/*
	timer.setCallback( ( values )=>{
		const { 
			divisionsElapsed,
			bar, bars, 
			barsElapsed, timePassed, 
			expected, drift, level, intervals, lag} = values

		//- console.info({ 
		//- 	divisionsElapsed,
		//- 	bar, bars, 
		//- 	barsElapsed, timePassed, 
		//- 	elapsed, expected, drift, level, intervals, lag} )

		// output.innerText = `TimePerBar:${timer.timePerBar.toFixed(2)} TimePerBetween:${timer.timeBetween.toFixed(2)}` 

		const BPM = timer.BPM
		const index = divisionsElapsed / 24

		output.innerText = `BPM:${BPM.toFixed(0)} intervals:${intervals.toFixed(2)}` 

		outputTempoDrift.innerText = `drift:${drift.toFixed(2)} `
		outputTempoLag.innerText = `lag:${lag.toFixed(2)} level:${level.toFixed(2)} ` 
		outputBeat.innerText = `Note: ${divisionsElapsed+1}/${timer.totalDivisions} Bar: ${bar+1}/${bars}`
		outputBar.innerText = `${100 * timer.barProgress.toFixed(2)}% Bars: ${barsElapsed}`	
		outputTimerElapsed.innerText = `Time Elapsed: ${timer.timeElapsed.toFixed(2)} total: ${timer.totalTime}`	

		inputTempoField.value = BPM
		inputTempoRange.value = BPM
		inputTempoStep.value = bar + 1

		timingProgress.setAttribute("value", timer.barProgress)

		timerCallback && timerCallback(values)
	})*/


	/**
	 * 
	 * @param {*} outputs 
	 * @param {*} inputs 
	 * @param {*} event 
	 * @param {*} updates 
	 */
	const onMIDIDeviceListUpdated = (outputs, inputs, event, updates) => {
		//- updateMIDIDevicesStatus(outputs, inputs, event) ick first output unless one has been specified

		//- midiManager.outputs.forEach( output => midiPorts.set( output.id, output ) )
		console.error("Main>MIDI registered:Devices", {outputs, inputs, event, updates } )

		// send the clock out to these devices
		midiManager.outputs.forEach( output => {

		})

		// TODO: only add / remove 
		// updates
		while (inputClockSelector.options.length > 1 ){
			inputClockSelector.options[1].remove()
		}

		// connect to a MIDI input's clock
		midiManager.inputs.forEach( (input, index) => {
			//inputClockSelector.options[input.id] = new Option(`${input.manufacturer} - ${input.name} ${input.id}`)
			inputClockSelector.add(new Option(`${input.manufacturer} - ${input.name} ${input.id}`, index ))
		})

		// convert them into a nice format
		const refine = (midiPort) => `${midiPort.id} ${midiPort.manufacturer} - ${midiPort.name}` 
		outputMIDIInputs.innerHTML = `<span class="midi-input">${midiManager.inputs.map(refine).join('</span><span class="midi-input">')}</span>`
		outputMIDIOutputs.innerHTML = `<span class="midi-output">${midiManager.outputs.map(refine).join(",")}</span>`
	}

	// -- add some midi
	const connectMIDI = async () => {
		const midiConnections = await midiManager.enable(MIDIConnectionClasses, onMIDIDeviceListUpdated)
		//- const midiConnections = await midiManager.enable(MIDIConnectionClasses, onMIDIDeviceListUpdated)
		console.info("Main>MIDI:Devices", {midiConnections, midiManager, onMIDIDeviceListUpdated} )
	}

	const disconnectMIDI = () => {
		clockSource = null
		// update ui to prevent tempo input
		document.querySelector(".form-tempo").removeAttribute("disabled")
	}

	const inputTimerEnableCheckbox = document.getElementById("timer-toggle")
	inputTimerEnableCheckbox.onchange = e =>{
		if (inputTimerEnableCheckbox.checked)
		{	
			timer.startTimer()
		}else{
			timer.stopTimer()
		}
	}

	const inputMIDICheckbox = document.getElementById("tempo-midi-synch")
	inputMIDICheckbox.onchange = e =>{
		if (inputMIDICheckbox.checked)
		{
			connectMIDI()
		}else{
			disconnectMIDI()
		}
	}

	if (inputTimerEnableCheckbox.checked)
	{
		timer.startTimer()
	}

	let numberSequence = ""
	window.addEventListener("keydown", event => {
		const isNumber = !isNaN( parseInt(event.key) )
		const focussedElement = document.activeElement
		switch(focussedElement.nodeName)
		{
			case "INPUT":
				break
			default:
				if (isNumber)
				{
					numberSequence += event.key
					// now check to see if it is 3 numbers long
					if (numberSequence.length === 3)
					{
						const tempo = parseInt(numberSequence)
						timer.BPM = tempo
						// reset
						numberSequence = ''
					}

				}else{
					numberSequence = ''
				}
		}
	})
}