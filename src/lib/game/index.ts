import type { IApplicationOptions, InteractionEvent, DisplayObject } from "pixi.js"
import { height as healthbarHeight } from "$lib/Healthbar.svelte"

export function createGame(PIXI: typeof import("pixi.js"), options?: IApplicationOptions) {
	PIXI.settings.ROUND_PIXELS = true

	const app = new PIXI.Application(options)
	const { stage, ticker } = app
	let prevInnerWidth = 0
	let prevInnerHeight = 0

	const divider = new PIXI.Graphics()
	const wheel = new PIXI.Graphics()

	ticker.add(() => {
		const innerSpace = innerHeight - 2 * healthbarHeight
		const enemySection = {
			start: healthbarHeight,
			end: healthbarHeight + innerSpace / 2.5,
		}
		const playerSection = {
			start: enemySection.end,
			end: innerHeight - healthbarHeight,
		}
		const areaCenter = new PIXI.Point(
			0.5 * innerWidth,
			(playerSection.start + playerSection.end) / 2,
		)

		if (innerWidth != prevInnerWidth || innerHeight != prevInnerHeight) {
			divider
				.clear()
				.lineStyle(2, 0xffffff)
				.moveTo(-innerWidth / 2.15, 0)
				.lineTo(innerWidth / 2.15, 0)
			const areaRadius = 0.35 * innerWidth
			const areaLineWidth = 0.03 * innerWidth
			wheel
				.clear()
				.lineStyle(areaLineWidth, 0x834516)
				.arc(0, 0, areaRadius, -Math.PI / 6, Math.PI / 2)
				.lineStyle(areaLineWidth, 0x047756)
				.arc(0, 0, areaRadius, Math.PI / 2, (-5 / 6) * Math.PI)
				.lineStyle(areaLineWidth, 0xba1c1c)
				.arc(0, 0, areaRadius, (-5 / 6) * Math.PI, -Math.PI / 6)
			prevInnerWidth = innerWidth
			prevInnerHeight = innerHeight
		}

		divider.position.set(innerWidth / 2, enemySection.end)
		stage.addChild(divider)
		areaCenter.copyTo(wheel.position)
		stage.addChild(wheel)
	})

	return {
		destroy() {
			app.destroy(false, true)
		},
	}
}
