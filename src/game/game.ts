import { Application, UPDATE_PRIORITY } from "pixi.js"
import Square, { SwipeEvent } from "@/game/square"
import Triangle from "./triangle"
import Circle from "./circle"
import TapSquare from "./tapSquare"
import SwipeZone from "@/game/swipeZone"
import { randomDirection, randomWeighted } from "@/tools"

export default class extends Application {
  zone = new SwipeZone()
  events = new EventTarget() // to have an event interface
  time = 0
  resize: () => void

  constructor(el: HTMLCanvasElement) {
    super({
      view: el,
      transparent: true,
      autoStart: true,
      antialias: true,
      forceFXAA: true,
    })

    this.resize = () => {
      this.renderer.resize(innerWidth, innerHeight)
    }
    window.addEventListener("fullscreenchange", this.resize)
    window.addEventListener("resize", this.resize)
    this.resize()

    this.ticker.add(this.tick, this, UPDATE_PRIORITY.HIGH)
    this.stage.addChild(this.zone)
  }

  tick(deltaTime: number) {
    if (this.ticker.elapsedMS > 200) return
    let delta = this.ticker.elapsedMS / 1000

    if ((this.time += delta) > 1.3) {
      this.time = 0
      this.addTile()
    }

    this.stage.children.forEach(c => c.emit("tick", delta))
    this.stage.children.forEach(c => {
      if (c !== this.zone) this.zone.updateIntersection(c)
    })
  }

  destroy() {
    window.removeEventListener("fullscreenchange", this.resize)
    window.removeEventListener("resize", this.resize)
    super.destroy()
  }

  addTile() {
    let ctors: {
      [name: string]: any
    } = {
      Square,
      Triangle,
      Circle,
      TapSquare,
    }
    let type = randomWeighted({
      Square: 1,
      Triangle: 1,
      Circle: 1,
      TapSquare: 1,
    })
    let tile = new ctors[type](randomDirection())
    this.stage.addChildAt(tile, 0)

    tile.on("swipe", (e: SwipeEvent) => {
      if (this.zone.isSwipeCorrect(e))
        this.events.dispatchEvent(new Event("score"))
      else this.events.dispatchEvent(new Event("mistake"))
    })

    tile.on("timeout", () => this.events.dispatchEvent(new Event("mistake")))
  }
}
