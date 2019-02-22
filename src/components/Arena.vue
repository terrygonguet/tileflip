<template>
  <div id="arena" class="overflow-hidden relative">
    <Toast
      :duration="toast.duration"
      @done="toastDone"
      v-if="hasToast"
      class="absolute pin-t text-center p-8 text-2xl font-bold w-full neon"
    >{{ toast.message }}</Toast>
    <TapSquare
      v-for="(square, id) in squares"
      :key="id"
      :does-tick="square.doesTick"
      :direction="square.direction"
      :start-time="square.startTime"
      @swiped="swiped(id, $event)"
      @outofview="clear(id)"
      @timeout="timeout(id)"
      ref="squares"
    ></TapSquare>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Square, { SwipeEvent } from "./Square.vue"
import TapSquare from "./TapSquare.vue"
import Toast from "./Toast.vue"

type SquareData = {
  direction: string
  startTime: number
  doesTick: boolean
}

export type ScoreEvent = {
  n: number
  startTime: number
  time: number
}

export default Vue.extend({
  name: "arena",
  components: {
    Square,
    TapSquare,
    Toast,
  },
  data() {
    return {
      squares: {} as { [id: string]: SquareData },
      id: 0,
      raf: 0,
      oldTime: 0,
      playing: false,
      speed: 0,
      toast: {
        message: "",
        duration: 0,
      },
    }
  },
  computed: {
    startTime(): number {
      return 0.7 + 4.3 * 0.9 ** this.speed
    },
    hasToast(): boolean {
      return !!(this.toast.message && this.toast.duration)
    },
  },
  methods: {
    makeSquare() {
      this.$set(this.squares, this.id++, {
        direction: ["up", "down", "left", "right"][
          Math.floor(Math.random() * 4)
        ],
        startTime: this.startTime,
        doesTick: true,
      })
    },
    swiped(id: string, e: SwipeEvent) {
      if (e.correct) {
        let scoreEvt: ScoreEvent = {
          n: parseInt(id),
          startTime: e.startTime,
          time: e.time,
        }
        this.$emit("score", scoreEvt)
        if (this.id >= (this.speed + 1) * 10) {
          this.speedUp()
        }
      } else {
        this.$emit("mistake")
      }
      this.playing && this.makeSquare()
    },
    clear(id: string) {
      this.$delete(this.squares, id)
    },
    start() {
      this.id = 0
      this.oldTime = performance.now()
      this.raf = requestAnimationFrame(this.tick)
      this.playing = true
      this.speed = 0
      this.makeSquare()
    },
    stop() {
      cancelAnimationFrame(this.raf)
      for (const id in this.squares) {
        this.clear(id)
      }
      this.playing = false
    },
    timeout(id: string) {
      this.clear(id)
      this.$emit("mistake")
      this.playing && this.makeSquare()
    },
    speedUp() {
      this.speed++
      this.toast = {
        message: "SPEED UP",
        duration: 1.5,
      }
    },
    toastDone() {
      this.toast = { duration: 0, message: "" }
    },
    tick(time: number) {
      const delta = (time - this.oldTime) / 1000 // in seconds
      this.oldTime = time
      const squares = this.$refs.squares as any[] // TODO: no any
      squares.forEach(s => s.tick(delta))
      this.raf = requestAnimationFrame(this.tick)
    },
  },
})
</script>

<style lang="postcss">
#arena {
  height: 100vmin;
  width: 100vmin;
  border-width: 0.7rem;
  border-top-color: var(--color-up);
  border-bottom-color: var(--color-down);
  border-left-color: var(--color-left);
  border-right-color: var(--color-right);
}

@screen md {
  #arena {
    width: 80vh;
    height: 80vh;
  }
}
</style>
