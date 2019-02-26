<template>
  <div id="arena" class="overflow-hidden relative" @touchmove.prevent>
    <component
      v-for="(square, id) in squares"
      :is="square.type"
      :key="id"
      :does-tick="square.doesTick"
      :direction="square.direction"
      :start-time="square.startTime"
      @swipe="swipe(id, $event)"
      @outofview="clear(id)"
      @timeout="timeout(id)"
      ref="squares"
    ></component>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import TileSquare, { SwipeEvent } from "./TileSquare.vue"
import TileTapSquare from "./TileTapSquare.vue"
import TileTriangle from "./TileTriangle.vue"
import TileCircle from "./TileCircle.vue"
import TileLosange from "./TileLosange.vue"

type SquareData = {
  direction: Direction
  startTime: number
  doesTick: boolean
  type: string
}

export type Direction = "up" | "down" | "left" | "right"

function randomDirection(): Direction {
  return (["up", "down", "left", "right"] as Direction[])[
    Math.floor(Math.random() * 4)
  ]
}

function randomWeighted(weights: { [type: string]: number }): string {
  let bag: string[] = []
  for (const type in weights) {
    let weight = weights[type]
    // add 'papers' to the bag
    bag = bag.concat(new Array(weight).fill(type))
  }
  return bag[Math.floor(Math.random() * bag.length)]
}

export type ScoreEvent = {
  n: number
  startTime: number
  time: number
}

export default Vue.extend({
  name: "TheArena",
  components: {
    TileSquare,
    TileTapSquare,
    TileTriangle,
    TileCircle,
    TileLosange,
  },
  data() {
    return {
      types: {
        TileSquare: 5,
        TileTapSquare: 2,
        TileCircle: 2,
        TileTriangle: 2,
        TileLosange: 1,
      } as {
        // type: weight
        [type: string]: number
      },
      squares: {} as { [id: string]: SquareData },
      id: 0,
      raf: 0,
      oldTime: 0,
      playing: false,
      speed: 0,
    }
  },
  computed: {
    startTime(): number {
      return 0.7 + 4.3 * 0.9 ** this.speed
    },
  },
  methods: {
    makeSquare() {
      let direction: Direction = randomDirection()
      let type = randomWeighted(this.types)
      this.$set(this.squares, this.id++, {
        direction,
        type,
        startTime: this.startTime,
        doesTick: true,
      } as SquareData)
    },
    swipe(id: string, e: SwipeEvent) {
      if (e.correct) {
        let scoreEvt: ScoreEvent = {
          n: parseInt(id),
          startTime: e.startTime,
          time: e.time,
        }
        this.$emit("score", scoreEvt)
        if (this.id >= (this.speed + 1) * 10) {
          this.speedUp()
        }
      } else {
        this.$emit("mistake")
      }
      this.playing && this.makeSquare()
    },
    clear(id: string) {
      this.$delete(this.squares, id)
    },
    start() {
      this.id = 0
      this.oldTime = performance.now()
      this.raf = requestAnimationFrame(this.tick)
      this.playing = true
      this.speed = 0
      this.makeSquare()
    },
    stop() {
      cancelAnimationFrame(this.raf)
      for (const id in this.squares) {
        this.clear(id)
      }
      this.playing = false
    },
    timeout(id: string) {
      this.clear(id)
      this.$emit("mistake")
      this.playing && this.makeSquare()
    },
    speedUp() {
      this.speed++
      this.$root.$emit("toast", "SPEED UP")
    },
    tick(time: number) {
      const delta = (time - this.oldTime) / 1000 // in seconds
      this.oldTime = time
      const squares = this.$refs.squares as any[] // TODO: no any
      squares.forEach(s => s.tick(delta))
      this.raf = requestAnimationFrame(this.tick)
    },
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
