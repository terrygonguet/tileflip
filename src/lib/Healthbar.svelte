<script lang="ts">
	export let current: number
	export let maximum: number
	export let role: "enemy" | "player" = "enemy"

	const colors = {
		enemy: {
			full: "rgb(185, 28, 28)",
			empty: "rgb(109, 24, 24)",
		},
		player: {
			full: "rgb(4, 120, 87)",
			empty: "rgb(6, 65, 50)",
		},
	}

	$: cur = Math.floor(Math.min(current, maximum))
	$: max = Math.floor(Math.max(current, maximum))
	$: lost = max - cur
	$: full = colors[role].full
	$: empty = colors[role].empty
</script>

<div class="border-[3px] p-1 flex gap-1 m-3 overflow-hidden">
	{#each Array(cur) as _}
		<div
			style="border-color:{full};background-color:{full}"
			class="border-2 flex-1 h-3 transition-colors"
		/>
	{/each}
	{#each Array(lost) as _}
		<div
			style="border-color:{empty};background-color:transparent"
			class="border-2 flex-1 h-3 transition-colors"
		/>
	{/each}
</div>
