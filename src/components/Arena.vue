<template>
  <div id="arena" class="overflow-hidden relative">
    <Square
      v-for="(square, id) in squares"
      :key="id"
      :does-tick="square.doesTick"
      :direction="square.direction"
      :start-time="square.startTime"
      @swiped="swiped(id)"
      @outofview="clear(id)"
      @timeout="timeout(id)"
    ></Square>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Square from "./Square.vue"

type Square = {
  direction: string
  startTime: number
  doesTick: boolean
}

export default Vue.extend({
  name: "arena",
  components: {
    Square,
  },
  data() {
    return {
      squares: {} as { [id: string]: Square },
      id: 0,
      startTime: 5,
    }
  },
  methods: {
    makeSquare() {
      this.$set(this.squares, this.id++, {
        direction: ["up", "down", "left", "right"][
          Math.floor(Math.random() * 4)
        ],
        startTime: this.startTime,
        doesTick: true,
      })
    },
    swiped(id: string) {
      this.$emit("score", 100)
      this.makeSquare()
      this.startTime *= 0.95
    },
    clear(id: string) {
      this.$delete(this.squares, id)
    },
    start() {
      this.startTime = 5
      this.makeSquare()
    },
    timeout(id: string) {
      this.clear(id)
      this.$emit("gameover")
    },
  },
  mounted() {
    this.$on("start", this.start)
  },
})
</script>

<style lang="postcss">
#arena {
  height: 100vmin;
  width: 100vmin;
  border-width: 0.7rem;
  border-top-color: var(--color-up);
  border-bottom-color: var(--color-down);
  border-left-color: var(--color-left);
  border-right-color: var(--color-right);
}

@screen md {
  #arena {
    width: 80vh;
    height: 80vh;
  }
}
</style>
