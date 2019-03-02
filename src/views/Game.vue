<template>
  <div class="game flex flex-col items-center justify-between select-none">
    <ButtonFullScreen class="absolute m-4 pin-t pin-r"/>
    <div class="p-2 text-center">
      <a class="no-underline text-up font-bold" @click="$router.go(-1)">Back</a>
      <h1 class="neon m-4">
        <span class="neon-glow">Score:</span>
        {{ score | round }}
      </h1>
    </div>
    <div>
      <div v-if="started" class="p-2 flex justify-between">
        <span class="text-2xl font-bold neon">X{{ combo }}</span>
        <span class="text-2xl">{{ "🧡".repeat(lives) }}</span>
      </div>
      <TheArena @score="scorePoints" @mistake="mistake" @gameover="endgame" ref="arena">
        <div class="pin absolute flex justify-center items-center" v-if="!started">
          <button class="btn m-2 font-bold text-2xl" @click="start">Start</button>
        </div>
      </TheArena>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import TheArena from "@/components/TheArena.vue"
import ButtonFullScreen from "@/components/ButtonFullScreen.vue"
import { ScoreEvent } from "@/tools"
import levelManager from "@/plugins/levelManager"

export default Vue.extend({
  name: "game",
  props: {
    level: String,
  },
  data() {
    return {
      score: 0,
      chain: 0,
      gameover: false,
      started: false,
      lives: 3,
    }
  },
  components: {
    TheArena,
    ButtonFullScreen,
  },
  computed: {
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
      this.levelManager.setLevel(this.level)

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
      this.$root.$emit("toast", {
        message: "GAME OVER",
        duration: 1,
        size: 3,
      })

      try {
        let installPrompt = this.getInstallPrompt()
        installPrompt.prompt()
        installPrompt.userChoice
          .then((install: boolean) => {
            console.log("Installed to home screen: " + install)
          })
          .catch(console.error)
      } catch (e) {}
    },
  },
  watch: {
    combo(val, old) {
      this.$root.$emit("toast", {
        message: val > old ? "COMBO X" + val : "COMBO RESET",
        duration: 0.7,
        size: 1,
      })
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
