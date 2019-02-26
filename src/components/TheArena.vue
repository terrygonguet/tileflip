<template>
  <div id="arena" class="overflow-hidden relative" @touchmove.prevent>
    <component
      v-for="(tile, id) in tiles"
      :is="tile.tileName"
      :key="id"
      :does-tick="tile.doesTick"
      :direction="tile.direction"
      :start-time="tile.startTime"
      @swipe="swipe(id, $event)"
      @outofview="clear(id)"
      @timeout="timeout(id)"
      ref="tiles"
    ></component>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import TileSquare from "./TileSquare.vue"
import TileTapSquare from "./TileTapSquare.vue"
import TileTriangle from "./TileTriangle.vue"
import TileCircle from "./TileCircle.vue"
import TileLosange from "./TileLosange.vue"
import { Tile, SwipeEvent, ScoreEvent, isBlockingType } from "@/tools"

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
      tiles: {} as { [id: string]: Tile },
      id: 0,
      raf: 0,
      oldTime: 0,
      playing: false,
    }
  },
  methods: {
    next() {
      let manager = this.levelManager
      if (!manager.isFinished) {
        let action = manager.nextAction()
        switch (action.type) {
          case "Tile":
            this.$set(this.tiles, this.id++, action)
            break
          case "Toast":
            this.$root.$emit("toast", action)
            break
          case "NextLevel":
            manager.setLevel(action.name, action.resetSpeed)
            break
          case "GameOver":
            this.stop()
            this.$emit("gameover")
            break
          default:
            throw "Wat"
        }
        if (!isBlockingType(action.type)) this.$nextTick(() => this.next())
      }
    },
    swipe(id: string, e: SwipeEvent) {
      if (e.correct) {
        let scoreEvt: ScoreEvent = {
          n: parseInt(id),
          startTime: e.startTime,
          time: e.time,
        }
        this.$emit("score", scoreEvt)
      } else {
        this.$emit("mistake")
      }
      this.playing && this.next()
    },
    clear(id: string) {
      this.$delete(this.tiles, id)
    },
    start() {
      this.id = 0
      this.oldTime = performance.now()
      this.raf = requestAnimationFrame(this.tick)
      this.playing = true
      this.levelManager.setLevel("tuto-1")
      this.next()
    },
    stop() {
      cancelAnimationFrame(this.raf)
      for (const id in this.tiles) {
        this.clear(id)
      }
      this.playing = false
    },
    timeout(id: string) {
      this.clear(id)
      this.$emit("mistake")
      this.playing && this.next()
    },
    tick(time: number) {
      const delta = (time - this.oldTime) / 1000 // in seconds
      this.oldTime = time
      const tiles = (this.$refs.tiles as any[]) || [] // TODO: no any
      tiles.forEach(s => s.tick(delta))
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
