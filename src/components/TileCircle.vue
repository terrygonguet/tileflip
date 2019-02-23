<template>
  <div
    class="hitbox absolute p-4 rounded-full"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @mousedown="touchstart"
    @mousemove="touchmove"
    @mouseup="touchend"
  >
    <div class="circle rounded-full" :style="squareStyle"></div>
  </div>
</template>

<script lang="ts">
import TileSquare, {
  threshold,
  maxDuration,
  speed,
  SwipeEvent,
} from "./TileSquare.vue"
import { vec2 } from "gl-matrix"

export default TileSquare.extend({
  name: "TileCircle",
  methods: {
    // TODO: not copy paste parent code
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
        swipeEvt.correct = swipeEvt.direction !== this.direction // only change
        this.$emit("swipe", swipeEvt)
      }
    },
  },
})
</script>
