<template>
  <div id="app" class="bg-black h-screen overflow-hidden">
    <router-view class="h-full"></router-view>
    <Toast
      :duration="toast.duration"
      v-if="hasToast"
      class="pin absolute font-bold flex justify-center items-center neon"
      @done="toastDone"
      >{{ toast.message }}</Toast
    >
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Toast from "@/components/Toast.vue"

export type ToastData = {
  message: string
  duration?: number
  size?: number
}

export default Vue.extend({
  name: "App",
  components: { Toast },
  data() {
    return {
      toast: { message: "" } as ToastData,
    }
  },
  computed: {
    hasToast(): boolean {
      return !!this.toast.message
    },
  },
  methods: {
    toastDone() {
      this.toast = { message: "" }
    },
  },
  mounted() {
    this.$parent.$on("toast", (e: ToastData | string) => {
      if (typeof e === "string") this.toast.message = e
      else this.toast = e
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

.btn {
  @apply px-4;
  @apply py-2;
  @apply text-button;
  @apply bg-button;
  @apply rounded;
}
</style>
