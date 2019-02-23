<template>
  <div
    class="home flex flex-col items-center justify-center px-8 text-justify overflow-auto leading-tight"
  >
    <p class="m-2" v-if="!standalone">
      This game is meant to be played in Portrait (vertical) mode on a
      smartphone.
    </p>
    <p class="m-2" v-if="!standalone">
      If the view "slides around" when you swipe, try going fullscreen.
      If you're using an iPhone you'll have to install the web app on your home screen to play adequately.
    </p>
    <ul class="m-2 p-0 pl-2">
      <li>Colored squares ⬜ must be swiped in the direction of their color</li>
      <li>Grey squares ⬜️ must be tapped first</li>
      <li>Triangles 🔺 act like boomerangs and must be swiped opposite their colors</li>
      <li>Circles 🔴 must be swiped anywhere but the direction of their color</li>
      <li>You lose a life 🧡 for every mistake you make and if you don't react in time</li>
      <li>The more swipes you get right the higher your combo multiplier</li>
    </ul>
    <div>
      <button
        class="px-4 py-2 m-2 color-button rounded bg-button"
        v-if="canFullscreen"
        @click="fullscreen"
      >Fullscreen</button>
      <router-link to="/game" class="no-underline px-4 py-2 m-2 color-button rounded bg-button">Play</router-link>
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
