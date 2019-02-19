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

const threshold = 50
const maxDuration = 300

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
      x: 0,
      y: 0,
      velocity: 1000,
      isSwiped: false,
      isDestroyed: false,
      startSwipe: {
        time: 0,
        x: 0,
        y: 0,
      },
    }
  },
  computed: {
    hitboxStyle(): object {
      return {
        transform: "translate(-50%, -50%)",
        top: `calc(50% + ${this.y}px)`,
        left: `calc(50% + ${this.x}px)`,
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
      return Math.abs(this.x) > 1000 || Math.abs(this.y) > 1000
    },
  },
  methods: {
    touchstart(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
      this.startSwipe.time = Date.now()
      this.startSwipe.x = touch.clientX
      this.startSwipe.y = touch.clientY
    },
    touchend(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
      const deltaTime = Date.now() - this.startSwipe.time
      const deltaX = touch.clientX - this.startSwipe.x
      const deltaY = touch.clientY - this.startSwipe.y
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // reset start data and exit early
      // if the touch was too long
      this.startSwipe = { time: 0, x: 0, y: 0 }
      if (deltaTime > maxDuration) return

      // figure out which direction we swiped
      let direction = ""
      let velocity = 0
      if (absX > threshold && absX > absY) {
        direction = deltaX > 0 ? "right" : "left"
        velocity = absX / (deltaTime / 1000)
      } else if (absY > threshold && absX < absY) {
        direction = deltaY > 0 ? "down" : "up"
        velocity = absY / (deltaTime / 1000)
      }

      if (direction && direction == this.direction) {
        this.$emit("swiped", velocity)
      }
    },
    touchmove(e: TouchEvent) {
      if (this.isSwiped) return
      const touch = e.changedTouches[0]
      this.x = (touch.clientX - this.startSwipe.x) * 0.55
      this.y = (touch.clientY - this.startSwipe.y) * 0.55
    },
  },
  mounted() {
    const self = this
    let old = performance.now()
    requestAnimationFrame(function raf(time) {
      let x = self.x,
        y = self.y,
        delta = (time - old) / 1000,
        moveDist = self.velocity * delta,
        distance = Math.sqrt(x ** 2 + y ** 2)
      old = time

      if (self.doesTick && !self.isSwiped) self.time -= delta
      if (self.time < 0) self.$emit("timeout")

      if (self.isSwiped) {
        // if we've been swiped we just speed off in that direction
        switch (self.direction) {
          case "up":
            self.y -= moveDist
            break
          case "down":
            self.y += moveDist
            break
          case "left":
            self.x -= moveDist
            break
          case "right":
            self.x += moveDist
            break
        }
      } else if (x && y && !self.isDragged) {
        // if we've been moved but not fully swiped
        // we move back to the center
        if (distance > moveDist) {
          self.x -= (x / distance) * moveDist
          self.y -= (y / distance) * moveDist
        } else {
          self.x = self.y = 0
        }
      }

      if (self.isOutOfView) self.$emit("outofview")
      if (!self.isDestroyed) requestAnimationFrame(raf)
    })

    this.$on("swiped", (velocity: number) => {
      this.isSwiped = true
      this.velocity = velocity
    })

    this.$once("timeout", () => (this.isDestroyed = true))
    this.$once("outofview", () => (this.isDestroyed = true))
  },
  destroyed() {
    this.isDestroyed = true
  },
})
</script>
