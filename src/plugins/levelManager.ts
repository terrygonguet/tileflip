import _Vue, { PluginObject } from "vue"
import { Action, Direction, Weights, randomWeighted } from "@/tools"

export class LevelManager {
  actions: Action[]
  generator?: (arg: LevelManager) => Action
  mode: "list" | "function"
  i: number
  speed: number
  unlocked: string[]

  constructor() {
    this.actions = []
    this.i = 0
    this.speed = 0
    this.mode = "list"
    if (localStorage.unlocked) this.unlocked = localStorage.unlocked.split(",")
    else this.unlocked = ["tuto-1"]
  }

  setLevel(value: string, resetSpeed = true) {
    this.reset(resetSpeed)
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

  isUnlocked(level: string) {
    return this.unlocked.indexOf(level) !== -1
  }

  speedUp() {
    this.insertToast("SPEED UP")
    this.speed++
    return this
  }

  reset(speed = true, mode = true) {
    this.i = 0
    this.actions = []
    if (speed) this.speed = 0
    if (mode) this.mode = "list"
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

  insertNextLevel(name: string, resetSpeed?: boolean) {
    this.actions.push({
      type: "NextLevel",
      name,
      resetSpeed,
    })
    return this
  }

  insertGameOver() {
    this.actions.push({ type: "GameOver" })
    return this
  }

  get startTime() {
    return 0.7 + 4.3 * 0.9 ** this.speed
  }

  get isFinished() {
    return this.i >= this.actions.length && this.mode == "list"
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
