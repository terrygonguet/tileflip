import { browser } from "$app/env"
import { readable } from "svelte/store"

const pixijs = readable<typeof import("pixi.js")>(undefined, set => {
	if (browser) import("pixi.js").then(lib => set(lib))
})

export { pixijs as PIXI }
