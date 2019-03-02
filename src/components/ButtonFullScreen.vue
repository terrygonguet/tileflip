<template>
  <button @click="fullscreen" v-if="canFullscreen">
    <img v-if="!isFullScreen" key="expand" src="../assets/expand.png" width="25" height="25">
    <img v-else key="compress" src="../assets/compress.png" width="25" height="25">
  </button>
</template>

<script lang="ts">
import Vue from "vue"
import screenfull from "screenfull"

if (screenfull) {
  screenfull.on("error", console.error)
}

export default Vue.extend({
  name: "ButtonFullScreen",
  data() {
    return {
      canFullscreen: screenfull && screenfull.enabled,
      isFullScreen: false,
    }
  },
  methods: {
    fullscreen() {
      if (this.canFullscreen && screenfull) {
        screenfull.toggle()
        screenfull.onchange(() => {
          this.isFullScreen = screenfull && screenfull.isFullscreen
        })
      }
    },
  },
})
</script>
