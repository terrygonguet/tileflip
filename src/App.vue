<template>
  <div id="app" class="text-grey-lightest bg-black h-screen overflow-hidden">
    <div id="nav" class="flex items-center justify-center p-2">
      <router-link to="/" class="no-underline">Home</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/game" class="no-underline">Game</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="postcss">
@tailwind preflight;
@tailwind components;
@tailwind utilities;

.router-link-exact-active {
  color: var(--color-up) !important;
  font-weight: bold;
}

#nav > a {
  color: var(--color-down);
}

#app {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
}

:root {
  --color-up: cyan;
  --color-down: magenta;
  --color-left: yellow;
  --color-right: lightgreen;
}
</style>
