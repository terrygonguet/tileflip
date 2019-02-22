<template>
  <div class="game flex flex-col items-center justify-between select-none">
    <h1 class="neon">Score: {{ score | round }}</h1>
    <div>
      <p v-if="started" class="float-left text-2xl p-2 font-bold neon">COMBO X{{ combo }}</p>
      <p class="float-right text-2xl p-2">{{ "🧡".repeat(lives) }}</p>
      <Arena @score="scorePoints" @mistake="mistake" ref="arena">
        <div class="pin m-auto absolute flex justify-center items-center" v-if="!started">
          <button
            class="rounded px-4 py-2 color-button bg-button font-bold text-xl"
            @click="start"
          >Start</button>
        </div>
        <Toast
          :duration="toast.duration"
          @done="toastDone"
          class="pin absolute font-bold flex justify-center items-center neon"
          :class="toastSize"
          v-if="hasToast"
        >{{ toast.message }}</Toast>
      </Arena>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Arena, { ScoreEvent } from "../components/Arena.vue"
import Toast from "../components/Toast.vue"
import screenfull from "screenfull"
declare var process: any

if (screenfull) {
  screenfull.on("error", console.error)
} else {
  console.error("Fullscreen unavailable")
}

export default Vue.extend({
  name: "game",
  data() {
    return {
      score: 0,
      chain: 0,
      gameover: false,
      started: false,
      lives: 3,
      toast: {
        message: "",
        duration: 0,
        size: 0,
      },
    }
  },
  components: {
    Arena,
    Toast,
  },
  computed: {
    hasToast(): boolean {
      return !!(this.toast.message && this.toast.duration)
    },
    toastSize() {
      let size: number = this.toast.size
      return "text-" + (size > 1 ? size + "xl" : "xl")
    },
    combo(): number {
      return Math.floor(this.chain / 8) + 1
    },
  },
  methods: {
    start() {
      this.score = 0
      this.chain = 0
      this.gameover = false
      this.started = true
      this.lives = 3

      if (
        screenfull &&
        screenfull.enabled &&
        process.env.NODE_ENV !== "development"
      ) {
        screenfull.request()
      }

      const arena = this.$refs.arena as any
      arena.start()
    },
    scorePoints(e: ScoreEvent) {
      this.chain++
      let timeToSwipe = e.startTime - e.time
      this.score += 20 * (5 - timeToSwipe) * this.combo
    },
    mistake() {
      this.chain = 0
      this.lives--
      if (this.lives <= 0) {
        const arena = this.$refs.arena as any
        arena.stop()
        this.endgame()
      }
      this.$el.classList.remove("shake")
      ;(this.$el as HTMLElement).offsetWidth // trigger css reflow to restart animation
      this.$el.classList.add("shake")
    },
    endgame() {
      this.gameover = true
      this.started = false
      this.toast = {
        message: "GAME OVER",
        duration: 1,
        size: 3,
      }
    },
    toastDone() {
      this.toast = { message: "", duration: 0, size: 0 }
    },
  },
  watch: {
    combo(val, old) {
      this.toast = {
        message: val > old ? "COMBO UP" : "COMBO RESET",
        duration: 0.7,
        size: 1,
      }
    },
  },
  filters: {
    round(value: any) {
      if (!value) return 0
      let num = parseFloat(value)
      if (isNaN(num)) return 0
      else return Math.round(num)
    },
  },
})
</script>

<style lang="postcss">
.shake {
  animation: shake 0.07s linear 3;
}

@keyframes shake {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(-5px, 0);
  }
  66% {
    transform: translate(5px, 0);
  }
}
</style>
