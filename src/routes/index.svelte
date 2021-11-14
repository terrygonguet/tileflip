<script lang="ts">
	import Game from "$lib/Game.svelte"
	import { onMount } from "svelte"

	let displayGame = false

	function goFullscreen() {
		const el = document.querySelector("#svelte")
		el?.requestFullscreen()
	}

	function onFullscreenChange() {
		displayGame = !!document.fullscreenElement
	}

	onMount(() => {
		if (!document.fullscreenEnabled || document.fullscreenElement) return (displayGame = true)
	})
</script>

<svelte:window on:fullscreenchange={onFullscreenChange} />

{#if displayGame}
	<Game />
{:else}
	<main class="min-h-screen flex flex-col items-center justify-center">
		<button class="px-3 py-2 bg-green-700 text-white uppercase" on:click={goFullscreen}
			>Go fullscreen</button
		>
	</main>
{/if}
