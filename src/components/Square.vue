<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @mousedown="touchstart"
    @mousemove="touchmove"
    @mouseup="touchend"
  >
    <div class="square rounded" :style="squareStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Direction } from "./Arena.vue"
import { vec2 } from "gl-matrix"

export let threshold = 50
export let maxDuration = 300
export let speed = 750

export type SwipeEvent = {
  time: number
  startTime: number
  momentum: vec2
  direction: Direction
  correct: boolean
}

export default Vue.extend({
  name: "square",
  props: {
    doesTick: Boolean,
    startTime: Number,
    direction: String,
  },
  data() {
    return {
      time: this.startTime,
      pos: vec2.create(),
      momentum: vec2.create(),
      isSwiped: false,
      startSwipe: {
        time: 0,
        pos: vec2.create(),
      },
    }
  },
  computed: {
    hitboxStyle(): object {
      return {
        transform: "translate(-50%, -50%)",
        left: `calc(50% + ${this.pos[0]}px)`,
        top: `calc(50% + ${this.pos[1]}px)`,
      }
    },
    squareStyle(): object {
      return {
        width: (this.time / this.startTime) * 35 + "vmin",
        height: (this.time / this.startTime) * 35 + "vmin",
        "background-color": `var(--color-${this.direction})`,
      }
    },
    isDragged(): boolean {
      return this.startSwipe.time !== 0
    },
    isOutOfView(): boolean {
      return vec2.length(this.pos) > 1000
    },
  },
  methods: {
    touchstart(e: TouchEvent | MouseEvent) {
      if (this.isSwiped) return
      const touch = e instanceof MouseEvent ? e : e.changedTouches[0]
      this.startSwipe.time = Date.now()
      this.startSwipe.pos = vec2.set(
        this.startSwipe.pos,
        touch.clientX,
        touch.clientY
      )
    },
    touchend(e: TouchEvent | MouseEvent) {
      if (this.isSwiped) return
      const touch = e instanceof MouseEvent ? e : e.changedTouches[0]
      const deltaTime = Date.now() - this.startSwipe.time
      const delta = vec2.sub(
        vec2.create(),
        [touch.clientX, touch.clientY],
        this.startSwipe.pos
      )
      const absX = Math.abs(delta[0])
      const absY = Math.abs(delta[1])

      // reset start data and exit early
      // if the touch was too long
      this.startSwipe = { time: 0, pos: vec2.create() }
      if (deltaTime > maxDuration) return

      let swipeEvt: SwipeEvent = {
        time: this.time,
        startTime: this.startTime,
        direction: "up",
        momentum: vec2.scale(delta, delta, 1000 / deltaTime), // in px/s
        correct: false,
      }
      // figure out which direction we swiped
      if (absX > threshold || absY > threshold) {
        if (absX > absY) {
          swipeEvt.direction = delta[0] > 0 ? "right" : "left"
        } else {
          swipeEvt.direction = delta[1] > 0 ? "down" : "up"
        }
        swipeEvt.correct = swipeEvt.direction === this.direction
        this.$emit("swipe", swipeEvt)
      }
    },
    touchmove(e: TouchEvent | MouseEvent) {
      if (this.isSwiped || !this.startSwipe.time) return
      const touch = e instanceof MouseEvent ? e : e.changedTouches[0]
      this.pos = vec2.sub(
        this.pos,
        [touch.clientX, touch.clientY],
        this.startSwipe.pos
      )
      this.pos = vec2.scale(vec2.create(), this.pos, 0.55)
    },
    tick(delta: number) {
      let temp = vec2.create()

      if (this.doesTick && !this.isSwiped) this.time -= delta
      if (this.time < 0) this.$emit("timeout")

      if (this.isSwiped) {
        // if we've been swiped we just speed off in that direction
        this.pos = vec2.scaleAndAdd(temp, this.pos, this.momentum, delta)
      } else if (vec2.length(this.pos) && !this.isDragged) {
        // if we've been moved but not fully swiped
        // we move back to the center
        if (vec2.length(this.pos) > delta * speed)
          this.pos = vec2.scaleAndAdd(
            temp,
            this.pos,
            vec2.normalize(temp, this.pos),
            -delta * speed
          )
        else this.pos = vec2.set(temp, 0, 0)
      }

      if (this.isOutOfView) this.$emit("outofview")
    },
  },
  mounted() {
    this.$on("swipe", (e: SwipeEvent) => {
      this.isSwiped = true
      this.momentum = e.momentum
    })
  },
})
</script>

<style lang="postcss">
.square {
  animation: appear 0.1s linear;
}

@keyframes appear {
  from {
    width: 0;
    height: 0;
  }
  to {
    width: 35vw;
    height: 35vw;
  }
}
</style>
