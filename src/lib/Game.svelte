<script lang="ts">
	import Healthbar from "$lib/Healthbar.svelte"
	import { usePIXI } from "$lib/utils/svelte"
	import type { IApplicationOptions } from "pixi.js"
	import { createGame } from "$lib/game"

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

<div class="relative">
	<div id="ui" class="absolute top-0 left-0 right-0 bottom-0 flex flex-col pointer-events-none">
		<Healthbar current={3} maximum={7} />
		<div class="my-auto" />
		<Healthbar current={9} maximum={14} role="player" />
	</div>
	<canvas bind:this={view} />
</div>
