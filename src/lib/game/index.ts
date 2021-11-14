import type { IApplicationOptions, InteractionEvent, DisplayObject } from "pixi.js"

export function createGame(PIXI: typeof import("pixi.js"), options?: IApplicationOptions) {
	PIXI.settings.ROUND_PIXELS = true

	const app = new PIXI.Application(options)
	const { stage, renderer } = app

	const areaRadius = 0.35 * innerWidth
	const areaLineWidth = 0.03 * innerWidth
	const areaCenter = new PIXI.Point(0.5 * innerWidth, innerHeight - areaRadius - 50)
	const wheel = new PIXI.Graphics()
	wheel
		.lineStyle(areaLineWidth, 0x834516)
		.arc(0, 0, areaRadius, -Math.PI / 6, Math.PI / 2)
		.lineStyle(areaLineWidth, 0x047756)
		.arc(0, 0, areaRadius, Math.PI / 2, (-5 / 6) * Math.PI)
		.lineStyle(areaLineWidth, 0xba1c1c)
		.arc(0, 0, areaRadius, (-5 / 6) * Math.PI, -Math.PI / 6)
	areaCenter.copyTo(wheel.position)
	stage.addChild(wheel)

	return {
		destroy() {
			app.destroy(false, true)
		},
	}
}
