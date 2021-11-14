import type { IApplicationOptions, InteractionEvent, DisplayObject } from "pixi.js"

export function createGame(PIXI: typeof import("pixi.js"), options?: IApplicationOptions) {
	PIXI.settings.ROUND_PIXELS = true

	const app = new PIXI.Application(options)
	const { stage, renderer } = app
	const IM = new PIXI.InteractionManager(renderer)
	const indicators = new Map<number, DisplayObject>()

	function createIndicator() {
		const indicator = new PIXI.Graphics()
		indicator.beginFill(0xee55).drawCircle(0, 0, 15)
		stage.addChild(indicator)
		indicator.position.set(-100, -100)
		return indicator
	}

	IM.on("pointermove", (e: InteractionEvent) => {
		const indicator = indicators.get(e.data.pointerId) ?? createIndicator()
		e.data.global.copyTo(indicator.position)
		indicators.set(e.data.pointerId, indicator)
	})
	IM.on("pointerup", (e: InteractionEvent) => {
		const indicator = indicators.get(e.data.pointerId)
		indicator?.destroy()
		indicators.delete(e.data.pointerId)
	})

	return {
		destroy() {
			app.destroy(false, true)
			IM.destroy()
		},
	}
}
