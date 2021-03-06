<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @click="tap"
  >
    <div class="losange rounded" v-if="!tapped"></div>
    <div v-if="tapped" class="losangebit bg-up rounded absolute" :style="bitStyle('up')"></div>
    <div v-if="tapped" class="losangebit bg-down rounded absolute" :style="bitStyle('down')"></div>
    <div v-if="tapped" class="losangebit bg-left rounded absolute" :style="bitStyle('left')"></div>
    <div v-if="tapped" class="losangebit bg-right rounded absolute" :style="bitStyle('right')"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { vec2, vec3 } from "gl-matrix"
import { Direction, SwipeEvent } from "@/tools"

export default Vue.extend({
  name: "TileLosange",
  props: {
    doesTick: {
      type: Boolean,
      required: false,
      default: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
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
      let mod =
        (this.startRotation + this.rotation + Math.PI / 4) % (Math.PI * 2)
      let swipeEvt: SwipeEvent = {
        time: this.time,
        startTime: this.startTime,
        direction: "up", // dummy values
        momentum: vec2.create(), // dummy values
        correct: Math.abs(mod) <= Math.PI / 2,
      }
      this.$emit("swipe", swipeEvt)
    },
    tick(delta: number) {
      if (!this.tapped && this.doesTick) this.time -= delta
      if (this.tapped) this.spread += delta * 500
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
.losange {
  border-width: 17.5vmin;
  border-top-color: var(--color-up);
  border-bottom-color: var(--color-down);
  border-left-color: var(--color-left);
  border-right-color: var(--color-right);
}

.losangebit {
  width: 17.5vmin;
  height: 17.5vmin;
}
</style>
