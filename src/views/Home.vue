<template>
  <div
    class="home flex flex-col items-center justify-center px-8 text-justify overflow-auto leading-tight"
  >
    <p v-if="!standalone && !$data.$isMobile" class="my-2 text-center">
      This game is meant to be played in Portrait (vertical) mode on a
      smartphone.
    </p>
    <p class="my-2" v-if="!standalone && $data.$isMobile"
      >If the view "slides around" when you swipe, try going fullscreen.</p
    >
    <ul class="my-2 p-0 pl-2" v-if="$data.$isMobile">
      <li>Colored squares ⬜ must be swiped in the direction of their color</li>
      <li>Grey squares ⬜️ must be tapped first</li>
      <li>
        Triangles 🔺 act like boomerangs and must be swiped opposite their
        colors
      </li>
      <li
        >Circles 🔴 must be swiped anywhere but the direction of their color</li
      >
      <li>
        You lose a life 🧡 for every mistake you make and if you don't react in
        time
      </li>
      <li>The more swipes you get right the higher your combo multiplier</li>
    </ul>
    <div v-if="$data.$isMobile || standalone">
      <button
        class="btn m-2 leading-tight"
        v-if="canFullscreen && !standalone"
        @click="fullscreen"
        >Fullscreen</button
      >
      <router-link to="/game" class="no-underline btn m-2 inline-block"
        >Play</router-link
      >
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
