<template>
  <div class="home flex flex-col items-center justify-center">
    <button
      class="px-4 py-2 text-black rounded"
      style="background-color: var(--color-up)"
      :disabled="!canFullscreen"
      @click="fullscreen"
    >Fullscreen</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import screenfull from "screenfull"

if (screenfull) {
  screenfull.on("error", console.error)
}

export default Vue.extend({
  name: "home",
  data() {
    return {
      canFullscreen: screenfull && screenfull.enabled,
    }
  },
  methods: {
    fullscreen() {
      if (this.canFullscreen && screenfull) {
        screenfull.toggle()
      }
    },
  },
})
</script>