import _Vue, { PluginObject } from "vue"
import { Action, Direction, Weights, randomWeighted } from "@/tools"

export class LevelManager {
  actions: Action[]
  i: number
  speed: number

  constructor() {
    this.actions = []
    this.i = 0
    this.speed = 0
  }

  setLevel(value: string, resetSpeed = true) {
    this.reset(resetSpeed)
    let lvl: Function = require(`../levels/${value}.ts`).default
    lvl(this)
    return this
  }

  speedUp() {
    this.insertToast("SPEED UP")
    this.speed++
    return this
  }

  reset(speed = true) {
    this.i = 0
    this.actions = []
    if (speed) this.speed = 0
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
    return this.i >= this.actions.length
  }

  nextAction() {
    return this.actions[this.i++]
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
