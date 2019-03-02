<template>
  <h1 v-if="levelManager.statsEnabled">
    <span class="neon-glow">Score:</span>
    {{ levelManager.score | round }}
  </h1>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "LabelScore",
  filters: {
    round(value: any) {
      if (!value) return 0
      let num = parseFloat(value)
      if (isNaN(num)) return 0
      else return Math.round(num)
    },
  },
})
</script>

