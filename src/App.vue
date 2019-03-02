<template>
  <div id="app" class="bg-black h-screen overflow-hidden">
    <FPSCounter v-if="isDebug" class="absolute m-2 pin-t pin-l"/>
    <router-view class="h-full"></router-view>
    <Toast
      :duration="toast.duration"
      v-if="hasToast"
      class="pin absolute font-bold flex justify-center items-center neon"
      @done="toastDone"
    >{{ toast.message }}</Toast>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Toast from "@/components/Toast.vue"
import FPSCounter from "@/components/debug/FPSCounter.vue"
import { ToastEvent } from "@/tools"
declare const process: any

export default Vue.extend({
  name: "App",
  components: { Toast, FPSCounter },
  data() {
    return {
      toast: { message: "" } as ToastEvent,
      deltas: [] as number[],
    }
  },
  computed: {
    hasToast(): boolean {
      return !!this.toast.message
    },
    isDebug(): boolean {
      return process.env.NODE_ENV === "development"
    },
  },
  methods: {
    toastDone() {
      this.toast = { message: "" }
    },
  },
  mounted() {
    this.$parent.$on("toast", (e: ToastEvent | string) => {
      let toast: ToastEvent = { message: "" }
      if (typeof e === "string") toast.message = e
      else toast = e

      // If there's already a toast we clear first
      if (this.hasToast) {
        this.toast = { message: "" }
        this.$nextTick(() => {
          this.toast = toast
        })
      } else this.toast = toast
    })
  },
})
</script>

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
  --color-button: cyan;
  --color: #eee;
  color: var(--color);
  font-family: "Autobus";
  font-size: 1.2rem;
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

.btn {
  @apply px-4;
  @apply py-2;
  @apply text-button;
  @apply rounded;
  border: 2px solid var(--color-down);
  box-shadow: 3px 2px var(--color-up);
}

.neon-glow {
  font-family: "Neon";
  color: #c6e2ff;
  /* animation: neon 0.08s ease-in-out infinite alternate; */
  text-shadow: 0 0 6px rgba(202, 228, 225, 0.92),
    0 0 30px rgba(202, 228, 225, 0.34), 0 0 12px rgba(30, 132, 242, 0.52),
    0 0 21px rgba(30, 132, 242, 0.92), 0 0 34px rgba(30, 132, 242, 0.78),
    0 0 54px rgba(30, 132, 242, 0.92);
}

@keyframes neon {
  from {
    text-shadow: 0 0 6px rgba(202, 228, 225, 0.92),
      0 0 30px rgba(202, 228, 225, 0.34), 0 0 12px rgba(30, 132, 242, 0.52),
      0 0 21px rgba(30, 132, 242, 0.92), 0 0 34px rgba(30, 132, 242, 0.78),
      0 0 54px rgba(30, 132, 242, 0.92);
  }
  to {
    text-shadow: 0 0 6px rgba(202, 228, 225, 0.98),
      0 0 30px rgba(202, 228, 225, 0.42), 0 0 12px rgba(30, 132, 242, 0.58),
      0 0 22px rgba(30, 132, 242, 0.84), 0 0 38px rgba(30, 132, 242, 0.88),
      0 0 60px rgba(30, 132, 242, 1);
  }
}

@font-face {
  font-family: "Neon";
  src: url("./assets/neon2.ttf") format("truetype");
}

@font-face {
  font-family: "Autobus";
  src: url("./assets/autobus.ttf") format("truetype");
}
</style>
