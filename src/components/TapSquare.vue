<template>
  <div
    class="hitbox absolute p-4"
    :style="hitboxStyle"
    @click="tap"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="_touchend"
    @mousedown="touchstart"
    @mousemove="touchmove"
    @mouseup="_touchend"
  >
    <div class="square rounded" :style="squareStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Square from "./Square.vue"
import { vec2 } from "gl-matrix"

export default Square.extend({
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
    _touchend(e: TouchEvent | MouseEvent) {
      if (this.tapped) this.touchend(e)
      else this.startSwipe = { time: 0, pos: vec2.create() }
    },
  },
})
</script>
