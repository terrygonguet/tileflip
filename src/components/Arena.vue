<template>
  <div id="arena" class="overflow-hidden relative">
    <Square
      v-for="(square, id) in squares"
      :key="id"
      :does-tick="square.doesTick"
      :direction="square.direction"
      :start-time="square.startTime"
      @swiped="swiped(id, $event)"
      @outofview="clear(id)"
      @timeout="timeout(id)"
      ref="squares"
    ></Square>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Square, { SwipeEvent } from "./Square.vue"

type SquareData = {
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
      squares: {} as { [id: string]: SquareData },
      id: 0,
      raf: 0,
      oldTime: 0,
    }
  },
  computed: {
    startTime(): number {
      return 1 + 4 * 0.95 ** this.id
    },
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
    swiped(id: string, e: SwipeEvent) {
      this.$emit("score", 100 * (e.time / e.startTime) * (1 + this.id / 25))
      this.makeSquare()
    },
    clear(id: string) {
      this.$delete(this.squares, id)
    },
    start() {
      this.id = 0
      this.makeSquare()
      this.oldTime = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    },
    timeout(id: string) {
      this.clear(id)
      cancelAnimationFrame(this.raf)
      this.$emit("gameover")
    },
    tick(time: number) {
      const delta = (time - this.oldTime) / 1000 // in seconds
      this.oldTime = time
      const squares = <any[]>this.$refs.squares // TODO: no any
      squares.forEach(s => s.tick(delta))
      this.raf = requestAnimationFrame(this.tick)
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
