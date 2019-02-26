<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @click="tap"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <div class="square rounded" :style="squareStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import TileSquare from "./TileSquare.vue"
import { vec2 } from "gl-matrix"

export default TileSquare.extend({
  name: "tapSquare",
  data() {
    return {
      tapped: false,
    }
  },
  computed: {
    squareStyle(): object {
      return {
        width: (this.time / this.startTime) * 35 + "vmin",
        height: (this.time / this.startTime) * 35 + "vmin",
        "background-color": this.tapped
          ? `var(--color-${this.direction})`
          : "lightgrey",
      }
    },
  },
  methods: {
    tap(e: MouseEvent) {
      this.tapped = true
    },
    touchend(e: TouchEvent) {
      if (this.tapped)
        (TileSquare as any).options.methods.touchend.call(this, e)
      else this.startSwipe = { time: 0, pos: vec2.create() }
    },
  },
})
</script>
