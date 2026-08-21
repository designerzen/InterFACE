/** @jest-environment jsdom */

import { setupDraggableFeedback } from "../source/dom/text.js"

const dispatchPointerEvent = (element, type, properties) => {
	const event = new Event(type, { bubbles:true, cancelable:true })
	Object.assign(event, properties)
	element.dispatchEvent(event)
	return event
}

describe("feedback dragging", () => {
	test("moves vertically and remains inside the viewport", () => {
		const feedback = document.createElement("p")
		feedback.id = "feedback"
		document.body.appendChild(feedback)

		Object.defineProperty(window, "innerHeight", {
			configurable:true,
			value:500
		})
		feedback.getBoundingClientRect = jest.fn(() => ({
			top:100,
			height:50
		}))
		feedback.setPointerCapture = jest.fn()
		feedback.hasPointerCapture = jest.fn(() => true)
		feedback.releasePointerCapture = jest.fn()

		const removeDragControls = setupDraggableFeedback(feedback)

		dispatchPointerEvent(feedback, "pointerdown", {
			pointerId:7,
			isPrimary:true,
			button:0,
			clientY:125
		})
		dispatchPointerEvent(feedback, "pointermove", {
			pointerId:7,
			clientY:490
		})

		expect(feedback.style.top).toBe("450px")
		expect(feedback.style.bottom).toBe("auto")
		expect(feedback.classList.contains("dragging")).toBe(true)

		dispatchPointerEvent(feedback, "pointermove", {
			pointerId:7,
			clientY:0
		})
		expect(feedback.style.top).toBe("0px")

		dispatchPointerEvent(feedback, "pointerup", { pointerId:7 })
		expect(feedback.classList.contains("dragging")).toBe(false)
		expect(feedback.releasePointerCapture).toHaveBeenCalledWith(7)

		removeDragControls()
	})
})
