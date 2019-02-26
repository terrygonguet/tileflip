<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @click="tap"
  >
    <div class="square rounded" v-if="!tapped"></div>
    <div
      v-if="tapped"
      class="squarebit bg-up rounded-full absolute"
      :style="bitStyle('up')"
    ></div>
    <div
      v-if="tapped"
      class="squarebit bg-down rounded-full absolute"
      :style="bitStyle('down')"
    ></div>
    <div
      v-if="tapped"
      class="squarebit bg-left rounded-full absolute"
      :style="bitStyle('left')"
    ></div>
    <div
      v-if="tapped"
      class="squarebit bg-right rounded-full absolute"
      :style="bitStyle('right')"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { vec2, vec3 } from "gl-matrix"
import { Direction } from "@/components/TheArena.vue"
import { SwipeEvent } from "@/components/TileSquare.vue"

export default Vue.extend({
  name: "TileLosange",
  props: {
    doesTick: Boolean,
    startTime: Number,
  },
  data() {
    return {
      time: this.startTime,
      startRotation: Math.random() * Math.PI * 2,
      rotation: 0,
      tapped: false,
      startVect: vec2.create(),
      center: vec2.create(),
      spread: 0,
    }
  },
  computed: {
    hitboxStyle(): object {
      let ratio = this.time / this.startTime
      return {
        transform: `translate(-50%, -50%) rotate(${this.rotation +
          this.startRotation}rad) scale(${ratio})`,
        left: `calc(50%)`,
        top: `calc(50%)`,
      }
    },
  },
  methods: {
    bitStyle(direction: Direction): object {
      let distance = Math.round(this.spread)
      let transform = ""
      if (direction == "up")
        transform = `translate(-50%, calc(-50% - ${distance}px))`
      else if (direction == "down")
        transform = `translate(-50%, calc(-50% + ${distance}px))`
      else if (direction == "left")
        transform = `translate(calc(-50% - ${distance}px), -50%)`
      else if (direction == "right")
        transform = `translate(calc(-50% + ${distance}px), -50%)`
      return { transform }
    },
    touchstart(e: TouchEvent) {
      if (this.tapped) return
      const touch = e.changedTouches[0]
      let pos = vec2.fromValues(touch.clientX, touch.clientY)
      this.startVect = vec2.normalize(
        vec2.create(),
        vec2.sub(pos, pos, this.center)
      )
    },
    touchmove(e: TouchEvent) {
      if (this.tapped) return
      const touch = e.changedTouches[0]
      let pos = vec2.fromValues(touch.clientX, touch.clientY)
      let vect = vec2.normalize(pos, vec2.sub(pos, pos, this.center))
      let crossp = vec2.cross(vec3.create(), vect, this.startVect)
      this.rotation = vec2.angle(vect, this.startVect) * Math.sign(-crossp[2])
    },
    touchend(e: TouchEvent) {
      this.startRotation = this.rotation + this.startRotation
      this.rotation = 0
    },
    tap(e: MouseEvent) {
      this.tapped = true
      let swipeEvt: SwipeEvent = {
        time: this.time,
        startTime: this.startTime,
        direction: "up", // dummy values
        momentum: vec2.create(), // dummy values
        correct:
          (this.startRotation + this.rotation) % (Math.PI * 2) <= Math.PI / 2,
      }
      this.$emit("swipe", swipeEvt)
    },
    tick(delta: number) {
      if (this.doesTick) {
        if (!this.tapped) this.time -= delta
        else this.spread += delta * 500
      }
      if (this.time < 0) this.$emit("timeout")
      if (this.spread > 1000) this.$emit("outofview")
    },
  },
  mounted() {
    const el = this.$el as HTMLElement
    const parent = el.parentElement || { offsetTop: 0 }
    this.center = vec2.fromValues(
      el.offsetLeft,
      el.offsetTop + parent.offsetTop
    )
  },
})
</script>

<style lang="postcss">
.square {
  border-width: 17.5vmin;
  border-top-color: var(--color-up);
  border-bottom-color: var(--color-down);
  border-left-color: var(--color-left);
  border-right-color: var(--color-right);
}

.squarebit {
  width: 17.5vmin;
  height: 17.5vmin;
}
</style>
