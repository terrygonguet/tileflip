<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <svg
      :width="squareStyle.width"
      :height="squareStyle.height"
      class="triangle"
    >
      <polygon :fill="`var(--color-${direction})`" :points="points"></polygon>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import TileSquare, {
  SwipeEvent,
  threshold,
  maxDuration,
  speed,
} from "./TileSquare.vue"
import { Direction } from "./TheArena.vue"
import { vec2 } from "gl-matrix"

const vmin = Math.min(innerHeight, innerWidth)
function oppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case "up":
      return "down"
    case "down":
      return "up"
    case "left":
      return "right"
    case "right":
      return "left"
  }
}

export default TileSquare.extend({
  name: "triangle",
  data() {
    return {
      rotation: 0,
      wind: vec2.create(),
    }
  },
  computed: {
    points(): string {
      const side = 0.35 * vmin
      const center = vec2.fromValues(side / 2, (side * Math.sqrt(3)) / 3)
      const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]
      const points = angles
        .map(angle =>
          vec2.rotate(
            vec2.create(),
            vec2.fromValues(side / 2, 0),
            center,
            angle
          )
        )
        .map(pt => pt[0] + "," + pt[1])
      return points.join(" ")
    },
    squareStyle(): object {
      const side = 0.35 * vmin // a bit more for no clipping
      return {
        width: side,
        height: (side * Math.sqrt(3)) / 2,
      }
    },
    hitboxStyle(): object {
      return {
        transform: `translate(-50%, -50%) rotate(${
          this.rotation
        }rad) scale(${this.time / this.startTime})`,
        left: `calc(50% + ${this.pos[0]}px)`,
        top: `calc(50% + ${this.pos[1]}px)`,
      }
    },
  },
  methods: {
    // TODO: not copy paste the parent's code...
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
        swipeEvt.correct =
          oppositeDirection(swipeEvt.direction) === this.direction
        this.wind = vec2.scale(vec2.create(), swipeEvt.momentum, -2)
        // reduce momentup for A E S T H E T I C S
        vec2.scale(swipeEvt.momentum, swipeEvt.momentum, 0.7)
        this.$emit("swipe", swipeEvt)
      }
    },
    tick(delta: number) {
      this.momentum = vec2.scaleAndAdd(
        vec2.create(),
        this.momentum,
        this.wind,
        delta
      )
      if (this.isSwiped)
        this.rotation += delta * 2
        // super.tick(delta)
      ;(TileSquare as any).options.methods.tick.call(this, delta)
    },
  },
})
</script>
