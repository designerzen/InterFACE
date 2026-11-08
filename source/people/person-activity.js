import { clamp } from "../maths/maths.js"

const DEFAULT_SMOOTHING_WINDOW = 180
const DEFAULT_ACTIVE_THRESHOLD = 0.15

const finiteValue = value => Number.isFinite(value) ? value : 0

const averageDelta = (current, previous, properties) => properties.reduce(
	(total, property) => total + Math.abs(current[property] - previous[property]),
	0
) / properties.length

export default class PersonActivity{

	#options
	#values
	#lastSampleAt
	#lastSnapshot
	#notes

	get currentActivity(){ return this.#values.currentActivity }
	get sessionActivity(){ return this.#values.sessionActivity }
	get currentPositionActivity(){ return this.#values.currentPositionActivity }
	get sessionPositionActivity(){ return this.#values.sessionPositionActivity }
	get currentOrientationActivity(){ return this.#values.currentOrientationActivity }
	get sessionOrientationActivity(){ return this.#values.sessionOrientationActivity }
	get currentScaleActivity(){ return this.#values.currentScaleActivity }
	get sessionScaleActivity(){ return this.#values.sessionScaleActivity }
	get currentExpressionActivity(){ return this.#values.currentExpressionActivity }
	get sessionExpressionActivity(){ return this.#values.sessionExpressionActivity }
	get peakActivity(){ return this.#values.peakActivity }
	get activeDuration(){ return this.#values.activeDuration }
	get activeRatio(){ return this.sessionDuration > 0 ? this.activeDuration / this.sessionDuration : 0 }
	get sessionDuration(){ return this.#values.sessionDuration }
	get sampleCount(){ return this.#values.sampleCount }
	get positionTravelled(){ return this.#values.positionTravelled }
	get orientationTravelled(){ return this.#values.orientationTravelled }
	get scaleTravelled(){ return this.#values.scaleTravelled }
	get expressionTravelled(){ return this.#values.expressionTravelled }
	get lastSampleAt(){ return this.#lastSampleAt }
	get winks(){ return this.leftWinks + this.rightWinks }
	get leftWinks(){ return this.#values.leftWinks }
	get rightWinks(){ return this.#values.rightWinks }
	get blinks(){ return this.#values.blinks }
	get mouthOpenings(){ return this.#values.mouthOpenings }
	get expressionChanges(){ return this.#values.expressionChanges }
	get notesPlayed(){ return this.#values.notesPlayed }
	get uniqueNotesPlayed(){ return this.#notes.size }
	get lowestNotePlayed(){ return this.uniqueNotesPlayed > 0 ? this.#values.lowestNotePlayed : null }
	get highestNotePlayed(){ return this.uniqueNotesPlayed > 0 ? this.#values.highestNotePlayed : null }
	get noteRange(){
		return this.uniqueNotesPlayed > 0 ? this.highestNotePlayed - this.lowestNotePlayed : 0
	}

	constructor(options={}){
		this.#options = options
		this.reset()
	}

	reset(){
		this.#notes = new Set()
		this.#values = {
			currentActivity:0,
			sessionActivity:0,
			currentPositionActivity:0,
			sessionPositionActivity:0,
			currentOrientationActivity:0,
			sessionOrientationActivity:0,
			currentScaleActivity:0,
			sessionScaleActivity:0,
			currentExpressionActivity:0,
			sessionExpressionActivity:0,
			peakActivity:0,
			activeDuration:0,
			sessionDuration:0,
			sampleCount:0,
			positionTravelled:0,
			orientationTravelled:0,
			scaleTravelled:0,
			expressionTravelled:0,
			leftWinks:0,
			rightWinks:0,
			blinks:0,
			mouthOpenings:0,
			expressionChanges:0,
			notesPlayed:0,
			lowestNotePlayed:Infinity,
			highestNotePlayed:-Infinity
		}
		this.#lastSampleAt = -1
		this.#lastSnapshot = null
		return this
	}

	#createSnapshot(prediction){
		const xMin = finiteValue(prediction?.box?.xMin)
		const xMax = finiteValue(prediction?.box?.xMax)
		const yMin = finiteValue(prediction?.box?.yMin)
		const yMax = finiteValue(prediction?.box?.yMax)

		return {
			centerX:(xMin + xMax) * 0.5,
			centerY:(yMin + yMax) * 0.5,
			width:Math.max(xMax - xMin, 0),
			height:Math.max(yMax - yMin, 0),
			yaw:finiteValue(prediction?.yaw),
			pitch:finiteValue(prediction?.pitch),
			roll:finiteValue(prediction?.roll),
			mouthRatio:finiteValue(prediction?.mouthRatio),
			mouthPucker:finiteValue(prediction?.mouthPucker),
			happiness:finiteValue(prediction?.happiness),
			eyebrowsRaisedBy:finiteValue(prediction?.eyebrowsRaisedBy),
			leftEyebrowRaisedBy:finiteValue(prediction?.leftEyebrowRaisedBy),
			rightEyebrowRaisedBy:finiteValue(prediction?.rightEyebrowRaisedBy),
			leftEyeClosed:Boolean(prediction?.leftEyeClosed),
			rightEyeClosed:Boolean(prediction?.rightEyeClosed),
			mouthOpen:Boolean(
				prediction?.isMouthOpen ??
				finiteValue(prediction?.mouthRatio) > (this.#options.mouthCutOff ?? 0.1)
			)
		}
	}

	update(prediction, timeNow=prediction?.time ?? 0){
		const snapshot = this.#createSnapshot(prediction)
		const sampleTime = Number.isFinite(timeNow) ? timeNow : 0

		if (!this.#lastSnapshot)
		{
			this.#lastSnapshot = snapshot
			this.#lastSampleAt = sampleTime
			this.#values.sampleCount = 1
			return this.currentActivity
		}

		const elapsed = Math.max(sampleTime - this.#lastSampleAt, 0)
		const previous = this.#lastSnapshot
		const faceScale = Math.max(
			(snapshot.width + snapshot.height + previous.width + previous.height) * 0.25,
			0.001
		)
		const positionDelta = Math.hypot(
			snapshot.centerX - previous.centerX,
			snapshot.centerY - previous.centerY
		) / faceScale
		const orientationDelta = averageDelta(snapshot, previous, ["yaw", "pitch", "roll"])
		const currentFaceScale = Math.max(snapshot.width + snapshot.height, 0.001)
		const previousFaceScale = Math.max(previous.width + previous.height, 0.001)
		const scaleDelta = Math.abs(Math.log(currentFaceScale / previousFaceScale))
		const expressionDelta = averageDelta(snapshot, previous, [
			"mouthRatio",
			"mouthPucker",
			"happiness",
			"eyebrowsRaisedBy",
			"leftEyebrowRaisedBy",
			"rightEyebrowRaisedBy"
		])
		this.#trackFaceEvents(snapshot, previous, expressionDelta)

		const rawPositionActivity = clamp(positionDelta * 1.2, 0, 1)
		const rawOrientationActivity = clamp(orientationDelta * 1.1, 0, 1)
		const rawScaleActivity = clamp(scaleDelta * 0.8, 0, 1)
		const rawExpressionActivity = clamp(expressionDelta * 1.4, 0, 1)
		const rawActivity = clamp(
			rawPositionActivity +
			rawOrientationActivity +
			rawScaleActivity +
			rawExpressionActivity,
			0,
			1
		)
		const smoothingWindow = Math.max(this.#options.activitySmoothingWindowMs ?? DEFAULT_SMOOTHING_WINDOW, 1)
		const smoothing = clamp(elapsed / smoothingWindow, 0, 1)

		this.#updateMetric("Activity", rawActivity, elapsed, smoothing)
		this.#updateMetric("PositionActivity", rawPositionActivity, elapsed, smoothing)
		this.#updateMetric("OrientationActivity", rawOrientationActivity, elapsed, smoothing)
		this.#updateMetric("ScaleActivity", rawScaleActivity, elapsed, smoothing)
		this.#updateMetric("ExpressionActivity", rawExpressionActivity, elapsed, smoothing)

		this.#values.sessionDuration += elapsed
		this.#values.peakActivity = Math.max(this.peakActivity, this.currentActivity)
		if (this.currentActivity >= (this.#options.activityActiveThreshold ?? DEFAULT_ACTIVE_THRESHOLD))
		{
			this.#values.activeDuration += elapsed
		}
		this.#values.sampleCount++
		this.#values.positionTravelled += positionDelta
		this.#values.orientationTravelled += orientationDelta
		this.#values.scaleTravelled += scaleDelta
		this.#values.expressionTravelled += expressionDelta
		this.#lastSampleAt = sampleTime
		this.#lastSnapshot = snapshot

		return this.currentActivity
	}

	trackNote(noteNumber){
		if (!Number.isFinite(noteNumber))
		{
			return this.notesPlayed
		}

		this.#notes.add(noteNumber)
		this.#values.notesPlayed++
		this.#values.lowestNotePlayed = Math.min(this.#values.lowestNotePlayed, noteNumber)
		this.#values.highestNotePlayed = Math.max(this.#values.highestNotePlayed, noteNumber)
		return this.notesPlayed
	}

	toString(){
		return `PersonActivity(current:${this.currentActivity.toFixed(3)}, session:${this.sessionActivity.toFixed(3)}, peak:${this.peakActivity.toFixed(3)}, active:${(this.activeRatio * 100).toFixed(1)}%, winks:${this.winks}, blinks:${this.blinks}, mouthOpenings:${this.mouthOpenings}, notesPlayed:${this.notesPlayed}, uniqueNotes:${this.uniqueNotesPlayed})`
	}

	#trackFaceEvents(snapshot, previous, expressionDelta){
		const leftJustClosed = snapshot.leftEyeClosed && !previous.leftEyeClosed
		const rightJustClosed = snapshot.rightEyeClosed && !previous.rightEyeClosed
		const bothEyesJustClosed = snapshot.leftEyeClosed && snapshot.rightEyeClosed &&
			(!previous.leftEyeClosed || !previous.rightEyeClosed)

		if (bothEyesJustClosed)
		{
			if (previous.leftEyeClosed && !previous.rightEyeClosed)
			{
				this.#values.leftWinks = Math.max(this.leftWinks - 1, 0)
			}else if (previous.rightEyeClosed && !previous.leftEyeClosed){
				this.#values.rightWinks = Math.max(this.rightWinks - 1, 0)
			}
			this.#values.blinks++
		}else{
			if (leftJustClosed)
			{
				this.#values.leftWinks++
			}
			if (rightJustClosed)
			{
				this.#values.rightWinks++
			}
		}

		if (snapshot.mouthOpen && !previous.mouthOpen)
		{
			this.#values.mouthOpenings++
		}
		if (expressionDelta >= (this.#options.activityExpressionChangeThreshold ?? 0.1))
		{
			this.#values.expressionChanges++
		}
	}

	#updateMetric(name, rawValue, elapsed, smoothing){
		const currentName = `current${name}`
		const sessionName = `session${name}`
		const previousCurrent = this.#values[currentName]
		const previousDuration = this.sessionDuration
		const current = clamp(previousCurrent + (rawValue - previousCurrent) * smoothing, 0, 1)

		this.#values[currentName] = current
		this.#values[sessionName] = previousDuration + elapsed > 0 ?
			clamp((this.#values[sessionName] * previousDuration + current * elapsed) / (previousDuration + elapsed), 0, 1) :
			current
	}
}
