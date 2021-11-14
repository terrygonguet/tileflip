import { onMount } from "svelte"

function usePIXI(mount: (PIXI: typeof import("pixi.js")) => (() => void) | void) {
	onMount(() => {
		let destroy: ReturnType<typeof mount> = undefined
		import("pixi.js").then(PIXI => (destroy = mount(PIXI)))
		return () => destroy?.()
	})
}

export { usePIXI }
