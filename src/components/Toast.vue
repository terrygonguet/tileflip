<template>
  <div
    :style="style"
    class="no-pointer-event overflow-hidden whitespace-no-wrap"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "toast",
  props: {
    duration: {
      type: Number,
      default: 0.5,
      required: false,
    },

    size: {
      type: Number,
      default: 2,
      required: false,
    },
  },
  data() {
    return {
      time: this.duration,
      curSize: this.size,
    }
  },
  computed: {
    progress(): number {
      return (this.time / this.duration) ** 0.2
    },
    style(): object {
      return {
        opacity: this.progress,
        fontSize: (1 / this.progress) * this.curSize + "em",
      }
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
