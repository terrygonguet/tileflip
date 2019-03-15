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

  constructor(el: HTMLCanvasElement) {
    super({
      view: el,
      transparent: true,
      resizeTo: window,
      autoStart: true,
      antialias: true,
      forceFXAA: true,
    })

    this.ticker.add(this.tick, this, UPDATE_PRIORITY.HIGH)

    this.stage.addChild(this.zone)
    setInterval(this.addTile.bind(this), 1300)
  }

  tick(deltaTime: number) {
    if (this.ticker.elapsedMS > 200) return
    let delta = this.ticker.deltaMS / 1000
    this.stage.children.forEach(c => c.emit("tick", delta))
    this.stage.children.forEach(c => {
      if (c !== this.zone) this.zone.updateIntersection(c)
    })
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
