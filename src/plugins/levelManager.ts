import _Vue, { PluginObject } from "vue"
import { Action, Direction, Weights, randomWeighted, ScoreEvent } from "@/tools"

export class LevelManager {
  actions: Action[] = []
  generator?: (arg: LevelManager) => Action
  mode: "list" | "function" = "list"
  i: number = 0
  speed: number = 0
  unlocked: string[]
  score: number = 0
  chain: number = 0
  lives: number = 3
  statsEnabled: boolean = true
  noStatsMessage: string = ""

  constructor() {
    if (localStorage.unlocked) this.unlocked = localStorage.unlocked.split(",")
    else this.unlocked = ["tuto-1"]
  }

  setLevel(value: string, resetStats?: boolean) {
    this.reset(resetStats)
    let lvl: Function = require(`../levels/${value}.ts`).default
    lvl(this)
    if (this.unlocked.indexOf(value) === -1) {
      this.unlocked.push(value)
      localStorage.unlocked = this.unlocked
    }
    return this
  }

  setMode(mode: "list" | "function", fn?: (arg: LevelManager) => Action) {
    if (mode == "list") {
      this.mode = mode
    } else {
      if (!fn) throw new Error("Need a generator in Function mode")
      this.mode = "function"
      this.generator = fn
    }
    return this
  }

  isLevelUnlocked(level: string) {
    return this.unlocked.indexOf(level) !== -1
  }

  speedUp() {
    this.insertToast("SPEED UP")
    this.speed++
    return this
  }

  reset(stats = true) {
    this.i = 0
    this.actions = []
    if (stats) {
      this.speed = 0
      this.mode = "list"
      this.score = 0
      this.chain = 0
      this.lives = 3
      this.statsEnabled = true
    }
  }

  insertToast(message: string, duration?: number, size?: number) {
    this.actions.push({
      type: "Toast",
      message,
      duration,
      size,
    })
    return this
  }

  insertTile(
    nameOrWeights: string | Weights,
    startTime = this.startTime,
    doesTick?: boolean,
    direction?: Direction
  ) {
    let tileName = ""
    if (typeof nameOrWeights === "string") tileName = nameOrWeights
    else tileName = randomWeighted(nameOrWeights)

    this.actions.push({
      type: "Tile",
      tileName,
      startTime,
      doesTick,
      direction,
    })
    return this
  }

  insertNextLevel(name: string, resetStats?: boolean) {
    this.actions.push({
      type: "NextLevel",
      name,
      resetStats,
    })
    return this
  }

  insertGameOver() {
    this.actions.push({ type: "GameOver" })
    return this
  }

  insertNoStatsMessage(message = "") {
    this.actions.push({
      type: "NoStatsMessage",
      message,
    })
    return this
  }

  scorePoints(e: ScoreEvent) {
    if (!this.statsEnabled) return this
    this.chain++
    let timeToSwipe = e.startTime - e.time
    this.score += 20 * (5 - timeToSwipe) * this.combo
  }

  mistake() {
    if (!this.statsEnabled) return this
    this.chain = 0
    this.lives--
  }

  get startTime() {
    return 0.7 + 4.3 * 0.9 ** this.speed
  }

  get isFinished() {
    return this.i >= this.actions.length && this.mode == "list"
  }

  get combo() {
    return Math.floor(this.chain / 8) + 1
  }

  get isGameOver() {
    return this.lives <= 0
  }

  nextAction() {
    if (this.mode == "list") return this.actions[this.i++]
    else if (this.generator) {
      let action = this.generator(this)
      this.i++
      return action
    } else {
      throw new Error("Need a generator in Function mode")
    }
  }
}

const levelManager = new LevelManager()

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          levelManager,
        }
      },
    })
  },
} as PluginObject<never>
