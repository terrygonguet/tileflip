<template>
  <div id="app" class="bg-black h-screen overflow-hidden">
    <router-view class="h-full"></router-view>
  </div>
</template>

<style lang="postcss">
@tailwind preflight;
@tailwind components;
@tailwind utilities;

:root {
  --color-up: cyan;
  --color-down: magenta;
  --color-left: yellow;
  --color-right: lightgreen;
  --bg-button: cyan;
  --color-button: black;
  --color: #eee;
  color: var(--color);
}

.select-none {
  user-select: none;
}

.no-pointer-event {
  pointer-events: none;
}

.neon {
  text-shadow: 0 0 7px var(--color-down);
}

.text-button {
  color: var(--color-button);
}
.bg-button {
  background-color: var(--bg-button);
}
</style>
