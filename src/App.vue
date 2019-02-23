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

.color-up {
  color: var(--color-up);
}
.color-down {
  color: var(--color-down);
}
.color-left {
  color: var(--color-left);
}
.color-right {
  color: var(--color-right);
}
.color-button {
  color: var(--color-button);
}
.bg-up {
  background-color: var(--color-up);
}
.bg-down {
  background-color: var(--color-down);
}
.bg-left {
  background-color: var(--color-left);
}
.bg-right {
  background-color: var(--color-right);
}
.bg-button {
  background-color: var(--bg-button);
}
</style>
