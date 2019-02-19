<template>
  <div class="flex flex-col items-center justify-between">
    <h1>Score: {{ score }}</h1>
    <h1 v-if="gameover">GAME OVER</h1>
    <button
      class="text-black rounded px-4 py-2"
      style="background-color: var(--color-up)"
      @click="start"
    >Start</button>
    <Arena @score="score += $event" @gameover="gameover = true" ref="arena"></Arena>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Arena from "../components/Arena.vue"

export default Vue.extend({
  name: "game",
  data() {
    return {
      score: 0,
      gameover: false,
    }
  },
  components: {
    Arena,
  },
  methods: {
    start() {
      this.score = 0
      this.gameover = false
      const arena = this.$refs.arena as Vue
      arena.$emit("start")
    },
  },
})
</script>
