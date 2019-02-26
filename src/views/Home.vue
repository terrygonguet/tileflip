<template>
  <div
    class="home flex flex-col items-center justify-center px-8 text-justify overflow-auto leading-tight"
  >
    <h1 class="neon">Tileflip</h1>
    <p v-if="!standalone && !isMobile" class="my-2 text-center">
      This game is meant to be played in Portrait (vertical) mode on a
      smartphone.
    </p>
    <p
      class="my-2"
      v-if="!standalone && isMobile"
    >If the view "slides around" when you swipe, try going fullscreen.</p>
    <div v-if="isMobile || standalone">
      <button
        class="btn m-2 leading-tight"
        v-if="canFullscreen && !standalone"
        @click="fullscreen"
      >Fullscreen</button>
      <router-link to="/levels" class="no-underline btn m-2 inline-block">Levels</router-link>
    </div>
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
      standalone: window.matchMedia("(display-mode: standalone)").matches,
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
