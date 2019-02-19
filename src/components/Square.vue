<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <div class="square rounded" :style="squareStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { vec2 } from "gl-matrix"

const threshold = 50
const maxDuration = 300
const speed = 750

export type SwipeEvent = {
  time: number
  startTime: number
  momentum: vec2
  direction: string
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
    touchstart(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
      this.startSwipe.time = Date.now()
      this.startSwipe.pos = vec2.set(
        this.startSwipe.pos,
        touch.clientX,
        touch.clientY
      )
    },
    touchend(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
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

      // figure out which direction we swiped
      let direction = ""
      if (absX > threshold && absX > absY) {
        direction = delta[0] > 0 ? "right" : "left"
      } else if (absY > threshold && absX < absY) {
        direction = delta[1] > 0 ? "down" : "up"
      }

      if (direction && direction == this.direction) {
        let swipeEvt: SwipeEvent = {
          time: this.time,
          startTime: this.startTime,
          direction,
          momentum: vec2.scale(delta, delta, 1000 / deltaTime),
        }
        this.$emit("swiped", swipeEvt) // in px/s
      }
    },
    touchmove(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
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
    this.$on("swiped", (e: SwipeEvent) => {
      this.isSwiped = true
      this.momentum = e.momentum
    })
  },
})
</script>
