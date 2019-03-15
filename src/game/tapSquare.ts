import Square, { SwipeEvent } from "./square"
import { Direction, colors } from "@/tools"
import { Rectangle, interaction } from "pixi.js"

type InteractionEvent = interaction.InteractionEvent

export default class extends Square {
  isLocked = true

  constructor(direction: Direction) {
    super(direction)
    this.on("pointertap", this.click, this)
    // have to call again because isLocked is
    // undefined the first time
    this.clear()
    this.draw()
  }

  draw() {
    let vmin = Math.min(innerHeight, innerWidth)
    let w = 0.22 * vmin
    let color = colors[this.isLocked ? "locked" : this.direction]
    this.beginFill(color).drawRect(-w / 2, -w / 2, w, w)
    w *= 1.2
    this.rotation = Math.PI / 4
    this.hitArea = new Rectangle(-w / 2, -w / 2, w, w)
  }

  click(e: InteractionEvent) {
    if (!this.isLocked) return // dunno why it fires twice
    this.isLocked = false
    this.clear()
    this.draw()
  }

  pointerDown(e: InteractionEvent) {
    if (!this.isLocked) super.pointerDown(e)
  }
}
