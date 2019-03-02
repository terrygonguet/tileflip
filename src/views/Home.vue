<template>
  <div
    class="home flex flex-col items-center justify-around px-8 text-justify overflow-auto leading-tight"
  >
    <h1 class="neon-glow text-5xl">Tileflip</h1>
    <p v-if="!standalone && !isMobile" class="my-2 text-center">
      This game is meant to be played in Portrait (vertical) mode on a
      smartphone.
    </p>
    <router-link
      v-if="isMobile || standalone"
      to="/levels"
      class="no-underline btn m-2 inline-block"
    >Levels</router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "home",
  data() {
    return {
      standalone: window.matchMedia("(display-mode: standalone)").matches,
    }
  },
})
</script>
