<template>
  <canvas ref="canvas" id="arena" @touchmove.prevent></canvas>
</template>

<script lang="ts">
import Vue from "vue"
import Game from "@/game/game"

let game: Game
export default Vue.extend({
  name: "TheArenaCanvas",
  mounted() {
    game = new Game(this.$refs.canvas as HTMLCanvasElement)
    game.events.addEventListener("mistake", () => this.$emit("mistake"))
    game.events.addEventListener("score", e =>
      this.levelManager.scorePoints({ n: 0, startTime: 0, time: 0 })
    )
    console.log("game :", game)
  },
  destroyed() {
    game.destroy()
  }
})
</script>

