<template>
  <span>{{ fps }}</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: "FPSCounter",
  data() {
    return {
      deltas: [] as number[]
    }
  },
  computed: {
    fps(): number {
      return Math.round(
        1 /
          (this.deltas.reduce((acc, cur) => acc + cur, 0) / this.deltas.length)
      )
    },
  },
  mounted() {
    let old = 0,
      self = this
    requestAnimationFrame(function raf(time) {
      let delta = (time - old) / 1000
      old = time
      self.deltas.push(delta)
      if (self.deltas.length > 70) self.deltas.shift()
      requestAnimationFrame(raf)
    })
  }
})
</script>
