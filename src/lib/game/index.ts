import { arrayWith } from "$lib/utils"
import type { IApplicationOptions } from "pixi.js"

export function createGame(PIXI: typeof import("pixi.js"), options?: IApplicationOptions) {
	PIXI.settings.ROUND_PIXELS = true

	const app = new PIXI.Application(options)
	const { stage, view } = app

	const indicators = arrayWith(5, () => {
		const indicator = new PIXI.Graphics()
		indicator.beginFill(0xee55).drawCircle(0, 0, 15)
		stage.addChild(indicator)
		indicator.position.set(-100, -100)
		return indicator
	})

	function handleTouches(e: TouchEvent) {
		Array.from(e.touches).forEach((touch, i) => {
			const indicator = indicators[i]
			indicator.visible = true
			indicator.position.set(touch.clientX, touch.clientY)
		})
		indicators.slice(e.touches.length).forEach(indicator => (indicator.visible = false))
	}

	function handleEnd(e: TouchEvent) {
		indicators.forEach(indicator => (indicator.visible = false))
	}

	view.addEventListener("touchstart", handleTouches)
	view.addEventListener("touchmove", handleTouches)
	view.addEventListener("touchend", handleEnd)

	return {
		destroy() {
			app.destroy(false, true)
			view.removeEventListener("touchstart", handleTouches)
			view.removeEventListener("touchmove", handleTouches)
			view.removeEventListener("touchend", handleEnd)
		},
	}
}
