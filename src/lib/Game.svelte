<script lang="ts">
	import { usePIXI } from "$lib/utils/svelte"
	import type { IApplicationOptions } from "pixi.js"
	import { createGame } from "./game"

	export let resizeTo: IApplicationOptions["resizeTo"] = undefined

	let view: HTMLCanvasElement

	usePIXI(PIXI => {
		const game = createGame(PIXI, {
			autoStart: true,
			autoDensity: true,
			view,
			resizeTo: resizeTo ?? window,
			resolution: 2,
		})

		return () => game.destroy()
	})
</script>

<canvas bind:this={view} />

<style lang="postcss">
	canvas {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
