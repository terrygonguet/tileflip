<template>
  <div :style="{opacity}" class="no-pointer-event">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "toast",
  props: {
    duration: Number,
  },
  data() {
    return {
      time: this.duration,
    }
  },
  computed: {
    opacity(): number {
      return (this.time / this.duration) ** 0.2
    },
  },
  mounted() {
    let old = performance.now()
    const self = this
    requestAnimationFrame(function raf(time) {
      const delta = (time - old) / 1000
      self.time -= delta
      old = time
      if (self.time > 0) {
        requestAnimationFrame(raf)
      } else {
        self.$emit("done")
      }
    })
  },
})
</script>
